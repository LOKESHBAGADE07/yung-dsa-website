(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.StyleStudio=factory();})(typeof self!=='undefined'?self:this,function(){
 'use strict';
 const presets={afterhours:{name:'After hours',description:'Dark frames. Heavy silhouette. A little silver.',eyewear:'y2k-001',lowers:'rivet-denim-black',top:'black'},bluehour:{name:'Blue hour',description:'Blue frames. Easy trousers. Room to move.',eyewear:'ape-x-002',lowers:'waffle-pants',top:'cream'},spotlight:{name:'Spotlight',description:'A red statement. White frames. Oversized denim.',eyewear:'cyclops-002',lowers:'1998-denim',top:'red'}};
 const tops=['black','cream','red','blue'];
 function validate(input,products){const value=input&&typeof input==='object'?input:{};const result={};for(const category of ['eyewear','lowers'])result[category]=products.some(p=>p.category===category&&p.id===value[category])?value[category]:presets.afterhours[category];result.top=tops.includes(value.top)?value.top:'black';return result;}
 function total(state,products){return products.filter(p=>p.id===state.eyewear||p.id===state.lowers).reduce((sum,p)=>sum+p.price,0);}
 function encode(state){return '#look='+encodeURIComponent([state.eyewear,state.lowers,state.top].join('~'));}
 function decode(hash,products){if(!hash.startsWith('#look='))return null;try{const parts=decodeURIComponent(hash.slice(6)).split('~');return validate({eyewear:parts[0],lowers:parts[1],top:parts[2]},products);}catch{return null;}}
 function presetName(state){return Object.keys(presets).find(key=>['eyewear','lowers','top'].every(field=>presets[key][field]===state[field]))||null;}
 return {presets,tops,validate,total,encode,decode,presetName};
});
