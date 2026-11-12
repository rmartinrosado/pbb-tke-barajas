/* v98: el SOS busca también casos parecidos en la carpeta Casos */
/* ===== v67/v68: botón SOS en la tarjeta de OT (Seguimiento OT) =====
 Va debajo del indicador ABIERTA, a la derecha. Solo aparece si la OT tiene puente provisional
 (puentesOT) o indicación de seguridades/límite (segOT). Al pulsarlo abre la guía mostrando
 únicamente la indicación del puente («Primera actuación en campo»). */
(function(){
let sosOn=false;
const tiene=i=>{try{return !!i&&i.estado=="abierta"&&((typeof puentesOT=="function"&&puentesOT(i).length)||(typeof segOT=="function"&&segOT(i))||(typeof hidrOT=="function"&&hidrOT(i))||(typeof resetAplica=="function"&&resetAplica(i)))}catch(e){return false}};
/* v225: en modo Operador el SOS de la tarjeta también abre la primera actuación (antes render() mandaba a Inicio
 porque la guía era solo de Técnico/Admin). Fuera del SOS, el Operador sigue sin ver la guía completa. */
window.sosActivo=()=>sosOn;
/* v130: también la primera actuación de hidráulica (hidraulica.js: hidrOT / hidrHTML, sin puentes) */
const oC=card;card=function(i){let h=oC(i);if(view!="track"||!tiene(i))return h;
 const b=`<button class="sosb" title="SOS: puente provisional" aria-label="SOS: ir al puente provisional de la OT ${esc(i.orden||"")}" onclick="event.stopPropagation();sosVa('${i.id}')"><img src="sos.png" alt="SOS"></button>`;
 /* v68: en la fila de botones de abajo, al lado de la papelera (o al final del grupo izquierdo si no hay papelera) */
 /* v69: centrado en el hueco entre el grupo izquierdo (Editar/papelera) y el derecho (estrellas…) */
 let k=h.indexOf('<span class="cacl">');if(k>=0){const e=h.indexOf("</span>",k);if(e>=0)return h.slice(0,e+7)+`<span class="sosmid">${b}</span>`+h.slice(e+7)}
 const a=h.indexOf("ABIERTA");if(a<0)return h;const e=h.indexOf("</div>",a);return e<0?h:h.slice(0,e+6)+`<div class="sosw">${b}</div>`+h.slice(e+6)};
window.sosVa=function(id){const i=inc.find(x=>x.id==id);if(!i)return;sosOn=true;gOT=id;if(typeof gSyncOT!="undefined")gSyncOT=id;
 if(typeof gTipoOT=="function")gTipo=gTipoOT(i);if(view!="tec")go("tec");else vTec();scrollTo(0,0)};
window.sosSal=function(){sosOn=false;const a=document.getElementById("app");if(a)a.classList.remove("sosmode");vTec();scrollTo(0,0)};
/* v120: al salir del SOS (Inicio u otra sección de la tira) se quita el modo SOS de #app; antes la clase sosmode
 se quedaba puesta y ocultaba todo el contenido de Inicio. */
const sosLimpia=()=>{sosOn=false;const a=document.getElementById("app");if(a)a.classList.remove("sosmode");["sosbar","soscasos"].forEach(id=>{const e=document.getElementById(id);if(e)e.remove()})};
const oG=go;go=function(v,f){if(v!="tec")sosLimpia();return oG(v,f)};
const oR=render;render=function(){if(view!="tec")sosLimpia();return oR.apply(this,arguments)};
const oV=vTec;vTec=function(){const r=oV.apply(this,arguments);const app=document.getElementById("app");if(!app)return r;
 if(!sosOn){app.classList.remove("sosmode");return r}
 const i=inc.find(x=>x.id==gOT);if(!tiene(i)){sosOn=false;app.classList.remove("sosmode");return r}
 let pu=document.getElementById("gpte"),se=document.getElementById("gsegl");
 const P=puentesOT(i),S=segOT(i);
 if(!pu&&P.length){pu=document.createElement("div");pu.id="gpte";pu.className="card pucard";pu.innerHTML=puenteHTML(i,P)}
 if(!se&&S){se=document.createElement("div");se.id="gsegl";se.className="card pucard";se.innerHTML=segHTML(i,S)}
 let hi=document.getElementById("ghidr");const H=typeof hidrOT=="function"?hidrOT(i):null;
 if(!hi&&H){hi=document.createElement("div");hi.id="ghidr";hi.dataset.k=H;hi.className="card pucard";hi.innerHTML=hidrHTML(i,H)}
 let bar=document.getElementById("sosbar");if(!bar){bar=document.createElement("div");bar.id="sosbar";bar.className="card sosbar"}
 bar.innerHTML=`<img src="sos.png" alt=""><div><b>PBB ${esc(String(i.pos))} · ${esc(i.tipo||"")} · ${esc(i.orden||"")}</b><div class="mu" style="font-size:12px">${esc(i.desc||"")}</div></div>${(tecnico||admin)?`<button class="sec" onclick="sosSal()">Guía completa</button>`:`<button class="sec" onclick="go('track')">Volver</button>`}`;
 app.prepend(bar);[hi,se,pu].forEach(x=>{if(x)bar.after(x)});if(se&&pu)se.after(pu);if(hi){const u=pu||se;if(u)u.after(hi)}
 app.classList.add("sosmode");sosCasos(i);return r};
/* v98: casos parecidos de la carpeta Casos bajo la primera actuación */
async function sosCasos(i){const txt=[i.desc,i.def,i.com,i.alarmas&&textoAl(i.alarmas)].filter(Boolean).join(" · ");if(typeof casosParecidos!="function"||!txt)return;
 let l=[];try{l=await casosParecidos(txt,{excluirOt:i.id})}catch(e){return}
 const app=document.getElementById("app");if(!sosOn||!app||gOT!=i.id)return;let c=document.getElementById("soscasos");if(c)c.remove();if(!l.length)return;
 c=document.createElement("div");c.id="soscasos";c.innerHTML=casosHTML(l,i.pos);const last=document.getElementById("ghidr")||document.getElementById("gpte")||document.getElementById("gsegl")||document.getElementById("sosbar");last.after(c)}
const textoAl=a=>{try{return typeof a=="string"?a:JSON.stringify(a).replace(/[{}\[\]"]/g," ")}catch(e){return ""}};
const st=document.createElement("style");st.textContent=`.sosw{display:flex;justify-content:flex-end;margin-top:8px}
.sosmid{flex:1 1 0;min-width:0;display:flex;justify-content:center;align-items:center}.sosmid+.cacr{margin-left:0!important}
.sosb{width:40px!important;height:40px;padding:0!important;margin:0!important;border:0!important;background:none!important;box-shadow:none!important;border-radius:50%;cursor:pointer;flex:none}
.sosb img{width:40px;height:40px;display:block;border-radius:50%;filter:drop-shadow(0 2px 4px rgba(198,40,40,.4));animation:sosparp 2s ease-in-out infinite}@keyframes sosparp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.92)}}.sosb:active img{transform:scale(.94)}
#app.sosmode>*:not(#sosbar):not(#greset):not(#gpte):not(#gsegl):not(#ghidr):not(#soscasos):not(#gcroq){display:none!important}
.sosbar{display:flex;align-items:center;gap:10px;border:2px solid #c62828!important}.sosbar img{width:40px;height:40px;flex:none}.sosbar>div{flex:1;min-width:0}.sosbar button{width:auto;margin:0;padding:8px 10px;font-size:13px;flex:none}`;document.head.appendChild(st);
})();
/* ===== v71: SOS rápido en Inicio (junto a OT abiertas / OT cerradas) =====
 Solo se introduce la posición PBB y la foto de la Magelis (o de su pantalla de alarmas). Se lee la foto (OCR),
 se analiza como una OT de pasarela y se presenta ÚNICAMENTE la «Primera actuación en campo» (puente provisional). */
(function(){
const oD=vDash;vDash=function(){const r=oD.apply(this,arguments);try{
 const k=document.querySelector("#app .card.kpi");const g=k&&k.parentElement;if(!g||g.querySelector(".sosk"))return r;
 g.classList.add("sosgrid");g.insertAdjacentHTML("beforeend",`<div class="card kpi sosk sos2" role="group" onclick="if(event.target===this)sosRap()"><button class="sos2b sos2s" onclick="event.stopPropagation();sosRap()" aria-label="SOS: primera actuación en campo"><img src="sos.png" alt="SOS"></button><button class="sos2b sos2l" onclick="event.stopPropagation();lupaAbre()" aria-label="Lupa: buscar la actuación más eficaz de cualquier sistema" title="Buscar actuación más eficaz"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg></button></div>`)}catch(e){}return r};
let foto=null,fotoURL="";
/* v73: alarmas de la Magelis con puente provisional o indicación de seguridades (comprobadas con el análisis de OT) */
const SOS_AL=[
 ["Seguridades / cabina",[["Zapata activada","ZAPATA ACTIVADA"],["Fallo autonivelación subir","FALLO AUTONIVELACION SUBIR"],["Fallo autonivelación bajar","FALLO AUTONIVELACION BAJAR"],["Sensores neutrales brazo","FALLO AUTONIVELACION SENSORES NEUTRALES"],["Bumper brazo autonivelador","BUMPER BRAZO AUTONIVELADOR"],["Bumper lateral cabina","BUMPER LATERAL CABINA"],["Línea de seguridades activada","LINEA DE SEGURIDAD ACTIVADA"],["Protección seguridades 1","PROTECCION DE SEGURIDADES 1 ACTIVADO"],["Protección seguridades 2","PROTECCION DE SEGURIDADES 2 ACTIVADO"]]],
 ["Antiatrapamiento y accesos",[["Antiatrapamiento túnel interior (A-B)","ANTIATRAPAMIENTO TUNEL INTERIOR"],["Antiatrapamiento túnel medio (B-C)","ANTIATRAPAMIENTO TUNEL MEDIO"],["Sensor portón enrollable","SENSOR PORTON ENROLLABLE"],["Puerta de servicio abierta","INDUCTIVO PUERTA DE SERVICIO"],["Barrera seguridad rotonda","BARRERA SEGURIDAD ROTONDA"]]],
 ["Límites",[["Límite extensión","LIMITE EXTENSION ACTIVADO"],["Límite retracción","LIMITE RETRACCION ACTIVADO"],["Límite traslación","LIMITE TRASLACION ACTIVADO"],["Límite giro traslación","LIMITE GIRO TRASLACION"],["Límite rotonda","LIMITE ROTONDA ACTIVADO"],["Límite inclinación","LIMITE INCLINACION ACTIVADO"],["Límite cabina","LIMITE CABINA"],["Límite suelo","LIMITE SUELO ACTIVADO"]]],
 /* v435: SEGURIDADES FC ACTIVADAS · todos los finales de carrera y elementos de seguridad de movimiento y maniobra (módulos safety
    amarillos E-A8, E-A9, E-A10). Primera actuación: croquis del puente provisional en la entrada del módulo correspondiente. */
 ["Seguridades FC activadas",[
  ["FC seguridad traslación (H-S1 · E-A8 5.1)","FC SEGURIDAD TRASLACION PISADO"],
  ["FC seguridad extensión túneles (ET-S1 · E-A8 6.1)","FC SEGURIDAD EXTENSION PISADO"],
  ["FC seguridad rotonda (CO-S1 · E-A8 7.1)","FC SEGURIDAD ROTONDA PISADO"],
  ["FC seguridad inclinación inferior (IT-S3 · E-A8 8.1)","FC SEGURIDAD INCLINACION INFERIOR PISADO"],
  ["FC seguridad inclinación superior (IT-S2 · E-A8 8.1)","FC SEGURIDAD INCLINACION SUPERIOR PISADO"],
  ["Bordes de seguridad de ruedas (T-B5 / T-B6 · E-A8 2.1)","BORDE DE SEGURIDAD RUEDAS ACTIVADO"],
  ["Sensor portón enrollable (C-S9 · E-A8 1.1)","SENSOR PORTON ENROLLABLE ACTIVADO"],
  ["Antiatrapamiento túnel interior izquierdo (E-A9 5.1)","ANTIATRAPAMIENTO TUNEL INTERIOR IZQUIERDO"],
  ["Antiatrapamiento túnel interior derecho (E-A9 6.1)","ANTIATRAPAMIENTO TUNEL INTERIOR DERECHO"],
  ["Antiatrapamiento túnel medio izquierdo (E-A9 2.1)","ANTIATRAPAMIENTO TUNEL MEDIO IZQUIERDO"],
  ["Antiatrapamiento túnel medio derecho (E-A9 8.1)","ANTIATRAPAMIENTO TUNEL MEDIO DERECHO"],
  ["Zapata de seguridad cabina (C-B4 · E-A10 8.1)","ZAPATA DE SEGURIDAD ACTIVADA"],
  ["Bumper brazo autonivelador (C-B27 / C-B28 · E-A10 1.1)","BUMPER BRAZO AUTONIVELADOR ACTIVADO"],
  ["Bumper lateral cabina (C-B30 / C-B29 · E-A10 2.1)","BUMPER LATERAL CABINA ACTIVADO"],
  ["Barrera de seguridad rotonda (R-B4 · E-A10 3.1)","BARRERA SEGURIDAD ROTONDA ACTIVADA"],
  ["Inductivo puerta de servicio (SS-B15 · E-A10 4.1)","INDUCTIVO PUERTA DE SERVICIO ACTIVADO"]]],
 ["Traslación",[["Bordes de ruedas","BORDE SEGURIDAD DELANTERO TRASERO"],["Freno manual izquierdo","FRENO MANUAL MOTOR IZQUIERDO"],["Freno manual derecho","FRENO MANUAL MOTOR DERECHO"]]],
 ["Bloqueos por equipos de servicio",[["Bloqueo PBB carro A/A","BLOQUEO PBB CARRO A/A"],["Bloqueo PBB máquina A/A","BLOQUEO PBB MAQUINA A/A"],["Bloqueo convertidor 400 Hz en servicio","BLOQUEO PBB CONVERTIDOR EN SERVICIO"],["Bloqueo 90 % conector 400 Hz","BLOQUEO PBB 90% CONECTOR"]]]];
const tess=()=>window.Tesseract?Promise.resolve():new Promise((ok,ko)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";s.onload=ok;s.onerror=ko;document.head.appendChild(s)});
const lista=()=>{const P=(typeof POS!="undefined"&&Array.isArray(POS))?POS:[];return P.map(p=>`<option value="${esc(String(p))}">`).join("")};
window.sosRap=function(){foto=null;fotoURL="";
 $("#sheetc").innerHTML=`<div class="sosrh"><img src="sos.png" alt=""><div><h3 style="margin:0">SOS - ACTUACIÓN DIRECTA</h3><div class="mu" style="font-size:12px">Posición y alarma activada (o foto de la Magelis). Se muestra solo el puente provisional.</div></div></div>
 <label>Posición PBB</label><input id="sr_p" list="sr_pl" inputmode="numeric" placeholder="Ej. 544" autocomplete="off"><datalist id="sr_pl">${lista()}</datalist>
 <label>Alarma activada</label><select id="sr_a"><option value="">— Elige la alarma de la Magelis —</option>${SOS_AL.map(([g,l])=>`<optgroup label="${g}">${l.map(([n,v])=>`<option value="${esc(v)}">${esc(n)}</option>`).join("")}</optgroup>`).join("")}</select>
 <details class="srtx"><summary class="mu">Escribir la alarma a mano (opcional)</summary><textarea id="sr_t" rows="2" placeholder="Ej. ZAPATA ACTIVADA · LÍMITE EXTENSIÓN"></textarea></details>
 <label>Foto de la Magelis / alarmas (apoyo)</label><label class="sec srfoto" for="sr_f">📷 Hacer o elegir foto</label><input id="sr_f" type="file" accept="image/*" style="display:none" onchange="sosFoto(this)">
 <div id="sr_pv"></div>
 <button class="pri" style="margin-top:12px;width:100%" onclick="sosAnaliza()">Ver primera actuación</button>
 <div id="sr_res"></div>
 <button class="sec" style="width:100%;margin-top:8px" onclick="closeSheet()">Cerrar</button>`;
 $("#sheet").style.display="flex"};
async function sosCasRap(txt,pos){const c=document.getElementById("sr_cas");if(!c||typeof casosParecidos!="function")return;c.innerHTML=`<div class="mu" style="margin-top:8px;font-size:12px">Buscando casos parecidos…</div>`;
 let l=[];try{l=await casosParecidos(txt)}catch(e){}const c2=document.getElementById("sr_cas");if(!c2)return;c2.innerHTML=l.length?`<div style="margin-top:10px">${casosHTML(l,pos)}</div>`:""}
window.sosFoto=function(inp){foto=inp.files&&inp.files[0]||null;if(fotoURL)URL.revokeObjectURL(fotoURL);fotoURL=foto?URL.createObjectURL(foto):"";
 $("#sr_pv").innerHTML=foto?`<img src="${fotoURL}" alt="Foto Magelis" style="width:100%;max-height:180px;object-fit:contain;border-radius:8px;margin-top:8px;background:#000">`:""};
/* v425: la DESCRIPCIÓN EN CAMPO (Observaciones) es el aviso de la OT y manda: se analiza primero; la alarma de la Magelis
   (lista, a mano o foto) es complementaria: se suma a la descripción para afinar y, si apunta a otro elemento, se muestra aparte. */
window.sosAnaliza=async function(){const pos=($("#sr_p").value||"").trim().toUpperCase(),res=$("#sr_res");
 const ob=((document.getElementById("sr_ob")||{}).value||"").replace(/\s+/g," ").trim();
 /* v426: la posición solo es obligatoria si no hay descripción (con descripción se busca igual, con el plano general) */
 if(!pos&&!ob){msg("Indica la posición PBB y la avería en campo");$("#sr_p").focus();return}
 /* v447: PRIORIDAD · 1º la avería en campo y 2º la alarma (lista o a mano); la FOTO de la Magelis es complementaria:
    solo entra en el análisis si lo anterior no da actuación, y lo que diga de otro elemento se muestra aparte y plegado. */
 let al=[($("#sr_a").value||""),($("#sr_t").value||"")].map(x=>x.trim()).filter(Boolean).join(" · ");
 const reab=window.__sosFotoReabre||"";window.__sosFotoReabre="";
 if(!foto&&!al&&!ob&&!reab){msg("Escribe la avería en campo, lo que se detecta (o elige la alarma, escríbela o haz la foto de la Magelis)");const t=document.getElementById("sr_ob");if(t)t.focus();return}
 /* v442: la foto se lee con IA (magelis-foto.js); solo las alarmas ACTIVAS van al análisis */
 window.__sosFotoHTML="";window.__sosFotoAl=reab;let fa=reab;
 if(foto){const set=t=>{res.innerHTML=`<div class="mu" style="margin-top:10px">${t}</div>`};set("Leyendo la foto…");
  try{if(typeof sosLeeFoto=="function"){const F=await sosLeeFoto(foto,set,!!ob||!!al);fa=F.al||""}
   else{await tess();const w=await Tesseract.createWorker("spa",1);const r=await w.recognize(foto);await w.terminate();fa=r.data.text||""}}
  catch(e){if(!ob&&!al){res.innerHTML=`<div class="gav" style="margin-top:10px">No se pudo leer la foto. Escribe la avería en campo o la alarma a mano y vuelve a pulsar.</div>`;const d=document.querySelector(".srtx");if(d)d.open=true;return}}}
 al=al.replace(/\s+/g," ").trim();fa=String(fa||"").replace(/\s+/g," ").trim();window.__sosFotoAl=fa;
 const mk=(d,f)=>({id:"sos_"+pos+"_"+(d+f).length,pos,tipo:"PAS",equipos:["PAS"],estado:"abierta",desc:d,def:f||"",com:"",obs:"",orden:"SOS",fecha:""});
 const ana=ot=>{let P=[],S=null;try{P=puentesOT(ot)}catch(e){}try{S=segOT(ot)}catch(e){}const RS=typeof resetAplica=="function"&&resetAplica(ot);return{ot,P,S,RS,ok:!!(P.length||S||RS)}};
 const pinta=A=>`${A.RS&&!A.S?`<div class="card pucard">${resetHTML(A.ot)}</div>`:""}${A.S?`<div class="card pucard">${segHTML(A.ot,A.S)}</div>`:""}${A.P.length?`<div class="card pucard">${puenteHTML(A.ot,A.P)}</div>`:""}`;
 const firma=A=>JSON.stringify([(A.P||[]).map(x=>x.key||x.id+x.k+x.l).sort(),A.S?(A.S.sen||[]).map(e=>e[0]+e[1]).concat(A.S.lim?[String(A.S.lim.id||A.S.lim)]:[]).sort():[]]);
 /* orden de prioridad: descripción → descripción + alarma → (si nada) + foto */
 const pasos=[];
 if(ob){pasos.push([ob,"","la avería en campo"]);if(al)pasos.push([ob,al,"la avería en campo y la alarma"]);if(fa)pasos.push([ob,[al,fa].filter(Boolean).join(" · "),"la avería en campo (con la foto como apoyo)"])}
 else if(al){pasos.push([al,"","la alarma"]);if(fa)pasos.push([al,fa,"la alarma (con la foto como apoyo)"])}
 else if(fa)pasos.push([fa,"","la foto de la Magelis (no hay avería escrita)"]);
 let A=null;for(const [d,f,src] of pasos){const X=ana(mk(d,f));X.src=src;if(!A)A=X;if(X.ok){A=X;break}}
 /* complementarias: lo que la alarma o la foto señalan de OTRO elemento, aparte */
 let B=null,C=null;
 if(ob&&al){const Aa=ana(mk(al,""));if(Aa.ok&&(!A.ok||firma(Aa)!=firma(A)))B=Aa}
 if(fa&&(ob||al)){const Af=ana(mk(fa,""));if(Af.ok&&(!A.ok||firma(Af)!=firma(A))&&(!B||firma(Af)!=firma(B)))C=Af}
 const txt=[ob,al].filter(Boolean).join(" · ")||fa;
 const lin=[ob?`<b>1 · Avería en campo (manda):</b> ${esc(ob)}`:"",al?`<b>2 · Alarma (complementaria):</b> ${esc(al)}`:"",fa?`<b>3 · Foto de la Magelis (complementaria):</b> ${esc(fa)}`:""].filter(Boolean).join("\n");
 const leido=`<div id="sr_leido"><details class="srtx" style="margin-top:8px"><summary class="mu">Texto analizado (orden de prioridad)</summary><div class="mu" style="white-space:pre-wrap;font-size:12px">${lin}</div></details>${window.__sosFotoHTML?`<details class="srtx srfotol"><summary class="mu">📷 Lectura de la foto de la Magelis <small>(complementaria)</small></summary>${window.__sosFotoHTML}</details>`:""}</div>`;
 const comp=(X,n)=>X?`<details class="srtx srcomp"><summary><b>Según ${n}</b> (complementaria · otro elemento)</summary>${pinta(X)}</details>`:"";
 if(!A.ok&&!B&&!C){res.innerHTML=`<div class="gav" style="margin-top:10px">Con lo descrito no hay puente provisional ni reset en la PBB ${esc(pos||"")} (o no se ha reconocido). Mira abajo la actuación más eficaz o detalla el elemento (p. ej. «freno de cabina derecho activado»).</div><div id="sr_cas"></div>${leido}`;sosCasRap(txt,pos);return}
 res.innerHTML=`<div class="mu" style="margin:10px 0 6px"><b>PBB ${esc(pos||"(sin posición · plano general)")}</b>${A.ok?` · según ${A.src}`:""}</div>${A.ok?pinta(A):`<div class="gav">${ob?"La avería en campo":"La alarma"} no nombra un elemento con puente provisional; abajo, plegado, lo que señala ${B?"la alarma":"la foto"} (complementaria).</div>`}
  ${comp(B,"la alarma de la Magelis")}${comp(C,"la foto de la Magelis")}<div id="sr_cas"></div>${leido}`;sosCasRap(txt,pos);
 res.scrollIntoView({block:"start",behavior:"smooth"})};
const st=document.createElement("style");st.textContent=`.grid.sosgrid{grid-template-columns:1fr 1fr 74px!important;align-items:stretch}
.sosk{display:flex!important;align-items:center;justify-content:center;align-self:stretch;box-sizing:border-box;padding:6px!important;margin:0 0 10px!important;width:auto!important;height:auto!important;background:var(--card,#fff)!important;border:1px solid var(--bd,#e3dbec)!important;border-top:3px solid var(--ac)!important;border-radius:12px!important;cursor:pointer}
.sosk img{width:54px;height:54px;border-radius:50%;animation:sosparp 2s ease-in-out infinite;filter:drop-shadow(0 2px 4px rgba(198,40,40,.4))}
.sosrh{display:flex;gap:10px;align-items:center;margin-bottom:6px}.sosrh img{width:44px;height:44px;flex:none}
.srfotol .mgbox{margin-top:6px}.srfoto{display:block;text-align:center;padding:12px;margin-top:4px;cursor:pointer}.srtx{margin-top:8px}.srtx summary{cursor:pointer;font-size:13px}`;document.head.appendChild(st);
})();
