/* ===== v597: ACTUACIÓN GUIADA → COMENTARIO → ANÁLISIS IA → PDF (19/11/2026) =====
   Cada vez que el técnico pasa algo a la «Actuación guiada» de una OT abierta (guía de campo, cotejo de planos,
   sistemas, medidas, inspección cable a cable…):
     1) lo nuevo se copia solo al «Comentario» de la Resolución IA de esa OT (sin repetir lo que ya estuviera);
     2) se abre la Resolución IA con el comentario relleno y se lanza el análisis en segundo plano
        (misma consulta del botón Claude: Gemini primero; Claude solo si se acepta el aviso de consumo);
     3) al terminar, se va a la ficha de la OT y se genera el PDF A4 de la resolución, que queda en pantalla
        con «Descargar · Abrir · Compartir».
   Solo reacciona a cambios hechos en este móvil tras un toque del técnico (no a la sincronización con Supabase)
   y solo cuando la actuación guiada CRECE (borrar con la papelera no lanza nada). ===== */
(function(){
"use strict";
const SNAP={};let toque=0,tmr=null,enCurso=null;
const L=()=>(typeof inc!="undefined"&&Array.isArray(inc))?inc:[];
const foto=()=>L().forEach(i=>{SNAP[i.id]=String(i.guiada||"").trim()});
foto();
["pointerup","click","keyup"].forEach(t=>document.addEventListener(t,()=>{toque=Date.now()},true));

/* lo que se acaba de añadir (si se añadió al final) o el texto entero */
const nuevo=(g,p)=>(p&&g.startsWith(p)?g.slice(p.length):g).trim();
const limpia=t=>String(t||"").replace(/\r/g,"").replace(/\n{3,}/g,"\n\n").trim();

function revisa(){tmr=null;const reciente=Date.now()-toque<6000;
 for(const i of L()){const g=String(i.guiada||"").trim(),p=SNAP[i.id];SNAP[i.id]=g;
  if(p===undefined||!reciente||i.estado!="abierta"||!g||g===p||g.length<=p.length)continue;
  const d=limpia(nuevo(g,p));if(d)lanza(i.id,d)}}

async function lanza(id,delta){
 if(enCurso&&typeof msg=="function")msg("Ya hay un análisis en marcha: el comentario se ha actualizado");
 const i=L().find(x=>x.id==id);if(!i)return;
 const com=String(i.com||"").trim();
 if(!com.includes(delta)){i.com=(com?com+"\n\n":"")+delta;try{sv("pbb_inc",inc)}catch(e){}SNAP[i.id]=String(i.guiada||"").trim()}
 if(enCurso)return;
 if(typeof window.rcConsulta!="function"||typeof window.rcPrDe!="function")return;
 enCurso=id;
 try{
  /* Resolución IA abierta con el comentario ya relleno (la barra de progreso sale bajo el botón Claude) */
  try{if(typeof resTec=="function"){resTec(id);const c=document.getElementById("t_com");if(c)c.value=i.com||""}}catch(e){}
  if(typeof msg=="function")msg("Actuación guiada copiada al comentario · analizando…");
  const ant=i.resClaude&&i.resClaude.ts;
  await window.rcConsulta(id,window.rcPrDe(i));
  const o=L().find(x=>x.id==id);
  if(!o||!o.resClaude||o.resClaude.ts===ant)return; /* error o cancelada: la barra de la hoja lo indica */
  /* ficha de la OT a la vista y PDF en pantalla para compartir */
  try{if(typeof view!="undefined"&&view!="dash"&&view!="track"&&typeof go=="function")go("dash")}catch(e){}
  await new Promise(z=>setTimeout(z,350));
  if(typeof window.rcPdf=="function")await window.rcPdf(id);
  setTimeout(()=>{try{const b=document.getElementById("rcpdf_"+id);if(b){const c=b.closest(".card");if(c&&c.classList.contains("ot"))c.classList.add("oab");b.scrollIntoView({behavior:"smooth",block:"start"})}}catch(e){}},300)
 }catch(e){console.warn("guiada-auto",e)}
 finally{enCurso=null}}

/* se engancha a cada guardado de las OT */
if(typeof sv=="function"){const o=sv;sv=function(k){const r=o.apply(this,arguments);
 try{if(k=="pbb_inc"){if(tmr)clearTimeout(tmr);tmr=setTimeout(revisa,900)}}catch(e){}return r}}
/* OT nuevas o llegadas por sincronización: se toma su estado sin lanzar nada */
setInterval(()=>{if(Date.now()-toque>6000&&!tmr)foto()},4000);
})();
