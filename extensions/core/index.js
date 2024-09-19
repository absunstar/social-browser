module.exports = function (browser) {
  let extension = {};
  extension.id = '__core';
  extension.name = 'Core ';
  extension.description = 'Social Browser Core';
  extension.paid = false;
  extension.version = '1.0.0';
  extension.canDelete = false;
  extension.init = () => {};
  extension.enable = () => {
    browser.addPreload({
      id: extension.id,
      path: browser.path.join(__dirname, 'preload.js'),
    });

    browser.addRequestHeader({
      id: 'core',
      url: '*embed*',
      list: [
        {
          name: 'Referer',
          value: '{{url}}',
        },
        {
          name: 'sec-fetch-dest',
          value: `iframe`,
        },
        {
          name: 'sec-fetch-site',
          value: `cross-site`,
        },
      ],
      ignore: ['Sec-Fetch-User', 'Sec-Fetch-Dest', 'Sec-Fetch-Site', 'Sec-Fetch-Mode', 'X-Frame-Options'],
    });

    browser.addResponseHeader({
      id: 'core',
      url: '*embed*',
      list: [
        {
          name: 'x-server',
          value: ['https://social-browser.com/'],
        },
      ],
      ignore: ['X-Frame-Options'],
    });

    browser.addRequestHeader({
      id: 'core',
      url: '*www.youtube.com/embed*',
      log: false,
      list: [
        {
          name: 'Host',
          value: 'https://www.youtube.com/',
        },
        {
          name: 'Referer',
          value: 'https://www.youtube.com/',
        },
      ],
      ignore: ['Service-Worker-Navigation-Preload'],
    });
    browser.addResponseHeader({
      id: 'core',
      url: '*www.youtube.com/embed*',
      list: [
        {
          name: 'x-server',
          value: ['https://www.youtube.com/'],
        },
      ],
      ignore: ['x-browser', 'X-Frame-Options', 'Cross-Origin-Resource-Policy'],
    });

    browser.addRequestHeader({
      id: 'core',
      url: '*accounts.google.com*',
      list: [
        {
          name: 'User-Agent',
          value: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.30 (KHTML, like Gecko) Ubuntu/11.04 Chromium/12.0.742.112 Chrome/12.0.742.112 Safari/534.30',
        },
      ],
      ignore: [],
    });
  };

  extension.disable = () => {
    browser.removePreload(extension.id);
    browser.removeHeader('core');
  };

  extension.remove = () => {
    extension.disable();
  };
  return extension;
};
