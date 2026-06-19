# CLAUDE.md — LIBA Website (Relaunch auf lingener-baumaschinen.de)

> Arbeits- und Übergabedokument für den Domain-Transfer der neuen Eleventy-Site auf die
> bestehende Domain **lingener-baumaschinen.de**, ohne das vorhandene Google-Ranking zu verlieren.
> Stand: 17.06.2026. Erstellt aus dem Abgleich Live-Site (WordPress/WPML/WooCommerce/Yoast)
> vs. dieses Repo (Eleventy 3, statisch, GitHub Pages).

---

## 1. Projektüberblick

- **Stack:** Eleventy 3 (`.njk`), statischer Output nach `_site/`, Daten in `src/_data/*.js`.
- **Sprachen:** DE + EN (`/en/`). Zentrale Konfiguration: `src/_data/site.js` (`langs: ["de","en"]`).
- **Deploy:** GitHub Actions → **GitHub Pages** (`.github/workflows`), Build mit
  `ELEVENTY_PATH_PREFIX=/Lingener-Baumaschinen/`.
- **Repo:** github.com/lukabpunkt/Lingener-Baumaschinen
- **Build/Dev:** `npm run build` (Output `_site/`), `npm start` (lokaler Server).

## 2. Ziel des Transfers

Die neue Site ersetzt die bestehende WordPress-Site auf **derselben Domain**. Damit bleibt die
Domain-Autorität (Alter, Backlinks, Marke) erhalten — das ist der Großteil des SEO-Werts. Der
kritische Teil ist: **alte URLs, Inhalte und technische Signale sauber überführen.** Google rankt
einzelne URLs; ändert sich eine URL ohne 301-Weiterleitung, ist deren Ranking verloren.

## 3. Kernbefund: Die neue Site ist KEIN 1:1-Ersatz der alten

Der Live-Stand ist deutlich größer als dieser Build. Ungeprüft live gestellt, würden **fast alle
bisher indexierten URLs ins Leere laufen (404)**. Größenordnung laut Yoast-Sitemaps der Live-Site:

| Bereich (Live / WordPress) | Status in diesem Repo |
|---|---|
| Sprachen DE, EN, **FR**, **ES** | nur **DE + EN** — FR & ES **komplett entfallen** |
| Großer mehrsprachiger Blog `/aktuelles/` (`post-sitemap.xml`, ~1.500 Zeilen XML) | **fehlt vollständig** |
| WooCommerce-Shop (`/warenkorb/`, `/kasse/`, `/mein-konto/`, `product-sitemap.xml`) | **fehlt vollständig** |
| ~17 einzelne Anwendungs-Landingpages (keyword-reich) | zu **einer** `/anwendungen.html` zusammengefasst |
| Keyword-reiche Produkt-Slugs (`/grabenfraese-gm-4-raupe-zur-glasfaserverlegung/`) | kurze Modell-Slugs (`/maschinen/gm-4-raupe.html`) |
| `/videos/`, `/haendler/`, `/mietanfrage/`, `/kaufanfrage/`, `/extras-fuer-die-grabenfraese/` | kein direktes Pendant |
| URL-Form: ohne `.html`, mit Trailing-Slash, deutsche Phrasen | mit `.html`, Modell-Slugs |

**Fazit:** Vor dem Go-Live müssen (a) eine vollständige Redirect-Strategie stehen und (b)
Entscheidungen zu FR/ES, Blog und Shop getroffen werden. Sonst droht erheblicher Ranking- und
Trafficverlust trotz gleicher Domain.

---

## 4. Nachbesserungen — priorisiert

### P0 — Blocker (vor Go-Live zwingend lösen)

1. **301-Redirects sind auf GitHub Pages nicht möglich.**
   GitHub Pages kann keine serverseitigen 301-Weiterleitungen (kein `.htaccess`, kein `_redirects`).
   Genau diese braucht der Transfer aber für hunderte geänderte URLs. Optionen:
   - **Empfohlen:** Hosting auf eine Plattform mit echten 301s umziehen — **Cloudflare Pages**
     oder **Netlify** (beide unterstützen eine `_redirects`-Datei mit `301`), oder klassisches
     Hosting mit `.htaccess`. Build/Workflow bleiben fast identisch.
   - **Notlösung bei Verbleib auf GH Pages:** pro alter URL eine statische Redirect-HTML mit
     `<meta http-equiv="refresh">` + `<link rel="canonical">` generieren. Google folgt dem, wertet
     es aber schwächer/langsamer als echte 301. Für hunderte URLs unpraktisch.

