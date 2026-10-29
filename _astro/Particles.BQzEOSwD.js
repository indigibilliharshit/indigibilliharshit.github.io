const V=`precision highp float;
attribute vec3 target;attribute vec3 scatter;attribute vec3 color;attribute float seed;
uniform vec2 res;uniform float t;uniform float assemble;uniform float explode;uniform float vel;uniform vec2 mouse;uniform float dpr;uniform vec2 center;
varying vec3 vCol;varying float vA;
void main(){
  float ph=seed*6.2831;
  vec3 tp=target;
  tp.x+=sin(t*.8+ph+target.y*.02)*1.4;
  tp.y+=cos(t*.7+ph*1.3+target.x*.015)*1.4;
  tp.y=center.y+(tp.y-center.y)*(1.+abs(vel)*.012);
  // staggered assembly: each particle arrives on its own beat
  float a=smoothstep(0.,1.,clamp(assemble*1.35-seed*.35,0.,1.));
  float k=a*(1.-explode);
  // swirl on the way in
  vec3 sp=scatter;
  float sw=(1.-a)*2.5+ph;
  sp.xy=center+mat2(cos(sw),-sin(sw),sin(sw),cos(sw))*(sp.xy-center);
  vec3 pos=mix(sp,tp,k);
  vec2 dm=pos.xy-mouse;float dl=length(dm);
  pos.xy+=dm/(dl+.001)*k*110.*exp(-dl*dl/(2.*80.*80.));
  pos.z+=explode*explode*2200.;
  float f=900.;
  float zc=f-pos.z;
  if(zc<12.){gl_Position=vec4(2.,2.,2.,1.);gl_PointSize=0.;return;}
  vec2 c=res*.5;
  vec2 s=c+(pos.xy-c)*f/zc;
  gl_Position=vec4(s.x/res.x*2.-1.,1.-s.y/res.y*2.,0.,1.);
  gl_PointSize=(1.3+seed*1.4)*f/zc*dpr;
  vCol=color;
  vA=(.35+.65*k+.4*explode)*smoothstep(12.,240.,zc)*min(1.,assemble*3.);
}`,X=`precision mediump float;
varying vec3 vCol;varying float vA;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,.05,d)*vA;
  gl_FragColor=vec4(vCol*a,a);
}`,Y=o=>(o.match(/\d+(\.\d+)?/g)??["238","233","223"]).slice(0,3).map(m=>Number(m)/255);function U(o,m){let e=0,a=0,l=o;for(;l&&l!==m;)e+=l.offsetLeft,a+=l.offsetTop,l=l.offsetParent;return{x:e,y:a,w:o.offsetWidth,h:o.offsetHeight}}const $=matchMedia("(max-width: 768px)").matches?8e3:18e3;function K(o,m){const e=[...m.querySelectorAll(".k-word")],a=getComputedStyle(m),l=parseFloat(a.fontSize),n=document.createElement("canvas");n.width=Math.ceil(o.clientWidth),n.height=Math.ceil(o.clientHeight);const r=n.getContext("2d",{willReadFrequently:!0});r.font=`italic 400 ${l}px ${a.fontFamily}`,r.letterSpacing=a.letterSpacing,r.textBaseline="alphabetic";const c=[];e.forEach((s,d)=>{const h=U(s,o),A=r.measureText(s.textContent??""),u=A.fontBoundingBoxAscent||l*.8,b=A.fontBoundingBoxDescent||l*.2;r.fillStyle=`rgb(${d+1},0,0)`,c.push(Y(getComputedStyle(s).color)),r.fillText(s.textContent??"",h.x,h.y+(h.h-u-b)/2+u)});const p=r.getImageData(0,0,n.width,n.height).data;let f=0;for(let s=3;s<p.length;s+=4)p[s]>140&&f++;const x=Math.max(2,Math.round(l/58),Math.ceil(Math.sqrt(f/$))),v=[];for(let s=0;s<n.height;s+=x)for(let d=0;d<n.width;d+=x){const h=(s*n.width+d)*4;p[h+3]>140&&v.push({x:d+(Math.random()-.5)*x,y:s+(Math.random()-.5)*x,col:c[p[h]-1]??c[0]})}const y=U(m,o);return{pts:v,center:[y.x+y.w/2,y.y+y.h/2]}}async function j(o,m){const e=o.getContext("webgl",{premultipliedAlpha:!0,alpha:!0,antialias:!1});if(!e)return null;await document.fonts.ready;const a=o.parentElement,l=(t,i)=>{const g=e.createShader(t);return e.shaderSource(g,i),e.compileShader(g),g},n=e.createProgram();if(e.attachShader(n,l(e.VERTEX_SHADER,V)),e.attachShader(n,l(e.FRAGMENT_SHADER,X)),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))return null;e.useProgram(n),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE);const r=t=>e.getUniformLocation(n,t),c={res:r("res"),t:r("t"),assemble:r("assemble"),explode:r("explode"),vel:r("vel"),mouse:r("mouse"),dpr:r("dpr"),center:r("center")},p=Math.min(2,devicePixelRatio||1);let f=0;const x=[],v=(t,i,g)=>{const M=e.createBuffer();x.push(M),e.bindBuffer(e.ARRAY_BUFFER,M),e.bufferData(e.ARRAY_BUFFER,i,e.STATIC_DRAW);const F=e.getAttribLocation(n,t);e.enableVertexAttribArray(F),e.vertexAttribPointer(F,g,e.FLOAT,!1,0,0)},y=()=>{const t=a.clientWidth,i=a.clientHeight;o.width=Math.round(t*p),o.height=Math.round(i*p),e.viewport(0,0,o.width,o.height);const{pts:g,center:M}=K(a,m);f=g.length;const F=new Float32Array(f*3),W=new Float32Array(f*3),N=new Float32Array(f*3),D=new Float32Array(f),G=Math.max(t,i);g.forEach((E,S)=>{F.set([E.x,E.y,(Math.random()-.5)*30],S*3);const k=Math.random()*Math.PI*2,q=(.25+Math.random()*1.1)*G*.6;W.set([t/2+Math.cos(k)*q,i/2+Math.sin(k)*q,-Math.random()*2600],S*3),N.set(E.col,S*3),D[S]=Math.random()}),x.splice(0).forEach(E=>e.deleteBuffer(E)),v("target",F,3),v("scatter",W,3),v("color",N,3),v("seed",D,1),e.uniform2f(c.res,t,i),e.uniform2f(c.center,M[0],M[1]),e.uniform1f(c.dpr,p)};if(y(),!f)return null;let s=0,d=0,h=0,A=0,u=-9999,b=-9999,R=u,C=b;const B=t=>{const i=o.getBoundingClientRect();R=t.clientX-i.left,C=t.clientY-i.top,u<-9e3&&(u=R,b=C)};addEventListener("pointermove",B,{passive:!0});let z=0,L=a.clientWidth;const I=new ResizeObserver(()=>{Math.abs(a.clientWidth-L)<2||(L=a.clientWidth,clearTimeout(z),z=window.setTimeout(y,200))});I.observe(a);let w=0,P=!0,T=performance.now();const H=T,_=t=>{const i=Math.min(.05,(t-T)/1e3);T=t,A+=(h-A)*(1-Math.exp(-i*1.1)),u+=(R-u)*.12,b+=(C-b)*.12,e.uniform1f(c.t,(t-H)/1e3),e.uniform1f(c.assemble,A),e.uniform1f(c.explode,s),e.uniform1f(c.vel,d),e.uniform2f(c.mouse,u,b),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.POINTS,0,f),P&&(w=requestAnimationFrame(_))},O=new IntersectionObserver(([t])=>{P=t.isIntersecting,cancelAnimationFrame(w),P&&(w=requestAnimationFrame(_))});return O.observe(o),w=requestAnimationFrame(_),{setExplode:t=>s=t,setVelocity:t=>d=t,assemble:()=>h=1,stop:()=>{cancelAnimationFrame(w),O.disconnect(),I.disconnect(),removeEventListener("pointermove",B),e.getExtension("WEBGL_lose_context")?.loseContext()}}}export{j as startParticles};
