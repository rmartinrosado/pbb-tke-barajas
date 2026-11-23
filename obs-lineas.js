/* ===== v834: SOS · caja «Avería en campo» (#sr_ob): cada línea incorporada lleva a la DERECHA, justificada,
   una ✕ roja que elimina esa línea (la Magelis pegada, un componente, lo dictado…).
   · La ✕ va a la altura de la primera fila visual de cada línea (aunque la línea ocupe varias filas al ajustarse).
   · Sigue el desplazamiento del texto, el tamaño de la caja y los cambios hechos por código (Magelis, componentes, historial).
   · Al pulsarla no se cierra el teclado ni se pierde el foco; se avisa con «input» para que validación y chips se recalculen. ===== */
(function(){
const ID="sr_ob";
const st=document.createElement("style");st.textContent=`
.srobsw textarea#sr_ob{padding-right:34px!important}
.oblx{position:absolute;overflow:hidden;pointer-events:none;z-index:3}
.oblx .oblxb{position:absolute;right:4px;width:24px;height:24px;display:grid;place-items:center;border-radius:7px;
 background:color-mix(in srgb,#e53935 16%,transparent);color:#ff5252;font:900 15px/1 -apple-system,system-ui,sans-serif;
 pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.oblx .oblxb:active{background:#e53935;color:#fff}
@media (prefers-color-scheme:light){.oblx .oblxb{color:#d32f2f;background:color-mix(in srgb,#d32f2f 12%,transparent)}}`;
document.head.appendChild(st);

let espejo=null;
function mide(t){
 const cs=getComputedStyle(t);
 if(!espejo){espejo=document.createElement("div");espejo.setAttribute("aria-hidden","true");
  espejo.style.cssText="position:absolute;visibility:hidden;left:-9999px;top:0;white-space:pre-wrap;overflow-wrap:break-word;word-wrap:break-word";
  document.body.appendChild(espejo)}
 ["boxSizing","fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","lineHeight","textTransform","wordSpacing","tabSize",
  "paddingTop","paddingRight","paddingBottom","paddingLeft","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","borderStyle"]
  .forEach(k=>espejo.style[k]=cs[k]);
 /* el ancho útil del espejo debe ser el del texto (sin barra de desplazamiento) */
 espejo.style.width=(t.clientWidth+parseFloat(cs.borderLeftWidth||0)+parseFloat(cs.borderRightWidth||0))+"px";
 const L=t.value.split("\n");espejo.textContent="";
 const marcas=L.map((l,i)=>{const m=document.createElement("span");m.textContent="​";espejo.appendChild(m);
  espejo.appendChild(document.createTextNode(l+(i<L.length-1?"\n":"")));return m});
 const lh=parseFloat(cs.lineHeight)||parseFloat(cs.fontSize)*1.4;
 return {L,tops:marcas.map(m=>m.offsetTop),lh,pt:parseFloat(cs.paddingTop)||0}
}

function capa(t){
 const w=t.parentNode;if(!w)return null;
 if(getComputedStyle(w).position=="static")w.style.position="relative";
 let o=w.querySelector(":scope>.oblx");
 if(!o){o=document.createElement("div");o.className="oblx";w.appendChild(o)}
 return o
}

let ult="",ultW=0,ultS=-1;
function pinta(forzar){
 const t=document.getElementById(ID);if(!t||!t.offsetParent){return}
 const o=capa(t);if(!o)return;
 o.style.left=t.offsetLeft+"px";o.style.top=t.offsetTop+"px";o.style.width=t.offsetWidth+"px";o.style.height=t.offsetHeight+"px";
 if(!forzar&&t.value===ult&&t.clientWidth===ultW&&t.scrollTop===ultS)return;
 ult=t.value;ultW=t.clientWidth;ultS=t.scrollTop;
 const M=mide(t);const bt=parseFloat(getComputedStyle(t).borderTopWidth)||0;
 o.textContent="";
 M.L.forEach((l,i)=>{if(!l.trim())return;
  const b=document.createElement("span");b.className="oblxb";b.textContent="✕";b.dataset.i=i;
  b.setAttribute("role","button");b.setAttribute("aria-label","Eliminar esta línea");b.title="Eliminar esta línea";
  b.style.top=(bt+M.tops[i]-t.scrollTop+Math.max(0,(M.lh-24)/2))+"px";
  o.appendChild(b)})
}

function borra(i){
 const t=document.getElementById(ID);if(!t)return;
 const L=t.value.split("\n");if(i<0||i>=L.length)return;
 L.splice(i,1);
 t.value=L.join("\n").replace(/^\n+/,"");
 try{t.dispatchEvent(new Event("input",{bubbles:true}));t.dispatchEvent(new Event("change",{bubbles:true}))}catch(e){}
 pinta(true)
}

/* pointerdown con preventDefault: no se pierde el foco ni baja el teclado */
document.addEventListener("pointerdown",e=>{const b=e.target&&e.target.closest&&e.target.closest(".oblx .oblxb");if(!b)return;
 e.preventDefault();e.stopPropagation();borra(+b.dataset.i)},true);
document.addEventListener("click",e=>{if(e.target&&e.target.closest&&e.target.closest(".oblx .oblxb")){e.preventDefault();e.stopPropagation()}},true);

document.addEventListener("input",e=>{if(e.target&&e.target.id==ID)pinta(true)},true);
document.addEventListener("scroll",e=>{if(e.target&&e.target.id==ID)pinta(true)},true);
window.addEventListener("resize",()=>pinta(true));
/* cambios por código (t.value=…) y apertura del SOS */
setInterval(()=>pinta(false),250);
})();
