'use client';
import {useEffect,useRef} from 'react';
export function Lightbox({src,alt}:{src:string;alt:string}){
 const dialog=useRef<HTMLDialogElement>(null);
 const previousOverflow=useRef<string|null>(null);
 const restore=()=>{if(previousOverflow.current!==null){document.body.style.overflow=previousOverflow.current;previousOverflow.current=null;}};
 useEffect(()=>()=>restore(),[]);
 const open=()=>{previousOverflow.current=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.showModal();};
 const close=()=>dialog.current?.close();
 return <><button className="case-image" onClick={open} aria-label={`Увеличить: ${alt}`}><img src={src} alt={alt} width="1440" height="1000"/><span>Рассмотреть интерфейс ↗</span></button><dialog className="lightbox" data-lenis-prevent ref={dialog} onClose={restore} onClick={e=>{if(e.target===dialog.current)close();}} aria-label={alt}><button className="lightbox-close cut" onClick={close} autoFocus>Закрыть ×</button><img src={src} alt={alt}/></dialog></>;
}
