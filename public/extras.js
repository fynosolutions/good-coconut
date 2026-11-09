(()=>{
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const ease='cubic-bezier(.23,1,.32,1)';
const saved={get(){try{return localStorage.getItem('gc-cursor');}catch{return null;}},set(v){try{localStorage.setItem('gc-cursor',v);}catch{}}};

// Signature cursor picker: coconut (椰子蛋), drink (饮品), jar (椰子杯). CSS draws the cursor from html[data-cursor].
// 2026-11-09 (毛): coconut only. The drink and jar cursors are gone; an old saved choice is overwritten.
const kinds=['coconut'];
const firstVisit=!saved.get();
let kind='coconut';
const picks=[...document.querySelectorAll('.signature-picker button')];
function choose(next,button){
 kind=next;root.dataset.cursor=next;saved.set(next);
 picks.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cursor===next)));
 if(button&&!reduce)button.animate([{transform:'scale(.86)'},{transform:'scale(1.08)',offset:.55},{transform:'scale(1)'}],{duration:320,easing:ease});
}
picks.forEach(b=>b.addEventListener('click',()=>choose(b.dataset.cursor,b)));
// The yellow pill says "Click me"; hovering or focusing a treat shows its name there (a tooltip below would sit under the big cursor).
const cta=document.querySelector('.signature-cta');
if(cta){
 const [title,sub]=[cta.querySelector('strong'),cta.querySelector('small')];
 const rest=()=>{title.textContent='Click me';sub.textContent='Change your cursor';};
 picks.forEach(b=>{const show=()=>{title.textContent=b.dataset.en;sub.textContent=b.dataset.zh;};b.addEventListener('pointerenter',show);b.addEventListener('focus',show);b.addEventListener('pointerleave',rest);b.addEventListener('blur',rest);});
}
choose(kind);
// First visit on a computer: the first treat gives one small bounce after the page settles, as an invitation to click.
if(fine&&!reduce&&firstVisit&&picks[0])setTimeout(()=>picks[0].animate([{transform:'translateY(0) rotate(0)'},{transform:'translateY(-6px) rotate(-8deg)',offset:.35},{transform:'translateY(0) rotate(4deg)',offset:.7},{transform:'translateY(0) rotate(0)'}],{duration:700,easing:'cubic-bezier(.23,1,.32,1)'}),1400);
// Phones show the treat at the tap point: load its image now so the first tap is not empty.
if(!fine)kinds.forEach(k=>{const img=new Image();img.src=`/assets/cursor/${k}@2x.png`;});

// Click splash at the pointer tip. The coconut also gets its straw. Phones show the chosen treat at the tap point.
const layer=document.createElement('div');
layer.className='gc-burst-layer';layer.setAttribute('aria-hidden','true');document.body.append(layer);
const spread=[[-22,-16],[0,-28],[22,-16]];
function burst(x,y,touch){
 if(reduce)return;
 const el=document.createElement('div');
 el.className='gc-burst';el.style.transform=`translate(${x}px,${y}px)`;
 el.innerHTML=(touch?`<img class="gc-burst-icon" src="/assets/cursor/${kind}@2x.png" alt="" width="64" height="64">`:'')+(!touch&&kind==='coconut'?'<svg class="gc-straw" viewBox="0 0 30 40"><path d="M4 36 11 9l15-6" fill="none" stroke="#123e40" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>':'')+'<i></i><i></i><i></i>';
 layer.append(el);
 const delay=touch?140:kind==='coconut'?160:0;
 el.querySelectorAll('i').forEach((d,i)=>d.animate([{opacity:1,transform:'translate(0,0) scale(1)'},{opacity:0,transform:`translate(${spread[i][0]}px,${spread[i][1]}px) scale(.5)`}],{duration:460,delay,easing:ease,fill:'both'}));
 const icon=el.querySelector('.gc-burst-icon');
 if(icon)icon.animate([{opacity:0,transform:'translate(-32px,-18px) scale(.7)',easing:ease},{opacity:1,transform:'translate(-32px,-18px) scale(1.06)',offset:.3},{opacity:1,transform:'translate(-32px,-18px) scale(1)',offset:.75},{opacity:0,transform:'translate(-32px,-18px) scale(.96)'}],{duration:820,fill:'both'});
 const straw=el.querySelector('.gc-straw');
 if(straw)straw.animate([{opacity:0,transform:'translate(6px,-18px)',easing:ease},{opacity:1,transform:'translate(0,0)',offset:.25},{opacity:1,offset:.75},{opacity:0}],{duration:760,fill:'both'});
 setTimeout(()=>el.remove(),1000);
}
let down=null;
addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'){if(e.button===0)burst(e.clientX,e.clientY,false);return;}
 down={x:e.clientX,y:e.clientY,t:e.timeStamp};
},{passive:true});
addEventListener('pointercancel',()=>{down=null;},{passive:true});
addEventListener('pointerup',e=>{
 if(!down||e.pointerType==='mouse')return;
 const tap=Math.hypot(e.clientX-down.x,e.clientY-down.y)<10&&e.timeStamp-down.t<500;down=null;
 // Taps on links and buttons stay clean (no splash over what was tapped); taps in open space pop the treat.
 if(tap&&!e.target.closest('a,button,summary,label,input,textarea,select,[role=button]'))burst(e.clientX,e.clientY,true);
},{passive:true});

