/* ===== v523: «Análisis de la OT» tras el análisis con IA (16/11/2026) =====
   Cuando la OT ya tiene resultado del cotejo con IA («RECALCULAR IA», Gemini o Claude), el Análisis de la OT
   muestra EXCLUSIVAMENTE lo que la IA relaciona con la OT y oculta el resto:
   · Señales implicadas: solo las que cita la IA (por código de elemento, o por módulo + entrada/salida).
     Si la IA no cita ninguna, queda solo la más probable.
   · Módulos: solo los de esas señales.
   · Elementos de campo: solo los que nombra la IA (sensores, finales de carrera, borneros, mangueras).
   · Guía de campo: solo la avería más relacionada.
   · Arriba, «🤖 Actuación en campo cable a cable»: cada punto de medida de la IA con su bornero/borna, cable,
     puntas del polímetro, valor esperado y qué hacer si no lo da, y debajo el recorrido cable a cable de los
     elementos de ese punto según los planos cargados.
   Un enlace discreto «Ver todo» enseña lo oculto (y «Solo lo de la OT» lo vuelve a ocultar). ===== */
(function(){
"use strict";
if(typeof anaOT!="function"||typeof anaHTML!="function")return;
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const TAG=/\+?([A-Z]{1,5}\d?-[A-Z]{1,3}\d+[A-Z]?(?:\.\d+)?)(?![A-Za-z0-9])/g;
const esMod=t=>/^[EP]-A\d+$/.test(t);
const esBor=t=>/^[A-Z]{1,4}-X\d/.test(t);
const esMang=t=>/^[A-Z]{1,4}-W\d/.test(t);
let todo=false;

/* ---------- resultado de la IA para una OT ---------- */
function iaDe(id){if(!id)return null;
 try{if(typeof window.pcIAOT=="function"){const o=window.pcIAOT(id);if(o)return o}}catch(e){}
 /* sin la caja de cotejo pintada: el último resultado guardado de esa OT */
 try{let best=null;const pre="pc_ia_"+id+"_";for(let k=0;k<localStorage.length;k++){const n=localStorage.key(k);if(!n||n.indexOf(pre)!==0)continue;
   try{const o=JSON.parse(localStorage.getItem(n));if(o&&(!best||(o.t||0)>(best.t||0)))best=o}catch(e){}}
  return best}catch(e){return null}}
function iaTexto(o){return [o.resumen,...(o.eficaz||[]),...(o.medir||[]).map(m=>[m.punto,m.roja,m.negra,m.esperado,m.si_no].join(" "))].filter(Boolean)/* «planos» no cuenta: solo lo que la IA aplica a la avería */.join(" \n ")}
function codigos(txt){const out=[];const T=String(txt||"").toUpperCase();let m;TAG.lastIndex=0;
 while((m=TAG.exec(T))){const c=m[1].replace(/'+$/,"");if(!out.includes(c))out.push(c)}
 /* fuera los pegados a otra palabra («E-A2E») si existe el corto */
 return out.filter(c=>!(/[A-Z]$/.test(c)&&out.includes(c.slice(0,-1))))}
const reE=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");

/* ---------- filtro del análisis ---------- */
function sigTags(x){const s=new Set([...(x.tg||[])].map(t=>String(t).replace(/^\+/,"").replace(/'+$/,"")));
 const pts=((x.S&&x.S.p)||[]).map(q=>q.p).join(" ")+" "+((x.S&&x.S.t)||"");let m;TAG.lastIndex=0;const T=pts.toUpperCase();
 while((m=TAG.exec(T)))s.add(m[1].replace(/'+$/,""));return s}
function citaSenal(x,C,TX){const tg=sigTags(x);
 for(const c of C){if(esMod(c)||esBor(c)||esMang(c))continue;if(tg.has(c))return 3}
 if(C.includes(x.mod)&&x.S){const led=String(x.S.led||x.S.b||"").trim();
  if(led&&new RegExp(reE(x.mod)+"[^\\n;]{0,45}?(?<![\\d.])"+reE(led)+"(?![\\d])").test(TX))return 2}
 /* borneros y mangueras: los comparten muchas señales; solo deciden si no hay nada más concreto (ver filtra) */
 for(const c of C){if((esBor(c)||esMang(c))&&tg.has(c))return 1}
 return 0}
function filtra(i,r){const o=iaDe(i&&i.id);if(!o)return r;
 const TX=iaTexto(o).toUpperCase();const C=codigos(TX);
 const rel0=r.rel||[];let rel=rel0.map((x,ix)=>({x,c:citaSenal(x,C,TX),ix})).filter(z=>z.c>0);const fu=rel.some(z=>z.c>=2);rel=rel.filter(z=>!fu||z.c>=2).sort((a,b)=>b.c-a.c||a.ix-b.ix).map(z=>z.x);
 const sinCita=!rel.length;if(sinCita&&rel0.length)rel=[rel0[0]];
 const mods=[...new Set(rel.map(x=>x.mod))];
 /* elementos: solo los que nombra la IA; dispositivos primero, después borneros y mangueras */
 let el=C.filter(t=>!esMod(t)&&!/^E-Q30/.test(t));
 el=[...el.filter(t=>!esBor(t)&&!esMang(t)),...el.filter(esBor),...el.filter(esMang)];
 if(!el.length)el=(r.elem||[]).slice(0,4);
 const guia=(r.guia||[]).slice(0,1);
 return Object.assign({},r,{rel,mods,elem:el.slice(0,12),guia,
  _ia:{o,C,sinCita,oc:{s:Math.max(0,rel0.length-rel.length),e:Math.max(0,new Set([...(r.elem||[])].filter(t=>!el.includes(t))).size),g:Math.max(0,(r.guia||[]).length-guia.length)}}})}
(function(){const o=anaOT;window.anaOT=anaOT=function(i){const r=o.apply(this,arguments);if(!r||todo||window.ANA_IA_OFF)return r;try{return filtra(i,r)}catch(e){console.warn("ana-ia",e);return r}}})();
try{ANA_C={k:"",r:null}}catch(e){}

/* ---------- elementos de la señal elegida (analisis-canal) recortados a los de la IA ---------- */
try{if(typeof window.anaElemSig=="function"){const oe=window.anaElemSig;window.anaElemSig=function(x){const a=oe.apply(this,arguments);const K=window.ANA_IA_EL;
 if(!K||!K.length)return a;const f=a.filter(t=>K.includes(t));return f.length?f:K.slice(0,8)}}}catch(e){}

/* ---------- panel ---------- */
const enDatos=t=>{try{return (typeof elZona=="function"&&elZona(t))||(typeof elRutas=="function"&&elRutas(t).length)}catch(e){return false}};
function bornas(txt){const T=String(txt||"").toUpperCase();const out=[];
 const re=/\+?([A-Z]{1,4}\d?-X\d+[A-Z]?)\s*(?::|BORNA|BORNE|B\.)\s*([0-9]+(?:\.[0-9]+)?)(?![0-9A-Z])/g;let m;
 while((m=re.exec(T))){const v=m[1]+":"+m[2];if(!out.includes(v))out.push(v)}return out}
function pasoHTML(m,n){const txt=[m.punto,m.roja,m.negra].join(" ");const cs=codigos(txt).filter(t=>!esMod(t));
 const bs=bornas(txt);const cab=cs.filter(esMang),dis=cs.filter(t=>!esBor(t)&&!esMang(t)),bor=cs.filter(esBor);
 const fila=(k,v)=>v?`<span class="aik">${k}</span><span class="aiv">${v}</span>`:"";
 const rut=cs.filter(enDatos).slice(0,3);
 return `<div class="aip"><div class="aipt"><b>${n}.</b> ${esc(m.punto||"Punto de medida")}</div>
  <div class="aig">${fila("Elemento",dis.map(esc).join(" · "))}${fila("Bornero / borna",(bs.length?bs:bor).map(esc).join(" · "))}${fila("Cable / manguera",cab.map(esc).join(" · "))}
  ${fila(`Punta <b class="pcro">ROJA</b>`,esc(m.roja))}${fila("Punta <b>NEGRA</b>",esc(m.negra))}${fila("Debe marcar",`<b>${esc(m.esperado)}</b>`)}${fila("Si no",esc(m.si_no))}</div>
  ${rut.length&&typeof elHTML=="function"?`<details class="aird"><summary>🔗 Recorrido cable a cable (${rut.map(esc).join(", ")})</summary><div class="elus">${rut.map(t=>{try{return elHTML(t,true)}catch(e){return ""}}).join("")}</div></details>`:""}</div>`}
function iaHTML(R){const A=R._ia,o=A.o;const med=o.medir||[],ef=o.eficaz||[];
 const oc=A.oc,n=oc.s+oc.e+oc.g;
 return `<div class="aibox"><div class="ait">🤖 Actuación en campo cable a cable <span class="mu">· según ${esc(o.lector||"IA")}</span></div>
  ${o.resumen?`<div class="aires">🎯 ${esc(o.resumen)}</div>`:""}
  ${med.length?`<div class="anal">📏 Mediciones en campo, en orden</div>${med.map((m,k)=>pasoHTML(m,k+1)).join("")}`:""}
  ${ef.length?`<div class="anal">⭐ Pasos de la actuación</div><div class="gst">${ef.map((p,k)=>`<label class="gpaso"><input type="checkbox"><span><b>${k+1}.</b> ${esc(p)}</span></label>`).join("")}</div>`:""}
  <div class="aiof">${A.sinCita?"La IA no cita una señal del PLC: se deja la más probable. ":""}${n?`Oculto lo que no implica a esta OT (${[oc.s&&oc.s+" señal(es)",oc.e&&oc.e+" elemento(s)",oc.g&&oc.g+" avería(s) de la guía"].filter(Boolean).join(", ")}). `:""}<a href="#" onclick="event.preventDefault();event.stopPropagation();anaIATodo(true)">Ver todo</a></div></div>`}
(function(){const o=anaHTML;window.anaHTML=anaHTML=function(i,R,dentro){
 if(todo){let h=o.apply(this,arguments);if(i&&iaDe(i.id))h=h.replace(/(<details class="anap"[^>]*>\s*<summary>[\s\S]*?<\/summary>)/,`$1<div class="aiof">Se ve todo el análisis general. <a href="#" onclick="event.preventDefault();event.stopPropagation();anaIATodo(false)">Solo lo de la OT (IA)</a></div>`);return h}
 if(!R||!R._ia)return o.apply(this,arguments);
 window.ANA_IA_EL=R.elem.slice();let h;try{h=o(i,R,dentro)}finally{window.ANA_IA_EL=null}
 const box=iaHTML(R);
 if(/<details class="anap"/.test(h))h=h.replace(/(<details class="anap"[^>]*>\s*<summary>[\s\S]*?<\/summary>)/,`$1${box}`);
 else h=`<details class="anap" open><summary><b>🎯 Análisis de la OT</b></summary>${box}</details>`+h;
 return h}})();

/* ---------- repintado al llegar la IA o al cambiar «Ver todo» ---------- */
function repinta(){try{ANA_C={k:"",r:null}}catch(e){}setTimeout(()=>{try{filtraGuia()}catch(e){}},60);
 try{if(document.querySelector(".insov")&&typeof gPintaIns=="function"){gPintaIns();return}}catch(e){}
 try{if(typeof view!="undefined"&&view=="tec"&&typeof render=="function"){const y=window.scrollY;const a=document.getElementById("anag");if(a)a.remove();render();requestAnimationFrame(()=>window.scrollTo(0,y))}}catch(e){}}
window.anaIATodo=function(v){todo=!!v;repinta()};
window.addEventListener("pc-ia",()=>{todo=false;repinta()});

/* ===== v524: lo mismo en TODA la guía de la OT y en la inspección cable a cable =====
   Con resultado de la IA para la OT:
   · Casos de la guía (grupos y cajas sueltas): solo los que nombran un elemento, bornero, manguera o señal
     (módulo + entrada) de la IA, más la avería más relacionada. Un grupo sin casos implicados se oculta entero.
   · «Comprobaciones por sistema»: solo los sistemas que nombran lo de la IA.
   · Inspección cable a cable: solo los módulos del PLC de las señales implicadas.
   Se mantienen siempre: Seguridad, cotejo entre planos, Actuación más eficaz, Análisis de la OT, Cotejar PLC,
   Inspección, Mapa de alimentaciones, Componentes y Cierre.
   Aviso arriba de la guía con «Ver todo» / «Solo lo de la OT». ===== */
function claveIA(){try{if(typeof gOT=="undefined"||!gOT||typeof inc=="undefined")return null;const i=inc.find(x=>x.id==gOT);if(!i)return null;
 const o=iaDe(i.id);if(!o)return null;const was=todo;todo=false;let R=null;try{R=anaOT(i)}finally{todo=was}if(!R||!R._ia)return null;
 const cod=R._ia.C.filter(t=>!esMod(t)&&!/^E-Q30/.test(t));
 /* fuertes: dispositivos de campo, bornas concretas y señales (módulo + entrada); los borneros y mangueras sueltos
    (p. ej. E-X1 de 0 V) salen en casi toda la guía y solo cuentan si la IA no nombra nada más concreto */
 const re=t=>new RegExp("(^|[^A-Z0-9-])\\+?"+reE(t)+"(?![0-9A-Z.])");
 const dis=cod.filter(t=>!esBor(t)&&!esMang(t));
 const res=dis.map(re);
 bornas(iaTexto(o)).forEach(b=>{const [x,n]=b.split(":");res.push(new RegExp("(^|[^A-Z0-9-])\\+?"+reE(x)+"\\s*(?::|BORNA|BORNE)\\s*"+reE(n)+"(?![0-9])"))});
 (R.rel||[]).forEach(x=>{const led=String(x.S&&(x.S.led||x.S.b)||"").trim();if(led)res.push(new RegExp(reE(x.mod)+"[^\\n;]{0,45}?(?<![\\d.])"+reE(led)+"(?![\\d])"))});
 if(!res.length)cod.forEach(t=>res.push(re(t)));
 const keys=new Set((R.guia||[]).map(g=>(R.tipo||"PAS")+g.si));return {i,R,res,keys,o}}catch(e){return null}}
const FIJAS=/^(SEG|COT|INS|SIS|ALIM|CMP|CIE|SIS.*)$/;
const toca=(el,K)=>{const t=(el.textContent||"").toUpperCase();return K.res.some(r=>r.test(t))};
function filtraGuia(){if(typeof view=="undefined"||view!="tec")return;const app=document.getElementById("app");if(!app)return;
 const K=todo?null:claveIA();
 app.querySelectorAll(".aiox").forEach(e=>e.classList.remove("aiox"));
 let av=document.getElementById("aiguia");
 if(!K&&!todo){if(av)av.remove();return}
 if(K){let oc=0;
  const caso=d=>{const k=d.dataset.k||"";if(FIJAS.test(k)||d.classList.contains("gef")||d.id=="gpcot"||d.id=="anag")return true;if(K.keys.has(k))return true;return toca(d,K)};
  /* cajas sueltas de avería */
  [...app.children].forEach(c=>{if(c.matches("details.gd")&&!caso(c)){c.classList.add("aiox");oc++}});
  /* grupos de casos */
  app.querySelectorAll(":scope > details.ggrp").forEach(g=>{const cs=[...g.querySelectorAll("details.gd")];let vis=0;
   cs.forEach(d=>{if(caso(d))vis++;else{d.classList.add("aiox");oc++}});if(!vis&&(cs.length||!toca(g,K)))g.classList.add("aiox")});
  /* comprobaciones por sistema */
  const sis=app.querySelector('details.gd[data-k="SIS"]');if(sis){const ds=[...sis.querySelectorAll("details.sisd")];let v=0;
   ds.forEach(d=>{if(toca(d,K))v++;else{d.classList.add("aiox");oc++}});if(ds.length&&!v)sis.classList.add("aiox")}
  K.oc=oc}
 const cab=[...app.querySelectorAll(":scope > .card")].find(x=>/Guía de campo/.test((x.querySelector("h3")||{}).textContent||""));if(!cab)return;
 if(!av){av=document.createElement("div");av.id="aiguia";av.className="aiof aigv"}
 if(cab.nextElementSibling!==av)cab.insertAdjacentElement("afterend",av);
 const h=todo?`Se ve toda la guía. <a href="#" onclick="event.preventDefault();anaIATodo(false)">Solo lo de la OT (IA)</a>`:
  `🤖 Guía filtrada con la IA (${esc(K.o.lector||"IA")}): solo lo de la OT${K.oc?` · ${K.oc} apartado(s) ocultos`:""}. <a href="#" onclick="event.preventDefault();anaIATodo(true)">Ver todo</a>`;
 if(av.innerHTML!==h)av.innerHTML=h}
let tg=0;const app0=document.getElementById("app");
if(app0)new MutationObserver(()=>{if(tg)return;tg=setTimeout(()=>{tg=0;try{filtraGuia()}catch(e){console.warn("ana-ia guía",e)}},120)}).observe(app0,{childList:true});
if(typeof vTec=="function"){const ov=vTec;window.vTec=vTec=function(){const r=ov.apply(this,arguments);try{filtraGuia()}catch(e){}return r}}
window.addEventListener("pc-ia",()=>setTimeout(filtraGuia,50));
/* «Señales relacionadas con la OT» de la inspección: solo las que deja la IA */
if(typeof window.otRelSig=="function"){const os=window.otRelSig;window.otRelSig=function(i){const A=os.apply(this,arguments);try{if(todo||!i||!iaDe(i.id)||(window.insCons&&window.insCons(i.id)))return A;/* v525: consultada → todas las señales */
 const R=anaOT(i);if(!R||!R._ia||!R.rel.length)return A;return {gr:["Según la IA"],rel:R.rel.map(x=>({mod:x.mod,S:x.S})),txt:(A&&A.txt)||i.desc||""}}catch(e){return A}}}
/* inspección cable a cable: solo los módulos implicados */
if(typeof gInsHTML=="function"){const oi=gInsHTML;window.gInsHTML=gInsHTML=function(){let h=oi.apply(this,arguments);try{if(todo)return h;
 const i=inc.find(x=>x.id==gOT);if(i&&window.insCons&&window.insCons(i.id))return h;/* v525: consultada → todos los módulos */const R=i&&anaOT(i);if(!R||!R._ia||!R.mods.length)return h;
 h=h.replace(/<button class="([^"]*)"( onclick="gISel\('([^']+)'\)")/g,(m,c,on,k)=>R.mods.includes(k)||k==gIMod?m:`<button class="${c} aiox"${on}`)}catch(e){}return h}}
const st2=document.createElement("style");st2.textContent=`.aiox{display:none!important}.aigv{margin:0 0 10px;padding:7px 10px;border:1.5px solid #1565c0;border-radius:8px;background:color-mix(in srgb,#1565c0 7%,transparent);opacity:1;font-size:12.5px}`;document.head.appendChild(st2);

const st=document.createElement("style");st.textContent=`
.aibox{margin:8px 0 10px;padding:8px 10px;border:2px solid #1565c0;border-radius:10px;background:color-mix(in srgb,#1565c0 6%,transparent)}
.ait{font-weight:800;font-size:14px}.ait .mu{font-weight:400;font-size:12px}
.aires{margin:6px 0;font-size:13px;line-height:1.4}
.aip{margin:6px 0;padding:7px 9px;border-left:4px solid #f0a020;border-radius:6px;background:color-mix(in srgb,#f0a020 9%,var(--card));font-size:13px}
.aipt{font-weight:700;margin-bottom:4px;line-height:1.35}
.aig{display:grid;grid-template-columns:max-content 1fr;gap:3px 10px;align-items:baseline}
.aik{font-size:11.5px;opacity:.75;white-space:nowrap}.aiv{overflow-wrap:anywhere;font-family:inherit}
.aird{margin-top:6px}.aird>summary{cursor:pointer;font-size:12px;font-weight:700;color:#1565c0}html:not(.lt) .aird>summary{color:#64b5f6}
.aiof{margin-top:8px;font-size:11.5px;opacity:.8}.aiof a{color:#ef6c00;font-weight:700}`;document.head.appendChild(st);
})();
