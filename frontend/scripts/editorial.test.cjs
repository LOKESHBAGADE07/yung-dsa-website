'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public');
const pages=require('../data/seo-pages.json'),info=require('../src/editorial.json');
const routes=['/style/hoodies-brand/','/bigg-boss-20/','/slang-guide/','/wallpapers/'];
const documents=new Map(routes.map(route=>[route,fs.readFileSync(path.join(pub,route,'index.html'),'utf8')]));
const graphs=html=>Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)).flatMap(m=>JSON.parse(m[1])['@graph']||[]);
test('new editorial routes are discoverable and have unique canonical pages with connected breadcrumbs',()=>{
 assert.deepEqual(info.guides.map(g=>g.path),pages.map(p=>p.path));
 const titles=new Set();
 for(const [route,html] of documents){
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
  assert.ok(html.includes('rel="canonical" href="https://yungdsa.com'+route+'"'));
  const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);
  const graph=graphs(html),crumb=graph.find(n=>n['@type']==='BreadcrumbList');
  assert.equal(crumb.itemListElement.at(-1).item,'https://yungdsa.com'+route);
  assert.ok(!graph.some(n=>['Product','FAQPage'].includes(n['@type'])));
  assert.ok(!/\bnoindex\b/.test(html));
  const ids=Array.from(html.matchAll(/\sid="([^"]+)"/g),m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 }
});
test('video structured data describes the visible embed and its displayed publication date',()=>{
 const html=documents.get('/slang-guide/'),video=graphs(html).find(n=>n['@type']==='VideoObject');
 assert.ok(video);assert.ok(html.includes('<iframe src="'+video.embedUrl+'"'));
 assert.ok(html.includes('<time datetime="'+video.uploadDate+'">'));
 assert.ok(html.includes('href="'+video.url+'"'));
 assert.equal(new URL(video.url).searchParams.get('v'),new URL(video.embedUrl).pathname.split('/').pop());
 assert.ok(video.thumbnailUrl.includes(new URL(video.url).searchParams.get('v')));
});
test('wallpaper download resolves to a real PNG with the dimensions advertised on the page',()=>{
 const html=documents.get('/wallpapers/');
 const downloads=Array.from(html.matchAll(/href="([^"]+)" download="([^"]+)"/g));
 assert.equal(downloads.length,2);
 for(const [,url] of downloads){
  assert.equal(url,'/wallpapers/assets/pune-06-fan-wallpaper.png');
  const data=fs.readFileSync(path.join(pub,url));
  assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  const width=data.readUInt32BE(16),height=data.readUInt32BE(20);
  assert.ok(html.includes('width="'+width+'" height="'+height+'"'));
  assert.ok(html.includes(width+' × '+height+' pixels'));
 }
 assert.ok(!/4K/i.test(html.match(/<title>(.*?)<\/title>/)[1]));
 assert.match(html,/generated with AI/);
});
test('brand and voting guides retain their evidence limits and primary source links',()=>{
 const hoodie=documents.get('/style/hoodies-brand/'),bb=documents.get('/bigg-boss-20/');
 assert.ok(hoodie.includes(info.sources.yeda.replace(/&/g,'&amp;')));
 assert.match(hoodie,/clothing partners/);assert.match(hoodie,/unconfirmed outfit lead/);
 assert.match(bb,/does not maintain live nomination or eviction status/);
 assert.ok(bb.includes(info.sources.welcome));assert.ok(bb.includes('href="https://www.jiohotstar.com/"'));
 assert.ok(!/<form\b/.test(bb));
});
