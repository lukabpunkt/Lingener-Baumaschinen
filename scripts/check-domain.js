#!/usr/bin/env node
/* Build-Check (Launch-Audit B-1): verhindert, dass eine Seite unter der konfigurierten
   Domain auf eine andere Domain kanonisiert. Läuft nach jedem Build (npm run build) —
   auf Netlify schlägt der Deploy fehl, bevor ein falscher Stand live geht.
   Prüft in _site:
   1. Wenn SITE_URL/URL von der Referenz-Domain abweicht: kein https://<Referenz> mehr in HTML/XML/TXT.
   2. Jede HTML-Seite hat höchstens ein <link rel="canonical">, und es beginnt mit site.url.
   3. Nicht-404-Seiten ohne noindex haben genau ein Canonical. */
'use strict';
const fs = require('fs');
const path = require('path');
const site = require('../src/_data/site.js');

const root = path.join(__dirname, '..', '_site');
const errors = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'assets' ? [] : walk(p);
    return /\.(html|xml|txt)$/.test(e.name) ? [p] : [];
  });
}

const files = walk(root);
for (const file of files) {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');

  if (site.url !== site.referenceUrl && text.includes(site.referenceUrl)) {
    const n = text.split(site.referenceUrl).length - 1;
    errors.push(`${rel}: ${n}× ${site.referenceUrl} statt ${site.url}`);
  }

  if (file.endsWith('.html')) {
    const canon = [...text.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
    const isNoindex = /<meta name="robots" content="noindex/.test(text);
    if (canon.length > 1) errors.push(`${rel}: ${canon.length} Canonicals`);
    canon.forEach((c) => { if (!c.startsWith(site.url + '/')) errors.push(`${rel}: Canonical ${c} passt nicht zu ${site.url}`); });
    if (!canon.length && !isNoindex && !/404\.html$/.test(rel)) errors.push(`${rel}: kein Canonical`);
  }
}

if (errors.length) {
  console.error(`\n✗ check-domain: ${errors.length} Problem(e) bei site.url = ${site.url}\n  ` + errors.slice(0, 40).join('\n  '));
  process.exit(1);
}
console.log(`✓ check-domain: ${files.length} Dateien geprüft — site.url = ${site.url}${site.noindex ? ' (noindex aktiv)' : ''}`);
