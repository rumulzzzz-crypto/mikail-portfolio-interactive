import { notFound } from "next/navigation";
import { ProjectLink as Link } from "@/components/ProjectLink";
import { ActionLink } from "@/components/Interactions";
import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { Footer } from "@/components/Shell";
import { Lightbox } from "@/components/Lightbox";
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
  return (
    <main id="main">
      <article className="case-page">
        <Link href="/#work" className="back-link">
          ← Все работы
        </Link>
        <div className="case-heading">
          <span className="eyebrow">
            {p.category} / {p.year}
          </span>
          <h1>
            {p.name}
            <span className="lime">.</span>
          </h1>
          <p>{p.intro}</p>
        </div>
        <Lightbox slug={p.slug} src={p.image} alt={`Интерфейс ${p.name}`} />
        <div className="case-columns">
          <aside>
            <span className="eyebrow">Технологии</span>
            <p>{p.stack}</p>
            <ActionLink href={p.url} external>
              Открыть демо
            </ActionLink>
          </aside>
          <div className="case-story">
            <section>
              <h2>Задача</h2>
              <p>{p.task}</p>
            </section>
            <section>
              <h2>Решение</h2>
              <p>{p.approach}</p>
              <ul>
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2>Статус проекта</h2>
              <p>{p.status}</p>
            </section>
          </div>
        </div>
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
