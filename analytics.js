(() => {
 'use strict';
 const CHOICE='kn_analytics_choice_v1',VISITOR='kn_analytics_visitor_v1',SESSION='kn_analytics_session_v1',EXCLUDE='kn_analytics_owner_excluded';
 const settings=document.currentScript?.dataset||{};
 const base=settings.basePath||'/',apiOrigin=settings.apiOrigin||location.origin;
 const endpoint=name=>new URL('/api/analytics/'+name,apiOrigin).href;
 const credentials=apiOrigin===location.origin?'same-origin':'omit';
 const internal=u=>[location.origin,apiOrigin].includes(u.origin);
 const pending=new Set();
 const DAY=86400000;let pageSent=false,memoryVisitor,memorySession,deleting=false;
 const read=key=>{try{return JSON.parse(localStorage.getItem(key));}catch{return null;}};
 const put=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
 const remove=key=>{try{localStorage.removeItem(key);}catch{}};
 const choice=()=>{const c=read(CHOICE);return c&&Date.now()-c.at<180*DAY?c.value:null;};
 const excluded=()=>read(EXCLUDE)===true;
 const path=()=>{const local=location.pathname.startsWith(base)?'/'+location.pathname.slice(base.length):location.pathname;return local.replace(/\/index\.html$/,'/').replace(/\.html$/,'').replace(/\/$/,'')||'/';};
 const isPublic=()=>!path().startsWith('/admin')&&path()!=='/privacy';
 const referrer=()=>{try{const r=new URL(document.referrer);return /^https?:$/.test(r.protocol)&&!internal(r)?r.origin:'';}catch{return '';}};
 function identity(){
  const now=Date.now();let visitor=read(VISITOR)||memoryVisitor;
  if(!visitor||now-visitor.at>30*DAY){visitor={id:crypto.randomUUID(),at:now};put(VISITOR,visitor);memoryVisitor=visitor;}
  let session=read(SESSION)||memorySession;
  if(!session||now-session.at>30*60000){session={id:crypto.randomUUID(),at:now,referrer:referrer()};}
  session.at=now;put(SESSION,session);memorySession=session;
  return {visitor:visitor.id,session:session.id,referrer:session.referrer};
 }
 function track(kind,value=''){
  if(choice()!=='accepted'||excluded()||deleting||!isPublic()||document.visibilityState==='prerender')return;
  try{
   const payload={id:crypto.randomUUID(),consent:true,kind,path:path(),value,...identity()};
   const body=JSON.stringify(payload);
   const sending=fetch(endpoint('collect'),{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true,credentials}).catch(()=>{});
   pending.add(sending);sending.finally(()=>pending.delete(sending));
  }catch{/* Analytics must never interrupt the directory. */}
 }
 function start(){if(!pageSent&&choice()==='accepted'&&!excluded()&&isPublic()){pageSent=true;track('pageview');if(new URLSearchParams(location.search).get('view')==='map')track('map_view');}}
 function clearIdentity(){remove(VISITOR);remove(SESSION);memoryVisitor=null;memorySession=null;}
 function choose(value){put(CHOICE,{value,at:Date.now()});if(value==='declined'){clearIdentity();pageSent=false;}banner.hidden=true;start();}
 const banner=document.createElement('section');banner.className='analytics-choice';banner.setAttribute('aria-label','Optional site statistics');
 banner.innerHTML='<div><strong>Help us understand what you enjoy.</strong><p>With your permission, we count visits and clicks using a random browser ID. No advertising trackers. <a>How statistics work</a></p></div><div class="analytics-choice-actions"><button type="button" data-analytics-accept>Allow statistics</button><button type="button" data-analytics-decline>No thanks</button></div>';
 banner.querySelector('a').href=base+'privacy.html';
 document.body.append(banner);banner.hidden=choice()!==null||excluded();
 banner.querySelector('[data-analytics-accept]').addEventListener('click',()=>choose('accepted'));
 banner.querySelector('[data-analytics-decline]').addEventListener('click',()=>choose('declined'));
 document.querySelectorAll('[data-analytics-settings]').forEach(button=>button.addEventListener('click',()=>{banner.hidden=false;banner.querySelector('button').focus();}));
 document.querySelectorAll('[data-analytics-forget]').forEach(button=>button.addEventListener('click',async()=>{
  button.disabled=true;deleting=true;const visitor=read(VISITOR)||memoryVisitor;
  put(CHOICE,{value:'declined',at:Date.now()});banner.hidden=true;
  try{await Promise.allSettled([...pending]);if(visitor){const r=await fetch(endpoint('forget'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitor:visitor.id}),credentials});if(!r.ok)throw new Error('Please try again.');}
   choose('declined');document.querySelector('[data-analytics-status]').textContent='Statistics are off. Records associated with this browser ID have been removed.';
  }catch{document.querySelector('[data-analytics-status]').textContent='Statistics are off, but we could not remove the records. Keep this browser’s data and try again.';}finally{button.disabled=false;deleting=false;}
 }));
 const exclusion=document.querySelector('[data-analytics-exclude]');
 if(exclusion){exclusion.checked=excluded();exclusion.addEventListener('change',()=>{put(EXCLUDE,exclusion.checked);pageSent=false;banner.hidden=choice()!==null||excluded();document.querySelector('[data-analytics-exclude-status]').textContent=excluded()?'Visits from this browser on this address are excluded.':'Exclusion is off. Your statistics preference still applies.';start();});}
 document.querySelectorAll('[data-analytics-owner]').forEach(link=>link.addEventListener('click',()=>put(EXCLUDE,true)));
 document.addEventListener('click',event=>{
  const target=event.target.closest('button,a');if(!target)return;
  if(['map-view','platform-map-view'].includes(target.id)||target.hasAttribute('data-focus-place'))track('map_view');
  if(target.hasAttribute('data-category'))track('category',target.dataset.category);
  if(target.hasAttribute('data-interest'))track('category',target.dataset.interest||'all');
  if(target.hasAttribute('data-details'))track('listing',target.dataset.details);
  if(target.tagName==='A'){try{const u=new URL(target.href);if(/^https?:$/.test(u.protocol)&&!internal(u))track('outbound',u.origin);}catch{}}
 },true);
 document.querySelector('#platform-category')?.addEventListener('change',e=>track('category',e.target.value||'all'));
 window.addEventListener('storage',event=>{if([CHOICE,EXCLUDE].includes(event.key)){banner.hidden=choice()!==null||excluded();start();}});
 window.addEventListener('pageshow',event=>{if(event.persisted){pageSent=false;start();}});
 window.KoreaAnalytics={track};start();
})();
