(function liveCheck(){
"use strict";
const paths=["/","/press-kit.html","/style/","/style/goggles-sunglasses/","/style/baggy-lowers/","/style/looks/","/style/about/","/style/index.html","/style","/seo-missing-page-check-20261114/"];
Promise.all(paths.map(async path=>{
 try{
  const response=await fetch("https://yungdsa.com"+path,{signal:AbortSignal.timeout(20000),redirect:"manual"});
  const body=await response.text();
  const info={path,status:response.status,location:response.headers.get("location"),title:(body.match(/<title>(.*?)<\/title>/s)||[])[1]||null,canonical:(body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)||[])[1]||null,prerendered:body.includes('data-prerendered="true"')};
  console.log(JSON.stringify(info));return info;
 }catch(error){console.log(JSON.stringify({path,error:error.message,cause:error.cause?.code}));return {path,status:0};}
})).then(results=>{
 const missing=results.find(r=>r.path==="/seo-missing-page-check-20261114/");
 const normal=results.slice(0,7);
 if(normal.some(r=>r.status!==200)||missing.status!==404)process.exitCode=1;
});
})();
