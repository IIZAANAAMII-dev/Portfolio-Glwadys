/* Glwadys Career Studio: guided navigation and one-click job → premium candidature. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const KEY='glwadys-atelier-import-v1';
  const atelierUrl=new URL('atelier/',document.baseURI).href;
  function toastSafe(message){
    if(typeof toast==='function')toast(message);
  }
  function prepare(role,company,ad){
    try {
      sessionStorage.setItem(KEY,JSON.stringify({
        role:String(role||'').slice(0,120),
        company:String(company||'').slice(0,110),
        ad:String(ad||'').slice(0,16000),
        importedAt:new Date().toISOString()
      }));
    }catch {}
    location.assign(atelierUrl);
  }
  document.addEventListener('click',e=>{
    const target=e.target.closest('[data-prepare-job],[data-prepare-app]');
    if(!target)return;
    if(target.hasAttribute('data-prepare-job')){
      const id=target.dataset.prepareJob;
      const job=jobs.find(x=>String(x.id)===id);
      if(!job){toastSafe('Annonce introuvable : actualise les offres.');return;}
      prepare(job.title,job.company,job.description||'');
    }
    if(target.hasAttribute('data-prepare-app')){
      const id=target.dataset.prepareApp;
      const item=applications.find(x=>String(x.id)===id);
      if(!item){toastSafe('Cette candidature ne figure plus dans ton suivi.');return;}
      // A note is not necessarily an excerpt of a job ad: do not present it as one.
      prepare(item.title,item.company,'');
    }
  });
  const more=$('offer-more');
  if(more) more.addEventListener('click',()=>{
    visibleJobs+=24;
    renderJobs();
    more.focus({preventScroll:true});
  });
  // Reset paging each time the user changes a filter. Existing event listeners render first;
  // this is a final render with the correct first-page limit.
  ['offer-query','offer-region','offer-sort','family'].forEach(id=>{
    const el=$(id);if(!el)return;
    el.addEventListener(id.includes('query')?'input':'change',()=>{
      visibleJobs=24;
      renderJobs();
    });
  });
  // Keep external navigation predictable when coming back from the résumé atelier.
  const appNav=document.querySelector('.mobile-studio-cta');
  if(appNav) appNav.setAttribute('title','Créer CV et lettre à partir d’une annonce');
})();
