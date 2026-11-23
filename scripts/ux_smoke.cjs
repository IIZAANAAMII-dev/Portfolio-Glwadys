/* UX smoke suite: public fixture jobs, no private accounts and no real applications. */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = path.resolve(__dirname,'..');
const output = path.join(root,'ux-proof');
fs.mkdirSync(output,{recursive:true});
const count=31;
fs.writeFileSync(path.join(root,'public','job-hub','jobs-feed.json'),JSON.stringify({
  generated_at:new Date().toISOString(),sources:['Test fixture'],
  source_errors:[],
  jobs:Array.from({length:count},(_,i)=>({
    id:'qa-'+i,
    title:i===0?'Chargée de communication et événementiel':'Chargée de communication '+(i+1),
    company:i===0?'Maison fictive (test UX)':'Entreprise test '+(i+1),
    location:'France / Remote',remote:true,
    source:'QA only',date:'2026-11-22',
    description:'Communication, contenu social media, organisation d’événements, partenariats, suivi de projets. Maîtrise de GA4 souhaitée. Offre fictive pour test uniquement.',
    url:'https://example.org/opportunities/'+(i+1)
  }))
},null,2),'utf8');
async function main(){
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const errors=[];
  const context=await browser.newContext({viewport:{width:1440,height:930},permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push('desktop: '+e.message));
  const base='http://127.0.0.1:4173/';
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('#feed-side-count').filter({hasText:'31'}).waitFor({timeout:30000});
  assert.equal(await page.locator('.studio-step').count(),3,'three-step onboarding');
  assert.equal(await page.locator('.studio-nav-link').count(),1,'premium atelier nav');
  await page.screenshot({path:path.join(output,'studio-desktop.png'),fullPage:true});
  await page.locator('.side-nav [data-view="offres"]').click();
  await page.locator('.job-card').first().waitFor();
  assert.equal(await page.locator('.job-card').count(),24,'24 jobs in first page');
  assert.equal(await page.locator('#radar-zone').inputValue(),'frbe','France+Belgique is the default');
  assert.ok((await page.locator('#radar-top-picks').textContent()).length>15,'personalized top recommendations visible');
  assert.ok((await page.locator('.radar-match').first().textContent()).includes('Parcours'),'explainable fit details visible');
  const eligibility=await page.evaluate(()=>{
    const job=(overrides)=>Object.assign({id:'qa-check',title:'Community Manager',company:'Fictive',location:'France',description:'Social media content',remote:true,url:'https://example.org/qa'},overrides);
    return {
      ukOnly:GlwadysRadar.keep(job({location:'Ireland, UK',locationRestrictions:['GB']})),
      usOnly:GlwadysRadar.keep(job({location:'Remote US',locationRestrictions:['US']})),
      intern:GlwadysRadar.keep(job({title:'Alternance communication',employmentType:'Internship'})),
      senior:GlwadysRadar.keep(job({title:'Senior Director Marketing',seniority:'Director'})),
      france:GlwadysRadar.explain(job({location:'France',locationRestrictions:['FR']})).where.eligible
    };
  });
  assert.equal(eligibility.ukOnly,false,'UK-only remote roles excluded');
  assert.equal(eligibility.usOnly,false,'US-only remote roles excluded');
  assert.equal(eligibility.intern,false,'internship roles excluded by default');
  assert.equal(eligibility.senior,false,'senior roles excluded by default');
  assert.equal(eligibility.france,true,'French roles remain eligible');
  await page.locator('#radar-family').selectOption('retail');
  assert.equal(await page.locator('.job-card').count(),0,'communication ads are filtered out in retail-only mode');
  await page.locator('#radar-family').selectOption('mix');
  assert.equal(await page.locator('.job-card').count(),24,'matching jobs return after resetting job family');
  await page.locator('#offer-more').click();
  assert.equal(await page.locator('.job-card').count(),count,'all jobs visible after load more');
  await page.locator('.job-card [data-prepare-job]').first().click();
  await page.waitForURL(/atelier/,{timeout:15000});
  assert.match(await page.locator('#company').inputValue(),/Maison fictive/);
  assert.match(await page.locator('#ad').inputValue(),/GA4/);
  await page.locator('#cv-jobs .job').first().waitFor();
  assert.equal(await page.locator('#cv-jobs .job').count(),5,'all verified jobs remain');
  assert.equal(await page.locator('.stat-circle').count(),3,'three right-side circles');
  assert.match(await page.locator('#gaps').textContent(),/GA4/,'unverified skills flagged');
  const width=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  assert.ok(width<3,'desktop no horizontal overflow: '+width);
  await page.screenshot({path:path.join(output,'atelier-desktop.png'),fullPage:true});
  await page.locator('#copy-ats').click();
  const clip=await page.evaluate(()=>navigator.clipboard.readText());
  for(const needle of ['GLWADYS DALLEAU','Marseille Girls Club','Yuna Bijoux','Kiko Milano']){
    assert.ok(clip.includes(needle),'ATS copy includes '+needle);
  }
  await page.locator('#ats-clean').check();
  assert.equal(await page.locator('body.ats-clean').count(),1,'ATS clean mode visible');
  await page.locator('#ats-clean').uncheck();
  assert.equal(await page.locator('#download-cv-pdf').isVisible(),true,'CV download action visible');
  const pdfNativeCv=await page.evaluate(()=>Array.from(window.GlwadysPDF.generateCv()));
  assert.ok(pdfNativeCv.length>3000 && String.fromCharCode(...pdfNativeCv.slice(0,5))==='%PDF-','native CV is a real PDF');
  fs.writeFileSync(path.join(output,'CV-natif-exemple-QA.pdf'),Buffer.from(pdfNativeCv));
  const pdfNativeLetter=await page.evaluate(()=>Array.from(window.GlwadysPDF.generateLetter()));
  assert.ok(pdfNativeLetter.length>2000 && String.fromCharCode(...pdfNativeLetter.slice(0,5))==='%PDF-','native letter is a real PDF');
  fs.writeFileSync(path.join(output,'Lettre-native-exemple-QA.pdf'),Buffer.from(pdfNativeLetter));
  await page.evaluate(()=>{document.body.dataset.print='cv';document.body.dataset.tab='cv';});
  await page.pdf({path:path.join(output,'CV-exemple-fictif-QA.pdf'),format:'A4',printBackground:true});
  await page.locator('#tab-letter').click();
  assert.equal(await page.locator('#letter-preview').isVisible(),true,'letter tab');
  assert.match(await page.locator('#letter-body').textContent(),/Marseille Girls Club|Comptoir de Mathilde/);
  await page.screenshot({path:path.join(output,'lettre-desktop.png'),fullPage:true});
  await page.evaluate(()=>{document.body.dataset.print='letter';document.body.dataset.tab='letter';});
  await page.pdf({path:path.join(output,'Lettre-exemple-fictif-QA.pdf'),format:'A4',printBackground:true});
  page.once('dialog',async dialog=>{await dialog.accept()});
  await page.locator('#example-offer').click();
  assert.match(await page.locator('#ad').inputValue(),/OFFRE FICTIVE/);
  await page.locator('#save-draft').click();
  assert.ok(await page.evaluate(()=>localStorage.getItem('glwadys-atelier-draft-v1')),'draft locally saved');
  const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const mp=await mobile.newPage();
  mp.on('pageerror',e=>errors.push('mobile: '+e.message));
  await mp.goto(base,{waitUntil:'domcontentloaded'});
  await mp.locator('.mobile-studio-cta').waitFor();
  assert.equal(await mp.locator('.mobile-studio-cta').isVisible(),true);
  await mp.screenshot({path:path.join(output,'studio-mobile.png'),fullPage:true});
  const overflow0=await mp.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  assert.ok(overflow0<4,'mobile studio no horizontal overflow: '+overflow0);
  await mp.locator('.mobile-studio-cta').click();
  await mp.waitForURL(/atelier/);
  const overflow1=await mp.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  assert.ok(overflow1<4,'mobile atelier no horizontal overflow: '+overflow1);
  await mp.screenshot({path:path.join(output,'atelier-mobile.png'),fullPage:true});
  assert.equal(errors.length,0,'No browser exceptions: '+errors.join(' / '));
  console.log('PASS: Job Studio 31 offers, pagination, app→atelier handoff, CV/letter, ATS and mobile');
  console.log('Screenshots and sample PDFs:',output);
  await browser.close();
}
main().catch(e=>{console.error('UX QA failed:',e.stack||e);process.exitCode=1;});