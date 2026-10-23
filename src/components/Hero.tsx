import { PhotoCarousel } from "./PhotoCarousel";
import { SITE } from "../config/site";
import { COPY } from "../data/copy";
import { COMPANIES } from "../data/experience";
import { getAge, experienceMonths, formatExperience, yearWord } from "../lib/age";
import type { Theme } from "./ThemeFlag";

export function Hero({ theme, now }: { theme: Theme; now: Date }) {
  const age = getAge(now);
  const exp = formatExperience(experienceMonths(COMPANIES, now)); // по фактическим периодам работы
  const [a, b, c] = COPY.hero.title;
  return (
    <section className="hero section" aria-labelledby="hero-title">
      <div className="hero-text">
        <p className="eyebrow">{COPY.hero.eyebrow}</p>
        <h1 id="hero-title" className="display hero-title">
          <span>{a}</span><br /><span>{b}</span><br />
          <span className="accent squiggle-wrap">{c}
            <svg className="squiggle" viewBox="0 0 320 22" preserveAspectRatio="none" aria-hidden="true"><path d="M3 13 C 23 1, 43 1, 63 13 S 103 25, 123 13 S 163 1, 183 13 S 223 25, 243 13 S 283 1, 317 11" /></svg>
          </span>
        </h1>
        <div className="hero-copy">
          <p>Всем привет! Меня зовут {SITE.name}, мне {age} {yearWord(age)}.</p>
          <p>Сейчас я работаю системным администратором. По образованию — программист компьютерных систем. Мой опыт в IT — {exp}.</p>
          <p>Я создал эту страницу как своё резюме и памятник в цифровом пространстве. Здесь можно познакомиться с моим опытом, навыками, проектами и профессиональным путём.</p>
        </div>
      </div>
      <div className="hero-photo">
<PhotoCarousel theme={theme} />
      </div>
    </section>
  );
}


