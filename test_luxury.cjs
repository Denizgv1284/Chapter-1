const assert=require('node:assert/strict');
const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.DCMD_TEST_URL||'http://127.0.0.1:8012/',{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#campaignVideo').getAttribute('src'),null);
  await page.click('#campaignPlayback');
  await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
  console.log(await page.locator('video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration})));
  await page.waitForFunction(()=>!document.querySelector('video').paused);
  await page.click('#campaignPlayback');
  assert.ok(await page.locator('video').evaluate(v=>v.paused));
  if(width===1440){await page.locator('video').evaluate(v=>{v.currentTime=2});await page.waitForTimeout(500);await page.screenshot({path:process.env.TEMP+'/dcmd-luxury.png'});}
  await page.locator('.campaign-editorial').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.querySelectorAll('.campaign-photos img')].every(img=>img.complete&&img.naturalWidth>0));
  assert.equal(await page.locator('.campaign-photos img').count(),4);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.match(await page.locator('h1').evaluate(el=>getComputedStyle(el).fontFamily),/Playfair/);
  await page.click('#menuOpen');await page.click('#themeToggle');await page.click('#menuClose');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: campaign assets, video playback/pause, reduced motion, typography, responsive layout and theme');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
