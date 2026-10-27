/* ===== v79 (dibujo v83 según fotos reales): Simulación animada del brazo autonivelador (ESQUEMA GENERAL rev. J folio 86) =====
 Dibujo del brazo que sigue a la puerta del avión y LED de P-A5 (B8…B13) que cambian según la tabla del folio 86.
 LED encendido = punto gris de la tabla = entrada de P-A5 encendida (sensor NC sin leva delante). */
(function(){
const SENS=["B8","B9","B10","B11","B12","B13"];
const NOM={B8:"arriba 2",B9:"arriba 1",B10:"abajo 2",B11:"abajo 1",B12:"neutral 1",B13:"neutral 2"};
// Tabla del folio 86: entradas encendidas en cada posición
const FILAS=[
 {k:">50",t:"> 50 mm",on:["B12","B13"],c:"Cabina SUBE",d:1},
 {k:">25",t:"> 25 mm",on:["B8","B12","B13"],c:"Cabina SUBE",d:1},
 {k:"0",t:"0 mm",on:["B8","B9"],c:"Nivelada · cabina PARADA",d:0},
 {k:"<25",t:"< 25 mm",on:["B8","B9","B11","B12","B13"],c:"Cabina BAJA",d:-1},
 {k:"<50",t:"< 50 mm",on:SENS,c:"Cabina BAJA",d:-1}];
const fila=mm=>mm>37.5?FILAS[0]:mm>12.5?FILAS[1]:mm>=-12.5?FILAS[2]:mm>=-37.5?FILAS[3]:FILAS[4];
const SEQ=[0,30,55,30,0,-30,-55,-30];// recorrido de la puerta del avión (mm)
const H=(t,a)=>{const e=document.createElementNS("http://www.w3.org/2000/svg",t);for(const k in a)e.setAttribute(k,a[k]);return e};

function init(el){
 if(el.dataset.ok)return;el.dataset.ok=1;
 el.innerHTML=`<div class="gsim-h"><b>▶ Simulación del movimiento</b><span class="gsim-row"></span></div>
 <svg viewBox="0 0 340 196" role="img" aria-label="Simulación del brazo autonivelador y de los LED de P-A5"></svg>
 <div class="gsim-st"></div>
 <div class="gsim-bt"><button data-a="play">⏸ Pausa</button>${FILAS.map((f,i)=>`<button data-f="${i}">${f.t.replace(" mm","")}</button>`).join("")}</div>
 <div class="mu" style="font-size:11px;margin-top:4px">LED verde = entrada de P-A5 encendida (punto gris del plano, sensor sin leva delante). LED apagado = sensor tapado por la leva. <b>Ajuste del inductivo a la leva: 1 mm &lt; distancia &lt; 4 mm</b> (por debajo de 1 mm roza; por encima de 4 mm el IME12-04 no la detecta). Toca una posición para fijarla.</div>`;
 const svg=el.querySelector("svg"),row=el.querySelector(".gsim-row"),st=el.querySelector(".gsim-st");
 // ===== Dibujo según las fotos reales del brazo (vista lateral): soporte bajo el suelo de la cabina, motorreductor SEW (C-M2),
 // mástil de pletina, carcasa hexagonal con la rueda de goma arriba apoyada en el fuselaje; en corte, el disco de la rueda y los inductivos C-B8…C-B13.
 svg.setAttribute("viewBox","0 0 360 212");
 const T=(x,y,txt,a)=>{const t=H("text",Object.assign({x,y,"font-size":7.5,fill:"var(--mu)"},a||{}));t.textContent=txt;svg.append(t);return t};
 // Cabina (parte inferior) y suelo
 svg.append(H("rect",{x:4,y:22,width:76,height:108,rx:5,fill:"var(--pr)",opacity:.22}));
 svg.append(H("rect",{x:4,y:126,width:100,height:9,fill:"#8d97a5"}));
 T(42,16,"CABINA",{"text-anchor":"middle","font-size":9});
 // Soporte del brazo bajo el suelo
 svg.append(H("rect",{x:70,y:135,width:9,height:18,fill:"#9aa3ae"}));
 svg.append(H("rect",{x:66,y:150,width:96,height:8,rx:1,fill:"#b8c0ca",stroke:"#7c8591","stroke-width":.6}));
 // Motorreductor SEW (C-M2) colgado del soporte
 const mot=H("g",{});
 mot.append(H("rect",{x:78,y:158,width:44,height:22,rx:3,fill:"#6f7a86"}));
 for(let i=0;i<7;i++)mot.append(H("line",{x1:84+i*5,y1:160,x2:84+i*5,y2:178,stroke:"#55606b","stroke-width":1.4}));
 mot.append(H("rect",{x:86,y:152,width:16,height:7,rx:1,fill:"#7b8693"}));// caja de bornas
 mot.append(H("rect",{x:122,y:156,width:22,height:26,rx:3,fill:"#7b8693"}));// reductor
 mot.append(H("circle",{cx:76,cy:169,r:9,fill:"#7b8693"}));// tapa ventilador
 svg.append(mot);
 const sew=T(100,172,"SEW",{"text-anchor":"middle","font-size":7,fill:"#e8ecf1","font-weight":700});
 T(100,195,"C-M2 motorreductor SEW",{"text-anchor":"middle"});T(100,204,"(brazo adelante / atrás)",{"text-anchor":"middle"});
 // Mástil (pletina vertical) hasta la carcasa
 svg.append(H("rect",{x:144,y:76,width:8,height:84,fill:"#c3cad3",stroke:"#8a939e","stroke-width":.6}));
 svg.append(H("rect",{x:136,y:126,width:14,height:4,rx:1,fill:"#2b2f36"}));// tirador
 // Manguera corrugada y conector Harting
 svg.append(H("path",{d:"M60,128 C70,95 125,110 138,150 C141,160 146,166 150,163",fill:"none",stroke:"#3d4f57","stroke-width":5,"stroke-linecap":"round"}));
 svg.append(H("path",{d:"M60,128 C70,95 125,110 138,150 C141,160 146,166 150,163",fill:"none",stroke:"#5d7680","stroke-width":5,"stroke-dasharray":"1.2 1.6"}));
 svg.append(H("rect",{x:152,y:150,width:9,height:13,rx:1.5,fill:"#a7afb9",stroke:"#6f7882","stroke-width":.6}));
 // Carcasa hexagonal gris con ranura para la rueda
 svg.append(H("polygon",{points:"126,40 134,24 162,24 170,40 170,68 162,80 134,80 126,68",fill:"#c9ced5",stroke:"#8e97a2","stroke-width":1}));
 svg.append(H("line",{x1:148,y1:24,x2:148,y2:80,stroke:"#a3abb5","stroke-width":.8}));
 // Avión (fuselaje) a la derecha: se mueve arriba / abajo
 const avion=H("g",{});
 avion.append(H("rect",{x:178,y:-120,width:36,height:270,rx:6,fill:"#e4e1d6",stroke:"#b9b3a2"}));
 avion.append(H("rect",{x:186,y:-34,width:22,height:40,rx:4,fill:"none",stroke:"#9b9483","stroke-width":1.2}));// puerta
 avion.append(H("rect",{x:182,y:6,width:30,height:3,fill:"#9b9483"}));// umbral
 const ta=H("text",{x:196,y:110,"text-anchor":"middle","font-size":8,fill:"#5b5446","font-weight":700});ta.textContent="AVIÓN";avion.append(ta);
 svg.append(avion);
 // Rueda de goma (asoma por arriba de la carcasa y rueda contra el fuselaje)
 const WX=166,WY=24,WR=12;
 const rueda=H("g",{});
 rueda.append(H("circle",{cx:0,cy:0,r:WR,fill:"#1f2329"}));
 rueda.append(H("circle",{cx:0,cy:0,r:WR-1.5,fill:"none",stroke:"#4b525c","stroke-width":2.5,"stroke-dasharray":"2 2.2"}));// tacos
 rueda.append(H("circle",{cx:0,cy:0,r:4,fill:"#8e97a2"}));
 rueda.append(H("line",{x1:0,y1:-4,x2:0,y2:-WR+3,stroke:"var(--ac)","stroke-width":2}));// marca de giro
 svg.append(rueda);
 T(150,12,"rueda de goma",{"text-anchor":"end"});
 // Corte interior: disco solidario de la rueda con la leva y los 6 inductivos
 const DX=146,DY=56,DR=9;
 svg.append(H("circle",{cx:DX,cy:DY,r:20,fill:"var(--card)",stroke:"#8e97a2","stroke-dasharray":"2 2"}));
 svg.append(H("line",{x1:DX,y1:DY,x2:WX,y2:WY,stroke:"#8e97a2","stroke-width":1,"stroke-dasharray":"1.5 1.5"}));// transmisión
 svg.append(H("circle",{cx:DX,cy:DY,r:DR,fill:"#5d6b7d"}));
 const leva=H("path",{d:"",fill:"var(--ac)"});svg.append(leva);
 svg.append(H("circle",{cx:DX,cy:DY,r:2,fill:"#fff"}));
 const ANG={B8:-150,B9:-110,B10:-30,B11:10,B12:110,B13:150},ind={};
 SENS.forEach(s=>{const r=ANG[s]*Math.PI/180,x=DX+16*Math.cos(r),y=DY+16*Math.sin(r);
  const g=H("rect",{x:x-3,y:y-3,width:6,height:6,rx:1,fill:"#2c333c",stroke:"#9aa3ae","stroke-width":.6,transform:`rotate(${ANG[s]} ${x} ${y})`});svg.append(g);ind[s]=g;
  const lx=DX+25*Math.cos(r),ly=DY+25*Math.sin(r)+2.5;T(lx,ly,s.slice(1),{"text-anchor":"middle","font-size":6,fill:"var(--tx)"})});
 T(124,84,"carcasa: disco e",{"text-anchor":"end","font-size":6.5});T(124,92,"inductivos C-B8…B13",{"text-anchor":"end","font-size":6.5});T(124,100,"(esquema)",{"text-anchor":"end","font-size":6.5});
 // Escala mm y flecha de la cabina
 const esc=H("text",{x:196,y:0,"text-anchor":"middle","font-size":10,fill:"var(--tx)","font-weight":700});svg.append(esc);
 const fl=H("text",{x:42,y:86,"text-anchor":"middle","font-size":26,fill:"var(--ac)","font-weight":700});svg.append(fl);
 // Panel de LED P-A5
 const pt=H("text",{x:288,y:16,"text-anchor":"middle","font-size":9,fill:"var(--mu)"});pt.textContent="P-A5 · LED";svg.append(pt);
 const leds={};
 SENS.forEach((s,i)=>{const y=32+i*27;
  svg.append(H("rect",{x:224,y:y-10,width:132,height:20,rx:6,fill:"var(--card)",stroke:"var(--bd,#444)"}));
  const c=H("circle",{cx:238,cy:y,r:6,fill:"#333"});
  const t=H("text",{x:250,y:y+3.5,"font-size":9.5,fill:"var(--tx)"});t.textContent=`${s} · ${NOM[s]}`;
  svg.append(c,t);leds[s]=c});
 let mm=0,objIdx=0,obj=SEQ[0],pausa=false,fija=null,espera=0,prev="",last=performance.now();
 function pinta(){
  const k=.5;// px por mm
  avion.setAttribute("transform",`translate(0,${-mm*k})`);
  const g=-mm*k/WR*180/Math.PI;// la rueda gira al rodar contra el fuselaje
  rueda.setAttribute("transform",`translate(${WX},${WY}) rotate(${g})`);
  const a=(g-90)*Math.PI/180,a0=a-0.6,a1=a+0.6;
  leva.setAttribute("d",`M${DX},${DY} L${DX+DR*Math.cos(a0)},${DY+DR*Math.sin(a0)} A${DR} ${DR} 0 0 1 ${DX+DR*Math.cos(a1)},${DY+DR*Math.sin(a1)} Z`);
  esc.setAttribute("y",62-mm*k);esc.textContent=(mm>0?"+":"")+Math.round(mm)+" mm";
  const f=fila(mm);
  if(f.k!==prev){prev=f.k;
   SENS.forEach(s=>{const on=f.on.includes(s),c=leds[s];c.setAttribute("fill",on?"#39d353":"#333");c.style.filter=on?"drop-shadow(0 0 4px #39d353)":"none";
    c.animate([{r:9},{r:6}],{duration:350});ind[s].setAttribute("fill",on?"#2c333c":"var(--ac)")});
   row.textContent="Fila del plano: "+f.t;fl.textContent=f.d>0?"↑":f.d<0?"↓":"■";
   st.innerHTML=`<b>${f.c}</b> · tapados: ${SENS.filter(s=>!f.on.includes(s)).join(" ")||"ninguno"} · encendidos: ${f.on.join(" ")}`;
   el.querySelectorAll("[data-f]").forEach(b=>b.classList.toggle("on",FILAS[+b.dataset.f]===f))}
 }
 function paso(t){
  if(!el.isConnected)return;// se paró al cerrar la caja o cambiar de pantalla
  const dt=Math.min(.05,(t-last)/1000);last=t;
  if(!pausa){const meta=fija!=null?fija:obj,v=40*dt,dif=meta-mm;
   if(Math.abs(dif)<=v){mm=meta;if(fija==null){espera+=dt;if(espera>1.1){espera=0;objIdx=(objIdx+1)%SEQ.length;obj=SEQ[objIdx]}}}
   else mm+=Math.sign(dif)*v}
  pinta();requestAnimationFrame(paso)}
 el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;e.preventDefault();e.stopPropagation();
  const pb=el.querySelector("[data-a]");
  if(b.dataset.a){if(fija!=null){fija=null;pausa=false}else pausa=!pausa;pb.textContent=pausa?"▶ Reanudar":"⏸ Pausa";return}
  fija=[55,30,0,-30,-55][+b.dataset.f];pausa=false;pb.textContent="▶ Ciclo"});
 pinta();requestAnimationFrame(paso);
}
const st=document.createElement("style");
st.textContent=".gsim{margin:8px 0;padding:8px;border:1px solid var(--bd,#444);border-radius:10px;background:var(--card)}.gsim-h{display:flex;justify-content:space-between;gap:6px;flex-wrap:wrap;font-size:13px;margin-bottom:4px}.gsim-row{color:var(--ac);font-weight:700}.gsim svg{display:block;width:100%;height:auto}.gsim-st{font-size:12.5px;margin:4px 0}.gsim-bt{display:flex;flex-wrap:wrap;gap:5px}.gsim-bt button{font:inherit;font-size:12px;padding:4px 9px;border-radius:8px;border:1px solid var(--pr);background:transparent;color:var(--tx);cursor:pointer}.gsim-bt button.on{background:var(--pr);color:#fff}";
document.head.appendChild(st);
const scan=()=>document.querySelectorAll(".gsim[data-sim]:not([data-ok])").forEach(init);
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan();
})();
