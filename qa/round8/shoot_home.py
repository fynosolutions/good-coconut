"""Full home page, desktop + phone: scroll through (to fire reveals), full-page shot cut into parts, check errors and the gallery video."""
import http.server, threading, functools, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT, OUT = sys.argv[1], sys.argv[2]
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass
H = functools.partial(Q, directory=ROOT)
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
Image.MAX_IMAGE_PIXELS = None
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
    for name, vp in [('home_desk', dict(width=1440, height=900)), ('home_phone', dict(width=390, height=844))]:
        pg = b.new_page(viewport=vp); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.goto(f'http://127.0.0.1:{port}/', wait_until='networkidle')
        hgt = pg.evaluate('document.body.scrollHeight')
        for y in range(0, hgt, 400): pg.evaluate(f'scrollTo(0,{y})'); time.sleep(.12)
        time.sleep(2.5)
        v = pg.evaluate("(()=>{const v=document.querySelector('.wall video');return v&&{ready:v.readyState,paused:v.paused,w:v.videoWidth,box:v.getBoundingClientRect().width|0}})()")
        vh = vp['height']; shots = []
        for k, y in enumerate(range(0, hgt, vh)):
            pg.evaluate(f'scrollTo(0,{y})'); time.sleep(1.4); f = f'{OUT}/{name}_v{k:02d}.png'; pg.screenshot(path=f); shots.append(f)
        # stitch every 3 viewports into one part (desktop) / 4 (phone) for review
        n = 3 if 'desk' in name else 4; Ht = hgt
        for j in range(0, len(shots), n):
            ims = [Image.open(f) for f in shots[j:j + n]]; W = ims[0].width
            st = Image.new('RGB', (W, sum(i.height for i in ims)), 'white'); yy = 0
            for i in ims: st.paste(i, (0, yy)); yy += i.height
            st.save(f'{OUT}/{name}_{j // n}.png')
        print(name, 'height', Ht, 'parts', (len(shots)+n-1)//n, 'video', v, 'errors', errs)
    b.close()
