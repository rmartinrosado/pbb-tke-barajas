/* v386: Seguimiento OT · bajo «PBB nnn [tipo]» de la primera línea (visible también con la tarjeta plegada): fecha y «Reportado por» */
(function(){if(typeof card!="function")return;
 const st=document.createElement("style");st.textContent=`.ot .ohd>b.ohb2{display:flex;flex-wrap:wrap;align-items:center;column-gap:6px;row-gap:1px;min-width:0;flex:0 1 auto;overflow:hidden}
.ot .ohd>b.ohb2>small.ohsub{flex-basis:100%;font-size:11.5px;font-weight:600;color:var(--mu,#666);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;letter-spacing:.2px}`;document.head.appendChild(st);
 const hoy=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
 const fch=f=>{const m=String(f||"").match(/^(\d{4})-(\d{2})-(\d{2})/);if(m&&m[0]==hoy())return "HOY";return m?`${m[3]}/${m[2]}/${m[1]}`:String(f||"")};
 const o=card;card=function(i){const h=o.apply(this,arguments);try{if(typeof view=="undefined"||view!="track"||!i)return h;
  const f=fch(i.fecha),r=i.rep?String(i.rep):"";if(!f&&!r)return h;
  const k=h.indexOf("</b>");if(k<0)return h;const a=h.lastIndexOf("<b>",k);if(a<0)return h;
  return h.slice(0,a)+'<b class="ohb2">'+h.slice(a+3,k)+(f?`<small class="ohsub">${esc(f)}</small>`:"")+(r?`<small class="ohsub" title="Reportado por">${esc(r)}</small>`:"")+"</b>"+h.slice(k+4)}catch(e){return h}}})();
