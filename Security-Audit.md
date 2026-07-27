# Security-Audit — LIBA Website (defensiv, vor Go-Live)

**Datum:** 2026-06-24 · **Methodik:** deterministische Recon (`npm audit`, Git-History-Scan, Sink-/Secret-Grep, Header-Probe, CI-Review) + **2 unabhängige Security-Agenten** (adversarial gegengeprüft). **Report-only.**

## Gesamturteil: 🟢 Starke Lage — keine kritischen/hohen Lücken, kein ausnutzbares XSS

**Threat-Model:** statische **Eleventy/JAMstack**-Seite — **kein Server-Code, keine Datenbank, kein Login**. Damit entfallen ganze Angriffsklassen (SQLi, Auth-Bypass, SSRF, serverseitige RCE). Die Befunde sind **Defense-in-Depth-Härtung** und **betriebliche Go-Live-Hygiene**, **keine** ausnutzbaren Löcher.

| Schweregrad | Anzahl |
|---|---|
| 🔴 Critical / 🟠 High | **0** |
| 🟡 Medium | 2 |
| 🔵 Low | 6 |
| ⚪ Info | 5 |

### ✅ Verifiziert sauber (die starken Seiten)
- **Client-seitiges DOM-XSS: CLEAN** — adversarial gegengeprüft. Einzige Nutzereingabe ist `?modell=` (URL) → fließt **nur in `textarea.value`** (inert, kein HTML-Parsing), nicht in `innerHTML`. Alle `innerHTML`-Sinks (ROI, Wizard, Split-Lines, Button) nutzen **numerische** oder **autoren-/DB-kontrollierte** Werte. Payload `?modell="><img src=x onerror=...>` landet als Klartext im Textfeld. Keine `javascript:`-URIs, **0 Inline-`onclick`** im Build.
- **Template-Injection: keine** — alle Nunjucks `| safe` (Schema/Content, ~25 Stellen) tragen ausschließlich Autoren-/Datendatei-Inhalte (`maschinen.js`, `faq.js`, Front-Matter), nie Nutzereingaben (Build-time, kein Request-Rendering).
- **Secrets: keine** — `src/`, `_site/` und die **komplette Git-History (113 Commits)** sauber; nur Platzhalter (GA4 `G-XXXXXXXXXX`, alte Formspree-TODOs). Keine `.env`, keine Keys/Tokens/Privatekeys.
- **Supply-Chain klein:** **0 Runtime-Dependencies** (nur Build-Dep Eleventy), Lockfile vorhanden, **keine postinstall-Skripte**. Alle Assets self-hosted (Fonts/JS/CSS/Bilder) — einziges Dritt-Skript ist Calendly, **erst nach Klick-Consent**.
- **CI least-privilege:** `deploy.yml` mit `contents: read · pages: write · id-token: write`, **keine Secrets** im Workflow; Trigger nur `workflow_dispatch`.
- **Security-Header bereits gesetzt** (in `netlify.toml`): X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, HSTS preload, Permissions-Policy, CSP mit `frame-ancestors 'none'`/`base-uri 'self'`/`form-action 'self'`.

---

## 🟡 MEDIUM

### S-1 · E-Mail-Authentifizierung (SPF/DKIM/DMARC) für `lingener-baumaschinen.de`
- **Kategorie:** DNS/E-Mail · **Ort:** DNS (betreiberseitig). Formulare versenden Benachrichtigungs-Mails; Domain hat `info@…`-Postfach.
- **Risiko:** Fehlt/schwach → **Spoofing** (Phishing im Firmennamen) + Zustellprobleme (Form-Mails im Spam). Aktuellen Stand prüfen — evtl. teils vorhanden.
- **Remediation:** **SPF** (TXT apex) `v=spf1 include:<Mail-Provider> -all`; **DKIM** beim Provider aktivieren + Selector-TXT veröffentlichen; **DMARC** (TXT `_dmarc…`) mit `v=DMARC1; p=none; rua=mailto:dmarc@…` starten, nach ~2–4 Wochen auf `p=quarantine`/`reject` ziehen. Prüfen: `dig TXT … +short`, mxtoolbox.

### S-2 · CSP `script-src 'unsafe-inline'` (Defense-in-Depth-Schwäche)
- **Kategorie:** CSP · **Ort:** `netlify.toml` (CSP-Zeile). Grund: Inline-`<script>`-Blöcke (Consent-Gate, Calendly-Loader, Maschinenfilter, GA4-Bootstrap).
- **Risiko:** `'unsafe-inline'` entwertet den XSS-Schutz der CSP — **real aktuell gering**, da es **keine Injektionsstelle** gibt (XSS-Fläche ist clean). Latent/Best-Practice.
- **Remediation:** Auf **Hash-basierte CSP** umstellen — die ~3-4 Inline-Blöcke per Build-Schritt als `'sha256-…'` in `script-src` aufnehmen und `'unsafe-inline'` entfernen (CSP3 ignoriert dann `'unsafe-inline'`). Auf Netlify-Staging prüfen, dass Calendly noch lädt; sonst Nonce via Edge Function. ~1 h Aufwand, hebt die CSP-Note deutlich. **Kein Launch-Blocker.**

---

