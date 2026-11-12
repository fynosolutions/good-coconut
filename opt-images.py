"""Make small WebP copies of the big menu photos (2026-11-12 audit: the menu page cost 24 MB on a phone).
Writes public/assets/opt/<path>-480.webp and -960.webp plus public/assets/opt/manifest.json.
build.mjs reads the manifest and points <img> at the small copies with srcset. Originals stay untouched.
usage: python3 opt-images.py   (then: node build.mjs)
"""
import json, os, re, glob
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(ROOT, 'public')
OUT = os.path.join(PUB, 'assets', 'opt')
MIN_BYTES = 120_000          # only images that are actually heavy
manifest = {}
srcs = set()
for page in glob.glob(os.path.join(PUB, '**', 'index.html'), recursive=True):
    srcs |= set(re.findall(r'<img\b[^>]*?\bsrc="(/assets/[^"?]+\.(?:png|jpe?g|webp))"', open(page, encoding='utf8').read()))
for src in sorted(srcs):
    path = os.path.join(PUB, src.lstrip('/'))
    if src.startswith('/assets/opt/') or not os.path.exists(path) or os.path.getsize(path) < MIN_BYTES:
        continue
    with Image.open(path) as im:
        im.load()
        mode = 'RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB'
        im = im.convert(mode)
        entry = {'w': im.width, 'h': im.height, 'sizes': {}}
        for w in (480, 960):
            if im.width <= w and w == 960 and entry['sizes']:
                break
            tw = min(w, im.width)
            th = round(im.height * tw / im.width)
            rel = re.sub(r'\.(png|jpe?g|webp)$', f'-{w}.webp', src.replace('/assets/', '/assets/opt/', 1))
            dst = os.path.join(PUB, rel.lstrip('/'))
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            im.resize((tw, th), Image.LANCZOS).save(dst, 'WEBP', quality=80, method=6)
            entry['sizes'][str(tw)] = rel
    manifest[src] = entry
with open(os.path.join(OUT, 'manifest.json'), 'w') as f:
    json.dump(manifest, f, indent=1, sort_keys=True)
before = sum(os.path.getsize(os.path.join(PUB, s.lstrip('/'))) for s in manifest)
after = sum(os.path.getsize(os.path.join(PUB, max(e['sizes'].items(), key=lambda kv: int(kv[0]))[1].lstrip('/'))) for e in manifest.values())
print(f'{len(manifest)} images: {before/1048576:.1f} MB -> {after/1048576:.1f} MB (largest copy each)')
