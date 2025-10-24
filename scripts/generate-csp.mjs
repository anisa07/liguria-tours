// scripts/generate-csp.mjs
import "dotenv/config";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import process from "node:process";
import cfg from "./csp.config.mjs";

const DIST_DIR = "dist";
const REPORT_ONLY = process.env.CSP_REPORT_ONLY === "1";

// ---- helpers ----
function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// HTML entity decode (minimal) for attribute values
function htmlDecode(str) {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Find inline event handler attributes like onclick="..."
// Note: we ignore <script src=...> etc. We only care about attributes on elements.
function extractEventHandlerCodes(html) {
  const codes = [];
  // Matches on<name>="..."; tolerant of single/double quotes
  const re = /\s(on[a-z]+)\s*=\s*("([^"]*)"|'([^']*)')/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[3] ?? m[4] ?? "";
    const code = htmlDecode(raw).trim();
    if (code) codes.push(code);
  }
  return codes;
}

function extractInlineScripts(html) {
  const blocks = [];
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const code = (m[1] || "").trim();
    if (code) blocks.push(code);
  }
  return blocks;
}

function sha256Csp(code) {
  const h = crypto.createHash("sha256").update(code).digest("base64");
  return `'sha256-${h}'`;
}

function joinSources(selfFirst, ...lists) {
  const set = new Set();
  if (selfFirst) set.add("'self'");
  for (const list of lists) for (const item of list || []) set.add(item);
  return [...set].join(" ");
}

// ---- collect inline script hashes ----
const files = walk(DIST_DIR).filter((p) => p.endsWith(".html"));
const hashSet = new Set();
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  for (const code of extractInlineScripts(html)) hashSet.add(sha256Csp(code));
}
// ---- collect inline event handler hashes (onclick=, onload=, etc.) ----
const evtHashSet = new Set();
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  for (const code of extractEventHandlerCodes(html)) {
    const h = crypto.createHash("sha256").update(code).digest("base64");
    evtHashSet.add(`'sha256-${h}'`);
  }
}

const EVT_HASHES = [...evtHashSet].sort();
const HASHES = [...hashSet].sort();

// ---- build directives from config arrays (+ optional JSON env overrides) ----
// const SCRIPT_SRC = joinSources(true, cfg.scriptSrc, HASHES);
// before: const SCRIPT_SRC = joinSources(true, cfg.scriptSrc, JSON_SCRIPT, HASHES);
const SCRIPT_SRC = joinSources(
  true,
  ["'unsafe-hashes'"], // <-- allow hashes to apply to event handlers
  cfg.scriptSrc,
  HASHES,
  EVT_HASHES // <-- add attribute-code hashes
);
const CONNECT_SRC = joinSources(true, cfg.connectSrc);
const IMG_SRC = joinSources(true, cfg.imgSrc, ["https:", "data:", "blob:"]);
const FRAME_SRC = joinSources(false, cfg.frameSrc);
const FORM_ACTION = joinSources(true, cfg.formAction);
const FONT_SRC = joinSources(true, ["https:", "data:"]);
const STYLE_SRC = cfg.styleUnsafeInline ? `'self' 'unsafe-inline'` : `'self'`;

// ---- compose CSP ----
const parts = [
  `default-src 'self'`,
  `script-src ${SCRIPT_SRC}`,
  `style-src ${STYLE_SRC}`,
  `img-src ${IMG_SRC}`,
  `font-src ${FONT_SRC}`,
  `connect-src ${CONNECT_SRC}`,
  `frame-src ${FRAME_SRC}`,
  `form-action ${FORM_ACTION}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
];
if (cfg.extraDirectives?.length) parts.push(...cfg.extraDirectives);
if (cfg.addWorkerSrc) parts.push(`worker-src 'self' blob:`);
if (cfg.addManifestSrc) parts.push(`manifest-src 'self'`);

const CSP = parts.join("; ") + ";";

// ---- write dist/_headers ----
const headersPath = path.join(DIST_DIR, "_headers");
const headerName = REPORT_ONLY
  ? "Content-Security-Policy-Report-Only"
  : "Content-Security-Policy";
const headers =
  `/*\n` +
  `  ${headerName}: ${CSP}\n` +
  `  Referrer-Policy: strict-origin-when-cross-origin\n` +
  `  X-Content-Type-Options: nosniff\n` +
  `  X-Frame-Options: DENY\n` +
  `  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)\n` +
  `  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload\n` +
  `  Cross-Origin-Opener-Policy: same-origin\n` +
  `  Cross-Origin-Resource-Policy: same-origin\n`;

fs.writeFileSync(headersPath, headers, "utf8");
