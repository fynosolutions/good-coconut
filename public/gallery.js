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

// Leave loading and playback to the visitor; report genuine media failures.
document.querySelectorAll('.scrap-video video').forEach(video => {
  const showError = () => {
    video.closest('.scrap-video').querySelector('.scrap-video-error').hidden = false;
  };
  video.addEventListener('error', showError);
  video.querySelector('source')?.addEventListener('error', showError);
  video.addEventListener('loadeddata', () => {
    video.closest('.scrap-video').querySelector('.scrap-video-error').hidden = true;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
  });
});
