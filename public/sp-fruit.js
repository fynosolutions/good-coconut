/* Paper-cut fruit (flat, rounded polygons, one colour, no outline) that falls behind a product card. */
(() => {
  const C = { orange:'#C9572A', amber:'#D57A2E', maroon:'#7A2238', navy:'#2B2B4D', green:'#3E6B4A', red:'#D0483A',
              brown:'#6E3216', yellow:'#F6C843', purple:'#4F2C5E', lilac:'#9B7BC4', magenta:'#B5476E', lime:'#A3B84A', cream:'#FFF6E4', ink:'#2A2830' };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  // An irregular n-gon; drawn with a same-colour round-join stroke so corners are softly rounded like cut paper.
  const poly = (cx, cy, rx, ry, n, jit, rot = 0) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2, k = 1 + rnd(-jit, jit);
      pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
    }
    return pts.join(' ');
  };
  const P = (pts, c) => `<polygon points="${pts}" fill="${c}" stroke="${c}" stroke-width="7" stroke-linejoin="round"/>`;
  const L = (d, c, w = 5) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const leaf = (x, y, r, c) => `<path d="M${x} ${y} q${r} ${-r * .9} ${r * 2.2} ${-r * .2} q${-r} ${r * .9} ${-r * 2.2} ${r * .2}z" fill="${c}" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>`;
  const calyx = (x, y, s, c) => L(`M${x - s} ${y + 2} l${s * .6} ${-s * .5} M${x} ${y} l0 ${-s * .8} M${x + s} ${y + 2} l${-s * .6} ${-s * .5} M${x - s * .5} ${y + 3} l${-s * .7} ${s * .1} M${x + s * .5} ${y + 3} l${s * .7} ${s * .1}`, c, 4);

  // Each fruit draws into a 100x100 box.
  const SHAPES = {
    coconut: [
      () => P(poly(50, 52, 42, 40, 8, .08, rnd(0, 1)), C.brown) + P(poly(52, 50, 33, 31, 8, .06, rnd(0, 1)), C.cream),
      () => P(poly(50, 50, 42, 40, 12, .05, 0), C.brown) + P(poly(54, 47, 32, 30, 12, .04, 0), C.cream),
      () => P(poly(50, 50, 22, 22, 4, .1, Math.PI / 4), C.amber),
      () => P(poly(50, 50, 30, 24, 5, .18, rnd(0, 1)), C.cream),
    ],
    mango: [
      () => P(poly(50, 54, 44, 32, 9, .06, -.4), C.yellow) + leaf(60, 22, 12, C.green),
      () => P(poly(50, 50, 26, 26, 4, .08, Math.PI / 4), C.amber),
      () => P(poly(50, 50, 22, 22, 4, .1, rnd(0, 1)), C.yellow),
    ],
    strawberry: [
      () => P('50,94 22,62 18,38 34,26 50,30 66,26 82,38 78,62', C.red) + calyx(50, 26, 14, C.red) + L('M50 22 L56 6', C.red, 5),
      () => P('50,90 26,62 24,42 38,32 62,32 76,42 74,62', C.red) + calyx(50, 30, 12, '#98281F'),
    ],
    dragonfruit: [
      () => P(poly(50, 54, 40, 38, 8, .07, rnd(0, 1)), C.magenta) + L('M30 18 l6 14 M50 10 l0 16 M70 18 l-6 14 M18 40 l14 4 M82 40 l-14 4', C.green, 5),
      () => P(poly(50, 50, 28, 26, 6, .12, rnd(0, 1)), C.magenta) + `<g fill="${C.ink}">${Array.from({ length: 7 }, () => `<circle cx="${rnd(32, 68).toFixed(0)}" cy="${rnd(32, 68).toFixed(0)}" r="2.4"/>`).join('')}</g>`,
    ],
    coffee: [
      () => P('50,8 76,30 82,62 64,92 36,92 18,62 24,30', C.brown) + L('M50 18 C38 42 62 58 50 84', '#B07A4F', 5),
      () => P(poly(50, 50, 22, 32, 8, .06, 0), '#4A2410') + L('M50 24 C42 42 58 56 50 76', '#8A5A36', 4),
    ],
    taro: [
      () => P(poly(50, 54, 44, 36, 9, .14, rnd(0, 1)), C.purple) + leaf(56, 20, 12, C.green),
      () => P(poly(50, 50, 30, 26, 6, .16, rnd(0, 1)), C.lilac),
      () => P(poly(50, 50, 22, 22, 5, .2, rnd(0, 1)), C.lilac),
    ],
    sesame: [
      () => P('50,14 66,48 62,74 50,86 38,74 34,48', C.ink),
      () => P('50,18 64,50 60,72 50,82 40,72 36,50', C.cream),
      () => P(poly(50, 52, 40, 40, 14, .1, 0), C.navy),
    ],
    lime: [
      () => P(poly(50, 50, 42, 42, 9, .05, rnd(0, 1)), C.lime) + P(poly(50, 50, 32, 32, 9, .04, 0), '#DCEB9A') +
            L('M50 22 L50 78 M26 36 L74 64 M26 64 L74 36', C.lime, 4),
      () => P(poly(50, 54, 40, 30, 8, .06, 0), C.green) + leaf(58, 24, 11, C.green),
    ],
  };

  const ease = { fall: 'cubic-bezier(.55,0,.85,.36)', settle: 'cubic-bezier(.23,1,.32,1)', out: 'cubic-bezier(.4,0,1,1)' };

  function drop(card) {
    const burst = card.querySelector('.burst'), kind = card.dataset.fruit, set = SHAPES[kind];
    if (!set) return;
    const w = card.clientWidth, h = card.clientHeight, n = w < 220 ? 8 : 11;
    burst.querySelectorAll('svg').forEach(s => s.remove());
    for (let i = 0; i < n; i++) {
      const size = rnd(.24, .42) * w * (i % 3 === 2 ? .55 : 1);   // a mix of big fruit and small pieces
      const x = rnd(-.1, .9) * w, endY = rnd(-.06, .58) * h, startY = -size - rnd(0, h * .4);
      const r0 = rnd(-90, 90), r1 = r0 + rnd(-40, 40);
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('viewBox', '0 0 100 100'); el.setAttribute('width', size.toFixed(0)); el.setAttribute('height', size.toFixed(0));
      el.innerHTML = pick(set)();
      burst.appendChild(el);
      const dur = rnd(520, 760), delay = i * 28 + rnd(0, 40);
      el.animate([
        { transform: `translate(${x}px,${startY}px) rotate(${r0}deg) scale(.92)`, easing: ease.fall },
        { offset: .72, transform: `translate(${x}px,${endY}px) rotate(${r1}deg) scale(1)`, easing: ease.settle },
        { offset: .86, transform: `translate(${x}px,${endY - size * .08}px) rotate(${r1 + 3}deg) scale(1)`, easing: ease.fall },
        { transform: `translate(${x}px,${endY}px) rotate(${r1}deg) scale(1)` }
      ], { duration: dur, delay, fill: 'both' });
      el.dataset.x = x; el.dataset.y = endY; el.dataset.r = r1;
    }
  }

  function clear(card) {
    card.querySelectorAll('.burst svg').forEach((el, i) => {
      const { x, y, r } = el.dataset;
      // Leave the way they came in, only downward: keep falling out of the card and fade.
      el.getAnimations().forEach(a => a.cancel());
      el.animate([{ transform: `translate(${x}px,${y}px) rotate(${r}deg)`, opacity: 1 },
                  { transform: `translate(${x}px,${+y + card.clientHeight * .35}px) rotate(${+r + 20}deg)`, opacity: 0 }],
        { duration: 280, delay: i * 10, easing: ease.out, fill: 'both' }).finished.then(() => el.remove()).catch(() => {});
    });
  }

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const on = card => { if (card.classList.contains('on')) return; card.classList.add('on'); if (!reduce.matches) drop(card); };
  const off = card => { card.classList.remove('on'); clear(card); };

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') on(card); });
    card.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') off(card); });
    card.addEventListener('focus', () => on(card));
    card.addEventListener('blur', () => off(card));
    // Phones and tablets have no hover: a tap replays the fall.
    card.addEventListener('click', () => { if (fine.matches) return; card.classList.remove('on'); clearTimeout(card._t); on(card); card._t = setTimeout(() => off(card), 2200); });
  });

  // On touch screens each card plays once as it scrolls into view, so the effect is not hover-only.
  // Touch screens: cards play one at a time as they come into view (a queue), so scrolling never flashes several colours at once.
  if (!fine.matches) {
    const queue = []; let busy = false;
    const next = () => {
      if (busy || !queue.length) return; busy = true; const card = queue.shift();
      on(card); card._t = setTimeout(() => { off(card); setTimeout(() => { busy = false; next(); }, 320); }, 1400);
    };
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target); queue.push(e.target); next();
    }), { threshold: .8 });
    document.querySelectorAll('.card').forEach(c => io.observe(c));
  }
  window.__fruit = { drop, clear, on, off };
})();
