import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
for(const [name,width,height,locale] of [['desktop',1440,900,'fr'],['mobile',390,844,'fr'],['small',320,800,'fr']]){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference',recordVideo:{dir:'/repo/docs/qa/film-gate',size:{width,height}}});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4440/'+locale,{waitUntil:'domcontentloaded',timeout:25000});
 await page.waitForTimeout(2700);
 const start=await page.evaluate(()=>{let e=document.getElementById('act-process'),r=e.getBoundingClientRect();return r.top+scrollY;});
 const ratio=width>=1024?1:0.74;
 const loc=(p)=>start+height*ratio*p;
 for(let i=0;i<=100;i++){await page.evaluate(y=>scrollTo(0,y),loc(2.67+(5.9-2.67)*i/100));await page.waitForTimeout(55)}
 for(let i=100;i>=0;i--){await page.evaluate(y=>scrollTo(0,y),loc(2.67+(5.9-2.67)*i/100));await page.waitForTimeout(55)}
 await page.evaluate(y=>scrollTo(0,y),loc(3.1));await page.waitForTimeout(850);
 await page.screenshot({path:'/repo/docs/qa/film-gate/notebook-'+name+'-open-final.png'});
 const check=await page.evaluate(()=>{
 const book=document.querySelector('[data-method-book-cover]'),n=document.querySelector('[data-process-method]'),pages=[...document.querySelectorAll('[data-method-visual]')];
 const rect=e=>{const r=e.getBoundingClientRect();return[Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]};
 return {book:rect(book),scene:rect(n),visible:pages.map((e,i)=>({i,a:getComputedStyle(e).opacity})).filter(x=>+x.a>.2),overflow:document.documentElement.scrollWidth-innerWidth};
 });
 const video=page.video();await context.close();await video.saveAs('/repo/docs/qa/film-gate/notebook-'+name+'-film-forward-reverse.webm');
 console.log('NOTEBOOK_FILM',name,JSON.stringify({check,errors}));
}
await browser.close();