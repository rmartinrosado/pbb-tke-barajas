/* ===== v498: botón «Comp.» en la barra deslizante de abajo (16/11/2026) =====
   Abre el apartado «Componentes de campo» como CONSULTA DE REPUESTOS, sin asociar ninguna OT:
   no mira las OT abiertas ni la OT de la guía. Capa a pantalla completa dentro de la PWA (como el Check):
   · arriba fijo: título, buscador (código, nombre, modelo, referencia, palabra clave) con lupa y papelera, y filtro por zona
     (armario eléctrico, pupitre, cabina, túnel, rotonda…), sacada del código del elemento;
   · debajo, el listado con scroll propio: cada componente plegado (código, nombre y modelo); al desplegarlo, primero la caja
     «Repuesto» (modelo, qué poner al sustituir, referencia, sustituto, almacén y unidades si están guardados) y después la
     ficha técnica completa (fotos, especificaciones, conexionado y medidas en campo).
   Modos Técnico y Admin. Se cierra con «←», con la flecha atrás flotante o con el atrás del móvil. ===== */
(function(){
"use strict";
const E=s=>typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const L=()=>window.COMP_CAMPO||[];
const ZONAS={E:"Armario eléctrico",P:"Pupitre",C:"Cabina",ET:"Túnel",A:"Túnel",R:"Rotonda",T:"Traslación",H:"Hidráulica",B:"Brazo"};
const zona=c=>{const m=String(c.id||"").toUpperCase().match(/\b([A-Z]{1,3})-/);return m?(ZONAS[m[1]]||"Otros"):"Otros"};
const texto=c=>nrm([c.id,c.t,c.fab,c.claves,(c.esp||[]).map(r=>r.join(" ")).join(" "),c.av].join(" "));
/* caja «Repuesto»: lo que hace falta para pedir o cambiar la pieza */
const repuesto=c=>{const f=[];if(c.fab)f.push(["Modelo",c.fab]);
 const s=String(c.av||"").match(/AL SUSTITUIR:?\s*([^]*)$/i);if(s)f.push(["Al sustituir",s[1].trim()]);
 const r=(c.esp||[]).find(x=>/^repuesto$/i.test(x[0]));if(r)f.push(["Almacén",r[1]]);
 return f.length?`<div class="cnrep"><div class="cnrt">🔧 Repuesto</div><table>${f.map(([k,v])=>`<tr><th>${E(k)}</th><td>${E(v)}</td></tr>`).join("")}</table></div>`:""};
let capa=null,zSel="",abiertos=new Set();
function lista(){if(!capa)return;const q=nrm((capa.querySelector("#cn_q")||{}).value||"").trim();
 const ws=q.split(/\s+/).filter(Boolean);
 const todos=L(),zs=[...new Set(todos.map(zona))];
 const F=todos.filter(c=>(!zSel||zona(c)==zSel)&&(!ws.length||ws.every(w=>texto(c).includes(w))));
 capa.querySelector("#cn_z").innerHTML=[["","Todos"]].concat(zs.map(z=>[z,z])).map(([v,t])=>`<button type="button" class="cnch${zSel==v?" on":""}" data-z="${E(v)}">${E(t)} <small>${v?todos.filter(c=>zona(c)==v).length:todos.length}</small></button>`).join("");
 const el=capa.querySelector("#cn_l");
 el.innerHTML=`<div class="mu" style="font-size:12px;margin:6px 0">${F.length} componente${F.length==1?"":"s"}${ws.length||zSel?(F.length==1?" encontrado":" encontrados"):""}</div>`+
  (F.length?F.map(c=>{const k=String(c.db||c.id);return`<details class="cni" data-k="${E(k)}"${abiertos.has(k)?" open":""}><summary><span class="cmpid">${E(c.id)}</span> <b>${E(c.t)}</b>${c.fab?`<small>${E(c.fab)}</small>`:""}</summary>${repuesto(c)}${typeof compFicha=="function"?compFicha(c):""}</details>`}).join("")
  :`<div class="cnvac">Sin componentes para «${E(q)}».<br>Prueba con el código (p. ej. E-Q24), el nombre o el modelo.</div>`)}
function abre(){
 if(!capa){capa=document.createElement("div");capa.id="compCapa";
  capa.innerHTML=`<div class="cnfix"><div class="cnh"><button type="button" class="sec cnb" aria-label="Volver" onclick="cierraComp()">←</button><div class="cnti"><b>🔩 Componentes de campo</b><small>Consulta de repuestos · sin OT asociada</small></div></div>
  <div class="cnbu"><input id="cn_q" type="search" enterkeyhint="search" autocomplete="off" placeholder="Código, nombre, modelo o referencia"><button type="button" class="sec" aria-label="Buscar" id="cn_go">🔍</button><button type="button" class="sec" aria-label="Borrar búsqueda" id="cn_bo">🗑️</button></div>
  <div id="cn_z" class="cnz"></div></div><div id="cn_l" class="cnl"></div>`;
  document.body.appendChild(capa);
  const q=capa.querySelector("#cn_q");let tm=0;
  q.addEventListener("input",()=>{clearTimeout(tm);tm=setTimeout(lista,250)});
  q.addEventListener("keyup",e=>{if(e.key=="Enter"){q.blur();lista()}});
  capa.querySelector("#cn_go").onclick=()=>{q.blur();lista()};
  capa.querySelector("#cn_bo").onclick=()=>{q.value="";lista()};
  capa.querySelector("#cn_z").addEventListener("click",e=>{const b=e.target.closest(".cnch");if(!b)return;zSel=b.dataset.z||"";lista()});
  capa.querySelector("#cn_l").addEventListener("toggle",e=>{const d=e.target;if(!d.classList||!d.classList.contains("cni"))return;d.open?abiertos.add(d.dataset.k):abiertos.delete(d.dataset.k)},true)}
 lista();capa.style.display="flex";document.documentElement.style.overflow="hidden";
 try{history.pushState({comp:1},"")}catch(e){}}
function cierra(desdeHist){if(!capa||capa.style.display=="none")return;capa.style.display="none";document.documentElement.style.overflow="";
 if(!desdeHist){try{if(history.state&&history.state.comp)history.back()}catch(e){}}}
window.abreComp=abre;window.cierraComp=()=>cierra(false);
addEventListener("popstate",()=>cierra(true));
const IC='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z"/><circle cx="12" cy="12" r="3.6"/></svg>';
const pon=()=>{const nav=document.getElementById("nav");if(!nav||nav.querySelector("[data-compv]"))return;
 const ref=nav.querySelector("[data-simv]")||[...nav.children].find(x=>/Gu[ií]a/.test(x.textContent));if(!ref)return;
 const b=document.createElement("button");b.dataset.compv="1";b.title="Componentes de campo · consulta de repuestos";b.setAttribute("aria-label","Componentes de campo");
 b.innerHTML=`<span>${IC}</span>Comp.`;b.onclick=abre;nav.insertBefore(b,ref.nextSibling)};
const o=render;render=function(){const r=o.apply(this,arguments);try{pon()}catch(e){}return r};
try{pon()}catch(e){}
const st=document.createElement("style");st.textContent=`
#compCapa{position:fixed;inset:0;z-index:60;background:var(--bg,#0e1014);color:var(--tx,#e9ecf1);display:none;flex-direction:column;
 padding:max(10px,env(safe-area-inset-top)) 12px 0}
#compCapa .cnfix{flex:none;padding-bottom:8px;border-bottom:1px solid var(--bd,#2a2f38)}
#compCapa .cnh{display:flex;align-items:center;gap:10px}
#compCapa .cnb{width:44px!important;height:44px;margin:0!important;padding:0!important;font-size:22px;font-weight:800;flex:none}
#compCapa .cnti{display:flex;flex-direction:column;min-width:0}#compCapa .cnti b{font-size:17px}
#compCapa .cnti small{font:600 10px/1.4 var(--tkmo,monospace);letter-spacing:.7px;text-transform:uppercase;color:var(--mu,#8a93a3)}
#compCapa .cnbu{display:flex;gap:6px;margin-top:10px}#compCapa .cnbu input{flex:1;margin:0;min-width:0;font-size:16px}
#compCapa .cnbu button{width:auto!important;margin:0!important;padding:0 12px!important;flex:none}
#compCapa .cnz{display:flex;gap:6px;overflow-x:auto;margin-top:8px;padding-bottom:2px;scrollbar-width:none}#compCapa .cnz::-webkit-scrollbar{display:none}
#compCapa .cnch{flex:none;width:auto!important;margin:0!important;padding:5px 10px!important;border-radius:16px!important;border:1px solid var(--bd,#2a2f38)!important;
 background:transparent!important;color:var(--tx,#e9ecf1)!important;font-size:12.5px!important;font-weight:600;white-space:nowrap;min-height:0!important}
#compCapa .cnch small{opacity:.65;font-weight:700;margin-left:2px}
#compCapa .cnch.on{border-color:var(--ac,#ff7a1a)!important;color:var(--ac,#ff7a1a)!important;background:color-mix(in srgb,var(--ac,#ff7a1a) 12%,transparent)!important}
#compCapa .cnl{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding-bottom:calc(90px + env(safe-area-inset-bottom,0px))}
#compCapa .cni{border:1px solid var(--bd,#2a2f38);border-radius:8px;padding:8px 10px;margin:6px 0;background:var(--card,#171a20)}
#compCapa .cni>summary{cursor:pointer;font-size:14px;line-height:1.3}#compCapa .cni>summary small{display:block;font-size:12px;color:var(--mu,#8a93a3);margin-top:2px}
#compCapa .cnrep{margin:10px 0 4px;padding:8px 10px;border:1.5px solid var(--ac,#ff7a1a);border-radius:8px;background:color-mix(in srgb,var(--ac,#ff7a1a) 8%,transparent)}
#compCapa .cnrt{font-weight:800;color:var(--ac,#ff7a1a);margin-bottom:4px}
#compCapa .cnrep table{width:100%;border-collapse:collapse;font-size:13px}#compCapa .cnrep th{text-align:left;vertical-align:top;padding:3px 8px 3px 0;white-space:nowrap;color:var(--mu,#8a93a3);font-weight:700}
#compCapa .cnrep td{padding:3px 0;vertical-align:top}
#compCapa .cni .cmpf>.cmpt,#compCapa .cni .cmpf>.cmpm{display:none}#compCapa .cni .cmpf{border:0;padding:0}
#compCapa .cnvac{text-align:center;color:var(--mu,#8a93a3);margin-top:30px;line-height:1.5}`;
document.head.appendChild(st);
})();
