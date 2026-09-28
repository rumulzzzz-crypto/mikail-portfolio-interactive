# Проверка обновления — 26 сентября 2026

## Инструменты и Galaxy — новая проверка

- Production build и TypeScript проходят. Новых зависимостей нет.
- Chrome: сетка проверена на desktop и viewport 390×844, горизонтального переполнения нет. Подтверждена фиолетовая заливка Photoshop при наведении, SVG освобождён от inline-трансформаций после GSAP-вступления.
- Уменьшенная анимация: iframe удалён, оригинальный постер 720×405 загружен, контакты доступны.
- Проверен переход CUDGI в уменьшенном режиме, Brand Builder в полном режиме (project-flight присутствует во время перехода), возврат на главную. Звук и оригинальный hero-компонент не изменены.
- Sketchfab на момент проверки: SDK загружается, официальный embed URL корректно назначен, но удалённый документ оставался пустым и viewerready не поступал. То же наблюдалось на отдельной диагностической странице с чистым официальным iframe без React/SDK, а также на публичном Vercel. Диагностическая страница удалена. Живое вращение и команда stop требуют повторной визуальной проверки при доступном Sketchfab; не считаются подтверждёнными этой проверкой.
- При сетевом ожидании остаётся оригинальный постер; после 45 секунд показывается повторная загрузка. Рендерер изолирован и удаляется при размонтировании, сообщение готовности проверяется по origin и source.
- Измерения FPS на физических мобильных устройствах не выполнялись.

- Production build Next.js и TypeScript проходят локально; Vercel собрал и опубликовал обновление. Главная, оба кейса и WebP возвращают HTTP 200 без cookies и авторизации.
- Chrome: проверены размеры 1494×710, 390×844 и 2560×1440. На телефоне скорректировано кадрирование лица; горизонтального переполнения не обнаружено.
- Полная анимация включена через новый пользовательский переключатель, без изменения ОС. Подтверждены появление страницы, desktop pin и промежуточный кадр перехода Brand Builder с изображением между карточкой и кейсом. Временный слой удаляется после перехода.
- Проверены оба кейса, двойное нажатие CUDGI, браузерный возврат, прямая загрузка и перезагрузка, увеличение изображения и Escape. В публичной версии Control+клик открыл CUDGI в отдельной вкладке с правильным адресом и содержимым.
- В уменьшенном режиме нет переходного слоя и закрепления hero; мобильная навигация к Brand Builder работает.
- Проверены меню, выбор режима, возврат фокуса при закрытии. Исправлена ширина страницы при открытом меню (стабильное место под полосу прокрутки).
- Состояния звука включено/выключено подтверждены интерфейсом. Субъективное качество звука не оценивалось.
- Предупреждение GSAP о пустой выборке на главной устранено проверкой существования секций кейса. На свежей вкладке публичного CUDGI ошибок и предупреждений нет. В публичной версии визуально проверено локальное проявление фото под курсором.
- Оригинальный Ring Field установлен через официальный CLI. В Chrome визуально проверены капсулы, смещение кольца при движении курсора вправо/в центр/влево и проявление фотографии вокруг его центра. Переключение в уменьшенный режим удаляет canvas; ссылки и меню работают поверх эффекта.
- Проверка не заменяет физические устройства iPhone/Android, другие браузеры и измерение FPS на слабом телефоне.

Скриншоты финальной публичной версии сохраняются локально в `docs/qa/`. Эта папка исключена из Git.
- Регрессия смены размеров: полный режим 1440×900 → прокрутка к работам → 390×844 → логотип. Фото и подписи видны, прокрутка возвращается к началу. Вступление и прокрутка управляют разными слоями фото.

## Ring Field: дополнение

- Первичная ошибка запуска после cleanup в React Strict Mode устранена: ресурсы удаляются по отдельности, WebGL-контекст не теряется принудительно во время повторного mount.
- WebGL-потеря/восстановление и физическое touch-устройство предусмотрены в коде, но искусственная потеря контекста и физический телефон в браузерной проверке не эмулировались.

## 2026-09-28 — current implementation

- Clean tree before work. Reviewed AGENTS and installed Next client-component documentation.
- Existing Galaxy reached viewerready in Chrome today; original model page and standalone official embed also rendered. The previous remote blank-document failure did not reproduce. SDK/document loading and source/origin validation succeeded. The new preload is latched, so visibility and scrolling no longer unmount a pending scene.
- Live scene: original Take 001 plays at 0.35 speed. Different screenshots show changed core/spiral orientation. Final-code reload reached data-playback=playing (official play callback); navigating to the hero reached data-playback=paused (official stop callback). Returning resumes without replacing the iframe. Hidden-document stop is implemented; physical background-tab CPU/FPS was not measured.
- Chrome desktop 1440x900 and mobile width 390x844: no horizontal overflow; mobile galaxy is above/right of the call to action. Contacts remain foreground links and the decorative scene is inert. Keyboard Tab from the project-discussion link reaches Telegram, skipping the viewer.
- Reduced mode: zero galaxy iframes and zero photo-reveal canvases; feathered original poster and stars remain, with readable contacts. No synthetic network failure was injected; fallback appearance was verified in reduced mode and error handling reviewed in code.
- Hero: pointer on face visibly reveals natural details, moving to pipes follows smoothly; leaving through the header changes the reveal from fading to idle. No Ring Field element/render loop remains. The image crop matches the base layer, and existing hero scrolling is retained.
- CUDGI navigation and return checked in reduced mode at mobile width; Brand Builder navigation and return checked in full mode. No captured application errors or warnings. Physical touch hardware and GPU performance were not measured.
- pnpm typecheck and production build pass. No added packages.
- Remaining: native Sketchfab click-and-hold hint persists despite the official ui_hint:0 option (documented Premium restriction). Its clear footer area is retained; no overlay or branding crop is used. Download button opens login. Stage 1 works; stage 2 remains partial pending official model archive for local rendering; stage 3 works.
