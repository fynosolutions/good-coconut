// Original brand photos are used as temporary covers, never as creator endorsements.
// Replace a reel's null src with a local video path and add its real creator credit.
export const galleryReels = [
  {id:'first-bite', title:'Love at first spoon.', note:'the first-bite diaries', poster:'/assets/pudding.jpg', src:null, creator:null},
  {id:'little-stop', title:'Your next little stop.', note:'a little New York moment', poster:'/assets/original-about.jpg', src:null, creator:null},
  {id:'sweet-company', title:'Better with company.', note:'bring your coconut crew', poster:'/assets/original-more.jpg', src:null, creator:null}
];
// Two extra rows continue the wall; all images are existing brand assets.
export const galleryPhotoRows = [
  {id:'sweet-days', note:'little treats, big smiles.', photos:[
    ['strawberry','/assets/gallery-03.webp','Coconut pudding topped with a heart-shaped strawberry','a little strawberry love'],
    ['snowball','/assets/menu/himalyas-snowball-8525c1de.jpg','Himalayas Snowball coconut dessert','sweet little things'],
    ['beach','/assets/hero.webp','Good Coconut drinks and desserts on a tropical beach','mentally, right here.'],
    ['milk','/assets/gallery-06.webp','Good Coconut Hong Kong style coconut drink artwork','sip, smile, repeat.']
  ]},
  {id:'coconut-days', note:'a coconut kind of day.', photos:[
    ['waffles','/assets/gallery-04.webp','Good Coconut drink with colorful waffle treats','the sweetest company'],
    ['refresh','/assets/gallery-02.webp','Lime coconut drink with boba and mint','a fresh little pause'],
    ['bloom','/assets/gallery-05.webp','Good Coconut Himalayas Bloom drinks artwork','something blooming'],
    ['fresh','/assets/menu/freshly-opened-coconut-c094444d.jpg','Fresh coconut water with coconut meat','coconut, always.']
  ]}
];
const escape = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const expand = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
function photo(id,src,alt,caption){return `<figure class="scrap-piece scrap-photo scrap-${id}"><span class="scrap-tape" aria-hidden="true"></span><span class="scrap-tape scrap-tape-corner" aria-hidden="true"></span><a class="scrap-photo-link" href="${src}" data-gallery-photo data-caption="${escape(caption)}" aria-label="Enlarge photo: ${escape(alt)}"><img src="${src}" alt="${escape(alt)}" width="600" height="600" loading="lazy"><span class="scrap-expand">${expand}</span></a><figcaption>${caption}</figcaption></figure>`;}
function reel(item){return `<figure class="scrap-piece scrap-reel scrap-${item.id}"><span class="scrap-tape" aria-hidden="true"></span><div class="scrap-reel-media">${item.src?`<video controls playsinline preload="none" poster="${item.poster}" aria-label="${escape(item.title)}"><source src="${escape(item.src)}"><a href="${escape(item.src)}">Watch video</a></video>`:`<img src="${item.poster}" alt="Brand photo used as a placeholder for a future creator video" width="450" height="800" loading="lazy"><span class="scrap-video-label">Video coming soon</span><span class="scrap-reel-title">${item.title}</span>`}</div><figcaption><span>${item.note}</span>${item.creator?`<small>${escape(item.creator)}</small>`:''}</figcaption></figure>`;}
export function scrapbookGallery(){return `<section id="gallery" class="scrapbook" aria-labelledby="scrapbook-title">
  <div class="scrapbook-inner">
    <div class="scrapbook-heading"><div><h2 id="scrapbook-title">Gallery<span class="scrap-title-dot" aria-hidden="true">.</span></h2><p class="scrap-hand scrap-subtitle">a little collection of good days</p></div><p class="scrapbook-intro">Sweet stops. Coconut cravings. <br>Little moments worth keeping.</p></div>
    <div class="scrapbook-board">
      ${photo('pudding','/assets/pudding.jpg','Coconut pudding in a shell and a fruit-topped jar','a spoonful of happy')}
      ${reel(galleryReels[0])}
      ${photo('shop','/assets/original-about.jpg','Good Coconut shop interior','meet me here!')}
      ${reel(galleryReels[1])}
      ${photo('lime','/assets/lime.jpg','Lime coconut drink with boba and mint','just one more sip…')}
      <div class="scrap-piece scrap-note"><span class="scrap-tape" aria-hidden="true"></span><p class="scrap-hand">Good friends.<br>Good coconut.<br><span>Good memories.</span></p><span class="scrap-note-sign">save a little sweetness.</span></div>
      ${reel(galleryReels[2])}
      <span class="scrap-sticker scrap-sticker-club" aria-hidden="true">COCONUT<br><strong>social club</strong></span>
      <span class="scrap-sticker scrap-sticker-ny" aria-hidden="true">WITH LOVE,<br><strong>NEW YORK</strong></span>
      <img class="scrap-sticker scrap-sticker-coconut" src="/assets/cursor/coconut-hover@2x.png" width="128" height="128" alt="" loading="lazy">
      <span class="scrap-hand scrap-margin-note" aria-hidden="true">camera eats first.</span>
    </div>
    <div class="scrapbook-continuation">
      ${galleryPhotoRows.map(row=>`<div class="scrap-extra-row scrap-row-${row.id}" role="group" aria-label="${escape(row.note)}">${row.photos.map(item=>photo(...item)).join('')}<span class="scrap-row-annotation scrap-hand" aria-hidden="true">${row.note}</span></div>`).join('')}
    </div>
    <div class="scrapbook-footer"><p class="scrap-hand">Your good moment belongs here, too.</p><a class="scrap-social" href="https://www.instagram.com/goodcoconutny/" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>@goodcoconutny <span aria-hidden="true">↗</span></a><div class="scrapbook-actions"><a class="button" href="/online/">Find your coconut stop <span aria-hidden="true">↗</span></a><a class="text-link" href="/menu/#menu-browse">View the menu ↗</a></div></div>
  </div>
  <dialog class="scrap-lightbox" aria-labelledby="scrap-lightbox-caption"><button class="scrap-lightbox-close" type="button" aria-label="Close photo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button><img alt=""><p id="scrap-lightbox-caption" class="scrap-hand"></p></dialog>
</section>`;}
