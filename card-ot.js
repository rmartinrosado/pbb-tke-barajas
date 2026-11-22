/* v689: tarjeta de OT (Seguimiento)
   · El SOS va en la fila de datos, al lado del reloj (⏱): se ve también con la tarjeta plegada.
   · Fuera las estrellas (actuación más eficaz), el polímetro (inspección) y PLC; junto a «Foto PLC» queda un único botón
     🔧 REPARACIÓN que abre la inspección cable a cable ORIGEN → DESTINO de la OT. */
(function(){"use strict";
const LLAVE=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
const st=document.createElement("style");st.textContent=`
.orl .sosc{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;padding:0!important;margin:0!important;border-radius:50%!important;border:0!important;background:transparent!important;flex:none}
#app .card .otres{align-items:stretch!important}#app .card .otres .orl.orlsos{justify-content:flex-start!important;align-self:stretch;width:100%}/* v696: REPARACIÓN con el mismo estilo de pastilla que T4S (solo la llave) */
.otres .orl .grepc{display:inline-flex!important;align-items:center;justify-content:center;flex:none;margin:0!important;width:auto!important;min-height:0!important;height:auto!important;cursor:pointer;font:inherit;color:inherit!important}
.otres .orl .grepc svg{width:18px;height:18px;display:block}
.otres .orl.orlsos{gap:5px!important}#app .card .otres{position:relative}.otres>.repdedo{position:absolute;width:48px;height:36px;color:var(--pr);opacity:.8;pointer-events:none;z-index:3;margin:0}
.orl .sosc img{width:40px;height:40px;display:block}
.cacr .grep{display:inline-flex!important;flex-direction:column;align-items:center;justify-content:center;gap:1px;color:#fff!important;border:0!important;
 background:linear-gradient(135deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff))!important;box-shadow:0 6px 14px -6px var(--tkor,#ff7a1a)}
.cacts.cacpa{justify-content:center!important;margin:10px 0 4px!important;position:relative}.cacts.cacpa>.cacr{justify-content:center!important;margin:0 auto!important;gap:14px;flex:0 0 auto}
.cacts.cacpa>.cacl:empty{display:none}.cacts .cacr .grep{width:auto!important;padding:4px 12px!important}
.grepw{position:relative;display:inline-flex}.grepw .repdedo{position:absolute;left:62%;top:58%;width:56px;height:42px;color:var(--pr);opacity:.75;pointer-events:none;z-index:3}
.cacts.cacpa .sosdedo{display:none!important}
#app .card .cacts .cacr button.grep{color:#fff!important;border:0!important;background:linear-gradient(135deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff))!important;min-height:52px;padding:6px 16px!important;border-radius:12px!important}
#app .card .cacts .cacr button.grep small{color:#fff!important;font-size:10px}
#app .card .cacts .cacr .gcam{min-height:52px;width:52px!important;height:52px!important}
.cacr .grep svg{width:22px!important;height:22px!important}.cacr .grep small{font:800 8.5px/1 var(--tkmo,ui-monospace,monospace);letter-spacing:.3px}`;document.head.appendChild(st);
window.repOT=function(id){try{localStorage.setItem("insc_"+id,localStorage.getItem("insc_"+id)||String(Date.now()))}catch(e){}
 if(typeof insOT=="function")insOT(id);
 let k=0;const ir=()=>{const x=document.getElementById("insc-ov");if(x){x.open=true;x.scrollIntoView({block:"start",behavior:"smooth"})}else if(++k<20)setTimeout(ir,150)};setTimeout(ir,200)};
/* se retoca la tarjeta ya pintada (los botones y la fila de datos los terminan otras partes de la app sobre el DOM) */
function fix(c){const id=(c.querySelector('[onclick*="gFotoOT("]')||c.querySelector('[onclick*="sosVa("]')||c.querySelector('[onclick*="editar("]')||{getAttribute:()=>""}).getAttribute("onclick").match(/\('([^']+)'\)/);
 const oid=id?id[1]:null;
 c.querySelectorAll('.cacr .gvar,.cacr button[onclick^="insOT("],.cacr .gplc').forEach(b=>b.remove());
 /* v694: fuera también «Foto PLC» de la tarjeta (se hace en la guía · Cotejar PLC y en Resolución IA, y se guarda en la OT); si la fila queda vacía, se quita */
 {const fp=c.querySelector('.cacr .gcam,.cacr [onclick^="gFotoOT("]');if(fp)fp.remove();const ca0=c.querySelector(".obd>.cacts");if(ca0&&!ca0.querySelector("button"))ca0.style.display="none"}
 const cr=c.querySelector(".cacr");
 if(false&&cr&&oid&&!cr.querySelector(".grep")){const b=document.createElement("button");b.type="button";b.className="sec gwr grep";b.title="Reparación";b.setAttribute("aria-label","Reparación: inspección cable a cable origen → destino");
  b.innerHTML=LLAVE+"<small>REPARACIÓN</small>";b.onclick=e=>{e.stopPropagation();repOT(oid)};const cam=cr.querySelector(".gcam,.gfb2");cam?cam.after(b):cr.append(b)}
 /* v690: botones (Foto PLC + REPARACIÓN) centrados justo después de la primera actuación; Cierre CGA al final; la mano señala REPARACIÓN */
 const ca=c.querySelector(".obd>.cacts"),pa=c.querySelector(".obd>.pact"),cie=[...c.querySelectorAll(".obd>button.pri")].find(b=>/cierre/i.test(b.textContent));
 if(ca){ca.classList.add("cacpa");if(pa&&pa.nextElementSibling!==ca)pa.after(ca)}
 const ob=c.querySelector(".obd");if(cie&&ob&&ob.lastElementChild!==cie)ob.append(cie);
 /* v698: OT cerrada → sin botón de REPARACIÓN ni mano */
 let cerr=false;try{const o=(typeof inc!="undefined"?inc:[]).find(x=>x.id==(c.dataset.oid||oid));cerr=!!o&&o.estado=="cerrada"}catch(e){}
 if(cerr){c.querySelectorAll(".grepc,.repdedo").forEach(x=>x.remove())}
 else{
 /* v693: REPARACIÓN en la fila de datos, al lado del terminal (T4S); visible con la tarjeta plegada */
 {const o2=c.querySelector(".otres .orl");const g0=c.querySelector(".cacr .grep");if(g0){const w0=g0.closest(".grepw");(w0||g0).remove()}
  if(o2&&oid&&!o2.querySelector(".grepc")){const b=document.createElement("button");b.type="button";b.className="orc grepc";b.title="Reparación";b.setAttribute("aria-label","Reparación: inspección cable a cable origen → destino");
   b.innerHTML=LLAVE;b.onclick=e=>{e.stopPropagation();repOT(oid)};o2.append(b)}
  const ob=o2&&o2.querySelector(".grepc");if(ob&&!ob.classList.contains("orc")){ob.classList.add("orc");ob.innerHTML=LLAVE}}
 /* v697: la mano señala la llave (va en .otres, fuera de la fila que recorta, y se coloca sobre el botón) */
 {const ot=c.querySelector(".otres"),bt=ot&&ot.querySelector(".grepc");
  if(ot&&bt&&window.OT_DEDO){let m=ot.querySelector(":scope>.repdedo");if(!m){ot.insertAdjacentHTML("beforeend",window.OT_DEDO.replace('class="otdedo"','class="otdedo repdedo"'));m=ot.querySelector(":scope>.repdedo")}
   const pon=()=>{if(!m.isConnected)return;const a=ot.getBoundingClientRect(),r=bt.getBoundingClientRect();if(!r.width)return;
    m.style.left=(r.left-a.left+r.width*0.3)+"px";m.style.top=(r.top-a.top+r.height*0.45)+"px"};requestAnimationFrame(pon)}}
 }
 const rp=null&&c.querySelector(".cacr .grep");if(rp&&!rp.parentElement.classList.contains("grepw")){const w=document.createElement("span");w.className="grepw";rp.before(w);w.append(rp)}
 const gw=c.querySelector(".grepw");if(gw&&!gw.querySelector(".repdedo")&&window.OT_DEDO)gw.insertAdjacentHTML("beforeend",window.OT_DEDO.replace('class="otdedo"','class="otdedo repdedo"'));
 const sos=c.querySelector(".sosb:not(.sosc)"),orl=c.querySelector(".otres .orl");
 if(sos&&orl){const w=sos.parentElement;sos.classList.add("sosc");orl.prepend(sos);if(w&&/sosmid|sosw/.test(w.className)&&!w.children.length)w.remove()}
 else if(!sos&&orl){const s2=c.querySelector(".sosc");if(s2&&orl.firstElementChild!==s2)orl.prepend(s2)}
 /* v692: SOS a la izquierda del reloj, en la esquina inferior izquierda de la tarjeta */
 if(orl)orl.classList.toggle("orlsos",!!orl.querySelector(".sosc"));}
function todo(){if(typeof view!="undefined"&&view!="track")return;document.querySelectorAll("#app>.card.ot").forEach(c=>{try{fix(c)}catch(e){}})}
const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);new MutationObserver(todo).observe(a,{childList:true,subtree:true});todo()};ini();
})();
