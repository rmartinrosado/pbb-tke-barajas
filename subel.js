/* ===== v423-v424: segregar el elemento concreto dentro de las cajas que agrupan varios (lupa del Panel de control) =====
   v423: «Fallo medida analógica extensión» → de «Medidas analógicas (E-A4)» solo el láser ET-B9 (AI02) y los pasos comunes.
   v424: lo mismo en TODOS los sistemas electromecánicos (PAS, 507, HZ, AAA): cada caja que agrupa varios elementos tiene
   sus opciones. El elemento se elige por las palabras de la descripción; si no nombra ninguno, desplegable con las opciones.
   Además, en cualquier caja, si la descripción dice IZQUIERDO o DERECHO se quitan los pasos y frases solo del otro lado.
   · Pasos mixtos: se parten en frases (« · » y «. ») y se quitan las de los elementos no elegidos.
   · Se mantienen enteros los pasos comunes o de seguridad (QUÉ HAY, PRIORIDAD, NUNCA, Lectura…, CIERRE, CÓMO FUNCIONA…)
     y las frases de alimentación «común».
   · Los pasos que aún citan otros elementos se muestran sin croquis.
   Para añadir otra caja: una entrada más en SUB (box = inicio del título; op = opciones con q: palabras en la descripción
   y s: palabras en los pasos; todo en minúsculas y sin tildes). ===== */
