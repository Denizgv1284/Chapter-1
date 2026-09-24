const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
const context=await b.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.stack));
const base=process.env.DCMD_TEST_URL||'http://localhost:8012/';await p.goto(base,{waitUntil:'domcontentloaded'});
await p.locator('.scene-capital img').evaluate(i=>i.decode());await p.locator('.scene-unisex img').evaluate(i=>i.decode());
for(const language of ['en','tr','pl','de','ru','zh']){
 await p.selectOption('#footerLanguage',language);
 await p.waitForFunction(lang=>document.documentElement.lang===(lang==='zh'?'zh-CN':lang),language);
 const missing=await p.evaluate(()=>window.DCMDExtraTranslations.trim().split('\n').map(r=>r.split('|')).filter(([s])=>/[çğıİöşüÇĞÖŞÜ]/.test(s)).filter(([s])=>DCMDLanguage.language!=='tr'&&DCMDLanguage.t(s)===s).map(([s])=>s));assert.deepEqual(missing,[]);
 await p.locator('.welcome-reward').scrollIntoViewIfNeeded();
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),language+' overflow');
 const policyLink=await p.locator('a[href*="policies/privacy.html"]').first().getAttribute('href');assert.equal(new URL(policyLink).searchParams.get('lang'),language);
 const q=await p.context().newPage();q.on('pageerror',e=>errors.push(e.stack));
 for(const name of ['privacy','terms','shipping','about']){
  await q.goto(new URL(`policies/${name}.html?lang=${language}`,base).href,{waitUntil:'domcontentloaded'});
  assert.equal(await q.locator('#policyLanguage').inputValue(),language);
  assert.equal(await q.locator('html').getAttribute('lang'),language==='zh'?'zh-CN':language);
  const heading=await q.locator('h1').innerText();if(language!=='tr')assert.ok(!/Gizlilik|Şartlar|Hakkımızda|Kargo,/.test(heading));
  assert.ok((await q.locator('main').innerText()).length>250);assert.ok(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+language+' overflow');
 }
 await q.close();
}
await p.selectOption('#footerLanguage','en');
for(const width of [320,390,430,768,1440]){
 await p.setViewportSize({width,height:900});await p.locator('.footer-selectors').scrollIntoViewIfNeeded();
 const geometry=await p.evaluate(()=>{const f=document.querySelector('.footer-selectors').getBoundingClientRect(),s=document.querySelector('#feedbackButton').getBoundingClientRect();return {left:s.left,overlap:s.left<f.right&&s.right>f.left&&s.top<f.bottom&&s.bottom>f.top,overflow:document.documentElement.scrollWidth>innerWidth};});assert.equal(geometry.left,0);assert.equal(geometry.overlap,false);assert.equal(geometry.overflow,false);
 if(width<=430){const images=await p.locator('.home-scene>img').evaluateAll(a=>a.map(i=>({w:i.clientWidth,h:i.clientHeight,ratio:i.naturalWidth/i.naturalHeight,fit:getComputedStyle(i).objectFit})));assert.ok(images.every(i=>i.fit==='contain'&&Math.abs(i.w/i.h-i.ratio)<.01));}
}
await p.setViewportSize({width:390,height:844});await p.locator('.scene-capital').screenshot({path:'theme-review/mobile-branded-capital.png'});await p.locator('.scene-unisex').screenshot({path:'theme-review/mobile-branded-hero.png'});
await p.locator('.footer-selectors').scrollIntoViewIfNeeded();await p.screenshot({path:'theme-review/footer-support-fixed.png'});
await p.click('#feedbackButton');assert.equal(await p.locator('#feedbackModal').getAttribute('aria-hidden'),'false');await p.click('#closeFeedback');
assert.deepEqual(errors,[]);console.log('PASS: six languages, 24 policy-page variants, localized links, uncropped mobile photos, support tab and unobstructed footer');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
