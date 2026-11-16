/* ===== v480: AVISOS SIN RECONOCER · la app aprende cómo escribe CGA los avisos (15/11/2026)
   · Un aviso «no reconocido» es una OT cuya descripción no lleva a ninguna caja de la guía de campo ni a una primera actuación
     (puente, límite, elemento de seguridad, hidráulica o reset).
   · En Inicio (solo Administrador) sale «🧠 Avisos sin reconocer (n)». En la lista eliges a qué caja de la guía corresponde
     el aviso (o escribes el elemento) y se guarda en Supabase (tabla alias_avisos) para TODOS los móviles:
     a partir de ahí ese texto se traduce solo (alias-campo.js) en la OT, el SOS, la lupa y la Resolución IA.
   · El texto a reconocer se puede acortar a la frase clave (p. ej. «bumpers de translación»). ===== */
(function(){
"use strict";
const LS="pbb_alias_ap";
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const N=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim();
/* patrón tolerante a tildes, mayúsculas y espacios */
const aRe=p=>{const m={a:"[aáàä]",e:"[eéèë]",i:"[iíìï]",o:"[oóòö]",u:"[uúùü]",n:"[nñ]"};
 const src=N(p).split("").map(c=>m[c]||(c==" "?"\\s+":c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"))).join("");return new RegExp(src,"gi")};
const ponLista=L=>{window.__alAp=(L||[]).filter(a=>a&&a.patron&&a.sustituto).sort((a,b)=>b.patron.length-a.patron.length)
  .map(a=>({id:a.id,patron:a.patron,sus:a.sustituto,tipo:a.tipo||"",re:aRe(a.patron)}));
 try{ANA_C={k:"",r:null}}catch(e){}};
try{ponLista(JSON.parse(localStorage.getItem(LS)||"[]"))}catch(e){}
let cargado=false;
async function carga(forzar){try{if(typeof sb=="undefined"||!user)return;if(cargado&&!forzar)return;
 const {data,error}=await sb.from("alias_avisos").select("*").order("creado",{ascending:false});if(error)return;
 cargado=true;try{localStorage.setItem(LS,JSON.stringify(data||[]))}catch(e){}ponLista(data);try{render()}catch(e){}}catch(e){}}
window.alCarga=carga;
setInterval(()=>{if(!cargado)carga()},4000);addEventListener("load",()=>setTimeout(carga,1200));

/* ¿la app entiende este aviso? */
const reconoce=i=>{try{
 const S=typeof segOT=="function"?segOT(i):null;if(S&&((S.sen&&S.sen.length)||S.lim||S.cont))return true;
 if(typeof puentesOT=="function"&&(puentesOT(i)||[]).length)return true;
 if(typeof hidrOT=="function"&&hidrOT(i))return true;
 if(typeof resetAplica=="function"&&resetAplica(i))return true;
 const R=typeof anaOT=="function"?anaOT(i):null;return !!(R&&R.guia&&R.guia.length&&R.guia[0].sc>=4)}catch(e){return true}}; /* <4 = coincidencia floja (p. ej. «ruido» → megafonía) */
const conGuia=i=>{try{const G=GUIA.tipos[i.tipo||"PAS"];return !!(G&&G.s&&G.s.length>3)}catch(e){return false}}; /* solo tipos con guía de campo propia */
window.avisoReconocido=reconoce;
const ign=()=>{try{return new Set(JSON.parse(localStorage.getItem("pbb_alias_ign")||"[]"))}catch(e){return new Set()}};
function pendientes(){const lim=Date.now()-120*864e5,I=ign(),G=new Map();
 (typeof inc!="undefined"?inc:[]).forEach(i=>{if(!i||!i.desc)return;const man=!!i.noRec;const f=Date.parse(i.fecha||"");if(f&&f<lim&&!man)return;
  /* v506: «Avería no reconocida» marcada en Editar registro → entra siempre en la lista, aunque la app crea reconocerla */
  if(!conGuia(i)&&!man)return;const k=N(i.desc);if(!k||(I.has(k)&&!man))return;if(!G.has(k)){const o=Object.assign({},i,{estado:"abierta"});if(!man&&reconoce(o))return;G.set(k,{desc:i.desc,tipo:i.tipo||"PAS",n:0,pos:new Set(),ots:[],man:false})}
  const g=G.get(k);g.n++;g.pos.add(i.pos);g.ots.push(i.orden);if(man)g.man=true});
 return [...G.values()].sort((a,b)=>b.n-a.n)}
window.avisosPendientes=pendientes;
const quitaNoRec=desc=>{try{const k=N(desc);let c=0;inc.forEach(i=>{if(i.noRec&&N(i.desc)==k){delete i.noRec;c++}});if(c)sv("pbb_inc",inc)}catch(e){}};

const st=document.createElement("style");st.textContent=`
#avv{position:fixed;inset:0;z-index:99995;background:var(--bg);color:var(--tx);overflow:auto;-webkit-overflow-scrolling:touch;padding:0 12px 40px}
.avtool{position:sticky;top:0;z-index:1;display:flex;align-items:center;gap:8px;padding:max(10px,env(safe-area-inset-top)) 0 10px;background:var(--bg);border-bottom:1px solid var(--bd)}
.avtool h3{flex:1;margin:0;font-size:16px}.avtool button{width:auto!important;margin:0!important;padding:8px 12px!important}
.avit{border:1px solid var(--bd);border-radius:10px;padding:10px;margin:10px 0;background:var(--card)}
.avit b.avd{display:block;font-size:15px}.avit .mu{font-size:12px}
.avit label{display:block;font-size:12px;margin:8px 0 3px;color:var(--mu)}
.avit input,.avit select{width:100%;box-sizing:border-box;font-size:15px;padding:8px;border-radius:8px;border:1px solid var(--bd);background:var(--bg);color:var(--tx)}
.avbt{display:flex;gap:8px;margin-top:8px}.avbt button{flex:1;margin:0!important;padding:9px!important}
.avap{font-size:13px;padding:7px 0;border-bottom:1px dashed var(--bd);display:flex;gap:8px;align-items:center}.avap span{flex:1;min-width:0}
.avap button{width:auto!important;margin:0!important;padding:4px 9px!important}
.adtools{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 12px}.adtools button{margin:0!important;padding:10px 6px!important;font-weight:700;font-size:13px}
.adtools .avn{display:inline-block;min-width:18px;padding:0 5px;border-radius:9px;background:#c62828;color:#fff;font-size:11px;margin-left:4px}`;
document.head.appendChild(st);

function cajas(tipo){try{const G=GUIA.tipos[tipo]||GUIA.tipos.PAS;return (G.s||[]).map(s=>s.t)}catch(e){return []}}
window.avPanel=function(){let d=document.getElementById("avv");if(!d){d=document.createElement("div");d.id="avv";document.body.appendChild(d)}
 const P=pendientes(),A=window.__alAp||[];
 d.innerHTML=`<div class="avtool"><h3>🧠 Avisos sin reconocer (${P.length})</h3><button class="sec" onclick="document.getElementById('avv').remove()">✕ Cerrar</button></div>
 <div class="mu" style="margin:8px 0">Avisos de los últimos 120 días que no llevan a ninguna caja de la guía. Indica a qué corresponden y la app lo aprende para todos los móviles.</div>
 ${P.length?P.map((g,k)=>`<div class="avit" data-k="${k}"><b class="avd">«${E(g.desc)}»</b>${g.man?` <span class="avman">🧠 marcada en Editar registro</span>`:""}<div class="mu">${g.n} OT · PBB ${E([...g.pos].join(", "))} · ${E(g.tipo)}${g.ots.filter(Boolean).length?" · OT "+E(g.ots.filter(Boolean).slice(0,3).join(", ")):""}</div>
  <label>Texto a reconocer (acórtalo a la frase clave)</label><input class="avp" value="${E(g.desc)}">
  <label>Corresponde a (caja de la guía)</label><select class="avs"><option value="">— Elige —</option>${cajas(g.tipo).map(t=>`<option>${E(t)}</option>`).join("")}<option value="*">✏️ Otro (escribir)…</option></select>
  <input class="avo" placeholder="Elemento o avería, p. ej. «Bordes de seguridad de ruedas T-B5 / T-B6»" style="display:none;margin-top:6px">
  <div class="avbt"><button class="pri" onclick="avGuarda(${k})">💾 Aprender</button><button class="sec" onclick="avIgnora(${k})">Ignorar</button></div></div>`).join("")
 :`<div class="avit">✅ Todos los avisos se reconocen.</div>`}
 <h3 style="font-size:15px;margin:18px 0 4px">Aprendidos (${A.length})</h3>
 ${A.length?A.map(a=>`<div class="avap"><span>«${E(a.patron)}» → <b>${E(a.sus)}</b></span><button class="sec" onclick="avBorra('${E(a.id)}')">🗑</button></div>`).join(""):`<div class="mu">Todavía ninguno.</div>`}`;
 d.querySelectorAll(".avs").forEach(s=>s.onchange=()=>{const o=s.parentNode.querySelector(".avo");o.style.display=s.value=="*"?"block":"none";if(s.value=="*")o.focus()});
 d._P=P};
window.avGuarda=async function(k){const d=document.getElementById("avv");if(!d)return;const g=d._P[k],b=d.querySelector(`.avit[data-k="${k}"]`);
 const pat=b.querySelector(".avp").value.trim(),sv=b.querySelector(".avs").value,sus=(sv=="*"?b.querySelector(".avo").value:sv).trim();
 if(N(pat).length<4){msg("Escribe el texto a reconocer");return}if(!sus){msg("Elige a qué corresponde");return}
 const {error}=await sb.from("alias_avisos").insert({patron:pat,sustituto:sus,tipo:g.tipo});
 if(error){msg("No se ha podido guardar: "+(error.message||error));return}
 msg("Aprendido: «"+pat+"»");quitaNoRec(g.desc);await carga(true);avPanel()};
window.avIgnora=function(k){const d=document.getElementById("avv");if(!d)return;const I=ign();I.add(N(d._P[k].desc));quitaNoRec(d._P[k].desc);try{localStorage.setItem("pbb_alias_ign",JSON.stringify([...I]))}catch(e){}avPanel()};
window.avBorra=async function(id){if(!confirm("¿Olvidar este alias?"))return;const {error}=await sb.from("alias_avisos").delete().eq("id",id);
 if(error){msg("No se ha podido borrar: "+(error.message||error));return}await carga(true);avPanel()};

let ck={k:"",t:0,n:0};
/* botones de administrador en Inicio (debajo de «PANEL DE CONTROL») */
const pon=()=>{try{if(view!="dash"||!admin)return;const a=document.getElementById("app");if(!a)return;let t=document.getElementById("adtools");
 const k=(typeof inc!="undefined"?inc.length+"/"+inc.filter(x=>x&&x.noRec).length:0)+"|"+(window.__alAp||[]).length+"|"+ign().size;if(k!==ck.k||Date.now()-ck.t>60000){ck={k,t:Date.now(),n:pendientes().length}}const n=ck.n;const h=`<button class="sec" onclick="avPanel()">🧠 Avisos sin reconocer${n?`<span class="avn">${n}</span>`:""}</button><button class="sec" onclick="tmPanel()">⏱ Tiempos por avería</button>`;
 if(!t){t=document.createElement("div");t.id="adtools";t.className="adtools";const p=document.getElementById("pctl");p?p.after(t):a.prepend(t)}
 if(t.innerHTML!==h)t.innerHTML=h}catch(e){}};
let tm=null;new MutationObserver(()=>{if(!tm)tm=setTimeout(()=>{tm=null;pon()},300)}).observe(document.documentElement,{childList:true,subtree:true});
/* v499: también en el mismo instante del repintado de Inicio (antes aparecía 0,3 s después y las fichas de OT bajaban de golpe) */
try{const ro=render;render=function(){const r=ro.apply(this,arguments);pon();return r}}catch(e){}
})();

/* ===== v505: «Corresponde a (caja de la guía)» agrupado por familias del sistema (como la guía de campo): al pulsar se elige
   primero la familia (Hidráulica y elevación, Traslación, Seguridades…) y luego la caja; el desplegable también va con grupos. ===== */
(function(){
const fam=(t,L)=>{try{return (window.guiaFamilia&&window.guiaFamilia(t,L))||"Otras cajas"}catch(e){return"Otras cajas"}};
const Es=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nr=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
function grupos(sel){const L=[...sel.options].map(o=>o.value).filter(v=>v&&v!="*");const M=new Map();
 L.forEach(t=>{const f=fam(t,L);if(!M.has(f))M.set(f,[]);M.get(f).push(t)});
 const k=[...M.keys()].sort((a,b)=>(a=="Otras cajas")-(b=="Otras cajas"));return k.map(f=>[f,M.get(f)])}
function agrupaSel(sel){if(sel.dataset.fam)return;sel.dataset.fam="1";const G=grupos(sel);
 sel.innerHTML=`<option value="">— Elige —</option>${G.map(([f,l])=>`<optgroup label="${Es(f)}">${l.map(t=>`<option>${Es(t)}</option>`).join("")}</optgroup>`).join("")}<option value="*">✏️ Otro (escribir)…</option>`;
 /* el desplegable queda oculto (guarda el valor) y en su sitio un botón que abre el selector por familias */
 const b=document.createElement("button");b.type="button";b.className="sec avsb";sel.style.display="none";sel.after(b);
 const pinta=()=>{const v=sel.value;b.innerHTML=v?(v=="*"?"✏️ Otro (escribir)…":`<small>${Es(fam(v,G.flatMap(g=>g[1])))}</small><br>${Es(v)}`):`<span class="mu">— Elige —</span>`};
 sel.addEventListener("change",pinta);pinta();b.onclick=()=>picker(sel,G)}
function picker(sel,G){let pk=document.getElementById("rcspk");if(pk)pk.remove();pk=document.createElement("div");pk.id="rcspk";pk.style.zIndex="100010";document.body.appendChild(pk);
 const cierra=()=>pk.remove();const pon=v=>{sel.value=v;sel.dispatchEvent(new Event("change"));cierra()};
 const fams=()=>{pk.innerHTML=`<div class="rcspkc"><div class="rcspkh"><b>Caja de la guía · familia</b><button type="button" class="sec rcspkx" aria-label="Cerrar">✕</button></div><div class="rcspl">
  ${G.map(([f,l],k)=>`<button type="button" class="rcspf" data-k="${k}"><span><b>${Es(f)}</b><small>${l.length} caja${l.length==1?"":"s"}</small></span><span class="rcspfa">›</span></button>`).join("")}
  <button type="button" class="rcspf" data-o="1"><span><b>✏️ Otro (escribir)…</b><small>elemento o avería que no está en la guía</small></span><span class="rcspfa">›</span></button></div></div>`;
  pk.querySelector(".rcspkx").onclick=cierra;
  pk.querySelectorAll(".rcspf").forEach(b=>b.onclick=()=>b.dataset.o?pon("*"):lista(+b.dataset.k))};
 const lista=k=>{const [f,l]=G[k];pk.innerHTML=`<div class="rcspkc"><div class="rcspkh"><button type="button" class="sec rcspkb">‹ Familias</button><b>${Es(f)}</b><button type="button" class="sec rcspkx" aria-label="Cerrar">✕</button></div>
  <input id="rcspq" type="search" autocomplete="off" placeholder="Filtrar"><div class="rcspl">${l.map(t=>`<button type="button" class="rcspi" data-v="${Es(t)}">${Es(t)}</button>`).join("")}</div></div>`;
  pk.querySelector(".rcspkb").onclick=fams;pk.querySelector(".rcspkx").onclick=cierra;
  const q=pk.querySelector("#rcspq");q.oninput=()=>{const v=nr(q.value).trim();pk.querySelectorAll(".rcspi").forEach(b=>b.style.display=!v||nr(b.dataset.v).includes(v)?"":"none")};
  pk.querySelector(".rcspl").onclick=e=>{const b=e.target.closest(".rcspi");if(b)pon(b.dataset.v)}};
 pk.onclick=e=>{if(e.target===pk)cierra()};fams()}
const st=document.createElement("style");st.textContent=`.avsb{display:block;width:100%!important;margin:0!important;text-align:left;padding:10px 12px!important;font-size:15px!important;line-height:1.25}#rcspk .rcspf>span:first-child:not(.rcspfi){flex:1;display:flex;flex-direction:column;gap:2px}.avsb small{color:var(--mu);font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}`;document.head.appendChild(st);
const o=window.avPanel;if(typeof o=="function")window.avPanel=function(){const r=o.apply(this,arguments);try{document.querySelectorAll("#avv select.avs").forEach(agrupaSel)}catch(e){}return r};
})();

/* ===== v506: Editar registro · botón «🧠 Avería no reconocida» (se activa y desactiva). Activado, la OT se guarda marcada
   (i.noRec) y su descripción sale en «Avisos sin reconocer» para enseñar a la app a qué caja corresponde. Se desmarca sola
   al aprenderla o ignorarla en ese panel. ===== */
(function(){
const pinta=b=>{const on=b.dataset.on=="1";b.classList.toggle("on",on);b.innerHTML=on?"🧠 Avería no reconocida · <b>ACTIVADO</b>":"🧠 Marcar como avería no reconocida"};
function pon(){const sc=document.getElementById("sheetc");if(!sc)return;const d=sc.querySelector("#e_d");if(!d||sc.querySelector(".enrb"))return;
 const bt=sc.querySelector('button[onclick^="guardaEdit("]');const id=bt&&((bt.getAttribute("onclick")||"").match(/\(\s*'([^']+)'/)||[])[1];
 const i=id&&typeof inc!="undefined"&&inc.find(x=>x.id==id);if(!i)return;
 const b=document.createElement("button");b.type="button";b.className="sec enrb";b.dataset.on=i.noRec?"1":"";pinta(b);
 b.onclick=()=>{b.dataset.on=b.dataset.on=="1"?"":"1";pinta(b)};d.after(b)}
let tm=0;new MutationObserver(()=>{if(tm)return;tm=setTimeout(()=>{tm=0;try{pon()}catch(e){}},60)}).observe(document.body,{childList:true,subtree:true});
if(typeof guardaEdit=="function"){const o=guardaEdit;guardaEdit=function(id){try{const b=document.querySelector("#sheetc .enrb");const i=inc.find(x=>x.id==id);
 if(b&&i){if(b.dataset.on=="1")i.noRec=true;else delete i.noRec}}catch(e){}return o.apply(this,arguments)}}
const st=document.createElement("style");st.textContent=`.enrb{width:100%!important;margin:6px 0 0!important;padding:9px!important;font-size:14px!important;border-style:dashed!important}
#sheetc button.sec.enrb.on,.enrb.on{border:2px solid #7b1fa2!important;border-style:solid!important;color:#8e24aa!important;font-weight:700;background:color-mix(in srgb,#7b1fa2 14%,transparent)!important}
.avman{display:inline-block;font-size:11px;font-weight:800;color:#ce93d8;border:1px solid #7b1fa2;border-radius:10px;padding:0 6px;vertical-align:middle}`;document.head.appendChild(st);
})();

/* v507: la OT marcada como «Avería no reconocida» se ve en su tarjeta (Inicio y Seguimiento) y el contador del botón
   «🧠 Avisos sin reconocer» del Panel de control cambia al guardar (antes solo se recalculaba si cambiaba el nº de OT) */
(function(){if(typeof card!="function")return;const o=card;card=function(i){const h=o.apply(this,arguments);if(!i||!i.noRec)return h;
 const tg=`<span class="nrtag">🧠 NO RECONOCIDA</span>`;
 /* v508: en Seguimiento la etiqueta va al inicio de la descripción, no junto a «PBB nnn», para no ensanchar la primera
    columna y descentrar la caja de horas */
 const d=h.indexOf('<div class="ohdesc"');if(d>=0){const e=h.indexOf(">",d);if(e>0)return h.slice(0,e+1)+tg.replace('nrtag"','nrtag nrd"')+h.slice(e+1)}
 const k=h.indexOf("</b>");return k<0?h:h.slice(0,k)+tg+h.slice(k)};
 const st=document.createElement("style");st.textContent=`.nrtag{display:inline-block;margin-left:6px;padding:2px 7px;border-radius:5px;background:#7b1fa2;color:#fff;font:800 11px/1.4 var(--tkmo,monospace);letter-spacing:.5px;vertical-align:middle;animation:nrp 2s ease-in-out infinite}@keyframes nrp{50%{opacity:.55}}.nrtag.nrd{margin:0 6px 0 0}`;document.head.appendChild(st)})();
