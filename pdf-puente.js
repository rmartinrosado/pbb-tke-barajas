/* ===== v855: PDF de la IA (SOS y Resolución IA) · página con la IMAGEN del PUENTE PROVISIONAL, antes de la página del croquis =====
   Toma los croquis de puente que la pantalla está mostrando (cajas «Croquis del puente provisional», .gcroq .gcri svg.pzk),
   los pasa a imagen en colores claros para papel (sin animaciones: cable y punteras quietos y visibles) y los incrusta
   a todo el ancho, uno debajo de otro. Si no hay croquis de puente, no se añade nada. ===== */
(function(){
"use strict";
/* paleta clara de impresión (misma que el modo claro de puente-croquis.js) */
const PAL={"--pk-bg":"#f4f5f7","--pk-mod":"#e3e6ea","--pk-mod2":"#cfd4db","--pk-bd":"#6b7280","--pk-tx":"#0b0d12","--pk-mu":"#4b5563","--pk-hi":"#c98a00","--pk-w":"#d11a10","--pk-led":"#15a34a","--pk-cu":"#b0743a"};
const CSS=`.pzk{font-family:Menlo,Consolas,monospace}text{fill:var(--pk-tx)}.mu{fill:var(--pk-mu)}.hi{fill:var(--pk-hi)}
.wire{fill:none;stroke:var(--pk-w);stroke-width:6;stroke-linecap:round;stroke-linejoin:round}.wire2{fill:none;stroke:#00000055;stroke-width:9;stroke-linecap:round}
.ring{fill:none;stroke:var(--pk-hi);stroke-width:2.5;stroke-dasharray:6 5}
.pdesa{stroke:#e53935;stroke-width:4;fill:none;stroke-linecap:round;stroke-linejoin:round}.pdesr{fill:#e53935}.pdest{fill:#fff!important;font-size:12px;font-weight:900}`;
const resuelve=t=>t.replace(/var\((--pk-[a-z0-9]+)\)/g,(m,k)=>PAL[k]||"#888");
/* croquis de puente visibles en pantalla (sin repetir) */
function lista(){const vis=s=>s.getClientRects().length>0;let L=[...document.querySelectorAll(".gcroq .gcri svg.pzk")];
 const V=L.filter(vis);if(V.length)L=V;const out=[],ya=new Set();
 L.forEach(s=>{const h=s.outerHTML;if(!ya.has(h)){ya.add(h);out.push(s)}});return out}
/* SVG → PNG (canvas) en colores de papel */
function aPng(svg){return new Promise(res=>{try{
 const vb=(svg.getAttribute("viewBox")||"0 0 400 300").split(/[\s,]+/).map(Number);const w=vb[2]||400,h=vb[3]||300;
 const cl=svg.cloneNode(true);cl.setAttribute("xmlns","http://www.w3.org/2000/svg");cl.setAttribute("width",w);cl.setAttribute("height",h);
 cl.querySelectorAll(".led").forEach(e=>e.classList.remove("led"));
 let x=new XMLSerializer().serializeToString(cl);
 x=x.replace(/(<svg[^>]*>)/,`$1<style>${CSS}</style><rect x="${vb[0]||0}" y="${vb[1]||0}" width="${w}" height="${h}" fill="${PAL["--pk-bg"]}"/>`);
 x=resuelve(x);
 const im=new Image(),K=3;const fin=v=>res(v);
 im.onload=()=>{try{const c=document.createElement("canvas");c.width=w*K;c.height=h*K;const g=c.getContext("2d");g.fillStyle="#ffffff";g.fillRect(0,0,c.width,c.height);
  g.drawImage(im,0,0,c.width,c.height);fin({u:c.toDataURL("image/jpeg",.9),w,h})}catch(e){fin(null)}};
 im.onerror=()=>fin(null);im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(x);setTimeout(()=>fin(null),4000)}catch(e){res(null)}})}
/* página(s) del puente provisional en el PDF */
window.pdfPuentes=async function(d,o){const {cab,W,H,M,PR,AC,GR,fnt,pS}=o;const S=lista();if(!S.length)return;
 const I=(await Promise.all(S.map(aPng))).filter(Boolean);if(!I.length)return;
 const AN=W-2*M,TOP=24,BOT=H-16;let y=0;
 const pag=c=>{d.addPage();cab();y=TOP;fnt(1,0,13);d.setTextColor(...PR);d.text(pS(c?"Puente provisional (continuación)":"Puente provisional · croquis según planos"),M,y+2);y+=5;
  d.setDrawColor(...AC);d.setLineWidth(.6);d.line(M,y,M+60,y);y+=4;
  if(!c){fnt(0,0,8.5);d.setTextColor(...GR);d.splitTextToSize(pS("Solo para sacar la PBB a zona segura: selector en MANUAL, compañero vigilando y aviso a CGA. Anotarlo en la OT y quitar el puente al terminar."),AN).forEach(l=>{d.text(l,M,y);y+=3.8});y+=2}
  d.setTextColor(0,0,0)};
 pag(0);
 I.forEach((m,k)=>{let w=AN,h=w*m.h/m.w;const max=BOT-TOP-14;if(h>max){h=max;w=h*m.w/m.h}
  if(y+h>BOT)pag(1);d.addImage(m.u,"JPEG",M+(AN-w)/2,y,w,h);d.setDrawColor(200,200,200);d.setLineWidth(.2);d.rect(M+(AN-w)/2,y,w,h);y+=h+5});
};
})();
