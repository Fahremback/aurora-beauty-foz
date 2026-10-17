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
const ambientVideo = document.querySelector('.hero-video');
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
renderMenu();
