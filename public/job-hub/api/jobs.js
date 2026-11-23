/* Glwadys Career Studio · ethical multi-source job radar V2.
 * Only public, documented APIs; no login-only scraping.
 * The source and direct application link remain attached to every listing.
 * Cached on Vercel CDN for 6 hours: max ~4 Remotive fetches/day/edge.
 */
const TERMS=/communication|marketing|community|social[\s-]?media|content|brand|event|évén|retail|merchandis|boutique|store\s?manager|sales\s?(?:assistant|associate|advisor|executive)|customer\s?(?:experience|success|service)|partnership|relations publiques|commerce|vente|commerciale?|account manager|digital|e-?commerce|relations presse|influence|crm|employer branding|social content|charg[eé]e|gestionnaire de magasin/i;
const EXCLUDE=/\bengineer(?:ing)?\b|software\s?(?:engineer|developer)|développeur|full[\s-]?stack|backend engineer|data engineer|data scientist|accountant|comptable|security engineer|devops|physician|chirurgien|infirmier|mechanical engineer/i;
const SOURCES=[
  {name:'Remotive',id:'remotive',url:'https://remotive.com/api/remote-jobs?category=marketing&limit=200',type:'remotive'},
  {name:'Arbeitnow',id:'arbeitnow-1',url:'https://www.arbeitnow.com/api/job-board-api',type:'arbeitnow'},
  {name:'Arbeitnow',id:'arbeitnow-2',url:'https://www.arbeitnow.com/api/job-board-api?page=2',type:'arbeitnow'},
  {name:'Jobicy',id:'jobicy',url:'https://jobicy.com/api/jobs?count=100&geo=europe&industry=marketing',type:'jobicy'},
  {name:'Himalayas',id:'himalayas-fr',url:'https://himalayas.app/jobs/api/search?q=marketing&country=FR&sort=recent',type:'himalayas'},
  {name:'Himalayas',id:'himalayas-be',url:'https://himalayas.app/jobs/api/search?q=marketing&country=BE&sort=recent',type:'himalayas'},
  {name:'Himalayas',id:'himalayas-community',url:'https://himalayas.app/jobs/api/search?q=social%20media&sort=recent',type:'himalayas'}
];
const MAX_JOB_AGE_DAYS=100;
function clean(v,max=3000){
 return String(v??'').replace(/<(?:script|style)[^>]*>[\s\S]*?<\/(?:script|style)>/gi,' ')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;|&#xA0;/gi,' ')
  .replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>')
  .replace(/&#39;|&apos;/gi,"'").replace(/\s+/g,' ').trim().slice(0,max);
}
function goodURL(value){
 try {const u=new URL(String(value??''));return u.protocol==='https:'?u.href:null}catch{return null}
}
function dateVal(value){
 try {
  if(typeof value==='number'){
   const ms=value>1e12?value:value*1000;
   return Number.isFinite(ms)?new Date(ms).toISOString():null;
  }
  return value&&Number.isFinite(Date.parse(value))?new Date(value).toISOString():null;
 }catch{return null}
}
function restrictions(value){
 if(!Array.isArray(value))return[];
 return [...new Set(value.map(v=>clean(typeof v==='string'?v:(v?.code||v?.name||v?.country||''),65)).filter(Boolean))].slice(0,25);
}
function relevantTitle(title){
 return TERMS.test(title)&&!EXCLUDE.test(title);
}
function normalize(name,v){
 if(!v||typeof v!=='object')return null;
 const title=clean(v.title??v.jobTitle,165);
 if(!title||!relevantTitle(title))return null;
 const company=clean(v.company_name??v.companyName??v.company,135)||'Entreprise non précisée';
 const rawDate=v.publication_date??v.pubDate??v.date??v.created_at??v.first_published??null;
 const date=dateVal(rawDate);
 const expiryDate=dateVal(v.expiryDate);
 if(expiryDate&&Date.parse(expiryDate)<Date.now())return null;
 if(date&&Date.now()-Date.parse(date)>MAX_JOB_AGE_DAYS*86400000)return null;
 const isHimalayas=name==='Himalayas';
 const sourceUrl=isHimalayas?goodURL(v.guid)||goodURL('https://himalayas.app'+(String(v.guid||'').startsWith('/')?v.guid:'/jobs')):goodURL(v.url);
 const applyUrl=isHimalayas?goodURL(v.applicationLink):goodURL(v.url);
 const url=sourceUrl||applyUrl;
 if(!url)return null;
 const remote=name!=='Arbeitnow'||Boolean(v.remote);
 const locations=restrictions(v.locationRestrictions);
 const location=clean(v.candidate_required_location??v.jobGeo??v.location??(locations.length?locations.join(', '):(remote?'Télétravail':'Localisation à vérifier')),130);
 const desc=clean(v.description??v.jobDescription??v.jobExcerpt??v.excerpt,5000);
 const arr=Array.isArray(v.jobType)?v.jobType:Array.isArray(v.employmentType)?v.employmentType:[v.employmentType??v.jobType??''];
 const employmentType=clean(arr.filter(Boolean).join(', '),80);
 const seniority=clean(Array.isArray(v.seniority)?v.seniority.join(', '):v.seniority,65);
 const salary=(Number.isFinite(Number(v.minSalary))&&Number(v.minSalary)>0)|| (Number.isFinite(Number(v.maxSalary))&&Number(v.maxSalary)>0)
  ?{min:Number(v.minSalary)||null,max:Number(v.maxSalary)||null,currency:clean(v.currency||'EUR',5),period:clean(v.salaryPeriod||'annual',18)}
  :null;
 return {
  id:name.toLowerCase().replace(/\s+/g,'-')+'-'+clean(v.id??v.slug??v.jobSlug??v.guid??url,180),
  title,company,location,description:desc,url,sourceUrl:url,
  applyUrl:applyUrl||url,source:name,date,expiryDate,remote,
  employmentType,seniority,locationRestrictions:locations,salary
 };
}
async function fetchSource(src){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5800);
 try{
  const resp=await fetch(src.url,{headers:{Accept:'application/json','User-Agent':'GlwadysCareerStudio/2.0 (public employment listings)'},signal:controller.signal});
  if(!resp.ok)throw Error('HTTP '+resp.status);
  const payload=await resp.json();
  const rows=src.type==='arbeitnow'?payload?.data:payload?.jobs;
  if(!Array.isArray(rows))throw Error('Format API non conforme');
  return {name:src.name,id:src.id,items:rows.map(v=>normalize(src.name,v)).filter(Boolean)};
 }finally{clearTimeout(timer)}
}
function keyFor(job){
 const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
 return [slug(job.company),slug(job.title),slug(job.location)].join(':');
}
function moreUseful(oldItem,newItem){
 if(!oldItem)return newItem;
 // Prefer better descriptions and visible country restrictions over source-order.
 const score=x=>(x.description?.length||0)+(x.locationRestrictions?.length?500:0)+(x.salary?250:0)+(x.date?100:0);
 return score(newItem)>score(oldItem)?newItem:oldItem;
}
export default async function handler(req,res){
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'GET uniquement'})}
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','public, s-maxage=21600, stale-while-revalidate=3600');
 res.setHeader('X-Content-Type-Options','nosniff');
 const settled=await Promise.allSettled(SOURCES.map(fetchSource));
 const merged=new Map(),reports=[],errors=[];
 for(let i=0;i<SOURCES.length;i++){
  const src=SOURCES[i],out=settled[i];
  if(out.status!=='fulfilled'){
   reports.push({source:src.name,partition:src.id,status:'error',count:0});
   errors.push(src.name+': disponibilité limitée');continue
  }
  reports.push({source:src.name,partition:src.id,status:'ok',count:out.value.items.length});
  for(const item of out.value.items){
   const key=keyFor(item);
   merged.set(key,moreUseful(merged.get(key),item));
  }
 }
 const jobs=[...merged.values()].sort((a,b)=>Date.parse(b.date||0)-Date.parse(a.date||0)).slice(0,450);
 const active=[...new Set(reports.filter(x=>x.status==='ok').map(x=>x.source))];
 if(!active.length)return res.status(503).json({
  generated_at:new Date().toISOString(),sources:[],source_errors:errors,source_report:reports,jobs:[],notice:'Sources publiques temporairement indisponibles. Réessaie ultérieurement.'
 });
 return res.status(200).json({
  generated_at:new Date().toISOString(),sources:active,source_errors:errors,source_report:reports,
  jobs,coverage:'Catalogues publics marketing, retail, communication (pas une collecte exhaustive des plateformes privées).',
  notice:'Annonces issues d’API autorisées. Attribution conservée ; offres et restrictions à revérifier auprès de l’employeur. Remotive est décalé de 24 h et Himalayas actualisé quotidiennement.'
 });
}