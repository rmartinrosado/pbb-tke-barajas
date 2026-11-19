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
/* v591: las claves genéricas sueltas («cabina», «relé», «bornero», «24 V», «analógica»…) ya NO traen el componente:
   «cabina» metía el relé de iluminación E-K10 en un fallo de medida analógica de cabina. Una clave cuenta solo si tiene
   alguna palabra propia; y las palabras se comparan desde su inicio (no «rele» dentro de «relevante»). */
const GEN=new Set("cabina tunel rotonda pupitre brazo rele reles contactor bornero borneros regleta borna bornas borne cableado mazo tierra pe manguera mangueras conexion senal senales 24 24v vdc 230 400 v vac alimentacion tension seguridad seguridades proteccion armario mando luz luces analogica potenciometro convertidor sensor motor subir bajar plc fuente bobina contacto mantenimiento retorno interconexion circuito auxiliar falso salida entrada digital de del la el los las en y o a e ae p".split(" "));
const reDe=cl=>{const ws=String(cl||"").split(/[,;\n]+/).map(w=>nrm(w).trim().split(/[^a-z0-9.\-]+/).filter(Boolean)).filter(ps=>ps.length&&ps.some(p=>!GEN.has(p)&&!/^alarma$/.test(p)));if(!ws.length)return()=>false;
 const R=ws.map(ps=>ps.map(p=>new RegExp("(^|[^a-z0-9])"+(/^\d+$/.test(p)?"0*"+p+"(?![0-9])":p.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+(/^[a-z]{1,3}\d?-[a-z]{1,3}\d/.test(p)?"(?![0-9]|\\.[0-9])":"")))));
 return t=>R.some(rs=>rs.every(r=>r.test(t)))};
/* ===== v560: las fotos (≈51 MB en base64) ya NO se descargan con la lista: se perdían los componentes porque la consulta
   con todas las fotos fallaba y solo quedaban las fichas de fábrica. La lista llega sin fotos y estas se cargan después,
   de pocas en pocas, y al abrir una ficha; se guardan en memoria (FC) para no volver a bajarlas. ===== */
const FC={};
const mapF=fs=>(fs||[]).map(f=>f.o&&f.caja?[f.src,f.vista||"Vista",{o:f.o,caja:f.caja}]:[f.src,f.vista||"Vista"]);
window.compFotosPon=(id,fs)=>{if(!id||!Array.isArray(fs))return;FC[id]=fs;C().forEach(c=>{if(String(c.db)==String(id)){c.fotos=mapF(fs);c._fp=false;if(c.raw)c.raw.fotos=fs}})};
const pend=new Map();
window.compFotosAsegura=async function(c){if(!c||!c._fp||!c.db)return c;if(FC[c.db]){compFotosPon(c.db,FC[c.db]);return c}
 if(!pend.has(c.db))pend.set(c.db,(async()=>{try{const {data,error}=await sb.from("componentes_campo").select("id,fotos").eq("id",c.db).single();if(!error&&data)compFotosPon(data.id,data.fotos||[])}catch(e){}finally{pend.delete(c.db)}})());
 await pend.get(c.db);return c};
let fondoOn=false;
async function fondo(){if(fondoOn)return;fondoOn=true;try{
 const ids=C().filter(c=>c._fp&&c.db&&!FC[c.db]).map(c=>c.db);
 for(let i=0;i<ids.length;i+=3){const lote=ids.slice(i,i+3).filter(id=>!FC[id]);if(!lote.length)continue;
  try{const {data,error}=await sb.from("componentes_campo").select("id,fotos").in("id",lote);if(!error&&data)data.forEach(r=>compFotosPon(r.id,r.fotos||[]))}catch(e){}}
 if(typeof compNavLista=="function")compNavLista()}finally{fondoOn=false}}
function aComp(r){if(Array.isArray(r.fotos))FC[r.id]=r.fotos;const fs=Array.isArray(r.fotos)?r.fotos:FC[r.id];return{_fp:!fs,id:r.codigo,t:r.titulo,fab:r.fab||"",db:r.id,claves:r.claves||"",re:(()=>{const f=reDe(r.claves),c=nrm(r.codigo).replace(/\s/g,"");const rc=c.length>=4?new RegExp("(^|[^a-z0-9])"+c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![0-9]|\\.[0-9])"):null;return t=>f(t)||(!!rc&&rc.test(t.replace(/\s*-\s*/g,"-")))})(), /* v610: el código casa entero (E-Q1 ya no casa dentro de E-Q12) */
 fotos:mapF(fs),esp:(r.esp||[]).concat(r.stock&&Object.values(r.stock).some(Boolean)?[["Repuesto",[r.stock.ref&&"Ref. "+r.stock.ref,r.stock.sust&&"Sustituto: "+r.stock.sust,r.stock.ubi&&"Almacén: "+r.stock.ubi,r.stock.uds!=null&&r.stock.uds!==""&&r.stock.uds+" uds."].filter(Boolean).join(" · ")]]:[]),
 pin:r.pin||[],pint:"Conexionado",med:r.med||[],av:r.av||"",raw:r}}
/* v534: fichas de fábrica (componentes.js) editadas desde la PWA → fila con base = código original; sustituye a la ficha
   en su MISMO sitio (conserva su reconocimiento de avisos) y se puede restaurar. */
const BASE=C().slice();window.COMP_BASE=BASE;
function sobre(b,r){const n=aComp(r);if(n._fp){n.fotos=b.fotos;}const rb=b.re,rn=n.re;return Object.assign({},b,n,{baseId:b.id,pint:b.pint,re:t=>{try{if(rb(t))return true}catch(e){}return rn(t)}})}
async function carga(){try{const {data,error}=await sb.from("componentes_campo").select("id,codigo,titulo,fab,claves,esp,pin,med,av,stock,creado_por,creado,base,fotos,ficha") /* v561: fotos en el almacén → solo direcciones (≈45 kB) */.order("creado",{ascending:true});if(error||!data){console.warn("componentes_campo:",error);return}
 const L=C();L.length=BASE.length;BASE.forEach((b,i)=>L[i]=b);
 data.forEach(r=>{const i=r.base?BASE.findIndex(b=>b.id==r.base):-1;if(i>=0)L[i]=sobre(BASE[i],r);else L.push(aComp(r))});
 if(typeof compNavLista=="function")compNavLista();setTimeout(fondo,300)}catch(e){console.warn("componentes_campo:",e)}}
window.compRecarga=carga;window.compAComp=aComp;
setTimeout(carga,1500);setInterval(carga,10*60*1000);
/* ---------- utilidades de imagen ---------- */
const lee=window.compLeeImg=f=>new Promise((ok,ko)=>{const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{ok(im);};im.onerror=()=>{URL.revokeObjectURL(u);ko(new Error("No se pudo abrir la foto"))};im.src=u});
window.compAJpg=aJpg;function aJpg(im,max){const k=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement("canvas");c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);
 const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);return c}
