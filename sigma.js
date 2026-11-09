/* ===== v388: «REGISTRAR OT» + botón 🔔 SIGMAS
   Alarmas Sigma que el SCADA del aeropuerto muestra y que normalmente pasa el Responsable de Turno: se teclean la posición PBB y la alarma,
   la actuación es ir a la posición y RESETEAR. No llevan número de orden. Se guardan en Supabase (tabla alarmas_sigma) para análisis;
   si no hay conexión quedan en cola en el móvil y se suben solas. Si la Sigma la reporta CGA → OT normal con su número de orden. ===== */
(function(){
 const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const BELL='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M2.5 4.5 4 6M21.5 4.5 20 6"/></svg>';
 const st=document.createElement("style");st.textContent=`
.sigB{margin-left:auto;display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border:0;border-radius:8px;background:#7c3aed;color:#fff;font-weight:800;font-size:13px;letter-spacing:1px;cursor:pointer;box-shadow:0 1px 3px #0003}
.sigB svg{animation:sigRing 2.4s ease-in-out infinite;transform-origin:50% 10%}
@keyframes sigRing{0%,80%,100%{transform:rotate(0)}84%{transform:rotate(14deg)}88%{transform:rotate(-12deg)}92%{transform:rotate(8deg)}96%{transform:rotate(-4deg)}}
.sigF h3{display:flex;align-items:center;gap:8px;margin:0}.sigF h3 .sigI{color:#7c3aed}
.sigF .sigN{font-size:12.5px;color:var(--mu,#666);margin-top:4px}
.sigF .sigAct{margin-top:10px;padding:9px 10px;border-radius:8px;background:#7c3aed14;border:1px solid #7c3aed55;font-size:13px}
.sigF .sigAct b{color:#7c3aed}
.sigF .sigCGA{margin-top:8px;padding:8px 10px;border-radius:8px;background:#fff4e5;border:1px solid #f59e0b;color:#7a4a00;font-size:12.5px}
.sigF .sigRow{display:flex;gap:8px;align-items:flex-end}.sigF .sigRow>*{min-width:0}.sigF .sigRow select,.sigF .sigRow input{width:100%;box-sizing:border-box}.sigF #sg_pn{text-align:center;font-weight:700}
.sigF .sigRs{display:flex;gap:6px;margin-top:4px}.sigF .sigRs button{flex:1;padding:10px 2px;border-radius:8px;border:1px solid var(--bd,#ccc);background:var(--card,#fff);color:var(--tx,#111);font-weight:700;font-size:12.5px}
.sigF .sigRs button.on{background:#16a34a;border-color:#16a34a;color:#fff}.sigF .sigRs button.on.no{background:#dc2626;border-color:#dc2626}
.sigAc{margin-top:10px;width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:13px;border:0;border-radius:10px;background:#16a34a;color:#fff;font-weight:800;font-size:16px;letter-spacing:1px;text-transform:uppercase;box-shadow:0 2px 6px #16a34a55}
.sigAc.lat{animation:sigLat .5s ease-in-out 3}@keyframes sigLat{50%{transform:scale(1.04);box-shadow:0 0 0 6px #16a34a44}}
.sigL li.nv{border-left:4px solid #16a34a;padding-left:6px;background:#16a34a0d}.sigL li .nvT{display:inline-block;margin-left:4px;padding:0 5px;border-radius:4px;background:#16a34a;color:#fff;font-size:10px;font-weight:800;vertical-align:middle}
.sigH{margin-top:14px;border-top:1px solid var(--bd,#ddd);padding-top:8px}
.sigH summary{font-weight:700;font-size:13px;cursor:pointer}
.sigL{list-style:none;margin:6px 0 0;padding:0;max-height:34vh;overflow:auto}
.sigL li{display:flex;gap:8px;align-items:flex-start;padding:6px 2px;border-bottom:1px dashed var(--bd,#ddd);font-size:12.5px}
.sigL li .p{font-weight:800;min-width:54px}.sigL li .a{flex:1;min-width:0}.sigL li .t{color:var(--mu,#777);white-space:nowrap;text-align:right}
.sigL li .ko{color:#dc2626;font-weight:700}.sigL li .pd{color:#b45309;font-weight:700}
.sigL li{cursor:pointer;-webkit-tap-highlight-color:transparent}.sigL li:active{background:#7c3aed12}.sigL li.ed{background:#7c3aed1f;outline:2px solid #7c3aed;border-radius:6px}
.sigDel{margin-top:5px;display:inline-flex;align-items:center;justify-content:center;gap:4px;min-width:34px;height:28px;padding:0 6px;border-radius:6px;border:1px solid #c6282866;background:transparent;color:#c62828;font-size:11px;font-weight:800}
.sigDel.sure{background:#c62828;color:#fff;border-color:#c62828}
.sigEs{display:inline-block;margin-top:3px;padding:2px 7px;border-radius:6px;font-size:10.5px;font-weight:800;letter-spacing:.4px;color:#fff;white-space:nowrap}
.sigEs.eok{background:#16a34a}.sigL li .sigEs.eko{background:#dc2626;color:#fff}.sigEs.epe{background:#d97706}
.sigF .sigRs button.on.pe{background:#d97706;border-color:#d97706}
.sigEd{display:flex;align-items:center;gap:8px;margin-top:8px;padding:8px 10px;border-radius:8px;background:#7c3aed14;border:1px solid #7c3aed;font-size:12.5px}.sigEd b{color:#5b21b6}.sigEd button{margin-left:auto;padding:6px 10px;border-radius:6px;border:1px solid #7c3aed;background:#fff;color:#5b21b6;font-weight:700;font-size:12px}
.sigTop{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.sigTop span{font-size:12px;padding:3px 8px;border-radius:12px;background:#7c3aed1a;color:#5b21b6;font-weight:700}`;
 document.head.appendChild(st);

 const LK="sig_cache",LP="sig_pend";
 const lee=k=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch(e){return[]}};
 const guarda=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
 const hm=()=>{const d=new Date();return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")};
 const hoyS=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
 const fDM=f=>{const m=String(f||"").match(/^(\d{4})-(\d{2})-(\d{2})/);if(!m)return"";return m[0]==hoyS()?"HOY":m[3]+"/"+m[2]};
 const quien=()=>{try{return (typeof tecNombre!="undefined"&&tecNombre?tecNombre:"")+(typeof turno!="undefined"&&turno?" · "+turno:"")}catch(e){return""}};
 const S={res:"PENDIENTE"};
 const SIGT=["PAS","AAA","AAP","HZ","SVGA"];
 const posDe=v=>{v=String(v||"").trim().toUpperCase();if(!v)return"";const ps=(typeof POS!="undefined"?POS:[]).map(String);return ps.find(x=>x==v||x=="T"+v)||""};
 window.sigPosT=function(){const n=$("#sg_pn"),s=$("#sg_pos");const p=posDe(n.value);s.value=p;n.style.borderColor=n.value&&!p&&n.value.length>=3?"#dc2626":""};
 window.sigPosS=function(){const n=$("#sg_pn");if(n){n.value=$("#sg_pos").value;n.style.borderColor=""}};

 async function subePend(){const p=lee(LP);if(!p.length||typeof sb=="undefined")return;const q=[];
  for(const r of p){try{const z=Object.assign({},r);delete z._lk;delete z._pend;const x=await sb.from("alarmas_sigma").insert(z).select();if(x.error)q.push(r)}catch(e){q.push(r)}}
  guarda(LP,q)}
 async function carga(){if(typeof sb=="undefined")return lee(LK);
  try{const r=await sb.from("alarmas_sigma").select("*").order("created_at",{ascending:false}).limit(300);if(!r.error&&r.data){guarda(LK,r.data);return r.data}}catch(e){}
  return lee(LK)}

 const esBox=r=>{r=r||"RESETEADA";const c=r=="RESETEADA"?"ok":r=="NO RESETEA"?"ko":"pe";return`<span class="sigEs e${c}">${c=="ok"?"✔ ":c=="ko"?"✖ ":"⏳ "}${E(r)}</span>`};
 const enLote=x=>(S.lote||[]).some(k=>(k.id!=null&&k.id==x.id)||(k.lk&&k.lk==x._lk));
 const pintaAc=()=>{const t=document.getElementById("sg_act");if(t){const n=(S.lote||[]).length;t.textContent=n?`ACEPTAR (${n} registrada${n>1?"s":""})`:"ACEPTAR"}};
 function lista(l){const p=lee(LP).map(x=>Object.assign({_pend:1},x)).reverse();const t=[...p,...l];
  if(!t.length)return'<div class="mu" style="font-size:12.5px;margin-top:6px">Todavía no hay alarmas Sigma registradas.</div>';
  const d30=Date.now()-30*864e5,cnt={};t.forEach(x=>{const ts=Date.parse(x.created_at||x.fecha||"")||Date.now();if(ts<d30)return;const k="PBB "+x.pos+(x.tipo?" "+x.tipo:"")+(x.alarma?" · "+x.alarma:"");cnt[k]=(cnt[k]||0)+1});
  S.vis=t.slice(0,60);const rep=Object.entries(cnt).filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]).slice(0,6);
  return (rep.length?`<div class="mu" style="font-size:12px;margin-top:6px"><b>Repetidas en 30 días</b> (posibles averías de fondo):</div><div class="sigTop">${rep.map(([k,n])=>`<span>${E(k)} ×${n}</span>`).join("")}</div>`:"")+
   `<ul class="sigL">${S.vis.map((x,ix)=>`<li data-ix="${ix}" onclick="sigEdita(${ix})" class="${S.ed&&((S.ed.id&&S.ed.id==x.id)||(S.ed.lk&&S.ed.lk==x._lk))?"ed":""} ${enLote(x)?"nv":""}"><span class="p">PBB ${E(x.pos)}${x.tipo?`<br><small>${E(x.tipo)}</small>`:""}<br><button type="button" class="sigDel" aria-label="Eliminar del registro" onclick="event.stopPropagation();sigBorra(${ix},this)"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg></button></span><span class="a">${x.alarma?E(x.alarma):'<i class="mu">sin texto de alarma</i>'}${enLote(x)?'<span class="nvT">NUEVA</span>':""}${x.obs?`<br><span class="mu">${E(x.obs)}</span>`:""}${x._pend?` · <span class="pd">pendiente de subir</span>`:""}</span><span class="t">${E(fDM(x.fecha))} ${E(x.hora||"")}<br>${E(x.rep||"")}<br>${esBox(x.resultado)}</span></li>`).join("")}</ul>`}

 window.sigAbre=async function(){S.res="PENDIENTE";S.ed=null;S.lote=[];S.abierta=true;
  const prev=lee(LK),al=[...new Set(prev.map(x=>x.alarma).filter(Boolean))].slice(0,40);
  const ps=(typeof POS!="undefined"?POS:[]);
  $("#sheetc").innerHTML=`<div class="sigF"><h3><span class="sigI">${BELL}</span>Alarma Sigma (SCADA)</h3>
  <div class="sigN">Aviso del SCADA sin número de orden. Normalmente lo pasa el Responsable de Turno. Toca una línea del historial para editarla.</div><div id="sg_ed"></div>
  <div class="sigRow"><div style="flex:1.25"><label>Posición PBB</label><select id="sg_pos" onchange="sigPosS()"><option value="">Elegir…</option>${ps.map(p=>`<option>${p}</option>`).join("")}</select></div>
  <div style="flex:.85"><label>Teclear</label><input id="sg_pn" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="nº" oninput="sigPosT()"></div>
  <div style="flex:1"><label>Tipo</label><select id="sg_t">${SIGT.map(t=>`<option>${t}</option>`).join("")}</select></div></div>
  <label>Hora aviso</label><input id="sg_h" type="time" value="${hm()}">
  <label>Reportado por</label><select id="sg_r" onchange="sigRep()"><option>Responsable Turno</option><option>CGA</option><option>Otro</option></select>
  <input id="sg_ro" class="hide" style="margin-top:6px" placeholder="¿Quién?">
  <div id="sg_cga" class="sigCGA hide">Si la Sigma la reporta <b>CGA</b> se trata como una <b>OT normal con su número de orden</b>.<button class="pri" style="margin-top:8px;width:100%" onclick="sigAOT()">REGISTRAR COMO OT</button></div>
  <div class="sigAct">Actuación: ir a la posición indicada y <b>RESETEAR</b> la alarma.</div>
  <label>Resultado</label><div class="sigRs"><button type="button" class="pe on" data-r="PENDIENTE" onclick="sigRes(this)">⏳ PENDIENTE</button><button type="button" data-r="RESETEADA" onclick="sigRes(this)">✔ RESETEADA</button><button type="button" class="no" data-r="NO RESETEA" onclick="sigRes(this)">✖ NO RESETEA</button></div>
  <label>Alarma SCADA · opcional (recomendable)</label><input id="sg_a" list="sg_al" autocomplete="off" placeholder="Ej.: Fallo variador traslación"><datalist id="sg_al">${al.map(a=>`<option value="${E(a)}">`).join("")}</datalist>
  <label>Observaciones</label><textarea id="sg_o" rows="2" placeholder="Opcional"></textarea>
  <button class="pri" id="sg_ok" style="margin-top:12px;width:100%" onclick="sigGuarda()">GUARDAR SIGMA</button>
  <button type="button" class="sigAc" id="sg_ac" onclick="sigAcepta()"><span id="sg_act">ACEPTAR</span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg></button>
  <details class="sigH" open><summary>Historial de alarmas Sigma</summary><div id="sg_l">${lista(prev)}</div></details></div>`;
  const sh=$("#sheet");sh.style.display="flex";sh.classList.add("lpatop");setTimeout(()=>{if(document.querySelector("#sheetc .sigF"))sh.classList.add("lpatop")},0);
  try{await subePend()}catch(e){}const l=await carga();const d=document.getElementById("sg_l");if(d)d.innerHTML=lista(l)};
 window.sigEdita=function(ix){const x=(S.vis||[])[ix];if(!x)return;S.ed={id:x.id||null,lk:x._lk||null,x};
  const v=(id,val)=>{const e=$(id);if(e)e.value=val==null?"":val};v("#sg_pos",posDe(x.pos)||"");v("#sg_pn",x.pos);v("#sg_t",x.tipo||"PAS");v("#sg_h",x.hora||"");
  const rp=String(x.rep||"Responsable Turno");if(/^Otro/.test(rp)){v("#sg_r","Otro");v("#sg_ro",rp.replace(/^Otro:\s*/,""))}else v("#sg_r",rp);sigRep();
  v("#sg_a",x.alarma||"");v("#sg_o",x.obs||"");const b=document.querySelector(`.sigRs button[data-r="${x.resultado||"RESETEADA"}"]`);if(b)sigRes(b);
  $("#sg_ed").innerHTML=`<div class="sigEd">✏️ Editando <b>PBB ${E(x.pos)}${x.tipo?" "+E(x.tipo):""}</b> · ${E(fDM(x.fecha))} ${E(x.hora||"")}<button type="button" onclick="sigNueva()">Nueva</button></div>`;
  $("#sg_ok").textContent="GUARDAR CAMBIOS";document.querySelectorAll(".sigL li").forEach(l=>l.classList.toggle("ed",l.dataset.ix==ix));
  try{const c=$("#sheet").firstElementChild;(c&&c.scrollTo)?c.scrollTo({top:0,behavior:"smooth"}):0}catch(e){}};
 window.sigBorra=async function(ix,b){const x=(S.vis||[])[ix];if(!x)return;
  if(!b.classList.contains("sure")){document.querySelectorAll(".sigDel.sure").forEach(z=>{z.classList.remove("sure");z.innerHTML=z.dataset.ic||z.innerHTML});b.dataset.ic=b.innerHTML;b.classList.add("sure");b.innerHTML="¿BORRAR?";
   clearTimeout(S.tb);S.tb=setTimeout(()=>{if(b.isConnected&&b.classList.contains("sure")){b.classList.remove("sure");b.innerHTML=b.dataset.ic}},4000);return}
  b.disabled=true;b.textContent="…";let ok=false;
  if(x._pend){guarda(LP,lee(LP).filter(y=>y._lk!=x._lk));ok=true}
  else if(x.id!=null){try{const r=await sb.from("alarmas_sigma").delete().eq("id",x.id).select();ok=!r.error&&r.data&&r.data.length>0;if(r.error)msg("No se pudo eliminar: "+r.error.message)}catch(e){}
   if(ok)guarda(LK,lee(LK).filter(y=>y.id!=x.id));else if(!navigator.onLine)msg("Sin conexión: no se puede eliminar ahora");else msg("No se pudo eliminar (¿permiso de Técnico/Admin?)")}
  if(S.ed&&((S.ed.id&&S.ed.id==x.id)||(S.ed.lk&&S.ed.lk==x._lk)))sigNueva();
  const d=document.getElementById("sg_l");if(d)d.innerHTML=lista(ok?(x._pend?lee(LK):lee(LK)):lee(LK));if(ok){msg("Sigma eliminada · PBB "+x.pos);const l=await carga();if(d&&d.isConnected)d.innerHTML=lista(l)}};
 window.sigNueva=function(){S.ed=null;["#sg_pos","#sg_pn","#sg_a","#sg_o","#sg_ro"].forEach(i=>{const e=$(i);if(e)e.value=""});$("#sg_h").value=hm();$("#sg_r").value="Responsable Turno";sigRep();
  sigRes(document.querySelector('.sigRs button[data-r="PENDIENTE"]'));$("#sg_ed").innerHTML="";$("#sg_ok").textContent="GUARDAR SIGMA";document.querySelectorAll(".sigL li.ed").forEach(l=>l.classList.remove("ed"))};
 window.sigAcepta=function(){const n=(S.lote||[]).length;S.abierta=false;S.lote=[];closeSheet();
  msg(n?`${n} alarma${n>1?"s":""} Sigma aceptada${n>1?"s":""}`:"Sin alarmas Sigma nuevas")};
 window.sigRep=function(){const v=$("#sg_r").value;$("#sg_ro").classList.toggle("hide",v!="Otro");$("#sg_cga").classList.toggle("hide",v!="CGA");$("#sg_ok").classList.toggle("hide",v=="CGA")};
 window.sigRes=function(b){S.res=b.dataset.r;document.querySelectorAll(".sigRs button").forEach(x=>{x.classList.toggle("on",x===b)})};
 window.sigAOT=function(){const p=$("#sg_pos").value,a=$("#sg_a").value.trim(),tp=$("#sg_t").value;S.abierta=false;closeSheet();
  setTimeout(()=>{try{const fp=$("#f_pos"),fn=$("#f_posn");if(p){if(fn){fn.value=p;fn.dispatchEvent(new Event("input",{bubbles:true}))}if(fp){fp.value=p;fp.dispatchEvent(new Event("change",{bubbles:true}))}}
   document.querySelectorAll(".eqc").forEach(c=>{const on=c.value=="Sigma";if(c.checked!=on){c.checked=on;c.dispatchEvent(new Event("change",{bubbles:true}))}});
   const r=$("#f_rep");if(r)r.value="CGA";const d=$("#f_desc");if(d&&a){d.value="Alarma Sigma "+tp+": "+a;d.dispatchEvent(new Event("input",{bubbles:true}))}
   const o=$("#f_ord");if(o)o.focus()}catch(e){}},80)};
 window.sigGuarda=async function(){const pos=$("#sg_pos").value,a=$("#sg_a").value.trim();
  const pn=($("#sg_pn").value||"").trim();if(pn&&!posDe(pn)){msg(`La PBB ${pn} no está dada de alta`);$("#sg_pn").focus();return}
  if(!pos){msg("Elige o teclea la posición PBB");return}const tipo=$("#sg_t").value;
  let rep=$("#sg_r").value;if(rep=="Otro")rep="Otro: "+($("#sg_ro").value.trim()||"s/d");
  const r={pos:String(pos),tipo,alarma:a||null,rep,actuacion:"RESETEAR",resultado:S.res,obs:$("#sg_o").value.trim()||null,fecha:hoyS(),hora:$("#sg_h").value||hm(),hora_reset:S.res=="PENDIENTE"?null:hm(),tecnico:quien()||null};
  const b=$("#sg_ok");b.disabled=true;b.textContent="Guardando…";let ok=false;
  if(S.ed){const E0=S.ed;const ant=E0.x||{};r.fecha=ant.fecha||r.fecha;r.tecnico=ant.tecnico||r.tecnico;r.hora_reset=(r.resultado!=ant.resultado||!ant.hora_reset)&&r.resultado!="PENDIENTE"?hm():(ant.hora_reset||null);if(r.resultado=="PENDIENTE")r.hora_reset=null;
   if(E0.id){try{const x=await sb.from("alarmas_sigma").update(r).eq("id",E0.id).select();ok=!x.error&&x.data&&x.data.length;if(ok){const c=lee(LK).map(y=>y.id==E0.id?x.data[0]:y);guarda(LK,c)}else if(x.error)msg("No se pudo editar: "+x.error.message)}catch(e){}
    if(!ok){b.disabled=false;b.textContent="GUARDAR CAMBIOS";if(!navigator.onLine)msg("Sin conexión: no se puede editar ahora");else msg("No se pudo guardar el cambio (¿permiso de Técnico/Admin?)");return}}
   else{const q=lee(LP).map(y=>y._lk==E0.lk?Object.assign({_lk:y._lk},r):y);guarda(LP,q);ok=true}
   S.ed=null;b.disabled=false;b.textContent="GUARDAR SIGMA";$("#sg_ed").innerHTML="";const l=await carga();const d=document.getElementById("sg_l");if(d)d.innerHTML=lista(l);
   msg("Sigma actualizada · PBB "+pos+" · "+r.resultado);if(r.resultado=="NO RESETEA")setTimeout(()=>msg("No resetea: avisa al Responsable de Turno / CGA para abrir OT"),2600);sigNueva();return}
  try{const x=await sb.from("alarmas_sigma").insert(r).select();ok=!x.error;if(ok){const c=lee(LK);c.unshift(x.data&&x.data[0]||r);guarda(LK,c.slice(0,300))}}catch(e){}
  let k=null;if(ok){const c=lee(LK);k={id:c[0]&&c[0].id!=null?c[0].id:null}}
  if(!ok){const lk="L"+Date.now();const p=lee(LP);p.push(Object.assign({_lk:lk},r));guarda(LP,p);k={lk}}
  /* v397: no se cierra la ventana: se deja el formulario listo para la siguiente Sigma; se cierra con ACEPTAR */
  (S.lote=S.lote||[]).push(k);b.disabled=false;sigNueva();pintaAc();
  {const l=await carga();const d=document.getElementById("sg_l");if(d)d.innerHTML=lista(l)}
  msg((ok?"Sigma añadida · PBB "+pos:"Sin conexión: Sigma guardada en el móvil, se subirá sola")+(a?"":" · sin texto de alarma: es recomendable anotarla")+" · pulsa ACEPTAR al terminar");
  if(r.resultado=="NO RESETEA")setTimeout(()=>msg("No resetea: avisa al Responsable de Turno / CGA para abrir OT"),2600)};
 setInterval(()=>{if(lee(LP).length&&navigator.onLine)subePend().catch(()=>{})},60000);

 if(typeof closeSheet=="function"){const oc=closeSheet;closeSheet=function(){try{if(S.abierta&&document.querySelector("#sheetc .sigF")&&$("#sheet").style.display!="none"){
   const b=document.getElementById("sg_ac");if(b){b.classList.remove("lat");void b.offsetWidth;b.classList.add("lat");b.scrollIntoView({block:"center",behavior:"smooth"})}msg("Pulsa ACEPTAR para terminar con las Sigmas");return}}catch(e){}
  return oc.apply(this,arguments)}}
 if(typeof vNew=="function"){const o=vNew;vNew=function(){const r=o.apply(this,arguments);try{const h=document.querySelector("#app>.card>h3");
   if(h&&!h.querySelector(".sigB")){h.innerHTML=`<span>Registrar OT</span><button type="button" class="sigB" onclick="sigAbre()" aria-label="Registrar alarma Sigma">${BELL}SIGMAS</button>`}}catch(e){}return r}}
})();
