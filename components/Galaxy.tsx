"use client";

import { useEffect, useRef, useState } from "react";
import { useEffects } from "@/lib/effects";
import { galaxyViewerDocument } from "@/lib/galaxy-viewer";

function GalaxyViewer({ running, topView }: { running: boolean; topView: boolean }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState("loading");
  const [playback, setPlayback] = useState("paused");
  const [cameraView, setCameraView] = useState("default");
  useEffect(() => {
    let finished = false;
    const timeout = window.setTimeout(() => {
      if (!finished) setStatus("error");
    }, 45000);
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.origin !== location.origin || event.data?.type !== "portfolio-galaxy") return;
      if (event.data.playback === "playing" || event.data.playback === "paused") setPlayback(event.data.playback);
      if (event.data.camera === "top" || event.data.camera === "default") setCameraView(event.data.camera);
      if (event.data.status === "ready" || event.data.status === "error") {
        finished = true;
        clearTimeout(timeout);
        setStatus(event.data.status);
      }
    };
    window.addEventListener("message", receive);
    return () => { clearTimeout(timeout); window.removeEventListener("message", receive); };
  }, []);
  useEffect(() => {
    if (status === "ready") frame.current?.contentWindow?.postMessage({ type: "portfolio-galaxy-running", running, view: running && topView ? "top" : "default" }, location.origin);
  }, [running, topView, status]);
  return <div className="galaxy-live" data-status={status} data-running={status === "ready" && running} data-playback={playback} data-camera={cameraView}>
    {status !== "error" && <iframe ref={frame} srcDoc={galaxyViewerDocument}
      className={`galaxy-viewer${status === "ready" ? " is-ready" : ""}`}
      title="Galaxy by 991519166" allow="autoplay" tabIndex={-1}
      onError={() => setStatus("error")} />}
  </div>;
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
