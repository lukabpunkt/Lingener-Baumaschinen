# Broschüren-Analyse — LIBA (DE & EN, je 28 Seiten)

**Datum:** 2026-06-24 · **Methodik:** PDFs gerendert (poppler) + Text extrahiert; **4 unabhängige Agenten** (DE-Sprache · EN-Sprache · DE↔EN-Parität · Fakten/Website-Abgleich) + deterministische Verifikation der Kernfunde. **Report-only.**

> **Wichtig:** Das sind fertige PDFs — ich kann Fehler **benennen** (Seite + Stelle + Korrektur), aber die PDFs **nicht editieren**. Korrekturen gehören in die **Originaldatei** (InDesign/Affinity o. Ä.) und werden neu exportiert. Diese Datei ist die **Korrekturvorlage**.

## Gesamturteil: 🟡 Gute Broschüren — aber **2 kritische Inhalts-Widersprüche** vor weiterer Verteilung klären

Sprachlich sauber (DE praktisch fehlerfrei), **DE und EN inhaltlich deckungsgleich** (0 Spec-Abweichungen), Kontaktdaten stimmen mit der Website. **Aber:** Die Broschüre widerspricht der Website bei **Gründungsjahr** und **Markenname** — das untergräbt die Glaubwürdigkeit und muss entschieden werden. Dazu einige Modell-/Sprach-Korrekturen.

| Schweregrad | Anzahl |
|---|---|
| 🔴 Critical | 2 |
| 🟡 Major | 3 |
| 🔵 Minor | ~12 (inkl. EN-Sprachpolitur) |

---

## 🔴 CRITICAL — Widerspruch Broschüre ↔ Website (beide Sprachen)

### B-1 · Gründungsjahr: Broschüre „**1964**" vs. Website „**1969**"
- **Belegt (deterministisch):** Website-Schema `"foundingDate":"1969"`, „seit 1969"/„since 1969" durchgängig. Broschüre: „SEIT 1964 / SINCE 1964", „1964 Gründung in Lingen", „…GERMANY 1964"-Siegel — **6×** auf Cover, S. 2, 3, 4, 28.
- **Folgefehler:** S. 3 „**Sechs Jahrzehnte / Six Decades**" baut auf 1964 auf. Wäre 1969 korrekt, sind „60 Jahre / sechs Jahrzehnte" zu hoch (real ~57).
- **Eines von beiden ist falsch.** → **Du musst das echte Gründungsjahr bestätigen**, dann die falsche Quelle korrigieren (Broschüre **oder** Website). Bis dahin Critical.

### B-2 · Markenname „**Grabenmeister**" (38×) — auf der Website nicht vorhanden
- **Belegt:** Broschüre brandet alles „Grabenmeister" — „PRODUKTKATALOG GRABENMEISTER · 2024", Fußzeile fast jeder Seite, „Selbstfahrer ‚Grabenmeister'", S. 3 „Die Marke Grabenmeister entsteht / The Grabenmeister brand is born". Das **echte LIBA-Logo** ist zwar auf Cover/Kontakt vorhanden (gut), aber das dominante Markenwort ist „Grabenmeister".
- **Website:** nutzt **nie** „Grabenmeister" — durchgängig „LIBA / Lingener Baumaschinen", Modelle „GM …".
- **Entscheidung nötig:** Ist „Grabenmeister" eine echte (Sub-)Marke/Produktlinie, die **auf die Website** gehört — oder soll sie **aus der Broschüre raus**, damit beides konsistent ist? Aktuell wirken Broschüre und Website wie zwei verschiedene Marken.

---

## 🟡 MAJOR

