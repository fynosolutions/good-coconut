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
// Round 11 trial: dessert turntable in the hero. One angle is tweened; every product's place is worked out from it.
(function(){
  'use strict';
  var root = document.querySelector('[data-wheel]'); if (!root) return;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(root.querySelectorAll('.wheel-item')), N = items.length, STEP = Math.PI * 2 / N;
  var discs = root.querySelectorAll('.wheel-disc'), discOn = 0, nameEl = root.querySelector('.wheel-name'), ctrlBtns = root.querySelectorAll('.wheel-btn');
  var lead = +root.dataset.lead || 0, pos = lead, target = lead, front = lead, W = 0, raf = 0, from = 0, t0 = 0, dur = 0, ease = null;
  var paused = false, held = false, userPaused = false, timer = 0, turns = 0, seen = true;
  var bez = function(x1, y1, x2, y2){ return function(t){ var u = t, i, x, d; for (i = 0; i < 6; i++) { x = 3*(1-u)*(1-u)*u*x1 + 3*(1-u)*u*u*x2 + u*u*u - t; d = 3*(1-u)*(1-u)*x1 + 6*(1-u)*u*(x2-x1) + 3*u*u*(1-x2); if (Math.abs(d) < 1e-6) break; u -= x / d; } return 3*(1-u)*(1-u)*u*y1 + 3*(1-u)*u*u*y2 + u*u*u; }; };
  var E_AUTO = bez(.65, 0, .35, 1), E_USER = bez(.2, .8, .2, 1);
  var mod = function(n){ return ((n % N) + N) % N; };
  var place = function(){
    var phone = W < 480, rx = W * (phone ? .44 : .46), ry = W * .12, i, th, d, s, el, f, x, badge;
    var fk = +items[mod(Math.round(pos))].dataset.sidek || 1, near = 1 - Math.min(1, Math.abs(pos - Math.round(pos)) * 2);   // a short product in front makes its neighbours step down
    for (i = 0; i < N; i++) {
      el = items[i]; th = (i - pos) * STEP; d = (1 + Math.cos(th)) / 2; x = Math.sin(th) * rx;
      // three stand in view at a time: one big in front, one smaller on each side, never covering each other
      f = Math.pow(d, 5); s = (.46 + .54 * f) * ((+el.dataset.size || 1) * f + (+el.dataset.side || .9) * (1 - f));
      s *= 1 - (1 - fk) * near * (1 - f);
      // the two neighbours stand a fixed gap away from the front product's visible edge, so nothing ever touches
      var k = Math.round(pos), rel = i - k; rel = ((rel % N) + N) % N; if (rel > N / 2) rel -= N;
      if (Math.abs(rel) === 1) { var fr = items[mod(k)], hw = function(e, sc){ var im = e.querySelector('img'), bw = W * .46, bh = bw * 56 / 46; return Math.min(bw, bh * im.width / im.height) * sc / 2; };
        var want = rel * (hw(fr, +fr.dataset.size || 1) + (phone ? 14 : 30) + hw(el, s)); x = x + (want - x) * near; }
      el.style.transform = 'translate(' + x.toFixed(1) + 'px,calc(-100% + ' + (ry * (Math.cos(th) - .42)).toFixed(1) + 'px)) scale(' + s.toFixed(3) + ')';
      var gone = d < .62;
      el.style.opacity = gone ? 0 : Math.min(1, (d - .62) * 6).toFixed(2);
      el.style.pointerEvents = gone ? 'none' : '';
      el.style.zIndex = Math.round(d * 100);
      badge = el.firstElementChild.querySelector('.wheel-new');
      if (badge) { el.classList.toggle('is-right', x > W * .08); badge.style.scale = Math.max(1, .62 / s).toFixed(2); }   // sticker never shrinks below reading size
    }
  };
  var setFront = function(i){
    if (i === front && nameEl.dataset.ready) return; front = i; nameEl.dataset.ready = '1';
    items.forEach(function(el, k){ el.classList.toggle('is-front', k === i); el.querySelector('.wheel-pick').tabIndex = k === i ? 0 : -1; });
    var el = items[i], next = discs[1 - discOn]; next.dataset.tint = el.dataset.tint; next.style.opacity = 1; discs[discOn].style.opacity = 0; discOn = 1 - discOn;
    nameEl.classList.add('is-swap');
    setTimeout(function(){ nameEl.href = el.dataset.href; nameEl.querySelector('strong').textContent = el.dataset.name; nameEl.querySelector('small').textContent = el.dataset.note; nameEl.querySelector('i').className = el.hasAttribute('data-new') ? 'is-new' : ''; nameEl.classList.remove('is-swap'); }, still ? 0 : 170);
  };
  var frame = function(now){
    var t = Math.min(1, (now - t0) / dur); pos = from + (target - from) * ease(t); place();
    if (t < 1) raf = requestAnimationFrame(frame); else { raf = 0; pos = target; place(); root.classList.remove('is-turning'); schedule(); }
  };
  var go = function(to, user){
    target = to; setFront(mod(Math.round(to)));
    if (still) { pos = target; place(); return; }
    from = pos; t0 = performance.now(); var steps = Math.abs(target - from);
    dur = user ? Math.min(1000, 480 + 110 * Math.max(0, steps - 1)) : 760; ease = user ? E_USER : E_AUTO;
    root.classList.add('is-turning'); if (!raf) raf = requestAnimationFrame(frame);
  };
  var schedule = function(){
    clearTimeout(timer); if (still || userPaused || turns >= N * 2) return;
    timer = setTimeout(function(){ if (paused || held || !seen || document.hidden) { schedule(); return; } turns++; go(Math.round(target) + 1, false); }, items[mod(Math.round(target))].hasAttribute('data-new') ? 7000 : 4500);
  };
  var nudge = function(dir){ turns = 0; go(Math.round(target) + dir, true); };
  items.forEach(function(el, i){ el.querySelector('.wheel-pick').addEventListener('click', function(){
    if (moved) return; var cur = mod(Math.round(target)); if (i === cur) { location.href = el.dataset.href; return; }
    var diff = mod(i - cur); if (diff > N / 2) diff -= N; turns = 0; go(Math.round(target) + diff, true); }); });
  root.querySelector('[data-wheel-prev]').addEventListener('click', function(){ nudge(-1); });
  root.querySelector('[data-wheel-next]').addEventListener('click', function(){ nudge(1); });
  var pauseBtn = root.querySelector('[data-wheel-pause]');
  pauseBtn.addEventListener('click', function(){ userPaused = !userPaused; pauseBtn.setAttribute('aria-pressed', String(userPaused)); pauseBtn.setAttribute('aria-label', userPaused ? 'Start the turntable' : 'Pause the turntable'); root.classList.toggle('is-still', userPaused); if (userPaused) clearTimeout(timer); else { turns = 0; schedule(); } });
  root.addEventListener('keydown', function(e){ if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1); } else if (e.key === 'ArrowRight') { e.preventDefault(); nudge(1); } });
  root.addEventListener('pointerenter', function(){ paused = true; }); root.addEventListener('pointerleave', function(){ paused = false; });
  root.addEventListener('focusin', function(){ held = true; }); root.addEventListener('focusout', function(){ held = false; });
  // drag / swipe: one notch per 110px (70px on phones); vertical scrolling stays native
  var sx = 0, sy = 0, down = false, moved = false, base = 0;
  root.addEventListener('pointerdown', function(e){ if (e.target.closest('.wheel-bar')) return; down = true; moved = false; sx = e.clientX; sy = e.clientY; base = target; });
  addEventListener('pointermove', function(e){ if (!down) return; var dx = e.clientX - sx, dy = e.clientY - sy; if (!moved) { if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return; moved = true; clearTimeout(timer); if (raf) { cancelAnimationFrame(raf); raf = 0; } root.classList.add('is-turning'); }
    pos = base - dx / (W < 480 ? 70 : 110); place(); });
  var up = function(){ if (!down) return; down = false; if (!moved) return; turns = 0; target = pos; go(Math.round(pos), true); setTimeout(function(){ moved = false; }, 0); };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
  if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ seen = es[0].isIntersecting; }, {threshold: .25}).observe(root);
  var measure = function(){ W = root.clientWidth; place(); };
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(root); else addEventListener('resize', measure);
  measure(); root.classList.add('is-live'); ctrlBtns.forEach(function(b){ b.hidden = false; }); setFront(lead);
  // entrance: back products slide in along the turntable; the front one only rises (it is the first-screen photo)
  if (!still && items[0].animate) {
    root.querySelector('.wheel-plate').animate([{transform: 'scaleX(.8)', opacity: 0}, {transform: 'none', opacity: 1}], {duration: 520, easing: 'cubic-bezier(.23,1,.32,1)'});
    discs[discOn].animate([{transform: 'scale(.92)', opacity: 0}, {transform: 'none', opacity: 1}], {duration: 520, easing: 'cubic-bezier(.23,1,.32,1)'});
    pos = lead - .45; place(); from = pos; target = lead; t0 = performance.now() + 200; dur = 900; ease = bez(.23, 1, .32, 1);
    items.forEach(function(el, i){ if (i !== lead) el.animate([{opacity: 0}, {opacity: el.style.opacity}], {duration: 600, delay: 150, fill: 'backwards', easing: 'ease-out'}); });
    var badge = items[lead].querySelector('.wheel-new'); if (badge) badge.animate([{scale: .4, rotate: '-40deg', opacity: 0}, {scale: 1, rotate: '-12deg', opacity: 1}], {duration: 420, delay: 750, fill: 'backwards', easing: 'cubic-bezier(.34,1.56,.64,1)'});
    root.classList.add('is-turning'); raf = requestAnimationFrame(function start(now){ if (now < t0) { raf = requestAnimationFrame(start); return; } frame(now); });
  } else schedule();
})();
