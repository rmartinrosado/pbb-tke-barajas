/* ===== v143: Simulación del contaje de giro de ruedas · almena real (fotos de campo 28/10/2026) =====
 Montaje real: la almena es una BANDA CILÍNDRICA de inox abrazada a la columna giratoria del tren de ruedas, bajo la corona de giro,
 con 13 pestañas colgando hacia abajo. En cada extremo la banda tiene un RESALTE que sale hacia fuera (libera la circunferencia):
 ese resalte pisa el rodillo del ÚNICO final de carrera de límite (mismo FC para derecha e izquierda), respaldo por si un inductivo no actúa.
 Los 4 inductivos van en el MISMO SOPORTE, fijo a la estructura superior, a dos alturas:
  · altura alta (banda lisa): límite de giro H-B3 (izq.) / H-B4 (dcha.) → tapados dentro de la almena, libres al llegar al resalte.
  · altura baja (pestañas): contaje H-B1 / H-B2, desfasados 1/4 de paso para dar sentido y 4 flancos por pestaña.
 FC H-S1 = E-A8 DIS05 (IN05S 5.1 · hilo 625 · E-X55:12 / UT1 5.2 · hilo 285 · E-X55:13), confirmado en plano.
 Paso confirmado en campo: 14° por pestaña (pestaña 7° + hueco 7°), 13 pestañas = 182° de almena; flanco H-B1+H-B2 = 3,5°. */