let GEO=null;/* v535: geometría del collage para pasar la caja de recorte de la IA a cada foto */
function collage(cs){const W=1600,h=Math.max(...cs.map(c=>c.height*(W/cs.length)/c.width));const cv=document.createElement("canvas");cv.width=W;cv.height=Math.min(1600,Math.round(h));
 const x=cv.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,cv.width,cv.height);const w=W/cs.length;GEO={W,H:cv.height,p:[]};cs.forEach((c,i)=>{const k=Math.min(w/c.width,cv.height/c.height);const ox=i*w+(w-c.width*k)/2,oy=(cv.height-c.height*k)/2;GEO.p.push({ox,oy,dw:c.width*k,dh:c.height*k});x.drawImage(c,ox,oy,c.width*k,c.height*k)});return cv.toDataURL("image/jpeg",.85)}
/* caja de la IA (milésimas de la imagen completa) → foto i y caja en fracción de esa foto */
function cajaFoto(b){if(!GEO||!b)return null;const n=v=>{v=+v;return isFinite(v)?(v>1.5?v/1000:v):NaN};
 const X0=n(b.x0)*GEO.W,X1=n(b.x1)*GEO.W,Y0=n(b.y0)*GEO.H,Y1=n(b.y1)*GEO.H;if([X0,X1,Y0,Y1].some(isNaN)||X1<=X0||Y1<=Y0)return null;
 const cx=(X0+X1)/2;const i=GEO.p.findIndex(p=>cx>=p.ox-2&&cx<=p.ox+p.dw+2);if(i<0)return null;const p=GEO.p[i];
 const f=(v,o,d)=>Math.max(0,Math.min(1,(v-o)/d));let c={x0:f(X0,p.ox,p.dw),x1:f(X1,p.ox,p.dw),y0:f(Y0,p.oy,p.dh),y1:f(Y1,p.oy,p.dh)};
 const mx=(c.x1-c.x0)*.04,my=(c.y1-c.y0)*.04;c={x0:Math.max(0,c.x0-mx),x1:Math.min(1,c.x1+mx),y0:Math.max(0,c.y0-my),y1:Math.min(1,c.y1+my)};
 if(c.x1-c.x0<.03||c.y1-c.y0<.03)return null;return{i,c}}
/* ---------- catálogo ---------- */
window.compCatalogo=function(q){q=q||"";const t=nrm(q);const L=C().filter(c=>!t||nrm([c.id,c.t,c.fab,c.claves].join(" ")).includes(t)).sort(typeof compOrdenAlf=="function"?compOrdenAlf:(a,b)=>String(a.id||"").localeCompare(String(b.id||""),"es",{numeric:true}));/* v570: orden alfabético */
 $("#sheetc").innerHTML=`<div class="icpw"><div class="icpfix"><div class="icph"><h3 style="margin:0">🔩 Componentes de campo</h3><button class="sec" onclick="closeSheet()" style="width:auto;margin:0">✕</button></div>
 ${(typeof tecnico!="undefined"&&tecnico)||(typeof admin!="undefined"&&admin)?`<button class="pri" style="margin:8px 0 2px" onclick="compIncorpora()">➕ Incorporar componente (foto)</button>`:""}
 <div class="icpb"><input id="icp_q" type="search" placeholder="Buscar código, nombre o modelo" value="${E(q)}" onkeyup="if(event.key=='Enter')compCatalogo(this.value)"><button class="sec" onclick="compCatalogo(document.getElementById('icp_q').value)" style="width:auto;margin:0">🔍</button></div></div>
 <div class="icpl"><div class="mu" style="font-size:12px;margin:6px 0">${L.length} ficha${L.length==1?"":"s"}</div>
 ${L.map((c,i)=>`<details class="icpi"><summary><span class="cmpid">${E(c.id)}</span> ${E(c.t)}</summary>${typeof compFicha=="function"?compFicha(c):""}</details>`).join("")}</div></div>`;
 $("#sheet").style.display="flex"};
/* ---------- incorporar ---------- */
let F=[];const VISTAS=["Vista frontal · placa","Vista lateral","Vista trasera","Vista conector"];
window.compIncorpora=function(){F=[];GRUPO=null;PROP=null;pinta()};
function pinta(P){const p=P||{};$("#sheetc").innerHTML=`<div class="icph"><h3 style="margin:0">➕ Incorporar componente</h3><button class="sec" onclick="compCatalogo()" style="width:auto;margin:0">✕</button></div>
 <div class="mu" style="font-size:12.5px;margin:4px 0 8px">Haz fotos nítidas de la placa (texto impreso) y del componente; si puedes, también del cable o su marcado. La IA lee la placa y propone el código cruzándolo con los planos. Revisa antes de guardar.</div>
 <label class="btn" style="margin:0;justify-content:center;gap:6px;padding:12px">📷 Añadir foto<input type="file" accept="image/*" multiple hidden onchange="compFotos(this)"></label>
 <label class="btn" style="margin:6px 0 0;justify-content:center;gap:6px;padding:10px">📍 Añadir foto de ubicación<input type="file" accept="image/*" multiple hidden onchange="compFotoUbi(this)"></label>
 <div class="icf" data-fg="inc">${F.map((f,i)=>`<figure data-fi="${i}"><img src="${f.src}" alt=""><select onchange="compVista(${i},this.value)">${(VISTAS.includes(f.vista)||!f.vista?VISTAS:VISTAS.concat([f.vista])).map(v=>`<option${v==f.vista?" selected":""}>${v}</option>`).join("")}</select><div class="icfb"><button class="sec" title="Recortar" onclick="compRecInc(${i})">✂️</button>${f.ubi?"":`<button class="sec" title="Usar como foto de ubicación (la IA marca el componente)" onclick="compUbiInc(${i})">📍</button>`}<button class="sec" onclick="compQuita(${i})">🗑</button></div>${f.cut?'<span class="icfc">✂️ recortado</span>':""}${f.ubi?'<span class="icfc">📍 ubicación</span>':""}</figure>`).join("")}</div>
 <div class="mu" style="font-size:11.5px;margin:-2px 0 6px">Toca una foto para verla a pantalla completa (zoom con dos dedos). Mantenla pulsada y arrástrala sobre otra para cambiarlas de sitio. Si el recorte de la IA no es bueno, corrígelo a mano antes de guardar con ✂️ (el componente) o con ✂️ en la ubicación: los dos se ajustan juntos.</div>
 <label>Código si lo sabes (p. ej. E-X62, ET-B9)</label><input id="ic_cod" placeholder="Opcional: la IA recorta ESE elemento" value="${E(p.cod||"")}" autocapitalize="characters">
 <label>¿Dónde está montado?</label><input id="ic_donde" placeholder="Ej. rotonda, túnel exterior, cabina bajo el pupitre…" value="${E(p.donde||"")}">
 <label>¿En qué averías interviene? (palabras del aviso, separadas por comas)</label><input id="ic_cla" placeholder="Ej. barrera rotonda, evento 294" value="${E(p.claves||"")}">
 ${selHTML(p)}<div id="ic_st" class="mu" style="font-size:12.5px;margin-top:6px"></div><div id="ic_prop"></div>`;$("#sheet").style.display="flex"}
