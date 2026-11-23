/* ===== v471: INFORME PDF DE CIERRE · QR DE CADA PBB · MODO MANOS LIBRES (15/11/2026) =====
   · 📄 Informe: en cada OT de Seguimiento OT, PDF A4 con datos, horas, actuación, medidas tomadas, resolución de Claude y foto PLC,
     listo para CGA / AENA (descargar o compartir).
   · 🔳 QR: el administrador imprime un QR por posición (pegatina en la pasarela / armario). Al escanearlo con la cámara del
     móvil se abre la PWA en esa PBB: OT abiertas, historial, SOS y Registrar OT con la posición ya puesta.
   · 🔊 Manos libres (SOS): la app lee en voz alta la primera actuación y los pasos de REPARAR; botones grandes y, si el móvil
     lo permite, órdenes de voz «siguiente», «anterior», «repite», «para». ===== */
(function(){
"use strict";
const E=s=>typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fh=f=>{const m=String(f||"").match(/^(\d{4})-(\d\d)-(\d\d)/);return m?`${m[3]}/${m[2]}/${m[1]}`:String(f||"")};
/* =================== INFORME PDF =================== */
window.otInforme=function(id){const o=(typeof inc!="undefined"?inc:[]).find(x=>x.id==id);if(o)return otInformeDe(o)};
window.otInformeDe=async function(o){if(!o)return;
 try{await cargaJsPDF()}catch(e){msg("No se pudo cargar el generador de PDF (sin conexión)");return}
 const {jsPDF}=window.jspdf;const d=new jsPDF({unit:"mm",format:"a4"});const W=210,M=14;let y=16;
 const nl=h=>{if(y+h>285){d.addPage();y=16}};
 const tit=t=>{nl(12);d.setFillColor(255,106,19);d.rect(M,y-5,W-2*M,8,"F");d.setTextColor(255);d.setFont("helvetica","bold");d.setFontSize(11);d.text(t,M+2,y);d.setTextColor(20);y+=7};
 const txt=(t,sz)=>{d.setFont("helvetica","normal");d.setFontSize(sz||10);d.splitTextToSize(String(t||"").replace(/[#*`]/g,"").replace(/[^\x00-\xFF€·→✓✗]/g,""),W-2*M).forEach(l=>{nl(5);d.text(l,M,y);y+=4.6})};
 const kv=(k,v)=>{nl(6);d.setFont("helvetica","bold");d.setFontSize(10);d.text(k,M,y);d.setFont("helvetica","normal");d.splitTextToSize(String(v||"-"),W-2*M-42).forEach((l,i)=>{if(i)nl(5);d.text(l,M+42,y);y+=4.8})};
 d.setFont("helvetica","bold");d.setFontSize(16);d.text("INFORME DE ACTUACIÓN · PBB "+o.pos,M,y);y+=6;d.setFont("helvetica","normal");d.setFontSize(9);d.setTextColor(90);
 d.text("TK Elevator · Pasarelas de embarque · Aeropuerto Adolfo Suárez Madrid-Barajas · generado "+new Date().toLocaleString("es-ES"),M,y);d.setTextColor(20);y+=8;
 tit("DATOS DE LA ORDEN DE TRABAJO");kv("Posición","PBB "+o.pos);kv("Tipo",(o.equipos&&o.equipos.length?o.equipos.join(", "):o.tipo)||"-");kv("Nº orden CGA",o.orden);kv("Fecha",fh(o.fecha));
 kv("Estado",o.estado=="abierta"?(o.espera?"Espera de condiciones":"Abierta"):"Cerrada");kv("Horas","Inicio "+(o.hIni||"--:--")+" · Llegada "+(o.hLle||"--:--")+" · Cierre "+(o.hCie||"--:--"));
 try{const tc=(typeof tecs!="undefined"&&tecs)||null;if(o.tec||o.integrantes)kv("Técnicos",o.tec||o.integrantes)}catch(e){}
 tit("AVISO / DESCRIPCIÓN");txt(o.desc||"-");y+=2;
 if(o.act||o.actuacion){tit("ACTUACIÓN REALIZADA");txt(o.act||o.actuacion);y+=2}
 if(o.obs){tit("OBSERVACIONES");txt(o.obs);y+=2}
 if(o.verif){const V=[["led","LED del PLC en reposo"],["alarma","Alarma reseteada (Magelis)"],["maniobra","Maniobra completa en Remoto"],["puentes","Puentes retirados"]].filter(([k])=>k in o.verif);
  if(V.length){tit("COMPROBACIONES ANTES DEL CIERRE");V.forEach(([k,t])=>txt(`${o.verif[k]?"[SÍ]":"[NO]"} ${t}`,9));y+=2}}
 if(o.medidas&&o.medidas.length){tit("MEDIDAS TOMADAS EN CAMPO");o.medidas.forEach(m=>{txt(`${m.ok?"[OK]":"[FUERA]"} ${m.v} (esperado ${m.esp}) · ${m.paso}`,9)});y+=2}
 if(o.resClaude&&o.resClaude.txt){tit("ANÁLISIS TÉCNICO (Claude)");txt(String(o.resClaude.txt).slice(0,6000),8.5);y+=2}
 if(o.plc){try{nl(95);tit("FOTO DEL PLC");const im=new Image();im.src=o.plc;await im.decode();const w=W-2*M,h=Math.min(120,w*im.height/im.width);nl(h+4);d.addImage(o.plc,"JPEG",M,y,w*(h/(w*im.height/im.width)),h);y+=h+4}catch(e){}}
 nl(20);y+=6;d.setFontSize(9);d.text("Firma técnico: ______________________",M,y);d.text("Conforme CGA / AENA: ______________________",W/2,y);
 const nom=`Informe_PBB${o.pos}_${o.orden||o.id}_${o.fecha||""}.pdf`.replace(/[^\w.-]+/g,"_");const blob=d.output("blob");
 try{const f=new File([blob],nom,{type:"application/pdf"});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:nom});return}}catch(e){if(e&&e.name=="AbortError")return}
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=nom;document.body.appendChild(a);a.click();a.remove()};
/* =================== PBB por QR =================== */
const posQR=()=>{const m=String(location.hash||"").match(/pbb=([A-Z0-9]+)/i);return m?m[1].toUpperCase():""};
window.pbbFicha=function(pos){if(!pos)return;const L=(typeof inc!="undefined"?inc:[]).filter(x=>String(x.pos).toUpperCase()==pos).sort((a,b)=>String(b.fecha).localeCompare(String(a.fecha)));
 const ab=L.filter(x=>x.estado=="abierta");
 $("#sheetc").innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">🔳 PBB ${E(pos)}</h3><button class="sec" onclick="closeSheet()" style="width:auto;margin:0">✕</button></div>
 <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px;margin:10px 0"><button class="pri" onclick="pbbSOS('${pos}')">🆘 SOS en esta PBB</button><button class="sec" onclick="pbbNueva('${pos}')">📝 Registrar OT</button></div>
 <h4 style="margin:8px 0 4px">OT abiertas (${ab.length})</h4>${ab.map(x=>`<div class="pbq">${fh(x.fecha)} · ${E(x.tipo)} · ${E(x.desc||"")}</div>`).join("")||'<div class="mu">Ninguna.</div>'}
 <h4 style="margin:10px 0 4px">Historial (${L.length})</h4>${L.slice(0,15).map(x=>`<div class="pbq">${fh(x.fecha)} · ${E(x.tipo)} · ${E(x.desc||"")}${x.act?`<div class="mu" style="font-size:12px">✔ ${E(String(x.act).slice(0,160))}</div>`:""}</div>`).join("")||'<div class="mu">Sin OT registradas.</div>'}`;
 $("#sheet").style.display="flex"};
window.pbbSOS=function(pos){closeSheet();sosRap();setTimeout(()=>{const p=document.getElementById("sr_p");if(p){p.value=pos;p.dispatchEvent(new Event("input",{bubbles:true}))}const o=document.getElementById("sr_ob");if(o)o.focus()},150)};
window.pbbNueva=function(pos){closeSheet();go("new");setTimeout(()=>{const n=document.getElementById("f_posn");if(n){n.value=pos;n.dispatchEvent(new Event("input",{bubbles:true}));n.dispatchEvent(new Event("change",{bubbles:true}))}},150)};
let qrHecho=false;const qrMira=()=>{try{if(qrHecho)return;const p=posQR();if(!p)return;if(typeof user=="undefined"||!user||typeof inc=="undefined")return;qrHecho=true;
 history.replaceState(null,"",location.pathname+location.search);setTimeout(()=>pbbFicha(p),400)}catch(e){}};
setInterval(qrMira,1000);window.addEventListener("hashchange",()=>{qrHecho=false;qrMira()});
const cargaQR=()=>new Promise((ok,ko)=>{if(window.qrcode)return ok();const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js";s.onload=ok;s.onerror=ko;document.head.appendChild(s)});
window.qrPBB=async function(){try{await cargaQR()}catch(e){msg("No se pudo cargar el generador de QR (sin conexión)");return}
 const L=(typeof POS!="undefined"?POS:[]).map(String);const base=location.origin+location.pathname;
 const svg=p=>{const q=qrcode(0,"M");q.addData(base+"#pbb="+p);q.make();return q.createSvgTag({cellSize:4,margin:2,scalable:true})};
 /* v472: dentro de la propia app (en el iPhone la ventana nueva no se podía cerrar) con ✕ Cerrar e 🖨 Imprimir */
 let o=document.getElementById("qrv");if(o)o.remove();o=document.createElement("div");o.id="qrv";
 o.innerHTML=`<div class="qrtool"><button type="button" onclick="print()">🖨 Imprimir</button><button type="button" onclick="document.getElementById('qrv').remove()">✕ Cerrar</button></div>
 <div class="qrg">${L.map(p=>`<div class="qrc">${svg(p)}<b>PBB ${p}</b><small>TKE · escanear para abrir la app</small></div>`).join("")}</div>`;
 ["click","dblclick","touchend"].forEach(t=>o.addEventListener(t,e=>e.stopPropagation()));document.body.appendChild(o)};
/* =================== MANOS LIBRES =================== */
let V=null;
const pasosSOS=()=>{const out=[];const b1=document.querySelector("#sr_res .ubb1");if(b1){const t=(b1.querySelector(".pucab")||{}).textContent;if(t)out.push("Primera actuación. "+t);b1.querySelectorAll(".qkp,.puac").forEach(x=>{const s=x.textContent.trim();if(s&&!out.includes(s))out.push(s)})}
 const h=document.querySelector("#lp_res .lpaef h3");if(h)out.push("Reparar. "+h.textContent);document.querySelectorAll("#lp_res .lpap").forEach(x=>{const c=x.cloneNode(true);c.querySelectorAll(".medw,details,button,select").forEach(z=>z.remove());const s=c.textContent.replace(/\s+/g," ").trim();if(s)out.push(s)});
 return out.map(s=>s.replace(/→/g,", luego ").replace(/\bE-/g,"E ").replace(/\bP-/g,"P ").replace(/·/g,","))};
/* v838: lectura más rápida (1,15) y sin cortes:
   · el texto se trocea por frases (iOS y Chrome cortan las locuciones largas a los ~15 s) y se encadena;
   · se guardan las locuciones (si el recolector las borra, no llega «onend» y la lectura se queda muda);
   · mientras habla la app, el micrófono IGNORA lo que oye (antes se oía a sí misma: un «para», «vale» o «hecho» del texto paraba o saltaba el paso);
   · los comandos solo valen dichos solos (frase corta), y el reconocimiento se relanza siempre que iOS lo cierra. */
const trozos=t=>{const out=[];String(t).split(/(?<=[.;:!?])\s+/).forEach(f=>{f=f.trim();if(!f)return;
 while(f.length>180){let k=f.lastIndexOf(",",180);if(k<60)k=f.lastIndexOf(" ",180);if(k<60)k=180;out.push(f.slice(0,k+1).trim());f=f.slice(k+1).trim()}if(f)out.push(f)});return out};
/* v839: sin símbolos ni iconos; los códigos (IT-B11, E-A2 3.1, X1:3, KM2, PLC…) se deletrean */
const LET={A:"a",B:"be",C:"ce",D:"de",E:"e",F:"efe",G:"ge",H:"hache",I:"i",J:"jota",K:"ka",L:"ele",M:"eme",N:"ene","Ñ":"eñe",O:"o",P:"pe",Q:"cu",R:"erre",S:"ese",T:"te",U:"u",V:"uve",W:"uve doble",X:"equis",Y:"i griega",Z:"zeta"};
const deletrea=c=>c.replace(/([A-ZÑ])/g," $1 ").replace(/[A-ZÑ]/g,x=>LET[x]||x).replace(/(\d)\.(\d)/g,"$1 punto $2").replace(/:/g," dos puntos ").replace(/\//g," barra ").replace(/[-_]/g," ").replace(/\s+/g," ").trim();
const esCodigo=w=>{const l=w.replace(/[^A-ZÑa-zñ]/g,"");if(!l||l!==l.toUpperCase())return false;
 if(/\d/.test(w))return true;            /* letras y números: IT-B11, X1, KM2 */
 if(/[-:\/]/.test(w))return true;        /* IT-B, E-A */
 return l.length<=3||!/[AEIOU]/.test(l)};/* siglas: PBB, PLC, SAI, HZ */
const limpiaVoz=t=>String(t)
 .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu," ")
 .replace(/[▶◀▲▼►◄▸▾•●○■□★☆✓✔✕✖✗→←↑↓⇒⟶*#|~^_`<>{}\[\]]/g," ").replace(/\s*·\s*/g,", ")
 .replace(/(\d)\s*(V|Vcc|Vdc|Vac)(?![\p{L}\d])/gu,"$1 voltios").replace(/(\d)\s*mA(?![\p{L}\d])/gu,"$1 miliamperios").replace(/(\d)\s*Hz(?![\p{L}\d])/giu,"$1 hercios")
 .replace(/(?<![\p{L}\d])[\p{L}\d](?:[\p{L}\d.:\/-]*[\p{L}\d])?(?![\p{L}\d])/gu,w=>esCodigo(w)?deletrea(w):w)
 .replace(/\b(\d+)\.(\d+)\b/g,"$1 punto $2")
 .replace(/\s+([,.;:])/g,"$1").replace(/([,.;:]){2,}/g,"$1").replace(/\s+/g," ").trim();
const habla=()=>{if(!V)return;try{speechSynthesis.cancel()}catch(e){}const t=V.p[V.i];if(!t)return;
 const id=(V.tok=(V.tok||0)+1);const T=trozos(`Paso ${V.i+1} de ${V.p.length}. ${limpiaVoz(t)}`);V.u=[];V.hablando=true;
 T.forEach((x,k)=>{const u=new SpeechSynthesisUtterance(x);u.lang="es-ES";u.rate=1.09;/* v839: 5 % más lenta */
  u.onend=u.onerror=()=>{if(V&&V.tok===id&&k===T.length-1){V.hablando=false;V.fin=Date.now()}};V.u.push(u);speechSynthesis.speak(u)});
 /* Chrome Android: pausa/reanuda para que no se corte a los 15 s */
 clearInterval(V.ka);V.ka=setInterval(()=>{if(!V||!V.hablando)return;try{if(speechSynthesis.speaking&&!speechSynthesis.paused&&!/iPhone|iPad|Mac/.test(navigator.userAgent)){speechSynthesis.pause();speechSynthesis.resume()}if(!speechSynthesis.speaking&&!speechSynthesis.pending){V.hablando=false;V.fin=Date.now()}}catch(e){}},5000);
 pintaV()};
const mlEscucha=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR||!V)return;
 try{const r=new SR();r.lang="es-ES";r.continuous=true;r.interimResults=false;r.maxAlternatives=1;
  r.onresult=e=>{if(!V||V.rec!==r)return;if(V.hablando||Date.now()-(V.fin||0)<600)return;
   const t=(e.results[e.results.length-1][0].transcript||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-zñ ]/g,"").trim();
   if(!t||t.split(/\s+/).length>3)return;
   if(/^(siguiente|sigue|avanza|vale|hecho|ok|listo)\b/.test(t))mlMueve(1);else if(/^(anterior|atras|vuelve)\b/.test(t))mlMueve(-1);else if(/^(repite|otra vez|repetir)\b/.test(t))mlMueve(0);else if(/^(para|parar|stop|termina|salir|fin)$/.test(t))mlPara()};
  r.onend=()=>{if(V&&V.rec===r)setTimeout(()=>{if(V&&V.rec===r)mlEscucha()},300)};
  r.onerror=ev=>{if(ev&&/not-allowed|service-not-allowed/.test(ev.error)&&V){V.rec=null;pintaV()}};
  V.rec=r;r.start()}catch(e){}};
