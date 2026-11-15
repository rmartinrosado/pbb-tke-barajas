/* ===== v469: FOTO DEL PLC LEÍDA CON IA (15/11/2026) =====
   En «Cotejar PLC (Estado en Reposo)», con la foto cargada, el botón «🤖 Leer LEDs con IA» manda la foto a la función
   «leer-ia» (Claude preferente, Gemini de reserva) con la tabla de referencia de los módulos (LED y estado en reposo).
   La IA dice qué módulos se ven y qué LED están encendidos o apagados; la app marca sola los LED que NO coinciden con
   el reposo (y los módulos enteros apagados). Revisa lo marcado antes de «Pasar resultado a la OT».
   v490: «todo apagado» solo si la IA identificó el módulo por su ETIQUETA y vio el LED de alimentación (US/UL) apagado;
   si no, aviso amarillo «dudoso, haz otra foto de cerca» (no tarjeta roja). La IA dice por qué identificó cada módulo. ===== */
(function(){
"use strict";
if(typeof gCotHTML!="function"||typeof PLC=="undefined")return;
const ref=()=>PLC.map(M=>`${M.id} (${M.n}):\n`+M.m.map((sub,k)=>`  módulo ${k+1}: `+sub.map((L,l)=>`${l+1}=${String(L[0]).slice(0,38)}[${L[1]==1?"ENC":L[1]==0?"APAG":"VARÍA"}]`).join(" · ")).join("\n")).join("\n");
const PROMPT=()=>`Foto hecha con el móvil a los módulos del PLC de una pasarela de embarque TKE (armario eléctrico: módulos E-A…; armario del pupitre: módulos P-A…).
Cada módulo E-A… / P-A… tiene una cabecera y varios submódulos («módulo 1», «módulo 2»…) con 4 LED de estado cada uno (a veces menos), numerados de arriba abajo.
REFERENCIA (estado en reposo de cada LED):
${ref()}

TAREA
1. Identifica qué módulos se VEN en la foto. En "por" indica cómo: "etiqueta" si LEES el rótulo impreso (E-A0, E-A9, P-A4…) en la foto; "orden" si lo deduces por su posición en el carril. Si no puedes identificar un módulo con seguridad, no lo incluyas.
2. Para cada submódulo visible, di el estado de cada LED: 1 = encendido (luce), 0 = apagado, null = no se ve bien (reflejo de la tapa, cable delante, ángulo, desenfoque). Ante la duda, null: NO es lo mismo «no se ve» que «apagado».
3. En "sin_alimentacion" pon SOLO los módulos que ves claramente COMPLETAMENTE apagados. Para cada uno indica "por" (etiqueta/orden) y "led_alim": "apagado" si VES el LED de alimentación (US/UL/PWR) y está apagado, o "no_se_ve" si no lo distingues.
4. En "notas" explica brevemente dudas (reflejos, LED tapados, etiquetas ilegibles, módulos no identificados).
Responde SOLO con JSON: {"modulos":[{"id":"E-A9","por":"etiqueta","sub":[{"k":1,"leds":[1,0,null,1]}]}],"sin_alimentacion":[{"id":"E-A9","por":"etiqueta","led_alim":"apagado"}],"notas":""}`;
/* módulos que la IA da por apagados sin pruebas suficientes (aviso amarillo, no avería) */
const DUD=window.gIADud=new Map();let dudFoto="";
const fotoAct=()=>{const ot=(typeof gOTs=="function"?gOTs():[]).find(x=>x.id==gOT);return (ot&&ot.plc)||gFoto||""};
let ocupado=false;
window.plcIA=async function(){if(ocupado)return;const ot=(typeof gOTs=="function"?gOTs():[]).find(x=>x.id==gOT);const foto=(ot&&ot.plc)||gFoto;
 if(!foto){msg("Primero haz o carga la foto del PLC");return}
 const st=document.getElementById("plcia_st");const set=t=>{if(st)st.innerHTML=t};ocupado=true;set("⏳ Leyendo los LED con IA… (unos segundos)");DUD.clear();dudFoto=foto;
 try{const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;if(!tok)throw new Error("Inicia sesión para usar la IA");
  const img=String(foto).split(",")[1];
  const r=await fetch(SUPABASE_URL+"/functions/v1/leer-ia",{method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},body:JSON.stringify({img,tipo:"image/jpeg",prompt:PROMPT()})});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.mensaje||j.error||("error "+r.status));
  const m=String(j.txt||"").match(/\{[\s\S]*\}/);if(!m)throw new Error("Respuesta sin datos");const D=JSON.parse(m[0]);
  let n=0,vis=0;const ids=[];
  const nid=x=>String(x||"").toUpperCase().replace(/\s/g,"");const porEt={};const pos=[];
  (D.modulos||[]).forEach(mo=>{const M=PLC.find(x=>x.id==nid(mo.id));if(!M)return;ids.push(M.id);porEt[M.id]=String(mo.por||"").toLowerCase()=="etiqueta";if(!porEt[M.id])pos.push(M.id);
   (mo.sub||[]).forEach(s=>{const k=+s.k,sub=M.m[k-1];if(!sub)return;(s.leds||[]).forEach((v,ix)=>{const L=sub[ix];if(!L||v==null)return;vis++;
    const key=`${M.id}|${k}|${ix+1}`;if(L[1]!==2&&+v!==L[1]){if(!gMis.has(key)){gMis.add(key);n++}}})})});
  (D.sin_alimentacion||[]).forEach(e=>{const o=typeof e=="object"&&e?e:{id:e};const M=PLC.find(x=>x.id==nid(o.id));if(!M)return;
   const et=String(o.por||"").toLowerCase()=="etiqueta"||(o.por==null&&porEt[M.id]===true);const al=String(o.led_alim||"").toLowerCase()=="apagado";
   if(et&&al){if(!gSinAl.has(M.id)){gSinAl.add(M.id);n++}}
   else DUD.set(M.id,!et&&!al?"identificado solo por su posición en el carril y sin ver el LED de alimentación":!et?"identificado solo por su posición en el carril (etiqueta no legible)":"no se distingue el LED de alimentación (US/UL)")});
  if(ids.length&&!ids.includes(gPMod))gPMod=ids[0];
  gPintaCot();
  const s2=document.getElementById("plcia_st");if(s2)s2.innerHTML=`<b>${j.lector||"IA"}</b> · módulos vistos: ${ids.length?ids.join(", "):"ninguno identificado"} · ${vis} LED leídos${pos.length?` · <span style="color:#b26a00">por posición (sin leer etiqueta): ${pos.join(", ")}</span>`:""}${DUD.size?` · <b style="color:#b26a00">${DUD.size} dudoso${DUD.size==1?"":"s"}</b>`:""} · <b style="color:${n?"#c62828":"#2e7d32"}">${n} discrepancia${n==1?"":"s"} marcada${n==1?"":"s"}</b>${D.notas?`<div class="mu" style="font-size:12px;margin-top:3px">${typeof esc=="function"?esc(D.notas):D.notas}</div>`:""}<div class="mu" style="font-size:12px">Revisa lo marcado (toca un LED para quitarlo o ponerlo) antes de pasar el resultado a la OT.</div>`;
  msg(n?`IA: ${n} LED no coinciden con el reposo`:"IA: los LED leídos coinciden con el reposo")}
 catch(e){set(`<span style="color:#c62828">No se pudo leer con IA: ${String((e&&e.message)||e)}</span>`)}finally{ocupado=false}};
