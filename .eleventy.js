module.exports = function(eleventyConfig) {
  // Correct: copy assets from inside src/
  eleventyConfig.addPassthroughCopy('src/assets');

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    passthroughFileCopy: true
  };
};