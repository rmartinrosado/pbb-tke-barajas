/* ===== v576: FICHA TÉCNICA DEL REPUESTO (18/11/2026) =====
   En la caja naranja «Repuesto» de Componentes de campo, botón «📄 Ficha técnica» que despliega las fotos del repuesto
   SIN MONTAR (placa, caja, etiqueta, hoja de datos), aparte de las fotos de la pieza montada y de su ubicación.
   Al añadir fotos (solo modo Administrador) la IA las lee y ACTUALIZA las especificaciones de la ficha: conserva lo que ya había,
   corrige lo que la foto contradice o estaba «no legible» y añade lo nuevo (también fabricante/modelo/referencia y conexionado).
   Vale igual para componentes ya importados que aún no tenían ficha técnica. Fotos en el almacén (cubo «componentes»),
   direcciones en componentes_campo.ficha. ===== */
(function(){
"use strict";
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g," ").trim();
const key=c=>String(c.baseId||c.db||c.id);
const esAdm=()=>{try{return typeof admin!="undefined"&&!!admin}catch(e){return false}};
/* v585: la ficha técnica sale DESPLEGADA al abrir un componente (fotos + especificaciones); CER = las que el técnico ha plegado */
const CER=new Set(),EST={};
const L=()=>window.COMP_CAMPO||[];
const busca=k=>L().find(c=>key(c)==k);
const fichaDe=c=>(c&&c.raw&&Array.isArray(c.raw.ficha))?c.raw.ficha:[];
const repinta=()=>{if(typeof compNavLista=="function")compNavLista()};
const pon=(k,h)=>{EST[k]=h;const d=document.querySelector(`.cfts[data-k="${CSS.escape(k)}"]`);if(d)d.innerHTML=h};

window.compFichaTec=function(c){if(!c)return"";const k=key(c),fs=fichaDe(c),on=!CER.has(k),adm=esAdm();
 return `<div class="cft"><button type="button" class="cftb" data-cft="${E(k)}">📄 Ficha técnica${fs.length?` · ${fs.length} foto${fs.length>1?"s":""}`:""} <span>${on?"▲":"▼"}</span></button>`+
 (on?`<div class="cftp">${fs.length?`<div class="cftg">${fs.map((f,i)=>`<img src="${E(f.src)}" alt="Ficha técnica ${i+1}" data-cfv="${E(k)}" data-i="${i}" loading="lazy">`).join("")}</div>`
   :`<div class="cftv">Sin fotos de ficha técnica. Haz fotos del repuesto <b>sin montar</b>: placa de características, caja, etiqueta u hoja de datos, que se lean bien.</div>`}
  ${adm?`<details class="cftgest"${SELP[k]?" open":""}><summary>⚙️ Gestionar fotos de la ficha técnica</summary>${pasables(c).length?`<button type="button" class="cftr cftpa" data-cfp="${E(k)}">📥 Pasar fotos ya importadas a ficha técnica</button>${SELP[k]?selHTML(c,k):""}`:""}<label class="cfta">📷 Añadir fotos de la ficha<input type="file" accept="image/*" multiple hidden data-cfa="${E(k)}"></label>${fs.length?`<button type="button" class="cftr" data-cfr="${E(k)}">🔍 Volver a leer las fotos y actualizar especificaciones</button>`:""}</details>`
   :`<div class="cftv">🔒 Solo el modo Administrador añade fotos de ficha técnica.</div>`}
  <div class="cfts" data-k="${E(k)}">${EST[k]||""}</div></div>`:"")+`</div>`};

/* v577: fotos ya importadas del componente (no las de ubicación) que se pueden pasar a la ficha técnica.
   Se COPIAN: la ficha del componente conserva sus fotos como estaban; la ficha técnica las usa y la IA las lee. */
const SELP={};const fo=f=>Array.isArray(f)?{src:f[0],vista:f[1]||"Vista",x:f[2]}:(f||{});
const pasables=c=>{const ya=new Set(fichaDe(c).map(f=>f.src));return (c.fotos||[]).map((f,i)=>({f:fo(f),i})).filter(x=>x.f&&x.f.src&&!/^ubicaci/i.test(x.f.vista||"")&&!ya.has(x.f.src))};
const selHTML=(c,k)=>{const S=SELP[k];return `<div class="cftsel"><div class="cftv">Marca las fotos que sirven de ficha técnica (placa o datos legibles). Se copian: el componente sigue mostrando sus fotos.</div><div class="cftg">${pasables(c).map(x=>`<label class="cftck${S.has(x.i)?" on":""}"><input type="checkbox" data-cfs="${E(k)}" value="${x.i}"${S.has(x.i)?" checked":""}><img src="${E(x.f.src)}" alt=""><small>${E(x.f.vista||"Vista")}</small></label>`).join("")}</div>
 <button type="button" class="cfta cftgo" data-cfg="${E(k)}">📥 Pasar ${S.size} foto${S.size==1?"":"s"} y leer con IA</button></div>`};
/* ---- imágenes ---- */
const carga=src=>new Promise((ok,ko)=>{const im=new Image();if(!/^data:/.test(src))im.crossOrigin="anonymous";im.onload=()=>ok(im);im.onerror=()=>ko(new Error("No se pudo abrir una foto"));im.src=src});
const aJpg=(im,max)=>{const k=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement("canvas");c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);return c.toDataURL("image/jpeg",.86)};
function collage(ims){const H=1100,W=ims.map(i=>i.naturalWidth*H/i.naturalHeight);let tot=W.reduce((a,b)=>a+b,0)+20*(ims.length-1);const k=Math.min(1,2800/tot);
 const c=document.createElement("canvas");c.width=Math.round(tot*k);c.height=Math.round(H*k);const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,c.width,c.height);
 let x=0;ims.forEach((im,i)=>{g.drawImage(im,x*k,0,W[i]*k,H*k);x+=W[i]+20});return c.toDataURL("image/jpeg",.88).split(",")[1]}
