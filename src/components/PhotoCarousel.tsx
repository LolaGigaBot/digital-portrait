import { useCallback, useEffect, useRef, useState } from "react";
import { NICKS, PHOTOS } from "../data/photos";
import { prefersReducedMotion } from "../lib/storage";
import type { Theme } from "./ThemeFlag";

const INTERVAL = 4000; // смена фото каждые 4 секунды (и в светлой, и в тёмной теме)

/** Карусель портретов: набор фото зависит от темы, за кадром — фигура, меняющая форму от слайда к слайду. */
export function PhotoCarousel({ theme }: { theme: Theme }) {
  const count = PHOTOS.light.length;
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const start = useRef<{ x: number; id: number } | null>(null);
  const playing = !reduced && !userPaused && !hover;

  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => { if (!document.hidden) go(1); }, INTERVAL);
    return () => window.clearInterval(t);
  }, [playing, go, index]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { go(1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { go(-1); e.preventDefault(); }
  };

  return (
    <div
      className="carousel" role="region" aria-roledescription="карусель" aria-label="Фотографии Дмитрия" tabIndex={0}
      onKeyDown={onKey}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocusCapture={(e) => { if ((e.target as HTMLElement).matches(":focus-visible")) setHover(true); }}
      onBlurCapture={() => setHover(false)}
    >
      <div className="photo-shape" data-shape={index % 3} aria-hidden="true" />
      <div
        className="photo-frame"
        onPointerDown={(e) => { start.current = { x: e.clientX, id: e.pointerId }; }}
        onPointerUp={(e) => {
          const s = start.current; start.current = null;
          if (s && s.id === e.pointerId && Math.abs(e.clientX - s.x) > 40) go(e.clientX < s.x ? 1 : -1);
        }}
        onPointerCancel={() => { start.current = null; }}
      >
        {(["light", "dark"] as const).flatMap((set) =>
          PHOTOS[set].map((p, i) => {
            const active = theme === set && index === i;
            const first = set === theme && i === 0;
            return (
              <img
                key={p.src} className={`photo${active ? " is-active" : ""}`} src={p.src}
                srcSet={`${p.src.replace(".webp", "-480.webp")} 480w, ${p.src} 900w`} sizes="(max-width: 600px) 90vw, 480px"
                alt={active ? p.alt : ""} aria-hidden={!active}
                width={PHOTOS.width} height={PHOTOS.height} decoding="async"
                loading={first ? "eager" : "lazy"} fetchPriority={first ? "high" : "low"} draggable={false}
              />
            );
          }),
        )}
      </div>
      {/* key={theme}: анимация набора ника запускается заново при смене темы */}
      <p className="nick" key={theme}>
        <span className="nick-plate">
          <span className="nick-label">ник</span>
          <span className="nick-text" style={{ "--n": NICKS[theme].length } as React.CSSProperties}>{NICKS[theme]}</span>
        </span>
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">Фото {index + 1} из {count}: {PHOTOS[theme][index].alt}</p>
      <div className="carousel-ctrl">
        <button type="button" className="car-btn" onClick={() => go(-1)} aria-label="Предыдущее фото">‹</button>
        <div className="car-dots" role="group" aria-label="Выбор фото">
          {PHOTOS.light.map((_, i) => (
            <button key={i} type="button" className="car-dot" aria-label={`Фото ${i + 1} из ${count}`} aria-current={index === i} onClick={() => setIndex(i)} />
          ))}
        </div>
        <button type="button" className="car-btn" onClick={() => go(1)} aria-label="Следующее фото">›</button>
        {!reduced && (
          <button type="button" className="car-btn car-play" onClick={() => setUserPaused((v) => !v)} aria-pressed={userPaused} aria-label={userPaused ? "Запустить автопрокрутку" : "Остановить автопрокрутку"}>
            {userPaused ? "▶" : "❚❚"}
          </button>
        )}
      </div>
    </div>
  );
}
