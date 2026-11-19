/* ===== v586: PRIMERA ACTUACIÓN INTEGRAL · COMPROBACIÓN EN CAMPO POR ORDEN DE PRIORIDAD (18/11/2026) =====
   Al analizar una OT de aviso, la app coteja TODO lo que tiene la PWA y lo pone en la primera actuación:
   · Alarmas, advertencias y eventos del PLC (manual RCS / Magelis) que salen en el aviso, la definición, el comentario,
     las observaciones o la foto de la Magelis: qué significan y qué hacer.
   · Componentes de campo relacionados: por su código en el aviso, por las alarmas (ficha o cotejo automático) y por el texto.
     De cada uno: ubicación, por qué se relaciona y sus pasos de «Medir en campo» (con casilla 📏 de medida).
   · Reincidencias de esa PBB (90 días) y lo que se hizo; medidas ya tomadas en la OT (las fuera de rango suben de prioridad).
   Las actuaciones se INDEXAN POR PRIORIDAD (lo que más datos cruza y lo más rápido de comprobar primero) para atajar la avería.
   · Si NO hay puente provisional (ni límite / seguridades, hidráulica o manguera 400 Hz): es la PRIMERA ACTUACIÓN EN CAMPO
     (caja roja parpadeando, primera de la guía) y la tarjeta de la OT lo marca con la franja 🔎.
   · Si hay puente provisional: va justo debajo, como «2º · tras sacar la PBB». ===== */
