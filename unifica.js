/* ===== v426-v427 (v427: croquis del módulo del puente en el bloque 1; «Funcionó» pliega el resto y pasa a reparar; casos parecidos, borneros y croquis de medidas plegados; análisis profundo parpadeando): SOS y lupa en UNA sola pantalla · «Funcionó / No funcionó» · SOS de 400 Hz y A/A · posición en la búsqueda ·
   aprendizaje de lo que resolvió · dictado por voz =====
   1. El botón SOS y la lupa del Panel de control abren la misma pantalla: posición + descripción en campo (+ alarma o foto).
      «Ver primera actuación» da, en este orden:
        🚨 1 · SACAR EN SERVICIO YA (reset, maniobra controlada o puente provisional; en 400 Hz y A/A, su actuación rápida)
        🔧 2 · REPARAR · actuación más eficaz (la de la lupa: elemento y lado acotados, croquis, borneros y Medir)
        🤖 3 · ANÁLISIS PROFUNDO con Claude (si lo anterior no basta)
   2. Cada paso lleva «✅ Funcionó» / «❌ No funcionó». No funcionó → se tacha y se señala el siguiente.
      Funcionó → se escribe en la Actuación de la OT abierta de esa posición (o se guarda como caso en este móvil si no hay OT)
      y queda registrado lo que resolvió.
   3. Con posición, la búsqueda usa sus planos (504/507/508); en las remotas (538, 539, 580-582) no busca en la pasarela.
   4. Aprendizaje: lo que resolvió avisos parecidos (todas las OT y los casos del móvil) sale arriba con ⭐ y nº de veces,
      y ese paso sube el primero en su lista.
   5. 🎤 Dictado por voz en la descripción en campo y en la descripción de la OT nueva (si el navegador lo permite; en
      iPhone también vale el micrófono del teclado). ===== */
