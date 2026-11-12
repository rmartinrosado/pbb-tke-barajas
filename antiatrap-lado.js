/* ===== v428: SOS · alarmas de antiatrapamiento por túnel y lado (PBB de 3 túneles) =====
   · En la lista «Alarma activada» del SOS se añaden las cuatro entradas de E-A9 por separado:
     túnel interior (A-B) izquierdo / derecho y túnel medio (B-C, PBB de 3 túneles) izquierdo / derecho.
   · Al analizar (OT, SOS o lupa) el antiatrapamiento se acota al túnel y al lado indicados:
       interior izq. → E-A9 5.1 · interior dcho. → E-A9 6.1 · medio izq. → E-A9 2.1 · medio dcho. → E-A9 8.1
     Sin lado se muestran los dos lados de ese túnel; sin túnel, el interior (los dos lados).
     El nombre del elemento lo ajusta después segPosFix según la posición (rev. J o barreras ópticas 504/507/508). ===== */
(function(){
if(typeof senOT!="function")return;
const BASE={
 "5.1":["E-A9","5.1","5.2","IT-S3 / IT-B1","Antiatrapamiento túnel interior izquierdo"],
 "6.1":["E-A9","6.1","6.2","IT-B2","Barrera óptica túnel interior derecha (504/507/508)"],
 "2.1":["E-A9","2.1","2.2","MT-S3 / MT-B1","Antiatrapamiento túnel medio izquierdo"],
 "8.1":["E-A9","8.1","8.2","MT-B2","Barrera óptica túnel medio derecha (504)"]};
const o=senOT;
senOT=window.senOT=function(t,pos){const out=o(t,pos);t=String(t||"");
 if(!/antiatrap|atrapamiento|barrera optica/.test(t))return out;
 const izq=/\bizq|\bizda|izquierd/.test(t),dch=/\bdch|\bdrch|\bdcha|derech/.test(t);
 const med=/medio|\bb-?c\b/.test(t),int=/interior|\ba-?b\b/.test(t)||!med;
 const ks=[];
 if(int){if(izq||!dch)ks.push("5.1");if(dch||!izq)ks.push("6.1")}
 if(med){if(izq||!dch)ks.push("2.1");if(dch||!izq)ks.push("8.1")}
 return out.filter(x=>x[0]!="E-A9").concat(ks.map(k=>BASE[k].slice()))};
/* lista del SOS: opciones por túnel y lado */
const ro=window.sosRap;if(typeof ro=="function")window.sosRap=function(){const r=ro.apply(this,arguments);try{
 const g=[...document.querySelectorAll("#sr_a optgroup")].find(x=>/antiatrap/i.test(x.label));if(!g||g.querySelector("[data-lado]"))return r;
 const op=[["Antiatrapamiento túnel interior (A-B) izquierdo","ANTIATRAPAMIENTO TUNEL INTERIOR IZQUIERDO"],["Antiatrapamiento túnel interior (A-B) derecho","ANTIATRAPAMIENTO TUNEL INTERIOR DERECHO"],
  ["Antiatrapamiento túnel medio (B-C) izquierdo · 3 túneles","ANTIATRAPAMIENTO TUNEL MEDIO IZQUIERDO"],["Antiatrapamiento túnel medio (B-C) derecho · 3 túneles","ANTIATRAPAMIENTO TUNEL MEDIO DERECHO"]];
 const ref=[...g.children].find(x=>/TUNEL MEDIO$/.test(x.value));
 op.forEach(([n,v])=>{const e=document.createElement("option");e.value=v;e.textContent=n;e.dataset.lado="1";g.insertBefore(e,ref?ref.nextSibling:g.firstChild)});
 /* el orden: interior, interior izq., interior dcho., medio, medio izq., medio dcho. */
 const lst=[...g.children],by=v=>lst.find(x=>x.value==v);
 ["ANTIATRAPAMIENTO TUNEL INTERIOR","ANTIATRAPAMIENTO TUNEL INTERIOR IZQUIERDO","ANTIATRAPAMIENTO TUNEL INTERIOR DERECHO","ANTIATRAPAMIENTO TUNEL MEDIO","ANTIATRAPAMIENTO TUNEL MEDIO IZQUIERDO","ANTIATRAPAMIENTO TUNEL MEDIO DERECHO"].map(by).filter(Boolean).reverse().forEach(e=>g.insertBefore(e,g.firstChild));
 const gen=[...g.children];gen.forEach(e=>{if(e.value=="ANTIATRAPAMIENTO TUNEL INTERIOR")e.textContent="Antiatrapamiento túnel interior (A-B) · ambos lados";if(e.value=="ANTIATRAPAMIENTO TUNEL MEDIO")e.textContent="Antiatrapamiento túnel medio (B-C) · ambos lados · 3 túneles"});
 /* v428: «Ver actuación» antes que «Aceptar · analizar con Claude» */
 const c=document.getElementById("sheetc"),row=c&&c.querySelector(".srobrow"),bv=c&&[...c.querySelectorAll("button.pri")].find(x=>/sosAnaliza/.test(x.getAttribute("onclick")||"")||/actuaci/i.test(x.textContent));
 if(row&&bv&&row.compareDocumentPosition(bv)&Node.DOCUMENT_POSITION_FOLLOWING){row.parentNode.insertBefore(bv,row);bv.style.marginTop="12px";row.style.marginTop="8px"}
 }catch(e){}return r};
})();
