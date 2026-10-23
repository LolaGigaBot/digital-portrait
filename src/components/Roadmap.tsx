import { ROADMAP, STATUS_LABEL } from "../data/roadmap";
import sizes from "../data/roadmapSizes.json";
import { SectionHead } from "./SectionHead";
import { COPY } from "../data/copy";

type Sizes = Record<string, { light: number[]; dark: number[] }>; // [ширина, высота]
const SIZES = sizes as Sizes;

/** «Мой путь»: шесть карточек по порядку 1–6. Каждая карточка — готовая иллюстрация под свою тему, текст дублируется для скринридеров. */
export function Roadmap() {
  return (
    <section className="section" aria-labelledby="road-title" id="roadmap">
      <SectionHead {...COPY.roadmap} titleId="road-title" />
      <ol className="road-list">
        {ROADMAP.map((s) => {
          const [lw, lh] = SIZES[s.id].light;
          const [dw, dh] = SIZES[s.id].dark;
          const alt = `Этап ${s.n} из ${ROADMAP.length}. ${s.period}. ${STATUS_LABEL[s.status]}. ${s.title} — ${s.text}`;
          return (
            <li key={s.id} className={`road-card st-${s.status}`}>
              <img className="road-img road-img-light" src={`road/${s.id}-light.webp`} alt={alt} width={lw} height={lh} loading="lazy" decoding="async" draggable={false} />
              <img className="road-img road-img-dark" src={`road/${s.id}-dark.webp`} alt="" aria-hidden="true" width={dw} height={dh} loading="lazy" decoding="async" draggable={false} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
