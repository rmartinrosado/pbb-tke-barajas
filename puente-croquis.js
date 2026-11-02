/* ===== Croquis del PUENTE PROVISIONAL en el módulo safety del PLC (primera actuación en campo por límite) =====
 croquisPuente({mod:"E-A8", ch:8, b1:"8.1", b2:"8.2", k1:"IN08S", k2:"UT2", d:"F.C. INCLINACIÓN", canales:[...]}, v)
 v = 1 · módulo completo (vista frontal Inline) · 2 · regleta del canal (esquema) · 3 · detalle ampliado de las dos bornas
 Cable a mano alzada que parpadea y punteras entrando en las bornas del canal. Colores por variables CSS (claro / oscuro). */
(function(){
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const CSS=`
.pzk{--pk-bg:#14171d;--pk-mod:#2b3038;--pk-mod2:#3a404a;--pk-bd:#59616e;--pk-tx:#e9ecf1;--pk-mu:#9aa3b2;--pk-hi:#ffcc00;--pk-w:#ff3b30;--pk-led:#22c55e;--pk-cu:#d9a066;
 display:block;width:100%;height:auto;border-radius:8px;background:var(--pk-bg);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
html.lt .pzk{--pk-bg:#f4f5f7;--pk-mod:#e3e6ea;--pk-mod2:#cfd4db;--pk-bd:#6b7280;--pk-tx:#0b0d12;--pk-mu:#4b5563;--pk-hi:#c98a00;--pk-w:#d11a10;--pk-led:#15a34a;--pk-cu:#b0743a}
.pzk text{fill:var(--pk-tx)}.pzk .mu{fill:var(--pk-mu)}.pzk .hi{fill:var(--pk-hi)}
.pzk .wire{fill:none;stroke:var(--pk-w);stroke-width:6;stroke-linecap:round;stroke-linejoin:round;animation:pzkW 1s steps(1,end) infinite}
.pzk .wire2{fill:none;stroke:#00000055;stroke-width:9;stroke-linecap:round}
.pzk .pin{animation:pzkP 2s ease-in-out infinite}
.pzk .led{animation:pzkL 1s steps(1,end) infinite}
.pzk .ring{fill:none;stroke:var(--pk-hi);stroke-width:2.5;stroke-dasharray:6 5;animation:pzkR 1.2s linear infinite}
@keyframes pzkW{0%{opacity:1}50%{opacity:.18}}
@keyframes pzkL{0%{fill:var(--pk-led)}50%{fill:#3a3f47}}
@keyframes pzkR{to{stroke-dashoffset:-22}}
@keyframes pzkP{0%,100%{transform:translateY(-9px)}45%,70%{transform:translateY(0)}}`;
function css(){if(document.getElementById("pzkcss"))return;const s=document.createElement("style");s.id="pzkcss";s.textContent=CSS;document.head.appendChild(s)}
/* puntera (ferrule) apuntando hacia abajo, con la punta en (x,y) */
const pin=(x,y,cls="pin")=>`<g class="${cls}" style="transform-box:fill-box"><g transform="translate(${x},${y})">
 <rect x="-5" y="-30" width="10" height="16" rx="2" fill="var(--pk-w)"/><rect x="-3" y="-15" width="6" height="15" fill="var(--pk-cu)"/>
 <path d="M-3 0h6l-3 4z" fill="var(--pk-cu)"/></g></g>`;
/* tornillo / boca de borna */
const borna=(x,y,r=9,on=false)=>`<g><rect x="${x-r}" y="${y-r}" width="${2*r}" height="${2*r}" rx="3" fill="#0b0d12" stroke="${on?"var(--pk-hi)":"var(--pk-bd)"}" stroke-width="${on?2.5:1.2}"/>
 <rect x="${x-r*.45}" y="${y-r*.45}" width="${r*.9}" height="${r*.9}" fill="#1f242b"/></g>`;
/* cable a mano alzada entre dos puntos (por arriba) */
const cable=(x1,y1,x2,y2,alto)=>{const mx=(x1+x2)/2,h=alto||60;
 const t=y1-30,q=(x2-x1);const d=`M${x1} ${t} C ${x1-10} ${t-h*.55}, ${x1+q*.12} ${t-h*1.05}, ${x1+q*.32} ${t-h*.92} S ${mx+q*.06} ${t-h*1.12}, ${x1+q*.68} ${t-h*.98} S ${x2+12} ${y2-30-h*.55}, ${x2} ${y2-30}`;
 return `<path class="wire2" d="${d}"/><path class="wire" d="${d}"/>`};
function v1(o){/* módulo completo: 8 canales en filas, bornas .1 .2 .3, canal afectado resaltado */
 const W=360,H=330,mx=110,mw=150,y0=78,rh=27,ch=o.ch||8;let rows="";
 for(let c=1;c<=8;c++){const y=y0+(c-1)*rh,on=c==ch;
  rows+=`${on?`<rect x="${mx+2}" y="${y-12}" width="${mw-4}" height="24" rx="4" fill="#ffcc0022" stroke="var(--pk-hi)" stroke-width="1.5"/>`:""}
  <circle class="${on?"led":""}" cx="${mx+16}" cy="${y}" r="4.5" fill="${on?"var(--pk-led)":"#3a3f47"}"/>
  <text x="${mx+28}" y="${y+4}" font-size="10" class="${on?"hi":"mu"}" font-weight="${on?700:400}">${c}</text>
  ${borna(mx+62,y,8,on)}${borna(mx+92,y,8,on)}${borna(mx+122,y,8,false)}`}
 const c=y0+(ch-1)*rh;
 return `<svg class="pzk" viewBox="0 0 ${W} ${H}" role="img" aria-label="Puente provisional ${esc(o.b1)} – ${esc(o.b2)} en ${esc(o.mod)}">
 <text x="14" y="24" font-size="15" font-weight="800">${esc(o.mod)} · módulo safety</text>
 <text x="14" y="42" font-size="11" class="mu">Puente ${esc(o.b1)} → ${esc(o.b2)} · ${esc(o.d)}</text>
 <rect x="${mx}" y="56" width="${mw}" height="${8*rh+10}" rx="6" fill="var(--pk-mod)" stroke="var(--pk-bd)"/>
 <text x="${mx+62}" y="70" font-size="9" text-anchor="middle" class="mu">.1</text><text x="${mx+92}" y="70" font-size="9" text-anchor="middle" class="mu">.2</text><text x="${mx+122}" y="70" font-size="9" text-anchor="middle" class="mu">.3</text>
 ${rows}
 <g transform="translate(0,0)">${cable(mx+62,c-8,mx+92,c-8,34).replace(/M(\S+) (\S+) C/,(m,a,b)=>`M${a} ${b} C`)}</g>
 ${pin(mx+62,c-8)}${pin(mx+92,c-8)}
 <circle class="ring" cx="${mx+77}" cy="${c}" r="26"/>
 <g font-size="11"><text x="${mx+mw+14}" y="${c-4}" class="hi" font-weight="700">${esc(o.b1)} ${esc(o.k1)}</text><text x="${mx+mw+14}" y="${c+11}" class="hi" font-weight="700">${esc(o.b2)} ${esc(o.k2)}</text>
 <path d="M${mx+mw+10} ${c} H${mx+132}" stroke="var(--pk-hi)" stroke-width="1.5"/></g>
 <text x="14" y="${H-12}" font-size="10.5" class="mu">LED del canal ${ch} debe encenderse al poner el puente</text></svg>`}
function v2(o){/* regleta horizontal del canal: IN ←cable→ UT, grande y esquemático */
 const W=360,H=230,x1=110,x2=250,y=150;
 return `<svg class="pzk" viewBox="0 0 ${W} ${H}" role="img" aria-label="Puente provisional ${esc(o.b1)} – ${esc(o.b2)} en ${esc(o.mod)}">
 <text x="14" y="24" font-size="15" font-weight="800">${esc(o.mod)} · canal ${o.ch} · ${esc(o.d)}</text>
 <rect x="40" y="${y-30}" width="280" height="62" rx="8" fill="var(--pk-mod)" stroke="var(--pk-bd)"/>
 <rect x="40" y="${y+32}" width="280" height="14" rx="3" fill="var(--pk-mod2)"/>
 ${borna(x1,y,15,true)}${borna(x2,y,15,true)}${borna(x2+48,y,10)}
 <text x="${x2+48}" y="${y+26}" font-size="10" text-anchor="middle" class="mu">${o.ch}.3</text>
 <text x="${x1}" y="${y+26}" font-size="13" text-anchor="middle" font-weight="800" class="hi">${esc(o.b1)}</text>
 <text x="${x2}" y="${y+26}" font-size="13" text-anchor="middle" font-weight="800" class="hi">${esc(o.b2)}</text>
 <text x="${x1}" y="${y+60}" font-size="11" text-anchor="middle">${esc(o.k1)}</text><text x="${x2}" y="${y+60}" font-size="11" text-anchor="middle">${esc(o.k2)}</text>
 <text x="${x1}" y="${y+74}" font-size="9.5" text-anchor="middle" class="mu">entrada</text><text x="${x2}" y="${y+74}" font-size="9.5" text-anchor="middle" class="mu">salida test</text>
 ${cable(x1,y-12,x2,y-12,52)}${pin(x1,y-12)}${pin(x2,y-12)}
 <circle class="led" cx="66" cy="${y-8}" r="6"/><text x="66" y="${y+12}" font-size="9" text-anchor="middle" class="mu">LED ${o.ch}</text>
 <text x="${(x1+x2)/2}" y="54" font-size="11" text-anchor="middle" class="hi" font-weight="700">PUENTE PROVISIONAL</text></svg>`}
function v3(o){/* detalle ampliado: bornas de muelle con las punteras entrando, cable que parpadea y etiquetas grandes */
 const W=360,H=270,x1=105,x2=255,y=170;
 const muelle=(x,lab,k,sub)=>`<g><rect x="${x-42}" y="${y-60}" width="84" height="120" rx="8" fill="var(--pk-mod)" stroke="var(--pk-hi)" stroke-width="2"/>
  <rect x="${x+16}" y="${y-22}" width="14" height="30" rx="3" fill="#ff7a1a"/><text x="${x+23}" y="${y-3}" font-size="7" text-anchor="middle" fill="#1b0c00" font-weight="800" transform="rotate(-90 ${x+23} ${y-7})">PUSH</text>
  <rect x="${x-11}" y="${y-22}" width="22" height="30" rx="3" fill="#0b0d12" stroke="var(--pk-bd)"/>
  <text x="${x}" y="${y+28}" font-size="17" text-anchor="middle" font-weight="800" class="hi">${esc(lab)}</text>
  <text x="${x}" y="${y+46}" font-size="11.5" text-anchor="middle" font-weight="700">${esc(k)}</text>
  <text x="${x}" y="${y+76}" font-size="9.5" text-anchor="middle" class="mu">${esc(sub)}</text></g>`;
 return `<svg class="pzk" viewBox="0 0 ${W} ${H}" role="img" aria-label="Puente provisional ${esc(o.b1)} – ${esc(o.b2)} en ${esc(o.mod)}">
 <text x="14" y="24" font-size="15" font-weight="800">${esc(o.mod)} · ${esc(o.d)}</text>
 <text x="14" y="41" font-size="11" class="mu">Canal ${o.ch} · une la entrada con su salida de test</text>
 ${muelle(x1,o.b1,o.k1,"entrada safety")}${muelle(x2,o.b2,o.k2,"salida de test")}
 ${cable(x1,y-12,x2,y-12,58)}${pin(x1,y-12)}${pin(x2,y-12)}
 <circle class="led" cx="${(x1+x2)/2}" cy="${y+10}" r="7"/><text x="${(x1+x2)/2}" y="${y+30}" font-size="9" text-anchor="middle" class="mu">LED</text>
 <text x="${W/2}" y="${H-4}" font-size="9.5" text-anchor="middle" class="mu">Nunca a +24 V directo · solo con compañero vigilando</text></svg>`}
function v4(o){/* v4: formato real del módulo safety Inline (fotos del armario E, T4S): 4 bloques amarillos, panel naranja de LED,
   conectores con bornas push-in a.1 b.1 / a.2 b.2 / a.3 b.3 / a.4 b.4 (franja azul y verde abajo). El canal N está en el bloque ceil(N/2),
   columna izquierda si es impar; .1 entrada y .2 salida de test van una encima de otra: el puente sale por el lateral y vuelve. */
 const ch=+o.ch||8,blk=Math.ceil(ch/2)-1,col=(ch-1)%2,SW=62,X0=12,TOP=52,W=X0+SW*4+112,H=440;
 const F=(c)=>`style="fill:${c}"`;
 const cx=(b,c)=>X0+b*SW+19+c*28, rowY=[0,236,292,346,396];
 let g="";
 for(let b=0;b<4;b++){const x=X0+b*SW;
  g+=`<rect x="${x+2}" y="${TOP}" width="${SW-4}" height="${H-TOP-34}" rx="3" fill="#f2c700" stroke="#9c8200"/>
  <rect x="${x+6}" y="${TOP+6}" width="${SW-12}" height="14" rx="2" fill="#ffd83a"/>
  <rect x="${x+7}" y="${TOP+26}" width="${SW-14}" height="92" rx="3" fill="#e0701c" stroke="#7a3a08"/>
  <line x1="${x+9}" y1="${TOP+46}" x2="${x+SW-9}" y2="${TOP+46}" stroke="#7a3a08"/><line x1="${x+9}" y1="${TOP+92}" x2="${x+SW-9}" y2="${TOP+92}" stroke="#7a3a08"/>
  <text x="${x+SW/2}" y="${TOP+40}" font-size="9" text-anchor="middle" ${F("#2a1200")} font-weight="700">${["D","FS","UM","P"][b]}</text>`;
  for(let c=0;c<2;c++){const n=b*2+c+1,lx=x+18+c*22,ly=TOP+60+c*16,hit=n==ch;
   g+=`<circle class="${hit?"led":""}" cx="${lx}" cy="${ly}" r="6.5" fill="${hit?"var(--pk-led)":"#6b5a4a"}" stroke="#3a1a04"/><text x="${lx}" y="${ly+3}" font-size="7.5" text-anchor="middle" ${F("#111")} font-weight="700">${n}</text>`}
  g+=`<rect x="${x+6}" y="${TOP+150}" width="${SW-12}" height="${H-TOP-194}" rx="3" fill="#e9cf3a" stroke="#9c8200"/>
  <rect x="${x+6}" y="${rowY[3]-24}" width="${SW-12}" height="46" fill="#2f5fb0" opacity=".85"/><rect x="${x+6}" y="${rowY[4]-24}" width="${SW-12}" height="40" fill="#2f8a3e" opacity=".85"/>`;
  for(let r=1;r<=4;r++)for(let c=0;c<2;c++){const n=b*2+c+1,X=cx(b,c),Y=rowY[r],hit=n==ch&&(r==1||r==2);
   g+=`<text x="${X}" y="${Y-26}" font-size="9" text-anchor="middle" ${F(hit?"#c00000":(r>2?"#f0f0f0":"#3b3200"))} font-weight="${hit?800:600}">${n}.${r}</text>
   <rect x="${X-9}" y="${Y-21}" width="18" height="8" rx="1.5" fill="#3b3200" opacity=".55"/>
   <circle cx="${X}" cy="${Y}" r="9" fill="#1a1608" stroke="${hit?"var(--pk-w)":"#7d6b00"}" stroke-width="${hit?3:1.3}"/>`}
 }
 const bx=cx(blk,col),y1=rowY[1],y2=rowY[2],side=col?1:-1,ex=bx+side*46;
 const fer=(x,y)=>`<g class="pin" style="transform-box:fill-box"><g transform="translate(${x},${y}) rotate(${side*-62})"><rect x="-3.5" y="2" width="7" height="14" fill="var(--pk-cu)"/><rect x="-5.5" y="14" width="11" height="15" rx="2" fill="var(--pk-w)"/></g></g>`;
 const d=`M${bx+side*20} ${y1+12} C ${bx+side*40} ${y1+18}, ${ex-side*6} ${y1-14}, ${ex+side*4} ${(y1+y2)/2-6} S ${ex-side*8} ${y2+34}, ${bx+side*20} ${y2+12}`;
 const lx=X0+SW*4+50,anc="start",lead=(y)=>`<path d="M${lx-4} ${y} H${Math.max(bx,ex)+12}" stroke="var(--pk-hi)" stroke-width="1.3" stroke-dasharray="3 3"/>`;
 return `<svg class="pzk" viewBox="0 0 ${W} ${H}" role="img" aria-label="Puente provisional ${esc(o.b1)} – ${esc(o.b2)} en ${esc(o.mod)}">
 <text x="12" y="20" font-size="14.5" font-weight="800">${esc(o.mod)} · ${esc(o.d)}</text>
 <text x="12" y="38" font-size="10.5" class="mu">Puente ${esc(o.b1)} ${esc(o.k1)} → ${esc(o.b2)} ${esc(o.k2)}</text>
 ${g}
 <rect x="${X0+2}" y="${TOP+124}" width="${SW*4-4}" height="18" fill="#ffd83a" stroke="#9c8200"/><text x="${X0+8}" y="${TOP+137}" font-size="12" font-weight="800" ${F("#111")}>${esc(o.mod)}</text>
 <circle class="ring" cx="${bx}" cy="${(y1+y2)/2}" r="46"/>
 <path class="wire2" d="${d}"/><path class="wire" d="${d}"/>${fer(bx+side*6,y1+5)}${fer(bx+side*6,y2+5)}
 ${lead(y1)}${lead(y2)}<g font-size="11.5" font-weight="800" text-anchor="${anc}"><text x="${lx}" y="${y1+4}" class="hi">${esc(o.b1)}</text><text x="${lx}" y="${y1+18}" font-size="10" class="mu">${esc(o.k1)}</text>
 <text x="${lx}" y="${y2+4}" class="hi">${esc(o.b2)}</text><text x="${lx}" y="${y2+18}" font-size="10" class="mu">${esc(o.k2)}</text></g>
 <text x="12" y="${H-10}" font-size="10" class="mu">LED ${ch} debe encenderse · nunca a +24 V directo</text></svg>`}
/* v5 (definitivo): SOLO el bloque del módulo donde va el puente, con los colores reales de cada módulo (fotos del armario E y del pupitre P):
   cuerpo amarillo = safety (E-A6…E-A10) · verde = resto; panel de LED naranja (cabecera / E-A6), rosa (salidas DO / E-A7), azul (entradas DI / safety DI).
   Bornas push-in a.1 b.1 … a.4 b.4 con franja azul (.3) y verde (.4). Medio bloque vecino a cada lado para situarse. */
const MODC={"E-A0":["v","o"],"E-A1":["v","r"],"E-A2":["v","a"],"E-A3":["v","a"],"E-A4":["v","o"],"E-A5":["v","o"],"E-A6":["y","o"],"E-A7":["y","r"],"E-A8":["y","a"],"E-A9":["y","a"],"E-A10":["y","a"],
 "P-A0":["v","o"],"P-A1":["v","r"],"P-A2":["v","r"],"P-A3":["v","a"],"P-A4":["v","a"],"P-A5":["v","a"],"P-A6":["v","a"]};
const BODY={y:["#f2c700","#9c8200","#e9cf3a","#3b3200"],v:["#56b84a","#2d6b25","#6cc95e","#0f3a0c"]};
const PAN={o:["#e0701c","#7a3a08"],r:["#f07aa8","#8a2a52"],a:["#4fb7e6","#1d5f80"]};
function v5(o){
 const id=o.mod,[bk,pk]=MODC[id]||["v","a"],B=BODY[bk],Pn=PAN[pk];
 const pa=/^(\d+)\.(\d)/.exec(o.b1)||[0,8,1],pb=/^(\d+)\.(\d)/.exec(o.b2)||[0,8,2];
 const n1=+pa[1],r1=+pa[2],n2=+pb[1],r2=+pb[2],blk=Math.ceil(n1/2),c1=(n1-1)%2,c2=(n2-1)%2;
 const SW=150,X0=70,TOP=58,W=X0+SW+130,H=462,F=c=>`style="fill:${c}"`;
 const n0=2*blk-1,cols=[n0,n0+1],cx=c=>X0+40+c*70,rowY=[0,250,310,368,414];
 const safe=bk=="y",nLed=safe?2:4;
 /* bloques vecinos (cortados) */
 const vec=(x,w)=>`<rect x="${x}" y="${TOP}" width="${w}" height="${H-TOP-24}" fill="${B[0]}" stroke="${B[1]}" opacity=".45"/>
  <rect x="${x}" y="${TOP+26}" width="${w}" height="104" fill="${Pn[0]}" opacity=".35"/>`;
 let g=vec(X0-34,30)+vec(X0+SW+4,30);
 g+=`<rect x="${X0}" y="${TOP}" width="${SW}" height="${H-TOP-24}" rx="4" fill="${B[0]}" stroke="${B[1]}" stroke-width="1.5"/>
 <rect x="${X0+8}" y="${TOP+6}" width="${SW-16}" height="14" rx="2" fill="#ffffff55"/>
 <rect x="${X0+12}" y="${TOP+26}" width="${SW-24}" height="104" rx="4" fill="${Pn[0]}" stroke="${Pn[1]}"/>
 <line x1="${X0+14}" y1="${TOP+48}" x2="${X0+SW-14}" y2="${TOP+48}" stroke="${Pn[1]}"/>
 <text x="${X0+22}" y="${TOP+42}" font-size="10" ${F("#1a0d00")} font-weight="800">${esc(id)}</text><text x="${X0+SW-22}" y="${TOP+42}" font-size="9" text-anchor="end" ${F("#1a0d00")}>bloque ${blk}</text>`;
 for(let k=0;k<nLed;k++){const ch=safe?cols[k]:(blk-1)*4+k+1,hit=safe?(ch==n1):false,lx=X0+36+(k%2)*78,ly=TOP+70+Math.floor(k/2)*30;
  g+=`<circle class="${hit?"led":""}" cx="${lx}" cy="${ly}" r="8" fill="${hit?"var(--pk-led)":"#5d5d5d"}" stroke="#222"/><text x="${lx+14}" y="${ly+4}" font-size="11" ${F("#111")} font-weight="700">${safe?ch:k+1}</text>`}
 /* conector */
 g+=`<rect x="${X0+8}" y="${TOP+150}" width="${SW-16}" height="${H-TOP-186}" rx="4" fill="${B[2]}" stroke="${B[1]}"/>
 <rect x="${X0+8}" y="${rowY[3]-30}" width="${SW-16}" height="58" fill="#2f5fb0" opacity=".85"/><rect x="${X0+8}" y="${rowY[4]-30}" width="${SW-16}" height="46" fill="#2f8a3e" opacity=".85"/>`;
 for(let r=1;r<=4;r++)for(let c=0;c<2;c++){const n=cols[c],X=cx(c),Y=rowY[r],hit=(n==n1&&r==r1)||(n==n2&&r==r2);
  g+=`<text x="${X}" y="${Y-32}" font-size="13" text-anchor="middle" ${F(hit?"#c00000":(r>2?"#ffffff":B[3]))} font-weight="${hit?900:700}">${n}.${r}</text>
  <rect x="${X-14}" y="${Y-26}" width="28" height="11" rx="2" fill="${B[3]}" opacity=".5"/>
  <circle cx="${X}" cy="${Y}" r="13" fill="#15130a" stroke="${hit?"var(--pk-w)":B[1]}" stroke-width="${hit?4:1.6}"/>`}
 const xa=cx(c1),ya=rowY[r1],xb=cx(c2),yb=rowY[r2],side=c1?1:-1,ex=Math.max(xa,xb)+(side>0?0:0);
 const out=side>0?X0+SW+34:X0-34;
 const fer=(x,y)=>`<g class="pin" style="transform-box:fill-box"><g transform="translate(${x},${y}) rotate(${side*-60})"><rect x="-4.5" y="3" width="9" height="18" fill="var(--pk-cu)"/><rect x="-7" y="19" width="14" height="20" rx="3" fill="var(--pk-w)"/></g></g>`;
 const d=`M${xa+side*26} ${ya+16} C ${xa+side*60} ${ya+26}, ${out} ${ya-14}, ${out+side*6} ${(ya+yb)/2-6} S ${out-side*10} ${yb+44}, ${xb+side*26} ${yb+16}`;
 const lx=X0+SW+44,lead=(x,y)=>`<path d="M${lx-6} ${y} H${x+16}" stroke="var(--pk-hi)" stroke-width="1.4" stroke-dasharray="4 3"/>`;
 return `<svg class="pzk" viewBox="0 0 ${W} ${H}" role="img" aria-label="Puente provisional ${esc(o.b1)} – ${esc(o.b2)} en ${esc(id)}">
 <text x="12" y="22" font-size="15" font-weight="800">${esc(id)} · puente ${esc(o.b1)} → ${esc(o.b2)}</text>
 <text x="12" y="40" font-size="11" class="mu">${esc(String(o.d).length>40?String(o.d).slice(0,39)+"…":o.d)}</text>
 ${g}
 <circle class="ring" cx="${(xa+xb)/2}" cy="${(ya+yb)/2}" r="${Math.max(48,Math.abs(yb-ya)/2+30)}"/>
 ${lead(Math.max(xa,xb),ya)}${lead(Math.max(xa,xb),yb)}
 <path class="wire2" d="${d}"/><path class="wire" d="${d}"/>${fer(xa+side*8,ya+6)}${fer(xb+side*8,yb+6)}
 <g font-weight="800"><text x="${lx}" y="${ya+3}" font-size="15" class="hi">${esc(o.b1)}</text><text x="${lx}" y="${ya+19}" font-size="10.5" class="mu">${esc(o.k1)}</text>
 <text x="${lx}" y="${yb+3}" font-size="15" class="hi">${esc(o.b2)}</text><text x="${lx}" y="${yb+19}" font-size="10.5" class="mu">${esc(o.k2)}</text></g>
 <text x="12" y="${H-8}" font-size="10" class="mu">${safe?`Con el puente, el LED ${n1} debe encenderse`:"Con el puente, el LED de la entrada se enciende"}</text></svg>`}
window.croquisPuente=function(o,v){css();o=Object.assign({mod:"E-A8",ch:8,b1:"8.1",b2:"8.2",k1:"IN08S",k2:"UT2",d:"F.C. INCLINACIÓN"},o||{});return (v==5?v5:v==4?v4:v==2?v2:v==3?v3:v1)(o)};
})();