const jsonDe=t=>{const s=String(t||"").replace(/```json|```/g,"");const a=s.indexOf("{"),b=s.lastIndexOf("}");if(a<0||b<=a)throw new Error("La IA no devolvió datos");return JSON.parse(s.slice(a,b+1))};
const noLeg=v=>/no (se )?le(e|gible)|ilegible|no visible|no se ve|desconocid/i.test(String(v||""));

/* ---- lectura con IA y mezcla con lo que ya hay ---- */
async function analiza(c,srcs,motor){const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;if(!tok)throw new Error("Inicia sesión para usar la IA");
 const ims=[];for(const s of srcs.slice(0,4)){try{ims.push(await carga(s))}catch(e){}}if(!ims.length)throw new Error("No se pudieron abrir las fotos de la ficha");
 const espAct=(c.raw?c.raw.esp:c.esp)||[];
 const prompt=`Fotos (en una sola imagen, de izquierda a derecha) de la FICHA TÉCNICA de un repuesto SIN MONTAR (placa de características, caja, etiqueta u hoja de datos) del componente ${c.id} «${c.t}» de una pasarela de embarque (PBB) TKE del aeropuerto de Madrid-Barajas.
DATOS ACTUALES DE SU FICHA:
- Fabricante · modelo · referencia: ${c.fab||"(vacío)"}
- Especificaciones: ${JSON.stringify(espAct.filter(r=>!/^repuesto$/i.test(r[0])))}
- Conexionado: ${JSON.stringify(c.pin||[])}
TAREA
1. Lee TODO lo impreso y legible: fabricante, modelo, referencia/código de pedido, tensión, corriente, potencia, frecuencia, rango de ajuste o medida, contactos (NA/NC), salida (PNP/NPN, 4-20 mA…), distancia de detección, grado IP, temperatura de trabajo, normas, dimensiones, conexionado (pines y colores). NO inventes nada que no se lea.
2. Devuelve la lista COMPLETA de especificaciones actualizada: conserva las filas actuales que sigan siendo válidas, corrige las que la foto contradiga o que digan «no legible», y añade las nuevas. Usa nombres de dato cortos en español. Máximo 24 filas.
3. fab = «Fabricante · modelo · ref. XXXX» con lo leído (si no se lee algo, conserva lo actual).
Responde SOLO con JSON: {"fab":"","esp":[["dato","valor"]],"pin":[["pin","color","señal","función"]],"av":"","resumen":"qué se ha leído y qué ha cambiado, 1-2 frases"}`;
 const r=await fetch(SUPABASE_URL+"/functions/v1/leer-ia",{method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},body:JSON.stringify({img:collage(ims),tipo:"image/jpeg",prompt,motor})});
 const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.mensaje||j.error||("error "+r.status));
 const P=jsonDe(j.txt);P.lector=j.lector;return P}
function mezcla(c,P){const act=((c.raw?c.raw.esp:c.esp)||[]).filter(r=>Array.isArray(r)&&!/^repuesto$/i.test(r[0]));
 const nue=(Array.isArray(P.esp)?P.esp:[]).filter(r=>Array.isArray(r)&&r[0]&&String(r[1]||"").trim()).map(r=>[String(r[0]).trim(),String(r[1]).trim()]);
 const ks=new Set(nue.map(r=>nrm(r[0])));const out=nue.slice();
 act.forEach(r=>{if(!ks.has(nrm(r[0]))&&!(noLeg(r[1])&&nue.length))out.push(r)});
 const fab=P.fab&&!noLeg(P.fab)?String(P.fab).trim():(c.fab||"");
 const pinN=Array.isArray(P.pin)?P.pin.filter(r=>Array.isArray(r)&&r.some(x=>String(x||"").trim())):[];
 return {esp:out,fab,pin:pinN.length?pinN:(c.pin||[]),av:(c.av||"")||String(P.av||"")}}

