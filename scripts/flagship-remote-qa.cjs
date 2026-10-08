(async()=>{
 const {chromium}=await import('/app/node_modules/playwright/index.mjs');
 const fs=await import('node:fs');
 const dir='/tmp/glwadys-flagship-evidence';fs.mkdirSync(dir,{recursive:true});
 const browser=await chromium.launch({headless:true,channel:'chromium',args:['--no-sandbox']});
 const results={};
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errors.push(m.text())});
  page.on('requestfailed',r=>failed.push(r.url()));
  const r=await page.goto('http://127.0.0.1:4350/fr',{waitUntil:'networkidle'});
  const data={status:r.status(),errors,failed,sections:{}};
  for(const [label,id] of [['hero','act-opening'],['process','act-process'],['work','act-work'],['yuna','act-work-yuna'],['journey','act-journey-scene'],['expertise','act-expertise'],['contact','act-contact']]){
   const section=page.locator('#'+id);
   if(await section.count()){await section.scrollIntoViewIfNeeded();await page.waitForTimeout(200);await page.screenshot({path:dir+'/'+name+'-'+label+'.png'});data.sections[label]=id;}
   else data.sections[label]='MISSING';
  }
  data.layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length}));
  data.nav=await page.locator('nav a').evaluateAll(as=>as.map(a=>({label:a.textContent,href:a.getAttribute('href'),width:Math.round(a.getBoundingClientRect().width),height:Math.round(a.getBoundingClientRect().height)})));
  data.email=await page.locator('#act-contact a[href^="mailto:"]').count();
  results[name]=data;await page.close();
 }
 fs.writeFileSync(dir+'/results.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results));
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
