"""Bring menu-content.json (Flushing) and menu-wall-street.json (FiDi) up to date with each shop's Chowbus page.
What the Chowbus page shows wins: categories, item order, names, prices, photos. Items no longer listed are dropped.
For an item we already had, its saved details (options, sizes, descriptions) are kept. The seasonal persimmon
category is always placed first (owner request 2026-11-21).
usage: python3 sync-menu.py            (then: python3 opt-images.py && node build.mjs)
       python3 sync-menu.py --dry      (print the differences, write nothing)
"""
import json, re, html, os, sys, datetime, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
DRY = '--dry' in sys.argv
STORES = [('menu-content.json', 'flushing'), ('menu-wall-street.json', 'wall-street')]
UA = {'User-Agent': 'Mozilla/5.0'}
FIRST = re.compile(r'persimmon|seasonal', re.I)


def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()


def text(s):
    return html.unescape(re.sub(r'<!-- -->', '', re.sub(r'<[^>]+>', '', s))).strip()


def live_menu(url):
    page = fetch(url).decode('utf-8', 'ignore')
    flight = page.replace('\\"', '"').replace('\\\\', '\\')
    meals = {}       # (name, price) -> embedded record
    for m in re.finditer(r'\{"id":"(\d+)","name":"((?:[^"\\]|\\.)*)","foreign_name":"((?:[^"\\]|\\.)*)"[^{}]*?"price":"([\d.]+)"[^{}]*?\}', flight):
        blk = m.group(0)
        if '"meal_type"' not in blk:
            continue
        fd = re.search(r'"foreign_description":"((?:[^"\\]|\\.)*)"', blk)
        name = json.loads('"' + m.group(2) + '"')
        meals.setdefault((name.strip().lower(), float(m.group(4))), {'id': m.group(1), 'zh_desc': json.loads('"' + fd.group(1) + '"') if fd else ''})
    cat_ids = {json.loads('"' + n + '"'): i for i, n in re.findall(r'"category_id":"(\d+)","name":"((?:[^"\\]|\\.)*)"', flight)}
    cats = []
    parts = re.split(r'<div class="Desktop_mealWithCategorySection__[^"]*" id="(\d+)"', page)
    for i in range(1, len(parts), 2):
        body = parts[i + 1]
        head = re.search(r'categoryHeader[^>]*>(.*?)</h2>', body, re.S).group(1)
        zh = re.search(r'<span lang="zh">(.*?)</span>', head, re.S)
        name_en = text(re.sub(r'<span lang="zh">.*?</span>', '', head, flags=re.S))
        items = []
        for card in re.split(r'<div class="MealWithCategorySection_mealCardOuter__', body)[1:]:
            n = text(re.search(r'MealCard_mealName[^>]*>(.*?)</h3>', card, re.S).group(1))
            z = re.search(r'MealCard_mealForeignName[^>]*>(.*?)</span></span>', card, re.S)
            d = re.search(r'MealCard_mealDesc[^>]*>(.*?)</span>', card, re.S)
            p = text(re.search(r'MealCard_mealPrice[^>]*>(.*?)</span>', card, re.S).group(1))
            img = re.search(r'<img[^>]*class="MealCard_img[^>]*src="([^"]+)"', card)
            items.append({'name_en': n, 'name_zh': text(z.group(1)) if z else '', 'description_en': text(d.group(1)) if d else '',
                          'price_display': p, 'amount': re.sub(r'[^0-9.]', '', p), 'image_url': html.unescape(img.group(1)) if img else ''})
        cats.append({'section': parts[i], 'name_en': name_en, 'name_zh': text(zh.group(1)) if zh else '', 'items': items, 'category_id': cat_ids.get(name_en)})
    if not cats or not any(c['items'] for c in cats):
        raise SystemExit(f'No menu read from {url}: the page format changed.')
    return cats, meals


