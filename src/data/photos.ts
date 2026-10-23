export type Photo = { src: string; alt: string };

/** Ник под портретом: в светлой и тёмной теме разные. */
export const NICKS = { light: "LolaGigaBot", dark: "installNabludatel" } as const;

/** Фото карусели. Для каждой темы — свой набор (WebP с прозрачным фоном, 900x1200). Номер файла = порядок показа. */
export const PHOTOS: { light: Photo[]; dark: Photo[]; width: number; height: number } = {
  light: [
    { src: "photos/light-1.webp", alt: "Дмитрий с рыжими волосами в светлом пиджаке и белой футболке" },
    { src: "photos/light-2.webp", alt: "Дмитрий с рыжими волосами в светлой водолазке" },
    { src: "photos/light-3.webp", alt: "Дмитрий с рыжими волосами и бородой, улыбается, в светлой рубашке-поло" },
  ],
  dark: [
    { src: "photos/dark-1.webp", alt: "Дмитрий с тёмными волосами в чёрном пиджаке" },
    { src: "photos/dark-2.webp", alt: "Дмитрий с тёмными волосами в чёрной толстовке с капюшоном" },
    { src: "photos/dark-3.webp", alt: "Дмитрий с тёмными волосами в чёрной водолазке" },
  ],
  width: 900,
  height: 1200,
};
