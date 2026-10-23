import { SITE } from "../config/site";

export type Birth = { year: number; month: number; day: number };

/** Полных лет на дату `now` с учётом месяца и дня рождения. */
export function getAge(now: Date, birth: Birth = SITE.birth): number {
  let age = now.getFullYear() - birth.year;
  const m = now.getMonth() + 1;
  if (m < birth.month || (m === birth.month && now.getDate() < birth.day)) age -= 1;
  return age;
}

/** Дробный возраст (для заполнения полосы): полные годы + доля текущего года жизни. */
export function getExactAge(now: Date, birth: Birth = SITE.birth): number {
  const whole = getAge(now, birth);
  const last = new Date(birth.year + whole, birth.month - 1, birth.day);
  const next = new Date(birth.year + whole + 1, birth.month - 1, birth.day);
  const frac = (now.getTime() - last.getTime()) / (next.getTime() - last.getTime());
  return whole + Math.min(Math.max(frac, 0), 0.9999);
}

type YM = { year: number; month: number };
type Period = { start: YM; end: YM | null };

/**
 * Стаж по фактическим периодам работы: считаются календарные месяцы включительно,
 * пересечения (общий месяц) учитываются один раз, период без конца идёт до текущего месяца.
 * Никакого автоматического прибавления года после окончания занятости.
 */
export function experienceMonths(periods: Period[], now: Date): number {
  const idx = (p: YM) => p.year * 12 + p.month - 1;
  const nowIdx = idx({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const months = new Set<number>();
  for (const p of periods) {
    const last = Math.min(p.end ? idx(p.end) : nowIdx, nowIdx);
    for (let m = idx(p.start); m <= last; m++) months.add(m);
  }
  return months.size;
}

/** Склонение: месяц / месяца / месяцев. */
export function monthWord(n: number): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a >= 11 && a <= 14) return "месяцев";
  if (b === 1) return "месяц";
  if (b >= 2 && b <= 4) return "месяца";
  return "месяцев";
}

/** 40 -> «3 года 4 месяца»; 12 -> «1 год»; 5 -> «5 месяцев». */
export function formatExperience(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${yearWord(years)}`);
  if (months > 0 || years === 0) parts.push(`${months} ${monthWord(months)}`);
  return parts.join(" ");
}

/** Склонение: год / года / лет. */
export function yearWord(n: number): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a >= 11 && a <= 14) return "лет";
  if (b === 1) return "год";
  if (b >= 2 && b <= 4) return "года";
  return "лет";
}

export type AgeStyle = "free" | "mature" | "formal";
export const AGE_STYLES: AgeStyle[] = ["free", "mature", "formal"];

/** Индекс этапа: 0 — до 30, 1 — с 30 до 50, 2 — с 50. Определяется по возрасту, т.е. открывается в день рождения. */
export function getStageIndex(age: number): 0 | 1 | 2 {
  if (age >= SITE.styleUnlockAges[2]) return 2;
  if (age >= SITE.styleUnlockAges[1]) return 1;
  return 0;
}

export function isStyleUnlocked(style: AgeStyle, age: number): boolean {
  return AGE_STYLES.indexOf(style) <= getStageIndex(age);
}

/** Выбор пользователя, если он доступен; иначе стиль текущего этапа. */
export function resolveStyle(saved: string | null, age: number): AgeStyle {
  const s = AGE_STYLES.find((x) => x === saved);
  if (s && isStyleUnlocked(s, age)) return s;
  return AGE_STYLES[getStageIndex(age)];
}

/** Дата открытия стиля (в день рождения соответствующего возраста). */
export function unlockDate(style: AgeStyle, birth: Birth = SITE.birth): Date {
  const i = AGE_STYLES.indexOf(style);
  return new Date(birth.year + SITE.styleUnlockAges[i], birth.month - 1, birth.day);
}

/** Текущая дата; для проверок можно подменить через ?now=YYYY-MM-DD. */
export function getNow(): Date {
  try {
    const p = new URLSearchParams(location.search).get("now");
    if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) {
      const [y, m, d] = p.split("-").map(Number);
      return new Date(y, m - 1, d, 12);
    }
  } catch { /* ignore */ }
  return new Date();
}
