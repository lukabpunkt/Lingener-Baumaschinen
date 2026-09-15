# LIBA — Lingener Baumaschinen · Website

Corporate Website für **LIBA – Lingener Baumaschinen GmbH & Co. KG**, deutscher Hersteller von Grabenfräsen, Anbaufräsen, Pflügen und Spezialmaschinen in Lingen (Ems).

Statische Site, generiert mit **Eleventy 3**. Zweisprachig DE/EN, 90 Seiten, Zielhosting **Netlify**.

> **Status (2026-09-15):** Gebaut, noch **nicht live**. Strategie: Launch zunächst unter einer **neuen, noch festzulegenden Domain**,
> die WordPress-Seite auf `lingener-baumaschinen.de` bleibt parallel online, später evtl. Umzug auf `.de`.
> Offene Punkte und Umsetzungsstand: **[`Launch-Audit.md`](Launch-Audit.md)** (maßgeblich) ·
> Betreiber-Anleitungen: [`Zulieferungen-Checkliste.md`](Zulieferungen-Checkliste.md).

---

## Entwickeln

```bash
npm ci          # einmalig; einzige devDependency ist @11ty/eleventy
npm start       # lokaler Server mit Live-Reload
npm run build   # statischer Output nach _site/
```

`_site/` und `node_modules/` sind gitignored. Node 24 (wie auf Netlify, siehe `netlify.toml`).

## Projektstruktur

```
src/
├── _data/                  # Datenquellen (JS-Module, global verfügbar)
│   ├── site.js             # langs, Domain (url/noindex/aliasHosts aus Umgebung), GA4-Mess-ID
│   ├── maschinen.js        # 30 Maschinen: slug, name, specs, heroImage, oldUrl
│   ├── maschinenseiten.js  # daraus 60 Seitenobjekte (30 × DE/EN) inkl. schema, ogImage, heroBg
│   ├── labels.js           # DE↔EN-Tabelle für Datenwerte (Kategorie, Zustand)
│   ├── faq.js              # FAQ-Seite: Text und Schema aus einer Quelle
│   ├── maschinenFaq.js     # FAQ der Maschinenübersicht: Text und Schema aus einer Quelle
│   └── redirects.js        # manuelle 301-Regeln der WordPress-Migration
├── _includes/base.njk      # zentrales Layout (Head, Nav, Footer, Consent)
├── maschinen/maschine.njk  # ein Template → 60 Maschinenseiten
├── en/404.njk              # einzige separate EN-Datei (404 kommt ohne Layout aus)
├── *.njk                   # alle übrigen Seiten, je DE + EN
├── _redirects.njk          # generiert _site/_redirects (spezifische Regeln + Splats)
├── assets/                 # css, js, images, fonts (self-hosted)
├── robots.njk · llms.njk · sitemap.njk · site-webmanifest.njk · favicon.ico
scripts/check-domain.js     # Build-Check: keine fremde Domain, Canonicals passen zu site.url
.eleventy.js · netlify.toml · package.json
```

### Datenfluss

```
maschinen.js ──► maschinenseiten.js ──► maschinen/maschine.njk   (60 Seiten)
      │                 ▲
      │                 └─ labels.js (DE↔EN für Kategorie/Zustand)
      └──────────► redirects.js ──► _redirects.njk ──► _site/_redirects
faq.js  ──► faq.njk           (sichtbarer Text UND FAQPage-Schema)
site.js ──► base.njk          (Sprachen; noindex-Schalter; GA4 nur wenn echte Mess-ID gesetzt)
site.js ──► .eleventy.js      (Transform: Referenz-Domain -> site.url in allen HTML/XML/TXT)
```

---

## Konventionen — bitte vor dem ersten Commit lesen

**1 · DE und EN liegen im selben Template.**
Jede Seite paginiert über `site.langs` und schaltet inline um:

```njk
{% if lang == "de" %}Grabenfräse{% else %}Trench cutter{% endif %}
```

Es gibt **keine** separaten EN-Dateien (Ausnahme: `src/en/404.njk`). Wer EN ändert, ändert dieselbe Zeile wie DE — eine vergessene `{% else %}`-Hälfte ist der klassische Fehler hier. Übersetzungen von Datenwerten gehören in `src/_data/labels.js`.

