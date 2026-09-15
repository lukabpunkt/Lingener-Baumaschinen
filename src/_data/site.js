// Zentrale Website-Konfiguration.
//
// DOMAIN (Launch-Audit B-1): Alle absoluten URLs (canonical, hreflang, og:image, Sitemap,
// robots.txt, llms.txt, JSON-LD) werden im Quelltext gegen die Referenz-Domain REFERENCE_URL
// geschrieben und beim Build von der Transform in .eleventy.js auf `url` umgeschrieben.
// Die Ziel-Domain kommt aus der Umgebung — ein Domainwechsel ist damit eine Zeile in
// netlify.toml ([context.production.environment] SITE_URL) plus Rebuild, kein Code-Umbau.
//   1. SITE_URL  – explizit gesetzt (netlify.toml), maßgeblich
//   2. URL       – von Netlify gesetzt: Primary Domain des Projekts (sonst *.netlify.app)
//   3. REFERENCE_URL – lokaler Build ohne Umgebung
const REFERENCE_URL = "https://lingener-baumaschinen.de";

const url = (process.env.SITE_URL || process.env.URL || REFERENCE_URL).replace(/\/+$/, "");
const host = url.replace(/^https?:\/\//, "");

// NOINDEX: global "nicht indexieren" (meta robots, keine Sitemap-Zeile in robots.txt).
// Automatisch aktiv für Netlify-Vorschauen (Deploy Previews, Branch-Deploys) und solange
// die Seite nur unter *.netlify.app läuft. Für den Parallelbetrieb neben WordPress bewusst
// per SITE_NOINDEX=1 schaltbar (Entscheidung E-1 im Launch-Audit).
const noindex =
  process.env.SITE_NOINDEX === "1" ||
  (!!process.env.CONTEXT && process.env.CONTEXT !== "production") ||
  /\.netlify\.app$/.test(host);

// ALIAS-HOSTS: Domains, die per 301 auf `url` umgeleitet werden (späterer Umzug, z. B.
// SITE_ALIAS_HOSTS="neue-domain.de,www.neue-domain.de"). Die Regeln stehen ganz oben in
// _redirects, damit sie vor den WordPress-Pfadregeln greifen.
const aliasHosts = (process.env.SITE_ALIAS_HOSTS || "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

// Google Analytics 4 — echte Mess-ID hier eintragen (Format: G-XXXXXXXXXX).
// Solange der Platzhalter steht, wird weder Analytics-Code noch Cookie-Banner ausgeliefert.
// GA4 lädt ausschließlich NACH Einwilligung (strenger Consent, main.js).
const ga4 = "G-XXXXXXXXXX";

module.exports = {
  langs: ["de", "en"],
  referenceUrl: REFERENCE_URL,
  url,
  host,
  noindex,
  aliasHosts,
  ga4,
  ga4Active: /^G-[A-Z0-9]+$/.test(ga4) && ga4 !== "G-XXXXXXXXXX",
};
