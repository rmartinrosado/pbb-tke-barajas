/* ===== v499: Inicio sin tembleque al registrar OT y al aparecer en el Panel de control (16/11/2026) =====
   Causas encontradas:
   1) Tras guardar una OT, Supabase la devuelve con las claves en otro orden (jsonb las reordena) y en otro orden de lista;
      el control de «sin cambios» (v152) comparaba el texto tal cual, veía diferencia y repintaba Inicio entero 1-3 veces
      seguidas (guardado + avisos en tiempo real). Ahora la comparación ignora el orden de claves y de OT: solo se repinta
      si cambia de verdad algún dato.
   2) La caja de fichas (#otsc) se coloca a la altura del borde inferior del panel fijo (#pfix), pero se calculaba ANTES de
      que el panel terminara de tomar su forma final (estilo TKE, panel compacto, subtítulos) y el vigía de tamaño seguía
      mirando el panel viejo hasta 0,3 s después: las fichas saltaban arriba y abajo. Ahora se recoloca en el mismo
      instante del repintado y en cada fotograma durante el primer medio segundo, y el vigía pasa al panel nuevo al momento. ===== */
(function(){
"use strict";
/* ---------- 1) comparación estable de las OT ---------- */
const canon=v=>{if(Array.isArray(v))return"["+v.map(canon).join(",")+"]";
 if(v&&typeof v=="object")return"{"+Object.keys(v).filter(k=>v[k]!==undefined).sort().map(k=>JSON.stringify(k)+":"+canon(v[k])).join(",")+"}";
 return JSON.stringify(v===undefined?null:v)};
const tur=()=>{const d=new Date(),h=d.getHours();return d.toDateString()+(h<7?"N":h<15?"M":h<23?"T":"N")};
const firma=()=>{try{const L=(Array.isArray(inc)?inc.slice():[]).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
 return canon(L)+"|"+view+"|"+(typeof tecnico!="undefined"&&tecnico)+"|"+(typeof admin!="undefined"&&admin)+"|"+tur()}catch(e){return Math.random()+""}};
let ult=null;
/* ---------- 2) caja de fichas pegada al panel ---------- */
const coloca=()=>{const f=document.getElementById("pfix"),w=document.getElementById("otsc");if(!f||!w||w.style.position!="fixed")return;
 const r=f.getBoundingClientRect();const T=Math.round(r.bottom)+"px",L=Math.round(r.left)+"px",W=Math.round(r.width)+"px";
 if(w.style.top!==T)w.style.top=T;if(w.style.left!==L)w.style.left=L;if(w.style.width!==W)w.style.width=W};
let raf=0,hasta=0;const sigue=()=>{coloca();if(performance.now()<hasta)raf=requestAnimationFrame(sigue);else raf=0};
const asienta=ms=>{hasta=Math.max(hasta,performance.now()+(ms||500));if(!raf)raf=requestAnimationFrame(sigue)};
let ro=null,vis=null;try{ro=new ResizeObserver(()=>coloca())}catch(e){}
const vigila=()=>{const f=document.getElementById("pfix");if(ro&&f&&f!==vis){if(vis)ro.unobserve(vis);ro.observe(f);vis=f}};
const app=document.getElementById("app");
if(app)new MutationObserver(()=>{vigila();coloca()}).observe(app,{childList:true});
/* ---------- envoltorio de render (el más externo) ---------- */
const o=render;render=function(){const r=o.apply(this,arguments);ult=firma();
 try{if(typeof view!="undefined"&&view=="dash"){vigila();coloca();asienta(600)}}catch(e){}
 return r};
window.sinCambios=function(){return firma()===ult};
addEventListener("resize",()=>asienta(300));
})();
