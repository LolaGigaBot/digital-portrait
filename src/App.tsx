import { useEffect, useMemo, useState } from "react";
import { ThemeFlag, type Theme } from "./components/ThemeFlag";
import { Hero } from "./components/Hero";
import { AgeBar } from "./components/AgeBar";
import { ExperienceRibbon } from "./components/ExperienceRibbon";
import { SkillsHead } from "./components/SkillsHead";
import { Roadmap } from "./components/Roadmap";
import { LinksProjects } from "./components/LinksProjects";
import { COPY } from "./data/copy";
import { SITE } from "./config/site";
import { getAge, getNow, resolveStyle, type AgeStyle } from "./lib/age";
import { read, write } from "./lib/storage";

export default function App() {
  const now = useMemo(getNow, []);
  const age = getAge(now);
  const [theme, setTheme] = useState<Theme>(() => (read("theme") === "dark" ? "dark" : "light"));
  const [style, setStyle] = useState<AgeStyle>(() => resolveStyle(read("ageStyle"), age));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.ageStyle = style;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0c0f12" : "#f6f3ee");
  }, [theme, style]);

  // Шапка с флажком закреплена (sticky): при прокрутке сжимается до компактной полоски.
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const on = () => setStuck(window.scrollY > 100);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const applyTheme = (t: Theme) => { setTheme(t); write("theme", t); };
  const applyStyle = (s: AgeStyle) => { setStyle(s); write("ageStyle", s); };

  return (
    <div className="page">
      <header className={`site-top${stuck ? " is-stuck" : ""}`}>
        <ThemeFlag theme={theme} onChange={applyTheme} />
        <span className="top-caption">{COPY.topCaption}</span>
      </header>
      <main>
        <Hero theme={theme} now={now} />
        <AgeBar now={now} style={style} onStyleChange={applyStyle} />
        <ExperienceRibbon />
        <SkillsHead />
        <Roadmap />
        <LinksProjects theme={theme} />
      </main>
      <footer className="footer">
        <p>© Дмитрий · страница-резюме и цифровой памятник</p>
        <p className="footer-version" title="Версия сайта">v {SITE.version}</p>
      </footer>
    </div>
  );
}

