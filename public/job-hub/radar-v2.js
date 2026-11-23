/* Glwadys Career Studio · candidate-grounded ranking & preference controls.
   Explanations are heuristics, NOT hiring probabilities.
   Everything personal stays local to this browser. */
(()=>{
 'use strict';
 const KEY='glwadys-radar-preferences-v2';
 const IGNORE='glwadys-radar-ignored-v2';
 const defaults={zone:'frbe',family:'mix',minScore:35,level:'junior',remote:true,onlyNew:false};
 const lexicons={
  communication:{name:'Communication',terms:['communication','marketing','community manager','social media','content','brand','digital','relations presse','influence','marketing assistant','copywriting','content creator','social content','campaign']},
  retail:{name:'Retail / management',terms:['boutique','store','retail','vente','sales assistant','sales associate','conseill','merchandising','shop','customer experience','customer success','commerce','account manager']},
  event:{name:'Événementiel',terms:['evenement','event','partenariat','partnership','animation','activation','operations','coordinateur evenementiel','gestion de projet']}
 };
 const facts=[
  {label:'Management et coordination',terms:['management','equipe','coordination','leadership','supervision','responsable','pilotage','team lead','managing a team']},
  {label:'Merchandising',terms:['merchandising','vitrine','visual merchandising','implantation','presentoir','stock management']},
  {label:'Relation client et vente',terms:['client','customer','retail','vente','sales','commerce','relationship','hospitality']},
  {label:'Création de contenus',terms:['social media','community','content','reels','video','instagram','copy','editorial','contenus']},
  {label:'Organisation d’événements',terms:['evenement','events','event','salon','animation','partenariat','partnership']}
 ];
 const unknown=[
  {name:'SEO / référencement',terms:[' seo ','referencement',' search engine optimization']},
  {name:'Google Analytics / GA4',terms:['google analytics',' ga4 ']},
  {name:'Google Ads / SEA',terms:['google ads','adwords','paid search']},
  {name:'Meta Ads',terms:['meta ads','facebook ads','paid social']},
  {name:'Canva',terms:['canva']},
  {name:'Adobe Photoshop / InDesign',terms:['photoshop','indesign']},
  {name:'CRM / Salesforce',terms:['salesforce',' crm ']},
  {name:'Excel avancé',terms:['pivot table','tableau croise','excel avance']},
  {name:'Gestion de budget médias',terms:['media budget','budget media']}
 ];
 const near=['vannes','lorient','auray','rennes','nantes','brest','quimper','saint-brieuc','saint malo','morbihan','finistere','bretagne','loire-atlantique'];
 const france=['france','paris','lyon','marseille','bordeaux','lille','toulouse','nice','angers','strasbourg','montpellier','la rochelle','aix en provence',...near];
 const belgium=['belgique','belgium','bruxelles','brussels','liege','namur','anvers','antwerp','gent','ghent','wallonie','charleroi'];
 const toNorm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ');
 const contains=(hay,needle)=>hay.includes(toNorm(needle));
 const match=(hay,terms)=>terms.some(t=>contains(hay,t));
 const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v===null?fallback:v}catch{return fallback}};
 const merged=Object.assign({},defaults,read(KEY,{}));
 const savedSettings={
  zone:['frbe','breizh','fr','be','remote','all'].includes(merged.zone)?merged.zone:'frbe',
  family:['mix','communication','retail','event'].includes(merged.family)?merged.family:'mix',
  minScore:Math.min(95,Math.max(0,Number(merged.minScore)||35)),
  level:['junior','any'].includes(merged.level)?merged.level:'junior',
  remote:merged.remote!==false,
  onlyNew:!!merged.onlyNew
 };
 let ignored=new Set((Array.isArray(read(IGNORE,[]))?read(IGNORE,[]):[]).slice(0,1500));
 let liveData=null;
 function persist(){
  try{localStorage.setItem(KEY,JSON.stringify(savedSettings))}catch{}
 }
 function remoteEligibility(job){
  const rest=Array.isArray(job.locationRestrictions)?job.locationRestrictions:[];
  const location=toNorm(job.location);
  if(!job.remote)return {valid:true,text:'Poste sur site'};
  const isOpenRegion=v=>/\b(fr|be|eu|europe|emea)\b/.test(v)||match(v,['france','belgium','belgique','worldwide','anywhere','global','european union','all countries','europe']);
  if(rest.length){
   const locations=rest.map(toNorm);
   if(locations.some(isOpenRegion))return {valid:true,text:'Télétravail potentiellement accessible depuis la France ou la Belgique'};
   return {valid:false,text:'Télétravail limité à '+rest.slice(0,3).join(', ')};
  }
  // A job labeled Remote but geographically listed as "Ireland, UK"
  // is not assumed open to applicants living in France.
  const explicitForeign=match(location,['uk','united kingdom','ireland','netherlands','dutch','united states','usa','canada','australia','india','london','dublin','amsterdam']);
  if(explicitForeign&&!isOpenRegion(location))return {valid:false,text:'Télétravail probablement restreint à '+job.location+' : vérifier les conditions'};
  if(isOpenRegion(location))return {valid:true,text:'Télétravail en France / Belgique à vérifier auprès de l’employeur'};
  return {valid:true,text:'Télétravail : pays éligibles non indiqués, vérification nécessaire'};
 }
 function geo(job){
  const loc=toNorm(job.location),inFrance=match(loc,france),inBelgium=match(loc,belgium),inNear=match(loc,near);
  const remote=!!job.remote;
  const eligibility=remoteEligibility(job);
  let matchZone=false;
  if(savedSettings.zone==='all')matchZone=true;
  else if(savedSettings.zone==='remote')matchZone=remote&&eligibility.valid;
  else if(savedSettings.zone==='be')matchZone=inBelgium||(remote&&eligibility.valid);
  else if(savedSettings.zone==='fr')matchZone=inFrance||(remote&&eligibility.valid);
  else if(savedSettings.zone==='breizh')matchZone=inNear||(remote&&eligibility.valid);
  else matchZone=inFrance||inBelgium||(remote&&eligibility.valid);
  if(remote&&!savedSettings.remote&&savedSettings.zone!=='remote')matchZone=matchZone&&(inFrance||inBelgium)&&!remote;
  return {inNear,inFrance,inBelgium,remote,eligible:eligibility.valid,reason:eligibility.text,matchZone:matchZone&&eligibility.valid};
 }
 function evalJob(job){
  const text=toNorm(job.title+' '+job.description),title=toNorm(job.title),where=geo(job);
  const families=Object.entries(lexicons).map(([id,data])=>({
   id,
   titleScore:data.terms.filter(term=>contains(title,term)).length,
   descScore:data.terms.filter(term=>contains(toNorm(job.description),term)).length
  })).sort((a,b)=>(b.titleScore*3+b.descScore)-(a.titleScore*3+a.descScore));
  const top=families[0];
  const familyMatches=savedSettings.family==='mix'||families.find(f=>f.id===savedSettings.family && (f.titleScore>0||f.descScore>1));
  const strengths=facts.filter(f=>match(text,f.terms)).map(f=>f.label).slice(0,4);
  const gaps=unknown.filter(f=>match(' '+text+' ',f.terms)).map(f=>f.name).slice(0,3);
  const senior=/\b(senior|sr\.?|director|directeur|head of|vp|vice president|chief|principal|expert|lead|manager senior)\b/i.test(job.title+' '+(job.seniority||''))||/\b(?:minimum|at least|minimum of)\s*(?:[5-9]|1[0-9])\s*(?:ans|years)\b/i.test(job.description);
  const internship=/\b(alternance|alternant|apprentissage|apprentice|internship|intern|stage|stagiaire|work-study)\b/i.test(job.title+' '+(job.employmentType||''));
  const foreignLanguage=/\b(dutch|german|spanish|italian|polish|swedish|norwegian|portuguese|flemish|nederlands)\s*(?:speaking|fluent|native|bilingual)\b/i.test(job.title+' '+(job.description||'').slice(0,600));
  const age=job.date?Math.floor((Date.now()-Date.parse(job.date))/86400000):null;
  let score=13;
  score+=Math.min(29,top.titleScore*19+Math.min(8,top.descScore*2));
  if(top.titleScore===0)score-=12;
  score+=Math.min(20,strengths.length*5);
  if(where.inNear)score+=24;
  else if(where.inFrance||where.inBelgium)score+=15;
  else if(where.remote&&where.eligible)score+=7;
  if(age!==null&&Number.isFinite(age)){
   if(age<=3)score+=11;
   else if(age<=14)score+=8;
   else if(age<=30)score+=5;
   else if(age>75)score-=10;
  }
  if(senior)score-=30;
  if(internship)score-=30;
  if(foreignLanguage)score-=25;
  if(gaps.length>=2)score-=Math.min(12,gaps.length*4);
  if(!where.eligible)score=0;
  if(!familyMatches)score-=25;
  const reasons=[];
  if(top.titleScore>0)reasons.push('Intitulé lié à '+lexicons[top.id].name.toLowerCase());
  if(strengths.length)reasons.push('Parcours pertinent : '+strengths.slice(0,2).join(', '));
  if(where.inNear)reasons.push('Proche de Vannes / Bretagne');
  else if(where.inFrance)reasons.push('Poste situé en France');
  else if(where.inBelgium)reasons.push('Poste situé en Belgique');
  else if(where.remote)reasons.push('Télétravail : éligibilité à confirmer');
  if(age!==null&&age<=7)reasons.push('Annonce récente');
  const concerns=[];
  if(senior)concerns.push('Niveau senior à examiner');
  if(internship)concerns.push('Stage / alternance : pas un poste permanent');
  if(foreignLanguage)concerns.push('Langue étrangère spécifique à vérifier');
  if(gaps.length)concerns.push('Compétences à confirmer : '+gaps.join(', '));
  if(!where.eligible)concerns.push(where.reason);
  if(!job.description||job.description.length<120)concerns.push('Description incomplète : consulter la source');
  return {score:Math.max(0,Math.min(100,Math.round(score))),family:top.id,familyMatches:!!familyMatches,where,strengths,reasons,concerns,gaps,senior,internship,foreignLanguage,age};
 }
 function keep(job){
  if(ignored.has(job.id)||ignored.has(job.url))return false;
  const e=evalJob(job);
  if(!e.where.matchZone)return false;
  if(savedSettings.level==='junior'&&(e.senior||e.internship||e.foreignLanguage))return false;
  if(!e.familyMatches)return false;
  if(e.score<savedSettings.minScore)return false;
  if(savedSettings.onlyNew&&!(typeof newJobIds!=='undefined'&&newJobIds.has(job.id)))return false;
  return true;
 }
 function renderDetails(job,escape){
  const e=evalJob(job);
  const line=e.reasons.slice(0,2).join(' · ')||'Vérifier les missions exactes';
  const flags=e.concerns.slice(0,2);
  const salary=job.salary&&job.salary.currency?
   ' · '+(job.salary.min?Number(job.salary.min).toLocaleString('fr-FR'):'?')+'–'+(job.salary.max?Number(job.salary.max).toLocaleString('fr-FR'):'?')+' '+job.salary.currency+'/'+(job.salary.period||'an'):'';
  const safe=escape||((v)=>String(v));
  const sourceLink=job.sourceUrl&&/^https:\/\//.test(job.sourceUrl)?'<a href="'+safe(job.sourceUrl)+'" target="_blank" rel="noopener noreferrer">Source '+safe(job.source)+' ↗</a>':'Source '+safe(job.source);
  return '<div class="radar-match"><div class="radar-match-good">✓ '+safe(line)+'</div>'
   +(flags.length?'<div class="radar-match-warning">À vérifier : '+safe(flags.join(' · '))+'</div>':'')
   +'<div class="radar-match-meta">'+safe(e.where.reason)+safe(salary)+' · '+sourceLink+'</div></div>';
 }
 function ignore(job){
  ignored.add(job.id);ignored.add(job.url);
  if(ignored.size>1800)ignored=new Set([...ignored].slice(-1200));
  try{localStorage.setItem(IGNORE,JSON.stringify([...ignored]))}catch{}
 }
 function reset(){Object.assign(savedSettings,defaults);ignored.clear();try{localStorage.removeItem(IGNORE)}catch{}persist();syncForm();renderJobs();}
 function onUpdate(){
  persist();renderJobs();
 }
 function syncForm(){
  const ids={'radar-zone':'zone','radar-family':'family','radar-level':'level','radar-minscore':'minScore','radar-only-new':'onlyNew','radar-remote':'remote'};
  for(const [id,key] of Object.entries(ids)){
   const node=document.getElementById(id);if(!node)continue;
   if(node.type==='checkbox')node.checked=!!savedSettings[key];
   else node.value=String(savedSettings[key]);
  }
  const badge=document.getElementById('radar-minscore-value');
  if(badge)badge.textContent=String(savedSettings.minScore);
 }
 function ui(){
  syncForm();
  const ids={'radar-zone':'zone','radar-family':'family','radar-level':'level','radar-minscore':'minScore','radar-only-new':'onlyNew','radar-remote':'remote'};
  for(const [id,key] of Object.entries(ids)){
   const node=document.getElementById(id);if(!node)continue;
   const update=()=>{savedSettings[key]=node.type==='checkbox'?node.checked:key==='minScore'?Number(node.value):node.value;syncForm();onUpdate()};
   node.addEventListener(node.type==='range'?'input':'change',update);
  }
  document.getElementById('radar-reset')?.addEventListener('click',reset);
  document.addEventListener('click',event=>{
   const button=event.target.closest('[data-ignore-job]');
   if(!button)return;
   const id=button.dataset.ignoreJob;
   const job=typeof jobs!=='undefined'&&jobs.find(j=>j.id===id);
   if(!job)return;
   ignore(job);renderJobs();
   if(typeof toast==='function')toast('Offre masquée. Tu peux réinitialiser les filtres pour la retrouver.');
  });
 }
 function onFeed(data){
  liveData=data;
  const node=document.getElementById('radar-sources-status');
  if(node){
   const active=(data.sources||[]).join(' · ');
   const errors=(data.source_errors||[]).length;
   node.textContent=(active||'Aucune source')+(errors?' · '+errors+' source(s) indisponible(s)':' · collecte sans erreur');
  }
  const updated=document.getElementById('radar-last-check');
  if(updated)updated.textContent=data.generated_at?new Date(data.generated_at).toLocaleString('fr-FR'):'Non disponible';
 }
 function summary(all,matching){
  const count=document.getElementById('radar-personal-count');
  if(count)count.textContent=String(matching.length);
  const top=matching.slice(0,3).map(job=>job.title+' · '+job.company);
  const text=document.getElementById('radar-top-picks');
  if(text)text.textContent=top.length?top.join('  •  '):'Aucune offre avec ces critères : essaie un seuil plus bas ou un périmètre plus large.';
  const seen=document.getElementById('radar-alert-summary');
  const newRelevant=matching.filter(j=>typeof newJobIds!=='undefined'&&newJobIds.has(j.id)).length;
  if(seen)seen.textContent=newRelevant?newRelevant+' nouvelle(s) offre(s) pertinentes détectées':'Aucune nouveauté pertinente détectée pour le moment';
 }
 const app={score:j=>evalJob(j).score,explain:evalJob,keep,renderDetails,settings:savedSettings,summary,onFeed,isTopMatch:j=>evalJob(j).score>=Math.max(savedSettings.minScore,65)&&keep(j),ignored:()=>ignored};
 window.GlwadysRadar=app;
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ui);else ui();
})();