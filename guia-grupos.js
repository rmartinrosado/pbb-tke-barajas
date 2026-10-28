/* ===== v147: Guía de campo agrupada por sistema =====
 Las cajas de avería de la guía se agrupan en un desplegable por sistema (Hidráulica y elevación, Traslación, Cabina…).
 No se agrupan: Seguridad, Cotejo PLC, Inspección cable a cable, Cierre, la «Actuación más eficaz» (gef) ni las cajas sin familia.
 Un grupo solo se crea con 2 cajas o más. Si una caja del grupo está abierta (o la abre otra parte de la app: avería acotada,
 foco de hidráulica, SOS…), su grupo se abre con ella. El estado abierto de cada grupo se recuerda mientras dura la sesión. */
(function(){
const FAM=[
 ["Hidráulica y elevación",/^(Hidráulica ·|No sube \/ no baja|Esquema hidráulico)/i],
 ["Traslación y giro de ruedas",/^(No traslada|Límite de traslación|Traslación con alimentación)/i],
 ["Seguridades, rearme y antiatrapamientos",/^(PBB sin tensión|Pupitre encendido|Antiatrapamiento|Zapata|Radar de ala)/i],
 ["Cabina, capota y portón",/^(Cabina \/|Fallo de autonivelación|Capota|Portón|Sirena de cabina)/i],
 ["Equipos de servicio (A/A, 400 Hz, carro)",/^(Bloqueada por equipos|Bloqueo carro|PAS bloqueada por carro)/i],
 ["Auxiliares, cámaras y medidas",/^(Iluminación|Cámaras|Sistemas auxiliares|Medidas analógicas)/i],
 ["PBB 507 · plano propio",/^PBB 507 ·/i],
];
const FIJAS=new Set(["SEG","COT","INS","CIE","CAM","SIS"]);
const EMO=/^[\s\u{1F300}-\u{1FAFF}☀-➿️‍]+/u;
const abiertos=new Set();
const titulo=d=>{const b=d.querySelector(":scope > summary > b");if(!b)return"";
 const c=b.cloneNode(true);c.querySelectorAll(".zic,.mu,span").forEach(x=>{if(x.classList.contains("zic")||/^\(\d+\/\d+\)$/.test(x.textContent.trim()))x.remove()});
 return c.textContent.replace(EMO,"").trim()};
function familia(t,todas){for(const[n,re] of FAM)if(re.test(t))return n;
 const i=t.indexOf(" · ");if(i>2){const p=t.slice(0,i);if(todas.filter(x=>x.startsWith(p+" · ")).length>1)return p}
 return null}
function agrupa(){
 if(typeof view!="undefined"&&view!="tec")return;
 const app=document.getElementById("app");if(!app||app.querySelector("details.ggrp"))return;
 const cajas=[...app.querySelectorAll(":scope > details.gd")].filter(d=>!FIJAS.has(d.dataset.k)&&!d.classList.contains("gef"));
 const tit=new Map(cajas.map(d=>[d,titulo(d)]));const todas=[...tit.values()];
 const grupos=new Map();
 cajas.forEach(d=>{const f=familia(tit.get(d),todas);if(!f)return;if(!grupos.has(f))grupos.set(f,[]);grupos.get(f).push(d)});
 const tipo=typeof gTipo!="undefined"?gTipo:"";
 grupos.forEach((ds,f)=>{if(ds.length<2)return;
  const g=document.createElement("details");g.className="card ggrp";g.dataset.g=tipo+"|"+f;
  const ic=typeof zonaIcono=="function"&&typeof sistemaDe=="function"?zonaIcono(sistemaDe(tit.get(ds[0]),tipo)):"";
  const hechos=ds.reduce((a,d)=>{const m=(d.querySelector(":scope > summary").textContent.match(/\((\d+)\/(\d+)\)/)||[0,0,0]);return[a[0]+ +m[1],a[1]+ +m[2]]},[0,0]);
  g.innerHTML=`<summary data-zic="1"><b>${ic}${f}</b><span class="ggn">${ds.length} casos${hechos[1]?` · ${hechos[0]}/${hechos[1]}`:""}</span></summary>`;
  ds[0].before(g);ds.forEach(d=>g.appendChild(d));
  /* dentro del grupo sobra el prefijo repetido («Hidráulica · no sube» → «No sube») */
  ds.forEach(d=>{const t=tit.get(d),i=t.indexOf(" · ");if(i<2)return;const pre=t.slice(0,i+3);
   if(ds.filter(x=>tit.get(x).startsWith(pre)).length<2)return;
   const w=document.createTreeWalker(d.querySelector(":scope > summary > b"),NodeFilter.SHOW_TEXT);let n;
   while(n=w.nextNode()){const k=n.nodeValue.indexOf(pre);if(k>=0){const r=n.nodeValue.slice(k+pre.length);n.nodeValue=n.nodeValue.slice(0,k)+r.charAt(0).toUpperCase()+r.slice(1);break}}});
  if(abiertos.has(g.dataset.g)||ds.some(d=>d.open))g.open=true;
  g.addEventListener("toggle",()=>{g.open?abiertos.add(g.dataset.g):abiertos.delete(g.dataset.g)});
  ds.forEach(d=>d.addEventListener("toggle",()=>{if(d.open&&!g.open)g.open=true}))});
}
const css=document.createElement("style");
css.textContent=`details.ggrp>summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:2px 0}
details.ggrp>summary::-webkit-details-marker{display:none}
details.ggrp>summary b{flex:1 1 auto;display:flex;align-items:center;gap:8px;font-size:17px}
details.ggrp>summary::after{content:"▾";color:var(--mu);transition:transform .2s}
details.ggrp[open]>summary::after{transform:rotate(180deg)}
details.ggrp .ggn{font-size:12px;color:var(--mu);font-weight:600}
details.ggrp>details.gd{margin:8px 0 0;box-shadow:none;border:1px solid var(--bd);border-left:3px solid var(--pr)}
details.ggrp>details.gd>summary b{font-size:15px}`;
document.head.appendChild(css);
if(typeof vTec=="function"){const o=vTec;vTec=function(){const r=o.apply(this,arguments);try{agrupa()}catch(e){console.warn("grupos",e)}return r}}
/* cajas que otras partes abren por código después de pintar: abrir también su grupo */
new MutationObserver(ms=>{for(const m of ms){const d=m.target;if(d.open&&d.parentElement&&d.parentElement.matches("details.ggrp")&&!d.parentElement.open)d.parentElement.open=true}})
 .observe(document.body,{subtree:true,attributes:true,attributeFilter:["open"]});
})();
