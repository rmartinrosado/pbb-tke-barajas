/* ===== v344: zona «Resolución Claude» en la ficha de la OT =====
   La respuesta de Claude (proyecto PBB TKE) a la Resolución IA se guarda en la OT (campo datos.resClaude
   de la tabla incidencias: {txt, ts, por}) y se muestra en la ficha con formato técnico: apartados,
   pasos numerados, tablas y notas. Claude la escribe directamente en Supabase; en la Resolución IA
   también se puede pegar a mano la respuesta copiada de Claude. */
(function(){
 const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const inl=s=>E(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`([^`]+)`/g,'<code class="rcC">$1</code>').replace(/(^|[\s(])_([^_]+)_(?=[\s).,;:]|$)/g,"$1<i>$2</i>");
 /* Markdown sencillo → HTML (##, ###, 1., -, tablas |, ---, párrafos) */
 function md(t){
  const L=String(t||"").replace(/\r/g,"").split("\n");let h="",i=0;
  while(i<L.length){let l=L[i];const s=l.trim();
   if(!s){i++;continue}
   if(/^-{3,}$|^\*{3,}$/.test(s)){h+='<hr class="rcHr">';i++;continue}
   let m;
   if(m=s.match(/^(#{1,3})\s+(.*)$/)){const n=m[1].length,pr=/primera actuaci/i.test(m[2]);
    h+=`<div class="rcH${n} ${pr?"rcPri":""}">${pr?"⚡ ":""}${inl(m[2])}</div>`;i++;continue}
   if(/^\|/.test(s)){const rows=[];while(i<L.length&&/^\|/.test(L[i].trim())){rows.push(L[i].trim());i++}
    const cel=r=>r.replace(/^\||\|$/g,"").split("|").map(x=>x.trim());
    const body=rows.filter(r=>!/^\|?\s*:?-{2,}/.test(r.replace(/\|/g,"|").replace(/^\|/,"")));
    h+='<div class="rcTw"><table class="rcT">'+body.map((r,k)=>"<tr>"+cel(r).map(c=>k?`<td>${inl(c)}</td>`:`<th>${inl(c)}</th>`).join("")+"</tr>").join("")+"</table></div>";continue}
   if(/^\d+[.)]\s+/.test(s)){let o='<ol class="rcOl">';
    while(i<L.length&&(/^\d+[.)]\s+/.test(L[i].trim())||(/^\s{2,}\S/.test(L[i])&&!/^\s*$/.test(L[i])))){const x=L[i].trim();
     if(/^\d+[.)]\s+/.test(x))o+=`<li>${inl(x.replace(/^\d+[.)]\s+/,""))}</li>`;else o=o.replace(/<\/li>$/,"<br>"+inl(x.replace(/^[-*]\s+/,"· "))+"</li>");i++}
    h+=o+"</ol>";continue}
   if(/^[-*•]\s+/.test(s)){let u='<ul class="rcUl">';while(i<L.length&&/^\s*[-*•]\s+/.test(L[i])){u+=`<li>${inl(L[i].trim().replace(/^[-*•]\s+/,""))}</li>`;i++}h+=u+"</ul>";continue}
   let p=[];while(i<L.length&&L[i].trim()&&!/^(#{1,3}\s|\||\d+[.)]\s|[-*•]\s|-{3,}$)/.test(L[i].trim())){p.push(L[i].trim());i++}
   const tx=p.join(" ");h+=/^planos?:/i.test(tx.replace(/\*/g,""))?`<div class="rcPl">📐 ${inl(tx)}</div>`:`<p class="rcP">${inl(tx)}</p>`}
  return h}
 window.rcMd=md;
 const ab=new Set();
 window.rcTog=(id,o)=>{o?ab.add(id):ab.delete(id)};
 const fch=ts=>{try{const d=new Date(ts);return d.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})+" "+d.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}catch(e){return""}};
 function bloque(i){const r=i.resClaude;if(!r||!(r.txt||"").trim())return"";
  const ed=(typeof tecnico!="undefined"&&tecnico)||(typeof admin!="undefined"&&admin);
  return `<details class="rcBox" ${ab.has(i.id)?"open":""} ontoggle="rcTog('${i.id}',this.open)" onclick="event.stopPropagation()">
  <summary class="rcSum"><img src="claude-logo.png" alt=""><span class="rcSt"><b>Resolución Claude AI</b><small>PBB ${E(i.pos)} · ${E(i.tipo)} · OT ${E(i.orden)}${r.ts?" · "+fch(r.ts):""}</small></span><span class="rcChev">▾</span></summary>
  <div class="rcBody">${md(r.txt)}
  <div class="rcFoot"><span>Análisis IA cotejado con la documentación del proyecto PBB TKE. Verificar en campo.</span>${ed?`<button class="sec rcDel" title="Borrar resolución Claude" aria-label="Borrar resolución Claude" onclick="event.stopPropagation();rcBorra('${i.id}')">🗑</button>`:""}</div></div></details>`}
 window.rcBorra=id=>{const i=inc.find(x=>x.id==id);if(!i||!i.resClaude)return;if(!confirm(`¿Borrar la resolución Claude de la OT ${i.orden}?`))return;delete i.resClaude;window.rcBorrar&&rcBorrar.add(i.id);sv("pbb_inc",inc);render();msg("Resolución Claude borrada")};
 /* Ficha de OT: la zona va antes de la fila de botones */
 const oc=card;card=function(i){const h=oc.apply(this,arguments);const b=i&&bloque(i);if(!b)return h;
  const k=h.lastIndexOf('<div class="cacts">');return k>=0?h.slice(0,k)+b+h.slice(k):h.replace(/<\/div>\s*$/,b+"</div>")};
 /* Resolución IA: caja para pegar la respuesta de Claude y guardarla en la OT */
 const orT=resTec;resTec=function(sel){const r=orT.apply(this,arguments);try{
  const s=$("#t_sel");if(!s)return r;const i=inc.find(x=>x.id==s.value);if(!i)return r;const sc=$("#sheetc");if(!sc||$("#rc_txt"))return r;
  const d=document.createElement("div");d.className="rcEd";
  d.innerHTML=`<label>Resolución Claude ${i.resClaude?'<span class="rcOk">● guardada</span>':""}</label><textarea id="rc_txt" rows="4" placeholder="Pega aquí la respuesta de Claude para verla en la ficha de la OT">${E(i.resClaude&&i.resClaude.txt)}</textarea>
  <div class="grid" style="margin-top:6px"><button class="sec" onclick="rcPega()">Pegar</button><button class="pri" onclick="rcGuarda()">Guardar en la OT</button></div>`;
  const cl=sc.querySelector('button[aria-label="Instrucciones IA"]');cl?cl.parentNode.insertBefore(d,cl.nextSibling):sc.appendChild(d)}catch(e){}return r};
 window.rcPega=async()=>{try{const t=await navigator.clipboard.readText();if(t)$("#rc_txt").value=t;else msg("Portapapeles vacío")}catch(e){msg("No se pudo leer el portapapeles: pega con pulsación larga")}};
 window.rcGuarda=()=>{const s=$("#t_sel"),t=$("#rc_txt");if(!s||!t)return;const i=inc.find(x=>x.id==s.value);if(!i)return;const v=t.value.trim();
  if(v)i.resClaude={txt:v,ts:Date.now(),por:(typeof tecNombre!="undefined"&&tecNombre)||"Claude"};else{delete i.resClaude;window.rcBorrar&&rcBorrar.add(i.id)}
  ab.add(i.id);sv("pbb_inc",inc);msg(v?"Resolución Claude guardada en la OT "+i.orden:"Resolución Claude borrada");closeSheet();render()};
 const st=document.createElement("style");st.textContent=`
.rcBox{margin:10px 0 4px;border:1px solid rgba(217,119,87,.55);border-left:4px solid #d97757;border-radius:12px;background:linear-gradient(180deg,rgba(217,119,87,.10),rgba(217,119,87,.03));overflow:hidden}
.rcSum{display:flex;align-items:center;gap:10px;padding:9px 12px;cursor:pointer;list-style:none}
.rcSum::-webkit-details-marker{display:none}
.rcBox>summary.rcSum::after{content:none!important;display:none!important}
.rcSum img{width:30px;height:30px;flex:0 0 30px;border-radius:7px}
.rcSt{display:flex;flex-direction:column;line-height:1.2;flex:1;min-width:0}
.rcSt b{font-size:15px;letter-spacing:.3px;color:#d97757}
.rcSt small{font-size:11px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
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
.rcEd{margin-top:10px}.rcOk{color:#2e7d32;font-size:12px;margin-left:6px}`;
 document.head.appendChild(st);
 try{render()}catch(e){}
})();
