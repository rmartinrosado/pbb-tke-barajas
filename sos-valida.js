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
 const Ld=det(ob),Lf=det(foto);
 /* v705: «Alarma a mano» lleva una alarma por línea: se leen línea a línea (no con el texto en una sola línea) */
 let La=det(sa&&sa.value?sa.options[sa.selectedIndex].text:"");
 try{const raw=(($("sr_t")||{}).value||"");const L2=typeof rcsListaAl=="function"?rcsListaAl(raw):[];const k=new Set(La.map(z=>z.x.c));
  L2.forEach(x=>{if(!k.has(x.c)){k.add(x.c);La.push({x,por:"num"})}});if(!L2.length&&raw.trim())det(raw).forEach(z=>{if(!k.has(z.x.c)){k.add(z.x.c);La.push(z)}})}catch(e){La=det(al)}
 const cods=L=>new Set(L.map(z=>z.x.c));
 let est,cod=[];
 /* v705: varias alarmas sumadas → se validan TODAS (más las que dé la avería en campo, sin repetir) */
 if(La.length>1){const k=cods(La);est="ok";cod=La.concat(Ld.filter(z=>!k.has(z.x.c)))}
 else if(La.length&&Ld.length){const k=cods(Ld);const com=La.filter(z=>k.has(z.x.c));
  if(com.length){est="ok";cod=com}else{est="dif";cod=Ld}}
 else if(La.length){est="ok";cod=La}
 else if(Ld.length){est=al?"noal":"ded";cod=Ld}
 else if(Lf.length){est="foto";cod=Lf}
 else est=al?"noal":"nada";
 const SINT0=/bloque|no (traslad|se mueve|mueve|funciona|anda|arranca|rearma|sube|baja|gira|extiende|recoge|responde|va)|parad|sin movimiento|inmoviliz|linea de seguridad|seguridad(es)? activada|fuera de servicio|averiad/;
 const nombraCod=/\b[A-Z]{1,3}\d?-[A-Z]{1,3}\d+/.test(String(ob||"").toUpperCase());
 const sintoma=!!ob&&SINT0.test(nrm(ob))&&!nombraCod;
 if(sintoma&&La.length&&est=="dif"){est="ok";cod=La}
 /* componentes: los de la avería en campo mandan; los de la alarma validada acotan */
 /* v704: los componentes de la alarma salen de los PLANOS (rcsIntervienen: canal del PLC → elemento → borneros → módulo),
    no del parecido de texto (004 ya no da el láser ET-B9). Los elementos de campo incorporados acotan; los que no lo están
    se proponen desde los planos. */
 /* v899: la LÍNEA DE SEGURIDADES (011 / 013 / 065) es la consecuencia: si hay además la alarma del elemento (p. ej. 009), los
    componentes salen de esa alarma, no de los contactores E-K0 / E-K0.1 */
 const LINEA=new Set(["011","013","065"]);const codC=cod.some(z=>!LINEA.has(z.x.c))?cod.filter(z=>!LINEA.has(z.x.c)):cod;
 let I=[];try{I=typeof rcsIntervUnion=="function"?rcsIntervUnion(codC.map(z=>z.x)):[]}catch(e){}
 const Icampo=I.filter(o=>o.rol=="campo");
 /* v899: con el SÍNTOMA solo (sin código) no se proponen componentes por parecido de texto («no traslada» sacaba los variadores E-U1 / E-U2 con la 009) */
 const Cd=sintoma&&cod.length?[]:uniq(campo(ob)),Ca=Icampo.length?uniq(Icampo.filter(o=>o.c).map(o=>o.c)):uniq(cod.flatMap(z=>deAl(z.x))),Ct=Icampo.length?[]:uniq(campo([ob,al,foto].filter(Boolean).join(" ")));
 let C;
 /* v882: si los PLANOS ya dicen qué elemento de campo trae la alarma (113 → IT-B10) pero aún no está incorporado, lo escrito
    en «Avería en campo» NO propone otros componentes por parecido de texto (salían P-K51, P-K52, C-B14); solo cuentan los que
    se nombran por su código. Así queda el elemento de los planos como componente a intervenir (ficha pendiente). */
 const porCodigo=c=>{const t=String(ob||"").toUpperCase().replace(/\s+/g,"");return String(c.id||"").toUpperCase().split(/\s*[\/,]\s*/).some(k=>k&&t.includes(k.replace(/\s+/g,"")))};
 if(Icampo.length&&!Ca.length&&Cd.length&&cod.length)C=Cd.filter(porCodigo);
 else if(Cd.length&&Ca.length){const i=inter(Cd,Ca);C=i.length?i:Cd}
 else if(Cd.length)C=Cd;
 else if(Ca.length){const i=Ct.length?inter(Ca,Ct):[];C=i.length?i:Ca}
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
 if(!C.length&&!pend.length&&Icampo.length)pend=Icampo.filter(o=>!o.c).map(o=>[o.id,o.nom||"Según planos",[o.papel,o.ubi].filter(Boolean).join(" · "),o.folio||""]);
 /* alarma escrita sin código en la avería: si sus componentes no son los del elemento descrito, no coincide */
 /* v897: una avería que solo describe el SÍNTOMA («pasarela bloqueada, no traslada», «no se mueve», «no rearma»…) sin nombrar un
    elemento por su código NO contradice la alarma: es lo que provoca una seguridad activada (bordes 010 → no traslada). Antes,
    al no compartir componentes con la alarma, salía «la alarma no coincide con la avería». Solo hay discrepancia si la avería
    nombra un elemento concreto (código) distinto de los de la alarma. */
 if(est=="ok"&&ob&&!Ld.length&&Cd.length&&Ca.length&&!inter(Cd,Ca).length&&!sintoma){est="dif";cod=[]}
 let Iall=I;if(codC.length!==cod.length){try{Iall=rcsIntervUnion(cod.map(z=>z.x))}catch(e){}}
 return{ob,al,est,cod,Ld,La,C,pend,I:Iall,Ic:I}}

