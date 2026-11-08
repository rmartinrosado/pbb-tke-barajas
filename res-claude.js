/* ===== v344: zona «Resolución Claude» en la ficha de la OT =====
   La respuesta de Claude (proyecto PBB TKE) a la Resolución IA se guarda en la OT (campo datos.resClaude
   de la tabla incidencias: {txt, ts, por}) y se muestra en la ficha con formato técnico: apartados,
   pasos numerados, tablas y notas. Claude la escribe directamente en Supabase; en la Resolución IA
   también se puede pegar a mano la respuesta copiada de Claude. */
(function(){
 const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const inl=s=>E(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`([^`]+)`/g,'<code class="rcC">$1</code>').replace(/(^|[\s(])_([^_]+)_(?=[\s).,;:]|$)/g,"$1<i>$2</i>");
 /* Markdown sencillo → HTML (##, ###, 1., -, tablas |, ---, párrafos) */
 /* v368: comentarios del técnico a los «Datos que faltan» (se guardan en el móvil por OT) y AJUSTAR RESOLUCIÓN */
 const DFI={};let DF={};try{DF=JSON.parse(localStorage.getItem("rc_df")||"{}")}catch(e){}
 const dfGet=(id,k)=>(DF[id]&&DF[id][k])||"";
 window.rcDfSet=(id,k,v)=>{(DF[id]=DF[id]||{})[k]=v;try{localStorage.setItem("rc_df",JSON.stringify(DF))}catch(e){}};
 window.rcAjPre=()=>{rcAjEnCurso=true;setTimeout(()=>{if(!(JOB&&!JOB.fin&&!JOB.err)){rcAjEnCurso=false;const a=document.activeElement;if(!(a&&a.classList&&a.classList.contains("rcDf")))plegar(false)}},1500)};
 window.rcAjusta=async id=>{const i=inc.find(x=>x.id==id);if(!i||!i.resClaude)return;const it=DFI[id]||[],c=DF[id]||{};
  const pares=it.map((t,k)=>[t,(c[k]||"").trim()]).filter(x=>x[1]);
  if(!pares.length){msg("Escribe al menos un comentario en «Datos que faltan»");return}
  if(JOB&&!JOB.fin&&!JOB.err){msg("Ya hay una consulta a Claude en marcha");return}
  const pr=`Posición PBB ${i.pos} · tipo ${i.tipo||"PAS"} · OT (nº de orden CGA) ${i.orden||""}.
Descripción del aviso: ${i.desc||i.def||""}${i.com?"\nComentario: "+i.com:""}

Esta es la RESOLUCIÓN ANTERIOR que diste para esta avería:
<<<
${i.resClaude.txt}
>>>

El técnico ha comprobado en campo los «Datos que faltan» y aporta:
${pares.map(([t,v])=>"- "+t+"\n  → Observado en campo: "+v).join("\n")}

AJUSTA LA RESOLUCIÓN con estos datos: descarta lo que ya queda comprobado, concreta la causa más probable, la primera actuación y la reparación, y actualiza las medidas. Mantén el mismo formato (empieza por «Primera actuación en campo») y deja en «Datos que faltan» solo lo que siga sin confirmar.`;
  const ant=i.resClaude.ts;rcAjEnCurso=true;plegar(true);setTimeout(()=>{try{render()}catch(e){}},60);
  try{await rcConsulta(id,pr)}finally{rcAjEnCurso=false;plegar(false)}
  const o=inc.find(x=>x.id==id);if(o&&o.resClaude&&o.resClaude.ts!=ant){delete DF[id];try{localStorage.setItem("rc_df",JSON.stringify(DF))}catch(e){}o.resClaude.ajustada=(o.resClaude.ajustada||0)+1;sv("pbb_inc",inc);render()}};
 /* mientras se escribe en un comentario no se repinta la ficha (no se pierde el teclado); se repinta al salir del campo */
 let rcPend=false;const orR=render;render=function(){const a=document.activeElement;if(a&&a.classList&&a.classList.contains("rcDf")){rcPend=true;return}return orR.apply(this,arguments)};
 document.addEventListener("focusout",e=>{if(e.target&&e.target.classList&&e.target.classList.contains("rcDf")&&rcPend){rcPend=false;setTimeout(()=>{const a=document.activeElement;if(!(a&&a.classList&&a.classList.contains("rcDf")))render()},150)}});

 /* v369: al escribir en «Datos que faltan» se pliega el Panel de control (el teclado no tapa la resolución);
    se vuelve a desplegar al salir del campo o, si se pulsa AJUSTAR RESOLUCIÓN, al terminar la consulta */
 let rcAjEnCurso=false;
 /* la caja de fichas (#otsc, fija bajo el panel) pasa a empezar justo bajo la cabecera, y el campo se coloca arriba (encima del teclado) */
 const cabBot=()=>{const h=document.querySelector("header");return h?Math.max(0,Math.round(h.getBoundingClientRect().bottom)):0};
 const plegar=on=>{if(on){const R=document.documentElement.style;R.setProperty("--rcTop",cabBot()+"px");const f=document.getElementById("pfix");if(f&&!document.body.classList.contains("rcEscribe")){const r=f.getBoundingClientRect();if(r.width>0){R.setProperty("--rcL",Math.round(r.left)+"px");R.setProperty("--rcW",Math.round(r.width)+"px")}}}document.body.classList.toggle("rcEscribe",!!on)};
 const coloca=(t,suave)=>{try{const w=document.getElementById("otsc");if(!w||!t)return;const vv=window.visualViewport;const tope=Math.max(cabBot(),vv?Math.round(vv.offsetTop):0)+56;
  const d=t.getBoundingClientRect().top-tope;if(Math.abs(d)>4)w.scrollTo({top:w.scrollTop+d,behavior:suave===false?"auto":"smooth"})}catch(e){}};
 /* v371: con el teclado del iPhone la caja de fichas no encoge (llega hasta abajo de la pantalla): se le da hueco extra abajo
    para poder subir los últimos campos por encima del teclado, y se recoloca cuando el teclado termina de salir */
 try{window.visualViewport&&visualViewport.addEventListener("resize",()=>{const a=document.activeElement;if(a&&a.classList&&a.classList.contains("rcDf"))coloca(a,false)})}catch(e){}
 document.addEventListener("focusin",e=>{const t=e.target;if(t&&t.classList&&t.classList.contains("rcDf")){plegar(true);requestAnimationFrame(()=>coloca(t,false));[350,700,1100].forEach(ms=>setTimeout(()=>{if(document.activeElement===t)coloca(t)},ms))}});
 document.addEventListener("focusout",e=>{const t=e.target;if(!(t&&t.classList&&t.classList.contains("rcDf")))return;setTimeout(()=>{const a=document.activeElement;if(a&&a.classList&&a.classList.contains("rcDf"))return;if(!rcAjEnCurso)plegar(false)},200)});
 function md(t,id){
  const L=String(t||"").replace(/\r/g,"").split("\n");let h="",i=0,df=false,dk=0;const items=[];
  const caja=x=>{if(!df||!id)return"";const k=dk++;items.push(x.replace(/\*\*/g,"").replace(/`/g,""));return `<input class="rcDf" autocomplete="off" autocorrect="on" name="rcdf${k}" placeholder="Comentario / dato comprobado en campo" value="${E(dfGet(id,k))}" oninput="rcDfSet('${id}',${k},this.value)" onclick="event.stopPropagation()">`};
  const boton=()=>df&&id?`<div class="rcAj"><button class="rcAjB" onpointerdown="rcAjPre()" onclick="event.stopPropagation();rcAjusta('${id}')">AJUSTAR RESOLUCIÓN</button>${JOB&&JOB.id==id&&(!JOB.fin||Date.now()-JOB.fin<60000)?'<div id="rc_prog"></div>':""}</div>`:"";
  while(i<L.length){let l=L[i];const s=l.trim();
   if(!s){i++;continue}
   if(/^-{3,}$|^\*{3,}$/.test(s)){h+='<hr class="rcHr">';i++;continue}
   let m;
   if(m=s.match(/^(#{1,3})\s+(.*)$/)){const n=m[1].length,pr=/primera actuaci/i.test(m[2]);
    h+=boton();df=/datos\s+que\s+faltan|datos\s+pendientes|faltan\s+datos/i.test(m[2]);
    h+=`<div class="rcH${n} ${pr?"rcPri":""}">${pr?"⚡ ":""}${inl(m[2])}</div>`;i++;continue}
   if(/^\|/.test(s)){const rows=[];while(i<L.length&&/^\|/.test(L[i].trim())){rows.push(L[i].trim());i++}
    const cel=r=>r.replace(/^\||\|$/g,"").split("|").map(x=>x.trim());
    const body=rows.filter(r=>!/^\|?\s*:?-{2,}/.test(r.replace(/\|/g,"|").replace(/^\|/,"")));
    h+='<div class="rcTw"><table class="rcT">'+body.map((r,k)=>"<tr>"+cel(r).map(c=>k?`<td>${inl(c)}</td>`:`<th>${inl(c)}</th>`).join("")+"</tr>").join("")+"</table></div>";continue}
   if(/^\d+[.)]\s+/.test(s)){let o='<ol class="rcOl">';
    while(i<L.length&&(/^\d+[.)]\s+/.test(L[i].trim())||(/^\s{2,}\S/.test(L[i])&&!/^\s*$/.test(L[i])))){const x=L[i].trim();
     if(/^\d+[.)]\s+/.test(x)){const tx=x.replace(/^\d+[.)]\s+/,"");o+=`<li>${inl(tx)}${caja(tx)}</li>`}else o=o.replace(/<\/li>$/,"<br>"+inl(x.replace(/^[-*]\s+/,"· "))+"</li>");i++}
    h+=o+"</ol>";continue}
   if(/^[-*•]\s+/.test(s)){let u='<ul class="rcUl">';while(i<L.length&&/^\s*[-*•]\s+/.test(L[i])){const tx=L[i].trim().replace(/^[-*•]\s+/,"");u+=`<li>${inl(tx)}${caja(tx)}</li>`;i++}h+=u+"</ul>";continue}
   let p=[];while(i<L.length&&L[i].trim()&&!/^(#{1,3}\s|\||\d+[.)]\s|[-*•]\s|-{3,}$)/.test(L[i].trim())){p.push(L[i].trim());i++}
   const tx=p.join(" ");h+=/^planos?:/i.test(tx.replace(/\*/g,""))?`<div class="rcPl">📐 ${inl(tx)}</div>`:`<p class="rcP">${inl(tx)}${caja(tx)}</p>`}
  h+=boton();if(id)DFI[id]=items;
  return h}
 window.rcMd=md;
 const ab=new Set();
 window.rcTog=(id,o)=>{o?ab.add(id):ab.delete(id)};
 const fch=ts=>{try{const d=new Date(ts);return d.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})+" "+d.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}catch(e){return""}};
 function bloque(i){const r=i.resClaude;if(!r||!(r.txt||"").trim())return"";
  const ed=(typeof tecnico!="undefined"&&tecnico)||(typeof admin!="undefined"&&admin);
  return `<details class="rcBox" ${ab.has(i.id)?"open":""} ontoggle="rcTog('${i.id}',this.open)" onclick="event.stopPropagation()">
  <summary class="rcSum"><img src="claude-logo.png" alt=""><span class="rcSt"><b>Resolución Claude AI</b><small>PBB ${E(i.pos)} · ${E(i.tipo)} · OT ${E(i.orden)}${r.ts?" · "+fch(r.ts):""}${/Gemini/i.test(r.por||"")?" · generada por Gemini (reserva)":""}</small></span><button class="rcPdf" title="PDF A4 de la resolución" aria-label="PDF A4 de la resolución" onclick="event.preventDefault();event.stopPropagation();rcPdf('${i.id}')">PDF</button><span class="rcChev">▾</span></summary>
  <div class="rcBody">${md(r.txt,i.id)}
  <div class="rcFoot"><span>Análisis IA cotejado con la documentación del proyecto PBB TKE. Verificar en campo.</span>${ed?`<button class="sec rcDel" title="Borrar resolución Claude" aria-label="Borrar resolución Claude" onclick="event.stopPropagation();rcBorra('${i.id}')">🗑</button>`:""}</div></div></details>`}
 window.rcBorra=id=>{const i=inc.find(x=>x.id==id);if(!i||!i.resClaude)return;if(!confirm(`¿Borrar la resolución Claude de la OT ${i.orden}?`))return;delete i.resClaude;window.rcBorrar&&rcBorrar.add(i.id);sv("pbb_inc",inc);render();msg("Resolución Claude borrada")};
 /* Ficha de OT: la zona va antes de la fila de botones */
 const oc=card;card=function(i){const h=oc.apply(this,arguments);const b=i&&bloque(i);if(!b)return h;
  const k=h.lastIndexOf('<div class="cacts">');return k>=0?h.slice(0,k)+b+h.slice(k):h.replace(/<\/div>\s*$/,b+"</div>")};
 /* Resolución IA (v353): sin «Actuación guiada», sin «Pegar desde el portapapeles» y sin la caja para pegar la respuesta
    (la respuesta llega sola con la consulta en segundo plano). El campo t_gui queda oculto: conserva la actuación guiada de la OT para la consulta. */
 const orT=resTec;resTec=function(sel){const r=orT.apply(this,arguments);try{
  const g=$("#t_gui");if(g){g.style.display="none";const lb=g.previousElementSibling;if(lb&&lb.tagName=="LABEL")lb.style.display="none"}
  document.querySelectorAll('#sheetc button[onclick^="pegaGui"]').forEach(b=>b.style.display="none");document.querySelectorAll("#sheetc .gprint,#sheetc .rcEd").forEach(b=>b.style.display="none") /* v354: solo queda el botón Claude */;
  /* v355: botón Claude con el logotipo «Claude» (estrella + palabra) */
  const cb=document.querySelector('#sheetc button[aria-label="Instrucciones IA"]');if(cb&&!cb.dataset.v355){cb.dataset.v355="1";cb.classList.add("rcBtn");cb.innerHTML='<span class="rcBtnW"><img src="claude-wordmark-ia.png" alt="Claude"></span>'}}catch(e){}return r};
 window.rcPega=async()=>{try{const t=await navigator.clipboard.readText();if(t)$("#rc_txt").value=t;else msg("Portapapeles vacío")}catch(e){msg("No se pudo leer el portapapeles: pega con pulsación larga")}};
 window.rcGuarda=()=>{const s=$("#t_sel"),t=$("#rc_txt");if(!s||!t)return;const i=inc.find(x=>x.id==s.value);if(!i)return;const v=t.value.trim();
  if(v)i.resClaude={txt:v,ts:Date.now(),por:(typeof tecNombre!="undefined"&&tecNombre)||"Claude"};else{delete i.resClaude;window.rcBorrar&&rcBorrar.add(i.id)}
  ab.add(i.id);sv("pbb_inc",inc);msg(v?"Resolución Claude guardada en la OT "+i.orden:"Resolución Claude borrada");closeSheet();render()};

 /* ===== v348: botón WhatsApp abajo a la izquierda de la ficha (misma línea que la inspección cable a cable):
    abre WhatsApp con la «Primera actuación en campo» de la Resolución Claude AI ya escrita en el mensaje ===== */
 function primeraAct(i){const t=String((i.resClaude&&i.resClaude.txt)||"").replace(/\r/g,"");const L=t.split("\n");
  let k=L.findIndex(l=>/^#{1,3}\s.*primera actuaci/i.test(l.trim()));let out=[];
  if(k>=0){for(let j=k+1;j<L.length;j++){if(/^#{1,3}\s/.test(L[j].trim()))break;out.push(L[j])}}else out=L;
  return out.join("\n").replace(/\*\*(.+?)\*\*/g,"*$1*").replace(/`([^`]+)`/g,"$1").replace(/\n{3,}/g,"\n\n").trim()}
 window.rcWA=id=>{const i=inc.find(x=>x.id==id);if(!i||!i.resClaude)return;
  const tx=`*PBB ${i.pos} · ${i.tipo} · OT ${i.orden}*${i.desc?"\n"+i.desc:""}\n\n*Primera actuación en campo (Claude AI)*\n${primeraAct(i)}`;
  try{navigator.clipboard&&navigator.clipboard.writeText(tx).catch(()=>{})}catch(e){}
  const u="https://wa.me/?text="+encodeURIComponent(tx);const w=window.open(u,"_blank");if(!w)location.href=u};
 const WAI=`<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.7-.3z"/></svg>`;
 const ow=card;card=function(i){const h=ow.apply(this,arguments);if(!i||!i.resClaude||!(i.resClaude.txt||"").trim())return h;
  const b=`<button class="sec gwr gwa" title="Enviar primera actuación por WhatsApp" aria-label="Enviar primera actuación por WhatsApp" onclick="event.stopPropagation();rcWA('${i.id}')">${WAI}</button>`;
  const k=h.indexOf('<div class="cacts">');return k>=0?h.slice(0,k+19)+b+h.slice(k+19):h};

 /* v349: el botón WhatsApp va en la columna de Editar / papelera, debajo de la papelera */
 function mueveWA(){document.querySelectorAll("#app .card .gwa").forEach(b=>{if(b.closest(".otcol"))return;const c=b.closest(".card");const col=c&&c.querySelector(".otcol");if(!col)return;
  const ca=b.closest(".cacts");col.appendChild(b);if(ca&&!ca.querySelector("button"))ca.remove()})}
 const orw=render;render=function(){const r=orw.apply(this,arguments);try{mueveWA()}catch(e){}return r};
 new MutationObserver(()=>{try{mueveWA()}catch(e){}}).observe(document.body,{childList:true,subtree:true});

 /* ===== v352: botón Claude de la Resolución IA → consulta en SEGUNDO PLANO (función consulta-sos, la misma del SOS):
    no abre Claude.ai; barra de progreso debajo del icono de Claude; al terminar se cierra la pantalla y la respuesta
    aparece en la ficha de la OT, en «Resolución Claude AI», desplegada en la «Primera actuación en campo». ===== */
 let JOB=null;const J_viejo=()=>!!JOB&&!!JOB.fin&&Date.now()-JOB.fin>60000&&!document.getElementById("rc_prog"); /* v362: un error o resultado de hace más de 1 min no se vuelve a enseñar al abrir la hoja */
 const pbar=()=>{const c=document.getElementById("rc_prog");if(!c||!JOB)return;const j=JOB,pc=Math.round(j.pct||0),sg=Math.round(((j.fin||Date.now())-j.ini)/1000);
  c.innerHTML=`<div class="rcPg${j.err?" err":""}"><div class="rcPgB"><i style="width:${j.err?100:pc}%"></i></div>
  <div class="rcPgM"><span>${E(j.err?"No se ha podido completar la consulta":j.fase||"")}</span><b>${j.err?"":pc+"% · "}${sg} s</b></div>
  ${j.err?`<div class="rcPgE">${E(j.err)}</div><div class="grid" style="margin-top:6px"><button class="sec" onclick="rcReintenta()">Reintentar</button><button class="sec" onclick="rcEnClaude()">Abrir en Claude.ai</button></div>`
  :`${j.vista?`<div class="rcPgV">${E(j.vista)}</div>`:""}<button class="sec" style="width:100%;margin-top:6px" onclick="rcCancela()">Cancelar</button>`}</div>`};
 const ponBarra=()=>{if(!JOB)return;if(J_viejo())return;const s=$("#t_sel");if(!s||s.value!=JOB.id)return;if(!document.getElementById("rc_prog")){
  const cl=document.querySelector('#sheetc button[aria-label="Instrucciones IA"]');const d=document.createElement("div");d.id="rc_prog";
  cl?cl.insertAdjacentElement("afterend",d):$("#sheetc").appendChild(d)}pbar()};
 window.rcCancela=()=>{if(JOB&&JOB.ac)JOB.ac.abort()};
 window.rcEnClaude=()=>{if(JOB&&JOB.pr)ab0(JOB.pr)};
 window.rcReintenta=()=>{if(JOB&&JOB.pr)rcConsulta(JOB.id,JOB.pr)};
 async function rcConsulta(id,pr){const i=inc.find(x=>x.id==id);if(!i)return;
  if(JOB&&!JOB.fin&&!JOB.err){msg("Ya hay una consulta a Claude en marcha");return}
  const J=JOB={id,pr,ini:Date.now(),pct:1,fase:"Preparando la consulta…",ac:new AbortController()};ponBarra();
  const tic=setInterval(()=>{if(JOB!==J||J.fin||J.err){clearInterval(tic);return}if(J.esperando)J.pct=Math.min(J.pct+.3,24);pbar()},1000);
  const av=(f,p)=>{if(f)J.fase=f;if(p!=null)J.pct=Math.max(J.pct,Math.min(99,p));pbar()};
  let wl=null;try{if(navigator.wakeLock)wl=await navigator.wakeLock.request("screen")}catch(e){}
  try{const X=window.iaCtx||{},tipo=i.tipo||"PAS",busca=[i.desc,i.def,i.com,i.guiada].filter(Boolean).join(" · ");
   av("Reuniendo la guía de campo…",4);
   const g=X.guiaCtx?X.guiaCtx(tipo,busca):"",pa=X.primeraCtx?X.primeraCtx(i.pos,busca):"";
   av("Buscando casos parecidos…",7);const ca=X.casosCtx?await X.casosCtx(busca):"";
   av("Cotejando planos…",9);const pl=X.planosCtx?await X.planosCtx(String(i.pos),tipo,busca,(f,x)=>av(f,9+9*(x||0))):{txt:""};
   if(J.ac.signal.aborted)throw new DOMException("x","AbortError");
   const contexto=[g,pa,ca,pl.txt].filter(Boolean).join("\n\n");
   av("Enviando a Claude ("+Math.round(contexto.length/1024)+" KB de documentación)…",19);
   const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;
   if(!tok)throw new Error("Inicia sesión en la app para consultar a Claude.");
   J.esperando=true;
   let r=null;for(let k=0;;k++){try{r=await fetch(SUPABASE_URL+"/functions/v1/consulta-sos",{method:"POST",signal:J.ac.signal,headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},body:JSON.stringify({pregunta:pr,contexto})});break}
    catch(e){if(e&&e.name=="AbortError"||k>=2)throw (e&&/load failed|failed to fetch|network/i.test(e.message||"")?new Error("Sin conexión con el servidor (corte de red). Comprueba la cobertura y pulsa Reintentar."):e);av(`Corte de red · reintentando (${k+1}/2)…`,19);await new Promise(z=>setTimeout(z,2500))}}
   if(!r.ok){let m="";try{const j=await r.json();m=j.mensaje||j.msg||j.error||""}catch(e){}throw new Error([504,546].includes(r.status)?`El servidor de IA no respondió a tiempo (${r.status}). Pulsa Reintentar.`:`La consulta ha fallado (${r.status}) ${m}`)}
   J.motor=(r.headers.get("x-motor")||"Claude").replace(" - "," · ");J.esperando=false;av((/Gemini/.test(J.motor)?"Gemini":"Claude")+" está redactando la resolución…",25);
   const rd=r.body.getReader(),dec=new TextDecoder();let txt="";
   for(;;){const {done,value}=await rd.read();if(done)break;txt+=dec.decode(value,{stream:true});
    J.pct=Math.max(J.pct,25+70*(1-Math.exp(-txt.length/6000)));J.vista=txt.split("\n").filter(l=>l.trim()).slice(-2).join("\n").replace(/[#*|`]/g,"").slice(-160);J.fase=`Recibiendo respuesta · ${txt.length} caracteres`;pbar()}
   txt=txt.trim();if(txt.length<200)throw new Error("Respuesta vacía o incompleta. Vuelve a intentarlo.");
   const o=inc.find(x=>x.id==id);if(!o)throw new Error("La OT ya no existe");
   o.resClaude={txt,ts:Date.now(),por:J.motor||"Claude"};sv("pbb_inc",inc);
   J.pct=100;J.fin=Date.now();pbar();
   ab.add(id);const s=$("#t_sel");if(s&&s.value==id)closeSheet();render();msg(`Resolución lista en la OT ${o.orden||""}`);
   setTimeout(()=>{try{const b=[...document.querySelectorAll("#app .rcBox")].find(x=>(x.getAttribute("ontoggle")||"").includes("'"+id+"'"));
    if(b){b.open=true;const c=b.closest(".card");if(c&&c.classList.contains("ot"))c.classList.add("oab");b.scrollIntoView({behavior:"smooth",block:"start"})}}catch(e){}},120)}
  catch(e){J.esperando=false;J.fin=Date.now();J.err=e&&e.name=="AbortError"?"Consulta cancelada.":String((e&&e.message)||e);pbar()}
  finally{clearInterval(tic);try{wl&&wl.release()}catch(e){}}}
 window.rcConsulta=rcConsulta;
 const ab0=abreClaude;let bg=null;
 abreClaude=function(pr){if(bg){const id=bg;bg=null;try{localStorage.removeItem("pbb_ret")}catch(e){}rcConsulta(id,pr);return}return ab0.apply(this,arguments)};
 const ogt=window.guardaTec;window.guardaTec=function(){const s=$("#t_sel");bg=s&&s.value||null;try{return ogt.apply(this,arguments)}finally{bg=null}};
 /* v367: cualquier hoja con campos para escribir sale ARRIBA (el teclado no la tapa) y el campo enfocado se centra */
 const CAMPO='input:not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=button]):not([type=submit]),textarea';
 const arriba=()=>{const sh=document.getElementById("sheet"),c=document.getElementById("sheetc");if(sh&&c&&c.querySelector(CAMPO))sh.classList.add("lpatop")};
 new MutationObserver(arriba).observe(document.getElementById("sheetc")||document.body,{childList:true});
 document.addEventListener("focusin",e=>{const t=e.target;if(!t||!t.matches||!t.matches(CAMPO))return;if(t.closest("#sheet"))arriba();
  if(t.closest("#sheet,[role=dialog],.modal,.ov,.ovl")||getComputedStyle(t.closest("div")||t).position=="fixed")setTimeout(()=>{try{t.scrollIntoView({block:"center",behavior:"smooth"})}catch(x){}},320)});
 /* v355: la hoja de Resolución IA sale arriba (abajo la tapa el teclado) */
 new MutationObserver(()=>{const sh=document.getElementById("sheet"),c=document.getElementById("sheetc");if(sh&&c&&c.querySelector("#t_sel"))sh.classList.add("lpatop")}).observe(document.getElementById("sheetc")||document.body,{childList:true});
 const orT2=resTec;resTec=function(){const r=orT2.apply(this,arguments);try{ponBarra()}catch(e){}return r};

 /* ===== v363: botón PDF junto a la caja «Resolución Claude AI»: PDF A4 con toda la resolución, para descargar o imprimir ===== */
 window.rcPdf=async id=>{const i=inc.find(x=>x.id==id);if(!i||!i.resClaude)return;if(typeof window.sosIaPdf!="function"){msg("El generador de PDF no está cargado");return}
  if(document.getElementById("rcPdfOv"))return;
  const P=pdfProg(`PDF A4 · PBB ${i.pos} · OT ${i.orden||""}`);
  try{const r=i.resClaude,fe=new Date(r.ts||Date.now());
   P.fase("Preparando la resolución…",5);
   if((!r.croquis||r.croquis.local)&&window.iaCroquis){P.fase("Dibujando el croquis de conexión (IA)…",10);P.sube(78);
    try{r.croquis=await window.iaCroquis(r.txt,i.pos,i.tipo);sv("pbb_inc",inc)}
    catch(e){console.warn("croquis IA",e);/* v374: sin cupo de IA → croquis de reserva sacado de la propia resolución */
     let c=null;try{c=window.croquisLocal&&window.croquisLocal(r.txt,i.pos,i.tipo)}catch(x){}
     if(c&&c.nodos&&c.nodos.length>=2){r.croquis=c;sv("pbb_inc",inc);P.fase("Croquis automático (sin IA)…",80);P.aviso("CROQUIS AUTOMÁTICO · SIN IA")}else{r.croquis=null;P.aviso("PDF SIN CROQUIS")}}}
   P.fase("Maquetando el PDF A4…",82);
   const S={pos:i.pos,tipo:i.tipo||"PAS",orden:i.orden,md:r.txt,croquis:r.croquis||null,fin:r.ts||Date.now(),motor:r.por||"Claude",cabTit:"RESOLUCION CLAUDE AI",
    obs:[i.desc,i.def&&i.def!=i.desc?i.def:"",i.com?"Comentario: "+i.com:""].filter(Boolean).join(" · ")||"(sin descripción)",obsLbl:"Avería",
    filas:[["Posición",`PBB ${i.pos||"-"} · ${i.tipo||"PAS"}`],["OT",`Orden CGA ${i.orden||"-"}`],["Fecha OT",`${i.fecha||"-"}${i.hIni?" · inicio "+i.hIni:""}${i.hLle?" · llegada "+i.hLle:""}`],
     ["Técnicos",i.integrantes||i.tecnico||(typeof tecNombre!="undefined"&&tecNombre)||"-"],["Resolución",fe.toLocaleDateString("es-ES")+" "+fe.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})],["Motor IA",r.por||"Claude"]]};
   const blob=await window.sosIaPdf(S);P.fase("PDF listo",100);await new Promise(z=>setTimeout(z,P.avisado()?2200:500));P.fin();const d=new Date(r.ts||Date.now()),f2=n=>String(n).padStart(2,"0");
   const nom=`Resolucion_PBB${i.pos}_OT${i.orden||""}_${d.getFullYear()}-${f2(d.getMonth()+1)}-${f2(d.getDate())}.pdf`;
   const f=new File([blob],nom,{type:"application/pdf"});
   if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:nom});return}catch(e){if(e&&e.name=="AbortError")return}}
   const u=URL.createObjectURL(blob);const w=window.open(u,"_blank");if(!w){const a=document.createElement("a");a.href=u;a.download=nom;document.body.appendChild(a);a.click();a.remove()}
   setTimeout(()=>URL.revokeObjectURL(u),120000)}catch(e){P.fin();msg("No se pudo generar el PDF: "+((e&&e.message)||e))}};
 /* v367: ventana con barra de progreso mientras se genera el PDF (arriba de la pantalla) */
 function pdfProg(tit){const ov=document.createElement("div");ov.id="rcPdfOv";
  ov.innerHTML=`<div class="rcPo"><div class="rcPoT"><img src="claude-logo.png" alt=""><b>${E(tit)}</b></div><div class="rcPgB"><i></i></div><div class="rcPgM"><span class="f">Iniciando…</span><b class="p">0%</b></div><div class="rcPoA"></div></div>`;
  document.body.appendChild(ov);const bi=ov.querySelector(".rcPgB>i"),ff=ov.querySelector(".f"),pp=ov.querySelector(".p");let pc=0,obj=0,tm=null;
  const pon=v=>{pc=Math.max(pc,Math.min(100,v));bi.style.width=pc+"%";pp.textContent=Math.round(pc)+"%"};
  return{fase:(t,v)=>{ff.textContent=t;clearInterval(tm);pon(v)},sube:o=>{obj=o;clearInterval(tm);tm=setInterval(()=>pon(pc+(obj-pc)*.06),400)},
   aviso:t=>{const a=ov.querySelector(".rcPoA");a.textContent=t;a.classList.add("on")},avisado:()=>ov.querySelector(".rcPoA").classList.contains("on"),fin:()=>{clearInterval(tm);ov.classList.add("out");setTimeout(()=>ov.remove(),300)}}}
 const st=document.createElement("style");st.textContent=`
.rcBox{margin:10px 0 4px;border:1px solid rgba(217,119,87,.55);border-left:4px solid #d97757;border-radius:12px;background:linear-gradient(180deg,rgba(217,119,87,.10),rgba(217,119,87,.03));overflow:hidden}
.rcSum{display:flex;align-items:center;gap:10px;padding:9px 12px;cursor:pointer;list-style:none}
.rcSum::-webkit-details-marker{display:none}
.rcBox>summary.rcSum::after{content:none!important;display:none!important}
.rcSum img{width:30px;height:30px;flex:0 0 30px;border-radius:7px}
.rcSt{display:flex;flex-direction:column;line-height:1.2;flex:1;min-width:0}
.rcSt b{font-size:15px;letter-spacing:.3px;color:#d97757}
.rcSt small{font-size:11px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rcPdf{flex:none;margin:0!important;padding:6px 10px!important;border-radius:8px!important;border:1.5px solid #c62828!important;background:#fff!important;color:#c62828!important;font-weight:800!important;font-size:12px!important;letter-spacing:.5px;height:auto!important;width:auto!important;line-height:1}
.rcChev{font-size:16px;transition:transform .2s;color:#d97757}
.rcBox[open] .rcChev{transform:rotate(180deg)}
.rcBody{padding:2px 12px 10px;font-size:13.5px;line-height:1.45;text-align:left}
.rcH1,.rcH2{margin:12px 0 6px;padding:5px 9px;font-weight:800;font-size:13.5px;letter-spacing:.4px;text-transform:uppercase;border-radius:6px;background:rgba(127,127,127,.14)}
.rcH3{margin:10px 0 4px;font-weight:700;font-size:13px;color:#d97757}
.rcPri{background:#c62828;color:#fff}
.rcOl{counter-reset:rc;list-style:none;margin:4px 0;padding:0}
.rcOl>li{counter-increment:rc;position:relative;padding:6px 6px 6px 36px;margin:5px 0;border-radius:8px;background:rgba(127,127,127,.08)}
.rcOl>li::before{content:counter(rc);position:absolute;left:7px;top:6px;width:22px;height:22px;border-radius:50%;background:#d97757;color:#fff;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center}
.rcUl{margin:4px 0;padding-left:18px}.rcUl li{margin:3px 0}
.rcP{margin:6px 0}
.rcTw{overflow-x:auto;margin:6px 0}
.rcT{border-collapse:collapse;width:100%;font-size:12.5px}
.rcT th,.rcT td{border:1px solid rgba(127,127,127,.35);padding:5px 6px;vertical-align:top;text-align:left}
.rcT th{background:rgba(217,119,87,.18);font-weight:700}
.rcC{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;padding:0 4px;border-radius:4px;background:rgba(127,127,127,.18);white-space:nowrap}
.rcPl{margin:10px 0 4px;padding:7px 9px;border-radius:8px;border:1px dashed rgba(127,127,127,.5);font-size:12.5px}
.rcHr{border:0;border-top:1px solid rgba(127,127,127,.3);margin:10px 0}
.rcFoot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px;padding-top:7px;border-top:1px solid rgba(127,127,127,.25);font-size:11px;opacity:.85}
.rcDel{padding:4px 10px;margin:0}
.cacts .gwa{order:-1}.gwa{color:#1fa855!important;border-color:#25d366!important}.gwa svg{width:22px!important;height:22px!important}
.rcEd{margin-top:10px}
body.rcEscribe #pfix,body.rcEscribe #pmini{display:none!important}\nbody.rcEscribe #otsc{padding-bottom:75vh!important;top:var(--rcTop,0px)!important;left:var(--rcL,0px)!important;width:var(--rcW,100%)!important}
input.rcDf{display:block;width:100%;margin:5px 0 2px;padding:7px 9px!important;font-size:13.5px!important;border:1.5px dashed #d97757!important;border-radius:8px!important;background:#fff!important;color:#111!important;height:auto!important}
.rcAj{margin:12px 0 4px}.rcAjB{display:block;width:100%;margin:0!important;padding:12px!important;border-radius:10px!important;border:0!important;background:linear-gradient(90deg,#5b2a86,#d97757)!important;color:#fff!important;font-weight:800!important;letter-spacing:.8px;font-size:14px!important}
#rcPdfOv{position:fixed;inset:0;z-index:99990;background:rgba(10,10,20,.45);display:flex;align-items:flex-start;justify-content:center;padding:calc(14px + env(safe-area-inset-top,0px)) 12px 0;transition:opacity .3s}
#rcPdfOv.out{opacity:0}
.rcPo{width:min(560px,100%);background:var(--card,#fff);color:inherit;border:2px solid #d97757;border-radius:14px;padding:12px 14px;box-shadow:0 10px 30px rgba(0,0,0,.35)}
.rcPoT{display:flex;align-items:center;gap:8px;margin-bottom:9px;font-size:14px}.rcPoT img{width:26px;height:26px;border-radius:6px}
.rcPoA{display:none;margin-top:8px;text-align:center;font-weight:800;letter-spacing:1px;font-size:14px;color:#e65100}.rcPoA.on{display:block;animation:rcParp 1s steps(2,start) infinite}@keyframes rcParp{to{visibility:hidden}}
#sheetc button.rcBtn{display:flex!important;align-items:center;justify-content:center;width:100%;padding:12px!important}
.rcBtnW{display:flex;align-items:center;justify-content:center;background:#fff;border-radius:14px;padding:12px 22px;box-shadow:0 2px 8px rgba(0,0,0,.18)}
.rcBtnW img{height:40px;width:auto;display:block}
#rc_prog{margin-top:8px}.rcPg{border:2px solid #d97757;border-radius:12px;padding:9px 10px}
.rcPgB{height:12px;border-radius:6px;background:rgba(127,127,127,.18);overflow:hidden}
.rcPgB>i{display:block;height:100%;width:0;border-radius:6px;background:linear-gradient(90deg,#5b2a86,#d97757);transition:width .4s ease}
.rcPg.err{border-color:#c62828}.rcPg.err .rcPgB>i{background:#c62828}
.rcPgM{display:flex;justify-content:space-between;gap:8px;font-size:12px;margin-top:5px}
.rcPgV{font-size:12px;margin-top:4px;white-space:pre-wrap;max-height:3.4em;overflow:hidden;opacity:.7}.rcPgE{font-size:13px;margin-top:6px;color:#c62828}.rcOk{color:#2e7d32;font-size:12px;margin-left:6px}`;
 document.head.appendChild(st);
 try{render()}catch(e){}
})();
