const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const reducedMotion of ['reduce','no-preference']){
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.DCMD_TEST_URL||'http://127.0.0.1:8012/');
  assert.equal(await page.locator('link[href*="dcmd-editorial"]').count(),1);
  assert.equal(await page.locator('#products').evaluate(e=>getComputedStyle(e).opacity),'1');
  await page.locator('.product-card').last().scrollIntoViewIfNeeded();await page.waitForTimeout(600);
  assert.equal(await page.locator('.product-card').last().evaluate(e=>getComputedStyle(e).opacity),'1');
  await page.click('#menuOpen');await page.click('#searchButton');await page.fill('#productSearch','hoodie');await page.click('#closeSearch');
  assert.ok(await page.locator('.product-card:visible').count()>0);
  await page.evaluate(()=>document.querySelector('#weatherPanel').setAttribute('aria-busy','true'));
  assert.equal(await page.locator('#weatherPanel').evaluate(e=>getComputedStyle(e,'::before').animationName),reducedMotion==='reduce'?'none':'dcmd-loading-star');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);await page.close();
 }console.log('PASS: editorial styles, visible products, search, loading star, reduced motion');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