// Order online: hover (mouse) or tap opens pickup + delivery for both shops. Without JS the button goes to /online/.
const panel=document.getElementById('order-panel');
const toggles=[...document.querySelectorAll('.order-toggle')];
if(panel&&toggles.length){
 panel.dataset.state='closed';panel.hidden=false;
 let closeTimer;
 const isOpen=()=>panel.dataset.state==='open';
 function set(open){
  clearTimeout(closeTimer);
  panel.dataset.state=open?'open':'closed';
  toggles.forEach(t=>t.setAttribute('aria-expanded',String(open)));
  document.body.classList.toggle('order-open',open);
 }
 // A mouse click right after the hover opened it must not close it again; keyboard and touch toggle.
 toggles.forEach(t=>t.addEventListener('click',e=>{e.preventDefault();if(fine&&e.detail>0&&!t.classList.contains('mobile-order'))set(true);else set(!isOpen());}));
 if(fine){
  const hoverZone=[toggles.find(t=>!t.classList.contains('mobile-order')),panel].filter(Boolean);
  hoverZone.forEach(el=>{
   el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')set(true);});
   el.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')closeTimer=setTimeout(()=>set(false),200);});
  });
 }
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen()){set(false);toggles.find(t=>t.offsetParent)?.focus();}});
 document.addEventListener('pointerdown',e=>{if(isOpen()&&!panel.contains(e.target)&&!toggles.some(t=>t.contains(e.target)))set(false);});
 panel.addEventListener('focusout',e=>{if(!panel.contains(e.relatedTarget)&&!toggles.includes(e.relatedTarget))set(false);});
}

// Sip to scroll: the water drops as you scroll; at the end the coconut becomes an Order online button.
const sip=document.createElement('a');
sip.className='sip';sip.href='/online/';sip.setAttribute('aria-label','Order online');
sip.innerHTML='<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="sip-bowl"><path d="M19 42a31 31 0 0 0 62 0Z"/></clipPath></defs><path d="M9 42a41 41 0 0 0 82 0Z" fill="#a47850" stroke="#123e40" stroke-width="3" stroke-linejoin="round"/><path d="M15 42a35 35 0 0 0 70 0Z" fill="#fffdf5"/><g clip-path="url(#sip-bowl)"><path class="sip-water" d="M15 44q6-4 12 0t12 0t12 0t12 0t12 0t12 0V80H15Z" fill="#8fd3e8"/></g><path d="M50 66 62 14l18-6" fill="none" stroke="#123e40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 42h82" stroke="#123e40" stroke-width="3" stroke-linecap="round"/></svg><span class="sip-label" aria-hidden="true">Order<br>online</span>';
const water=sip.querySelector('.sip-water');
let queued=false;
function update(){queued=false;const max=root.scrollHeight-innerHeight,p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;water.style.transform=`translateY(${(p*30).toFixed(2)}px)`;sip.classList.toggle('done',p>.97);sip.classList.toggle('shown',scrollY>innerHeight*.5);}
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
addEventListener('resize',update);
if(!document.body.classList.contains('page-contact')){document.body.append(sip);update();}
})();
