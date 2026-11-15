/* ===== v487: foto del PLC también desde la FOTOTECA del iPhone (15/11/2026)
   Igual que la foto del SOS (v456): en iOS el selector de fotos fallaba con el input oculto (atributo hidden = display:none),
   con fotos HEIC / de iCloud y al elegir dos veces la misma foto.
   · Los selectores de foto (Foto PLC, Fototeca, foto de la OT en Seguimiento) ya no van con display:none.
   · El botón «Archivo» pasa a «Fototeca».
   · La foto se lee con createImageBitmap (vale para HEIC) y, si falla, con <img>; se reduce a 1600 px en JPEG.
   · El input se vacía tras elegir, para poder volver a elegir la misma foto. ===== */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`input.pfin{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;overflow:hidden!important;pointer-events:none;left:0;top:0}`;document.head.appendChild(st);
/* lectura robusta de la foto */
const leer=f=>new Promise((ok,ko)=>{let hecho=false;const fin=(v,e)=>{if(hecho)return;hecho=true;v?ok(v):ko(e||new Error("foto"))};setTimeout(()=>fin(null,new Error("tiempo")),20000);
 const pinta=(src,w,h)=>{try{const k=Math.min(1,1600/Math.max(w,h));const c=document.createElement("canvas");c.width=Math.round(w*k);c.height=Math.round(h*k);
  c.getContext("2d").drawImage(src,0,0,c.width,c.height);fin(c.toDataURL("image/jpeg",.7))}catch(e){fin(null,e)}};
 const porImg=()=>{const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{pinta(im,im.naturalWidth,im.naturalHeight);URL.revokeObjectURL(u)};im.onerror=e=>{URL.revokeObjectURL(u);fin(null,e)};im.src=u};
 if(typeof createImageBitmap=="function")createImageBitmap(f).then(bm=>pinta(bm,bm.width,bm.height),porImg);else porImg()});
try{gComprime=async function(f){return await leer(f)};window.gComprime=gComprime}catch(e){}
/* vaciar el input después de elegir (misma foto dos veces) */
["gFotoSel","gFotoOTSel"].forEach(n=>{try{const o=window[n]||eval(n);if(typeof o!="function"||o.__pf)return;
 const g=async function(inp){try{return await o.apply(this,arguments)}catch(e){msg("No se pudo abrir la foto. Si está en iCloud, ábrela antes en Fotos o haz una captura de pantalla y elígela.")}finally{try{inp.value=""}catch(e){}}};g.__pf=1;
 window[n]=g;try{eval(n+"=g")}catch(e){}}catch(e){}});
/* inputs de foto sin display:none, «Archivo» → «Fototeca» */
const arregla=()=>{document.querySelectorAll('input[type=file][hidden]').forEach(i=>{if(!/image/.test(i.accept||""))return;i.removeAttribute("hidden");i.classList.add("pfin");if(i.parentElement)i.parentElement.style.position="relative";
  const lb=i.closest("label");if(lb&&!i.hasAttribute("capture")){[...lb.childNodes].forEach(n=>{if(n.nodeType==3&&/\bArchivo\b/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/\bArchivo\b/,"Fototeca")})}})};
let tm=null;new MutationObserver(()=>{if(!tm)tm=setTimeout(()=>{tm=null;arregla()},150)}).observe(document.documentElement,{childList:true,subtree:true});arregla();
})();
