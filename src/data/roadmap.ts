export type RoadmapStatus = "done" | "now" | "planned";

export type RoadmapStep = {
  /** Файлы: /public/road/<id>-light.webp и <id>-dark.webp (карточка целиком нарисована на картинке). */
  id: string;
  n: number;
  status: RoadmapStatus;
  /** Период или срок, как на карточке. */
  period: string;
  title: string;
  text: string;
};

export const STATUS_LABEL: Record<RoadmapStatus, string> = {
  done: "Пройдено",
  now: "Сейчас",
  planned: "В планах",
};

// «Мой путь»: шесть этапов, по порядку от 1 до 6. Тексты совпадают с карточками-картинками.
export const ROADMAP: RoadmapStep[] = [
  { id: "step-01", n: 1, status: "done", period: "2019", title: "Computer Systems Programmer", text: "Образование: программирование компьютерных систем." },
  { id: "step-02", n: 2, status: "done", period: "2021", title: "IT Support Specialist", text: "Первый опыт работы в ИТ." },
  { id: "step-03", n: 3, status: "done", period: "2022", title: "Distro Hopper", text: "Знакомство с разными дистрибутивами Linux." },
  { id: "step-04", n: 4, status: "done", period: "2023", title: "System Administrator", text: "Системное администрирование." },
  { id: "step-05", n: 5, status: "now", period: "2025 — настоящее время", title: "AI-Assisted Developer", text: "Разработка с помощью ИИ." },
  { id: "step-06", n: 6, status: "planned", period: "Следующий этап", title: "AI-Powered Developer", text: "Разработка с ИИ в основе рабочего процесса." },
];
