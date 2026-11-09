"""Scan the home page at many widths for text that is cut off by its box (overflow hidden / fixed height)."""
import http.server, threading, functools, sys, time, json
from playwright.sync_api import sync_playwright
ROOT, PATH = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else '')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT)); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
JS = """()=>{const out=[];for(const e of document.querySelectorAll('main *')){
 if(e.children.length||!e.textContent.trim())continue;const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden')continue;
 const r=e.getBoundingClientRect();if(!r.width)continue;
 if(e.scrollWidth>e.clientWidth+1&&cs.overflowX!=='visible'&&cs.textOverflow!=='clip')out.push(['self-x',e.textContent.trim().slice(0,30)]);
 let p=e.parentElement;while(p&&p.tagName!=='MAIN'){const s=getComputedStyle(p);if(s.overflow!=='visible'){const q=p.getBoundingClientRect();
   if(r.bottom>q.bottom+1||r.right>q.right+1||r.left<q.left-1||r.top<q.top-1)out.push([p.className.toString().slice(0,30),e.textContent.trim().slice(0,30)]);break}p=p.parentElement}}
 return out}"""
with sync_playwright() as p:
    b = p.chromium.launch()
    res = {}
    for w in [1680, 1440, 1366, 1280, 1180, 1100, 1024, 900, 820, 768, 600, 430, 390, 360]:
        pg = b.new_page(viewport=dict(width=w, height=900), reduced_motion='reduce')
        pg.goto(f'http://127.0.0.1:{port}/{PATH}', wait_until='networkidle'); time.sleep(.5)
        r = pg.evaluate(JS); pg.close()
        for box, txt in r: res.setdefault(f'{txt}  [{box}]', []).append(w)
    for k, v in res.items(): print(k, '→', v)
    if not res: print('NO CLIPPED TEXT')
    b.close()
