import {chromium,webkit} from 'playwright';
for(const [engine,name,w,h] of [[webkit,'iphone390',390,844],[webkit,'iphone320',320,800],[chromium,'desktop',1440,900]]){
 const b=await engine.launch({headless:true,...(name==='desktop'?{args:['--no-sandbox','--disable-dev-shm-usage']}:{})});
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:'no-preference'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4440/fr?visualqa',{waitUntil:'domcontentloaded',timeout:30000});await p.waitForTimeout(2300);
 for(const [state,at]of [['social','social'],['behind','behind'],['phone','feed']]){
  await p.evaluate(s=>window.__VISUAL_QA__?.seek('opening',s),at);
  await p.waitForTimeout(950);
  const v=await p.evaluate(()=>{
    const rect=x=>{if(!x)return null;const r=x.getBoundingClientRect(); const c=getComputedStyle(x);return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),opacity:c.opacity,visible:c.visibility}};
    const device=document.querySelector('[data-device]');
    const title=document.querySelector('[class*="frontLabel"]');
    const statement=document.querySelector('[class*="frontIntent"]');
    const satellite=document.querySelector('[data-social-slot="1"]');
    const touches=(a,b)=>a&&b&&(a.x<a2(b)&&a2(a)>b.x&&a.y<(b.y+b.h)&&a.y+a.h>b.y);
    function a2(r){return r.x+r.w;}
    const r={device:rect(device),title:rect(title),statement:rect(statement),portrait:rect(satellite)};
    return {...r,titleOverPrint:touches(r.device,r.title),statementOverPrint:touches(r.device,r.statement),overflow:document.documentElement.scrollWidth-innerWidth,scrollY:Math.round(scrollY),film:window.__VISUAL_QA__?.snapshot().films.opening?.time};
  });
  console.log('SOCIAL_GATE',name,state,JSON.stringify(v));
  if(state==='social')await p.screenshot({path:'/repo/docs/qa/sol61-builder/mentor-'+name+'-social-reframe.png'});
 }
 console.log('PAGE_ERRORS',name,JSON.stringify(errors));
 await p.close();await b.close();
}