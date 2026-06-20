// Redirect-Daten für den Netlify-Umzug (alt -> neu, echte 301).
// Wird von src/_redirects.njk zu _site/_redirects gerendert.
//
// Quellen:
//   1) Maschinen: je Maschine die in maschinen.js gespeicherte oldUrl -> /maschinen/<slug>.html
//   2) manual:    weitere Alt-URL-Varianten je Maschine + Standard-/Funktionsseiten
//                 + Anwendungs-Landingpages, aus CLAUDE.md §5.
//   3) EN:        bekannte EN-Pfade (vollständig erst nach Search-Console-/Sitemap-Export).
//
// Mit ⚠ kommentierte Zuordnungen vor Go-Live gegen den SC-/Crawl-Export prüfen.
// Splat-Sammelregeln (/fr/*, /es/*, /aktuelles/*) stehen direkt in src/_redirects.njk.

'use strict';

const maschinen = require('./maschinen.js');

const ORIGIN = 'https://lingener-baumaschinen.de';

// Vollen URL/Pfad auf reinen Pfad normalisieren (Host weg, Pfad behalten).
function toPath(u) {
  return u.replace(ORIGIN, '').replace(/^https?:\/\/[^/]+/, '');
}

// 1) Haupt-Redirect je Maschine aus den Daten -------------------------------
const machineRedirects = maschinen
  .filter((m) => m.oldUrl)
  .map((m) => ({ from: toPath(m.oldUrl), to: `/maschinen/${m.slug}.html`, status: 301 }));

