const categories = {
  sobrancelhas: { title: 'Sobrancelhas', subtitle: 'Formato, definição e harmonia para o seu olhar.', groups: [
    { title: 'Design & tratamentos', items: [
      ['Design de sobrancelhas', 35], ['Design + henna', 45], ['Design + tintura', 50],
      ['Brow Lamination', 100], ['Brow Lamination + tintura', 110],
      ['Hidratação / manutenção Brow Lamination', 25]
    ] }
  ] },
  cilios: { title: 'Cílios', subtitle: 'Técnicas que valorizam o seu olhar.', groups: [
    { title: 'Extensão de cílios', items: [
      ['Clássico / Boneca', 130], ['Brasileiro', 140], ['Egípcio', 140],
      ['Sirena', 130], ['Wispy / Kim', 145], ['Fox', 140], ['Gatinho', 140],
      ['Gringo / Foreign', 150], ['Anime', 150], ['Marrom (fio a fio clássico)', 160]
    ] },
    { title: 'Tratamentos e manutenção', items: [
      ['Lash Lifting', 130], ['Manutenção de extensão', 85, true],
      ['Remoção de extensão de cílios', 35]
    ] }
  ] },
  unhas: { title: 'Unhas', subtitle: 'Cuidado e beleza em cada detalhe.', groups: [
    { title: 'Manicure & pedicure', items: [
      ['Manicure', 30], ['Pedicure', 40], ['Manicure + Pedicure', 65]
    ] }
  ] },
  depilacao: { title: 'Depilação', subtitle: 'Conforto, leveza e bem-estar.', groups: [
    { title: 'Depilação facial', items: [
      ['Buço', 15], ['Facial completa', 25]
    ] },
    { title: 'Depilação corporal', items: [
      ['Axilas', 25], ['Meia perna', 35], ['Perna inteira', 60],
      ['Virilha biquíni (laterais e pelos fora da linha do biquíni)', 35],
      ['Braços', 40], ['Perna inteira + virilha biquíni', 85],
      ['Tronco e costas', 70], ['Glúteos e faixa do abdômen', 50]
    ] }
  ] },
  cabelo: { title: 'Cabelo', subtitle: 'Cuidado do seu cabelo do seu jeito.', groups: [
    { title: 'Cortes & finalização', items: [
      ['Corte masculino', 30], ['Corte feminino', 40], ['Corte feminino + escova', 80],
      ['Escova cabelo (longo)', 75], ['Babyliss', 100], ['Penteado', 200]
    ] },
    { title: 'Cor & tratamentos', items: [
      ['Coloração', 75], ['Coloração + produto', 95], ['Hidratação', 80],
      ['Nutrição', 95], ['Matização', 100], ['Banho de brilho', 100],
      ['Reconstrução', 100], ['Cauterização', 130],
      ['Botox capilar', 200], ['Progressiva', 310]
    ] }
  ] }
};

