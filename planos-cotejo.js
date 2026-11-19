/* ===== v517 (v521: no arranca solo · primero Gemini gratis y Claude solo aceptando el coste · v520: caja tras «Planos a cotejar» · respuesta IA cortada leída igual y pedida más corta · v519: barra de progreso en la lectura de planos y en la consulta IA · v518: caja antes de Seguridad · botón RECALCULAR IA siempre visible, también tras error): COTEJO ENTRE VARIOS PLANOS en la guía de campo de la OT (16/11/2026) =====
   · Debajo de «Plano de esta guía» → «📐 Planos a cotejar»: casillas con todos los planos cargados. Se guarda por OT.
     Por defecto: el plano de la guía + los de los otros sistemas que cita la OT (PBB / RCS o plano propio, AAA, HZ, AAP, CBTH).
   · El plano principal (el del desplegable) se elige ahora POR OT y vale también en 504 / 507 / 508 (antes se ignoraba ahí):
     es el que abren los botones de folio.
   · Al cambiar el plano principal o los marcados se rehace el diagnóstico de la OT:
     1) se lee el texto de cada plano (pdf.js, en el móvil) y se busca en qué página de cada plano sale cada código de la OT
        (aviso + análisis + actuación más eficaz): toque en el chip → abre el plano en esa página;
     2) Claude (función leer-ia, Gemini de reserva) cruza las páginas de todos los planos y devuelve la causa más probable,
        la actuación más eficaz en campo, los pasos de medida (punta roja / negra / valor) y lo que no cuadra entre planos.
        El resultado se guarda por OT + planos elegidos: no se vuelve a pedir si no cambia nada.
   · «Pasar a Actuación guiada» lleva el resultado a la OT. ===== */
