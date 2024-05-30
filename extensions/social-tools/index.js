module.exports = function (browser) {
  let extension = {};
  extension.id = '__social_tools';
  extension.name = 'Free Social Tools';
  extension.description = 'Add Many Tools to Social Sites';
  extension.paid = false;
  extension.version = '1.0.0';
  extension.canDelete = false;
  extension.init = () => {
    console.log('Free Social Tools init');
  };
  extension.enable = () => {
    browser.addPreload({
      id: extension.id,
      path: browser.path.join(__dirname, 'preload.js'),
    });
    browser.api.onGET({ name: '/__social_tools/auto-login', overwrite: true }, (req, res) => {
      res.render(__dirname + '/auto-login.html', {}, { parser: 'html js css', parserDir: __dirname });
      browser.api.fsm.off(__dirname + '/auto-login.html');
      browser.api.fsm.off(__dirname + '/facebook-login.js');
    });
    browser.api.onPOST({ name: '/__social_tools/api/import-login-list', overwrite: true }, (req, res) => {
      let response = {
        done: true,
        file: req.form.files.fileToUpload,
        list: [],
      };

      if (browser.api.isFileExistsSync(response.file.filepath)) {
        if (response.file.originalFilename.like('*.xls*')) {
          let workbook = browser.api.XLSX.readFile(response.file.filepath);
          response.list = browser.api.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        } else if (response.file.originalFilename.like('*.social*')) {
          let socialFile = browser.api.readFileSync(response.file.filepath).toString();
          socialFile = JSON.parse(browser.api.from123(socialFile));
          response.socialFile = socialFile;
          if (socialFile.fileType == 'loginList') {
            socialFile.list.forEach((login) => {
              response.list.push(login);
            });
          }
        } else if (response.file.originalFilename.like('*.json*')) {
          response.list = browser.api.fromJson(browser.api.readFileSync(response.file.filepath).toString());
        } else {
          let list = browser.api.readFileSync(response.file.filepath).toString();
          list = list.split('\r\n');
          list.forEach((data, i) => {
            list[i] = list[i].trim();
            if (list[i] && list[i].length > 0) {
              let user = list[i].split(':');
              if (user.length == 1) {
                response.list.push({
                  username: user[0],
                });
              } else if (user.length == 2) {
                response.list.push({
                  username: user[0],
                  password: user[1],
                });
              } else if (user.length == 3) {
                response.list.push({
                  username: user[0],
                  password: user[1],
                  url: user[2],
                });
              }
            }
          });
        }
        res.json(response);
      }
    });
    browser.api.onPOST({ name: '/__social_tools/api/export-login-list', overwrite: true }, (req, res) => {
      browser.$LoginList = JSON.parse(req.data.json);
      res.json({ done: true });
    });
    browser.api.onGET({ name: '/__social_tools/api/export-login-list', overwrite: true }, (req, res) => {
      let socialFile = browser.api.to123({ fileType: 'loginList', list: browser.$LoginList });
      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': socialFile.length,
        'Content-Disposition': 'attachment; filename=' + 'login-list-' + new Date().getTime() + '.social',
      });
      res.end(socialFile);
    });
    browser.api.onGET({ name: '/__social_tools/setting', overwrite: true }, (req, res) => {
      res.render(__dirname + '/setting.html');
      browser.api.fsm.off(__dirname + '/setting.html');
    });
  };

  extension.disable = () => {
    browser.api.off({ name: '/__social_tools/auto-login' });
    browser.api.off({ name: '/__social_tools/setting' });
    browser.removePreload(extension.id);
  };

  extension.remove = () => {
    extension.disable();
  };

  return extension;
};