(function(){
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const E=s=>typeof esc=="function"?esc(s):String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- 2 · actuaciones rápidas de 400 Hz y A/A (memorizadas) ---------- */
const QK={
 HZ:{n:"Convertidor 400 Hz",re:/\b400 ?hz\b|\bhz\b|hertz|pds ?400|conector (del )?avion|manguera (de )?400|enrollador|recogedor/,c:[
  {re:/recog|\bin\b|manguera|insertad|no suelta|\bout\b|enroll/,t:"Manguera no recoge / no suelta",p:[
   "Conector INSERTADO en el avión: el IN del armario AO no opera por seguridad (no es avería). Recoger SOLO con el botón IN del conector + desbloqueo de PAS en el AO (selector del AO).",
   "Conector DESCONECTADO: recoger solo con el botón IN del propio conector, sin que la manguera se arrastre por el suelo. Cuando queden 4 m para el final (enrolle en el recogedor), terminar la recogida desde el armario AO.",
   "Pulsar OFF y comprobar que el LED rojo ON se ha apagado del todo: con potencia activa IN queda bloqueado.",
   "Con el conector fuera, el LED 90 % debe apagarse. Si sigue encendido: interruptor 90 % pegado (continuidad hilos 9-13) → el convertidor bloquea el motor.",
   "IN y OUT son de hombre muerto: mantener pulsado. Sobretemperatura (PTC de los pines A, B, C, N): esperar a que enfríe o resetear."]},
  {re:/90|potencia|no da|sin salida|\bon\b|contactor|28 ?v/,t:"No da potencia / LED 90 % no enciende",p:[
   "Si el LED 90 % no enciende, NO pulsar ON.",
   "Llevar el conector hasta el tope mecánico del receptáculo del avión.",
   "Limpiar y revisar los pines cortos E y F (suciedad, desgaste, pin hundido): sin el lazo E-F de 28 Vdc no cierra el contactor de potencia.",
   "Si se corta durante el servicio: el conector se ha movido hacia fuera; revisar el anclaje."]},
  {re:/temperatura|caliente|ptc|disparo/,t:"Disparo por temperatura en el conector",p:[
   "Esperar a que enfríe el conector y resetear.",
   "Medir la resistencia de las PTC (hilos 1-14); revisar el apriete y el estado de los pines A, B, C y N."]}]},
 AAA:{n:"Aire acondicionado (PCA)",re:/aire acondicionado|\ba\/a\b|\bpca\b|\badx\b|climatiz|compresor|\baaa\b|maquina de aire|carro (de )?aire/,c:[
  {re:/carro|puerta|tapa|bloque/,t:"Bloqueo carro A/A · puerta del carro",p:[
   "Cerrar la puerta / tapa del carro de aire y dejar la manguera recogida.",
   "Si sigue bloqueada: ajuste del FC del carro (E-S100) + cierre de puerta, hasta que el FC detecte la puerta cerrada.",
   "2ª opción · Desbloqueo en el módulo del PLC de la PBB: con el carro COMPROBADO cerrado y recogido, en E-A2 soltar el hilo de la borna IN 5.1 (bloqueo carro A/A, no puentear). Anotarlo en la OT."]},
  {re:/alimentaci|no arranca|apagad|display|diferencial|disparo|sin tension|no enciende/,t:"Máquina ADX sin alimentación / no arranca",p:[
   "Comprobar pilotos y display: apagados = sin alimentación.",
   "Rearmar DIF ZONA DE MANDO (ID6) tras comprobar la causa del disparo; FGT, F1-F6 y 24 Vdc en la clema 6.",
   "Rearmar DIF ZONA DE FUERZA (ID1-ID5) tras comprobar la causa; IG, relé de fases RCP, FGG1-FGG4, FGVI, FGVE1-FGVE4.",
   "Seta de emergencia desenclavada, selectores MANTENIMIENTO/NORMAL y MANUAL/AUTO; detector de humos DH rearmado en central."]},
  {re:/ventilador|variador|filtro|condensad|no enfria|enfriar|poco aire|no sale aire|caudal|calor/,t:"Ventilador interior / variador / filtro",p:[
   "Fallo de variador (clemas 28/29): leer el código en el variador Omron y resetear; magnetotérmico FGVI.",
   "Piloto amarillo FILTRO: limpiar o sustituir el filtro; revisar condensados."]}]}};
/* v430-v431: BLOQUEO de la PBB por un equipo de servicio → 1ª opción en el equipo (cierre del carro…), 2ª desbloqueo en el módulo del PLC (E-A2) */
const BLQ=t=>{t=nrm(t);return /\bbloque(o|os|ad[ao]s?|an?)\b|interbloque/.test(t)&&/carr(o|ito)|a\/a|\baa\b|aire|\bpca\b|pc ?air|climatiz|maquina|convertidor|\b400\b|\bhz\b|\bgpu\b|conector|90 ?%|equipo/.test(t)};
const BLQ_EQ=[[/carr(o|ito)|pc ?air|e-?s100/,"E-A2|3|1","Carro A/A","Cerrar la puerta / tapa del carro de aire con la manguera recogida; si sigue: ajuste del FC del carro E-S100 + cierre de puerta. Si se soltó el hilo en E-A2, reponerlo."],
 [/90 ?%|conector/,"E-A2|3|3","90 % conector 400 Hz","Desconectar el conector del avión y recogerlo; LED 90 % apagado. Si sigue encendido: interruptor 90 % pegado (hilos 9-13). Si se soltó el hilo en E-A2, reponerlo."],
 [/convertidor|\b400\b|\bhz\b|\bgpu\b/,"E-A2|3|2","Convertidor 400 Hz en servicio","Parar el 400 Hz (OFF, LED ON apagado) y recoger el cable; revisar el contacto de servicio y la manguera CBTH-X61 ↔ E-X61. Si se soltó el hilo en E-A2, reponerlo."],
 [/a\/a|\baa\b|aire|\bpca\b|climatiz|maquina/,"E-A2|2|4","Máquina A/A","Parar la PCA y recoger la manguera; revisar el contacto de la máquina y la manguera CBTH-X61 ↔ E-X61. Si se soltó el hilo en E-A2, reponerlo."]];
function blqHTML(t,conPlc){t=nrm(t);const L=BLQ_EQ.filter(([re])=>re.test(t));const S=L.length?L:BLQ_EQ;
 const plc=conPlc?S.map(([,k,n])=>`<div class="card pucard"><div class="pucab">🔌 2ª OPCIÓN · DESBLOQUEO EN EL MÓDULO DEL PLC · ${E(n)}</div><div class="puac">${E(typeof PUENTE!="undefined"&&PUENTE[k]||"En E-A2, con el equipo COMPROBADO parado y recogido, soltar el hilo de la entrada del bloqueo (no puentear).")}</div><div class="puac mu">Anotarlo en la OT y reponer el hilo al reparar.</div></div>`).join(""):"";
 return `<div class="card pucard qkc"><div class="pucab">⚡ 1ª OPCIÓN · EN EL EQUIPO</div>${S.map(([,,n,a],ix)=>`<div class="puac qkp">${ix+1}. <b>${E(n)}:</b> ${E(a)}</div>`).join("")}</div>`+plc}
/* v431: croquis del módulo del PLC (E-A2) con el hilo a soltar, para la 2ª opción */
function blqCroq(t){if(typeof croquisPuente!="function")return "";t=nrm(t);const L=BLQ_EQ.filter(([re])=>re.test(t));const S=L.length?L:BLQ_EQ;
 const sig=b=>{try{const C=window.CABLEADO||{};for(const k in C){const e=C[k];if(e.m=="E-A2"&&e.b==b)return (e.k||"")+(e.d?" · "+e.d:"")}}catch(e){}return ""};
 const it=S.map(([,k,n])=>{const tx=(typeof PUENTE!="undefined"&&PUENTE[k])||"",m=/borna IN (\d+\.\d)/i.exec(tx);return m?{mod:"E-A2",b1:m[1],b2:m[1],k1:sig(m[1])||"IN",k2:"",d:"Desbloqueo "+n+" · soltar y aislar el hilo (no puentear)",suelta:1}:null}).filter(Boolean);
 if(!it.length)return "";let h="";try{h=it.map(o=>`<div class="gcri">${croquisPuente(o,5)}</div>`).join("")}catch(e){return ""}
 return `<div class="card gcroq ubcro"><div class="gcrh">🔌 Croquis del módulo E-A2 · hilo a soltar${it.length>1?` · ${it.length} posibles (desliza)`:""}</div><div class="gcrs">${h}</div></div>`}
function tipoDe(t){t=nrm(t);if(BLQ(t))return "PAS";
 /* la PAS bloqueada por el carro de aire es de la pasarela */
 if(/\b(pas|pbb|pasarela)\b[^.]{0,30}bloquead|bloquead[^.]{0,30}\b(pas|pbb|pasarela)\b/.test(t))return "PAS";
 if(QK.HZ.re.test(t))return "HZ";if(QK.AAA.re.test(t))return "AAA";return "PAS"}
function qkHTML(T,t){const Q=QK[T];t=nrm(t);let cs=Q.c.filter(c=>c.re.test(t));/* v438: sin coincidencia no se propone el bloqueo del carro (1ª caja) por defecto */if(!cs.length)cs=T=="AAA"?[]:Q.c.slice(0,1);
 return cs.map(c=>`<div class="card pucard qkc"><div class="pucab">⚡ ${E(Q.n)} · ${E(c.t)}</div>${c.p.map((p,ix)=>`<div class="puac qkp">${ix+1}. ${E(p)}</div>`).join("")}</div>`).join("")}

/* ---------- 4 · aprendizaje: lo que resolvió avisos parecidos ---------- */
const VAC=new Set("para pero con sin del las los una uno que por esta este pbb pasarela fallo activado activada aviso avisa desde hasta cuando como solo esta estan".split(" "));
const pals=t=>new Set(nrm(t).split(/[^a-z0-9-]+/).filter(w=>w.length>=4&&!VAC.has(w)));
const clave=t=>nrm(t).replace(/^\s*\d+[.)]\s*/,"").replace(/[✅❌⭐].*$/s,"").replace(/\s+/g," ").trim().slice(0,90);
const LK="pbb_aprende";
const locales=()=>{try{return JSON.parse(localStorage.getItem(LK)||"[]")}catch(e){return[]}};
function registros(){const L=[];try{(typeof inc!="undefined"?inc:[]).forEach(i=>(i.resueltoCon||[]).forEach(r=>L.push(Object.assign({pos:i.pos,tipo:i.tipo},r))))}catch(e){}return L.concat(locales())}
function parecidos(desc,tipo){const P=pals(desc);if(!P.size)return[];const M=new Map();
 registros().forEach(r=>{if(tipo&&r.tipo&&r.tipo!=tipo)return;const Q=pals(r.desc);let n=0;Q.forEach(w=>{if(P.has(w))n++});
  if(n>=2||(n>=1&&Q.size<=2&&P.size<=2)){const x=M.get(r.k)||{k:r.k,t:r.t,n:0,pos:new Set()};x.n++;if(r.pos)x.pos.add(r.pos);M.set(r.k,x)}});
 return [...M.values()].sort((a,b)=>b.n-a.n)}

/* ---------- 1 · pantalla unificada ---------- */
let CTX=null;
window.lupaAbre=function(){if(typeof sosRap!="function")return;sosRap();setTimeout(()=>{const t=document.getElementById("sr_ob");if(t)t.focus()},80)};
const oA=window.sosAnaliza;
if(typeof oA=="function")window.sosAnaliza=async function(){
 const pos=((document.getElementById("sr_p")||{}).value||"").trim().toUpperCase();
 const ob=((document.getElementById("sr_ob")||{}).value||"").replace(/\s+/g," ").trim();
 const sa=document.getElementById("sr_a"),al=[(sa&&sa.value?sa.options[sa.selectedIndex].text:""),((document.getElementById("sr_t")||{}).value||"").trim()].filter(Boolean).join(" · ");
 const T=tipoDe(ob+" "+al);
 await oA.apply(this,arguments);
 const res=document.getElementById("sr_res");if(!res||!res.innerHTML.trim())return;
 CTX={pos,ob,al,T};const REM=typeof REMOTAS!="undefined"&&REMOTAS.has(pos);
 /* bloque 1 */
 let b1=res.innerHTML;
 if(T!="PAS")b1=`<div class="mu" style="margin:10px 0 6px"><b>${pos?"Posición "+E(pos)+" · ":""}${E(QK[T].n)}</b> · según la descripción en campo</div>${qkHTML(T,ob+" "+al)}`+((res.querySelector("#sr_cas")||{}).outerHTML||"<div id=\"sr_cas\"></div>")+((res.querySelector("details.srtx")||{}).outerHTML||"");
 else if(BLQ(ob+" "+al)&&!REM){const tb=ob+" "+al,tiene=/E-A2/.test(b1)&&/soltar el hilo/i.test(b1);
  const cab=`<div class="mu" style="margin:10px 0 6px"><b>${pos?"PBB "+E(pos)+" · ":""}Bloqueo por equipo de servicio</b></div>`;
  const cq=blqCroq(tb);
  b1=tiene?cab+blqHTML(tb,false)+`<div class="mu" style="margin:10px 0 4px"><b>🔌 2ª OPCIÓN · desbloqueo en el módulo del PLC</b></div>`+cq+b1:cab+blqHTML(tb,false)+cq+blqHTML(tb,true).replace(/^[\s\S]*?(?=<div class="card pucard"><div class="pucab">🔌)/,"").replace(/<div class="card pucard qkc">[\s\S]*$/,"")+((res.querySelector("#sr_cas")||{}).outerHTML||"<div id=\"sr_cas\"></div>")+((res.querySelector("details.srtx")||{}).outerHTML||"");
}
 else if(REM)b1=`<div class="gav" style="margin-top:10px">La posición ${E(pos)} es REMOTA (sin pasarela): no hay actuación de pasarela. Indica el sistema en la descripción (400 Hz, aire acondicionado…).</div>`;
 /* v427: si hay puente provisional, croquis del módulo afectado al principio del bloque 1 */
 let cro="";if(T=="PAS"&&!REM&&typeof window._croqLista=="function"&&typeof croquisPuente=="function"){try{
  const mk=(d,f)=>({id:"sosc_"+pos,pos,tipo:"PAS",equipos:["PAS"],estado:"abierta",desc:d,def:f||"",com:"",obs:"",orden:"SOS",fecha:""});
  let L=ob?_croqLista(mk(ob,"")):[];if(!L.length)L=_croqLista(mk(ob||al,ob?al:""));
  if(L.length)cro=`<div class="card gcroq ubcro"><div class="gcrh">🔌 Croquis del puente provisional · módulo ${E([...new Set(L.map(o=>o.mod))].join(" / "))}${L.length>1?` · ${L.length} posibles (desliza)`:""}</div><div class="gcrs">${L.map(o=>`<div class="gcri">${croquisPuente(o,5)}</div>`).join("")}</div></div>`}catch(e){}}
 if(BLQ(ob+" "+al))cro="";/* v431: en los bloqueos el croquis va en la 2ª opción (PLC) */
 const ap=parecidos(ob||al,T);
 const apH=ap.length?`<div class="apr"><div class="aprh">⭐ Lo que resolvió avisos parecidos</div>${ap.slice(0,3).map(x=>`<div class="apri"><b>${x.n}×</b> ${E(x.t)}${x.pos.size?` <small>(PBB ${E([...x.pos].slice(0,4).join(", "))})</small>`:""}</div>`).join("")}</div>`:"";
 res.innerHTML=`${apH}<div class="ubh ub1">🚨 1 · SACAR EN SERVICIO YA</div><div class="ubb ubb1">${cro}${b1}</div>
  <div class="ubh ub2">🔧 2 · REPARAR · actuación más eficaz</div><div class="ubb ubb2"><div id="lp_res"><div class="mu">Buscando la actuación más eficaz…</div></div></div>
  <div class="ubh ub3">🤖 3 · ANÁLISIS PROFUNDO</div><div class="ubb"><button class="sec srobok ub3b" onclick="sosObClaude()"><span><b>Analizar con Claude</b> · paso a paso con medidas</span><img src="claude-logo.png" alt="Claude"></button></div>`;
 /* bloque 2: la lupa con la descripción (y la alarma como complemento) y la posición */
 window.__lupaEnSOS=1;try{lupaBusca([ob,al].filter(Boolean).join(" · "),pos)}catch(e){const r=document.getElementById("lp_res");if(r)r.innerHTML=`<div class="gav">No se ha podido buscar la actuación más eficaz.</div>`}
 decora();try{res.scrollIntoView({block:"start",behavior:"smooth"})}catch(e){}};
/* la lupa se repinta (desplegable del elemento, alternativas): volver a poner los botones */
const oP=window.lupaPinta;if(typeof oP=="function")window.lupaPinta=function(){const r=oP.apply(this,arguments);try{if(document.getElementById("sr_res"))decora()}catch(e){}return r};
/* al cerrar la hoja, la lupa vuelve a su modo normal */
const oC=window.closeSheet;if(typeof oC=="function")window.closeSheet=function(){window.__lupaEnSOS=0;return oC.apply(this,arguments)};

/* ---------- 2 · Funcionó / No funcionó en cada paso ---------- */
const FB=`<div class="fbw"><button type="button" class="fbok">✅ Funcionó</button><button type="button" class="fbno">❌ No funcionó</button></div>`;
const pasoTxt=el=>{const c=el.cloneNode(true);c.querySelectorAll(".fbw,.fbst,.apb,details,svg,.cxd").forEach(x=>x.remove());return c.textContent.replace(/\s+/g," ").trim()};
/* v427: casos parecidos, borneros del sistema y croquis de medidas plegados */
function pliega(res){
 res.querySelectorAll("#lp_res .lbwrap:not([data-pl])").forEach(w=>{w.dataset.pl="1";const d=document.createElement("details");d.className="ubfold";
  const n=w.querySelectorAll(".lbx").length;d.innerHTML=`<summary>🔌 Borneros del sistema · croquis y medidas${n?` (${n})`:""}</summary>`;
  [...w.childNodes].forEach(c=>{if(!(c.classList&&c.classList.contains("anal")))d.appendChild(c);else c.remove()});w.appendChild(d)});
 res.querySelectorAll("details.cxd[open], details.lbm[open]").forEach(d=>{if(!d.dataset.pl){d.dataset.pl="1";d.open=false}});
 ["sr_cas","lp_cas"].forEach(id=>{const c=document.getElementById(id);if(!c||!c.closest("#sr_res"))return;if(id=="lp_cas"&&document.getElementById("sr_cas")){c.style.display="none";return}
  if(!c.innerHTML.trim()||c.querySelector(":scope>details.ubcas"))return;const n=c.querySelectorAll(".card,li,.caso,.cpar").length;
  const d=document.createElement("details");d.className="ubfold ubcas";d.innerHTML=`<summary>📚 Casos parecidos${n?` (${n})`:""}</summary>`;[...c.childNodes].forEach(x=>d.appendChild(x));c.appendChild(d)})}
new MutationObserver(()=>{const r=document.getElementById("sr_res");if(r&&CTX)try{pliega(r)}catch(e){}}).observe(document.body,{childList:true,subtree:true});
function decora(){const res=document.getElementById("sr_res");if(!res||!CTX)return;try{pliega(res)}catch(e){}
 const ap=new Map(parecidos(CTX.ob||CTX.al,CTX.T).map(x=>[x.k,x]));
 res.querySelectorAll(".pucard .puac, .lpaef .lpap").forEach(el=>{if(el.dataset.fb)return;el.dataset.fb="1";
  const t=pasoTxt(el);if(t.length<12||/^(⛔|no se puentean)/i.test(t))return;
  /* v441: «Funcionó / No funcionó» solo en los apartados que indican una PRUEBA (Prueba A/B/C, pruebas finales…) */
  if(!/\bprueba/i.test(t))return;const tg=el.matches(".lpap")&&el.querySelector(":scope>span")||el;tg.insertAdjacentHTML("beforeend",FB);
  const x=ap.get(clave(t));if(x){el.classList.add("fbap");tg.insertAdjacentHTML("afterbegin",`<span class="apb">⭐ Resolvió ${x.n}×</span> `);
   const par=el.parentNode,first=[...par.children].find(c=>c.matches(".puac,.lpap"));if(first&&first!==el)par.insertBefore(el,first)}})}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".fbok,.fbno");if(!b||!b.closest("#sr_res"))return;e.preventDefault();e.stopPropagation();
 const el=b.closest(".puac,.lpap");if(!el)return;const t=pasoTxt(el);
 if(b.classList.contains("fbno")){el.classList.add("fbx");el.classList.remove("fbsi");
  const all=[...document.querySelectorAll("#sr_res .puac[data-fb], #sr_res .lpap[data-fb]")].filter(x=>x.querySelector(".fbw"));const k=all.indexOf(el);
  document.querySelectorAll("#sr_res .fbnext").forEach(x=>x.classList.remove("fbnext"));
  const nx=all.slice(k+1).find(x=>!x.classList.contains("fbx"));if(nx){nx.classList.add("fbnext");nx.scrollIntoView({block:"center",behavior:"smooth"})}else msg("No quedan más pasos: usa el análisis profundo con Claude (bloque 3)");return}
 registra(t,el);el.classList.add("fbsi");el.classList.remove("fbx","fbnext");
 /* v427: funcionó en la primera actuación → el resto se pliega y se pasa a REPARAR (bloque 2) */
 const b1=el.closest(".ubb1");if(b1&&!b1.querySelector(":scope>details.ubresto")){const ok=document.createElement("div");ok.className="ubok";
  ok.dataset.nonm="1";ok.innerHTML=`<div class="ubokh">✅ Pasarela recuperada con:</div>`;const cl=el.cloneNode(true);cl.querySelectorAll(".fbw").forEach(x=>x.remove());ok.appendChild(cl);
  const d=document.createElement("details");d.className="ubfold ubresto";d.innerHTML="<summary>Ver el resto de la primera actuación</summary>";
  [...b1.childNodes].forEach(x=>d.appendChild(x));b1.appendChild(ok);b1.appendChild(d);
  /* bloque 2 centrado en REPARAR: los pasos de recuperación (puente, bypass, liberar, reset…) ya hechos se pliegan */
  const lp=document.querySelector("#sr_res .ubb2 .lpaef");if(lp&&!lp.querySelector(".ubrec")){const REC=/puente provisional|\bbypass\b|cp-s33|liberar|liberarlo|recuperar la pasarela|lado contrario|sacar la cabina|resetear|reset de pasarela|cp-s16|remoto a local|quitar el puente/i;
   const ps=[...lp.querySelectorAll(":scope>.lpap")].filter(x=>REC.test(pasoTxt(x)));if(ps.length){const d=document.createElement("details");d.className="ubfold ubrec";
    d.innerHTML=`<summary>Pasos de recuperación ya hechos (${ps.length})</summary>`;ps[0].parentNode.insertBefore(d,ps[0]);ps.forEach(x=>d.appendChild(x))}}
  const h2=document.querySelector("#sr_res .ub2");if(h2){h2.classList.add("ubgo");h2.textContent="🔧 2 · AHORA: REPARAR el elemento afectado";setTimeout(()=>h2.scrollIntoView({block:"start",behavior:"smooth"}),150)}}},true);
