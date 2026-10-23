import { ROADMAP, STATUS_LABEL, type RoadmapStep } from "../data/roadmap";
import sizes from "../data/roadmapSizes.json";
import { SectionHead } from "./SectionHead";
import { COPY } from "../data/copy";

type Sizes = Record<string, { light: number[]; dark: number[] }>; // [ширина, высота]
const SIZES = sizes as Sizes;

function Card({ s }: { s: RoadmapStep }) {
  const [lw, lh] = SIZES[s.id].light;
  const [dw, dh] = SIZES[s.id].dark;
  const alt = `Этап ${s.n} из ${ROADMAP.length}. ${s.period}. ${STATUS_LABEL[s.status]}. ${s.title} — ${s.text}`;
  return (
    <li className={`road-card st-${s.status}`}>
      <img className="road-img road-img-light" src={`road/${s.id}-light.webp`} alt={alt} width={lw} height={lh} loading="lazy" decoding="async" draggable={false} />
      <img className="road-img road-img-dark" src={`road/${s.id}-dark.webp`} alt="" aria-hidden="true" width={dw} height={dh} loading="lazy" decoding="async" draggable={false} />
    </li>
  );
}

/**
 * «Мой путь»: шесть карточек по порядку 1–6 в два столбца (слева 1–3, справа 4–6).
 * Это один логический список: правая половина продолжает нумерацию (start). На узком экране столбцы встают друг под другом.
 * Каждая карточка — готовая иллюстрация под свою тему, текст дублируется для скринридеров.
 */
export function Roadmap() {
  const half = Math.ceil(ROADMAP.length / 2);
  const left = ROADMAP.slice(0, half);
  const right = ROADMAP.slice(half);
  return (
    <section className="section" aria-labelledby="road-title" id="roadmap">
      <SectionHead {...COPY.roadmap} titleId="road-title" />
      <div className="road-cols">
        <ol className="road-list">{left.map((s) => <Card key={s.id} s={s} />)}</ol>
        <ol className="road-list" start={half + 1}>{right.map((s) => <Card key={s.id} s={s} />)}</ol>
      </div>
    </section>
  );
}
