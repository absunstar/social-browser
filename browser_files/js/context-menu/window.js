window.open = function (url, _name, _specs, _replace_in_history) {
  if (url.like('javascript:*|*.svg|*.png|*.ico|*.gif')) {
    console.log('unSupported URL : ' + url);
    return;
  }

  let child_window = {
    closed: false,
    opener: window,
    innerHeight: 1028,
    innerWidth: 720,
    addEventListener: (name, callback) => {
      // SOCIALBROWSER.log(`[ child_window addEventListener ${name}`);
      if (name == 'load') {
        if (callback) {
          callback();
        }
      }
    },
    postMessage: function (...args) {
      //  SOCIALBROWSER.log('postMessage child_window', args);
    },
    eval: function () {
      // SOCIALBROWSER.log('eval child_window');
    },
    close: function () {
      //  SOCIALBROWSER.log('close child_window');
      this.closed = true;
    },
    focus: function () {
      // SOCIALBROWSER.log('focus child_window');
    },
    blur: function () {
      //  SOCIALBROWSER.log('focus child_window');
    },
    print: function () {
      // SOCIALBROWSER.log('print child_window');
    },
    document: {
      write: function () {
        // SOCIALBROWSER.log('document write child_window');
      },
      open: function () {
        // SOCIALBROWSER.log('document write child_window');
      },
      close: function () {
        // SOCIALBROWSER.log('document write child_window');
      },
    },
    self: this,
  };

  if (typeof url !== 'string') {
    return child_window;
  }
  if (url == 'about:blank') {
    return child_window;
  }

  url = SOCIALBROWSER.handle_url(url);

  if (SOCIALBROWSER.copyPopupURL) {
    SOCIALBROWSER.copy(url);
  }
  if (SOCIALBROWSER.blockPopup || !SOCIALBROWSER.customSetting.allowNewWindows) {
    SOCIALBROWSER.log('block Popup : ' + url);
    return child_window;
  }
  if (SOCIALBROWSER.customSetting.allowSelfWindow) {
    document.location.href = url;
    return child_window;
  }

  // if (SOCIALBROWSER.windowOpenList.some((u) => u == url)) {
  //   return child_window;
  // }
  // SOCIALBROWSER.windowOpenList.push(url);

  if (url.like('https://www.youtube.com/watch*')) {
    SOCIALBROWSER.ipc('[open new popup]', {
      url: 'https://www.youtube.com/embed/' + url.split('=')[1].split('&')[0],
      partition: SOCIALBROWSER.partition,
      referrer: document.location.href,
      show: true,
    });

    return child_window;
  }

  if (!SOCIALBROWSER.var.core.javaScriptOFF) {
    if (!SOCIALBROWSER.isAllowURL(url)) {
      SOCIALBROWSER.log('Not Allow URL : ' + url);
      return child_window;
    }
    let allow = !SOCIALBROWSER.var.blocking.popup.black_list.some((d) => url.like(d.url));

    if (!allow) {
      SOCIALBROWSER.log('black list : ' + url);
      return child_window;
    }
    allow = false;
    let toUrlParser = SOCIALBROWSER.url.parse(url);
    let fromUrlParser = SOCIALBROWSER.url.parse(this.document.location.href);

    if ((toUrlParser.host.contains(fromUrlParser.host) || fromUrlParser.host.contains(toUrlParser.host)) && SOCIALBROWSER.var.blocking.popup.allow_internal) {
      allow = true;
    } else if (toUrlParser.host !== fromUrlParser.host && SOCIALBROWSER.var.blocking.popup.allow_external) {
      allow = true;
    } else {
      allow = SOCIALBROWSER.var.blocking.popup.white_list.some((d) => toUrlParser.host.like(d.url) || fromUrlParser.host.like(d.url));
    }

    if (!allow) {
      SOCIALBROWSER.log('Not Allow : ' + url);
      return child_window;
    }
  }
  _specs = _specs || {};
  if (
    (win = SOCIALBROWSER.openWindow({
      width: _specs.width,
      height: _specs.height,
      url: url,
      show: true,
      windowType: 'client-popup',
    }))
  ) {
    child_window.postMessage = function (...args) {
      SOCIALBROWSER.call('window.message', { child_id: win.id, data: args[0], origin: args[1] || '*', transfer: args[2] });
    };

    win.on('close', () => {
      win.destroy();
    });

    win.on('closed', (e) => {
      child_window.postMessage = () => {};
      child_window.eval = () => {};
      child_window.closed = true;
    });

    win.webContents.once('dom-ready', () => {
      child_window.eval = function (code, userGesture = true) {
        code = `window.eval(${code})`;
        win.webContents
          .executeJavaScript(code, userGesture)
          .then((result) => {
            SOCIALBROWSER.log(result);
          })
          .catch((err) => {
            SOCIALBROWSER.log(err);
          });
      };
    });

    child_window.close = function () {
      if (win && !win.isDestroyed()) {
        win.close();
        setTimeout(() => {
          if (win && !win.isDestroyed()) {
            win.destroy();
          }
        }, 1000);
      }
    };

    child_window.win = win;
  }
  return child_window;
};

