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
 {img:'/assets/r10/new-persimmon-pudding.webp',w:911,h:1300,alt:'Persimmon pudding with fresh persimmon and pearls in a Good Coconut glass jar',top:'fresh persimmon',bottom:'coconut pudding',label:'Persimmon pudding, fresh fruit'},
 {img:'/assets/r10/new-persimmon-puree.webp',w:1022,h:1300,alt:'Persimmon purée over coconut pudding in a Good Coconut glass jar',top:'persimmon purée',bottom:'coconut pudding',label:'Persimmon pudding, purée'}
];
// Product line: the slow strip under the hero. [name, cut-out photo, menu section]
export const lineup=[
 ['Whole Coconut Pudding','/assets/specialties/p-whole-coconut.webp','/menu/#category-156004'],
 ['Mango Pudding','/assets/specialties/p-mango-pudding.webp','/menu/#category-156004'],
 ['Strawberry Pudding','/assets/specialties/p-strawberry-pudding.webp','/menu/#category-156004'],
 ['Dragon Fruit Pudding','/assets/specialties/p-dragonfruit-pudding.webp','/menu/#category-156004'],
 ['Coconut Americano','/assets/specialties/p-americano.webp','/menu/#category-156003'],
 ['Taro Coconut Milk','/assets/specialties/p-taro-milk.webp','/menu/#category-156001'],
 ['Black Sesame Coconut Milk','/assets/specialties/p-sesame-milk.webp','/menu/#category-156001'],
 ['Lime Boba Coconut','/assets/specialties/p-lime-boba.webp','/menu/#category-156002'],
 ['Persimmon Puree Pudding','/assets/specialties/top-persimmon.webp','/menu/#category-156004'],
 ['Freshly Opened Coconut','/assets/specialties/top-fresh-coconut.webp','/menu/#category-156000'],
 ['Coconut Latte','/assets/specialties/top-latte.webp','/menu/#category-156003']
];
