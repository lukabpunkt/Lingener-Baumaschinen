/* GA4 + Consent Mode v2 — ausgelagert aus base.njk, damit die CSP ohne 'unsafe-inline' auskommt.
   Die Mess-ID kommt aus dem data-ga4-Attribut am eigenen <script>-Tag (zentral in src/_data/site.js).
   Muss VOR dem async gtag.js-Loader ausgeführt werden (daher ohne defer/async eingebunden). */
(function () {
  var id = document.currentScript && document.currentScript.dataset.ga4;
  if (!id) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag; // global, damit der Consent-Banner in main.js 'consent update' senden kann
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 800 });
  gtag('js', new Date());
  gtag('config', id);
})();
