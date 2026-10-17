const toggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
  mobileNav.hidden = true;
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  mobileNav.hidden = open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

const header = document.getElementById('site-header');
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 36);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

document.getElementById('year').textContent = new Date().getFullYear();
const ambientVideo = document.querySelector('.studio-video');
if (ambientVideo) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  if (reducedMotion || saveData) {
    ambientVideo.pause();
    ambientVideo.hidden = true;
  } else {
    ambientVideo.play().catch(() => { ambientVideo.hidden = true; });
  }
}


// Backwards compatibility for previously shared single-page section URLs.
if (location.pathname.endsWith('/') || location.pathname.endsWith('/index.html')) {
  const previousSections = {
    '#servicos':'servicos.html', '#valores':'servicos.html#valores', '#trabalhos':'trabalhos.html',
    '#feedbacks':'feedbacks.html', '#sobre':'sobre.html',
    '#instagram':'sobre.html#instagram', '#contato':'contato.html'
  };
  if (previousSections[location.hash]) location.replace(previousSections[location.hash]);
}

