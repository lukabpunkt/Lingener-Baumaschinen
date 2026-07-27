'use strict';

/* General buyer-oriented FAQ — single source for visible content AND FAQPage schema. */
const items = [
  {
    qde: 'Was ist eine Grabenfräse?',
    ade: 'Eine Grabenfräse ist eine Baumaschine, die mit einer umlaufenden, hartmetallbestückten Fräskette oder einem Fräsrad schmale, exakt definierte Gräben in den Boden schneidet. Anders als ein Bagger erzeugt sie saubere, gleichmäßige Grabenwände bei hoher Tagesleistung – ideal für Kabel-, Glasfaser-, Rohr- und Drainageverlegung.',
    qen: 'What is a trench cutter?',
    aen: 'A trench cutter is a construction machine that cuts narrow, precisely defined trenches into the ground using a rotating, carbide-tipped cutting chain or cutter wheel. Unlike an excavator it produces clean, uniform trench walls at high daily output – ideal for cable, fibre-optic, pipe and drainage installation.',
  },
  {
    qde: 'Wie tief kann eine LIBA-Grabenfräse fräsen?',
    ade: 'Die Frästiefe hängt vom Modell ab. Kompakte Baggeranbau-Fräsen erreichen bis zu 900 mm, Schlepperanbau-Modelle wie die GM 180 AF bis 1.800 mm. Tiefenfräsen wie die GM 450 H ermöglichen bis zu 4.500 mm Frästiefe für anspruchsvollen Sondertiefbau.',
    qen: 'How deep can a LIBA trench cutter cut?',
    aen: 'Cutting depth depends on the model. Compact excavator-mounted cutters reach up to 900 mm, tractor-mounted models such as the GM 180 AF up to 1,800 mm. Deep-cut machines such as the GM 450 H enable up to 4,500 mm for demanding special civil engineering.',
  },
  {
    qde: 'Kann ich bei LIBA eine Grabenfräse mieten?',
    ade: 'Ja. LIBA bietet Grabenfräsen zur Miete an – unter anderem die GM 4 Raupe, GM 4 Allrad und GM 6 ASR. Die Mietgeräte werden direkt vom Werk Lingen geliefert, inklusive Bedienereinweisung. Bis zu 100 % der Mietzeit sind später auf einen Kauf anrechenbar.',
    qen: 'Can I hire a trench cutter from LIBA?',
    aen: 'Yes. LIBA offers trench cutters for hire – including the GM 4 Crawler, GM 4 All-Wheel and GM 6 ASR. Hire machines are delivered directly from the Lingen factory, including operator training. Up to 100% of the hire period can later be offset against a purchase.',
  },
  {
    qde: 'Bietet LIBA gebrauchte Grabenfräsen an?',
    ade: 'Ja. Neben Neumaschinen bietet LIBA geprüfte Gebraucht-Grabenfräsen mit Werksinspektion, Maschinenhistorie und Werksgarantie auf die Instandsetzung an. Das aktuelle Angebot finden Sie im Bereich Gebrauchtmaschinen.',
    qen: 'Does LIBA offer used trench cutters?',
    aen: 'Yes. In addition to new machines, LIBA offers inspected used trench cutters with a factory inspection, machine history and factory warranty on the reconditioning. The current stock is shown in the used machines section.',
  },
  {
    qde: 'Welche Grabenfräsen gibt es für den Baggeranbau?',
    ade: 'LIBA bietet als Baggeranbaufräsen die GM 140 H (ab 6 t, bis 900 mm), GM 140 AFH-500 (ab 8 t, bis 500 mm) und GM 140 AFH-600 (ab 12 t, bis 600 mm) an. Sie werden über die Bagger-Hydraulik angetrieben und sind schnellwechsler-kompatibel.',
    qen: 'Which trench cutters are available for excavator attachment?',
    aen: 'As excavator attachments LIBA offers the GM 140 H (from 6 t, up to 900 mm), GM 140 AFH-500 (from 8 t, up to 500 mm) and GM 140 AFH-600 (from 12 t, up to 600 mm). They are driven via the excavator hydraulics and are quick-coupler compatible.',
  },
  {
    qde: 'Welche Grabenfräsen eignen sich für Traktoren und Schlepper?',
    ade: 'Als Schlepperanbaufräsen eignen sich kompakte Modelle wie GM 1 AF und GM 1 AS (bis 400 mm), die Mittelklasse GM 140 AF, GM 160 AF und GM 160 AS (bis 1.200 mm) sowie die High-Performance-Modelle GM 180 AF und GM 600 R (bis 1.800 mm).',
    qen: 'Which trench cutters are suitable for tractors?',
    aen: 'Suitable tractor-mounted cutters include compact models such as the GM 1 AF and GM 1 AS (up to 400 mm), the mid-range GM 140 AF, GM 160 AF and GM 160 AS (up to 1,200 mm) and the high-performance GM 180 AF and GM 600 R (up to 1,800 mm).',
  },
  {
    qde: 'Kann eine Grabenfräse in Fels und hartem Boden eingesetzt werden?',
    ade: 'Ja. Die selbstfahrende GM 6 ASR ist für Hartgestein bis Felsklasse IV entwickelt und bewährt sich in Kalkstein, Schiefer und im Bergbau. Sie ist dort wirtschaftlich, wo Bagger und Trennsäge an ihre Grenzen kommen.',
    qen: 'Can a trench cutter be used in rock and hard ground?',
    aen: 'Yes. The self-propelled GM 6 ASR is built for hard rock up to rock class IV and performs reliably in limestone, slate and mining. It is economical where excavators and cut-off saws reach their limits.',
  },
  {
    qde: 'Wofür wird eine Grabenfräse eingesetzt?',
    ade: 'LIBA-Grabenfräsen werden im Glasfaser- und Telekommunikationsausbau (FTTH), in der Strom- und Solartrassenverlegung, im Pipeline- und Rohrleitungsbau, in der Drainage, im Sportplatz- und Gleisbau sowie in der Landwirtschaft eingesetzt – überall, wo präzise Gräben wirtschaftlich entstehen müssen.',
    qen: 'What is a trench cutter used for?',
    aen: 'LIBA trench cutters are used in fibre-optic and telecom rollout (FTTH), power and solar cable installation, pipeline and pipe construction, drainage, sports-field and track construction as well as agriculture – wherever precise trenches must be cut economically.',
  },
  {
    qde: 'Was kostet eine Grabenfräse von LIBA?',
    ade: 'Der Preis hängt von Modell, Frästiefe, Trägergerät und Werkzeugbestückung ab. Da jede Maschine individuell konfiguriert wird, erstellt LIBA ein passgenaues Angebot. Schildern Sie uns Ihr Einsatzprofil – Sie erhalten innerhalb von 24 Stunden eine technische Einschätzung direkt vom Werk.',
    qen: 'How much does a LIBA trench cutter cost?',
    aen: 'The price depends on model, cutting depth, carrier machine and tooling. As every machine is individually configured, LIBA prepares a tailored quote. Tell us your application profile – you will receive a technical assessment directly from the factory within 24 hours.',
  },
  {
    qde: 'Liefert LIBA weltweit?',
    ade: 'Ja. LIBA ist seit 1969 tätig und verfügt über ein weltweites Händlernetz. Die Maschinen werden in nahezu alle Teile der Welt geliefert und sind auf vier Kontinenten im Einsatz.',
    qen: 'Does LIBA deliver worldwide?',
    aen: 'Yes. LIBA has been operating since 1969 and has a worldwide dealer network. The machines are delivered to almost every part of the world and are deployed on four continents.',
  },
  {
    qde: 'Gibt es Ersatzteile und Service direkt vom Werk?',
    ade: 'Ja. LIBA liefert Originalersatzteile direkt aus dem Werk Lingen – auch für Maschinen, die seit Jahrzehnten im Einsatz sind. Eine 24/7-Werkshotline unterstützt bei technischen Fragen.',
    qen: 'Are spare parts and service available directly from the factory?',
    aen: 'Yes. LIBA supplies original spare parts directly from the Lingen factory – including for machines that have been in service for decades. A 24/7 factory hotline supports with technical questions.',
  },
  {
    qde: 'Wo werden LIBA-Grabenfräsen hergestellt?',
    ade: 'Alle LIBA-Grabenfräsen werden in Lingen (Ems), Deutschland, entwickelt, geschweißt und montiert – Made in Germany seit 1969. Konstruktion und Fertigung finden unter einem Dach statt.',
    qen: 'Where are LIBA trench cutters manufactured?',
    aen: 'All LIBA trench cutters are developed, welded and assembled in Lingen (Ems), Germany – Made in Germany since 1969. Design and manufacturing take place under one roof.',
  },
];

function schema(lang) {
  const isDE = lang === 'de';
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(i => ({
      '@type': 'Question',
      name: isDE ? i.qde : i.qen,
      acceptedAnswer: { '@type': 'Answer', text: isDE ? i.ade : i.aen },
    })),
  });
}

module.exports = {
  items,
  schema: { de: schema('de'), en: schema('en') },
};