2. **Domain-Kanonisierung www vs. apex — Mismatch.**
   - Live-Site kanonisch **ohne** www: `https://lingener-baumaschinen.de/`.
   - Dieses Repo nutzt überall **mit** www: `https://www.lingener-baumaschinen.de` (in
     `canonical`, `og:url`, hreflang, `sitemap.xml`, `robots.txt`, `src/_data/maschinenseiten.js` `BASE`).
   - **To-do:** EINE Variante festlegen. Wenn die bisherige (apex, ohne www) beibehalten wird —
     was Signale am sichersten erhält — dann alle `www.`-Vorkommen im Repo auf apex umstellen und
     einen 301 www→apex (oder umgekehrt) auf Hosting-Ebene einrichten.

3. **`pathPrefix` / fehlende CNAME passen nicht zur eigenen Domain.**
   Der Workflow baut mit `ELEVENTY_PATH_PREFIX=/Lingener-Baumaschinen/` (Projekt-Subpfad auf
   `lukabpunkt.github.io/Lingener-Baumaschinen/`). Für die eigene Domain im Root muss der Prefix
   `/` sein **und** eine `CNAME`-Datei mit `lingener-baumaschinen.de` ausgeliefert werden (aktuell
   **keine CNAME** vorhanden). Sonst brechen absolute Pfade, Canonicals und Sitemap.
   → Bei Umzug auf Cloudflare/Netlify entfällt der Prefix ohnehin (Custom Domain im Root).

### P1 — Hoch (Ranking-relevant)

4. **Redirect-Map alt→neu umsetzen.** Siehe Abschnitt 5. Grundlage muss eine **vollständige**
   URL-Liste sein: Search-Console-Export „Seiten" + alle Yoast-Sitemaps der Live-Site
   (`/sitemap_index.xml` → page-, post-, product-, category-, ufaq-Sitemaps), nicht nur die Navigation.

5. **Entscheidung FR & ES.** Beide Sprachen entfallen ersatzlos → alle `/fr/…` und `/es/…`
   verlieren ihr Ranking. Optionen: (a) FR/ES neu aufbauen, oder (b) bewusst aufgeben und jede
   FR/ES-URL per 301 auf das passende DE/EN-Pendant leiten. Nicht einfach 404 lassen.

6. **Entscheidung Blog `/aktuelles/`.** Großer indexierter Bestand (oft Long-Tail-Einstieg).
   Entweder migrieren oder die Top-Posts (nach Klicks/Impressions in Search Console) als neue
   Seiten übernehmen und den Rest per 301 auf thematisch nächste Seite leiten.

7. **Anwendungs-Landingpages.** Die ~17 Einzelseiten (Gleisbau, Landschaftsbau, Sportplatzbau,
   Glasfaser, Kabel-/Leitungsverlegung, Bergbau, Landwirtschaft, Straßenbau, Telekommunikation,
   Solar/Wind, Entwässerung u.a.) ranken je für eigene Keywords. Zusammenlegen auf eine Seite kostet
   Long-Tail-Sichtbarkeit. **Empfehlung:** wichtigste 5–8 als eigene Unterseiten erhalten; restliche
   per 301 auf `/anwendungen.html`. Mindestens aber alle per 301 auf `/anwendungen.html` leiten.

