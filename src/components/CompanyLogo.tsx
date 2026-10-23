import type { Company } from "../data/experience";

/** Логотип компании в обеих темах; нужная версия показывается через CSS по data-theme. */
export function CompanyLogo({ company, size = 360 }: { company: Company; size?: number }) {
  const base = `logos/co/${company.logo}`;
  return (
    <>
      <img className="co-img co-img-light" src={`${base}-light.webp`} alt={`Логотип: ${company.name}, ${company.tagline}`} width={size} height={size} loading="lazy" decoding="async" draggable={false} />
      <img className="co-img co-img-dark" src={`${base}-dark.webp`} alt="" aria-hidden="true" width={size} height={size} loading="lazy" decoding="async" draggable={false} />
    </>
  );
}
