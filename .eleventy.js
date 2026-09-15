const { HtmlBasePlugin } = require("@11ty/eleventy");
const site = require("./src/_data/site.js");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
  eleventyConfig.addPassthroughCopy({"src/favicon.ico": "favicon.ico"});

  // Domain-Umschreibung (Launch-Audit B-1): Templates schreiben absolute URLs gegen
  // site.referenceUrl; hier werden sie auf die konfigurierte Ziel-Domain (site.url)
  // gesetzt. Gilt für HTML, XML (Sitemap) und TXT (robots.txt, llms.txt).
  // E-Mail-Adressen (@lingener-baumaschinen.de) sind nicht betroffen — sie haben kein https://.
  // scripts/check-domain.js prüft nach dem Build, dass nichts durchgerutscht ist.
  eleventyConfig.addTransform("site-url", function (content) {
    const out = this.page && this.page.outputPath;
    if (site.url === site.referenceUrl || typeof out !== "string" || !/\.(html|xml|txt)$/.test(out)) {
      return content;
    }
    return content.split(site.referenceUrl).join(site.url);
  });

  return {
    templateFormats: ["njk"],
    markupTemplatingEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
