/* ===== v468: REINCIDENCIAS Y AVERÍAS REPETIDAS (15/11/2026) =====
   · Registrar OT y SOS: si esa PBB tuvo un aviso parecido en los últimos 30 días, aviso con fecha, descripción y lo que se hizo.
   · Seguimiento OT: botón «📊 Averías repetidas» → posiciones con más OT (30 / 90 días), avisos que se repiten y tiempo medio
     de resolución (inicio → cierre). ===== */
(function(){
"use strict";
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const E=s=>typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const VAC=new Set("para pero como esta este desde hasta sobre entre cuando donde porque tiene hace solo sido ser estan estado otra otro cada todo toda todos todas muy mas menos tambien pbb pasarela posicion activado activada fallo falla aviso avisos la los las del con sin por una uno que".split(" "));
const pal=t=>new Set(nrm(t).split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!VAC.has(w)).map(w=>w.slice(0,7)));
const sim=(a,b)=>{const A=pal(a),B=pal(b);let n=0;A.forEach(w=>{if(B.has(w))n++});return n};
const dias=f=>{const d=new Date(String(f||"").slice(0,10)+"T12:00");return isNaN(d)?1e9:(Date.now()-d)/864e5};
window.reincidencias=function(pos,desc,excl,ventana){if(typeof inc=="undefined"||!pos)return[];const P=String(pos).toUpperCase().replace(/\s*·.*$/,"");
 return inc.filter(x=>x.id!==excl&&String(x.pos).toUpperCase()==P&&dias(x.fecha)<=(ventana||30)&&(!desc||sim(desc,x.desc)>=1)).sort((a,b)=>String(b.fecha).localeCompare(String(a.fecha)))};
const fh=f=>{const m=String(f||"").match(/^(\d{4})-(\d\d)-(\d\d)/);return m?`${m[3]}/${m[2]}`:E(f)};
const caja=(L,pos)=>!L.length?"":`<div class="rnc"><div class="rnch">⚠️ REINCIDENCIA · PBB ${E(pos)} · ${L.length} aviso${L.length>1?"s":""} parecido${L.length>1?"s":""} en 30 días</div>
 ${L.slice(0,4).map(x=>`<div class="rnci"><b>${fh(x.fecha)}</b> · ${E(x.tipo||"")} · ${E(x.desc||"")}${x.act?`<div class="rnca">✔ Se hizo: ${E(String(x.act).slice(0,220))}</div>`:`<div class="rnca mu">${x.estado=="abierta"?"Sigue abierta":"Sin actuación anotada"}</div>`}</div>`).join("")}
 <div class="rncp">Si se repite, la causa de fondo no está resuelta: revisar lo que se hizo y atacar el origen (ajuste, desgaste, cableado).</div>
 <button class="sec rncb" type="button" onclick="reincPanel()">📊 Averías repetidas</button></div>`;
/* --- Registrar OT --- */
function enNueva(){const d=document.getElementById("f_desc"),p=document.getElementById("f_pos");if(!d||!p)return;let b=document.getElementById("rnc_new");
 if(!b){b=document.createElement("div");b.id="rnc_new";d.insertAdjacentElement("afterend",b)}
 const pos=String(p.value||"").replace(/\s*·.*$/,"");b.innerHTML=caja(reincidencias(pos,d.value.trim()||null,null,30).slice(0,4),pos)}
document.addEventListener("input",e=>{if(e.target&&/^f_(desc|pos|posn)$/.test(e.target.id))setTimeout(enNueva,50)},true);
document.addEventListener("change",e=>{if(e.target&&/^f_(pos|posn|posm)$/.test(e.target.id))setTimeout(enNueva,50)},true);
/* --- SOS: arriba de los resultados --- */
if(typeof window.sosAnaliza=="function"){const o=window.sosAnaliza;window.sosAnaliza=async function(){const x=await o.apply(this,arguments);try{
 const r=document.getElementById("sr_res"),pos=((document.getElementById("sr_p")||{}).value||"").trim().toUpperCase(),ob=((document.getElementById("sr_ob")||{}).value||"").trim();
 if(r&&pos&&!r.querySelector(".rnc")){const L=reincidencias(pos,ob||null,null,30);if(L.length)r.insertAdjacentHTML("afterbegin",caja(L,pos))}}catch(e){}return x}}
/* --- panel de averías repetidas --- */
const min=h=>{const m=String(h||"").match(/(\d{1,2}):(\d{2})/);return m?+m[1]*60+ +m[2]:null};
window.reincPanel=function(dv){const D=dv||30;if(typeof inc=="undefined")return;const L=inc.filter(x=>dias(x.fecha)<=D);
 const porPos=new Map();L.forEach(x=>{const k=String(x.pos);porPos.set(k,(porPos.get(k)||[]).concat(x))});
 const top=[...porPos.entries()].sort((a,b)=>b[1].length-a[1].length).slice(0,10);
 /* avisos repetidos: grupos de la misma PBB con descripción parecida */
 const rep=[];porPos.forEach((xs,pos)=>{const usados=new Set();xs.forEach((a,i)=>{if(usados.has(i))return;const g=[a];xs.forEach((b,j)=>{if(j>i&&!usados.has(j)&&sim(a.desc,b.desc)>=2){g.push(b);usados.add(j)}});if(g.length>1)rep.push({pos,g})})});
 rep.sort((a,b)=>b.g.length-a.g.length);
 const tr=L.map(x=>{const a=min(x.hIni),c=min(x.hCie);return a!=null&&c!=null?(c-a+1440)%1440:null}).filter(v=>v!=null&&v<720);
 const med=tr.length?Math.round(tr.reduce((a,b)=>a+b,0)/tr.length):null;
 const tipos={};L.forEach(x=>{tipos[x.tipo||"-"]=(tipos[x.tipo||"-"]||0)+1});
 $("#sheetc").innerHTML=`<div class="rnpt"><h3 style="margin:0">📊 Averías repetidas</h3><button class="sec" onclick="closeSheet()" style="width:auto;margin:0">✕</button></div>
 <div class="gchips" style="margin:8px 0">${[30,90,365].map(d=>`<button class="${d==D?"pri":"sec"}" onclick="reincPanel(${d})">${d==365?"1 año":d+" días"}</button>`).join("")}</div>
 <div class="rnpk"><div><b>${L.length}</b><span>OT</span></div><div><b>${med!=null?med+" min":"–"}</b><span>tiempo medio inicio → cierre</span></div><div><b>${rep.length}</b><span>averías que se repiten</span></div></div>
 <div class="mu" style="font-size:12px;margin:4px 0 8px">Por tipo: ${Object.entries(tipos).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${E(k)} ${v}`).join(" · ")}</div>
 <h4 style="margin:10px 0 4px">Posiciones con más OT</h4>${top.map(([p,xs])=>`<div class="rnpb"><span>PBB ${E(p)}</span><i style="width:${Math.round(100*xs.length/top[0][1].length)}%"></i><b>${xs.length}</b></div>`).join("")||'<div class="mu">Sin OT en este periodo.</div>'}
 <h4 style="margin:12px 0 4px">Avisos que se repiten en la misma PBB</h4>${rep.slice(0,12).map(r=>`<details class="rnpr"><summary><b>PBB ${E(r.pos)}</b> · ${r.g.length}× · ${E(r.g[0].desc||"")}</summary>${r.g.map(x=>`<div class="rnci"><b>${fh(x.fecha)}</b> · ${E(x.desc||"")}${x.act?`<div class="rnca">✔ ${E(String(x.act).slice(0,200))}</div>`:""}</div>`).join("")}</details>`).join("")||'<div class="mu">Ninguno en este periodo.</div>'}`;
 const sh=$("#sheet");sh.style.display="flex"};
/* botón en Seguimiento OT */
const ponBtn=()=>{try{if(typeof view=="undefined"||view!="track")return;const c=[...document.querySelectorAll("#app>.card")].find(x=>/Seguimiento OT/i.test((x.querySelector("h3")||{}).textContent||""));if(!c||c.querySelector("#rncBtn"))return;
 const b=document.createElement("button");b.id="rncBtn";b.type="button";b.className="sec";b.textContent="📊 Averías repetidas y reincidencias";b.style.cssText="width:100%;margin-top:8px;font-weight:700";b.onclick=()=>reincPanel(30);c.appendChild(b)}catch(e){}};
let tm=null;new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(ponBtn,200)}).observe(document.documentElement,{childList:true,subtree:true});
const st=document.createElement("style");st.textContent=`
.rnc{margin:8px 0;padding:8px 10px;border:2px solid #ca8a04;border-radius:10px;background:rgba(202,138,4,.1)}
.rnch{font-weight:900;color:#a16207;font-size:13.5px;margin-bottom:4px}
.rnci{font-size:13px;padding:4px 0;border-top:1px dashed rgba(127,127,127,.35)}.rnca{font-size:12.5px;color:#2e7d32;margin-top:2px}
.rncp{font-size:12px;opacity:.85;margin-top:5px}.rncb{width:100%;margin-top:6px!important;padding:7px!important;font-size:13px!important}
.rnpt{display:flex;align-items:center;justify-content:space-between;gap:8px}
.rnpk{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.rnpk>div{border:1px solid var(--bd,#ddd);border-radius:10px;padding:8px;text-align:center}
.rnpk b{display:block;font-size:20px}.rnpk span{font-size:11px;opacity:.8}
.rnpb{display:grid;grid-template-columns:82px 1fr 30px;align-items:center;gap:6px;font-size:13px;margin:3px 0}
.rnpb i{display:block;height:12px;border-radius:6px;background:linear-gradient(90deg,#f97316,#c2410c)}.rnpb b{text-align:right}
.rnpr{border:1px solid var(--bd,#ddd);border-radius:9px;padding:5px 8px;margin:5px 0;font-size:13px}`;
document.head.appendChild(st);
})();
