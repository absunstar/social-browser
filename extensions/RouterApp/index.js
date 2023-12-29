module.exports = function (browser) {
  let extension = {};
  extension.id = '__RouterApp';
  extension.name = 'RouterApp';
  extension.description = 'Router App Managemet';
  extension.paid = false;
  extension.version = '1.0.0';
  extension.canDelete = false;
  extension.init = () => {
    console.log('Router App init');
  };
  extension.enable = () => {
    browser.addPreload({
      id: extension.id,
      path: browser.path.join(__dirname, 'preload.js'),
    });
    browser.api.onGET({ name: '/routerApp/setting', overwrite: true }, (req, res) => {
      res.render(__dirname + '/setting.html');
      browser.api.fsm.off(__dirname + '/setting.html');
    });
    browser.addOverwrite({ from: 'https://192.168.1.1/res/atp-icon.png*', to: 'browser://images/background.png', any: true });
  };

  extension.disable = () => {
    browser.api.off({ name: '/routerApp/setting' });
    browser.removePreload(extension.id);
    browser.removeOverwrite({ from: 'https://192.168.1.1/res/atp-icon.png*' });
  };

  extension.remove = () => {
    extension.disable();
  };

  return extension;
};