const menuContent = document.getElementById('menu-content');
const tabs = [...document.querySelectorAll('.menu-tab')];
const search = document.getElementById('service-search');
const count = document.getElementById('menu-count');
let selectedCategory = 'sobrancelhas';
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function renderMenu() {
  const query = normalize(search.value.trim());
  document.querySelector('.menu-footer').style.display = selectedCategory === 'cabelo' ? 'flex' : 'none';
  const groups = categories[selectedCategory].groups;
  const shown = groups.map(group => ({ ...group, items: group.items.filter(item => normalize(item[0]).includes(query)) })).filter(group => group.items.length);
  const quantity = shown.reduce((total, group) => total + group.items.length, 0);
  count.textContent = `${String(quantity).padStart(2, '0')} ${quantity === 1 ? 'SERVIÇO' : 'SERVIÇOS'}`;
  menuContent.replaceChildren();

  if (!quantity) {
    const p = document.createElement('p');
    p.className = 'menu-empty';
    p.textContent = 'Nenhum serviço encontrado nesta categoria. Tente outro termo.';
    menuContent.append(p);
    return;
  }

  shown.forEach(group => {
    const heading = document.createElement('p');
    heading.className = 'menu-subtitle';
    heading.textContent = group.title;
    menuContent.append(heading);
    group.items.forEach(([name, price, startingAt]) => {
      const row = document.createElement('div');
      row.className = 'menu-row';
      const label = document.createElement('span');
      label.className = 'menu-row-name';
      label.textContent = name;
      const value = document.createElement('span');
      value.className = 'menu-row-price';
      value.textContent = `${startingAt ? 'A partir de ' : ''}${formatter.format(price)}`;
      row.append(label, value);
      menuContent.append(row);
    });
  });
  if (selectedCategory === 'unhas') {
    const highlight = document.createElement('a');
    highlight.className = 'menu-highlight-link';
    highlight.href = 'https://www.instagram.com/stories/highlights/18129399403687928/';
    highlight.target = '_blank';
    highlight.rel = 'noopener noreferrer';
    highlight.textContent = 'Ver fotos reais de unhas no Instagram ↗';
    menuContent.append(highlight);
  }
  if (selectedCategory === 'depilacao') {
    const proof = document.createElement('section');
    proof.className = 'depilation-results';
    proof.setAttribute('aria-label', 'Antes e depois divulgado pela Aurora Beauty: axila sem um fio');

    const heading = document.createElement('div');
    heading.className = 'depilation-results-heading';
    const title = document.createElement('strong');
    title.textContent = 'Axila sem um fio';
    const subtitle = document.createElement('span');
    subtitle.textContent = 'Resultado real da Aurora Beauty';
    heading.append(title, subtitle);

    const comparison = document.createElement('div');
    comparison.className = 'depilation-comparison';
    [
      { name: 'Antes', src: 'assets/aurora-depilacao-antes.webp', alt: 'Axila antes da depilação, com pelos visíveis' },
      { name: 'Depois', src: 'assets/aurora-depilacao-depois.webp', alt: 'A mesma axila na imagem de depois, sem pelos visíveis' },
    ].forEach(item => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      const caption = document.createElement('figcaption');
      caption.textContent = item.name;
      figure.append(img, caption);
      comparison.append(figure);
    });

    const source = document.createElement('a');
    source.className = 'depilation-source';
    source.href = 'https://www.instagram.com/p/DeKlFWUmlrz/';
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.textContent = 'Ver publicação original no Instagram ↗';
    proof.append(heading, comparison, source);
    menuContent.append(proof);
  }
}

function selectCategory(category) {
  if (!categories[category]) return;
  selectedCategory = category;
  search.value = '';
  tabs.forEach(tab => {
    const isSelected = tab.dataset.category === category;
    tab.classList.toggle('active', isSelected);
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });
  renderMenu();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCategory(tab.dataset.category));
  tab.addEventListener('keydown', event => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    selectCategory(tabs[nextIndex].dataset.category);
    tabs[nextIndex].focus();
  });
});
search.addEventListener('input', renderMenu);
document.querySelectorAll('[data-filter]').forEach(card => {
  card.addEventListener('click', () => selectCategory(card.dataset.filter));
});

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

// Filter the portfolio without removing work cards from the document.
const galleryFilters = [...document.querySelectorAll('[data-gallery-filter]')];
const workCards = [...document.querySelectorAll('.work-card')];
galleryFilters.forEach(filter => {
  filter.addEventListener('click', () => {
    const chosen = filter.dataset.galleryFilter;
    galleryFilters.forEach(button => {
      const active = button === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    workCards.forEach(card => {
      card.hidden = chosen !== 'todos' && card.dataset.workCategory !== chosen;
    });
  });
});

// Accessible lightbox with still photos and user-initiated video playback.
const lightbox = document.getElementById('work-lightbox');
const lightboxStage = document.getElementById('lightbox-stage');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
let triggerBeforeDialog = null;

document.querySelectorAll('[data-media-src]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    if (typeof lightbox.showModal !== 'function') return;
    triggerBeforeDialog = trigger;
    const url = trigger.dataset.mediaSrc;
    const isVideo = /\.mp4$/i.test(url);
    let media;
    if (isVideo) {
      media = document.createElement('video');
      media.src = url;
      media.poster = trigger.dataset.poster || '';
      media.controls = true;
      media.autoplay = true;
      media.playsInline = true;
      media.preload = 'metadata';
      media.setAttribute('aria-label', trigger.dataset.mediaCaption || 'Vídeo da Aurora Beauty');
    } else {
      media = document.createElement('img');
      media.src = url;
      media.alt = trigger.dataset.mediaCaption || 'Imagem da Aurora Beauty ampliada';
    }
    lightboxStage.replaceChildren(media);
    lightboxCaption.textContent = trigger.dataset.mediaCaption || 'Aurora Beauty';
    lightbox.showModal();
    if (isVideo) media.play().catch(() => {});
    lightboxClose.focus();
  });
});
function closeLightbox() {
  if (lightbox.open) lightbox.close();
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
lightbox.addEventListener('close', () => {
  const video = lightboxStage.querySelector('video');
  if (video) video.pause();
  lightboxStage.replaceChildren();
  triggerBeforeDialog?.focus({ preventScroll: true });
});
renderMenu();
