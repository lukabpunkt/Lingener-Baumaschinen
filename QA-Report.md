# QA-Report — LIBA Website (vor Netlify-Go-Live)

**Datum:** 2026-06-20 · **Stand:** Build `_site/` (88 HTML, Eleventy 3.1.6) · **Methodik:** 12 Test-Tracks, durchgeführt von **7 unabhängigen, adversarialen Agenten** plus deterministische Tool-Artefakte (Playwright, axe-core, Lighthouse, Link-Crawl). Headline-Funde wurden mehrfach unabhängig bzw. deterministisch gegengeprüft. **Report-only — es wurde nichts am Code geändert.**

## ✅ Behebungsstand (2026-06-20) — umgesetzt & verifiziert

Der Großteil der Befunde wurde behoben und per Tool gegengeprüft (axe, Playwright, Crawl, Build):
- **BL-1 Formulare** → **Netlify Forms** (Submit an `/`, `form-name`+Honeypot, sprachabh. Meldungen, Checkbox-`name`). Kein `YOUR_FORMSPREE` mehr.
- **CR-1 Calendly** → Klick-zum-Laden: **0 Calendly/Stripe-Requests vor Klick**. **CR-2 Fonts** durchgehend self-hosted: **0 Dritt-Requests** auf EN. **CR-3** preisloser `offers`-Block entfernt (Product valide).
- **MA-3** Security-Header (`netlify.toml`); **MA-4** FR/ES raus; **MA-5** Org-`url`→Root; **MA-6** `&amp;amp;`→0; **MA-8** `/en/*`-Fallback; **MA-9** deploy.yml-Prefix raus.
- **MA-10** tablist→`role=group`; **MA-11/12** Kontraste (maschinen.html: 65 axe-Verstöße→**CLEAN**); **MA-13** Alt-Texte (36→**0 sinntragende**); **MA-14** EN-Kategorien übersetzt; **MA-15** „maximum max."; **MA-16** „ihre Stärken"; **MA-18** Hero-LCP **5,0 s→3,1 s**; **MA-19** Hero-WebP.
- **Datenschutz** (MA-1/2): Netlify-Formular ergänzt, Calendly einwilligungsbasiert, Schriften self-hosted. Plus Minors MI-1/3/4/5/6/7/10/11/12/13.
- **Build grün · Startseiten DE/EN axe-CLEAN · 0 Konsolenfehler · JSON-LD valide · 0 kaputte Links.**

**Noch offen — braucht deine Daten/Entscheidung:** CR-4 Impressum (HRA/HRB/USt-IdNr.), GA4-ID, MA-7/MI-2 Redirect-Verifikation (Search-Console-Export), MA-17 Team-Seite (Platzhalter, bewusst nicht versteckt), Minors MI-8/9/14 + Impressum-Heading-Skip.

---

## Ausgangslage (vor Behebung): 🔴 1 Blocker + 4 Critical

Die technische Substanz war solide (0 kaputte Links, 0 Konsolenfehler, valides JSON-LD-Parsing, kein horizontaler Overflow, keine Secrets) — die Blocker lagen bei **Formularen, Datenschutz/DSGVO, Rich-Results und Pflichtangaben**.

