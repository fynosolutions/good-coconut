// Round 5: reveal-on-scroll for .r5 blocks and the pour-line draw. Transform/opacity only; honours reduced motion.
(function(){
  'use strict';
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.r5');
  var pours = document.querySelectorAll('.pour');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function(e){ e.classList.add('in'); });
    pours.forEach(function(p){ p.classList.add('drawn'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (!en.isIntersecting) return;
      var el = en.target;
      if (el.classList.contains('pour')) el.classList.add('drawn'); else el.classList.add('in');
      io.unobserve(el);
    });
  }, {rootMargin: '0px 0px 12% 0px', threshold: 0.01});
  setTimeout(function(){ items.forEach(function(e){ e.classList.add('in'); }); }, 3500);   // safety net: nothing stays hidden
  items.forEach(function(e, i){ e.style.transitionDelay = Math.min(i % 4, 3) * 60 + 'ms'; io.observe(e); });
  pours.forEach(function(p){
    var path = p.querySelector('path');
    if (path && path.getTotalLength) { var L = path.getTotalLength(); path.style.strokeDasharray = L; path.style.strokeDashoffset = L; }
    io.observe(p);
  });
  // Shop maps: fade the embed in once it has loaded; the address card behind it shows until then.
  document.querySelectorAll('iframe.shop-map').forEach(function(f){ f.addEventListener('load', function(){ f.classList.add('loaded'); }); setTimeout(function(){ f.classList.add('loaded'); }, 6000); });

  // Menu pages: the sidebar follows the category whose heading has passed the top of the viewport (menu.js's visibility vote lags on short categories).
  var catLinks = document.querySelectorAll('.menu-categories a[data-category]');
  var catSections = document.querySelectorAll('.menu-category[data-category]');
  if (catLinks.length && catSections.length) {
    var spyTick = false;
    var spy = function(){
      spyTick = false; var line = 240, cur = null;
      catSections.forEach(function(s){ if (s.getBoundingClientRect().top <= line) cur = s.dataset.category; });
      if (!cur) cur = catSections[0].dataset.category;
      catLinks.forEach(function(a){ if (a.dataset.category === cur) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    };
    var spyLate;
    addEventListener('scroll', function(){ if (!spyTick) { spyTick = true; requestAnimationFrame(spy); } clearTimeout(spyLate); spyLate = setTimeout(spy, 420); }, {passive: true});   // the late pass wins over menu.js's visibility vote
    setTimeout(spy, 300);
  }
  // Phone menu: mark the sidebar when it is stuck so the search box can hide under the header.
  var sb = document.querySelector('.menu-sidebar');
  if (sb) { var onScroll = function(){ sb.classList.toggle('stuck', matchMedia('(max-width: 800px)').matches && sb.getBoundingClientRect().top <= 18); }; addEventListener('scroll', onScroll, {passive: true}); onScroll(); }
  // Phone menu: keep the active category chip in view as the page scrolls.
  var cats = document.querySelector('.menu-categories');
  if (cats && 'MutationObserver' in window) {
    new MutationObserver(function(){ var a = cats.querySelector('a[aria-current]'); if (a && matchMedia('(max-width: 800px)').matches) { var left = a.getBoundingClientRect().left - cats.getBoundingClientRect().left + cats.scrollLeft - 56; if (cats.scrollTo) cats.scrollTo({left: Math.max(0, left), behavior: 'smooth'}); else cats.scrollLeft = Math.max(0, left); } }).observe(cats, {attributes: true, subtree: true, attributeFilter: ['aria-current']});
  }
  // Hero video: play only while visible, pause off-screen (saves battery on phones).
  // 2026-11-12: it starts after the page has loaded, so the first-screen photo is not competing with it,
  // and stays still (poster) for people who ask for reduced motion.
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var v = document.querySelector('.hero5 video');
  if (v && !still) {
    var startHero = function(){
      var vio = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { v.play().catch(function(){}); } else { v.pause(); } }); }, {threshold: 0.2});
      vio.observe(v);
    };
    if (document.readyState === 'complete') startHero(); else addEventListener('load', startHero);
  }
  // Videos further down load only when they come near the screen.
  var late = document.querySelectorAll('video[data-src]');
  if (late.length && 'IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function(es){ es.forEach(function(e){
      var el = e.target;
      if (e.isIntersecting) {
        if (el.dataset.src) { el.src = el.dataset.src; el.removeAttribute('data-src'); el.preload = 'auto'; }
        if (!still && el.hasAttribute('data-autoplay')) el.play().catch(function(){});
      } else if (!el.dataset.src) { el.pause(); }
    }); }, {rootMargin: '300px 0px'});
    late.forEach(function(el){ lio.observe(el); });
  }
})();
// Runs on its own so the dots still work when the reveal code above stops early for reduced motion.
(function(){
  'use strict';
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // New items in the hero take turns (2026-11-12). The list lives in content.mjs -> newItems.
  var rot = document.querySelector('[data-new-rotator]');
  if (rot) {
    var slides = rot.querySelectorAll('.hero5-slide'), dots = document.querySelectorAll('.hero5-dots button'), at = 0, timer = null, held = false;
    var show = function(n){ at = (n + slides.length) % slides.length;
      slides.forEach(function(el, i){ el.classList.toggle('is-on', i === at); if (i === at) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', 'true'); });
      dots.forEach(function(d, i){ d.setAttribute('aria-pressed', String(i === at)); });
      var nm = document.querySelector('.hero5-new-name'); if (nm && slides[at].dataset.label) nm.textContent = slides[at].dataset.label; };
    var tick = function(){ if (!held && !document.hidden) show(at + 1); };
    dots.forEach(function(d, i){ d.addEventListener('click', function(){ show(i); if (timer) { clearInterval(timer); timer = setInterval(tick, 5000); } }); });
    if (slides.length > 1 && !still) {
      timer = setInterval(tick, 5000);
      var stage = rot.parentElement;
      ['pointerenter', 'focusin', 'touchstart'].forEach(function(ev){ stage.addEventListener(ev, function(){ held = true; }, {passive: true}); });
      ['pointerleave', 'focusout', 'touchend'].forEach(function(ev){ stage.addEventListener(ev, function(){ held = false; }, {passive: true}); });
    }
  }
})();
