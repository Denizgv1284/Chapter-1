const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8003/');
  await page.waitForFunction(()=>!document.querySelector('#weatherCountry').disabled);
  await page.selectOption('#weatherProvince','34');await page.selectOption('#weatherDistrict','1421');
  await page.locator('.add').first().click();await page.click('#closeCart');
  const expected={en:'New Arrivals',tr:'Yeni Ürünler',pl:'Nowości',de:'Neuheiten',ru:'Новинки',zh:'新品'};
  for(const [lang,title] of Object.entries(expected)){
   await page.locator(`[data-language="${lang}"]`).click();
   await page.waitForFunction(title=>document.querySelector('#products h2').textContent===title,title);
   assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-CN':lang);
   assert.equal(await page.locator('#weatherDistrict').inputValue(),'1421');
   assert.match(await page.locator('#cartButton').innerText(),/\(1\)/);
   assert.equal(await page.locator(`[data-language="${lang}"]`).getAttribute('aria-pressed'),'true');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow: ${lang}`);
  }
  await page.reload();await page.waitForFunction(()=>document.documentElement.lang==='zh-CN');
  await page.waitForFunction(()=>!document.querySelector('#weatherCountry').disabled);
  await page.locator('[data-language="pl"]').click();
  await page.selectOption('#weatherCountry','PL');
  await page.route('**/api/locations?**',route=>{
   assert.equal(new URL(route.request().url()).searchParams.get('language'),'pl');
   return route.fulfill({contentType:'application/json',body:JSON.stringify({results:[{id:756135,name:'Warszawa',region:'Mazowieckie'}]})});
  });
  await page.fill('#weatherCityQuery','Warszawa');await page.click('#weatherFindCity');
  await page.waitForFunction(()=>!document.querySelector('#weatherCityResult').disabled);
  assert.match(await page.locator('#weatherCityStatus').innerText(),/Znaleziono/);
  await page.selectOption('#weatherCityResult','756135');
  await page.route('**/api/weather?**',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({province:'Warszawa',district:'Mazowieckie',country:'Polonya',timezone:'Europe/Warsaw',timestamp:Math.floor(Date.now()/1000),coordinates:{latitude:52.23,longitude:21.01},current:{temperature_2m:18,apparent_temperature:17,wind_speed_10m:10,precipitation:0,weather_code:3,is_day:1}})}));
  await page.click('#weatherSubmit');await page.locator('#weatherResult').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('#weatherDescription').textContent==='Pochmurno');
  assert.match(await page.locator('#outfitReason').innerText(),/chłodny/);
  await page.setViewportSize({width:844,height:390});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);
  console.log('PASS: six languages, country names, dynamic weather, localized search, cart/selection preservation, persistence, portrait/landscape');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
