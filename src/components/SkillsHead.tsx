import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { SKILLS, type Skill } from "../data/skills";
import { CAVITY, HEAD_OUTLINE, VIEW, pointInPolygon, toPath } from "../data/head";
import { prefersReducedMotion } from "../lib/storage";
import { SectionHead } from "./SectionHead";
import { COPY } from "../data/copy";

const R = 22; // радиус шарика в единицах viewBox (18 шариков должны свободно умещаться в полости)

/** Иконка навыка: версия под тему показывается через CSS по data-theme (как логотипы компаний). */
function SkillIcon({ id, size }: { id: string; size: number }) {
  return (
    <>
      <img className="sk-img sk-img-light" src={`skills/${id}-light.webp`} alt="" width={size} height={size} loading="lazy" decoding="async" draggable={false} />
      <img className="sk-img sk-img-dark" src={`skills/${id}-dark.webp`} alt="" width={size} height={size} loading="lazy" decoding="async" draggable={false} />
    </>
  );
}
const MAX_SPEED = 22;

type Ball = { skill: Skill; body: Matter.Body; home: { x: number; y: number } };

/** Статичная раскладка шариков внутри полости (для reduced-motion и стартовых позиций). */
function layout(n: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  const gap = R * 2.15;
  for (let y = 110; y < 330 && out.length < n; y += gap * 0.9) {
    for (let x = 100; x < 360 && out.length < n; x += gap) {
      const px = x + (Math.round((y - 110) / (gap * 0.9)) % 2) * (gap / 2);
      if (pointInPolygon(px, y, CAVITY) && pointInPolygon(px + R, y, CAVITY) && pointInPolygon(px - R, y, CAVITY) &&
          pointInPolygon(px, y + R, CAVITY) && pointInPolygon(px, y - R, CAVITY)) out.push({ x: px, y });
    }
  }
  return out;
}

