# QA-Prelaunch-Report — LIBA Website (Bug-Sweep vor Go-Live)

**Datum:** 2026-06-24 · **Runde 2** (nach `QA-Report.md`) · **Methodik:** echte Browser-Testläufe über **alle 88 Seiten** (Playwright/axe/Lighthouse) + **8 unabhängige, adversariale Agenten** + deterministische Verifikation der Neufunde. Baseline = `QA-Report.md`. **Report-only — kein Code geändert.**

> **Erledigungsstand (Nachtrag 2026-07-27):** PL-1, PL-2, PL-4, PL-6 sowie PL-5 und PL-7 sind behoben, PL-3 technisch abgesichert. Der Report bleibt als Momentaufnahme vom 2026-06-24 stehen; die Erledigungsvermerke stehen jeweils direkt beim Befund. Aktueller Gesamtstand: `GO-LIVE-Checkliste.md`.

## Go/No-Go: 🟢 GRÜN nach 2 schnellen Fixes

**Kein Blocker, kein Critical.** Alle go-live-kritischen Fixes aus Runde 1 **halten** (Forms, Calendly-Consent, Self-Hosted Fonts, Schema, Impressum, Security-Header, A11y, Inhalt/i18n). Über alle 88 Seiten: **0 Konsolenfehler, 0 JS-Exceptions, 0 fehlgeschlagene Requests, 0 ungültige JSON-LD, 0 kaputte Links/Anker, 0 horizontaler Overflow.** Es bleiben **2 neue, echte Bugs** (schnell behebbar) + eine Content-Entscheidung (Team-Seite) + bekannte Betreiber-/Daten-Punkte.

| Schweregrad | Anzahl (neu) |
|---|---|
| 🔴 Blocker / 🟠 Critical | 0 |
| 🟡 Major | 3 |
| 🔵 Minor | 5 |
| ⚪ Info / Perf-Chance | mehrere |

---

## 🟡 MAJOR — vor Launch beheben

### PL-1 — Off-Domain-Link: „Referenzen"-CTA zeigt auf die alte GitHub-Pages-Staging-Domain — ✅ BEHOBEN
- **Track:** Links + SEO + Security · **Verifiziert:** 3 Agenten unabhängig + deterministischer grep
- **Ort:** `src/anwendungen.njk:47` → `_site/anwendungen.html` + `_site/en/anwendungen.html`
- **Beleg:** `<a href="https://lukabpunkt.github.io/Lingener-Baumaschinen/referenzen.html">` (DE) bzw. `…/en/referenzen.html` (EN) — die **einzigen** zwei `github.io`-Links im ganzen Build. Alle anderen internen Links sind apex-relativ.
- **Wirkung:** Der primäre „Referenzprojekte ansehen"-Button schickt Besucher (und Link-Equity) **off-domain** auf den alten Staging-Build — nach Go-Live ein Cross-Domain-Sprung bzw. 404, sobald die Staging-Seite abgeschaltet wird.
- **Empfehlung:** relativ ersetzen: `{% if lang == 'en' %}/en/referenzen.html{% else %}/referenzen.html{% endif %}`.

### PL-2 — Calendly-Consent-Box: Hinweistext praktisch unlesbar (Kontrast 1.57:1) — ✅ BEHOBEN
- **Track:** Responsive/Visual · **Verifiziert:** deterministisch (berechnete Farben)
- **Ort:** `src/kontakt.njk:66` (`#calendly-consent > p`), DE + EN, alle Breakpoints
- **Beleg:** Textfarbe `rgb(192,198,209)` auf Box-Hintergrund `rgb(246,245,242)` = **1.57:1** (WCAG AA verlangt 4.5:1). Ursache: Box erzwingt hellen Hintergrund per Inline-Style (`--surface,#f6f5f2`), der Text erbt aber die helle Theme-Schriftfarbe.
- **Wirkung:** Ausgerechnet der **DSGVO-Hinweis** (IP-Übertragung an Calendly/USA) ist kaum lesbar — den sollen Nutzer vor dem Klick lesen können.
- **Empfehlung:** explizite dunkle Textfarbe auf die Box setzen (z. B. `color: var(--ink, #1a2230)`).

### PL-3 — Team-Seite live mit Platzhalter-Inhalten — 🟡 TEILWEISE (Befund überholt)

