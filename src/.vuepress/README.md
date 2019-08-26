## Some notes on config.js

* The `chainWebpack` function runs when vuepress is invoked and returns webpack plugins that can act as pre-build hooks.
  The `extraFiles` plugin adds files required by GitHub Pages,
  The `moveHomepage` is a workaround for Vuepress requiring the homepage to be the top-level README.md.
* Ensure that the file is formated using  
  `npx prettier --write --trailing-comma=all --single-quote .vuepress/config.js`
