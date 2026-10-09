import{chromium}from'playwright';
const b=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
for(const [device,w,h,locale,reduced] of [['desktop',1440,900,'fr','no-preference'],['mobile',390,844,'fr','no-preference'],['small',320,800,'fr','no-preference'],['english',390,844,'en','no-preference'],['korean',390,844,'ko','no-preference'],['accessible',390,844,'fr','reduce']]){
 const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:reduced});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4440/'+locale,{waitUntil:'domcontentloaded',timeout:25000});await p.waitForTimeout(2600);
 const sec=await p.evaluate(()=>{let e=document.getElementById('act-journey-scene'),r=e.getBoundingClientRect();return{top:r.top+scrollY,h:r.height}});
 const progress=[];
 for(const [index,f]of[0,.12,.24,.4,.6,.8,.94].entries()){
  const y=sec.top+Math.max(0,(sec.h-h))*f;
  await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(900);
  const state=await p.evaluate(()=>{
    const root=document.querySelector('#act-journey-scene');
    const cards=[...root.querySelectorAll('[data-journey-entry]')].map((e,i)=>({i,alpha:Number(getComputedStyle(e).opacity),textAlpha:Number(getComputedStyle(e.querySelector('[data-journey-ink]')).opacity),title:e.querySelector('.x')?.textContent,top:Math.round(e.getBoundingClientRect().top)}));
    const active=[...root.querySelectorAll('[data-journey-chapter][data-active]')].map(e=>e.textContent?.trim());
    const rect=root.getBoundingClientRect();
    return {y:Math.round(scrollY),rectTop:Math.round(rect.top),active,visibleCards:cards.filter(e=>e.alpha>.5),docWidth:document.documentElement.scrollWidth,viewport:innerWidth,ready:document.documentElement.dataset.shellReady};
  });
  progress.push({f,...state});
  if(locale==='fr'&&reduced==='no-preference'&&[1,2,3,4,5].includes(index)){
   await p.screenshot({path:'/repo/docs/qa/film-gate/'+device+'-journey-redesign-'+index+'.png'});
  }
 }
 await p.evaluate(y=>window.scrollTo(0,y),sec.top);await p.waitForTimeout(500);
 console.log('JOURNEY_GATE',device,JSON.stringify({reduced,progress,errors}));
 await p.close();
}
await b.close();