> **Stand 2026-07-27:** Die beschriebenen `[Name]`/`[Platzhalter]`-Texte existieren **nicht mehr** — die Seite ist seit Juli mit KI-Mockup-Portraits und Beispielnamen gefüllt. Technisch abgesichert: `noindex: true` (damit auch aus der Sitemap), kein Link in Nav, Footer oder auf der Unternehmensseite. **Offen bleibt allein die inhaltliche Entscheidung** (echte Bios/Fotos vs. Seite so lassen) — `Zulieferungen-Checkliste.md` Punkt 5.

- **Track:** Content · **Verifiziert:** mehrfach + grep (einzige Seiten mit `[Platzhalter]`/`[Name]`)
- **Ort:** `src/team.njk` → `_site/team.html` + `/en/team.html`
- **Beleg:** Hero bis Sektion 03 enthält `[Platzhalter: …Geschäftsführer…]`, 6 Team-Karten `[Name]` mit „Foto folgt", Platzhalter-Zitat. **Neue Brisanz:** das Impressum nennt jetzt öffentlich **Thorsten Schrader** als Geschäftsführer — die `[Name]`-Platzhalter wirken dadurch noch widersprüchlicher.
- **Empfehlung:** vor Launch echte Bios/Fotos einsetzen **oder** Seite `noindex` + aus Nav/Footer entlinken. (Bekannter offener Punkt MA-17 — du hattest „nicht verstecken" gewählt; vor Go-Live aber zu entscheiden.)

---

## 🔵 MINOR
- **PL-4 — ✅ BEHOBEN — EN-Zahlenformat:** englische Prosa nutzt deutsches Tausender-Format „1.600 mm / 1.300 mm" (inkonsistent: hand-getextete EN-Startseite nutzt korrekt „1,800 mm"). Auch die **Hero-Tiefenskala zeigt „3.000 mm" auf EN-Seiten** (per `aria-hidden` für AT versteckt, aber sichtbar). Quelle `maschinenseiten.js` / `index.njk`. *(MI-14)*
- **PL-5 — ✅ BEHOBEN — heading-order:** `unternehmen.html` springt h2→h4 (4 Prinzip-Karten; indexierte Seite). `impressum.html` h1→h3 (noindex, vernachlässigbar). → Karten-Headings auf `<h3>` setzen, Größe per CSS halten. *(Unternehmen 2026-07-09. Rechtsseiten 2026-07-27 — dabei zeigte sich, dass der h1→h3-Sprung nicht nur im Impressum, sondern genauso in `datenschutz.html` und `agb.html` steckte; alle drei auf `h2` gehoben, Optik über `.prose h2, .prose h3` in `main.css` gehalten.)*
- **PL-6 — ✅ BEHOBEN — Redundante Redirect-Zeile:** `_redirects` hat `/aktuelles/` zusätzlich zur Splat-Regel `/aktuelles/*` (unerreichbar, gleiches Ziel). Kosmetisch; Netlify-Warnung möglich. Quelle `src/_redirects.njk`.
- **PL-7 — ✅ BEHOBEN (2026-07-27) — EN-Privacy-Checkbox `value="akzeptiert"`** (deutsch). Nicht sichtbar, Einwilligung wird trotzdem übertragen; kosmetisch. *Jetzt sprachabhängig in allen drei Formularen — inzwischen betraf es auch das neue Bewerbungsformular.*
- **PL-8 — EN-Stil:** „Unimogfräse" (mit ä) durchgängig im EN-Text; EN-Kategorie mitten im Satz groß („a **Tractor-Mounted** trench cutter"). Beides Stil/Locale, kein Fehler.

