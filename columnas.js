/* ===== v408: bornas y listas «clave = valor» en columnas =====
   En la guía de campo, la actuación más eficaz, la actuación guiada, el análisis, la lupa, el SOS y la Resolución IA,
   los textos del tipo «BORNERO E-X62 (…): 1 = +24 V común (…) · 2 = 0 V común (…) · 3 = señal ALTURA …»
   se muestran en dos columnas: a la izquierda la borna (o la clave) y a la derecha lo que lleva, una fila por borna.
   · Encabezado (lo que va antes de los dos puntos) arriba; texto final que no es de ninguna borna, debajo.
   · Solo se toca lo que se ve en pantalla: no cambia los datos guardados ni el texto.
   · Hace falta al menos 3 elementos «clave = valor» separados por « · ». */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`
.bcol{display:grid;grid-template-columns:fit-content(46%) minmax(0,1fr);column-gap:8px;margin:6px 0 4px;text-align:left}
.bcol>.bck,.bcol>.bcv{padding:4px 0;border-top:1px dashed var(--bd,rgba(127,127,127,.35))}
.bcol>.bck:first-child,.bcol>.bck:first-child+.bcv{border-top:0}
.bck{align-self:start;justify-self:start;font-weight:800;font-variant-numeric:tabular-nums;color:var(--ac,#ff6a13);
 border:1.5px solid currentColor;border-radius:6px;padding:0 6px!important;margin-top:3px;line-height:1.45;min-width:1.6em;text-align:center;white-space:normal}
.bcv{min-width:0;overflow-wrap:anywhere;text-align:left}
.bcv.bcw{grid-column:1/-1}
.bcl,.bct{display:block;text-align:left}
.bct{margin-top:4px}`;
document.head.appendChild(st);

const NO="svg,button,textarea,input,select,script,style,code,pre,header,nav,#nav,#navtab,[contenteditable=true],.bcol,.bcl,.bct,[data-nocol]";
const BLOQUE=/^(DIV|P|LI|TD|DD|UL|OL|TABLE|DETAILS|SUMMARY|SECTION|H\d|BR|HR|LABEL|FIGURE)$/;
const PRUEBA=/ = [^·]*·[^=]* = [^·]*·[^=]* = /;

/* posiciones de « · » y del primer «: » fuera de paréntesis */
function corta(s){const sep=[];let d=0,dosp=-1;
 for(let i=0;i<s.length;i++){const c=s[i];
  if(c=="("||c=="["||c=="«")d++;else if((c==")"||c=="]"||c=="»")&&d>0)d--;
  else if(d==0){if(c=="·"&&s[i-1]==" "&&s[i+1]==" ")sep.push(i-1);else if(c==":"&&dosp<0&&/\s/.test(s[i+1]||""))dosp=i}}
 return {sep,dosp}}
const CLAVE=/^\s*([^=·]{1,42}?)\s=\s+/;
/* final de la última fila: primera frase nueva fuera de paréntesis («…). En 504/508 …») */
function finFila(s,ini){let d=0;
 for(let i=ini;i<s.length-2;i++){const c=s[i];
  if(c=="("||c=="["||c=="«")d++;else if((c==")"||c=="]"||c=="»")&&d>0)d--;
  else if(d==0&&c=="."&&s[i+1]==" "&&/[A-ZÁÉÍÓÚÑ¿0-9]/.test(s[i+2])){
   const w=(s.slice(Math.max(0,i-6),i).match(/(\S+)$/)||[""])[0];
   if(/^(rev|pág|pag|nº|aprox|fig|cond|izq|dcha|dch|izqda|aprox|máx|mín|ej|p)$/i.test(w))continue;
   return i+1}}
 return s.length}

function analiza(s){if(!PRUEBA.test(s))return null;
 const {sep,dosp}=corta(s);
 const ini=dosp>=0?dosp+1:0;
 const cortes=[ini,...sep.filter(p=>p>ini)];
 const filas=[];
 for(let k=0;k<cortes.length;k++){
  let a=cortes[k]+(k?3:0);const b=k+1<cortes.length?cortes[k+1]:s.length;
  while(a<b&&/\s/.test(s[a]))a++;
  const t=s.slice(a,b);const m=t.match(CLAVE);
  filas.push({a,b,k:m?[a+t.indexOf(m[1]),a+t.indexOf(m[1])+m[1].length]:null,v:m?a+m[0].length:a})}
 const con=filas.filter(f=>f.k).length;
 if(con<3||con<filas.length*0.7)return null;
 if(!filas[0].k&&dosp<0)return null;
 /* texto que sigue a la última fila */
 const u=filas[filas.length-1];let fin=s.length;
 if(u.k){fin=finFila(s,u.v);u.b=fin}
 return {lead:[0,ini],filas,tail:[fin,s.length]}}

