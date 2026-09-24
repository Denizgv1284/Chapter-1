/* Editorial shopping and browser-local reward previews. */
(() => {
  const products = window.DCMDCommerce.products;
  const capsules = [
    {name:'Midnight Series', collection:'black', image:'campaign-black-front.jpeg', text:'Geceye ait. Keskin çizgiler, siyah katmanlar.', ids:['essential-tshirt','pants']},
    {name:'Urban Shadow', collection:'europe', image:'campaign-europe-front.jpeg', text:'Şehrin ritmi. Avrupa detayları, rahat kalıplar.', ids:['europe-tshirt','pants']},
    {name:'Capital Chapters', collection:'capital', image:'theme-lifestyle-dcmd.png', text:'Şehirden ilham alan bir atmosfer. Yeni bölüm: London, Ankara, Roma, Berlin, Madrid ve Amsterdam. Aşağıda bu hikâyeye eşlik eden parçalar.', ids:['capital-london','pants']}
  ];
  const editorial = document.createElement('section');
  editorial.id='capsules'; editorial.className='boutique-editorial'; editorial.lang='tr';
  editorial.innerHTML='<header><span class="eyebrow">DCMD / EDITORIAL</span><h2>Bir parça. Bir hikâye.</h2><p>Kapsül koleksiyonları keşfet. Kendi kombinini oluştur.</p></header><div class="capsule-grid"></div>';
  document.querySelector('#campaignLooks').after(editorial);
  capsules.forEach((capsule,i) => {
    const article=document.createElement('article'); article.className='capsule-card';
    article.innerHTML=`<div class="capsule-photo"><img src="images/${capsule.image}" alt="${capsule.name} — koleksiyon atmosferi" loading="lazy"><span>0${i+1} / DCMD</span></div><div class="capsule-copy"><h3>${capsule.name}</h3><p>${capsule.text}</p><button class="capsule-explore" type="button">Koleksiyonu keşfet ↗</button><div class="look-pieces"></div><label>Kombin bedeni<select aria-label="${capsule.name} kombin bedeni"></select></label><button class="look-add" type="button">Kombini sepete ekle</button><p class="look-status" role="status"></p></div>`;
    const select=article.querySelector('select');
    window.DCMDCommerce.sizes.forEach(size=>select.add(new Option(size,size)));select.value='Medium';
    capsule.ids.forEach(id=>{
      const p=products.get(id);if(!p)return;
      const button=document.createElement('button');button.type='button';button.className='look-piece';
      const img=p.card.querySelector('img').cloneNode();img.removeAttribute('class');img.removeAttribute('style');
      const name=document.createElement('span');name.textContent=p.name;
      button.append(img,name);button.addEventListener('click',()=>showProduct(p));article.querySelector('.look-pieces').append(button);
    });
    article.querySelector('.capsule-explore').onclick=()=>{window.DCMDShop.selectCollection(capsule.collection);document.querySelector('#products').scrollIntoView({behavior:'smooth'});};
    article.querySelector('.look-add').onclick=()=>{article.querySelector('.look-status').textContent=window.DCMDShop.addLook(capsule.ids,select.value);};
    editorial.querySelector('.capsule-grid').append(article);
  });
  function showProduct(p) {
    window.DCMDShop.selectCollection(p.collection);p.card.scrollIntoView({behavior:'smooth',block:'center'});p.card.querySelector('.product-img').focus({preventScroll:true});
  }
  const newest=['london','ankara','roma','berlin','madrid','amsterdam'].map(city=>products.get('capital-'+city)).filter(Boolean);
  const arrivals=document.createElement('section');arrivals.className='new-chapters';arrivals.lang='tr';
  arrivals.innerHTML='<span class="eyebrow">YENİ EKLENENLER / 06 ŞEHİR</span><h2>Capital Collection büyüyor.</h2><p>Yeni parçaları doğrudan keşfet.</p><div></div>';
  newest.forEach(p=>{const button=document.createElement('button');button.type='button';button.textContent=p.id.replace('capital-','').toUpperCase()+' ↗';button.onclick=()=>showProduct(p);arrivals.querySelector('div').append(button);p.card.dataset.newArrival='true';});
  document.querySelector('#products').before(arrivals);
  const updateDrops=()=>products.forEach(p=>{
    let drop=p.card.querySelector('.limited-drop');
    if(!drop){drop=document.createElement('div');drop.className='limited-drop';drop.innerHTML='<span></span><progress max="20"></progress><small>Demo kontenjanı · Gerçek üretim adedi değildir.</small>';p.card.querySelector('.variant-controls').before(drop);}
    const remaining=Object.values(p.stock).reduce((a,b)=>a+b,0);
    drop.querySelector('span').textContent=`LIMITED DROP / ${remaining} / 20`;
    drop.querySelector('progress').value=remaining;drop.querySelector('progress').setAttribute('aria-label',`${p.name}: ${remaining} / 20 demo kontenjanı`);
  });
  updateDrops();window.addEventListener('dcmd:stockchange',updateDrops);
  products.forEach(p=>{
    const partner=products.get(p.id==='pants'?'hoodie':p.collection==='casual'?(p.id==='casual-shorts'?'casual-tee':'casual-shorts'):'pants');
    if(!partner||partner.id===p.id)return;
    const rec=document.createElement('button');rec.type='button';rec.className='complete-look';
    const img=partner.card.querySelector('img').cloneNode();img.removeAttribute('class');img.removeAttribute('style');
    const text=document.createElement('span');text.textContent=`Kombinini tamamla ↗ · ${partner.name}`;rec.append(img,text);rec.onclick=()=>showProduct(partner);p.card.append(rec);
  });
  // Gift note is used only in the in-memory email preview, never persisted.
  const gift=document.querySelector('[name="gift"]');const note=document.querySelector('[name="giftNote"]');
  const updateGift=()=>{note.disabled=!gift.checked;note.closest('label').hidden=!gift.checked;document.querySelector('#giftSummary').textContent=gift.checked?'Özel mühürlü kutu · Demo / ücretsiz':'Standart ambalaj';};
  gift.addEventListener('change',updateGift);document.querySelector('#checkoutForm').addEventListener('reset',()=>queueMicrotask(updateGift));updateGift();
  // One anonymous signup-preview reward per browser; real eligibility must be server-side.
  const key='dcmd-welcome-reward-v1';let reward=null;
  try{const saved=JSON.parse(localStorage.getItem(key));if(['15','20','50'].includes(saved?.value))reward=saved;}catch{}
  const rewardBox=document.createElement('div');rewardBox.className='welcome-reward';rewardBox.lang='tr';
  rewardBox.innerHTML='<span class="eyebrow">WELCOME / DEMO</span><h3>Yıldızını kazı. Sürprizini keşfet.</h3><p>%15, %20 ilk alışveriş indirimi veya 50 yıldız puanı.</p><button type="button" class="reward-register">Üyelik önizlemesini başlat</button><div class="scratch-area" hidden><div class="scratch-result" aria-live="polite"></div><canvas width="320" height="180" aria-hidden="true"></canvas></div><button type="button" class="scratch-reveal" hidden>Yıldızı aç</button><p class="reward-disclaimer">Demo çekilişi. Gerçek üyelik oluşturulmaz. Ödül ve kullanım kuralları henüz kesinleşmedi; ödeme indirimi uygulanmaz.</p>';
  document.querySelector('#rewards').append(rewardBox);
  const register=rewardBox.querySelector('.reward-register'),area=rewardBox.querySelector('.scratch-area'),canvas=rewardBox.querySelector('canvas'),reveal=rewardBox.querySelector('.scratch-reveal');
  const ctx=canvas.getContext('2d');let cells=new Set(),drawing=false;
  const save=()=>{try{localStorage.setItem(key,JSON.stringify(reward));}catch{}};
  const resultText=()=>reward.value==='50'?'+50 YILDIZ PUANI':`%${reward.value} İLK ALIŞVERİŞ İNDİRİMİ`;
  const showReward=()=>{if(!reward)return;reward.revealed=true;save();canvas.hidden=true;reveal.hidden=true;rewardBox.querySelector('.scratch-result').textContent=resultText();};
  const draw=()=>{
    register.hidden=true;area.hidden=false;reveal.hidden=false;
    if(reward.revealed){showReward();return;}
    canvas.hidden=false;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#bbc3cd';ctx.fillRect(0,0,320,180);ctx.fillStyle='#132039';ctx.font='80px serif';ctx.textAlign='center';ctx.fillText('✦',160,108);ctx.font='14px sans-serif';ctx.fillText(window.DCMDLanguage.t('YILDIZI KAZI'),160,150);
    rewardBox.querySelector('.scratch-result').textContent=resultText();
  };
  register.onclick=()=>{if(!reward){const values=['15','20','50'];const n=new Uint32Array(1);crypto.getRandomValues(n);reward={value:values[n[0]%3],revealed:false};save();}draw();};
  reveal.onclick=showReward;
  canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture(e.pointerId);scratch(e);});
  canvas.addEventListener('pointermove',e=>{if(drawing)scratch(e);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>canvas.addEventListener(type,()=>drawing=false));
  function scratch(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*320/r.width,y=(e.clientY-r.top)*180/r.height;ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(x,y,24,0,Math.PI*2);ctx.fill();cells.add(`${Math.floor(x/20)},${Math.floor(y/20)}`);if(cells.size>22)showReward();}
  if(reward)draw();
  window.addEventListener('dcmd:languagechange',()=>{if(reward)draw();});
  const accountLink=document.createElement('button');accountLink.type='button';accountLink.className='reward-register';accountLink.textContent='Üyelik ödülünü dene ✦';accountLink.onclick=()=>{document.querySelector('#accountDialog').close();rewardBox.scrollIntoView({behavior:'smooth',block:'center'});(reward?reveal:register).focus({preventScroll:true});};document.querySelector('#accountDialog').append(accountLink);
  window.addEventListener('dcmd:cleardemo',()=>{reward=null;try{localStorage.removeItem(key);}catch{}cells.clear();area.hidden=true;register.hidden=false;reveal.hidden=true;});
})();
