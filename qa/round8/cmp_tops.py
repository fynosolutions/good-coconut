"""Top three on /specialties/ vs / : screenshot at rest and while hovering the first card, at two widths; report clipped text."""
import http.server, threading, functools, sys, time
from playwright.sync_api import sync_playwright
ROOT, OUT = sys.argv[1], sys.argv[2]
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
CLIP = """(sel)=>[...document.querySelectorAll(sel+' *')].filter(e=>e.children.length===0&&e.textContent.trim()&&getComputedStyle(e).display!=='none').map(e=>{
  const r=e.getBoundingClientRect();let p=e.parentElement,bad=null;
  while(p&&p!==document.body){const cs=getComputedStyle(p);if(cs.overflow!=='visible'||cs.overflowX!=='visible'){const q=p.getBoundingClientRect();if(r.right>q.right+1||r.bottom>q.bottom+1||r.left<q.left-1){bad=e.textContent.trim().slice(0,40)}break}p=p.parentElement}
  return bad}).filter(Boolean)"""
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in (1440, 1180):
        for page in ('specialties/', ''):
            pg = b.new_page(viewport=dict(width=w, height=900))
            pg.goto(f'http://127.0.0.1:{port}/{page}', wait_until='networkidle')
            pg.evaluate("document.querySelector('meta[http-equiv=refresh]')?.remove()")
            el = pg.locator('#tops-section'); el.scroll_into_view_if_needed(); time.sleep(1)
            tag = f'{"home" if not page else "sp"}_{w}'
            el.screenshot(path=f'{OUT}/tops_{tag}.png')
            card = pg.locator('.top').first; bb = card.bounding_box()
            pg.mouse.move(bb['x'] + bb['width'] * .7, bb['y'] + bb['height'] * .4); time.sleep(1)
            el.screenshot(path=f'{OUT}/tops_{tag}_hover.png')
            on = pg.evaluate("document.querySelector('.top').className")
            print(tag, 'hover class:', on, '| clipped:', pg.evaluate(CLIP, '.sp'))
            pg.close()
    b.close()
