/* ===== v261: PRUEBA de idioma · botón EN/ES en la cabecera =====
 Traduce la interfaz de la PWA al inglés técnico sin tocar los datos: lo que escriben los técnicos (descripciones,
 actuaciones, observaciones) y los nombres se quedan como están. Funciona sobre la pantalla ya pintada: textos, botones,
 rótulos, avisos y cuadros de diálogo. Lo que no está en el diccionario se queda en español (se irá ampliando).
 Se recuerda en este móvil (localStorage «pbb_lang»). */
(function(){
const D={
/* cabecera y modos */
"Técnico":"Technician","Operador":"Operator","Admin":"Admin","Administrador":"Administrator","Turno":"Shift","⇄ Turno":"⇄ Shift",
"Técnicos":"Techs","Exportar":"Export","Exportar CSV":"Export CSV","Actualizar":"Update","↻ Actualizar":"↻ Update",
"＋ PBB":"＋ PBB","＋ Posición PBB":"＋ PBB position","Añadir posición PBB":"Add PBB position",
"Apagar · cerrar sesión":"Power off · log out","Apagar: cerrar sesión":"Power off: log out","Cerrar sesión":"Log out",
"Modo exterior (pleno sol)":"Outdoor mode (full sun)","Cargar la última versión de la app":"Load the latest app version",
"Mañana":"Morning","Tarde":"Afternoon","Noche":"Night","Responsable Turno":"Shift lead",
/* panel de control */
"PANEL DE CONTROL":"CONTROL PANEL","Panel de control":"Control panel",
"OT abiertas":"Open WOs","OT cerradas":"Closed WOs","OT S/Condiciones":"WOs on hold",
"Registrar OT":"New WO","Seguimiento OT":"WO tracking","Importar OT":"Import WOs","Mantenimiento":"Maintenance",
"Mantenimiento preventivo":"Preventive maintenance","Resolución IA":"AI resolution","RESOLUCIÓN IA":"AI RESOLUTION",
"Claude · Resolución IA":"Claude · AI resolution","Claude · resolución IA":"Claude · AI resolution",
"SOS: primera actuación en campo":"SOS: first field action","Órdenes de Trabajo Abiertas":"Open Work Orders",
"Sin averías abiertas.":"No open faults.","Sin Órdenes de Trabajo abiertas.":"No open work orders.","No hay averías abiertas.":"No open faults.","Sin OT abiertas":"No open WOs",
"Reg. OT":"New WO","Seg. OT":"Track WO","Res. OT":"AI res.","Inicio":"Home","Menú":"Menu","Abrir menú":"Open menu",
"Planos":"Drawings","Planos y esquemas":"Drawings & schematics","Planos y documentación":"Drawings & documentation",
"Guía":"Guide","Casos":"Cases","Calendario, posiciones del día y trabajos realizados":"Calendar, today's positions and work done",
"Nueva":"New","Estado":"Status","Foto":"Photo","Hoja":"Sheet",
/* tarjeta de OT */
"ABIERTA":"OPEN","Abierta":"Open","Abiertas":"Open","ABIERT.":"OPEN","CERRADA":"CLOSED","Cerrada":"Closed","Cerradas":"Closed","CERR.":"CLOSED",
"S/CONDICIONES":"ON HOLD","S/Condiciones":"On hold","Espera de Condiciones":"Awaiting conditions",
"INICIO":"START","INI":"STA","LLE":"ARR","CIE":"CLO","LLEGADA":"ARRIVAL","FUERA":"LATE","ABIERTA DESDE":"OPEN SINCE",
"Nº Orden CGA:":"CGA order no.:","Equipos:":"Equipment:","Turno:":"Shift:","Integrantes:":"Crew:","Actuación:":"Action taken:",
"Obs.:":"Notes:","Comentario:":"Comment:","Equipo AAP:":"PCA unit:","Alarma:":"Alarm:",
"He llegado a la posición":"I'm at the position","Llegada: quedan":"Arrival: time left","Llegada":"Arrival",
"Cierre CGA":"CGA close-out","Editar":"Edit","Editar OT":"Edit WO","Eliminar":"Delete","Eliminar OT":"Delete WO","Ed./Elim.":"Edit/Del.",
"Actuación guiada":"Guided action","Inspección cable a cable":"Wire-by-wire inspection","Inspección cable a cable de esta OT":"Wire-by-wire inspection of this WO",
"Módulos PLC":"PLC modules","Módulos PLC de esta OT":"PLC modules of this WO","Foto PLC":"PLC photo","FOTO PLC":"PLC PHOTO",
"Borrar foto PLC":"Delete PLC photo","Ir a la actuación más eficaz de esta OT":"Go to the most effective action for this WO",
"Avería abierta":"Open fault","¿Eliminar incidencia?":"Delete fault?","Esta acción no se puede deshacer.":"This action cannot be undone.",
/* seguimiento */
"SEGUIMIENTO OT":"WO TRACKING","Nº orden o PBB":"Order no. or PBB","Fecha":"Date","Posición":"Position","Todas":"All",
"Borrar búsqueda":"Clear search","Buscar OT por fecha":"Search WOs by date","Quitar fecha":"Clear date",
"Avisos de llegada activos en este móvil":"Arrival alerts active on this phone","Probar":"Test",
"Sin resultados.":"No results.",
/* registrar / editar / cierre */
"Registrar incidencia":"Log fault","Guardar incidencia":"Save fault","Terminal":"Terminal","Posición PBB":"PBB position",
"Elegir PBB…":"Choose PBB…","Teclear nº":"Type no.","Número de orden (CGA)":"Order number (CGA)","Nº de orden (CGA)":"Order no. (CGA)",
"Introduce solo los 3 últimos dígitos":"Enter only the last 3 digits","Reportado por":"Reported by","Otro":"Other",
"Descripción de la incidencia":"Fault description","Descripción":"Description",
"Obligatorio: descripción del aviso de CGA":"Required: description of the CGA call","Tipo":"Type","Tipo de incidencia":"Fault type",
"Hora de inicio":"Start time","Hora de llegada":"Arrival time","Hora final de cierre":"Final close time","* obligatoria":"* required",
"Se registra automáticamente al guardar la OT":"Logged automatically when the WO is saved","Hora rápida (24 h)":"Quick time (24 h)",
"Actuación":"Action taken","Observaciones":"Notes","Cerrar OT":"Close WO","Cerrar":"Close","Cancelar":"Cancel",
"Editar registro":"Edit record","Guardar cambios":"Save changes","Guardar":"Save","Subir":"Up","Bajar":"Down",
"Copia Actuación y Observaciones y abre el proyecto PBB TKE":"Copies Action and Notes and opens the PBB TKE project",
"Analizar con Claude":"Analyse with Claude","¿Quién?":"Who?","Equipos":"Equipment","Tipo de equipo":"Equipment type",
"Guardar alarma":"Save alarm","Elige AAC o AAR para ver las alarmas.":"Choose AAC or AAR to see the alarms.",
/* importar hoja */
"Importar hoja de registro de OT":"Import WO log sheet","Foto, PDF, Excel o CSV de la hoja (del día o antigua). Corrige cada OT mirando la foto y guarda.":"Photo, PDF, Excel or CSV of the sheet (today's or older). Check each WO against the photo and save.",
"📷 Foto / archivo de la hoja":"📷 Sheet photo / file","Fecha de la hoja":"Sheet date","Cargar Hoja OT":"Load WO sheet","Cargando…":"Loading…",
"Añadir Registro Manual OT":"Add manual WO record","＋ Añadir línea OT":"＋ Add WO line","Guardar OT en la app":"Save WOs to the app",
"Sin OT todavía. Sube la foto o añádelas a mano.":"No WOs yet. Upload the photo or add them by hand.","Quitar OT":"Remove WO",
"Acercar":"Zoom in","Alejar":"Zoom out","Girar foto":"Rotate photo","Agrandar o reducir el visor":"Enlarge or shrink the viewer",
"Analizando la hoja manuscrita línea a línea…":"Analysing the handwritten sheet line by line…",
"H. inicio":"Start","H. llegada":"Arrival","H. final":"End","Actuación, incidencia u observaciones":"Action, fault or notes","Integrantes":"Crew",
"Los del turno":"Shift crew","Nº OT":"WO no.",
/* mantenimiento */
"Sin mantenimientos programados para hoy.":"No maintenance scheduled for today.","Mensual":"Monthly","Semestral":"Six-monthly","Correctivo":"Corrective",
"Posiciones":"Positions","Hecho":"Done","Cancelado":"Cancelled","Añadir al calendario":"Add to calendar","📷 Importar":"📷 Import",
"Alta manual forzada":"Forced manual entry","Incidencias anteriores":"Previous faults","Trabajos realizados":"Work done",
"Posiciones separadas por comas; añade M o S detrás si es distinto del tipo elegido (ej. 502, 504 S).":"Positions separated by commas; add M or S after if different from the chosen type (e.g. 502, 504 S).",
"Ej. 502, 504, 528 S":"E.g. 502, 504, 528 S",
/* acceso */
"Acceso Técnico":"Technician access","Acceso Administrador":"Administrator access","Identificación obligatoria":"Identification required",
"Para usar el modo Técnico introduce el turno y el nombre del técnico. Hasta entonces la app está desactivada.":"To use Technician mode enter the shift and technician name. Until then the app is disabled.",
"Introducir turno y nombre":"Enter shift and name","Para el modo Operador pulsa O arriba.":"For Operator mode press O above.",
"Selecciona tu turno":"Select your shift","Selecciona tu nombre":"Select your name","Selecciona el turno":"Select the shift",
"Selecciona el nombre del técnico":"Select the technician name","Cambio de turno e integrantes":"Shift and crew change","Cambiar turno":"Change shift",
"Solo cambiar integrantes":"Change crew only","Entrar":"Log in","Código de técnico":"Technician code","Código":"Code","Volver":"Back",
"Nombre del técnico":"Technician name","Técnico de este turno":"Technician on this shift","Dar de alta":"Register","Añadir Técnico":"Add technician",
"Sin técnicos dados de alta":"No technicians registered","Cargando técnicos…":"Loading technicians…","Obligatorio: turno y nombre del técnico.":"Required: shift and technician name.",
/* guía de campo (rótulos) */
"Guía de campo":"Field guide","Seguridad antes de intervenir":"Safety before working","Análisis de OT":"WO analysis",
"Actuación más eficaz":"Most effective action","Guía de campo · actuación más eficaz":"Field guide · most effective action",
"Instrucciones":"Instructions","Copiar":"Copy","Limpiar":"Clear","Pegar desde el portapapeles":"Paste from clipboard","Entendido":"Got it",
"Pasar a «Actuación guiada» de la OT":"Send to the WO's «Guided action»","Pasar resultado a la OT":"Send result to the WO","Pasar medidas a la OT":"Send readings to the WO",
"Plano de esta guía":"Drawing for this guide","Abrir / Descargar":"Open / Download","Reintentar":"Retry","Validar":"Validate","Quitar":"Remove",
"Módulo":"Module","Señal":"Signal","Referencia":"Reference","Modelo":"Model","OT asociada":"Linked WO",
"Observaciones (lo que detectas en campo)":"Notes (what you find in the field)",
/* avisos */
"Registro actualizado":"Record updated","Nueva versión":"New version","Más tarde":"Later",
"Modo exterior desactivado · sigue el modo del teléfono":"Outdoor mode off · follows the phone setting","☀️ Modo exterior activado":"☀️ Outdoor mode on",
"Introduce la hora de cierre":"Enter the close time","Introduce la hora de inicio":"Enter the start time","Introduce la hora de llegada":"Enter the arrival time",
"🔕 Notificaciones bloqueadas: actívalas en Ajustes → Notificaciones → PBB TKE.":"🔕 Notifications blocked: enable them in Settings → Notifications → PBB TKE."
};
const MES={enero:"January",febrero:"February",marzo:"March",abril:"April",mayo:"May",junio:"June",julio:"July",agosto:"August",septiembre:"September",octubre:"October",noviembre:"November",diciembre:"December"};
const DIA={lunes:"Monday",martes:"Tuesday","miércoles":"Wednesday",jueves:"Thursday",viernes:"Friday","sábado":"Saturday",domingo:"Sunday"};
const P=[
 [/^Inicio (\d{1,2}:\d{2})( ·)?$/,"Start $1$2"],
 [/^Inicio (\S+) · Llegada (\S+) · Cierre (\S+)$/,"Start $1 · Arrival $2 · Close $3"],
 [/^Llegada (\d{1,2}:\d{2})$/,"Arrival $1"],
 [/^Eliminar OT (\d+)$/,"Delete WO $1"],[/^Orden (\d+)$/,"Order $1"],
 [/^Resolución · PBB (.+)$/,"Close-out · PBB $1"],
 [/^(\d{4}-\d{2}-\d{2}) · Reportado por: (.+)$/,"$1 · Reported by: $2"],
 [/^(\d+) OT$/,"$1 WO"],
 [/^(\d+) OT encontradas? del (.+)$/,"$1 WO found on $2"],[/^(\d+) OT encontradas?$/,"$1 WO found"],
 [/^Ninguna OT el (.+)$/,"No WOs on $1"],[/^Ninguna OT con ese Nº de orden o posición(.*)$/,"No WO with that order no. or position$1"],
 [/^(\d+) OT cerradas? de otros turnos ocultas? · búscalas por Nº de orden o posición$/,"$1 closed WO(s) from other shifts hidden · search by order no. or position"],
 [/^\((\d+) min\)$/,"($1 min)"],
 [/^(\S+) · remota$/,"$1 · remote"],
 [/^Versión de la PWA (.+)$/,"PWA version $1"],
 [/^Turno: (.+)$/,"Shift: $1"],
 [/^Nueva versión (v\d+) disponible$/,"New version $1 available"],
 [/^(\d+) mantenimientos? este mes · toca un día para ver sus posiciones$/,"$1 maintenance jobs this month · tap a day to see its positions"],
 [/^🔧 Hoy · (\S+) (\d+) de (\S+)$/,(m,d,n,mo)=>`🔧 Today · ${DIA[d]||d} ${n} ${MES[mo]||mo}`],
 [/^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre) (\d{4})$/i,(m,mo,y)=>`${MES[mo.toLowerCase()]} ${y}`],
 [/^OT (\d+) · PBB (\S+) en espera de condiciones$/,"WO $1 · PBB $2 on hold"],[/^OT (\S*) · PBB (\S+) reanudada \(abierta\)$/,"WO $1 · PBB $2 resumed (open)"],
 [/^(\d+) OT importadas?(.*)$/,"$1 WO imported$2"],
 [/^⏸ En espera de condiciones(.*)$/,(m,r)=>"⏸ On hold awaiting conditions"+r.replace(" desde las "," since ").replace(" · pendiente de resolución o cierre por CGA · personal especialista del sistema"," · pending resolution or close-out by CGA · system specialist staff")]
];
const tr=t=>{const k=String(t).replace(/\s+/g," ").trim();if(!k)return null;if(D[k])return D[k];for(const [re,to] of P){if(re.test(k))return k.replace(re,to)}return null};
let EN=false;try{EN=localStorage.getItem("pbb_lang")=="en"}catch(e){}
const ORIG=new Map(),AORIG=new Map(),ATTR=["placeholder","title","aria-label"];
/* no se traduce lo escrito por los técnicos: descripción de la OT (párrafo de la tarjeta), campos de texto ni valores de fila */
const DATO=p=>p.closest(".card p,.card .gfrow,.oirow textarea,[data-noi18n]");
function txNode(n){const p=n.parentElement;if(!p||/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName)||p.isContentEditable||DATO(p))return;
 const v=n.nodeValue;const o=ORIG.get(n);if(o&&o.en===v)return;const t=tr(v);if(t==null)return;
 const pre=v.match(/^\s*/)[0],post=v.match(/\s*$/)[0];const en=pre+t+post;ORIG.set(n,{es:v,en});n.nodeValue=en}