| Schweregrad | Anzahl |
|---|---|
| 🔴 Blocker | 1 |
| 🟠 Critical | 4 |
| 🟡 Major | 16 |
| 🔵 Minor | 14 |
| ⚪ Info / Passed | viele (siehe „Verifiziert sauber") |

---

## 🔴 BLOCKER (Go-Live-Stopper)

### BL-1 — Kontakt- & Gebrauchtmaschinen-Formular verwerfen jede Anfrage stillschweigend
- **Track:** G (Forms) · **Verifiziert:** 3 Agenten (Live-Playwright) + deterministisch
- **Ort:** `src/assets/js/main.js:162-167`; `src/kontakt.njk:141`, `src/gebrauchtmaschinen.njk:130` (`action`/`data-form` = `https://formspree.io/f/YOUR_FORMSPREE_ID_*`)
- **Beleg:** Live-Submit (alle Pflichtfelder + Privacy-Haken) zeigt grünen Erfolg „Vielen Dank — Ihre Anfrage ist eingegangen…", **setzt das Formular zurück, sendet aber NULL Netzwerk-Requests**. Der JS-Handler erkennt `YOUR_` und faked Erfolg. Ohne JS postet das native Formular an eine ungültige Formspree-URL → ebenfalls keine Zustellung.
- **Wirkung:** 100 % aller Leads gehen verloren, während dem Nutzer das Gegenteil angezeigt wird.
- **Empfehlung:** Echte Formspree-IDs (oder Netlify Forms / Backend) in `action=` **und** `data-form=` eintragen; danach echten POST + Fehlerpfad testen. Zusätzlich: Privacy-Checkbox braucht ein `name`-Attribut, sonst wird die Einwilligung selbst bei echtem Endpunkt nicht übertragen.

---

## 🟠 CRITICAL

### CR-1 — Calendly- + Stripe-Widget lädt beim Seitenaufruf OHNE Einwilligung (US-Datentransfer)
- **Track:** L (Security/DSGVO) + F · **Verifiziert:** 2 Agenten + deterministisch (Widget-Script in `kontakt.html` bestätigt)
- **Ort:** `src/kontakt.njk` (Inline-Widget `data-url="calendly.com/luka-bloemendal/30min"` + `<script src="https://assets.calendly.com/assets/external/widget.js" async>`) → `_site/kontakt.html` + `_site/en/kontakt.html`
- **Beleg:** Request-Log vor jeder Einwilligung (Banner noch sichtbar): `/kontakt.html` → 9 Cross-Origin-Requests an `assets.calendly.com`, `calendly.com` (inkl. `api/booking/initial_settings`), `js.stripe.com/v3`; `/en/kontakt.html` → 13. Calendly setzt `__cf_bm`-Cookie. (Das erklärt die zuvor aufgefallenen `dfp.calendly.com`/`m.stripe.com`-POSTs — **kein** Test-Artefakt, sondern echtes Seiten-Code.)
- **Wirkung:** IP + Browserdaten gehen an US-Prozessoren (Calendly LLC, Stripe) **vor** Consent. Einstufung als „technisch notwendig" in der Datenschutzerklärung ist rechtlich angreifbar.
- **Empfehlung:** Calendly per Klick-zum-Laden (Zwei-Klick/Consent-Gate) einbinden — Platzhalter rendern, Script erst nach Opt-in injizieren. Calendly/Stripe als Consent-Kategorie aufnehmen.

### CR-2 — Google Fonts vom Google-US-CDN vor Einwilligung auf allen 43 EN-Seiten
- **Track:** L + I · **Verifiziert:** 2 Agenten + deterministisch
- **Ort:** `src/_includes/base.njk:33-36` (`{% if lang == "en" or useGoogleFonts %}` → `fonts.googleapis.com`/`gstatic.com`). DE self-hostet identische Fonts via `/assets/css/fonts.css`.
- **Beleg:** `/en/index.html` → 4 Google-Requests vor Consent; `/` (DE) → 0. Build-weit: 43/44 EN-Dateien laden Google Fonts, 0/44 DE-Dateien.
- **Wirkung:** IP-Übertragung an Google US ohne Consent — exakt der Fall LG München I, 3 O 17493/20 (Schadenersatz). Die self-hosteten Fonts existieren bereits.
- **Empfehlung:** EN-Zweig auf dasselbe `/assets/css/fonts.css` umstellen, Google-`<link>`s entfernen. Einzeiler, kein visueller Unterschied; behebt zugleich die Performance- und die Datenschutz-Inkonsistenz.

### CR-3 — Alle 60 Product-Offers ohne Preis → Product-Rich-Result ungültig/nicht ausspielbar
- **Track:** D (Structured Data) · **Verifiziert:** deterministisch (`"price"` = 0 in Offer)
- **Ort:** `src/_data/maschinenseiten.js` (`buildSchema` `offers`) → alle `_site/maschinen/*.html` (30 DE + 30 EN)
- **Beleg:** Offer enthält `priceCurrency:"EUR"`, `availability`, `itemCondition`, `seller`, `url` — **kein `price`/`priceSpecification`**. Google verlangt `offers.price`; Search Console meldet „Fehlendes Feld price", das Product-Snippet rendert nicht.
- **Empfehlung:** Wenn kein öffentlicher Preis: `offers`-Block ganz weglassen (Product ohne Offer ist valide). Sonst echten `price`/`priceSpecification` ergänzen.

### CR-4 — Impressum: gesetzliche Pflichtangaben sind Platzhalter (§5 TMG/DDG)
- **Track:** K (Content) · **Verifiziert:** deterministisch (gerendert in `_site/impressum.html`)
- **Ort:** `src/impressum.njk:68-74,113-119` → `_site/impressum.html` + `/en/`
- **Beleg:** `Registernummer: HRA [XXXXX]`, `HRB [XXXXX]`, `USt-IdNr. DE [XXXXXXXXX]` werden live ausgegeben. Telefon/E-Mail sind echt.
- **Wirkung:** Unvollständiges Impressum = Abmahnrisiko in DE.
- **Empfehlung:** Echte HRA/HRB- und USt-IdNr. eintragen.

---

## 🟡 MAJOR

**Datenschutz / Recht**
- **MA-1** Datenschutzerklärung nennt **Formspree nicht** (Auftragsverarbeiter der Formulardaten, US). `_site/datenschutz.html` hat 0 Formspree-Erwähnung. → Sektion „Kontaktformular/Formspree" (Datenarten, Rechtsgrundlage Art. 6(1)(b), US-Transfer) ergänzen. *(Track L)*
- **MA-2** Datenschutz §4 behauptet **Google-Fonts-Drittladen**, DE self-hostet aber → Aussage widersprüchlich (für EN stimmt sie wegen CR-2). Nach CR-2-Fix auf „lokal gehostet, kein Google-Request" umstellen. *(Track K/L)*
- **MA-3** **Keine Security-Header** (kein `_headers`, kein `[[headers]]` in `netlify.toml`): keine CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS. → Netlify-`_headers` mit Baseline anlegen (CSP zuerst als `Report-Only`, da viele Inline-Scripts/-Styles). *(Track L)*

**SEO / Structured Data**
- **MA-4** `contactPoint.availableLanguage` listet noch **["German","English","French","Spanish"]**, obwohl FR/ES entfernt sind. In `index.njk`, `kontakt.njk`, `anwendungen.njk`, `gebrauchtmaschinen.njk`, `referenzen.njk`, beide `404.njk`. → auf `["German","English"]` reduzieren. *(Track D)*
- **MA-5** Geteilte `@id "#organization"` mit widersprüchlicher `url` je EN-Unterseite (zeigt auf die Seite statt Root, z. B. `/en/anwendungen.html`). → `url` überall auf `https://lingener-baumaschinen.de` (bzw. `/en/`) setzen. *(Track D)*
- **MA-6** **Doppel-Encoding `&amp;amp;`** in Meta-/OG-/Twitter-Description und Impressum-JSON-LD auf 8 Seiten (`agb`, `impressum`, `datenschutz`, `maschinen/gm-1-af` je DE/EN). Quelle: rohe `&` in Front-Matter + erneutes Auto-Escaping in `base.njk:8,14,20`. → einmal escapen. *(Track C/D)*

**Migration / Redirects** *(teils externe Search-Console-Daten nötig)*
- **MA-7** **5 von 8** `/produkt/…-kopie/`-Redirects zeigen auf eine Maschine mit **anderem Modellnamen** (z. B. `/produkt/gm-160-as-kopie/` → GM 4 Rad; `/produkt/gm-4-raupe-vorfuehrmaschine-kopie-2/` → GM 6 ASR). Kein 404 (Ziel existiert), aber thematisch falsch. → Gegen echten WooCommerce-/Search-Console-Export prüfen; ggf. auf `/gebrauchtmaschinen.html` mappen. *(Track B)*
- **MA-8** **EN-Redirect-Map ist nur ein 4-Regel-Stub** (kein `/en/*`-Catch-all), obwohl 30 EN-Maschinen + ~10 EN-Sektionen existieren → alte indexierte EN-Deeplinks laufen ins 404. → EN-Map aus EN-Yoast-Sitemap ableiten; mindestens `/en/*`→`/en/` Fallback. *(Track B)*
- **MA-9** `deploy.yml:42` hardcodet noch `ELEVENTY_PATH_PREFIX=/Lingener-Baumaschinen/` (für apex falsch). Workflow ist auf `workflow_dispatch` deaktiviert → kein Live-Defekt, aber ein manueller Klick erzeugt einen Build, dessen Assets/Links auf apex 404en. Empirisch reproduziert. → `env`-Block entfernen oder Workflow löschen. *(Track A)*

**Accessibility** *(WCAG AA)*
- **MA-10** `role="tablist"` ohne `role="tab"`-Kinder auf `maschinen.html` (`src/maschinen.njk:147-152`, `#mf-tabs`) — axe „critical", 4.1.2 A. Es sind eigentlich Filter-Buttons. → ARIA entfernen (`role="group"` + `aria-pressed`) oder echtes Tab-Pattern. *(Track H)*
- **MA-11** **Kontrast Kategorie-Label** `.maschine-card-cat` `#5EEAD4` auf Weiß = **1.46:1** (30×, `main.css:2855`). → `--brand`/`--brand-deep` statt `--brand-light`. *(Track H)*
- **MA-12** **Kontrast Status-Badges** (`badge-neu` 3.25:1 ×22, `badge-gebraucht` 4.35:1 ×5, `badge-vorfuehrmaschine` 4.32:1 ×3, `main.css:2887`) unter 4.5:1. → Vordergrund abdunkeln. *(Track H)*
- **MA-13** **Sinntragende Bilder mit leerem `alt`**: EN-Startseite verliert alle Produkt-Alts (kein `{% else %}` in `index.njk:299+`), `anwendungen.njk` & `mieten.njk` hardcoden `alt=""` in DE+EN. (Hero-Bilder `alt=""` sind korrekt, weil dekorativ+`aria-hidden`.) → EN-Alt-Zweig ergänzen, echte Alt-Texte für Anwendungs-/Mietbilder. *(Track H)*

**Content / Generator-Bugs**
- **MA-14** **Deutsche Begriffe in allen EN-Maschinenseiten**: `Selbstfahrer`/`Schlepperanbau`/`Baggeranbau` (Badges + Intro + Related), `Gebraucht`/`Vorführmaschine` (Zustände). → DE→EN-Map (existiert schon für die Filter-Tabs) auch auf Intro/Badge/Related/Condition anwenden. *(Track K)*
- **MA-15** **„maximum max."** im EN-Intro auf **allen 30** Maschinenseiten (`maschinenseiten.js:34`: `.replace(' max.','')` greift nicht, weil EN-Label `"Max. cutting depth"` großgeschrieben/ohne führendes Leerzeichen). → case-insensitiv/verankert strippen (`/^max\.?\s*/i`). *(Track K)*
- **MA-16** **DE-Grammatikfehler** „…wo diese Maschine **ihren Stärken** am besten entfaltet" auf allen 30 DE-Seiten (muss Akkusativ **„ihre Stärken"** sein). Quelle in `src/maschinen.njk`. *(Track K)*
- **MA-17** **Team-Seite ist Platzhalter-Content** (live gerendert, DE+EN): „[Platzhalter: …Geschäftsführer…]", Foto-Platzhalter mit Kamera-Icon. → bis echte Bios/Fotos vorliegen nicht veröffentlichen oder noindex+entlinken. *(Track K)*

