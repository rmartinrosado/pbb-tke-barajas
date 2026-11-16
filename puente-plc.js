/* ===== v527: croquis del PUENTE EN EL PLC junto a cada puente provisional (16/11/2026) =====
   En las primeras actuaciones con «Si no se recupera · puente provisional», cada puente lleva debajo el dibujo del puente
   en el módulo del PLC, según el tipo de entrada:
   · Línea de seguridades pulsada por un FC (módulo amarillo safety, p. ej. E-A8, E-A9, E-A10): puente IN ↔ UT del canal.
   · Límite de trabajo (módulo verde, p. ej. E-A2, E-A3, P-A6): puente IN ↔ +24 V que libera el límite, o «soltar y aislar el hilo»
     si la entrada se activa al pisar el límite.
   · v529 (en toda la PWA): el croquis del puente en el PLC es la 1ª OPCIÓN y el de los borneros la 2ª OPCIÓN.
     Bumpers (E-A10 1.1 brazo / 2.1 cabina): 1ª el puente IN ↔ UT en E-A10; 2ª, plegado debajo, el puente en el bornero del
     pupitre P-X92.1 bumper a bumper para saber cuál de los cuatro falla. ===== */
(function(){
"use strict";
if(typeof segPuente!="function"||typeof croquisPuente!="function")return;
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sig=(mod,b)=>{try{const C=window.CABLEADO||{};for(const k in C){const e=C[k];if(e.m==mod&&e.b==b)return e.k||""}}catch(e){}return ""};
/* datos del croquis a partir del elemento [módulo, borna, borna2, elemento, nombre] */
function datos(it){const[id,a,,el,nom]=it;const M=(typeof PLC!="undefined"?PLC:[]).find(m=>m.id==id);const m=/^(\d+)\.(\d)/.exec(a||"");if(!M||!m)return null;
 const n=+m[1],c=+m[2],k=Math.ceil(n/2),d=String(nom||"").replace(/\s*\(safety\)/i,"");
 if(M.t=="SDI")return {o:{mod:id,b1:n+".1",b2:n+".2",k1:sig(id,n+".1")||("IN · "+el),k2:sig(id,n+".2")||"UT",d},tipo:"seg"};
 if(M.t=="SDO")return null;/* salidas de seguridad (E-A6 → E-K0): nunca se puentean */
 if(c!=1&&c!=4)return null;
 const l=(c==1?1:3)+(n%2?0:1),L=M.m[k-1]&&M.m[k-1][l-1];
 if(L&&L[1]==0)return {o:{mod:id,b1:a,b2:a,k1:sig(id,a)||("IN · "+el),k2:"",d,suelta:true},tipo:"nor"};
 return {o:{mod:id,b1:a,b2:n+"."+(c+1),k1:sig(id,a)||("IN · "+el),k2:"+24 V",d},tipo:"nor"}}
const bumper=it=>it&&it[0]=="E-A10"&&(it[1]=="1.1"||it[1]=="2.1");
function croq(it,et){const D=datos(it);if(!D)return "";let svg="";try{svg=croquisPuente(D.o,5)}catch(e){return ""}
 const t=D.tipo=="seg"?`Línea de seguridades pulsada por FC · módulo amarillo ${esc(D.o.mod)} · puente IN ${esc(D.o.b1)} ↔ UT ${esc(D.o.b2)}`
  :D.o.suelta?`Límite de trabajo · módulo verde ${esc(D.o.mod)} · soltar y aislar el hilo de IN ${esc(D.o.b1)}`
  :`Límite de trabajo · módulo verde ${esc(D.o.mod)} · puente IN ${esc(D.o.b1)} ↔ +24 V ${esc(D.o.b2)}`;
 return `<div class="ppl"><div class="ppt">🔌 ${(et||bumper(it))?esc(et||"1ª opción")+" · ":""}Croquis del puente en el PLC · ${t}</div>${bumper(it)?`<div class="ppn">Saca la PBB en maniobra controlada, con un compañero vigilando, pero anula los dos bumpers del grupo: no dice cuál falla (para eso, la 2ª opción).</div>`:""}<div class="ppsvg">${svg}</div></div>`}
window.puentePLCHTML=(it,et)=>{try{const x=(typeof PLC!="undefined"?PLC:[]).find(m=>m.id==it[0]);return croq(it,et)}catch(e){return ""}};
const o=segPuente;
/* 1ª opción: el croquis del puente en el PLC; 2ª opción: el puente en el bornero (bumpers) o el texto del puente */
window.segPuente=segPuente=function(it){const h=o.apply(this,arguments);if(!h)return h;try{const c=croq(it);if(!c)return h;
 if(bumper(it))return c+`<details class="ppl ppl2"><summary>🔧 2ª opción · puente en el bornero del pupitre P-X92.1, bumper a bumper (para saber cuál falla)</summary>${h}</details>`;
 return h+c}catch(e){return h}};
const st=document.createElement("style");st.textContent=`
.ppl{margin:6px 0 10px;padding:8px;border:1.5px dashed var(--pk-w,#ff3b30);border-radius:10px}
.ppl2{border-color:var(--bd,#999)}.ppl2>summary{cursor:pointer;font-weight:800;font-size:13px}
.ppt{font-weight:800;font-size:12.5px;margin:2px 2px 6px;line-height:1.3}
.ppn{font-size:12.5px;margin:6px 2px;line-height:1.35}
.ppsvg{max-width:330px;margin:0 auto}`;document.head.appendChild(st);
})();
