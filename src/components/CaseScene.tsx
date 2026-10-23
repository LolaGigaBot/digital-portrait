import type { Company } from "../data/experience";

/** Иллюстрация-сцена карточки: версия под текущую тему показывается через CSS по data-theme (как логотип). */
export function CaseScene({ company }: { company: Company }) {
  const base = `scenes/${company.id}`;
  return (
    <figure className="scene">
      <div className="scene-art">
        <img className="scene-img scene-img-light" src={`${base}-light.webp`} alt={company.sceneAlt} width={720} height={720} loading="lazy" decoding="async" draggable={false} />
        <img className="scene-img scene-img-dark" src={`${base}-dark.webp`} alt="" aria-hidden="true" width={720} height={720} loading="lazy" decoding="async" draggable={false} />
      </div>
    </figure>
  );
}
