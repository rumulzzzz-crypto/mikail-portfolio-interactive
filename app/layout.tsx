import type { Metadata } from "next";
import "@fontsource/oswald/cyrillic-400.css";
import "@fontsource/oswald/latin-400.css";
import "@fontsource/manrope/cyrillic-400.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/cyrillic-600.css";
import "@fontsource/manrope/latin-600.css";
import "./globals.css";
import { ProjectNavigation } from "@/components/ProjectLink";
import { Shell } from "@/components/Shell";
export const metadata: Metadata = {
  title: {
    default: "Микаил Дадашов — веб-дизайн и разработка",
    template: "%s — Микаил Дадашов",
  },
  description:
    "Персональное портфолио Микаила Дадашова. Веб-дизайн, разработка сайтов и интерфейсов. CUDGI и Brand Builder.",
  icons: { icon: "/icon.svg?v=md-2" },
  openGraph: {
    title: "Микаил Дадашов — веб-дизайн и разработка",
    description: "Сайты, интерфейсы и взаимодействия. Избранные проекты.",
    locale: "ru_RU",
    type: "website",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <ProjectNavigation>
          <Shell>{children}</Shell>
        </ProjectNavigation>
      </body>
    </html>
  );
}
