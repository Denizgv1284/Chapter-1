const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.DCMD_TEST_URL||'http://localhost:8012/',{waitUntil:'domcontentloaded'});
 for(const [width,height] of [[320,568],[375,667],[390,844],[430,932],[768,1024],[844,390]]){
  await p.setViewportSize({width,height});
  for(const selector of ['.hero-media','.home-scene>img','.campaign-photos img','.lookbook-tile img','.capsule-photo']){
   const items=p.locator(selector);
   for(let n=0;n<await items.count();n++){
    const item=items.nth(n);await item.scrollIntoViewIfNeeded();
    const g=await item.evaluate(async e=>{if(e.tagName==='IMG')await e.decode();const r=e.getBoundingClientRect();return {height:r.height,left:r.left,right:r.right,fit:getComputedStyle(e).objectFit};});
    assert.ok(g.height<=height-95,`${selector} too tall at ${width}x${height}: ${g.height}`);
    assert.ok(g.left>=-1&&g.right<=width+1,`${selector} horizontal crop`);
    if(selector.includes('img'))assert.equal(g.fit,'contain');
   }
  }
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow');
  await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`theme-review/mobile-frame-${width}.png`});
 }
 assert.deepEqual(errors,[]);console.log('PASS: complete image frames, viewport height limits and no overflow at six portrait/landscape sizes');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