if (SOCIALBROWSER.var.blocking.javascript.block_console_output) {
  window.SOCIALBROWSER.log = function () {};
  window.console.error = function () {};
  window.console.dir = function () {};
  window.console.dirxml = function () {};
  window.console.info = function () {};
  window.console.warn = function () {};
  window.console.table = function () {};
  window.console.trace = function () {};
  window.console.debug = function () {};
  window.console.assert = function () {};
  window.console.clear = function () {};
}
if (SOCIALBROWSER.var.blocking.javascript.block_window_worker) {
  window.Worker = function (...args) {
    return {
      onmessage: () => {},
      onerror: () => {},
      postMessage: () => {},
    };
  };

  window.SharedWorker = function (...args) {
    return {
      onmessage: () => {},
      onerror: () => {},
      postMessage: () => {},
    };
  };
}

if (SOCIALBROWSER.var.blocking.javascript.block_window_post_message) {
  window.postMessage = function (...args) {
    if (SOCIALBROWSER.var.blocking.javascript.block_window_post_message) {
      SOCIALBROWSER.log('Block Post Message ', ...args);
    }
  };
}

SOCIALBROWSER.on('window.message', (e, obj) => {
  window.postMessage(obj.data, obj.origin, obj.transfer);
});

window.addEventListener('message', (e) => {
  if (typeof e.data == 'string' && e.data.startsWith('{')) {
    let info = JSON.parse(e.data);
    if (info.name === 'SOCIALBROWSER') {
      if (info.key === 'eval' && info.value) {
        SOCIALBROWSER.eval(info.value);
      } else {
        SOCIALBROWSER[info.key] = info.value;
      }
    }
  }
});

if (SOCIALBROWSER.windows) {
  window.opener = {
    postMessage: (...args) => {
      SOCIALBROWSER.call('window.message', {
        parent_id: SOCIALBROWSER.windows.parent_id,
        data: args[0],
        origin: args[1] || '*',
        transfer: args[2],
      });
    },
  };
}

window.print2 = function (options) {
  document.querySelectorAll('[href]').forEach((el) => {
    el.href = SOCIALBROWSER.handle_url(el.href);
  });
  document.querySelectorAll('[src]').forEach((el) => {
    el.src = SOCIALBROWSER.handle_url(el.src);
  });

  fetch('http://127.0.0.1:60080/printing', {
    mode: 'cors',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...options,
      name: 'print',
      win_id: SOCIALBROWSER.currentWindow.id,
      type: 'html',
      html: document.querySelector('html').outerHTML,
      origin: document.location.origin,
      url: document.location.href,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      SOCIALBROWSER.log(data);
    })
    .catch((err) => {
      SOCIALBROWSER.log(err);
    });
};

let alert_idle = null;
SOCIALBROWSER.alert = window.alert =
  window.prompt =
  window.confirm =
    function (msg, time) {
      if (msg && msg.trim()) {
        SOCIALBROWSER.log(msg);
        SOCIALBROWSER.injectDefault();
        let div = document.querySelector('#__alertBox');
        if (div) {
          clearTimeout(alert_idle);
          div.innerHTML = msg;
          div.style.display = 'block';
          alert_idle = setTimeout(() => {
            div.style.display = 'none';
            div.innerHTML = '';
          }, time || 1000 * 3);
        }
      }
      return true;
    };

