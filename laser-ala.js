/* ===== v127-v129: Láser detector de ala («radar de ala») · cabina, zona derecha =====
 Documento «Laser_detector_de_ala» (Planos, 2 páginas):
  · pág. 1 — foto del módulo láser con su conexionado:
      POWER   V- = 0 V · ⏚ · V+ = +24 V
      CAN BUS +  (rojo) · H (blanco) · L (azul) · −  (negro)  → cabezal láser (rotulado «HC LC»)
      DIGITAL OUT (regleta izquierda): borna común (la primera, sin número) unida con cable negro al conector POWER;
                   salida 1 «Out Stop» → P-A6 8.1 · salida 3 «Out low speed» → P-A6 7.1 (salidas 2 y 4 libres)
      DIGITAL IN  V- V+ 1 2 3 4: sin cablear.
  · pág. 2 — ESQUEMA GENERAL rev. J folio 88 (P-A6 módulo de entradas) con la anotación a mano:
      DIG. OUT 3 → «LENTA» en DIN13 (7.1, reserva en el plano) · DIG. OUT 1 → «PARO» en DIN14 (8.1, reserva en el plano).
      En el frontal del PLC: P-A6 módulo 4, LED 1 = lenta (7.1) · LED 2 = paro (8.1).
 Qué hace este módulo:
  1. Reconoce las OT del láser de ala por la descripción: radar, láser / lazar, «ala» (palabra suelta: «alarma» no cuenta),
     «parada por detección de ala». Si «láser» va con extensión, retracción, telescópico, medida o elongación, la OT sigue
     siendo de medida analógica (láser de extensión ET-B9) y no se toca.
  2. Al detectar ala la PAS se para con ese aviso: la actuación más eficaz es salir con traslación a zona segura.
     En esas OT la guía abre como «Actuación más eficaz» el procedimiento del láser detector de ala, con botones al documento
     Laser_detector_de_ala (pág. 1 conexionado, pág. 2 folio 88) y al folio 88 del plano de la posición.
  4. PLC (v129): P-A6 módulo 4 LED 1 = 7.1 lenta · LED 2 = 8.1 paro (tabla PLC, rutas del polímetro, pista del cotejo con
     foto y puente provisional del paro). En la 507 esas bornas son AKS: allí no se aplica.
  3. Se quitan de esas OT el puente provisional de medida analógica (AIN02) y la caja de medidas analógicas, que salían por la
     palabra «láser». ===== */
