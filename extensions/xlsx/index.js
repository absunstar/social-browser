module.exports = function (browser) {
  let extension = {};
  extension.id = browser.md5(__filename);
  extension.name = 'Excel Reader';
  extension.description = 'Read & Write Excel';
  extension.paid = false;
  extension.version = '1.0.0';
  extension.canDelete = false;
  extension.init = () => {};
  extension.enable = () => {
    browser.var.preload_list.push({
      id: extension.id,
      path: browser.path.join(__dirname, 'preload.js'),
    });
    browser.applay('preload_list');

    browser.api.onGET({
      name: '/xlsx',
      path: browser.path.join(__dirname, 'index.html'),
      parser: 'html css js',
    });
    browser.api.onGET('/api/xlsx/read', (req, res) => {
      browser.dialog
        .showOpenDialog({
          properties: ['openFile'],
        })
        .then((result) => {
          if (result.canceled === false && result.filePaths.length > 0) {
            let path = result.filePaths[0];
            var workbook = browser.xlsx.readFile(path);
            res.json({
              done: true,
              workbook: workbook,
            });
          }
        })
        .catch((err) => {
          res.json({
            done: true,
            error: err,
          });
        });
    });

    browser.createChildProcess({
      windowType: 'popup',
      url: 'http://127.0.0.1:60080/xlsx',
    });
  };

  extension.disable = () => {
    browser.var.preload_list.forEach((p, i) => {
      if (p.id == extension.id) {
        browser.var.preload_list.splice(i, 1);
      }
    });
    browser.applay('preload_list');
  };

  extension.remove = () => {
    extension.disable();
  };
  return extension;
};
