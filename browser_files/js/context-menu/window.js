window.open0 = window.open;
if (!SOCIALBROWSER.isWhiteSite) {
  window.open = function (...args /*url, target, windowFeatures*/) {
    let url = args[0];
    SOCIALBROWSER.log('window.open', url);
    let target = args[1];
    let windowFeaturesString = args[2]; /*"left=100,top=100,width=320,height=320"*/
    let windowFeatures = {};
    if (windowFeaturesString) {
      windowFeaturesString = windowFeaturesString.split(',');
      windowFeaturesString.forEach((obj) => {
        obj = obj.split('=');
        windowFeatures[obj[0]] = obj[1];
      });
    }

    let child_window = {
      closed: false,
      opener: window,
      innerHeight: 1028,
      innerWidth: 720,

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

    if (!url || url.like('javascript:*|about:blank|*accounts.*|*login*') || SOCIALBROWSER.customSetting.allowCorePopup) {
      let opener = window.open0(...args);
      return opener || child_window;
    }

    url = SOCIALBROWSER.handleURL(url);
    child_window.url = url;

    let allow = false;

    if (SOCIALBROWSER.allowPopup || SOCIALBROWSER.customSetting.allowPopup) {
      allow = true;
    } else {
      if (SOCIALBROWSER.customSetting.blockPopup || !SOCIALBROWSER.customSetting.allowNewWindows) {
        SOCIALBROWSER.log('block Popup : ' + url);
        return child_window;
      }

      if (SOCIALBROWSER.customSetting.allowSelfWindow) {
        document.location.href = url;
        return child_window;
      }

      if (!SOCIALBROWSER.var.core.javaScriptOFF) {
        if (!SOCIALBROWSER.isAllowURL(url)) {
          SOCIALBROWSER.log('Not Allow URL : ' + url);
          return child_window;
        }

        allow = !SOCIALBROWSER.var.blocking.popup.black_list.some((d) => url.like(d.url));

        if (!allow) {
          SOCIALBROWSER.log('black list : ' + url);
          return child_window;
        }

        allow = false;
        let toUrlParser = new URL(url);
        let fromUrlParser = new URL(document.location.href);
        if ((toUrlParser.host.contains(fromUrlParser.host) || fromUrlParser.host.contains(toUrlParser.host)) && SOCIALBROWSER.var.blocking.popup.allow_internal) {
          allow = true;
        } else if (toUrlParser.host !== fromUrlParser.host && SOCIALBROWSER.var.blocking.popup.allow_external) {
          allow = true;
        } else {
          allow = SOCIALBROWSER.var.blocking.popup.white_list.some((d) => toUrlParser.host.like(d.url) || fromUrlParser.host.like(d.url));
        }
      }

      if (!allow) {
        SOCIALBROWSER.log('Not Allow popup window : ' + url);
        return child_window;
      }
    }

    let showPopup = false;
    let skipTaskbar = true;
    let center = false;

    if (SOCIALBROWSER.customSetting.hide) {
      showPopup = false;
      skipTaskbar = true;
    } else if (SOCIALBROWSER.customSetting.windowType === 'view') {
      showPopup = true;
      center = true;
      skipTaskbar = false;
    } else {
      showPopup = SOCIALBROWSER.customSetting.show;
    }

    let win = SOCIALBROWSER.openWindow({
      url: url,
      windowType: 'client-popup',
      show: showPopup,
      center: center,
      skipTaskbar: skipTaskbar,
      width: windowFeatures.width || SOCIALBROWSER.customSetting.width,
      height: windowFeatures.height || SOCIALBROWSER.customSetting.height,
      resizable: true,
      frame: true,
    });

    child_window.postMessage = function (...args) {
      win.postMessage(...args);
    };

    child_window.addEventListener = win.on;

    win.on('closed', (e) => {
      child_window.postMessage = () => {};
      child_window.eval = () => {};
      child_window.closed = true;
    });

    child_window.eval = win.eval;

    child_window.close = win.close;

    child_window.win = win;

    return child_window;
  };
}

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
    SOCIALBROWSER.log('Block Post Message ', ...args);
  };
}

SOCIALBROWSER.on('window.message', (e, message) => {
  message.origin = message.origin || '*';
  window.postMessage(message.data, message.origin, message.transfer);
});

if (SOCIALBROWSER.parentAssignWindow) {
  window.opener = window.opener || {
    closed: false,
    postMessage: (...args) => {
      SOCIALBROWSER.ipc('window.message', {
        windowID: SOCIALBROWSER.parentAssignWindow.parentWindowID,
        data: args[0],
        origin: args[1] || '*',
        transfer: args[2],
      });
    },
  };
}

window.print2 = function (options) {
  document.querySelectorAll('[href]').forEach((el) => {
    el.href = SOCIALBROWSER.handleURL(el.href);
  });
  document.querySelectorAll('[src]').forEach((el) => {
    el.src = SOCIALBROWSER.handleURL(el.src);
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
      windowID: SOCIALBROWSER.remote.getCurrentWindow().id,
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
SOCIALBROWSER.alert =
  window.alert =
  window.prompt =
  window.confirm =
    function (msg, time = 1000 * 3) {
      if (typeof msg !== 'string') {
        return;
      }
      msg = msg.trim();

      SOCIALBROWSER.log(msg);
      SOCIALBROWSER.injectDefault();
      let div = document.querySelector('#__alertBox');
      if (div) {
        clearTimeout(alert_idle);
        div.innerHTML = SOCIALBROWSER.policy.createHTML(msg);
        div.style.display = 'block';
        alert_idle = setTimeout(() => {
          div.style.display = 'none';
          div.innerHTML = SOCIALBROWSER.policy.createHTML('');
        }, time);
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
