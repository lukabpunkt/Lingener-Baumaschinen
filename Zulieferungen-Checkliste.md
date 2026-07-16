# Zulieferungen-Checkliste — was nur du/der Betreiber liefern kann

> Stand: 2026-07-09. Alle Repo-seitigen Fixes, die ohne diese Infos möglich waren, sind
> umgesetzt (Redirect-Grundgerüst, CSP ohne unsafe-inline, Hero-LCP, Sitemap-lastmod,
> EN-Fixes). Diese Liste enthält **nur noch** Punkte, die externe Daten, Zugänge oder
> Entscheidungen erfordern — mit genauer Anleitung, wo alles zu finden ist.
> **Gesamtstatus & abgehakte Punkte: → `GO-LIVE-Checkliste.md`**

---

## 1 · 🔴 Alte URL-Liste für die Redirect-Map (wichtigster Punkt)

**Wozu:** Jede alte URL ohne 301-Ziel wird nach dem Umzug zum 404 → Ranking-Verlust.
Die Redirect-Map im Repo ist ein Entwurf; vollständig wird sie erst mit den echten Daten.

### 1a · Google Search Console Export
1. Öffne <https://search.google.com/search-console> und melde dich mit dem Google-Konto
   an, das die Property verwaltet. (Falls du nicht weißt, welches Konto: Es ist das Konto,
   mit dem die alte Website bei Google angemeldet wurde. Die Altsite trägt das
   Verifizierungs-Meta `google3abc3b0fd06a45d1` — der Website-Betreuer der alten
   WordPress-Site weiß, wem das gehört.)
2. Wähle oben links die Property **lingener-baumaschinen.de** (Domain-Property oder
   URL-Präfix — nimm die, die existiert).
3. Linkes Menü → **Indexierung → Seiten**.
4. Oben rechts **Exportieren** → „Als CSV herunterladen" (oder Google Sheets).
   → Das liefert alle Seiten, die Google kennt (indexiert UND nicht indexiert — beide
   Tabs/Abschnitte mitnehmen, falls getrennt exportiert wird).
5. Zusätzlich wertvoll: Linkes Menü → **Leistung** → Zeitraum „12 Monate" →
   Tab **Seiten** → Exportieren. → Das zeigt, welche URLs echten Traffic haben
   (Priorisierung: diese URLs müssen perfekt gemappt sein).

### 1b · Yoast-Sitemaps der alten Site (solange WordPress noch live ist!)
1. Rufe im Browser auf: `https://lingener-baumaschinen.de/sitemap_index.xml`
2. Dort sind mehrere Unter-Sitemaps verlinkt, typisch:
   `page-sitemap.xml`, `post-sitemap.xml`, `product-sitemap.xml`,
   `category-sitemap.xml`, `ufaq-sitemap.xml` — je ggf. auch für EN/FR/ES.
3. **Jede** Unter-Sitemap öffnen und speichern (Cmd+S im Browser, als XML/HTML) —
   oder mir einfach die URLs nennen, dann lade ich sie selbst.
4. ⚠️ **Zeitkritisch:** Sobald die alte WordPress-Site abgeschaltet ist, sind diese
   Sitemaps weg. Jetzt sichern, auch wenn der Umzug später kommt.

**Abgabe an mich:** CSV-Export(e) + Sitemap-Dateien (oder deren URLs) — Format egal,
Hauptsache vollständig.

---

## 2 · 🟡 GA4-Mess-ID (sonst keine Besucherstatistik nach Launch)

