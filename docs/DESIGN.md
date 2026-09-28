# Портфолио — обновление 26 сентября 2026

## Инструменты и Galaxy

В «Обо мне» добавлена зелёная ступенчатая сетка Figma, Codex, Photoshop и Higgsfield. Палитра: фон #a8f333, панели #8aca2b, графика #152008, активная панель #6118d9. Использованы существующие Oswald и Manrope, срезанные углы и точечная графика. Codex обозначен терминальным символом, Higgsfield — авторской монограммой H, а не заявленными официальными логотипами. Неподтверждённых числовых достижений нет. На мобильном экране четыре инструмента собираются в две колонки; подписи видны постоянно.

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
