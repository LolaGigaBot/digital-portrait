import { CONTACT, PROJECTS, SOCIALS, type ContactItem } from "../data/links";
import { SectionHead } from "./SectionHead";
import { COPY } from "../data/copy";
import type { Theme } from "./ThemeFlag";

const show = <T extends { placeholder: boolean }>(xs: T[]) => xs.filter((x) => import.meta.env.DEV || !x.placeholder);

/** Адрес ссылки и текст для показа, собранные из значения контакта выбранной темы. */
function resolve(item: ContactItem, theme: Theme): { href: string; text: string } {
  const v = item.value[theme].trim();
  const handle = v.replace(/^@/, "");
  if (item.kind === "email") return { href: `mailto:${v}`, text: v };
  if (item.kind === "telegram") return { href: `https://t.me/${handle}`, text: `@${handle}` };
  return { href: `https://github.com/${handle}`, text: handle };
}

export function LinksProjects({ theme }: { theme: Theme }) {
  const socials = show(SOCIALS);
  const projects = show(PROJECTS);
  const contact = show([CONTACT])[0];
  if (!socials.length && !projects.length && !contact) return null; // в публичной сборке пустые блоки скрыты

  const renderLink = (item: ContactItem, primary: boolean) => {
    const { href, text } = resolve(item, theme);
    const external = item.kind !== "email";
    return (
      <li key={item.id}>
        <a className={`btn${primary ? "" : " ghost"} contact-link`} href={href} {...(external ? { target: "_blank", rel: "me noopener noreferrer" } : {})}>
          <span className="contact-label">{item.label}</span>
          <span className="contact-value">{text}</span>
          {item.placeholder && <span className="tag">заполнитель</span>}
        </a>
      </li>
    );
  };

  return (
    <section className="section" aria-labelledby="links-title" id="links">
      <SectionHead {...COPY.links} titleId="links-title" />
      {(contact || socials.length > 0) && (
        <ul className="link-row">
          {contact && renderLink(contact, true)}
          {socials.map((s) => renderLink(s, false))}
        </ul>
      )}
      {projects.length > 0 && (
        <ul className="projects">
          {projects.map((p) => (
            <li key={p.id} className="project">
              <div className="project-cover">
                <img className="pj-img pj-img-light" src={`projects/${p.image}-light.webp`} alt={p.imageAlt} width={1100} height={733} loading="lazy" decoding="async" draggable={false} />
                <img className="pj-img pj-img-dark" src={`projects/${p.image}-dark.webp`} alt="" aria-hidden="true" width={1100} height={733} loading="lazy" decoding="async" draggable={false} />
              </div>
              <div className="project-body">
                <p className="eyebrow">{p.kicker}</p>
                <h3>{p.title}{p.placeholder && <span className="tag">заполнитель</span>}</h3>
                <p>{p.text}</p>
                {p.tech.length > 0 && <ul className="chips" aria-label="Технологии">{p.tech.map((t) => <li key={t} className="chip">{t}</li>)}</ul>}
                <p className="project-date">{p.date}</p>
                {(p.demo || p.repo) && (
                  <p className="project-links">
                    {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer">Демо</a>}
                    {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer">Репозиторий</a>}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

