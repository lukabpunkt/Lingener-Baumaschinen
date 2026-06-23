# DE↔EN-Paritätsanalyse — sind deutsche & englische Seite inhaltlich synchron?

**Datum:** 2026-06-24 · **Methodik:** deterministischer Struktur-Skelett-Diff über **44 Seitenpaare** (Headings, Bilder, Links, Zahlen, Komponenten-Anzahl) **+ 3 unabhängige Agenten**, die die gerenderten Texte DE↔EN sinngemäß verglichen haben. **Report-only.** Vorgabe: DE und EN sollen **inhaltlich identisch** sein, erlaubte Unterschiede **nur** Sprache + Broschüre (+ `/en/`-URL/lang/hreflang).

## ✅ Status 2026-06-24: BEHOBEN — EN an DE angeglichen
Alle drei Divergenz-Quellen wurden behoben (EN als treue Übersetzung an DE angeglichen): Footer-Service-Spalte (+ „Used machines"), Startseite (Hero-H1/Subtext/4. Slide/Statistiken, finaler CTA, Anwendungs-Karten) und die Rechtszitate (§ 36 VSBG, § 25 TTDSG/Art. 6 DSGVO). **Verifikation:** deterministischer Skelett-Diff jetzt **43/44 voll synchron** (Rest = nur der erlaubte WhatsApp-Sprachtext); Start-/Kontaktseiten axe-CLEAN, 0 Konsolenfehler. Der Bericht unten dokumentiert den ursprünglichen Befund.

---

## Ursprünglicher Befund: 🟡 Überwiegend synchron — 3 Divergenz-Quellen

Die Seite ist **strukturell sehr gut synchronisiert**: Fast alle Seiten sind treue Übersetzungen mit identischen Zahlen, Specs, Karten-Anzahlen und Schema. Die Abweichungen stammen aus **nur drei Quellen**:
1. **Footer** (site-weit, alle 44 Seiten) — eine Struktur-Divergenz.
2. **Startseite** (`index.njk`) — Hero + Marketing-Blöcke sind teils **Neutexte statt Übersetzungen**.
3. **Impressum + Datenschutz** — 3 kleine Rechtszitate fehlen/abweichen in EN.

Alle übrigen ~40 Paare: **SYNCED** (maschinen, anwendungen, mieten, unternehmen, team, kontakt, faq, gebrauchtmaschinen, referenzen, agb + alle geprüften Maschinenseiten).

---

## 🟠 DIVERGENZ 1 — Footer „Service"-Spalte (STRUKTUR, alle 44 Seiten)
- **Ort:** `src/_includes/base.njk` (DE-Footer vs separater EN-Footer-Block)
- **Beleg:** DE-Footer **20** Links, EN-Footer **19**. Die DE-„Service"-Spalte hat **6** Einträge (Mieten, **Gebrauchtmaschinen**, Referenzen, Ersatzteile, Schulungen, Häufige Fragen), die EN-„Service"-Spalte nur **5** (Rental, Spare parts, Training, References, FAQ) — EN fehlt der Eintrag **Gebrauchtmaschinen/Used machines** in der Service-Spalte. (In der „Produkte"-Spalte steht „Used machines" auf beiden Seiten.)
- **Typ:** STRUKTUR / missing-in-EN · **Empfehlung:** in den EN-Footer denselben „Used machines"-Eintrag in die Service-Spalte aufnehmen (oder in DE entfernen) — eine Zeile in `base.njk`.

## 🟠 DIVERGENZ 2 — Startseite Hero & Marketing-Texte (`src/index.njk`)
Mehrere Blöcke sind **bewusst unterschiedlich getextet**, nicht übersetzt:

| Block | DE | EN | Typ |
|---|---|---|---|
| **Hero-Slides** | 4 Bilder/Dots (inkl. `hero-4`) | 3 | MEDIA |
| **Hero-Stat #2** | „**1000+** Maschinen im Einsatz" | „**40+** Machine models" | DATEN (anderer Wert + andere Kennzahl) |
| **Hero-Stat #4** | „**24 h** Ersatzteil-Lieferzeit" | „**100 %** Made in Germany" | DATEN |
| **Hero-H1** | „Wir fräsen, wo andere graben." | „Built for the toughest ground." | anderer Sinn (Slogan) |
| **Hero-Subtext** | „Seit über fünfzig Jahren entwickelt und fertigt LIBA Grabenfräsen, Anbaufräsen und Spezialmaschinen … Robust. Präzise. Made in Germany." | „LIBA manufactures chain trenchers and trench cutters for pipeline, fibre optic, power cable and utility installation — from compact tractor-mounted models to heavy-duty self-propelled machines for rock." | anderer Sinn (komplett anderer Satz) |
| **Stat „Founded"-Beschr.** | „Familienbetrieb seit über fünf Jahrzehnten im Emsland." | „Family-owned business in Lingen (Ems), Germany." | anderer Sinn (DE betont „fünf Jahrzehnte") |
| **Finaler CTA** (Eyebrow/H2/Lead/dt) | „Beratung anfordern" · „Welche Fräse passt zu Ihrem Projekt?" · „… Innerhalb von 24 Stunden eine technische Einschätzung direkt vom LIBA-Werk." · „Telefon" | „Direct from the manufacturer" · „No dealers. No middlemen. Just LIBA." · „… typical daily output figures. All from our engineering team in Lingen." · „Sales — direct from the factory" | anderer Sinn (DE: 24-h-Zusage; EN: „keine Zwischenhändler") |
| **Anwendungs-Karte #6** | „Tief- & Spezialbau" / „Bergbau, Felsen, Gleisbau — …" | „Mining & Rock" / „Where excavators fail, LIBA begins." | EN lässt „Bergbau, Felsen, Gleisbau" weg |
| Karten #1/#4/#5 (klein) | je eine Zusatz-Teilaussage (z. B. „wirtschaftlich überlegen") | in EN gekürzt | CONTENT (kleinere Kürzungen) |

- **Empfehlung:** Quelle festlegen (i. d. R. ist **DE der vollere/markentreuere Master**) und **EN als treue Übersetzung** angleichen — inkl. 4. Hero-Slide und der Hero-Statistiken. Alles in `src/index.njk`.

## 🔵 DIVERGENZ 3 — Rechtszitate in EN (Impressum/Datenschutz)
- **Impressum** (`src/impressum.njk`): EN lässt „**(§ 36 VSBG)**" weg (EU-Streitschlichtung); EN hat **einen Satz mehr** unter „Haftung für Links" („Permanent monitoring … not reasonable …"), der im DE fehlt. → angleichen (Zitat in EN ergänzen bzw. den Zusatzsatz spiegeln).
- **Datenschutz** (`src/datenschutz.njk`): EN §5 verallgemeinert „in accordance with applicable law", DE zitiert „**§ 25 TTDSG und Art. 6 DSGVO**". → Zitate in EN ergänzen.
- **Typ:** CONTENT (Rechtszitat) · niedrige Priorität, aber für saubere Rechtstexte angleichen.

---

## Pro-Seiten-Matrix (44 Paare)
| Bereich | Status |
|---|---|
| **index.html** | 🟠 DIVERGES (Hero + CTA + Karten, s. Divergenz 2) |
| maschinen · anwendungen · mieten | ✅ SYNCED (Zahlen/Modelllisten/Specs identisch) |
| unternehmen · team · kontakt · faq · gebrauchtmaschinen · referenzen | ✅ SYNCED |
| impressum · datenschutz | 🔵 DIVERGES (Rechtszitate, s. Divergenz 3) |
| agb | ✅ SYNCED |
| **30 Maschinen-Detailseiten** | ✅ SYNCED (Stichprobe 5: Spec-Werte/FAQ identisch; PS↔hp ist die gewollte Übersetzung) |
| **Footer (alle 44 Seiten)** | 🟠 DIVERGES (s. Divergenz 1) |

## Anhang — Erlaubte Unterschiede (bewusst KEINE Divergenz)
- Sprache des Textes · Broschüre `LIBA-Broschuere.pdf` ↔ `LIBA-Brochure.pdf` · `/en/`-URL-Präfix · `lang`/`hreflang`/`og:locale` · aktiver Zustand des Sprachumschalters · WhatsApp-Prefill-Text in der jeweiligen Sprache · Einheiten **PS** (DE) ↔ **hp** (EN) auf Maschinenseiten · der deutsche Behördenname auf der EN-Datenschutzseite (mit englischer Erläuterung).

## Bonus-Fund (keine Paritäts-Frage, aber ein echter Bug — in BEIDEN Sprachen gleich)
- **referenzen:** `og:description` nennt „pipeline **DN400**", die sichtbare Projekt-2-Tabelle aber „**DN 300**" — identisch falsch in DE **und** EN. Kein Paritäts-Problem, aber ein Zahlen-Fehler, den man bei Gelegenheit korrigieren sollte.

## Verifikation der Analyse
- Alle 44 Paare durch den deterministischen Skelett-Diff (`/tmp/liba-qa/artifacts/parity.json`); 1 voll synchron im Rohdiff, 43 nur wegen des Footer-Universalfalls — die seitenspezifischen Divergenzen ausschließlich auf `index.html` + die 3 Textfunde.
- Text-Divergenzen von 3 unabhängigen Agenten **mit wörtlichen DE/EN-Zitaten** belegt; Struktur-Divergenzen (Footer, Hero-Slides/Stats) zusätzlich deterministisch bestätigt (Footer 20 vs 19 Links; `data-count` 1000 vs 40; Hero-Slides 4 vs 3).
- **Klartext:** Vor Launch anzugleichen sind **`src/index.njk`** (Hero/CTA/Karten — größter Block), **`src/_includes/base.njk`** (ein Footer-Eintrag) und **`src/impressum.njk` + `src/datenschutz.njk`** (3 Rechtszitate). Alles andere ist bereits sprach-synchron.