function registra(t,el){const C=CTX||{};const hh=new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"});
 const src=el.closest(".lpaef")?"actuación más eficaz":"primera actuación";
 const rec={k:clave(t),t:t.replace(/^\d+[.)]\s*/,"").slice(0,300),desc:C.ob||C.al||"",al:C.al||"",src,ts:Date.now()};
 let ot=null;try{ot=(typeof inc!="undefined"?inc:[]).filter(x=>String(x.pos).toUpperCase()==C.pos&&x.estado=="abierta").sort((a,b)=>(b.ts||0)-(a.ts||0)||String(b.id).localeCompare(String(a.id)))[0]||null}catch(e){}
 if(ot){ot.act=((ot.act||"").trim()?ot.act.trim()+"\n":"")+`✔ ${hh} · Resuelto (${src}): ${rec.t}`;(ot.resueltoCon=ot.resueltoCon||[]).push(rec);
  try{sv("pbb_inc",inc)}catch(e){}try{render()}catch(e){}msg(`Anotado en la Actuación de la OT ${ot.orden||""} (PBB ${C.pos})`)}
 else{const L=locales();L.push(Object.assign({pos:C.pos,tipo:C.T},rec));try{localStorage.setItem(LK,JSON.stringify(L.slice(-300)))}catch(e){}
  msg(C.pos?`Sin OT abierta en la PBB ${C.pos}: guardado como caso resuelto en este móvil`:"Guardado como caso resuelto en este móvil")}
 el.insertAdjacentHTML("beforeend",`<div class="fbst">✔ Registrado ${hh}${ot?` en la OT ${E(ot.orden||"")}`:""}</div>`)}

