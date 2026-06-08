'use strict';
const maschinen = require('./maschinen.js');

module.exports = maschinen.flatMap(m =>
  ['de', 'en'].map(lang => ({
    ...m,
    lang,
    langDE: `/maschinen/${m.slug}.html`,
    langEN: `/en/maschinen/${m.slug}.html`,
  }))
);
