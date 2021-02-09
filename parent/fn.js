module.exports = function init(browser) {
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

  browser.run = function (file) {
    return browser.child_process.spawn(process.argv[0], file);
  };


  browser.exe = function (app_path, args) {
    var child = browser.child_process.execFile;
    var executablePath = app_path;
    var parameters = args;
    browser.log(executablePath + '   ' + parameters);
    child(executablePath, parameters, function (err, data) {
      if (err) {
        browser.log(err);
      }
    });
  };
  browser.guid = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  browser.to_dateX = function (d) {
    d = d || new Date();
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  };

  browser.wait = function (resolve, reject) {
    return new Promise((resolve, reject) => {});
  };

  browser.sleep = function (millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
  };

  browser.decodeURIComponent = (value) => {
    try {
      return decodeURIComponent(value);
    } catch (error) {
      // browser.log(error)
      return value;
    }
  };
  browser.encodeURIComponent = (value) => {
    try {
      return encodeURIComponent(value);
    } catch (error) {
      // browser.log(error)
      return value;
    }
  };
  browser.cookieParse = (cookie) => {
    if (typeof cookie === 'undefined') return [];
    return cookie.split(';').reduce(function (prev, curr) {
      let m = / *([^=]+)=(.*)/.exec(curr);
      if (m) {
        let key = browser.decodeURIComponent(m[1]);
        let value = browser.decodeURIComponent(m[2]);
        prev[key] = value;
      }
      return prev;
    }, {});
  };

  browser.cookieStringify = (cookie) => {
    let out = '';
    for (let co in cookie) {
      out += browser.encodeURIComponent(co) + '=' + browser.encodeURIComponent(cookie[co]) + ';';
    }
    return out;
  };

  browser.get_network = function () {
    let addresses = {};
    try {
      let ifaces = browser.os.networkInterfaces();
      let hasAddresses = false;
      Object.keys(ifaces).forEach(function (iface) {
        ifaces[iface].forEach(function (address) {
          if (!hasAddresses && !address.internal) {
            addresses[(address.family || '').toLowerCase()] = address.address;
            if (address.mac && address.mac !== '00:00:00:00:00:00') {
              addresses = address;
              hasAddresses = true;
            }
          }
        });
      });
    } catch (e) {
      browser.log(e);
    }
    return addresses;
  };
};
