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
const st=document.createElement("style");st.id="sostcss";st.textContent=`
/* ---------- hoja a pantalla completa ---------- */
${S}{align-items:stretch!important;background:var(--card)!important}
${S}>#sheetc{max-height:none!important;height:100%!important;height:100dvh!important;width:100%!important;border-radius:0!important;border-top:0!important;
 padding:calc(10px + env(safe-area-inset-top,0px)) 14px calc(96px + env(safe-area-inset-bottom,0px)) 14px!important;
 --sk-l:color-mix(in srgb,var(--tx) 6%,transparent);--sk-l2:color-mix(in srgb,var(--tx) 3%,transparent);
 --sk-in:color-mix(in srgb,var(--card) 88%,var(--tx));--sk-ed:color-mix(in srgb,var(--bd) 70%,var(--tx));
 background-color:var(--card)!important;
 background-image:linear-gradient(var(--sk-l) 1px,transparent 1px),linear-gradient(90deg,var(--sk-l) 1px,transparent 1px),
  linear-gradient(var(--sk-l2) 1px,transparent 1px),linear-gradient(90deg,var(--sk-l2) 1px,transparent 1px)!important;
 background-size:48px 48px,48px 48px,12px 12px,12px 12px!important;background-attachment:local!important}

/* ---------- cabecera ---------- */
${S} .sosct{gap:8px!important;margin:0 0 8px!important;align-items:stretch!important}
${S} .sosct .sosr2t{position:relative;display:flex;align-items:center;justify-content:center;min-height:56px;padding:6px 26px!important;border-radius:12px!important;
 font-size:clamp(16px,5vw,21px)!important;letter-spacing:.06em!important;border:2px solid #ff4d4f!important;
 background:linear-gradient(180deg,#e8262a,#b3121a)!important;box-shadow:inset 0 1px 0 #ffffff40,inset 0 -3px 0 #0000003a,0 3px 10px #c6282855;overflow:hidden}
${S} .sosct .sosr2t::before,${S} .sosct .sosr2t::after{content:"";position:absolute;top:0;bottom:0;width:16px;
 background:repeating-linear-gradient(135deg,#ffd200 0 6px,#111 6px 12px);opacity:.95}
${S} .sosct .sosr2t::before{left:0}${S} .sosct .sosr2t::after{right:0}
${S} .soscx,${S} .shx{width:56px!important;height:56px!important;border-radius:12px!important;font-size:24px!important;border:2px solid var(--sk-ed)!important;
 background:var(--sk-in)!important;box-shadow:inset 0 -3px 0 #0002}
${S} .soshb{height:56px!important;padding:0 12px!important;border-radius:12px!important;border-width:2px!important;font-size:20px!important;gap:5px!important;
 background:color-mix(in srgb,#1fa64a 10%,var(--card))!important;box-shadow:inset 0 -3px 0 #0002}
${S} .soshb small{font-size:13px!important;letter-spacing:.02em}
${S} .soscp{font-size:13.5px!important;line-height:1.35!important;margin:0 0 10px!important;padding:8px 10px;border-left:4px solid var(--ac);
 background:color-mix(in srgb,var(--ac) 7%,transparent);border-radius:0 8px 8px 0;text-align:left!important;color:var(--tx)!important}

/* ---------- pasos 1 → 2 → 3 como cadena de proceso ---------- */
${S} .soscl{gap:14px!important;margin:0 0 12px!important}
${S} .soscl li{position:relative;flex-direction:column;align-items:flex-start!important;gap:6px!important;padding:8px 8px 9px!important;font-size:11.5px!important;
 line-height:1.2!important;letter-spacing:.02em;border:2px solid var(--sk-ed)!important;border-style:solid!important;border-radius:10px!important;
 background:var(--sk-in);box-shadow:inset 0 -3px 0 #0001}
${S} .soscl li::before{width:28px!important;height:28px!important;font-size:15px!important;border-radius:8px!important;background:var(--ac);color:#fff!important;border:0!important;
 box-shadow:inset 0 -2px 0 #0003}
${S} .soscl li:not(:last-child)::after{content:"";position:absolute;right:-12px;top:50%;width:0;height:0;margin-top:-7px;border:7px solid transparent;border-left:9px solid var(--ac)}

/* ---------- rótulos: monoespaciada con piloto ---------- */
${S} label:not(.srfoto),${S} details.srtx>summary{font-family:var(--tkmo,ui-monospace,Menlo,monospace)!important;text-transform:uppercase;letter-spacing:.06em!important;
 font-size:13px!important;font-weight:800!important;margin:12px 0 5px!important;display:flex;align-items:center;gap:6px}
${S} label:not(.srfoto)::before{content:"";flex:none;width:8px;height:8px;border-radius:50%;background:var(--ac);box-shadow:0 0 0 3px color-mix(in srgb,var(--ac) 25%,transparent)}
${S} .soscr2 label{display:flex!important}

/* ---------- casillas grandes con bisel ---------- */
${S} input:not([type=file]):not([type=checkbox]):not([type=radio]),${S} select,${S} textarea{min-height:60px!important;font-size:18px!important;
 border:2px solid var(--sk-ed)!important;border-radius:12px!important;background:var(--sk-in)!important;color:var(--tx)!important;
 box-shadow:inset 0 2px 4px #0000001f!important;padding:10px 12px!important;box-sizing:border-box}
${S} .soscr2 input,${S} .soscr2 select,${S} .rcsfil input{height:60px!important}
${S} select{padding-right:34px!important}
${S} input:focus,${S} select:focus,${S} textarea:focus{outline:0!important;border-color:var(--ac)!important;
 box-shadow:0 0 0 4px color-mix(in srgb,var(--ac) 28%,transparent),inset 0 2px 4px #0000001f!important}
${S} .rcsfil{gap:8px!important}${S} .rcsbus{margin-top:4px!important}
${S} .rcsfil .rcscmp input::placeholder{font-size:16px!important}
${S} .soscr2{gap:8px!important}

/* ---------- avería en campo ---------- */
${S} .srobsw textarea{min-height:132px!important;padding-right:66px!important;line-height:1.4}
${S} .srobsw button{width:52px!important;height:52px!important;border-radius:12px!important;border-width:2px!important;right:8px!important}
${S} .srobsw button svg{width:26px!important;height:26px!important}

/* ---------- alarma a mano | foto: pulsadores grandes ---------- */
${S} .soscr3{gap:10px!important;margin-top:12px!important}
${S} .soscr3 details.srtx,${S} .soscr3 .srfoto{min-height:68px!important;border:2px solid var(--sk-ed)!important;border-radius:14px!important;
 background:var(--sk-in)!important;box-shadow:inset 0 -4px 0 #00000022!important}
${S} .soscr3 details.srtx>summary{margin:0!important;font-size:15px!important;line-height:1.2;min-height:60px;justify-content:center;flex-wrap:wrap;text-align:center}
${S} .soscr3 .srfoto{font-size:16px!important}${S} .soscr3 .srfoto small,${S} .soscr3 summary small{font-size:11.5px!important;text-transform:none;letter-spacing:0}
${S} .soscr3 .srfoto.srfok{border-color:#2e7d32!important}

/* ---------- ACEPTAR tipo pulsador y papelera ---------- */
${S} .srobrow{gap:10px!important;margin-top:16px!important}
${S} .srobrow button.pri{min-height:72px!important;border-radius:14px!important;font-size:22px!important;font-weight:900!important;
 letter-spacing:.14em!important;text-transform:uppercase;border:2px solid color-mix(in srgb,var(--ac) 70%,#000)!important;color:#fff!important;
 background:linear-gradient(180deg,color-mix(in srgb,var(--ac) 82%,#fff),var(--ac) 55%,color-mix(in srgb,var(--ac) 80%,#000))!important;
 box-shadow:inset 0 1px 0 #ffffff59,inset 0 -5px 0 #00000033,0 4px 12px color-mix(in srgb,var(--ac) 40%,transparent)!important;text-shadow:0 1px 1px #0005}
${S} .srobrow button.pri:active,${S} .soscr3 .srfoto:active,${S} .soscx:active,${S} .soshb:active{transform:translateY(2px);box-shadow:inset 0 2px 4px #0003!important}
${S} .srobrst{width:72px!important;min-height:72px!important;border-radius:14px!important;border-width:2.5px!important;box-shadow:inset 0 -4px 0 #00000022}
${S} .srobrst svg{width:30px!important;height:30px!important}

/* ---------- listas de alarmas y componentes: filas para el dedo con guante ---------- */
${S} .rcsit{min-height:54px!important;padding:12px 12px!important;font-size:15px!important;display:flex!important;align-items:center;gap:6px;border-radius:10px!important;margin:0 0 4px!important}
${S} #rcs_l.on{max-height:52vh!important;border-width:2px!important;border-radius:12px!important;padding:6px!important;background:var(--card)}
${S} .rcslg{font-size:12.5px!important;margin:10px 4px 4px!important;display:flex;align-items:center;gap:6px}
${S} .rcscb{min-height:56px!important;font-size:15px!important;padding:10px 12px!important;border-radius:10px!important}
${S} .rcsqx{width:40px!important;height:40px!important;font-size:18px!important}
${S} .rcsb{border-radius:10px!important;padding:10px 12px!important}

/* ---------- resultados e historial ---------- */
${S} #sr_res button,${S} #sr_res summary,${S} .shnew,${S} .shi button{min-height:52px}
${S} #sr_res button{border-radius:12px!important;font-size:16px!important}
${S} .shh{gap:8px!important}${S} .sht{font-size:21px!important}
${S} .shi{border-radius:12px!important;padding:12px!important;font-size:14.5px!important}
${S} .shnew{min-height:60px!important;font-size:17px!important;border-radius:12px!important}

/* ---------- exterior / alto contraste ---------- */
html.ext ${S} input:not([type=file]),html.ext ${S} select,html.ext ${S} textarea,html.ext ${S} .soscr3 .srfoto,html.ext ${S} .soscr3 details.srtx{border-width:3px!important}`;
document.head.appendChild(st);
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
 const h=c.querySelector(".sosrh");const tt=h&&h.querySelector(".sosr2t");if(tt&&tt.textContent!=="SOS - DIRECTO")tt.textContent="SOS - DIRECTO";
 let F=$i("sostf");
 if(!F){F=document.createElement("div");F.id="sostf";
  /* v722: permutados · 1 ALARMA MAGELIS (arriba) · 2 PBB Y AVERÍA */
  F.append(panel("sostp2","1","ALARMA MAGELIS","COMPLEMENTARIA · ACOTA EL PROBLEMA"),panel("sostp1","2","PBB Y AVERÍA","OBLIGATORIO · LO QUE SE DETECTA"));
  const ps=document.createElement("div");ps.className="sostps";ps.innerHTML=`<div class="sostpst">Al aceptar sale</div>`;F.append(ps);
  if(h)h.after(F);else c.prepend(F)}
 const B1=F.querySelector(".sostp1>.sostpb"),B2=F.querySelector(".sostp2>.sostpb"),PS=F.querySelector(".sostps");
 const pon=(box,el)=>{if(el&&el.parentNode!==box)box.appendChild(el)};
 /* panel 1: Posición | Componente, desplegable y chips, avería */
 const fila=c.querySelector(".soscr2");pon(B1,fila);
 const cq=$i("cmp_q");const cw=cq&&cq.closest(".rcscmp");
 if(fila&&cw&&cw.parentNode!==fila){let w=fila.querySelector(".sostcw");if(!w){w=document.createElement("div");w.className="sostcw";w.innerHTML=`<label for="cmp_q">Componente</label>`;fila.appendChild(w)}w.appendChild(cw);cq.placeholder="Si se sabe ▾"}
 pon(B1,$i("cmp_l"));
 let ch=$i("sost_cmps");if(!ch){ch=document.createElement("div");ch.id="sost_cmps"}pon(B1,ch);
 const lo=c.querySelector('label[for="sr_ob"]');pon(B1,lo);pon(B1,ob.closest(".srobsw"));
 /* panel 2: buscador del manual, lista rápida, a mano y foto */
 pon(B2,c.querySelector(".rcsbus:not(.otrcs)"));
 const al=c.querySelector(".soscal");if(al){pon(B2,al);const la=al.querySelector("label");if(la&&!la.dataset.st){la.dataset.st=1;la.innerHTML='Lista rápida SOS <small>(casos frecuentes)</small>'}}
 pon(B2,c.querySelector(".soscr3"));pon(B2,$i("sr_f"));pon(B2,$i("sr_pv"));
 /* pasos y ACEPTAR al final del formulario */
 /* v720: panel 2 PLEGADO hasta tocar su cabecera; en la cabecera, lo que ya lleva (alarmas, foto) */
 const P2=F.querySelector(".sostp2");if(P2&&!P2.dataset.pl){P2.dataset.pl=1;P2.classList.add("sostcer");const hd=P2.querySelector(".sostph");
  hd.setAttribute("role","button");hd.tabIndex=0;hd.insertAdjacentHTML("beforeend",`<span class="sostpr"></span><span class="sostpv" aria-hidden="true">▾</span>`);
  hd.addEventListener("click",()=>{P2.classList.toggle("sostcer");if(!P2.classList.contains("sostcer"))requestAnimationFrame(()=>P2.scrollIntoView({block:"nearest",behavior:"smooth"}))})}
 resumen2();
 /* v721: los pasos 1-2-3 van en la MISMA LÍNEA que ACEPTAR (a la izquierda, compactos) */
 const ol=c.querySelector(".soscl"),row=c.querySelector(".srobrow");if(PS&&PS.isConnected)PS.remove();
 if(row){if(row.previousElementSibling!==F)F.after(row);if(ol&&ol.parentNode!==row)row.prepend(ol);
  if(ol&&!ol.dataset.st){ol.dataset.st=1;const T=["Sacar en servicio","Reparar","Análisis IA"];[...ol.children].forEach((li,k)=>{if(T[k])li.textContent=T[k]})}
  const rs=row.querySelector(".srobrst");if(rs&&!rs.dataset.st){rs.dataset.st=1;rs.innerHTML=RECARGA;rs.setAttribute("aria-label","Reiniciar el SOS");rs.title="Reiniciar el SOS"}}
 /* rótulos cortos que caben en su caja */
 if(lo&&lo.textContent!=="Avería en campo")lo.textContent="Avería en campo";
 const lp=c.querySelector(".soscpos label");if(lp&&lp.textContent!=="Posición PBB")lp.textContent="Posición PBB";
 pintaChips()}
