import type { Company } from "../data/experience";
import { CompanyLogo } from "./CompanyLogo";
import { CaseScene } from "./CaseScene";

export function CompanyDetail({ company, onClose, closeRef }: { company: Company; onClose: () => void; closeRef: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <article className="detail" role="region" aria-labelledby="detail-title" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <button ref={closeRef} type="button" className="detail-close" onClick={onClose} aria-label="Закрыть подробности">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
      </button>
      <div className="detail-side">
        <div className="detail-logo"><CompanyLogo company={company} size={360} /></div>
        <CaseScene company={company} />
      </div>
      <div className="detail-body">
        <h3 id="detail-title">{company.name}</h3>
        <p className="detail-tagline">{company.tagline}</p>
        <dl>
          <div><dt>Должность</dt><dd>{company.role}</dd></div>
          <div><dt>Период</dt><dd>{company.periodLabel}</dd></div>
        </dl>
        <p className="detail-lead">{company.lead}</p>
        <p className="detail-intro">{company.intro}</p>
        <h4>Кейсы</h4>
        <ol className="cases">
          {company.cases.map((c, i) => (
            <li key={c.title} className="case">
              <span className="case-num" aria-hidden="true">кейс {String(i + 1).padStart(2, "0")}</span>
              <h5>{c.title}</h5>
              <p>{c.text}</p>
            </li>
          ))}
        </ol>
        <h4>{company.extra.title}</h4>
        {company.extra.text.map((p) => <p key={p} className="detail-intro">{p}</p>)}
        <h4>Технологии и инструменты</h4>
        <ul className="chips" aria-label="Технологии и инструменты">
          {company.tech.map((t) => <li key={t} className="chip">{t}</li>)}
        </ul>
      </div>
    </article>
  );
}
