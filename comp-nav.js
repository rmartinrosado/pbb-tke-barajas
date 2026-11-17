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
/* v570: listado SIEMPRE en orden alfabético por código (orden natural: E-Q2 antes que E-Q10), y a igual código por nombre */
const ordAlf=(a,b)=>String(a.id||"").localeCompare(String(b.id||""),"es",{numeric:true,sensitivity:"base"})||String(a.t||"").localeCompare(String(b.t||""),"es",{numeric:true,sensitivity:"base"});
window.compOrdenAlf=ordAlf;
const L=()=>(window.COMP_CAMPO||[]).slice().sort(ordAlf);
const ZONAS={E:"Armario eléctrico",P:"Pupitre",C:"Cabina",ET:"Túnel",A:"Túnel",R:"Rotonda",T:"Traslación",H:"Hidráulica",B:"Brazo"};
const zona=c=>{const m=String(c.id||"").toUpperCase().match(/\b([A-Z]{1,3})-/);return m?(ZONAS[m[1]]||"Otros"):"Otros"};
const texto=c=>nrm([c.id,c.t,c.fab,c.claves,(c.esp||[]).map(r=>r.join(" ")).join(" "),c.av].join(" "));
/* caja «Repuesto»: lo que hace falta para pedir o cambiar la pieza */
const repuesto=c=>{const f=[];if(c.fab)f.push(["Modelo",c.fab]);
 const s=String(c.av||"").match(/AL SUSTITUIR:?\s*([^]*)$/i);if(s)f.push(["Al sustituir",s[1].trim()]);
 const r=(c.esp||[]).find(x=>/^repuesto$/i.test(x[0]));if(r)f.push(["Almacén",r[1]]);
 return f.length?`<div class="cnrep"><div class="cnrt">🔧 Repuesto</div><table>${f.map(([k,v])=>`<tr><th>${E(k)}</th><td>${E(v)}</td></tr>`).join("")}</table></div>`:""};
let capa=null,zSel="",abiertos=new Set(),solo=null;/* v563: solo = {k:Set de claves, t:rótulo} → lista acotada a los componentes de una alarma */
function lista(){if(!capa)return;const q=nrm((capa.querySelector("#cn_q")||{}).value||"").trim();
 const ws=q.split(/\s+/).filter(Boolean);
 const todos=L(),zs=[...new Set(todos.map(zona))].sort((a,b)=>(a=="Otros")-(b=="Otros")||a.localeCompare(b,"es"));/* v570: zonas en orden alfabético, «Otros» al final */
 const F=todos.filter(c=>(!solo||solo.k.has(String(c.baseId||c.db||c.id)))&&(!zSel||zona(c)==zSel)&&(!ws.length||ws.every(w=>texto(c).includes(w))));
 capa.querySelector("#cn_z").innerHTML=[["","Todos"]].concat(zs.map(z=>[z,z])).map(([v,t])=>`<button type="button" class="cnch${zSel==v?" on":""}" data-z="${E(v)}">${E(t)} <small>${v?todos.filter(c=>zona(c)==v).length:todos.length}</small></button>`).join("");
 const el=capa.querySelector("#cn_l");
 el.innerHTML=(solo?`<div class="cnsolo"><span>🚨 ${E(solo.t)}</span><button type="button" class="sec" data-todos="1">Ver todos</button></div>`:"")+`<div class="mu" style="font-size:12px;margin:6px 0">${F.length} componente${F.length==1?"":"s"}${ws.length||zSel?(F.length==1?" encontrado":" encontrados"):""}</div>`+
  (F.length?F.map(c=>{const k=String(c.baseId||c.db||c.id);const bt=c.db?(c.baseId?"↩️<br>Restaurar":"🗑<br>Eliminar"):"🔒<br>De fábrica";
   return`<div class="cnsw${c.db?"":" fab"}" data-k="${E(k)}"><button type="button" class="cnsx" data-del="${E(k)}">${bt}</button><details class="cni" data-k="${E(k)}"${abiertos.has(k)?" open":""}><summary><span class="cmpid">${E(c.id)}</span> <b>${E(c.t)}</b>${c.fab?`<small>${E(c.fab)}</small>`:""}</summary>${repuesto(c)}${typeof compFicha=="function"?compFicha(c):""}</details></div>`}).join("")
  :`<div class="cnvac">Sin componentes para «${E(q)}».<br>Prueba con el código (p. ej. E-Q24), el nombre o el modelo.</div>`)}
