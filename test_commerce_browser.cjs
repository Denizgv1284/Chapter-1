const { chromium } = require(require('node:path').join(process.env.TEMP, 'dcmd-browser-test/node_modules/playwright'));
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844}});
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(process.env.DCMD_TEST_URL || 'http://localhost:8002/', {waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('.size-select').count(),8);
    for (const [collection, price] of Object.entries({europe:'59.99',black:'49.99',capital:'49.99',casual:'39.99'})) {
      for (const card of await page.locator(`.product-card[data-collection="${collection}"]`).all()) assert.equal(await card.getAttribute('data-price'),price);
    }
    const first = page.locator('.product-card').first();
    await first.locator('select').selectOption('Oversize');
    assert.ok(await first.locator('.add').isDisabled());
    await first.locator('select').selectOption('X Large');
    assert.match(await first.locator('.stock-status').innerText(),/1/);
    for (const method of ['credit','debit','apple','paypal']) {
      await page.click('#inventoryOpen'); await page.click('#inventoryReset'); await page.click('#inventoryClose');
      await first.locator('.add').click();
      assert.equal(await page.locator('#cartPanel').getAttribute('aria-hidden'),'false');
      await page.click('.checkout');
      assert.equal(await page.locator('#checkoutDialog').isVisible(),true);
      assert.equal(await page.locator('[name="marketing"]').isChecked(),false);
      await page.locator('#checkoutForm [name="customer"]').fill('Test Customer');
      await page.locator('#checkoutForm [name="email"]').fill('test@example.com');
      await page.locator('#checkoutForm [name="address"]').fill('Test Address 1');
      await page.locator('#checkoutForm [name="city"]').fill('Warsaw');
      await page.locator('#checkoutForm [name="postal"]').fill('00-001');
      await page.locator('#checkoutForm [name="country"]').fill('Poland');
      await page.check(`[name="payment"][value="${method}"]`);
      assert.equal(await page.locator('#demoCard').isVisible(),['credit','debit'].includes(method));
      await page.click('#checkoutForm [type="submit"]');
      assert.equal(await page.locator('#checkoutSuccess').isVisible(),false,'Terms must be acknowledged');
      await page.check('[name="termsAccepted"]');
      await page.click('#checkoutForm [type="submit"]');
      await page.locator('#checkoutSuccess').waitFor({state:'visible'});
      const preview = await page.locator('#orderEmailPreview').innerText();
      assert.match(preview,/test@example.com/); assert.match(preview,/X Large/); assert.ok(!preview.includes('USD'));
      assert.ok(await first.locator('.add').isDisabled(),'capacity must be consumed');
      const saved = await page.evaluate(() => localStorage.getItem('dcmd-demo-order'));
      assert.ok(!saved.includes('test@example.com') && !saved.includes('Test Address') && !saved.includes('4242'));
      assert.equal(JSON.parse(saved).currency,'EUR');
      assert.equal(JSON.parse(saved).total,59.99);
      await page.click('#orderTrackLink'); await page.locator('#trackingDialog').waitFor({state:'visible'});
      assert.equal(await page.locator('.tracking-steps [aria-current]').count(),1);
      await page.click('#trackingClose');
    }
    const policyResponse = await page.request.get(new URL('/policies/privacy.html',page.url()).href);
    assert.equal(policyResponse.status(),200);
    assert.match(await policyResponse.text(),/yarıda kesil/);
    await page.click('#pollOpen');
    await page.check('#capitalPoll input[value="Berlin"]'); await page.click('#capitalPoll button');
    assert.match(await page.locator('#pollStatus').innerText(),/Berlin/);
    await page.click('#pollClose');
    await page.click('#clearDemoData');
    assert.equal(await page.evaluate(()=>localStorage.getItem('dcmd-demo-order')),null);
    for (const width of [320,390,1440]) {
      await page.setViewportSize({width,height:900});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),'page overflow');
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: EUR catalog, sizes, exhausted capacity, four demo payments, required terms, optional marketing, receipt privacy, tracking, policies, poll, responsive layout');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
