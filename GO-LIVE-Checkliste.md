# GO-LIVE-Checkliste — LIBA Website

> Alle Punkte, die **vor dem echten Launch** auf `lingener-baumaschinen.de` noch erledigt werden müssen.
> Stand: 2026-07-27. Detail-Berichte im Repo: `QA-Prelaunch.md`, `Security-Audit.md`, `DE-EN-Parity.md`, `CLAUDE.md` (Migrations-Handover).
> **Schritt-für-Schritt-Anleitung zu allen [Betreiber]-Punkten (wo finde ich was?): → `Zulieferungen-Checkliste.md`**
> Legende: **[Betreiber]** = du (Dashboard/DNS/Konto) · **[Repo]** = im Code (mache ich auf Zuruf).

---

## 🔴 MUSS vor Go-Live (sonst funktioniert die Seite produktiv nicht / Schaden)

- [ ] **Netlify-Hosting einrichten** — Repo `lukabpunkt/Lingener-Baumaschinen` mit Netlify verbinden, **apex `lingener-baumaschinen.de` als Primary Domain** (www→apex-301 automatisch). **[Betreiber]**
  - Wichtig: **Formulare, 301-Weiterleitungen UND Security-Header funktionieren NUR auf Netlify** — die jetzige GitHub-Pages-Vorschau kann das alles systembedingt nicht.
- [ ] **DNS auf Netlify umstellen** (als letzter Schritt) — Domain vom alten WordPress auf Netlify zeigen lassen. **[Betreiber]**
- [ ] **Netlify Forms scharfschalten** — nach erstem Deploy im Dashboard → Forms eine **Benachrichtigungs-E-Mail** einrichten, sonst landen Anfragen nur im Dashboard, nicht im Postfach. Betrifft **drei Formulare**: `kontakt`, `gebrauchtmaschine` und `bewerbung` (Karriere-Seite, seit 2026-07-10; Empfänger für Bewerbungen ggf. Personalverantwortliche/r statt info@). **[Betreiber]**
- [ ] **Redirect-Map vervollständigen** — vollständige alte URL-Liste aus **Google Search Console** („Seiten"-Export) **+ alten Yoast-Sitemaps** holen (⚠ zeitkritisch: Sitemaps verschwinden mit WordPress-Abschaltung!); damit `src/_data/redirects.js` ergänzen und die ⚠-Einträge prüfen. Sonst verlieren indexierte alte URLs ihr Ranking. **[Betreiber liefert Export → Repo setzt um]** · Anleitung: `Zulieferungen-Checkliste.md` Punkt 1 · Details: `QA-Prelaunch.md`, `CLAUDE.md` §5
  - Verifiziert 2026-07-09: `/traktorfraese-gm-1-as/` leitet auf `gm-1-af.html`, obwohl `gm-1-as.html` existiert — welche alte Produktseite zu welchem neuen Modell gehört (GM 1 AS/AF, GM 140 AS), kann nur LIBA sagen → `Zulieferungen-Checkliste.md` Punkt 3.2/3.3.
- [ ] **Team-Seite klären** — seit Juli mit **KI-Mockup-Portraits als Beispiel** gefüllt (keine `[Name]`-Platzhalter mehr). KI-Portraits als „unser Team" live zu stellen ist riskant. **Technisch bereits abgesichert (2026-07-27):** `noindex: true` in `src/team.njk` gesetzt → damit automatisch auch aus der Sitemap raus; kein Link mehr in Nav, Footer **oder** auf der Unternehmensseite (der CTA „Team kennenlernen" wurde entfernt). **Offen ist nur noch die inhaltliche Entscheidung:** echte Bios/Fotos liefern **[Betreiber]** — dann `noindex` **und** den CTA in `src/unternehmen.njk` zusammen zurücknehmen — oder die Seite dauerhaft so lassen. · `Zulieferungen-Checkliste.md` Punkt 5

---

## 🟡 WICHTIG vor / direkt nach Go-Live

