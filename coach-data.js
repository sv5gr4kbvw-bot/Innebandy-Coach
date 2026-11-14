/* Shared validation for match imports and complete backups. */
(()=>{
 'use strict';
 function validateMatchData(value){
  const d=JSON.parse(JSON.stringify(value));
  const fail=message=>{throw Error(message)};
  const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
  if(!record(d)||!Array.isArray(d.matches)||!Array.isArray(d.players)||!Array.isArray(d.events))fail('Matchdata saknar matcher, spelare eller händelser');
  if(d.matches.length>10000||d.players.length>10000||d.events.length>100000)fail('Säkerhetskopian innehåller för många poster');
  const ids=(items,label)=>{const seen=new Set();for(const x of items){if(!record(x)||typeof x.id!=='string'||!x.id||seen.has(x.id))fail('Ogiltigt eller dubbelt ID för '+label);seen.add(x.id)}return seen};
  const named=(items,label)=>{for(const x of items)if(typeof x.name!=='string'||!x.name.trim()||x.name.length>500)fail('Ogiltigt namn för '+label)};
  const players=ids(d.players,'spelare'),matches=ids(d.matches,'match');named(d.players,'spelare');named(d.matches,'match');ids(d.events,'händelse');
  if(d.seasons===undefined||Array.isArray(d.seasons)&&!d.seasons.length){d.seasons=[{id:'season-default',name:'Importerad säsong'}];d.currentSeason='season-default'}
  if(!Array.isArray(d.seasons))fail('Ogiltiga säsonger');
  const seasons=ids(d.seasons,'säsong');named(d.seasons,'säsong');
  if(!d.currentSeason)d.currentSeason=d.seasons[0].id;
  if(!seasons.has(d.currentSeason))fail('Vald säsong saknas');
  for(const m of d.matches){
   if(m.seasonId===undefined)m.seasonId=d.currentSeason;
   if(!seasons.has(m.seasonId))fail('Matchens säsong saknas');
   if(m.roster===undefined)m.roster=[...players];
   if(!Array.isArray(m.roster)||new Set(m.roster).size!==m.roster.length||m.roster.some(id=>!players.has(id)))fail('Ogiltig laguppställning');
   for(const field of ['resultFor','resultAgainst'])if(m[field]!=null&&(!Number.isInteger(m[field])||m[field]<0||m[field]>999))fail('Ogiltigt matchresultat');
   if(m.period===undefined)m.period=1;
   if(![1,2,3,4].includes(m.period))fail('Ogiltig matchperiod');
  }
  const byMatch=new Map(d.matches.map(m=>[m.id,m]));
  for(const e of d.events){
   if(!matches.has(e.matchId))fail('En händelse hänvisar till en match som saknas');
   if(e.period===undefined)e.period=1;
   if(![1,2,3,4].includes(e.period))fail('Ogiltig period i händelse');
   const roster=byMatch.get(e.matchId).roster;
   const player=id=>typeof id==='string'&&players.has(id)&&roster.includes(id);
   if(e.type==='goal'){if(!player(e.scorer)||e.assist&&!player(e.assist)||e.assist===e.scorer)fail('Ogiltig målskytt eller assist')}
   else if(e.type==='assist'){if(!player(e.assistOnly))fail('Ogiltig assistspelare')}
   else if(e.type==='penalty'){if(!player(e.penaltyPlayer)||![2,5,10].includes(e.penaltyMinutes))fail('Ogiltig utvisning')}
   else fail('Okänd händelsetyp');
  }
  if(d.current!=null&&!matches.has(d.current))fail('Vald match saknas');
  if(d.current&&byMatch.get(d.current).seasonId!==d.currentSeason)fail('Vald match tillhör en annan säsong');
  return d;
 }
 window.coachValidateMatchData=validateMatchData;
})();
