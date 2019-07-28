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
})

module.exports = {
  title: 'Documentation',
  description: 'Oasis Developer Documentation',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  dest: 'docs',
  serviceWorker: true,
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: 'https://oasislabs.com' },
      { text: 'Dashboard', link: 'https://dashboard.oasiscloud.io' },
    ],
    sidebar: [
      '/overview',
      '/quickstart',
      {
        title: 'Tutorials',
        children: [
          ['/tutorials/ballot', 'Beginner: Secret Ballot'],
          ['/tutorials/messaging', 'Intermediate: Private Chat'],
        ]
      },
    ],

    repo: 'oasislabs',
    docsRepo: 'oasislabs/docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help us improve this page!'
  },
  chainWebpack(config, isServer) {
    config
      .plugin('cname')
      .use(function() {
        return function() {
          fs.writeFile('docs/CNAME', 'docs.oasis.dev\n', function(){});
        }
      })
  }
}
