(function(){
'use strict';
const core=window.OrbitEdit,stage=document.querySelector('[data-orbit]');
if(!core||!stage)return;
const looks=JSON.parse(document.getElementById('orbit-data').textContent),cards=Array.from(document.querySelectorAll('[data-orbit-card]'));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),header=document.querySelector('[data-header]');
let position=0,target=0,active=0,frame=0,lastTime=0,drag=null,suppressClick=false,step=260;
const panel=document.querySelector('[data-look-products]'),dots=Array.from(document.querySelectorAll('[data-look]'));
function render(){
 step=Math.min(260,stage.clientWidth*.42);
 cards.forEach((card,index)=>{
  const d=core.distance(index,position,looks.length),abs=Math.abs(d);
  card.style.transform='translate3d('+(d*step)+'px,0,'+(-abs*170)+'px) scale('+(1-Math.min(abs,1.5)*.27)+') rotateY('+(-d*9)+'deg)';
  card.style.opacity=String(Math.max(.08,1-abs*.72));
  card.style.filter='blur('+(Math.max(0,abs-.12)*3.1)+'px)';
  card.style.zIndex=String(20-Math.round(abs*10));
 });
}
function animate(now){
 const dt=Math.min(32,lastTime?now-lastTime:16);lastTime=now;
 position+=(target-position)*(1-Math.exp(-dt*.013));
 if(Math.abs(position-target)<.001){position=target;frame=0;lastTime=0;render();return;}
 render();frame=requestAnimationFrame(animate);
}
function move(){if(reduced.matches){position=target;render();return;}if(!frame)frame=requestAnimationFrame(animate);}
function sync(index){
 active=core.wrap(index,looks.length);const look=looks[active];
 document.querySelector('[data-look-name]').textContent=look.name;
 document.querySelector('[data-look-number]').textContent=String(active+1).padStart(2,'0');
 document.querySelector('[data-look-note]').textContent=look.note;
 const credit=document.querySelector('[data-photo-credit]');credit.textContent=look.credit+' ↗';credit.href=look.source;
 panel.replaceChildren(document.querySelector('[data-look-panel="'+active+'"]').content.cloneNode(true));
 panel.classList.remove('panel-enter');void panel.offsetWidth;panel.classList.add('panel-enter');
 dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===active)));
 cards.forEach((card,i)=>{card.classList.toggle('is-active',i===active);card.setAttribute('aria-hidden',String(i!==active));card.querySelectorAll('button').forEach(b=>b.tabIndex=i===active?0:-1);});
}
function select(value,share){target=value;sync(Math.round(value));move();if(share)history.replaceState(null,'','#look='+looks[active].id);}
function choose(index){const delta=core.distance(index,target,looks.length);select(Math.round(target+delta),true);}
document.querySelector('[data-prev]').addEventListener('click',()=>select(Math.round(target)-1,true));
document.querySelector('[data-next]').addEventListener('click',()=>select(Math.round(target)+1,true));
dots.forEach((dot,i)=>dot.addEventListener('click',()=>choose(i)));
stage.addEventListener('keydown',event=>{if(event.target!==stage)return;let next=null;if(event.key==='ArrowRight')next=Math.round(target)+1;if(event.key==='ArrowLeft')next=Math.round(target)-1;if(event.key==='Home')next=0;if(event.key==='End')next=looks.length-1;if(next!==null){event.preventDefault();select(next,true);}});
stage.addEventListener('pointerdown',event=>{
 if(event.button!==0||event.target.closest('button'))return;
 drag={id:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,lastT:event.timeStamp,start:position,v:0,moved:false,axis:null};
 suppressClick=false;
});
stage.addEventListener('pointermove',event=>{
 if(!drag||event.pointerId!==drag.id)return;
 const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
 if(!drag.axis&&Math.max(Math.abs(dx),Math.abs(dy))>7){drag.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';if(drag.axis==='x'){stage.setPointerCapture(event.pointerId);stage.classList.add('is-dragging');}}
 if(drag.axis!=='x')return;
 drag.moved=true;drag.v=(event.clientX-drag.lastX)/Math.max(1,event.timeStamp-drag.lastT);drag.lastX=event.clientX;drag.lastT=event.timeStamp;
 if(frame){cancelAnimationFrame(frame);frame=0;lastTime=0;}
 position=drag.start-dx/step;target=position;render();
});
function endDrag(event){
 if(!drag||event.pointerId!==drag.id)return;
 const info=drag;drag=null;stage.classList.remove('is-dragging');
 if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);
 if(info.moved){suppressClick=true;const speed=event.timeStamp-info.lastT<120?info.v:0;select(core.snap(info.start,event.clientX-info.x,speed,step),true);setTimeout(()=>{suppressClick=false;},50);}
}
stage.addEventListener('pointerup',endDrag);
stage.addEventListener('pointercancel',event=>{if(!drag)return;const start=drag.start;drag=null;stage.classList.remove('is-dragging');if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);select(Math.round(start),false);});
stage.addEventListener('click',event=>{
 if(suppressClick)return;
 const spot=event.target.closest('[data-spot]');
 if(spot){const card=panel.querySelector('[data-look-product]'+(spot.dataset.spot==='lowers'?':last-child':':first-child'));if(card){card.classList.add('is-highlighted');const button=card.querySelector('[data-quick]');if(button)openDetail(button.dataset.quick,spot);setTimeout(()=>card.classList.remove('is-highlighted'),900);}return;}
 const card=event.target.closest('[data-orbit-card]');if(card&&Number(card.dataset.orbitCard)!==active)choose(Number(card.dataset.orbitCard));
});
new ResizeObserver(render).observe(stage);
const initial=core.decode(location.hash,looks);if(initial>=0){position=target=initial;sync(initial);}render();
window.addEventListener('hashchange',()=>{const i=core.decode(location.hash,looks);if(i>=0)choose(i);});
const dialog=document.querySelector('[data-dialog]');let returnFocus=null;
function openDetail(id,trigger){const template=document.querySelector('[data-detail="'+id+'"]');if(!template)return;returnFocus=trigger;dialog.querySelector('[data-dialog-content]').replaceChildren(template.content.cloneNode(true));dialog.showModal();document.body.classList.add('dialog-open');dialog.querySelector('[data-close]').focus();}
document.addEventListener('click',event=>{const button=event.target.closest('[data-quick]');if(button)openDetail(button.dataset.quick,button);});
dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');dialog.querySelector('[data-dialog-content]').replaceChildren();if(returnFocus&&returnFocus.isConnected)returnFocus.focus({preventScroll:true});});
const grid=document.querySelector('[data-product-grid]'),previous=document.querySelector('[data-rail-prev]'),next=document.querySelector('[data-rail-next]');
function railState(){previous.disabled=grid.scrollLeft<2;next.disabled=grid.scrollLeft+grid.clientWidth>=grid.scrollWidth-3;}
previous.addEventListener('click',()=>grid.scrollBy({left:-grid.clientWidth*.8,behavior:reduced.matches?'auto':'smooth'}));
next.addEventListener('click',()=>grid.scrollBy({left:grid.clientWidth*.8,behavior:reduced.matches?'auto':'smooth'}));
grid.addEventListener('scroll',railState,{passive:true});new ResizeObserver(railState).observe(grid);
document.querySelector('[data-style-filter]').addEventListener('change',()=>{grid.scrollTo({left:0,behavior:'instant'});requestAnimationFrame(railState);});
document.querySelector('[data-reset]').addEventListener('click',()=>requestAnimationFrame(railState));
railState();
new IntersectionObserver(entries=>header.classList.toggle('is-scrolled',!entries[0].isIntersecting),{rootMargin:'-90px 0px 0px 0px'}).observe(document.querySelector('.edit-hero'));
const menu=document.querySelector('.mobile-menu');menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.open=false));document.addEventListener('keydown',e=>{if(e.key==='Escape')menu.open=false;});
const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('is-pending');reveal.unobserve(entry.target);}}),{threshold:.08});
if(!reduced.matches)document.querySelectorAll('.pieces-heading,.guide-section>div').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal','is-pending');reveal.observe(el);}});
document.querySelectorAll('img').forEach(img=>{const fail=()=>img.parentElement.classList.add('image-unavailable');img.addEventListener('error',fail);if(img.complete&&!img.naturalWidth)fail();});
document.body.classList.add('is-enhanced');
})();
