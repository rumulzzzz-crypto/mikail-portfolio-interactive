import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import { ProjectNavigation } from "@/components/ProjectLink";
import { Shell } from "@/components/Shell";
export const metadata: Metadata = {
  title: {
    default: "Микаил Дадашов — веб-дизайн и разработка",
    template: "%s — Микаил Дадашов",
  },
  description:
    "Микаил Дадашов — веб-дизайн и разработка сайтов. От идеи до работающего интерфейса: структура, визуальный характер и адаптивная реализация. Кейсы CUDGI и Brand Builder.",
  icons: { icon: "/icon.svg?v=md-2" },
  openGraph: {
    title: "Микаил Дадашов — веб-дизайн и разработка",
    description: "Веб-дизайн и разработка сайтов с характером и понятным путём к действию. Кейсы CUDGI и Brand Builder.",
    locale: "ru_RU",
    type: "website",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preload" href="/fonts/oswald-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/oswald-cyrillic-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-cyrillic-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-cyrillic-600-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <ProjectNavigation>
          <Shell>{children}</Shell>
        </ProjectNavigation>
      </body>
    </html>
  );
}