/* ---- guardar en componentes_campo ---- */
async function guarda(c,ficha,M){const row={ficha};if(M){row.esp=M.esp;row.fab=M.fab;row.pin=M.pin;row.av=M.av}
 /* v644: pasar fotos a la ficha técnica solo AÑADE: las fotos de campo y de ubicación no se tocan, y se conservan las
    especificaciones y fotos de ficha que haya en el servidor aunque este móvil tuviera una copia anterior */
 if(c.db){try{const {data:sv}=await sb.from("componentes_campo").select("esp,ficha").eq("id",c.db).single();
  if(sv){const fs=new Set(row.ficha.map(f=>f.src));(Array.isArray(sv.ficha)?sv.ficha:[]).forEach(f=>{if(f&&f.src&&!fs.has(f.src)){row.ficha.push(f);fs.add(f.src)}});
   if(row.esp){const ks=new Set(row.esp.map(r=>nrm(r[0])));(sv.esp||[]).forEach(r=>{if(Array.isArray(r)&&!ks.has(nrm(r[0]))){row.esp.push(r);ks.add(nrm(r[0]))}})}}}catch(e){}}
 let r;if(c.db)r=await sb.from("componentes_campo").update(row).eq("id",c.db).select().single();
 else{const fotos=typeof compSubeFotos=="function"?await compSubeFotos((c.fotos||[]).map(f=>{const g=fo(f);return Object.assign({src:g.src,vista:g.vista||"Vista"},g.x&&g.x.o&&g.x.caja?{o:g.x.o,caja:g.x.caja}:{})})):(c.fotos||[]).map(fo);
  Object.assign(row,{base:c.id,codigo:c.id,titulo:c.t,fab:row.fab!=null?row.fab:(c.fab||""),claves:c.claves||"",esp:row.esp||(c.esp||[]),pin:row.pin||(c.pin||[]),med:c.med||[],av:row.av!=null?row.av:(c.av||""),fotos,
   creado_por:(typeof user!="undefined"&&user&&user.email)||""});r=await sb.from("componentes_campo").insert(row).select().single()}
 if(r.error)throw r.error;if(!r.data)throw new Error("Sin permiso para guardar");if(typeof compRecarga=="function")await compRecarga();return r.data}

async function proceso(k,nuevas,copia){const c=busca(k);if(!c)return;
 const motor=typeof compPideMotor=="function"?await compPideMotor():"claude";if(!motor&&!(nuevas&&nuevas.length)){pon(k,"");return}
 try{let ficha=fichaDe(c).slice();
  if(nuevas&&nuevas.length){pon(k,copia?"⏳ Pasando fotos a la ficha técnica…":"⏳ Subiendo fotos de la ficha…");const sub=!copia&&typeof compSubeFotos=="function"?await compSubeFotos(nuevas):nuevas;ficha=ficha.concat(sub)}
  let M=null,res="";
  if(motor){pon(k,`⏳ Leyendo la ficha técnica con <b>${motor=="claude"?"Claude":"Gemini"}</b> y actualizando especificaciones…`);
   const srcs=nuevas&&nuevas.length?nuevas.map(f=>f.src):ficha.map(f=>f.src);
   const P=await analiza(c,srcs,motor);M=mezcla(c,P);res=`✅ Leído con <b>${E(P.lector||motor)}</b>. ${E(P.resumen||"")} Especificaciones: ${M.esp.length} filas.`}
  await guarda(c,ficha,M);CER.delete(k);EST[k]=res||"✅ Fotos de ficha técnica guardadas (sin leer con IA).";repinta();if(typeof msg=="function")msg("Ficha técnica de "+c.id+" actualizada")}
 catch(e){pon(k,`<span style="color:#c62828">${E(String((e&&e.message)||e))}</span>`)}}

