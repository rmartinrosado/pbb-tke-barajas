/* ===== v631: SI HAY PUENTE PROVISIONAL, VA SIEMPRE EN PRIMER LUGAR (memorizado para siempre) =====
   Orden en la guía de la OT: «Guía de campo» → caja(s) del PUENTE PROVISIONAL → PRIMERA ACTUACIÓN (actuación guiada) →
   «Seguridad antes de intervenir» → resto de pantallas. Sin puente, el orden de siempre (Seguridad → primera actuación).
   Dentro de la caja del puente no va nada por delante del puente (ni la franja del modelo de PBB ni el recuadro del portón). */
(function(){
const PTE=["gsegl","gpte","ghidr","gm400"];
const o=gSegPrimero;
gSegPrimero=function(){try{if(typeof view=="undefined"||view!="tec")return o();
 const P=PTE.map(id=>document.getElementById(id)).filter(x=>x&&x.isConnected&&x.parentElement&&x.parentElement.id=="app");if(!P.length)return o();
 /* con puente: no se llama al orden antiguo (movería Seguridad delante y se pelearían); solo su estilo de Seguridad */
 const sg=document.querySelector('#app>details.gd[data-k="SEG"]');if(sg){sg.classList.add("gseg");
  if(!sg.dataset.pr){sg.dataset.pr=1;const tt=sg.querySelector("summary b");if(tt&&tt.innerHTML.includes("⚠️"))tt.innerHTML=tt.innerHTML.replace("⚠️",`<span class="gsegw">⚠️</span>`)}
  if(!sg.dataset.par){sg.dataset.par=1;sg.classList.add("gpar")}}
 const g=[...document.querySelectorAll("#app>.card")].find(x=>/Guía de campo/.test((x.querySelector("h3")||{}).textContent||""));if(!g)return;
 P.sort((a,b)=>a.compareDocumentPosition(b)&4?-1:1);
 let ref=g;P.forEach(p=>{if(ref.nextElementSibling!==p)ref.insertAdjacentElement("afterend",p);ref=p});
 const gc=document.getElementById("gcomp");if(gc&&gc.parentElement&&gc.parentElement.id=="app"){if(ref.nextElementSibling!==gc)ref.insertAdjacentElement("afterend",gc);ref=gc}
 const seg=document.querySelector('#app>details.gd[data-k="SEG"]');if(seg&&ref.nextElementSibling!==seg)ref.insertAdjacentElement("afterend",seg)}catch(e){}};
/* la guía se repinta a menudo: se reordena tras cada cambio de las cajas de primer nivel */
let t=0;const app=document.getElementById("app");
if(app)new MutationObserver(()=>{if(t)return;t=setTimeout(()=>{t=0;try{gSegPrimero()}catch(e){}},120)}).observe(app,{childList:true});
})();
