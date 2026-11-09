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
.sigF .sigRs{display:flex;gap:6px;margin-top:4px}.sigF .sigRs button{flex:1;padding:10px 4px;border-radius:8px;border:1px solid var(--bd,#ccc);background:var(--card,#fff);color:var(--tx,#111);font-weight:700;font-size:12.5px}
.sigF .sigRs button.on{background:#16a34a;border-color:#16a34a;color:#fff}.sigF .sigRs button.on.no{background:#dc2626;border-color:#dc2626}
.sigH{margin-top:14px;border-top:1px solid var(--bd,#ddd);padding-top:8px}
.sigH summary{font-weight:700;font-size:13px;cursor:pointer}
.sigL{list-style:none;margin:6px 0 0;padding:0;max-height:34vh;overflow:auto}
.sigL li{display:flex;gap:8px;align-items:flex-start;padding:6px 2px;border-bottom:1px dashed var(--bd,#ddd);font-size:12.5px}
.sigL li .p{font-weight:800;min-width:54px}.sigL li .a{flex:1;min-width:0}.sigL li .t{color:var(--mu,#777);white-space:nowrap;text-align:right}
.sigL li .ko{color:#dc2626;font-weight:700}.sigL li .pd{color:#b45309;font-weight:700}
.sigTop{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.sigTop span{font-size:12px;padding:3px 8px;border-radius:12px;background:#7c3aed1a;color:#5b21b6;font-weight:700}`;
 document.head.appendChild(st);

 const LK="sig_cache",LP="sig_pend";
 const lee=k=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch(e){return[]}};
 const guarda=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
 const hm=()=>{const d=new Date();return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")};
 const hoyS=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
 const fDM=f=>{const m=String(f||"").match(/^(\d{4})-(\d{2})-(\d{2})/);if(!m)return"";return m[0]==hoyS()?"HOY":m[3]+"/"+m[2]};
 const quien=()=>{try{return (typeof tecNombre!="undefined"&&tecNombre?tecNombre:"")+(typeof turno!="undefined"&&turno?" · "+turno:"")}catch(e){return""}};
 const S={res:"RESETEADA"};
 const SIGT=["PAS","AAA","AAP","HZ","SVGA"];
 const posDe=v=>{v=String(v||"").trim().toUpperCase();if(!v)return"";const ps=(typeof POS!="undefined"?POS:[]).map(String);return ps.find(x=>x==v||x=="T"+v)||""};
 window.sigPosT=function(){const n=$("#sg_pn"),s=$("#sg_pos");const p=posDe(n.value);s.value=p;n.style.borderColor=n.value&&!p&&n.value.length>=3?"#dc2626":""};
 window.sigPosS=function(){const n=$("#sg_pn");if(n){n.value=$("#sg_pos").value;n.style.borderColor=""}};

 async function subePend(){const p=lee(LP);if(!p.length||typeof sb=="undefined")return;const q=[];
  for(const r of p){try{const x=await sb.from("alarmas_sigma").insert(r).select();if(x.error)q.push(r)}catch(e){q.push(r)}}
  guarda(LP,q)}
 async function carga(){if(typeof sb=="undefined")return lee(LK);
  try{const r=await sb.from("alarmas_sigma").select("*").order("created_at",{ascending:false}).limit(300);if(!r.error&&r.data){guarda(LK,r.data);return r.data}}catch(e){}
  return lee(LK)}

 function lista(l){const p=lee(LP).map(x=>Object.assign({_pend:1},x));const t=[...p,...l];
  if(!t.length)return'<div class="mu" style="font-size:12.5px;margin-top:6px">Todavía no hay alarmas Sigma registradas.</div>';
  const d30=Date.now()-30*864e5,cnt={};t.forEach(x=>{const ts=Date.parse(x.created_at||x.fecha||"")||Date.now();if(ts<d30)return;const k="PBB "+x.pos+(x.tipo?" "+x.tipo:"")+(x.alarma?" · "+x.alarma:"");cnt[k]=(cnt[k]||0)+1});
  const rep=Object.entries(cnt).filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]).slice(0,6);
  return (rep.length?`<div class="mu" style="font-size:12px;margin-top:6px"><b>Repetidas en 30 días</b> (posibles averías de fondo):</div><div class="sigTop">${rep.map(([k,n])=>`<span>${E(k)} ×${n}</span>`).join("")}</div>`:"")+
   `<ul class="sigL">${t.slice(0,60).map(x=>`<li><span class="p">PBB ${E(x.pos)}${x.tipo?`<br><small>${E(x.tipo)}</small>`:""}</span><span class="a">${x.alarma?E(x.alarma):'<i class="mu">sin texto de alarma</i>'}${x.resultado&&x.resultado!="RESETEADA"?` · <span class="ko">${E(x.resultado)}</span>`:""}${x.obs?`<br><span class="mu">${E(x.obs)}</span>`:""}${x._pend?` · <span class="pd">pendiente de subir</span>`:""}</span><span class="t">${E(fDM(x.fecha))} ${E(x.hora||"")}<br>${E(x.rep||"")}</span></li>`).join("")}</ul>`}

 window.sigAbre=async function(){S.res="RESETEADA";
  const prev=lee(LK),al=[...new Set(prev.map(x=>x.alarma).filter(Boolean))].slice(0,40);
  const ps=(typeof POS!="undefined"?POS:[]);
  $("#sheetc").innerHTML=`<div class="sigF"><h3><span class="sigI">${BELL}</span>Alarma Sigma (SCADA)</h3>
  <div class="sigN">Aviso del SCADA sin número de orden. Normalmente lo pasa el Responsable de Turno.</div>
  <div class="sigRow"><div style="flex:1.25"><label>Posición PBB</label><select id="sg_pos" onchange="sigPosS()"><option value="">Elegir…</option>${ps.map(p=>`<option>${p}</option>`).join("")}</select></div>
  <div style="flex:.85"><label>Teclear</label><input id="sg_pn" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="nº" oninput="sigPosT()"></div>
  <div style="flex:1"><label>Tipo</label><select id="sg_t">${SIGT.map(t=>`<option>${t}</option>`).join("")}</select></div></div>
  <label>Hora aviso</label><input id="sg_h" type="time" value="${hm()}">
  <label>Reportado por</label><select id="sg_r" onchange="sigRep()"><option>Responsable Turno</option><option>CGA</option><option>Otro</option></select>
  <input id="sg_ro" class="hide" style="margin-top:6px" placeholder="¿Quién?">
  <div id="sg_cga" class="sigCGA hide">Si la Sigma la reporta <b>CGA</b> se trata como una <b>OT normal con su número de orden</b>.<button class="pri" style="margin-top:8px;width:100%" onclick="sigAOT()">REGISTRAR COMO OT</button></div>
  <div class="sigAct">Actuación: ir a la posición indicada y <b>RESETEAR</b> la alarma.</div>
  <label>Resultado</label><div class="sigRs"><button type="button" class="on" data-r="RESETEADA" onclick="sigRes(this)">✔ RESETEADA</button><button type="button" class="no" data-r="NO RESETEA" onclick="sigRes(this)">✖ NO RESETEA</button></div>
  <label>Alarma SCADA · opcional (recomendable)</label><input id="sg_a" list="sg_al" autocomplete="off" placeholder="Ej.: Fallo variador traslación"><datalist id="sg_al">${al.map(a=>`<option value="${E(a)}">`).join("")}</datalist>
  <label>Observaciones</label><textarea id="sg_o" rows="2" placeholder="Opcional"></textarea>
  <button class="pri" id="sg_ok" style="margin-top:12px;width:100%" onclick="sigGuarda()">GUARDAR SIGMA</button>
  <button class="sec" style="width:100%;margin-top:8px" onclick="closeSheet()">Cancelar</button>
  <details class="sigH" open><summary>Historial de alarmas Sigma</summary><div id="sg_l">${lista(prev)}</div></details></div>`;
  const sh=$("#sheet");sh.style.display="flex";sh.classList.add("lpatop");setTimeout(()=>{if(document.querySelector("#sheetc .sigF"))sh.classList.add("lpatop")},0);
  try{await subePend()}catch(e){}const l=await carga();const d=document.getElementById("sg_l");if(d)d.innerHTML=lista(l)};
 window.sigRep=function(){const v=$("#sg_r").value;$("#sg_ro").classList.toggle("hide",v!="Otro");$("#sg_cga").classList.toggle("hide",v!="CGA");$("#sg_ok").classList.toggle("hide",v=="CGA")};
 window.sigRes=function(b){S.res=b.dataset.r;document.querySelectorAll(".sigRs button").forEach(x=>{x.classList.toggle("on",x===b)})};
 window.sigAOT=function(){const p=$("#sg_pos").value,a=$("#sg_a").value.trim(),tp=$("#sg_t").value;closeSheet();
  setTimeout(()=>{try{const fp=$("#f_pos"),fn=$("#f_posn");if(p){if(fn){fn.value=p;fn.dispatchEvent(new Event("input",{bubbles:true}))}if(fp){fp.value=p;fp.dispatchEvent(new Event("change",{bubbles:true}))}}
   document.querySelectorAll(".eqc").forEach(c=>{const on=c.value=="Sigma";if(c.checked!=on){c.checked=on;c.dispatchEvent(new Event("change",{bubbles:true}))}});
   const r=$("#f_rep");if(r)r.value="CGA";const d=$("#f_desc");if(d&&a){d.value="Alarma Sigma "+tp+": "+a;d.dispatchEvent(new Event("input",{bubbles:true}))}
   const o=$("#f_ord");if(o)o.focus()}catch(e){}},80)};
 window.sigGuarda=async function(){const pos=$("#sg_pos").value,a=$("#sg_a").value.trim();
  const pn=($("#sg_pn").value||"").trim();if(pn&&!posDe(pn)){msg(`La PBB ${pn} no está dada de alta`);$("#sg_pn").focus();return}
  if(!pos){msg("Elige o teclea la posición PBB");return}const tipo=$("#sg_t").value;
  let rep=$("#sg_r").value;if(rep=="Otro")rep="Otro: "+($("#sg_ro").value.trim()||"s/d");
  const r={pos:String(pos),tipo,alarma:a||null,rep,actuacion:"RESETEAR",resultado:S.res,obs:$("#sg_o").value.trim()||null,fecha:hoyS(),hora:$("#sg_h").value||hm(),hora_reset:hm(),tecnico:quien()||null};
  const b=$("#sg_ok");b.disabled=true;b.textContent="Guardando…";let ok=false;
  try{const x=await sb.from("alarmas_sigma").insert(r).select();ok=!x.error;if(ok){const c=lee(LK);c.unshift(x.data&&x.data[0]||r);guarda(LK,c.slice(0,300))}}catch(e){}
  if(!ok){const p=lee(LP);p.push(r);guarda(LP,p)}
  closeSheet();msg((ok?"Alarma Sigma guardada · PBB "+pos:"Sin conexión: Sigma guardada en el móvil, se subirá sola")+(a?"":" · sin texto de alarma: es recomendable anotarla para el análisis"));
  if(S.res=="NO RESETEA")setTimeout(()=>msg("No resetea: avisa al Responsable de Turno / CGA para abrir OT"),2600)};
 setInterval(()=>{if(lee(LP).length&&navigator.onLine)subePend().catch(()=>{})},60000);

 if(typeof vNew=="function"){const o=vNew;vNew=function(){const r=o.apply(this,arguments);try{const h=document.querySelector("#app>.card>h3");
   if(h&&!h.querySelector(".sigB")){h.innerHTML=`<span>Registrar OT</span><button type="button" class="sigB" onclick="sigAbre()" aria-label="Registrar alarma Sigma">${BELL}SIGMAS</button>`}}catch(e){}return r}}
})();
