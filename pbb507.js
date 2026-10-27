/* ===== v101: PBB 507 (A380) con su plano propio T87911031230ES_Esquema_507 (rev. C, 07/10/2024, 122 folios)
 y documentación nueva del proyecto: esquema general rev. J (T87911031210, 97 folios), descripción técnica de la
 instalación hidráulica (TKAS), láser detector de ala y listado de CT del T4 / T4S.
 Qué hace este módulo:
  1. Planos: en la 507 la página del PDF = folio (sin desfase; el desfase −1 desde el folio 9 es de la rev. J) y los
     folios de la guía (numeración rev. J) se traducen al folio equivalente del plano 507. Folio negativo = folio propio 507.
  2. Cotejo PLC (LED): en OT de la 507 los canales que cambian (E-A2, E-A3, E-A9 7.1, P-A3, P-A4, P-A5, P-A6) se
     muestran con su nombre y estado de reposo del plano 507.
  3. Puentes provisionales 507: antiatrapamientos ópticos NPN (sin salida de test UT), bumper de ala A380, bordes de
     ruedas por relé Gelbau E1-U8; sin bloqueos A/A en E-A2 (en la 507 esas bornas son otras señales).
  4. Medidas analógicas 507 (E-A4: inclinómetro, giro cabina 4-20 mA, láser de elongación, anemómetro; P-A7).
  5. Guía de campo: procedimientos y comprobaciones por sistema nuevos (outriggers, AKS, retorno autónomo con
     variador de bomba, hidráulica, láser detector de ala, CT / UPS por posición). ===== */
