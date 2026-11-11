/* ===== v421-v422 (v422: enchufe debajo de la PBB; horas siempre en la misma columna, con primera y tercera columna de ancho fijo): Seguimiento OT · en la primera línea de cada caja, junto a «PBB nnn [tipo]», la descripción de la OT
   alineada a la izquierda (hasta 2 líneas, el resto con «…»). El recuadro de horas y el estado (ABIERTA / CERRADA /
   S/CONDICIONES) bajan a la segunda línea (la fecha y «Reportado por» a la izquierda), a la altura de la fecha y «Reportado por». ===== */
(function(){if(typeof card!="function")return;
 const st=document.createElement("style");st.textContent=`
#app .card.ot>.row.ohdx{display:grid!important;grid-template-columns:minmax(124px,max-content) minmax(0,1fr) 104px!important;column-gap:10px;row-gap:4px;align-items:center}
#app .card.ot>.row.ohdx>b{grid-column:1!important;grid-row:1!important;align-self:center!important;flex-wrap:nowrap!important}
#app .card.ot>.row.ohdx>.ohdesc{grid-column:2/-1;grid-row:1;align-self:center;text-align:left;font-size:14px;font-weight:600;line-height:1.25;
 display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:normal;overflow-wrap:anywhere;hyphens:none}
#app .card.ot>.row.ohdx>.ohsubw{grid-column:1;grid-row:2/span 2;align-self:start;display:flex;flex-direction:row;align-items:center;gap:8px;text-align:left;padding-top:6px}
#app .card.ot>.row.ohdx>.ohsubw>.ohsubs{display:flex;flex-direction:column;align-items:flex-start;gap:1px}
#app .card.ot>.row.ohdx>.ohsubw>.pactt{flex:none;margin:0}
#app .card.ot>.row.ohdx>.ohsubw small.ohsub{font-size:11.5px;font-weight:600;color:var(--mu,#666);white-space:nowrap;letter-spacing:.2px}
#app .card.ot>.row.ohdx>.ohm{grid-column:2!important;grid-row:2!important;justify-content:center!important;margin-top:6px}
#app .card.ot>.row.ohdx>.ce,#app .card.ot>.row.ohdx>.espw{grid-column:3!important;grid-row:2!important;align-self:center;justify-self:end;margin-top:6px}
#app .card.ot>.row.ohdx.ohrow>.espw{display:contents!important}
#app .card.ot>.row.ohdx.ohrow>.espw>.ab,#app .card.ot>.row.ohdx.ohrow>.espw>.esptag{grid-column:3!important;grid-row:2!important;align-self:center!important;justify-self:center;margin-top:6px}
#app .card.ot>.row.ohdx.ohrow>.espw>.espb{grid-column:2!important;grid-row:3!important;justify-self:center;margin:0}
#app .card.ot>.row.ohdx.ohrow>.espw::after{grid-column:3!important;grid-row:3!important;justify-self:center;align-self:start;text-align:center;margin:0!important;line-height:1}
#app .card.ot>.row.ohdx>:not(b):not(.ohdesc):not(.ohsubw):not(.ohm):not(.espw):not(.ce){grid-column:1/-1}`;
 document.head.appendChild(st);
 const o=card;card=function(i){const h=o.apply(this,arguments);try{if(typeof view=="undefined"||view!="track"||!i)return h;
  const d=String(i.desc||"").trim();
  const a=h.indexOf('<b class="ohb2">');if(a<0)return h;const k=h.indexOf("</b>",a);if(k<0)return h;
  const cab=h.slice(a+16,k);const j=cab.indexOf('<small class="ohsub"');
  let pbb=j>=0?cab.slice(0,j):cab,subs=j>=0?cab.slice(j):"";
  /* v422: el enchufe (primera actuación en campo) va debajo de «PBB nnn», junto a la fecha y «Reportado por» */
  let ic="";pbb=pbb.replace(/<span class="pactt"[^>]*>[\s\S]*?<\/span>/,m=>{ic=m;return ""});
  const r0=h.lastIndexOf('<div class="row"',a);
  let out=h.slice(0,a)+'<b class="ohb2">'+pbb+'</b>'+(d?`<div class="ohdesc" title="${esc(d)}">${esc(d)}</div>`:"")+(subs||ic?`<div class="ohsubw">${ic}${subs?`<div class="ohsubs">${subs}</div>`:""}</div>`:"")+h.slice(k+4);
  if(r0>=0&&r0<a)out=out.slice(0,r0)+'<div class="row ohdx"'+out.slice(r0+16);
  return out}catch(e){return h}};
})();
