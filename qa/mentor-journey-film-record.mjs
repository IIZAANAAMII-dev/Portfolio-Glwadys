import{chromium}from'playwright';const b=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
for(const[name,w,h]of[['mobile',390,844],['desktop',1440,900]]){
const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'no-preference',recordVideo:{dir:'/repo/docs/qa/film-gate',size:{width:w,height:h}}});
const p=await ctx.newPage();await p.goto('http://127.0.0.1:4440/fr',{waitUntil:'domcontentloaded'});await p.waitForTimeout(2400);
const range=await p.evaluate(()=>{const r=document.getElementById('act-journey-scene').getBoundingClientRect();return{y:r.top+scrollY,length:r.height-innerHeight};});
for(let i=0;i<=100;i++){const y=range.y+range.length*(i/100);await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(45);}
for(let i=100;i>=0;i--){const y=range.y+range.length*(i/100);await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(45);}
const vid=p.video();await ctx.close();await vid.saveAs('/repo/docs/qa/film-gate/parcours-redesign-'+name+'-forward-reverse.webm');
console.log('VIDEO_DONE',name,range);await p.close();
}
await b.close();