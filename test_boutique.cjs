const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.stack));
 await p.goto(process.env.DCMD_TEST_URL||'http://localhost:8012/',{waitUntil:'domcontentloaded'});
 assert.equal(await p.locator('.limited-drop').count(),14);assert.equal(await p.locator('.new-chapters button').count(),6);
 assert.equal(await p.evaluate(()=>DCMDCommerce.products.has('pants')),true);
 await p.locator('.new-chapters button').last().click();assert.ok(await p.locator('.product-card[data-product-id="capital-amsterdam"]').isVisible());
 await p.locator('.capsule-card .look-add').first().click();assert.equal(await p.locator('.cart-row').count(),2);
 const thumbs=await p.locator('.cart-row img').evaluateAll(a=>a.map(i=>[i.clientWidth,i.clientHeight]));assert.ok(thumbs.every(([w,h])=>w===h));
 await p.click('.checkout');await p.check('[name="gift"]');await p.fill('[name="giftNote"]','Private gift message');
 assert.match(await p.locator('#giftSummary').innerText(),/mühürlü/);
 for(const [name,value]of Object.entries({customer:'Test',email:'test@example.com',address:'Test address',city:'Warsaw',postal:'00-001',country:'Poland'}))await p.fill(`#checkoutForm [name="${name}"]`,value);
 await p.check('[name="termsAccepted"]');await p.click('#checkoutForm [type="submit"]');await p.locator('#checkoutSuccess').waitFor({state:'visible'});
 assert.match(await p.locator('#orderEmailPreview').innerText(),/Private gift message/);
 const receipt=await p.evaluate(()=>localStorage.getItem('dcmd-demo-order'));assert.equal(JSON.parse(receipt).packaging,'sealed-box');assert.ok(!receipt.includes('Private gift message'));
 assert.equal(await p.locator('[data-product-id="pants"] .limited-drop progress').getAttribute('value'),'19');
 await p.click('#checkoutClose');await p.locator('.welcome-reward .reward-register').click();await p.locator('.scratch-reveal').click();
 const result=await p.locator('.scratch-result').innerText();assert.match(result,/%15|%20|50/);
 await p.reload({waitUntil:'domcontentloaded'});assert.equal(await p.locator('.scratch-result').innerText(),result);assert.ok(await p.locator('.welcome-reward .reward-register').isHidden());
 await p.locator('#campaignNext').click();assert.equal(await p.locator('#campaignVideo').getAttribute('data-film-index'),'1');
 await p.locator('#campaignVideo').evaluate(v=>v.dispatchEvent(new Event('ended')));assert.equal(await p.locator('#campaignVideo').getAttribute('data-film-index'),'0');
 for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:900});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);}
 await p.locator('#capsules').screenshot({path:'theme-review/capsules-final.png'});
 await p.locator('.welcome-reward').screenshot({path:'theme-review/reward-final.png'});
 assert.deepEqual(errors,[]);console.log('PASS: 14 stable products, 6 arrivals, outfit cart, uniform thumbnails, gift receipt/privacy, live drop count, persistent scratch reward, playlist wrap, mobile widths');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
