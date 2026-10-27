/* ===== Casos (antes «Docs», v94; búsqueda en todo el texto v95) =====
 Carpeta de registro y consulta de los documentos generados con Claude Docs (resoluciones de averías, procedimientos…).
 - Pestaña «Docs» en la barra inferior, solo en modo Técnico y Administrador.
 - Cada documento guarda: título, enlace al Claude Doc, PDF exportado (opcional), PBB, tipo, nº de orden CGA, OT asociada, carpeta y notas.
 - Datos en Supabase: tabla «docs_claude» y bucket privado «docs_claude» (PDF).
 - Técnicos y admin ven y guardan; el autor o el admin editan; solo el admin borra. */
(function(){
const CARPETAS=["Resoluciones","Procedimientos","Mantenimiento","Otros"];
let DOCS=[],dCarg=false,dCarp="Todas",dTxt="",dEdit=null;
const puede=()=>typeof user!="undefined"&&user&&(tecnico||admin);
const fFecha=s=>{const d=new Date(s);return d.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})+" "+d.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})};
const fMes=s=>{const d=new Date(s);return d.toLocaleDateString("es-ES",{month:"long",year:"numeric"})};
const IC_DOCS=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/><path d="M8 13.5h8M8 16.5h5"/></svg>`;

async function docsCarga(forzar){if(dCarg&&!forzar)return;if(typeof sb=="undefined"||!sb||!puede())return;
 const r=await sb.from("docs_claude").select("*").order("created_at",{ascending:false});
 if(r.error){console.warn("docs_claude",r.error);msg("No se pudieron cargar los documentos");return}DOCS=r.data||[];dCarg=true;setTimeout(reindexa,1500)}
window.docsCarga=docsCarga;

/* ---------- vista ---------- */
/* v95: búsqueda en todo el texto del caso: título, notas, registro (descripción, actuación, observaciones),
 texto del documento (o del PDF), datos de la OT asociada (definición, comentario, actuación, observaciones, equipos, alarmas)
 y relación sistema → componentes (p. ej. «portón» encuentra E-K81, C-M6, C-S9…). Sin tildes, sin guiones y con todas las palabras. */
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const cmp=s=>nrm(s).replace(/[^a-z0-9]/g,"");
const textos=v=>{const o=[];const r=x=>{if(x==null)return;if(typeof x=="string"){if(!/^data:/.test(x)&&x.length<20000)o.push(x)}else if(typeof x=="number")o.push(String(x));else if(Array.isArray(x))x.forEach(r);else if(typeof x=="object")Object.keys(x).forEach(k=>{if(!/^(plc|foto|img|imagen|id)$/i.test(k))r(x[k])})};r(v);return o.join(" · ")};
const otDe=d=>d.ot_id&&typeof inc!="undefined"&&Array.isArray(inc)?inc.find(i=>String(i.id)==String(d.ot_id)):null;
const regTxt=r=>r?[r.desc,r.act,r.obs,r.rep].filter(Boolean).join(" · "):"";
function camposDe(d){const o=otDe(d);const r=d.registro||{};
 return [["Título",d.titulo],["PBB",[d.pos,d.tipo,d.orden&&"CGA "+d.orden,d.carpeta,d.autor].filter(Boolean).join(" ")],["Notas",d.notas],["Descripción",r.desc],["Actuación",r.act],["Observaciones",r.obs],["Reportado por",r.rep],
  ["Documento",d.contenido],["OT",o?textos({desc:o.desc,def:o.def,com:o.com,act:o.act,obs:o.obs,equipos:o.equipos,alarmas:o.alarmas,aap:o.aap,guiada:o.guiada,integrantes:o.integrantes,tecnico:o.tecnico}):""]].filter(x=>x[1])}
/* índice sistema → componentes desde la guía (window.SIS) */
let SINON=null;
const COD=/\b[A-Z]{1,4}-[A-Z]{1,3}\d+[A-Z]?\b/g,ESPLC=/^[EP]-A\d+$/;
function sinonimos(){if(SINON)return SINON;SINON=[];const S=window.SIS||{};
 Object.keys(S).forEach(t=>(S[t]||[]).forEach(g=>{const lin=(g.c||[]).map(String);const cods=new Set();lin.forEach(l=>(l.match(COD)||[]).forEach(c=>{if(!ESPLC.test(c))cods.add(c)}));
  SINON.push({k:nrm(g.s),c:[...cods]});lin.forEach(l=>{const cs=(l.match(COD)||[]).filter(c=>!ESPLC.test(c));if(cs.length)SINON.push({k:nrm(l.replace(COD," ")),c:cs})})}));return SINON}
const RAIZ=w=>w.length>5?w.replace(/(es|s)$/,""):w;
function expande(tok){if(tok.length<4||/\d/.test(tok))return [];const r=RAIZ(tok);const c=new Set();
 sinonimos().forEach(e=>{if(new RegExp("\\b"+r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).test(e.k))e.c.forEach(x=>c.add(x))});return [...c].slice(0,40)}
let ULT={};
function buscaEn(d,toks){const cs=camposDe(d);const all=cs.map(x=>x[1]).join(" · ");const N=nrm(all),C=cmp(all);let pts=0;const vias=[];
 for(const t of toks){const tc=cmp(t.q);
  if(N.includes(t.q)||(tc.length>=3&&C.includes(tc))){pts+=2;continue}
  const v=t.alt.find(a=>C.includes(cmp(a)));if(v){pts+=1;vias.push(t.q+" → "+v);continue}
  return null}
 return {pts,vias,cs}}
function filtrados(){const q=nrm(dTxt).trim();ULT={};
 const base=DOCS.filter(d=>dCarp=="Todas"||d.carpeta==dCarp);if(!q)return base;
 const toks=q.split(/\s+/).filter(Boolean).map(w=>({q:w,alt:expande(w)}));
 return base.map(d=>{const m=buscaEn(d,toks);if(m)ULT[d.id]={...m,toks};return m?{d,p:m.pts}:null}).filter(Boolean).sort((a,b)=>b.p-a.p).map(x=>x.d)}
/* fragmento con la coincidencia resaltada: el campo que reúne más palabras buscadas (admite «ek81» = «E-K81») */
const flex=w=>new RegExp(cmp(w).split("").map(c=>c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("[^a-z0-9]{0,2}"));
function frag(d){const u=ULT[d.id];if(!u)return "";let mejor=null;
 for(const[nom,txt]of u.cs){if(nom=="Título"||nom=="Notas"||nom=="PBB")continue;const N=nrm(txt);let n=0,at=-1,len=0;
  for(const t of u.toks){let m=null;for(const c of [t.q,...t.alt]){const cc=cmp(c);if(cc.length<2)continue;m=N.match(flex(c));if(m)break}
   if(m){n++;if(at<0){at=m.index;len=m[0].length}}}
  if(n&&(!mejor||n>mejor.n))mejor={n,nom,txt,at,len}}
 if(!mejor)return u.vias.length?`<div class="dcfrag"><b>Relacionado:</b> ${esc(u.vias.join(" · "))}</div>`:"";
 const{nom,txt,at,len}=mejor;const a=Math.max(0,at-50),b=Math.min(txt.length,at+len+70);
 return `<div class="dcfrag"><b>${esc(nom)}:</b> ${a?"…":""}${esc(txt.slice(a,at))}<mark>${esc(txt.slice(at,at+len))}</mark>${esc(txt.slice(at+len,b))}${b<txt.length?"…":""}${u.vias.length?`<div class="mu" style="font-size:11px;margin-top:3px">Relacionado: ${esc(u.vias.join(" · "))}</div>`:""}</div>`}
function fila(d){const mio=admin||(user&&d.creado_por==user.id);
 const otOk=d.ot_id&&typeof inc!="undefined"&&inc.some(i=>String(i.id)==String(d.ot_id));
 return `<div class="dcfila">
 <div class="dctit">${esc(d.titulo)}</div>
 <div class="dcmeta">${d.pos?`<span class="tag">PBB ${esc(d.pos)}</span>`:""}${d.tipo?`<span class="tag">${esc(d.tipo)}</span>`:""}${d.orden?`<span class="mu">CGA ${esc(d.orden)}</span>`:""}<span class="dccarp">${esc(d.carpeta)}</span></div>
 ${d.registro&&(d.registro.hIni||d.registro.hCie)?`<div class="mu dcpie">⏱ ${esc(d.registro.hIni||"–")} → ${esc(d.registro.hLle||"–")} → ${esc(d.registro.hCie||"–")}${d.registro.rep?" · "+esc(d.registro.rep):""}</div>`:""}${d.notas?`<div class="dcnot">${esc(d.notas)}</div>`:""}
 ${frag(d)}<div class="mu dcpie">${fFecha(d.created_at)}${d.autor?" · "+esc(d.autor):""}</div>
 <div class="dcbot">${d.url?`<button class="pri" onclick="docsAbre('${d.id}')">Abrir doc</button>`:""}${d.pdf_path?`<button class="sec" onclick="docsPdf('${d.id}')">PDF</button>`:""}${otOk?`<button class="sec" onclick="docsOT('${d.id}')">Ver OT</button>`:""}
 <span style="margin-left:auto;display:flex;gap:6px">${mio?`<button class="sec dcic" aria-label="Editar" onclick="docsForm('${d.id}')">✎</button>`:""}${admin?`<button class="sec dcic" aria-label="Borrar" onclick="docsBorra('${d.id}')">✕</button>`:""}</span></div></div>`}
function vDocs(){const app=document.getElementById("app");if(!app)return;
 if(!puede()){app.innerHTML=`<div class="card"><p class="mu">La carpeta Casos solo está disponible en modo Técnico o Administrador.</p></div>`;return}
 const l=filtrados();const g=[];l.forEach(d=>{const m=fMes(d.created_at);let e=g.find(z=>z.m==m);if(!e)g.push(e={m,l:[]});e.l.push(d)});
 app.innerHTML=`<div class="card"><div class="row" style="align-items:center"><h3 style="margin:0">📁 Casos</h3><button class="pri" style="width:auto;margin:0;padding:9px 14px" onclick="docsForm()">+ Guardar doc</button></div>
 <p class="mu" style="margin:6px 0 10px">Registro de los documentos generados con Claude Docs para su consulta.</p>
 <div class="dcbus"><span>🔍</span><input id="dcq" type="search" autocomplete="off" placeholder="PBB, orden, avería, actuación, componente (E-K81), sistema…" value="${esc(dTxt)}" oninput="docsQ(this.value)"></div>
 <div class="dccarps">${["Todas",...CARPETAS].map(c=>`<button class="${dCarp==c?"on":""}" onclick="docsCarp('${c}')">${c}${c=="Todas"?"":` <i>${DOCS.filter(d=>d.carpeta==c).length}</i>`}</button>`).join("")}</div></div>
 ${dTxt.trim()&&dCarg?`<div class="mu" style="margin:6px 4px 0;font-size:12px">${l.length} caso${l.length==1?"":"s"} con «${esc(dTxt.trim())}»</div>`:""}<div id="dclista">${!dCarg?`<div class="card mu">Cargando…</div>`:l.length?g.map(e=>`<div class="dcmes">${esc(e.m)}</div><div class="card dccaja">${e.l.map(fila).join("")}</div>`).join(""):`<div class="card mu">${DOCS.length?"Ningún documento coincide con la búsqueda.":"Aún no hay documentos guardados. Pulsa «+ Guardar doc» y pega el enlace del Claude Doc."}</div>`}</div>`;
 if(!dCarg)docsCarga().then(()=>{if(view=="docs")vDocs()})}
window.vDocs=vDocs;
window.docsQ=v=>{dTxt=v;const c=document.getElementById("dclista");if(!c)return vDocs();const p=document.getElementById("dcq").selectionStart;vDocs();const i=document.getElementById("dcq");if(i){i.focus();try{i.setSelectionRange(p,p)}catch(e){}}};
window.docsCarp=c=>{dCarp=c;vDocs()};
window.docsAbre=id=>{const d=DOCS.find(x=>x.id==id);if(d&&d.url)window.open(d.url,"_blank","noopener")};
window.docsPdf=async id=>{const d=DOCS.find(x=>x.id==id);if(!d||!d.pdf_path)return;const w=window.open("","_blank");
 const r=await sb.storage.from("docs_claude").createSignedUrl(d.pdf_path,600,{download:nomPdf(d.registro||{pos:d.pos,tipo:d.tipo,orden:d.orden,fecha:String(d.created_at||"").slice(0,10)})});
 if(r.error){if(w)w.close();msg("No se pudo abrir el PDF");return}if(w)w.location=r.data.signedUrl;else location.href=r.data.signedUrl};
window.docsOT=id=>{const d=DOCS.find(x=>x.id==id);if(!d)return;if(typeof bqOT!="undefined")bqOT=String(d.orden||d.pos||"");go("track","todas")};

/* ---------- alta / edición (v93: ficha de revisión editable antes de guardar) ---------- */
const otsLista=()=>(typeof inc!="undefined"&&Array.isArray(inc)?inc:[]).slice().sort((a,b)=>String(b.fecha||"").localeCompare(String(a.fecha||""))||String(b.id).localeCompare(String(a.id))).slice(0,80);
const REPS=["CGA","Responsable de Turno","Otro"];
const TIPOS_D=()=>typeof TIPOS!="undefined"?TIPOS:["PAS","AAA","AAP","HZ"];
const POS_D=()=>typeof POS!="undefined"?POS:[];
const hoyISO=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const limpia=x=>String(x||"").trim().replace(/[^\w\-]/g,"");
const nomPdf=r=>`PBB${limpia(r.pos)||"X"}_${limpia(r.tipo)||"X"}_${limpia(r.orden)||"sin-orden"}_${r.fecha||hoyISO()}.pdf`;
const regDeOT=o=>o?{pos:String(o.pos||""),tipo:o.tipo||"",orden:String(o.orden||""),rep:o.rep||"CGA",fecha:o.fecha||"",desc:o.desc||"",hIni:o.hIni||"",hLle:o.hLle||"",hCie:o.hCie||"",act:o.act||"",obs:o.obs||""}:null;
function campoReg(r){r=r||{rep:"CGA",fecha:hoyISO()};const repSel=REPS.includes(r.rep)?r.rep:(r.rep?"Otro":"CGA");const repOtro=REPS.includes(r.rep)?"":(r.rep||"");
 return `<details class="dcreg" open><summary>📝 Datos del registro <span class="mu">(revisa y corrige antes de guardar)</span></summary>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
  <div><label>Posición PBB</label><input id="dr_pos" list="dr_posl" inputmode="numeric" value="${esc(r.pos||"")}" placeholder="Lista o teclado" oninput="docsNom()"><datalist id="dr_posl">${POS_D().map(p=>`<option value="${esc(String(p))}">`).join("")}</datalist></div>
  <div><label>Tipo de aviso</label><select id="dr_tipo" onchange="docsNom()">${TIPOS_D().map(t=>`<option ${t==r.tipo?"selected":""}>${t}</option>`).join("")}</select></div>
  <div><label>Nº de orden CGA</label><input id="dr_ord" inputmode="numeric" value="${esc(r.orden||"")}" oninput="docsNom()"></div>
  <div><label>Fecha</label><input id="dr_f" type="date" value="${esc(r.fecha||hoyISO())}" onchange="docsNom()"></div></div>
 <label>Reportado por</label><select id="dr_rep" onchange="$('#dr_repo').style.display=this.value=='Otro'?'block':'none'">${REPS.map(x=>`<option ${x==repSel?"selected":""}>${x}</option>`).join("")}</select>
 <input id="dr_repo" value="${esc(repOtro)}" placeholder="¿Quién lo reporta?" style="display:${repSel=="Otro"?"block":"none"};margin-top:6px">
 <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
  <div><label>H. inicio</label><input id="dr_hi" type="time" value="${esc(r.hIni||"")}"></div>
  <div><label>H. llegada</label><input id="dr_hl" type="time" value="${esc(r.hLle||"")}"></div>
  <div><label>H. cierre</label><input id="dr_hc" type="time" value="${esc(r.hCie||"")}"></div></div>
 <label>Descripción de la incidencia</label><textarea id="dr_d" rows="2">${esc(r.desc||"")}</textarea>
 <label>Actuación</label><textarea id="dr_a" rows="3">${esc(r.act||"")}</textarea>
 <label>Observaciones</label><textarea id="dr_o" rows="2">${esc(r.obs||"")}</textarea>
 <label class="dcchk"><input type="checkbox" id="dr_ot"> Aplicar también estos cambios a la OT asociada</label>
 <div class="mu" style="font-size:12px;margin-top:6px">PDF: <b id="dr_nom">${esc(nomPdf(r))}</b></div></details>`}
const leeReg=()=>{const rep=$("#dr_rep").value=="Otro"?($("#dr_repo").value.trim()||"Otro"):$("#dr_rep").value;
 return {pos:$("#dr_pos").value.trim(),tipo:$("#dr_tipo").value,orden:$("#dr_ord").value.trim(),rep,fecha:$("#dr_f").value,desc:$("#dr_d").value.trim(),hIni:$("#dr_hi").value,hLle:$("#dr_hl").value,hCie:$("#dr_hc").value,act:$("#dr_a").value.trim(),obs:$("#dr_o").value.trim()}};
window.docsNom=()=>{const e=$("#dr_nom");if(e)e.textContent=nomPdf(leeReg());
 const t=$("#dc_t");if(t&&t.dataset.auto=="1"){const r=leeReg();t.value=`PBB ${r.pos} · ${r.tipo} · Orden ${r.orden}${r.desc?" – "+r.desc.slice(0,60):""}`}};
window.docsForm=(id,otId)=>{if(!puede())return;const d=id?DOCS.find(x=>x.id==id):null;dEdit=d?d.id:null;
 const o=otId&&typeof inc!="undefined"?inc.find(i=>String(i.id)==String(otId)):null;
 const v=k=>esc(d?(d[k]||""):"");
 const reg=(d&&d.registro)||regDeOT(o)||(d?{pos:d.pos,tipo:d.tipo,orden:d.orden,rep:"CGA",fecha:String(d.created_at||"").slice(0,10)}:null);
 $("#sheetc").innerHTML=`<h3 style="margin-top:0">${d?"Editar documento":"Guardar documento de Claude"}</h3>
 <label>OT asociada (rellena el registro)</label><select id="dc_ot" onchange="docsDeOT(this.value)"><option value="">— Sin OT —</option>${otsLista().map(i=>`<option value="${esc(String(i.id))}" ${String(d?d.ot_id:o?o.id:"")==String(i.id)?"selected":""}>PBB ${esc(String(i.pos))} · ${esc(i.tipo)} · ${esc(String(i.orden||""))} · ${esc(i.fecha||"")}${i.estado=="abierta"?" · abierta":""}</option>`).join("")}</select>
 <div id="dc_regw">${campoReg(reg)}</div>
 <label>Título</label><input id="dc_t" value="${v("titulo")}" data-auto="${d?"0":"1"}" oninput="this.dataset.auto='0'" placeholder="PBB 579 · PAS · Orden 600600 – Sirena y portón">
 <label>Enlace del Claude Doc</label><input id="dc_u" type="url" inputmode="url" value="${v("url")}" placeholder="https://claude.ai/artifact/…">
 <label>PDF exportado (opcional)${d&&d.pdf_path?" · ya hay uno guardado":""}</label><input id="dc_f" type="file" accept="application/pdf,.pdf">
 <details class="dcreg" ${d&&d.contenido?"":""}><summary>🔎 Texto del documento <span class="mu">(para la búsqueda; se rellena solo con el PDF)</span></summary><textarea id="dc_x" rows="5" placeholder="Pega aquí el texto del Claude Doc: diagnóstico, comprobaciones, componentes, cableado…">${esc(d&&d.contenido||"")}</textarea></details>
 <label>Carpeta</label><select id="dc_c">${CARPETAS.map(c=>`<option ${((d&&d.carpeta)||"Resoluciones")==c?"selected":""}>${c}</option>`).join("")}</select>
 <label>Notas</label><textarea id="dc_n" rows="2" placeholder="Resumen de la avería o de lo que contiene">${v("notas")}</textarea>
 <button class="pri" id="dc_g" style="margin-top:14px" onclick="docsGuarda()">💾 Guardar</button>
 <button class="sec" style="width:100%;margin-top:8px" onclick="closeSheet()">Cancelar</button>`;
 $("#sheet").style.display="flex";if(!d)docsNom()};
window.docsDeOT=otId=>{const o=(typeof inc!="undefined"?inc:[]).find(i=>String(i.id)==String(otId));if(!o)return;
 $("#dc_regw").innerHTML=campoReg(regDeOT(o));if(!$("#dc_n").value.trim()&&o.desc)$("#dc_n").value=o.desc;docsNom()};
window.docsGuarda=async()=>{const b=$("#dc_g");const t=$("#dc_t").value.trim(),u=$("#dc_u").value.trim(),f=$("#dc_f").files[0];
 const prev=dEdit?DOCS.find(x=>x.id==dEdit):null;const reg=leeReg();const otId=$("#dc_ot").value||null;
 if(!reg.pos){msg("Indica la posición PBB");$("#dr_pos").focus();return}
 if(!reg.orden){msg("Indica el nº de orden CGA");$("#dr_ord").focus();return}
 if(reg.hIni&&reg.hLle&&reg.hLle<reg.hIni&&!confirm("La hora de llegada es anterior a la de inicio. ¿Guardar igualmente (cambio de día)?"))return;
 if(!t){msg("Pon un título");return}
 if(u&&!/^https:\/\/([a-z]+\.)?claude\.ai\//i.test(u)){msg("El enlace debe ser de claude.ai (https://claude.ai/artifact/…)");return}
 if(!u&&!f&&!(prev&&prev.pdf_path)){msg("Pega el enlace del Claude Doc o adjunta el PDF");return}
 b.disabled=true;b.textContent="Guardando…";
 let pdf=prev?prev.pdf_path:null;
 if(f){const path=Date.now()+"_"+nomPdf(reg);const r=await sb.storage.from("docs_claude").upload(path,f,{contentType:"application/pdf"});
  if(r.error){msg("No se pudo subir el PDF: "+r.error.message);b.disabled=false;b.textContent="💾 Guardar";return}pdf=path}
 let cont=$("#dc_x")?$("#dc_x").value.trim():"";
 if(f&&!cont){b.textContent="Leyendo el PDF…";cont=await textoPdf(f)}
 const fila={contenido:cont||(prev&&prev.contenido)||null,titulo:t,url:u||null,pdf_path:pdf,pos:reg.pos,tipo:reg.tipo,orden:reg.orden,ot_id:otId,carpeta:$("#dc_c").value,notas:$("#dc_n").value.trim()||null,registro:reg};
 const r=prev?await sb.from("docs_claude").update(fila).eq("id",prev.id).select()
  :await sb.from("docs_claude").insert({...fila,autor:(typeof tecNombre!="undefined"&&tecNombre)||user.email}).select();
 if(r.error||!r.data||!r.data.length){msg("No se pudo guardar: "+((r.error&&r.error.message)||"sin permiso"));b.disabled=false;b.textContent="💾 Guardar";return}
 let otMsg="";
 if($("#dr_ot").checked&&otId&&typeof inc!="undefined"){const i=inc.find(x=>String(x.id)==String(otId));
  if(i){Object.assign(i,{pos:isNaN(+reg.pos)?reg.pos:(typeof i.pos=="number"?+reg.pos:reg.pos),tipo:reg.tipo,orden:reg.orden,rep:reg.rep,fecha:reg.fecha||i.fecha,desc:reg.desc,hIni:reg.hIni,hLle:reg.hLle,hCie:reg.hCie,act:reg.act,obs:reg.obs});sv("pbb_inc",inc);otMsg=" y OT actualizada"}}
 closeSheet();await docsCarga(true);msg((prev?"Documento actualizado":"Documento guardado en Casos")+otMsg+" ✔");if(view=="docs")vDocs();else go("docs")};
async function textoPdf(blob){try{if(typeof cargaLib=="function")await cargaLib();if(!window.pdfjsLib)return "";
 const doc=await pdfjsLib.getDocument({data:new Uint8Array(await blob.arrayBuffer())}).promise;const o=[];
 for(let p=1;p<=Math.min(doc.numPages,40);p++){const tc=await (await doc.getPage(p)).getTextContent();o.push(tc.items.map(x=>x.str).join(" "))}
 return o.join("\n").replace(/[ \t]+/g," ").trim().slice(0,60000)}catch(e){console.warn("texto PDF",e);return ""}}
/* PDF ya guardados sin texto: se leen en segundo plano para que entren en la búsqueda (solo autor o admin) */
let reind=false;async function reindexa(){if(reind)return;reind=true;
 for(const d of DOCS.filter(x=>x.pdf_path&&!x.contenido&&(admin||(user&&x.creado_por==user.id))).slice(0,5)){
  const dl=await sb.storage.from("docs_claude").download(d.pdf_path);if(dl.error)continue;const t=await textoPdf(dl.data);if(!t)continue;
  const r=await sb.from("docs_claude").update({contenido:t}).eq("id",d.id).select();if(!r.error&&r.data&&r.data[0])d.contenido=t}
 if(view=="docs"&&dTxt.trim())vDocs()}
window.docsBorra=async id=>{const d=DOCS.find(x=>x.id==id);if(!d||!admin)return;if(!confirm(`¿Borrar «${d.titulo}» de la carpeta? El Claude Doc no se borra.`))return;
 const r=await sb.from("docs_claude").delete().eq("id",id).select();
 if(r.error||!r.data||!r.data.length){msg("No se pudo borrar (solo el administrador)");return}
 if(d.pdf_path)await sb.storage.from("docs_claude").remove([d.pdf_path]);
 DOCS=DOCS.filter(x=>x.id!=id);msg("Documento borrado");vDocs()};

/* ---------- integración: pestaña en la barra inferior (T y A) ---------- */
(function(){const o=render;render=function(){const esD=view=="docs";if(esD&&!puede())view="dash";const esV=view=="docs";if(esV)view="dash";
 const r=o.apply(this,arguments);if(esV){view="docs";vDocs()}
 const nav=document.getElementById("nav");
 if(nav&&puede()&&!nav.querySelector("[data-docs]")){const b=document.createElement("button");b.dataset.docs="1";b.className=view=="docs"?"on":"";
  b.innerHTML=`<span>${IC_DOCS}</span>Casos`;b.onclick=()=>go("docs");const ref=[...nav.children].find(x=>/Guía/.test(x.textContent));nav.insertBefore(b,ref||null)}
 if(esV&&nav)[...nav.children].forEach(x=>{if(!x.dataset.docs)x.classList.remove("on")});
 return r}})();

(function(){const st=document.createElement("style");st.textContent=`
.dcbus{display:flex;align-items:center;gap:6px;border:2px solid var(--pr);border-radius:12px;padding:2px 10px;background:var(--card)}
.dcbus input{flex:1;min-width:0;border:0!important;background:transparent!important;font-size:16px;padding:9px 2px;outline:none;box-shadow:none!important}
.dccarps{display:flex;gap:6px;overflow-x:auto;margin-top:10px;padding-bottom:2px}
.dccarps button{flex:none;width:auto;margin:0;padding:6px 12px;border-radius:999px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-size:13px}
.dccarps button.on{background:var(--pr);border-color:var(--pr);color:var(--prt);font-weight:700}.dccarps i{font-style:normal;opacity:.7;font-size:11px}
.dcmes{font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin:14px 4px 6px}
.dccaja{padding:0!important}.dcfila{padding:12px 14px;border-top:1px solid var(--bd)}.dcfila:first-child{border-top:0}
.dctit{font-weight:700;font-size:15px;line-height:1.3}
.dcmeta{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:5px}.dccarp{font-size:11px;color:var(--ac);font-weight:700;margin-left:auto}
.dcnot{font-size:13px;margin-top:6px;line-height:1.4}.dcpie{font-size:12px;margin-top:4px}
.dcbot{display:flex;align-items:center;gap:6px;margin-top:8px}.dcbot button{width:auto;margin:0;padding:8px 14px;font-size:14px}
.dcreg{border:1px solid var(--bd);border-radius:12px;padding:8px 10px;margin-top:12px}.dcreg summary{font-weight:700;cursor:pointer}.dcreg summary .mu{font-weight:400;font-size:12px}
.dcchk{display:flex;align-items:center;gap:8px;margin-top:10px;font-weight:600}.dcchk input{width:auto;margin:0}
.dcfrag{font-size:12.5px;margin-top:6px;line-height:1.4;padding:6px 8px;border-left:3px solid var(--ac);background:color-mix(in srgb,var(--ac) 8%,transparent);border-radius:0 6px 6px 0;overflow-wrap:anywhere}
.dcfrag mark{background:color-mix(in srgb,var(--ac) 35%,transparent);color:inherit;border-radius:3px;padding:0 1px}
.dcreg textarea{margin-top:8px}
.dcbot .dcic{width:36px;height:36px;padding:0;display:flex;align-items:center;justify-content:center}`;document.head.appendChild(st)})();
})();
