/* Persistent exercise boards and one playback control for the existing engines. */
(()=>{
 const KEY='coach-exercise-plans-v1',MAX=8;
 const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
 function validateItems(items){
  if(!Array.isArray(items)||items.length>3000)throw Error('Ogiltiga objekt på tavlan');
  for(const o of items){if(!record(o)||!['playerA','playerB','goalieA','goalieB','ball','cone','goal','draw','arrow'].includes(o.type))throw Error('Ogiltigt planobjekt');
   if(o.name!==undefined&&typeof o.name!=='string')throw Error('Ogiltigt spelarnamn');
   if(o.type==='draw'||o.type==='arrow'){if(!Array.isArray(o.points)||o.points.length>20000||!o.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)))throw Error('Ogiltig ritning');}
   else if(!Number.isFinite(o.x)||!Number.isFinite(o.y))throw Error('Ogiltig spelarposition');
  }
 }
 function validateState(s){
  if(!record(s)||!['vertical','horizontal'].includes(s.orientation))throw Error('Ogiltig övningstavla');validateItems(s.items);
  for(const key of ['frames','timeline']){if(s[key]!==undefined){if(!Array.isArray(s[key])||s[key].length>150)throw Error('För många animationssteg');s[key].forEach(validateItems);}}
  for(const key of ['smartFrames','customFrames']){if(s[key]!==undefined){if(!Array.isArray(s[key])||s[key].length>150)throw Error('För många animationssteg');s[key].forEach(f=>{if(!record(f))throw Error('Ogiltigt animationssteg');validateItems(f.items);});}}
  return JSON.parse(JSON.stringify(s));
 }
 function validatePlans(value){
  if(!record(value)||value.version!==1||!Array.isArray(value.plans)||!value.plans.length||value.plans.length>MAX)throw Error('Ogiltiga övningstavlor');
  const ids=new Set();for(const p of value.plans){if(!record(p)||typeof p.id!=='string'||!p.id||ids.has(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>80)throw Error('Ogiltigt namn eller ID för tavlan');ids.add(p.id);if(p.state!==null)validateState(p.state);}
  if(!ids.has(value.active))throw Error('Vald övningstavla saknas');return JSON.parse(JSON.stringify(value));
 }
 window.coachValidatePlans=validatePlans;window.coachValidatePlanState=validateState;
 const init=()=>{
  const api=window.coachPlanBoard;if(!api)return;
  let data={version:1,active:'plan-1',plans:[1,2,3].map(n=>({id:'plan-'+n,name:'Övning '+n,state:null}))},timer=null,switching=false,locked=false;
  let initialError='';try{const raw=localStorage.getItem(KEY);if(raw)data=validatePlans(JSON.parse(raw));}catch{locked=true;initialError='Sparade tavlor kunde inte läsas. Befintliga uppgifter behålls. Ta en säkerhetskopia innan du återställer dem.';}
  const bar=document.createElement('nav');bar.id='coachPlanBar';bar.setAttribute('aria-label','Övningstavlor');
  bar.innerHTML='<div class="coach-plan-strip"><span id="coachPlanName"></span><div id="coachPlanTabs" role="tablist" aria-label="Välj övningstavla"></div></div><button type="button" id="coachPlanPlay">▶ Spela</button><button type="button" id="coachPlanNext">Nästa ›</button><p id="coachPlanMessage" role="status" aria-live="polite" hidden></p>';
  document.body.append(bar);const tabs=document.getElementById('coachPlanTabs'),play=document.getElementById('coachPlanPlay'),next=document.getElementById('coachPlanNext'),message=document.getElementById('coachPlanMessage');
  const current=()=>data.plans.find(p=>p.id===data.active);
  const notice=text=>{message.textContent=text;message.hidden=!text;};
  function refresh(){
   const state=api.playback(),readonly=!!window.matchReadOnly;const label=state.active?'⏸ Pausa':'▶ Spela';if(play.textContent!==label)play.textContent=label;
   play.disabled=!state.available||readonly;play.title=state.available?'Spela eller pausa '+current().name:'Den här tavlan har ingen animation ännu';play.setAttribute('aria-label',state.active?'Pausa animationen':'Spela animationen för '+current().name);play.setAttribute('aria-pressed',String(state.active));next.disabled=readonly||data.plans.findIndex(p=>p.id===data.active)===data.plans.length-1;
   document.getElementById('coachPlanName').textContent=current().name;
  }
  function renderTabs(){tabs.replaceChildren();data.plans.forEach((p,i)=>{const b=document.createElement('button');b.type='button';b.className='coach-plan-tab';b.dataset.planId=p.id;b.setAttribute('role','tab');b.setAttribute('aria-selected',String(p.id===data.active));b.setAttribute('aria-controls','board');b.setAttribute('aria-label',(i+1)+'. '+p.name);b.title=p.name;const number=document.createElement('span');number.textContent=String(i+1);const name=document.createElement('span');name.className='coach-plan-tab-name';name.textContent=p.name;b.append(number,name);b.onclick=()=>select(p.id);tabs.append(b);});const add=document.createElement('button');add.type='button';add.id='coachPlanAdd';add.textContent='＋';add.setAttribute('aria-label','Ny övningstavla');add.disabled=data.plans.length>=MAX;add.onclick=addPlan;tabs.append(add);refresh();}
  function persist(capture=true){
   if(locked)return false;
   if(capture){if(!api.capturable())return false;current().state=api.capture();}
   try{localStorage.setItem(KEY,JSON.stringify(data));notice('');return true;}catch{notice('Kunde inte spara tavlorna. Exportera en säkerhetskopia och frigör lagringsutrymme.');return false;}
  }
  function select(id){
   if(id===data.active)return true;
   if(window.matchReadOnly){notice('Lämna det delade visningsläget eller be om redigeringsrätt för att byta övningstavla.');return false;}
   switching=true;clearTimeout(timer);if(!api.settle()){switching=false;return false;}current().state=api.capture();
   if(!persist(false)&&!locked){switching=false;return false;}
   const old=data.active;data.active=id;
   if(!persist(false)&&!locked){data.active=old;switching=false;return false;}
   const p=current();api.restore(p.state||{items:[],orientation:'vertical',frames:[],smartFrames:[],customFrames:[],timeline:[]});switching=false;renderTabs();
   document.querySelector('#coach212Shade.open .c212-close')?.click();
   if(document.body.classList.contains('coach-page'))document.getElementById('board')?.scrollIntoView({block:'center'});
   document.dispatchEvent(new Event('coach-plans-layout'));return true;
  }
  function addPlan(){if(window.matchReadOnly||data.plans.length>=MAX)return false;const id='plan-'+Date.now().toString(36)+'-'+data.plans.length;data.plans.push({id,name:'Övning '+(data.plans.length+1),state:null});if(!select(id)){data.plans=data.plans.filter(p=>p.id!==id);renderTabs();return false;}return true;}
  window.coachAddPlan=addPlan;
  window.coachRenamePlan=()=>{const p=current(),name=prompt('Namn på övningstavlan',p.name);if(!name?.trim())return;const old=p.name;p.name=name.trim().slice(0,80);if(!persist()&&!locked)p.name=old;renderTabs();};
  window.coachPlansChanged=()=>{if(switching)return;refresh();if(api.busy())return;clearTimeout(timer);timer=setTimeout(()=>persist(),250);};
  document.addEventListener('coach-exercise-opened',e=>{if(e.detail?.name)current().name=String(e.detail.name).slice(0,80);renderTabs();window.coachPlansChanged();});
  play.onclick=()=>{if(!api.busy())persist();api.toggle();refresh();};next.onclick=()=>{const i=data.plans.findIndex(p=>p.id===data.active);if(i<data.plans.length-1)select(data.plans[i+1].id);};
  window.coachExportPlans=()=>{if(locked)return null;if(api.capturable())current().state=api.capture();return JSON.parse(JSON.stringify(data));};
  window.addEventListener('pagehide',()=>{if(!switching&&api.capturable())persist();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&api.capturable())persist();});
  for(const id of ['frameCount','customStatus','smartStepInfo']){const el=document.getElementById(id);if(el)new MutationObserver(()=>window.coachPlansChanged()).observe(el,{childList:true,subtree:true,characterData:true});}
  new MutationObserver(refresh).observe(document.body,{attributes:true,attributeFilter:['class']});
  if(window.ResizeObserver)new ResizeObserver(()=>document.dispatchEvent(new Event('coach-plans-layout'))).observe(bar);
  switching=true;if(current().state)api.restore(current().state);else current().state=api.capture();switching=false;renderTabs();if(initialError)notice(initialError);else persist();document.dispatchEvent(new Event('coach-plans-layout'));
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