function txEl(e){for(const a of ATTR){if(!e.hasAttribute||!e.hasAttribute(a))continue;const v=e.getAttribute(a);const k=e.__i18n&&e.__i18n[a];if(k&&k.en===v)continue;const t=tr(v);if(t==null)continue;
 e.__i18n=e.__i18n||{};e.__i18n[a]={es:v,en:t};AORIG.set(e,1);e.setAttribute(a,t)}}
function pasa(root){if(!EN||!root)return;if(root.nodeType==3){txNode(root);return}if(root.nodeType!=1)return;txEl(root);
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let n;while((n=w.nextNode())){if(n.nodeType==3)txNode(n);else txEl(n)}}
function vuelve(){ORIG.forEach((o,n)=>{if(n.isConnected&&n.nodeValue===o.en)n.nodeValue=o.es});ORIG.clear();
 AORIG.forEach((_,e)=>{if(e.__i18n){for(const a in e.__i18n){if(e.getAttribute(a)===e.__i18n[a].en)e.setAttribute(a,e.__i18n[a].es)}delete e.__i18n}});AORIG.clear()}
let pend=new Set(),raf=0;
const mo=new MutationObserver(ms=>{if(!EN)return;for(const m of ms){if(m.type=="characterData")pend.add(m.target);else if(m.type=="attributes")pend.add(m.target);else m.addedNodes.forEach(x=>pend.add(x))}
 if(!raf)raf=requestAnimationFrame(()=>{raf=0;const s=pend;pend=new Set();s.forEach(pasa)})});
mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTR});
/* avisos y diálogos */
const om=window.msg;if(typeof om=="function")window.msg=function(t,...r){return om.call(this,EN?(tr(t)||t):t,...r)};
const oc=window.confirm.bind(window),oa=window.alert.bind(window);
window.confirm=t=>oc(EN?(tr(t)||t):t);window.alert=t=>oa(EN?(tr(t)||t):t);
/* v262: sin botón propio · el cambio ES/EN se hace pulsando el LOGO TKE de la cabecera (el título queda centrado como antes) */
const st=document.createElement("style");st.textContent=`#hk .hk1 .hklg{cursor:pointer;-webkit-tap-highlight-color:transparent}#hk .hk1 .hklg:active{transform:scale(.94)}
html[lang=en] #hk .hk1 .hklg{filter:drop-shadow(0 0 5px #3b82f6) drop-shadow(0 0 1px #93c5fd)}`;document.head.appendChild(st);
const pinta=()=>{const l=document.querySelector("#hk .hk1 .hklg");if(l){l.title=EN?"Language: English · tap the logo for Spanish":"Idioma: español · pulsa el logo para inglés";l.setAttribute("role","button");l.setAttribute("aria-label",l.title)}};
document.addEventListener("click",e=>{const l=e.target.closest&&e.target.closest("#hk .hk1 .hklg");if(!l)return;e.stopPropagation();e.preventDefault();cambia()},true);
const pon=pinta;
window.cambia=function(){EN=!EN;try{localStorage.setItem("pbb_lang",EN?"en":"es")}catch(e){}document.documentElement.lang=EN?"en":"es";
 if(EN)pasa(document.body);else vuelve();pinta();
 try{om&&om(EN?"English (technical) · tap the TKE logo to switch back to Spanish":"Idioma: español · pulsa el logo TKE para inglés")}catch(e){}};
document.documentElement.lang=EN?"en":"es";
new MutationObserver(pon).observe(document.body,{childList:true,subtree:true});pon();if(EN)pasa(document.body);
window._i18n={tr,D};
})();
