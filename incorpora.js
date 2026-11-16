/* ===== v470: INCORPORAR COMPONENTE DESDE EL MÓVIL + catálogo de Componentes de campo (15/11/2026) =====
   · «🔩 Componentes de campo» (Seguimiento OT y la franja del SOS): catálogo con buscador de todas las fichas.
   · «➕ Incorporar componente»: fotos del componente (placa, vistas, conector) + dónde está montado + en qué averías interviene
     → «🤖 Identificar con IA» (función leer-ia: Claude preferente) lee la placa, la coteja con los códigos de los planos y
     propone código, título, especificaciones, pines y medidas. Se revisa, se corrige si hace falta y se GUARDA en Supabase
     (tabla componentes_campo): sale para todos los técnicos en el SOS, la lupa y la guía de campo de las OT de esas averías.
   · Repuestos: en cada ficha guardada, referencia, sustituto, ubicación en almacén y unidades (campo stock). ===== */
(function(){
"use strict";
const E=s=>typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const C=()=>window.COMP_CAMPO||[];
/* ---------- cargar los componentes guardados ---------- */
const reDe=cl=>{const ws=String(cl||"").split(/[,;\n]+/).map(w=>nrm(w).trim()).filter(Boolean);if(!ws.length)return()=>false;
 return t=>ws.some(w=>w.split(/\s+/).every(p=>t.includes(p)))};
function aComp(r){return{id:r.codigo,t:r.titulo,fab:r.fab||"",db:r.id,claves:r.claves||"",re:(()=>{const f=reDe(r.claves),c=nrm(r.codigo).replace(/\s/g,"");return t=>f(t)||(c.length>=4&&t.replace(/\s/g,"").includes(c))})(),
 fotos:(r.fotos||[]).map(f=>[f.src,f.vista||"Vista"]),esp:(r.esp||[]).concat(r.stock&&Object.values(r.stock).some(Boolean)?[["Repuesto",[r.stock.ref&&"Ref. "+r.stock.ref,r.stock.sust&&"Sustituto: "+r.stock.sust,r.stock.ubi&&"Almacén: "+r.stock.ubi,r.stock.uds!=null&&r.stock.uds!==""&&r.stock.uds+" uds."].filter(Boolean).join(" · ")]]:[]),
 pin:r.pin||[],pint:"Conexionado",med:r.med||[],av:r.av||"",raw:r}}
/* v534: fichas de fábrica (componentes.js) editadas desde la PWA → fila con base = código original; sustituye a la ficha
   en su MISMO sitio (conserva su reconocimiento de avisos) y se puede restaurar. */
const BASE=C().slice();window.COMP_BASE=BASE;
function sobre(b,r){const n=aComp(r);const rb=b.re,rn=n.re;return Object.assign({},b,n,{baseId:b.id,pint:b.pint,re:t=>{try{if(rb(t))return true}catch(e){}return rn(t)}})}
async function carga(){try{const {data,error}=await sb.from("componentes_campo").select("*").order("creado",{ascending:true});if(error||!data)return;
 const L=C();L.length=BASE.length;BASE.forEach((b,i)=>L[i]=b);
 data.forEach(r=>{const i=r.base?BASE.findIndex(b=>b.id==r.base):-1;if(i>=0)L[i]=sobre(BASE[i],r);else L.push(aComp(r))})}catch(e){}}
window.compRecarga=carga;window.compAComp=aComp;
setTimeout(carga,1500);setInterval(carga,10*60*1000);
/* ---------- utilidades de imagen ---------- */
const lee=window.compLeeImg=f=>new Promise((ok,ko)=>{const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{ok(im);};im.onerror=()=>{URL.revokeObjectURL(u);ko(new Error("No se pudo abrir la foto"))};im.src=u});
window.compAJpg=aJpg;function aJpg(im,max){const k=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement("canvas");c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);
 const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);return c}
function collage(cs){const W=1600,h=Math.max(...cs.map(c=>c.height*(W/cs.length)/c.width));const cv=document.createElement("canvas");cv.width=W;cv.height=Math.min(1600,Math.round(h));
 const x=cv.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,cv.width,cv.height);const w=W/cs.length;cs.forEach((c,i)=>{const k=Math.min(w/c.width,cv.height/c.height);x.drawImage(c,i*w+(w-c.width*k)/2,(cv.height-c.height*k)/2,c.width*k,c.height*k)});return cv.toDataURL("image/jpeg",.85)}