/* texto inline inicial del elemento (hasta un <br> o un bloque) */
function tramo(el){const ns=[];
 for(const c of el.childNodes){
  if(c.nodeType==1){if(BLOQUE.test(c.tagName)||c.matches(NO)||c.querySelector&&c.querySelector("button,input,select,textarea,svg,div,br,details"))break;ns.push(c)}
  else if(c.nodeType==3)ns.push(c)}
 return ns}
function textos(ns){const out=[];let o=0;
 ns.forEach(n=>{if(n.nodeType==3){out.push({n,o});o+=n.nodeValue.length}else{const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT);let t;while((t=w.nextNode())){out.push({n:t,o});o+=t.nodeValue.length}}});
 return {out,len:o}}
function punto(tx,off){for(let i=tx.out.length-1;i>=0;i--){const e=tx.out[i];if(off>=e.o)return [e.n,Math.min(off-e.o,e.n.nodeValue.length)]}return [tx.out[0].n,0]}
function trozo(tx,a,b){if(b<=a)return null;const r=document.createRange();const p=punto(tx,a),q=punto(tx,b);r.setStart(p[0],p[1]);r.setEnd(q[0],q[1]);return r.cloneContents()}
function limpia(fr,re){/* quita « · » o espacios sueltos en los bordes */
 if(!fr)return fr;const w=document.createTreeWalker(fr,NodeFilter.SHOW_TEXT);const ts=[];let t;while((t=w.nextNode()))ts.push(t);
 if(ts.length){ts[ts.length-1].nodeValue=ts[ts.length-1].nodeValue.replace(re||/[\s·]+$/,"");ts[0].nodeValue=ts[0].nodeValue.replace(/^\s+/,"")}return fr}

function procesa(el){if(el.dataset.bcol)return;
 const ns=tramo(el);if(!ns.length)return;
 const tx=textos(ns);if(!tx.out.length)return;
 const s=tx.out.map(e=>e.n.nodeValue).join("");
 const r=analiza(s);if(!r)return;
 el.dataset.bcol="1";
 const lead=document.createElement("span");lead.className="bcl";const fl=trozo(tx,r.lead[0],r.lead[1]);if(fl)lead.append(limpia(fl));
 const g=document.createElement("span");g.className="bcol";
 r.filas.forEach(f=>{
  if(f.k){const k=document.createElement("span");k.className="bck";k.append(trozo(tx,f.k[0],f.k[1])||"");
   const v=document.createElement("span");v.className="bcv";const fv=trozo(tx,f.v,f.b);if(fv)v.append(limpia(fv));g.append(k,v)}
  else{const v=document.createElement("span");v.className="bcv bcw";const fv=trozo(tx,f.a,f.b);if(fv)v.append(limpia(fv));g.append(v)}});
 const frag=document.createDocumentFragment();
 if(lead.textContent.trim())frag.append(lead);frag.append(g);
 if(r.tail[1]>r.tail[0]){const ft=trozo(tx,r.tail[0],r.tail[1]);if(ft){const t=document.createElement("span");t.className="bct";t.append(limpia(ft));if(t.textContent.trim())frag.append(t)}}
 el.insertBefore(frag,ns[0]);ns.forEach(n=>n.remove())}

function candidatos(root){const out=[];if(!root||root.nodeType!=1)return out;
 const mira=e=>{if(e.dataset&&e.dataset.bcol)return;if(e.closest(NO))return;const t=e.textContent;if(t.length<40||!PRUEBA.test(t))return;out.push(e)};
 mira(root);root.querySelectorAll("span,div,p,li,td,dd,label,small,summary").forEach(e=>{if(PRUEBA.test(e.textContent))mira(e)});
 /* el más interior que contiene la lista en su texto inline */
 return out.filter(e=>!out.some(o=>o!==e&&e.contains(o)&&PRUEBA.test(o.textContent)&&o.textContent.length>=e.textContent.length*0.5))}
function corre(root){candidatos(root).forEach(e=>{try{procesa(e)}catch(x){}})}

let cola=new Set(),pend=false;
function vacia(){pend=false;const l=[...cola];cola.clear();l.forEach(n=>{if(n.isConnected)corre(n)})}
new MutationObserver(ms=>{for(const m of ms){const t=m.type=="characterData"?m.target.parentElement:m.target;
  if(!t||t.closest&&t.closest(".bcol,.bcl,.bct"))continue;
  if(m.type=="childList")m.addedNodes.forEach(n=>{if(n.nodeType==1)cola.add(n);else if(n.parentElement)cola.add(n.parentElement)});else cola.add(t)}
 if(cola.size&&!pend){pend=true;queueMicrotask(vacia)}})
 .observe(document.documentElement,{childList:true,subtree:true,characterData:true});
function inicio(){corre(document.body)}
if(document.readyState!="loading")inicio();else document.addEventListener("DOMContentLoaded",inicio);
window.bcolAnaliza=analiza;
})();
