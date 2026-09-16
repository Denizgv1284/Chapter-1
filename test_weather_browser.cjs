const { chromium } = require(require('node:path').join(process.env.TEMP, 'dcmd-browser-test/node_modules/playwright'));
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({channel:'msedge', headless:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844}, isMobile:true, hasTouch:true});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8001/#weather-style');
    await page.waitForFunction(() => !document.getElementById('weatherProvince').disabled);
    assert.equal(await page.locator('#weatherProvince option').count(), 82);
    await page.selectOption('#weatherProvince', '34');
    await page.selectOption('#weatherDistrict', '1421');
    await page.click('#weatherSubmit');
    await page.locator('#weatherResult').waitFor({state:'visible',timeout:35000});
    assert.match(await page.locator('#weatherPlace').innerText(), /Kadıköy/);
    await page.locator('.outfit-product button').first().click();
    assert.match(await page.locator('#cartButton').innerText(), /1/);
    await page.click('#closeCart');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile page overflows');
    await page.locator('#weather-style').screenshot({path:require('node:path').join(process.env.TEMP,'dcmd-weather-mobile.png')});
    await page.selectOption('#weatherProvince','6');
    assert.equal(await page.locator('#weatherResult').isVisible(), false);
    await page.route('**/api/weather?**', route => route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Test: bağlantı kurulamadı.'})}));
    await page.click('#weatherSubmit');
    await page.waitForFunction(() => document.getElementById('weatherStatus').classList.contains('is-error'));
    assert.equal(await page.locator('#weatherResult').isVisible(), false);
    await page.unroute('**/api/weather?**');
    await page.setViewportSize({width:1440,height:1000});
    await page.selectOption('#weatherProvince','34');
    await page.click('#weatherSubmit');
    await page.locator('#weatherResult').waitFor({state:'visible',timeout:35000});
    await page.locator('#weather-style').screenshot({path:require('node:path').join(process.env.TEMP,'dcmd-weather-desktop.png')});
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    console.log('PASS: mobile/desktop layout, 81 provinces, district weather, cart, selection reset, API failure, no JS errors');
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exit(1);});
