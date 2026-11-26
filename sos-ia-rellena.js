/* ===== v959: SOS SIN ALARMA ASOCIADA → el análisis IA (Gemini / Claude) RELLENA LA ACTUACIÓN (26/11/2026) =====
   Cuando no hay alarma de la Magelis (ni elegida, ni escrita, ni leída de la foto) y se pasa directamente al punto
   «3 · ANÁLISIS CON IA», además de generar el PDF, al terminar y en segundo plano:
   · «2 · REPARAR»: la ACTUACIÓN MÁS EFICAZ pasa a ser la del análisis IA (primera actuación, diagnóstico paso a paso,
     reparación propuesta y comprobación final). Lo que proponía la guía antes queda debajo, plegado.
   · «COMPONENTE A INTERVENIR»: los elementos que la IA señala (por su código de planos, sin borneros ni módulos del PLC),
     con su ficha del catálogo al tocarlos o el botón para incorporarlos si aún no están.
   · OT de la posición (la de la tarjeta o la abierta más reciente): «Actuación» con la actuación propuesta y los componentes,
     «Observaciones» con los componentes a intervenir (solo si estaban vacías o eran de un análisis anterior) y la llave en verde.
   Nada de lo que el técnico haya escrito a mano se pisa. ===== */
(function(){
"use strict";
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=id=>document.getElementById(id);
const val=id=>(($(id)||{}).value||"").trim();
const limpia=s=>String(s||"").replace(/\*\*|__|`/g,"").replace(/^\s*(\d+[.)]|[-*+•])\s+/,"").replace(/\s+/g," ").trim();
let R=null; /* resultado aplicado en la hoja: {pos, sec, comp, motor, ot} */

/* ---------- ¿hay alarma asociada? ---------- */
function sinAlarma(S){
 if(S&&String(S.al||"").trim())return false;
 const sa=$("sr_a");if(sa&&sa.value)return false;
 const t=val("sr_t");if(t){try{if(typeof rcsListaAl=="function"?rcsListaAl(t).length:true)return false}catch(_){return false}}
 if(window.__sosFotoAl&&String(window.__sosFotoAl).trim())return false;
 return true}

/* ---------- lectura de la respuesta (Markdown) ---------- */
const TIPOS=[["pri",/primera actuaci/i,"1ª actuación en campo"],["diag",/diagn|paso a paso|localiz|medida/i,"Diagnóstico paso a paso"],
 ["rep",/reparaci|soluci|propuest|sustituci|correcci/i,"Reparación propuesta"],["fin",/comprobaci[oó]n final|prueba|verificaci|funcionamiento|puesta en servicio/i,"Comprobación final"]];
function secciones(md){const B=String(md||"").replace(/\r/g,"").split(/\n(?=#{1,3}\s)/);const out={};
 B.forEach(b=>{const L=b.split("\n");const h=/^#{1,3}\s/.test(L[0])?limpia(L.shift().replace(/^#+\s*/,"")):"";
  const t=TIPOS.find(([,re])=>re.test(h));if(!t)return;
  let it=L.filter(l=>/^\s*(\d+[.)]|[-*+•])\s+/.test(l)&&!/^\s{4,}/.test(l)).map(limpia).filter(x=>x.length>3);
  if(!it.length)it=L.map(l=>l.trim()).filter(l=>l&&!/^\||^```|^-{3,}$/.test(l)).map(limpia).filter(x=>x.length>3);
  if(!it.length)return;(out[t[0]]=out[t[0]]||{k:t[0],t:t[2],h,it:[]}).it.push(...it)});
 Object.values(out).forEach(s=>s.it=s.it.slice(0,14));return out}
