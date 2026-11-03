/* ===== v44: Importar hoja de registro de OT del día (Inicio) =====
 Foto (OCR), PDF, Excel o CSV de la hoja que hoy se rellena a mano. Vale cualquier fecha (del día o antigua).
 - «Integrantes» → técnicos de la OT (se reconocen los técnicos dados de alta).
 - «Actuación», «Incidencia» u «Observaciones» → campo «Descripción de los Trabajos / Actuación» (desc).
 - Revisión editable antes de guardar; no duplica OT ya registradas (mismo nº de orden, o misma posición, fecha y hora). */
(function(){
const NORM=t=>String(t||"").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const TIPOS=["SVGA","SIGMA","PAS","AAA","AAP","AAC","AAR","HZ"];
const tipoOK=t=>{const u=NORM(t);if(/\bGU[I1L]A(DO)?\b|\bVDGS\b/.test(u))return "SVGA";const k=TIPOS.find(x=>new RegExp("\\b"+x+"\\b").test(u));return k?(k=="SIGMA"?"Sigma":k):(/\bSAI\b/.test(u)?"PAS":"")}; /* v289: GUIA = SVGA · SAI = PAS */
const isoD=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const hh=s=>{const m=/(\d{1,2})\s*[:.h]\s*(\d{2})/.exec(String(s||""));return m&&+m[1]<24&&+m[2]<60?m[1].padStart(2,"0")+":"+m[2]:""};
let R={fecha:"",turno:"",integ:"",txt:"",ocup:false,turnos:{},rows:[],zoom:1};let TEC=[];

function fechaTxt(t){const U=NORM(t);let m;
 if((m=/\b(\d{4})-(\d{2})-(\d{2})\b/.exec(U)))return `${m[1]}-${m[2]}-${m[3]}`;
 if((m=/\b(\d{1,2})\s*[\/\.\-]\s*(\d{1,2})\s*[\/\.\-]\s*(\d{2,4})\b/.exec(U))){let y=+m[3];if(y<100)y+=2000;const d=+m[1],mm=+m[2];if(d<=31&&mm<=12&&mm>0&&d>0)return isoD(new Date(y,mm-1,d))}
 const MS={ENE:0,FEB:1,MAR:2,ABR:3,MAY:4,JUN:5,JUL:6,AGO:7,SEP:8,SET:8,OCT:9,NOV:10,DIC:11};
 if((m=/\b(\d{1,2})\s*(?:DE\s*)?(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|SET|OCT|NOV|DIC)[A-Z]*\.?\s*(?:DE\s*)?(\d{4})?/.exec(U)))return isoD(new Date(m[3]?+m[3]:new Date().getFullYear(),MS[m[2]],+m[1]));
 return ""}
const turnoTxt=t=>{const U=NORM(t);return /\bNOCHE\b/.test(U)?"Noche":/\bTARDE\b/.test(U)?"Tarde":/\bMANANA\b/.test(U)?"Mañana":""};
function posDe(s,libre){const U=NORM(s).replace(/\bPBB\s*/g,"");const P=new Map((typeof POS!="undefined"?POS:[]).map(p=>[NORM(p),String(p)]));
 const re=/\b(T\s?\d{1,3}|\d{3})\b/g;let m,pri="";while((m=re.exec(U))){const k=m[1].replace(/\s/g,"");if(P.has(k))return P.get(k);if(!pri)pri=k}return libre?pri:""}
const posReg=p=>(typeof POS!="undefined"?POS:[]).some(x=>NORM(x)==NORM(p));
/* Hoja TKE: Noche 22–06, Mañana 06–14, Tarde 14–22 */
const turnoHora=h=>{if(!h)return "";const n=+h.slice(0,2);return n>=22||n<6?"Noche":n<14?"Mañana":"Tarde"};
const limpiaInteg=t=>String(t||"").replace(/\b(INTEGRANTES?|TURNO|FECHA)\b/gi,"").replace(/\b\d{1,2}\s*[\/\.\-]\s*\d{1,2}\s*[\/\.\-]\s*\d{2,4}\b/g,"").replace(/\s*[\/+&]\s*|\s+Y\s+/gi,", ").replace(/^[\s,.:;\-|]+|[\s,.:;\-|]+$/g,"").replace(/\s{2,}/g," ")
const ordenDe=s=>{const m=/\b([56]\d{2})\s?(\d{3})\b(?![:.]\d)/.exec(String(s||""));return m?m[1]+m[2]:""};
function tecsDe(t){const U=NORM(t);return TEC.filter(n=>n&&U.includes(NORM(n))).filter((n,i,a)=>a.indexOf(n)==i)}

/* --- tabla (Excel/CSV): busca la fila de cabecera por palabras clave --- */
const COL={pos:/POSICI|^PBB|^PAS$|PASARELA|PUERTA|STAND/,tipo:/^TIPO|EQUIPO|SISTEMA/,orden:/ORDEN|N.?\s*OT|^OT\b|CGA|AVISO/,hIni:/INICIO|AVISO.*HORA|H\.?\s*INI/,hLle:/LLEGADA|H\.?\s*LLE/,hCie:/CIERRE|FIN\b|FINAL|H\.?\s*FIN|RESOLU/,
 desc:/ACTUACI|INCIDENCI|OBSERV|DESCRIP|TRABAJO|AVERIA/,integ:/INTEGRANT|TECNIC|OPERARI/,fecha:/^FECHA|DIA\b/};
function deTabla(filas){let hi=-1,map={};
 for(let r=0;r<Math.min(filas.length,25);r++){const m={};filas[r].forEach((c,j)=>{const u=NORM(c).trim();if(!u)return;for(const k in COL)if(!(k in m)&&COL[k].test(u)){if(k=="desc"){(m.desc=m.desc||[]).push(j);continue}m[k]=j;break}else if(k=="desc"&&COL.desc.test(u)&&m.desc&&!m.desc.includes(j))m.desc.push(j)});
  if(("pos" in m)&&(m.desc||("orden" in m))){hi=r;map=m;break}}
 const cab=filas.slice(0,hi<0?6:hi).map(f=>f.join(" ")).join("\n");leeCab(cab);cab.split("\n").forEach(leeTurno);
 if(hi<0)return deLineas(filas.map(f=>f.join(" ")).join("\n"));
 const out=[];for(const f of filas.slice(hi+1)){const g=k=>k in map?String(f[map[k]]??"").trim():"";const pos=posDe(g("pos"),true);if(!pos)continue;
  const desc=(map.desc||[]).map(j=>String(f[j]??"").trim()).filter(Boolean).join(" · ");
  out.push({pos,tipo:tipoOK(g("tipo"))||tipoOK(desc)||"PAS",orden:ordenDe(g("orden")),hIni:hh(g("hIni")),hLle:hh(g("hLle")),hCie:hh(g("hCie")),desc,integ:g("integ"),fecha:fechaTxt(g("fecha"))})}
 return out}
/* --- texto libre (foto/PDF): una OT por línea con posición --- */
function leeCab(t){if(!R.fecha)R.fecha=fechaTxt(t);if(!R.turno)R.turno=turnoTxt(t);
 const m=/INTEGRANTES?\W{0,3}([^\n]*)/i.exec(NORM(t));const tt=tecsDe(t);if(!R.integ)R.integ=tt.length?tt.join(", "):(m?m[1].trim():"")}
/* línea de cabecera «25/10/26 NOCHE ALBERTO» / «MAÑANA RAUL/ALEX» → integrantes por turno */
function leeTurno(l){const U=NORM(l);const t=turnoTxt(U);if(!t||/\b[56]\d{5}\b/.test(U))return false;
 const tt=tecsDe(l);const resto=limpiaInteg(U.replace(/\b(NOCHE|TARDE|MANANA)\b/g," ").replace(/^\W*\d?\W*/,""));const v=tt.length?tt.join(", "):resto;if(v)R.turnos[t]=v;return true}
function deLineas(texto){leeCab(texto);const out=[];let ult=null;
 String(texto||"").split(/\r?\n/).forEach(l=>{const L=l.trim();if(!L)return;if(leeTurno(L))return;const sin=L.replace(/\b\d{1,2}[:.]\d{2}\b/g," ").replace(/\b[56]\d{5}\b/g," ");
  const ini=/^\W*(?:PBB\s*)?(T\s?\d{1,3}|\d{3})\b/i.exec(sin);const pos=(ini&&(ordenDe(L)||/\d{1,2}[:.]\d{2}/.test(L))?ini[1].replace(/\s/g,"").toUpperCase():"")||posDe(sin);
  const horas=[...L.matchAll(/\b(\d{1,2})\s*[:.h]\s*(\d{2})\b/g)].map(m=>hh(m[0])).filter(Boolean);
  if(!pos){if(ult&&L.length>3&&!/INTEGRANT|FECHA|TURNO|POSICI.*TIPO/i.test(NORM(L)))ult.desc=(ult.desc?ult.desc+" ":"")+L;return}
  let desc=L.replace(/\bPBB\b/ig,"").replace(new RegExp("\\b"+pos+"\\b"),"").replace(/\b[56]\d{5}\b/,"").replace(/\b\d{1,2}\s*[:.h]\s*\d{2}\b/g,"").replace(/\b(SVGA|SIGMA|PAS|AAA|AAP|AAC|AAR|HZ)\b/i,"").replace(/^[\s\-|·:,;.]+|[\s\-|·:,;]+$/g,"").replace(/\s{2,}/g," ");
  ult={pos,tipo:tipoOK(L)||"PAS",orden:ordenDe(L),hIni:horas[0]||"",hLle:horas[1]||"",hCie:horas[2]||"",desc,integ:"",fecha:""};out.push(ult)});
 return out}

/* --- formato de revisión: una línea por OT --- */
const aLinea=o=>[o.pos,o.tipo,o.orden||"-",[o.hIni,o.hLle,o.hCie].map(x=>x||"--").join(" "),o.desc||""].join(" | ")+(o.integ?` | ${o.integ}`:"");
function deRevision(t){const ok=[],mal=[];String(t||"").split(/\r?\n/).forEach((l,i)=>{if(!l.trim())return;const c=l.split("|").map(x=>x.trim());const pos=posDe(c[0]||"",true);
  if(!pos){mal.push(i+1);return}const hs=(c[3]||"").split(/\s+/).map(hh);
  ok.push({pos,tipo:tipoOK(c[1])||"PAS",orden:ordenDe(c[2]),hIni:hs[0]||"",hLle:hs[1]||"",hCie:hs[2]||"",desc:c[4]||"",integ:c[5]||""})});return {ok,mal}}

/* v250: correcciones tras la lectura IA · PAS solo cifras (J/S→5, l/I→1, O→0) · fecha nunca futura ni de años atrás · integrantes ajustados a los técnicos dados de alta */
function posOK(p){let u=String(p||"").toUpperCase().replace(/\s/g,"");if(/^T\d/.test(u))return u;
 const c=u.replace(/[JS]/g,"5").replace(/[LI|]/g,"1").replace(/O/g,"0").replace(/B/g,"8").replace(/Z/g,"2");return /^[\d\/-]+$/.test(c)?c:u}
function fechaOK(f){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(f||"");if(!m)return f;const hoyD=new Date(),y=hoyD.getFullYear();let a=+m[1];
 if(a!=y&&a!=y-1)a=y;let d=new Date(a,+m[2]-1,+m[3]);if(d>hoyD&&a==y)a=y-1;return a+"-"+m[2]+"-"+m[3]}
function lev(a,b){const v=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let p=v[0];v[0]=i;for(let j=1;j<=b.length;j++){const t=v[j];v[j]=Math.min(v[j]+1,v[j-1]+1,p+(a[i-1]==b[j-1]?0:1));p=t}}return v[b.length]}
function integOK(t){const L=[...new Set(TEC.map(n=>NORM(n).trim()).filter(Boolean))];if(!L.length)return t;
 return String(t||"").split(/\s*,\s*/).filter(Boolean).map(n=>{const u=NORM(n).trim();if(L.includes(u))return u;let b=null,bd=99;L.forEach(x=>{const d=lev(u,x);if(d<bd){bd=d;b=x}});return b&&bd<=Math.max(1,Math.floor(u.length/3))?b:n}).join(", ")}
/* v43: lectura de la foto con Claude (función Supabase «leer-hoja»); si no está disponible, OCR local */
/* v281: la foto va al lector con el giro del botón ⟳ (derecha se lee mejor), el móvil espera hasta 150 s (antes 120 s y se cortaba antes que el servidor)
   y los errores del servidor salen con su motivo real (cupo, modelo, tiempo) en vez de «no disponible» */
/* v289: foto preparada para la IA: escala de grises con contraste estirado (quita sombras y papel amarillento) y 2400 px de lado mayor */
function realza(z){try{const x=z.getContext("2d"),d=x.getImageData(0,0,z.width,z.height),p=d.data,H=new Uint32Array(256);
 for(let i=0;i<p.length;i+=4){const v=(p[i]*299+p[i+1]*587+p[i+2]*114)/1000|0;p[i]=v;H[v]++}
 const n=p.length/4;let a=0,b=255,c=0;while(a<255&&(c+=H[a])<n*.01)a++;c=0;while(b>0&&(c+=H[b])<n*.02)b--;if(b-a<40)return;
 const k=255/(b-a);for(let i=0;i<p.length;i+=4){const v=Math.max(0,Math.min(255,(p[i]-a)*k));p[i]=p[i+1]=p[i+2]=v}x.putImageData(d,0,0)}catch(e){}}
async function fotoIA(file){const c=await giro(file,R.giro||0);const k=Math.min(1,2400/Math.max(c.width,c.height));
 const z=document.createElement("canvas");z.width=Math.round(c.width*k);z.height=Math.round(c.height*k);z.getContext("2d").drawImage(c,0,0,z.width,z.height);realza(z);return z}
async function claudeLee(file,set){set("Analizando la hoja manuscrita línea a línea (puede tardar hasta 2 min)…");const z=await fotoIA(file);
 const img=z.toDataURL("image/jpeg",.88).split(",")[1];
 const r=await Promise.race([sb.functions.invoke("leer-hoja",{body:{img,tipo:"image/jpeg",pos:(typeof POS!="undefined"?POS:[]).map(String),tec:TEC}}),new Promise((_,no)=>setTimeout(()=>no(new Error("el lector IA tarda demasiado; prueba de nuevo")),150000))]);
 if(r.error||!r.data||!Array.isArray(r.data.ots)){let m="";const cx=r.error&&r.error.context;const st=cx&&cx.status;try{const j=cx&&await cx.clone().json();m=j&&(j.error=="sin_clave"?"sin_clave":j.mensaje)||""}catch(e){}
  if(!m&&cx){try{m=(await cx.text()).slice(0,160)}catch(e){}}
  if(st==546||/WORKER_LIMIT|wall ?clock/i.test(m))m="el servidor cortó la lectura por tiempo";else if(st==401||st==403)m="sesión caducada: cierra y vuelve a entrar en la PWA";
  else if(!m&&r.error)m=r.error.message||"";throw new Error(m||"no disponible")}
 return deIA(r.data)}
/* v289: convierte la respuesta JSON del lector (Gemini en Supabase o Claude copiado y pegado) en OT */
function deIA(d){if(!d||!Array.isArray(d.ots))throw new Error("la respuesta no tiene la lista de OT");R.lector=d.lector||R.lector||"";R.reserva=!!d.reserva;if(d.fecha&&/^\d{4}-\d{2}-\d{2}$/.test(d.fecha))R.fecha=fechaOK(d.fecha);
 (d.turnos||[]).forEach(t=>{const n=turnoTxt(t.turno);if(n&&t.integrantes)R.turnos[n]=integOK(limpiaInteg(t.integrantes))});
 const dudas=[];const ots=d.ots.filter(o=>o&&o.pos).map(o=>{if(o.dudas)dudas.push(`${o.pos}: ${o.dudas}`);return {pos:posOK(o.pos),tipo:tipoOK(o.tipo)||"PAS",orden:ordenDe(o.orden)||String(o.orden||"").replace(/\D/g,""),hIni:hh(o.hIni),hLle:hh(o.hLle),hCie:hh(o.hCie),desc:String(o.desc||"").trim(),integ:"",fecha:""}});
 ots.dudas=dudas;return ots}
async function cargaTec(){try{const r=await sb.from("tecnicos").select("nombre");TEC=(r.data||[]).map(x=>x.nombre).filter(Boolean)}catch(e){}}
function libScript(src,ok){return new Promise((res,rej)=>{if(ok()){res();return}const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("No se pudo cargar "+src));document.head.appendChild(s)})}
async function ocr(file,set){await libScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js",()=>window.Tesseract);
 const w=await Tesseract.createWorker("spa",1,{logger:m=>{if(m.status=="recognizing text")set(`Leyendo la hoja… ${Math.round(m.progress*100)}%`)}});
 try{let mejor=null;for(const g of [0,90,270]){const c=await giro(file,g);const r=await w.recognize(c);const n=deLineas(r.data.text).length;if(!mejor||n>mejor.n)mejor={n,t:r.data.text};if(n>=2)break}return mejor.t}finally{await w.terminate()}}
