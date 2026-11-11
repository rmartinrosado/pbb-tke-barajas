/* ===== v404: prioridad a la llegada a la posición.
   Mientras una OT abierta no tenga marcada la llegada («He llegado a la posición»):
   · la caja de llegada (cuenta atrás + botón) sube justo debajo de «Inicio», antes de la primera actuación y de todo lo demás;
   · la caja y el botón parpadean cada segundo con borde rojo para señalarlos;
   · el resto de botones y cajas de esa tarjeta (primera actuación, guía, PLC, Claude, editar, cierre…) quedan atenuados y no actúan:
     al tocarlos, la caja de llegada destella y avisa «Marca primero la llegada».
   Desplegar o plegar la tarjeta (toque en la tarjeta) sigue funcionando.
   v405: el bloqueo se aplica también en Inicio (tarjetas con data-hoid). ===== */
(function(){
 const st=document.createElement("style");st.textContent=`
.llegz{margin-top:6px;padding:6px;border:3px solid #dc2626;border-radius:10px;animation:llegzp 1s infinite}
.llegz .ctd{margin-top:0}html .llegz button.llegbt.sec{font-weight:800;background:#dc2626!important;color:#fff!important;border-color:#dc2626!important;letter-spacing:.3px}
@keyframes llegzp{50%{border-color:transparent;box-shadow:none}0%,100%{box-shadow:0 0 0 3px #dc262640}}
.llegz.llegfl{animation:llegzf .18s 4}@keyframes llegzf{50%{transform:scale(1.04);background:#fde2e2}}
.card[data-lleg] :is(button,a,summary,input,select,textarea,img,details,[onclick]):not(.llegbt){opacity:.38;filter:grayscale(.6)}
.card[data-lleg] .llegz *{opacity:1!important;filter:none!important}`;
 document.head.appendChild(st);
 const pend=i=>{try{return llegPend(i)&&llegFin(i)!=null}catch(e){return false}};
 try{const o=card;card=function(i){let h=o(i);if(!pend(i))return h;
  /* saca la caja de llegada de donde esté y la pone justo después de «Inicio» */
  const re=new RegExp(`<div class="ctd[^"]*" data-ctd="${String(i.id).replace(/[^\w-]/g,"")}">[\\s\\S]*?He llegado a la posición</button>`);
  const m=h.match(re);if(!m)return h;h=h.replace(m[0],"");
  const z=`<div class="llegz">${m[0].replace('<button class="sec"','<button class="sec llegbt"')}</div>`;
  if(/<div class="mu">Inicio [^<]*<\/div>/.test(h))h=h.replace(/(<div class="mu">Inicio [^<]*<\/div>)/,"$1"+z);else h=h+z;
  /* v405: en Inicio la tarjeta lleva data-hoid antes de class="card": se marca el primer <div …class="card…> sea cual sea el orden de atributos */
  return h.replace(/<div((?:\s+[\w-]+="[^"]*")*?)\s+class="card/,(_,a)=>`<div${a} data-lleg="${esc(String(i.id))}" class="card`)}}catch(e){}
 /* bloqueo de toques sobre la tarjeta pendiente de llegada */
 const ACT="button,a,summary,input,select,textarea,label,img,canvas,svg,details,[onclick],[role=button]";
 const bloqueado=t=>{if(!t||!t.closest)return null;const c=t.closest(".card[data-lleg]");if(!c)return null;
  if(t.closest(".llegz"))return null;const a=t.closest(ACT);if(!a||a===c||!c.contains(a))return null;
  const i=(typeof inc!="undefined"&&inc.find(x=>String(x.id)==c.dataset.lleg));if(i&&!pend(i))return null;return c};
 let avisado=0;
 const para=e=>{const c=bloqueado(e.target);if(!c)return;
  if(e.type=="touchstart"||e.type=="pointerdown"){e.stopPropagation();return} /* sin preventDefault: el scroll sigue funcionando */
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  if(e.type!="click"&&e.type!="touchend")return;const z=c.querySelector(".llegz");
  if(z){z.classList.remove("llegfl");void z.offsetWidth;z.classList.add("llegfl");try{z.scrollIntoView({block:"center",behavior:"smooth"})}catch(x){}}
  try{navigator.vibrate&&navigator.vibrate(120)}catch(x){}
  if(Date.now()-avisado>1500){avisado=Date.now();try{msg("Marca primero la llegada: «He llegado a la posición»")}catch(x){}}};
 /* v419: touchstart y pointerdown pasivos (no anulan nada): así el desplazamiento con el dedo no espera a este código */
 ["click","pointerup","touchend","mousedown","dblclick"].forEach(t=>document.addEventListener(t,para,{capture:true,passive:false}));
 ["pointerdown","touchstart"].forEach(t=>document.addEventListener(t,para,{capture:true,passive:true}));
 /* <details> se abre antes del click en algunos navegadores: se vuelve a cerrar */
 document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.tagName=="DETAILS"&&d.open&&bloqueado(d))d.open=false},true);
 try{if(typeof render=="function")render()}catch(e){}
})();
