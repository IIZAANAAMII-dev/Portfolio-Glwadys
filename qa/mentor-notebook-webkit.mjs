import{webkit}from'playwright';
const browser=await webkit.launch({headless:true});
for (const [name,width,height,locale] of [['mobile390',390,844,'fr'],['mobile320',320,800,'fr']]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'no-preference'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4440/'+locale,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForTimeout(2400);
 const top=await page.evaluate(()=>{let r=document.getElementById('act-process').getBoundingClientRect();return r.top+scrollY;});
 for(const t of [3.1,5.9,3.1]){
  await page.evaluate(y=>scrollTo(0,y),top+t*height*.74);
  await page.waitForTimeout(700);
  const s=await page.evaluate(()=>({y:scrollY,index:document.querySelector('[class*=storyIndex]')?.textContent,folio:[...document.querySelectorAll('[data-method-visual]')].map((x,i)=>({i,a:parseFloat(getComputedStyle(x).opacity)})).filter(x=>x.a>.25),width:document.documentElement.scrollWidth-innerWidth}));
  console.log('WEBKIT',name,t,JSON.stringify(s));
 }
 await page.screenshot({path:'/repo/docs/qa/film-gate/notebook-'+name+'-webkit.png'});
 console.log('WEBKIT_ERRORS',name,JSON.stringify(errors));
 await page.close();
}
await browser.close();