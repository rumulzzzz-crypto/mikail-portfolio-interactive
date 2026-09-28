"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffects } from "@/lib/effects";
import { BrandMark } from "./BrandMark";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const tools = [
  { name: "Figma", kind: "figma", text: "Интерфейсы и прототипы" },
  { name: "Codex", kind: "codex", text: "Разработка и работа с кодом" },
  { name: "Photoshop", kind: "photoshop", text: "Изображения и графика" },
  { name: "Higgsfield", kind: "higgsfield", text: "Генеративные визуалы и видео" },
];

function ToolMark({ kind }: { kind: string }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg className="tool-mark" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <pattern id={`dots-${id}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.45" fill="white" />
        </pattern>
        <mask id={`raster-${id}`}><rect width="120" height="120" fill={`url(#dots-${id})`} /></mask>
      </defs>
      <g fill="currentColor" mask={`url(#raster-${id})`}>
        {kind === "figma" && <>
          <path d="M60 12H44a16 16 0 0 0 0 32h16zM60 44H44a16 16 0 0 0 0 32h16zM60 76H44a16 16 0 1 0 16 16zM60 12h16a16 16 0 0 1 0 32H60z" />
          <circle cx="76" cy="60" r="16" />
        </>}
        {kind === "codex" && <>
          <path fillRule="evenodd" d="M20 22h80v76H20zm8 8v60h64V30z" />
          <path d="m36 43 20 17-20 17-6-7 12-10-12-10zm25 27h22v9H61z" />
        </>}
        {kind === "photoshop" && <>
          <path fillRule="evenodd" d="M12 12h96v96H12zm8 8v80h80V20z" />
          <text x="27" y="80" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="53">Ps</text>
        </>}
        {kind === "higgsfield" && <>
          <path d="M21 24h18v28h42V24h18v72H81V70H39v26H21z" />
          <path d="M47 13h8v25h-8zm18 69h8v25h-8z" />
        </>}
      </g>
    </svg>
  );
}

export function Toolbox() {
  const root = useRef<HTMLDivElement>(null);
  const animated = useEffects();
  useGSAP(() => {
    if (!animated) return;
    gsap.timeline({
      defaults: { duration: 0.75, ease: "power3.out" },
      scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
    })
      .from(".tool-reveal", { clipPath: "inset(0 0 100% 0)", y: 22, stagger: 0.11 }, 0)
      .from(".tool-mark", { y: 16, opacity: 0, stagger: 0.11, clearProps: "transform,opacity" }, 0.2);
  }, { scope: root, dependencies: [animated], revertOnUpdate: true });

  return (
    <div className="toolbox" ref={root} aria-labelledby="toolbox-title">
      <div className="toolbox-heading">
        <h3 id="toolbox-title">Инструменты, которыми создаю.</h3>
        <span>Дизайн / код / визуал</span>
      </div>
      <div className="toolbox-grid">
        <p className="toolbox-note">ОТ ПЕРВОГО<br />ЭСКИЗА<br /><span>ДО ЗАПУСКА.</span></p>
        {tools.map((tool) => (
          <div className={`tool-reveal tool-${tool.kind}`} key={tool.kind}>
            <article className="tool-tile">
              <h4>{tool.name}</h4>
              <ToolMark kind={tool.kind} />
              <p>{tool.text}</p>
              <span className="tool-corner" aria-hidden="true">+</span>
            </article>
          </div>
        ))}
        <div className="toolbox-sign" aria-hidden="true"><BrandMark /><span>Идеи обретают форму.</span></div>
      </div>
    </div>
  );
}
