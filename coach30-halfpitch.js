/* Coach 30.0: reversible half-pitch zoom, using the existing SVG board and gesture engine. */
(()=>{
 const init=()=>{
  const board=document.getElementById('board'), enter=document.getElementById('enterFullBoard');
  if(!board||!enter)return;
  let half=false, side='first', adjusting=false;
  const bar=document.createElement('div');bar.id='coach30HalfBar';bar.setAttribute('aria-label','Halvplansläge');
  const toggle=document.createElement('button');toggle.type='button';toggle.textContent='🔍 Halvplan';toggle.setAttribute('aria-pressed','false');
  const switchSide=document.createElement('button');switchSide.type='button';switchSide.textContent='⇅ Byt planhalva';switchSide.hidden=true;
  const exit=document.createElement('button');exit.type='button';exit.textContent='⛶ Helplan';exit.hidden=true;
  bar.append(toggle,switchSide,exit);document.body.appendChild(bar);
  const normal=()=>{const horizontal=document.getElementById('orientation')?.value==='horizontal';return horizontal?{w:760,h:420}:{w:420,h:760};};
  const apply=()=>{
   if(adjusting)return;
   adjusting=true;
   const {w,h}=normal();
   const isHorizontal=w>h;
   const view=half?(isHorizontal?(side==='first'?'0 0 390 420':'370 0 390 420'):(side==='first'?'0 0 420 390':'0 370 420 390')):`0 0 ${w} ${h}`;
   if(board.getAttribute('viewBox')!==view)board.setAttribute('viewBox',view);
   toggle.setAttribute('aria-pressed',String(half));toggle.textContent=half?'🔎 Halvplan aktiv':'🔍 Halvplan';
   switchSide.hidden=!half;exit.hidden=!half;
   switchSide.textContent=isHorizontal?(side==='first'?'➡️ Visa höger halva':'⬅️ Visa vänster halva'):(side==='first'?'⬇️ Visa nedre halvan':'⬆️ Visa övre halvan');
   document.body.classList.toggle('coach30-half-active',half);
   adjusting=false;
  };
  const start=()=>{
   if(window.matchReadOnly){return;}
   half=true;side='first';
   if(!document.body.classList.contains('board-fullscreen'))enter.click();
   apply();
  };
  toggle.addEventListener('click',()=>{if(half){half=false;apply();}else start();});
  switchSide.addEventListener('click',()=>{side=side==='first'?'second':'first';apply();});
  exit.addEventListener('click',()=>{half=false;apply();});
  const obs=new MutationObserver(()=>{if(!adjusting){const {w,h}=normal();const expected=half?(w>h?(side==='first'?'0 0 390 420':'370 0 390 420'):(side==='first'?'0 0 420 390':'0 370 420 390')):`0 0 ${w} ${h}`;if(half&&board.getAttribute('viewBox')!==expected)apply();}});
  obs.observe(board,{attributes:true,attributeFilter:['viewBox']});
  const bodyObs=new MutationObserver(()=>{if(half&&!document.body.classList.contains('board-fullscreen')){half=false;apply();}});
  bodyObs.observe(document.body,{attributes:true,attributeFilter:['class']});
  document.getElementById('orientation')?.addEventListener('change',()=>queueMicrotask(apply));
  apply();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
