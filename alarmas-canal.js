/* ===== v645: ALARMAS Y ADVERTENCIAS POR CANAL DEL PLC (plano rev. J, folios 52-89) =====
   Cada canal (módulo|borna) con las alarmas y advertencias de la señal que lleva. Con ello:
   · un MÓDULO PLC (E-A0…E-A10, P-A1…P-A6) se relaciona con sus propias alarmas (tarjetas STB, 24 V) y con las de
     todas las señales de sus canales (p. ej. E-A2: límites de inclinación, detectores de extensión, bloqueos A/A y
     400 Hz, FC capota, fallo y freno de variador);
   · un BORNERO, con las de las señales que pasan por él;
   · un elemento de campo que no esté en la tabla revisada, con las de su canal.
   Los componentes revisados a mano (sensores, relés…) conservan su lista: aquí solo se completan módulos y borneros. ===== */
(function(){
"use strict";
const CA={
 /* E-A0 · entradas / salidas de la cabecera */
 "E-A0|1.1|DIN01":["011","013","065"],"E-A0|1.1|DON01":["137"],"E-A0|1.4|DIN03":["054","066"],"E-A0|2.1|DIN02":["055"],"E-A0|2.1|DON02":["131","132"],
 "E-A0|2.4|DIN04":["053"],"E-A0|3.1|DIN05":["049"],"E-A0|3.4|DIN07":["257","258","003"],"E-A0|4.1|DIN06":["076"],"E-A0|4.4|DIN08":["257","258","003"],
 /* E-A1 · salidas digitales */
 "E-A1|1.1":["055","083"],"E-A1|2.1":["055","083"],"E-A1|1.3":["055","083"],"E-A1|2.3":["055","083"],
 "E-A1|1.2":["055","084"],"E-A1|2.2":["055","084"],"E-A1|1.4":["055","084"],"E-A1|2.4":["055","084"],
 "E-A1|3.3":["053","260"],"E-A1|4.2":["053","260"],"E-A1|3.4":["053","260"],"E-A1|4.3":["053","260"],
 "E-A1|4.4":["022","294"],"E-A1|5.4":["143"],"E-A1|7.3":["139","141"],"E-A1|7.4":["049","242","108"],"E-A1|8.4":["049","242","108"],
 /* E-A2 · entradas digitales */
 "E-A2|2.1":["083","055"],"E-A2|1.4":["084","055"],
 "E-A2|2.4":["252","113","001"],"E-A2|3.1":["253","112","002"],
 "E-A2|4.1":["250","251","339","340","114","004","017","018","019","020"],"E-A2|3.4":["250","251","339","340","114","004","017","018","019","020"],
 "E-A2|4.4":["109","265"],"E-A2|5.1":["109","265","274","282"],"E-A2|6.1":["107","263","266","267","283"],"E-A2|5.4":["272","281","263","283","107"],
 "E-A2|6.4":["260","053"],"E-A2|7.1":["260","053"],"E-A2|8.1":["079"],
 /* E-A3 · entradas digitales */
 "E-A3|1.1":["014"],"E-A3|1.4":["006","007","012"],"E-A3|2.4":["079"],"E-A3|3.1":["129","130"],"E-A3|3.4":["105","106"],"E-A3|4.1":["103","104"],
 "E-A3|4.4":["127","126","128","120"],"E-A3|5.1":["087"],"E-A3|5.4":["088"],"E-A3|6.1":["085"],"E-A3|6.4":["086"],
 "E-A3|7.1":["254","005","341"],"E-A3|8.1":["255","005","342"],"E-A3|7.4":["116"],"E-A3|8.4":["116"],
 /* E-A4 · analógicas */
 "E-A4|1.1":["056","248","249","111"],"E-A4|1.2":["057","250","251","339","340","114"],"E-A4|1.3":["058","246","247"],"E-A4|1.4":["059","257","258"],
 /* E-A6 / E-A7 · salidas de seguridad */
 "E-A6|1.1":["129","130","055"],"E-A6|2.1":["105","106","087","088"],"E-A6|3.1":["011","013","065"],"E-A6|4.1":["011","013","065"],"E-A6|7.1":["137","138"],"E-A6|8.1":["103","104","054"],
 "E-A7|1.1":["074","122"],"E-A7|2.1":["074","122"],"E-A7|3.1":["136"],"E-A7|4.1":["349"],
 /* E-A8 / E-A9 / E-A10 · entradas de seguridad */
 "E-A8|1.1":["242","108"],"E-A8|2.1":["010"],"E-A8|3.1":["337"],"E-A8|4.1":["006","007","008","012","014","028"],"E-A8|5.1":["005"],"E-A8|6.1":["004"],"E-A8|7.1":["003"],"E-A8|8.1":["001","002"],
 "E-A9|2.1":["019","359"],"E-A9|3.1":["139","141"],"E-A9|4.1":["138","137"],"E-A9|5.1":["017","358"],"E-A9|6.1":["018","360"],"E-A9|8.1":["020","361"],
 "E-A10|1.1":["021","067","068","077"],"E-A10|2.1":["262"],"E-A10|3.1":["294","022","139"],"E-A10|4.1":["140"],"E-A10|5.1":["241","063","064"],"E-A10|7.1":["286","141"],
 "E-A10|8.1":["072","073","075","096","097","098","099"],
 /* P-A1 / P-A2 · salidas del pupitre */
 "P-A1|1.4":["346"],"P-A1|2.4":["052","077"],"P-A1|3.1":["052","077"],"P-A1|3.4":["051","135"],"P-A1|4.1":["051","135"],"P-A1|4.4":["137"],"P-A1|5.1":["050"],"P-A1|6.1":["050"],
 /* P-A3 / P-A4 / P-A5 / P-A6 · entradas del pupitre y de cabina */
 "P-A3|1.1":["008","028"],"P-A3|2.1":["256"],"P-A3|1.4":["100","101"],"P-A3|2.4":["100","101"],"P-A3|3.1":["100","101"],"P-A3|4.1":["100","101"],
 "P-A3|3.4":["100","101"],"P-A3|4.4":["100","101"],"P-A3|5.1":["100","101"],"P-A3|6.1":["100","101"],
 "P-A4|1.4":["349"],"P-A4|2.1":["343","351"],"P-A4|3.4":["053","260"],"P-A4|4.4":["053","260"],"P-A4|5.4":["052","067"],"P-A4|6.4":["051"],
 "P-A4|6.1":["135","051"],"P-A4|7.1":["135","051"],"P-A4|7.4":["126","118"],"P-A4|8.1":["050"],
 "P-A5|1.1":["243","264"],"P-A5|4.4":["243","261"],"P-A5|2.1":["272","263","107"],"P-A5|3.1":["348","347","338"],"P-A5|3.4":["349"],"P-A5|4.1":["011","013","065"],
 "P-A5|5.1":["068","243"],"P-A5|5.4":["069","063"],"P-A5|6.1":["069","063"],"P-A5|6.4":["070","064"],"P-A5|7.1":["070","064"],"P-A5|7.4":["071"],"P-A5|8.1":["071"],
 "P-A6|1.1":["246"],"P-A6|2.1":["247"],"P-A6|1.4":["016"],"P-A6|2.4":["009"],"P-A6|3.1":["009"],"P-A6|3.4":["244","245","082"],"P-A6|4.1":["244","245","082"],
 "P-A6|7.1":["347","348","078","268"],"P-A6|8.1":["078","268","015"]
};
/* alarmas propias de cada módulo (tarjeta, bus, alimentación) */
const PROPIAS={"E-A0":["089","023","117","120"],"E-A1":["117","120"],"E-A2":["117","120"],"E-A3":["117","120"],"E-A4":["117"],"E-A5":["119","023","120"],
 "E-A6":["119","023"],"E-A7":["119","023"],"E-A8":["119","023"],"E-A9":["119","023"],"E-A10":["119","023"],
 "P-A0":["118","089","120"],"P-A1":["118","120"],"P-A2":["118","120"],"P-A3":["118","120"],"P-A4":["118","120"],"P-A5":["118","120"],"P-A6":["118","120"]};
/* v745: 115 «Atraque incorrecto» = contacto con el avión sin traslación (manual RCS pág. 84): sus elementos son los contactos
   con avión C-B51 (P-A5 1.1) y C-B52 (P-A5 4.4) y el brazo del autonivelador C-B7 (P-A5 5.1), como la 243. Sin canal, el SOS
   buscaba por texto y sacaba P-K83 «Relé OK Handling» (su ficha lleva la palabra «atraque» en las claves). */
["P-A5|1.1","P-A5|4.4","P-A5|5.1"].forEach(k=>{CA[k]=CA[k]||[];if(!CA[k].includes("115"))CA[k].unshift("115")});
window.CANAL_AL=CA;window.MODULO_AL_PROPIAS=PROPIAS;
const N=s=>String(s||"").toUpperCase().replace(/^[+-]/,"").replace(/\([^)]*\)/g,"").replace(/:.*$/,"").replace(/\s+/g,"");
function deCanal(e){return CA[e.m+"|"+e.b+"|"+e.c]||CA[e.m+"|"+e.b]||[]}
/* códigos de alarma de un componente según el plano (módulo, bornero o elemento) */
window.alarmasPorPlano=function(codigo){const k=N(codigo);if(!k)return[];const C=window.CABLEADO||{};const out=[];const add=a=>a.forEach(x=>{if(!out.includes(x))out.push(x)});
 if(PROPIAS[k])add(PROPIAS[k]);
 Object.keys(C).forEach(key=>{const e=C[key];if(!e||e.m=="AUX")return;const L=deCanal(e);if(!L.length)return;
  if(N(e.m)===k||(e.n||[]).some(n=>n.t&&(N(n.t)===k||N(n.t).split("/")[0]===k)))add(L)});
 return out};
/* completa la tabla revisada: módulos y borneros (los elementos revisados a mano se respetan) */
function completa(){const T=window.ALARMA_COMP;if(!T)return;const C=window.CABLEADO||{};const cods=new Set(Object.keys(PROPIAS));
 Object.values(C).forEach(e=>{if(!e)return;cods.add(N(e.m));(e.n||[]).forEach(n=>{if(n.t&&/-X\d/.test(n.t))cods.add(N(n.t))})});
 cods.forEach(k=>{if(!k||k=="AUX")return;const L=window.alarmasPorPlano(k);if(!L.length)return;const prev=T[k]||[];T[k]=prev.concat(L.filter(x=>!prev.includes(x)))})}
completa();
})();
