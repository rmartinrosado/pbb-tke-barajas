/* ===== v557: COMPONENTES DE CAMPO ↔ ALARMAS, ADVERTENCIAS Y EVENTOS DEL PLC (manual RCS / Magelis, window.RCS_AL) =====
   · Al incorporar (y en Editar ficha con «🚨 Cotejar») se cotejan el código, el título, el fabricante y las averías del
     componente con el listado de alarmas (001-143), advertencias/eventos (241-363) y puesto remoto (R001-R016).
   · Las coincidencias se guardan en la ficha como especificación «Alarmas / eventos PLC» («138 Fallo sensor sirena · …»)
     y en «Averías en que interviene» como «alarma 138», para que una OT o un SOS con ese código encuentre el componente.
   · La IA (Claude/Gemini) recibe el listado y propone las suyas; aquí se validan contra el listado y se suman a las del cotejo.
   · Las fichas de fábrica y las ya incorporadas sin esa fila muestran el cotejo automático en la ficha.
   · Además: cajas de texto que crecen con el contenido (todo el texto a la vista) en Incorporar y Editar ficha. ===== */
(function(){
"use strict";
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const AL=()=>window.RCS_AL||[];
const pad=c=>{c=String(c||"").trim().toUpperCase().replace(/^(AL|ALARMA|EV|EVENTO)\s*/,"");return /^\d{1,3}$/.test(c)?c.padStart(3,"0"):c};
const porCod=c=>AL().find(x=>x.c===pad(c));
/* reglas: [todas estas expresiones en el texto del componente] → códigos. Basado en el manual RCS y la operativa de las PBB */
const R=[
 [[/sirena/,/sensor|c-h41|seguridad|cabina/],["138","137"]],[[/sirena/,/movimiento|et-h1|ruedas|traslaci/],["142","137"]],[[/sirena/],["137"]],
 [[/flash|destell/],["143"]],
 [[/variador/],["055","083","084","079"]],[[/freno/,/manual/],["085","086"]],[[/freno/,/motor|traslaci/],["087","088","079","105","106"]],
 [[/joystick|palanca de mando/],["100","101"]],[[/humo/],["090"]],
 [[/laser|láser|dl50|et-b9/,/extensi|longitud|retracc/],["057","114","250","251","339","340"]],[[/laser|láser/,/elevaci|descompens/],["027"]],
 [[/potenciometro|c-r10|encoder/,/cabina/],["058","246","247"]],[[/potenciometro|encoder/,/rotonda/],["059","257","258"]],
 [[/medidor de altura|inclinometro|c-b14|sensor de altura/],["056","248","249","111"]],
 [[/barrera|fotocelula|cortina/,/rotonda/],["294","022","139"]],[[/fotocelula/,/seguridad|barrera|test/],["022"],/crepuscular/],
 [[/zapata/],["072","073","075","096","097","098","099"]],[[/autonivel/],["063","064","077","241"]],
 [[/bumper|borde de seguridad|t-b5|t-b6/,/traslaci|rueda/],["010"]],[[/bumper/,/\bala\b/],["015"]],[[/bumper/,/brazo/],["021"]],
 [[/antiatrapamiento|antipinzamiento/],["017","018","019","020","358","359","360","361"]],
 [[/protector/,/sobretension/],["076"]],[[/protector(es)? (electronico|de sobrecorriente)|alarma protecciones|e-q30\.\d|sobrecorriente (p|e|cib)\b/],["126","127","128","120"]],
 [[/fuente|alimentacion/,/24 ?v/],["120"],/sobretension/],[[/asimetr/],["061"]],[[/minima tension/],["062"]],[[/fallo de tension|rele de tension|vigilante de tension/],["121"]],
 [[/bomba/],["054","066","103","104"]],[[/porton/],["049","108","242"]],[[/motor/,/suelo/],["050"]],[[/suelo/,/final de carrera|\bfc\b|limite|retractil/],["082","244","245"]],[[/capota|dosel/],["053","260"]],
 [[/extractor/],["080"]],[[/motor/,/cabina/],["051"]],[[/motor/,/brazo/],["052"]],
 [[/400 ?hz|\bpds\b|\bgpu\b/],["107","263","266","267","272","281","283"]],[[/pcair|pca\b|aire acondicionado|preacondicionad/],["060","109","265","274","282"]],
 [[/outrigger|estabilizador/],["081","273","352"]],[[/\bstb\b/],["117","118","119"]],[[/\bcpu\b|cabecera de bus|modulo plc|plc de seguridad/],["089","023"]],
 [[/seta|parada de emergencia/],["006","007","008","012","014","028"],/vdgs|svga|bumper|borde/],
 [[/final de carrera|\bfc\b/,/inclinaci/],["001","002"]],[[/final de carrera|\bfc\b/,/rotonda/],["003"]],[[/final de carrera|\bfc\b/,/extensi|retracc/],["004"]],[[/final de carrera|\bfc\b/,/giro|traslaci/],["005"]],
 [[/freno de seguridad/,/cabina/],["009"]],[[/freno de seguridad/,/tunel/],["016"]],[[/rodillo/],["024","025","026"]],
 [[/sensor/,/presencia/],["102"]],[[/contaje/],["116"]],[[/anticolision/],["123","124","261","264","347","350"]],
 [[/detector|radar|laser/,/\bala\b/],["268","078","262","348"]],[[/bypass/],["337","354","355"]],[[/lector de tarjeta/],["353"]],[[/vdgs|svga|guiado/],["136","356"]],
 [[/linea de seguridad|rele de seguridad|modulo de seguridad|safety|contactor de seguridad|cadena de seguridad/],["011","013","065"]],[[/inductivo/,/outrigger/],["081"]],
 [[/hombre muerto/],["256"]],[[/botonera de mantenimiento/],["271"]],[[/agua potable|pwc/],["285"]],[[/puesto remoto|rcc/],["R004","R013","R015"]],
];
/* cotejo local: devuelve [{c,t,por}] */
window.compAlarmasDe=function(info){info=info||{};const T=nrm([info.codigo,info.titulo,info.fab,info.claves,(info.esp||[]).map(r=>r.join(" ")).join(" ")].join(" "));
 const out=[],ya=new Set();const add=(c,por)=>{const a=porCod(c);if(a&&!ya.has(a.c)){ya.add(a.c);out.push({c:a.c,t:a.t,por})}};
 /* el código del componente citado literalmente en la alarma (E-K1, E-K14, E-K63, P-K6…) */
 const cods=String(info.codigo||"").toUpperCase().split(/\s*[\/,]\s*/).map(x=>x.replace(/^\+/,"").trim()).filter(Boolean);
 AL().forEach(a=>cods.forEach(c=>{if(new RegExp("(^|[^A-Z0-9.])"+c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"($|[^A-Z0-9.])").test(a.t.toUpperCase()))add(a.c,"cita "+c)}));
 /* «alarma 138» / «AL 057» ya escritos en la ficha */
 (T.match(/\b(?:alarma|al|evento|ev)\s*(\d{1,3})\b/g)||[]).forEach(m=>add(m.replace(/\D/g,""),"indicado en la ficha"));
 /* los borneros (X) solo por cita literal: sus palabras (24 V, tierra…) no identifican una alarma */
 const bornero=cods.some(c=>/^[A-Z0-9]*-?X\d/.test(c))||/\bbornero\b|\bregleta\b/.test(nrm(info.titulo));
 if(!bornero)R.forEach(([rs,cs,no])=>{if(rs.every(r=>r.test(T))&&!(no&&no.test(T)))cs.forEach(c=>add(c,"cotejo"))});
 return out.slice(0,12)};
window.compAlarmasTxt=L=>(L||[]).map(a=>a.c+" "+a.t).join(" · ");
window.compAlarmasListado=()=>AL().map(a=>a.c+"|"+a.t).join("\n");
/* valida lo que propone la IA y lo junta con el cotejo local (primero lo de la IA) */
window.compAlarmasJunta=function(ia,loc){const out=[],ya=new Set();
 (Array.isArray(ia)?ia:[]).forEach(x=>{const a=porCod(x&&(x.c||x.codigo||x));if(a&&!ya.has(a.c)){ya.add(a.c);out.push({c:a.c,t:a.t,por:(x&&x.por)||"IA"})}});
 (loc||[]).forEach(x=>{if(!ya.has(x.c)){ya.add(x.c);out.push(x)}});return out.slice(0,12)};
/* fila de especificación y claves */
const ROT="Alarmas / eventos PLC";
window.compAlarmasEnFicha=function(esp,claves,L){esp=(esp||[]).filter(r=>!/^alarmas?\s*\/?\s*eventos/i.test(r[0]||""));
 if(L&&L.length)esp.unshift([ROT,compAlarmasTxt(L)]);
 let cl=String(claves||"").split(/\s*,\s*/).filter(x=>x&&!/^alarma\s+[0-9R]\d*$/i.test(x));
 (L||[]).forEach(a=>cl.push("alarma "+a.c.replace(/^0+(?=\d)/,"")));return{esp,claves:[...new Set(cl)].join(", ")}};
window.compAlarmasROT=ROT;

/* ---------- cajas de texto que crecen con el contenido ---------- */
const alto=t=>{if(!t||t.tagName!=="TEXTAREA")return;t.style.height="auto";t.style.height=(t.scrollHeight+2)+"px"};
const st=document.createElement("style");st.textContent=`textarea.tx1{resize:none;overflow:hidden;line-height:1.35;white-space:pre-wrap;word-break:break-word;min-height:0}
#sheetc .icpr textarea,#cedCapa textarea{overflow:hidden;resize:none;line-height:1.35}
.alpl{margin:8px 0;padding:9px 11px;border-radius:10px;border:1px solid #c6282866;background:#c628280f;font-size:13px}
.alpl b{color:#c62828}.alpl .alc{display:inline-block;margin:3px 4px 0 0;padding:3px 8px;border-radius:6px;background:#c62828;color:#fff;font:700 12px/1.3 ui-monospace,monospace}
.alpl .alc.ad{background:#ef8f00}.alpl .alc.rc{background:#1565c0}.alpl small{display:block;opacity:.75;margin-top:4px}`;document.head.appendChild(st);
document.addEventListener("input",e=>{const t=e.target;if(t&&t.tagName==="TEXTAREA"&&t.closest("#sheetc,#cedCapa"))alto(t)},true);
document.addEventListener("keydown",e=>{const t=e.target;if(e.key==="Enter"&&t&&t.classList&&t.classList.contains("tx1"))e.preventDefault()},true);
let tm=0;new MutationObserver(()=>{if(tm)return;tm=setTimeout(()=>{tm=0;document.querySelectorAll("#sheetc .icpr textarea,#cedCapa textarea").forEach(t=>{if(!t.dataset.al||t.dataset.al!==String(t.value.length)){t.dataset.al=t.value.length;alto(t)}})},80)}).observe(document.body,{childList:true,subtree:true});
window.addEventListener("resize",()=>document.querySelectorAll("#sheetc .icpr textarea,#cedCapa textarea").forEach(alto));
/* recuadro de alarmas para mostrar (Incorporar y ficha) */
window.compAlarmasHTML=function(L,titulo){if(!L||!L.length)return"";const E=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 return `<div class="alpl">🚨 <b>${E(titulo||"Alarmas / eventos del PLC (Magelis · manual RCS)")}</b><div>${L.map(a=>`<span class="alc ${/^R/.test(a.c)?"rc":+a.c>=241?"ad":""}" title="${E(a.por||"")}">${/^R/.test(a.c)?"":`<img class="rcsico" src="iconos/${+a.c>=241?"advertencia":"alarma"}.png" alt=""> `}${E(a.c)} ${E(a.t)}</span>`).join("")}</div><small>🔴 alarma · 🟠 advertencia/evento · 🔵 puesto remoto. Se guardan en la ficha y en sus averías («alarma ${E(L[0].c.replace(/^0+(?=\d)/,""))}») para identificar rápido la avería.</small></div>`};
})();
/* ===== v614: FILTRO POR PLANO al incorporar (19/11/2026) =====
   Revisión de todo el catálogo frente al cableado (rev. J y 507): la IA metía alarmas que el plano no respalda.
   · Borneros (X…): los números que se leen en sus bornas son NÚMEROS DE HILO, no alarmas (E-X55 llevaba 275-285 por error):
     solo valen las alarmas que citen literalmente el bornero.
   · Relés/contactores que en el plano SOLO son bobina de una SALIDA del PLC (DON/DOS) y no llevan contacto a ninguna
     ENTRADA (P-K80…P-K85 → señales al CBTH): no traen alarmas de entradas (joystick, zapata, presencia…); solo las que
     los citen (E-K14, E-K1…) o las del propio actuador (fallo de activación, sirena, flash). */
(function(){
const N=s=>String(s||"").toUpperCase().replace(/^\+/,"").trim();
const usos=cod=>{const r={sal:0,ent:0};[window.CABLEADO,window.CABLEADO507].forEach(C=>{if(!C)return;Object.keys(C).forEach(k=>{const e=C[k];
  const esta=(e.n||[]).some(n=>N(n.t).split("/")[0]===cod||N(n.t)===cod);if(!esta)return;
  if(/^DO/.test(e.c||""))r.sal++;else r.ent++})});return r};
window.compAlarmasPlano=function(codigo,L){L=L||[];const cods=String(codigo||"").toUpperCase().split(/\s*[\/,]\s*/).map(N).filter(Boolean);if(!cods.length)return L;
 const cita=a=>/^cita /.test(a.por||"")||cods.some(c=>a.t.toUpperCase().includes(c));
 if(cods.some(c=>/^[A-Z0-9]*-?X\d/.test(c)))return L.filter(cita);
 const u=cods.map(usos);if(u.every(x=>x.sal>0&&x.ent==0)){const A=window.RCS_AL||[];
  return L.filter(a=>{if(cita(a))return true;const g=(A.find(x=>x.c==a.c)||{}).g;return g=="con"||g=="sir"})}
 return L};
})();
