// Конвертирует исходные PNG (с прозрачностью) в WebP 900x1200 для сайта.
// Запуск: npm run photos -- <папка_white> <папка_dark>
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [whiteDir, darkDir] = process.argv.slice(2);
if (!whiteDir || !darkDir) {
  console.error("Использование: npm run photos -- <папка_white> <папка_dark>");
  process.exit(1);
}
mkdirSync("public/photos", { recursive: true });
for (const [theme, dir] of [["light", whiteDir], ["dark", darkDir]]) {
  const prefix = theme === "light" ? "white" : "dark";
  for (const n of [1, 2, 3]) {
    const out = join("public/photos", `${theme}-${n}.webp`);
    await sharp(join(dir, `${n}_${prefix}.png`)).resize(900, 1200, { fit: "cover" }).webp({ quality: 86, alphaQuality: 95 }).toFile(out);
    console.log("ok", out);
  }
}
