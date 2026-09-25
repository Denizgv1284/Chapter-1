const {chromium}=require(require('node:path').join(process.env.TEMP,'dcmd-browser-test/node_modules/playwright'));
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
for(const url of process.argv.slice(2)){
 const p=await b.newPage({viewport:{width:390,height:844}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.slow=[];new PerformanceObserver(l=>slow.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});});
 await p.goto(url,{waitUntil:'domcontentloaded'});await p.waitForTimeout(3000);
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}});
 await p.selectOption('#footerLanguage','de');await p.waitForTimeout(1200);
 console.log(JSON.stringify({url,...await p.evaluate(()=>({longTasks:slow.length,maxTaskMs:Math.round(Math.max(0,...slow.map(e=>e.duration))),totalTaskMs:Math.round(slow.reduce((s,e)=>s+e.duration,0)),transferBytes:performance.getEntriesByType('resource').reduce((s,e)=>s+e.transferSize,0),brokenImages:[...document.images].filter(i=>i.getAttribute('src')&&i.complete&&!i.naturalWidth).map(i=>i.src)})),errors}));
 await p.close();
}
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
