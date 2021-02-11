module.exports = function init(browser) {
  const site = require('isite')({
    port: [60080 , 60000],
    name: 'Social Browser API',
    dir: browser.files_dir + '',
    stdin: false,
    apps: false,
    help: false,
    _0x14xo: !0,
    https: {
      enabled: true,
      port: 60043,
    },
    cache: {
      enabled: false,
    },
    mongodb: {
      enabled: false,
    },
    security: {
      enabled: false,
    },
    proto: {
      object: false,
    },
    require: {
      features: [],
      permissions: [],
    },
  });

  site.loadLocalApp('client-side');
  site.loadLocalApp('charts');

  browser.site = site;

  site.get('/empty', (req, res) => {
    res.end();
  });

  site.get('/newTab', (req, res) => {
    res.end();
  });

  site.get({
    name: '/',
    path: browser.files_dir,
  });

  site.get({
    name: '/setting',
    path: browser.files_dir + '/html/setting.html',
    parser: 'html css js',
  });
  site.get({
    name: '/block-site',
    path: browser.files_dir + '/html/block-site.html',
    parser: 'html css js',
  });

  site.get({
    name: '/iframe',
    path: browser.files_dir + '/html/mini_view.html',
    parser: 'html css js',
  });

  site.get({
    name: '/error*',
    path: browser.files_dir + '/html/error.html',
    parser: 'html css js',
  });

  site.get({
    name: '/home*',
    path: browser.files_dir + '/html/default.html',
    parser: 'html',
  });

  site.get({
    name: '/downloads*',
    path: browser.files_dir + '/html/downloads.html',
    parser: 'html',
  });

  site.run();

  return site;
};