function giro(file,g){return new Promise((res,rej)=>{const u=URL.createObjectURL(file);const im=new Image();im.onload=()=>{const k=Math.min(1,3000/Math.max(im.width,im.height));const w=Math.round(im.width*k),h=Math.round(im.height*k);
 const c=document.createElement("canvas");const r=g%180!=0;c.width=r?h:w;c.height=r?w:h;const x=c.getContext("2d");x.translate(c.width/2,c.height/2);x.rotate(g*Math.PI/180);x.drawImage(im,-w/2,-h/2,w,h);URL.revokeObjectURL(u);res(c)};im.onerror=rej;im.src=u})}
async function pdfTxt(file){if(typeof cargaLib=="function")await cargaLib();const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;const out=[];
 for(let p=1;p<=pdf.numPages;p++){const tc=await (await pdf.getPage(p)).getTextContent();const f=new Map();tc.items.forEach(it=>{const y=Math.round(it.transform[5]/3);if(!f.has(y))f.set(y,[]);f.get(y).push([it.transform[4],it.str])});
  [...f.keys()].sort((a,b)=>b-a).forEach(y=>out.push(f.get(y).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).join("   ")))}return out.join("\n")}
async function excelFilas(file){await libScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",()=>window.XLSX);
 const wb=XLSX.read(await file.arrayBuffer(),{type:"array",cellDates:true});const out=[];wb.SheetNames.forEach(n=>XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1,raw:false,dateNF:"yyyy-mm-dd"}).forEach(f=>out.push(f.map(x=>x??""))));return out}
