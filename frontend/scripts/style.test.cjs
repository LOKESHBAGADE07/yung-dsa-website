(function styleTests(){
"use strict";
const test=require("node:test"), assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,".."),pub=path.join(root,"public");
const data=JSON.parse(fs.readFileSync(path.join(root,"data/style-catalog.json"),"utf8"));
const {select}=require("../public/style/style-core.js");
const routes=["/style/","/style/goggles-sunglasses/","/style/baggy-lowers/","/style/looks/","/style/about/"];
const html=Object.fromEntries(routes.map(r=>[r,fs.readFileSync(path.join(pub,r,"index.html"),"utf8")]));
test("combined category and budget filters exclude unrelated and over-budget options",()=>{
 assert.deepEqual(select(data.products,{category:"lowers",budget:"1500"}).map(p=>p.id),["rivet-denim-black"]);
 assert.equal(select(data.products,{category:"eyewear",budget:"750"}).length,3);
 assert.equal(select(data.products,{category:"lowers",budget:"750"}).length,0);
});
test("price sorting does not mutate catalogue order; unset budget shows all",()=>{
 const before=JSON.stringify(data.products);
 assert.deepEqual(select(data.products,{category:"all",sort:"price-desc"}).map(p=>p.price),[3799,2450,1400,750,700,650]);
 assert.deepEqual(select(data.products,{category:"all",sort:"price-asc"}).map(p=>p.price),[650,700,750,1400,2450,3799]);
 assert.equal(JSON.stringify(data.products),before);
 assert.equal(select(data.products,{budget:"",category:"all"}).length,6);
});
function browserHarness(optOut=false){
 const cards=data.products.map(p=>({dataset:{productId:p.id,category:p.category,price:String(p.price)},hidden:false}));
 const grid={children:cards.slice(),querySelectorAll:()=>cards,appendChild(node){this.children=this.children.filter(n=>n!==node);this.children.push(node);}};
 const elements={category:{value:"all",focus(){this.focused=true;}},budget:{value:""},sort:{value:""}};
 const handlers={},resetHandlers={},count={},empty={hidden:true},scripts=[],events=[],docHandlers={};
 const filter={hidden:true,elements,addEventListener:(type,fn)=>handlers[type]=fn,reset(){elements.category.value="all";elements.budget.value="";elements.sort.value="";}};
 const selectors={"[data-style-filter]":filter,"[data-product-grid]":grid,"[data-result-count]":count,"[data-empty]":empty,"[data-reset]":{addEventListener:(t,fn)=>resetHandlers[t]=fn}};
 const document={querySelector:s=>selectors[s]||null,createElement:()=>({}),head:{appendChild:n=>scripts.push(n)},addEventListener:(t,fn)=>docHandlers[t]=fn};
 const window={StyleFinder:{select},location:{pathname:"/style/"},dispatchEvent:e=>events.push(e)};
 const context={document,window,navigator:{globalPrivacyControl:optOut},CustomEvent:function(type,options){this.type=type;this.detail=options.detail;}};
 vm.runInNewContext(fs.readFileSync(path.join(pub,"style/style.js"),"utf8"),context);
 return {filter,grid,cards,elements,handlers,resetHandlers,count,empty,scripts,events,docHandlers};
}
test("filter UI supports empty results, accessible count and full reset",()=>{
 const h=browserHarness();
 assert.equal(h.filter.hidden,false);assert.equal(h.count.textContent,"6 options shown");
 h.elements.category.value="lowers";h.elements.budget.value="750";h.handlers.change();
 assert.equal(h.count.textContent,"0 options shown");assert.equal(h.empty.hidden,false);assert.ok(h.cards.every(n=>n.hidden));
 h.resetHandlers.click();assert.equal(h.empty.hidden,true);assert.equal(h.count.textContent,"6 options shown");assert.ok(h.elements.category.focused);
 h.elements.sort.value="price-desc";h.handlers.change();
 assert.deepEqual(h.grid.children.filter(n=>!n.hidden).map(n=>n.dataset.productId),["1998-denim","waffle-pants","rivet-denim-black","cyclops-002","ape-x-002","y2k-001"]);
});
test("privacy signal suppresses analytics and local outbound hook; links are never intercepted",()=>{
 const h=browserHarness(true);
 assert.equal(h.scripts.length,0);
 h.docHandlers.click({target:{closest:()=>({dataset:{retailerId:"y2k-001",merchant:"Urban Monkey"}})}});
 assert.equal(h.events.length,0);
 const normal=browserHarness();
 assert.equal(normal.scripts[0].src,"/_vercel/insights/script.js");
 normal.docHandlers.click({target:{closest:()=>({dataset:{retailerId:"y2k-001",merchant:"Urban Monkey"}})}});
 assert.equal(normal.events[0].type,"style:retailer-click");assert.equal(normal.events[0].detail.product_id,"y2k-001");
});
test("all products and direct links exist in static HTML without JavaScript",()=>{
 assert.equal((html["/style/"].match(/data-product-id=/g)||[]).length,6);
 for(const category of ["goggles-sunglasses","baggy-lowers"]) assert.equal((html["/style/"+category+"/"].match(/data-product-id=/g)||[]).length,3);
 for(const p of data.products){
  assert.ok(html["/style/"].includes('data-product-id="'+p.id+'"'));
  assert.ok(html["/style/"].includes(p.url.replace(/&/g,"&amp;")));
  assert.ok(html["/style/"].includes('data-price="'+p.price+'"'));
 }
 assert.match(html["/style/"],/data-style-filter hidden/);
 assert.match(html["/style/"],/data-empty hidden/);
 assert.equal(data.affiliateActive,false);
});
test("all static pages have unique titles, one h1, canonical, disclosure, valid JSON-LD and safe external links",()=>{
 const titles=new Set();
 for(const [route,doc] of Object.entries(html)){
  const title=doc.match(/<title>(.*?)<\/title>/)[1]; assert.ok(!titles.has(title));titles.add(title);
  assert.equal((doc.match(/<h1(?: |>)/g)||[]).length,1);
  assert.ok(doc.includes('rel="canonical" href="https://yungdsa.com'+route+'"'));
  assert.match(doc,/Not affiliated with or endorsed by Yung DSA or his team/);
  assert.match(doc,/https:\/\/www.linkedin.com\/in\/lokeshbagade\//);
  const ld=JSON.parse(doc.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(ld.url,"https://yungdsa.com"+route); assert.notEqual(ld["@type"],"Product");
  const ids=Array.from(doc.matchAll(/\sid="([^"]+)"/g),m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  for(const match of doc.matchAll(/<a\b[^>]*>/g)) {
   if(match[0].includes('target="_blank"')) assert.match(match[0],/rel="noopener noreferrer"/);
  }
 }
});
test("internal style links and scripts resolve; sitemap exposes every route",()=>{
 const sitemap=fs.readFileSync(path.join(pub,"sitemap.xml"),"utf8");
 for(const [route,doc] of Object.entries(html)){
  assert.ok(sitemap.includes("<loc>https://yungdsa.com"+route+"</loc>"));
  for(const m of doc.matchAll(/(?:href|src)="([^"]+)"/g)){
   const href=m[1];
   if(href.startsWith("#")) assert.ok(doc.includes('id="'+href.slice(1)+'"'));
   else if(href.startsWith("/style/")){
    const [pathname,hash]=href.split("#");
    const file=path.join(pub,pathname,pathname.endsWith("/")?"index.html":"");
    assert.ok(fs.existsSync(file),"Missing "+href);
    if(hash) assert.ok(fs.readFileSync(file,"utf8").includes('id="'+hash+'"'));
   }
  }
 }
});
test("new homepage entry points preserve independent identity and creator link",()=>{
 const app=fs.readFileSync(path.join(root,"src/App.js"),"utf8");
 for(const route of ["/style/","/style/goggles-sunglasses/","/style/baggy-lowers/","/style/looks/"]) assert.ok(app.includes('href="'+route+'"'));
 assert.ok(app.includes("Not affiliated with or endorsed by Yung DSA or his team."));
 assert.ok(app.includes('href="https://www.linkedin.com/in/lokeshbagade/"'));
 assert.ok(!app.includes('data-testid="booking-form"'));
});
})();
