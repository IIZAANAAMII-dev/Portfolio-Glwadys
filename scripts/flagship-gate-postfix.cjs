process.env.LD_LIBRARY_PATH = '/tmp/glwadys-browser-deps/root/usr/lib/x86_64-linux-gnu';
(async () => {
  const { chromium } = await import('playwright');
  const fs = await import('node:fs');
  const dir = '/home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/qa/gate-20261008-0605';
  const url = 'http://127.0.0.1:4400/fr';
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  const report = {started:new Date().toISOString(),url,viewports:{}};
  const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));
  const ids = [['hero','act-opening'],['work','act-work'],['journey','act-journey-scene'],['expertise','act-expertise'],['contact','act-contact']];
  const snapshot = async page => page.evaluate(() => {
    const nav = [...document.querySelectorAll('nav a[href^="#"]')];
    const navBox = nav[0]?.closest('nav')?.getBoundingClientRect();
    const overlap = navBox ? [...document.querySelectorAll('main p,main h1,main h2,main h3,main h4,main button,main a')].filter(el=>{
      const r=el.getBoundingClientRect(),s=getComputedStyle(el);
      return r.width>0 && r.height>0 && r.bottom>navBox.top && r.top<navBox.bottom && r.left<navBox.right && r.right>navBox.left && s.visibility!=='hidden' && s.opacity!=='0';
    }).map(el=>el.textContent.trim().slice(0,65)) : [];
    return {scrollY:Math.round(scrollY),scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,
      canvas:document.querySelectorAll('canvas').length, nav:nav.map(el=>({href:el.getAttribute('href'),height:Math.round(el.getBoundingClientRect().height),width:Math.round(el.getBoundingClientRect().width),active:el.getAttribute('aria-current')})),
      overlap,hash:location.hash,sourceName:getComputedStyle(document.querySelector('[data-yuna-handoff-source]')).viewTransitionName,
      targetName:getComputedStyle(document.querySelector('[data-yuna-handoff-target]')).viewTransitionName,
      targetTop:Math.round(document.querySelector('[data-yuna-handoff-target]').getBoundingClientRect().top),
      headingTop:Math.round(document.querySelector('#case-yuna').getBoundingClientRect().top),
      emailVisible:[...document.querySelectorAll('#act-contact a[href^="mailto:"]')].map(el=>({text:el.textContent.trim(),href:el.getAttribute('href'),rect:el.getBoundingClientRect().toJSON()})),
      broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)};
  });
  for(const [kind,width,height] of [['desktop',1440,900],['mobile',390,844]]) {
    const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
    const page=await ctx.newPage(),errors=[],warnings=[],failed=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text())});
    page.on('requestfailed',r=>failed.push(r.url()+' '+r.failure()?.errorText));
    const response=await page.goto(url,{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);await sleep(300);
    const d={http:response.status(),initial:await snapshot(page),stages:{},navClicks:[],errors,warnings,failed};
    for(const [label,id] of ids) {
      await page.locator('#'+id).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await sleep(330);
      await page.screenshot({path:dir+'/'+kind+'-'+label+'.png'});
      d.stages[label]=await snapshot(page);
    }
    await page.locator('#act-process').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await sleep(400);
    for(let i=0;i<3;i++){
      await page.screenshot({path:dir+'/'+kind+'-edit-'+i+'.png'});
      d.stages['edit-'+i]=await snapshot(page);
      if(i<2){await page.locator('#act-process figure button').last().click();await sleep(1000);}
    }
    const handoff=page.locator('#act-process figure a[href="#act-work-yuna"]');
    d.handoffExists=await handoff.count();
    if(d.handoffExists){
      await handoff.click();await sleep(1100);
      await page.screenshot({path:dir+'/'+kind+'-handoff.png'});
      d.stages.handoff=await snapshot(page);
    }
    for(const href of ['#act-opening','#act-work','#act-journey-scene','#act-expertise','#act-contact']){
      await page.locator('nav a[href="'+href+'"]').click();await sleep(400);
      d.navClicks.push({href,...await snapshot(page)});
    }
    for(const frac of [0.75,0.12,0.91,0.24,0.88,0]){await page.evaluate(f=>scrollTo({top:document.documentElement.scrollHeight*f,behavior:'instant'}),frac);await sleep(60);}
    d.reverse=await snapshot(page);
    await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight*.45,behavior:'instant'}));
    await page.reload({waitUntil:'networkidle'});d.refresh=await snapshot(page);
    await page.setViewportSize({width:kind==='desktop'?390:1440,height:kind==='desktop'?844:900});await sleep(400);
    d.resize=await snapshot(page);
    report.viewports[kind]=d;await ctx.close();
  }
  for(const mode of ['reduced','noWebGL']){
    const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:mode==='reduced'?'reduce':'no-preference'});
    if(mode==='noWebGL')await ctx.addInitScript(()=>{const old=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...a){if(t==='webgl'||t==='webgl2')return null;return old.call(this,t,...a)}});
    const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
    await page.locator('#act-process').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
    for(let i=0;i<2;i++){await page.locator('#act-process figure button').last().click();await sleep(300);}
    await page.locator('#act-process figure a[href="#act-work-yuna"]').click();await sleep(900);
    report[mode]={...await snapshot(page),errors};
    await page.screenshot({path:dir+'/mobile-'+mode+'.png'});await ctx.close();
  }
  report.finished=new Date().toISOString();
  fs.writeFileSync(dir+'/results.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({output:dir+'/results.json',at:report.finished,desktop:report.viewports.desktop.http,mobile:report.viewports.mobile.http,reduced:report.reduced.hash,noWebGL:report.noWebGL.hash}));
  await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