(function(){
"use strict";
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const PAS=GUIA.tipos.PAS;
const n_=t=>typeof segNorm=="function"?segNorm(t):String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const txt=i=>n_([i&&i.desc,i&&i.def,i&&i.com,i&&i.obs].filter(Boolean).join(" "));
const RE_ALA=/\bradar\b|\blazar\b|\balas?\b|detecc\w*\s+(de\s+)?alas?\b|detect\w*\s+(el\s+|un\s+)?alas?\b/;
const RE_LASER=/\bla[sz]er\b/;
const RE_MED=/extensi|retracc|telescop|medid|\bmide\b|\bmedir\b|elongaci|analog/;
function esAla(i){if(!i)return false;const t=txt(i);if(RE_ALA.test(t))return true;return RE_LASER.test(t)&&!RE_MED.test(t)}
window.esLaserAla=esAla;

/* vocabulario: que «radar», «lazar» no se corrijan a otra palabra (p. ej. «lazar» → «lazo») */
try{ANA_SIN.push(["radar","lazar","laser","ala","alas"]);ANA_VOC=null;ANA_C={k:"",r:null}}catch(e){}

/* ---------- procedimiento de la guía de campo ---------- */
const PROC={t:"Radar de ala · láser detector de ala (cabina, zona derecha) · parada por detección de ala",
 a:"Cuando el láser detecta ala, la PAS se para con ese aviso. Lo primero es SALIR CON TRASLACIÓN A ZONA SEGURA, alejando la cabina del ala, con un compañero vigilando el ala.",
 p:[
"QUÉ HAY: módulo láser en la CABINA, ZONA DERECHA, con un cabezal láser unido por bus CAN. Al detectar ala, la PAS se PARA y da el aviso de detección de ala. El módulo da dos salidas digitales al PLC del pupitre: SALIDA 1 «Out Stop» → P-A6 borna 8.1 (PARO) y SALIDA 3 «Out low speed» → P-A6 borna 7.1 (VELOCIDAD LENTA). En el plano rev. J esas dos entradas figuran como RESERVA (folio 88, anotadas a mano).",
"QUÉ HAY · CONEXIONADO DEL MÓDULO (Laser_detector_de_ala pág. 1): POWER V- = 0 V y V+ = +24 V · CAN BUS: + rojo, H blanco, L azul, − negro hacia el cabezal · DIGITAL OUT: borna común (la primera, sin número) unida con cable negro al conector POWER, salida 1 = paro, salida 3 = lenta. Las salidas 2 y 4 y la regleta DIGITAL IN no se usan.",
"QUÉ HAY · LED EN EL PLC: P-A6 módulo 4, LED 1 = lenta (7.1) · LED 2 = paro (8.1). Al acercarse al ala entra primero LENTA y después PARO.",
"PRIORIDAD 1 · ACTUACIÓN MÁS EFICAZ: con la PAS parada por el aviso de detección de ala, SALIR CON TRASLACIÓN A ZONA SEGURA, alejando la cabina del ala, hasta que el láser deje de ver el ala y desaparezca el aviso. Selector en MANUAL y un compañero vigilando el ala.",
"PRIORIDAD 1 · Paso 2 · Ya en zona segura, comprobar si había ala u obstáculo real delante del cabezal. Si lo había, la parada es correcta: volver a aproximar despacio, por otra trayectoria, sin acercar la cabina al ala.",
"Paso 3 · Si no había nada delante (falsa detección): limpiar la ventana del cabezal láser (polvo, agua, hielo, insectos) y comprobar que no está girado ni golpeado. Un cabezal desorientado «ve» el suelo o la propia PBB y para la maniobra.",
"Paso 4 · Tapar y destapar el cabezal con la mano y mirar P-A6 módulo 4: si cambian LED 1 (lenta) y LED 2 (paro), el láser funciona. Si se quedan fijos en paro sin nada delante, seguir con el módulo.",
"Paso 5 · Módulo en cabina zona derecha: medir 24 Vdc entre V+ y V- del conector POWER. Sin tensión → revisar su alimentación de 24 V del pupitre (P-Q30.3 alimenta P-A6) y el conector POWER.",
"Paso 6 · Bus CAN al cabezal: conector bien apretado, cables + rojo / H blanco / L azul / − negro sin cortes ni bornas flojas. Sin comunicación con el cabezal, el módulo deja el paro activado.",
"Paso 7 · Señales al PLC: medir en el módulo la salida 1 (paro) y la salida 3 (lenta) respecto al común y comprobar que llegan a P-A6 8.1 y 7.1 (folio 88). Si el módulo cambia la salida y el LED del PLC no, buscar el corte en el hilo entre el módulo y P-A6.",
"Solo si el paro queda fijo sin ala delante y no deja salir con traslación: puente provisional en P-A6 8.1 para llevar la PBB a zona segura (MANUAL, autorización del Responsable de Turno, compañero vigilando). Si el LED 2 está ENCENDIDO mientras para, soltar el hilo de la salida 1 en el módulo (o en 8.1) y aislarlo; si está APAGADO, puente 8.2 (+24 V del grupo) → 8.1. Anotarlo en la OT y quitarlo al terminar.",
"Reposición: cabezal limpio y orientado; comprobar que al acercar la mano entra primero LENTA y luego PARO, que la PAS se para con el aviso y que se puede salir con traslación. Retirar cualquier puente provisional."],
 g:[88,0,88,0,0,0,88,0,0,88,88,88],
 lz:[2,1,2,0,0,1,2,1,1,2,2,0],
 r:"Laser_detector_de_ala (pág. 1 módulo, pág. 2 folio 88) · ESQUEMA GENERAL rev. J folio 88 (P-A6)"};
const IX=PAS.s.push(PROC)-1;
window.LASER_ALA_IX=IX;

/* ---------- análisis de la OT: el láser de ala manda ---------- */
const esAnalog=si=>{const s=PAS.s[si];return !!s&&/medidas anal/i.test(s.t)};
(function(){const o=anaOT;anaOT=function(i){const r=o(i);if(!r||r._ala)return r;r._ala=1;
 if(r.tipo&&r.tipo!="PAS")return r;
 if(!esAla(i)){r.guia=(r.guia||[]).filter(g=>g.si!=IX);return r}
 /* PBB 507: su plano propio usa P-A6 7.1 / 8.1 para los AKS y el ala es el bumper A380 (C-B25): no se fuerza el láser */
 if(String(i.pos)=="507"){r.guia=(r.guia||[]).filter(g=>g.si!=IX);return r}
 r.guia=(r.guia||[]).filter(g=>g.si!=IX&&!esAnalog(g.si));
 r.guia.unshift({si:IX,t:PROC.t,sc:60});
 r.guia=r.guia.slice(0,4);
 if(Array.isArray(r.mods)&&!r.mods.includes("P-A6"))r.mods.unshift("P-A6");
 if(Array.isArray(r.elem)&&!r.elem.includes("P-A6"))r.elem.unshift("P-A6");
 if(Array.isArray(r.rel))laserRel(r);
 return r}})();

/* el puente provisional de medida analógica (AIN02, láser de extensión) no aplica a las OT del láser de ala */
if(typeof puAnalog=="function"){const o=puAnalog;puAnalog=function(i){return esAla(i)?[]:o(i)}}


/* ---------- PLC: P-A6 módulo 4 (folio 88, rev. J) ----------
 LED 1 = 7.1 (DIN13) láser · DIG OUT 3 «lenta» · LED 2 = 8.1 (DIN14) láser · DIG OUT 1 «paro» · LED 3 = 7.4 (DIN15) reserva · LED 4 = 8.4 (DIN16) reserva.
 Los nombres están en la tabla PLC (index.html). Aquí: rutas del polímetro (la señal la da el módulo láser, no un contacto
 alimentado desde el +24 V del grupo), pista en el cotejo con foto y puente provisional del paro. */
const L_MOD="Módulo láser (cabina, zona derecha)";
const rutaLaser=(sal,nom,borna,led)=>[
 {p:`${L_MOD} · conector POWER V+ / V-`,e:"≈24 Vdc entre V+ y V-",x:"Sin 24 V: alimentación del módulo láser (24 V del pupitre) o conector POWER flojo.",f:88,u:["C"],cab:[],nodo:"Módulo láser POWER"},
 {p:`${L_MOD} · CAN BUS al cabezal (+ rojo · H blanco · L azul · − negro)`,e:"cables apretados y sin cortes",x:"Sin comunicación con el cabezal el módulo deja activado el paro: revisar conector y cable CAN hasta el cabezal.",f:88,u:["C"],cab:[],nodo:"Módulo láser CAN"},
 {p:`${L_MOD} · DIGITAL OUT ${sal} «${nom}» respecto al común (borna sin número de la regleta DIGITAL OUT)`,e:"cambia al tapar y destapar el cabezal",x:`No cambia con el cabezal tapado y libre: cabezal sucio, desorientado o módulo láser averiado.`,f:88,u:["C"],cab:[],nodo:`Láser DIG OUT ${sal}`},
 {p:`P-A6 borna ${borna} (IN, ${borna=="7.1"?"DIN13":"DIN14"}) · mód. 4 LED ${led}`,e:"la misma tensión que la salida del láser y LED coherente",x:`Diferencia con la salida del láser: hilo entre el módulo láser y P-A6 ${borna} (anotación a mano en el folio 88, sin nº de hilo en el plano). Con tensión y el LED sin cambiar: entrada de P-A6.`,f:88,u:["P"],cab:[],nodo:`P-A6 ${borna}`}];
try{const R=window.RUTAS||RUTAS;const RP=R&&R["P-A6"];if(RP&&RP.s){
 const put=(k,l,led,t,p)=>{const S={id:`P-A6-${k}.${l}`,led,k,l,t,r:`Mód. ${k} · LED ${l} (IN ${led}): cambia con la detección del ala (lenta y después paro). Ruta del documento Laser_detector_de_ala y folio 88 de la rev. J.`,p,det:true,traz:true,fol:"88"};
  const ix=RP.s.findIndex(x=>x.led==led);if(ix>=0)RP.s[ix]=S;else RP.s.push(S)};
 put(4,1,"7.1","Láser detector de ala · DIG OUT 3 «velocidad lenta» (DIN13)",rutaLaser(3,"Out low speed","7.1",1));
 put(4,2,"8.1","Láser detector de ala · DIG OUT 1 «paro» (DIN14)",rutaLaser(1,"Out Stop","8.1",2));}}catch(e){console.warn("laser-ala rutas",e)}
const RE_PU=/radar|lazar|laser|\bala\b|\balas\b|deteccion de ala/;
try{
 PISTA["P-A6|4|1"]="Láser detector de ala, salida 3 «lenta» (cabina, zona derecha): entra al acercarse al ala. Si cambia sin ala delante, limpiar y orientar el cabezal.";
 PISTA["P-A6|4|2"]="Láser detector de ala, salida 1 «paro»: con ala detectada la PAS se para con ese aviso; salir con traslación a zona segura. Sin ala delante: cabezal sucio o desorientado, 24 V del módulo o bus CAN.";
 PUENTE["P-A6|4|2"]="Láser detector de ala · PARO (P-A6 8.1). 1º salir con TRASLACIÓN a ZONA SEGURA, alejando la cabina del ala. Solo si el paro queda fijo sin ala delante y no deja salir: con el LED 2 ENCENDIDO mientras para, soltar el hilo de 8.1 y aislarlo; con el LED 2 APAGADO, puente 8.2 (+24 V) → 8.1.";
 PU_REQ["P-A6|4|2"]=RE_PU;
}catch(e){console.warn("laser-ala puente",e)}
/* en la 507 P-A6 7.1 / 8.1 son AKS: ni puente ni pista del láser */
if(typeof puentesOT=="function"){const o=puentesOT;puentesOT=function(i){const P=o(i);return i&&String(i.pos)=="507"?P.filter(p=>p.key!="P-A6|4|2"):P}}
/* el análisis de la OT del láser incluye siempre las dos señales de P-A6 (paro primero) */
function laserRel(r){const RP=(window.RUTAS||RUTAS)["P-A6"];if(!RP)return;
 ["8.1","7.1"].forEach((led,j)=>{const S=RP.s.find(x=>x.led==led);if(!S||r.rel.some(x=>x.mod=="P-A6"&&x.S&&x.S.led==led))return;
  r.rel.splice(j,0,{mod:"P-A6",S,sc:50-j,tg:new Set(["P-A6"])})})}

/* ---------- abrir el documento Laser_detector_de_ala ---------- */
async function docAla(){const l=await gLista();return l.find(x=>/laser|l[aá]ser/i.test(x.name)&&/ala/i.test(x.name))||null}
window.gLaserAla=async function(pag){const d=await docAla();if(!d){msg("Sube a Planos el documento Laser_detector_de_ala");return}gPagIni=pag||1;await ver(d.id)};

/* ---------- pintado en la guía de campo ---------- */
function pinta(){const d=document.querySelector(`#app details.gd[data-k="PAS${IX}"]`);if(!d)return;
 /* botones por paso: «lz» = página del documento del láser (1 módulo, 2 folio 88). Los pasos se pintan en dos listas
    (acciones y «Elementos y referencias») en el orden de PROC.p, igual que en vTec */
 const info=typeof gEsInfo=="function"?gEsInfo:(()=>false);const acc=[],inf=[];PROC.p.forEach((p,pi)=>(info(p)?inf:acc).push(pi));
 const pon=(el,pi)=>{const pg=PROC.lz[pi];if(!el||!pg||el.querySelector(".glz"))return;
  el.insertAdjacentHTML("beforeend",`<button class="gpl glz" aria-label="Ver Laser_detector_de_ala página ${pg}" onclick="event.preventDefault();event.stopPropagation();gLaserAla(${pg})">📄<small>L${pg}</small></button>`)};
 const ga=d.querySelectorAll(".gst>.gpaso"),gi=d.querySelectorAll(".gelit");acc.forEach((pi,k)=>pon(ga[k],pi));inf.forEach((pi,k)=>pon(gi[k],pi));
 if(!d.querySelector(".glzb")){const mu=[...d.querySelectorAll(".mu")].find(x=>/^Planos:/.test(x.textContent.trim()));
  const h=`<div class="glzb" style="display:flex;gap:6px;margin:6px 0"><button class="sec" style="flex:1" onclick="gLaserAla(1)">📄 Láser · conexionado del módulo</button><button class="sec" style="flex:1" onclick="gLaserAla(2)">📄 Láser · folio 88 (P-A6)</button></div>`;
  if(mu)mu.insertAdjacentHTML("afterend",h);else d.insertAdjacentHTML("beforeend",h)}}
(function(){const o=vTec;vTec=function(){const r=o.apply(this,arguments);try{pinta()}catch(e){console.warn("laser-ala",e)}return r}})();
(function(){const st=document.createElement("style");st.textContent=`#app .glz{margin-left:4px}#app .glz small{font-size:10px}`;document.head.appendChild(st)})();

/* ---------- comprobaciones por sistema: completar la ficha del láser con el conexionado ---------- */
try{const SIS=window.SIS;const s=SIS&&SIS.PAS&&SIS.PAS.find(x=>/l[aá]ser detector de ala/i.test(x.s));
 if(s){s.s="Láser detector de ala · radar de ala (cabina zona derecha · P-A6 7.1 / 8.1)";s.c=[
  "Módulo láser en la cabina, zona derecha. POWER: V- = 0 V · V+ = +24 V. CAN BUS al cabezal: + rojo · H blanco · L azul · − negro (documento Laser_detector_de_ala pág. 1).",
  "Salida digital 1 «Out Stop» → P-A6 8.1 (PARO) · salida digital 3 «Out low speed» → P-A6 7.1 (LENTA). Común de las salidas unido con cable negro al conector POWER. LED: P-A6 módulo 4, LED 2 paro · LED 1 lenta (folio 88).",
  "La PBB se para o va lenta en la aproximación sin ala delante: limpiar y orientar el cabezal; tapar y destapar con la mano y ver si cambian los LED de P-A6; medir 24 V en POWER y revisar el bus CAN.",
  "Sin láser instalado esas entradas son reserva y deben estar apagadas."]}}catch(e){}
})();
