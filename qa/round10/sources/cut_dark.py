"""Cut studio shots on a black backdrop into clean cut-outs and lift exposure only (no repaint).
usage: cut_dark.py name=path/to/src.JPG ...   → site/public/assets/r5/<name>.webp (alpha), final/<name>.png,
cmp/<name>_pair.jpg (same crop, original vs result), final/metrics.json (detail_match_final, holes, gain)."""
import sys, os, json, cv2, numpy as np
from PIL import Image, ImageOps
from rembg import remove, new_session
B=os.path.expanduser('~/Desktop/fyno-proposals/clients/good-coconut-fidi/brand-visual-1108')
OUT=f'{B}/site/public/assets/r5'; sess=new_session('isnet-general-use')
def fill_holes(b):
    h,w=b.shape; ff=b.copy(); m=np.zeros((h+2,w+2),np.uint8); cv2.floodFill(ff,m,(0,0),1)
    return (b|(1-ff)).astype(np.uint8)
def hp_corr(a,b,m):
    ga=cv2.cvtColor(a,cv2.COLOR_RGB2GRAY).astype(np.float32); gb=cv2.cvtColor(b,cv2.COLOR_RGB2GRAY).astype(np.float32)
    ha=ga-cv2.GaussianBlur(ga,(0,0),3); hb=gb-cv2.GaussianBlur(gb,(0,0),3); w=m>.9
    return float(np.corrcoef(ha[w],hb[w])[0,1])
M=json.load(open('final/metrics.json')) if os.path.exists('final/metrics.json') else {}
for arg in sys.argv[1:]:
    name,path=arg.split('=',1); gmin=0.55
    if ':' in path and path.rsplit(':',1)[1].replace('.','').isdigit(): path,gmin=path.rsplit(':',1); gmin=float(gmin)
    im=ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    if im.width>2000: im=im.resize((2000,round(im.height*2000/im.width)),Image.LANCZOS)
    rgb=np.array(im); H,W=rgb.shape[:2]
    soft=np.array(remove(im,session=sess,only_mask=True)).astype(np.float32)/255
    lum=cv2.cvtColor(rgb,cv2.COLOR_RGB2GRAY); sat=cv2.cvtColor(rgb,cv2.COLOR_RGB2HSV)[...,1]
    # keep dark-but-coloured material (coconut shell, cup base): lit OR saturated; black backdrop is neither
    lit=((lum>18)&(sat>22)&(soft>.15))|((lum>40)&(soft>.05)); lit=cv2.morphologyEx(lit.astype(np.uint8),cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    hard=((soft>.5)|(lit>0)).astype(np.uint8)
    hard=cv2.morphologyEx(hard,cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
    n,lab,st,_=cv2.connectedComponentsWithStats(hard)
    if n>1: hard=(lab==1+np.argmax(st[1:,cv2.CC_STAT_AREA])).astype(np.uint8)
    # fill only small enclosed holes (print, highlights); leave real gaps between objects open
    holes_m=(fill_holes(hard)-hard).astype(np.uint8); nh,lh,sh,_=cv2.connectedComponentsWithStats(holes_m)
    for i in range(1,nh):
        if sh[i,cv2.CC_STAT_AREA]<0.006*hard.sum(): hard[lh==i]=1
    # drop pure-black backdrop pixels that slipped in (between objects), unless deep inside the product
    deep=cv2.erode(hard,np.ones((25,25),np.uint8)); blackpx=((lum<14)&(sat<30)).astype(np.uint8)
    hard[(blackpx>0)&(deep==0)]=0
    n,lab,st,_=cv2.connectedComponentsWithStats(hard)
    if n>1: hard=(lab==1+np.argmax(st[1:,cv2.CC_STAT_AREA])).astype(np.uint8)
    hard=cv2.morphologyEx(hard,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    hard=cv2.erode(hard,np.ones((3,3),np.uint8))
    inner=cv2.erode(hard,np.ones((5,5),np.uint8)).astype(np.float32)
    alpha=np.maximum(inner,np.maximum(soft,0.6)*hard)
    alpha=cv2.GaussianBlur(alpha,(0,0),0.8)*hard+alpha*(1-hard)*0
    # exposure lift: gamma on L so the product's mean L reaches ~150, gain capped; pixels keep their order (no repaint)
    lab_=cv2.cvtColor(rgb,cv2.COLOR_RGB2LAB).astype(np.float32); L=lab_[...,0]
    mean=float(L[hard>0].mean()); target=150.0; g=np.log(target/255)/np.log(max(mean,1)/255); g=float(np.clip(g,gmin,1.0))
    L2=255*np.power(np.clip(L/255,0,1),g); lab_[...,0]=L2
    out=cv2.cvtColor(np.clip(lab_,0,255).astype(np.uint8),cv2.COLOR_LAB2RGB)
    # decontaminate dark fringe: where alpha is soft, un-premultiply toward the product colour
    a3=alpha[...,None]; edge=(alpha>0.02)&(alpha<0.98)
    out=out.astype(np.float32); out[edge]=np.clip(out[edge]/np.maximum(a3[edge],0.35),0,255); out=out.astype(np.uint8)
    ys,xs=np.where(hard>0); y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max(); pad=int(0.04*max(y1-y0,x1-x0))
    y0,y1,x0,x1=max(0,y0-pad),min(H,y1+pad),max(0,x0-pad),min(W,x1+pad)
    rgba=np.dstack([out,(alpha*255).astype(np.uint8)])[y0:y1,x0:x1]
    res=Image.fromarray(rgba,'RGBA'); 
    if res.height>1400: res=res.resize((round(res.width*1400/res.height),1400),Image.LANCZOS)
    res.save(f'final/{name}.png'); res.save(f'{OUT}/{name}.webp','WEBP',quality=86,method=6)
    holes=float(((fill_holes(hard)-hard)>0).sum()/max(hard.sum(),1))
    dm=hp_corr(rgb,out,inner)
    M[name]={'detail_match_final':round(dm,4),'holes':round(holes,5),'gamma':round(g,3),'mean_L_before':round(mean,1),'src':os.path.basename(path)}
    pair=np.hstack([rgb[y0:y1,x0:x1],np.where(hard[y0:y1,x0:x1,None]>0,out[y0:y1,x0:x1],255)])
    Image.fromarray(pair).save(f'cmp/{name}_pair.jpg',quality=85)
    print(name,M[name],res.size)
json.dump(M,open('final/metrics.json','w'),indent=1)
