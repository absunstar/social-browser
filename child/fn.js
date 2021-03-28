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

  child.get_dynamic_var = function (info) {
    info.name = info.name || '*';
    if (info.name == '*') {
      return child.coreData.var;
    } else {
      let arr = info.name.split(',');
      let obj = {};
      arr.forEach((k) => {
        if ((k == 'user_data' || k == 'user_data_input') && info.hostname) {
          obj[k] = [];
          child.coreData.var[k].forEach((dd) => {
            dd.hostname = dd.hostname || dd.host || '';
            dd.url = dd.url || '';
            if (dd.hostname.contains(info.hostname) || info.hostname.contains(dd.hostname)) {
              obj[k].push(dd);
            }
          });
        } else {
          obj[k] = child.coreData.var[k];
        }
      });
      return arr.length == 1 ? obj[info.name] : obj;
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
  child.cookieParse = (cookie) => {
    if (typeof cookie === 'undefined') return [];
    return cookie.split(';').reduce(function (prev, curr) {
      let m = / *([^=]+)=(.*)/.exec(curr);
      if (m) {
        let key = child.decodeURIComponent(m[1]);
        let value = child.decodeURIComponent(m[2]);
        prev[key] = value;
      }
      return prev;
    }, {});
  };

  child.cookieStringify = (cookie) => {
    let out = '';
    for (let co in cookie) {
      out += child.encodeURIComponent(co) + '=' + child.encodeURIComponent(cookie[co]) + ';';
    }
    return out;
  };

  child.get_overwrite_info = function (url) {
    let info = {
      url: url,
      overwrite: false,
      new_url: url,
    };
    child.coreData.var.overwrite.urls.forEach((data) => {
      if (info.overwrite) {
        return;
      }
      if (info.url.like(data.from)) {
        if (data.time && new Date().getTime() - data.time < 3000) {
          return;
        }
        if (data.ignore && info.url.like(data.ignore)) {
          return;
        }

        info.new_url = data.to;
        data.rediect_from = info.url;

        child.log(`\n Auto overwrite redirect from \n   ${info.url} \n to \n   ${info.new_url} \n`);
        data.time = new Date().getTime();
        if (data.query !== false) {
          let q = url.split('?')[1];
          if (q) {
            q = '?' + q;
          } else {
            q = '';
          }
          info.new_url = data.to + q;
        }

        info.overwrite = true;
        return;
      }
    });
    return info;
  };

  child.updateTab = function (setting) {

    if (setting.windowType !== 'view') {
      return;
    }
    let win = child.getWindow();
    if (!win) {
      return;
    }
    setting.name = '[update-tab-properties]';
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
};
