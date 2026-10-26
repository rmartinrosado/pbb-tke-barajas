/* ===== v79: Simulación animada del brazo autonivelador (RCS PLANOS folio 86) =====
 Dibujo del brazo que sigue a la puerta del avión y LED de P-A5 (B8…B13) que cambian según la tabla del folio 86.
 LED encendido = punto gris de la tabla = entrada de P-A5 encendida (sensor NC sin target delante). */
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
 <div class="mu" style="font-size:11px;margin-top:4px">LED verde = entrada de P-A5 encendida (punto gris del plano, sensor sin target). LED apagado = sensor tapado por la leva. Toca una posición para fijarla.</div>`;
 const svg=el.querySelector("svg"),row=el.querySelector(".gsim-row"),st=el.querySelector(".gsim-st");
 // Fondo: cabina (izquierda) y avión (derecha)
 svg.append(H("rect",{x:6,y:20,width:44,height:150,rx:6,fill:"var(--pr)",opacity:.25}));
 const tc=H("text",{x:28,y:16,"text-anchor":"middle","font-size":9,fill:"var(--mu)"});tc.textContent="CABINA";svg.append(tc);
 const avion=H("g",{});
 avion.append(H("rect",{x:150,y:-60,width:30,height:160,rx:4,fill:"#9aa4b2",opacity:.55}));
 avion.append(H("rect",{x:112,y:100,width:68,height:7,rx:2,fill:"#d0d6de"}));// umbral de la puerta
 const ta=H("text",{x:165,y:88,"text-anchor":"middle","font-size":8,fill:"#1d1526","font-weight":700});ta.textContent="AVIÓN";avion.append(ta);
 svg.append(avion);
 // Brazo
 const PX=50,PY=60,L=88;
 svg.append(H("rect",{x:40,y:52,width:16,height:16,rx:3,fill:"#5d6b7d"}));// carcasa con la leva
 const brazo=H("line",{x1:PX,y1:PY,x2:PX,y2:PY+L,stroke:"#c9d1db","stroke-width":7,"stroke-linecap":"round"});
 const rueda=H("circle",{cx:PX,cy:PY+L,r:8,fill:"#3b4350",stroke:"#c9d1db","stroke-width":2});
 const leva=H("path",{d:"",fill:"var(--ac)",opacity:.9});
 svg.append(brazo,rueda,leva,H("circle",{cx:PX,cy:PY,r:4,fill:"#fff"}));
 // Escala mm
 const esc=H("text",{x:146,y:0,"text-anchor":"middle","font-size":10,fill:"var(--tx)","font-weight":700});svg.append(esc);
 // Flecha de la cabina
 const fl=H("text",{x:28,y:100,"text-anchor":"middle","font-size":26,fill:"var(--ac)","font-weight":700});svg.append(fl);
 // Panel de LED P-A5
 const pt=H("text",{x:262,y:16,"text-anchor":"middle","font-size":9,fill:"var(--mu)"});pt.textContent="P-A5 · LED";svg.append(pt);
 const leds={};
 SENS.forEach((s,i)=>{const y=30+i*26;
  svg.append(H("rect",{x:212,y:y-10,width:120,height:20,rx:6,fill:"var(--card)",stroke:"var(--bd,#444)"}));
  const c=H("circle",{cx:226,cy:y,r:6,fill:"#333"});
  const t=H("text",{x:238,y:y+3.5,"font-size":9.5,fill:"var(--tx)"});t.textContent=`${s} · ${NOM[s]}`;
  svg.append(c,t);leds[s]=c});
 let mm=0,objIdx=0,obj=SEQ[0],pausa=false,fija=null,espera=0,prev="",last=performance.now();
 function pinta(){
  const k=.5;// px por mm
  avion.setAttribute("transform",`translate(0,${-mm*k})`);
  const sy=PY+L*Math.sin(Math.PI/4)-mm*k;// altura del umbral = altura de la rueda
  const s=Math.max(-1,Math.min(1,(sy-PY)/L)),a=Math.asin(s),x2=PX+L*Math.cos(a),y2=PY+L*s;
  brazo.setAttribute("x2",x2);brazo.setAttribute("y2",y2);rueda.setAttribute("cx",x2);rueda.setAttribute("cy",y2-1);
  const a0=a-0.35,a1=a+0.35;leva.setAttribute("d",`M${PX},${PY} L${PX+13*Math.cos(a0)},${PY+13*Math.sin(a0)} A13 13 0 0 1 ${PX+13*Math.cos(a1)},${PY+13*Math.sin(a1)} Z`);
  esc.setAttribute("y",100-mm*k+20);esc.textContent=(mm>0?"+":"")+Math.round(mm)+" mm";
  const f=fila(mm);
  if(f.k!==prev){prev=f.k;
   SENS.forEach(s=>{const on=f.on.includes(s),c=leds[s];c.setAttribute("fill",on?"#39d353":"#333");c.style.filter=on?"drop-shadow(0 0 4px #39d353)":"none";
    c.animate([{r:9},{r:6}],{duration:350})});
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
