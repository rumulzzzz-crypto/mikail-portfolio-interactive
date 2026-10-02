"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const sections = [
  { target: "main", name: "Начало" },
  { target: "about", name: "Обо мне" },
  { target: "work", name: "Работы" },
  { target: "contact", name: "Контакт" },
];

export function SectionProgress() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const links = Array.from(node.querySelectorAll<HTMLAnchorElement>("a"));
    const targets = sections.map(section => document.getElementById(section.target));
    const fill = node.querySelector<HTMLElement>(".section-progress-fill");
    let frame = 0;
    let current = -1;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const tops = targets.map(target => target?.getBoundingClientRect().top ?? Infinity);
      let active = 0;
      tops.forEach((top, index) => { if (top <= window.innerHeight * 0.35) active = index; });
      if (progress >= 0.995) active = sections.length - 1;
      if (fill) fill.style.transform = `scaleX(${progress})`;
      if (current === active) return;
      current = active;
      links.forEach((link, index) => {
        if (index === active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      const label = node.querySelector(".section-progress-label");
      if (label) label.textContent = sections[active].name;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    if (node.parentElement) resize.observe(node.parentElement);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    ScrollTrigger.addEventListener("refresh", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ScrollTrigger.removeEventListener("refresh", schedule);
    };
  }, []);
  return (
    <nav ref={root} className="section-progress" aria-label="Разделы страницы">
      <div className="section-progress-track" aria-hidden="true"><span className="section-progress-fill" /></div>
      <div className="section-progress-controls">
        <span className="section-progress-label" aria-hidden="true">Начало</span>
        {sections.map((section, index) => (
          <a key={section.target} href={`#${section.target}`} aria-label={`Перейти: ${section.name}`}>
            <span aria-hidden="true">0{index + 1}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
