/* v665: caja «Consultando…» parpadeando en el centro de la pantalla mientras trabaja cualquier motor de IA
   (cotejo de planos, análisis de OT, SOS, lectura de fotos/Magelis/hojas…). No bloquea: se puede seguir moviendo la pantalla. */
(function(){"use strict";
const IA=/\/functions\/v1\/(leer-ia|consulta-sos|leer-hoja|leer-magelis|leer-mantenimiento|leer-[a-z0-9-]+)/;
const FN=/^(leer-|consulta-)/;
let n=0;
const st=document.createElement("style");st.textContent=`#iaCons{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483000;pointer-events:none;display:none;
 background:#1565c0;color:#fff;font:800 19px -apple-system,system-ui,sans-serif;letter-spacing:.5px;padding:16px 26px;border-radius:14px;box-shadow:0 8px 30px #0008;border:2px solid #fff3;align-items:center;gap:10px}
#iaCons.on{display:flex;animation:iaParp 1.1s ease-in-out infinite}#iaCons i{font-style:normal;font-size:22px}
@keyframes iaParp{0%,100%{opacity:1}50%{opacity:.6}}`;document.head.appendChild(st);
const box=document.createElement("div");box.id="iaCons";box.innerHTML="<i>🤖</i><span>Consultando…</span>";
const pon=()=>{if(!box.isConnected&&document.body)document.body.appendChild(box)};
function pinta(){pon();const cot=[...document.querySelectorAll("#gpcot .pcbar")].some(b=>b.offsetParent);box.classList.toggle("on",n>0||cot)}
const mas=()=>{n++;pinta()},menos=()=>{n=Math.max(0,n-1);pinta()};
window.iaConsultando=v=>{v?mas():menos()};
const of=window.fetch;
if(of)window.fetch=function(u,o){const url=typeof u=="string"?u:(u&&u.url)||"";if(!IA.test(url))return of.apply(this,arguments);
 mas();let p;try{p=of.apply(this,arguments)}catch(e){menos();throw e}return p.then(r=>{menos();return r},e=>{menos();throw e})};
/* supabase-js guarda su propio fetch al crear el cliente: se envuelve también functions.invoke */
const env=()=>{try{if(typeof sb=="undefined"||!sb||!sb.functions||sb.functions.__iaC)return false;const oi=sb.functions.invoke.bind(sb.functions);
 sb.functions.invoke=function(name){if(!FN.test(String(name||"")))return oi.apply(null,arguments);mas();return oi.apply(null,arguments).finally(menos)};sb.functions.__iaC=1;return true}catch(e){return false}};
if(!env()){let k=0;const t=setInterval(()=>{if(env()||++k>60)clearInterval(t)},500)}
setInterval(pinta,500);
})();
