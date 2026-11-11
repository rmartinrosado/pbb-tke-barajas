/* ===== v408-v409: bornas y listas en columnas (pantalla y PDF) =====
   v409: también listas «CLAVE: …» y bornas numeradas sin «=» («1 +24 V · 2 0 V · 3 señal»), claves largas y los PDF de jsPDF.
   v410: corregido · en la guía de campo no se aplicaba porque el desplegable «Elementos» del paso tapaba la detección.
   v411: las flechas → son pasos a seguir · «CLAVE → acción · …» en dos columnas (clave | → acción) y «A → B → C» como pasos numerados 1, 2, 3… (también en PDF).
   v415: elementos separados por comas («R-R1, IT-W16, IT-X62…») → uno por línea con punto naranja, también en el rótulo «📍 Elementos».
   En la guía de campo, la actuación más eficaz, la actuación guiada, el análisis, la lupa, el SOS y la Resolución IA,
   los textos del tipo «BORNERO E-X62 (…): 1 = +24 V común (…) · 2 = 0 V común (…) · 3 = señal ALTURA …»
   se muestran en dos columnas: a la izquierda la borna (o la clave) y a la derecha lo que lleva, una fila por borna.
   · Encabezado (lo que va antes de los dos puntos) arriba; texto final que no es de ninguna borna, debajo.
   · Solo se toca lo que se ve en pantalla: no cambia los datos guardados ni el texto.
   · Hace falta al menos 3 elementos «clave = valor» separados por « · ». */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`
.bcol{display:grid;grid-template-columns:fit-content(36%) minmax(0,1fr);column-gap:8px;margin:6px 0 4px;text-align:left}
.bcol>.bck,.bcol>.bcv{padding:4px 0;border-top:1px dashed var(--bd,rgba(127,127,127,.35))}
.bcol>.bck:first-child,.bcol>.bck:first-child+.bcv{border-top:0}
.bck{font-weight:800;text-align:left;overflow-wrap:anywhere}
.bckc{display:inline-block;font-variant-numeric:tabular-nums;color:var(--ac,#ff6a13);border:1.5px solid currentColor;border-radius:6px;padding:0 6px;line-height:1.4;min-width:1.6em;text-align:center}
.bcv{min-width:0;overflow-wrap:anywhere;text-align:left}
.bcv.bcw{grid-column:1/-1}
.bcl,.bct{display:block;text-align:left}
summary.bcsum::after{content:none!important}.bcsum .bcl{display:inline}
.bcdot{color:var(--ac,#ff6a13);font-weight:900;padding:0 4px}
.bcar{color:var(--ac,#ff6a13);font-weight:800}
.bcpa .bckc{border-radius:50%;min-width:1.5em;padding:0 4px}
.bct{margin-top:4px}`;
document.head.appendChild(st);

const NO=".cxrec,details:not(.elusd)>summary,svg,button,textarea,input,select,script,style,code,pre,header,nav,#nav,#navtab,[contenteditable=true],.bcol,.bcl,.bct,[data-nocol]";
/* zonas con instrucciones: guía de campo, actuaciones, análisis, lupa, SOS, Resolución IA, croquis y hoja imprimible */
const ZONA=".gst,.gblq,.anal,.anaw,.anap,.anass,.gav,.sia,.srtx,.puac,.elusd,.elh,.gfix,.gsub,.gres,.grec,.gpaso,[class*=lpa],.rcOl,.rcUl,.rcT,.rcSum,.rcSt,.cxmed,#infov .indoc,.gelem";
const BLOQUE=/^(DIV|P|LI|TD|DD|UL|OL|TABLE|DETAILS|SUMMARY|SECTION|H\d|BR|HR|LABEL|FIGURE)$/;