const vals=()=>({cod:((document.getElementById("ic_cod")||{}).value||"").trim().toUpperCase().replace(/^\+/,""),donde:(document.getElementById("ic_donde")||{}).value||"",claves:(document.getElementById("ic_cla")||{}).value||""});
window.compFotos=async function(inp){const v=vals();for(const f of [...(inp.files||[])]){try{const im=await lee(f);const c=aJpg(im,900);const g=aJpg(im,1400);F.push({src:c.toDataURL("image/jpeg",.82),vista:VISTAS[Math.min(F.length,VISTAS.length-1)],c:g,o:g.toDataURL("image/jpeg",.88)})}catch(e){msg(String(e.message||e))}}pinta(v)};
window.compVista=(i,v)=>{if(F[i])F[i].vista=v};
/* v556: foto de UBICACIÓN en Incorporar (como en Editar ficha): la IA localiza el componente en la foto de conjunto y lo marca en naranja */
async function ubicaEn(f){const ref=F.find(x=>x!==f&&!x.ubi&&x.cut)||F.find(x=>x!==f&&!x.ubi);const v=vals();
 const cod=((document.getElementById("ip_cod")||{}).value||v.cod||"").trim(),tit=(document.getElementById("ip_tit")||{}).value||"",fab=(document.getElementById("ip_fab")||{}).value||"";
 if(typeof window.compUbicaIA!="function"){msg("Función no disponible");return false}
 const motor=MOTOR||await pideMotor();if(!motor)return false;MOTOR=motor;
 const ov=window.compEspera?compEspera((motor=="claude"?"Claude":"Gemini")+" está localizando "+(cod||"el componente")+" en la foto…"):null;
 try{const base=f.o||f.src;const arm=f.arm||"";const R=await compUbicaIA(base,ref&&(ref.src),{codigo:cod,titulo:tit,fab,arm},motor);
  f.o=base;f.caja=R.caja;f.src=R.src;f.vista=window.compConArm?compConArm(R.vista,arm):R.vista;f.ubi=true;f.ubiMan=true;f.c=null;repinta();msg("📍 Ubicado con "+R.lector+". Ajusta con ✂️ en la foto si hace falta y guarda");return true}
 catch(e){msg(String((e&&e.message)||e));return false}finally{if(ov)ov.remove()}}
/* v567: se pueden añadir VARIAS fotos de ubicación (una a una o varias a la vez): cada una se suma a las que ya hay,
   también a la que crea la IA al identificar, y ninguna sustituye a otra. Para quitar una, 🗑 en su foto. */
window.compFotoUbi=async function(inp){const fs=[...(inp.files||[])];inp.value="";if(!fs.length)return;
 if(!F.some(x=>!x.ubi))msg("Añade primero la foto del componente (la IA la usa como referencia)");
 /* v569: en qué armario está (AE / armario de pupitre / otro) y, opcional, en qué PBB */
 const arm=window.compPideArmario?await compPideArmario(window.compUbiDe?compUbiDe({id:((document.getElementById("ip_cod")||document.getElementById("ic_cod")||{}).value||"")}):""):"";if(arm==null)return;
 for(const fl of fs){try{const im=await lee(fl);const g=aJpg(im,1400);const o=g.toDataURL("image/jpeg",.88);const f={src:o,o,arm,vista:window.compConArm?compConArm("Ubicación",arm):"Ubicación",c:g};
  F.push(f);repinta();if(!await ubicaEn(f)){f.ubi=true;f.ubiMan=true;f.c=null;repinta()}}catch(e){msg(String(e.message||e))}}};
window.compUbiInc=async function(i){const f=F[i];if(f)await ubicaEn(f)};
/* v545: permutar fotos arrastrándolas y verlas a pantalla completa con zoom */
(window.FOTO_ORDEN=window.FOTO_ORDEN||{}).inc={mueve:(i,j)=>{if(!F[i]||!F[j])return;[F[i],F[j]]=[F[j],F[i]];repinta()},toca:i=>{if(F[i]&&typeof compVer=="function")compVer(F[i].src,F.map(f=>f.src),i)}};
/* v535: recorte a mano (o ajuste del recorte de la IA) */
window.compRecInc=async function(i){const f=F[i];if(!f||typeof compRecorta!="function")return;
 if(f.ubi){if(!f.o)return;const r=await compRecorta(f.o,f.caja,{titulo:"📍 Marcar la ubicación",sub:"Ajusta el recuadro naranja sobre el elemento (bornero: de su etiqueta a la siguiente)",ok:"📍 Marcar"});if(!r)return;f.caja=r.caja;f.src=await compMarcaCaja(f.o,r.caja,1000);
  /* v550: el recorte del componente sigue al recuadro de la ubicación */
  const q=f.par&&F.includes(f.par)?f.par:null;if(q&&(q.o||q.src)){q.src=await compCortaCaja(q.o||q.src,r.caja,1400);q.caja=r.caja;q.cut=true}repinta();return}const r=await compRecorta(f.o||f.src,f.caja);if(!r)return;
 f.src=r.src;f.caja=r.caja;f.cut=true;
 /* v550: la foto de ubicación sigue al recorte hecho a mano */
 const u=F.find(x=>x.ubi&&x.par===f&&x.o);if(u){u.caja=r.caja;u.src=await compMarcaCaja(u.o,r.caja,1000)}repinta()};
/* repinta las fotos sin perder la propuesta de la IA ni lo ya corregido */
function repinta(){const v=vals();const pr=document.getElementById("ic_prop"),st=document.getElementById("ic_st");const keep=pr?pr.innerHTML:"",ks=st?st.innerHTML:"";const vv=keepVals();pinta(v);
 const d=document.getElementById("ic_prop");if(d&&keep){d.innerHTML=keep;putVals(vv)}const s2=document.getElementById("ic_st");if(s2)s2.innerHTML=ks}
const keepVals=()=>[...document.querySelectorAll("#ic_prop input,#ic_prop textarea")].map(e=>[e.id,e.value]);
const putVals=a=>a.forEach(([id,v])=>{const e=id&&document.getElementById(id);if(e)e.value=v});window.compQuita=i=>{F.splice(i,1);repinta()};
/* v568: índice de hilos por bornero (rev. J o 507 + regleteros de alimentación) para identificar un bornero SIN etiqueta
   por los MANGUITOS (marcadores) de los cables que llegan a sus bornas. */
function idxHilos(es507){const I={};const add=(t,p,h,c)=>{t=String(t||"").replace(/^\+/,"");h=String(h||"").trim();if(!/X/i.test(t)||!h)return;(I[t]=I[t]||{});(I[t][p]=I[t][p]||new Set()).add(h+(c?" "+c:""))};
 const C=(es507&&window.CABLEADO507)||window.CABLEADO||{};Object.values(C).forEach(x=>(x.n||[]).forEach(n=>{if(n.k=="B")(n.v||[]).forEach(v=>add(n.t,n.p,v.h,v.c))}));
 (window.BOR_ST||[]).forEach(r=>{const m=String(r[2]||"").match(/hilo\s+(\S+)(?:\s+([A-Z]{2,4}))?/i);if(m)add(r[0],r[1],m[1],m[2])});return I}
