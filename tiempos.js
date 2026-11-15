/* ===== v480: ⏱ TIEMPOS POR AVERÍA Y POR PBB (15/11/2026) · Inicio → «⏱ Tiempos por avería» (Administrador)
   Con las OT cerradas que tienen horas: respuesta = llegada − inicio · reparación = cierre − llegada · total = cierre − inicio.
   Agrupa por avería (la caja de la guía que da el análisis de la OT, con los alias de campo aplicados) y por PBB.
   Periodo: 30 / 90 / 365 días o todo. «📄 PDF» saca el informe para AENA. ===== */
(function(){
"use strict";
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const hm=v=>{const m=String(v||"").match(/^(\d{1,2}):(\d{2})/);return m?(+m[1])*60+(+m[2]):null};
const dif=(a,b)=>{if(a==null||b==null)return null;let d=b-a;if(d<0)d+=1440;return d>720?null:d}; /* pasa de medianoche; >12 h = dato erróneo */
const fm=m=>m==null||isNaN(m)?"—":m<60?Math.round(m)+" min":Math.floor(m/60)+" h "+String(Math.round(m%60)).padStart(2,"0");
const med=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
const cat=i=>{try{const o=Object.assign({},i,{estado:"abierta"});
  const S=typeof segOT=="function"?segOT(o):null;if(S&&S.sen&&S.sen.length)return S.sen.map(x=>x[4]).join(" / ");
  const R=typeof anaOT=="function"?anaOT(o):null;if(R&&R.guia&&R.guia.length)return String(R.guia[0].t).replace(/\s*\([^)]*\)\s*$/,"");
  if(S&&S.lim)return "Límite activado"}catch(e){}
 const d=String((window.aliasCampo?aliasCampo(i.desc):i.desc)||"Sin descripción").trim();return "Sin clasificar · "+(d.length>48?d.slice(0,46)+"…":d)};
let dias=90;
function datos(){const lim=dias?Date.now()-dias*864e5:0,F=[];
 (typeof inc!="undefined"?inc:[]).forEach(i=>{if(!i||i.estado!="cerrada")return;const f=Date.parse(i.fecha||"");if(lim&&f&&f<lim)return;
  const a=hm(i.hIni),l=hm(i.hLle),c=hm(i.hCie);const r=dif(a,l),p=dif(l,c),t=dif(a,c);if(p==null&&t==null)return;
  F.push({i,pos:String(i.pos||"?"),cat:cat(i),r,p,t:t!=null?t:(r!=null&&p!=null?r+p:null)})});return F}
function agrupa(F,k){const G=new Map();F.forEach(x=>{const g=G.get(x[k])||{k:x[k],L:[]};g.L.push(x);G.set(x[k],g)});
 return [...G.values()].map(g=>{const n=g.L.length,T=g.L.map(x=>x.t).filter(v=>v!=null),P=g.L.map(x=>x.p).filter(v=>v!=null),R=g.L.map(x=>x.r).filter(v=>v!=null);
  const cs=new Map();g.L.forEach(x=>cs.set(x.cat,(cs.get(x.cat)||0)+1));const top=[...cs.entries()].sort((a,b)=>b[1]-a[1])[0];
  const ps=new Map();g.L.forEach(x=>ps.set(x.pos,(ps.get(x.pos)||0)+1));
  return {k:g.k,n,mt:med(T),mp:med(P),mr:med(R),mx:T.length?Math.max(...T):null,sum:T.reduce((a,b)=>a+b,0),top:top?top[0]+(top[1]>1?" ("+top[1]+")":""):"",pos:[...ps.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([p,c])=>p+(c>1?"×"+c:"")).join(" ")}})}
const st=document.createElement("style");st.textContent=`
#tmv{position:fixed;inset:0;z-index:99995;background:var(--bg);color:var(--tx);overflow:auto;-webkit-overflow-scrolling:touch;padding:0 10px 40px}
#tmv .avtool{position:sticky;top:0;z-index:1;display:flex;align-items:center;gap:6px;padding:max(10px,env(safe-area-inset-top)) 0 10px;background:var(--bg);border-bottom:1px solid var(--bd)}
#tmv .avtool h3{flex:1;margin:0;font-size:16px}#tmv .avtool button{width:auto!important;margin:0!important;padding:8px 10px!important}
.tmper{display:flex;gap:6px;margin:10px 0}.tmper button{flex:1;margin:0!important;padding:7px 2px!important;font-size:13px}
.tmk{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}.tmk div{border:1px solid var(--bd);border-radius:10px;padding:8px;text-align:center;background:var(--card)}
.tmk b{display:block;font-size:17px}.tmk small{font-size:11px;color:var(--mu)}
.tmt{width:100%;border-collapse:collapse;font-size:12.5px;margin-bottom:16px}.tmt th{text-align:left;font-size:11px;color:var(--mu);border-bottom:1px solid var(--bd);padding:4px 3px}
.tmt td{padding:6px 3px;border-bottom:1px dashed var(--bd);vertical-align:top}.tmt td.n{text-align:right;white-space:nowrap}.tmt small{color:var(--mu)}
.tmbar{height:5px;border-radius:3px;background:var(--ac);margin-top:3px;opacity:.8}`;
document.head.appendChild(st);
window.tmPanel=function(){let d=document.getElementById("tmv");if(!d){d=document.createElement("div");d.id="tmv";document.body.appendChild(d)}
 const F=datos(),C=agrupa(F,"cat").sort((a,b)=>b.sum-a.sum),P=agrupa(F,"pos").sort((a,b)=>b.sum-a.sum);
 const mxC=Math.max(1,...C.map(x=>x.sum)),mxP=Math.max(1,...P.map(x=>x.sum));
 const T=F.map(x=>x.t).filter(v=>v!=null),R=F.map(x=>x.r).filter(v=>v!=null);
 const pb=[30,90,365,0].map(v=>`<button class="${v==dias?"pri":"sec"}" onclick="tmDias(${v})">${v?v+" días":"Todo"}</button>`).join("");
 d.innerHTML=`<div class="avtool"><h3>⏱ Tiempos por avería</h3><button class="sec" onclick="tmPDF()">📄 PDF</button><button class="sec" onclick="document.getElementById('tmv').remove()">✕</button></div>
 <div class="tmper">${pb}</div>
 <div class="tmk"><div><b>${F.length}</b><small>OT cerradas con horas</small></div><div><b>${fm(med(R))}</b><small>respuesta media</small></div><div><b>${fm(med(T))}</b><small>total medio</small></div></div>
 ${F.length?`<h3 style="font-size:15px;margin:6px 0">Por avería <small class="mu">(ordenado por horas totales)</small></h3>
 <table class="tmt"><tr><th>Avería</th><th>OT</th><th>Media</th><th>Total</th></tr>${C.map(x=>`<tr><td>${E(x.k)}<br><small>PBB ${E(x.pos)} · reparación ${fm(x.mp)} · máx ${fm(x.mx)}</small><div class="tmbar" style="width:${Math.max(4,x.sum/mxC*100)}%"></div></td><td class="n">${x.n}</td><td class="n">${fm(x.mt)}</td><td class="n">${fm(x.sum)}</td></tr>`).join("")}</table>
 <h3 style="font-size:15px;margin:6px 0">Por PBB <small class="mu">(las que más guerra dan arriba)</small></h3>
 <table class="tmt"><tr><th>PBB</th><th>OT</th><th>Media</th><th>Total</th></tr>${P.map(x=>`<tr><td><b>${E(x.k)}</b><br><small>${E(x.top)}</small><div class="tmbar" style="width:${Math.max(4,x.sum/mxP*100)}%"></div></td><td class="n">${x.n}</td><td class="n">${fm(x.mt)}</td><td class="n">${fm(x.sum)}</td></tr>`).join("")}</table>`
 :`<div class="mu" style="margin:16px 0">No hay OT cerradas con horas de inicio, llegada y cierre en este periodo.</div>`}
 <div class="mu" style="font-size:11px">Respuesta = llegada − inicio · Reparación = cierre − llegada · Total = cierre − inicio. Se descartan tiempos de más de 12 h (horas mal puestas).</div>`;
 d._F=F;d._C=C;d._P=P};
window.tmDias=v=>{dias=v;tmPanel()};
window.tmPDF=async function(){const d=document.getElementById("tmv");if(!d)return;try{await cargaJsPDF()}catch(e){msg("No se ha podido cargar el generador de PDF (sin conexión)");return}
 const {jsPDF}=window.jspdf;const doc=new jsPDF({unit:"mm",format:"a4"});let y=16;const W=182;
 const t=(s,sz,b)=>{doc.setFont("helvetica",b?"bold":"normal");doc.setFontSize(sz||10);doc.splitTextToSize(String(s),W).forEach(l=>{if(y>284){doc.addPage();y=16}doc.text(l,14,y);y+=sz?sz*.45:4.6})};
 const fila=(c,b)=>{if(y>284){doc.addPage();y=16}doc.setFont("helvetica",b?"bold":"normal");doc.setFontSize(9);const L=doc.splitTextToSize(String(c[0]),100);
  doc.text(L,14,y);doc.text(String(c[1]),120,y,{align:"right"});doc.text(String(c[2]),150,y,{align:"right"});doc.text(String(c[3]),194,y,{align:"right"});y+=Math.max(1,L.length)*4.2+1.2};
 t("PBB TKE Barajas · Tiempos por avería y por pasarela",14,true);y+=1;
 t(`Periodo: ${dias?"últimos "+dias+" días":"todo el histórico"} · generado ${new Date().toLocaleString("es-ES")} · ${d._F.length} OT cerradas con horas`,9);y+=3;
 t("Por avería",12,true);fila(["Avería","OT","Media","Total"],true);d._C.forEach(x=>fila([x.k+"  (PBB "+x.pos+")",x.n,fm(x.mt),fm(x.sum)]));y+=4;
 t("Por PBB",12,true);fila(["PBB · avería más repetida","OT","Media","Total"],true);d._P.forEach(x=>fila([x.k+" · "+x.top,x.n,fm(x.mt),fm(x.sum)]));y+=4;
 t("Respuesta = llegada - inicio · Reparación = cierre - llegada · Total = cierre - inicio. Tiempos de más de 12 h descartados.",8);
 const nom=`Tiempos_PBB_${new Date().toISOString().slice(0,10)}.pdf`;
 try{const b=doc.output("blob"),f=new File([b],nom,{type:"application/pdf"});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:nom});return}}catch(e){if(e&&e.name=="AbortError")return}
 doc.save(nom)};
})();
