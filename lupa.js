/* ===== v335: casilla SOS del Panel de control partida en dos botones: SOS | Lupa =====
 - Fondo de la casilla más claro (antes rayado granate oscuro).
 - Lupa: abre una línea para escribir lo que se quiere buscar. Al validar, la descripción se analiza con el mismo
   análisis exhaustivo de las OT (anaOT: palabras, correcciones, señales, elementos y cajas de la guía) contra TODOS
   los sistemas de la guía de campo (PAS, HZ, AAA, AAP…) y se presenta la ⭐ Actuación más eficaz del sistema que
   mejor encaja, con las alternativas y, si existe, la primera actuación de seguridad y los casos parecidos. */
(function(){
let LC=[],LT="";
const E=s=>typeof esc=="function"?esc(s):String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const IC=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>`;
window.lupaAbre=function(){LC=[];LT="";
 $("#sheetc").innerHTML=`<div class="lpah"><span class="lpai">${IC}</span><div><h3 style="margin:0">BUSCAR ACTUACIÓN MÁS EFICAZ</h3><div class="mu" style="font-size:12px">Cualquier sistema: pasarela, 400 Hz, aire acondicionado, AAP…</div></div></div>
 <form class="lpaf" onsubmit="event.preventDefault();lupaBusca()"><input id="lp_t" type="search" enterkeyhint="search" autocomplete="off" placeholder="Describe la avería o lo que quieres buscar"><button class="pri" type="submit" aria-label="Buscar">${IC}</button></form>
 <div id="lp_res"></div>
 <button class="sec" style="width:100%;margin-top:10px" onclick="closeSheet()">Cerrar</button>`;
 $("#sheet").style.display="flex";setTimeout(()=>{const i=document.getElementById("lp_t");if(i)i.focus()},60)};
/* palabras propias de cada sistema (código + nombre de la guía) para inclinar el sistema cuando se nombra */
const pista=(T,G,t)=>{let b=0;const w=new Set([T,...String(G.n||"").split(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9]+/)].map(norm).filter(x=>x.length>=3||x==T.toLowerCase()));
 w.forEach(x=>{if(new RegExp("\\b"+x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b").test(t))b+=x==T.toLowerCase()?3:1.5});return Math.min(b,4.5)};
window.lupaBusca=function(){const inp=document.getElementById("lp_t"),res=document.getElementById("lp_res");if(!inp||!res)return;
 const txt=(inp.value||"").replace(/\s+/g," ").trim();if(!txt){msg("Escribe lo que quieres buscar");inp.focus();return}inp.blur();
 LT=txt;const t=norm(txt);const st=Date.now();const S=[];
 /* 1º relevancia directa del texto con cada caja de cada sistema (sin las prioridades memorizadas, que solo ordenan dentro de un sistema) */
 Object.keys((typeof GUIA!="undefined"&&GUIA.tipos)||{}).forEach(T=>{const G=GUIA.tipos[T];if(!G||!G.s||!G.s.length)return;
  const ot={id:"lupa_"+T+"_"+st,pos:"",tipo:T,equipos:[T],estado:"abierta",desc:txt,def:"",com:"",obs:"",orden:"LUPA",fecha:""};
  let A=null;try{A=anaTerminos(ot)}catch(e){return}const bo=pista(T,G,t);
  const raw=G.s.map((s,si)=>{let r=0;try{r=anaPunt(s.t,A)*2+Math.min(anaPunt((s.p||[]).join(" "),A),6)*.5}catch(e){}return{si,r}});
  const mx=Math.max(0,...raw.map(x=>x.r));const nom=bo>=3;S.push({T,G,ot,raw,mx,nom,sc:mx>=1.5?mx+bo:(nom?bo:0)})});
 /* el sistema nombrado en el texto (p. ej. «aire acondicionado», «400 Hz») va por delante */
 S.sort((a,b)=>(b.nom-a.nom)||(b.sc-a.sc));let C=[],an=null;
 const S0=S[0];if(S0&&S0.nom&&S0.mx<1.5){let R=null;try{R=anaOT(S0.ot)}catch(e){}an=R?{R,ot:S0.ot}:null;LC=S0.G.s.map((s,si)=>({T:S0.T,si,s,ot:S0.ot,gen:1}));lupaPinta(0,an);casos(txt);return}
 S.filter((x,ix)=>x.sc>0&&(ix==0||x.sc>=S[0].sc*.7)).slice(0,2).forEach((x,ix)=>{const lim=Math.max(1.5,x.mx*.4);const ok=new Map(x.raw.filter(y=>y.r>=lim).map(y=>[y.si,y.r]));
  let R=null;try{R=anaOT(x.ot)}catch(e){}if(ix==0)an=R?{R,ot:x.ot}:null;
  /* 2º dentro del sistema: el orden del análisis de OT (actuaciones memorizadas primero) entre las cajas relacionadas con el texto */
  const ord=[...((R&&R.guia)||[]).map(g=>g.si).filter(si=>ok.has(si)),...[...ok.entries()].sort((a,b)=>b[1]-a[1]).map(e=>e[0])];
  [...new Set(ord)].slice(0,ix==0?4:2).forEach(si=>C.push({T:x.T,si,s:x.G.s[si],ot:x.ot}))});
 LC=C;
 lupaPinta(0,an);casos(txt)};
const pasos=s=>{const inf=[],acc=[];(s.p||[]).forEach(p=>{const i=typeof gEsInfo=="function"&&gEsInfo(p);(i?inf:acc).push(p)});
 const pr=acc.filter(p=>/^PRIORIDAD/i.test(p)),re=acc.filter(p=>!/^PRIORIDAD/i.test(p));return{acc:[...pr,...re],inf}};
window.lupaPinta=function(k,an){const res=document.getElementById("lp_res");if(!res)return;
 const ana=an&&an.R?`<details class="lpaan"><summary>🎯 Análisis del texto${an.R.mods&&an.R.mods.length?` · ${an.R.mods.length} módulo(s)`:""}${an.R.elem&&an.R.elem.length?` · ${an.R.elem.length} elemento(s)`:""}</summary>
  ${an.R.pal&&an.R.pal.length?`<div class="anal">Palabras analizadas</div><div class="anaw">${an.R.pal.map(p=>`<span class="anac${p.w!=p.w0?" anafix":""}">${E(p.w!=p.w0?p.w0+" → "+p.w:p.w)}</span>`).join("")}</div>`:""}
  ${an.R.mods&&an.R.mods.length?`<div class="anal">Módulos PLC implicados</div><div class="anaw">${an.R.mods.map(m=>`<span class="anae">${E(m)}</span>`).join("")}</div>`:""}
  ${an.R.elem&&an.R.elem.length?`<div class="anal">Elementos de campo a revisar</div><div class="anaw">${an.R.elem.map(m=>`<span class="anae">${E(m)}</span>`).join("")}</div>`:""}
  ${an.R.rel&&an.R.rel.length?`<div class="anal">Señales implicadas (de más a menos probable)</div>${an.R.rel.slice(0,6).map((x,ix)=>`<div class="lpasg"><b>${ix+1}.</b> ${E(x.mod)} · Mód. ${E(x.S.k||"-")} · LED ${E(x.S.l||"-")} — ${E(x.S.t)}</div>`).join("")}`:""}</details>`:"";
 if(!LC.length){res.innerHTML=`<div class="gav" style="margin-top:10px">No se ha relacionado ninguna actuación con «${E(LT)}». Detalla el elemento, el síntoma o la alarma (p. ej. «no sube», «límite extensión», «400 Hz no recoge manguera»).</div>${ana}<div id="lp_cas"></div>`;return}
 const c=LC[k]||LC[0],G=GUIA.tipos[c.T],P=pasos(c.s);
 if(c.gen&&an){res.innerHTML=`<div class="gav" style="margin-top:10px">En la guía de <b>${E(G.n||c.T)}</b> no hay una actuación que cite «${E(LT)}». Elige la caja del sistema que corresponda al síntoma:</div><div class="anass" style="margin-top:8px">${LC.map((x,ix)=>`<button class="anag" onclick="LUPA_GEN(${ix})">📋 ${E(x.s.t)}</button>`).join("")}</div>${ana}<div id="lp_cas"></div>`;return}
 let prim="";if(c.T=="PAS"){try{const S=typeof segOT=="function"?segOT(c.ot):null,Pu=typeof puentesOT=="function"?puentesOT(c.ot):[];
  const h=(S?segHTML(c.ot,S):"")+(Pu&&Pu.length?puenteHTML(c.ot,Pu):"");if(h)prim=`<details class="lpapr"><summary>⚠️ Primera actuación en campo (seguridad)</summary><div class="card pucard">${h}</div></details>`}catch(e){}}
 const alt=LC.map((x,ix)=>ix==k?"":`<button class="anag" onclick="lupaPinta(${ix},null)">📋 ${E(GUIA.tipos[x.T].n||x.T)} · ${E(x.s.t)}</button>`).join("");
 const vg=(typeof tecnico!="undefined"&&tecnico)||(typeof admin!="undefined"&&admin);
 res.innerHTML=`<div class="lpaef"><span class="gefb">⭐ Actuación más eficaz</span><div class="lpasy">${E(G.n||c.T)}</div><h3>${E(c.s.t)}</h3>
  ${P.acc.map((p,ix)=>`<div class="lpap"><b>${ix+1}.</b><span>${E(p)}</span></div>`).join("")}
  ${P.inf.length?`<details class="gelem"><summary>Elementos y referencias (${P.inf.length})</summary>${P.inf.map(p=>`<div class="gelit"><span>${E(typeof gInfoTxt=="function"?gInfoTxt(p):p)}</span></div>`).join("")}</details>`:""}
  ${vg?`<button class="sec" style="width:100%;margin-top:8px" onclick="lupaGuia('${c.T}',${c.si})">Abrir en la guía de campo</button>`:""}</div>
  ${prim}${alt?`<div class="anal" style="margin-top:10px">Otras actuaciones relacionadas</div><div class="anass">${alt}</div>`:""}${an?ana:(document.querySelector("#lp_res .lpaan")||{}).outerHTML||""}<div id="lp_cas">${(document.getElementById("lp_cas")||{}).innerHTML||""}</div>`;
 if(an!==undefined&&an!==null)res.scrollIntoView({block:"start",behavior:"smooth"});else{const e=res.querySelector(".lpaef");if(e)e.scrollIntoView({block:"start",behavior:"smooth"})}};
async function casos(txt){if(typeof casosParecidos!="function")return;let l=[];try{l=await casosParecidos(txt)}catch(e){}
 const c=document.getElementById("lp_cas");if(!c||txt!==LT)return;c.innerHTML=l.length&&typeof casosHTML=="function"?`<div style="margin-top:10px">${casosHTML(l,"")}</div>`:""}
window.LUPA_GEN=function(ix){LC=LC.map((x,i)=>Object.assign({},x,{gen:0}));const c=LC.splice(ix,1)[0];LC.unshift(c);lupaPinta(0,null)};
window.lupaGuia=function(T,si){closeSheet();gTipo=T;try{gAbierto.add(T+si)}catch(e){}go("tec");
 setTimeout(()=>{const d=document.querySelector(`details.gd[data-k="${T+si}"]`);if(d){d.open=true;d.scrollIntoView({block:"start",behavior:"smooth"})}},120)};
const st=document.createElement("style");st.textContent=`
#app#app .sosk.sos2{display:flex!important;flex-direction:row!important;align-items:stretch!important;justify-content:stretch!important;gap:0!important;padding:0!important;overflow:hidden;
 border:2px solid #e5342b!important;background:repeating-linear-gradient(135deg,#ffe7e4 0 8px,#ffd9d4 8px 16px)!important}
#app#app .sos2 .sos2b{flex:1 1 50%;min-width:0;display:flex;align-items:center;justify-content:center;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;cursor:pointer;width:auto!important;height:auto!important}
#app#app .sos2 .sos2l{border-left:2px solid #e5342b88!important;color:#c62828}
#app#app .sos2 .sos2l svg{width:30px;height:30px;padding:5px;box-sizing:content-box;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(198,40,40,.35)}
#app#app .sos2 .sos2s img{width:38px!important;height:38px!important}
#app#app .sos2 .sos2b:active{background:#e5342b22!important}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) #app#app .sosk.sos2{background:repeating-linear-gradient(135deg,#6b2626 0 8px,#7c2f2f 8px 16px)!important}
 :root:not([data-theme=light]) #app#app .sos2 .sos2l svg{background:#2a1515;color:#ff8a80}}
.lpah{display:flex;gap:10px;align-items:center;margin-bottom:8px}.lpai{width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:50%;background:#c62828;color:#fff}.lpai svg{width:24px;height:24px}
.lpaf{display:flex;gap:8px;align-items:stretch}.lpaf input{flex:1;min-width:0;margin:0!important;font-size:16px}.lpaf button{width:52px!important;flex:none;margin:0!important;padding:0!important;display:grid;place-items:center}.lpaf button svg{width:22px;height:22px}
.lpaef{margin-top:12px;border:2px solid #ef6c00;border-radius:10px;padding:10px 12px;background:color-mix(in srgb,#ef6c00 6%,transparent)}
.lpaef h3{margin:4px 0 8px;font-size:16px}.lpasy{font-size:11px;letter-spacing:.6px;text-transform:uppercase;color:var(--mu);margin-top:2px}
.lpap{display:flex;gap:6px;margin:6px 0;line-height:1.35;text-align:justify}.lpap b{flex:none}
.lpaan,.lpapr{margin-top:10px}.lpaan>summary,.lpapr>summary{cursor:pointer;font-weight:600;font-size:13px}.lpasg{font-size:12px;margin:3px 0}`;document.head.appendChild(st);
})();
