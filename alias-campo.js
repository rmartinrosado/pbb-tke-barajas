/* ===== v476: ALIAS DE CAMPO antes de cualquier análisis (15/11/2026) =====
   En el aviso, «bumper de traslación» (o de ruedas / bogie / carro de ruedas) son los BORDES DE SEGURIDAD DE RUEDAS T-B5 / T-B6
   (E-U5 → E-A8 2.1), no los bumpers del brazo (C-B27 / C-B28) ni los de cabina (C-B29 / C-B30) ni el bumper de ala (C-B25).
   Los tres son «bumper»: aquí se segrega según la descripción y se reescribe el texto para que el SOS, la lupa, el análisis de
   OT, la primera actuación y los croquis acoten bien. Para añadir otro alias: una fila más en AL. ===== */
(function(){
"use strict";
const AL=[[/\b(bumpers?|parachoques?)\s+(?:del?\s+)?(?:la\s+|las\s+|los\s+)?(traslaci\S*|ruedas?|bogie|carro(?:\s+de\s+ruedas)?|tren\s+de\s+ruedas)/gi,"borde de seguridad de ruedas ($2)"],
 [/\b(traslaci\S*|ruedas?|bogie)\s+(?:con\s+)?(bumpers?|parachoques?)/gi,"borde de seguridad de ruedas ($1)"]];
const fix=t=>{let s=String(t==null?"":t);AL.forEach(([re,r])=>{s=s.replace(re,r)});return s};
window.aliasCampo=fix;
const fixOT=o=>{if(!o||typeof o!="object")return o;const c=Object.assign({},o);["desc","def","com","obs"].forEach(k=>{if(c[k])c[k]=fix(c[k])});return c};
const envuelve=(n,modo)=>{const f=window[n];if(typeof f!="function"||f.__al)return;const g=function(){const a=[...arguments];if(modo=="ot")a[0]=fixOT(a[0]);else a[0]=fix(a[0]);return f.apply(this,a)};g.__al=1;
 try{window[n]=g}catch(e){}try{eval(n+"=g")}catch(e){}};
["anaOT","puentesOT","segOT","resetAplica","_croqLista","compCampoHTML"].forEach(n=>envuelve(n,n=="compCampoHTML"?"t":"ot"));
["lupaBusca"].forEach(n=>envuelve(n,"t"));
/* conceptos de campo (lupa / SOS) y desplegables de elemento */
if(typeof window.conceptoAjusta=="function"){const o=window.conceptoAjusta;window.conceptoAjusta=function(s,t,r){return o(s,fix(t),r)}}
if(typeof window.lupaSub=="function"){const o=window.lupaSub;window.lupaSub=function(s,q){return o(s,fix(q))}}
})();
