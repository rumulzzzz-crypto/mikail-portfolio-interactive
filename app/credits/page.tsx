import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Источники",
  description: "Источники и лицензии 3D-модели Galaxy, компонентов взаимодействия и шрифтов портфолио.",
};

export default function CreditsPage() {
  return (
    <main id="main" className="credits-page">
      <a href="/#contact" className="back-link">← К портфолио</a>
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
      <section aria-labelledby="interaction-source">
        <h2 id="interaction-source">Взаимодействия</h2>
        <p>Кнопка с угловыми акцентами, магнитная реакция и подсветка карточки адаптированы из <a href="https://github.com/educlopez/smoothui">SmoothUI</a>. Исходные компоненты распространяются по лицензии MIT.</p>
        <p>Для портфолио доработаны семантика ссылок, ограничение смещения, клавиатурный фокус и уменьшенные эффекты. Проявление фотографии светом реализовано отдельно в этом проекте.</p>
      </section>
      <section aria-labelledby="font-source">
        <h2 id="font-source">Шрифты</h2>
        <p>Oswald и Manrope поставляются локально. Лицензии SIL Open Font License: <a href="/fonts/oswald-LICENSE.txt">Oswald</a> и <a href="/fonts/manrope-LICENSE.txt">Manrope</a>.</p>
      </section>
    </main>
  );
}
