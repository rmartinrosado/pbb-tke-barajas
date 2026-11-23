/* ===== v522: en TODA la PWA, la IA va primero con GEMINI (gratis) y Claude solo si el técnico acepta el coste (16/11/2026) =====
   Afecta a todas las funciones de IA de Supabase: leer-ia (foto PLC, componentes, cierre dictado…), consulta-sos (SOS y
   Resolución IA), leer-hoja (importar hoja de OT), leer-magelis (foto de la Magelis) y leer-mantenimiento (programa AENA).
   1) Cada consulta sale con {motor:"gemini"}: las funciones no tocan Claude.
   2) Si Gemini no da resultado (error, saturado, sin respuesta) → aviso «⚠️ CONSUMO DE CLAUDE» con el motivo:
      Aceptar → se repite la misma consulta con {motor:"claude"}; Cancelar → se queda el error de Gemini, sin coste.
   3) Las llamadas que ya eligen motor (cotejo entre planos) no se tocan. ===== */
(function(){
"use strict";
const FN=/\/functions\/v1\/(leer-ia|consulta-sos|leer-hoja|leer-magelis|leer-mantenimiento)(?![\w-])/;
const NOM={"leer-ia":"la lectura con IA","consulta-sos":"la consulta IA (SOS / Resolución IA)","leer-hoja":"la lectura de la hoja de OT","leer-magelis":"la lectura de la foto de la Magelis","leer-mantenimiento":"la lectura del programa de Mantenimiento"};
const pide=(fn,err)=>confirm(`⚠️ CONSUMO DE CLAUDE\n\nGemini (gratis) no ha dado resultado en ${NOM[fn]||"la consulta IA"}${err?":\n«"+String(err).replace(/\s+/g," ").slice(0,170)+"»":"."}\n\n${(window.__claveIA||{}).anthropic?"¿Aceptas repetirla con Claude usando TU clave (····"+window.__claveIA.anthropic+"): el coste va a TU cuenta de Anthropic?":"¿Aceptas repetirla con Claude (API de Anthropic, tiene coste por uso)?\n\nPuedes poner tu propia clave en 🔑 Clave IA."}`);
const con=(b,m)=>JSON.stringify(Object.assign({},b,{motor:m}));

/* --- llamadas con fetch (leer-ia, consulta-sos) --- */
const of=window.fetch;
window.fetch=async function(u,o){
 const m=String(u&&u.url||u).match(FN);
 if(!m||!o||typeof o.body!="string")return of.apply(this,arguments);
 let b;try{b=JSON.parse(o.body)}catch(e){return of.apply(this,arguments)}
 if(!b||typeof b!="object"||b.motor)return of.apply(this,arguments);
 let r=null,err="";
 try{r=await of.call(this,u,Object.assign({},o,{body:con(b,"gemini")}));if(r.ok)return r;
  try{const j=await r.clone().json();err=j.mensaje||j.error||("error "+r.status)}catch(e){err="error "+r.status}}
 catch(e){if(o.signal&&o.signal.aborted)throw e;err=String(e&&e.message||e)}
 if(!pide(m[1],err)){if(r)return r;throw new Error("Gemini sin resultado ("+err+") · no se ha aceptado Claude")}
 return of.call(this,u,Object.assign({},o,{body:con(b,"claude")}))};

/* --- llamadas con sb.functions.invoke (leer-hoja, leer-magelis, leer-mantenimiento) --- */
try{const F=sb.functions,oi=F.invoke.bind(F);
 F.invoke=async function(n,opt){
  if(!/^(leer-ia|consulta-sos|leer-hoja|leer-magelis|leer-mantenimiento)$/.test(n)||!opt||!opt.body||typeof opt.body!="object"||opt.body.motor)return oi(n,opt);
  const r=await oi(n,Object.assign({},opt,{body:Object.assign({},opt.body,{motor:"gemini"})}));
  if(!r.error&&r.data&&!r.data.error)return r;
  let err=(r.data&&(r.data.mensaje||r.data.error))||"";
  if(!err&&r.error){try{const c=r.error.context;const j=c&&c.json?await c.clone().json():null;err=j&&(j.mensaje||j.error)||r.error.message||""}catch(e){err=r.error.message||""}}
  if(!pide(n,err))return r;
  return oi(n,Object.assign({},opt,{body:Object.assign({},opt.body,{motor:"claude"})}))}}catch(e){console.warn("ia-motor invoke",e)}
})();
