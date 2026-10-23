// Обложки проектов: 4 картинки (2 проекта x 2 темы) -> WebP шириной 1100px.
// Запуск: node scripts/projects.mjs <папка_с_картинками>   (файлы 20..23.webp, карта ниже)
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) { console.error("Использование: node scripts/projects.mjs <папка>"); process.exit(1); }

// номер файла -> [проект, тема]
const MAP = {
  20: ["soon", "dark"],       // Проект 02, Coming soon, тёмная
  21: ["soon", "light"],      // Проект 02, Coming soon, светлая
  22: ["portrait", "light"],  // Проект 01, Цифровой портрет, светлая
  23: ["portrait", "dark"],   // Проект 01, Цифровой портрет, тёмная
};

mkdirSync("public/projects", { recursive: true });
for (const [n, [project, theme]] of Object.entries(MAP)) {
  const out = join("public/projects", `${project}-${theme}.webp`);
  await sharp(join(dir, `${n}.webp`)).resize({ width: 1100 }).webp({ quality: 84 }).toFile(out);
  console.log("ok", out);
}
