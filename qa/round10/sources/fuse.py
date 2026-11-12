"""Product photo = original pixels (shape, text, toppings) + light/colour/background from the GPT Image 2.6 retouch.
usage: python3 fuse.py name [name...]   reads src/<name>.png and gen/<name>.png, writes final/<name>.png and cmp/<name>.jpg
"""
import sys, cv2, numpy as np
from PIL import Image
from rembg import remove, new_session
sess=new_session('isnet-general-use')
def fill_holes(b):
    """b: uint8 0/1. Everything not reachable from the border through background becomes foreground."""
    h,w=b.shape; inv=(1-b).astype(np.uint8); pad=np.pad(inv,1,constant_values=1); ff=pad.copy()
    cv2.floodFill(ff,np.zeros((h+4,w+4),np.uint8),(0,0),2)
    return (ff[1:-1,1:-1]!=2).astype(np.uint8)
def mask_of(rgb):
    """Mask of the product on the retouch's plain white background.
    rembg alone punches holes in white print and half-drops a translucent lime, so union it with
    'not background white', fill enclosed holes, keep the largest piece, keep rembg's soft edge."""
    soft=np.array(remove(Image.fromarray(rgb),session=sess,only_mask=True)).astype(np.float32)/255
    nonwhite=(np.abs(rgb.astype(np.int16)-255).max(axis=2)>14).astype(np.uint8)
    nonwhite=cv2.morphologyEx(nonwhite,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    hard=fill_holes(((soft>.5)|(nonwhite>0)).astype(np.uint8))
    n,lab,st,_=cv2.connectedComponentsWithStats(hard)
    if n>1: hard=(lab==1+np.argmax(st[1:,cv2.CC_STAT_AREA])).astype(np.uint8)
    inner=cv2.erode(hard,np.ones((5,5),np.uint8)).astype(np.float32)
    return np.maximum(inner,soft*hard)
def mblur(img,m,s):
    k=(0,0); num=cv2.GaussianBlur(img*m[...,None],k,s); den=cv2.GaussianBlur(m,k,s)[...,None]
    return num/np.maximum(den,1e-4)
def hp_corr(a,b,m):
    ga=cv2.cvtColor(a,cv2.COLOR_RGB2GRAY).astype(np.float32); gb=cv2.cvtColor(b,cv2.COLOR_RGB2GRAY).astype(np.float32)
    ha=ga-cv2.GaussianBlur(ga,(0,0),3); hb=gb-cv2.GaussianBlur(gb,(0,0),3); w=m>.9
    return float(np.corrcoef(ha[w],hb[w])[0,1])
for name in sys.argv[1:]:
    src=np.array(Image.open(f'src/{name}.png').convert('RGB')); H,W=src.shape[:2]
    gen=np.array(Image.open(f'gen/{name}.png').convert('RGB').resize((W,H),Image.LANCZOS))
    mg=mask_of(gen)
    # register gen onto src (affine ECC on grayscale, product area only)
    s=0.5; g1=cv2.resize(cv2.cvtColor(src,cv2.COLOR_RGB2GRAY),None,fx=s,fy=s).astype(np.float32)/255
    g2=cv2.resize(cv2.cvtColor(gen,cv2.COLOR_RGB2GRAY),None,fx=s,fy=s).astype(np.float32)/255
    im=cv2.resize((mg>.5).astype(np.uint8),None,fx=s,fy=s)
    warp=np.eye(2,3,dtype=np.float32)
    try:
        cc,warp=cv2.findTransformECC(g1,g2,warp,cv2.MOTION_AFFINE,(cv2.TERM_CRITERIA_EPS|cv2.TERM_CRITERIA_COUNT,200,1e-6),im,5)
    except cv2.error as e: cc=float('nan')
    warp[:,2]/=s
    genA=cv2.warpAffine(gen,warp,(W,H),flags=cv2.INTER_LINEAR|cv2.WARP_INVERSE_MAP,borderValue=(255,255,255))
    m=cv2.warpAffine(mg,warp,(W,H),flags=cv2.INTER_LINEAR|cv2.WARP_INVERSE_MAP)
    # light transfer in Lab: keep src detail, take gen's low-frequency light and colour
    Ls=cv2.cvtColor(src,cv2.COLOR_RGB2LAB).astype(np.float32); Lg=cv2.cvtColor(genA,cv2.COLOR_RGB2LAB).astype(np.float32)
    sig=max(W,H)*0.03
    out=Ls+(mblur(Lg,m,sig)-mblur(Ls,m,sig))
    rgb=cv2.cvtColor(np.clip(out,0,255).astype(np.uint8),cv2.COLOR_LAB2RGB)
    # Props lying in front of the product in the source photo (e.g. a mango cube over the jar base):
    # inside the given region, where source and retouch disagree strongly, use the retouch pixels.
    PATCH={}   # lower part of the product box where a loose mango cube sits in front of the jar
    if name in PATCH:
        ys,xs=np.where(m>.5); yb0,yb1=ys.min(),ys.max(); reg=np.zeros((H,W),np.float32); reg[int(yb0+PATCH[name]*(yb1-yb0)):]=1
        rf=rgb.astype(np.float32); yel=(rf[...,0]+rf[...,1])/2-rf[...,2]
        pm=((yel>45)*reg*(m>.3)).astype(np.uint8); pm=cv2.dilate(pm,np.ones((31,31),np.uint8)).astype(np.float32)
        pm=(cv2.GaussianBlur(pm,(0,0),5)*reg)[...,None]
        rgb=(rgb*(1-pm)+genA*pm).astype(np.uint8); print('  patched px',int((pm[...,0]>.5).sum()))
    BASE={'p-dragonfruit-pudding':0.93}   # loose pearls lying against the jar base: take the base from the retouch
    if name in BASE:
        ys,xs=np.where(m>.5); yb0,yb1=ys.min(),ys.max(); y=int(yb0+BASE[name]*(yb1-yb0))
        ramp=np.clip((np.arange(H)-y+20)/40,0,1).astype(np.float32)[:,None,None]
        rgb=(rgb*(1-ramp)+genA*ramp).astype(np.uint8); print('  base from retouch below row',y)
    # alpha: soften edge by 1px, erode the fringe
    a=cv2.erode(m,np.ones((3,3),np.uint8)); a=cv2.GaussianBlur(a,(0,0),0.8)
    rgba=np.dstack([rgb,(np.clip(a,0,1)*255).astype(np.uint8)])
    ys,xs=np.where(a>.05); y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    pad=8; y0=max(0,y0-pad);x0=max(0,x0-pad);y1=min(H,y1+pad);x1=min(W,x1+pad)
    fin=Image.fromarray(rgba[y0:y1,x0:x1]); fin.thumbnail((1000,1000),Image.LANCZOS); fin.save(f'final/{name}.png',optimize=True)
    fid=hp_corr(rgb,src,m); fid_gen=hp_corr(genA,src,m)
    # comparison sheet: source | gpt retouch | final on cream
    cream=Image.new('RGB',(x1-x0,y1-y0),(255,253,245)); cream.paste(Image.fromarray(rgba[y0:y1,x0:x1]),(0,0),Image.fromarray(rgba[y0:y1,x0:x1]))
    tiles=[Image.fromarray(src[y0:y1,x0:x1]),Image.fromarray(genA[y0:y1,x0:x1]),cream]
    th=700; tiles=[t.resize((int(t.width*th/t.height),th)) for t in tiles]
    sh=Image.new('RGB',(sum(t.width for t in tiles)+20,th),'white'); x=0
    for t in tiles: sh.paste(t,(x,0)); x+=t.width+10
    sh.save(f'cmp/{name}.jpg',quality=85)
    import json, os
    mp='final/metrics.json'; M=json.load(open(mp)) if os.path.exists(mp) else {}
    A=(rgba[...,3]>127).astype(np.uint8); holes=float(((fill_holes(A)==1)&(A==0)).sum()/max(1,A.sum()))
    # fair pair for the photo checker: same crop box on both sides, same scale
    L=Image.fromarray(src[y0:y1,x0:x1]); R=cream; th=600
    L=L.resize((int(L.width*th/L.height),th)); R=R.resize((int(R.width*th/R.height),th))
    pr=Image.new('RGB',(L.width+R.width+12,th),'white'); pr.paste(L,(0,0)); pr.paste(R,(L.width+12,0)); pr.save(f'cmp/{name}_pair.jpg',quality=88)
    M[name]={'holes':round(holes,5),'detail_match_final':round(fid,4),'detail_match_gpt_only':round(fid_gen,4),'ecc':round(float(cc),4)}; json.dump(M,open(mp,'w'),indent=1)
    print(f'{name}: ecc={cc:.3f} detail_match_final={fid:.3f} detail_match_gpt={fid_gen:.3f} size={fin.size}')
