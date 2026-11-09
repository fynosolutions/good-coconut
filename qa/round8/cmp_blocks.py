"""Each moved block: screenshot on /specialties/ and on / at the same width; pixel-diff them; list clipped text."""
import http.server, threading, functools, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
ROOT, OUT = sys.argv[1], sys.argv[2]
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
BLOCKS = {'tops': '#tops-section', 'sig': '#signatures', 'water': '#fresh', 'band': '.word-wrap'}
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    for w, h in ((1440, 900), (1180, 800), (390, 844)):
        shots = {}
        for page in ('specialties/', ''):
            pg = b.new_page(viewport=dict(width=w, height=h), reduced_motion='reduce')
            pg.goto(f'http://127.0.0.1:{port}/{page}', wait_until='networkidle')
            for k, sel in BLOCKS.items():
                el = pg.locator(sel); el.scroll_into_view_if_needed(); time.sleep(.8)
                f = f'{OUT}/blk_{k}_{w}_{"home" if not page else "sp"}.png'; el.screenshot(path=f); shots.setdefault(k, []).append(f)
            pg.close()
        for k, (a, c) in shots.items():
            A, C = Image.open(a).convert('RGB'), Image.open(c).convert('RGB')
            if A.size != C.size: print(w, k, 'SIZE DIFFERS', A.size, C.size); continue
            bbox = ImageChops.difference(A, C).point(lambda v: 255 if v > 40 else 0).getbbox()
            print(w, k, 'same' if not bbox else f'differs in {bbox}')
    b.close()