const hilosTxt=I=>Object.keys(I).sort().map(t=>t+": "+Object.keys(I[t]).sort((x,y)=>parseFloat(x)-parseFloat(y)).map(p=>p+"="+[...I[t][p]].join("/")).join(", ")).join("; ");
/* cotejo local: qué bornero reúne más hilos de los leídos en los manguitos */
function porManguitos(lista,I){const nh=h=>String(h||"").toUpperCase().replace(/[^0-9A-Z.]/g,"");const L=(lista||[]).map(x=>nh(typeof x=="object"&&x?(x.hilo||x.h||x.texto||""):x)).filter(Boolean);if(!L.length)return null;
 const R=Object.keys(I).map(t=>{const bs=[];Object.entries(I[t]).forEach(([p,S])=>{if([...S].some(v=>L.includes(nh(v.split(" ")[0]))))bs.push(p)});return{t,n:bs.length,bs}}).filter(r=>r.n).sort((x,y)=>y.n-x.n);
 return R.length?{leidos:L,mejor:R[0],otros:R.slice(1,3)}:{leidos:L,mejor:null}}
const codigos=()=>{const N=window.NOMBRES_EL||{};return Object.entries(N).map(([k,v])=>k+"="+v).join("; ")};
let PROP=null;
window.compIA=async function(opt){opt=opt||{};const v=vals();const st=document.getElementById("ic_st");const set=t=>{if(st)st.innerHTML=t};
 /* v554: antes de identificar se elige el motor de IA (Claude más eficaz · Gemini gratis); en «siguiente componente» se repite el elegido */
 const motor=opt.motor||await pideMotor();if(!motor)return;MOTOR=motor;
 set("⏳ Leyendo la placa y cotejando con los planos con <b>"+(motor=="claude"?"Claude":"Gemini")+"</b>…");
 try{const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;if(!tok)throw new Error("Inicia sesión para usar la IA");
  const MAN=F.filter(f=>f.ubiMan);F=F.filter(f=>!f.ubi);const img=collage(F.map(f=>f.c)).split(",")[1];
  if(!v.cod&&!listaOK()){if(MAN.length)F.push(...MAN);set("");await compDetecta(motor);return}
  if(!GRUPO||!F.some(f=>f.o===GRUPO.o)){const f0=F[0];GRUPO=f0?{o:f0.o,c:f0.c,hechos:[],salta:[]}:null}
  const SEL=!v.cod&&listaOK()?(GRUPO.sel||[]).slice().sort((a,b)=>a-b):[];if(!v.cod&&!SEL.length){if(MAN.length)F.push(...MAN);set("");msg("Marca en la lista el componente (o los que forman uno) que quieres incorporar");return}
  const LS=SEL.length?GRUPO.lista:[];const UN=SEL.length?union(SEL.map(i=>LS[i])):null;
  const yaCods=[...new Set(C().map(c=>String(c.id||"").trim()).filter(c=>c&&!/^SIN C/i.test(c)))];
  const hechosF=(GRUPO?GRUPO.hechos:[]).map(h=>`${h.codigo} (caja x ${Math.round(h.x0)}-${Math.round(h.x1)}, y ${Math.round(h.y0)}-${Math.round(h.y1)} milésimas)`);
  const salta=[...new Set((GRUPO?GRUPO.salta:[]).concat(opt.salta||[]))];
  const IH=idxHilos(/\b507\b/.test(v.donde+" "+v.claves));const prompt=`Fotos (en una sola imagen, de izquierda a derecha) de un componente de campo de una pasarela de embarque (PBB) TKE del aeropuerto de Madrid Barajas, para la guía de componentes de la app de mantenimiento.
Dónde está montado (según el técnico): ${v.donde||"(no indicado)"}.
Averías en que interviene (según el técnico): ${v.claves||"(no indicado)"}.
${SEL.length?`SELECCIÓN DEL TÉCNICO (OBLIGATORIO): forman UN SOLO componente de campo ${SEL.length>1?"los elementos":"el elemento"} ${SEL.map(k=>`nº ${k+1}${LS[k].codigo?` «${LS[k].codigo}»`:""}${LS[k].tipo?` (${LS[k].tipo})`:""}`).join(" + ")}, en la caja x ${Math.round(UN.x0)}-${Math.round(UN.x1)}, y ${Math.round(UN.y0)}-${Math.round(UN.y1)} milésimas. Describe y recorta ESO y nada más, aunque ya esté incorporado o alguna etiqueta no se lea entera.${SEL.length>1?" Es una sola ficha: codigo = los códigos de plano juntos separados por « / » (p. ej. etiquetas P-K7.1 y P-K7.2 → «P-K71 / P-K72»), titulo y especificaciones del conjunto, y el recorte abarca TODOS los elementos seleccionados.":""} elegido = ${SEL[0]}.`:""}
${v.cod?`CÓDIGO INDICADO POR EL TÉCNICO: ${v.cod}. Es OBLIGATORIO: el componente es ${v.cod}; búscalo por su rótulo/etiqueta en la foto, recorta ESE (no otro aunque se vea mejor) y pon codigo="${v.cod}".`:""}
CÓDIGOS DE ELEMENTOS DE LOS PLANOS (código=nombre): ${codigos()}

TAREA
1. Lee TODO lo impreso en la placa (fabricante, modelo, referencia, tensión, corriente, resistencia, salidas, pines/colores, normas, protección). No inventes datos que no se lean.
2. Coteja el tipo de componente, lo impreso y dónde está montado con la lista de códigos y propone el CÓDIGO de plano más probable (si hay varios iguales, p. ej. izquierdo/derecho o emisor/receptor, ponlos juntos «R-B1 / R-B3» y explícalo). Si no encaja con ninguno, codigo = "SIN CÓDIGO".
3. Propón: titulo (nombre del elemento en español), fab (fabricante · modelo · referencia), esp = filas [dato, valor] de la placa y su función en la PBB, pin = filas [pin, color, señal, función] si se ven, med = 3-5 pasos «Medir en campo» con valores esperados (por ejemplo «24 VDC entre pin 1 y pin 3»), av = aviso al sustituir, claves = palabras de los avisos de OT en que interviene (separadas por comas), justificacion = por qué ese código.
4. RECORTE (obligatorio): el elemento se guarda RECORTADO, solo él, sin componentes vecinos a medias ni cables alrededor. Da la caja ajustada al cuerpo del componente principal en la foto donde mejor se ve su placa, en MILÉSIMAS (0-1000) de la imagen COMPLETA que recibes: x0,y0 = esquina superior izquierda, x1,y1 = inferior derecha. Ciñe la caja al borde del componente (no incluyas los elementos de al lado ni los mazos de cables).
4b. BORNEROS / REGLETAS DE BORNES (códigos «X», p. ej. E-X62, P-X51, IT-X51): su código es el que se lee en su PORTAETIQUETAS (no pongas «SIN CÓDIGO»). Las bornas van en GRUPOS DE ETIQUETA A ETIQUETA: el portaetiquetas con el código está a la IZQUIERDA del grupo y el bornero son TODAS las bornas que hay a su DERECHA hasta justo antes del portaetiquetas siguiente (o hasta el final del carril). Un bornero puede tener 2 o más bornas (normalmente varias, numeradas 1, 2, 3…). El RECORTE NO es solo la etiqueta: abarca la etiqueta (dentro, a la izquierda) Y todas las bornas de su grupo, en todo su alto (de la fila de tornillos/bornas de arriba a la de abajo, sin los mazos de cables). Las bornas a la izquierda de su etiqueta o a la derecha de la etiqueta siguiente NO son suyas. Devuelve además "etiqueta" = caja de SU portaetiquetas y "fin_x" = coordenada x (milésimas de la imagen completa) donde empieza el portaetiquetas siguiente o acaba el carril, y "bornas" = nº de bornas del grupo.
4d. BORNERO SIN ETIQUETA: si el componente es un bornero/regleta y NO se ve o NO se lee su portaetiquetas, identifícalo por los MANGUITOS (marcadores impresos en los cables que entran en sus bornas). Lee el texto de cada manguito de izquierda a derecha (número de hilo y, si lo lleva, color o «bornero:borna»), crúzalo con este ÍNDICE DE HILOS POR BORNERO (bornero: borna=hilo color, …) y elige el bornero con más coincidencias; delimita el grupo por las bornas cuyos hilos coinciden. Devuelve "manguitos" = lista de lo leído en cada manguito (en orden), "por_manguitos" = true, y en justificacion qué hilos coinciden y en qué bornas. No inventes manguitos que no se lean.
ÍNDICE DE HILOS POR BORNERO: ${hilosTxt(IH)}
BREVEDAD: responde con el JSON compacto: "esp" máx. 14 filas, "pin" máx. 12, "med" máx. 8 pasos, "elementos" máx. 12, textos cortos.
4c. YA INCORPORADOS en Componentes de campo: ${yaCods.join(", ")||"(ninguno)"}.${hechosF.length?` De ESTA MISMA FOTO ya se han incorporado (no los vuelvas a elegir, aunque otro tenga el mismo código): ${hechosF.join("; ")}.`:""}${salta.length?` El técnico ha pedido PASAR AL SIGUIENTE: NO elijas ${salta.join(", ")}.`:""}${v.cod||SEL.length?"":" Si en la foto hay varios componentes, elige el PRIMERO (de izquierda a derecha y de arriba abajo) que NO esté ya incorporado; si todos lo están, elige el primero y dilo en justificacion."}
7. ALARMAS, ADVERTENCIAS Y EVENTOS DEL PLC (pantalla Magelis / puesto remoto, manual RCS). Coteja el componente con este listado (código|texto) y devuelve en "alarmas" las que dispara, provoca o en las que interviene (máx. 8, SOLO códigos del listado, [] si ninguna), con "por" = motivo en pocas palabras:
${typeof compAlarmasListado=="function"?compAlarmasListado():""}
6. ELEMENTOS DE LA FOTO: si se ven VARIOS componentes (de un bloque o sueltos), lístalos TODOS en "elementos", en orden de izquierda a derecha y de arriba abajo: {"codigo": el que se lee en su etiqueta o el código de plano más probable ("" si no se sabe), "tipo": qué es, "x0","y0","x1","y1": su caja en milésimas}. "elegido" = índice (desde 0) del componente que describes y recortas.
5. Si el componente está montado dentro de un BLOQUE de varios elementos (carril DIN, fila de magnetotérmicos, regleta, grupo de relés…): en_bloque = true, bloque = qué bloque es y dónde (p. ej. «carril DIN de magnetotérmicos del armario eléctrico AE»), posicion = su posición contando los elementos del bloque (p. ej. «3 de 10, de izquierda a derecha»), total = nº de elementos del bloque. Si va solo, en_bloque = false.
Responde SOLO con JSON: {"codigo":"","titulo":"","fab":"","esp":[["",""]],"pin":[["","","",""]],"med":[""],"av":"","claves":"","justificacion":"","recorte":{"x0":0,"y0":0,"x1":0,"y1":0},"en_bloque":false,"bloque":"","posicion":"","total":0,"etiqueta":{"x0":0,"y0":0,"x1":0,"y1":0},"fin_x":0,"bornas":0,"elementos":[{"codigo":"","tipo":"","x0":0,"y0":0,"x1":0,"y1":0}],"elegido":0,"alarmas":[{"c":"","por":""}],"manguitos":[""],"por_manguitos":false}`;
  const r=await fetch(SUPABASE_URL+"/functions/v1/leer-ia",{method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},body:JSON.stringify({img,tipo:"image/jpeg",prompt,motor})});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.mensaje||j.error||("error "+r.status));
  PROP=jsonIA(j.txt);PROP.lector=j.lector;if(PROP._cortado){delete PROP._cortado;PROP.justificacion=(PROP.justificacion||"")+" ⚠️ La respuesta de la IA llegó cortada: revisa que no falten datos."}
  /* v557: cotejo con las alarmas / eventos del PLC: lo de la IA (validado) + el cotejo local; va a la ficha y a sus averías */
  if(typeof compAlarmasDe=="function"){const L=compAlarmasJunta(PROP.alarmas,compAlarmasDe(PROP));const r=compAlarmasEnFicha(PROP.esp,PROP.claves||v.claves,L);PROP.esp=r.esp;PROP.claves=r.claves;PROP._al=L}
  /* v568: bornero identificado por manguitos: cotejo local con el índice de hilos y fila en la ficha */
  if(Array.isArray(PROP.manguitos)&&PROP.manguitos.filter(Boolean).length){const M=porManguitos(PROP.manguitos,IH);
   if(M){PROP.esp=(PROP.esp||[]).filter(r=>!/^manguitos/i.test(Array.isArray(r)?r[0]:""));PROP.esp.push(["Manguitos leídos",M.leidos.join(" · ")]);
    if(M.mejor){const cod=nCod(PROP.codigo),mj=nCod(M.mejor.t);const txt="Por manguitos: "+M.leidos.length+" leídos, "+M.mejor.n+" coinciden con "+M.mejor.t+" (bornas "+M.mejor.bs.join(", ")+")"+(M.otros.length?"; también "+M.otros.map(o=>o.t+" ("+o.n+")").join(", "):"")+".";
     if(!v.cod&&(!cod||/^SINC/.test(cod)||(cod!==mj&&M.mejor.n>=2))){PROP.justificacion=(PROP.justificacion?PROP.justificacion+" ":"")+txt+(cod&&cod!==mj&&!/^SINC/.test(cod)?" La IA proponía «"+PROP.codigo+"»: se toma "+M.mejor.t+" por los hilos.":"");PROP.codigo=M.mejor.t}
     else PROP.justificacion=(PROP.justificacion?PROP.justificacion+" ":"")+txt}
    else PROP.justificacion=(PROP.justificacion?PROP.justificacion+" ":"")+"⚠️ Ningún hilo de los manguitos leídos ("+M.leidos.join(", ")+") está en los borneros de los planos: revisa el código."}}
  /* v572: selección del técnico: se mantiene la lista y el recorte abarca lo marcado */
  if(SEL.length){PROP.elementos=LS;PROP.elegido=SEL[0];PROP._sel=SEL.slice();const r=PROP.recorte||{};const cx=(+r.x0+ +r.x1)/2,cy=(+r.y0+ +r.y1)/2;
   const okR=+r.x1>+r.x0&&+r.y1>+r.y0&&cx>=UN.x0&&cx<=UN.x1&&cy>=UN.y0&&cy<=UN.y1&&(SEL.length==1||(+r.x1-+r.x0)>=(UN.x1-UN.x0)*.7);if(!okR)PROP.recorte=Object.assign({},UN);
   if(!PROP.codigo||/^SIN C/i.test(PROP.codigo)){const cs=SEL.map(k=>LS[k].codigo).filter(Boolean);if(cs.length)PROP.codigo=cs.join(" / ")}}
  if(!PROP.claves&&v.claves)PROP.claves=v.claves;if(v.cod&&String(PROP.codigo||"").toUpperCase().replace(/^\+/,"")!==v.cod){PROP.justificacion=(PROP.justificacion?PROP.justificacion+" ":"")+"(Código indicado por el técnico: "+v.cod+"; la IA proponía «"+(PROP.codigo||"—")+"». Revisa que el recorte sea el de "+v.cod+".)";PROP.codigo=v.cod}const rc=await recorteIA(PROP,v);if(MAN.length)F.push(...MAN);pinta(v);
  const st2=document.getElementById("ic_st");if(st2)st2.innerHTML=`Leído con <b>${E(j.lector||"IA")}</b>. ${rc}Revisa y corrige antes de guardar.`;propHTML();grupoHTML()}
 catch(e){set(`<span style="color:#c62828">${E(String((e&&e.message)||e))}</span>`+(motor=="gemini"?` <button class="sec" style="width:auto;margin:6px 0 0" onclick="compIA({motor:'claude'})">✳️ Probar con Claude</button>`:""))}};
