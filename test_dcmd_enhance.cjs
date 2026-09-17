const { chromium } = require(require('node:path').join(process.env.TEMP, 'dcmd-browser-test/node_modules/playwright'));
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel:'msedge', headless:true });
  try {
    const page = await browser.newPage({ viewport:{ width:1440, height:1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const response = await page.goto('http://localhost:8002/', { waitUntil:'networkidle' });
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => document.querySelectorAll('[data-reveal]').length > 2);

    assert.equal(await page.locator('link[href^="dcmd-enhance.css"]').count(), 1);
    assert.equal(await page.locator('script[src^="dcmd-enhance.js"]').count(), 1);
    assert.equal(await page.locator('.model-showcase .model-window').count(), 2);
    assert.equal(await page.locator('.model-showcase img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
    assert.equal(await page.locator('.product-card[data-country]').count(), 2);
    assert.equal(await page.locator('.capital-flag-badge').count(), 2);

    for (const selector of [
      '.product-card[data-name="Warsaw WAW Capital Tee"]',
      '.product-card[data-name="Different Oversized Hoodie"]'
    ]) {
      const card = page.locator(selector);
      assert.equal(await card.locator('.product-img img').count(), 3);
      assert.equal(await card.locator('.gallery-dots [data-slide]').count(), 3);
      await card.scrollIntoViewIfNeeded();
      await page.waitForFunction((cardSelector) => [...document.querySelectorAll(`${cardSelector} .product-img img`)].every(image => image.complete && image.naturalWidth > 0), selector);
      assert.equal(await card.locator('.product-img img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
    }

    assert.deepEqual(errors, []);
    console.log('PASS: enhancement assets, reveals, country accents, model showcase, and three-slide galleries');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