/* ---------- catálogo ---------- */
window.compCatalogo=function(q){q=q||"";const t=nrm(q);const L=C().filter(c=>!t||nrm([c.id,c.t,c.fab,c.claves].join(" ")).includes(t));
 $("#sheetc").innerHTML=`<div class="icpw"><div class="icpfix"><div class="icph"><h3 style="margin:0">🔩 Componentes de campo</h3><button class="sec" onclick="closeSheet()" style="width:auto;margin:0">✕</button></div>
 ${(typeof tecnico!="undefined"&&tecnico)||(typeof admin!="undefined"&&admin)?`<button class="pri" style="margin:8px 0 2px" onclick="compIncorpora()">➕ Incorporar componente (foto)</button>`:""}
 <div class="icpb"><input id="icp_q" type="search" placeholder="Buscar código, nombre o modelo" value="${E(q)}" onkeyup="if(event.key=='Enter')compCatalogo(this.value)"><button class="sec" onclick="compCatalogo(document.getElementById('icp_q').value)" style="width:auto;margin:0">🔍</button></div></div>
 <div class="icpl"><div class="mu" style="font-size:12px;margin:6px 0">${L.length} ficha${L.length==1?"":"s"}</div>
 ${L.map((c,i)=>`<details class="icpi"><summary><span class="cmpid">${E(c.id)}</span> ${E(c.t)}</summary>${typeof compFicha=="function"?compFicha(c):""}</details>`).join("")}</div></div>`;
 $("#sheet").style.display="flex"};
/* ---------- incorporar ---------- */
let F=[];const VISTAS=["Vista frontal · placa","Vista lateral","Vista trasera","Vista conector"];
window.compIncorpora=function(){F=[];pinta()};
function pinta(P){const p=P||{};$("#sheetc").innerHTML=`<div class="icph"><h3 style="margin:0">➕ Incorporar componente</h3><button class="sec" onclick="compCatalogo()" style="width:auto;margin:0">✕</button></div>
 <div class="mu" style="font-size:12.5px;margin:4px 0 8px">Haz fotos nítidas de la placa (texto impreso) y del componente; si puedes, también del cable o su marcado. La IA lee la placa y propone el código cruzándolo con los planos. Revisa antes de guardar.</div>
 <label class="btn" style="margin:0;justify-content:center;gap:6px;padding:12px">📷 Añadir foto<input type="file" accept="image/*" multiple hidden onchange="compFotos(this)"></label>
 <div class="icf">${F.map((f,i)=>`<figure><img src="${f.src}" alt=""><select onchange="compVista(${i},this.value)">${VISTAS.map(v=>`<option${v==f.vista?" selected":""}>${v}</option>`).join("")}</select><button class="sec" onclick="compQuita(${i})">🗑</button></figure>`).join("")}</div>
 <label>¿Dónde está montado?</label><input id="ic_donde" placeholder="Ej. rotonda, túnel exterior, cabina bajo el pupitre…" value="${E(p.donde||"")}">
 <label>¿En qué averías interviene? (palabras del aviso, separadas por comas)</label><input id="ic_cla" placeholder="Ej. barrera rotonda, evento 294" value="${E(p.claves||"")}">
 <button class="pri" style="margin-top:10px" onclick="compIA()" ${F.length?"":"disabled"}>🤖 Identificar con IA</button><div id="ic_st" class="mu" style="font-size:12.5px;margin-top:6px"></div><div id="ic_prop"></div>`;$("#sheet").style.display="flex"}