// 2) Manuelle Map (CLAUDE.md §5) --------------------------------------------
const manual = [
  // --- weitere Produkt-/Maschinen-Alt-URLs (Varianten, die nicht in maschinen.js stehen) ---
  { from: '/grabenfraese-gm-140-afh-600-im-rohrleitungsbau/',          to: '/maschinen/gm-140-afh-600.html' },
  { from: '/grabenfraese-gm-140-af-fuer-schlepper/',                   to: '/maschinen/gm-140-af.html' },
  { from: '/gm-4-allrad-die-perfekte-maschine-fuer-den-breitbandausbau/', to: '/maschinen/gm-4-allrad.html' },
  { from: '/grabenfraese-gm-140-afh-500-als-baggerfraese/',            to: '/maschinen/gm-140-afh-500.html' },
  { from: '/baggeranbaufraese-gm-140-afh-500/',                        to: '/maschinen/gm-140-afh-500.html' },
  { from: '/grabenfraese-gm-140-h-fuer-bagger/',                       to: '/maschinen/gm-140-h.html' },
  { from: '/grabenfraese-gm-6-asr-bewaehrt-sich-im-extrem-harten-gelaende/', to: '/maschinen/gm-6-asr.html' },
  { from: '/grabenfraese-mieten-gm-6-asr-fuer-harte-boeden/',          to: '/maschinen/gm-6-asr.html' },
  { from: '/gm-140-as-fraese-fuer-drainage/',                          to: '/maschinen/gm-140-af.html' }, // ⚠ kein GM 140 AS im Repo
  { from: '/grabenfraese-gm-1800-p-ein-pflug-fuer-den-landschaftsbau/', to: '/maschinen/gm-1800-p.html' },
  { from: '/grabenfraese-gmv-130-als-vibrationskabelpflug/',           to: '/maschinen/gmv-130.html' },
  { from: '/grabenfraese-gm-300-hf-fuer-tiefe-fraesarbeiten/',         to: '/maschinen/gm-300-hf.html' },
  { from: '/gmv-100/',                                                 to: '/maschinen/gmv-100.html' },
  { from: '/grabenfraese-gm-140-afh-600/',                             to: '/maschinen/gm-140-afh-600.html' },

  // --- Standard- & Funktionsseiten ---
  { from: '/maschinen/',                                  to: '/maschinen.html' },
  { from: '/anwendungen/',                                to: '/anwendungen.html' },
  { from: '/faq/',                                        to: '/faq.html' },
  { from: '/faq',                                         to: '/faq.html' },
  { from: '/kontakt/',                                    to: '/kontakt.html' },
  { from: '/kontakt-2/',                                  to: '/kontakt.html' },
  { from: '/mietanfrage/',                                to: '/mieten.html' },
  { from: '/kaufanfrage/',                                to: '/kontakt.html' }, // ⚠
  { from: '/anmietung-grabenfraese/',                     to: '/mieten.html' },
  { from: '/anmietung-einer-grabenfraese/',               to: '/mieten.html' },
  { from: '/die-vorteile-der-grabenfraesen-miete-effizient-und-kostensparend/', to: '/mieten.html' },
  { from: '/gebrauchtmaschinen-ersatzteile-zubehoer/',    to: '/gebrauchtmaschinen.html' },
  { from: '/extras-fuer-die-grabenfraese/',               to: '/gebrauchtmaschinen.html' }, // ⚠
  { from: '/impressum/',                                  to: '/impressum.html' },
  { from: '/datenschutzerklaerung/',                      to: '/datenschutz.html' },
  { from: '/allgemeine-geschaeftsbedingungen/',           to: '/agb.html' },
  { from: '/videos/',                                     to: '/' },             // ⚠ ggf. eigene Videoseite
  { from: '/haendler/',                                   to: '/kontakt.html' }, // ⚠

  // --- Anwendungs-Landingpages -> /anwendungen.html ---
  // HINWEIS: Sobald die 5–8 ranking-stärksten als eigene Unterseiten existieren
  // (Schritt 4, nach Search-Console-Daten), deren Ziel hier auf die neue Unterseite umstellen.
  { from: '/gleisbau-mit-grabenfraesen/',                              to: '/anwendungen.html' },
  { from: '/landschaftsbau-mit-grabenfraesen/',                        to: '/anwendungen.html' },
  { from: '/sportplatzbau-mit-grabenfraesen/',                         to: '/anwendungen.html' },
  { from: '/kabel-und-leitungsverlegung-mit-grabenfraesen/',           to: '/anwendungen.html' },
  { from: '/glasfaserleitungen-verlegen-mit-grabenfraesen/',           to: '/anwendungen.html' },
  { from: '/bodenbearbeitung-mit-grabenfraesen/',                      to: '/anwendungen.html' },
  { from: '/grabenfraese-im-bergbau/',                                 to: '/anwendungen.html' },
  { from: '/grabenfraesen-in-der-landwirtschaft/',                     to: '/anwendungen.html' },
  { from: '/strassenbau-mit-grabenfraesen/',                           to: '/anwendungen.html' },
  { from: '/stadtplanung-mit-grabenfraesen/',                          to: '/anwendungen.html' },
  { from: '/aufbau-der-telekommunikation-mit-grabenfraesen/',          to: '/anwendungen.html' },
  { from: '/stromleitungen-fuer-solar-und-windkraftparks-mit-grabenfraesen/', to: '/anwendungen.html' },
  { from: '/grabenfraese-fuer-spezielle-arbeiten/',                    to: '/anwendungen.html' },
  { from: '/entwaesserungsgraeben-mit-grabenfraesen/',                 to: '/anwendungen.html' },
  { from: '/grabenfraese-im-bauwesen/',                                to: '/anwendungen.html' },
  { from: '/bewaesserungssysteme-mit-grabenfraesen/',                  to: '/anwendungen.html' },

  // --- Englische Seiten (bekannte; vollständig nach EN-Sitemap-Export ergänzen) ---
  { from: '/en/machines/',                                to: '/en/maschinen.html' },
  { from: '/en/welcome/',                                 to: '/en/' },
  { from: '/en/contact/',                                 to: '/en/kontakt.html' },
  { from: '/en/contact-2/',                               to: '/en/kontakt.html' },
];

// Status auf manuelle Einträge ergänzen (Default 301).
const manualRedirects = manual.map((r) => ({ status: 301, ...r }));

// Zusammenführen; spätere Einträge gewinnen nicht automatisch — Reihenfolge bleibt,
// _redirects.njk gibt sie in dieser Reihenfolge aus (spezifisch vor Splat).
module.exports = [...machineRedirects, ...manualRedirects];
