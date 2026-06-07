const { HtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
  eleventyConfig.addPassthroughCopy({"src/sitemap.xml": "sitemap.xml"});
  eleventyConfig.addPassthroughCopy({"src/robots.txt": "robots.txt"});

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
