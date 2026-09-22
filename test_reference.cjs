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
  await page.click('#previewPoints');assert.equal(await page.locator('#rewardBalance').innerText(),'50 / 250');
  assert.ok(await page.locator('#pointsPopup').isVisible());await page.click('#pointsClose');
  assert.ok(await page.locator('#pointsPopup').isHidden());
  for(let i=0;i<4;i++)await page.click('#previewPoints');
  await page.click('#redeemRewards');assert.equal(await page.locator('#rewardBalance').innerText(),'0 / 250');
  assert.match(await page.locator('#rewardsStatus').innerText(),/No real reward/);
  await page.click('#scanRewards');assert.match(await page.locator('#rewardsStatus').innerText(),/not connected/);
  await page.evaluate(()=>{window.dispatchEvent(new CustomEvent('dcmd:demo-order',{detail:{id:'test-order'}}));window.dispatchEvent(new CustomEvent('dcmd:demo-order',{detail:{id:'test-order'}}));});
  assert.equal(await page.locator('#rewardBalance').innerText(),'50 / 250');
  await page.evaluate(()=>window.dispatchEvent(new Event('dcmd:cleardemo')));
  assert.equal(await page.locator('#rewardBalance').innerText(),'0 / 250');
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
  assert.ok(await page.locator('.model-window-paris img').evaluate(img=>img.src.includes('model-paris-cutout.png')));
  assert.ok((await page.locator('.model-window-paris img').boundingBox()).height<=360);
  assert.deepEqual(errors,[]);
  if(width===1440){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:process.env.TEMP+'/dcmd-reference.png'});}
  await page.close();
 }
 console.log('PASS: reference menus, demo rewards, newsletter privacy, six languages, themes, compact models and mobile overflow');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
