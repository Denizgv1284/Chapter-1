(() => {
  const panel=document.querySelector('#megaPanel');
  const footerLanguage=document.querySelector('#footerLanguage');
  footerLanguage.value=window.DCMDLanguage?.language||'en';
  footerLanguage.addEventListener('change',()=>document.querySelector(`[data-language="${footerLanguage.value}"]`)?.click());
  window.addEventListener('dcmd:languagechange',()=>footerLanguage.value=window.DCMDLanguage.language);
  const triggers=[...document.querySelectorAll('[data-mega-view]')];
  let currentTrigger=null, hoverTimer;
  const categories = [
    ['all','All pieces','essential-tshirt-front-cutout.png'],
    ['tshirt','T-shirts','europe-tshirt-front-cutout.png'],
    ['hoodie','Hoodies','hoodie-front-cutout.png'],
    ['pants','Pants','pants-front-cutout.png'],
    ['shorts','Shorts','casual-shorts-front-cutout.png']
  ];
  const editions = [
    ['all','Unisex / New arrivals','essential-tshirt-front-cutout.png'],
    ['capital','Capital Collection','capital-london-front-cutout.png'],
    ['europe','Europe Edition','europe-tshirt-front-cutout.png'],
    ['black','Black Edition','hoodie-front-cutout.png'],
    ['casual','Casual Collection','casual-tee-front-cutout.png'],
    ['country','Country Collection',null]
  ];
  const positionPanel=()=>panel.style.top=`${Math.round(document.querySelector('.site-nav').getBoundingClientRect().bottom)}px`;
  new ResizeObserver(positionPanel).observe(document.querySelector('.site-nav'));
  function previewMenu(item, type) {
    const visuals=panel.querySelector('.megamenu-visuals');
    const [value,title,src]=item;
    const available=Boolean(src);
    const back=src?.replace('-front-cutout','-back-cutout');
    visuals.innerHTML=available ? `<a class="visual-card" href="#products" data-menu-filter="${value}" data-filter-type="${type}"><div class="menu-image-square"><img src="images/${src.replace(/\.[^.]+$/,'-480.webp')}" decoding="async" alt="${title} — front"></div><span>${title} / UNISEX</span></a><a class="visual-card" href="#products" data-menu-filter="${value}" data-filter-type="${type}"><div class="menu-image-square"><img src="images/${back.replace(/\.[^.]+$/,'-480.webp')}" decoding="async" alt="${title} — back"></div><span>Explore the collection ↗</span></a>` : `<div class="menu-coming"><span class="eyebrow">DCMD / ${title}</span><strong>Coming soon</strong><p>Yeni bölüm hazırlanıyor.</p><a href="#products" data-menu-filter="all" data-filter-type="collection">Explore unisex ↗</a></div>`;
    panel.querySelectorAll('[data-preview]').forEach(link=>link.classList.toggle('is-current',link.dataset.menuFilter===value));
  }
  function renderMenu(view) {
    panel.dataset.view=view;
    panel.setAttribute('aria-label',view==='collections'?'Collections':view==='unisex'?'Unisex':view==='mens'?'Mens — Coming soon':'Womens — Coming soon');
    const links=panel.querySelector('.megamenu-links');
    if(view==='mens'||view==='womens') {
      const title=view==='mens'?'Mens':'Womens';
      links.innerHTML=`<span class="eyebrow">DCMD / ${title.toUpperCase()}</span><h2>${title}</h2><p class="menu-release">Coming soon</p><p>Şu anki tüm parçalarımız unisex. Kadın ve erkek koleksiyonları yakında.</p><a href="#products" data-menu-filter="all" data-filter-type="collection">Shop unisex ↗</a>`;
      panel.querySelector('.megamenu-visuals').innerHTML=`<div class="menu-coming"><span class="eyebrow">${title.toUpperCase()} / NEXT CHAPTER</span><strong>Coming soon</strong></div><a class="visual-card" href="#products" data-menu-filter="all" data-filter-type="collection"><div class="menu-image-square"><img src="images/${view==='mens'?'model-black-hoodie-front-cutout-480.webp':'model-warsaw-front-back-cutout-480.webp'}" alt="DCMD unisex collection"></div><span>UNISEX / AVAILABLE NOW ↗</span></a>`;
      return;
    }
    const items=view==='unisex'?categories:editions,type=view==='unisex'?'category':'collection';
    links.innerHTML=`<span class="eyebrow">DCMD / ${view.toUpperCase()}</span><h2>${view==='unisex'?'Made for everyone.':'The collections.'}</h2>`+items.map(([value,title,src])=>`<a href="#products" data-preview data-menu-filter="${value}" data-filter-type="${type}" ${src?'':'data-coming="true"'}>${title}${src?'':' <small>Coming soon</small>'}</a>`).join('');
    if(view==='unisex')links.insertAdjacentHTML('beforeend','<span class="menu-unavailable">Footwear / Accessories <small>Coming soon</small></span>');
    links.querySelectorAll('[data-preview]').forEach((link,i)=>{
      link.addEventListener('pointerenter',()=>previewMenu(items[i],type));
      link.addEventListener('focus',()=>previewMenu(items[i],type));
    });
    previewMenu(items[0],type);
  }
  const closeMenu=(restore=false)=>{
    clearTimeout(hoverTimer);panel.hidden=true;
    triggers.forEach(button=>button.setAttribute('aria-expanded','false'));
    if(restore)currentTrigger?.focus();
  };
  const openMenu=button=>{
    clearTimeout(hoverTimer);
    document.querySelector('#siteMenu').close();
    renderMenu(button.dataset.megaView);positionPanel();
    currentTrigger=button;panel.hidden=false;
    triggers.forEach(item=>item.setAttribute('aria-expanded',String(item===button)));
  };
  triggers.forEach(button=>{
    button.addEventListener('click',()=>button.getAttribute('aria-expanded')==='true'?closeMenu():openMenu(button));
    button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')hoverTimer=setTimeout(()=>openMenu(button),180);});
    button.addEventListener('pointerleave',()=>clearTimeout(hoverTimer));
    button.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();openMenu(button);panel.querySelector('a').focus();}});
  });
  panel.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse')closeMenu();});
  document.querySelector('#megaClose').addEventListener('click',()=>closeMenu(true));
  panel.addEventListener('click',event=>{
    const link=event.target.closest('[data-menu-filter]');if(!link)return;
    event.preventDefault();
    if(link.dataset.coming){previewMenu(editions.find(item=>item[0]===link.dataset.menuFilter),'collection');return;}
    window.DCMDShop.selectCollection(link.dataset.filterType==='collection'?link.dataset.menuFilter:'all');
    if(link.dataset.filterType==='category'){
      const radio=document.querySelector(`input[name="category"][value="${link.dataset.menuFilter}"]`);
      if(radio){radio.checked=true;radio.dispatchEvent(new Event('change',{bubbles:true}));}
    }
    closeMenu();document.querySelector('#products').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();closeMenu(true);}});
  document.addEventListener('pointerdown',event=>{if(!panel.contains(event.target)&&!event.target.closest('[data-mega-view]'))closeMenu();});
  document.addEventListener('focusin',event=>{if(!panel.contains(event.target)&&!event.target.closest('[data-mega-view]'))closeMenu();});
  window.addEventListener('resize',()=>{closeMenu();positionPanel();});

  // Local demo order ledger, never an authoritative customer loyalty balance.
  let timer;
  const ledgerKey='dcmd-demo-loyalty-v1';
  const seenOrders=new Set();
  try {
    const saved=JSON.parse(localStorage.getItem(ledgerKey)||'[]');
    if(Array.isArray(saved))saved.filter(id=>typeof id==='string'&&id.startsWith('DCMD-TEST-')&&id.length<100).slice(0,10).forEach(id=>seenOrders.add(id));
  } catch {}
  const popup=document.querySelector('#pointsPopup');
  const status=document.querySelector('#rewardsStatus');
  function render(){
    document.querySelector('#rewardBalance').textContent=`${seenOrders.size} / 10`;
    document.querySelectorAll('#rewardStars span').forEach((star,index)=>star.classList.toggle('active',index<seenOrders.size));
  }
  function preview(){
    render();
    // A native checkout dialog is in the top layer; keep its toast visible there.
    (document.querySelector('dialog[open]') || document.body).append(popup);
    popup.hidden=false;
    clearTimeout(timer);timer=setTimeout(()=>popup.hidden=true,6500);
  }
  document.querySelector('#pointsClose').addEventListener('click',()=>{popup.hidden=true;clearTimeout(timer);});
  window.addEventListener('dcmd:demo-order',event=>{
    const id=event.detail?.id;
    if(typeof id!=='string'||!id.startsWith('DCMD-TEST-')||id.length>=100||seenOrders.has(id)||seenOrders.size>=10)return;
    seenOrders.add(id);
    try { localStorage.setItem(ledgerKey,JSON.stringify([...seenOrders])); }
    catch { status.textContent='Progress could not be saved. It is available for this session only.'; }
    preview();
  });
  window.addEventListener('dcmd:cleardemo',()=>{
    seenOrders.clear();try {localStorage.removeItem(ledgerKey);}catch {}
    render();popup.hidden=true;clearTimeout(timer);
  });
  document.querySelector('#newsletterForm').addEventListener('submit',event=>{
    event.preventDefault();
    if(!event.currentTarget.reportValidity())return;
    event.currentTarget.reset();
    document.querySelector('#newsletterStatus').textContent='Preview complete. No subscription was created and no email was stored.';
  });
  render();
})();