const csvFilas=t=>{const sep=(t.split("\n")[0].match(/;/g)||[]).length>(t.split("\n")[0].match(/,/g)||[]).length?";":",";return t.split(/\r?\n/).map(l=>l.split(sep).map(x=>x.replace(/^"|"$/g,"")))};

/* ---------- v44: pantalla de revisión: foto con zoom arriba + OT editables por filas ---------- */
const TURNOS=["Noche","Mañana","Tarde"];
const vacia=()=>({pos:"",tipo:"PAS",orden:"",hIni:"",hLle:"",hCie:"",desc:"",integ:""});
function turnoFila(k){const r=R.rows;for(let j=k;j>=0;j--){const t=turnoHora(r[j]&&r[j].hIni);if(t)return t}const f=TURNOS.filter(t=>R.turnos[t]);return f.length==1?f[0]:(R.turno||"")}
const integDef=k=>R.turnos[turnoFila(k)]||R.integ||"";
const tOpt=v=>["PAS","AAA","AAP","AAC","AAR","HZ","SVGA","Sigma"].map(t=>`<option ${t==v?"selected":""}>${t}</option>`).join("");
function filaHTML(o,k){const t=turnoFila(k);
 return `<div class="oirow" id="oir${k}"><div class="oirh"><b class="oin">${k+1}</b><span class="mu" style="font-size:12px">${t?"Turno "+t:""}</span><button class="sec oidel" aria-label="Quitar OT" onclick="otQuita(${k})">✕</button></div>
 <div class="oig3"><div><label>PAS</label><input value="${esc(o.pos)}" list="oi_pl" autocapitalize="characters" oninput="otC(${k},'pos',this.value)" class="${o.pos&&!posReg(o.pos)?"oiw":""}"></div>
 <div><label>Tipo</label><select onchange="otC(${k},'tipo',this.value)">${tOpt(o.tipo)}</select></div>
 <div><label>Nº OT</label><input value="${esc(o.orden)}" inputmode="numeric" maxlength="6" oninput="otC(${k},'orden',this.value.replace(/\\D/g,''))" class="${o.orden&&!/^\d{6}$/.test(o.orden)?"oiw":""}"></div></div>
 <div class="oig3"><div><label>H. inicio</label><input inputmode="numeric" placeholder="hh:mm" maxlength="5" value="${o.hIni}" onchange="this.value=fmtH(this.value);otC(${k},'hIni',this.value,1)"></div><div><label>H. llegada</label><input inputmode="numeric" placeholder="hh:mm" maxlength="5" value="${o.hLle}" onchange="this.value=fmtH(this.value);otC(${k},'hLle',this.value)"></div><div><label>H. final</label><input inputmode="numeric" placeholder="hh:mm" maxlength="5" value="${o.hCie}" onchange="this.value=fmtH(this.value);otC(${k},'hCie',this.value)"></div></div>
 <label>Actuación, incidencia u observaciones</label><textarea rows="2" oninput="otC(${k},'desc',this.value)">${esc(o.desc)}</textarea>
 <label>Integrantes</label><input value="${esc(o.integ)}" placeholder="${esc(integDef(k)||"Los del turno")}" list="oi_tl" oninput="otC(${k},'integ',this.value)"></div>`}
