module.exports = function (parent) {
  const fs = parent.fs;



  parent.mkdirSync = function (dirname) {
    try {
      if (fs.existsSync(dirname)) {
        return true;
      }
      if (parent.mkdirSync(parent.path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    } catch (error) {
      parent.log(error.message);
      return false;
    }
  };
  parent.removeDirSync = function(dirname){
    parent.fs.rmSync(dirname, { recursive: true, force: true });
  }

  parent.readFileSync = function (path, encode) {
    let path2 = path + '_tmp';
    if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString(encode || 'utf8');
    } else if (fs.existsSync(path2)) {
      return fs.readFileSync(path2).toString(encode || 'utf8');
    }
    return '';
  };

  parent.writeFile = function (path, data, encode) {
    let path2 = path + '_tmp';
    parent.deleteFile(path2, () => {
      fs.writeFile(
        path2,
        data,
        {
          encoding: encode || 'utf8',
        },
        (err) => {
          if (!err) {
            parent.deleteFile(path, () => {
              fs.rename(path2, path, (err) => {
                if(!err){
                  parent.log('writeFile : ', path);
                }else{
                  parent.log(err)
                }
                
                // parent.deleteFile(path2, () => {
                //   parent.log('writeFile : ', path);
                // });
              });
            });
          }else{
            parent.log(err)
          }
        },
      );
    });
  };

  parent.deleteFileSync = function (path) {
    try {
      if (fs.existsSync(path)) {
        return fs.unlinkSync(path);
      }
    } catch (error) {
      return null;
    }

    return null;
  };

  parent.deleteFile = function (path, callback) {
    fs.stat(path, (err, stats) => {
      if (!err && stats.isFile()) {
        fs.unlink(path, (err) => {
          if (!err) {
            callback(path);
          }else{
            parent.log(err)
          }
        });
      }else{
        callback(path);
      }
    });
  };

  parent.parseJson = function (content) {
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

  parent.js = function (name) {
    return parent.readFileSync(parent.files_dir + '/js/' + name + '.js');
  };
  parent.css = function (name) {
    return parent.readFileSync(parent.files_dir + '/css/' + name + '.css');
  };
  parent.html = function (name) {
    return parent.readFileSync(parent.files_dir + '/html/' + name + '.html');
  };
  parent.json = function (name) {
    return parent.readFileSync(parent.files_dir + '/json/' + name + '.json');
  };
  parent.xml = function (name) {
    return parent.readFileSync(parent.files_dir + '/xml/' + name + '.xml');
  };
};
