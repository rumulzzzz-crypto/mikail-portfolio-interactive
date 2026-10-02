import type { Metadata } from "next";
import Link from "next/link";
import { LightStudy, ResponseStudy } from "@/components/Lab";
import "./lab.css";

export const metadata: Metadata = {
  title: "Лаборатория взаимодействий",
  description: "Два взаимодействия из портфолио Микаила Дадашова: проявление фотографии светом и отзывчивая кнопка. Попробуйте их и узнайте, как они работают в интерфейсе.",
};

export default function LabPage() {
  return (
    <main id="main" className="lab-page">
      <a href="/#work" className="back-link">← К работам</a>
      <div className="lab-heading">
        <span className="eyebrow">Лаборатория взаимодействий</span>
        <h1>Движение,<br />которое отвечает.</h1>
        <p>Два приёма из этого портфолио. Здесь можно рассмотреть их отдельно: как свет раскрывает фотографию и как интерфейс отвечает на действие.</p>
      </div>
      <section className="lab-study" aria-labelledby="light-study-title">
        <div className="lab-study-copy">
          <h2 id="light-study-title">Проявить светом</h2>
          <p>Курсор мягко раскрывает детали затемнённого портрета. Свет следует за движением и затухает после ухода.</p>
          <p>Для портфолио реализованы мягкая маска, плавное следование и остановка отрисовки вне экрана. Фотография остаётся видна без анимации; кнопка работает и на телефоне.</p>
        </div>
        <LightStudy />
      </section>
      <section className="lab-study" aria-labelledby="response-study-title">
        <div className="lab-study-copy">
          <h2 id="response-study-title">Ответить на действие</h2>
          <p>Подсветка показывает активную область, а кнопка слегка следует за курсором. Движение ограничено, чтобы цель оставалась удобной для нажатия.</p>
          <p>Основа — компоненты SmoothUI. Для сайта адаптированы ссылки, границы движения, клавиатурный фокус и режим уменьшенной анимации.</p>
          <Link href="/credits">Источники и авторство ↗</Link>
        </div>
        <ResponseStudy />
      </section>
      <div className="lab-outro">
        <p>Эффекты дополняют сайт. Работы и контакт доступны независимо от них.</p>
        <a href="/#contact" className="back-link">Перейти к контакту ↗</a>
      </div>
    </main>
  );
}
