module.exports = function (child) {
  function escape(s) {
    if (!s) {
      return '';
    }
    if (typeof s !== 'string') {
      s = s.toString();
    }
    return s.replace(/[\/\\^$*+?.()\[\]{}]/g, '\\$&');
  }

  if (!String.prototype.test) {
    String.prototype.test = function (reg, flag = 'gium') {
      try {
        return new RegExp(reg, flag).test(this);
      } catch (error) {
        return false;
      }
    };
  }

  if (!String.prototype.like) {
    String.prototype.like = function (name) {
      if (!name) {
        return false;
      }
      let r = false;
      name.split('|').forEach((n) => {
        n = n.split('*');
        n.forEach((w, i) => {
          n[i] = escape(w);
        });
        n = n.join('.*');
        if (this.test('^' + n + '$', 'gium')) {
          r = true;
        }
      });
      return r;
    };
  }

  if (!String.prototype.contains) {
    String.prototype.contains = function (name) {
      let r = false;
      if (!name) {
        return r;
      }
      name.split('|').forEach((n) => {
        if (n && this.test('^.*' + escape(n) + '.*$', 'gium')) {
          r = true;
        }
      });
      return r;
    };
  }

  child.mkdirSync = function (dirname) {
    try {
      if (child.fs.existsSync(dirname)) {
        return true;
      }
      if (child.mkdirSync(child.path.dirname(dirname))) {
        child.fs.mkdirSync(dirname);
        return true;
      }
    } catch (error) {
      child.log(error.message);
      return false;
    }
  };
  child.deleteFile = function (path, callback) {
    child.fs.stat(path, (err, stats) => {
      if (!err && stats.isFile()) {
        child.fs.unlink(path, (err) => {
          if (!err) {
            callback(path);
          } else {
            child.log(err);
          }
        });
      } else {
        callback(path);
      }
    });
  };
  child.writeFile = function (path, data, encode) {
    let path2 = path + '_tmp';
    child.deleteFile(path2, () => {
      child.fs.writeFile(
        path2,
        data,
        {
          encoding: encode || 'utf8',
        },
        (err) => {
          if (!err) {
            child.deleteFile(path, () => {
              child.fs.rename(path2, path, (err) => {
                if (!err) {
                  child.log(`${child.parent.windowType} writeFile ${path}`);
                } else {
                  child.log(err);
                }
              });
            });
          } else {
            child.log(err);
          }
        }
      );
    });
  };
  child.isFileExistsSync = (path) => {
    return child.fs.existsSync(path);
  };
  child.exe = function (app_path, args) {
    child.log('child.exe', app_path, args);
    child.child_process.execFile(app_path, args, function (err, stdout, stderr) {
      if (err) {
        child.log(err);
      }
    });
  };
  child.set_var = function (name, currentContent, ignore) {
    try {
      child.parent.var[name] = currentContent;
      child.save_var_quee.push(name);
    } catch (error) {
      child.log(error);
    }
  };
  child.save_var_quee = [];
  child.save_var = function (name) {
    if (child.save_var_quee.includes(name)) {
      return;
    }
    try {
      let path = child.path.join(child.parent.data_dir, 'json', name + '.json');
      let currentContent = JSON.stringify(child.parent.var[name]);
      child.writeFile(path, currentContent);
    } catch (error) {
      child.log(error);
    }
  };

  child.get_dynamic_var = function (info) {
    info.name = info.name || '*';
    if (info.name == '*') {
      return child.parent.var;
    } else {
      let arr = info.name.split(',');
      let obj = {};
      arr.forEach((k) => {
        if ((k == 'user_data' || k == 'user_data_input') && info.hostname) {
          obj[k] = [];
          child.parent.var[k].forEach((dd) => {
            dd.hostname = dd.hostname || dd.host || '';
            dd.url = dd.url || '';
            if (dd.hostname.contains(info.hostname) || info.hostname.contains(dd.hostname)) {
              obj[k].push(dd);
            }
          });
        } else {
          obj[k] = child.parent.var[k];
        }
      });
      return arr.length == 1 ? obj[info.name] : obj;
    }
  };

  child.decodeURI = (value) => {
    try {
      return decodeURI(value);
    } catch (error) {
      return value;
    }
  };

  child.decodeURIComponent = (value) => {
    try {
      return decodeURIComponent(value);
    } catch (error) {
      // child.log(error)
      return value;
    }
  };
  child.encodeURIComponent = (value) => {
    try {
      return encodeURIComponent(value);
    } catch (error) {
      // child.log(error)
      return value;
    }
  };
  child.cookieParse2 = (cookie) => {
    if (typeof cookie === 'undefined') return [];
    return cookie.split(';').reduce(function (prev, curr) {
      let m = / *([^=]+)=(.*)/.exec(curr);
      if (m) {
        let key = child.decodeURIComponent(m[1]);
        let value = child.decodeURIComponent(m[2]);
        prev[key] = typeof value === 'undefined' ? true : value;
      }
      return prev;
    }, {});
  };
  child.cookieParse = (cookie) => {
    let co = {};
    if (!cookie) {
      return co;
    }
    cookie.split(';').forEach((d) => {
      if (d) {
        d = d.split('=');
        if (d.length === 1) {
          co[child.decodeURIComponent(d[0].trim())] = true;
        } else if (d.length === 2) {
          co[child.decodeURIComponent(d[0].trim())] = child.decodeURIComponent(d[1]);
        } else {
          let key = d[0].trim();
          d.splice(0, 1);
          co[child.decodeURIComponent(key)] = child.decodeURIComponent(d.join('='));
        }
      }
    });

    return co;
  };

  child.cookieStringify = (cookie) => {
    let out = '';
    for (let co in cookie) {
      out += child.encodeURIComponent(co) + '=' + child.encodeURIComponent(cookie[co]) + ';';
    }
    return out;
  };

  child.getOverwriteInfo = function (url) {
    let info = {
      url: url,
      overwrite: false,
      new_url: url,
    };
    if ((info2 = child.overwriteList.find((item) => info.url.like(item.from)))) {
      if (info2.time && new Date().getTime() - info2.time < 3000) {
        return info;
      }
      if (info2.ignore && info.url.like(info2.ignore)) {
        return info;
      }

      info.new_url = info2.to;
      info2.rediect_from = info.url;

      child.log(`\n Auto overwrite redirect from \n   ${info.url} \n to \n   ${info.new_url} \n`);
      info2.time = new Date().getTime();
      if (info2.query) {
        let q = url.split('?')[1];
        if (q) {
          q = '?' + q;
        } else {
          q = '';
        }
        info.new_url = info2.to + q;
      }

      info.overwrite = true;
    }

    return info;
  };

  child.updateTab = function (win) {
    let setting = win.customSetting;

    if (setting.windowType !== 'view') {
      return;
    }

    setting.name = '[update-tab-properties]';
    setting.win_id = win.id;
    setting.child_id = child.id;
    setting.url = win.getURL();
    setting.title = win.webContents.getTitle();
    setting.forward = win.webContents.canGoForward();
    setting.back = win.webContents.canGoBack();
    setting.webaudio = !win.webContents.audioMuted;

    child.sendMessage({
      type: '[update-tab-properties]',
      source: 'window',
      data: setting,
    });
  };

  child.isAllowURL = function (url) {
    let allow = true;
    if (child.parent.var.blocking.core.block_ads) {
      child.parent.var.ad_list.forEach((ad) => {
        if (url.like(ad.url)) {
          allow = false;
        }
      });
    }

    return allow;
  };
};
