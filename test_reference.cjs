const assert=require('node:assert/strict');
const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const width of [320,390,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.DCMD_TEST_URL||'http://127.0.0.1:8012/',{waitUntil:'domcontentloaded'});
  if(width>1100){
   await page.locator('[data-mega-view="collections"]').focus();await page.keyboard.press('ArrowDown');
   assert.ok(await page.locator('#megaPanel').isVisible());await page.keyboard.press('Escape');
   assert.ok(await page.locator('#megaPanel').isHidden());
   await page.click('[data-mega-view="mens"]');await page.locator('#megaPanel [data-collection-link="capital"]').click();
   assert.ok(await page.locator('#megaPanel').isHidden());
  }
  assert.equal(await page.locator('#rewardStars span').count(),10);
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('dcmd:demo-order',{detail:{id:'DCMD-TEST-first'}})));
  assert.equal(await page.locator('#rewardBalance').innerText(),'1 / 10');
  assert.ok(await page.locator('#pointsPopup').isVisible());await page.click('#pointsClose');
  assert.ok(await page.locator('#pointsPopup').isHidden());
  await page.evaluate(()=>{window.dispatchEvent(new CustomEvent('dcmd:demo-order',{detail:{id:'DCMD-TEST-first'}}));window.dispatchEvent(new CustomEvent('dcmd:demo-order',{detail:{id:'invalid'}}));});
  assert.equal(await page.locator('#rewardBalance').innerText(),'1 / 10');
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#rewardBalance').innerText(),'1 / 10');
  await page.evaluate(()=>{for(let i=0;i<12;i++)window.dispatchEvent(new CustomEvent('dcmd:demo-order',{detail:{id:'DCMD-TEST-'+i}}));});
  assert.equal(await page.locator('#rewardBalance').innerText(),'10 / 10');
  assert.equal(await page.locator('#rewardStars .active').count(),10);
  await page.evaluate(()=>window.dispatchEvent(new Event('dcmd:cleardemo')));
  assert.equal(await page.locator('#rewardBalance').innerText(),'0 / 10');
  await page.fill('#newsletterEmail','preview@example.com');await page.locator('#newsletterForm button').click();
  assert.equal(await page.locator('#newsletterEmail').inputValue(),'');
  assert.match(await page.locator('#newsletterStatus').innerText(),/No subscription/);
  await page.selectOption('#footerLanguage','tr');await page.waitForFunction(()=>document.documentElement.lang==='tr');
  for(const language of ['tr','pl','de','ru','zh','en']){
   await page.click('#menuOpen');await page.click(`[data-language="${language}"]`);await page.click('#menuClose');
   const overflow=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return !el.closest('.marquee,.product-gallery')&&r.width&&r.right>innerWidth+1&&getComputedStyle(el).position!=='fixed';}).slice(0,30).map(el=>({tag:el.tagName,id:el.id,class:el.className,width:el.getBoundingClientRect().width,text:el.textContent.slice(0,35)})));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}/${language}: ${JSON.stringify(overflow)}`);
  }
  await page.click('#menuOpen');await page.click('#themeToggle');await page.click('#menuClose');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await page.locator('.model-showcase').count(),0);
  assert.equal(await page.locator('.reference-lookbook').count(),1);
  assert.equal(await page.locator('.product-card').count(),14);
  assert.equal(await page.locator('.capital-flag-badge').count(),8);
  assert.ok(await page.evaluate(()=>document.querySelector('.reference-lookbook').compareDocumentPosition(document.querySelector('#rewards')) & Node.DOCUMENT_POSITION_FOLLOWING));
  assert.deepEqual(errors,[]);
  if(width===1440){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:process.env.TEMP+'/dcmd-reference.png'});}
  await page.close();
 }
 console.log('PASS: reference menus, demo rewards, newsletter privacy, six languages, themes, compact models and mobile overflow');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