### B-3 · „**GMA-Serie / GMA series**" auf S. 19 — falscher/verwaister Modellname (DE+EN)
- **Belegt:** S. 19 (GM 140 H): DE „Die **GMA-Serie** fräst den Graben…", EN „The **GMA series** cuts the trench…". „GMA" existiert **nirgends sonst** (weder Broschüre noch Website). Vermutlich Tippfehler/Altbestand. → korrigieren zu „**GM 140 H**" (oder „Diese Maschine").

### B-4 · Modell **GM 500-R** (Broschüre) vs **GM 600 R** (Website)
- **Belegt:** Broschüre nennt das Fräsrad „GM 500-R" (Tiefe 500 mm, 50–200 mm). Website/`maschinen.js` hat **kein** GM 500-R, sondern **GM 600 R** (Tiefe 600 mm, 80–200 mm). → Klären: **umbenannt** (dann eine Quelle angleichen) oder **zwei verschiedene Produkte**? So wirkt es widersprüchlich.

### B-5 · EN: zwei kaputte/unvollständige Sätze
- **S. 13** (GM 1800 P): „Around 400 hp of engine power and a fully hydrostatic crawler travel drive…" — Satzfragment ohne Hauptverb. → „It is powered by around 400 hp and a fully hydrostatic crawler travel drive…".
- **S. 26** (Zubehör): „…for laying work in a single pass and thus noticeably less time." — fehlendes Wort/Präposition. → „…in a single pass **and thus in noticeably less time**.".

---

## 🔵 MINOR
**Fakten/Modelle**
- **GM 300 H** zeigt „3.000 / 4.500 mm" (S. 22/23) — die 4.500 mm gehören laut Website zur separaten **GM 450 H**. Prüfen, ob GM 300 H wirklich 4.500 mm erreicht.
- „**30+ Typen / over 30 types**" (S. 2/3) vs. Website „**30** Maschinenmodelle". Wording angleichen.
- „**GM 1-AS**" (Broschüre, mit Bindestrich) vs. „GM 1 AS"/„GM 1 AF" (Website, ohne). Broschüre zeigt nur AS. Schreibweise vereinheitlichen.

**Veraltet / Kontakt**
- Cover **„· 2024"** (Katalogdatum) — aktuell ist 2026; bei Neuauflage aktualisieren.
- S. 28 **„www.lingener-baumaschinen.de"** — Website ist kanonisch **ohne www** (`lingener-baumaschinen.de`). Für Konsistenz die apex-Form drucken.
- S. 28 **Fax**: „Fax 0591 76547" — Format weicht von der Telefonnummer ab (international „+49 (0) 591 76 547"); Fax steht in der Broschüre, aber nicht auf der Website (prüfen, ob noch aktiv).
- Adresse: Broschüre „Diekstra**ß**e", Website „Diekstra**ss**e" — beide korrekt (ß/ss), nur Variante; optional vereinheitlichen.

**EN-Sprachpolitur (Germanismen/Calques, kosmetisch)**
- „programme" → „range/line-up" (S. 2) · „maker" vs „manufacturer" uneinheitlich (S. 2 vs 27) · „top class" → „top-of-the-range" (S. 13) · „realised" → „achieved" (S. 25) · „track camber" → „oscillating track" (S. 10) · „Earthwork in Perfection" wirkt steif (S. 1/4/28) · „100 l" → „100 l/min" (Hydraulik, S. 11) · cm vs mm gemischt (S. 12). · „super-creeper" → „creep gear" (S. 24).

**DE-Sprache**
- Praktisch **fehlerfrei** (0 Major). Einziger Punkt: S. 28 Fax-Format wie oben.

---

## ✅ Stark / verifiziert sauber
- **DE-Text print-ready** (Rechtschreibung/Umlaute/Komposita/Zeichensetzung korrekt; vermeintliche „garbled"-Stellen sind nur Text-Extraktions-Artefakte überlappender Design-Ebenen — auf den gerenderten Seiten sauber).
- **DE↔EN-Parität HOCH:** **0 Spec-/Zahlen-Abweichungen** über alle 28 Seiten; gleiche Struktur/Reihenfolge/Bilder. Nur 2 triviale Lokalisierungs-Unterschiede (DE „Schlepper"+„Traktor"; EN-Adresse mit „· Germany").
- **Kontaktdaten** (Telefon, E-Mail, Adresse) stimmen mit der Website überein; überlappende Maschinen-Specs (GM 6 ASR, GM 1800 P, GMV 130, GM 450 H u. a.) stimmen mit `maschinen.js`.

## Offene Entscheidungen für dich
1. **Echtes Gründungsjahr** (1964 oder 1969?) → falsche Quelle korrigieren (B-1).
2. **„Grabenmeister"** — echte Marke (→ auf die Website) oder raus aus der Broschüre? (B-2).
3. **GM 500-R vs GM 600 R** — umbenannt oder zwei Produkte? (B-4).
4. „GMA-Serie" = welcher Modellname? (B-3, vermutlich GM 140 H).

## Abdeckung & Methodik
Alle **28 Seiten beider Broschüren** als Text geprüft + Schlüsselseiten (Cover, Specs, Kontakt) als Bild verifiziert. 4 unabhängige Agenten; Critical-Funde deterministisch gegengeprüft (Gründungsjahr, „GMA", GM 500-R, Marke). Korrekturen erfordern die **Original-Layoutdatei**. Roh-Artefakte: `/tmp/liba-brochure/` (Seiten-PNGs + Texte).
