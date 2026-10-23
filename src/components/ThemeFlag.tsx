import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/storage";

export type Theme = "light" | "dark";

/** Флажок-переключатель: слева = светлая, справа = тёмная. Тема меняется ПОСЛЕ завершения движения. */
export function ThemeFlag({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  // pos — где флажок физически находится/едет; theme — применённая тема.
  const [pos, setPos] = useState<"left" | "right">(theme === "dark" ? "right" : "left");
  const [moving, setMoving] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const timer = useRef<number>(0);

  const done = useRef(true);
  const finish = (target: "left" | "right") => {
    if (done.current) return; // сработает только одна из развязок: transitionend или таймер
    done.current = true;
    window.clearTimeout(timer.current);
    setMoving(false);
    onChange(target === "right" ? "dark" : "light");
  };

  const toggle = () => {
    if (moving) return;
    const target = pos === "left" ? "right" : "left";
    setPos(target);
    done.current = false;
    if (prefersReducedMotion()) return finish(target);
    setMoving(true);
    timer.current = window.setTimeout(() => finish(target), 1400); // запасной таймер на случай без transitionend
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className={`flag-wrap pos-${pos}${moving ? " is-moving" : ""}${theme === "dark" ? " face-left" : ""}`}>
      <button
        ref={ref}
        type="button"
        className="flag"
        aria-label="Тёмная тема"
        aria-pressed={theme === "dark"}
        aria-disabled={moving}
        onClick={toggle}
        onTransitionEnd={(e) => {
          if (moving && e.target === ref.current && e.propertyName === "left") finish(pos);
        }}
      >
        <span className="flag-hint" aria-hidden="true">
          <span className="flag-hint-text">повернуть флажочек</span>
          <svg className="flag-arrow" viewBox="0 0 46 40" width="46" height="40">
            <path d="M6 2 C 0 14, 8 20, 26 22 Q 38 24, 38 34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M32.5 28 L38 35 L43.5 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <svg className="flag-svg" viewBox="0 0 66 70" width="66" height="70" aria-hidden="true">
          <rect x="10" y="0" width="4" height="70" className="flag-pole" />
          <path d="M14 1 L64 19 L14 37 Z" className="flag-cloth" />
        </svg>
        <span className="flag-label" aria-hidden="true">{theme === "dark" ? "тёмно" : "светло"}</span>
      </button>
    </div>
  );
}





