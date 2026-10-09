import {chromium,webkit} from 'playwright';
for (const [engine,name,width,height] of [[webkit,'iphone390',390,844],[chromium,'desktop',1440,900]]) {
 const b=await engine.launch({headless:true,...(name==='desktop'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
 const p=await b.newPage({viewport:{width,height},reducedMotion:'no-preference'});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4440/fr?visualqa',{waitUntil:'domcontentloaded',timeout:30000});await p.waitForTimeout(2450);
 await p.evaluate(()=>window.__VISUAL_QA__.seek('opening','social'));await p.waitForTimeout(850);
 const social=await p.evaluate(()=>({noteOpacity:getComputedStyle(document.querySelector('[data-notebook-detail]')).opacity,noteVisibility:getComputedStyle(document.querySelector('[data-notebook-detail]')).visibility,heroOpacity:getComputedStyle(document.querySelector('[data-device]')).opacity,overflow:document.documentElement.scrollWidth-innerWidth}));
 await p.screenshot({path:'/repo/docs/qa/sol61-builder/mentor-luxury-final-social-'+name+'.png'});
 const start=await p.evaluate(()=>{const e=document.querySelector('[aria-labelledby="expertise-title"]');return e.getBoundingClientRect().top+scrollY;});
 await p.evaluate(y=>window.scrollTo(0,y),start+height*2.4*(width>=1024?1:.74));await p.waitForTimeout(1050);
 const expertise=await p.evaluate(()=>{const r=[...document.querySelectorAll('[data-expertise-row]')].filter(e=>{const b=e.getBoundingClientRect();return b.top<innerHeight&&b.bottom>0&&getComputedStyle(e).visibility!=='hidden'}).map(e=>({term:e.querySelector('[class*=term]')?.textContent,alpha:getComputedStyle(e).opacity}));return{rows:r.slice(-3),overflow:document.documentElement.scrollWidth-innerWidth}});
 await p.screenshot({path:'/repo/docs/qa/sol61-builder/mentor-luxury-final-expertise-'+name+'.png'});
 console.log('LUXURY_EVIDENCE',name,JSON.stringify({social,expertise,errors}));await p.close();await b.close();
}