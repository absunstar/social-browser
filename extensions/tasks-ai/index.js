module.exports = function (browser) {
  let extension = {};
  extension.id = '__tasksAI';
  extension.name = 'tasksAI';
  extension.description = 'https://tasks-ai.com site integration';
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
