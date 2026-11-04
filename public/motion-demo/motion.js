(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease='cubic-bezier(.23,1,.32,1)';

// B · sip to scroll: the coconut water drops as the page scrolls; at the end it becomes an Order online button.
const sip=document.createElement('a');
sip.className='sip';sip.href='/online/';sip.setAttribute('aria-label','Order online');
sip.innerHTML='<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="sip-bowl"><path d="M19 42a31 31 0 0 0 62 0Z"/></clipPath></defs><path d="M9 42a41 41 0 0 0 82 0Z" fill="#a47850" stroke="#123e40" stroke-width="3" stroke-linejoin="round"/><path d="M15 42a35 35 0 0 0 70 0Z" fill="#fffdf5"/><g clip-path="url(#sip-bowl)"><path class="sip-water" d="M15 44q6-4 12 0t12 0t12 0t12 0t12 0t12 0V80H15Z" fill="#8fd3e8"/></g><path d="M50 66 62 14l18-6" fill="none" stroke="#123e40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 42h82" stroke="#123e40" stroke-width="3" stroke-linecap="round"/></svg><span class="sip-label" aria-hidden="true">Order<br>online</span>';
const water=sip.querySelector('.sip-water');
let queued=false;
function update(){queued=false;const max=document.documentElement.scrollHeight-innerHeight,p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;water.style.transform=`translateY(${(p*30).toFixed(2)}px)`;sip.classList.toggle('done',p>.97);}
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
addEventListener('resize',update);
document.body.append(sip);update();

// C · coconut cursor: mouse becomes the site's coconut; it tilts over links; a click drops a straw in.
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const cc=document.createElement('div');
cc.className='cc';cc.setAttribute('aria-hidden','true');
cc.innerHTML='<svg viewBox="0 0 100 100"><path d="M18 46c0 48 67 56 69 0" fill="#a47850" stroke="#123e40" stroke-width="4"/><ellipse cx="52" cy="44" rx="36" ry="16" fill="#fffdf5" stroke="#123e40" stroke-width="4"/><ellipse cx="52" cy="44" rx="25" ry="10" fill="#bfe6f2"/><path class="cc-straw" d="m54 44 9-31 20-7" fill="none" stroke="#123e40" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle class="cc-drop" cx="52" cy="40" r="4.5" fill="#8fd3e8"/><circle class="cc-drop" cx="52" cy="40" r="4.5" fill="#8fd3e8"/><circle class="cc-drop" cx="52" cy="40" r="4.5" fill="#8fd3e8"/></svg>';
const straw=cc.querySelector('.cc-straw'),drops=cc.querySelectorAll('.cc-drop');
const spread=[[-26,-16],[2,-30],[28,-14]];
document.body.append(cc);
function moveTo(x,y){cc.style.transform=`translate3d(${x}px,${y}px,0)`;}
function sipNow(){
 straw.animate(reduce?[{opacity:0},{opacity:1,offset:.2},{opacity:1,offset:.8},{opacity:0}]:[{opacity:0,transform:'translate(14px,-40px)',easing:ease},{opacity:1,transform:'translate(0,0)',offset:.27},{opacity:1,transform:'translate(0,0)',offset:.8},{opacity:0,transform:'translate(0,0)'}],{duration:900,fill:'both'});
 if(reduce)return;
 drops.forEach((d,i)=>d.animate([{opacity:1,transform:'translate(0,0)'},{opacity:0,transform:`translate(${spread[i][0]}px,${spread[i][1]}px)`}],{duration:420,delay:200,easing:ease,fill:'both'}));
}
if(fine){
 document.documentElement.classList.add('cc-mouse');
 addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;moveTo(e.clientX,e.clientY);cc.classList.add('on');},{passive:true});
 addEventListener('pointerover',e=>cc.classList.toggle('hot',!!e.target.closest('a,button,summary,label,[role="button"]')),{passive:true});
 document.documentElement.addEventListener('mouseleave',()=>cc.classList.remove('on'));
 addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')sipNow();},{passive:true});
}
// Touch screens have no cursor: a tap shows the coconut and straw once at the tap point.
let lastType='mouse',hideTimer;
addEventListener('pointerdown',e=>{lastType=e.pointerType;},{passive:true});
addEventListener('click',e=>{if(lastType==='mouse'||!e.clientX&&!e.clientY)return;moveTo(e.clientX,e.clientY);cc.classList.add('on');sipNow();clearTimeout(hideTimer);hideTimer=setTimeout(()=>cc.classList.remove('on'),900);});
})();
