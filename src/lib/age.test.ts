import { describe, expect, it } from "vitest";
import { getAge, experienceMonths, formatExperience, getStageIndex, isStyleUnlocked, resolveStyle, unlockDate, yearWord, getExactAge } from "./age";
import { COMPANIES } from "../data/experience";

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day, 12);

describe("возраст", () => {
  it("22.10.2026 — 26 лет", () => expect(getAge(d(2026, 10, 22))).toBe(26));
  it("29.10.2026 — ещё 26", () => expect(getAge(d(2026, 10, 29))).toBe(26));
  it("30.10.2026 — уже 27", () => expect(getAge(d(2026, 10, 30))).toBe(27));
  it("дробный возраст растёт внутри года", () => {
    const a = getExactAge(d(2026, 10, 22));
    expect(a).toBeGreaterThan(26.9);
    expect(a).toBeLessThan(27);
  });
});

describe("стаж и склонения", () => {
  it("по резюме на 03.09.2026 — 3 года 4 месяца (40 мес.)", () => {
    expect(experienceMonths(COMPANIES, d(2026, 9, 3))).toBe(40);
    expect(formatExperience(40)).toBe("3 года 4 месяца");
  });
  it("после окончания последней работы стаж не растёт", () => {
    expect(experienceMonths(COMPANIES, d(2027, 6, 1))).toBe(40);
    expect(experienceMonths(COMPANIES, d(2030, 1, 1))).toBe(40);
  });
  it("до первой работы — 0, в декабре 2025 — 2 года 8 месяцев (общий месяц считается один раз)", () => {
    expect(experienceMonths(COMPANIES, d(2023, 4, 30))).toBe(0);
    expect(experienceMonths(COMPANIES, d(2025, 12, 1))).toBe(32);
    expect(formatExperience(32)).toBe("2 года 8 месяцев");
  });
  it("незавершённый период идёт до текущего месяца", () => {
    expect(experienceMonths([{ start: { year: 2026, month: 1 }, end: null }], d(2026, 3, 15))).toBe(3);
  });
  it("формат стажа", () => {
    expect(formatExperience(0)).toBe("0 месяцев");
    expect(formatExperience(1)).toBe("1 месяц");
    expect(formatExperience(5)).toBe("5 месяцев");
    expect(formatExperience(12)).toBe("1 год");
    expect(formatExperience(13)).toBe("1 год 1 месяц");
    expect(formatExperience(24)).toBe("2 года");
    expect(formatExperience(11)).toBe("11 месяцев");
  });
  it("год/года/лет", () => {
    const w = (n: number) => `${n} ${yearWord(n)}`;
    expect(w(1)).toBe("1 год");
    expect(w(4)).toBe("4 года");
    expect(w(5)).toBe("5 лет");
    expect(w(11)).toBe("11 лет");
    expect(w(21)).toBe("21 год");
    expect(w(26)).toBe("26 лет");
    expect(w(27)).toBe("27 лет");
    expect(w(32)).toBe("32 года");
    expect(w(112)).toBe("112 лет");
  });
});

describe("возрастные стили", () => {
  it("сейчас доступен только первый", () => {
    const age = getAge(d(2026, 10, 22));
    expect(isStyleUnlocked("free", age)).toBe(true);
    expect(isStyleUnlocked("mature", age)).toBe(false);
    expect(isStyleUnlocked("formal", age)).toBe(false);
  });
  it("второй открывается 30.10.2029, не раньше", () => {
    expect(getStageIndex(getAge(d(2029, 10, 29)))).toBe(0);
    expect(getStageIndex(getAge(d(2029, 10, 30)))).toBe(1);
  });
  it("третий открывается 30.10.2049, не раньше", () => {
    expect(getStageIndex(getAge(d(2049, 10, 29)))).toBe(1);
    expect(getStageIndex(getAge(d(2049, 10, 30)))).toBe(2);
  });
  it("даты открытия", () => {
    expect(unlockDate("mature").getFullYear()).toBe(2029);
    expect(unlockDate("formal").getFullYear()).toBe(2049);
  });
  it("недоступный сохранённый выбор заменяется доступным", () => {
    expect(resolveStyle("formal", 26)).toBe("free");
    expect(resolveStyle("junk", 26)).toBe("free");
    expect(resolveStyle(null, 30)).toBe("mature");
    expect(resolveStyle("free", 30)).toBe("free");
    expect(resolveStyle("mature", 52)).toBe("mature");
  });
});
