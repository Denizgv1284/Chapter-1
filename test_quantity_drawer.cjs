const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const width of [320,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.DCMD_TEST_URL||'http://127.0.0.1:8012/');
  const card=page.locator('.product-card').first(),quantity=card.locator('.quantity-input');
  for(const value of ['0','1.5','9','']){
   await quantity.fill(value);await card.locator('.add').click();assert.ok(await page.locator('#cartBadge').isHidden());
  }
  await quantity.fill('3');await card.locator('.add').click();
  assert.equal(await page.locator('#cartBadge').innerText(),'3');
  assert.ok(await page.locator('#cartPanel').evaluate(e=>e.open));
  assert.ok(await page.evaluate(()=>document.querySelector('#cartPanel').contains(document.activeElement)));
  await page.keyboard.press('Escape');assert.equal(await page.locator('#cartPanel').getAttribute('aria-hidden'),'true');
  assert.ok(await page.locator('#cartButton').evaluate(e=>e===document.activeElement));
  await quantity.fill('6');await card.locator('.add').click();
  assert.equal(await page.locator('#cartBadge').innerText(),'3');assert.equal(await page.locator('#cartPanel').getAttribute('aria-hidden'),'true');
  await card.locator('.size-select').selectOption('XS');assert.equal(await quantity.getAttribute('max'),'2');
  await card.locator('.size-select').selectOption('Oversize');assert.ok(await quantity.isDisabled());
  assert.deepEqual(errors,[]);await page.close();
 }console.log('PASS: quantity validation, aggregate capacity, drawer focus/Escape, mobile and desktop');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