function pintaFilas(){const e=$("#oi_rows");if(e)e.innerHTML=R.rows.map(filaHTML).join("")||`<div class="mu" style="font-size:13px;padding:8px 0">Sin OT todavía. Sube la foto o añádelas a mano.</div>`;prev()}
function pintaFoto(){const e=$("#oi_foto");if(!e)return;if(!R.foto){e.style.display="none";return}e.style.display="";
 const im=$("#oi_img");im.src=R.foto;im.style.width=(R.zoom*100)+"%";im.style.transform=R.giro?`rotate(${R.giro}deg)`:"";$("#oi_zv").textContent=Math.round(R.zoom*100)+"%"}
window.otImp=async()=>{if(!(typeof admin!="undefined"&&admin)&&!(typeof tecnico!="undefined"&&tecnico)){msg("Solo técnicos y administrador importan OT");return}
 if(!TEC.length)await cargaTec();if(!R.fecha)R.fecha=hoy();if(!R.rows)R.rows=[];if(!R.zoom)R.zoom=1;
 $("#sheetc").innerHTML=`<div class="row" style="flex-wrap:nowrap"><h3 style="margin:0">Importar hoja de registro de OT</h3><button class="sec" aria-label="Cerrar" onclick="closeSheet()" style="padding:4px 12px;width:auto">✕</button></div>
 <div class="mu" style="font-size:12px">Foto, PDF, Excel o CSV de la hoja (del día o antigua). Corrige cada OT mirando la foto y guarda.</div>
 <label class="pri oifile">📷 Foto / archivo de la hoja<input type="file" hidden accept="image/*,.pdf,.csv,.txt,.xlsx,.xls" onchange="otImpFile(this.files[0])"></label>
 <div id="oi_est" class="mu" style="font-size:12px;margin-top:6px"></div>
 <div id="oi_foto" class="oifoto" style="display:none"><div class="oifb"><button class="sec" onclick="otZoom(-.5)" aria-label="Alejar">−</button><span id="oi_zv">100%</span><button class="sec" onclick="otZoom(.5)" aria-label="Acercar">+</button><button class="sec" onclick="otGiro()" aria-label="Girar foto">⟳</button><button class="sec" onclick="otFotoAlto()" aria-label="Agrandar o reducir el visor">↕</button></div><div class="oifs" id="oi_fs"><img id="oi_img" alt="Hoja de OT"></div></div>
 <div class="grid oifd"><div><label>Fecha de la hoja</label><input id="oi_f" type="date" value="${R.fecha}" onchange="otR('fecha',this.value)"></div><div><label>&nbsp;</label><button type="button" id="oi_cb" class="pri oidesc" onclick="otDescarga()">Cargar Hoja OT</button></div></div>
 <div id="oi_pg" class="oipg" hidden><div class="oipgb"><i id="oi_pgi"></i></div><span id="oi_pgt">0%</span></div>
 <details class="oicl"><summary>¿No la lee bien? Léela con Claude (gratis)</summary>
  <div class="mu" style="font-size:12px;margin:6px 0">1) Pulsa el botón: copia las instrucciones y abre «Compartir» con la foto ya preparada → elige Claude. 2) En Claude pega las instrucciones y envía. 3) Copia la respuesta de Claude, pégala abajo y pulsa «Aplicar».</div>
  <button type="button" class="sec" style="width:100%" onclick="otClaude()">📋 Copiar instrucciones y compartir la foto</button>
  <textarea id="oi_cltx" rows="3" placeholder="Pega aquí la respuesta de Claude (el bloque { … })" style="width:100%;box-sizing:border-box;margin-top:8px"></textarea>
  <button type="button" class="pri" style="width:100%;margin-top:6px" onclick="otClaudePega()">Aplicar respuesta de Claude</button>
 </details>
 <datalist id="oi_tl">${TEC.map(n=>`<option value="${esc(n)}">`).join("")}</datalist><datalist id="oi_pl">${(typeof POS!="undefined"?POS:[]).map(p=>`<option value="${esc(String(p))}">`).join("")}</datalist>
 <div class="row" style="margin-top:12px;align-items:center"><b>Añadir Registro Manual OT</b><span id="oi_prev" class="mu" style="font-size:12px"></span></div>
 <div id="oi_rows"></div>
 <button class="sec" style="margin-top:8px;width:100%" onclick="otAnade()">＋ Añadir línea OT</button>
 <button class="pri" style="margin-top:10px;width:100%" onclick="otImpGuarda()">Guardar OT en la app</button>`;
 $("#sheet").style.display="flex";pintaFoto();pintaFilas()};
