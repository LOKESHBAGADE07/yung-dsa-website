/* Original procedural fan-art sculpture, authored for yungdsa.com. No scan or fit claim. */
import * as THREE from './vendor/three.module.js';
export function createAvatar(){
 const root=new THREE.Group();root.name='Yung DSA inspired fan-art';
 const mat=(color,roughness=.75,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const skin=mat('#a76b49',.86),hair=mat('#161419',.95),lip=mat('#754635'),silver=mat('#b8c6cb',.23,.85),sole=mat('#cac7bd'),shoe=mat('#e8e5dc',.62);
 const cloth=mat('#25252b',.95),denim=mat('#333640',.96),seam=mat('#656973',.94),frame=mat('#191d24',.25,.25),lens=mat('#1c2732',.12,.6);
 const add=(geo,material,pos,scale,group=root)=>{const m=new THREE.Mesh(geo,material);if(pos)m.position.set(...pos);if(scale)m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;group.add(m);return m;};
 const sphere=(m,p,s,g)=>add(new THREE.SphereGeometry(1,28,20),m,p,s,g);
 const tube=(points,r,material,group=root)=>add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),32,r,6,false),material,null,null,group);
 const capsule=(a,b,r,material,group=root)=>{const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),m=add(new THREE.CapsuleGeometry(r,va.distanceTo(vb),8,16),material,va.clone().add(vb).multiplyScalar(.5).toArray(),null,group);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),vb.sub(va).normalize());return m;};
 // Cloth profiles have irregular fold lines instead of smooth plastic cylinders.
 function garment(profile,depth,material,pos,phase=0){const pts=profile.map(p=>new THREE.Vector2(p[0],p[1]));const g=new THREE.LatheGeometry(pts,48);const v=g.attributes.position;for(let i=0;i<v.count;i++){const x=v.getX(i),y=v.getY(i),z=v.getZ(i),angle=Math.atan2(z,x);const fold=1+.025*Math.sin(angle*11+y*5+phase)+.016*Math.cos(angle*17-y*9);v.setXYZ(i,x*fold,y,z*depth*fold);}g.computeVertexNormals();return add(g,material,pos);}
 // Heavy sneakers, separate sole, toe panels, heel tabs and laces.
 for(const side of [-1,1]){const x=side*.34;const foot=new THREE.Group();foot.position.set(x,.17,.12);foot.rotation.y=side*.1;root.add(foot);sphere(sole,[0,0,.09],[.285,.115,.48],foot);sphere(shoe,[0,.115,.02],[.265,.19,.43],foot);sphere(sole,[0,.13,.31],[.25,.13,.17],foot);sphere(cloth,[0,.215,-.18],[.2,.08,.17],foot);for(let i=0;i<5;i++)capsule([-.13,.274-i*.012,-.08+i*.058],[.13,.274-i*.012,-.08+i*.058],.014,sole,foot);capsule([-.23,.07,.33],[.23,.07,.33],.018,seam,foot);}
 // Broad-legged denim, seam piping, back pockets and stacked hems.
 for(const side of [-1,1]){const leg=garment([[.26,0],[.29,.1],[.28,.25],[.32,.39],[.3,.54],[.32,.8],[.31,1.03],[.34,1.27],[.34,1.52],[.3,1.82],[.26,1.99]],.91,denim,[side*.32,.32,0],side);leg.rotation.z=side*-.026;for(const z of [-.225,.25])tube([[side*.36,.5,z],[side*.39,1.2,z+.02],[side*.35,2.1,z]],.009,seam);tube([[side*.1,.48,.2],[side*.34,.43,.27],[side*.57,.53,.17]],.012,seam);const pocket=add(new THREE.BoxGeometry(.28,.32,.025),denim,[side*.31,2.16,-.275]);pocket.rotation.z=side*.09;tube([[side*.18,2.3,-.293],[side*.18,2.04,-.3],[side*.31,1.99,-.3],[side*.45,2.05,-.29],[side*.45,2.3,-.27]],.008,seam);}
 garment([[.57,0],[.62,.18],[.57,.42],[.5,.55]],.57,denim,[0,2.14,0]);
 // Oversized dropped-shoulder top and relaxed, slightly asymmetric arms.
 garment([[.57,0],[.6,.07],[.59,.3],[.57,.55],[.59,.91],[.67,1.24],[.57,1.43],[.32,1.5]],.6,cloth,[0,2.57,0]);
 const cuff=mat('#17191e');
 for(const side of [-1,1]){const shoulder=[side*.63,3.84,0],elbow=[side*.83,3.28,.01],wrist=[side*.74,2.78,.12];capsule(shoulder,elbow,.235,cloth);capsule(elbow,wrist,.19,cloth);capsule([side*.76,2.9,.1],wrist,.175,cuff);sphere(skin,[side*.73,2.58,.14],[.145,.23,.13]);for(let finger=0;finger<3;finger++)tube([[side*(.66+finger*.045),2.58,.24],[side*(.67+finger*.045),2.44,.21]],.008,lip);tube([[side*.65,3.99,.12],[side*.8,3.67,.18]],.009,seam);}
 garment([[.575,0],[.58,.055],[.57,.11]],.61,cuff,[0,2.56,0]);
 // Neck, ears and shaped jaw. The intentionally stylised proportions are a collectible sculpture.
 capsule([0,4.0,0],[0,4.22,0],.18,skin);
 const head=add(new THREE.SphereGeometry(1,40,28),skin,[0,4.87,0],[.365,.49,.325]);
 const hp=head.geometry.attributes.position;for(let i=0;i<hp.count;i++){const y=hp.getY(i);if(y<-.15){const f=1+(y+.15)*.2;hp.setX(i,hp.getX(i)*f);}}head.geometry.computeVertexNormals();
 sphere(skin,[0,4.61,.15],[.25,.2,.2]);
 for(const side of [-1,1]){sphere(skin,[side*.36,4.83,-.015],[.075,.13,.065]);sphere(lip,[side*.397,4.83,.012],[.019,.075,.024]);const ring=add(new THREE.TorusGeometry(.055,.012,8,24),silver,[side*.387,4.72,.01]);ring.rotation.y=side*.5;}
 sphere(skin,[0,4.79,.314],[.058,.115,.085]);sphere(skin,[0,4.715,.37],[.068,.049,.06]);
 tube([[-.1,4.59,.297],[0,4.575,.326],[.1,4.59,.297]],.014,lip);
 // Subtle moustache/goatee and a sculpted curly top with closely cropped sides.
 for(const side of [-1,1]){const m=sphere(hair,[side*.055,4.647,.325],[.063,.017,.018]);m.rotation.z=side*-.15;}
 sphere(hair,[0,4.475,.247],[.105,.035,.02]);sphere(hair,[0,5.13,-.027],[.369,.287,.337]);
 for(let row=0;row<5;row++)for(let i=0;i<12;i++){const phi=(i/12)*Math.PI*2+row*.47,theta=.19+row*.26;const radius=.33;const x=Math.sin(theta)*Math.cos(phi)*radius,y=5.18+Math.cos(theta)*.235,z=Math.sin(theta)*Math.sin(phi)*.31;const curl=sphere(hair,[x,y,z],[.086+(i%3)*.009,.085+(row%2)*.01,.087]);curl.rotation.set(i*.4,row*.3,i*.17);}
 // Wraparound frame silhouette; lenses and arms change with the chosen frame.
 const glasses=new THREE.Group();glasses.position.set(0,4.94,.285);root.add(glasses);
 function shield(x){const shape=new THREE.Shape();shape.moveTo(-.18,.06);shape.lineTo(.16,.055);shape.quadraticCurveTo(.2,.015,.15,-.085);shape.lineTo(-.12,-.09);shape.quadraticCurveTo(-.19,-.04,-.18,.06);const outer=add(new THREE.ExtrudeGeometry(shape,{depth:.027,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.014,bevelThickness:.008}),frame,[x,0,0],null,glasses);outer.rotation.y=x<0?.22:-.22;const inset=add(new THREE.ShapeGeometry(shape),lens,[x,0,.046],[.86,.72,1],glasses);inset.rotation.y=outer.rotation.y;}
 shield(-.19);shield(.19);capsule([-.045,.01,.04],[.045,.01,.04],.018,frame,glasses);for(const side of [-1,1])tube([[side*.34,.015,0],[side*.39,.02,-.17],[side*.37,-.03,-.32]],.022,frame,glasses);
 // Individual chain links hang over the top rather than being a flat decal.
 for(let i=0;i<31;i++){const t=i/30*Math.PI;const x=Math.cos(t)*.265,y=4.14-Math.sin(t)*.37,z=.23+Math.sin(t)*.205;const link=add(new THREE.TorusGeometry(.033,.009,6,10),silver,[x,y,z]);link.rotation.z=-t;link.rotation.y=i%2?.75:0;}
 const pendant=add(new THREE.BoxGeometry(.1,.16,.025),silver,[0,3.68,.445]);pendant.rotation.z=.2;
 // Original embroidered fan-art mark, not a retail product/brand logo.
 const tagCanvas=document.createElement('canvas');tagCanvas.width=256;tagCanvas.height=128;const ctx=tagCanvas.getContext('2d');ctx.fillStyle='#dedbd3';ctx.font='700 80px Arial';ctx.textAlign='center';ctx.fillText('06',128,90);const texture=new THREE.CanvasTexture(tagCanvas);texture.colorSpace=THREE.SRGBColorSpace;add(new THREE.PlaneGeometry(.23,.115),new THREE.MeshStandardMaterial({map:texture,transparent:true,roughness:1}),[.3,3.75,.362]);
 root.children.forEach(part=>{if(part.position.y>4.3)part.position.y-=.2;});
 const palette={black:'#25252b',cream:'#cfcabd',red:'#982c40',blue:'#465c79'};
 return {root,update(state){cloth.color.set(palette[state.top]||palette.black);cuff.color.copy(cloth.color).multiplyScalar(.69);const lowerColors={'rivet-denim-black':'#333640','waffle-pants':'#8babc0','1998-denim':'#4b6681'};denim.color.set(lowerColors[state.lowers]||lowerColors['rivet-denim-black']);seam.color.copy(denim.color).lerp(new THREE.Color('#cececb'),.3);frame.color.set(state.eyewear==='ape-x-002'?'#3963a1':state.eyewear==='cyclops-002'?'#e6e4d9':'#191d24');lens.color.set(state.eyewear==='cyclops-002'?'#463023':'#182633');}};
}
export function mountAvatar(container,initial){
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(31,1,.1,60);camera.position.set(0,3.15,11.1);camera.lookAt(0,2.68,0);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.65));renderer.setClearColor(0,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 renderer.domElement.setAttribute('aria-hidden','true');container.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight('#eaf1ff','#756b65',2.6));const key=new THREE.DirectionalLight('#fff4e4',4.5);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=6;key.shadow.camera.bottom=-4;key.shadow.normalBias=.035;scene.add(key);const rim=new THREE.DirectionalLight('#b9d2ff',3.5);rim.position.set(3,5,-3);scene.add(rim);const fill=new THREE.DirectionalLight('#f2b8c5',.7);fill.position.set(3,2,4);scene.add(fill);
 const avatar=createAvatar();avatar.update(initial);avatar.root.rotation.y=-.18;scene.add(avatar.root);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(2.15,64),new THREE.ShadowMaterial({opacity:.22}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.position.y=.015;scene.add(floor);
 const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.23,.09,80),new THREE.MeshStandardMaterial({color:'#c5c6ca',roughness:.65,metalness:.1}));pedestal.position.y=-.035;pedestal.receiveShadow=true;scene.add(pedestal);
 let rotation=-.18,spin=false,visible=true,frameId=0,last=0,drag=null,disposed=false;const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const render=()=>renderer.render(scene,camera);
 function tick(time){frameId=0;if(disposed||document.hidden||!visible)return;const dt=Math.min((time-last)/1000,.05);last=time;if(spin)rotation+=dt*.4;avatar.root.rotation.y=rotation;render();if(spin)frameId=requestAnimationFrame(tick);}
 function request(){if(!frameId&&!disposed)frameId=requestAnimationFrame(tick);}
 const resize=new ResizeObserver(()=>{const {width,height}=container.getBoundingClientRect();if(width&&height){renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();request();}});resize.observe(container);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request();else if(frameId){cancelAnimationFrame(frameId);frameId=0;}},{threshold:.05});observer.observe(container);
 const visibility=()=>{if(!document.hidden)request();};document.addEventListener('visibilitychange',visibility);
 const canvas=renderer.domElement;
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,rotation};});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dy)>Math.abs(dx)&&!canvas.hasPointerCapture(e.pointerId)){drag=null;return;}if(Math.abs(dx)>5){canvas.setPointerCapture(e.pointerId);rotation=drag.rotation+dx*.009;spin=false;container.dispatchEvent(new CustomEvent('studio:spin-stop'));request();}});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>{drag=null;});
 const fail=event=>{event.preventDefault();spin=false;container.classList.remove('model-ready');container.querySelector('[data-model-status]').textContent='3D view paused by your browser. Your outfit controls still work. Refresh to try again.';};canvas.addEventListener('webglcontextlost',fail);
 container.classList.add('model-ready');request();
 return {update(state){avatar.update(state);request();},action(action){if(action==='spin'){spin=!spin;last=performance.now();}else{spin=false;if(action==='left')rotation-=Math.PI/6;if(action==='right')rotation+=Math.PI/6;if(action==='reset')rotation=-.18;}request();return spin;},destroy(){disposed=true;cancelAnimationFrame(frameId);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility);scene.traverse(o=>{o.geometry?.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{m.map?.dispose();m.dispose();});}});renderer.dispose();},motion};
}