## 🔵 LOW
- **S-3 · GitHub Actions an mutable Tags gepinnt** (`@v4/@v5/@v3`, `deploy.yml`) → auf **vollen Commit-SHA pinnen** (Supply-Chain-Integrität); Dependabot fürs `github-actions`-Ökosystem. (Risiko reduziert, da nur manueller Trigger + Pages-Vorschau, nicht Produktion.)
- **S-4 · CSP ergänzen:** `object-src 'none'` + `upgrade-insecure-requests` (Best-Practice-Lücken; `default-src 'self'` deckt object bereits per Fallback).
- **S-5 · DNS CAA + DNSSEC:** CAA `0 issue "letsencrypt.org"` (Netlify nutzt Let's Encrypt) + `iodef`; **DNSSEC** beim Registrar/DNS aktivieren (Provider-Support prüfen, sonst Auflösungsbruch).
- **S-6 · HSTS-`preload` ist eine Verpflichtung:** Header ist korrekt, aber **erst nach Einreichung bei hstspreload.org** wirksam — und dann faktisch dauerhaft für **alle** Subdomains HTTPS-Zwang. Vor Einreichung sicherstellen, dass jede Subdomain (Mail/Legacy) HTTPS kann; sonst Header behalten, aber **noch nicht einreichen**.
- **S-7 · Netlify-Forms-Spamschutz:** Honeypot vorhanden; im Netlify-Dashboard **Akismet** aktivieren (unsichtbar, keine CSP-Änderung — besser als reCAPTCHA, das Google nachlädt).
- **S-8 · www→apex 301:** kein Host-Redirect im Repo; auf Netlify **apex als Primary Domain** setzen (auto-301) und nach Deploy verifizieren.

## ⚪ INFO (Notiz / vorausschauend)
- **S-9 · js-yaml/gray-matter DoS (3× moderate, „no fix"):** **build-time-only**, parst **eigene** Front-Matter-YAML auf vertrauten Maschinen, nichts davon geht in den Browser → **real ~null Risiko**. Disposition: **akzeptieren & beobachten** (auf Eleventy-Update warten; Dependabot). **Kein Blocker.**
- **S-10 · GA4 `connect-src`:** sobald echte GA4-ID gesetzt → `connect-src` um `https://*.google-analytics.com https://*.analytics.google.com` ergänzen (regionale Endpunkte), sonst werden manche Hits CSP-geblockt.
- **S-11 · `Permissions-Policy: payment=()`** blockt künftiges Stripe-Checkout — heute korrekt (kein Checkout); bei echtem Stripe-Flow auf `payment=(self "https://js.stripe.com")` ändern.
- **S-12 · `img-src https:`** ist breit, aber unkritisch (alle Bilder self-hosted; ohne Injektionsstelle theoretisch). Optional auf `img-src 'self' data:` verengen.
- **S-13 · Wizard-CTA-`href`:** `r.modell` wird ohne `encodeURIComponent` in den `href` konkateniert (ROI-Pfad encodiert). Heute ungefährlich (nur sichere DB-Literale); zur Robustheit `encodeURIComponent(r.modell)` ergänzen.

---

## Hardening-Checkliste (im Repo, vor/kurz nach Launch)
- [x] **S-2** `'unsafe-inline'` aus `script-src` entfernt (2026-07-09) — gelöst durch **Auslagern** aller Inline-Skripte statt durch Hashes. Nachtrag 2026-07-27: die beiden 404-Seiten umgehen `base.njk` und trugen hinter dem GA4-Guard noch Inline-Blöcke; jetzt ebenfalls auf `ga4-init.js` umgestellt. Mit gesetzter Test-Mess-ID verifiziert: 0 Inline-Skripte auf allen 90 Seiten.
- [x] **S-4** CSP um `object-src 'none'; upgrade-insecure-requests` ergänzt (2026-07-09).
- [x] **S-3** GitHub Actions auf Commit-SHA gepinnt (2026-07-09) — alle 5 Actions in `deploy.yml`.
- [x] **S-13** `encodeURIComponent` im Wizard-CTA (2026-07-27) — inkl. Rückbau zweier vor-encodierter Datenwerte, sonst Doppel-Encoding.
- [x] **S-10** `connect-src` um `*.google-analytics.com` + `*.analytics.google.com` erweitert (2026-07-27) — GA4 sendet an regionale Endpunkte.

## Betreiber / DNS / Netlify / GitHub-Settings (Go-Live)
- [ ] **S-1** SPF + DKIM + DMARC einrichten/prüfen (wichtigster Betreiber-Punkt).
- [ ] **S-5** CAA-Record + DNSSEC.
- [ ] **S-8** apex als Netlify-Primary-Domain (www→apex 301). *Repo-Seite fertig: 0 `www.`-Vorkommen in Canonicals, Sitemap und robots.txt — verbleibt reine Netlify-Einstellung.*
- [ ] **S-7** Akismet-Spamfilter in Netlify Forms.
- [ ] **S-6** HSTS-preload nur nach Subdomain-Check einreichen.
- [ ] GitHub: **Dependabot** + **Secret-Scanning/Push-Protection** + **Branch-Protection** auf `main`; ggf. GH-Pages-Vorschau nach Netlify-Go-Live archivieren.

## Erst auf Netlify-Staging verifizierbar (Pages-Vorschau liefert die Header NICHT)
- `curl -sI` gegen Netlify-Deploy: alle Security-Header + CSP-Wert wirksam; HSTS/`frame-ancestors`.
- 301-Stichproben aus `_redirects` (Status 301 + `Location`), www→apex.
- DevTools-Konsole auf **CSP-Verstöße** prüfen (v. a. nach GA4/Calendly).
- Mixed-Content-Crawl; securityheaders.com / Mozilla-Observatory-Grade.

## Methodik & Abdeckung
2 unabhängige Agenten (Client-XSS/Secrets/Forms; Header/CSP/Supply-Chain/CI/Transport) + deterministische Tools. XSS-Fläche adversarial mit konkretem Payload gegengeprüft → **CLEAN**. Schweregrade **proportional zum statischen Threat-Model** (keine aufgeblasenen Backend-Risiken). Roh-Belege: `npm audit`, Git-History-Scan, `netlify.toml`, `deploy.yml`, `main.js`-Sink-Trace.