## ⚪ INFO / Performance-Chancen (kein Launch-Blocker)
- **✅ BEHOBEN (2026-07-09) — Maschinenseiten-LCP ~7,7 s (mobil gedrosselt)** — *gelöst über verkleinerte `-bg.webp`-Varianten (900 px, bis −90 %) plus `<link rel="preload" fetchpriority="high">` auf 80 Seiten; neues Feld `heroBg` in `maschinenseiten.js`.* Ursprünglicher Befund: größter verbliebener Hebel: Page-Hero ist ein **CSS-`background-image`** (kein `<picture>`, **kein Preload, kein WebP**, 388 KB JPG obwohl `.webp`-Twin existiert) auf allen 60 Seiten. → pro Seite WebP preloaden bzw. Hero als echtes `<img>`/`<picture>`.
- **Hero-1 (LCP-Slide) ist JPG-only** — die anderen Slides nutzen WebP; der zeitkritischste bleibt JPG. Optional WebP wrappen.
- **~81 KiB ungenutztes CSS** (ein großes `main.css`, render-blocking). Optional Critical-CSS/Split.
- ~~`og:type=website` auf Maschinenseiten (könnte `product`).~~ ✅ erledigt 2026-07-27 — 60 Maschinenseiten liefern jetzt `product`.
- Cookie-Banner überdeckt mobil den FAB (unkritisch); Cookie-Buttons 43 px; No-JS-Submit landet auf der Formularseite (Netlify erfasst es trotzdem); DE/EN-Forms teilen `form-name`; `Permissions-Policy: payment=()` würde künftiges Stripe-Checkout blocken (heute kein Checkout).
- **`deploy.yml`** trägt weiter `ELEVENTY_PATH_PREFIX=/Lingener-Baumaschinen/` — **bewusst** (für die GitHub-Pages-Vorschau nötig). Für den finalen Netlify-Go-Live den Workflow löschen/deaktivieren, damit kein versehentlicher Pages-Build mit falschem Prefix entsteht.

## ⚠️ Hinweis zu falsch-positiven axe-Treffern
Die 5 `color-contrast`-Treffer (FAB/Cookie-Button auf einigen Seiten) sind **False Positives**: axe misst sie **mitten in der Einblend-Animation** (Brand halbtransparent → `#71b2b1`, 2.41:1). Im Endzustand ist es Weiß auf Brand `#0E7C7B` = **5.01:1 (AA bestanden)** — mit gesetztem Render-Delay liefert axe **0** Verstöße. Kein echter Mangel.

---

## ✅ Regressions-Status — alle Runde-1-Fixes halten
Unabhängig per grep + Runtime + axe bestätigt: **BL-1** Netlify-Forms (kein Formspree, POST auf `/`, form-name+Honeypot) · **CR-1** Calendly-Gate (0 Requests vor Klick) · **CR-2** Fonts self-hosted (0 Google-Requests, auch EN) · **CR-3** preisloser Offer entfernt · **CR-4** Impressum-Pflichtangaben · **MA-3** Security-Header · **MA-4/5/6** Schema · **MA-10–16** A11y/Content · **MA-18** Hero-LCP · **MI-1/3/4/7/10/12/13**. Von 28 geprüften Fixes: **25 halten ✓**, 2 teilweise (Hero-1-WebP, og:type), 1 „regrediert" nur kosmetisch (deploy.yml-Prefix — bewusst wieder gesetzt).

## Abdeckungsmatrix (alle 88 Seiten real getestet)
| Methode | Abdeckung |
|---|---|
| Browser-Crawl (Konsole/JS-Fehler/Requests/JSON-LD/SEO-Tags) | **88/88 Seiten** |
| Link-/Anker-Auflösung | alle internen Links + Anker, alle Seiten |
| axe-Accessibility | alle Seitentypen (+ False-Positive-Analyse) |
| Interaktion (Forms/Calendly/Wizard/ROI/Nav/FAB/Hero/Prefill) | live getrieben |
| Responsive/Overflow + Screenshots | 375/768/1024/1440, DE+EN |
| Lighthouse (Perf/SEO/BP/A11y/LCP) | Home, Maschinendetail, Galerie, EN-Home |

## 🔧 Braucht Betreiber/Daten bzw. Netlify-Staging (kein Code-Bug)
- **GA4-Mess-ID** setzen (sonst kein Tracking; Consent-Logik ist korrekt vorbereitet).
- **Redirect-Vollständigkeit & ⚠-Ziele** (`/produkt/…-kopie/`, GM 1 AS/AF) gegen **Search-Console-Export** prüfen.
- **Auf Netlify-Staging final testen:** echte Formular-Zustellung, 301-Status/www→apex, Live-Response-Header — die GitHub-Pages-Vorschau kann das systembedingt nicht.
- **Team-Seite** (PL-3) inhaltlich entscheiden.

## Methodik & Bias-Kontrolle
8 unabhängige Agenten, die den Code nicht gebaut haben, mit adversarialem Auftrag; `QA-Report.md` als Regressions-Baseline. Die zwei Neufunde (PL-1, PL-2) sind durch ≥2 unabhängige Quellen bzw. deterministische Messung belegt. Roh-Artefakte: `/tmp/liba-qa/artifacts/` (crawl, axe, lighthouse, interact2, linkcheck, overflow, shots).