/* posiciones de « · » y del primer «: » fuera de paréntesis */
function corta(s){const sep=[],fl=[];let d=0,dosp=-1;
 for(let i=0;i<s.length;i++){const c=s[i];
  if(c=="("||c=="["||c=="«")d++;else if((c==")"||c=="]"||c=="»")&&d>0)d--;
  else if(d==0){if(c=="·"&&s[i-1]==" "&&s[i+1]==" ")sep.push(i-1);else if(c==":"&&dosp<0&&/\s/.test(s[i+1]||""))dosp=i;
   else if(c=="→"&&s[i-1]==" "&&s[i+1]==" ")fl.push({i:i-1,n:3});else if(c=="-"&&s[i+1]==">"&&s[i-1]==" "&&s[i+2]==" ")fl.push({i:i-1,n:4})}}
 return {sep,dosp,fl}}
/* clave de cada fila: «CLAVE = …», «CLAVE: …» o borna numerada «1 …» / «E-X62:3 …» */
const CL_EQ=/^\s*([^=·]{1,60}?)\s=\s+/;
const CL_AR=/^\s*([^→·]{1,70}?)\s(?:→|->)\s+/;
const CL_DP=/^\s*([A-ZÁÉÍÓÚÑ0-9+][^:=·()]{0,28}?):\s+/;
const CL_NUM=/^\s*((?:\d{1,3}(?:[-–\/.]\d{1,3})?)|(?:[+]?[A-Z]{1,5}\d?-[A-Z]{1,3}\d+(?:\.\d+)?:\d{1,3}(?:[-–\/]\d{1,3})?))\s+(?=\S)/;
/* final de la última fila: primera frase nueva fuera de paréntesis («…). En 504/508 …») */
function finFila(s,ini){let d=0;
 for(let i=ini;i<s.length-2;i++){const c=s[i];
  if(c=="("||c=="["||c=="«")d++;else if((c==")"||c=="]"||c=="»")&&d>0)d--;
  else if(d==0&&c=="."&&s[i+1]==" "&&/[A-ZÁÉÍÓÚÑ¿≈]/.test(s[i+2])){
   const w=(s.slice(Math.max(0,i-6),i).match(/(\S+)$/)||[""])[0];
   if(/^(rev|pág|pag|nº|aprox|fig|cond|izq|dcha|dch|izqda|máx|mín|ej|p|sr)$/i.test(w))continue;
   return i+1}}
 return s.length}
function analiza(s){s=String(s||"");if(s.length<20)return null;
 const C=corta(s);return lista(s,C)||cadena(s,C)||comas(s)}
/* lista « · » con clave en cada fila */
function lista(s,C){const {sep,dosp}=C;if(sep.length<2)return null;
 const ini=dosp>=0&&dosp<sep[0]+400?dosp+1:0;
 const cortes=[ini,...sep.filter(p=>p>ini)];if(cortes.length<3)return null;
 const tr=[];
 for(let k=0;k<cortes.length;k++){let a=cortes[k]+(k?3:0);const b=k+1<cortes.length?cortes[k+1]:s.length;while(a<b&&/\s/.test(s[a]))a++;tr.push([a,b])}
 const prueba=re=>tr.map(([a,b])=>{const t=s.slice(a,b);const m=t.match(re);if(!m)return null;const i=a+t.indexOf(m[1]);return {k:[i,i+m[1].length],v:a+m[0].length}});
 let mejor=null,tipo="";
 for(const [re,min,ti] of [[CL_EQ,0.7,"eq"],[CL_AR,0.55,"fl"],[CL_DP,0.7,"dp"],[CL_NUM,1,"num"]]){const r=prueba(re);
  /* en las bornas numeradas sin «=» todas las filas deben empezar por la borna */
  const n=r.filter(Boolean).length;if(n>=3&&n>=tr.length*min||ti=="fl"&&n>=2&&n>=tr.length*0.6){mejor=r;tipo=ti;break}}
 if(!mejor)return null;
 if(!mejor[0]&&dosp<0)return null;
 const filas=tr.map(([a,b],i)=>mejor[i]?{a,b,k:mejor[i].k,v:mejor[i].v}:{a,b,k:null,v:a});
 const u=filas[filas.length-1];let fin=s.length;
 if(u.k){fin=finFila(s,u.v);u.b=fin}
 return {tipo,lead:[0,ini],filas,tail:[fin,s.length]}}
