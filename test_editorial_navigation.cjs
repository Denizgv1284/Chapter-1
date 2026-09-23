const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const p=await browser.newPage({viewport:{width:1440,height:950},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.stack));
await p.goto(process.env.DCMD_TEST_URL||'http://localhost:8012/',{waitUntil:'domcontentloaded'});
assert.equal(await p.locator('.home-scene').count(),2);
for(const view of ['collections','unisex','mens','womens']){
 await p.click(`.reference-nav [data-mega-view="${view}"]`);
 assert.equal(await p.locator('#megaPanel').getAttribute('data-view'),view);
 assert.ok(await p.locator('#megaPanel').isVisible());
 const geometry=await p.evaluate(()=>({nav:document.querySelector('.site-nav').getBoundingClientRect().bottom,panel:document.querySelector('#megaPanel').getBoundingClientRect().top}));assert.ok(Math.abs(geometry.nav-geometry.panel)<2);
 if(view==='mens'||view==='womens')assert.match(await p.locator('#megaPanel').innerText(),/Coming soon/);
 await p.keyboard.press('Escape');
}
await p.click('.reference-nav [data-mega-view="unisex"]');
for(const [category,src]of [['tshirt','europe-tshirt'],['hoodie','hoodie'],['pants','pants'],['shorts','casual-shorts']]){
 await p.locator(`#megaPanel [data-preview][data-menu-filter="${category}"]`).focus();
 assert.match(await p.locator('#megaPanel .visual-card img').first().getAttribute('src'),new RegExp(src));
}
await p.locator('#megaPanel [data-preview][data-menu-filter="pants"]').click();
assert.equal(await p.locator('.product-card:visible').count(),1);assert.equal(await p.locator('.product-card:visible').getAttribute('data-category'),'pants');
await p.click('.reference-nav [data-mega-view="collections"]');await p.locator('#megaPanel [data-menu-filter="country"]').click();assert.match(await p.locator('.megamenu-visuals').innerText(),/Coming soon/);
await p.locator('#megaPanel [data-menu-filter="all"]').last().click();assert.equal(await p.locator('.product-card:visible').count(),14);
await p.locator('.scene-capital [data-collection-link="capital"]').click();assert.equal(await p.locator('.product-card:visible').count(),8);
for(const width of [320,390,768,1100,1440]){
 await p.setViewportSize({width,height:950});
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
 if(width<=1100){await p.click('#menuOpen');await p.click('.mobile-departments [data-mega-view="womens"]');assert.ok(await p.locator('#megaPanel').isVisible());assert.ok(await p.locator('#siteMenu').isHidden());await p.click('#megaClose');}
}
await p.click('.reference-nav [data-mega-view="unisex"]');await p.locator('#megaPanel [data-menu-filter="pants"]').first().focus();await p.screenshot({path:'theme-review/navigation-final.png'});await p.keyboard.press('Escape');
await p.evaluate(()=>DCMDShop.selectCollection('all'));await p.locator('.product-card').first().scrollIntoViewIfNeeded();await p.screenshot({path:'theme-review/products-editorial-final.png'});
assert.deepEqual(errors,[]);console.log('PASS: contextual collections/unisex previews, coming-soon departments, category filters, aligned overlay, three landing chapters, mobile navigation and overflow');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