function abre(){
 if(!capa){capa=document.createElement("div");capa.id="compCapa";
  capa.innerHTML=`<div class="cnfix"><div class="cnh"><button type="button" class="sec cnb" aria-label="Volver" onclick="cierraComp()">←</button><div class="cnti"><b>🔩 Componentes de campo</b><small>Consulta de repuestos · sin OT asociada</small></div></div>
  <button type="button" class="pri cninc" id="cn_inc">➕ Incorporar componente (foto)</button>
  <div class="cnbu"><input id="cn_q" type="search" enterkeyhint="search" autocomplete="off" placeholder="Código, nombre, modelo o referencia"><button type="button" class="sec" aria-label="Buscar" id="cn_go">🔍</button><button type="button" class="sec" aria-label="Borrar búsqueda" id="cn_bo">🗑️</button></div>
  <div id="cn_z" class="cnz"></div></div><div id="cn_l" class="cnl"></div>`;
  document.body.appendChild(capa);
  const q=capa.querySelector("#cn_q");let tm=0;
  q.addEventListener("input",()=>{clearTimeout(tm);tm=setTimeout(lista,250)});
  q.addEventListener("keyup",e=>{if(e.key=="Enter"){q.blur();lista()}});
  capa.querySelector("#cn_go").onclick=()=>{q.blur();lista()};
  capa.querySelector("#cn_bo").onclick=()=>{q.value="";lista()};
  capa.querySelector("#cn_inc").onclick=incorpora;
  capa.querySelector("#cn_l").addEventListener("click",e=>{if(e.target.closest("[data-todos]")){solo=null;lista()}});
  capa.querySelector("#cn_z").addEventListener("click",e=>{const b=e.target.closest(".cnch");if(!b)return;zSel=b.dataset.z||"";lista()});
  capa.querySelector("#cn_l").addEventListener("toggle",e=>{const d=e.target;if(!d.classList||!d.classList.contains("cni"))return;d.open?abiertos.add(d.dataset.k):abiertos.delete(d.dataset.k);
  /* v560: al abrir una ficha cuyas fotos aún no han llegado, se piden ya */
  if(d.open){const c=L().find(x=>String(x.baseId||x.db||x.id)==d.dataset.k);if(c&&c._fp&&typeof compFotosAsegura=="function")compFotosAsegura(c).then(()=>{if(d.isConnected)lista()})}},true)}
 /* v562: al abrir Componentes de campo, SIEMPRE todas las fichas plegadas (no recuerda las abiertas la vez anterior) */
 abiertos.clear();solo=null;lista();{const l=capa.querySelector("#cn_l");if(l)l.scrollTop=0}capa.style.display="flex";document.documentElement.style.overflow="hidden";
 try{history.pushState({comp:1},"")}catch(e){}}
function cierra(desdeHist){if(!capa||capa.style.display=="none")return;capa.style.display="none";document.documentElement.style.overflow="";
 if(!desdeHist){try{if(history.state&&history.state.comp)history.back()}catch(e){}}}
/* v533: botón «Incorporar componente» en la consulta de repuestos del menú de abajo. Abre el mismo formulario de
   incorporar (fotos + IA) por encima de la capa; al guardar, o al cerrarlo con ✕, se vuelve a esta lista (ya buscada por
   el código guardado). */
