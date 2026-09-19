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
['searchButton', 'cartButton'].forEach(id => {
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
  try {localStorage.setItem('dcmd-theme', theme);} catch {}
}

let savedTheme;
try {savedTheme = localStorage.getItem('dcmd-theme');} catch {}
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

  feedbackForm.reset();
  feedbackStatus.textContent = 'Test geri bildirimi alındı. Gönderilmedi veya saklanmadı.';
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
  if (panel === cartPanel && !panel.open) panel.showModal();
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

function closePanel(panel) {
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  if (panel === cartPanel && panel.open) panel.close();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is currently empty.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-row">
        <span>${item.name} / ${item.size}</span>
        <strong>${window.DCMDCommerce.money(item.price)}</strong>
        <button type="button" data-remove="${index}" aria-label="Remove ${item.name}">REMOVE</button>
      </div>
    `).join('');
  }

  const total = cart.reduce((sum, item) => sum + Math.round(item.price * 100), 0) / 100;
  cartTotal.textContent = window.DCMDCommerce.money(total);
  const badge = document.querySelector("#cartBadge");
  badge.textContent = String(cart.length);
  badge.hidden = cart.length === 0;
  cartButton.setAttribute("aria-label", `CART (${cart.length})`);
  document.querySelector('.checkout').disabled = cart.length === 0;
}

categoryInputs.forEach((input) => input.addEventListener('change', applyFilters));
window.addEventListener('dcmd:languagechange', () => {
  productCards.forEach(card => {
    card.querySelector('.product-info strong').textContent = window.DCMDCommerce.money(Number(card.dataset.price));
  });
  renderCart();
});
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
cartPanel.addEventListener('close', () => {
  cartPanel.classList.remove('open');cartPanel.setAttribute('aria-hidden','true');
  cartButton.focus({preventScroll:true});
});
cartPanel.addEventListener('click', event => {
  if(event.target!==cartPanel)return;
  const box=cartPanel.getBoundingClientRect();
  if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closePanel(cartPanel);
});

document.querySelectorAll('.add').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const line = {productId:card.dataset.productId, size:card.querySelector('.size-select').value, name:card.dataset.name, price:Number(card.dataset.price)};
    const quantity=card.querySelector('.quantity-input');
    if(!quantity.reportValidity()||!Number.isInteger(Number(quantity.value)))return;
    const count=Number(quantity.value);
    if(count<1||count>Number(quantity.max))return;
    const additions=Array.from({length:count},()=>({...line}));
    const error = window.DCMDCommerce.validate([...cart,...additions]);
    if (error) {card.querySelector('.stock-status').textContent = error;return;}
    cart.push(...additions);
    renderCart();
    if (!shopReducedMotion.matches) {
      document.querySelector('#cartBadge').animate(
        [{transform:'scale(1)'},{transform:'scale(1.3)'},{transform:'scale(1)'}],
        {duration:260,easing:'ease-out'}
      );
    }
    document.querySelector("#cartAnnouncement").textContent = `Added to cart (${cart.length})`;
    openPanel(cartPanel);
  });
});

cartItems.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove]');
  if (!removeButton) return;

  cart.splice(Number(removeButton.dataset.remove), 1);
  renderCart();
});

const checkoutDialog = document.querySelector('#checkoutDialog');
const checkoutForm = document.querySelector('#checkoutForm');
const trackingDialog = document.querySelector('#trackingDialog');
const testOrders = new Map();
const accountDialog = document.querySelector('#accountDialog');
document.querySelector('#accountOpen').addEventListener('click', () => accountDialog.showModal());
document.querySelector('#accountClose').addEventListener('click', () => accountDialog.close());
accountDialog.addEventListener('close', () => document.querySelector('#accountOpen').focus({preventScroll:true}));
accountDialog.addEventListener('click', event => {if(event.target === accountDialog) accountDialog.close();});
// Only trusted server order data may drive real fulfillment once commerce is connected.
// Existing orders are browser-local demos; never infer shipment from elapsed time.
function orderStatusElement(status = 'processing') {
  const labels = {processing:'Processing',shipped:'Shipped',cancelled:'Cancelled'};
  const state = Object.hasOwn(labels,status) ? status : 'processing';
  const wrapper = document.createElement('div');
  const badge = document.createElement('p');
  badge.className = 'order-status';
  badge.dataset.status = state;
  badge.setAttribute('role','status');
  badge.textContent = labels[state] + ' · Demo';
  wrapper.append(badge);
  if(state === 'cancelled') {
    const info = document.createElement('details');info.className='order-support';
    const title=document.createElement('summary');title.textContent='ⓘ Support contacts';
    const message=document.createElement('p');message.textContent='Support email is not configured yet.';
    info.append(title,message);wrapper.append(info);
  }
  return wrapper;
}
window.addEventListener('dcmd:cleardemo', () => {testOrders.clear();document.querySelector('#orderEmailPreview').textContent='';trackingDialog.close();});
const paymentNames = {credit:'Kredi kartı', debit:'Banka kartı', apple:'Apple Pay', paypal:'PayPal'};
const money = window.DCMDCommerce.money;
let checkoutSnapshot = [];
function updateDemoPayment() {
  const method = checkoutForm.elements.payment.value;
  const wallet = method === 'apple' || method === 'paypal';
  document.querySelector('#demoCard').hidden = wallet;
  document.querySelector('#walletDemo').hidden = !wallet;
  document.querySelector('#walletDemo').textContent = wallet ? `${paymentNames[method]} test simülasyonu. Hesap açılmaz, giriş yapılmaz ve para çekilmez.` : '';
}
checkoutForm.querySelectorAll('[name="payment"]').forEach(input => input.addEventListener('change', updateDemoPayment));
document.querySelector('.checkout').addEventListener('click', () => {
  if (!cart.length) return;
  checkoutSnapshot = cart.map(item => ({...item}));
  checkoutForm.reset();
  updateDemoPayment();
  document.querySelector('#checkoutSuccess').hidden = true;
  checkoutForm.hidden = false;
  document.querySelector('#checkoutError').textContent = '';
  const list = document.querySelector('#checkoutItems');
  list.replaceChildren();
  checkoutSnapshot.forEach(item => {
    const row = document.createElement('p');
    row.className = 'checkout-item';
    const name = document.createElement('span'); name.textContent = `${item.name} / ${item.size}`;
    const price = document.createElement('strong'); price.textContent = money(item.price);
    row.append(name, price); list.append(row);
  });
  const total = checkoutSnapshot.reduce((sum, item) => sum + Math.round(item.price * 100), 0) / 100;
  document.querySelector('#checkoutSubtotal').textContent = money(total);
  document.querySelector('#checkoutTotal').textContent = money(total);
  closePanel(cartPanel);
  checkoutDialog.showModal();
});
document.querySelector('#checkoutClose').addEventListener('click', () => checkoutDialog.close());
checkoutDialog.addEventListener('close', () => {
  checkoutForm.reset();
  document.querySelector('#orderEmailPreview').textContent = '';
  cartButton.focus({preventScroll:true});
});
checkoutForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!checkoutSnapshot.length || !checkoutForm.reportValidity()) return;
  const fields = new FormData(checkoutForm);
  if (['customer','address','city','postal','country'].some(key => !String(fields.get(key)).trim())) {
    document.querySelector('#checkoutError').textContent = 'Lütfen teslimat alanlarını boş bırakma.';
    return;
  }
  const capacityError = window.DCMDCommerce.commit(checkoutSnapshot);
  if (capacityError) {document.querySelector('#checkoutError').textContent = capacityError;return;}
  const order = {
    id:`DCMD-TEST-${crypto.randomUUID()}`,
    createdAt:new Date().toISOString(),
    items:checkoutSnapshot.map(item => ({...item})),
    total:checkoutSnapshot.reduce((sum, item) => sum + Math.round(item.price * 100), 0) / 100,
    currency:'EUR',
    status:'processing',
    policyVersion:window.DCMDCommerce.policyVersion,
    termsAcceptedAt:new Date().toISOString(),
    marketingPreview:fields.get('marketing') === 'on',
    method:paymentNames[fields.get('payment')]
  };
  // Store only the anonymous demo receipt, never contact, address or card data.
  testOrders.set(order.id, order);
  try {
    localStorage.setItem('dcmd-demo-order', JSON.stringify(order));
  } catch { /* In-memory tracking still works if browser storage is unavailable. */ }
  const link = new URL(location.href); link.hash = `track=${order.id}`;
  document.querySelector('#orderTrackLink').href = link.href;
  document.querySelector('#orderConfirmation').textContent = `${order.id} · ${money(order.total)} · ${order.method} (test)`;
  document.querySelector('#checkoutSuccess .order-status-block')?.remove();
  const statusBlock=orderStatusElement(order.status);statusBlock.className='order-status-block';
  document.querySelector('#orderConfirmation').after(statusBlock);
  document.querySelector('#orderEmailPreview').textContent = [
    `Alıcı: ${fields.get('email')}`,
    `Konu: DCMD test siparişin alındı — ${order.id}`,
    '', `Merhaba ${String(fields.get('customer')).trim()},`,
    'DCMD test siparişini aldık. Bu işlemde ödeme alınmadı ve ürün gönderilmeyecek.',
    '', ...order.items.map(item => `1 × ${item.name} / ${item.size} — ${money(item.price)}`),
    '', `Toplam: ${money(order.total)}`, `Ödeme: ${order.method} — simülasyon`,
    '', `Test takip bağlantın: ${link.href}`,
    'Bu bağlantı yalnızca siparişi oluşturduğun tarayıcıdaki son test kaydı için geçerlidir.',
    '', 'Bu bir e-posta önizlemesidir; gönderilmedi.', 'DCMD — Don’t Fit In. Stand Out.'
  ].join('\n');
  cart = []; checkoutSnapshot = []; renderCart();
  checkoutForm.reset(); checkoutForm.hidden = true;
  document.querySelector('#checkoutSuccess').hidden = false;
  document.querySelector('#orderTrackLink').focus();
});
function showTestTracking() {
  if (!location.hash.startsWith('#track=')) return;
  const id = location.hash.slice(7);
  let order = testOrders.get(id);
  if (!order) {
    try { const stored = JSON.parse(localStorage.getItem('dcmd-demo-order')); if (stored?.id === id) order = stored; } catch {}
  }
  const content = document.querySelector('#trackingContent'); content.replaceChildren();
  const valid = order && order.currency === 'EUR' && Array.isArray(order.items) && Number.isFinite(order.total) && Number.isFinite(Date.parse(order.createdAt));
  const description = document.createElement('p');
  description.textContent = valid ? `${order.id} · ${new Date(order.createdAt).toLocaleString()} · ${money(order.total)}` : 'Bu tarayıcıda bu test siparişi bulunamadı. Takip, siparişin oluşturulduğu tarayıcıda son kayıt için kullanılabilir.';
  content.append(description);
  if (valid) {
    content.append(orderStatusElement(order.status));
    const steps = document.createElement('ol'); steps.className = 'tracking-steps';
    ['Test siparişi alındı', 'Hazırlanıyor — testte başlatılmadı', 'Kargoya verildi — testte başlatılmadı', 'Teslim edildi — testte başlatılmadı'].forEach((text, index) => {
      const step = document.createElement('li'); step.textContent = text;
      if (!index) step.setAttribute('aria-current','step'); steps.append(step);
    });
    content.append(steps);
  }
  checkoutDialog.close(); siteMenu.close();
  if (!trackingDialog.open) trackingDialog.showModal();
}
document.querySelector('#trackingClose').addEventListener('click', () => trackingDialog.close());
trackingDialog.addEventListener('close', () => { if (location.hash.startsWith('#track=')) history.replaceState(null,'',location.pathname + location.search + '#products'); });
window.addEventListener('hashchange', showTestTracking);
showTestTracking();

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
