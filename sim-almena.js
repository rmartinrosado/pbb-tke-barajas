/* ===== v174: Simulación del contaje de giro de ruedas · revisada con las fotos del soporte (28/10/2026) =====
 Montaje real: SOLO 5 elementos y TODOS en el mismo SOPORTE FIJO (frente a la almena):
  · 1 final de carrera de rodillo H-S1 (arriba) = único FC de PARO de giro, el mismo para derecha e izquierda (E-A8 DIS05).
  · 4 inductivos en dos columnas × dos filas:
     fila alta  (banda lisa): límite de giro H-B3 (izq.) · H-B4 (dcha.) → tapados dentro de la almena, libres al pasar su extremo.
     fila baja  (pestañas):   contaje H-B1 · H-B2 → columnas separadas 100 mm = 20° (medido en campo 29/10/2026; 4 flancos por pestaña, 3,5° de media).
 MEDIDAS DE CAMPO (29/10/2026): pestaña 35 mm, hueco 35 mm (paso 70 mm = 14° → radio de almena ≈ 286 mm), 13 pestañas,
 separación entre columnas de inductivos 100 mm (= 20°), resalte 70 mm (= 14°), distancia inductivo–almena 2 mm.
 La almena (banda de inox con 13 pestañas de 14°, 182°) gira con el tren de ruedas; en cada extremo un RESALTE hacia fuera
 a la altura del rodillo pisa el FC unos grados después de que el inductivo de límite de ese lado haya cortado (respaldo). */
