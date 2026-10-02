"use client";
import { useEffects } from "@/lib/effects";
import { ActionLink, GlowCard } from "./Interactions";
import { ProjectLink } from "./ProjectLink";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Portrait } from "./Portrait";
import { BrandMark } from "./BrandMark";
import { Toolbox } from "./Toolbox";
import { Footer, Scramble } from "./Shell";
import { projects } from "@/lib/projects";
import Link from "next/link";
import { SectionProgress } from "./SectionProgress";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function Home() {
  const animated = useEffects();
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!animated) return;
      const mm = gsap.matchMedia();
      mm.add("all", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(
            ".hero-name>span",
            { yPercent: 105, duration: 1.05, stagger: 0.09 },
            0.1,
          )
          .from(".hero-portrait", { opacity: 0, duration: 1.1 }, 0.12)
          .from(
            ".hero-meta,.hero-intro,.hero-foot",
            { opacity: 0, y: 12, duration: 0.7, stagger: 0.1 },
            0.3,
          );
      });
      // Create the existing pin first so later triggers include its spacing.
      mm.add("(min-width: 1000px)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "+=330",
              pin: true,
              scrub: 0.6,
            },
            defaults: { ease: "none" },
          })
          .to(".hero-name", { y: -65, opacity: 0.2 }, 0)
          .to(".portrait", { opacity: 0.65 }, 0);
      });
      mm.add("all", () => {
        gsap.utils
          .toArray<HTMLElement>(".reveal", root.current)
          .forEach((el) =>
            gsap.from(el, {
              y: 24,
              opacity: 0,
              duration: 0.65,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 93%", once: true },
            }),
          );
        gsap.from(".heading-line-inner", {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".about-title", start: "top 88%", once: true },
        });
        // A shared trigger and no stagger preserve the equal level of both works.
        gsap.from(".project", {
          y: 32,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".projects", start: "top 92%", once: true },
        });
      });
      mm.add("(min-width: 1000px)", () => {
        const track = root.current?.querySelector<HTMLElement>(".disciplines");
        const viewport = track?.parentElement;
        if (!track || !viewport) return;
        gsap.fromTo(track, { x: 24 }, {
          x: () => -Math.max(24, track.scrollWidth - viewport.clientWidth + 24),
          ease: "none",
          scrollTrigger: {
            trigger: viewport,
            start: "clamp(top bottom)",
            end: "clamp(bottom 20%)",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      });
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { scope: root, dependencies: [animated], revertOnUpdate: true },
  );
  return (
    <main ref={root} id="main">
      <SectionProgress />
      <section className="hero grid-surface">
        <div className="hero-meta">
          <p>
            Веб-дизайнер
            <br />и разработчик сайтов
          </p>
          <span className="hero-location">ДИЗАЙН × ТЕХНОЛОГИИ</span>
        </div>
        <div className="hero-portrait">
          <Portrait />
        </div>
        <div className="hero-intro">
          <span className="cross" aria-hidden="true">
            +
          </span>
          <p>
            Создаю сайты с характером
            <br />и понятным путём к действию.
          </p>
        </div>
        <h1 className="hero-name" aria-label="Микаил Дадашов">
          <span aria-hidden="true">МИКАИЛ</span>
          <span aria-hidden="true">
            ДАДАШОВ<span className="name-dot">↗</span>
          </span>
        </h1>
        <div className="hero-foot">
          <span>От идеи до работающего сайта</span>
          <ActionLink href="#work" magnetic>
            Смотреть работы
          </ActionLink>
          <span className="hero-index">ПОРТФОЛИО / 2026</span>
        </div>
      </section>
      <section id="about" className="about">
        <div className="section-meta">
          <span>Обо мне</span>
          <span>Дать идее форму</span>
        </div>
        <div className="about-body">
          <span className="about-symbol" aria-hidden="true">
            <BrandMark />
          </span>
          <h2 className="about-title" aria-label="Хороший сайт хочется исследовать.">
            <span className="heading-line" aria-hidden="true"><span className="heading-line-inner">ХОРОШИЙ САЙТ</span></span>
            <span className="heading-line" aria-hidden="true"><span className="heading-line-inner">ХОЧЕТСЯ <span className="heading-accent">ИССЛЕДОВАТЬ.</span></span></span>
          </h2>
          <div className="about-copy reveal">
            <p>
              Создаю веб-дизайн и разрабатываю сайты. Помогаю передать характер
              вашего проекта и сделать следующий шаг понятным: выбрать товар,
              изучить продукт или связаться с вами.
            </p>
            <p>
              Работаю со структурой страниц, композицией и кодом. Продумываю
              мобильную версию и реакции интерфейса. Как свет на фотографии,
              движение направляет внимание — к работе, её деталям и следующему шагу.
            </p>
          </div>
        </div>
        <Toolbox />
        <div className="discipline-window">
          <div className="disciplines">
            <span>Веб-дизайн</span>
            <span>Разработка</span>
            <span>Интерактив</span>
            <span>AI-визуал</span>
          </div>
        </div>
      </section>
      <section id="work" className="work-section grid-surface">
        <div className="section-meta">
          <span>Избранные проекты</span>
          <span>2026 / 02</span>
        </div>
        <div className="work-heading reveal">
          <h2>
            РАБОТЫ<span className="lime">.</span>
          </h2>
          <p>
            От витрины бренда
            <br />
            до интерфейса продукта.
          </p>
        </div>
        <div className="projects">
          {projects.map((p, i) => (
            <GlowCard className={`project project-${i} project--${p.slug}`} key={p.slug}>
              <ProjectLink
                className="project-image"
                href={`/work/${p.slug}`}
                aria-label={`Открыть кейс ${p.name}`}
              >
                <div className="project-browser">
                  <span />
                  <span />
                  <span />
                  <span>
                    {p.coverCaption}
                  </span>
                </div>
                <img
                  data-project-image={p.slug}
                  src={p.image}
                  alt={p.imageAlt}
                  width={p.imageWidth}
                  height={p.imageHeight}
                  loading="lazy"
                />
                <span className="project-open">СМОТРЕТЬ КЕЙС ↗</span>
                <span className="project-scan" aria-hidden="true" />
              </ProjectLink>
              <div className="project-info">
                <div>
                  <span className="eyebrow">{p.category}</span>
                  <h3>
                    <ProjectLink href={`/work/${p.slug}`}>
                      <Scramble>{p.name}</Scramble>
                    </ProjectLink>
                  </h3>
                </div>
                <ProjectLink
                  className="project-arrow"
                  href={`/work/${p.slug}`}
                  aria-label={`Кейс ${p.name}`}
                >
                  ↗
                </ProjectLink>
              </div>
              <dl className="project-facts">
                <div><dt>Моя роль</dt><dd>{p.role}</dd></div>
                <div><dt>Формат</dt><dd>{p.format}</dd></div>
              </dl>
              <p className="project-description">{p.description}</p>
              <a
                className="live-link"
                href={p.url}
                target="_blank"
                rel="noreferrer"
              >
                <Scramble>Открыть демо</Scramble> ↗
              </a>
            </GlowCard>
          ))}
        </div>
        <div className="lab-entry">
          <p>Как свет и движение работают в интерфейсе</p>
          <Link href="/lab" prefetch={false}>Посмотреть лабораторию ↗</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
