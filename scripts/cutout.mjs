// Вырезает белый фон у портрета (заливка от краёв) и сохраняет WebP 900x1200 с прозрачностью.
// Запуск: node scripts/cutout.mjs <вход> <выход.webp>
import sharp from "sharp";
const [inp, out] = process.argv.slice(2);
const { data, info } = await sharp(inp).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const minC = (i) => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
const clear = new Uint8Array(w * h);
const stack = [];
const push = (x, y) => { const i = y * w + x; if (!clear[i] && minC(i) >= 244) { clear[i] = 1; stack.push(i); } };
for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
while (stack.length) {
  const i = stack.pop(), x = i % w, y = (i / w) | 0;
  if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1);
}
for (let i = 0; i < w * h; i++) {
  if (clear[i]) { data[i * 4 + 3] = 0; continue; }
  const x = i % w, y = (i / w) | 0;
  const near = (x > 0 && clear[i - 1]) || (x < w - 1 && clear[i + 1]) || (y > 0 && clear[i - w]) || (y < h - 1 && clear[i + w]);
  if (near && minC(i) > 205) data[i * 4 + 3] = Math.round(((255 - minC(i)) / 50) * 255);
}
await sharp(data, { raw: { width: w, height: h, channels: 4 } }).resize(900, 1200, { fit: "cover" }).webp({ quality: 86, alphaQuality: 95 }).toFile(out);
console.log("ok", out);
