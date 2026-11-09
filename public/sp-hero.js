(() => {
  const word = document.getElementById('word'); if (!word) return; const wrap = word.parentElement;
  const OUT = 'cubic-bezier(.23,1,.32,1)', MOVE = 'cubic-bezier(.77,0,.175,1)';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const o2 = document.getElementById('o2'), video = o2.querySelector('video');
  let anims = [];
  const narrow = matchMedia('(max-width: 820px)');
  const fit = () => { word.style.transform = `scale(${wrap.clientWidth / (narrow.matches ? 1030 : 1600)})`; };
  new ResizeObserver(fit).observe(wrap); fit();

  function play() {
    anims.forEach(a => a.cancel()); anims = [];
    word.querySelectorAll('.l-c1,.l-o1,.l-c2,.l-n,.l-u,.l-t').forEach((el, i) => {
      anims.push(el.animate([{ opacity: 0, transform: 'translateY(28px) scale(.95)' }, { opacity: 1, transform: 'none' }],
        { delay: i * 70, duration: 620, easing: OUT, fill: 'both' }));
    });
    // The coconut rolls into its O.
    anims.push(word.querySelector('.l-o1 img').animate(
      [{ transform: 'translateY(-70px) rotate(-150deg)' }, { transform: 'none' }],
      { delay: 70, duration: 900, easing: MOVE, fill: 'both' }));
    // The video O opens like a lens, then plays.
    const lens = o2.animate([{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(50% at 50% 50%)' }],
      { delay: 260, duration: 760, easing: OUT, fill: 'both' });
    anims.push(lens);
    lens.finished.then(() => { if (reduce.matches) return; video.play().catch(() => {});
      o2.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 700, easing: 'cubic-bezier(.77,0,.175,1)' }); }).catch(() => {});
    // The street drawing draws itself along the word's baseline, starting with the letters.
    document.querySelectorAll(narrow.matches ? '.street .ln' : '.lines .ln').forEach((p, i) => {
      const len = p.getTotalLength(); p.style.strokeDasharray = len;
      anims.push(p.animate([{ strokeDashoffset: len, opacity: 0 }, { offset: .03, opacity: 1 }, { strokeDashoffset: 0, opacity: 1 }],
        { delay: 400 + i * 90, duration: 1000, easing: MOVE, fill: 'both' }));
    });
    if (reduce.matches) anims.forEach(a => a.finish());
  }

  // Tap the video O to see it larger; tap again or press Escape to put it back.
  let layer = null;
  const closeLayer = () => { if (!layer) return; const l = layer; layer = null; l.classList.remove('show'); setTimeout(() => l.remove(), 220); o2.setAttribute('aria-pressed', 'false'); };
  const openLayer = () => {   // phones: the enlarged video sits in its own centred layer so nothing is clipped
    layer = document.createElement('div'); layer.className = 'video-layer'; layer.setAttribute('role', 'dialog'); layer.setAttribute('aria-label', 'Fresh coconut video');
    layer.innerHTML = '<video src="' + video.currentSrc + '" muted loop playsinline autoplay></video><button type="button">Close</button>';
    layer.addEventListener('click', closeLayer); document.body.appendChild(layer);
    requestAnimationFrame(() => layer && layer.classList.add('show')); layer.querySelector('video').play().catch(() => {}); o2.setAttribute('aria-pressed', 'true');
  };
  const toggle = (on) => {
    if (matchMedia('(max-width: 820px)').matches) { on ? openLayer() : closeLayer(); return; }
    o2.classList.toggle('big', on); o2.setAttribute('aria-pressed', on); if (on) video.play().catch(() => {});
  };
  o2.setAttribute('aria-pressed', 'false');
  o2.addEventListener('click', () => toggle(layer ? false : !o2.classList.contains('big')));
  addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { anims.forEach(a => a.playState === 'paused' && a.play()); if (!reduce.matches && video.currentTime > 0) video.play().catch(() => {}); }
    else { anims.forEach(a => a.playState === 'running' && a.pause()); video.pause(); }
  }, { threshold: .15 }).observe(wrap);
  play();
})();
