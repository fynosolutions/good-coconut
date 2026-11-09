// Shared ordering + local-search helpers for both shops (pickup on Chowbus, delivery apps).
import {brand,shops,site} from './content.mjs';
const external='target="_blank" rel="noopener noreferrer"';
const esc=v=>String(v).replaceAll('&','&amp;');
const arrow='<span aria-hidden="true">↗</span>';
// Delivery app logos from Simple Icons 13.21.0 (CC0), drawn in each brand's own colour.
const brandIcons={"Uber Eats": ["#06C167", "M0 2.8645v4.9972c0 1.8834 1.3315 3.1297 3.0835 3.1297a2.9652 2.9652 0 0 0 2.1502-.876v.7425H6.445V2.8645H5.223v4.9339c0 1.2642-.8696 2.1198-1.9954 2.122-1.1386-.0023-1.997-.834-1.997-2.122V2.8645zm7.3625 0v7.9934h1.163v-.7318a2.9915 2.9915 0 0 0 2.1177.876c1.714.048 3.1295-1.3283 3.1295-3.0429s-1.4155-3.091-3.1295-3.0429a2.9674 2.9674 0 0 0-2.107.876V2.8645zm9.8857 2.0561c-1.6752-.0074-3.0369 1.3492-3.0356 3.0245 0 1.7366 1.3732 3.0373 3.1537 3.0373a3.123 3.123 0 0 0 2.5578-1.2438l-.8495-.6177a2.0498 2.0498 0 0 1-1.7083.8585c-.9763.0126-1.8147-.6915-1.971-1.6553h4.818v-.379c0-1.734-1.254-3.0238-2.9638-3.0245zm6.1632.0667a1.5943 1.5943 0 0 0-1.376.7657v-.7186h-1.163v5.8235h1.1741V7.5465c0-.9023.5581-1.4847 1.3268-1.4847h.4949V4.9886c-.1576.0013-.3186-.0009-.4568-.0013zm-6.2034.944a1.844 1.844 0 0 1 1.8337 1.486H15.424a1.844 1.844 0 0 1 1.784-1.486zm-6.6589.0056c1.1223-.0084 2.0365.8992 2.0364 2.0215-.0026 1.1203-.914 2.0258-2.0343 2.021a2.0151 2.0151 0 0 1-1.4159-.5987A2.0152 2.0152 0 0 1 8.55 7.9592a2.0152 2.0152 0 0 1 .5838-1.422 2.0152 2.0152 0 0 1 1.4153-.6003zM0 12.9864v7.9716h5.7222v-1.3666H1.5458v-1.971h4.0647v-1.314H1.5458v-1.9556h4.1764v-1.3644zm14.5608.4097v1.6861h-1.1519v1.338h1.1545v3.143c0 .7927.5712 1.4209 1.6005 1.4209h1.6425L17.8 19.646h-1.1412c-.3482 0-.5714-.1509-.5714-.464v-2.7683H17.8v-1.3316h-1.7062v-1.686zm-5.2974 1.5275c-1.7348-.0103-3.141 1.4035-3.1214 3.1382.0196 1.7346 1.4575 3.1163 3.1915 3.0668a2.9915 2.9915 0 0 0 1.912-.6655v.532h1.5175v-5.9129h-1.509v.5257a3.0047 3.0047 0 0 0-1.9205-.6835c-.0244-.0007-.0492-.0006-.0701-.0008zm11.771.0077c-1.5855 0-2.7002.6437-2.7002 1.8854 0 .8607.6132 1.4213 1.936 1.695l1.4478.3286c.5694.1095.7224.2585.7224.4906 0 .3701-.438.6022-1.1279.6022-.876 0-1.3774-.1907-1.5723-.8477h-1.533c.219 1.2307 1.1563 2.05 3.0484 2.05h.0022c1.752 0 2.7422-.819 2.7422-1.9534 0-.8059-.5847-1.4084-1.8089-1.6668l-1.2943-.2605c-.7511-.1358-.988-.2738-.988-.5454 0-.357.3616-.5757 1.0295-.5757.7227 0 1.2527.1925 1.406.8473h1.5175c-.0854-1.2286-.9899-2.0497-2.8273-2.0497zM9.467 16.1815c1.0092.0096 1.8188.8369 1.8067 1.8461.0014 1.0046-.8198 1.816-1.8243 1.8025-1.0075-.0048-1.8203-.8256-1.8155-1.833.0048-1.0076.8255-1.8204 1.833-1.8156z", "-0.3 2.56 24.6 18.87", 31.3, 24.0], "DoorDash": ["#FF3008", "M23.071 8.409a6.09 6.09 0 00-5.396-3.228H.584A.589.589 0 00.17 6.184L3.894 9.93a1.752 1.752 0 001.242.516h12.049a1.554 1.554 0 11.031 3.108H8.91a.589.589 0 00-.415 1.003l3.725 3.747a1.75 1.75 0 001.242.516h3.757c4.887 0 8.584-5.225 5.852-10.413", "-0.3 4.88 24.6 14.24", 31.1, 18.0], "Grubhub": ["#F63440", "M16.708 9.556h-.84c-.048 0-.072.048-.072.072v1.828h-.84V9.628c0-.048-.048-.072-.072-.072h-.84c-.048 0-.072.048-.072.072v4.692c0 .048.048.072.072.072h.84c.048 0 .072-.048.072-.072v-1.876h.84v1.876c0 .048.048.072.072.072h.84c.048 0 .072-.048.072-.072V9.628c0-.024-.024-.072-.072-.072m-7.08 0h-.84c-.048 0-.072.024-.072.072v3.324a.61.61 0 0 1-.12.384c-.072.096-.168.12-.288.12a.405.405 0 0 1-.288-.12.61.61 0 0 1-.12-.384V9.628c0-.048-.048-.072-.072-.072h-.84c-.048 0-.072.024-.072.072v3.348c0 .432.096.84.36 1.108.264.264.624.408 1.036.408.432 0 .796-.144 1.036-.408.264-.264.36-.648.36-1.108V9.628c-.004-.024-.028-.072-.08-.072m-8.232-.072c-.432 0-.796.144-1.036.408C.096 10.156 0 10.54 0 11v2c0 .432.096.84.36 1.108.264.264.624.408 1.036.408.432 0 .796-.144 1.036-.408.264-.264.36-.648.36-1.108v-1.104a.102.102 0 0 0-.096-.096H1.468a.102.102 0 0 0-.096.096v.82c0 .048.048.096.096.096h.316v.192a.676.676 0 0 1-.12.408c-.072.096-.168.12-.288.12a.405.405 0 0 1-.288-.12.69.69 0 0 1-.12-.408v-1.976c0-.168.048-.316.12-.408.072-.096.168-.12.288-.12.116 0 .216.048.288.12.072.096.12.24.12.408v.192c0 .048.048.072.072.072h.84c.048 0 .072-.024.072-.072v-.192c0-.432-.096-.84-.36-1.108-.216-.292-.604-.436-1.012-.436m10.832 3.828c-.072.096-.168.12-.316.12h-.48v-1.016h.48c.12 0 .216.048.288.12.079.104.121.23.12.36.008.2-.016.316-.092.416zm-.364-2.768c.12 0 .216.024.288.12.072.072.096.192.096.34s-.024.264-.096.36a.385.385 0 0 1-.264.12h-.432v-.94h.408zm.964 1.372c.144-.144.408-.48.408-.916 0-.508-.192-.82-.34-.988-.264-.288-.624-.432-1.036-.432h-1.316c-.048 0-.072.048-.072.072v4.696c0 .048.048.072.072.072h1.396c.432 0 .84-.168 1.108-.508.144-.192.316-.508.316-.988-.028-.576-.388-.916-.536-1.008zm-7.652-.46c-.072.096-.192.144-.34.144h-.408v-1.056h.408c.144 0 .264.048.34.144.096.096.12.216.12.384s-.02.288-.12.384zm.532.868c.096-.072.168-.12.24-.216.168-.192.384-.532.384-1.06 0-.508-.192-.84-.384-1.036-.24-.288-.6-.432-1.012-.456H3.54c-.048 0-.072.048-.072.072v4.692c0 .048.048.072.072.072h.84c.048 0 .072-.048.072-.072v-1.736h.288l.532 1.78c0 .024.048.048.072.048h.888c.024 0 .048-.024.072-.024s.024-.048.024-.072l-.62-1.992zm17.136.988c-.072.096-.168.12-.316.12h-.48v-1.016h.48c.12 0 .216.048.288.12.079.104.121.23.12.36.028.2-.016.316-.092.416zm-.34-2.768c.12 0 .216.024.288.12.072.072.096.192.096.34s-.024.264-.096.36a.385.385 0 0 1-.264.12h-.432v-.94h.408zm.964 1.372c.144-.144.408-.48.408-.916 0-.508-.192-.82-.34-.988-.264-.288-.624-.432-1.036-.432h-1.328c-.048 0-.072.048-.072.072v4.696c0 .048.048.072.072.072h1.404c.432 0 .84-.168 1.108-.508.144-.192.316-.508.316-.988a1.442 1.442 0 0 0-.532-1.008zm-3.224-2.36h-.84c-.048 0-.072.024-.072.072v3.324a.61.61 0 0 1-.12.384c-.072.096-.168.12-.288.12a.405.405 0 0 1-.288-.12.61.61 0 0 1-.12-.384V9.628c0-.048-.048-.072-.072-.072H17.6c-.048 0-.072.024-.072.072v3.348c0 .432.096.84.36 1.108.264.264.624.408 1.036.408.432 0 .796-.144 1.036-.408.264-.264.36-.648.36-1.108V9.628c.024-.024-.024-.072-.076-.072", "-0.3 9.18 24.6 5.63", 48.0, 11.0]};
// One delivery app as a logo button; the accessible name says which shop and app.
export const deliveryIcon=(s,[name,href])=>{const [hex,d,box,w,h]=brandIcons[name];return `<a class="delivery-icon" href="${esc(href)}" ${external} aria-label="${s.name} delivery on ${name}" title="${name}"><svg viewBox="${box}" width="${w}" height="${h}" aria-hidden="true"><path fill="${hex}" d="${d}"/></svg></a>`;};

// One shop's pickup + delivery links, used in the header panel, the menu outro and the shop cards.
export function orderLinks(s,{heading='h3'}={}){
 return `<div class="order-shop" data-shop="${s.id}"><${heading} class="order-shop-name">${s.name}<span>${s.area}</span></${heading}><a class="order-pickup" href="${esc(s.order)}" ${external}><span><strong>Pickup</strong><small>Order ahead on Chowbus</small></span>${arrow}</a><p class="order-label">Delivery</p><div class="order-delivery">${s.delivery.map(d=>deliveryIcon(s,d)).join('')}</div></div>`;
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

Signature drinks and desserts: ${site}/specialties/
Locations page: ${site}/online/
Contact: ${brand.email} · Instagram @${brand.instagram}
`;
