/* ===== v76: iconos de la guía de campo sacados de los dibujos del propio plano ESQUEMA GENERAL rev. J =====
 Sustituyen a los iconos de zona de v70. Cada título de la guía (cajas de avería, actuación más eficaz,
 comprobaciones por sistema, inspección cable a cable…) lleva delante el dibujo del plano del sistema
 electromecánico al que se refiere (folio de origen entre paréntesis). El conector 400 Hz no tiene dibujo en
 ESQUEMA GENERAL rev. J y se mantiene dibujado. Si un título no apunta a ningún sistema, se pone el del tipo de aviso. */
(function(){
const ICO={
 pasarela:["Pasarela (f.9)"],alimentacion:["Alimentación / armario E (f.9)"],telefono:["Comunicaciones teléfono (f.10)"],
 aire:["Carro PCA / aire acondicionado (f.12)"],tierras:["Barra de tierras (f.15)"],sobretension:["Protección sobretensiones (f.17)"],
 iluminacion:["Iluminación (f.19)"],baliza:["Señalización / luz rotativa (f.21)"],calefaccion:["Suelo térmico / caldeos (f.22)"],
 enchufe:["Enchufes / monofásica (f.23)"],focos:["Focos túnel y cabina (f.24)"],camara:["Cámara de vídeo (f.25)"],
 capota:["Motores capota (f.26)"],porton:["Portón / suelo basculante (f.27)"],lunetas:["Lunetas térmicas cabina (f.28)"],
 fuente24v:["Fuente 24 VDC (f.29)"],frenos:["Frenos de traslación (f.30)"],megafonia:["Megafonía (f.30)"],
 traslacion:["Variadores y motores de traslación (f.31)"],hidraulica:["Bomba hidráulica / elevación (f.34)"],
 cabina:["Motores cabina (f.34)"],autonivelador:["Brazo autonivelador (f.34)"],bordes:["Borde ruedas / antiatrapamientos (f.41)"],
 "final-carrera":["Finales de carrera (f.42)"],seta:["Paradas de emergencia (f.43)"],"bajada-rapida":["Bajada rápida (f.44)"],
 plc:["PLC y módulos (f.51)"],display:["Display Magelis (f.49)"],joystick:["Pupitre / joystick (f.50)"],
 safety:["Módulos de seguridad (f.64)"],sirena:["Sirena seguridad cabina (f.91)"],red:["Switch Ethernet (f.93)"],
 "camaras-rcs":["Cámaras de vídeo RCS (f.95)"],vdgs:["SVGA / VDGS"],HZ:["Convertidor / conector 400 Hz"]
};
/* título → sistema (el primero que coincide) */
const MAPA=[
 [/puente provisional|primera actuaci|actuaci[oó]n directa|\bsos\b/i,"plc"],
 [/pds ?400|conector|convertidor|manguera|enrollador/i,"HZ"],
 [/carro|a\/a|\baire\b|\bpca\b|ventilador|compresor|condensad|filtro|presostato|mariposa|humos|equipos de servicio/i,"aire"],
 [/safety|m[oó]dulos? de seguridad|lazo de seguridad|contactor de seguridad|interlock|90 ?%/i,"safety"],
 [/cotejo plc|inspecci[oó]n cable|\bplc\b|^sd[io]$|^pwr$|m[oó]dulo|comprobaci[oó]n en armario/i,"plc"],
 [/borde|zapata|bumper/i,"bordes"],
 [/antiatrapamiento|finales? de carrera/i,"final-carrera"],
 [/\bsetas?\b|emergencia|paradas/i,"seta"],
 [/bajada r[aá]pida/i,"bajada-rapida"],
 [/freno/i,"frenos"],
 [/^cabina/i,"cabina"],
 [/autonivel|neutrales|suelo basculante/i,"autonivelador"],
 [/capota/i,"capota"],
 [/port[oó]n/i,"porton"],
 [/\bsube\b|\bbaja\b|elevaci[oó]n|hidr[aá]ulic|bomba/i,"hidraulica"],
 [/traslad|traslaci[oó]n|variador/i,"traslacion"],
 [/megafon|reloj|handling/i,"megafonia"],
 [/tel[eé]fono/i,"telefono"],
 [/c[aá]maras rcs/i,"camaras-rcs"],
 [/c[aá]mara|v[ií]deo/i,"camara"],
 [/display|magelis/i,"display"],
 [/comunicaciones|\bred\b|ethernet|switch/i,"red"],
 [/señaliz|flash|sem[aá]foro|baliza|luz azul/i,"baliza"],
 [/sirena/i,"sirena"],
 [/focos?\b/i,"focos"],
 [/iluminaci/i,"iluminacion"],
 [/luneta/i,"lunetas"],
 [/caldeo|calefacci|suelo t[eé]rmico/i,"calefaccion"],
 [/enchufe|monof[aá]sica|230 ?v/i,"enchufe"],
 [/tierras/i,"tierras"],
 [/sobretensi/i,"sobretension"],
 [/24 ?vdc|28 ?vdc|fuente/i,"fuente24v"],
 [/autorizaci[oó]n|acometida|alimentaci|sin tensi[oó]n|armario|diferencial|protecci[oó]n|disparo/i,"alimentacion"],
 [/pupitre|mando|joystick|bot[oó]n|pulsador|piloto/i,"joystick"],
 [/cabina/i,"cabina"],
 [/rotonda|extensi[oó]n|columna|cbth|anticolisi|an[aá]lisis de la ot|comprobaciones por sistema|cierre de la actuaci|pasarela|\bpbb\b|interfaz|interbloqueo/i,"pasarela"]
];
const TIPO={PAS:"pasarela",AAA:"aire",AAP:"aire",AAR:"aire",AAC:"aire",HZ:"HZ",SVGA:"vdgs"};
const sistemaDe=(t,tipo)=>{let k=null;for(const[re,v] of MAPA)if(re.test(t)){k=v;break}
 /* en avisos de 400 Hz, mandos, pilotos y lazo 90 % son los del propio convertidor */
 if(tipo=="HZ"&&(k=="joystick"||k=="safety"||k=="fuente24v"))k="HZ";
 return k||TIPO[tipo]||"pasarela"};
const HZSVG=`<svg viewBox="0 0 40 40" width="32" height="32"><defs><linearGradient id="zicg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0098dc"/><stop offset="1" stop-color="#62b2e4"/></linearGradient></defs><circle cx="20" cy="20" r="19.5" fill="url(#zicg)"/><rect x="9" y="10" width="15" height="17" rx="3.5" fill="#eef1f5"/>${[[13.5,14.5],[19.5,14.5],[13.5,22.5],[19.5,22.5]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8" fill="#4b5262"/>`).join("")}<circle cx="16.5" cy="18.5" r="1.2" fill="#f2c200"/><path d="M24 18.5 H28 Q31 18.5 31 22 V31" stroke="#4b5262" stroke-width="2.4" fill="none"/><text x="20" y="35.5" font-size="5.4" font-weight="700" fill="#fff" text-anchor="middle" font-family="sans-serif">400Hz</text></svg>`;
const zic=k=>{const n=(ICO[k]||[k])[0];return `<span class="zic" title="${n}" aria-hidden="true">${k=="HZ"?HZSVG:`<img src="iconos/${k}.png?v=1" alt="" width="32" height="32" loading="lazy">`}</span>`};
window.ZONA_ICO=ICO;window.zonaIcono=zic;window.sistemaDe=sistemaDe;
const EMO=/^[\s\u{1F300}-\u{1FAFF}☀-➿️‍]+/u;
function pinta(){if(typeof view!="undefined"&&view!="tec")return;const app=document.getElementById("app");if(!app)return;
 const tipo=typeof gTipo!="undefined"?gTipo:"";
 app.querySelectorAll("details > summary").forEach(sm=>{if(sm.dataset.zic)return;const d=sm.parentElement;
  if(d.dataset.k=="SEG")return;/* el triángulo de seguridad se mantiene */
  const b=sm.querySelector(":scope > b");if(!b)return;
  const txt=b.textContent.replace(EMO,"").trim();if(!txt)return;
  const k=sistemaDe(txt,tipo);
  /* quita el emoji inicial (🎯 📹 🔍 📏 🧰) del título y el marcador 🎯 de avería relacionada */
  const t0=b.firstChild;if(t0&&t0.nodeType==3)t0.nodeValue=t0.nodeValue.replace(EMO,"");
  b.querySelectorAll(".anat").forEach(x=>{x.textContent="";x.classList.add("anadot")});
  b.insertAdjacentHTML("afterbegin",zic(k));sm.dataset.zic=1})}
const oV=vTec;vTec=function(){const r=oV.apply(this,arguments);try{pinta()}catch(e){console.warn("iconos",e)}return r};
/* cajas que se insertan después (puente, análisis…): repintar al abrir/cerrar */
document.addEventListener("toggle",()=>{try{pinta()}catch(e){}},true);
const st=document.createElement("style");st.textContent=`.zic{display:inline-flex;align-items:center;vertical-align:middle;margin:0 8px 0 0;line-height:1;flex:none}
.zic img,.zic svg{display:block;width:32px;height:32px;border-radius:50%;box-shadow:0 1px 2px rgba(0,0,0,.18)}
.anat.anadot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef6c00;margin-right:6px;vertical-align:middle}`;document.head.appendChild(st);
})();
