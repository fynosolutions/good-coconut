/* Round 15 (2026-11-21): the contact form's subject is filled in from the topic the visitor picked
   (the three "How can we help?" cards, or ?topic= in a link from another page). */
(() => {
  const subject = document.getElementById('subject'); if (!subject) return;
  const topics = { catering: 'Catering order', franchise: 'Franchise inquiry', partnership: 'Brand partnership' };
  const set = t => { if (topics[t]) subject.value = topics[t]; };
  set(new URLSearchParams(location.search).get('topic'));
  document.querySelectorAll('[data-topic]').forEach(a => a.addEventListener('click', () => {
    set(a.dataset.topic);
    setTimeout(() => document.getElementById('message')?.focus({ preventScroll: true }), 450);
  }));
})();

/* 2026-11-23 r20: free-membership pop-up on the two menu pages (owner request).
   Shows 1.2 s after the menu opens, once per visit; the button goes to the current shop's Chowbus pickup page. */
(() => {
  const layout = document.querySelector('.menu-layout[data-location]');
  if (!layout || typeof HTMLDialogElement !== 'function') return;
  const KEY = 'gc-member-pop';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  const shopLink = () => {
    const loc = document.querySelector('.menu-layout[data-location]')?.dataset.location;
    const a = document.querySelector(`.order-shop[data-shop="${loc === 'wall-street' ? 'manhattan' : 'flushing'}"] .order-pickup`);
    return a ? a.href : '/online/';
  };
  const d = document.createElement('dialog');
  d.className = 'member-pop';
  d.setAttribute('aria-label', 'Join our free membership');
  d.tabIndex = -1;
  d.innerHTML = '<img src="/assets/r20/member-free.webp" width="720" height="900" alt="Join our free Good Coconut membership. Earn points on every order, redeem points for free drinks, and points never expire.">'
    + '<a class="member-pop-cta" target="_blank" rel="noopener noreferrer">Order online &amp; earn points</a>'
    + '<button type="button" class="member-pop-x">No thanks</button>';
  const cta = d.querySelector('.member-pop-cta');
  const close = () => d.close();
  d.querySelector('.member-pop-x').addEventListener('click', close);
  d.addEventListener('click', e => { if (e.target === d) close(); });
  cta.addEventListener('click', () => { cta.href = shopLink(); close(); });
  setTimeout(() => {
    if (document.querySelector('dialog[open]')) return;
    cta.href = shopLink();
    document.body.append(d);
    d.showModal();
    d.focus();
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }, 1200);
})();
