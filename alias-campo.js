/* ===== v476: ALIAS DE CAMPO antes de cualquier análisis (15/11/2026) =====
   En el aviso, «bumper de traslación» (o de ruedas / bogie / carro de ruedas) son los BORDES DE SEGURIDAD DE RUEDAS T-B5 / T-B6
   (E-U5 → E-A8 2.1), no los bumpers del brazo (C-B27 / C-B28) ni los de cabina (C-B29 / C-B30) ni el bumper de ala (C-B25).
   Los tres son «bumper»: aquí se segrega según la descripción y se reescribe el texto para que el SOS, la lupa, el análisis de
   OT, la primera actuación y los croquis acoten bien. Para añadir otro alias: una fila más en AL. ===== */
(function(){
"use strict";
const AL=[[/\b(bumpers?|parachoques?)\s+(?:del?\s+)?(?:la\s+|las\s+|los\s+)?(tra(?:n)?sla(?:ci|c)\S*|ruedas?|bogie|carro(?:\s+de\s+ruedas)?|tren\s+de\s+ruedas)/gi,"borde de seguridad de ruedas ($2)"],
 [/\b(tra(?:n)?sla(?:ci|c)\S*|ruedas?|bogie)\s+(?:con\s+)?(bumpers?|parachoques?)/gi,"borde de seguridad de ruedas ($1)"],
 /* v617: selector del pupitre CP-S16 (4 posiciones: REMOTO · 0 apagado · 1 LOCAL/MANUAL · 2 AUTO autonivelación).
    En las OT «selector en ON» = posición 1 LOCAL/MANUAL; «en AUTO» = autonivelación; «en 0 / OFF» = PBB apagada, mando sin tensión */
 [/\b(selector|llave)(\s+(?:del?\s+)?pupitre)?\s+(?:en\s+|a\s+)?(?:posici[oó]n\s+)?(?:on|1|local|manual)\b(?!\s*\/)/gi,"$1$2 en posición 1 LOCAL/MANUAL"],
 [/\b(selector|llave)(\s+(?:del?\s+)?pupitre)?\s+(?:en\s+|a\s+)?(?:posici[oó]n\s+)?(?:auto|automatico|2)\b/gi,"$1$2 en posición 2 AUTO (autonivelación)"],
 [/\b(selector|llave)(\s+(?:del?\s+)?pupitre)?\s+(?:en\s+|a\s+)?(?:posici[oó]n\s+)?(?:0|off|cero|apagado)\b/gi,"$1$2 en posición 0 (PBB apagada, mando sin tensión)"],
 [/\bmodo\s+on\b/gi,"modo LOCAL/MANUAL (selector en posición 1)"]];
/* v480: + alias aprendidos (tabla alias_avisos, los asigna el admin en «Avisos sin reconocer»: avisos-aprende.js) */
const fix=t=>{let s=String(t==null?"":t);AL.forEach(([re,r])=>{s=s.replace(re,r)});(window.__alAp||[]).forEach(a=>{try{a.re.lastIndex=0;s=s.replace(a.re,a.sus)}catch(e){}});return s};
window.aliasCampo=fix;
const fixOT=o=>{if(!o||typeof o!="object")return o;const c=Object.assign({},o);["desc","def","com","obs"].forEach(k=>{if(c[k])c[k]=fix(c[k])});return c};
const envuelve=(n,modo)=>{const f=window[n];if(typeof f!="function"||f.__al)return;const g=function(){const a=[...arguments];if(modo=="ot")a[0]=fixOT(a[0]);else a[0]=fix(a[0]);return f.apply(this,a)};g.__al=1;
 try{window[n]=g}catch(e){}try{eval(n+"=g")}catch(e){}};
["anaOT","puentesOT","segOT","resetAplica","_croqLista","compCampoHTML"].forEach(n=>envuelve(n,n=="compCampoHTML"?"t":"ot"));
["lupaBusca"].forEach(n=>envuelve(n,"t"));
/* conceptos de campo (lupa / SOS) y desplegables de elemento */
if(typeof window.conceptoAjusta=="function"){const o=window.conceptoAjusta;window.conceptoAjusta=function(s,t,r){return o(s,fix(t),r)}}
if(typeof window.lupaSub=="function"){const o=window.lupaSub;window.lupaSub=function(s,q){return o(s,fix(q))}}

/* v479: también «translación» (con n, como viene en los avisos de CGA) y la Resolución IA (Claude / Gemini):
   la consulta y la documentación que se reúne (guía, primera actuación, casos, planos) usan el texto ya segregado,
   y se añade una nota de campo para que la IA no proponga bumpers de brazo ni de cabina. */
const NOTA="NOTA DE CAMPO OBLIGATORIA (TKE Barajas): en los avisos, «bumper(s) de traslación / translación / ruedas» son los BORDES DE SEGURIDAD DE RUEDAS T-B5 (delantero) / T-B6 (trasero), relé GELBAU E-U5 → entrada safety E-A8 2.1 / 2.2 (folios 41 y 68). NO son los bumpers del brazo autonivelador (C-B27 / C-B28) ni los bumpers laterales de cabina (C-B29 / C-B30) ni el bumper de ala (C-B25): no los menciones, no los pongas en tablas ni como hipótesis. Trata solo los bordes de ruedas.";
const esTras=t=>AL.some(([re])=>{re.lastIndex=0;const r=re.test(String(t||""));re.lastIndex=0;return r});
window.aliasNota=t=>esTras(t)?NOTA:"";
const envCtx=()=>{const X=window.iaCtx;if(!X||X.__al)return;const w=(k,ix)=>{const f=X[k];if(typeof f!="function")return;X[k]=function(){const a=[...arguments];a[ix]=fix(a[ix]);return f.apply(this,a)}};
 w("guiaCtx",1);w("primeraCtx",1);w("casosCtx",0);w("planosCtx",2);X.__al=1};
envCtx();addEventListener("load",envCtx);setTimeout(envCtx,1500);setTimeout(envCtx,5000);
const of=window.fetch;window.fetch=function(u,o){try{if(o&&typeof o.body=="string"&&/\/functions\/v1\/(consulta-sos|leer-ia)/.test(String(u&&u.url||u))){
  envCtx();const b=JSON.parse(o.body);let tocado=false;
  let nota=false;["pregunta","prompt"].forEach(k=>{if(typeof b[k]=="string"){const f=fix(b[k]);if(f!==b[k]){if(esTras(b[k]))nota=true;b[k]=f+(esTras(b[k])?"\n\n"+NOTA:"");tocado=true}}});
  if(Array.isArray(b.mensajes||b.messages)){(b.mensajes||b.messages).forEach(m=>{if(m&&typeof m.content=="string"&&esTras(m.content)){m.content=fix(m.content)+"\n\n"+NOTA;nota=true;tocado=true}})}
  if(tocado){if(nota&&typeof b.contexto=="string")b.contexto=NOTA+"\n\n"+b.contexto;o=Object.assign({},o,{body:JSON.stringify(b)})}}}catch(e){}
 return of.call(this,u,o)};
})();