(function(){
"use strict";
const $q=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nrm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const TAG=/\+?([A-Z]{1,4}\d?-[A-Z]{1,3}\d+[A-Z]?(?:\.\d+)?)(?![A-Za-z0-9])/g;
const ls={g:k=>{try{return localStorage.getItem(k)}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const hash=s=>{let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return (h>>>0).toString(36)};
const otAct=()=>{try{return (typeof inc!="undefined"?inc:[]).find(x=>x.id==gOT)||null}catch(e){return null}};
const corto=n=>String(n||"").replace(/\.pdf$/i,"");

/* ---------- plano principal por OT (también en 504 / 507 / 508) ---------- */
try{const oD=gDocId;gDocId=function(t,l){try{if(typeof gOT!="undefined"&&gOT){const v=ls.g("g_doc_ot_"+gOT+"_"+t);if(v&&l.some(x=>x.id==v))return v}}catch(e){}return oD(t,l)}}catch(e){}
try{const oS=gSetDoc;gSetDoc=function(v){oS(v);try{if(gOT){ls.s("g_doc_ot_"+gOT+"_"+gTipo,v);if(v){const s=selDe(gOT);if(s&&!s.includes(v)){s.unshift(v);guardaSel(gOT,s)}}}}catch(e){}
 try{ANA_C={k:"",r:null}}catch(e){}const w=$q("#gpcsel");if(w)w.remove();pinta()}}catch(e){}

/* ---------- selección de planos por OT ---------- */
function selDe(id){try{const v=JSON.parse(ls.g("pc_docs_"+id)||"null");return Array.isArray(v)?v:null}catch(e){return null}}
function guardaSel(id,a){ls.s("pc_docs_"+id,JSON.stringify([...new Set(a)]))}
function sugeridos(i,l){const out=[];const add=id=>{if(id&&!out.includes(id))out.push(id)};
 const t=nrm([i.desc,i.def,i.obs,i.com].filter(Boolean).join(" "));
 const tipos=[gTipo,i.tipo,...(i.equipos||[])].filter(Boolean);
 if(/\bpbb\b|pasarela|traslac|bloque|movimiento|rotonda|cabina|elevac|tunel|pupitre/.test(t))tipos.push("PAS");
 if(/\baaa\b|aire|pca|carro/.test(t))tipos.push("AAA");if(/400|\bhz\b|convertidor|manguera/.test(t))tipos.push("HZ");
 [...new Set(tipos)].forEach(k=>{try{add(gDocId(k,l))}catch(e){}});
 /* AAA / HZ con la PBB: el armario CBTH lleva el enclavamiento entre los equipos y la pasarela */
 if(tipos.some(k=>k=="AAA"||k=="HZ")){const pos=String(i.pos||"");const c=l.filter(x=>/CBTH/i.test(x.name));add((c.find(x=>new RegExp("(^|\\D)"+pos+"(\\D|$)").test(x.name))||c[0]||{}).id)}
 return out.slice(0,4)}

/* ---------- texto de cada plano (por página) ---------- */
const TXT={};
async function texto(doc,av){if(TXT[doc.id])return TXT[doc.id];
 let blob=gCache[doc.id];if(!blob){const dl=await sb.storage.from("planos").download(doc.id);if(dl.error)throw dl.error;blob=dl.data;gCache[doc.id]=blob}
 await cargaLib();const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await blob.arrayBuffer())}).promise;const P=[];
 for(let np=1;np<=pdf.numPages;np++){if(av)av(np,pdf.numPages);const pg=await pdf.getPage(np);const tc=await pg.getTextContent();const it=tc.items.map(t=>String(t.str||"").trim()).filter(Boolean);
  const k=it.indexOf("LOCALIZACIÓN");const fo=(k>=0&&/^\d{1,3}$/.test(it[k+1]||""))?+it[k+1]:null;
  const tx=it.join(" ");const tags=new Set();for(const m of tx.toUpperCase().matchAll(TAG))tags.add(m[1]);P.push({np,fo,tx,n:nrm(tx),tags})}
 TXT[doc.id]=P;return P}

/* ---------- códigos y palabras de la OT ---------- */
const VACIAS=new Set("cuando tiene esta estan desde hasta sobre entre donde porque equipo hacer queda quedan tambien".split(" "));
function datosOT(i){let R=null;window.ANA_IA_OFF=1;try{R=anaOT(i)}catch(e){}finally{window.ANA_IA_OFF=0}/* v523: los códigos salen del análisis general, no del filtrado por la IA */
 const ef=$q("#app details.gd.gef");let efT="";if(ef){const w=document.createTreeWalker(ef,NodeFilter.SHOW_TEXT);const a=[];let n;while((n=w.nextNode()))a.push(n.nodeValue);efT=a.join(" ").replace(/\s+/g," ").trim()}
 const base=[i.desc,i.def,i.obs,i.com].filter(Boolean).join(" ");
 const fuente=(base+" "+(R?JSON.stringify(R):"")+" "+efT).toUpperCase();
 const cod=[];for(const m of fuente.matchAll(TAG)){const c=m[1];if(!cod.includes(c))cod.push(c)}
 const pal=[...new Set(nrm(base).split(/[^a-z0-9ñ]+/).filter(w=>w.length>=5&&!VACIAS.has(w)))].slice(0,12);
 /* v520: fuera los códigos pegados a otra palabra («E-A2E» = E-A2 + «Elementos») */
 const cod2=cod.filter(c=>!(/[A-Z]$/.test(c)&&cod.includes(c.slice(0,-1))));
 return {cod:cod2.slice(0,30),pal,efT:efT.slice(0,2500),R}}

/* ---------- estado ---------- */
let ST={k:"",docs:[],res:null,prog:"",ia:null,iaEst:"",iaK:""};let tIA=null;
/* v523: resultado de la IA de la OT para el «Análisis de la OT» (ana-ia.js) */
window.pcIAOT=id=>ST&&ST.ia&&ST.iaK&&ST.iaK.indexOf("pc_ia_"+id+"_")===0?ST.ia:null;
/* v521: el cotejo NO arranca solo. Al pintar solo se prepara (planos elegidos, códigos, resultado guardado).
   La lectura de los planos y la consulta empiezan con «RECALCULAR IA»: primero Gemini (gratis); si no da resultado,
   el botón pasa a Claude, que tiene coste y hay que aceptarlo antes. */
async function calcula(){const i=otAct();if(!i||typeof view=="undefined"||view!="tec")return;
 const l=await gLista();let sel=selDe(i.id);if(!sel){sel=sugeridos(i,l);guardaSel(i.id,sel)}
 const docs=sel.map(id=>l.find(x=>x.id==id)).filter(Boolean);const D=datosOT(i);
 const cons=!!(window.insCons&&window.insCons(i.id));/* v525: actuación más eficaz consultada → cotejo completo (otra clave) */
 const k=hash(i.id+"|"+docs.map(d=>d.id).join(",")+"|"+[i.desc,i.def,i.obs,i.com].join("|")+"|"+D.cod.join(",")+(cons?"|C":""));
 if(ST.k==k)return;
 ST={k,docs,res:null,prog:"",ia:null,iaEst:"",iaK:"pc_ia_"+i.id+"_"+k,D,sigC:false,cons};
 const g=ls.g(ST.iaK);if(g){try{ST.ia=JSON.parse(g)}catch(e){}}
 if(docs.length&&docs.every(d=>TXT[d.id]))cruza();/* ya leídos en esta sesión: el índice de códigos sale sin coste */
 pintaCaja()}
function cruza(){const res={pl:ST.docs.map(d=>({d,P:TXT[d.id]||null})),cod:{}};
 ST.D.cod.forEach(c=>{res.cod[c]=res.pl.map(p=>p.P?p.P.filter(g=>g.tags.has(c)).map(g=>g.np):null)});ST.res=res}
async function leer(){const k=ST.k,docs=ST.docs;
 for(let n=0;n<docs.length;n++){const d=docs[n];ST.prog=`Leyendo ${n+1}/${docs.length} · ${corto(d.name)}…`;ST.pct=Math.round(n/docs.length*100);pintaCaja();
  try{await texto(d,(np,tot)=>{ST.pct=Math.round(((n+np/tot)/docs.length)*100);ST.prog=`Leyendo ${n+1}/${docs.length} · ${corto(d.name)} · pág. ${np}/${tot}`;barra()})}catch(e){}
  if(ST.k!==k)return false}
 ST.prog="";cruza();return true}

/* ---------- v520: lectura del JSON de la IA aunque llegue cortado ----------
   Causa del fallo «JSON Parse error: Expected ']'»: la respuesta superó el máximo de texto de la función (4000 tokens)
   y llegó cortada a mitad de una lista. Se cierra lo que quedó abierto y se aprovecha lo que llegó completo. */
function leeJSON(txt){const t=String(txt||"").replace(/```(?:json)?/g,"");const i=t.indexOf("{");if(i<0)throw new Error("respuesta sin formato");
 const a=t.slice(i),j=a.lastIndexOf("}");if(j>0){try{return JSON.parse(a.slice(0,j+1))}catch(e){}}
 let st=[],enS=false,esc2=false,ult=0;
 for(let k=0;k<a.length;k++){const c=a[k];if(enS){if(esc2)esc2=false;else if(c=="\\")esc2=true;else if(c=='"')enS=false;continue}
  if(c=='"')enS=true;else if(c=="{"||c=="[")st.push(c);else if(c=="}"||c=="]"){st.pop();ult=k+1}else if(c==",")ult=k}
 let b=a;if(enS)b+='"';
 const cierra=x=>{let y=x.replace(/,\s*$/,"").replace(/,\s*"[^"]*"\s*:?\s*$/,"").replace(/:\s*$/,':""');const s2=[];let e=false,q=false;
  for(let k=0;k<y.length;k++){const c=y[k];if(e){if(q)q=false;else if(c=="\\")q=true;else if(c=='"')e=false;continue}if(c=='"')e=true;else if(c=="{"||c=="[")s2.push(c);else if(c=="}"||c=="]")s2.pop()}
  return y+s2.reverse().map(c=>c=="{"?"}":"]").join("")};
 try{const o=JSON.parse(cierra(b));o.cortado=1;return o}catch(e){}
 const o=JSON.parse(cierra(a.slice(0,ult)));o.cortado=1;return o}

/* v619: «pasos» (acción + medida + bien/mal) → también eficaz / medir para lo que ya los usa (análisis IA, inspección completa) */
function normPasos(o){if(!o||!Array.isArray(o.pasos)||!o.pasos.length)return o;
 o.pasos=o.pasos.filter(p=>p&&(p.accion||p.medida)).map(p=>{const m=p.medida&&typeof p.medida=="object"&&(p.medida.punto||p.medida.roja||p.medida.esperado)?p.medida:null;return {accion:String(p.accion||""),medida:m,bien:String(p.bien||""),mal:String(p.mal||""),plano:String(p.plano||"")}});
 o.eficaz=o.pasos.map(p=>p.accion).filter(Boolean);
 o.medir=o.pasos.filter(p=>p.medida).map(p=>({punto:p.medida.punto||p.accion,roja:p.medida.roja||"",negra:p.medida.negra||"",esperado:p.medida.esperado||"",si_no:p.mal||""}));return o}
/* v620: fotos y ubicación de cada componente que cita el paso (identificación rápida en campo) */
const PNC=t=>String(t||"").toUpperCase().replace(/\s+/g,"").replace(/^\+/,"");
const PRX=/\+?\b([A-Z]{1,3}\d?-[A-Z]{1,2}\d+(?:\.\d+)?)/g;
const pcods=id=>String(id||"").split(/\s*(?:\/|,|\+|\by\b)\s*/).map(PNC).filter(Boolean);
const pfo=f=>Array.isArray(f)?{src:f[0],v:String(f[1]||"")}:{src:(f||{}).src,v:String((f||{}).vista||"")};
const PPEND=new Set();
function pcComps(t){const L0=window.COMP_CAMPO||[];const out=[];const vis=new Set();let m;PRX.lastIndex=0;t=String(t||"");
 while((m=PRX.exec(t))&&out.length<3){const cd=PNC(m[1]);if(vis.has(cd))continue;vis.add(cd);
  let r=[];for(const k of [cd,cd.replace(/\.\d+$/,"")]){r=L0.filter(c=>pcods(c.id).map(x=>x.replace(/\./g,"")).includes(k.replace(/\./g,"")));if(r.length)break}
  r=r.filter(c=>c._fp||(c.fotos||[]).length);const c=r[0];if(c&&!out.includes(c))out.push(c)}
 return out}
function pcFotos(c){const ubi=typeof compUbiDe=="function"?compUbiDe(c):"";
 const cab=`<div class="pcfc"><b class="cmpid">${esc(c.id)}</b> ${esc(c.t||"")}${ubi?`<div class="pcfu">📍 ${esc(ubi)}</div>`:""}</div>`;
 if(c._fp){if(typeof compFotosAsegura=="function"&&!PPEND.has(c)){PPEND.add(c);compFotosAsegura(c).then(()=>{PPEND.delete(c);c._fp=false;try{pintaCaja()}catch(e){}}).catch(()=>PPEND.delete(c))}
  return cab+`<div class="pcifw">⏳ Cargando las fotos de ${esc(c.id)}…</div>`}
 const F=(c.fotos||[]).map((f,i)=>Object.assign(pfo(f),{i})).filter(f=>f.src);if(!F.length)return cab;
 const esU=f=>/^ubicaci/i.test(f.v);const cp=F.filter(f=>!esU(f)).slice(0,pcods(c.id).length>1?4:2),ub=F.find(esU);const T=cp.concat(ub?[ub]:[]);
 const all=esc(JSON.stringify(T.map(f=>f.src)));
 return cab+`<div class="pcifs">${T.map(f=>{const u=esU(f);const cf=!u&&typeof compCodFoto=="function"?compCodFoto(c,f.i):"";
  const pie=u?`📍 <b>Ubicación</b>`:`<b>${esc(cf||c.id)}</b><small>${esc(cf?"Vista componente":String(f.v).replace(/\s*·.*$/,"")||"Vista componente")}</small>`;
  return`<figure class="pcifo${u?" pciub":""}" onclick="event.stopPropagation();if(typeof compVer=='function')compVer('${esc(f.src)}',${all})"><img src="${esc(f.src)}" alt="${esc(c.id)}" loading="lazy"><figcaption>${pie}</figcaption></figure>`}).join("")}</div>`}
window.pcFotosPaso=function(p){const m=p.medida||{};const L=pcComps([p.accion,m.punto,m.roja,m.negra].join(" "));
 return L.length?`<div class="pcfw">${L.map(pcFotos).join("")}</div>`:""};
/* pintado común de la secuencia (cotejo y análisis IA) */
window.pcPasosHTML=function(o,tit){const P=(o&&o.pasos)||[];if(!P.length)return "";
 return `<div class="anal">${tit||"🛠️ Actuación en campo según los planos"}</div><div class="gst pcpas">`+P.map((p,n)=>{const m=p.medida;
  return `<div class="pcpaso"><label class="gpaso"><input type="checkbox"><span><b>${n+1}.</b> ${esc(p.accion)}${p.plano?` <small class="mu">· ${esc(p.plano)}</small>`:""}</span></label>`+
   (m?`<div class="pcm">📏 <b>${esc(m.punto||"Medir")}</b><div>Polímetro: punta <b class="pcro">ROJA</b> en <b>${esc(m.roja)}</b> · punta <b>NEGRA</b> en <b>${esc(m.negra)}</b></div><div>Debe marcar <b>${esc(m.esperado)}</b></div></div>`:"")+
   window.pcFotosPaso(p)+(p.bien?`<div class="pcok">✅ <b>Bien →</b> ${esc(p.bien)}</div>`:"")+(p.mal?`<div class="pcko">❌ <b>Mal →</b> ${esc(p.mal)}</div>`:"")+`</div>`}).join("")+`</div>`};
if(!document.getElementById("pcpas-css")){const st=document.createElement("style");st.id="pcpas-css";st.textContent=`.pcpaso{border-left:3px solid var(--pr,#f60);padding:4px 0 6px 8px;margin:8px 0}.pcpaso .pcm{margin:4px 0 4px 26px}.pcok,.pcko{margin:3px 0 0 26px;font-size:13px;line-height:1.35}.pcok b{color:#22a559}.pcko b{color:#e5484d}.pcfw{margin:6px 0 2px 26px}.pcfc{font-size:13px;margin-top:6px}.pcfu{font-size:12px;opacity:.85;margin-top:2px}.pcfw .pcifs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:6px 0 4px}.pcfw .pcifo{margin:0;background:#fff;border:1px solid #d0d0d0;border-radius:8px;padding:3px;text-align:center;cursor:zoom-in;min-width:0}.pcfw .pcifo img{display:block;width:100%;height:90px;object-fit:contain;background:#fff;border-radius:5px}.pcfw .pcifo figcaption{font-size:10.5px;color:#222;line-height:1.2}.pcfw .pcifo figcaption small{display:block;opacity:.7}.pcfw .pciub{border:2px solid #e08a00}`;document.head.appendChild(st)}

/* ---------- Claude: cruce de los planos ---------- */
function paginas(p,D,cupo){if(!p.P)return "";
 const sc=p.P.map(g=>({g,s:D.cod.filter(c=>g.tags.has(c)).length*3+D.pal.filter(w=>g.n.includes(w)).length})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
 let out="";for(const {g} of sc){const t=`\n### ${corto(p.d.name)} · página ${g.np}${g.fo?" (folio "+g.fo+")":""}\n`+g.tx.slice(0,2000);if(out.length+t.length>cupo)break;out+=t}
 return out||`\n### ${corto(p.d.name)}: sin páginas con los códigos o palabras del aviso.`}
async function ia(motor){const i=otAct();if(!i||!ST.res)return;const D=ST.D,R=ST.res,k=ST.k;
 if(ST.iaRun)return;ST.iaRun=true;ST.motor=motor;ST.iaT0=Date.now();ST.iaEst="";pintaCaja();
 const cupo=Math.floor(14000/Math.max(1,R.pl.length));const al=window.aliasCampo||(x=>x);
 const cons=!!ST.cons,blq=cons&&window.insEsBloqueo&&window.insEsBloqueo(i);
 const cad=cons&&window.insCadenaTexto?window.insCadenaTexto(i):"";
 const COMP=cons?`
MODO INSPECCIÓN COMPLETA: la actuación más eficaz YA SE HA CONSULTADO / HECHO. Recalcula todo desde cero y NO te limites a ella.
Da la INSPECCIÓN CABLE A CABLE COMPLETA de cada señal implicada en la avería, desde su ORIGEN (equipo, contacto o elemento de campo que la genera, o fuente de 24 V) hasta su DESTINO (entrada del PLC), tramo a tramo: borna, hilo, manguera y conductor, con el punto a medir en cada tramo.${blq?`
ES UN BLOQUEO: despliega el interbloqueo entero desde el armario CBTH hasta los equipos de la PBB y las máquinas de servicios auxiliares AAA (máquina A/A y carro A/A) y HZ (convertidor 400 Hz en servicio, conector al 90 %, manguera extendida), y el AO (seta y desbloqueo). Prioriza el tramo DENTRO DEL CBTH y DENTRO DE CADA EQUIPO (clemas, relés y contactos de la máquina AAA y del convertidor), que es lo que no tiene la app.`:""}
Recorridos del lado de la PBB que ya tiene la app (esquema rev. J; complétalos con el lado de los equipos según los planos):
${cad||"(ninguno)"}`:"";
 const LIM=cons?`LÍMITES (obligatorios, la respuesta no puede pasar de 2500 palabras): "eficaz" máx. 4 pasos · "medir" máx. 4 puntos · "tramos" máx. 10 · "discrepancias" máx. 4 · "planos" máx. 4 · cada texto máx. 200 caracteres.`:
  `LÍMITES (obligatorios, la respuesta no puede pasar de 2500 palabras): "pasos" máx. 8 · "discrepancias" máx. 5 · "planos" máx. 5 · cada texto máx. 220 caracteres. Céntrate en la señal de la avería, no en todos los códigos.`;
 const JS=cons?`{"resumen":"causa más probable en 1-2 frases","eficaz":["paso 1"],"medir":[{"punto":"","roja":"","negra":"","esperado":"","si_no":""}],"tramos":[{"senal":"","equipo":"","origen":"","destino":"","recorrido":"A → B → C","roja":"","negra":"","esperado":"","si_no":"","plano":"plano y página"}],"discrepancias":["…"],"planos":[{"plano":"","folios":"","aporta":""}]}`:
  `{"resumen":"causa más probable en 1-2 frases","pasos":[{"accion":"qué hacer o mirar","medida":{"punto":"","roja":"","negra":"","esperado":""},"bien":"qué indica y a qué paso seguir","mal":"dónde está el fallo y qué reparar","plano":"plano y folio"}],"discrepancias":["…"],"planos":[{"plano":"","folios":"","aporta":""}]}`;/* v619: actuación y medidas en una sola secuencia */
 const prompt=`Eres técnico experto en mantenimiento de pasarelas de embarque (PBB) TKE del aeropuerto Madrid-Barajas (puesto remoto RCS, PLC con módulos E-A… en el armario eléctrico y P-A… en el armario del pupitre, equipos AAA aire acondicionado, HZ convertidor 400 Hz, armario CBTH de interfaz con los equipos).
Tienes que COTEJAR VARIOS PLANOS entre sí para una OT y dar con la actuación más eficaz en campo y los puntos a medir.
OT ${i.orden||"-"} · PBB ${i.pos} · tipo ${i.tipo||"PAS"}${(i.equipos||[]).length?" · equipos "+i.equipos.join(", "):""}
Aviso: «${al(i.desc||"")}»${i.def&&i.def!=i.desc?"\nDefinición: «"+al(i.def)+"»":""}${i.obs?"\nObservaciones: «"+al(i.obs)+"»":""}${i.com?"\nComentario: «"+al(i.com)+"»":""}
Diagnóstico actual de la app (actuación más eficaz): ${D.efT||"(ninguno)"}
Códigos implicados: ${D.cod.join(", ")||"(ninguno)"}
Planos elegidos: ${R.pl.map(p=>corto(p.d.name)).join(" | ")}
TEXTO EXTRAÍDO DE LOS PLANOS (páginas donde salen los códigos o las palabras del aviso):${R.pl.map(p=>paginas(p,D,cupo)).join("\n")}
${COMP}

Tareas:
1) Sigue la señal de la avería de un plano a otro (bornas, hilos, mangueras, contactos libres de potencial, entradas/salidas del PLC) y cruza los datos entre planos.
${cons?`2) Da la actuación MÁS EFICAZ en campo, en pasos cortos y ordenados (lo más rápido primero; nunca puentear salidas de seguridad).
3) Pasos de MEDIDA en campo con polímetro: punto, dónde va la punta roja y la negra, valor esperado y qué indica si no lo da.`:`2) Da la ACTUACIÓN EN CAMPO como UNA SOLA secuencia ordenada («pasos»), de lo más rápido y probable a lo más lento; nunca puentear salidas de seguridad. Cada paso: «accion» (qué hacer o mirar); «medida» solo si hay que medir (punto, dónde va la punta roja y la negra, valor esperado; si no hay medida, null); «bien» = qué indica si da lo esperado y a qué paso seguir (o avería localizada); «mal» = dónde está el fallo y qué reparar o a qué paso ir.
3) Las medidas van DENTRO de su paso, en el momento en que se hacen: no las des en otra lista.`}
4) Lo que NO cuadra entre los planos (bornas, hilos o nombres distintos) o datos que faltan.
Conocimiento de campo validado (úsalo, no lo cuentes como discrepancia): Selector del pupitre CP-S16, 4 posiciones de izquierda a derecha: REMOTO (izquierda del todo) · 0 = PBB apagada, alimentación de mando sin tensión · 1 = LOCAL / MANUAL (en las OT «selector en ON», «modo ON» o «PBB activada») · 2 = AUTO (autonivelación). Entradas del módulo de seguridad E-A10 (folio 70): DIS05 «Modo auto» (5.1/5.2, hilos 684/685, contactos 1-2) · DIS06 «Modo manual» (6.1/6.2, hilos 686/687, contactos 3-4) · DIS07 «Modo local/remoto» (7.1/7.2, hilos 688/689, contactos 5-6).
No inventes: si un dato no está en el texto de los planos, dilo. Cita plano y página o folio de cada dato. Castellano técnico, MUY conciso.
${LIM}
Responde SOLO con JSON, sin nada más:
${JS}`;
 try{const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;if(!tok)throw new Error("inicia sesión para usar la IA");
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),70000);
  const r=await fetch(SUPABASE_URL+"/functions/v1/leer-ia",{method:"POST",signal:ac.signal,headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},body:JSON.stringify({prompt,motor})});clearTimeout(to);
  const j=await r.json().catch(()=>({}));if(!r.ok||!j.txt)throw new Error(j.mensaje||j.error||("error "+r.status));
  const o=normPasos(leeJSON(j.txt));if(!o.resumen&&!(o.eficaz||[]).length&&!(o.medir||[]).length&&!(o.pasos||[]).length)throw new Error("respuesta incompleta");o.lector=j.lector||"IA";o.t=Date.now();if(ST.cons)o.modo="completa";
  {const b=$q("#gpcot .pcbar>i");if(b){b.style.width="100%";await new Promise(r=>setTimeout(r,350))}}
  ST.iaRun=false;if(ST.k!==k)return;ST.ia=o;ST.iaEst="";ST.sigC=false;ls.s(ST.iaK,JSON.stringify(o));try{window.dispatchEvent(new CustomEvent("pc-ia",{detail:{id:i.id}}))}catch(e){}}
 catch(e){ST.iaRun=false;if(ST.k!==k)return;if(motor=="gemini")ST.sigC=true;ST.iaEst=(motor=="gemini"?"Gemini (gratis) no ha dado resultado: ":"Claude no ha dado resultado: ")+(e&&e.name=="AbortError"?"no respondió a tiempo":(e.message||e))+(motor=="gemini"?". Puedes lanzarlo con Claude (tiene coste) con el botón de abajo, o reintentar con Gemini.":". Puedes volver a lanzarlo.")}
 pintaCaja()}

