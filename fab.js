/* ===== v402: botón flotante «+» que se puede arrastrar por la pantalla.
   Toque → menú rápido: «OT nueva» (Registrar OT) o «Alarma Sigma» (ventana de Sigmas).
   Arrastrar → se mueve y se queda donde se suelta (posición guardada en el móvil, pegada al borde más cercano).
   Se oculta con ventanas abiertas, en la pantalla de identificación y en Registrar OT. ===== */
(function(){
 const K="pbb_fab";
 const st=document.createElement("style");st.textContent=`
#fab{position:fixed;z-index:60;width:58px;height:58px;border-radius:50%;border:0;padding:0;display:flex;align-items:center;justify-content:center;
 background:linear-gradient(135deg,#7c3aed,#ea580c);color:#fff;box-shadow:0 6px 18px #0006,0 0 0 3px #ffffff40;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;cursor:grab;transition:transform .15s,opacity .2s}
#fab svg{width:30px;height:30px;transition:transform .2s}#fab.ab svg{transform:rotate(45deg)}#fab.mv{transform:scale(1.12);cursor:grabbing;box-shadow:0 10px 26px #0008}
#fab.oc{opacity:0;pointer-events:none}
#fabm{position:fixed;z-index:61;display:none;flex-direction:column;gap:8px}#fabm.on{display:flex}
#fabm button{display:flex;align-items:center;gap:10px;padding:11px 16px;border:0;border-radius:12px;font:inherit;font-weight:800;font-size:14px;letter-spacing:.5px;text-transform:uppercase;color:#fff;box-shadow:0 4px 14px #0005;white-space:nowrap}
#fabm .fo{background:#ea580c}#fabm .fs{background:#7c3aed}#fabm svg{width:20px;height:20px;flex:none}
#fabv{position:fixed;inset:0;z-index:59;display:none}#fabv.on{display:block}`;
 document.head.appendChild(st);
 const PLUS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
 const IOT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M12 10v6M9 13h6"/></svg>';
 const IBELL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';
 const f=document.createElement("button");f.id="fab";f.type="button";f.setAttribute("aria-label","Registrar OT nueva o alarma Sigma");f.innerHTML=PLUS;
 const m=document.createElement("div");m.id="fabm";m.innerHTML=`<button type="button" class="fo" data-a="ot">${IOT}OT nueva</button><button type="button" class="fs" data-a="sg">${IBELL}Alarma Sigma</button>`;
 const v=document.createElement("div");v.id="fabv";
 document.body.append(v,m,f);
 const S=58,MG=10;
 const lim=(x,y)=>{const W=innerWidth,H=innerHeight;return[Math.max(MG,Math.min(W-S-MG,x)),Math.max(MG+40,Math.min(H-S-MG-70,y))]};
 const pon=(x,y)=>{[x,y]=lim(x,y);f.style.left=x+"px";f.style.top=y+"px";return[x,y]};
 let pos=null;try{pos=JSON.parse(localStorage.getItem(K)||"null")}catch(e){}
 const inicial=()=>{if(pos&&isFinite(pos.x)&&isFinite(pos.y))pon(pos.x*innerWidth,pos.y*innerHeight);else pon(innerWidth-S-14,innerHeight-S-110)};inicial();
 addEventListener("resize",()=>{const r=f.getBoundingClientRect();pon(r.left,r.top)});
 const cierra=()=>{m.classList.remove("on");v.classList.remove("on");f.classList.remove("ab")};
 const abre=()=>{const r=f.getBoundingClientRect();m.classList.add("on");v.classList.add("on");f.classList.add("ab");
  const mw=m.offsetWidth,mh=m.offsetHeight;let x=r.left+S/2>innerWidth/2?r.right-mw:r.left;let y=r.top-mh-10;if(y<50)y=r.bottom+10;
  m.style.left=Math.max(8,Math.min(innerWidth-mw-8,x))+"px";m.style.top=y+"px"};
 v.addEventListener("click",cierra);
 m.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;cierra();
  if(b.dataset.a=="ot"){try{go("new")}catch(x){}}
  else{try{if(typeof sigAbre=="function")sigAbre()}catch(x){}}});
 /* arrastre con puntero (dedo o ratón); si se mueve menos de 8 px es un toque */
 let d=null;
 f.addEventListener("pointerdown",e=>{d={id:e.pointerId,x0:e.clientX,y0:e.clientY,l:f.getBoundingClientRect().left,t:f.getBoundingClientRect().top,mv:false};try{f.setPointerCapture(e.pointerId)}catch(x){}});
 f.addEventListener("pointermove",e=>{if(!d||e.pointerId!==d.id)return;const dx=e.clientX-d.x0,dy=e.clientY-d.y0;
  if(!d.mv&&Math.hypot(dx,dy)>8){d.mv=true;f.classList.add("mv");cierra()}
  if(d.mv){e.preventDefault();pon(d.l+dx,d.t+dy)}});
 const fin=e=>{if(!d)return;const fue=d.mv;d=null;f.classList.remove("mv");
  if(fue){const r=f.getBoundingClientRect();const x=r.left+S/2<innerWidth/2?MG:innerWidth-S-MG; /* se pega al borde más cercano */
   const [px,py]=pon(x,r.top);try{localStorage.setItem(K,JSON.stringify({x:px/innerWidth,y:py/innerHeight}))}catch(x){}}
  else{m.classList.contains("on")?cierra():abre()}};
 f.addEventListener("pointerup",fin);f.addEventListener("pointercancel",()=>{if(d&&d.mv)fin();d=null;f.classList.remove("mv")});
 f.addEventListener("click",e=>e.preventDefault());
 /* visibilidad */
 const oculto=()=>{try{if(typeof user=="undefined"||!user)return true;const l=document.getElementById("lock");if(l&&l.style.display!="none"&&l.style.display!="")return true;
  const sh=document.getElementById("sheet");if(sh&&sh.style.display=="flex")return true;if(document.getElementById("splash"))return true;
  if(typeof view!="undefined"&&view=="new")return true;return false}catch(e){return false}};
 setInterval(()=>{const o=oculto();if(f.classList.contains("oc")!==o)f.classList.toggle("oc",o);if(o)cierra()},500);
})();