/* componentes a intervenir: códigos de planos nombrados por la IA, por peso (más en la reparación que en el diagnóstico) */
const COD=/\b[A-Z]{1,3}\d?-[A-Z]{1,3}\d{1,3}(?:\.\d{1,2})?\b/g;
const paso=c=>/-X\d/.test(c)||/^[A-Z]{1,2}-A\d+$/.test(c);
function componentes(md,sec,cro){const W=new Map();const suma=(t,w)=>(String(t||"").toUpperCase().match(COD)||[]).forEach(c=>{if(!paso(c))W.set(c,(W.get(c)||0)+w)});
 suma(md,1);if(sec.rep)suma(sec.rep.it.join(" "),3);if(sec.diag)suma(sec.diag.it.join(" "),1);
 try{(cro&&cro.nodos||[]).forEach(n=>suma(n.id||n.t||n.n||"",1))}catch(_){}
 const L=[...W.entries()].sort((a,b)=>b[1]-a[1]);const top=L.filter(x=>x[1]>=2);return (top.length?top:L).slice(0,6).map(([c])=>c)}
const nombre=c=>{try{const n=typeof nombreElemento=="function"&&nombreElemento(c);if(n)return n}catch(_){}
 const P=(window.COMP_PLANOS||[]).find(r=>r&&String(r[0]).toUpperCase()==c);return P?P[1]:""};
const ficha=c=>{const L=window.COMP_CAMPO||[];const f=L.find(z=>String(z.id||"").toUpperCase().split(/\s*[\/,]\s*/).some(k=>k.replace(/\s+/g,"")==c));
 return f?(L.find(z=>z.baseId&&String(z.baseId)==String(f.id))||f):null};

/* ---------- pintado en la hoja del SOS ---------- */
const st=document.createElement("style");st.textContent=`
#sheetc .iarep{border:2px solid #22c55e;border-radius:12px;padding:10px;margin:0 0 10px}
#sheetc .iarh{font:800 13.5px/1.3 var(--tkmo,monospace);letter-spacing:.6px;color:#22c55e}
#sheetc .iarh small{display:block;font:600 12px/1.3 inherit;letter-spacing:0;color:var(--mu,#90a4ae);margin-top:2px}
#sheetc .iars{margin-top:8px}#sheetc .iars>b{display:block;font-size:13px;color:var(--ac,#f07300);margin-bottom:2px}
#sheetc .iars ol{margin:0;padding-left:22px}#sheetc .iars li{font-size:14px;line-height:1.4;margin:2px 0}
#sheetc .iarc{margin-top:8px;font-size:12.5px;font-weight:700;color:var(--mu,#90a4ae)}
#sheetc .iarok{margin-top:8px;font-size:12.5px;font-weight:700;color:#22c55e}
#sheetc details.iarprev{margin-top:8px}#sheetc details.iarprev>summary{font-size:12.5px;font-weight:700;color:var(--mu,#90a4ae);cursor:pointer}
#sheetc .iacmp{display:flex;flex-direction:column;gap:4px}
#sheetc .iacb{display:block;width:100%!important;margin:0!important;padding:8px 9px!important;text-align:left;font-size:14px!important;line-height:1.3;border:2px solid #455a64!important;border-radius:8px!important}
#sheetc .iacb.on{border-color:#22c55e!important}#sheetc .iacb small{display:block;font-size:12px;font-weight:700;color:#22c55e;margin-top:2px}
#sheetc .iacb.pend small{color:#e09a00}`;document.head.appendChild(st);

function repHTML(){const S=R.sec,o=["pri","diag","rep","fin"].filter(k=>S[k]);
 return`<div class="card iarep" id="ia_rep"><div class="iarh">🤖 ACTUACIÓN MÁS EFICAZ · ANÁLISIS IA<small>${E(R.motor||"IA")} · PBB ${E(R.pos||"-")} · sin alarma asociada · según el PDF de la actuación</small></div>
 ${o.map(k=>`<div class="iars"><b>${E(S[k].t)}</b><ol>${S[k].it.map(x=>`<li>${E(x)}</li>`).join("")}</ol></div>`).join("")}
 ${R.comp.length?`<div class="iarc">🔩 Componentes a intervenir: ${R.comp.map(c=>`<span class="cmpid">${E(c)}</span>`).join(" · ")}</div>`:""}
 ${R.ot?`<div class="iarok">✅ ${E(R.ot)}</div>`:""}</div>`}
