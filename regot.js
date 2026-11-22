/* v678: «REGISTRAR OT» con diseño de consola técnica: cabecera con reloj en vivo y franja de escaneo, pasos numerados,
   terminal como selector segmentado, campos con foco luminoso, nº de orden en dígitos de panel y botón de guardar con brillo.
   Solo cambia el aspecto: los campos, ids y funciones del formulario son los mismos. */
(function(){"use strict";
const st=document.createElement("style");st.textContent=`
#app.regot>.card:first-child{position:relative;overflow:hidden;border:0!important;border-radius:18px!important;padding:18px 16px 18px!important;
 background:linear-gradient(var(--card),var(--card)) padding-box,linear-gradient(135deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff) 55%,#1e88e5) border-box!important;
 border:1.5px solid transparent!important;box-shadow:0 10px 40px -12px color-mix(in srgb,var(--tkpu,#9b3dff) 45%,transparent),0 2px 0 0 #fff1 inset!important}
#app.regot>.card:first-child::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.06;
 background-image:linear-gradient(var(--tx) 1px,transparent 1px),linear-gradient(90deg,var(--tx) 1px,transparent 1px);background-size:22px 22px;
 -webkit-mask-image:linear-gradient(180deg,#000,transparent 55%);mask-image:linear-gradient(180deg,#000,transparent 55%)}
#app.regot>.card:first-child>h3{position:relative;display:flex;align-items:center;gap:10px;margin:0 0 4px!important;padding:0!important;border:0!important}
#app.regot>.card:first-child>h3>span:first-child{font-size:21px!important;font-weight:900!important;letter-spacing:2.5px!important;text-transform:uppercase;
 background:linear-gradient(90deg,var(--tx) 30%,var(--tkor,#ff7a1a));-webkit-background-clip:text;background-clip:text;color:transparent!important}
#app.regot>.card:first-child>h3::before{content:"";width:5px;align-self:stretch;min-height:26px;border-radius:3px;background:linear-gradient(180deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff))}
#app.regot .rgsub{position:relative;padding-right:58px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:2px 0 14px;font:600 12px/1.2 var(--tkmo,ui-monospace,monospace);color:var(--mu);letter-spacing:.6px}
#app.regot .rgsub b{color:var(--tx)}#app.regot .rgdot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 0 #22c55e88;animation:rgPul 1.8s infinite}
#app.regot .rgscan{position:relative;height:2px;margin:-8px 0 14px;border-radius:2px;background:color-mix(in srgb,var(--tx) 10%,transparent);overflow:hidden}
#app.regot .rgscan::after{content:"";position:absolute;top:0;bottom:0;width:35%;left:-35%;background:linear-gradient(90deg,transparent,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff),transparent);animation:rgScan 2.6s cubic-bezier(.6,0,.4,1) infinite}
@keyframes rgScan{to{left:100%}}@keyframes rgPul{70%{box-shadow:0 0 0 7px #22c55e00}100%{box-shadow:0 0 0 0 #22c55e00}}
/* pasos numerados */
#app.regot>.card:first-child{counter-reset:rgp}
#app.regot>.card:first-child>label{display:flex!important;align-items:center;gap:9px;margin:16px 0 8px!important;font:800 11.5px/1 var(--tkmo,ui-monospace,monospace)!important;letter-spacing:1.6px!important;text-transform:uppercase;color:var(--mu)!important}
#app.regot>.card:first-child>label::before{counter-increment:rgp;content:counter(rgp);flex:none;display:grid;place-items:center;width:22px;height:22px;border-radius:7px;
 font:900 12px/1 var(--tkmo,ui-monospace,monospace);color:#fff;background:linear-gradient(135deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff));box-shadow:0 3px 10px -3px var(--tkor,#ff7a1a)}
#app.regot>.card:first-child>label::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,color-mix(in srgb,var(--tx) 18%,transparent),transparent)}
#app.regot>.card:first-child>label[style*="display: none"],#app.regot>.card:first-child>label.hide{counter-increment:none}
/* campos */
#app.regot>.card:first-child select,#app.regot>.card:first-child input:not([type=checkbox]),#app.regot>.card:first-child textarea{
 border-radius:12px!important;border:1.5px solid color-mix(in srgb,var(--tx) 16%,transparent)!important;background:color-mix(in srgb,var(--bg) 70%,var(--card))!important;
 transition:border-color .2s,box-shadow .2s,transform .15s;min-height:50px}
#app.regot>.card:first-child select:focus,#app.regot>.card:first-child input:focus,#app.regot>.card:first-child textarea:focus{outline:0!important;
 border-color:var(--tkor,#ff7a1a)!important;box-shadow:0 0 0 4px color-mix(in srgb,var(--tkor,#ff7a1a) 22%,transparent),0 6px 20px -8px var(--tkor,#ff7a1a)!important}
#app.regot #f_posn,#app.regot #f_ord,#app.regot #f_hi{font-family:var(--tkmo,ui-monospace,monospace)!important;font-weight:800!important;letter-spacing:3px}
#app.regot #f_ord{font-size:24px!important;color:var(--tx)!important}#app.regot #f_posn{font-size:18px!important}#app.regot #f_posn::placeholder{letter-spacing:.5px;font-size:15px}#app.regot>.card:first-child>label.rgoff{display:none!important}
#app.regot #f_hi{font-size:20px!important;text-align:center}
#app.regot textarea#f_desc{min-height:96px;line-height:1.4}
/* terminal: selector segmentado */
#app.regot #f_term .tchips{display:flex;gap:4px;padding:4px;border-radius:14px;background:color-mix(in srgb,var(--bg) 70%,var(--card));border:1.5px solid color-mix(in srgb,var(--tx) 12%,transparent)}
#app.regot #f_term .tchips>button{flex:1;margin:0!important;border:0!important;border-radius:10px!important;min-height:46px;font:900 16px/1 var(--tkmo,ui-monospace,monospace)!important;letter-spacing:1.5px;
 background:transparent!important;color:var(--mu)!important;transition:background .25s,color .25s,box-shadow .25s,transform .12s}
#app.regot #f_term .tchips>button.pri{background:linear-gradient(135deg,var(--tkor,#ff7a1a),#ff5a1f)!important;color:#111!important;box-shadow:0 6px 18px -6px var(--tkor,#ff7a1a),0 0 0 1px #fff3 inset}
#app.regot #f_term .tchips>button:active,#app.regot .card button:active{transform:scale(.97)}
/* nº de orden: prefijo morado */
#app.regot #pf_v{border-radius:12px 0 0 12px!important;font:900 22px/1 var(--tkmo,ui-monospace,monospace)!important;letter-spacing:2px!important;
 background:linear-gradient(135deg,#7c3aed,var(--tkpu,#9b3dff))!important;color:#fff!important;padding:0 14px!important}
#app.regot #pf_v+div>button{background:linear-gradient(180deg,#8b5cf6,#7c3aed)!important;color:#fff!important}
#app.regot #pf_v+div+input,#app.regot #f_ord{border-radius:0 12px 12px 0!important}
/* botón guardar */
#app.regot>.card:first-child>button.pri:not(.sigB){position:relative;overflow:hidden;margin-top:20px!important;min-height:58px;border:0!important;border-radius:14px!important;
 font-weight:900!important;font-size:16px!important;letter-spacing:2.5px!important;text-transform:uppercase;color:#111!important;
 background:linear-gradient(135deg,#ffb020,var(--tkor,#ff7a1a) 45%,#ff4d2e)!important;box-shadow:0 12px 28px -10px var(--tkor,#ff7a1a),0 0 0 1px #fff4 inset!important}
#app.regot>.card:first-child>button.pri:not(.sigB)::before{content:"✓";display:inline-grid;place-items:center;width:24px;height:24px;margin-right:10px;border-radius:50%;background:#1113;color:#111;font-size:14px;vertical-align:-3px}
#app.regot>.card:first-child>button.pri:not(.sigB)::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;transform:skewX(-20deg);background:linear-gradient(90deg,transparent,#fff7,transparent);animation:rgShine 3.2s ease-in-out infinite}
@keyframes rgShine{60%,100%{left:130%}}
/* notas */
#app.regot>.card:first-child>.mu{font-size:12.5px!important;opacity:.8;margin-top:6px}
/* entrada escalonada */
#app.regot.rgin>.card:first-child>*{animation:rgIn .45s cubic-bezier(.2,.8,.2,1) both}
${Array.from({length:24},(_,k)=>`#app.regot.rgin>.card:first-child>*:nth-child(${k+1}){animation-delay:${k*28}ms}`).join("")}
@keyframes rgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){#app.regot *{animation:none!important}}`;document.head.appendChild(st);
const DIAS=["dom","lun","mar","mié","jue","vie","sáb"];
const hora=()=>{const d=new Date(),z=n=>String(n).padStart(2,"0");return {f:`${DIAS[d.getDay()]} ${z(d.getDate())}/${z(d.getMonth()+1)}`,h:`${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`}};
let reloj=0;
function mira(){const app=document.getElementById("app");if(!app)return;const es=!!document.getElementById("f_desc")&&!!document.getElementById("f_term");
 if(!es){if(app.classList.contains("regot"))app.classList.remove("regot","rgin");clearInterval(reloj);reloj=0;return}
 const card=app.querySelector(":scope>.card");if(!card)return;
 if(!app.classList.contains("regot"))app.classList.add("regot");/* v688: sin animación de entrada */
 if(!card.querySelector(".rgsub")){const h3=card.querySelector(":scope>h3");if(!h3)return;
  const sub=document.createElement("div");sub.className="rgsub";sub.innerHTML=`<span class="rgdot"></span><span>NUEVA OT</span><span>·</span><b class="rgf"></b><b class="rgh"></b>`;
  const sc=document.createElement("div");sc.className="rgscan";h3.after(sub,sc)}
 /* etiquetas cuyo campo está oculto (p. ej. «Tipo de incidencia» si no se usa) no cuentan como paso */
 card.querySelectorAll(":scope>label").forEach(l=>{const n=l.nextElementSibling;l.classList.toggle("rgoff",!!n&&(getComputedStyle(n).display=="none"||n.offsetHeight<4))});
 const pinta=()=>{const s=document.querySelector("#app .rgsub");if(!s){clearInterval(reloj);reloj=0;return}const t=hora();s.querySelector(".rgf").textContent=t.f;s.querySelector(".rgh").textContent=t.h};
 pinta();if(!reloj)reloj=setInterval(pinta,1000)}
const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);new MutationObserver(()=>mira()).observe(a,{childList:true});mira()};ini();
})();