(function(){
"use strict";
const P5="507";
const n_=t=>typeof segNorm=="function"?segNorm(t):String(t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const txtOT=i=>n_([i&&i.desc,i&&i.def,i&&i.com,i&&i.obs].filter(Boolean).join(" "));
function otActual(){try{const ab=gOTs();const id=gOT&&ab.some(x=>x.id==gOT)?gOT:(ab[0]&&ab[0].id);return inc.find(x=>x.id==id)||null}catch(e){return null}}
const posAct=()=>{const i=otActual();return i?String(i.pos):""};

/* ---------- 1. Folios: rev. J → plano 507 ---------- */
const F507={9:12,10:22,11:23,13:24,14:42,15:27,16:32,17:28,18:25,19:36,20:37,21:29,22:33,23:30,24:35,25:119,26:43,27:52,28:26,
 29:54,30:47,31:44,32:45,33:46,34:49,35:51,36:55,37:56,38:57,39:57,40:58,41:64,42:67,43:67,44:70,45:65,46:68,47:68,48:72,49:59,50:73,51:74,
 89:113,90:114,91:115,92:116,93:117,94:118,95:119,96:120,97:61,98:64,99:64};
for(let f=52;f<=88;f++)F507[f]=f+23; /* E-A0 … P-A6: folio rev. J + 23 */
window.F507=F507;
const es507Doc=n=>/(^|\D)507(\D|$)/.test(n)&&!/AAA|PCA|CBTH|PDS|AAP/i.test(n)&&!/T87911031210|T4T4S|RCS.?PLANOS/i.test(n);
(function(){const o=gPagina;gPagina=function(name,folio){if(es507Doc(String(name||""))){folio=+folio;if(folio<0)return -folio;return F507[folio]||folio}return o(name,folio)}})();
window.f507=f=>f<0?-f:(F507[f]||f);

/* ---------- 2. Nombres de LED del PLC en la 507 (por borna; se aplican solo con una OT de la 507) ---------- */
const L507={
 "E-A2":{"1.1":["Relé de asimetría (507)",2],"2.4":["Giro rotonda izquierda (507)",2],"3.1":["Giro rotonda derecha (507)",2],"4.1":["Sensor de inclinación (507)",2],
  "3.4":["Sensor 1 extensión/retracción (507)",2],"4.4":["Sensor 2 extensión/retracción (507)",2],"5.1":["Estado E-K26 retorno autónomo (507)",0],
  "6.1":["Límite cabina izquierda · contacto Q S1 del potenciómetro C-R10 (507)",1],"5.4":["Límite cabina derecha · contacto Q S2 del potenciómetro C-R10 (507)",1],
  "7.4":["Pulsador iluminación escalera túnel fijo (507)",0],"8.4":["Detectores de movimiento (507)",2]},
 "E-A3":{"2.1":["Estado E-K33 retorno outrigger (507)",0]},
 "E-A9":{"7.1":["Bumper ala A380 C-B25 (507)",1]},
 "P-A3":{"5.4":["Reserva (507: subir suelo va a P-A4 1.1)",0],"6.4":["Reserva (507: bajar suelo va a P-A4 2.1)",0]},
 "P-A4":{"1.1":["Subir suelo (507)",0],"2.1":["Bajar suelo (507)",0],"1.4":["Iluminación interior (507)",0],"2.4":["Desplegar capota (507)",0],
  "3.1":["Recoger capota (507)",0],"4.1":["Iluminación exterior (507)",0],"3.4":["Lunetas térmicas (507)",0],"4.4":["Prioridad de retorno (507)",0],
  "5.1":["Retorno autónomo (507)",0],"7.4":["Estado protecciones 24 VDC pupitre (507)",1],"8.4":["Retenedor portón (507)",2]},
 "P-A5":{"2.1":["Sensor freno cabina (507)",2],"1.4":["Error suelo (507)",0],"2.4":["Ultrasonidos de proximidad (507)",0],"3.1":["Fotocélula de proximidad (507)",0],
  "4.1":["Límite suelo FC PBB A380 (507)",2],"3.4":["Sensor ala PBB A380 (507)",0],"4.4":["Sensor capota retraída (507)",2]},
 "P-A6":{"1.1":["Pulsador «Abandono operador» (507)",0],"2.1":["Pulsador «Presencia desconexión» (507)",0],"1.4":["Pulsador «Presencia conexión» (507)",0],
  "2.4":["Pulsador luminoso «OK Handling» (507)",0],"3.1":["Reserva (507)",0],"4.1":["Outrigger izquierdo arriba (507)",2],"3.4":["Outrigger derecho abajo (507)",2],
  "4.4":["Presostato control bajada outriggers (507)",2],"5.1":["Crepuscular (507)",2],"6.1":["AKS motor 1 ET-B17 · 3 m (507)",2],"5.4":["AKS motor 1 ET-B17 · 1,5 m (507)",2],
  "6.4":["AKS motor 2 ET-B18 · 3 m (507)",2],"7.1":["AKS motor 2 ET-B18 · 1,5 m (507)",2],"8.1":["AKS motor A380 H-B19 · 3 m (507)",2],"7.4":["AKS motor A380 H-B19 · 1,5 m (507)",2],
  "8.4":["Bypass AKS (507)",0]}};
/* rev. J (resto de posiciones): P-A6 7.1 / 8.1 = láser detector de ala donde esté instalado (anotación sobre el folio 88) */
const BASE={"P-A6":{"7.1":["Láser detector de ala · salida 3 «velocidad lenta» (si lo lleva; si no, reserva)",2],"8.1":["Láser detector de ala · salida 1 «paro» (si lo lleva; si no, reserva)",2],"4.4":["Bypass AKS",0]}};
const ORIG=new Map();
function plcCada(fn){PLC.forEach(M=>M.m.forEach((mod,k)=>mod.forEach((L,l)=>{const p=pBorna(M,k+1,l+1);if(p)fn(M,L,p.in)})))}
plcCada((M,L,b)=>{const v=BASE[M.id]&&BASE[M.id][b];if(v){L[0]=v[0];L[1]=v[1]}});
let plcEn=null;
function plc507(on){on=!!on;if(plcEn===on)return;plcEn=on;
 plcCada((M,L,b)=>{const k=M.id+"|"+b;const v=L507[M.id]&&L507[M.id][b];if(!v)return;if(!ORIG.has(k))ORIG.set(k,[L[0],L[1]]);const o=ORIG.get(k);
  if(on){L[0]=v[0];L[1]=v[1]}else{L[0]=o[0];L[1]=o[1]}});
 pu507(on)}

/* ---------- 3. Puentes provisionales en la 507 ---------- */
/* Antiatrapamientos 507 (folio 64): sensores ópticos NPN de 4 hilos (marrón +24 V hilo 218, azul 0 V hilo 129, negro = salida a E-A9).
   La entrada se alimenta con el +24 V normal (hilo 218 desde E-X68:1), NO con la salida de test UT del módulo. */
const AT507={
 "5.1":{el:"IT-B4",lado:"túnel interior IZQUIERDO (sensor entre túnel interior y medio, izquierda)",hilo:"158",cl:"E-X51:3 (218) – E-X51:4 (158)",pw:"E-X51:10 (218) / E-X51:11 (129)"},
 "6.1":{el:"IT-B5",lado:"túnel interior DERECHO (sensor entre túnel interior y medio, derecha)",hilo:"159",cl:"E-X51:18 (218) – E-X51:19 (159)",pw:"E-X51:10 (218) / E-X51:11 (129)"},
 "2.1":{el:"MT-B2",lado:"túnel medio IZQUIERDO (sensor entre túnel medio y exterior, izquierda)",hilo:"182",cl:"E-X58:3 (218) – E-X58:4 (182)",pw:"E-X58:1 (218) / E-X58:2 (129)"},
 "8.1":{el:"MT-B3",lado:"túnel medio DERECHO (sensor entre túnel medio y exterior, derecha)",hilo:"183",cl:"E-X58:5 (218) – E-X58:6 (183)",pw:"E-X58:1 (218) / E-X58:2 (129)"}};
const at507Txt=b=>{const a=AT507[b];return `PBB 507 · Antiatrapamiento ${a.lado}: sensor óptico NPN ${a.el} (plano 507 folio 64). Liberar y limpiar primero; con el túnel COMPROBADO libre, puente solo de ese lado en el armario E: ${a.cl} (equivale al sensor libre) o +24 V E-X68:1 (hilo 218) con la borna IN ${b} de E-A9. En la 507 esta entrada no usa la salida de test UT: el puente ${b}–${b.replace(".1",".2")} no sirve.`};
const PU507={"E-A9|3|1":at507Txt("5.1"),"E-A9|3|2":at507Txt("6.1"),"E-A9|1|2":at507Txt("2.1"),"E-A9|4|2":at507Txt("8.1"),
 "E-A9|4|1":"PBB 507 · Bumper de ala A380 C-B25 (plano 507 folio 63): con el borde COMPROBADO libre y sin daños, puente 7.1–7.2 (IN–UT) en E-A9 o en la clema E-X59:3 (576) – E-X59:4 (217).",
 "E-A2|2|4":null,"E-A2|3|1":null,"E-A2|3|2":null,"E-A2|3|3":null};
const PU_ORIG={},REQ_ORIG={};
function pu507(on){Object.keys(PU507).forEach(k=>{if(!(k in PU_ORIG))PU_ORIG[k]=PUENTE[k];if(on){if(PU507[k])PUENTE[k]=PU507[k];else delete PUENTE[k]}else{if(PU_ORIG[k]===undefined)delete PUENTE[k];else PUENTE[k]=PU_ORIG[k]}});
 const k="E-A9|4|1";if(!(k in REQ_ORIG))REQ_ORIG[k]=PU_REQ[k];if(on)PU_REQ[k]=/bumper|borde|banda|\bala\b|a-?380|c-?b25/;else if(REQ_ORIG[k]===undefined)delete PU_REQ[k];else PU_REQ[k]=REQ_ORIG[k]}
window.plc507=plc507;

/* elemento de seguridad según la posición */
const SEG507={"5.1":["E-A9","5.1","E-X68:1 (218)","IT-B4","Antiatrapamiento túnel interior izquierdo · sensor óptico IT-B4 (PBB 507)"],
 "6.1":["E-A9","6.1","E-X68:1 (218)","IT-B5","Antiatrapamiento túnel interior derecho · sensor óptico IT-B5 (PBB 507)"],
 "2.1":["E-A9","2.1","E-X68:1 (218)","MT-B2","Antiatrapamiento túnel medio izquierdo · sensor óptico MT-B2 (PBB 507)"],
 "8.1":["E-A9","8.1","E-X68:1 (218)","MT-B3","Antiatrapamiento túnel medio derecho · sensor óptico MT-B3 (PBB 507)"]};
const ALA507=["E-A9","7.1","7.2","C-B25","Bumper ala A380 (solo PBB 507)"];
(function(){const o=segPosFix;segPosFix=function(x,pos){if(String(pos)==P5&&x){
  if(x[0]=="E-A9"&&SEG507[x[1]])return SEG507[x[1]];
  if(x[0]=="E-A8"&&x[1]=="2.1")return ["E-A8","2.1","2.2","T-B51 / T-B61 (relé Gelbau E1-U8)","Bordes de seguridad de ruedas (PBB 507)"]}
 return o(x,pos)}})();
(function(){const o=segOT;segOT=function(i){plc507(i&&String(i.pos)==P5);let r=o(i);if(!i||i.estado!="abierta"||String(i.pos)!=P5)return r;
 const t=txtOT(i);if(/bumper|borde|banda|parachoque/.test(t)&&/\bala\b|a-?380|c-?b25/.test(t)){r=r||{lim:false,cont:false,zs:[],n12:0};r.sen=(r.sen||[]).filter(x=>!(x[0]=="E-A10"&&x[1]=="2.1"&&!/lateral|cabina/.test(t)));
  if(!r.sen.some(x=>x[0]=="E-A9"&&x[1]=="7.1"))r.sen.unshift(ALA507)}
 return r}})();
if(typeof SEG_ALL!="undefined"&&!SEG_ALL.some(x=>x[0]=="E-A9"&&x[1]=="7.1"))SEG_ALL.push(ALA507);
(function(){const o=segPuente;segPuente=function(it){const i=otActual();if(i&&String(i.pos)==P5&&it&&it[0]=="E-A9"&&AT507[it[1]]){const a=AT507[it[1]];
  return `<div class="puit"><b>E-A9 · ${esc(it[4])}</b><div class="puac">⚡ PUENTE PROVISIONAL (PBB 507): en el armario E unir <b>${esc(a.cl)}</b> —equivale al sensor ${esc(a.el)} libre— o +24 V <b>E-X68:1 (hilo 218)</b> con la borna <b>IN ${esc(it[1])}</b> de E-A9. El LED del canal debe encenderse.</div>
  <div class="mu">En la 507 los antiatrapamientos son sensores ópticos NPN alimentados con +24 V (hilo 218), no barreras con salida de test: el puente ${esc(it[1])}–${esc(it[1].replace(".1",".2"))} (IN–UT) no sirve. Antes de puentear: con el túnel libre debe haber ≈24 V en la salida (hilo ${esc(a.hilo)}); 0 V → sensor tapado, sucio, desalineado o sin alimentación (medir 24 V entre ${esc(a.pw)}). Plano 507 folios 64 y 92.</div></div>`}
 return o(it)}})();
(function(){const o=puentesOT;puentesOT=function(i){plc507(i&&String(i.pos)==P5);return o(i)}})();

/* medidas analógicas 507 (folio 85): AIN01 inclinómetro IT-R3 · AIN02 potenciómetro giro cabina C-R10 (4-20 mA) · AIN03 láser de elongación ET-B9 · AIN04 anemómetro ET-V1 */
const AN507={2:{re:/cabina/,nom:"AIN02 · Potenciómetro de giro de cabina C-R10 (4-20 mA, PBB 507)",hilo:"304",orig:"viene de E-X62:4 (manguera EC-W9)"},
 3:{re:/extensi|retracc|laser|elongaci/,nom:"AIN03 · Medidor de elongación láser SICK DL50 ET-B9 (PBB 507)",hilo:"312",orig:"viene de E-X62:11 (manguera EET-W8)"}};
(function(){const o=puAnalog;puAnalog=function(i){if(!i||String(i.pos)!=P5)return o(i);if(i.estado!="abierta")return [];const t=txtOT(i);
 if(!PU_AN_MED.test(t)&&!/elongaci|anemom|viento|inclinom/.test(t))return [];const out=[];
 [2,3].forEach(ch=>{const C=AN507[ch];if(!C.re.test(t))return;
  out.push({key:"E-A4|1|"+ch,id:"E-A4",k:1,l:ch,an:ch,nom:C.nom,f:-85,b:null,suelta:false,
   t:`Soltar el hilo ${C.hilo} de la borna 1.${ch} (AI0${ch}) de E-A4 —${C.orig}— y aislarlo. Poner una resistencia de 2,2 kΩ 1 W entre +24 V (E-X62:5, hilo 218) y la borna 1.${ch}: ≈11 mA fijos (media escala). Para la posición real: R = 24 V ÷ I (1,5 kΩ ≈ 16 mA · 4,7 kΩ ≈ 5 mA). Plano 507 folio 85.`})});
 return out}})();
(function(){const o=puenteHTML;puenteHTML=function(i,P){let h=o(i,P);h=h.replace(/\(folio -(\d+)\)/g,"(plano 507 folio $1)");if(!i||String(i.pos)!=P5)return h;
 return h.replace(/Siguen activas las protecciones físicas:[^<]*/,"Siguen activas las protecciones físicas de la 507: límites de cabina (contactos Q S1 / Q S2 del propio C-R10 → E-A2 6.1 / 5.4; si el C-R10 está averiado pueden fallar también), FC túneles ET-S1, sensores de extensión (E-A2 3.4 / 4.4) y FC inclinación IT-S2. No se tocan.")
  .replace(/La medida de ALTURA[^<]*/,"En la 507 no se puentean el INCLINÓMETRO (AIN01, IT-R3) ni el ANEMÓMETRO (AIN04, ET-V1 por relé tacométrico E-U7): protegen la pendiente del túnel y la operación con viento.")}})();

/* ---------- 4. Textos de la guía corregidos para la 507 ---------- */
const PAS=GUIA.tipos.PAS;
GUIA.fuente=GUIA.fuente.replace("Para 504/507/508 hay datos propios del esquema PBB 504.","504 / 508: esquema PBB 504 · 507: esquema propio T87911031230 (A380, rev. C, 122 folios).");
(function(){const S=PAS.s.find(x=>/^Antiatrapamiento/.test(x.t));if(!S)return;
 S.p=S.p.map(x=>x.replace("POSICIONES 504, 507 y 508 (planos PBB 504","POSICIONES 504 y 508 (plano PBB 504").replace("Barrera óptica (504, 507, 508)","Barrera óptica (504, 508) o sensor óptico (507)")
  .replace("PRIORIDAD 2 · Barreras ópticas (504/507/508)","PRIORIDAD 2 · Barreras ópticas (504/508)").replace("todas las posiciones salvo 504, 507 y 508","todas las posiciones salvo 504, 507 y 508 (cada una con su plano)"));
 const add=(re,txt,f)=>{const k=S.p.findIndex(x=>re.test(x));if(k<0||S.p.includes(txt))return;S.p.splice(k+1,0,txt);if(S.g)S.g.splice(k+1,0,f)};
 add(/^POSICIONES 504 y 508/,"POSICIÓN 507 (plano propio T87911031230, folio 64): SENSORES ÓPTICOS NPN de 4 hilos (marrón +24 V hilo 218, azul 0 V hilo 129, negro salida). Túnel interior: IT-B4 izquierdo → hilo 158 → E-X51:4 → E-A9 5.1 · IT-B5 derecho → hilo 159 → E-X51:19 → E-A9 6.1. Túnel medio: MT-B2 izquierdo → hilo 182 → E-X58:4 → E-A9 2.1 · MT-B3 derecho → hilo 183 → E-X58:6 → E-A9 8.1.",-64);
 add(/^PRIORIDAD 2 · Barreras ópticas \(504\/508\)/,"PRIORIDAD 2 · PBB 507: estas entradas NO usan la salida de test UT. Puente solo del lado activado con +24 V (hilo 218): en la clema E-X51:3–4 (interior izq.), E-X51:18–19 (interior dcha.), E-X58:3–4 (medio izq.), E-X58:5–6 (medio dcha.) o E-X68:1 (218) con la borna IN en E-A9.",-64)})();
(function(){const S=PAS.s.find(x=>/carro de aire/i.test(x.t));if(!S||S.p.some(x=>/PBB 507/.test(x)))return;
 S.p.push("PBB 507: su plano no tiene bloqueos de A/A en E-A2 (E-A2 5.1 es el estado de E-K26, retorno autónomo). Bloqueo general disponible: «Bloqueo PBB seta AO» en E-A3 1.1 (folio 83). Revisar el equipo y la manguera CBTH ↔ E-X61.");if(S.g)S.g.push(-83)})();

/* procedimientos propios de la 507 (solo se ven en OT de la 507) */
const PR507=[
 {t:"PBB 507 · Outriggers (estabilizadores A380) no suben / no bajan",k:/outrigger|estabiliz|apoyo|patas?\b/,
  a:"Antes de mover la pasarela, outriggers ARRIBA. Bajar outriggers con la PBB parada y con el operador A380.",
  p:["QUÉ HAY (plano 507 folio 71): electroválvulas 24 VDC H-Y6 SUBIR, H-Y7 BAJAR y H-Y8 ACTIVAR outriggers, mandadas por los relés E-K66, E-K67 y E-K65 con +24 V hilo 218 (E-X68:1). Bobinas por E-X55:23 / :22 / :24 → H-X51 → mangueras HH-W40 / HH-W41 / HH-W45; 0 V hilo 129.",
   "Órdenes del PLC (folio 103): P-A2 5.1 «OUTRIGGER UP» → E-K66 · 6.1 «OUTRIGGER DOWN» → E-K67 · 5.4 «OUTRIGGER ACTIVADO» → E-K65 (hilos 64 / 66 / 201 por P-X64:7-9 → manguera EP-W5 → E-X64:7-9).",
   "Con la orden pulsada: ¿enciende el LED de salida de P-A2? No → condiciones del PLC (ver entradas). Sí → medir 24 V en la bobina del relé E-K6x (A1-A2).",
   "Relé activado: medir 24 V en la electroválvula (x1-x2). Llega tensión y no actúa → bobina o válvula agarrotada. No llega → contacto del relé, E-X55 / H-X51 o manguera.",
   "Para subir/bajar outriggers hace falta la bomba: E-K3 (E-A6 8.1) y, en retorno, el variador de bomba (ver «Retorno autónomo y bomba con retorno»).",
   "Entradas (folio 110): P-A6 4.1 «outrigger izquierdo arriba», 3.4 «outrigger derecho abajo» y 4.4 «presostato control bajada outriggers». Comprobar detectores, fijación y que cambian con el movimiento.",
   "Retorno con outriggers: E-A6 6.1 «RETORNO OUTRIGGER» → contactor E-K33; su estado en E-A3 2.1 (folio 83)."],
  g:[-71,-103,-103,-71,-88,-110,-88],r:"plano 507 folios 70, 71, 88, 103, 110"},
 {t:"PBB 507 · Sensores anticolisión AKS de motores (para / va lenta)",k:/\baks\b|anticolis|colision|motor(es)? de traslaci.*(lent|para)|obstacul/,
  p:["QUÉ HAY (plano 507 folio 69): tres sensores AKS con dos zonas cada uno (Q1 = 3 m, Q2 = 1,5 m): ET-B17 AKS motor 1 · ET-B18 AKS motor 2 · H-B19 AKS motor A380. Alimentación +24 V hilo 218 / 0 V hilo 129 por E-X97:1-2 (conectores SAC-5P-M12).",
   "Salidas a P-A6 (folio 111) por E-X59:17-22: ET-B17 → 6.1 (3 m) y 5.4 (1,5 m) · ET-B18 → 6.4 (3 m) y 7.1 (1,5 m) · H-B19 → 8.1 (3 m) y 7.4 (1,5 m).",
   "La PBB va lenta o se para cerca de un obstáculo: comprobar que no hay nada en la zona del motor (calzos, equipos, nieve, suciedad en la óptica) y limpiar la ventana del sensor.",
   "Sin obstáculo y el LED de P-A6 del sensor activado: medir 24 V en E-X97:1-2 y la salida en E-X59 con el sensor libre; revisar el conector M12 y la manguera EET-W13 / EET-W14 / EH-W15.",
   "Bypass AKS (P-A6 8.4): solo para maniobra controlada, en MANUAL y con un compañero vigilando la zona de las ruedas."],
  g:[-69,-111,-69,-69,-111],r:"plano 507 folios 69, 111"},
 {t:"PBB 507 · Retorno autónomo y bomba con retorno (variador E1-U6)",k:/retorno (autonomo|de emergencia)|sin tension|bomba con retorno|variador (de )?bomba|e1-?u6|acs355/,
  p:["QUÉ HAY (plano 507 folios 40 y 50): en retorno autónomo la bomba hidráulica se alimenta por el contactor E-K33 desde el variador ABB ACS355 E1-U6 (7,5 kW), alimentado por E-K26 y por el contactor de seguridad 3 E-K102.",
   "Contactores de seguridad en la 507: E-K0 (seguridad 1, E-A6 3.1), E-K101 (seguridad 2, E-A6 4.1, alimenta el monofásico E-Q150) y E-K102 (seguridad 3, E-A6 5.1). Estados en E-A0: 1.1 E-K0 · 3.4 E-K101 · 4.4 E-K102.",
   "Orden de marcha del variador: P-A2 «ACTIVAR VARIADOR BOMBA» (folio 102) → DI1 del E1-U6 (X1A.12, hilo 399 desde E-X64:6); DI5 desde E-X58:8 (hilo 251); DCOM 0 V hilo 129.",
   "Variador en fallo: leer el código en el panel del ACS355, comprobar entrada STO (X1C, puentes OUT1-IN1 / OUT2-IN2) y la potencia por E-X105:1-3; motor por E-X105:6-8.",
   "Estado del retorno: E-A2 5.1 «estado E-K26» (folio 82) y P-A4 5.1 «retorno autónomo» / 4.4 «prioridad de retorno» (folio 107)."],
  g:[-50,-88,-102,-50,-82],r:"plano 507 folios 25, 40, 50, 75, 87, 88, 102"},
 {t:"PBB 507 · Medidas analógicas (inclinómetro, giro cabina, elongación, anemómetro)",k:/inclinom|elongaci|anemom|viento|medid|potenciom|giro (de )?cabina|laser|analog/,
  p:["QUÉ HAY (plano 507 folio 85, E-A4 IB IL AI 4/I-PAC 4-20 mA): AIN01 INCLINÓMETRO IT-R3 (hilo 302, E-X62:2) · AIN02 POTENCIÓMETRO GIRO CABINA C-R10 (hilo 304, E-X62:4) · AIN03 MEDIDOR DE ELONGACIÓN láser SICK DL50 ET-B9 (hilo 312, E-X62:11) · AIN04 ANEMÓMETRO ET-V1 por relé tacométrico E-U7 (hilo 407, E-X62:16).",
   "P-A7 (folio 112, IB IL AI 2/SF): AIN01 INCLINÓMETRO DEL SUELO BASCULANTE C-R3.1 (hilo 677, P-X62:2; +24 V hilo 184 desde P-X92.1:22).",
   "Medir 4-20 mA en serie en el canal: 0 mA = lazo abierto o sin alimentación (+24 V hilo 218 en E-X62:5 / :9, 0 V 129) · < 4 mA = sensor o cable · 4-20 mA variando y la Magelis no lo muestra = canal de E-A4.",
   "Giro de cabina: el C-R10 de la 507 da 4-20 mA directo (no lleva convertidor E-R10) y además los límites de cabina: Q S1 → E-X62:7 (hilo 306) → E-A2 6.1 izquierda · Q S2 → E-X62:8 (hilo 307) → E-A2 5.4 derecha.",
   "Elongación: limpiar la óptica del DL50 y el reflector; el sensor tiene display y LED Q / run. Alimentación por manguera EET-W8.",
   "PUENTE PROVISIONAL (solo giro de cabina o elongación): soltar el hilo del canal en E-A4 y poner 2,2 kΩ 1 W entre +24 V (E-X62:5, hilo 218) y la borna 1.2 (cabina) o 1.3 (elongación). El inclinómetro y el anemómetro no se puentean."],
  g:[-85,-112,-85,-85,-85,-85],r:"plano 507 folios 85, 112"},
 {t:"PBB 507 · Bumper de ala A380 / bordes de ruedas",k:/bumper|borde|banda|\bala\b|a-?380/,
  p:["BUMPER DE ALA A380 C-B25 (plano 507 folio 63): contacto por C-GER4 → manguera CP-W25 → P-X92:21-22 → P-X51:3-4 → manguera EP-W1 → E-X59:3-4 → E-A9 7.1 (IN, hilo 217) / 7.2 (UT, hilo 576). En reposo LED 7.1 encendido.",
   "Bumper activado: liberar el borde, revisar golpes, conector C-GER4 y continuidad 1-2 del C-B25. Puente provisional (borde comprobado libre): E-A9 7.1–7.2 o E-X59:3–4.",
   "BORDES DE RUEDAS (folio 62): T-B51 trasero y T-B61 delantero → relé Gelbau E1-U8 (452.46) → contacto 13-14 → E-A8 2.1 / 2.2 (hilos 385 / 376). LED del E1-U8: rojo = borde pisado · amarillo = fallo de circuito (cable o borde cortado, conectores T-GER1/2/3) · verde = salida activada.",
   "Rearme del Gelbau: entrada RESET Y1-Y2. Puente provisional (borde comprobado): E-A8 2.1–2.2 o E-X117:1–2."],
  g:[-63,-63,-62,-62],r:"plano 507 folios 62, 63, 91, 92"}];
const PR_IX=PR507.map(o=>{const {k,...s}=o;return PAS.s.push(s)-1});
const esPR507=si=>PR_IX.includes(si);
(function(){const o=anaOT;anaOT=function(i){const r=o(i);if(!r||r._p507)return r;r._p507=1;if(r.tipo&&r.tipo!="PAS")return r;
 const es=i&&String(i.pos)==P5;r.guia=(r.guia||[]).filter(g=>es||!esPR507(g.si));
 if(es){const t=txtOT(i);PR507.forEach((p,j)=>{if(p.k.test(t)&&!r.guia.some(g=>g.si==PR_IX[j]))r.guia.unshift({si:PR_IX[j],t:PAS.s[PR_IX[j]].t,sc:50})})}
 return r}})();

/* ---------- 5. Comprobaciones por sistema ---------- */
const SIS=window.SIS;
if(SIS&&SIS.PAS){
 const sys=re=>SIS.PAS.find(x=>re.test(x.s));
 const no5=(S,re)=>{if(!S)return;S.c=S.c.map(c=>typeof c=="string"&&re.test(c)?{t:c,no:[P5]}:c)};
 const add=(S,items)=>{if(S)items.forEach(x=>S.c.push(x))};
 const s5=(t,f)=>({t,solo:[P5],f});
 /* antiatrapamientos: las barreras SICK L41 son de 504/508; la 507 lleva sensores ópticos NPN */
 const A=sys(/^Antiatrapamiento/);if(A){A.c.forEach(c=>{if(typeof c=="object"&&c.solo&&c.solo.includes("507")&&/SICK|MT-B1/.test(c.t))c.solo=["504","508"]});
  add(A,[s5("PBB 507 (folio 64): sensores ópticos NPN IT-B4 (interior izq.) y IT-B5 (interior dcha.) → E-A9 5.1 / 6.1 por E-X51:4 / :19 (hilos 158 / 159). Alimentación +24 V hilo 218 y 0 V 129 (E-X51:10-11).",-64),
   s5("PBB 507: MT-B2 (medio izq.) y MT-B3 (medio dcha.) → E-A9 2.1 / 8.1 por E-X58:4 / :6 (hilos 182 / 183). Alimentación E-X58:1-2.",-64),
   s5("PBB 507: con el túnel libre la salida del sensor da ≈24 V. Puente provisional solo del lado activado: E-X51:3–4 / E-X51:18–19 / E-X58:3–4 / E-X58:5–6 (no IN–UT).",-92)])}
 /* rotonda, extensión, inclinación y medidas: la 507 es distinta */
 const R=sys(/^Rotonda, extensi/);if(R){R.no=[P5];
  SIS.PAS.splice(SIS.PAS.indexOf(R)+1,0,{s:"PBB 507 · Rotonda, extensión, inclinación y medidas",f:[],solo:[P5],c:[
   s5("Giro de rotonda: inductivos en E-A2 2.4 (izquierda) y 3.1 (derecha) · encoder Posital R-R10 (OCD-EM01B, Ethernet/IP al switch CBTH-V1:X8, 24 V por IT-X51:1-2, conector M12).",-61),
   s5("Inclinación: sensor de inclinación E-A2 4.1 e inclinómetro analógico IT-R3 (E-A4 AIN01, hilo 302).",-81),
   s5("Extensión/retracción: sensores 1 y 2 en E-A2 3.4 y 4.4 · medidor de elongación láser SICK DL50 ET-B9 (E-A4 AIN03, hilo 312).",-81),
   s5("Giro de cabina: potenciómetro C-R10 4-20 mA (E-A4 AIN02, hilo 304) con límites de cabina Q S1 / Q S2 → E-A2 6.1 / 5.4.",-85),
   s5("Anemómetro ET-V1 → relé tacométrico E-U7 (SC320) → E-A4 AIN04 (hilo 407, E-X62:16). Lectura de viento incoherente: revisar giro del anemómetro, cable EET-W65 y alimentación de E-U7.",-85),
   s5("Inclinómetro del suelo basculante C-R3.1 → P-A7 AIN01 (hilo 677, P-X62:2).",-112)]})}
 /* finales de carrera: en la 507 solo IT-S2 en inclinación */
 const FC=sys(/^Finales de carrera/);no5(FC,/IT-S2 e inferior IT-S3/);
 add(FC,[s5("PBB 507 (folio 66), todos NC en serie entre IN y UT de E-A8: inclinación IT-S2 → E-X51:12-13 → E-A8 8.1/8.2 · rotonda CO-S1 → E-X51:16/22 → 7.1/7.2 · túneles ET-S1 → E-X54:7-8 → 6.1/6.2 · traslación H-S1 → E-X55:12-13 → 5.1/5.2.",-66)]);
 /* bordes: relé distinto en la 507 */
 const B=sys(/^Bordes, zapata/);no5(B,/^Bordes de ruedas T-B5/);
 add(B,[s5("PBB 507 (folio 62): bordes T-B51 (trasero) y T-B61 (delantero) → relé Gelbau E1-U8 → E-A8 2.1 / 2.2. LED rojo = pisado · amarillo = fallo de circuito · verde = salida activa. Reset por Y1-Y2.",-62),
  s5("PBB 507 (folio 63): bumper de ala A380 C-B25 → E-X59:3-4 → E-A9 7.1 / 7.2 (LED 7.1 encendido en reposo).",-63)]);
 /* elevación */
 const E=sys(/^Elevación hidráulica/);no5(E,/^Válvulas H-Y1 subir|^Bajada rápida: H-Y3/);
 add(E,[s5("PBB 507 (folio 70): H-Y1 VÁLVULA BAJAR 24 V desde la salida safety E-A7 1.1 (E-X56:15/19) · H-Y4 / H-Y5 bajada rápida izq./dcha. 12 V desde E-A7 2.1 (E-X56:20-21) · H-Y3 bajada rápida 24 V desde E-A7 5.1 (E-X56:22-23).",-70),
  s5("PBB 507: bomba por E-K3 (E-A6 8.1) y, en retorno, por E-K33 desde el variador E1-U6. Outriggers H-Y6 / H-Y7 / H-Y8 en el mismo grupo.",-88)]);
 /* cabina */
 const C=sys(/^Cabina: giro/);no5(C,/^Límites de cabina C-B1|^FC límite de suelo C-S1|^Contacto avión:/);
 add(C,[s5("PBB 507: límites de cabina por el potenciómetro C-R10 (Q S1 → E-A2 6.1 · Q S2 → E-A2 5.4) · sensor de freno de cabina P-A5 2.1.",-85),
  s5("PBB 507 (folio 108): P-A5 1.4 error suelo · 4.1 límite suelo FC A380 · 3.4 sensor ala A380 · 4.4 sensor capota retraída · proximidad por ultrasonidos 2.4 y fotocélula 3.1 · contacto avión derecha 1.1.",-108),
  s5("PBB 507: subir / bajar suelo en P-A4 1.1 / 2.1 (no en P-A3) · retenedor del portón P-A4 8.4.",-106)]);
 /* interfaz A/A: no existe en E-A2 en la 507 */
 const I=sys(/^Interfaz con equipos/);if(I)I.no=[P5];
 /* safety */
 add(sys(/^Módulos de seguridad/),[s5("PBB 507 (folios 87-90): E-A6 3.1 E-K0 · 4.1 E-K101 (seguridad 2) · 5.1 E-K102 (seguridad 3) · 6.1 E-K33 retorno outrigger · 7.1 sirena · 8.1 E-K3 bomba. E-A7 1.1 válvula bajar · 2.1 bajada rápida izq./dcha. · 3.1 seta VDGS · 4.1 retorno autónomo · 5.1 bajada rápida.",-88),
  s5("PBB 507: E-A9 7.1 = bumper de ala A380 (en la rev. J es reserva).",-92)]);

 /* sistemas nuevos */
 SIS.PAS.push({s:"PBB 507 · Outriggers A380",f:[],solo:[P5],c:[
  s5("Válvulas H-Y6 subir / H-Y7 bajar / H-Y8 activar (24 V) por E-K66 / E-K67 / E-K65; +24 V hilo 218, 0 V 129.",-71),
  s5("Órdenes P-A2 5.1 up / 6.1 down / 5.4 activado → P-X64:7-9 → EP-W5 → E-X64:7-9 → bobinas.",-103),
  s5("Entradas P-A6 4.1 izquierdo arriba · 3.4 derecho abajo · 4.4 presostato control bajada.",-110),
  s5("Retorno outrigger: E-A6 6.1 → E-K33 (estado E-A3 2.1).",-88)]});
 SIS.PAS.push({s:"PBB 507 · Sensores AKS de motores",f:[],solo:[P5],c:[
  s5("ET-B17 (motor 1), ET-B18 (motor 2), H-B19 (motor A380): 24 V por E-X97:1-2; Q1 3 m / Q2 1,5 m.",-69),
  s5("Entradas P-A6: 6.1 / 5.4 (ET-B17) · 6.4 / 7.1 (ET-B18) · 8.1 / 7.4 (H-B19) · bypass AKS 8.4.",-111),
  s5("Limpiar la ventana del sensor y comprobar que no hay obstáculo en la zona del motor antes de tocar el cableado.",-69)]});
 SIS.PAS.push({s:"PBB 507 · Retorno autónomo y contactores de seguridad",f:[],solo:[P5],c:[
  s5("E-K0 (seguridad 1) · E-K101 (seguridad 2, monofásico E-Q150) · E-K102 (seguridad 3). Estados en E-A0 1.1 / 3.4 / 4.4.",-75),
  s5("Bomba con retorno: variador ABB ACS355 E1-U6 7,5 kW alimentado por E-K26 / E-K102; salida al motor por E-K33. Orden P-A2 «activar variador bomba».",-50),
  s5("Retorno autónomo: E-K26 (estado E-A2 5.1) · E-A7 4.1 · pulsadores P-A4 5.1 retorno y 4.4 prioridad.",-40)]});
}

/* sistemas para todas las posiciones (PAS) */
if(SIS&&SIS.PAS){
 SIS.PAS.push({s:"Grupo hidráulico · diagnóstico (descripción técnica TKAS)",f:[34,44],c:[
  "Datos: motor 5,5 kW (12,8 A en estrella 400 V) · bomba de engranajes 22 l/min · limitadora 145 ± 5 bar · depósito 200 l, aceite ISO VG 46 · filtro de retorno 25 µm con by-pass.",
  "Subida: con la bomba en marcha esperar 4-5 s en circuito libre; la válvula 2/2 de subida (pos. 4, 24 V) cierra el retorno y sube a 1,15 m/min.",
  "NO SUBE: bomba no gira → alimentación / motor · gira sin presión → limitadora (pos. 3), aire en la bomba (nivel de aceite, acoplamiento, estanqueidad del eje) · válvula de subida (pos. 4) sin tensión o bloqueada.",
  "NO BAJA (normal): válvula 4/2 de bajada (pos. 5.2, 24 V) y grifo de pilotaje (pos. 11) ABIERTO; la presión de pilotaje abre las retenciones de los cilindros (20.1 / 20.2). Velocidad con el grifo regulable (pos. 10): 1,23 m/min ≈ 48,8 s por metro.",
  "NO HACE BAJADA RÁPIDA: deben entrar a la vez las válvulas de retención eléctrica de los cilindros 21.1 / 21.2 (12 V, H-Y4 / H-Y5) y la de bloque 5.1 (24 V, H-Y3). Velocidad ≈ 6,4 m/min (9,4 s por metro), ajuste con la válvula regulable (7).",
  "BAJA SOLA / NO MANTIENE POSICIÓN o inclinación anómala: estanqueidad de las retenciones 20 y 21 y fugas en los cilindros.",
  "BAJADA SIN CORRIENTE: bomba manual con minimanguera (Ermeto SMA3, M16) en la toma (pos. 12); cerrar el grifo 11 (palanca a la IZQUIERDA) y bombear para abrir 20.1 / 20.2. Al terminar, abrir el grifo 11 (palanca a la DERECHA).",
  "Comprobaciones: nivel en el visor (pos. 14), aceite < 80 °C tras trabajar, sin fugas en central, bloque, tuberías y cilindros; manómetro en 9.1 / 9.2.",
  "Purga de cilindros: manómetro en 9.1, cerrar poco a poco el grifo 10 hasta 15-20 bar subiendo y aflojar los purgadores hasta que salga aceite sin burbujas."]});
 SIS.PAS.push({s:"Láser detector de ala (P-A6 7.1 / 8.1)",f:[88],no:["504","507","508"],c:[
  "Dónde lo haya instalado (anotación sobre el folio 88 de la rev. J): módulo láser alimentado a 24 V / 0 V, con bus CAN (H / L) hacia el cabezal.",
  "Salida digital 1 «STOP» → P-A6 8.1 (paro) · salida digital 3 «LOW SPEED» → P-A6 7.1 (velocidad lenta). En la Magelis o en el LED: P-A6 módulo 4 LED 2 (paro) y LED 1 (lenta).",
  "La PBB se para o va lenta en la aproximación sin ala cerca: limpiar el cabezal láser, revisar su orientación y el conector del bus CAN; medir 24 V en el módulo.",
  "Sin láser instalado esas entradas son reserva y deben estar apagadas."]});
 /* CT y UPS por posición (listado de CT del T4 y T4S) */
 const CT=[
  ["11",[372,374,376,378,380,382,384,386],"escaleras detrás del poste de la guía de la 373; abajo, el CT está unos 5 m a la derecha","Cuadro B, panel 4, diferencial S10"],
  ["13",[364,366,368,370,388,390,392,394],"escaleras debajo del túnel fijo de la 366; abajo, unos 5 m a la derecha","Cuadro A, panel 5, diferencial S10"],
  ["15",[352,354,356,358,360,362],"escaleras debajo del túnel fijo de la 356; abajo, unos 50 m a la derecha","Cuadro A, panel 1, diferencial S10"],
  ["16",[342,344,346,348,350],"escaleras debajo del túnel fijo de la 346 (abajo, unos 5 m a la izquierda) o entre la 350 y la 352 (abajo, unos 10 m a la derecha)","Cuadro A, panel 1, diferencial S10"],
  ["18",[300,302,304,336,338,340],"escaleras detrás del poste de la guía de la 338; abajo, unos 2 m a la izquierda","Cuadro B, panel 1, diferencial S10"],
  ["20",[306,308,310,312,330,332,334],"escaleras debajo del túnel fijo de la 332; abajo, unos 2 m a la izquierda","Cuadro A, panel 1, diferencial S10"],
  ["21",[568,570,572,574,576,578,580,582,584,586],"escaleras detrás del poste de la guía de la 572; abajo, unos 10 m a la izquierda","circuito 1: Cuadro A, 1ª puerta izquierda, automático GA 21-11 · circuito 2: Cuadro B, 2ª puerta izquierda, automático GB 21-10"],
  ["23",[500,502,504,508,510,512,516,562,564,566],"escaleras detrás del poste de la guía de la 564; abajo, unos 50 m a la derecha","circuito 1: Cuadro A, 1ª puerta izquierda, automático GA 23-10 · circuito 2: Cuadro B, 1ª puerta izquierda, automático GB 23-11"],
  ["24",[518,520,522,524,526,548,550,552,554,556,558,560],"escaleras a la izquierda del túnel fijo de la 556; abajo, unos 50 m a la izquierda","circuito 1: Cuadro A, 1ª puerta izquierda, automático GA 24-11 · circuito 2: Cuadro B, 1ª puerta izquierda, automático GB 24-8"],
  ["26",[528,530,532,534,536,538,540,542,544,546],"escaleras detrás del poste de la guía de la 549; abajo, unos 20 m a la izquierda","circuito 1: Cuadro A, 1ª puerta izquierda, automático GA 26-11 · circuito 2: Cuadro B, 1ª puerta izquierda, automático GB 26-11"]];
 const todas=[].concat(...CT.map(x=>x[1].map(String)));
 SIS.PAS.push({s:"SAI de la PBB · centro de transformación (CT)",f:[9,29],c:[
  "Sin 220 V de SAI en CBTH-X12 (1-2): la UPS de la posición está en su CT. Ir con autorización y comprobar el automático indicado antes de tocar la PBB.",
  ...CT.map(([n,pos,acc,ups])=>({t:`CT ${n} (posiciones ${pos.join(", ")}): bajar por ${acc}. Automático de la UPS: ${ups}.`,solo:pos.map(String)})),
  {t:"Esta posición no figura en el listado de CT del T4 / T4S: preguntar a CGA o al Responsable de Turno qué CT la alimenta.",no:todas}]});
}

/* ---------- 6. Pintado: plano y folio correctos, procedimientos 507 ocultos fuera de la 507 ---------- */
(function(){const o=vTec;vTec=function(){const i0=otActual();plc507(i0&&String(i0.pos)==P5);const r=o.apply(this,arguments);try{
 const i=otActual();const es=i&&String(i.pos)==P5;
 if(!es)PR_IX.forEach(si=>{const d=document.querySelector(`#app details.gd[data-k="PAS${si}"]`);if(d)d.remove()});
 else{const ai=PAS.s.findIndex(x=>/^Medidas anal/.test(x.t));const d=ai>=0&&document.querySelector(`#app details.gd[data-k="PAS${ai}"]`);if(d)d.remove()}
 document.querySelectorAll("#app .gpl").forEach(b=>{const oc=b.getAttribute("onclick")||"";const m=oc.match(/gPlano\('PAS',\s*(-?\d+)\)|gPlanoRCS\((-?\d+)\)/);if(!m)return;
  const f=+(m[1]||m[2]);const s=b.querySelector("small");if(!s)return;const v=es?f507(f):Math.abs(f);if(String(v)!=s.textContent)s.textContent=v;
  if(es)b.setAttribute("aria-label","Ver plano 507 folio "+v)});
 document.querySelectorAll("#app details.gd .mu").forEach(e=>{if(/Planos: .*-\d/.test(e.textContent))e.textContent=e.textContent.replace(/(^|[\s,(])-(\d+)/g,"$1$2")});
 if(es){const c=[...document.querySelectorAll("#app .card")].find(x=>/Guía de campo/.test((x.querySelector("h3")||{}).textContent||""));
  if(c&&!c.querySelector(".g507"))c.insertAdjacentHTML("beforeend",`<div class="g507 mu" style="font-size:12px;margin-top:6px;border-left:3px solid var(--ac);padding-left:8px">PBB 507 (A380): plano propio T87911031230ES. Los botones de plano abren el folio equivalente del plano 507 (p. ej. E-A9 = folio 92, E-A4 = 85). Cambia respecto al esquema general: antiatrapamientos ópticos sin salida de test, bumper de ala (E-A9 7.1), outriggers, sensores AKS, medidas analógicas propias, contactores E-K101 / E-K102 y sin bloqueos A/A en E-A2. La inspección cable a cable sigue el esquema general: coteja hilos y bornas con el plano 507.</div>`)}
 }catch(e){console.warn("pbb507",e)}return r}})();
if(typeof gPintaCot=="function"){const o=gPintaCot;gPintaCot=function(){const i=otActual();plc507(i&&String(i.pos)==P5);return o.apply(this,arguments)}}
})();