- [ ] **GA4-Mess-ID eintragen** — echte `G-…`-ID aus Google Analytics (Web-Datenstrom) → ich trage sie in `src/_data/site.js` ein. Ohne sie: keine Besucherstatistik. **[Betreiber liefert ID → Repo]**
  - Technisch vorbereitet: die CSP deckt seit 2026-07-27 auch die regionalen GA4-Endpunkte ab (S-10), und die beiden 404-Seiten nutzen jetzt `ga4-init.js` statt Inline-Skripten — beim Aktivieren ist also nichts weiter zu tun.
  - Optional dabei: strenge Variante „`gtag.js` erst nach Zustimmung laden" (kein Google-Kontakt vor Consent). **[Repo]**
- [ ] **Sitemap in Search Console einreichen** (nach Go-Live) — `https://lingener-baumaschinen.de/sitemap.xml`; Property behalten, Index-Abdeckung + 404-Report 4–8 Wochen beobachten. **[Betreiber]**
- [ ] **E-Mail-Authentifizierung SPF / DKIM / DMARC** für `lingener-baumaschinen.de` einrichten/prüfen (Schutz vor Spoofing, bessere Zustellung der Form-Mails). **[Betreiber]** · Details: `Security-Audit.md` S-1
- [ ] **Security-Header auf Netlify-Staging verifizieren** — `curl -I` gegen den Netlify-Deploy: CSP/HSTS/X-Frame etc. wirklich ausgeliefert; 301-Stichproben (Status 301 + Location); www→apex; keine CSP-Verstöße in der Konsole. **[Repo/Betreiber gemeinsam]** · `Security-Audit.md` E1–E5

---

## 🟢 EMPFOHLEN / Härtung (kein Blocker)

**Security – Repo (mache ich auf Zuruf):**
- [x] **CSP härten** — erledigt 2026-07-09: `'unsafe-inline'` aus `script-src` entfernt, indem **alle Inline-Skripte ausgelagert** wurden (Calendly-Gate, Tab-Filter, Kalkulator → `main.js`; GA4-Snippet → `ga4-init.js` mit `data-ga4`-Attribut, hält auch nach GA4-Aktivierung); `object-src 'none'` + `upgrade-insecure-requests` ergänzt (`netlify.toml`). · `Security-Audit.md` S-2/S-4
  - ⚠️ **Nachtrag 2026-07-27:** Die damalige Aussage „0 Inline-Skripte über alle 90 Seiten" galt nur bei **deaktiviertem** GA4. `src/404.njk` und `src/en/404.njk` nutzen bewusst nicht `base.njk` und trugen hinter dem GA4-Guard weiterhin Inline-Blöcke — die beim Setzen der echten Mess-ID von der CSP geblockt worden wären. Jetzt behoben; **verifiziert mit gesetzter Test-Mess-ID**: 0 Inline-Skripte auf allen 90 Seiten, `ga4-init.js` auf allen 90.
- [x] **GA4 `connect-src`** — erledigt 2026-07-27: `*.google-analytics.com` und `*.analytics.google.com` ergänzt; GA4 sendet an regionale Endpunkte, die sonst geblockt würden. · S-10
- [x] **GitHub Actions auf Commit-SHA pinnen** — erledigt 2026-07-09 (`deploy.yml`, alle 5 Actions mit `# vN`-Kommentar). · S-3
- [x] **Wizard-CTA** `encodeURIComponent(r.modell)` — erledigt 2026-07-27. Dabei die zwei vor-encodierten Datenwerte (`…-Sonderl%C3%B6sung`) auf Klartext-Umlaute zurückgeführt, sonst wäre Doppel-Encoding entstanden. · S-13

**Security – Betreiber (GitHub-Einstellungen / DNS):**
- [ ] **GitHub:** Dependabot-Alerts + Secret-Scanning/Push-Protection + Branch-Protection auf `main` aktivieren. **[Betreiber]** · S-2/C2
- [ ] **DNS:** CAA-Record (`letsencrypt.org`) + DNSSEC. **[Betreiber]** · S-5
- [ ] **HSTS-`preload`** erst bei hstspreload.org einreichen, wenn alle Subdomains HTTPS können (dauerhafte Verpflichtung). **[Betreiber]** · S-6
- [ ] **Netlify-Spam:** Akismet im Forms-Bereich aktivieren. **[Betreiber]** · S-7

