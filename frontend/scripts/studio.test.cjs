'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const core=require('../public/style/studio-core.js'),data=require('../data/style-catalog.json');
test('look links round-trip all preset and custom selections; unsafe and wrong-category inputs fall back',()=>{
 for(const look of Object.values(core.presets)){const value=core.validate(look,data.products);assert.deepEqual(core.decode(core.encode(value),data.products),value);}
 assert.equal(core.decode('#look=%E0%A4%A',data.products),null);
 assert.equal(core.decode('#finder',data.products),null);
 assert.deepEqual(core.validate({eyewear:'javascript:alert(1)',lowers:'y2k-001',top:'<script>'},data.products),{eyewear:'y2k-001',lowers:'rivet-denim-black',top:'black'});
 assert.equal(core.presetName({eyewear:'ape-x-002',lowers:'rivet-denim-black',top:'red'}),null);
});
test('reference total counts only the selected two products, not concept clothes',()=>{
 assert.equal(core.total(core.presets.afterhours,data.products),2050);
 assert.equal(core.total(core.presets.bluehour,data.products),3150);
 assert.equal(core.total(core.presets.spotlight,data.products),4549);
});
test('studio selection, save, restore, inbound link, hotspot and sharing fallback work without WebGL',async()=>{
 const {JSDOM}=require('jsdom');
 const html=fs.readFileSync(path.join(__dirname,'../public/style/index.html'),'utf8');
 const dom=new JSDOM(html,{url:'https://yungdsa.com/style/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document;w.matchMedia=()=>({matches:true});w.HTMLElement.prototype.scrollIntoView=function(){};
 w.eval(fs.readFileSync(path.join(__dirname,'../public/style/studio-core.js'),'utf8'));w.eval(fs.readFileSync(path.join(__dirname,'../public/style/studio.js'),'utf8'));
 const click=selector=>d.querySelector(selector).click();
 assert.equal(d.querySelector('[data-look-total]').textContent,'₹2,050');
 click('[data-preset="bluehour"]');assert.equal(d.querySelector('[data-look-total]').textContent,'₹3,150');assert.equal(d.querySelector('#look-eyewear').value,'ape-x-002');
 click('[data-save-look]');click('[data-preset="spotlight"]');click('[data-restore-look]');assert.equal(d.querySelector('#look-lowers').value,'waffle-pants');
 click('[data-top="red"]');assert.equal(d.querySelector('[data-look-title]').textContent,'Your remix');
 click('[data-add-look="rivet-denim-black"]');assert.equal(d.querySelector('[data-look-total]').textContent,'₹2,100');
 click('[data-focus-part="eyewear"]');assert.equal(d.activeElement.id,'look-eyewear');
 click('[data-share-look]');await new Promise(resolve=>setTimeout(resolve,0));assert.equal(d.querySelector('[data-share-fallback]').hidden,false);assert.equal(d.querySelector('#share-url').value,'https://yungdsa.com/style/#look=ape-x-002~rivet-denim-black~red');
 w.location.hash=core.encode(core.validate(core.presets.spotlight,data.products));w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert.equal(d.querySelector('[data-look-total]').textContent,'₹4,549');
 assert.match(d.querySelector('[data-model-status]').textContent,/3D is unavailable/);
 assert.ok(d.querySelectorAll('[data-model-action]:disabled').length===4);
 dom.window.close();
});
