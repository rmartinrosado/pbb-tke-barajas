/* ===== Docs Claude (v92) =====
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
 if(r.error){console.warn("docs_claude",r.error);msg("No se pudieron cargar los documentos");return}DOCS=r.data||[];dCarg=true}
window.docsCarga=docsCarga;

/* ---------- vista ---------- */
function filtrados(){const q=dTxt.trim().toLowerCase();
 return DOCS.filter(d=>(dCarp=="Todas"||d.carpeta==dCarp)&&(!q||[d.titulo,d.pos,d.tipo,d.orden,d.notas,d.autor].join(" ").toLowerCase().includes(q)))}
function fila(d){const mio=admin||(user&&d.creado_por==user.id);
 const otOk=d.ot_id&&typeof inc!="undefined"&&inc.some(i=>String(i.id)==String(d.ot_id));
 return `<div class="dcfila">
 <div class="dctit">${esc(d.titulo)}</div>
 <div class="dcmeta">${d.pos?`<span class="tag">PBB ${esc(d.pos)}</span>`:""}${d.tipo?`<span class="tag">${esc(d.tipo)}</span>`:""}${d.orden?`<span class="mu">CGA ${esc(d.orden)}</span>`:""}<span class="dccarp">${esc(d.carpeta)}</span></div>
 ${d.notas?`<div class="dcnot">${esc(d.notas)}</div>`:""}
 <div class="mu dcpie">${fFecha(d.created_at)}${d.autor?" · "+esc(d.autor):""}</div>
 <div class="dcbot">${d.url?`<button class="pri" onclick="docsAbre('${d.id}')">Abrir doc</button>`:""}${d.pdf_path?`<button class="sec" onclick="docsPdf('${d.id}')">PDF</button>`:""}${otOk?`<button class="sec" onclick="docsOT('${d.id}')">Ver OT</button>`:""}
 <span style="margin-left:auto;display:flex;gap:6px">${mio?`<button class="sec dcic" aria-label="Editar" onclick="docsForm('${d.id}')">✎</button>`:""}${admin?`<button class="sec dcic" aria-label="Borrar" onclick="docsBorra('${d.id}')">✕</button>`:""}</span></div></div>`}
function vDocs(){const app=document.getElementById("app");if(!app)return;
 if(!puede()){app.innerHTML=`<div class="card"><p class="mu">La carpeta de documentos solo está disponible en modo Técnico o Administrador.</p></div>`;return}
 const l=filtrados();const g=[];l.forEach(d=>{const m=fMes(d.created_at);let e=g.find(z=>z.m==m);if(!e)g.push(e={m,l:[]});e.l.push(d)});
 app.innerHTML=`<div class="card"><div class="row" style="align-items:center"><h3 style="margin:0">📁 Docs Claude</h3><button class="pri" style="width:auto;margin:0;padding:9px 14px" onclick="docsForm()">+ Guardar doc</button></div>
 <p class="mu" style="margin:6px 0 10px">Registro de los documentos generados con Claude Docs para su consulta.</p>
 <div class="dcbus"><span>🔍</span><input id="dcq" type="search" autocomplete="off" placeholder="PBB, nº de orden, título…" value="${esc(dTxt)}" oninput="docsQ(this.value)"></div>
 <div class="dccarps">${["Todas",...CARPETAS].map(c=>`<button class="${dCarp==c?"on":""}" onclick="docsCarp('${c}')">${c}${c=="Todas"?"":` <i>${DOCS.filter(d=>d.carpeta==c).length}</i>`}</button>`).join("")}</div></div>
 <div id="dclista">${!dCarg?`<div class="card mu">Cargando…</div>`:l.length?g.map(e=>`<div class="dcmes">${esc(e.m)}</div><div class="card dccaja">${e.l.map(fila).join("")}</div>`).join(""):`<div class="card mu">${DOCS.length?"Ningún documento coincide con la búsqueda.":"Aún no hay documentos guardados. Pulsa «+ Guardar doc» y pega el enlace del Claude Doc."}</div>`}</div>`;
 if(!dCarg)docsCarga().then(()=>{if(view=="docs")vDocs()})}
window.vDocs=vDocs;
window.docsQ=v=>{dTxt=v;const c=document.getElementById("dclista");if(!c)return vDocs();const p=document.getElementById("dcq").selectionStart;vDocs();const i=document.getElementById("dcq");if(i){i.focus();try{i.setSelectionRange(p,p)}catch(e){}}};
window.docsCarp=c=>{dCarp=c;vDocs()};
window.docsAbre=id=>{const d=DOCS.find(x=>x.id==id);if(d&&d.url)window.open(d.url,"_blank","noopener")};
window.docsPdf=async id=>{const d=DOCS.find(x=>x.id==id);if(!d||!d.pdf_path)return;const w=window.open("","_blank");
 const r=await sb.storage.from("docs_claude").createSignedUrl(d.pdf_path,600);
 if(r.error){if(w)w.close();msg("No se pudo abrir el PDF");return}if(w)w.location=r.data.signedUrl;else location.href=r.data.signedUrl};
window.docsOT=id=>{const d=DOCS.find(x=>x.id==id);if(!d)return;if(typeof bqOT!="undefined")bqOT=String(d.orden||d.pos||"");go("track","todas")};