**Performance**
- **MA-18** **Hero-LCP-Bild durch `opacity:0` + deferred JS verdeckt** (`main.css:735` + `main.js:104`, 1,4 s Fade). Mobil gedrosselt LCP 5–8,4 s, obwohl `hero-1.jpg` schon mit `fetchpriority=high` preloaded wird (Bytes da, aber Pixel malen spät). → erste Slide ohne JS sichtbar (`is-active`/`:first-child{opacity:1}`), Fade nur ab Slide 2; größter LCP-Hebel (~3–5 s). *(Track I)*
- **MA-19** **Überdimensionierte Produktbilder ungescaled ausgeliefert** (`products/` 21 MB; 11 Dateien >500 KB, größte ~950 KB; kein `srcset`/`sizes`). Hero-JPGs ohne `<picture>`/WebP, obwohl WebP-Twins existieren. → `@11ty/eleventy-img` für responsive Varianten + WebP/AVIF; die 11 großen JPGs rekomprimieren (~5 MB Einsparung). *(Track I)*

---

## 🔵 MINOR

- **MI-1** 2 exakte **Duplikat-Redirect-Regeln** (`/rohrleitungsbau-mit-der-gm-140-afh-600/`, `/baggeranbaufraese-gm-140-h/`) — gleiches Ziel, harmlos, aber Netlify-Warnung. Quelle: `redirects.js` Maschinen-`oldUrl` doppelt mit Manual-Eintrag. *(B)*
- **MI-2** Redirect `traktorfraese-gm-1-as` → `gm-1-af.html` (**AS vs AF**), obwohl `gm-1-as.html` existiert. Modell verifizieren. *(B)*
- **MI-3** `?modell=`-Prefill füllt die Nachricht, setzt aber den **Betreff nie** (sucht Option „Kaufanfrage", die es nicht gibt; reale Werte: Kauf/Miete/Gebraucht/Service/Sonstiges). `main.js:260`. → auf `'Kauf'` ändern. *(F)*
- **MI-4** **Scroll-to-Top Doppel-Handler** (Inline-`onclick` `base.njk:406` + JS-Listener `main.js:766`). Harmlos, redundant. *(F)*
- **MI-5** „**max.**" in Breiten-Prosa nicht entfernt — nur GMV 130 (`Schwertbreite max.`, DE+EN). `maschinenseiten.js:28/35`. *(K)*
- **MI-6** EN-Tiefenbegriff inkonsistent bei Pflügen: Intro „installation depth" vs FAQ „laying depth" (gmv-130/100). → vereinheitlichen. *(K)*
- **MI-7** **hreflang auf noindex-Legal-Seiten** (impressum/datenschutz/agb) emittiert. Geringes Risiko (Cluster konsistent), saubere Praxis: unterdrücken. *(C)*
- **MI-8** **41/88 Titel >60 Zeichen** (alle Maschinenseiten; Suffix „— LIBA Lingener Baumaschinen" bläht). Truncation-Risiko. *(C)*
- **MI-9** 13 Meta-Descriptions >160 Zeichen; `impressum` sehr kurz (68/56). *(C)*
- **MI-10** **Doppelter EN-Titel** „About Us — LIBA…" auf `en/team.html` und `en/unternehmen.html` (DE korrekt unterschiedlich). *(C)*
- **MI-11** `og:image` auf allen 60 Maschinenseiten ist generisches `hero-1.jpg` statt Maschinenfoto; `og:type=website` statt `product`. → `ogImage = BASE + m.heroImage`. *(C)*
- **MI-12** **Kontrast** `.roi-disclaimer` 2.38:1 (`mieten.html`), **Footer-Heading-Skip** h2→h4 (alle 14 Seiten, `base.njk`), **Section-Heading-Skips** (index-Prozess h2→h4, impressum h1→h3), **schwacher Fokus-Ring** auf Formularfeldern (`main.css:1669`), **`.topbar` außerhalb Landmark** (alle Seiten). *(H)*
- **MI-13** Privacy-Checkbox ohne `name` (Einwilligung würde selbst bei echtem Endpunkt nicht übertragen). *(F)*
- **MI-14** EN nutzt deutsches Tausender-Format („1.600 mm"); „Unimogfräse" im EN-Fließtext. Locale-Feinheit. *(K)*

---

## ✅ Verifiziert sauber / widerlegte Verdachtsfälle (Konfidenz)

- **Links/Navigation:** 0 kaputte interne Links, 0 kaputte Anker, 13/13 externe Links 2xx/3xx, Sprachumschalter beidseitig korrekt. *(E)*
- **Build:** warnungsfrei; 88 HTML, 80 Sitemap-URLs, 88 Redirect-Regeln; alle Redirect-Ziele existieren (0 Redirect→404, 0 Ketten/Loops, korrekte Splat-Reihenfolge). www→apex im Repo durchgängig gelöst. *(A/B)*
- **JSON-LD:** alle Blöcke valide JSON; BreadcrumbList korrekt; **FAQPage-Text == sichtbarer FAQ**; LocalBusiness vollständig. *(D)*
- **Konsole:** 0 JS-Fehler/Exceptions über alle 88 Seiten. *(F)*
- **Wizard** (Maschinenberater) voll funktional, **alle 30 Slugs → existierende Seiten (200)**; **ROI-Rechner** korrekt; **Hero-Slider DE 4 / EN 3 synchron**; FAQ-Accordion, FAB, Mobile-Nav funktionieren. *(F)*
- **Responsive:** 0 horizontaler Overflow (375/768/1024/1440), Screenshots sauber, Cookie-Banner verdeckt nichts dauerhaft. *(J)*
- **Native Formular-Validierung** (Pflichtfeld/E-Mail/Privacy) funktioniert; Fake-Success erscheint nicht bei ungültiger Eingabe. *(G)*
- **Secrets:** keine echten Keys/Tokens im Code/Build. **`rel="noopener noreferrer"`** auf allen `target=_blank`. **Maps = Link**, kein Auto-Iframe. **Consent-Mode-v2-Logik** korrekt (default denied, ad_* nie granted, Widerruf vorhanden) — greift, sobald echte GA4-ID gesetzt ist. *(L)*
- **CLS ~0, TBT ~0, Best-Practices/SEO (Lighthouse) 100**; DE-Fonts self-hosted mit `font-display:swap`; Produkt-/Anwendungsbilder nutzen `<picture>`+WebP+lazy. *(I)*

---

## 🔧 Betrieb / nur durch Betreiber (vor Go-Live)
- **GA4-Mess-ID** in `src/_data/site.js` setzen (aktuell `G-XXXXXXXXXX` → kein Tracking; Cookie-Banner/Datenschutz behaupten GA4 aber bereits — nach Setzen stimmig). *(F/K/L)*
- **Vollständige alte URL-Liste** aus Search Console + Yoast-Sitemaps für MA-7/MA-8 (Redirect-Verifikation).
- **Netlify-Live-Header** nach MA-3 prüfen; Trailing-Slash-Verhalten auf der echten Netlify-Preview crawlen (lokaler Server maskiert es).

---

## Abdeckungsmatrix

| Track | Geprüft | Methode |
|---|---|---|
| A Build/Output | ✅ | Rebuild, Output-Counts, netlify.toml, deploy.yml |
| B Redirects | ✅ | _redirects geparst, alle Ziele auf Existenz, Duplikate/Splats, ⚠/produkt-Mismatches |
| C SEO/Meta | ✅ | Crawl aller 88 (Title/Desc/Canonical/hreflang/robots/OG) |
| D Structured Data | ✅ | JSON-LD-Parsing + Rich-Results-Felder (Product/Offer/FAQ/Breadcrumb/Org) |
| E Links/Nav | ✅ | Voller Link-/Anker-Crawl + externe HEAD-Checks |
| F JavaScript | ✅ | Playwright pro interaktiver Seite, Konsolen-Capture, Wizard/ROI/Slider/FAB |
| G Forms | ✅ | Live-Submit-Traces (mit/ohne JS), Netzwerk-Capture, Validierung |
| H Accessibility | ✅ | axe-core (14 Seiten) + manuelle Keyboard/ARIA/Kontrast/Fokus-Checks |
| I Performance | ✅ | Lighthouse mobil (4 Seiten) + LCP-Throttle-Messung + Asset-Sizing |
| J Responsive/Visuell | ✅ | Screenshots 4 Breakpoints, Overflow-Detektion, Sichtprüfung |
| K Content/Bilingual | ✅ | DE/EN-Leak-Scan, Generator-Prosa, Platzhalter, Legal, Tippfehler |
| L Security/DSGVO | ✅ | Secrets-Scan, Cross-Origin-Request-Log pre-consent, Consent-Logik, Header |

**Nicht abschließend prüfbar (braucht externe Daten/Live-Umgebung):** Vollständigkeit der Redirect-Map gegen die echte Search-Console-URL-Liste; Netlify-Live-Verhalten (Trailing-Slash, www→apex-301, Response-Header); GA4-Live-Verhalten (Platzhalter-ID).

---

## Hinweis zur Methodik & Bias-Kontrolle
Die Tests führten **unabhängige Agenten** durch, die den Code nicht erstellt haben, mit adversarialem Auftrag. Die anfänglichen Verdachtsfälle wurden ausdrücklich als „unbestätigt" behandelt — mehrere wurden **widerlegt** (z. B. „kaputter Hero-Slider", „Wizard defekt", „Forms-Fremd-POSTs sind Test-Rauschen" → tatsächlich echtes Calendly-Widget). Alle Befunde ab *Major* sind durch ≥2 unabhängige Quellen oder einen deterministischen Tool-/Grep-Beleg gestützt. Rohartefakte: `/tmp/liba-qa/artifacts/` (crawl, axe, lighthouse, interact, linkcheck, overflow, shots).
