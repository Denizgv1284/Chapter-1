const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 for(const [mode,url] of [['server','http://127.0.0.1:8012/'],['file',pathToFileURL(path.join(__dirname,'index.html')).href]]){
  const page=await browser.newPage({viewport:{width:1280,height:960},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!document.querySelector('#weatherProvince').disabled);
  await page.selectOption('#weatherProvince','34');
  await page.selectOption('#weatherDistrict','1421');
  await page.click('#weatherSubmit');
  await page.waitForFunction(()=>document.querySelector('#weatherPanel').getAttribute('aria-busy')==='false',{},{timeout:40000});
  assert.ok(await page.locator('#weatherResult').isVisible(),mode+': '+await page.locator('#weatherStatus').innerText());
  assert.match(await page.locator('#weatherPlace').innerText(),/Kadıköy/);
  console.log(mode,await page.locator('#weatherPlace').innerText(),await page.locator('#weatherTemp').innerText());
  await page.locator('#weather-style').screenshot({path:`theme-review/weather-live-${mode}.png`});
  await page.selectOption('#weatherCountry','PL');
  await page.fill('#weatherCityQuery','Warsaw');
  await page.click('#weatherFindCity');
  await page.waitForFunction(()=>!document.querySelector('#weatherFindCity').disabled,{},{timeout:25000});
  assert.ok(await page.locator('#weatherCityResult').isEnabled(),await page.locator('#weatherCityStatus').innerText());
  await page.selectOption('#weatherCityResult','756135');
  await page.click('#weatherSubmit');
  await page.waitForFunction(()=>document.querySelector('#weatherPanel').getAttribute('aria-busy')==='false',{},{timeout:40000});
  assert.ok(await page.locator('#weatherResult').isVisible(),await page.locator('#weatherStatus').innerText());
  assert.match(await page.locator('#weatherTimestamp').innerText(),/Europe\/Warsaw/);
  assert.deepEqual(errors,[]);
  console.log('PASS',mode,'live district weather and international city search/weather');
  await page.close();
 }
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
