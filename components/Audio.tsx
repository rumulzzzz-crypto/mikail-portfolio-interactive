'use client';
import {useEffect,useRef,useState} from 'react';

/** Original synthesized ambience; no third-party audio or remote requests. */
export function AudioControl(){
 const [enabled,setEnabled]=useState(false),[busy,setBusy]=useState(false);
 const ctx=useRef<AudioContext|null>(null),master=useRef<GainNode|null>(null);
 const active=useRef(false),initialized=useRef(false),pending=useRef(false);
 const sources=useRef<OscillatorNode[]>([]);
 const toggleRef=useRef<()=>Promise<void>>(async()=>{});
 async function toggle(){
  if(pending.current)return;pending.current=true;setBusy(true);
  try{
   if(!ctx.current){ctx.current=new AudioContext();master.current=ctx.current.createGain();master.current.gain.value=.075;master.current.connect(ctx.current.destination);}
   const a=ctx.current;
   if(active.current){await a.suspend();active.current=false;}
   else{
    await a.resume();
    if(!initialized.current){
     [110,164.81,220].forEach((f,i)=>{const osc=a.createOscillator(),gain=a.createGain();osc.type='sine';osc.frequency.value=f;gain.gain.value=i===0?.1:.035;osc.connect(gain);gain.connect(master.current!);osc.start();sources.current.push(osc);});
     initialized.current=true;
    }
    active.current=true;
   }
   setEnabled(active.current);try{localStorage.setItem('mikail-sound',active.current?'on':'off');}catch{}
  }catch{active.current=false;setEnabled(false);}
  finally{pending.current=false;setBusy(false);}
 }
 useEffect(()=>{toggleRef.current=toggle;});
 useEffect(()=>{
  let last=0,step=0;
  const tone=(freq:number,level:number,duration:number,slide?:number)=>{
   const a=ctx.current;if(!a||!active.current||a.state!=='running')return;
   const osc=a.createOscillator(),gain=a.createGain(),now=a.currentTime;
   osc.type='sine';osc.frequency.setValueAtTime(freq,now);
   if(slide)osc.frequency.exponentialRampToValueAtTime(slide,now+duration*.8);
   gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(level,now+.012);gain.gain.exponentialRampToValueAtTime(.001,now+duration);
   osc.connect(gain);gain.connect(master.current!);osc.start(now);osc.stop(now+duration+.01);osc.onended=()=>{osc.disconnect();gain.disconnect();};
  };
  const play=(kind:'hover'|'click')=>{const a=ctx.current;if(!a||!active.current||a.state!=='running')return;if(kind==='hover'&&a.currentTime-last<.1)return;last=a.currentTime;tone(kind==='hover'?800:420,.13,.075,kind==='hover'?1100:180);};
  const over=(e:PointerEvent)=>{const el=(e.target as Element).closest('a,button');if(el&&!el.contains(e.relatedTarget as Node))play('hover');};
  const click=(e:MouseEvent)=>{if((e.target as Element).closest('a,button'))play('click');};
  const restore=(e:Event)=>{document.removeEventListener('pointerdown',restore);document.removeEventListener('keydown',restore);if((e.target as Element).closest('.sound-control'))return;try{if(localStorage.getItem('mikail-sound')==='on'&&!active.current)void toggleRef.current();}catch{}};
  const visibility=()=>{if(document.hidden)void ctx.current?.suspend();else if(active.current)void ctx.current?.resume().catch(()=>{active.current=false;setEnabled(false);});};
  const notes=[220,0,329.63,0,440,0,277.18,0,329.63,0,0,0,246.94,0,0,0];
  const pulse=setInterval(()=>{if(document.hidden||!active.current)return;const note=notes[step++%notes.length];if(note)tone(note,.065,1.3);},500);
  document.addEventListener('pointerover',over);document.addEventListener('click',click);document.addEventListener('visibilitychange',visibility);document.addEventListener('pointerdown',restore);document.addEventListener('keydown',restore);
  return()=>{clearInterval(pulse);document.removeEventListener('pointerover',over);document.removeEventListener('click',click);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('pointerdown',restore);document.removeEventListener('keydown',restore);sources.current.forEach(s=>s.stop());sources.current=[];void ctx.current?.close();ctx.current=null;initialized.current=false;active.current=false;};
 },[]);
 return <button className="sound-control" aria-label={enabled?'Выключить звук':'Включить звук'} aria-pressed={enabled} disabled={busy} onClick={toggle}><span className={`sound-bars ${enabled?'playing':''}`} aria-hidden="true"><i/><i/><i/><i/></span><span>Звук <b>{enabled?'вкл':'выкл'}</b></span></button>;
}
