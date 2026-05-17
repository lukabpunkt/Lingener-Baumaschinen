# LIBA — Lingener Baumaschinen · Website

Premium Corporate Website für **LIBA – Lingener Baumaschinen GmbH & Co. KG**, ein deutscher Hersteller von Grabenfräsen, Anbaufräsen, Pflügen und Spezialmaschinen mit Sitz in Lingen (Ems).

Komplett statisch (HTML / CSS / Vanilla JavaScript) — direkt deploybar auf GitHub Pages, Netlify, Vercel oder jedem klassischen Webserver. Keine Build-Tools, keine Dependencies.

---

## Tech & Design

- **Stack:** Semantisches HTML5, modernes CSS (Custom Properties, Grid, `clamp()`), Vanilla JavaScript (ES2015+, ~3 KB).
- **Performance:** Keine Frameworks, keine externen JS-Libraries. Lazy-loadable Bilder, native `font-display: swap`.
- **Accessibility:** Tastaturnavigation, Skip-Link, ARIA, `prefers-reduced-motion` respektiert.
- **Responsiv:** Mobile-First, Breakpoints bei 600 / 800 / 900 / 960 / 1024 px.
- **Typografie:** Inter (Body) + Space Grotesk (Display) via Google Fonts.
- **Designsprache:** Industriell-elegant. Teal-Markenfarbe (`#0E7C7B`) der Original-LIBA-Identität, modernisiert und mit industriellem Signal-Amber (`#F59E0B`) gepaart.

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite — Hero-Slider, Produktfamilien, Anwendungen, Stats, Aktuelles, CTA |
| `maschinen.html` | Übersicht aller Produktfamilien (Bagger-, Schlepperanbau, Selbstfahrer, Spezial, Pflüge) |
| `maschinen/gm-180-af.html` | Beispiel-Produktdetailseite mit Spec-Tabelle |
| `anwendungen.html` | Einsatzbereiche (Glasfaser, Pipeline, Kabel, Drainage, Agrar, Spezialbau) |
| `mieten.html` | Mietangebot mit Mietanfrage-Formular |
| `unternehmen.html` | Über LIBA — Geschichte, Werte, Standort |
| `kontakt.html` | Kontakt + Anfrageformular |
| `impressum.html` · `datenschutz.html` · `agb.html` | Rechtliches |
| `404.html` | Fehlerseite |

## Projektstruktur

```
LIBA Website/
├── index.html
├── maschinen.html
├── anwendungen.html
├── mieten.html
├── unternehmen.html
├── kontakt.html
├── impressum.html
├── datenschutz.html
├── agb.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── README.md
├── maschinen/
│   └── gm-180-af.html
└── assets/
    ├── css/
    │   └── main.css            # Vollständiges Designsystem
    ├── js/
    │   └── main.js             # Nav, Reveal, Slider, Counter, Form
    ├── images/
    │   ├── hero/               # Hero-Bilder (Slider)
    │   ├── products/           # Produktfotos
    │   ├── applications/       # Einsatzgebiete
    │   ├── gallery/            # Allgemeine Galerie
    │   └── logo/               # Logo + Favicons
    ├── icons/                  # Reserviert für SVG-Icons
    ├── fonts/                  # Reserviert für selbstgehostete Fonts
    └── videos/                 # Reserviert für Showcase-Videos
```

## Lokal entwickeln

Reine statische Dateien. Öffne `index.html` direkt im Browser oder starte einen Mini-Server:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Dann <http://localhost:8000> aufrufen.

## Deployment

### GitHub Pages
```bash
git init
git add .
git commit -m "LIBA website — initial commit"
git branch -M main
git remote add origin git@github.com:<user>/<repo>.git
git push -u origin main
```
Anschließend in den Repository-Einstellungen unter **Pages** die Quelle auf `main` / `root` setzen.

### Netlify / Vercel
Repository verbinden — Build-Befehl: _(leer)_, Publish-Ordner: `.`

## Designtokens

| Token | Wert | Bedeutung |
|---|---|---|
| `--brand` | `#0E7C7B` | LIBA Teal (Primärfarbe) |
| `--brand-deep` | `#064E4F` | Dunkles Teal (Hover, Tiefe) |
| `--brand-light` | `#5EEAD4` | Helles Teal (Akzent auf Dunkel) |
| `--accent` | `#F59E0B` | Industrie-Amber (CTAs) |
| `--ink` | `#0A0E14` | Tiefes Schiefer-Schwarz |
| `--bg` | `#FAFAF9` | Off-White Hintergrund |
| `--font-display` | Space Grotesk | Überschriften |
| `--font-sans` | Inter | Fließtext |

## Formular-Anbindung

Die Formulare sind als Frontend-Markup vorbereitet. Für produktiven Einsatz wahlweise:
- **Netlify Forms** — `data-form` durch `name="..." netlify` ersetzen.
- **Formspree / Basin** — `action="https://formspree.io/f/..."` setzen.
- **Eigene API** — `fetch()` in `assets/js/main.js` ergänzen.

## Credits

- Bildmaterial: aus dem bestehenden LIBA-Bestand übernommen.
- Konzept, Design & Code: neu aufgebaut auf Basis der bestehenden Inhalte.

---

© Lingener Baumaschinen GmbH & Co. KG · Diekstrasse 59 · 49809 Lingen (Ems)
