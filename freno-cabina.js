/* ===== v341: freno de cabina = FINAL DE CARRERA de freno del giro de cabina activado =====
 Según las rutas del esquema rev. J (P-A6, folios 87-88):
  · Freno cabina izquierda → IT-S3 (CABIZ), contacto NC 11-12, manguera -WS3, -CLEMA:1/2 → P-A6 borna 2.4
  · Freno cabina derecha   → IT-S3 (CABDE), contacto NC 11-12, manguera -WS3.1, -CLEMA:1/2 → P-A6 borna 3.1
  · Alimentación: hilo 336 (+24 V pupitre, derivado de P-X92.1:1 por P-X92:1, P-Q30.2)
  · Límites normales de giro de cabina: C-B1 derecha (P-A6 2.1, P-W8, P-X92:6) · C-B2 izquierda (P-A6 1.1, P-W9, P-X92:5)
 - Caja nueva de la guía (grupo Cabina) con la actuación más eficaz.
 - Primera actuación en campo: puente provisional en la entrada de P-A6 del FC activado (como los demás elementos de seguridad).
 - Corrige la caja «Cabina / brazo…», que citaba un freno cabina C-B24 que no está en la ruta. ===== */
(function(){
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const S=GUIA.tipos.PAS.s;
const T="Cabina / freno de giro de cabina activado · FC izquierda (IT-S3 CABIZ) / derecha (IT-S3 CABDE)";
if(!S.some(x=>x.t==T))S.push({t:T,g:[87,88],r:"folios 87-88 (P-A6) · alimentación hilo 336 desde P-X92:1",p:[
 "PRIORIDAD 1 · «Freno de cabina activado» = FINAL DE CARRERA de freno del giro de cabina pisado. Izquierda: IT-S3 (CABIZ) → P-A6 LED 2.4. Derecha: IT-S3 (CABDE) → P-A6 LED 3.1. Contacto NC 11-12: en reposo el LED está encendido (≈24 V); con el FC pisado el LED se apaga y el giro de cabina hacia ese lado se para.",
 "PRIORIDAD 1 · Mirar en P-A6 qué LED está apagado (2.4 izquierda / 3.1 derecha) y girar la cabina hacia el lado CONTRARIO (FC derecho → girar a la izquierda; FC izquierdo → girar a la derecha) para liberar el FC. El LED debe volver a encenderse.",
 "PRIORIDAD 1 · Si la cabina no sale del FC por mando: puente provisional con hilo en P-A6 entre +24 V (hilo 336) y la entrada del FC activado (borna 3.1 derecha / 2.4 izquierda), con un compañero vigilando el giro de cabina. Sacar la cabina despacio y QUITAR EL PUENTE al terminar.",
 "Con la cabina fuera del FC y el LED todavía apagado: medir ≈24 V en IT-S3 borna 11 (hilo 336 por -CLEMA:1, manguera -WS3 izquierda / -WS3.1 derecha, conductor 1). Sin 24 V → alimentación 336: P-X92:1 y protección P-Q30.2 del pupitre.",
 "24 V en IT-S3 borna 11 y 0 V en borna 12 con el FC liberado → contacto del final de carrera abierto: revisar leva o rodillo, ajuste, golpe o agua en el IT-S3; si no cierra, sustituirlo.",
 "24 V en IT-S3 borna 12 y nada en P-A6 (2.4 / 3.1) → conductor 2 de la manguera -WS3 / -WS3.1 o borna -CLEMA:2 floja o cortada.",
 "Antes de dejarla en servicio: comprobar por qué la cabina llegó al FC de freno. Límite normal de giro: inductivo C-B1 derecha (P-A6 LED 2.1, manguera P-W8, P-X92:6) y C-B2 izquierda (P-A6 LED 1.1, manguera P-W9, P-X92:5), y potenciómetro de giro C-R10 → E-R10 → E-A4 (medida de giro de cabina en la Magelis).",
 "Giro de cabina: P-Q6 (1,3 A) → P-K61/2 → motor C-M1. Con la cabina liberada, en P-A4 deben estar encendidos el disyuntor y los inversores de cabina."]});
/* la caja general de cabina citaba «freno cabina C-B24»: en la ruta los frenos son IT-S3 (CABIZ / CABDE) */
S.forEach(x=>{if(/^Cabina \/ brazo/.test(x.t))x.p=x.p.map(p=>p.replace(/y freno cabina C-B24 \(P-A6\)/,"(P-A6 1.1 / 2.1) y frenos de cabina IT-S3 CABIZ / CABDE (P-A6 2.4 / 3.1)"))});
/* primera actuación en campo: puente en la entrada de P-A6 del FC de freno de cabina */
try{SEN_DEF.push({re:/freno (de (la )?)?(giro (de )?)?cabina|cabina.{0,25}freno|cabiz|cabde/,sub:[
 [/izq|izd|cabiz/,["P-A6","2.4",null,"IT-S3 (CABIZ)","Freno cabina izquierda"],1],
 [/derech|dch|drch|cabde/,["P-A6","3.1",null,"IT-S3 (CABDE)","Freno cabina derecha"],1]]})}catch(e){}
})();