**2 · Keine Inline-Skripte.**
Die CSP in `netlify.toml` setzt `script-src` **ohne** `'unsafe-inline'`. Jedes `<script>…</script>` im Markup bricht die Seite auf Netlify — lokal und auf der GitHub-Pages-Vorschau fällt das nicht auf, weil dort keine Header ausgeliefert werden. Erlaubt sind ausgelagerte Dateien und `<script type="application/ld+json">`. Parameter kommen per `data-`-Attribut (Muster: `data-ga4` am `<body>`, gelesen in `main.js`).
`style-src` behält bewusst `'unsafe-inline'` — `style=`-Attribute sind in Ordnung.

**3 · GA4: Platzhalter + strenger Consent.**
Solange `src/_data/site.js` `G-XXXXXXXXXX` enthält, gibt es weder Google-Markup noch Cookie-Banner noch Footer-Link „Datenschutz-Einstellungen". Mit echter ID lädt `main.js` `gtag.js` **erst nach „Akzeptieren"**; vorher keinerlei Verbindung zu Google. Widerruf löscht die `_ga`-Cookies. Die Datenschutzerklärung beschreibt genau dieses Verhalten — nicht auf Consent-Mode-„Advanced" umbauen, ohne sie anzupassen.

**4 · iOS/WebKit-Falle.**
Eine CSS-Animation auf einem Vorfahren zerstört in WebKit `position: fixed` bei allen Nachfahren. Deshalb liegt `page-enter` auf `<main>`, nicht auf `<body>`; Scroll-Progress, FAB, Cookie-Banner und Drawer sind bewusst direkte Kinder von `<body>`. Diese Struktur nicht umbauen.

**5 · Domain nie fest verdrahten — sie kommt aus der Umgebung.**
Absolute URLs (Canonical, hreflang, og:image, JSON-LD, Sitemap, robots, llms) werden im Quelltext gegen die Referenz-Domain `https://lingener-baumaschinen.de` geschrieben. Die Transform in `.eleventy.js` setzt beim Build `site.url` ein (`SITE_URL` → Netlify-`URL` → Referenz). `npm run build` bricht ab, wenn danach noch eine fremde Domain oder ein unpassendes Canonical im Output steht (`scripts/check-domain.js`). Kanonisch immer apex ohne `www.`.

**5a · Indexierung per Schalter.**
`site.noindex` ist automatisch aktiv für Deploy-Previews/Branch-Deploys und solange die Seite nur unter `*.netlify.app` läuft; zusätzlich per `SITE_NOINDEX=1`. Wirkung: `noindex`-Meta, keine hreflang-Links, leere Sitemap, keine Sitemap-Zeile in robots.txt (bewusst **kein** `Disallow`).

**6 · Die Sitemap pflegt sich selbst.**
`sitemap.njk` nimmt jede Seite mit `canonical` und ohne `noindex`. `noindex: true` im Front-Matter entfernt eine Seite also automatisch auch aus der Sitemap.

**7 · `_redirects` nie von Hand editieren.**
Die Datei wird generiert. Spezifische Regeln gehören nach `src/_data/redirects.js`, Splat-Regeln ans Ende von `src/_redirects.njk`. Host-Weiterleitungen für einen Domain-Umzug kommen aus `SITE_ALIAS_HOSTS` und stehen automatisch **ganz oben**.

**8 · Barrierefreiheit: geschlossen = nicht fokussierbar.**
Drawer, FAB-Menü, Cookie-Banner und Scroll-Top werden im geschlossenen Zustand per `visibility: hidden` aus der Tab-Reihenfolge genommen; Wizard-Schritte per `inert`. Neue Overlays nach demselben Muster bauen. Breakpoint der Navigation ist überall **1100px**.

**9 · Einblend-Animationen brauchen einen No-JS-Fallback.**
`.reveal`/`.mask-line` starten unsichtbar; das `<noscript><style>` in `base.njk` macht sie ohne JavaScript sichtbar. Zähler (`data-count`) tragen den Endwert im HTML.