/* «A → B → C»: cada flecha es un paso a seguir, numerado */
function cadena(s,C){const fl=C.fl;if(fl.length<2)return null;
 const f0=fl[0].i;let ini=0;
 if(C.dosp>=0&&C.dosp<f0)ini=C.dosp+1;
 /* el paso 1 empieza en la última frase antes de la primera flecha */
 for(let i=f0-1;i>ini+1;i--){if(s[i-1]=="."&&s[i]==" "&&/[A-ZÁÉÍÓÚÑ¿]/.test(s[i+1]||"")){ini=i;break}}
 const cortes=[ini,...fl.map(x=>x.i)];const filas=[];
 for(let k=0;k<cortes.length;k++){let a=k?cortes[k]+fl[k-1].n:cortes[k];const b=k+1<cortes.length?cortes[k+1]:s.length;while(a<b&&/\s/.test(s[a]))a++;filas.push({a,b,k:null,v:a,n:k+1})}
 if(filas.some(f=>f.b-f.a<1))return null;
 const u=filas[filas.length-1];const fin=finFila(s,u.a);u.b=fin;
 return {tipo:"paso",lead:[0,ini],filas,tail:[fin,s.length]}}
const PRUEBA={test:t=>(t.match(/ · /g)||[]).length>=2||(t.match(/ (?:→|->) /g)||[]).length>=2||RE_COMA.test(t)};
/* v415: elementos separados por comas («R-R1, IT-W16, IT-X62, E-X62…») → uno por línea */
const RE_COD=/(?:^|[^A-Za-z0-9])\+?[A-Z]{1,5}\d?-[A-Z]{1,3}\d/;
const RE_COMA=/[A-Z]-[A-Z]{1,3}\d[^,]{0,70},\s[^,]{0,70}[A-Z]-[A-Z]{1,3}\d[^,]{0,70},\s/;
function comas(s){if(!RE_COMA.test(s))return null;
 /* comas y límites fuera de paréntesis */
 const cm=[],lim=[];let d=0;
 for(let i=0;i<s.length;i++){const c=s[i];
  if(c=="("||c=="["||c=="«"){if(d==0)lim.push({i,n:0,t:"("});d++}else if((c==")"||c=="]"||c=="»")&&d>0){d--;if(d==0)lim.push({i:i+1,n:0,t:")"})}
  else if(d==0){if(c==","&&s[i+1]==" ")cm.push(i);
   else if((c=="."||c==";"||c==":")&&(s[i+1]==" "||i==s.length-1))lim.push({i,n:1,t:c});
   else if(c=="·"&&s[i-1]==" "&&s[i+1]==" ")lim.push({i:i-1,n:3,t:"·"})}}
 if(cm.length<2)return null;
 const corto=(a,b)=>b-a<=80&&RE_COD.test(" "+s.slice(a,b));
 const limEntre=(a,b)=>lim.some(l=>l.t!="("&&l.t!=")"&&l.i>=a&&l.i<b);
 for(let k=0;k+1<cm.length;k++){
  /* tramo central: al menos un elemento entero entre dos comas */
  let j=k;while(j+1<cm.length&&corto(cm[j]+2,cm[j+1])&&!limEntre(cm[j]+2,cm[j+1]))j++;
  if(j==k)continue;
  /* primer elemento: desde el último límite antes de la primera coma */
  const lb=lim.filter(l=>l.i<cm[k]&&l.t!="("&&l.t!=")").pop();let a0=lb?lb.i+lb.n:0;while(s[a0]==" ")a0++;
  if(cm[k]-a0>80||!RE_COD.test(" "+s.slice(a0,cm[k]))){if(j-k<2)continue;k++;a0=cm[k-1]+2}
  /* último elemento: hasta el siguiente límite */
  const la=lim.find(l=>l.i>cm[j]&&l.t!="("&&l.t!=")");let b=la?la.i:s.length;
  const filas=[];let a=a0;for(let q=k;q<=j;q++){filas.push([a,cm[q]]);a=cm[q]+2}
  let ult=[a,b];
  if(b-a>80||!RE_COD.test(" "+s.slice(a,b))){ult=null}
  if(ult){const t=s.slice(a,b);const m=/\s(?:y|e|ni|o)\s(?=(?:el\s|la\s|los\s|las\s)?\S*[A-Z]{1,5}\d?-[A-Z]{1,3}\d)/.exec(t);
   if(m&&RE_COD.test(" "+t.slice(0,m.index))){filas.push([a,a+m.index]);filas.push([a+m.index+m[0].length,b])}else filas.push(ult)}
  else b=cm[j];
  if(filas.length<3)continue;
  let tl=ult?b:cm[j]+2;if(ult&&/[.;:]/.test(s[tl]||"")){filas[filas.length-1][1]=tl+1;tl++}
  return {tipo:"coma",lead:[0,filas[0][0]],filas:filas.map(([x,y])=>({a:x,b:y,k:null,v:x,n:"•"})),tail:[tl,s.length]}}
 return null}

