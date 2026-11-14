(function(){
'use strict';
const $=id=>document.getElementById('coach294'+id);
const key='coach294_data_v1';
let selectedPlayerId='',statsScope='match';
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
let data;
try{data=JSON.parse(localStorage.getItem(key))}catch(e){}
if(!data||!Array.isArray(data.matches)||!Array.isArray(data.players)||!Array.isArray(data.events))data={version:294,matches:[],players:[],events:[],current:null,seasons:[],currentSeason:null};
if(!Array.isArray(data.seasons))data.seasons=[];
if(!data.seasons.length){data.seasons.push({id:'season-default',name:'Säsong 2026/27'});data.currentSeason='season-default'}
if(!data.currentSeason||!data.seasons.some(s=>s.id===data.currentSeason))data.currentSeason=data.seasons[0].id;
data.matches.forEach(m=>{if(!m.seasonId)m.seasonId=data.currentSeason;if(!Array.isArray(m.roster))m.roster=data.players.map(p=>p.id);if(![1,2,3,4].includes(m.period))m.period=1});
let persisted=JSON.stringify(data);
function save(){try{const next=JSON.stringify(data);localStorage.setItem(key,next);persisted=next;return true;}catch(err){data=JSON.parse(persisted);alert('Kunde inte spara statistiken på denna enhet. Exportera en säkerhetskopia och kontrollera ledigt lagringsutrymme.');return false;}}
function text(s){return String(s==null?'':s)}
function opt(el,value,label){const o=document.createElement('option');o.value=value;o.textContent=label;el.append(o)}
function current(){return data.matches.find(m=>m.id===data.current&&m.seasonId===data.currentSeason)}
function playerName(id){return data.players.find(p=>p.id===id)?.name||'Okänd spelare'}
function penaltyDescription(e){return Number(e.penaltyMinutes)===10?'10 min personligt straff + 2 min lagutvisning':e.penaltyMinutes+' min lagutvisning'}
function addPenalty(m,player,minutes){if(!m||!m.roster.includes(player))return alert('Välj en spelare i aktuell match');if(![2,5,10].includes(minutes))return alert('Välj 2, 5 eller 10 minuter');data.events.push({id:uid(),type:'penalty',matchId:m.id,period:Number($('period').value),penaltyPlayer:player,penaltyMinutes:minutes,penaltyType:minutes===10?'personal':'team',teamPenaltyMinutes:minutes===10?2:minutes,time:new Date().toISOString()});save();render()}
function selectPenaltyMinutes(){const choice=prompt('Välj utvisning: 2 min lagutvisning, 5 min lagutvisning eller 10 min personligt straff (+ 2 min lagutvisning). Skriv 2, 5 eller 10.',String($('penaltyminutes').value||2));if(choice===null)return null;const n=Number(choice.trim());if(![2,5,10].includes(n)){alert('Välj 2, 5 eller 10 minuter');return null}return n}
function changeMatch(id){if(data.current!==id&&current()&&data.events.some(e=>e.matchId===data.current)&&!confirm('Byta match? Kontrollera att mål, assist och utvisningar är registrerade på rätt match.'))return false;data.current=id;statsScope='match';save();render();return true}
function renderSeasonSummary(){const matches=data.matches.filter(m=>m.seasonId===data.currentSeason),ids=new Set(matches.map(m=>m.id)),events=data.events.filter(e=>ids.has(e.matchId));const goals=matches.reduce((n,m)=>n+(m.resultFor??events.filter(e=>e.matchId===m.id&&e.type==='goal').length),0),assists=events.filter(e=>e.type==='assist'||e.type==='goal'&&e.assist).length,minutes=events.filter(e=>e.type==='penalty').reduce((n,e)=>n+Number(e.penaltyMinutes||0),0),against=matches.reduce((n,m)=>n+(m.resultAgainst??0),0),missing=matches.filter(m=>m.resultAgainst==null).length;
const box=$('seasonSummary');box.replaceChildren();const title=document.createElement('h3');title.textContent='Hela laget · '+(data.seasons.find(s=>s.id===data.currentSeason)?.name||'Vald säsong');box.append(title);const cards=document.createElement('div');cards.className='c315-totals';for(const [label,value] of [['Gjorda mål',goals],['Assist',assists],['Spelarpoäng',events.filter(e=>e.type==='goal').length+assists],['Utv min',minutes],['Insläppta mål',against]]){const card=document.createElement('div'),strong=document.createElement('strong'),caption=document.createElement('span');strong.textContent=value;caption.textContent=label;card.append(strong,caption);cards.append(card)}box.append(cards);const note=document.createElement('p');note.className='muted';note.textContent=matches.length+' matcher i säsongen.'+(missing?' Insläppta mål saknas för '+missing+' matcher. Totalsiffran är ofullständig.':' Alla matchers insläppta mål är ifyllda.')+' Gjorda mål följer matchresultaten; spelarnas poäng följer registrerade mål och assist.';box.append(note);}
function renderResult(){const m=current(),goals=m?data.events.filter(e=>e.matchId===m.id&&e.type==='goal').length:0;$('resulttitle').textContent=m?m.name:'Välj en match';$('scorefor').value=m?m.resultFor??goals:'';$('scoreagainst').value=m?m.resultAgainst??'':'';for(const id of ['scorefor','scoreagainst','autoscore'])$(id).disabled=!m;$('resultnote').textContent=!m?'':m.resultFor==null?'Eget lags resultat följer registrerade mål. Fyll i motståndarens mål.':'Eget lags resultat är manuellt angivet. Spelarstatistiken visas separat.';}
function scopedEvents(){const ids=new Set(data.matches.filter(m=>statsScope==='all'||(statsScope==='match'?m.id===data.current:m.seasonId===data.currentSeason)).map(m=>m.id));return data.events.filter(e=>ids.has(e.matchId));}
function playerTotals(id,events){const g=events.filter(e=>e.type==='goal'&&e.scorer===id).length,a=events.filter(e=>(e.type==='goal'&&e.assist===id)||(e.type==='assist'&&e.assistOnly===id)).length,pen=events.filter(e=>e.type==='penalty'&&e.penaltyPlayer===id);return {g,a,pc:pen.length,pm:pen.reduce((sum,e)=>sum+Number(e.penaltyMinutes||0),0)};}
function teamTotals(){const events=scopedEvents();return data.players.map(p=>({p,...playerTotals(p.id,events)})).sort((x,y)=>(y.g+y.a)-(x.g+x.a)||y.g-x.g||x.p.name.localeCompare(y.p.name,'sv'));}
function render(){
const seasons=$('seasons');seasons.replaceChildren();data.seasons.forEach(s=>opt(seasons,s.id,s.name));seasons.value=data.currentSeason;
const match=$('matches');match.replaceChildren();const seasonMatches=data.matches.filter(m=>m.seasonId===data.currentSeason);if(!seasonMatches.length)opt(match,'','Ingen match ännu');seasonMatches.forEach(m=>opt(match,m.id,m.name));if(!current()){data.current=seasonMatches[0]?.id||null;save()}match.value=data.current||'';
$('matchname').value=current()?.name||'';
$('period').value=String(current()?.period||1);$('period').disabled=!current();
renderResult();renderSeasonSummary();
$('matchinfo').textContent=current()?'Match-ID: '+current().id:'Skapa en match för att registrera mål, assist och utvisningar.';
const roster=$('roster');roster.replaceChildren();
data.players.forEach(p=>{const row=document.createElement('div');row.className='c294row';const name=document.createElement('span');name.textContent=p.name;name.style.flex='1';const selected=!!current()?.roster.includes(p.id);const toggle=document.createElement('button');toggle.textContent=selected?'✓ I laguppställning':'+ Ta med';toggle.onclick=()=>{const m=current();if(!m)return alert('Skapa en match först');if(selected&&data.events.some(e=>e.matchId===m.id&&(e.scorer===p.id||e.assist===p.id||e.penaltyPlayer===p.id||e.assistOnly===p.id)))return alert('Spelaren har registrerade mål, assist eller utvisningar i denna match och kan inte tas bort från laguppställningen.');m.roster=selected?m.roster.filter(id=>id!==p.id):[...m.roster,p.id];save();render()};row.append(name,toggle);roster.append(row)});
for(const id of ['scorer','assist','penaltyplayer']){const sel=$(id);const v=sel.value;sel.replaceChildren();opt(sel,'',id==='assist'?'Ingen assist':id==='penaltyplayer'?'Välj spelare':'Välj målskytt');data.players.filter(p=>current()?.roster.includes(p.id)).forEach(p=>opt(sel,p.id,p.name));if([...sel.options].some(o=>o.value===v))sel.value=v}
const quick=$('quickstats');quick.replaceChildren();
const selectedPlayers=data.players.filter(p=>current()?.roster.includes(p.id));
if(!selectedPlayers.some(p=>p.id===selectedPlayerId))selectedPlayerId=selectedPlayers[0]?.id||'';
const picker=document.createElement('div');picker.className='c315-players';
selectedPlayers.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='c315-player';b.dataset.playerId=p.id;b.textContent=p.name;b.setAttribute('aria-pressed',String(p.id===selectedPlayerId));b.onclick=()=>{selectedPlayerId=p.id;render()};picker.append(b)});quick.append(picker);
const selected=selectedPlayers.find(p=>p.id===selectedPlayerId);
if(!selected){const hint=document.createElement('p');hint.textContent=current()?'Lägg till spelare under Match och spelartrupp för att börja.':'Skapa en match under Match och spelartrupp för att börja.';quick.append(hint);}
else {
 const card=document.createElement('div');card.className='c315-actions';
 const heading=document.createElement('h3');heading.textContent=selected.name;card.append(heading);
 const totals=playerTotals(selected.id,data.events.filter(e=>e.matchId===current().id));
 const summary=document.createElement('p');summary.textContent=totals.g+' mål · '+totals.a+' assist · '+(totals.g+totals.a)+' poäng · '+totals.pm+' utv min';card.append(summary);
 for(const [label,kind,minutes] of [['+ Mål','goal'],['+ Assist','assist'],['+ 2 min','penalty',2],['+ 5 min','penalty',5],['+ 10 min','penalty',10]]){
  const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.statAction=kind;b.dataset.minutes=minutes||'';
  b.onclick=()=>{const m=current();if(!m||!m.roster.includes(selected.id))return;
   if(kind==='penalty'){addPenalty(m,selected.id,minutes);return;}
   data.events.push({id:uid(),type:kind,matchId:m.id,period:m.period||1,time:new Date().toISOString(),...(kind==='goal'?{scorer:selected.id,assist:''}:{assistOnly:selected.id})});save();render();
  };card.append(b);
 }
 const live=document.createElement('p');live.className='muted';live.setAttribute('role','status');live.textContent='Registreras i '+current().name+' · period '+current().period+'. Feltryck? Ångra händelsen nedan.';card.append(live);quick.append(card);
}
const events=$('events');events.replaceChildren();
const matches=data.events.filter(e=>current()&&e.matchId===current().id).slice().reverse();
matches.forEach(e=>{const row=document.createElement('div');row.className='c294row';const label=document.createElement('span');label.style.flex='1';label.textContent=e.type==='penalty'?'🟨 P'+(e.period||1)+' · '+playerName(e.penaltyPlayer)+' · '+penaltyDescription(e):e.type==='assist'?'🏑 P'+(e.period||1)+' · Assist: '+playerName(e.assistOnly):'🥅 P'+(e.period||1)+' · '+playerName(e.scorer)+(e.assist?' (assist: '+playerName(e.assist)+')':'');const b=document.createElement('button');b.className='danger';b.textContent='Ångra';b.onclick=()=>{if(!confirm('Ångra denna registrerade händelse?'))return;data.events=data.events.filter(x=>x.id!==e.id);save();render()};row.append(label,b);events.append(row)});
if(!matches.length)events.textContent='Inga händelser registrerade i denna match.';
const table=document.createElement('table');table.setAttribute('aria-label','Lagets statistik');
const header=document.createElement('tr');['Spelare','Mål','Assist','Poäng','Utv','Utv min'].forEach(t=>{const th=document.createElement('th');th.scope='col';th.textContent=t;header.append(th)});const head=document.createElement('thead');head.append(header);table.append(head);
const rows=teamTotals(),tbody=document.createElement('tbody');
rows.forEach(x=>{const tr=document.createElement('tr');[x.p.name,x.g,x.a,x.g+x.a,x.pc,x.pm].forEach((t,i)=>{const td=document.createElement('td');td.textContent=t;if(i===0&&current()?.roster.includes(x.p.id)){td.textContent='';const b=document.createElement('button');b.type='button';b.textContent=x.p.name;b.onclick=()=>{selectedPlayerId=x.p.id;render();$('quickstats').scrollIntoView({block:'start',behavior:'smooth'})};td.append(b)}tr.append(td)});tbody.append(tr)});table.append(tbody);
const sums=rows.reduce((a,x)=>({g:a.g+x.g,a:a.a+x.a,pc:a.pc+x.pc,pm:a.pm+x.pm}),{g:0,a:0,pc:0,pm:0});const footer=document.createElement('tfoot'),total=document.createElement('tr');['Hela laget',sums.g,sums.a,sums.g+sums.a,sums.pc,sums.pm].forEach(t=>{const td=document.createElement('td');td.textContent=t;total.append(td)});footer.append(total);table.append(footer);$('stats').replaceChildren(table);
if($('statsscope'))$('statsscope').value=statsScope;
}
$('open').onclick=()=>{$('panel').classList.add('open');render()};
$('close').onclick=()=>$('panel').classList.remove('open');
$('seasons').onchange=e=>{if(data.currentSeason!==e.target.value&&current()&&data.events.some(ev=>ev.matchId===data.current)&&!confirm('Byta säsong och match? Kontrollera att uppgifterna är sparade.')){render();return}data.currentSeason=e.target.value;data.current=null;save();render()};
$('newseason').onclick=()=>{const name=prompt('Namn på säsongen (t.ex. 2027/28)');if(!name?.trim())return;const id=uid();data.seasons.push({id,name:name.trim()});data.currentSeason=id;data.current=null;save();render()};
$('period').onchange=e=>{const m=current(),period=Number(e.target.value);if(m&&[1,2,3,4].includes(period)){m.period=period;save()}};
$('newmatch').onclick=()=>{const name=prompt('Namn på ny match (t.ex. Kumla – Örebro)');if(!name?.trim())return;const id=uid();data.matches.push({id,name:name.trim(),seasonId:data.currentSeason,roster:[],period:1,created:new Date().toISOString()});data.current=id;save();render()};
$('matches').onchange=e=>{if(!changeMatch(e.target.value))render()};
$('matchname').onchange=e=>{const m=current();if(m&&e.target.value.trim()){m.name=e.target.value.trim();save();render()}};
$('addplayer').onclick=()=>{const name=$('player').value.trim();if(!name)return;if(data.players.some(p=>p.name.toLocaleLowerCase('sv')===name.toLocaleLowerCase('sv'))){alert('Spelaren finns redan');return}data.players.push({id:uid(),name});$('player').value='';save();render()};
$('addpenalty').onclick=()=>{if(!current())return alert('Skapa en match först');const penaltyPlayer=$('penaltyplayer').value,penaltyMinutes=Number($('penaltyminutes').value);if(!penaltyPlayer||!current().roster.includes(penaltyPlayer))return alert('Välj en utvisad spelare i laguppställningen');if(![2,5,10].includes(penaltyMinutes))return alert('Välj utvisningstid');addPenalty(current(),penaltyPlayer,penaltyMinutes)};
$('goal').onclick=()=>{if(!current())return alert('Skapa en match först');const scorer=$('scorer').value,assist=$('assist').value;if(!scorer||!current().roster.includes(scorer))return alert('Välj en målskytt i laguppställningen');if(assist&&!current().roster.includes(assist))return alert('Välj en assistspelare i laguppställningen');if(assist===scorer)return alert('Målskytt och assist kan inte vara samma spelare');data.events.push({id:uid(),type:'goal',matchId:data.current,period:Number($('period').value),scorer,assist,time:new Date().toISOString()});save();render()};
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
$('backup').onclick=()=>download('coach294-backup.json',JSON.stringify({format:'coach294',exported:new Date().toISOString(),data},null,2),'application/json');
$('csv').onclick=()=>{const rows=[['Spelare','Mål','Assist','Poäng','Utvisningar','Utvisningsminuter']];const totals=teamTotals();totals.forEach(x=>rows.push([x.p.name,x.g,x.a,x.g+x.a,x.pc,x.pm]));const sum=totals.reduce((a,x)=>a.map((v,i)=>v+[x.g,x.a,x.g+x.a,x.pc,x.pm][i]),[0,0,0,0,0]);rows.push(['Hela laget',...sum]);download('coach-statistik.csv','\ufeff'+rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n'),'text/csv;charset=utf-8')};
for(const [id,field] of [['scorefor','resultFor'],['scoreagainst','resultAgainst']])$(id).onchange=e=>{const m=current();if(!m)return;const raw=e.target.value.trim(),value=Number(raw);if(raw!==''&&(!Number.isInteger(value)||value<0||value>999)){renderResult();return;}m[field]=raw===''?null:value;save();render();};
$('autoscore').onclick=()=>{const m=current();if(m){m.resultFor=null;save();render();}};
$('statsscope').onchange=e=>{statsScope=e.target.value;render()};
$('restore').onchange=async e=>{
 const f=e.target.files[0];if(!f)return;
 try{
  if(f.size>5_000_000)throw Error('Filen är för stor');
  const obj=JSON.parse(await f.text());
  if(obj.format!=='coach294')throw Error('Felaktigt filformat');
  if(!window.coachValidateMatchData)throw Error('Matchkontrollen kunde inte laddas');
  const validated=window.coachValidateMatchData(obj.data);
  if(!confirm('Återställ säkerhetskopian? Nuvarande matchdata i Match+ ersätts.'))return;
  // Write successfully before replacing the in-memory data.
  localStorage.setItem(key,JSON.stringify(validated));
  data=validated;persisted=JSON.stringify(data);render();alert('Säkerhetskopian återställd');
 }catch(err){alert('Kunde inte återställa filen. Befintliga uppgifter behålls: '+err.message)}
 finally{e.target.value=''}
};
render();
})();