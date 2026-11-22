/* ===== v564: SOS · al pulsar ACEPTAR se VALIDA la alarma y sale la FICHA DEL COMPONENTE A INTERVENIR (17/11/2026) =====
   En «AVERÍA EN CAMPO - LO QUE SE DETECTA» se escribe lo que se ve; al ACEPTAR:
   1) VALIDACIÓN DE LA ALARMA (arriba del resultado): se cotejan la avería en campo y la alarma (lista Magelis o a mano)
      con el catálogo del manual RCS (rcsDetecta):
      · ✅ validada        → la alarma escrita y la avería en campo dan el mismo código (o solo hay una de las dos y da código).
      · ✅ deducida        → no se ha escrito alarma: el código sale del texto de la avería en campo.
      · ⚠️ no coincide     → la alarma y la avería dan códigos distintos: MANDA la avería en campo (v425).
      · ⚠️ no está         → la alarma escrita no es ningún código del manual.
      La foto de la Magelis solo se usa si no hay nada escrito (complementaria, v447).
   2) COMPONENTE A INTERVENIR (entre «1 · Sacar en servicio ya» y «2 · Reparar»): analizando TODO lo escrito
      (avería, alarma validada y sus componentes asociados en el catálogo) se acota el componente:
      · si queda UNO (se tiene claro) → su ficha completa desplegada (fotos, especificaciones, conexionado, medir).
      · si quedan varios → botones para elegir; al tocar uno sale su ficha.
      · si no hay → aviso y acceso al catálogo.
   (Sustituye para el SOS la regla de v474 «Componente de campo solo en la guía»: lo pidió el 17/11/2026.) ===== */