window.otR=(k,v)=>{R[k]=v};
/* v248: barra de progreso de carga + OK en verde + guardado automático y vuelta al panel de control */
let pgT=null;const pgPon=(v,cls)=>{const g=$("#oi_pg"),i=$("#oi_pgi"),t=$("#oi_pgt");if(!g)return;g.hidden=false;g.className="oipg"+(cls?" "+cls:"");v=Math.max(0,Math.min(100,Math.round(v)));if(i)i.style.width=v+"%";if(t)t.textContent=cls=="ok"?"OK · 100%":v+"%"};
const pgIni=()=>{clearInterval(pgT);R.pg=0;pgPon(0);const b=$("#oi_cb");if(b){b.classList.remove("oiok");b.textContent="Cargando…";b.disabled=true}
 const t0=Date.now();pgT=setInterval(()=>{if(R.pgReal)return;const s=(Date.now()-t0)/1000;R.pg=95*(1-Math.exp(-s/14));pgPon(R.pg)},300)};
const pgFin=ok=>{clearInterval(pgT);const b=$("#oi_cb");if(ok){pgPon(100,"ok");if(b){b.disabled=false;b.classList.add("oiok");b.textContent="✓ OK"}}
 else{pgPon(R.pg||0,"ko");if(b){b.disabled=false;b.classList.remove("oiok");b.textContent="Cargar Hoja OT"}}R.pgReal=false};
