"use client";

import { useState } from "react";
import { Portrait } from "./Portrait";
import { ActionLink, GlowCard } from "./Interactions";

export function LightStudy() {
  const [lit, setLit] = useState(false);
  return (
    <div className="lab-light-study">
      <div className={`hero lab-portrait${lit ? " lab-portrait-lit" : ""}`}>
        <Portrait />
      </div>
      <div className="lab-demo-controls">
        <p><span className="lab-pointer-note">Проведите курсором по фотографии. </span>Кнопка осветляет весь кадр.</p>
        <button className="lab-light-switch" aria-pressed={lit} onClick={() => setLit(value => !value)}>
          {lit ? "Затемнить фотографию" : "Осветлить фотографию"}
        </button>
      </div>
    </div>
  );
}

export function ResponseStudy() {
  return (
    <GlowCard className="lab-response-demo">
      <div className="lab-response-copy">
        <span className="lab-signal" aria-hidden="true" />
        <h3>Идея становится сайтом.</h3>
        <p>Следующий шаг всегда должен быть понятным.</p>
      </div>
      <ActionLink href="/#contact" magnetic>Обсудить идею</ActionLink>
      <p className="lab-response-note">Эта кнопка ведёт к контакту. Её можно открыть мышью, касанием или клавишей Enter.</p>
    </GlowCard>
  );
}
