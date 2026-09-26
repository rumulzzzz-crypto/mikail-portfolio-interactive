"use client";

// Adapted from SmoothUI's ClipCornersButton, MagneticButton and GlowHoverCard.
// Copyright Eduardo Calvo. MIT license: docs/vendor/SMOOTHUI-LICENSE.txt.
// Project adaptation: semantic links, plain CSS, bounded motion, no duplicate content.
import { useEffects } from "@/lib/effects";
import { motion, useSpring } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
} from "react";

function useHoverDevice() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

export function ActionLink({
  href,
  children,
  magnetic = false,
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  magnetic?: boolean;
  external?: boolean;
  className?: string;
}) {
  const reduced = !useEffects(),
    fine = useHoverDevice(),
    [hover, setHover] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 240, damping: 26 }),
    y = useSpring(0, { stiffness: 240, damping: 26 });
  const active = fine && !reduced;
  const leave = () => {
    setHover(false);
    x.set(0);
    y.set(0);
  };
  useEffect(() => {
    if (!active) {
      x.jump(0);
      y.jump(0);
    }
  }, [active, x, y]);
  function move(e: PointerEvent) {
    if (!active || !magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2,
      dy = e.clientY - r.top - r.height / 2;
    const factor = Math.max(0, 1 - Math.hypot(dx, dy) / 180);
    x.set(Math.max(-9, Math.min(9, dx * 0.2 * factor)));
    y.set(Math.max(-6, Math.min(6, dy * 0.2 * factor)));
  }
  return (
    <span
      className={`action-wrap ${className}`}
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      onPointerEnter={() => setHover(true)}
    >
      <motion.a
        href={href}
        className="action-link"
        style={{ x, y }}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        <span className="action-fill" aria-hidden="true" />
        {[
          [1, 1],
          [-1, 1],
          [1, -1],
          [-1, -1],
        ].map(([a, b], i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className={`action-corner corner-${i}`}
            animate={{
              x: active && hover ? a * 3 : 0,
              y: active && hover ? b * 3 : 0,
            }}
            transition={{ duration: reduced ? 0 : 0.22 }}
          />
        ))}
        <span className="action-label">{children}</span>
        <span className="action-arrow" aria-hidden="true">
          ↗
        </span>
      </motion.a>
    </span>
  );
}

export function GlowCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null),
    overlay = useRef<HTMLDivElement>(null);
  const reduced = !useEffects(),
    fine = useHoverDevice();
  useEffect(() => {
    const node = ref.current,
      glow = overlay.current;
    if (!node || !glow || reduced || !fine) return;
    let frame = 0,
      x = 0,
      y = 0;
    const paint = () => {
      frame = 0;
      glow.style.setProperty("--glow-x", `${x}px`);
      glow.style.setProperty("--glow-y", `${y}px`);
    };
    const move = (e: globalThis.PointerEvent) => {
      const r = node.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    node.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", move);
    };
  }, [reduced, fine]);
  return (
    <article ref={ref} className={`glow-card ${className ?? ""}`}>
      {children}
      {!reduced && fine && (
        <div className="card-glow" ref={overlay} aria-hidden="true" />
      )}
    </article>
  );
}
