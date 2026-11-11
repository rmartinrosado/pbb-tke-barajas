/* ===== v403: botón «Atrás» (flecha) debajo del botón flotante «+».
   Un toque deshace lo último que se abrió, en este orden:
   1) el menú del «+» si está abierto; 2) la ventana o visor de encima (PDF, guía, Check, SOS, lupa…);
   3) la hoja inferior (#sheet); 4) la pantalla anterior (Seguimiento, Registrar OT, Guía…);
   5) si no hay nada más, Inicio. En Inicio sin nada abierto el botón se oculta.
   Sigue al «+» cuando se arrastra. Los avisos que hay que contestar (llegada, cambio de turno) no se cierran desde aquí. ===== */
(function(){
 const st=document.createElement("style");st.textContent=`
#fabb{position:fixed;z-index:2147482000;width:58px;height:58px;border-radius:50%;border:0;padding:0;display:flex;align-items:center;justify-content:center;
 background:linear-gradient(135deg,#334155,#0f172a);color:#fff;box-shadow:0 6px 18px #0006,0 0 0 3px #ffffff40;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;transition:transform .12s,opacity .2s}
#fabb svg{width:30px;height:30px}#fabb:active{transform:scale(.9)}#fabb.oc{opacity:0;pointer-events:none}`;
 document.head.appendChild(st);
 const b=document.createElement("button");b.id="fabb";b.type="button";b.setAttribute("aria-label","Atrás: pantalla o acción anterior");
 b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';
 document.body.appendChild(b);
 const S=58,GAP=10;
 /* --- historial de pantallas: se apunta cada cambio de "view" --- */
 const H=[];let ult=null,volviendo=false;
 const anota=()=>{try{if(typeof view=="undefined")return;if(ult&&ult.v!==view&&!volviendo){H.push(ult);if(H.length>30)H.shift()}
  ult={v:view,f:typeof filtro!="undefined"?filtro:null,y:0}}catch(e){}};
 addEventListener("scroll",()=>{if(ult&&typeof view!="undefined"&&ult.v===view)ult.y=scrollY},{passive:true});
 try{const r0=render;render=function(){const x=r0.apply(this,arguments);anota();return x};}catch(e){}
 anota();
 /* --- ventanas superpuestas --- */
 const NO=new Set(["fab","fabm","fabv","fabb","login","lock","splash","navbg","navtab","nvBar","sheet"]);
 const AVISO=new Set(["llegAl","tcAl"]);
 const visible=el=>{const cs=getComputedStyle(el);if(cs.position!="fixed"||cs.display=="none"||cs.visibility=="hidden"||+cs.opacity==0)return false;
  const r=el.getBoundingClientRect();return r.width>=innerWidth*.8&&r.height>=innerHeight*.5};
 const capaArriba=()=>{let top=null,zt=-1;for(const el of document.body.children){if(NO.has(el.id)||el.tagName=="SCRIPT"||el.tagName=="STYLE")continue;
   if(!visible(el))continue;const z=parseInt(getComputedStyle(el).zIndex)||0;if(z>=zt){zt=z;top=el}}return top};
 const sheetAbierta=()=>{const s=document.getElementById("sheet");return s&&s.style.display=="flex"};
 const BORRA=/borrar|quitar|eliminar|papelera/i;
 const botonCerrar=c=>{const bs=[...c.querySelectorAll("button")].filter(x=>!BORRA.test((x.getAttribute("aria-label")||"")+" "+(x.title||"")));
  const t=x=>(x.textContent||"").trim();
  return bs.find(x=>/cerrar|volver|atr[aá]s/i.test(t(x)+" "+(x.getAttribute("aria-label")||"")))
   ||bs.find(x=>/closeSheet|[cC]ierra|cerrar|close|\.remove\(\)/.test(x.getAttribute("onclick")||""))
   ||bs.find(x=>/^(✕|×|←|‹)$/.test(t(x)))};
 const fabMenu=()=>{const m=document.getElementById("fabm");return m&&m.classList.contains("on")?m:null};
 const hayAlgo=()=>{try{if(fabMenu()||sheetAbierta()||capaArriba())return true;return H.length>0||(typeof view!="undefined"&&view!="dash")}catch(e){return false}};
 const atras=()=>{try{
  const m=fabMenu();if(m){const v=document.getElementById("fabv");if(v)v.click();return}
  const c=capaArriba();
  if(c&&(!sheetAbierta()||(parseInt(getComputedStyle(c).zIndex)||0)>9)){
   if(AVISO.has(c.id)){if(typeof msg=="function")msg("Contesta primero al aviso");return}
   const x=botonCerrar(c);if(x)x.click();else c.remove();return}
  if(sheetAbierta()){if(typeof closeSheet=="function")closeSheet();return}
  const p=H.pop()||(view!="dash"?{v:"dash",f:null,y:0}:null);if(!p)return;
  volviendo=true;try{if(p.f!=null&&typeof filtro!="undefined")filtro=p.f;go(p.v)}finally{volviendo=false}
  ult={v:view,f:p.f,y:p.y};if(p.y)requestAnimationFrame(()=>scrollTo(0,p.y));
 }catch(e){try{go("dash")}catch(x){}}};
 b.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();atras()});
 ["pointerdown","touchstart","touchend","dblclick"].forEach(t=>b.addEventListener(t,e=>e.stopPropagation(),{passive:true}));
 /* --- posición (debajo del «+») y visibilidad --- */
 const coloca=()=>{const f=document.getElementById("fab");let x,y;
  if(f&&f.style.left){x=parseFloat(f.style.left);y=parseFloat(f.style.top)+S+GAP}else{x=innerWidth-S-14;y=innerHeight-S-110+S+GAP}
  y=Math.min(innerHeight-S-8,y);const L=x+"px",T=y+"px";if(b.style.left!==L)b.style.left=L;if(b.style.top!==T)b.style.top=T};
 const oculto=()=>{try{if(typeof user=="undefined"||!user)return true;if(document.getElementById("splash"))return true;
  const l=document.getElementById("lock");if(l&&l.style.display!="none"&&l.style.display!="")return true;
  const lg=document.getElementById("login");if(lg&&getComputedStyle(lg).display!="none")return true;
  return !hayAlgo()}catch(e){return false}};
 setInterval(()=>{coloca();const o=oculto();if(b.classList.contains("oc")!==o)b.classList.toggle("oc",o)},500);coloca();/* v418: cada 0,5 s y sin tocar nada si no cambia */
})();
