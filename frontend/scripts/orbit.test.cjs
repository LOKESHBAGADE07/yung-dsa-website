'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const core=require('../public/style/orbit-core.js');
test('carousel wraps infinitely in both directions and chooses the nearest visual neighbour',()=>{
 assert.equal(core.wrap(-1,3),2);assert.equal(core.wrap(4,3),1);
 assert.equal(core.distance(2,0,3),-1);assert.equal(core.distance(0,2,3),1);
 assert.equal(core.distance(1,7,3),0);
 assert.equal(core.snap(0,-180,0,260),1);assert.equal(core.snap(0,180,0,260),-1);
 assert.equal(core.snap(0,20,0,260),0);assert.equal(core.snap(0,-60,-2,260),1);
 assert.equal(core.snap(0,-195,-5,157),1);assert.equal(core.snap(2,195,5,157),1);
});
test('only recognised shareable look IDs are restored',()=>{
 const looks=[{id:'after-dark'},{id:'studio-notes'},{id:'off-duty'}];
 assert.equal(core.decode('#look=off-duty',looks),2);assert.equal(core.decode('#look=unknown',looks),-1);
 assert.equal(core.decode('#finder',looks),-1);assert.equal(core.decode('#look=%E0%A4%A',looks),-1);
});
test('gallery, hotspots, dialog, filters, keyboard and reduced-motion behaviour work together',t=>{
 let JSDOM;try{JSDOM=require('jsdom').JSDOM;}catch(err){if(err.code==='MODULE_NOT_FOUND'){t.skip('JSDOM integration runs in the full CI install');return;}throw err;}
 const root=path.resolve(__dirname,'../public/style');
 const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://yungdsa.com/style/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,d=w.document;
 w.matchMedia=()=>({matches:true});w.ResizeObserver=class{constructor(cb){this.cb=cb;}observe(){this.cb();}};w.IntersectionObserver=class{observe(){}unobserve(){}};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 w.HTMLElement.prototype.scrollTo=function(){};w.HTMLElement.prototype.scrollBy=function(){};
 for(const name of ['style-core.js','style.js','orbit-core.js','orbit.js'])w.eval(fs.readFileSync(path.join(root,name),'utf8'));
 const click=s=>d.querySelector(s).click();
 click('[data-next]');assert.equal(d.querySelector('[data-look-name]').textContent,'Studio notes');assert.equal(w.location.hash,'#look=studio-notes');
 assert.ok(d.querySelector('[data-look-products] [data-look-product="cyclops-002"]'));
 assert.equal(d.querySelector('[data-orbit-card="0"]').getAttribute('aria-hidden'),'true');
 assert.ok(Array.from(d.querySelectorAll('[data-orbit-card="0"] button')).every(b=>b.tabIndex===-1));
 click('[data-orbit-card="1"] [data-spot]');assert.ok(d.querySelector('dialog').open);assert.equal(d.querySelector('.detail-title').textContent,'Cyclops // 002');
 click('[data-close]');assert.equal(d.querySelector('dialog').open,false);assert.ok(!d.body.classList.contains('dialog-open'));
 const stage=d.querySelector('[data-orbit]');stage.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));assert.equal(d.querySelector('[data-look-name]').textContent,'After dark');
 click('[data-prev]');assert.equal(d.querySelector('[data-look-name]').textContent,'Off duty');
 const form=d.querySelector('[data-style-filter]');form.elements.category.value='lowers';form.elements.budget.value='750';form.dispatchEvent(new w.Event('change'));assert.equal(d.querySelector('[data-empty]').hidden,false);
 click('[data-reset]');assert.equal(d.querySelector('[data-empty]').hidden,true);assert.equal(d.querySelectorAll('[data-product-id]:not([hidden])').length,6);
 assert.ok(d.querySelector('a[href="https://www.linkedin.com/in/lokeshbagade/"]'));
 dom.window.close();
});
