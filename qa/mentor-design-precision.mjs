import { chromium } from 'playwright';
const b=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
for(const [device,w,h,locale] of [['m320',320,800,'fr'],['m390',390,844,'fr'],['d1440',1440,900,'fr'],['m390-en',390,844,'en'],['m390-ko',390,844,'ko']]){
const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:'no-preference'});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:4440/'+locale,{waitUntil:'domcontentloaded',timeout:20000});
await p.waitForTimeout(2700);
for(const y of [0,Math.round(h*.25),Math.round(h*.45)]){
 await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(1100);
 const val=await p.evaluate(()=>{
 const r=s=>{let e=document.querySelector(s);if(!e)return null;let b=e.getBoundingClientRect(),css=getComputedStyle(e);return{x:Math.round(b.left),right:Math.round(b.right),top:Math.round(b.top),width:Math.round(b.width),visible:css.visibility,opacity:css.opacity}};
 return{first:r('[class*="nameFirst"] [data-name-line]'),last:r('[class*="nameLast"] [data-name-line]'),tag:r('[class*="tagline"]'),vw:innerWidth,sw:document.documentElement.scrollWidth};
 });
 console.log('OPEN',device,y,JSON.stringify(val));
 if(locale==='fr')await p.screenshot({path:'/repo/docs/qa/film-gate/'+device+'-art-direction-hero-'+y+'.png'});
}
for(const project of ['yuna','mgc','comptoir']){
 const dossier=await p.$('[data-project="'+project+'"] [data-project-dossier]');
 if(!dossier)continue;
 let y=await dossier.evaluate(e=>e.getBoundingClientRect().top+scrollY);
 for(const off of [100,Math.round(h*.6)]){
 await p.evaluate(y=>scrollTo(0,y),y+off);await p.waitForTimeout(1000);
 const val=await p.evaluate(project=>{let e=document.querySelector('[data-project="'+project+'"]');let rows=[...e.querySelectorAll('[data-case-row]')];return {rows:rows.map(x=>{let a=x.getBoundingClientRect();return{y:Math.round(a.top),opacity:getComputedStyle(x).opacity,visibility:getComputedStyle(x).visibility,color:getComputedStyle(x.querySelector('p')||x).color}}),sw:document.documentElement.scrollWidth}},project);
 console.log('CASE',device,project,off,JSON.stringify(val));
 if(locale==='fr'&&off===Math.round(h*.6))await p.screenshot({path:'/repo/docs/qa/film-gate/'+device+'-art-direction-'+project+'.png'});
 }
}
console.log('ERRORS',device,JSON.stringify(errs));await p.close();
}await b.close();
