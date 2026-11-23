/* ===== v806: listado a dos columnas → solo la columna y la fila de la alarma resaltada; explicación desde su rótulo y dibujo.
   v805: recorte de la hoja del manual RCS bajo «Manual pág. N» y «Explicación pág. N» (23/11/2026) =====
   En la caja de cada alarma (SOS, guía, registro) se presenta, debajo de cada botón, la imagen recortada de esa página del
   «Manual RCS» subido en Planos:
    · Manual (listado de alarmas, pág. 108-110): la franja de la hoja donde está el número de la alarma.
    · Explicación: la franja donde aparece el número o el texto de la alarma; si no se encuentra, la hoja entera.
   Tocar la imagen abre el visor en esa página. Sin manual subido no se muestra nada. ===== */
(function(){"use strict";
const st=document.createElement("style");st.textContent=`
.rcsp.rcspim{display:flex!important;flex-direction:column;align-items:stretch;gap:6px}
.rcsp.rcspim>button{align-self:flex-start}
.rcsimg{margin:0 0 6px;border:1px solid #0002;border-radius:8px;overflow:hidden;background:#fff;cursor:zoom-in;box-shadow:0 2px 8px -4px #0006}
.rcsimg img{display:block;width:100%;height:auto}
.rcsimg.cargando{height:64px;display:flex;align-items:center;justify-content:center;font:600 11px var(--tkmo,monospace);color:#78909c;letter-spacing:.5px;cursor:default;
 background:repeating-linear-gradient(90deg,#f3f4f6 0 40px,#e9ebef 40px 80px);background-size:160px 100%;animation:rcsimgL 1.2s linear infinite}
@keyframes rcsimgL{to{background-position:160px 0}}
.rcsimg small{display:block;padding:3px 8px;font:600 10px var(--tkmo,monospace);color:#78909c;background:#f6f7f9;border-top:1px solid #0001}`;
document.head.appendChild(st);

const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
let docP=null;const IMG=new Map();
/* el manual RCS desde Planos (misma búsqueda que rcsPag) */
function manual(){if(docP)return docP;docP=(async()=>{
 const l=await allPdf();const d=(l||[]).find(x=>/manual.?rcs|max.?automate|f8.?690/i.test(x.name))||(l||[]).find(x=>/manual/i.test(x.name)&&/rcs/i.test(x.name));
 if(!d)return null;let blob=(typeof gCache!="undefined"&&gCache[d.id])||null;
 if(!blob){if(typeof sb=="undefined")return null;const dl=await sb.storage.from("planos").download(d.id);if(dl.error)return null;blob=dl.data;try{gCache[d.id]=blob}catch(e){}}
 await cargaLib();return await pdfjsLib.getDocument({data:new Uint8Array(await blob.arrayBuffer())}).promise})().catch(()=>null);
 docP.then(d=>{if(!d)docP=null});return docP}

/* recorte: franja alrededor de la línea donde aparece la alarma */
async function recorte(n,cod,txt,lista){const k=n+"|"+cod+"|"+(lista?1:0);if(IMG.has(k))return IMG.get(k);
 const p=(async()=>{const pdf=await manual();if(!pdf||n<1||n>pdf.numPages)return null;const pg=await pdf.getPage(n);
  const sc=2;const vp=pg.getViewport({scale:sc});const cv=document.createElement("canvas");cv.width=vp.width;cv.height=vp.height;
  await pg.render({canvasContext:cv.getContext("2d"),viewport:vp}).promise;
  /* v806: listado a DOS columnas (pág. 108-110): solo la columna de la alarma, su fila resaltada y dos filas arriba y abajo.
     Explicación: desde el rótulo que más palabras comparte con la alarma (p. ej. «Límite de giro de la unidad de traslación»)
     hasta su dibujo; si no hay rótulo, la hoja entera sin márgenes. */
  const W=cv.width,H=cv.height,lh=H*15/841.89;let hit=null,mode="";
  try{const tc=await pg.getTextContent();const it=tc.items.filter(i=>i.str&&i.str.trim());
   const c0=String(cod).replace(/^R/i,"");const reC=new RegExp("^\\s*"+(/^R/i.test(cod)?"R\\s*0*":"0*")+c0.replace(/^0+(?=\d)/,"")+"(?![\\d.,])","i");
   if(lista){hit=it.find(i=>reC.test(i.str));mode="fila"}
   else{const Wd=nrm(txt).split(/[^a-z0-9ñ]+/).filter(w=>w.length>=4&&!/^(alarma|advertencia|fallo|activad[oa])$/.test(w));let bs=0;
    it.forEach(i=>{const s2=nrm(i.str);const k2=Wd.filter(w=>s2.includes(w)).length;const fz=Math.abs(i.transform[3]||0);
     if(k2>bs||(k2==bs&&k2>0&&hit&&fz>Math.abs(hit.transform[3]||0))){bs=k2;hit=i}});
    if(!(bs>=2||(bs>=1&&Wd.length<=1)))hit=null;mode="rot"}}catch(e){hit=null}
  if(lista&&!hit)return null; /* en el listado sin el número localizado no se presenta una hoja equivocada */
  let x0=0,y0=0,w=W,h=H,fila=null;
  if(hit){const t=pdfjsLib.Util.transform(vp.transform,hit.transform);const x=t[4],y=t[5];
   if(mode=="fila"){x0=Math.max(0,x-W*.012);w=Math.min(W-x0,W*.42);y0=Math.max(0,y-lh*2.75);h=Math.min(H-y0,lh*5.5);fila=[x0,y-lh*.78,w,lh]}
   else{const xe=x+(hit.width||0)*sc;y0=Math.max(0,y-lh*1.45);h=Math.min(H-y0,H*.5);
    /* rótulo en una mitad de la hoja (dibujos a dos columnas) → solo esa mitad */
    if(xe<W*.56){x0=W*.04;w=W*.52}else if(x>W*.44){x0=W*.46;w=W*.52}else{x0=W*.05;w=W*.9}}}
  else{x0=W*.05;w=W*.9;y0=H*.04;h=H*.92}
  const o=document.createElement("canvas");o.width=Math.round(w);o.height=Math.round(h);const g=o.getContext("2d");g.drawImage(cv,x0,y0,w,h,0,0,w,h);
  if(fila){g.fillStyle="rgba(255,122,26,.22)";g.fillRect(0,fila[1]-y0,fila[2],fila[3]);g.fillStyle="#ff7a1a";g.fillRect(0,fila[1]-y0,5,fila[3])}
  const y=hit?1:null;
  return{src:o.toDataURL("image/jpeg",.85),entera:y==null}})().catch(()=>null);
 IMG.set(k,p);p.then(r=>{if(!r)IMG.delete(k)});return p}

const pagDe=b=>{const m=/rcsPag\((\d+)\)/.exec(b.getAttribute("onclick")||"");return m?+m[1]:0};
function rellena(){document.querySelectorAll(".rcsp:not([data-im])").forEach(box=>{if(!box.offsetParent)return;
 const caja=box.closest(".rcsb");const hb=caja&&caja.querySelector(".rcsh b");if(!hb)return;box.dataset.im="1";
 const cod=hb.textContent.trim();const txt=(caja.querySelector(".rcsh")||{}).textContent||"";
 const bts=[...box.querySelectorAll("button")].filter(pagDe);if(!bts.length)return;box.classList.add("rcspim");
 bts.forEach(b=>{const n=pagDe(b),lista=/Manual p/i.test(b.textContent);const d=document.createElement("div");d.className="rcsimg cargando";d.textContent="Recortando la hoja "+n+"…";b.after(d);
  recorte(n,cod,txt.replace(cod,""),lista).then(r=>{if(!r){d.remove();return}
   d.className="rcsimg";d.innerHTML=`<img src="${r.src}" alt="Manual RCS pág. ${n}"><small>📖 Manual RCS · pág. ${n}${r.entera?"":" · recorte"} · tocar para abrir la hoja</small>`;
   d.onclick=e=>{e.stopPropagation();if(typeof rcsPag=="function")rcsPag(n)}})})})}
setInterval(rellena,900);document.addEventListener("click",()=>setTimeout(rellena,300),true);
})();
