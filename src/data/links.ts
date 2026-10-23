/** Значение, которое зависит от темы сайта (в светлой и тёмной теме показываются разные контакты). */
export type Themed = { light: string; dark: string };
export type ContactKind = "email" | "telegram" | "github";
export type ContactItem = { id: string; kind: ContactKind; label: string; value: Themed; placeholder: boolean };

export type Project = {
  id: string;
  /** Рубрика над заголовком («Проект 01»). */
  kicker: string;
  title: string;
  text: string;
  /** Дата или статус под описанием (как на обложке). */
  date: string;
  tech: string[];
  /** Обложка: /public/projects/<image>-light.webp и <image>-dark.webp (по теме). */
  image: string;
  imageAlt: string;
  demo?: string;
  repo?: string;
  placeholder: boolean;
};

// Контакты: отдельные значения для светлой и тёмной темы. Ссылки собираются из значений (см. LinksProjects.tsx).
// Записи с placeholder: true скрыты в публичной сборке и показаны с пометкой в режиме разработки.
export const CONTACT: ContactItem = {
  id: "email", kind: "email", label: "Почта", placeholder: false,
  value: { light: "Lolagigabot3@outlook.com", dark: "installNabludatelA@icloud.com" },
};

export const SOCIALS: ContactItem[] = [
  { id: "telegram", kind: "telegram", label: "Telegram", placeholder: false, value: { light: "LolaGigaBot", dark: "installNabludatel" } },
  { id: "github", kind: "github", label: "GitHub", placeholder: false, value: { light: "LolaGigaBot", dark: "installNabludatel" } },
];

// Проекты — по обложкам: заголовки, подписи и даты совпадают с текстом на изображениях.
// Ссылки demo/repo не заданы, пока нет реальных адресов (пустые ссылки не показываются).
export const PROJECTS: Project[] = [
  {
    id: "portrait",
    kicker: "Проект 01",
    title: "Цифровой портрет",
    text: "Сайт-портфолио Дмитрия Мантулина.",
    date: "Создано · октябрь 2026",
    tech: ["React", "TypeScript", "Vite", "Matter.js"],
    image: "portrait",
    imageAlt: "Обложка проекта: огромные каменные буквы «ДМ» на приморской террасе, на мачте между ними развевается флажок, ведёт лестница, вокруг кипарисы и море — днём в светлой теме и ночью с луной в тёмной",
    placeholder: false,
  },
  {
    id: "soon",
    kicker: "Проект 02",
    title: "Скоро будет",
    text: "Coming soon.",
    date: "Дата анонса · позже",
    tech: [],
    image: "soon",
    imageAlt: "Обложка проекта: над недостроенным кубом из каменных блоков парит последний блок, крупная надпись «Coming soon — Скоро будет»",
    placeholder: false,
  },
];
