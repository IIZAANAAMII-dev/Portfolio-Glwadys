/* Expert IA: explicit opt-in, private access code and separately grounded documents.
   No automatic call when opening the page or clicking a job offer.
   Candidate personal email/phone stay in the browser's final PDFs.
 */
(()=>{
 'use strict';
 const A=window.GlwadysAtelier;
 if(!A)return;
 const $=id=>document.getElementById(id);
 const codeKey='glwadys-atelier-ai-code-session';
 let active=null,activeSignature='',working=false,ready=false;
 const snap=s=>JSON.stringify([s.role,s.company,s.ad,s.focus,s.tone,s.recipient,s.fact]);
 const getActive=s=>active&&snap(s)===activeSignature?active:null;
 window.GlwadysAI={getActive};
 function status(text,isReady=false){const e=$('ai-status');if(e){e.textContent=text;e.dataset.ready=String(isReady)}}
 function note(text){const e=$('ai-feedback');if(e){e.textContent=text;e.hidden=!text}}
 function diagnostic(text){
  const e=$('ai-diagnostic');if(e){e.textContent=text||'';e.hidden=!text}
 }
 function classifyError(code,detail,statusCode){
  const map={
   INVALID_ACCESS_CODE:'Code d’accès refusé : vérifie le code privé du compte Izanami, sans espace supplémentaire.',
   APP_RATE_LIMIT:'Trop d’essais : laisse le délai de sécurité se réinitialiser avant de recommencer.',
   NOT_CONFIGURED:'Vercel ne reconnaît pas la configuration IA du projet gratuit.',
   GATEWAY_MISSING_CREDENTIALS:'Le serveur n’a pas de jeton Vercel valide.',
   GATEWAY_AUTH:'L’accès au modèle IA est refusé par Vercel. Vérifie les permissions du projet.',
   GATEWAY_VERIFICATION_REQUIRED:'Vercel exige un moyen de paiement valide sur Izanami Hobby pour activer les crédits IA gratuits. La vérification doit être effectuée par le propriétaire du compte Vercel.',
   GATEWAY_CREDIT:'Crédit IA indisponible ou budget du projet atteint.',
   GATEWAY_RATE_LIMIT:'Le modèle reçoit trop de demandes ; une nouvelle tentative sera nécessaire.',
   GATEWAY_TIMEOUT:'Le service IA a dépassé le délai. Désactive la recherche entreprise puis réessaie.',
   GATEWAY_REQUEST_REJECTED:'Le fournisseur a refusé certains paramètres IA. Le problème est côté application, pas dans ton CV.',
   OUTPUT_INCOMPLETE:'L’IA n’a pas fini son dossier. Essaie de raccourcir le texte de l’offre.',
   OUTPUT_INVALID_JSON:'La rédaction IA est arrivée dans un format invalide. Réessaie.',
   OUTPUT_VALIDATION:'Le dossier IA n’a pas passé les vérifications de sécurité des affirmations.',
   ORIGIN_BLOCKED:'Le navigateur bloque cet appel. Ouvre directement le Career Studio dans Safari ou Chrome.',
   CONSENT_REQUIRED:'Coche la case d’accord explicite avant de lancer l’analyse.',
   MISSING_DETAILS:'Renseigne le poste, l’entreprise et au moins 45 caractères de l’annonce.'
  };
  if(code==='CLIENT_TIMEOUT')return 'Le navigateur a interrompu l’attente. Essaie depuis Safari, sans recherche web.';
  if(code==='NETWORK_FAILURE')return 'Impossible de joindre le service IA. Vérifie la connexion et ouvre le site dans Safari ou Chrome.';
  return map[code]||detail||(statusCode?'Erreur du service IA (HTTP '+statusCode+').':'La génération n’a pas abouti.');
 }
 function handleFailure(code,detail,traceId,statusCode){
  const label=classifyError(code,detail,statusCode);
  diagnostic('Cause : '+label+(traceId?' · Référence technique '+traceId:''));
  note(label+' Le CV et la lettre classiques restent disponibles.');
  const blocked=code==='GATEWAY_VERIFICATION_REQUIRED';
  status(blocked?'IA suspendue : vérification Vercel':code==='INVALID_ACCESS_CODE'?'IA : code à vérifier':code==='GATEWAY_CREDIT'?'IA : crédit indisponible':'IA : erreur identifiée',false);
  const link=$('ai-account-verification');if(link && blocked)link.hidden=false;
  if(blocked){ready=false;$('ai-go').disabled=true;$('ai-check-access').disabled=true;}
  if(code==='INVALID_ACCESS_CODE'){try{sessionStorage.removeItem(codeKey)}catch{} const f=$('ai-code');if(f){f.value='';f.focus()}}
 }
 const el=(tag,text,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
 function results(data,employer,warnings){
  const root=$('ai-results');root.replaceChildren();
  if(!data)return;
  const analysis=data.analysis||{};
  const facts=el('section',undefined,'ai-result');facts.append(el('h4','Ce qui correspond à Glwadys'));
  facts.append(el('p',analysis.summary||'Analyse disponible.'));
  if(analysis.strengths?.length){const ul=el('ul');for(const item of analysis.strengths)ul.append(el('li',item));facts.append(ul)}
  root.append(facts);
  const missing=el('section',undefined,'ai-result');missing.append(el('h4','Compétences à vérifier / risques'));
  const concerns=[...(analysis.gaps||[]),...(analysis.risk_flags||[])].slice(0,8);
  if(concerns.length){const ul=el('ul');for(const item of concerns)ul.append(el('li',item));missing.append(ul)}else missing.append(el('p','Aucune lacune certaine identifiée par le modèle. Les exigences doivent encore être relues.'));
  root.append(missing);
  const employerNode=el('section',undefined,'ai-result');employerNode.append(el('h4','Recherche de l’entreprise'));
  if(employer?.verified&&employer.sources?.length){
   employerNode.append(el('p',employer.summary||'Informations vérifiables disponibles.'));
   for(const item of employer.sources.slice(0,5)){
    const a=el('a',item.title||item.url);a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';
    employerNode.append(a);
   }
  }else employerNode.append(el('p','Aucun fait externe vérifié : la lettre repose sur l’annonce et le parcours connu.'));
  root.append(employerNode);
  const interview=el('section',undefined,'ai-result');interview.append(el('h4','Préparer l’entretien'));
  if(analysis.interview_questions?.length){const ul=el('ul');for(const item of analysis.interview_questions)ul.append(el('li',item));interview.append(ul)}
  if(analysis.priority)interview.append(el('p','Angle conseillé : '+analysis.priority,'ai-hint'));
  root.append(interview);
  if(warnings?.length){const p=el('p',warnings.join(' '),'ai-hint');root.append(p)}
  const summary=$('ai-edit-summary');
  const letter=$('ai-edit-letter');
  if(summary)summary.value=data.cv?.summary||'';
  if(letter)letter.value=[data.letter?.greeting,...(data.letter?.paragraphs||[]),data.letter?.closing].filter(Boolean).join('\n\n');
  const review=$('ai-review');if(review)review.hidden=false;
 }
 async function getStatus(){
  try{
   const response=await fetch('../api/ai',{cache:'no-store'});
   const data=await response.json();
   ready=!!data.enabled;
   const blocked=!!data.requiresVerification;
   const link=$('ai-account-verification');
   if(link){link.hidden=!blocked;if(blocked && data.verificationUrl)link.href=data.verificationUrl;}
   status(blocked?'Vérification Izanami requise':ready?'IA configurée · test du code disponible':'IA en attente de configuration',ready);
   note(blocked?'Vercel bloque les générations IA tant que le compte Izanami Hobby n’a pas été vérifié avec un moyen de paiement valide. Seul le propriétaire du compte peut effectuer cette action. Le CV et la lettre classiques restent disponibles.':ready?'Le jeton Vercel est reconnu. Commence par « Vérifier mon code » ; ce test ne consomme aucun crédit.':'Le générateur premium local reste disponible. Le responsable du site doit activer l’accès IA.');
   $('ai-go').disabled=!ready;
   $('ai-check-access').disabled=!ready;
   if(blocked)diagnostic('Cause confirmée : customer_verification_required — vérification du compte Izanami requise, pas une erreur du code de Glwadys.');
  }catch{
   status('IA temporairement indisponible');
   $('ai-go').disabled=true;
  }
 }
 async function verifyAccess(){
  if(working)return;
  const value=$('ai-code').value.trim();
  if(!value){handleFailure('INVALID_ACCESS_CODE','',null,null);return}
  const btn=$('ai-check-access');if(btn)btn.disabled=true;
  diagnostic('');
  try{
   const response=await fetch('../api/ai',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({action:'preflight',code:value}),cache:'no-store'
   });
   const result=await response.json().catch(()=>({}));
   if(!response.ok){handleFailure(result.code,result.error,result.requestId,response.status);return}
   if(result.ok&&result.code==='ACCESS_OK'){
    status('Code accepté · IA non encore testée',true);
    note('Le code est correct, mais cela ne teste pas encore le modèle. Tu peux maintenant lancer la génération, sans ou avec recherche entreprise.');
    diagnostic('');
    try{sessionStorage.setItem(codeKey,value)}catch{}
   }else{handleFailure('SERVICE_UNAVAILABLE','Réponse de test inattendue.',null,response.status)}
  }catch(e){handleFailure('NETWORK_FAILURE',String(e.message||''),null,null)}
  finally{if(btn)btn.disabled=false}
 }
 async function generate(){
  if(working||!ready)return;
  const s=A.getState();
  if(!s.role||!s.company||s.ad.length<45){note('Indique le poste, l’entreprise et colle les missions de l’annonce (au moins 45 caractères).');return}
  if(!$('ai-consent').checked){note('Glwadys doit confirmer son accord avant de transmettre les informations professionnelles à l’IA.');return}
  const passcode=$('ai-code').value.trim();
  if(!passcode){note('Renseigne le code d’accès privé, communiqué par le responsable du site.');return}
  const research=$('ai-research').checked;
  diagnostic('');
  working=true;$('ai-go').disabled=true;
  status(research?'IA : recherche et rédaction…':'IA : analyse et rédaction…',true);
  note('Préparation des documents. Ne ferme pas cette page durant la génération.');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),56000);
  try{
   // Send only public professional facts (not phone/email, not the whole CV file).
   const resp=await fetch('../api/ai',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({role:s.role,company:s.company,ad:s.ad,focus:s.focus,tone:s.tone,code:passcode,consent:true,research,sourceUrl:(()=>{try{const x=JSON.parse(sessionStorage.getItem('glwadys-ai-offer-context')||'null');return x?.role===s.role&&x?.company===s.company?x.url:''}catch{return ''}})()}),
    signal:controller.signal,cache:'no-store'
   });
   let data={};try{data=await resp.json()}catch{}
   if(!resp.ok){
    const failure=new Error(data.error||'Service IA indisponible');
    failure.code=data.code||'SERVER_ERROR';
    failure.status=resp.status;
    failure.traceId=data.requestId;
    throw failure;
   }
   if(!data.ai||!data.dossier)throw Error('Le service n’a pas renvoyé un dossier IA complet.');
   active=data.dossier;
   active.id=String(Date.now());
   activeSignature=snap(s);
   try{sessionStorage.setItem(codeKey,passcode)}catch{}
   status('IA : dossier prêt à relire',true);
   note('Accroche, compétences et lettre mises à jour, y compris dans les PDF. Vérifie les faits avant d’envoyer.');
   A.render();
   window.GlwadysPDF?.syncUi?.(document.body.dataset.tab==='letter'?'letter':'cv');
   results(active,data.employer,data.warnings);
   $('ai-results').scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(err){
   const code=err?.name==='AbortError'?'CLIENT_TIMEOUT':err?.code||(err instanceof TypeError?'NETWORK_FAILURE':'SERVER_ERROR');
   handleFailure(code,String(err?.message||'Erreur réseau').slice(0,180),err?.traceId,err?.status);
  }finally{clearTimeout(timer);working=false;$('ai-go').disabled=!ready}
 }
 function invalidate(){
  if(!active)return;
  if(!getActive(A.getState())){
   status('Le dossier IA doit être régénéré',false);
   note('L’annonce ou la candidature a changé. Relance l’IA pour mettre à jour le CV et la lettre ; les modèles locaux restent disponibles.');
   const root=$('ai-results');root.replaceChildren();
   const editor=$('ai-review');if(editor)editor.hidden=true;
   window.GlwadysPDF?.syncUi?.(document.body.dataset.tab==='letter'?'letter':'cv');
  }
 }
 function editDraft(){
  if(!active||!getActive(A.getState()))return;
  const summary=$('ai-edit-summary').value.trim();
  const letter=$('ai-edit-letter').value.trim().split(/\n{2,}/).map(x=>x.trim()).filter(Boolean);
  if(summary.length<30||summary.length>680){note('L’accroche doit contenir entre 30 et 680 caractères.');return}
  if(letter.length<3||letter.join('').length<75){note('La lettre doit comporter une salutation et plusieurs paragraphes de texte.');return}
  active.cv.summary=summary;
  active.letter.greeting=letter[0].slice(0,90);
  active.letter.paragraphs=letter.slice(1,-1).map(x=>x.slice(0,760));
  active.letter.closing=letter.at(-1).slice(0,140);
  active.id=String(Date.now());
  A.render();
  window.GlwadysPDF?.syncUi?.(document.body.dataset.tab==='letter'?'letter':'cv');
  note('Révisions appliquées au CV, à la lettre et aux PDF. Relis les affirmations avant envoi.');
 }
 // Optional use of session-only code; never persist it in localStorage.
 try{const prior=sessionStorage.getItem(codeKey);if(prior)$('ai-code').value=prior}catch{}
 $('ai-go')?.addEventListener('click',generate);
 $('ai-check-access')?.addEventListener('click',verifyAccess);
 $('ai-apply')?.addEventListener('click',editDraft);
 for(const id of ['role','company','ad','focus','tone','recipient','fact']){
  $(id)?.addEventListener('input',invalidate);
  $(id)?.addEventListener('change',invalidate);
 }
 getStatus();
})();