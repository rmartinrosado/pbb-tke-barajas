/* v314: presentación de textos en toda la PWA, la guía de campo y el Análisis.
 1. Las referencias técnicas no se parten entre dos líneas: bornas y elementos (+E-X68.1:3, +P-K61/2, EP-W4, H07RN-F),
    hilos («hilo 205»), conductores («cond. 3»), folios, módulos y LED, bornas de módulo (7.1), tensiones e intensidades
    (24 V⎓, 400 V~, 10 A, 2 mm) y secciones (27x1,5). Se envuelven en <span class="nw"> (white-space:nowrap).
 2. Los párrafos de texto (más de una línea) se justifican al ancho de la pantalla, con las líneas a la misma alineación.
 Se aplica sobre lo que se pinta en cada momento (MutationObserver), sin tocar botones, campos de texto, gráficos ni
 títulos centrados. No cambia el texto: solo cómo se corta y se alinea. */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`
.nw{white-space:nowrap}
.tj{text-align:justify;text-justify:inter-word;hyphens:manual;overflow-wrap:break-word}
li.tj,.tj li{text-align:justify}`;
document.head.appendChild(st);
const RE=new RegExp([
 "[+\\-]?[A-Z][A-Z0-9]*(?:\\.\\d+)?-[A-Z0-9]+(?:[.\\/'’\"][A-Z0-9'’\"]*)*(?:\\([A-Z0-9]+\\))?(?::[A-Za-z0-9.()]+(?:-[A-Za-z0-9.()]+)?)?",
 "(?:hilos?|cond\\.|conductor|folios?|bornas?|LED|módulo|pin|canal|salida|entrada)\\s+\\d[\\w.,:/-]*",
 "(?:DIN|DON|DIS|DOS|AIN|IN|OUT|UT)\\d{1,2}S?",
 "[≈~]?\\s?\\d+(?:[.,]\\d+)?\\s?(?:V⎓|V~|Vdc|Vac|VDC|VAC|V|mA|A|mm²|mm|kW|kA|kVA|VA|Ω|°|rpm|Hz|min|s)(?![A-Za-zÀ-ÿ0-9])",
 "\\d+x\\d+(?:[.,]\\d+)?",
 "\\d+\\.\\d+(?:\\s?[–-]\\s?\\d+\\.\\d+)?"
].join("|"),"g");
const SKIP=/^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|SVG|CANVAS|CODE|PRE|BUTTON)$/;
function okPadre(n){for(let e=n.parentElement;e;e=e.parentElement){if(SKIP.test(e.tagName.toUpperCase())||e.isContentEditable||e.classList.contains("nw"))return false;if(e===document.body)break}return true}
const HECHO=new WeakSet();
function envuelve(tn){if(HECHO.has(tn))return;HECHO.add(tn);const s=tn.data;if(s.length<3)return;RE.lastIndex=0;if(!RE.test(s))return;if(!okPadre(tn))return;
 RE.lastIndex=0;const fr=document.createDocumentFragment();let i=0,m,n=0;
 while((m=RE.exec(s))){const w=m[0];if(w.length<3||w.length>30||!/\s|[-:.]/.test(w)){continue}
  if(m.index>i)fr.appendChild(document.createTextNode(s.slice(i,m.index)));const sp=document.createElement("span");sp.className="nw";sp.textContent=w;fr.appendChild(sp);i=m.index+w.length;n++}
 if(!n)return;if(i<s.length){const r=document.createTextNode(s.slice(i));HECHO.add(r);fr.appendChild(r)}fr.childNodes.forEach(c=>{if(c.nodeType===3)HECHO.add(c)});tn.parentNode.replaceChild(fr,tn)}
const BLK=/^(DIV|P|LI|TD|DD|LABEL|SPAN)$/;
function justifica(el){if(el.classList.contains("tj")||el.classList.contains("nj")||!BLK.test(el.tagName))return;
 let txt="";for(const c of el.childNodes)if(c.nodeType===3)txt+=c.data;else if(c.nodeType===1&&/^(B|I|EM|STRONG|SPAN|SMALL|A|MARK|SUB|SUP|BR)$/.test(c.tagName))txt+=c.textContent;
 if(txt.trim().length<70)return;
 if(el.closest("button,nav,header,#nav,#navtab,svg"))return;
 const cs=getComputedStyle(el);if(cs.textAlign==="center"||cs.textAlign==="right"||cs.textAlign==="end"||cs.display==="flex"||cs.display==="grid"||cs.display.indexOf("inline")===0){el.classList.add("nj");return}
 el.classList.add("tj")}
/* recorre solo lo visible: no entra en <details> cerrados (salvo su título), ni en [hidden] ni display:none en línea */
function oculto(e){return (e.tagName==="DETAILS"&&!e.open)||e.hidden||(e.style&&e.style.display==="none")||SKIP.test(e.tagName.toUpperCase())}
function procesa(root){if(!root||!root.isConnected)return;
 if(root.nodeType===3){envuelve(root);return}if(root.nodeType!==1)return;
 for(let e=root;e&&e!==document.body;e=e.parentElement)if(e!==root&&oculto(e)&&!(e.tagName==="DETAILS"&&root.closest("summary")))return;
 const txt=[],els=[];
 const w=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode(n){
   if(n.nodeType===3)return HECHO.has(n)?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT;
   if(n.classList.contains("nw"))return NodeFilter.FILTER_REJECT;
   if(n.tagName==="DETAILS"&&!n.open){const s=n.querySelector(":scope>summary");if(s)els.push(s),collect(s,txt);return NodeFilter.FILTER_REJECT}
   if(n!==root&&oculto(n))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});
 if(root.nodeType===1&&!oculto(root))els.push(root);
 let n;while((n=w.nextNode())){if(n.nodeType===3)txt.push(n);else els.push(n)}
 txt.forEach(envuelve);els.forEach(justifica)}
function collect(s,txt){const w=document.createTreeWalker(s,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(!HECHO.has(n))txt.push(n)}
let cola=new Set(),prog=false;
function vacia(){prog=false;const l=[...cola];cola.clear();obs.disconnect();try{l.forEach(n=>{if(n.isConnected)procesa(n)})}finally{mira()}}
function mira(){obs.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["open","hidden","style"]})}
const obs=new MutationObserver(ms=>{for(const m of ms){if(m.type==="characterData")cola.add(m.target);else if(m.type==="attributes"){const e=m.target;if(!oculto(e))cola.add(e)}else m.addedNodes.forEach(n=>cola.add(n))}
 if(!prog){prog=true;requestAnimationFrame(vacia)}});
function arranca(){procesa(document.body);mira();
 document.addEventListener("toggle",e=>{if(e.target.open)procesa(e.target)},true)}
if(document.body)arranca();else document.addEventListener("DOMContentLoaded",arranca);
})();
