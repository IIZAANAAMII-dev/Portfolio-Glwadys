import{chromium,webkit}from'playwright';
for(const [engine,name] of [[chromium,'chromium'],[webkit,'webkit']]){
 const b=await engine.launch({headless:true,...(name==='chromium'?{args:['--no-sandbox','--disable-dev-shm-usage']}:{})});
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4440/fr',{waitUntil:'domcontentloaded'});await p.waitForTimeout(2200);
 const start=await p.evaluate(()=>{let e=document.getElementById('act-scroll-story');return e.getBoundingClientRect().top+scrollY;});
 for(const t of [2.97,3.18,3.35,3.52,3.72,3.92,3.52]){
 await p.evaluate(y=>scrollTo(0,y),start+844*.74*t);await p.waitForTimeout(760);
 const s=await p.evaluate(()=>({rows:[...document.querySelectorAll('[data-layer-row]')].map(e=>+getComputedStyle(e).opacity).map(x=>+x.toFixed(2)),behind:document.querySelector('[data-behind]')?+getComputedStyle(document.querySelector('[data-behind]')).opacity:0,overflow:document.documentElement.scrollWidth-innerWidth}));
 console.log('BEHIND',name,t,JSON.stringify(s));
 if([3.18,3.35,3.52,3.72].includes(t))await p.screenshot({path:'/repo/docs/qa/film-gate/behind-'+name+'-'+String(t).replace('.','-')+'.png'});
 }
 console.log('BEHIND_ERRORS',name,JSON.stringify(errors));await p.close();await b.close();
}