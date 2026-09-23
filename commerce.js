/* Local demo inventory. Not an authoritative store or a production admin. */
(() => {
  const sizes = ['XS', 'Small', 'Medium', 'Large', 'X Large', 'Oversize'];
  const prices = {europe:5999, capital:4999, black:4999, casual:3999};
  const initialStock = [2, 5, 8, 4, 1, 0];
  const products = new Map();
  const money = amount => new Intl.NumberFormat(window.DCMDLanguage?.locale || 'en-IE', {style:'currency',currency:'EUR'}).format(amount);
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.querySelector('img').getAttribute('src').split('/').pop().split('?')[0].replace(/-front(?:-cutout)?\.(?:jpe?g|png)$/i,'');
    const product = {id, name:card.dataset.name, collection:card.dataset.collection, priceCents:prices[card.dataset.collection], stock:Object.fromEntries(sizes.map((size,i) => [size,initialStock[i]])), card};
    products.set(id,product); card.dataset.productId = id;
    card.dataset.price = (product.priceCents / 100).toFixed(2);
    card.querySelector('.product-info strong').textContent = money(product.priceCents / 100);
    const controls = document.createElement('div'); controls.className = 'variant-controls';
    const label = document.createElement('label'); label.textContent = 'Beden / Size';
    const select = document.createElement('select'); select.className = 'size-select';
    select.setAttribute('aria-label', `${product.name} — Beden / Size`);
    sizes.forEach(size => select.add(new Option(size,size))); select.value = 'Medium'; label.append(select);
    const status = document.createElement('p'); status.className = 'stock-status'; status.setAttribute('role','status');
    const demo = document.createElement('small'); demo.textContent = 'Talep üzerine üretim · Test kapasitesi';
    controls.append(label,status,demo); card.querySelector('.add').before(controls);
    const quantityLabel=document.createElement('label');quantityLabel.textContent='Quantity';
    const quantity=document.createElement('input');quantity.type='number';quantity.className='quantity-input';
    quantity.min='1';quantity.step='1';quantity.value='1';quantity.inputMode='numeric';quantity.required=true;
    quantity.setAttribute('aria-label','Quantity');quantityLabel.append(quantity);controls.append(quantityLabel);
    select.addEventListener('change',renderStocks);
  });
  function renderStocks() {
    products.forEach(product => {
      const card = product.card, size = card.querySelector('.size-select').value, remaining = product.stock[size];
      const status = card.querySelector('.stock-status');
      status.textContent = remaining === 0 ? 'Üretim kapasitesi dolu' : remaining <= 3 ? `Son ${remaining} üretim kontenjanı!` : `Üretime uygun · ${remaining} test kontenjanı`;
      status.dataset.level = remaining === 0 ? 'empty' : remaining <= 3 ? 'low' : 'available';
      const button = card.querySelector('.add'); button.disabled = remaining === 0;
      const quantity=card.querySelector('.quantity-input');
      quantity.max=String(Math.max(1,remaining));quantity.disabled=remaining===0;
      if(Number(quantity.value)>remaining)quantity.value=String(Math.max(1,remaining));
      button.textContent = remaining === 0 ? 'Kapasite dolu' : 'ADD TO CART';
    });
    renderInventory();
    window.dispatchEvent(new Event('dcmd:stockchange'));
  }
  function validate(lines) {
    const counts = new Map();
    for (const line of lines) {
      const p = products.get(line.productId);
      if (!p || !sizes.includes(line.size) || Math.round(line.price * 100) !== p.priceCents) return 'Ürün veya fiyat değişti. Sepeti yeniden oluştur.';
      const key = `${p.id}:${line.size}`; counts.set(key,(counts.get(key)||0)+1);
      if (counts.get(key) > p.stock[line.size]) return `${p.name} / ${line.size}: yeterli test üretim kapasitesi yok.`;
    }
    return '';
  }
  function commit(lines) {
    const error = validate(lines); if (error) return error;
    lines.forEach(line => {products.get(line.productId).stock[line.size]--;});
    renderStocks(); return '';
  }
  function renderInventory() {
    const root = document.querySelector('#inventoryRows'); if (!root) return;
    root.replaceChildren();
    products.forEach(p => sizes.forEach(size => {
      const row = document.createElement('tr');
      [p.name,size,String(p.stock[size]),p.stock[size] === 0 ? 'Kapasite dolu' : p.stock[size] <= 3 ? 'Kritik kapasite' : 'Üretime uygun'].forEach(value => {const cell=document.createElement('td');cell.textContent=value;row.append(cell);});
      root.append(row);
    }));
  }
  window.DCMDCommerce = {money,products,sizes,validate,commit,renderStocks,mode:'demo',policyVersion:'2026-09-16-draft'};
  renderStocks();
  document.querySelector('#inventoryOpen').addEventListener('click', () => document.querySelector('#inventoryDialog').showModal());
  document.querySelector('#inventoryClose').addEventListener('click', () => document.querySelector('#inventoryDialog').close());
  document.querySelector('#inventoryReset').addEventListener('click', () => {products.forEach(p => sizes.forEach((s,i) => {p.stock[s]=initialStock[i];}));renderStocks();});
  const poll = document.querySelector('#capitalPoll');
  const pollDialog = document.querySelector('#capitalVote');
  const pollOpen = document.querySelector('#pollOpen');
  const confirmation = document.querySelector('#pollConfirmation');
  document.querySelector('#pollChange').addEventListener('click', () => {
    confirmation.hidden = true;
    poll.hidden = false;
    (poll.querySelector('input:checked') || poll.querySelector('input')).focus();
  });
  pollOpen.addEventListener('click', () => {pollDialog.showModal();pollOpen.setAttribute('aria-expanded','true');});
  document.querySelector('#pollClose').addEventListener('click', () => pollDialog.close());
  pollDialog.addEventListener('close', () => {pollOpen.setAttribute('aria-expanded','false');pollOpen.focus({preventScroll:true});});
  pollDialog.addEventListener('click', event => {
    if (event.target !== pollDialog) return;
    const box = pollDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) pollDialog.close();
  });
  try {
    const saved = JSON.parse(localStorage.getItem('dcmd-demo-vote'));
    const option = [...poll.elements.city].find(input => input.value === saved?.city);
    if (option) option.checked = true;
  } catch {}
  poll.addEventListener('submit', event => {
    event.preventDefault();
    const city = new FormData(poll).get('city');
    if (!poll.reportValidity() || ![...poll.elements.city].some(input => input.value === city)) return;
    document.querySelector('#pollStatus').textContent = `${city} seçimin test için kaydedildi. Bu tarayıcıda değiştirebilirsin; ortak oylama henüz açık değil.`;
    try {
      localStorage.setItem('dcmd-demo-vote',JSON.stringify({city,at:new Date().toISOString()}));
      confirmation.querySelector('h3').textContent = 'Your selection is saved.';
    } catch {
      confirmation.querySelector('h3').textContent = 'Selection could not be saved.';
      document.querySelector('#pollStatus').textContent = 'Browser storage is unavailable. Please try again.';
    }
    poll.hidden = true;
    confirmation.hidden = false;
    confirmation.focus({preventScroll:true});
  });
  document.querySelector('#clearDemoData').addEventListener('click', () => {
    ['dcmd-demo-order','dcmd-demo-vote','dcmd-feedback'].forEach(key => {try{localStorage.removeItem(key);}catch{}});
    poll.reset();
    poll.hidden = false;
    confirmation.hidden = true;
    window.dispatchEvent(new Event('dcmd:cleardemo'));
    document.querySelector('#pollStatus').textContent='Bu tarayıcıdaki test kayıtları temizlendi.';
  });
  const returnDialog = document.querySelector('#returnDialog');
  document.querySelector('#returnOpen').addEventListener('click', () => returnDialog.showModal());
  document.querySelector('#returnClose').addEventListener('click', () => returnDialog.close());
  document.querySelector('#returnForm').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.target);
    document.querySelector('#returnPreview').textContent = `Önizleme: ${data.get('order')} siparişi için cayma/iade talebi. Yanıt adresi: ${data.get('email')}. Gönderilmedi ve saklanmadı.`;
  });
  returnDialog.addEventListener('close', () => {document.querySelector('#returnForm').reset();document.querySelector('#returnPreview').textContent='';});
})();
