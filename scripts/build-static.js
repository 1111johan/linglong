const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");
const files = [
  "index.html",
  "product.html",
  "solutions.html",
  "scenarios.html",
  "advantages.html",
  "science.html",
  "cooperation.html",
  "download.html",
  "about.html",
  "contact.html",
  "qualification.html",
  "workflow.html",
  "styles.css",
  "script.js",
];
const dirs = ["assets"];

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(outDir, file));
}

for (const dir of dirs) {
  fs.cpSync(path.join(root, dir), path.join(outDir, dir), { recursive: true });
}

console.log(`Static site copied to ${path.relative(root, outDir)}`);
