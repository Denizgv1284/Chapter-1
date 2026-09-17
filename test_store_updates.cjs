const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    for (const width of [320,390,1440]) {
      const page=await browser.newPage({viewport:{width,height:900}});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(process.env.DCMD_TEST_URL||'http://localhost:8011/',{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('#musicPlayer,#musicOpen,script[src*="music"],link[href*="music"]').count(),0);
      const card=page.locator('.product-card').first();
      for(const lang of ['tr','pl','de','ru','zh','en']) {
        await page.click('#menuOpen');await page.click('[data-language="'+lang+'"]');await page.click('#menuClose');
        await page.waitForTimeout(80);
        assert.equal(await page.locator('html').getAttribute('lang'),lang==='zh'?'zh-CN':lang);
        assert.equal(await page.locator('#companyInfo h3').innerText(),await page.evaluate(()=>DCMDLanguage.t('Hakkımızda / Kurumsal bilgiler')));
        assert.equal(await card.locator('.variant-controls small').innerText(),await page.evaluate(()=>DCMDLanguage.t('Talep üzerine üretim · Test kapasitesi')));
        await card.locator('select').selectOption('Small');await page.waitForTimeout(50);
        assert.equal(await card.locator('.stock-status').innerText(),await page.evaluate(()=>DCMDLanguage.t('Üretime uygun · 5 test kontenjanı')));
        await card.locator('select').selectOption('XS');await page.waitForTimeout(50);
        assert.equal(await card.locator('.stock-status').innerText(),await page.evaluate(()=>DCMDLanguage.t('Son 2 üretim kontenjanı!')));
        await card.locator('select').selectOption('Oversize');await page.waitForTimeout(50);
        assert.ok(await card.locator('.add').isDisabled());
        assert.equal(await card.locator('.add').innerText(),await page.evaluate(()=>DCMDLanguage.t('Kapasite dolu')));
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'language overflow: '+lang+'/'+width);
        if(lang!=='tr') {
          assert.ok(!/[ğşİı]/u.test(await page.locator('#companyInfo').innerText()),'untranslated company information');
          assert.ok(!/kontenjan|Kapasite/.test(await card.locator('.variant-controls').innerText()),'untranslated stock');
        }
      }
      const leftovers=await page.locator('#contact,dialog,.variant-controls').evaluateAll(roots=>{
        const found=[];
        for(const root of roots){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode;if(node.parentElement.closest('.language-switcher'))continue;if(/[ğşİı]/u.test(node.nodeValue))found.push(node.nodeValue.trim());}}
        return found.filter(text=>text!=='TÜRKİYE / TR'); // Official country name, not an untranslated UI string.
      });
      assert.deepEqual(leftovers,[],'Turkish text left in English panels');
      await card.locator('select').selectOption('Medium');
      for(let n=1;n<=2;n++){await card.locator('.add').click();assert.equal(await page.locator('#cartBadge').innerText(),String(n));assert.equal(await page.locator('#cartPanel').getAttribute('aria-hidden'),'true');}
      await page.click('#cartButton');assert.equal(await page.locator('#cartPanel').getAttribute('aria-hidden'),'false');
      await page.locator('[data-remove]').first().click();assert.equal(await page.locator('#cartBadge').innerText(),'1');
      await page.locator('[data-remove]').first().click();assert.ok(await page.locator('#cartBadge').isHidden());await page.click('#closeCart');
      await page.click('#menuOpen');await page.click('#themeToggle');await page.click('#menuClose');
      assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
      await card.scrollIntoViewIfNeeded();await page.waitForTimeout(700);
      assert.ok(await card.locator('.add').isVisible());
      assert.equal(await card.locator('.stock-status').evaluate(e=>getComputedStyle(e).color),'rgb(70, 89, 116)');
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow '+width);
      await page.screenshot({path:require('node:path').join(process.env.TEMP,'dcmd-store-light-'+width+'.png')});
      for(const [open,panel,close] of [['#notificationsButton','#notificationsDialog','#notificationsClose'],['#pollOpen','#capitalVote','#pollClose'],['#feedbackButton','#feedbackModal','#closeFeedback']]){
        await page.click(open);await page.locator(panel).waitFor({state:'visible',timeout:5000});await page.click(close);
      }
      await page.reload({waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      assert.deepEqual(errors,[]);
      await page.close();
    }
    console.log('PASS: 3 viewports, 6 languages, dynamic stock, cart add/remove/badge, light theme, no music, no JS errors');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
