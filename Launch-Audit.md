# Launch-Audit — LIBA Website (offizieller Netlify-Launch unter neuer Domain)

**Datum:** 2026-09-15 · **Geprüfter Stand:** Commit `d6516a0` (lokal = Netlify-Produktion) · **Prüfziel:** https://lingener-baumaschinen.netlify.app + lokaler Build
**Methodik:** 4 unabhängige Agenten (Domain/SEO · Funktionen E2E · Design/A11y/Performance · Inhalt/Recht/Betrieb), jeweils erst eigene Messung, danach Abgleich mit den alten Reports. Anschließend konsolidiert, dedupliziert und **jeder Blocker-/Hoch-Befund von mir nachgemessen** (Spalte „Geprüft").
**Werkzeuge:** Playwright (Chromium + WebKit), axe-core 4.13 auf allen 90 Seiten, Lighthouse 13 mobil, curl, Netlify-API (nur lesend), `gh api` (nur lesend), `npm audit`.
**Report-only:** Am Code, an Netlify und an GitHub wurde nichts geändert. Einzige Ausnahme: 4 gekennzeichnete Test-Einsendungen über die Formulare (freigegeben, Liste in §8).

**Ausgangslage:**
- Launch zunächst unter einer **neuen, noch nicht festgelegten Domain**.
- Die WordPress-Seite auf `lingener-baumaschinen.de` **bleibt parallel online**.
- Später eventuell **Umzug auf `lingener-baumaschinen.de`**.
- Hosting, Verwaltung und Wartung laufen über **Netlify**.

Legende: **[Repo]** Code · **[Betreiber]** Dashboard/Konten/DNS · **[Entscheidung]** muss festgelegt werden · **[LIBA]** Fachauskunft/Freigabe der Firma
Geprüft: ✅ von mir nachgemessen · ◐ teilweise/per Code bestätigt · — Agent-Beleg, nicht separat nachgemessen

---

## 0. Umsetzungsstand (2026-09-15, lokal, noch nicht committet)

**Verifikation:**
- `npm run build` inkl. Domain-Check in 5 Szenarien grün:
  - Referenz-Domain
  - neue Domain + noindex
  - nur `*.netlify.app`
  - Deploy-Preview
  - Umzug mit Alias-Hosts
- Playwright-Prüfung (Chromium + WebKit-Stichprobe): **38/38**
- axe: **0 Verstöße auf 88 Seiten**
- `npm audit`: 0 Lücken, HTML-Output nach dem Update byte-identisch
- 88 JSON-LD-Blöcke gültig, „GM 140 AS" nirgends mehr enthalten

### Nachmessung auf Netlify (2026-09-15, Deploy von `625a88a`)

| Prüfung | Ergebnis |
|---|---|
| Browser-Tests (38 Fälle, Chromium + WebKit) gegen die Live-Vorschau | ✅ 38/38 |
| axe gegen alle 88 Seiten live | ✅ 0 Verstöße |
| CSP ohne Stripe, X-Frame, Referrer, Permissions | ✅ ausgeliefert |
| HSTS | ⚠️ Live noch `includeSubDomains; preload`. **Netlify setzt das auf `*.netlify.app` selbst**, solange keine eigene Domain eingetragen ist ([Netlify-Forum](https://answers.netlify.com/t/security-headers-adding-includesubdomains-and-preload-to-strict-transport-security-header-to-sites-with-default-domain-name/19706)). Der Wert aus `netlify.toml` greift erst mit der Custom Domain, dann per `curl -I` gegenprüfen. |
| Cache-Header | ✅ Fonts `max-age=31536000, immutable`, Bilder `max-age=86400, stale-while-revalidate=604800` |
| noindex unter `netlify.app` | ✅ Meta `noindex`, Canonical und og:image auf `netlify.app`, keine hreflang-Tags, Sitemap leer, robots.txt ohne Sitemap-Zeile |
| Pretty URLs aus | ✅ interne Links wieder `.html`. Hinweis: Netlify liefert `/en/maschinen` weiterhin mit 200 (Standard-Dateiauflösung, keine Nachbearbeitung). Das Canonical zeigt auf `.html`, unkritisch. |
| Netlify-Einfügung | ❌ Kommentar „This site is hosted on Netlify…", Meta `hosting-provider`/`netlify-deploy` und Header `netlify-hosting` weiterhin vorhanden. Per Repo nicht abschaltbar, **Dashboard oder Netlify-Support [Betreiber]**. |
| Weiterleitungen, Team-Seite, alte GA4-Datei | ✅ `/maschinen/` 301, `/fr/*` 301, `/en/nope` 404, `/team.html` 404, `ga4-init.js` 404 |
| Formularerkennung | ✅ `kontakt`, `gebrauchtmaschine`, `bewerbung` weiter erkannt (Honeypot aktiv) |

**Lighthouse mobil live** (SEO 69 überall = gewolltes noindex unter `netlify.app`):

| Seite | Performance vorher → jetzt | LCP vorher → jetzt | Gewicht | A11y / BP |
|---|---|---|---|---|
| `/` | 80 → **98** (Median aus 4 Läufen) | 5,0 s → **1,9 s** | 1.083 KiB | 100 / 100 |
| `/maschinen.html` | 89 → **98** | 3,0 s → **1,9 s** | 636 KiB (vorher 3,2 MB) | 100 / 100 |
| `/maschinen/gm-6-asr.html` | 83 → **95** | 4,5 s → **2,2 s** | 546 KiB | 100 / 100 |
| `/kontakt.html` | 92 → **98** | 2,7 s → **1,9 s** | 210 KiB | 100 / 100 |

**Korrektur (2026-09-15, nachgemessen):** Die erste Messung der Startseite direkt nach dem Deploy
ergab Performance 79 / LCP 5,2 s. Das war ein **Ausreißer** — vermutlich kalter Cache (TTFB 349 ms).
In vier Wiederholungen liegt die Startseite bei Performance 95–100 und LCP 1,6–2,2 s.
**Merksatz für künftige Messungen: Lighthouse-Werte nur als Median mehrerer, abwechselnder Läufe
vergleichen (Produktion und Preview direkt hintereinander), nie als Einzelwert.**

**Geprüfte und verworfene Optimierung (PR #1, Branch `perf/hero-lcp`, geschlossen):** Hero-Schriften
vorladen plus abgeschwächte Seiten-Einblendung (0,3 s ab halber Deckkraft statt 0,9 s ab 0).
A/B-Messung gegen den Deploy Preview, je 4 abwechselnde Läufe (Median):

| Seite | Performance Prod → Preview | LCP Prod → Preview |
|---|---|---|
| `/` | 98 → 97 | 1,91 s → **2,31 s** |
| `/kontakt.html` | 98 → 98 | 1,93 s → **2,17 s** |

Ursache: Die vorgeladenen Schriften (62 KB) starten gleichzeitig mit dem LCP-Bild `hero-1.webp`
und nehmen ihm Bandbreite weg (Ladedauer ca. 320 ms statt ca. 170 ms). FCP wird minimal besser,
der LCP schlechter. **Nicht übernommen.** Der Branch bleibt zur Nachvollziehbarkeit bestehen.

### Umgesetzt (Repo)

| ID | Was |
|---|---|
| **B-1** | Domain kommt aus der Umgebung: `SITE_URL` → Netlify-`URL` → Referenz. Die Transform in `.eleventy.js` schreibt alle absoluten URLs um. `noindex`-Schalter (automatisch für Previews und `*.netlify.app`, zusätzlich `SITE_NOINDEX=1`). `SITE_ALIAS_HOSTS` erzeugt Host-301 ganz oben in `_redirects`. `robots.txt` und `llms.txt` sind Templates. `scripts/check-domain.js` bricht den Build bei fremder Domain ab. **Offen:** Domain-Wert selbst (Registrierung, E-1). |
| **H-1** | Navigations-Breakpoint vereinheitlicht (1100 px). |
| **H-2** *(teilweise)* | FAQ der Maschinenübersicht: sichtbarer Text und Schema aus einer Quelle (`src/_data/maschinenFaq.js`). „GM 140 AS" entfernt. Unternehmensseite ohne FAQ-Schema. **Offen:** die Zahlen selbst [LIBA]. |
| **H-3** | Team-Seite nicht mehr gebaut (`permalink: false`, Reaktivierung im Front Matter beschrieben) — gemäß Empfehlung E-4. |
| **H-4** | Drawer mit Fokus-Management, Escape, Tab-Schleife und Scroll-Lock. Geschlossene Overlays (Drawer, FAB-Menü, Banner, Scroll-Top) per `visibility` nicht fokussierbar, Wizard-Schritte per `inert`, `aria-live` für Ergebnisse, Schnellklick abgesichert. Slider-Punkte mit 24-px-Trefferfläche, klickbar, `aria-current`. |
| **H-5** *(Repo-Teil)* | **Impressum:** DDG statt TMG, OS-Plattform entfernt, TMG-Zitate raus, Vertretung ausformuliert. **Datenschutz:** eigener Abschnitt Hosting (Netlify, neue Anschrift, DPF/SCC), Abschnitt E-Mail/Telefon/WhatsApp, TDDDG statt TTDSG, `_gid` entfernt, GA4-Text passend zum strengen Consent, Bewerbung auf Art. 6 Abs. 1 lit. b DSGVO, Stand 09/2026, Overflow behoben. **Offen:** anwaltliche Prüfung, AGB-Freigabe. |
| **H-6** | Strenger Consent gemäß Empfehlung E-3: `gtag.js` erst nach „Akzeptieren". Widerruf löscht `_ga`-Cookies. Banner und Footer-Link nur bei echter Mess-ID. `ga4-init.js` entfernt. Getestet mit Test-ID. |
| **H-7** | Hero-H1 ohne Masken-Transform, `hero-1` als WebP (Preload + `<picture>`). Lokale Lighthouse-Messung: LCP-Element ist jetzt das Hero-Bild, Render-Verzögerung **1,25 s** (vorher 4,46 s). Den Rest verursacht die Einblend-Animation von `<main>` (Design-Entscheidung). **Offen:** Neumessung auf Netlify. |
| **H-8** | 30 Maschinenkarten mit 400/800-px-WebP, `srcset`, `width`/`height`. Lokal `/maschinen.html` 838 KiB statt 3,2 MB. 18 große Einzelbilder mit 800-px-Variante. |
| **H-9** *(teilweise)* | OG-Motiv 1200×630 mit Logo (`assets/images/og/og-default.jpg`), `favicon.ico`, Webmanifest, Logos als WebP. **Offen:** Signet/Favicon-Motiv, SVG-Logo, Logofarbe [Entscheidung/Grafik]. |
| **H-12** *(Repo-Teil)* | `.github/workflows/deploy.yml` gelöscht. **Offen:** GitHub Pages in den Repo-Einstellungen abschalten [Betreiber]. |
| **H-13** *(Repo-Teil)* | `pretty_urls = false` in `netlify.toml` gemäß Empfehlung E-5. **Offen:** Netlifys eingefügter Werbe-Kommentar und Meta-Tags — keine Repo-Einstellung dokumentiert, nach dem Deploy prüfen, ggf. Dashboard/Support. |
| **M-1** | HSTS ohne `includeSubDomains`/`preload`. |
| **M-2 / M-3** | Speicherzugriff abgesichert. Doppel-Dekodierung entfernt. |
| **M-4** | Vorbefüllung in Seitensprache, Modellname statt Slug, `#anfrage`, Betreff Kauf/Miete per Parameter. |
| **M-5** | `<noscript>`-Fallback für Einblend-Elemente, Zähler mit Endwert im HTML. |
| **M-6** | EN-Zahlenformat automatisch für alle Spec-Werte ohne `valEN` (Text, Tabelle, Schema). Zähler nach Seitensprache. |
| **M-7** | siehe H-2 |
| **M-8** | Kommentar korrigiert. **Offen:** Entscheidung Product-Snippet. |
| **M-10** | Kontraste: `section-index`, Tabellenköpfe, Rechtsseiten-Meta, Wizard, Verfügbarkeits-Badges, Einsatzbereich-Karten, ROI-Rechner, Öffnungszeiten, Zitat. |
| **M-11** | Scroll-Hinweis entfernt, H1-Breite für große Screens, Kontakt-Button erst nach dem Hero. |
| **M-12** | ROI-Ergebnis mobil gestapelt. |
| **M-13** | Druck-Datenblatt: Logo-Kopf, Produktfoto, FAQ aufgeklappt, Einsatzbereiche aus, eine Schrift. |
| **M-14** *(CSS)* | `<picture>` bricht Bildrahmen nicht mehr auf (Galerie, Referenzen, Karten). **Offen:** scharfes GM-180-AF-Foto [LIBA]. |
| **M-15** *(teilweise)* | Broschüre öffnet im Browser, Größe im Linktext. **Offen:** komprimierte Web-Fassung [Grafik]. |
| **M-16** | Leerzeichen-Pflichtfelder, PDF-Prüfung per Endung + Typ (7,5 MB), Status sichtbar, `autocomplete`, 20-px-Checkbox, Datei-Button, sprachneutrale Modellwerte, Pflicht-Sternchen. |
| **M-21 / M-22** | README, CLAUDE.md, GO-LIVE-, Zulieferungs- und Relaunch-Checkliste auf die neue Strategie. Umzugsablauf in §7 und in `site.js`/`netlify.toml` dokumentiert. **Offen:** veraltete Zweitkopie `~/Documents/LIBA Website` löschen. |
| **M-25** | 404-Seiten mit Seitenlinks, Rechtslinks und Sprachwechsel, auch mobil. |
| **N-2 bis N-4, N-8, N-9, N-11 bis N-16, N-18** | Unzuverlässiges `lastmod` entfernt · Startseiten-Links ohne `index.html` · eine Organisations-Entität · Slider-Punkte · ROI-Gleichstand und Miet-CTA · Stripe und `img-src https:` aus der CSP · `npm audit fix` · Cache-Header für Fonts/Bilder · Kontakt-Button mobil kompakt · h2 auf der Kontaktseite · Sprachumschalter als Gruppe mit `aria-current` · Banner nur bei aktivem GA4. |

### Bewusst nicht umgesetzt
- **N-1 Titel kürzen:** Die Titel tragen die Keywords der Migration. Das ist eine SEO-Entscheidung, der Nutzen ist gering.
- **N-17 Minify:** Eine zusätzliche Build-Abhängigkeit für rund 8 KB lohnt sich nicht.
- **N-5, N-6, N-7:** Das sind Entscheidungen (Impressum indexieren, KI-Crawler-Politik, Domain im Druck-Fuß).

### Offen — braucht Betreiber, LIBA oder eine Entscheidung
- **B-2** Formular-Benachrichtigungen
- **E-1, E-2, E-6** Entscheidungen. E-3, E-4 und E-5 sind gemäß Empfehlung vorbelegt und reversibel.
- **H-2** Fakten
- **H-5** Anwalt und AGB
- **H-10 / H-11** Plan, Konten, AV-Vertrag
- **H-12** Pages abschalten
- **H-14** Exporte
- **M-9, M-17 bis M-20, M-23, M-24, N-10**
- Commit und Push, danach Nachmessung auf Netlify: Header, Pretty URLs, Werbe-Einfügung, Lighthouse

---

## 1. Gesamturteil

### 🔴 Launch-Ampel: ROT — heute nicht launchfähig, aber mit überschaubarem Aufwand dahin

**Was gut ist:**
- **Stabil:** Alle 88 Inhaltsseiten liefern auf Netlify 200, ohne Konsolenfehler, ohne CSP-Verstöße und ohne kaputte Links oder Anker.
- **Sprachumschalter:** führt auf 88/88 Seiten zur richtigen Gegenseite.
- **Formulare:** nehmen echte Einsendungen an.
- **Redirects:** greifen mit genau einem Sprung.
- **Security-Header:** werden ausgeliefert.
- **Keine Secrets** im Repo.
- **Werte:** CLS 0, Lighthouse Best Practices und SEO 100.
- **Design:** Die Navy-Palette ist sauber umgesetzt, ohne Teal-Reste. Typografie und Komponentensystem wirken hochwertig.

**Warum trotzdem Rot:**
1. **Die Seite ist fest auf `lingener-baumaschinen.de` verdrahtet.** Unter einer neuen Domain erklärt jede Seite eine WordPress-URL zum Original, und WordPress leitet diese URLs auf seine Startseite um. Folgen:
   - Die neue Seite wird voraussichtlich nicht sauber indexiert.
   - Geteilte Links zeigen kein Vorschaubild.
   - Die Sitemap zeigt auf einen fremden Host.
2. **Nicht belegt ist, dass Anfragen jemanden erreichen.** Formular-Benachrichtigungen sind nicht nachweisbar eingerichtet.
3. **Eine Reihe hoher Punkte, die ein offizieller Firmenauftritt nicht haben darf:**
   - öffentlich abrufbare Team-Seite mit fiktivem Geschäftsführer
   - veraltete Rechtstexte
   - Kopie der Seite auf GitHub Pages
   - Free-Plan, der die Seite bei Überlast pausiert
   - widersprüchliche technische Daten bei rund 14 Modellen
   - Navigationslücke bei 1024–1099 px
   - Tastaturfallen

**Befundzahlen:**

| | Anzahl |
|---|---|
| Rohbefunde der Agenten | 93 |
| konsolidiert | 60 |
| davon Blocker | 2 |
| davon Hoch | 14 |
| davon Mittel | 25 |
| davon Niedrig | 19 |
| Entscheidungen | 6 |

---

## 2. Entscheidungen, die vor dem Launch fallen müssen

| # | Entscheidung | Empfehlung | Warum es blockiert |
|---|---|---|---|
| **E-1** | **Soll die neue Domain bis zum Umzug indexiert werden?** | **Variante A — `noindex` bis zum Umzug** (per Umgebungsvariable, robots.txt ohne `Disallow`), **wenn der Umzug auf .de in 6–12 Monaten realistisch ist**. Sonst Variante B: indexieren mit Canonicals auf die neue Domain. | Bestimmt Canonicals, Sitemap, Search Console und ob später eine zweite Migration mit Change-of-Address nötig wird. Duplicate Content im engeren Sinn besteht nicht: Die Texte überlappen nur 0–7,8 % (gemessen). Das Risiko liegt in zwei konkurrierenden Firmenseiten und einer doppelten Migration. |
| **E-2** | **Wem gehören Netlify-Team, GitHub-Repo und die Domain?** | Netlify-Team und GitHub-Organisation auf LIBA, der Dienstleister als Mitglied. **Bezahlter Plan** auf Firmenkosten. Domain auf LIBA registrieren. | Heute liegen alle Konten privat beim Dienstleister, Formulardaten inkl. Lebensläufe eingeschlossen. Ein AV-Vertrag ist nicht belegt, der Bus-Faktor ist 1 (H-5). |
| **E-3** | **GA4: strenger oder erweiterter Consent Mode?** | **Streng:** `gtag.js` erst nach „Akzeptieren" laden, beim Widerruf `_ga*`-Cookies löschen. | Der heutige Code würde nach Eintragen der ID Google schon vor der Einwilligung kontaktieren. Das widerspricht der Datenschutzerklärung (H-6). |
| **E-4** | **Team-Seite: entfernen oder mit echten Inhalten füllen?** | Bis echte, freigegebene Fotos und Namen vorliegen: **aus dem Build nehmen**. | Fiktiver Geschäftsführer ist öffentlich abrufbar (H-3). |
| **E-5** | **URL-Form: `.html` oder endungslos?** | `.html` beibehalten (so sind Canonicals, Sitemap und Redirect-Map gebaut) und **Netlify „Pretty URLs" abschalten**. | Heute gibt es Mischbetrieb mit 301-Umwegen und doppelten URLs (M-1). |
| **E-6** | **Repo öffentlich lassen?** | **Privat stellen** oder die Betriebsdoku auslagern. | Das öffentliche Repo enthält interne Doku, u. a. zu Schwächen der Mail-Absicherung und die Site-ID (M-20). |

---

## 3. 🚫 Blocker

### B-1 · Domain fest einkodiert — Canonical, hreflang, og:image, Sitemap, robots, JSON-LD und llms.txt zeigen auf WordPress · [Repo] · ✅
- **Befund:**
  - Es gibt keine zentrale Domain-Einstellung (`src/_data/site.js` hat kein `url`).
  - `https://lingener-baumaschinen.de` steht an **94 Stellen in 23 Dateien**, im Build **1.104-mal**.
  - `robots.txt` und `llms.txt` sind statische Passthrough-Dateien.
  - Auf der WordPress-Seite antworten die Zieladressen mit **301 auf deren Startseite**, auch Bild-URLs (Antwort ist dann HTML statt Bild).
- **Folgen unter neuer Domain:**
  - Google bekommt „Original = WordPress-Startseite" gemeldet und wird die Seite voraussichtlich nicht sauber indexieren.
  - Das hreflang-Cluster ist ungültig.
  - Die Sitemap liegt auf einem fremden Host.
  - Die robots-Sitemap-Zeile zeigt auf die Yoast-Sitemap.
  - Social-Shares (LinkedIn, WhatsApp, Teams) zeigen **kein Vorschaubild**.
- **Nachgemessen:**
  - `curl` auf `lingener-baumaschinen.de`: `/maschinen.html`, `/maschinen/gm-6-asr.html` und `/assets/images/hero/hero-1.jpg` antworten mit `301 → /`, `/en/maschinen.html` mit `301 → /en/`.
  - Die Netlify-Vorschau liefert `canonical https://lingener-baumaschinen.de/maschinen.html` und `og:image https://lingener-baumaschinen.de/assets/images/hero/hero-1.jpg`.
- **Umsetzung** (Agent 1, Aufwand ca. 4–5 h inkl. Verifikation):
  1. `site.js`: `url` aus `SITE_URL` (Fallback Netlify-`URL`), dazu `noindex`-Schalter (`SITE_NOINDEX`, außerdem automatisch für Nicht-Produktions-Deploys) und `aliasHosts` für den späteren Umzug.
  2. `netlify.toml` `[context.production.environment]`: `SITE_URL`, `SITE_NOINDEX` versioniert im Repo.
  3. `base.njk` (og-Default, hreflang, noindex), `maschine.njk:18`, 14 Seiten-Templates (`canonicalDE/EN`), `maschinenseiten.js:5` (`BASE`) und 17 JSON-LD-Blöcke (am besten als ein gemeinsamer Organisations-Knoten aus `_data/organization.js`) auf `site.url` umstellen.
  4. `robots.txt` → `robots.njk` und `llms.txt` → `llms.njk`, Passthrough in `.eleventy.js:8–9` entfernen. Bei `noindex` keine Sitemap-Zeile und **kein** `Disallow`.
  5. Die Host-Redirect-Regeln für den späteren Umzug **als erste Zeilen** in `_redirects.njk` generieren.
  6. Build-Check `check:domain`: 0 fremde `https://`-Hosts in `_site`, genau ein Canonical je Seite.
- **Simulation (Agent 1):** Eine Ersetzung auf `neue-domain.example` erfasst im Output alles außer dem Druck-Fußtext `main.css:2880`. `_redirects` bleibt byte-identisch, `oldUrl` muss also nicht angefasst werden.
- Enthält die Einzelbefunde D-01, D-02, D-03, R-01, F-09, G-01.

### B-2 · Formular-Benachrichtigungen nicht nachweisbar eingerichtet — Anfragen und Bewerbungen können unbemerkt liegen bleiben · [Betreiber] · ◐
- **Befund:**
  - Netlify erkennt alle drei Formulare (`kontakt`, `gebrauchtmaschine`, `bewerbung`), Honeypot ist aktiv, reCAPTCHA aus.
  - Ob eine **E-Mail-Benachrichtigung** hinterlegt ist, liefert die Netlify-API nicht. Die eigene Checkliste führt den Punkt als offen.
- **Korrektur zu Agent 4:** Der Eintrag im Formular `kontakt` ist wahrscheinlich eine Test-Einsendung, keine übersehene Kundenanfrage.
  - Agent 4 berichtete vorher `last_submission_at 2026-08-13 11:03 UTC`. Das fällt in dieselbe Minute wie der letzte Deploy vom 13.08.
  - Nach den heutigen Tests steht `last_submission_at` bei allen drei Formularen auf 15.09. 11:05–11:06 UTC.
  - Die Zähler stehen weiter bei 1/0/0. Die Einsendungen liegen möglicherweise im **Spam-Ordner**, das ist per API nicht einsehbar.
- **Empfehlung:**
  - Dashboard → Forms → Form notifications: pro Formular eine Firmenadresse eintragen, für `bewerbung` getrennt an die Personalverantwortliche Person.
  - Danach eine Einsendung je Formular **bis ins ALL-INKL-Postfach** verfolgen (Spam-Ordner, Reply-To = Kunden-Mail).
  - Test-Einträge löschen (§8).
  - Akismet/Spamfilter bestätigen.

---

## 4. 🔴 Hoch

### Repo-seitig

| ID | Befund | Empfehlung | Geprüft | Quelle |
|---|---|---|---|---|
| **H-1** | **Keine Navigation zwischen 1024 und 1099 px.** Der Drawer ist ab 1024 px abgeschaltet (`main.css:688`), Desktop-Links und Ausblenden des Toggles gelten erst ab 1100 px (`:652`). Der Hamburger ist sichtbar, öffnet aber nichts. Betrifft z. B. iPad quer und kleine Laptops, in Chromium und WebKit. | `main.css:689` auf `min-width: 1100px`, danach 1024/1099/1100 prüfen. | ✅ | F-01 |
| **H-2** | **Widersprüchliche technische Daten bei rund 14 Modellen.** Übersicht, sichtbare FAQ, FAQ-Schema und Meta-Description widersprechen den Spec-Tabellen und dem Product-Schema aus `maschinen.js`. Beispiele: GM 140 H „900 mm / ab 6 t" gegen 1.500 mm / ab 17 t · GM 600 R „bis 1.800 mm" gegen 600 mm · GM 6 ASR 800 gegen 1.700 mm · „bis 1.400 mm" für Baggeranbau · ebenso GM 1 AF/AS, 160 AS, 4 Raupe, GMV 100/130, 1800 P, Tiefenfräsen. **„GM 140 AS"** steht als lieferbares Modell im FAQ-Schema (`maschinen.njk:26/28`), obwohl es das Modell nicht gibt. Der Wizard pflegt eigene, abweichende Werte (`main.js:294–488`). Modellzahl „30" gegen „40+" gegen „30+" (tatsächlich 22 Neu + 8 Gebraucht). Öffnungszeiten Kontakt gegen Schema `closes 17:00`. | **[LIBA]** liefert eine verbindliche Wahrheit aus den Datenblättern. Danach Übersicht, FAQ, Schema und Wizard **aus `maschinen.js` generieren**. Bis dahin konkrete Zahlen dort weglassen statt falsche strukturierte Daten auszuliefern. | ✅ (GM 140 H, GM 600 R, GM 6 ASR, GM 140 AS, 40/30) | D-06, R-03, R-14, F-13, G-19 |
| **H-3** | **Team-Seite öffentlich abrufbar** (`/team.html`, Status 200), mit KI-Porträts, „BEISPIEL"-Badges, fiktivem Geschäftsführer „Markus Berg (Beispiel)" und dem Terminbuchungs-CTA einer entfernten Funktion. Das Impressum nennt Thorsten Schrader. `noindex` schützt nicht vor Aufruf, Teilen oder Archivierung. | Bis zu echten, freigegebenen Inhalten `permalink: false` setzen und die Mockup-Bilder entfernen (E-4). Mit echten Fotos Einwilligungen der Abgebildeten einholen. | ✅ | R-07, G-03 |
| **H-4** | **Unsichtbare Tab-Stopps und Drawer ohne Dialog-Verhalten.** Fokus landet auf unsichtbaren Elementen: geschlossener Drawer (11 Links), FAB-Menü mit `aria-hidden` (axe auf 90 Seiten), Cookie-Buttons nach der Entscheidung, Scroll-Top, Hero-Dots, verborgene Wizard-Schritte. Der Drawer hat kein Escape, keine Fokusfalle und keinen Scroll-Lock. Der Banner ist erst nach 68 Tab-Schritten erreichbar. | Ein Muster „geschlossen = `inert`" für Drawer, FAB-Menü, Banner, Wizard-Panes und Scroll-Top. Drawer: Escape, Fokus auf den ersten Link, `overflow:hidden`. Banner beim Einblenden fokussieren. Aufwand ca. 1 Tag. | — (von 2 Agenten unabhängig gemessen) | G-02, G-08, G-09, G-27, F-08, F-14, F-16, F-20 |
| **H-5** | **Rechtstexte veraltet und lückenhaft.** *(Agent: Mittel; hochgestuft wegen offiziellem Launch und Abmahnrisiko)* Impressum: **§ 5 TMG** statt DDG (3×), §§ 7–10 TMG zitiert, Link auf die **seit 20.07.2025 eingestellte OS-Plattform**, Vertretungsverhältnis der GmbH & Co. KG unklar, MStV-Angabe fraglich. Datenschutz: **TTDSG** statt TDDDG (4×), veraltete Netlify-Adresse, `_gid`-Cookie (Universal Analytics), „IP wird gekürzt" (bei GA4 ungenau), § 26 BDSG für Bewerbungen umstritten, **Netlify als Hoster (USA) nicht beschrieben**, WhatsApp, E-Mail-Kontakt und Empfänger fehlen, Stand „Juni 2025". AGB: Freigabe durch LIBA nicht belegt. Außerdem läuft `/datenschutz.html` bei 375 px horizontal über. | Repo-Korrekturen der eindeutigen Punkte, **anwaltliche Prüfung** von Impressum, Datenschutz und AGB, AGB-Freigabe durch [LIBA]. `.prose a{overflow-wrap:anywhere}`. | ✅ (TMG, TTDSG, `_gid`, OS-Link) | R-09, R-10, R-11, R-12, F-11, G-22 |
| **H-6** | **GA4 würde vor der Einwilligung laden** (greift, sobald die echte ID gesetzt ist). `base.njk:39–45` bindet `gtag.js` bedingungslos ein. Gemessen mit Test-ID: `gtag/js` und `g/collect`-Pings **vor jeder Entscheidung und nach „Ablehnen"**, `_ga`-Cookies bleiben nach dem Widerruf. Das widerspricht Banner- und Datenschutztext. | E-3 umsetzen: Loader erst nach Zustimmung dynamisch nachladen, beim Widerruf Cookies löschen, 404-Seiten mitziehen. Banner nur zeigen, wenn GA4 aktiv ist. | ◐ (Code) | F-02, R-08, R-23 |
| **H-7** | **Startseite mobil LCP 5,0–5,2 s** (Performance-Score 66–80). Render-Delay 4,46 s durch die Masken-Animation der H1. Zusätzlich wird das Hero-Bild als **JPG** vorgeladen (`index.njk:13`), obwohl `hero-1.webp` existiert. | H1 ohne Masken-Transform beim ersten Paint, hero-1 als WebP im `<picture>` und im Preload, erstes Slide ohne Fade/Scale. Ziel LCP < 2,5 s. | ◐ (Preload JPG) | G-04 |
| **H-8** | **`/maschinen.html` wiegt 3,2 MB.** Die Kartenbilder sind Original-JPGs (u. a. 925/922/743/705/681 KB) ohne WebP, ohne `srcset` und ohne `width`/`height` (128 `<img>` seitenweit). Lighthouse beziffert 2,9 MB Einsparpotenzial. | Responsive WebP-Varianten (400/800/1200 w) per `@11ty/eleventy-img` oder Batch, `sizes` und Maße setzen. | ✅ | G-05 |
| **H-9** | **Vorschaubild und Favicon wirken nicht offiziell.** Das Default-og:image ist 1024×576 (statt 1200×630), ohne Logo und unscharf. Favicon und Apple-Touch-Icon zeigen **generisches Bagger-Clipart** statt LIBA. `favicon.ico` und Webmanifest fehlen. Das Logo ist ein 148-KB-PNG mit Artefakten, Farbe Petrol statt Navy. *(Agent: Mittel; hochgestuft, weil es der erste Eindruck in Tabs, Lesezeichen und Link-Vorschauen ist)* | Logo als SVG nachzeichnen lassen, daraus Favicon-Satz, `favicon.ico`, Manifest und OG-Motiv 1200×630 ableiten. Logofarbe festlegen [Entscheidung]. | ✅ (Clipart, fehlende Dateien) | G-01, G-14, G-15 |

### Betreiber-seitig

| ID | Befund | Empfehlung | Geprüft | Quelle |
|---|---|---|---|---|
| **H-10** | **Netlify Free-Plan mit harter Credit-Grenze.** Team „Luka Bloemendal", `type_name: Free`, 1 Mitglied. Credit-Modell mit 300 Credits/Monat: Sind sie aufgebraucht, **pausiert Netlify die Seite samt Formularen** bis zum nächsten Zyklus. Ein Broschüren-Download kostet 10,5 MB, und die robots.txt lädt KI-Crawler ausdrücklich ein. | Bezahlten Plan auf einem Firmenkonto abschließen (E-2), Usage-Warnungen aktivieren, Broschüren verkleinern (M-15). | ✅ | R-04 |
| **H-11** | **Konten und Formulardaten liegen privat beim Dienstleister.** Netlify-Team und GitHub-Repo gehören dem Privatkonto, einziger Owner und Collaborator. Dort landen auch **Bewerbungen mit Lebenslauf**. Ein AV-Vertrag LIBA ↔ Dienstleister/Netlify ist nicht belegt. Team-MFA ist nicht erzwungen. | E-2 umsetzen, AV-Vertrag abschließen, Team-MFA erzwingen, Übergabe-Betriebshandbuch erstellen (M-21). | ✅ (Team/Plan/Mitglieder) | R-05 |
| **H-12** | **Vollständige Kopie der Seite auf GitHub Pages öffentlich online** (`lukabpunkt.github.io/Lingener-Baumaschinen/`, Status 200, `pages.status: built`). Sie hat keine Security-Header, enthält die Team-Seite, und die Formulare dort melden Erfolg, speichern aber nichts. Canonical zeigt auf .de. Der als „deaktiviert" geführte Workflow lief am **13.08. manuell**. | GitHub → Settings → Pages → Unpublish, `.github/workflows/deploy.yml` löschen. | ✅ | R-06, D-10 |
| **H-13** | **Netlify-Nachbearbeitung verändert jede Seite.** „Pretty URLs" schreibt interne Links auf `/maschinen` usw. um. Folgen: 5 DE-Hauptseiten sind nur per 301-Umweg erreichbar, alle anderen Seiten zusätzlich unter nicht-kanonischen Adressen mit 200. Außerdem fügt Netlify einen **Werbe-Kommentar** („Anyone can build and deploy a site like this one for free…") und die Meta-Tags `hosting-provider` und `netlify-deploy` ein. *(Agent: Mittel; hochgestuft, weil Werbe-Einfügung auf einem Firmenauftritt und Doppel-URLs launchrelevant sind)* | Dashboard → Build & deploy → Post processing: „Pretty URLs" aus, Herkunft der Einfügung klären und abschalten. Danach Link-Crawl wiederholen. | ✅ | F-06, G-17 |
| **H-14** | **Redirect-Grundlage sichern, solange WordPress läuft (zeitkritisch).** Die Redirect-Map hat 82 Regeln. **1.136** WP-URLs aus den Yoast-Sitemaps haben keine Regel (421 Tag-Seiten, 351 Einzel-Slugs/Blog, 247 `/en/`, 81 ufaq …), `/wp-content/uploads/*` ist gar nicht erfasst. Einige WP-interne 301-Ziele fehlen ebenfalls, z. B. `/baggerfraese-gm-140-afh-500/`: auf WP Status 200, nicht in `redirects.js`. Für den Launch unter neuer Domain ist das **neutral**. Für den späteren Umzug sind die Daten aber nur so lange verfügbar, wie WordPress läuft. | **Jetzt** Search-Console-Exporte („Seiten", „Leistung 12 Monate", „Links → Top-Ziele") und alle Yoast-Sitemaps archivieren. Die Map erst vor dem Umzug vervollständigen (§7). | ✅ (1.136, Lücke `/baggerfraese-…`) | D-05 |

---

## 5. 🟡 Mittel

| ID | Befund | Empfehlung | Zust. | Quelle |
|---|---|---|---|---|
| M-1 | **HSTS `includeSubDomains; preload`** ist für eine Übergangsdomain und den späteren Umzug riskant. `webmail`, `mail` und `autodiscover` von .de zeigen auf ALL-INKL **ohne gültiges Zertifikat** (✅ gemessen). `preload` kann auch von Dritten eingereicht werden. | Zum Launch `max-age=31536000` **ohne** `includeSubDomains`/`preload`, nicht bei hstspreload.org einreichen. | [Repo] | D-07, R-16 |
| M-2 | **`main.js` bricht bei blockiertem localStorage komplett ab** (`localStorage.getItem` ohne try/catch, ✅). Banner, FAB, Filter, Kalkulator und Ankersprung fallen aus. | `safeGet`/`safeSet` mit try/catch, Features in eigene try-Blöcke. | [Repo] | F-03, R-23 |
| M-3 | **`?modell=` mit `%` löst URIError aus, der Rest von `main.js` läuft nicht mehr** (doppeltes Dekodieren, `main.js:267`, ✅). | `decodeURIComponent` entfernen. | [Repo] | F-04 |
| M-4 | **Anfrage-Vorbefüllung:** auf EN-Seiten deutscher Text, der Wizard übergibt den Slug statt des Modellnamens, der Wizard-CTA hat kein `#anfrage`. | Text nach `lang` wählen, `name`/`nameEN` übergeben, `#anfrage` anhängen. | [Repo] | F-05 |
| M-5 | **Ohne JavaScript sind fast alle Inhalte unsichtbar**, auch die Formulare (`.reveal` startet mit `opacity:0`). | `.js .reveal` statt `.reveal`, oder `<noscript><style>`. Zähler mit Endwert rendern. | [Repo] | F-07, G-26 |
| M-6 | **EN-Zahlenformat:** 30 EN-Maschinenseiten mit deutschen Tausenderpunkten (229 Textstellen, 143 JSON-LD-Werte). `valEN` deckt nur 59/263 Werte ab. Die EN-Zähler zeigen „1.000+". | Beim Rendern lokalisieren (Filter), `toLocaleString` nach `lang`. | [Repo] | R-15, F-17, G-26 |
| M-7 | **FAQPage-Schema ohne sichtbaren FAQ-Inhalt:** Auf `/maschinen.html` sind 4 von 7 Fragen unsichtbar und die Antworten weichen ab. `/unternehmen.html` hat Schema, aber keine FAQ-Sektion. | Schema aus denselben Daten wie die sichtbare FAQ erzeugen, bei Unternehmen entfernen oder FAQ ergänzen. | [Repo] | D-08 |
| M-8 | **Product-Schema ohne `offers`/`review`/`aggregateRating`.** Für Product-Snippets ist das ungültig, Search Console wird es melden. | Bewusst entscheiden und den Kommentar in `maschinenseiten.js:145` korrigieren. | [Entscheidung] | D-09 |
| M-9 | **Werbeaussagen nicht bestätigt:** „3 Mietgeräte sofort verfügbar", „Lieferung 48 h", „Hotline 24/7", „100 % anrechenbar", „dritte Generation", „60 Länder", Tagesleistung GM 4 Raupe 800 gegen 1.000 m. | [LIBA] bestätigt schriftlich, sonst entschärfen (§ 5 UWG). | [LIBA] | R-13 |
| M-10 | **Kontraste:** `--steel-500` auf Papier 4,35:1 (85 Seiten), **Badge „Sofort verfügbar" 1,3–1,5:1** (`#4ade80`, ✅), Wizard-Beschreibung 3,42:1, `--brand-light`-Kicker über hellen Fotos. | `--steel-600` auf hellem Grund, Grün `#15803D`, Wizard `--steel-400`, Foto-Overlay abdunkeln (4–6 Zeilen CSS). | [Repo] | G-06, G-07, G-09, G-10 |
| M-11 | **Startseiten-Hero:** Der Scroll-Hinweis überdeckt „1969" (ab 900 px), die H1 bricht bei 1920 px mit „Wir" allein in der ersten Zeile um, der FAB liegt auf den Slide-Dots. | Scroll-Hinweis streichen, H1-Breite in `ch` begrenzen, FAB erst nach dem Hero einblenden. | [Repo] | G-11 |
| M-12 | **ROI-Ergebnisbox zerbricht bei 375 px** (Satz in einer 80-px-Spalte). | Unter 560 px `flex-direction: column`. | [Repo] | G-12 |
| M-13 | **Druckansicht der Maschinenseiten taugt nicht als Datenblatt:** 4 Seiten ohne Logo, Foto und FAQ-Antworten, gemischte Schriften. | Eigenes Druck-Layout, 1–2 Seiten. | [Repo] | G-13 |
| M-14 | **Bildkarten mit Leerflächen und uneinheitlichen Höhen** (Galerie, Referenzen). Das Flaggschiff-Foto GM 180 AF ist unscharf und hat einen Fremdkörper am Rand. | Feste `aspect-ratio` + `object-fit`, [LIBA] liefert ein scharfes Foto. | [Repo]/[LIBA] | G-18 |
| M-15 | **Broschüren-PDFs je 10,5 MB** als erzwungener Download ohne Größenangabe. Enthalten zudem die Marke „Grabenmeister" und offene Modellnamen-Fragen. | Web-Fassung ca. 2–3 MB, Größe im Link nennen, `download` entfernen. Offene Broschüren-Fragen klären. | [Betreiber]/[LIBA] | G-16, R-26 |
| M-16 | **Formular-Details:** Nur-Leerzeichen-Eingaben werden akzeptiert, Statusmeldung mobil außerhalb des Viewports, PDF-Prüfung ohne MIME umgehbar, kein `autocomplete`, Checkbox 13 px, uneinheitliche `*`, sprachgemischte Modellwerte, nativer Datei-Button. | Siehe F-15/G-20: `pattern`/`trim`, `scrollIntoView`, Endungsprüfung, `autocomplete`, Styles. | [Repo] | F-15, G-20 |
| M-17 | **Bewerbungs-Upload** wird nur clientseitig geprüft, Dateien liegen in den USA (`us-east-2`). Die zugesagte 6-Monats-Löschung hat keinen Prozess. | Löschroutine mit verantwortlicher Person festlegen, Empfänger sensibilisieren, ggf. Upload durch E-Mail ersetzen. | [Betreiber] | R-18 |
| M-18 | **Netlify-Einstellungen per API nicht prüfbar:** Deploy-Benachrichtigung bei Fehlschlag, Deploy Previews für Fork-PRs (Repo ist öffentlich), Branch-Deploys, Spamfilter, Credit-Verbrauch. Alte Deploys bleiben unter öffentlichen Permalinks erreichbar. | Im Dashboard prüfen und dokumentieren, Fork-Previews aus. | [Betreiber] | R-19 |
| M-19 | **Keine Custom Domain eingetragen** (`primarySiteUrl` = netlify.app). Nach dem Eintragen prüfen, ob `*.netlify.app` per 301 auf die Primary Domain leitet und Deploy Previews `noindex` bekommen (B-1). | Nach E-1 und B-1 einrichten, per curl verifizieren. | [Betreiber] | R-19, D-10 |
| M-20 | **Öffentliches Repo:** interne Betriebsdoku (Site-ID, MX-Host/IP, „DKIM fehlt/DMARC p=none" als Spoofing-Hinweis), private Autor-Adresse in 146 Commits. **Kein Branch-Schutz, Dependabot aus** (✅). | E-6; Branch Protection + Dependabot Alerts/Updates aktivieren. | [Betreiber] | R-17 |
| M-21 | **Doku veraltet und widersprüchlich:** Alle Checklisten gehen vom Launch direkt auf .de aus, README-Tokens noch Teal, CLAUDE.md beschreibt GitHub Pages, `GO-LIVE-Checkliste.md` seit 17.08. uncommitted, `design/` untracked, **veraltete Zweitkopie `~/Documents/LIBA Website`** mit demselben origin. | Ein aktuelles **Betriebshandbuch** (Konten, Deploy/Rollback, Formulare/Löschroutine, Domain/DNS/Mail, Inhaltspflege, Kosten, Notfall), Checklisten auf die neue Strategie umschreiben, Zweitkopie löschen. | [Repo]/[Betreiber] | R-20 |
| M-22 | **Umzugsablauf nirgends beschrieben:** Reihenfolge der Host-Regeln (müssen vor den 82 Pfadregeln stehen), Domain-Alias statt Primary, Change-of-Address. | Ablauf aus §7 in die Doku übernehmen, Host-Regeln per Env generieren (Teil von B-1). | [Repo] | D-11 |
| M-23 | **Gebrauchtbestand** (8 Maschinen) ohne Stand-Datum und ohne Pflegeprozess für Verkäufe. | [LIBA] bestätigt den Bestand, Pflegeverantwortung festlegen. | [LIBA] | R-24 |
| M-24 | **Kategorien inkonsistent:** Tiefenfräsen im Datensatz „Schlepperanbau" (Schema „Tractor-Mounted"), in der Übersicht „Spezialmaschinen". GM 1800 P ist „Selbstfahrer", aber in der Übersicht „Großpflug". | Kategorie-Modell festlegen, ggf. Kategorie „Tiefenfräse". | [LIBA]/[Repo] | R-14 |
| M-25 | **404-Seiten mobil ohne Navigation, Footer, Impressum-Link, Cookie-Einstellungen und Sprachumschalter.** | Minimal-Footer und Nav/Toggle ergänzen. | [Repo] | F-10 |

---

## 6. 🟢 Niedrig

| ID | Befund | Empfehlung | Quelle |
|---|---|---|---|
| N-1 | 41/80 Titles > 60 Zeichen, 12 Descriptions > 160 | Maschinen-Titles kürzen | D-13 |
| N-2 | Sitemap-`lastmod` auf Netlify überall = Deploy-Datum | `git Last Modified` oder weglassen | D-14 |
| N-3 | Breadcrumbs verlinken `/index.html` (200-Duplikat) | auf `/` bzw. `/en/` | D-15 |
| N-4 | Organisations-Entität uneinheitlich (`LocalBusiness`/`Organization`, 17 kopierte Blöcke) | ein Knoten aus `_data/organization.js` (mit B-1) | D-16 |
| N-5 | Impressum ist `noindex` (für B2B-Entität eher nachteilig); Relaunch-SEO-Checkliste behauptet anderes | [Entscheidung], Checkliste korrigieren | D-17 |
| N-6 | KI-Crawler-Politik gegenteilig zu WordPress (Google-Extended erlaubt gegenüber gesperrt) | [Entscheidung] | D-18 |
| N-7 | Druck-Fußzeile nennt fest „lingener-baumaschinen.de" (`main.css:2880`) | [Entscheidung], ggf. aus `site.url` | D-19 |
| N-8 | Hero-Slider-Punkte 2 px hoch und überdeckt, nicht klickbar | Trefferfläche ≥ 24 px, `z-index` | F-12 |
| N-9 | ROI-Rechner: „Sie sparen 0 €" bei Gleichstand; Miet-CTA ohne Vorbefüllung | Gleichstand texten, CTA mit `?betreff=Miete…#anfrage` | F-18 |
| N-10 | WhatsApp-Link auf Festnetznummer, Funktion unbestätigt | [LIBA] bestätigt WhatsApp Business oder Link entfernen | F-19, R-25 |
| N-11 | CSP erlaubt Stripe (nirgends genutzt, ✅), `img-src https:` zu breit | Stripe-Origins entfernen, `img-src 'self' data:` | R-21 |
| N-12 | `npm audit`: 4× high in Build-Abhängigkeiten, Fix verfügbar (✅) | `npm audit fix` im Branch, Build prüfen | R-22 |
| N-13 | Alle Assets `max-age=0` (keine Cache-Strategie) | Fonts `immutable`, Bilder 7 Tage | G-21 |
| N-14 | FAB und Scroll-Top überdecken mobil Inhalte | FAB mobil kompakter, erst nach dem Hero | G-23 |
| N-15 | Kontaktseite h1 → h3 | versteckte h2 „Kontaktwege" | G-24 |
| N-16 | `.lang-switch` `aria-label` ohne Rolle | `role="group"`, `aria-current` | G-25 |
| N-17 | CSS/JS render-blockierend, unminifiziert; Fonts nicht vorgeladen | Minify-Transform, Hero-Fonts preloaden | G-28 |
| N-18 | Consent-Banner erscheint, obwohl GA4 inaktiv ist; spricht von „Cookies", obwohl nur localStorage genutzt wird | an GA4-Aktivierung koppeln (mit H-6) | R-23, F-16 |
| N-19 | WordPress-Redirect-Regeln unter der neuen Domain neutral (keine Aktion, für den Umzug behalten) | — | D-12 |

---

## 7. Späterer Umzug neue Domain → lingener-baumaschinen.de

**Voraussetzung:** B-1 umgesetzt (Domain per Variable), H-14 und die Redirect-Map vervollständigt, M-1 Subdomains geklärt.

1. **T−8 bis T−4 Wochen:**
   - Search-Console-Exporte und Yoast-Sitemaps (falls noch nicht geschehen).
   - Redirect-Map vervollständigen: Top-Blogposts, `/en/`, `/wp-content/uploads/`-PDFs, Splats für `/tag/`, `/category/`, `/author/`, `/ufaq/`, WP-interne 301-Ziele.
   - Jede exportierte URL gegen eine Deploy Preview prüfen: 301 → 200, genau 1 Sprung.
   - DNS-TTL auf 300 s senken.
   - HSTS vorübergehend kurz und ohne `includeSubDomains`.
2. **T−1 Woche:** `lingener-baumaschinen.de` + `www` in Netlify hinzufügen, Zertifikat vorbereiten.
3. **T0:**
   - Commit in `netlify.toml`: `SITE_URL=https://lingener-baumaschinen.de`, `SITE_NOINDEX` entfernen, `SITE_ALIAS_HOSTS=<neue-domain>,www.<neue-domain>`.
   - .de als **Primary**, neue Domain bleibt **Alias** (sonst greifen die Host-Regeln nicht).
   - DNS von apex und www auf Netlify. **MX, SPF, DKIM, DMARC und `google-site-verification` unverändert lassen.**
4. **Prüfen:**
   - `https://<neu>/maschinen/gm-6-asr.html` → 301 auf .de mit genau 1 Sprung, ebenso `http://` und `www.`.
   - Alte WP-Slugs auf .de → 301 auf die neue Seite.
   - Canonical, Sitemap und robots auf .de.
5. **Search Console:**
   - Bei E-1 **Variante B** „Adressänderung" von der neuen Domain auf .de.
   - Bei **Variante A** ist das nicht nötig; der Umzug ist dann aus Google-Sicht ein Relaunch auf derselben Domain.
   - Neue Sitemap einreichen.
6. **Danach:**
   - 4–8 Wochen 404/Abdeckung beobachten und Redirects nachpflegen.
   - HSTS schrittweise anheben.
   - Die neue Domain **≥ 12 Monate** behalten, Host-Regeln aktiv lassen.
   - WordPress erst nach vollständiger DNS-Umstellung und gesicherten Exporten abschalten.

---

## 8. Test-Einsendungen zum Löschen (Netlify → Forms, inkl. Spam-Ordner)

Name „TEST Launch-Audit", E-Mail `test-launch-audit@example.com`, alle Textfelder „TEST – Launch-Audit 2026-09-15 – bitte ignorieren". Uhrzeiten MESZ.

| # | Formular | Sprache | Uhrzeit | Hinweis |
|---|---|---|---|---|
| 1 | `kontakt` | DE | ca. 12:58 | Statuscode nicht protokolliert (Skript hing), laut API angekommen |
| 2 | `kontakt` | EN | 13:05:48 | 200 |
| 3 | `gebrauchtmaschine` | DE | 13:05:54 | 200 |
| 4 | `bewerbung` | DE | 13:05:59 | 200, Anhang `TEST-Launch-Audit-2026-09-15.pdf` |

API-Stand nach den Tests: `last_submission_at` 11:05–11:06 UTC bei allen drei Formularen. Die Zähler stehen bei 1/0/0, bitte daher auch **Spam** prüfen. Landen die Einträge dort, ist das zugleich ein Befund für den Spamfilter.

---

## 9. Empfohlene Reihenfolge

1. **Entscheidungen E-1 bis E-6** (Luka + LIBA).
2. **Sofort, weil zeitkritisch oder schnell:**
   - H-14 Exporte sichern
   - H-12 GitHub Pages abschalten
   - H-13 Pretty URLs aus
   - B-2 Formular-Benachrichtigungen einrichten und testen
   - Test-Einträge löschen
3. **Repo-Runde 1 (Launch-kritisch, ca. 2–3 Tage):**
   - B-1 Domain-Architektur mit `noindex`-Schalter
   - H-1 Nav-Breakpoint
   - H-3 Team-Seite raus
   - H-4 Tastatur-Muster
   - H-6 Consent
   - H-7/H-8 Performance und Bilder
   - M-1 HSTS
   - M-2/M-3 Robustheit
   - M-10 Kontraste
   - N-11 CSP
   - N-12 `npm audit`
4. **Parallel bei LIBA:**
   - H-2 technische Daten
   - M-9 Werbeaussagen
   - M-23 Gebrauchtbestand
   - N-10 WhatsApp
   - AGB-Freigabe
   - Fotos und Logo als Vektor (H-9)
5. **Recht:** H-5 korrigieren und anwaltlich prüfen lassen.
6. **Konten und Plan:**
   - H-10/H-11 Firmenkonto, bezahlter Plan, AV-Vertrag, MFA
   - M-20 Repo privat/Branch-Schutz
7. **Repo-Runde 2:**
   - H-2 Daten aus einer Quelle
   - H-9 Icons/OG
   - M-4 bis M-8
   - M-11 bis M-16
   - M-25
   - Niedrig-Punkte
8. **Launch-Tag:**
   - Neue Domain registrieren (auf LIBA)
   - In Netlify als Primary eintragen
   - DNS setzen, SSL prüfen
   - `SITE_URL` setzen und deployen
   - `check:domain` grün
   - curl-Stichproben: Canonical, og:image, netlify.app → 301
   - GA4-ID eintragen (erst nach H-6)
   - Search-Console-Property für die neue Domain
   - M-21 Betriebshandbuch übergeben

---

## 10. Abgleich mit den alten Reports (Kurzfassung)

- **Bestätigt behoben:**
  - 0 kaputte Links und Anker
  - Sprachumschalter
  - Calendly vollständig entfernt
  - CSP ohne Inline-Skripte (auch mit GA4-Test-ID 0 Verstöße)
  - Security-Header auf Netlify
  - Ankersprung
  - iOS-Fixed-Elemente
  - alte Kontrastfehler MA-11/12
  - Alt-Texte
  - Heading-Sprünge der Rechtsseiten
  - `og:type=product`
  - GM 450 H durchgehend 4.500 mm
  - Gründungsjahr 1969
  - keine Secrets
- **Bestätigt offen:** EN-Zahlenformat (PL-4, jetzt beziffert), „GM 140 AS", Formular-Benachrichtigung, Team-Seite, Produktbildgrößen (MA-19), README-Tokens, Dependabot/Branch-Schutz, DKIM/DMARC.
- **Widerlegt bzw. korrigiert:**

| Alte Aussage | Stand heute |
|---|---|
| „Mobile-Nav/Responsive sauber" | 1024–1099 px ohne Navigation |
| „0 horizontaler Overflow" | Datenschutz 386 px |
| „FAQPage-Text = sichtbare FAQ" | nicht für Maschinen-/Unternehmensseite |
| „Product ohne Offer valide" | für Product-Snippets nicht |
| „einzige noindex-Seite ist Team" | auch Impressum, Datenschutz, AGB |
| „deploy.yml deaktiviert" | manueller Pages-Deploy am 13.08. |
| „Impressum/Datenschutz erledigt" | TMG/TTDSG, OS-Plattform |
| „js-yaml moderate, kein Fix" | 4× high, Fix verfügbar |
| „GA4 aktivieren: nichts weiter zu tun" | Consent-Verhalten widerspricht Datenschutztext |

- **Überholt:** Alle Go-Live-Anleitungen, die DNS direkt auf .de umstellen, gelten für die neue Strategie nicht mehr.
- **Neu:**
  - Domain-Einkodierung
  - Netlify-Plan und Kontenfrage
  - GitHub-Pages-Kopie
  - Netlify-Werbe-Einfügung und Pretty URLs
  - Tastaturfallen
  - LCP-Ursache H1-Maske
  - Favicon-Clipart
  - Druckansicht
  - Werbeaussagen
  - Bewerbungs-Löschprozess
  - HSTS gegenüber ALL-INKL-Subdomains

---

*Detail-Reports der vier Agenten (mit allen Belegen, Skripten und Screenshots) liegen temporär im Scratchpad dieser Sitzung: `…/scratchpad/audit/1-domain-seo.md`, `2-funktionen.md`, `3-design-a11y-perf.md`, `4-inhalt-recht-betrieb.md`, sowie `work-*`, `shots-*`.*
