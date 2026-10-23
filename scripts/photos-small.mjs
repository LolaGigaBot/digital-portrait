import sharp from "sharp";
for (const set of ["light", "dark"]) for (const n of [1, 2, 3]) {
  await sharp(`public/photos/${set}-${n}.webp`).resize(480, 640).webp({ quality: 80, alphaQuality: 90 }).toFile(`public/photos/${set}-${n}-480.webp`);
}
console.log("ok");
