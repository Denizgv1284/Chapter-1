const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await page.goto(process.env.DCMD_TEST_URL || 'http://127.0.0.1:8012/',{waitUntil:'domcontentloaded'});
 const images=await page.locator('.product-img img').evaluateAll(async elements=>{
  return Promise.all(elements.map(async el=>{
   el.loading='eager'; await el.decode();
   const canvas=document.createElement('canvas');canvas.width=el.naturalWidth;canvas.height=el.naturalHeight;
   const context=canvas.getContext('2d');context.drawImage(el,0,0);
   const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
   let transparent=0,solid=0;
   for(let i=3;i<pixels.length;i+=4){if(pixels[i]===0)transparent++;if(pixels[i]>250)solid++;}
   return {src:el.getAttribute('src'),alt:el.alt,width:canvas.width,height:canvas.height,transparent:transparent/(pixels.length/4),solid:solid/(pixels.length/4)};
  }));
 });
 assert.equal(images.length,30);
 for(const img of images){
  assert.match(img.src,/-cutout\.png/);
  assert.equal(img.width,img.height,img.src);
  assert.ok(img.width>=1000,img.src);
  assert.ok(img.transparent>.1 && img.solid>.15,JSON.stringify(img));
 }
 await page.evaluate(()=>selectCollection('casual'));
 await page.locator('.product-card[data-category="shorts"] .product-img').scrollIntoViewIfNeeded();
 await page.locator('#products').screenshot({path:'theme-review/casual-products-fixed.png'});
 await page.locator('.product-card[data-category="shorts"] .product-img').click();
 await page.locator('.product-lightbox').screenshot({path:'theme-review/product-zoom-fixed.png'});
 await page.keyboard.press('Escape');
 const review=await browser.newPage({viewport:{width:1440,height:2000}});
 await review.goto('http://127.0.0.1:8012/',{waitUntil:'domcontentloaded'});
 await review.evaluate(items=>{
  document.body.replaceChildren();
  document.body.style.cssText='margin:0;padding:16px;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;background:#182337';
  items.forEach(item=>{const figure=document.createElement('figure');figure.style.cssText='margin:0;padding:8px;background:#e2e5eb';const img=document.createElement('img');img.src=item.src;img.style.cssText='width:100%;aspect-ratio:1;object-fit:contain';const label=document.createElement('figcaption');label.textContent=item.alt;label.style.cssText='font:11px sans-serif;color:#182337';figure.append(img,label);document.body.append(figure);});
 },images);
 await review.locator('img').evaluateAll(els=>Promise.all(els.map(el=>el.decode())));
 await review.screenshot({path:'theme-review/all-product-cutouts.png',fullPage:true});
 console.log('PASS: all 30 product images decode, have square high-resolution canvases and real transparent alpha');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
