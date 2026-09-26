"use client";

import { useEffect, useRef, useState } from "react";
import { useEffects } from "@/lib/effects";
import { galaxyViewerDocument } from "@/lib/galaxy-viewer";

const MODEL = "dbb2f075329747a09cc8add2ad05acad";
const MODEL_URL = `https://sketchfab.com/3d-models/galaxy-${MODEL}`;

export function Galaxy() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const animated = useEffects();
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [status, setStatus] = useState<"poster" | "loading" | "ready" | "error">("poster");
  const [interactive, setInteractive] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const shouldMount = near && animated && pageVisible;
  const running = visible && pageVisible && animated;

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const preload = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "500px" });
    const viewport = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    const visibility = () => setPageVisible(!document.hidden);
    visibility();
    preload.observe(node);
    viewport.observe(node);
    document.addEventListener("visibilitychange", visibility);
    return () => { preload.disconnect(); viewport.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!shouldMount || !frame.current) return;
    let cancelled = false;
    setStatus("loading");
    setInteractive(false);
    const fail = () => {
      if (cancelled) return;
      cancelled = true;
      setStatus("error");
      window.clearTimeout(timeout);
    };
    const timeout = window.setTimeout(fail, 45000);
    const receive = (event: MessageEvent) => {
      if (cancelled || event.source !== frame.current?.contentWindow || event.origin !== location.origin || event.data?.type !== "portfolio-galaxy") return;
      if (event.data.status === "ready") {
        window.clearTimeout(timeout);
        setStatus("ready");
      } else if (event.data.status === "error") fail();
    };
    window.addEventListener("message", receive);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.removeEventListener("message", receive);
    };
  }, [shouldMount, attempt]);

  useEffect(() => {
    if (status !== "ready") return;
    frame.current?.contentWindow?.postMessage({ type: "portfolio-galaxy-running", running }, location.origin);
    if (!running) setInteractive(false);
  }, [running, status]);

  const live = shouldMount && status === "ready";
  return (
    <figure ref={root} className="galaxy" data-status={shouldMount ? status : "poster"}>
      <div className="galaxy-stage" data-interactive={interactive && live}>
        <img className="galaxy-poster" src="/images/galaxy-poster.jpg" width="720" height="405" loading="lazy" alt="Спиральная галактика с ярким ядром — Galaxy" />
        {shouldMount && status !== "error" && <iframe
          key={attempt}
          ref={frame}
          srcDoc={galaxyViewerDocument}
          className={`galaxy-viewer${live ? " is-ready" : ""}`}
          title="Galaxy — интерактивная 3D-модель"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          tabIndex={interactive && live ? 0 : -1}
          aria-hidden={!live}
          onError={() => setStatus("error")}
        />}
      </div>
      <div className="galaxy-controls">
        <span className="galaxy-label">Galaxy <span aria-hidden="true">↗</span></span>
        {live ? <button type="button" aria-pressed={interactive} onClick={() => setInteractive(!interactive)}>
          {interactive ? "Завершить вращение ×" : "Вращать галактику ↗"}
        </button> : <span className="galaxy-status" role="status">
          {shouldMount && status === "loading" ? "Загружается 3D…" : shouldMount && status === "error" ? <button type="button" onClick={() => { setStatus("loading"); setAttempt(attempt + 1); }}>Повторить загрузку ↻</button> : "Статичный вид"}
        </span>}
      </div>
      {shouldMount && status === "error" && <p className="galaxy-help">3D пока не загрузилось. Можно повторить попытку или открыть Galaxy на Sketchfab.</p>}
      {interactive && live && <p className="galaxy-help">Перетаскивайте, чтобы менять ракурс. Для прокрутки страницы завершите вращение.</p>}
      <figcaption className="galaxy-credit">
        <a href={MODEL_URL} target="_blank" rel="noreferrer">Galaxy</a> · <a href="https://sketchfab.com/991519166" target="_blank" rel="noreferrer">991519166</a> / Sketchfab · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
      </figcaption>
    </figure>
  );
}