function resumen2(){const P2=document.querySelector("#sostf .sostp2");if(!P2)return;const r=P2.querySelector(".sostpr");if(!r)return;
 const t=($i("sr_t")||{}).value||"";const n=(typeof rcsListaAl=="function"?rcsListaAl(t).length:0)||(t.trim()?t.trim().split("\n").filter(Boolean).length:0);
 const lb=document.querySelector("#sheetc label.srfoto");const fo=!!(lb&&lb.classList.contains("srfok"));
 const x=[n?`🔔 ${n}`:"",fo?"📷":""].filter(Boolean).join(" · ")||"AÑADIR";if(r.textContent!==x)r.textContent=x;r.classList.toggle("on",!!(n||fo))}
document.addEventListener("input",e=>{if(e.target&&e.target.id=="sr_t")resumen2()});
/* ---------- componente: desplegable, elegir, chips ---------- */
const RECARGA=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>`;
const lineaC=c=>`Componente ${c.id}${c.t?" ("+c.t+")":""}`;
function elegidos(){const t=($i("sr_ob")||{}).value||"";return COMPS().filter(c=>t.includes(lineaC(c)))}
function pintaChips(){const ch=$i("sost_cmps");if(!ch)return;const L=elegidos();const k=L.map(ck).join("|");if(ch.dataset.k===k)return;ch.dataset.k=k;
 ch.innerHTML=L.map(c=>`<span class="sostch"><b>${E(c.id)}</b><span>${E(c.t||"")}</span><button type="button" class="sostchf" data-k="${E(ck(c))}" aria-label="Ver ficha de ${E(c.id)}">📄</button><button type="button" class="sostchx" data-k="${E(ck(c))}" aria-label="Quitar ${E(c.id)}">✕</button></span>`).join("")}
function lista(){const cl=$i("cmp_l");if(!cl)return;const L=COMPS().slice().sort((a,b)=>String(a.id).localeCompare(String(b.id),"es",{numeric:true}));
 if(!L.length){cl.innerHTML=`<div class="rcsnada">Aún no hay componentes de campo en el catálogo.</div>`;cl.dataset.st="1";return}
 const ya=new Set(elegidos().map(ck));const G=new Map();L.forEach(c=>{const z=zona(c.id);if(!G.has(z))G.set(z,[]);G.get(z).push(c)});
 cl.innerHTML=`<div class="sostcl">${[...G].map(([z,X])=>`<div class="sostcz">${E(z)}</div>`+X.map(c=>`<button type="button" class="rcscb${ya.has(ck(c))?" sostya":""}" data-k="${E(ck(c))}"><span class="cmpid">${E(c.id)}</span> ${E(c.t||"")}${c.fab?`<small>${E(c.fab)}</small>`:""}</button>`).join("")).join("")}</div>`;cl.dataset.st="1"}
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
const st2=document.createElement("style");st2.textContent=`
${S} .soscp{display:none!important}
${S} .sosct .sosr2t{font-size:clamp(18px,6vw,24px)!important;letter-spacing:.1em!important}
${S} #sostf{display:flex;flex-direction:column;gap:14px}
${S} .sostp{border:2px solid var(--sk-ed);border-radius:16px;background:color-mix(in srgb,var(--card) 94%,var(--tx));box-shadow:0 2px 0 #0000000d,inset 0 1px 0 #ffffff14;overflow:visible}
${S} .sostp1{border-color:color-mix(in srgb,var(--ac) 65%,var(--sk-ed))}
${S} .sostph{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 12px;border-bottom:2px dashed var(--sk-ed);
 font-family:var(--tkmo,ui-monospace,Menlo,monospace);text-transform:uppercase;letter-spacing:.06em}
${S} .sostph b{font-size:15px;font-weight:900}${S} .sostph small{flex-basis:100%;font-size:11.5px;font-weight:700;letter-spacing:.02em;text-transform:none;font-family:inherit;color:var(--mu);padding-left:44px;margin-top:-4px}
${S} .sostpn{flex:none;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:900;color:#fff;background:var(--ac);box-shadow:inset 0 -3px 0 #0003}
${S} .sostp2 .sostpn{background:#1565c0}${S} .sostp2{border-color:color-mix(in srgb,#1565c0 55%,var(--sk-ed))}
${S} .sostpb{padding:4px 12px 14px}
${S} .sostpb>label:first-child,${S} .sostpb>.soscr2:first-child label,${S} .sostpb>.rcsbus:first-child{margin-top:8px!important}
${S} .soscr2{align-items:flex-end!important}${S} .soscpos{flex:0 0 40%!important}${S} .sostcw{flex:1;min-width:0}
${S} .sostcw .rcscmp{flex:none!important;width:100%}
${S} .sostcw .rcscmp input{height:60px!important;font-size:17px!important}${S} .sostcw .rcscmp input::placeholder{font-size:17px!important;color:var(--tx);opacity:.7}
${S} .soscal{margin-top:4px}
${S} .rcsbus{margin-top:10px!important}
${S} #cmp_l:not(:empty){margin-top:8px}
${S} .sostcl{max-height:52vh;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;border:2px solid var(--ac);border-radius:12px;padding:6px;background:var(--card)}
${S} .sostcz{font:800 12.5px/1.4 var(--tkmo,monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ac);margin:10px 4px 4px}
${S} .sostcz:first-child{margin-top:2px}
${S} .rcscb.sostya{opacity:.55}${S} .rcscb.sostya::after{content:" ✓ ya en la avería";font-size:12px;font-weight:800;color:#1fa64a}
${S} #sost_cmps{display:flex;flex-direction:column;gap:6px}${S} #sost_cmps:not(:empty){margin-top:10px}
${S} .sostch{display:flex;align-items:center;gap:8px;min-height:56px;padding:4px 4px 4px 10px;border:2px solid #1fa64a;border-radius:12px;background:color-mix(in srgb,#1fa64a 8%,var(--card))}
${S} .sostch b{flex:none;background:#455a64;color:#fff;border-radius:7px;padding:3px 8px;font-family:ui-monospace,monospace;font-size:14px}
${S} .sostch>span{flex:1;min-width:0;font-size:14px;font-weight:600;line-height:1.25}
${S} .sostch button{flex:none;width:48px!important;height:48px!important;margin:0!important;padding:0!important;border-radius:10px!important;font-size:20px!important;background:var(--sk-in)!important;border:2px solid var(--sk-ed)!important}
${S} .sostch .sostchx{color:#c62828!important;border-color:#c62828!important;font-weight:900}
${S} .sostp2 .sostph{cursor:pointer;min-height:56px;-webkit-tap-highlight-color:transparent}
${S} .sostpr{order:3;margin-left:auto;font:800 12px/1.2 var(--tkmo,monospace);letter-spacing:.02em;text-transform:none;padding:6px 9px;border-radius:8px;border:2px solid var(--sk-ed);color:var(--mu)}
${S} .sostpr.on{border-color:#1fa64a;color:#1fa64a;background:color-mix(in srgb,#1fa64a 10%,transparent)}
${S} .sostpv{order:4;flex:none;width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;border:2px solid var(--sk-ed);background:var(--sk-in);transition:transform .2s}
${S} .sostp2 .sostph small{order:5}
${S} .sostp2:not(.sostcer) .sostpv{transform:rotate(180deg)}
${S} .sostp2.sostcer .sostpb{display:none}${S} .sostp2.sostcer .sostph{border-bottom:0}
${S} .sostps{border:2px dashed var(--sk-ed);border-radius:16px;padding:8px 10px 10px}
${S} .sostpst{font:800 12px/1.4 var(--tkmo,monospace);letter-spacing:.08em;text-transform:uppercase;color:var(--mu);margin:0 2px 6px}
${S} .sostps .soscl{margin:0!important}
${S} .srobrow{margin-top:14px!important}
${S} .srvblink{animation:none!important}`;
document.head.appendChild(st2);

/* ---------- v721: tipografía como el PANEL DE CONTROL · textos ajustados a cajas y botones ---------- */
const st3=document.createElement("style");st3.textContent=`
${S} .sosct .sosr2t{font:900 clamp(15px,4.6vw,19px)/1.1 var(--tkmo,ui-monospace,monospace)!important;letter-spacing:.12em!important;white-space:nowrap!important;
 padding:6px 20px!important;min-width:0;flex:1 1 auto!important;overflow:hidden;text-overflow:clip}
${S} .sosct{flex-wrap:nowrap!important}${S} .soshb{flex:none!important}${S} .soshb small{font:600 11px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;letter-spacing:.04em!important}
${S} .sostph{flex-wrap:nowrap!important;gap:10px!important;padding:10px 12px!important}
${S} .sostpt{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
${S} .sostpt b{font:900 15px/1.15 var(--tkmo,ui-monospace,monospace)!important;letter-spacing:.14em!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${S} .sostpt small{font:500 9.5px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;letter-spacing:.08em!important;color:var(--mu)!important;padding:0!important;margin:0!important;flex-basis:auto!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase}
${S} .sostph>small{display:none}
${S} .sostpn{width:34px!important;height:34px!important;font:900 17px/1 var(--tkmo,ui-monospace,monospace)!important}
${S} .sostpr{order:0!important;margin:0!important;flex:none;font:700 11px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;letter-spacing:.08em!important;padding:8px 9px!important}
${S} .sostpv{order:0!important;width:38px!important;height:38px!important;font-size:16px!important}
${S} label:not(.srfoto),${S} details.srtx>summary{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;font-weight:600!important;font-size:12px!important;letter-spacing:.06em!important;
 color:var(--mu)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
${S} label:not(.srfoto)::before{width:7px!important;height:7px!important;box-shadow:0 0 0 2.5px color-mix(in srgb,var(--ac) 25%,transparent)!important}
${S} label small,${S} summary small{font-size:10px!important;font-weight:500!important;letter-spacing:.04em!important;color:var(--mu)!important}
${S} input:not([type=file]):not([type=checkbox]):not([type=radio]),${S} select,${S} textarea{font:500 17px/1.3 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;letter-spacing:0!important}
${S} input::placeholder,${S} textarea::placeholder{font-size:16px!important;font-weight:400!important;opacity:.65}
${S} .srobsw textarea{min-height:118px!important}
${S} .soscr3 details.srtx>summary{font-size:13px!important;color:var(--tx)!important;white-space:normal;line-height:1.2}
${S} .soscr3 .srfoto{font:600 13px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;}${S} .soscr3 .srfoto span{white-space:nowrap}
/* línea de abajo: pasos | ACEPTAR | recargar */
${S} .srobrow{display:flex!important;align-items:stretch!important;gap:8px!important;margin-top:14px!important}
${S} .srobrow .soscl{flex:0 0 auto!important;width:clamp(104px,31vw,132px);display:flex!important;flex-direction:column!important;justify-content:center;gap:3px!important;margin:0!important;padding:4px 6px!important;
 border:2px dashed var(--sk-ed);border-radius:12px;box-sizing:border-box}
${S} .srobrow .soscl li{flex:none!important;flex-direction:row!important;align-items:center!important;gap:6px!important;padding:0!important;border:0!important;background:none!important;box-shadow:none!important;
 font:600 10.5px/1.15 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif!important;letter-spacing:.02em!important;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-height:18px}
${S} .srobrow .soscl li::before{width:18px!important;height:18px!important;font-size:11px!important;border-radius:5px!important}
${S} .srobrow .soscl li::after{display:none!important}
${S} .srobrow button.pri{flex:1 1 auto!important;min-width:0;font:900 19px/1 var(--tkmo,ui-monospace,monospace)!important;letter-spacing:.16em!important;padding:0 6px!important;white-space:nowrap}
${S} .srobrst{flex:none!important;width:64px!important}${S} .srobrst svg{width:30px!important;height:30px!important}
${S} .sostps{display:none!important}`;
document.head.appendChild(st3);
})();
