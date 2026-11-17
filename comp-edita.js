/* ===== v534: EDITAR LA FICHA DE UN COMPONENTE DE CAMPO (16/11/2026) =====
   Dentro de la ficha (catálogo «Comp.» del menú, catálogo de la guía y caja de la guía de la OT), en modos Técnico y Admin:
   · «✏️ Editar ficha»: código, título, fabricante/modelo, averías en que interviene, especificaciones (dato | valor, filas
     que se añaden y se quitan), conexionado, «Medir en campo», aviso al sustituir y repuesto (ref., sustituto, almacén, uds.).
   · «📷 Foto nueva»: cámara o carrete; abre el editor con la foto ya añadida. En el editor cada foto se puede sustituir,
     quitar, poner la primera (principal) y cambiar su rótulo de vista.
   · Se guarda en Supabase (componentes_campo) para todos los técnicos. Las fichas de fábrica (componentes.js) se guardan
     como fila con base = su código: sustituyen a la original en su sitio y se pueden «Restaurar original» (Admin).
   La capa del editor es fija y a pantalla completa: no la tocan el toque → Inicio ni el doble toque → Registrar OT. ===== */
(function(){
"use strict";
const E=s=>typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const puede=()=>{try{return (typeof tecnico!="undefined"&&!!tecnico)||(typeof admin!="undefined"&&!!admin)}catch(e){return false}};
/* aviso propio por encima de la capa del editor (el msg general queda debajo) */
const msg=t=>{const d=document.createElement("div");d.textContent=t;d.style.cssText="position:fixed;left:12px;right:12px;bottom:calc(80px + env(safe-area-inset-bottom,0px));background:#111;color:#fff;padding:12px;border-radius:8px;z-index:100001;text-align:center;font-weight:600";document.body.appendChild(d);setTimeout(()=>d.remove(),2800)};
const esAdmin=()=>{try{return (typeof admin!="undefined"&&!!admin)||(typeof rol!="undefined"&&/admin/i.test(rol))}catch(e){return false}};
const K={};const key=c=>String(c.baseId||c.db||c.id);
const VISTAS=["Vista frontal · placa","Vista lateral","Vista superior","Vista trasera","Vista conector","Ubicación"];

/* ---------- ficha con barra de edición ---------- */
const base=window.compFicha;
if(typeof base=="function")window.compFicha=function(c){const h=base(c);if(!c)return h;const k=key(c);K[k]=c;
 const bar=puede()?`<div class="cedb"><button type="button" class="sec" onclick="event.stopPropagation();compEdita('${E(k).replace(/'/g,"\\'")}')">✏️ Editar ficha</button><label class="sec" onclick="event.stopPropagation()">📷 Foto nueva<input type="file" accept="image/*" hidden onchange="compFotoNueva('${E(k).replace(/'/g,"\\'")}',this)"></label></div>`:"";
 return h.replace('<div class="cmpf">',`<div class="cmpf" data-ck="${E(k)}">${bar}`)};

/* ---------- estado del editor ---------- */
let cur=null,ED=null,capa=null,sucio=false;
const sinRep=a=>(a||[]).filter(r=>!/^repuesto$/i.test(r[0]||""));
function desde(c){const r=c.raw||{};const st=r.stock||{};
 return{codigo:c.id||"",titulo:c.t||"",fab:c.fab||"",claves:c.claves||r.claves||"",
  esp:(r.esp?r.esp:sinRep(c.esp)).map(x=>[x[0]||"",x[1]||""]),pin:(c.pin||[]).map(x=>x.slice(0,4)),med:(c.med||[]).slice(),av:c.av||"",
  fotos:(c.fotos||[]).map(([src,vista,m])=>m&&m.o?{src,vista,o:m.o,caja:m.caja}:{src,vista}),stock:{ref:st.ref||"",sust:st.sust||"",ubi:st.ubi||"",uds:st.uds==null?"":st.uds}}}
async function foto(f){const im=await window.compLeeImg(f);const cv=window.compAJpg(im,1400);return cv.toDataURL("image/jpeg",.85)}

window.compEdita=function(k,nuevas){const c=K[k]||(window.COMP_CAMPO||[]).find(x=>key(x)==k);if(!c){msg("Ficha no encontrada");return}
 if(!puede()){msg("Solo técnicos y administrador pueden editar");return}
 cur=c;ED=desde(c);sucio=!!nuevas;if(nuevas)nuevas.forEach(src=>ED.fotos.unshift({src,vista:VISTAS[0]}));abre();pinta()};
window.compFotoNueva=async function(k,inp){const fs=[...(inp.files||[])];inp.value="";if(!fs.length)return;
 try{const src=await conRec(await foto(fs[0]));compEdita(k,[src]);msg("Foto añadida: revisa la vista y pulsa Guardar")}catch(e){msg(String(e.message||e))}};

function abre(){if(!capa){capa=document.createElement("div");capa.id="cedCapa";document.body.appendChild(capa);
  ["click","dblclick","touchend","pointerdown"].forEach(t=>capa.addEventListener(t,e=>e.stopPropagation()));
  capa.addEventListener("input",lee,true);capa.addEventListener("change",lee,true)}
 capa.style.display="flex";document.documentElement.classList.add("cedOn");try{history.pushState({ced:1},"")}catch(e){}}
function cierra(desdeHist){if(!capa||capa.style.display=="none")return;capa.style.display="none";document.documentElement.classList.remove("cedOn");cur=null;ED=null;
 if(!desdeHist){try{if(history.state&&history.state.ced)history.back()}catch(e){}}}
addEventListener("popstate",()=>{if(capa&&capa.style.display!="none")cierra(true)});
window.compEditaCierra=()=>{if(window.fotoOrdenLimpia)fotoOrdenLimpia();if(sucio&&!confirm("¿Salir sin guardar los cambios?"))return;cierra(false)};

/* lee los campos al vuelo para no perder lo escrito al repintar */
function lee(e){if(!ED)return;const t=e.target;if(!t||!t.dataset)return;const f=t.dataset.f;if(!f)return;sucio=true;
 const v=t.value;const i=+t.dataset.i,j=+t.dataset.j;
 if(f=="esp")ED.esp[i][j]=v;else if(f=="pin")ED.pin[i][j]=v;else if(f=="med")ED.med[i]=v;else if(f=="vista")ED.fotos[i].vista=v;
 else if(f.startsWith("st."))ED.stock[f.slice(3)]=v;else ED[f]=v}

const filaEsp=(r,i)=>`<div class="cedr"><input data-f="esp" data-i="${i}" data-j="0" value="${E(r[0])}" placeholder="Dato"><textarea data-f="esp" data-i="${i}" data-j="1" rows="${String(r[1]).length>28?3:1}" placeholder="Valor">${E(r[1])}</textarea><button type="button" class="sec cedx" onclick="compEdOp('esp-',${i})" aria-label="Quitar fila">✕</button></div>`;
const filaPin=(r,i)=>`<div class="cedr ced4">${[0,1,2,3].map(j=>`<input data-f="pin" data-i="${i}" data-j="${j}" value="${E(r[j]||"")}" placeholder="${["Pin","Color","Señal","Función"][j]}">`).join("")}<button type="button" class="sec cedx" onclick="compEdOp('pin-',${i})" aria-label="Quitar fila">✕</button></div>`;
const filaMed=(r,i)=>`<div class="cedr"><span class="cedn">${i+1}.</span><textarea data-f="med" data-i="${i}" rows="3">${E(r)}</textarea><button type="button" class="sec cedx" onclick="compEdOp('med-',${i})" aria-label="Quitar paso">✕</button></div>`;

function pinta(){if(!capa||!ED)return;const p=ED;const sc=(capa.querySelector(".cedl")||{}).scrollTop||0;
 const dl=`<datalist id="ced_vis">${VISTAS.map(v=>`<option value="${E(v)}">`).join("")}</datalist>`;
 capa.innerHTML=`<div class="cedfix"><button type="button" class="sec cedb0" aria-label="Volver" onclick="compEditaCierra()">←</button><div class="cedti"><b>✏️ Editar ficha</b><small>${E(cur.id)}${cur.raw?"":" · ficha de fábrica"}</small></div><button type="button" class="pri cedg" onclick="compEdGuarda()">💾 Guardar</button></div>
 <div class="cedl">${dl}
 <div class="cedst">Fotos</div>
 <div class="cedst" style="margin-top:-4px;font-weight:500;text-transform:none;letter-spacing:0;font-size:11.5px;opacity:.75">Toca para ampliar · mantén y arrastra para cambiar de sitio (la 1.ª es la principal)</div><div class="cedfs" data-fg="ced">${p.fotos.map((f,i)=>`<figure data-fi="${i}"><img src="${E(f.src)}" alt="">${i==0?'<span class="cedp">Principal</span>':""}
   <input list="ced_vis" data-f="vista" data-i="${i}" value="${E(f.vista)}" placeholder="Vista">
   <div class="cedfb">${/^ubicaci/i.test(f.vista||"")?`<button type="button" class="sec" title="Marcar la ubicación (recuadro naranja)" onclick="compEdUbi(${i})">📍</button>`:`<button type="button" class="sec" title="Recortar" onclick="compEdRec(${i})">✂️</button><button type="button" class="sec" title="Usar como foto de ubicación: la IA localiza el componente y lo marca en naranja" onclick="compEdUbiIA(${i})">📍</button>`}<label class="sec" title="Sustituir">🔄<input type="file" accept="image/*" hidden onchange="compEdFoto(this,${i})"></label>${i?`<button type="button" class="sec" title="Poner la primera" onclick="compEdOp('foto^',${i})">⭐</button>`:""}<button type="button" class="sec" title="Quitar" onclick="compEdOp('foto-',${i})">🗑</button></div></figure>`).join("")}
  <label class="cedadd">📷<span>Añadir foto</span><input type="file" accept="image/*" multiple hidden onchange="compEdFoto(this,-1)"></label></div>
 <label>Código (de los planos)</label><input data-f="codigo" value="${E(p.codigo)}">
 <label>Título</label><input data-f="titulo" value="${E(p.titulo)}">
 <label>Fabricante · modelo · referencia</label><input data-f="fab" value="${E(p.fab)}" placeholder="Ej. Schneider · ref. …">
 <label>Averías en que interviene (palabras del aviso, separadas por comas)</label><input data-f="claves" value="${E(p.claves)}"${cur.raw?"":` placeholder="Opcional: se suman a las de fábrica"`}>
 <div class="cedst">Especificaciones</div>${p.esp.map(filaEsp).join("")}<button type="button" class="sec cedmas" onclick="compEdOp('esp+')">➕ Añadir especificación</button>
 <div class="cedst">Conexionado</div>${p.pin.map(filaPin).join("")}<button type="button" class="sec cedmas" onclick="compEdOp('pin+')">➕ Añadir pin</button>
 <div class="cedst">Medir en campo</div>${p.med.map(filaMed).join("")}<button type="button" class="sec cedmas" onclick="compEdOp('med+')">➕ Añadir paso</button>
 <label>Aviso al sustituir</label><textarea data-f="av" rows="3">${E(p.av)}</textarea>
 <div class="cedst">Repuesto</div><div class="cedrep"><input data-f="st.ref" value="${E(p.stock.ref)}" placeholder="Referencia"><input data-f="st.sust" value="${E(p.stock.sust)}" placeholder="Sustituto compatible"><input data-f="st.ubi" value="${E(p.stock.ubi)}" placeholder="Ubicación almacén"><input data-f="st.uds" inputmode="numeric" value="${E(p.stock.uds)}" placeholder="Unidades"></div>
 <button type="button" class="pri" style="margin-top:14px" onclick="compEdGuarda()">💾 Guardar cambios</button>
 ${esAdmin()&&cur.db?(cur.baseId?`<button type="button" class="sec cedrs" onclick="compEdBorra()">↩️ Restaurar ficha original</button>`:`<button type="button" class="sec cedrs" onclick="compEdBorra()">🗑 Eliminar componente</button>`):""}
 </div>`;
 const l=capa.querySelector(".cedl");if(l)l.scrollTop=sc}

(window.FOTO_ORDEN=window.FOTO_ORDEN||{}).ced={mueve:(i,j)=>{if(!ED||!ED.fotos[i]||!ED.fotos[j])return;[ED.fotos[i],ED.fotos[j]]=[ED.fotos[j],ED.fotos[i]];sucio=true;pinta()},
 toca:i=>{if(ED&&ED.fotos[i]&&typeof compVer=="function")compVer(ED.fotos[i].src,ED.fotos.map(f=>f.src),i)}};
window.compEdOp=function(op,i){if(!ED)return;sucio=true;
 if(op=="esp+")ED.esp.push(["",""]);else if(op=="esp-")ED.esp.splice(i,1);
 else if(op=="pin+")ED.pin.push(["","","",""]);else if(op=="pin-")ED.pin.splice(i,1);
 else if(op=="med+")ED.med.push("");else if(op=="med-")ED.med.splice(i,1);
 else if(op=="foto-"){if(!confirm("¿Quitar esta foto de la ficha?"))return;ED.fotos.splice(i,1)}
 else if(op=="foto^"){const f=ED.fotos.splice(i,1)[0];ED.fotos.unshift(f)}
 pinta();if(/\+$/.test(op)){const l=capa.querySelector(".cedl");const b=[...capa.querySelectorAll(".cedmas")].find(x=>x.getAttribute("onclick").includes(op));
  if(b){const prev=b.previousElementSibling;const inp=prev&&prev.querySelector("input,textarea");if(inp)try{inp.focus({preventScroll:false})}catch(e){}}}};
/* v535: recortar (sin vecinos ni cables); al añadir o sustituir una foto se abre el recorte directamente */
/* v547: volver a marcar el recuadro naranja de la foto de UBICACIÓN sobre la foto de conjunto original (sin marcar) */
window.compEdUbi=async function(i){const f=ED&&ED.fotos[i];if(!f||typeof compRecorta!="function"||typeof compMarcaCaja!="function")return;
 const base=f.o||f.src;if(!f.o&&!confirm("Esta foto de ubicación no guarda la foto de conjunto sin marcar: el recuadro nuevo se pintará encima del antiguo. Para dejarla limpia, sustitúyela (🔄) por la foto de conjunto original y márcala. ¿Seguir?"))return;
 const r=await compRecorta(base,f.caja,{titulo:"📍 Marcar la ubicación",sub:"Ajusta el recuadro naranja sobre el elemento dentro de la foto de conjunto",ok:"📍 Marcar"});if(!r)return;
 try{f.src=await compMarcaCaja(base,r.caja,1000);f.o=base;f.caja=r.caja;sucio=true;pinta()}catch(e){msg(String(e.message||e))}};
/* ===== v555: convertir una foto añadida en FOTO DE UBICACIÓN: la IA localiza el componente (con la foto principal recortada
   como referencia) dentro de la foto de conjunto, se marca con el recuadro naranja y se ajusta con 📍 antes de guardar ===== */
const cargaImg=src=>new Promise((ok,ko)=>{const im=new Image();im.crossOrigin="anonymous";im.onload=()=>ok(im);im.onerror=()=>ko(new Error("No se pudo abrir la foto"));im.src=src});
/* compartida con Incorporar componente: localiza el componente (ref = foto recortada) en la foto de conjunto base */
window.compUbicaIA=async function(base,refSrc,info,motor){info=info||{};
 const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;if(!tok)throw new Error("Inicia sesión para usar la IA");
 const g=await cargaImg(base);const r=refSrc?await cargaImg(refSrc):null;
 const H=900,wg=Math.round(g.naturalWidth*H/g.naturalHeight),wr=r?Math.round(r.naturalWidth*H/r.naturalHeight):0,sep=r?24:0;
 const cv=document.createElement("canvas");cv.width=Math.min(2400,wr+sep+wg);const k=cv.width/(wr+sep+wg);cv.height=Math.round(H*k);
 const x=cv.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,cv.width,cv.height);if(r)x.drawImage(r,0,0,wr*k,H*k);x.drawImage(g,(wr+sep)*k,0,wg*k,H*k);
 const RX=(wr+sep)/(wr+sep+wg);const img=cv.toDataURL("image/jpeg",.85).split(",")[1];const cod=info.codigo||"",tit=info.titulo||"";
 const prompt=`Imagen de una pasarela de embarque (PBB) TKE de Madrid Barajas. ${r?`A la IZQUIERDA (hasta x=${Math.round(RX*1000)} milésimas) está el componente ${cod} «${tit}» RECORTADO, como referencia; a la DERECHA (desde x=${Math.round(RX*1000)}) está una FOTO DE CONJUNTO (armario, carril DIN, regleta…).`:`La imagen es una FOTO DE CONJUNTO (armario, carril DIN, regleta…) donde está el componente ${cod} «${tit}» (${info.fab||""}).`}
TAREA: localiza ESE componente dentro de la foto de conjunto (por su forma, color, placa, etiqueta con el código ${cod} y el texto impreso). Si hay varios iguales, elige el que lleve la etiqueta ${cod}; si no se distingue, el que más se parezca a la referencia y dilo.
Da su caja ajustada al cuerpo del componente en MILÉSIMAS (0-1000) de la imagen COMPLETA que recibes (x0,y0 esquina superior izquierda; x1,y1 inferior derecha), sin incluir los elementos de al lado. Indica el bloque en que está montado y su posición contando los elementos del bloque de izquierda a derecha.
Responde SOLO con JSON: {"encontrado":true,"caja":{"x0":0,"y0":0,"x1":0,"y1":0},"bloque":"","posicion":"","total":0,"justificacion":""}`;
 const rs=await fetch(SUPABASE_URL+"/functions/v1/leer-ia",{method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},body:JSON.stringify({img,tipo:"image/jpeg",prompt,motor})});
 const j=await rs.json().catch(()=>({}));if(!rs.ok)throw new Error(j.mensaje||j.error||("error "+rs.status));
 const m=String(j.txt||"").match(/\{[\s\S]*\}/);if(!m)throw new Error("La IA no devolvió datos");const P=JSON.parse(m[0]);
 if(P.encontrado===false||!P.caja)throw new Error("La IA no encuentra "+(cod||"el componente")+" en esta foto"+(P.justificacion?": "+P.justificacion:""));
 const n=v=>{v=+v;return isFinite(v)?(v>1.5?v/1000:v):NaN};let c={x0:n(P.caja.x0),y0:n(P.caja.y0),x1:n(P.caja.x1),y1:n(P.caja.y1)};
 if(![c.x0,c.y0,c.x1,c.y1].every(isFinite))throw new Error("Caja no válida");
 const cx=v=>Math.max(0,Math.min(1,(v-RX)/(1-RX)));c={x0:cx(Math.min(c.x0,c.x1)),x1:cx(Math.max(c.x0,c.x1)),y0:Math.max(0,Math.min(c.y0,c.y1)),y1:Math.min(1,Math.max(c.y0,c.y1))};
 const mg=.015;c={x0:Math.max(0,c.x0-mg),y0:Math.max(0,c.y0-mg),x1:Math.min(1,c.x1+mg),y1:Math.min(1,c.y1+mg)};
 if(c.x1-c.x0<.01||c.y1-c.y0<.01)throw new Error("La IA dio una caja vacía: márcala a mano con 📍");
 const bl=String(P.bloque||"").trim(),ps=String(P.posicion||"").trim();
 return{caja:c,src:await compMarcaCaja(base,c,1000),vista:"Ubicación"+(bl?" · "+bl:"")+(ps?" · posición "+ps.replace(/^posici[oó]n\s*/i,""):""),lector:j.lector||motor}};