(function(){
"use strict";
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=id=>document.getElementById(id);
const val=id=>(($(id)||{}).value||"").replace(/\s+/g," ").trim();
const clave=c=>String(c.baseId||c.db||c.id);
/* número suelto de la alarma («056», «57», «R003», «AL 57») además de lo que reconoce rcsDetecta */
const porNum=t=>{const C=window.RCS_AL||[];const out=[];
 String(t||"").toUpperCase().split(/[·,;\/\n]+/).forEach(p=>{const m=p.trim().match(/^(?:AL(?:ARMA)?|ADV|AVISO|N[ºO°])?\.?\s*(R?)0*(\d{1,3})$/);if(!m)return;
  const c=m[1]?"R"+m[2].padStart(3,"0"):m[2].padStart(3,"0");const x=C.find(z=>z.c==c||(m[1]&&z.c=="R"+m[2]));if(x)out.push({x,por:"num"})});return out};
const det=t=>{try{if(!t||typeof rcsDetecta!="function")return[];const L=rcsDetecta(t),k=new Set(L.map(z=>z.x.c));return L.concat(porNum(t).filter(z=>!k.has(z.x.c)))}catch(e){return[]}};
const deAl=x=>{try{return typeof compDeAlarma=="function"?compDeAlarma(x):[]}catch(e){return[]}};
const campo=t=>{try{return t&&typeof compCampo=="function"?compCampo(t):[]}catch(e){return[]}};
const uniq=L=>{const m=new Map();L.forEach(c=>{if(c)m.set(clave(c),c)});return[...m.values()]};
const inter=(A,B)=>{const k=new Set(B.map(clave));return A.filter(c=>k.has(clave(c)))};
/* catálogo actual (incluye los incorporados): la versión editada de una ficha base sustituye a la original */
const actual=c=>{const L=window.COMP_CAMPO||[];return L.find(z=>z.baseId&&String(z.baseId)==String(c.id))||L.find(z=>clave(z)==clave(c))||c};

/* ---------- análisis ---------- */
function analiza(){
 const ob=val("sr_ob");const sa=$("sr_a");
 const al=[(sa&&sa.value?sa.options[sa.selectedIndex].text:""),val("sr_t")].map(x=>x.trim()).filter(Boolean).join(" · ");
 const foto=(!ob&&!al&&window.__sosFotoAl)||"";
 const Ld=det(ob),La=det(al),Lf=det(foto);
 const cods=L=>new Set(L.map(z=>z.x.c));
 let est,cod=[];
 if(La.length&&Ld.length){const k=cods(Ld);const com=La.filter(z=>k.has(z.x.c));
  if(com.length){est="ok";cod=com}else{est="dif";cod=Ld}}
 else if(La.length){est="ok";cod=La}
 else if(Ld.length){est=al?"noal":"ded";cod=Ld}
 else if(Lf.length){est="foto";cod=Lf}
 else est=al?"noal":"nada";
 /* componentes: los de la avería en campo mandan; los de la alarma validada acotan */
 const Cd=uniq(campo(ob)),Ca=uniq(cod.flatMap(z=>deAl(z.x))),Ct=uniq(campo([ob,al,foto].filter(Boolean).join(" ")));
 let C;
 if(Cd.length&&Ca.length){const i=inter(Cd,Ca);C=i.length?i:Cd}
 else if(Cd.length)C=Cd;
 else if(Ca.length){const i=inter(Ca,Ct);C=i.length?i:Ca}
 else C=Ct;
 C=uniq(C.map(actual));
 /* v703: borneros (-X) y módulos del PLC (E-A…/P-A…) son elementos de PASO de la señal: no son el «componente a intervenir»
    salvo que la avería o la alarma los nombre. Si solo quedaban ellos, se busca el elemento real en los planos (pendiente de incorporar). */
 const txt=[ob,al,foto].join(" ").toUpperCase().replace(/[\s+]/g,"");
 const paso=c=>/-X\d|^[EP]\d?-A\d+$/i.test(String(c.id||"").replace(/^\+/,""))&&!String(c.id||"").toUpperCase().split(/\s*[\/,]\s*/).some(k=>txt.includes(k.replace(/[\s+]/g,"")));
 const C2=C.filter(c=>!paso(c));let pend=[];
 if(!C2.length&&C.length){const P=window.COMP_PLANOS||[];const t2=nrm([ob,al,...cod.map(z=>z.x.t)].join(" "));
  const cods=new Set();[ob,al,...cod.map(z=>z.x.t)].join(" ").toUpperCase().replace(/\b([A-Z]{1,3}-[A-Z]{1,2}\d+(?:\.\d+)?)\b/g,(_,k)=>{cods.add(k)});
  pend=P.filter(r=>r&&r[0]&&!/-X\d|^[EP]-A\d+$/.test(r[0])&&(cods.has(String(r[0]).toUpperCase())||(nrm(r[1]).length>4&&t2.includes(nrm(r[1]))))).slice(0,4)}
 C=C2;
 /* alarma escrita sin código en la avería: si sus componentes no son los del elemento descrito, no coincide */
 if(est=="ok"&&ob&&!Ld.length&&Cd.length&&Ca.length&&!inter(Cd,Ca).length){est="dif";cod=[]}
 return{ob,al,est,cod,Ld,La,C,pend}}

/* ---------- pintado ---------- */
const EST={ok:["✅","ALARMA VALIDADA","La alarma coincide con el manual RCS y con la avería en campo."],
 ded:["✅","ALARMA DEDUCIDA DE LA AVERÍA EN CAMPO","No se ha escrito alarma: el código sale de lo que se detecta."],
 dif:["⚠️","LA ALARMA NO COINCIDE CON LA AVERÍA","Manda la avería en campo; revisa la alarma de la Magelis."],
 noal:["⚠️","ALARMA NO RECONOCIDA EN EL MANUAL RCS","Revisa el número o el texto de la alarma."],
 foto:["✅","ALARMA LEÍDA DE LA FOTO (complementaria)","No hay nada escrito: se toma lo leído en la Magelis."],
 nada:["ℹ️","SIN CÓDIGO DEL MANUAL RCS","Lo descrito no corresponde a ninguna alarma concreta del manual."]};
const cajaAl=z=>{try{return typeof rcsCaja=="function"?rcsCaja(z,true):`<div class="rcsb"><b>${E(z.x.c)}</b> ${E(z.x.t)}</div>`}catch(e){return""}};
function bloqueAlarma(A){const [ic,t,s]=EST[A.est];const mal=A.est=="dif"||A.est=="noal";
 let h=`<div class="svh${mal?" svmal":A.est=="nada"?" svnada":""}"><span>${ic}</span><span><b>${t}</b><small>${E(s)}</small></span></div>`;
 if(A.est=="dif")h+=`<div class="svl">Alarma indicada:</div>${A.La.map(cajaAl).join("")}<div class="svl">Según la avería en campo (manda):${A.cod.length?"":" sin código del manual; componente según lo descrito ↓"}</div>`;
 if(A.est=="noal")h+=`<div class="svl">Escrita: «${E(A.al)}»${A.cod.length?" · según la avería en campo:":""}</div>`;
 h+=A.cod.map(cajaAl).join("");
 /* componente: chip que baja a la ficha */
 if(A.C.length==1){const c=A.C[0];h+=`<button type="button" class="svchip" onclick="sosValCmp()"><span class="cmpid">${E(c.id)}</span> ${E(c.t)}<small>🔩 Componente a intervenir · ver ficha ↓</small></button>`}
 else if(A.C.length>1)h+=`<button type="button" class="svchip svvar" onclick="sosValCmp()">🔩 ${A.C.length} componentes posibles · elegir ↓</button>`;
 return`<div class="svw" id="sv_al">${h}</div>`}
const fichaH=c=>{try{return typeof compFicha=="function"?compFicha(c):""}catch(e){return""}};
function bloqueComp(A){let b;
 if(A.C.length==1)b=`<div class="svok">Acotado con la avería en campo${A.cod.length?" y la alarma "+E(A.cod.map(z=>z.x.c).join(" / ")):""}.</div>${fichaH(A.C[0])}`;
 else if(A.C.length>1)b=`<div class="svok">No está claro cuál de estos interviene: elige el que corresponda (detalla la avería para acotarlo).</div>
  <div class="svbs">${A.C.map(c=>`<button type="button" class="rcscb svb" data-k="${E(clave(c))}"><span class="cmpid">${E(c.id)}</span> ${E(c.t)}${c.fab?`<small>${E(c.fab)}</small>`:""}</button>`).join("")}</div><div id="sv_fi"></div>`;
 else if((A.pend||[]).length)b=`<div class="svok">El elemento de la avería está en los planos pero <b>aún no está incorporado</b> en Componentes de campo (los borneros y el módulo del PLC por los que pasa la señal no se proponen como componente a intervenir):</div>
  <div class="svbs">${A.pend.map(r=>`<div class="rcscb svb" style="cursor:default"><span class="cmpid">${E(r[0])}</span> ${E(r[1])}<small>📍 ${E(r[2]||"")} · folio ${E(r[3]||"")}</small></div>`).join("")}</div>
  <button type="button" class="sec" style="width:100%" onclick="typeof abreComp=='function'&&abreComp()">CATÁLOGO · PENDIENTES DE IMPORTAR</button>`;
 else b=`<div class="svok">Con lo descrito no se identifica un componente del catálogo. Detalla el elemento (p. ej. «láser de extensión», «potenciómetro de cabina») o búscalo en el catálogo.</div>
  <button type="button" class="sec" style="width:100%" onclick="typeof compCatalogo=='function'&&compCatalogo()">CATÁLOGO DE COMPONENTES</button>`;
 return`<div class="ubh ubcmp" id="sv_cmp">🔩 COMPONENTE A INTERVENIR<small>${A.C.length==1?"Ficha técnica del componente":"Especificaciones técnicas"}</small></div><div class="ubb ubbcmp">${b}</div>`}

window.sosValCmp=()=>{const h=$("sv_cmp");if(h)h.scrollIntoView({block:"start",behavior:"smooth"})};
function pon(){const res=$("sr_res");if(!res||!res.querySelector(".ub1"))return;
 res.querySelectorAll("#sv_al,#sv_cmp,#sv_cmp+.ubbcmp").forEach(x=>x.remove());
 const A=analiza();window.__sosVal=A;
 const d=document.createElement("div");
 d.innerHTML=bloqueAlarma(A);res.insertBefore(d.firstChild,res.firstChild);
 const h2=res.querySelector(".ub2");d.innerHTML=bloqueComp(A);
 while(d.firstChild){h2?res.insertBefore(d.firstChild,h2):res.appendChild(d.firstChild)}
 res.querySelectorAll(".svb").forEach(b=>b.onclick=()=>{const c=A.C.find(z=>clave(z)==b.dataset.k);const f=$("sv_fi");if(!c||!f)return;
  res.querySelectorAll(".svb").forEach(x=>x.classList.toggle("on",x===b));f.innerHTML=fichaH(c)})}

const oA=window.sosAnaliza;
if(typeof oA=="function")window.sosAnaliza=async function(){const r=await oA.apply(this,arguments);try{pon()}catch(e){console.warn("sos-valida",e)}return r};

const st=document.createElement("style");st.textContent=`
.svw{border:2px solid #1fa64a;border-radius:10px;padding:8px;margin:8px 0}
.svw:has(.svmal){border-color:#f9a825}.svw:has(.svnada){border-color:var(--bd,#90a4ae)}
.svh{display:flex;gap:8px;align-items:flex-start;font-size:20px;line-height:1.2}
.svh b{display:block;font:800 13.5px/1.3 var(--tkmo,monospace);letter-spacing:.6px;color:#1fa64a}
.svh.svmal b{color:#e09a00}.svh.svnada b{color:var(--mu,#78909c)}
.svh small{display:block;font-size:12.5px;font-weight:600;color:var(--mu,#78909c);margin-top:1px}
.svl{font-size:12.5px;font-weight:700;margin:6px 0 -2px;color:var(--mu,#78909c)}
.svchip{display:block;width:100%!important;margin:6px 0 0!important;padding:8px 9px!important;text-align:left;font-size:14px!important;line-height:1.3;border:2px solid #455a64!important;border-radius:8px!important}
.svchip small{display:block;font-size:12px;font-weight:700;color:#1fa64a;margin-top:2px}.svchip.svvar{font-weight:700}
.svok{font-size:13px;font-weight:600;margin:2px 0 6px}
.svbs{display:flex;flex-direction:column;gap:4px}.svb.on{border-color:#1fa64a!important;border-left-color:#1fa64a!important}`;
document.head.appendChild(st);
})();
