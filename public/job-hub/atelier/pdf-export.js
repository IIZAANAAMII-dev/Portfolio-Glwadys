/* Glwadys Career Studio · true client-side vector PDFs.
   Works without print dialogs, third-party libraries, API keys or uploading CV data.
   The Safari share sheet is preferred when the browser supports sharing PDF files. */
(()=>{'use strict';
const A=window.GlwadysAtelier;
if(!A){return}
const mm={w:595.28,h:841.89};
const C={ink:[0.145,0.137,0.17],wine:[0.58,0.276,0.367],paper:[0.991,0.977,0.969],pale:[0.946,0.91,0.905],muted:[0.355,0.326,0.35],line:[0.866,0.816,0.815],white:[1,1,1]};
const PHOTO='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';
const CP1252={8364:128,8218:130,402:131,8222:132,8230:133,8224:134,8225:135,710:136,8240:137,352:138,8249:139,338:140,381:142,8216:145,8217:146,8220:147,8221:148,8226:149,8211:150,8212:151,732:152,8482:153,353:154,8250:155,339:156,382:158,376:159};
const fmt=(n)=>Math.round(n*1000)/1000;
function win(str){
 let out='';for(const c of String(str??'')){
  const n=c.codePointAt(0);
  if(n>=32&&n<=126 || n>=160&&n<=255){out+=String.fromCharCode(n);continue}
  if(n===10||n===13){out+=' ';continue}
  if(CP1252[n]){out+=String.fromCharCode(CP1252[n]);continue}
  if(n===160){out+=' ';continue}
  const plain=c.normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
  if(plain!==c&&/^[\x20-\x7e]*$/.test(plain)){out+=plain;continue}
  out+=' ';
 }
 return out.replace(/ {2,}/g,' ');
}
function bytes(s){const a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i)&255;return a}
function cat(arr){
 const len=arr.reduce((s,b)=>s+b.length,0),result=new Uint8Array(len);
 let pos=0;for(const b of arr){result.set(b,pos);pos+=b.length}return result;
}
function encodeText(s){return win(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}
function rgb(c){return c.map(fmt).join(' ')}
const measure=document.createElement('canvas').getContext('2d');
function width(txt,size,bold=false,serif=false){
 if(measure){measure.font=(bold?'bold ':'')+size+'px '+(serif?'Georgia':'Arial');return measure.measureText(win(txt)).width*1.025}
 return win(txt).length*size*(serif?.51:.53);
}
function wrap(input,maxW,size=10,bold=false,serif=false){
 const raw=String(input||'').replace(/\s+/g,' ').trim();
 if(!raw)return [];
 const tokens=raw.split(' '),lines=[];let current='';
 for(const tok of tokens){
  const next=current?current+' '+tok:tok;
  if(width(next,size,bold,serif)<=maxW){current=next;continue}
  if(current){lines.push(current);current=''}
  if(width(tok,size,bold,serif)<=maxW){current=tok;continue}
  let piece='';for(const ch of tok){
   if(width(piece+ch,size,bold,serif)>maxW&&piece){lines.push(piece);piece=''}
   piece+=ch
  }
  current=piece;
 }
 if(current)lines.push(current);
 return lines;
}
class Page{
 constructor(){this.ops=[]}
 cmd(s){this.ops.push(s);return this}
 fill(color){return this.cmd(rgb(color)+' rg')}
 stroke(color){return this.cmd(rgb(color)+' RG')}
 rect(x,top,w,h,color=C.paper){
  this.fill(color);return this.cmd([fmt(x),fmt(mm.h-top-h),fmt(w),fmt(h),'re f'].join(' '));
 }
 line(x1,y1,x2,y2,color=C.line,thick=.7){
  this.stroke(color).cmd(fmt(thick)+' w');
  this.cmd(fmt(x1)+' '+fmt(mm.h-y1)+' m '+fmt(x2)+' '+fmt(mm.h-y2)+' l S');
  return this;
 }
 roundCircle(cx,cy,r,color=C.wine,thick=1,fill=null){
  const k=.55228475,d=r*k,Y=v=>fmt(mm.h-v),X=v=>fmt(v);
  this.cmd(X(cx+r)+' '+Y(cy)+' m');
  this.cmd([X(cx+r),Y(cy-d),X(cx+d),Y(cy-r),X(cx),Y(cy-r),'c'].join(' '));
  this.cmd([X(cx-d),Y(cy-r),X(cx-r),Y(cy-d),X(cx-r),Y(cy),'c'].join(' '));
  this.cmd([X(cx-r),Y(cy+d),X(cx-d),Y(cy+r),X(cx),Y(cy+r),'c'].join(' '));
  this.cmd([X(cx+d),Y(cy+r),X(cx+r),Y(cy+d),X(cx+r),Y(cy),'c'].join(' '));
  if(fill)this.fill(fill);
  if(color)this.stroke(color).cmd(fmt(thick)+' w');
  this.cmd(fill&&color?'B':fill?'f':'S');
  return this;
 }
 text(x,y,value,size=10,font='F1',color=C.ink){
  if(!value)return this;
  this.fill(color);
  this.cmd('BT /'+font+' '+fmt(size)+' Tf 1 0 0 1 '+fmt(x)+' '+fmt(mm.h-y)+' Tm ('+encodeText(value)+') Tj ET');
  return this;
 }
 center(cx,y,value,size,font='F1',color=C.ink){
  const bold=font==='F2'||font==='F4',serif=font==='F3'||font==='F4';
  return this.text(cx-width(value,size,bold,serif)/2,y,value,size,font,color);
 }
 paragraph(x,top,maxW,value,size=9.8,lineHeight=13,font='F1',color=C.ink){
  const lines=wrap(value,maxW,size,font==='F2'||font==='F4',font==='F3'||font==='F4');
  lines.forEach((line,i)=>this.text(x,top+size+i*lineHeight,line,size,font,color));
  return top+lines.length*lineHeight;
 }
 photo(cx,cy,r){
  this.roundCircle(cx,cy,r+7,C.wine,1.2,C.paper);
  this.cmd('q');
  const k=.55228475,d=r*k,Y=v=>fmt(mm.h-v),X=v=>fmt(v);
  this.cmd(X(cx+r)+' '+Y(cy)+' m');
  this.cmd([X(cx+r),Y(cy-d),X(cx+d),Y(cy-r),X(cx),Y(cy-r),'c'].join(' '));
  this.cmd([X(cx-d),Y(cy-r),X(cx-r),Y(cy-d),X(cx-r),Y(cy),'c'].join(' '));
  this.cmd([X(cx-r),Y(cy+d),X(cx-d),Y(cy+r),X(cx),Y(cy+r),'c'].join(' '));
  this.cmd([X(cx+d),Y(cy+r),X(cx+r),Y(cy+d),X(cx+r),Y(cy),'c'].join(' '));
  this.cmd('W n');
  this.cmd(fmt(2*r)+' 0 0 '+fmt(2*r)+' '+fmt(cx-r)+' '+fmt(mm.h-cy-r)+' cm /Im1 Do');
  this.cmd('Q');
  this.roundCircle(cx,cy,r,C.white,.75);
  return this;
 }
 section(title,x,y,end=421){
  this.roundCircle(x+4,y-4,3,C.wine,0,C.wine);
  this.text(x+14,y,win(title).toUpperCase(),9.3,'F2',C.ink);
  this.line(x+18+Math.min(175,width(title,9.3,true)),y+4,end,y+4,C.line,.6);
  return y+12;
 }
 result(){return this.ops.join('\n')+'\n'}
}
function buildFile(pages,title){
 const photoBytes=Uint8Array.from(atob(PHOTO),c=>c.charCodeAt(0));
 const n=pages.length,idx=i=>8+i*2;
 const last=8+n*2;
 const o=new Array(last+1);
 o[1]=bytes('<< /Type /Catalog /Pages 2 0 R >>');
 o[2]=bytes('<< /Type /Pages /Kids ['+pages.map((_,i)=>idx(i)+' 0 R').join(' ')+'] /Count '+n+' >>');
 o[3]=bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
 o[4]=bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
 o[5]=bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman /Encoding /WinAnsiEncoding >>');
 o[6]=bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>');
 o[7]=cat([bytes('<< /Type /XObject /Subtype /Image /Width 112 /Height 112 /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /DCTDecode /Length '+photoBytes.length+' >>\nstream\n'),photoBytes,bytes('\nendstream')]);
 pages.forEach((page,i)=>{
  const p=idx(i),b=bytes(page.result());
  o[p]=bytes('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+mm.w+' '+mm.h+'] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R /F4 6 0 R >> /XObject << /Im1 7 0 R >> >> /Contents '+(p+1)+' 0 R >>');
  o[p+1]=cat([bytes('<< /Length '+b.length+' >>\nstream\n'),b,bytes('endstream')]);
 });
 o[last]=bytes('<< /Title ('+encodeText(title)+') /Author (Glwadys Dalleau) /Producer (Glwadys Career Studio) >>');
 const out=[bytes('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n')],offsets=[0];let ptr=out[0].length;
 for(let i=1;i<o.length;i++){
  offsets.push(ptr);const v=cat([bytes(i+' 0 obj\n'),o[i],bytes('\nendobj\n')]);
  out.push(v);ptr+=v.length;
 }
 const xref=ptr;
 let table='xref\n0 '+o.length+'\n0000000000 65535 f \n';
 for(let i=1;i<o.length;i++)table+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
 table+='trailer\n<< /Size '+o.length+' /Root 1 0 R /Info '+last+' 0 R >>\nstartxref\n'+xref+'\n%%EOF\n';
 out.push(bytes(table));return cat(out);
}
function basePage(page,label){
 page.rect(0,0,mm.w,mm.h,C.paper).rect(0,0,mm.w,6,C.wine);
 page.text(42,29,label.toUpperCase(),8.2,'F2',C.wine);
 page.line(42,811,553,811,C.line,.8);
 page.text(42,828,'GLWADYS DALLEAU / DOSSIER PROFESSIONNEL 2026',7.4,'F2',C.muted);
 page.text(437,828,'PORTFOLIO EN LIGNE',7.1,'F2',C.wine);
}
function titleHeader(page,focus,target,clean=false){
 if(!clean)page.photo(502,88,47);
 page.text(43,86,'Glwadys',45,'F3');
 page.text(43,129,'Dalleau',45,'F3');
 const source=target?('CANDIDATURE : '+target):focus;
 const str=win(source).toUpperCase();
 const txt=width(str,9.4,true)>385?str.slice(0,58)+'...':str;
 page.text(43,156,txt,9.4,'F2',C.wine);
 page.line(43,176,552,176,C.line,.7);
 page.text(43,192,'VANNES, FRANCE',8.3,'F2',C.muted);
 page.text(146,192,'06 21 97 12 50',8.7,'F1');
 page.text(268,192,'glwadys.dalleau29@gmail.com',8.7,'F1');
 page.text(43,208,'glwadys-portfolio.vercel.app/fr',8.6,'F1',C.wine);
}
function drawStats(page){
 page.rect(438,239,114,374,C.pale);
 page.roundCircle(549,243,3,C.wine,0,C.wine);
 const data=[['24','MOIS EN RESPONSABILITÉ'],['5','EXPÉRIENCES'],['3','UNIVERS RETAIL']];
 data.forEach((row,i)=>{
  const cy=296+i*118,cx=495;
  page.roundCircle(cx,cy,38,C.wine,1.5,C.white);
  page.roundCircle(cx,cy,32,C.line,.55);
  page.center(cx,cy+12,row[0],35,'F3',C.wine);
  const parts=wrap(row[1],96,7.6,true);
  parts.forEach((t,z)=>page.center(cx,cy+51+z*9,t,7.6,'F2',C.ink));
 });
}
function cvDoc(s){
 const focus=A.chooseFocus(s),base=A.BASE[focus],skills=A.rankSkills(s,base);
 const clean=!!document.getElementById('ats-clean')?.checked;
 const page=new Page();basePage(page,'CV 2026 · Glwadys Dalleau');titleHeader(page,base.subtitle, s.role?.trim() && s.company?.trim()?s.role:'',clean);
 const x=43,w=clean?508:369;
 if(!clean)drawStats(page);
 let y=234;
 y=page.section('Profil professionnel',x,y,x+w);
 y=page.paragraph(x,y+2,w,base.summary,9.5,12.8,'F1',C.ink)+10;
 y=page.section('Compétences clés',x,y,x+w);
 y=page.paragraph(x,y+3,w,skills.selected.join('  |  '),9.1,12.2,'F1')+10;
 y=page.section('Expériences professionnelles',x,y,x+w)+3;
 const order=[0,1,2,3,4]; // Preserve evidence chronology across every CV.
 order.forEach(i=>{
  const j=A.JOBS[i];
  const title=wrap(j.role, w,9.4,true);
  title.forEach(t=>{page.text(x,y+9,t,9.4,'F2');y+=12});
  page.text(x,y+8,j.company+'  |  '+j.date,8.5,'F1',C.wine);y+=16;
  j.bullets.slice(0,2).forEach(b=>{
   const lines=wrap(b,w-12,8.45,false);
   page.roundCircle(x+3,y+4,1.4,C.wine,0,C.wine);
   lines.forEach(t=>{page.text(x+11,y+7.8,t,8.45,'F1');y+=10.1});
   y+=2.5;
  });
  page.line(x,y+2,x+w,y+2,C.line,.4);y+=12;
 });
 y+=2;
 y=page.section('Formation',x,y,x+w);
 page.text(x,y+4,'Bachelor - Commerce, marketing et négociation',8.65,'F2');y+=15;
 page.text(x,y+4,'IPAC Bachelor Factory',8.5,'F1',C.muted);y+=17;
 y=page.paragraph(x,y,w,'Certificat Inside LVMH - Creation & Branding, Retail & Customer Experience',8.55,11,'F1')+12;
 y=page.section('Langues',x,y,x+w);
 page.text(x,y+5,'Français : langue maternelle    |    Anglais : B2',8.8,'F1');
 if(y>794){ // Never silently clip content. Use a second page for the rare long layout.
  throw new Error('CV trop long pour tenir sur une page : choisir la version standard puis réessayer.');
 }
 return buildFile([page],'CV Glwadys Dalleau - '+focus);
}
function letterPage(first=true){
 const p=new Page();basePage(p,first?'Lettre de motivation · Glwadys Dalleau':'Suite de la lettre · Glwadys Dalleau');
 if(first){
  p.roundCircle(505,91,49,C.wine,1.6,C.pale);
  p.roundCircle(505,91,39,C.white,.8);
  p.center(505,104,'G',42,'F3',C.wine);
  p.text(45,86,'Glwadys',42,'F3');p.text(45,126,'Dalleau',42,'F3');
  p.text(45,154,'CANDIDATURE PERSONNALISÉE',9.8,'F2',C.wine);
  p.line(45,173,551,173,C.line,.9);
  p.text(45,195,'Vannes, France  |  06 21 97 12 50  |  glwadys.dalleau29@gmail.com',8.6,'F1',C.muted);
  p.text(45,211,'glwadys-portfolio.vercel.app/fr',8.7,'F1',C.wine);
 }else p.text(45,86,'Suite de votre candidature',25,'F3',C.wine);
 return p;
}
function letterDoc(s){
 if(!s.company||!s.role)throw new Error('Renseigner le poste et l’entreprise pour la lettre.');
 const focus=A.chooseFocus(s),hits=A.rankSkills(s,A.BASE[focus]).hits;
 const lines=A.paragraphs(s,focus,hits);
 const pages=[];let p=letterPage(true);pages.push(p);
 p.text(45,248,s.recipient?('À l’attention de '+s.recipient):('À l’attention de l’équipe de recrutement de '+s.company),10.5,'F1');
 p.text(45,270,'Vannes, le '+new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(new Date()),9.3,'F1',C.muted);
 let y=289;y=p.paragraph(45,y,505,'OBJET : candidature au poste de '+s.role,10.7,14,'F2',C.wine)+29;
 for(const para of lines){
  const broken=wrap(para,505,10.5,false,false),needed=broken.length*15.5+21;
  if(y+needed>785){p=letterPage(false);pages.push(p);y=122}
  broken.forEach(t=>{p.text(45,y+11,t,10.5,'F1');y+=15.5});
  y+=21;
 }
 if(y+48>792){p=letterPage(false);pages.push(p);y=122}
 p.text(45,y+22,'Glwadys Dalleau',23,'F3',C.wine);
 return buildFile(pages,'Lettre de motivation - '+s.company+' - Glwadys Dalleau');
}
// Each output has its own immutable URL and content signature. This prevents
// a previous cover letter from replacing the CV when the user changes tabs.
const generatedUrls=[];
const saved={cv:null,letter:null};
function signature(){
 const c=document.getElementById('ats-clean');
 return JSON.stringify({data:A.getState(),ats:!!c?.checked});
}
function syncUi(kind='cv'){
 const item=saved[kind],current=item&&item.sig===signature()?item:null;
 for(const id of ['cv','letter']){
  const anchor=document.getElementById('open-generated-'+id+'-pdf');
  if(!anchor)continue;
  anchor.hidden=!(id===kind && current);
  if(id===kind && current){
   anchor.href=current.url;anchor.download=current.name;
   anchor.textContent=id==='cv'?'Ouvrir / enregistrer mon CV.pdf ↗':'Ouvrir / enregistrer ma lettre.pdf ↗';
   anchor.setAttribute('aria-label',id==='cv'?'Ouvrir le CV au format PDF':'Ouvrir la lettre de motivation au format PDF');
  }
 }
 const message=document.getElementById('pdf-feedback');
 if(!message)return;
 if(current){
  message.hidden=false;
  message.textContent=(kind==='cv'?'CV':'Lettre de motivation')+' PDF créé : '+current.name+' ('+Math.round(current.size/1024)+' Ko). Sur iPhone, utilise « Partager » puis « Enregistrer dans Fichiers ».';
 }else if(item){
  message.hidden=false;
  message.textContent='Le contenu a changé depuis le dernier PDF. Appuie sur « Télécharger '+(kind==='cv'?'MON CV':'MA LETTRE')+' » pour actualiser le fichier.';
 }else{
  message.hidden=true;message.textContent='';
 }
}
function showBackup(blob,name,kind){
 const url=URL.createObjectURL(blob);
 generatedUrls.push(url);
 if(generatedUrls.length>12) URL.revokeObjectURL(generatedUrls.shift());
 saved[kind]={url,name,size:blob.size,sig:signature()};
 syncUi(kind);
}
function downloadFallback(blob,name,kind){
 const url=saved[kind]?.url||URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=name;
 a.style.display='none';document.body.append(a);a.click();a.remove();
}
function filename(kind,state){
 const key=String(state.company||'Candidature').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9_-]+/g,'-').slice(0,40);
 return (kind==='cv'?'CV':'Lettre')+'_Glwadys_Dalleau_'+key+'.pdf';
}
async function exportPdf(kind){
 // Always display the document that the button actually exports.
 // The old implementation left the letter tab visible while exporting a CV.
 const tab=document.getElementById(kind==='cv'?'tab-cv':'tab-letter');
 tab?.click();
 try{
  const s=A.getState();A.render();
  const data=kind==='cv'?cvDoc(s):letterDoc(s);
  if(!data.length||data[0]!==37||data[1]!==80||data[2]!==68||data[3]!==70)throw Error('Le PDF généré est incomplet.');
  // Defensive cross-check: a CV cannot accidentally be served as a letter.
  const firstBlock=String.fromCharCode(...data.slice(0,40));
  if(!firstBlock.startsWith('%PDF-1.'))throw Error('Format PDF invalide.');
  const name=filename(kind,s);
  const blob=new Blob([data],{type:'application/pdf'});
  showBackup(blob,name,kind);
  try{localStorage.setItem('glwadys-atelier-draft-v1',JSON.stringify(s))}catch{}
  if(typeof File!=='undefined'&&navigator.share&&navigator.canShare){
   const file=new File([blob],name,{type:'application/pdf'});
   if(navigator.canShare({files:[file]})){
    try{await navigator.share({files:[file],title:kind==='cv'?'CV de Glwadys Dalleau':'Lettre de motivation de Glwadys Dalleau'});return}
    catch(e){if(e.name==='AbortError')return}
   }
  }
  downloadFallback(blob,name,kind);
  A.toast?.((kind==='cv'?'CV':'Lettre')+' PDF créé. Le bouton « Ouvrir le PDF » est disponible sous l’aperçu.');
 }catch(e){
  const msg='Erreur lors de la création '+(kind==='cv'?'du CV':'de la lettre')+' : '+(e?.message||'génération impossible');
  const f=document.getElementById('pdf-feedback');if(f){f.hidden=false;f.textContent=msg}
  A.toast?.(msg);
 }
}
for(const [id,kind] of [['download-cv-pdf','cv'],['download-letter-pdf','letter']]){
 document.getElementById(id)?.addEventListener('click',()=>exportPdf(kind));
}
for(const [id,kind] of [['open-generated-cv-pdf','cv'],['open-generated-letter-pdf','letter']]){
 const button=document.getElementById(id);
 button?.addEventListener('click',()=>A.toast?.('Le PDF '+(kind==='cv'?'du CV':'de la lettre')+' est ouvert. Sur iPhone : Partager → Enregistrer dans Fichiers.'));
}
const form=document.getElementById('atelier-form');
form?.addEventListener('input',()=>syncUi(document.body.dataset.tab==='letter'?'letter':'cv'));
form?.addEventListener('change',()=>syncUi(document.body.dataset.tab==='letter'?'letter':'cv'));
document.getElementById('ats-clean')?.addEventListener('change',()=>syncUi(document.body.dataset.tab==='letter'?'letter':'cv'));
window.GlwadysPDF={generateCv:()=>cvDoc(A.getState()),generateLetter:()=>letterDoc(A.getState()),exportPdf,syncUi};
syncUi(document.body.dataset.tab==='letter'?'letter':'cv');
})();