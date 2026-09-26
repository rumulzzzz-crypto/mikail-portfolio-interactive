"use client";
import { useEffects } from "@/lib/effects";
import { useEffect, useRef } from "react";
/** Original photo reveal; independent of the Originkit particle field. */
export function Portrait() {
  const animated = useEffects();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current,
      host = canvas?.closest(".hero");
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const mask = document.createElement("canvas"),
      m = mask.getContext("2d");
    if (!m) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)"),
      fine = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0,
      visible = true,
      disposed = false,
      loaded = false,
      last = 0,
      aliveUntil = 0,
      width = 0,
      height = 0;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0,
      inside = false;
    const image = new Image();
    image.src = "/images/hero-wide.webp";
    const enabled = () =>
      animated && fine.matches && !document.hidden && visible && loaded;
    const clear = () => {
      ctx.clearRect(0, 0, width, height);
      m.clearRect(0, 0, width, height);
    };
    const paint = (time: number) => {
      frame = 0;
      if (!enabled() || disposed) return;
      const dt = Math.min(50, time - last || 16);
      last = time;
      m.globalCompositeOperation = "destination-out";
      m.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt / 210)})`;
      m.fillRect(0, 0, width, height);
      if (inside) {
        x += (tx - x) * (1 - Math.exp(-dt / 75));
        y += (ty - y) * (1 - Math.exp(-dt / 75));
        const radius = Math.min(220, width * 0.22);
        const g = m.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, "rgba(255,255,255,.38)");
        g.addColorStop(0.45, "rgba(255,255,255,.22)");
        g.addColorStop(1, "transparent");
        m.globalCompositeOperation = "source-over";
        m.fillStyle = g;
        m.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        aliveUntil = time + 1200;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      const scale = Math.max(width / image.width, height / image.height);
      const dw = image.width * scale,
        dh = image.height * scale;
      const pos = width < 600 ? 0.85 : 0.5;
      ctx.drawImage(image, (width - dw) * pos, 0, dw, dh);
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0, width, height);
      if (inside || time < aliveUntil) frame = requestAnimationFrame(paint);
      else clear();
    };
    const wake = () => {
      if (!frame && enabled()) {
        last = 0;
        frame = requestAnimationFrame(paint);
      }
    };
    const resize = () => {
      const r = host.getBoundingClientRect();
      width = Math.round(r.width);
      height = Math.round(r.height);
      const resolution = Math.min(1, 1920 / width, 1080 / height);
      canvas.width = mask.width = Math.round(width * resolution);
      canvas.height = mask.height = Math.round(height * resolution);
      ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
      m.setTransform(resolution, 0, 0, resolution, 0, 0);
      clear();
      wake();
    };
    const move = (e: PointerEvent) => {
      if (!enabled()) return;
      const r = host.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!inside) {
        x = tx;
        y = ty;
      }
      inside = true;
      wake();
    };
    const leave = () => {
      inside = false;
      wake();
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      inside = false;
      clear();
    };
    const visibility = () => {
      if (!enabled()) stop();
    };
    image.onload = () => {
      loaded = true;
      resize();
    };
    if (image.complete) {
      loaded = true;
      resize();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) stop();
    });
    io.observe(host);
    host.addEventListener("pointermove", move as EventListener);
    host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    media.addEventListener("change", stop);
    fine.addEventListener("change", stop);
    return () => {
      disposed = true;
      stop();
      image.onload = null;
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", move as EventListener);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      media.removeEventListener("change", stop);
      fine.removeEventListener("change", stop);
    };
  }, [animated]);
  return (
    <div className="portrait">
      <img
        src="/images/hero-wide.webp"
        width="1672"
        height="941"
        alt="Микаил Дадашов на фоне индустриальных труб"
        fetchPriority="high"
      />
      <canvas ref={canvasRef} aria-hidden="true" className="photo-reveal" />
      <div className="portrait-shade" />
    </div>
  );
}
