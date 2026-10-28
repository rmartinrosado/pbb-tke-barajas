/* ===== Mantenimiento preventivo PBB (v40) =====
 Programa de mantenimientos M (mensual) y S (semestral) por posición y día, guardado en Supabase (tabla «mantenimientos»).
 - Pestaña «Mant.»: hoy, calendario del mes y detalle del día. Técnicos y admin marcan «Hecho».
 - Inicio: aviso con las posiciones que tocan hoy.
 - Admin: importar el programa desde foto (OCR), PDF, Excel o CSV → revisión editable → guardar. También alta manual y borrado. */
(function(){
const MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DIAS=["L","M","X","J","V","S","D"];
let MANT=[],mCarg=false,mMes=null,mSel=null,mTxt="",mImpMes=null,mImpTipo="M",mOcup=false,mEvt="";
/* Evento SGC de AENA del día elegido (o de hoy, o el más cercano con evento) */
function evtDe(f){const c=x=>x.evento;let l=MANT.filter(x=>x.fecha==f&&c(x));if(!l.length)l=MANT.filter(x=>x.fecha==hoy()&&c(x));if(!l.length){const t=+new Date(f);l=MANT.filter(c).sort((a,b)=>Math.abs(+new Date(a.fecha)-t)-Math.abs(+new Date(b.fecha)-t))}return l.length?l[0].evento:""}
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const hoy=()=>iso(new Date());
const fLarga=s=>{const[y,m,d]=s.split("-").map(Number);const f=new Date(y,m-1,d);return ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"][f.getDay()]+" "+d+" de "+MESES[m-1]};
const hk=h=>{if(!h)return 9999;const[a,b]=String(h).split(":").map(Number);return a*60+(b||0)};
/* v48: orden por terminal (T4, T4S, T123) y después por número de PBB */
const tOrd=x=>{const i=["T4","T4S","T123"].indexOf(termMant(x.pos));return i<0?9:i};
const pNum=x=>String(x.pos).replace(/^T/i,"");
const delDia=s=>MANT.filter(x=>x.fecha==s).sort((a,b)=>tOrd(a)-tOrd(b)||pNum(a).localeCompare(pNum(b),undefined,{numeric:true})||a.tipo.localeCompare(b.tipo)||hk(a.hora_ini)-hk(b.hora_ini));
/* v58: cada terminal es una caja plegada; en su línea se ven las posiciones (con M/S y ✔ si están hechas) */
const mTAb=new Set();
window.mantTT=(k,o)=>{o?mTAb.add(k):mTAb.delete(k)};
const listaTerm=l=>{const g=[];l.forEach(x=>{const t=termMant(x.pos);let e=g.find(z=>z.t==t);if(!e)g.push(e={t,l:[]});e.l.push(x)});
 const f=(l[0]&&l[0].fecha)||"";
 return g.map(e=>{const k=f+"|"+e.t;const pen=e.l.filter(x=>x.estado=="pendiente").length;
  return `<details class="mtgrp" ${mTAb.has(k)?"open":""} ontoggle="mantTT('${k}',this.open)"><summary><span class="mtnom">${esc(e.t)}</span><span class="mtpos">${e.l.map(x=>chip(x)).join("")}</span><span class="mtpen">${pen?pen+" pend.":"✔"}</span></summary>${e.l.map(filaDia).join("")}</details>`}).join("")};
const puede=()=>typeof user!="undefined"&&user&&(tecnico||admin);

async function mantCarga(forzar){if(mCarg&&!forzar)return;if(typeof sb=="undefined"||!sb||typeof user=="undefined"||!user)return;
 const d=new Date();d.setDate(d.getDate()-62);const h=new Date();h.setDate(h.getDate()+400);
 const r=await sb.from("mantenimientos").select("*").gte("fecha",iso(d)).lte("fecha",iso(h)).order("fecha");
 if(r.error){console.warn("mantenimientos",r.error);return}MANT=r.data||[];mCarg=true}
window.mantCarga=mantCarga;

/* ---------- vista principal ---------- */
function chip(x,grande){const ok=x.estado=="hecho",cx=x.estado=="cancelado";
 return `<span class="mchip ${x.tipo=="S"?"s":"m"} ${ok?"ok":""} ${cx?"cx":""} ${grande?"g":""}"><b>${esc(String(x.pos))}</b><i>${x.tipo}</i>${ok?"✔":cx?"✕":""}</span>`}
/* v40: cada posición del día es una caja desplegable con «Incidencias anteriores» (OT del mes previo en esa posición)
 y «Trabajos realizados» (cuaderno de notas del mantenimiento). Al guardar las notas la caja se pliega. */
window.mAltaAb=false;window.mNoReAb=false;
const mAb=new Set(),mCerr=new Set(),mBorr={};
const abierta=x=>mAb.has(x.id);/* v48: todo plegado por defecto */
function incPrevias(x){if(typeof inc=="undefined"||!Array.isArray(inc))return [];const[y,m,d]=x.fecha.split("-").map(Number);const desde=iso(new Date(y,m-2,d));
 return inc.filter(i=>String(i.pos).toUpperCase()==String(x.pos).toUpperCase()&&(i.fecha||"")>=desde&&(i.fecha||"")<x.fecha).sort((a,b)=>(b.fecha||"").localeCompare(a.fecha||""))}
const fCorta=s=>{const[y,m,d]=String(s||"").split("-");return d?`${d}/${m}`:"–"};
function cajaInc(x){const l=incPrevias(x);const[y,m,d]=x.fecha.split("-").map(Number);const desde=iso(new Date(y,m-2,d));
 return `<div class="msec"><div class="msect">⚠️ Incidencias anteriores <span>${fCorta(desde)} – ${fCorta(iso(new Date(y,m-1,d-1)))}</span></div>${l.length?l.map(i=>`<div class="minc"><div class="mincc"><b>${fCorta(i.fecha)}</b> <span class="tag">${esc(i.tipo||"")}</span>${i.orden?` <span class="mu">CGA ${esc(String(i.orden))}</span>`:""}<span class="${i.estado=="abierta"?"ab":"ce"}" style="margin-left:auto;font-size:11px">${i.estado=="abierta"?"ABIERTA":"CERRADA"}</span></div>${i.desc?`<div class="mincd">${esc(i.desc)}</div>`:""}${i.act?`<div class="mincd"><b>Actuación:</b> ${esc(i.act)}</div>`:""}</div>`).join(""):`<div class="mu" style="font-size:13px">Sin OT registradas en esta posición el mes anterior.</div>`}</div>`}
function cajaTrab(x){const v=x.id in mBorr?mBorr[x.id]:(x.trabajos||"");
 return `<div class="msec"><div class="msect">📝 Trabajos realizados${x.trabajos_at?` <span>${esc(x.trabajos_por||"")} · ${new Date(x.trabajos_at).toLocaleString("es-ES",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span>`:""}</div>
 ${puede()?`<textarea class="mtrab" rows="5" placeholder="Anota los trabajos efectuados en el mantenimiento de hoy…" oninput="mantBorr('${x.id}',this.value)">${esc(v)}</textarea><button class="pri" style="margin-top:8px;width:100%" onclick="mantTrab('${x.id}')">💾 Guardar trabajos</button>`
 :`<div class="mnotas">${x.trabajos?esc(x.trabajos):'<span class="mu">Sin anotaciones.</span>'}</div>`}</div>`}
/* v130: tareas de la instalación hidráulica (descripción técnica TKAS, pág. 15-16) en cada posición con pasarela */
function cajaHidr(x){if(typeof esRem=="function"&&esRem(x.pos))return "";
 const L=[["Cada trimestre","Nivel de aceite en el visor 14 y estanqueidad de la central, el bloque, las tuberías y los cilindros."],
  ["Cada año","Cambio del filtro de retorno de 25 µm (CSM10BNR) y muestra de aceite (≈ 500 cm³) al fabricante para ver si se puede seguir usando."],
  ["Limpieza","Venteo del depósito y superficies de refrigeración sin polvo ni suciedad."],
  ["Al trabajar","Ruidos de bomba y descarga, y aceite por debajo de 80 °C. Si se desconectó el motor, comprobar el sentido de giro."]];
 return `<details class="msec mhid"><summary class="msect">🛢️ Hidráulica · tareas de mantenimiento</summary><div style="font-size:13px;line-height:1.4">${L.map(l=>`<div style="margin-top:5px"><b>${l[0]}:</b> ${l[1]}</div>`).join("")}
 <button class="sec" style="margin-top:8px;width:100%" onclick="event.stopPropagation();if(typeof gHidrPdf=='function')gHidrPdf(16)">📄 Mantenimiento en la descripción técnica (pág. 15)</button></div></details>`}
function filaDia(x){const ok=x.estado=="hecho",cx=x.estado=="cancelado";const ab=abierta(x);
 const fh=x.hecho_at?" · "+new Date(x.hecho_at).toLocaleString("es-ES",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"";
 const est=ok?`<div class="mest ok">Hecho${x.tecnico?" · "+esc(x.tecnico):""}${fh}</div>`:cx?`<div class="mest cx">✕ No realizada${x.tecnico?" · "+esc(x.tecnico):""}${fh}</div>`:`<div class="mest">Pendiente</div>`;
 const bot=`${puede()&&!cx?`<button class="${ok?"sec":"pri"} mbtn" onclick="mantHecho('${x.id}',${ok?0:1})">${ok?"Deshacer":"✔ Hecho"}</button>`:""}${admin?`<button class="sec mdel" aria-label="Borrar" onclick="mantBorra('${x.id}')">✕</button>`:""}`;
 const canc=puede()&&!ok?`<label class="mcanc"><input type="checkbox" ${cx?"checked":""} onchange="mantCanc('${x.id}',this.checked)"><span>Cancelado por Operaciones</span></label>`:"";
 return `<div class="mcaja ${ab?"ab":""}"><div class="mfila ${ok?"ok":""} ${cx?"cx":""}"><div class="mizq">${chip(x,true)}${est}</div><div class="mfinfo" onclick="mantTog('${x.id}')" style="cursor:pointer"><b>PBB ${esc(String(x.pos))}</b> · ${x.tipo=="S"?"Semestral":"Mensual"}${x.hora_ini?`<div class="mhora">🕒 ${esc(x.hora_ini)}${x.hora_fin?" – "+esc(x.hora_fin):""} LT${x.ref?` · ${esc(x.ref)}`:""}</div>`:x.ref?`<div class="mhora">${esc(x.ref)}</div>`:""}${x.notas?`<div class="mnota">⚠️ ${esc(x.notas)}</div>`:""}<div class="mtog">${ab?"▲ Plegar":`▼ ${x.trabajos?"📝 Trabajos anotados · ":""}Ver incidencias y trabajos`}</div></div>
 ${bot||canc?`<div class="mder">${bot?`<div class="mderb">${bot}</div>`:""}${canc}</div>`:""}</div>
 ${ab?`<div class="mcuerpo">${cajaInc(x)}${cajaHidr(x)}${cajaTrab(x)}</div>`:""}</div>`}
window.mantTog=id=>{const x=MANT.find(z=>z.id==id);if(!x)return;if(abierta(x)){mAb.delete(id);mCerr.add(id)}else{mCerr.delete(id);mAb.add(id)}vMant()};
window.mantBorr=(id,v)=>{mBorr[id]=v};
window.mantTrab=async id=>{const v=(id in mBorr?mBorr[id]:"").trim();const x=MANT.find(z=>z.id==id);if(!x)return;if(!v&&!x.trabajos){msg("Escribe los trabajos realizados");return}
 const t=(typeof tecNombre!="undefined"&&tecNombre)||(user&&user.email)||"";
 const r=await sb.from("mantenimientos").update({trabajos:v||null,trabajos_por:v?t:null,trabajos_at:v?new Date().toISOString():null}).eq("id",id).select();
 if(r.error||!r.data||!r.data.length){msg("No se pudo guardar (sin permiso)");return}const k=MANT.findIndex(z=>z.id==id);if(k>=0)MANT[k]=r.data[0];
 delete mBorr[id];mAb.delete(id);mCerr.add(id);msg("Trabajos guardados ✔");vMant()};
function calHTML(){const[y,m]=mMes;const pri=new Date(y,m,1);const off=(pri.getDay()+6)%7;const nd=new Date(y,m+1,0).getDate();const h=hoy();
 let c=DIAS.map(d=>`<div class="mcab">${d}</div>`).join("");for(let k=0;k<off;k++)c+=`<div></div>`;
 for(let d=1;d<=nd;d++){const s=iso(new Date(y,m,d));const l=delDia(s);const pend=l.filter(x=>x.estado=="pendiente").length;
  c+=`<button class="mdia ${s==h?"hoy":""} ${s==mSel?"sel":""} ${l.length?(pend?"tiene":"todo"):""}" onclick="mantDia('${s}')"><span class="mnum">${d}</span>${l.map(x=>`<span class="mmini ${x.tipo=="S"?"s":"m"} ${x.estado=="hecho"?"ok":x.estado=="cancelado"?"cx":""}">${esc(String(x.pos))}</span>`).join("")}</button>`}
 return `<div class="mcal">${c}</div>`}
function vMant(){if(!mMes){const d=new Date();mMes=[d.getFullYear(),d.getMonth()]}if(!mSel)mSel=hoy();
 const h=hoy(),lh=delDia(h),ls=delDia(mSel);const pend=lh.filter(x=>x.estado=="pendiente").length;
 const delMes=MANT.filter(x=>x.fecha.startsWith(mMes[0]+"-"+String(mMes[1]+1).padStart(2,"0")));const noRe=delMes.filter(x=>x.estado=="cancelado").sort((a,b)=>a.fecha.localeCompare(b.fecha)||tOrd(a)-tOrd(b));
 $("#app").innerHTML=`<div class="card"><div class="row" style="flex-wrap:nowrap"><h3 style="margin:0">Mantenimiento preventivo</h3><div class="mhdr">${admin?`<button class="sec" style="width:auto;padding:6px 12px" onclick="mantImp()">📷 Importar</button>`:""}${(()=>{const e=evtDe(mSel);return e?`<span class="mevt">Evento SGC <b>${esc(e)}</b></span>`:""})()}</div></div>
 <div class="mley"><span class="mchip m"><b>M</b></span> Mensual <span class="mchip s"><b>S</b></span> Semestral <span class="mchip m ok"><b>✔</b></span> Hecho <span class="mchip m cx"><b>✕</b></span> Cancelado</div></div>
 <div class="card mhoy"><div class="mhoyt">🔧 Hoy · ${fLarga(h)}</div>${lh.length?`<div class="mu" style="margin:2px 0 6px">${pend?`${pend} pendiente${pend>1?"s":""} de ${lh.length}`:"Todo hecho ✔"}</div>${listaTerm(lh)}`:`<div class="mu" style="margin-top:6px">${mCarg?"Sin mantenimientos programados para hoy.":"Cargando…"}</div>`}</div>
 <div class="card"><div class="row mnav" style="flex-wrap:nowrap"><button class="sec" onclick="mantMes(-1)">‹</button><b>${MESES[mMes[1]][0].toUpperCase()+MESES[mMes[1]].slice(1)} ${mMes[0]}</b><button class="sec" onclick="mantMes(1)">›</button></div>
 <div class="mu" style="font-size:12px;margin:4px 0 6px">${delMes.length} mantenimiento${delMes.length==1?"":"s"} este mes · toca un día para ver sus posiciones</div>${calHTML()}</div>
 ${mSel!=h?`<div class="card"><div class="mhoyt" style="color:var(--tx)">📅 ${fLarga(mSel)}</div>${ls.length?listaTerm(ls):`<div class="mu" style="margin-top:6px">Sin mantenimientos este día.</div>`}</div>`:""}
 ${admin?`<details class="card malta" ${mAltaAb?"open":""} ontoggle="mAltaAb=this.open"><summary><b>Alta manual forzada</b>${noRe.length?` <span class="mnoren">${noRe.length} no realizada${noRe.length>1?"s":""}</span>`:""}</summary>${noRe.length?`<details class="mnore" ${mNoReAb?"open":""} ontoggle="mNoReAb=this.open"><summary>✕ No realizadas en ${MESES[mMes[1]]} ${mMes[0]} · cancelado por Operaciones (${noRe.length})</summary><div class="mu" style="font-size:12px;margin:4px 0">Pendientes de nueva programación por el SGC.</div>${noRe.map(x=>`<div class="mnorf">${chip(x)}<div class="mnori"><b>${fCorta(x.fecha)}</b>${x.hora_ini?` · ${esc(x.hora_ini)}${x.hora_fin?"–"+esc(x.hora_fin):""}`:""}${x.ref?` · ${esc(x.ref)}`:""}${(()=>{const c=reproDe(x);return c.length?`<br><span class="mrpr">↻ Reprogramada al ${c.map(z=>fCorta(z.fecha)).join(", ")}</span>`:""})()}<br><span class="mu">${esc(x.tecnico||"")}</span></div><div class="mrepc"><button class="sec mrep" onclick="mantRepro('${x.id}')">Reprogramar</button><button class="sec mrdel" title="Volver a pendiente" aria-label="Quitar de no realizadas y volver a pendiente" onclick="mantDeshCanc('${x.id}')">${typeof IC=="function"?IC("trash"):"🗑"}</button></div></div>`).join("")}</details>`:""}<div class="mu" style="font-size:12px;margin-top:6px">Posiciones separadas por comas; añade M o S detrás si es distinto del tipo elegido (ej. 502, 504 S).</div>
  <div class="grid" style="margin-top:6px"><div><label>Fecha</label><input id="ma_f" type="date" value="${mSel}"></div><div><label>Tipo</label><select id="ma_t"><option value="M">Mensual</option><option value="S">Semestral</option></select></div></div>
  <label>Posiciones</label><input id="ma_p" inputmode="numeric" placeholder="Ej. 502, 504, 528 S"><button class="pri" style="margin-top:10px;width:100%" onclick="mantManual()">Añadir al calendario</button>
  ${delMes.length?`<button class="sec" style="margin-top:8px;width:100%;color:#d32f2f;border-color:#d32f2f" onclick="mantBorraMes()">🗑 Borrar todo ${MESES[mMes[1]]} ${mMes[0]}</button>`:""}</details>`:""}`;
 if(!mCarg)mantCarga().then(()=>{if(view=="mant")vMant()})}
window.vMant=vMant;
window.mantMes=d=>{let[y,m]=mMes;m+=d;if(m<0){m=11;y--}if(m>11){m=0;y++}mMes=[y,m];vMant()};
window.mantDia=s=>{mSel=s;vMant();setTimeout(()=>{const c=[...document.querySelectorAll("#app .card")].pop();const t=document.querySelector("#app .card .mhoyt[style]");if(t)t.scrollIntoView({behavior:"smooth",block:"start"})},30)};
window.mantHecho=async(id,hecho)=>{const t=(typeof tecNombre!="undefined"&&tecNombre)||(user&&user.email)||"";
 const r=await sb.from("mantenimientos").update(hecho?{estado:"hecho",tecnico:t,hecho_at:new Date().toISOString()}:{estado:"pendiente",tecnico:null,hecho_at:null}).eq("id",id).select();
 if(r.error||!r.data||!r.data.length){msg("No se pudo guardar (sin permiso)");return}const k=MANT.findIndex(x=>x.id==id);if(k>=0)MANT[k]=r.data[0];msg(hecho?"Mantenimiento hecho ✔":"Marcado como pendiente");vMant()};
window.mantCanc=async(id,on)=>{const t=(typeof tecNombre!="undefined"&&tecNombre)||(user&&user.email)||"";
 const r=await sb.from("mantenimientos").update(on?{estado:"cancelado",tecnico:t,hecho_at:new Date().toISOString()}:{estado:"pendiente",tecnico:null,hecho_at:null}).eq("id",id).select();
 if(r.error||!r.data||!r.data.length){msg("No se pudo guardar (sin permiso)");vMant();return}const k=MANT.findIndex(x=>x.id==id);if(k>=0)MANT[k]=r.data[0];msg(on?"Cancelado por Operaciones: pasa a no realizadas del mes":"Vuelve a pendiente");vMant()};
/* reprogramar una no realizada: rellena el alta forzada con su posición y tipo */
const reproDe=x=>MANT.filter(z=>z.id!=x.id&&(z.origen=="repro:"+x.id||(z.origen=="manual"&&z.estado=="pendiente"&&String(z.pos).toUpperCase()==String(x.pos).toUpperCase()&&z.tipo==x.tipo&&z.fecha>x.fecha&&z.fecha.slice(0,7)==x.fecha.slice(0,7))));
window.mantDeshCanc=async id=>{const x=MANT.find(z=>z.id==id);if(!x)return;const cp=reproDe(x);
 if(!confirm(`¿Quitar PBB ${x.pos} (${fCorta(x.fecha)}) de no realizadas y volver a dejarla pendiente en su programación?${cp.length?`\n\nSe borrará también del calendario la reprogramación del ${cp.map(z=>fCorta(z.fecha)).join(", ")}.`:""}`))return;
 for(const z of cp){const r=await sb.from("mantenimientos").delete().eq("id",z.id).select();
  if(r.error||!r.data||!r.data.length){alert(`No se pudo borrar la reprogramación del ${fCorta(z.fecha)} (${r.error?r.error.message:"sin permiso: solo el administrador puede borrar del calendario"}). No se ha cambiado nada.`);await mantCarga(true);vMant();return}
  MANT=MANT.filter(w=>w.id!=z.id)}
 await mantCanc(id,false);await mantCarga(true);if(view=="mant")vMant();if(cp.length)msg(`Vuelve a pendiente y se ha borrado la reprogramación del ${cp.map(z=>fCorta(z.fecha)).join(", ")}`)};
window.mantRepro=id=>{const x=MANT.find(z=>z.id==id);if(!x)return;window.mRepro={id:x.id,pos:x.pos,tipo:x.tipo,hora_ini:x.hora_ini,hora_fin:x.hora_fin,ref:x.ref};$("#ma_t").value=x.tipo;$("#ma_p").value=String(x.pos);const f=$("#ma_f");f.focus();f.scrollIntoView({block:"center",behavior:"smooth"});msg("Elige la nueva fecha que dé el SGC y pulsa «Añadir al calendario»")};
window.mantBorra=async id=>{if(!confirm("¿Borrar este mantenimiento del calendario?"))return;const r=await sb.from("mantenimientos").delete().eq("id",id).select();
 if(r.error||!r.data||!r.data.length){msg("No se pudo borrar");return}MANT=MANT.filter(x=>x.id!=id);vMant()};
window.mantBorraMes=async()=>{const[y,m]=mMes;const a=iso(new Date(y,m,1)),b=iso(new Date(y,m+1,0));
 if(!confirm(`¿Borrar TODOS los mantenimientos de ${MESES[m]} ${y}?`))return;const r=await sb.from("mantenimientos").delete().gte("fecha",a).lte("fecha",b).select();
 if(r.error){msg("No se pudo borrar");return}await mantCarga(true);msg(`${(r.data||[]).length} mantenimientos borrados`);vMant()};
window.mantManual=async()=>{const f=$("#ma_f").value,t=$("#ma_t").value,p=$("#ma_p").value;if(!f||!p.trim()){msg("Indica fecha y posiciones");return}
 const R=window.mRepro;const filas=posLibres(p,t).map(x=>{const r={fecha:f,pos:x.pos,tipo:x.tipo,origen:"manual"};
  if(R&&String(R.pos).toUpperCase()==String(x.pos).toUpperCase()&&R.tipo==x.tipo){r.origen="repro:"+R.id;["hora_ini","hora_fin","ref"].forEach(k=>{if(R[k])r[k]=R[k]})}return r});window.mRepro=null;if(!filas.length){msg("No reconozco ninguna posición");return}
 await guarda(filas);mSel=f;vMant()};

/* ---------- reconocimiento de posiciones y fechas ---------- */
function posSet(){const m=new Map();(typeof POS!="undefined"?POS:[]).forEach(p=>m.set(String(p).toUpperCase(),String(p)));return m}
function posDeTexto(txt,tipoDef){const P=posSet();const out=[];const U=String(txt||"").toUpperCase();
 const re=/\b(T\s?\d{1,3}|\d{3})\b(\s*[\(\-\/]?\s*(MENSUAL|SEMESTRAL|MENS|SEM|M|S)\b)?/g;let m;
 const lt=/SEMESTRAL|\bSEM\b/.test(U)?"S":/MENSUAL|\bMENS\b/.test(U)?"M":tipoDef;
 while((m=re.exec(U))){const k=m[1].replace(/\s/g,"");const p=P.get(k);if(!p)continue;const ts=m[3];const t=ts?(ts[0]=="S"?"S":"M"):lt;
  if(!out.some(x=>x.pos==p&&x.tipo==t))out.push({pos:p,tipo:t})}return out}
const MES_RE=/\b(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|SET|OCT|NOV|DIC)[A-Z]*\b/;
const MES_IX={ENE:0,FEB:1,MAR:2,ABR:3,MAY:4,JUN:5,JUL:6,AGO:7,SEP:8,SET:8,OCT:9,NOV:10,DIC:11};
function fechaDe(linea,y0,m0){const U=linea.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g,"");let m;
 if((m=/\b(\d{4})-(\d{2})-(\d{2})\b/.exec(U)))return {f:`${m[1]}-${m[2]}-${m[3]}`,q:m[0]};
 if((m=/\b(\d{1,2})[\/\.\-](\d{1,2})(?:[\/\.\-](\d{2,4}))?\b/.exec(U))){const d=+m[1],mm=+m[2];let y=m[3]?+m[3]:y0;if(y<100)y+=2000;if(d>=1&&d<=31&&mm>=1&&mm<=12)return {f:iso(new Date(y,mm-1,d)),q:m[0]}}
 if((m=/\b(\d{1,2})\s*(?:DE\s*)?(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|SET|OCT|NOV|DIC)[A-Z]*\b/.exec(U))){const d=+m[1];if(d>=1&&d<=31)return {f:iso(new Date(y0,MES_IX[m[2]],d)),q:m[0]}}
 if((m=/\b(LUNES|MARTES|MIERCOLES|JUEVES|VIERNES|SABADO|DOMINGO|LUN|MAR|MIE|JUE|VIE|SAB|DOM)\.?\s*(\d{1,2})\b/.exec(U))){const d=+m[2];if(d>=1&&d<=31)return {f:iso(new Date(y0,m0,d)),q:m[0]}}
 if((m=/^\s*(?:DIA\s*)?(\d{1,2})\s*[:\-\|\.]/.exec(U))){const d=+m[1];if(d>=1&&d<=31)return {f:iso(new Date(y0,m0,d)),q:m[0]}}
 return null}
/* Posiciones libres (alta manual): «502, T30, 576/577 S» */
function posLibres(txt,tipoDef){const out=[];String(txt||"").toUpperCase().split(/[,;\n]+/).forEach(it=>{const m=/^\s*(T?\d{1,3}[A-Z]?(?:\s*[\/\-]\s*T?\d{1,3}[A-Z]?)*)\s*(?:[\(\-]?\s*(MENSUAL|SEMESTRAL|M|S)\b)?/.exec(it);
 if(!m)return;const pos=m[1].replace(/\s+/g,"");const t=m[2]?(m[2][0]=="S"?"S":"M"):tipoDef;if(!out.some(x=>x.pos==pos&&x.tipo==t))out.push({pos,tipo:t})});return out}
const NORM=t=>String(t||"").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
/* Línea tipo «Inop SIN AVO posición T30 (E81) 20:30 LT a 23:30 LT [SIN MOVER PASARELA]» */
function itemLinea(l0){const U=NORM(l0).replace(/[|]/g,"I");const m=/POSICI[O0E6]?N\W{0,3}(T?\s?\d{1,3}[A-Z]?(?:\s*[\/\-]\s*T?\s?\d{1,3}[A-Z]?)*)/.exec(U);if(!m)return null;
 const pos=m[1].replace(/\s+/g,"");const resto=U.slice(m.index+m[0].length);const r=/\(([^)]{1,20})\)/.exec(resto);
 const h=/(\d{1,2})\s*[:.,\-]?\s*(\d{2})\s*(?:L\s*[TI])?\s*(?:A|-|HASTA)\s*(\d{1,2})\s*[:.,\-]?\s*(\d{2})/.exec(resto);
 let ps=pos;const rf=r?r[1].trim().replace(/£/g,"E").replace(/\$/g,"S").replace(/^([A-Z])\s*[I|L]\s*(\d)/,"$11$2").replace(/^([A-Z])\s+(\d)/,"$1$2"):"";if(/^[B-E]\d/i.test(rf)&&!/^T/.test(ps)){if(/^1\d\d$/.test(ps))ps="T"+ps.slice(1);else if(/^\d{1,2}$/.test(ps))ps="T"+ps}
 return {pos:ps,ref:rf||null,hora_ini:h?h[1].padStart(2,"0")+":"+h[2]:null,hora_fin:h?h[3].padStart(2,"0")+":"+h[4]:null,notas:/SIN\s*MOVER/.test(resto)?"SIN MOVER PASARELA":null}}
const tipoCab=l=>{const U=NORM(l);if(/PREVENTIV|POSICI/.test(U))return null;return /SEMESTRAL/.test(U)?"S":/MENSUAL/.test(U)?"M":null};
function añade(por,f,it){if(!por.has(f))por.set(f,[]);const a=por.get(f);if(!a.some(x=>x.pos==it.pos&&x.tipo==it.tipo))a.push(it)}
/* Texto en orden de lectura (PDF, Excel, CSV o foto sin geometría útil) */
function analiza(texto,y0,m0,tipoDef){const por=new Map();let cur=null,tipo=tipoDef,sueltas=0,buf=[],ult=null;
 String(texto||"").split(/\r?\n/).forEach(l0=>{let l=l0.replace(/[;\t]/g," , ");const tc=tipoCab(l);if(tc=="M"&&buf.length==0)cur=null;if(tc)tipo=tc;
  const fd=fechaDe(l,y0,m0);if(fd){cur=fd.f;l=l.replace(fd.q," ");buf.forEach(p=>añade(por,cur,p));buf=[]}
  const it=itemLinea(l);if(!it&&ult&&/MOVER\s*PASARELA/.test(NORM(l))){ult.notas="SIN MOVER PASARELA";return}
  const ps=it?[Object.assign(it,{tipo})]:posDeTexto(l,tipo);if(!ps.length)return;ult=ps[ps.length-1];if(!cur){buf.push(...ps);return}ps.forEach(p=>añade(por,cur,p))});
 sueltas=buf.length;return {txt:aTexto(por),sueltas}}
/* Foto: usa la posición de cada línea en la imagen. Cada día empieza en «Mantenimientos MENSUALES»; la fecha (columna izquierda)
 cae dentro de la franja vertical de su día; el tipo es la última cabecera MENSUALES/SEMESTRALES por encima de la línea. */
function analizaGeo(lines,y0,m0,tipoDef){const L=lines.map(l=>({t:l.text,y:(l.bbox.y0+l.bbox.y1)/2,x:l.bbox.x0})).sort((a,b)=>a.y-b.y);
 const cabs=L.filter(l=>tipoCab(l.t));const its=L.filter(l=>itemLinea(l.t));if(!its.length)return null;
 /* fechas de la columna izquierda (la más cercana en x a la columna de cabeceras/posiciones) */
 const ix=its.map(l=>l.x).sort((a,b)=>a-b)[its.length>>1];
 let F=L.map(l=>{const fd=itemLinea(l.t)?null:fechaDe(l.t,y0,m0);return fd?{f:fd.f,y:l.y,x:l.x}:null}).filter(Boolean).filter(d=>d.x<ix);
 if(!F.length)return null;const fx=F.map(d=>d.x).sort((a,b)=>a-b)[F.length>>1];F=F.filter(d=>Math.abs(d.x-fx)<Math.max(120,Math.abs(ix-fx)*.6));
 const vistos=new Set();F=F.filter(d=>!vistos.has(d.f)&&vistos.add(d.f)).sort((a,b)=>a.y-b.y);if(!F.length)return null;
 /* límites de día: cada «MENSUALES» y cada «SEMESTRALES» que sigue a otro «SEMESTRALES»; si entre dos fechas no hay límite, se parte a mitad */
 let B=cabs.filter((c,i)=>tipoCab(c.t)=="M"||(i>0&&tipoCab(cabs[i-1].t)=="S")).map(c=>c.y-4);
 for(let k=0;k+1<F.length;k++){if(!B.some(b=>b>F[k].y&&b<F[k+1].y))B.push((F[k].y+F[k+1].y)/2)}B.sort((a,b)=>a-b);
 const tramo=y=>{let k=0;B.forEach((b,i)=>{if(y>=b)k=i+1});return k};
 const fT=new Map();F.forEach(d=>{const k=tramo(d.y);if(!fT.has(k))fT.set(k,d.f)});
 const sig=(f,n)=>{const[a,b,c]=f.split("-").map(Number);return iso(new Date(a,b-1,c+n))};
 for(let k=0;k<=B.length;k++){if(fT.has(k))continue;for(let q=k-1;q>=0;q--)if(fT.has(q)){const hay=L.some(l=>tramo(l.y)==k&&itemLinea(l.t));if(hay)fT.set(k,sig(fT.get(q),k-q));break}}
 const fechaY=y=>{const k=tramo(y);if(fT.has(k))return fT.get(k);let m=null,md=1e9;F.forEach(d=>{const dd=Math.abs(d.y-y);if(dd<md){md=dd;m=d.f}});return m};
 const por=new Map();let ult=null;
 L.forEach(l=>{const it=itemLinea(l.t);if(!it){if(ult&&/MOVER\s*PASARELA/.test(NORM(l.t)))ult.notas="SIN MOVER PASARELA";return}ult=it;
  const f=fechaY(l.y);const k=tramo(l.y);let tipo=tipoDef;cabs.forEach(c=>{if(c.y<=l.y&&tramo(c.y+4)==k)tipo=tipoCab(c.t)});
  añade(por,f,Object.assign(it,{tipo}))});
 return {txt:aTexto(por),sueltas:0}}
function itTxt(x){return `${x.pos} ${x.tipo}${x.hora_ini?` ${x.hora_ini}-${x.hora_fin||""}`:""}${x.ref?` (${x.ref})`:""}${x.notas?` ${x.notas}`:""}`}
function aTexto(por){return [...por.keys()].sort().map(f=>`${f}: ${por.get(f).map(itTxt).join("; ")}`).join("\n")}
function canonico(txt){const filas=[],mal=[];String(txt||"").split(/\r?\n/).forEach((l,i)=>{if(!l.trim())return;const m=/^\s*(\d{4}-\d{2}-\d{2})\s*[:|]\s*(.*)$/.exec(l);
  if(!m){mal.push(i+1);return}const items=m[2].includes(";")||/\d{1,2}:\d{2}/.test(m[2])?m[2].split(";"):m[2].split(",");
  items.forEach(it=>{const k=/^\s*(T?\d{1,3}[A-Z]?(?:[\/\-]T?\d{1,3}[A-Z]?)*)\s*(M|S)?\b\s*(?:(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})?)?\s*(?:\(([^)]*)\))?\s*(.*)$/i.exec(it);if(!k)return;
   filas.push({fecha:m[1],pos:k[1].toUpperCase(),tipo:(k[2]||"M").toUpperCase(),hora_ini:k[3]||null,hora_fin:k[4]||null,ref:k[5]?k[5].trim():null,notas:k[6]&&k[6].trim()?k[6].trim():null,origen:"importado"})})});return {filas,mal}}
/* ---------- lectura de archivos ---------- */
function carga(src,ok){return new Promise((res,rej)=>{if(ok()){res();return}const s=document.createElement("script");s.src=src;s.onload=()=>res();s.onerror=()=>rej(new Error("No se pudo cargar "+src));document.head.appendChild(s)})}
function imgCanvas(file,giro){return new Promise((res,rej)=>{const u=URL.createObjectURL(file);const im=new Image();im.onload=()=>{const k=Math.min(1,2600/Math.max(im.width,im.height));
 const w=Math.round(im.width*k),h=Math.round(im.height*k);const c=document.createElement("canvas");const r=giro%180!=0;c.width=r?h:w;c.height=r?w:h;const x=c.getContext("2d");
 x.translate(c.width/2,c.height/2);x.rotate(giro*Math.PI/180);x.drawImage(im,-w/2,-h/2,w,h);URL.revokeObjectURL(u);res(c)};im.onerror=rej;im.src=u})}
async function textoImagen(file,prog){await carga("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js",()=>window.Tesseract);
 const w=await Tesseract.createWorker("spa",1,{logger:m=>{if(m.status=="recognizing text")prog(Math.round(m.progress*100))}});let mejor=null;
 try{for(const g of [0,90,270,180]){prog(0,g);const c=await imgCanvas(file,g);const r=await w.recognize(c);const n=(NORM(r.data.text).match(/POSICI[O0E6]?N/g)||[]).length;
   if(!mejor||n>mejor.n)mejor={n,data:r.data,g};if(n>=3)break}}finally{await w.terminate()}
 return mejor?mejor.data:{text:"",lines:[]}}
async function textoPdf(file){if(typeof cargaLib=="function")await cargaLib();const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;let out=[];
 for(let p=1;p<=pdf.numPages;p++){const tc=await (await pdf.getPage(p)).getTextContent();const filas=new Map();
  tc.items.forEach(it=>{const y=Math.round(it.transform[5]/3);if(!filas.has(y))filas.set(y,[]);filas.get(y).push([it.transform[4],it.str])});
  [...filas.keys()].sort((a,b)=>b-a).forEach(y=>out.push(filas.get(y).sort((a,b)=>a[0]-b[0]).map(x=>x[1]).join(" ")))}return out.join("\n")}
async function textoExcel(file){await carga("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",()=>window.XLSX);
 const wb=XLSX.read(await file.arrayBuffer(),{type:"array",cellDates:true});
 return wb.SheetNames.map(n=>XLSX.utils.sheet_to_csv(wb.Sheets[n],{dateNF:"yyyy-mm-dd"})).join("\n").replace(/,/g," , ")}

/* ---------- importar (admin) ---------- */
window._mantTest={analiza,analizaGeo,canonico};
window.mantImp=()=>{if(!admin){msg("Solo el administrador importa el programa");return}if(!mImpMes)mImpMes=[...mMes];
 const op=[];for(let k=-1;k<13;k++){const d=new Date(new Date().getFullYear(),new Date().getMonth()+k,1);op.push([d.getFullYear(),d.getMonth()])}
 $("#sheetc").innerHTML=`<div class="row" style="flex-wrap:nowrap"><h3 style="margin:0">Importar programa de mantenimiento</h3><button class="sec" aria-label="Cerrar" onclick="closeSheet()" style="padding:4px 12px">✕</button></div>
 <div class="mu" style="font-size:12px">Sube la foto del cuadro, un PDF, un Excel o un CSV. La app lee las fechas y las posiciones; revisa el resultado antes de guardar.</div>
 <div class="grid" style="margin-top:6px"><div><label>Mes del programa</label><select id="mi_mes" onchange="mantImpMes(this.value)">${op.map(([y,m])=>`<option value="${y}-${m}" ${y==mImpMes[0]&&m==mImpMes[1]?"selected":""}>${MESES[m]} ${y}</option>`).join("")}</select></div>
 <div><label>Tipo por defecto</label><select id="mi_tipo" onchange="mImpTipoSet(this.value)"><option value="M" ${mImpTipo=="M"?"selected":""}>Mensual</option><option value="S" ${mImpTipo=="S"?"selected":""}>Semestral</option></select></div></div>
 <label class="pri mfile">📷 Foto / archivo<input type="file" hidden accept="image/*,.pdf,.csv,.txt,.xlsx,.xls" onchange="mantImpFile(this.files[0])"></label>
 <div id="mi_est" class="mu" style="font-size:12px;margin-top:6px"></div>
 <label>Nº de evento de mantenimiento AENA (SGC)</label><input id="mi_evt" inputmode="numeric" placeholder="Ej. 127318" value="${esc(mEvt)}" oninput="mEvtSet(this.value)">
 <label>Programa reconocido · una línea por día (AAAA-MM-DD: posición tipo hora-hora (ref); …)</label>
 <textarea id="mi_txt" rows="10" style="font-family:ui-monospace,monospace;font-size:13px" oninput="mTxtSet(this.value)" placeholder="2026-10-26: T30 M 20:30-23:30 (E81); 386 M 13:00-16:00 (H15)">${esc(mTxt)}</textarea>
 <div id="mi_prev" class="mu" style="font-size:12px;margin-top:4px"></div>
 <button class="pri" style="margin-top:10px;width:100%" onclick="mantImpGuarda()">Guardar en el calendario</button>`;
 $("#sheet").style.display="flex";mPrev()};
window.mantImpMes=v=>{const[y,m]=v.split("-").map(Number);mImpMes=[y,m]};
window.mImpTipoSet=v=>{mImpTipo=v};
window.mEvtSet=v=>{mEvt=String(v||"").replace(/\D/g,"")};
window.mTxtSet=v=>{mTxt=v;mPrev()};
function mPrev(){const e=$("#mi_prev");if(!e)return;const{filas,mal}=canonico(mTxt);const dias=new Set(filas.map(x=>x.fecha)).size;
 e.innerHTML=filas.length?`${filas.length} mantenimientos en ${dias} día${dias>1?"s":""}${mal.length?` · <span style="color:#d32f2f">líneas sin fecha válida: ${mal.join(", ")}</span>`:""}`:(mal.length?`<span style="color:#d32f2f">Formato: AAAA-MM-DD: T30 M 20:30-23:30 (E81); 386 S</span>`:"")}
window.mantImpFile=async file=>{if(!file||mOcup)return;mOcup=true;const st=$("#mi_est");const set=t=>{if(st)st.textContent=t};
 try{let txt="";const n=file.name.toLowerCase();
  let geo=null;
  if(/^image\//.test(file.type)){set("Leyendo la foto… (la primera vez descarga el lector, puede tardar)");const d=await textoImagen(file,(p,g)=>set(g!==undefined&&g?`Girando la foto ${g}° y leyendo…`:`Leyendo la foto… ${p}%`));txt=d.text;
   geo=d.lines&&d.lines.length?analizaGeo(d.lines,mImpMes[0],mImpMes[1],mImpTipo):null}
  else if(n.endsWith(".pdf")){set("Leyendo PDF…");txt=await textoPdf(file)}
  else if(/\.xlsx?$/.test(n)){set("Leyendo Excel…");txt=await textoExcel(file)}
  else txt=await file.text();
  const r=(geo&&geo.txt)?geo:analiza(txt,mImpMes[0],mImpMes[1],mImpTipo);
  const ev=/S\s*G\s*[C(]\W{0,3}(\d[\d\s]{3,8}\d)/i.exec(NORM(txt))||/EVENTO\W{0,3}(\d[\d\s]{3,8}\d)/i.exec(NORM(txt));if(ev){mEvt=ev[1].replace(/\s/g,"");const e=$("#mi_evt");if(e)e.value=mEvt}
  mTxt=r.txt;const t=$("#mi_txt");if(t)t.value=mTxt;mPrev();
  set(r.txt?`Leído «${file.name}». Revisa y corrige las líneas antes de guardar.${r.sueltas?` ${r.sueltas} posición(es) sin fecha asociada se han ignorado.`:""}`:
   `No he encontrado fechas con posiciones en «${file.name}». Escribe el programa a mano en el cuadro o prueba con una foto más nítida y recta.`);
  window._mantOCR=txt}
 catch(e){set("Error al leer el archivo: "+(e.message||e))}finally{mOcup=false}};
window.mantImpGuarda=async()=>{const{filas,mal}=canonico(mTxt);if(mEvt)filas.forEach(x=>x.evento=mEvt);if(!filas.length){msg("No hay mantenimientos que guardar");return}
 if(mal.length&&!confirm(`Hay ${mal.length} línea(s) sin fecha válida que se ignorarán. ¿Guardar el resto?`))return;
 await guarda(filas);closeSheet();mTxt="";const f=filas.map(x=>x.fecha).sort()[0];const[y,m]=f.split("-").map(Number);mMes=[y,m-1];mSel=f;vMant()};
async function guarda(filas){const r=await sb.from("mantenimientos").upsert(filas,{onConflict:"fecha,pos,tipo",ignoreDuplicates:true}).select();
 if(r.error){msg("No se pudo guardar: "+(r.error.message||"sin permiso"));return false}await mantCarga(true);msg(`${filas.length} mantenimiento${filas.length>1?"s":""} en el calendario`);return true}

/* ---------- integración: pestaña, inicio ---------- */
const IC_MANT=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/></svg>`;
(function(){const o=render;render=function(){const esM=view=="mant";if(esM)view="dash";const r=o.apply(this,arguments);if(esM){view="mant";vMant()}
 const nav=document.getElementById("nav");if(nav&&typeof user!="undefined"&&user&&!nav.querySelector("[data-mant]")){
  const b=document.createElement("button");b.dataset.mant="1";b.className=view=="mant"?"on":"";b.innerHTML=`<span>${IC_MANT}</span>Mant.`;b.onclick=()=>go("mant");
  const ref=[...nav.children].find(x=>/Planos|Guía/.test(x.textContent));nav.insertBefore(b,ref||null)}
 if(esM&&nav)[...nav.children].forEach(x=>{if(!x.dataset.mant)x.classList.remove("on")});
 if(view=="dash")dashMant();return r}})();
/* v46: caja compacta de Inicio: PBB del día en columnas por terminal (T4, T4S, T123), ordenadas por número */
function termMant(pos){const P=String(pos||"").toUpperCase().trim(),a=P.split(/[\/\s-]+/)[0];
 const M=(typeof PTERM!="undefined"&&PTERM)||{};if(M[P])return M[P];if(M[a])return M[a];if(/^T\d/.test(a))return "T123";if(/^3\d/.test(a))return "T4";/* sin alta: 3xx = T4 */
 return typeof termDe=="function"?termDe(a):"T4S"}
function colsTerm(l){const ORD=["T4","T4S","T123"],g={};l.forEach(x=>{const t=termMant(x.pos);(g[t]=g[t]||[]).push(x)});
 const ts=Object.keys(g).sort((a,b)=>(ORD.indexOf(a)+1||9)-(ORD.indexOf(b)+1||9));
 const num=v=>String(v.pos).replace(/^T/i,"");
 return `<div class="mcols" style="grid-template-columns:repeat(${ts.length},minmax(0,1fr))">${ts.map(t=>`<div class="mcol"><div class="mcolt">${esc(t)}</div>${g[t].sort((a,b)=>num(a).localeCompare(num(b),undefined,{numeric:true})||a.tipo.localeCompare(b.tipo)).map(x=>chip(x)).join("")}</div>`).join("")}</div>`}
/* v80: la caja «Mantenimiento preventivo hoy» se oculta en Inicio (se consulta en la pestaña Mant.) */
function dashMant(){const o=document.getElementById("dmant");if(o)o.remove()}
function dashMantCaja(){const pinta=()=>{if(view!="dash")return;const old=document.getElementById("dmant");const l=delDia(hoy());
 const html=l.length?`<div class="mhoyt">🔧 Mantenimiento preventivo hoy <span class="mhoyn">${l.filter(x=>x.estado=="pendiente").length} pendiente(s) ›</span></div>${colsTerm(l)}`
  :`<div class="mhoyt" style="color:var(--mu)">🔧 Sin mantenimiento preventivo hoy</div>`;
 if(old){old.innerHTML=html;return}const d=document.createElement("div");d.id="dmant";d.className="card mhoy";d.style.cursor="pointer";d.onclick=()=>go("mant");d.innerHTML=html;
 const app=document.getElementById("app");const g=app&&app.querySelector(".grid");if(g)g.insertAdjacentElement("afterend",d);else if(app)app.prepend(d)};
 if(mCarg)pinta();else mantCarga().then(pinta)}
(function(){const st=document.createElement("style");st.textContent=`
.mley{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:12px;color:var(--mu);margin-top:8px}
.mchip{display:inline-flex;align-items:center;gap:3px;border-radius:999px;padding:3px 9px;font-size:12px;border:1.5px solid var(--pr);color:var(--pr);background:color-mix(in srgb,var(--pr) 10%,transparent)}
.mchip i{font-style:normal;font-weight:800;font-size:10px;opacity:.85}.mchip.s{border-color:#ef6c00;color:#ef6c00;background:color-mix(in srgb,#ef6c00 10%,transparent)}
.mchip.ok{border-color:#2e9e44;color:#2e9e44;background:color-mix(in srgb,#2e9e44 12%,transparent)}.mchip.g{font-size:15px;padding:5px 11px}
.mchip.cx{border-color:#9e9e9e;color:#757575;background:color-mix(in srgb,#9e9e9e 12%,transparent);text-decoration:line-through}.mmini.cx{background:#9e9e9e;text-decoration:line-through}
.mfila.cx{opacity:.85}.mizq{display:flex;flex-direction:column;align-items:center;gap:4px;flex:none;width:86px}.mizq .mchip.g{font-size:13px;padding:4px 8px;max-width:100%;box-sizing:border-box}.mest{font-size:10.5px;color:var(--mu);text-align:center;line-height:1.25;overflow-wrap:anywhere}.mest.ok{color:#2e9e44;font-weight:600}.mest.cx{color:#757575;font-weight:600}
.mder{display:flex;flex-direction:column;align-items:stretch;gap:6px;flex:none;width:132px}.mderb{display:flex;gap:6px;justify-content:flex-end}.mder .mbtn{flex:1;padding:8px 6px!important}.mder .mcanc{max-width:none}
.mcxt{color:#757575;font-weight:600;font-size:13px}.mcanc{display:flex;align-items:center;gap:6px;font-size:11px;line-height:1.2;color:var(--tx);cursor:pointer;border:1px solid var(--bd);border-radius:8px;padding:5px 6px;max-width:150px;box-sizing:border-box}.mcanc input{width:18px;height:18px;margin:0;accent-color:#757575}
.mnoren{font-size:11px;font-weight:700;color:#fff;background:#9e9e9e;border-radius:999px;padding:1px 8px;margin-left:6px}
.mnore{margin:8px 0;border:1.5px solid #9e9e9e;border-radius:10px;padding:6px 10px}.mnore>summary{cursor:pointer;font-weight:700;font-size:13px;color:#616161}.mnorf{display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px dashed var(--bd)}.mnori{flex:1;min-width:0;font-size:13px}.mrep{width:auto;margin:0;padding:6px 10px;font-size:13px}.mrpr{color:var(--pr);font-weight:600;font-size:12px}.mrepc{display:flex;flex-direction:column;align-items:stretch;gap:6px;flex:none}.mrdel{width:auto;margin:0;padding:5px 0;display:flex;align-items:center;justify-content:center;color:#d32f2f!important;border-color:#d32f2f!important}.mrdel svg{width:18px;height:18px}
.malta>summary{cursor:pointer;list-style:none}.malta>summary::-webkit-details-marker{display:none}.malta>summary::before{content:"▸ ";color:var(--pr)}.malta[open]>summary::before{content:"▾ "}
.mtgrp{border-top:1px solid var(--bd)}.mtgrp>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;padding:8px 0;flex-wrap:nowrap}.mtgrp>summary::-webkit-details-marker{display:none}
.mtgrp>summary::before{content:"▸";color:var(--pr);font-size:13px;flex:none}.mtgrp[open]>summary::before{content:"▾"}
.mtnom{font-size:12px;font-weight:800;letter-spacing:.6px;color:var(--mu);flex:none;min-width:34px}.mtpos{display:flex;flex-wrap:wrap;gap:4px;flex:1;min-width:0}.mtpen{font-size:11px;color:var(--mu);flex:none}.mtgrp>.mcaja:first-of-type{border-top:none}
.mtsep{font-size:11px;font-weight:800;letter-spacing:.6px;color:var(--mu);padding:8px 0 2px;border-top:1px solid var(--bd)}.mtsep+.mcaja{border-top:none}
.mhoy{border:2px solid #2e9e44;padding:8px 10px!important}.mhoyt{font-weight:700;color:#2e9e44;font-size:12.5px;display:flex;align-items:baseline;gap:6px}
.mhoyn{margin-left:auto;font-weight:500;font-size:11px;color:var(--mu);white-space:nowrap}
.mcols{display:grid;gap:6px;margin-top:6px}.mcol{display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-width:0;border-left:2px solid var(--bd);padding-left:6px}
.mcolt{font-size:10.5px;font-weight:800;letter-spacing:.5px;color:var(--mu)}.mcol .mchip{font-size:11.5px;padding:1px 7px;max-width:100%;box-sizing:border-box}.mcol .mchip i{font-size:9px}.mdchips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.mfila{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--bd)}.mfila .mfinfo{flex:1;min-width:0;font-size:14px}.mfila .mfinfo .mu{font-size:12px}
.mbtn{width:auto!important;margin:0!important;padding:8px 12px!important;font-size:13px}.mdel{width:auto!important;margin:0!important;padding:8px 10px!important;color:#d32f2f!important;border-color:#d32f2f!important}
.mnav{align-items:center;justify-content:space-between}.mnav button{width:auto!important;margin:0!important;padding:6px 16px!important;font-size:18px}
.mcal{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}.mcab{text-align:center;font-size:11px;font-weight:700;color:var(--mu);padding:2px 0}
.mdia{min-height:62px;min-width:0;border:1px solid var(--bd);border-radius:8px;background:var(--card);padding:2px;display:flex;flex-direction:column;align-items:stretch;gap:1px;margin:0;width:auto;color:var(--tx);font:inherit;cursor:pointer;overflow:hidden}
.mdia .mnum{font-size:11px;font-weight:700;text-align:left;padding-left:2px}.mdia.hoy{border:2px solid #2e9e44}.mdia.hoy .mnum{color:#2e9e44}.mdia.sel{outline:2px solid var(--pr);outline-offset:-2px}
.mdia.tiene{background:color-mix(in srgb,var(--pr) 6%,var(--card))}.mdia.todo{background:color-mix(in srgb,#2e9e44 8%,var(--card))}
.mmini{font-size:8.5px;font-weight:700;border-radius:3px;padding:0 1px;text-align:center;letter-spacing:-.2px;color:#fff;background:var(--pr);line-height:1.35;white-space:nowrap;overflow:hidden}.mmini.s{background:#ef6c00}.mmini.ok{background:#2e9e44}.mmas{font-size:9.5px;color:var(--mu)}
.mhora{font-size:12px;color:var(--mu);margin-top:1px}.mnota{font-size:12px;font-weight:700;color:#d32f2f;margin-top:2px}
.mhdr{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex:none}.mevt{font-size:12px;font-weight:600;color:var(--mu);white-space:nowrap}.mevt b{color:var(--tx);font-size:14px;letter-spacing:.5px}
.mcaja{border-top:1px solid var(--bd)}.mcaja .mfila{border-top:none;padding:12px 0;gap:8px}.mcaja.ab{background:color-mix(in srgb,var(--pr) 3%,transparent);margin:0 -12px;padding:0 12px 12px;border-radius:10px}
.mtog{font-size:12px;font-weight:700;color:var(--pr);margin-top:4px}.mcuerpo{display:flex;flex-direction:column;gap:12px}
.msec{border:1px solid var(--bd);border-radius:10px;padding:10px;background:var(--card)}.msect{font-weight:700;font-size:14px;margin-bottom:6px;display:flex;align-items:baseline;gap:6px;flex-wrap:wrap}.msect span{font-weight:500;font-size:12px;color:var(--mu)}
.minc{padding:6px 0;border-top:1px dashed var(--bd)}.minc:first-of-type{border-top:none}.mincc{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px}.mincd{font-size:12.5px;color:var(--mu);margin-top:2px}
.mtrab{width:100%;box-sizing:border-box;min-height:120px;font-size:15px;line-height:1.45;background:repeating-linear-gradient(transparent 0 21px,color-mix(in srgb,var(--bd) 70%,transparent) 21px 22px);background-attachment:local}.mnotas{white-space:pre-wrap;font-size:14px}
.mfile{display:flex!important;justify-content:center;align-items:center;margin-top:12px;padding:12px;border-radius:10px;cursor:pointer;font-weight:700}`;document.head.appendChild(st)})();
})();
