"use client";
import {
  effectsAllowed,
  useEffects,
  useEffectsPreference,
  setEffectsPreference,
} from "@/lib/effects";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { AudioControl } from "./Audio";
import { ActionLink } from "./Interactions";
gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);

export function Scramble({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const parent = node.closest("a,button") ?? node;
    const enter = () => {
      if (!effectsAllowed()) return;
      gsap.to(node, {
        duration: 0.38,
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
    return () => {
      parent.removeEventListener("pointerenter", enter);
      parent.removeEventListener("pointerleave", leave);
      leave();
    };
  }, [children]);
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
  const root = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    menuButton = useRef<HTMLButtonElement>(null),
    lenis = useRef<Lenis | null>(null);
  const [open, setOpen] = useState(false);
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
    mm.addEventListener("change", setup);
    return () => {
      remove();
      mm.removeEventListener("change", setup);
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
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open) {
      d.showModal();
      lenis.current?.stop();
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const ctx = gsap.context(() => {
        if (!!effectsAllowed()) {
          gsap.fromTo(
            ".menu-panel",
            { xPercent: 105 },
            { xPercent: 0, duration: 0.45, ease: "power3.out" },
          );
          gsap.fromTo(
            ".menu-link",
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.055, delay: 0.12 },
          );
        }
      }, d);
      return () => {
        ctx.revert();
        document.body.style.overflow = prev;
        lenis.current?.start();
        d.close();
      };
    }
    d.close();
  }, [open, animated]);
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
    setOpen(false);
    menuButton.current?.focus();
  };
  useEffect(() => {
    setOpen(false);
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
            м/д
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
              <Link className="menu-link" href={url} key={url} onClick={close}>
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
            <p>ЕСТЬ ИДЕЯ? ДАВАЙТЕ ОБСУДИМ.</p>
            <a href="https://t.me/rumul" target="_blank" rel="noreferrer">
              Telegram ↗
            </a>
            <a href="mailto:rumulzzzzz@gmail.com">Email ↗</a>
            <span>Микаил Дадашов / 2026</span>
          </div>
        </div>
      </dialog>
    </div>
  );
}
export function Footer() {
  return (
    <footer className="contact" id="contact">
      <div className="contact-top">
        <span className="eyebrow">Есть идея?</span>
        <span>Давайте сделаем её настоящей.</span>
      </div>
      <a
        className="contact-cta"
        href="https://t.me/rumul"
        target="_blank"
        rel="noreferrer"
      >
        <span>
          СОЗДАДИМ
          <br />
          ЧТО-ТО <em>↗</em>
        </span>
        <span className="contact-outline">КЛАССНОЕ.</span>
      </a>
      <ActionLink href="https://t.me/rumul" external magnetic>
        Обсудить проект
      </ActionLink>
      <div className="contact-links">
        <a href="https://t.me/rumul" target="_blank" rel="noreferrer">
          <Scramble>Telegram</Scramble> ↗
        </a>
        <a href="mailto:rumulzzzzz@gmail.com">
          <Scramble>Написать на почту</Scramble> ↗
        </a>
        <Link href="/#main">Наверх ↑</Link>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Микаил Дадашов</span>
        <span>Веб-дизайн и разработка</span>
        <span>Сделано с вниманием.</span>
      </div>
    </footer>
  );
}
