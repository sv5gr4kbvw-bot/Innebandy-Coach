/* Coach 30.0 — animation guidance; existing animation engine remains authoritative. */
(()=>{
 const init=()=>{
  const frame=document.getElementById('frame');
  const play=document.getElementById('play');
  const count=document.getElementById('frameCount');
  if(!frame||!play||!count)return;
  const hint=document.createElement('p');
  hint.id='coach30AnimationHint';
  hint.className='coach30-animation-hint';
  hint.setAttribute('role','status');
  hint.setAttribute('aria-live','polite');
  count.parentElement.insertAdjacentElement('afterend',hint);
  let multiMode=!!window.coach30MultiMode, movedCount=0;
  const multi=document.createElement('button');
  multi.type='button';
  multi.className='coach30-multi-toggle';
  multi.textContent='👥 Flera spelare: Av';
  multi.setAttribute('aria-pressed','false');
  hint.insertAdjacentElement('afterend',multi);
  const multiInfo=document.createElement('p');
  multiInfo.className='coach30-multi-info';
  multiInfo.hidden=true;
  multi.insertAdjacentElement('afterend',multiInfo);
  const showMulti=()=>{multiInfo.hidden=!multiMode;if(multiMode)multiInfo.textContent=movedCount+' förflyttningar sedan senaste bildrutan. Flytta alla önskade spelare en i taget och tryck sedan + Steg i träningspanelen eller + Bildruta. Rörelserna sparas i samma steg.';};
  multi.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('coach30-multi-mode',{detail:{enabled:!multiMode}})));
  document.addEventListener('coach30-multi-mode',e=>{multiMode=!!e.detail.enabled;movedCount=0;multi.setAttribute('aria-pressed',String(multiMode));multi.textContent=multiMode?'👥 Flera spelare: På':'👥 Flera spelare: Av';showMulti();});
  document.addEventListener('coach306-object-moved',()=>{if(multiMode){movedCount++;showMulti();}});
  frame.addEventListener('click',()=>{if(multiMode){movedCount=0;showMulti();}});
  document.getElementById('framesClear')?.addEventListener('click',()=>{if(multiMode){movedCount=0;showMulti();}});
  document.addEventListener('coach-animation-step-undone',()=>{movedCount=0;showMulti();});
  const update=()=>{
   const n=parseInt(count.textContent,10)||0;
   if(n===0){hint.textContent='Börja med att placera spelare på planen. Tryck sedan + Bildruta för att spara startläget.';}
   else if(n===1){hint.textContent='Startläget är sparat. Flytta spelarna och tryck + Bildruta igen för att skapa rörelsen.';}
   else{hint.textContent=n+' bildrutor sparade. Tryck Spela för att se övningen, eller flytta spelare och lägg till fler bildrutor.';}
   play.setAttribute('aria-description',n<2?'Spara minst två bildrutor för att visa en rörelse.':'Spela upp sparade bildrutor.');
  };
  // Prevent accidental loss of recorded exercise frames on small touch screens.
  const clear=document.getElementById('framesClear');
  if(clear){
   clear.addEventListener('click',event=>{
    const n=parseInt(count.textContent,10)||0;
    if(n===0)return;
    if(!window.confirm('Vill du radera alla '+n+' bildrutor i övningen? Det går inte att ångra.')){
     event.preventDefault();
     event.stopImmediatePropagation();
    }
   },true);
  }
  const observer=new MutationObserver(update);
  observer.observe(count,{subtree:true,childList:true,characterData:true});
  document.dispatchEvent(new CustomEvent('coach30-multi-mode',{detail:{enabled:multiMode}}));
  update();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
