process.env.LD_LIBRARY_PATH = '/tmp/glwadys-browser-deps/root/usr/lib/x86_64-linux-gnu';
(async()=>{
const {chromium}=await import('playwright'),fs=await import('node:fs');
const dir='/home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/qa/gate-20261008-postfix';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const out={generated:new Date().toISOString(),cases:{}};
for(const [width,height] of [[320,700],[390,844],[1440,900]]){
 const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
 const page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4400/fr',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const d={width,height,initial:await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,lang:document.documentElement.lang}))};
 await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await sleep(250);
 d.footer=await page.evaluate(()=>{
   const nav=document.querySelector('nav a[href="#act-contact"]').closest('nav').getBoundingClientRect();
   const footer=document.querySelector('#act-contact footer')?.getBoundingClientRect();
   const returnLink=[...document.querySelectorAll('#act-contact a')].find(a=>a.getAttribute('href')==='#act-opening')?.getBoundingClientRect();
   return {nav:nav.toJSON(),footer:footer?.toJSON(),returnLink:returnLink?.toJSON(),scrollY,scrollWidth:document.documentElement.scrollWidth};
 });
 await page.screenshot({path:dir+'/'+width+'-contact-bottom.png'});
 await page.locator('#act-process').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await sleep(100);
 const buttons=page.locator('#act-process figure button');
 await buttons.last().click();await buttons.last().click();
 d.editAfterFastTap=await page.locator('#act-process [data-step]').getAttribute('data-step');
 await page.locator('#act-process figure button').first().click();
 d.editAfterBack=await page.locator('#act-process [data-step]').getAttribute('data-step');
 await page.locator('#act-process figure button').last().click();
 await page.locator('#act-process figure a[href="#act-work-yuna"]').focus();
 await page.keyboard.press('Enter');await sleep(1600);
 d.keyboardHandoff=await page.evaluate(()=>({hash:location.hash,activeId:document.activeElement?.id,targetName:getComputedStyle(document.querySelector('[data-yuna-handoff-target]')).viewTransitionName,sourceName:getComputedStyle(document.querySelector('[data-yuna-handoff-source]')).viewTransitionName,targetTop:Math.round(document.querySelector('[data-yuna-handoff-target]').getBoundingClientRect().top)}));
 d.performance=await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation').map(x=>({duration:Math.round(x.duration),domInteractive:Math.round(x.domInteractive),transferSize:x.transferSize})),resources:performance.getEntriesByType('resource').length}));
 d.errors=errors;out.cases[width]=d;await ctx.close();
}
for(const locale of ['fr','en','ko']){
 const ctx=await browser.newContext({viewport:{width:390,height:844}});
 const page=await ctx.newPage(),response=await page.goto('http://127.0.0.1:4400/'+locale,{waitUntil:'networkidle'});
 out['locale-'+locale]={status:response.status(),lang:await page.evaluate(()=>document.documentElement.lang),h1:await page.locator('h1').first().textContent()};
 await ctx.close();
}
fs.writeFileSync(dir+'/supplement.json',JSON.stringify(out,null,2));
console.log(JSON.stringify({file:dir+'/supplement.json',cases:Object.keys(out.cases),locales:['fr','en','ko']}));
await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
