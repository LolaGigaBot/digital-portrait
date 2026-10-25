import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/storage";

type Kind = "dot" | "spark" | "dash" | "ring";
type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; kind: Kind; color: number; rot: number; vr: number };

const MAX_PARTICLES = 220;

/**
 * Шлейф за курсором в комиксном стиле: россыпь мелких точек (полутон), искорки-крестики, чернильные штрихи и колечки.
 * Рисуется на одном canvas поверх страницы (pointer-events: none). Цвета берутся из CSS-переменных темы.
 * Выключен на сенсорных устройствах и при prefers-reduced-motion; цикл анимации спит, когда частиц нет или вкладка скрыта.
 */
export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1, w = 0, h = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // размеры без полосы прокрутки и без «большого» viewport iOS; CSS растягивает холст на inset:0
      w = document.documentElement.clientWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // палитра темы: акцент, чернила, «бумага»
    let palette = ["#ff5a28", "#1d1f1b", "#ff8a5c"];
    const readPalette = () => {
      const cs = getComputedStyle(document.documentElement);
      const g = (n: string, d: string) => cs.getPropertyValue(n).trim() || d;
      const dark = document.documentElement.dataset.theme === "dark";
      palette = dark
        ? [g("--accent", "#9fc0e8"), "#dbe6f4", "#5f86b3"]
        : [g("--accent", "#ff5a28"), g("--ink", "#1d1f1b"), "#ff8a5c"];
    };
    readPalette();
    const mo = new MutationObserver(readPalette);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-age-style"] });

    const ps: P[] = [];
    let raf = 0, last = 0, lx = -1, ly = -1, carry = 0;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const spawn = (x: number, y: number, dx: number, dy: number, burst = false) => {
      if (ps.length >= MAX_PARTICLES) ps.splice(0, ps.length - MAX_PARTICLES + 1);
      const r = Math.random();
      const kind: Kind = burst ? (r < 0.45 ? "dot" : r < 0.75 ? "spark" : r < 0.92 ? "dash" : "ring") : (r < 0.62 ? "dot" : r < 0.8 ? "spark" : r < 0.94 ? "dash" : "ring");
      const ang = burst ? rnd(0, Math.PI * 2) : Math.atan2(-dy, -dx) + rnd(-0.9, 0.9); // за курсором, в сторону, обратную движению
      const sp = burst ? rnd(1.2, 3.6) : rnd(0.15, 1.1);
      ps.push({
        x: x + rnd(-4, 4), y: y + rnd(-4, 4), vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp + (burst ? 0 : rnd(-0.1, 0.25)),
        life: 0, max: burst ? rnd(500, 900) : rnd(380, 820),
        size: kind === "dot" ? rnd(1, 3.6) : kind === "spark" ? rnd(3, 6.5) : kind === "dash" ? rnd(5, 11) : rnd(3, 6),
        kind, color: Math.floor(rnd(0, palette.length)), rot: rnd(0, Math.PI), vr: rnd(-0.01, 0.01),
      });
    };

    const frame = (t: number) => {
      const dt = Math.min(t - last, 50); last = t;
      ctx.clearRect(0, 0, w, h);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life += dt;
        if (p.life >= p.max) { ps.splice(i, 1); continue; }
        const k = p.life / p.max, a = 1 - k * k;
        p.x += p.vx * dt * 0.06; p.y += p.vy * dt * 0.06; p.vx *= 0.985; p.vy *= 0.985; p.rot += p.vr * dt;
        const col = palette[p.color];
        ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.fillStyle = col;
        if (p.kind === "dot") {
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 - k * 0.5), 0, Math.PI * 2); ctx.fill();
        } else if (p.kind === "ring") {
          ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (0.6 + k), 0, Math.PI * 2); ctx.stroke();
        } else if (p.kind === "dash") {
          ctx.lineWidth = 1.6; ctx.lineCap = "round"; const c = Math.cos(p.rot) * p.size * 0.5, s = Math.sin(p.rot) * p.size * 0.5;
          ctx.beginPath(); ctx.moveTo(p.x - c, p.y - s); ctx.lineTo(p.x + c, p.y + s); ctx.stroke();
        } else { // искорка: крестик
          ctx.lineWidth = 1.5; ctx.lineCap = "round"; const s = p.size * (1 - k * 0.4);
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.stroke(); ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      raf = ps.length && !document.hidden ? requestAnimationFrame(frame) : 0; // нет частиц — цикл засыпает
    };
    const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (lx >= 0) {
        const dx = e.clientX - lx, dy = e.clientY - ly, dist = Math.hypot(dx, dy);
        carry += Math.min(dist, 90); // защита от всплеска сотен частиц после «прыжка» курсора
        while (carry >= 9) { carry -= 9; spawn(e.clientX, e.clientY, dx, dy); }
        if (dist > 0) wake();
      }
      lx = e.clientX; ly = e.clientY;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      for (let i = 0; i < 16; i++) spawn(e.clientX, e.clientY, 0, 0, true); // «поп» при клике
      wake();
    };
    const onLeave = () => { lx = ly = -1; };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf); mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="cursor-trail" aria-hidden="true" />;
}
