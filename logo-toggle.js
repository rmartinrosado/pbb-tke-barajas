/* ===== v478: pulsar el título de la cabecera («PBB TKE Maintenance») activa / desactiva el logotipo TKE.
   El estado se guarda en el móvil (localStorage pbb_sinlogo). La versión sigue visible. ===== */
(function(){
 const K="pbb_sinlogo",H=document.documentElement;
 const st=document.createElement("style");st.textContent=`#hk .hkt{cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
html.sinlogo #hk .hklg,html.sinlogo header .logo{display:none!important}
html.sinlogo #hk .hklc .hkv{margin-top:0}`;document.head.appendChild(st);
 const aplica=v=>{H.classList.toggle("sinlogo",!!v)};
 try{aplica(localStorage.getItem(K)==="1")}catch(e){}
 document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("#hk .hkt");if(!t)return;
  const v=!H.classList.contains("sinlogo");aplica(v);try{localStorage.setItem(K,v?"1":"0")}catch(e){}
  try{if(typeof msg=="function")msg(v?"Logotipo desactivado":"Logotipo activado")}catch(e){}});
})();
