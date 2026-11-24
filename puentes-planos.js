/* ===== v888: PUENTE PROVISIONAL según el CABLEADO rev. J (fuente única para el SOS, la guía de la OT y la lista «Puentes») =====
   Cotejo de todas las entradas de seguridad con los planos (folios 68-70 y 87-88):
   · Módulo amarillo con contacto entre IN y UT del canal (FC de inclinación, extensión, rotonda, traslación, borde de ruedas E-U5,
     bumper del brazo, zapata P-U5): puente IN n.1 ↔ UT n.2.
   · Módulo amarillo con el elemento alimentado del +24 V común (hilo 613, E-X68:6) y SIN UT en el canal: antiatrapamientos
     E-A9 2.1 / 5.1 / 6.1 / 8.1, sensor de portón C-S9 (E-A8 1.1) e inductivo de puerta de servicio SS-B15 (E-A10 4.1).
     Antes se dibujaba IN ↔ n.2 (UT), borna que en E-A8 1.1 y E-A10 4.1 ni existe: el puente correcto es IN ↔ +24 V hilo 613.
   · Entradas que NO se puentean: setas (E-A8 4.1), bypass CP-S33 (E-A8 3.1), OK retirada (E-A9 1.1), autorización de rotonda R-S2
     (E-A9 3.1), sirena de cabina C-H41 (E-A9 4.1), barrera de rotonda (E-A10 3.1) y selector CP-S16 (E-A10 5.1 / 6.1 / 7.1).
   · Módulo verde (P-A6, E-A2, E-A3): IN en k.1 → +24 V en k.2 · IN en k.4 → +24 V en k.5 (6 bornas por fila: IN · + · − · IN · + · −). ===== */
(function(){
"use strict";
const NO={
 "E-A8|3.1":"Bypass de seguridades CP-S33: es el propio mando de maniobra",
 "E-A8|4.1":"Setas de emergencia: la parada de emergencia no se puentea",
 "E-A9|1.1":"Pulsador «OK retirada PBB»: lo da el operador",
 "E-A9|3.1":"Autorización de rotonda R-S2: la da el operador",
 "E-A9|4.1":"Vigilancia de la sirena de seguridad de cabina C-H41",
 "E-A10|3.1":"Barrera de seguridad de rotonda: solo con la zona comprobada despejada",
 "E-A10|5.1":"Selector CP-S16 (AUTO)","E-A10|6.1":"Selector CP-S16 (MANUAL)","E-A10|7.1":"Selector CP-S16 (LOCAL / REMOTO)"};
const SDI=/^E-A(8|9|10)$/;
const ent=(m,b)=>{const C=window.CABLEADO||{};for(const k in C){const e=C[k];if(e&&e.m==m&&e.b==b)return e}return null};
const v24=e=>JSON.stringify(e.n||[]).match(/"h":"613"|E-X68","p":"6"/);
/* puente de una entrada: {mod,b1,b2,k1,k2,ext?} · {no:motivo} · null (sin datos) */
window.puentePlanos=function(m,b){const e=ent(m,b);if(!e)return null;const k1=e.k||"IN";
 if(SDI.test(m)){if(NO[m+"|"+b])return{no:NO[m+"|"+b]};
  const M=(e.n||[]).find(n=>n.k=="M");
  if(M){const b2=(M.t&&/:(\d+\.\d)/.exec(M.t)||[])[1]||b.replace(/\.1$/,".2");const u=ent(m,b2);return{mod:m,b1:b,b2,k1,k2:(M.l||(u&&u.k)||"UT")}}
  if(v24(e))return{mod:m,b1:b,b2:"E-X68:6",k1,k2:"+24 V · hilo 613",ext:1};
  return null}
 const p=/^(\d+)\.(\d)$/.exec(b);if(!p||!/^[14]$/.test(p[2]))return null;
 return{mod:m,b1:b,b2:p[1]+"."+(+p[2]+1),k1,k2:"+24 V"}};
window.puenteNoMotivo=(m,b)=>NO[m+"|"+b]||"";
})();