function pintaV(){let o=document.getElementById("mlib");if(!V){if(o)o.remove();return}if(!o){o=document.createElement("div");o.id="mlib";document.body.appendChild(o)}
 o.innerHTML=`<div class="mlt">🔊 Manos libres · paso ${V.i+1}/${V.p.length}${V.rec?' · 🎙 di «siguiente», «anterior», «repite» o «para»':""}</div><div class="mlx">${E(V.p[V.i]||"")}</div>
 <div class="mlb"><button onclick="mlMueve(-1)">◀</button><button onclick="mlMueve(0)">🔁</button><button onclick="mlMueve(1)">▶</button><button onclick="mlPara()">✕</button></div>`}
window.mlMueve=d=>{if(!V)return;V.i=Math.max(0,Math.min(V.p.length-1,V.i+d));habla()};
window.mlPara=()=>{const r=V&&V.rec;if(V){clearInterval(V.ka);V.rec=null}try{speechSynthesis.cancel()}catch(e){}try{r&&r.stop()}catch(e){}V=null;pintaV()};
window.manosLibres=function(){if(!("speechSynthesis" in window)){msg("Este móvil no permite leer en voz alta");return}const p=pasosSOS();if(!p.length){msg("Primero pulsa ACEPTAR para tener la actuación");return}
 if(V)mlPara();V={p,i:0};mlEscucha();habla()};
