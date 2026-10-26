/* ===== v67/v68: botón SOS en la tarjeta de OT (Seguimiento OT) =====
 Va debajo del indicador ABIERTA, a la derecha. Solo aparece si la OT tiene puente provisional
 (puentesOT) o indicación de seguridades/límite (segOT). Al pulsarlo abre la guía mostrando
 únicamente la indicación del puente («Primera actuación en campo»). */
(function(){
let sosOn=false;
const tiene=i=>{try{return !!i&&i.estado=="abierta"&&((typeof puentesOT=="function"&&puentesOT(i).length)||(typeof segOT=="function"&&segOT(i)))}catch(e){return false}};
const oC=card;card=function(i){let h=oC(i);if(view!="track"||!tiene(i))return h;
 const b=`<button class="sosb" title="SOS: puente provisional" aria-label="SOS: ir al puente provisional de la OT ${esc(i.orden||"")}" onclick="event.stopPropagation();sosVa('${i.id}')"><img src="sos.png" alt="SOS"></button>`;
 /* v68: en la fila de botones de abajo, al lado de la papelera (o al final del grupo izquierdo si no hay papelera) */
 /* v69: centrado en el hueco entre el grupo izquierdo (Editar/papelera) y el derecho (estrellas…) */
 let k=h.indexOf('<span class="cacl">');if(k>=0){const e=h.indexOf("</span>",k);if(e>=0)return h.slice(0,e+7)+`<span class="sosmid">${b}</span>`+h.slice(e+7)}
 const a=h.indexOf("ABIERTA");if(a<0)return h;const e=h.indexOf("</div>",a);return e<0?h:h.slice(0,e+6)+`<div class="sosw">${b}</div>`+h.slice(e+6)};
window.sosVa=function(id){const i=inc.find(x=>x.id==id);if(!i)return;sosOn=true;gOT=id;if(typeof gSyncOT!="undefined")gSyncOT=id;
 if(typeof gTipoOT=="function")gTipo=gTipoOT(i);if(view!="tec")go("tec");else vTec();scrollTo(0,0)};
window.sosSal=function(){sosOn=false;const a=document.getElementById("app");if(a)a.classList.remove("sosmode");vTec();scrollTo(0,0)};
const oG=go;go=function(v,f){if(v!="tec")sosOn=false;return oG(v,f)};
const oV=vTec;vTec=function(){const r=oV.apply(this,arguments);const app=document.getElementById("app");if(!app)return r;
 if(!sosOn){app.classList.remove("sosmode");return r}
 const i=inc.find(x=>x.id==gOT);if(!tiene(i)){sosOn=false;app.classList.remove("sosmode");return r}
 let pu=document.getElementById("gpte"),se=document.getElementById("gsegl");
 const P=puentesOT(i),S=segOT(i);
 if(!pu&&P.length){pu=document.createElement("div");pu.id="gpte";pu.className="card pucard";pu.innerHTML=puenteHTML(i,P)}
 if(!se&&S){se=document.createElement("div");se.id="gsegl";se.className="card pucard";se.innerHTML=segHTML(i,S)}
 let bar=document.getElementById("sosbar");if(!bar){bar=document.createElement("div");bar.id="sosbar";bar.className="card sosbar"}
 bar.innerHTML=`<img src="sos.png" alt=""><div><b>PBB ${esc(String(i.pos))} · ${esc(i.tipo||"")} · ${esc(i.orden||"")}</b><div class="mu" style="font-size:12px">${esc(i.desc||"")}</div></div><button class="sec" onclick="sosSal()">Guía completa</button>`;
 app.prepend(bar);[se,pu].forEach(x=>{if(x)bar.after(x)});if(se&&pu)se.after(pu);
 app.classList.add("sosmode");return r};
const st=document.createElement("style");st.textContent=`.sosw{display:flex;justify-content:flex-end;margin-top:8px}
.sosmid{flex:1 1 0;min-width:0;display:flex;justify-content:center;align-items:center}.sosmid+.cacr{margin-left:0!important}
.sosb{width:40px!important;height:40px;padding:0!important;margin:0!important;border:0!important;background:none!important;box-shadow:none!important;border-radius:50%;cursor:pointer;flex:none}
.sosb img{width:40px;height:40px;display:block;border-radius:50%;filter:drop-shadow(0 2px 4px rgba(198,40,40,.4));animation:sosparp 2s ease-in-out infinite}@keyframes sosparp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.92)}}.sosb:active img{transform:scale(.94)}
#app.sosmode>*:not(#sosbar):not(#gpte):not(#gsegl){display:none!important}
.sosbar{display:flex;align-items:center;gap:10px;border:2px solid #c62828!important}.sosbar img{width:40px;height:40px;flex:none}.sosbar>div{flex:1;min-width:0}.sosbar button{width:auto;margin:0;padding:8px 10px;font-size:13px;flex:none}`;document.head.appendChild(st);
})();
/* ===== v71: SOS rápido en Inicio (junto a OT abiertas / OT cerradas) =====
 Solo se introduce la posición PBB y la foto de la Magelis (o de su pantalla de alarmas). Se lee la foto (OCR),
 se analiza como una OT de pasarela y se presenta ÚNICAMENTE la «Primera actuación en campo» (puente provisional). */
