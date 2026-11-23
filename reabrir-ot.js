/* ===== v764: OT ABIERTA → candado CERRADO encima de «ABIERTA» que abre el Cierre CGA (resolver).
   v761: OT CERRADA → candado abierto encima de «CERRADA» para reabrirla con un toque (23/11/2026) =====
   v762: solo se borra la hora de cierre; se mantienen llegada, actuación y observaciones.
   Solo técnico y administrador (los que pueden editar OT). ===== */
(function(){"use strict";
const CAND=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.8-1.2"/><circle cx="12" cy="16" r="1.4" fill="currentColor"/></svg>`;
const CERR=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.4" fill="currentColor"/></svg>`;
const st=document.createElement("style");st.textContent=`
#app .card.ot .otres .orl>.otreab,#app .card.ot .otres .orl>.otcerr{position:static!important;transform:none!important;margin:0 0 0 auto!important;
 width:auto!important;height:auto!important;padding:3px 4px!important;border-radius:8px!important;flex:none;line-height:1;align-self:center}
#app .card.ot .otres .orl>.otreab svg,#app .card.ot .otres .orl>.otcerr svg{width:18px!important;height:18px!important}
#app .card.ot .otres .orl>.otreab:active,#app .card.ot .otres .orl>.otcerr:active{transform:scale(.92)!important}
#app .card.ot span.ab.reabw{position:relative;overflow:visible!important}
#app .card.ot .otcerr{position:absolute;left:50%;bottom:calc(100% + 6px);transform:translateX(-50%);width:44px;height:36px;padding:0;margin:0;
 display:flex;align-items:center;justify-content:center;border-radius:10px;border:1.5px solid #e53935;background:#e5393522;color:#ff6b6b;cursor:pointer;z-index:3}
#app .card.ot .otcerr svg{width:22px;height:22px;display:block}
#app .card.ot .otcerr:active{transform:translateX(-50%) scale(.92)}
html.lt #app .card.ot .otcerr{background:#ffebee;color:#c62828}
#app .card.ot span.ce.reabw{position:relative;overflow:visible!important}
#app .card.ot .otreab{position:absolute;left:50%;bottom:calc(100% + 6px);transform:translateX(-50%);width:44px;height:36px;padding:0;margin:0;
 display:flex;align-items:center;justify-content:center;border-radius:10px;border:1.5px solid #2e9e44;background:#2e9e4422;color:#4cd964;cursor:pointer;z-index:3}
#app .card.ot .otreab svg{width:22px;height:22px;display:block}
#app .card.ot .otreab:active{transform:translateX(-50%) scale(.92)}
html.lt #app .card.ot .otreab{background:#e8f5e9;color:#1b7a2f}`;
document.head.appendChild(st);
const puede=()=>{try{return !!(admin||tecnico)}catch(e){return false}};
function pon(){
 const app=document.getElementById("app");if(!app)return;const ok=puede();
 app.querySelectorAll(".card.ot").forEach(c=>{
  const id=c.dataset.oid;let o=null;try{o=inc.find(x=>String(x.id)==String(id))}catch(e){}
  const ce=c.querySelector(".row span.ce"),ab=c.querySelector(".row span.ab");
  const orl=c.querySelector(".otres .orl");/* v774: en la línea de 🔌/✂️ y llave, a la derecha */
  const quiere=!ok||!o?null:o.estado=="cerrada"&&ce?{el:orl||ce,cl:"otreab",ico:CAND,t:"Reabrir OT"}:o.estado=="abierta"&&ab?{el:orl||ab,cl:"otcerr",ico:CERR,t:"Cerrar OT"}:null;
  c.querySelectorAll(".otreab,.otcerr").forEach(b=>{if(!quiere||b.parentNode!==quiere.el||!b.classList.contains(quiere.cl))b.remove()});
  if(quiere&&orl&&quiere.el===orl){const b0=orl.querySelector(":scope>."+quiere.cl);if(b0){if(orl.lastElementChild!==b0)orl.append(b0);return}}
  if(!quiere||quiere.el.querySelector("."+quiere.cl))return;
  if(quiere.el!==orl)quiere.el.classList.add("reabw");
  quiere.el.insertAdjacentHTML("beforeend",`<button type="button" class="${quiere.cl}" title="${quiere.t}" aria-label="${quiere.t}" data-reab="${String(id).replace(/"/g,"")}">${quiere.ico}</button>`)})}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".otcerr");if(!b)return;e.stopPropagation();e.preventDefault();
 try{resolver(b.dataset.reab)}catch(x){console.warn("cerrar OT",x)}},true);
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".otreab");if(!b)return;e.stopPropagation();e.preventDefault();
 let i=null;try{i=inc.find(x=>String(x.id)==b.dataset.reab)}catch(x){}if(!i||i.estado!="cerrada")return;
 if(!confirm(`🔓 ¿Reabrir la OT ${i.orden||""} · PBB ${i.pos}?\n\nQuedará ABIERTA y solo se borra la hora de cierre (se mantienen llegada, actuación y observaciones).`))return;
 i.estado="abierta";i.hCie="";delete i.fCie;
 try{sv("pbb_inc",inc)}catch(x){}try{render()}catch(x){}
 try{if(navigator.vibrate)navigator.vibrate(30)}catch(x){}try{msg("OT reabierta")}catch(x){}},true);
let t=0;const mo=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(pon,60)});
const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);mo.observe(a,{childList:true,subtree:true});pon()};ini();
})();
