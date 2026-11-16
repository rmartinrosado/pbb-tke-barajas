/* ===== v499: Guía de campo de una OT · solo se despliega lo asignado a la descripción (16/11/2026) =====
   1) Cajas de la guía: al cambiar de OT (desplegable «OT asociada», varita, Seguimiento…) se volvía a abrir TODA caja
      relacionada con el análisis, porque el plegado de v56 solo se hacía la primera vez que se veía cada OT. Ahora, cada vez
      que se entra en otra OT, se vuelve a aplicar: abierta solo la caja certera de la descripción; el resto plegadas.
   2) «Elementos y referencias» siempre PLEGADO, y dentro solo el elemento de la descripción de la OT
      (p. ej. «fallo medida analógica de cabina» → solo AIN03 medidor de CABINA; el resto de entradas no se muestran).
      El encabezado (folio, módulo) y las notas finales se mantienen. Botón «Ver todos» para ver la lista entera.
      Si la descripción no apunta a ninguno, se ven todos. ===== */
(function(){
"use strict";
if(typeof vTec!="function")return;
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const VACIA=new Set("fallo fallos falla averia aviso activado activada activo activa senal señal error alarma ninguna tiene esta estan desde hasta entre sobre como cuando donde segun para pbb ot posicion".split(" "));
const SIN={longitud:["extension"],extensión:["extension"],altura:["altura","ultrason"],ultrasonido:["altura","ultrason"],laser:["laser","extension"],potenciometro:["potenciom"],giro:["giro"]};
const raiz=w=>w.length>5?w.slice(0,5):w;
function palabras(t){const s=new Set();nrm(t).split(/[^a-z0-9]+/).forEach(w=>{if(w.length<4||VACIA.has(w)||/^\d+$/.test(w))return;s.add(raiz(w));(SIN[w]||[]).forEach(x=>s.add(raiz(x)))});return s}
const raices=t=>new Set(nrm(t).split(/[^a-z0-9]+/).filter(w=>w.length>=4).map(raiz));
/* «CABECERA: seg1 · seg2 · seg3. Notas» → solo los segmentos de la avería */
function filtra(t,desc){
 let d=0,ix=-1;for(let i=0;i<t.length;i++){const c=t[i];if(c=="(")d++;else if(c==")"&&d>0)d--;else if(c==":"&&d==0&&/\s/.test(t[i+1]||"")){ix=i;break}}
 if(ix<0)return null;const cab=t.slice(0,ix+1);let resto=t.slice(ix+1).trim();
 const seg=resto.split(/\s+·\s+/);if(seg.length<3)return null;
 /* notas finales (después del último segmento): «… R-R1. Retornos …» */
 let nota="";const ul=seg[seg.length-1];const m=ul.match(/^(.*?\S)\.\s+(?=[A-ZÁÉÍÓÚ¿])(.*)$/s);if(m){seg[seg.length-1]=m[1];nota=m[2]}
 const W=palabras(desc);if(!W.size)return null;
 const R=seg.map(raices);
 /* palabras que salen en más de la mitad de los segmentos no distinguen (p. ej. «medida» / «medidor») */
 const util=[...W].filter(w=>R.filter(r=>r.has(w)).length<=seg.length/2);
 const sc=R.map(r=>util.filter(w=>r.has(w)).length);const mx=Math.max(...sc);if(!mx)return null;
 const quedan=seg.filter((s,k)=>sc[k]==mx);if(quedan.length==seg.length)return null;
 return{txt:cab+" "+quedan.join(" · ")+(nota?". "+nota:""),n:quedan.length,de:seg.length}}
function elementos(){const app=document.getElementById("app");if(!app)return;
 const i=typeof gOT!="undefined"&&gOT&&Array.isArray(inc)?inc.find(x=>x.id==gOT):null;
 const desc=i?[i.desc,i.def,i.com].filter(Boolean).join(" "):"";
 app.querySelectorAll("details.gelem:not([data-gfo])").forEach(g=>{g.dataset.gfo="1";g.open=false;if(!desc)return;
  let hay=false;
  g.querySelectorAll(":scope>.gelit>span:first-child").forEach(sp=>{const t=sp.textContent;const f=filtra(t,desc);if(!f)return;hay=true;
   const o=document.createElement("span");o.className="gfoall";o.textContent=t;
   sp.textContent=f.txt;sp.classList.add("gfoot");sp.after(o)});
  if(!hay)return;g.classList.add("gfo");
  const sm=g.querySelector(":scope>summary");if(sm)sm.insertAdjacentHTML("beforeend",` <span class="gfotag">· de la OT</span>`);
  const b=document.createElement("button");b.type="button";b.className="sec gfob";b.textContent="Ver todos los elementos";
  b.onclick=e=>{e.preventDefault();e.stopPropagation();const t=g.classList.toggle("gfot");b.textContent=t?"Ver solo los de la OT":"Ver todos los elementos"};
  g.appendChild(b)})}
let ultOT=null;
const o=vTec;vTec=function(){
 try{if(typeof gOT!="undefined"&&gOT&&gOT!==ultOT&&typeof gCertVisto!="undefined")[...gCertVisto].forEach(k=>{if(k.indexOf(gOT+"|")==0)gCertVisto.delete(k)})}catch(e){}
 const r=o.apply(this,arguments);
 try{ultOT=typeof gOT!="undefined"?gOT:null}catch(e){}
 try{elementos()}catch(e){console.warn("guia-foco",e)}
 return r};
const st=document.createElement("style");st.textContent=`
details.gelem .gfoall{display:none}details.gelem.gfot .gfoall{display:inline}details.gelem.gfot .gfoot{display:none}
details.gelem .gfotag{font-weight:400;font-size:12px;color:var(--ac,#ff7a1a)}
details.gelem .gfob{width:100%;margin:6px 0 2px!important;padding:6px!important;font-size:12.5px!important}`;
document.head.appendChild(st);
})();