(function(){
const oD=vDash;vDash=function(){const r=oD.apply(this,arguments);try{
 const k=document.querySelector("#app .card.kpi");const g=k&&k.parentElement;if(!g||g.querySelector(".sosk"))return r;
 g.classList.add("sosgrid");g.insertAdjacentHTML("beforeend",`<button class="card kpi sosk" onclick="sosRap()" aria-label="SOS: primera actuación en campo"><img src="sos.png" alt="SOS"></button>`)}catch(e){}return r};
let foto=null,fotoURL="";
const tess=()=>window.Tesseract?Promise.resolve():new Promise((ok,ko)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";s.onload=ok;s.onerror=ko;document.head.appendChild(s)});
const lista=()=>{const P=(typeof POS!="undefined"&&Array.isArray(POS))?POS:[];return P.map(p=>`<option value="${esc(String(p))}">`).join("")};
window.sosRap=function(){foto=null;fotoURL="";
 $("#sheetc").innerHTML=`<div class="sosrh"><img src="sos.png" alt=""><div><h3 style="margin:0">SOS · Primera actuación en campo</h3><div class="mu" style="font-size:12px">Posición y foto de la Magelis (o de su pantalla de alarmas). Se muestra solo el puente provisional.</div></div></div>
 <label>Posición PBB</label><input id="sr_p" list="sr_pl" inputmode="numeric" placeholder="Ej. 544" autocomplete="off"><datalist id="sr_pl">${lista()}</datalist>
 <label>Foto de la Magelis / alarmas</label><label class="sec srfoto" for="sr_f">📷 Hacer o elegir foto</label><input id="sr_f" type="file" accept="image/*" capture="environment" style="display:none" onchange="sosFoto(this)">
 <div id="sr_pv"></div>
 <details class="srtx"><summary class="mu">Escribir la alarma a mano (opcional)</summary><textarea id="sr_t" rows="2" placeholder="Ej. ZAPATA ACTIVADA · LÍMITE EXTENSIÓN"></textarea></details>
 <button class="pri" style="margin-top:12px;width:100%" onclick="sosAnaliza()">Ver primera actuación</button>
 <div id="sr_res"></div>
 <button class="sec" style="width:100%;margin-top:8px" onclick="closeSheet()">Cerrar</button>`;
 $("#sheet").style.display="flex"};
window.sosFoto=function(inp){foto=inp.files&&inp.files[0]||null;if(fotoURL)URL.revokeObjectURL(fotoURL);fotoURL=foto?URL.createObjectURL(foto):"";
 $("#sr_pv").innerHTML=foto?`<img src="${fotoURL}" alt="Foto Magelis" style="width:100%;max-height:180px;object-fit:contain;border-radius:8px;margin-top:8px;background:#000">`:""};
window.sosAnaliza=async function(){const pos=($("#sr_p").value||"").trim().toUpperCase(),res=$("#sr_res");
 if(!pos){msg("Indica la posición PBB");$("#sr_p").focus();return}
 let txt=($("#sr_t").value||"").trim();
 if(!foto&&!txt){msg("Haz la foto de la Magelis o escribe la alarma");return}
 if(foto){res.innerHTML=`<div class="mu" style="margin-top:10px">Leyendo la foto…</div>`;
  try{await tess();const w=await Tesseract.createWorker("spa",1,{logger:m=>{if(m.status=="recognizing text")res.innerHTML=`<div class="mu" style="margin-top:10px">Leyendo la foto… ${Math.round(m.progress*100)}%</div>`}});
   const r=await w.recognize(foto);await w.terminate();txt=(txt+" "+(r.data.text||"")).trim()}
  catch(e){res.innerHTML=`<div class="gav" style="margin-top:10px">No se pudo leer la foto. Escribe la alarma a mano y vuelve a pulsar.</div>`;const d=document.querySelector(".srtx");if(d)d.open=true;return}}
 const ot={id:"sos_"+pos+"_"+txt.length,pos,tipo:"PAS",equipos:["PAS"],estado:"abierta",desc:txt.replace(/\s+/g," "),def:"",com:"",obs:"",orden:"SOS",fecha:""};
 let P=[],S=null;try{P=puentesOT(ot)}catch(e){}try{S=segOT(ot)}catch(e){}
 const leido=`<details class="srtx" style="margin-top:8px"><summary class="mu">Texto leído de la Magelis</summary><div class="mu" style="white-space:pre-wrap;font-size:12px">${esc(txt)}</div></details>`;
 if(!P.length&&!S){res.innerHTML=`<div class="gav" style="margin-top:10px">No se ha identificado en la Magelis ningún elemento con puente provisional para la PBB ${esc(pos)}. Revisa la foto o escribe la alarma a mano (p. ej. «ZAPATA ACTIVADA»).</div>${leido}`;const d=document.querySelector(".srtx");if(d)d.open=true;return}
 res.innerHTML=`<div class="mu" style="margin:10px 0 6px"><b>PBB ${esc(pos)}</b></div>${S?`<div class="card pucard">${segHTML(ot,S)}</div>`:""}${P.length?`<div class="card pucard">${puenteHTML(ot,P)}</div>`:""}${leido}`;
 res.scrollIntoView({block:"start",behavior:"smooth"})};
const st=document.createElement("style");st.textContent=`.grid.sosgrid{grid-template-columns:1fr 1fr 74px!important;align-items:stretch}
.sosk{display:flex!important;align-items:center;justify-content:center;padding:6px!important;margin:0!important;width:auto!important;background:var(--card,#fff);border:1px solid var(--bd,#e3dbec);cursor:pointer}
.sosk img{width:58px;height:58px;border-radius:50%;animation:sosparp 2s ease-in-out infinite;filter:drop-shadow(0 2px 4px rgba(198,40,40,.4))}
.sosrh{display:flex;gap:10px;align-items:center;margin-bottom:6px}.sosrh img{width:44px;height:44px;flex:none}
.srfoto{display:block;text-align:center;padding:12px;margin-top:4px;cursor:pointer}.srtx{margin-top:8px}.srtx summary{cursor:pointer;font-size:13px}`;document.head.appendChild(st);
})();
