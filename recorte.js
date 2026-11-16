/* ===== v535: RECORTE DE FOTOS DE COMPONENTES (16/11/2026) =====
   El elemento independiente se guarda RECORTADO: sin componentes vecinos a medias ni cables alrededor.
   · compRecorta(src, caja?) → Promise<{src, caja}|null>: pantalla completa con la foto y un marco naranja que se mueve
     arrastrando dentro y se ajusta con las 4 esquinas. caja = {x0,y0,x1,y1} en fracción (0-1) de la foto.
   · compCortaCaja(src, caja, max) → Promise<dataURL>: recorte directo (lo usa el recorte automático de la IA).
   · compMarcaCaja(src, caja) → Promise<dataURL>: foto de UBICACIÓN del bloque con el elemento enmarcado en naranja. ===== */
(function(){
"use strict";
const carga=src=>new Promise((ok,ko)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>ko(new Error("No se pudo abrir la foto"));im.src=src});
const lim=c=>{let {x0,y0,x1,y1}=c;x0=Math.max(0,Math.min(1,x0));x1=Math.max(0,Math.min(1,x1));y0=Math.max(0,Math.min(1,y0));y1=Math.max(0,Math.min(1,y1));
 if(x1<x0)[x0,x1]=[x1,x0];if(y1<y0)[y0,y1]=[y1,y0];return{x0,y0,x1,y1}};
window.compCortaCaja=async function(src,caja,max){const im=await carga(src);const c=lim(caja);const W=im.naturalWidth,H=im.naturalHeight;
 const sx=Math.round(c.x0*W),sy=Math.round(c.y0*H),sw=Math.max(8,Math.round((c.x1-c.x0)*W)),sh=Math.max(8,Math.round((c.y1-c.y0)*H));
 const k=Math.min(1,(max||1400)/Math.max(sw,sh));const cv=document.createElement("canvas");cv.width=Math.round(sw*k);cv.height=Math.round(sh*k);
 const x=cv.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,cv.width,cv.height);x.drawImage(im,sx,sy,sw,sh,0,0,cv.width,cv.height);return cv.toDataURL("image/jpeg",.86)};
window.compMarcaCaja=async function(src,caja,max){const im=await carga(src);const c=lim(caja);const k=Math.min(1,(max||1000)/Math.max(im.naturalWidth,im.naturalHeight));
 const cv=document.createElement("canvas");cv.width=Math.round(im.naturalWidth*k);cv.height=Math.round(im.naturalHeight*k);const x=cv.getContext("2d");
 x.drawImage(im,0,0,cv.width,cv.height);const r=[c.x0*cv.width,c.y0*cv.height,(c.x1-c.x0)*cv.width,(c.y1-c.y0)*cv.height];
 x.fillStyle="rgba(0,0,0,.38)";x.beginPath();x.rect(0,0,cv.width,cv.height);x.rect(r[0],r[1],r[2],r[3]);x.fill("evenodd");
 x.lineWidth=Math.max(3,cv.width/180);x.strokeStyle="#ff7a00";x.strokeRect(r[0],r[1],r[2],r[3]);return cv.toDataURL("image/jpeg",.84)};

