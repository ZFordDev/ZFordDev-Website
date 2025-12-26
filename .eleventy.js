const MarkdownIt = require("markdown-it");
const mila = require("markdown-it-link-attributes");
const anchor = require("markdown-it-anchor");
const footnote = require("markdown-it-footnote");
const taskLists = require("markdown-it-task-lists");
const mark = require("markdown-it-mark");
const sub = require("markdown-it-sub");
const sup = require("markdown-it-sup");
const container = require("markdown-it-container");
const hljs = require("highlight.js");

module.exports = function(eleventyConfig) {

  const mdLib = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
        } catch (_) {}
      }
      return `<pre class="hljs"><code>${mdLib.utils.escapeHtml(str)}</code></pre>`;
    }
  })
  .use(footnote)
  .use(taskLists, { enabled: true })
  .use(mark)
  .use(sub)
  .use(sup)
  .use(anchor, { level: [1, 2, 3, 4] })
  .use(mila, {
    attrs: {
      target: "_blank",
      rel: "noopener"
    }
  });

  ["note", "warning", "tip"].forEach(type => {
    mdLib.use(container, type, {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return `<div class="md-${type}">\n`;
        } else {
          return `</div>\n`;
        }
      }
    });
  });


  eleventyConfig.setLibrary("md", mdLib);


  eleventyConfig.addPassthroughCopy("src/assets");
  
  eleventyConfig.addFilter("markdown", (content) => {
    return mdLib.render(content);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};