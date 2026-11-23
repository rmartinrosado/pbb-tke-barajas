/* ===== v719 (abajo): «SOS - DIRECTO», campos agrupados en dos paneles, pasos 1-2-3 antes de ACEPTAR, componente con
   desplegable y flecha atrás por pasos dentro del SOS.
   ===== v718: SOS A PANTALLA COMPLETA · aspecto técnico de panel de mando (22/11/2026) =====
   · La hoja del SOS ocupa toda la pantalla, de arriba hasta la barra lateral de abajo (sin hueco gris ni esquinas de hoja).
   · Botones y casillas grandes para manejar con GUANTES: mínimo 60 px de alto, letra 17-18 px, bordes gruesos.
   · Estética de HMI industrial con el tema actual (variables --card, --tx, --mu, --bd, --ac del modo claro / oscuro / exterior):
     fondo de rejilla técnica, cabecera con franjas de peligro, pasos 1 → 2 → 3 como cadena de proceso, rótulos en monoespaciada
     con piloto, casillas con bisel y ACEPTAR tipo pulsador grande.
   · Se aplica también al Historial del SOS. Solo cambia el aspecto: no toca la lógica ni los ids. ===== */
(function(){
"use strict";
const S="#sheet.sost";
/* la hoja es del SOS si dentro está la avería en campo o el historial del SOS */
const sh=()=>document.getElementById("sheet"),sc=()=>document.getElementById("sheetc");
const mira=()=>{const s=sh(),c=sc();if(!s||!c)return;const es=!!(c.querySelector("#sr_ob")||c.querySelector(".shh .sht"));if(s.classList.contains("sost")!==es)s.classList.toggle("sost",es)};
const ini=()=>{const c=sc();if(!c)return setTimeout(ini,300);new MutationObserver(mira).observe(c,{childList:true});mira()};ini();
if(typeof window.closeSheet=="function"){const oc=window.closeSheet;window.closeSheet=closeSheet=function(){const r=oc.apply(this,arguments);const s=sh();if(s)s.classList.remove("sost");return r}}
/* ======================= v719: ORGANIZACIÓN DEL SOS (22/11/2026) =======================
   · Título «SOS - DIRECTO». Sin el párrafo de explicación (lo dicen los paneles).
   · Panel 1 «PBB Y AVERÍA» (lo que manda): Posición PBB | Componente (si se sabe) y Avería en campo.
   · Panel 2 «ALARMA DE LA MAGELIS» (complementaria): buscador del manual RCS, lista rápida SOS, a mano y foto.
   · Pasos 1 → 2 → 3 («al aceptar sale») justo antes de ACEPTAR.
   · Componente: al tocarlo sale el desplegable de los componentes de campo por zonas; el elegido se SUMA a la avería
     («Componente C-R10 (…)») y queda como chip con ✕ y 📄 ficha. Escribiendo filtra igual.
   · Flecha atrás dentro del SOS: cierra el desplegable abierto → del Historial vuelve al SOS tal cual → de los resultados
     sube al formulario → y solo entonces cierra el SOS (pantalla de debajo). ===== */
const $i=id=>document.getElementById(id);
const E=t=>String(t==null?"":t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ZON=[["E","⚡ Armario eléctrico (AE)"],["P","🎛️ Pupitre"],["C","🚪 Cabina"],["ET","↔️ Túneles · extensión"],["IT","↕️ Elevación · inclinación"],["H","🛞 Traslación"],["T","🛞 Traslación"],["R","🔄 Rotonda"],["SS","🪜 Escalera de servicio"]];
const zona=id=>{const m=/^(?:ACOPL\.?\s*)?([A-Z]+)\d*-/.exec(String(id||"").toUpperCase());const z=m&&ZON.find(x=>x[0]==m[1]);return z?z[1]:"🔩 Otros"};
const ck=c=>String(c.baseId||c.db||c.id);
const COMPS=()=>(window.COMP_CAMPO||[]).filter(c=>c&&c.id);
const panel=(cls,n,tit,sub)=>{const d=document.createElement("section");d.className="sostp "+cls;
 d.innerHTML=`<div class="sostph"><span class="sostpn">${n}</span><span class="sostpt"><b>${tit}</b><small>${sub}</small></span></div><div class="sostpb"></div>`;return d};
function arregla(){const c=$i("sheetc"),ob=$i("sr_ob");if(!c||!ob)return;
 const h=c.querySelector(".sosrh");try{cabecera()}catch(e){}
 let F=$i("sostf");
 if(!F){F=document.createElement("div");F.id="sostf";
  /* v722: permutados · 1 ALARMA MAGELIS (arriba) · 2 PBB Y AVERÍA */
  F.append(panel("sostp2","1","ALARMA MAGELIS","OBLIGATORIO<br>LO QUE SE DETECTA"),panel("sostp1","2","PBB Y AVERÍA","COMPLEMENTARIA<br>ACOTA EL PROBLEMA")/* v822: subtítulos permutados */);
  const ps=document.createElement("div");ps.className="sostps";ps.innerHTML=`<div class="sostpst">Al aceptar sale</div>`;F.append(ps);
  if(h)h.after(F);else c.prepend(F)}
 const B1=F.querySelector(".sostp1>.sostpb"),B2=F.querySelector(".sostp2>.sostpb"),PS=F.querySelector(".sostps");
 const pon=(box,el)=>{if(el&&el.parentNode!==box)box.appendChild(el)};
 /* panel 1: Posición | Componente, desplegable y chips, avería */
 const fila=c.querySelector(".soscr2");pon(B1,fila);
 const cq=$i("cmp_q");const cw=cq&&cq.closest(".rcscmp");
 if(fila&&cw&&cw.parentNode!==fila){let w=fila.querySelector(".sostcw");if(!w){w=document.createElement("div");w.className="sostcw";w.innerHTML=`<label for="cmp_q">Componente de campo</label>`;fila.appendChild(w)}w.appendChild(cw);cq.placeholder="Si se sabe ▾"}
 pon(B1,$i("cmp_l"));
 let ch=$i("sost_cmps");if(!ch){ch=document.createElement("div");ch.id="sost_cmps"}pon(B1,ch);
 const lo=c.querySelector('label[for="sr_ob"]');pon(B1,lo);pon(B1,ob.closest(".srobsw"));
 /* panel 2: buscador del manual, lista rápida, a mano y foto */
 pon(B2,c.querySelector(".rcsbus:not(.otrcs)"));
 const al=c.querySelector(".soscal");if(al){pon(B2,al);const la=al.querySelector("label");if(la&&!la.dataset.st){la.dataset.st=1;la.innerHTML='Lista rápida SOS <small>(casos frecuentes)</small>'}}
 pon(B2,c.querySelector(".soscr3"));
 /* v724: «Seleccionar alarma» y «Alarma registrada» (las líneas no se editan: se suman con el buscador o la lista y se quitan con ✕) */
 /* v730: «Foto Display-Magelis» */
 {/* v831: «Foto Magelis» con el icono de cámara de trazo blanco y «(complementaria)» debajo */
  const CAM='<svg class="srcam" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg>';const fx=h=>String(h).replace(/📷\s*Foto (Display-)?Magelis/g,CAM+"Foto Magelis");
  const fb=c.querySelector("label.srfoto>span");if(fb&&!fb.querySelector(".srcam")&&/Foto (Display-)?Magelis/.test(fb.textContent))fb.innerHTML=fx(fb.innerHTML);
  const lb=c.querySelector("label.srfoto");if(lb&&lb.dataset.ori&&/📷\s*Foto (Display-)?Magelis/.test(lb.dataset.ori))lb.dataset.ori=fx(lb.dataset.ori)}
 const sa=$i("sr_a");if(sa&&sa.options[0]&&sa.options[0].text!=="Seleccionar alarma")sa.options[0].text="Seleccionar alarma";
 const dt=c.querySelector("details.srtx"),tx=$i("sr_t");
 if(dt){const sm=dt.querySelector("summary");/* v727: en una línea, con el número de alarmas registradas */
  const nA=tx?(typeof rcsListaAl=="function"?rcsListaAl(tx.value).length:tx.value.split("\n").filter(z=>z.trim()).length):0;
  const hA=`<span class="sostart">Alarma registrada</span><span class="sostarn${nA?" on":""}">${nA}</span>`;if(sm&&sm.innerHTML!==hA)sm.innerHTML=hA}
 /* v732: una alarma por línea, sin partirla · v804: vacío, el aviso «Sin alarmas…» se ajusta al recuadro (centrado, en dos líneas) */
 if(tx){const w=tx.value.trim()?"off":"soft";if(tx.getAttribute("wrap")!==w)tx.setAttribute("wrap",w);tx.classList.toggle("srtvac",!tx.value.trim())}
 if(!document.getElementById("st804")){const st=document.createElement("style");st.id="st804";st.textContent=`#sr_t.srtvac{white-space:pre-wrap!important;overflow-x:hidden!important;text-align:center}#sr_t::placeholder{white-space:pre-wrap;text-align:center;font-size:13px;letter-spacing:.3px;line-height:1.45}`;document.head.appendChild(st)}
 if(tx&&!tx.readOnly){tx.readOnly=true;tx.tabIndex=-1;tx.setAttribute("aria-readonly","true");tx.placeholder="Sin alarmas\nelígelas con el buscador o la lista"}{const hd2=F.querySelector(".sostp2>.sostph");pon(hd2||B2,$i("sr_f"))}pon(B2,$i("sr_pv"));
 /* pasos y ACEPTAR al final del formulario */
 /* v720: panel 2 PLEGADO hasta tocar su cabecera; en la cabecera, lo que ya lleva (alarmas, foto) */
 const P2=F.querySelector(".sostp2");if(P2&&!P2.dataset.pl){P2.dataset.pl=1;P2.classList.add("sostcer");const hd=P2.querySelector(".sostph");
  hd.setAttribute("role","button");hd.tabIndex=0;hd.insertAdjacentHTML("beforeend",`<span class="sostcol"><span class="sostpr" role="button" tabindex="0" aria-label="Desplegar la caja de alarmas"></span></span>`);
  /* v822: botón FOTO de la Magelis en la cabecera de la caja 1 (no pliega ni despliega la caja) */
  const cam=hd.querySelector(".sostcam");if(cam)cam.addEventListener("click",e=>e.stopPropagation());
  /* v824: solo la CAMPANA despliega / pliega la caja 1 (la cabecera ya no) */
  hd.removeAttribute("role");hd.removeAttribute("tabindex");
  hd.addEventListener("click",e=>{if(!(e.target.closest&&e.target.closest(".sostpr")))e.stopImmediatePropagation()},true);
  hd.addEventListener("click",()=>{P2.classList.toggle("sostcer");if(!P2.classList.contains("sostcer"))requestAnimationFrame(()=>P2.scrollIntoView({block:"nearest",behavior:"smooth"}))})}
 resumen2();
 /* v721: los pasos 1-2-3 van en la MISMA LÍNEA que ACEPTAR (a la izquierda, compactos) */
 const ol=c.querySelector(".soscl"),row=c.querySelector(".srobrow");if(PS&&PS.isConnected)PS.remove();
 if(row){if(row.previousElementSibling!==F)F.after(row);if(ol&&ol.parentNode!==row)row.prepend(ol);
  if(ol&&!ol.dataset.st){ol.dataset.st=1;const T=["En servicio ya","Reparar","Análisis IA"];[...ol.children].forEach((li,k)=>{if(T[k])li.textContent=T[k]})}
  const rs=row.querySelector(".srobrst");if(rs&&!rs.dataset.st){rs.dataset.st=1;rs.innerHTML=RECARGA;rs.setAttribute("aria-label","Reiniciar el SOS");rs.title="Reiniciar el SOS"}}
 /* rótulos cortos que caben en su caja */
 if(lo&&lo.textContent!=="Avería en campo")lo.textContent="Avería en campo";
 const lp=c.querySelector(".soscpos label");if(lp&&lp.textContent!=="Posición")lp.textContent="Posición";
 const lcq=c.querySelector('.sostcw>label[for="cmp_q"]');if(lcq&&lcq.textContent!=="Componente de campo")lcq.textContent="Componente de campo";
 pintaChips()}
function resumen2(){const P2=document.querySelector("#sostf .sostp2");if(!P2)return;const r=P2.querySelector(".sostpr");if(!r)return;
 const t=($i("sr_t")||{}).value||"";const n=(typeof rcsListaAl=="function"?rcsListaAl(t).length:0)||(t.trim()?t.trim().split("\n").filter(Boolean).length:0);
 const lb=document.querySelector("#sheetc label.srfoto");const fo=!!(lb&&lb.classList.contains("srfok"));
 const x=n?`🔔${n}`:"🔔";if(r.textContent!==x)r.textContent=x;r.classList.toggle("on",!!n);
 const cm=P2.querySelector(".sostcam");if(cm)cm.classList.toggle("on",fo)}
document.addEventListener("input",e=>{if(e.target&&e.target.id=="sr_t")resumen2()});
/* ---------- componente: desplegable, elegir, chips ---------- */
const RECARGA=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>`;
const lineaC=c=>`Componente ${c.id}${c.t?" ("+c.t+")":""}`;
function elegidos(){const t=($i("sr_ob")||{}).value||"";return COMPS().filter(c=>t.includes(lineaC(c)))}
function pintaChips(){const ch=$i("sost_cmps");if(!ch)return;const L=elegidos();const k=L.map(ck).join("|");if(ch.dataset.k===k)return;ch.dataset.k=k;
 ch.innerHTML=L.map(c=>`<span class="sostch"><b>${E(c.id)}</b><span>${E(c.t||"")}</span><button type="button" class="sostchf" data-k="${E(ck(c))}" aria-label="Ver ficha de ${E(c.id)}">📄</button><button type="button" class="sostchx" data-k="${E(ck(c))}" aria-label="Quitar ${E(c.id)}">✕</button></span>`).join("")}
function lista(){const cl=$i("cmp_l");if(!cl)return;const L=COMPS().slice().sort((a,b)=>String(a.id).localeCompare(String(b.id),"es",{numeric:true}));
 if(!L.length){cl.innerHTML=`<div class="rcsnada">Aún no hay componentes de campo en el catálogo.</div>`;cl.dataset.st="1";return}
 const ya=new Set(elegidos().map(ck));const G0=new Map();L.forEach(c=>{const z=zonaC(c);if(!G0.has(z))G0.set(z,[]);G0.get(z).push(c)});
 /* v724: filtro de ubicación (chips) arriba del desplegable */
 if(ZF&&!G0.has(ZF))ZF="";const G=ZF?new Map([[ZF,G0.get(ZF)]]):G0;
 const fil=`<div class="sostzf">${[["","Todas · "+L.length]].concat([...G0].map(([z,X])=>[z,z+" · "+X.length])).map(([z,t])=>`<button type="button" class="sostzb${z===ZF?" on":""}" data-z="${E(z)}">${E(t)}</button>`).join("")}</div>`;
 cl.innerHTML=fil+`<div class="sostcl">${[...G].map(([z,X])=>`<div class="sostcz">${E(z)}</div>`+X.map(c=>`<button type="button" class="rcscb${ya.has(ck(c))?" sostya":""}" data-k="${E(ck(c))}"><span class="cmpid">${E(c.id)}</span> ${E(c.t||"")}${c.fab?`<small>${E(c.fab)}</small>`:""}</button>`).join("")).join("")}</div>`;cl.dataset.st="1"}
let ZF="";
/* zona del componente: la de su foto de ubicación (armario eléctrico, pupitre…) y, si no tiene, la del prefijo del código */
const UB=[[/armario el|\bAE\b/i,"⚡ Armario eléctrico (AE)"],[/pupitre/i,"🎛️ Pupitre"],[/cabina/i,"🚪 Cabina"],[/t[uú]nel|extensi/i,"↔️ Túneles · extensión"],[/inclinaci|elevaci|columna/i,"↕️ Elevación · inclinación"],[/rotonda/i,"🔄 Rotonda"],[/traslaci|bogie|rueda/i,"🛞 Traslación"],[/escalera/i,"🪜 Escalera de servicio"]];
function zonaC(c){const F=(c.fotos||[]).map(f=>Array.isArray(f)?String(f[1]||""):String((f||{}).vista||"")).filter(v=>/^ubicaci/i.test(v)).join(" ")+" "+String(c.ubi||c.u||"");
 for(const[re,z]of UB)if(re.test(F))return z;return zona(c.id)}
const cierraL=()=>{const cl=$i("cmp_l");if(cl&&cl.innerHTML){cl.innerHTML="";delete cl.dataset.st}};
function suma(k){const c=COMPS().find(z=>ck(z)==k),t=$i("sr_ob");if(!c||!t)return;const li=lineaC(c);
 if(!t.value.includes(li)){t.value=[t.value.replace(/\s+$/,""),li].filter(Boolean).join("\n");t.dispatchEvent(new Event("input",{bubbles:true}))}
 else if(typeof msg=="function")msg(`${c.id} ya está en la avería`);
 const q=$i("cmp_q");if(q){q.value="";q.blur()}cierraL();pintaChips()}
function quita(k){const c=COMPS().find(z=>ck(z)==k),t=$i("sr_ob");if(!c||!t)return;const li=lineaC(c);
 t.value=t.value.split("\n").filter(x=>x.trim()!==li).join("\n").replace(/\s*·?\s*$/,"");t.dispatchEvent(new Event("input",{bubbles:true}));pintaChips()}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest||!t.closest("#sheetc"))return;
 const b=t.closest("#cmp_l .rcscb");if(b){e.preventDefault();e.stopPropagation();suma(b.dataset.k);return}
 const x=t.closest(".sostchx");if(x){e.preventDefault();e.stopPropagation();quita(x.dataset.k);return}
 const f=t.closest(".sostchf");if(f){e.preventDefault();e.stopPropagation();if(typeof abreCompClaves=="function")abreCompClaves([f.dataset.k],"Componente del SOS");return}
 const zb=t.closest(".sostzb");if(zb){e.preventDefault();e.stopPropagation();ZF=zb.dataset.z||"";lista();return}
 if(t.closest("#cmp_q")){const q=$i("cmp_q");if(q&&!q.value.trim())setTimeout(lista,0);return}
 if(!t.closest("#cmp_l"))cierraL()},true);
document.addEventListener("focusin",e=>{if(e.target&&e.target.id=="cmp_q"&&!e.target.value.trim())setTimeout(lista,0)});
document.addEventListener("input",e=>{const t=e.target;if(!t)return;if(t.id=="cmp_q"&&!t.value.trim())setTimeout(lista,250);if(t.id=="sr_ob")pintaChips()});
/* ---------- orden: tras cada repintado del SOS ---------- */
let tA=0;const pide=()=>{if(tA)return;tA=requestAnimationFrame(()=>{tA=0;try{arregla()}catch(e){console.warn("sos-tecnico",e)}})};
const iniA=()=>{const c=sc();if(!c)return setTimeout(iniA,300);new MutationObserver(pide).observe(c,{childList:true,subtree:true});pide()};iniA();
/* ---------- Historial: se guarda el SOS tal cual para volver con la flecha ---------- */
let HIS=null;
document.addEventListener("click",e=>{if(!e.target.closest||!e.target.closest("#sheetc .soshb"))return;const c=sc();if(!c||!$i("sr_ob"))return;
 HIS={n:[...c.childNodes],cls:c.className,y:c.scrollTop}},true);
document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#sheetc .shnew, #sheetc .soscx"))HIS=null},true);
/* ---------- flecha atrás por pasos dentro del SOS ---------- */
const capaEncima=()=>{for(const el of document.body.children){if(/^(fab|fabm|fabv|fabb|login|lock|splash|navbg|navtab|nvBar|sheet|toast)$/.test(el.id)||/^(SCRIPT|STYLE)$/.test(el.tagName))continue;
  const cs=getComputedStyle(el);if(cs.position!="fixed"||cs.display=="none"||cs.visibility=="hidden"||+cs.opacity==0)continue;
  const r=el.getBoundingClientRect();if(r.width>=innerWidth*.8&&r.height>=innerHeight*.5)return true}return false};
document.addEventListener("click",e=>{if(!e.target.closest||!e.target.closest("#fabb"))return;const s=sh(),c=sc();
 if(!s||!c||s.style.display!="flex"||!s.classList.contains("sost"))return;
 const m=$i("fabm");if(m&&m.classList.contains("on"))return;if(capaEncima())return;
 const para=()=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()};
 const a=document.activeElement;if(a&&a!==document.body&&a.matches&&a.matches("input,textarea,select")){a.blur()}
 const rl=$i("rcs_l"),cl=$i("cmp_l");
 if((rl&&rl.classList.contains("on"))||(cl&&cl.innerHTML.trim())){para();if(rl){rl.innerHTML="";rl.classList.remove("on")}cierraL();return}
 if(c.querySelector(".shh")&&HIS){para();const H=HIS;HIS=null;c.className=H.cls;c.replaceChildren(...H.n);requestAnimationFrame(()=>{c.scrollTop=H.y});return}
 if(c.scrollTop>60){para();c.scrollTo({top:0,behavior:"smooth"});return}
 /* sin nada más: se cierra el SOS y queda la pantalla de debajo */},true);

/* ---------- v721: tipografía como el PANEL DE CONTROL · textos ajustados a cajas y botones ---------- */

/* ======================= v723: MISMO DISEÑO QUE EL PANEL DE CONTROL Y «REGISTRAR OT» =======================
   Consola técnica de toda la PWA: tarjetas con marco degradado naranja · morado · azul y cuadrícula difuminada, títulos en
   monoespaciada con degradado, cabecera con estado y reloj en vivo y franja de escaneo, rótulos monoespaciados en gris con
   línea, campos redondeados con foco luminoso naranja y botón principal amarillo-naranja con brillo. Mismos colores del tema
   (claro / oscuro / exterior). Se mantienen los tamaños grandes para manejar con guantes. */
const P="#sheet.sost>#sheetc",OR="var(--tkor,#ff7a1a)",PU="var(--tkpu,#9b3dff)",MO="var(--tkmo,ui-monospace,SFMono-Regular,Menlo,monospace)";
const FLD="color-mix(in srgb,var(--bg) 70%,var(--card))",BRD="color-mix(in srgb,var(--tx) 16%,transparent)";
const st=document.createElement("style");st.id="sostcss";st.textContent=`
${S}{align-items:stretch!important;background:var(--bg)!important}
${P}{max-height:none!important;height:100%!important;height:100dvh!important;width:100%!important;border-radius:0!important;border:0!important;background:var(--bg)!important;background-image:none!important;
 padding:calc(10px + env(safe-area-inset-top,0px)) 12px calc(96px + env(safe-area-inset-bottom,0px)) 12px!important;color:var(--tx)!important}
/* ---- cabecera: como «Registrar OT» ---- */
${P} .sosrh{margin:0 0 10px!important}
${P} .sosct{display:flex!important;align-items:center!important;gap:8px!important;flex-wrap:nowrap!important;margin:0!important}
${P} .sosct .sosr2t{flex:1 1 auto!important;min-width:0;display:flex!important;align-items:center;gap:10px;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;
 background:none!important;box-shadow:none!important;animation:none!important;white-space:nowrap!important;overflow:hidden!important;
 font:900 clamp(17px,5.4vw,21px)/1.15 ${MO}!important;letter-spacing:2.5px!important;text-transform:uppercase;text-align:left!important;color:var(--tx)!important}
${P} .sosct .sosr2t::before{content:"";flex:none;width:5px;align-self:stretch;min-height:28px;border-radius:3px;background:linear-gradient(180deg,#ff3b30,${OR})}
${P} .sosct .sosr2t::after{display:none!important}
${P} .sosr2t>span{background:linear-gradient(90deg,var(--tx) 25%,#ff3b30);-webkit-background-clip:text;background-clip:text;color:transparent;overflow:hidden;text-overflow:ellipsis}
${P} .soscx,${P} .soshb,${P} .shx{flex:none!important;height:50px!important;margin:0!important;border-radius:12px!important;border:1.5px solid ${BRD}!important;background:${FLD}!important;box-shadow:none!important;color:var(--tx)!important}
${P} .soscx,${P} .shx{width:50px!important;padding:0!important;font-size:20px!important;font-weight:800!important}
${P} .soshb{padding:0 10px!important;display:flex!important;align-items:center;gap:5px!important;font-size:17px!important;color:#1fa64a!important;border-color:color-mix(in srgb,#1fa64a 45%,transparent)!important}
${P} .soshb small{font:800 11px/1 ${MO}!important;letter-spacing:1px!important;text-transform:uppercase}
${P} .sostsub{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0 6px 15px;font:600 12px/1.2 ${MO};color:var(--mu);letter-spacing:.6px}
${P} .sostsub b{color:var(--tx)}${P} .sostdot{width:8px;height:8px;border-radius:50%;background:#ff3b30;animation:sostPul 1.4s infinite}
${P} .sostscan{position:relative;height:2px;margin:0 0 2px;border-radius:2px;background:color-mix(in srgb,var(--tx) 10%,transparent);overflow:hidden}
${P} .sostscan::after{content:"";position:absolute;top:0;bottom:0;width:35%;left:-35%;background:linear-gradient(90deg,transparent,${OR},${PU},transparent);animation:sostScan 2.6s cubic-bezier(.6,0,.4,1) infinite}
@keyframes sostScan{to{left:100%}}@keyframes sostPul{0%{box-shadow:0 0 0 0 #ff3b3088}70%{box-shadow:0 0 0 7px #ff3b3000}100%{box-shadow:0 0 0 0 #ff3b3000}}
${P} .soscp,${P} .sostps{display:none!important}
/* ---- paneles: tarjeta de consola ---- */
${P} #sostf{display:flex;flex-direction:column;gap:12px}
${P} .sostp{position:relative;overflow:visible;border-radius:18px!important;padding:0!important;
 background:linear-gradient(var(--card),var(--card)) padding-box,linear-gradient(135deg,${OR},${PU} 55%,#1e88e5) border-box!important;border:1.5px solid transparent!important;
 box-shadow:0 10px 40px -14px color-mix(in srgb,${PU} 45%,transparent)!important}
${P} .sostp::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:.06;
 background-image:linear-gradient(var(--tx) 1px,transparent 1px),linear-gradient(90deg,var(--tx) 1px,transparent 1px);background-size:22px 22px;
 -webkit-mask-image:linear-gradient(180deg,#000,transparent 60%);mask-image:linear-gradient(180deg,#000,transparent 60%)}
${P} .sostph{position:relative;display:flex!important;align-items:center;gap:10px!important;flex-wrap:nowrap!important;padding:14px 14px 4px!important;border:0!important;font-family:${MO}!important;text-transform:none!important;letter-spacing:0!important}
${P} .sostpn{flex:none;width:28px!important;height:28px!important;border-radius:8px!important;display:grid!important;place-items:center;font:900 14px/1 ${MO}!important;color:#fff!important;
 background:linear-gradient(135deg,${OR},${PU})!important;box-shadow:0 3px 10px -3px ${OR}!important}
${P} .sostpt{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
${P} .sostpt b{font:900 15px/1.15 ${MO}!important;letter-spacing:2px!important;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
 background:linear-gradient(90deg,var(--tx) 30%,${OR});-webkit-background-clip:text;background-clip:text;color:transparent!important}
${P} .sostpt small{font:600 10.5px/1.2 ${MO}!important;letter-spacing:.6px!important;color:var(--mu)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase;padding:0!important;margin:0!important}
${P} .sostpb{position:relative;padding:2px 14px 16px!important}
${P} .sostp2 .sostph{cursor:pointer;min-height:58px;padding-bottom:14px!important;-webkit-tap-highlight-color:transparent}
${P} .sostp2:not(.sostcer) .sostph{padding-bottom:4px!important}
${P} .sostp2.sostcer .sostpb{display:none}
${P} .sostpr{flex:none;order:0!important;margin:0!important;padding:7px 9px!important;border-radius:9px!important;border:1.5px solid ${BRD}!important;background:${FLD};font:800 11px/1 ${MO}!important;letter-spacing:1px!important;color:var(--mu)!important}
${P} .sostpr.on{border-color:#1fa64a!important;color:#1fa64a!important;background:color-mix(in srgb,#1fa64a 10%,transparent)}
${P} .sostpv{flex:none;order:0!important;width:40px!important;height:40px!important;border-radius:10px!important;display:grid!important;place-items:center;font-size:15px!important;border:1.5px solid ${BRD}!important;background:${FLD};color:var(--tx);transition:transform .2s}
${P} .sostp2:not(.sostcer) .sostpv{transform:rotate(180deg)}
/* ---- rótulos: como «Registrar OT» ---- */
${P} label:not(.srfoto){display:flex!important;align-items:center;gap:8px;margin:14px 0 8px!important;padding:0!important;font:800 11.5px/1 ${MO}!important;letter-spacing:1.6px!important;text-transform:uppercase;color:var(--mu)!important;white-space:nowrap;overflow:hidden;min-width:0}
${P} label:not(.srfoto)::before{content:"";flex:none;width:7px;height:7px;border-radius:50%;background:linear-gradient(135deg,${OR},${PU});box-shadow:none}
${P} label:not(.srfoto)::after{content:"";flex:1;min-width:10px;height:1px;background:linear-gradient(90deg,color-mix(in srgb,var(--tx) 18%,transparent),transparent)}
${P} label small{font:600 10px/1 ${MO}!important;letter-spacing:.6px!important;color:var(--mu)!important;opacity:.85;text-transform:none}
/* ---- campos ---- */
${P} input:not([type=file]):not([type=checkbox]):not([type=radio]),${P} select,${P} textarea{min-height:56px!important;margin:0!important;box-sizing:border-box;width:100%;
 border-radius:12px!important;border:1.5px solid ${BRD}!important;background:${FLD}!important;color:var(--tx)!important;box-shadow:none!important;
 font:500 17px/1.3 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;letter-spacing:0!important;padding:10px 12px!important;transition:border-color .2s,box-shadow .2s}
${P} input::placeholder,${P} textarea::placeholder{font-size:15.5px!important;font-weight:400!important;color:var(--mu)!important;opacity:.8}
${P} input:focus,${P} select:focus,${P} textarea:focus{outline:0!important;border-color:${OR}!important;box-shadow:0 0 0 4px color-mix(in srgb,${OR} 22%,transparent),0 6px 20px -8px ${OR}!important}
${P} #sr_p{font:800 18px/1 ${MO}!important;letter-spacing:3px!important}${P} #sr_p::placeholder{letter-spacing:.5px}
${P} .soscr2{display:flex!important;gap:8px!important;align-items:flex-end!important}${P} .soscpos{flex:0 0 38%!important;min-width:0}${P} .sostcw{flex:1;min-width:0}
${P} .sostcw .rcscmp{width:100%}${P} .rcsfil{display:flex;gap:8px}${P} .rcsbus{margin-top:6px!important}
${P} .srobsw{position:relative}${P} .srobsw textarea{min-height:120px!important;padding-right:64px!important;line-height:1.4!important}
${P} .srobsw button{position:absolute;right:8px!important;width:48px!important;height:48px!important;border-radius:12px!important;border:1.5px solid ${BRD}!important;background:var(--card)!important;box-shadow:none!important}
${P} .srobsw button svg{width:24px!important;height:24px!important}
/* ---- alarma a mano | foto ---- */
${P} .soscr3{display:flex!important;gap:8px!important;margin-top:12px!important}
${P} .soscr3 details.srtx,${P} .soscr3 .srfoto{flex:1 1 45%;min-height:58px!important;margin:0!important;border-radius:12px!important;border:1.5px solid ${BRD}!important;background:${FLD}!important;box-shadow:none!important;color:var(--tx)!important}
${P} .soscr3 details[open]{flex-basis:100%}
${P} .soscr3 details.srtx>summary{display:flex;align-items:center;justify-content:center;min-height:54px;margin:0!important;text-align:center;flex-wrap:wrap;gap:4px;
 font:800 12px/1.2 ${MO}!important;letter-spacing:1px!important;text-transform:uppercase;color:var(--tx)!important;white-space:normal}
${P} .soscr3 .srfoto{display:flex!important;flex-direction:column;align-items:center;justify-content:center;padding:6px!important;font:800 12px/1.2 ${MO}!important;letter-spacing:1px!important;text-transform:uppercase!important}
${P} .soscr3 .srfoto small,${P} .soscr3 summary small{font:600 10px/1.2 ${MO}!important;letter-spacing:.4px!important;color:var(--mu)!important;text-transform:none!important}
${P} .soscr3 .srfoto.srfok{border-color:#1fa64a!important;color:#1fa64a!important}
${P} .soscal{margin-top:2px}
/* ---- línea de abajo: pasos | ACEPTAR | reiniciar ---- */
${P} .srobrow{display:flex!important;align-items:stretch!important;gap:8px!important;margin-top:14px!important}
${P} .soscr3 details.srtx>summary{flex-wrap:nowrap!important;white-space:nowrap!important;gap:6px!important;letter-spacing:.3px!important;font-size:11.5px!important}
${P} .sostart{overflow:hidden;text-overflow:ellipsis}
${P} .sostarn{flex:none;display:inline-grid;place-items:center;min-width:24px;height:24px;padding:0 6px;border-radius:12px;font:900 12px/1 ${MO};background:color-mix(in srgb,var(--tx) 14%,transparent);color:var(--mu)}
${P} .sostarn.on{background:linear-gradient(135deg,${OR},${PU});color:#fff}
${P} #sr_t[readonly]{cursor:default;background:color-mix(in srgb,var(--card) 60%,var(--bg))!important;border-style:dashed!important;font:600 clamp(10.5px,3.2vw,12.5px)/1.7 ${MO}!important;letter-spacing:0!important;white-space:pre!important;overflow-x:hidden!important;overflow-wrap:normal!important;padding:8px 10px!important;min-height:0!important;-webkit-user-select:none;user-select:none;resize:none}
${P} #sr_ob{font:600 clamp(10.5px,3.2vw,12.5px)/1.7 ${MO}!important;letter-spacing:0!important}${P} #sr_ob::placeholder{font:500 clamp(10.5px,3.2vw,12.5px)/1.7 ${MO}!important;letter-spacing:0!important}
${P} #sr_t[readonly]:focus{border-color:${BRD}!important;box-shadow:none!important}
${P} .sostzf{display:flex;flex-wrap:nowrap;gap:5px;padding:2px 0 8px;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;touch-action:pan-x pan-y;scrollbar-width:none}
${P} .sostzf>.sostzb{flex:1 0 auto}${P} .sostzf::-webkit-scrollbar{display:none}
${P} .sostzb{flex:none;min-height:44px!important;margin:0!important;padding:0 12px!important;border-radius:22px!important;border:1.5px solid ${BRD}!important;background:${FLD}!important;color:var(--tx)!important;
 font:700 12px/1 system-ui,-apple-system,sans-serif!important;white-space:nowrap;box-shadow:none!important;padding:0 10px!important}
${P} .sostzb.on{border-color:transparent!important;color:#fff!important;background:linear-gradient(135deg,${OR},${PU})!important}
${P} .srobrow .soscl{flex:0 0 auto!important;width:clamp(112px,33vw,140px);display:flex!important;flex-direction:column!important;justify-content:center;gap:2px!important;margin:0!important;padding:4px 7px!important;
 list-style:none;counter-reset:s;border-radius:14px;border:1.5px solid ${BRD};background:${FLD};box-sizing:border-box}
${P} .srobrow .soscl li{counter-increment:s;display:flex!important;flex-direction:row!important;align-items:center!important;gap:6px!important;padding:0!important;margin:0!important;border:0!important;background:none!important;box-shadow:none!important;
 font:700 11px/1.1 system-ui,-apple-system,sans-serif!important;letter-spacing:0!important;text-transform:none;color:var(--tx)!important;white-space:nowrap;overflow:hidden;text-overflow:clip}
${P} .srobrow .soscl li::before{content:counter(s);flex:none;display:grid;place-items:center;width:15px!important;height:15px!important;border-radius:5px!important;border:0!important;
 font:900 9.5px/1 ${MO}!important;color:#fff!important;background:linear-gradient(135deg,${OR},${PU})!important;box-shadow:none!important}
${P} .srobrow .soscl li::after{display:none!important}
${P} .srobrow button.pri{position:relative;overflow:hidden;flex:1 1 auto!important;min-width:0;min-height:54px!important;margin:0!important;padding:0 6px!important;border:0!important;border-radius:14px!important;
 font:900 17px/1 ${MO}!important;letter-spacing:2.5px!important;text-transform:uppercase;white-space:nowrap;color:#111!important;text-shadow:none!important;animation:none!important;
 background:linear-gradient(135deg,#ffb020,${OR} 45%,#ff4d2e)!important;box-shadow:0 12px 28px -10px ${OR},0 0 0 1px #fff4 inset!important}
${P} .srobrow button.pri::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;transform:skewX(-20deg);background:linear-gradient(90deg,transparent,#fff7,transparent);animation:rgShine 3.2s ease-in-out infinite}
@keyframes rgShine{60%,100%{left:130%}}
${P} .srobrst{flex:none!important;width:54px!important;min-height:54px!important;margin:0!important;padding:0!important;display:grid!important;place-items:center;border-radius:14px!important;
 border:1.5px solid ${BRD}!important;background:${FLD}!important;color:${OR}!important;box-shadow:none!important}
${P} .srobrst svg{width:28px!important;height:28px!important}
${P} button:active,${P} .srfoto:active{transform:scale(.97)}
/* ---- desplegables y chips ---- */
${P} #rcs_l.on,${P} .sostcl{max-height:52vh;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;border-radius:12px!important;padding:6px!important;
 border:1.5px solid ${OR}!important;background:var(--card)!important;box-shadow:0 10px 30px -12px #0008}
${P} .rcslg,${P} .sostcz{font:800 11px/1.4 ${MO}!important;letter-spacing:1.4px!important;text-transform:uppercase;color:var(--mu)!important;margin:10px 4px 4px!important;display:flex;align-items:center;gap:6px}
${P} .rcsit,${P} .rcscb{min-height:52px!important;display:flex!important;flex-wrap:wrap;align-items:center;gap:6px;width:100%!important;margin:0 0 4px!important;padding:10px 12px!important;text-align:left;
 font:500 15px/1.3 system-ui,-apple-system,sans-serif!important;border-radius:10px!important;background:${FLD}!important;border:1px solid ${BRD}!important;color:var(--tx)!important}
${P} .rcscb small{flex-basis:100%;font-size:12px!important;color:var(--mu)}
${P} .rcscb .cmpid{font:800 13px/1.3 ${MO}!important;background:color-mix(in srgb,var(--tx) 70%,var(--card))!important;color:var(--card)!important;border-radius:6px;padding:2px 7px}
${P} .rcscb.sostya{opacity:.55}${P} .rcscb.sostya::after{content:"✓ ya en la avería";font:800 11px/1 ${MO};color:#1fa64a}
${P} #cmp_l:not(:empty){margin-top:8px}
${P} #sost_cmps{display:flex;flex-direction:column;gap:6px}${P} #sost_cmps:not(:empty){margin-top:10px}
${P} .sostch{display:flex;align-items:center;gap:8px;min-height:54px;padding:4px 4px 4px 10px;border-radius:12px;border:1.5px solid color-mix(in srgb,#1fa64a 55%,transparent);background:color-mix(in srgb,#1fa64a 8%,var(--card))}
${P} .sostch b{flex:none;font:800 13px/1.3 ${MO};background:color-mix(in srgb,var(--tx) 70%,var(--card));color:var(--card);border-radius:6px;padding:2px 7px}
${P} .sostch>span{flex:1;min-width:0;font-size:14px;font-weight:500;line-height:1.25}
${P} .sostch button{flex:none;width:46px!important;height:46px!important;margin:0!important;padding:0!important;border-radius:10px!important;font-size:18px!important;background:var(--card)!important;border:1.5px solid ${BRD}!important}
${P} .sostch .sostchx{color:#e5534b!important;border-color:color-mix(in srgb,#e5534b 55%,transparent)!important;font-weight:900}
${P} .rcsqx{width:40px!important;height:40px!important}
${P} .rcsb{border-radius:12px!important;padding:10px 12px!important}
/* ---- resultados e historial ---- */
${P} #sr_res button{border-radius:12px!important;min-height:50px}
${P} .sht{font:900 19px/1.15 ${MO}!important;letter-spacing:2px!important;text-transform:uppercase;color:var(--tx)!important}
${P} .shnew{min-height:58px!important;border-radius:14px!important;font:900 15px/1 ${MO}!important;letter-spacing:2px!important;border:0!important;color:#111!important;
 background:linear-gradient(135deg,#ffb020,${OR} 45%,#ff4d2e)!important}
${P} .shi{border-radius:14px!important;padding:12px!important;background:var(--card)!important;border:1.5px solid ${BRD}!important;border-left:4px solid #ff3b30!important}
html.ext ${P} input:not([type=file]),html.ext ${P} select,html.ext ${P} textarea{border-width:2.5px!important}
@media (prefers-reduced-motion:reduce){${P} *{animation:none!important}}`;
document.head.appendChild(st);
/* cabecera: título con su degradado y línea de estado con reloj en vivo, como «Registrar OT» y el Panel */
const DIAS=["dom","lun","mar","mié","jue","vie","sáb"],zz=n=>String(n).padStart(2,"0");let reloj=0;
function cabecera(){const c=sc();const h=c&&c.querySelector(".sosrh");if(!h||!$i("sr_ob"))return;const t=h.querySelector(".sosr2t");
 if(t&&!t.querySelector("span")){t.innerHTML="<span>SOS - DIRECTO</span>"}
 if(!h.querySelector(".sostsub")){const ct=h.querySelector(".sosct");if(!ct)return;ct.insertAdjacentHTML("afterend",`<div class="sostsub"><span class="sostdot"></span><span>SOS ACTIVO</span><span>·</span><b class="sostf"></b><b class="sosth"></b></div><div class="sostscan"></div>`)}
 const pinta=()=>{const f=document.querySelector("#sheetc .sostf");if(!f){clearInterval(reloj);reloj=0;return}const d=new Date();
  f.textContent=`${DIAS[d.getDay()]} ${zz(d.getDate())}/${zz(d.getMonth()+1)}`;document.querySelector("#sheetc .sosth").textContent=`${zz(d.getHours())}:${zz(d.getMinutes())}:${zz(d.getSeconds())}`};
 pinta();if(!reloj)reloj=setInterval(pinta,1000)}
})();
/* v822: estilo del botón FOTO de la cabecera de la caja 1 */
(function(){const st=document.createElement("style");st.textContent=`#sostf .sostp2>.sostph .sostcam{flex:none;margin:0 6px 0 auto;padding:7px 9px;border-radius:9px;border:1.5px solid #ffffff33;font:800 11px/1 ui-monospace,monospace;letter-spacing:.6px;cursor:pointer;white-space:nowrap}
#sostf .sostp2>.sostph .sostcam+.sostpr{margin-left:0!important}
@media (prefers-color-scheme:light){#sostf .sostp2>.sostph .sostcam{border-color:#0003}}`;document.head.appendChild(st)})();
/* ===== v824: caja 1 recolocada · título completo, sin flecha; columna derecha con CAMPANA (despliega) y FOTO del mismo tamaño,
   alineadas con la papelera y el micrófono de «Avería en campo» (48 × 48, a 8 px del borde interior) ===== */
(function(){const P="#sheetc #sostf";const st=document.createElement("style");st.textContent=`
${P} .sostp2 .sostpv{display:none!important}
${P} .sostp2>.sostph{align-items:flex-start!important;padding-right:14px!important;cursor:default!important}
${P} .sostp2>.sostph>*:not(.sostcol){min-width:0}
${P} .sostp2>.sostph .sostpt,${P} .sostp2>.sostph b,${P} .sostp2>.sostph small{white-space:normal!important;overflow:visible!important;text-overflow:clip!important}
${P} .sostp2>.sostph .sostcol{flex:none;margin-left:auto;margin-right:8px;display:flex;flex-direction:column;gap:8px}
${P} .sostp2>.sostph .sostcol .sostpr,${P} .sostp2>.sostph .sostcol .sostcam{box-sizing:border-box;width:48px!important;height:48px!important;padding:0!important;margin:0!important;display:grid!important;place-items:center;border-radius:12px!important;border:1.5px solid #ffffff2b!important;background:var(--card)!important;font:800 13px/1 ui-monospace,monospace!important;letter-spacing:0!important;cursor:pointer;color:var(--tx)!important;white-space:nowrap}
${P} .sostp2>.sostph .sostcol .sostcam{font-size:20px!important}
${P} .sostp2>.sostph .sostcol .sostpr{font-size:14px!important}
${P} .sostp2>.sostph .sostcol .sostpr.on,${P} .sostp2>.sostph .sostcol .sostcam.on{border-color:#1fa64a!important;color:#1fa64a!important;background:color-mix(in srgb,#1fa64a 12%,var(--card))!important}
${P} .sostp2:not(.sostcer)>.sostph .sostcol .sostpr{border-color:#ef6c00!important}
@media (prefers-color-scheme:light){${P} .sostp2>.sostph .sostcol .sostpr,${P} .sostp2>.sostph .sostcol .sostcam{border-color:#0002!important}}`;document.head.appendChild(st)})();
/* ===== v825: en la caja 1 queda solo el icono 📷 de la cabecera: fuera el botón «Foto Display-Magelis» y su rótulo ===== */
(function(){const st=document.createElement("style");st.textContent=`#sheetc #sostf .sostcam{display:none!important}`;document.head.appendChild(st);
 const oculta=()=>{document.querySelectorAll("#sheetc #sostf .sostpb label").forEach(l=>{if(/^\s*Foto de la Magelis/i.test(l.textContent||""))l.style.display="none"})};
 new MutationObserver(oculta).observe(document.body,{childList:true,subtree:true})})();
/* ===== v827: botones a la DERECHA del SUBTÍTULO, en la misma línea:
   caja 1 → campana + foto · caja 2 → micrófono + papelera (salen del recuadro de «Avería en campo», el texto usa todo el ancho) ===== */
(function(){const P="#sheetc #sostf";
const mueve=()=>{const h2=document.querySelector(P+" .sostp1>.sostph");if(!h2)return;
 let col=h2.querySelector(".sostcol2");if(!col){col=document.createElement("span");col.className="sostcol sostcol2";h2.appendChild(col)}
 const mic=document.querySelector(P+" .srobsw .micb"),del=document.querySelector(P+" .srobsw .srobdel");
 if(mic&&mic.parentNode!==col){col.querySelectorAll(".micb").forEach(x=>x.remove());col.prepend(mic)}if(del&&del.parentNode!==col)col.appendChild(del)};
new MutationObserver(mueve).observe(document.body,{childList:true,subtree:true});
const st=document.createElement("style");st.textContent=`
${P} .sostp2>.sostph,${P} .sostp1>.sostph{align-items:flex-end!important}
${P} .sostp2>.sostph .sostpn,${P} .sostp1>.sostph .sostpn{align-self:center}
${P} .sostph .sostcol{flex-direction:row!important;gap:8px!important;margin-left:auto;margin-right:0!important;flex:none;display:flex}
${P} .sostp1>.sostph .sostcol2 button{position:static!important;box-sizing:border-box;width:44px!important;height:44px!important;padding:0!important;margin:0!important;display:grid!important;place-items:center;border-radius:12px!important;border:1.5px solid #ffffff2b!important;background:var(--card)!important;color:var(--tx)!important;box-shadow:none!important}
${P} .sostp1>.sostph .sostcol2 button svg{width:22px!important;height:22px!important}
${P} .sostp1>.sostph .sostcol2 .micb.on{background:#c62828!important;color:#fff!important;border-color:#c62828!important}
${P} .sostp2>.sostph .sostcol .sostpr,${P} .sostp2>.sostph .sostcol .sostcam{width:44px!important;height:44px!important}
${P} .srobsw textarea{padding-right:12px!important;padding-bottom:10px!important}
@media (prefers-color-scheme:light){${P} .sostp1>.sostph .sostcol2 button{border-color:#0002!important}}`;document.head.appendChild(st)})();
/* v828: «ACOTA EL PROBLEMA» debajo de «COMPLEMENTARIA» en la caja 2 */
(function(){const f=()=>{const sm=document.querySelector("#sostf .sostp1 .sostpt small");if(sm&&/COMPLEMENTARIA · ACOTA/.test(sm.textContent))sm.innerHTML="COMPLEMENTARIA<br>ACOTA EL PROBLEMA"};new MutationObserver(f).observe(document.body,{childList:true,subtree:true})})();
/* v829: icono de la cámara dibujado con trazo blanco como la papelera; sin el punto de color de los rótulos */
(function(){const P="#sheetc #sostf";const st=document.createElement("style");st.textContent=`${P} .sostcam::before,${P} .sostcam::after{content:none!important;display:none!important}
${P} .sostp2>.sostph .sostcol .sostcam svg{width:22px;height:22px;color:var(--tx)}
${P} .sostp2>.sostph .sostcol .sostcam.on svg{color:#1fa64a}`;document.head.appendChild(st)})();
/* ===== v830: «Posición» (sin PBB) con su caja ajustada al rótulo y más baja; «Componente de campo» a la misma altura ===== */
(function(){const P="#sheetc #sostf";const st=document.createElement("style");st.textContent=`
${P} .soscpos{flex:0 0 auto!important;width:auto!important;max-width:34%}
${P} .soscpos #sr_p{box-sizing:border-box;width:7.2em!important;max-width:100%;height:46px!important;min-height:0!important;padding:0 12px!important;font-size:17px!important;letter-spacing:2px!important}
${P} .sostcw #cmp_q{box-sizing:border-box;height:46px!important;min-height:0!important;padding-top:0!important;padding-bottom:0!important}
${P} .sostcw .rcscmp{height:auto}`;document.head.appendChild(st)})();
/* ===== v831: caja 1 al abrir el SOS (v832: desplegada); campana sola a la derecha; botón «Foto Magelis» con icono de trazo ===== */
/* v832: corregido · la caja 1 SIEMPRE DESPLEGADA al abrir el SOS (la campana la pliega si se quiere) */
(function(){const pliega=()=>{const P2=document.querySelector("#sostf .sostp2");if(P2)P2.classList.remove("sostcer")};
 const o=window.sosRap;if(typeof o=="function")window.sosRap=function(){const r=o.apply(this,arguments);try{pliega();setTimeout(pliega,0)}catch(e){}return r};
 let ab=false;setInterval(()=>{const a=!!document.querySelector("#sheetc #sostf");if(a&&!ab)pliega();ab=a},300);
 const st=document.createElement("style");st.textContent=`#sheetc #sostf label.srfoto>span{display:inline-flex;align-items:center;gap:8px}
#sheetc #sostf label.srfoto .srcam{width:22px;height:22px;flex:none;color:var(--tx)}
#sheetc #sostf label.srfoto small{display:block}`;document.head.appendChild(st)})();
/* ===== v853: iconos propios de ALARMA (hexágono rojo) y AVISO (triángulo amarillo) al lado de la CAMPANA de la caja 1 ===== */
(function(){const P="#sheetc #sostf";
const pon=()=>{const col=document.querySelector(P+" .sostp2>.sostph .sostcol");if(!col)return;const bell=col.querySelector(".sostpr");if(!bell||col.querySelector(".sostleg"))return;
 bell.insertAdjacentHTML("beforebegin",`<span class="sostleg" aria-hidden="true"><img src="iconos/alarma.png" alt=""><img src="iconos/advertencia.png" alt=""></span>`)};
new MutationObserver(pon).observe(document.body,{childList:true,subtree:true});pon();
const st=document.createElement("style");st.textContent=`
${P} .sostp2>.sostph .sostcol{align-items:center!important}
${P} .sostp2>.sostph .sostcol .sostleg{display:inline-flex;align-items:center;gap:6px;height:44px;pointer-events:none}
${P} .sostp2>.sostph .sostcol .sostleg img{width:28px;height:28px;display:block;object-fit:contain}`;document.head.appendChild(st)})();
