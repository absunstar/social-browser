module.exports = function (browser) {
  let extension = {};
  extension.id = browser.md5(__filename);
  extension.name = 'Alexa ';
  extension.description = 'Alexa Toolbar act in social tools menu';
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
      id: 'alexa_1',
      url: '*',
      list: [
        {
          name: 'AlexaToolbar-ALX_NS_PH',
          value: 'AlexaToolbar/alx-4.0.5',
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
