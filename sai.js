/* ===== v102: SAI de las PBB y retorno autónomo =====
 CT = cuarto de BAJA TENSIÓN donde están las alimentaciones de 220 Vac de SAI de las pasarelas (listado de CT del T4 y T4S).
 1. CT de SAI por PBB: en la cabecera de la guía de campo, en el «Mapa de alimentaciones» y en «Comprobaciones por sistema».
 2. Mapa de alimentaciones corregido según el esquema general rev. J (folios 9, 29, 30, 31) y el plano 507 (folios 9, 40, 44, 47, 54):
    frenos, megafonía, retorno autónomo y switch cuelgan del 220 V de SAI (E-X66), no del 24 VDC.
 3. Guía aparte «Traslación con alimentación de SAI (retorno autónomo)», con su variante para la 507.
 Rev. J: SAI 220 V → CBTH-X12:1-2 → ECBTH-W3 → E-S0.1 → E-X66:1-2 →
   E-Q22 (3 A) → fuente E-V3 24 V 10 A (mando y PLC) · E-Q24 (6 A) → E-K0.1 5-6 → E-K24 → frenos T-Y1 / T-Y2 ·
   E-Q25 (6 A) megafonía · E-Q18 switch · E-Q26 (2P 16 A) → E-K26 → E-K0 23-24 → L1 / L2 de los variadores E-U1 / E-U2.
   E-K26: bobina 24 V desde la salida safety E-A7 4.1 (DOS04, hilos 735 / 736); estado por su contacto 51-52 en P-A5 3.4.
   Pupitre: CP-S27 «RETORNO AUTÓNOMO» → P-A4 1.4 · CP-S21 «PRIORIDAD DE RETORNO» → P-A4 2.1. ===== */