window.compEdUbiIA=async function(i){const f=ED&&ED.fotos[i];if(!f)return;
 const ref=ED.fotos.find((x,j)=>j!==i&&!/^ubicaci/i.test(x.vista||""));
 const motor=typeof window.compPideMotor=="function"?await window.compPideMotor():"claude";if(!motor)return;
 const ov=espera((motor=="claude"?"Claude":"Gemini")+" está localizando "+(ED.codigo||"el componente")+" en la foto…");
 try{const base=f.o||f.src;const R=await compUbicaIA(base,ref&&ref.src,{codigo:ED.codigo,titulo:ED.titulo,fab:ED.fab},motor);
  f.o=base;f.caja=R.caja;f.src=R.src;f.vista=R.vista;sucio=true;pinta();msg("📍 Ubicado con "+R.lector+". Revisa el recuadro (📍 para ajustarlo) y pulsa GUARDAR")}
 catch(e){msg(String((e&&e.message)||e))}finally{ov.remove()}};
function espera(t){const ov=document.createElement("div");ov.style.cssText="position:fixed;inset:0;z-index:100006;background:#0008;display:flex;align-items:center;justify-content:center;color:#fff;font:700 16px system-ui;text-align:center;padding:20px";ov.textContent="⏳ "+t;document.body.appendChild(ov);return ov}
window.compEspera=espera;
window.compEdRec=async function(i){if(!ED||!ED.fotos[i]||typeof compRecorta!="function")return;const r=await compRecorta(ED.fotos[i].src);if(!r)return;ED.fotos[i].src=r.src;sucio=true;pinta()};
const conRec=async src=>{if(typeof compRecorta!="function")return src;const r=await compRecorta(src);return r?r.src:src};
window.compEdFoto=async function(inp,i){const fs=[...(inp.files||[])];inp.value="";if(!fs.length||!ED)return;sucio=true;
 try{if(i>=0&&/^ubicaci/i.test(ED.fotos[i].vista||"")){const f=ED.fotos[i];f.o=await foto(fs[0]);f.src=f.o;f.caja=null;pinta();await compEdUbi(i);return}if(i>=0){ED.fotos[i].src=await conRec(await foto(fs[0]))}else{if(fs.length==1&&confirm("¿Es una foto de UBICACIÓN (de conjunto: armario, carril, regleta…)?\n\nAceptar: la IA localiza "+(ED.codigo||"el componente")+" y lo marca con el recuadro naranja.\nCancelar: foto normal del componente (se recorta).")){const raw=await foto(fs[0]);ED.fotos.push({src:raw,o:raw,vista:"Ubicación"});pinta();await compEdUbiIA(ED.fotos.length-1);return}
  for(const f of fs)ED.fotos.push({src:await conRec(await foto(f)),vista:VISTAS[Math.min(ED.fotos.length,VISTAS.length-1)]})}pinta()}
 catch(e){msg(String(e.message||e))}};

