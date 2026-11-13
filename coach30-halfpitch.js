/* PRO 30: Planvy väljs i befintlig vänstermeny – inga flytande plan-knappar. */
(()=>{
 const init=()=>{
  const board=document.getElementById('board'),sheet=document.getElementById('coach212Sheet');
  if(!board||!sheet)return;
  let mode='full',changing=false;
  const dimensions=()=>document.getElementById('orientation')?.value==='horizontal'?[760,420]:[420,760];
  const viewFor=()=>{
   const [w,h]=dimensions();
   if(mode==='full')return `0 0 ${w} ${h}`;
   if(w>h)return mode==='first'?'0 0 390 420':'370 0 390 420';
   return mode==='first'?'0 0 420 390':'0 370 420 390';
  };
  function apply(){
   const expected=viewFor();
   if(board.getAttribute('viewBox')!==expected){changing=true;board.setAttribute('viewBox',expected);changing=false;}
   document.body.classList.toggle('coach30-half-active',mode!=='full');
  }
  function insertControls(){
   if(!sheet.parentElement?.classList.contains('open')||sheet.parentElement.dataset.side!=='left')return;
   const grid=sheet.querySelector('.c212-grid');if(!grid||grid.querySelector('[data-coach30-pitch]'))return;
   const labels=[['full','⛶ Helplan'],['first','🔍 Första planhalvan'],['second','🔍 Andra planhalvan']];
   const buttons=labels.map(([value,label])=>{
    const b=document.createElement('button');b.type='button';b.dataset.coach30Pitch=value;b.textContent=label;
    b.setAttribute('aria-pressed',String(mode===value));
    b.addEventListener('click',e=>{
     e.preventDefault();e.stopPropagation();mode=value;apply();
     sheet.parentElement.querySelector('.c212-close')?.click();
    });
    return b;
   });
   const heading=document.createElement('div');heading.textContent='PLANVY';heading.style.cssText='grid-column:1/-1;font-weight:700;opacity:.85;margin-top:8px';
   grid.prepend(heading,...buttons);
  }
  const sheetObserver=new MutationObserver(insertControls);
  sheetObserver.observe(sheet,{childList:true,subtree:true});
  new MutationObserver(()=>{if(!changing&&mode!=='full'&&board.getAttribute('viewBox')!==viewFor())apply();}).observe(board,{attributes:true,attributeFilter:['viewBox']});
  document.getElementById('orientation')?.addEventListener('change',()=>queueMicrotask(apply));
  apply();insertControls();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();