/* ===== v554: motor de IA, varios componentes en una misma foto y avisos de repetidos ===== */
let MOTOR=null,GRUPO=null;
const nCod=c=>String(c||"").toUpperCase().replace(/^\+/,"").replace(/\s+/g,"").replace(/\./g,"");/* v572: etiqueta P-K7.1 = plano P-K71 */
const partes=c=>String(c||"").split(/\s*[\/,]\s*/).map(nCod).filter(x=>x&&!/^SINC/.test(x));
const yaSet=()=>{const S=new Set();C().forEach(c=>partes(c.id).forEach(x=>S.add(x)));return S};
const nCat=c=>{const p=partes(c);return p.length?C().filter(x=>partes(x.id).some(y=>p.includes(y))).length:0};
const esYa=c=>{const S=yaSet();const p=partes(c);return p.length>0&&p.every(x=>S.has(x))};
window.compPideMotor=()=>pideMotor();
function pideMotor(){return new Promise(res=>{const o=document.createElement("div");o.id="icMotor";
 o.style.cssText="position:fixed;inset:0;z-index:100005;background:#0009;display:flex;align-items:center;justify-content:center;padding:18px";
 o.innerHTML=`<div style="background:var(--card,#fff);color:var(--ink,#111);border-radius:14px;padding:16px;max-width:420px;width:100%;box-shadow:0 10px 30px #0008">
  <b style="font-size:17px">¿Con qué IA identifico el componente?</b>
  <button class="pri" data-m="claude" style="margin-top:12px;display:block;width:100%;text-align:left">✳️ <b>Claude</b> · más eficaz leyendo placas y recortando<br><small style="opacity:.85">Tiene coste por consulta</small></button>
  <button class="sec" data-m="gemini" style="margin-top:8px;display:block;width:100%;text-align:left">♊ <b>Gemini</b> · gratis<br><small style="opacity:.8">Menos preciso; si falla puedes repetir con Claude</small></button>
  <button class="sec" data-m="" style="margin-top:8px;width:100%">Cancelar</button></div>`;
 o.addEventListener("click",e=>{const b=e.target.closest("button");if(!b&&e.target!==o)return;e.stopPropagation();o.remove();res(b?b.dataset.m||null:null)});
 ["touchend","pointerdown","dblclick"].forEach(t=>o.addEventListener(t,e=>e.stopPropagation()));document.body.appendChild(o)})}
