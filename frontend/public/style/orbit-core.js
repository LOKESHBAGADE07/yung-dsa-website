(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.OrbitEdit=factory();})(typeof window!=='undefined'?window:this,function(){
  'use strict';
  function wrap(value,length){return ((value%length)+length)%length;}
  function distance(index,position,length){return wrap(index-position+length/2,length)-length/2;}
  function snap(start,dx,velocity,step){return Math.round(start-dx/step-Math.max(-.8,Math.min(.8,velocity*.18)))+0;}
  function decode(hash,looks){const match=/^#look=([a-z0-9-]+)$/.exec(hash);return match?looks.findIndex(l=>l.id===match[1]):-1;}
  return {wrap:wrap,distance:distance,snap:snap,decode:decode};
});