(function(){
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const O=(k,n,q,s,ch)=>({k,n,q,s:s||q,ch});
const SUB=[
 /* ---------- PASARELA (PAS) ---------- */
 {box:/^medidas anal/,et:"¿Qué medida falla?",op:[
  O("alt","Altura · ultrasonido C-B14 (AI01)",/\baltura\b|ultrason|c-?b14/,/altura|ultrason|c-?b14|\bai0?1\b|ain01|p-w20|ep-w8|hilo 341/,1),
  O("ext","Extensión · láser ET-B9 (AI02)",/extensi|retracc|\blaser\b|et-?b9|telescop|longitud/,/extensi|\blaser\b|et-?b9|\bai0?2\b|ain02|e-w13|hilo 312/,2),
  O("cab","Giro de cabina · potenciómetro C-R10 y convertidor E-R10 (AI03)",/cabina|c-?r10|e-?r10|convertidor/,/cabina|c-?r10|e-?r10|convertidor|\bai0?3\b|ain03|e-w9|e-x65|hilo 315/,3),
  O("rot","Giro de rotonda · potenciómetro R-R1 / encoder R-R10 (AI04)",/rotonda|r-?r1\b|r-?r10|encoder/,/rotonda|r-?r1\b|r-?r10|encoder|\bai0?4\b|ain04|hilo 316|it-w16/,4)]},
 {box:/^pupitre encendido pero no rearma/,et:"¿Qué abre la cadena de seguridad?",op:[
  O("seta","Setas de emergencia CP-S5 / H-S3 / H-S4 / AO",/\bsetas?\b|emergencia|\bparo\b|cp-?s5|h-?s[34]/,/\bsetas?\b|cp-s5|h-s3|h-s4/),
  O("fc","Finales de carrera (traslación, extensión, rotonda, inclinación)",/final(es)? de carrera|\bfc\b|h-?s1|et-?s1|co-?s1|it-?s[23]|inclinaci/,/finales de carrera|h-s1|et-s1|co-s1|it-s2|it-s3/),
  O("bor","Bordes de ruedas T-B5 / T-B6 (Gelbau E-U5)",/bordes?|bandas?|ruedas|gelbau|t-?b[56]/,/bordes|t-b5|t-b6|e-u5|t1-w|t-con10/),
  O("por","Sensor del portón C-S9",/porton|persiana|enrollable|c-?s9/,/porton|c-s9/),
  O("a10","Bumpers, barrera de rotonda, puerta de servicio o zapata (E-A10)",/bumper|zapata|barrera|puerta de servicio|ss-?b15|e-?a10/,/bumper|zapata|barrera|ss-b15|e-a10/),
  O("ant","Antiatrapamientos de túneles (E-A9)",/antiatrap|atrapamiento|e-?a9/,/antiatrap|e-a9/),
  O("ctr","Contactores de seguridad E-K0 / E-K0.1 / E-K1 · E-A5 / E-A6 · Interbus",/contactor|e-?k0|e-?k1\b|interbus|e-?a[56]\b/,/e-a6|e-k0|e-k1\b|e-a5|interbus|ep-w3/)]},
 {box:/^no traslada/,et:"¿Qué parte de la traslación?",op:[
  O("var","Variadores E-U1 / E-U2 y motores T-M1 / T-M2",/variador|e-?u[12]\b|\bu[12]\b|sobretension|\bbus\b|motor(es)? de traslaci|t-?m[12]|e-?q1\b|resistencia de frenado/,/variador|e-u1|e-u2|u1\/u2|e-r1|e-r2|sobretension|e-q1\b|t-m1|t-m2|etr-w|codigo de alarma/),
  O("fre","Frenos T-Y1 / T-Y2 y freno manual T-S6 / T-S8",/freno|desfren|t-?y[12]|t-?s[68]/,/freno|e-k24|t-y1|t-y2|e-q24|t-s6|t-s8|desfren/),
  O("ind","Inductivos de límite de giro H-B3 / H-B4 y contaje H-B1 / H-B2",/inductivo|limite de giro|contaje|h-?b[1-4]|almena/,/inductivo|h-b[1-4]|contaje/),
  O("k1","Contactor de variadores E-K1",/e-?k1\b|contactor/,/e-k1\b/)]},
 {box:/^no sube \/ no baja/,et:"¿Qué parte de la elevación?",op:[
  O("bom","Bomba H-M1 · E-Q3 · E-K3",/bomba|h-?m1|e-?q3|e-?k3\b/,/bomba|e-q3|h-m1|h-w13|e-k3\b/),
  O("sub","Subir · válvula H-Y1 (relé E-K61)",/no sube|\bsubir\b|\bsube\b|h-?y1|e-?k61/,/h-y1|subir|e-k61/),
  O("baj","Bajar · válvula H-Y2 (relé E-K62)",/no baja|\bbajar\b|\bbaja\b|h-?y2|e-?k62/,/h-y2|bajar|e-k62/),
  O("rap","Bajada rápida H-Y3 / H-Y4 / H-Y5",/rapida|h-?y[345]/,/rapida|h-y3|h-y4|h-y5/),
  O("lim","Límites de inclinación IT-S2 / IT-S3 y altura C-B14",/limite|inclinaci|altura|c-?b14|it-?s[23]/,/limite|inclinaci|it-s2|it-s3|c-b14/)]},
 {box:/^cabina \/ brazo autonivelador/,et:"¿Qué movimiento falla?",op:[
  O("cab","Giro de cabina · C-M1 (P-Q6, P-K61/2)",/giro de cabina|girar la cabina|cabina no gira|c-?m1|c-?r10|c-?b[12]\b|freno de cabina|p-?k6[12]|p-?q6/,/giro cabina|c-m1|p-k61|p-q6|c-b1\/|c-r10|frenos de cabina|limites cabina/),
  O("bra","Brazo autonivelador · C-M2 (P-Q5, P-K51/2)",/brazo|autonivel|c-?m2|p-?k5[12]|p-?q5|c-?b(8|9|1[0-3])\b/,/brazo|c-m2|p-k51|p-q5|c-b8|c-b13/),
  O("sue","Suelo basculante · C-M5 (P-Q7, P-K71/2)",/suelo|basculante|c-?m5|p-?k7[12]|p-?q7|c-?s[12]\b/,/suelo|c-m5|p-k71|p-q7|c-s1|c-s2|p-c1/)]},
 {box:/^fallo de autonivelacion/,et:"¿Qué sensor o parte del brazo?",op:[
  O("arr","Sensores ARRIBA C-B8 / C-B9",/arriba|c-?b[89]\b/,/arriba|c-b8\b|c-b9\b/),
  O("aba","Sensores ABAJO C-B10 / C-B11",/abajo|c-?b1[01]\b/,/abajo|c-b10|c-b11/),
  O("neu","Sensores NEUTRAL C-B12 / C-B13",/neutral|c-?b1[23]\b/,/neutral|c-b12|c-b13/),
  O("mov","El brazo no se mueve · motor C-M2, P-Q5, inversor P-K51/2, bumper del brazo",/no se mueve|motor|c-?m2|p-?q5|p-?k51|inversor|bumper/,/no se mueve|c-m2|p-q5|p-k51|inversor|bumper/)]},
 {box:/^capota no despliega/,et:"¿Qué lado de la capota?",op:[
  O("izq","Capota IZQUIERDA · E-Q4, E-K41/42, C-S15, C-M4",/izquierd|\bizq|izda|e-?q4\b(?!\.)|e-?k4[12]|c-?s15/,/\(izq\)|e-q4 \(|e-k41|c-s15/),
  O("dch","Capota DERECHA · E-Q4.1, E-K43/44, C-S16, C-M4.1",/derech|\bdch|e-?q4\.1|e-?k4[34]|c-?s16/,/\(dcha\)|e-q4\.1|e-k43|c-s16/)]},
 {box:/^sirena de cabina/,et:"¿Sirena o barrera de rotonda?",op:[
  O("sir","Sirena de seguridad de cabina C-H41 (alarmas 138 / 140 / 141)",/sirena|c-?h41|\b13[89]\b|\b14[01]\b|puerta de servicio|ss-?b15/,/sirena|c-h41|\b138\b|\b140\b|\b141\b|ss-b15|ec-w20|puerta de servicio/),
  O("bar","Barrera de rotonda R-B1…R-B4 (evento 294)",/barrera|r-?b[1-4]|\b294\b/,/barrera|r-b[1-4]|\b294\b/)]},
 {box:/^zapata \/ bordes \/ bumpers/,et:"¿Qué elemento está activado?",op:[
  O("zap","Zapata C-B4 (Gelbau P-U5)",/zapata|c-?b4\b|p-?u5/,/zapata|c-b4\b|p-u5|cp-w14/),
  O("bor","Bordes de ruedas T-B5 / T-B6 (E-U5)",/bordes?|bandas?|ruedas|t-?b[56]|e-?u5/,/bordes|t-b5|t-b6|e-u5/),
  O("bum","Bumpers brazo y cabina C-B27…C-B30",/bumper|parachoq|c-?b2[7-9]|c-?b30/,/bumper|c-b27|c-b30/)]},
 {box:/^bumpers brazo y cabina/,et:"¿Qué grupo de bumpers?",op:[
  O("bra","Bumpers del BRAZO autonivelador C-B27 + C-B28",/brazo|autonivel|c-?b2[78]/,/brazo|c-b27|c-b28|cp-w60|cp-w61|12–28|28–13|12–13/),
  O("cab","Bumpers LATERALES de CABINA C-B29 + C-B30",/cabina|lateral|c-?b29|c-?b30/,/lateral|cabina en el bornero|c-b29|c-b30|cp-w62|cp-w63|14–29|29–15|14–15/)]},
 {box:/^iluminacion, enchufes/,et:"¿Qué circuito?",op:[
  O("ilu","Iluminación interior, exterior y focos",/ilumin|\bluz|luces|luminaria|focos?\b|e-?q10|e-?k1[058]\b/,/interior:|exterior|focos|e-q10|e-k10|e-k18|e-k15/),
  O("enc","Enchufes · diferencial E-Q13",/enchufe|diferencial|e-?q13/,/enchufe|e-q13/),
  O("cal","Caldeo · E-Q12, E-K60, termostato E-B4",/caldeo|calefac|termostato|e-?k60|e-?b4|e-?q12/,/caldeo|e-q12|e-k60\b|e-b4/),
  O("lun","Lunetas · E-Q17.1, E-K17",/luneta|e-?k17|e-?q17/,/lunetas|e-q17|e-k17/),
  O("mon","Cae todo el monofásico · E-Q150 / E-K0.1",/monofasic|e-?q150|todo el|nada/,/monofasico|e-q150/)]},
 {box:/^sistemas auxiliares · megafonia/,et:"¿Qué falla en la megafonía?",op:[
  O("cen","Central E-V5 apagada · alimentación y encendido remoto",/central|e-?v5|no enciende|apagad|e-?q25|e-?s3\b|encendido/,/e-v5 encendido|e-q25|e-s3|encendido remoto|e-x53|e-x66/),
  O("aud","Señal de audio · ruido o zumbido",/audio|senal|aviso|ruido|zumbido|ep-?w11|e-?x78/,/senal de audio|ruido|zumbido|ep-w11 conectada/),
  O("alt","Altavoces · suena una zona y otra no",/altavoz|altavoces|zona|it-?b2[01]|et-?b20|mt-?b20|no suena/,/suena una zona|no suena ningun|cable de altavoz/)]},
 {box:/^iluminacion · luces flash/,et:"¿Qué flash no luce?",op:[
  O("ch1","Flash bajo cabina C-H1",/c-?h1\b|cabina/,/flash bajo cabina c-h1:/),
  O("hh1","Flash elevación IZQUIERDA H-H1",/h-?h1\b|izquierd|\bizq/,/h-h1 izq/),
  O("hh2","Flash elevación DERECHA H-H2",/h-?h2\b|derech|\bdch/,/h-h2 dcha/)]},
 {box:/^iluminacion · tunel interior/,et:"¿Qué zona no luce?",op:[
  O("tun","Túnel interior e iluminación hacia rotonda",/tunel|it-?e[12]|rotonda|descansillo|it-?s1/,/it-x51 → eit-w1|it-w20/),
  O("esc","Escalera de servicio SS-E1 (relé E-K18)",/escalera|ss-?e1|ss-?s1|e-?k18/,/escalera de servicio ss-e1:/)]},
 {box:/^iluminacion · cabina, tunel exterior/,et:"¿Qué zona no luce?",op:[
  O("cab","Cabina C-E4",/cabina|c-?e4/,/c-x51 → c-w8 \(cabina\)/),
  O("ext","Túnel exterior ET-E1 / ET-E2",/exterior|et-?e[12]/,/\(tunel exterior\)/),
  O("med","Túnel medio MT-E1 / MT-E2",/medio|mt-?e[12]/,/\(tunel medio\)/)]},
 {box:/^iluminacion · focos de 300/,et:"¿Qué foco no luce?",op:[
  O("tun","Bajo túnel ET-E3 / ET-E4",/tunel|et-?e[34]/,/\(bajo tunel\)/),
  O("cab","Bajo cabina C-E7 / C-E8",/bajo cabina|c-?e[78]\b/,/\(bajo cabina\)/),
  O("ext","Exterior de cabina C-E9",/exterior de cabina|exterior cabina|c-?e9/,/\(exterior cabina\)/)]},
 {box:/^senalizacion · semaforo/,et:"¿Semáforo o luz azul?",op:[
  O("sem","Semáforo de rotonda R-H1",/semaforo|r-?h1/,/^semaforo:/),
  O("azu","Luz azul bajo cabina C-H5",/azul|c-?h5/,/^luz azul:/)]},
 {box:/^senalizacion · pilotos/,et:"¿Qué elemento no luce o no suena?",op:[
  O("pil","Pilotos del pupitre CP-H1 / CP-H2",/piloto|cp-?h[12]/,/^pilotos del pupitre/),
  O("sir","Sirena de alarma / autonivelación C-H4",/sirena|c-?h4\b|autonivel/,/^sirena de alarma/)]},
 {box:/^rotonda · detectores de giro/,et:"¿Qué detectores?",op:[
  O("gir","Giro de rotonda CO-B1 / CO-B2",/giro|co-?b[12]/,/^giro de rotonda/),
  O("ext","Extensión / retracción de túneles IT-B10 / IT-B11 / ET-B6 / ET-B7",/extensi|retracc|it-?b1[01]|et-?b[67]/,/^extension\/retraccion/)]},
 {box:/^pupitre · senales de handling/,et:"¿Qué señal?",op:[
  O("han","Handling: abandono operador, presencia, OK handling (P-K80…P-K83)",/abandono|presencia|handling|p-?k8[0-3]/,/^senales al cbth|^pulsadores de handling|^los contactos/),
  O("tel","Teléfono / timbre H-H3 y reloj",/telefono|timbre|reloj|h-?h3/,/^timbre de telefono/)]},
 {box:/^antiatrapamiento tunel activado/,et:"¿Qué túnel?",op:[
  O("int","Túnel INTERIOR (A-B)",/interior|tunel a\b|a-b\b|it-?s3|it-?b[1245]\b/,/tunel interior|interior izq|interior dcha|interior derecho|interior izquierdo|it-s3|it-b1|it-b2|it-b4|it-b5|hilo 743|hilo 744/),
  O("med","Túnel MEDIO (B-C, PBB de 3 túneles)",/medio|tunel b\b|b-c\b|mt-?s3|mt-?b[123]\b/,/tunel medio|medio izq|medio dcha|medio derecho|medio izquierdo|mt-s3|mt-b1|mt-b2|mt-b3|hilo 745|hilo 746/)]},
 {box:/^limite de traslacion/,et:"¿Qué elemento del límite?",op:[
  O("lim","Inductivos de límite de giro H-B3 / H-B4",/limite|final de giro|h-?b[34]\b/,/^puente provisional \(solo limite/),
  O("fc","FC de traslación H-S1 (rodillo)",/h-?s1\b|fc de traslacion|final de carrera|rodillo/,/^fc de traslacion|^puente provisional del fc/)]},
 /* ---------- PBB 507 ---------- */
 {box:/^pbb 507 · medidas analogicas/,et:"¿Qué medida falla?",op:[
  O("inc","Inclinómetro IT-R3 / suelo basculante C-R3.1",/inclinom|it-?r3|c-?r3\.1|suelo/,/inclinom|it-r3|c-r3\.1|p-a7/),
  O("cab","Giro de cabina C-R10",/cabina|c-?r10/,/cabina|c-r10/),
  O("elo","Elongación · láser DL50 ET-B9",/elongaci|extensi|laser|et-?b9|dl50/,/elongaci|et-b9|dl50|eet-w8/),
  O("ane","Anemómetro",/anemom|viento|e-?u7/,/anemom|e-u7/)]},
 {box:/^pbb 507 · bumper de ala/,et:"¿Bumper de ala o bordes de ruedas?",op:[
  O("ala","Bumper de ala A380 C-B25",/\bala\b|bumper|c-?b25|c-?ger4/,/bumper|c-b25|c-ger4/),
  O("bor","Bordes de ruedas T-B51 / T-B61 (Gelbau E1-U8)",/bordes?|ruedas|t-?b[56]1|e1-?u8|gelbau/,/bordes|t-b51|t-b61|e1-u8|gelbau/)]},
 {box:/^pbb 507 · outriggers/,et:"¿Qué movimiento de los outriggers?",op:[
  O("sub","Subir · H-Y6 / E-K66",/subir|\bsuben?\b|\bup\b|h-?y6|e-?k66/,/«outrigger up»|h-y6 subir/),
  O("baj","Bajar · H-Y7 / E-K67",/bajar|\bbajan?\b|down|h-?y7|e-?k67/,/«outrigger down»|h-y7 bajar/)]},
 /* ---------- 400 Hz (HZ) ---------- */
 {box:/^boton del mando no responde/,et:"¿Qué botón no responde?",op:[
  O("in","IN (recoger) · hilo 2",/\bin\b|recog/,/^in \(/),
  O("out","OUT (soltar) · hilo 3",/\bout\b|suelt|solt|sacar/,/^out \(/),
  O("on","ON (potencia) · hilo 4",/\bon\b/,/^on \(/),
  O("off","OFF · hilo 5",/\boff\b/,/^off \(/)]},
 {box:/^piloto del mando no enciende/,et:"¿Qué piloto no enciende?",op:[
  O("on","LED ON (rojo) · hilo 6",/led on|\bon\b|rojo/,/^led on/),
  O("28","LED 28 Vdc (verde) · hilo 7",/28|verde/,/^led 28/),
  O("90","Piloto 90 % / security (amarillo) · hilo 8",/90|security|amarillo/,/^piloto «security»/)]},
 /* ---------- Aire acondicionado (AAA) ---------- */
 {box:/^disparo de diferencial o proteccion/,et:"¿Qué protección ha disparado?",op:[
  O("com","Compresores · ID1-ID4, FGG1-FGG4, presostatos",/compresor|\bid[1-4]\b|fgg|\bkg|presostato|\bpa[1-4]\b|klixon/,/^compresores:/),
  O("vex","Ventiladores exteriores · FGVE1-FGVE4",/ventiladores? exterior|fgve/,/^ventiladores exteriores/)]},
 {box:/^maquina adx sin alimentacion/,et:"¿Zona de mando o de fuerza?",op:[
  O("man","Zona de MANDO · ID6, FGT, transformador, F1-F6, fuente 24 V",/mando|\bid6\b|fgt|transformador|f1-f6|fuente/,/zona de mando/),
  O("fue","Zona de FUERZA · IG, RCP, ID1-ID5, FGG, FGVI, FGVE",/fuerza|\big\b|\brcp\b|\bid[1-5]\b|fgg|fgvi|fgve/,/zona de fuerza/)]}];
/* lado: en cualquier caja, si la descripción dice izquierdo o derecho */
const LADO={op:[O("izq","",/izquierd|\bizq\b|\bizq\.|\bizda\b|\bizqda\b/,/izquierd|\bizq\b|\bizq\.|\bizda\b|cabiz/),O("dch","",/derech|\bdcha\b|\bdch\b|\bdch\.|\bdrcha\b/,/derech|\bdcha\b|\bdch\b|\bdch\.|cabde/)]};
const ELEG=new Map();let ULT="";
const ENTERO=/^(nunca|cierre|prioridad|que hay|lectura|caso real|como funciona|cuando suena|posiciones|primero|led en reposo|sintomas|sustitucion)/;
/* filtra los pasos dejando los del elemento elegido (ks) y los comunes */
function filtra(p,op,ks,todos){const cuenta=t=>op.filter(o=>o.s.test(nrm(t))).map(o=>o.k);const otros=t=>cuenta(t).some(k=>!ks.includes(k));
 const out=p.map(x=>{const c=cuenta(x);const ent=!todos&&ENTERO.test(nrm(x).trim());if(!c.length)return x;
  /* paso común o de seguridad: entero si cita el elemento elegido o varios; si solo cita otro elemento, fuera */
  if(ent&&(c.some(k=>ks.includes(k))||c.length>=2))return x;
  if(c.every(k=>ks.includes(k)))return x;if(!c.some(k=>ks.includes(k)))return null;
  let hd=(x.match(/^[^:·]{3,90}?(?:\([^)]*\))?:\s/)||[""])[0];if(hd&&otros(hd))hd="";const rest=x.slice(hd.length);
  const tk=rest.split(/(\s+·\s+|(?<=[^.\s]\.)(?<!\b(?:rev|pág|p[aá]g|fig|ap|n[ºo])\.)\s+(?=[A-ZÁÉÍÓÚÑ≈0-9][^,]))/);const o2=[];
  for(let j=0;j<tk.length;j+=2){const seg=tk[j],sep=tk[j-1]||"";const cs=cuenta(seg);
   if(!cs.length||/\bcom[uú]n(es)?\b/i.test(seg)||cs.some(k=>ks.includes(k)))o2.push((o2.length?(/·/.test(sep)?" · ":" "):"")+seg)}
  return o2.length?(hd+o2.join("")).trim():null}).filter(Boolean);
 return {p:out,otros}}
function def(s){const t=nrm(s&&s.t).replace(/^[^a-z0-9]+/,"");return SUB.find(d=>d.box.test(t))}
/* devuelve {s:caja filtrada, gen:Set(pasos sin croquis), sel:html del desplegable, rel:filtro de señales} o null */
window.lupaSub=function(s,q){if(!s)return null;if(q!==ULT){ELEG.clear();ULT=q}
 const d=def(s),t=nrm(q);let p=s.p||[];const gen=new Set();let sel="",rel=null,ks=[];
 if(d){ks=ELEG.has(s.t)?ELEG.get(s.t):d.op.filter(o=>o.q.test(t)).map(o=>o.k);const auto=!ELEG.has(s.t)&&ks.length>0;
  if(ks.length&&ks.length<d.op.length){const F=filtra(p,d.op,ks);p=F.p;p.forEach(x=>{if(F.otros(x))gen.add(x)});
   const chs=d.op.filter(o=>ks.includes(o.k)&&o.ch).map(o=>o.ch);if(chs.length)rel=x=>!(x&&x.mod=="E-A4")||chs.includes(+String(x.S&&x.S.l))}
  const opt=d.op.map(o=>`<option value="${o.k}"${ks.length==1&&ks[0]==o.k?" selected":""}>${o.n}</option>`).join("");
  sel=`<div class="sbx"><label>${d.et}${auto?' <small>(según la descripción)</small>':""}</label>
  <select onchange="lupaSubElige(${JSON.stringify(s.t).replace(/"/g,"&quot;")},this.value)">
  <option value=""${!ks.length||ks.length>1?" selected":""}>${ks.length>1?"Varias (según la descripción)":"— Elige el elemento que falla · todos —"}</option>${opt}</select>
  ${!ks.length?'<div class="sbav">La descripción no nombra el elemento: elige en el desplegable para ver solo sus pasos, croquis y medidas.</div>':""}</div>`}
 /* lado nombrado (solo uno): fuera lo que es solo del otro lado */
 const ls=LADO.op.filter(o=>o.q.test(t)).map(o=>o.k);let lado="";
 if(ls.length==1){const F=filtra(p,LADO.op,ls,1);if(F.p.length&&F.p.length<=p.length){lado=ls[0]=="izq"?"IZQUIERDO":"DERECHO";
  if(F.p.join("|")!=p.join("|"))p=F.p;else lado=""}}
 if(!d&&!lado)return null;
 if(lado)sel+=`<div class="sblado">Solo lado <b>${lado}</b> (según la descripción)</div>`;
 return {s:Object.assign({},s,{p}),gen,sel,ks,rel}};
window.lupaSubElige=function(t,v){ELEG.set(t,v?[v]:[]);try{lupaPinta(window.__lupaK||0,null)}catch(e){}};
window.lupaSubDefs=SUB;
const st=document.createElement("style");st.textContent=`.sbx{margin:8px 0 10px;padding:9px 10px;border:1.5px solid var(--pr,#f97316);border-radius:10px;background:rgba(249,115,22,.08)}
.sbx label{display:block;font-weight:700;font-size:13px;margin-bottom:6px}.sbx label small{font-weight:500;opacity:.75}
.sbx select{width:100%;font-size:15px;padding:9px 10px;border-radius:8px}.sbav{margin-top:6px;font-size:12px;opacity:.85}
.sblado{margin:6px 0 10px;font-size:12.5px;padding:6px 10px;border-radius:8px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.5)}`;
document.head.appendChild(st);
})();
