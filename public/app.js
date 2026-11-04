const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const header=document.querySelector('.site-header'),menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
header.classList.add('enhanced');menu.hidden=false;
function closeMenu(restore=false){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');if(restore)menu.focus();}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);if(open)nav.querySelector('a').focus();});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(!nav.classList.contains('open'))return;if(e.key==='Escape'){closeMenu(true);return;}if(e.key==='Tab'){const items=[document.querySelector('.mobile-order'),menu,...nav.querySelectorAll('a')],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
matchMedia('(max-width:800px)').addEventListener('change',()=>closeMenu());
if('IntersectionObserver' in window&&!reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('ready');observer.observe(el);});}
// Animate on entry without leaving content hidden when JavaScript is unavailable.
if('IntersectionObserver' in window&&'animate' in Element.prototype&&!reduced.matches){
 const active=new Set();
 const groups=document.querySelectorAll('.hero-copy,.story-copy,.section-intro,.product-copy,.gallery-heading,.page-title .wrap,.shop,.visit-note>div,.faq,.contact-aside,.footer-main>div');
 const textEffects={
  'photo-from-right':{duration:1200,frames:[{opacity:0,translate:'100% 0'},{opacity:1,translate:'0 0'}]},
  'fade-in':{duration:1200,frames:[{opacity:0},{opacity:1}]},
  'zoom-in':{duration:1000,frames:[{opacity:0,scale:'.3',offset:0},{opacity:1,scale:'.82',offset:.5},{opacity:1,scale:'1',offset:1}]},
  'soft-zoom':{duration:1000,frames:[{opacity:0,scale:'.82'},{opacity:1,scale:'1'}]},
  'rotate-up-right':{duration:1050,frames:[{opacity:0,transform:'scale(.72) rotate(-12deg)',transformOrigin:'right bottom'},{opacity:1,transform:'scale(1) rotate(0deg)',transformOrigin:'right bottom'}]},
  'bounce-up':{duration:1000,frames:[{opacity:0,translate:'0 65px',offset:0},{opacity:1,translate:'0 -14px',offset:.6},{opacity:1,translate:'0 7px',offset:.75},{opacity:1,translate:'0 -3px',offset:.9},{opacity:1,translate:'0 0',offset:1}]},
  'slide-in':{duration:900,frames:[{opacity:0,translate:'-28px 0',scale:'.94'},{opacity:1,translate:'0 0',scale:'1'}]},
  'fade-up':{duration:950,frames:[{opacity:0,translate:'0 30px'},{opacity:1,translate:'0 0'}]}
 };
 function chooseTextEffect(group,el){
  const heading=el.matches('h1,h2,h3,.shop-heading');
  if(group.matches('.hero-copy'))return heading?'zoom-in':'fade-in';
  if(group.matches('.story-copy'))return heading?'rotate-up-right':'fade-up';
  if(group.matches('.product-copy')){
   if(group.closest('.reverse'))return heading?'rotate-up-right':'soft-zoom';
   if(group.closest('.more'))return heading?'bounce-up':'fade-up';
   return heading?'zoom-in':'slide-in';
  }
  if(group.matches('.section-intro'))return group.closest('.visit')?'rotate-up-right':'bounce-up';
  if(group.matches('.gallery-heading'))return 'zoom-in';
  if(group.matches('.page-title .wrap'))return heading?(group.closest('.contact-title')?'rotate-up-right':'fade-in'):'soft-zoom';
  if(group.matches('.shop'))return heading?'bounce-up':el.matches('address')?'slide-in':'fade-up';
  if(group.matches('.contact-aside,.visit-note>div'))return heading?'zoom-in':'fade-up';
  return heading?'fade-up':'fade-in';
 }
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){
  if(!entry.isIntersecting)continue;
  const el=entry.target;observer.unobserve(el);
  if(reduced.matches)continue;
  const icon=el.dataset.entrance==='icon',brand=el.dataset.entrance==='brand';
  const textEffect=textEffects[el.dataset.textMotion]||textEffects['fade-up'];
  const frames=brand?[
   {opacity:0,transform:'scale(.1) rotate(30deg)',offset:0},
   {transform:'scale(1) rotate(-10deg)',offset:.5},
   {transform:'scale(1) rotate(3deg)',offset:.7},
   {opacity:1,transform:'scale(1) rotate(0deg)',offset:1}
  ]:icon?[
   {opacity:0,translate:'0 64px',scale:'.55',rotate:'-20deg',offset:0},
   {opacity:1,translate:'0 -12px',scale:'1.12',rotate:'8deg',offset:.58},
   {opacity:1,translate:'0 5px',scale:'.96',rotate:'-3deg',offset:.8},
   {opacity:1,translate:'0 0',scale:'1',rotate:'0deg',offset:1}
  ]:textEffect.frames;
  const animation=el.animate(frames,{duration:brand?1500:icon?820:textEffect.duration,delay:Number(el.dataset.entranceDelay)||0,easing:brand?'ease':'cubic-bezier(.215,.61,.355,1)',fill:'backwards'});
  active.add(animation);animation.onfinish=animation.oncancel=()=>active.delete(animation);
 }},{threshold:.08,rootMargin:'0px 0px -8% 0px'});
 for(const group of groups){const items=group.querySelectorAll(':scope > h1,:scope > h2,:scope > h3,:scope > p,:scope > .place-note,:scope > .product-type,:scope > .hero-actions,:scope > .shop-heading,:scope > address,:scope > .phone,:scope > .shop-actions,:scope > .contact-location,:scope > .email-link,:scope > .text-link');
  items.forEach((el,i)=>{
   el.dataset.entrance='text';el.dataset.textMotion=chooseTextEffect(group,el);
   el.dataset.entranceDelay=String(group.matches('.hero-copy')?(el.matches('h1')?100:Math.min(i,3)*180):Math.min(i,3)*150);
   observer.observe(el);
  });
 }
 document.querySelectorAll('.coconut-icon,.sun-icon,.shop-heading .pin').forEach(el=>{el.dataset.entrance='icon';el.dataset.entranceDelay='180';observer.observe(el);});
 document.querySelectorAll('.hero-brand-mark').forEach(el=>{el.dataset.entrance='brand';observer.observe(el);});
 document.querySelectorAll('.hero-photo>img').forEach(el=>{el.dataset.entrance='photo';el.dataset.textMotion='photo-from-right';observer.observe(el);});
 reduced.addEventListener('change',e=>{if(e.matches){observer.disconnect();for(const animation of active)animation.cancel();}});
 document.addEventListener('focusin',e=>{for(const animation of active){if(animation.effect.target.contains(e.target))animation.finish();}});
}
const strip=document.querySelector('.photo-strip');
if(strip){
 const set=strip.querySelector('.photo-set'),track=strip.querySelector('.photo-track');
 const fillTrack=()=>{const needed=Math.ceil(strip.clientWidth/set.offsetWidth)+1;while(track.children.length<needed){const copy=set.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.querySelectorAll('img').forEach(img=>img.alt='');track.append(copy);}};
 fillTrack();new ResizeObserver(fillTrack).observe(strip);
 let hover=false,focus=false,touch=false,visible=false,last=0,frame=0,carry=0,resumeAt=0;
 const tick=time=>{const elapsed=Math.min(time-last,50);last=time;if(!reduced.matches&&!hover&&!focus&&!touch&&time>=resumeAt&&visible&&!document.hidden){carry+=elapsed*.027;const step=Math.floor(carry);carry-=step;strip.scrollLeft+=step;if(strip.scrollLeft>=set.offsetWidth)strip.scrollLeft%=set.offsetWidth;}frame=requestAnimationFrame(tick);};
 strip.addEventListener('mouseover',e=>{hover=Boolean(e.target.closest('figure'));});
 strip.addEventListener('mouseout',e=>{hover=Boolean(e.relatedTarget instanceof Element&&strip.contains(e.relatedTarget)&&e.relatedTarget.closest('figure'));});
 strip.addEventListener('focusin',()=>focus=true);strip.addEventListener('focusout',()=>focus=false);
 strip.addEventListener('pointerdown',e=>{touch=true;if(e.pointerType==='touch')hover=false;});
 const release=()=>{if(touch){touch=false;resumeAt=performance.now()+1400;}};
 window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
 strip.addEventListener('wheel',()=>{resumeAt=performance.now()+1400;},{passive:true});
 new IntersectionObserver(entries=>visible=entries[0].isIntersecting).observe(strip);
 frame=requestAnimationFrame(tick);window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));window.addEventListener('pageshow',e=>{if(e.persisted){last=performance.now();frame=requestAnimationFrame(tick);}});
}
const form=document.querySelector('#contact-form');
if(form){let busy=false,submissionKey=null;form.addEventListener('input',()=>submissionKey=null);form.addEventListener('submit',async e=>{e.preventDefault();if(busy||!form.reportValidity())return;busy=true;const button=form.querySelector('button[type=submit]'),status=document.querySelector('#form-status');button.disabled=true;button.textContent='Sending…';status.textContent='';submissionKey??=crypto.randomUUID();try{const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':submissionKey},body:JSON.stringify(Object.fromEntries(new FormData(form))),signal:AbortSignal.timeout(20000)});const data=await response.json();if(!response.ok)throw new Error(data.message||'Your message could not be sent. Please try again.');status.textContent='Thank you! Your message has been submitted. We’ll reply to the email you provided.';form.reset();submissionKey=null;}catch(error){status.textContent=error.name==='TimeoutError'?'Sending took too long. Please try again, or email goodcoconut01@gmail.com.':error.message==='Failed to fetch'?'Could not connect. Your message is still here; please try again.':error.message;}finally{busy=false;button.disabled=false;button.innerHTML='Send message <span aria-hidden="true">↗</span>';status.focus();}});}

