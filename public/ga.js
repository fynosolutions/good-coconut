/* GA4 for Good Coconut (property "Good Coconut (025)", 2026-11-23 launch audit). Loads only on the live host.
   CSP allows only same-origin scripts, so this is a file, not an inline snippet. */
(()=>{
 const ID='G-V2D265TG8D',HOSTS=['good-coconut-motion-demo.vercel.app'];
 if(!HOSTS.includes(location.hostname))return;
 window.dataLayer=window.dataLayer||[];
 const gtag=window.gtag=function(){dataLayer.push(arguments);};
 gtag('js',new Date());gtag('config',ID);
 const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.append(s);
 const where=el=>el.closest('header,.site-header')?'header':el.closest('footer')?'footer':el.closest('dialog,[role=dialog],.order-panel')?'popup':el.closest('[class*=hero]')?'hero':(el.closest('section[id]')?.id||'page');
 const kind=href=>/^tel:/.test(href)?'call_click':/chowbus\.com/.test(href)?'order_click':/doordash\.com|ubereats\.com|grubhub\.com/.test(href)?'delivery_click':/google\.[a-z.]+\/maps|maps\.google|maps\.apple/.test(href)?'directions_click':null;
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');
  const ev=a&&kind(a.href);
  if(ev){gtag('event',ev,{click_location:where(a),link_url:a.href,shop:/wall-street|fidi|manhattan|51088871|44491|4INN8agf|6464907777|ChIJg6qzaKFbwokRpdfe4txl3FU/i.test(a.href+' '+(a.closest('[data-shop]')?.dataset.shop||''))?'fidi':'flushing',transport_type:'beacon'});return;}
  const b=e.target.closest('a,button');
  if(b&&/order online/i.test(b.textContent||''))gtag('event','order_menu_open',{click_location:where(b)});
 },true);
 document.addEventListener('submit',e=>{if(e.target.id==='contact-form')gtag('event','contact_submit',{click_location:'contact'});},true);
})();