const limpia=a=>a.map(r=>r.map(x=>String(x||"").trim())).filter(r=>r.some(Boolean));
window.compEdGuarda=async function(){if(!ED||!cur)return;const p=ED;const b=capa.querySelectorAll(".cedg,.cedl>.pri");b.forEach(x=>x.disabled=true);
 const row={codigo:p.codigo.trim()||cur.id,titulo:p.titulo.trim()||cur.t,fab:p.fab.trim(),claves:p.claves.trim(),
  esp:limpia(p.esp),pin:limpia(p.pin),med:p.med.map(x=>String(x).trim()).filter(Boolean),av:p.av.trim(),
  fotos:p.fotos.map(f=>Object.assign({src:f.src,vista:(f.vista||"").trim()||"Vista"},f.o&&f.caja?{o:f.o,caja:f.caja}:{})),stock:p.stock};
 if(!cur.raw&&!cur.db)row.base=cur.id;
 try{let r;
  if(cur.db){r=await sb.from("componentes_campo").update(row).eq("id",cur.db).select().single()}
  else{row.creado_por=(typeof user!="undefined"&&user&&user.email)||"";r=await sb.from("componentes_campo").insert(row).select().single()}
  if(r.error)throw r.error;if(!r.data)throw new Error("Sin permiso para guardar");
  const k=key(cur);sucio=false;
  if(typeof compRecarga=="function")await compRecarga();
  const nc=(window.COMP_CAMPO||[]).find(x=>String(x.db)==String(r.data.id));
  cierra(false);refresca(k,nc);msg("Ficha "+row.codigo+" guardada")}
 catch(e){b.forEach(x=>x.disabled=false);msg("No se pudo guardar: "+String((e&&e.message)||e))}};
