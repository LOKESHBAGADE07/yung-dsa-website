(function(){
 'use strict';
 const hub=document.querySelector('[data-studio]'),core=window.StyleStudio;
 if(!hub||!core)return;
 const data=JSON.parse(document.getElementById('studio-catalog').textContent),products=data.products,key='yung-dsa-style-look-v1';
 let state=core.decode(location.hash,products)||core.validate(core.presets.afterhours,products),avatar=null;
 const $=s=>document.querySelector(s),all=s=>Array.from(document.querySelectorAll(s)),money=n=>'₹'+n.toLocaleString('en-IN'),feedback=$('[data-studio-feedback]'),spinButton=$('[data-model-action="spin"]');
 function notify(message){feedback.textContent=message;}
 function saved(){try{const raw=localStorage.getItem(key);return raw?core.validate(JSON.parse(raw),products):null;}catch{return null;}}
 function update(){
  const preset=core.presetName(state);all('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===preset)));all('[data-top]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.top===state.top)));
  $('[data-look-title]').textContent=preset?core.presets[preset].name:'Your remix';$('[data-look-description]').textContent=preset?core.presets[preset].description:'Your frames. Your silhouette. Your own combination.';
  for(const category of ['eyewear','lowers']){const product=products.find(p=>p.id===state[category]);$('[data-look-select="'+category+'"]').value=product.id;const link=$('[data-look-link="'+category+'"]');link.href=product.url;link.dataset.retailerId=product.id;link.dataset.merchant=product.merchant;link.setAttribute('aria-label','View '+product.name+' photos and sizes at '+product.merchant+' (opens in a new tab)');}
  $('[data-look-total]').textContent=money(core.total(state,products));avatar?.update(state);
  all('[data-add-look]').forEach(button=>{const selected=state[button.dataset.category]===button.dataset.addLook;button.textContent=selected?'In your look':'Style this piece';button.setAttribute('aria-pressed',String(selected));});
  $('[data-share-fallback]').hidden=true;
 }
 function change(next,message){state=core.validate(next,products);update();notify(message);}
 all('[data-preset]').forEach(button=>button.addEventListener('click',()=>change(core.presets[button.dataset.preset],core.presets[button.dataset.preset].name+' selected. Rotate the character to explore.')));
 all('[data-look-select]').forEach(select=>select.addEventListener('change',()=>change({...state,[select.dataset.lookSelect]:select.value},'Look updated. Reference total: '+money(core.total({...state,[select.dataset.lookSelect]:select.value},products))+'.')));
 all('[data-top]').forEach(button=>button.addEventListener('click',()=>change({...state,top:button.dataset.top},button.getAttribute('aria-label')+' selected. This top is a styling concept.')));
 all('[data-focus-part]').forEach(button=>button.addEventListener('click',()=>{const select=$('[data-look-select="'+button.dataset.focusPart+'"]');select.focus();notify('Choose a '+(button.dataset.focusPart==='eyewear'?'frame':'lower')+' from the highlighted selector.');}));
 all('[data-add-look]').forEach(button=>button.addEventListener('click',()=>{change({...state,[button.dataset.category]:button.dataset.addLook},'Added to your look. Your 3D colours and reference total are updated.');hub.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});$('[data-look-select="'+button.dataset.category+'"]').focus({preventScroll:true});}));
 $('[data-save-look]').addEventListener('click',()=>{try{localStorage.setItem(key,JSON.stringify(state));$('[data-restore-look]').hidden=false;notify('Look saved on this device. Use “Load saved look” to bring it back.');}catch{notify('This browser could not save the look. Use Share look to keep its link instead.');}});
 $('[data-restore-look]').hidden=!saved();$('[data-restore-look]').addEventListener('click',()=>{const restored=saved();if(restored)change(restored,'Your saved look is back.');else notify('No saved look is available on this device.');});
 $('[data-share-look]').addEventListener('click',async()=>{const url='https://yungdsa.com/style/'+core.encode(state);try{if(navigator.share){await navigator.share({title:'My Yung DSA-inspired look',text:'Build your own fan-art look in the Style Studio.',url});notify('Look shared.');}else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);notify('Look link copied. Paste it into your chat or story.');}else throw new Error('Clipboard unavailable');}catch(error){if(error.name==='AbortError'){notify('Sharing cancelled. Your look is still here.');return;}$('[data-share-fallback]').hidden=false;$('#share-url').value=url;$('#share-url').focus();$('#share-url').select();notify('Copy the link below to share this exact combination.');}});
 window.addEventListener('hashchange',()=>{const shared=core.decode(location.hash,products);if(shared)change(shared,'Shared look loaded. Make it yours.');});
 all('[data-model-action]').forEach(button=>{button.disabled=true;button.addEventListener('click',()=>{if(!avatar)return;const spinning=avatar.action(button.dataset.modelAction);spinButton.setAttribute('aria-pressed',String(spinning));spinButton.textContent=spinning?'Pause spin':'Auto spin';});});
 $('#model-view').addEventListener('studio:spin-stop',()=>{spinButton.setAttribute('aria-pressed','false');spinButton.textContent='Auto spin';});
 update();
 // Lazy-load the renderer only on the studio page. Shopping works if WebGL or the module fails.
 import('./avatar.js').then(({mountAvatar})=>{avatar=mountAvatar($('#model-view'),state);all('[data-model-action]').forEach(button=>button.disabled=false);window.addEventListener('pagehide',event=>{if(!event.persisted)avatar.destroy();},{once:true});}).catch(()=>{$('[data-model-status]').textContent='3D is unavailable in this browser. You can still build, save and share your look.';$('#model-help').textContent='Outfit controls work without 3D.';});
})();
