/* ===== v760: 🔑 CLAVE IA PROPIA de cada usuario (23/11/2026) =====
   Cada técnico puede guardar SU clave de Gemini (gratis, Google AI Studio) y/o de Claude (API de Anthropic, de pago por uso).
   · Se guardan cifradas en el Vault de Supabase (RPC ia_clave_guardar); el móvil solo ve los 4 últimos caracteres (ia_clave_estado).
   · Las funciones de IA (consulta-sos, leer-ia, leer-hoja, leer-magelis, leer-mantenimiento) usan la clave del usuario
     con sesión; si no tiene, la clave central. Así el consumo va a la cuenta de cada técnico.
   · Acceso: botón «Clave IA» en la barra lateral y window.miClaveIA(). ===== */
(function(){"use strict";
const ICO='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2M16 7l3 3M18.5 4.5l2 2"/></svg>';
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const P={gemini:{n:"Gemini",sub:"Google · gratis",url:"https://aistudio.google.com/apikey",pre:"AIza",
  pasos:"Entra con tu cuenta de Google en aistudio.google.com/apikey → «Create API key» → cópiala y pégala aquí."},
 anthropic:{n:"Claude",sub:"Anthropic · pago por uso",url:"https://console.anthropic.com/settings/keys",pre:"sk-ant-",
  pasos:"Crea tu cuenta en console.anthropic.com, añade un método de pago y un límite de gasto (Billing → Limits) → API Keys → «Create Key» → cópiala y pégala aquí."}};
window.__claveIA=window.__claveIA||{};
async function estado(){try{const {data,error}=await sb.rpc("ia_clave_estado");if(!error&&data)window.__claveIA={anthropic:data.anthropic||"",gemini:data.gemini||""}}catch(e){}return window.__claveIA}

const st=document.createElement("style");st.textContent=`
.cia h3{margin:0 0 4px}.cia .ciaint{font-size:13px;opacity:.8;margin:0 0 12px;line-height:1.4}
.cia .ciab{border:1px solid #ffffff1f;border-radius:14px;padding:12px;margin:0 0 12px;background:#ffffff08}
.cia .ciat{display:flex;align-items:center;justify-content:space-between;gap:8px;font-weight:700;font-size:16px}
.cia .ciat small{font-weight:500;font-size:12px;opacity:.7}
.cia .ciae{font-size:12.5px;font-weight:700;padding:3px 9px;border-radius:999px;white-space:nowrap}
.cia .ciae.ok{background:#2e9e4433;color:#4cd964}.cia .ciae.no{background:#ffffff14;opacity:.8}
.cia .ciap{font-size:12.5px;opacity:.75;margin:8px 0;line-height:1.4}.cia .ciap a{color:#4aa3ff}
.cia input{width:100%;box-sizing:border-box;font-family:ui-monospace,monospace;font-size:14px}
.cia .ciar{display:flex;gap:8px;margin-top:8px}.cia .ciar button{flex:1;min-height:44px;margin:0!important}
.cia .ciam{font-size:12.5px;margin-top:6px;min-height:16px}`;
document.head.appendChild(st);

function bloque(k,fin){const p=P[k];return `<div class="ciab" data-k="${k}">
 <div class="ciat"><span>${p.n} <small>${p.sub}</small></span><span class="ciae ${fin?"ok":"no"}">${fin?"✔ Tuya ····"+E(fin):"Usa la de la empresa"}</span></div>
 <div class="ciap">${p.pasos} <a href="${p.url}" target="_blank" rel="noopener">Abrir</a></div>
 <input type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${fin?"Pega otra para cambiarla":p.pre+"…"}" id="cia_${k}">
 <div class="ciar"><button class="pri" type="button" onclick="ciaGuarda('${k}')">Guardar</button>${fin?`<button class="sec" type="button" onclick="ciaGuarda('${k}',1)">Quitar</button>`:""}</div>
 <div class="ciam" id="ciam_${k}"></div></div>`}

window.miClaveIA=async function(){
 const sh=document.getElementById("sheet"),c=document.getElementById("sheetc");if(!sh||!c)return;
 c.innerHTML=`<div class="cia"><h3>🔑 Mi clave IA</h3><p class="ciaint">Cargando…</p></div>`;sh.style.display="flex";
 const e=await estado();
 c.innerHTML=`<div class="cia"><h3>🔑 Mi clave IA</h3>
 <p class="ciaint">Con tu clave, las consultas de IA que hagas (SOS, Resolución IA, fotos de PLC y Magelis, componentes, hojas…) se cargan a <b>tu cuenta</b>. Sin clave se usa la de la empresa. La clave se guarda cifrada en el servidor: nadie más la ve y no queda en el móvil.</p>
 ${bloque("gemini",e.gemini)}${bloque("anthropic",e.anthropic)}
 <p class="ciaint">Primero se consulta Gemini; Claude solo si Gemini no da resultado y lo aceptas.</p>
 <button class="sec" type="button" style="width:100%;min-height:44px" onclick="closeSheet()">Cerrar</button></div>`};

window.ciaGuarda=async function(k,quitar){
 const i=document.getElementById("cia_"+k),m=document.getElementById("ciam_"+k);const v=quitar?"":String(i&&i.value||"").trim();
 if(!quitar&&!v){m.textContent="Pega la clave primero.";return}
 if(!quitar&&!v.startsWith(P[k].pre)){m.textContent="La clave de "+P[k].n+" empieza por «"+P[k].pre+"».";return}
 if(quitar&&!confirm("¿Quitar tu clave de "+P[k].n+"? Se volverá a usar la de la empresa."))return;
 m.textContent="Guardando…";
 try{const {data,error}=await sb.rpc("ia_clave_guardar",{p:k,k:v});if(error)throw error;
  if(navigator.vibrate)navigator.vibrate(30);await window.miClaveIA();
  const m2=document.getElementById("ciam_"+k);if(m2)m2.textContent=quitar?"Clave quitada.":"✔ Clave guardada.";}
 catch(e){m.textContent="No se ha podido guardar: "+String(e&&e.message||e).replace(/^.*?:\s*/,"")}};

/* botón en la barra lateral */
function boton(){const n=document.getElementById("nav");if(!n||n.querySelector("#navcia"))return;let u=false;try{u=!!user}catch(e){}if(!u)return;
 n.insertAdjacentHTML("beforeend",`<button id="navcia" type="button" onclick="miClaveIA()"><span>${ICO}</span>Clave IA</button>`)}
const or=window.render;if(typeof or=="function"){window.render=function(){const r=or.apply(this,arguments);try{boton()}catch(e){}return r}}
setInterval(()=>{try{boton()}catch(e){}},1500);
let pedido=false;setInterval(()=>{let u=false;try{u=!!user}catch(e){}if(u&&!pedido){pedido=true;estado()}if(!u)pedido=false},2000);
})();