window.compEdBorra=async function(){if(!cur||!cur.db)return;const res=!!cur.baseId;
 if(!confirm(res?"¿Restaurar la ficha original de fábrica? Se pierden los cambios guardados.":"¿Eliminar este componente del catálogo para todos los técnicos?"))return;
 try{const {error}=await sb.from("componentes_campo").delete().eq("id",cur.db);if(error)throw error;const k=key(cur);
  if(typeof compRecarga=="function")await compRecarga();const nc=res?(window.COMP_CAMPO||[]).find(x=>key(x)==k):null;
  sucio=false;cierra(false);refresca(k,nc);msg(res?"Ficha original restaurada":"Componente eliminado")}
 catch(e){msg("No se pudo: "+String((e&&e.message)||e))}};

/* repinta la ficha donde esté abierta (guía, catálogo, consulta de repuestos) sin cerrar los desplegables */
function refresca(k,nc){
 if(typeof compNavLista=="function")compNavLista();
 document.querySelectorAll(`.cmpf[data-ck="${CSS.escape(k)}"]`).forEach(el=>{
  if(!nc){const d=el.closest("details.icpi");(d||el).remove();return}
  const t=document.createElement("div");t.innerHTML=window.compFicha(nc);el.replaceWith(t.firstElementChild);
  const d=document.querySelector(`.cmpf[data-ck="${CSS.escape(key(nc))}"]`);const s=d&&d.closest("details");const sm=s&&s.querySelector(":scope>summary");
  if(sm&&s.classList.contains("icpi"))sm.innerHTML=`<span class="cmpid">${E(nc.id)}</span> ${E(nc.t)}`})}