/* v246: «Descargar Hoja OT» · analiza todas las líneas manuscritas de la foto y las pone como OT nuevas (una por línea) para revisarlas y guardarlas */
window.otDescarga=()=>{if(R.ocup){msg("Ya se está leyendo la hoja…");return}
 if(R.file){if(R.rows.some(o=>o.pos)&&!confirm("Se volverá a analizar la hoja y se sustituirán las líneas actuales. ¿Seguir?"))return;otImpFile(R.file);return}
 const i=document.querySelector("#sheetc .oifile input[type=file]");if(i)i.click()};
/* «831» → 08:31 · «1215» → 12:15 · «8.31» → 08:31 */
window.fmtH=v=>{const t=String(v||"").trim();if(!t)return "";const m=/^(\d{1,2})\D+(\d{2})$/.exec(t);if(m)return hh(m[1]+":"+m[2]);const d=t.replace(/\D/g,"");if(d.length==3||d.length==4)return hh(d.slice(0,-2)+":"+d.slice(-2));return t};
window.otTu=(t,v)=>{R.turnos[t]=v.trim();R.rows.forEach((o,k)=>{const i=document.querySelector(`#oir${k} input[list="oi_tl"]`);if(i)i.placeholder=integDef(k)||"Los del turno"})};
window.otC=(k,c,v,re)=>{const o=R.rows[k];if(!o)return;o[c]=c=="pos"?v.toUpperCase().replace(/\s/g,""):v;
 if(c=="pos"){const i=document.querySelector(`#oir${k} input[list="oi_pl"]`);if(i)i.classList.toggle("oiw",!!o.pos&&!posReg(o.pos))}
 if(c=="orden"){const i=document.querySelector(`#oir${k} input[maxlength="6"]`);if(i)i.classList.toggle("oiw",!!o.orden&&!/^\d{6}$/.test(o.orden))}
 if(re)pintaFilas();else prev()};
window.otQuita=k=>{R.rows.splice(k,1);pintaFilas()};
window.otAnade=()=>{R.rows.push(vacia());pintaFilas();setTimeout(()=>{const e=$("#oir"+(R.rows.length-1));if(e){e.scrollIntoView({behavior:"smooth",block:"center"});const i=e.querySelector("input");if(i)i.focus()}},50)};
window.otZoom=d=>{R.zoom=Math.max(1,Math.min(5,R.zoom+d));pintaFoto()};
window.otGiro=()=>{R.giro=((R.giro||0)+90)%360;pintaFoto();R.clFile=null;setTimeout(prepCl,50)};
window.otFotoAlto=()=>{const e=$("#oi_fs");if(e)e.classList.toggle("alto")};
function prev(){const e=$("#oi_prev");if(!e)return;const ok=R.rows.filter(o=>o.pos);const nr=[...new Set(ok.map(o=>o.pos).filter(p=>!posReg(p)))];const so=ok.filter(o=>!/^\d{6}$/.test(o.orden)).length;
 e.innerHTML=`${ok.length} OT${nr.length?` · <span style="color:#ef6c00">no dadas de alta: ${nr.join(", ")}</span>`:""}${so?` · <span style="color:#d32f2f">${so} sin nº OT válido</span>`:""}`}
/* v289: pone las OT leídas en la pantalla de revisión (común a foto, archivo y respuesta pegada de Claude) */
function ponOts(ots,nombre,set){const fs=ots.map(o=>o.fecha).filter(Boolean);if(!R.fecha&&fs.length)R.fecha=fs[0];if(!R.fecha)R.fecha=hoy();
  if(!Object.keys(R.turnos).length&&R.integ&&R.turno)R.turnos[R.turno]=R.integ;
  R.rows=ots.map(o=>({pos:o.pos,tipo:o.tipo||"PAS",orden:o.orden||"",hIni:o.hIni||"",hLle:o.hLle||"",hCie:o.hCie||"",desc:o.desc||"",integ:""}));
  const a=$("#oi_f");if(a)a.value=R.fecha;pintaFilas();
  const av=[];ots.forEach((o,k)=>{const t=[o.hIni,o.hLle,o.hCie].filter(Boolean);for(let j=1;j<t.length;j++)if(t[j]<t[j-1]){av.push(`línea ${k+1}: horas desordenadas`);break}
   if(o.orden&&!/^\d{6}$/.test(o.orden))av.push(`línea ${k+1}: nº OT de ${o.orden.length} cifras`)});
  set(ots.length?`Leída «${nombre}»${R.lector?" ("+R.lector+")":""}: ${ots.length} OT. Revisa cada una con la foto antes de guardar.${R.reserva?" ⚠️ Leída con el modelo de reserva (menos preciso): repásala con más cuidado.":""}${ots.dudas&&ots.dudas.length?" ⚠️ Dudas — "+ots.dudas.join(" · "):""}${av.length?" ⚠️ Revisar — "+av.join(" · "):""}`:`No he reconocido OT en «${nombre}». Añádelas con «＋ Añadir línea OT» mirando la foto.`);window._otOCR=ots;return ots.length}
/* v289: lectura con Claude sin API de pago: la PWA copia las instrucciones y comparte la foto con la app de Claude;
   la respuesta (JSON) se pega en la PWA y pasa por las mismas correcciones que la lectura automática */
