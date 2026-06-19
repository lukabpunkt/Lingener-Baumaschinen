# Relaunch-SEO-Checkliste — lingener-baumaschinen.de

**Ziel:** Die neue Website auf der bestehenden Domain live stellen, ohne Google-Ranking und
Sichtbarkeit zu verlieren.
**Ausgangslage:** Alt = WordPress (WPML 4 Sprachen, WooCommerce, Yoast, großer Blog).
Neu = statische Eleventy-Site (DE + EN), Deploy aktuell via GitHub Pages.
**Datum:** 17.06.2026

Die Domain bleibt gleich — damit bleiben Domain-Autorität, Backlinks und Markenbekanntheit erhalten.
Das Risiko liegt nicht im Domain- oder Dateiwechsel selbst, sondern darin, dass sich **fast alle
URLs ändern** und mehrere Inhaltsbereiche (FR/ES, Blog, Shop, Einzel-Landingpages) wegfallen.
Genau das adressiert diese Checkliste.

---

## Phase 1 — Bestandsaufnahme (vor allem anderen)

- [ ] **Vollständige URL-Liste der alten Site exportieren.** Quellen kombinieren: Google Search
      Console → „Seiten" (indexierte URLs) und alle Yoast-Sitemaps unter
      `https://lingener-baumaschinen.de/sitemap_index.xml` (page-, post-, product-, category-, ufaq-).
- [ ] **Top-Seiten nach Leistung markieren** (Search Console: Klicks & Impressionen, letzte 12 Monate).
      Diese Seiten haben Priorität bei Redirect und Inhaltsübernahme.
