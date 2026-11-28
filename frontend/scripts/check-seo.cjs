(function checkSeo(){
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),Module=require("node:module");
const root=path.resolve(__dirname,".."),output=path.join(root,"build");
assert.equal(fs.readFileSync(path.join(root,"requirements.txt"),"utf8").trim(),
 fs.readFileSync(path.join(root,"..","requirements.txt"),"utf8").trim(),"Both Vercel build roots need identical direct Python pins");
const pages=require("../data/seo-pages.json");
const projectRequire=Module.createRequire(path.join(root,"package.json"));
const scriptsRequire=Module.createRequire(projectRequire.resolve("react-scripts/package.json"));
const jestRequire=Module.createRequire(scriptsRequire.resolve("jest-environment-jsdom"));
const {JSDOM}=jestRequire("jsdom");
const read=p=>fs.readFileSync(path.join(output,p),"utf8");
const docs=new Map(pages.map(p=>[p.path,new JSDOM(read(p.file),{url:"https://yungdsa.com"+p.path}).window.document]));
const titles=new Set(),descriptions=new Set();
for(const p of pages){
 const doc=docs.get(p.path);
 assert.equal(doc.querySelectorAll('script[src="/guides/static-metrics.js"]').length,1,"Shared measurement gate: "+p.path);
 for(const script of doc.querySelectorAll("script")){
  if(["application/ld+json","application/json"].includes(script.type))continue;
  assert.ok(script.src && new URL(script.src).origin==="https://yungdsa.com", "Executable script outside the same-origin policy: "+p.path);
 }
 for(const el of doc.querySelectorAll("*")){
  assert.ok(!el.getAttributeNames().some(name=>/^on/i.test(name)),"Inline event handler: "+p.path);
 }
 assert.ok(doc.querySelector('a[href="/style/about/#privacy"]'),"Missing privacy control link: "+p.path);
 assert.equal(doc.querySelectorAll("h1").length,1,p.path+" needs one visible main heading");
 const title=doc.title.trim(),desc=doc.querySelector('meta[name="description"]')?.content;
 assert.ok(title && !titles.has(title),"Missing or duplicate title: "+p.path);titles.add(title);
 assert.ok(desc && !descriptions.has(desc),"Missing or duplicate description: "+p.path);descriptions.add(desc);
 assert.equal(doc.querySelectorAll('link[rel="canonical"]').length,1);
 assert.equal(doc.querySelector('link[rel="canonical"]').href,"https://yungdsa.com"+p.path);
 assert.ok(!doc.querySelector('meta[name="keywords"]'));
 assert.ok(!doc.querySelector('meta[name="robots"][content*="noindex"]'));
 for(const script of doc.querySelectorAll('script[type="application/ld+json"]')){
  const structured=JSON.parse(script.textContent),graph=structured["@graph"]||[structured];
  for(const crumb of graph.filter(n=>n["@type"]==="BreadcrumbList")){
   assert.equal(crumb.itemListElement.at(-1).item,"https://yungdsa.com"+p.path);
   crumb.itemListElement.forEach((item,i)=>assert.equal(item.position,i+1));
  }
 }
 for(const link of doc.querySelectorAll("a[href]")){
  const url=new URL(link.href);
  assert.ok(link.textContent.trim()||link.getAttribute("aria-label"),"Unnamed link: "+p.path);
  if(url.origin==="https://yungdsa.com"){
   const target=docs.get(url.pathname);
   if(!target && url.pathname==="/wallpapers/assets/pune-06-fan-wallpaper.png"){
    assert.ok(link.hasAttribute("download"),"Wallpaper links must offer a download");
    assert.ok(fs.existsSync(path.join(output,url.pathname)),"Download asset is missing");
    continue;
   }
   assert.ok(target,"Internal page is missing: "+link.href);
   if(url.hash)assert.ok(target.getElementById(decodeURIComponent(url.hash.slice(1))),"Missing fragment: "+link.href);
  }
  if(link.target==="_blank"){assert.ok(link.rel.includes("noopener"));assert.ok(link.rel.includes("noreferrer"));}
 }
 for(const image of doc.querySelectorAll("img")){
  assert.ok(image.hasAttribute("alt"),"Missing image alternative");
  assert.ok(image.width>0&&image.height>0,"Missing image dimensions");
 }
}
const home=docs.get("/");
assert.equal(home.querySelector("#root").dataset.prerendered,"true");
assert.equal(home.querySelectorAll('a[data-testid^="release-card-"]').length,11);
assert.ok(home.querySelector('a[href="/style/goggles-sunglasses/"]'));
assert.ok(home.querySelector('a[href="/style/baggy-lowers/"]'));
assert.ok(home.querySelector('a[href="https://www.linkedin.com/in/lokeshbagade/"]'));
assert.ok(!home.querySelector("noscript h1"));
const editorial=require('../src/editorial.json');
assert.equal(home.title,editorial.homeTitle);
assert.equal(home.querySelector('meta[name="description"]').content,editorial.homeDescription);
for (const faq of editorial.homeFaq) {
 const card = Array.from(home.querySelectorAll('.artist-faq-list article')).find(article => article.querySelector('h3')?.textContent === faq.question);
 assert.ok(card?.textContent.includes(faq.answer), 'FAQ absent from prerendered HTML');
 if (faq.href) assert.ok(card.querySelector('a[href="' + faq.href + '"]'), 'Missing guide in FAQ: ' + faq.question);
 if (faq.source) assert.ok(card.querySelector('a[href="' + editorial.sources[faq.source] + '"]'), 'Missing source in FAQ: ' + faq.question);
}
const fitPath = '/style/fit-check/';
for (const [guide, area] of [
 ['/style/goggles-sunglasses/', '.comparison + .actions'],
 ['/style/baggy-lowers/', '#options'],
 ['/style/hoodies-brand/', '#fit']
]) {
 assert.ok(docs.get(guide).querySelector(area + ' a[href="' + fitPath + '"]'), 'Missing contextual Fit Check link from ' + guide);
 assert.ok(docs.get(fitPath).querySelector('.fit-guides a[href^="' + guide + '"]'), 'Missing comparison link back to ' + guide);
}
const wallpaper = docs.get('/wallpapers/');
assert.ok(wallpaper.querySelector('.article-hero a[href="/style/#orbit"][data-wallpaper-choice="artist-photos"]'));
assert.ok(wallpaper.querySelector('.article-hero a[download][data-wallpaper-choice="download-artwork"]'));
for(const p of pages){
 assert.ok(home.querySelector('footer a[href="'+p.path+'"]'),'Missing footer route '+p.path);
 if(p.path!=='/')assert.ok(home.querySelector('main a[href="'+p.path+'"]'),'Missing body route '+p.path);
}
const artist=Array.from(home.querySelectorAll('script[type="application/ld+json"]')).flatMap(s=>JSON.parse(s.textContent)["@graph"]||[]).find(n=>n["@id"]==="https://yungdsa.com/#artist");
assert.equal(artist["@type"],"Person");
const sitemap=new JSDOM(read("sitemap.xml"),{contentType:"application/xml"}).window.document;
assert.deepEqual(Array.from(sitemap.querySelectorAll("loc"),n=>n.textContent),pages.map(p=>"https://yungdsa.com"+p.path));
assert.match(read("robots.txt"),/Sitemap: https:\/\/yungdsa.com\/sitemap.xml/);
assert.ok(!/Disallow:\s*\/\s*$/m.test(read("robots.txt")));
const missing=new JSDOM(read("404.html")).window.document;
assert.equal(missing.querySelector('meta[name="robots"]').content,"noindex");
assert.ok(!pages.some(p=>p.path==="/404.html"));
const config=JSON.parse(fs.readFileSync(path.join(root,"../vercel.json"),"utf8"));
assert.equal(config.framework,null,"Use static output routing; do not fall back to the homepage for unknown URLs");
const frontendConfig=JSON.parse(fs.readFileSync(path.join(root,"vercel.json"),"utf8"));
assert.equal(frontendConfig.framework,null);
assert.equal(frontendConfig.outputDirectory,"build");
assert.deepEqual(frontendConfig.routes,config.routes);
assert.ok(!config.redirects&&!config.rewrites&&!config.headers&&!config.trailingSlash);
const filePhase=config.routes.findIndex(r=>r.handle==="filesystem");
assert.ok(filePhase>0);
assert.deepEqual(config.routes.at(-1),{src:"^/.*$",status:404,dest:"/404.html"});
for(const rule of config.routes.filter(r=>r.status===308)){
 assert.ok(docs.has(rule.headers.Location),"Redirect target missing");
 assert.ok(!new RegExp(rule.src).test(rule.headers.Location),"Redirect loop");
}
for(const p of pages.filter(p=>p.file.endsWith("index.html"))){
 const rule=config.routes.find(r=>r.dest==="/"+p.file&&!r.status);
 assert.ok(rule&&new RegExp(rule.src).test(p.path),"Missing explicit page route");
}
for(const file of ["404.html","robots.txt","sitemap.xml"]){
 assert.ok(fs.existsSync(path.join(output,file)),"Missing static asset");
 assert.ok(!config.routes.slice(0,filePhase).some(r=>r.dest&&new RegExp(r.src).test("/"+file)));
}
console.log(`SEO checks passed: ${pages.length} canonical pages, static content, links, images, structured data, sitemap and 404 configuration.`);
async function hydrateCheck(){
 const dom=new JSDOM(read("index.html"),{url:"https://yungdsa.com/",pretendToBeVisual:true});
 // jsdom lacks the native dialog methods. The browser test exercises real focus and Escape handling.
 const dialog=dom.window.HTMLDialogElement.prototype;
 if(!dialog.showModal)dialog.showModal=function(){this.setAttribute("open","");};
 if(!dialog.close)dialog.close=function(){this.removeAttribute("open");this.dispatchEvent(new dom.window.Event("close"));};
 for(const name of ["window","document","navigator","HTMLElement","HTMLIFrameElement","Node","MutationObserver"])Object.defineProperty(globalThis,name,{value:dom.window[name],configurable:true,writable:true});
 globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);
 globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);
 const errors=[],oldError=console.error;
 console.error=(...args)=>errors.push(args.map(String).join(" "));
 try{
  const {loadSource}=require("./prerender-home.cjs");
  loadSource("index.js");
  const settle=()=>new Promise(resolve=>setTimeout(resolve,80));
  await settle();
  const button=document.querySelector('[data-testid="mobile-menu-button"]');
  button.click();await settle();assert.equal(button.getAttribute("aria-expanded"),"true");
  document.querySelector('[data-testid="nav-music-link"]').click();await settle();assert.equal(button.getAttribute("aria-expanded"),"false");
  const video=document.querySelector('[data-testid="release-card-0"]');
  const ordinary=new dom.window.MouseEvent("click",{bubbles:true,cancelable:true,button:0});
  video.dispatchEvent(ordinary);await settle();assert.equal(ordinary.defaultPrevented,true);assert.ok(document.querySelector('[data-testid="video-modal"]'));
  document.querySelector('[data-testid="video-modal-close"]').click();await settle();assert.ok(!document.querySelector('[data-testid="video-modal"]'));
  const modified=new dom.window.MouseEvent("click",{bubbles:true,cancelable:true,button:0,ctrlKey:true});
  // Prevent jsdom navigation after checking that the component kept normal browser link semantics.
  let preventedByComponent;
  const observe=e=>{preventedByComponent=e.defaultPrevented;e.preventDefault();};
  document.addEventListener("click",observe,{once:true});video.dispatchEvent(modified);await settle();
  assert.equal(preventedByComponent,false);assert.ok(!document.querySelector('[data-testid="video-modal"]'));
  assert.deepEqual(errors,[],"Hydration or runtime errors");
  console.log("Hydration checks passed: actual client entry, mobile navigation, video dialog and modified-click links.");
 }finally{console.error=oldError;dom.window.close();}
}
hydrateCheck().catch(error=>{console.error(error);process.exitCode=1;});
})();

