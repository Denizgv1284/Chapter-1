const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:320,height:568},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8003/');
  assert.equal(await page.locator('#notificationsUnread').isVisible(),true);
  for(const language of ['en','tr','pl','de','ru','zh']){
   await page.locator(`[data-language="${language}"]`).click();
   await page.click('#notificationsButton');
   assert.equal(await page.locator('#notificationsDialog').isVisible(),true);
   assert.equal(await page.locator('#noticeEventsEmpty').isVisible(),true);
   const box=await page.locator('#notificationsDialog').boundingBox();
   assert.ok(box.x>=0 && box.x+box.width<=320 && box.height<=568,JSON.stringify({language,box}));
   if(language!=='tr') assert.ok(!(await page.locator('#notificationsDialog').innerText()).includes('Şu an'));
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#notificationsDialog').isVisible(),false);
   assert.equal(await page.locator('#notificationsButton').evaluate(el=>el===document.activeElement),true);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.reload();assert.equal(await page.locator('#notificationsUnread').isVisible(),false);
  await page.setViewportSize({width:844,height:390});
  await page.click('#notificationsButton');
  assert.ok((await page.locator('#notificationsDialog').boundingBox()).height<=390);
  await page.evaluate(()=>{announcedEvents.push({title:'Test event',description:'Test',endsAt:'2099-01-01T00:00:00Z'});renderAnnouncements();});
  assert.equal(await page.locator('#noticeEventsEmpty').isVisible(),false);
  await page.evaluate(()=>{announcedEvents[0].endsAt='2000-01-01T00:00:00Z';renderAnnouncements();});
  assert.equal(await page.locator('#noticeEventsEmpty').isVisible(),true);
  await page.click('#noticeShop');assert.equal(await page.locator('#notificationsDialog').isVisible(),false);
  assert.equal(new URL(page.url()).hash,'#products');
  assert.deepEqual(errors,[]);
  console.log('PASS: six languages, 320px/landscape dialog, unread persistence, keyboard/focus, event empty/active/expired states, collection link');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
