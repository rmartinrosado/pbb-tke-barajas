/* ===== v467: MEDIDAS QUE DECIDEN EL SIGUIENTE PASO (15/11/2026) =====
   En cada paso de la guía, la lupa / SOS y las fichas de Componente de campo que pide medir una tensión, una corriente o una
   resistencia con valor esperado, aparece una casilla para meter lo que marca el polímetro. La app lo compara con el esperado:
   · VERDE (dentro de rango) → marca el paso como correcto y lleva al siguiente.
   · ROJO (fuera de rango) → deja el paso resaltado: seguir lo que dice ese paso para el caso incorrecto.
   Las medidas se guardan en la OT abierta de esa posición (campo «medidas») y en el móvil. ===== */
(function(){
"use strict";
const num=x=>parseFloat(String(x).replace(",","."));
/* valor esperado a partir del texto del paso */
function esperado(t){const s=String(t||"");
 let m=s.match(/(\d+(?:[.,]\d+)?)\s*(?:-|–|…|\.\.\.|a)\s*(\d+(?:[.,]\d+)?)\s*mA\b/i);
 if(m){const a=num(m[1]),b=num(m[2]);return{u:"mA",min:a-.3,max:b+.5,txt:`${m[1]}-${m[2]} mA`}}
 m=s.match(/(?:≈|~|aprox\.?\s*)?\s*(\d+(?:[.,]\d+)?)\s*(k?)\s*(?:Ω|ohm|ohmios)/i);
 if(m&&/medir|mide|entre|sin tensi|resisten|kΩ|Ω/i.test(s)){const v=num(m[1])*(m[2]?1000:1);return{u:"Ω",min:v*.9,max:v*1.1,txt:`${m[1]} ${m[2]?"kΩ":"Ω"} ±10 %`,k:m[2]?1000:1}}
 m=s.match(/(\d+(?:[.,]\d+)?)\s*(VDC|VAC|Vdc|Vac|V)(?![a-zA-Z])/);
 if(m&&/medir|mide|medida|tensi|entre|llega|debe|polímetro|polimetro/i.test(s)){const v=num(m[1]);if(v===0)return{u:"V",min:-.5,max:1.5,txt:"0 V"};
  if(v>1000)return null;return{u:/AC/i.test(m[2])?"VAC":"V",min:v*.85,max:v*1.15,txt:`${m[1]} ${m[2]} ±15 %`}}
 return null}
const clave=t=>{let h=0;const s=String(t).slice(0,300);for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return "m"+(h>>>0).toString(36)};
const G=()=>{try{return JSON.parse(localStorage.getItem("pbb_med")||"{}")}catch(e){return{}}};
const guardaLocal=(k,v)=>{try{const o=G();o[k]=v;localStorage.setItem("pbb_med",JSON.stringify(o))}catch(e){}};
function otAct(){try{const p=((document.getElementById("sr_p")||{}).value||"").trim().toUpperCase();if(typeof inc=="undefined")return null;
 if(typeof gOT!="undefined"&&gOT&&!document.getElementById("sr_p")){const o=inc.find(x=>x.id==gOT);if(o)return o}
 return p?inc.find(x=>String(x.pos).toUpperCase()==p&&x.estado=="abierta"):null}catch(e){return null}}
window.medComprueba=function(id){const w=document.getElementById(id);if(!w)return;const E=JSON.parse(w.dataset.e),i=w.querySelector("input"),r=w.querySelector(".medr");
 const v0=num(i.value);if(isNaN(v0)){r.textContent="";w.className="medw";return}
 const v=v0*(E.u=="Ω"&&/k/i.test(w.querySelector("select")?w.querySelector("select").value:"")?1000:1);
 const ok=v>=E.min&&v<=E.max;w.className="medw "+(ok?"medok":"medko");
 r.textContent=ok?"✓ Correcto · sigue al siguiente paso":"✗ Fuera de rango (esperado "+E.txt+") · sigue lo que indica este paso para el caso incorrecto";
 const paso=w.dataset.t;guardaLocal(w.dataset.k,{v:i.value,ok,ts:Date.now()});
 const o=otAct();if(o){o.medidas=(o.medidas||[]).filter(x=>x.k!==w.dataset.k);o.medidas.push({k:w.dataset.k,paso:paso.slice(0,160),v:i.value+" "+(w.querySelector("select")?w.querySelector("select").value:E.u),esp:E.txt,ok,ts:Date.now()});try{sv("pbb_inc",inc)}catch(e){}}
 const host=w.previousElementSibling&&w.previousElementSibling.classList.contains("gpaso")?w.previousElementSibling:w.closest(".lpap,li,.gpaso");
 if(host){host.classList.toggle("medpko",!ok);host.classList.toggle("medpok",ok)}
 if(ok){const cb=host&&host.querySelector&&host.querySelector("input[type=checkbox]");if(cb&&!cb.checked){cb.checked=true;cb.dispatchEvent(new Event("change",{bubbles:true}))}
  /* siguiente paso: el siguiente hermano con texto */
  let n=(w.classList.contains("medsib")?w:host);n=n&&n.nextElementSibling;while(n&&(n.classList.contains("medw")||!n.textContent.trim()))n=n.nextElementSibling;
  if(n){n.classList.add("medsig");setTimeout(()=>n.classList.remove("medsig"),2600);n.scrollIntoView({block:"center",behavior:"smooth"})}}};
let seq=0;
function pon(el,sib){if(el.dataset.med)return;el.dataset.med=1;const t=(el.innerText||el.textContent||"");const E=esperado(t);if(!E)return;
 const k=clave(t),prev=G()[k],id="med"+(++seq);
 const sel=E.u=="Ω"?`<select onchange="medComprueba('${id}')"><option${E.k==1000?"":" selected"}>Ω</option><option${E.k==1000?" selected":""}>kΩ</option></select>`:`<span class="medu">${E.u}</span>`;
 const h=`<div class="medw${sib?" medsib":""}" id="${id}" data-k="${k}" data-t="${t.replace(/"/g,"'").slice(0,200)}" data-e='${JSON.stringify(E)}' onclick="event.stopPropagation()">
  <span class="medl">📏 Medido</span><input type="text" inputmode="decimal" placeholder="valor" value="${prev?String(prev.v).replace(/"/g,""):""}" onchange="medComprueba('${id}')" onkeyup="if(event.key=='Enter')this.blur()">${sel}
  <span class="mede">esperado ${E.txt}</span><div class="medr"></div></div>`;
 if(sib)el.insertAdjacentHTML("afterend",h);else el.insertAdjacentHTML("beforeend",h);
 if(prev)setTimeout(()=>medComprueba(id),0)}
function barre(){document.querySelectorAll(".lpap:not([data-med]),.cmpo li:not([data-med])").forEach(e=>pon(e,false));
 document.querySelectorAll("label.gpaso:not([data-med])").forEach(e=>pon(e,true))}
let tm=null;new MutationObserver(()=>{if(!tm)tm=setTimeout(()=>{tm=null;try{barre()}catch(e){}},250)}).observe(document.documentElement,{childList:true,subtree:true});
const st=document.createElement("style");st.textContent=`
.medw{display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin:4px 0 8px;padding:5px 7px;border:1px dashed var(--bd,#bbb);border-radius:9px;font-size:13px}
.medsib{margin-left:26px}
.medw input{width:84px!important;margin:0!important;padding:5px 7px!important;font-size:15px!important;min-height:0!important}
.medw select{width:auto!important;margin:0!important;padding:4px!important;font-size:13px!important;min-height:0!important}
.medl{font-weight:800}.medu{font-weight:700}.mede{opacity:.7;font-size:12px}
.medr{flex-basis:100%;font-weight:700;font-size:12.5px}
.medok{border:1.5px solid #2e7d32;background:rgba(46,125,50,.08)}.medok .medr{color:#2e7d32}
.medko{border:1.5px solid #c62828;background:rgba(198,40,40,.08)}.medko .medr{color:#c62828}
.medpko{outline:2px solid #c62828;outline-offset:2px;border-radius:8px}
.medsig{animation:medsig 2.5s ease-out}@keyframes medsig{0%{background:rgba(249,115,22,.35)}100%{background:transparent}}`;
document.head.appendChild(st);
window._medTest={esperado};
})();
