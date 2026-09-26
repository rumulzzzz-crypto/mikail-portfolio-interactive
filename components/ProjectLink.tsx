"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import { effectsAllowed } from "@/lib/effects";
import gsap from "gsap";

type Navigate = (href: string, anchor: HTMLAnchorElement) => void;
const Navigation = createContext<Navigate | null>(null);
type Flight = {
  layer: HTMLDivElement;
  image: HTMLImageElement;
  backdrop: HTMLDivElement;
  source: DOMRect;
  slug: string;
  timeline: gsap.core.Timeline | null;
  timer: ReturnType<typeof setTimeout>;
};
export function ProjectNavigation({ children }: { children: ReactNode }) {
  const router = useRouter(),
    pathname = usePathname(),
    flight = useRef<Flight | null>(null);
  const cleanup = () => {
    const f = flight.current;
    if (!f) return;
    clearTimeout(f.timer);
    f.timeline?.kill();
    f.layer.remove();
    flight.current = null;
  };
  useLayoutEffect(() => {
    const f = flight.current;
    if (!f) return;
    const target = document.querySelector<HTMLImageElement>(
      `img[data-project-image="${f.slug}"]`,
    );
    if (!target) {
      cleanup();
      return;
    }
    const r = target.getBoundingClientRect();
    f.timeline = gsap.timeline({ onComplete: cleanup });
    f.timeline
      .to(
        f.image,
        {
          x: r.left - f.source.left,
          y: r.top - f.source.top,
          scaleX: r.width / f.source.width,
          scaleY: r.height / f.source.height,
          duration: 0.65,
          ease: "power3.inOut",
        },
        0,
      )
      .to(f.backdrop, { opacity: 0, duration: 0.4 }, 0.15)
      .to(f.image, { opacity: 0, duration: 0.12 }, 0.57);
  }, [pathname]);
  useLayoutEffect(() => {
    const cancel = () => cleanup();
    window.addEventListener("popstate", cancel);
    return () => {
      window.removeEventListener("popstate", cancel);
      cleanup();
    };
  }, []);
  const navigate: Navigate = (href, anchor) => {
    if (flight.current) return;
    if (!effectsAllowed()) {
      router.push(href);
      return;
    }
    const source = anchor
      .closest("article")
      ?.querySelector<HTMLImageElement>("img[data-project-image]");
    if (!source || !source.complete) {
      router.push(href);
      return;
    }
    const r = source.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || !r.width) {
      router.push(href);
      return;
    }
    const layer = document.createElement("div"),
      backdrop = document.createElement("div"),
      image = source.cloneNode() as HTMLImageElement;
    layer.className = "project-flight";
    layer.setAttribute("aria-hidden", "true");
    backdrop.className = "project-flight-backdrop";
    image.removeAttribute("data-project-image");
    image.alt = "";
    image.style.cssText = `position:absolute;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;max-width:none;object-fit:cover;transform-origin:0 0;will-change:transform,opacity;`;
    layer.append(backdrop, image);
    document.body.append(layer);
    flight.current = {
      layer,
      image,
      backdrop,
      source: r,
      slug: source.dataset.projectImage!,
      timeline: null,
      timer: setTimeout(cleanup, 2500),
    };
    router.push(href);
  };
  return <Navigation.Provider value={navigate}>{children}</Navigation.Provider>;
}
export function ProjectLink(props: ComponentProps<typeof Link>) {
  const navigate = useContext(Navigation);
  return (
    <Link
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        if (
          e.defaultPrevented ||
          !navigate ||
          typeof props.href !== "string" ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          props.target === "_blank"
        )
          return;
        e.preventDefault();
        navigate(String(props.href), e.currentTarget);
      }}
    />
  );
}
