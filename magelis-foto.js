/* ===== v442: SOS · lectura de la FOTO de la Magelis con IA (función Supabase «leer-magelis», Gemini) (12/11/2026) =====
   El OCR del móvil (Tesseract) leía basura con la pantalla fotografiada en ángulo y con reflejos, y esa basura iba al análisis.
   · La foto se lee con IA: filas de ALARMAS y EVENTOS con número, texto, hora, fecha y estado.
   · Por cada número se toma su ÚLTIMO estado: «Activado» = alarma ACTIVA ahora. Solo las activas van al análisis.
     Si no hay ninguna activa (todas desactivadas) y no hay avería escrita, se usan las alarmas más recientes de la foto, avisando.
   · Si la IA no responde: OCR del móvil con la imagen realzada y quedándose solo con las líneas «nº + texto» (sin basura).
   · La foto es complementaria: la avería en campo manda. ===== */
(function(){
"use strict";
const e_=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const img2canvas=file=>new Promise((ok,ko)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{const k=Math.min(1,1800/Math.max(im.naturalWidth,im.naturalHeight));
 const c=document.createElement("canvas");c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c)};
 im.onerror=()=>{URL.revokeObjectURL(u);ko(new Error("no se pudo abrir la foto"))};im.src=u});
/* gris + contraste estirado (para el OCR de reserva) */
function realza(c){const z=document.createElement("canvas");z.width=c.width;z.height=c.height;const x=z.getContext("2d");x.drawImage(c,0,0);
 try{const d=x.getImageData(0,0,z.width,z.height),p=d.data,H=new Uint32Array(256);for(let i=0;i<p.length;i+=4){const v=(p[i]*299+p[i+1]*587+p[i+2]*114)/1000|0;p[i]=v;H[v]++}
  const n=p.length/4;let a=0,b=255,s=0;while(a<255&&(s+=H[a])<n*.02)a++;s=0;while(b>0&&(s+=H[b])<n*.02)b--;const k=b-a>30?255/(b-a):1;
  for(let i=0;i<p.length;i+=4){const v=Math.max(0,Math.min(255,(p[i]-a)*k));p[i]=p[i+1]=p[i+2]=v}x.putImageData(d,0,0)}catch(e){}return z}
