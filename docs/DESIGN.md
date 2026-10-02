# Портфолио — обновление 26 сентября 2026

## Инструменты и Galaxy

В «Обо мне» добавлена зелёная ступенчатая сетка Figma, Codex, Photoshop и Higgsfield. Палитра: фон #a8f333, панели #8aca2b, графика #152008, активная панель #6118d9. Использованы существующие Oswald и Manrope, срезанные углы и точечная графика. Codex обозначен терминальным символом. 02.10.2026 монограмма H заменена оригинальным знаком Higgsfield из SVG в шапке https://higgsfield.ai/ (`hf-logo__glyph`, viewBox 0 0 20 20). Исходный path сохранён; только равномерное масштабирование и цвет карточки. Для Higgsfield точечная маска отключена, чтобы сохранить оригинальный силуэт. Знак принадлежит Higgsfield, использование обозначает инструмент автора портфолио. Неподтверждённых числовых достижений нет. На мобильном экране четыре инструмента собираются в две колонки; подписи видны постоянно.

GSAP раскрывает карточки одной последовательностью. После появления свойства SVG очищаются, чтобы не конфликтовать с CSS-наведением. Режим движения использует существующую настройку сайта.

Финальная секция объединяет типографику и выбранную Galaxy. Используется официальный Sketchfab Viewer API 1.12.1. SDK изолирован в собственном srcDoc-документе, чтобы размонтирование удаляло его глобальные экземпляры и обработчики. Сообщения проверяются по origin и источнику. Удалённый просмотрщик не подменяется другой моделью. Оригинальный постер остаётся во время загрузки, при ошибке и в уменьшенном режиме. Атрибуция: docs/vendor/GALAXY.md.

Текстуры ограничены 1024 px для небольшого просмотрщика и 2048 px для большого. При выходе из viewport вызывается stop; за пределами зоны предзагрузки, в скрытой вкладке и при выключенной анимации iframe удаляется. После ошибки iframe также удаляется; повторная попытка создаёт новый экземпляр. Управление ракурсом включается отдельной кнопкой, чтобы не перехватывать обычную прокрутку и контакты.

## Визуальное направление

Полноэкранная монохромная фотография, индустриальные трубы, графитовый фон, крупная типографика Oswald и редкие лаймовые акценты. Лицо справа, имя слева; мобильное кадрирование отдельное. Секции о подходе и контактах теперь тёмные.

## Изображение

Оригинал `public/images/mikail.jpg` сохранён без изменений. Фон расширен генерацией изображений: продолжить индустриальные трубы в широком кадре 16:9, сохранить узнаваемость лица, причёску, пирсинг и одежду, оставить слева пространство для текста. Рабочий результат — `public/images/hero-wide.webp`, 1672×941, около 162 КБ. Исходник генерации сохранён локально в `docs/qa/hero-generated-source.png` и не включён в публичный репозиторий.

## Компоненты и происхождение

