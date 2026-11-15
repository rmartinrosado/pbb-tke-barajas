/* ===== v480: CIERRE DE OT · comprobación antes de cerrar + cierre dictado con IA (15/11/2026)
   1) «Comprobado antes de cerrar»: LED del PLC en reposo · alarma borrada en la Magelis · maniobra completa en Remoto
      (+ «Puentes retirados» si la OT tuvo primera actuación con puente). Al pulsar «Cerrar OT» con algo sin marcar, la app
      avisa y pide confirmación. Lo marcado se guarda en la OT (i.verif) y sale en el informe.
   2) «🎙 Dictar»: hablas («cambiado borde T-B5, conector con agua…») y la IA (Claude, Gemini de reserva · función leer-ia)
      redacta Actuación y Observaciones con el formato de cierre CGA y marca las comprobaciones que hayas dicho.
      Sin reconocimiento de voz en el móvil: el mismo cuadro sirve con el micrófono del teclado. ===== */
(function(){
"use strict";
const $q=s=>document.querySelector(s);
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const VER=[["alarma","Alarma reseteada (Magelis)"],["maniobra","Maniobra completa en Remoto"],["puentes","Puentes retirados"]]; /* v484: sin «LED del PLC en reposo» */
const conPuente=i=>{try{return !!((typeof otPrimAct=="function"&&otPrimAct(i))||(typeof puentesOT=="function"&&(puentesOT(i)||[]).length))}catch(e){return false}};
const st=document.createElement("style");st.textContent=`
.vchk{margin-top:8px;border:1.5px solid var(--bd);border-radius:10px;padding:6px 8px}
.vchk .vct{font-size:11.5px;font-weight:800;color:var(--mu);margin-bottom:4px;letter-spacing:.2px}
.vchk .vcg{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.vchk label.vc{display:flex!important;align-items:center;gap:6px;margin:0!important;padding:6px 7px;border:1px solid var(--bd);border-radius:8px;font-size:12px!important;line-height:1.15;font-weight:600;cursor:pointer;-webkit-tap-highlight-color:transparent}
.vchk label.vc input{width:18px;height:18px;margin:0;flex:none;accent-color:#2f8a4a}
.vchk label.vc.on{border-color:#2f8a4a;color:#2fd36b;background:color-mix(in srgb,#2f8a4a 14%,transparent)}
.vchk.ok{border-color:#2f8a4a}
.dicb{display:inline-block;vertical-align:middle;width:auto!important;margin:-3px 0 0 10px!important;padding:3px 10px!important;letter-spacing:0;text-transform:none;font-size:12.5px!important;font-weight:800;border-radius:14px!important}
#dicv{position:fixed;left:0;right:0;bottom:0;z-index:100001;background:#111827;color:#fff;border-radius:16px 16px 0 0;padding:12px 12px max(14px,env(safe-area-inset-bottom));box-shadow:0 -8px 30px rgba(0,0,0,.5)}
#dicv h4{margin:0 0 4px;font-size:15px}#dicv .mu{color:#cbd5e1;font-size:12px}
#dicv textarea{width:100%;box-sizing:border-box;min-height:110px;margin:8px 0;font-size:16px;border-radius:10px;padding:8px;border:1px solid #475569;background:#0b1220;color:#fff}
#dicv .dbt{display:grid;grid-template-columns:1fr 1.4fr .7fr;gap:8px}#dicv .dbt button{margin:0!important;padding:12px 4px!important;font-size:15px!important;font-weight:800;border-radius:10px}
#dicv .rec{background:#c62828!important;color:#fff!important;border:0!important;animation:pupar 1.4s ease-in-out infinite}
#dicv .dst{font-size:12px;min-height:16px;color:#fde68a}`;
document.head.appendChild(st);

/* ---------- 1) comprobación antes de cerrar ---------- */
function pon(){try{const sc=$q("#sheetc");if(!sc)return;const bc=sc.querySelector('button[onclick^="cerrar("]');if(!bc)return;
 const id=((bc.getAttribute("onclick")||"").match(/\(\s*'([^']+)'/)||[])[1];const i=typeof inc!="undefined"&&inc.find(x=>x.id==id);if(!i)return;
 if(!sc.querySelector(".vchk")){const v=i.verif||{},L=VER.filter(([k])=>k!="puentes"||conPuente(i)||v.puentes);
  const d=document.createElement("div");d.className="vchk";d.dataset.id=id;
  d.innerHTML=`<div class="vct">✅ COMPROBADO ANTES DE CERRAR</div><div class="vcg" style="grid-template-columns:repeat(${L.length>2?3:2},minmax(0,1fr))">${L.map(([k,t])=>`<label class="vc${v[k]?" on":""}"><input type="checkbox" data-k="${k}" ${v[k]?"checked":""}><span>${E(t)}</span></label>`).join("")}</div>`;
  d.querySelectorAll("input").forEach(x=>x.onchange=()=>{x.parentNode.classList.toggle("on",x.checked);marcaOK(d)});marcaOK(d);
  const ref=sc.querySelector(".infcie")||bc;ref.before(d)}
 /* v484: orden final · Observaciones → Claude → Comprobado → Informe PDF → Cancelar → CERRAR OT (al final) */
 {const ro=$q("#r_o");const can=[...sc.querySelectorAll(":scope>button")].filter(x=>/^\s*Cancelar\s*$/.test(x.textContent)).pop();
  const seq=[sc.querySelector(":scope>#r_cl"),sc.querySelector(":scope>#rc_prog"),sc.querySelector(":scope>.vchk"),sc.querySelector(":scope>.infcie"),can,bc].filter(Boolean);
  if(ro&&ro.parentNode===sc){let prev=ro,ok=true;for(const el of seq){if(prev.nextElementSibling!==el){ok=false;break}prev=el}
   if(!ok){let p=ro;seq.forEach(el=>{p.after(el);p=el})}}}
 /* 2) botón 🎙 Dictar junto a «Actuación» */
 const ta=$q("#r_a");if(ta){const lb=ta.previousElementSibling;if(lb&&lb.tagName=="LABEL"&&!lb.querySelector(".dicb")){const b=document.createElement("button");b.type="button";b.className="sec dicb";b.textContent="🎙 Dictar";
  b.onclick=e=>{e.preventDefault();e.stopPropagation();dicAbre(id)};lb.appendChild(b)}}}catch(e){}}
const marcaOK=d=>d.classList.toggle("ok",[...d.querySelectorAll("input")].every(x=>x.checked));
let tm=null;new MutationObserver(()=>{if(!tm)tm=setTimeout(()=>{tm=null;pon()},200)}).observe(document.documentElement,{childList:true,subtree:true});
const lee=()=>{const d=$q("#sheetc .vchk");if(!d)return null;const o={};d.querySelectorAll("input").forEach(x=>o[x.dataset.k]=x.checked);return o};
(function(){const o=cerrar;cerrar=function(id){const v=lee();
  if(v){const fal=VER.filter(([k])=>k in v&&!v[k]).map(([,t])=>t);
   if(fal.length&&!confirm("Sin comprobar:\n• "+fal.join("\n• ")+"\n\n¿Cerrar la OT igualmente?"))return;
   const i=inc.find(x=>x.id==id);if(i)i.verif=Object.assign({},v,{ts:Date.now()})}
  return o.apply(this,arguments)};window.cerrar=cerrar})();

/* ---------- 2) cierre dictado ---------- */
let REC=null,base="";
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
window.dicAbre=function(id){let d=$q("#dicv");if(d)d.remove();d=document.createElement("div");d.id="dicv";d.dataset.id=id;
 d.innerHTML=`<h4>🎙 Cierre dictado</h4><div class="mu">Di qué encontraste, la causa y qué hiciste (con códigos si los sabes). ${SR?"Pulsa 🎙 y habla.":"Usa el micrófono del teclado."}</div>
 <textarea id="dic_t" placeholder="Ej.: borde trasero T-B6 cortado por el giro de ruedas, conector T-CON10 con agua; sustituido el borde, secado y sellado el conector. Alarma reseteada, maniobra completa. Puente retirado."></textarea>
 <div class="dst" id="dic_s"></div>
 <div class="dbt">${SR?`<button class="sec" id="dic_m" onclick="dicMic()">🎙 Hablar</button>`:`<button class="sec" onclick="document.getElementById('dic_t').focus()">⌨️ Teclado</button>`}<button class="pri" onclick="dicIA()">🤖 Rellenar cierre</button><button class="sec" onclick="dicCierra()">✕</button></div>`;
 document.body.appendChild(d);if(SR)dicMic();else $q("#dic_t").focus()};
/* v481: en iOS stop() a veces no termina la escucha continua: se fuerza con abort() y el botón cambia al momento */
function paraRec(){const r=REC;REC=null;if(r){r.__parado=true;try{r.stop()}catch(e){}setTimeout(()=>{try{r.abort()}catch(e){}},350)}
 const b=$q("#dic_m"),s=$q("#dic_s");if(b){b.textContent="🎙 Hablar";b.classList.remove("rec")}if(s&&/Escuchando/.test(s.textContent))s.textContent="Detenido. Pulsa 🤖 Rellenar cierre o 🎙 para seguir."}
window.dicCierra=()=>{paraRec();const d=$q("#dicv");if(d)d.remove()};
/* la flecha «Atrás» flotante cierra primero el cuadro de dictado */
document.addEventListener("click",e=>{const f=e.target.closest&&e.target.closest("#fabb");if(f&&$q("#dicv")){e.preventDefault();e.stopImmediatePropagation();dicCierra()}},true);
window.dicMic=function(){const b=$q("#dic_m"),t=$q("#dic_t"),s=$q("#dic_s");if(!SR||!t)return;
 if(REC){paraRec();return}
 const r=new SR();r.lang="es-ES";r.continuous=true;r.interimResults=true;base=t.value?t.value.trim()+" ":"";
 r.onresult=ev=>{if(r.__parado&&REC!==r&&REC)return;let fin="",tmp="";for(let k=0;k<ev.results.length;k++){const x=ev.results[k];(x.isFinal?(fin+=x[0].transcript+" "):(tmp+=x[0].transcript))}t.value=(base+fin+tmp).replace(/\s+/g," ").trimStart()};
 r.onerror=ev=>{if(s)s.textContent=ev.error=="not-allowed"?"Micrófono sin permiso: actívalo en Ajustes o usa el del teclado.":"Voz: "+ev.error};
 r.onend=()=>{if(REC===r)paraRec()};
 try{r.start();REC=r;if(b){b.textContent="⏹ Parar";b.classList.add("rec")}if(s)s.textContent="Escuchando…"}catch(e){if(s)s.textContent="No se ha podido iniciar la voz: usa el micrófono del teclado."}};
window.dicIA=async function(){const d=$q("#dicv");if(!d)return;paraRec();
 const dic=$q("#dic_t").value.trim(),s=$q("#dic_s");if(dic.length<8){s.textContent="Dicta o escribe algo primero.";return}
 const i=inc.find(x=>x.id==d.dataset.id);if(!i)return;const al=window.aliasCampo||(x=>x);
 const prompt=`Eres técnico de mantenimiento de pasarelas de embarque (PBB) TKE en el aeropuerto de Madrid-Barajas.
Redacta el cierre de la OT para CGA (AENA) a partir de lo que ha dictado el técnico. Castellano técnico, conciso, frases en pasado impersonal («Se sustituye…», «Se comprueba…»), sin inventar nada que no esté dicho; corrige la transcripción de voz (p. ej. «te be seis» = T-B6, «e a ocho» = E-A8).
OT: ${i.orden||"-"} · PBB ${i.pos} · tipo ${i.tipo||"PAS"} · aviso: «${al(i.desc||"")}»${i.def&&i.def!=i.desc?" · defecto: «"+al(i.def)+"»":""}
Dictado del técnico: «${dic}»
Responde SOLO con JSON, sin nada más:
{"actuacion":"qué se encontró, causa y qué se hizo (elementos con su código), 1-4 frases","observaciones":"pendientes, repuestos, recomendaciones o puentes; vacío si no hay","alarma":true/false,"maniobra":true/false,"puentes":true/false}
En alarma/maniobra/puentes pon true SOLO si el dictado dice expresamente que se comprobó (alarma reseteada o borrada, maniobra completa, puentes retirados).`;
 s.textContent="🤖 Redactando el cierre…";
 try{const ses=await sb.auth.getSession(),tok=ses&&ses.data&&ses.data.session&&ses.data.session.access_token;if(!tok)throw new Error("Inicia sesión para usar la IA");
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),60000);
  const r=await fetch(SUPABASE_URL+"/functions/v1/leer-ia",{method:"POST",signal:ac.signal,headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:"Bearer "+tok},body:JSON.stringify({prompt})});clearTimeout(to);
  const j=await r.json().catch(()=>({}));if(!r.ok||!j.txt)throw new Error(j.mensaje||j.error||("error "+r.status));
  const m=String(j.txt).match(/\{[\s\S]*\}/);if(!m)throw new Error("respuesta sin formato");const o=JSON.parse(m[0]);
  const pon=(sel,v)=>{const t=$q(sel);if(!t||!v)return;const a=t.value.trim();t.value=a?a+"\n"+v:v;t.dispatchEvent(new Event("input",{bubbles:true}))};
  pon("#r_a",String(o.actuacion||"").trim());pon("#r_o",String(o.observaciones||"").trim());
  const vc=$q("#sheetc .vchk");if(vc)["alarma","maniobra","puentes"].forEach(k=>{if(o[k]===true){const x=vc.querySelector(`input[data-k="${k}"]`);if(x&&!x.checked){x.checked=true;x.onchange()}}});
  dicCierra();msg("Cierre redactado ("+(j.lector||"IA")+"). Revísalo antes de cerrar.");
  const a=$q("#r_a");if(a)a.scrollIntoView({block:"center",behavior:"smooth"})}
 catch(e){s.textContent="No se ha podido redactar: "+(e&&e.name=="AbortError"?"la IA no respondió a tiempo":(e.message||e))+". El texto dictado no se pierde."}};
})();
