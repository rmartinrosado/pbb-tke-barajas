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
/* v858: imágenes de los puentes con sus rótulos (para la banda de la hoja del croquis) */
window.pdfPuentesImg=async function(){const S=lista();if(!S.length)return[];
 const I=await Promise.all(S.map(async s=>{const m=await aPng(s);if(!m)return null;const T=[...s.querySelectorAll("text")];
  m.lab=(T[0]&&T[0].textContent||s.getAttribute("aria-label")||"").trim();m.sub=(T[1]&&T[1].textContent||"").trim();
  const u=T[T.length-1];m.led=u?[...u.querySelectorAll("tspan")].map(z=>z.textContent.trim()).join(" ")||u.textContent.trim():"";return m}));
 return I.filter(Boolean)};
/* v858: banda del puente provisional en la MISMA hoja que el croquis de conexión · dibujo a la CUARTA PARTE del tamaño
   (antes: a todo el alto útil de la página) y, a su derecha, qué puente es y qué hay que ver */
window.pdfBandaPuentes=function(d,I,o,y){const {W,H,M,PR,AC,GR,fnt,pS}=o;if(!I||!I.length)return y;const AN=W-2*M,MAXH=H-16-24-14;
 const tam=m=>{let w=AN,h=w*m.h/m.w;if(h>MAXH){h=MAXH;w=h*m.w/m.h}return{w:w/4,h:h/4}};
 fnt(1,0,9);d.setTextColor(...AC);d.text(pS("PUENTE PROVISIONAL · solo para sacar la PBB a zona segura"),M,y+1.5);d.setTextColor(0,0,0);y+=4;
 const top=y;let x=M,hMax=0;const N=Math.min(I.length,3);
 for(let k=0;k<N;k++){const m=I[k],t=tam(m);d.addImage(m.u,"JPEG",x,y,t.w,t.h);d.setDrawColor(200,200,200);d.setLineWidth(.2);d.rect(x,y,t.w,t.h);x+=t.w+3;hMax=Math.max(hMax,t.h)}
 /* texto a la derecha de los dibujos */
 const tx=x+1,tw=W-M-tx;let ty=top+3;
 if(tw>40){I.slice(0,N).forEach((m,k)=>{fnt(1,0,8.5);d.setTextColor(...PR);d.splitTextToSize(pS((N>1?(k+1)+". ":"")+m.lab),tw).forEach(l=>{d.text(l,tx,ty);ty+=3.8});
   fnt(0,0,7.8);d.setTextColor(0,0,0);[m.sub,m.led].filter(Boolean).forEach(z=>d.splitTextToSize(pS(z),tw).forEach(l=>{d.text(l,tx,ty);ty+=3.4}));ty+=2});
  fnt(0,0,7.3);d.setTextColor(...GR);d.splitTextToSize(pS("Selector en MANUAL, compañero vigilando y aviso a CGA. Anotarlo en la OT y quitar el puente al terminar."),tw).forEach(l=>{d.text(l,tx,ty);ty+=3.2});d.setTextColor(0,0,0)}
 y=Math.max(top+hMax,ty)+3;d.setDrawColor(200,200,200);d.setLineWidth(.3);d.line(M,y,W-M,y);return y+5};
/* sin croquis de conexión: hoja propia solo con la banda del puente */
window.pdfPuentes=async function(d,o,I){I=I||await window.pdfPuentesImg();if(!I.length)return;const {cab,W,M,PR,fnt,pS}=o;
 d.addPage();cab();let y=24;d.setFillColor(...PR);d.roundedRect(M,y-5,W-2*M,8,1.5,1.5,"F");fnt(1,0,11);d.setTextColor(255,255,255);d.text(pS("Puente provisional · croquis según planos"),M+3,y);d.setTextColor(0,0,0);
 window.pdfBandaPuentes(d,I,o,y+6)};
})();
