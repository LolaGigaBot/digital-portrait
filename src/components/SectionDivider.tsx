/**
 * Комиксный разделитель между разделами: косая «чернильная» полоса, полутоновая сетка точек и звезда-«взрыв»,
 * которая выскакивает с поворотом, когда разделитель входит в экран (класс .is-in ставит useReveal).
 */
export function SectionDivider() {
  return (
    <div className="divider" aria-hidden="true">
      <span className="div-dots" />
      <span className="div-slash" />
      <span className="div-slash div-slash-2" />
      <svg className="div-burst" viewBox="0 0 100 100">
        <path d="M50 3 L58 28 L82 14 L72 38 L97 44 L74 56 L90 78 L64 72 L58 97 L48 74 L28 92 L33 66 L6 62 L28 50 L10 30 L36 36 Z" />
        <circle cx="50" cy="50" r="7" />
      </svg>
    </div>
  );
}
