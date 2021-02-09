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
        if ((k == 'user_data' || k == 'user_data_input') && info.host) {
          obj[k] = [];
          child.coreData.var[k].forEach((dd) => {
            dd.host = dd.host || '';
            dd.url = dd.url || '';
            if (dd.host == info.host) {
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

  child.updateTab = function (setting) {
    if (setting.windowType !== 'view window') {
      return;
    }
    setting.name = '[update-tab-properties]';
    setting.child_id = child.id;
    setting.url = child.getWindow().getURL();
    setting.title = child.getWindow().webContents.getTitle();
    setting.forward = child.getWindow().webContents.canGoForward();
    setting.back = child.getWindow().webContents.canGoBack();
    setting.webaudio = !child.getWindow().webContents.audioMuted;

    child.sendMessage({
      type: '[update-tab-properties]',
      source: 'window',
      data: setting,
    });
  };
};