Из [Smooth UI](https://github.com/educlopez/smoothui) адаптированы Clip Corners Button, Magnetic Button и Glow Hover Card. Снимки исходных registry-компонентов и MIT-лицензия сохранены в `docs/vendor/`. Компоненты перенесены на существующие обычные CSS-стили, без добавления Tailwind. Motion управляет небольшим смещением кнопок и углов, GSAP — появлением страниц и переходом изображения; одним свойством одного элемента одновременно они не управляют.

Магнитное смещение ограничено 9×6 px. Подсветка карточки использует один декоративный слой без дублирования интерактивного содержимого и MutationObserver. Кнопки доступны с клавиатуры и на телефонах.

Старый WebGL displacement портрета заменён собственной маской проявления фотографии на Canvas 2D. Этот дополнительный слой теперь синхронизирован с оригинальным Ring Field. Обработка идёт только при движении или затухании следа, с остановкой вне экрана и в скрытой вкладке. Разрешение ограничено 1920×1080; обработчики и кадры освобождаются.

## Originkit Cursor Ring Field — интеграция завершена

Компонент получен 26 сентября 2026 через официальный `originkit add cursor-ring-field` после обычного входа в аккаунт. Исходный WebGL-рендерер, шумовые поля, капсулы и симуляция отталкивания сохранены в `components/originkit/ui/cursor-ring-field.tsx` с адаптациями для этого сайта.

Изменения: прозрачный фон, лаймовая палитра, параметры кольца под hero, калибровка его положения под курсор, callback экранного центра для синхронизации фотографии, события только внутри hero, остановка вне экрана/скрытой вкладки, ограничение canvas 1920×1080 и обработка потери WebGL-контекста. На сенсорном вводе и при уменьшенном движении компонент не монтируется. Маска проявления фото получает положение от самого кольца, собственного независимого следования больше нет.

У компонента только React и встроенный WebGL, его стили уже inline; Tailwind не потребовался. Условия использования сохранены в `docs/vendor/ORIGINKIT-LICENSE.md`. Они разрешают модифицированный компонент в публичном репозитории действующего портфолио. Неизменённая копия хранится только локально в исключённой из Git папке `docs/qa/`.

## Навигация, движение и звук

Реальные адреса `/work/cudgi` и `/work/brand-builder` сохранены. На клике по карточке временная копия её изображения переходит в геометрию изображения кейса за 650 мс. Обычные модификаторы ссылок сохраняются. Есть очистка по завершению, истории, размонтированию и таймауту.

В меню: анимация «Как в системе», «Полная», «Уменьшенная». По умолчанию уважается prefers-reduced-motion; явный выбор хранится локально. Настройки ОС не менялись. На touch-устройствах нет зависимости от наведения. Существующее синтезированное аудио и его запоминание сохранены; без действия посетителя оно не включается.

## 2026-09-28 — first three refinement stages

- Hero: remove Ring Field mounting entirely. Canvas 2D independently tracks a fine hover pointer, reveals the same unfiltered image through a feathered radial mask, and uses the base image's computed crop. Position follows with 150 ms smoothing; opacity enters in about 200 ms and fades over about 700 ms. A settled pointer does not keep the frame loop alive. Offscreen/hidden/unmount clears and stops the effect. Reduced motion/coarse pointer uses a brighter static photo. Logo, name color and hero timelines are unchanged.
- Contact: one full-section cosmic canvas with foreground text and functioning contacts. The original Galaxy is composed to the right with Viewer API camera coordinates, not CSS scaling/cropping of the embed. Original animation loops at 0.35 speed. Mobile moves the galaxy above/right of the headline. The reduced-mode poster alone receives a feathered mask; it never rotates or pretends to be 3D.
- Remove all application-owned viewer labels, buttons, loading/error notices and the old hover translation. Attribution moves to the footer. The Sketchfab watermark and its unhideable native hint remain; reserve clear space below the footer text. No hover camera transition, logo replacement or name recoloring in this iteration.
- The service's native hint is the outstanding stage-2 limitation. Local rendering requires an official downloadable archive; no new runtime dependencies have been added.

## 2026-10-02 — stages 4–6

- Stage 4: hovering the word КЛАССНОЕ. with a fine hover pointer changes the actual Sketchfab camera toward +Z (disc in XY) over 1 second with easeInOutCubic; leaving returns over 1.2 seconds. Keyboard focus-visible on the CTA requests the same view; blur restores it. The Telegram anchor and existing green fill are preserved.
- Camera requests replace the current move; revision guards prevent stale completion acknowledgements. Initial loading retains the latest requested view. Resize immediately recomposes the active view using the existing responsive camera pan. Offscreen/hidden resets to the default view and pauses the scene. Reduced mode has no viewer; touch does not depend on hover. No poster animation or new dependency.
- Stage 5: both large name lines inherit var(--acid). Header name, typography, photo, flashlight and existing hero timelines remain as before.
- Stage 6: existing approved BrandMark remains shared by header, about and toolbox; both cases use the shared header. The MD favicon remains /icon.svg?v=md-2.
- Stage 2 remains partial: the native Sketchfab click-and-hold hint is still visible with ui_hint:0. No mandatory UI is masked or cropped. A local renderer still requires the official downloadable archive.

## 2026-10-02 — final layout polish

- Removed the desktop/tablet project offset and changed the two columns to equal widths. Shared 16:9 previews show the upper portion of each real interface without distorting the images; the full screenshots remain available in the cases. Mobile keeps natural image proportions and the existing vertical list spacing.
- Fixed the partially visible lime case button below the preview: it is fully hidden at rest, appears on hover/focus, and remains visible on mobile/coarse pointers.
- Prompt audit: original live Galaxy, full contact scene, independent flashlight, reversible camera, lime hero name and the approved vector MD remain implemented. Native Sketchfab hint is the remaining unmet requirement; official download was retried and opens login. Official initialization documentation again lists ui_hint as a Premium option. No replacement model or masked mandatory service UI.

## 2026-10-02 — local Galaxy; stage 2 completed

The user connected Sketchfab; the official 2K GLB was downloaded and verified to contain both original meshes, all three texture images and Take 001. The unchanged 1.28MB file is served from /models/galaxy.glb. A lazily imported Three.js renderer replaces the isolated SDK/iframe document completely. No external SDK or player UI remains; footer attribution is preserved.

Original materials and animation are retained, with local bloom/exposure and quieter stars. Y-up camera composition preserves the right-side placement and responsive layout. Camera transitions retain the current angle when interrupted. The footer no longer reserves 140px for a native service hint; ordinary content padding remains. Hero, aligned projects, contacts, sound and approved MD are unchanged.

Loading/error/reduced-motion modes retain the static original poster. GPU resources and ImageBitmaps are explicitly released, late fetch/loader completion is handled, and drawing stops offscreen/hidden. Detailed source and rendering adaptation are recorded in docs/vendor/GALAXY.md.

## 2026-10-02 — compact source link

Detailed Galaxy attribution moved to the public /credits route. The shared footer now shows only the visible «Источники» link. Credits retain the author, original model and license links, plus disclosure of rendering adaptations. The scene and interactions remain unchanged.
