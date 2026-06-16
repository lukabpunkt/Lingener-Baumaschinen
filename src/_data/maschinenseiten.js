'use strict';
const maschinen = require('./maschinen.js');

const BASE = 'https://www.lingener-baumaschinen.de';

/* Find first spec whose German label matches one of the given needles. */
function findSpec(m, needles) {
  return (m.specs || []).find(s =>
    needles.some(n => (s.de || '').toLowerCase().includes(n))
  );
}
function specVal(spec, isDE) {
  if (!spec) return null;
  return (!isDE && spec.valEN) ? spec.valEN : spec.val;
}

/* Build a 90–120 word, fact-rich intro paragraph from the spec data. */
function buildIntro(m, lang) {
  const isDE = lang === 'de';
  const depth = findSpec(m, ['frästiefe', 'verlegetiefe']);
  const width = findSpec(m, ['fräsbreite', 'schwertbreite']);
  const carrier = findSpec(m, ['trägergerät', 'trägerfahrzeug']);
  const subtitle = isDE ? m.subtitleDE : m.subtitleEN;

  const facts = [];
  if (isDE) {
    if (depth) facts.push(`eine maximale ${depth.de.replace(' max.', '')} von ${specVal(depth, true)}`);
    if (width) facts.push(`eine ${width.de} von ${specVal(width, true)}`);
    const factSentence = facts.length
      ? `Sie erreicht ${facts.join(' und ')}${carrier ? ` und ist für ${specVal(carrier, true)} ausgelegt` : ''}.`
      : '';
    return `Die ${m.name} ist eine ${m.category}-Grabenfräse von LIBA Lingener Baumaschinen aus Lingen (Ems): ${subtitle}. ${factSentence} Wie alle LIBA-Maschinen wird sie im eigenen Werk entwickelt, geschweißt und montiert – Made in Germany seit 1969. Eingesetzt wird die ${m.name} im Tiefbau, in der Kabel- und Glasfaserverlegung sowie im Pipeline-, Drainage- und Gleisbau – weltweit und unter härtesten Bedingungen.`.replace(/\s+/g, ' ').trim();
  }
  if (depth) facts.push(`a maximum ${depth.en.replace(' max.', '').toLowerCase()} of ${specVal(depth, false)}`);
  if (width) facts.push(`a ${width.en.toLowerCase()} of ${specVal(width, false)}`);
  const factSentence = facts.length
    ? `It reaches ${facts.join(' and ')}${carrier ? `, designed for ${specVal(carrier, false)}` : ''}.`
    : '';
  return `The ${m.name} is a ${m.category} trench cutter by LIBA Lingener Baumaschinen from Lingen (Ems), Germany: ${subtitle}. ${factSentence} Like every LIBA machine it is engineered, welded and assembled in our own factory – Made in Germany since 1969. The ${m.name} is used in civil engineering, cable and fibre-optic installation as well as pipeline, drainage and track construction – worldwide and under the toughest conditions.`.replace(/\s+/g, ' ').trim();
}

