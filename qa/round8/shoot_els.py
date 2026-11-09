"""Screenshot given selectors at a given width. usage: shoot_els.py ROOT OUT WIDTH sel1 sel2 ..."""
import http.server, threading, functools, sys, time
from playwright.sync_api import sync_playwright
ROOT, OUT, W, SELS = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4:]
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(viewport=dict(width=W, height=900), device_scale_factor=2)
    pg.goto(f'http://127.0.0.1:{port}/', wait_until='domcontentloaded'); time.sleep(1)
    h = pg.evaluate('document.body.scrollHeight')
    for y in range(0, h, 600): pg.evaluate(f'scrollTo(0,{y})'); time.sleep(.1)
    for k, s in enumerate(SELS):
        el = pg.locator(s).first; el.scroll_into_view_if_needed(); time.sleep(1.2)
        el.screenshot(path=f'{OUT}/el{W}_{k}.png'); print(k, s, el.bounding_box())
    b.close()
