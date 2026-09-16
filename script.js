const productCards = [...document.querySelectorAll('.product-card')];
const shopReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function animateShopElement(element, frames, duration) {
  element.getAnimations().forEach(animation => animation.cancel());
  if (shopReducedMotion.matches || navigator.connection?.saveData) return;
  element.animate(frames, {duration, easing:'cubic-bezier(.22,.7,.3,1)'});
}
const siteMenu = document.querySelector('#siteMenu');
const menuOpen = document.querySelector('#menuOpen');
menuOpen.addEventListener('click', () => {
  siteMenu.showModal();
  menuOpen.setAttribute('aria-expanded', 'true');
});
document.querySelector('#menuClose').addEventListener('click', () => siteMenu.close());
siteMenu.addEventListener('close', () => {
  menuOpen.setAttribute('aria-expanded', 'false');
});
siteMenu.addEventListener('click', event => {
  if (event.target !== siteMenu) return;
  const box = siteMenu.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) siteMenu.close();
});
siteMenu.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => siteMenu.close()));
// Close the modal before opening controls that live outside its focus trap.
['searchButton', 'cartButton', 'musicOpen'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => siteMenu.close());
});

document.querySelectorAll('.product-gallery').forEach(gallery => {
  const track = gallery.querySelector('.product-img');
  const photos = [...track.querySelectorAll('img')];
  const dots = [...gallery.querySelectorAll('[data-slide]')];
  const previous = gallery.querySelector('.gallery-prev');
  const next = gallery.querySelector('.gallery-next');
  let lastSlide = 0;
  let glowTimer;
  const current = () => Math.round(track.scrollLeft / (track.clientWidth || 1));
  const go = index => track.scrollTo({left: Math.max(0, Math.min(dots.length - 1, index)) * track.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  const update = () => {
    const index = current();
    const photo = photos[index];
    if (photo?.naturalWidth && photo.naturalHeight) {
      track.style.aspectRatio = `${photo.naturalWidth} / ${photo.naturalHeight}`;
    }
    if (index !== lastSlide) {
      lastSlide = index;
      if (!shopReducedMotion.matches && !navigator.connection?.saveData) {
        gallery.classList.add('is-changing');
        clearTimeout(glowTimer);
        glowTimer = setTimeout(() => gallery.classList.remove('is-changing'), 420);
      }
    }
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    previous.disabled = index === 0;
    next.disabled = index === dots.length - 1;
  };
  previous.addEventListener('click', () => go(current() - 1));
  next.addEventListener('click', () => go(current() + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  track.addEventListener('scroll', update, {passive:true});
  photos.forEach(photo => photo.addEventListener('load', update));
  track.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    go(current() + (event.key === 'ArrowRight' ? 1 : -1));
  });
  update();
});
const categoryInputs = [...document.querySelectorAll('input[name="category"]')];
const priceInputs = [...document.querySelectorAll('input[name="price"]')];
const resultCount = document.querySelector('#resultCount');
const searchPanel = document.querySelector('#searchPanel');
const searchInput = document.querySelector('#productSearch');
const cartPanel = document.querySelector('#cartPanel');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const cartButton = document.querySelector('#cartButton');
const themeToggle = document.querySelector('#themeToggle');
const feedbackModal = document.querySelector('#feedbackModal');
const feedbackForm = document.querySelector('#feedbackForm');
const feedbackStatus = document.querySelector('#feedbackStatus');

let searchTerm = '';
let cart = [];
const collectionNames = {all:'New Arrivals', europe:'Europe Edition', black:'Black Edition', casual:'Casual Collection', capital:'Capital Collection', country:'Country Collection'};
const collectionInputs = [...document.querySelectorAll('input[name="collection"]')];
function selectCollection(value) {
  document.querySelector(`input[name="collection"][value="${value}"]`).checked = true;
  resetFilters();
}
collectionInputs.forEach(input => input.addEventListener('change', applyFilters));
document.querySelectorAll('[data-collection-link]').forEach(link => link.addEventListener('click', () => selectCollection(link.dataset.collectionLink)));

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isLight = theme === 'light';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to night mode' : 'Switch to light mode');
  themeToggle.title = isLight ? 'Night mode' : 'Day mode';
  localStorage.setItem('dcmd-theme', theme);
}

const savedTheme = localStorage.getItem('dcmd-theme');
setTheme(savedTheme === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
});

document.querySelector('#feedbackButton').addEventListener('click', () => {
  feedbackStatus.textContent = '';
  openPanel(feedbackModal);
});

document.querySelector('#closeFeedback').addEventListener('click', () => closePanel(feedbackModal));
feedbackModal.addEventListener('click', (event) => {
  if (event.target === feedbackModal) closePanel(feedbackModal);
});

feedbackForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(feedbackForm);
  const savedFeedback = JSON.parse(localStorage.getItem('dcmd-feedback') || '[]');
  savedFeedback.push({
    type:formData.get('feedbackType'),
    category:formData.get('feedbackCategory'),
    message:formData.get('feedbackMessage'),
    email:formData.get('feedbackEmail'),
    createdAt:new Date().toISOString()
  });

  localStorage.setItem('dcmd-feedback', JSON.stringify(savedFeedback));
  feedbackForm.reset();
  feedbackStatus.textContent = 'Thank you. Your message has been saved.';
});

function applyFilters() {
  const collection = document.querySelector('input[name="collection"]:checked').value;
  const collectionCards = productCards.filter(card => collection === 'all' || card.dataset.collection === collection);
  document.querySelector('#selectedCollectionTitle').textContent = collectionNames[collection];
  categoryInputs.forEach(input => {
    input.closest('label').querySelector('small').textContent = collectionCards.filter(card => input.value === 'all' || card.dataset.category === input.value).length;
  });
  document.querySelectorAll('[data-collection-count]').forEach(count => {
    const key = count.dataset.collectionCount;
    const total = productCards.filter(card => key === 'all' || card.dataset.collection === key).length;
    count.textContent = total || 'Coming soon';
  });
  const category = document.querySelector('input[name="category"]:checked').value;
  const priceRange = document.querySelector('input[name="price"]:checked').value;
  const [minimum, maximum] = priceRange === 'all'
    ? [0, Infinity]
    : priceRange.split('-').map(Number);

  let visibleProducts = 0;

  productCards.forEach((card) => {
    const price = Number(card.dataset.price);
    const name = card.dataset.name.toLowerCase();
    const matchesCategory = category === 'all' || card.dataset.category === category;
    const matchesPrice = priceRange === 'all' || (card.dataset.price !== '' && price >= minimum && price <= maximum);
    const matchesSearch = name.includes(searchTerm.toLowerCase());
    const isVisible = matchesCategory && matchesPrice && matchesSearch && collectionCards.includes(card);

    const entering = card.hidden && isVisible;
    card.hidden = !isVisible;
    if (entering) animateShopElement(card, [
      {opacity:0, transform:'translateY(8px)'},
      {opacity:1, transform:'translateY(0)'}
    ], 260);
    if (isVisible) visibleProducts += 1;
  });

  resultCount.textContent = `${visibleProducts} ${visibleProducts === 1 ? 'piece' : 'pieces'}`;
  const empty = document.querySelector('#productsEmpty');
  empty.hidden = visibleProducts > 0;
  empty.textContent = collectionCards.length ? 'No products match these filters.' : 'Coming soon';
}

function resetFilters() {
  document.querySelector('input[name="category"][value="all"]').checked = true;
  document.querySelector('input[name="price"][value="all"]').checked = true;
  searchTerm = '';
  searchInput.value = '';
  applyFilters();
}

