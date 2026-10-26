/* ===== v70: iconos de sistema de la guía de campo, sacados del dibujo «LOCALIZACIONES» de RCS PLANOS (folio 2) =====
 Zonas del plano: TF túnel fijo · R rotonda · IT túnel interior · MT túnel medio · ET túnel exterior · E armario eléctrico
 principal · C cabina · CP panel de control · P pupitre · H sistema de elevación · T sistema de traslación · SS escalera
 de servicio · CO armarios en columna. Se añaden PBB (pasarela completa), AAA (equipo PCA) y HZ (conector 400 Hz).
 Sustituyen a los emojis delante de los títulos de la guía y se ponen también en los que no tenían. */
(function(){
const L="#e8ebf1",S="#8f98aa",D="#4b5262",B="#1e88e5",Y="#f2c200";
const tun=(x,w,f)=>`<rect x="${x}" y="13" width="${w}" height="12" fill="${f||L}" stroke="${S}" stroke-width="1"/>`;
const fu=(x,n)=>Array.from({length:n},(_,i)=>`<rect x="${x+i*2}" y="11" width="1.4" height="16" fill="${D}"/>`).join("");
const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#fff" stroke="${B}" stroke-width="1"/>`;
const SVG={
 PBB:`${tun(2,10)}${fu(12,3)}<rect x="13" y="25" width="3" height="11" fill="${L}" stroke="${S}" stroke-width=".8"/>${tun(18,9)}${tun(27,6,"#d5d9e2")}<rect x="33" y="11" width="4" height="16" fill="${L}" stroke="${S}" stroke-width=".8"/><rect x="37" y="10" width="2" height="18" fill="${D}"/><line x1="29" y1="25" x2="29" y2="33" stroke="${S}" stroke-width="1.4"/><circle cx="29" cy="35" r="2.6" fill="${D}"/><circle cx="29" cy="35" r="1" fill="#fff"/>`,
 TF:`<path d="M6 12 L34 13 L34 26 L6 27 Z" fill="${L}" stroke="${S}"/><line x1="6" y1="25" x2="34" y2="24" stroke="${S}" stroke-width=".8"/>${dot(20,26)}`,
 R:`${tun(2,8)}${fu(10,7)}${tun(24,14)}<rect x="15" y="27" width="8" height="12" fill="${L}" stroke="${S}" stroke-width=".8"/>${dot(24,26)}`,
 IT:`${fu(4,3)}${tun(10,26)}${dot(11,25)}`,
 MT:`${tun(4,32,"#d5d9e2")}<rect x="4" y="13" width="32" height="3" fill="#9aa3b5"/>${dot(5,25)}`,
 ET:`${tun(2,34)}<rect x="17" y="6" width="4" height="7" fill="${D}"/><rect x="28" y="15" width="5" height="9" fill="#cfd6e2" stroke="${S}" stroke-width=".6"/><rect x="29" y="16" width="3" height="3" fill="${B}"/><path d="M12 25 L4 37 M15 25 L7 37" stroke="${S}" stroke-width="1"/>${dot(3,25)}`,
 E:`<rect x="10" y="4" width="20" height="32" rx="1.5" fill="#dfe3ea" stroke="${S}"/><rect x="14" y="8" width="9" height="9" fill="${B}" opacity=".85"/><rect x="24" y="20" width="3" height="1.6" fill="${D}"/><rect x="25" y="19" width="1.2" height="5" fill="${D}"/><line x1="12" y1="31" x2="28" y2="31" stroke="${S}" stroke-width=".8"/>`,
 C:`<rect x="6" y="8" width="22" height="24" fill="${L}" stroke="${S}"/><rect x="11" y="12" width="11" height="13" rx="3" fill="#fff" stroke="${D}" stroke-width="1.2"/><path d="M14 25 L24 15" stroke="${Y}" stroke-width="2"/>${Array.from({length:5},(_,i)=>`<rect x="${28+i*2}" y="${6+i*.3}" width="1.4" height="${28-i*.6}" fill="${D}"/>`).join("")}${dot(16,25)}`,
 CP:`<rect x="8" y="5" width="24" height="30" rx="5" fill="#cdd3dd" stroke="${S}"/><rect x="12" y="9" width="16" height="13" rx="3" fill="#fff" stroke="${D}" stroke-width="1"/><path d="M16 27 L30 18" stroke="${Y}" stroke-width="2.4"/><rect x="13" y="26" width="5" height="5" fill="#9aa3b5"/>${dot(16,22)}`,
 P:`<path d="M5 22 L35 18 L35 24 L5 28 Z" fill="#cdd3dd" stroke="${S}"/><rect x="8" y="28" width="24" height="9" fill="#dfe3ea" stroke="${S}" stroke-width=".8"/><line x1="18" y1="20" x2="18" y2="12" stroke="${D}" stroke-width="1.6"/><circle cx="18" cy="11" r="2.4" fill="${D}"/><circle cx="26" cy="19.5" r="1.6" fill="#e53935"/><path d="M28 21 L33 18" stroke="${Y}" stroke-width="1.6"/>`,
 H:`<rect x="14" y="2" width="12" height="5" fill="#cdd3dd" stroke="${S}" stroke-width=".8"/><rect x="17" y="7" width="6" height="14" fill="${L}" stroke="${S}"/><rect x="15.5" y="21" width="9" height="8" fill="#b9c0cc" stroke="${S}" stroke-width=".8"/><rect x="18.5" y="29" width="3" height="8" fill="${D}"/><path d="M30 6 v26 M28 6 h4 M28 32 h4" stroke="${S}" stroke-width=".8" fill="none"/>`,
 T:`<rect x="12" y="4" width="16" height="6" fill="#cdd3dd" stroke="${S}" stroke-width=".8"/><circle cx="20" cy="23" r="12" fill="${D}"/><circle cx="20" cy="23" r="8" fill="#d5d9e2"/><circle cx="20" cy="23" r="3.4" fill="${D}"/>`,
 SS:`<path d="M4 8 H36" stroke="${S}" stroke-width="1.4"/><path d="M8 36 L30 10 M13 37 L35 11" stroke="${S}" stroke-width="1.2"/>${Array.from({length:6},(_,i)=>`<line x1="${10+i*4}" y1="${33-i*4.4}" x2="${15+i*4}" y2="${34-i*4.4}" stroke="${D}" stroke-width="1.4"/>`).join("")}<circle cx="31" cy="34" r="3" fill="${D}"/>`,
 CO:`<rect x="15" y="2" width="10" height="36" fill="${L}" stroke="${S}"/><rect x="13" y="2" width="14" height="3" fill="#b9c0cc"/><rect x="17" y="10" width="6" height="8" fill="#cdd3dd" stroke="${S}" stroke-width=".6"/><rect x="17" y="21" width="6" height="8" fill="#cdd3dd" stroke="${S}" stroke-width=".6"/>${dot(20,19.5)}`,
 AAA:`${tun(2,36)}<rect x="9" y="26" width="22" height="11" rx="1.5" fill="#dfe3ea" stroke="${S}"/><circle cx="16" cy="31.5" r="3.6" fill="none" stroke="${D}" stroke-width="1.2"/><path d="M16 28 v7 M12.5 31.5 h7" stroke="${D}" stroke-width=".9"/><rect x="22" y="28.5" width="7" height="2" fill="${B}"/><rect x="22" y="32" width="7" height="2" fill="${S}"/>`,
 HZ:`<rect x="6" y="9" width="20" height="22" rx="4" fill="#dfe3ea" stroke="${S}"/>${[[12,15],[20,15],[12,24],[20,24]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2" fill="${D}"/>`).join("")}<circle cx="16" cy="19.5" r="1.4" fill="${Y}"/><path d="M26 20 H33 Q37 20 37 25 V36" stroke="${D}" stroke-width="2.4" fill="none"/>`
};
const NOM={PBB:"Pasarela",TF:"Túnel fijo",R:"Rotonda",IT:"Túnel interior",MT:"Túnel medio",ET:"Túnel exterior",E:"Armario eléctrico",C:"Cabina",CP:"Panel de control",P:"Pupitre",H:"Elevación",T:"Traslación",SS:"Escalera de servicio",CO:"Armarios en columna",AAA:"Equipo PCA",HZ:"Convertidor 400 Hz"};
window.ZONA_SVG=SVG;
const zic=k=>`<span class="zic" title="${NOM[k]||k}" aria-hidden="true"><svg viewBox="0 0 40 40" width="30" height="30">${SVG[k]}</svg><em>${k}</em></span>`;
/* título → zona del plano (el primero que coincide) */
const MAPA=[
 [/carro de aire|carro a\/a|puerta del carro/i,"AAA"],
 [/an[aá]lisis de la ot|comprobaciones por sistema|cierre de la actuaci|^pasarela/i,"PBB"],
 [/cotejo plc|inspecci[oó]n cable|mapa de alimentaciones|sin tensi[oó]n|acometida|tierras|monof[aá]sica|24 ?vdc|plc|safety|m[oó]dulos de seguridad|anticolisi/i,"E"],
 [/c[aá]maras rcs|c[aá]maras, display|display|comunicaciones|c[aá]maras y red/i,"CP"],
 [/pupitre|setas|mandos del pupitre/i,"P"],
 [/antiatrapamiento|iluminaci|megafon/i,"IT"],
 [/port[oó]n|zapata|bumper/i,"C"],
 [/traslad|traslaci[oó]n|variador|frenos|bordes/i,"T"],
 [/sube|baja|elevaci[oó]n/i,"H"],
 [/rotonda|extensi[oó]n|finales de carrera/i,"R"],
 [/equipos de servicio|interfaz con equipos/i,"ET"],
 [/cabina|autonivel|capota|port[oó]n|zapata|bumper|señalizaci/i,"C"],
 [/escalera/i,"SS"],[/columna|cbth/i,"CO"]
];
const zonaDe=(t,tipo)=>{if(tipo=="AAA")return "AAA";if(tipo=="HZ")return "HZ";for(const[re,k] of MAPA)if(re.test(t))return k;return null};
const EMO=/^[\s\u{1F300}-\u{1FAFF}☀-➿️‍]+/u;
function pinta(){if(typeof view!="undefined"&&view!="tec")return;const app=document.getElementById("app");if(!app)return;
 app.querySelectorAll("details > summary").forEach(sm=>{if(sm.dataset.zic)return;const d=sm.parentElement;
  if(d.dataset.k=="SEG")return;/* el triángulo de seguridad se mantiene */
  const b=sm.querySelector(":scope > b");if(!b)return;
  const txt=b.textContent.replace(EMO,"").trim();const sis=d.classList.contains("sisd");
  const tipo=(d.dataset.k=="SIS"||d.dataset.k=="INS"||d.dataset.k=="COT"||d.dataset.k=="CAM"||d.classList.contains("anap"))?"":(typeof gTipo!="undefined"?gTipo:"");
  const k=zonaDe(txt,sis?(typeof gTipo!="undefined"?gTipo:""):tipo);if(!k)return;
  /* quita el emoji inicial (🎯 📹 🔍 📏 🧰) del título y el marcador 🎯 de avería relacionada */
  const t0=b.firstChild;if(t0&&t0.nodeType==3)t0.nodeValue=t0.nodeValue.replace(EMO,"");
  b.querySelectorAll(".anat").forEach(x=>{x.textContent="";x.classList.add("anadot")});
  b.insertAdjacentHTML("afterbegin",zic(k));sm.dataset.zic=1})}
const oV=vTec;vTec=function(){const r=oV.apply(this,arguments);try{pinta()}catch(e){console.warn("iconos",e)}return r};
/* cajas que se insertan después (puente, análisis…): repintar al abrir/cerrar */
document.addEventListener("toggle",()=>{try{pinta()}catch(e){}},true);
const st=document.createElement("style");st.textContent=`.zic{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 8px 0 0;line-height:1}
.zic svg{display:block;background:#f4f6fa;border:1px solid #dfe3ea;border-radius:7px}
.zic em{font-style:normal;font-size:8px;font-weight:800;color:#1e88e5;letter-spacing:.3px;margin-top:1px}
.anat.anadot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef6c00;margin-right:6px;vertical-align:middle}`;document.head.appendChild(st);
})();
