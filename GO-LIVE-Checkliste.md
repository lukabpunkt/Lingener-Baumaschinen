# GO-LIVE-Checkliste — LIBA Website

> Alle Punkte, die **vor dem echten Launch** auf `lingener-baumaschinen.de` noch erledigt werden müssen.
> Stand: 2026-06-24. Detail-Berichte im Repo: `QA-Prelaunch.md`, `Security-Audit.md`, `DE-EN-Parity.md`, `CLAUDE.md` (Migrations-Handover).
> Legende: **[Betreiber]** = du (Dashboard/DNS/Konto) · **[Repo]** = im Code (mache ich auf Zuruf).

---

## 🔴 MUSS vor Go-Live (sonst funktioniert die Seite produktiv nicht / Schaden)

- [ ] **Netlify-Hosting einrichten** — Repo `lukabpunkt/Lingener-Baumaschinen` mit Netlify verbinden, **apex `lingener-baumaschinen.de` als Primary Domain** (www→apex-301 automatisch). **[Betreiber]**
  - Wichtig: **Formulare, 301-Weiterleitungen UND Security-Header funktionieren NUR auf Netlify** — die jetzige GitHub-Pages-Vorschau kann das alles systembedingt nicht.
- [ ] **DNS auf Netlify umstellen** (als letzter Schritt) — Domain vom alten WordPress auf Netlify zeigen lassen. **[Betreiber]**
- [ ] **Netlify Forms scharfschalten** — nach erstem Deploy im Dashboard → Forms eine **Benachrichtigungs-E-Mail** einrichten, sonst landen Kontakt-/Gebraucht-Anfragen nur im Dashboard, nicht im Postfach. **[Betreiber]**
- [ ] **Redirect-Map vervollständigen** — vollständige alte URL-Liste aus **Google Search Console** („Seiten"-Export) **+ alten Yoast-Sitemaps** holen; damit `src/_data/redirects.js` ergänzen und die ⚠-Einträge prüfen (`/produkt/…-kopie/`-Zuordnungen, `GM 1 AS` vs `AF`, vollständige `/en/*`-Abdeckung). Sonst verlieren indexierte alte URLs ihr Ranking. **[Betreiber liefert Export → Repo setzt um]** · Details: `QA-Prelaunch.md`, `CLAUDE.md` §5
- [ ] **Team-Seite klären** — aktuell live mit Platzhaltern (`[Name]`, „Foto folgt", Platzhalter-Zitat). Vor Launch **entweder echte Bios/Fotos einsetzen** **[Betreiber liefert Inhalte]** **oder** Seite auf `noindex` + aus Nav/Footer entlinken **[Repo]**.

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
- [ ] **CSP härten** — `'unsafe-inline'` im `script-src` durch Hash-basierte CSP ersetzen; `object-src 'none'` + `upgrade-insecure-requests` ergänzen (`netlify.toml`). **[Repo]** · `Security-Audit.md` S-2/S-4
- [ ] **GitHub Actions auf Commit-SHA pinnen** (statt `@v4`-Tags) in `deploy.yml`. **[Repo]** · S-3
- [ ] **Wizard-CTA** `encodeURIComponent(r.modell)` (Robustheit). **[Repo]** · S-13

**Security – Betreiber (GitHub-Einstellungen / DNS):**
- [ ] **GitHub:** Dependabot-Alerts + Secret-Scanning/Push-Protection + Branch-Protection auf `main` aktivieren. **[Betreiber]** · S-2/C2
- [ ] **DNS:** CAA-Record (`letsencrypt.org`) + DNSSEC. **[Betreiber]** · S-5
- [ ] **HSTS-`preload`** erst bei hstspreload.org einreichen, wenn alle Subdomains HTTPS können (dauerhafte Verpflichtung). **[Betreiber]** · S-6
- [ ] **Netlify-Spam:** Akismet im Forms-Bereich aktivieren. **[Betreiber]** · S-7

**Content / SEO / Performance – Repo:**
- [ ] **EN-Zahlenformat** „1.600 mm" → „1,600 mm" (englisches Tausenderformat). **[Repo]** · QA-Prelaunch PL-4
- [ ] **`og:type=product`** auf Maschinenseiten (statt `website`). **[Repo]** · MI-11
- [ ] **Performance Maschinenseiten** — Page-Hero ist CSS-`background-image` (kein WebP/Preload) → LCP ~7,7 s mobil; auf `<img>`/`<picture>`+WebP+Preload umstellen (größter verbliebener Perf-Hebel, 60 Seiten). **[Repo]** · QA-Prelaunch
- [ ] **`referenzen` og:description** „DN400" vs Tabelle „DN300" angleichen (in DE+EN gleich falsch). **[Repo]**
- [ ] **deploy.yml** für finalen Netlify-Betrieb löschen/deaktivieren (trägt noch den GitHub-Pages-Prefix; nur für die aktuelle Vorschau nötig). **[Repo]**

---

## ✅ Bereits erledigt (zur Info — nicht erneut machen)
- Formulare auf **Netlify Forms** umgestellt (kein Formspree mehr) · **Calendly** hinter Klick-Consent · **Fonts self-hosted** · Product-Schema ohne preislosen Offer · **Impressum-Pflichtangaben** (HRA 100224 / HRB 100012 / USt DE154279934 / GF Thorsten Schrader) · Datenschutz an echte Technik angepasst · Security-Header in `netlify.toml` angelegt · A11y-Fixes · **DE/EN inhaltlich synchronisiert** + idiomatisches Englisch · Hero-Aufwertung · diverse Pre-Launch-Bugfixes (Off-Domain-Link, Calendly-Kontrast u. a.).

---

### Schnell-Reihenfolge fürs Go-Live
1. Team-Seite entscheiden + (optional) Härtungen/Perf im Repo.
2. **Netlify** verbinden → Deploy-Preview → Header/Forms/Redirects testen.
3. Search-Console-Export → Redirect-Map vervollständigen.
4. GA4-ID + SPF/DKIM/DMARC + DNS (CAA/DNSSEC).
5. **DNS auf Netlify umstellen** (Go-Live) → Sitemap in Search Console → 4–8 Wochen Monitoring.
