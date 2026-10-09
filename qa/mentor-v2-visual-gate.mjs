import { chromium, webkit } from 'playwright';
const checks = [
  [chromium,'desktop',1440,900,'fr'],
  [webkit,'iphone390',390,844,'fr'],
  [webkit,'iphone320',320,800,'fr'],
  [webkit,'iphone390-en',390,844,'en'],
  [webkit,'iphone390-ko',390,844,'ko'],
];
for(const [engine,name,width,height,locale] of checks){
 const b=await engine.launch({headless:true,...(name==='desktop'?{args:['--no-sandbox','--disable-dev-shm-usage']}: {})});
 const p=await b.newPage({viewport:{width,height},reducedMotion:'no-preference'});
 let errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4455/'+locale+'?visualqa',{waitUntil:'domcontentloaded',timeout:30000});
 await p.waitForTimeout(2600);
 const shots=[];
 for (const [film,state] of [['opening','develop'],['opening','social'],['opening','moodboard'],['opening','screen'],['opening','focus'],['opening','immersion'],['opening','print'],['opening','paper'],['notebook','entry'],['notebook','system'],['notebook','vault']]){
   const result=await p.evaluate(({film,state})=>{try{return{y:window.__VISUAL_QA__.seek(film,state)}}catch(e){return{error:e.message}}},{film,state});
   if(result.error){console.log('UNKNOWN_STATE',name,film,state,result.error);continue;}
   await p.waitForTimeout(630);
   const v=await p.evaluate(()=>{
    const e=document.querySelector('[data-aperture]');
    const s=e&&getComputedStyle(e);
    const hero=document.querySelector('[data-reel-layer="hero"]');
    const sr=hero?.getBoundingClientRect();
    const imgs=[...document.querySelectorAll('img')];
    return{scroll:Math.round(scrollY),aperture:s?.clipPath,apertureOpacity:s?.opacity,heroBounds:sr&&[Math.round(sr.x),Math.round(sr.y),Math.round(sr.width),Math.round(sr.height)],brokenImages:imgs.filter(x=>x.complete&&!x.naturalWidth).length,overflow:document.documentElement.scrollWidth-innerWidth,films:window.__VISUAL_QA__?.snapshot().films};
   });
   const label=film+'-'+state;
   if(['desktop','iphone390','iphone320'].includes(name)){
    await p.screenshot({path:'/repo/docs/qa/op55-v2/'+name+'-'+label+'.png'});
   }
   shots.push({label,scroll:v.scroll,overflow:v.overflow,brokenImages:v.brokenImages,aperture:v.aperture,opacity:v.apertureOpacity});
 }
 for(const reverse of ['opening:paper','opening:social','opening:develop']){
  const [film,state]=reverse.split(':');
  await p.evaluate(({film,state})=>window.__VISUAL_QA__.seek(film,state),{film,state});
  await p.waitForTimeout(700);
  const v=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,brokenImgs:[...document.images].filter(e=>e.complete&&!e.naturalWidth).length}));
  shots.push({label:'reverse-'+state,...v});
 }
 console.log('V2_GATE',name,JSON.stringify({shots,errors}).slice(0,6500));
 await p.close();await b.close();
}
