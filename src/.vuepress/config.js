const fs = require('fs');

module.exports = {
  title: 'Oasis Dev Docs',
  description: 'Oasis Developer Documentation',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
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
       gtag('config', 'UA-116576458-1');`,
    ],
  ],
  serviceWorker: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: 'https://oasislabs.com' },
      { text: 'Dashboard', link: 'https://dashboard.oasiscloud.io' },
    ],
    sidebar: [
      '/overview',
      '/quickstart',
      {
        title: 'Tutorials',
        collapsable: true,
        children: [
          ['/tutorials/ballot', 'Beginner: Secret Ballot'],
          ['/tutorials/messaging', 'Intermediate: Private Chat'],
        ],
      },
      {
        title: 'Operator Docs',
        collapsable: true,
        children: [
          ['/operators/overview', 'Node Operator Overview'],
          ['/operators/architectural-overview', 'Architectural Overview'],
          ['/operators/hardware-requirements', 'Hardware Requirements'],
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
    config.plugin('extraFiles').use(function() {
      return function() {
        fs.writeFile('.vuepress/dist/CNAME', 'docs.oasis.dev\n', function() {});
        fs.writeFile('.vuepress/dist/.nojekyll', '', function() {}); // thx github
      };
    });
  },
};