const vals=()=>({donde:(document.getElementById("ic_donde")||{}).value||"",claves:(document.getElementById("ic_cla")||{}).value||""});
window.compFotos=async function(inp){const v=vals();for(const f of [...(inp.files||[])]){try{const im=await lee(f);const c=aJpg(im,900);F.push({src:c.toDataURL("image/jpeg",.82),vista:VISTAS[Math.min(F.length,VISTAS.length-1)],c:aJpg(im,1400)})}catch(e){msg(String(e.message||e))}}pinta(v)};
window.compVista=(i,v)=>{if(F[i])F[i].vista=v};window.compQuita=i=>{const v=vals();F.splice(i,1);pinta(v)};
const codigos=()=>{const N=window.NOMBRES_EL||{};return Object.entries(N).map(([k,v])=>k+"="+v).join("; ")};
let PROP=null;
window.compIA=async function(){const v=vals();const st=document.getElementById("ic_st");const set=t=>{if(st)st.innerHTML=t};set("⏳ Leyendo la placa y cotejando con los planos…");
 try{const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;if(!tok)throw new Error("Inicia sesión para usar la IA");
  const img=collage(F.map(f=>f.c)).split(",")[1];
  const prompt=`Fotos (en una sola imagen, de izquierda a derecha) de un componente de campo de una pasarela de embarque (PBB) TKE del aeropuerto de Madrid Barajas, para la guía de componentes de la app de mantenimiento.
Dónde está montado (según el técnico): ${v.donde||"(no indicado)"}.
Averías en que interviene (según el técnico): ${v.claves||"(no indicado)"}.
CÓDIGOS DE ELEMENTOS DE LOS PLANOS (código=nombre): ${codigos()}

TAREA
1. Lee TODO lo impreso en la placa (fabricante, modelo, referencia, tensión, corriente, resistencia, salidas, pines/colores, normas, protección). No inventes datos que no se lean.
2. Coteja el tipo de componente, lo impreso y dónde está montado con la lista de códigos y propone el CÓDIGO de plano más probable (si hay varios iguales, p. ej. izquierdo/derecho o emisor/receptor, ponlos juntos «R-B1 / R-B3» y explícalo). Si no encaja con ninguno, codigo = "SIN CÓDIGO".
3. Propón: titulo (nombre del elemento en español), fab (fabricante · modelo · referencia), esp = filas [dato, valor] de la placa y su función en la PBB, pin = filas [pin, color, señal, función] si se ven, med = 3-5 pasos «Medir en campo» con valores esperados (por ejemplo «24 VDC entre pin 1 y pin 3»), av = aviso al sustituir, claves = palabras de los avisos de OT en que interviene (separadas por comas), justificacion = por qué ese código.
Responde SOLO con JSON: {"codigo":"","titulo":"","fab":"","esp":[["",""]],"pin":[["","","",""]],"med":[""],"av":"","claves":"","justificacion":""}`;
  const r=await fetch(SUPABASE_URL+"/functions/v1/leer-ia",{method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},body:JSON.stringify({img,tipo:"image/jpeg",prompt})});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.mensaje||j.error||("error "+r.status));
  const m=String(j.txt||"").match(/\{[\s\S]*\}/);if(!m)throw new Error("La IA no devolvió datos");PROP=JSON.parse(m[0]);PROP.lector=j.lector;
  if(!PROP.claves&&v.claves)PROP.claves=v.claves;set(`Leído con <b>${E(j.lector||"IA")}</b>. Revisa y corrige antes de guardar.`);propHTML()}
 catch(e){set(`<span style="color:#c62828">${E(String((e&&e.message)||e))}</span>`)}};
const filas=a=>(a||[]).map(r=>Array.isArray(r)?r.join(" | "):String(r)).join("\n");
const desf=(t,n)=>String(t||"").split("\n").map(l=>l.trim()).filter(Boolean).map(l=>n?l.split("|").map(x=>x.trim()).concat(Array(n).fill("")).slice(0,n):l);
function propHTML(){const p=PROP;const d=document.getElementById("ic_prop");if(!d)return;
 d.innerHTML=`<div class="icpr">${p.justificacion?`<div class="mu" style="font-size:12.5px;margin-bottom:6px">🔎 ${E(p.justificacion)}</div>`:""}
 <label>Código (de los planos)</label><input id="ip_cod" value="${E(p.codigo||"")}"><label>Título</label><input id="ip_tit" value="${E(p.titulo||"")}">
 <label>Fabricante · modelo · referencia</label><input id="ip_fab" value="${E(p.fab||"")}">
 <label>Averías en que interviene (palabras, separadas por comas)</label><input id="ip_cla" value="${E(p.claves||"")}">
 <label>Especificaciones (una por línea: dato | valor)</label><textarea id="ip_esp" rows="5">${E(filas(p.esp))}</textarea>
 <label>Conexionado (una por línea: pin | color | señal | función)</label><textarea id="ip_pin" rows="4">${E(filas(p.pin))}</textarea>
 <label>Medir en campo (un paso por línea)</label><textarea id="ip_med" rows="4">${E((p.med||[]).join("\n"))}</textarea>
 <label>Aviso al sustituir</label><textarea id="ip_av" rows="2">${E(p.av||"")}</textarea>
 <div class="icst"><b>Repuesto</b><div class="grid" style="grid-template-columns:1fr 1fr;gap:6px"><input id="ip_ref" placeholder="Referencia"><input id="ip_sus" placeholder="Sustituto compatible"><input id="ip_ubi" placeholder="Ubicación almacén"><input id="ip_uds" inputmode="numeric" placeholder="Unidades"></div></div>
 <button class="pri" style="margin-top:10px" onclick="compGuarda()">💾 Guardar en Componentes de campo</button></div>`}
