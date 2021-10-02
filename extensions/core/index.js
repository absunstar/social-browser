module.exports = function (browser) {
  let extension = {};
  extension.id = browser.md5(__filename);
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
      ignore: ['Sec-Fetch-User'],
    });

    browser.addRequestHeader({
      id: 'core',
      url: '*youtu.be*|*www.youtube.com*',
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
      ignore: ['Sec-Fetch-User', 'Sec-Fetch-Dest', 'Sec-Fetch-Site', 'Sec-Fetch-Mode'],
    });
    browser.addResponseHeader({
      id: 'core',
      url: '*youtu.be*|*www.youtube.com*',
      list: [
        {
          name: 'x-server',
          value: ['https://www.youtube.com/'],
        },
      ],
      ignore: ['x-browser'],
    });
  };

  extension.disable = () => {
    parent.removePreload(extension.id);
    browser.removeHeader('core');
  };

  extension.remove = () => {
    extension.disable();
  };
  return extension;
};
