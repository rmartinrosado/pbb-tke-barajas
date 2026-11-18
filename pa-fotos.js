/* ===== v588: FOTOS DEL COMPONENTE EN LA PRIMERA ACTUACIÓN (18/11/2026) =====
   En la caja de la primera actuación en campo, justo ANTES del texto del trueno amarillo (⚡), dos fotos centradas
   al ancho para localizar antes el componente que cita la actuación:
     1.ª · el componente recortado, con su código en el pie.
     2.ª · su ubicación (foto de ubicación de la ficha de Componentes de campo).
   El componente es el primer código que cita el texto del ⚡ (p. ej. «En el bornero E-X62…» → E-X62) que tenga ficha
   con fotos; si el texto no cita ninguno con ficha, el del rótulo de la caja (p. ej. «láser ET-B9»).
   Funciona sobre la pantalla ya pintada (todas las cajas ⚡ de primera actuación), sin tocar los textos. ===== */
(function(){
"use strict";
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const N=t=>String(t||"").toUpperCase().replace(/\s+/g,"");
const RE=/\b([A-Z]{1,3}\d?-[A-Z]{1,2}\d+(?:\.\d+)?)/g;
const L=()=>window.COMP_CAMPO||[];
const codsDe=id=>String(id||"").split(/\s*(?:\/|,|\+|\by\b)\s*/).map(N).filter(Boolean);
const fo=f=>Array.isArray(f)?{src:f[0],v:String(f[1]||"")}:{src:(f||{}).src,v:String((f||{}).vista||"")};
const esUbi=f=>/^ubicaci/i.test(f.v);
const codigos=t=>{const o=[];String(t||"").replace(RE,(m,c)=>{c=N(c);if(!o.includes(c))o.push(c);return m});return o};
/* fichas de un código (exacto; si no, sin el sufijo .1/.2…) · la que tenga foto de ubicación primero */
function fichas(cod){const L0=L();let r=L0.filter(c=>codsDe(c.id).includes(cod));
 if(!r.length&&/\.\d+$/.test(cod)){const b=cod.replace(/\.\d+$/,"");r=L0.filter(c=>codsDe(c.id).includes(b))}
 const pt=c=>{const F=(c.fotos||[]).map(fo);return (F.some(f=>!esUbi(f)&&f.src)?2:0)+(F.some(f=>esUbi(f)&&f.src)?1:0)+(c._fp?1:0)};
 return r.filter(c=>c._fp||(c.fotos||[]).length).sort((a,b)=>pt(b)-pt(a))}
function elige(txt,cab){for(const t of [txt,cab])for(const cod of codigos(t)){const F=fichas(cod);if(F.length)return{cod,c:F[0]}}return null}
const verFoto=src=>{if(typeof compVer=="function")compVer(src)};
window.paFotoVer=function(ev,el){if(ev){ev.stopPropagation();ev.preventDefault()}verFoto(el.getAttribute("data-src"))};
function html(cod,c){const F=(c.fotos||[]).map(fo).filter(f=>f.src);const cp=F.find(f=>!esUbi(f)),ub=F.find(esUbi);if(!cp&&!ub)return"";
 const v=t=>E(String(t||"").replace(/\s*·.*$/,""));
 const fig=(f,pie,cl)=>`<figure class="pafig ${cl}"><img src="${E(f.src)}" data-src="${E(f.src)}" alt="${E(pie)}" loading="lazy" onclick="paFotoVer(event,this)" ondblclick="event.stopPropagation()"><figcaption>${pie}</figcaption></figure>`;
 return (cp?fig(cp,`<b>${E(cod)}</b>${c.t?` · ${E(c.t)}`:""}<small>${v(cp.v)||"Vista componente"}</small>`,"pacmp"):`<div class="pafig pafalta">Sin foto del componente <b>${E(cod)}</b> · añádela en Componentes de campo</div>`)+
  (ub?fig(ub,`📍 <b>Ubicación de ${E(cod)}</b><small>${E(String(ub.v).replace(/^ubicaci[oó]n\s*·\s*/i,""))}</small>`,"paubi"):`<div class="pafig pafalta">📍 Sin foto de ubicación de <b>${E(cod)}</b> · añádela en Componentes de campo</div>`)}
const CACHE={};
function pinta(d){const P=d.closest(".puit")||d.parentElement;if(!P)return;
 const txt=d.textContent||"";const cab=(P.textContent||"").replace(txt,"");
 const r=elige(txt,cab);if(!r){d.dataset.pft=String(+(d.dataset.pft||0)+1);return}
 const k=r.cod+"|"+(r.c.db||r.c.id);
 const pon=()=>{if(!d.isConnected||d.dataset.pf)return;const h=CACHE[k]||(CACHE[k]=html(r.cod,r.c));if(!h){d.dataset.pf="0";return}
  const b=document.createElement("div");b.className="pafo";b.innerHTML=h;d.parentNode.insertBefore(b,d);d.dataset.pf="1"};
 if(r.c._fp&&typeof compFotosAsegura=="function"){d.dataset.pf="";compFotosAsegura(r.c).then(()=>{delete CACHE[k];pon()});return}
 pon()}
function barre(){document.querySelectorAll(".puac:not([data-pf])").forEach(d=>{
  if(+(d.dataset.pft||0)>20)return;const t=(d.textContent||"").trim();if(!/^⚡/.test(t))return;
  const prev=d.previousElementSibling;if(prev&&prev.classList.contains("pafo")){d.dataset.pf="1";return}
  try{pinta(d)}catch(e){d.dataset.pf="0"}})}
let rq=0;const pide=()=>{if(rq)return;rq=requestAnimationFrame(()=>{rq=0;barre()})};
new MutationObserver(pide).observe(document.documentElement,{childList:true,subtree:true});
/* las fichas de Supabase llegan más tarde: reintento de las cajas aún sin componente */
setInterval(()=>{if(document.querySelector(".puac[data-pft]:not([data-pf])"))barre()},3000);
/* la lista de componentes cambia (incorporar / recargar) → se rehacen las fotos */
if(typeof window.compRecarga=="function"){const o=window.compRecarga;window.compRecarga=async function(){const r=await o.apply(this,arguments);
 Object.keys(CACHE).forEach(k=>delete CACHE[k]);document.querySelectorAll(".puac[data-pft]").forEach(d=>d.removeAttribute("data-pft"));pide();return r}}
const st=document.createElement("style");st.textContent=`
.pafo{display:flex;flex-direction:column;align-items:center;gap:10px;margin:10px 0 8px;width:100%}
.pafig{width:100%;margin:0;background:#fff;border:1px solid #d0d0d0;border-radius:10px;padding:6px;box-sizing:border-box;text-align:center}
.pafig img{display:block;width:100%;max-height:46vh;object-fit:contain;margin:0 auto;border-radius:6px;background:#fff;cursor:zoom-in}
.pafig figcaption{margin-top:5px;font-size:14px;line-height:1.3;color:#111;text-align:center}
.pafig figcaption small{display:block;font-size:12px;color:#555;font-weight:400}
.pafig.paubi{border-color:#e08a00}
.pafalta{font-size:13px;color:#555;padding:12px 8px;border-style:dashed}`;
document.head.appendChild(st);
pide();
})();