let incOn=false,envuelto=false;
function finInc(){incOn=false;document.documentElement.classList.remove("cnInc")}
function envuelve(){if(envuelto)return;envuelto=true;
 const oc=window.compCatalogo;window.compCatalogo=function(q){if(!incOn)return oc.apply(this,arguments);
  finInc();try{closeSheet()}catch(e){const sh=document.getElementById("sheet");if(sh)sh.style.display="none"}
  if(capa){const i=capa.querySelector("#cn_q");if(i&&q){i.value=q;zSel=""}lista()}};
 if(typeof window.closeSheet=="function"){const os=window.closeSheet;window.closeSheet=function(){if(incOn)finInc();return os.apply(this,arguments)}}}
function incorpora(){if(typeof window.compIncorpora!="function"){if(typeof msg=="function")msg("Incorporar componente no disponible");return}
 envuelve();incOn=true;document.documentElement.classList.add("cnInc");
 window.compIncorpora();const sh=document.getElementById("sheet");if(sh)sh.style.display="flex"}
/* ===== v559: deslizar una ficha a la izquierda → botón rojo «Eliminar» (con confirmación) para quitar repetidos o volver a
   incorporarla. Las fichas de fábrica modificadas se «Restauran»; las de fábrica sin cambios no se pueden borrar. ===== */
(function(){const st=document.createElement("style");st.textContent=`#compCapa .cnsw{position:relative;overflow:hidden;border-radius:8px;margin:6px 0}
#compCapa .cnsw>details{position:relative;z-index:1;margin:0!important;transition:transform .18s ease;will-change:transform}
#compCapa .cnsw.mov>details{transition:none}
#compCapa .cnsx{position:absolute;right:0;top:0;bottom:0;width:104px;z-index:0;border:0;border-radius:0 8px 8px 0;background:#d32f2f;color:#fff;font:800 14px/1.25 system-ui,sans-serif;display:flex;align-items:center;justify-content:center;text-align:center}
#compCapa .cnsw.fab .cnsx{background:#78909c}`;document.head.appendChild(st)})();
let SW=null,abiertoSw=null;
const swEl=t=>t&&t.closest&&t.closest("#compCapa .cnsw");
const swPon=(w,x)=>{const d=w.querySelector(":scope>details");if(d)d.style.transform=x?`translateX(${x}px)`:""};
const cierraSw=()=>{if(abiertoSw){swPon(abiertoSw,0);abiertoSw=null}};
document.addEventListener("touchstart",e=>{const w=swEl(e.target);if(e.target.closest&&e.target.closest(".cnsx"))return;if(!w){cierraSw();return}
 if(abiertoSw&&abiertoSw!==w)cierraSw();const t=e.touches[0];SW={w,x:t.clientX,y:t.clientY,dx:0,h:null,base:abiertoSw===w?-104:0}},{passive:true});
document.addEventListener("touchmove",e=>{if(!SW)return;const t=e.touches[0],dx=t.clientX-SW.x,dy=t.clientY-SW.y;
 if(SW.h===null&&Math.abs(dx)+Math.abs(dy)>8)SW.h=Math.abs(dx)>Math.abs(dy)*1.2;if(!SW.h)return;
 e.preventDefault();SW.w.classList.add("mov");SW.dx=dx;swPon(SW.w,Math.max(-120,Math.min(0,SW.base+dx)))},{passive:false});
