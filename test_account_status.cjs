const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  for(const width of [320,390,1440]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(process.env.DCMD_TEST_URL||'http://127.0.0.1:8012/');
   for(const selector of ['#cartButton','#accountOpen']){
    const box=await page.locator(selector).boundingBox();assert.ok(box&&box.x>=0&&box.x+box.width<=width);
    assert.ok(await page.locator(selector+' svg').isVisible());
   }
   for(let count=1;count<=6;count++){
    await page.locator('.product-card .add').first().click();
    assert.equal(await page.locator('#cartBadge').innerText(),String(count));
    assert.equal(await page.locator('#cartPanel').getAttribute('aria-hidden'),'true');
   }
   await page.click('#accountOpen');await page.locator('#accountDialog').waitFor({state:'visible'});
   assert.ok(await page.locator('#accountDialog input[type=password]').isDisabled());
   await page.keyboard.press('Escape');assert.ok(await page.locator('#accountDialog').isHidden());
   for(const state of ['processing','shipped','cancelled']){
    await page.evaluate(state=>{
     const order={id:'DCMD-TEST-fixture',currency:'EUR',items:[],total:10,createdAt:new Date().toISOString(),status:state};
     localStorage.setItem('dcmd-demo-order',JSON.stringify(order));location.hash='track='+order.id;
    },state);
    await page.locator('#trackingDialog').waitFor({state:'visible'});
    assert.equal(await page.locator('#trackingContent .order-status').getAttribute('data-status'),state);
    assert.equal(await page.locator('#trackingContent .order-support').count(),state==='cancelled'?1:0);
    if(state==='cancelled'){await page.click('.order-support summary');assert.ok(await page.locator('.order-support p').isVisible());}
    await page.click('#trackingClose');
   }
   assert.deepEqual(errors,[]);await page.close();
  }
  console.log('PASS: cart icon and 1–6 badge, account unavailable state, three demo status colors/support, mobile/desktop');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
