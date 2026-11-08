/* ===== v364: croquis de conexión por bloques al final del PDF A4 (Resolución Claude AI y SOS) =====
   Dibuja con jsPDF, en una página nueva, la cadena ORIGEN → DESTINO del elemento a inspeccionar:
   bloques con su símbolo eléctrico (fuente, PLC, relé, bornero, conector, caja, motor, lámpara, sensor,
   pulsador, válvula), rótulo, folio y bornas numeradas con su hilo; mangueras con rótulo y hilos entre bloques;
   y en cada punto de medida un polímetro con punta ROJA y punta NEGRA llevadas a la borna y una caja MEDIR
   (puntas, magnitud, valor esperado y qué hacer si no da).
   Datos: objeto «croquis» que genera la función consulta-sos (modo croquis) a partir de la resolución. */
(function(){
 const RJ=[200,20,20],NG=[25,25,25],AZ=[30,80,160],AM=[255,244,200];
 const corta=(d,t,w)=>{t=String(t||"");if(d.getTextWidth(t)<=w)return t;while(t.length>1&&d.getTextWidth(t+"...")>w)t=t.slice(0,-1);return t+"..."};

 /* ---------- símbolos (caja s×s con esquina sup. izq. en x,y) ---------- */
 function simbolo(d,tipo,x,y,s){const cx=x+s/2,cy=y+s/2,r=s*.36;d.setDrawColor(...NG);d.setLineWidth(.35);d.setTextColor(...NG);
  const txt=(t,sz)=>{d.setFont("helvetica","bold");d.setFontSize(sz||7);d.text(t,cx,cy+(sz||7)*.13,{align:"center"})};
  switch(tipo){
   case"fuente":d.circle(cx,cy,r);d.setFontSize(7);d.setFont("helvetica","bold");d.text("+",cx-r*.45,cy-r*.15,{align:"center"});d.text("-",cx+r*.45,cy-r*.15,{align:"center"});
    d.line(cx-r*.6,cy+r*.35,cx+r*.6,cy+r*.35);d.setLineDashPattern([.6,.5],0);d.line(cx-r*.6,cy+r*.6,cx+r*.6,cy+r*.6);d.setLineDashPattern([],0);break;
   case"plc":d.rect(x+1,y+1,s-2,s-2);txt("PLC",6.5);for(let k=0;k<3;k++){const yy=y+2.5+k*(s-5)/2;d.line(x+s-1,yy,x+s+.8,yy)}break;
   case"rele":d.rect(x+s*.2,y+s*.25,s*.6,s*.5);d.line(x+s*.2,y+s*.75,x+s*.8,y+s*.25);d.line(cx,y,cx,y+s*.25);d.line(cx,y+s*.75,cx,y+s);break;
   case"bornero":for(let k=0;k<3;k++){const yy=y+1+k*(s-2)/3,h=(s-2)/3;d.rect(x+s*.25,yy,s*.5,h);d.circle(cx,yy+h/2,h*.28)}break;
   case"conector":d.circle(cx,cy,r);[[-.45,-.45],[.45,-.45],[.45,.45],[-.45,.45]].forEach(([a,b])=>{d.setFillColor(...NG);d.circle(cx+a*r,cy+b*r,.45,"F")});d.circle(cx,cy,.45,"F");break;
   case"caja":d.setLineDashPattern([1,.7],0);d.rect(x+1,y+1,s-2,s-2);d.setLineDashPattern([],0);txt("X",8);break;
   case"motor":d.circle(cx,cy,r);txt("M",8);break;
   case"lampara":d.circle(cx,cy,r);const q=r*.7;d.line(cx-q,cy-q,cx+q,cy+q);d.line(cx-q,cy+q,cx+q,cy-q);break;
   case"sensor":d.rect(x+1.5,y+1.5,s-3,s-3);d.lines([[r*.8,r*.8],[-r*.8,r*.8],[-r*.8,-r*.8],[r*.8,-r*.8]],cx,cy-r*.8,[1,1],"S",true);break;
   case"pulsador":d.line(x+1,cy+r*.5,x+s*.35,cy+r*.5);d.line(x+s*.35,cy+r*.5,x+s*.7,cy-r*.3);d.line(x+s*.7,cy+r*.5,x+s-1,cy+r*.5);d.line(x+s*.52,cy-r*.9,x+s*.52,cy+r*.05);d.line(x+s*.4,cy-r*.9,x+s*.64,cy-r*.9);break;
   case"valvula":d.rect(x+s*.15,y+s*.25,s*.7,s*.5);d.line(x+s*.15,y+s*.75,x+s*.85,y+s*.25);txt("Y",6);break;
   default:d.rect(x+1,y+1,s-2,s-2);d.rect(x+2.5,y+2.5,s-5,s-5)}
  d.setTextColor(0,0,0)}

 /* ---------- polímetro ---------- */
 function polimetro(d,x,y,mag){d.setDrawColor(...NG);d.setLineWidth(.3);d.setFillColor(255,214,0);d.roundedRect(x,y,11,15,1.2,1.2,"FD");
  d.setFillColor(205,225,205);d.rect(x+1.3,y+1.3,8.4,4.2,"FD");d.setFont("courier","bold");d.setFontSize(5.5);d.setTextColor(...NG);d.text(String(mag||"V").slice(0,4),x+5.5,y+4.4,{align:"center"});
  d.setFillColor(80,80,80);d.circle(x+5.5,y+8.6,1.9,"FD");d.setDrawColor(255,255,255);d.line(x+5.5,y+8.6,x+6.6,y+7.5);
  d.setFillColor(...RJ);d.circle(x+3.2,y+12.8,.9,"F");d.setFillColor(...NG);d.circle(x+7.8,y+12.8,.9,"F");d.setTextColor(0,0,0);
  return{rx:x+3.2,ry:y+12.8,nx:x+7.8,ny:y+12.8}}
 function punta(d,x,y,col){d.setFillColor(...col);d.setDrawColor(...col);d.circle(x,y,.75,"F")}


 /* v365: ubicación física del elemento por el prefijo de su rótulo (EPLAN «+P-», «+E-», …); si no, la que dé la IA */
 const UBI=[[/^\+?CBTH/i,"Armario CBTH (exterior)"],[/^\+?IT-/i,"Túnel interior"],[/^\+?ET-/i,"Túnel exterior"],[/^\+?MT-/i,"Túnel medio"],[/^\+?CO\d*-/i,"Columna rotonda"],
  [/^\+?SS-/i,"Escalera servicio · ext."],[/^\+?P-/i,"Armario eléctrico pupitre"],[/^\+?E-/i,"Armario eléctrico principal"],[/^\+?R-/i,"Rotonda"],
  [/^\+?C-/i,"Cabina"],[/^\+?H-/i,"Elevación · exterior"],[/^\+?T-/i,"Carro traslación · exterior"]];
 const ubica=n=>{const r=String(n.ref||"").trim();for(const [re,t] of UBI)if(re.test(r))return t;return n.ubicacion||""};
 function dibuja(d,C,o){const {cab,W,H,M,PR,AC,GR,fnt,pS}=o;if(!C||!Array.isArray(C.nodos)||!C.nodos.length)return;
  const BOT=H-16,X0=M,BW=90,SY=14,GAP=15,MX=X0+BW+3,BX=MX+14,BWm=W-M-BX;
  const nuevaPag=t=>{d.addPage();cab();let y=24;d.setFillColor(...PR);d.roundedRect(M,y-5,W-2*M,8,1.5,1.5,"F");fnt(1,0,11);d.setTextColor(255,255,255);
   d.text(pS(t),M+3,y);d.setTextColor(0,0,0);y+=6;return y};
  let y=nuevaPag("Croquis de conexion por bloques · origen -> destino");
  fnt(1,0,10);d.setTextColor(...PR);d.text(corta(d,pS(C.titulo||C.elemento||"Elemento a inspeccionar"),W-2*M),M,y+2);d.setTextColor(0,0,0);y+=5.5;
  if(C.local){fnt(1,0,7.5);d.setTextColor(230,81,0);d.text(pS("Croquis automático sin IA: referencias extraídas de la resolución (cupo de IA agotado). Confirmar en el plano."),M,y);y+=4.2}
  fnt(0,0,8);d.setTextColor(...GR);const sub=[C.elemento&&C.titulo?("Elemento: "+C.elemento):"",C.tension?("Tension: "+C.tension):"",C.plano?("Plano: "+C.plano):""].filter(Boolean).join("   ·   ");
  if(sub){d.text(corta(d,pS(sub),W-2*M),M,y);y+=4.5}d.setTextColor(0,0,0);
  /* cabeceras de columna */
  fnt(1,0,7);d.setTextColor(...GR);d.text("ORIGEN",X0,y+2);d.text("MEDIDA EN CAMPO CON POLIMETRO",BX,y+2);d.setTextColor(0,0,0);y+=5;
  const nodos=C.nodos.slice(0,9),cables=Array.isArray(C.cables)?C.cables:[],med=(Array.isArray(C.medidas)?C.medidas:[]).slice(0,8);
  const pos={};let ry=y,pend=[];
  const cableEntre=(a,b)=>cables.find(c=>(c.de==a.id&&c.a==b.id)||(c.de==b.id&&c.a==a.id));
  const altoMed=m=>{fnt(0,0,6.6);const ln=[pS("Roja (+): "+(m.roja||"-")),pS("Negra (COM): "+(m.negra||"-")),pS("Esperado: "+(m.esperado||"-")),m.si_no?pS("Si no: "+m.si_no):""].filter(Boolean);
   return 7+ln.reduce((s,l)=>s+d.splitTextToSize(l,BWm-4).length*2.9,0)+1.5};
  const dibMed=(m,nb)=>{const h=altoMed(m);let top=Math.max(ry,nb.top);if(top+h>BOT){pend.push(m);return}
   /* polímetro y puntas */
   const pm=polimetro(d,MX,top+1,m.magnitud||"V");
   const bor=(s)=>{const k=String(s||"").match(/:\s*([\w.+-]+)/);if(!k)return null;return nb.bornas.find(b=>String(b.n).toLowerCase()==k[1].toLowerCase())||null};
   const br=bor(m.roja),bn=bor(m.negra);
   const tR=br?{x:br.x,y:br.y}:{x:nb.x+nb.w,y:nb.top+6},tN=bn?{x:bn.x,y:bn.y}:{x:nb.x+nb.w,y:nb.top+nb.h-4};
   d.setLineWidth(.45);d.setDrawColor(...RJ);d.lines([[0,4],[tR.x-pm.rx,tR.y-pm.ry-4]],pm.rx,pm.ry);punta(d,tR.x,tR.y,RJ);
   d.setDrawColor(...NG);d.setLineDashPattern([1.2,.6],0);d.lines([[0,6],[tN.x-pm.nx,tN.y-pm.ny-6]],pm.nx,pm.ny);d.setLineDashPattern([],0);punta(d,tN.x,tN.y,NG);
   /* caja MEDIR */
   d.setDrawColor(...AC);d.setLineWidth(.5);d.setFillColor(255,250,240);d.roundedRect(BX,top,BWm,h,1.5,1.5,"FD");
   d.setFillColor(...AC);d.roundedRect(BX,top,BWm,5.2,1.5,1.5,"F");d.rect(BX,top+2.5,BWm,2.7,"F");fnt(1,0,7.5);d.setTextColor(255,255,255);
   d.text(pS(`${m.id||"M"} · MEDIR ${m.magnitud||""}`),BX+2,top+3.8);d.setTextColor(0,0,0);let yy=top+8.2;
   const fila=(col,et,t)=>{fnt(1,0,6.6);if(col){d.setFillColor(...col);d.circle(BX+2.6,yy-1,.9,"F")}d.setTextColor(...(col||GR));d.text(et,BX+(col?4.3:2),yy);const ew=d.getTextWidth(et)+1;
    fnt(0,0,6.6);d.setTextColor(0,0,0);const ls=d.splitTextToSize(pS(t||"-"),BWm-(col?4.3:2)-ew-2);ls.forEach((l,k)=>{d.text(l,BX+(col?4.3:2)+ew,yy);yy+=2.9})};
   fila(RJ,"Roja (+):",m.roja);fila(NG,"Negra (COM):",m.negra);fila(null,"Esperado:",m.esperado);if(m.si_no)fila(null,"Si no:",m.si_no);
   ry=top+h+2.5};
  for(let k=0;k<nodos.length;k++){const n=nodos[k],bs=(Array.isArray(n.bornas)?n.bornas:[]).slice(0,10);const h=bs.length?25:16;
   if(y+h>BOT){/* continúa en otra página */fnt(1,0,7);d.setTextColor(...GR);d.text("(continua en la pagina siguiente)",X0,BOT+1);d.setTextColor(0,0,0);y=nuevaPag("Croquis de conexion (continuacion)");ry=y}
   /* bloque */
   d.setDrawColor(...PR);d.setLineWidth(.5);d.setFillColor(248,245,252);d.roundedRect(X0,y,BW,h,1.5,1.5,"FD");
   d.setFillColor(255,255,255);d.rect(X0+2,y+2,SY,SY,"F");simbolo(d,n.tipo,X0+2,y+2,SY);
   fnt(1,0,9.5);d.setTextColor(...PR);d.text(corta(d,pS(n.ref||"-"),BW-SY-24),X0+SY+5,y+5.5);d.setTextColor(0,0,0);
   if(n.folio){fnt(0,0,6.5);d.setTextColor(...GR);d.text(pS("fol. "+n.folio),X0+BW-2,y+4.5,{align:"right"});d.setTextColor(0,0,0)}
   const ub=pS(ubica(n));let uw=0;
   if(ub){fnt(1,0,5.8);uw=Math.min(44,d.getTextWidth(ub)+4);d.setFillColor(255,236,214);d.setDrawColor(...AC);d.setLineWidth(.25);d.roundedRect(X0+BW-2-uw,y+6.2,uw,3.9,.9,.9,"FD");
    d.setTextColor(150,70,0);d.text(corta(d,ub,uw-2.5),X0+BW-2-uw/2,y+8.9,{align:"center"});d.setTextColor(0,0,0)}
   fnt(0,0,7);d.text(corta(d,pS(n.desc||n.tipo||""),BW-SY-8-(uw?uw+3:0)),X0+SY+5,y+9.3);
   const nb={x:X0,w:BW,top:y,h,bornas:[]};
   if(bs.length){const tx=X0+SY+5,ty=y+12.2,st=Math.min(7,(BW-SY-8)/bs.length);
    bs.forEach((b,j)=>{const bx=tx+j*st;d.setDrawColor(...NG);d.setLineWidth(.3);d.setFillColor(255,255,255);d.rect(bx,ty,5,5,"FD");d.circle(bx+2.5,ty+2.5,1.1);
     d.line(bx+1.7,ty+3.3,bx+3.3,ty+1.7);fnt(1,0,5.6);d.text(corta(d,pS(b.n),st-.3),bx+2.5,ty-.6,{align:"center"});
     if(b.hilo||b.senal){fnt(0,0,4.8);d.setTextColor(...AZ);d.text(corta(d,pS(b.hilo||""),st-.2),bx+2.5,ty+7.3,{align:"center"});if(b.senal){d.setTextColor(...GR);d.text(corta(d,pS(b.senal),st-.2),bx+2.5,ty+9.4,{align:"center"})}d.setTextColor(0,0,0)}
     nb.bornas.push({n:b.n,x:bx+2.5,y:ty+2.5})})}
   pos[n.id]=nb;
   /* medidas de este nodo */
   med.filter(m=>m.nodo==n.id).forEach(m=>dibMed(m,nb));
   y+=h;
   /* manguera al siguiente */
   const sig=nodos[k+1];if(sig){const c=cableEntre(n,sig)||{};const hil=(Array.isArray(c.hilos)?c.hilos:String(c.hilos||"").split(/[,·\s]+/)).filter(Boolean);
    if(y+GAP+16>BOT){y+=2;continue}
    const cx=X0+SY/2+2,nh=Math.max(1,Math.min(4,hil.length||2));d.setDrawColor(...NG);d.setLineWidth(.35);
    for(let j=0;j<nh;j++){const xx=cx-(nh-1)*.9+j*1.8;d.line(xx,y,xx,y+GAP)}
    d.setLineWidth(.25);d.line(cx-3.2,y+GAP/2+1.6,cx+3.2,y+GAP/2-1.6);/* trazo de manguera */
    const et=pS([c.ref,c.tipo?"("+c.tipo+")":""].filter(Boolean).join(" ")||"Cableado");fnt(1,0,7);const tw=Math.min(BW-SY-6,d.getTextWidth(et)+4);
    d.setFillColor(...AM);d.setDrawColor(190,150,0);d.roundedRect(cx+5,y+2.2,tw,5,1,1,"FD");d.setTextColor(...NG);d.text(corta(d,et,tw-3),cx+7,y+5.6);
    if(hil.length){fnt(0,0,6.2);d.setTextColor(...AZ);d.text(corta(d,pS("hilos: "+hil.join(" · ")),BW-SY-6),cx+5,y+11.3)}d.setTextColor(0,0,0);y+=GAP}}
  /* medidas que no cupieron al lado de su bloque */
  if(pend.length){y=Math.max(y,ry)+4;pend.forEach(m=>{const nb=pos[m.nodo]||{x:X0,w:BW,top:y,h:0,bornas:[]};const h=altoMed(m);if(y+h>BOT){y=nuevaPag("Croquis · medidas en campo");}
   const BXo=M;fnt(1,0,7.5);d.setDrawColor(...AC);d.setFillColor(255,250,240);d.roundedRect(BXo,y,W-2*M,h,1.5,1.5,"FD");d.setTextColor(...AC);d.text(pS(`${m.id||"M"} · MEDIR ${m.magnitud||""} · ${pS((pos[m.nodo]&&nodos.find(z=>z.id==m.nodo).ref)||"")}`),BXo+2,y+4);
   fnt(0,0,7);d.setTextColor(0,0,0);let yy=y+8;[["Roja (+): ",m.roja],["Negra (COM): ",m.negra],["Esperado: ",m.esperado],["Si no: ",m.si_no]].forEach(([a,b])=>{if(!b)return;d.text(d.splitTextToSize(pS(a+b),W-2*M-4)[0],BXo+2,yy);yy+=3});y+=h+2})}
  /* leyenda */
  let ly=Math.max(y,ry)+5;if(ly+20>BOT){ly=nuevaPag("Croquis · leyenda")}
  d.setDrawColor(200,200,200);d.setLineWidth(.3);d.line(M,ly-2,W-M,ly-2);fnt(1,0,7);d.setTextColor(...GR);d.text("LEYENDA",M,ly+1.5);d.setTextColor(0,0,0);
  const LG=[["fuente","Fuente"],["plc","PLC"],["rele","Rele"],["bornero","Bornero"],["conector","Conector"],["caja","Caja conex."],["motor","Motor"],["lampara","Lampara"],["sensor","Sensor"],["pulsador","Pulsador"],["valvula","Valvula"]];
  let lx=M;const lyy=ly+3;LG.forEach(([t,n],k)=>{if(k==6){lx=M}const yy=lyy+(k>=6?9:0);simbolo(d,t,lx,yy,6);fnt(0,0,6.3);d.text(n,lx+7,yy+4);lx+=30});
  const py=lyy+19;d.setLineWidth(.45);d.setDrawColor(...RJ);d.line(M,py,M+8,py);punta(d,M+8,py,RJ);fnt(0,0,6.6);d.text("Punta roja (+, V/Ohm)",M+10,py+1);
  d.setDrawColor(...NG);d.setLineDashPattern([1.2,.6],0);d.line(M+48,py,M+56,py);d.setLineDashPattern([],0);punta(d,M+56,py,NG);d.text("Punta negra (COM / 0 V)",M+58,py+1);
  d.setFillColor(...AM);d.setDrawColor(190,150,0);d.roundedRect(M+100,py-2.6,10,3.8,.8,.8,"FD");d.text("Manguera / cable",M+112,py+1);
  d.setDrawColor(...NG);d.setFillColor(255,255,255);d.rect(M+145,py-2.5,3.8,3.8,"FD");d.circle(M+146.9,py-.6,.8);d.text("Borna numerada",M+150,py+1);
  fnt(0,0,6);d.setTextColor(...GR);d.text(pS("Croquis generado por IA a partir de la resolucion y la documentacion del proyecto: confirmar bornas e hilos en el plano antes de medir."),M,py+6);d.setTextColor(0,0,0)}

 /* ===== v374: croquis de RESERVA sin IA (cuando Google agota el cupo o no responde) =====
    Saca de la propia resolución las referencias EPLAN (equipos, PLC, relés, borneros con sus bornas, mangueras e hilos,
    folios) y las medidas con polímetro, y las ordena de origen (alimentación / PLC) a destino (elemento de campo). */
 /* v377: croquis de reserva ESTRICTO. Solo entran los elementos que la resolución usa en las MEDIDAS (bornas, PLC con entradas/LED)
    y el elemento de campo que se inspecciona; se descartan los citados como comprobados/descartados o de maniobra (bypass, selector, seta).
    La descripción de cada elemento sale del propio texto (bumper, potenciómetro, inductivo…), nunca se supone.
    Si no hay al menos 2 elementos y 1 medida claros, NO se genera croquis (no se inventa). */
 function croquisLocal(md,pos,tipo,aviso){const T=String(md||"").replace(/\r/g,"");const plano=T.replace(/[*`_]/g,"");const lineas=plano.split("\n");
  const REF=/\+?\b([A-Z]{1,5}\d?-[A-Z]{1,3}\d{1,3}(?:\.\d{1,2})?)\b(?:\s*:\s*([0-9]{1,3}(?:\.[0-9])?))?/g;
  const clase=r=>(r.split("-")[1]||"").replace(/\d.*$/,"");
  const NOM=[[/bumper|parachoques/i,"Bumper","pulsador"],[/potenci[oó]metro/i,"Potenciómetro","sensor"],[/inductiv/i,"Detector inductivo","sensor"],[/final(es)? de carrera|\bFC\b/i,"Final de carrera","pulsador"],
   [/fotoc[eé]lula|barrera [oó]ptica/i,"Barrera óptica","sensor"],[/l[aá]ser/i,"Láser","sensor"],[/ultrasonid/i,"Ultrasonidos","sensor"],[/encoder/i,"Encoder","sensor"],[/zapata/i,"Zapata","pulsador"],[/borde/i,"Borde sensible","pulsador"],
   [/seta/i,"Seta de emergencia","pulsador"],[/pulsador/i,"Pulsador","pulsador"],[/selector/i,"Selector","pulsador"],[/rel[eé]|contactor/i,"Relé / contactor","rele"],[/motor|bomba/i,"Motor","motor"],
   [/electrov[aá]lvula|v[aá]lvula/i,"Electroválvula","valvula"],[/sirena|bocina/i,"Sirena","lampara"],[/sem[aá]foro|baliza|piloto|l[aá]mpara|foco/i,"Señal luminosa","lampara"],[/conector/i,"Conector","conector"],
   [/regleta|bornero|borna/i,"Bornero","bornero"],[/m[oó]dulo|PLC|tarjeta/i,"Módulo PLC","plc"],[/fuente|alimentaci[oó]n|magnetot|interruptor autom/i,"Alimentación / protección","fuente"]];
  const TIPO={A:"plc",X:"bornero",K:"rele",Q:"fuente",F:"fuente",G:"fuente",T:"fuente"};
  const RANGO={fuente:0,plc:1,rele:2,bornero:3,conector:4,equipo:5,sensor:6,pulsador:6,motor:6,lampara:6,valvula:6};
  const NEG=/descart|no (est[aá] )?afectad|correcto\s*\(|est[aá] correct|sin fallo|bypass|BYPASS|selector|seta|MANUAL|REMOTO|separar la cabina|mover|maniobra|compa[nñ]ero/;
  const MED=l=>!/^\s*[-*]?\s*(in)?correcto/i.test(l)&&(/(medi[dr]|polímetro|continuidad)/i.test(l)||/(VDC|VAC|\bV\b|Ω|\bohm|\bmA\b)/.test(l));
  const nodos=new Map(),usar=new Set(),neg=new Set();
  /* descripción del elemento por la palabra que lo acompaña en el texto */
  const nombre=(ref)=>{let best=null,dist=1e9;let k=-1;while((k=plano.indexOf(ref,k+1))>=0){const ctx=plano.slice(Math.max(0,k-45),k+ref.length+45);
    for(const [re,n,t] of NOM){const mm=ctx.match(re);if(mm){const d=Math.abs(ctx.indexOf(mm[0])-45);if(d<dist){dist=d;best={n,t}}}}}return best};
  const nodo=(ref)=>{let n=nodos.get(ref);if(n)return n;const k=clase(ref);const nm=nombre(ref);
   const tp=TIPO[k]||(nm&&nm.t)||"equipo";n={ref,tipo:tp,desc:(TIPO[k]?null:nm&&nm.n)||({plc:"Módulo PLC",bornero:"Bornero de interconexión",rele:"Relé / contactor",fuente:"Alimentación / protección"}[tp])||"Elemento de campo (ver plano)",bornas:new Map(),pos:plano.indexOf(ref)};
   const f=plano.slice(Math.max(0,n.pos-40),n.pos+100).match(/folio\s*(\d{1,3})/i);if(f)n.folio=f[1];nodos.set(ref,n);return n};
  /* 1) medidas: definen los puntos y los elementos que intervienen */
  const med=[];
  for(let i=0;i<lineas.length;i++){const l=lineas[i];if(!MED(l))continue;
   const refs=[...l.matchAll(REF)].filter(x=>clase(x[1])!="W");if(!refs.length)continue;
   if(!refs.some(x=>x[2])&&!/(VDC|VAC|\bV\b|Ω|\bohm|\bmA\b|continuidad)/i.test(l))continue; /* sin borna ni magnitud: no es una medida clara */
   refs.forEach((x,q)=>{const n=nodo(x[1]);usar.add(x[1]);if(x[2]){const b=n.bornas.get(x[2])||{n:x[2]};const fin=q+1<refs.length?refs[q+1].index:l.length;const h=l.slice(x.index,fin).match(/hilo\s*(\d{2,4})/i);if(h&&!b.hilo)b.hilo=h[1];n.bornas.set(x[2],b)}});
   if(med.length>=6)continue;const fmt=x=>x[1]+(x[2]?":"+x[2]:"");const clave=refs.slice(0,2).map(fmt).join("|");if(med.some(z=>z._k==clave))continue;
   const blk=lineas.slice(i,i+4).join(" ");
   const mag=(blk.match(/\b(VDC|VAC|Vdc|Vac|Ω|ohm|mA|bar)\b/)||[,""])[1].replace(/ohm/i,"Ω").toUpperCase()||(/continuidad/i.test(blk)?"Ω":"V");
   const esp=(blk.match(/(?:esperado|correcto)\s*(?:->|=>|→|:)\s*([^.;\n]{3,60})/i)||blk.match(/(\d+\s*(?:VDC|VAC|V|Ω|mA))/i)||[,""])[1].trim();
   const si=(blk.match(/incorrecto\s*(?:->|=>|→|:)\s*([^.;\n]{3,70})/i)||[,""])[1].trim();
   med.push({_k:clave,_ref:refs[0][1],magnitud:mag,roja:fmt(refs[0]),negra:refs[1]?fmt(refs[1]):"",esperado:esp||"-",si_no:si})}
  /* 2) PLC con entrada/LED citados en el diagnóstico */
  lineas.forEach(l=>{if(NEG.test(l))return;[...l.matchAll(REF)].forEach(x=>{if(TIPO[clase(x[1])]=="plc"&&/\b(DIN|DI|DO|IN|OUT)\s?\d|LED\s*\d|entrada|salida/i.test(l)){const n=nodo(x[1]);usar.add(x[1]);
   (l.match(/\b(?:DIN|DI|DO|IN|OUT)\s?\d+(?:\.\d)?\b/gi)||[]).slice(0,3).forEach(b=>{const k=b.toUpperCase().replace(/\s/g,"");n.bornas.set(k,{n:k})})}})});
  /* 3) elemento de campo inspeccionado: el que la resolución nombra con su función (bumper, inductivo…) fuera de líneas de maniobra/descartes */
  lineas.forEach(l=>{if(NEG.test(l))return;[...l.matchAll(REF)].forEach(x=>{const k=clase(x[1]);if(k=="W"||TIPO[k])return;const nm=nombre(x[1]);if(nm&&/sensor|pulsador|motor|lampara|valvula|conector/.test(nm.t)&&new RegExp(nm.n.split(" ")[0],"i").test(String(aviso||"")+" "+(T.match(/^#\s+(.+)$/m)||[,""])[1]))usar.add(x[1])})});
  lineas.forEach(l=>{if(NEG.test(l))[...l.matchAll(REF)].forEach(x=>neg.add(x[1]))});
  let L=[...nodos.values()].filter(n=>usar.has(n.ref)&&!(neg.has(n.ref)&&!med.some(m=>m._ref==n.ref)));
  /* el elemento de campo nombrado en el título/aviso también entra aunque solo se cite (sin medida) */
  [...usar].forEach(r=>{if(!L.some(n=>n.ref==r)&&!neg.has(r)){const n=nodo(r);L.push(n)}});
  if(L.length<2||!med.length)return null;           /* no está claro: no se genera */
  if(L.length>8)L=L.slice(0,8);
  L.sort((a,b)=>(RANGO[a.tipo]??5)-(RANGO[b.tipo]??5)||a.pos-b.pos);
  L.forEach((n,i)=>{n.id="N"+(i+1);n.bornas=[...n.bornas.values()].slice(0,8)});
  /* mangueras: solo las que la resolución cita junto a los dos elementos que une; si no, «ver plano» */
  const cab=[];for(let i=0;i<L.length-1;i++){const a=L[i].ref,b=L[i+1].ref;let c=null;
   for(const l of lineas){const rs=[...l.matchAll(REF)].map(x=>x[1]);if(rs.includes(a)&&rs.includes(b)){const w=[...l.matchAll(REF)].find(x=>clase(x[1])=="W");if(w){c={ref:w[1],hilos:(l.match(/hilos?\s*((?:\d{2,4}[\s,y/·-]*)+)/i)||[,""])[1].split(/[^\d]+/).filter(Boolean)};break}}}
   cab.push({de:L[i].id,a:L[i+1].id,ref:c?c.ref:"ver plano",tipo:"",hilos:c?c.hilos:[]})}
  const M=med.filter(m=>L.some(n=>n.ref==m._ref)).map((m,k)=>({id:"M"+(k+1),nodo:L.find(n=>n.ref==m._ref).id,magnitud:m.magnitud,roja:m.roja,negra:m.negra||"0 V / COM (ver plano)",esperado:m.esperado,si_no:m.si_no}));
  if(!M.length)return null;
  const tit=(T.match(/^#\s+(.+)$/m)||[,""])[1].replace(/[*`]/g,"").trim();
  return{local:true,titulo:tit||`PBB ${pos||""} · ${tipo||""}`,elemento:(L.find(n=>RANGO[n.tipo]>=6)||{}).ref||"",tension:(plano.match(/\b(24\s?V(?:DC|dc)?|230\s?V(?:AC|ac)?|400\s?V(?:AC|ac)?)\b/)||[,""])[1],
   plano:/\b50[48]\b/.test(String(pos))?"T87911031260 (504/508)":String(pos)=="507"?"T87911031230 (507)":"ESQUEMA GENERAL rev. J",nodos:L.map(({pos,...n})=>n),cables:cab,medidas:M}}
 window.croquisLocal=croquisLocal;
 window.pdfCroquis=dibuja;
})();
