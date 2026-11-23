/* ===== v630: SEGUIMIENTO OT · resumen visible con la tarjeta PLEGADA =====
   Debajo de la primera línea, dos renglones centrados, cada uno en UNA sola línea (lo que no cabe se corta con «…»):
   · 1º: ⏱ tiempo en vivo (abierta: desde el inicio; ámbar a partir del tiempo de llegada, rojo pasado el doble · cerrada:
         duración inicio → cierre) · Nº de orden CGA · terminal.
   · 2º (solo si hay algo): 🔌 puente puesto (anotado en Actuación y sin retirar, parpadea) · 🔁 reincidencias en 30 días ·
         📏 medidas tomadas (✗ las fuera de rango) · 📄 resolución IA. ===== */
(function(){
"use strict";
const E=s=>typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const st=document.createElement("style");st.textContent=`
.ot .otres{display:flex;flex-direction:column;align-items:center;gap:4px;margin:6px 0 2px;min-width:0;width:100%}
.ot .otres .orl{display:flex;justify-content:center;align-items:center;gap:6px;flex-wrap:nowrap;max-width:100%;min-width:0;overflow:hidden;white-space:nowrap}
.ot .otres .orc{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:700;line-height:1.2;
 padding:3px 8px;border-radius:999px;border:1px solid color-mix(in srgb,var(--mu,#888) 45%,transparent);background:color-mix(in srgb,var(--mu,#888) 10%,transparent)}
.ot .otres .orc.t{font-size:13.5px;font-weight:800}
.ot .otres .orc.tw{border-color:#f59e0b;background:color-mix(in srgb,#f59e0b 18%,transparent);color:#f59e0b}
.ot .otres .orc.tx{border-color:#ef4444;background:color-mix(in srgb,#ef4444 18%,transparent);color:#ef4444}
.ot .otres .orc.pte{border-color:#ef4444;background:#c62828;color:#fff;animation:orpte 1.6s ease-in-out infinite}
.ot .otres .orc.rnc{border-color:#a855f7;color:#c084fc;background:color-mix(in srgb,#a855f7 15%,transparent)}
.ot .otres .orc.med{border-color:#2e9e44;color:#4ade80;background:color-mix(in srgb,#2e9e44 15%,transparent)}
.ot .otres .orc.medx{border-color:#ef4444;color:#f87171;background:color-mix(in srgb,#ef4444 12%,transparent)}
@keyframes orpte{50%{opacity:.55}}
/* plegada: la descripción en una sola línea (al desplegar se ve entera) */
.card.ot:not(.oab)>.row.ohdx>.ohdesc{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;min-width:0;display:block!important;-webkit-line-clamp:unset!important}
:root[data-theme=light] .ot .otres .orc.rnc{color:#7e22ce}:root[data-theme=light] .ot .otres .orc.med{color:#166534}`;
document.head.appendChild(st);
const LLEG={PAS:10,HZ:15,AAA:15,AAP:15,SVGA:15,Sigma:15};
const llegMin=i=>{const t=[i.tipo,...(i.equipos||[])].map(k=>LLEG[k]).filter(Boolean);return t.length?Math.min(...t):15};
const hm=h=>{const m=String(h||"").match(/(\d{1,2}):(\d{2})/);return m?+m[1]*60+ +m[2]:null};
function inicio(i){const f=String(i.fecha||"").slice(0,10),h=hm(i.hIni);
 if(/^\d{4}-\d\d-\d\d$/.test(f)&&h!=null){const d=new Date(f+"T00:00");d.setMinutes(h);if(!isNaN(d))return +d}
 const c=+i.id;return isFinite(c)&&c>1e12?c:null}
const dur=m=>m<60?`${m} min`:m<1440?`${Math.floor(m/60)} h ${String(m%60).padStart(2,"0")}`:`${Math.floor(m/1440)} d ${Math.floor(m%1440/60)} h`;
function tiempo(i){
 if(i.estado!="abierta"){const a=hm(i.hIni),c=hm(i.hCie);if(a==null||c==null)return null;let m=c-a;if(m<0)m+=1440;return{t:`⏱ ${dur(m)} en total`,c:""}}
 const t0=inicio(i);if(t0==null)return null;const m=Math.max(0,Math.floor((Date.now()-t0)/60000));const L=llegMin(i);
 const c=!i.hLle&&!i.espera?(m>=2*L?"tx":m>=L?"tw":""):"";
 return{t:`⏱ ${dur(m)}${i.espera?" · en espera":i.hLle?"":" sin llegada"}`,c}}
function puente(i){const a=nrm(i.act||"");if(!/puente/.test(a))return false;
 const k=a.lastIndexOf("puente");const tras=a.slice(k);return !/(retir|quit|elimin|desmont)/.test(tras)}
function chips(i){const out=[];
 if(i.estado=="abierta"&&puente(i))out.push(`<span class="orc pte">🔌 Puente puesto</span>`);
 try{if(typeof reincidencias=="function"){const n=reincidencias(i.pos,i.desc,i.id,30).length;if(n)out.push(`<span class="orc rnc">🔁 ${n+1}ª en 30 días</span>`)}}catch(e){}
 const M=Array.isArray(i.medidas)?i.medidas:[];if(M.length){const x=M.filter(m=>m&&m.ok===false).length;out.push(`<span class="orc ${x?"medx":"med"}">📏 ${M.length} medida${M.length>1?"s":""}${x?` · ${x} ✗`:""}</span>`)}
 if(i.resClaude&&String(i.resClaude.txt||"").trim())out.push(`<span class="orc">📄 IA</span>`);
 return out}
function html(i){const T=tiempo(i);const ord=String(i.orden||"").trim();
 let ter="";try{ter=typeof termDe=="function"?termDe(i.pos):""}catch(e){}
 const l1=[T?`<span class="orc t ${T.c}" data-ort="1">${E(T.t)}</span>`:"",ord&&!/^sos$/i.test(ord)?`<span class="orc">Nº ${E(ord)}</span>`:"",ter?`<span class="orc">${E(ter)}</span>`:""].filter(Boolean);
 const l2=chips(i);
 return `${l1.length?`<div class="orl">${l1.join("")}</div>`:""}${l2.length?`<div class="orl">${l2.join("")}</div>`:""}`}
function pinta(){try{if(!SEGV()||typeof inc=="undefined")return;
 document.querySelectorAll("#app .card.ot[data-oid]").forEach(c=>{const hd=c.querySelector(":scope>.ohd");if(!hd)return;
  const i=inc.find(x=>String(x.id)==c.dataset.oid);if(!i)return;const h=html(i);
  let r=c.querySelector(":scope>.otres");
  if(!h){if(r)r.remove();return}
  if(!r){r=document.createElement("div");r.className="otres";hd.insertAdjacentElement("afterend",r);
   r.addEventListener("click",e=>{e.stopPropagation();hd.click()})}
  if(r.dataset.h===h)return;
  /* v749: cada minuto solo cambia el reloj: se actualiza ese texto sin rehacer la fila. Antes se rehacía entera y se
     perdían el SOS y la llave que card-ot.js coloca en ella → el SOS desaparecía y la pantalla parpadeaba. */
  const sinT=x=>x.replace(/<span class="orc t[^"]*" data-ort="1">[^<]*<\/span>/,"");
  const tN=/<span class="orc t([^"]*)" data-ort="1">([^<]*)<\/span>/.exec(h),tv=r.querySelector('[data-ort="1"]');
  if(r.dataset.h&&sinT(r.dataset.h)===sinT(h)&&tN&&tv){const tx=tN[2].replace(/&amp;/g,"&");if(tv.textContent!==tx)tv.textContent=tx;const cl="orc t"+tN[1];if(tv.className!==cl)tv.className=cl;r.dataset.h=h;return}
  /* si cambia algo más, se rehace pero se conservan el SOS y la llave */
  const keep=[...r.querySelectorAll(".sosc,.pactt,.grepc")];r.innerHTML=h;r.dataset.h=h;
  const o1=r.querySelector(".orl");if(o1)keep.forEach(x=>{if(x.classList.contains("grepc"))o1.append(x)});keep.filter(x=>!x.classList.contains("grepc")).reverse().forEach(x=>o1.prepend(x));
  if(o1)o1.classList.toggle("orlsos",!!o1.querySelector(".sosc,.pactt"))})}catch(e){}}
let tm=null;new MutationObserver(()=>{if(tm)return;tm=setTimeout(()=>{tm=null;pinta()},150)}).observe(document.body,{childList:true,subtree:true});
setInterval(pinta,30000);
})();
