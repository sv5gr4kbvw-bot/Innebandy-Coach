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
   if(w>h)return '0 0 390 420';
   return '0 0 420 390';
  };
  function apply(){
   const expected=viewFor();
   if(mode!=='full'&&board.getAttribute('viewBox')!==expected){changing=true;board.setAttribute('viewBox',expected);changing=false;}
   if(mode==='full'){const [w,h]=dimensions();const nativeView=`0 0 ${w} ${h}`;if(board.getAttribute('viewBox')!==nativeView){changing=true;board.setAttribute('viewBox',nativeView);changing=false;}}
   document.body.classList.toggle('coach30-half-active',mode!=='full');
   requestAnimationFrame(fitBoard);
  }
  function fitBoard(){
   if(!document.body.classList.contains('board-fullscreen')){
    for(const p of ['position','left','top','width','height','max-width','max-height','margin','transform','object-fit','z-index'])board.style.removeProperty(p);
    return;
   }
   const viewport=window.visualViewport;
   const vw=viewport?.width||window.innerWidth;
   const vh=viewport?.height||window.innerHeight;
   const [fw,fh]=dimensions();
   const aspect=mode==='full'?fw/fh:(fw>fh?390/420:420/390);
   const topSpace=mode==='full'?16:4,bottomSpace=8;
   const availableHeight=Math.max(200,vh-topSpace-bottomSpace);
   const width=Math.min(vw-4,availableHeight*aspect);
   const height=width/aspect;
   const x=(vw-width)/2;
   const y=mode==='full'?topSpace+(availableHeight-height)/2:topSpace;
   const props={position:'fixed',left:x+'px',top:y+'px',width:width+'px',height:height+'px','max-width':'none','max-height':'none',margin:'0',transform:'none','object-fit':'fill','z-index':'152'};
   for(const [k,v] of Object.entries(props))board.style.setProperty(k,v,'important');
  }
  window.addEventListener('resize',()=>requestAnimationFrame(fitBoard),{passive:true});
  window.visualViewport?.addEventListener('resize',()=>requestAnimationFrame(fitBoard),{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(fitBoard,250),{passive:true});
  new MutationObserver(()=>requestAnimationFrame(fitBoard)).observe(document.body,{attributes:true,attributeFilter:['class']});
  function insertControls(){
   if(!sheet.parentElement?.classList.contains('open')||sheet.parentElement.dataset.side!=='left')return;
   const grid=sheet.querySelector('.c212-grid');if(!grid||grid.querySelector('[data-coach30-pitch]'))return;
   const labels=[['full','⛶ Helplan'],['half','🔍 Halvplan']];
   const buttons=labels.map(([value,label])=>{
    const b=document.createElement('button');b.type='button';b.dataset.coach30Pitch=value;b.textContent=label;
    b.setAttribute('aria-pressed',String(mode===value));
    b.addEventListener('click',e=>{
     e.preventDefault();e.stopPropagation();mode=value;
     if(!document.body.classList.contains('board-fullscreen'))document.getElementById('enterFullBoard')?.click();
     apply();
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