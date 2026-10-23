// Иллюстрации карточек опыта: 6 картинок (по 2 темы для 3 компаний) -> WebP 720px.
// Запуск: node scripts/scenes.mjs <папка_с_картинками>   (файлы 14..19.webp в порядке, описанном в карте ниже)
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) { console.error("Использование: node scripts/scenes.mjs <папка>"); process.exit(1); }

// номер файла -> [компания, тема]
const MAP = {
  14: ["autoimport", "dark"],   // компьютер, тёмный
  15: ["alexander", "light"],   // картриджи, светлый
  16: ["alexander", "dark"],    // картриджи, тёмный
  17: ["sns", "dark"],          // принтер, тёмный
  18: ["autoimport", "light"],  // компьютер, светлый
  19: ["sns", "light"],         // принтер, светлый
};

mkdirSync("public/scenes", { recursive: true });
for (const [n, [company, theme]] of Object.entries(MAP)) {
  const out = join("public/scenes", `${company}-${theme}.webp`);
  await sharp(join(dir, `${n}.webp`)).resize(720, 720, { fit: "inside" }).webp({ quality: 86 }).toFile(out);
  console.log("ok", out);
}
