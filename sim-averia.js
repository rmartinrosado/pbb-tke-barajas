/* ===== v970: SIMULADOR CHECK · «SIMULAR AVERÍA» (27/11/2026) =====
   Un simulador de verdad sobre la potencia del esquema rev. J (árbol POT del simulador):
   1) RECORRIDO: se elige ORIGEN (red 400 V del CBTH o SAI) y DESTINO (cualquier protección, contactor o carga). Se traza el camino
      y todo lo que cuelga del destino (p. ej. los tres ramales de focos detrás de E-K15).
   2) CONFIGURAR: cada elemento lleva un check «funciona». Quitándolo se elige CÓMO falla (corto franco, derivación, corte, fundido,
      disparado, no cierra…). Se pueden marcar VARIOS a la vez (averías combinadas). La orden del PLC (E-A0 2.4 → hilo 291 → bobina)
      también se puede fallar.
   3) MARCHA: recorre el circuito por fases (rearme → activar la PBB → en servicio / mover) y enseña, paso a paso, por dónde llega
      la tensión, qué protección dispara, cuándo, y si hay «fogonazo» por falta de selectividad a través del trafo P-T1.
   4) ANALIZAR: con lo OBSERVADO EN CAMPO (qué protecciones saltan y cuándo, prueba con el hilo 291 suelto) prueba todas las averías
      posibles del recorrido, se queda con las que dan los mismos síntomas, marca el PUNTO SOSPECHOSO en el recorrido y da las
      COMPROBACIONES DE CAMPO para confirmarlo.
   Caso precargado: PBB 586 · OT 611200 (real campo): «E-Q15 y E-Q15.1 saltan cuando se enciende la pasarela · fogonazo en E-Q15». */
