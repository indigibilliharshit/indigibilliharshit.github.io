const E="attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}",L=`precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.02;a*=.5;}return v;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*r)/min(r.x,r.y);
  vec2 mm=(m-.5*r)/min(r.x,r.y);
  float T=t*.045;
  uv+= (mm-uv)*.06*exp(-2.5*length(uv-mm));
  vec2 q=vec2(fbm(uv*1.4+vec2(0.,T)),fbm(uv*1.4+vec2(5.2,1.3-T)));
  vec2 w=vec2(fbm(uv*1.6+3.*q+vec2(1.7,9.2)+T*.7),fbm(uv*1.6+3.*q+vec2(8.3,2.8)-T*.5));
  float f=fbm(uv*1.2+3.5*w);
  vec3 bg=vec3(.086,.082,.075);
  vec3 coral=vec3(1.,.416,.302);
  vec3 umber=vec3(.36,.13,.08);
  vec3 col=mix(bg,umber,smoothstep(.35,.85,f));
  col=mix(col,coral,smoothstep(.62,.95,f*length(w))*.85);
  col+=coral*.05*smoothstep(.5,1.,q.x);
  float v=smoothstep(1.25,.25,length(uv*vec2(.8,1.1)));
  col=mix(bg,col,v*.9);
  gl_FragColor=vec4(col,1.);
}`;function S(t,A){const e=t.getContext("webgl",{antialias:!1,alpha:!1,powerPreference:"low-power"});if(!e)return()=>{};const h=(r,a)=>{const u=e.createShader(r);return e.shaderSource(u,a),e.compileShader(u),u},o=e.createProgram();if(e.attachShader(o,h(e.VERTEX_SHADER,E)),e.attachShader(o,h(e.FRAGMENT_SHADER,L)),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS))return()=>{};e.useProgram(o),e.bindBuffer(e.ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const g=e.getAttribLocation(o,"p");e.enableVertexAttribArray(g),e.vertexAttribPointer(g,2,e.FLOAT,!1,0,0);const R=e.getUniformLocation(o,"r"),w=e.getUniformLocation(o,"t"),F=e.getUniformLocation(o,"m"),n=Math.min(2,devicePixelRatio||1)*.5;let c=0,m=0,f=0,l=0;const p=()=>{t.width=Math.max(1,Math.round(t.clientWidth*n)),t.height=Math.max(1,Math.round(t.clientHeight*n)),e.viewport(0,0,t.width,t.height),f=c=t.width/2,l=m=t.height/2};p();const d=new ResizeObserver(p);d.observe(t);const b=r=>{const a=t.getBoundingClientRect();f=(r.clientX-a.left)*n,l=(a.bottom-r.clientY)*n};addEventListener("pointermove",b,{passive:!0});let i=0,v=!0;const T=performance.now()-2e4,s=r=>{c+=(f-c)*.05,m+=(l-m)*.05,e.uniform2f(R,t.width,t.height),e.uniform1f(w,(r-T)/1e3),e.uniform2f(F,c,m),e.drawArrays(e.TRIANGLES,0,3),!A&&v&&(i=requestAnimationFrame(s))},x=new IntersectionObserver(([r])=>{v=r.isIntersecting,cancelAnimationFrame(i),v&&(i=requestAnimationFrame(s))});return x.observe(t),i=requestAnimationFrame(s),()=>{cancelAnimationFrame(i),x.disconnect(),d.disconnect(),removeEventListener("pointermove",b),e.getExtension("WEBGL_lose_context")?.loseContext()}}export{S as startInkGL};
