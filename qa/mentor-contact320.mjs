import{webkit}from'playwright';const b=await webkit.launch({headless:true});const p=await b.newPage({viewport:{width:320,height:800}});
await p.goto('http://127.0.0.1:4440/fr',{waitUntil:'domcontentloaded'});await p.waitForTimeout(2600);
const top=await p.evaluate(()=>{const e=document.getElementById('act-contact');return e.getBoundingClientRect().top+scrollY});
await p.evaluate(y=>window.scrollTo(0,y),top+800*.85);await p.waitForTimeout(1250);
console.log('CONTACT_320',JSON.stringify(await p.evaluate(()=>{const e=document.querySelector('[class*=labelEmail]');const r=e.getBoundingClientRect();return{text:e.textContent,offsetWidth:e.offsetWidth,scrollWidth:e.scrollWidth,rect:[Math.round(r.left),Math.round(r.right)],height:Math.round(r.height),font:getComputedStyle(e).fontSize,overflow:document.documentElement.scrollWidth-innerWidth}})));
await p.screenshot({path:'/repo/docs/qa/sol61-builder/mentor-contact-opus55-320-fixed.png'});await p.close();await b.close();