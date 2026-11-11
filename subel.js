/* ===== v423: segregar el elemento concreto dentro de las cajas que agrupan varios (lupa del Panel de control) =====
   Ej.: «Fallo medida analógica extensión» → de la caja «Medidas analógicas (E-A4)» solo salen los pasos del láser de
   extensión ET-B9 (AI02) y los comunes (alimentación 24 V, módulo E-A4, mallas, cierre), sin altura, cabina ni rotonda.
   · El elemento se elige por las palabras de la descripción. Si no se nombra ninguno (p. ej. «fallo medida analógica»),
     se muestra un desplegable con las opciones para elegir el elemento que falla (hasta entonces, todos los pasos).
   · Los pasos generales que citan varios elementos se mantienen (diagnóstico común) pero sin croquis, para que el croquis
     y el Medir sean solo los del elemento elegido.
   Para añadir otra caja: una entrada más en SUB con el título de la caja, las opciones, sus palabras en la descripción (q)
   y sus palabras en los pasos (s). ===== */
(function(){
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const SUB=[
 {box:/^medidas anal/,et:"¿Qué medida falla?",op:[
  {k:"alt",ch:1,n:"Altura · ultrasonido C-B14 (AI01)",q:/\baltura\b|ultrason|c-?b14|\bsube\b|\bbaja\b|elevaci/,s:/altura|ultrason|c-?b14|\bai0?1\b|ain01|p-w20|ep-w8|hilo 341/},
  {k:"ext",ch:2,n:"Extensión · láser ET-B9 (AI02)",q:/extensi|retracc|\blaser\b|et-?b9|telescop/,s:/extensi|\blaser\b|et-?b9|\bai0?2\b|ain02|e-w13|hilo 312/},
  {k:"cab",ch:3,n:"Giro de cabina · potenciómetro C-R10 y convertidor E-R10 (AI03)",q:/cabina|c-?r10|e-?r10|convertidor/,s:/cabina|c-?r10|e-?r10|convertidor|\bai0?3\b|ain03|e-w9|e-x65|hilo 315/},
  {k:"rot",ch:4,n:"Giro de rotonda · potenciómetro R-R1 / encoder R-R10 (AI04)",q:/rotonda|r-?r1\b|r-?r10|encoder/,s:/rotonda|r-?r1\b|r-?r10|encoder|\bai0?4\b|ain04|hilo 316|it-w16/}]}];
const ELEG=new Map();/* elección del desplegable por caja (título) mientras no cambie la búsqueda */
let ULT="";
function def(s){return SUB.find(d=>d.box.test(nrm(s&&s.t)))}
function elegidos(d,q){const t=nrm(q);return d.op.filter(o=>o.q.test(t)).map(o=>o.k)}
/* devuelve {s:caja filtrada, gen:Set(pasos sin croquis), sel:html del desplegable} o null */
window.lupaSub=function(s,q){const d=def(s);if(!d)return null;if(q!==ULT){ELEG.clear();ULT=q}
 let ks=ELEG.has(s.t)?ELEG.get(s.t):elegidos(d,q);
 const auto=!ELEG.has(s.t)&&ks.length>0;
 const cuenta=p=>d.op.filter(o=>o.s.test(nrm(p))).map(o=>o.k);
 const gen=new Set();let p=s.p||[];
 /* v423: un paso que mezcla varios elementos se parte en frases (« · » y «. ») y se quitan las de los no elegidos.
    Se mantienen enteros los pasos comunes o de seguridad (QUÉ HAY, PRIORIDAD, NUNCA, Lectura…, CIERRE) y las frases comunes. */
 const ENTERO=/^(nunca|cierre|prioridad|que hay|lectura|caso real)/;
 const otros=t=>cuenta(t).some(k=>!ks.includes(k));
 if(ks.length&&ks.length<d.op.length){p=p.map(x=>{const c=cuenta(x);if(!c.length||ENTERO.test(nrm(x).trim()))return x;
   if(c.every(k=>ks.includes(k)))return x;if(!c.some(k=>ks.includes(k)))return null;
   let hd=(x.match(/^[^:·]{3,90}?(?:\([^)]*\))?:\s/)||[""])[0];if(hd&&otros(hd))hd="";let rest=x.slice(hd.length);
   const tk=rest.split(/(\s+·\s+|(?<=[^.]{3}\.)(?<!\b(?:rev|pág|p[aá]g|fig|ap|n[ºo])\.)\s+(?=[A-ZÁÉÍÓÚÑ≈0-9][^,]))/);const out=[];
   for(let j=0;j<tk.length;j+=2){const seg=tk[j],sep=tk[j-1]||"";const cs=cuenta(seg);
    const ok=!cs.length||/\bcom[uú]n(es)?\b/i.test(seg)||cs.some(k=>ks.includes(k));
    if(ok)out.push((out.length?(/·/.test(sep)?" · ":" "):"")+seg)}
   const r=(hd+out.join("")).trim();return out.length?r:null}).filter(Boolean);
  p.forEach(x=>{if(otros(x))gen.add(x)})}
 const opt=d.op.map(o=>`<option value="${o.k}"${ks.length==1&&ks[0]==o.k?" selected":""}>${o.n}</option>`).join("");
 const sel=`<div class="sbx"><label>${d.et}${auto?' <small>(según la descripción)</small>':""}</label>
  <select onchange="lupaSubElige(${JSON.stringify(s.t).replace(/"/g,"&quot;")},this.value)">
  <option value=""${!ks.length||ks.length>1?" selected":""}>${ks.length>1?"Varias (según la descripción)":"— Elige el elemento que falla · todas —"}</option>${opt}</select>
  ${!ks.length?'<div class="sbav">La descripción no nombra el elemento: elige en el desplegable para ver solo sus pasos, croquis y medidas.</div>':""}</div>`;
 /* señales del PLC (borneros del sistema): solo los canales de los elementos elegidos */
 const chs=d.op.filter(o=>ks.includes(o.k)&&o.ch).map(o=>o.ch);
 const rel=ks.length&&ks.length<d.op.length?(x=>!(x&&x.mod=="E-A4")||chs.includes(+String(x.S&&x.S.l))):null;
 return {s:Object.assign({},s,{p}),gen,sel,ks,rel}};
window.lupaSubElige=function(t,v){ELEG.set(t,v?[v]:[]);try{lupaPinta(window.__lupaK||0,null)}catch(e){}};
const st=document.createElement("style");st.textContent=`.sbx{margin:8px 0 10px;padding:9px 10px;border:1.5px solid var(--pr,#f97316);border-radius:10px;background:rgba(249,115,22,.08)}
.sbx label{display:block;font-weight:700;font-size:13px;margin-bottom:6px}.sbx label small{font-weight:500;opacity:.75}
.sbx select{width:100%;font-size:15px;padding:9px 10px;border-radius:8px}.sbav{margin-top:6px;font-size:12px;opacity:.85}`;
document.head.appendChild(st);
})();