(function(){
"use strict";
const E=s=>typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const key=c=>String(c.baseId||c.db||c.id);
const COMPS=()=>window.COMP_CAMPO||[];
const fh=f=>{const m=String(f||"").match(/^(\d{4})-(\d\d)-(\d\d)/);return m?`${m[3]}/${m[2]}`:String(f||"")};
const PUENTE=["gpte","gsegl","ghidr","gm400"];
const hayPuente=()=>PUENTE.some(id=>document.getElementById(id));
const FN={A:["🔴",0],W:["🟡",1],R:["🔵",2]};
const textoOT=i=>[i.desc,i.def,i.com,i.obs,i.alarma,i.alarmas&&(typeof i.alarmas=="string"?i.alarmas:JSON.stringify(i.alarmas).replace(/[{}\[\]"]/g," "))].filter(Boolean).join(" · ");
const idsDe=c=>String(c.id||"").split(/\s*(?:\/|,|\+|\by\b)\s*/).map(x=>x.replace(/^ACOPL\.?\s*/i,"").trim()).filter(x=>/[A-Z]-?[A-Z]*\d/i.test(x));
const reCod=id=>new RegExp("(^|[^A-Z0-9])"+String(id).toUpperCase().replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/-/g,"-?")+"(?![0-9]|\\.[0-9])");
const PAL_VAC=new Set("para pero como esta este desde hasta sobre entre cuando donde porque tiene hace solo otra otro cada todo muy mas menos tambien pbb pasarela posicion activado activada fallo falla aviso del con sin por una uno que los las".split(" "));
const pals=t=>nrm(t).split(/[^a-z0-9]+/).filter(w=>w.length>=5&&!PAL_VAC.has(w)).map(w=>w.slice(0,7));

/* ---------- cotejo ---------- */
const CACHE=new Map();
function plan(i){if(!i)return null;const T=textoOT(i);const ck=i.id+"|"+T+"|"+JSON.stringify(i.medidas||[]).length+"|"+COMPS().length;
 if(CACHE.has(ck))return CACHE.get(ck);
 /* 1) alarmas / eventos del PLC */
 let AL=[];try{AL=(typeof rcsDetecta=="function"?rcsDetecta(T):[]).map(o=>({x:o.x,por:o.por}))}catch(e){}
 AL.sort((a,b)=>(a.por=="num"?0:1)-(b.por=="num"?0:1)||(FN[a.x.f]||[0,3])[1]-(FN[b.x.f]||[0,3])[1]);
 /* 2) componentes relacionados con su puntuación y motivos */
 const M=new Map();const suma=(c,p,por)=>{if(!c)return;const k=key(c);const o=M.get(k)||{c,p:0,por:[]};o.p+=p;if(!o.por.includes(por))o.por.push(por);M.set(k,o)};
 const TU=String(T).toUpperCase();
 COMPS().forEach(c=>{if(idsDe(c).some(id=>reCod(id).test(TU)))suma(c,6,"código en el aviso")});
 AL.forEach(a=>{try{(typeof compDeAlarma=="function"?compDeAlarma(a.x):[]).forEach(c=>suma(c,a.por=="num"?5:3,"alarma "+a.x.c))}catch(e){}});
 try{(typeof compCampo=="function"?compCampo(T):[]).forEach(c=>suma(c,3,"texto del aviso"))}catch(e){}
 /* 3) reincidencias de la PBB (90 días) */
 let RE=[];try{RE=typeof reincidencias=="function"?reincidencias(i.pos,i.desc,i.id,90):[]}catch(e){}
 RE.forEach(r=>{const tx=[r.act,r.desc,r.obs].filter(Boolean).join(" ");const TX=tx.toUpperCase();const pw=new Set(pals(tx));
  M.forEach(o=>{if(idsDe(o.c).some(id=>reCod(id).test(TX))||pals(o.c.t).filter(w=>pw.has(w)).length>=2){o.p+=2;const s="reincidencia "+fh(r.fecha);if(!o.por.includes(s))o.por.push(s)}})});
 /* 4) medidas ya tomadas en la OT: las fuera de rango suben de prioridad */
 const MD=(i.medidas||[]);
 M.forEach(o=>{(o.c.med||[]).forEach(st=>{const m=MD.find(x=>x.paso&&String(st).slice(0,60)==String(x.paso).slice(0,60));if(m){if(!m.ok){o.p+=4;if(!o.por.includes("medida fuera de rango"))o.por.push("medida fuera de rango")}else o.ok=(o.ok||0)+1}})});
 /* v591: en un FALLO DE MEDIDA ANALÓGICA solo entran los componentes de la cadena de medida (sensor, potenciómetro,
    acoplamiento, convertidor, láser…) o los citados por código: fuera relés de iluminación, motores o guardamotores de giro. */
 if(/medida analog|fallo (de )?(la )?medida|medidor|4-?20 ?ma|potenciometro|encoder|ultrason/.test(nrm(T))){const CAD=/medid|analog|potenciom|convertidor|4-?20|encoder|laser|ultrason|acoplamiento|inclinom|transductor/;
  M.forEach((o,k)=>{if(o.por.includes("código en el aviso"))return;const c=o.c;if(!CAD.test(nrm([c.id,c.t,c.fab,c.claves].join(" "))))M.delete(k)})}
 const CP=[...M.values()].sort((a,b)=>b.p-a.p||(b.por.length-a.por.length)||String(a.c.id).localeCompare(String(b.c.id),"es",{numeric:true})).slice(0,6);
 const r={AL,CP,RE:RE.filter(x=>x.act||x.estado=="cerrada").slice(0,3),MD,n:AL.length+CP.length+RE.length+MD.length};
 CACHE.set(ck,r);if(CACHE.size>200)CACHE.delete(CACHE.keys().next().value);return r}
window.pciPlan=plan;

/* v594: FOTOS DEL COMPONENTE incrustadas en cada paso de la actuación guiada, para localizarlo rápido:
   las vistas del componente (con su código en el pie) y su foto de ubicación; toque → pantalla completa.
   En los pasos de alarma/evento, las del primer componente con ficha que cite el texto (➜ actuación o la pregunta). */
const NC=t=>String(t||"").toUpperCase().replace(/\s+/g,"");
const RX=/\b([A-Z]{1,3}\d?-[A-Z]{1,2}\d+(?:\.\d+)?)/g;
const cods=id=>String(id||"").split(/\s*(?:\/|,|\+|\by\b)\s*/).map(NC).filter(Boolean);
const fo=f=>Array.isArray(f)?{src:f[0],v:String(f[1]||"")}:{src:(f||{}).src,v:String((f||{}).vista||"")};
const esUbi=f=>/^ubicaci/i.test(f.v);
const PEND=new Set();
function asegura(c){if(!c||!c._fp||typeof compFotosAsegura!="function"||PEND.has(c))return;PEND.add(c);
 compFotosAsegura(c).then(()=>{PEND.delete(c);c._fp=false;pinta()}).catch(()=>PEND.delete(c))}
function fichaDe(t){const L0=window.COMP_CAMPO||[];let m;RX.lastIndex=0;const vis=new Set();t=String(t||"");
 while((m=RX.exec(t))){let cd=NC(m[1]);if(vis.has(cd))continue;vis.add(cd);
  let r=[];for(const k of [cd,cd.replace(/\./g,""),cd.replace(/\.\d+$/,"")]){r=L0.filter(c=>cods(c.id).map(x=>x.replace(/\./g,"")).includes(k.replace(/\./g,"")));if(r.length)break}
  r=r.filter(c=>c._fp||(c.fotos||[]).length);if(r.length)return r[0]}return null}
function fotos(c){if(!c)return"";if(c._fp){asegura(c);return`<div class="pcifw">⏳ Cargando las fotos de ${E(c.id)}…</div>`}
 const F=(c.fotos||[]).map((f,i)=>Object.assign(fo(f),{i})).filter(f=>f.src);if(!F.length)return"";
 const cp=F.filter(f=>!esUbi(f)).slice(0,cods(c.id).length>1?4:2),ub=F.find(esUbi);const T=cp.concat(ub?[ub]:[]);
 const all=E(JSON.stringify(T.map(f=>f.src)));
 return`<div class="pcifs">${T.map(f=>{const u=esUbi(f);const cf=!u&&typeof compCodFoto=="function"?compCodFoto(c,f.i):"";
  const pie=u?`📍 <b>Ubicación</b>`:`<b>${E(cf||c.id)}</b><small>${E(cf?"Vista componente":String(f.v).replace(/\s*·.*$/,"")||"Vista componente")}</small>`;
  return`<figure class="pcifo${u?" pciub":""}" onclick="event.stopPropagation();if(typeof compVer=='function')compVer('${E(f.src)}',${all})"><img src="${E(f.src)}" alt="${E(c.id)}" loading="lazy"><figcaption>${pie}</figcaption></figure>`}).join("")}</div>`}
/* ---------- caja ---------- */
function html(i,P,segundo){const G=window.RCS_G||{};let n=0;const paso=(ic,tit,cuerpo,cls)=>`<div class="pcip${cls?" "+cls:""}"><div class="pcin">${++n}</div><div class="pcic"><div class="pcitt">${ic} ${tit}</div>${cuerpo||""}</div></div>`;
 const cot=[P.AL.length&&`${P.AL.length} alarma${P.AL.length>1?"s":""}/evento${P.AL.length>1?"s":""}`,P.CP.length&&`${P.CP.length} componente${P.CP.length>1?"s":""}`,P.RE.length&&`${P.RE.length} reincidencia${P.RE.length>1?"s":""}`,P.MD.length&&`${P.MD.length} medida${P.MD.length>1?"s":""}`].filter(Boolean).join(" · ");
 let h=`<div class="pucab">🔎 ${segundo?"2 · ACTUACIÓN GUIADA · tras el puente provisional (1)":"1 · PRIMERA ACTUACIÓN EN CAMPO · ACTUACIÓN GUIADA"}</div>
 <div class="pcisub">Por orden de prioridad para atajar la avería${cot?` · cotejo: ${cot}`:""}</div>`;
 /* alarmas */
 if(!P.AL.length)h+=paso("📟","Leer la Magelis: ESTADO DE ALARMAS y eventos",`<div class="mu">Anota el código en la OT (Observaciones o foto de la Magelis): acota el componente y reordena esta lista.</div>`);
 P.AL.forEach(a=>{const x=a.x,g=G[x.g]||{};h+=paso((FN[x.f]||["⚪"])[0],`<b>${E(x.c)}</b> ${E(x.t)}${a.por=="num"?"":` <span class="pcitag">por el texto</span>`}`,
  `${g.q?`<div class="pciq">${E(g.q)}</div>`:""}${g.a?`<div class="pcia">➜ ${E(g.a)}</div>`:""}${fotos(fichaDe((g.a||"")+" "+(g.q||"")))}`)});
 /* componentes */
 P.CP.forEach((o,j)=>{const c=o.c;const u=typeof compUbiDe=="function"?compUbiDe(c):"";
  h+=paso("🔩",`<span class="cmpid">${E(c.id)}</span><span class="pcitx">${E(c.t)}</span>`,
  `${u?`<div class="pciu">📍 ${E(u)}</div>`:""}${fotos(c)}<div class="pcipor">Relacionado por: ${o.por.map(E).join(" · ")}${o.ok?` · ${o.ok} medida${o.ok>1?"s":""} correcta${o.ok>1?"s":""}`:""}</div>
   ${(c.med||[]).length?`<div class="pcimt">📏 Medir en campo</div><ol class="cmpo">${c.med.map(x=>`<li>${E(x)}</li>`).join("")}</ol>`:""}
   ${c.av?`<div class="gav">⚠️ ${E(c.av)}</div>`:""}
   <button type="button" class="sec pcib" onclick="event.stopPropagation();pciFicha('${E(key(c)).replace(/'/g,"\\'")}')">🔩 Ver ficha completa (fotos, conexionado)</button>`,j==0?"pci1":"")});
 /* reincidencias */
 if(P.RE.length)h+=paso("🔁","Reincidencias en esta PBB (90 días): lo que se hizo",P.RE.map(r=>`<div class="pcire"><b>${E(fh(r.fecha))}</b> · ${E(r.desc||"")}${r.act?`<div>✔ ${E(String(r.act).slice(0,240))}</div>`:""}</div>`).join("")+`<div class="mu">Si se repite, atacar la causa de fondo (ajuste, desgaste, cableado), no solo rearmar.</div>`);
 h+=paso("✅","Si todo da correcto",`<div class="mu">Seguir el ⭐ Análisis de OT y la Actuación más eficaz. Las medidas que metas se guardan en la OT y reordenan esta lista.</div>`);
 return h}
window.pciFicha=function(k){if(typeof abreCompClaves=="function")abreCompClaves([k],"Primera actuación")};

function pinta(){try{if(typeof view=="undefined"||view!="tec")return;const i=(typeof gOT!="undefined"&&gOT&&Array.isArray(inc))?inc.find(x=>x.id==gOT):null;
 const old=document.getElementById("gcomp");if(!i||i.estado=="cerrada"){if(old)old.remove();return}
 const P=plan(i);if(!P||(!P.AL.length&&!P.CP.length)){if(old)old.remove();return}
 const seg=hayPuente();const h=html(i,P,seg);
 const d=old||document.createElement("div");if(d.id!=="gcomp")d.id="gcomp";const cl="card "+(seg?"pcisec":"pucard");if(d.className!==cl)d.className=cl;if(d.dataset.h!==h){d.innerHTML=h;d.dataset.h=h;d.dataset.w=""}
 let ref=null;if(seg)ref=PUENTE.map(id=>document.getElementById(id)).filter(Boolean).sort((x,y)=>x.compareDocumentPosition(y)&4?-1:1).pop();
 if(!ref)ref=document.getElementById("greset")||document.querySelector('#app details.gd[data-k="SEG"]')||[...document.querySelectorAll("#app .card")].find(x=>/Guía de campo/.test((x.querySelector("h3")||{}).textContent||""));
 if(!ref){if(!d.isConnected){const a=document.getElementById("anag");if(a)a.before(d)}return}
 if(ref.nextElementSibling!==d)ref.insertAdjacentElement("afterend",d);ajusta(d)}catch(e){}}
/* v596: títulos de los pasos (código y textos) alineados a la izquierda de la caja.
   v595: en los pasos de componente, el texto va debajo del código (.pcitx), centrado y ajustado a dos líneas.
   v593: títulos de cada paso centrados y en dos líneas como máximo: se reduce la letra hasta que quepan, sin salirse de los márgenes */
function ajusta(d){try{if(!d||!d.isConnected)return;const w=String(d.clientWidth);if(!d.clientWidth||d.dataset.w===w)return;d.dataset.w=w;
 d.querySelectorAll(".pcitt").forEach(t0=>{const t=t0.querySelector(".pcitx")||t0;let fs=14.5;t.style.fontSize=fs+"px";while(fs>10.5&&t.scrollHeight>fs*1.3*2+6){fs-=.5;t.style.fontSize=fs+"px"}})}catch(e){}}
addEventListener("resize",()=>{const d=document.getElementById("gcomp");if(d){d.dataset.w="";ajusta(d)}});
if(typeof vTec=="function"){const o=vTec;vTec=function(){const r=o.apply(this,arguments);pinta();setTimeout(pinta,150);setTimeout(pinta,600);return r}}
/* v587: orden fijo · 1 el puente provisional (si existe) y 2 la actuación guiada justo debajo: si el puente se pinta más tarde
   (o lo mueve otra caja), se recoloca y pasa a «2 · ACTUACIÓN GUIADA» */
let tmo=null;new MutationObserver(()=>{if(tmo)return;tmo=setTimeout(()=>{tmo=null;if(typeof view!="undefined"&&view=="tec")pinta()},120)}).observe(document.documentElement,{childList:true,subtree:true});

/* ---------- tarjeta de la OT (Inicio / Seguimiento): franja si la primera actuación es la comprobación ---------- */
window.pciVa=function(id){gOT=id;if(typeof gSyncOT!="undefined")gSyncOT=id;if(view!="tec")go("tec");else vTec();
 setTimeout(()=>{const d=document.getElementById("gcomp");if(d)d.scrollIntoView({block:"start",behavior:"smooth"})},250)};
if(typeof card=="function"){const o=card;card=function(i){let h=o(i);try{if(!i||i.estado!="abierta"||h.includes('class="pact"'))return h;
 const P=plan(i);if(!P||!P.CP.length&&!P.AL.some(a=>a.x.f=="A"))return h;
 const sub=[P.AL.slice(0,2).map(a=>a.x.c+" "+a.x.t).join(" / "),P.CP.slice(0,2).map(o=>o.c.id).join(" · ")].filter(Boolean).join(" · ");
 const ban=`<div class="pact" role="button" tabindex="0" onclick="event.stopPropagation();pciVa('${i.id}')"><span class="pacti">🔎</span><span>PRIMERA ACTUACIÓN EN CAMPO · ACTUACIÓN GUIADA<small>${E(sub)}</small></span><span class="pactv">›</span></div>`;
 const re=/(<div class="mu">Inicio [\s\S]*?<\/div>)/;return re.test(h)?h.replace(re,"$1"+ban):h.replace(/(<p style="margin:6px 0">[\s\S]*?<\/p>)/,"$1"+ban)}catch(e){return h}}}

const st=document.createElement("style");st.textContent=`
#gcomp .pcisub{font-size:12.5px;font-weight:700;opacity:.8;margin:2px 0 8px}
#gcomp.pcisec{border:2px solid #ef6c00}
.pcip{display:flex;gap:8px;margin:8px 0;padding:8px;border:1px solid var(--bd,#cfd8dc);border-radius:10px;background:color-mix(in srgb,var(--card,#fff) 92%,#c62828)}
.pcip.pci1{border:2px solid #c62828}
.pcin{flex:none;width:26px;height:26px;border-radius:50%;background:#c62828;color:#fff;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:14px}
.pcic{flex:1;min-width:0}
#gcomp .pcitt{display:block;font-weight:800;font-size:14.5px;line-height:1.3;text-align:left;max-width:100%;overflow-wrap:anywhere;word-break:normal;hyphens:auto;margin:0 0 2px}
#gcomp .pcitt .cmpid{white-space:nowrap;vertical-align:baseline;margin:0 4px 0 2px}
#gcomp .pcitt .pcitx{display:block;margin-top:4px}
.pcitag{font-size:11px;font-weight:700;opacity:.7;border:1px solid currentColor;border-radius:5px;padding:0 4px}
.pciq{font-size:13px;margin-top:3px}.pcia{font-size:13px;font-weight:700;margin-top:3px}
.pciu{font-weight:800;color:#e65100;font-size:13px;margin-top:3px}.pcipor{font-size:12px;opacity:.8;margin-top:2px}
.pcimt{display:inline-block;margin-top:6px;padding:3px 8px;border-radius:6px;background:#facc15;color:#000;font-weight:900;font-size:12px;letter-spacing:.5px}
.pcib{width:100%!important;margin:6px 0 0!important;padding:8px!important;font-size:13px!important}
.pcire{font-size:13px;margin:3px 0}
#gcomp .pcifs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:6px 0 4px}
#gcomp .pcifo{margin:0;background:#fff;border:1px solid #d0d0d0;border-radius:8px;padding:4px;text-align:center;cursor:zoom-in;min-width:0}
#gcomp .pcifo img{display:block;width:100%;height:120px;object-fit:contain;background:#fff;border-radius:5px}
#gcomp .pcifo figcaption{font-size:12px;line-height:1.25;color:#111;margin-top:3px;overflow-wrap:anywhere}
#gcomp .pcifo figcaption small{display:block;font-size:11px;color:#555}
#gcomp .pcifo.pciub{border:2px solid #e08a00}
#gcomp .pcifs>.pcifo:only-child,#gcomp .pcifs>.pcifo:last-child:nth-child(odd){grid-column:1/-1}
#gcomp .pcifs>.pcifo:last-child:nth-child(odd) img{height:170px}
#gcomp .pcifw{font-size:12.5px;opacity:.75;text-align:center;padding:8px}`;
document.head.appendChild(st);
})();
