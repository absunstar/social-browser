module.exports = function (browser) {
  let extension = {};
  extension.id = '__rankboostup';
  extension.name = 'RankBoosUp';
  extension.description = 'rankboostup.com site integration';
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
      id: 'rankboostup_1',
      url: '*rankboostup*',
      list: [
        {
          name: 'RankboostupPlugin',
          value: 'v1.20',
        },
      ],
    });
  };

  extension.disable = () => {
    browser.removePreload(extension.id);
    browser.removeHeader('rankboostup_1');
  };

  extension.remove = () => {
    extension.disable();
  };
  return extension;
};