/* ---------- alta / edición ---------- */
const otsLista=()=>(typeof inc!="undefined"&&Array.isArray(inc)?inc:[]).slice().sort((a,b)=>String(b.fecha||"").localeCompare(String(a.fecha||""))||String(b.id).localeCompare(String(a.id))).slice(0,80);
window.docsForm=(id,otId)=>{if(!puede())return;const d=id?DOCS.find(x=>x.id==id):null;dEdit=d?d.id:null;
 const o=otId&&typeof inc!="undefined"?inc.find(i=>String(i.id)==String(otId)):null;
 const v=k=>esc(d?(d[k]||""):o?({pos:o.pos,tipo:o.tipo,orden:o.orden,ot_id:o.id})[k]||"":"");
 $("#sheetc").innerHTML=`<h3 style="margin-top:0">${d?"Editar documento":"Guardar documento de Claude"}</h3>
 <label>OT asociada (rellena PBB, tipo y orden)</label><select id="dc_ot" onchange="docsDeOT(this.value)"><option value="">— Sin OT —</option>${otsLista().map(i=>`<option value="${esc(String(i.id))}" ${String(d?d.ot_id:o?o.id:"")==String(i.id)?"selected":""}>PBB ${esc(String(i.pos))} · ${esc(i.tipo)} · ${esc(String(i.orden||""))} · ${esc(i.fecha||"")}${i.estado=="abierta"?" · abierta":""}</option>`).join("")}</select>
 <label>Título</label><input id="dc_t" value="${v("titulo")}" placeholder="PBB 579 · PAS · Orden 600600 – Sirena y portón">
 <label>Enlace del Claude Doc</label><input id="dc_u" type="url" inputmode="url" value="${v("url")}" placeholder="https://claude.ai/artifact/…">
 <label>PDF exportado (opcional)${d&&d.pdf_path?" · ya hay uno guardado":""}</label><input id="dc_f" type="file" accept="application/pdf,.pdf">
 <div style="display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:8px"><div><label>PBB</label><input id="dc_p" value="${v("pos")}" placeholder="579"></div>
 <div><label>Tipo</label><input id="dc_ti" value="${v("tipo")}" placeholder="PAS"></div><div><label>Nº orden CGA</label><input id="dc_o" inputmode="numeric" value="${v("orden")}"></div></div>
 <label>Carpeta</label><select id="dc_c">${CARPETAS.map(c=>`<option ${((d&&d.carpeta)||"Resoluciones")==c?"selected":""}>${c}</option>`).join("")}</select>
 <label>Notas</label><textarea id="dc_n" rows="3" placeholder="Resumen de la avería o de lo que contiene">${v("notas")}</textarea>
 <button class="pri" id="dc_g" style="margin-top:14px" onclick="docsGuarda()">💾 Guardar</button>
 <button class="sec" style="width:100%;margin-top:8px" onclick="closeSheet()">Cancelar</button>`;
 $("#sheet").style.display="flex";
 if(o&&!d)docsDeOT(o.id)};
window.docsDeOT=otId=>{const o=(typeof inc!="undefined"?inc:[]).find(i=>String(i.id)==String(otId));if(!o)return;
 $("#dc_p").value=o.pos||"";$("#dc_ti").value=o.tipo||"";$("#dc_o").value=o.orden||"";
 if(!$("#dc_t").value.trim())$("#dc_t").value=`PBB ${o.pos} · ${o.tipo} · Orden ${o.orden||""}${o.desc?" – "+String(o.desc).slice(0,60):""}`;
 if(!$("#dc_n").value.trim()&&o.desc)$("#dc_n").value=o.desc};
window.docsGuarda=async()=>{const b=$("#dc_g");const t=$("#dc_t").value.trim(),u=$("#dc_u").value.trim(),f=$("#dc_f").files[0];
 const prev=dEdit?DOCS.find(x=>x.id==dEdit):null;
 if(!t){msg("Pon un título");return}
 if(u&&!/^https:\/\/([a-z]+\.)?claude\.ai\//i.test(u)){msg("El enlace debe ser de claude.ai (https://claude.ai/artifact/…)");return}
 if(!u&&!f&&!(prev&&prev.pdf_path)){msg("Pega el enlace del Claude Doc o adjunta el PDF");return}
 b.disabled=true;b.textContent="Guardando…";
 let pdf=prev?prev.pdf_path:null;
 if(f){const path=Date.now()+"_"+f.name.replace(/[^\w.\-]/g,"_");const r=await sb.storage.from("docs_claude").upload(path,f,{contentType:"application/pdf"});
  if(r.error){msg("No se pudo subir el PDF: "+r.error.message);b.disabled=false;b.textContent="💾 Guardar";return}pdf=path}
 const fila={titulo:t,url:u||null,pdf_path:pdf,pos:$("#dc_p").value.trim()||null,tipo:$("#dc_ti").value.trim().toUpperCase()||null,orden:$("#dc_o").value.trim()||null,
  ot_id:$("#dc_ot").value||null,carpeta:$("#dc_c").value,notas:$("#dc_n").value.trim()||null};
 const r=prev?await sb.from("docs_claude").update(fila).eq("id",prev.id).select()
  :await sb.from("docs_claude").insert({...fila,autor:(typeof tecNombre!="undefined"&&tecNombre)||user.email}).select();
 if(r.error||!r.data||!r.data.length){msg("No se pudo guardar: "+((r.error&&r.error.message)||"sin permiso"));b.disabled=false;b.textContent="💾 Guardar";return}
 closeSheet();await docsCarga(true);msg(prev?"Documento actualizado ✔":"Documento guardado en Docs ✔");if(view=="docs")vDocs();else go("docs")};
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
  b.innerHTML=`<span>${IC_DOCS}</span>Docs`;b.onclick=()=>go("docs");const ref=[...nav.children].find(x=>/Guía/.test(x.textContent));nav.insertBefore(b,ref||null)}
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
.dcbot .dcic{width:36px;height:36px;padding:0;display:flex;align-items:center;justify-content:center}`;document.head.appendChild(st)})();
})();
