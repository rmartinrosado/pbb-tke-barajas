/* ===== v445: HISTORIAL DE SOS (12/11/2026) =====
   · Cada SOS analizado (ACEPTAR) se guarda en el historial de este móvil: fecha y hora, PBB, avería en campo, alarma
     (lista, a mano o leída de la foto de la Magelis), primera actuación y actuación más eficaz que salieron.
   · Botón 🕘 «Historial» en la cabecera del SOS → listado de SOS, del más reciente al más antiguo.
   · En cada SOS: «Ver» lo vuelve a abrir y analizar; «Asociar a OT» lo enlaza con una OT abierta (primero las de su PBB):
     queda anotado en la Actuación de la OT y en el historial se ve el nº de OT; 🗑 lo borra del historial.
   Se guardan los últimos 100 SOS.
   v446: el historial se guarda en Supabase (tabla sos_historial) y lo ven todos los técnicos; el móvil guarda copia
   y, si no hay conexión, lo sube en cuanto la haya. ===== */
(function(){
"use strict";
const K="pbb_sos_hist",MAX=100;
const e_=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const lee=()=>{try{return JSON.parse(localStorage.getItem(K)||"[]")}catch(e){return[]}};
const graba=L=>{try{localStorage.setItem(K,JSON.stringify(L.slice(0,MAX)))}catch(e){}};
/* v446: copia compartida en Supabase */
const hayDB=()=>typeof sb!="undefined"&&sb&&typeof sb.from=="function";
async function sube(h){if(!hayDB())return false;try{const d=Object.assign({},h);delete d.pend;delete d.sync;
  const {error}=await sb.from("sos_historial").upsert({id:h.id,ts:h.ts,datos:d,updated_at:new Date().toISOString()});if(error)throw error;
  const L=lee();const x=L.find(y=>y.id==h.id);if(x){delete x.pend;x.sync=1;graba(L)}return true}catch(e){return false}}
async function borraDB(id){if(!hayDB())return;try{await sb.from("sos_historial").delete().eq("id",id)}catch(e){}}
async function baja(){if(!hayDB())return null;try{const {data,error}=await sb.from("sos_historial").select("id,ts,datos").order("ts",{ascending:false}).limit(MAX);
  if(error||!Array.isArray(data))return null;const R=data.map(r=>Object.assign({},r.datos||{},{id:r.id,ts:+r.ts,sync:1}));
  /* locales que faltan arriba: pendientes o anteriores a v446 → se suben; los ya subidos que faltan los borró otro técnico */
  const L=lee(),pend=L.filter(x=>!x.sync&&!R.some(y=>y.id==x.id));pend.forEach(sube);
  const M=[...pend,...R].sort((a,b)=>b.ts-a.ts).slice(0,MAX);graba(M);return M}catch(e){return null}}
const txt=el=>el?el.textContent.replace(/\s+/g," ").trim():"";
const fh=ts=>{const d=new Date(ts);return d.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"})+" "+d.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})};
const val=id=>((document.getElementById(id)||{}).value||"").replace(/\s+/g," ").trim();

/* ---------- 1 · guardar cada SOS analizado ---------- */
const oA=window.sosAnaliza;
if(typeof oA=="function")window.sosAnaliza=async function(){
 const pos=val("sr_p").toUpperCase(),ob=val("sr_ob");const sa=document.getElementById("sr_a");
 const alL=sa&&sa.value?sa.options[sa.selectedIndex].text:"",alM=val("sr_t");
 const r=await oA.apply(this,arguments);
 try{const res=document.getElementById("sr_res");if(!res||!res.textContent.trim()||window.__sosReabre)return r;
  const foto=window.__sosFotoAl||"";
  const b1=[...res.querySelectorAll(".ubb1 .pucab")].map(txt).filter(Boolean).slice(0,2).join(" · ")||(/no hay puente provisional ni reset/i.test(txt(res.querySelector(".ubb1 .gav")))?"Sin puente provisional ni reset":txt(res.querySelector(".ubb1 .gav")).slice(0,140));
  const b2=txt(res.querySelector(".ubb2 .lpaef h3"))||txt(res.querySelector(".ubb2 .gav")).slice(0,140);
  const h={id:"sos"+Date.now()+Math.random().toString(36).slice(2,6),ts:Date.now(),pos,ob,alL,alM,foto,b1,b2,ot:null,pend:1};const L=lee();L.unshift(h);graba(L);sube(h)}catch(e){}
 finally{window.__sosReabre=0}
 return r};

/* ---------- 2 · listado ---------- */
const otsAbiertas=()=>{try{return (typeof inc!="undefined"?inc:[]).filter(x=>x.estado=="abierta")}catch(e){return[]}};
function pinta(sinBajar){const c=document.getElementById("sheetc");if(!c)return;const L=lee();
 c.className="";c.innerHTML=`<div class="shh"><div class="sht">🕘 Historial de SOS</div><button type="button" class="shx" aria-label="Cerrar" onclick="closeSheet()">✕</button></div>
 <div class="shs">${L.length?`${L.length} SOS · compartido con todos los técnicos (los últimos ${MAX}).${sinBajar?"":" Actualizando…"}`:"Todavía no hay SOS guardados: cada vez que pulses ACEPTAR en el SOS se guarda aquí."}</div>
 <button type="button" class="pri shnew" onclick="sosRap()">🆘 Nuevo SOS</button>
 ${L.map(h=>`<div class="card shi" data-id="${e_(h.id)}">
  <div class="shl1"><b>${e_(fh(h.ts))}</b><span class="shpos">PBB ${e_(h.pos||"—")}</span>${h.ot?`<span class="shot">🔗 OT ${e_(h.ot.orden||h.ot.id)}</span>`:""}</div>
  ${h.ob?`<div class="shl"><span>Avería:</span> ${e_(h.ob)}</div>`:""}
  ${h.alL||h.alM?`<div class="shl"><span>Alarma:</span> ${e_([h.alL,h.alM].filter(Boolean).join(" · "))}</div>`:""}
  ${h.foto?`<div class="shl"><span>📷 Foto:</span> ${e_(h.foto)}</div>`:""}
  ${h.b1?`<div class="shl"><span>1 ·</span> ${e_(h.b1)}</div>`:""}
  ${h.b2?`<div class="shl"><span>⭐</span> ${e_(h.b2)}</div>`:""}
  <div class="shb"><button type="button" class="sec" data-sh="ver">👁 Ver</button><button type="button" class="sec" data-sh="ot">🔗 ${h.ot?"Cambiar OT":"Asociar a OT"}</button><button type="button" class="sec shdel" data-sh="del" aria-label="Borrar del historial">🗑</button></div>
  <div class="shsel"></div></div>`).join("")}`;
 c.scrollTop=0;const s=document.getElementById("sheet");if(s)s.style.display="flex";
 if(!sinBajar)baja().then(M=>{const c2=document.getElementById("sheetc");if(!c2||!c2.querySelector(".shh"))return;const y=c2.scrollTop;pinta(1);c2.scrollTop=y;
  if(!M){const t=c2.querySelector(".shs");if(t)t.textContent+=" Sin conexión: se muestran los de este móvil."}})}
window.sosHistorial=pinta;

/* ---------- 3 · acciones ---------- */
function reabre(h){sosRap();setTimeout(()=>{const set=(id,v)=>{const x=document.getElementById(id);if(x)x.value=v||""};
 set("sr_p",h.pos);set("sr_ob",h.ob);const sa=document.getElementById("sr_a");if(sa&&h.alL){const o=[...sa.options].find(x=>x.text==h.alL);if(o)sa.value=o.value}
 /* v447: la foto sigue siendo complementaria al reabrir (no pasa a «alarma a mano») */
 window.__sosFotoReabre=h.foto||"";const man=h.alM||"";if(man){set("sr_t",man);const d=document.querySelector("#sheetc details.srtx");if(d)d.open=true}
 window.__sosReabre=1;try{sosAnaliza()}catch(e){window.__sosReabre=0}},120)}
function selOT(box,h){const L=otsAbiertas();if(!L.length){box.innerHTML=`<div class="gav">No hay OT abiertas a las que asociar el SOS.</div>`;return}
 const p=String(h.pos||"").toUpperCase();L.sort((a,b)=>(String(b.pos).toUpperCase()==p)-(String(a.pos).toUpperCase()==p)||(b.ts||0)-(a.ts||0));
 box.innerHTML=`<select class="shot1"><option value="">— Elige la OT —</option>${L.map(o=>`<option value="${e_(o.id)}"${String(o.pos).toUpperCase()==p&&L.filter(x=>String(x.pos).toUpperCase()==p).length==1?" selected":""}>${String(o.pos).toUpperCase()==p?"★ ":""}PBB ${e_(o.pos)} · ${e_(o.tipo||"")} · OT ${e_(o.orden||"s/n")} · ${e_(String(o.desc||"").slice(0,40))}</option>`).join("")}</select>
 <button type="button" class="pri" data-sh="okot">Asociar</button>`}
function asocia(h,otId){const ot=otsAbiertas().find(x=>String(x.id)==String(otId));if(!ot){msg("Elige una OT");return false}
 const lin=[`🆘 SOS ${fh(h.ts)}`,h.ob&&`Avería: ${h.ob}`,(h.alL||h.alM)&&`Alarma: ${[h.alL,h.alM].filter(Boolean).join(" · ")}`,h.foto&&`Foto Magelis: ${h.foto}`,h.b1&&`1ª actuación: ${h.b1}`,h.b2&&`Actuación más eficaz: ${h.b2}`].filter(Boolean).join(" · ");
 ot.act=((ot.act||"").trim()?ot.act.trim()+"\n":"")+lin;(ot.sos=ot.sos||[]).push({id:h.id,ts:h.ts,ob:h.ob,al:[h.alL,h.alM,h.foto].filter(Boolean).join(" · "),b1:h.b1,b2:h.b2});
 try{sv("pbb_inc",inc)}catch(e){}try{render()}catch(e){}
 const L=lee();const x=L.find(y=>y.id==h.id);if(x){x.ot={id:ot.id,orden:ot.orden||"",pos:ot.pos};x.pend=1;graba(L);sube(x)}
 msg(`SOS asociado a la OT ${ot.orden||""} (PBB ${ot.pos}) y anotado en su Actuación`);return true}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#sheetc .shi [data-sh]");if(!b)return;e.preventDefault();e.stopPropagation();
 const it=b.closest(".shi"),L=lee(),h=L.find(x=>x.id==it.dataset.id);if(!h)return;const a=b.dataset.sh;
 if(a=="ver")reabre(h);
 else if(a=="ot")selOT(it.querySelector(".shsel"),h);
 else if(a=="okot"){const s=it.querySelector(".shot1");if(s&&asocia(h,s.value))pinta(1)}
 else if(a=="del"){if(!confirm("¿Borrar este SOS del historial?"))return;graba(L.filter(x=>x.id!=h.id));borraDB(h.id);pinta(1)}},true);

/* ---------- 4 · botón 🕘 en la cabecera del SOS ---------- */
const oR=window.sosRap;if(typeof oR=="function")window.sosRap=function(){const r=oR.apply(this,arguments);try{
 const t=document.querySelector("#sheetc .sosct");if(t&&!t.querySelector(".soshb")){const x=t.querySelector(".soscx");
  const b=document.createElement("button");b.type="button";b.className="soshb";b.setAttribute("aria-label","Historial de SOS");b.innerHTML="🕘<small>Historial</small>";
  b.onclick=()=>pinta();t.insertBefore(b,x||null)}}catch(e){}return r};
const st=document.createElement("style");st.textContent=`
#sheetc .soshb{flex:none;width:auto!important;height:36px;margin:0!important;padding:0 8px!important;border-radius:9px;display:flex;align-items:center;gap:3px;font-size:16px;background:transparent;border:1.5px solid #1fa64a;color:#1fa64a;font-weight:800}
#sheetc .soshb small{font-size:11px}
#sheetc .shh{display:flex;align-items:center;gap:8px;margin-bottom:4px}#sheetc .sht{flex:1;font-weight:900;font-size:18px;color:#1fa64a}
#sheetc .shx{flex:none;width:36px!important;height:36px;margin:0!important;padding:0!important;border-radius:9px;font-size:18px;font-weight:800;background:transparent;border:1.5px solid var(--bd,#999);color:var(--tx,#111)}
#sheetc .shs{font-size:12px;opacity:.8;margin-bottom:6px}#sheetc .shnew{width:100%;margin:0 0 8px!important;padding:10px!important}
#sheetc .shi{padding:8px 10px!important;margin:0 0 8px!important;font-size:13px;border-left:4px solid #d7191c!important}
#sheetc .shl1{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:3px}#sheetc .shpos{font-weight:800;color:#d7191c}
#sheetc .shot{font-weight:800;color:#1fa64a;font-size:12px}#sheetc .shl{margin:1px 0;line-height:1.3}#sheetc .shl>span{font-weight:800;opacity:.8}
#sheetc .shb{display:flex;gap:6px;margin-top:6px}#sheetc .shb button{flex:1;margin:0!important;padding:7px 4px!important;font-size:12.5px}#sheetc .shb .shdel{flex:0 0 44px}
#sheetc .shsel{display:flex;flex-direction:column;gap:6px}#sheetc .shsel:not(:empty){margin-top:6px}#sheetc .shsel select{width:100%;font-size:14px;padding:7px}#sheetc .shsel button{margin:0!important}`;
document.head.appendChild(st);
})();
