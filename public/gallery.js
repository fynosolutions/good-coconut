// Progressive enhancement: photos still open their source image without JavaScript.
const galleryDialog = document.querySelector('.scrap-lightbox');
if (galleryDialog && typeof galleryDialog.showModal === 'function') {
  const image = galleryDialog.querySelector('img');
  const caption = galleryDialog.querySelector('p');
  let opener;
  document.querySelectorAll('[data-gallery-photo]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      caption.textContent = link.dataset.caption;
      galleryDialog.showModal();
      document.body.classList.add('scrap-photo-open');
    });
  });
  galleryDialog.querySelector('button').addEventListener('click', () => galleryDialog.close());
  galleryDialog.addEventListener('click', event => {
    const bounds = galleryDialog.getBoundingClientRect();
    if (event.target === galleryDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) galleryDialog.close();
  });
  galleryDialog.addEventListener('close', () => {
    document.body.classList.remove('scrap-photo-open');
    opener?.focus({preventScroll:true});
  });
}

// Muted inline loops start without a click; only visible films keep decoding.
const galleryVideos = [...document.querySelectorAll('.scrap-video video')];
const visibleVideos = new Set();
function playVideo(video) {
  if (document.hidden || !visibleVideos.has(video)) return;
  video.muted = true;
  video.play()?.catch(() => {
    // A browser or power-saving setting may defer autoplay; keep the poster.
  });
}
const playbackObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(({target:video, isIntersecting}) => {
    if (isIntersecting) {
      visibleVideos.add(video);
      playVideo(video);
    } else {
      visibleVideos.delete(video);
      video.pause();
    }
  });
}, {threshold:0}) : null;
galleryVideos.forEach(video => {
  video.muted = true;
  video.defaultMuted = true;
  const error = video.closest('.scrap-video').querySelector('.scrap-video-error');
  const showError = () => { error.hidden = false; };
  video.addEventListener('error', showError);
  video.querySelector('source')?.addEventListener('error', showError);
  if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) showError();
  video.addEventListener('loadeddata', () => { error.hidden = true; });
  video.addEventListener('canplay', () => playVideo(video));
  video.addEventListener('playing', () => {
    if (document.hidden || !visibleVideos.has(video)) video.pause();
  });
  if (playbackObserver) playbackObserver.observe(video);
  else { visibleVideos.add(video); playVideo(video); }
});
document.addEventListener('visibilitychange', () => {
  galleryVideos.forEach(video => document.hidden ? video.pause() : playVideo(video));
});
window.addEventListener('pageshow', () => galleryVideos.forEach(playVideo));
