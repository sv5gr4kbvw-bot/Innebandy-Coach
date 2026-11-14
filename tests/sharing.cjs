const {JSDOM}=require('jsdom'),fs=require('fs'),assert=require('assert/strict');
const root=require('node:path').resolve(__dirname,'..');
const html=fs.readFileSync(root+'/index.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const data={},listeners=new Map();let count=0;
const clone=v=>v==null?null:JSON.parse(JSON.stringify(v));
const get=path=>path.split('/').filter(Boolean).reduce((v,k)=>v?.[k],data);
const snap=path=>({val:()=>clone(get(path)),exists:()=>get(path)!=null,child:k=>snap(path+'/'+k)});
function write(path,value){const parts=path.split('/'),key=parts.pop();let node=data;for(const k of parts)node=node[k]??={};if(value===null)delete node[key];else node[key]=clone(value);for(const [p,set] of listeners)if(path.startsWith(p)||p.startsWith(path))for(const cb of [...set])queueMicrotask(()=>cb(snap(p)));}
function ref(path,uid){return {child:k=>ref(path+'/'+k,uid),once:async()=>snap(path),on:(kind,cb)=>{if(!listeners.has(path))listeners.set(path,new Set());listeners.get(path).add(cb);queueMicrotask(()=>cb(snap(path)));},off:(kind,cb)=>listeners.get(path)?.delete(cb),limitToLast:()=>ref(path,uid),onDisconnect:()=>({remove:async()=>{},cancel:async()=>{}}),set:async value=>{const bits=path.split('/');if(bits[2]==='board'&&get('rooms/'+bits[1]+'/createdBy')!==uid&&!get('rooms/'+bits[1]+'/editors/'+uid))throw Error('permission-denied');write(path,value)},update:async obj=>{for(const [k,v] of Object.entries(obj))write(path+'/'+k,v)},remove:async()=>write(path,null),push:async obj=>write(path+'/message'+(++count),obj)}};
function client(uid){const dom=new JSDOM(html,{url:'https://coach.test/',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;w.HTMLElement.prototype.scrollIntoView=()=>{};w.MATCH_FIREBASE_CONFIG={apiKey:'test',databaseURL:'test'};let items=[];w.coachMatchBoard={getItems:()=>clone(items),setItems:x=>{items=clone(x)}};w.firebase={apps:[],initializeApp:()=>({database:()=>({ref:path=>ref(path,uid)}),auth:()=>({currentUser:{uid},signInAnonymously:async()=>{}})}),database:{ServerValue:{TIMESTAMP:123}}};w.eval(fs.readFileSync(root+'/match.js','utf8'));return {w,d:w.document,dom,items:()=>items,set:x=>{items=x;w.matchScheduleSync()}};}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const a=client('owner'),b=client('guest1'),c=client('guest2');const clients=[a,b,c];
for(const [i,x] of clients.entries())x.d.getElementById('matchName').value=['Michael','Sofia','Tränare tre'][i];
await a.d.getElementById('matchCreate').onclick();await wait(30);const room=new URL(a.d.getElementById('matchInviteUrl').value).searchParams.get('room');assert(room);
for(const x of [b,c]){x.d.getElementById('matchCode').value=room;await x.d.getElementById('matchJoin').onclick();await wait(30);assert.equal(x.w.matchReadOnly,false);}
b.set([{id:1,type:'draw',points:[[10,10],[20,20]],color:'#fff',width:4}]);await wait(240);assert.equal(a.items()[0].type,'draw');assert.equal(c.items()[0].type,'draw');
const input=c.d.getElementById('matchMessage');input.value='Hej\nalla';input.dispatchEvent(new c.w.Event('input'));assert.equal(get('rooms/'+room+'/chat'),undefined);await c.d.getElementById('matchSend').onclick();await wait(30);assert(a.d.getElementById('matchChat').textContent.includes('Tränare tre'));assert(a.d.getElementById('matchChat').textContent.includes('Hej\nalla'));

assert.equal(a.d.getElementById('coachChatNotice').hidden,false);assert(a.d.getElementById('coachChatNoticeText').textContent.includes('Hej'));assert.equal(c.d.getElementById('coachChatNotice').hidden,true);
a.d.getElementById('coachChatLater').click();assert.equal(a.d.getElementById('coachChatNotice').hidden,true);assert.equal(a.d.getElementById('coachChatUnread').hidden,false);
a.d.getElementById('coachChatUnread').click();assert.equal(a.d.getElementById('coachShareCenter').hidden,false);assert.equal(a.d.getElementById('coachChatUnread').hidden,true);assert.equal(a.d.activeElement.id,'matchMessage');
b.d.getElementById('matchMessage').value='Medan chatten är öppen';await b.d.getElementById('matchSend').onclick();await wait(30);assert.equal(a.d.getElementById('coachChatNotice').hidden,true);
a.d.getElementById('matchToBoard').click();b.d.getElementById('matchMessage').value='Nytt på tavlan';await b.d.getElementById('matchSend').onclick();await wait(30);assert.equal(a.d.getElementById('coachChatNotice').hidden,false);
const late=client('late');late.d.getElementById('matchName').value='Ny tränare';late.d.getElementById('matchCode').value=room;await late.d.getElementById('matchJoin').onclick();await wait(30);assert.equal(late.d.getElementById('coachChatNotice').hidden,true);late.d.getElementById('matchLeave').onclick();late.dom.window.close();
console.log('PASS: new-message notice, no notice for own/history messages, dismiss keeps unread button, read/reply clears unread, open chat avoids duplicate toast');
c.d.getElementById('matchLeave').onclick();await wait(30);assert.equal(c.w.matchReadOnly,false);assert.equal(c.d.getElementById('matchInviteUrl').value,'');assert.equal(c.d.getElementById('matchChat').children.length,0);
console.log('PASS: three trainers, automatic editing, guest drawing sync, draft/send/newline/name, leave cleanup');clients.forEach(x=>x.dom.window.close());})().catch(e=>{console.error(e);process.exit(1)});
