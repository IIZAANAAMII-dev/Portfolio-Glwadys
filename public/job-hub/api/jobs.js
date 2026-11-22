/* Glwadys Career Studio · allowed public jobs APIs only.
   No scraping of login-only platforms. No secret or candidate data is collected.
   Cached across Vercel edge for six hours (Remotive recommends <= 4 fetches/day).
*/
const TERMS=/communication|marketing|community|social media|content|brand|event|évén|retail|merchandis|boutique|store manager|sales assistant|sales associate|customer experience|partnership|customer success|relations publiques|social content|commerce|vente/i;
const EXCLUDE=/software engineer|developer|data engineer|backend engineer|accountant|product engineer|security engineer/i;
const SOURCES=[
  {name:'Remotive',url:'https://remotive.com/api/remote-jobs?category=marketing&limit=200'},
  {name:'Arbeitnow',url:'https://www.arbeitnow.com/api/job-board-api'},
  {name:'Jobicy',url:'https://jobicy.com/api/jobs?count=100&geo=europe&industry=marketing'}
];
function clean(v,max=2500){
  return String(v??'').replace(/<(?:script|style)[^>]*>[\s\S]*?<\/(?:script|style)>/gi,' ')
    .replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ')
    .replace(/&amp;/gi,'&').replace(/&quot;/gi,'"')
    .replace(/&#39;|&apos;/gi,"'").replace(/\s+/g,' ').trim().slice(0,max);
}
function httpURL(v){
  try{const u=new URL(String(v));return u.protocol==='https:'?u.toString():null}catch{return null}
}
function normalize(source,v){
  const title=clean(v.title??v.jobTitle,150), url=httpURL(v.url);
  if(!title||!url||!TERMS.test(title)||EXCLUDE.test(title))return null;
  const company=clean(v.company_name??v.companyName??v.company,130)||'Entreprise non précisée';
  let rawDate=v.publication_date??v.pubDate??v.date??v.created_at??null;
  let date=null;
  if(typeof rawDate==='number')date=new Date(rawDate*1000).toISOString();
  else if(rawDate && Number.isFinite(Date.parse(rawDate)))date=new Date(rawDate).toISOString();
  return {
    id:source.toLowerCase()+'-'+clean(v.id??v.slug??v.jobSlug??url,180),
    title, company,
    location:clean(v.candidate_required_location??v.jobGeo??v.location??'Télétravail',90),
    description:clean(v.description??v.jobDescription??v.jobExcerpt,3300),
    url,source,date,
    remote:source!=='Arbeitnow'||Boolean(v.remote),
    jobType:Array.isArray(v.jobType)?v.jobType.join(', '):'',
    salary:null
  };
}
async function fetchSource({name,url}){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),6500);
  try{
    const response=await fetch(url,{headers:{Accept:'application/json','User-Agent':'GlwadysCareerStudio/1.2'},signal:controller.signal});
    if(!response.ok)throw Error('HTTP '+response.status);
    const data=await response.json();
    const rows=name==='Arbeitnow'?data.data:data.jobs;
    if(!Array.isArray(rows))throw Error('Format JSON inattendu');
    return {name,jobs:rows.map(row=>normalize(name,row)).filter(Boolean)};
  }finally{clearTimeout(timer)}
}
export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'GET only'})}
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=21600, stale-while-revalidate=3600');
  res.setHeader('X-Content-Type-Options','nosniff');
  const result=await Promise.allSettled(SOURCES.map(fetchSource));
  const seen=new Set(),jobs=[],errors=[],active=[];
  for(let i=0;i<result.length;i++){
    const r=result[i];if(r.status==='rejected'){errors.push(SOURCES[i].name+': source indisponible');continue}
    active.push(r.value.name);
    for(const job of r.value.jobs){
      const key=job.url.split('?')[0];
      if(!seen.has(key)){seen.add(key);jobs.push(job)}
    }
  }
  jobs.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
  return res.status(200).json({
    generated_at:new Date().toISOString(),
    sources:active,source_errors:errors,
    jobs:jobs.slice(0,320),
    notice:'Catalogue d’offres publiques partielles. Remotive impose un délai d’au moins 24 h et une attribution. Les annonces officielles prévalent ; aucune plateforme privée n’est scrapée.',
  });
}
