const assert = require('node:assert/strict');
const {recommendOutfit, selectOutfitProducts} = require('./weather.js');
const products = [
  {category:'tshirt',collection:'europe',available:true},
  {category:'tshirt',collection:'capital',country:'pl',available:true},
  {category:'tshirt',collection:'capital',country:'fr',available:true},
  {category:'hoodie',collection:'black',available:true},
  {category:'pants',collection:'black',available:true}
];
for (const temperature of [2,17,24,32]) {
  const outfit = recommendOutfit({apparent_temperature:temperature,precipitation:0,weather_code:0,wind_speed_10m:0});
  const selected = selectOutfitProducts(products,outfit.categories,'PL');
  assert.equal(selected.length,outfit.categories.length);
  assert.equal(new Set(selected.map(p=>p.category)).size,selected.length);
  if (temperature>=12) assert.equal(selected.find(p=>p.category==='tshirt').country,'pl');
}
assert.equal(selectOutfitProducts(products,['tshirt'],'FR')[0].country,'fr');
assert.equal(selectOutfitProducts(products,['tshirt'],'TR')[0].collection,'europe');
assert.deepEqual(selectOutfitProducts(products.filter(p=>p.country),['tshirt'],'TR'),[]);
assert.deepEqual(selectOutfitProducts(products.map(p=>({...p,available:false})),['tshirt'],'PL'),[]);
const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  for (const width of [390,1440]) {
   const page=await browser.newPage({viewport:{width,height:900}});
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.goto(process.env.DCMD_TEST_URL||'http://127.0.0.1:8012/',{waitUntil:'domcontentloaded'});
   const headings={en:'Born from',tr:'Gölgelerden',pl:'Zrodzeni',de:'Aus dem',ru:'Рождённые',zh:'诞生于'};
   const storyPrefixes={en:"DCMD isn't just a brand",tr:'DCMD sadece bir marka değil',pl:'DCMD to nie tylko marka',de:'DCMD ist mehr als eine Marke',ru:'DCMD — не просто бренд',zh:'DCMD 不仅是一个品牌'};
   for (const [language,prefix] of Object.entries(headings)) {
    await page.click('#menuOpen');await page.click(`[data-language="${language}"]`);await page.click('#menuClose');
    await page.waitForFunction(prefix=>document.querySelector('#story h2').textContent.startsWith(prefix),prefix);
    assert.ok((await page.locator('#story p').innerText()).length>120);
    await page.waitForFunction(prefix=>document.querySelector('#story p').textContent.startsWith(prefix),storyPrefixes[language]);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   }
   await page.click('#pollOpen');
   await page.locator('input[name="city"][value="Berlin"]').check();
   await page.locator('#capitalPoll button[type="submit"]').click();
   assert.ok(await page.locator('#capitalPoll').isHidden());
   assert.ok(await page.locator('#pollConfirmation').isVisible());
   assert.match(await page.locator('#pollStatus').innerText(),/Berlin/);
   assert.equal(await page.evaluate(()=>document.activeElement.id),'pollConfirmation');
   await page.click('#pollChange');
   assert.ok(await page.locator('#capitalPoll').isVisible());
   await page.locator('input[name="city"][value="Madrid"]').check();
   await page.locator('#capitalPoll button[type="submit"]').click();
   assert.match(await page.locator('#pollStatus').innerText(),/Madrid/);
   await page.click('#pollChange');
   await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new Error('Storage blocked');};});
   await page.locator('#capitalPoll button[type="submit"]').click();
   await page.waitForFunction(()=>document.querySelector('#pollConfirmation h3').textContent==='无法保存选择。');
   await page.click('#pollClose');
   assert.deepEqual(errors,[]);await page.close();
  }
  console.log('PASS: weather category/country/stock selection, six-language story, mobile/desktop poll confirmation and change');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