const oR=gResumen;window.gResumen=gResumen=function(){
 if(DUD.size&&dudFoto&&dudFoto!==fotoAct())DUD.clear();
 let h=oR.apply(this,arguments);if(!DUD.size)return h;
 if(!gMis.size&&!gSinAl.size)h="";
 let d="";DUD.forEach((por,id)=>{d+=`<div class="gdud"><b>${id} · dudoso: puede estar apagado</b><div>La IA no ve LED encendidos en este módulo, pero no es fiable: ${por}. Puede ser reflejo de la tapa, cables delante o el ángulo de la foto.</div><div class="gdudp">Haz otra foto de cerca, de frente y sin flash, con la etiqueta del módulo a la vista, y vuelve a leer con IA. Si en campo ves el LED de alimentación apagado, márcalo como sin alimentación.</div></div>`});
 return d+h};
const o=gCotHTML;window.gCotHTML=gCotHTML=function(){let h=o.apply(this,arguments);
 h=h.split('onclick="gMis.clear();gSinAl.clear();gPintaCot()"').join('onclick="gIADud.clear();gMis.clear();gSinAl.clear();gPintaCot()"');
 if(h.indexOf('<div id="g_res">')>=0)h=h.replace('<div id="g_res">',`<div class="plcia"><button class="pri" type="button" onclick="plcIA()">🤖 Leer LEDs con IA</button><div id="plcia_st" class="mu" style="font-size:12.5px;margin-top:5px"></div></div><div id="g_res">`);
 return h};
const st=document.createElement("style");st.textContent=`.plcia{margin:8px 0;padding:8px;border:1.5px solid #5b3fa0;border-radius:10px;background:rgba(91,63,160,.07)}.plcia button{width:100%;margin:0!important}.gdud{border:2px solid #f2a900;border-radius:10px;padding:10px 12px;margin:8px 0;background:rgba(242,169,0,.10)}.gdud>b{color:#b26a00}.gdudp{margin-top:6px;padding:6px 8px;border-radius:7px;background:rgba(242,169,0,.16);font-size:13px}`;document.head.appendChild(st);
})();
