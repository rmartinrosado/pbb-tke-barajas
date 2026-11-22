/* v689: tarjeta de OT (Seguimiento)
   · El SOS va en la fila de datos, al lado del reloj (⏱): se ve también con la tarjeta plegada.
   · Fuera las estrellas (actuación más eficaz), el polímetro (inspección) y PLC; junto a «Foto PLC» queda un único botón
     🔧 REPARACIÓN que abre la inspección cable a cable ORIGEN → DESTINO de la OT. */
(function(){"use strict";
const LLAVE=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
const st=document.createElement("style");st.textContent=`
.orl .sosc{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;padding:0!important;margin:0!important;border-radius:50%!important;border:0!important;background:transparent!important;flex:none}
.orl .sosc img{width:40px;height:40px;display:block}
.cacr .grep{display:inline-flex!important;flex-direction:column;align-items:center;justify-content:center;gap:1px;color:#fff!important;border:0!important;
 background:linear-gradient(135deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff))!important;box-shadow:0 6px 14px -6px var(--tkor,#ff7a1a)}
.cacr .grep svg{width:22px!important;height:22px!important}.cacr .grep small{font:800 8.5px/1 var(--tkmo,ui-monospace,monospace);letter-spacing:.3px}`;document.head.appendChild(st);
window.repOT=function(id){try{localStorage.setItem("insc_"+id,localStorage.getItem("insc_"+id)||String(Date.now()))}catch(e){}
 if(typeof insOT=="function")insOT(id);
 let k=0;const ir=()=>{const x=document.getElementById("insc-ov");if(x){x.open=true;x.scrollIntoView({block:"start",behavior:"smooth"})}else if(++k<20)setTimeout(ir,150)};setTimeout(ir,200)};
/* se retoca la tarjeta ya pintada (los botones y la fila de datos los terminan otras partes de la app sobre el DOM) */
function fix(c){const id=(c.querySelector('[onclick*="gFotoOT("]')||c.querySelector('[onclick*="editar("]')||{getAttribute:()=>""}).getAttribute("onclick").match(/\('([^']+)'\)/);
 const oid=id?id[1]:null;
 c.querySelectorAll('.cacr .gvar,.cacr button[onclick^="insOT("],.cacr .gplc').forEach(b=>b.remove());
 const cr=c.querySelector(".cacr");
 if(cr&&oid&&!cr.querySelector(".grep")){const b=document.createElement("button");b.type="button";b.className="sec gwr grep";b.title="Reparación";b.setAttribute("aria-label","Reparación: inspección cable a cable origen → destino");
  b.innerHTML=LLAVE+"<small>REPARACIÓN</small>";b.onclick=e=>{e.stopPropagation();repOT(oid)};const cam=cr.querySelector(".gcam,.gfb2");cam?cam.after(b):cr.append(b)}
 const sos=c.querySelector(".sosb:not(.sosc)"),orl=c.querySelector(".otres .orl");
 if(sos&&orl){const w=sos.parentElement;sos.classList.add("sosc");const t=orl.querySelector(".orc");t?t.after(sos):orl.prepend(sos);if(w&&/sosmid|sosw/.test(w.className)&&!w.children.length)w.remove()}
 else if(!sos&&orl&&!orl.querySelector(".sosc")){const s2=c.querySelector(".sosc");if(s2){const t=orl.querySelector(".orc");t?t.after(s2):orl.prepend(s2)}}}
function todo(){if(typeof view!="undefined"&&view!="track")return;document.querySelectorAll("#app>.card.ot").forEach(c=>{try{fix(c)}catch(e){}})}
const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);new MutationObserver(todo).observe(a,{childList:true,subtree:true});todo()};ini();
})();
