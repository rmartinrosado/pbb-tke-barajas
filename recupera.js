/* ===== v380: «¿Has olvidado la contraseña?» =====
   · En la pantalla de acceso: enlace que envía el correo de recuperación de Supabase al correo escrito.
   · Al abrir el enlace del correo, la PWA (marcada con ?recupera=1) pide la NUEVA contraseña y la guarda (auth.updateUser). */
(function(){
 const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const base=()=>location.origin+location.pathname;
 /* enlace en la pantalla de acceso */
 const oL=pantallaLogin;pantallaLogin=function(m){const r=oL.apply(this,arguments);try{const c=document.querySelector("#login .card");if(c&&!c.querySelector(".olv")){
  const b=document.createElement("button");b.type="button";b.className="sec olv";b.style.cssText="margin-top:8px;width:100%";b.textContent="¿Has olvidado la contraseña?";b.onclick=olvide;
  const mu=c.querySelector(".mu");c.insertBefore(b,mu||null)}}catch(e){}return r};
 async function olvide(){const e=(document.getElementById("l_e")||{}).value||"";const em=e.trim();const mu=document.querySelector("#login .mu");
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){if(mu)mu.textContent="Escribe arriba tu correo y vuelve a pulsar «¿Has olvidado la contraseña?».";try{document.getElementById("l_e").focus()}catch(x){}return}
  if(mu)mu.textContent="Enviando el correo…";
  try{const r=await sb.auth.resetPasswordForEmail(em,{redirectTo:base()+"?recupera=1"});if(r.error)throw r.error;
   if(mu)mu.innerHTML=`Te hemos enviado un correo a <b>${E(em)}</b>. Ábrelo en este teléfono y pulsa el enlace: la app te pedirá la contraseña nueva. Si no llega en unos minutos, mira en «Spam».`}
  catch(x){if(mu)mu.textContent="No se pudo enviar el correo: "+((x&&x.message)||x)}}
 window.olvidePass=olvide;

 /* nueva contraseña al volver desde el correo */
 let mostrado=false;
 function nueva(){if(mostrado||document.getElementById("npass"))return;mostrado=true;
  const d=document.createElement("div");d.id="npass";d.style.cssText="position:fixed;inset:0;z-index:2147483100;background:var(--bg,#111);display:flex;align-items:flex-start;justify-content:center;padding:calc(30px + env(safe-area-inset-top,0px)) 20px 20px;overflow:auto";
  d.innerHTML=`<div class="card" style="width:100%;max-width:380px"><h3 style="margin:0 0 6px">Nueva contraseña</h3><div class="mu" style="margin-bottom:6px">Escribe la contraseña nueva para tu cuenta (mínimo 6 caracteres).</div>
   <label>Nueva contraseña</label><input id="np1" type="password" autocomplete="new-password"><label>Repetir contraseña</label><input id="np2" type="password" autocomplete="new-password">
   <button class="pri" style="margin-top:14px;width:100%" id="npok">Guardar contraseña</button><div class="mu" id="npm" style="margin-top:8px"></div></div>`;
  document.body.appendChild(d);
  const m=t=>{document.getElementById("npm").textContent=t};
  document.getElementById("npok").onclick=async()=>{const a=document.getElementById("np1").value,b=document.getElementById("np2").value;
   if(a.length<6){m("Mínimo 6 caracteres.");return}if(a!==b){m("Las dos contraseñas no coinciden.");return}
   m("Guardando…");try{const r=await sb.auth.updateUser({password:a});if(r.error)throw r.error;m("Contraseña cambiada.");try{sessionStorage.removeItem("pbb_recupera")}catch(e){}
    setTimeout(()=>{d.remove();try{history.replaceState(null,"",base())}catch(e){}try{msg("Contraseña cambiada")}catch(e){}if(document.getElementById("login")&&typeof iniciar=="function")iniciar()},700)}
   catch(x){m("No se pudo cambiar: "+((x&&x.message)||x)+". Pide otro correo de recuperación.")}};
  setTimeout(()=>{try{document.getElementById("np1").focus()}catch(e){}},300)}
 window.nuevaPass=nueva;
 try{sb.auth.onAuthStateChange(ev=>{if(ev==="PASSWORD_RECOVERY")nueva()})}catch(e){}
 if(window.__recupera){/* el enlace ya ha iniciado sesión (o lo hará en un instante): se pide la contraseña en cuanto haya sesión */
  let n=0;const t=setInterval(async()=>{n++;try{const s=await sb.auth.getSession();if(s&&s.data&&s.data.session){clearInterval(t);nueva()}}catch(e){}if(n>40){clearInterval(t);try{sessionStorage.removeItem("pbb_recupera")}catch(e){}if(!mostrado)try{pantallaLogin("El enlace de recuperación ha caducado o ya se usó. Pide otro con «¿Has olvidado la contraseña?».")}catch(e){}}},250)}
})();