/* texto inline inicial del elemento (hasta un <br> o un bloque) */
function tramo(el){const ns=[];
 for(const c of el.childNodes){
  if(c.nodeType==1&&!ns.length&&c.classList.contains("els"))continue;/* rótulo de la señal (Elementos) se queda arriba */
  if(c.nodeType==1){if(BLOQUE.test(c.tagName)||c.matches(NO)||c.querySelector&&c.querySelector("button,input,select,textarea,svg,div,br,details"))break;ns.push(c)}
  else if(c.nodeType==3)ns.push(c)}
 return ns}
function textos(ns){const out=[];let o=0;
 ns.forEach(n=>{if(n.nodeType==3){out.push({n,o});o+=n.nodeValue.length}else{const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT);let t;while((t=w.nextNode())){out.push({n:t,o});o+=t.nodeValue.length}}});
 return {out,len:o}}
function punto(tx,off){for(let i=tx.out.length-1;i>=0;i--){const e=tx.out[i];if(off>=e.o)return [e.n,Math.min(off-e.o,e.n.nodeValue.length)]}return [tx.out[0].n,0]}
function trozo(tx,a,b){if(b<=a)return null;const r=document.createRange();const p=punto(tx,a),q=punto(tx,b);r.setStart(p[0],p[1]);r.setEnd(q[0],q[1]);return r.cloneContents()}
function limpia(fr,re){/* quita « · », comas o espacios sueltos en los bordes (aunque queden en varios trozos) */
 if(!fr)return fr;const w=document.createTreeWalker(fr,NodeFilter.SHOW_TEXT);const ts=[];let t;while((t=w.nextNode()))ts.push(t);
 for(let i=ts.length-1;i>=0;i--){ts[i].nodeValue=ts[i].nodeValue.replace(re||/[\s·,]+$/,"");if(ts[i].nodeValue)break}
 for(let i=0;i<ts.length;i++){ts[i].nodeValue=ts[i].nodeValue.replace(/^[\s,]+/,"");if(ts[i].nodeValue)break}
 return fr}