/* Build 3–5 fact-based Q&A pairs from the spec data (visible text == schema). */
function buildFaqs(m, lang) {
  const isDE = lang === 'de';
  const depth = findSpec(m, ['frästiefe', 'verlegetiefe']);
  const width = findSpec(m, ['fräsbreite', 'schwertbreite']);
  const carrier = findSpec(m, ['trägergerät', 'trägerfahrzeug']);
  const motor = findSpec(m, ['motor', 'fahrantrieb', 'antrieb']);
  const isVerlege = depth && depth.de.toLowerCase().includes('verlege');
  const faqs = [];

  if (depth) {
    faqs.push(isDE ? {
      q: `Welche maximale ${isVerlege ? 'Verlegetiefe' : 'Frästiefe'} hat die ${m.name}?`,
      a: `Die ${m.name} erreicht eine maximale ${isVerlege ? 'Verlegetiefe' : 'Frästiefe'} von ${specVal(depth, true)}. Die tatsächliche Tiefe hängt von Bodenart und Konfiguration ab.`,
    } : {
      q: `What is the maximum ${isVerlege ? 'laying' : 'cutting'} depth of the ${m.name}?`,
      a: `The ${m.name} reaches a maximum ${isVerlege ? 'laying' : 'cutting'} depth of ${specVal(depth, false)}. The actual depth depends on ground type and configuration.`,
    });
  }
  if (width) {
    faqs.push(isDE ? {
      q: `Welche Fräsbreite hat die ${m.name}?`,
      a: `Die ${width.de} der ${m.name} beträgt ${specVal(width, true)}.`,
    } : {
      q: `What cutting width does the ${m.name} have?`,
      a: `The ${width.en.toLowerCase()} of the ${m.name} is ${specVal(width, false)}.`,
    });
  }
  if (carrier) {
    faqs.push(isDE ? {
      q: `Welches Trägergerät benötigt die ${m.name}?`,
      a: `Die ${m.name} ist für ${specVal(carrier, true)} ausgelegt.`,
    } : {
      q: `Which carrier machine does the ${m.name} require?`,
      a: `The ${m.name} is designed for ${specVal(carrier, false)}.`,
    });
  } else if (m.category === 'Selbstfahrer' && motor) {
    faqs.push(isDE ? {
      q: `Wie wird die ${m.name} angetrieben?`,
      a: `Die ${m.name} ist eine selbstfahrende Grabenfräse. ${motor.de}: ${specVal(motor, true)}.`,
    } : {
      q: `How is the ${m.name} powered?`,
      a: `The ${m.name} is a self-propelled trench cutter. ${motor.en}: ${specVal(motor, false)}.`,
    });
  }
  faqs.push(isDE ? {
    q: `Wofür eignet sich die ${m.name}?`,
    a: `Die ${m.name} ist eine ${m.category}-Maschine von LIBA: ${m.subtitleDE}. Typische Einsatzbereiche sind Tiefbau, Kabel- und Glasfaserverlegung, Pipeline-, Drainage- und Gleisbau.`,
  } : {
    q: `What is the ${m.name} suitable for?`,
    a: `The ${m.name} is a ${m.category} machine by LIBA: ${m.subtitleEN}. Typical applications include civil engineering, cable and fibre-optic installation, pipeline, drainage and track construction.`,
  });
  faqs.push(isDE ? {
    q: `Wo wird die ${m.name} hergestellt?`,
    a: `Die ${m.name} wird von LIBA Lingener Baumaschinen in Lingen (Ems), Deutschland, entwickelt und gefertigt – Made in Germany seit 1969.`,
  } : {
    q: `Where is the ${m.name} manufactured?`,
    a: `The ${m.name} is developed and manufactured by LIBA Lingener Baumaschinen in Lingen (Ems), Germany – Made in Germany since 1969.`,
  });
  return faqs;
}

/* Up to 3 other machines in the same category, for internal linking. */
function relatedMachines(m) {
  return maschinen
    .filter(x => x.category === m.category && x.slug !== m.slug)
    .slice(0, 3)
    .map(x => ({ name: x.name, slug: x.slug }));
}

/* Combined Product + BreadcrumbList + FAQPage JSON-LD for one machine/language. */
function buildSchema(m, lang, faqs) {
  const isDE = lang === 'de';
  const url = BASE + (isDE ? `/maschinen/${m.slug}.html` : `/en/maschinen/${m.slug}.html`);
  const image = BASE + m.heroImage;

  const product = {
    '@type': 'Product',
    name: isDE ? `Grabenfräse ${m.name}` : `Trench cutter ${m.name}`,
    description: isDE
      ? `${m.name}: ${m.subtitleDE}. ${m.category}-Grabenfräse von LIBA Lingener Baumaschinen — Made in Germany seit 1969.`
      : `${m.name}: ${m.subtitleEN}. ${m.category} trench cutter by LIBA Lingener Baumaschinen — Made in Germany since 1969.`,
    sku: m.slug,
    model: m.name,
    category: m.category,
    image: image,
    brand: { '@type': 'Brand', name: 'Lingener Baumaschinen' },
    manufacturer: { '@type': 'Organization', name: 'Lingener Baumaschinen GmbH & Co. KG', url: BASE },
    additionalProperty: (m.specs || []).map(s => ({
      '@type': 'PropertyValue',
      name: isDE ? s.de : s.en,
      value: (!isDE && s.valEN) ? s.valEN : s.val,
    })),
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: m.condition === 'Neu' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      seller: { '@type': 'Organization', name: 'Lingener Baumaschinen GmbH & Co. KG' },
    },
  };
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isDE ? 'Start' : 'Home', item: BASE + (isDE ? '/' : '/en/') },
      { '@type': 'ListItem', position: 2, name: isDE ? 'Maschinen' : 'Machines', item: BASE + (isDE ? '/maschinen.html' : '/en/maschinen.html') },
      { '@type': 'ListItem', position: 3, name: m.name, item: url },
    ],
  };
  const faqPage = {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [product, breadcrumb, faqPage] });
}

module.exports = maschinen.flatMap(m =>
  ['de', 'en'].map(lang => {
    const faqs = buildFaqs(m, lang);
    return {
      ...m,
      lang,
      langDE: `/maschinen/${m.slug}.html`,
      langEN: `/en/maschinen/${m.slug}.html`,
      intro: buildIntro(m, lang),
      faqs,
      related: relatedMachines(m),
      schema: buildSchema(m, lang, faqs),
    };
  })
);
