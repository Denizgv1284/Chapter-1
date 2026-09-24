(() => {
  const codes=['en','tr','pl','de','ru','zh'];
  const names=['English','Türkçe','Polski','Deutsch','Русский','中文'];
  const page=location.pathname.split('/').pop().replace('.html','');
  const main=document.querySelector('main');
  const original=main.innerHTML, originalTitle=document.title;
  const toolbar=document.createElement('div');toolbar.className='policy-language';
  const label=document.createElement('label');label.htmlFor='policyLanguage';
  const select=document.createElement('select');select.id='policyLanguage';
  codes.forEach((code,i)=>select.add(new Option(names[i],code)));
  toolbar.append(label,select);main.before(toolbar);
  let language='en';
  try{const saved=localStorage.getItem('dcmd-language');if(codes.includes(saved))language=saved;}catch{}
  const requested=new URLSearchParams(location.search).get('lang');if(codes.includes(requested))language=requested;
  function render(code,save=false){
    if(!codes.includes(code))return;
    language=code;select.value=code;document.documentElement.lang=code==='zh'?'zh-CN':code;
    if(save)try{localStorage.setItem('dcmd-language',code);}catch{}
    if(code==='tr'){main.innerHTML=original;document.title=originalTitle;label.textContent='Dil';}
    else{
      const data=window.DCMDPolicyTranslations[code];
      label.textContent=data.language;document.title=data.titles[page]+' — DCMD';main.replaceChildren();
      const back=document.createElement('a');back.href='../index.html';back.textContent=data.back;main.append(back);
      const h1=document.createElement('h1');h1.textContent=data.titles[page];main.append(h1);
      const notice=document.createElement('p');notice.className='checkout-test-note';notice.textContent=data.notice;main.append(notice);
      if(page!=='privacy'){const p=document.createElement('p');p.textContent=data.test;main.append(p);}
      let heading=0;
      for(const block of data[page].split('\n\n')){
        if(block.startsWith('## ')){
          const lines=block.split('\n'),h=document.createElement('h2');h.textContent=lines.shift().slice(3);
          if(page==='privacy'){if(heading===0)h.id='data';if(heading===3)h.id='certification';heading++;}
          main.append(h);if(lines.length){const p=document.createElement('p');p.textContent=lines.join('\n');main.append(p);}
        }else{const p=document.createElement('p');p.textContent=block;main.append(p);}
      }
      if(page==='privacy'){
        const p=document.createElement('p');p.append(data.sources+': ');
        for(const [text,url] of [[data.vercel,'https://vercel.com/docs/query/monitoring'],[data.edpb,'https://www.edpb.europa.eu/accountability-tools_en']]){const a=document.createElement('a');a.textContent=text;a.href=url;a.target='_blank';a.rel='noopener';p.append(a,' · ');}main.append(p);
      }
    }
    const back=main.querySelector('a');back.href='../index.html?lang='+code;
    if(save){const url=new URL(location.href);url.searchParams.set('lang',code);history.replaceState(null,'',url);}
  }
  select.addEventListener('change',()=>render(select.value,true));
  window.addEventListener('storage',e=>{if(e.key==='dcmd-language')render(e.newValue);});
  render(language);
  if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
})();
