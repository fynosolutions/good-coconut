import {readFile} from 'node:fs/promises';
import {shops} from './content.mjs';
import {orderLinks} from './order-links.mjs';
const [flushing,wallStreet]=await Promise.all(['menu-content.json','menu-wall-street.json'].map(async file=>JSON.parse(await readFile(new URL(file,import.meta.url),'utf8'))));
const locations={
 flushing:{shop:shops[0],name:shops[0].name,zh:shops[0].zh,address:`${shops[0].address} · ${shops[0].area}`,path:'/menu/',menu:flushing},
 'wall-street':{shop:shops[1],name:shops[1].name,zh:shops[1].zh,address:`${shops[1].address} · ${shops[1].area}`,path:'/menu/wall-street/',menu:wallStreet}
};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imagePath=item=>`/assets/menu/${item.image.local_path.replace(/^images\//,'')}`;
const title=value=>value.replace(/\b[a-z]/g,c=>c.toUpperCase());
const categoryIntro={
 'Top Seller':'A little taste of what everyone loves.',
 'Special Coconut Milk':'Smooth coconut milk. So many ways to love it.',
 'Signature Latte / Tea':'Your daily coffee or tea, with a coconut twist.',
 'Special Coconut Refresher':'Fresh, fruity sips with a coconut water base.',
 'Licious Slush':'A frosty little escape, blended for you.',
 'Coconut Pudding':'Something sweet, by the spoonful.',
 'Handmade Desserts':'Save a little room for something sweet.',
 'Value Set':'A good sip. A warm waffle. Better together.',
 'Egg Waffle':'Pick your flavor. Find your happy bite.',
 'Toppings':'Little extras to make it yours.',
 'Golden Pumpkin':'A cozy touch of golden pumpkin.',
 'Point Redemption':'Use your points for a little coconut happiness. Redeem on Chowbus.'
};
function details(item){
 return `<div class="menu-description">${item.description_en?`<p>${esc(item.description_en)}</p>`:''}${item.description_zh?`<p lang="zh">${esc(item.description_zh)}</p>`:''}</div>${item.option_groups.length?`<div class="menu-options">${item.option_groups.map(g=>`<details><summary>${esc(title(g.name_en))} <span lang="zh">${esc(g.name_zh)}</span></summary><ul>${g.options.map(o=>`<li><span>${esc(o.name_en)}${o.name_zh?` <span lang="zh">${esc(o.name_zh)}</span>`:''}</span>${Number(o.price_adjustment.amount)!==0?`<span class="option-price">+$${Number(o.price_adjustment.amount).toFixed(2)}</span>`:''}</li>`).join('')}</ul></details>`).join('')}</div>`:''}`;
}
function card(item){
 const hasDetails=item.description_en||item.description_zh||item.option_groups.length;
 return `<article class="menu-card" data-product-id="${esc(item.id)}" data-search="${esc([item.name_en,item.name_zh,item.description_en,item.description_zh].join(' ').toLowerCase())}"><div class="menu-card-photo">${item.image.local_path?`<img src="${imagePath(item)}" width="${item.image.width}" height="${item.image.height}" alt="${esc(title(item.name_en))}" loading="lazy" decoding="async">`:`<span class="menu-no-photo" aria-hidden="true">好<br>好<br>椰</span>`}</div><div class="menu-card-copy"><h3>${esc(title(item.name_en))}</h3><p class="menu-name-zh" lang="zh">${esc(item.name_zh)}</p><div class="menu-card-meta">${item.points?`<span class="menu-price">${esc(item.points)} pts</span><span class="menu-size">Listed at ${esc(item.price.display)}</span>`:`<span class="menu-price">${esc(item.price.display)}</span>`}${item.sizes.length?`<span class="menu-size">${esc(item.sizes.join(' / '))}</span>`:''}</div>${hasDetails?`<details class="product-details"><summary aria-label="Details for ${esc(title(item.name_en))}">A closer look <span aria-hidden="true">↗</span></summary><div class="product-detail-content">${details(item)}</div></details>`:''}</div></article>`;
}
export function menuPage(wave, coconut,location='flushing'){
 const shop=locations[location];
 if(!shop)throw new Error(`Unknown menu location: ${location}`);
 const menu=shop.menu,order=menu.source_url;
  return `<section class="menu-hero"><div class="wrap menu-hero-layout"><div class="menu-hero-copy"><span class="place-note">The Good Coconut menu</span><h1>A sip of happy.<br>A spoon of good.</h1><p>Coconut drinks, creamy pudding, and a little<br class="desktop-break"> something sweet. Find your kind of good.</p><a class="text-link" href="#menu-browse">Find your favorite <span aria-hidden="true">↓</span></a></div><div class="menu-hero-art"><img src="/assets/pudding.jpg" width="1200" height="1310" alt="Coconut pudding served in a coconut shell and glass jar" fetchpriority="high"><span class="menu-hero-sticker">Made for<br>good days.</span><div class="menu-hero-doodle">${coconut}</div></div></div>${wave()}</section><section class="menu-introduction wrap" id="menu-browse"><div><h2>Browse the menu.</h2><nav class="menu-location-switch" aria-label="Choose a menu location">${Object.entries(locations).map(([key,s])=>`<a href="${s.path}#menu-browse" ${key===location?'aria-current="page"':''}><span>${s.name}</span><small lang="zh">${s.zh}</small></a>`).join('')}</nav></div><div class="menu-store-note"><span class="menu-location">${shop.name} menu <span lang="zh">${shop.zh}菜单</span></span><p class="menu-store-address">${shop.address}</p><a class="text-link menu-store-order" href="${esc(order)}" target="_blank" rel="noopener noreferrer">Order ${shop.name} ↗</a><p class="fine">Prices in USD. Options may cost extra. Check your shop’s ordering page for current prices.</p></div></section><div class="wrap menu-layout" data-location="${location}"><aside class="menu-sidebar"><div class="menu-search" hidden><label for="menu-search">What sounds good?</label><div class="menu-search-field"><input id="menu-search" type="search" placeholder="Mango, 椰奶, pudding…" autocomplete="off"><button type="button" id="clear-menu-search" aria-label="Clear search" hidden>×</button></div></div><nav class="menu-categories" aria-label="Menu categories">${menu.categories.map((c,i)=>`<a href="#category-${esc(c.id)}" data-category="${esc(c.id)}" ${i===0?'aria-current="location"':''}><span>${esc(c.name_en)}<small lang="zh">${esc(c.name_zh)}</small></span><span class="category-count">${c.items.length}</span></a>`).join('')}</nav></aside><div class="menu-content"><p id="menu-search-status" role="status" aria-live="polite" hidden></p><div class="menu-empty" hidden><h2>No matches just yet.</h2><p>Try a drink name, flavor, or Chinese name.</p><button class="button" id="menu-reset" type="button">Show the full menu</button></div>${menu.categories.map((c,i)=>`<section class="menu-category" id="category-${esc(c.id)}" data-category="${esc(c.id)}" aria-labelledby="category-title-${esc(c.id)}"><div class="menu-category-heading"><div><h2 id="category-title-${esc(c.id)}">${esc(c.name_en)}</h2><p class="category-zh" lang="zh">${esc(c.name_zh)}</p><p>${esc(categoryIntro[c.name_en]||'')}</p></div></div><div class="menu-product-grid">${c.items.map(card).join('')}</div></section>`).join('')}</div></div><section class="menu-outro section">${wave('top-wave')}<div class="wrap"><h2>Found your kind of good?</h2><p>Pick up from your shop, or get it delivered.</p><div class="menu-order-shops">${[shop.shop,...shops.filter(s=>s!==shop.shop)].map(s=>orderLinks(s)).join('')}</div><a class="text-link" href="/online/">Find our shops ↗</a></div></section><dialog class="menu-dialog" aria-labelledby="menu-dialog-title"><button class="menu-dialog-close" type="button" aria-label="Close product details">×</button><div class="menu-dialog-inner"></div></dialog>`;
}