const fh=f=>{const m=/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/.exec(f.fecha||""),h=/(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(f.hora||"");
 return (m?(+m[3]%100)*1e8+(+m[2])*1e6+(+m[1])*1e4:0)+(h?(+h[1])*3600+(+h[2])*60+(+(h[3]||0)):0)/10};
/* último estado de cada alarma/evento */
function resume(filas){const M=new Map();(filas||[]).forEach((f,ix)=>{if(!f||!String(f.texto||"").trim())return;const k=(f.tabla||"")+"|"+(f.cod||f.texto);
 const t=fh(f);const o=M.get(k);if(!o||t>o.t||(t==o.t&&ix<o.ix))M.set(k,{f,t,ix})});
 const L=[...M.values()].sort((a,b)=>b.t-a.t||a.ix-b.ix).map(x=>x.f);
 return {act:L.filter(f=>/^activ/i.test(f.estado||"")),des:L.filter(f=>!/^activ/i.test(f.estado||""))}}
const lin=f=>`${f.cod?f.cod+" ":""}${f.texto}`.trim();
/* v443: en la Magelis «Máquina» (off / ON remoto, autorizada…) es la PBB (pasarela), NO la máquina de aire ADX */
const pbb=t=>String(t).replace(/\bm[aá]quina\b(?!\s+(de\s+)?(aire|adx|a\/a|pca))/gi,"PBB pasarela");
async function conIA(c,set){if(typeof sb=="undefined"||!sb.functions)throw new Error("sin conexión");
 set("Leyendo la foto de la Magelis con IA…");const img=c.toDataURL("image/jpeg",.86).split(",")[1];
 const r=await Promise.race([sb.functions.invoke("leer-magelis",{body:{img,tipo:"image/jpeg"}}),new Promise((_,no)=>setTimeout(()=>no(new Error("tiempo")),60000))]);
 if(r.error||!r.data||!Array.isArray(r.data.filas))throw new Error((r.error&&r.error.message)||"sin lectura");return r.data}
async function conOCR(c,set){if(!window.Tesseract)await new Promise((ok,ko)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";s.onload=ok;s.onerror=ko;document.head.appendChild(s)});
 const w=await Tesseract.createWorker("spa",1,{logger:m=>{if(m.status=="recognizing text")set(`Leyendo la foto en el móvil… ${Math.round(m.progress*100)}%`)}});
 const r=await w.recognize(realza(c));await w.terminate();
 /* solo líneas con aspecto de alarma: «141 Esperando autorizacion remota … Activado» */
 const filas=[];String(r.data.text||"").split(/\n+/).forEach(l=>{const m=/\b(\d{2,3})\s+([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ%/.\- ]{5,60}?)(?=\s+\d{1,2}[:.]\d{2}|\s*$)/.exec(l);if(!m)return;
  const tx=m[2].replace(/\s+/g," ").trim();if((tx.match(/[a-záéíóúñ]{3,}/gi)||[]).length<2)return;
  const h=/(\d{1,2}[:.]\d{2}[:.]\d{2})/.exec(l),f=/(\d{1,2}\/\d{1,2}\/\d{2,4})/.exec(l),e=/desactiv/i.test(l)?"Desactivado":/activ/i.test(l)?"Activado":"";
  filas.push({tabla:"",cod:m[1],texto:tx,hora:h?h[1].replace(/\./g,":"):"",fecha:f?f[1]:"",estado:e})});
 return {filas,otros:"",lector:"OCR del móvil"}}
/* lee la foto y devuelve el texto de alarma para el análisis y la tabla para mostrar */
window.sosLeeFoto=async function(file,set,hayDesc){const c=await img2canvas(file);let d=null,err="";
 try{d=await conIA(c,set)}catch(e){err=String(e.message||e)}
 if(!d||!d.filas.length){try{const o=await conOCR(c,set);if(o.filas.length||!d)d=o}catch(e){if(!d)throw e}}
 const R=resume(d.filas);
 /* v443: estados de OPERACIÓN de la PBB (no son avería): «Máquina» = la PBB, off / ON remoto, autorizada, esperando autorización */
 const OPE=f=>/m[aá]quina\s+(on|off)|m[aá]quina\s+autorizad|esperando\s+autorizaci|conectada\s+esperando/i.test(f.texto||"");
 const ope=R.act.filter(OPE);let usa=R.act.filter(f=>!OPE(f)),nota="";
 if(!usa.length&&!hayDesc){const D=R.des.filter(f=>!OPE(f));usa=D.filter(f=>f.tabla!="evento").slice(0,3);if(!usa.length)usa=D.slice(0,3);
  if(usa.length)nota="En la foto no hay alarmas ACTIVAS (todas desactivadas): se analizan las más recientes."}
 /* v443: la alarma de FALLO es la que indica la avería presente en el equipo: va la primera en el análisis (activa o la más reciente) */
 const FA=[...R.act,...R.des].filter(f=>!OPE(f)&&/\bfallo\b/i.test(f.texto||""));
 if(FA.length){usa=[...FA,...usa.filter(f=>!FA.includes(f))].slice(0,3);nota=(nota?nota+" ":"")+"Prioridad: la alarma de FALLO ("+lin(FA[0])+"), que indica la avería presente en el equipo."}
 const al=[...usa.map(f=>pbb(lin(f))),pbb(d.otros||"")].filter(Boolean).join(" · ");
 const fila=f=>`<tr class="${/^activ/i.test(f.estado||"")?"mgact":""}"><td>${e_(f.cod||"")}</td><td>${e_(f.texto)}</td><td>${e_(f.hora||"")}</td><td>${e_(f.estado||"")}</td></tr>`;
 const tb=(n,L)=>L.length?`<div class="mgt">${n}</div><table class="mgtab">${L.map(fila).join("")}</table>`:"";
 const html=`<div class="mgbox"><div class="mgh">📷 Lectura de la foto de la Magelis <small>(${e_(d.lector||"")}${err&&!/^Gemini|^Claude/.test(d.lector||"")?" · IA no disponible":""})</small></div>
  ${usa.length&&usa===usa?"":""}${R.act.filter(f=>!OPE(f)).length?`<div class="mgok">🔴 Activas ahora: <b>${e_(R.act.filter(f=>!OPE(f)).map(lin).join(" · "))}</b></div>`:`<div class="mgno">Sin alarmas de avería activas en la foto (último estado: desactivado).</div>`}
  ${ope.length?`<div class="mgno">ℹ️ Estado de operación de la PBB (no es avería; «máquina» = la pasarela): <b>${e_(ope.map(lin).join(" · "))}</b></div>`:""}
  ${nota?`<div class="mgno">${e_(nota)}</div>`:""}
  <details class="mgdet"><summary>Ver todo lo leído (${d.filas.length} filas)</summary>${tb("ALARMAS",d.filas.filter(f=>f.tabla!="evento"))}${tb("EVENTOS",d.filas.filter(f=>f.tabla=="evento"))}${d.otros?`<div class="mgt">OTROS</div><div>${e_(d.otros)}</div>`:""}</details></div>`;
 window.__sosFotoHTML=html;return {al,html,filas:d.filas}};
const st=document.createElement("style");st.textContent=`.mgbox{margin:8px 0;padding:8px 10px;border:1.5px solid #1fa64a;border-radius:10px;font-size:13px}
.mgh{font-weight:800;color:#1fa64a;margin-bottom:4px}.mgh small{font-weight:600;opacity:.75}.mgok{margin:3px 0}.mgno{margin:3px 0;opacity:.85}
.mgdet>summary{cursor:pointer;font-size:12.5px;margin-top:4px}.mgt{font-weight:800;font-size:11.5px;margin:6px 0 2px;opacity:.8}
.mgtab{width:100%;border-collapse:collapse;font-size:12px}.mgtab td{padding:2px 4px;border-bottom:1px dashed var(--bd,#ccc);vertical-align:top}
.mgtab td:first-child{width:32px;font-weight:700}.mgtab td:nth-child(3){white-space:nowrap}.mgtab tr.mgact td{color:#d7191c;font-weight:800}`;document.head.appendChild(st);
})();