function cmpHTML(){const b=R.comp.length?`<div class="svok">Según el análisis IA (${E(R.motor||"IA")}): toca un componente para ver su ficha.</div><div class="iacmp">${R.comp.map(c=>{const f=ficha(c),n=(f&&f.t)||nombre(c);
  return`<button type="button" class="iacb${f?"":" pend"}" data-c="${E(c)}"><span class="cmpid">${E(c)}</span> ${E(n||"")}<small>${f?"🔩 Ficha del catálogo · ver ↓":"Aún no está en Componentes de campo · incorporar"}</small></button>`}).join("")}</div><div id="ia_fi"></div>`
  :`<div class="svok">El análisis IA no nombra un elemento concreto por su código de planos.</div>`;
 return`<div class="ubh ubcmp" id="sv_cmp">🔩 COMPONENTE A INTERVENIR<small>Según el análisis IA</small></div><div class="ubb ubbcmp" id="ia_cmpb">${b}</div>`}
function pon(){if(!R)return;const res=$("sr_res");if(!res||!res.querySelector(".ub1"))return;
 if(R.pos&&val("sr_p").toUpperCase()&&val("sr_p").toUpperCase()!=R.pos)return;
 /* 2 · REPARAR: la actuación IA arriba; lo de la guía, plegado debajo */
 const lp=$("lp_res");if(lp&&!lp.querySelector("#ia_rep")&&!/Buscando la actuaci/.test(lp.textContent)){
  const d=document.createElement("details");d.className="iarprev";d.innerHTML="<summary>Actuación de la guía (antes del análisis IA)</summary>";
  while(lp.firstChild)d.appendChild(lp.firstChild);lp.innerHTML=repHTML();lp.appendChild(d)}
 /* COMPONENTE A INTERVENIR */
 if(!$("ia_cmpb")){const h=$("sv_cmp");const old=h&&h.nextElementSibling&&h.nextElementSibling.classList.contains("ubbcmp")?h.nextElementSibling:null;
  const d=document.createElement("div");d.innerHTML=cmpHTML();const H=d.firstChild,B=d.lastChild;
  if(old){const p=document.createElement("details");p.className="iarprev";p.innerHTML="<summary>Lo que proponía el análisis sin IA</summary>";while(old.firstChild)p.appendChild(old.firstChild);B.appendChild(p);old.remove()}
  if(h)h.replaceWith(H);else{const u2=res.querySelector(".ub2");u2?res.insertBefore(H,u2):res.appendChild(H)}H.after(B);
  B.querySelectorAll(".iacb").forEach(b=>b.onclick=()=>{const c=b.dataset.c,f=ficha(c);
   if(!f){if(typeof sosIncPend=="function")sosIncPend(c);return}
   B.querySelectorAll(".iacb").forEach(x=>x.classList.toggle("on",x===b));const fi=$("ia_fi");
   if(fi){try{fi.innerHTML=typeof compFicha=="function"?compFicha(f):""}catch(e){fi.innerHTML=""}}})}}
/* la lupa o el ANALIZAR repintan: se vuelve a poner */
setInterval(()=>{try{if(R&&$("sr_res"))pon()}catch(e){}},900);

/* ---------- OT asociada ---------- */
function otDe(S){let L=[];try{L=Array.isArray(inc)?inc:[]}catch(_){}const ab=L.filter(o=>o&&o.estado=="abierta");
 if(S.otId){const o=ab.find(x=>x.id==S.otId);if(o)return o}
 const pos=String(S.pos||"").toUpperCase(),id=window.__sosOT;
 if(id){const o=ab.find(x=>x.id==id);if(o&&(!pos||String(o.pos).toUpperCase()==pos))return o}
 if(!pos)return null;const P=ab.filter(o=>String(o.pos).toUpperCase()==pos);
 const t=o=>Date.parse(o.created_at||o.creado||((o.fecha||"")+"T"+(o.hIni||"00:00")))||0;return P.sort((a,b)=>t(b)-t(a))[0]||null}