/* panel: componentes que hay en la foto, cuáles ya están incorporados, cuál es este y si se repite alguno */
function grupoHTML(){const d=document.getElementById("ic_prop");if(!d||!PROP)return;
 const L=Array.isArray(PROP.elementos)?PROP.elementos.filter(x=>x&&(x.codigo||x.tipo)):[];
 const ya=esYa(PROP.codigo);const cuenta={};L.forEach(x=>partes(x.codigo).forEach(c=>cuenta[c]=(cuenta[c]||0)+1));const rep=Object.keys(cuenta).filter(c=>cuenta[c]>1);
 let h="";
 if(ya)h+=`<div class="icgr icgr-r">⚠️ <b>${E(PROP.codigo)}</b> ya está incorporado en Componentes de campo.<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><button class="sec" style="width:auto;margin:0" onclick="compCatalogo('${E(PROP.codigo)}')">Ver la ficha</button></div></div>`;
 if(rep.length)h+=`<div class="icgr icgr-a">⚠️ Código repetido en la foto: <b>${E(rep.join(", "))}</b>. Comprueba la etiqueta de cada uno antes de guardar.</div>`;
 let g=document.getElementById("ic_grp");if(!g){g=document.createElement("div");g.id="ic_grp";d.prepend(g)}g.innerHTML=h}
/* ===== v572: la IA primero BUSCA los componentes de la foto; el técnico marca con ✅ el que quiere incorporar (o varios
   que forman uno, p. ej. P-K7.1 + P-K7.2) y «🤖 Identificar con IA», debajo de la lista, analiza solo lo marcado. ===== */
const base=()=>F.filter(f=>!f.ubi);
function listaOK(){const b=base();return !!(GRUPO&&Array.isArray(GRUPO.lista)&&GRUPO.lista.length&&GRUPO.os&&b.length===GRUPO.os.length&&b.every((f,i)=>f===GRUPO.os[i]))}
function union(a){const n=v=>{v=+v;return isFinite(v)?(v>1.5?v:v*1000):0};return{x0:Math.min(...a.map(x=>n(x.x0))),y0:Math.min(...a.map(x=>n(x.y0))),x1:Math.max(...a.map(x=>n(x.x1))),y1:Math.max(...a.map(x=>n(x.y1)))}}
function estado(i){const x=GRUPO.lista[i];if((GRUPO.hechosIdx||[]).includes(i))return"hecho";return esYa(x.codigo)?"ya":"pend"}
function quedan(){if(!listaOK())return[];return GRUPO.lista.filter((x,i)=>estado(i)=="pend"&&!(GRUPO.sel||[]).includes(i))}
function selHTML(p){p=p||{};if(!F.length)return`<button class="pri" style="margin-top:10px" disabled>🔎 Buscar componentes en la foto</button>`;
 if(!listaOK())return`<div id="ic_selw"><button class="pri" style="margin-top:10px" onclick="compIA()">${p.cod?"🤖 Identificar con IA":"🔎 Buscar componentes en la foto"}</button>${p.cod?"":`<div class="mu" style="font-size:11.5px;margin-top:4px">La IA lista lo que hay en la foto; luego marcas cuál incorporar. Si ya sabes el código, escríbelo arriba y se identifica directamente.</div>`}</div>`;
 const L=GRUPO.lista,S=GRUPO.sel||[];const np=L.filter((x,i)=>estado(i)=="pend").length;
 return`<div id="ic_selw"><div class="icgr"><b>📦 Componentes en la foto (${L.length})</b>${np?` · ${np} por incorporar`:" · todos incorporados"}
 <div class="mu" style="font-size:11.5px;margin-top:2px">Marca el componente a incorporar. Si un componente de campo son varios (p. ej. P-K7.1 + P-K7.2), márcalos todos.</div>
 <div class="icgl">${L.map((x,i)=>{const e=estado(i),on=S.includes(i);return`<label class="icg-row${on?" icg-este":e!="pend"?" icg-ya":""}"><input type="checkbox" ${on?"checked":""} onchange="compSel(${i},this.checked)"><span>${i+1}. <b>${E(x.codigo||"¿?")}</b>${x.tipo?` <small>${E(x.tipo)}</small>`:""} · ${e=="hecho"?"✓ incorporado ahora":e=="ya"?"✓ ya incorporado":"pendiente"}</span></label>`}).join("")}</div>
 <button class="pri" style="margin-top:8px" onclick="compIA()" ${S.length?"":"disabled"}>🤖 Identificar con IA${S.length?` · ${S.length>1?S.length+" elementos como uno":"1 elemento"}`:""}</button>
 <button class="sec" style="margin-top:6px" onclick="compDetecta()">🔄 Volver a buscar en la foto</button></div></div>`}