1. Öffne <https://analytics.google.com> (Google-Konto der Firma).
2. Unten links **Zahnrad „Verwaltung"** → Spalte „Property" → **Datenstreams**
   (bzw. „Datenströme").
3. Klicke den **Web-Datenstrom** für `lingener-baumaschinen.de` an.
4. Oben rechts steht die **Mess-ID** im Format `G-XXXXXXXXXX` → kopieren, mir geben.
5. **Falls es noch kein GA4 gibt:** Verwaltung → „Property erstellen" →
   Property-Name z. B. „LIBA Website" → Zeitzone Deutschland →
   Plattform „Web" → URL `lingener-baumaschinen.de` eintragen → die dabei erzeugte
   Mess-ID kopieren. (Der alte WordPress-Auftritt hatte evtl. noch Universal
   Analytics „UA-…" — das zählt nicht, es muss eine `G-…`-ID sein.)

**Abgabe an mich:** die `G-…`-ID als Text. Eintrag + Aktivierung übernehme ich
(`src/_data/site.js`, das Snippet ist bereits vorbereitet).

---

## 3 · 🔴 Firmen-/Produktfakten (nur LIBA kann das verbindlich sagen)

Am schnellsten: kurzes Gespräch/Mail mit **GF Thorsten Schrader** bzw. Vertrieb/Produktmanagement.

| # | Frage | Warum wichtig | Wo nachschlagen |
|---|-------|---------------|-----------------|
| 3.1 | ~~Gründungsjahr: 1964 oder 1969?~~ **✅ GEKLÄRT (2026-07-16): 1969 ist korrekt** (Betreiber-Bestätigung). Website war durchgängig korrekt (0× „1964" in Quellcode & Build, Schema `foundingDate: 1969`). Auch die im Repo eingebundenen Broschüren-PDFs 2026 sind bereits korrigiert (6× „1969", „Über fünf Jahrzehnte"). Keine weitere Aktion nötig. | — | — |
| 3.2 | **„GM 140 AS" — gibt es das Modell?** Die alte URL `/gm-140-as-fraese-fuer-drainage/` leitet derzeit auf GM 140 AF. Richtig? Oder war das die GM 160 AS? | Falscher Redirect schickt Kaufinteressenten zum falschen Produkt. | Alte Produktliste / Vertrieb / alte Prospekte. |
| 3.3 | **GM 1 AS vs. GM 1 AF:** Die alte Seite `/traktorfraese-gm-1-as/` leitet aktuell auf **GM 1 AF** — obwohl es eine eigene GM-1-AS-Seite gibt. Welches neue Modell entspricht der alten „Traktorfräse GM 1 AS"? | dito | dito |
| 3.4 | **Referenzprojekt Gaspipeline: DN 300 bestätigen?** (Seite sagt jetzt einheitlich DN 300; vorher stand an einer Stelle DN400.) | Referenzangaben müssen stimmen. | Projektunterlagen des Referenzprojekts. |
| 3.5 | **Markenname „Grabenmeister":** In der Broschüre 38× prominent, auf der Website nie. Ist das eine echte (Sub-)Marke, die auf die Website soll — oder fliegt sie aus der Broschüre? | Markenauftritt muss konsistent sein (auch für SEO: rankt jemand nach „Grabenmeister"?). | Marketing-/GF-Entscheidung; ggf. Markenregister (DPMA, <https://register.dpma.de>). |
| 3.6 | **Modellnamen in der Broschüre:** „GMA-Serie" (S. 19) — Tippfehler für GM 140 H? Und „GM 500-R" vs. Website „GM 600 R" — umbenannt oder zwei Produkte? | Broschüre und Website müssen dieselben Produkte nennen. | Produktmanagement. |

---

## 4 · 🟡 Redirect-Zielentscheidungen (deine/Betreiber-Präferenz)

Kein Technik-Thema — einfach entscheiden und mir sagen:

1. **`/videos/`** (alte Videoseite): eigene neue Videoseite bauen (YouTube-Kanal
   existiert: @lingenerbaumaschine) **oder** einfach auf die Startseite leiten? *(Aktuell: Startseite.)*
2. **`/haendler/`** (alte Händlerseite): neue Händler-/Vertriebsseite **oder** auf
   Kontakt leiten? *(Aktuell: Kontakt.)*
3. **`/kaufanfrage/`** → Kontakt und **`/extras-fuer-die-grabenfraese/`** → Gebrauchtmaschinen:
   passt das so? *(Aktuelle Annahmen.)*
4. **Anwendungs-Landingpages:** ~16 alte Einzelseiten (Gleisbau, Glasfaser, Sportplatzbau …)
   leiten aktuell alle auf die eine Anwendungen-Seite. Für Long-Tail-SEO wäre besser,
   die **5–8 wichtigsten als eigene Unterseiten** wieder aufzubauen. → Entscheidung
   fällt am besten NACH dem Search-Console-Export (Punkt 1a zeigt, welche Traffic hatten).
5. **Blog `/aktuelles/`:** alle alten Beiträge leiten aktuell auf die Startseite.
   Sollen die Top-Beiträge (nach Punkt 1a) als neue Seiten übernommen werden?
6. **FR/ES:** beide Sprachen leiten auf `/en/`. Bewusst aufgeben — oder ist FR/ES-Neuaufbau
   je ein Thema für später? (Kostet nichts, jetzt zu bestätigen.)

---

## 5 · 🟡 Team-Seite: echte Inhalte oder noindex

Die Team-Seite ist aktuell mit **KI-generierten Beispiel-Portraits** gefüllt. Vor Go-Live:
- **Option A:** Echte Inhalte — ich brauche pro Person: Name, Funktion, Foto
  (Querformat oder quadratisch, min. ~800px). Personen: GF + 6 Mitarbeiter.
  → Fotos als Dateien (JPG/PNG/HEIC egal) + Namen/Funktionen als Liste.
- **Option B:** Seite vorerst auf `noindex` setzen und aus Navigation/Footer nehmen,
  bis echte Fotos da sind. (5-Minuten-Änderung, sag einfach Bescheid.)

⚠️ KI-Portraits als „unser Team" live zu stellen ist rechtlich/reputativ riskant — nicht empfohlen.

---

## 6 · 🔴 Netlify-Konto & Dashboard-Aktionen (kann nur der Kontoinhaber)

**Voraussetzung:** Netlify-Konto, verbunden mit dem GitHub-Repo `lukabpunkt/Lingener-Baumaschinen`.
Falls noch nicht geschehen: <https://app.netlify.com> → „Add new site" → „Import an
existing project" → GitHub → Repo wählen. Build-Einstellungen werden automatisch aus
`netlify.toml` gelesen — nichts eintragen.

Danach im Netlify-Dashboard:
1. **Forms aktivieren + E-Mail-Benachrichtigung:** Site → **Forms** → nach dem ersten
   Deploy erscheinen die Formulare (`kontakt`, `gebrauchtmaschine`, `bewerbung`) →
   **Form notifications** → „Email notification" → Empfängeradresse
   (z. B. info@lingener-baumaschinen.de) eintragen. Für `bewerbung` (Karriere-Seite,
   Initiativbewerbungen inkl. Lebenslauf-PDF) ggf. eine eigene Benachrichtigung an
   die/den Personalverantwortliche/n einrichten.
   ⚠️ Ohne diesen Schritt landen Kundenanfragen NUR im Dashboard und niemand merkt es.
2. Optional: Forms → Spam-Schutz (Akismet) aktivieren.
3. **Custom Domain:** Site → Domain management → `lingener-baumaschinen.de` als
   **Primary domain** hinzufügen (apex, ohne www; www als Alias → Netlify leitet
   automatisch www→apex per 301 um).
4. **Deploy-Preview testen** (VOR der DNS-Umstellung!): Die `…netlify.app`-URL aufrufen —
   ich mache dann die technische Verifikation (301-Stichproben, Security-Header, Formulare).

---

## 7 · 🔴 DNS-Umstellung = der eigentliche Go-Live (Domain-Registrar)

**Wo:** Beim Anbieter, bei dem `lingener-baumaschinen.de` registriert ist (dort, wo
bisher auch die WordPress-Site gehostet wird — z. B. IONOS/Strato/all-inkl; steht in
den Unterlagen/Rechnungen des bisherigen Hosters).

1. Login beim Registrar → DNS-Verwaltung der Domain.
2. Netlify zeigt unter Domain management → „Set up Netlify DNS" bzw. „Check DNS
   configuration" die genauen Werte an. Standard:
   - **A-Record** für `@` (apex) → `75.2.60.5` (Netlifys Load-Balancer-IP; im Dashboard verifizieren!)
   - **CNAME** für `www` → `<sitename>.netlify.app`
3. Alte A-/CNAME-Records auf den WordPress-Server entfernen/ersetzen.
4. ⚠️ **Reihenfolge:** Erst wenn Punkt 6 komplett ist und die Preview geprüft wurde.
   Ab diesem Schritt ist die neue Site live — Rückweg nur durch DNS-Rückstellung.
5. **E-Mail-Records NICHT anfassen:** MX-, bestehende SPF/TXT-Records für E-Mail
   unverändert lassen, sonst fällt die Firmen-Mail aus.

---

## 8 · 🟡 E-Mail-Sicherheit SPF/DKIM/DMARC (gleicher Ort wie Punkt 7)

Beim DNS des Mailproviders (meist derselbe Registrar):
1. Prüfen, ob es TXT-Records gibt: `v=spf1 …` (SPF), `default._domainkey…` (DKIM),
   `_dmarc` (DMARC). Schnelltest: <https://mxtoolbox.com/SuperTool.aspx> → Domain eingeben
   → „SPF Record Lookup" / „DMARC Lookup".
2. Fehlende Records ergänzen — die korrekten Werte hängen vom **Mail-Anbieter** ab
   (wer hostet info@lingener-baumaschinen.de? Dessen Doku hat die exakten Werte).
3. DMARC-Minimalstart: TXT-Record `_dmarc.lingener-baumaschinen.de` =
   `v=DMARC1; p=none; rua=mailto:info@lingener-baumaschinen.de`

---

## 9 · 🟢 Nach dem Go-Live (Search Console, Monitoring)

1. Search Console (Punkt 1a) → Property behalten! → **Sitemaps** →
   `https://lingener-baumaschinen.de/sitemap.xml` einreichen.
2. **Indexierung → Seiten** und **404-Fehler** 4–8 Wochen wöchentlich anschauen;
   auffällige 404 an mich → ich ergänze Redirects.
3. „URL-Prüfung" (oben in der Search Console) für die 5–10 wichtigsten Seiten →
   „Indexierung beantragen".

---

## 10 · 🟢 Broschüren-PDFs (Grafiker, nicht Repo)

~~Gründungsjahr~~ **✅ erledigt** — die eingebundenen 2026er-PDFs sagen bereits 6× „1969"
und „Über fünf Jahrzehnte" (geprüft per Textextraktion, 2026-07-16).
Verbleibende Faktenfragen aus Punkt 3 („Grabenmeister", GMA/GM 500-R, zwei kaputte
EN-Sätze S. 13/26) stecken ggf. noch in den PDF-Broschüren. Korrigierbar nur in der
**Original-Layoutdatei** (InDesign/Affinity) — beim Grafiker/der Agentur anfragen, die die
Broschüre 2026 erstellt hat. Danach neue PDFs an mich → ich tausche sie im Repo.

---

## Kurz-Priorisierung

| Prio | Punkt | Blockiert |
|------|-------|-----------|
| 🔴 jetzt | 1 (SC-Export + Yoast-Sitemaps sichern — zeitkritisch!) | finale Redirect-Map |
| 🔴 jetzt | 3.1–3.3 (Gründungsjahr, GM-140-AS, GM-1-AS/AF) | Fakten-Fixes auf ~70 Seiten |
| 🔴 vor Go-Live | 6 (Netlify verbinden, Forms-Mail) | Formulare, Preview-Test |
| 🟡 vor Go-Live | 2 (GA4-ID), 4 (Redirect-Ziele), 5 (Team) | Tracking, Feinschliff |
| 🔴 Go-Live | 7 (DNS) | — der Umzug selbst |
| 🟡 parallel | 8 (SPF/DKIM/DMARC) | Mail-Zustellung |
| 🟢 danach | 9 (Search Console), 10 (Broschüre) | Monitoring, Print |
