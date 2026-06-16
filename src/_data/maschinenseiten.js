'use strict';
const maschinen = require('./maschinen.js');

const BASE = 'https://www.lingener-baumaschinen.de';

/* Build combined Product + BreadcrumbList JSON-LD for one machine in one language. */
function buildSchema(m, lang) {
  const isDE = lang === 'de';
  const url = BASE + (isDE ? `/maschinen/${m.slug}.html` : `/en/maschinen/${m.slug}.html`);
  const subtitle = isDE ? m.subtitleDE : m.subtitleEN;
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
    manufacturer: {
      '@type': 'Organization',
      name: 'Lingener Baumaschinen GmbH & Co. KG',
      url: BASE,
    },
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
      itemCondition: m.condition === 'Neu'
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'Organization',
        name: 'Lingener Baumaschinen GmbH & Co. KG',
      },
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

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [product, breadcrumb] });
}

module.exports = maschinen.flatMap(m =>
  ['de', 'en'].map(lang => ({
    ...m,
    lang,
    langDE: `/maschinen/${m.slug}.html`,
    langEN: `/en/maschinen/${m.slug}.html`,
    schema: buildSchema(m, lang),
  }))
);
