/* ===== v607 (v608: window.segLimpia también para la Actuación guiada / Primera actuación integral): la «Primera actuación en campo» ya no se dispara por elementos que el texto DESCARTA.
   Antes segOT/puentesOT leían todo el Comentario y las Obs., incluidas las respuestas de «Dato de campo» y de la IA
   («…lo que descarta averías en … el contactor de seguridad E-K0.1…»), y una OT de gálibo salía como
   «PAS bloqueada por contactor de seguridades».
   · En Comentario y Obs. se quitan las frases que descartan, niegan o dan por correcto un elemento.
   · Si la descripción/definición es de alumbrado (gálibo, luces, caldeo…) y no habla de bloqueo, seguridades
     ni movimiento, no hay primera actuación de seguridades. ===== */
(function(){
 const N=t=>(typeof segNorm=="function"?segNorm(t):String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""));
 const NEG=/descart|no (es|son|hay|afecta|procede|esta|estan|requiere|se requiere)\b|sin (fallo|averia|problema|alarma)|en buen estado|\bcorrect[oa]s?\b|funciona(n)? bien|confirmar si/;
 const limpia=s=>{if(!s)return s;return String(s).split(/(?<=[.;\n])|\s(?=→)|\s(?=->)/).filter(f=>!NEG.test(N(f))).join(" ").replace(/\s+/g," ").trim()};
 const ALUM=/galibo|\bluz\b|\bluces\b|alumbrado|iluminacion|caldeo|baliza|\bfoco\b|lampara|fluorescente|\bled\b/;
 const MOV=/segurida|bloque|no (se )?(mueve|maniobra|traslada|eleva|gira)|limite|final de carrera|fin de carrera|\bfc\b|\bseta\b|bumper|antiatrap|parada|\bk0\b|e-?k0/;
 window.segLimpia=limpia;
 const copia=i=>{if(!i||typeof i!="object")return i;const c=Object.assign({},i);c.com=limpia(i.com);c.obs=limpia(i.obs);return c};
 const soloAlum=i=>{const t=N([i.desc,i.def].filter(Boolean).join(" "));return ALUM.test(t)&&!MOV.test(t)};
 if(typeof segOT=="function"){const o=segOT;window.segOT=segOT=function(i){if(!i)return o.apply(this,arguments);if(soloAlum(i)&&!(i.segEl&&[].concat(i.segEl).length))return null;return o.call(this,copia(i))}}
 try{if(typeof render=="function")render()}catch(e){}
})();
