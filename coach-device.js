/* Saved device preference; all coaching data remains in its existing storage. */
(()=>{
 const KEY='coach-device-v1',labels={ios:'iPhone / iPad',android:'Android',other:'Dator / annan enhet'};
 const valid=p=>Object.prototype.hasOwnProperty.call(labels,p);
 const init=()=>{
  let stored='';try{stored=localStorage.getItem(KEY)||'';}catch{}
  let platform=valid(stored)?stored:'',hasChoice=valid(stored),previousFocus=null;
  const shade=document.createElement('div');shade.id='coachDeviceDialog';shade.hidden=true;shade.setAttribute('role','dialog');shade.setAttribute('aria-modal','true');shade.setAttribute('aria-labelledby','coachDeviceTitle');
  shade.innerHTML='<section class="coach-device-card"><h2 id="coachDeviceTitle">Vilken enhet använder du?</h2><p>Välj operativsystem för anpassade kontroller och installationshjälp. Valet sparas på den här enheten.</p><div class="coach-device-choices"></div><p id="coachDeviceHelp"></p><p id="coachDeviceStatus" role="status" aria-live="polite"></p><button type="button" id="coachDeviceClose">Stäng</button></section>';
  document.body.append(shade);const choices=shade.querySelector('.coach-device-choices'),status=document.getElementById('coachDeviceStatus'),close=document.getElementById('coachDeviceClose');
  function apply(next){
   platform=next;document.documentElement.dataset.coachPlatform=next;
   window.coachDevice={platform:next,label:labels[next]};
   choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.platform===next)));
   const help=document.getElementById('installCoachHelp');
   if(help){help.replaceChildren();const summary=document.createElement('summary');summary.textContent='📱 Installera som app · '+labels[next];const text=document.createElement('p');text.textContent=next==='android'?'Öppna appadressen i Chrome på Android. Öppna menyn ⋮ och välj Installera app eller Lägg till på startskärmen. Menynamnet kan variera mellan webbläsare.':next==='ios'?'Öppna appadressen i Safari på iPhone eller iPad. Tryck på Dela och välj Lägg till på hemskärmen.':'Öppna appadressen i din webbläsare. Använd webbläsarens installationsval om det visas, eller spara ett bokmärke.';const offline=document.createElement('p');offline.textContent='Öppna appen med internet en gång innan du använder grundfunktionerna offline. Delning och chatt kräver internet. Enhetsvalet kan ändras under Huvudmeny → Enhet & operativsystem.';help.append(summary,text,offline);document.getElementById('coachDeviceHelp').textContent=text.textContent;}
   const mic=document.getElementById('aiTacticMic');if(mic&&!window.SpeechRecognition&&!window.webkitSpeechRecognition)mic.textContent='🎙️ Diktera med tangentbordet';
   document.dispatchEvent(new CustomEvent('coach-device-changed',{detail:{platform:next}}));
  }
  function hide(){shade.hidden=true;previousFocus?.focus?.({preventScroll:true});}
  function open(){previousFocus=document.activeElement;status.textContent=hasChoice?'Nuvarande val: '+labels[platform]+'. Du kan ändra det här.':'';close.hidden=!hasChoice;shade.hidden=false;const selected=choices.querySelector('[aria-pressed="true"]')||choices.querySelector('button');selected?.focus({preventScroll:true});}
  for(const [value,label] of Object.entries(labels)){
   const b=document.createElement('button');b.type='button';b.dataset.platform=value;b.textContent=(value==='android'?'🤖 ':value==='ios'?'📱 ':'💻 ')+label;b.setAttribute('aria-pressed','false');
   b.onclick=()=>{apply(value);hasChoice=true;close.hidden=false;try{localStorage.setItem(KEY,value);hide();}catch{status.textContent='Valet används nu men kunde inte sparas. Du kan behöva välja igen nästa gång.';}};choices.append(b);
  }
  close.onclick=hide;
  shade.addEventListener('keydown',e=>{if(e.key==='Escape'&&hasChoice){e.preventDefault();e.stopPropagation();hide();}if(e.key==='Tab'){const controls=[...shade.querySelectorAll('button')].filter(b=>!b.hidden),first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  // Keep the board's document-level Escape handler out of this dialog.
  shade.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
  window.coachOpenDeviceSettings=open;
  const detected=/Android/i.test(navigator.userAgent)?'android':/iPad|iPhone|iPod/i.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1?'ios':'other';
  apply(hasChoice?stored:detected);if(!hasChoice)open();
  window.addEventListener('storage',e=>{if(e.key===KEY&&valid(e.newValue)){hasChoice=true;apply(e.newValue);close.hidden=false;}});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
