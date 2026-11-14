(function buildSeo(){
"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),pages=require("../data/seo-pages.json");
const escape=value=>String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const urls=new Set();
for(const p of pages){
 if(urls.has(p.path)||!p.path.startsWith("/")||!fs.existsSync(path.join(root,"public",p.file)))throw new Error("Invalid sitemap entry: "+p.path);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(p.updated))throw new Error("Explicit editorial date required: "+p.path);
 urls.add(p.path);
}
const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(p=>'  <url><loc>'+escape("https://yungdsa.com"+p.path)+'</loc><lastmod>'+p.updated+'</lastmod></url>').join("\n")+"\n</urlset>\n";
fs.writeFileSync(path.join(root,"public/sitemap.xml"),xml);
console.log("Generated sitemap with "+pages.length+" canonical pages; dates are editorial, not build timestamps.");
})();