- [ ] **Backlink-Ziele prüfen** (z. B. via Search Console „Links" → meistverlinkte Seiten): Diese
      URLs unbedingt per 301 weiterleiten, damit Linkkraft erhalten bleibt.
- [ ] **Ranking-Baseline sichern** (Screenshot/Export wichtigster Keywords + Positionen als Vorher-Vergleich).

## Phase 2 — Grundsatzentscheidungen (Scope)

- [ ] **www oder ohne www?** Alt = ohne www (`lingener-baumaschinen.de`). Neue Site nutzt aktuell
      überall `www`. Eine Variante festlegen — am sichersten die bisherige beibehalten — und die
      jeweils andere per 301 darauf weiterleiten.
- [ ] **Französisch & Spanisch:** entfallen in der neuen Site. Entscheiden: neu aufbauen ODER bewusst
      aufgeben und alle `/fr/…` und `/es/…` per 301 auf das DE/EN-Pendant leiten (nicht 404 lassen).
- [ ] **Blog `/aktuelles/`:** großer indexierter Bestand. Migrieren, Top-Artikel übernehmen, oder
      sauber per 301 weiterleiten.
- [ ] **Anwendungs-Landingpages (~17 Einzelseiten):** in der neuen Site auf eine Seite reduziert.
      Wichtigste als eigene Unterseiten erhalten; Rest per 301 auf `/anwendungen.html`.
- [ ] **Shop (WooCommerce):** entfällt. Prüfen, ob Produkt-URLs ranken; falls ja, in Redirect-Map aufnehmen.

## Phase 3 — Technisches Setup (kritisch)

- [ ] **Echte 301-Weiterleitungen sicherstellen.** GitHub Pages kann das **nicht** serverseitig.
      Empfehlung: Umzug auf **Cloudflare Pages** oder **Netlify** (`_redirects` mit `301`) oder
      Hosting mit `.htaccess`. Ohne 301-Fähigkeit kein verlustarmer Relaunch.
- [ ] **Redirect-Map alt→neu vollständig anlegen** (Entwurf liegt in `CLAUDE.md`, Abschnitt 5) und
      gegen die Bestandsliste aus Phase 1 abgleichen — jede wichtige alte URL braucht ein Ziel.
- [ ] **Custom Domain korrekt konfigurieren:** Build-`pathPrefix` auf `/` und `CNAME` setzen (bzw.
      Domain bei Cloudflare/Netlify im Root verbinden). Aktuell baut der Workflow auf einen
      GitHub-Projekt-Unterpfad — das passt nicht zur eigenen Domain.
- [ ] **Kanonische Tags prüfen:** `<link rel="canonical">` zeigt auf finale Host-Variante (www/apex einheitlich).
- [ ] **hreflang prüfen:** DE/EN korrekt verknüpft (x-default → DE). Entfallene Sprachen nicht mehr referenzieren.
- [ ] **Sitemap aufräumen:** veraltete Root-`sitemap.xml` (nur 8 URLs) löschen; nur die generierte,
      vollständige Sitemap ausliefern. Idealerweise `<lastmod>` ergänzen.
- [ ] **`robots.txt`:** keine versehentliche `Disallow: /`-Sperre aus der Entwicklung; Sitemap-Zeile
      auf finalen Host. (Aktuell sauber `Allow: /`, inkl. KI-Crawler — gut.)
- [ ] **`noindex` ausschließen:** sicherstellen, dass keine Seite ungewollt auf `noindex` steht
      (Front-Matter-Flag `noindex` nur auf rechtlich/technisch gewollten Seiten).
- [ ] **HTTPS:** Zertifikat für die finale Domain aktiv; kein Mixed Content.

## Phase 4 — Inhalt & On-Page

- [ ] **Titel & Meta-Descriptions** der rankenden Seiten auf die neuen Ziel-URLs übertragen
      (Keywords erhalten, z. B. „Baggerfräse", „zur Glasfaserverlegung", „für Schlepper").
- [ ] **H1 & Kerntext** thematisch deckungsgleich halten — neue Modellseiten sind faktenreich, aber
      die ursprünglichen Such-Phrasen sollten vorkommen.
- [ ] **Bilder & PDF:** stark verlinkte Assets (v. a. Prospekt-PDF) per 301 auf neue Pfade leiten;
      Alt-Texte für Google Images vergeben.
- [ ] **Interne Verlinkung:** keine Links auf alte WP-Slugs; Navigation und Footer konsistent.
- [ ] **Strukturierte Daten** (FAQ-/Produkt-Schema) vorhanden und valide.
- [ ] **Ladezeit / Core Web Vitals:** neue Seite mindestens so schnell wie die alte (statisch = Vorteil).

## Phase 5 — Go-Live

- [ ] **Staging-Crawl** (z. B. Screaming Frog): keine ungewollten 404, Redirects greifen (301, kein 302),
      keine `noindex`-Reste, Canonicals korrekt.
- [ ] **Deploy** auf finale Domain.
- [ ] **Redirects live testen** (Stichprobe alter Top-URLs → landen per 301 am richtigen Ziel).
- [ ] **Google Search Console:** bestehende Property behalten (Verifizierung sichern), **neue Sitemap
      einreichen**, „URL-Prüfung" + Indexierung für die Top-Seiten anstoßen.
- [ ] **Analytics aktiv:** echte GA4-Mess-ID eingetragen (aktuell Platzhalter `G-XXXXXXXXXX`).

## Phase 6 — Monitoring (4–8 Wochen)

- [ ] **Search Console täglich/wöchentlich:** Index-Abdeckung, 404-Report, Crawl-Fehler.
- [ ] **Rankings & Klicks** gegen die Baseline aus Phase 1 vergleichen.
- [ ] **404-Treffer in Redirects nachpflegen**, sobald übersehene alte URLs auftauchen.
- [ ] Kurzfristige Schwankung nach dem Relaunch ist normal; bei sauberer Umsetzung Erholung meist
      innerhalb weniger Wochen.

---

### Für den Käufer in einem Satz
Solange URLs per 301 weitergeleitet, Inhalte/Keywords der Top-Seiten übernommen und Technik
(Kanonisierung, Sitemap, Indexierbarkeit) sauber gesetzt sind, bleibt das Ranking trotz neuer
Website erhalten — der Hauptaufwand liegt in der vollständigen Redirect-Strategie und der
Entscheidung über die wegfallenden Bereiche (FR/ES, Blog, Shop).
