/* ===== v351: SOS · ACTUACIÓN DIRECTA · consulta a Claude en SEGUNDO PLANO y PDF A4 incrustado =====
 Al pulsar «Aceptar · analizar con Claude» ya no se abre claude.ai: en la misma pantalla del SOS aparece una barra de progreso
 y la consulta se hace por la función de Supabase «consulta-sos» (Claude; reserva Gemini si no hay clave de Claude).
 Fases: 1) documentación: guía de campo, comprobaciones por sistema, sistemas auxiliares, primera actuación, casos parecidos
 y las páginas de los planos del bucket «planos» que mejor encajan con lo detectado (texto por página en la tabla kb_paginas;
 la primera vez se extrae del PDF y queda guardado para todos) · 2) respuesta en streaming (progreso real) ·
 3) PDF A4 con jsPDF, incrustado en la pantalla del SOS (páginas dibujadas con pdf.js) con Descargar / Abrir / Compartir.
 Si hay una OT abierta en esa posición, la respuesta se pasa además a su zona «Resolución Claude» (datos.resClaude).
 La consulta sigue aunque se cierre la hoja: al volver a abrir el SOS se ve el progreso o el PDF terminado. */
(function(){
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const cmp=s=>String(s||"").toUpperCase().replace(/[\s']/g,"");
const html2txt=h=>{const d=document.createElement("div");d.innerHTML=h||"";d.querySelectorAll("button,svg,img,style,script").forEach(x=>x.remove());return (d.innerText||d.textContent||"").replace(/\n{3,}/g,"\n\n").trim()};
let ST=null; /* estado de la consulta en curso / última terminada */

/* ---------- términos de búsqueda ---------- */
const STOP=new Set("para pero como esta este esto estos estas desde hasta sobre entre cuando donde porque tiene tienen hace hacer hacia solo sola sido sera ser estan estado otra otro otras otros cada todo toda todos todas misma mismo muy mas menos tambien segun sino ante bajo aqui alli entonces luego despues antes ademas cual cuales quien orden aviso posicion turno tecnico averia favor funciona detectado campo pasarela detecta queda sigue".split(" "));
const SIN={telefon:["telefon","timbre","h-h3"],megafon:["megafon","altavoz"],ilumin:["ilumin","foco"],luz:["ilumin","foco"],luces:["ilumin","foco","flash"],sube:["subir","elevac","valvul","bomba"],subir:["elevac","valvul","bomba"],baja:["bajar","bajada","valvul"],bajar:["bajada","valvul"],trasla:["trasla","variador","freno"],avanza:["trasla","variador"],camara:["camara","switch"],seta:["seta","emergen"],reloj:["reloj"],capota:["capota"],porton:["porton"],zapata:["zapata"],brazo:["brazo","autonivel"],autoniv:["autonivel","brazo"],puerta:["puerta","inductiv"],aire:["pcair","a/a"],hidrau:["hidrau","bomba","valvul"],cabina:["cabina"],rotonda:["rotonda","barrera"],antiatr:["antiatrap"],sirena:["sirena"],magelis:["display","cp-a1"],pantalla:["display","cp-a1"],display:["display","cp-a1"],sai:["sai","cbth-x12"],tension:["alimentac","24vdc"]};
function terminos(t){const T=String(t||""),out=new Map();
 (T.toUpperCase().match(/\b[A-Z]{1,5}\d?'{0,2}-[A-Z]{1,3}\d{1,3}(?:\.\d{1,2})?\b/g)||[]).forEach(c=>out.set("C:"+cmp(c),{c:cmp(c),w:4}));
 nrm(T).split(/[^a-z0-9/]+/).forEach(w=>{if(w.length<4||/^\d+$/.test(w)||STOP.has(w))return;const r=w.slice(0,Math.min(w.length,6));
  if(!out.has(r))out.set(r,{r,w:1});Object.keys(SIN).forEach(k=>{if(w.startsWith(k))SIN[k].forEach(s=>{if(!out.has(s))out.set(s,{r:s,w:.8})})})});
 return [...out.values()].slice(0,60)}
function puntua(txtN,txtC,T,idf){let p=0;for(const t of T){let n=0;
  if(t.c){let i=-1;while((i=txtC.indexOf(t.c,i+1))>=0&&n<5)n++}else{let i=-1;while((i=txtN.indexOf(t.r,i+1))>=0&&n<5)n++}
  if(n)p+=t.w*(idf?idf(t):1)*(1+Math.log(n))}return p}

/* ---------- planos: texto por página (tabla kb_paginas) ---------- */
const KB={};
async function listaPlanos(){try{if(typeof gLista=="function")return await gLista()}catch(e){}try{return await allPdf()}catch(e){return []}}
async function paginas(f,av){if(KB[f.id])return KB[f.id];
 try{const q=await sb.from("kb_paginas").select("pag,txt").eq("doc",f.id).order("pag");if(!q.error&&q.data&&q.data.length){KB[f.id]=q.data;return q.data}}catch(e){}
 av(`Indexando ${f.name} (primera vez)…`,0);
 let blob=typeof gCache!="undefined"&&gCache[f.id];
 if(!blob){const dl=await sb.storage.from("planos").download(f.id);if(dl.error)throw dl.error;blob=dl.data;try{gCache[f.id]=blob}catch(e){}}
 await cargaLib();const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await blob.arrayBuffer())}).promise;const out=[];
 for(let n=1;n<=pdf.numPages;n++){const pg=await pdf.getPage(n);const tc=await pg.getTextContent();
  out.push({pag:n,txt:tc.items.map(x=>x.str).filter(s=>s&&s.trim()).join("\n")});av(`Indexando ${f.name} · página ${n}/${pdf.numPages}`,n/pdf.numPages)}
 KB[f.id]=out;
 try{for(let k=0;k<out.length;k+=15)await sb.from("kb_paginas").upsert(out.slice(k,k+15).map(x=>({doc:f.id,pag:x.pag,txt:x.txt})))}catch(e){}
 return out}
function elige(pos,tipo,txt){const n=nrm(txt),P=String(pos||"").toUpperCase(),D=[];
 if(tipo=="AAA")D.push({re:/AAA_504|rdx_1520/i,top:8});
 else if(tipo=="HZ"){D.push({re:/PDS_400/i,top:6});D.push({re:/OPERA/i,todo:1})}
 else if(tipo!="AAP"){
  D.push({re:/^(504|508)$/.test(P)?/T87911031260|^PBB_504/i:P=="507"?/T87911031230|Esquema_507/i:/T87911031210|Rev_J|T4T4S/i,top:8,ind:1,prin:1});
  D.push({re:/PLC_RCS/i,todo:1,max:26000});
  if(/hidra|aceite|presion|bomba|valvul|limitador|no sube|no baja|cilindro/.test(n))D.push({re:/hidr/i,top:4});
  if(/laser|lazer|radar|\bala\b/.test(n))D.push({re:/Laser/i,todo:1});
  if(/\bsai\b|\bct\b|centro de transf/.test(n))D.push({re:/Listado_de_Ct/i,todo:1});
  if(/^(504|508)$/.test(P)&&/cbth/.test(n))D.push({re:/Armario_CBTH_POS_504/i,top:3})}
 return D}
async function planosCtx(pos,tipo,txt,av){const L=await listaPlanos(),T=terminos(txt),D=elige(pos,tipo,txt),usados=[];let out="",tot=0;const CAP=75000;
 for(const d of D){const f=L.find(x=>d.re.test(x.name)&&!/\.(jpe?g|png|webp)$/i.test(x.name));if(!f)continue;
  let P;try{P=await paginas(f,av)}catch(e){continue}if(!P||!P.length)continue;
  let sel;
  if(d.todo){sel=P}else{
   const N=P.map(p=>({p,n:nrm(p.txt),c:cmp(p.txt)}));
   const idf=t=>{const df=N.filter(x=>t.c?x.c.includes(t.c):x.n.includes(t.r)).length;return Math.log(1+N.length/(1+df))};
   const sc=N.map(x=>({p:x.p,s:puntua(x.n,x.c,T,idf)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,d.top).map(x=>x.p);
   const ind=d.ind?P.filter(p=>p.pag<=6&&/INDICE/i.test(p.txt)):[];
   sel=[...new Map([...ind,...sc].map(p=>[p.pag,p])).values()].sort((a,b)=>a.pag-b.pag)}
  let bl=`\n##### PLANO: ${f.name}${d.prin?" (plano de cotejo de la PBB "+pos+")":""}\n`;const pags=[];
  for(const p of sel){let t=p.txt.length>9000?p.txt.slice(0,9000)+"\n[…]":p.txt;if(d.max&&bl.length+t.length>d.max)break;if(tot+bl.length+t.length>CAP)break;bl+=`=== Pág. ${p.pag} ===\n${t}\n`;pags.push(p.pag)}
  if(pags.length){out+=bl;tot+=bl.length;usados.push({n:f.name,p:pags})}}
 return {txt:out,usados}}

/* ---------- guía de campo de la app ---------- */
function guiaCtx(tipo,txt){const T=terminos(txt),sc=s=>puntua(nrm(s),cmp(s),T),o=[];
 try{if(typeof GUIA!="undefined"){o.push("##### GUÍA DE CAMPO · seguridad\n"+(GUIA.seg||[]).map((x,k)=>`${k+1}. ${x}`).join("\n"));
  if(tipo=="PAS"||!tipo){o.push("##### Mapa de alimentaciones\n"+(GUIA.alim||[]).map(a=>`[${a[0]}]\n${a[1]}`).join("\n"));
   o.push("##### LED del PLC en reposo (encendidos / apagados)\n"+(GUIA.leds||[]).map(l=>`${l[0]}: encendidos ${l[1]} · apagados ${l[2]}`).join("\n"))}
  const S=((GUIA.tipos||{})[tipo||"PAS"]||{}).s||[];
  const R=S.map(s=>({s,v:sc(s.t+" "+(s.p||[]).join(" "))})).sort((a,b)=>b.v-a.v);
  o.push("##### Procedimientos de la guía (índice)\n"+S.map(s=>"- "+s.t).join("\n"));
  R.filter(x=>x.v>0).slice(0,8).forEach(({s})=>o.push(`##### Guía · ${s.t}${s.r?" ("+s.r+")":""}\n`+(s.p||[]).map((p,k)=>`${k+1}. ${p}`).join("\n")))}}catch(e){}
 try{const SI=(window.SIS||{})[tipo||"PAS"]||[];SI.map(x=>({x,v:sc(x.s+" "+x.c.join(" "))})).filter(z=>z.v>0).sort((a,b)=>b.v-a.v).slice(0,7)
  .forEach(({x})=>o.push(`##### Comprobaciones por sistema · ${x.s}${x.f?" (folio "+x.f.join(", ")+")":""}\n`+x.c.map(c=>"- "+(typeof c=="string"?c:(c.t||JSON.stringify(c)))).join("\n")))}catch(e){}
 try{(window.SIS_GUIA||[]).map(x=>({x,v:sc(x.t+" "+(x.p||[]).join(" "))})).filter(z=>z.v>0).sort((a,b)=>b.v-a.v).slice(0,4)
  .forEach(({x})=>o.push(`##### Sistemas auxiliares · ${x.t}${x.r?" ("+x.r+")":""}\n`+(x.p||[]).map((p,k)=>`${k+1}. ${p}`).join("\n")))}catch(e){}
 return o.join("\n\n")}
function primeraCtx(pos,txt){try{const ot={id:"sosia",pos,tipo:"PAS",equipos:["PAS"],estado:"abierta",desc:txt,def:"",com:"",obs:"",orden:"SOS",fecha:""};
 let h="";const P=typeof puentesOT=="function"?puentesOT(ot):[],S=typeof segOT=="function"?segOT(ot):null,R=typeof resetAplica=="function"&&resetAplica(ot);
 if(R&&!S&&typeof resetHTML=="function")h+=resetHTML(ot);if(S&&typeof segHTML=="function")h+=segHTML(ot,S);if(P.length&&typeof puenteHTML=="function")h+=puenteHTML(ot,P);
 const t=html2txt(h);return t?"##### Primera actuación de la guía (puente provisional / seguridades)\n"+t:""}catch(e){return ""}}
async function casosCtx(txt){if(typeof casosParecidos!="function")return "";let l=[];try{l=await casosParecidos(txt,{max:3})}catch(e){}
 return l.length?"##### Casos anteriores parecidos (carpeta Casos)\n"+l.map(({d})=>`- ${d.titulo||""} · PBB ${d.pos||"-"} · ${d.tipo||""}\n  ${JSON.stringify(d.registro||{}).replace(/[{}"]/g," ").slice(0,900)}${d.notas?"\n  Notas: "+d.notas:""}`).join("\n"):""}

/* ---------- interfaz: barra de progreso y visor ---------- */
const css=document.createElement("style");css.textContent=`#sr_ia{margin-top:10px}
.sia{border:2px solid var(--ac,#ff6f00);border-radius:12px;padding:10px;background:var(--card,#fff)}
.siah{display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}.siah img{height:20px}.siah span{flex:1}
.siab{height:12px;border-radius:6px;background:rgba(127,127,127,.18);overflow:hidden;margin:8px 0 4px}
.siab>i{display:block;height:100%;width:0;border-radius:6px;background:linear-gradient(90deg,var(--pr,#5b2a86),var(--ac,#ff6f00));transition:width .4s ease}
.sia.err .siab>i{background:#c62828}.siam{display:flex;justify-content:space-between;font-size:12px}.siat{font-size:12px;margin-top:4px;white-space:pre-wrap;max-height:3.6em;overflow:hidden;opacity:.75}
.siaot{margin:10px 0 2px;padding:9px 10px;border:2px solid #2e7d32;border-radius:10px;background:rgba(46,125,50,.08);font-size:13px}.siaot b{color:#2e7d32}.siaot button{margin:8px 0 0!important;width:100%}
.siabt{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.siabt>*{flex:1 1 30%;margin:0!important;padding:9px 6px!important;font-size:13px!important;text-align:center;text-decoration:none;box-sizing:border-box}
.siav{margin-top:8px;background:#6b6b6b;border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow:auto;-webkit-overflow-scrolling:touch}
.siav img{width:100%;display:block;background:#fff;border-radius:3px;box-shadow:0 1px 4px rgba(0,0,0,.35)}`;document.head.appendChild(css);
function pinta(){const c=document.getElementById("sr_ia");if(!c||!ST)return;
 const s=ST,pc=Math.round(s.pct||0),seg=Math.round(((s.fin||Date.now())-s.ini)/1000);
 if(s.res){c.innerHTML=`<div class="sia"><div class="siah"><img src="claude-logo.png" alt=""><span>PDF de la actuación · PBB ${E(s.pos)}</span><span class="mu" style="flex:none;font-weight:400;font-size:12px">${seg} s</span></div>
  <div class="mu" style="font-size:12px;margin-top:4px">${E(s.motor||"")}${s.ot?` · guardado en la OT ${E(s.ot)} (Resolución Claude)`:""}</div>
  ${s.otProp?`<div class="siaot"><b>Orden de trabajo solicitada</b><div>PBB ${E(s.otProp.pos||"-")} · ${E(s.otProp.tipo)} · ${E(s.otProp.desc)}</div><button class="pri" onclick="sosRegOT()">📝 Registrar la OT</button></div>`:""}
  ${s.memo?`<div class="mu" style="font-size:12px;margin-top:4px">📁 ${E(s.memo)}</div>`:""}
  <div class="siabt"><a class="pri" href="${s.res.url}" download="${E(s.res.nom)}">⬇ Descargar PDF</a><button class="sec" onclick="sosIaAbre()">Abrir</button>${navigator.canShare?`<button class="sec" onclick="sosIaComparte()">Compartir</button>`:""}</div>
  <div class="siav" id="sia_v">${s.res.imgs?s.res.imgs.map(u=>`<img src="${u}" alt="Página del PDF">`).join(""):`<div class="mu" style="color:#fff;padding:10px">Preparando la vista…</div>`}</div></div>`;return}
 c.innerHTML=`<div class="sia${s.err?" err":""}"><div class="siah"><img src="claude-logo.png" alt=""><span>${s.err?"No se ha podido completar la consulta":/Gemini/.test(s.motor||"")?"Consultando a Gemini (reserva: falta la clave de Claude)":"Consultando a Claude en segundo plano"}</span></div>
 <div class="siab"><i style="width:${pc}%"></i></div><div class="siam"><span>${E(s.fase||"")}</span><b>${pc}% · ${seg} s</b></div>
 ${s.err?`<div class="gav" style="margin-top:6px;font-size:13px">${E(s.err)}</div><div class="siabt"><button class="sec" onclick="sosObClaude()">Reintentar</button><button class="sec" onclick="sosIaClaudeAi()">Abrir en Claude.ai</button></div>`
 :`${s.vista?`<div class="siat">${E(s.vista)}</div>`:""}<div class="siabt"><button class="sec" onclick="sosIaCancela()">Cancelar</button></div>`}</div>`}
let tic=null;const avanza=(fase,pct)=>{if(!ST)return;if(fase)ST.fase=fase;if(pct!=null)ST.pct=Math.max(ST.pct||0,Math.min(99,pct));pinta()};
window.sosIaCancela=()=>{if(ST&&ST.ac)ST.ac.abort()};
window.sosIaAbre=()=>{if(!ST||!ST.res)return;const w=window.open(ST.res.url,"_blank");if(!w){const a=document.createElement("a");a.href=ST.res.url;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove()}};
window.sosIaComparte=async()=>{if(!ST||!ST.res)return;try{const f=new File([ST.res.blob],ST.res.nom,{type:"application/pdf"});if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:ST.res.nom});else sosIaAbre()}catch(e){}};
window.sosIaClaudeAi=()=>{if(ST&&ST.pregunta&&typeof abreClaude=="function")abreClaude(ST.pregunta)};

/* el SOS conserva la consulta: al volver a abrir la hoja se ve el progreso o el PDF */
const oR=window.sosRap;if(typeof oR=="function")window.sosRap=function(){const r=oR.apply(this,arguments);
 const b=document.querySelector("#sheetc .srobrow")||document.querySelector("#sheetc .srobok");if(b&&!document.getElementById("sr_ia")){b.insertAdjacentHTML("afterend",`<div id="sr_ia"></div>`);
  if(ST){const p=$("#sr_p");if(p&&!p.value)p.value=ST.pos;const o=$("#sr_ob");if(o&&!o.value)o.value=ST.obs||"";pinta()}}
 return r};

/* ---------- v372: reinicio, orden de trabajo pedida en el mensaje y memoria de las actuaciones SOS ---------- */
const OTRE=/\b(crea|crear|cr[eé]ame|crealo|genera|generar|gen[eé]rame|registra|registrar|reg[ií]stra(?:me|la)|abre|abrir|[aá]breme|da de alta|dar de alta|alta de|nueva)\b[^.\n]{0,60}\b(orden(?:es)? de trabajo|orden|OT|aviso)\b/i;
function propOT(md,ob,pos,tipo){const sec=(String(md).split(/\n(?=##\s)/).find(x=>/^##\s*orden de trabajo/i.test(x))||"");
 const v=k=>{const m=sec.match(new RegExp(k+"\\s*\\**\\s*[:：]\\s*\\**\\s*([^\\n]+)","i"));return m?m[1].replace(/\*\*/g,"").trim():""};
 let p=(v("Posici[oó]n").match(/T?\d{3}/i)||[])[0]||pos||"";const t=(v("Tipo").toUpperCase().match(/PAS|AAA|AAP|HZ|SVGA/)||[])[0]||(ob.toUpperCase().match(/\b(PAS|AAA|AAP|HZ|SVGA)\b/)||[])[1]||tipo||"PAS";
 let d=v("Descripci[oó]n");if(!d){d=ob.split(/(?<=[.!?])\s+/).filter(x=>!OTRE.test(x)&&!/^dame|^lista|^quiero|^necesito/i.test(x.trim())).join(" ").trim()||ob}
 return{pos:String(p).toUpperCase(),tipo:t,desc:d.slice(0,240)}}
window.sosRegOT=function(){if(!ST||!ST.otProp)return;const o=ST.otProp;closeSheet();go("new");
 const pon=()=>{const n=document.getElementById("f_posn");if(n&&o.pos){n.value=o.pos;try{n.dispatchEvent(new Event("input",{bubbles:true}))}catch(e){}}
  const sp=document.getElementById("f_pos");if(sp&&o.pos&&[...sp.options].some(x=>x.value==o.pos))sp.value=o.pos;
  document.querySelectorAll(".eqc").forEach(c=>c.checked=c.value==o.tipo);if(typeof pintaEq=="function")pintaEq();
  const d=document.getElementById("f_desc");if(d)d.value=o.desc;const f=document.getElementById("f_ord");if(f){try{f.focus({preventScroll:true})}catch(e){f.focus()}}};
 setTimeout(pon,150);setTimeout(pon,600);msg("OT preparada: introduce el nº de orden CGA y guarda")};
window.sosReinicia=function(){if(ST){try{ST.ac&&ST.ac.abort()}catch(e){}try{ST.res&&URL.revokeObjectURL(ST.res.url)}catch(e){}}ST=null;clearInterval(tic);
 try{closeSheet()}catch(e){}if(typeof window.sosRap=="function")window.sosRap();msg("SOS reiniciado")};
/* toda actuación SOS se guarda en «Casos» (carpeta Resoluciones) con su PDF y su texto, para tomarla de referencia en averías futuras */
async function memoriza(S){if(typeof sb=="undefined"||!sb||!S.res||!S.md)return;
 const d=new Date(),path=Date.now()+"_"+S.res.nom.replace(/[^\w.-]/g,"_");
 const up=await sb.storage.from("docs_claude").upload(path,S.res.blob,{contentType:"application/pdf"});if(up.error)throw up.error;
 const pri=(String(S.md).split(/\n(?=##\s)/).find(x=>/^##\s*primera actuaci/i.test(x))||"").replace(/^##[^\n]*\n/,"").trim();
 const fila={titulo:`SOS · PBB ${S.pos||"-"} · ${S.obs.replace(/\s+/g," ").slice(0,70)}`,pdf_path:path,pos:S.pos||null,tipo:S.tipo||null,orden:S.orden||null,ot_id:S.otId||null,carpeta:"Resoluciones",
  notas:`Actuación SOS memorizada automáticamente · ${S.motor||"Claude"} · ${d.toLocaleDateString("es-ES")}`,contenido:S.md,
  registro:{pos:S.pos||"",tipo:S.tipo||"",orden:S.orden||"",fecha:d.toISOString().slice(0,10),desc:S.obs,obs:S.al||"",act:pri.slice(0,4000)},autor:(typeof tecNombre!="undefined"&&tecNombre)||(typeof user!="undefined"&&user&&user.email)||null};
 const r=await sb.from("docs_claude").insert(fila).select();if(r.error)throw r.error;
 S.memo="Actuación guardada en Casos para futuras averías";if(ST===S)pinta();try{window.docsCarga&&window.docsCarga(true)}catch(e){}}

/* ---------- consulta ---------- */
window.sosObClaude=async function(){const t=document.getElementById("sr_ob"),ob=(t&&t.value.trim())||"";
 if(!ob){msg("Escribe en Observaciones lo que has detectado");if(t)t.focus();return}
 if(ST&&ST.ac&&!ST.res&&!ST.err){msg("Ya hay una consulta en marcha");return}
 let pos=(($("#sr_p")||{}).value||"").trim().toUpperCase();const sa=$("#sr_a");const al=sa&&sa.value?sa.options[sa.selectedIndex].text:"",am=(($("#sr_t")||{}).value||"").trim();
 /* v372: si no se ha puesto la posición, se toma la que se nombra en las observaciones (p. ej. «en la 546») */
 if(!pos){const PS=new Set((typeof POS!="undefined"?POS:[]).map(x=>String(x).toUpperCase()));const m=(ob.toUpperCase().match(/\bT?\d{3}\b/g)||[]).find(x=>PS.has(x));if(m){pos=m;const pe=$("#sr_p");if(pe)pe.value=m}}
 const pideOT=OTRE.test(ob);
 const ot=(typeof inc!="undefined"&&Array.isArray(inc)&&pos)?inc.find(x=>String(x.pos).toUpperCase()==pos&&x.estado=="abierta"):null;
 const tipo=(ot&&ot.tipo)||"PAS";
 const pregunta=`Contexto: pasarela de embarque PBB ${pos||"(sin indicar)"} del Aeropuerto de Madrid Barajas (TK Elevator). Actuación directa SOS.
${ot?`OT abierta: tipo ${ot.tipo||"-"} · Nº de orden CGA ${ot.orden||"-"} · descripción: ${ot.desc||"(sin descripción)"}\n`:""}Alarma activada en la Magelis: ${al||"(no elegida)"}${am?`\nAlarma escrita a mano: ${am}`:""}
MENSAJE DEL TÉCNICO (te habla directamente, como en una conversación con Claude AI; analiza exhaustivamente cada frase y responde a TODO lo que pide: listas, relaciones de cables, explicaciones, medidas, procedimientos…):
${ob}
${pideOT?`\nEl técnico pide crear o registrar una ORDEN DE TRABAJO: la app PBB TKE la registra con su confirmación, así que no digas que no puedes. Añade al final un apartado «## Orden de trabajo propuesta» con Posición, Tipo (PAS, AAA, AAP, HZ o SVGA) y una Descripción breve de la incidencia.\n`:""}
Si el mensaje describe una avería, analiza minuciosamente lo detectado y cotéjalo con TODA la documentación del proyecto PBB TKE (planos eléctricos e hidráulicos, PLC, guía de averías, procedimientos y casos anteriores). Quiero instrucciones de campo de nivel profesional para localizar la avería:
1. Empieza con «Primera actuación en campo» (seguridad y pasos inmediatos, numerados y breves).
2. Diagnóstico paso a paso: en cada paso indica el elemento y su referencia en plano (folio, borne, módulo PLC, entrada/salida, LED), la medida a tomar (magnitud, puntos de medida y valor esperado) y qué hacer según el resultado (si es correcto → siguiente paso; si no → causa probable y actuación).
3. Medida a medida, con las comprobaciones de cada una, hasta acotar la avería.
4. Termina con la reparación propuesta y la comprobación final de funcionamiento.
Si algo no se puede confirmar con la documentación, dilo y pide el dato o la medida que falta.`;
 if(ST&&ST.res)try{URL.revokeObjectURL(ST.res.url)}catch(e){}
 ST={pos,tipo,al:al||am,obs:ob,ot:null,otId:ot&&ot.id,orden:ot&&ot.orden,pregunta,ini:Date.now(),pct:1,fase:"Preparando la consulta…",ac:new AbortController()};
 const S=ST;pinta();clearInterval(tic);tic=setInterval(()=>{if(ST!==S||S.res||S.err){clearInterval(tic);return}if(S.esperando)S.pct=Math.min(S.pct+.25,24);pinta()},1000);
 let wl=null;try{if(navigator.wakeLock)wl=await navigator.wakeLock.request("screen")}catch(e){}
 try{
  const busca=[ob,al,am,ot&&ot.desc].filter(Boolean).join(" · ");
  avanza("Reuniendo la guía de campo…",4);
  const g=guiaCtx(tipo,busca),pa=primeraCtx(pos,[al,am,ob].filter(Boolean).join(" · "));
  avanza("Buscando casos parecidos…",7);const ca=await casosCtx(busca);
  avanza("Cotejando planos…",9);
  const pl=await planosCtx(pos,tipo,busca,(f,x)=>avanza(f,9+9*(x||0)));
  S.docs=pl.usados;if(S.ac.signal.aborted)throw new DOMException("x","AbortError");
  const contexto=[g,pa,ca,pl.txt].filter(Boolean).join("\n\n");
  avanza("Enviando a Claude ("+Math.round(contexto.length/1024)+" KB de documentación)…",19);
  const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;
  if(!tok)throw new Error("Inicia sesión en la app para consultar a Claude.");
  S.esperando=true;
  const r=await fetch(SUPABASE_URL+"/functions/v1/consulta-sos",{method:"POST",signal:S.ac.signal,headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},body:JSON.stringify({pregunta,contexto})});
  if(!r.ok){let m="";try{const j=await r.json();m=j.mensaje||j.error||""}catch(e){}throw new Error(r.status==503&&/clave/i.test(m)?m:`La consulta ha fallado (${r.status}) ${m}`)}
  S.motor=(r.headers.get("x-motor")||"Claude").replace(" - "," · ");S.esperando=false;avanza((/Gemini/.test(S.motor)?"Gemini":"Claude")+" está redactando la actuación…",25);
  const rd=r.body.getReader(),dec=new TextDecoder();let txt="";
  for(;;){const {done,value}=await rd.read();if(done)break;txt+=dec.decode(value,{stream:true});
   S.pct=Math.max(S.pct,25+65*(1-Math.exp(-txt.length/7000)));S.vista=txt.split("\n").filter(l=>l.trim()).slice(-2).join("\n").replace(/[#*|`]/g,"").slice(-180);S.fase=`Recibiendo respuesta · ${txt.length} caracteres`;pinta()}
  txt=txt.trim();if(txt.length<200)throw new Error("Respuesta vacía o incompleta de Claude. Vuelve a intentarlo.");
  S.md=txt;S.vista="";avanza("Dibujando el croquis de conexión…",90);try{S.croquis=await window.iaCroquis(txt,pos,S.tipo)}catch(e){S.croquis=null;try{const c=window.croquisLocal&&window.croquisLocal(txt,pos,S.tipo);if(c&&c.nodos&&c.nodos.length>=2){S.croquis=c;avanza("Dibujando el croquis de conexión…",91);await new Promise(z=>setTimeout(z,1200))}}catch(x){}}
  avanza("Generando el PDF A4…",94);
  const blob=await haceePdf(S);const url=URL.createObjectURL(blob);
  const d=new Date(),f2=n=>String(n).padStart(2,"0");
  S.res={blob,url,nom:`SOS_PBB${pos||"X"}_${d.getFullYear()}-${f2(d.getMonth()+1)}-${f2(d.getDate())}_${f2(d.getHours())}${f2(d.getMinutes())}.pdf`};
  if(S.otId){const o=inc.find(x=>x.id==S.otId);if(o){o.resClaude={txt,ts:Date.now(),por:"SOS · "+(S.motor||"Claude"),croquis:S.croquis||undefined};try{sv("pbb_inc",inc)}catch(e){}S.ot=o.orden||o.id}}
  if(pideOT)S.otProp=propOT(txt,ob,pos,tipo);
  S.pct=100;S.fin=Date.now();pinta();msg("PDF de la actuación listo");
  memoriza(S).catch(e=>console.warn("memoriza SOS",e));
  vista(S)}
 catch(e){S.esperando=false;S.fin=Date.now();S.err=e&&e.name=="AbortError"?"Consulta cancelada.":String((e&&e.message)||e);pinta()}
 finally{clearInterval(tic);try{wl&&wl.release()}catch(e){}}};

/* páginas del PDF como imágenes dentro de la hoja (en iPhone un PDF en iframe solo enseña la 1ª página) */
async function vista(S){try{await cargaLib();const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await S.res.blob.arrayBuffer())}).promise;const out=[];
 const w=Math.min(1600,Math.max(900,Math.round((window.innerWidth||400)*(window.devicePixelRatio||2))));
 for(let n=1;n<=pdf.numPages;n++){const pg=await pdf.getPage(n);const b=pg.getViewport({scale:1}),v=pg.getViewport({scale:w/b.width});
  const c=document.createElement("canvas");c.width=v.width;c.height=v.height;await pg.render({canvasContext:c.getContext("2d"),viewport:v}).promise;
  out.push(await new Promise(r=>c.toBlob(b=>r(URL.createObjectURL(b)),"image/jpeg",.9)))}
 S.res.imgs=out;if(ST===S)pinta()}catch(e){if(S.res){S.res.imgs=[];const v=document.getElementById("sia_v");if(v)v.innerHTML=`<iframe src="${S.res.url}" style="width:100%;height:65vh;border:0;background:#fff"></iframe>`}}}

/* ---------- PDF A4 (jsPDF) ---------- */
const MAP={"●":"(enc.)","○":"(apag.)","◐":"(var.)","→":"->","⇒":"=>","←":"<-","↔":"<->","≥":">=","≤":"<=","≈":"~","≠":"!=","Ω":" ohm","–":"-","—":"-","…":"...","‘":"'","’":"'","“":'"',"”":'"',"✔":"OK","✓":"OK","✘":"NO","✗":"NO","⚠":"ATENCION:","•":"-","▸":"-","►":"-","△":"","Δ":"Delta ","√":"raiz ","─":"-","━":"-","│":"|","┃":"|","└":"'","┘":"'","├":"|","┤":"|","┌":".","┐":".","┬":"-","┴":"-","┼":"+","▶":">","▼":"v","▲":"^"};
const pS=s=>String(s==null?"":s).replace(/[\uFE0F\u200B]/g,"").replace(/[●○◐→⇒←↔≥≤≈≠Ω–—…‘’“”✔✓✘✗⚠•▸►△Δ√─━│┃└┘├┤┌┐┬┴┼▶▼▲]/g,c=>MAP[c]).replace(/[^\x00-\xFF]/g,"");
function runs(s){const o=[];const re=/(\*\*[^*]+\*\*|`[^`]+`)/g;let k=0,m;s=pS(s);while((m=re.exec(s))){if(m.index>k)o.push({t:s.slice(k,m.index)});const x=m[0];o.push(x[0]=="*"?{t:x.slice(2,-2),b:1}:{t:x.slice(1,-1),c:1});k=m.index+x.length}if(k<s.length)o.push({t:s.slice(k)});return o.map(r=>({...r,t:r.t.replace(/\*\*/g,"")}))}
async function haceePdf(S){await cargaJsPDF();const {jsPDF}=window.jspdf;const d=new jsPDF({unit:"mm",format:"a4",orientation:"portrait"});
 const W=210,H=297,M=14,AN=W-2*M,TOP=24,BOT=H-16,PR=[74,26,116],AC=[230,108,0],GR=[90,90,90];let y=TOP;
 const fnt=(b,c,sz)=>{d.setFont(c?"courier":"helvetica",b?"bold":"normal");if(sz)d.setFontSize(sz)};
 const cab=()=>{d.setFillColor(...PR);d.rect(0,0,W,15,"F");d.setFillColor(...AC);d.rect(0,15,W,1.2,"F");d.setTextColor(255,255,255);fnt(1,0,11);d.text(pS(S.cabTit||"SOS - ACTUACION DIRECTA"),M,9.5);
  fnt(0,0,9);d.text(pS(`PBB ${S.pos} · ${S.tipo}${S.orden?" · OT "+S.orden:""}`),W-M,9.5,{align:"right"});d.setTextColor(0,0,0)};
 const nueva=()=>{d.addPage();cab();y=TOP};const sitio=h=>{if(y+h>BOT)nueva()};
 /* párrafo con negritas y código; x = margen izquierdo, w = ancho */
 const par=(R,x,w,sz,lh,base)=>{const pal=[];R.forEach(r=>r.t.split(/(\s+)/).forEach(p=>{if(p)pal.push({...r,t:p,b:r.b||base})}));
  let lin=[],ac=0;const fl=()=>{sitio(lh);let xx=x;const g=[];lin.forEach(p=>{const u=g[g.length-1];if(u&&!!u.b==!!p.b&&!!u.c==!!p.c){u.t+=p.t;u.w+=p.w}else g.push({...p})});
   g.forEach(p=>{fnt(p.b,p.c,p.c?sz-.6:sz);if(p.c){d.setTextColor(150,40,0)}d.text(p.t,xx,y);d.setTextColor(0,0,0);xx+=p.w});y+=lh;lin=[];ac=0};
  pal.forEach(p=>{fnt(p.b,p.c,p.c?sz-.6:sz);
   if(/^\s+$/.test(p.t)){if(!lin.length)return;const sw=d.getTextWidth(" ");lin.push({...p,t:" ",w:sw});ac+=sw;return}
   let t=p.t,pw=d.getTextWidth(t);
   if(ac+pw>w&&lin.length){while(lin.length&&lin[lin.length-1].t==" "){ac-=lin.pop().w}fl()}
   while(pw>w){/* palabra más larga que la línea: se parte */let k=t.length;while(k>1&&d.getTextWidth(t.slice(0,k))>w)k--;
    lin.push({...p,t:t.slice(0,k),w:d.getTextWidth(t.slice(0,k))});fl();fnt(p.b,p.c,p.c?sz-.6:sz);t=t.slice(k);pw=d.getTextWidth(t)}
   if(t){lin.push({...p,t,w:pw});ac+=pw}});
  if(lin.length)fl()};
 const alto=(R,w,sz,lh)=>{fnt(0,0,sz);const t=R.map(r=>r.t).join("");return Math.max(1,d.splitTextToSize(t,w).length)*lh};
 cab();
 /* ficha */
 fnt(1,0,15);d.setTextColor(...PR);d.text(pS(`Instrucciones de campo · PBB ${S.pos}`),M,y+2);y+=5;d.setDrawColor(...AC);d.setLineWidth(.6);d.line(M,y,M+60,y);y+=5;d.setTextColor(0,0,0);
 const fe=new Date(S.fin||Date.now());const F=S.filas||[["Posición",`PBB ${S.pos||"-"} · ${S.tipo}`],["Alarma Magelis",S.al||"(no elegida)"],["OT",S.orden?`Orden CGA ${S.orden}`:"Sin OT abierta en la posición"],["Técnico",(typeof tecNombre!="undefined"&&tecNombre)||"-"],["Fecha",fe.toLocaleDateString("es-ES")+" "+fe.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})],["Motor IA",S.motor||"Claude"]];
 const fy=y;d.setFillColor(246,242,250);const obsL=(fnt(0,0,9),d.splitTextToSize(pS(S.obs),AN-34));const hF=F.length*5+obsL.length*4.2+8;d.roundedRect(M,fy-1,AN,hF,2,2,"F");y+=3;
 F.forEach(([k,v])=>{fnt(1,0,9);d.setTextColor(...GR);d.text(pS(k),M+3,y);fnt(0,0,9);d.setTextColor(0,0,0);d.text(d.splitTextToSize(pS(v),AN-36)[0]||"",M+33,y);y+=5});
 fnt(1,0,9);d.setTextColor(...GR);d.text(pS(S.obsLbl||"Observaciones"),M+3,y);fnt(0,0,9);d.setTextColor(0,0,0);obsL.forEach(l=>{d.text(l,M+33,y);y+=4.2});y=fy+hF+4;
 if(S.docs&&S.docs.length){fnt(1,0,8);d.setTextColor(...GR);d.text("Documentación cotejada:",M,y);y+=3.8;fnt(0,0,7.5);
  S.docs.forEach(x=>{const l=d.splitTextToSize(pS(`- ${x.n.replace(/^\d+_/,"")}: pág. ${x.p.join(", ")}`),AN);l.forEach(z=>{sitio(3.4);d.text(z,M+2,y);y+=3.4})});
  d.text(pS("- Guía de campo, comprobaciones por sistema, estado de LED del PLC y casos de la app PBB TKE."),M+2,y);y+=5;d.setTextColor(0,0,0)}
 /* cuerpo (Markdown) */
 const L=pS(S.md).replace(/\r/g,"").split("\n");let i=0,enCod=false;
 while(i<L.length){const l=L[i],s=l.trim();
  if(/^```/.test(s)){enCod=!enCod;i++;continue}
  if(enCod){fnt(0,1,8);const ls=d.splitTextToSize(l.replace(/\t/g,"  "),AN-6);ls.forEach(z=>{sitio(3.8);d.setFillColor(240,240,240);d.rect(M,y-3,AN,3.8,"F");d.text(z,M+3,y);y+=3.8});i++;continue}
  if(!s){y+=1.6;i++;continue}
  if(/^(-{3,}|\*{3,}|_{3,})$/.test(s)){sitio(4);d.setDrawColor(200,200,200);d.setLineWidth(.3);d.line(M,y,W-M,y);y+=4;i++;continue}
  let m;
  if((m=s.match(/^(#{1,6})\s+(.*)$/))){const n=m[1].length,t=m[2].replace(/\*\*/g,"");
   if(n==1){sitio(12);y+=2;fnt(1,0,14);d.setTextColor(...PR);d.splitTextToSize(t,AN).forEach(z=>{d.text(z,M,y);y+=6});d.setTextColor(0,0,0);y+=1}
   else if(n==2){sitio(14);y+=2.5;const pri=/primera actuaci/i.test(t);d.setFillColor(...(pri?AC:PR));d.roundedRect(M,y-5,AN,7.5,1.5,1.5,"F");fnt(1,0,11.5);d.setTextColor(255,255,255);d.text(d.splitTextToSize(t,AN-6)[0],M+3,y);d.setTextColor(0,0,0);y+=6.5}
   else{sitio(10);y+=1.5;fnt(1,0,10.5);d.setTextColor(...PR);d.splitTextToSize(t,AN).forEach(z=>{d.text(z,M,y);y+=5});d.setTextColor(0,0,0)}
   i++;continue}
  if(/^\|/.test(s)){const rows=[];while(i<L.length&&/^\|/.test(L[i].trim())){rows.push(L[i].trim());i++}
   const cel=r=>r.replace(/^\||\|$/g,"").split("|").map(x=>x.trim());const body=rows.filter(r=>!/^\|?[\s:|-]+\|?$/.test(r)).map(cel);if(!body.length)continue;
   const nc=Math.max(...body.map(r=>r.length));const lg=Array(nc).fill(4);body.forEach(r=>r.forEach((c,k)=>{lg[k]=Math.max(lg[k],Math.min(45,c.replace(/\*\*/g,"").length))}));
   const sum=lg.reduce((a,b)=>a+b,0);const cw=lg.map(v=>Math.max(16,AN*v/sum));const k=AN/cw.reduce((a,b)=>a+b,0);for(let j=0;j<nc;j++)cw[j]*=k;
   const fila=(r,hd)=>{fnt(hd,0,8.3);const ls=cw.map((w,j)=>d.splitTextToSize((r[j]||"").replace(/\*\*/g,"").replace(/`/g,""),w-3));const h=Math.max(...ls.map(x=>x.length))*3.7+2.4;
    if(y+h>BOT){nueva();if(!hd)fila(body[0],1)}let x=M;ls.forEach((t,j)=>{if(hd){d.setFillColor(234,226,243);d.rect(x,y-3.4,cw[j],h,"F")}d.setDrawColor(190,180,200);d.setLineWidth(.2);d.rect(x,y-3.4,cw[j],h);fnt(hd,0,8.3);t.forEach((z,q)=>d.text(z,x+1.5,y+q*3.7));x+=cw[j]});y+=h};
   sitio(10);body.forEach((r,j)=>fila(r,j==0));y+=2.5;continue}
  if((m=s.match(/^(\d+)[.)]\s+(.*)$/))){sitio(5);fnt(1,0,9.5);d.setTextColor(...PR);d.text(m[1]+".",M+1,y);d.setTextColor(0,0,0);par(runs(m[2]),M+7,AN-7,9.5,4.4);y+=.8;i++;continue}
  if((m=l.match(/^(\s*)[-*+]\s+(.*)$/))){const lv=m[1].length>=2?1:0,x=M+3+lv*7;sitio(5);d.setFillColor(...(lv?GR:AC));d.circle(x,y-1.2,.75,"F");
   par(runs(m[2]),x+3,AN-(x+3-M),9,4.1,0);y+=.5;i++;continue}
  if(/^>/.test(s)){const t=s.replace(/^>\s?/,"");const h=alto(runs(t),AN-8,9,4.2);sitio(h);d.setFillColor(...AC);d.rect(M,y-3.3,1.2,h,"F");par(runs(t),M+4,AN-6,9,4.2);y+=1;i++;continue}
  let p=[s];i++;while(i<L.length&&L[i].trim()&&!/^(#{1,6}\s|\||\d+[.)]\s|\s*[-*+]\s|>|```|-{3,}$)/.test(L[i].trim())){p.push(L[i].trim());i++}
  sitio(5);par(runs(p.join(" ")),M,AN,9.5,4.4);y+=1.5}
 /* v364: croquis de conexión por bloques al final */
 if(S.croquis&&window.pdfCroquis){try{window.pdfCroquis(d,S.croquis,{cab,W,H,M,PR,AC,GR,fnt,pS})}catch(e){console.warn("croquis",e)}}
 /* pie con número de página */
 const N=d.getNumberOfPages();for(let n=1;n<=N;n++){d.setPage(n);d.setDrawColor(...AC);d.setLineWidth(.4);d.line(M,H-11,W-M,H-11);fnt(0,0,7.3);d.setTextColor(...GR);
  d.text(pS("PBB TKE Maintenance · Análisis IA cotejado con la documentación del proyecto PBB TKE. Verificar siempre en campo."),M,H-7);d.text(`Pág. ${n}/${N}`,W-M,H-7,{align:"right"});d.setTextColor(0,0,0)}
 return d.output("blob")}
window.sosIaPdf=haceePdf;
/* v364: croquis de conexión (JSON) a partir de la resolución, con la función consulta-sos en modo «croquis» */
window.iaCroquis=async(md,pos,tipo)=>{const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;if(!tok)throw new Error("sin sesión");
 const ac=new AbortController();const t=setTimeout(()=>ac.abort(),120000);
 try{const r=await fetch(SUPABASE_URL+"/functions/v1/consulta-sos",{method:"POST",signal:ac.signal,headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},
   body:JSON.stringify({modo:"croquis",pregunta:String(md||"").slice(0,30000),contexto:`PBB ${pos||"-"} · ${tipo||"PAS"}`})});
  const j=await r.json().catch(()=>({}));if(!r.ok||!j.croquis)throw new Error(j.mensaje||("croquis "+r.status));return j.croquis}finally{clearTimeout(t)}};
/* v352: la Resolución IA de la OT reutiliza la misma documentación (res-claude.js) */
window.iaCtx={guiaCtx,primeraCtx,casosCtx,planosCtx};
})();