/* =================== botones =================== */
const pon=()=>{try{
 /* v474: «Imprimir QR» solo en modo Administrador */
 const qb=document.getElementById("qrBtn");if(qb&&!(typeof admin!="undefined"&&admin))qb.remove();
 if(typeof view!="undefined"&&view=="track"&&typeof admin!="undefined"&&admin){const c=[...document.querySelectorAll("#app>.card")].find(x=>/Seguimiento OT/i.test((x.querySelector("h3")||{}).textContent||""));
  if(c&&!c.querySelector("#qrBtn")){const b=document.createElement("button");b.id="qrBtn";b.type="button";b.className="sec";b.textContent="🔳 Imprimir QR de las PBB";b.style.cssText="width:100%;margin-top:8px;font-weight:700";b.onclick=()=>qrPBB();c.appendChild(b)}}
 /* v475: el Cierre CGA cabe ENTERO en la pantalla: las tres horas en una fila, botones más bajos y el de Claude compacto */
 {const sc0=document.getElementById("sheetc");const bc0=sc0&&sc0.querySelector('button[onclick^="cerrar("]');
  if(bc0&&!sc0.dataset.cie){sc0.dataset.cie=1;sc0.classList.add("ciec");
   const labs=[...sc0.querySelectorAll(":scope>label")].filter(l=>/^hora/i.test(l.textContent.trim()));
   if(labs.length>=2){const g=document.createElement("div");g.className="cieh";labs[0].before(g);
    labs.forEach(l=>{const box=l.nextElementSibling;const c=document.createElement("div");c.className="ciehc";
     l.textContent=l.textContent.replace(/^hora\s*(de\s*|final de\s*)?/i,"").replace(/\*.*$/,"*").replace(/^./,x=>x.toUpperCase());c.appendChild(l);if(box&&!/^LABEL$/.test(box.tagName))c.appendChild(box);g.appendChild(c)})}
   const ca=[...sc0.querySelectorAll(":scope>button")].find(b=>/Cancelar/i.test(b.textContent));const inf0=sc0.querySelector(".infcie");}}
 /* v474: «📄 Informe de la OT» solo en el Cierre CGA, entre Observaciones y «Cerrar OT» */
 const sc=document.getElementById("sheetc");if(sc&&!sc.querySelector(".infcie")){const bc=sc.querySelector('button[onclick^="cerrar("],button[onclick^="acGuarda("]');
  if(bc){const id=((bc.getAttribute("onclick")||"").match(/\(\s*'([^']+)'/)||[])[1];if(id){const b=document.createElement("button");b.type="button";b.className="sec infcie";b.textContent="📄 Informe de la OT (PDF)";
   b.onclick=e=>{e.stopPropagation();const g=x=>(document.getElementById(x)||{}).value;const o=inc.find(z=>z.id==id);if(o){const t={...o};if(g("r_a")!=null)t.act=g("r_a");if(g("r_o")!=null)t.obs=g("r_o");if(g("r_i"))t.hIni=g("r_i");if(g("r_l"))t.hLle=g("r_l");if(g("r_c"))t.hCie=g("r_c");try{const vc=document.querySelector("#sheetc .vchk");if(vc){const v={};vc.querySelectorAll("input").forEach(x=>v[x.dataset.k]=x.checked);t.verif=v}}catch(e){}otInformeDe(t)}};bc.before(b)}}}
 const h2=document.querySelector("#sr_res .ub2");if(h2&&!h2.querySelector(".mlbt")){const b=document.createElement("button");b.type="button";b.className="mlbt";b.innerHTML=window.__mlIco+"<span>Manos libres</span>";b.onclick=e=>{e.stopPropagation();manosLibres()};h2.appendChild(b)}
}catch(e){}};
let tm=null;new MutationObserver(()=>{if(!tm)tm=setTimeout(()=>{tm=null;pon()},250)}).observe(document.documentElement,{childList:true,subtree:true});
const st=document.createElement("style");st.textContent=`
/* velocidad: respuesta inmediata al toque (sin espera de doble toque del navegador) */
html{touch-action:manipulation}
#qrv{position:fixed;inset:0;z-index:100000;background:#fff;color:#111;overflow:auto;-webkit-overflow-scrolling:touch;padding:0 10px 30px}
.qrtool{position:sticky;top:0;display:flex;gap:8px;padding:max(10px,env(safe-area-inset-top)) 0 10px;background:#fff;z-index:1}
.qrtool button{flex:1;margin:0!important;padding:12px!important;font-size:16px!important;font-weight:800;border-radius:10px;border:2px solid #111!important;background:#fff!important;color:#111!important}
.qrg{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.qrc{border:1px dashed #999;padding:6px;text-align:center;break-inside:avoid}
.qrc svg{width:100%;height:auto;max-width:38mm}.qrc b{display:block;font-size:14px;margin-top:3px}.qrc small{font-size:8px;color:#555}
@media print{body>*:not(#qrv){display:none!important}#qrv{position:static;overflow:visible;padding:0}.qrtool{display:none}.qrg{gap:6mm}.qrc svg{width:38mm;height:38mm}}
.infcie{width:100%!important;margin-top:12px!important;font-weight:800}
#sheet>#sheetc.ciec{max-height:96dvh!important;padding-top:10px!important}
.ciec h3{font-size:16px}.ciec>label{margin-top:6px!important}
.cieh{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.ciehc{min-width:0}.ciehc>label{margin:6px 0 2px!important;font-size:11px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ciehc input{font-size:15px!important;padding:8px 6px!important;min-height:0!important}.ciehc .hrow{flex-direction:column!important;gap:4px!important}.ciehc .hrow>input{width:100%!important;flex:none!important;margin:0!important}.ciehc .hrow>.hq{font-size:16px!important}
.ciec textarea#r_a{min-height:64px!important;height:64px}.ciec textarea#r_o{min-height:46px!important;height:46px}
.ciec .infcie{margin-top:8px!important;padding:8px!important}.ciec button.pri{margin-top:8px!important;padding:10px!important}.ciec>button.sec{margin-top:6px!important;padding:8px!important}
.ciec>button#r_cl{padding:6px!important;min-height:0!important;margin-top:8px!important}.ciec>button#r_cl img{max-height:30px!important;height:30px!important;width:auto!important}
.pbq{font-size:13px;padding:5px 0;border-bottom:1px dashed rgba(127,127,127,.35)}
.ub2{position:relative}.mlbt{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:auto!important;margin:0!important;padding:4px 9px!important;font-size:12px!important;background:rgba(255,255,255,.22)!important;color:#fff!important;border:1px solid rgba(255,255,255,.55)!important;border-radius:8px}
#mlib{position:fixed;left:8px;right:8px;bottom:max(12px,env(safe-area-inset-bottom));z-index:99990;background:#111827;color:#fff;border-radius:14px;padding:10px;box-shadow:0 6px 24px rgba(0,0,0,.4)}
.mlt{font-size:12px;opacity:.85;margin-bottom:4px}.mlx{font-size:16px;line-height:1.35;max-height:30vh;overflow:auto}
.mlb{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px}.mlb button{margin:0!important;padding:14px 0!important;font-size:22px!important;border-radius:10px;background:#374151!important;color:#fff!important;border:0!important}`;
document.head.appendChild(st);
})();

