'use strict';

/* FAQ der Maschinenübersicht (/maschinen.html) — EINE Quelle für den sichtbaren Text UND
   das FAQPage-Schema (Launch-Audit D-08). Vorher standen im Schema andere Fragen und Zahlen
   als auf der Seite, u. a. das nicht existierende Modell "GM 140 AS".
   ade/aen dürfen Links enthalten; fürs Schema werden Tags entfernt.
   ⚠ Die Zahlen (Frästiefen, Trägergewichte) sind noch nicht von LIBA bestätigt und
   widersprechen teils den Datenblättern in maschinen.js — siehe Launch-Audit H-2. */
const items = [
  {
    "qde": "Wie tief kann eine Grabenfräse fräsen?",
    "qen": "How deep can a trench cutter cut?",
    "ade": "Die Frästiefe hängt vom Modell ab. Kompakte Baggeranbau-Fräsen (GM 140 H) erreichen bis zu 900 mm. Schlepperanbau-Modelle wie die GM 180 AF fräsen bis 1.800 mm. Tiefenfräsen gehen deutlich tiefer: die GM 300 H bis 3.000 mm, die GM 450 H bis 4.500 mm — für anspruchsvollen Sondertiefbau und Fernwärmeprojekte.",
    "aen": "Cutting depth depends on the model. Compact excavator-mounted cutters (GM 140 H) reach up to 900 mm. Tractor-mounted models such as the GM 180 AF cut to 1,800 mm. Deep-cut machines go considerably deeper: the GM 300 H to 3,000 mm, the GM 450 H to 4,500 mm — for demanding special civil engineering and district heating projects."
  },
  {
    "qde": "Welche Grabenfräsen gibt es für den Baggeranbau?",
    "qen": "Which trench cutters are available for excavator attachment?",
    "ade": "LIBA bietet folgende Grabenfräsen als Baggeranbaufräsen an: GM 140 H (ab 6 t, bis 900 mm Frästiefe), GM 140 AFH-500 (bis 500 mm, ab 8 t) und GM 140 AFH-600 (bis 600 mm, ab 12 t). Diese Anbaufräsen werden hydraulisch über die Bagger-Hydraulik angetrieben und sind Schnellwechsler-kompatibel.",
    "aen": "LIBA offers the following trench cutters as excavator attachments: GM 140 H (from 6 t, up to 900 mm cutting depth), GM 140 AFH-500 (up to 500 mm, from 8 t) and GM 140 AFH-600 (up to 600 mm, from 12 t). These attachment cutters are hydraulically driven via the excavator hydraulics and are quick-coupler compatible."
  },
  {
    "qde": "Welche Grabenfräsen sind für Traktoren und Schlepper geeignet?",
    "qen": "Which trench cutters are suitable for tractors?",
    "ade": "Als Schlepperanbau-Grabenfräse eignen sich: GM 1 AF, GM 1 AS (bis 400 mm, kompakt), GM 140 AF, GM 160 AF, GM 160 AS (bis 1.200 mm, Mittelklasse) sowie GM 180 AF und GM 600 R (bis 1.800 mm, High-Performance). Die Modellwahl hängt von Frästiefe, Fräsbreite und dem verfügbaren Trägerfahrzeug ab.",
    "aen": "Suitable tractor-mounted trench cutters include: GM 1 AF, GM 1 AS (up to 400 mm, compact), GM 140 AF, GM 160 AF, GM 160 AS (up to 1,200 mm, mid-range) and GM 180 AF and GM 600 R (up to 1,800 mm, high-performance). Model selection depends on cutting depth, cutting width and the available carrier machine."
  },
  {
    "qde": "Kann eine Grabenfräse in hartem Boden oder Fels eingesetzt werden?",
    "qen": "Can a trench cutter be used in hard ground or rock?",
    "ade": "Ja. Die selbstfahrende Grabenfräse GM 6 ASR ist speziell für Hartgestein bis Felsklasse IV entwickelt worden. Sie bewährt sich in Kalkstein, Schiefer und Bergbaugebieten und erreicht Frästiefen bis 800 mm in Fels — wirtschaftlich dort, wo Bagger und Trennsäge nicht rentabel sind.",
    "aen": "Yes. The self-propelled GM 6 ASR trench cutter was developed specifically for hard rock up to rock class IV. It performs reliably in limestone, slate and mining environments, reaching cutting depths of up to 800 mm in rock — economically viable where excavators and cut-off saws are not profitable."
  },
  {
    "qde": "Kann ich bei Lingener Baumaschinen eine Grabenfräse mieten?",
    "qen": "Can I hire a trench cutter from Lingener Baumaschinen?",
    "ade": "Ja. LIBA bietet Grabenfräsen zur Tages-, Wochen- und Monatsmiete an. Verfügbar sind GM 4 Allrad, GM 4 Raupe und GM 6 ASR — jeweils mit Bedienereinweisung und 24/7-Werkshotline während des Einsatzes. Bis zu 100 % der Mietkosten können beim späteren Kauf angerechnet werden. <a href=\"/mieten.html\" style=\"color:var(--brand);text-decoration:underline;\">Zur Mietseite</a>",
    "aen": "Yes. LIBA offers trench cutters for daily, weekly and monthly hire. Available models are GM 4 All-Wheel, GM 4 Crawler and GM 6 ASR — each with operator training and 24/7 factory hotline during deployment. Up to 100% of hire costs can be offset against a subsequent purchase. <a href=\"/en/mieten.html\" style=\"color:var(--brand);text-decoration:underline;\">Go to hire page</a>"
  },
  {
    "qde": "Sind Gebraucht-Grabenfräsen erhältlich?",
    "qen": "Are used trench cutters available?",
    "ade": "Ja. LIBA verkauft gebrauchte Grabenfräsen direkt aus dem Werk — nach vollständiger Werksinspektion, mit lückenloser Maschinenhistorie und Garantie auf alle im Rahmen der Inspektion getauschten Teile. Kein Zwischenhändler, kein Aufschlag. <a href=\"/gebrauchtmaschinen.html\" style=\"color:var(--brand);text-decoration:underline;\">Zu den Gebrauchtmaschinen</a>",
    "aen": "Yes. LIBA sells used trench cutters directly from the factory — after a full factory inspection, with a complete machine history and warranty on all parts replaced during inspection. No middlemen, no premium. <a href=\"/en/gebrauchtmaschinen.html\" style=\"color:var(--brand);text-decoration:underline;\">View used machines</a>"
  },
  {
    "qde": "In welchen Ländern sind LIBA-Grabenfräsen erhältlich?",
    "qen": "In which countries are LIBA trench cutters available?",
    "ade": "Lingener Baumaschinen ist seit 1969 tätig und liefert Grabenfräsen in über 60 Länder weltweit. Vertrieb und Lieferung erfolgen direkt ab Werk Lingen (Ems) — inklusive Tieflader-Transport auf Wunsch. Für internationale Anfragen und Händlerinformationen wenden Sie sich direkt an <a href=\"/kontakt.html\" style=\"color:var(--brand);text-decoration:underline;\">info@lingener-baumaschinen.de</a>.",
    "aen": "Lingener Baumaschinen has been operating since 1969 and delivers trench cutters to over 60 countries worldwide. Sales and delivery are made direct from the Lingen (Ems) factory — including low-loader transport on request. For international enquiries and dealer information, please contact <a href=\"/en/kontakt.html\" style=\"color:var(--brand);text-decoration:underline;\">info@lingener-baumaschinen.de</a> directly."
  }
];

const strip = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function schema(lang) {
  const isDE = lang === 'de';
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: strip(isDE ? i.qde : i.qen),
      acceptedAnswer: { '@type': 'Answer', text: strip(isDE ? i.ade : i.aen) },
    })),
  });
}

module.exports = { items, schema: { de: schema('de'), en: schema('en') } };