(function(){
const H=(t,a)=>{const e=document.createElementNS("http://www.w3.org/2000/svg",t);for(const k in a)e.setAttribute(k,a[k]);return e};
const N=13, P=14, W=P/2;            // 13 pestañas, paso 14° (pestaña 7° + hueco 7°)
const E=N*P/2-0.5;                   // fin de la banda lisa (±90°)
const R=10;                          // ancho angular del resalte (±90…±100°)
const FL=P/4;                        // grados por flanco con H-B1+H-B2 (3,5°)
const V=20;
// Posición fija de cada elemento del soporte (grados desde el eje de la pasarela, horario +)
const SEN={B4:{s:-6,alt:1,t:"H-B4",d:"lím. dcha"},B3:{s:6,alt:1,t:"H-B3",d:"lím. izq"},B1:{s:-FL/2,alt:0,t:"H-B1",d:"contaje 1"},B2:{s:FL/2,alt:0,t:"H-B2",d:"contaje 2"}};
const FCs=0;
// Lectura de la almena en ángulo relativo a (marco de la almena)
const pest=a=>{for(let k=0;k<N;k++){const c=-(N-1)*P/2+k*P;if(Math.abs(a-c)<=W/2)return true}return false};
const banda=a=>a>=-E&&a<=E;                         // banda lisa a 1-4 mm: inductivo tapado
const resalte=a=>(a>E&&a<=E+R)||(a<-E&&a>=-E-R);     // resalte: pisa el rodillo del FC

function init(el){
 if(el.dataset.ok)return;el.dataset.ok=1;
 el.innerHTML=`<div class="gsim-h"><b>▶ Simulación del contaje de giro</b><span class="gsim-row"></span></div>
 <svg viewBox="0 0 340 600" role="img" aria-label="Almena de banda con pestañas, soporte de 4 inductivos y final de carrera, y LED del PLC"></svg>
 <div class="gsim-st"></div>
 <div class="gsim-bt"><button data-a="play">⏸ Pausa</button><button data-m="-1">◀ Izquierda</button><button data-m="0">0°</button><button data-m="1">Derecha ▶</button></div>
 <div class="gsim-bt"><button data-f="B3">⚠ Fallo H-B3</button><button data-f="B4">⚠ Fallo H-B4</button><button data-r="1">↺ Rearme FC</button></div>
 <label class="gsim-vel"><span>🐢</span><input type="range" min="1" max="40" step="1" value="${V}" aria-label="Velocidad de la simulación"><span>🐇</span><b>${V} °/s</b></label>
 <div class="mu" style="font-size:11px;margin-top:4px">Inductivo tapado por la almena = LED encendido. <b>Contaje</b> (altura baja): H-B1 y H-B2 leen las 13 pestañas desfasados ¼ de paso; cada flanco = ${FL}°. <b>Límite</b> (altura alta): H-B4 / H-B3 se liberan al llegar al resalte de su extremo y el PLC corta el giro. <b>Respaldo</b>: si un inductivo de límite no actúa (botón ⚠), unos grados después el resalte pisa el rodillo del único FC y corta por seguridad. Paso confirmado: 14° por pestaña.</div>`;
 const svg=el.querySelector("svg"),row=el.querySelector(".gsim-row"),st=el.querySelector(".gsim-st");
 const T=(x,y,txt,a,p)=>{const t=H("text",Object.assign({x,y,"font-size":7.5,fill:"var(--mu)"},a||{}));t.textContent=txt;(p||svg).append(t);return t};

 // ===== PLANTA =====
 const CX=118,CY=130;
 const pol=(r,g)=>[CX+r*Math.sin(g*Math.PI/180),CY-r*Math.cos(g*Math.PI/180)];
 const arco=(r1,r2,g1,g2)=>{const[a,b]=pol(r2,g1),[c,d]=pol(r2,g2),[e,f]=pol(r1,g2),[g,h]=pol(r1,g1),l=g2-g1>180?1:0;
  return `M${a},${b} A${r2} ${r2} 0 ${l} 1 ${c},${d} L${e},${f} A${r1} ${r1} 0 ${l} 0 ${g},${h} Z`};
 T(6,10,"PLANTA · columna giratoria y almena",{"font-size":8.5,fill:"currentColor","font-weight":700});
 for(let g=0;g<360;g+=5){const L=g%45==0?8:g%15==0?5:3,[x1,y1]=pol(106,g),[x2,y2]=pol(106+L,g);svg.append(H("line",{x1,y1,x2,y2,stroke:"var(--mu)","stroke-width":g%45==0?1.1:.5}))}
 for(let g=0;g<360;g+=45){if(g==0)continue;const[x,y]=pol(120,g);T(x,y+3,g+"°",{"text-anchor":"middle","font-size":6.5})}
 const rot=H("g",{});svg.append(rot);
 // tren de ruedas (debajo) y columna
 rot.append(H("rect",{x:CX-46,y:CY-6,width:92,height:12,rx:3,fill:"#7b8693"}));
 const rueda=x=>{rot.append(H("rect",{x:x-7,y:CY-20,width:14,height:40,rx:4,fill:"#2b2f36"}));
  const tr=H("line",{x1:x,y1:CY-19,x2:x,y2:CY+19,stroke:"#9aa3ae","stroke-width":10,"stroke-dasharray":"2 4"});rot.append(tr);return tr};
 const rI=rueda(CX-52),rD=rueda(CX+52);
 rot.append(H("circle",{cx:CX,cy:CY,r:30,fill:"#c9cfd6",stroke:"#8e97a2"}));
 T(CX,CY+3,"columna",{"text-anchor":"middle","font-size":6.5,fill:"#1f2328"},rot);
 // almena: banda (r 76-80), pestañas marcadas en el borde, resaltes (r 80-88)
 rot.append(H("path",{d:arco(76,80,-E,E),fill:"var(--pr)"}));
 for(let k=0;k<N;k++){const c=-(N-1)*P/2+k*P;rot.append(H("path",{d:arco(71,76,c-W/2,c+W/2),fill:"var(--pr)",opacity:.6}))}
 [[E,E+R],[-E-R,-E]].forEach(([a,b])=>rot.append(H("path",{d:arco(80,88,a,b),fill:"#b07cc6",stroke:"var(--pr)","stroke-width":.6})));
 const fl=H("path",{d:`M${CX},${CY-28} l-5,9 h10 z`,fill:"var(--ac)"});rot.append(fl);
 T(...pol(98,-E-R/2-8),"resalte",{"text-anchor":"middle","font-size":6},rot);
 T(...pol(98,E+R/2+8),"resalte",{"text-anchor":"middle","font-size":6},rot);
 // soporte fijo (arriba, 0°)
 { const[x,y]=pol(96,0);svg.append(H("rect",{x:x-20,y:y-10,width:40,height:12,rx:2,fill:"#5d6b7d"}));
   T(x,y-1.5,"SOPORTE",{"text-anchor":"middle","font-size":6,fill:"#fff","font-weight":700});
   T(x,y-14,"4 inductivos + FC",{"text-anchor":"middle","font-size":6.5,fill:"currentColor"}); }
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
 [[`${N} pestañas × ${P}°`,1],[`flanco = ${FL}°`],[`lím. inductivo ±${E-6}°`],[`FC (resalte) ±${E}°`,0,"#e5534b"]].forEach((x,i)=>T(256,178+i*10,x[0],{"font-size":6.5,fill:x[2]||"currentColor","font-weight":x[1]?700:400}));
 T(296,226,"1 mm < d < 4 mm",{"text-anchor":"middle","font-size":7.5,fill:"var(--ac)","font-weight":700});
 T(296,235,"inductivo–banda",{"text-anchor":"middle","font-size":6.5});

 // ===== ALZADO DESARROLLADO (la banda pasa por delante del soporte) =====
 const AY=262,XC=170,K=2.3;   // ±70° visibles
 T(6,AY-6,"ALZADO desde fuera · banda desarrollada frente al soporte",{"font-size":8.5,fill:"currentColor","font-weight":700});
 const cp=H("clipPath",{id:"almClip"});cp.append(H("rect",{x:4,y:AY,width:332,height:96}));svg.append(cp);
 svg.append(H("rect",{x:4,y:AY,width:332,height:96,rx:3,fill:"none",stroke:"#8e97a2","stroke-width":.6}));
 svg.append(H("rect",{x:4,y:AY,width:332,height:9,fill:"#8e97a2",opacity:.5}));
 T(8,AY+7,"corona de giro (fija arriba)",{"font-size":6,fill:"#1f2328"});
 const cl=H("g",{"clip-path":"url(#almClip)"});svg.append(cl);
 cl.append(H("rect",{x:4,y:AY+9,width:332,height:87,fill:"#c9cfd6",opacity:.45}));   // columna
 const strip=H("g",{});cl.append(strip);
 const yB=AY+16,hB=20,yP=yB+hB,hP=20;  // banda lisa / pestañas
 strip.append(H("rect",{x:XC-E*K,y:yB,width:2*E*K,height:hB,fill:"var(--pr)"}));
 for(let k=0;k<N;k++){const c=-(N-1)*P/2+k*P;strip.append(H("rect",{x:XC+(c-W/2)*K,y:yP,width:W*K,height:hP,fill:"var(--pr)"}))}
 [[E,E+R],[-E-R,-E]].forEach(([a,b])=>{strip.append(H("rect",{x:XC+a*K,y:yB-3,width:(b-a)*K,height:hB+6,fill:"#b07cc6",stroke:"var(--pr)","stroke-dasharray":"2 1.5"}));
  T(XC+(a+b)/2*K,yB+hB+12,"resalte",{"text-anchor":"middle","font-size":6,fill:"currentColor"},strip)});
 T(XC,yP+hP+9,`13 pestañas hacia abajo · paso ${P}°`,{"text-anchor":"middle","font-size":6,fill:"currentColor"},strip);
 // elementos fijos del soporte
 const sen={};
 const xs=s=>XC-s*K;   // vista desde fuera: + horario hacia la izquierda
 for(const k in SEN){const s=SEN[k],x=xs(s.s),y=s.alt?yB+hB/2:yP+hP/2;
  const c=H("circle",{cx:x,cy:y,r:5.2,fill:"#5d6b7d",stroke:"#1f2328","stroke-width":.7});svg.append(c);sen[k]=c;
  T(x,y+2.4,k.slice(1),{"text-anchor":"middle","font-size":6.5,fill:"#fff","font-weight":700})}
 const fcX=xs(FCs),fcY=yB-1;
 svg.append(H("rect",{x:fcX-9,y:AY+1,width:18,height:9,rx:1.5,fill:"#4c6ef5"}));
 const fcPal=H("line",{x1:fcX,y1:AY+9,x2:fcX,y2:fcY,stroke:"#1f2328","stroke-width":1.4});svg.append(fcPal);
 const fcRod=H("circle",{cx:fcX,cy:fcY,r:3.2,fill:"#1f2328"});svg.append(fcRod);
 T(fcX+12,AY+8,"FC rodillo",{"font-size":6,fill:"currentColor","font-weight":700});
 T(336,yB+hB/2+2,"lím.",{"font-size":6,"text-anchor":"end",fill:"currentColor"});
 T(336,yP+hP/2+2,"cont.",{"font-size":6,"text-anchor":"end",fill:"currentColor"});
 T(8,AY+93,"◀ derecha (horario)",{"font-size":6,fill:"currentColor"});T(332,AY+93,"izquierda ▶",{"font-size":6,"text-anchor":"end",fill:"currentColor"});

 // ===== FRONTAL PLC =====
 const Y0=384;
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
 modulo(232,104,"Safety E-A8 / E-A6","FC y bobinas",[
  ["fc","DIS05 FC traslación","H-S1 · IN05S 5.1 · UT1 5.2"],["s1","Bobina E-K1","variadores · hilo 303"],["s2","Bobina E-K24","frenos T-Y1 / T-Y2"]]);
 svg.append(H("rect",{x:236,y:Y0+92,width:96,height:50,rx:3,fill:"#eef1f4"}));
 const tPlc=[0,1,2,3].map(i=>T(240,Y0+102+i*11,"",{"font-size":6,fill:"#1f2328"}));

 // ===== Estado y animación =====
 let g=0,dirVis=0,ed=0,pausa=false,modo="ciclo",fase=0,espera=0,last=performance.now(),fijo=null,tr=0,prev=null,fcAbierto=false;
 const fallo={B3:false,B4:false};
 const FASES=[{d:1},{p:1},{d:-1,h:0},{p:1},{d:-1},{p:1},{d:1,h:0},{p:1}];
 const lee=()=>{const o={};for(const k in SEN){const a=SEN[k].s-g;o[k]=SEN[k].alt?banda(a):pest(a)}
  if(fallo.B3)o.B3=true;if(fallo.B4)o.B4=true;o.FC=resalte(FCs-g);return o};
 const led=(k,on,col)=>{const c=leds[k];c.setAttribute("fill",on?(col||"#39d353"):"#3a3f45");c.style.filter=on?`drop-shadow(0 0 3px ${col||"#39d353"})`:"none"};
 function pinta(){
  rot.setAttribute("transform",`rotate(${g} ${CX} ${CY})`);
  strip.setAttribute("transform",`translate(${-g*K} 0)`);
  const s=lee();if(s.FC)fcAbierto=true;
  if(prev&&dirVis){if(s.B1!==prev.B1)ed+=dirVis;if(s.B2!==prev.B2)ed+=dirVis}prev=s;
  for(const k in SEN){sen[k].setAttribute("fill",fallo[k]?"#e5534b":s[k]?"var(--ac)":"#5d6b7d")}
  fcRod.setAttribute("cy",s.FC?fcY-4:fcY);fcPal.setAttribute("y2",s.FC?fcY-4:fcY);fcRod.setAttribute("fill",s.FC?"#e5534b":"#1f2328");
  led("i1",s.B3);led("i2",s.B4);led("i3",s.B1);led("i4",s.B2);led("fc",!fcAbierto);
  const mov=dirVis!==0;
  led("o1",dirVis>0);led("o2",dirVis<0);led("o3",dirVis<0);led("o4",dirVis>0);led("o5",mov);led("o6",false);
  led("s1",!fcAbierto);led("s2",mov);
  const ang=Math.round(g),pA=Math.round(ed*FL*10)/10;
  tAng.textContent=ang+"°";tPlcA.textContent=pA+"°";tPul.textContent=(ed>0?"+":"")+ed+" flancos × "+FL+"°";
  tSen.textContent=dirVis>0?"derecha ↻":dirVis<0?"izquierda ↺":"parado";
  tLim.textContent=fcAbierto?"FC ABIERTO":!s.B4?"LÍMITE DCHA":!s.B3?"LÍMITE IZQ":"";
  tLim2.textContent=fcAbierto?"parada de seguridad":!s.B4||!s.B3?"corte por inductivo":"";
  const L=[`${ed} flancos × ${FL}° = ${pA}°`,
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
