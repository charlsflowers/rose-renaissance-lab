import fs from "fs";
import path from "path";

// Build set of converted basenames (we know they exist as .webp now)
const converted = new Set();
function scan(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir)) {
    const f = path.join(dir, e);
    if (fs.statSync(f).isDirectory()) { scan(f); continue; }
    if (e.endsWith(".webp")) converted.add(e.replace(/\.webp$/, ""));
  }
}
scan("src/assets"); scan("public/colors"); scan("public/images");

const skipKept = new Set(["404-bouquet", "charls-logo"]); // still PNG

let filesChanged = 0, replacements = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir)) {
    const f = path.join(dir, e);
    const s = fs.statSync(f);
    if (s.isDirectory()) {
      if (e === "node_modules" || e === ".git" || e === "dist") continue;
      walk(f);
      continue;
    }
    if (!/\.(tsx?|jsx?|css|html|mjs)$/.test(e)) continue;
    let txt = fs.readFileSync(f, "utf8");
    const orig = txt;
    // Replace .png references whose basename is in the converted set
    txt = txt.replace(/([\w./@\-]+?)\.png\b/g, (m, p1) => {
      const base = p1.split("/").pop();
      if (skipKept.has(base)) return m;
      if (converted.has(base)) { replacements++; return `${p1}.webp`; }
      return m;
    });
    if (txt !== orig) {
      fs.writeFileSync(f, txt);
      filesChanged++;
    }
  }
}
walk("src");
walk("public");
walk("scripts");
walk("index.html"); // it's a file, but walk expects dir; handle separately

// index.html
const idx = "index.html";
if (fs.existsSync(idx)) {
  let txt = fs.readFileSync(idx, "utf8");
  const orig = txt;
  txt = txt.replace(/([\w./@\-]+?)\.png\b/g, (m, p1) => {
    const base = p1.split("/").pop();
    if (skipKept.has(base)) return m;
    if (converted.has(base)) { replacements++; return `${p1}.webp`; }
    return m;
  });
  if (txt !== orig) { fs.writeFileSync(idx, txt); filesChanged++; }
}
console.log(`Files changed: ${filesChanged}, replacements: ${replacements}`);