window.compRecorta=function(src,caja){return new Promise(res=>{
 let c=lim(caja||{x0:.15,y0:.15,x1:.85,y1:.85});
 const o=document.createElement("div");o.id="recCapa";
 o.innerHTML=`<div class="rech"><b>✂️ Recortar el componente</b><small>Deja SOLO el elemento: sin vecinos a medias ni cables alrededor. Borneros: la etiqueta (portaetiquetas) dentro, a la IZQUIERDA</small></div>
 <div class="recz"><div class="recw"><img alt=""><div class="recm"><i data-h="nw"></i><i data-h="ne"></i><i data-h="sw"></i><i data-h="se"></i><u data-h="n"></u><u data-h="s"></u><u data-h="w"></u><u data-h="e"></u></div></div><canvas class="recl" width="150" height="150"></canvas></div>
 <div class="recb"><button type="button" class="sec" data-a="no">Cancelar</button><button type="button" class="sec" data-a="todo">Toda la foto</button><button type="button" class="pri" data-a="ok">✂️ Aplicar</button></div>`;
 ["click","dblclick","touchend","pointerdown"].forEach(t=>o.addEventListener(t,e=>e.stopPropagation()));
 document.body.appendChild(o);const im=o.querySelector("img"),w=o.querySelector(".recw"),m=o.querySelector(".recm");
 const pinta=()=>{m.style.left=c.x0*100+"%";m.style.top=c.y0*100+"%";m.style.width=(c.x1-c.x0)*100+"%";m.style.height=(c.y1-c.y0)*100+"%"};
 im.onload=pinta;im.src=src;pinta();
 let drag=null;
 m.addEventListener("pointerdown",e=>{e.preventDefault();const r=w.getBoundingClientRect();drag={h:(e.target.dataset&&e.target.dataset.h)||"mv",x:e.clientX,y:e.clientY,c:Object.assign({},c),W:r.width,H:r.height};try{m.setPointerCapture(e.pointerId)}catch(x){}});
 /* v545: lupa 3× de la zona que se ajusta (precisión al tacto) */
 const lu=o.querySelector(".recl"),lx=lu.getContext("2d"),z=o.querySelector(".recz");
 const lupa=(px,py,fx,fy)=>{if(!im.naturalWidth)return;const Z=3,R=75,W=im.naturalWidth,H=im.naturalHeight,r=w.getBoundingClientRect(),k=W/r.width;
  lx.save();lx.clearRect(0,0,150,150);lx.beginPath();lx.arc(R,R,R-2,0,7);lx.clip();lx.fillStyle="#000";lx.fillRect(0,0,150,150);
  const sw=150/Z*k,sx=fx*W-sw/2,sy=fy*H-sw/2;lx.drawImage(im,sx,sy,sw,sw,0,0,150,150);
  /* bordes del marco dentro de la lupa */
  lx.strokeStyle="#ff7a00";lx.lineWidth=2;const X=v=>(v*W-sx)/sw*150,Y=v=>(v*H-sy)/sw*150;lx.strokeRect(X(c.x0),Y(c.y0),X(c.x1)-X(c.x0),Y(c.y1)-Y(c.y0));
  lx.strokeStyle="rgba(255,255,255,.8)";lx.lineWidth=1;lx.beginPath();lx.moveTo(R,R-10);lx.lineTo(R,R+10);lx.moveTo(R-10,R);lx.lineTo(R+10,R);lx.stroke();lx.restore();
  lx.beginPath();lx.arc(R,R,R-2,0,7);lx.strokeStyle="#ff7a00";lx.lineWidth=3;lx.stroke();
  const zr=z.getBoundingClientRect();let L=px-zr.left-75,T=py-zr.top-190;if(T<0)T=py-zr.top+40;L=Math.max(0,Math.min(zr.width-150,L));lu.style.left=L+"px";lu.style.top=T+"px";lu.style.display="block"};
 m.addEventListener("pointermove",e=>{if(!drag)return;e.preventDefault();const dx=(e.clientX-drag.x)/drag.W,dy=(e.clientY-drag.y)/drag.H,s=drag.c,MIN=.05;let n=Object.assign({},s);
  if(drag.h=="mv"){const ww=s.x1-s.x0,hh=s.y1-s.y0;n.x0=Math.max(0,Math.min(1-ww,s.x0+dx));n.y0=Math.max(0,Math.min(1-hh,s.y0+dy));n.x1=n.x0+ww;n.y1=n.y0+hh}
  else{if(/w/.test(drag.h))n.x0=Math.max(0,Math.min(s.x1-MIN,s.x0+dx));if(/e/.test(drag.h))n.x1=Math.min(1,Math.max(s.x0+MIN,s.x1+dx));
   if(/n/.test(drag.h))n.y0=Math.max(0,Math.min(s.y1-MIN,s.y0+dy));if(/s/.test(drag.h))n.y1=Math.min(1,Math.max(s.y0+MIN,s.y1+dy))}
  c=n;pinta();if(drag.h!="mv"){const fx=/w/.test(drag.h)?c.x0:/e/.test(drag.h)?c.x1:(c.x0+c.x1)/2,fy=/n/.test(drag.h)?c.y0:/s/.test(drag.h)?c.y1:(c.y0+c.y1)/2;lupa(e.clientX,e.clientY,fx,fy)}});
 const fin=()=>{drag=null;lu.style.display="none"};m.addEventListener("pointerup",fin);m.addEventListener("pointercancel",fin);
 o.querySelector(".recb").addEventListener("click",async e=>{const a=e.target.closest("button");if(!a)return;const ac=a.dataset.a;
  if(ac=="todo"){c={x0:0,y0:0,x1:1,y1:1};pinta();return}
  if(ac=="no"){o.remove();res(null);return}
  a.disabled=true;try{const s=await compCortaCaja(src,c,1400);o.remove();res({src:s,caja:c})}catch(x){o.remove();res(null)}});
});};
const st=document.createElement("style");st.textContent=`
#recCapa{position:fixed;inset:0;z-index:100002;background:#0b0d10;color:#fff;display:flex;flex-direction:column;padding:max(10px,env(safe-area-inset-top)) 10px calc(10px + env(safe-area-inset-bottom,0px))}
#recCapa .rech{display:flex;flex-direction:column;padding:2px 2px 8px}#recCapa .rech b{font-size:17px}#recCapa .rech small{font-size:12px;opacity:.75}
#recCapa .recz{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
#recCapa .recw{position:relative;display:inline-block;max-width:100%;max-height:100%;line-height:0;touch-action:none;user-select:none;-webkit-user-select:none}
#recCapa .recw img{max-width:100%;max-height:calc(100dvh - 150px);display:block;pointer-events:none}
#recCapa .recm{position:absolute;border:2.5px solid #ff7a00;box-shadow:0 0 0 9999px rgba(0,0,0,.55);touch-action:none;cursor:move}
#recCapa .recz{position:relative}
#recCapa .recm i{position:absolute;width:34px;height:34px;border:4px solid #ff7a00;background:rgba(255,122,0,.15);z-index:2}
#recCapa .recm i::after{content:"";position:absolute;inset:-14px}
#recCapa .recm u{position:absolute;z-index:1;text-decoration:none}
#recCapa .recm u::before{content:"";position:absolute;background:#ff7a00;border-radius:3px}
#recCapa .recm u[data-h=n],#recCapa .recm u[data-h=s]{left:30px;right:30px;height:30px}#recCapa .recm u[data-h=n]{top:-15px}#recCapa .recm u[data-h=s]{bottom:-15px}
#recCapa .recm u[data-h=n]::before,#recCapa .recm u[data-h=s]::before{left:50%;top:50%;width:36px;height:6px;margin:-3px 0 0 -18px}
#recCapa .recm u[data-h=w],#recCapa .recm u[data-h=e]{top:30px;bottom:30px;width:30px}#recCapa .recm u[data-h=w]{left:-15px}#recCapa .recm u[data-h=e]{right:-15px}
#recCapa .recm u[data-h=w]::before,#recCapa .recm u[data-h=e]::before{top:50%;left:50%;width:6px;height:36px;margin:-18px 0 0 -3px}
#recCapa .recl{position:absolute;display:none;width:150px;height:150px;border-radius:50%;pointer-events:none;z-index:5;box-shadow:0 4px 16px rgba(0,0,0,.6)}
#recCapa .recm i[data-h=nw]{left:-10px;top:-10px;border-right:0;border-bottom:0}#recCapa .recm i[data-h=ne]{right:-10px;top:-10px;border-left:0;border-bottom:0}
#recCapa .recm i[data-h=sw]{left:-10px;bottom:-10px;border-right:0;border-top:0}#recCapa .recm i[data-h=se]{right:-10px;bottom:-10px;border-left:0;border-top:0}
#recCapa .recb{display:flex;gap:8px;padding-top:10px}#recCapa .recb button{flex:1;margin:0!important;width:auto!important;padding:12px 6px!important;font-size:14px!important}
#recCapa .recb .sec{color:#fff;border-color:#555}`;
document.head.appendChild(st);
})();
