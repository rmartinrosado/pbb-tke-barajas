/* ===== v477: ACCESO CON FACE ID y modo ADMINISTRADOR al abrir (desarrollo) (15/11/2026) =====
   · La contraseña de usuario sigue activa (inicio de sesión de Supabase y alternativa «Usar contraseña»).
   · Cada vez que se abre la app con la sesión iniciada aparece «🔒 Entrar con Face ID» (Face ID / Touch ID / huella del móvil,
     WebAuthn con el autenticador del propio dispositivo). La primera vez se registra el Face ID en ese móvil.
   · Con rol admin, tras el Face ID la app entra directamente en modo ADMINISTRADOR (para desarrollar la PWA).
   · «Acceso Administrador» también usa Face ID; si falla o se cancela, queda la contraseña de administrador de siempre. ===== */
(function(){
"use strict";
const AUTO_ADMIN=true; /* poner false cuando la PWA esté terminada */
const K="pbb_faceid";
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const deb64=s=>Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((s.length+3)%4)),c=>c.charCodeAt(0));
const rnd=n=>crypto.getRandomValues(new Uint8Array(n));
const disp=()=>!!(window.PublicKeyCredential&&navigator.credentials&&window.isSecureContext);
const cred=()=>{try{const o=JSON.parse(localStorage.getItem(K)||"null");return o&&user&&o.email==user.email?o:null}catch(e){return null}};
async function registra(){const pk={challenge:rnd(32),rp:{name:"PBB TKE Maintenance"},user:{id:rnd(16),name:user.email,displayName:user.email},
 pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"preferred"},timeout:60000,attestation:"none"};
 const c=await navigator.credentials.create({publicKey:pk});if(!c)throw new Error("sin credencial");localStorage.setItem(K,JSON.stringify({id:b64(c.rawId),email:user.email,ts:Date.now()}));return true}
async function verifica(){const o=cred();if(!o)return registra();
 const a=await navigator.credentials.get({publicKey:{challenge:rnd(32),allowCredentials:[{type:"public-key",id:deb64(o.id),transports:["internal"]}],userVerification:"required",timeout:60000}});return !!a}
window.faceID=async function(){if(!disp())throw new Error("Este móvil no permite Face ID en la app");return verifica()};
function entraAdmin(){if(typeof rol=="undefined"||rol!="admin")return;admin=true;tecnico=false;view="dash";try{filtro="todas";ptxt=""}catch(e){}try{render()}catch(e){}try{scrollTo(0,0)}catch(e){}}
/* ---------- candado al abrir ---------- */
let hecho=false;
function candado(){if(document.getElementById("fidlk"))return;const o=document.createElement("div");o.id="fidlk";
 o.innerHTML=`<div class="fidb"><div class="fidi">🔒</div><div class="fidt">TKE MAINTENANCE</div><div class="fidu">${(typeof esc=="function"?esc:String)(user.email)}</div>
 <button type="button" class="fidp" id="fid_go">${cred()?"Entrar con Face ID":"Activar Face ID y entrar"}</button>
 <button type="button" class="fids" id="fid_pw">Usar contraseña</button><div class="fidm" id="fid_m"></div></div>`;
 ["click","dblclick","touchend"].forEach(t=>o.addEventListener(t,e=>e.stopPropagation()));document.body.appendChild(o);
 const m=t=>{const e=document.getElementById("fid_m");if(e)e.textContent=t};
 document.getElementById("fid_go").onclick=async()=>{try{m("");if(await faceID())abre();else m("No verificado")}catch(e){m(e&&e.name=="NotAllowedError"?"Cancelado. Vuelve a intentarlo o usa la contraseña.":String((e&&e.message)||e))}};
 document.getElementById("fid_pw").onclick=()=>{const b=o.querySelector(".fidb");b.innerHTML=`<div class="fidi">🔑</div><div class="fidu">${(typeof esc=="function"?esc:String)(user.email)}</div>
  <input id="fid_p" type="password" autocomplete="current-password" placeholder="Contraseña"><button type="button" class="fidp" id="fid_ok">Entrar</button><div class="fidm" id="fid_m"></div>`;
  const ok=async()=>{const r=await sb.auth.signInWithPassword({email:user.email,password:document.getElementById("fid_p").value});if(r.error){m("Contraseña incorrecta");return}abre()};
  document.getElementById("fid_ok").onclick=ok;document.getElementById("fid_p").onkeydown=e=>{if(e.key=="Enter")ok()};setTimeout(()=>document.getElementById("fid_p").focus(),50)}}
function abre(){const o=document.getElementById("fidlk");if(o)o.remove();try{sessionStorage.setItem("pbb_fidok","1")}catch(e){}if(AUTO_ADMIN){entraAdmin();setTimeout(()=>{if(!admin)entraAdmin()},1500)}}
const mira=()=>{try{if(hecho)return;if(typeof user=="undefined"||!user||typeof rol=="undefined")return;if(document.getElementById("login"))return;
 hecho=true;let ya=false;try{ya=sessionStorage.getItem("pbb_fidok")=="1"}catch(e){}
 if(ya){if(AUTO_ADMIN&&!admin)entraAdmin();return}
 if(disp())candado();else if(AUTO_ADMIN)entraAdmin()}catch(e){}};
const iv=setInterval(()=>{mira();if(hecho)clearInterval(iv)},300);
/* al volver de segundo plano tras más de 5 min, se vuelve a pedir Face ID */
let oculto=0;document.addEventListener("visibilitychange",()=>{if(document.hidden){oculto=Date.now();return}
 if(oculto&&Date.now()-oculto>5*60*1000&&typeof user!="undefined"&&user&&disp()){try{sessionStorage.removeItem("pbb_fidok")}catch(e){}hecho=false;mira()}});
/* ---------- «Acceso Administrador» con Face ID ---------- */
if(typeof adminBtn=="function"){const o=adminBtn;adminBtn=window.adminBtn=function(){if(admin||typeof rol=="undefined"||rol!="admin"||!disp()||!cred())return o.apply(this,arguments);
 faceID().then(ok=>{if(ok){entraAdmin();msg("Modo Administrador · Face ID")}else o.apply(this,arguments)},()=>o.apply(this,arguments))}}
const st=document.createElement("style");st.textContent=`
#fidlk{position:fixed;inset:0;z-index:2147483001;background:#0b0d14;display:flex;align-items:center;justify-content:center;padding:20px}
.fidb{width:min(92vw,360px);display:flex;flex-direction:column;align-items:center;gap:10px;color:#e9ecf1;text-align:center}
.fidi{font-size:54px}.fidt{font-weight:900;font-size:20px}.fidu{font-size:13px;opacity:.75;margin-bottom:8px}
.fidp{width:100%;padding:15px;border-radius:12px;border:0;font-weight:900;font-size:17px;background:linear-gradient(90deg,#7c3aed,#ff6a13);color:#fff}
.fids{width:100%;padding:11px;border-radius:12px;border:1.5px solid #555;background:transparent;color:#e9ecf1;font-size:15px}
#fidlk input{width:100%;padding:13px;border-radius:12px;border:1.5px solid #555;background:#151925;color:#fff;font-size:17px;box-sizing:border-box}
.fidm{min-height:18px;font-size:13px;color:#fca5a5}`;
document.head.appendChild(st);
})();
