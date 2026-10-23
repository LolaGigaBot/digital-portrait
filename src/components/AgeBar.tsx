import { useState } from "react";
import { AGE_STYLES, getAge, getExactAge, getStageIndex, isStyleUnlocked, unlockDate, type AgeStyle } from "../lib/age";

const STAGES: Record<AgeStyle, { name: string; range: string }> = {
  free: { name: "Эксперимент", range: "1–30" },
  mature: { name: "Баланс", range: "30–50" },
  formal: { name: "Суть", range: "50–∞" },
};

const fmt = (d: Date) => d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

/** Доля заполнения сегмента по возрасту. Третий сегмент — без «процента до бесконечности»: либо пуст, либо открыт. */
function fillOf(i: number, exact: number): number {
  if (i === 0) return Math.min(exact, 30) / 30;
  if (i === 1) return Math.min(Math.max(exact - 30, 0), 20) / 20;
  return exact >= 50 ? 1 : 0;
}

export function AgeBar({ now, style, onStyleChange }: { now: Date; style: AgeStyle; onStyleChange: (s: AgeStyle) => void }) {
  const age = getAge(now);
  const exact = getExactAge(now);
  const current = getStageIndex(age);
  const [more, setMore] = useState(false);

  return (
    <>
      <div className="agebar" role="region" aria-label="Шкала жизненных этапов">
        <div className="agebar-inner">
          <div className="stages">
            {AGE_STYLES.map((s, i) => {
              const open = isStyleUnlocked(s, age);
              const fill = fillOf(i, exact);
              return (
                <div key={s} className={`stage${i === current ? " is-current" : ""}${i === 2 ? " is-open-end" : ""}`}>
                  {i === current && <p className="you-here"><b>{age}</b> — ты здесь</p>}
                  <div className="stage-track" aria-hidden="true">
                    <div className="stage-fill" style={{ width: `${fill * 100}%` }} />
                    {i === current && fill < 1 && <span className="stage-tick" style={{ left: `${fill * 100}%` }} />}
                  </div>
                  <button
                    type="button" className="stage-btn" aria-pressed={style === s} disabled={!open}
                    onClick={() => onStyleChange(s)}
                    title={open ? `Оформление «${STAGES[s].name}»` : `Откроется ${fmt(unlockDate(s))}`}
                    aria-label={`0${i + 1} / ${STAGES[s].name}, ${STAGES[s].range}${open ? "" : `, откроется ${fmt(unlockDate(s))}`}`}
                  >
                    <span className="stage-name"><span className="stage-num">0{i + 1} /</span> {STAGES[s].name}</span>
                    <span className="stage-range">{STAGES[s].range}{!open && <span className="stage-lock" aria-hidden="true"> 🔒</span>}</span>
                  </button>
                </div>
              );
            })}
          </div>
          <button type="button" className="agebar-toggle" aria-expanded={more} onClick={() => setMore((v) => !v)}>Пояснение {more ? "▴" : "▾"}</button>
          <p className={`agebar-note${more ? " is-open" : ""}`}>Шкала жизненных этапов, а не прогноз продолжительности жизни.</p>
        </div>
      </div>
    </>
  );
}