function procesa(el){if(el.dataset.bcol)return;
 const ns=tramo(el);if(!ns.length)return;
 const tx=textos(ns);if(!tx.out.length)return;
 /* las flechas de los nombres de elementos («Manguera AE → pupitre») no cuentan */
 const s=tx.out.map(e=>{const v=e.n.nodeValue;const p=e.n.parentElement;return p&&p.closest(".elnm")?v.replace(/[→>]/g,"\u21E2"):v}).join("");
 const r=analiza(s);if(!r)return;
 el.dataset.bcol="1";
 const lead=document.createElement("span");lead.className="bcl";const fl=trozo(tx,r.lead[0],r.lead[1]);if(fl)lead.append(limpia(fl));
 const g=document.createElement("span");g.className="bcol";
 const chip=r.filas.every(f=>!f.k||f.k[1]-f.k[0]<=10);if(r.tipo=="paso")g.classList.add("bcpa");
 r.filas.forEach(f=>{
  if(f.k){const k=document.createElement("span");k.className="bck";const kc=trozo(tx,f.k[0],f.k[1]);if(chip){const c=document.createElement("span");c.className="bckc";if(kc)c.append(kc);k.append(c)}else if(kc)k.append(kc);
   const v=document.createElement("span");v.className="bcv";if(r.tipo=="fl"){const ar=document.createElement("span");ar.className="bcar";ar.textContent="→ ";v.append(ar)}const fv=trozo(tx,f.v,f.b);if(fv)v.append(limpia(fv));g.append(k,v)}
  else if(f.n){const k=document.createElement("span");k.className="bck";const c=document.createElement("span");c.className=f.n=="•"?"bcdot":"bckc";c.textContent=f.n;k.append(c);
   const v=document.createElement("span");v.className="bcv";const fv=trozo(tx,f.a,f.b);if(fv)v.append(limpia(fv));g.append(k,v)}
  else{const v=document.createElement("span");v.className="bcv bcw";const fv=trozo(tx,f.a,f.b);if(fv)v.append(limpia(fv));g.append(v)}});
 const frag=document.createDocumentFragment();
 if(lead.textContent.trim())frag.append(lead);frag.append(g);
 if(r.tail[1]>r.tail[0]){const ft=trozo(tx,r.tail[0],r.tail[1]);if(ft){const t=document.createElement("span");t.className="bct";t.append(limpia(ft));if(t.textContent.trim()){frag.append(t);var cola2=t}}}
 el.insertBefore(frag,ns[0]);ns.forEach(n=>n.remove());
 const sm=el.closest("summary");if(sm)sm.classList.add("bcsum");
 /* el texto que sigue puede llevar otra lista */
 if(typeof cola2!="undefined"&&cola2&&(procesa.n=(procesa.n||0)+1)<20){try{procesa(cola2)}finally{procesa.n--}}}

function candidatos(root){if(!root||root.nodeType!=1)return [];
 const out=[root,...root.querySelectorAll("span,div,p,li,td,dd,small")].filter(e=>!(e.dataset&&e.dataset.bcol)&&PRUEBA.test(e.textContent)&&!e.closest(NO)&&e.closest(ZONA));
 /* de dentro a fuera: si un elemento interior ya tiene la lista, el exterior ya no la ve en su texto inicial */
 return out.reverse()}
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

/* ===== PDF (jsPDF): las mismas listas en dos columnas =====
   Se envuelve cada documento nuevo: splitTextToSize() devuelve las filas marcadas (borna | texto) y text() las pinta
   en dos columnas, la borna a la izquierda y el texto a la derecha, con las líneas que siguen sangradas bajo el texto.
   El número de líneas es el real, así que los cálculos de alto de cada PDF siguen valiendo. */