(function(){
"use strict";
const CT=[
 ["11",[372,374,376,378,380,382,384,386],"las escaleras detrás del poste de la guía de la 373; abajo, el CT está unos 5 m a la derecha","Cuadro B, panel 4, diferencial S10"],
 ["13",[364,366,368,370,388,390,392,394],"las escaleras debajo del túnel fijo de la 366; abajo, unos 5 m a la derecha","Cuadro A, panel 5, diferencial S10"],
 ["15",[352,354,356,358,360,362],"las escaleras debajo del túnel fijo de la 356; abajo, unos 50 m a la derecha","Cuadro A, panel 1, diferencial S10"],
 ["16",[342,344,346,348,350],"las escaleras debajo del túnel fijo de la 346 (abajo, unos 5 m a la izquierda) o las que hay entre la 350 y la 352 (abajo, unos 10 m a la derecha)","Cuadro A, panel 1, diferencial S10"],
 ["18",[300,302,304,336,338,340],"las escaleras detrás del poste de la guía de la 338; abajo, unos 2 m a la izquierda","Cuadro B, panel 1, diferencial S10"],
 ["20",[306,308,310,312,330,332,334],"las escaleras debajo del túnel fijo de la 332; abajo, unos 2 m a la izquierda","Cuadro A, panel 1, diferencial S10"],
 ["21",[568,570,572,574,576,578,579,580,582,584,586],"las escaleras detrás del poste de la guía de la 572; abajo, unos 10 m a la izquierda","circuito 1: Cuadro A, 1ª puerta izquierda, automático GA 21-11 · circuito 2: Cuadro B, 2ª puerta izquierda, automático GB 21-10"],
 ["23",[500,502,504,508,510,512,516,562,564,566],"las escaleras detrás del poste de la guía de la 564; abajo, unos 50 m a la derecha","circuito 1: Cuadro A, 1ª puerta izquierda, automático GA 23-10 · circuito 2: Cuadro B, 1ª puerta izquierda, automático GB 23-11"],
 ["24",[518,520,522,524,526,548,550,552,554,556,558,560],"las escaleras a la izquierda del túnel fijo de la 556; abajo, unos 50 m a la izquierda","circuito 1: Cuadro A, 1ª puerta izquierda, automático GA 24-11 · circuito 2: Cuadro B, 1ª puerta izquierda, automático GB 24-8"],
 ["26",[528,530,532,534,536,537,538,540,542,544,546],"las escaleras detrás del poste de la guía de la 549; abajo, unos 20 m a la izquierda","circuito 1: Cuadro A, 1ª puerta izquierda, automático GA 26-11 · circuito 2: Cuadro B, 1ª puerta izquierda, automático GB 26-11"]];
const ctDe=pos=>{pos=String(pos||"").replace(/^T/i,"");const c=CT.find(x=>x[1].map(String).includes(pos));return c?{n:c[0],pos:c[1],acc:c[2],ups:c[3],t4:+c[0]<21}:null};
window.CT_SAI=CT;window.ctDe=ctDe;
const ctTxt=pos=>{const c=ctDe(pos);if(!c)return `PBB ${pos||"—"}: no figura en el listado de CT del T4 / T4S. Preguntar a CGA o al Responsable de Turno qué CT (cuarto de baja tensión) da el SAI de esta pasarela.`;
 return `PBB ${pos}: CT ${c.n} (${c.t4?"T4":"T4S"}; posiciones ${c.pos.join(", ")}). Acceso: bajar por ${c.acc}. Automático de la UPS: ${c.ups}.`};
window.ctTxt=ctTxt;
const n_=t=>typeof segNorm=="function"?segNorm(t):String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
function otActual(){try{const ab=gOTs();const id=gOT&&ab.some(x=>x.id==gOT)?gOT:(ab[0]&&ab[0].id);return inc.find(x=>x.id==id)||null}catch(e){return null}}
const P5="507";

/* ---------- 2. Mapa de alimentaciones (rev. J y 507) ---------- */
const PAS=GUIA.tipos.PAS;
const ALIM_J=[
 ["Potencia 400 V","CBTH-Z0 (40 A) → CBTH-X11 → E-X11 → E-S0 → E-K0 → distriblock E-X72 →\n• E-Q1 (22 A) → E-K1 → variadores E-U1 izq / E-U2 dcha (ATV28 5,5 kW) → T-M1 / T-M2\n• E-Q3 (11,4 A) → E-K3 → bomba H-M1 5,5 kW\n• E-Q40 (16 A) → P-Q6 giro cabina C-M1 · P-Q5 brazo autonivelador C-M2\n• E-Q15 (13-18 A) → trafo P-T1 + protectores E-F19/F20/F21"],
 ["Monofásico 230 V (red)","E-Q150 (16 A) → E-K0.1 →\n• E-Q10 ilum. túnel interior · E-Q10.1 cabina/túnel ext./medio\n• E-Q12 gálibos y caldeos · E-Q13 diferencial 30 mA enchufes\n• E-Q15.1 focos · E-Q14 cámara · E-Q17.1 lunetas\n• E-Q4/E-Q4.1 capota · E-Q8 portón · P-Q7 suelo basculante"],
 ["SAI 220 V (desde el CT de baja tensión)","UPS en el CT → CBTH-X12:1-2 → manguera ECBTH-W3 (3×2,5) → E-S0.1 (armario E) → E-X66:1-2 →\n• E-Q22 (2P 3 A) → fuente E-V3 (230 V / 24 V 10 A) → mando 24 VDC\n• E-Q24 (2P 6 A) → E-K0.1 (5-6) → E-K24 → frenos de traslación T-Y1 / T-Y2 (220 V)\n• E-Q25 (2P 6 A) → central de megafonía E-V5\n• E-Q18 → switch / cámaras\n• E-Q26 (2P 16 A) → E-K26 → E-K0 (23-24) → L1 / L2 de los variadores E-U1 / E-U2 (RETORNO AUTÓNOMO)\nCon E-S0 abierto sigue habiendo SAI: para cortar todo, abrir también E-S0.1."],
 ["Mando 24 VDC","E-V3 (24 V 10 A) → E-Q30 (2P 10 A) →\n• Armario E: E-Q30.0 (alarma) → E-Q30.1 PLC · E-Q30.2 E/S · E-Q30.3 salidas safety · E-Q30.4 entradas safety\n• Pupitre: P-Q30.0 (alarma) → P-Q30.1 · P-Q30.2 · P-Q30.3"],
 ["Retorno autónomo (traslación con SAI)","Pupitre: selector CP-S27 «RETORNO AUTÓNOMO» (P-A4 1.4) + pulsador CP-S21 «PRIORIDAD DE RETORNO» (P-A4 2.1) → el PLC activa la salida safety E-A7 4.1 → bobina E-K26 (24 V) → 220 V de SAI a los variadores por E-Q26 → E-K26 → E-K0 23-24.\nEstado de E-K26 en P-A5 3.4. Frenos por E-Q24 → E-K0.1 → E-K24. Con SAI no hay elevación, cabina, capota, portón ni suelo."]];
const ALIM_507=[
 ["Potencia 400 V (PBB 507)","CBTH-X1 (400 V 100 kVA) → COB-S0 → embarrado → distriblock E-X72 →\n• E-Q1 (22 A) → E-K1 → variadores E-U1 / E-U2 → T-M1 / T-M2\n• bomba H-M1 por E-K3 (y en retorno por E-K33 desde el variador E1-U6)\nContactores de seguridad: E-K0 (1) · E-K101 (2, monofásico E-Q150) · E-K102 (3)."],
 ["UPS 230 V (PBB 507, desde el CT de baja tensión)","UPS 230 V 6 kVA → CBTH-X2:1-2 → CO-X84 → CO-Q16 (2P 20 A curva C, en la columna) → CO-X55 → manguera ECO-W2 (3×4) → E-X80:1-2 → E-S1 (25 A) →\n• E-Q22 (4 A) → fuente E1-U3 (TRIO 24 V 20 A) → mando 24 VDC\n• E-Q24 (6 A) → E-K102 → E-K24 → frenos T-Y1 / T-Y2\n• E-Q25 (6 A) → megafonía E-V5 · E-Q18 → switch\n• E-Q26 (16 A) → E-K26 → E-K102 (5-6) → E-X69:1-2 → variadores E-U1 / E-U2 · E-K26 (5-6 / 7-8) → variador de bomba E1-U6 (bomba con retorno)\nCon E-S0 abierto sigue habiendo UPS: para cortar todo, abrir también E-S1."],
 ["Retorno autónomo (PBB 507)","Pupitre: P-A4 5.1 «RETORNO AUTÓNOMO» + P-A4 4.4 «PRIORIDAD DE RETORNO» → salida safety E-A7 4.1 → E-K26 (estado E-A2 5.1). E-K102 desde E-A6 5.1 (estado E-A0 4.4).\nCon UPS hay traslación y, por el variador E1-U6 + E-K33, bomba para subir outriggers."]];
const ALIM_ORIG=GUIA.alim;
function alimPara(pos){const base=String(pos)==P5?ALIM_507:ALIM_J;return [["CT de SAI de esta PBB (cuarto de baja tensión)",ctTxt(pos)]].concat(base)}

/* ---------- 3. Guía aparte: traslación con alimentación de SAI ---------- */
const SAI_J={t:"🔋 Traslación con alimentación de SAI (retorno autónomo)",sai:1,
 a:"Para retirar la PBB del avión o llevarla a aparcamiento cuando falta la red de 400 V. Con SAI SOLO HAY TRASLACIÓN: no hay elevación, cabina, capota, portón ni suelo basculante. En MANUAL, despacio y con un compañero vigilando ruedas, rotonda y zona de motores. Coordinar con CGA.",
 p:["1º · Confirmar que falta la red y que hay SAI: pupitre y Magelis encendidos (el mando 24 V va por SAI) y E-Q1 / variadores sin 400 V. Si hay 400 V, mover en modo normal; el retorno no sustituye a la red.",
  "2º · SAI en la PBB: en el armario E, E-S0.1 cerrado y 220 V entre E-X66:1 y E-X66:2. Viene de CBTH-X12:1-2 por la manguera ECBTH-W3.",
  "3º · Sin SAI: medir 220 V en CBTH-X12:1-2. No hay → bajar al CT de SAI de la posición (cuarto de baja tensión, ver arriba) y revisar el automático de la UPS. Avisar a CGA antes de rearmar.",
  "4º · Automáticos del SAI en el armario E cerrados: E-Q22 (3 A, mando), E-Q24 (6 A, frenos) y E-Q26 (16 A, retorno autónomo).",
  "5º · Rearmar la línea de seguridad: setas desenclavadas, finales, bordes y zapata correctos (E-A8 / E-A9 / E-A10). Deben entrar E-K0 (su contacto 23-24 está en serie con E-K26) y E-K0.1 (su contacto 5-6 alimenta los frenos).",
  "6º · En el pupitre: selector «RETORNO AUTÓNOMO» CP-S27 (P-A4 1.4) y, si la Magelis lo pide, pulsador «PRIORIDAD DE RETORNO» CP-S21 (P-A4 2.1). Los LED de P-A4 deben encenderse al accionarlos.",
  "7º · El PLC activa la salida safety E-A7 4.1 (LED encendido) → entra E-K26 (estado en P-A5 3.4) → 220 V de SAI en L1 / L2 de los variadores E-U1 y E-U2 por E-Q26 → E-K26 → E-K0 23-24.",
  "8º · Trasladar con el joystick a velocidad lenta y a tramos, sin pedir elevación ni giro de cabina. Los frenos abren con E-K24 (E-Q24 → E-K0.1 → E-K24 → T-Y1 / T-Y2, 220 V).",
  "9º · Al terminar: dejar la PBB parada, quitar el selector de retorno y anotar en la OT la posición final y la hora. Volver al modo normal cuando vuelva la red.",
  "FALLO · E-K26 no entra: LED E-A7 4.1 apagado → condiciones del PLC (selector, línea de seguridad, modo). LED encendido → 24 V en la bobina A1-A2 de E-K26 (hilos 735 / 736); con tensión y sin entrar → contactor.",
  "FALLO · E-K26 entra y no se mueve: E-Q26 disparado · 220 V en E-K26 2/T1-4/T2 y en L1 / L2 de E-U1 / E-U2 · contacto E-K0 23-24 cerrado · código de fallo en el variador (subtensión = SAI débil o sobrecargado).",
  "FALLO · Frenos que no abren (motor forzado, ruido): E-Q24, E-K0.1, E-K24 (bobina E-A6 2.1) y 220 V en T-Y1 / T-Y2 (E-X56:1-2 → H-X52:1-2). No forzar la traslación con el freno cerrado.",
  "FALLO · El SAI cae al traccionar: la UPS es limitada. Mover a tramos cortos y en lenta; revisar el estado de la UPS en el CT.",
  "Si no se puede mover con SAI: no improvisar. Liberación manual de frenos y remolque solo según el procedimiento de TK Airport Solutions / Aena y con autorización del Responsable de Turno."],
 g:[29,29,9,29,31,83,66,30,null,66,31,30,9,null],r:"ESQUEMA GENERAL rev. J folios 9, 29, 30, 31, 32-33, 66, 83, 85"};
const SAI_507={t:"🔋 PBB 507 · Traslación con alimentación de UPS (retorno autónomo)",sai:1,
 a:"PBB 507 (A380, plano propio): con UPS hay traslación y bomba con retorno para los outriggers. Sin elevación normal, cabina, capota, portón ni suelo. SUBIR LOS OUTRIGGERS ANTES DE TRASLADAR. En MANUAL, despacio y con un compañero vigilando ruedas, rotonda y motores. Coordinar con CGA.",
 p:["1º · Confirmar que falta la red y que hay UPS: pupitre y Magelis encendidos (mando 24 V por la fuente E1-U3 desde la UPS). Si hay 400 V, mover en modo normal.",
  "2º · UPS en la PBB: E-S1 (25 A) cerrado en el armario E y 230 V entre E-X80:1 y E-X80:2. Viene de CBTH-X2 → CO-Q16 (20 A, en la columna) → manguera ECO-W2.",
  "3º · Sin UPS: comprobar CO-Q16 en la columna y 230 V en CBTH-X2:1-2. No hay → bajar al CT de SAI (cuarto de baja tensión) y revisar el automático de la UPS. Avisar a CGA antes de rearmar.",
  "4º · Automáticos de la UPS en el armario E cerrados: E-Q22 (4 A, mando), E-Q24 (6 A, frenos) y E-Q26 (16 A, retorno autónomo).",
  "5º · Rearmar la línea de seguridad (setas, finales, bordes, antiatrapamientos ópticos, bumper de ala). Debe entrar E-K102, contactor de seguridad 3 (salida E-A6 5.1, estado E-A0 4.4): alimenta los frenos y el retorno.",
  "6º · Outriggers: si están abajo, subirlos primero. En retorno la bomba va por el variador ABB E1-U6 (orden P-A2 «activar variador bomba») y el contactor E-K33 (salida E-A6 6.1, estado E-A3 2.1). Comprobar P-A6 4.1 «outrigger izquierdo arriba».",
  "7º · En el pupitre: «RETORNO AUTÓNOMO» (P-A4 5.1) y, si la Magelis lo pide, «PRIORIDAD DE RETORNO» (P-A4 4.4).",
  "8º · El PLC activa la salida safety E-A7 4.1 → entra E-K26 (estado E-A2 5.1) → UPS a los variadores por E-Q26 → E-K26 → E-K102 (5-6) → E-X69:1-2 → E-U1 / E-U2.",
  "9º · Trasladar con el joystick en lenta y a tramos. Frenos: E-Q24 → E-K102 → E-K24 → T-Y1 / T-Y2. Vigilar también los sensores AKS (P-A6): si paran la PBB, revisar la zona de los motores.",
  "10º · Al terminar: PBB parada, quitar el retorno y anotar en la OT. Volver al modo normal cuando vuelva la red.",
  "FALLO · E-K26 no entra: LED E-A7 4.1 apagado → condiciones del PLC; encendido → 24 V en la bobina de E-K26.",
  "FALLO · E-K26 entra y no se mueve: E-Q26 · E-K102 5-6 cerrado · 230 V en E-X69:1-2 y en los variadores · código de fallo del variador (subtensión = UPS débil).",
  "FALLO · La UPS cae al traccionar o al arrancar la bomba: es de 6 kVA. No mover y subir outriggers a la vez; tramos cortos en lenta.",
  "Si no se puede mover con UPS: liberación manual de frenos y remolque solo según el procedimiento de TK Airport Solutions / Aena y con autorización."],
 g:[-54,-9,-9,-54,-88,-50,-107,-40,-47,null,-89,-44,-50,null],r:"plano 507 folios 9, 40, 44, 47, 50, 54, 88, 89, 106-107"};
const IX_J=PAS.s.push(SAI_J)-1,IX_5=PAS.s.push(SAI_507)-1;
window.SAI_IX=[IX_J,IX_5];
const RE_SAI=/retorno|\bsai\b|\bups\b|sin tension|sin corriente|sin red|corte de (luz|tension|corriente)|apagon|fallo de (red|tension|alimentacion)|sin 400|falta (de )?(tension|red|corriente)|cero energetico/;
const ixPara=pos=>String(pos)==P5?IX_5:IX_J;
(function(){const S=PAS.s.find(x=>/^PBB sin tensi/.test(x.t));if(S&&!S.p.some(x=>/Traslación con alimentación de SAI/.test(x))){S.p.push("Si hay que mover la PBB sin red de 400 V: guía «🔋 Traslación con alimentación de SAI (retorno autónomo)». El CT de SAI (cuarto de baja tensión) de la posición está en la cabecera de la guía y en el Mapa de alimentaciones.");if(S.g)S.g.push(29)}})();
(function(){const o=anaOT;anaOT=function(i){const r=o(i);if(!r||r._sai)return r;r._sai=1;if(r.tipo&&r.tipo!="PAS")return r;
 const mia=i?ixPara(i.pos):IX_J,otra=mia==IX_J?IX_5:IX_J;r.guia=(r.guia||[]).filter(g=>g.si!=otra);
 const t=i?n_([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" ")):"";
 if(RE_SAI.test(t)){const mover=/retorno|\bsai\b|\bups\b|mover|retir|trasl|desplaz|aparc/.test(t);
  if(mover){r.guia=[{si:mia,t:PAS.s[mia].t,sc:99}].concat(r.guia.filter(g=>g.si!=mia))}
  else if(!r.guia.some(g=>g.si==mia))r.guia.push({si:mia,t:PAS.s[mia].t,sc:60})}
 return r}})();

/* ---------- comprobaciones por sistema: CT de SAI ---------- */
const SIS=window.SIS;
if(SIS&&SIS.PAS){const old=SIS.PAS.findIndex(x=>/^SAI de la PBB/.test(x.s));if(old>=0)SIS.PAS.splice(old,1);
 const todas=[].concat(...CT.map(x=>x[1].map(String)));
 SIS.PAS.push({s:"SAI de la PBB · CT de SAI (cuarto de baja tensión)",f:[9,29],c:[
  "El CT es el cuarto de BAJA TENSIÓN donde están las alimentaciones de 220 Vac de SAI de las pasarelas. Sin SAI la PBB se queda sin mando ni retorno autónomo.",
  "Sin 220 V de SAI en CBTH-X12:1-2 (507: CBTH-X2): ir con autorización al CT de la posición y comprobar el automático de su UPS antes de tocar la PBB.",
  ...CT.map(([n,pos,acc,ups])=>({t:`CT ${n} (posiciones ${pos.join(", ")}): bajar por ${acc}. Automático de la UPS: ${ups}.`,solo:pos.map(String)})),
  {t:"Esta posición no figura en el listado de CT del T4 / T4S: preguntar a CGA o al Responsable de Turno qué CT la alimenta.",no:todas}]})}

/* ---------- pintado ---------- */
const box=(h,ex)=>`<div class="gsai ${ex||""}" style="font-size:12px;margin-top:8px;border-left:3px solid #2e9e44;padding:4px 8px;background:color-mix(in srgb,#2e9e44 8%,transparent);border-radius:6px">${h}</div>`;
(function(){const o=vTec;vTec=function(){const i0=otActual();GUIA.alim=alimPara(i0?i0.pos:"");let r;try{r=o.apply(this,arguments)}finally{GUIA.alim=ALIM_ORIG}
 try{if(gTipo!="PAS")return r;const i=otActual();const pos=i?String(i.pos):"";const mia=ixPara(pos),otra=mia==IX_J?IX_5:IX_J;
  const dO=document.querySelector(`#app details.gd[data-k="PAS${otra}"]`);if(dO)dO.remove();
  const head=[...document.querySelectorAll("#app .card")].find(x=>/Guía de campo/.test((x.querySelector("h3")||{}).textContent||""));
  if(head&&i&&!head.querySelector(".gsai")){const c=ctDe(pos);
   head.insertAdjacentHTML("beforeend",box(`<b>🔋 CT de SAI (cuarto de baja tensión)</b> · ${esc(c?`CT ${c.n} · UPS: ${c.ups}`:"esta posición no figura en el listado de CT")}<div style="margin-top:4px"><button class="sec" style="width:auto;margin:0;padding:6px 10px" onclick="saiAbre()">Traslación con SAI</button></div>`))}
  /* guía aparte: caja propia, con borde verde, tras el análisis / la actuación más eficaz */
  const d=document.querySelector(`#app details.gd[data-k="PAS${mia}"]`);
  if(d){d.classList.add("gsaic");if(i&&!d.querySelector(".gsai"))d.querySelector("summary").insertAdjacentHTML("afterend",box(`<b>CT de SAI de esta PBB:</b> ${esc(ctTxt(pos))}`));
   if(!d.classList.contains("gef")){const anc=document.getElementById("anag")||document.querySelector("#app details.gd.gef")||document.getElementById("gsegl")||document.getElementById("gpte")||document.querySelector('#app details.gd[data-k="SEG"]');
    if(anc&&anc.nextElementSibling!==d)anc.insertAdjacentElement("afterend",d)}}
  const al=[...document.querySelectorAll("#app details.gd")].find(x=>/Mapa de alimentaciones/.test((x.querySelector("summary")||{}).textContent||""));
  if(al&&!al.dataset.k){al.dataset.k="ALIM";if(gAbierto.has("ALIM"))al.open=true;al.addEventListener("toggle",()=>{al.open?gAbierto.add("ALIM"):gAbierto.delete("ALIM")})}
 }catch(e){console.warn("sai",e)}return r}})();
window.saiAbre=function(){const i=otActual();const k="PAS"+ixPara(i?i.pos:"");gAbierto.add(k);vTec();setTimeout(()=>{const d=document.querySelector(`#app details.gd[data-k="${k}"]`);if(d){d.open=true;d.scrollIntoView({block:"start",behavior:"smooth"})}},60)};
const st=document.createElement("style");st.textContent=`#app details.gsaic{border:2px solid #2e9e44}`;document.head.appendChild(st);
})();
