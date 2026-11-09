/* Top three: the product turns toward the pointer in 3D; colour, disc and line icons arrive on hover.
   Phones: the card snapped to the centre of the carousel switches on, and dragging a finger tilts the product. */
(() => {
  const cards = [...document.querySelectorAll('.top')]; if (!cards.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const MAXY = 24, MAXX = 12;

  const swing = card => {   // a short turn on arrival, like the can spinning in to face you
    if (reduce.matches) return;
    card.querySelector('.top-prod').animate(
      [{ transform: 'rotateY(-38deg) rotateX(6deg) scale(.96)' }, { transform: 'rotateY(14deg) rotateX(-3deg) scale(1.02)', offset: .55 }, { transform: 'rotateY(0deg) rotateX(0deg) scale(1)' }],
      { duration: 780, easing: 'cubic-bezier(.23,1,.32,1)' });
  };
  const on = card => { if (card.classList.contains('on')) return; card.classList.add('on'); swing(card); };
  const off = card => { card.classList.remove('on', 'tracking'); setTilt(card, 0, 0); };
  function setTilt(card, nx, ny) {   // nx, ny in -1..1 from the card centre
    if (reduce.matches) return;
    card.style.setProperty('--ry', `${(nx * MAXY).toFixed(2)}deg`);
    card.style.setProperty('--rx', `${(-ny * MAXX).toFixed(2)}deg`);
    card.style.setProperty('--px', `${(-nx * 10).toFixed(1)}px`);   // icons drift the other way: a little depth
    card.style.setProperty('--py', `${(-ny * 8).toFixed(1)}px`);
  }
  const track = (card, e) => {
    const b = card.getBoundingClientRect();
    setTilt(card, Math.max(-1, Math.min(1, ((e.clientX - b.left) / b.width - .5) * 2)), Math.max(-1, Math.min(1, ((e.clientY - b.top) / b.height - .5) * 2)));
  };

  cards.forEach(card => {
    card.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') on(card); });
    card.addEventListener('pointermove', e => {
      if (e.pointerType === 'mouse' || card.classList.contains('on')) { card.classList.add('tracking'); track(card, e); }
    });
    card.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') off(card); else { card.classList.remove('tracking'); setTilt(card, 0, 0); } });
    card.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') { card.classList.remove('tracking'); setTilt(card, 0, 0); } });
    card.addEventListener('pointercancel', () => { card.classList.remove('tracking'); setTilt(card, 0, 0); });
    card.addEventListener('focus', () => on(card));
    card.addEventListener('blur', () => { if (fine.matches) off(card); });
    card.addEventListener('click', () => { if (!fine.matches) { cards.forEach(c => c !== card && off(c)); card.classList.remove('on'); on(card); } });
  });

  // Touch screens: whichever card sits in the middle of the carousel (or the screen) is "on".
  if (!fine.matches) {
    const list = document.getElementById('tops');
    let raf = 0, seen = false;
    const pickCentre = () => {
      raf = 0; if (!seen) return;
      const lb = list.getBoundingClientRect(), mid = lb.left + lb.width / 2;
      let best = null, bd = Infinity;
      cards.forEach(c => { const b = c.getBoundingClientRect(), d = Math.abs(b.left + b.width / 2 - mid); if (d < bd) { bd = d; best = c; } });
      if (best && !best.classList.contains('on')) { cards.forEach(c => c !== best && off(c)); on(best); }
    };
    list.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(pickCentre); }, { passive: true });
    new IntersectionObserver(([e]) => { seen = e.isIntersecting && e.intersectionRatio > .5; if (seen) pickCentre(); }, { threshold: [.5] }).observe(list);
  }
  window.__tops = { on, off, setTilt };
})();
