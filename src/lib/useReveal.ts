import { useEffect } from "react";
import { prefersReducedMotion } from "./storage";

/**
 * Появление разделов при прокрутке: элементам с классами .section и .divider добавляется .is-in,
 * когда они входят в экран. Включается классом `reveal-on` на <html> уже после монтирования, поэтому
 * без JS, при prefers-reduced-motion и до инициализации весь контент виден сразу.
 * Страховка: если наблюдатель по какой-то причине не сработал (старый Safari, очень высокий блок),
 * после остановки прокрутки и через 2,5 с показываем всё, что уже находится в окне.
 */
export function useReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".section, .divider"));
    const show = (el: HTMLElement) => { el.classList.add("is-in"); io.unobserve(el); };
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) show(e.target as HTMLElement); },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    const sweep = () => {
      const vh = window.innerHeight;
      for (const el of targets) {
        if (el.classList.contains("is-in")) continue;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) show(el);
      }
    };
    for (const el of targets) io.observe(el);
    sweep(); // то, что уже на экране при загрузке, показываем сразу без выезда
    root.classList.add("reveal-on");

    let t = 0;
    const onScroll = () => { window.clearTimeout(t); t = window.setTimeout(sweep, 250); };
    window.addEventListener("scroll", onScroll, { passive: true });
    const safety = window.setTimeout(sweep, 2500);
    return () => {
      io.disconnect(); window.clearTimeout(t); window.clearTimeout(safety);
      window.removeEventListener("scroll", onScroll);
      root.classList.remove("reveal-on"); targets.forEach((x) => x.classList.remove("is-in"));
    };
  }, []);
}
