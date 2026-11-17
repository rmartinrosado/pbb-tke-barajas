/* ===== v561: FOTOS DE COMPONENTES EN EL ALMACÉN (Supabase Storage, cubo «componentes») =====
   Antes las fotos iban en base64 dentro de la tabla (51 MB que se bajaban enteros al abrir la app y acabaron
   impidiendo cargar la lista). Ahora, al guardar una ficha, cada foto nueva (y su original sin marcar de la ubicación)
   se sube tal cual al almacén y en la ficha queda solo su dirección. Sin pérdida: se suben los mismos bytes JPEG.
   Si la subida falla (sin cobertura…), la foto se guarda como antes, en base64, para no perderla. ===== */
(function(){
const aBlob=d=>{const m=/^data:([^;]+);base64,(.*)$/.exec(d);const b=atob(m[2]);const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new Blob([u],{type:m[1]})};
const uid=()=>{try{return crypto.randomUUID()}catch(e){return Date.now().toString(36)+Math.random().toString(36).slice(2)}};
async function sube(d){if(typeof d!=="string"||!d.startsWith("data:image"))return d;
 try{const bl=aBlob(d);const ext=bl.type==="image/png"?"png":bl.type==="image/webp"?"webp":"jpg";const ruta="n/"+uid()+"."+ext;
  const {error}=await sb.storage.from("componentes").upload(ruta,bl,{contentType:bl.type,cacheControl:"31536000",upsert:false});if(error)throw error;
  return sb.storage.from("componentes").getPublicUrl(ruta).data.publicUrl}
 catch(e){console.warn("almacén de fotos: se guarda en base64",e);return d}}
window.compSubeFotos=async function(fotos){const out=[];for(const f of fotos||[]){const n=Object.assign({},f);n.src=await sube(n.src);if(n.o)n.o=n.o===f.src?n.src:await sube(n.o);out.push(n)}return out};
})();