const M1="\u0001",M2="\u0002",M3="\u0003";
function parteL(l){const i=l.indexOf(M3),j=l.indexOf(M2);return {kw:parseFloat(l.slice(1,i))||0,k:l.slice(i+1,j),v:l.slice(j+1)}}
const sinM=l=>typeof l=="string"&&l.charAt(0)==M1?(p=>(p.k?p.k+"  ":"")+p.v)(parteL(l)):l;
function envuelvePdf(d){if(!d||d.__bcol)return d;d.__bcol=1;
 const oS=d.splitTextToSize,oT=d.text,oW=d.getTextWidth;
 const split=(t,w,o)=>oS.call(d,t,w,o);
 d.splitTextToSize=function(t,w,o){try{
   if(typeof t!="string"||!(w>30))return split(t,w,o);
   const r=analiza(t);if(!r)return split(t,w,o);
   const out=[],sl=(a,b)=>t.slice(a,b).replace(/^[\s·]+|[\s·]+$/g,"");
   const lead=sl(r.lead[0],r.lead[1]);if(lead)out.push(...split(lead,w,o));
   const kt=f=>f.k?sl(f.k[0],f.k[1]):f.n=="•"?"-":f.n?String(f.n)+".":"";
   const ks=r.filas.filter(f=>f.k||f.n).map(kt);
   const kw=Math.min(Math.max(...ks.map(k=>oW.call(d,k)))+2.5,w*0.42);
   r.filas.forEach(f=>{
    if(!f.k&&!f.n){split(sl(f.a,f.b),w,o).forEach(l=>out.push(l));return}
    const kl=split(kt(f),kw-1.5,o),vl=split((r.tipo=="fl"?"-> ":"")+(sl(f.v,f.b)||" "),w-kw,o);
    for(let i=0;i<Math.max(kl.length,vl.length);i++)out.push(M1+kw.toFixed(2)+M3+(kl[i]||"")+M2+(vl[i]||""))});
   const tl=sl(r.tail[0],r.tail[1]);if(tl)out.push(...split(tl,w,o));
   return out}catch(e){return split(t,w,o)}};
 d.getTextWidth=function(t){if(typeof t=="string"&&t.charAt(0)==M1){const p=parteL(t);return p.kw+oW.call(d,p.v)}return oW.apply(d,arguments)};
 d.text=function(t,x,y,o,tr){try{
   if(typeof t=="string"&&o&&o.maxWidth&&analiza(t)){const oo=Object.assign({},o);delete oo.maxWidth;return d.text(d.splitTextToSize(t,o.maxWidth),x,y,oo,tr)}
   const arr=Array.isArray(t)?t:[t];
   if(!arr.some(l=>typeof l=="string"&&l.charAt(0)==M1))return oT.apply(d,arguments);
   if(o&&(o.align&&o.align!="left"||o.angle)||typeof x!="number")return oT.call(d,arr.map(sinM),x,y,o,tr);
   const lh=d.getFontSize()*(d.getLineHeightFactor?d.getLineHeightFactor():1.15)/d.internal.scaleFactor;
   arr.forEach((l,i)=>{const yy=y+i*lh;
    if(typeof l=="string"&&l.charAt(0)==M1){const p=parteL(l);if(p.k){const f=d.getFont();d.setFont(f.fontName,"bold");oT.call(d,p.k,x,yy,o,tr);d.setFont(f.fontName,f.fontStyle)}if(p.v)oT.call(d,p.v,x+p.kw,yy,o,tr)}
    else oT.call(d,l,x,yy,o,tr)});
   return d}catch(e){return oT.call(d,(Array.isArray(t)?t:[t]).map(sinM),x,y,o,tr)}};
 return d}
function envuelveLib(){const L=window.jspdf;if(!L||!L.jsPDF||L.jsPDF.__bcol)return;const O=L.jsPDF;
 const W=function(...a){return envuelvePdf(new O(...a))};Object.setPrototypeOf(W,O);W.prototype=O.prototype;W.API=O.API;W.__bcol=1;
 try{L.jsPDF=W}catch(e){}}
function engancha(){if(typeof window.cargaJsPDF!="function"||window.cargaJsPDF.__bcol)return;const o=window.cargaJsPDF;
 const n=function(){return Promise.resolve(o.apply(this,arguments)).then(r=>{envuelveLib();return r})};n.__bcol=1;window.cargaJsPDF=n}
engancha();envuelveLib();if(document.readyState=="loading")document.addEventListener("DOMContentLoaded",()=>{engancha();envuelveLib()});
window.bcolPdf=envuelvePdf;
})();
