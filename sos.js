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
 let k=h.indexOf("gotdel");if(k>=0){const e=h.indexOf("</button>",k);if(e>=0)return h.slice(0,e+9)+b+h.slice(e+9)}
 k=h.indexOf('<span class="cacl">');if(k>=0){const e=h.indexOf("</span>",k);if(e>=0)return h.slice(0,e)+b+h.slice(e)}
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
.sosb{width:46px!important;height:46px;padding:0!important;margin:0!important;border:0!important;background:none!important;box-shadow:none!important;border-radius:50%;cursor:pointer;flex:none}
.sosb img{width:46px;height:46px;display:block;border-radius:50%;filter:drop-shadow(0 2px 4px rgba(198,40,40,.4));animation:sosparp 2s ease-in-out infinite}@keyframes sosparp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.92)}}.sosb:active img{transform:scale(.94)}
#app.sosmode>*:not(#sosbar):not(#gpte):not(#gsegl){display:none!important}
.sosbar{display:flex;align-items:center;gap:10px;border:2px solid #c62828!important}.sosbar img{width:40px;height:40px;flex:none}.sosbar>div{flex:1;min-width:0}.sosbar button{width:auto;margin:0;padding:8px 10px;font-size:13px;flex:none}`;document.head.appendChild(st);
})();
