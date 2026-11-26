/* ===== v922-v923: ICONOS DE LÍNEA en toda la PWA (25/11/2026) =====
   Los emojis que pinta la app (📷 foto, ✏️ lápiz, 🗑️ papelera, 📄 ficha, 🔎 lupa, 🔔, ⚠️, ✅…) se veían como dibujos a color.
   Ahora se muestran como iconos de TRAZO del color del texto: negro sobre fondo claro y blanco sobre fondo oscuro.
   · El emoji sigue en el texto (solo se oculta y se dibuja encima su icono con una máscara), así que no cambia nada de la lógica
     que lee textContent, ni los avisos, ni lo que se guarda.
   · Se aplica a todo lo que aparece en pantalla (también lo que se pinta después) con un MutationObserver (v926: en el mismo instante, antes de pintar la pantalla, sin pasar por el emoji a color; y con antibucle).
   · No toca campos de texto, desplegables nativos (<option>) ni placeholders: ahí el navegador no deja poner iconos. ===== */
(function(){
"use strict";
const P=(d,w)=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='${w||2}' stroke-linecap='round' stroke-linejoin='round'>${d}</svg>`;
const D={
 camara:P("<path d='M14.5 4h-5L7.5 6.5H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2h-3.5Z'/><circle cx='12' cy='13' r='3.5'/>"),
 papelera:P("<path d='M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6'/>"),
 lapiz:P("<path d='M12 20h9'/><path d='M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z'/>"),
 ficha:P("<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z'/><path d='M14 2v6h6M8 13h8M8 17h6'/>"),
 portapapeles:P("<rect x='8' y='2' width='8' height='4' rx='1'/><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M8 12h8M8 16h6'/>"),
 lupa:P("<circle cx='11' cy='11' r='7'/><path d='m21 21-4.3-4.3'/>"),
 campana:P("<path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'/><path d='M10.3 21a1.94 1.94 0 0 0 3.4 0'/>"),
 aviso:P("<path d='M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z'/><path d='M12 9v4M12 17h.01'/>"),
 ok:P("<path d='M4 12.5l5 5L20 6.5'/>",2.6),
 okc:P("<circle cx='12' cy='12' r='10'/><path d='m8 12 3 3 5-6'/>"),
 no:P("<path d='M18 6 6 18M6 6l12 12'/>",2.6),
 reloj:P("<circle cx='12' cy='12' r='10'/><path d='M12 6v6l4 2'/>"),
 regla:P("<path d='M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z'/><path d='m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2'/>"),
 micro:P("<rect x='9' y='2' width='6' height='12' rx='3'/><path d='M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8'/>"),
 clip:P("<path d='m21.4 11-8.6 8.6a5.5 5.5 0 0 1-7.8-7.8l8.6-8.6a3.7 3.7 0 0 1 5.2 5.2l-8.6 8.6a1.8 1.8 0 0 1-2.6-2.6l7.9-7.9'/>"),
 guardar:P("<path d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z'/><path d='M17 21v-8H7v8M7 3v5h8'/>"),
 candado:P("<rect x='4' y='11' width='16' height='10' rx='2'/><path d='M8 11V7a4 4 0 0 1 8 0v4'/>"),
 volver:P("<path d='M9 14 4 9l5-5'/><path d='M4 9h10.5a5.5 5.5 0 0 1 0 11H11'/>"),
 recarga:P("<path d='M3 12a9 9 0 1 0 3-6.7'/><path d='M3 4v5h5'/>"),
 teclado:P("<rect x='2' y='5' width='20' height='14' rx='2'/><path d='M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M8 16h8'/>"),
 libro:P("<path d='M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2ZM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7Z'/>"),
 chincheta:P("<path d='M12 17v5M9 10.8V4h6v6.8l3 3.2v2H6v-2Z'/>"),
 llave:P("<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9Z'/>"),
 tuerca:P("<path d='M12 2 20.7 7v10L12 22l-8.7-5V7Z'/><circle cx='12' cy='12' r='3.5'/>"),
 engranaje:P("<circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z'/>",1.8),
 casa:P("<path d='m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'/><path d='M9 22V12h6v10'/>"),
 grafica:P("<path d='M3 3v18h18M7 16v-4M12 16V8M17 16v-7'/>"),
 calendario:P("<rect x='3' y='4' width='18' height='18' rx='2'/><path d='M16 2v4M8 2v4M3 10h18'/>"),
 telefono:P("<path d='M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z'/>"),
 bombilla:P("<path d='M9 18h6M10 22h4'/><path d='M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z'/>"),
 rayo:P("<path d='M13 2 3 14h9l-1 8 10-12h-9Z'/>"),
 enchufe:P("<path d='M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0ZM12 18v4'/>"),
 carpeta:P("<path d='M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z'/>"),
 impresora:P("<path d='M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2'/><rect x='6' y='14' width='12' height='8'/>"),
 mas:P("<path d='M12 5v14M5 12h14'/>",2.6),
 menos:P("<path d='M5 12h14'/>",2.6),
 info:P("<circle cx='12' cy='12' r='10'/><path d='M12 16v-4M12 8h.01'/>"),
 pregunta:P("<circle cx='12' cy='12' r='10'/><path d='M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01'/>"),
 altavoz:P("<path d='M11 5 6 9H2v6h4l5 4Z'/><path d='M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14'/>"),
 ojo:P("<path d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z'/><circle cx='12' cy='12' r='3'/>"),
 arena:P("<path d='M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2'/>"),
 imagen:P("<rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21'/>"),
 enlace:P("<path d='M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7'/><path d='M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7'/>"),
 sobre:P("<rect x='2' y='4' width='20' height='16' rx='2'/><path d='m22 7-10 6L2 7'/>"),
 bandera:P("<path d='M4 22V4s1-1 4-1 5 2 8 2 4-1 4-1v11s-1 1-4 1-5-2-8-2-4 1-4 1'/>"),
 diana:P("<circle cx='12' cy='12' r='10'/><circle cx='12' cy='12' r='6'/><circle cx='12' cy='12' r='2'/>"),
 usuario:P("<circle cx='12' cy='8' r='4'/><path d='M4 21a8 8 0 0 1 16 0'/>"),
 cohete:P("<path d='M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1ZM12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2Z'/><path d='M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5'/>"),
 mapa:P("<path d='M14.1 6.3 9 3.8 3 6.5v14l6-2.7 5.1 2.5 6-2.7v-14Z'/><path d='M9 3.8v14M15 6.2v14'/>"),
 cadena:P("<path d='M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8'/>"),
 flechaD:P("<path d='M5 12h14M13 6l6 6-6 6'/>",2.4),
 nube:P("<path d='M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z'/>"),
 estrella:P("<path d='M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9Z'/>")
};
const E2K={"📷":"camara","📸":"camara","🗑":"papelera","✏":"lapiz","📝":"lapiz","🖊":"lapiz","📄":"ficha","📃":"ficha","🧾":"ficha","📋":"portapapeles",
 "🔎":"lupa","🔍":"lupa","🔔":"campana","⚠":"aviso","✅":"okc","✔":"ok","☑":"okc","❌":"no","✖":"no","❎":"no","🕘":"reloj","🕒":"reloj","⏱":"reloj","⏰":"reloj",
 "📐":"regla","📏":"regla","🎤":"micro","🎙":"micro","📎":"clip","💾":"guardar","🔒":"candado","🔐":"candado","↩":"volver","🔄":"recarga","🔁":"recarga","↻":"recarga",
 "⌨":"teclado","📖":"libro","📘":"libro","📚":"libro","📌":"chincheta","📍":"chincheta","🔧":"llave","🛠":"llave","🔩":"tuerca","⚙":"engranaje","🏠":"casa",
 "📊":"grafica","📈":"grafica","📅":"calendario","📆":"calendario","📞":"telefono","☎":"telefono","💡":"bombilla","⚡":"rayo","🔌":"enchufe","📁":"carpeta","📂":"carpeta",
 "🖨":"impresora","➕":"mas","➖":"menos","ℹ":"info","❓":"pregunta","❔":"pregunta","🔊":"altavoz","🔈":"altavoz","👁":"ojo","👀":"ojo","⏳":"arena","⌛":"arena",
 "🖼":"imagen","🔗":"enlace","✉":"sobre","📧":"sobre","📨":"sobre","🚩":"bandera","🏁":"bandera","🎯":"diana","👤":"usuario","👷":"usuario","🚀":"cohete","🗺":"mapa",
 "⛓":"cadena","➡":"flechaD","☁":"nube","⭐":"estrella","🌟":"estrella","★":"estrella"};
const keys=Object.keys(E2K).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"));
const RE=new RegExp("(?:"+keys.join("|")+")\\uFE0F?","gu"),RT=new RegExp("(?:"+keys.join("|")+")","u");
/* CSS: cada icono es una máscara pintada con el color del texto (currentColor) */
const css=[`.icoL{display:inline-block;width:1.15em;height:1.15em;vertical-align:-.2em;background-color:currentColor;color:inherit;
 -webkit-mask:var(--m) center/contain no-repeat;mask:var(--m) center/contain no-repeat;overflow:hidden;white-space:nowrap;
 text-indent:110%;font-size:inherit;line-height:1;flex:none;user-select:none}`];
for(const [k,s] of Object.entries(D))css.push(`.icoL.i-${k}{--m:url("data:image/svg+xml,${encodeURIComponent(s)}")}`);
css.push(`button.icoBtn,[role=button].icoBtn,a.btn.icoBtn,#compCapa .cnimp .cnimpr{background:#fff!important;background-image:none!important;color:#111!important;
 border:1.5px solid #c9ced6!important;box-shadow:none!important;text-shadow:none!important;filter:none!important}
button.icoBtn:active,#compCapa .cnimp .cnimpr:active{background:#eef0f3!important}`);
const st=document.createElement("style");st.id="icoLst";st.textContent=css.join("\n");document.head.appendChild(st);
/* v933 · SOLUCIÓN DEFINITIVA de temblores: muchos módulos hacen «if(el.innerHTML!==html)el.innerHTML=html». Al leer innerHTML /
   outerHTML se devuelve el HTML ORIGINAL (con el emoji, sin el envoltorio del icono ni la clase icoBtn), así la comparación da igual,
   no reescriben y no hay bucle. Lo que se escribe no se toca: se sigue dibujando el icono. */
(function(){const RX=/<span class="icoL i-[a-zA-Z]+" aria-hidden="true">([^<]*)<\/span>/g;
 const limpia=s=>s.indexOf("icoL")<0&&s.indexOf("icoBtn")<0?s:s.replace(RX,"$1").replace(/ class="icoBtn"/g,"").replace(/(class="[^"]*?) icoBtn(?=[" ])/g,"$1").replace(/class="icoBtn ([^"]*)"/g,'class="$1"');
 for(const k of ["innerHTML","outerHTML"]){const d=Object.getOwnPropertyDescriptor(Element.prototype,k);if(!d||!d.get||!d.set)continue;
  Object.defineProperty(Element.prototype,k,{configurable:true,enumerable:d.enumerable,get(){return limpia(d.get.call(this))},set(v){d.set.call(this,v)}})}})();
const SKIP=new Set(["SCRIPT","STYLE","TEXTAREA","INPUT","OPTION","SELECT","NOSCRIPT","TITLE","CANVAS","svg","SVG","CODE","PRE"]);
function okNodo(t){let p=t.parentNode;if(!p||p.nodeType!==1)return false;if(p.classList&&p.classList.contains("icoL"))return false;
 for(let e=p;e&&e.nodeType===1;e=e.parentNode){if(SKIP.has(e.nodeName)||e.isContentEditable||(e.dataset&&e.dataset.noico!=null))return false}return true}
/* v926: antibucle · si un mismo elemento se vuelve a pintar una y otra vez (módulos que comparan innerHTML y lo reescriben al
   cambiar), se deja con su emoji y no se toca más: así no hay parpadeo */
const VEZ=new WeakMap();
/* v932: un contenedor que vuelve a escribir EXACTAMENTE el mismo texto (con emojis) en menos de 4 s es un módulo que compara su
   innerHTML y lo reescribe: a la primera repetición se deja con sus emojis y no se toca más (antes hacían falta 8 vueltas → temblor) */
function bucle(p){if(!p||p.nodeType!==1)return false;if(p.dataset&&p.dataset.noico!=null)return true;
 /* solo contenedores pequeños: nunca body, #app, la hoja ni secciones grandes (se repintan enteras sin ser un bucle) */
 if(p===document.body||p.id=="app"||p.id=="sheetc"||p.id=="sheet"||p.childElementCount>12)return false;const tx=p.textContent||"";if(tx.length>600||!RT.test(tx))return false;
 const n=Date.now(),v=VEZ.get(p);VEZ.set(p,{t:n,s:tx,c:v&&n-v.t<4000?v.c+1:1});
 if(v&&n-v.t<4000&&v.c>=6){try{p.dataset.noico="";p.querySelectorAll(".icoL").forEach(s=>s.replaceWith(document.createTextNode(s.textContent)))}catch(_){}return true}return false}
function trata(t){const s=t.nodeValue;if(!s||!RT.test(s)||!okNodo(t))return;RE.lastIndex=0;const f=document.createDocumentFragment();let i=0,m;
 while((m=RE.exec(s))){if(m.index>i)f.appendChild(document.createTextNode(s.slice(i,m.index)));
  const base=m[0].replace(/️/g,""),k=E2K[base];const sp=document.createElement("span");sp.className="icoL i-"+k;sp.setAttribute("aria-hidden","true");sp.textContent=m[0];f.appendChild(sp);i=m.index+m[0].length}
 if(i===0)return;if(i<s.length)f.appendChild(document.createTextNode(s.slice(i)));const par=t.parentNode;par.replaceChild(f,t);marca(par)}
/* v923: botón que solo lleva icono (foto, papelera, lápiz, ficha…) → fondo BLANCO y trazo NEGRO, sea cual sea su color */
function marca(el){const b=el.closest&&el.closest("button,[role=button],a.btn");if(!b)return;
 const resto=[...b.childNodes].filter(n=>!(n.nodeType===1&&n.classList.contains("icoL"))).map(n=>n.textContent||"").join("").replace(/\s/g,"");
 b.classList.toggle("icoBtn",!resto&&!!b.querySelector(".icoL"))}
function recorre(n){if(!n)return;if(n.nodeType===3){trata(n);return}if(n.nodeType!==1||SKIP.has(n.nodeName))return;
 if(!RT.test(n.textContent||""))return;const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT);const L=[];let x;while((x=w.nextNode()))if(RT.test(x.nodeValue))L.push(x);L.forEach(trata)}
let cola=new Set(),rev=new Set();
const vacia=()=>{const c=[...cola];cola.clear();for(const n of c){if(n.isConnected)recorre(n)}
 const r=[...rev];rev.clear();for(const e of r){if(e&&e.isConnected&&e.closest&&e.closest("button.icoBtn"))marca(e)}};
const mo=new MutationObserver(ms=>{for(const m of ms){if(m.type==="characterData"){cola.add(m.target);rev.add(m.target.parentElement)}else{if(bucle(m.target))continue;m.addedNodes.forEach(n=>cola.add(n));rev.add(m.target)}}
 if(cola.size||rev.size){mo.disconnect();try{vacia()}finally{mo.observe(document.body,{childList:true,subtree:true,characterData:true})}}});
const arranca=()=>{recorre(document.body);mo.observe(document.body,{childList:true,subtree:true,characterData:true})};
if(document.body)arranca();else document.addEventListener("DOMContentLoaded",arranca);
})();
