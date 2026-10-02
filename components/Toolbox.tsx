"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffects } from "@/lib/effects";
import { BrandMark } from "./BrandMark";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const tools = [
  { name: "Figma", kind: "figma", text: "Структура страниц и прототипы перед разработкой" },
  { name: "Codex", kind: "codex", text: "Реализация, адаптивная вёрстка и взаимодействия" },
  { name: "Photoshop", kind: "photoshop", text: "Подготовка фотографий и графики для страниц" },
  { name: "Higgsfield", kind: "higgsfield", text: "Визуальные концепции, AI-изображения и видео" },
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
        {kind === "higgsfield" && <g transform="translate(12 12) scale(4.8)">
          {/* Original header glyph from https://higgsfield.ai/, viewed 2026-10-02. */}
          <path d="M18.3498 9.83713L18.3339 9.65759C18.1831 7.93447 17.0963 4.69261 14.0816 4.69261C11.8445 4.69261 10.1545 6.97097 8.66311 8.97967C7.47302 10.5883 6.4419 11.9683 5.3073 11.9683C5.00574 11.9357 4.61708 11.7805 4.3792 11.4294C4.16497 11.1108 4.10948 10.7026 4.22046 10.2126C4.39489 9.43684 5.39463 8.7182 6.44963 7.95063C7.02864 7.54238 7.6238 7.10955 8.03634 6.69311C9.22643 5.5091 9.82932 4.65164 9.82932 3.2717C9.82932 1.89176 9.09157 1.20565 8.47276 0.911636C7.23514 0.323844 5.41851 0.666781 4.26026 1.69583C4.08583 1.85922 3.91117 2.01418 3.75243 2.16119C2.58622 3.23097 1.80094 3.95781 0 3.40232V5.63972C2.38791 6.72588 4.39512 4.65164 5.15675 3.69633C5.74372 3.06758 6.36253 2.70006 6.82283 2.70006H6.84671C7.05298 2.70825 7.22741 2.78995 7.35454 2.93696C7.56081 3.18204 7.64018 3.46786 7.60038 3.78622C7.51305 4.45594 6.83875 5.23967 5.60113 6.09713C4.14928 7.10159 1.7218 8.78374 1.53122 10.8987C1.3884 12.4177 2.15003 13.9365 3.34012 14.5243C6.11669 15.8798 7.80665 13.5444 9.5994 11.0783C10.9719 9.1756 12.273 7.37103 14.0818 7.37103C15.7081 7.37103 16.311 8.75916 16.311 9.63301V9.80459L16.1523 9.83713C12.2095 10.5558 10.0595 14.3611 10.0595 16.1167C10.0595 17.8724 11.5034 19.375 13.2804 19.375C15.359 19.375 17.9293 17.5458 18.3419 12.4013L18.3578 12.2136H20V9.83737H18.3498V9.83713ZM16.1998 12.4746C15.8826 15.5531 14.3513 16.9904 13.4232 16.9904C13.0027 16.9904 12.4158 16.631 12.4158 15.9615C12.4158 15.2104 13.5026 12.932 15.946 12.2543L16.2316 12.1808L16.1998 12.4748V12.4746Z" />
        </g>}
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
        <h3 id="toolbox-title">Инструменты в работе.</h3>
        <span>У каждого инструмента своя задача</span>
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
        <div className="toolbox-sign" aria-hidden="true"><BrandMark /><span>Дизайн переходит в код.</span></div>
      </div>
    </div>
  );
}
