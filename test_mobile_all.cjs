const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:320,height:568},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.DCMD_TEST_URL || 'http://127.0.0.1:8003/');
  await page.waitForFunction(()=>!document.querySelector('#weatherProvince').disabled);
  async function fits(selector,width,height){
   const box=await page.locator(selector).boundingBox();
   assert.ok(box&&box.x>=-1&&box.y>=-1&&box.x+box.width<=width+1&&box.y+box.height<=height+1,`${selector}: ${JSON.stringify(box)} in ${width}x${height}`);
  }
  for(const size of [{width:320,height:568},{width:390,height:844},{width:667,height:375},{width:844,height:390}]){
   await page.setViewportSize(size);
   for(const language of ['en','tr','pl','de','ru','zh']){
    await page.click('#menuOpen');await page.locator(`[data-language="${language}"]`).click();await page.click('#menuClose');
    await page.waitForTimeout(40);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`page overflow ${language}`);
    await page.click('#notificationsButton');await fits('#notificationsDialog',size.width,size.height);await page.keyboard.press('Escape');
   }
   await page.click('#menuOpen');await page.click('#searchButton');await page.waitForTimeout(300);await fits('.search-box',size.width,size.height);await page.click('#closeSearch');
   await page.click('#cartButton');await page.waitForTimeout(350);await fits('#cartPanel',size.width,size.height);await page.click('#closeCart');
   await page.click('#feedbackButton');await page.waitForTimeout(300);await fits('.feedback-dialog',size.width,size.height);await page.click('#closeFeedback');
   assert.equal(await page.locator('#musicOpen,#musicPlayer').count(),0);
   await page.locator('#weatherMap').scrollIntoViewIfNeeded();
   assert.equal((await page.locator('#weatherMap').boundingBox()).height,200);
  }
  await page.setViewportSize({width:320,height:568});
  assert.deepEqual(errors,[]);
  console.log('PASS: 4 phone sizes, 6 languages, notifications/search/cart/feedback panels, music removed, compact map, rotation, no JavaScript errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
