/* ===== v606: papelera a la derecha de «Comentario:» y de «Obs.:» en la ficha de la OT, para borrarlos desde la propia ficha
   (igual que la papelera de «Actuación:»). Pide confirmación; visible en modo Técnico y Admin. ===== */
(function(){
 if(typeof card!=="function")return;
 const st=document.createElement("style");
 st.textContent=`.cmlin{display:flex;align-items:flex-start;gap:8px}.cmlin>.mu{flex:1;min-width:0}.cmlin>.cmdel{flex:none;height:38px;margin:4px 0 0}`;
 document.head.appendChild(st);
 const CAMPOS={com:{rot:"Comentario:",nom:"el comentario",ok:"Comentario borrado"},obs:{rot:"Obs.:",nom:"las observaciones",ok:"Observaciones borradas"}};
 window.delCampoOT=function(id,k){
  const c=CAMPOS[k];const i=(typeof inc!=="undefined"?inc:[]).find(x=>x.id==id);if(!c||!i||!i[k])return;
  if(!confirm(`¿Borrar ${c.nom} de la OT ${i.orden||""}?`))return;
  i[k]="";sv("pbb_inc",inc);render();try{msg(c.ok)}catch(e){}
 };
 const o=card;card=function(i){let h=o(i);
  try{if(!(tecnico||admin))return h}catch(e){return h}
  for(const k of Object.keys(CAMPOS)){
   if(!i||!i[k])continue;const c=CAMPOS[k];
   const re=new RegExp(`<div class="mu"[^>]*><b>${c.rot.replace(/\./g,"\\.")}</b>[^<]*</div>`);
   const m=h.match(re);if(!m)continue;
   const btn=`<button class="sec gbdel cmdel" title="Borrar ${c.nom}" aria-label="Borrar ${c.nom}" onclick="event.stopPropagation();delCampoOT('${i.id}','${k}')">${IC('trash')}</button>`;
   h=h.replace(m[0],`<div class="cmlin">${m[0]}${btn}</div>`);
  }
  return h};
})();
