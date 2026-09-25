const assert=require('node:assert/strict');
const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 await page.goto(process.env.DCMD_TEST_URL||'http://127.0.0.1:8012/',{waitUntil:'domcontentloaded'});
 for(const code of ['LDN','ANK','ROM','BER','MAD','AMS']){
  const card=page.locator(`[data-city="${code}"]`);
  assert.match(await card.locator('.capital-flag-badge').innerText(),new RegExp(code));
  for(const img of await card.locator('.product-img img').all()){
   await img.scrollIntoViewIfNeeded();
   await img.evaluate(img=>img.decode());
   assert.ok(await img.evaluate(img=>img.naturalWidth>=300));
  }
  await card.locator('[data-slide="0"]').click();
  await page.waitForFunction(code => document.querySelector(`[data-city="${code}"] .product-img`).scrollLeft < 1, code);
  await card.locator('.gallery-next').click();
  await page.waitForFunction(code => document.querySelector(`[data-city="${code}"] [data-slide="1"]`).getAttribute('aria-pressed') === 'true', code);
  assert.equal(await card.locator('[data-slide="1"]').getAttribute('aria-pressed'),'true');
 }
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:900});
  const sizes=await page.locator('.product-img').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height};}));
  assert.ok(sizes.every(r=>Math.abs(r.w-r.h)<2),JSON.stringify(sizes));
  assert.ok(Math.max(...sizes.map(r=>r.h))-Math.min(...sizes.map(r=>r.h))<2);
 }
 await page.setViewportSize({width:1440,height:900});
 await page.locator('#rewards').screenshot({path:process.env.TEMP+'/dcmd-ten-stars.png'});
 await page.locator('.product-card[data-category="pants"]').first().screenshot({path:process.env.TEMP+'/dcmd-pants-aligned.png'});
 console.log('PASS: six Capital cities, twelve original images, flags, galleries and equal square product viewports');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
