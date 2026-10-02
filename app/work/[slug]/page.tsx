import { notFound } from "next/navigation";
import { ProjectLink as Link } from "@/components/ProjectLink";
import { ActionLink } from "@/components/Interactions";
import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { Footer } from "@/components/Shell";
import { Lightbox } from "@/components/Lightbox";
import { caseStudies } from "@/lib/case-studies";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return { title: p?.name ?? "Проект не найден", description: p?.description };
}
export default async function Case({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const next = projects.find((x) => x.slug !== p.slug)!;
  const study = caseStudies[p.slug];
  return (
    <main id="main">
      <article className={`case-page case--${p.slug}`}>
        <Link href="/#work" className="back-link">
          ← Все работы
        </Link>
        <div className="case-heading">
          <span className="eyebrow">
            {p.category} / {p.year}
          </span>
          <h1 tabIndex={-1}>
            {p.name}
            <span className="case-title-dot">.</span>
          </h1>
          <p>{p.intro}</p>
        </div>
        <div className="case-brief">
          <div>
            <h2>Мой вклад</h2>
            <p>{study.role}</p>
          </div>
          <div>
            <h2>Формат</h2>
            <p>{p.slug === "cudgi" ? "Публичная демонстрация сайта" : "Интерактивный прототип приложения"}</p>
          </div>
          <ActionLink href={p.url} external>Открыть демо</ActionLink>
        </div>
        <div className="case-cover-presentation">
          <Lightbox slug={p.slug} className="case-image case-cover" src={p.image} alt={p.imageAlt} width={p.imageWidth} height={p.imageHeight} />
          <p className="case-cover-caption">{p.coverCaption} — экран опубликованной версии</p>
        </div>
        <nav className="case-index" aria-label="Разделы кейса">
          <a href="#context">Задача</a>
          <a href="#decisions">Решения и экраны</a>
          <a href="#journey">Рабочий сценарий</a>
          <a href="#result">Результат</a>
        </nav>
        <div className="case-columns">
          <aside>
            <span className="eyebrow">Технологии</span>
            <p>{p.stack}</p>
            <ActionLink href={p.url} external>
              Открыть демо
            </ActionLink>
          </aside>
          <div className="case-story">
            <section id="context">
              <h2>Контекст</h2>
              <p>{study.context}</p>
            </section>
            <section>
              <h2>Задача</h2>
              <p>{p.task}</p>
            </section>
            <section>
              <h2>Границы проекта</h2>
              <p>{study.constraint}</p>
            </section>
          </div>
        </div>
        <section id="decisions" className="case-decisions" aria-labelledby="decisions-heading">
          <div className="case-section-heading">
            <h2 id="decisions-heading">Решения в деталях</h2>
            <p>Реальные экраны публичной версии. Каждый можно открыть крупнее.</p>
          </div>
          {study.decisions.map((decision) => (
            <section className="case-decision" key={decision.title}>
              <div className="case-decision-copy">
                <h3>{decision.title}</h3>
                <div>
                  <p className="case-decision-reason">{decision.reason}</p>
                  <p>{decision.implementation}</p>
                </div>
              </div>
              <div className="case-screen-pair">
                <figure className="case-desktop-screen">
                  <Lightbox className="case-screen" src={`/images/cases/${decision.desktop.file}`} alt={decision.desktop.alt} width={decision.desktop.width} height={decision.desktop.height} />
                  <figcaption>{decision.desktop.caption}</figcaption>
                </figure>
                <figure className="case-mobile-screen">
                  <Lightbox className="case-screen" src={`/images/cases/${decision.mobile.file}`} alt={decision.mobile.alt} width={decision.mobile.width} height={decision.mobile.height} />
                  <figcaption>{decision.mobile.caption}</figcaption>
                </figure>
              </div>
            </section>
          ))}
        </section>
        <section id="journey" className="case-journey" aria-labelledby="journey-heading">
          <div className="case-section-heading">
            <h2 id="journey-heading">Путь по интерфейсу</h2>
            <p>Сценарий, проверенный в опубликованном демо.</p>
          </div>
          <ol>
            {study.journey.map((step, i) => (
              <li key={step.title}>
                <span className="case-step-number" aria-hidden="true">0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
          {study.extra ? (
            <figure className="case-export-screen">
              <Lightbox className="case-screen" src={`/images/cases/${study.extra.file}`} alt={study.extra.alt} width={study.extra.width} height={study.extra.height} />
              <figcaption>{study.extra.caption}</figcaption>
            </figure>
          ) : null}
        </section>
        <section id="result" className="case-result" aria-labelledby="result-heading">
          <h2 id="result-heading">Что получилось</h2>
          <div>
            <p className="case-result-summary">{study.result}</p>
            <ul>{study.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="case-result-status">{p.status}</p>
            <ActionLink href={p.url} external>Попробовать проект</ActionLink>
          </div>
        </section>
        <Link className="next-project" href={`/work/${next.slug}`}>
          <span>Следующий проект</span>
          <strong>{next.name}</strong>
          <span aria-hidden="true">↗</span>
        </Link>
      </article>
      <Footer />
    </main>
  );
}
