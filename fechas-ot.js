/* ===== v345: fechas en las horas de la OT (OT antiguas cerradas otro día) =====
   Junto a cada hora de Resolución / Cierre y de Editar registro va su fecha:
   · Hora de inicio  → fecha de apertura de la OT (i.fecha)
   · Hora de llegada → fecha de llegada (i.fLle; por defecto la de apertura, o el día siguiente si pasa de medianoche)
   · Hora de cierre  → fecha actual del cierre (i.fCie; por defecto hoy)
   La comprobación de orden (llegada ≥ inicio, cierre ≥ llegada) se hace con fecha y hora, así una OT
   abierta el 6/11 a las 13:16 se puede cerrar el 8/11 a las 11:43. */
(function(){
 const hoyL=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
 const okF=f=>/^\d{4}-\d{2}-\d{2}$/.test(f||"");
 const masDia=(f,n)=>{const d=new Date(f+"T12:00");d.setDate(d.getDate()+n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
 const hm=t=>{const m=/^(\d{1,2}):(\d{2})/.exec(t||"");return m?(+m[1])*60+(+m[2]):null};
 const abs=(f,t)=>{const h=hm(t);if(!okF(f)||h==null)return null;const [y,mo,d]=f.split("-").map(Number);return Date.UTC(y,mo-1,d)/60000+h};
 const dm=f=>okF(f)?f.slice(8,10)+"/"+f.slice(5,7):"";
 const dmy=f=>okF(f)?f.slice(8,10)+"/"+f.slice(5,7)+"/"+f.slice(0,4):"";
 /* fechas por defecto de una OT */
 const fIni=i=>okF(i.fecha)?i.fecha:hoyL();
 const fLle=i=>okF(i.fLle)?i.fLle:(i.hLle&&i.hIni&&hm(i.hLle)<hm(i.hIni)?masDia(fIni(i),1):fIni(i));
 const fCie=i=>okF(i.fCie)?i.fCie:(i.estado=="cerrada"&&i.hCie?(i.hLle&&hm(i.hCie)<hm(i.hLle)?masDia(fLle(i),1):fLle(i)):hoyL());
 window.otFechas=i=>({ini:fIni(i),lle:fLle(i),cie:fCie(i)});

 const lbDe=el=>{if(!el)return null;const r=el.closest(".hrow");const lb=(r||el).previousElementSibling;return lb&&lb.tagName=="LABEL"?lb:null};
 function ponFecha(el,id,val,ro){const lb=lbDe(el);if(!lb||document.getElementById(id))return null;
  lb.classList.add("hfLb");
  const w=document.createElement("span");w.className="hfW";
  w.innerHTML=`<input type="date" id="${id}" class="hfd" value="${val}" ${ro?"readonly tabindex=-1":""} aria-label="Fecha">`;
  lb.appendChild(w);const d=w.firstChild;d.addEventListener("click",e=>e.stopPropagation());
  d.addEventListener("change",()=>{d.classList.toggle("hfHoy",d.value==hoyL());marcaHoy()});d.classList.toggle("hfHoy",d.value==hoyL());return d}
 function marcaHoy(){document.querySelectorAll(".hfd").forEach(d=>d.classList.toggle("hfHoy",d.value==hoyL()))}

 /* Resolución / Cierre CGA */
 const or=resolver;resolver=function(id){const r=or.apply(this,arguments);try{const i=inc.find(x=>x.id==id);if(!i)return r;
  ponFecha($("#r_i"),"r_fi",fIni(i),true);
  const l=$("#r_l");if(l&&l.type!="hidden")ponFecha(l,"r_fl",fLle(i));
  const c=$("#r_c");if(c&&c.type!="hidden")ponFecha(c,"r_fc",fCie(i))}catch(e){}return r};

 /* Editar registro: la fecha de inicio va ligada a «Fecha» (apertura) */
 const oe=editar;editar=function(id){const r=oe.apply(this,arguments);try{const i=inc.find(x=>x.id==id);if(!i)return r;
  const ef=$("#e_f");const di=ponFecha($("#e_hi"),"e_fi",ef&&okF(ef.value)?ef.value:fIni(i));
  if(di&&ef){di.addEventListener("change",()=>{ef.value=di.value});ef.addEventListener("change",()=>{di.value=ef.value;marcaHoy()})}
  ponFecha($("#e_hl"),"e_fl",fLle(i));
  ponFecha($("#e_hc"),"e_fc",i.estado=="cerrada"?fCie(i):hoyL())}catch(e){}return r};

 /* validación con fecha + hora y guardado de fLle / fCie */
 function valida(fi,fl,fc,hi,hl,hc){const ped=(el,t)=>{msg(t);if(el){el.focus();el.style.outline="2px solid #d33"}return false};
  const vi=hi&&hi.value,vl=hl&&hl.value,vc=hc&&hc.value;
  if(hm(vi)==null||hm(vl)==null||hm(vc)==null)return null; /* faltan horas: lo avisa la comprobación de siempre */
  const ti=abs(fi,vi),tl=abs(fl,vl),tc=abs(fc,vc);if(ti==null||tl==null||tc==null)return null;
  if(tl<ti)return ped(hl,`La llegada (${dmy(fl)} ${vl}) no puede ser anterior al inicio (${dmy(fi)} ${vi})`);
  if(tc<tl)return ped(hc,`El cierre (${dmy(fc)} ${vc}) no puede ser anterior a la llegada (${dmy(fl)} ${vl})`);
  [hi,hl,hc].forEach(x=>{if(x)x.style.outline=""});
  window.__hOK=new Set([hm(vi)+">"+hm(vl),hm(vl)+">"+hm(vc)]);return true}
 const val=id=>{const e=document.getElementById(id);return e&&okF(e.value)?e.value:""};

 const oc=cerrar;cerrar=function(id){const i=inc.find(x=>x.id==id);if(!i)return oc.apply(this,arguments);
  const fi=val("r_fi")||fIni(i),fl=val("r_fl")||fLle(i),fc=val("r_fc")||hoyL();
  const v=valida(fi,fl,fc,$("#r_i"),$("#r_l"),$("#r_c"));if(v===false)return;
  const prev={fLle:i.fLle,fCie:i.fCie};i.fLle=fl;i.fCie=fc;
  try{return oc.apply(this,arguments)}finally{window.__hOK=null;if(i.estado=="abierta"){i.fLle=prev.fLle;i.fCie=prev.fCie;if(prev.fLle==null)delete i.fLle;if(prev.fCie==null)delete i.fCie}}};

 const og=guardaEdit;guardaEdit=function(id){const i=inc.find(x=>x.id==id);const est=$("#e_est");if(!i||!est)return og.apply(this,arguments);
  const ef=$("#e_f");const fi=val("e_fi")||(ef&&okF(ef.value)?ef.value:fIni(i)),fl=val("e_fl")||fLle(i),fc=val("e_fc")||hoyL();
  if(est.value=="cerrada"){const v=valida(fi,fl,fc,$("#e_hi"),$("#e_hl"),$("#e_hc"));if(v===false)return;i.fLle=fl;i.fCie=fc}
  else{delete i.fCie;if(($("#e_hl")||{}).value)i.fLle=fl;else delete i.fLle}
  try{return og.apply(this,arguments)}finally{window.__hOK=null}};

 /* «He llegado a la posición» graba también la fecha de llegada */
 const ol=llegada;llegada=function(id){const i=inc.find(x=>x.id==id);if(i&&!i.hLle)i.fLle=hoyL();return ol.apply(this,arguments)};

 /* Ficha de OT: si la OT se cerró otro día, cada hora lleva su fecha (dd/mm) */
 const ocd=card;card=function(i){let h=ocd.apply(this,arguments);try{if(!i||!i.hCie||i.estado=="abierta")return h;const f=otFechas(i);
  if(f.cie==f.ini&&f.lle==f.ini)return h;
  const pon=(t,hh,ff)=>{if(!hh)return;h=h.replace(new RegExp("("+t+"\\s*(?:</?b[^>]*>\\s*)?)"+hh.replace(":","\\:")),`$1${dm(ff)} ${hh}`)};
  pon("Inicio",i.hIni,f.ini);pon("Llegada",i.hLle,f.lle);pon("Cierre",i.hCie,f.cie)}catch(e){}return h};

 const st=document.createElement("style");st.textContent=`
label.hfLb{display:flex!important;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.hfW{margin-left:auto;display:inline-flex}
input.hfd{width:auto!important;min-width:0;margin:0!important;padding:3px 8px!important;font-size:13px!important;letter-spacing:0;text-transform:none;border-radius:8px;height:auto;line-height:1.3;font-family:inherit;font-weight:700;border:1px solid rgba(127,127,127,.45);background:rgba(127,127,127,.10)}
input.hfd.hfHoy{border-color:#2e7d32;color:#2e7d32}
input.hfd[readonly]{opacity:.8;pointer-events:none}`;
 document.head.appendChild(st);
})();
