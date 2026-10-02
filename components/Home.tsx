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
        gsap.utils
          .toArray<HTMLElement>(".reveal", root.current)
          .forEach((el) =>
            gsap.from(el, {
              y: 24,
              opacity: 0,
              duration: 0.5,
              scrollTrigger: { trigger: el, start: "top 93%", once: true },
            }),
          );
      });
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
      <section className="hero grid-surface">
        <div className="hero-meta">
          <p>
            Независимый дизайнер
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
            Соединяю визуальный характер
            <br />с продуманным взаимодействием.
          </p>
        </div>
        <h1 className="hero-name" aria-label="Микаил Дадашов">
          <span aria-hidden="true">МИКАИЛ</span>
          <span aria-hidden="true">
            ДАДАШОВ<span className="name-dot">↗</span>
          </span>
        </h1>
        <div className="hero-foot">
          <span>Веб-дизайн и разработка</span>
          <ActionLink href="#work" magnetic>
            Смотреть работы
          </ActionLink>
          <span className="hero-index">ПОРТФОЛИО / 2026</span>
        </div>
      </section>
      <section id="about" className="about">
        <div className="section-meta">
          <span>Обо мне</span>
          <span>Идея → интерфейс → сайт</span>
        </div>
        <div className="about-body">
          <span className="about-symbol" aria-hidden="true">
            <BrandMark />
          </span>
          <h2 className="reveal">
            ХОРОШИЙ САЙТ
            <br />
            ХОЧЕТСЯ <span>ИССЛЕДОВАТЬ.</span>
          </h2>
          <div className="about-copy reveal">
            <p>
              Мне интересны сайты, которые запоминаются. Где у визуала есть
              характер, а у каждого движения — смысл.
            </p>
            <p>
              Работаю над композицией, интерфейсом и реализацией. От первого
              впечатления до того, как открывается меню и ощущается нажатие.
            </p>
          </div>
        </div>
        <Toolbox />
        <div className="disciplines">
          <span>Веб-дизайн</span>
          <span>Разработка</span>
          <span>Интерактив</span>
          <span>AI-визуал</span>
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
            Два разных мира.
            <br />
            Внимание к каждой детали.
          </p>
        </div>
        <div className="projects">
          {projects.map((p, i) => (
            <GlowCard className={`project project-${i} project--${p.slug} reveal`} key={p.slug}>
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
      </section>
      <Footer />
    </main>
  );
}
