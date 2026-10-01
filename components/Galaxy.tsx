"use client";

import { useEffect, useRef, useState } from "react";
import { useEffects } from "@/lib/effects";
import type { GalaxyController } from "@/lib/galaxy-renderer";

function GalaxyViewer({ running, topView }: { running: boolean; topView: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const controller = useRef<GalaxyController | null>(null);
  const latest = useRef({ running, topView });
  latest.current = { running, topView };
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    let disposed = false;
    host.dataset.status = "loading";
    void import("@/lib/galaxy-renderer").then(({ createGalaxyRenderer }) => {
      if (!disposed) controller.current = createGalaxyRenderer(host, latest.current);
    }).catch(() => { if (!disposed) host.dataset.status = "error"; });
    return () => { disposed = true; controller.current?.dispose(); controller.current = null; };
  }, []);
  useEffect(() => {
    controller.current?.update({ running, topView });
  }, [running, topView]);
  return <div ref={root} className="galaxy-live" data-running={running} />;
}

export function Galaxy({ topView = false }: { topView?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const animated = useEffects();
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    // Latch the preload: scrolling or hiding a tab must not destroy a loading scene.
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); preload.disconnect(); }
    }, { rootMargin: "400px" });
    const viewport = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .01 });
    const visibility = () => setPageVisible(!document.hidden);
    visibility(); preload.observe(node); viewport.observe(node);
    document.addEventListener("visibilitychange", visibility);
    return () => { preload.disconnect(); viewport.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <div ref={root} className="galaxy" aria-hidden="true" inert>
    <div className="galaxy-stars" />
    <img className="galaxy-poster" src="/images/galaxy-poster.jpg" width="720" height="405" loading="lazy" alt="" />
    {started && animated && <GalaxyViewer running={visible && pageVisible} topView={topView} />}
  </div>;
}

export function GalaxyCredit() {
  return <div className="galaxy-credit">
    <a href="https://sketchfab.com/3d-models/galaxy-dbb2f075329747a09cc8add2ad05acad" target="_blank" rel="noreferrer">Galaxy</a>
    {" by "}<a href="https://sketchfab.com/991519166" target="_blank" rel="noreferrer">991519166</a>
    {" / Sketchfab · "}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
  </div>;
}
