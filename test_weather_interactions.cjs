const { chromium } = require(require('node:path').join(process.env.TEMP, 'dcmd-browser-test/node_modules/playwright'));
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const errors=[]; page.on('pageerror', error=>errors.push(error.message));
    await page.route('**/weather.js*', async route => {
      const response=await route.fetch();
      await route.fulfill({response,body:(await response.text()).replace('map = L.map(', 'map = window.testMap = L.map(')});
    });
    await page.goto('http://127.0.0.1:8001/');
    await page.waitForFunction(()=>window.testMap);
    assert.ok(await page.evaluate(()=>document.querySelector('#products').compareDocumentPosition(document.querySelector('#weather-style')) & Node.DOCUMENT_POSITION_FOLLOWING));
    await page.locator('#weather-style').scrollIntoViewIfNeeded();
    // Actual map taps, not just dropdowns.
    await page.locator('.country-dot[title="Türkiye"]').click();
    await page.waitForFunction(()=>Math.abs(testMap.getZoom()-5)<.01 && Math.abs(testMap.getCenter().lat-39)<.01);
    await page.waitForFunction(()=>document.querySelectorAll('.country-dot').length===0);
    assert.equal(await page.locator('.country-dot').count(),0);
    assert.equal(await page.locator('.province-dot').count(),81);
    await page.selectOption('#weatherProvince','34');
    await page.waitForTimeout(800);
    await page.locator('.province-dot[title="İstanbul"]').click();
    assert.equal(await page.locator('#weatherProvince').inputValue(),'34');
    await page.selectOption('#weatherDistrict','1421');
    await page.click('#resetWeatherMap');
    await page.waitForTimeout(1200);
    await page.locator('.country-dot[title="Türkiye"]').click();
    assert.equal(await page.locator('#weatherDistrict').inputValue(),'1421','Same country should preserve district');
    await page.selectOption('#weatherCountry','PL');
    await page.selectOption('#weatherCountry','FR');
    await page.selectOption('#weatherCountry','DE');
    await page.waitForTimeout(1300);
    const center=await page.evaluate(()=>testMap.getCenter());
    assert.ok(Math.abs(center.lat-51)<.01 && Math.abs(center.lng-10)<.01,'Last selection wins');
    await page.route('**/api/locations?**',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({results:[{id:2950159,name:'Berlin',region:'Berlin'}]})}));
    await page.fill('#weatherCityQuery','Berlin');
    await page.click('#weatherFindCity');
    await page.waitForFunction(()=>!document.querySelector('#weatherCityResult').disabled);
    await page.selectOption('#weatherCityResult','2950159');
    assert.equal(await page.locator('#weatherSubmit').isDisabled(),false);
    await page.click('#weatherFindCity');
    assert.equal(await page.locator('#weatherSubmit').isDisabled(),true,'New search invalidates old selection');
    await page.setViewportSize({width:320,height:720});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.deepEqual(errors,[]);
    console.log('PASS: below products, actual country/province taps, same-country preservation, fast switching, search invalidation, 320px layout');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
