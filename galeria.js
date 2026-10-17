// Filter the portfolio without removing work cards from the document.
const galleryFilters = [...document.querySelectorAll('[data-gallery-filter]')];
const workCards = [...document.querySelectorAll('.work-card')];
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
const galleryPageIndicator = document.getElementById('gallery-page');
const galleryStatus = document.getElementById('gallery-status');
let galleryCategory = 'todos';
let galleryPage = 0;
let galleryPageSize = 0;

function renderGallery() {
  const perPage = window.matchMedia('(max-width: 800px)').matches ? 4 : 8;
  const matching = workCards.filter(card =>
    galleryCategory === 'todos' || card.dataset.workCategory === galleryCategory
  );
  const totalPages = Math.max(1, Math.ceil(matching.length / perPage));
  galleryPage = Math.min(galleryPage, totalPages - 1);
  galleryPageSize = perPage;
  workCards.forEach(card => {
    const matchingIndex = matching.indexOf(card);
    card.hidden = matchingIndex === -1 ||
      matchingIndex < galleryPage * perPage ||
      matchingIndex >= (galleryPage + 1) * perPage;
  });
  galleryPrev.disabled = galleryPage === 0;
  galleryNext.disabled = galleryPage >= totalPages - 1;
  galleryPageIndicator.textContent = (galleryPage + 1) + ' / ' + totalPages;
  const first = matching.length ? galleryPage * perPage + 1 : 0;
  const last = Math.min((galleryPage + 1) * perPage, matching.length);
  galleryStatus.textContent = `Mostrando ${first}–${last} de ${matching.length} trabalhos`;
}

galleryFilters.forEach(filter => {
  filter.addEventListener('click', () => {
    galleryCategory = filter.dataset.galleryFilter;
    galleryPage = 0;
    galleryFilters.forEach(button => {
      const active = button === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderGallery();
  });
});
galleryPrev?.addEventListener('click', () => {
  if (galleryPage > 0) { galleryPage--; renderGallery(); }
});
galleryNext?.addEventListener('click', () => {
  if (!galleryNext.disabled) { galleryPage++; renderGallery(); }
});
window.addEventListener('resize', () => {
  const nextSize = window.matchMedia('(max-width: 800px)').matches ? 4 : 8;
  if (workCards.length && nextSize !== galleryPageSize) { galleryPage = 0; renderGallery(); }
});
if (workCards.length) renderGallery();

// Modern media viewer: photos, silent videos, keyboard navigation, custom timeline.
const lightbox = document.getElementById('work-lightbox');
const lightboxStage = document.getElementById('lightbox-stage');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const viewerCounter = document.getElementById('viewer-counter');
const viewerKind = document.getElementById('viewer-kind');
const viewerPlayer = document.getElementById('viewer-player');
const viewerPlay = document.getElementById('viewer-play');
const viewerPlaySymbol = document.getElementById('viewer-play-symbol');
const viewerSeek = document.getElementById('viewer-seek');
const viewerCurrent = document.getElementById('viewer-current');
const viewerDuration = document.getElementById('viewer-duration');
const viewerFullscreen = document.getElementById('viewer-fullscreen');
const viewerPrev = lightbox.querySelector('.viewer-arrow-prev');
const viewerNext = lightbox.querySelector('.viewer-arrow-next');
const viewerCanvas = lightbox.querySelector('.viewer-canvas');
const feedbackCards = [...document.querySelectorAll('.feedback-item[data-media-src]')];
let viewerCollection = [];
let viewerIndex = 0;
let triggerBeforeDialog = null;
let activeVideo = null;

function formatMediaTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const value = Math.max(0, Math.floor(seconds));
  return Math.floor(value / 60) + ':' + String(value % 60).padStart(2, '0');
}

function updateVideoControls() {
  if (!activeVideo) return;
  const duration = activeVideo.duration || 0;
  const current = activeVideo.currentTime || 0;
  viewerCurrent.textContent = formatMediaTime(current);
  viewerDuration.textContent = formatMediaTime(duration);
  const percent = duration ? Math.min(100, current / duration * 100) : 0;
  viewerSeek.value = String(percent);
  viewerSeek.style.setProperty('--progress', percent + '%');
  const paused = activeVideo.paused || activeVideo.ended;
  viewerPlaySymbol.textContent = paused ? '▶' : 'Ⅱ';
  viewerPlay.setAttribute('aria-label', paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
}

function toggleVideoPlayback() {
  if (!activeVideo) return;
  if (activeVideo.paused || activeVideo.ended) {
    activeVideo.play().catch(updateVideoControls);
  } else {
    activeVideo.pause();
  }
}

function renderViewerMedia() {
  if (activeVideo) activeVideo.pause();
  activeVideo = null;
  const item = viewerCollection[viewerIndex];
  if (!item) return;
  const src = item.dataset.mediaSrc;
  const caption = item.dataset.mediaCaption || 'Um momento Aurora Beauty';
  const isVideo = /\.mp4$/i.test(src);
  const media = document.createElement(isVideo ? 'video' : 'img');
  media.src = src;
  if (isVideo) {
    media.poster = item.dataset.poster || '';
    media.playsInline = true;
    media.preload = 'metadata';
    media.setAttribute('aria-label', caption);
    activeVideo = media;
    viewerSeek.value = '0';
    viewerSeek.style.setProperty('--progress', '0%');
    viewerCurrent.textContent = '0:00';
    viewerDuration.textContent = '0:00';
    ['timeupdate', 'loadedmetadata', 'play', 'pause', 'ended'].forEach(name =>
      media.addEventListener(name, updateVideoControls)
    );
    media.addEventListener('click', toggleVideoPlayback);
  } else {
    media.alt = caption;
    media.decoding = 'async';
  }
  lightboxStage.replaceChildren(media);
  viewerPlayer.hidden = !isVideo;
  viewerKind.textContent = isVideo ? 'VÍDEO • AURORA BEAUTY' : 'FOTO • AURORA BEAUTY';
  lightboxCaption.textContent = caption;
  viewerCounter.textContent = String(viewerIndex + 1).padStart(2, '0') + ' / ' +
    String(viewerCollection.length).padStart(2, '0');
  viewerPrev.disabled = viewerIndex === 0;
  viewerNext.disabled = viewerIndex === viewerCollection.length - 1;
  viewerPrev.hidden = viewerNext.hidden = viewerCollection.length < 2;
  if (isVideo) media.play().catch(updateVideoControls);
}

function moveViewer(direction) {
  const target = viewerIndex + direction;
  if (target < 0 || target >= viewerCollection.length) return;
  viewerIndex = target;
  renderViewerMedia();
}

document.querySelectorAll('[data-media-src]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    if (typeof lightbox.showModal !== 'function') return;
    triggerBeforeDialog = trigger;
    viewerCollection = trigger.closest('.feedback-gallery') ? feedbackCards :
      workCards.filter(card => galleryCategory === 'todos' ||
        card.dataset.workCategory === galleryCategory);
    viewerIndex = viewerCollection.indexOf(trigger);
    if (viewerIndex < 0) { viewerCollection = [trigger]; viewerIndex = 0; }
    lightbox.showModal();
    renderViewerMedia();
    lightboxClose.focus();
  });
});

