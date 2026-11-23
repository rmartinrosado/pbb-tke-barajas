/* v689: tarjeta de OT (Seguimiento)
   · El SOS va en la fila de datos, al lado del reloj (⏱): se ve también con la tarjeta plegada.
   · Fuera las estrellas (actuación más eficaz), el polímetro (inspección) y PLC; junto a «Foto PLC» queda un único botón
     🔧 REPARACIÓN que abre la inspección cable a cable ORIGEN → DESTINO de la OT. */
(function(){"use strict";
const LLAVE=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
const st=document.createElement("style");st.textContent=`
#app .card.ot .sosb,#app .card.ot .sosc{display:none!important}#app .card .otres .orl>.pactt{cursor:pointer}
/* v770: el tiempo centrado en la caja */
#app .card.ot .otres .orl.orlsos{position:relative;justify-content:flex-start!important}#app .card.ot .otres .orl.orlsos>[data-ort]{position:absolute!important;left:50%;top:50%;transform:translate(-50%,-50%);margin:0!important}
#app .card.ot .otres .orl .grepc.grjunto{flex:none;align-self:center!important;margin:0 0 0 2px!important;padding:3px 4px!important;border-radius:8px!important;border-width:1.5px!important;font-size:18px;line-height:1;box-sizing:content-box;min-width:18px;height:auto!important}
#app .card.ot .otres .orl .grepc.grjunto svg{width:18px!important;height:18px!important}#app .card .otres .orl>.pactt2{flex:none;margin:0 0 0 2px;font-size:18px;line-height:1;padding:3px 4px;border-radius:8px;border:1.5px solid #c62828;cursor:pointer}#app .card .otres .orl>.pactt.pactpte{animation:pactBl 1.1s ease-in-out infinite!important}
@keyframes pactBl{0%,100%{opacity:1;box-shadow:0 0 0 0 #ff5252aa}50%{opacity:.35;box-shadow:0 0 10px 2px #ff5252aa}}

.orl .sosc{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;padding:0!important;margin:0!important;border-radius:50%!important;border:0!important;background:transparent!important;flex:none}
#app .card .otres{align-items:stretch!important}/* v750: SOS y 🔌 a la izquierda; reloj y llave justificados a la derecha */#app .card .otres>.orl:first-child{justify-content:flex-end!important;align-self:stretch;width:100%}#app .card .otres .orl.orlsos{justify-content:flex-end!important;align-self:stretch;width:100%;min-height:44px}#app .card .otres .orl.orlsos>[data-ort]{margin-left:auto!important}#app .card .otres .orl>.pactt{flex:none;margin:0 0 0 2px!important;animation:none!important;font-size:18px;line-height:1;padding:3px 4px;border-radius:8px;border:1.5px solid #c62828}/* v696: REPARACIÓN con el mismo estilo de pastilla que T4S (solo la llave) */
.otres .orl .grepc{display:inline-flex!important;align-items:center;justify-content:center;flex:none;margin:0!important;width:auto!important;min-height:0!important;height:auto!important;cursor:pointer;font:inherit;color:inherit!important}
.otres .orl .grepc svg{width:18px;height:18px;display:block}
/* v748: llave más grande; con la OT abierta y con llegada, parpadea en amarillo como la caja */
#app .card.ot .otres .orl .grepc{padding:2px 14px!important;border-radius:999px!important;border-width:1.5px!important;align-self:stretch}#app .card.ot .otres .orl .grepc svg{width:16px!important;height:16px!important}/* v750: misma altura que el reloj */
#app .card.ot.otlle .otres .orl .grepc{border:2px solid #facc15!important;color:#facc15!important;animation:otLleBlink 1.4s ease-in-out infinite}
html.lt #app .card.ot.otlle .otres .orl .grepc{border-color:#d9a400!important;color:#9a6b00!important;animation-name:otLleBlinkL!important}
.otres .orl.orlsos{gap:5px!important}#app .card.ot .otres .orc{font-size:12px!important;padding:2px 9px!important}#app .card.ot .otres{margin-top:2px!important}#app .card.ot .ohdx>.ohsubw:has(.ohchips){flex-direction:column!important;align-items:flex-start!important;gap:5px!important;padding-top:2px}
/* v700: botones de la tarjeta (lápiz, papeleras, WhatsApp, borrar actuación…) con el mismo tamaño y formato */
#app .card.ot .otcol button,#app .card.ot .obd button.gbdel,#app .card.ot .obd button.gdl2,#app .card.ot .obd .gblqf button{
 width:52px!important;height:52px!important;min-width:52px!important;min-height:52px!important;padding:0!important;margin:0!important;
 display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:14px!important;
 border:1.5px solid color-mix(in srgb,var(--tx) 22%,transparent)!important;background:var(--card)!important;color:var(--tx)!important;box-shadow:0 4px 12px -8px #0008}
#app .card.ot .otcol button svg,#app .card.ot .obd button.gbdel svg,#app .card.ot .obd button.gdl2 svg,#app .card.ot .obd .gblqf button svg{width:24px!important;height:24px!important}
#app .card.ot .otcol{gap:10px!important}
.ohchips{display:flex;flex-direction:column;align-items:flex-start;gap:4px}
.ohchips .orc{display:inline-flex;align-items:center;font-size:11px;font-weight:800;padding:2px 8px;border-radius:999px;border:1.5px solid color-mix(in srgb,var(--tx) 35%,transparent);background:color-mix(in srgb,var(--tx) 8%,transparent);white-space:nowrap}#app .card .otres{position:relative}.otres>.repdedo{position:absolute;width:48px;height:36px;color:var(--pr);opacity:.8;pointer-events:none;z-index:3;margin:0}
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
 /* v699: Nº de orden y terminal debajo del número de la PBB */
 {const sw=c.querySelector(".ohsubw"),orl=c.querySelector(".otres .orl");
  if(sw&&orl){let k=sw.querySelector(":scope>.ohchips");if(!k){k=document.createElement("div");k.className="ohchips";sw.prepend(k)}
   /* v702: sin duplicados (la fila de datos se repinta y volvía a traer los chips) y sin el terminal */
   [...c.querySelectorAll(".otres .orc")].forEach(x=>{const t=x.textContent.trim();
    if(/^T(4S?|123)$/i.test(t)){x.remove();return}
    if(/^N[ºo°]\s*\d/i.test(t)){if([...k.children].some(y=>y.textContent.trim()==t))x.remove();else k.append(x)}});
   const vis=new Set();[...k.children].forEach(y=>{const t=y.textContent.trim();if(vis.has(t)||/^T(4S?|123)$/i.test(t))y.remove();else vis.add(t)})}}
 /* v698: OT cerrada → sin botón de REPARACIÓN ni mano */
 let cerr=false;try{const o=(typeof inc!="undefined"?inc:[]).find(x=>x.id==(c.dataset.oid||oid));cerr=!!o&&o.estado=="cerrada"}catch(e){}
 if(cerr){c.querySelectorAll(".grepc,.repdedo").forEach(x=>x.remove())}
 else{
 /* v693: REPARACIÓN en la fila de datos, al lado del terminal (T4S); visible con la tarjeta plegada */
 {const o2=c.querySelector(".otres .orl");const g0=c.querySelector(".cacr .grep");if(g0){const w0=g0.closest(".grepw");(w0||g0).remove()}
  if(o2&&oid&&!o2.querySelector(".grepc")){const b=document.createElement("button");b.type="button";b.className="orc grepc";b.title="Guía de campo de la OT";b.setAttribute("aria-label","Guía de campo de la OT con cotejo de planos y primera actuación");
   b.innerHTML=LLAVE;b.onclick=e=>{e.stopPropagation();repOT(oid)};o2.append(b)}
  const ob=o2&&o2.querySelector(".grepc");if(ob&&!ob.classList.contains("orc")){ob.classList.add("orc");ob.innerHTML=LLAVE}}
 /* v748: sin la mano sobre la llave */
 c.querySelectorAll(".repdedo").forEach(x=>x.remove());
 }
 const rp=null&&c.querySelector(".cacr .grep");if(rp&&!rp.parentElement.classList.contains("grepw")){const w=document.createElement("span");w.className="grepw";rp.before(w);w.append(rp)}
 const gw=c.querySelector(".grepw");if(gw&&!gw.querySelector(".repdedo")&&window.OT_DEDO)gw.insertAdjacentHTML("beforeend",window.OT_DEDO.replace('class="otdedo"','class="otdedo repdedo"'));
 const sos=c.querySelector(".sosb:not(.sosc)"),orl=c.querySelector(".otres .orl");
 if(sos&&orl){const w=sos.parentElement;sos.classList.add("sosc");orl.prepend(sos);if(w&&/sosmid|sosw/.test(w.className)&&!w.children.length)w.remove()}
 else if(!sos&&orl){const s2=c.querySelector(".sosc");if(s2&&orl.firstElementChild!==s2)orl.prepend(s2)}
 /* v692: SOS a la izquierda del reloj, en la esquina inferior izquierda de la tarjeta */
 /* v750: el 🔌 de primera actuación al lado del SOS, sin parpadeo */
 {const pa=c.querySelector(".pactt");if(pa&&orl){const s3=orl.querySelector(".sosc");if(s3){if(s3.nextElementSibling!==pa)s3.after(pa)}else if(orl.firstElementChild!==pa)orl.prepend(pa)}}
 /* v767: sin icono SOS en la caja; su actuación directa va al 🔌. 🔌 parpadeando si la resolución lleva PUENTE en el PLC;
    ✂️ (mismo tamaño) si la actuación directa es SOLTAR CABLE */
 {const id=c.dataset.oid||oid;const s4=c.querySelector(".sosc,.sosb");
  if(s4&&orl){let pa=c.querySelector(".pactt");if(!pa){orl.insertAdjacentHTML("afterbegin",'<span class="pactt" title="Primera actuación en campo">🔌</span>');pa=orl.querySelector(".pactt")}
   s4.remove();if(orl.firstElementChild!==pa)orl.prepend(pa)}
  const pa=c.querySelector(".pactt");
  if(pa){pa.setAttribute("role","button");pa.dataset.oid=id;pa.title="Actuación directa (SOS)";
   let k="";try{const o=inc.find(x=>x.id==id);if(o&&o.estado=="abierta"){let L=[];try{if(typeof _croqLista=="function")L=_croqLista(o)||[]}catch(e){}
     let P=[];try{if(typeof puentesOT=="function")P=puentesOT(o)||[]}catch(e){}
     const pte=L.some(x=>!x.suelta)||P.some(x=>!x.suelta&&!x.croq&&x.b),cor=L.some(x=>x.suelta)||P.some(x=>x.suelta||x.croq);
     k=pte&&cor?"dos":pte?"pte":cor?"cor":""}}catch(e){}
   if(pa.textContent.trim()!="⚡"){const ic=k=="cor"?"✂️":"🔌";if(pa.textContent.trim()!=ic)pa.textContent=ic}
   pa.classList.toggle("pactpte",k=="pte"||k=="dos");pa.classList.toggle("pactcor",k=="cor");
   /* v768: puente y soltar cable a la vez → 🔌 parpadeando + ✂️ */
   let t2=c.querySelector(".pactt2");if(k=="dos"){if(!t2){pa.insertAdjacentHTML("afterend",'<span class="pactt2" role="button" title="Actuación directa · soltar cable">✂️</span>');t2=c.querySelector(".pactt2")}t2.dataset.oid=id;if(pa.nextElementSibling!==t2)pa.after(t2)}else if(t2)t2.remove();
   /* v769: la llave al lado del 🔌 / ✂️, del mismo tamaño */
   {const gr=c.querySelector(".grepc"),an=c.querySelector(".pactt2")||pa;if(gr&&an&&an.parentNode===orl&&an.nextElementSibling!==gr){an.after(gr)}if(gr)gr.classList.toggle("grjunto",!!an)}}}
 if(orl)orl.classList.toggle("orlsos",!!orl.querySelector(".sosc,.pactt"));}
function todo(){if(!SEGV())return;document.querySelectorAll("#app .card.ot").forEach(c=>{try{fix(c)}catch(e){}})}
const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);new MutationObserver(todo).observe(a,{childList:true,subtree:true});todo()};ini();
})();

/* v767: el 🔌 / ✂️ de la caja abre la actuación directa (antes el botón SOS) */
document.addEventListener("click",e=>{const p=e.target.closest&&e.target.closest("#app .card .pactt,#app .card .pactt2");if(!p)return;e.stopPropagation();e.preventDefault();
 const id=p.dataset.oid||(p.closest(".card")||{}).dataset&&p.closest(".card").dataset.oid;if(!id)return;
 try{if(typeof otRapVa=="function")otRapVa(id);else sosVa(id)}catch(x){try{sosVa(id)}catch(y){}}},true);
