/* Coach 30.0: keep tool selection accessible and predictable without changing board logic. */
(()=>{
 const init=()=>{
  const modes=document.getElementById('modes');
  if(!modes)return;
  const buttons=[...modes.querySelectorAll('button[data-mode]')];
  if(!buttons.length)return;
  const status=document.createElement('div');
  status.id='coach30ModeStatus';
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  status.className='coach30-mode-status';
  modes.insertAdjacentElement('afterend',status);
  const names={move:'Flytta objekt',draw:'Rita',arrow:'Rita pil',erase:'Sudda',player:'Placera spelare',ball:'Placera boll',cone:'Placera kona',goal:'Placera mål'};
  let previous='';
  const refresh=()=>{
   const active=buttons.find(b=>b.classList.contains('active'));
   buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===active)));
   if(active){const mode=active.dataset.mode;const label=names[mode]||active.textContent.trim();const placement=['playerA','playerB','goalieA','goalieB','ball','cone','goal'].includes(mode);status.textContent='Aktivt verktyg: '+label+(placement?' · Tryck på planen för att placera':'');previous=mode;}
  };
  modes.addEventListener('click',e=>{if(e.target.closest('button[data-mode]'))queueMicrotask(refresh)});
  const observer=new MutationObserver(()=>{const active=buttons.find(b=>b.classList.contains('active'));if(active&&active.dataset.mode!==previous)refresh()});
  buttons.forEach(b=>observer.observe(b,{attributes:true,attributeFilter:['class']}));
  // Selecting a placement tool leaves the existing placement and drag logic untouched.
  const board=document.getElementById('board');
  if(board){board.setAttribute('aria-description','Välj ett verktyg och tryck på planen. Använd Flytta för att dra objekt.');}
  refresh();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
