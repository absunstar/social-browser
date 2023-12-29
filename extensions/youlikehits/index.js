module.exports = function (browser) {
  let extension = {};
  extension.id = '__youlikehits';
  extension.name = 'YouLikeHits';
  extension.description = 'youlikehits.com site integration';
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
