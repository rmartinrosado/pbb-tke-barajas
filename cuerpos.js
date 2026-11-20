/* ===== v626: MODELO DE PBB POR CUERPOS (2 o 3 túneles) en las OT de ANTIATRAPAMIENTO =====
   · PBB de 2 cuerpos (túneles A-B): solo hay antiatrapamiento del túnel INTERIOR (IT-…, E-A9 5.1 / 6.1).
   · PBB de 3 cuerpos (túneles A-B-C): además el del túnel MEDIO (MT-…, E-A9 2.1 / 8.1).
   En la primera actuación (la primera caja roja: puente, seguridades o actuación guiada) se indica el modelo de la PBB y
   la resolución sale SOLO la que corresponde a ese modelo:
     2 cuerpos → nunca túnel medio (se ocultan sus pasos, componentes y entradas).
     3 cuerpos sin decir túnel → interior y medio; si el aviso dice el túnel, solo ese.
   Modelo sin definir → se muestran las dos y se avisa para dejarlo fijado.
   La lista de PBB de 3 cuerpos va en PBB3 (las que no están, 2 cuerpos cuando la lista esté completa: LISTA_OK). ===== */
(function(){
"use strict";
/* PBB de 3 cuerpos conocidas por los esquemas (504: barreras túnel medio · 507: esquema T87911031230ES con túnel medio) */
const PBB3=new Set(["504","507"]);
const PBB2=new Set([]);
const LISTA_OK=false; /* true cuando PBB3 tenga TODAS las de 3 cuerpos: el resto pasa a 2 cuerpos */
window.pbbCuerpos=function(pos){pos=String(pos||"").trim();if(!pos)return null;if(PBB3.has(pos))return 3;if(PBB2.has(pos))return 2;return LISTA_OK?2:null};

const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const ES_AA=/antiatrap|atrapamiento|barrera optica/;
const txt=i=>nrm([i&&i.desc,i&&i.def,i&&i.com,i&&i.obs,i&&i.alarma].filter(Boolean).join(" "));
const otAct=()=>{try{return (typeof gOT!="undefined"&&gOT&&Array.isArray(inc))?inc.find(x=>x.id==gOT):null}catch(e){return null}};
/* qué túneles corresponden: {int,med} */
window.pbbAATuneles=function(i){const t=txt(i);const nc=pbbCuerpos(i&&i.pos);
 const dMed=/medio|\bb-?c\b/.test(t),dInt=/interior|\ba-?b\b/.test(t);
 if(nc==2)return{int:true,med:false,nc,incoh:dMed&&!dInt};
 if(nc==3){if(dMed&&!dInt)return{int:false,med:true,nc};if(dInt&&!dMed)return{int:true,med:false,nc};return{int:true,med:true,nc}}
 return{int:dInt||!dMed,med:dMed,nc:null}};

/* --- senOT: entradas E-A9 de antiatrapamiento según el modelo --- */
if(typeof senOT=="function"){const o=senOT;senOT=window.senOT=function(t,pos){const out=o(t,pos);try{
 const T=nrm(t);if(!ES_AA.test(T))return out;const nc=pbbCuerpos(pos);if(!nc)return out;
 const izq=/\bizq|\bizda|izquierd/.test(T),dch=/\bdch|\bdrch|\bdcha|derech/.test(T);
 const tu=pbbAATuneles({pos,desc:T});const MED=new Set(["2.1","8.1"]),INT=new Set(["5.1","6.1"]);
 let r=out.filter(x=>x[0]!="E-A9"||(MED.has(x[1])?tu.med:INT.has(x[1])?tu.int:true));
 const has=k=>r.some(x=>x[0]=="E-A9"&&x[1]==k);
 const BASE={"2.1":["E-A9","2.1","2.2","MT-S3 / MT-B1","Antiatrapamiento túnel medio izquierdo"],"8.1":["E-A9","8.1","8.2","MT-S3' / MT-B2","Antiatrapamiento túnel medio derecho"],
  "5.1":["E-A9","5.1","5.2","IT-S3 / IT-B1","Antiatrapamiento túnel interior izquierdo"],"6.1":["E-A9","6.1","6.2","IT-S3' / IT-B2","Antiatrapamiento túnel interior derecho"]};
 const pon=k=>{if(!has(k))r.push(BASE[k].slice())};
 if(tu.med){if(izq||!dch)pon("2.1");if(dch||!izq)pon("8.1")}
 if(tu.int){if(izq||!dch)pon("5.1");if(dch||!izq)pon("6.1")}
 return r}catch(e){return out}}}

/* --- aviso del modelo en la primera actuación + ocultar lo del túnel medio en PBB de 2 cuerpos --- */
const st=document.createElement("style");st.textContent=`
.pbbcu{margin:6px 0 8px;padding:8px 10px;border-radius:9px;border:2px solid #2e9e44;background:color-mix(in srgb,#2e9e44 14%,var(--card,#fff));font-size:13.5px;line-height:1.35}
.pbbcu b.cun{display:inline-block;padding:1px 8px;margin-right:6px;border-radius:6px;background:#2e9e44;color:#fff;font-size:14.5px}
.pbbcu.sin{border-color:#f59e0b;background:color-mix(in srgb,#f59e0b 14%,var(--card,#fff))}.pbbcu.sin b.cun{background:#f59e0b;color:#000}
.pbbcu .cuw{display:block;margin-top:4px;color:#c62828;font-weight:800}
.pbbcuoc{display:none!important}`;document.head.appendChild(st);
const banner=i=>{const tu=pbbAATuneles(i),nc=tu.nc;
 if(!nc)return`<div class="pbbcu sin"><b class="cun">${i.pos&&i.pos!="—"?"PBB "+i.pos+" · modelo":"PBB sin indicar · modelo"} sin definir</b>Antiatrapamiento: se muestran túnel interior (2 cuerpos) y túnel medio (3 cuerpos). Comprueba en campo si la PBB tiene 2 o 3 cuerpos y avisa al administrador para dejarlo fijado.</div>`;
 const q=nc==2?"Túneles A-B: solo antiatrapamiento del túnel INTERIOR (IT-S3 · E-A9 5.1 / 6.1).":
  `Túneles A-B-C: ${tu.int&&tu.med?"túnel INTERIOR (E-A9 5.1 / 6.1) y túnel MEDIO (MT-S3 · E-A9 2.1 / 8.1)":tu.med?"solo túnel MEDIO (MT-S3 · E-A9 2.1 / 8.1), el que dice el aviso":"solo túnel INTERIOR (E-A9 5.1 / 6.1), el que dice el aviso"}.`;
 return`<div class="pbbcu"><b class="cun">PBB ${i.pos} · ${nc} cuerpos</b>${q}${tu.incoh?`<span class="cuw">⚠️ El aviso habla del túnel medio y esta PBB es de 2 cuerpos: no tiene túnel medio. Es el antiatrapamiento del túnel interior.</span>`:""}</div>`};
const RXMED=/tunel medio|3 tuneles|tres tuneles|\bmt-?s3|\bmt-?b[123]\b|\(b-?c\)/;
const RXINT=/tunel interior|\bit-?s3|\bit-?b[125]\b|\(a-?b\)/;
const SEL="details,li,.puit,.pcip,.pcicx,.pcifo,.pcifs,tr,.gst,.gpaso,.anass>button,.chkb,option";
function oculta(i,raiz,sel){const tu=pbbAATuneles(i);if(!tu.nc)return;const quitaMed=!tu.med,quitaInt=!tu.int;if(!quitaMed&&!quitaInt)return;
 raiz=raiz||"#app";sel=sel||SEL;
 document.querySelectorAll(sel.split(",").map(x=>raiz+" "+x).join(",")).forEach(el=>{if(el.classList.contains("pbbcuoc"))return;
  const s=el.tagName=="DETAILS"?((el.querySelector(":scope>summary")||{}).textContent||""):(el.textContent||"");if(s.length>700)return;
  const n=nrm(s);if(!/antiatrap|atrapamiento|barrera|tunel|mt-|it-|e-a9/.test(n))return;
  const m=RXMED.test(n),k=RXINT.test(n);
  if((quitaMed&&m&&!k)||(quitaInt&&k&&!m))el.classList.add("pbbcuoc")})}
/* v628: también en el SOS (hoja con #sr_res): franja en «1 · SACAR EN SERVICIO YA» con la posición de #sr_p */
function pintaSOS(){try{const res=document.getElementById("sr_res");if(!res)return;
 const g=id=>((document.getElementById(id)||{}).value||"");const sa=document.getElementById("sr_a");
 const i={pos:g("sr_p").trim().toUpperCase(),desc:[g("sr_ob"),sa&&sa.value?sa.options[sa.selectedIndex].text:"",g("sr_t")].filter(Boolean).join(" · ")};
 const caja=res.querySelector(".ubb1")||(res.firstElementChild&&res.children.length>1?res:null);
 const viejo=res.querySelector(".pbbcu");
 if(!caja||!ES_AA.test(txt(i))){if(viejo)viejo.remove();res.querySelectorAll(".pbbcuoc").forEach(e=>e.classList.remove("pbbcuoc"));return}
 if(!i.pos){i.pos="—"}
 const h=banner(i);if(!viejo||viejo.dataset.h!==h||viejo.parentNode!==caja){if(viejo)viejo.remove();const w=document.createElement("div");w.innerHTML=h;const b=w.firstElementChild;b.dataset.h=h;caja.prepend(b)}
 oculta(i,"#sr_res","div,li,details,p,tr,figure,.puit,.lpap")}catch(e){}}
function pinta(){pintaSOS();try{if(typeof view=="undefined"||view!="tec")return;const i=otAct();
 document.querySelectorAll(".pbbcu").forEach(b=>{if(!i||!ES_AA.test(txt(i)))b.remove()});
 if(!i||i.estado=="cerrada"||!ES_AA.test(txt(i))){document.querySelectorAll(".pbbcuoc").forEach(e=>e.classList.remove("pbbcuoc"));return}
 const cajas=["gpte","gsegl","gcomp"].map(id=>document.getElementById(id)).filter(x=>x&&x.isConnected)
  .sort((a,b)=>a.compareDocumentPosition(b)&4?-1:1);
 const prim=cajas[0];const h=banner(i);
 cajas.forEach(c=>{const b=c.querySelector(":scope>.pbbcu");if(c!==prim&&b)b.remove()});
 if(prim){let b=prim.querySelector(":scope>.pbbcu");if(!b||b.dataset.h!==h){if(b)b.remove();const w=document.createElement("div");w.innerHTML=h;b=w.firstElementChild;b.dataset.h=h;
  const cab=prim.querySelector(":scope>.pucab");if(cab)cab.insertAdjacentElement("afterend",b);else prim.prepend(b)}}
 oculta(i)}catch(e){}}
let tm=null;new MutationObserver(()=>{if(tm)return;tm=setTimeout(()=>{tm=null;pinta()},200)}).observe(document.documentElement,{childList:true,subtree:true});
if(typeof vTec=="function"){const o=vTec;vTec=function(){const r=o.apply(this,arguments);setTimeout(pinta,0);return r}}
})();
