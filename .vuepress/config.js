module.exports = {
  title: 'Documentation',
  description: 'Oasis Developer Documentation',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
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
  }
}
