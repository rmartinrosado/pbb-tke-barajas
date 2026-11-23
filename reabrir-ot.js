/* ===== v761: OT CERRADA → candado abierto encima de «CERRADA» para reabrirla con un toque (23/11/2026) =====
   Mismo criterio que Editar → Estado «Abierta»: se borran horas de llegada y cierre, actuación y observaciones.
   Solo técnico y administrador (los que pueden editar OT). ===== */
(function(){"use strict";
const CAND=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.8-1.2"/><circle cx="12" cy="16" r="1.4" fill="currentColor"/></svg>`;
const st=document.createElement("style");st.textContent=`
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
  const ce=c.querySelector(".row span.ce");const b=c.querySelector(".otreab");
  if(!ce||!ok){if(b)b.remove();return}
  const id=c.dataset.oid;let o=null;try{o=inc.find(x=>String(x.id)==String(id))}catch(e){}
  if(!o||o.estado!="cerrada"){if(b)b.remove();return}
  if(b&&b.parentNode===ce)return;if(b)b.remove();
  ce.classList.add("reabw");
  ce.insertAdjacentHTML("beforeend",`<button type="button" class="otreab" title="Reabrir OT" aria-label="Reabrir OT" data-reab="${String(id).replace(/"/g,"")}">${CAND}</button>`)})}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".otreab");if(!b)return;e.stopPropagation();e.preventDefault();
 let i=null;try{i=inc.find(x=>String(x.id)==b.dataset.reab)}catch(x){}if(!i||i.estado!="cerrada")return;
 if(!confirm(`🔓 ¿Reabrir la OT ${i.orden||""} · PBB ${i.pos}?\n\nQuedará ABIERTA y se borran la hora de llegada, la hora de cierre, la actuación y las observaciones.`))return;
 i.estado="abierta";i.hLle="";i.hCie="";i.act="";i.obs="";
 try{sv("pbb_inc",inc)}catch(x){}try{render()}catch(x){}
 try{if(navigator.vibrate)navigator.vibrate(30)}catch(x){}try{msg("OT reabierta")}catch(x){}},true);
let t=0;const mo=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(pon,60)});
const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);mo.observe(a,{childList:true,subtree:true});pon()};ini();
})();
