/* ===== v41: Importar hoja de registro de OT del día (Inicio) =====
 Foto (OCR), PDF, Excel o CSV de la hoja que hoy se rellena a mano. Vale cualquier fecha (del día o antigua).
 - «Integrantes» → técnicos de la OT (se reconocen los técnicos dados de alta).
 - «Actuación», «Incidencia» u «Observaciones» → campo «Descripción de los Trabajos / Actuación» (desc).
 - Revisión editable antes de guardar; no duplica OT ya registradas (mismo nº de orden, o misma posición, fecha y hora). */
(function(){
const NORM=t=>String(t||"").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const TIPOS=["SVGA","SIGMA","PAS","AAA","AAP","AAC","AAR","HZ"];
const tipoOK=t=>{const u=NORM(t);const k=TIPOS.find(x=>new RegExp("\\b"+x+"\\b").test(u));return k?(k=="SIGMA"?"Sigma":k):""};
const isoD=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const hh=s=>{const m=/(\d{1,2})\s*[:.h]\s*(\d{2})/.exec(String(s||""));return m&&+m[1]<24&&+m[2]<60?m[1].padStart(2,"0")+":"+m[2]:""};
let R={fecha:"",turno:"",integ:"",txt:"",ocup:false};let TEC=[];

function fechaTxt(t){const U=NORM(t);let m;
 if((m=/\b(\d{4})-(\d{2})-(\d{2})\b/.exec(U)))return `${m[1]}-${m[2]}-${m[3]}`;
 if((m=/\b(\d{1,2})\s*[\/\.\-]\s*(\d{1,2})\s*[\/\.\-]\s*(\d{2,4})\b/.exec(U))){let y=+m[3];if(y<100)y+=2000;const d=+m[1],mm=+m[2];if(d<=31&&mm<=12&&mm>0&&d>0)return isoD(new Date(y,mm-1,d))}
 const MS={ENE:0,FEB:1,MAR:2,ABR:3,MAY:4,JUN:5,JUL:6,AGO:7,SEP:8,SET:8,OCT:9,NOV:10,DIC:11};
 if((m=/\b(\d{1,2})\s*(?:DE\s*)?(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|SET|OCT|NOV|DIC)[A-Z]*\.?\s*(?:DE\s*)?(\d{4})?/.exec(U)))return isoD(new Date(m[3]?+m[3]:new Date().getFullYear(),MS[m[2]],+m[1]));
 return ""}
const turnoTxt=t=>{const U=NORM(t);return /\bNOCHE\b/.test(U)?"Noche":/\bTARDE\b/.test(U)?"Tarde":/\bMANANA\b/.test(U)?"Mañana":""};
function posDe(s){const U=NORM(s).replace(/\bPBB\s*/g,"");const P=new Map((typeof POS!="undefined"?POS:[]).map(p=>[NORM(p),String(p)]));
 const re=/\b(T\s?\d{1,3}|\d{3})\b/g;let m;while((m=re.exec(U))){const k=m[1].replace(/\s/g,"");if(P.has(k))return P.get(k)}return ""}
const ordenDe=s=>{const m=/\b([56]\d{2})\s?(\d{3})\b(?![:.]\d)/.exec(String(s||""));return m?m[1]+m[2]:""};
function tecsDe(t){const U=NORM(t);return TEC.filter(n=>n&&U.includes(NORM(n))).filter((n,i,a)=>a.indexOf(n)==i)}

/* --- tabla (Excel/CSV): busca la fila de cabecera por palabras clave --- */
const COL={pos:/POSICI|^PBB|PASARELA|PUERTA|STAND/,tipo:/^TIPO|EQUIPO|SISTEMA/,orden:/ORDEN|N.?\s*OT|^OT\b|CGA|AVISO/,hIni:/INICIO|AVISO.*HORA|H\.?\s*INI/,hLle:/LLEGADA|H\.?\s*LLE/,hCie:/CIERRE|FIN\b|FINAL|H\.?\s*FIN|RESOLU/,
 desc:/ACTUACI|INCIDENCI|OBSERV|DESCRIP|TRABAJO|AVERIA/,integ:/INTEGRANT|TECNIC|OPERARI/,fecha:/^FECHA|DIA\b/};
function deTabla(filas){let hi=-1,map={};
 for(let r=0;r<Math.min(filas.length,25);r++){const m={};filas[r].forEach((c,j)=>{const u=NORM(c).trim();if(!u)return;for(const k in COL)if(!(k in m)&&COL[k].test(u)){if(k=="desc"){(m.desc=m.desc||[]).push(j);continue}m[k]=j;break}else if(k=="desc"&&COL.desc.test(u)&&m.desc&&!m.desc.includes(j))m.desc.push(j)});
  if(("pos" in m)&&(m.desc||("orden" in m))){hi=r;map=m;break}}
 const cab=filas.slice(0,hi<0?6:hi).map(f=>f.join(" ")).join("\n");leeCab(cab);
 if(hi<0)return deLineas(filas.map(f=>f.join(" ")).join("\n"));
 const out=[];for(const f of filas.slice(hi+1)){const g=k=>k in map?String(f[map[k]]??"").trim():"";const pos=posDe(g("pos"));if(!pos)continue;
  const desc=(map.desc||[]).map(j=>String(f[j]??"").trim()).filter(Boolean).join(" · ");
  out.push({pos,tipo:tipoOK(g("tipo"))||tipoOK(desc)||"PAS",orden:ordenDe(g("orden")),hIni:hh(g("hIni")),hLle:hh(g("hLle")),hCie:hh(g("hCie")),desc,integ:g("integ"),fecha:fechaTxt(g("fecha"))})}
 return out}
/* --- texto libre (foto/PDF): una OT por línea con posición --- */
function leeCab(t){if(!R.fecha)R.fecha=fechaTxt(t);if(!R.turno)R.turno=turnoTxt(t);
 const m=/INTEGRANTES?\W{0,3}([^\n]*)/i.exec(NORM(t));const tt=tecsDe(t);if(!R.integ)R.integ=tt.length?tt.join(", "):(m?m[1].trim():"")}
function deLineas(texto){leeCab(texto);const out=[];let ult=null;
 String(texto||"").split(/\r?\n/).forEach(l=>{const L=l.trim();if(!L)return;const pos=posDe(L.replace(/\b\d{1,2}[:.]\d{2}\b/g," ").replace(/\b[56]\d{5}\b/g," "));
  const horas=[...L.matchAll(/\b(\d{1,2})\s*[:.h]\s*(\d{2})\b/g)].map(m=>hh(m[0])).filter(Boolean);
  if(!pos){if(ult&&L.length>3&&!/INTEGRANT|FECHA|TURNO|POSICI.*TIPO/i.test(NORM(L)))ult.desc=(ult.desc?ult.desc+" ":"")+L;return}
  let desc=L.replace(/\bPBB\b/ig,"").replace(new RegExp("\\b"+pos+"\\b"),"").replace(/\b[56]\d{5}\b/,"").replace(/\b\d{1,2}\s*[:.h]\s*\d{2}\b/g,"").replace(/\b(SVGA|SIGMA|PAS|AAA|AAP|AAC|AAR|HZ)\b/i,"").replace(/^[\s\-|·:,;]+|[\s\-|·:,;]+$/g,"").replace(/\s{2,}/g," ");
  ult={pos,tipo:tipoOK(L)||"PAS",orden:ordenDe(L),hIni:horas[0]||"",hLle:horas[1]||"",hCie:horas[2]||"",desc,integ:"",fecha:""};out.push(ult)});
 return out}

/* --- formato de revisión: una línea por OT --- */
const aLinea=o=>[o.pos,o.tipo,o.orden||"-",[o.hIni,o.hLle,o.hCie].map(x=>x||"--").join(" "),o.desc||""].join(" | ")+(o.integ?` | ${o.integ}`:"");
function deRevision(t){const ok=[],mal=[];String(t||"").split(/\r?\n/).forEach((l,i)=>{if(!l.trim())return;const c=l.split("|").map(x=>x.trim());const pos=posDe(c[0]||"");
  if(!pos){mal.push(i+1);return}const hs=(c[3]||"").split(/\s+/).map(hh);
  ok.push({pos,tipo:tipoOK(c[1])||"PAS",orden:ordenDe(c[2]),hIni:hs[0]||"",hLle:hs[1]||"",hCie:hs[2]||"",desc:c[4]||"",integ:c[5]||""})});return {ok,mal}}

async function cargaTec(){try{const r=await sb.from("tecnicos").select("nombre");TEC=(r.data||[]).map(x=>x.nombre).filter(Boolean)}catch(e){}}
function libScript(src,ok){return new Promise((res,rej)=>{if(ok()){res();return}const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("No se pudo cargar "+src));document.head.appendChild(s)})}
async function ocr(file,set){await libScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js",()=>window.Tesseract);
 const w=await Tesseract.createWorker("spa",1,{logger:m=>{if(m.status=="recognizing text")set(`Leyendo la hoja… ${Math.round(m.progress*100)}%`)}});
 try{let mejor=null;for(const g of [0,90,270]){const c=await giro(file,g);const r=await w.recognize(c);const n=deLineas(r.data.text).length;if(!mejor||n>mejor.n)mejor={n,t:r.data.text};if(n>=2)break}return mejor.t}finally{await w.terminate()}}
function giro(file,g){return new Promise((res,rej)=>{const u=URL.createObjectURL(file);const im=new Image();im.onload=()=>{const k=Math.min(1,2600/Math.max(im.width,im.height));const w=Math.round(im.width*k),h=Math.round(im.height*k);
 const c=document.createElement("canvas");const r=g%180!=0;c.width=r?h:w;c.height=r?w:h;const x=c.getContext("2d");x.translate(c.width/2,c.height/2);x.rotate(g*Math.PI/180);x.drawImage(im,-w/2,-h/2,w,h);URL.revokeObjectURL(u);res(c)};im.onerror=rej;im.src=u})}
async function pdfTxt(file){if(typeof cargaLib=="function")await cargaLib();const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;const out=[];
 for(let p=1;p<=pdf.numPages;p++){const tc=await (await pdf.getPage(p)).getTextContent();const f=new Map();tc.items.forEach(it=>{const y=Math.round(it.transform[5]/3);if(!f.has(y))f.set(y,[]);f.get(y).push([it.transform[4],it.str])});
  [...f.keys()].sort((a,b)=>b-a).forEach(y=>out.push(f.get(y).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).join("   ")))}return out.join("\n")}