/* ---------- pintado ---------- */
function selHTML(i,l){const sel=selDe(i.id)||[];
 return `<details class="pcsel"${sel.length?"":" open"}><summary>📐 Planos a cotejar · <b>${sel.length}</b> elegido${sel.length==1?"":"s"}</summary>
 <div class="mu" style="font-size:11.5px;margin:4px 0 6px">Marca todos los planos que intervienen (PBB, CBTH, AAA, HZ…): la guía cruza sus datos y rehace el diagnóstico de esta OT.</div>
 ${l.map(x=>`<label class="pcit"><input type="checkbox" value="${esc(x.id)}" ${sel.includes(x.id)?"checked":""} onchange="pcMarca(this)"><span>${esc(corto(x.name))}</span></label>`).join("")||`<div class="mu">No hay planos cargados (pestaña Planos).</div>`}</details>`}
window.pcMarca=function(cb){const i=otAct();if(!i)return;let s=selDe(i.id)||[];s=s.filter(x=>x!==cb.value);if(cb.checked)s.push(cb.value);guardaSel(i.id,s);
 const sm=cb.closest(".pcsel").querySelector("summary b");if(sm)sm.textContent=s.length;try{ANA_C={k:"",r:null}}catch(e){}calcula()};
window.pcAbre=async function(id,np){try{gPagIni=np;await ver(id)}catch(e){}};
window.pcRehace=async function(motor){if(ST.iaRun||ST.prog||!ST.docs.length)return;motor=motor||"gemini";
 if(motor=="claude"&&!confirm("⚠️ CONSUMO DE CLAUDE\n\nEsta consulta se hace con Claude (API de Anthropic) y tiene coste por uso.\n\n¿Aceptas lanzar el cotejo con Claude?"))return;
 ST.iaEst="";
 if(!ST.res){const ok=await leer();if(!ok)return}
 ia(motor)};