/* ---------- pintado ---------- */
const EST={ok:["✅","ALARMA VALIDADA","La alarma coincide con el manual RCS y con el síntoma en campo."],
 okn:["✅","ALARMAS VALIDADAS","Todas las alarmas están en el manual RCS; sus componentes se suman."],
 ded:["✅","ALARMA DEDUCIDA DEL SÍNTOMA EN CAMPO","No se ha escrito alarma: el código sale de lo que se detecta."],
 dif:["⚠️","LA ALARMA NO COINCIDE CON EL SÍNTOMA","Manda el síntoma en campo; revisa la alarma de la Magelis."],
 noal:["⚠️","ALARMA NO RECONOCIDA EN EL MANUAL RCS","Revisa el número o el texto de la alarma."],
 foto:["✅","ALARMA LEÍDA DE LA FOTO (complementaria)","No hay nada escrito: se toma lo leído en la Magelis."],
 nada:["ℹ️","SIN CÓDIGO DEL MANUAL RCS","Lo descrito no corresponde a ninguna alarma concreta del manual."]};
const cajaAl=z=>{try{return typeof rcsCaja=="function"?rcsCaja(z,true):`<div class="rcsb"><b>${E(z.x.c)}</b> ${E(z.x.t)}</div>`}catch(e){return""}};
function bloqueAlarma(A){const [ic,t0,s]=EST[A.est=="ok"&&A.cod.length>1?"okn":A.est];const t=A.est=="ok"&&A.cod.length>1?`${t0} (${A.cod.length})`:t0;const mal=A.est=="dif"||A.est=="noal";
 let h=`<div class="svh${mal?" svmal":A.est=="nada"?" svnada":""}"><span>${ic}</span><span><b>${t}</b><small>${E(s)}</small></span></div>`;
 if(A.est=="dif")h+=`<div class="svl">Alarma indicada:</div>${A.La.map(cajaAl).join("")}<div class="svl">Según el síntoma en campo (manda):${A.cod.length?"":" sin código del manual; componente según lo descrito ↓"}</div>`;
 if(A.est=="noal")h+=`<div class="svl">Escrita: «${E(A.al)}»${A.cod.length?" · según el síntoma en campo:":""}</div>`;
 h+=A.cod.map(cajaAl).join("");
 /* v813: simulaciones y croquis de la guía de campo de los elementos que intervienen, tras las cajas rojas (005 → almena) */
 /* v816: el croquis del puente provisional (según planos) justo después de las cajas rojas, antes de la simulación */
 if(A.cod.length){try{const S=sacarHTML(A);if(S&&S.croH)h+=`<div class="rcscro svcroal">${S.croH}</div>`}catch(e){}}
 if(A.cod.length&&typeof rcsCroGuia=="function")h+=rcsCroGuia(A.cod.map(z=>z.x));
 /* v704: componentes de campo que intervienen (según planos), igual que al elegir la alarma */
 if((A.I||[]).length&&A.cod.length&&typeof rcsBloqueInterv=="function")h+=rcsBloqueInterv(A.cod[0].x,A.I,A.cod.length>1);
 /* componente: chip que baja a la ficha */
 /* v891: sin el chip del componente si ya está en «Elementos que intervienen» (salía repetido, p. ej. E-U5 en la 010) */
 const yaI=c=>(A.I||[]).some(o=>String(o.id).split(" ")[0].toUpperCase()==String(c.id).trim().toUpperCase()||(o.c&&o.c===c));
 if(A.C.length==1&&yaI(A.C[0])){}
 else if(A.C.length==1){const c=A.C[0];h+=`<button type="button" class="svchip" onclick="sosValCmp()"><span class="cmpid">${E(c.id)}</span> ${E(c.t)}<small>🔩 Componente a intervenir · ver ficha ↓</small></button>`}
 else if(A.C.length>1)h+=`<button type="button" class="svchip svvar" onclick="sosValCmp()">🔩 ${A.C.length} componentes posibles · elegir ↓</button>`;
 else if((A.pend||[]).length&&!(A.I||[]).length)h+=`<button type="button" class="svchip" onclick="sosValCmp()">🔩 ${E(A.pend.map(r=>r[0]).join(" · "))}<small>Componente a intervenir (planos) · ver ↓</small></button>`;
 return`<div class="svw" id="sv_al">${h}</div>`}
const fichaH=c=>{try{return typeof compFicha=="function"?compFicha(c):""}catch(e){return""}};
/* v892: componente SIN ficha en el catálogo: lo que sí dicen los planos (tipo, conexión, entrada del PLC y LED, borneros, mangueras,
   cómo comprobarlo) y el botón «Incorporar <código> al catálogo», que abre Componentes de campo con esa pieza buscada para hacerle la foto.
   Antes solo salía el código y el nombre, y un botón genérico «CATÁLOGO · PENDIENTES DE IMPORTAR». */
