// Логотипы компаний: JPG 1024x1024 из архива -> WebP 720x720. Запуск: node scripts/logos.mjs <папка_с_jpg>
import sharp from "sharp";
import { join } from "node:path";
const dir = process.argv[2];
if (!dir) { console.error("Использование: node scripts/logos.mjs <папка_с_jpg>"); process.exit(1); }
for (const name of ["alexander", "autoimport", "sns"]) {
  for (const theme of ["light", "dark"]) {
    const out = join("public/logos/co", `${name}-${theme}.webp`);
    await sharp(join(dir, `${name}-${theme}.jpg`)).resize(720, 720).webp({ quality: 88 }).toFile(out);
    console.log("ok", out);
  }
}