/* ---------- 5 · dictado por voz ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const MIC=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg>`;
function micEn(ta){if(!SR||!ta||ta.dataset.mic)return;ta.dataset.mic="1";const b=document.createElement("button");b.type="button";b.className="micb";b.title="Dictar por voz";b.setAttribute("aria-label","Dictar por voz");b.innerHTML=MIC;
 const w=ta.parentElement;if(getComputedStyle(w).position=="static")w.style.position="relative";w.appendChild(b);let rec=null;
 b.onclick=e=>{e.preventDefault();if(rec){try{rec.stop()}catch(x){}return}rec=new SR();rec.lang="es-ES";rec.interimResults=false;rec.continuous=false;
  b.classList.add("on");rec.onresult=ev=>{const t=[...ev.results].map(r=>r[0].transcript).join(" ").trim();if(t){ta.value=(ta.value.trim()?ta.value.trim()+" ":"")+t;ta.dispatchEvent(new Event("input",{bubbles:true}))}};
  rec.onend=()=>{b.classList.remove("on");rec=null};rec.onerror=()=>{b.classList.remove("on");rec=null;msg("No se ha podido dictar: usa el micrófono del teclado")};try{rec.start()}catch(x){b.classList.remove("on");rec=null}}}
if(SR)new MutationObserver(()=>{micEn(document.getElementById("sr_ob"));micEn(document.getElementById("f_desc"))}).observe(document.body,{childList:true,subtree:true});

const st=document.createElement("style");st.textContent=`
.ubh{margin:14px 0 6px;padding:8px 10px;border-radius:9px;font-weight:800;font-size:13.5px;letter-spacing:.4px;color:#fff}
.ub1{background:#c62828}.ub2{background:#ef6c00}.ub3{background:#5b3fa0}.ubb{padding:0 2px}
.ubfold{margin:8px 0;border:1px solid var(--bd,#555);border-radius:10px;padding:6px 8px}.ubfold>summary{cursor:pointer;font-weight:700;font-size:13px}
.ubok{margin:6px 0;padding:8px;border:2px solid #2e7d32;border-radius:10px;background:rgba(46,125,50,.10)}.ubokh{font-weight:800;color:#2e7d32;font-size:13px;margin-bottom:4px}
.ubgo{animation:ubgo 1s ease-in-out 4}@keyframes ubgo{50%{filter:brightness(1.4);transform:scale(1.02)}}
@keyframes ub3p{0%,100%{box-shadow:0 0 0 0 rgba(124,77,255,.9);opacity:1}50%{box-shadow:0 0 0 7px rgba(124,77,255,0);opacity:.6}}
.ub3b{animation:ub3p 1.2s ease-in-out infinite}.ub3{animation:ub3p 1.2s ease-in-out infinite}
.ub3b{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px!important}.ub3b img{height:26px;border-radius:6px;background:#fff;padding:2px}
.fbw{display:flex;gap:6px;margin:6px 0 2px;flex-wrap:wrap}.fbw button{flex:1;min-width:110px;padding:7px 8px;margin:0;font-size:13px;font-weight:700;border-radius:8px;border:1.5px solid}
.fbok{background:rgba(46,125,50,.12)!important;border-color:#2e7d32!important;color:#2e7d32!important}.fbno{background:rgba(198,40,40,.10)!important;border-color:#c62828!important;color:#c62828!important}
.fbx{opacity:.45}.fbx>*:not(.fbw){text-decoration:line-through}.fbnext{outline:2.5px solid #f59e0b;outline-offset:3px;border-radius:6px}
.fbsi{outline:2.5px solid #2e7d32;outline-offset:3px;border-radius:6px}.fbst{font-size:12px;font-weight:700;color:#2e7d32;margin-top:4px}
.apr{margin:10px 0 4px;padding:8px 10px;border:1.5px solid #f2c200;border-radius:10px;background:rgba(242,194,0,.10)}.aprh{font-weight:800;font-size:13px;margin-bottom:4px}
.apri{font-size:13px;margin:3px 0}.apri small{opacity:.75}.apb{display:inline-block;font-size:11.5px;font-weight:800;color:#7a5b00;background:#ffe27a;border-radius:6px;padding:0 5px;margin-right:4px}
.fbap{border-left:3px solid #f2c200;padding-left:6px}
.micb{position:absolute;right:8px;top:52px;width:38px;height:38px;padding:0;margin:0;display:flex;align-items:center;justify-content:center;border-radius:9px;border:1px solid var(--bd,#888);background:transparent;color:inherit}
.micb svg{width:20px;height:20px}.micb.on{background:#c62828;color:#fff;border-color:#c62828;animation:sosparp 1s infinite}`;
document.head.appendChild(st);
})();