/* Handle xhr then handel fetch */
window.XMLHttpRequest0 = window.XMLHttpRequest;
window.XMLHttpRequest2 = function () {
  let fake = {
    xhr: new XMLHttpRequest0(),
  };

  fake.reMap = function () {
    fake.readyState = fake.xhr.readyState;
    fake.status = fake.xhr.status;
    fake.statusText = fake.xhr.statusText;
    fake.responseXML = fake.xhr.responseXML;
    fake.responseText = fake.xhr.responseText;
  };
  fake.reMap();

  fake.xhr.onreadystatechange = function (...args) {
    fake.reMap();
    if (fake.onreadystatechange) {
      fake.onreadystatechange(...args);
    }
  };

  fake.xhr.onload = function (...args) {
    fake.reMap();
    if (fake.onload) {
      fake.onload(...args);
    }
  };

  fake.open = function (...args) {
    fake.xhr.open(...args);
    fake.reMap();
  };
  fake.send = function (...args) {
    //  fake.setRequestHeader('x-server', 'social-browser2');
    fake.xhr.send(...args);
    fake.reMap();
  };
  fake.setRequestHeader = function (...args) {
    // console.log(...args);
    fake.xhr.setRequestHeader(...args);
    fake.reMap();
  };

  fake.abort = function (...args) {
    fake.xhr.abort(...args);
    fake.reMap();
  };
  fake.getAllResponseHeaders = function (...args) {
    return fake.xhr.getAllResponseHeaders(...args);
  };
  fake.getResponseHeader = function (...args) {
    return fake.xhr.getResponseHeader(...args);
  };
  return fake;
};

SOCIALBROWSER.cookiesRaw = '';
SOCIALBROWSER.clearCookies = function () {
  SOCIALBROWSER.ipcSync('[cookies-clear]', { domain: document.location.hostname, partition: SOCIALBROWSER.partition });
  SOCIALBROWSER.cookiesRaw = SOCIALBROWSER.getCookieRaw();
  return true;
};
SOCIALBROWSER.clearAllCookies = function () {
  let domain = document.location.hostname.split('.');
  let p2 = domain.pop();
  let p1 = domain.pop();
  SOCIALBROWSER.ipcSync('[cookies-clear]', { domain: p1 + '.' + p2, partition: SOCIALBROWSER.partition });
  SOCIALBROWSER.cookiesRaw = SOCIALBROWSER.getCookieRaw();
  return true;
};
SOCIALBROWSER.getAllCookies = function () {
  let domain = document.location.hostname.split('.');
  let p2 = domain.pop();
  let p1 = domain.pop();
  return SOCIALBROWSER.ipcSync('[cookie-get-all]', { domain: p1 + '.' + p2, partition: SOCIALBROWSER.partition });
};
SOCIALBROWSER.getCookieRaw = function () {
  return SOCIALBROWSER.ipcSync('[cookie-get-raw]', {
    name: '*',
    domain: document.location.hostname,
    partition: SOCIALBROWSER.partition,
    url: document.location.origin,
    path: document.location.pathname,
    protocol: document.location.protocol,
  });
};
SOCIALBROWSER.setCookieRaw = function (newValue) {
  SOCIALBROWSER.ipcSync('[cookie-set-raw]', {
    cookie: newValue,
    partition: SOCIALBROWSER.partition,
    url: document.location.origin,
    domain: document.location.hostname,
    path: document.location.pathname,
    protocol: document.location.protocol,
  });
  SOCIALBROWSER.cookiesRaw = SOCIALBROWSER.getCookieRaw();
};
if (false) {
  Object.defineProperty(document, 'cookie', {
    get() {
      if (!SOCIALBROWSER.cookiesRaw) {
        SOCIALBROWSER.cookiesRaw = SOCIALBROWSER.getCookieRaw();
      }
      return encodeURIComponent(SOCIALBROWSER.cookiesRaw);
    },
    set(newValue) {
      SOCIALBROWSER.setCookieRaw(newValue);
      SOCIALBROWSER.cookiesRaw = SOCIALBROWSER.getCookieRaw();
    },
  });
}
