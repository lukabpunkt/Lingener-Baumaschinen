# GO-LIVE-Checkliste — LIBA Website

> Alle Punkte, die **vor dem echten Launch** auf `lingener-baumaschinen.de` noch erledigt werden müssen.
> Stand: 2026-07-10. Detail-Berichte im Repo: `QA-Prelaunch.md`, `Security-Audit.md`, `DE-EN-Parity.md`, `CLAUDE.md` (Migrations-Handover).
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
- [ ] **Team-Seite klären** — seit Juli mit **KI-Mockup-Portraits als Beispiel** gefüllt (keine `[Name]`-Platzhalter mehr). KI-Portraits als „unser Team" live zu stellen ist riskant → vor Launch **entweder echte Bios/Fotos einsetzen** **[Betreiber liefert Inhalte]** **oder** Seite auf `noindex` + aus Nav/Footer entlinken **[Repo]**. · `Zulieferungen-Checkliste.md` Punkt 5

---

## 🟡 WICHTIG vor / direkt nach Go-Live

- [ ] **GA4-Mess-ID eintragen** — echte `G-…`-ID aus Google Analytics (Web-Datenstrom) → ich trage sie in `src/_data/site.js` ein. Ohne sie: keine Besucherstatistik. **[Betreiber liefert ID → Repo]**
  - Optional dabei: strenge Variante „`gtag.js` erst nach Zustimmung laden" (kein Google-Kontakt vor Consent). **[Repo]**
- [ ] **Sitemap in Search Console einreichen** (nach Go-Live) — `https://lingener-baumaschinen.de/sitemap.xml`; Property behalten, Index-Abdeckung + 404-Report 4–8 Wochen beobachten. **[Betreiber]**
- [ ] **E-Mail-Authentifizierung SPF / DKIM / DMARC** für `lingener-baumaschinen.de` einrichten/prüfen (Schutz vor Spoofing, bessere Zustellung der Form-Mails). **[Betreiber]** · Details: `Security-Audit.md` S-1
- [ ] **Security-Header auf Netlify-Staging verifizieren** — `curl -I` gegen den Netlify-Deploy: CSP/HSTS/X-Frame etc. wirklich ausgeliefert; 301-Stichproben (Status 301 + Location); www→apex; keine CSP-Verstöße in der Konsole. **[Repo/Betreiber gemeinsam]** · `Security-Audit.md` E1–E5

---

## 🟢 EMPFOHLEN / Härtung (kein Blocker)

**Security – Repo (mache ich auf Zuruf):**
- [x] **CSP härten** — erledigt 2026-07-09: `'unsafe-inline'` aus `script-src` entfernt, indem **alle Inline-Skripte ausgelagert** wurden (Calendly-Gate, Tab-Filter, Kalkulator → `main.js`; GA4-Snippet → `ga4-init.js` mit `data-ga4`-Attribut, hält auch nach GA4-Aktivierung); `object-src 'none'` + `upgrade-insecure-requests` ergänzt (`netlify.toml`). 0 Inline-Skripte über alle 90 Seiten. · `Security-Audit.md` S-2/S-4
- [x] **GitHub Actions auf Commit-SHA pinnen** — erledigt 2026-07-09 (`deploy.yml`, alle 5 Actions mit `# vN`-Kommentar). · S-3
- [ ] **Wizard-CTA** `encodeURIComponent(r.modell)` (Robustheit). **[Repo]** · S-13

**Security – Betreiber (GitHub-Einstellungen / DNS):**
- [ ] **GitHub:** Dependabot-Alerts + Secret-Scanning/Push-Protection + Branch-Protection auf `main` aktivieren. **[Betreiber]** · S-2/C2
- [ ] **DNS:** CAA-Record (`letsencrypt.org`) + DNSSEC. **[Betreiber]** · S-5
- [ ] **HSTS-`preload`** erst bei hstspreload.org einreichen, wenn alle Subdomains HTTPS können (dauerhafte Verpflichtung). **[Betreiber]** · S-6
- [ ] **Netlify-Spam:** Akismet im Forms-Bereich aktivieren. **[Betreiber]** · S-7

**Content / SEO / Performance – Repo:**
- [x] **EN-Zahlenformat** — Prüfung 2026-07-09: war bereits behoben (EN durchgehend „1,600 mm"-Format). · QA-Prelaunch PL-4
- [ ] **`og:type=product`** auf Maschinenseiten (statt `website`). **[Repo]** · MI-11
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

---

### Schnell-Reihenfolge fürs Go-Live
1. Team-Seite entscheiden + (optional) Härtungen/Perf im Repo.
2. **Netlify** verbinden → Deploy-Preview → Header/Forms/Redirects testen.
3. Search-Console-Export → Redirect-Map vervollständigen.
4. GA4-ID + SPF/DKIM/DMARC + DNS (CAA/DNSSEC).
5. **DNS auf Netlify umstellen** (Go-Live) → Sitemap in Search Console → 4–8 Wochen Monitoring.
