(function(){
'use strict';
const $=id=>document.getElementById('coach294'+id);
const key='coach294_data_v1';
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
let data;
try{data=JSON.parse(localStorage.getItem(key))}catch(e){}
if(!data||!Array.isArray(data.matches)||!Array.isArray(data.players)||!Array.isArray(data.events))data={version:294,matches:[],players:[],events:[],current:null,seasons:[],currentSeason:null};
if(!Array.isArray(data.seasons))data.seasons=[];
if(!data.seasons.length){data.seasons.push({id:'season-default',name:'Säsong 2026/27'});data.currentSeason='season-default'}
if(!data.currentSeason||!data.seasons.some(s=>s.id===data.currentSeason))data.currentSeason=data.seasons[0].id;
data.matches.forEach(m=>{if(!m.seasonId)m.seasonId=data.currentSeason;if(!Array.isArray(m.roster))m.roster=data.players.map(p=>p.id)});
function save(){try{localStorage.setItem(key,JSON.stringify(data))}catch(err){alert('Kunde inte spara statistiken på denna enhet. Exportera en säkerhetskopia och kontrollera ledigt lagringsutrymme.')}}
function text(s){return String(s==null?'':s)}
function opt(el,value,label){const o=document.createElement('option');o.value=value;o.textContent=label;el.append(o)}
function current(){return data.matches.find(m=>m.id===data.current&&m.seasonId===data.currentSeason)}
function playerName(id){return data.players.find(p=>p.id===id)?.name||'Okänd spelare'}
function penaltyDescription(e){return Number(e.penaltyMinutes)===10?'10 min personligt straff + 2 min lagutvisning':e.penaltyMinutes+' min lagutvisning'}
function addPenalty(m,player,minutes){if(!m||!m.roster.includes(player))return alert('Välj en spelare i aktuell match');if(![2,5,10].includes(minutes))return alert('Välj 2, 5 eller 10 minuter');data.events.push({id:uid(),type:'penalty',matchId:m.id,period:Number($('period').value),penaltyPlayer:player,penaltyMinutes:minutes,penaltyType:minutes===10?'personal':'team',teamPenaltyMinutes:minutes===10?2:minutes,time:new Date().toISOString()});save();render()}
function selectPenaltyMinutes(){const choice=prompt('Välj utvisning: 2 min lagutvisning, 5 min lagutvisning eller 10 min personligt straff (+ 2 min lagutvisning). Skriv 2, 5 eller 10.',String($('penaltyminutes').value||2));if(choice===null)return null;const n=Number(choice.trim());if(![2,5,10].includes(n)){alert('Välj 2, 5 eller 10 minuter');return null}return n}
function changeMatch(id){if(data.current!==id&&current()&&data.events.some(e=>e.matchId===data.current)&&!confirm('Byta match? Kontrollera att mål, assist och utvisningar är registrerade på rätt match.'))return false;data.current=id;save();render();return true}
function render(){
const seasons=$('seasons');seasons.replaceChildren();data.seasons.forEach(s=>opt(seasons,s.id,s.name));seasons.value=data.currentSeason;
const match=$('matches');match.replaceChildren();const seasonMatches=data.matches.filter(m=>m.seasonId===data.currentSeason);if(!seasonMatches.length)opt(match,'','Ingen match ännu');seasonMatches.forEach(m=>opt(match,m.id,m.name));if(!current()){data.current=seasonMatches[0]?.id||null;save()}match.value=data.current||'';
$('matchname').value=current()?.name||'';
$('matchinfo').textContent=current()?'Match-ID: '+current().id:'Skapa en match för att registrera mål, assist och utvisningar.';
const roster=$('roster');roster.replaceChildren();
data.players.forEach(p=>{const row=document.createElement('div');row.className='c294row';const name=document.createElement('span');name.textContent=p.name;name.style.flex='1';const selected=!!current()?.roster.includes(p.id);const toggle=document.createElement('button');toggle.textContent=selected?'✓ I laguppställning':'+ Ta med';toggle.onclick=()=>{const m=current();if(!m)return alert('Skapa en match först');if(selected&&data.events.some(e=>e.matchId===m.id&&(e.scorer===p.id||e.assist===p.id||e.penaltyPlayer===p.id||e.assistOnly===p.id)))return alert('Spelaren har registrerade mål, assist eller utvisningar i denna match och kan inte tas bort från laguppställningen.');m.roster=selected?m.roster.filter(id=>id!==p.id):[...m.roster,p.id];save();render()};row.append(name,toggle);roster.append(row)});
for(const id of ['scorer','assist','penaltyplayer']){const sel=$(id);const v=sel.value;sel.replaceChildren();opt(sel,'',id==='assist'?'Ingen assist':id==='penaltyplayer'?'Välj spelare':'Välj målskytt');data.players.filter(p=>current()?.roster.includes(p.id)).forEach(p=>opt(sel,p.id,p.name));if([...sel.options].some(o=>o.value===v))sel.value=v}
const quick=$('quickstats');quick.replaceChildren();
const selectedPlayers=data.players.filter(p=>current()?.roster.includes(p.id));
if(!selectedPlayers.length){const hint=document.createElement('p');hint.className='muted';hint.textContent='Lägg till spelare i laguppställningen ovan för att registrera statistik.';quick.append(hint)}
selectedPlayers.forEach(p=>{
 const row=document.createElement('div');row.className='c294row';row.style.cssText='padding:8px 0;border-bottom:1px solid #40606a';
 const name=document.createElement('strong');name.textContent=p.name;name.style.cssText='flex:1 1 100%;font-size:17px';row.append(name);
 for(const [label,kind] of [['+ Mål','goal'],['+ Assist','assist'],['+ Utvisning','penalty']]){
  const button=document.createElement('button');button.type='button';button.textContent=label;button.style.flex='1 1 90px';
  button.onclick=()=>{
   const m=current();if(!m||!m.roster.includes(p.id))return alert('Välj en match och lägg till spelaren först');
   const base={id:uid(),matchId:m.id,period:Number($('period').value),time:new Date().toISOString()};
   if(kind==='goal'){data.events.push({...base,type:'goal',scorer:p.id,assist:''})}
   else if(kind==='assist'){data.events.push({...base,type:'assist',assistOnly:p.id})}
   else {const minutes=selectPenaltyMinutes();if(minutes===null)return;addPenalty(m,p.id,minutes);return}
   save();render();
  };row.append(button)
 }
 quick.append(row)
});
const events=$('events');events.replaceChildren();
const matches=data.events.filter(e=>current()&&e.matchId===current().id).slice().reverse();
matches.forEach(e=>{const row=document.createElement('div');row.className='c294row';const label=document.createElement('span');label.style.flex='1';label.textContent=e.type==='penalty'?'🟨 P'+(e.period||1)+' · '+playerName(e.penaltyPlayer)+' · '+penaltyDescription(e):e.type==='assist'?'🏑 P'+(e.period||1)+' · Assist: '+playerName(e.assistOnly):'🥅 P'+(e.period||1)+' · '+playerName(e.scorer)+(e.assist?' (assist: '+playerName(e.assist)+')':'');const b=document.createElement('button');b.className='danger';b.textContent='Ångra';b.onclick=()=>{if(!confirm('Ångra denna registrerade händelse?'))return;data.events=data.events.filter(x=>x.id!==e.id);save();render()};row.append(label,b);events.append(row)});
if(!matches.length)events.textContent='Inga händelser registrerade i denna match.';
const table=document.createElement('table');const header=document.createElement('tr');['Spelare','Mål','Assist','Poäng','Utvisningar','Straffminuter'].forEach(t=>{const th=document.createElement('th');th.textContent=t;header.append(th)});table.append(header);
data.players.map(p=>{const ev=data.events.filter(e=>data.matches.some(m=>m.id===e.matchId&&m.seasonId===data.currentSeason));const g=ev.filter(e=>e.scorer===p.id).length,a=ev.filter(e=>e.assist===p.id||e.assistOnly===p.id).length,pen=ev.filter(e=>e.type==='penalty'&&e.penaltyPlayer===p.id);return{p,g,a,pc:pen.length,pm:pen.reduce((sum,e)=>sum+Number(e.penaltyMinutes||0),0)}}).sort((x,y)=>(y.g+y.a)-(x.g+x.a)).forEach(x=>{const tr=document.createElement('tr');[x.p.name,x.g,x.a,x.g+x.a,x.pc,x.pm].forEach(t=>{const td=document.createElement('td');td.textContent=t;tr.append(td)});table.append(tr)});
$('stats').replaceChildren(table);
}
$('open').onclick=()=>{$('panel').classList.add('open');render()};
$('close').onclick=()=>$('panel').classList.remove('open');
$('seasons').onchange=e=>{if(data.currentSeason!==e.target.value&&current()&&data.events.some(ev=>ev.matchId===data.current)&&!confirm('Byta säsong och match? Kontrollera att uppgifterna är sparade.')){render();return}data.currentSeason=e.target.value;data.current=null;save();render()};
$('newseason').onclick=()=>{const name=prompt('Namn på säsongen (t.ex. 2027/28)');if(!name?.trim())return;const id=uid();data.seasons.push({id,name:name.trim()});data.currentSeason=id;data.current=null;save();render()};
$('newmatch').onclick=()=>{const name=prompt('Namn på ny match (t.ex. Kumla – Örebro)');if(!name?.trim())return;const id=uid();data.matches.push({id,name:name.trim(),seasonId:data.currentSeason,roster:[],created:new Date().toISOString()});data.current=id;save();render()};
$('matches').onchange=e=>{if(!changeMatch(e.target.value))render()};
$('matchname').onchange=e=>{const m=current();if(m&&e.target.value.trim()){m.name=e.target.value.trim();save();render()}};
$('addplayer').onclick=()=>{const name=$('player').value.trim();if(!name)return;if(data.players.some(p=>p.name.toLocaleLowerCase('sv')===name.toLocaleLowerCase('sv'))){alert('Spelaren finns redan');return}data.players.push({id:uid(),name});$('player').value='';save();render()};
$('addpenalty').onclick=()=>{if(!current())return alert('Skapa en match först');const penaltyPlayer=$('penaltyplayer').value,penaltyMinutes=Number($('penaltyminutes').value);if(!penaltyPlayer||!current().roster.includes(penaltyPlayer))return alert('Välj en utvisad spelare i laguppställningen');if(![2,5,10].includes(penaltyMinutes))return alert('Välj utvisningstid');addPenalty(current(),penaltyPlayer,penaltyMinutes)};
$('goal').onclick=()=>{if(!current())return alert('Skapa en match först');const scorer=$('scorer').value,assist=$('assist').value;if(!scorer||!current().roster.includes(scorer))return alert('Välj en målskytt i laguppställningen');if(assist&&!current().roster.includes(assist))return alert('Välj en assistspelare i laguppställningen');if(assist===scorer)return alert('Målskytt och assist kan inte vara samma spelare');data.events.push({id:uid(),type:'goal',matchId:data.current,period:Number($('period').value),scorer,assist,time:new Date().toISOString()});save();render()};
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
$('backup').onclick=()=>download('coach294-backup.json',JSON.stringify({format:'coach294',exported:new Date().toISOString(),data},null,2),'application/json');
$('csv').onclick=()=>{const rows=[['Spelare','Mål','Assist','Poäng','Utvisningar','Straffminuter']];data.players.forEach(p=>{const ev=data.events.filter(e=>data.matches.some(m=>m.id===e.matchId&&m.seasonId===data.currentSeason));const g=ev.filter(e=>e.scorer===p.id).length,a=ev.filter(e=>e.assist===p.id||e.assistOnly===p.id).length,pen=ev.filter(e=>e.type==='penalty'&&e.penaltyPlayer===p.id);rows.push([p.name,g,a,g+a,pen.length,pen.reduce((sum,e)=>sum+Number(e.penaltyMinutes||0),0)])});download('coach294-statistik.csv','\ufeff'+rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n'),'text/csv;charset=utf-8')};
$('restore').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const obj=JSON.parse(await f.text());const d=obj.data;if(obj.format!=='coach294'||!d||!Array.isArray(d.matches)||!Array.isArray(d.players)||!Array.isArray(d.events))throw Error('Felaktigt filformat');if(!confirm('Återställ säkerhetskopian? Nuvarande matchdata i Match+ ersätts.'))return;data=d;if(!Array.isArray(data.seasons)||!data.seasons.length){data.seasons=[{id:'season-default',name:'Importerad säsong'}];data.currentSeason='season-default'}if(!data.currentSeason||!data.seasons.some(s=>s.id===data.currentSeason))data.currentSeason=data.seasons[0].id;data.matches.forEach(m=>{if(!m.seasonId)m.seasonId=data.currentSeason;if(!Array.isArray(m.roster))m.roster=data.players.map(p=>p.id)});if(!data.matches.some(m=>m.id===data.current&&m.seasonId===data.currentSeason))data.current=null;save();render();alert('Säkerhetskopian återställd')}catch(err){alert('Kunde inte läsa filen: '+err.message)}finally{e.target.value=''}};
render();
})();