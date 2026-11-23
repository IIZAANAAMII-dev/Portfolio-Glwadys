/* Contract tests for protected, consent-based AI endpoint. No external requests. */
const {readFileSync}=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const src=readFileSync(path.join(__dirname,'../public/job-hub/api/ai.js'),'utf8')
 .replace("import crypto from 'node:crypto';","const crypto=require('node:crypto');")
 .replace('export const config=','const config=')
 .replace('export default async function handler','async function handler');
const env={GLWADYS_AI_ACCESS_CODE:'QA-PASSCODE'};
const urlCalls=[];
const generic={
 analysis:{summary:'Offre fictive en communication.',strengths:['Communication digitale'],gaps:['GA4 inconnu'],risk_flags:[],priority:'Mettre en avant le contenu social media.',interview_questions:['Quelles sont les missions prioritaires ?']},
 cv:{headline:'Communication et événementiel',summary:'Professionnelle du commerce et de la communication, avec expérience en création de contenus et événements.',skills:['Communication digitale','Photoshop','Événementiel'],highlight_indices:[1,0]},
 letter:{greeting:'Madame, Monsieur,',paragraphs:['Je candidate au poste fictif.','Mon expérience au Marseille Girls Club inclut la communication et les événements.','Je serais heureuse de présenter ma motivation.'],closing:'Bien cordialement,'}
};
const fixtureResearch={output:[{type:'message',content:[{text:'Fait factice sur la société TEST. Source : https://example.org',annotations:[{url:'https://example.org',title:'Site test'}]}]}]};
const fixtureText={output:[{type:'message',content:[{text:JSON.stringify(generic)}]}]};
async function pretendFetch(url,init){
 assert.equal(url,'https://ai-gateway.vercel.sh/v1/responses');
 assert.match(init.headers.Authorization,/Bearer QA-OIDC/);
 const request=JSON.parse(init.body);
 urlCalls.push(request);
 const result=request.tools?fixtureResearch:fixtureText;
 return {ok:true,json:async()=>result};
}
const sandbox={require,process:{env},Buffer,Date,URL,AbortController,setTimeout,clearTimeout,fetch:pretendFetch,console};
const handler=vm.runInNewContext(src+'\nhandler',sandbox,{filename:'api/ai.js'});
function res(){
 const r={statusCode:200,headers:{},body:null};
 r.setHeader=function(k,v){this.headers[k]=v;return this};
 r.status=function(code){this.statusCode=code;return this};
 r.json=function(data){this.body=data;return data};
 return r;
}
function req(method,body={}){
 return {method,body,headers:{host:'glwadys-career-studio.vercel.app',origin:'https://glwadys-career-studio.vercel.app','x-vercel-oidc-token':'QA-OIDC','x-forwarded-for':'127.0.0.1'},socket:{}};
}
async function run(){
 let r=res();await handler(req('GET'),r);
 assert.equal(r.statusCode,200);assert.equal(r.body.enabled,true);
 r=res();await handler(req('POST',{code:'wrong'}),r);
 assert.equal(r.statusCode,401);assert.equal(urlCalls.length,0);
 r=res();await handler(req('POST',{code:'QA-PASSCODE',consent:false}),r);
 assert.equal(r.statusCode,400);assert.equal(urlCalls.length,0);
 // Use a different IP than the rejected attempts for rate-check isolation.
 const approved=req('POST',{code:'QA-PASSCODE',consent:true,role:'Chargée de communication',company:'Société de démonstration',ad:'Communication, marketing, contenus, événementiel, relation client et partenariats. Offre fictive de démonstration pour le contrôle qualité du logiciel.',research:true,sourceUrl:'https://example.org/jobs'});
 approved.headers['x-forwarded-for']='127.0.0.2';
 r=res();await handler(approved,r);
 assert.equal(r.statusCode,200,JSON.stringify(r.body));
 assert.equal(r.body.ai,true);
 assert.equal(r.body.employer.verified,true);
 assert.equal(r.body.employer.sources[0].url,'https://example.org/');
 assert.ok(r.body.dossier.cv.skills.includes('Communication digitale'));
 assert.equal(r.body.dossier.cv.skills.includes('Photoshop'),false,'Unverified model skill must be removed');
 assert.equal(urlCalls.length,2,'One sourced company search plus one structured dossier generation');
 assert.ok(urlCalls.every(call=>!JSON.stringify(call).includes('glwadys.dalleau29')));
 assert.ok(urlCalls.every(call=>!JSON.stringify(call).includes('06 21 97')));
 assert.equal(urlCalls[1].text.format.type,'json_schema');
 assert.equal(urlCalls[1].store,false);
 assert.equal(r.headers['Cache-Control'],'no-store, max-age=0');
 console.log('PASS: AI access controls, opt-in research, citations, skill whitelist, JSON schema and privacy');
}
run().catch(e=>{console.error('FAIL:',e.stack||e);process.exitCode=1});
