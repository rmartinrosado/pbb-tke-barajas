/* v684: en el SOS, el botón «Guía completa» pasa a «🔌 Inspección cable a cable»: abre la guía mostrando SOLO la inspección
   cable a cable generada con la IA (la del PLC filtrada por las señales de la avería y, si existe, la inspección completa
   origen → destino). Arriba, «Ver guía completa» devuelve la guía entera. */
(function(){"use strict";
const st=document.createElement("style");st.textContent=`
#app.insolo>*:not(#insk):not([data-k="INS"]):not(#ginsc){display:none!important}
#app.insolo>[data-k="INS"],#app.insolo>#ginsc{display:block!important}
#insk{border-radius:16px;padding:12px 14px;margin:0 0 10px;border:1.5px solid transparent;
 background:linear-gradient(var(--card),var(--card)) padding-box,linear-gradient(135deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff) 55%,#1e88e5) border-box}
#insk .ikt{font:900 15px/1.25 var(--tkmo,ui-monospace,monospace);letter-spacing:1.5px;text-transform:uppercase;
 background:linear-gradient(90deg,var(--tkor,#ff7a1a),#ffb020 40%,var(--tkpu,#9b3dff));-webkit-background-clip:text;background-clip:text;color:transparent}
#insk .iks{font-size:13px;color:var(--mu);margin:4px 0 10px}#insk button{margin:0!important;width:100%}
#insk .ikv{margin-top:10px;padding:10px;border-radius:10px;border:1px dashed color-mix(in srgb,var(--tx) 25%,transparent);font-size:13.5px}`;document.head.appendChild(st);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let solo=null;
window.sosIns=function(){let id=null;try{id=gOT}catch(e){}solo=id;if(typeof sosSal=="function")sosSal();setTimeout(aplica,50)};
window.insSoloFin=function(){solo=null;const a=document.getElementById("app");if(a)a.classList.remove("insolo");const k=document.getElementById("insk");if(k)k.remove();scrollTo(0,0)};
function aplica(){const a=document.getElementById("app");if(!a)return;let g=null,v="";try{g=gOT;v=view}catch(e){}
 if(!solo||v!="tec"||g!=solo){if(a.classList.contains("insolo"))window.insSoloFin();return}
 a.classList.add("insolo");let i=null;try{i=inc.find(x=>x.id==g)}catch(e){}
 const ins=a.querySelector(':scope>[data-k="INS"]'),com=document.getElementById("ginsc");
 if(ins&&!ins.__isO){ins.__isO=1;ins.open=true}
 let k=document.getElementById("insk");
 const h=`<div class="ikt">🔌 Inspección cable a cable · IA</div><div class="iks">${i?`PBB ${esc(i.pos)} · ${esc(i.tipo||"")} · ${esc(i.orden||"")} — ${esc(i.desc||"")}`:""}</div>
  <button class="sec" onclick="insSoloFin()">📖 Ver guía completa</button>${!ins&&!com?`<div class="ikv">La IA todavía no ha generado la inspección cable a cable de esta OT. Abre la guía completa y lanza el cotejo de planos.</div>`:""}`;
 if(!k){k=document.createElement("div");k.id="insk";a.prepend(k)}else if(a.firstElementChild!==k)a.prepend(k);
 if(k.innerHTML!==h)k.innerHTML=h}
const o=window.render;if(typeof o=="function")window.render=render=function(){const r=o.apply(this,arguments);try{aplica()}catch(e){}return r};
let t=0;const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);new MutationObserver(()=>{if(t)return;t=setTimeout(()=>{t=0;try{aplica()}catch(e){}},100)}).observe(a,{childList:true});};ini();
})();
