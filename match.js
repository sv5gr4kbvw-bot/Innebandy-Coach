(()=>{
const $=id=>document.getElementById(id);
const status=t=>$('matchStatus').textContent=t;
let db,auth,room='',board=null,chat=null,subs=[],remote=false,timer=null,ready=false,uid='',name='',lastSent='',presence=null,participantKey='';
const conf=window.MATCH_FIREBASE_CONFIG;
let owner=false,canEdit=false,editorsRef=null,ownerId='',session=0;
window.matchReadOnly=false;
function applyReadOnly(){window.matchReadOnly=Boolean(room&&!canEdit);document.body.classList.toggle('match-readonly',window.matchReadOnly);const b=document.getElementById('matchReadOnlyNotice');if(b)b.hidden=!window.matchReadOnly;}

function roleStatus(t){const el=$('matchRoleStatus');if(el)el.textContent=t}
function updateRole(){canEdit=owner||Boolean(window.matchEditorApproved);roleStatus(owner?'Du är rumsägare och kan godkänna redigerare.':canEdit?'Du får redigera tavlan.':'Du är åskådare. Be om redigeringsrätt nedan.');applyReadOnly();const el=$('matchRoleActions');if(!el)return;el.replaceChildren();if(!owner&&!canEdit){const b=document.createElement('button');b.textContent='✋ Be om redigeringsrätt';b.onclick=()=>{if(presence)presence.update({requested:true}).then(()=>status('Begäran skickad till rumsägaren')).catch(e=>status(e.message))};el.append(b)}}
async function connect(){
 if(!conf||!conf.apiKey||!conf.databaseURL||!window.firebase)throw Error('Match behöver Firebase-inställningar. Läs INSTALLERA-MATCH.txt.');
 if(!db){firebase.initializeApp(conf);db=firebase.database();auth=firebase.auth();await auth.signInAnonymously();uid=auth.currentUser.uid;}
}
function leave(){
 session++;
 if(timer)clearTimeout(timer);timer=null;
 subs.forEach(f=>f());subs=[];
 if(presence){const old=presence;presence=null;old.onDisconnect().cancel().catch(()=>{});old.remove().catch(()=>{});}
 participantKey='';owner=false;canEdit=false;room='';applyReadOnly();window.matchEditorApproved=false;editorsRef=null;ownerId='';roleStatus('Inte ansluten');const actions=$('matchRoleActions');if(actions)actions.replaceChildren();const list=$('matchParticipants');if(list)list.textContent='Ingen ansluten';
 if(timer)clearTimeout(timer);timer=null;
 room='';board=null;chat=null;ready=false;lastSent='';$('matchInviteCard').hidden=true;
}
const code=v=>{try{if(v.includes('room='))v=new URL(v).searchParams.get('room')}catch{}return /^[a-f0-9]{40}$/.test(v)?v:null};
function messages(data){
 const el=$('matchChat');
 const nearBottom=el.scrollHeight-el.scrollTop-el.clientHeight<65;
 el.replaceChildren();
 const entries=Object.entries(data||{}).sort((a,b)=>(a[1].time||0)-(b[1].time||0)).slice(-60);
 if(!entries.length){const empty=document.createElement('p');empty.textContent='Inga meddelanden ännu. Skriv det första till tränarna.';empty.style.opacity='.7';el.append(empty);}
 entries.forEach(([,m])=>{
 const p=document.createElement('p'),b=document.createElement('b'),meta=document.createElement('small');
 p.style.cssText='margin:6px 0;padding:8px;border-radius:10px;background:'+(m.uid===uid?'rgba(40,150,210,.17)':'rgba(130,130,130,.12)')+';overflow-wrap:anywhere';
 b.textContent=(m.uid===uid?'Du':String(m.name||'Tränare').slice(0,32));
 const time=typeof m.time==='number'?new Date(m.time).toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit'}):'';
 meta.textContent=time?' · '+time:'';
 p.append(b,meta,document.createElement('br'),document.createTextNode(String(m.text||'').slice(0,500)));
 el.append(p);
 });
 if(nearBottom)el.scrollTop=el.scrollHeight;
}
async function enter(id,create){
 await connect();leave();const activeSession=++session;room=id;name=($('matchName').value||'Tränare').trim().slice(0,32);
 const ref=db.ref('rooms/'+id);board=ref.child('board');chat=ref.child('chat');
 if(create){
  await ref.update({createdBy:uid,createdAt:firebase.database.ServerValue.TIMESTAMP,board:JSON.stringify(items)});
 }
 const creator=await ref.child('createdBy').once('value');
 if(!creator.exists()){leave();throw Error('Rummet finns inte eller har stängts')}
 ownerId=creator.val();owner=ownerId===uid;editorsRef=ref.child('editors');
 const onEditors=snap=>{if(activeSession!==session)return;window.matchEditorApproved=Boolean(snap.child(uid).val());updateRole()};
 const editorListener=snap=>{window.matchEditorsCache=snap.val()||{};onEditors(snap);if(owner)ref.child('participants').once('value').then(onParticipants).catch(()=>{})};editorsRef.on('value',editorListener,e=>status('Behörigheter: '+e.message));subs.push(()=>editorsRef.off('value',editorListener));updateRole();
 participantKey=uid;presence=ref.child('participants').child(uid);
 try{await presence.onDisconnect().remove();await presence.set({name,joinedAt:firebase.database.ServerValue.TIMESTAMP});}
 catch(e){status('Närvarolistan kunde inte startas: '+e.message)}
 const participants=ref.child('participants');
 const onParticipants=snap=>{if(activeSession!==session)return;const el=$('matchParticipants');if(!el)return;const data=snap.val()||{};el.replaceChildren();const roleActions=$('matchRoleActions');if(owner&&roleActions)roleActions.replaceChildren();Object.entries(data).forEach(([personId,v])=>{const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:8px;margin:5px 0';const label=document.createElement('span');label.textContent=String(v.name||'Tränare').slice(0,32)+(personId===ownerId?' (ägare)':'')+(v.requested?' · begär redigering':'');row.append(label);if(owner&&personId!==uid){const btn=document.createElement('button');const approved=Boolean(window.matchEditorsCache?.[personId]);btn.textContent=approved?'Ta bort redigering':'Ge redigering';btn.onclick=()=>editorsRef.child(personId).set(approved?null:true).then(()=>{status(approved?'Redigering återkallad':'Redigering godkänd');if(v.requested)ref.child('participants/'+personId+'/requested').remove()}).catch(e=>status(e.message));row.append(btn)}el.append(row)});if(!Object.keys(data).length)el.textContent='Ingen ansluten';};
 participants.on('value',onParticipants,e=>status('Deltagarlista: '+e.message));
 subs.push(()=>participants.off('value',onParticipants));
 const onBoard=snap=>{
  if(activeSession!==session)return;
  if(!snap.exists()){ready=false;return;}
  try{const received=JSON.parse(snap.val());if(!Array.isArray(received)||received.length>3000)return;
  if(window.matchLocalGestureActive&&window.matchLocalGestureActive()){return}const incoming=JSON.stringify(received);if(incoming===JSON.stringify(items)){lastSent=incoming;ready=true;return}remote=true;try{items=received;render()}finally{remote=false}lastSent=incoming;ready=true}catch(e){remote=false;status(e.message)}
 };
 board.on('value',onBoard,e=>status('Synkronisering: '+e.message));
 subs.push(()=>board.off('value',onBoard));
 const onChat=snap=>{if(activeSession===session)messages(snap.val())};
 chat.limitToLast(60).on('value',onChat,e=>status('Chatt: '+e.message));
 subs.push(()=>chat.off('value',onChat));
 status('Ansluten: '+name+' · gemensam tavla. Redigering kräver godkännande.');
 const inviteUrl=new URL(location.href);inviteUrl.searchParams.set('room',id);
 $('matchInviteUrl').value=inviteUrl.href;$('matchInviteCard').hidden=false;
 const url=new URL(location.href);url.searchParams.set('room',id);history.replaceState(null,'',url);
}
window.matchScheduleSync=()=>{
 if(remote||!ready||!board||timer||!canEdit)return;
 timer=setTimeout(()=>{timer=null;if(!remote&&ready&&board&&canEdit){const payload=JSON.stringify(items);if(payload!==lastSent){lastSent=payload;board.set(payload).catch(e=>{lastSent='';status(e.message)})}}},180);
};
$('matchCreate').onclick=async()=>{
 try{const bytes=new Uint8Array(20);crypto.getRandomValues(bytes);
 await enter(Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join(''),true)}catch(e){status(e.message)}
};
$('matchJoin').onclick=async()=>{try{const id=code($('matchCode').value.trim());if(!id)throw Error('Ogiltig rumskod');await enter(id,false)}catch(e){status(e.message)}};
$('matchLeave').onclick=()=>{leave();status('Lämnade Match');const u=new URL(location.href);u.searchParams.delete('room');history.replaceState(null,'',u)};
function inviteLink(){if(!room){status('Starta eller anslut till en gemensam tavla först');return null}const u=new URL(location.href);u.searchParams.set('room',room);return u.href}
$('matchCopy').onclick=async()=>{const url=inviteLink();if(!url)return;try{await navigator.clipboard.writeText(url);status('Inbjudningslänken kopierad')}catch{status('Markera och kopiera länken i rutan nedan');$('matchInviteUrl').focus();$('matchInviteUrl').select()}};
async function shareRoom(){
 const url=inviteLink();if(!url)return;
 try{
  if(navigator.share)await navigator.share({title:'Innebandy Coach PRO – tränarrum',text:'Inbjudan till vårt tränarrum. Öppna länken för att se taktiktavlan och chatta:',url});
  else await copyRoomLink(url);
 }catch(e){if(e.name!=='AbortError')await copyRoomLink(url)}
}
async function copyRoomLink(url){
 try{await navigator.clipboard.writeText(url);status('Tränarlänken kopierad – klistra in i SMS eller meddelande')}
 catch{const field=$('matchInviteUrl');field.value=url;field.focus();field.select();status('Kopiera länken från den markerade rutan')}
}
// Dela direkt från snabbmenyn. Saknas rum skapas ett nytt med aktuell tavla.
let shareStarting=false;
window.matchShareCurrentRoom=()=>{
 if(shareStarting)return true;
 if(room){shareRoom();return true;}
 shareStarting=true;
 status('Skapar ett tränarrum för delning…');
 const bytes=new Uint8Array(20);crypto.getRandomValues(bytes);
 const id=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
 enter(id,true).then(()=>{
  // Efter asynkron rumsskapning kan iOS blockera systemets delningsruta.
  // Visa alltid inbjudningslänken i Matchcenter som säker reservväg.
  $('matchPanel').open=true;
  $('matchInviteCard').hidden=false;
  $('matchInviteUrl').value=inviteLink();
  $('matchShare').scrollIntoView({block:'center',behavior:'smooth'});
  status('Tränarrummet är klart! Tryck Bjud in tränare för att skicka länken.');
 }).catch(e=>{status('Kunde inte skapa tränarrum: '+e.message);$('matchPanel').open=true}).finally(()=>{shareStarting=false});
 return true;
};
$('matchShare').onclick=shareRoom;
let sending=false;
$('matchSend').onclick=async()=>{
 const input=$('matchMessage'),button=$('matchSend'),value=input.value.trim().slice(0,500);
 if(!chat){status('Anslut till Match först');return}
 if(!value||sending)return;
 sending=true;button.disabled=true;button.textContent='Skickar…';
 const target=chat;
 try{
  await target.push({uid,name,text:value,time:firebase.database.ServerValue.TIMESTAMP});
  if(input.value.trim()===value)input.value='';
 }catch(e){status('Meddelandet kunde inte skickas: '+e.message)}
 finally{sending=false;button.disabled=false;button.textContent='Skicka'}
};
$('matchMessage').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('matchSend').click()}});
const invite=new URL(location.href).searchParams.get('room');
if(invite&&code(invite)){$('matchCode').value=invite;$('matchPanel').open=true;status('Inbjudan hittad – ansluter…');enter(invite,false).catch(e=>status('Kunde inte ansluta automatiskt: '+e.message+' · tryck Gå med för att försöka igen'))}
})();