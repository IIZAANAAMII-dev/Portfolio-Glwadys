import { chromium } from 'playwright';
const b=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
for(const [name,width,height,locale,reduced] of [['desktop',1440,900,'fr','no-preference'],['mobile390',390,844,'fr','no-preference'],['mobile320',320,800,'fr','no-preference'],['english',390,844,'en','no-preference'],['korean',390,844,'ko','no-preference'],['reduced',390,844,'fr','reduce']]){
const p=await b.newPage({viewport:{width,height},reducedMotion:reduced});
let errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:4440/'+locale,{waitUntil:'domcontentloaded',timeout:20000});
await p.waitForTimeout(2700);
const processTop=await p.evaluate(()=>{let e=document.getElementById('act-process');return e.getBoundingClientRect().top+scrollY});
let result=[];
const ratio=width>=1024?1:0.74;
if(reduced==='reduce'){
await p.evaluate(y=>scrollTo(0,y),processTop+height*1.1);await p.waitForTimeout(650);
await p.screenshot({path:'/repo/docs/qa/film-gate/book-'+name+'-static.png'});
}else{
const stages=[2.65,2.85,3.06,3.2,3.62,4.17,4.72,5.25,5.63,5.85,6.05];
for(const t of stages){
await p.evaluate(y=>scrollTo(0,y),processTop+height*ratio*t);
await p.waitForTimeout(950);
const state=await p.evaluate(()=>{
const page=[...document.querySelectorAll('[data-method-visual]')].map((el,index)=>({index,opacity:Number(getComputedStyle(el).opacity),transform:getComputedStyle(el).transform.slice(0,72),clip:getComputedStyle(el).clipPath,top:Math.round(el.getBoundingClientRect().top)}));
const cover=document.querySelector('[data-method-book-cover]');
return {scroll:Math.round(scrollY),cover:cover&&{alpha:getComputedStyle(cover).opacity,transform:getComputedStyle(cover).transform.slice(0,80)},pages:page.filter(x=>x.opacity>0.1),overflow:document.documentElement.scrollWidth-innerWidth};
});
result.push({t,...state});
if(['desktop','mobile390','mobile320'].includes(name))await p.screenshot({path:'/repo/docs/qa/film-gate/book-'+name+'-'+String(t).replace('.','-')+'.png'});
}
}
console.log('BOOK_QA',name,JSON.stringify({processTop,result,errors}));
await p.close();
}
await b.close();
