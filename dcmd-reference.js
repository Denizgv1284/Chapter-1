(() => {
  const panel=document.querySelector('#megaPanel');
  const footerLanguage=document.querySelector('#footerLanguage');
  footerLanguage.value=window.DCMDLanguage?.language||'en';
  footerLanguage.addEventListener('change',()=>document.querySelector(`[data-language="${footerLanguage.value}"]`)?.click());
  window.addEventListener('dcmd:languagechange',()=>footerLanguage.value=window.DCMDLanguage.language);
  const triggers=[...document.querySelectorAll('[data-mega-view]')];
  let currentTrigger=null, hoverTimer;
  const closeMenu=(restore=false)=>{
    clearTimeout(hoverTimer);panel.hidden=true;
    triggers.forEach(button=>button.setAttribute('aria-expanded','false'));
    if(restore)currentTrigger?.focus();
  };
  const openMenu=button=>{
    clearTimeout(hoverTimer);
    if(!matchMedia('(min-width:1101px)').matches)return;
    currentTrigger=button;panel.hidden=false;
    triggers.forEach(item=>item.setAttribute('aria-expanded',String(item===button)));
  };
  triggers.forEach(button=>{
    button.addEventListener('click',()=>button.getAttribute('aria-expanded')==='true'?closeMenu():openMenu(button));
    button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')hoverTimer=setTimeout(()=>openMenu(button),180);});
    button.addEventListener('pointerleave',()=>clearTimeout(hoverTimer));
    button.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();openMenu(button);panel.querySelector('a').focus();}});
  });
  panel.addEventListener('pointerleave',()=>closeMenu());
  document.querySelector('#megaClose').addEventListener('click',()=>closeMenu(true));
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();closeMenu(true);}});
  document.addEventListener('pointerdown',event=>{if(!panel.contains(event.target)&&!event.target.closest('[data-mega-view]'))closeMenu();});
  document.addEventListener('focusin',event=>{if(!panel.contains(event.target)&&!event.target.closest('[data-mega-view]'))closeMenu();});
  window.addEventListener('resize',()=>{if(innerWidth<=1100)closeMenu();});

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