document.addEventListener("touchend",()=>{if(!SW)return;const s=SW;SW=null;s.w.classList.remove("mov");if(!s.h)return;
 const x=s.base+s.dx;if(x<-50){swPon(s.w,-104);abiertoSw=s.w}else{swPon(s.w,0);if(abiertoSw===s.w)abiertoSw=null}},{passive:true});
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("#compCapa .cnsx");if(!b)return;e.preventDefault();e.stopPropagation();
 const k=b.dataset.del;const c=L().find(x=>String(x.baseId||x.db||x.id)==k);if(!c){cierraSw();return}
 if(!c.db){alert("🔒 "+c.id+" es una ficha de fábrica de la app: no se puede eliminar.\\nPara cambiarla, ábrela y usa ✏️ Editar.");cierraSw();return}
 const esAd=(()=>{try{return (typeof admin!="undefined"&&!!admin)||(typeof rol!="undefined"&&/admin/i.test(rol))}catch(_){return false}})();
 if(!esAd){alert("Solo el administrador puede eliminar fichas del catálogo.");cierraSw();return}
 const rep=L().filter(x=>x!==c&&String(x.id).toUpperCase()==String(c.id).toUpperCase()).length;
 const txt=c.baseId?`¿Restaurar la ficha original de fábrica de ${c.id}?\\n\\nSe pierden los cambios guardados.`:`¿ELIMINAR ${c.id} · ${c.t}?\\n\\n${rep?`⚠️ Hay ${rep} ficha(s) más con el código ${c.id}: esta parece repetida.\\n\\n`:""}Se borra del catálogo para todos los técnicos. Después puedes volver a incorporarla.`;
 if(!confirm(txt)){cierraSw();return}
 try{const {error}=await sb.from("componentes_campo").delete().eq("id",c.db);if(error)throw error;abiertoSw=null;
  if(typeof compRecarga=="function")await compRecarga();lista();if(typeof msg=="function")msg(c.baseId?"Ficha original restaurada":c.id+" eliminado")}
 catch(err){alert("No se pudo eliminar: "+String((err&&err.message)||err))}},true);
window.abreComp=abre;window.compNavLista=()=>{if(capa&&capa.style.display!="none")lista()};
/* v511: abrir el catálogo ya buscado por un código (toque en la caja de un elemento del croquis por bloques).
   Al cerrar (←, flecha atrás o atrás del móvil) se vuelve a la pantalla desde la que se abrió: la capa solo se oculta. */
window.abreCompTag=function(tag){const t=String(tag||"").replace(/^\+/,"").replace(/\/.*$/,"").trim();abre();if(!capa||!t)return;
 const q=capa.querySelector("#cn_q");zSel="";const n=nrm(t);
 let hit=L().filter(c=>nrm(c.id)==n);if(!hit.length)hit=L().filter(c=>texto(c).includes(n));
 if(!hit.length&&typeof compCampo=="function"){try{hit=compCampo(t)}catch(e){}}
 q.value=hit.length&&!L().some(c=>texto(c).includes(n))?hit[0].id:t;
 hit.slice(0,3).forEach(c=>abiertos.add(String(c.baseId||c.db||c.id)));lista();
 const el=capa.querySelector("#cn_l");if(el)el.scrollTop=0;
 if(!hit.length){const v=capa.querySelector(".cnvac");if(v)v.innerHTML=`Sin ficha de repuesto para <b>${E(t)}</b>${typeof nombreElemento=="function"&&nombreElemento(t)?" ("+E(nombreElemento(t))+")":""} en el catálogo.<br>Puedes añadirla con «Incorporar componente» o buscar otro código.`}};window.cierraComp=()=>cierra(false);
/* v563: abrir la lista acotada a unos componentes (los de una alarma del SOS), desplegados si son pocos */
window.abreCompClaves=function(claves,rotulo){abre();if(!capa)return;const K=new Set((claves||[]).map(String));
 const q=capa.querySelector("#cn_q");if(q)q.value="";zSel="";solo={k:K,t:rotulo||""};if(K.size<=3)K.forEach(k=>abiertos.add(k));lista()};
/* v549: al volver atrás desde Editar ficha (p. ej. tras Guardar) el historial queda en el estado de esta capa: no se cierra */
addEventListener("popstate",()=>{try{if(history.state&&history.state.comp)return}catch(e){}cierra(true)});
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
#compCapa .cninc{width:100%!important;margin:10px 0 0!important}
html.cnInc #sheet{z-index:70!important}
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
#compCapa .cnsolo{display:flex;align-items:center;gap:8px;margin:8px 0 2px;padding:7px 9px;border:1.5px solid #d32f2f;border-radius:8px;font-size:13px;font-weight:700}#compCapa .cnsolo span{flex:1;min-width:0}#compCapa .cnsolo button{width:auto!important;margin:0!important;padding:5px 10px!important;font-size:12.5px!important;flex:none}
#compCapa .cnvac{text-align:center;color:var(--mu,#8a93a3);margin-top:30px;line-height:1.5}`;
document.head.appendChild(st);
})();
