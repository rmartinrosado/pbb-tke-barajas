/* ===== v416: fluidez del táctil =====
 La PWA tiene unas 45 «vigías» (MutationObserver) que revisan la pantalla cuando cambia algo. Las animaciones de la guía
 (almena, brazo autonivelador…) cambian sus textos y dibujos 60 veces por segundo y despertaban a TODAS en cada fotograma:
 el teléfono pasaba el tiempo recorriendo la pantalla y el desplazamiento con el dedo iba a tirones.
 Aquí se filtran, para todas las vigías, los cambios que ocurren DENTRO de un dibujo (svg) o de una animación (.gsim),
 salvo que la vigía esté puesta sobre el propio dibujo. No cambia nada de lo que se ve. */
(function(){
"use strict";
const MO=window.MutationObserver;if(!MO||MO.__flt)return;
const ANIM="svg,.gsim";
const dentro=n=>{const e=n&&(n.nodeType==1?n:n.parentNode);return !!(e&&e.closest&&e.closest(ANIM))};
function F(cb){const self=this;this.__in=false;
 this.__o=new MO(function(recs){const r=self.__in?recs:recs.filter(m=>!dentro(m.target));if(r.length)cb.call(self,r,self)})}
F.prototype.observe=function(t,o){if(dentro(t))this.__in=true;return this.__o.observe(t,o)};
F.prototype.disconnect=function(){return this.__o.disconnect()};
F.prototype.takeRecords=function(){const r=this.__o.takeRecords();return this.__in?r:r.filter(m=>!dentro(m.target))};
F.__flt=1;window.MutationObserver=F;
})();
