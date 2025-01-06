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

  child.openExternal = function (link) {
    child.shell.openExternal(link);
  };
  child.exec = function (cmd, callback) {
    callback =
      callback ||
      function (d) {
        console.log(d);
      };
    let exec = child.child_process.exec;
    return exec(cmd, function (error, stdout, stderr) {
      if (error) {
        callback(error);
      }
      if (stdout) {
        callback(stdout);
      }
      if (stderr) {
        callback(stderr);
      }
    });
  };
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
  child.writeFile = function (path, data, encode = 'utf8') {
    let path2 = path + '_tmp';
    child.deleteFile(path2, () => {
      child.fs.writeFile(
        path2,
        data,
        {
          encoding: encode,
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
    if (!name || name.indexOf('$') !== -1) {
      return;
    }
    try {
      let path = child.path.join(child.parent.data_dir, 'json', name + '.social');
      let currentContent = child.api.hide(child.parent.var[name]);
      child.writeFile(path, currentContent);
    } catch (error) {
      child.log(error);
    }
  };

  child.get_dynamic_var = function (info) {
    info.name = info.name || '*';

    if (info.name == '*') {
      info.name = '';
      for (const key in child.parent.var) {
        info.name += key + ',';
      }
    }

    let arr = info.name.split(',');
    let obj = {};
    arr.forEach((k) => {
      if (k && child.parent.var[k]) {
        if ((k == 'user_data' || k == 'user_data_input') && info.hostname) {
          obj[k] = [];
          child.parent.var[k].forEach((dd) => {
            if (dd.hostname && (dd.hostname.contains(info.hostname) || info.hostname.contains(dd.hostname))) {
              obj[k].push(dd);
            }
          });
        } else {
          obj[k] = child.parent.var[k];
        }
      }
    });
    return arr.length == 1 ? obj[info.name] : obj;
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

  child.updateTab = function (win) {
    let setting = {};

    if (win.customSetting.windowType !== 'view') {
      return;
    }

    setting.name = '[update-tab-properties]';
    setting.url = win.getURL();
    setting.windowID = win.id;
    setting.tabID = win.customSetting.tabID;
    setting.childProcessID = child.id;
    setting.forward = win.webContents.navigationHistory.canGoForward();
    setting.back = win.webContents.navigationHistory.canGoBack();
    setting.webaudio = !win.webContents.audioMuted;
    setting.title = win.customSetting.title;
    setting.iconURL = win.customSetting.iconURL;
    setting.proxy = win.customSetting.proxy?.url || '';
    setting.userAgentURL = win.customSetting.$userAgentURL;

    child.sendMessage({
      type: '[update-tab-properties]',
      source: 'window',
      data: setting,
    });
  };

  child.isAllowURL = function (url) {
    if (child.parent.var.blocking.white_list?.some((item) => url.like(item.url))) {
      return true;
    }

    let allow = true;

    if (child.parent.var.blocking.core.block_ads) {
      allow = !child.parent.var.ad_list.some((ad) => url.like(ad.url));
    }

    if (allow && child.parent.var.blocking.core.block_ads_servers) {
      allow = !child.adHostList.includes(child.url.parse(url).hostname);
    }

    if (allow) {
      allow = !child.parent.var.blocking.black_list.some((item) => url.like(item.url));
    }

    if (allow && child.parent.var.blocking.allow_safty_mode) {
      allow = !child.parent.var.blocking.un_safe_list.some((item) => url.like(item.url));
    }

    return allow;
  };
  child.handleCustomSeting = function (url, win) {
    let windowIndex = child.windowList.findIndex((w) => w.id == win.id);

    win.customSetting.session = child.parent.var.session_list.find((s) => s.name == win.customSetting.partition);

    if (windowIndex !== -1) {
      child.windowList[windowIndex].customSetting.session = win.customSetting.session;

      if (child.windowList[windowIndex].customSetting.userAgentURL) {
        child.windowList[windowIndex].customSetting.$defaultUserAgent = child.parent.var.userAgentList.find((u) => u.url == child.windowList[windowIndex].customSetting.userAgentURL) || {
          url: child.windowList[windowIndex].customSetting.userAgentURL,
        };
        child.windowList[windowIndex].customSetting.$userAgentURL = child.windowList[windowIndex].customSetting.userAgentURL;
      } else if (child.windowList[windowIndex].customSetting.defaultUserAgent) {
        child.windowList[windowIndex].customSetting.$defaultUserAgent = child.windowList[windowIndex].customSetting.defaultUserAgent;
        child.windowList[windowIndex].customSetting.$userAgentURL = child.windowList[windowIndex].customSetting.$defaultUserAgent.url;
      } else {
        if (child.windowList[windowIndex].customSetting.session && child.windowList[windowIndex].customSetting.session.defaultUserAgent) {
          child.windowList[windowIndex].customSetting.$defaultUserAgent = child.windowList[windowIndex].customSetting.session.defaultUserAgent;
          child.windowList[windowIndex].customSetting.$userAgentURL = child.windowList[windowIndex].customSetting.$defaultUserAgent.url;
        } else {
          child.windowList[windowIndex].customSetting.$defaultUserAgent = child.parent.var.core.defaultUserAgent;
          child.windowList[windowIndex].customSetting.$userAgentURL = child.windowList[windowIndex].customSetting.$defaultUserAgent.url;
        }
      }

      win.customSetting.$defaultUserAgent = child.windowList[windowIndex].customSetting.$defaultUserAgent;
      win.customSetting.$userAgentURL = win.customSetting.$defaultUserAgent.url;

      if (url.like('*accounts.google.com*')) {
        child.windowList[windowIndex].customSetting.$userAgentURL =
          'Mozilla/5.0 (X11; U; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/124.0.6303.212 Chrome/124.0.6303.212 Safari/537.36';
        child.windowList[windowIndex].customSetting.iframe = false;
      } else if (url.like('*youtube.com/embed*')) {
        if (win.customSetting.userAgentURL) {
          child.windowList[windowIndex].customSetting.$userAgentURL = win.customSetting.userAgentURL;
        }
        child.windowList[windowIndex].customSetting.iframe = true;
      } else if (url.like('*youtube.com*')) {
        child.windowList[windowIndex].customSetting.$userAgentURL = 'Mozilla/5.0 (iPad; CPU OS 14_0  like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/602.6.13 Mobile Safari/537.36';
        child.windowList[windowIndex].customSetting.$defaultUserAgent = child.parent.var.userAgentList.find((u) => u.url == child.windowList[windowIndex].customSetting.$userAgentURL) || {
          url: child.windowList[windowIndex].customSetting.$userAgentURL,
        };
        child.windowList[windowIndex].customSetting.iframe = true;
        if (url.like('*youtube.com/watch*') && url !== win.lastYoutubeWatch) {
          win.lastYoutubeWatch = url;
          win.loadURL(url);
        }
      } else if (url.like('*60080*')) {
        child.windowList[windowIndex].customSetting.allowDevTools = false;
      } else if (url.like('*challenges.cloudflare.com*')) {
        // child.windowList[windowIndex].customSetting.$userAgentURL = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0;
        // child.windowList[windowIndex].customSetting.iframe = false;
      } else {
        // child.windowList[windowIndex].customSetting.$userAgentURL = win.customSetting.userAgentURL;
        child.windowList[windowIndex].customSetting.iframe = true;
      }

      // child.electron.app.userAgentFallback = win.customSetting.$userAgentURL;
    } else {
      console.log('handleCustomSeting Not Exists', url);
    }
  };
};