function promptCl(){const P=(typeof POS!="undefined"?POS:[]).map(String),T=[...new Set(TEC.map(n=>NORM(n).trim()).filter(Boolean))];
 return `Lee esta foto de la hoja TKE de registro de OT (pasarelas PBB, Barajas), escrita a mano. Transcribe EXACTAMENTE lo escrito, fila a fila, sin saltarte ninguna y sin mezclar celdas de filas vecinas.
Cabecera: FECHA | TURNO (Noche, Mañana, Tarde) | INTEGRANTES (solo nombres de: ${T.join(", ")||"—"}).
Columnas de la tabla: PAS (posición, 3 cifras o dos como 504/508; posiciones dadas de alta: ${P.join(", ")}) | TIPO (PAS, AAA, AAP, AAC, AAR, HZ, SVGA, Sigma; GUIA = SVGA; SAI = PAS) | NUMERO DE OT (6 cifras, empieza por 59, 60 o 61) | H. INICIO | H. LLEGADA | H. FINAL (HH:MM) | ACTUACION, INCIDENCIA U OBSERVACIONES (transcripción literal; si sigue en otra línea o en el margen, únela a su fila).
Las notas fuera de la tabla no son OT. Si dudas de algo, pon tu mejor lectura y explícalo en "dudas".
Responde SOLO con este JSON, sin texto antes ni después:
{"fecha":"AAAA-MM-DD","turnos":[{"turno":"Noche|Mañana|Tarde","integrantes":"NOMBRE, NOMBRE"}],"ots":[{"pos":"","tipo":"","orden":"","hIni":"","hLle":"","hCie":"","desc":"","dudas":""}]}`}
async function prepCl(){if(R.clFile||!R.fotoF)return;try{const z=await fotoIA(R.fotoF);const b=await new Promise(ok=>z.toBlob(ok,"image/jpeg",.9));R.clFile=new File([b],"hoja-OT.jpg",{type:"image/jpeg"})}catch(e){}}
window.otClaude=async()=>{if(!TEC.length)await cargaTec();const t=promptCl();let cop=false;
 try{await navigator.clipboard.writeText(t);cop=true}catch(e){}
 if(!R.fotoF){msg(cop?"Instrucciones copiadas. Primero carga la foto de la hoja.":"Primero carga la foto de la hoja.");return}
 await prepCl();const f=R.clFile;
 try{if(f&&navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:"Hoja de OT"});msg(cop?"Instrucciones copiadas: pégalas en Claude junto a la foto":"Comparte la foto con Claude")}
  else{const a=document.createElement("a");a.href=URL.createObjectURL(f||R.fotoF);a.download="hoja-OT.jpg";a.click();msg(cop?"Instrucciones copiadas y foto descargada: súbela a Claude":"Foto descargada: súbela a Claude")}}
 catch(e){if(e&&e.name!="AbortError")msg("No se pudo compartir: "+(e.message||e))}
 if(!cop){const x=$("#oi_cltx");if(x){x.value=t;x.select();msg("Copia el texto del recuadro y pégalo en Claude; luego borra y pega su respuesta")}}};
window.otClaudePega=()=>{const x=$("#oi_cltx");const t=x?x.value:"";const m=t.match(/\{[\s\S]*\}/);const st=$("#oi_est");const set=v=>{if(st)st.textContent=v};
 if(!m){msg("Pega la respuesta de Claude (el bloque que empieza por { )");return}
 let d;try{d=JSON.parse(m[0])}catch(e){msg("La respuesta pegada no está completa: copia todo el bloque { … }");return}
 try{R.fecha="";R.turnos={};R.lector="Claude";const ots=deIA({...d,lector:"Claude",reserva:false});if(ponOts(ots,"respuesta de Claude",set)>0){pgPon(100,"ok");const b=$("#oi_cb");if(b){b.classList.add("oiok");b.textContent="✓ OK"}if(x)x.value="";
  const dl=document.querySelector("#sheetc details.oicl");if(dl)dl.open=false}}catch(e){msg("No se pudo aplicar: "+(e.message||e))}};
window.otImpFile=async file=>{if(!file||R.ocup)return;R.ocup=true;R.file=file;R.lector="";R.clFile=null;const st=$("#oi_est");let set=t=>{if(st)st.textContent=t;const m=/(\d{1,3})%/.exec(t||"");if(m&&/lector local|Leyendo la hoja…/.test(t)){R.pgReal=true;pgPon(+m[1])}};pgIni();let okN=0;R.fecha="";R.turno="";R.integ="";R.turnos={};
 if(/^image\//.test(file.type)&&file!==R.fotoF){if(R.foto)URL.revokeObjectURL(R.foto);R.foto=URL.createObjectURL(file);R.fotoF=file;R.zoom=1;R.giro=0;pintaFoto()}R.clFile=null;setTimeout(prepCl,50); /* v281: al recargar la misma foto se conserva el giro */
 try{const n=file.name.toLowerCase();let ots=[];
  if(/^image\//.test(file.type)){try{ots=await claudeLee(file,set)}catch(e){const sc=/sin_clave/.test(e&&e.message||"");
   /* v249: con letra a mano el lector local lee basura: no se usa ni se guarda nada; se reintenta con «Cargar Hoja OT» */
   R.ocup=false;pgFin(false);set((sc?"⚠️ Falta la clave del lector IA en Supabase.":"⚠️ No se ha podido leer la hoja: "+(e&&e.message||e))+" No se ha guardado nada. Vuelve a pulsar «Cargar Hoja OT» en unos minutos.");return}}
  else if(n.endsWith(".pdf")){set("Leyendo PDF…");ots=deLineas(await pdfTxt(file))}
  else if(/\.xlsx?$/.test(n)){set("Leyendo Excel…");ots=deTabla(await excelFilas(file))}
  else{const t=await file.text();ots=t.includes(";")||t.includes(",")?deTabla(csvFilas(t)):deLineas(t)}
  okN=ponOts(ots,file.name,set)}
 catch(e){set("Error al leer el archivo: "+(e.message||e))}finally{R.ocup=false;pgFin(okN>0&&R.rows.some(o=>o.pos));
  if(okN>0&&R.rows.some(o=>o.pos))setTimeout(()=>{R.auto=true;try{otImpGuarda()}finally{R.auto=false}},1200)}};
