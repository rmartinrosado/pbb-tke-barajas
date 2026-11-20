/* ===== v631: SI HAY PUENTE PROVISIONAL, VA SIEMPRE EN PRIMER LUGAR (memorizado para siempre) =====
   Orden en la guía de la OT: «Guía de campo» → caja(s) del PUENTE PROVISIONAL → PRIMERA ACTUACIÓN (actuación guiada) →
   «Seguridad antes de intervenir» → resto de pantallas. Sin puente, el orden de siempre (Seguridad → primera actuación).
   Dentro de la caja del puente no va nada por delante del puente (ni la franja del modelo de PBB ni el recuadro del portón). */
(function(){
const PTE=["gsegl","gpte","ghidr","gm400"];
const o=gSegPrimero;let PARA=0;const MOV=[];
gSegPrimero=function(){try{if(typeof view=="undefined"||view!="tec")return o();
 const P=PTE.map(id=>document.getElementById(id)).filter(x=>x&&x.isConnected&&x.parentElement&&x.parentElement.id=="app");if(!P.length)return o();
 /* con puente: no se llama al orden antiguo (movería Seguridad delante y se pelearían); solo su estilo de Seguridad */
 const sg=document.querySelector('#app>details.gd[data-k="SEG"]');if(sg){sg.classList.add("gseg");
  if(!sg.dataset.pr){sg.dataset.pr=1;const tt=sg.querySelector("summary b");if(tt&&tt.innerHTML.includes("⚠️"))tt.innerHTML=tt.innerHTML.replace("⚠️",`<span class="gsegw">⚠️</span>`)}
  if(!sg.dataset.par){sg.dataset.par=1;sg.classList.add("gpar")}}
 /* v632: solo se ordenan ENTRE SÍ puente(s) → primera actuación → Seguridad, en el sitio donde está el primero de ellos;
    no se toca nada más (la v631 los ponía pegados a «Guía de campo» y se peleaba con «Planos a cotejar», que también va
    ahí: la pantalla se bloqueaba moviendo cajas sin parar y no se podía entrar) */
 if(Date.now()<PARA)return;
 P.sort((a,b)=>a.compareDocumentPosition(b)&4?-1:1);
 const gc=document.getElementById("gcomp"),seg=document.querySelector('#app>details.gd[data-k="SEG"]');
 const S=[...P,(gc&&gc.parentElement&&gc.parentElement.id=="app")?gc:null,seg].filter(Boolean);
 /* solo si el ORDEN relativo está mal (otras cajas pueden ir entre medias, p. ej. Planos a cotejar o el sistema PAS) */
 const D=S.slice().sort((a,b)=>a.compareDocumentPosition(b)&4?-1:1);if(D.every((x,k)=>x===S[k]))return;
 let ref=D[0].previousElementSibling,mov=0;
 S.forEach(x=>{if(ref?ref.nextElementSibling!==x:x.parentElement.firstElementChild!==x){if(ref)ref.insertAdjacentElement("afterend",x);else x.parentElement.prepend(x);mov++}ref=x});
 if(mov){const t=Date.now();MOV.push(t);while(MOV.length&&t-MOV[0]>3000)MOV.shift();if(MOV.length>8){PARA=t+20000;MOV.length=0;console.warn("orden-puente: demasiados movimientos, pausa")}}}catch(e){}};
/* la guía se repinta a menudo: se reordena tras cada cambio de las cajas de primer nivel */
let t=0;const app=document.getElementById("app");
if(app)new MutationObserver(()=>{if(t)return;t=setTimeout(()=>{t=0;try{gSegPrimero()}catch(e){}},120)}).observe(app,{childList:true});
})();
