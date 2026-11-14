/* Reuse the existing CRA Babel/React toolchain; no runtime server or new package. */
(function renderModule(){
"use strict";
const fs=require("node:fs"),path=require("node:path"),Module=require("node:module");
process.env.NODE_ENV="production";
const root=path.resolve(__dirname,"..");
const runtime=Module.createRequire(path.join(root,"package.json"));
const babel=runtime("@babel/core");
const cache=new Map();
function loadSource(filename){
 const file=path.resolve(root,"src",filename);
 if(!file.startsWith(path.join(root,"src")+path.sep)) throw new Error("Source outside src");
 if(cache.has(file)) return cache.get(file).exports;
 const instance=new Module(file,module);instance.filename=file;instance.paths=Module._nodeModulePaths(path.dirname(file));cache.set(file,instance);
 const nativeRequire=Module.createRequire(file);
 instance.require=function(id){
  if(id.startsWith("@/")) return loadSource(id.slice(2)+(path.extname(id)?"":".js"));
  if(id.startsWith(".")) return loadSource(path.relative(path.join(root,"src"),path.resolve(path.dirname(file),id+(path.extname(id)?"":".js"))));
  return nativeRequire(id);
 };
 const code=babel.transformSync(fs.readFileSync(file,"utf8"),{filename:file,babelrc:false,configFile:false,plugins:[
  function stripStyles(){return {visitor:{ImportDeclaration(p){if(/\.css$/.test(p.node.source.value)) p.remove();}}};},
  [runtime.resolve("@babel/plugin-transform-react-jsx"),{runtime:"automatic"}],
  runtime.resolve("@babel/plugin-transform-modules-commonjs")
 ]}).code;
 instance._compile(code,file);
 return instance.exports;
}
function renderHome(){
 const React=runtime("react"),{renderToString}=runtime("react-dom/server");
 return renderToString(React.createElement(loadSource("App.js").default));
}
function prerender(){
 const output=path.join(root,"build/index.html");
 const html=fs.readFileSync(output,"utf8");
 const marker='<div id="root"></div>';
 if(!html.includes(marker)) throw new Error("Expected empty CRA root; refusing to emit an incomplete page.");
 const rendered=renderHome();
 if(!rendered.includes('href="/style/"')||!rendered.includes('data-testid="artist-bio"'))throw new Error("Homepage render is missing core content.");
 fs.writeFileSync(output,html.replace(marker,()=>'<div id="root" data-prerendered="true">'+rendered+"</div>"));
 console.log("Prerendered the actual homepage React tree into the built HTML.");
}
module.exports={loadSource,renderHome,prerender};
if(require.main===module)prerender();
})();