const st=document.createElement("style");st.textContent=`
.cedb{display:flex;gap:6px;justify-content:flex-end;margin:-2px 0 6px}
.cedb .sec{width:auto!important;margin:0!important;padding:6px 10px!important;font-size:12.5px!important;font-weight:700;display:inline-flex;align-items:center;gap:4px;cursor:pointer;min-height:0!important}
#cedCapa{position:fixed;inset:0;z-index:100;background:var(--bg,#0e1014);color:var(--tx,#e9ecf1);display:none;flex-direction:column;
 padding:max(10px,env(safe-area-inset-top)) 12px 0}
html.cedOn{overflow:hidden}
#cedCapa .cedfix{flex:none;display:flex;align-items:center;gap:10px;padding-bottom:8px;border-bottom:1px solid var(--bd,#2a2f38)}
#cedCapa .cedb0{width:44px!important;height:44px;margin:0!important;padding:0!important;font-size:22px;font-weight:800;flex:none}
#cedCapa .cedti{flex:1;min-width:0;display:flex;flex-direction:column}#cedCapa .cedti b{font-size:17px}
#cedCapa .cedti small{font-size:11px;color:var(--mu,#8a93a3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#cedCapa .cedg{width:auto!important;margin:0!important;padding:10px 14px!important;font-size:14px!important;flex:none}
#cedCapa .cedl{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding-bottom:calc(90px + env(safe-area-inset-bottom,0px))}
#cedCapa input,#cedCapa textarea{font-size:16px;margin:0}
#cedCapa label{margin:12px 0 4px}
#cedCapa .cedst{font-weight:800;font-size:13px;margin:16px 0 6px;text-transform:uppercase;letter-spacing:.04em;color:var(--ac,#ff8a2b)}
#cedCapa .cedfs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
#cedCapa .cedfs figure{position:relative;margin:0;background:#fff;border:1px solid #cfd8dc;border-radius:10px;padding:6px;display:flex;flex-direction:column;gap:5px}
#cedCapa .cedfs img{width:100%;height:120px;object-fit:contain;background:#fff;cursor:zoom-in}
#cedCapa .cedfs input{font-size:13px;padding:6px;background:#fff;color:#111;border-color:#cfd8dc}
#cedCapa .cedp{position:absolute;top:8px;left:8px;background:#f0700a;color:#fff;font-size:10px;font-weight:800;border-radius:6px;padding:1px 6px}
#cedCapa .cedfb{display:flex;gap:4px}#cedCapa .cedfb>*{flex:1;margin:0!important;padding:6px 0!important;text-align:center;font-size:15px;background:#eceff1;color:#111;border:1px solid #cfd8dc;border-radius:8px;cursor:pointer;min-height:0!important;width:auto!important}
#cedCapa .cedadd{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:170px;border:2px dashed var(--ac,#ff8a2b);border-radius:10px;color:var(--ac,#ff8a2b);font-size:28px;cursor:pointer}
#cedCapa .cedadd span{font-size:13px;font-weight:800}
#cedCapa .cedr{display:flex;gap:6px;align-items:flex-start;margin-bottom:6px}#cedCapa .cedr input,#cedCapa .cedr textarea{flex:1;min-width:0;padding:8px}
#cedCapa .cedr input:first-child{flex:.7}#cedCapa .cedr textarea{font-size:15px;line-height:1.3;resize:vertical}#cedCapa .ced4 input{flex:1!important;font-size:14px}
#cedCapa .cedn{flex:none;font-weight:800;padding-top:9px;width:20px}
#cedCapa .cedx{width:36px!important;height:38px;flex:none;margin:0!important;padding:0!important;font-size:15px}
#cedCapa .cedmas{width:100%!important;margin:2px 0 0!important;padding:9px!important;font-size:13.5px!important;border-style:dashed!important}
#cedCapa .cedrep{display:grid;grid-template-columns:1fr 1fr;gap:6px}
#cedCapa .cedrs{width:100%!important;margin:12px 0 0!important;color:#e53935!important;border-color:#e53935!important}`;
document.head.appendChild(st);
})();