for file, key in STORES:
    path = os.path.join(ROOT, file)
    old = json.load(open(path, encoding='utf8'))
    cats, meals = live_menu(old['source_url'])
    old_cat = {c['name_en']: c for c in old['categories']}
    old_item_in = {(c['name_en'], it['name_en'].strip().lower()): it for c in old['categories'] for it in c['items']}
    old_item = {}
    for c in old['categories']:
        for it in c['items']:
            old_item.setdefault(it['name_en'].strip().lower(), it)
    cats.sort(key=lambda c: 0 if FIRST.search(c['name_en']) else 1)   # stable: the seasonal category moves to the front
    out, log = [], []
    for order, c in enumerate(cats):
        prev_cat = old_cat.get(c['name_en'])
        cid = prev_cat['id'] if prev_cat else (c['category_id'] or c['section'])
        if not prev_cat:
            log.append(f'+ category {c["name_en"]} ({len(c["items"])})')
        items = []
        for n, li in enumerate(c['items'], 1):
            k = li['name_en'].strip().lower()
            rec = meals.get((k, float(li['amount'] or 0)), {})
            prev = old_item_in.get((c['name_en'], k)) or (None if prev_cat else old_item.get(k))
            if prev:
                it = json.loads(json.dumps(prev))
                if not it.get('points') and it['price']['amount'] != li['amount'] and abs(float(it['price']['amount']) - float(li['amount'])) > .001:
                    log.append(f'  price {c["name_en"]} / {k}: {it["price"]["amount"]} -> {li["amount"]}')
                if it['name_zh'] != li['name_zh']:
                    log.append(f'  zh {k}: {it["name_zh"]} -> {li["name_zh"]}')
            else:
                it = {'id': rec.get('id') or f'{cid}-{n}', 'description_en': li['description_en'], 'description_zh': rec.get('zh_desc', ''),
                      'image': {'source_url': '', 'local_path': '', 'width': 0, 'height': 0}, 'option_groups': [], 'sizes': []}
                log.append(f'+ item {c["name_en"]} / {k} {li["price_display"]}')
            it.update(order=n, name_en=li['name_en'], name_zh=li['name_zh'])
            if not it.get('points'):     # points items show "100 pts" on Chowbus; keep their saved listing
                it['price'] = {'amount': li['amount'], 'currency': 'USD', 'display': li['price_display']}
            if it['image'].get('own'):   # our own product photo (2026-11-21, owner approved); Chowbus photo changes don't replace it
                pass
            elif li['image_url'] and li['image_url'] != it['image'].get('source_url'):
                rel = f'images/{"wall-street/" if key == "wall-street" else "sync/"}{it["id"]}.jpg'
                dst = os.path.join(ROOT, 'public', 'assets', 'menu', rel.replace('images/', '', 1))
                log.append(f'  photo {k}')
                if not DRY:
                    os.makedirs(os.path.dirname(dst), exist_ok=True)
                    open(dst, 'wb').write(fetch(li['image_url']))
                    with Image.open(dst) as im:
                        w, h = im.size
                    it['image'] = {'source_url': li['image_url'], 'local_path': rel, 'width': w, 'height': h}
            elif not li['image_url'] and it['image'].get('local_path'):
                it['image'] = {'source_url': '', 'local_path': '', 'width': 0, 'height': 0}
            items.append(it)
        out.append({'id': cid, 'order': order + 1, 'name_en': c['name_en'], 'name_zh': c['name_zh'], 'items': items})
    live_names = {(c['name_en'], it['name_en'].strip().lower()) for c in out for it in c['items']}
    for (cn, k) in old_item_in:
        if (cn, k) not in live_names:
            log.append(f'- {cn} / {k}')
    print(f'== {file}: {len(out)} categories, {sum(len(c["items"]) for c in out)} items')
    print('\n'.join(log) or '  no change')
    if not DRY:
        old['categories'] = out
        old['captured_date'] = datetime.date.today().isoformat()
        json.dump(old, open(path, 'w', encoding='utf8'), ensure_ascii=False, indent=2)
        open(path, 'a').write('\n')
