/* Touchable coconut water: a 2D wave simulation shaded like milky coconut water inside a freshly opened shell. */
(() => {
  const cv = document.getElementById('water'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const N = matchMedia('(max-width: 820px)').matches ? 96 : 128, cur = new Float32Array(N * N), prev = new Float32Array(N * N), mask = new Uint8Array(N * N), vig = new Float32Array(N * N);
  const off = document.createElement('canvas'); off.width = off.height = N;
  const octx = off.getContext('2d'), img = octx.createImageData(N, N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = (x + .5) / N * 2 - 1, dy = (y + .5) / N * 2 - 1, d = Math.hypot(dx, dy), i = y * N + x;
    mask[i] = d < .98 ? 1 : 0; vig[i] = .88 + .12 * (1 - Math.min(1, d) ** 2);
  }
  let S = 480, dpr = 1, shell = null;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // The frame is the same real opened coconut as the hero's first O; the water lives in its white flesh.
  const WX = .46, WY = .49, WR = .33;   // flesh circle inside coconut-half.png, as fractions of the canvas
  const photo = new Image(); photo.src = '/assets/specialties/coconut-half.png'; photo.onload = () => { drawShell(); render(); };
  function drawShell() {
    const c = document.createElement('canvas'); c.width = c.height = S * dpr; const g = c.getContext('2d'); g.scale(dpr, dpr);
    if (photo.complete && photo.naturalWidth) g.drawImage(photo, 0, 0, S, S);
    shell = c;
  }
  function resize() {
    S = cv.clientWidth || 480; dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = cv.height = Math.round(S * dpr); drawShell(); render();
  }

  function step() {
    for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
      const i = y * N + x; if (!mask[i]) { prev[i] = 0; continue; }
      let v = (cur[i - 1] + cur[i + 1] + cur[i - N] + cur[i + N]) * .5 - prev[i];
      prev[i] = v * .985;
    }
    // swap
    for (let i = 0; i < N * N; i++) { const t = cur[i]; cur[i] = prev[i]; prev[i] = t; }
  }
  function render() {
    const d = img.data;
    for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
      const i = y * N + x, p = i * 4;
      if (!mask[i]) { d[p + 3] = 0; continue; }
      const sx = cur[i + 1] - cur[i - 1], sy = cur[i + N] - cur[i - N];
      const light = -(sx * .5 + sy * .35), spec = light > 30 ? (light - 30) * 2 : 0;
      const v = vig[i];
      d[p] = Math.min(255, (248 + light) * v + spec); d[p + 1] = Math.min(255, (242 + light) * v + spec); d[p + 2] = Math.min(255, (228 + light * .9) * v + spec); d[p + 3] = 255;
    }
    octx.putImageData(img, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (shell) ctx.drawImage(shell, 0, 0);
    const r = S * WR * dpr, c = cv.width * WX, cy = cv.width * WY;
    ctx.save(); ctx.beginPath(); ctx.arc(c, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(off, c - r, cy - r, r * 2, r * 2);
    // soft inner shadow so the water sits inside the shell
    const g = ctx.createRadialGradient(c, cy, r * .8, c, cy, r); g.addColorStop(0, 'rgba(150,110,70,0)'); g.addColorStop(1, 'rgba(150,110,70,.16)');
    ctx.fillStyle = g; ctx.fillRect(c - r, cy - r, r * 2, r * 2); ctx.restore();
  }

  function disturb(gx, gy, rad, amp) {
    for (let y = -rad; y <= rad; y++) for (let x = -rad; x <= rad; x++) {
      const X = Math.round(gx + x), Y = Math.round(gy + y); if (X < 1 || Y < 1 || X >= N - 1 || Y >= N - 1) continue;
      const k = 1 - Math.hypot(x, y) / (rad + .01); if (k > 0) cur[Y * N + X] += amp * k;
    }
  }
  const toGrid = e => {
    const b = cv.getBoundingClientRect(), r = WR * 2;   // the water disc diameter as a fraction of the canvas
    return [((e.clientX - b.left) / b.width - WX) / r * N + N / 2, ((e.clientY - b.top) / b.height - WY) / r * N + N / 2];
  };
  let last = null, lastInput = 0;
  cv.addEventListener('pointermove', e => {
    const [gx, gy] = toGrid(e); lastInput = performance.now();
    if (last) {   // trail along the path so fast swipes leave a continuous wake
      const steps = Math.min(12, Math.ceil(Math.hypot(gx - last[0], gy - last[1]) / 2));
      for (let s = 1; s <= steps; s++) disturb(last[0] + (gx - last[0]) * s / steps, last[1] + (gy - last[1]) * s / steps, 3, -60);
    }
    last = [gx, gy]; wake();
  });
  cv.addEventListener('pointerleave', () => { last = null; });
  cv.addEventListener('pointerdown', e => { const [gx, gy] = toGrid(e); disturb(gx, gy, 5, -300); lastInput = performance.now(); wake(); });

  // Alive without input (phones): a gentle drop every ~2 s while on screen.
  let nextDrop = 0, raf = 0, visible = false;
  function loop(t) {
    raf = 0; if (!visible || document.hidden) return;
    if (t - lastInput > 1600 && t > nextDrop) { disturb(N * (.3 + Math.random() * .4), N * (.3 + Math.random() * .4), 4, -320); nextDrop = t + 1400 + Math.random() * 900; }
    step();
    let e = 0; for (let i = 0; i < cur.length; i += 7) e += Math.abs(cur[i]);   // calm surface: skip the redraw
    if (e > 40 || t - lastInput < 400) render();
    raf = requestAnimationFrame(loop);
  }
  function wake() { if (!raf && visible && !reduce.matches) raf = requestAnimationFrame(loop); }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); }, { threshold: .1 }).observe(cv);
  document.addEventListener('visibilitychange', wake);
  new ResizeObserver(resize).observe(cv); resize();

  if (reduce.matches) {   // one still frame with a few settled rings, no loop
    disturb(N * .4, N * .45, 5, -420); disturb(N * .62, N * .58, 4, -300);
    for (let k = 0; k < 36; k++) step(); render();
  }
  window.__water = { cur, step, render };
})();
