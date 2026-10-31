/**
 * Sets <html lang="ar"> on exported pages whose content is Arabic.
 *
 * Only the root layout renders <html>, and it cannot see which post is being
 * rendered beneath it, so the document-level lang would otherwise say "en" on
 * every Arabic post. The post component is the single source of truth: it emits
 * "inLanguage":"ar" in its BlogPosting JSON-LD, and that is what we match on.
 *
 * `dir` is deliberately left alone — the article already sets its own, and
 * putting dir="rtl" on <html> would flip the header, footer and nav too.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");
const MARKER = '"inLanguage":"ar"';

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

let patched = 0;

for await (const file of htmlFiles(OUT_DIR)) {
  const html = await readFile(file, "utf-8");
  if (!html.includes(MARKER) || !html.includes('<html lang="en"')) continue;

  await writeFile(file, html.replace('<html lang="en"', '<html lang="ar"'));
  console.log(`  lang="ar" → ${path.relative(OUT_DIR, file)}`);
  patched += 1;
}

console.log(`Arabic lang patch: ${patched} page${patched === 1 ? "" : "s"}`);
