# LIBA — Lingener Baumaschinen · Website

Corporate Website für **LIBA – Lingener Baumaschinen GmbH & Co. KG**, deutscher Hersteller von Grabenfräsen, Anbaufräsen, Pflügen und Spezialmaschinen in Lingen (Ems).

Statische Site, generiert mit **Eleventy 3**. Zweisprachig DE/EN, 90 Seiten, Zielhosting **Netlify**.

> **Status:** Die Seite ist gebaut, aber noch **nicht live** — `lingener-baumaschinen.de` zeigt weiterhin auf die alte WordPress-Site.
> Was vor der Liveschaltung noch fehlt, steht in **[`GO-LIVE-Checkliste.md`](GO-LIVE-Checkliste.md)**;
> die Anleitungen für alles, was nur der Betreiber liefern kann, in **[`Zulieferungen-Checkliste.md`](Zulieferungen-Checkliste.md)**.

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
│   ├── site.js             # langs + GA4-Mess-ID
│   ├── maschinen.js        # 30 Maschinen: slug, name, specs, heroImage, oldUrl
│   ├── maschinenseiten.js  # daraus 60 Seitenobjekte (30 × DE/EN) inkl. schema, ogImage, heroBg
│   ├── labels.js           # DE↔EN-Tabelle für Datenwerte (Kategorie, Zustand)
│   ├── faq.js              # FAQ-Text und -Schema aus einer Quelle
│   └── redirects.js        # manuelle 301-Regeln der WordPress-Migration
├── _includes/base.njk      # zentrales Layout (Head, Nav, Footer, Consent)
├── maschinen/maschine.njk  # ein Template → 60 Maschinenseiten
├── en/404.njk              # einzige separate EN-Datei (404 kommt ohne Layout aus)
├── *.njk                   # alle übrigen Seiten, je DE + EN
├── _redirects.njk          # generiert _site/_redirects (spezifische Regeln + Splats)
├── assets/                 # css, js, images, fonts (self-hosted)
├── llms.txt · robots.txt · sitemap.njk
.eleventy.js · netlify.toml · package.json
```

### Datenfluss

```
maschinen.js ──► maschinenseiten.js ──► maschinen/maschine.njk   (60 Seiten)
      │                 ▲
      │                 └─ labels.js (DE↔EN für Kategorie/Zustand)
      └──────────► redirects.js ──► _redirects.njk ──► _site/_redirects
faq.js  ──► faq.njk           (sichtbarer Text UND FAQPage-Schema)
site.js ──► base.njk          (Sprachen; GA4 nur wenn echte Mess-ID gesetzt)
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
Die CSP in `netlify.toml` setzt `script-src` **ohne** `'unsafe-inline'`. Jedes `<script>…</script>` im Markup bricht die Seite auf Netlify — lokal und auf der GitHub-Pages-Vorschau fällt das nicht auf, weil dort keine Header ausgeliefert werden. Erlaubt sind ausgelagerte Dateien und `<script type="application/ld+json">`. Parameter kommen per `data-`-Attribut (Muster: `ga4-init.js` liest `document.currentScript.dataset.ga4`).
`style-src` behält bewusst `'unsafe-inline'` — `style=`-Attribute sind in Ordnung.

**3 · GA4 ist per Platzhalter deaktiviert.**
Solange `src/_data/site.js` `G-XXXXXXXXXX` enthält, wird kein Google-Markup gerendert. Beim Eintragen der echten ID nichts weiter nötig — `connect-src` deckt die regionalen GA4-Endpunkte bereits ab.

**4 · iOS/WebKit-Falle.**
Eine CSS-Animation auf einem Vorfahren zerstört in WebKit `position: fixed` bei allen Nachfahren. Deshalb liegt `page-enter` auf `<main>`, nicht auf `<body>`; Scroll-Progress, FAB, Cookie-Banner und Drawer sind bewusst direkte Kinder von `<body>`. Diese Struktur nicht umbauen.

**5 · Kanonisch ist die apex-Domain ohne `www`.**
Überall `https://lingener-baumaschinen.de`. Kein `www.` neu einführen.

**6 · Die Sitemap pflegt sich selbst.**
`sitemap.njk` nimmt jede Seite mit `canonical` und ohne `noindex`. `noindex: true` im Front-Matter entfernt eine Seite also automatisch auch aus der Sitemap.

**7 · `_redirects` nie von Hand editieren.**
Die Datei wird generiert. Spezifische Regeln gehören nach `src/_data/redirects.js`, Splat-Regeln ans Ende von `src/_redirects.njk`.

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

**Vorschau: GitHub Pages**, manuell über `gh workflow run deploy.yml` (der Workflow ist auf `workflow_dispatch` beschränkt und baut mit `ELEVENTY_PATH_PREFIX=/Lingener-Baumaschinen/`).

## Designtokens

Definiert in `src/assets/css/main.css` (`:root`) — dort steht die maßgebliche, vollständige Liste.

| Token | Wert | Bedeutung |
|---|---|---|
| `--brand` | `#0E7C7B` | LIBA Teal (Primärfarbe) |
| `--brand-deep` | `#0A5E5D` | Dunkles Teal (Hover, Tiefe) |
| `--brand-light` | `#5EEAD4` | Helles Teal (Akzent auf Dunkel) |
| `--accent` | `#F59E0B` | Industrie-Amber (CTAs) |
| `--ink` | `#0B0F14` | Tiefes Schiefer-Schwarz |
| `--canvas` | `#FFFFFF` | Heller Grund |
| `--font-sans` / `--font-display` | Inter | Fließtext **und** Überschriften |
| `--font-serif` | Instrument Serif | kursive Akzente (`.serif-italic`) |

Schriften sind **selbst gehostet** (`src/assets/fonts/`, eingebunden über `assets/css/fonts.css`) — kein Google-Fonts-Request, DSGVO-konform. Eingebunden sind genau drei Familien: Inter, Instrument Serif und JetBrains Mono.

## Weitere Dokumente

| Datei | Inhalt |
|---|---|
| `GO-LIVE-Checkliste.md` | **Master-Liste der offenen Aufgaben** vor der Liveschaltung |
| `Zulieferungen-Checkliste.md` | Schritt-für-Schritt-Anleitungen für alle Betreiber-Aufgaben |
| `CLAUDE.md` | Migrations-Handover WordPress → Eleventy, §5 = Redirect-Map |
| `QA-Report.md` · `QA-Prelaunch.md` | QA-Runden 1 und 2 (historische Momentaufnahmen) |
| `Security-Audit.md` | Security-Befunde S-1…S-13 |
| `DE-EN-Parity.md` | Sprachparität DE/EN |
| `Broschuere-Analyse.md` | Korrekturvorlage für die Print-Broschüren |
| `Relaunch-SEO-Checkliste.md` | SEO-Phasen des Relaunchs |

---

© Lingener Baumaschinen GmbH & Co. KG · Diekstrasse 59 · 49809 Lingen (Ems)
