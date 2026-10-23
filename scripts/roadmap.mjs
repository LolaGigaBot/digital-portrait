// Карточки «Мой путь»: 12 картинок (6 этапов x 2 темы) -> обрезка полей, WebP шириной 1400px.
// Запуск: node scripts/roadmap.mjs <папка_с_картинками>   (файлы 24..35.webp, карта ниже)
// Пишет public/road/step-NN-<light|dark>.webp и src/data/roadmapSizes.json (размеры для width/height).
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) { console.error("Использование: node scripts/roadmap.mjs <папка>"); process.exit(1); }

// номер файла -> [этап, тема]
const MAP = {
  24: ["06", "light"], 25: ["06", "dark"],
  26: ["05", "dark"], 27: ["05", "light"],
  28: ["04", "dark"], 29: ["04", "light"],
  30: ["03", "light"], 31: ["03", "dark"],
  32: ["02", "light"], 33: ["02", "dark"],
  34: ["01", "dark"], 35: ["01", "light"],
};

mkdirSync("public/road", { recursive: true });
const sizes = {};
for (const [n, [step, theme]] of Object.entries(MAP)) {
  const trimmed = await sharp(join(dir, `${n}.webp`)).trim({ threshold: 14 }).toBuffer();
  const out = join("public/road", `step-${step}-${theme}.webp`);
  const info = await sharp(trimmed).resize({ width: 1400 }).webp({ quality: 84 }).toFile(out);
  (sizes[`step-${step}`] ??= {})[theme] = [info.width, info.height];
  console.log("ok", out, `${info.width}x${info.height}`);
}
writeFileSync("src/data/roadmapSizes.json", JSON.stringify(sizes, null, 2) + "\n");