(function(){"use strict";
if(typeof POT==="undefined"||window.ES507)return;
const $=s=>document.querySelector(s),E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- modelo: árbol POT + ramales de focos (folio 24) + mando de E-K15 (folio 53) ---------- */
const EXT=[
 {id:"fx54",p:"k15",tipo:"cond",mov:1,nm:"E-X54 → EET-W1 → ET-X51",t:"Ramal focos bajo túnel",d:"Manguera EET-W1 por el túnel telescópico",u:"230",f:24,caja:"ET-X51"},
 {id:"fet3",p:"fx54",tipo:"carga",foco:1,nm:"ET-E3",t:"Foco 300 W bajo túnel (ET-W3)",u:"230",f:24,caja:"ET-X51"},
 {id:"fet4",p:"fx54",tipo:"carga",foco:1,nm:"ET-E4",t:"Foco 300 W bajo túnel (ET-W4)",u:"230",f:24,caja:"ET-X51"},
 {id:"fx59",p:"k15",tipo:"cond",mov:1,nm:"E-X59 → EP-W1 → P-X51",t:"Ramal focos bajo cabina",d:"Manguera EP-W1 por el giro de cabina (comparte recorrido con el flash C-H1)",u:"230",f:24,caja:"P-X51"},
 {id:"fce7",p:"fx59",tipo:"carga",foco:1,nm:"C-E7",t:"Foco 300 W bajo cabina izquierdo (P-W4)",u:"230",f:24,caja:"P-X51"},
 {id:"fce8",p:"fx59",tipo:"carga",foco:1,nm:"C-E8",t:"Foco 300 W bajo cabina derecho (P-W5)",u:"230",f:24,caja:"P-X51"},
 {id:"fx57",p:"k15",tipo:"cond",mov:1,nm:"E-X57 → EC-W1 → C-X51",t:"Ramal foco exterior de cabina",d:"Manguera EC-W1 por el giro de cabina",u:"230",f:24,caja:"C-X51"},
 {id:"fce9",p:"fx57",tipo:"carga",foco:1,nm:"C-E9",t:"Foco 300 W exterior de cabina (C-W11)",u:"230",f:24,caja:"C-X51"}];
const CTRL={k15:[
 {id:"c_pa4",nm:"Orden de iluminación exterior",t:"Pulsador del pupitre / al activar la PBB → P-A4 mód. 2 LED 1",f:83},
 {id:"c_a0",nm:"E-A0 2.4 · OUT04",t:"Salida «Iluminación exterior» del PLC (LED E-A0 mód. 2 LED 4)",f:53},
 {id:"c_291",nm:"Hilo 291 → E-K15 A1",t:"Bobina 24 VDC · A2 al común 205",f:53}]};
const N={},HIJ={};
POT.forEach(n=>{if(n.ind)return;const leaf=!POT.some(x=>x.p===n.id)&&!EXT.some(x=>x.p===n.id);
 const tipo=n.p==null?"fuente":n.id==="t1"?"trafo":n.s===1?"prot":n.s===2?"cont":leaf?"carga":"cond";
 N[n.id]={id:n.id,p:n.p,tipo,nm:n.nm||(n.t||"").replace(/^\+/,"").split(/\s/)[0],t:n.t,d:n.d,u:n.u,f:n.f,ord:n.ord||(n.s===2&&!n.seg),seg:n.seg,coil:n.coil,dep:n.dep,
  dif:/diferencial|30 mA/.test((n.t||"")+(n.d||""))}});
EXT.forEach(n=>N[n.id]=Object.assign({},n));
Object.values(N).forEach(n=>{if(n.p&&N[n.p])(HIJ[n.p]=HIJ[n.p]||[]).push(n.id)});
Object.entries(CTRL).forEach(([k,L])=>L.forEach(c=>N[c.id]=Object.assign({tipo:"ctrl",de:k,u:"24dc"},c)));
const anc=id=>{const r=[];let n=N[id];while(n&&n.p){r.push(n.p);n=N[n.p]}return r};
const sub=id=>{const r=[id];(HIJ[id]||[]).forEach(h=>r.push(...sub(h)));return r};
const MODOS={fuente:{sin:"Sin tensión"},prot:{disp:"Disparado / abierto",aver:"Averiado (dispara sin carga)"},trafo:{abierto:"Bobinado cortado",corto:"Corto en el bobinado"},
 cont:{nocierra:"No cierra (bobina o contactos)",corto:"Corto entre polos (en el contactor)"},cond:{corte:"Corte (hilo suelto o roto)",corto:"Corto franco entre conductores",deriv:"Derivación a tierra",pell:"Pellizco: corto solo al mover"},
 carga:{abierto:"Fundido / abierto",corto:"Corto franco (lámpara o portalámparas)",deriv:"Derivación a la carcasa"},ctrl:{sin:"Sin orden / cortado"}};
const modos=n=>{const m=Object.assign({},MODOS[n.tipo]||{});if(n.tipo==="cond"&&!n.mov)delete m.pell;return m};
/* probabilidad previa de cada avería (orden de las hipótesis) */
const PESO=(n,m)=>m==="corto"?(n.foco?6:n.tipo==="carga"?4:n.tipo==="cond"?(n.mov?3:1.2):n.tipo==="cont"?1.5:1):m==="pell"?2.5:m==="deriv"?(n.foco?2:1.5):m==="aver"?.8:1;
const MOM={1:"al rearmar",2:"al activar la PBB",3:"al cabo de un rato",4:"al mover la pasarela"};

/* ---------- simulación ---------- */
function simula(F,man){const trip={},ev=[],flags={fog:false};let fase=0;
 const ctrlOK=id=>(CTRL[id]||[]).every(c=>!F[c.id]&&!(c.id==="c_291"&&man.p291));
 const cerrado=id=>{const n=N[id];if(F[id]==="nocierra")return false;if(fase<2)return false;
  if(n.ord&&!(man.act&&ctrlOK(id)))return false;if(n.dep&&n.dep.some(d=>!vivo(d)))return false;return true};
 const pasa=id=>{const n=N[id];if(!n)return false;if(n.tipo==="fuente")return !F[id];if(n.tipo==="prot")return !trip[id]&&F[id]!=="disp";
  if(n.tipo==="trafo")return F[id]!=="abierto";if(n.tipo==="cont")return cerrado(id);if(n.tipo==="cond")return F[id]!=="corte";if(n.tipo==="carga")return F[id]!=="abierto";return true};
 const entra=id=>{const n=N[id];return n.p?vivo(n.p):true}; /* tensión a la entrada del elemento */
 function vivo(id){const n=N[id];if(!n)return false;if(!pasa(id))return false;return n.p?vivo(n.p):true}
 const dispara=(id,modo,fr)=>{const A=anc(id);
  if(modo==="aver"){trip[id]=fase;ev.push({f:fase,tx:`${N[id].nm} dispara sin defecto aguas abajo: protección averiada`,id});return}
  if(modo==="deriv"){const d=A.find(a=>N[a].tipo==="prot"&&N[a].dif&&!trip[a]);if(d){trip[d]=fase;ev.push({f:fase,tx:`${N[d].nm} (diferencial) dispara por la fuga a tierra en ${N[id].nm}`,id:d});return}}
  const p1=A.find(a=>N[a].tipo==="prot"&&!trip[a]&&F[a]!=="disp");if(!p1)return;trip[p1]=fase;
  ev.push({f:fase,tx:`${N[p1].nm} dispara: ${modo==="deriv"?"sobrecarga por la derivación":"cortocircuito"} en ${N[id].nm}`,id:p1});
  if(fr){const it=A.indexOf("t1"),ip=A.indexOf(p1);if(it>ip){const p2=A.slice(it).find(a=>N[a].tipo==="prot"&&!trip[a]);
   if(p2){trip[p2]=fase;flags.fog=true;ev.push({f:fase,tx:`${N[p2].nm} cae a la vez (fogonazo): la corriente de corto del secundario pasa al primario del trafo P-T1 y no hay selectividad`,id:p2})}}}};
 const fallos=Object.entries(F);
 for(fase=1;fase<=4;fase++){if(fase===2&&!man.act)continue;if(fase===4&&!man.mover)continue;if(fase===3&&!man.rato)continue;
  ev.push({f:fase,cab:1,tx:fase===1?"Rearme: protecciones armadas, PBB en reposo":fase===2?"Activar la PBB: seguridades OK"+(man.act?" · el PLC da la orden de iluminación exterior"+(man.p291?" (pero el hilo 291 está suelto: E-K15 no recibe la orden)":""):""):fase===3?"En servicio un rato":"Se mueve la pasarela (telescopar, girar cabina)"});
  if(fase===2){Object.keys(CTRL).forEach(k=>{if(entra(k)){const ok=ctrlOK(k);ev.push({f:2,tx:ok?`${N[k].nm} recibe la orden y cierra`:`${N[k].nm} sin orden: no cierra`,id:k})}})}
  let otra=true,vuelta=0;while(otra&&vuelta++<8){otra=false;
   for(const [id,m] of fallos){const n=N[id];if(!n||trip["_"+id])continue;
    let sale=false,fr=false;
    if(m==="aver"&&entra(id)){sale=true}
    else if(m==="corto"){if(n.tipo==="cond"||n.tipo==="carga"||n.tipo==="trafo")sale=entra(id);else if(n.tipo==="cont")sale=entra(id);fr=true}
    else if(m==="pell"&&fase===4)sale=entra(id),fr=true;
    else if(m==="deriv"&&(fase>=3||N[id]&&anc(id).some(a=>N[a].dif)))sale=entra(id)&&(fase>=3||anc(id).some(a=>N[a].dif&&!trip[a]));
    if(sale){trip["_"+id]=1;dispara(id,m,fr);otra=true}}}}
 const T={};Object.keys(trip).forEach(k=>{if(k[0]!=="_")T[k]=trip[k]});
 fase=man.act?2:1;const V={};Object.keys(N).forEach(id=>{if(N[id].tipo!=="ctrl")V[id]=vivo(id)});
 return {trip:T,ev,fog:flags.fog,vivo:V}}

/* ---------- estado de la pantalla ---------- */
const S={caso:"586",org:"red",dst:"k15",F:{},man:{act:true,p291:false,rato:false,mover:false},obs:{trip:{},p291:"",fog:false},res:null,ana:null,anim:0};
function caso586(){S.caso="586";S.org="red";S.dst="k15";S.F={};S.man={act:true,p291:false,rato:false,mover:false};
 S.obs={trip:{q15:2,q151:2},p291:"",fog:true};S.res=null;S.ana=null}
function ot586(){try{let L=[];try{if(window.parent!==window){const x=window.parent.eval("typeof inc!='undefined'?inc:null");if(Array.isArray(x))L=x}}catch(_){}
 if(!L.length)L=JSON.parse(localStorage.getItem("pbb_inc")||"[]");return L.find(o=>o&&String(o.orden)==="611200")||L.find(o=>o&&String(o.pos)==="586"&&o.estado==="abierta")||null}catch(e){return null}}
const ruta=()=>{const a=anc(S.dst).reverse().filter(x=>sub(S.org).includes(x));return [...a,S.dst]};
const vista=()=>{const r=ruta();const s=sub(S.dst).slice(1);return {r,s}};
const protsVista=()=>{const {r,s}=vista();return [...r,...s].filter(id=>N[id].tipo==="prot")};

/* ---------- pintado ---------- */
const st=document.createElement("style");st.textContent=`
#sim .sh{font:700 18px var(--f-disp);letter-spacing:.4px;margin:2px 0 6px;display:flex;align-items:center;gap:8px}
#sim .sh b{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:6px;background:var(--accent);color:#fff;font-size:14px}
#sim .sbx{border:1px solid var(--line);border-radius:10px;padding:10px;margin:0 0 10px;background:var(--panel)}
#sim .scaso{font-size:14px;line-height:1.4}#sim .scaso q{display:block;margin:6px 0;padding:8px 10px;border-left:3px solid var(--warn);background:var(--warnBg);border-radius:6px;quotes:none;font-style:italic}
#sim .srow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:4px 0}#sim .srow label{font-size:13px;color:var(--muted);min-width:56px}
#sim select{font:500 15px var(--f-body);padding:8px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--fg);flex:1;min-width:0;max-width:100%}
#sim .nod{position:relative;margin:0 0 0 14px;padding:8px 8px 8px 12px;border:1px solid var(--line);border-radius:8px;background:var(--bg);transition:background .25s,border-color .25s}
#sim .lnk{margin-left:24px;height:12px;border-left:3px solid var(--line)}
#sim .nod.sub{margin-left:34px}#sim .nod.sub2{margin-left:54px}
#sim .ntop{display:flex;align-items:flex-start;gap:8px}#sim .nnm{font:700 15px var(--f-mono)}#sim .ntx{font-size:12.5px;color:var(--muted);line-height:1.3}
#sim .nu{font:600 11px var(--f-mono);padding:1px 6px;border-radius:5px;background:var(--deadBg);color:var(--muted);white-space:nowrap}
#sim .nck{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12.5px;white-space:nowrap}#sim .nck input{width:22px;height:22px;accent-color:var(--ok)}
#sim .nod select{margin-top:6px;width:100%;font-size:14px;border-color:var(--live)}
#sim .nod.fal{border-color:var(--live);border-width:2px}
#sim .nod.flow{background:var(--okBg);border-color:var(--ok)}#sim .nod.vivo{background:var(--okBg)}#sim .nod.muerto{background:var(--deadBg);opacity:.85}
#sim .nod.trip{background:var(--liveBg);border-color:var(--live);animation:sTrip 1s ease-in-out 3}
#sim .nod.sos{border:3px solid #f59e0b;box-shadow:0 0 0 4px rgba(245,158,11,.25);animation:sSos 1.2s ease-in-out infinite}
#sim .nod .est{display:inline-block;margin-top:4px;font:700 12px var(--f-mono);padding:2px 7px;border-radius:5px}
#sim .est.v{background:var(--okBg);color:var(--ok)}#sim .est.m{background:var(--deadBg);color:var(--dead)}#sim .est.t{background:var(--liveBg);color:var(--live)}#sim .est.s{background:#f59e0b;color:#111}
#sim .ctl{margin:4px 0 0 22px;padding:6px 8px;border:1px dashed var(--line);border-radius:8px}#sim .ctl .nod{margin:4px 0}
#sim .ctlh{font:700 12px var(--f-mono);color:var(--accent)}
#sim .man label{display:flex;align-items:center;gap:8px;font-size:14px;padding:5px 0}#sim .man input{width:22px;height:22px}
#sim .sbt{display:flex;gap:8px;margin:10px 0}#sim .sbt button{flex:1;padding:14px 6px;border-radius:10px;border:0;font:800 17px var(--f-disp);letter-spacing:1px;color:#fff;cursor:pointer}
#sim .bmar{background:linear-gradient(135deg,#16a34a,#15803d)}#sim .bana{background:linear-gradient(135deg,#f59e0b,#ea580c)}#sim .bsec{background:var(--deadBg)!important;color:var(--fg)!important;font-size:13px!important;flex:0 0 auto!important;padding:10px!important}
#sim .obs label{display:flex;align-items:center;gap:8px;font-size:14px;padding:4px 0;flex-wrap:wrap}#sim .obs input{width:22px;height:22px;accent-color:var(--live)}#sim .obs select{flex:0 1 auto;font-size:13px;padding:5px}
#sim .log{font-size:13.5px;line-height:1.4}#sim .log .lc{font-weight:700;color:var(--accent);margin-top:6px}#sim .log .lt{padding-left:10px;border-left:3px solid var(--line);margin:2px 0}#sim .log .lt.r{border-color:var(--live);color:var(--live);font-weight:600}
#sim .ver{padding:8px 10px;border-radius:8px;font-weight:700;margin:8px 0}#sim .ver.ok{background:var(--okBg);color:var(--ok)}#sim .ver.no{background:var(--liveBg);color:var(--live)}
#sim .hip{border:1px solid var(--line);border-radius:8px;padding:8px 10px;margin:6px 0}#sim .hip.top{border:2px solid #f59e0b}
#sim .hip h4{margin:0 0 4px;font:700 15px var(--f-body)}#sim .hip ol{margin:4px 0 0;padding-left:20px;font-size:13.5px}#sim .hip li{margin:3px 0}
#sim .pct{font:700 12px var(--f-mono);padding:1px 6px;border-radius:5px;background:#f59e0b;color:#111;margin-left:6px}
#sim .nota{font-size:12.5px;color:var(--muted);margin-top:6px}
@keyframes sTrip{0%,100%{box-shadow:none}50%{box-shadow:0 0 0 5px rgba(239,68,68,.35)}}@keyframes sSos{0%,100%{box-shadow:0 0 0 3px rgba(245,158,11,.2)}50%{box-shadow:0 0 0 7px rgba(245,158,11,.45)}}`;
document.head.appendChild(st);

const UL={"400":"400 V","230":"230 V","24ac":"24 V~","24dc":"24 V="};
function nodo(id,cls){const n=N[id],f=S.F[id],m=modos(n),r=S.res,a=S.ana;
 let est="";if(r&&n.tipo!=="ctrl"){if(r.trip[id])est=`<span class="est t">DISPARADO ${E(MOM[r.trip[id]])}</span>`;else est=r.vivo[id]?`<span class="est v">CON TENSIÓN</span>`:`<span class="est m">SIN TENSIÓN</span>`}
 const sos=a&&a.top.includes(id);if(sos)est+=` <span class="est s">PUNTO SOSPECHOSO</span>`;
 const c=[cls||"",f?"fal":"",r&&n.tipo!=="ctrl"?(r.trip[id]?"trip":r.vivo[id]?"vivo":"muerto"):"",sos?"sos":""].join(" ");
 return `<div class="nod ${c}" data-n="${id}"><div class="ntop"><div><div class="nnm">${E(n.nm)} ${n.u?`<span class="nu">${UL[n.u]||""}</span>`:""}</div><div class="ntx">${E(n.t||"")}${n.d?" · "+E(n.d):""}${n.f?" · folio "+n.f:""}</div>${est}</div>
  ${Object.keys(m).length?`<label class="nck"><input type="checkbox" data-ok="${id}" ${f?"":"checked"}> funciona</label>`:""}</div>
  ${f?`<select data-mo="${id}">${Object.entries(m).map(([k,v])=>`<option value="${k}" ${k===f?"selected":""}>${E(v)}</option>`).join("")}</select>`:""}</div>`}
function pinta(){const box=$("#sim");if(!box)return;const {r,s}=vista();const ot=ot586();
 const orgs=Object.values(N).filter(n=>n.tipo==="fuente");
 const dsts=Object.values(N).filter(n=>n.tipo!=="ctrl"&&n.tipo!=="fuente"&&sub(S.org).includes(n.id));
 let h=`<div class="sbx scaso"><div class="sh"><b>0</b>Caso</div>
  <div class="srow"><select id="s_caso"><option value="586" ${S.caso==="586"?"selected":""}>PBB 586 · OT 611200 · E-Q15 y E-Q15.1 saltan al encender (real campo)</option><option value="lib" ${S.caso==="lib"?"selected":""}>Simulación libre</option></select></div>
  ${S.caso==="586"?`<q>${E(ot?ot.desc:"Pasarela no enciende. E-Q15 y E-Q15.1 saltan cuando se enciende la pasarela.")}${ot&&ot.sosAct&&ot.sosAct.ob&&/fogonazo/i.test(ot.sosAct.ob)?"<br>"+E(ot.sosAct.ob.split("\n").slice(1).join(" ")):"<br>· Rearmo los automáticos y cuando se enciende da un fogonazo el E-Q15 y cae."}</q>
  <div class="nota">Cargado como «Observado en campo» (punto 4). Ya probado en campo: los focos y el trafo cuelgan de E-Q15; las luces flash van a 24 V y no influyen.</div>`:""}</div>
 <div class="sbx"><div class="sh"><b>1</b>Recorrido</div>
  <div class="srow"><label>Origen</label><select id="s_org">${orgs.map(n=>`<option value="${n.id}" ${n.id===S.org?"selected":""}>${E(n.t)}</option>`).join("")}</select></div>
  <div class="srow"><label>Destino</label><select id="s_dst">${dsts.map(n=>`<option value="${n.id}" ${n.id===S.dst?"selected":""}>${E(n.nm)} · ${E((n.t||"").replace(/^\+\S+\s*/,"").slice(0,60))}</option>`).join("")}</select></div>
  <div class="nota">Desmarca «funciona» en los elementos que quieras hacer fallar (puedes marcar varios) y elige cómo fallan.</div></div>
 <div class="sbx"><div class="sh"><b>2</b>Circuito · activos y averiados</div>`;
 r.forEach((id,i)=>{h+=(i?`<div class="lnk"></div>`:"")+nodo(id);if(CTRL[id])h+=`<div class="ctl"><div class="ctlh">Mando de ${E(N[id].nm)}</div>${CTRL[id].map(c=>nodo(c.id)).join("")}</div>`});
 if(s.length){h+=`<div class="lnk"></div>`;s.forEach(id=>{const d=anc(id).indexOf(S.dst);h+=nodo(id,d<=0?"sub":"sub2");if(CTRL[id])h+=`<div class="ctl">${CTRL[id].map(c=>nodo(c.id)).join("")}</div>`})}
 h+=`</div><div class="sbx man"><div class="sh"><b>3</b>Maniobra</div>
  <label><input type="checkbox" data-man="act" ${S.man.act?"checked":""}> Activar la PBB (el PLC da la orden de iluminación exterior → E-K15)</label>
  <label><input type="checkbox" data-man="p291" ${S.man.p291?"checked":""}> Prueba: hilo 291 suelto en E-A0 2.4 (E-K15 sin orden)</label>
  <label><input type="checkbox" data-man="rato" ${S.man.rato?"checked":""}> Dejar en servicio un rato</label>
  <label><input type="checkbox" data-man="mover" ${S.man.mover?"checked":""}> Mover la pasarela (telescopar / girar cabina)</label>
  <div class="sbt"><button class="bmar" id="s_mar">▶ MARCHA</button><button class="bsec" id="s_lim">Todo funciona</button></div>
  ${S.res?resHTML():""}</div>
 <div class="sbx obs"><div class="sh"><b>4</b>Observado en campo</div>
  ${protsVista().map(id=>`<label><input type="checkbox" data-ob="${id}" ${S.obs.trip[id]?"checked":""}> ${E(N[id].nm)} salta ${S.obs.trip[id]?`<select data-obm="${id}">${[1,2,3,4].map(k=>`<option value="${k}" ${+S.obs.trip[id]===k?"selected":""}>${MOM[k]}</option>`).join("")}</select>`:""}</label>`).join("")}
  <label>Con el hilo 291 suelto (prueba del PDF): <select data-p291><option value="" ${!S.obs.p291?"selected":""}>sin hacer</option><option value="no" ${S.obs.p291==="no"?"selected":""}>no salta nada</option><option value="si" ${S.obs.p291==="si"?"selected":""}>sigue saltando</option></select></label>
  <label><input type="checkbox" data-fog ${S.obs.fog?"checked":""}> Fogonazo en E-Q15</label>
  <div class="sbt"><button class="bana" id="s_ana">🔍 ANALIZAR</button></div>${S.ana?anaHTML():""}</div>`;
 box.innerHTML=h}
function resHTML(){const r=S.res;const o=S.obs.trip,ks=Object.keys(o);
 const coinc=ks.length?ks.every(k=>r.trip[k]&&(+r.trip[k]===+o[k]))&&Object.keys(r.trip).every(k=>o[k]):null;
 let h=`<div class="log">`;r.ev.forEach(e=>{h+=e.cab?`<div class="lc">${E(MOM[e.f]?e.tx:e.tx)}</div>`:`<div class="lt ${/dispara|cae/.test(e.tx)?"r":""}">${E(e.tx)}</div>`});
 if(!Object.keys(r.trip).length)h+=`<div class="lt">No dispara ninguna protección.</div>`;h+=`</div>`;
 /* v971: avisos de configuración y comparación solo cuando la maniobra es la misma que en campo */
 const nF=Object.keys(S.F).length;
 if(!nF)h+=`<div class="nota">ℹ️ No has marcado ninguna avería en el bloque 2: el circuito está sano y por eso no salta nada. Quita «funciona» en el elemento que quieras probar.</div>`;
 if(!S.man.act)h+=`<div class="nota">ℹ️ «Activar la PBB» está sin marcar: solo se ha simulado el rearme. En la 586 salta al activar.</div>`;
 const salta=Object.keys(r.trip).length>0;
 if(S.man.p291){if(S.obs.p291)h+=`<div class="ver ${(S.obs.p291==="si")===salta?"ok":"no"}">${(S.obs.p291==="si")===salta?"✅ Coincide con tu prueba del hilo 291 en campo":"✖ No coincide con tu prueba del hilo 291 en campo"}</div>`;
  else h+=`<div class="ver" style="background:var(--deadBg)">🔎 Así debería quedar la prueba del hilo 291 con esta avería: ${salta?"seguiría saltando":"no salta nada"}. Cuando la hagas en campo, márcala en el bloque 4.</div>`}
 else if(S.man.act&&coinc!==null)h+=`<div class="ver ${coinc?"ok":"no"}">${coinc?"✅ Tu simulación da los mismos síntomas que lo observado en campo":"✖ Tu simulación NO da lo observado en campo"}</div>`;return h}
function anaHTML(){const a=S.ana;if(!a.L.length)return `<div class="ver no">Ninguna avería del recorrido da exactamente esos síntomas. Revisa lo marcado en «Observado» o amplía el destino.</div>`;
 const tot=a.L.reduce((s,x)=>s+x.w,0);
 let h=`<div class="ver ok">${a.L.length} avería${a.L.length>1?"s":""} posible${a.L.length>1?"s":""} con esos síntomas · marcadas en el recorrido</div>`;
 const vis={};a.G.slice(0,8).forEach((g,i)=>{const n=N[g.id],k=n.tipo+(n.foco?"f":"")+g.modos.join();const ya=vis[k];if(!ya)vis[k]=i+1;
  h+=`<div class="hip ${i===0?"top":""}"><h4>${i+1}. ${E(g.nm)}<span class="pct">${Math.round(100*g.w/tot)} %</span></h4><div class="ntx">${E(g.modos.join(" · "))}</div>${ya?`<div class="nota">Mismas comprobaciones que el n.º ${ya}${n.caja?" · en "+E(n.caja):""}.</div>`:`<ol>${g.chk.map(c=>`<li>${c}</li>`).join("")}</ol>`}</div>`});
 if(a.sig)h+=`<div class="hip"><h4>➡️ Siguiente prueba que más acota</h4><div>${a.sig}</div></div>`;return h}

/* ---------- comprobaciones de campo ---------- */
function chk(id,m){const n=N[id],cons="Con E-Q15.1 abierto y el circuito consignado";
 if(n.tipo==="carga"&&n.foco)return [`${cons}: suelta los dos hilos del foco ${E(n.nm)} en ${E(n.caja)} y mide Ω entre ellos: lámpara buena en frío ≈ 10-20 Ω · <b>≈ 0 Ω = corto</b> · OL = fundida.`,
  `Megóhmetro a 500 V del foco a tierra (carcasa): > 1 MΩ. Menos → derivación en el portalámparas.`,`Abre el foco: lámpara ennegrecida o rota, portalámparas quemado, bornas carbonizadas.`];
 if(n.tipo==="cond")return [`${cons}: suelta el ramal en ${E(n.nm.split(" → ")[0])} y en ${E(n.caja||"la caja de destino")}; megóhmetro a 500 V entre conductores y a tierra: > 1 MΩ.`,
  n.mov?`Repite la medida moviendo la pasarela (${/EET/.test(n.nm)?"telescopando el túnel":"girando la cabina"}): un pellizco da la caída solo en una posición.`:`Revisa aprietes y el estado de las bornas del recorrido.`,
  `Reconecta el ramal y prueba encendiendo con los demás ramales sueltos: si salta solo con este, está aquí.`];
 if(n.tipo==="cont")return [`${cons}: con E-K15 en reposo, Ω entre los polos de salida (2-4): debe dar OL; ≈ 0 Ω con los ramales sueltos → contactor en corto.`,
  `Revisa contactos picados o con restos de arco y las bornas de salida.`,`Bobina A1-A2: 24 VDC al activar; resistencia de la bobina coherente (no 0 Ω).`];
 if(n.tipo==="trafo")return [`Con E-Q15 abierto: suelta P-X52:4-5-6 y mide aislamiento del primario a masa y entre primario y secundario (> 1 MΩ).`,`Resistencia de los tres bobinados del primario: iguales entre fases.`,`Un corto en el trafo hace saltar E-Q15 nada más rearmar, sin esperar a activar la PBB.`];
 if(n.tipo==="prot")return [`Rearma ${E(n.nm)} con la salida suelta: si dispara sin carga → ${E(n.nm)} averiado, sustituir por otro igual.`,`Mide ${UL[n.u]||""} en la entrada y en la salida con la maneta en ON.`];
 if(n.tipo==="ctrl")return [`Activa la PBB: LED E-A0 mód. 2 LED 4 encendido = el PLC da la orden.`,`Mide 24 VDC entre E-K15 A1 (hilo 291) y A2 (205) al activar.`];
 return [`Mide ${UL[n.u]||""} en ${E(n.nm)} y compáralo con el valor esperado.`]}

/* ---------- análisis por hipótesis ---------- */
function analiza(){const O=S.obs,ks=Object.keys(O.trip);const {r,s}=vista();
 const cand=[...r,...s,...Object.values(CTRL).flat().map(c=>c.id).filter(c=>[...r,...s].includes(N[c].de))].filter(id=>N[id].tipo!=="fuente");
 const iguales=R=>{const T=R.trip;if(!ks.every(k=>T[k]&&+T[k]===+O.trip[k]))return false;if(Object.keys(T).some(k=>!O.trip[k]))return false;if(O.fog&&!R.fog)return false;return true};
 const man={act:true,p291:false,rato:ks.some(k=>+O.trip[k]===3),mover:ks.some(k=>+O.trip[k]===4)};
 const prueba=F=>{if(!iguales(simula(F,man)))return false;
  if(O.p291){const R2=simula(F,Object.assign({},man,{p291:true}));const salta=Object.keys(R2.trip).length>0;if((O.p291==="si")!==salta)return false}return true};
 const L=[];cand.forEach(id=>Object.keys(modos(N[id])).forEach(m=>{const F={[id]:m};if(prueba(F))L.push({ids:[id],m:[m],w:PESO(N[id],m)})}));
 if(!L.length){const sh=cand.filter(id=>modos(N[id]).corto||modos(N[id]).deriv);for(let i=0;i<sh.length&&L.length<30;i++)for(let j=i+1;j<sh.length;j++){
  for(const m1 of Object.keys(modos(N[sh[i]])))for(const m2 of Object.keys(modos(N[sh[j]]))){const F={[sh[i]]:m1,[sh[j]]:m2};if(prueba(F))L.push({ids:[sh[i],sh[j]],m:[m1,m2],w:PESO(N[sh[i]],m1)*PESO(N[sh[j]],m2)/4})}}}
 const G={};L.forEach(x=>x.ids.forEach((id,k)=>{const g=G[id]=G[id]||{id,nm:N[id].nm+" · "+(N[id].t||"").replace(/^\+\S+\s*/,""),w:0,modos:[],chk:chk(id,x.m[k])};g.w+=x.w;const mm=MODOS[N[id].tipo][x.m[k]];if(!g.modos.includes(mm))g.modos.push(mm)}));
 const GL=Object.values(G).sort((a,b)=>b.w-a.w);const top=GL.length?GL.filter(g=>g.w>=GL[0].w*.6).map(g=>g.id):[];
 /* siguiente prueba: la que mejor separa las hipótesis */
 let sig="";const zonas=new Set(GL.map(g=>sub("k15").includes(g.id)&&g.id!=="k15"?"focos":g.id));
 if(!O.p291&&GL.some(g=>sub("k15").includes(g.id)))sig=`Suelta el <b>hilo 291 en E-A0 2.4</b> y activa la PBB (PDF de la prueba). <b>No salta</b> → la avería está detrás de E-K15 (focos o ramales). <b>Salta</b> → entre E-Q15.1 y E-K15, o en E-K15.`;
 else if(zonas.has("focos"))sig=`Separa los ramales en <b>E-X54</b> (túnel), <b>E-X59</b> (bajo cabina) y <b>E-X57</b> (exterior cabina) y conéctalos de uno en uno activando la PBB: el que hace saltar E-Q15.1 es el averiado; dentro, quita lámparas de una en una.`;
 S.ana={L,G:GL,top,sig}}

/* ---------- animación de MARCHA ---------- */
function marcha(){S.ana=null;S.res=null;pinta();const {r,s}=vista();const orden=[...r,...s];const k=++S.anim;let i=0;
 const paso=()=>{if(k!==S.anim)return;const el=document.querySelector(`#sim .nod[data-n="${orden[i]}"]`);if(el){el.classList.add("flow");el.scrollIntoView({block:"nearest",behavior:"smooth"})}
  if(++i<orden.length)setTimeout(paso,220);else setTimeout(()=>{if(k!==S.anim)return;S.res=simula(S.F,S.man);pinta();const t=document.querySelector("#sim .nod.trip")||document.querySelector("#sim .log");if(t)t.scrollIntoView({block:"center",behavior:"smooth"})},350)};paso()}

/* ---------- eventos ---------- */
document.addEventListener("change",e=>{const t=e.target;if(!t.closest||!t.closest("#sim"))return;
 if(t.id==="s_caso"){if(t.value==="586")caso586();else{S.caso="lib";S.obs={trip:{},p291:"",fog:false};S.res=null;S.ana=null}pinta();return}
 if(t.id==="s_org"){S.org=t.value;if(!sub(S.org).includes(S.dst))S.dst=(HIJ[S.org]||[S.org])[0];S.res=S.ana=null;pinta();return}
 if(t.id==="s_dst"){S.dst=t.value;S.res=S.ana=null;pinta();return}
 if(t.dataset.ok){const id=t.dataset.ok;if(t.checked)delete S.F[id];else S.F[id]=Object.keys(modos(N[id]))[N[id].foco||N[id].tipo==="cond"?1:0]||Object.keys(modos(N[id]))[0];S.res=null;pinta();return}
 if(t.dataset.mo){S.F[t.dataset.mo]=t.value;S.res=null;pinta();return}
 if(t.dataset.man){S.man[t.dataset.man]=t.checked;S.res=null;pinta();return}
 if(t.dataset.ob){if(t.checked)S.obs.trip[t.dataset.ob]=2;else delete S.obs.trip[t.dataset.ob];S.ana=null;pinta();return}
 if(t.dataset.obm){S.obs.trip[t.dataset.obm]=+t.value;S.ana=null;pinta();return}
 if(t.hasAttribute("data-p291")){S.obs.p291=t.value;S.ana=null;pinta();return}
 if(t.hasAttribute("data-fog")){S.obs.fog=t.checked;S.ana=null;pinta();return}});
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#sim button");if(!b)return;
 if(b.id==="s_mar")marcha();else if(b.id==="s_lim"){S.F={};S.res=null;pinta()}
 else if(b.id==="s_ana"){analiza();S.res=null;pinta();const h=document.querySelector("#sim .hip.top")||document.querySelector("#sim .obs .ver");if(h)h.scrollIntoView({block:"center",behavior:"smooth"})}});

/* ---------- pestaña nueva, la primera ---------- */
const tabs=$("#tabs"),scr=$("#scr");if(!tabs||!scr)return;
const bt=document.createElement("button");bt.dataset.v="sim";bt.innerHTML="Simular avería<small>Configura · MARCHA · ANALIZAR</small>";tabs.prepend(bt);
const sec=document.createElement("section");sec.className="box";sec.id="sim";sec.hidden=true;scr.prepend(sec);
caso586();
const ps=window.pshow||pshow;window.pshow=pshow=function(){const r=ps.apply(this,arguments);const on=pview==="sim";sec.hidden=!on;bt.classList.toggle("sel",on);if(on){["#pot","#es","#bor"].forEach(s=>{const x=$(s);if(x)x.hidden=true});pinta()}return r};
/* entrar directo en la simulación cuando se abre el simulador */
if(!pview){pview="sim";pshow()}
window.simAveria={N,simula,S,analiza};
})();
