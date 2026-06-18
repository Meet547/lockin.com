import sharp from "sharp";
import { mkdirSync } from "fs";
import { join } from "path";

const OUT = join(process.cwd(), "extension/icons");
mkdirSync(OUT, { recursive: true });

// LOCKIN lock mark — black rounded square with white lock glyph
const svg = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="5" fill="#000000"/>
  <path d="M7 10.5V8.5a5 5 0 0 1 10 0v2" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round"/>
  <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="#ffffff" stroke-width="1.7"/>
  <circle cx="12" cy="15" r="1.5" fill="#ffffff"/>
</svg>`;

const sizes = [16, 32, 48, 128];
for (const s of sizes) {
  await sharp(Buffer.from(svg(s))).png().toFile(join(OUT, `icon-${s}.png`));
  console.log(`generated icon-${s}.png`);
}