/* v525: actuación más eficaz consultada → recalcular TODO con la inspección completa (o volver con quitar=true) */
/* v598: segundo parámetro = motor elegido por el técnico ("gemini" gratis o "claude" con coste) */
window.pcCompleta=async function(quitar,motor){const i=otAct();if(!i||typeof view=="undefined"||view!="tec")return;
 if(!quitar&&window.insEsBloqueo&&window.insEsBloqueo(i)){try{const l=await gLista();const s=selDe(i.id)||sugeridos(i,l);const add=id=>{if(id&&!s.includes(id))s.push(id)};
  ["PAS","AAA","HZ"].forEach(k=>{try{add(gDocId(k,l))}catch(e){}});
  const pos=String(i.pos||"");const c=l.filter(x=>/CBTH/i.test(x.name));add((c.find(x=>new RegExp("(^|\\D)"+pos+"(\\D|$)").test(x.name))||c[0]||{}).id);
  guardaSel(i.id,s);const w=$q("#gpcsel");if(w)w.remove()}catch(e){}}
 try{ANA_C={k:"",r:null}}catch(e){}ST.k="";await calcula();await pinta();
 if(!quitar&&!ST.iaRun&&!ST.prog&&ST.docs.length&&(motor||!ST.ia))pcRehace(motor||"gemini");
 try{window.dispatchEvent(new CustomEvent("pc-ia",{detail:{id:i.id}}))}catch(e){}};
