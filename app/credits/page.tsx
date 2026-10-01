import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Источники",
  description: "Авторство и лицензия 3D-модели Galaxy, используемой в портфолио.",
};

export default function CreditsPage() {
  return (
    <main id="main" className="credits-page">
      <Link href="/#contact" className="back-link">← К портфолио</Link>
      <span className="eyebrow">Материалы / авторство</span>
      <h1>Источники<span className="lime">.</span></h1>
      <section aria-labelledby="galaxy-source">
        <h2 id="galaxy-source">Galaxy</h2>
        <p>
          3D-модель в финальной секции портфолио создана автором{" "}
          <a href="https://sketchfab.com/991519166">991519166</a> и опубликована на{" "}
          <a href="https://sketchfab.com/3d-models/galaxy-dbb2f075329747a09cc8add2ad05acad">Sketchfab — Galaxy</a>.
        </p>
        <p>
          Модель и её изображение используются по лицензии{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 (CC BY 4.0)</a>.
        </p>
        <p>
          Для портфолио адаптированы освещение, свечение, положение камеры и композиция.
          Исходная геометрия, текстуры и анимация Take 001 сохранены.
        </p>
      </section>
    </main>
  );
}
