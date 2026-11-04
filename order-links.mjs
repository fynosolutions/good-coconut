// Shared ordering + local-search helpers for both shops (pickup on Chowbus, delivery apps).
import {brand,shops,site} from './content.mjs';
const external='target="_blank" rel="noopener noreferrer"';
const esc=v=>String(v).replaceAll('&','&amp;');
const arrow='<span aria-hidden="true">↗</span>';

// One shop's pickup + delivery links, used in the header panel, the menu outro and the shop cards.
export function orderLinks(s,{heading='h3'}={}){
 return `<div class="order-shop" data-shop="${s.id}"><${heading} class="order-shop-name">${s.name}<span>${s.area}</span></${heading}><a class="order-pickup" href="${esc(s.order)}" ${external}><span><strong>Pickup</strong><small>Order ahead on Chowbus</small></span>${arrow}</a><p class="order-label">Delivery</p><div class="order-delivery">${s.delivery.map(([name,href])=>`<a href="${esc(href)}" ${external}>${name}</a>`).join('')}</div></div>`;
}
export const orderPanel=`<div class="order-panel" id="order-panel" hidden><div class="order-panel-shops">${shops.map(s=>orderLinks(s)).join('')}</div></div>`;

// schema.org data so Google and AI answers can tell the two shops apart.
const brandId=`${site}/#brand`;
export function shopSchema(s){
 return {'@type':'FoodEstablishment','@id':`${site}/online/#${s.id}`,name:`Good Coconut ${s.name}`,alternateName:`好好椰 ${s.zh}`,description:`Coconut drinks, coconut pudding and egg waffles in ${s.area}. ${s.mall}.`,servesCuisine:['Desserts','Coconut drinks','Coconut pudding','Egg waffles'],priceRange:'$',url:`${site}/online/#${s.id}`,menu:`${site}${s.menu}`,hasMap:s.maps,telephone:s.tel,
  address:{'@type':'PostalAddress',streetAddress:s.street,addressLocality:s.locality,addressRegion:'NY',postalCode:s.postal,addressCountry:'US'},
  geo:{'@type':'GeoCoordinates',latitude:s.lat,longitude:s.lng},
  containedInPlace:{'@type':'ShoppingCenter',name:s.mall.replace(/^Inside /,'').replace(/, lower level$/,'')},
  ...(s.hours?{openingHours:'Mo-Su 11:00-21:30'}:{}),
  potentialAction:{'@type':'OrderAction',target:[s.order,...s.delivery.map(d=>d[1])]},
  parentOrganization:{'@id':brandId}};
}
export function schemaTag(list=shops){
 const graph=[{'@type':'Organization','@id':brandId,name:'Good Coconut',alternateName:'好好椰',url:`${site}/`,email:brand.email,logo:`${site}/assets/original-logo.jpg`,sameAs:[`https://www.instagram.com/${brand.instagram}/`]},...list.map(shopSchema)];
 return `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')}</script>`;
}
export const llms=`# Good Coconut 好好椰

Coconut drinks, coconut pudding and egg waffles in New York City. Two shops:

${shops.map(s=>`## Good Coconut ${s.name} (${s.area})
- Address: ${s.mall}, ${s.street}, ${s.city}
- Phone: ${s.phone}
- Menu: ${site}${s.menu}
- Pickup (Chowbus): ${s.order}
${s.delivery.map(([n,h])=>`- Delivery (${n}): ${h}`).join('\n')}
- Google Maps: ${s.maps}`).join('\n\n')}

Locations page: ${site}/online/
Contact: ${brand.email} · Instagram @${brand.instagram}
`;