window.compSel=function(i,on){if(!GRUPO)return;const S=new Set(GRUPO.sel||[]);on?S.add(i):S.delete(i);GRUPO.sel=[...S].sort((a,b)=>a-b);
 const w=document.getElementById("ic_selw");if(w)w.outerHTML=selHTML(vals())};
window.compDetecta=async function(motor){motor=motor||MOTOR||await pideMotor();if(!motor)return;MOTOR=motor;const v=vals();const st=document.getElementById("ic_st");const set=t=>{if(st)st.innerHTML=t};
 set("⏳ Buscando los componentes de la foto con <b>"+(motor=="claude"?"Claude":"Gemini")+"</b>…");
 try{const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;if(!tok)throw new Error("Inicia sesión para usar la IA");
  const B=base();if(!B.length)throw new Error("Añade una foto del componente");const img=collage(B.map(f=>f.c)).split(",")[1];
  const prompt=`Fotos (en una sola imagen, de izquierda a derecha) de componentes de campo de una pasarela de embarque (PBB) TKE de Madrid Barajas.
Dónde está montado (según el técnico): ${v.donde||"(no indicado)"}.
CÓDIGOS DE ELEMENTOS DE LOS PLANOS (código=nombre): ${codigos()}
TAREA: lista TODOS los componentes que se ven (contactores, relés, magnetotérmicos, borneros, fuentes, módulos, sensores…), en orden de izquierda a derecha y de arriba abajo. Cada contactor/relé con su propia etiqueta es un elemento aparte (p. ej. P-K7.1 y P-K7.2 son dos). Para cada uno: "codigo" = lo que se lee en su etiqueta tal cual (o el código de plano más probable; "" si no se sabe; no inventes), "tipo" = qué es, con fabricante y modelo si se leen (corto; si está cortado por el borde de la foto, dilo), "x0","y0","x1","y1" = su caja ajustada en MILÉSIMAS (0-1000) de la imagen completa. Máximo 16.
Responde SOLO con JSON: {"elementos":[{"codigo":"","tipo":"","x0":0,"y0":0,"x1":0,"y1":0}]}`;
  const r=await fetch(SUPABASE_URL+"/functions/v1/leer-ia",{method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},body:JSON.stringify({img,tipo:"image/jpeg",prompt,motor})});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.mensaje||j.error||("error "+r.status));
  const R=jsonIA(j.txt);const L=(Array.isArray(R.elementos)?R.elementos:[]).filter(x=>x&&(x.codigo||x.tipo)).map(x=>({codigo:String(x.codigo||"").trim(),tipo:String(x.tipo||"").trim(),x0:+x.x0||0,y0:+x.y0||0,x1:+x.x1||0,y1:+x.y1||0}));
  if(!L.length)throw new Error("La IA no encontró componentes en la foto. Prueba con otra foto o escribe el código.");
  const f0=B[0];GRUPO={o:f0.o,c:f0.c,os:B.slice(),lista:L,sel:L.length==1?[0]:[],hechos:[],hechosIdx:[],salta:[]};PROP=null;
  const d=document.getElementById("ic_prop");if(d)d.innerHTML="";const w=document.getElementById("ic_selw");if(w)w.outerHTML=selHTML(v);
  set(`Leído con <b>${E(j.lector||"IA")}</b>. Marca el componente que quieres incorporar y pulsa <b>🤖 Identificar con IA</b>.`)}
 catch(e){set(`<span style="color:#c62828">${E(String((e&&e.message)||e))}</span>`)}};
window.compSiguiente=function(){if(!GRUPO)return;const v=vals();F=F.filter(f=>!f.ubi);F.forEach(f=>{if(f.cut){f.src=f.o;f.cut=false;f.caja=null}});
 GRUPO.os=base();GRUPO.sel=[];PROP=null;pinta({donde:v.donde,claves:v.claves});const w=document.getElementById("ic_selw");if(w)w.scrollIntoView({block:"center"})};
const filas=a=>(a||[]).map(r=>Array.isArray(r)?r.join(" | "):String(r)).join("\n");
const desf=(t,n)=>String(t||"").split("\n").map(l=>l.trim()).filter(Boolean).map(l=>n?l.split("|").map(x=>x.trim()).concat(Array(n).fill("")).slice(0,n):l);
(function(){const st=document.createElement("style");st.textContent=`.icgr{margin:8px 0;padding:9px 11px;border-radius:10px;border:1px solid #0b6e9955;background:#0b6e9912;font-size:13px}
.icgr-r{border-color:#c6282880;background:#c6282814}.icgr-a{border-color:#ef6c0080;background:#ef6c0014}
.icgl{display:flex;flex-direction:column;gap:3px;margin-top:6px}.icgl span{padding:4px 8px;border-radius:6px;background:#0001;font-size:12.5px}
.icgl .icg-este,.icgl .icg-este *{font-weight:800!important}.icg-row{display:flex;align-items:flex-start;gap:8px;cursor:pointer}.icg-row input{width:22px;height:22px;margin:1px 0 0;flex:none;accent-color:#2e7d32}.icgl .icg-ya{opacity:.65}.icgl .icg-rep{outline:2px dashed #c62828}`;document.head.appendChild(st)})();
/* v535: recorte automático del elemento + foto de UBICACIÓN si está dentro de un bloque de varios */
async function recorteIA(p,v){let t="";try{
 if(!p.recorte&&Array.isArray(p.box_2d)&&p.box_2d.length==4){const z=p.box_2d;p.recorte={y0:z[0],x0:z[1],y1:z[2],x1:z[3]}}
 /* v550: borneros de etiqueta a etiqueta: si la IA recorta solo la etiqueta, se amplía hasta el portaetiquetas siguiente */
 const esX=/^[A-Z0-9]*-?X\d/i.test(String(p.codigo||v.cod||"").replace(/^\+/,""));
 if(esX&&p.recorte){const n=x=>{x=+x;return isFinite(x)?(x>1.5?x:x*1000):NaN};const r=p.recorte,e=p.etiqueta||{},fx=n(p.fin_x);
  const ex0=n(e.x0),rx0=n(r.x0),rx1=n(r.x1);
  if(isFinite(ex0)&&ex0>0&&(!isFinite(rx0)||Math.abs(rx0-ex0)>15))r.x0=Math.max(0,ex0-4);
  if(isFinite(fx)&&fx>n(r.x0)+20&&(!isFinite(rx1)||rx1<fx-20||rx1>fx+20))r.x1=Math.min(1000,fx-2);}
 const b=cajaFoto(p.recorte);
 if(b&&typeof compCortaCaja=="function"){const f=F[b.i];const src0=f.o||f.src;f.src=await compCortaCaja(src0,b.c,1400);f.caja=b.c;f.cut=true;
  const vi=String(f.vista||"");if(!/vista/i.test(vi))f.vista=VISTAS[0];
  if(p.en_bloque&&typeof compMarcaCaja=="function"){const bl=String(p.bloque||"bloque de varios elementos").trim();const ps=String(p.posicion||"").trim();
   f.ubiDe=true;F.push({src:await compMarcaCaja(src0,b.c,1000),o:await compCortaCaja(src0,{x0:0,y0:0,x1:1,y1:1},1000),caja:b.c,par:f,vista:"Ubicación · "+bl+(p.total?" ("+p.total+" elementos juntos)":""),c:null,ubi:true});
   const txt=bl+(ps?" · posición "+ps.replace(/^posici[oó]n\s*/i,""):"");p.esp=(p.esp||[]).filter(r=>!/^ubicaci[oó]n$/i.test(Array.isArray(r)?r[0]:""));p.esp.push(["Ubicación",txt]);
   t=`✂️ Recortado y 📍 ubicado en el bloque (${E(txt)}). `}
  else t="✂️ Recortado automáticamente. ";
  t+="Si el recorte no queda limpio, ajústalo con ✂️ en la foto. "}
 else t="⚠️ La IA no dio el recorte: recorta la foto con ✂️ antes de guardar. "}catch(e){t="⚠️ No se pudo recortar: usa ✂️ en la foto. "}return t}