async function excelFilas(file){await libScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",()=>window.XLSX);
 const wb=XLSX.read(await file.arrayBuffer(),{type:"array",cellDates:true});const out=[];wb.SheetNames.forEach(n=>XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:false,dateNF:"yyyy-mm-dd"}).forEach(f=>out.push(f.map(x=>x??""))));return out}
const csvFilas=t=>{const sep=(t.split("\n")[0].match(/;/g)||[]).length>(t.split("\n")[0].match(/,/g)||[]).length?";":",";return t.split(/\r?\n/).map(l=>l.split(sep).map(x=>x.replace(/^"|"$/g,"")))};

window.otImp=async()=>{if(!(typeof admin!="undefined"&&admin)&&!(typeof tecnico!="undefined"&&tecnico)){msg("Solo técnicos y administrador importan OT");return}
 if(!TEC.length)await cargaTec();if(!R.fecha)R.fecha=hoy();
 $("#sheetc").innerHTML=`<div class="row" style="flex-wrap:nowrap"><h3 style="margin:0">Importar hoja de registro de OT</h3><button class="sec" aria-label="Cerrar" onclick="closeSheet()" style="padding:4px 12px;width:auto">✕</button></div>
 <div class="mu" style="font-size:12px">Sube la foto, PDF, Excel o CSV de la hoja de OT del día (sirve también una hoja antigua). Revisa el resultado antes de guardar.</div>
 <label class="pri oifile">📄 Foto / archivo de la hoja<input type="file" hidden accept="image/*,.pdf,.csv,.txt,.xlsx,.xls" onchange="otImpFile(this.files[0])"></label>
 <div id="oi_est" class="mu" style="font-size:12px;margin-top:6px"></div>
 <div class="grid"><div><label>Fecha de la hoja</label><input id="oi_f" type="date" value="${R.fecha}" onchange="otR('fecha',this.value)"></div>
 <div><label>Turno</label><select id="oi_t" onchange="otR('turno',this.value)">${["","Mañana","Tarde","Noche"].map(t=>`<option ${t==R.turno?"selected":""} value="${t}">${t||"—"}</option>`).join("")}</select></div></div>
 <label>Integrantes (técnicos)</label><input id="oi_i" value="${esc(R.integ)}" placeholder="Ej. RAUL MARTIN, TÉCNICO 20" oninput="otR('integ',this.value)" list="oi_tl"><datalist id="oi_tl">${TEC.map(n=>`<option value="${esc(n)}">`).join("")}</datalist>
 <label>OT reconocidas · una por línea: posición | tipo | nº orden | inicio llegada cierre | descripción de los trabajos</label>
 <textarea id="oi_txt" rows="9" style="font-family:ui-monospace,monospace;font-size:12.5px" oninput="otR('txt',this.value)" placeholder="528 | PAS | 596500 | 08:10 08:20 09:05 | Fallo autonivelación, ajuste sensores">${esc(R.txt)}</textarea>
 <div id="oi_prev" class="mu" style="font-size:12px;margin-top:4px"></div>
 <button class="pri" style="margin-top:10px;width:100%" onclick="otImpGuarda()">Guardar OT en la app</button>`;
 $("#sheet").style.display="flex";prev()};
