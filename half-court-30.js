/* Innebandy Coach PRO 30 – non-destructive half-court viewport */
(()=>{'use strict';
function init(){
 const board=document.getElementById('board');if(!board)return;
 const bar=document.createElement('div');bar.id='halfCourtControls';bar.setAttribute('aria-label','Planvisning');
 bar.innerHTML='<button type="button" data-half="all">Helplan</button><button type="button" data-half="top">Övre halvan</button><button type="button" data-half="bottom">Nedre halvan</button>';
 Object.assign(bar.style,{position:'fixed',right:'6px',bottom:'max(8px, env(safe-area-inset-bottom))',zIndex:'310',display:'flex',gap:'4px',padding:'5px',borderRadius:'12px',background:'#101d30ee',boxShadow:'0 4px 20px #0008'});
 for(const b of bar.querySelectorAll('button'))Object.assign(b.style,{fontSize:'11px',minHeight:'38px',padding:'6px',borderRadius:'8px'});
 document.body.append(bar);
 let mode='all',updating=false;
 function fullSize(){const v=board.viewBox.baseVal;return v.width>v.height?{w:760,h:420}:{w:420,h:760}}
 function apply(){
  if(updating)return;updating=true;
  const {w,h}=fullSize(),vertical=h>w;
  const crop=mode==='all'?[0,0,w,h]:vertical?[0,mode==='top'?0:h/2,w,h/2]:[mode==='top'?0:w/2,0,w/2,h];
  const value=crop.join(' ');
  if(board.getAttribute('viewBox')!==value)board.setAttribute('viewBox',value);
  board.setAttribute('aria-label',mode==='all'?'Hel innebandyplan':mode==='top'?'Övre planhalvan':'Nedre planhalvan');
  bar.querySelectorAll('button').forEach(b=>{const selected=b.dataset.half===mode;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  updating=false;
 }
 bar.addEventListener('click',e=>{const b=e.target.closest('[data-half]');if(!b)return;mode=b.dataset.half;apply();});
 const observer=new MutationObserver(()=>{if(!updating)apply()});
 observer.observe(board,{attributes:true,attributeFilter:['viewBox']});
 apply();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();