/* ===== v123: Simulación del contaje de grados del giro de ruedas (almena e inductivos de traslación, folio 61) =====
 Planta de la almena con los inductivos de contaje H-B1 / H-B2 y los finales de límite de giro H-B3 (izquierda) / H-B4 (derecha),
 tren de ruedas (T-M1 / T-M2) girando de 0° a 360° y frontal de los módulos del PLC con sus LED:
  E-A3 módulo 4 (entradas 7.1 · 8.1 · 7.4 · 8.4), E-A1 módulo 1 (órdenes a los variadores U1 / U2) y E-A6 módulo 1 (E-K1 / E-K24).
 Lógica de la simulación: inductivo tapado por la almena = entrada encendida. El límite se apaga al salir del final de la almena.
 El giro a derecha se representa con la rueda izquierda adelante (U1) y la derecha atrás (U2), y al revés a izquierda. */
(function(){
const H=(t,a)=>{const e=document.createElementNS("http://www.w3.org/2000/svg",t);for(const k in a)e.setAttribute(k,a[k]);return e};
const LIM=95;            // giro máximo a cada lado (grados) en la simulación
const PASO=10;           // un diente + un hueco = 10° (cada flanco = 5°)
const CX=126,CY=160,V=28;// centro de la almena y velocidad de giro (°/s)
const pol=(r,g)=>[CX+r*Math.sin(g*Math.PI/180),CY-r*Math.cos(g*Math.PI/180)];
const arco=(r1,r2,g1,g2)=>{const[a,b]=pol(r2,g1),[c,d]=pol(r2,g2),[e,f]=pol(r1,g2),[g,h]=pol(r1,g1),l=g2-g1>180?1:0;
 return `M${a},${b} A${r2} ${r2} 0 ${l} 1 ${c},${d} L${e},${f} A${r1} ${r1} 0 ${l} 0 ${g},${h} Z`};
// Sensores fijos (ángulo en planta, medido desde el eje de la pasarela, sentido horario)
const SEN={B1:{g:0,r:[101,111],t:"H-B1"},B2:{g:-7.5,r:[101,111],t:"H-B2"},B3:{g:-20,r:[63,73],t:"H-B3"},B4:{g:20,r:[75,85],t:"H-B4"}};
// La almena gira con el tren: dientes de contaje (exterior) y banda de límite (interior)
const diente=a=>{if(a<-130||a>130)return false;const m=((a%PASO)+PASO)%PASO;return m>=PASO/4&&m<PASO*3/4};// flancos a 2,5° · 7,5°…: el 0° queda entre flancos
// dos pistas de límite: la de H-B4 termina en -(LIM-20)° y la de H-B3 en +(LIM-20)° (final de la almena)
const banda=(k,a)=>k=="B4"?a>=-(LIM-20)&&a<=130:a>=-130&&a<=(LIM-20);

function init(el){
 if(el.dataset.ok)return;el.dataset.ok=1;
 el.innerHTML=`<div class="gsim-h"><b>▶ Simulación del contaje de giro</b><span class="gsim-row"></span></div>
 <svg viewBox="0 0 340 462" role="img" aria-label="Planta de la almena, tren de ruedas girando y LED de los módulos del PLC"></svg>
 <div class="gsim-st"></div>
 <div class="gsim-bt"><button data-a="play">⏸ Pausa</button><button data-m="-1">◀ Izquierda</button><button data-m="0">0°</button><button data-m="1">Derecha ▶</button></div>
 <label class="gsim-vel"><span>🐢</span><input type="range" min="1" max="40" step="1" value="${V}" aria-label="Velocidad de la simulación"><span>🐇</span><b>${V} °/s</b></label>
 <div class="mu" style="font-size:11px;margin-top:4px">Inductivo tapado por la almena = LED encendido. Contaje: cada flanco de H-B1 = 5°; H-B2 está desfasado medio diente para saber el sentido. Límite: cada final lee su pista de la almena; H-B4 se apaga al salir del final de su pista girando a derecha y H-B3 girando a izquierda y el PLC corta la orden de giro. Los ±${LIM}° son de ejemplo: el tope real lo da la almena de cada PBB.</div>`;
 const svg=el.querySelector("svg"),row=el.querySelector(".gsim-row"),st=el.querySelector(".gsim-st");
 const T=(x,y,txt,a,p)=>{const t=H("text",Object.assign({x,y,"font-size":7.5,fill:"var(--mu)"},a||{}));t.textContent=txt;(p||svg).append(t);return t};

 // ===== Planta =====
 T(6,10,"PLANTA · tren de ruedas y almena",{"font-size":8.5,fill:"currentColor","font-weight":700});
 // Esfera fija 0-360°
 for(let g=0;g<360;g+=5){const L=g%45==0?9:g%15==0?6:3,[x1,y1]=pol(119,g),[x2,y2]=pol(119+L,g);svg.append(H("line",{x1,y1,x2,y2,stroke:"var(--mu)","stroke-width":g%45==0?1.2:.6}))}
 for(let g=0;g<360;g+=45){const[x,y]=pol(134,g);T(x,y+3,g+"°",{"text-anchor":"middle","font-size":7})}
 // Zonas fuera de límite (rojo) sobre la esfera
 svg.append(H("path",{d:arco(116,119,LIM,360-LIM),fill:"#e5534b",opacity:.55}));
  // Grupo que gira: almena + tren
 const rot=H("g",{});svg.append(rot);
 rot.append(H("circle",{cx:CX,cy:CY,r:98,fill:"none",stroke:"#8e97a2","stroke-width":.6,"stroke-dasharray":"2 2"}));
 for(let a=-130;a<130;a+=PASO)rot.append(H("path",{d:arco(91,100,a+PASO/4,a+PASO*3/4),fill:"var(--pr)"}));// dientes
 rot.append(H("path",{d:arco(88,91,-130,130),fill:"var(--pr)"}));// corona
 rot.append(H("path",{d:arco(76,84,-(LIM-20),130),fill:"var(--pr)",opacity:.8}));// pista límite dcha (H-B4)
 rot.append(H("path",{d:arco(64,72,-130,LIM-20),fill:"var(--pr)",opacity:.55}));// pista límite izq (H-B3)
 // Tren de ruedas
 rot.append(H("rect",{x:CX-44,y:CY-7,width:88,height:14,rx:3,fill:"#7b8693"}));
 rot.append(H("rect",{x:CX-8,y:CY-30,width:16,height:60,rx:3,fill:"#8d97a5"}));
 const rueda=(x)=>{const g=H("g",{});g.append(H("rect",{x:x-7,y:CY-22,width:14,height:44,rx:4,fill:"#2b2f36"}));
  const tr=H("line",{x1:x,y1:CY-21,x2:x,y2:CY+21,stroke:"#9aa3ae","stroke-width":10,"stroke-dasharray":"2 4"});g.append(tr);rot.append(g);return tr};
 const rI=rueda(CX-50),rD=rueda(CX+50);
 const fl=H("path",{d:`M${CX},${CY-60} l-6,10 h12 z`,fill:"var(--ac)"});rot.append(fl);
 rot.append(H("line",{x1:CX,y1:CY-52,x2:CX,y2:CY-30,stroke:"var(--ac)","stroke-width":2}));
 rot.append(H("circle",{cx:CX,cy:CY,r:4,fill:"currentColor"}));
 const tI=T(CX-50,CY+32,"T-M1 · U1",{"text-anchor":"middle","font-size":6.5},rot),tD=T(CX+50,CY+32,"T-M2 · U2",{"text-anchor":"middle","font-size":6.5},rot);
 // Sensores fijos
 const sen={};
 for(const k in SEN){const s=SEN[k],[x,y]=pol((s.r[0]+s.r[1])/2,s.g);
  const r=H("rect",{x:x-4,y:y-6,width:8,height:12,rx:1.5,fill:"#5d6b7d",transform:`rotate(${s.g} ${x} ${y})`});svg.append(r);sen[k]=r;
  T(x,y+2.5,s.t.slice(-1),{"text-anchor":"middle","font-size":7,fill:"#fff","font-weight":700})}
 { const[x,y]=pol(66,-20);T(x-4,y-8,"H-B3 lím. izq",{"font-size":6.5,fill:"currentColor","text-anchor":"end"});}
 { const[x,y]=pol(90,20);T(x+4,y-8,"H-B4 lím. dcha",{"font-size":6.5,fill:"currentColor"});}
 // Indicador a la derecha
 T(304,40,"ÁNGULO",{"text-anchor":"middle","font-size":7.5});
 const tAng=T(304,64,"0°",{"text-anchor":"middle","font-size":22,fill:"var(--ac)","font-weight":700});
 T(304,84,"PULSOS H-B1",{"text-anchor":"middle","font-size":7});
 const tPul=T(304,98,"0",{"text-anchor":"middle","font-size":13,fill:"currentColor","font-weight":700});
 T(304,116,"SENTIDO",{"text-anchor":"middle","font-size":7});
 const tSen=T(304,130,"parado",{"text-anchor":"middle","font-size":10,fill:"currentColor","font-weight":700});
 const tLim=T(304,150,"",{"text-anchor":"middle","font-size":9,fill:"#e5534b","font-weight":700});
 [["Sensores fijos",1],["1 · 2  contaje H-B1 / B2"],["3  H-B3 límite izq."],["4  H-B4 límite dcha."],["naranja = tapado",0,"var(--ac)"],[`Topes ${LIM}° / ${360-LIM}°`,0,"#e5534b"]].forEach((x,i)=>T(272,172+i*10,x[0],{"font-size":6.4,fill:x[2]||"currentColor","font-weight":x[1]?700:400}));
 T(304,240,"1 mm < d < 4 mm",{"text-anchor":"middle","font-size":7.5,fill:"var(--ac)","font-weight":700});
 T(304,250,"sensor–almena",{"text-anchor":"middle","font-size":6.5});

 // ===== Frontal de los módulos del PLC =====
 const Y0=312;
 T(6,Y0-6,"FRONTAL PLC (armario E) · LED en vivo",{"font-size":8.5,fill:"currentColor","font-weight":700});
 const leds={};
 const modulo=(x,w,tit,sub,filas)=>{
  svg.append(H("rect",{x,y:Y0,width:w,height:146,rx:4,fill:"#d9dee3",stroke:"#8e97a2"}));
  svg.append(H("rect",{x,y:Y0,width:w,height:22,rx:4,fill:"#2f9e44"}));
  T(x+5,Y0+10,tit,{"font-size":7.5,fill:"#fff","font-weight":700});T(x+5,Y0+19,sub,{"font-size":6,fill:"#e6ffe9"});
  filas.forEach((f,i)=>{const y=Y0+34+i*19;
   svg.append(H("rect",{x:x+4,y:y-7,width:w-8,height:16,rx:2,fill:"#eef1f4"}));
   const c=H("circle",{cx:x+12,cy:y+1,r:4.5,fill:"#3a3f45",stroke:"#1f2328","stroke-width":.6});svg.append(c);leds[f[0]]=c;
   T(x+20,y-0.5,f[1],{"font-size":6.4,fill:"#1f2328","font-weight":700});T(x+20,y+6.5,f[2],{"font-size":5.6,fill:"#4b5563"})})};
 modulo(4,112,"E-A3 · módulo 4","entradas · IB IL 24 DI 16",[
  ["i1","1 Límite izq.","H-B3 · borna 7.1 · hilo 281"],["i2","2 Límite dcha.","H-B4 · borna 8.1 · hilo 282"],
  ["i3","3 Contaje 1","H-B1 · borna 7.4 · hilo 283"],["i4","4 Contaje 2","H-B2 · borna 8.4 · hilo 284"]]);
 modulo(120,108,"E-A1 · módulo 1","salidas a variadores",[
  ["o1","1 U1 adelante","borna 1.1 → E-U1 LI1"],["o2","2 U1 atrás","borna 2.1 → E-U1 LI2"],
  ["o3","3 U2 adelante","borna 1.2 → E-U2 LI1"],["o4","4 U2 atrás","borna 2.2 → E-U2 LI2"],
  ["o5","5 / 7 Velocidad 1","bornas 1.3 / 1.4 (U1 / U2)"],["o6","6 / 8 Velocidad 2","bornas 2.3 / 2.4 (parado en giro)"]]);
 modulo(232,104,"E-A6 · módulo 1","salidas safety",[
  ["s1","1 Bobina E-K1","variadores · 1.1 · hilo 303"],["s2","2 Bobina E-K24","frenos T-Y1 / T-Y2 · 2.1"]]);
 svg.append(H("rect",{x:236,y:Y0+80,width:96,height:60,rx:3,fill:"#eef1f4"}));
 const tPlc=[0,1,2,3].map(i=>T(240,Y0+92+i*12,"",{"font-size":6.2,fill:"#1f2328"}));

 // ===== Estado y animación =====
 let g=0,dir=0,pul=0,pausa=false,modo="ciclo",fase=0,espera=0,last=performance.now(),dirVis=0,prevB1=null,lim="",fijo=null,tr=0;
 const FASES=[{d:1},{p:1},{d:-1,h:0},{p:1},{d:-1},{p:1},{d:1,h:0},{p:1}];
 const tapa=k=>{const s=SEN[k],a=s.g-g;return k=="B1"||k=="B2"?diente(a):banda(k,a)};
 const led=(k,on,col)=>{const c=leds[k];c.setAttribute("fill",on?(col||"#39d353"):"#3a3f45");c.style.filter=on?`drop-shadow(0 0 3px ${col||"#39d353"})`:"none"};
 function pinta(){
  rot.setAttribute("transform",`rotate(${g} ${CX} ${CY})`);
  const s={B1:tapa("B1"),B2:tapa("B2"),B3:tapa("B3"),B4:tapa("B4")};
  for(const k in s)sen[k].setAttribute("fill",s[k]?"var(--ac)":"#5d6b7d");
  if(prevB1!==null&&s.B1!==prevB1&&dirVis)pul+=dirVis;prevB1=s.B1;
  led("i1",s.B3);led("i2",s.B4);led("i3",s.B1);led("i4",s.B2);
  const mov=dirVis!==0;
  led("o1",dirVis>0);led("o2",dirVis<0);led("o3",dirVis<0);led("o4",dirVis>0);led("o5",mov);led("o6",false);
  led("s1",true);led("s2",mov);
  const ang=((Math.round(pul*5)%360)+360)%360;tAng.textContent=ang+"°";tPul.textContent=(pul>0?"+":"")+pul;
  tSen.textContent=dirVis>0?"derecha ↻":dirVis<0?"izquierda ↺":"parado";
  tLim.textContent=!s.B4?"LÍMITE DCHA":!s.B3?"LÍMITE IZQ":"";
  rI.setAttribute("stroke-dashoffset",tr*(dirVis>0?-1:1));rD.setAttribute("stroke-dashoffset",tr*(dirVis>0?1:-1));
  const L=[`${pul} flancos × 5° = ${ang}°`,
   dirVis>0?"Dcha: U1 adel. + U2 atrás":dirVis<0?"Izq: U1 atrás + U2 adel.":"Sin orden de giro",
   mov?"E-K24 abre frenos":"Frenos echados",
   !s.B4?"H-B4 libre: corta dcha":!s.B3?"H-B3 libre: corta izq":"Límites tapados: OK"];
  L.forEach((t,i)=>tPlc[i].textContent=t);
  row.textContent=`${ang}° · ${tSen.textContent}`;
  st.innerHTML=`<b>${tLim.textContent||"Dentro de límites"}</b> · tapados: ${["B1","B2","B3","B4"].filter(k=>s[k]).map(k=>"H-"+k).join(" ")||"ninguno"} · contaje 1 ${s.B1?"●":"○"} contaje 2 ${s.B2?"●":"○"}`;
  return s}
 function mueve(d,dt){
  // el PLC solo da orden si el límite de ese lado está tapado
  const s={B3:tapa("B3"),B4:tapa("B4")};
  if(d>0&&!s.B4||d<0&&!s.B3){dirVis=0;return false}
  dirVis=d;g+=d*vel*dt;tr+=d*vel*dt*0.6;return true}
 function paso(t){
  if(!el.isConnected)return;
  const dt=Math.min(.05,(t-last)/1000);last=t;
  if(pausa){dirVis=0;pinta();requestAnimationFrame(paso);return}
  if(modo=="ciclo"){const F=FASES[fase];
   if(F.p){dirVis=0;espera+=dt;if(espera>1.2){espera=0;fase=(fase+1)%FASES.length}}
   else if(F.h===0){const sig=Math.sign(0-g);if(Math.abs(g)<=vel*dt){g=0;dirVis=0;fase=(fase+1)%FASES.length}else mueve(sig,dt)}
   else if(!mueve(F.d,dt)){fase=(fase+1)%FASES.length}}
  else if(modo=="fijo"){if(fijo===0){if(Math.abs(g)<=vel*dt){g=0;dirVis=0}else mueve(Math.sign(-g),dt)}else if(!mueve(fijo,dt))dirVis=0}
  pinta();requestAnimationFrame(paso)}
 let vel=V;const sl=el.querySelector(".gsim-vel input"),slT=el.querySelector(".gsim-vel b");
 sl.addEventListener("input",()=>{vel=+sl.value;slT.textContent=vel+" °/s"});
 ["click","pointerdown","touchstart"].forEach(ev=>sl.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
 el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;e.preventDefault();e.stopPropagation();
  const pb=el.querySelector("[data-a]");
  if(b.dataset.a){if(modo=="fijo"){modo="ciclo";pausa=false}else pausa=!pausa;pb.textContent=pausa?"▶ Reanudar":"⏸ Pausa";return}
  modo="fijo";fijo=+b.dataset.m;pausa=false;pb.textContent="▶ Ciclo";
  el.querySelectorAll("[data-m]").forEach(x=>x.classList.toggle("on",x===b))});
 pinta();requestAnimationFrame(paso);
}
const css=document.createElement("style");css.textContent=".gsim-vel{display:flex;align-items:center;gap:6px;margin-top:6px;font-size:12px}.gsim-vel input{flex:1;accent-color:var(--ac)}.gsim-vel b{min-width:44px;text-align:right;color:var(--ac)}";document.head.appendChild(css);
const scan=()=>document.querySelectorAll('.gsim[data-sim="almena"]:not([data-ok])').forEach(init);
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan();
})();
