module.exports = function (browser) {
  let extension = {};
  extension.id = browser.md5(__filename);
  extension.name = 'HitLeap ';
  extension.description = 'hitleap.com site integration';
  extension.paid = false;
  extension.version = '1.0.0';
  extension.canDelete = false;
  extension.init = () => {};
  extension.enable = () => {
    browser.addPreload({
      id: extension.id,
      path: browser.path.join(__dirname , 'preload.js'),
    });
  };

  extension.disable = () => {
    browser.removePreload(extension.id);
  };

  extension.remove = () => {
    extension.disable();
  };
  return extension;
};
