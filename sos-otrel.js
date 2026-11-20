/* ===== v627: el SOS solo se une a la OT abierta de esa PBB si es de la MISMA avería =====
   Antes, al hacer un SOS en una posición con una OT abierta, se tomaba esa OT aunque fuera de otra cosa: un SOS de
   antiatrapamiento en la 586 se mandaba a la IA como «OT abierta: Fallo medida analógica altura», la respuesta hablaba de
   la medida analógica y además se guardaba en la Resolución Claude de esa OT (y las medidas y «Resuelto» del SOS también).
   otRelacionada(pos, texto) devuelve la OT abierta de esa posición solo si comparte la avería con lo escrito en el SOS
   (palabras clave del sistema, códigos de elemento o el nº de orden); si no, null y el SOS va solo. ===== */
(function(){
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const VAC=new Set("fallo falla falta averia aviso activado activada activo activa pasarela posicion funciona funcionan problema revisar revision comprobar senal estado alarma alarmas magelis lado izquierdo derecho izquierda derecha tunel pbb para pero como esta este desde hasta sobre entre cuando donde porque tiene hace solo otra otro cada todo muy mas menos tambien con sin por una uno que los las del hay".split(" "));
/* familias de avería: si el SOS y la OT caen en familias distintas, no se unen */
const FAM=[["aa",/antiatrap|atrapamiento|barrera optica/],["med",/medida analog|4-?20|ultrason|potenciom|encoder|inclinom|medida de (altura|longitud|giro)/],
 ["bum",/bumper/],["hz",/400 ?hz|hertz|\bhz\b|pds/],["aaa",/aire acond|\baaa\b|\baac\b|\badx\b|carro (de )?aire/],["hid",/hidraul|aceite|bomba|valvula/],
 ["ilu",/ilumin|luz|luces|foco|flash|galibo/],["cap",/capota|dosel|toldo/],["porton",/porton|persiana/],["radar",/radar|laser.*ala|deteccion de ala/],
 ["tras",/traslac|rueda|bogie/],["rot",/rotonda/],["cab",/cabina/],["sai",/\bsai\b/]];
const fams=t=>new Set(FAM.filter(([,r])=>r.test(t)).map(([k])=>k));
const pals=t=>new Set(nrm(t).split(/[^a-z0-9]+/).filter(w=>w.length>=5&&!VAC.has(w)).map(w=>w.slice(0,6)));
const cods=t=>new Set((String(t||"").toUpperCase().match(/\b[A-Z]{1,3}\d?-[A-Z]{1,2}\d+(?:\.\d+)?\b/g)||[]));
window.otRelacionada=function(pos,texto,ot){try{
 pos=String(pos||"").trim().toUpperCase();if(!pos&&!ot)return null;
 const L=ot?[ot]:(typeof inc!="undefined"&&Array.isArray(inc)?inc:[]).filter(x=>String(x.pos).toUpperCase()==pos&&x.estado=="abierta");
 const T=nrm(texto);if(!T.trim())return L.length==1?L[0]:null;
 const fT=fams(T),pT=pals(T),cT=cods(texto);let mejor=null,mp=0;
 L.forEach(o=>{const d=[o.desc,o.def,o.com,o.obs,o.alarma].filter(Boolean).join(" ");const D=nrm(d);
  if(o.orden&&String(o.orden).length>=5&&T.includes(nrm(o.orden))){mejor=o;mp=99;return}
  const fD=fams(D);if(fT.size&&fD.size&&![...fT].some(k=>fD.has(k)))return; /* familias distintas → otra avería */
  let p=0;fT.forEach(k=>{if(fD.has(k))p+=3});pals(d).forEach(w=>{if(pT.has(w))p+=1});cods(d).forEach(c=>{if(cT.has(c))p+=3});
  if(p>mp){mp=p;mejor=o}});
 return mp>=2?mejor:null}catch(e){return null}};
})();