window.pcEstado=()=>{try{if(!ST||!ST.cons)return "";if(ST.prog)return "⏳ "+ST.prog;if(ST.iaRun)return txIA();if(ST.iaEst)return ST.iaEst;return ""}catch(e){return ""}};
window.pcCopia=function(){const i=otAct(),o=ST.ia;if(!i||!o){msg("Todavía no hay resultado del cotejo");return}
 const t=`[Cotejo entre planos · ${ST.docs.map(d=>corto(d.name)).join(" + ")}]\n`+(o.resumen?"Causa probable: "+o.resumen+"\n":"")+
  ((o.pasos||[]).length?o.pasos.map((p,n)=>`${n+1}. ${p.accion}`+(p.medida?`\n   Medir ${p.medida.punto||""}: roja en ${p.medida.roja}, negra en ${p.medida.negra} → debe marcar ${p.medida.esperado}`:"")+(p.bien?`\n   Bien → ${p.bien}`:"")+(p.mal?`\n   Mal → ${p.mal}`:"")).join("\n"):
  (o.eficaz||[]).map((p,n)=>`${n+1}. ${p}`).join("\n")+((o.medir||[]).length?"\nMEDIR:\n"+(o.medir||[]).map(m=>`· ${m.punto}: roja en ${m.roja}, negra en ${m.negra} → debe marcar ${m.esperado}${m.si_no?". Si no → "+m.si_no:""}`).join("\n"):""));
 i.guiada=(i.guiada?i.guiada+"\n\n":"")+t;sv("pbb_inc",inc);msg(`Cotejo añadido a la Actuación guiada de la OT ${i.orden}`)};
