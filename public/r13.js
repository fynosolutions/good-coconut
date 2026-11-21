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