(function(){
const H=(t,a)=>{const e=document.createElementNS("http://www.w3.org/2000/svg",t);for(const k in a)e.setAttribute(k,a[k]);return e};
const N=13, P=14, W=P/2;            // 13 pestañas, paso 14° (pestaña 7° + hueco 7°)
const E=N*P/2-0.5;                   // fin de la banda lisa (±90,5°)
const R=14;                          // resalte 70 mm medido = 14° (±90,5…±104,5°)
const FL=P/4;                        // grados por flanco de media con H-B1+H-B2 (3,5°; con columnas a 20° los flancos quedan a 6° y 1°)
const SC=10;                         // columna del soporte: ±10° (100 mm medidos entre columnas = 20° con radio ≈ 286 mm)
const V=20;
const nf=x=>String(Math.round(x*100)/100).replace(".",",");
// Los 4 inductivos del soporte fijo (grados desde el eje de la pasarela, horario +). Columna izq.: H-B3 + H-B1 · columna dcha.: H-B4 + H-B2
const SEN={B3:{s:SC,alt:1},B1:{s:SC,alt:0},B4:{s:-SC,alt:1},B2:{s:-SC,alt:0}};
const FCs=0;                         // FC de rodillo, arriba y centrado en el soporte
const pest=a=>{for(let k=0;k<N;k++){const c=-(N-1)*P/2+k*P;if(Math.abs(a-c)<=W/2)return true}return false};
const banda=a=>a>=-E&&a<=E;                         // banda lisa (fila alta): inductivo de límite tapado
const resalte=a=>(a>E&&a<=E+R)||(a<-E&&a>=-E-R);     // resalte (altura del rodillo): pisa el FC

function init(el){
 if(el.dataset.ok)return;el.dataset.ok=1;
 el.innerHTML=`<div class="gsim-h"><b>▶ Simulación del contaje de giro</b><span class="gsim-row"></span></div>
 <svg viewBox="0 0 340 652" role="img" aria-label="Almena con pestañas, soporte fijo con 1 final de carrera y 4 inductivos, y LED del PLC"></svg>
 <div class="gsim-st"></div>
 <div class="gsim-bt"><button data-a="play">⏸ Pausa</button><button data-m="-1">◀ Izquierda</button><button data-m="0">0°</button><button data-m="1">Derecha ▶</button></div>
 <div class="gsim-bt"><button data-f="B3">⚠ Fallo H-B3</button><button data-f="B4">⚠ Fallo H-B4</button><button data-r="1">↺ Rearme FC</button></div>
 <label class="gsim-vel"><span>🐢</span><input type="range" min="1" max="40" step="1" value="${V}" aria-label="Velocidad de la simulación"><span>🐇</span><b>${V} °/s</b></label>
 <div class="mu" style="font-size:11px;margin-top:4px"><b>Soporte fijo: 5 elementos.</b> Arriba el <b>FC de rodillo H-S1</b> (único, paro de giro en los dos sentidos). Debajo, 4 inductivos en dos columnas separadas 100 mm = ${nf(2*SC)}°: <b>fila alta límite</b> H-B3 izq. · H-B4 dcha. (tapados por la banda lisa, se liberan al pasar su extremo y el PLC corta ese sentido); <b>fila baja contaje</b> H-B1 · H-B2 (leen las 13 pestañas en cuadratura, cada flanco = ${nf(FL)}°). Inductivo tapado = LED encendido. Si el de límite no actúa (botón ⚠), ${nf(SC)}° después el resalte pisa el rodillo y abre el FC.</div>`;
 const svg=el.querySelector("svg"),row=el.querySelector(".gsim-row"),st=el.querySelector(".gsim-st");
 const T=(x,y,txt,a,p)=>{const t=H("text",Object.assign({x,y,"font-size":7.5,fill:"var(--mu)"},a||{}));t.textContent=txt;(p||svg).append(t);return t};

 // ===== PLANTA =====
 const CX=118,CY=150;
 const pol=(r,g)=>[CX+r*Math.sin(g*Math.PI/180),CY-r*Math.cos(g*Math.PI/180)];
 const arco=(r1,r2,g1,g2)=>{const[a,b]=pol(r2,g1),[c,d]=pol(r2,g2),[e,f]=pol(r1,g2),[g,h]=pol(r1,g1),l=g2-g1>180?1:0;
  return `M${a},${b} A${r2} ${r2} 0 ${l} 1 ${c},${d} L${e},${f} A${r1} ${r1} 0 ${l} 0 ${g},${h} Z`};
 T(6,10,"PLANTA · almena (gira) y soporte fijo",{"font-size":8.5,fill:"currentColor","font-weight":700});
 for(let g=0;g<360;g+=5){if(g<25||g>335)continue;const L=g%45==0?8:g%15==0?5:3,[x1,y1]=pol(118,g),[x2,y2]=pol(118+L,g);svg.append(H("line",{x1,y1,x2,y2,stroke:"var(--mu)","stroke-width":g%45==0?1.1:.5}))}
 for(let g=45;g<360;g+=45){if(g==180)continue;const[x,y]=pol(134,g);T(x,y+3,g+"°",{"text-anchor":"middle","font-size":6.5})}
 const rot=H("g",{});svg.append(rot);
 // tren de ruedas (debajo, gira con la almena) y columna
 rot.append(H("rect",{x:CX-50,y:CY-4,width:100,height:8,rx:3,fill:"#7b8693",opacity:.55}));
 const rueda=x=>{rot.append(H("rect",{x:x-6,y:CY-17,width:12,height:34,rx:5,fill:"none",stroke:"#7b8693","stroke-width":1.2,"stroke-dasharray":"3 2"}));
  const tr=H("line",{x1:x,y1:CY-15,x2:x,y2:CY+15,stroke:"#7b8693","stroke-width":6,"stroke-dasharray":"1.5 4",opacity:.6});rot.append(tr);return tr};
 const rI=rueda(CX-50),rD=rueda(CX+50);
 [-50,50].forEach(dx=>T(CX+dx,CY+25,"rueda",{"text-anchor":"middle","font-size":5.5},rot));
 rot.append(H("circle",{cx:CX,cy:CY,r:28,fill:"#c9cfd6",stroke:"#8e97a2"}));
 T(CX,CY+3,"columna",{"text-anchor":"middle","font-size":6.5,fill:"#1f2328"},rot);
 // almena: pestañas (dentro), banda lisa, resaltes hacia fuera en los extremos
 for(let k=0;k<N;k++){const c=-(N-1)*P/2+k*P;rot.append(H("path",{d:arco(71,76,c-W/2,c+W/2),fill:"var(--pr)",opacity:.6}))}
 rot.append(H("path",{d:arco(76,80,-E,E),fill:"var(--pr)"}));
 [[E,E+R],[-E-R,-E]].forEach(([a,b])=>rot.append(H("path",{d:arco(80,89,a,b),fill:"#b07cc6",stroke:"var(--pr)","stroke-width":.6})));
 rot.append(H("path",{d:`M${CX},${CY-26} l-5,9 h10 z`,fill:"var(--ac)"}));
 T(...pol(100,-E-R/2),"resalte",{"text-anchor":"middle","font-size":6},rot);
 T(...pol(100,E+R/2),"resalte",{"text-anchor":"middle","font-size":6},rot);
 // soporte fijo con sus 5 elementos
 svg.append(H("path",{d:arco(97,104,-14,14),fill:"#5d6b7d"}));
 const pS={};   // cuerpo = fila alta (límite) · núcleo = fila baja (contaje)
 [[SC,"B3","B1"],[-SC,"B4","B2"]].forEach(([g,a,b])=>{const[x1,y1]=pol(97,g),[x2,y2]=pol(82,g);
  pS[a]=H("line",{x1,y1,x2,y2,stroke:"#5d6b7d","stroke-width":8,"stroke-linecap":"round"});svg.append(pS[a]);
  pS[b]=H("line",{x1,y1,x2,y2,stroke:"#1f2328","stroke-width":3});svg.append(pS[b]);
  const[tx,ty]=pol(112,g*2.6);T(tx,ty,`H-${a}/${b}`,{"text-anchor":"middle","font-size":5.8,fill:"currentColor","font-weight":700})});
 { const[x,y]=pol(108,0);svg.append(H("rect",{x:x-7,y:y-6,width:14,height:9,rx:1.5,fill:"#4c6ef5"})); }
 const pFcB=H("line",{x1:CX,y1:CY-102,x2:CX,y2:CY-88,stroke:"#1f2328","stroke-width":1.3});svg.append(pFcB);
 const pFcR=H("circle",{cx:CX,cy:CY-88,r:2.6,fill:"#1f2328"});svg.append(pFcR);
 T(CX,CY-128,"SOPORTE FIJO · FC + 4 inductivos",{"text-anchor":"middle","font-size":6.5,fill:"currentColor","font-weight":700});
 T(CX,CY-117,"FC H-S1",{"text-anchor":"middle","font-size":5.8,fill:"#4c6ef5","font-weight":700});
 // indicadores
 T(296,30,"ÁNGULO REAL",{"text-anchor":"middle","font-size":7});
 const tAng=T(296,52,"0°",{"text-anchor":"middle","font-size":20,fill:"var(--ac)","font-weight":700});
 T(296,70,"ÁNGULO PLC",{"text-anchor":"middle","font-size":7});
 const tPlcA=T(296,86,"0°",{"text-anchor":"middle","font-size":13,fill:"currentColor","font-weight":700});
 const tPul=T(296,98,"0 flancos",{"text-anchor":"middle","font-size":7});
 T(296,114,"SENTIDO",{"text-anchor":"middle","font-size":7});
 const tSen=T(296,127,"parado",{"text-anchor":"middle","font-size":10,fill:"currentColor","font-weight":700});
 const tLim=T(296,146,"",{"text-anchor":"middle","font-size":8.5,fill:"#e5534b","font-weight":700});
 const tLim2=T(296,156,"",{"text-anchor":"middle","font-size":7,fill:"#e5534b"});
 [[`${N} × ${P}° = ${N*P}°`,1],[`flanco = ${nf(FL)}°`],[`columnas a ±${nf(SC)}°`],[`lím. inductivo ±${nf(E-SC)}°`],[`FC (resalte) ±${nf(E)}°`,0,"#e5534b"],[`±${Math.floor((E-SC)/FL)} flancos hasta límite`]].forEach((x,i)=>T(250,180+i*10,x[0],{"font-size":6.3,fill:x[2]||"currentColor","font-weight":x[1]?700:400}));
 T(296,252,"d = 2 mm (medido)",{"text-anchor":"middle","font-size":7.5,fill:"var(--ac)","font-weight":700});
 T(296,261,"inductivo–almena",{"text-anchor":"middle","font-size":6.5});

 // ===== ALZADO DESARROLLADO (la almena pasa por detrás del soporte) =====
 const AY=294,XC=170,K=2.3;   // ±70° visibles
 T(6,AY-6,"ALZADO desde fuera · almena desarrollada tras el soporte",{"font-size":8.5,fill:"currentColor","font-weight":700});
 const cp=H("clipPath",{id:"almClip"});cp.append(H("rect",{x:4,y:AY,width:332,height:100}));svg.append(cp);
 svg.append(H("rect",{x:4,y:AY,width:332,height:100,rx:3,fill:"none",stroke:"#8e97a2","stroke-width":.6}));
 svg.append(H("rect",{x:4,y:AY,width:332,height:9,fill:"#8e97a2",opacity:.5}));
 T(8,AY+7,"corona de giro",{"font-size":6,fill:"#1f2328"});
 const cl=H("g",{"clip-path":"url(#almClip)"});svg.append(cl);
 cl.append(H("rect",{x:4,y:AY+9,width:332,height:91,fill:"#c9cfd6",opacity:.45}));
 const strip=H("g",{});cl.append(strip);
 const yF=AY+13,hF=13,yB=yF+hF,hB=19,yP=yB+hB,hP=19;  // nivel FC (resalte) / banda lisa (límite) / pestañas (contaje)
 strip.append(H("rect",{x:XC-E*K,y:yF+4,width:2*E*K,height:yB+hB-yF-4,fill:"var(--pr)"}));
 for(let k=0;k<N;k++){const c=-(N-1)*P/2+k*P;strip.append(H("rect",{x:XC+(c-W/2)*K,y:yP,width:W*K,height:hP,fill:"var(--pr)"}))}
 [[E,E+R],[-E-R,-E]].forEach(([a,b])=>{strip.append(H("rect",{x:XC+a*K,y:yF,width:(b-a)*K,height:hF,rx:1.5,fill:"#b07cc6",stroke:"var(--pr)"}));
  T(XC+(a+b)/2*K,yB+12,"resalte",{"text-anchor":"middle","font-size":6,fill:"currentColor"},strip)});
 T(XC+46*K,yP+hP+9,`13 pestañas · paso ${P}°`,{"text-anchor":"middle","font-size":6,fill:"currentColor"},strip);
 T(XC-46*K,yP+hP+9,`13 pestañas · paso ${P}°`,{"text-anchor":"middle","font-size":6,fill:"currentColor"},strip);
 // soporte fijo delante de la almena
 const xs=s=>XC-s*K;   // vista desde fuera: + horario hacia la izquierda
 svg.append(H("rect",{x:xs(13),y:yF-3,width:26*K,height:yP+hP+3-yF+3,rx:3,fill:"#5d6b7d",opacity:.28,stroke:"#5d6b7d"}));
 const sen={};
 for(const k in SEN){const s=SEN[k],x=xs(s.s),y=s.alt?yB+hB/2:yP+hP/2;
  const c=H("circle",{cx:x,cy:y,r:5.6,fill:"#5d6b7d",stroke:"#1f2328","stroke-width":.7});svg.append(c);sen[k]=c;
  T(x,y+2.4,k.slice(1),{"text-anchor":"middle","font-size":6.5,fill:"#fff","font-weight":700})}
 const fcX=xs(FCs),fcY=yF+hF/2;
 svg.append(H("rect",{x:fcX-8,y:fcY-5,width:16,height:10,rx:1.5,fill:"#4c6ef5"}));
 const fcRod=H("circle",{cx:fcX,cy:fcY,r:3,fill:"#1f2328"});svg.append(fcRod);
 T(334,yF+hF/2+2,"FC H-S1",{"font-size":6,"text-anchor":"end",fill:"currentColor","font-weight":700});
 T(334,yB+hB/2+2,"límite",{"font-size":6,"text-anchor":"end",fill:"currentColor"});
 T(334,yP+hP/2+2,"contaje",{"font-size":6,"text-anchor":"end",fill:"currentColor"});
 T(8,AY+97,"◀ derecha (horario)",{"font-size":6,fill:"currentColor"});T(332,AY+97,"izquierda ▶",{"font-size":6,"text-anchor":"end",fill:"currentColor"});

 // ===== FRONTAL PLC =====
 const Y0=416;
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
 modulo(232,104,"Safety E-A8 / E-A6","FC paro y bobinas",[
  ["fc","DIS05 FC paro giro","H-S1 único · IN05S 5.1"],["s1","Bobina E-K1","variadores · hilo 303"],["s2","Bobina E-K24","frenos T-Y1 / T-Y2"]]);
 svg.append(H("rect",{x:236,y:Y0+92,width:96,height:50,rx:3,fill:"#eef1f4"}));
 const tPlc=[0,1,2,3].map(i=>T(240,Y0+102+i*11,"",{"font-size":6,fill:"#1f2328"}));

 // ===== Estado y animación =====
 let g=0,dirVis=0,ed=0,pausa=false,modo="ciclo",fase=0,espera=0,last=performance.now(),fijo=null,tr=0,prev=null,fcAbierto=false;
 const fallo={B3:false,B4:false};
 const FASES=[{d:1},{p:1},{d:-1,h:0},{p:1},{d:-1},{p:1},{d:1,h:0},{p:1}];
 const lee=()=>{const o={};for(const k in SEN){const a=SEN[k].s-g;o[k]=SEN[k].alt?banda(a):pest(a)}
  if(fallo.B3)o.B3=true;if(fallo.B4)o.B4=true;o.FC=resalte(FCs-g);return o};
 const led=(k,on,col)=>{const c=leds[k];c.setAttribute("fill",on?(col||"#39d353"):"#3a3f45");c.style.filter=on?`drop-shadow(0 0 3px ${col||"#39d353"})`:"none"};
 const col=(k,v)=>fallo[k]?"#e5534b":v?"var(--ac)":"#5d6b7d";
 function pinta(){
  rot.setAttribute("transform",`rotate(${g} ${CX} ${CY})`);
  strip.setAttribute("transform",`translate(${-g*K} 0)`);
  const s=lee();if(s.FC)fcAbierto=true;
  if(prev&&dirVis){if(s.B1!==prev.B1)ed+=dirVis;if(s.B2!==prev.B2)ed+=dirVis}prev=s;
  for(const k in SEN){sen[k].setAttribute("fill",col(k,s[k]));pS[k].setAttribute("stroke",SEN[k].alt?col(k,s[k]):(s[k]?"#fff":"#1f2328"))}
  fcRod.setAttribute("fill",s.FC?"#e5534b":"#1f2328");fcRod.setAttribute("r",s.FC?4:3);
  pFcR.setAttribute("cy",s.FC?CY-92:CY-88);pFcB.setAttribute("y2",s.FC?CY-92:CY-88);pFcR.setAttribute("fill",s.FC?"#e5534b":"#1f2328");
  led("i1",s.B3);led("i2",s.B4);led("i3",s.B1);led("i4",s.B2);led("fc",!fcAbierto);
  const mov=dirVis!==0;
  led("o1",dirVis>0);led("o2",dirVis<0);led("o3",dirVis<0);led("o4",dirVis>0);led("o5",mov);led("o6",false);
  led("s1",!fcAbierto);led("s2",mov);
  const ang=Math.round(g),pA=Math.round(ed*FL*10)/10;
  tAng.textContent=ang+"°";tPlcA.textContent=nf(pA)+"°";tPul.textContent=(ed>0?"+":"")+ed+" flancos × "+nf(FL)+"°";
  tSen.textContent=dirVis>0?"derecha ↻":dirVis<0?"izquierda ↺":"parado";
  tLim.textContent=fcAbierto?"FC ABIERTO":!s.B4?"LÍMITE DCHA":!s.B3?"LÍMITE IZQ":"";
  tLim2.textContent=fcAbierto?"paro de seguridad":!s.B4||!s.B3?"corte por inductivo":"";
  const L=[`${ed} flancos × ${nf(FL)}° = ${nf(pA)}°`,
   dirVis>0?"Dcha: U1 adel. + U2 atrás":dirVis<0?"Izq: U1 atrás + U2 adel.":"Sin orden de giro",
   fcAbierto?"DIS05 off: cae E-K1":mov?"E-K24 abre frenos":"Frenos echados",
   fcAbierto?"Resalte pisa el rodillo":!s.B4?"H-B4 libre: corta dcha":!s.B3?"H-B3 libre: corta izq":"Límites tapados: OK"];
  L.forEach((t,i)=>tPlc[i].textContent=t);
  row.textContent=`${ang}° · ${tSen.textContent}`;
  st.innerHTML=`<b>${tLim.textContent||"Dentro de límites"}</b>${tLim2.textContent?" · "+tLim2.textContent:""} · tapados: ${["B1","B2","B3","B4"].filter(k=>s[k]).map(k=>"H-"+k).join(" ")||"ninguno"}${fallo.B3||fallo.B4?" · <b style='color:#e5534b'>simulando fallo "+["B3","B4"].filter(k=>fallo[k]).map(k=>"H-"+k).join(" ")+"</b>":""}`;
  return s}
 function mueve(d,dt){
  const s=lee();
  if(fcAbierto&&(d>0)===(g>0)){dirVis=0;return false}       // con el FC abierto solo se puede salir del tope
  if(d>0&&!s.B4||d<0&&!s.B3){dirVis=0;return false}
  dirVis=d;g+=d*vel*dt;tr+=d*vel*dt*0.6;
  rI.setAttribute("stroke-dashoffset",tr*(d>0?-1:1));rD.setAttribute("stroke-dashoffset",tr*(d>0?1:-1));
  if(lee().FC)fcAbierto=true;return true}
 function paso(t){
  if(!el.isConnected)return;
  const dt=Math.min(.05,(t-last)/1000);last=t;
  if(fcAbierto&&!lee().FC&&Math.abs(g)<E-2)fcAbierto=false;   // rearme al salir del resalte y volver dentro
  if(pausa){dirVis=0;pinta();requestAnimationFrame(paso);return}
  if(modo=="ciclo"){const F=FASES[fase];
   if(F.p){dirVis=0;espera+=dt;if(espera>1.4){espera=0;fase=(fase+1)%FASES.length}}
   else if(F.h===0){if(Math.abs(g)<=vel*dt){g=0;dirVis=0;fase=(fase+1)%FASES.length}else mueve(Math.sign(-g),dt)}
   else if(!mueve(F.d,dt)){fase=(fase+1)%FASES.length}}
  else if(modo=="fijo"){if(fijo===0){if(Math.abs(g)<=vel*dt){g=0;dirVis=0}else mueve(Math.sign(-g),dt)}else if(!mueve(fijo,dt))dirVis=0}
  pinta();requestAnimationFrame(paso)}
 let vel=V;const sl=el.querySelector(".gsim-vel input"),slT=el.querySelector(".gsim-vel b");
 sl.addEventListener("input",()=>{vel=+sl.value;slT.textContent=vel+" °/s"});
 ["click","pointerdown","touchstart"].forEach(ev=>sl.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
 el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;e.preventDefault();e.stopPropagation();
  const pb=el.querySelector("[data-a]");
  if(b.dataset.f){const k=b.dataset.f;fallo[k]=!fallo[k];b.classList.toggle("on",fallo[k]);return}
  if(b.dataset.r){modo="fijo";fijo=0;pausa=false;pb.textContent="▶ Ciclo";return}
  if(b.dataset.a){if(modo=="fijo"){modo="ciclo";pausa=false}else pausa=!pausa;pb.textContent=pausa?"▶ Reanudar":"⏸ Pausa";return}
  modo="fijo";fijo=+b.dataset.m;pausa=false;pb.textContent="▶ Ciclo";
  el.querySelectorAll("[data-m]").forEach(x=>x.classList.toggle("on",x===b))});
 pinta();requestAnimationFrame(paso);
}
const css=document.createElement("style");css.textContent=".gsim-vel{display:flex;align-items:center;gap:6px;margin-top:6px;font-size:12px}.gsim-vel input{flex:1;accent-color:var(--ac)}.gsim-vel b{min-width:44px;text-align:right;color:var(--ac)}.gsim-bt+.gsim-bt{margin-top:4px}";document.head.appendChild(css);
const scan=()=>document.querySelectorAll('.gsim[data-sim="almena"]:not([data-ok])').forEach(init);
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan();
})();
