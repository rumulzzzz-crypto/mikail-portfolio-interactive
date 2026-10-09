import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import { ProjectNavigation } from "@/components/ProjectLink";
import { Shell } from "@/components/Shell";
export const metadata: Metadata = {
  title: {
    default: "Микаил Дадашов — веб-дизайнер и разработчик сайтов",
    template: "%s — Микаил Дадашов",
  },
  description:
    "Дизайн и разработка лендингов, небольших сайтов и интерфейсов. Работы Микаила Дадашова: CUDGI, Brand Builder и «Грань».",
  icons: { icon: "/icon.svg?v=md-2" },
  openGraph: {
    title: "Микаил Дадашов — веб-дизайнер и разработчик сайтов",
    description: "Дизайн и разработка лендингов, небольших сайтов и интерфейсов. Работы Микаила Дадашова: CUDGI, Brand Builder и «Грань».",
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
