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
    [
      'script',
      {},
      `var APP_ID = "scny7003";

       window.intercomSettings = {
         app_id: APP_ID
       };

       function intercom(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + APP_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}};
       intercom();
      `
    ],
  ],
  serviceWorker: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: 'https://oasislabs.com' },
      { text: 'Dashboard', link: 'https://dashboard.oasiscloud.io' },
      { text: 'Forum', link: 'https://join.slack.com/t/oasiscommunity/shared_invite/enQtNjQ5MTA3NTgyOTkzLWIxNTg1ZWZmOTIwNmQ2MTg1YmU0MzgyMzk3OWM2ZWQ4NTQ0ZDJkNTBmMTdlM2JhODllYjg5YmJkODc2NzgwNTg' },
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
