const {chromium} = require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const path = require('node:path');
const payload = () => ({country:'Türkiye',province:'İstanbul',district:'Kadıköy',coordinates:{latitude:40.978,longitude:29.03},timestamp:Math.floor(Date.now()/1000),timezone:'Europe/Istanbul',current:{temperature_2m:9,apparent_temperature:8,wind_speed_10m:12,precipitation:0,weather_code:2,is_day:1}});
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.DCMD_TEST_URL || 'http://127.0.0.1:8012/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!document.querySelector('#weatherProvince').disabled);
  for(const width of [1440,768,390]){
   await page.setViewportSize({width,height:900});
   await page.waitForTimeout(150);
   const sizes=await page.locator('.product-img').evaluateAll(items=>items.map(item=>({w:item.clientWidth,h:item.clientHeight})));
   assert.ok(sizes.every(s=>Math.abs(s.w-s.h)<2),JSON.stringify(sizes));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth));
  }
  const card=page.locator('.product-card[data-category="pants"]');
  await card.locator('.product-img').click();
  await page.locator('.product-lightbox[open]').waitFor();
  assert.match(await page.locator('.product-lightbox img').getAttribute('src'),/pants-front/);
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('.product-lightbox img').getAttribute('src'),/pants-back/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.product-lightbox').isVisible(),false);
  assert.ok(await card.locator('.product-img').evaluate(el=>el===document.activeElement));
  await page.keyboard.press('Enter');
  await page.locator('.product-lightbox[open]').waitFor();
  await page.locator('.lightbox-close').click();
  await page.route('**/api/weather?**',route=>route.fulfill({json:payload()}));
  await page.selectOption('#weatherProvince','34');
  await page.click('#weatherSubmit');
  await page.locator('#weatherResult').waitFor({state:'visible'});
  await page.evaluate(()=>selectCollection('casual'));
  await page.locator('.outfit-product button').first().click();
  assert.equal(await page.locator('.product-card[data-category="hoodie"]').isVisible(),true);
  assert.equal(await page.locator('.product-card[data-category="hoodie"] .size-select').evaluate(el=>el===document.activeElement),true);
  await page.unroute('**/api/weather?**');
  await page.route('**/api/weather?**',route=>route.fulfill({json:{...payload(),current:{...payload().current,precipitation:null}}}));
  await page.click('#weatherSubmit');
  await page.waitForFunction(()=>document.querySelector('#weatherStatus').classList.contains('is-error'));
  assert.ok(await page.locator('#weatherResult').isHidden());
  assert.deepEqual(errors,[]);
  // File preview can initialize all locations and map without fetch(file://).
  const local=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
  const localErrors=[];local.on('pageerror',error=>localErrors.push(error.message));
  await local.route('https://api.open-meteo.com/**',route=>route.fulfill({json:{current:{...payload().current,time:payload().timestamp},timezone:'Europe/Istanbul'}}));
  await local.goto(pathToFileURL(path.join(__dirname,'index.html')).href,{waitUntil:'domcontentloaded'});
  await local.waitForFunction(()=>!document.querySelector('#weatherProvince').disabled);
  assert.equal(await local.locator('#weatherProvince option').count(),82);
  assert.ok(await local.locator('#weatherMap .leaflet-map-pane').count());
  assert.ok(await local.locator('#weatherMap .leaflet-localBase-pane path').count() > 100);
  await local.selectOption('#weatherProvince','34');
  await local.click('#weatherSubmit');
  await local.locator('#weatherResult').waitFor({state:'visible'});
  assert.deepEqual(localErrors,[]);
  // Static HTTP preview gets HTML instead of an API, then uses provider.
  await page.unroute('**/api/weather?**');
  await page.route('**/api/weather?**',route=>route.fulfill({status:404,contentType:'text/html',body:'Not found'}));
  await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:{current:{...payload().current,time:payload().timestamp},timezone:'Europe/Istanbul'}}));
  await page.click('#weatherSubmit');
  await page.waitForFunction(()=>document.querySelector('#weatherPanel').getAttribute('aria-busy') === 'false');
  assert.ok(await page.locator('#weatherResult').isVisible(),await page.locator('#weatherStatus').innerText());
  await page.locator('#weather-style').screenshot({path:'theme-review/weather-fixed-mobile.png'});
  console.log('PASS: equal galleries, mobile layout, zoom navigation/focus, filtered outfit selection, malformed data recovery, file and static HTTP weather');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