function fichaPlanos(r,A){const id=String(r[0]),I=A.Ic||A.I||[];const me=I.find(o=>String(o.id).split(" ")[0].toUpperCase()==id.toUpperCase());
 /* v899: entrada, borneros y mangueras del PROPIO elemento sacados del CABLEADO (con varias alarmas salían los de la otra, p. ej.
    IT-S3 con la entrada E-A0 1.1 de la línea de seguridades) */
 const lid=t=>String(t||"").replace(/^\+/,"").replace(/\[.*$/,"").replace(/\((.*)\)$/," ($1)").trim().toUpperCase();
 const CB=window.CABLEADO||{};const ents=Object.keys(CB).map(k=>CB[k]).filter(e=>e&&e.m&&(e.n||[]).some(n=>n.k=="E"&&lid(n.t)==id.toUpperCase()));
 let mods,bor,man;
 if(ents.length){const ms=new Map(),bs=new Map(),ws=new Set();
  ents.forEach(e=>{if(/GND|^N\.?C\.?$/i.test(String(e.k||"")+" "+String(e.d||"").trim()))return;ms.set(e.m+" "+e.b,{id:e.m,det:[(/^OUT/i.test(e.k||"")?"salida ":/^UT/i.test(e.k||"")?"salida de test ":"entrada ")+e.b+" ("+(e.k||"")+") · "+String(e.d||"").toLowerCase()]});
   (e.n||[]).forEach(n=>{if(n.k=="B"&&/-X\d/.test(n.t||"")){const b=lid(n.t);if(!bs.has(b))bs.set(b,new Set());bs.get(b).add(n.p)}(n.v||[]).forEach(v=>{if(v.m)ws.add(String(v.m).replace(/^-/,"")+(v.t&&!/FABRICANTE/i.test(v.t)?" ("+v.t+")":""))})})});
  mods=[...ms.values()];bor=[...bs.entries()].map(([b,ps])=>({id:b,det:[[...ps].filter(Boolean).join("/")]}));man=[...ws].map(w=>({id:w,det:[]}))}
 else{mods=I.filter(o=>o.rol=="modulo"&&(!me||me.pri==o.pri||I.filter(z=>z.rol=="modulo").length==1));
  bor=I.filter(o=>o.rol=="borna"&&(!me||o.pri==me.pri));man=I.filter(o=>o.rol=="manguera"&&(!me||o.pri==me.pri))}
 const tipo=/-B\d/.test(id)?(/ultras|láser|laser|fotoc/i.test(r[1])?"sensor":"inductivo / detector (3 hilos: BN +24 V · BK señal · BU 0 V)"):/-S\d/.test(id)?"final de carrera (contacto)":/-Y\d/.test(id)?"electroválvula (bobina)":/-R\d/.test(id)?"potenciómetro / transmisor":/-U\d/.test(id)?"relé evaluador":/-K\d/.test(id)?"relé / contactor":/-Q\d/.test(id)?"guardamotor / disyuntor":"elemento de campo";
 const ent=mods.map(o=>`${o.id} ${o.det.join(" · ")}`).join(" / ");
 const fila=(k,v)=>v?`<div class="svfp"><b class="svfpk">${k}</b><div class="svfpv">${E(v)}</div></div>`:"";
 const prueba=/-[KQUF]\d/.test(id)?(mods.length?`Comprobar en ${mods.map(o=>o.id+" "+(String(o.det[0]||"").match(/(?:entrada|salida(?: de test)?) (\S+)/)||["",""])[1]).join(" / ")}: con la orden, la bobina (A1-A2) debe tener 24 V y su contacto de retorno cambiar.`:""):mods.length?`Al actuar el elemento (con la PBB en esa posición o pasando una pieza metálica / pulsando el contacto) el LED de ${mods.map(o=>o.id+" "+(String(o.det[0]||"").match(/(?:entrada|salida(?: de test)?) (\S+)/)||["",""])[1]).join(" / ")} debe cambiar. Si no cambia: medir 24 V en el elemento y la señal en el bornero.`:"";
 /* v900: papel del elemento según el cableado (FC inclinación SUPERIOR / INFERIOR): con dos FC del mismo nombre se distinguen */
 let rol="";ents.some(e=>(e.n||[]).some(n=>{if(n.k=="E"&&lid(n.t)==id.toUpperCase()&&n.d){const m=String(n.d).match(/\b(SUPERIOR|INFERIOR|DERECH[OA]|IZQUIERD[OA]|DELANTER[OA]|TRASER[OA])\b/i);if(m){rol=m[1].toLowerCase();return true}}return false}));
 return`<div class="rcscb svb svfpc" style="cursor:default"><span class="cmpid">${E(id)}</span> ${E(r[1])}${rol?` <b class="svrol">${E(rol)}</b>`:""}<small>📍 ${E(r[2]||"")} · folio ${E(r[3]||"")} · rev. J</small>
  <div class="svfpb">${fila("Tipo",tipo)}${fila("Conexión",me?me.det.join(" · "):"")}${fila("Entrada PLC",ent)}${fila("Borneros",bor.map(o=>o.id+" "+o.det.join("/").replace(/borna /g,"")).join(" · "))}${fila("Mangueras",man.map(o=>o.id+(o.det[0]&&!/cable del elemento/.test(o.det[0])?" ("+o.det[0]+")":"")).join(" · "))}${fila("Comprobar",prueba)}
  <div class="svfpf">⚠️ Sin ficha: faltan fabricante, referencia y especificaciones. Se completan al incorporarlo con la foto de su placa.</div></div>
  <button type="button" class="pri svfpi" onclick="event.stopPropagation();sosIncPend('${E(id)}')">➕ Incorporar ${E(id)} al catálogo</button></div>`}
window.sosIncPend=function(id){if(typeof abreComp!="function")return;abreComp();setTimeout(()=>{const q=document.getElementById("cn_q");if(q){q.value=id;q.dispatchEvent(new Event("input",{bubbles:true}))}
 if(typeof msg=="function")msg("Pulsa 📷 junto a "+id+" y haz la foto de su placa")},120)};
(function(){const st=document.createElement("style");st.textContent=`.svfpc{display:block!important}.svfpb{margin-top:6px;font-size:12.5px;line-height:1.35}
.svfp{display:grid;grid-template-columns:86px 1fr;gap:6px;padding:3px 0;border-top:1px dashed color-mix(in srgb,var(--tx,#888) 25%,transparent)}.svfp>.svfpk{font-weight:800;opacity:.75}.svfpv{min-width:0}
.svfpf{margin-top:6px;font-size:12px;color:#f2b705}.svfpi{width:100%;margin:8px 0 0!important;padding:9px!important;font-size:14px}`;document.head.appendChild(st)})();
/* ---------- v900: VARIOS ELEMENTOS EN SERIE EN EL MISMO CANAL (p. ej. IT-S2 / IT-S3, FC de inclinación superior e inferior) ----------
   Salían como dos fichas sueltas e idénticas (misma entrada, borneros y mangueras) sin explicar por qué. Son dos contactos distintos
   cableados en serie en el mismo lazo del módulo de seguridad: si se abre cualquiera, el PLC ve la misma alarma y la Magelis no dice
   cuál ha sido. Se agrupan en un bloque con el croquis del lazo (según el CABLEADO de los planos), el puente en el bornero de campo
   que anula SOLO uno (para saber cuál falla) y la medida punto a punto. */
const lidS=t=>String(t||"").replace(/^\+/,"").replace(/\[.*$/,"").replace(/\((.*)\)$/," ($1)").trim().toUpperCase();
function gruposSerie(ids){const CB=window.CABLEADO||{},U=new Set(ids.map(x=>String(x).toUpperCase())),vistos=new Set(),G=[];
 const ents=Object.keys(CB).map(k=>CB[k]).filter(e=>e&&e.m&&Array.isArray(e.n));
 /* el lazo se dibuja desde la salida de test (UT) si la hay: es el origen de la señal */
 ents.sort((a,b)=>(/^UT/i.test(b.k||"")?1:0)-(/^UT/i.test(a.k||"")?1:0));
 ents.forEach(e=>{const els=e.n.filter(n=>n.k=="E"&&U.has(lidS(n.t))).map(n=>lidS(n.t));if(els.length<2)return;
  const key=[...new Set(els)].sort().join("|");if(vistos.has(key))return;vistos.add(key);G.push({e,ids:[...new Set(els)]})});
 return G}
const nomEl=d=>{let t=String(d||"").replace(/^(F\.?\s*C\.?\s*)+/i,"FC ").toLowerCase().replace(/\bfc\b/g,"FC").replace(/cion\b/g,"ción").trim();return t?t[0].toUpperCase()+t.slice(1):""};
const zonaN=n=>n.k=="M"||n.k=="S"||/^E\d?-/.test(lidS(n.t))?"A":"C";
function croquisSerie(g){const CB=window.CABLEADO||{},e=g.e;
 const fin=e.n.find(n=>n.k=="M");const finE=fin?Object.values(CB).find(x=>x&&x.m==lidS(fin.t)&&x.b==fin.p):null;
 const filas=[{k:"S",id:e.m+" "+e.b,sub:e.k||"",z:"A"}].concat(e.n.filter(n=>n.k=="B"||n.k=="E").map(n=>({k:n.k,id:n.k=="B"?lidS(n.t)+":"+n.p:lidS(n.t),sub:n.k=="E"?nomEl(n.d):"",w:(n.v||[]).map(v=>v.m).filter(Boolean)[0]||"",z:zonaN(n),bor:n.k=="B"?lidS(n.t):""})));
 if(fin)filas.push({k:"S",id:lidS(fin.t)+" "+fin.p,sub:finE?finE.k||"":"",z:"A"});
 const H=36,X0=14,BW=196,top=18,alto=top+filas.length*H+8,y=i=>top+i*H+H/2;
 let s=`<svg class="svsersvg" viewBox="0 0 340 ${alto}" xmlns="http://www.w3.org/2000/svg" font-family="inherit">`;
 /* zonas: armario eléctrico / campo, separadas por línea discontinua */
 for(let i=1;i<filas.length;i++)if(filas[i].z!=filas[i-1].z){const yy=top+i*H-4;s+=`<line x1="4" y1="${yy}" x2="336" y2="${yy}" stroke="#8a94a6" stroke-dasharray="5 4" stroke-width="1"/>`}
 let zi=0;filas.forEach((f,i)=>{if(i==0||f.z!=filas[i-1].z){s+=`<text x="336" y="${top+i*H+9}" text-anchor="end" font-size="8.5" font-weight="800" fill="#8a94a6">${f.z=="A"?"ARMARIO ELÉCTRICO":"CAMPO"}</text>`;zi++}});
 /* hilo del lazo */
 /* hilo del lazo: solo entre cajas (no tapa los textos); cada manguera se rotula una vez */
 let wAnt="";filas.forEach((f,i)=>{const yy=y(i);
  if(i>0)s+=`<line x1="${X0+BW/2}" y1="${y(i-1)+12}" x2="${X0+BW/2}" y2="${yy-12}" stroke="#d64545" stroke-width="2"/>`;
  if(f.w&&i>0&&f.w!=wAnt)s+=`<text x="${X0+BW/2+5}" y="${yy-H/2+3}" font-size="8" fill="#8a94a6">${E(f.w)}</text>`;if(f.w)wAnt=f.w;
  const col=f.k=="S"?"#f2b705":f.k=="E"?"#ff7a1a":"#6b7a90",bg=f.k=="E"?"rgba(255,122,26,.16)":f.k=="S"?"rgba(242,183,5,.16)":"rgba(107,122,144,.14)";
  s+=`<rect x="${X0}" y="${yy-12}" width="${BW}" height="24" rx="${f.k=="B"?3:7}" fill="${bg}" stroke="${col}" stroke-width="${f.k=="B"?1:1.6}"/>`;
  s+=`<text x="${X0+8}" y="${yy+4}" font-size="11" font-weight="800" fill="${col}">${E(f.id)}</text>`;
  if(f.sub)s+=`<text x="${X0+BW-6}" y="${yy+4}" text-anchor="end" font-size="9" fill="${col}">${E(f.k=="S"?f.sub:f.sub.replace(/^FC\s+/,"").replace(/^inclinación\s+/i,""))}</text>`});
 /* puentes en el bornero de campo que anulan SOLO un elemento */
 const pu=[];filas.forEach((f,i)=>{if(f.k!="E"||!g.ids.includes(f.id))return;let a=i-1,b=i+1;while(a>=0&&filas[a].k!="B")a--;while(b<filas.length&&filas[b].k!="B")b++;
  if(a>=0&&b<filas.length&&filas[a].bor&&filas[a].bor==filas[b].bor){pu.push({id:f.id,sub:f.sub,a,b,bor:filas[a].bor,pa:filas[a].id.split(":")[1],pb:filas[b].id.split(":")[1]})}});
 pu.forEach((p,j)=>{const xr=X0+BW,xx=xr+22+j*26,ya=y(p.a),yb=y(p.b);
  s+=`<path class="svserpu" d="M${xr} ${ya} H${xx} V${yb} H${xr}" fill="none" stroke="#ff7a1a" stroke-width="2" stroke-dasharray="5 3"/>`;
  s+=`<text x="${xx+4}" y="${(ya+yb)/2+3}" font-size="8.5" font-weight="800" fill="#ff7a1a">${j+1}</text>`});
 s+=`</svg>`;return{svg:s,pu,filas}}
/* v901: puntos seguros para la borna negra (0 V de 24 Vcc) al medir un lazo en campo: primero el 0 V del bornero de campo donde se
   mide (mismo bornero, sin cables largos), luego otro de la misma manguera y los del armario (E-X68:2 = GND del módulo de seguridades). */
const REF0C={IT:["IT-X51:2","0 V al túnel por la manguera EIT-W1; en el mismo bornero que se mide (el más cómodo)"],ET:["ET-X51:2","0 V del túnel exterior"],C:["C-X51:2","0 V de cabina"],H:["H-X51:30","0 V de la elevación"]};
const ref0b=c=>{const f=c.filas.find(x=>x.k=="B"&&!/^E\d?-/.test(x.bor));return f?f.bor:"IT-X51"};
function ref0(c){const pre=(ref0b(c).match(/^([A-Z]+\d?)-/)||["","IT"])[1],L=[];
 const add=k=>{const r=REF0C[k];if(r&&!L.some(t=>t.includes(r[0])))L.push(`<b>${E(r[0])}</b>: ${E(r[1])}${L.length?"":" (1ª opción)"}`)};
 add(pre);if(pre=="IT")add("ET");else add("IT");
 L.push(`<b>E-X68:2</b>: 0 V del propio módulo de seguridades (GND de E-A5), en el armario: referencia «oficial» de la salida de test`);
 L.push(`<b>E-X62:2</b>: 0 V de los sensores analógicos (altura, láser), en el armario`);
 L.push(`<b>E-X61:21</b>: 0 V general de la PBB, en el CBTH`);return L}
function bloqueSerie(g,A){const c=croquisSerie(g),els=c.filas.filter(f=>f.k=="E"&&g.ids.includes(f.id));
 const ori=c.filas[0],des=c.filas[c.filas.length-1];const n=els.length;
 const tipo=els.every(f=>/-S\d/.test(f.id))?"FC":"elementos";
 const pos=els.map(f=>{const m=f.sub.match(/superior|inferior/i);return m?`<li>Túnel en su extremo <b>${m[0].toLowerCase()}</b> → apunta a <b>${E(f.id)}</b>.</li>`:""}).join("");
 const med=[];for(let i=1;i<c.filas.length;i++){const f=c.filas[i];if(f.k=="B"&&/^[A-Z]{1,3}-X/.test(f.bor)&&!/^E\d?-/.test(f.bor))med.push(f.id)}
 let tramo="";for(let i=0;i<c.filas.length;i++){const f=c.filas[i];if(f.k=="E"&&g.ids.includes(f.id)){let a=i-1;while(a>=0&&c.filas[a].k!="B")a--;let b=i+1;while(b<c.filas.length&&c.filas[b].k!="B")b++;
  if(a>=0&&b<c.filas.length)tramo+=`<li>Hay tensión en <b>${E(c.filas[a].id)}</b> y no en <b>${E(c.filas[b].id)}</b> → abierto <b>${E(f.id)}</b> (${E(f.sub)}).</li>`}}
 const pus=c.pu.map((p,j)=>`<li><b>Puente ${j+1}:</b> ${E(p.bor)} borna ${E(p.pa)} ↔ ${E(p.pb)} → anula solo <b>${E(p.id)}</b> (${E(p.sub)}). Si con él se rearma la línea de seguridades, el que falla es <b>${E(p.id)}</b>.</li>`).join("");
 return`<div class="svser"><div class="svserh">⛓️ ${n} ${tipo} EN SERIE · MISMO CANAL<small>${E(ori.id)} (${E(ori.sub)}) → ${E(des.id)} (${E(des.sub)})</small></div>
  <div class="svsert">No es un duplicado: son <b>${n} contactos distintos</b> (${els.map(f=>`${E(f.id)} ${E(f.sub.replace(/^FC\s+/,""))}`).join(" · ")}) cableados <b>en serie</b> en el mismo lazo de seguridad de ${E(g.e.m)}. Por eso comparten entrada, borneros y mangueras. Si se abre <b>cualquiera</b> de los dos, el PLC ve la misma alarma y la Magelis <b>no dice cuál ha sido</b>: se distingue en campo.</div>
  <div class="svsercro">${c.svg}</div>
  <div class="svserl">CÓMO SABER CUÁL FALLA</div>
  <ol class="svserol">${pos?`<li><b>Posición:</b><ul>${pos}</ul></li>`:""}
   ${tramo?`<li><b>Medir</b> en V DC, siguiendo el lazo desde ${E(ori.id)} (${E(ori.sub)}): ≈ 24 V (señal de test pulsada, el polímetro puede marcar algo menos).
    <div class="svser0"><b>Borna negra (0 V de 24 Vcc), puntos seguros:</b><ul>${ref0(c).map(t=>`<li>${t}</li>`).join("")}</ul>
    <b>Antes de medir, validar la referencia:</b> roja en <b>${E(ref0b(c))}:1</b> (+24 V) y negra en el 0 V elegido → ≈ 24 V. Si no marca, ese punto no vale o el 0 V está suelto.
    <br>⚠️ No usar estructura ni carcasa metálica como 0 V. Comprobar en el portaetiquetas que la borna es la de 0 V (en el bornero hay otros circuitos, p. ej. iluminación).</div>
    <ul>${tramo}</ul></li>`:""}
   ${pus?`<li><b>Puente provisional en el bornero de campo</b> (2ª opción, para identificar):<ul>${pus}</ul></li>`:""}</ol>
  <div class="svsern">⚠️ Para sacar la PBB ya, el puente en el PLC (${E(g.e.m)} ${E(ori.id.split(" ")[1]||"")} ↔ ${E(des.id.split(" ")[1]||"")}) anula <b>los ${n}</b> (1ª opción). Cualquier puente: provisional, con un compañero vigilando el movimiento, y se quita al reparar.</div>
  <div class="svbs">${els.map(f=>A.pend.find(r=>String(r[0]).toUpperCase()==f.id)).filter(Boolean).map(r=>fichaPlanos(r,A)).join("")}</div></div>`}
(function(){const st=document.createElement("style");st.textContent=`.svser{border:1.5px solid #ff7a1a;border-radius:12px;padding:10px;margin:8px 0;background:rgba(255,122,26,.05)}
.svserh{font-weight:900;font-size:14px;letter-spacing:.3px;color:#ff7a1a}.svserh small{display:block;font-weight:600;font-size:11.5px;opacity:.8;letter-spacing:0;color:var(--tx,inherit)}
.svsert{font-size:12.5px;line-height:1.4;margin:6px 0}.svsercro{margin:6px auto;max-width:360px}.svsersvg{width:100%;height:auto;display:block}
.svserl{font-weight:900;font-size:12.5px;margin-top:6px;color:#2fbf71}.svserol{margin:4px 0 0 18px;padding:0;font-size:12.5px;line-height:1.4}.svserol ul{margin:2px 0 4px 14px;padding:0}
.svsern{font-size:12px;color:#f2b705;margin:6px 0}.svser0{font-size:12px;margin:4px 0 4px;padding:6px 8px;border-left:3px solid #2fbf71;background:rgba(47,191,113,.08);border-radius:4px}.svser0 ul{margin:2px 0 4px 14px;padding:0}.svrol{font-size:11px;font-weight:900;text-transform:uppercase;color:#ff7a1a;border:1px solid #ff7a1a;border-radius:5px;padding:0 5px;margin-left:4px;vertical-align:middle}`;document.head.appendChild(st)})();
function pendHTML(A){const G=gruposSerie((A.pend||[]).map(r=>r[0]));const usados=new Set(G.flatMap(g=>g.ids));
 return G.map(g=>bloqueSerie(g,A)).join("")+`<div class="svbs">${A.pend.filter(r=>!usados.has(String(r[0]).toUpperCase())).map(r=>fichaPlanos(r,A)).join("")}</div>`}
function bloqueComp(A){let b;
 if(A.C.length==1)b=`<div class="svok">Acotado con el síntoma en campo${A.cod.length?" y la alarma "+E(A.cod.map(z=>z.x.c).join(" / ")):""}.</div>${fichaH(A.C[0])}`;
 else if(A.C.length>1)b=`<div class="svok">No está claro cuál de estos interviene: elige el que corresponda (detalla la avería para acotarlo).</div>
  <div class="svbs">${A.C.map(c=>`<button type="button" class="rcscb svb" data-k="${E(clave(c))}"><span class="cmpid">${E(c.id)}</span> ${E(c.t)}${c.fab?`<small>${E(c.fab)}</small>`:""}</button>`).join("")}</div><div id="sv_fi"></div>`;
 else if((A.pend||[]).length)b=`<div class="svok">${(A.I||[]).length?"Elementos de campo de la alarma según planos, <b>aún no incorporados</b> en Componentes de campo (ficha pendiente):":"El elemento de la avería está en los planos pero <b>aún no está incorporado</b> en Componentes de campo (los borneros y el módulo del PLC por los que pasa la señal no se proponen como componente a intervenir):"}</div>
  ${pendHTML(A)}`;
 else b=`<div class="svok">Con lo descrito no se identifica un componente del catálogo. Detalla el elemento (p. ej. «láser de extensión», «potenciómetro de cabina») o búscalo en el catálogo.</div>
  <button type="button" class="sec" style="width:100%" onclick="typeof compCatalogo=='function'&&compCatalogo()">CATÁLOGO DE COMPONENTES</button>`;
 return`<div class="ubh ubcmp" id="sv_cmp">🔩 COMPONENTE A INTERVENIR<small>${A.C.length==1?"Ficha técnica del componente":"Especificaciones técnicas"}</small></div><div class="ubb ubbcmp">${b}</div>`}

/* ---------- v705: 1 · SACAR EN SERVICIO YA según PLANOS, alarma por alarma ----------
   Con alarmas validadas, el bloque 1 empieza por lo que dicen los planos para cada una (rcsSacar): puente provisional en la
   entrada del módulo amarillo (con su croquis), setas y medidas 4-20 mA que no se puentean, advertencias que resuelve el
   operador. El croquis sale de los planos (no del texto mezclado de varias alarmas); en las que no tienen puente de seguridad
   se dibuja el que da el texto de ESA alarma sola. Lo que el análisis por texto proponía queda debajo, plegado. */
const TIT={puente:"🔌 Puente provisional en el módulo de seguridad",anap:"⚡ Actuación rápida de campo · puente provisional de resistencia",seta:"🛑 Parada de emergencia · no se puentea",ana:"📈 Medida analógica · no se puentea",
 nopte:"⛔ Entrada de seguridad · no se puentea",op:'<img class="rcsico" src="iconos/advertencia.png" alt="Advertencia"> La resuelve el operador · no es avería',rem:"🔵 Puesto remoto",txt:"⚡ Actuación"};
/* v735: opciones numeradas (1º, 2º, 3º…) cada una en su línea, como en la caja de la alarma */
const ACC=t=>typeof rcsAccHTML=="function"?rcsAccHTML(t):E(t);
/* v736: el croquis sacado por TEXTO tiene que ser del mismo sistema que la alarma: «258 Límite derecho de giro rotonda»
   sacaba E-A3 8.1 «Límite giro traslación derecha» (casaban «límite», «giro» y «derecha»). Si la alarma nombra un sistema
   (rotonda, traslación, cabina…), solo valen los puentes de entradas de ese sistema. */
const SIS=[["rot",/rotonda/i],["tra",/traslaci|bogie|ruedas?\b/i],["cab",/cabina/i],["ext",/extensi|retracc|t[uú]nel/i],["ele",/inclinaci|elevaci|altura|subir|bajar/i],["por",/port[oó]n/i],["zap",/zapata/i],["bum",/bumper/i],["ata",/antiatrap/i],["hz",/400\s*hz|recogedor/i],["aa",/aire acond|\bA\/A\b|carro/i]];
const sisDe=t=>SIS.filter(([,re])=>re.test(String(t||""))).map(([k])=>k);
function mismoSis(tAl,o){/* v854: «Bumper del ala» (015) no es bumper de cabina ni de brazo */if(/bumper/i.test(tAl)&&/\balas?\b/i.test(tAl)&&/bumper/i.test([o.d,o.k1].join(" ")))return false;const A=sisDe(tAl);if(!A.length)return true;const C=sisDe([o.d,o.k1,(o.el||[]).join(" "),o.sd].join(" "));return !C.length||C.some(k=>A.includes(k))}
function sacarHTML(A){const X=A.cod.map(z=>z.x);const R=X.map(x=>{try{return rcsSacar(x)}catch(e){return null}}).filter(Boolean);if(!R.length)return null;
 const mk=d=>({id:"sosv_"+d.length,pos:"",tipo:"PAS",equipos:["PAS"],estado:"abierta",desc:d,def:"",com:"",obs:"",orden:"SOS",fecha:""});
 const cro=[];R.forEach(r=>{if(r.tipo=="puente")r.cro.forEach(o=>cro.push(o));
  else if(r.tipo=="txt"||r.tipo=="op"){try{if(typeof _croqLista=="function")_croqLista(mk(r.x.c+" "+r.x.t)).filter(o=>mismoSis(r.x.t,o)).forEach(o=>{if(!cro.some(q=>q.mod==o.mod&&q.b1==o.b1&&q.b2==o.b2))cro.push(Object.assign({},o,{d:r.x.c+" · "+(o.d||"")}))})}catch(e){}}});
 const lin=R.map(r=>{let p="";
  /* v888: con «1º…» (actuación sin herramientas primero) el puente va después, «si no se recupera así»; con dos lados, cada puente
     lleva su señal (p. ej. FRENO CABINA IZDA / DCHA) para hacer SOLO el del lado apagado */
  if(r.tipo=="puente"){const pri1=/^1º/.test(r.txt||""),dos=r.cro.length>1;
   const pu=r.cro.map(o=>`<div class="puac">${pri1?"Si no se recupera así · ":""}En <b>MANUAL</b> y con un compañero vigilando: <b>puente provisional en ${E(o.mod)} ${E(o.b1)} (${E(o.k1)}) ↔ ${E(o.b2)} (${E(o.k2)})</b>${dos&&o.sd?` · solo si es ${E(o.sd.toLowerCase())}`:""}${o.el&&o.el.length?` · libera ${E(o.el.join(" / "))}`:""}. Mover en sentido contrario para salir de la seguridad y avisar a CGA.</div>`).join("");
   const tx=`<div class="puac">${ACC(r.txt.replace(/^Módulo safety amarillo .*?vigilando\)?\.\s*/,""))}</div>`;
   p=(pri1?tx+pu:pu+tx)+`<div class="puac">Prueba: quitar el puente, modo OFF → ON y comprobar en la Magelis que la ${E(r.x.c)} no vuelve a entrar.</div>`}
  else if(r.tipo=="anap")p=r.an.p.map(t=>`<div class="puac">${E(t)}</div>`).join("")+`<div class="puac">Solo en MANUAL y con un compañero vigilando; avisar a CGA. Reparar el sensor o su manguera, quitar la resistencia y volver a conectar el conductor.</div><div class="puac">Prueba: con el puente puesto la ${E(r.x.c)} se borra tras OFF → ON; al reparar, comprobar en la Magelis que la medida varía en todo el recorrido.</div>`;
  else p=`<div class="puac">${ACC(r.txt)}</div>`;
  return`<div class="svsa"><div class="svsah">${typeof rcsIco=="function"&&r.x.f!="R"?rcsIco(r.x.f)+" ":""}<b>${E(r.x.c)}</b> ${E(r.x.t)} · <span>${r.tipo=="puente"&&r.cro.length&&!/^E-A(8|9|10)$/.test(r.cro[0].mod)?"🔌 Puente provisional en la entrada del PLC ("+E(r.cro[0].mod)+", módulo verde)":(TIT[r.tipo]||TIT.txt)}</span></div>${p}</div>`}).join("");
 try{if(window.croqLado)cro.sort(window.croqLado)}catch(e){}
 const croH=cro.length&&typeof croquisPuente=="function"?`<div class="card gcroq ubcro svcro"><div class="gcrh">${(window.croqTit?croqTit(cro):{ic:"🔌"}).ic} ${(window.croqTit?croqTit(cro):{t:"Croquis del puente provisional"}).t} según planos · módulo ${E([...new Set(cro.map(o=>o.mod))].join(" / "))}${window.croqTit?croqTit(cro).n:""}</div><div class="gcrs">${cro.map(o=>{try{return`<div class="gcri">${croquisPuente(o,5)}</div>`}catch(e){return""}}).join("")}</div></div>`:"";
 /* croquis de los puentes analógicos (los mismos de la guía de campo, Observaciones de «Medidas analógicas») */
 const K=window.CROQ_AN||{};const ak=[];R.forEach(r=>{if(r.tipo=="anap")r.an.k.forEach(k=>{if(K[k]&&!ak.includes(k))ak.push(k)})});
 const anH=ak.length?`<div class="card gcroq ubcro svcro"><div class="gcrh">⚡ Actuación rápida de campo · puente provisional de resistencia${ak.length>1?` · ${ak.length} croquis (desliza)`:""}</div><div class="gobss">${ak.map(k=>K[k]).join("")}</div></div>`:"";
 /* v743: 115 atraque incorrecto / 243 contacto con avión → OPCIÓN: puente provisional del contacto que da señal sin avión */
 const atq=R.some(r=>/^(115|243)$/.test(String(r.x.c)))&&typeof atqCroqOpcion=="function"?atqCroqOpcion():"";
 const opH=atq?`<div class="card gcroq ubcro svcro svopc"><div class="gcrh">✂️ OPCIÓN · soltar cable si un contacto con avión da señal SIN avión · 2 cables (desliza)</div>
  <div class="puac">1º desatracar con el <b>bypass naranja + joystick hacia ATRÁS</b> (lento). Si la 115 / 243 vuelve sin avión: mirar en P-A5 el LED <b>1.1 (C-B51 derecho)</b> o <b>4.4 (C-B52 izquierdo)</b>; desenchufar el M12 de ese sensor y, si el LED sigue encendido, soltar y aislar su hilo (<b>320</b> / <b>740</b>). Solo MANUAL y con compañero vigilando ese lado.</div>
  <div class="gobss">${atq}</div></div>`:"";
 return{croH:croH+anH+opH,cardH:`<div class="card pucard svsac"><div class="pucab">📐 SEGÚN PLANOS · ${R.length>1?R.length+" alarmas, una por una":"alarma "+E(R[0].x.c)}</div>${lin}</div>`}}
function ponSacar(A,res){const b1=res.querySelector(".ubb1");if(!b1||!A.cod.length||A.est=="nada"||A.est=="noal")return;
 b1.querySelectorAll(".svsac,.svcro,details.svtxt").forEach(x=>{if(x.matches("details.svtxt"))[...x.childNodes].forEach(c=>{if(c.tagName!="SUMMARY")b1.appendChild(c)});x.remove()});
 const S=sacarHTML(A);if(!S)return;
 const resto=[...b1.childNodes].filter(n=>!(n.nodeType==3&&!n.textContent.trim()));
 const d=document.createElement("div");d.innerHTML=S.croH+S.cardH;const nuevos=[...d.childNodes];
 /* lo propuesto por el texto mezclado queda plegado debajo (el croquis de texto se sustituye por el de planos) */
 if(resto.length){const det=document.createElement("details");det.className="ubfold svtxt";det.innerHTML="<summary>Más indicaciones según el texto (complementarias)</summary>";
  resto.forEach(n=>{if(S.croH&&n.classList&&n.classList.contains("ubcro"))n.remove();else det.appendChild(n)});if(det.childNodes.length>1)b1.appendChild(det)}
 nuevos.reverse().forEach(n=>b1.prepend(n))}
window.__sosValAnaliza=analiza;
/* v711: el mismo bloque «según planos» para la guía de campo de una OT (llave de la tarjeta) */
window.rcsSacarHTML=function(xs){try{return sacarHTML({cod:(xs||[]).filter(Boolean).map(x=>({x}))})}catch(e){console.warn("rcsSacarHTML",e);return null}};
window.sosValCmp=()=>{const h=$("sv_cmp");if(h)h.scrollIntoView({block:"start",behavior:"smooth"})};
function pon(){const res=$("sr_res");if(!res||!res.querySelector(".ub1"))return;
 res.querySelectorAll("#sv_al,#sv_cmp,#sv_cmp+.ubbcmp").forEach(x=>x.remove());
 const A=analiza();window.__sosVal=A;
 const d=document.createElement("div");
 d.innerHTML=bloqueAlarma(A);res.insertBefore(d.firstChild,res.firstChild);
 const h2=res.querySelector(".ub2");d.innerHTML=bloqueComp(A);
 while(d.firstChild){h2?res.insertBefore(d.firstChild,h2):res.appendChild(d.firstChild)}
 try{ponSacar(A,res)}catch(e){console.warn("sos-valida sacar",e)}
 /* v816: el croquis ya está arriba, tras la alarma: no se repite en «1 · En servicio ya» */
 try{if(res.querySelector("#sv_al .svcroal .svcro"))res.querySelectorAll(".ubb1 .svcro").forEach(x=>x.remove())}catch(e){}
 res.querySelectorAll("#sv_al button.rcsi").forEach(b=>b.onclick=()=>{if(typeof abreCompClaves=="function")abreCompClaves([b.dataset.k],"Alarma validada")});
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
.svsa{border-top:1px solid #8884;padding-top:6px;margin-top:6px}.svsa:first-of-type{border-top:0;margin-top:0;padding-top:0}
.svsah{font-size:13.5px;margin-bottom:2px}.svsah span{font-weight:700;color:var(--mu,#78909c)}
.svbs{display:flex;flex-direction:column;gap:4px}.svb.on{border-color:#1fa64a!important;border-left-color:#1fa64a!important}`;
document.head.appendChild(st);
})();
