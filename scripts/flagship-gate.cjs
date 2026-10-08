(async()=>{
 const {chromium}=await import('playwright');
 const fs=await import('node:fs');
 const path=await import('node:path');
 const {spawn}=await import('node:child_process');
 const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','4350'],{stdio:'ignore'});
 await new Promise(resolve=>setTimeout(resolve,4500));
 const browser=await chromium.launch({headless:true});
 const dir='qa/flagship-20261008';fs.mkdirSync(dir,{recursive:true});
 const results={};
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errors.push(m.text())});
  const r=await page.goto('http://127.0.0.1:4350/fr',{waitUntil:'networkidle'});
  const data={status:r.status(),errors,sections:{}};
  for(const [label,id] of [['hero','act-opening'],['process','act-process'],['work','act-work'],['yuna','act-work-yuna'],['contact','act-contact']]){
   const section=page.locator('#'+id);
   if(await section.count()){await section.scrollIntoViewIfNeeded();await page.waitForTimeout(300);await page.screenshot({path:path.join(dir,name+'-'+label+'.png')});data.sections[label]=id;}
   else data.sections[label]='MISSING';
  }
  data.layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight}));
  data.nav=await page.locator('nav a').evaluateAll(as=>as.map(a=>({label:a.textContent,href:a.getAttribute('href'),width:Math.round(a.getBoundingClientRect().width),height:Math.round(a.getBoundingClientRect().height)})));
  results[name]=data;await page.close();
 }
 fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify(results));
 await browser.close();
 server.kill();
})().catch(e=>{console.error(e);process.exitCode=1});