window.otImpGuarda=async()=>{const ok=R.rows.filter(o=>o.pos);if(!ok.length){msg("No hay OT que importar");return}
 const sinH=ok.filter(o=>!o.hIni).length;if(sinH&&!R.auto&&!confirm(`${sinH} OT sin hora de inicio. ¿Guardar igualmente?`))return;
 const f=R.fecha||hoy();let n=0,dup=0;const base=Date.now();
 R.rows.forEach((o,k)=>{if(!o.pos)return;const ya=inc.some(i=>(o.orden&&String(i.orden)==o.orden)||(i.pos==o.pos&&i.fecha==f&&o.hIni&&i.hIni==o.hIni));if(ya){dup++;return}
  const integ=(o.integ||integDef(k)).trim();const tu=turnoFila(k);const cerr=!!o.hCie||f<hoy();
  inc.unshift({id:String(base+k),pos:o.pos,tipo:o.tipo,equipos:[o.tipo],orden:o.orden,rep:"CGA",desc:o.desc.trim(),hIni:o.hIni,hLle:o.hLle,hCie:o.hCie,act:"",obs:"",fecha:f,estado:cerr?"cerrada":"abierta",
   turno:tu||undefined,tecnico:integ||undefined,integrantes:integ||undefined,origen:"hoja importada"});n++});
 sv("pbb_inc",inc);closeSheet();if(R.foto)URL.revokeObjectURL(R.foto);R={fecha:"",turno:"",integ:"",txt:"",ocup:false,turnos:{},rows:[],zoom:1};msg(`${n} OT importada${n==1?"":"s"}${dup?` · ${dup} ya existía${dup==1?"":"n"}`:""}`);go("dash");setTimeout(()=>{try{window.scrollTo({top:0,behavior:"smooth"});const m=document.querySelector("main");if(m)m.scrollTop=0}catch(e){}},80)};

/* botón en Inicio */
(function(){const o=render;render=function(){const r=o.apply(this,arguments);
 if(view=="dash"&&typeof user!="undefined"&&user&&((typeof admin!="undefined"&&admin)||(typeof tecnico!="undefined"&&tecnico))&&!document.getElementById("oibtn")){
  const g=[...document.querySelectorAll("#app .grid")][1];const b=document.createElement("button");b.id="oibtn";b.className="btn oibtn";b.onclick=()=>otImp();
  b.innerHTML=`<span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 18v-6M9 15l3 3 3-3"/></svg></span>Importar hoja de OT`;
  if(g)g.insertAdjacentElement("afterend",b);else{const a=document.getElementById("app");if(a)a.prepend(b)}}
 return r}})();
(function(){const st=document.createElement("style");st.textContent=`.oibtn{width:100%;margin:0 0 10px!important}.oifoto{position:sticky;top:-14px;z-index:3;background:var(--card);margin:10px -4px 4px;padding:6px 4px;border-bottom:1px solid var(--bd)}
.oifb{display:flex;gap:6px;align-items:center;margin-bottom:6px}.oifb button{width:auto!important;margin:0!important;padding:5px 12px!important;font-size:16px}.oifb span{font-size:12px;color:var(--mu);min-width:40px;text-align:center}
.oifs{max-height:34vh;overflow:auto;border-radius:8px;border:1px solid var(--bd);background:#fff;-webkit-overflow-scrolling:touch}.oifs.alto{max-height:60vh}.oifs img{display:block;max-width:none;transform-origin:center}
.oig3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.oig3 input,.oig3 select{min-width:0;width:100%;box-sizing:border-box}
.oirow{border:1px solid var(--bd);border-radius:10px;padding:8px 10px;margin-top:8px;background:var(--card)}.oirh{display:flex;align-items:center;gap:8px}.oin{background:var(--pr);color:#fff;border-radius:999px;min-width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:12px}
.oidel{margin-left:auto!important;width:auto!important;padding:3px 10px!important;color:#d32f2f!important;border-color:#d32f2f!important}.oiw{border-color:#ef6c00!important;background:color-mix(in srgb,#ef6c00 8%,transparent)!important}
.oirow textarea{width:100%;box-sizing:border-box}
.oifd{align-items:end}.oidesc.oiok{background:#2e7d32!important;border-color:#2e7d32!important;color:#fff!important}.oidesc:disabled{opacity:.85}
.oipg{display:flex;align-items:center;gap:8px;margin-top:8px}.oipg[hidden]{display:none}.oipgb{flex:1;height:10px;border-radius:999px;background:var(--bd,#2a2f38);overflow:hidden}
.oipgb i{display:block;height:100%;width:0;background:var(--ac,#ff7a1a);border-radius:999px;transition:width .3s}.oipg.ok .oipgb i{background:#2e7d32}.oipg.ko .oipgb i{background:#d32f2f}
.oipg span{min-width:64px;text-align:right;font:700 12px/1 system-ui,sans-serif;color:var(--mu,#8a93a3)}.oipg.ok span{color:#43a047}.oipg.ko span{color:#e53935}.oifd>div{min-width:0}.oidesc{width:100%!important;margin:0!important;padding:12px 6px!important;font-weight:700;white-space:nowrap;font-size:14px}
.oicl{margin-top:10px;border:1px solid var(--bd);border-radius:10px;padding:8px 10px}.oicl>summary{cursor:pointer;font-weight:700;font-size:13px}
.oifile{display:flex!important;justify-content:center;align-items:center;margin-top:12px;padding:12px;border-radius:10px;cursor:pointer;font-weight:700}`;document.head.appendChild(st)})();
window._otTest={deLineas,deTabla,deRevision,R:()=>R};
})();
