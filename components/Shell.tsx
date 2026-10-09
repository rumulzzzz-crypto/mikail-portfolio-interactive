"use client";
import {
  useEffects,
  useEffectsPreference,
  setEffectsPreference,
} from "@/lib/effects";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { AudioControl } from "./Audio";
import { ActionLink } from "./Interactions";
import { Galaxy, GalaxyCredit } from "./Galaxy";
import { BrandMark } from "./BrandMark";
gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);

export function Scramble({ children }: { children: string }) {
  const animated = useEffects();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const parent = node.closest("a,button") ?? node;
    const enter = () => {
      if (!animated) return;
      gsap.to(node, {
        duration: 0.22,
        scrambleText: { text: children, chars: "<>_+01", revealDelay: 0.04 },
        overwrite: true,
      });
    };
    const leave = () => {
      gsap.killTweensOf(node);
      node.textContent = children;
    };
    parent.addEventListener("pointerenter", enter);
    parent.addEventListener("pointerleave", leave);
    parent.addEventListener("focus", enter);
    parent.addEventListener("blur", leave);
    return () => {
      parent.removeEventListener("pointerenter", enter);
      parent.removeEventListener("pointerleave", leave);
      parent.removeEventListener("focus", enter);
      parent.removeEventListener("blur", leave);
      leave();
    };
  }, [children, animated]);
  return (
    <span aria-label={children}>
      <span ref={ref} aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const animated = useEffects(),
    effectPreference = useEffectsPreference();
  const pathname = usePathname();
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    menuButton = useRef<HTMLButtonElement>(null),
    lenis = useRef<Lenis | null>(null);
  const [open, setOpen] = useState(false);
  const menuTimeline = useRef<gsap.core.Timeline | null>(null);
  const menuOverflow = useRef<string | null>(null);
  const menuDesired = useRef(open);
  const menuDestination = useRef<string | null>(null);
  const menuAnchor = useRef<string | null>(null);
  const currentPath = useRef(pathname);
  currentPath.current = pathname;
  menuDesired.current = open;
  const scrollToMenuAnchor = (hash: string) => {
    const target = root.current?.querySelector<HTMLElement>(hash);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 90;
    if (lenis.current) {
      lenis.current.resize();
      lenis.current.scrollTo(top);
    } else window.scrollTo({ top, behavior: "instant" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  const finishMenu = (focus = true) => {
    if (menuOverflow.current !== null) {
      document.body.style.overflow = menuOverflow.current;
      menuOverflow.current = null;
    }
    lenis.current?.start();
    if (dialog.current?.open) {
      dialog.current.close();
      if (focus) menuButton.current?.focus({ preventScroll: true });
    }
    const destination = menuDestination.current;
    menuDestination.current = null;
    if (destination) {
      if (destination.startsWith("/#")) {
        if (currentPath.current === "/") scrollToMenuAnchor(destination.slice(1));
        else menuAnchor.current = destination.slice(1);
      }
      router.push(destination, { scroll: false });
    }
  };
  // Native hash scrolling happens before desktop pin spacing exists on a hard load.
  // Correct it once after fonts/layout settle, unless the visitor has started navigating.
  useEffect(() => {
    const hash = window.location.hash;
    if (pathname !== "/" || !["#about", "#work", "#contact"].includes(hash)) return;
    let cancelled = false;
    let frame = 0;
    const cancel = () => { cancelled = true; cancelAnimationFrame(frame); };
    const events = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    events.forEach(event => window.addEventListener(event, cancel, { passive: true, once: true }));
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (cancelled || window.location.hash !== hash) return;
          ScrollTrigger.refresh();
          const target = root.current?.querySelector<HTMLElement>(hash);
          if (!target) return;
          const top = target.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top, behavior: "instant" });
          lenis.current?.resize();
          lenis.current?.scrollTo(top, { immediate: true, force: true });
        });
      });
    });
    return () => { cancel(); events.forEach(event => window.removeEventListener(event, cancel)); };
  }, []);
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("ru-RU", {
          timeZone: "Europe/Moscow",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const mm = matchMedia("(prefers-reduced-motion: reduce)");
    let remove = () => {};
    const setup = () => {
      remove();
      if (!animated) return;
      const l = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        anchors: { offset: -90 },
      });
      lenis.current = l;
      l.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => l.raf(t * 1000);
      gsap.ticker.add(tick);
      remove = () => {
        gsap.ticker.remove(tick);
        l.destroy();
        lenis.current = null;
      };
    };
    setup();
    const scroll = (event: Event) => {
      lenis.current?.resize();
      lenis.current?.scrollTo((event as CustomEvent<number>).detail, { immediate: true, force: true });
    };
    window.addEventListener("portfolio-scroll", scroll);
    mm.addEventListener("change", setup);
    return () => {
      remove();
      mm.removeEventListener("change", setup);
      window.removeEventListener("portfolio-scroll", scroll);
    };
  }, [animated]);
  useGSAP(
    () => {
      if (!animated || !root.current?.querySelector(".case-story section"))
        return;
      const mm = gsap.matchMedia();
      mm.add("all", () => {
        gsap.from(".case-story section", {
          opacity: 0,
          y: 18,
          duration: 0.55,
          stagger: 0.07,
          clearProps: "all",
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [pathname, animated], revertOnUpdate: true },
  );
  useGSAP(() => {
    const d = dialog.current;
    if (!d || !animated) return;
    const timeline = gsap.timeline({ paused: true, onReverseComplete: () => finishMenu() });
    timeline.fromTo(d.querySelector(".menu-panel"), { xPercent: 105 }, { xPercent: 0, duration: 0.42, ease: "power3.out" }, 0)
      .fromTo(d.querySelectorAll(".menu-link"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: "power2.out" }, 0.1);
    menuTimeline.current = timeline;
    if (d.open && menuDesired.current) timeline.progress(1);
    return () => {
      timeline.kill();
      menuTimeline.current = null;
    };
  }, { scope: dialog, dependencies: [animated], revertOnUpdate: true });
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open) {
      if (!d.open) {
        menuOverflow.current = document.body.style.overflow;
        d.showModal();
      }
      lenis.current?.stop();
      document.body.style.overflow = "hidden";
      menuTimeline.current?.timeScale(1).play();
    } else if (d.open) {
      if (animated && menuTimeline.current && menuTimeline.current.time() > 0)
        menuTimeline.current.timeScale(1.25).reverse();
      else finishMenu();
    }
  }, [open, animated]);
  useEffect(() => () => {
    menuDestination.current = null;
    finishMenu(false);
  }, []);
  useGSAP(
    () => {
      if (animated)
        gsap.from(".header", {
          opacity: 0,
          y: -8,
          duration: 0.55,
          delay: 0.15,
          clearProps: "all",
        });
    },
    { scope: root, dependencies: [animated], revertOnUpdate: true },
  );
  const close = () => {
    menuDestination.current = null;
    setOpen(false);
  };
  const closeForNavigation = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    menuDestination.current = href;
    setOpen(false);
    if (!animated || !menuTimeline.current || !menuTimeline.current.time()) finishMenu(false);
  };
  useEffect(() => {
    menuDestination.current = null;
    menuTimeline.current?.pause(0);
    finishMenu(false);
    setOpen(false);
    if (pathname === "/" && menuAnchor.current) {
      const hash = menuAnchor.current;
      menuAnchor.current = null;
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          scrollToMenuAnchor(hash);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [pathname]);
  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        К содержимому
      </a>
      <header className="header">
        <Link
          href="/#main"
          className="brand"
          aria-label="Микаил Дадашов — на главную"
        >
          <span className="brand-mark" aria-hidden="true">
            <BrandMark />
          </span>
          <span>МИКАИЛ ДАДАШОВ</span>
        </Link>
        <AudioControl />
        <span className="header-time">
          МСК <span suppressHydrationWarning>{time}</span>
        </span>
        <button
          ref={menuButton}
          className="menu-toggle cut"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <Scramble>МЕНЮ</Scramble>
          <span aria-hidden="true">+</span>
        </button>
      </header>
      <div className="route-content">{children}</div>
      <dialog
        ref={dialog}
        className="menu-dialog"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        aria-label="Навигация"
        onClose={() => {
          finishMenu(false);
          setOpen(false);
        }}
      >
        <div className="menu-panel">
          <div className="menu-top">
            <span>Навигация</span>
            <button className="cut" onClick={close} autoFocus>
              Закрыть <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav>
            {[
              ["Обо мне", "/#about"],
              ["Работы", "/#work"],
              ["Контакт", "/#contact"],
            ].map(([label, url], i) => (
              <Link className="menu-link" href={url} key={url} onClick={(event) => closeForNavigation(event, url)}>
                <span className="menu-index">0{i + 1}</span>
                <Scramble>{label}</Scramble>
                <span className="menu-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </nav>
          <div className="menu-bottom">
            <label className="effects-choice">
              Анимация
              <select
                aria-label="Режим анимации"
                value={effectPreference}
                onChange={(e) =>
                  setEffectsPreference(
                    e.target.value as "system" | "on" | "off",
                  )
                }
              >
                <option value="system">Как в системе</option>
                <option value="on">Полная</option>
                <option value="off">Уменьшенная</option>
              </select>
            </label>
            <p>ОБСУДИМ ВАШ САЙТ.</p>
            <a href="https://t.me/rumul" target="_blank" rel="noreferrer">
              Telegram ↗
            </a>
            <a href="mailto:rumulzzzz@gmail.com">Email ↗</a>
            <span>Микаил Дадашов / 2026</span>
          </div>
        </div>
      </dialog>
    </div>
  );
}
export function Footer() {
  const [wordHovered, setWordHovered] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  return (
    <footer className="contact" id="contact">
      <Galaxy topView={wordHovered || keyboardFocused} />
      <div className="contact-top">
        <span className="eyebrow">Есть идея сайта?</span>
        <span>Дадим ей форму.</span>
      </div>
      <div className="contact-universe">
      <a
        className="contact-cta"
        href="https://t.me/rumul"
        target="_blank"
        rel="noreferrer"
        aria-label="Обсудить сайт в Telegram"
        onFocus={(event) => setKeyboardFocused(event.currentTarget.matches(":focus-visible"))}
        onBlur={() => setKeyboardFocused(false)}
      >
        <span>
          СОЗДАДИМ
          <br />
          ЧТО-ТО <em>↗</em>
        </span>
        <span className="contact-outline"
          onPointerEnter={(event) => {
            if (event.pointerType !== "touch" && matchMedia("(hover: hover) and (pointer: fine)").matches) setWordHovered(true);
          }}
          onPointerLeave={() => setWordHovered(false)}
        >КЛАССНОЕ.</span>
      </a>
      </div>
      <p className="contact-brief">
        Расскажите, что хотите сделать: новый лендинг или изменения на существующем
        сайте. Если есть примеры, материалы и бюджет, пришлите их — будет проще
        определить объём работы.
      </p>
      <ActionLink href="https://t.me/rumul" external magnetic>
        Написать в Telegram
      </ActionLink>
      <div className="contact-links">
        <a href="https://t.me/rumul" target="_blank" rel="noreferrer">
          <Scramble>Telegram</Scramble> ↗
        </a>
        <a href="mailto:rumulzzzz@gmail.com">
          <Scramble>Написать на почту</Scramble> ↗
        </a>
        <Link href="/#main">Наверх ↑</Link>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Микаил Дадашов</span>
        <span>Веб-дизайн и разработка</span>
      </div>
      <GalaxyCredit />
    </footer>
  );
}