/* ---- eventos (delegados) ---- */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-cft]");
 if(b){e.preventDefault();e.stopPropagation();const k=b.dataset.cft;CER.has(k)?CER.delete(k):CER.add(k);repinta();return}
 const v=e.target.closest&&e.target.closest("[data-cfv]");
 if(v){const c=busca(v.dataset.cfv);const fs=fichaDe(c).map(f=>f.src);if(typeof compVer=="function")compVer(fs[+v.dataset.i],fs,+v.dataset.i);return}
 const pa=e.target.closest&&e.target.closest("[data-cfp]");
 if(pa){e.preventDefault();const k=pa.dataset.cfp,c=busca(k);if(SELP[k]){delete SELP[k];repinta();return}
  const go=()=>{SELP[k]=new Set(pasables(c).map(x=>x.i));repinta()};if(c&&c._fp&&typeof compFotosAsegura=="function")compFotosAsegura(c).then(go);else go();return}
 const gb=e.target.closest&&e.target.closest("[data-cfg]");
 if(gb){e.preventDefault();if(!esAdm()){msg("🔒 Solo el modo Administrador");return}const k=gb.dataset.cfg,c=busca(k),S=SELP[k];if(!c||!S||!S.size){msg("Marca al menos una foto");return}
  const fs=pasables(c).filter(x=>S.has(x.i)).map(x=>({src:x.f.src,vista:"Ficha técnica · "+(x.f.vista||"Vista")}));delete SELP[k];proceso(k,fs,true);return}
 const r=e.target.closest&&e.target.closest("[data-cfr]");if(r){if(!esAdm()){msg("🔒 Solo el modo Administrador");return}proceso(r.dataset.cfr,null)}},true);
document.addEventListener("change",e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.cfs)return;const S=SELP[i.dataset.cfs];if(!S)return;
 i.checked?S.add(+i.value):S.delete(+i.value);const l=i.closest(".cftck");if(l)l.classList.toggle("on",i.checked);
 const b=document.querySelector(`[data-cfg="${CSS.escape(i.dataset.cfs)}"]`);if(b)b.textContent=`📥 Pasar ${S.size} foto${S.size==1?"":"s"} y leer con IA`},true);
document.addEventListener("change",async e=>{const i=e.target;if(!i||!i.dataset||!i.dataset.cfa)return;const k=i.dataset.cfa;const fs=[...(i.files||[])];i.value="";if(!fs.length)return;
 if(!esAdm()){msg("🔒 Solo el modo Administrador");return}
 const out=[];for(const f of fs){try{const u=URL.createObjectURL(f);const im=await carga(u);out.push({src:aJpg(im,1800),vista:"Ficha técnica"});URL.revokeObjectURL(u)}catch(x){}}
 if(!out.length){msg("No se pudieron abrir las fotos");return}proceso(k,out)},true);

const st=document.createElement("style");st.textContent=`
.cft{margin-top:10px}
.cftb{width:100%!important;margin:0!important;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px!important;border-radius:10px!important;border:1.5px solid var(--ac,#ff7a1a)!important;background:transparent!important;color:var(--ac,#ff7a1a)!important;font-weight:800!important;font-size:14px!important}
.cftp{margin-top:8px}
.cftg{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px}
.cftg img{width:100%;height:120px;object-fit:contain;background:#fff;border-radius:8px;border:1px solid #0002;cursor:zoom-in}
.cftv{font-size:13px;opacity:.85;margin:6px 0;line-height:1.4}
.cfta{display:flex!important;align-items:center;justify-content:center;gap:8px;margin:8px 0 0!important;padding:12px!important;border-radius:10px;background:var(--ac,#ff7a1a);color:#111!important;font:800 14px/1.2 inherit!important;font-family:inherit!important;letter-spacing:.3px!important;opacity:1!important;cursor:pointer}
.cftgest{margin:8px 0 0}.cftgest>summary{cursor:pointer;list-style:none;padding:9px 12px;border-radius:10px;border:1.5px dashed #b0bec5;font-weight:800;font-size:13px;color:#455a64;background:#eceff1}
.cftgest>summary::-webkit-details-marker{display:none}.cftgest>summary::after{content:" ▼";float:right}.cftgest[open]>summary::after{content:" ▲"}
.cftr{width:100%!important;margin:8px 0 0!important;font-size:13px!important}
.cfts{font-size:13px;margin-top:6px;line-height:1.4}
.cftsel{margin-top:8px;padding:8px;border:1px dashed var(--ac,#ff7a1a);border-radius:10px}
.cftck{position:relative;display:flex!important;flex-direction:column;align-items:center;gap:3px;margin:0!important;padding:4px;border:2px solid transparent;border-radius:10px;cursor:pointer;font:inherit!important;letter-spacing:normal!important;text-transform:none!important}
.cftck.on{border-color:var(--ac,#ff7a1a)}.cftck input{position:absolute;top:6px;left:6px;width:22px;height:22px;margin:0}
.cftck img{width:100%;height:110px;object-fit:contain;background:#fff;border-radius:8px}.cftck small{font-size:11px;opacity:.75;text-align:center;line-height:1.2}
.cftgo{width:100%!important;border:0!important}`;document.head.appendChild(st);
})();
