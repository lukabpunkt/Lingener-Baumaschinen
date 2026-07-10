const { HtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  // ISO-Datum (YYYY-MM-DD) für <lastmod> in der Sitemap.
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().split("T")[0]);
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
  eleventyConfig.addPassthroughCopy({"src/robots.txt": "robots.txt"});
  eleventyConfig.addPassthroughCopy({"src/llms.txt": "llms.txt"});

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