function propHTML(){const p=PROP;const d=document.getElementById("ic_prop");if(!d)return;
 d.innerHTML=`<div class="icpr">${p.justificacion?`<div class="mu" style="font-size:12.5px;margin-bottom:6px">🔎 ${E(p.justificacion)}</div>`:""}
 ${typeof compAlarmasHTML=="function"?compAlarmasHTML(p._al):""}
 <label>Código (de los planos)</label><textarea class="tx1" rows="1" id="ip_cod">${E(p.codigo||"")}</textarea><label>Título</label><textarea class="tx1" rows="1" id="ip_tit">${E(p.titulo||"")}</textarea>
 <label>Fabricante · modelo · referencia</label><textarea class="tx1" rows="1" id="ip_fab">${E(p.fab||"")}</textarea>
 <label>Averías en que interviene (palabras, separadas por comas)</label><textarea class="tx1" rows="1" id="ip_cla">${E(p.claves||"")}</textarea>
 <label>Especificaciones (una por línea: dato | valor)</label><textarea id="ip_esp" rows="5">${E(filas(p.esp))}</textarea>
 <label>Conexionado (una por línea: pin | color | señal | función)</label><textarea id="ip_pin" rows="4">${E(filas(p.pin))}</textarea>
 <label>Medir en campo (un paso por línea)</label><textarea id="ip_med" rows="4">${E((p.med||[]).join("\n"))}</textarea>
 <label>Aviso al sustituir</label><textarea id="ip_av" rows="2">${E(p.av||"")}</textarea>
 <div class="icst"><b>Repuesto</b><div class="grid" style="grid-template-columns:1fr 1fr;gap:6px"><input id="ip_ref" placeholder="Referencia"><input id="ip_sus" placeholder="Sustituto compatible"><input id="ip_ubi" placeholder="Ubicación almacén"><input id="ip_uds" inputmode="numeric" placeholder="Unidades"></div></div>
 <button class="pri" style="margin-top:10px" onclick="compGuarda()">💾 Guardar en Componentes de campo</button></div>`}
window.compGuarda=async function(){const g=id=>(document.getElementById(id)||{}).value||"";
 if(F.length&&!F.some(f=>f.cut)&&!confirm("Ninguna foto está recortada: el elemento saldría con vecinos y cables alrededor.\n\n¿Guardar igualmente? (Cancelar para recortar con ✂️)"))return;
 const row={codigo:g("ip_cod").trim()||"SIN CÓDIGO",titulo:g("ip_tit").trim()||"Componente",fab:g("ip_fab").trim(),claves:g("ip_cla").trim(),esp:desf(g("ip_esp"),2),pin:desf(g("ip_pin"),4),med:desf(g("ip_med")),av:g("ip_av").trim(),
  fotos:F.map(f=>f.ubi&&f.o&&f.caja?{src:f.src,vista:f.vista,o:f.o,caja:f.caja}:{src:f.src,vista:f.vista}),stock:{ref:g("ip_ref"),sust:g("ip_sus"),ubi:g("ip_ubi"),uds:g("ip_uds")},creado_por:(user&&user.email)||""};
 if(!row.claves){msg("Indica en qué averías interviene, para asociarlo a las OT");return}
 if(esYa(row.codigo)&&!confirm("⚠️ "+row.codigo+" ya está incorporado en Componentes de campo.\n\n¿Guardar otra ficha igualmente? (Cancelar para no duplicarlo)"))return;
 try{if(typeof compSubeFotos=="function")row.fotos=await compSubeFotos(row.fotos);
  const {data,error}=await sb.from("componentes_campo").insert(row).select().single();if(error)throw error;C().push(aComp(data));msg("Componente "+row.codigo+" incorporado");
  if(GRUPO){const r=(PROP&&PROP.recorte)||{};GRUPO.hechos.push({codigo:row.codigo,x0:+r.x0||0,x1:+r.x1||0,y0:+r.y0||0,y1:+r.y1||0});GRUPO.hechosIdx=(GRUPO.hechosIdx||[]).concat((PROP&&PROP._sel)||[]);GRUPO.sel=[]}const q=quedan();
  if(q.length&&GRUPO&&confirm("📦 En esta misma foto quedan "+q.length+" componente(s) por incorporar: "+q.map(x=>x.codigo||x.tipo||"¿?").join(", ")+".\n\n¿Elegir otro de la misma foto?")){compSiguiente();return}
  GRUPO=null;compCatalogo(row.codigo)}
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
.icf img{width:100%;height:90px;object-fit:contain}.icfb{display:flex;gap:4px}.icfb button{flex:1}.icfc{font-size:10px;font-weight:800;color:#e65100;text-align:center}.icf select,.icf button{margin:0!important;padding:3px!important;font-size:11px!important;width:100%!important;min-height:0!important}
.icpr{margin-top:8px;padding:8px;border:1.5px solid #455a64;border-radius:10px}.icpr textarea{font-size:13px}
.icst{margin-top:8px;padding:6px;border:1px dashed var(--bd,#bbb);border-radius:8px}.icst input{margin:0}
.ubcmp{position:relative}.icpbh{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:auto!important;margin:0!important;padding:4px 9px!important;font-size:12px!important;background:rgba(255,255,255,.2)!important;color:#fff!important;border:1px solid rgba(255,255,255,.5)!important;border-radius:8px}`;
document.head.appendChild(st);
})();
