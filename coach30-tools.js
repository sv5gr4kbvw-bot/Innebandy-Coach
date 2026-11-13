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
  const names={move:'Flytta objekt',draw:'Rita',arrow:'Rita pil',erase:'Sudda',playerA:'Placera blå spelare',playerB:'Placera röd spelare',goalieA:'Placera blå målvakt',goalieB:'Placera röd målvakt',ball:'Placera boll',cone:'Placera kona',goal:'Placera mål'};
  let previous='';
  const refresh=()=>{
   const active=buttons.find(b=>b.classList.contains('active'));
   buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===active)));
   if(active){const mode=active.dataset.mode;const label=names[mode]||active.textContent.trim();const placement=['playerA','playerB','goalieA','goalieB','ball','cone','goal'].includes(mode);const help=placement?'Tryck på planen för att placera. Välj sedan Flytta för att dra objekt.':mode==='move'?'Dra spelare, bollar och koner med fingret.':mode==='draw'?'Dra fingret på planen för att rita.':mode==='arrow'?'Dra från start till mål för att rita en pil.':mode==='erase'?'Dra över det du vill sudda.':'';status.textContent='Aktivt verktyg: '+label+(help?' · '+help:'');previous=mode;}
  };
  modes.addEventListener('click',e=>{if(e.target.closest('button[data-mode]'))queueMicrotask(refresh)});
  const observer=new MutationObserver(()=>{const active=buttons.find(b=>b.classList.contains('active'));if(active&&active.dataset.mode!==previous)refresh()});
  // Selecting a placement tool leaves the existing placement and drag logic untouched.
  const board=document.getElementById('board');
  if(board){board.setAttribute('aria-description','Välj ett verktyg och tryck på planen. Använd Flytta för att dra objekt.');}
  // Fast return to move mode without interfering with existing board gestures.
  const quick=document.createElement('button');
  quick.type='button';
  quick.id='coach30QuickMove';
  quick.className='coach30-quick-move';
  quick.textContent='✋ Flytta objekt';
  quick.setAttribute('aria-label','Växla till verktyget Flytta');
  quick.addEventListener('click',()=>{
   const move=modes.querySelector('button[data-mode="move"]');
   if(move && !window.matchReadOnly) move.click();
  });
  status.insertAdjacentElement('afterend',quick);
  const updateQuick=()=>{
   const active=buttons.find(b=>b.classList.contains('active'))?.dataset.mode;
   quick.hidden=active==='move'||!!window.matchReadOnly;
  };
  buttons.forEach(b=>observer.observe(b,{attributes:true,attributeFilter:['class']}));
  modes.addEventListener('click',()=>queueMicrotask(updateQuick));
  updateQuick();
  refresh();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
