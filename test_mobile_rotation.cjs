const {chromium} = require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/weather.js*',async route=>{
      const response=await route.fetch();
      await route.fulfill({response,body:(await response.text()).replace('map = L.map(', 'map = window.testMap = L.map(')});
    });
    await page.goto('http://127.0.0.1:8001/');
    await page.waitForFunction(()=>window.testMap);
    await page.locator('.marquee').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>!document.querySelector('.marquee').classList.contains('is-paused'));
    const before=await page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).transform);
    await page.waitForTimeout(350);
    assert.notEqual(await page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).transform),before);
    assert.equal(await page.locator('.site-stars-one').evaluate(el=>getComputedStyle(el).animationName),'none');
    await page.selectOption('#weatherProvince','34');
    await page.selectOption('#weatherDistrict','1421');
    await page.waitForTimeout(800);
    const original=await page.evaluate(()=>testMap.getCenter());
    for (const viewport of [{width:844,height:390},{width:390,height:844},{width:667,height:375},{width:320,height:568}]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(250);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${viewport.width}`);
      assert.equal(await page.locator('#weatherDistrict').inputValue(),'1421');
      const center=await page.evaluate(()=>testMap.getCenter());
      assert.ok(Math.abs(center.lat-original.lat)<.005 && Math.abs(center.lng-original.lng)<.005,'Selected map center moved');
      const size=await page.evaluate(()=>({map:testMap.getSize(),width:document.querySelector('#weatherMap').clientWidth,height:document.querySelector('#weatherMap').clientHeight}));
      assert.equal(size.map.x,size.width);assert.equal(size.map.y,size.height);
      await page.click('#cartButton');
      const box=await page.locator('#cartPanel').boundingBox();
      assert.ok(box.height<=viewport.height+1,'Cart taller than viewport');
      await page.click('#closeCart');
    }
    await page.locator('#weather-style').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('.marquee').classList.contains('is-paused'));
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).animationName),'none');
    assert.deepEqual(errors,[]);
    console.log('PASS: portrait/landscape rotations, no overflow, preserved map center/district, dynamic cart height, marquee motion/visibility/reduced motion');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
