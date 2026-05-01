import sharp from "sharp";
import fs from "fs";
import path from "path";

const dirs = ["src/assets", "public/colors", "public/images"];
const skip = new Set(["404-bouquet.png", "charls-logo.png"]); // keep PNG (transparency-critical or external refs)

let converted = 0, skipped = 0, savedBytes = 0;

async function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) { await processDir(full); continue; }
    if (!entry.toLowerCase().endsWith(".png")) continue;
    if (skip.has(entry)) { skipped++; continue; }
    const out = full.replace(/\.png$/i, ".webp");
    if (fs.existsSync(out)) {
      // webp already exists; just delete the PNG
      const sz = fs.statSync(full).size;
      fs.unlinkSync(full);
      savedBytes += sz;
      converted++;
      continue;
    }
    try {
      const inputBuf = fs.readFileSync(full);
      await sharp(inputBuf).webp({ quality: 82, effort: 5 }).toFile(out);
      const oldSize = fs.statSync(full).size;
      const newSize = fs.statSync(out).size;
      savedBytes += (oldSize - newSize);
      fs.unlinkSync(full);
      converted++;
      if (converted % 20 === 0) console.log(`  ...${converted} converted`);
    } catch (e) {
      console.error("FAIL", full, e.message);
    }
  }
}

for (const d of dirs) {
  console.log(`Processing ${d}...`);
  await processDir(d);
}

console.log(`\n✅ Converted: ${converted} files`);
console.log(`⏭  Skipped: ${skipped}`);
console.log(`💾 Saved: ${(savedBytes / 1024 / 1024).toFixed(1)} MB`);
