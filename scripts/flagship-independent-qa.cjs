(async () => {
 const { chromium } = await import('playwright');
 const fs = await import('node:fs');
 const dir = 'qa/independent-20261008';
 fs.mkdirSync(dir, { recursive: true });
 const url = 'http://127.0.0.1:4355/fr';
 const sleep = ms => new Promise(r => setTimeout(r, ms));
 const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
 const report = {url,started:new Date().toISOString(),viewports:{}};
 for (const [kind,width,height] of [['desktop',1440,900],['mobile',390,844]]) {
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await context.newPage(),errors=[],warnings=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text())});
  page.on('requestfailed',r=>failed.push({url:r.url(),reason:r.failure()?.errorText}));
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.evaluate(()=>document.fonts.ready);await sleep(900);
  const data={http:response.status(),errors,warnings,failed,sections:{},interactions:{}};
  data.initial=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,canvas:document.querySelectorAll('canvas').length,imagesBroken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
  for (const [label,id] of [['hero','act-opening'],['process','act-process'],['work','act-work'],['yuna','act-work-yuna'],['journey','act-journey'],['expertise','act-expertise'],['contact','act-contact']]) {
   const el=page.locator('#'+id);if(!await el.count()){data.sections[label]={missing:true};continue;}
   await el.evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await sleep(900);
   await page.screenshot({path:dir+'/'+kind+'-'+label+'.png'});
   data.sections[label]=await page.evaluate(id=>{
    const nav=document.querySelector('nav[aria-label]'),nr=nav?.getBoundingClientRect();
    const section=document.getElementById(id),sr=section.getBoundingClientRect();
    const overlaps=[...document.querySelectorAll('main p, main h1, main h2, main h3, main h4, main a')].filter(e=>{
     const r=e.getBoundingClientRect(),s=getComputedStyle(e);
     return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0&&s.visibility!=='hidden'&&s.opacity!=='0'&&nr&&r.left<nr.right&&r.right>nr.left&&r.top<nr.bottom&&r.bottom>nr.top;
    }).slice(0,12).map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,55)}));
    return {top:Math.round(sr.top),navActive:[...document.querySelectorAll('nav[aria-label] a[aria-current]')].map(a=>a.textContent.trim()),navOverlap:overlaps,scrollY:Math.round(scrollY)};
   },id);
  }
  data.nav=await page.locator('nav[aria-label] a').evaluateAll(as=>as.map(a=>{const r=a.getBoundingClientRect();return {text:a.textContent.trim(),href:a.getAttribute('href'),w:Math.round(r.width),h:Math.round(r.height)}}));
  data.email=await page.locator('#act-contact a[href^="mailto:"]').evaluateAll(as=>as.map(a=>({href:a.href,text:a.textContent.trim(),visible:!!a.getClientRects().length})));
  await page.locator('#act-process').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await sleep(450);
  const editShots=[];
  const buttons=page.locator('#act-process button');
  const n=await buttons.count();
  for(let i=0;i<n;i++){
    const b=buttons.nth(i);
    if(await b.isVisible().catch(()=>false)){
      await b.click(); await sleep(400);
      const path=dir+'/'+kind+'-edit-'+i+'.png';
      await page.screenshot({path});
      editShots.push(path);
    }
  }
  data.interactions.editShots=editShots;
  const handoff=page.locator('#act-process a[href="#act-work-yuna"]');
  if(await handoff.count()){await handoff.click();await sleep(850);data.interactions.yunaHandoff=await page.evaluate(()=>({hash:location.hash,headingTop:Math.round(document.querySelector('#case-yuna')?.getBoundingClientRect().top??-1),imageTop:Math.round(document.querySelector('#act-work-yuna img')?.getBoundingClientRect().top??-1)}));await page.screenshot({path:dir+'/'+kind+'-handoff.png'});}
  for(const frac of [0.75,0.12,0.91,0.24,0.88,0]){await page.evaluate(f=>scrollTo({top:document.documentElement.scrollHeight*f,behavior:'instant'}),frac);await sleep(90)}
  await sleep(700);data.interactions.rapidReverse=await page.evaluate(()=>({scrollY,scrollWidth:document.documentElement.scrollWidth,visibleText:document.body.innerText.length,canvas:document.querySelectorAll('canvas').length}));
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight*.45,behavior:'instant'}));await sleep(400);
  await page.reload({waitUntil:'domcontentloaded'});await sleep(800);
  data.interactions.refreshMidScroll=await page.evaluate(()=>({scrollY,scrollWidth:document.documentElement.scrollWidth,bodyText:document.body.innerText.length}));
  await page.setViewportSize({width:kind==='desktop'?390:1440,height:kind==='desktop'?844:900});await sleep(700);
  data.interactions.resize=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollY,navLinks:document.querySelectorAll('nav[aria-label] a').length}));
  await context.close();report.viewports[kind]=data;
 }
 for(const mode of ['reduced','noWebGL']){
  const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:mode==='reduced'?'reduce':'no-preference'});
  if(mode==='noWebGL')await ctx.addInitScript(()=>{const old=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl'||type==='webgl2'||type==='experimental-webgl')return null;return old.call(this,type,...args)}});
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);await sleep(600);
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight*.55,behavior:'instant'}));await sleep(500);
  await page.screenshot({path:dir+'/'+mode+'.png'});
  report[mode]=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,canvas:document.querySelectorAll('canvas').length,headings:[...document.querySelectorAll('h1,h2')].map(h=>h.textContent.trim()),links:document.querySelectorAll('a').length}));
  report[mode].errors=errors;await ctx.close();
 }
 report.finished=new Date().toISOString();fs.writeFileSync(dir+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({file:dir+'/results.json',summary:report},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});