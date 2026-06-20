// Zentrale DE/EN-Übersetzung für Maschinen-Kategorien und -Zustände.
// Genutzt von Templates (maschinen.njk, maschinen/maschine.njk) und von
// src/_data/maschinenseiten.js, damit englische Seiten keine deutschen Begriffe zeigen.
'use strict';

const category = {
  'Selbstfahrer':   { de: 'Selbstfahrer',   en: 'Self-Propelled' },
  'Schlepperanbau': { de: 'Schlepperanbau', en: 'Tractor-Mounted' },
  'Baggeranbau':    { de: 'Baggeranbau',    en: 'Excavator-Mounted' },
};

const condition = {
  'Neu':              { de: 'Neu',              en: 'New' },
  'Gebraucht':        { de: 'Gebraucht',        en: 'Used' },
  'Vorführmaschine':  { de: 'Vorführmaschine',  en: 'Demo' },
};

function cat(value, lang) {
  return (category[value] && category[value][lang]) || value;
}
function cond(value, lang) {
  return (condition[value] && condition[value][lang]) || value;
}

module.exports = { category, condition, cat, cond };
