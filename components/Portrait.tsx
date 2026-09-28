"use client";
import { useEffects } from "@/lib/effects";
import { useEffect, useRef, useState } from "react";

/** Reveal the same photo through a feathered mask; no particle renderer. */
export function Portrait() {
  const animated = useEffects();
  const [finePointer, setFinePointer] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const query = matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest<HTMLElement>(".hero");
    if (!animated || !finePointer || !canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0, last = 0, visible = true, loaded = false, disposed = false;
    let width = 0, height = 0, x = 0, y = 0, targetX = 0, targetY = 0;
    let clientX = 0, clientY = 0, opacity = 0, inside = false, px = .5, py = 0;
    const image = new Image();
    const enabled = () => visible && !document.hidden && loaded && !disposed;
    const clear = () => ctx.clearRect(0, 0, width, height);
    const paint = (time: number) => {
      frame = 0;
      if (!enabled()) return;
      const dt = Math.min(50, time - last || 16);
      last = time;
      const follow = 1 - Math.exp(-dt / 150);
      x += (targetX - x) * follow;
      y += (targetY - y) * follow;
      const goal = inside ? 1 : 0;
      opacity += (goal - opacity) * (1 - Math.exp(-dt / (inside ? 65 : 140)));
      clear();
      if (opacity > .002) {
        ctx.globalCompositeOperation = "source-over";
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const dw = image.naturalWidth * scale, dh = image.naturalHeight * scale;
        ctx.drawImage(image, (width - dw) * px, (height - dh) * py, dw, dh);
        const radius = Math.min(240, Math.max(160, width * .155));
        const mask = ctx.createRadialGradient(x, y, 0, x, y, radius);
        mask.addColorStop(0, `rgba(255,255,255,${opacity})`);
        mask.addColorStop(.24, `rgba(255,255,255,${opacity * .86})`);
        mask.addColorStop(.62, `rgba(255,255,255,${opacity * .32})`);
        mask.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = mask;
        ctx.fillRect(0, 0, width, height);
      }
      if (Math.abs(goal - opacity) > .002 || Math.hypot(targetX - x, targetY - y) > .1) {
        frame = requestAnimationFrame(paint);
      }
      canvas.dataset.flashlight = inside ? "active" : frame ? "fading" : "idle";
    };
    const wake = () => {
      if (!frame && enabled()) { last = 0; frame = requestAnimationFrame(paint); }
    };
    const stop = () => {
      cancelAnimationFrame(frame); frame = 0; inside = false; opacity = 0;
      clear(); canvas.dataset.flashlight = "idle";
    };
    const track = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !enabled()) return;
      const rect = host.getBoundingClientRect();
      clientX = event.clientX; clientY = event.clientY;
      targetX = clientX - rect.left; targetY = clientY - rect.top;
      if (!inside && opacity < .01) { x = targetX; y = targetY; }
      inside = true; wake();
    };
    const leave = () => { inside = false; wake(); };
    const scroll = () => {
      if (!inside) return;
      const rect = host.getBoundingClientRect();
      targetX = clientX - rect.left; targetY = clientY - rect.top;
      inside = targetX >= 0 && targetX <= width && targetY >= 0 && targetY <= height;
      wake();
    };
    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width; height = rect.height;
      if (!width || !height) return;
      // Read the base image once per resize, never in the animation loop.
      const position = getComputedStyle(canvas.previousElementSibling!).objectPosition.split(" ");
      px = parseFloat(position[0]) / 100; py = parseFloat(position[1]) / 100;
      const resolution = Math.min(1, 1920 / width, 1080 / height);
      canvas.width = Math.round(width * resolution); canvas.height = Math.round(height * resolution);
      ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
      stop();
    };
    image.onload = () => { loaded = true; resize(); };
    image.src = "/images/hero-wide.webp";
    if (image.complete && image.naturalWidth) { loaded = true; resize(); }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop();
    });
    viewport.observe(host);
    const visibility = () => { if (document.hidden) stop(); };
    host.addEventListener("pointermove", track, { passive: true });
    host.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true; stop(); image.onload = null;
      resizeObserver.disconnect(); viewport.disconnect();
      host.removeEventListener("pointermove", track);
      host.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [animated, finePointer]);

  return <div className="portrait">
    <img src="/images/hero-wide.webp" width="1672" height="941" alt="Микаил Дадашов на фоне индустриальных труб" fetchPriority="high" />
    {animated && finePointer && <canvas ref={canvasRef} aria-hidden="true" className="photo-reveal" />}
    <div className="portrait-shade" />
  </div>;
}
