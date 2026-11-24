/* ===== v862: Panel de control · el botón SOS pasa a ser un «+» que ocupa toda la caja (abre una actuación nueva, como antes el SOS) =====
   También el botón redondo SOS del panel compacto (#pmini .pms). En esta caja solo queda el «+» (la lupa de la caja queda oculta). */
(function(){
const MAS=`<svg class="pmas" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v17M3.5 12h17"/></svg>`;
const pon=()=>{
 document.querySelectorAll("#app .sosk").forEach(k=>{const b=k.querySelector(".sos2s");if(b&&!b.querySelector(".pmas")){b.innerHTML=MAS;b.setAttribute("aria-label","Nueva actuación");b.title="Nueva actuación"}
  if(!b&&!k.querySelector(".pmas")){k.insertAdjacentHTML("beforeend",MAS);k.querySelectorAll("img").forEach(i=>i.remove())}
  k.classList.add("kmas")});
 const m=document.querySelector("#pmini .pms");if(m&&!m.querySelector(".pmas")){m.innerHTML=MAS;m.setAttribute("aria-label","Nueva actuación");m.title="Nueva actuación"}};
new MutationObserver(pon).observe(document.documentElement,{childList:true,subtree:true});pon();
const st=document.createElement("style");st.textContent=`
#app#app#app .sosk.kmas{position:relative;display:flex!important;align-items:stretch!important;justify-content:stretch!important;padding:0!important;overflow:hidden}
#app#app#app .sosk.kmas .sos2l{display:none!important}
#app#app#app .sosk.kmas .sos2s{flex:1 1 100%!important;width:100%!important;height:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important}
#app#app#app .sosk.kmas .pmas{width:100%!important;height:100%!important;max-height:100%;display:block;fill:none;stroke:#d32f2f;stroke-width:3.2;stroke-linecap:round;animation:none!important;filter:none!important}
#app#app#app .sosk.kmas::after{display:none!important}
#pmini .pms .pmas{width:30px;height:30px;display:block;margin:auto;fill:none;stroke:#fff;stroke-width:3.4;stroke-linecap:round}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) #app#app#app .sosk.kmas .pmas{stroke:#fff}}
:root[data-theme=dark] #app#app#app .sosk.kmas .pmas{stroke:#fff}
html.ext #app#app#app .sosk.kmas .pmas{stroke-width:3.8}`;document.head.appendChild(st)})();