window.compGuarda=async function(){const g=id=>(document.getElementById(id)||{}).value||"";
 const row={codigo:g("ip_cod").trim()||"SIN CÓDIGO",titulo:g("ip_tit").trim()||"Componente",fab:g("ip_fab").trim(),claves:g("ip_cla").trim(),esp:desf(g("ip_esp"),2),pin:desf(g("ip_pin"),4),med:desf(g("ip_med")),av:g("ip_av").trim(),
  fotos:F.map(f=>({src:f.src,vista:f.vista})),stock:{ref:g("ip_ref"),sust:g("ip_sus"),ubi:g("ip_ubi"),uds:g("ip_uds")},creado_por:(user&&user.email)||""};
 if(!row.claves){msg("Indica en qué averías interviene, para asociarlo a las OT");return}
 try{const {data,error}=await sb.from("componentes_campo").insert(row).select().single();if(error)throw error;C().push(aComp(data));msg("Componente "+row.codigo+" incorporado");compCatalogo(row.codigo)}
 catch(e){msg("No se pudo guardar: "+String((e&&e.message)||e))}};
/* ---------- accesos ---------- */
/* v495: cabecera del catálogo (título + «Incorporar componente») fija arriba; la búsqueda (con la lupa) debajo del botón, también fija (v496); v497: la cabecera ya no es sticky: el listado tiene su propio scroll */
/* v474: el catálogo se abre solo desde la caja «Componente de campo» de la guía */
const st=document.createElement("style");st.textContent=`
.icpw{display:flex;flex-direction:column;height:calc(90dvh - 28px - env(safe-area-inset-bottom,0px));min-height:0}
.icpfix{flex:none;padding-bottom:6px;border-bottom:1px solid var(--bd,#3a4450)}
.icpl{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;touch-action:pan-y;overscroll-behavior:contain;padding-bottom:70px}
.icph{display:flex;align-items:center;justify-content:space-between;gap:8px}.icpb{display:flex;gap:6px;margin-top:8px}.icpb input{flex:1;margin:0}
.icpi{border:1px solid var(--bd,#ddd);border-radius:10px;padding:6px 8px;margin:6px 0}.icpi>summary{font-weight:700;font-size:14px}
.icf{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:8px 0}.icf figure{margin:0;background:#fff;border:1px solid #cfd8dc;border-radius:9px;padding:4px;display:flex;flex-direction:column;gap:4px}
.icf img{width:100%;height:90px;object-fit:contain}.icf select,.icf button{margin:0!important;padding:3px!important;font-size:11px!important;width:100%!important;min-height:0!important}
.icpr{margin-top:8px;padding:8px;border:1.5px solid #455a64;border-radius:10px}.icpr textarea{font-size:13px}
.icst{margin-top:8px;padding:6px;border:1px dashed var(--bd,#bbb);border-radius:8px}.icst input{margin:0}
.ubcmp{position:relative}.icpbh{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:auto!important;margin:0!important;padding:4px 9px!important;font-size:12px!important;background:rgba(255,255,255,.2)!important;color:#fff!important;border:1px solid rgba(255,255,255,.5)!important;border-radius:8px}`;
document.head.appendChild(st);
})();
