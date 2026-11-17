/* ===== v558: lectura TOLERANTE del JSON que devuelve la IA =====
   Si la respuesta llega cortada (límite de salida) o con comas sobrantes, se repara: se cierran comillas, corchetes y llaves
   y, si aún falla, se recorta hasta el último dato completo. Así no aparece «JSON Parse error: Expected ']'». ===== */
(function(){
function cierra(s){let st=[],q=false,e=false;for(const c of s){if(q){if(e)e=false;else if(c==="\\")e=true;else if(c==='"')q=false;continue}
 if(c==='"')q=true;else if(c==="{"||c==="[")st.push(c);else if(c==="}"||c==="]")st.pop()}
 let t=s;if(q)t+='"';t=t.replace(/[,:\s]+$/,"");while(st.length)t+=st.pop()==="{"?"}":"]";return t}
const limpia=s=>s.replace(/,\s*([}\]])/g,"$1");
window.jsonIA=function(txt){let s=String(txt||"").replace(/```(?:json)?/gi,"");const i=s.indexOf("{");if(i<0)throw new Error("La IA no devolvió datos");s=s.slice(i);
 const j=s.lastIndexOf("}");try{return JSON.parse(limpia(s.slice(0,j+1)))}catch(e){}
 try{return JSON.parse(limpia(cierra(s)))}catch(e){}
 /* recortar hacia atrás hasta un punto en que, cerrando, sea válido */
 let k=s.length;for(let n=0;n<400&&k>1;n++){k=Math.max(s.lastIndexOf(",",k-1),s.lastIndexOf("{",k-1)+1,s.lastIndexOf("[",k-1)+1);if(k<=1)break;
  try{const o=JSON.parse(limpia(cierra(s.slice(0,k))));o._cortado=true;return o}catch(e){}}
 throw new Error("La respuesta de la IA llegó incompleta. Vuelve a pulsar «Identificar con IA».")};
})();