---

## Formulare

Drei **Netlify Forms** (`data-netlify`, Honeypot, AJAX-POST in `main.js`):

| Name | Seite | Besonderheit |
|---|---|---|
| `kontakt` | `kontakt.njk` | — |
| `gebrauchtmaschine` | `gebrauchtmaschinen.njk` | — |
| `bewerbung` | `karriere.njk` | `multipart/form-data`, PDF-Upload |

DE- und EN-Variante teilen sich jeweils denselben `form-name`, laufen also in denselben Posteingang. **Funktionieren erst auf Netlify** — die Benachrichtigungs-E-Mail muss im Netlify-Dashboard eingerichtet werden.

## Deployment

**Produktion: Netlify.** Build `npm run build`, Publish `_site`, kein `ELEVENTY_PATH_PREFIX` (Domain liegt im Root). 301-Weiterleitungen und Security-Header kommen aus `netlify.toml` bzw. dem generierten `_site/_redirects` — beides kann GitHub Pages systembedingt nicht.

**Domain setzen / umziehen:** in `netlify.toml` unter `[context.production.environment]` `SITE_URL` (und ggf. `SITE_NOINDEX`, `SITE_ALIAS_HOSTS`) eintragen, committen — Netlify baut neu. Die Vorlage steht kommentiert in der Datei. Pretty URLs sind per `netlify.toml` abgeschaltet.

**Keine GitHub-Pages-Vorschau mehr** (Workflow am 2026-09-15 entfernt): Vorschauen laufen als Netlify Deploy Previews und sind automatisch `noindex`.

## Designtokens

Definiert in `src/assets/css/main.css` (`:root`) — dort steht die maßgebliche, vollständige Liste.

| Token | Wert | Bedeutung |
|---|---|---|
| `--brand` | `#0C3352` | Navy (Primärfarbe, seit 2026-08-03; vorher Teal — Rückweg im Kopf von `main.css`) |
| `--brand-deep` | `#09263E` | Dunkles Navy (Hover, Tiefe) |
| `--brand-light` | `#6EC1E4` | Helles Blau — **nur** auf dunklem Grund Textfarbe, auf hellem Grund nur Linie |
| `--accent` | `#F59E0B` | Industrie-Amber (CTAs) |
| `--ink` | `#0B0F14` | Tiefes Schiefer-Schwarz |
| `--canvas` | `#FFFFFF` | Heller Grund |
| `--font-sans` / `--font-display` | Inter | Fließtext **und** Überschriften |
| `--font-serif` | Instrument Serif | kursive Akzente (`.serif-italic`) |

Schriften sind **selbst gehostet** (`src/assets/fonts/`, eingebunden über `assets/css/fonts.css`) — kein Google-Fonts-Request, DSGVO-konform. Eingebunden sind genau drei Familien: Inter, Instrument Serif und JetBrains Mono.

## Weitere Dokumente

| Datei | Inhalt |
|---|---|
| `Launch-Audit.md` | **Maßgeblich:** Launch-Audit 2026-09-15 mit Umsetzungsstand und offenen Punkten |
| `GO-LIVE-Checkliste.md` | Frühere Master-Liste (Stand 2026-08-17, Launch direkt auf .de) — historisch |
| `Zulieferungen-Checkliste.md` | Schritt-für-Schritt-Anleitungen für alle Betreiber-Aufgaben |
| `CLAUDE.md` | Migrations-Handover WordPress → Eleventy, §5 = Redirect-Map |
| `QA-Report.md` · `QA-Prelaunch.md` | QA-Runden 1 und 2 (historische Momentaufnahmen) |
| `Security-Audit.md` | Security-Befunde S-1…S-13 |
| `DE-EN-Parity.md` | Sprachparität DE/EN |
| `Broschuere-Analyse.md` | Korrekturvorlage für die Print-Broschüren |
| `Relaunch-SEO-Checkliste.md` | SEO-Phasen des Relaunchs |

---

© Lingener Baumaschinen GmbH & Co. KG · Diekstrasse 59 · 49809 Lingen (Ems)
