if(document.querySelector('#menu-search')){
 const locationNav=document.querySelector('.menu-location-switch');
 const dialog=document.querySelector('.menu-dialog');
 const parts=['.menu-store-note','.menu-layout','.menu-outro'];
 const route=pathname=>pathname.replace(/\/?$/,'/');
 let activeRoute=route(location.pathname),requestId=0;
 let search,categories,links,status,clear,empty,trigger,scheduled=false;
 const notice=document.createElement('p');
 notice.className='menu-switch-status';notice.setAttribute('role','status');
 locationNav.after(notice);

 function snapshot(doc){
  const nodes=parts.map(selector=>doc.querySelector(selector));
  if(nodes.some(node=>!node)||!doc.querySelector('.menu-layout[data-location]'))throw new Error('Incomplete menu');
  return {nodes:nodes.map(node=>node.cloneNode(true)),title:doc.title,description:doc.querySelector('meta[name="description"]')?.content||''};
 }
 // Keep the current menu available for instant return, before search changes it.
 const cache=new Map([[activeRoute,Promise.resolve(snapshot(document))]]);
 function loadMenu(path){
  if(!cache.has(path)){
   const pending=fetch(path,{signal:AbortSignal.timeout(15000)}).then(async response=>{
    if(!response.ok)throw new Error('Menu unavailable');
    return snapshot(new DOMParser().parseFromString(await response.text(),'text/html'));
   }).catch(error=>{cache.delete(path);throw error;});
   cache.set(path,pending);
  }
  return cache.get(path);
 }
 function refreshMenu(){
  search=document.querySelector('#menu-search');
  categories=[...document.querySelectorAll('.menu-category')];
  links=[...document.querySelectorAll('.menu-categories a')];
  status=document.querySelector('#menu-search-status');
  clear=document.querySelector('#clear-menu-search');
  empty=document.querySelector('.menu-empty');
  document.querySelector('.menu-search').hidden=false;
  updateActive();
 }
 function setActive(id){links.forEach(a=>{if(a.dataset.category===id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
 function updateActive(){
  scheduled=false;const visible=categories.filter(c=>!c.hidden);
  const top=innerWidth<=800?215:140;
  const active=visible.filter(c=>c.getBoundingClientRect().top<=top).at(-1)||visible[0];
  setActive(active?.dataset.category);
 }
 function filter(){
  const terms=search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  let count=0;
  for(const category of categories){
   let visible=0;
   const categoryName=category.querySelector('.menu-category-heading').textContent.toLocaleLowerCase();
   for(const card of category.querySelectorAll('.menu-card')){
    const matches=terms.every(term=>(card.dataset.search+' '+categoryName).includes(term));
    card.hidden=!matches;if(matches)visible++;
   }
   category.hidden=!visible;count+=visible;
   const link=links.find(a=>a.dataset.category===category.dataset.category);
   link.hidden=!visible;link.querySelector('.category-count').textContent=visible;
  }
  clear.hidden=!terms.length;status.hidden=!terms.length;
  status.textContent=`${count} ${count===1?'good thing':'good things'} found.`;
  empty.hidden=Boolean(count);updateActive();
 }
 async function switchMenu(url,{push=true,restoreY}={}){
  const id=++requestId,path=route(url.pathname);
  notice.classList.remove('has-error');notice.textContent='';
  locationNav.removeAttribute('aria-busy');
  if(path===activeRoute)return;
  locationNav.setAttribute('aria-busy','true');notice.textContent='Loading menu…';
  try{
   const next=await loadMenu(path);
   if(id!==requestId)return;
   const y=restoreY??scrollY;
   if(push){
    history.replaceState({...history.state,menuScroll:scrollY},'');
    history.pushState({menuScroll:y},'',url.pathname+url.search+url.hash);
   }
   if(dialog.open){trigger=null;dialog.close();}
   parts.forEach((selector,index)=>document.querySelector(selector).replaceWith(next.nodes[index].cloneNode(true)));
   document.title=next.title;
   document.querySelector('meta[name="description"]').content=next.description;
   activeRoute=path;
   locationNav.querySelectorAll('a').forEach(a=>{if(route(a.pathname)===path)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
   refreshMenu();
   // pushState changes the shareable URL without triggering an anchor jump.
   scrollTo({top:y,left:scrollX,behavior:'instant'});
   updateActive();
   notice.textContent=`${document.querySelector('.menu-location').textContent.trim()} loaded.`;
  }catch{
   if(id===requestId){notice.classList.add('has-error');notice.textContent='This menu could not load. Please try selecting the location again.';}
  }finally{if(id===requestId)locationNav.removeAttribute('aria-busy');}
 }
 refreshMenu();
 document.addEventListener('input',event=>{if(event.target===search)filter();});
 document.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateActive);}},{passive:true});
 document.addEventListener('click',event=>{
  const locationLink=event.target.closest('.menu-location-switch a');
  if(locationLink){
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   event.preventDefault();void switchMenu(new URL(locationLink.href));return;
  }
  if(event.target.closest('#clear-menu-search,#menu-reset')){search.value='';filter();search.focus();return;}
  const categoryLink=event.target.closest('.menu-categories a');
  if(categoryLink)setActive(categoryLink.dataset.category);
  const summary=event.target.closest('.product-details>summary');
  if(!summary||typeof dialog.showModal!=='function')return;
  event.preventDefault();trigger=summary;
  const card=summary.closest('.menu-card');
  const inner=dialog.querySelector('.menu-dialog-inner');inner.replaceChildren();
  inner.append(card.querySelector('.menu-card-photo').cloneNode(true));
  const copy=document.createElement('div');copy.className='menu-dialog-copy';
  const title=document.createElement('h2');title.id='menu-dialog-title';title.textContent=card.querySelector('h3').textContent;copy.append(title);
  copy.append(card.querySelector('.menu-name-zh').cloneNode(true),card.querySelector('.menu-card-meta').cloneNode(true));
  copy.append(card.querySelector('.product-detail-content').cloneNode(true));
  const order=document.querySelector('.menu-outro .button').cloneNode(true);copy.append(order);inner.append(copy);
  document.body.classList.add('menu-dialog-open');dialog.showModal();dialog.scrollTop=0;
 });
 dialog.querySelector('.menu-dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
 dialog.addEventListener('close',()=>{document.body.classList.remove('menu-dialog-open');if(trigger?.isConnected)trigger.focus({preventScroll:true});});
 addEventListener('popstate',event=>{
  if(![...locationNav.querySelectorAll('a')].some(a=>route(a.pathname)===route(location.pathname)))return;
  void switchMenu(new URL(location.href),{push:false,restoreY:event.state?.menuScroll});
 });
}
