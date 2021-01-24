module.exports = function (browser) {
  const fs = browser.fs;

  browser.mkdirSync = function (dirname) {
    try {
      if (fs.existsSync(dirname)) {
        return true;
      }
      if (browser.mkdirSync(browser.path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  browser.readFileSync = function (path, encode) {
    let path2 = path + '_tmp';
    if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString(encode || 'utf8');
    } else if (fs.existsSync(path2)) {
      return fs.readFileSync(path2).toString(encode || 'utf8');
    }
    return '';
  };

  browser.writeFile = function (path, data, encode) {
    let path2 = path + '_tmp';
    browser.deleteFile(path2, () => {
      fs.writeFile(
        path2,
        data,
        {
          encoding: encode || 'utf8',
        },
        () => {
          browser.deleteFile(path, () => {
            fs.rename(path2, path, () => {
              browser.deleteFile(path2, () => {
                console.log('writeFile : ', path);
              });
            });
          });
        },
      );
    });
  };

  browser.deleteFileSync = function (path) {
    try {
      if (fs.existsSync(path)) {
        return fs.unlinkSync(path);
      }
    } catch (error) {
      return null;
    }

    return null;
  };

  browser.deleteFile = function (path, callback) {
    fs.stat(path, (err, stats) => {
      if (!err && stats.isFile()) {
        fs.unlink(path, (err) => {
          callback(path);
        });
      } else {
        callback(path);
      }
    });
  };

  browser.parseJson = function (content) {
    try {
      if (content && typeof content === 'string') {
        return JSON.parse(content);
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  browser.js = function (name) {
    return browser.readFileSync(browser.files_dir + '/js/' + name + '.js');
  };
  browser.css = function (name) {
    return browser.readFileSync(browser.files_dir + '/css/' + name + '.css');
  };
  browser.html = function (name) {
    return browser.readFileSync(browser.files_dir + '/html/' + name + '.html');
  };
  browser.json = function (name) {
    return browser.readFileSync(browser.files_dir + '/json/' + name + '.json');
  };
  browser.xml = function (name) {
    return browser.readFileSync(browser.files_dir + '/xml/' + name + '.xml');
  };
};