**Content / SEO / Performance – Repo:**
- [x] **EN-Zahlenformat** — Prüfung 2026-07-09: war bereits behoben (EN durchgehend „1,600 mm"-Format). · QA-Prelaunch PL-4
- [x] **`og:type=product`** auf Maschinenseiten — erledigt 2026-07-27: Override-Hook in `base.njk` (`{{ ogType if ogType else 'website' }}`), `maschine.njk` setzt `ogType: "product"`. 60 Maschinenseiten `product`, die übrigen 28 unverändert `website`. · MI-11
- [x] **GM 450 H Frästiefe vereinheitlicht** — erledigt 2026-07-27: Spec-Tabelle und Wizard sagten 4.500 mm, 16 Übersichtsstellen (inkl. FAQPage-Schema DE+EN, `llms.txt`, Seitentitel) sagten 3.000 mm. Auf **4.500 mm** vereinheitlicht — die 3.000 stammt vom GM 300 H. ⚠ Datenblattwert noch von LIBA bestätigen lassen: `Zulieferungen-Checkliste.md` Punkt 3.7.
- [x] **FAQ-Schema: „Händlerübersicht"** — erledigt 2026-07-27: Das Schema verwies auf eine Seite, die es nicht gibt (`/haendler/` → 301 auf Kontakt). Auf den tatsächlichen Weg umformuliert (DE+EN). ⚠ Der zweite Schema-Fehler — „GM 140 AS" als lieferbares Modell — bleibt offen bis zur Produktauskunft: `Zulieferungen-Checkliste.md` Punkt 3.2.
- [x] **A11y Heading-Struktur** — erledigt 2026-07-27: Impressum, Datenschutz **und** AGB sprangen von `h1` direkt auf `h3`. Abschnittsüberschriften auf `h2` gehoben; `.prose`-Regel in `main.css` gilt jetzt für `h2, h3`, damit die Optik unverändert bleibt. · QA-Prelaunch PL-5
- [x] **EN-Formular-Checkbox** — erledigt 2026-07-27: `value="akzeptiert"` wurde auch auf englischen Seiten übermittelt; jetzt sprachabhängig in allen drei Formularen. · QA-Prelaunch PL-7
- [x] **Performance Maschinenseiten** — erledigt 2026-07-09: Hero-Hintergründe (geblurrt/abgedunkelt gerendert) laden jetzt stark verkleinerte `-bg.webp`-Varianten (900px, bis −90 % Dateigröße) statt voller JPGs, plus `<link rel="preload" fetchpriority="high">` auf 80 Seiten (60 Maschinen + statische Heroes). Neues Feld `heroBg` in `maschinenseiten.js`. · QA-Prelaunch
- [x] **`referenzen` og:description** — erledigt 2026-07-09: „DN400" → „DN 300" (an Seiteninhalt angeglichen, DE+EN). Echten Projektwert bestätigen lassen: `Zulieferungen-Checkliste.md` Punkt 3.4.
- [x] **deploy.yml** — deaktiviert seit Netlify-Umzug (`workflow_dispatch`, nur manuell) + 2026-07-09 SHA-gepinnt. Löschen optional nach Go-Live.
- [x] **Sitemap `<lastmod>`** — ergänzt 2026-07-09 (neuer `isoDate`-Filter in `.eleventy.js`, alle 78 URLs).
- [x] **EN-Rechtszitat** — ergänzt 2026-07-09: „i. V. m. § 25 Abs. 1 TTDSG" im EN-GA4-Abschnitt (`datenschutz.njk`); übrige Zitate waren bereits synchron.

---

## ✅ Bereits erledigt (zur Info — nicht erneut machen)

**Bis 2026-06-26:**
- Formulare auf **Netlify Forms** umgestellt (kein Formspree mehr) · **Calendly** hinter Klick-Consent · **Fonts self-hosted** · Product-Schema ohne preislosen Offer · **Impressum-Pflichtangaben** (HRA 100224 / HRB 100012 / USt DE154279934 / GF Thorsten Schrader) · Datenschutz an echte Technik angepasst · Security-Header in `netlify.toml` angelegt · A11y-Fixes · **DE/EN inhaltlich synchronisiert** + idiomatisches Englisch · Hero-Aufwertung · diverse Pre-Launch-Bugfixes (Off-Domain-Link, Calendly-Kontrast u. a.) · Broschüren 2026 (DE+EN) eingebunden · Team-Seite mit KI-Mockups befüllt (Beispiel).

**2026-07-09 (Fix-Runde, Details oben bei den abgehakten Punkten):**
- **Hero-LCP:** alle Hero-Hintergründe auf kleine `-bg.webp` (−70…90 %) + Preload/`fetchpriority` auf 80 Seiten.
- **CSP ohne `unsafe-inline`:** alle 4 Inline-Skripte nach `main.js`/`ga4-init.js` ausgelagert; `object-src 'none'`, `upgrade-insecure-requests`.
- **DN400 → DN 300** in `referenzen.njk` og:description (DE+EN).
- **EN-TTDSG-Zitat** in `datenschutz.njk` ergänzt.
- **Sitemap `<lastmod>`** für alle URLs (Filter `isoDate`).
- **GitHub Actions SHA-gepinnt** in `deploy.yml`.
- **`Zulieferungen-Checkliste.md` erstellt** — Schritt-für-Schritt-Anleitung für alle Betreiber-Zulieferungen (Search-Console-Export, GA4-ID, Firmenfakten, Netlify/DNS …).
- Nebenbefunde: EN-Zahlenformat war schon korrekt; robots.txt-Host schon apex; Root-sitemap.xml/robots.txt schon entfernt; www→apex-Migration im Code vollständig.

**2026-07-27 (Repo-Restarbeiten — alles, was ohne Betreiber-Zulieferung ging):**
- **404-Seiten:** Inline-GA4-Skripte ausgelagert (CSP-Zeitbombe entschärft), `connect-src` um regionale GA4-Endpunkte erweitert.
- **GM 450 H:** Frästiefe durchgehend 4.500 mm (16 Fundstellen, DE+EN, inkl. strukturierter Daten).
- **FAQ-Schema:** Verweis auf nicht existierende „Händlerübersicht" korrigiert.
- **`og:type=product`** auf allen 60 Maschinenseiten.
- **Wizard-CTA:** `encodeURIComponent` + Rückbau der vor-encodierten Werte.
- **Team-Seite:** CTA auf der Unternehmensseite entfernt, begleitender Text angepasst (DE+EN).
- **Formulare:** EN-Checkbox-Wert lokalisiert (3 Formulare).
- **A11y:** Heading-Sprung h1→h3 auf allen drei Rechtsseiten behoben.
- **Doku:** README komplett neu (beschrieb noch eine Site ohne Build-Tools), Checklisten-Häkchen in `Security-Audit.md`, `QA-Prelaunch.md` und `Relaunch-SEO-Checkliste.md` nachgezogen.
- **Nicht angefasst** (braucht LIBA): „GM 140 AS" im FAQ-Schema, die 6 ⚠-Redirects, Bestätigung der 4.500 mm.

**2026-07-16:**
- **Gründungsjahr geklärt: 1969 ist korrekt** (Betreiber-Bestätigung). Website war durchgängig korrekt (0× „1964"); auch die eingebundenen Broschüren-PDFs 2026 sagen bereits „1969" / „Über fünf Jahrzehnte" → Punkt vollständig erledigt (`Zulieferungen-Checkliste.md` 3.1 ✅, `Broschuere-Analyse.md` B-1 ✅).
- Mobile-Fix: fixierte Elemente (Scroll-Progress u. a.) auf iOS korrigiert (page-enter auf `<main>` statt `<body>`); Startseiten-Slogan: Zeilenabstände vereinheitlicht (DE == EN, WebKit-verifiziert); Karriere-Button im Hero der Unternehmensseite.

---

### Schnell-Reihenfolge fürs Go-Live
1. ~~Repo-Restarbeiten~~ ✅ erledigt 2026-07-27 — offen ist nur noch die **inhaltliche** Entscheidung zur Team-Seite.
2. **Netlify** verbinden → Deploy-Preview → Header/Forms/Redirects testen.
3. Search-Console-Export → Redirect-Map vervollständigen.
4. GA4-ID + SPF/DKIM/DMARC + DNS (CAA/DNSSEC).
5. **DNS auf Netlify umstellen** (Go-Live) → Sitemap in Search Console → 4–8 Wochen Monitoring.
