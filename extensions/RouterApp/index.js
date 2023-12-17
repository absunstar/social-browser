module.exports = function (browser) {
  let extension = {};
  extension.id = browser.md5(__filename);
  extension.name = 'RouterApp';
  extension.description = 'Router App Managemet';
  extension.paid = false;
  extension.version = '1.0.0';
  extension.canDelete = false;
  extension.init = () => {};
  extension.enable = () => {
    browser.addPreload({
      id: extension.id,
      path: browser.path.join(__dirname, 'preload.js'),
    });

    browser.addOverwrite({ from: 'https://192.168.1.1/res/atp-icon.png*', to: 'browser://images/background.png', any: true });
  };

  extension.disable = () => {
    browser.removePreload(extension.id);
    browser.removeOverwrite({ from: 'https://192.168.1.1/res/atp-icon.png*' });
  };

  extension.remove = () => {
    extension.disable();
  };

  return extension;
};