function cajaHTML(){const R=ST.res,o=ST.ia;let h=`<summary><b>📐 Cotejo entre planos · diagnóstico de la OT</b> <span class="mu" style="font-weight:400">(${ST.docs.length} plano${ST.docs.length==1?"":"s"})</span></summary>`;
 if(!ST.docs.length)return h+`<div class="mu" style="margin:8px 0">Marca en «📐 Planos a cotejar» (arriba) los planos que intervienen en la avería.</div>`;
 h+=`<div class="pcpl">${ST.docs.map((d,n)=>`<span class="pcpn">${String.fromCharCode(65+n)}</span> ${esc(corto(d.name))}`).join("<br>")}</div>`;
 if(ST.prog)return h+`<div class="pcbar"><i style="width:${ST.pct||2}%"></i></div><div class="pcst pcbt">⏳ ${esc(ST.prog)}</div>`;
 if(R){const cs=Object.keys(R.cod);const en=cs.filter(c=>R.cod[c].some(a=>a&&a.length)),no=cs.filter(c=>!en.includes(c));
  const err=R.pl.filter(p=>!p.P);
  h+=`<details class="pccod"><summary>🔎 Dónde sale cada código · ${en.length} de ${cs.length} en los planos</summary>`+
   en.map(c=>`<div class="pcr"><b>${esc(c)}</b><span>${R.cod[c].map((a,n)=>a&&a.length?a.slice(0,3).map(np=>`<button class="pcch" onclick="event.stopPropagation();pcAbre('${esc(R.pl[n].d.id)}',${np})">${String.fromCharCode(65+n)} · p.${np}</button>`).join(""):"").join("")}</span></div>`).join("")+
   (no.length?`<div class="mu" style="font-size:11.5px;margin-top:6px">No aparecen en ningún plano elegido: ${no.map(esc).join(", ")}</div>`:"")+
   (err.length?`<div class="pcno" style="margin-top:6px">No se pudo leer: ${err.map(p=>esc(corto(p.d.name))).join(", ")}</div>`:"")+`</details>`}
 if(ST.iaRun)h+=`<div class="pcbar pcbia"><i style="width:${pctIA()}%"></i></div><div class="pcst pcbt">${esc(txIA())}</div>`;
 else if(ST.iaEst)h+=`<div class="pcst">${esc(ST.iaEst)}</div>`;
 if(o){h+=(o.resumen?`<div class="gav pcres">🎯 <b>Causa más probable:</b> ${esc(o.resumen)}</div>`:"")+
  ((o.pasos||[]).length?window.pcPasosHTML(o):"")+
  (!(o.pasos||[]).length&&(o.medir||[]).length?`<div class="anal">📏 Pasos de campo a medir</div>${o.medir.map((m,n)=>`<div class="pcm"><b>${n+1}. ${esc(m.punto)}</b><div>Polímetro: punta <b class="pcro">ROJA</b> en <b>${esc(m.roja)}</b> · punta <b>NEGRA</b> en <b>${esc(m.negra)}</b></div><div>Debe marcar <b>${esc(m.esperado)}</b></div>${m.si_no?`<div class="mu">Si no: ${esc(m.si_no)}</div>`:""}</div>`).join("")}`:"")+
  (!(o.pasos||[]).length&&(o.eficaz||[]).length?`<div class="anal">⭐ Actuación más eficaz según los planos</div><div class="gst">${o.eficaz.map((p,n)=>`<label class="gpaso"><input type="checkbox"><span><b>${n+1}.</b> ${esc(p)}</span></label>`).join("")}</div>`:"")+
  ((o.discrepancias||[]).length?`<details class="pccod pcdis"><summary>⚠️ No cuadra entre planos · ${o.discrepancias.length}</summary><ul class="pcul">${o.discrepancias.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`:"")/* v618: plegado */+
  ((o.planos||[]).length?`<details class="pccod"><summary>📄 Qué aporta cada plano</summary><ul class="pcul">${o.planos.map(p=>`<li><b>${esc(p.plano)}</b>${p.folios?" · "+esc(p.folios):""}: ${esc(p.aporta)}</li>`).join("")}</ul></details>`:"")+
  ((o.tramos||[]).length?`<div class="icav" style="margin-top:8px">🔌 Inspección completa: ${o.tramos.length} tramo${o.tramos.length==1?"":"s"} del lado de los equipos → <a href="#" onclick="event.preventDefault();event.stopPropagation();const x=document.getElementById('ginsc');if(x){x.open=true;x.scrollIntoView({block:'start',behavior:'smooth'})}">ver «Inspección cable a cable completa»</a></div>`:"")+
  `<div class="mu" style="font-size:11px;margin-top:6px">${o.cortado?"Respuesta de la IA recortada por longitud (se muestra lo recibido) · ":""}Cotejo con ${esc(o.lector||"IA")} · ${new Date(o.t||Date.now()).toLocaleString("es-ES",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}. Comprueba en campo cada dato con el plano antes de actuar.</div>
  <button class="sec" style="width:100%;margin-top:8px" onclick="pcCopia()">Pasar a «Actuación guiada» de la OT</button>`}
 if(!ST.iaRun&&!ST.prog){
  if(!R&&!o&&!ST.iaEst)h+=`<div class="mu" style="font-size:12px;margin:6px 0">El cotejo no empieza hasta que pulses el botón: lee los planos y consulta primero a Gemini (gratis).</div>`;
  if(ST.sigC)h+=`<button class="pri pcre pccl" onclick="event.stopPropagation();pcRehace('claude')">🔄 RECALCULAR IA con Claude <small>(tiene coste)</small></button><button class="sec pcre2" onclick="event.stopPropagation();pcRehace('gemini')">Reintentar con Gemini (gratis)</button>`;
  else h+=`<button class="pri pcre" onclick="event.stopPropagation();pcRehace('gemini')">🔄 RECALCULAR IA <small>(Gemini · gratis)</small></button>`+(o?`<button class="sec pcre2" onclick="event.stopPropagation();pcRehace('claude')">Consultar con Claude (tiene coste)</button>`:"")}
 return h}
