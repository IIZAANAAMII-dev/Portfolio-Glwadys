/* Accessible, local-only UX enhancements for Glwadys' application atelier. */
(() => {
  'use strict';
  const get = id => document.getElementById(id);
  const draftKey = 'glwadys-atelier-draft-v1';
  const importedKey = 'glwadys-atelier-import-v1';
  const form = get('atelier-form');
  const ad = get('ad');
  const status = get('draft-status');
  if (!form || !ad || !get('cv-preview')) return;
  let lastSaved = '';
  let saveTimer = null;
  function notify(message) {
    if (typeof toast === 'function') toast(message);
    else if (status) status.textContent = message;
  }
  function showCount() {
    const count = ad.value.length;
    const suffix = count < 90 ? ' · colle les missions et les compétences attendues' : ' · analyse locale des mots-clés';
    const counter = get('ad-count');
    if (counter) {
      counter.textContent = count.toLocaleString('fr-FR') + ' caractère' + (count > 1 ? 's' : '') + suffix;
      counter.style.color = count > 17500 ? '#9a394f' : '';
    }
  }
  function setDirty() {
    form.dataset.dirty='true';
    if(status) status.textContent = 'Modifications prêtes à enregistrer';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 850);
  }
  function saveDraft() {
    try {
      const data=JSON.stringify(getState());
      if(data===lastSaved) return;
      localStorage.setItem(draftKey,data);
      lastSaved=data;
      delete form.dataset.dirty;
      if(status) status.textContent = 'Brouillon sauvegardé uniquement sur cet appareil';
    } catch {
      if(status) status.textContent = 'Sauvegarde indisponible : copie les textes avant de quitter';
    }
  }
  function clearDraft() {
    if (!confirm('Effacer les champs du dossier et le brouillon enregistré sur cet appareil ?')) return;
    for(const key of ['company','ad','recipient','fact']) get(key).value = '';
    get('role').value = 'Chargée de communication';
    get('focus').value = 'auto';
    get('tone').value = 'professional';
    try {localStorage.removeItem(draftKey)}catch{}
    lastSaved = '';
    showCount();render();
    if(status) status.textContent = 'Dossier réinitialisé';
    get('company').focus();
    notify('Brouillon effacé');
  }
  function sampleOffer() {
    const existing = get('ad').value.trim();
    if(existing && !confirm('Remplacer l’annonce actuelle par un exemple fictif ?')) return;
    get('role').value = 'Chargée de communication et événementiel';
    get('company').value = 'Entreprise fictive — démonstration';
    get('ad').value = "OFFRE FICTIVE POUR TESTER L’APPLICATION — ne pas envoyer comme candidature.\nNous recherchons une chargée de communication pour accompagner la création de contenus pour les réseaux sociaux, la coordination de projets, l’organisation d’événements et les partenariats. Le poste comporte une dimension expérience client, des échanges en équipe et un suivi de planning éditorial. Une maîtrise de GA4 et de Canva est appréciée.";
    get('focus').value='communication';
    showCount();render();setDirty();notify('Annonce fictive chargée : utilise une vraie offre avant l’envoi.');
    get('ad').focus();
  }
  function importApplication() {
    let imported=null;
    try {
      const raw=sessionStorage.getItem(importedKey);
      if(raw){imported=JSON.parse(raw);sessionStorage.removeItem(importedKey);}
    } catch {}
    const params=new URLSearchParams(location.search);
    const title=(imported?.role || params.get('role') || '').slice(0,120);
    const company=(imported?.company || params.get('company') || '').slice(0,110);
    const description=(imported?.ad || '').slice(0,18000);
    if(!title&&!company&&!description)return;
    if(title)get('role').value=title;
    if(company)get('company').value=company;
    if(description)get('ad').value=description;
    showCount();render();setDirty();
    if(status)status.textContent='Offre importée depuis le Career Studio : relis les informations';
    notify('Offre importée — CV et lettre prêts à adapter.');
  }
  function atsText(){
    render();
    const jobText=JOBS.map(j => j.role+' — '+j.company+'\n'+j.date+'\n'+j.bullets.join('\n')).join('\n\n');
    return [
      'GLWADYS DALLEAU',
      get('cv-subtitle').textContent.trim(),
      'Vannes, France | 06 21 97 12 50 | glwadys.dalleau29@gmail.com',
      'Portfolio : https://glwadys-portfolio.vercel.app/fr',
      '',
      'PROFIL PROFESSIONNEL',
      get('cv-summary').textContent.trim(),
      '',
      'COMPÉTENCES',
      get('cv-skills').textContent.trim(),
      '',
      'EXPÉRIENCES PROFESSIONNELLES',
      jobText,
      '',
      'FORMATION',
      'Bachelor Commerce, Marketing et Négociation — IPAC Bachelor Factory',
      'Certificat Inside LVMH — Creation & Branding, Retail & Customer Experience',
      '',
      'LANGUES',
      'Français : langue maternelle',
      'Anglais : B2'
    ].join('\n');
  }
  async function copyATS(){
    const text=atsText();
    try{await navigator.clipboard.writeText(text);notify('Texte ATS copié, prêt pour un formulaire de candidature.');}
    catch {
      const blob=new Blob([text],{type:'text/plain;charset=utf-8'});
      const u=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=u;a.download='CV-Glwadys-Dalleau-texte-ATS.txt';a.click();
      setTimeout(()=>URL.revokeObjectURL(u),10000);
      notify('Version texte ATS enregistrée.');
    }
  }
  function changePrintATS(ev) {
    document.body.classList.toggle('ats-clean',ev.target.checked);
    if(status)status.textContent=ev.target.checked?'Aperçu ATS : décor simplifié, mêmes expériences':'Aperçu premium : cercles décoratifs à droite';
  }
  function keyboard(e){
    if((e.ctrlKey||e.metaKey) && e.key==='Enter'){
      e.preventDefault();
      if(form.reportValidity()) {
        render();saveDraft();
        get('tab-cv').click();
        get('cv-preview').scrollIntoView({behavior:'smooth',block:'start'});
        notify('CV et lettre adaptés à l’annonce.');
      }
    }
    if(['ArrowLeft','ArrowRight'].includes(e.key) && [get('tab-cv'),get('tab-letter')].includes(document.activeElement)){
      e.preventDefault();
      const id=e.key==='ArrowLeft'?'tab-cv':'tab-letter';
      get(id).click();get(id).focus();
    }
  }
  function modifyPrint(){
    document.title = (document.body.dataset.tab==='letter'?'Lettre':'CV')+' - Glwadys Dalleau - '+(get('company').value.trim()||'Candidature');
  }
  function restoreTitle(){document.title='Atelier de candidature — Glwadys Career Studio';}
  const copyBtn=get('copy-ats');
  if(copyBtn)copyBtn.addEventListener('click',copyATS);
  const toggle=get('ats-clean');
  if(toggle)toggle.addEventListener('change',changePrintATS);
  const clearBtn=get('clear-draft');
  if(clearBtn)clearBtn.addEventListener('click',clearDraft);
  const sampleBtn=get('example-offer');
  if(sampleBtn)sampleBtn.addEventListener('click',sampleOffer);
  const quick=get('save-draft');
  if(quick)quick.addEventListener('click',saveDraft);
  form.addEventListener('input',() => {showCount();setDirty();});
  form.addEventListener('change',setDirty);
  window.addEventListener('keydown',keyboard);
  window.addEventListener('beforeprint',modifyPrint);
  window.addEventListener('afterprint',restoreTitle);
  showCount();
  importApplication();
  if(status && !status.textContent.trim())status.textContent='Dossier prérempli à partir du CV fourni';
})();