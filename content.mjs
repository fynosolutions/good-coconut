// Public site origin, used for schema.org and sitemap URLs. Change it when the real domain goes live.
export const site='https://good-coconut.vercel.app';
export const brand = {email:'goodcoconut01@gmail.com', instagram:'goodcoconutny', red:'goodcoconut', wechat:'goodcoconut01'};
// Store facts checked 2026-11-04 against Google Maps, Apple Maps, NYC address lookup and each ordering page.
// FiDi = the name on its Google profile ("Good Coconut FiDi") and its mall ("Golden Mall FiDi").
// Open questions for the owner: FiDi phone (Google/Apple/Chowbus/Grubhub list 646-490-7777), both stores' hours.
export const shops = [
 {id:'flushing',name:'Flushing',zh:'法拉盛',area:'Flushing, Queens',mall:'Inside Golden Shopping Mall',address:'41-28 Main St, Unit T6',city:'Flushing, NY 11355',street:'41-28 Main St, Unit T6',locality:'Flushing',postal:'11355',lat:40.7572028,lng:-73.8294161,near:'on Main Street, one block from the Flushing–Main St 7 train',phone:'(917) 285-2287',tel:'+19172852287',hours:'Every day, 11:00 am–9:30 pm',menu:'/menu/',order:'https://pos.chowbus.com/online-ordering/store/Good-Coconut/15247',
  delivery:[['Uber Eats','https://www.ubereats.com/store/good-coconut-%E5%A5%BD%E5%A5%BD%E6%A4%B0/4INN8agfUqyRXJOZiEEUjw'],['DoorDash','https://www.doordash.com/store/good-coconut-flushing-31799419/'],['Grubhub','https://www.grubhub.com/restaurant/good-coconut-hao-hao-ye-41-28-main-st-queens/11229160']],
  maps:'https://www.google.com/maps/place/?q=place_id:ChIJ4SGrzKVhwokRDcxRcQg3UAQ',mapQuery:'Good Coconut 好好椰, 41-28 Main St T6, Flushing, NY'},
 {id:'manhattan',name:'FiDi',zh:'华尔街',area:'Financial District, Lower Manhattan',mall:'Inside Golden Mall FiDi, lower level',address:'47 Broadway, Unit C7',city:'New York, NY 10006',street:'47 Broadway, Unit C7',locality:'New York',postal:'10006',lat:40.7065894,lng:-74.0130048,near:'on Broadway near Bowling Green and Wall Street',phone:'(929) 488-8858',tel:'+19294888858',hours:null,menu:'/menu/wall-street/',order:'https://pos.chowbus.com/online-ordering/store/Good-Coconutwall-street/44491',
  delivery:[['DoorDash','https://www.doordash.com/store/good-coconut-fidi-new-york-51088871/'],['Grubhub','https://www.grubhub.com/restaurant/good-coconut-47-broadway-new-york/15173296']],
  maps:'https://www.google.com/maps/place/?q=place_id:ChIJg6qzaKFbwokRpdfe4txl3FU',mapQuery:'Good Coconut FiDi 好好椰, 47 Broadway C7, New York, NY 10006'}
];
// Official /contact-us hours explicitly identify Flushing. The shared footer
// does not independently establish Manhattan hours, so do not infer them.
export const gallery = [
 ['03','Strawberry-topped coconut pudding'],
 ['/assets/menu/himalyas-snowball-8525c1de.jpg','Himalayas Snowball coconut dessert'],
 ['05','Himalayas Bloom drinks poster'],
 ['06','Hong Kong style coconut drink poster'],
 ['/assets/menu/freshly-opened-coconut-c094444d.jpg','Freshly opened coconut with a straw'],
 ['07','Fresh coconut drink poster'],
 ['08','Coconut Snowball poster']
];

// ---- Home hero (2026-11-12) ----
// New items shown in the big hero photo. To change what is "new", edit this list only.
// label = the words in the small NEW tag.
// One item = a still photo; two or more = they take turns every 5 seconds.
export const newItems=[
 {img:'/assets/specialties/top-persimmon.webp',w:552,h:900,alt:'Persimmon Puree Pudding in a Good Coconut glass jar',top:'persimmon purée',bottom:'coconut pudding',label:'Persimmon season'}
];
// Product line: the slow strip under the hero. [name, cut-out photo, menu section]
export const lineup=[];

// ---- Home hero turntable (2026-11-12, round 11) ----
// Products standing on the turntable, in order. The first one marked isNew starts at the front.
// To change the line-up or what is new, edit this list only. Photos must be re-lit cut-outs (see opt-images / r11).
// size: how big the product stands at the front (1 = fills the stand). side: cap for tall cups when they stand at the side.
// Keep the two new items apart in the list so they never stand next to each other.
// tint: colour of the round field behind the front product (peach, mint, sand, sky).
// sideK: for a short, wide product (the whole coconut): how much the two side products shrink while it is in front.
export const heroWheel=[
 {name:'Persimmon Puree Pudding',note:'persimmon purée on coconut pudding',img:'/assets/r11/persimmon-puree.webp',w:601,h:987,size:1,tint:'peach',isNew:true,href:'/menu/#category-156004'},
 {name:'Coconut Latte',note:'coconut milk with espresso',img:'/assets/r11/coconut-latte.webp',w:481,h:1100,size:1,side:.74,tint:'sky',href:'/menu/#category-156003'},
 {name:'Mango Pudding',note:'mango on coconut pudding',img:'/assets/specialties/p-mango-pudding.webp',w:510,h:720,size:.92,tint:'mint',href:'/menu/#category-156004'},
 {name:'Freshly Opened Coconut',note:'opened to order, with a straw',img:'/assets/r11/fresh-coconut.webp',w:666,h:900,size:1.14,sideK:.74,tint:'mint',href:'/menu/#category-156000'},
 {name:'Persimmon Pudding',note:'fresh persimmon on coconut pudding',img:'/assets/r11/persimmon-pudding.webp',w:531,h:760,size:.95,tint:'peach',isNew:true,href:'/menu/#category-156004'},
 {name:'Dragon Fruit Pudding',note:'dragon fruit on coconut pudding',img:'/assets/specialties/p-dragonfruit-pudding.webp',w:496,h:720,size:.92,tint:'mint',href:'/menu/#category-156004'}
];