/* v519: barra de progreso. Lectura: real (páginas leídas). IA: estimada por tiempo (no hay avance real), se acerca a 95 % y llega a 100 % al responder */
const motorN=()=>ST.motor=="claude"?"Claude":"Gemini (gratis)";
const pctIA=()=>{const t=(Date.now()-(ST.iaT0||Date.now()))/1000;return Math.min(95,Math.round(95*(1-Math.exp(-t/22))))};
const txIA=()=>{const t=Math.round((Date.now()-(ST.iaT0||Date.now()))/1000);return `🤖 Cruzando ${ST.docs.length} plano${ST.docs.length==1?"":"s"} con ${motorN()}… ${pctIA()} % · ${t} s${t>50?" · tarda más de lo normal":""}`};
function barra(){const b=$q("#gpcot .pcbar>i"),t=$q("#gpcot .pcbt");if(!b){pintaCaja();return}
 if(ST.iaRun){b.style.width=pctIA()+"%";if(t)t.textContent=txIA()}else if(ST.prog){b.style.width=(ST.pct||2)+"%";if(t)t.textContent="⏳ "+ST.prog}}
setInterval(()=>{if(ST.iaRun&&$q("#gpcot"))barra()},500);
function pintaCaja(){if(typeof view=="undefined"||view!="tec")return;const i=otAct();let b=$q("#gpcot");
 if(!i){if(b)b.remove();return}
 if(!b){b=document.createElement("details");b.id="gpcot";b.className="card gd pccaja";b.open=ls.g("pc_open")!=="0";
  b.addEventListener("toggle",()=>ls.s("pc_open",b.open?"1":"0"))}
 const seg=$q('#app details.gd[data-k="SEG"]'),ef=$q("#app details.gd.gef"),cab=[...document.querySelectorAll("#app .card")].find(x=>/Guía de campo/.test((x.querySelector("h3")||{}).textContent||""));
 /* v518: la caja va antes de «Seguridad antes de intervenir» */
 /* v520: justo después de la cabecera de la guía, donde está «📐 Planos a cotejar» */
 if(cab){if(cab.nextElementSibling!==b)cab.insertAdjacentElement("afterend",b)}else{const ref=seg||ef;if(ref&&b.nextElementSibling!==ref)ref.insertAdjacentElement("beforebegin",b)}
 const op=b.open;const sc=b.querySelector(".pccod[open]")?1:0;b.innerHTML=cajaHTML();b.open=op;if(sc){const c=b.querySelector(".pccod");if(c)c.open=true}}
