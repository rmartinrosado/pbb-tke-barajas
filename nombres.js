/* ===== v406: nombre del dispositivo delante de su código en las instrucciones =====
   En la guía de campo, la actuación más eficaz, la actuación guiada de la OT, el análisis de OT, la lupa y el SOS,
   cada código de elemento (E-X62, C-B14, EP-W8, E-K3…) lleva delante su nombre: «Bornero AE E-X62»,
   «Ultrasonido de altura C-B14», «Manguera AE → pupitre EP-W8»…
   · Solo la primera vez que aparece cada código en cada bloque de texto (para no recargar).
   · Si el texto ya lo nombra justo delante («BORNERO E-X62», «manguera EP-W8», «ultrasonido C-B14») no se repite.
   · No se tocan croquis, botones, casillas de texto ni los datos guardados (solo lo que se ve en pantalla).
   Nombres tomados de ESQUEMA GENERAL rev. J, PBB 504/508 y PBB 507 (los mismos textos de la guía). */
(function(){
const N={
 /* ---- Módulos PLC ---- */
 "E-A0":"Cabecera PLC armario E","E-A1":"Módulo salidas digitales AE","E-A2":"Módulo entradas digitales AE","E-A3":"Módulo entradas digitales AE",
 "E-A4":"Módulo analógicas 4-20 mA","E-A5":"Módulo de seguridades","E-A6":"Módulo salidas de seguridad","E-A7":"Módulo salidas de seguridad",
 "E-A8":"Módulo entradas de seguridad","E-A9":"Módulo seguridad antiatrapamientos","E-A10":"Módulo entradas de seguridad","E-A11":"Interbus armario E",
 "P-A0":"Cabecera PLC pupitre","P-A1":"Módulo salidas digitales pupitre","P-A2":"Módulo salidas digitales pupitre","P-A3":"Módulo entradas mandos pupitre",
 "P-A4":"Módulo entradas digitales pupitre","P-A5":"Módulo entradas cabina","P-A6":"Módulo entradas cabina",
 /* ---- Cabina ---- */
 "C-B1":"Inductivo límite cabina dcha","C-B2":"Inductivo límite cabina izda","C-B3":"Fotocélula proximidad avión","C-B4":"Zapata de seguridad",
 "C-B6":"Ultrasonido proximidad","C-B7":"Sensor brazo contacto","C-B8":"Sensor brazo arriba 2","C-B9":"Sensor brazo arriba 1","C-B10":"Sensor brazo abajo 2",
 "C-B11":"Sensor brazo abajo 1","C-B12":"Sensor brazo neutral 1","C-B13":"Sensor brazo neutral 2","C-B14":"Ultrasonido de altura","C-B17":"Sensor capota retraída",
 "C-B22":"Sensor suelo","C-B24":"Sensor freno cabina","C-B25":"Bumper ala A380","C-B26":"Sensor ala A380","C-B27":"Bumper brazo autonivelador",
 "C-B28":"Bumper brazo autonivelador","C-B29":"Bumper lateral cabina","C-B30":"Bumper lateral cabina","C-B51":"Contacto avión dcha","C-B52":"Contacto avión izda",
 "C-GER4":"Conector bumper ala","C-GER7":"Retenedor portón","C-H1":"Luz flash bajo cabina","C-H2":"Gálibo","C-H3":"Gálibo","C-H4":"Sirena autonivelación",
 "C-H5":"Luz azul bajo cabina","C-H41":"Sirena seguridad cabina","C-R10":"Potenciómetro giro cabina","C-R3.1":"Inclinómetro suelo basculante",
 "C-R2":"Suelo térmico","C-R3":"Suelo térmico","C-S1":"FC límite suelo dcha","C-S2":"FC límite suelo izda","C-S9":"Sensor portón enrollable",
 "C-S15":"FC capota izda","C-S16":"FC capota dcha","C-S51":"FC límite suelo A380","C-M1":"Motor giro cabina","C-M2":"Motor brazo autonivelador",
 "C-M4":"Motor capota izda","C-M4.1":"Motor capota dcha","C-M5":"Motor suelo basculante","C-M6":"Motor portón enrollable","C-E1":"Luneta térmica",
 "C-E2":"Luneta térmica","C-E7":"Foco 300 W","C-E8":"Foco 300 W","C-E9":"Foco 300 W","C-PT100":"Sonda suelo térmico","C-COT1":"Foco azafata",
 "C-P1":"Cámara cabina dcha","C-P3":"Cámara cabina superior","C-P4":"Cámara frontal cabina","C-P5":"Cámara cabina inf. izda",
 /* ---- Columna / rotonda ---- */
 "CO-B1":"Detector 1 giro rotonda","CO-B2":"Detector 2 giro rotonda","CO-S1":"FC rotonda","CO-K10":"Relé iluminación túnel fijo","CO-K18":"Relé iluminación escalera",
 "CO-Q16":"Magnetotérmico UPS columna","R-B1":"Emisor barrera rotonda","R-B3":"Emisor barrera rotonda","R-B2":"Receptor barrera rotonda","R-B4":"Receptor barrera rotonda",
 "R-H1":"Semáforo rotonda","R-R1":"Potenciómetro giro rotonda","R-R10":"Encoder giro rotonda","R-S2":"Autorización rotonda",
 /* ---- Panel de mandos del pupitre ---- */
 "CP-H1":"Piloto estado","CP-H2":"Piloto alarma","CP-S0":"Joystick / hombre muerto","CP-S5":"Seta pupitre","CP-S7":"Pulsador desplegar capota",
 "CP-S8":"Pulsador recoger capota","CP-S9":"Pulsador cabina izda","CP-S10":"Pulsador cabina dcha","CP-S11":"Pulsador PBB subir","CP-S12":"Pulsador PBB bajar",
 "CP-S14":"Pulsador subir suelo","CP-S15":"Pulsador bajar suelo","CP-S16":"Selector Auto/Manual","CP-S17":"Pulsador iluminación interior",
 "CP-S18":"Pulsador iluminación exterior","CP-S21":"Pulsador prioridad retorno","CP-S27":"Pulsador retorno autónomo","CP-S29":"Pulsador subir portón",
 "CP-S30":"Pulsador bajar portón","CP-S31":"Pulsador lunetas","CP-S33":"Llave bypass seguridades","CP-S40":"Pulsador abandono operador",
 "CP-S41":"Pulsador presencia desconexión","CP-S42":"Pulsador presencia conexión","CP-S43":"Pulsador OK Handling","CP-S45":"Pulsador iluminación exterior",
 "CP-S46":"Pulsador iluminación interior","CP-S47":"Pulsador lunetas",
 "CP-W14":"Cable zapata","CP-W60":"Cable bumper brazo","CP-W61":"Cable bumper brazo","CP-W62":"Cable bumper lateral","CP-W63":"Cable bumper lateral",
 /* ---- Armario eléctrico E ---- */
 "E-B2":"Crepuscular","E-B3":"Termostato caldeo","E-B4":"Termostato caldeo armario","E-E2":"Caldeo armario E","E-M10":"Ventilador armario E",
 "E-F19":"Protector sobretensiones","E-F20":"Protector sobretensiones","E-F21":"Protector sobretensiones",
 "E-K0":"Contactor seguridad 1","E-K0.1":"Contactor seguridad 2","E-K1":"Contactor variadores","E-K3":"Contactor bomba hidráulica","E-K10":"Relé iluminación interior",
 "E-K14":"Relé sistema de vídeo","E-K15":"Relé focos exteriores","E-K17":"Relé lunetas térmicas","E-K18":"Relé iluminación escalera","E-K24":"Relé frenos traslación",
 "E-K26":"Relé retorno autónomo","E-K33":"Relé retorno outrigger","E-K41":"Inversor capota izda","E-K42":"Inversor capota izda","E-K43":"Inversor capota dcha",
 "E-K44":"Inversor capota dcha","E-K60":"Relé caldeo","E-K60.1":"Relé luces flash","E-K61":"Relé válvula subir","E-K62":"Relé válvula bajar",
 "E-K65":"Relé outrigger activado","E-K66":"Relé outrigger arriba","E-K67":"Relé outrigger abajo","E-K68":"Relé sirena movimiento","E-K69":"Relé sirena fallo auto",
 "E-K81":"Inversor portón","E-K82":"Inversor portón","E-K85":"Relé PBB activada (CBTH)","E-K86":"Relé PBB en servicio (CBTH)","E-K87":"Relé PBB mantenimiento (CBTH)",
 "E-K88":"Relé PBB avería (CBTH)","E-K89":"Relé fallo auto","E-K90":"Relé seta VDGS","E-K90.1":"Relé seta VDGS","E-K101":"Contactor seguridad 2","E-K102":"Contactor seguridad 3",
 "E-Q1":"Disyuntor variadores","E-Q3":"Guardamotor bomba","E-Q4":"Guardamotor capota izda","E-Q4.1":"Guardamotor capota dcha","E-Q8":"Guardamotor portón",
 "E-Q10":"Magnetotérmico iluminación túnel/escalera","E-Q10.1":"Magnetotérmico iluminación cabina/túneles","E-Q12":"Magnetotérmico gálibos y caldeos",
 "E-Q13":"Diferencial enchufes","E-Q14":"Magnetotérmico cámara","E-Q15":"Magnetotérmico trafo P-T1","E-Q15.1":"Magnetotérmico focos","E-Q17.1":"Magnetotérmico lunetas",
 "E-Q18":"Magnetotérmico switch cámaras","E-Q22":"Magnetotérmico fuente 24 V","E-Q24":"Magnetotérmico frenos traslación","E-Q25":"Magnetotérmico megafonía",
 "E-Q26":"Magnetotérmico retorno autónomo","E-Q30":"Protección general 24 VDC","E-Q30.0":"Alarma protecciones 24 VDC","E-Q30.1":"Protección 24 V CPU",
 "E-Q30.2":"Protección 24 V módulos","E-Q30.3":"Protección 24 V común entradas","E-Q30.4":"Protección 24 V seguridades","E-Q40":"Disyuntor pupitre (cabina/brazo)",
 "E-Q150":"Magnetotérmico monofásico 220 V","E-R1":"Resistencia de frenado","E-R2":"Resistencia de frenado","E-R10":"Convertidor potenciómetro cabina",
 "E-S0":"Interruptor general","E-S0.1":"Interruptor mando 24 V (SAI)","E-S7":"Llave bypass AKS","E-S100":"Bloqueo carro A/A",
 "E-U1":"Variador traslación izdo","E-U2":"Variador traslación dcho","E-U5":"Relé Gelbau bordes ruedas","E-U7":"Relé anemómetro",
 "E1-U3":"Fuente 24 VDC","E1-U6":"Variador bomba","E1-U8":"Relé Gelbau bordes ruedas","E-V1":"Switch cámaras","E-V3":"Fuente 24 VDC","E-V5":"Central megafonía",
 /* ---- Túneles ---- */
 "ET-B6":"Detector 1 extensión","ET-B7":"Detector 2 extensión","ET-B9":"Láser de extensión","ET-B17":"AKS motor 1","ET-B18":"AKS motor 2","ET-B20":"Altavoz",
 "ET-H1":"Sirena movimiento","ET-S1":"FC extensión","ET-V1":"Anemómetro","ET-E3":"Foco 300 W","ET-E4":"Foco 300 W","ET-P2":"Cámara ruedas","ET-P3":"Cámara interior ronda",
 "IT-B1":"Barrera óptica túnel A izda","IT-B1.1":"Receptor barrera túnel A izda","IT-B2":"Barrera óptica túnel A dcha","IT-B2.1":"Receptor barrera túnel A dcha",
 "IT-B4":"Antiatrapamiento túnel A izdo","IT-B5":"Antiatrapamiento túnel A dcho","IT-B10":"Límite inferior inclinación","IT-B11":"Límite superior inclinación",
 "IT-B20":"Altavoz","IT-B21":"Altavoz","IT-R3":"Inclinómetro","IT-S1":"Pulsador iluminación","IT-S2":"FC inclinación","IT-S3":"FC inclinación","IT-P2":"Cámara túnel interior",
 "IT-CON1":"Conector barreras","MT-CON1":"Conector barreras","MT-B1":"Barrera óptica túnel B izda","MT-B1.1":"Receptor barrera túnel B izda",
 "MT-B2":"Barrera óptica túnel B dcha","MT-B2.1":"Receptor barrera túnel B dcha","MT-B3":"Antiatrapamiento túnel B dcho","MT-B20":"Altavoz","MT-S3":"Antiatrapamiento túnel B",
 /* ---- Elevación / tren de ruedas ---- */
 "H-B1":"Inductivo contaje traslación izda","H-B2":"Inductivo contaje traslación dcha","H-B3":"Inductivo límite giro izda","H-B4":"Inductivo límite giro dcha",
 "H-B5":"Sensor outrigger izdo","H-B6":"Sensor outrigger dcho","H-B9":"Presostato outriggers","H-B19":"AKS motor A380","H-H1":"Luz flash elevación izda",
 "H-H2":"Luz flash elevación dcha","H-H3":"Timbre teléfono","H-M1":"Motor bomba hidráulica","H-S1":"FC traslación","H-S3":"Seta emergencia","H-S4":"Seta emergencia",
 "H-S11":"Pulsador OK retirada","H-Y1":"Electroválvula subir","H-Y2":"Electroválvula bajar","H-Y3":"Electroválvula bajada rápida","H-Y4":"Electroválvula bajada rápida izda",
 "H-Y5":"Electroválvula bajada rápida dcha","H-Y6":"Electroválvula outrigger subir","H-Y7":"Electroválvula outrigger bajar","H-Y8":"Electroválvula activar outrigger",
 "T-B5":"Borde ruedas delantero","T-B6":"Borde ruedas trasero","T-B51":"Borde ruedas trasero","T-B61":"Borde ruedas delantero","T-M1":"Motor traslación izdo",
 "T-M2":"Motor traslación dcho","T-S5":"Freno eléctrico motor izdo","T-S6":"Freno manual motor izdo","T-S7":"Freno eléctrico motor dcho","T-S8":"Freno manual motor dcho",
 "T-Y1":"Freno motor izdo","T-Y2":"Freno motor dcho","T-CON10":"Conector bordes ruedas",
 /* ---- Pupitre ---- */
 "P-B20":"Regulador suelo térmico","P-C1":"Condensador motor suelo","P-E1":"Caldeo pupitre","P-H9":"Zumbador","P-H50":"Zumbador A380","P-K17":"Relé lunetas",
 "P-K20":"Relé foco azafata","P-K21":"Relé foco azafata rojo","P-K22":"Relé foco azafata verde","P-K23":"Relé foco azafata azul","P-K51":"Inversor brazo autonivelador",
 "P-K52":"Inversor brazo autonivelador","P-K61":"Inversor giro cabina","P-K62":"Inversor giro cabina","P-K68":"Relé luz azul fija","P-K69":"Relé luz azul intermitente",
 "P-K71":"Inversor suelo basculante","P-K72":"Inversor suelo basculante","P-K80":"Relé abandono operador","P-K81":"Relé presencia desconexión","P-K82":"Relé presencia conexión",
 "P-K83":"Relé OK Handling","P-K84":"Relé OK retirada PBB","P-K85":"Relé zapata activada","P-Q5":"Guardamotor brazo","P-Q6":"Guardamotor giro cabina","P-Q7":"Guardamotor suelo",
 "P-Q11":"Magnetotérmico suelo térmico","P-Q30":"Protección 24 VDC pupitre","P-Q30.0":"Alarma protecciones 24 V pupitre","P-Q30.1":"Protección 24 V CPU pupitre",
 "P-Q30.2":"Protección 24 V módulos pupitre","P-Q30.3":"Protección 24 V pupitre","P-T1":"Transformador 400/220-24 V","P-U3":"Driver DALI foco azafata","P-U5":"Relé Gelbau zapata",
 /* ---- Escalera / CBTH ---- */
 "SS-B15":"Inductivo puerta servicio","SS-S1":"Pulsador iluminación escalera","SS-E1":"Luminaria escalera","SS-P1":"Cámara escalera","CBTH-Z0":"Interruptor general CBTH",
 /* ---- Mangueras y cables con función propia ---- */
 "E-W9":"Cable potenciómetro cabina","E-W13":"Cable láser extensión","E-W18":"Cable megafonía","E-W1":"Cable altavoz ronda","P-W20":"Cable ultrasonido altura",
 "IT-W16":"Cable potenciómetro rotonda","EIT-W4":"Manguera analógicas AE → túnel A","EP-W8":"Manguera analógicas AE → pupitre","EP-W3":"Cable Interbus AE ↔ pupitre",
 "EP-W4":"Manguera seguridades AE → pupitre","EP-W11":"Cable megafonía AE → pupitre","EC-W20":"Manguera sirena cabina","H-W13":"Cable motor bomba",
 "ETR-W1":"Cable motor traslación izdo","ETR-W2":"Cable motor traslación dcho","T1-W1":"Cable bordes ruedas","T1-W2":"Cable bordes ruedas",
 "P-W17":"Cable contacto avión dcha","P-W18":"Cable contacto avión izda","P-W19":"Cable ultrasonido proximidad","P-W15":"Cable fotocélula proximidad",
 "P-W24":"Cable sensor suelo","P-W22":"Cable motor brazo","P-W7":"Cable motor giro cabina","P-W11":"Cable motor suelo","P-W8":"Cable límite cabina dcha","P-W9":"Cable límite cabina izda",
 "C-W1":"Cable motor portón","C-W10":"Cable motor capota izda","C-W10.1":"Cable motor capota dcha","H-W6":"Cable electroválvula H-Y4","H-W7":"Cable electroválvula H-Y5",
 "H-W8":"Cable electroválvula H-Y3","H-W9":"Cable electroválvula H-Y1","H-W10":"Cable electroválvula H-Y2","H-W14":"Latiguillo inductivo contaje",
 "H-W15":"Latiguillo inductivo contaje","H-W16":"Latiguillo inductivo límite giro","H-W17":"Latiguillo inductivo límite giro","IT-W7":"Cable FC inclinación",
 "IT-W8":"Cable FC inclinación","IT-W12":"Cable altavoz","MT-W3":"Cable altavoz","ESS-W20":"Cable puerta de servicio","ECO-W2":"Manguera UPS columna → AE",
 "ITIT-W21":"Cable emisor barrera","ITIT-W21.1":"Cable receptor barrera","ITIT-W22":"Cable emisor barrera","ITIT-W22.1":"Cable receptor barrera",
 "MTMT-W21":"Cable emisor barrera","MTMT-W21.1":"Cable receptor barrera","MTMT-W22":"Cable emisor barrera","MTMT-W22.1":"Cable receptor barrera"};
/* Zonas (denominación de lugar +) para los nombres genéricos de borneros y mangueras */
const Z={CBTH:"CBTH",ITCO:"túnel A → columna",IT:"túnel A",MT:"túnel B",ET:"túnel C",CO:"columna",CO3:"columna",CP:"panel mandos",SS:"escalera",C4:"cabina",
 T1:"bogie",E1:"AE",E:"AE",P:"pupitre",C:"cabina",H:"elevación",T:"bogie",R:"rotonda",F:"campo"};
const ZK=Object.keys(Z).sort((a,b)=>b.length-a.length);
function parteZ(p){const out=[];let s=p;while(s){const k=ZK.find(z=>s.startsWith(z));if(!k)return null;out.push(k);s=s.slice(k.length)}return out}
function genW(pre){const z=parteZ(pre);if(!z)return "";const n=z.map(k=>Z[k]).filter((v,i,a)=>i==0||v!=a[i-1]);
 return n.length>1?"Manguera "+n.join(" → "):"Cable "+n[0]}
const CLASE={X:t=>{const z=Z[t]||(parteZ(t)||[]).map(k=>Z[k])[0];return z?"Bornero "+z:"Bornero"},A:()=>"Módulo PLC",K:()=>"Relé",Q:()=>"Protección",
 Y:()=>"Electroválvula",M:()=>"Motor",B:()=>"Sensor",P:t=>/^(C|IT|ET|SS)$/.test(t)?"Cámara":"",CON:()=>"Conector"};
function nombre(tag,sig){
 const m=tag.match(/^([A-Z]{1,4}\d?)-([A-Z]{1,3})(\d+(?:\.\d+)?)$/);if(!m)return "";const pre=m[1],cl=m[2];
 if(!Z[pre]&&cl!="W")return "";
 if(/^(IT|MT)-S3$/.test(tag)){if(/^'/.test(sig))return "Antiatrapamiento "+(pre=="IT"?"túnel A":"túnel B");if(/^\(CAB/i.test(sig))return "Freno cabina";if(/^\(TUN/i.test(sig))return "Freno túnel B"}
 if(N[tag])return N[tag];
 if(cl=="W")return genW(pre);
 const f=CLASE[cl];return f?f(pre):""}
window.nombreElemento=nombre;
/* Palabras que, justo delante del código, indican que el texto ya dice qué es */
const YA={X:/(bornero|borna|bornas|regleta|regletero|caja|clema)s?\W*$/,W:/(manguera|mangueras|cable|cables|latiguillo|latiguillos)\W*$/,A:/(modulo|plc|cabecera)\W*$/,
 K:/(rele|reles|contactor|contactores|inversor|inversores)\W*$/,Q:/(disyuntor|guardamotor|magnetotermico|diferencial|proteccion|automatico)\W*$/,Y:/(valvula|electrovalvula|electrovalvulas)\W*$/,M:/(motor|motores|bomba)\W*$/};
const sinT=s=>String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
function yaDicho(pre,tag,nm){const p=sinT(pre).slice(-40).replace(/[\s:·,(]+$/," ");const cl=(tag.match(/-([A-Z]{1,3})\d/)||[])[1];
 if(cl&&YA[cl]&&YA[cl].test(p.trimEnd()))return true;
 const w=sinT(nm).split(/[\s/()]+/).filter(x=>x.length>=4);if(w[0]&&p.slice(-26).includes(w[0]))return true;return false}
/* Zonas de la pantalla donde hay instrucciones */
const SEL=".gst,.gblq,.anal,.anaw,.anap,.anass,.gav,.sia,.srtx,.puac,.elusd,.elh,.gfix,.gsub,.gres,.grec";
const NO="svg,button,textarea,input,select,script,style,code,.elnm,.cxin,.cxd,[data-nonm],[contenteditable=true]";
const RE=/(^|[^A-Z0-9+_-])\+?((?:CBTH|[A-Z]{1,4}\d?)-[A-Z]{1,3}\d+(?:\.\d+)?)(?![0-9A-Za-z])/g;
const VISTO=new WeakMap();
(function(){const st=document.createElement("style");st.textContent=`.elnm{font-weight:700;color:var(--elnm,#0b7a75);font-size:.92em;letter-spacing:.01em;text-transform:none}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--elnm:#4dd0c8}}:root[data-theme=dark]{--elnm:#4dd0c8}`;document.head.appendChild(st)})();
/* texto visible justo antes del nodo dentro del bloque (aunque esté en otro <span>, p. ej. los .nw de texto.js) */
function antes(tn,cont){const w=document.createTreeWalker(cont,NodeFilter.SHOW_TEXT);w.currentNode=tn;let acc="";
 while(acc.length<40&&w.previousNode()){const p=w.currentNode.parentElement;if(p&&p.closest(".elnm"))break;acc=w.currentNode.nodeValue+acc}return acc}
function procTexto(tn,cont){const s=tn.nodeValue;if(!s||!/[A-Z]-[A-Z]/.test(s))return;
 let set=VISTO.get(cont);if(!set){set=new Set();VISTO.set(cont,set)}
 RE.lastIndex=0;let m,last=0,frag=null;
 while((m=RE.exec(s))){const tag=m[2],ini=m.index+m[1].length;const sig=s.slice(m.index+m[0].length,m.index+m[0].length+8);
  const base=tag.replace(/^\+/,"");const nm=nombre(base,sig);if(!nm)continue;const key=base+"|"+nm;if(set.has(key))continue;set.add(key);
  let pre=s.slice(0,ini);if(pre.length<40)pre=antes(tn,cont)+pre;
  if(yaDicho(pre,base,nm))continue;
  frag=frag||document.createDocumentFragment();frag.append(s.slice(last,ini));
  const sp=document.createElement("span");sp.className="elnm";sp.textContent=nm+" ";frag.append(sp);last=ini}
 if(!frag)return;frag.append(s.slice(last));
 /* código suelto dentro de un <span class="nw"> (texto.js): el nombre va delante del span, que puede partir línea */
 const pa=tn.parentElement;if(pa&&pa.classList.contains("nw")&&pa.childNodes.length==1&&frag.firstChild&&frag.firstChild.nodeType==3&&!frag.firstChild.nodeValue&&frag.childNodes[1]&&frag.childNodes[1].className=="elnm"){
  const sp=frag.childNodes[1];pa.parentNode.insertBefore(sp,pa);frag.removeChild(frag.firstChild)}
 tn.parentNode.replaceChild(frag,tn)}
function procCont(c){const w=document.createTreeWalker(c,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest(NO)||p.closest(SEL)!==c)return NodeFilter.FILTER_REJECT;
  return /[A-Z]-[A-Z]/.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});
 const ts=[];while(w.nextNode())ts.push(w.currentNode);ts.forEach(t=>{try{procTexto(t,c)}catch(e){}})}
/* Solo se revisa lo que cambia (la app refresca cada pocos segundos): contenedores añadidos o modificados */
const COLA=new Set();let pend=false;
function encola(n){if(!n)return;const el=n.nodeType==1?n:n.parentElement;if(!el||!el.isConnected)return;
 if(el.classList&&el.classList.contains("elnm"))return;const c=el.closest(SEL);if(c)COLA.add(c);
 if(el.querySelectorAll)el.querySelectorAll(SEL).forEach(x=>COLA.add(x))}
function corre(){pend=false;const cs=[...COLA];COLA.clear();cs.forEach(c=>{if(c.isConnected)procCont(c)})}
function plan(){if(pend)return;pend=true;(window.requestAnimationFrame||setTimeout)(corre)}
new MutationObserver(ms=>{for(const m of ms){if(m.type=="characterData")encola(m.target);else m.addedNodes.forEach(encola)}if(COLA.size)plan()})
 .observe(document.documentElement,{childList:true,subtree:true,characterData:true});
function inicio(){encola(document.body);plan()}
if(document.readyState!="loading")inicio();else document.addEventListener("DOMContentLoaded",inicio);
})();