export function SkillsHead() {
  const stage = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [reduced] = useState(prefersReducedMotion);
  const spots = useRef(layout(SKILLS.length));

  useEffect(() => {
    const stageEl = stage.current;
    if (!stageEl) return;
    const place = (i: number, x: number, y: number, angle: number) => {
      const el = els.current[i];
      if (el) el.style.transform = `translate(-50%,-50%) translate(${(x / VIEW.w) * stageEl.clientWidth}px,${(y / VIEW.h) * stageEl.clientHeight}px)`;
      el?.style.setProperty("--rot", `${angle}rad`);
    };
    const positionAll = (balls?: Ball[]) => SKILLS.forEach((_, i) => {
      const b = balls?.[i];
      const s = spots.current[i] ?? spots.current[0];
      place(i, b ? b.body.position.x : s.x, b ? b.body.position.y : s.y, b ? b.body.angle : 0);
    });

    if (reduced) {
      positionAll();
      const ro = new ResizeObserver(() => positionAll());
      ro.observe(stageEl);
      return () => ro.disconnect();
    }

    const { Engine, Bodies, Body, Composite, Constraint } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 0.55, scale: 0.001 } });
    // Стены: прямоугольники вдоль рёбер полости, вынесенные наружу.
    const area = CAVITY.reduce((s, p, i) => { const q = CAVITY[(i + 1) % CAVITY.length]; return s + (p[0] * q[1] - q[0] * p[1]); }, 0);
    const sign = area > 0 ? 1 : -1;
    const walls = CAVITY.map((p, i) => {
      const q = CAVITY[(i + 1) % CAVITY.length];
      const dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy);
      const nx = (dy / len) * sign, ny = (-dx / len) * sign; // наружу
      const T = 80;
      return Bodies.rectangle((p[0] + q[0]) / 2 + (nx * T) / 2, (p[1] + q[1]) / 2 + (ny * T) / 2, len + 24, T, { isStatic: true, angle: Math.atan2(dy, dx), friction: 0.05, restitution: 0.5 });
    });
    const balls: Ball[] = SKILLS.map((skill, i) => {
      const home = spots.current[i] ?? spots.current[0];
      const body = Bodies.circle(home.x, home.y, R, { restitution: 0.55, friction: 0.02, frictionAir: 0.012, density: 0.002 });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 });
      return { skill, body, home };
    });
    Composite.add(engine.world, [...walls, ...balls.map((b) => b.body)]);

    // Перетаскивание мышью/пальцем через пружинную связь.
    let drag: { constraint: Matter.Constraint; id: number } | null = null;
    const toWorld = (e: PointerEvent) => {
      const r = stageEl.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * VIEW.w, y: ((e.clientY - r.top) / r.height) * VIEW.h };
    };
    const onDown = (e: PointerEvent) => {
      const idx = els.current.findIndex((el) => el && el.contains(e.target as Node));
      if (idx < 0) return;
      const pt = toWorld(e);
      const c = Constraint.create({ pointA: pt, bodyB: balls[idx].body, pointB: { x: 0, y: 0 }, stiffness: 0.12, damping: 0.15, length: 0 });
      Composite.add(engine.world, c);
      drag = { constraint: c, id: e.pointerId };
      (e.target as Element).setPointerCapture?.(e.pointerId);
      els.current[idx]?.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const pt = toWorld(e);
      // тянем только внутри полости — снаружи клампим к последней допустимой точке
      if (pointInPolygon(pt.x, pt.y, CAVITY)) drag.constraint.pointA = pt;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      Composite.remove(engine.world, drag.constraint);
      drag = null;
      els.current.forEach((el) => el?.classList.remove("is-dragging"));
    };
    stageEl.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const STEP = 1000 / 60;
    let raf = 0, last = performance.now(), running = true, visible = true, acc = 0;
    const step = (t: number) => {
      raf = requestAnimationFrame(step);
      if (!running || !visible || document.hidden) { last = t; return; }
      acc += Math.min(t - last, 100); last = t;
      for (let n = 0; acc >= STEP && n < 3; n++, acc -= STEP) Engine.update(engine, STEP); // фиксированный шаг — стабильнее физика
      if (acc > STEP * 3) acc = 0;
      for (const b of balls) {
        const v = b.body.velocity, sp = Math.hypot(v.x, v.y);
        if (sp > MAX_SPEED) Body.setVelocity(b.body, { x: (v.x / sp) * MAX_SPEED, y: (v.y / sp) * MAX_SPEED });
        const { x, y } = b.body.position;
        if (!pointInPolygon(x, y, CAVITY)) { // страховка: шарик не должен покинуть голову
          Body.setPosition(b.body, { x: b.home.x, y: b.home.y });
          Body.setVelocity(b.body, { x: 0, y: 0 });
        }
      }
      positionAll(balls);
    };
    raf = requestAnimationFrame(step);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(stageEl);
    const ro = new ResizeObserver(() => positionAll(balls)); // физика в единицах viewBox — пересчитывается только проекция на экран
    ro.observe(stageEl);
    if (import.meta.env.DEV) (window as unknown as { __skills?: unknown }).__skills = { balls, CAVITY, pointInPolygon };

    return () => {
      running = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      stageEl.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      Composite.clear(engine.world, false); Engine.clear(engine);
    };
  }, [reduced]);

  return (
    <section className="section skills" aria-labelledby="skills-title" id="skills">
      <SectionHead {...COPY.skills} titleId="skills-title" />
      <div className="skills-grid">
        <div className="head-stage" ref={stage} style={{ aspectRatio: `${VIEW.w} / ${VIEW.h}` }}>
          <svg className="head-svg" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} aria-hidden="true" focusable="false">
            <path d={toPath(HEAD_OUTLINE)} className="head-shape" />
            <path d={toPath(CAVITY)} className="head-cavity" />
          </svg>
          {SKILLS.map((s, i) => (
            <button
              key={s.id} type="button" className={`ball${active === s.id ? " show-tip" : ""}`}
              ref={(el) => { els.current[i] = el; }}
              style={{ width: `${((R * 2) / VIEW.w) * 100}%`, aspectRatio: "1" }}
              aria-label={s.name}
              onFocus={() => setActive(s.id)} onBlur={() => setActive(null)}
              onKeyDown={(e) => { if (e.key === "Escape") setActive(null); }}
              onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
              onClick={() => setActive((a) => (a === s.id ? null : s.id))}
            >
              <SkillIcon id={s.id} size={192} />
              <span className="tip" aria-hidden="true">{s.name}</span>
            </button>
          ))}
        </div>
        <div className="skills-list">
          <h3>Список навыков</h3>
          <ul className="skills-ul" tabIndex={0} aria-label={`Список навыков, ${SKILLS.length} пунктов`}>{SKILLS.map((s) => <li key={s.id}><span className="dot" aria-hidden="true"><SkillIcon id={s.id} size={48} /></span>{s.name}</li>)}</ul>
          <p className="hint">Шарики можно хватать и перемешивать — мышью или пальцем. Этот список — полноценная альтернатива шарикам для клавиатуры и скринридеров.</p>
        </div>
      </div>
    </section>
  );
}



