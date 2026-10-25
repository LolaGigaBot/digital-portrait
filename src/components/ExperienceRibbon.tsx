import { useCallback, useEffect, useRef, useState } from "react";
import { COMPANIES } from "../data/experience";
import { CompanyDetail } from "./CompanyDetail";
import { CompanyLogo } from "./CompanyLogo";
import { prefersReducedMotion } from "../lib/storage";
import { SectionHead } from "./SectionHead";
import { COPY } from "../data/copy";

const COPIES = 3;
const CARD_W = 300; // ширина карточки с отступом, для расчёта повторов
/** Сколько раз повторить список карточек внутри одной копии, чтобы копия была шире экрана (цикл без пустот). */
const REPEAT = Math.max(1, Math.ceil(1500 / (COMPANIES.length * CARD_W)));
const SPEED = 45; // px/сек, лента движется слева направо

export function ExperienceRibbon() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [touching, setTouching] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const scroller = useRef<HTMLDivElement>(null);
  const firstSet = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastOpener = useRef<string | null>(null);
  const touchTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(touchTimer.current), []);
  const paused = userPaused || hover || touching || !!openId || reduced;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // Бесконечная лента на scrollLeft: поддерживает и автодвижение, и ручную прокрутку.
  useEffect(() => {
    const el = scroller.current, set = firstSet.current;
    if (!el || !set || reduced) return; // при уменьшенном движении цикл не запускается, лента листается вручную
    let raf = 0, last = performance.now(), pos = 0, written = -1, visible = true;
    let wCache = 0;
    const measure = () => { wCache = set.offsetWidth + parseFloat(getComputedStyle(set).columnGap || "0"); return wCache; };
    const W = () => wCache || measure();
    const init = () => { pos = W(); el.scrollLeft = pos; written = el.scrollLeft; };
    init();
    const wrap = () => { const w = W(); if (w <= 0) return; if (pos <= 0) pos += w; else if (pos >= 2 * w) pos -= w; };
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.1); last = t;
      if (!visible || document.hidden) { raf = requestAnimationFrame(tick); return; } // вне экрана — без чтения layout и записи scrollLeft
      if (Math.abs(el.scrollLeft - written) > 1.5) pos = el.scrollLeft; // пользователь прокрутил сам
      if (!pausedRef.current && visible && !document.hidden) pos -= SPEED * dt; // уменьшаем scrollLeft => контент едет вправо
      wrap();
      el.scrollLeft = pos; written = el.scrollLeft;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    const ro = new ResizeObserver(() => { measure(); pos = Math.min(Math.max(pos, 1), 2 * W() - 1); });
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

  const open = useCallback((id: string) => { lastOpener.current = id; setOpenId(id); }, []);
  const close = useCallback(() => {
    setOpenId(null);
    const id = lastOpener.current;
    requestAnimationFrame(() => cardRefs.current[id ?? ""]?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => { if (openId) requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true })); }, [openId]);

  const company = COMPANIES.find((c) => c.id === openId) ?? null;

  return (
    <section className="section ribbon-section" aria-labelledby="exp-title" id="experience">
      <SectionHead {...COPY.experience} titleId="exp-title" right={!reduced && (
            <button type="button" className="pill" aria-pressed={userPaused} onClick={() => setUserPaused((v) => !v)}>
              {userPaused ? "▶ Продолжить движение" : "❚❚ Остановить ленту"}
            </button>
          )} />
      <div
        className="ribbon" ref={scroller}
        onClick={(e) => { const el = (e.target as HTMLElement).closest<HTMLElement>("[data-co]"); if (el?.dataset.co) open(el.dataset.co); }}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") setHover(true); }} onPointerLeave={(e) => { if (e.pointerType === "mouse") setHover(false); }}
        onFocusCapture={(e) => { let kb = true; try { kb = (e.target as HTMLElement).matches(":focus-visible"); } catch { /* Safari < 15.4 */ } if (kb) setHover(true); }} onBlurCapture={() => setHover(false)}
        onTouchStart={() => { window.clearTimeout(touchTimer.current); setTouching(true); }}
        onTouchEnd={() => { window.clearTimeout(touchTimer.current); touchTimer.current = window.setTimeout(() => setTouching(false), 1800); }}
        onTouchCancel={() => { window.clearTimeout(touchTimer.current); setTouching(false); }}
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          <div key={copy} className="ribbon-set" ref={copy === 0 ? firstSet : undefined} aria-hidden={copy > 0 || undefined}>
            {Array.from({ length: REPEAT }, (_, rep) => COMPANIES.map((c) => {
              const real = copy === 0 && rep === 0; // только первая копия доступна клавиатуре и скринридерам
              const content = (
                <>
                  <span className="co-logo" aria-hidden={!real || undefined}><CompanyLogo company={c} size={360} /></span>
                  <span className="co-name">{c.name}</span>
                  <span className="co-tagline">{c.role}</span>
                  <span className="co-period">{c.periodLabel}</span>
                </>
              );
              const cls = `co-card${openId === c.id ? " is-open" : ""}`;
              // Настоящая карточка — кнопка (клавиатура, скринридер). Копии для бесконечной ленты — обычные div:
              // они не фокусируются и скрыты от AT, но остаются кликабельными (inert блокировал бы и мышь).
              return real ? (
                <button
                  key={`${rep}-${c.id}`} type="button" data-co={c.id} className={cls}
                  ref={(el) => { cardRefs.current[c.id] = el; }}
                  aria-expanded={openId === c.id}
                  aria-label={`${c.name}, ${c.role}, ${c.periodLabel}. Показать подробности`}
                >{content}</button>
              ) : (
                <div key={`${copy}-${rep}-${c.id}`} data-co={c.id} className={cls} aria-hidden="true">{content}</div>
              );
            }))}
          </div>
        ))}
      </div>      <div className={`detail-wrap${company ? " is-open" : ""}`}>
        <div className="detail-inner">{company && <CompanyDetail company={company} onClose={close} closeRef={closeRef} />}</div>
      </div>
    </section>
  );
}