/* ===== v835: botón «Manos libres» ajustado a la altura de la caja del título y con icono de ondas a trazo blanco ===== */
window.__mlIco='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v4M9 21h6"/><path d="M3 8.5v5M21 8.5v5"/></svg>'; /* v836: icono de dictado por voz (micrófono con ondas) */
(function(){const st=document.createElement("style");st.textContent=`
#sr_res .ub2 .mlbt{top:5px!important;bottom:5px!important;right:6px!important;transform:none!important;height:auto!important;min-height:0!important;max-height:none!important;
 box-sizing:border-box;display:inline-flex!important;align-items:center;gap:6px;padding:0 10px!important;line-height:1!important;font-size:12.5px!important;font-weight:700!important;
 background:rgba(255,255,255,.18)!important;border:1.5px solid rgba(255,255,255,.7)!important;border-radius:9px!important;box-shadow:none!important;white-space:nowrap}
#sr_res .ub2 .mlbt svg{flex:none;display:block;width:20px;height:20px;filter:drop-shadow(0 0 1px rgba(0,0,0,.35))}`;document.head.appendChild(st);
 new MutationObserver(()=>{document.querySelectorAll("#sr_res .ub2 .mlbt").forEach(b=>{if(!b.querySelector("svg")||b.dataset.ico!="837"){b.dataset.ico="837";b.innerHTML=window.__mlIco+"<span>Manos libres</span>"}})}).observe(document.body,{childList:true,subtree:true})})();
