// Renders projects.json into projects.svg — a dark-themed card grid
// matching the profile's blue/navy palette.
const fs = require("fs");
const path = require("path");

const projects = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "projects.json"), "utf8")
);

const CARD_W = 430;
const CARD_H = 150;
const GAP = 20;
const COLS = 2;
const PAD = 20;

const rows = Math.ceil(projects.length / COLS);
const width = PAD * 2 + COLS * CARD_W + (COLS - 1) * GAP;
const height = PAD * 2 + rows * CARD_H + (rows - 1) * GAP;

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// naive word-wrap for the description line into <=2 lines
function wrap(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
    if (lines.length === 2) break;
  }
  if (line && lines.length < 2) lines.push(line.trim());
  return lines.slice(0, 2);
}

let cards = "";
projects.forEach((p, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const x = PAD + col * (CARD_W + GAP);
  const y = PAD + row * (CARD_H + GAP);
  const descLines = wrap(p.description, 52);
  const tech = p.tech.join("   \u00b7   ");

  cards += `
  <g transform="translate(${x},${y})">
    <rect width="${CARD_W}" height="${CARD_H}" rx="10" fill="#0d1b2a" stroke="#1B6FC9" stroke-width="1"/>
    <text x="18" y="30" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="17" font-weight="700" fill="#d9ecff">${esc(p.name)}</text>
    <text x="${CARD_W - 18}" y="30" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="11" fill="#2E9EF7" text-anchor="end">${esc(p.tag)}</text>
    ${descLines
      .map(
        (line, li) =>
          `<text x="18" y="${54 + li * 18}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="12.5" fill="#9fb7cf">${esc(line)}</text>`
      )
      .join("")}
    <text x="18" y="${CARD_H - 16}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="11" fill="#1B6FC9">${esc(tech)}</text>
  </g>`;
});

const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#0a0e17"/>
  ${cards}
</svg>`;

fs.writeFileSync(path.join(__dirname, "..", "projects.svg"), svg);
console.log("projects.svg generated");
