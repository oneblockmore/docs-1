const fs = require('fs');
const promisify = require('util').promisify;

fs.stat('.git/hooks/pre-push', function(err, stats) {
  if (stats) return;
  fs.copyFile('.vuepress/pre-push', '.git/hooks/pre-push', function(err) {
    if (err) {
      console.error('Could not install docs build hook:', err);
      process.exit(1);
    }
  });
});

module.exports = {
  title: 'Oasis Dev Docs',
  description: 'Oasis Developer Documentation',
  head: [
    ['link', {rel: 'icon', href: '/favicon.ico'}],
    [
      'script',
      {
        async: 'async',
        src: 'https://www.googletagmanager.com/gtag/js?id=UA-116576458-1',
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'UA-116576458-2');`,
    ],
  ],
  dest: 'docs',
  serviceWorker: true,
  themeConfig: {
    logo: '/logo.png',
    nav: [
      {text: 'Home', link: 'https://oasislabs.com'},
      {text: 'Dashboard', link: 'https://dashboard.oasiscloud.io'},
    ],
    sidebar: [
      '/overview',
      '/quickstart',
      {
        title: 'Tutorials',
        collapsable: false,
        children: [
          ['/tutorials/ballot', 'Beginner: Secret Ballot'],
          ['/tutorials/messaging', 'Intermediate: Private Chat'],
        ],
      },
    ],
    displayAllHeaders: true,
    repo: 'oasislabs',
    docsRepo: 'oasislabs/docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
  },
  chainWebpack(config, isServer) {
    config.plugin('cname').use(function() {
      return function() {
        fs.writeFile('docs/CNAME', 'docs.oasis.dev\n', function() {});
      };
    });
  },
};
