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
/* v338: papelera junto a la lupa: borra el texto de la caja y los resultados */
const ICB=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>`;
window.lupaBorra=function(){const i=document.getElementById("lp_t"),r=document.getElementById("lp_res");if(i)i.value="";if(r)r.innerHTML="";LC=[];LT="";if(i)i.focus()};
window.lupaAbre=function(){LC=[];LT="";
 $("#sheetc").innerHTML=`<div class="lpah"><span class="lpai">${IC}</span><div><h3 style="margin:0">BUSCAR ACTUACIÓN MÁS EFICAZ</h3><div class="mu" style="font-size:12px">Cualquier sistema: pasarela, 400 Hz, aire acondicionado, AAP…</div></div></div>
 <form class="lpaf" onsubmit="event.preventDefault();lupaBusca()"><input id="lp_t" type="search" enterkeyhint="search" autocomplete="off" placeholder="Describe la avería o lo que quieres buscar"><button class="pri" type="submit" aria-label="Buscar">${IC}</button><button class="sec lpabo" type="button" aria-label="Borrar el texto" title="Borrar" onclick="lupaBorra()">${ICB}</button></form>
 <div id="lp_res"></div>
 <button class="sec" style="width:100%;margin-top:10px" onclick="closeSheet()">Cerrar</button>`;
 const sh=$("#sheet");sh.classList.add("lpatop");sh.style.display="flex";setTimeout(()=>{const i=document.getElementById("lp_t");if(i)i.focus()},60)};
/* palabras propias de cada sistema (código + nombre de la guía) para inclinar el sistema cuando se nombra */
const pista=(T,G,t)=>{let b=0;const w=new Set([T,...String(G.n||"").split(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9]+/)].map(norm).filter(x=>x.length>=3||x==T.toLowerCase()));
 w.forEach(x=>{if(new RegExp("\\b"+x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\b").test(t))b+=x==T.toLowerCase()?3:1.5});return Math.min(b,4.5)};
/* v426: lupaBusca(texto, posición) también desde la pantalla unificada SOS (sin caja #lp_t); con posición se aplican sus
   planos (504/507/508) y en las posiciones remotas (sin pasarela) no se buscan cajas de la pasarela */
window.lupaBusca=function(txt0,pos0){const inp=document.getElementById("lp_t"),res=document.getElementById("lp_res");if(!res||(!inp&&txt0==null))return;
 const txt=String(txt0!=null?txt0:(inp.value||"")).replace(/\s+/g," ").trim();if(!txt){msg("Escribe lo que quieres buscar");if(inp)inp.focus();return}if(inp&&txt0==null)inp.blur();
 const POS=String(pos0||"").trim().toUpperCase();const REM=typeof REMOTAS!="undefined"&&REMOTAS.has(POS);
 LT=txt;const t=norm(txt);const st=Date.now();const S=[];
 /* 1º relevancia directa del texto con cada caja de cada sistema (sin las prioridades memorizadas, que solo ordenan dentro de un sistema) */
 Object.keys((typeof GUIA!="undefined"&&GUIA.tipos)||{}).forEach(T=>{const G=GUIA.tipos[T];if(!G||!G.s||!G.s.length)return;
  if(REM&&T=="PAS")return;
  const ot={id:"lupa_"+T+"_"+st,pos:POS,tipo:T,equipos:[T],estado:"abierta",desc:txt,def:"",com:"",obs:"",orden:"LUPA",fecha:""};
  let A=null;try{A=anaTerminos(ot)}catch(e){return}const bo=pista(T,G,t);
  /* v341: una caja solo cuenta si coincide en alguna palabra CLAVE (no solo en contexto: cabina, derecha, activado…);
     y si el texto nombra una zona (cabina, pupitre, túnel, armario) la caja que no la cita pierde peso */
  const AK={term:new Map([...A.term].filter(([k,e])=>e.w>=1.5)),pal:A.pal,tags:A.tags};
  const ctx=["cabina","pupitr","tunel","armari"].filter(z=>new RegExp("\\b"+z).test(t));
  const raw=G.s.map((s,si)=>{let r=0;try{const tx=norm(s.t+" "+(s.p||[]).join(" "));
   const k=anaPunt(s.t,AK)*2+Math.min(anaPunt((s.p||[]).join(" "),AK),6)*.5;
   if(k>=1.5||(!AK.term.size&&A.tags.size)){r=anaPunt(s.t,A)*2+Math.min(anaPunt((s.p||[]).join(" "),A),6)*.5;
    ctx.forEach(z=>{if(!new RegExp("\\b"+z).test(norm(s.t)))r*=new RegExp("\\b"+z).test(tx)?.8:.5});
    /* v423: las cajas propias de una posición (PBB 504 / 507 / 508) solo encabezan si el texto nombra esa posición */
    /* v424: las palabras de la descripción que están en el TÍTULO de la caja suman (p. ej. «no rearma», «no traslada») */
    {const VW=/^(para|pero|con|sin|del|las|los|una|que|por|esta|este|pbb|pasarela|fallo|activado|activada)$/;const tt=norm(s.t).split(/[^a-z0-9]+/).filter(w=>w.length>=4);
     const qw=[...new Set(t.split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!VW.test(w)))];r+=qw.reduce((a,w)=>a+(tt.includes(w)?2:tt.some(x=>w.length>=5&&x.startsWith(w.slice(0,6)))?1:0),0);
     /* el síntoma en negativo («no rearma», «no traslada», «no sube»…) igual que en el título pesa más */
     const nt=norm(s.t);(t.match(/\bno [a-z]{4,}/g)||[]).forEach(ng=>{if(nt.includes(ng))r+=4})}
    /* v436: una caja de LÍMITE solo encabeza si el texto habla de límite / tope / final de carrera (no por «ruedas», «giro»…);
       y con «borde» o «banda» manda la caja de los bordes de seguridad */
    {const nt=norm(s.t);if(/^limite/.test(nt)&&!/limite|tope|final(es)? de carrera|\bfc\b|no traslada|no gira/.test(t))r*=.15;
     if(/\b(borde|banda)s?\b/.test(t)&&/^bordes de seguridad/.test(nt))r+=8}
    const pp=(String(s.t).match(/^PBB (\d{3})/)||[])[1];if(pp&&!new RegExp("\\b"+pp+"\\b").test(t))r*=.4}}catch(e){}return{si,r}});
  const mx=Math.max(0,...raw.map(x=>x.r));const nom=bo>=3;S.push({T,G,ot,raw,mx,nom,sc:mx>=1.5?mx+bo:(nom?bo:0)})});
 /* el sistema nombrado en el texto (p. ej. «aire acondicionado», «400 Hz») va por delante */
 S.sort((a,b)=>(b.nom-a.nom)||(b.sc-a.sc));let C=[],an=null;
 const S0=S[0];if(S0&&S0.nom&&S0.mx<1.5){let R=null;try{R=anaOT(S0.ot)}catch(e){}an=R?{R,ot:S0.ot}:null;LC=S0.G.s.map((s,si)=>({T:S0.T,si,s,ot:S0.ot,gen:1}));lupaPinta(0,an);casos(txt);return}
 S.filter((x,ix)=>x.sc>0&&(ix==0||x.sc>=S[0].sc*.7)).slice(0,2).forEach((x,ix)=>{const lim=Math.max(1.5,x.mx*.4);const ok=new Map(x.raw.filter(y=>y.r>=lim).map(y=>[y.si,y.r]));
  let R=null;try{R=anaOT(x.ot)}catch(e){}if(ix==0)an=R?{R,ot:x.ot}:null;
  /* 2º dentro del sistema: el orden del análisis de OT (actuaciones memorizadas primero) entre las cajas relacionadas con el texto */
  /* v341: dentro del sistema manda la relevancia directa del texto; el orden del análisis de OT (memorizadas) suma un 20 % / 10 % */
  const ga=((R&&R.guia)||[]).map(g=>g.si).filter(si=>ok.has(si));
  const ord=[...ok.entries()].map(([si,r])=>[si,r*(ga[0]==si?1.2:ga[1]==si?1.1:1)]).sort((a,b)=>b[1]-a[1]).map(e=>e[0]);
  [...new Set(ord)].slice(0,ix==0?4:2).forEach(si=>C.push({T:x.T,si,s:x.G.s[si],ot:x.ot}))});
 LC=C;
 lupaPinta(0,an);casos(txt)};
const pasos=s=>{const inf=[],acc=[];(s.p||[]).forEach(p=>{const i=typeof gEsInfo=="function"&&gEsInfo(p);(i?inf:acc).push(p)});
 const pr=acc.filter(p=>/^PRIORIDAD/i.test(p)),re=acc.filter(p=>!/^PRIORIDAD/i.test(p));return{acc:[...pr,...re],inf}};
/* ===== v339: croquis de los borneros del sistema con bornas numeradas, cables que llegan y salen, y el cuadro «Medir»
 desplegado en cada borna (escala, punta roja, punta negra y qué debe marcar). Las bornas salen de las rutas cable a cable
 (RUTAS, cableado rev. J) de las señales del análisis y de las bornas que cita la actuación más eficaz. ===== */
let LA=null;
const REFV={"+E-X68:1":"≈24 V","+E-X68:2":"0 V","+P-X92:1":"≈24 V","+P-X92:2":"0 V","+H-X51:1":"≈24 V","+H-X51:30":"0 V","+IT-X51:1":"≈24 V","+IT-X51:2":"0 V","+ET-X51:1":"≈24 V","+ET-X51:2":"0 V","+C-X51:1":"≈24 V","+C-X51:2":"0 V","+C4-X64:1":"≈24 V","+C4-X64:2":"0 V","+IT-X50:1":"≈24 V","+IT-X50:2":"0 V","+CO3-X51:1":"≈24 V"};
const ZN={E:"Armario eléctrico E",P:"Armario del pupitre",CP:"Panel del pupitre",C:"Cabina",C4:"Suelo de cabina",IT:"Túnel interior A",MT:"Túnel medio B",ET:"Túnel exterior C",H:"Columna / grupo de elevación",CO:"Columna / rotonda",CO3:"Columna / rotonda",R:"Rotonda",T:"Tren de rodaje",CBTH:"Armario CBTH (alimentación BT / SAI)",SS:"Escalera de servicio"};
const zn=st=>{if(/CLEMA/.test(st))return "Clema intermedia (ver folio)";if(/^[EP]-A\d/.test(st))return st[0]=="E"?"Módulo PLC · armario eléctrico E":"Módulo PLC · armario del pupitre";if(/-[A-Z]*[SB]\d/.test(st)&&!/-X/.test(st))return ZN[(st.match(/^\+?([A-Z]+)/)||[])[1]]||"campo";const m=String(st).match(/^\+?([A-Z]+\d*)/);if(!m)return "";return ZN[m[1]]||ZN[m[1].replace(/\d+$/,"")]||""};
const WC={RD:"#d32f2f",BU:"#1e5bd8",BK:"#222",BN:"#8d5524",GY:"#8a8a8a",WH:"#cfcfcf",OG:"#ef6c00",VT:"#7b1fa2",YE:"#f2c200",GN:"#2e9e44",GNYE:"repeating-linear-gradient(90deg,#2e9e44 0 6px,#f2c200 6px 12px)",PK:"#e91e63"};
const wcol=t=>{const m=String(t||"").match(/\b(GNYE|RD|BU|BK|BN|GY|WH|OG|VT|YE|GN|PK)\b/);return m?WC[m[1]]:"#9aa0a6"};
const RX=/\+?([A-Z]+\d*(?:\.\d+)?-X\d+(?:\.\d+)?)((?:\s*(?:·\s*)?:\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)*(?:\s*\([^)]*\))?)+)/g;
/* bornas de un texto: [{st,b,lab}] («+E-X62:1 (BN, +24 V) · :3 (BK, señal)», «E-X62:1-2», «+E-X55:18») */
function bornas(txt){const o=[];let m;RX.lastIndex=0;txt=String(txt||"");
 /* v341: clemas intermedias (-CLEMA:1) y bornas de elementos o módulos («+IT-S3(CABDE) borna 11», «P-A6 borna 3.1») */
 let q;const R2=/(-CLEMA\d*):(\d+)/g;while((q=R2.exec(txt)))o.push({st:q[1],b:q[2],lab:""});
 const R3=/\+?([A-Z]+\d*-[A-Z]+\d+(?:\.\d+)?(?:\([A-Z]+\))?) borna ([A-Z0-9.]+)/g;while((q=R3.exec(txt)))o.push({st:(/^[EP]-A\d/.test(q[1])?"":"+")+q[1],b:q[2],lab:"",el:1});
 while((m=RX.exec(txt))){const st="+"+m[1].replace(/^\+/,"");const re=/:(\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?)*)(?:\s*\(([^)]*)\))?/g;let n;
  while((n=re.exec(m[2]))){n[1].split("-").forEach(b=>o.push({st,b,lab:n[2]||""}))}}
 return o}
const corto=s=>{s=String(s||"").replace(/\s*\(.*$/,"").trim();return s.length>34?s.slice(0,33)+"…":s};
const eDe=(lab,e)=>/\+24|24 ?V/.test(lab)?"≈24 V":/0 ?V/.test(lab)?"0 V":/señal|4-20/i.test(lab)?"4-20 mA (señal analógica, variable)":e;
function borneros(c,R,P){const M=new Map(),ord=[];
 const pon=(st,b,o)=>{const k=st+":"+b;if(!M.has(k)){M.set(k,Object.assign({st,b,sig:[]},o));if(!ord.includes(st))ord.push(st)}else{const r=M.get(k);if(o.sig&&o.sig.length)o.sig.forEach(x=>{if(!r.sig.includes(x))r.sig.push(x)});["ll","sa","q","mid"].forEach(z=>{if(!r[z]&&o[z])r[z]=o[z]})}};
 /* v341: solo las señales coherentes con la principal (mismo módulo o casi la misma puntuación) y con la zona nombrada (cabina, pupitre…) */
 const ctx=["cabina","pupitr","tunel","armari"].filter(z=>new RegExp("\\b"+z).test(norm(LT)));
 const r0=R&&R.rel&&R.rel[0];
 const qn=norm(LT),dcha=/\b(derech|dcha|drcha|dch)/.test(qn),izq=/\b(izquierd|izq|izda|izqda)/.test(qn);
 const lado=x=>{const tx=norm(x.S.t);return !(dcha&&!izq&&/izquierd|\bizq/.test(tx))&&!(izq&&!dcha&&/derech|\bdcha/.test(tx))};
 const relOk=r0?R.rel.slice(0,4).filter(lado).slice(0,3).filter((x,ix)=>(ix==0||x.mod==r0.mod||x.sc>=r0.sc*.85)&&ctx.every(z=>new RegExp("\\b"+z).test(norm(x.S.t+" "+x.mod+" "+((x.S.p||[]).map(q=>q.p).join(" "))))||ix==0)):[];
 if(c.T=="PAS")relOk.forEach(x=>{const L=(x.S&&x.S.p)||[];const sg=x.mod+" "+(x.S.led||x.S.id||"")+" · "+x.S.t;
  L.forEach((pt,i)=>{const bs=bornas(pt.nodo||String(pt.p||"").split(" · ")[0]);if(!bs.length)return;
   const cabIn=(pt.cab||[]).map(z=>z.txt).join(" + ")||((String(pt.p||"").match(/(manguera|cable|hilo)[^·]*/i)||[""])[0]);
   const nx=L[i+1],cabOut=nx?(nx.cab||[]).map(z=>z.txt).join(" + "):"";
   bs.forEach(bb=>{const nodo=bs.length==1&&(bb.el||/CLEMA/.test(bb.st))?(pt.nodo||bb.st+":"+bb.b):bb.st+":"+bb.b,e=bs.length>1?eDe(bb.lab,""):pt.e;
    pon(bb.st,bb.b,{sig:[sg],lab:bb.lab,e,x:pt.x,mod:x.mod,
     ll:i>0?{de:corto(L[i-1].nodo||L[i-1].p),c:cabIn}:(cabIn?{de:"",c:cabIn}:null),
     sa:nx?{a:corto(nx.nodo||nx.p),c:cabOut}:null,
     q:Object.assign({},pt,{nodo,p:nodo,e})})})})});
 /* bornas citadas en la actuación más eficaz, con su medida escrita si la tiene */
 (P||[]).forEach(t=>{const md=typeof guiaMidePasos=="function"?guiaMidePasos(t):[];
  md.forEach(z=>bornas(z.t).slice(0,1).forEach(bb=>pon(bb.st,bb.b,{sig:["Actuación más eficaz"],e:z.t.replace(/\s+(en|entre)\s+.*$/,""),mid:z.s})));
  /* sin medida escrita: solo las bornas de referencia conocidas (+24 V / 0 V de cada zona); si no hay dato, no se dibuja ni se inventa */
  bornas(t).forEach(bb=>{const k=bb.st+":"+bb.b;if(M.has(k))return;let e=eDe(bb.lab,"");
   if(!e)e=REFV[k]||"";
   if(e)pon(bb.st,bb.b,{sig:["Actuación más eficaz"],lab:bb.lab,e})})});
 if(!M.size)return "";
 const nat=(a,b)=>String(a).localeCompare(String(b),"es",{numeric:true});
 const wire=(c2)=>`<i class="lbw" style="background:${wcol(c2)}"></i>`;
 const h=ord.slice(0,6).map(st=>{const rows=[...M.values()].filter(r=>r.st==st).sort((a,b)=>nat(a.b,b.b));
  const cro=rows.map((r,ri)=>`<div class="lbr${ri?"":" lbr0"}"><div class="lbl">${r.ll?`<b>${E(r.ll.de||"llega")}</b><small>${E(r.ll.c||"")}</small>`:`<small class="mu">—</small>`}</div>${wire(r.ll&&r.ll.c)}<div class="lbt"><span>${E(r.b)}</span></div>${wire(r.sa&&r.sa.c)}<div class="lbs">${r.sa?`<b>${E(r.sa.a)}</b><small>${E(r.sa.c||"")}</small>`:`<small class="mu">—</small>`}</div></div>`).join("");
  const med=rows.map(r=>{if(!r.e&&!r.mid)return "";let ps=/^0 ?V/.test(r.e||"")?null:(r.mid||null);if(!ps){try{ps=insMidePasos(r.q||{nodo:r.st+":"+r.b,p:r.st+":"+r.b,e:r.e||"≈24 V"},r.mod)}catch(e){ps=null}}
   if(!ps||!ps.length)return "";
   return `<details class="lbm" open><summary><span class="imt">Medir</span> <b>${E(r.st+":"+r.b)}</b>${r.e?` → <span class="lbv">${E(r.e)}</span>`:""}</summary><ol>${ps.map(y=>"<li>"+y+"</li>").join("")}</ol>${r.sig.length?`<div class="lbsg">${E(r.sig.join(" · "))}</div>`:""}</details>`}).join("");
  return `<div class="lbx"><div class="lbxh">${/-X|CLEMA/.test(st)?"Bornero":/-A\d/.test(st)?"Módulo":"Elemento"} <b>${E(st)}</b>${zn(st)?` · ${E(zn(st))}`:""}</div><div class="lbcols"><span>Llega desde</span><span>Borna</span><span>Sale a</span></div>${cro}<div class="lbmed">${med}</div></div>`}).join("");
 return `<div class="lbwrap"><div class="anal" style="margin-top:12px">🔌 Borneros del sistema · croquis y medidas</div>${h}</div>`}
window.lupaPinta=function(k,an){if(an)LA=an;const res=document.getElementById("lp_res");if(!res)return;
 const ana=an&&an.R?`<details class="lpaan"><summary>🎯 Análisis del texto${an.R.mods&&an.R.mods.length?` · ${an.R.mods.length} módulo(s)`:""}${an.R.elem&&an.R.elem.length?` · ${an.R.elem.length} elemento(s)`:""}</summary>
  ${an.R.pal&&an.R.pal.length?`<div class="anal">Palabras analizadas</div><div class="anaw">${an.R.pal.map(p=>`<span class="anac${p.w!=p.w0?" anafix":""}">${E(p.w!=p.w0?p.w0+" → "+p.w:p.w)}</span>`).join("")}</div>`:""}
  ${an.R.mods&&an.R.mods.length?`<div class="anal">Módulos PLC implicados</div><div class="anaw">${an.R.mods.map(m=>`<span class="anae">${E(m)}</span>`).join("")}</div>`:""}
  ${an.R.elem&&an.R.elem.length?`<div class="anal">Elementos de campo a revisar</div><div class="anaw">${an.R.elem.map(m=>`<span class="anae">${E(m)}</span>`).join("")}</div>`:""}
  ${an.R.rel&&an.R.rel.length?`<div class="anal">Señales implicadas (de más a menos probable)</div>${an.R.rel.slice(0,6).map((x,ix)=>`<div class="lpasg"><b>${ix+1}.</b> ${E(x.mod)} · Mód. ${E(x.S.k||"-")} · LED ${E(x.S.l||"-")} — ${E(x.S.t)}</div>`).join("")}`:""}</details>`:"";
 if(!LC.length){res.innerHTML=`<div class="gav" style="margin-top:10px">No se ha relacionado ninguna actuación con «${E(LT)}». Detalla el elemento, el síntoma o la alarma (p. ej. «no sube», «límite extensión», «400 Hz no recoge manguera»).</div>${ana}<div id="lp_cas"></div>`;return}
 const c=LC[k]||LC[0],G=GUIA.tipos[c.T];
 /* v423: cajas con varios elementos (p. ej. medidas analógicas): solo los pasos del elemento que nombra la descripción o el desplegable */
 window.__lupaK=LC[k]?k:0;let SB=null;try{SB=typeof lupaSub=="function"?lupaSub(c.s,LT):null}catch(e){SB=null}
 const P=pasos(SB?SB.s:c.s);const RB=LA&&LA.R&&SB&&SB.rel?Object.assign({},LA.R,{rel:(LA.R.rel||[]).filter(SB.rel)}):(LA&&LA.R);
 if(c.gen&&an){res.innerHTML=`<div class="gav" style="margin-top:10px">En la guía de <b>${E(G.n||c.T)}</b> no hay una actuación que cite «${E(LT)}». Elige la caja del sistema que corresponda al síntoma:</div><div class="anass" style="margin-top:8px">${LC.map((x,ix)=>`<button class="anag" onclick="LUPA_GEN(${ix})">📋 ${E(x.s.t)}</button>`).join("")}</div>${ana}<div id="lp_cas"></div>`;return}
 let prim="";if(c.T=="PAS"&&!window.__lupaEnSOS){try{const S=typeof segOT=="function"?segOT(c.ot):null,Pu=typeof puentesOT=="function"?puentesOT(c.ot):[];
  const h=(S?segHTML(c.ot,S):"")+(Pu&&Pu.length?puenteHTML(c.ot,Pu):"");if(h)prim=`<details class="lpapr"><summary>⚠️ Primera actuación en campo (seguridad)</summary><div class="card pucard">${h}</div></details>`}catch(e){}}
 const alt=LC.map((x,ix)=>ix==k?"":`<button class="anag" onclick="lupaPinta(${ix},null)">📋 ${E(GUIA.tipos[x.T].n||x.T)} · ${E(x.s.t)}</button>`).join("");
 const vg=(typeof tecnico!="undefined"&&tecnico)||(typeof admin!="undefined"&&admin);
 res.innerHTML=`<div class="lpaef"><span class="gefb">⭐ Actuación más eficaz</span><div class="lpasy">${E(G.n||c.T)}</div><h3>${E(c.s.t)}</h3>${SB?SB.sel:""}
  ${P.acc.map((p,ix)=>{let cx="";try{const C=window.croquisPaso&&!(SB&&SB.gen.has(p))&&croquisPaso(p,"");if(C)cx=`<details class="elusd cxd"${C.n?" open":""}><summary>🔌 Croquis entre borneros${C.n?` · ${C.n} conexión${C.n>1?"es":""} borna a borna`:" · recorrido"}</summary><div class="cxin">${C.html}</div></details>`}catch(e){}
   return `<div class="lpap"><b>${ix+1}.</b><span>${E(p)}${cx}</span></div>`}).join("")}
  ${P.inf.length?`<details class="gelem"><summary>Elementos y referencias (${P.inf.length})</summary>${P.inf.map(p=>`<div class="gelit"><span>${E(typeof gInfoTxt=="function"?gInfoTxt(p):p)}</span></div>`).join("")}</details>`:""}
  ${vg?`<button class="sec" style="width:100%;margin-top:8px" onclick="lupaGuia('${c.T}',${c.si})">Abrir en la guía de campo</button>`:""}</div>
  ${(()=>{try{return borneros(c,RB,P.acc.concat(P.inf))}catch(e){return ""}})()}${prim}${alt?`<div class="anal" style="margin-top:10px">Otras actuaciones relacionadas</div><div class="anass">${alt}</div>`:""}${an?ana:(document.querySelector("#lp_res .lpaan")||{}).outerHTML||""}<div id="lp_cas">${(document.getElementById("lp_cas")||{}).innerHTML||""}</div>`;
 if(window.__lupaEnSOS){}else if(an!==undefined&&an!==null)res.scrollIntoView({block:"start",behavior:"smooth"});else{const e=res.querySelector(".lpaef");if(e)e.scrollIntoView({block:"start",behavior:"smooth"})}};
async function casos(txt){if(typeof casosParecidos!="function")return;let l=[];try{l=await casosParecidos(txt)}catch(e){}
 const c=document.getElementById("lp_cas");if(!c||txt!==LT)return;c.innerHTML=l.length&&typeof casosHTML=="function"?`<div style="margin-top:10px">${casosHTML(l,"")}</div>`:""}
window.LUPA_GEN=function(ix){LC=LC.map((x,i)=>Object.assign({},x,{gen:0}));const c=LC.splice(ix,1)[0];LC.unshift(c);lupaPinta(0,null)};
/* v337: también la hoja del SOS (#sr_p) */
/* v336: la hoja de la lupa sale arriba (abajo la tapaba el teclado); al cerrarla o abrir otra hoja vuelve abajo */
(function(){const o=closeSheet;closeSheet=function(){const sh=document.getElementById("sheet");if(sh)sh.classList.remove("lpatop");return o.apply(this,arguments)};window.closeSheet=closeSheet;
 const c=document.getElementById("sheetc");if(c)new MutationObserver(()=>{const sh=document.getElementById("sheet");if(sh)sh.classList.toggle("lpatop",!!c.querySelector(".lpaf,#sr_p"))}).observe(c,{childList:true})})();
window.lupaGuia=function(T,si){closeSheet();gTipo=T;try{gAbierto.add(T+si)}catch(e){}go("tec");
 setTimeout(()=>{const d=document.querySelector(`details.gd[data-k="${T+si}"]`);if(d){d.open=true;d.scrollIntoView({block:"start",behavior:"smooth"})}},120)};
const st=document.createElement("style");st.textContent=`
#sheet.lpatop{align-items:flex-start!important}
#sheet.lpatop>div{border-radius:0 0 12px 12px!important;border-top:0!important;border-bottom:2px solid var(--ac,#ef6c00)!important;max-height:92dvh!important;padding-top:calc(14px + env(safe-area-inset-top,0px))!important;padding-bottom:14px!important}
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
.lpaf{display:flex;gap:8px;align-items:stretch}.lpaf input{flex:1;min-width:0;margin:0!important;font-size:16px}.lpaf button{width:52px!important;flex:none;margin:0!important;padding:0!important;display:grid;place-items:center}.lpaf button svg{width:22px;height:22px}#sheet#sheet .lpaf .lpabo{color:#c62828!important;border:1px solid #c6282866!important}
.lpaef{margin-top:12px;border:2px solid #ef6c00;border-radius:10px;padding:10px 12px;background:color-mix(in srgb,#ef6c00 6%,transparent)}
.lpaef h3{margin:4px 0 8px;font-size:16px}.lpasy{font-size:11px;letter-spacing:.6px;text-transform:uppercase;color:var(--mu);margin-top:2px}
.lpap{display:flex;gap:6px;margin:6px 0;line-height:1.35;text-align:left}.lpap b{flex:none}
.lpaan,.lpapr{margin-top:10px}.lpaan>summary,.lpapr>summary{cursor:pointer;font-weight:600;font-size:13px}.lpasg{font-size:12px;margin:3px 0}
.lbx{margin-top:8px;border:1px solid var(--bd,#d9d2e3);border-radius:10px;padding:8px;background:var(--card)}
.lbxh{font-size:13px;margin-bottom:6px}.lbcols{display:grid;grid-template-columns:1fr 54px 1fr;font-size:9.5px;letter-spacing:.5px;text-transform:uppercase;color:var(--mu);text-align:center;margin-bottom:2px}
.lbr{display:grid;grid-template-columns:1fr 12px 30px 12px 1fr;align-items:center;min-height:42px}
.lbl,.lbs{font-size:11px;line-height:1.2;min-width:0;overflow-wrap:anywhere}.lbl{text-align:right}.lbl b,.lbs b{display:block;font-weight:600}.lbl small,.lbs small{display:block;color:var(--mu);font-size:10px}
.lbw{display:block;height:3px;border-radius:2px}
.lbt{align-self:stretch;display:grid;place-items:center;background:linear-gradient(90deg,#9aa3ad,#d5dbe1 45%,#aab2bb);border-left:1px solid #6d7680;border-right:1px solid #6d7680;border-bottom:1px solid #6d7680;position:relative}
.lbr0 .lbt{border-top:1px solid #6d7680;border-radius:4px 4px 0 0}.lbt span{font:700 12px/1 ui-monospace,Menlo,monospace;color:#111;background:#fff;border:1px solid #6d7680;border-radius:3px;padding:2px 3px;min-width:14px;text-align:center}
.lbmed{margin-top:8px;display:flex;flex-direction:column;gap:6px}
.lbm{padding:5px 7px;border-left:3px solid #f0a020;border-radius:0 6px 6px 0;background:color-mix(in srgb,#f0a020 12%,transparent);font-size:12.5px;line-height:1.35}
.lbm summary{cursor:pointer}.lbm .imt{font-weight:800;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#f0a020}.lbv{font-weight:700}
.lbm ol{margin:4px 0 0;padding-left:16px}.lbm li::marker{color:#f0a020;font-weight:700}.lbsg{font-size:10.5px;color:var(--mu);margin-top:3px}`;document.head.appendChild(st);
})();
