/* Touchable coconut water: a 2D wave simulation that refracts the real coconut photo's own water (WebGL).
   Photo: water-coconut.webp (top-down opened coconut). Mask: water-mask.png (white = the water pool).
   No WebGL or reduced motion: the photo is drawn still. Built by round8-water/scripts/make_assets.py. */
(() => {
  const cv = document.getElementById('water'); if (!cv) return;
  const BOX = [.19, .2, .62, .6];          // the water pool's bounding box in the photo (x, y, w, h as fractions), with a little pad
  const N = matchMedia('(max-width: 820px)').matches ? 96 : 128;
  const cur = new Float32Array(N * N), prev = new Float32Array(N * N), wall = new Uint8Array(N * N), packed = new Uint8Array(N * N * 4);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const load = src => new Promise((ok, no) => { const i = new Image(); i.decoding = 'async'; i.onload = () => ok(i); i.onerror = no; i.src = src; });

  const gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  let S = 480, dpr = 1, photo = null;

  // ---------- fallback: still photo ----------
  if (!gl) {
    const ctx = cv.getContext('2d');
    const still = () => { if (!photo) return; S = cv.clientWidth || 480; dpr = Math.min(2, devicePixelRatio || 1); cv.width = cv.height = Math.round(S * dpr); ctx.drawImage(photo, 0, 0, cv.width, cv.height); };
    load('/assets/specialties/water-coconut.webp').then(p => { photo = p; still(); });
    new ResizeObserver(still).observe(cv);
    return;
  }

  // ---------- WebGL ----------
  const VS = 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}';
  const FS = `precision mediump float;varying vec2 v;
uniform sampler2D uPhoto,uMask,uWave;uniform vec4 uBox;
void main(){
  vec2 g=(v-uBox.xy)/uBox.zw;
  float m=texture2D(uMask,v).r;
  vec2 n=vec2(0.);
  if(g.x>0.&&g.x<1.&&g.y>0.&&g.y<1.)n=(texture2D(uWave,g).rg-.5)*2.*m;
  vec4 c=texture2D(uPhoto,v-n*.018);
  vec3 N=normalize(vec3(-n*2.2,1.));
  vec3 L=normalize(vec3(-.45,-.55,1.));
  float shade=dot(N,L)-L.z;
  float spec=pow(max(0.,dot(reflect(-L,N),vec3(0.,0.,1.))),60.);
  c.rgb+=(shade*.55+spec*.55*smoothstep(.02,.12,length(n)))*m*c.a;
  gl_FragColor=c;
}`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.uniform4f(gl.getUniformLocation(prog, 'uBox'), ...BOX);
  const tex = (unit, name) => {
    const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(prog, name), unit); return t;
  };
  const tPhoto = tex(0, 'uPhoto'), tMask = tex(1, 'uMask'), tWave = tex(2, 'uWave');
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  packed.fill(128); for (let i = 3; i < packed.length; i += 4) packed[i] = 255;   // opaque, so premultiply leaves the slopes alone
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, packed);
  let ready = false;

  function upload() {   // wave slopes -> RG bytes around 128
    for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
      const i = y * N + x, p = i * 4;
      packed[p] = Math.max(0, Math.min(255, 128 + (cur[i + 1] - cur[i - 1]) * .35));
      packed[p + 1] = Math.max(0, Math.min(255, 128 + (cur[i + N] - cur[i - N]) * .35));
    }
    gl.activeTexture(gl.TEXTURE2); gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, N, N, gl.RGBA, gl.UNSIGNED_BYTE, packed);
  }
  function render() {
    if (!ready) return;
    upload(); gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function resize() { S = cv.clientWidth || 480; dpr = Math.min(2, devicePixelRatio || 1); cv.width = cv.height = Math.round(S * dpr); render(); }

  Promise.all([load('/assets/specialties/water-coconut.webp'), load('/assets/specialties/water-mask.png')]).then(([p, m]) => {
    photo = p;
    gl.activeTexture(gl.TEXTURE0); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, p);
    gl.activeTexture(gl.TEXTURE1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, m);
    // the simulation's walls follow the real water edge, so rings bounce off the coconut meat
    const c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d');
    g.drawImage(m, BOX[0] * m.width, BOX[1] * m.height, BOX[2] * m.width, BOX[3] * m.height, 0, 0, N, N);
    const d = g.getImageData(0, 0, N, N).data;
    for (let i = 0; i < N * N; i++) wall[i] = d[i * 4] < 100 ? 1 : 0;
    ready = true; resize();
    if (reduce.matches) { disturb(N * .42, N * .45, 5, -420); disturb(N * .6, N * .58, 4, -300); for (let k = 0; k < 36; k++) step(); render(); }
  });

  function step() {
    for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
      const i = y * N + x; if (wall[i]) { prev[i] = 0; continue; }
      prev[i] = ((cur[i - 1] + cur[i + 1] + cur[i - N] + cur[i + N]) * .5 - prev[i]) * .985;
    }
    for (let i = 0; i < N * N; i++) { const t = cur[i]; cur[i] = prev[i]; prev[i] = t; }
  }
  function disturb(gx, gy, rad, amp) {
    for (let y = -rad; y <= rad; y++) for (let x = -rad; x <= rad; x++) {
      const X = Math.round(gx + x), Y = Math.round(gy + y); if (X < 1 || Y < 1 || X >= N - 1 || Y >= N - 1 || wall[Y * N + X]) continue;
      const k = 1 - Math.hypot(x, y) / (rad + .01); if (k > 0) cur[Y * N + X] += amp * k;
    }
  }
  const toGrid = e => { const b = cv.getBoundingClientRect(); return [((e.clientX - b.left) / b.width - BOX[0]) / BOX[2] * N, ((e.clientY - b.top) / b.height - BOX[1]) / BOX[3] * N]; };
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
  let nextDrop = 0, raf = 0, visible = false, calm = true;
  function loop(t) {
    raf = 0; if (!visible || document.hidden || !ready) return;
    if (t - lastInput > 1600 && t > nextDrop) { disturb(N * (.3 + Math.random() * .4), N * (.3 + Math.random() * .4), 4, -320); nextDrop = t + 1400 + Math.random() * 900; }
    step();
    let e = 0; for (let i = 0; i < cur.length; i += 7) e += Math.abs(cur[i]);
    if (e > 40 || t - lastInput < 400) { render(); calm = false; } else if (!calm) { cur.fill(0); prev.fill(0); render(); calm = true; }
    raf = requestAnimationFrame(loop);
  }
  function wake() { if (!raf && visible && !reduce.matches) raf = requestAnimationFrame(loop); }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); }, { threshold: .1 }).observe(cv);
  document.addEventListener('visibilitychange', wake);
  new ResizeObserver(resize).observe(cv);
  window.__water = { cur, step, render, disturb, N };
})();