function textoAct(){const S=R.sec,j=k=>S[k]?S[k].it.slice(0,k=="diag"?6:5).map((x,i)=>`${i+1}. ${x}`).join("\n"):"";
 const p=[`Actuación propuesta · análisis IA (${R.motor||"IA"}) · sin alarma asociada`];
 if(S.pri)p.push("1ª actuación:\n"+j("pri"));if(S.rep)p.push("Reparación:\n"+j("rep"));else if(S.diag)p.push("Diagnóstico:\n"+j("diag"));
 if(S.fin)p.push("Comprobación final:\n"+j("fin"));
 if(R.comp.length)p.push("Componentes a intervenir: "+R.comp.map(c=>{const n=nombre(c);return n?`${c} (${n})`:c}).join(", "));
 return p.join("\n\n").slice(0,2500)}
function guardaOT(S){const o=otDe(S);if(!o)return "";const prev=o.iaAct||{};
 const txt=textoAct(),obs=R.comp.length?"Componentes a intervenir (análisis IA): "+R.comp.map(c=>{const n=nombre(c);return n?`${c} ${n}`:c}).join(" · "):"";
 const act=(o.act||"").trim(),ob=(o.obs||"").trim(),auto=new Set([(prev.txt||"").trim(),((o.sosAct||{}).txt||"").trim()].filter(Boolean));
 let pAct=false,pObs=false;
 if(!act||auto.has(act)){o.act=txt;pAct=true}
 if(obs&&(!ob||ob==(prev.obs||"").trim())){o.obs=obs;pObs=true}
 o.iaAct={t:new Date().toISOString(),motor:R.motor||"",txt,obs,comp:R.comp.slice(),sec:Object.fromEntries(Object.entries(R.sec).map(([k,v])=>[k,v.it]))};
 o.sosAct={...(o.sosAct||{}),t:new Date().toISOString(),ia:1,ob:(S.obs||"").slice(0,400)};
 if(!o.resClaude&&S.md)o.resClaude={txt:S.md,ts:Date.now(),por:"SOS · "+(S.motor||"IA"),croquis:S.croquis||undefined};
 try{sv("pbb_inc",inc)}catch(e){console.warn("sos-ia-rellena",e)}try{if(typeof render=="function")render()}catch(_){}
 const n=o.orden||o.pos;return pAct?`Actuación${pObs?" y componentes":""} copiados a la OT ${n}`:`La OT ${n} ya tenía actuación escrita: no se pisa (la del análisis IA queda guardada en la OT)`}

/* ---------- al terminar la consulta IA ---------- */
function aplica(S){if(!S||!S.res||!S.md||S.err||S.__rel)return;S.__rel=1;if(!sinAlarma(S))return;
 const sec=secciones(S.md);if(!Object.keys(sec).length)return;
 R={pos:String(S.pos||"").toUpperCase(),sec,comp:componentes(S.md,sec,S.croquis),motor:/Gemini/i.test(S.motor||window.__motorSOS||"")?"Gemini IA":"Claude IA",ot:""};
 try{R.ot=guardaOT(S)}catch(e){console.warn("sos-ia-rellena OT",e)}
 try{const lp=$("lp_res");if(lp){lp.querySelector("#ia_rep")&&lp.querySelector("#ia_rep").remove()}$("ia_cmpb")&&$("ia_cmpb").remove()}catch(_){}
 pon();if(typeof msg=="function")msg("Actuación más eficaz rellenada con el análisis IA"+(R.ot?" · "+R.ot:""))}
const oC=window.sosObClaude;
if(typeof oC=="function")window.sosObClaude=async function(){R=null;const r=await oC.apply(this,arguments);
 try{aplica(window.__sosIaST&&window.__sosIaST())}catch(e){console.warn("sos-ia-rellena",e)}return r};
/* SOS nuevo o reiniciado: se olvida lo aplicado */
const oRe=window.sosReinicia;if(typeof oRe=="function")window.sosReinicia=function(){R=null;return oRe.apply(this,arguments)};
window.__sosIaRellena={secciones,componentes,aplica,estado:()=>R};
})();
