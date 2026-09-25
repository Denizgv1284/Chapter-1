// Encoding-only web derivatives. Original assets remain untouched for zoom.
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(path.join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage();await page.goto(process.env.DCMD_TEST_URL||'http://localhost:8012/',{waitUntil:'domcontentloaded'});
 const names=fs.readdirSync('images').filter(n=>/(-cutout\.png$|^campaign-.*\.jpeg$|^theme-.*-dcmd\.png$)/.test(n));let original=0,optimized=0;
 for(const name of names){original+=fs.statSync(path.join('images',name)).size;
  for(const width of [480,960]){
   const target=path.join('images',name.replace(/\.[^.]+$/,`-${width}.webp`));
   if(!fs.existsSync(target)){
    const bytes=await page.evaluate(async({name,width})=>{const img=new Image();img.src='/images/'+name;await img.decode();const c=document.createElement('canvas');c.width=Math.min(width,img.naturalWidth);c.height=Math.round(c.width*img.naturalHeight/img.naturalWidth);c.getContext('2d').drawImage(img,0,0,c.width,c.height);const blob=await new Promise(r=>c.toBlob(r,'image/webp',.9));return Array.from(new Uint8Array(await blob.arrayBuffer()));},{name,width});
    fs.writeFileSync(target,Buffer.from(bytes));
   }
   if(width===960)optimized+=fs.statSync(target).size;
  }
 }
 const file='index.html';let html=fs.readFileSync(file,'utf8');
 html=html.replace(/<img\b[^>]*>/g,tag=>{const match=tag.match(/src="images\/([^"?]+)(?:\?[^"]*)?"/);if(!match||!names.includes(match[1]))return tag;
  const base=match[1].replace(/\.[^.]+$/,'');tag=tag.replace(/\s(?:srcset|sizes|decoding)="[^"]*"/g,'');return tag.replace(/>$/,` srcset="images/${base}-480.webp 480w, images/${base}-960.webp 960w" sizes="(max-width: 600px) 100vw, (max-width: 1100px) 45vw, 34vw" decoding="async">`);});
 fs.writeFileSync(file,html);console.log(JSON.stringify({assets:names.length,originalBytes:original,web960Bytes:optimized}));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