window.otR=(k,v)=>{R[k]=v;if(k=="txt")prev()};
function prev(){const e=$("#oi_prev");if(!e)return;const{ok,mal}=deRevision(R.txt);e.innerHTML=ok.length?`${ok.length} OT listas para importar${mal.length?` · <span style="color:#d32f2f">líneas sin posición válida: ${mal.join(", ")}</span>`:""}`:""}
window.otImpFile=async file=>{if(!file||R.ocup)return;R.ocup=true;const st=$("#oi_est");const set=t=>{if(st)st.textContent=t};R.fecha="";R.turno="";R.integ="";
 try{const n=file.name.toLowerCase();let ots=[];
  if(/^image\//.test(file.type)){set("Leyendo la foto… (la primera vez descarga el lector)");ots=deLineas(await ocr(file,set))}
  else if(n.endsWith(".pdf")){set("Leyendo PDF…");ots=deLineas(await pdfTxt(file))}
  else if(/\.xlsx?$/.test(n)){set("Leyendo Excel…");ots=deTabla(await excelFilas(file))}
  else{const t=await file.text();ots=t.includes(";")||t.includes(",")?deTabla(csvFilas(t)):deLineas(t)}
  const fs=ots.map(o=>o.fecha).filter(Boolean);if(!R.fecha&&fs.length)R.fecha=fs[0];if(!R.fecha)R.fecha=hoy();
  if(!R.integ){const t=ots.map(o=>o.integ).filter(Boolean);if(t.length)R.integ=[...new Set(t)].join(", ")}
  R.txt=ots.map(o=>aLinea({...o,integ:o.integ&&o.integ!=R.integ?o.integ:""})).join("\n");
  const a=$("#oi_f"),b=$("#oi_t"),c=$("#oi_i"),d=$("#oi_txt");if(a)a.value=R.fecha;if(b)b.value=R.turno;if(c)c.value=R.integ;if(d)d.value=R.txt;prev();
  set(ots.length?`Leída «${file.name}»: ${ots.length} OT. Revisa y corrige antes de guardar.`:`No he encontrado OT con posición en «${file.name}». Escríbelas en el cuadro o prueba con una foto más nítida y recta.`);window._otOCR=ots}
 catch(e){set("Error al leer el archivo: "+(e.message||e))}finally{R.ocup=false}};
window.otImpGuarda=async()=>{const{ok,mal}=deRevision(R.txt);if(!ok.length){msg("No hay OT que importar");return}
 if(mal.length&&!confirm(`${mal.length} línea(s) sin posición válida se ignorarán. ¿Importar el resto?`))return;
 const f=R.fecha||hoy();let n=0,dup=0;const base=Date.now();
 ok.forEach((o,k)=>{const ya=inc.some(i=>(o.orden&&String(i.orden)==o.orden)||(i.pos==o.pos&&i.fecha==f&&o.hIni&&i.hIni==o.hIni));if(ya){dup++;return}
  const integ=o.integ||R.integ;const cerr=!!o.hCie||f<hoy();
  inc.unshift({id:String(base+k),pos:o.pos,tipo:o.tipo,equipos:[o.tipo],orden:o.orden,rep:"CGA",desc:o.desc,hIni:o.hIni,hLle:o.hLle,hCie:o.hCie,act:"",obs:"",fecha:f,estado:cerr?"cerrada":"abierta",
   turno:R.turno||undefined,tecnico:integ||undefined,integrantes:integ||undefined,origen:"hoja importada"});n++});
 sv("pbb_inc",inc);closeSheet();R={fecha:"",turno:"",integ:"",txt:"",ocup:false};msg(`${n} OT importada${n==1?"":"s"}${dup?` · ${dup} ya existía${dup==1?"":"n"}`:""}`);go("dash")};

/* botón en Inicio */
(function(){const o=render;render=function(){const r=o.apply(this,arguments);
 if(view=="dash"&&typeof user!="undefined"&&user&&((typeof admin!="undefined"&&admin)||(typeof tecnico!="undefined"&&tecnico))&&!document.getElementById("oibtn")){
  const g=[...document.querySelectorAll("#app .grid")][1];const b=document.createElement("button");b.id="oibtn";b.className="btn oibtn";b.onclick=()=>otImp();
  b.innerHTML=`<span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 18v-6M9 15l3 3 3-3"/></svg></span>Importar hoja de OT`;
  if(g)g.insertAdjacentElement("afterend",b);else{const a=document.getElementById("app");if(a)a.prepend(b)}}
 return r}})();
(function(){const st=document.createElement("style");st.textContent=`.oibtn{width:100%;margin:0 0 10px!important}.oifile{display:flex!important;justify-content:center;align-items:center;margin-top:12px;padding:12px;border-radius:10px;cursor:pointer;font-weight:700}`;document.head.appendChild(st)})();
window._otTest={deLineas,deTabla,deRevision};
})();
