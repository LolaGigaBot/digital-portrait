// Иконки навыков: PNG 256x256 (по теме) -> круглый WebP 192x192 с прозрачными углами.
// Запуск: node scripts/skills.mjs <папка_архива>   (внутри папки light/ и dark/)
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) { console.error("Использование: node scripts/skills.mjs <папка_архива>"); process.exit(1); }

// id навыка на сайте -> имя файла в архиве
const ICONS = {
  "windows-server": "windows-server",
  linux: "linux",
  arch: "arch-linux",
  ubuntu: "ubuntu",
  debian: "debian",
  powershell: "powershell",
  bash: "bash",
  python: "python",
  apache: "apache",
  docker: "docker",
  wine: "wine",
  "active-directory": "active-directory",
  "microsoft-exchange": "microsoft-exchange",
  zabbix: "zabbix",
  wordpress: "wordpress",
  chatgpt: "chatgpt",
  "claude-code": "claude-code",
  codex: "codex",
};

const SIZE = 192;
const circle = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="#fff"/></svg>`);

mkdirSync("public/skills", { recursive: true });
for (const [id, file] of Object.entries(ICONS)) {
  for (const theme of ["light", "dark"]) {
    const out = join("public/skills", `${id}-${theme}.webp`);
    await sharp(join(dir, theme, `${file}.png`))
      .resize(SIZE, SIZE)
      .ensureAlpha()
      .composite([{ input: circle, blend: "dest-in" }])
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(out);
    console.log("ok", out);
  }
}
