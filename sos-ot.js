/* ===== v929: ANALIZAR del SOS → la actuación queda ASOCIADA A LA OT (26/11/2026) =====
   · Al pulsar ANALIZAR se busca la OT: la de la tarjeta desde la que se abrió el SOS (botón rojo de alarma, al lado de la llave) o,
     si se abrió el SOS suelto, la OT abierta de la misma posición (la más reciente).
   · Las alarmas de «Alarma registrada» se SUMAN a «Alarmas de la Magelis» de la ficha de la OT (sin repetir; se pueden ir sumando
     más en cada análisis y desde Editar registro) y la OT se guarda en ese momento (local + Supabase).
   · La OT queda marcada con la actuación SOS (sosAct): en su tarjeta la llave de la guía de campo pasa a VERDE parpadeando.
   · Si no hay OT abierta de esa posición, se avisa: el análisis sigue igual. ===== */
(function(){
"use strict";
const LA=t=>{try{return typeof window.rcsListaAl=="function"?window.rcsListaAl(t||""):[]}catch(_){return[]}};
/* el SOS abierto desde la tarjeta guarda la OT; abierto de cualquier otra forma, se olvida */
const oR=window.sosRap;if(typeof oR=="function")window.sosRap=function(){window.__sosOT=null;return oR.apply(this,arguments)};
const oAb=window.abreSosOT;if(typeof oAb=="function")window.abreSosOT=function(id){const r=oAb.apply(this,arguments);window.__sosOT=id;return r};
function otDe(pos){let L=[];try{L=Array.isArray(inc)?inc:[]}catch(_){}const ab=L.filter(o=>o&&o.estado=="abierta");
 const id=window.__sosOT;if(id){const o=ab.find(x=>x.id==id);if(o&&(!pos||String(o.pos).toUpperCase()==pos))return o}
 if(!pos)return null;const P=ab.filter(o=>String(o.pos).toUpperCase()==pos);if(!P.length)return null;
 const t=o=>Date.parse(o.created_at||o.creado||((o.fecha||"")+"T"+(o.hIni||"00:00")))||0;return P.sort((a,b)=>t(b)-t(a))[0]}
function asocia(){const pos=((document.getElementById("sr_p")||{}).value||"").trim().toUpperCase();const o=otDe(pos);
 if(!o){if(pos&&typeof msg=="function")msg(`Sin OT abierta en la ${pos}: la actuación no se asocia a ninguna OT`);return}
 const X=LA((document.getElementById("sr_t")||{}).value),V=LA(o.alMag||(typeof o.alarmas=="string"?o.alarmas:""));
 const M=V.slice();X.forEach(x=>{if(!M.some(z=>z.c==x.c))M.push(x)});const nuevas=M.length-V.length;
 if(M.length){o.alMag=M.map(x=>`${x.c} ${x.t}`).join("\n");if(!o.alCod)o.alCod=M[0].c;if(typeof o.alarmas=="string")delete o.alarmas}
 const ob=((document.getElementById("sr_ob")||{}).value||"").trim();
 o.sosAct={...(o.sosAct||{}),t:new Date().toISOString(),al:X.map(x=>x.c),ob:ob.slice(0,400)};
 try{sv("pbb_inc",inc)}catch(e){console.warn("sos-ot",e)}try{if(typeof render=="function")render()}catch(_){}
 if(typeof msg=="function")msg(`OT ${o.orden||o.pos} guardada${nuevas?` · +${nuevas} alarma${nuevas>1?"s":""} en la ficha`:""} · guía de campo lista`);return o}
/* v930: el TEXTO de la actuación del análisis se copia al campo «Actuación» de la OT.
   · Se espera a que el resultado deje de cambiar (puente, reset, seguridades y actuación más eficaz).
   · Si «Actuación» está vacía se rellena; si lo que hay es la copia de un análisis anterior, se sustituye; si el técnico ya escribió
     su actuación, NO se pisa (la copia queda en la OT, en sosAct.txt). */
function textoRes(){const r=document.getElementById("sr_res");if(!r)return"";const c=r.cloneNode(true);
 c.querySelectorAll("#sr_leido,details.srcomp,details.srtx,button,svg,img,script,style,.icoL").forEach(x=>x.remove());
 const d=document.createElement("div");d.style.cssText="position:fixed;left:-9999px;top:0;width:360px";d.appendChild(c);document.body.appendChild(d);
 let s=(c.innerText||c.textContent||"");d.remove();
 return s.replace(/\u00a0/g," ").split("\n").map(x=>x.replace(/[ \t]+/g," ").trim()).filter((x,i,A)=>x||(A[i-1]||"")).join("\n").replace(/\n{3,}/g,"\n\n").trim().slice(0,2500)}
const espera=()=>new Promise(res=>{let ult="",igual=0,n=0;const tic=()=>{const s=textoRes();const ocup=/Leyendo|Consultando|Cruzando|Buscando|Analizando/i.test(s);
  if(s&&s===ult&&!ocup){if(++igual>=2){res(s);return}}else igual=0;ult=s;if(++n>40){res(s);return}setTimeout(tic,400)};setTimeout(tic,600)});
async function copia(o){if(!o||!o.sosAct)return;const s=await espera();if(!s)return;
 const ant=(o.sosAct.txt||"").trim(),act=(o.act||"").trim();
 o.sosAct.txt=s;let puesto=false;const iaT=((o.iaAct||{}).txt||"").trim();/* v959: la actuación rellenada por el análisis IA no se pisa con el texto del ANALIZAR */
 if(!(iaT&&act===iaT)&&(!act||act===ant)){o.act=s;puesto=true}
 try{sv("pbb_inc",inc)}catch(e){console.warn("sos-ot",e)}try{if(typeof render=="function")render()}catch(_){}
 if(typeof msg=="function")msg(puesto?`Actuación copiada a la OT ${o.orden||o.pos}`:`La OT ${o.orden||o.pos} ya tenía actuación escrita: no se pisa (la del SOS queda guardada en la OT)`)}
const oA=window.sosAnaliza;if(typeof oA=="function")window.sosAnaliza=async function(){let o=null;try{o=asocia()}catch(e){console.warn("sos-ot",e)}
 const r=await oA.apply(this,arguments);try{const o2=asocia();if(o2)o=o2}catch(_){}/* v957: vuelve a sumar las alarmas (las de la foto se leen durante el análisis) */try{if(o)await copia(o)}catch(e){console.warn("sos-ot copia",e)}return r};
})();
