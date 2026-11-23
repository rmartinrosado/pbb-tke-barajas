/* ===== v753: MODO DESARROLLO (23/11/2026) =====
   Mientras la PWA está en desarrollo (Raúl):
   · Sin accesos con contraseña ni códigos dentro de la app: sin candado de Face ID al abrir, sin contraseña de administrador
     y sin códigos de técnico / integrantes / cierre de turno (se validan solos).
     El inicio de sesión de Supabase (correo + contraseña) sigue siendo necesario para acceder a los datos, pero la sesión se
     conserva y solo se pide si caduca.
   · Sin alarma al abrir: no suena ni vibra ni sale el aviso de «OT prioritaria / tiempo de llegada», ni el sonido del
     cambio de turno automático.
   · Al abrir desde el icono, con el usuario administrador, la app entra SIEMPRE en modo ADMINISTRADOR (Panel de control).
   PARA PRODUCCIÓN: poner DESARROLLO=false (vuelve todo: Face ID, contraseñas, códigos, alarmas y modo de entrada normal). */
(function(){
"use strict";
const DESARROLLO=true;
window.PBB_DEV=DESARROLLO;
if(!DESARROLLO)return;
const $i=id=>document.getElementById(id);
const esAdm=()=>{try{return typeof rol!="undefined"&&rol=="admin"}catch(e){return false}};
function aAdmin(){try{if(!esAdm())return;admin=true;tecnico=false;try{if(typeof sosOff=="function")sosOff()}catch(e){}
  view="dash";try{filtro="todas";ptxt=""}catch(e){}try{if(typeof closeSheet=="function")closeSheet()}catch(e){}render();scrollTo(0,0)}catch(e){console.warn("dev aAdmin",e)}}
/* 1) códigos de técnico / integrantes / cierre de turno: siempre válidos */
const parchaRPC=()=>{try{if(typeof sb=="undefined"||!sb||sb.__devRpc)return!!(sb&&sb.__devRpc);const o=sb.rpc.bind(sb);
  sb.rpc=function(fn,args){if(fn=="verificar_tecnico")return Promise.resolve({data:true,error:null});return o(fn,args)};sb.__devRpc=true;return true}catch(e){return false}};
/* 2) contraseña de administrador: entra directo (cerrando el turno abierto sin pedir códigos) */
const parchaAdmin=()=>{if(typeof adminBtn!="function"||adminBtn.__dev)return;const oa=adminBtn;
  adminBtn=window.adminBtn=function(){if(admin||!esAdm())return oa.apply(this,arguments);
   try{turno="";tecNombre="";const S=window.SES;if(S){S.turno="";S.tec="";S.integ=null;S.fin=0;localStorage.setItem("pbb_ses",JSON.stringify(S))}}catch(e){}
   aAdmin();try{msg("Modo Administrador · desarrollo")}catch(e){}};adminBtn.__dev=true};
/* 3) hojas que aún pidan un código o contraseña: se rellenan y se aceptan solas */
const auto=()=>{
 const fl=$i("fidlk");if(fl){fl.remove();try{sessionStorage.setItem("pbb_fidok","1")}catch(e){}if(!admin)aAdmin()}                                   /* candado Face ID al abrir */
 const ap=$i("a_p");if(ap&&!ap.dataset.dev){ap.dataset.dev=1;aAdmin();return}          /* contraseña de administrador */
 const tc=$i("t_c");if(tc&&!tc.dataset.dev){tc.dataset.dev=1;tc.value="dev";try{loginTec()}catch(e){}return}
 const ic=$i("it_c");if(ic&&!ic.dataset.dev){ic.dataset.dev=1;ic.value="dev";try{itCod()}catch(e){}return}
 const ac=$i("adm_ic");if(ac&&!ac.dataset.dev){ac.dataset.dev=1;ac.value="dev";try{admValida()}catch(e){}return}};
/* 4) sin alarma al abrir ni sonido de turno */
const parchaAlarma=()=>{try{if(typeof llegAudio!="undefined"&&llegAudio&&!llegAudio.__dev){llegAudio.play=()=>Promise.resolve();llegAudio.__dev=true}}catch(e){}
 try{if(typeof llegAlarma=="function"&&!llegAlarma.__dev){llegAlarma=function(i){try{const hd=llegHecho();hd[i.id]=Date.now();localStorage.setItem("pbb_lleg_al",JSON.stringify(hd))}catch(e){}};llegAlarma.__dev=true}}catch(e){}
 const la=$i("llegAl");if(la)la.remove()};
/* 5) al abrir: modo ADMINISTRADOR */
let entrado=false;
const arranca=()=>{parchaRPC();parchaAdmin();parchaAlarma();
 try{if(!entrado&&typeof user!="undefined"&&user&&esAdm()){entrado=true;if(!admin||view!="dash")aAdmin()}}catch(e){}};
new MutationObserver(()=>{auto();parchaAlarma()}).observe(document.body,{childList:true,subtree:true});
let n=0;const iv=setInterval(()=>{arranca();auto();if(++n>120&&entrado)clearInterval(iv)},250);
addEventListener("pageshow",e=>{if(e.persisted){entrado=false;arranca()}});
/* aviso: etiqueta DESARROLLO (v754: elemento propio; body::after lo anulaba otra regla de la app) */
const st=document.createElement("style");st.textContent=`#devtag{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 4px);transform:translateX(-50%);z-index:2147483647;pointer-events:none;
 font:800 10px/1 ui-monospace,Menlo,monospace;letter-spacing:2px;color:#fff;background:#c62828;padding:3px 8px;border-radius:6px;box-shadow:0 2px 8px #0006}`;document.head.appendChild(st);
const tag=()=>{if(!document.body)return;let d=$i("devtag");if(!d){d=document.createElement("div");d.id="devtag";d.textContent="DESARROLLO";document.body.appendChild(d)}else if(d!==document.body.lastElementChild&&d.nextElementSibling&&d.nextElementSibling.id!="devtag"){}};
tag();setInterval(tag,2000);
})();
