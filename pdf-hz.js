/* ===== v186: plano CONECTOR PDS 400 incrustado al inicio del sistema HZ de la guía de campo =====
 En la guía de campo (modo Técnico) con el tipo HZ, antes de las comprobaciones y averías del sistema HZ,
 va una caja «📐 Plano CONECTOR PDS 400» con el PDF incrustado (todas sus páginas, a lo ancho de la pantalla).
 El plano se toma de la pestaña Planos (bucket «planos» de Supabase): el archivo cuyo nombre lleva CONECTOR y PDS
 (o, si no, PDS / 400 sin «OPERATIVA»). Las páginas se pintan una vez y se guardan en memoria, así los
 refrescos de la guía no vuelven a cargarlo ni hacen parpadear la pantalla. «Abrir a pantalla completa» usa el visor
 de Planos (con zoom). */
(function(){
if(typeof vTec!="function")return;
let doc=null,imgs=null,cargando=null,err="",abierta=true;
const css=document.createElement("style");
css.textContent=`details.gpds>summary{cursor:pointer}
details.gpds .gpdsw{margin-top:8px;background:#777;border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:6px}
details.gpds .gpdsw img{width:100%;display:block;background:#fff;border-radius:4px}
details.gpds .gpdsb{display:flex;gap:6px;margin-top:8px}
details.gpds .gpdsb button{flex:1}`;
document.head.appendChild(css);

async function busca(){const l=await gLista();
 return l.find(x=>/CONECTOR/i.test(x.name)&&/PDS/i.test(x.name)&&!/OPERA/i.test(x.name))
  ||l.find(x=>/PDS/i.test(x.name)&&/400/.test(x.name)&&!/OPERA/i.test(x.name))
  ||l.find(x=>(GUIA.dk.HZ||[]).some(re=>re.test(x.name)))||null}

async function carga(){
 doc=await busca();if(!doc){err="No está el plano CONECTOR PDS 400 en Planos. Súbelo en la pestaña Planos.";return}
 let blob=gCache[doc.id];
 if(!blob){const dl=await sb.storage.from("planos").download(doc.id);if(dl.error)throw dl.error;blob=dl.data;gCache[doc.id]=blob}
 if(typeof esImg=="function"&&esImg({type:doc.type||blob.type,name:doc.name})){imgs=[URL.createObjectURL(blob)];return}
 await cargaLib();
 const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await blob.arrayBuffer())}).promise;
 const out=[];
 for(let n=1;n<=pdf.numPages;n++){const pa=await pdf.getPage(n);const b=pa.getViewport({scale:1});
  const w=Math.min(1800,Math.max(900,Math.round((window.innerWidth||400)*(window.devicePixelRatio||2))));
  const v=pa.getViewport({scale:w/b.width});const c=document.createElement("canvas");c.width=v.width;c.height=v.height;
  await pa.render({canvasContext:c.getContext("2d"),viewport:v}).promise;
  out.push(await new Promise(r=>c.toBlob(bl=>r(URL.createObjectURL(bl)),"image/png")))}
 imgs=out}

function cuerpo(){
 if(err)return `<div class="mu" style="margin-top:8px">${esc(err)}</div>`;
 if(!imgs)return `<div class="mu" style="margin-top:8px">Cargando plano…</div>`;
 return `<div class="gpdsw">${imgs.map((u,i)=>`<img src="${u}" alt="CONECTOR PDS 400 · página ${i+1}" loading="lazy">`).join("")}</div>
 <div class="gpdsb"><button class="sec" onclick="event.preventDefault();pdsHzVer()">🔍 Abrir a pantalla completa</button></div>`}

function pinta(){const c=document.querySelector("#app details.gpds");if(!c)return;
 const t=c.querySelector(".gpdsc");if(t)t.innerHTML=cuerpo();
 const s=c.querySelector(".gpdsn");if(s)s.textContent=doc?`(${imgs?imgs.length+" pág. · ":""}${doc.name})`:""}

window.pdsHzVer=async function(){if(!doc)doc=await busca();if(!doc){msg("Sube a Planos el plano CONECTOR PDS 400");return}gPagIni=1;await ver(doc.id)};

function inserta(){
 if(typeof view!="undefined"&&view!="tec")return;
 if(typeof gTipo=="undefined"||gTipo!="HZ")return;
 const app=document.getElementById("app");if(!app||app.querySelector("details.gpds"))return;
 const d=document.createElement("details");d.className="card gd gpds";d.dataset.k="PDS";if(abierta)d.open=true;
 d.innerHTML=`<summary><b>📐 Plano CONECTOR PDS 400</b> <span class="mu gpdsn" style="font-weight:400"></span></summary><div class="gpdsc">${cuerpo()}</div>`;
 d.addEventListener("toggle",()=>{abierta=d.open});
 /* al inicio del sistema HZ: antes de «Comprobaciones por sistema» o de la primera caja/grupo de averías HZ */
 const ref=app.querySelector(':scope > details[data-k="SIS"]')
  ||[...app.querySelectorAll(":scope > details.ggrp, :scope > details.gd")].find(x=>(x.dataset.k||"").startsWith("HZ")||(x.dataset.g||"").startsWith("HZ|"));
 if(ref)ref.before(d);else{const seg=app.querySelector(':scope > details[data-k="SEG"]');(seg||app.lastElementChild).after(d)}
 pinta();
 if(!imgs&&!err&&!cargando)cargando=carga().catch(e=>{err="No se pudo abrir el plano ("+((e&&e.message)||e)+")"}).finally(()=>{cargando=null;pinta()})}

const o=vTec;vTec=function(){const r=o.apply(this,arguments);try{inserta()}catch(e){console.warn("pds-hz",e)}return r};
})();
