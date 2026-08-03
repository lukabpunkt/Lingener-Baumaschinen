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
| 3.2 | **„GM 140 AS" — gibt es das Modell?** Die alte URL `/gm-140-as-fraese-fuer-drainage/` leitet derzeit auf GM 140 AF. Richtig? Oder war das die GM 160 AS? **Zusatzbefund 2026-07-27:** Das FAQ-Schema auf `/maschinen.html` nennt „GM 140 AS" als lieferbares Schleppermodell (DE + EN) — ein Modell, zu dem es keine Seite gibt. Google kann das als Produkt ausspielen. Sobald geklärt: entweder Modell anlegen oder aus dem Schema streichen. | Falscher Redirect schickt Kaufinteressenten zum falschen Produkt; falsche strukturierte Daten bei Google. | Alte Produktliste / Vertrieb / alte Prospekte. |
| 3.3 | **GM 1 AS vs. GM 1 AF:** Die alte Seite `/traktorfraese-gm-1-as/` leitet aktuell auf **GM 1 AF** — obwohl es eine eigene GM-1-AS-Seite gibt. Welches neue Modell entspricht der alten „Traktorfräse GM 1 AS"? | dito | dito |
| 3.4 | **Referenzprojekt Gaspipeline: DN 300 bestätigen?** (Seite sagt jetzt einheitlich DN 300; vorher stand an einer Stelle DN400.) | Referenzangaben müssen stimmen. | Projektunterlagen des Referenzprojekts. |
| 3.5 | **Markenname „Grabenmeister":** In der Broschüre 38× prominent, auf der Website nie. Ist das eine echte (Sub-)Marke, die auf die Website soll — oder fliegt sie aus der Broschüre? | Markenauftritt muss konsistent sein (auch für SEO: rankt jemand nach „Grabenmeister"?). | Marketing-/GF-Entscheidung; ggf. Markenregister (DPMA, <https://register.dpma.de>). |
| 3.6 | **Modellnamen in der Broschüre:** „GMA-Serie" (S. 19) — Tippfehler für GM 140 H? Und „GM 500-R" vs. Website „GM 600 R" — umbenannt oder zwei Produkte? | Broschüre und Website müssen dieselben Produkte nennen. | Produktmanagement. |
| 3.7 | **GM 450 H — maximale Frästiefe 4.500 mm bestätigen.** Die Website widersprach sich: Spec-Tabelle und Maschinen-Wizard sagten 4.500 mm, FAQ-Text, Seitentitel, Vergleichstabelle und das FAQ-Schema sagten 3.000 mm. Am 2026-07-27 auf **4.500 mm** vereinheitlicht, weil die 3.000 nachweislich der Wert des GM 300 H ist und pauschal auf die Baureihe übertragen worden war. **Bitte einmal gegen das Datenblatt prüfen** — die Zahl steht jetzt in Titel, Fließtext und strukturierten Daten. | Falsche technische Angabe in Google-Ergebnissen und Angebotsanfragen. | Datenblatt GM 450 H / Konstruktion. |
| 3.8 | **Baggeranbau-Frästiefen: 900 / 500 / 600 mm oder durchgehend 1.500 mm?** Das FAQ-Schema und die FAQ-Texte nennen „GM 140 H bis 900 mm, GM 140 AFH-500 bis 500 mm, GM 140 AFH-600 bis 600 mm"; die Spec-Tabellen derselben Modelle (`src/_data/maschinen.js`) sagen bei allen dreien **1.500 mm**, die Übersichtsseite spricht von „bis 1.400 mm", der Wizard von 1.500 mm. Vier verschiedene Zahlen für dieselbe Baureihe. Zusätzlich widersprüchlich: FAQ sagt Trägergerät „ab 6 t", das Product-Schema „ab 17 t". | Google stuft widersprüchliche strukturierte Daten ab; Kunden bekommen falsche Zusagen. | Datenblätter der GM-140-Reihe. |
| 3.9 | **Abschnitt „Spezialmaschinen" auf `/maschinen.html` — Kennzahlen prüfen.** Dort steht „Fräsbreite bis 350 mm" (Datensatz: bis 600 mm bei der GM 300 HF), „Frästiefe bis 2.000 mm" (Datensatz: 3.000 mm bei der GM 300 H) und „Trägergerät: Schwerlast-Bagger ab 20 t / Unimog" — obwohl alle vier Modelle der Gruppe als **Schlepperanbau mit Zapfwellenantrieb** geführt werden. Bewusst **nicht** eigenmächtig korrigiert, weil unklar ist, welche Seite recht hat. | Falsche Eckdaten auf der meistbesuchten Produktseite. | Datenblätter GM 250 H / GM 300 H / GM 300 HF / GM 450 H. |
| 3.10 | ~~**Calendly-Terminbuchung** zeigte auf das private Konto `luka-bloemendal`~~ **✅ ERLEDIGT (2026-08-03): Funktion ersatzlos entfernt.** Die Terminbuchung gibt es nicht mehr — kein Konto nötig. Kontaktwege sind jetzt Formular, Telefon, WhatsApp und E-Mail. | — | — |

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

> **Stand 2026-07-27: Das Projekt läuft.** Vorschau: <https://lingener-baumaschinen.netlify.app>
> · Dashboard: <https://app.netlify.com/projects/lingener-baumaschinen>
> · Site-ID `b7a1838d-acfe-4523-b82d-9167aaf6d5ee` · Git-angebunden an Branch `main`,
> jeder Push löst automatisch einen Build aus.

### ✅ Bereits erledigt (über die Netlify-API)

- **Formularerkennung aktiviert.** Sie war am Projekt **ausgeschaltet** — die API meldete
  `forms: "not enabled"` und null erkannte Formulare. Wäre die Seite so live gegangen,
  hätte das Frontend jede Anfrage brav mit „gesendet" quittiert, während Netlify nichts
  entgegennimmt: **alle Kundenanfragen wären spurlos verschwunden.**
  Nach dem Aktivieren und einem neuen Deploy sind alle drei Formulare erkannt —
  `kontakt`, `gebrauchtmaschine`, `bewerbung` (letzteres inkl. `lebenslauf` als
  Datei-Feld), jeweils mit aktivem Honeypot.
- **Ende-zu-Ende getestet:** Ein echter Testeintrag über das Kontaktformular kam mit allen
  Feldern korrekt an. Damit ist bewiesen, dass Honeypot, AJAX-POST auf `/` und `form-name`
  zusammenspielen.
- **Projekt umbenannt** von `candid-semolina-d3f436` auf `lingener-baumaschinen`.
- **Security-Header, 301-Redirects und Calendly real verifiziert** — siehe Abschnitt 6b.

### 🔴 Was jetzt nur du im Dashboard machen kannst

1. **E-Mail-Benachrichtigung für die Formulare** — Site → **Forms** → **Form notifications**
   → „Email notification" → Empfänger eintragen (z. B. info@lingener-baumaschinen.de).
   Für `bewerbung` sinnvollerweise eine eigene Benachrichtigung an die/den
   Personalverantwortliche/n, weil dort Lebensläufe als PDF ankommen.
   ⚠️ **Das ist der letzte verbleibende Schritt, damit Anfragen tatsächlich jemanden
   erreichen.** Ohne ihn liegen sie nur im Dashboard und niemand merkt es.
   *(Über die API nicht einstellbar — geht nur in der Oberfläche.)*
   - Nebenbei: Netlify beschriftet die Felder in der Benachrichtigung mit den **englischen**
     Labels („Name *", „Company", „Message *"), weil DE- und EN-Formular denselben
     `form-name` teilen. Nur kosmetisch, die Werte stimmen.
2. **Akismet-Spamfilter** aktivieren — Forms → Spam filtering.
3. **Custom Domain hinzufügen** — Domain management → `lingener-baumaschinen.de` als
   **Primary domain**, `www.lingener-baumaschinen.de` als Alias (Netlify legt www→apex
   als 301 automatisch an). **Das schaltet noch nichts live** — solange das DNS auf
   WordPress zeigt, bleibt die alte Seite online. Erst danach zeigt Netlify die exakten
   DNS-Zielwerte für Punkt 7 an.
4. **Deploy-Benachrichtigung** einrichten (Site configuration → Notifications), damit ein
   fehlgeschlagener Build nicht unbemerkt bleibt.
*(Der Testeintrag aus der Formular-Verifikation wurde wieder gelöscht — das Kontaktformular
steht bei null Einträgen.)*

### 6b · Abnahmemessung auf Netlify (2026-07-27) — erstmals wirklich möglich

Auf der GitHub-Pages-Vorschau war das systembedingt nie prüfbar, weil dort keine Header
und keine Weiterleitungen ausgeliefert werden.

| Geprüft | Ergebnis |
|---|---|
| Security-Header (CSP, HSTS, X-Frame, X-Content-Type, Referrer, Permissions) | ✅ auf Startseite, Maschinenseite, Rechtsseite **und** 404 |
| **Calendly** — der Fall, den erst die unabhängige Prüfung fand | ✅ iframe lädt von `calendly.com` (Apex), **0 CSP-Verstöße** in der Konsole. Der CSP-Fix wirkt. |
| Modell-Redirects, Anwendungs-Landingpages, Funktionsseiten | ✅ Status 301, korrektes Ziel |
| Alte Pfade mit Namenskollision (`/maschinen/`, `/kontakt/`, `/faq/` …) | ✅ **nach Fix**: ein Sprung auf die `.html`-URL. Vorher normalisierte Netlify sie auf eine nicht-kanonische URL. |
| FR/ES → `/en/`, Blog `/aktuelles/*` → `/` | ✅ 301 |
| EN-Deeplinks ohne Mapping | ✅ **nach Fix**: englische 404-Seite mit Status 404. Vorher kam die **deutsche** Fehlerseite, weil die alte Regel `/en/* → /en/` selbstreferenziell war und von Netlify als Schleife ignoriert wurde. |
| Alle echten Seiten DE/EN inkl. 60 Maschinenseiten | ✅ 200 |
| 404 DE und EN | ✅ echter Status 404, jeweils richtige Sprache |

---

## 7 · 🔴 DNS-Umstellung = der eigentliche Go-Live (Domain-Registrar)

**Wo:** Beim Anbieter, bei dem `lingener-baumaschinen.de` registriert ist (dort, wo
bisher auch die WordPress-Site gehostet wird — z. B. IONOS/Strato/all-inkl; steht in
den Unterlagen/Rechnungen des bisherigen Hosters).

1. Login beim Registrar → DNS-Verwaltung der Domain.
2. Netlify zeigt unter Domain management → „Set up Netlify DNS" bzw. „Check DNS
   configuration" die genauen Werte an. Standard:
   - **A-Record** für `@` (apex) → `75.2.60.5` (Netlifys Load-Balancer-IP; **im Dashboard verifizieren**, Netlify zeigt den gültigen Wert nach dem Hinzufügen der Domain an)
   - **CNAME** für `www` → `lingener-baumaschinen.netlify.app`
   - **Nameserver NICHT umstellen.** Wir bleiben bewusst bei deinem DNS-Anbieter und
     ändern dort nur diese zwei Einträge — so bleiben MX-, SPF-, DKIM- und
     DMARC-Records unangetastet und die Firmen-E-Mail kann nicht ausfallen.
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
