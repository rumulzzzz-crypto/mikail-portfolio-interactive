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
import { useEffects } from "@/lib/effects";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Navigate = (href: string, anchor: HTMLAnchorElement) => void;
const Navigation = createContext<Navigate | null>(null);
type Flight = {
  layer: HTMLDivElement;
  image: HTMLImageElement;
  backdrop: HTMLDivElement;
  source: { left: number; top: number; width: number; height: number };
  slug: string;
  timeline: gsap.core.Timeline | null;
  timer: ReturnType<typeof setTimeout>;
};
type WorkPosition = { offset: number; slug: string };

// Animate the contained picture, rather than stretching its frame on two axes.
function pictureBounds(image: HTMLImageElement) {
  const r = image.getBoundingClientRect();
  const ratio = image.naturalWidth / image.naturalHeight;
  const width = Math.min(r.width, r.height * ratio);
  const height = width / ratio;
  return {
    left: r.left + (r.width - width) / 2,
    top: r.top + (r.height - height) / 2,
    width,
    height,
  };
}
function scrollImmediately(top: number) {
  window.scrollTo({ top, behavior: "instant" });
  window.dispatchEvent(new CustomEvent("portfolio-scroll", { detail: top }));
}

export function ProjectNavigation({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const animated = useEffects();
  const root = useRef<HTMLDivElement>(null);
  const flight = useRef<Flight | null>(null);
  const workPosition = useRef<WorkPosition | null>(null);
  const returnToWork = useRef(false);
  const previousPath = useRef(pathname);
  const keyboardNavigation = useRef(false);
  const cleanup = () => {
    const f = flight.current;
    if (!f) return;
    clearTimeout(f.timer);
    f.timeline?.kill();
    f.layer.remove();
    flight.current = null;
  };

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    let frame = 0;
    let cancelled = false;
    const ownedFlight = flight.current;
    const restore = pathname === "/" && returnToWork.current;
    returnToWork.current = false;
    if (pathname.startsWith("/work/")) scrollImmediately(0);
    const settle = () => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      if (restore) {
        const section = root.current?.querySelector<HTMLElement>("#work");
        if (section) {
          scrollImmediately(section.getBoundingClientRect().top + window.scrollY - (workPosition.current?.offset ?? 90));
        }
      }
      if (keyboardNavigation.current) {
        const focus = restore
          ? root.current?.querySelector<HTMLElement>('a[href="/work/' + workPosition.current?.slug + '"]')
          : root.current?.querySelector<HTMLElement>(".case-heading h1");
        focus?.focus({ preventScroll: true });
        keyboardNavigation.current = false;
      }
      const f = flight.current;
      if (!f) return;
      const target = root.current?.querySelector<HTMLImageElement>('img[data-project-image="' + f.slug + '"]');
      if (!target || !target.complete || !target.naturalWidth) {
        cleanup();
        return;
      }
      const r = pictureBounds(target);
      if (!r.width || r.top >= innerHeight || r.top + r.height <= 0) {
        cleanup();
        return;
      }
      f.timeline = gsap.timeline({ onComplete: cleanup });
      f.timeline
        .to(f.image, {
          x: r.left - f.source.left,
          y: r.top - f.source.top,
          scale: r.width / f.source.width,
          filter: getComputedStyle(target).filter,
          duration: 0.65,
          ease: "power3.inOut",
        }, 0)
        .to(f.backdrop, { opacity: 0, duration: 0.4 }, 0.15)
        .to(f.image, { opacity: 0, duration: 0.12 }, 0.57);
    };
    // Let the destination mount and its pinned hero establish its final layout.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(settle);
    });
    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cleanup();
    };
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (flight.current === ownedFlight) cleanup();
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
    };
  }, [pathname]);

  useLayoutEffect(() => {
    if (!animated) cleanup();
  }, [animated]);
  useLayoutEffect(() => {
    const pop = () => {
      cleanup();
      returnToWork.current = location.pathname === "/" && (!location.hash || location.hash === "#work");
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("resize", cleanup);
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("resize", cleanup);
      cleanup();
    };
  }, []);

  const navigate: Navigate = (href, anchor) => {
    cleanup();
    keyboardNavigation.current = anchor.matches(":focus-visible");
    returnToWork.current = href === "/#work";
    const section = root.current?.querySelector<HTMLElement>("#work");
    if (pathname === "/" && section) {
      workPosition.current = { offset: section.getBoundingClientRect().top, slug: href.split("/").pop()! };
    }
    const source = anchor.closest("article")?.querySelector<HTMLImageElement>("img[data-project-image]");
    const destinationSlug = href.startsWith("/work/") ? href.split("/").pop() : source?.dataset.projectImage;
    if (animated && source?.complete && source.naturalWidth && source.dataset.projectImage === destinationSlug) {
      const r = pictureBounds(source);
      if (r.width && r.top < innerHeight && r.top + r.height > 0) {
        const layer = document.createElement("div");
        const backdrop = document.createElement("div");
        const image = source.cloneNode() as HTMLImageElement;
        layer.className = "project-flight";
        layer.setAttribute("aria-hidden", "true");
        backdrop.className = "project-flight-backdrop";
        image.removeAttribute("data-project-image");
        image.alt = "";
        image.style.cssText = "position:absolute;left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px;max-width:none;object-fit:contain;transform-origin:0 0;will-change:transform,opacity;";
        image.style.filter = getComputedStyle(source).filter;
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
      }
    }
    if (pathname === "/" && href === "/#work") {
      cleanup();
      section?.scrollIntoView();
      return;
    }
    router.push(href, { scroll: false });
  };
  return (
    <Navigation.Provider value={navigate}>
      <div ref={root}>{children}</div>
    </Navigation.Provider>
  );
}

export function ProjectLink(props: ComponentProps<typeof Link>) {
  const navigate = useContext(Navigation);
  return (
    <Link {...props} onClick={(e) => {
      props.onClick?.(e);
      if (
        e.defaultPrevented || !navigate || typeof props.href !== "string" ||
        e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
        props.target === "_blank"
      ) return;
      e.preventDefault();
      navigate(props.href, e.currentTarget);
    }} />
  );
}