8. **Title/H1/Content-Parität für Top-Seiten.** Für jede rankende alte Seite Titel, Meta-Description,
   H1 und Kerntext mit Keywords auf die neue Ziel-URL übertragen. Die generierten Modellseiten
   (`maschinenseiten.js`) sind faktenreich — gut; sicherstellen, dass die alten Keyword-Phrasen
   (z. B. „Baggerfräse", „zur Glasfaserverlegung", „für Schlepper") in Titles/Text vorkommen.

### P2 — Mittel (Hygiene / Monitoring)

9. **Doppelte/veraltete Sitemap entfernen.** Es gibt eine stale `sitemap.xml` im Repo-Root (nur 8
   URLs) **und** die generierte `_site/sitemap.xml` (vollständig). Die Root-Datei löschen, damit nur
   die generierte ausgeliefert wird. Sitemap zusätzlich um `<lastmod>` und ggf. hreflang-Annotationen ergänzen.
10. **`robots.txt` Sitemap-Host** an die finale Kanonisierung anpassen (aktuell `www`).
11. **GA4 aktivieren.** `site.js` enthält Platzhalter `G-XXXXXXXXXX` → kein Tracking. Echte Mess-ID
    eintragen, sonst fehlt nach Go-Live jede Erfolgskontrolle.
12. **Search Console vorbereiten.** Zugriff auf die bestehende Property sichern; die Live-Site nutzt
    das Verifizierungs-Meta `google-site-verification: google3abc3b0fd06a45d1`. Property behalten,
    nach Go-Live neue Sitemap einreichen, Index-Abdeckung + 404 beobachten.
13. **Bild- & PDF-URLs.** Alle `/wp-content/uploads/...` (inkl. Prospekt-PDF
    `Prosp.-gesamt-DE-2023.pdf`) entfallen → verlieren Google-Images-Rankings und externe Verweise.
    Für stark verlinkte Assets (v. a. das Prospekt-PDF) 301 auf das neue Pendant einrichten.
14. **Shop-URLs.** WooCommerce-Seiten (Warenkorb/Kasse/Konto) sind i. d. R. `noindex` — meist
    unkritisch. Falls Produkt-URLs (`product-sitemap.xml`) ranken, in die Redirect-Map aufnehmen.

---

## 5. Redirect-Map (alt → neu)

> Entwurf auf Basis von Navigation + Yoast-Sitemaps. **Vor Einsatz gegen den vollständigen
> Search-Console-/Crawl-Export verifizieren.** Mit „⚠" markierte Zuordnungen manuell prüfen.
> Ziel-URLs hier ohne Host/`.html`-Annahme der finalen Kanonisierung — Schreibweise an Hosting anpassen.

### Standard- und Funktionsseiten

| Alt (Live) | Neu |
|---|---|
| `/maschinen/` | `/maschinen.html` |
| `/anwendungen/` | `/anwendungen.html` |
| `/faq` und `/faq/` | `/faq.html` |
| `/kontakt/` und `/kontakt-2/` | `/kontakt.html` |
| `/mietanfrage/` | `/mieten.html` |
| `/kaufanfrage/` | `/kontakt.html` ⚠ |
| `/anmietung-grabenfraese/`, `/anmietung-einer-grabenfraese/` | `/mieten.html` |
| `/die-vorteile-der-grabenfraesen-miete-effizient-und-kostensparend/` | `/mieten.html` |
| `/gebrauchtmaschinen-ersatzteile-zubehoer/` | `/gebrauchtmaschinen.html` |
| `/extras-fuer-die-grabenfraese/` | `/gebrauchtmaschinen.html` ⚠ |
| `/impressum/` | `/impressum.html` |
| `/datenschutzerklaerung/` | `/datenschutz.html` |
| `/allgemeine-geschaeftsbedingungen/` | `/agb.html` |
| `/videos/` | neue `/videos`-Seite oder `/` ⚠ |
| `/aktuelles/` (+ Posts) | Blog migrieren oder `/` ⚠ |
| `/haendler/` | `/kontakt.html` oder neue Seite ⚠ |
| `/warenkorb/`, `/kasse/`, `/mein-konto/`, `/suchergebniss/` | i. d. R. noindex — nur falls indexiert mappen |

### Anwendungs-Landingpages → `/anwendungen.html` (oder eigene Unterseite)

`/gleisbau-mit-grabenfraesen/`, `/landschaftsbau-mit-grabenfraesen/`, `/sportplatzbau-mit-grabenfraesen/`,
`/kabel-und-leitungsverlegung-mit-grabenfraesen/`, `/glasfaserleitungen-verlegen-mit-grabenfraesen/`,
`/bodenbearbeitung-mit-grabenfraesen/`, `/grabenfraese-im-bergbau/`, `/grabenfraesen-in-der-landwirtschaft/`,
`/strassenbau-mit-grabenfraesen/`, `/stadtplanung-mit-grabenfraesen/`,
`/aufbau-der-telekommunikation-mit-grabenfraesen/`,
`/stromleitungen-fuer-solar-und-windkraftparks-mit-grabenfraesen/`, `/grabenfraese-fuer-spezielle-arbeiten/`,
`/entwaesserungsgraeben-mit-grabenfraesen/`, `/grabenfraese-im-bauwesen/`,
`/bewaesserungssysteme-mit-grabenfraesen/`

### Produkt-Detailseiten → `/maschinen/<modell>.html`

| Alt (Live) | Neu |
|---|---|
| `/grabenfraese-gm-4-raupe-zur-glasfaserverlegung/` | `/maschinen/gm-4-raupe.html` |
| `/kabelverlegung-mit-der-gm-180-af/` | `/maschinen/gm-180-af.html` |
| `/grabenfraese-gm-140-afh-600-im-rohrleitungsbau/`, `/rohrleitungsbau-mit-der-gm-140-afh-600/` | `/maschinen/gm-140-afh-600.html` |
| `/grabenfraese-gm-140-af-fuer-schlepper/`, `/bodenfraese-140-af/` | `/maschinen/gm-140-af.html` |
| `/grabenfraese-gm4-4wd-zur-sportplatzentwaesserung/`, `/gm-4-allrad-die-perfekte-maschine-fuer-den-breitbandausbau/` | `/maschinen/gm-4-allrad.html` |
| `/grabenfraese-gm-140-afh-500-als-baggerfraese/`, `/baggerfrase-gm-140-afh-500/`, `/baggerfraese-gm-140-afh-500/` | `/maschinen/gm-140-afh-500.html` |
| `/grabenfraese-gm-140-h-fuer-bagger/`, `/baggeranbaufraese-gm-140-h/` | `/maschinen/gm-140-h.html` |
| `/kabelbau-mit-der-gm-600-r/` | `/maschinen/gm-600-r.html` |
| `/grabenfraese-gm-6-asr-bewaehrt-sich-im-extrem-harten-gelaende/`, `/grabenfraese-fuer-schweren-boden-gm-6-asr/`, `/grabenfraese-mieten-gm-6-asr-fuer-harte-boeden/` | `/maschinen/gm-6-asr.html` |
| `/grabenfraese-gm-160-af-eine-grabenfraese-fuer-unimog/` | `/maschinen/gm-160-af.html` |
| `/grabenfraese-gm-160-as-fuer-drainage/` | `/maschinen/gm-160-as.html` |
| `/gm-140-as-fraese-fuer-drainage/` | `/maschinen/gm-140-af.html` ⚠ (kein GM 140 AS im Repo) |
| `/grabenfraese-gm-140-afh-600-h/` | `/maschinen/gm-140-af-600-h.html` |
| `/grabenfraese-gm-1800-p-ein-pflug-fuer-den-landschaftsbau/`, `/landschaftsbau-mit-dem-gm-1800-p/` | `/maschinen/gm-1800-p.html` |
| `/grabenfraese-gmv-130-als-vibrationskabelpflug/`, `/vibrationskabelpflug-gmv-130/` | `/maschinen/gmv-130.html` |
| `/grabenfraese-gm-450-h/` | `/maschinen/gm-450-h.html` |
| `/grabenfraese-gm-300-hf-fuer-tiefe-fraesarbeiten/`, `/tiefe-fraesarbeiten-mit-der-gm-300-hf/` | `/maschinen/gm-300-hf.html` |
| `/tiefenfraese-die-optimale-loesung-fuer-effizientes-fraesen/` | `/maschinen/gm-300-h.html` |
| `/tiefenfraese-gm-250-h-fuer-tiefbau/` | `/maschinen/gm-250-h.html` |
| `/erdkabel-verlegen-mit-der-gm-1-as/`, `/traktorfraese-gm-1-as/` | `/maschinen/gm-1-as.html` ⚠ (AF vs AS prüfen) |
| `/anbaupflug-gmv-100/`, `/gmv-100/` | `/maschinen/gmv-100.html` |
| `/unimogfraese/` | `/maschinen/unimogfraese.html` |

### Englische Seiten (`/en/...`)
EN bleibt erhalten, aber Slugs ändern sich (z. B. `/en/machines/` → `/en/maschinen.html`,
`/en/welcome/` → `/en/`, `/en/contact/` & `/en/contact-2/` → `/en/kontakt.html`). EN-Redirect-Map
analog zu DE aus der EN-Sitemap ableiten.

### FR/ES
Sammel-Redirects je Sprache auf das passende DE/EN-Pendant, falls FR/ES nicht neu aufgebaut werden.

---

## 6. Go-Live-Reihenfolge (Kurzfassung)

1. Hosting-Entscheidung (echte 301 möglich) + finale www/apex-Kanonisierung.
2. Vollständige alte URL-Liste exportieren (Search Console + alle Yoast-Sitemaps).
3. Redirect-Map vervollständigen & in `_redirects`/`.htaccess` umsetzen.
4. `pathPrefix=/`, `CNAME` setzen bzw. Custom Domain konfigurieren; alle `www`/`apex`-Strings angleichen.
5. Stale Root-`sitemap.xml` löschen; GA4-ID setzen; `robots.txt`-Host prüfen.
6. Auf Staging crawlen (Screaming Frog): keine ungewollten 404, keine `noindex`-Reste, Redirects greifen.
7. Go-Live → in Search Console neue Sitemap einreichen, „URL prüfen" für Top-Seiten, Redirects testen.
8. 4–8 Wochen Monitoring: Index-Abdeckung, 404-Report, Rankings/Klicks. Kurzfristige Schwankung ist normal.

## 7. Verifikation vor Abnahme
- `npm run build` ohne Fehler; Stichprobe `_site/*.html`: Canonical/hreflang/Title korrekt.
- Redirect-Map gegen Live-Crawl gegengeprüft (jede alte Top-URL hat ein 301-Ziel).
- Keine internen Links auf alte WP-Slugs.