viewerPlay.addEventListener('click', toggleVideoPlayback);
viewerSeek.addEventListener('input', () => {
  if (!activeVideo || !Number.isFinite(activeVideo.duration) || !activeVideo.duration) return;
  activeVideo.currentTime = Number(viewerSeek.value) / 100 * activeVideo.duration;
  updateVideoControls();
});
viewerFullscreen.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
  } else {
    viewerCanvas.requestFullscreen?.().catch(() => {});
  }
});
viewerPrev.addEventListener('click', () => moveViewer(-1));
viewerNext.addEventListener('click', () => moveViewer(1));
lightbox.addEventListener('keydown', event => {
  if (event.target === viewerSeek) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); moveViewer(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); moveViewer(1); }
  if (event.key === ' ' && !['BUTTON', 'INPUT'].includes(event.target.tagName) && activeVideo) {
    event.preventDefault();
    toggleVideoPlayback();
  }
});
let touchStartX = null;
viewerCanvas.addEventListener('touchstart', event => {
  touchStartX = event.touches.length === 1 ? event.touches[0].clientX : null;
}, { passive: true });
viewerCanvas.addEventListener('touchend', event => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  touchStartX = null;
  if (Math.abs(delta) > 65) moveViewer(delta > 0 ? -1 : 1);
}, { passive: true });
function closeLightbox() {
  if (lightbox.open) lightbox.close();
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
lightbox.addEventListener('close', () => {
  if (activeVideo) activeVideo.pause();
  activeVideo = null;
  if (document.fullscreenElement) document.exitFullscreen?.();
  lightboxStage.replaceChildren();
  viewerPlayer.hidden = true;
  triggerBeforeDialog?.focus({ preventScroll: true });
});