async function pinta(forzar){try{if(typeof view=="undefined"||view!="tec")return;const i=otAct();const s=$q("#g_doc");if(!s)return;
 if(i&&!$q("#gpcsel")){const l=await gLista();if(!$q("#gpcsel")&&$q("#g_doc")){if(!selDe(i.id))guardaSel(i.id,sugeridos(i,l));
  const w=document.createElement("div");w.id="gpcsel";w.innerHTML=selHTML(i,l);$q("#g_doc").insertAdjacentElement("afterend",w)}}
 pintaCaja();calcula()}catch(e){}}
if(typeof vTec=="function"){const o=vTec;window.vTec=vTec=function(){const r=o.apply(this,arguments);setTimeout(()=>pinta(),0);return r}}

const st=document.createElement("style");st.textContent=`
.pcsel{margin-top:8px;border:1px solid var(--bd);border-radius:8px;padding:6px 10px}
.pcsel>summary{cursor:pointer;font-size:13px;font-weight:600}
.pcit{display:flex!important;gap:8px;align-items:center;padding:5px 0;font-size:13px;text-transform:none;letter-spacing:0;margin:0!important;border-top:1px dashed var(--bd)}
.pcit input{width:20px;height:20px;flex:none}.pcit span{overflow-wrap:anywhere}
.pccaja{border:2px solid #1565c0!important}
.pcpl{font-size:12px;margin:6px 0;line-height:1.6}.pcpn{display:inline-block;min-width:18px;text-align:center;border-radius:4px;background:#1565c0;color:#fff;font-weight:800;font-size:11px}
.pcst{margin:8px 0;font-size:13px}
.pccod{margin:8px 0;border:1px solid var(--bd);border-radius:8px;padding:6px 10px}.pccod>summary{cursor:pointer;font-size:12.5px;font-weight:600}
.pcr{display:grid;grid-template-columns:fit-content(40%) 1fr;gap:6px;align-items:center;padding:4px 0;border-top:1px dashed var(--bd);font-size:12px}
.pcr>span{display:flex;flex-wrap:wrap;gap:4px}
.pcch{width:auto!important;margin:0!important;padding:2px 7px!important;font-size:11px!important;border-radius:6px!important;border:1px solid #1565c0!important;background:transparent!important;color:#1565c0!important;font-weight:700}
html:not(.lt) .pcch{color:#64b5f6!important;border-color:#64b5f6!important}
.pcno{color:#c62828;font-size:11px;font-weight:700}
.pcm{margin:6px 0;padding:8px 10px;border-left:4px solid #f0a020;border-radius:6px;background:color-mix(in srgb,#f0a020 10%,transparent);font-size:13px;line-height:1.45}
.pcbar{height:10px;border-radius:6px;background:color-mix(in srgb,#1565c0 15%,transparent);overflow:hidden;margin:10px 0 4px}.pcbar>i{display:block;height:100%;background:linear-gradient(90deg,#1565c0,#42a5f5);border-radius:6px;transition:width .5s linear}.pcbia>i{background:linear-gradient(90deg,#7b2ff7,#ff6a13)}.pcbt{margin-top:2px;font-size:12.5px;font-variant-numeric:tabular-nums}
.pcre small,.pcre2{font-weight:600}.pcre2{width:100%;margin-top:6px;font-size:13px}.pccl{background:#c62828!important;border-color:#c62828!important;color:#fff!important}
.pcre{width:100%;margin-top:8px;font-weight:800;letter-spacing:.5px}.pcro{color:#e53935}.pcul{margin:4px 0;padding-left:18px;font-size:13px}.pcul li{margin:3px 0}.pcres{margin-top:8px}`;document.head.appendChild(st);
setTimeout(()=>pinta(),800);
})();
