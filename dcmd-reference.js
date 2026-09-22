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

  // Explicit, session-only preview. This is not a customer loyalty balance.
  let points=0, timer;
  const seenOrders=new Set();
  const popup=document.querySelector('#pointsPopup');
  const status=document.querySelector('#rewardsStatus');
  function render(){
    document.querySelector('#rewardBalance').textContent=`${points} / 250`;
    document.querySelectorAll('#rewardStars span').forEach((star,index)=>star.classList.toggle('active',index<points/50));
    document.querySelector('#redeemRewards').disabled=points<250;
  }
  function preview(){
    if(points>=250)return;
    points+=50;render();
    // A native checkout dialog is in the top layer; keep its toast visible there.
    (document.querySelector('dialog[open]') || document.body).append(popup);
    popup.hidden=false;
    clearTimeout(timer);timer=setTimeout(()=>popup.hidden=true,6500);
  }
  document.querySelector('#previewPoints').addEventListener('click',preview);
  document.querySelector('#pointsClose').addEventListener('click',()=>{popup.hidden=true;clearTimeout(timer);});
  document.querySelector('#scanRewards').addEventListener('click',()=>status.textContent='Code scanning is not connected. This is a preview only.');
  document.querySelector('#redeemRewards').addEventListener('click',()=>{
    if(points<250)return;
    points=0;render();popup.hidden=true;status.textContent='Demo redemption complete. No real reward or discount was issued.';
  });
  window.addEventListener('dcmd:demo-order',event=>{
    const id=event.detail?.id;if(typeof id!=='string'||seenOrders.has(id))return;
    seenOrders.add(id);preview();
  });
  window.addEventListener('dcmd:cleardemo',()=>{points=0;seenOrders.clear();render();popup.hidden=true;});
  document.querySelector('#newsletterForm').addEventListener('submit',event=>{
    event.preventDefault();
    if(!event.currentTarget.reportValidity())return;
    event.currentTarget.reset();
    document.querySelector('#newsletterStatus').textContent='Preview complete. No subscription was created and no email was stored.';
  });
  render();
})();
