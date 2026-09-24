'use client';
import { useEffect, useRef, useState } from 'react';

const vertex = `attribute vec2 aPosition; varying vec2 vUv; void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
const fragment = `precision mediump float;
uniform sampler2D uImage;uniform vec2 uMouse;uniform vec2 uPrev;uniform vec2 uSize;uniform float uPower;uniform float uTime; varying vec2 vUv;
void main(){
 vec2 uv=vec2(vUv.x,1.-vUv.y); vec2 aspect=vec2(uSize.x/uSize.y,1.);
 float d=length((uv-uMouse)*aspect);float influence=exp(-d*d*30.)*uPower;
 vec2 dir=(uMouse-uPrev)*.4; vec2 shifted=uv-dir*influence+vec2(sin(uv.y*55.+uTime*2.)*.004*influence,0.);
 float split=.009*influence;
 vec3 c=vec3(texture2D(uImage,clamp(shifted+vec2(split,0.),0.,1.)).r,texture2D(uImage,clamp(shifted,0.,1.)).g,texture2D(uImage,clamp(shifted-vec2(split,0.),0.,1.)).b);
 float scan=.965+.035*sin(uv.y*uSize.y*1.65);c*=scan;
 float grid=(step(.97,fract(uv.x*40.))+step(.97,fract(uv.y*40.)))*.09*influence;
 c+=vec3(.44,.75,.13)*grid;gl_FragColor=vec4(c,1.);
}`;
export function Portrait(){
 const ref=useRef<HTMLCanvasElement>(null);const [ready,setReady]=useState(false);
 useEffect(()=>{
 const canvas=ref.current;if(!canvas)return;const reduce=matchMedia('(prefers-reduced-motion: reduce)');const fine=matchMedia('(pointer:fine)');
 if(reduce.matches||!fine.matches)return;
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl)return;
 const shaders:WebGLShader[]=[];
 function compile(type:number,source:string){const s=gl!.createShader(type)!;gl!.shaderSource(s,source);gl!.compileShader(s);if(!gl!.getShaderParameter(s,gl!.COMPILE_STATUS)){gl!.deleteShader(s);return null;}shaders.push(s);return s;}
 const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return;
 const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 const u=Object.fromEntries(['uMouse','uPrev','uSize','uPower','uTime'].map(k=>[k,gl.getUniformLocation(program,k)]));
 let frame=0,disposed=false,loaded=false,visible=true,power=0,target=0,mx=.5,my=.5,px=.5,py=.5;
 const draw=(time:number)=>{frame=0;if(disposed||!visible||document.hidden||!loaded||reduce.matches)return;power+=(target-power)*.08;px+=(mx-px)*.05;py+=(my-py)*.05;gl.uniform2f(u.uMouse,mx,my);gl.uniform2f(u.uPrev,px,py);gl.uniform2f(u.uSize,canvas.width,canvas.height);gl.uniform1f(u.uPower,power);gl.uniform1f(u.uTime,time*.001);gl.drawArrays(gl.TRIANGLES,0,6);if(target>0||power>.002)frame=requestAnimationFrame(draw);};
 const wake=()=>{if(!frame&&loaded&&visible&&!document.hidden&&!disposed)frame=requestAnimationFrame(draw);};
 const resize=()=>{const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));gl.viewport(0,0,canvas.width,canvas.height);wake();};
 const move=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=(e.clientY-r.top)/r.height;target=1;wake();};const leave=()=>{target=0;wake();};
 const image=new Image();image.onload=()=>{if(disposed)return;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);loaded=true;resize();setReady(true);};image.src='/images/mikail.jpg';
 const ro=new ResizeObserver(resize);ro.observe(canvas);const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)wake();else cancelAnimationFrame(frame),frame=0;});io.observe(canvas);
 const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();};const motion=()=>{setReady(!reduce.matches);if(reduce.matches){cancelAnimationFrame(frame);frame=0;target=0;power=0;}else wake();};
 canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',visibility);reduce.addEventListener('change',motion);
 const lost=(e:Event)=>{e.preventDefault();setReady(false);cancelAnimationFrame(frame);frame=0;};canvas.addEventListener('webglcontextlost',lost);
 return()=>{disposed=true;image.onload=null;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',motion);gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));};
 },[]);
 return <div className="portrait"><img src="/images/mikail.jpg" width="1280" height="1280" alt="Микаил Дадашов" fetchPriority="high"/><canvas ref={ref} className={ready?'is-ready':''} aria-hidden="true"/><div className="portrait-shade"/><span className="portrait-corner top"/><span className="portrait-corner bottom"/><span className="portrait-label">Дизайн / код / взаимодействие</span></div>;
}