function openPanel(panel) {
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

function closePanel(panel) {
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is currently empty.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-row">
        <span>${item.name}</span>
        <strong>$${item.price}</strong>
        <button type="button" data-remove="${index}" aria-label="Remove ${item.name}">REMOVE</button>
      </div>
    `).join('');
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `$${total}`;
  cartButton.textContent = `CART (${cart.length})`;
}

categoryInputs.forEach((input) => input.addEventListener('change', applyFilters));
priceInputs.forEach((input) => input.addEventListener('change', applyFilters));
document.querySelector('#clearFilters').addEventListener('click', resetFilters);

document.querySelector('#searchButton').addEventListener('click', () => {
  openPanel(searchPanel);
  window.setTimeout(() => searchInput.focus(), 250);
});

document.querySelector('#closeSearch').addEventListener('click', () => closePanel(searchPanel));
searchPanel.addEventListener('click', (event) => {
  if (event.target === searchPanel) closePanel(searchPanel);
});

searchInput.addEventListener('input', () => {
  searchTerm = searchInput.value.trim();
  applyFilters();
  document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
});

cartButton.addEventListener('click', () => openPanel(cartPanel));
document.querySelector('#closeCart').addEventListener('click', () => closePanel(cartPanel));

document.querySelectorAll('.add').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    cart.push({ name: card.dataset.name, price: Number(card.dataset.price) });
    renderCart();
    openPanel(cartPanel);
  });
});

cartItems.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove]');
  if (!removeButton) return;

  cart.splice(Number(removeButton.dataset.remove), 1);
  renderCart();
});

document.querySelector('.checkout').addEventListener('click', () => {
  window.alert(window.DCMDLanguage.t(cart.length ? 'Checkout will be available soon.' : 'Your cart is empty.'));
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closePanel(searchPanel);
  closePanel(cartPanel);
  closePanel(feedbackModal);
});

function skipDecorativeMotion() {
  return document.hidden || window.matchMedia('(prefers-reduced-motion: reduce), (hover: none) and (pointer: coarse)').matches;
}

function launchShootingStar() {
  if (skipDecorativeMotion()) return;

  const hero = document.querySelector('.hero');
  const heroBounds = hero.getBoundingClientRect();
  if (heroBounds.bottom <= 0 || heroBounds.top >= window.innerHeight) return;
  const star = document.querySelector('.shooting-star');
  const width = hero.clientWidth;
  const height = hero.clientHeight;
  const startX = -180 + Math.random() * (width * 0.65);
  const startY = -40 + Math.random() * (height * 0.48);
  const travelX = width * (0.65 + Math.random() * 0.55);
  const travelY = height * (0.25 + Math.random() * 0.45);
  const angle = Math.atan2(travelY, travelX) * (180 / Math.PI);

  star.getAnimations().forEach((animation) => animation.cancel());
  star.animate([
    { transform:`translate(${startX}px, ${startY}px) rotate(${angle}deg)`, opacity:0 },
    { opacity:1, offset:.12 },
    { transform:`translate(${startX + travelX}px, ${startY + travelY}px) rotate(${angle}deg)`, opacity:0 }
  ], {
    duration:850 + Math.random() * 300,
    easing:'cubic-bezier(.2,.65,.35,1)',
    fill:'forwards'
  });
}

window.setTimeout(launchShootingStar, 1200);
window.setInterval(launchShootingStar, 12000);

function launchRedStar(delay = 0) {
  window.setTimeout(() => {
    if (skipDecorativeMotion()) return;

    const star = document.createElement('span');
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const startsFromTop = Math.random() > .5;
    const startX = startsFromTop
      ? Math.random() * viewportWidth * .8
      : -160;
    const startY = startsFromTop
      ? -30
      : Math.random() * viewportHeight * .7;
    const travelX = viewportWidth * (.35 + Math.random() * .65);
    const travelY = viewportHeight * (.25 + Math.random() * .65);
    const angle = Math.atan2(travelY, travelX) * (180 / Math.PI);

    star.className = 'global-shooting-star';
    document.body.appendChild(star);

    const animation = star.animate([
      { transform:`translate(${startX}px, ${startY}px) rotate(${angle}deg)`, opacity:0 },
      { opacity:1, offset:.12 },
      { transform:`translate(${startX + travelX}px, ${startY + travelY}px) rotate(${angle}deg)`, opacity:0 }
    ], {
      duration:800 + Math.random() * 400,
      easing:'cubic-bezier(.2,.65,.35,1)',
      fill:'forwards'
    });

    animation.addEventListener('finish', () => star.remove());
  }, delay);
}

function launchRedStarBurst() {
  const amount = 2;

  for (let index = 0; index < amount; index += 1) {
    launchRedStar(index * (650 + Math.random() * 350));
  }
}

window.setTimeout(launchRedStarBurst, 3500);
window.setInterval(launchRedStarBurst, 15000);
applyFilters();
renderCart();

// Only move the announcement strip while it is visible.
const marquee = document.querySelector('.marquee');
let marqueeVisible = false;
function syncMarquee() {
  marquee.classList.toggle('is-paused', document.hidden || !marqueeVisible);
}
new IntersectionObserver(([entry]) => {
  marqueeVisible = entry.isIntersecting;
  syncMarquee();
}).observe(marquee);
document.addEventListener('visibilitychange', syncMarquee);
syncMarquee();

// Update this revision when publishing a new announcement to show the unread dot again.
const announcementRevision = 'welcome-gift-v1';
const notificationsDialog = document.querySelector('#notificationsDialog');
const notificationsButton = document.querySelector('#notificationsButton');
const notificationsUnread = document.querySelector('#notificationsUnread');
try { notificationsUnread.hidden = localStorage.getItem('dcmd-notices-read') === announcementRevision; } catch {}
notificationsButton.addEventListener('click', () => {
  notificationsDialog.showModal();
  notificationsUnread.hidden = true;
  try {localStorage.setItem('dcmd-notices-read', announcementRevision);} catch {}
});
document.querySelector('#notificationsClose').addEventListener('click', () => notificationsDialog.close());
notificationsDialog.addEventListener('click', event => {
  if (event.target !== notificationsDialog) return;
  const box = notificationsDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) notificationsDialog.close();
});
document.querySelector('#noticeShop').addEventListener('click', () => notificationsDialog.close());
notificationsDialog.addEventListener('close', () => notificationsButton.focus({preventScroll:true}));

// Add announced events here as { title, description, endsAt: '2026-12-31T23:59:00Z' }.
const announcedEvents = [];
function renderAnnouncements() {
  const list = document.querySelector('#noticeEventsList');
  list.replaceChildren();
  const active = announcedEvents.filter(event => Date.parse(event.endsAt) > Date.now());
  document.querySelector('#noticeEventsEmpty').hidden = active.length > 0;
  active.forEach(event => {
    const article = document.createElement('article');
    article.className = 'notice-card';
    const title = document.createElement('h3'), description = document.createElement('p');
    title.textContent = event.title; description.textContent = event.description;
    article.append(title, description); list.append(article);
  });
}
notificationsButton.addEventListener('click', renderAnnouncements);
renderAnnouncements();
