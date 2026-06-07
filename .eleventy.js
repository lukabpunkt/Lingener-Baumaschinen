module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});
  eleventyConfig.addPassthroughCopy({"src/sitemap.xml": "sitemap.xml"});
  eleventyConfig.addPassthroughCopy({"src/robots.txt": "robots.txt"});

  return {
    templateFormats: ["njk"],
    markupTemplatingEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
