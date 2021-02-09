module.exports = function (SOCIALBROWSER) {
  SOCIALBROWSER.sendMessage = function (cm) {
    SOCIALBROWSER.call('renderMessage', cm);
  };

  SOCIALBROWSER.__define = function (o, p, v, op) {
    op = op || {};
    if (typeof o == 'undefined') {
      return;
    }
    Object.defineProperty(o, p, {
      get: function () {
        return v;
      },
      enumerable: op.enumerable || false,
    });
    if (o.prototype) {
      o.prototype[p] = v;
    }
  };

  SOCIALBROWSER.copy = function (text) {
    SOCIALBROWSER.call('[send-render-message]', {
      name: 'copy',
      text: text,
    });
  };

  // window.location0 = window.location.ancestorOrigins;
  // window.location = {
  //   ancestorOrigins : window.location.ancestorOrigins,
  //   host : window.location.host,
  //   hostname : window.location.hostname,
  //   origin : window.location.origin,
  //   pathname : window.location.pathname,
  //   port : window.location.port,
  //   protocol : window.location.protocol,
  //   search : window.location.search,
  //   href : window.location.href
  // }

  // Object.defineProperty(window.location, 'href', {
  //   configurable: true,
  //   get() {
  //     return 'mmmmmmmmmmmmmmmmmmm';
  //   },
  //   set(newValue) {
  //     SOCIALBROWSER.log(' [href] ', newValue);
  //   },
  // });

  SOCIALBROWSER.isValidURL = function (str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(str);
  };

  SOCIALBROWSER.handle_url = function (u) {
    if (typeof u !== 'string') {
      return u;
    }
    u = u.trim();
    if (u.like('http*') || u.indexOf('//') === 0) {
      u = u;
    } else if (u.indexOf('/') === 0) {
      u = window.location.origin + u;
    } else if (u.split('?')[0].split('.').length < 3) {
      let page = window.location.pathname.split('/').pop();
      u = window.location.origin + window.location.pathname.replace(page, '') + u;
    }
    return u;
  };

  SOCIALBROWSER.__numberRange = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  SOCIALBROWSER.eval = window.eval;
  if (SOCIALBROWSER.var.blocking.javascript.block_eval) {
    window.eval = function (code) {
       SOCIALBROWSER.log(code);
    };
  }

  window.console.clear = function () {};

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

  SOCIALBROWSER.upTo = function (el, tagName) {
    tagName = tagName.toLowerCase().split(',');

    while (el && el.parentNode) {
      el = el.parentNode;
      if (el.tagName && tagName.includes(el.tagName.toLowerCase())) {
        return el;
      }
    }
    return null;
  };

  SOCIALBROWSER.getAllCssSelectors = function () {
    var ret = [];
    const styleSheets = Array.from(document.styleSheets).filter((styleSheet) => !styleSheet.href || styleSheet.href.startsWith(window.location.origin));
    for (let style of styleSheets) {
      if (style instanceof CSSStyleSheet && style.cssRules) {
        for (var x in style.cssRules) {
          if (typeof style.cssRules[x].selectorText == 'string') {
            ret.push(style.cssRules[x].selectorText);
          }
        }
      }
    }
    return ret;
  };

  SOCIALBROWSER.isCssSelectorExists = function (selector) {
    var selectors = SOCIALBROWSER.getAllCssSelectors();
    for (var i = 0; i < selectors.length; i++) {
      if (selectors[i] == selector) return true;
    }
    return false;
  };

  let translate_busy = false;
  SOCIALBROWSER.translate = function (text, callback) {
    callback =
      callback ||
      function (trans) {
        SOCIALBROWSER.log(trans);
      };
    if (text.test(/^[a-zA-Z\-\u0590-\u05FF\0-9^@_:?;!\[\]~<>{}|\\]+$/)) {
      callback(text);
      return;
    }
    if (!text) {
      callback(text);
      return;
    }
    if (translate_busy) {
      setTimeout(() => {
        SOCIALBROWSER.translate(text, callback);
      }, 250);
      return;
    }
    translate_busy = true;

    SOCIALBROWSER.on('[translate][data]', (e, data) => {
      translate_busy = false;
      translated_text = '';
      if (data && data.sentences && data.sentences.length > 0) {
        data.sentences.forEach((t) => {
          translated_text += t.trans;
        });
        callback(translated_text || text);
      }
    });

    SOCIALBROWSER.call('[translate]', { text: text });
  };

  EventTarget.prototype.addEventListener0 = EventTarget.prototype.addEventListener;
  EventTarget.prototype.removeEvent = function (type) {
    delete this.listeners[type];
  };
  EventTarget.prototype.addEventListener = function (...args) {
    let selector = '';

    if (this instanceof Document) {
      selector += 'document';
    } else if (this instanceof Window) {
      selector += 'window';
    } else if (this instanceof Element) {
      selector += this.tagName;
    }

    let type = args[0];
    if (typeof type == 'string') {
      selector += `${this.id ? '#' + this.id : ''}${this.className ? '.' + this.className : ''}(${type})`;
      if (typeof type == 'string' && selector.like(SOCIALBROWSER.eventOff) && !selector.like(SOCIALBROWSER.eventOn)) {
        SOCIALBROWSER.log(`${selector} OFF`);
        SOCIALBROWSER.events.push({
          enabled: false,
          selector: selector,
          args: args,
          fn: args.length > 1 ? (args[1] || '').toString() : '',
        });
        return;
      }
    }
    SOCIALBROWSER.events.push({
      enabled: true,
      selector: selector,
      args: args,
      fn: args.length > 1 ? (args[1] || '').toString() : '',
    });
    this.addEventListener0(...args);
  };

  // window.setInterval0 = window.setInterval;
  // window.setInterval = function (...args) {
  //   return window.setInterval0(...args);
  // };
  // window.setTimeout0 = window.setTimeout;
  // window.setTimeout = function (...args) {
  //   return window.setTimeout0(...args);
  // };

  window.addEventListener('message', (event) => {
    // SOCIALBROWSER.log('New PostMessage Recived' , event)
  });


  SOCIALBROWSER.Worker = window.Worker;
  window.Worker = function (...args) {
    if (SOCIALBROWSER.var.blocking.javascript.block_window_worker) {
      SOCIALBROWSER.log('Worker Blocked' , ...args)
      return {
        onmessage : ()=>{},
        onerror : ()=>{},
        postMessage : ()=>{}
      }
    }
    return new SOCIALBROWSER.Worker(...args);
  };
  SOCIALBROWSER.SharedWorker = window.SharedWorker;
    window.SharedWorker = function (...args) {
    if (SOCIALBROWSER.var.blocking.javascript.block_window_worker) {
      SOCIALBROWSER.log('SharedWorker Blocked' , ...args)
      return {
        onmessage : ()=>{},
        onerror : ()=>{},
        postMessage : ()=>{}
      }
    }
    return new SOCIALBROWSER.SharedWorker(...args);
  };

  window.postMessage0 = window.postMessage;
  window.postMessage = function (...args) {
    if (SOCIALBROWSER.var.blocking.javascript.block_window_post_message) {
      SOCIALBROWSER.log('Block Post Message ', ...args);
      return
    }
    args[1] = '*';
    window.postMessage0(...args);
  };

  SOCIALBROWSER.on('postMessage', (e, info) => {
    if (SOCIALBROWSER.currentWindow.id == info.win_id) {
      window.postMessage(...info.args);
    }
  });

  if (SOCIALBROWSER.windows) {
    window.opener = {
      postMessage: (...args) => {
        // SOCIALBROWSER.log('postMessage from opener', ...args);
        SOCIALBROWSER.call('postMessage', {
          win_id: SOCIALBROWSER.windows.parent,
          args: args,
        });
      },
    };
  }

  window.print0 = window.print;
  window.print = function (options) {
    // SOCIALBROWSER.call('[send-render-message]', {
    //   name: 'get_pdf',
    //   options: options || {},
    //   win_id: SOCIALBROWSER.currentWindow.id,
    // });

    // return;

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
        name: 'print',
        win_id: SOCIALBROWSER.currentWindow.id,
        type: 'html',
        html: document.querySelector('html').outerHTML,
        options: options,
        origin: document.location.origin,
        url: document.location.href,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //  SOCIALBROWSER.log(data);
      })
      .catch((err) => {
        //  SOCIALBROWSER.log(err);
      });
  };
  window.get_printers = function () {
    return SOCIALBROWSER.currentWindow.webContents.getPrinters();
  };

  window.__md5 = function (txt) {
    return SOCIALBROWSER.md5(txt);
  };

  window.__img_to_base64 = function (selector) {
    let c = document.createElement('canvas');
    let img = null;
    if (typeof selector == 'string') {
      img = document.querySelector(selector);
    } else {
      img = selector;
    }

    if (!img) {
      return '';
    }
    c.height = img.naturalHeight;
    c.width = img.naturalWidth;
    let ctx = c.getContext('2d');

    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL();
  };

  window.__img_code = function (selector) {
    return window.__md5(window.__img_to_base64(selector));
  };

  SOCIALBROWSER.injectDefault = function () {
    if (document.body && !document.querySelector('#xxx__browser')) {
      let xxx__browser = document.createElement('div');
      xxx__browser.id = 'xxx__browser';
      xxx__browser.innerHTML = Buffer.from(SOCIALBROWSER.injectHTML).toString();
      document.body.appendChild(xxx__browser);
    }
  };

  let alert_idle = null;
  window.alert = window.prompt = function (msg, time) {
    if (msg && msg.trim()) {
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
  };

  window.__showBookmarks = function () {
    SOCIALBROWSER.injectDefault();
    let div = document.querySelector('#__bookmarkDiv');
    if (div) {
      SOCIALBROWSER.var.bookmarks.forEach((b) => {
        b.image = b.image || SOCIALBROWSER.nativeImage(b.image);
        div.innerHTML += `
                    <a class="bookmark" href="${b.url}" target="_blank">
                        <p class="title"> ${b.title} </p>
                    </a>
                    `;
      });
      div.style.display = 'block';
    }
  };

  window.__showWarningImage = function () {
    SOCIALBROWSER.injectDefault();
    let div = document.querySelector('#__warning_img');
    if (div) {
      div.style.display = 'block';
    }
  };
  window.__showBotImage = function () {
    SOCIALBROWSER.injectDefault();
    let div = document.querySelector('#__bot_img');
    if (div) {
      div.style.display = 'block';
    }
  };
  window.__blockPage = window.prompt = function (block, msg, close) {
    SOCIALBROWSER.injectDefault();
    let div = document.querySelector('#__blockDiv');
    if (div && block) {
      div.style.display = 'block';
      div.innerHTML = msg || 'This Page Blocked';
      if (close) {
        setTimeout(() => {
          window.close();
        }, 1000 * 3);
      }
    } else if (div && !block) {
      div.style.display = 'none';
    }
  };

  var showinfoTimeout = null;
  window.showInfo = function (msg, time) {
    clearTimeout(showinfoTimeout);
    SOCIALBROWSER.injectDefault();
    let div = document.querySelector('#__targetUrl');
    if (msg && msg.trim()) {
      let length = window.innerWidth / 8;
      if (msg.length > length) {
        msg = msg.substring(0, length) + '... ';
      }

      if (div) {
        div.style.display = 'block';
        div.innerHTML = msg;
        showinfoTimeout = setTimeout(() => {
          div.innerHTML = '';
          div.style.display = 'none';
        }, time | (1000 * 3));
      }
    } else {
      if (div) {
        div.style.display = 'none';
      }
    }
  };

  let __downloads = document.querySelector('#__downloads');
  window.showDownloads = function (msg, css) {
    SOCIALBROWSER.injectDefault();
    if (!__downloads) {
      __downloads = document.querySelector('#__downloads');
      __downloads.addEventListener('click', () => {
        __downloads.style.display = 'none';
        __downloads.innerHTML = '';
      });
    }
    if (msg) {
      __downloads.style.display = 'block';
      __downloads.innerHTML = msg;
    } else {
      __downloads.style.display = 'none';
      __downloads.innerHTML = '';
    }
  };

  let __find = document.querySelector('#__find');
  let find_options = {
    forward: true,
    findNext: false,
    matchCase: false,
    wordStart: false,
    medialCapitalAsWordStart: false,
  };
  let find_input = null;
  let find_interval = null;
  window.showFind = function (from_key) {
    SOCIALBROWSER.injectDefault();
    if (!__find) {
      __find = document.querySelector('#__find');
    }
    if (!find_input) {
      find_input = document.querySelector('#__find_input');
    }

    if (from_key) {
      if (__find.style.display == 'block') {
        __find.style.display = 'none';
        SOCIALBROWSER.currentWindow.webContents.stopFindInPage('clearSelection');
        clearInterval(find_interval);
        find_interval = null;
        return;
      } else {
        __find.style.display = 'block';
        if (!find_interval) {
          find_interval = setInterval(() => {
            find_input.focus();
          }, 250);
        }
      }
      return;
    }

    if (find_input.value) {
      SOCIALBROWSER.currentWindow.webContents.findInPage(find_input.value, find_options);
      find_options.findNext = true;
    } else {
      SOCIALBROWSER.currentWindow.webContents.stopFindInPage('clearSelection');
      find_options.findNext = false;
    }
  };
  SOCIALBROWSER.on('found-in-page', (event, data) => {
    if (data.win_id == SOCIALBROWSER.currentWindow.id) {
      // SOCIALBROWSER.log(data);
    }
  });

  SOCIALBROWSER.on('[send-render-message]', (event, data) => {
    if (data.name == 'update-target-url') {
      showInfo(data.url);
    } else if (data.name == 'show-info') {
      showInfo(data.msg);
    }
  });

  SOCIALBROWSER.on('user_downloads', (event, data) => {
    showDownloads(data.message, data.class);
  });
  SOCIALBROWSER.on('show_message', (event, data) => {
    alert(data.message);
  });
  window.open = function (url, _name, _specs, _replace_in_history) {
    if(url.like('javascript:*')){
      return
    }
    let child_window = {
      closed: false,
      child_window: window,
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
      self: {
        close: function () {
          // SOCIALBROWSER.log('child_window self close');
        },
      },
    };

    if (typeof url !== 'string') {
      return child_window;
    }
    if (url == 'about:blank') {
      return child_window;
    }
    url = SOCIALBROWSER.handle_url(url);

    if (url.like('https://www.youtube.com/watch*')) {
      SOCIALBROWSER.call('new-youtube-window', {
        referrer: document.location.href,
        url: url,
      });

      return child_window;
    }

    let allow = false;

    let url_p = SOCIALBROWSER.url.parse(url);
    let url2_p = SOCIALBROWSER.url.parse(this.document.location.href);

    if (url_p.host === url2_p.host && SOCIALBROWSER.var.blocking.popup.allow_internal) {
      allow = true;
    } else if (url_p.host !== url2_p.host && SOCIALBROWSER.var.blocking.popup.allow_external) {
      allow = true;
    } else {
      SOCIALBROWSER.var.blocking.popup.white_list.forEach((d) => {
        if (url_p.host.like(d.url) || url2_p.host.like(d.url)) {
          allow = true;
        }
      });
    }

    if (!allow) {
      // SOCIALBROWSER.log('Block popup : ' + url)
      return child_window;
    }

    if (SOCIALBROWSER.var.blocking.javascript.block_window_open) {
      // SOCIALBROWSER.log('Block window.open ' + url);
      return child_window;
    }

    if (!_specs) {
      SOCIALBROWSER.call('[send-render-message]', {
        name: '[open new tab]',
        referrer: document.location.href,
        url: url,
        source: 'window.open',
        win_id: SOCIALBROWSER.currentWindow.id,
      });

      return child_window;
    }

    let win = new SOCIALBROWSER.electron.remote.BrowserWindow({
      show: true,
      alwaysOnTop: true,
      skipTaskbar: false,
      resizable: true,
      width: _specs.width || 1280,
      height: _specs.height || 720,
      backgroundColor: '#ffffff',
      frame: true,
      fullscreenable: true,
      title: 'New Window',
      icon: SOCIALBROWSER.path.join(SOCIALBROWSER.files_dir, 'images', 'logo.ico'),
      parent2: SOCIALBROWSER.currentWindow,
      webPreferences: SOCIALBROWSER.currentWindow.webContents.getWebPreferences(),
    });
    win.center();
    win.setMenuBarVisibility(false);
    win.loadURL(url, {
      referrer: document.location.href,
    });

    SOCIALBROWSER.call('[assign][window]', {
      parent: SOCIALBROWSER.currentWindow.id,
      child: win.id,
    });

    child_window.postMessage = function (...args) {
      args[1] = '*';
      return win.webContents.postMessage(...args);
    };
    win.on('close', () => {
      win.destroy();
    });
    win.webContents.once('dom-ready', () => {
      child_window.eval = function (code, userGesture = true) {
        code = `window.eval(${code})`;
        win.webContents
          .executeJavaScript(code, userGesture)
          .then((result) => {
            // SOCIALBROWSER.log(result);
          })
          .catch((err) => {
            // console.error(err);
          });
      };
    });

    child_window.close = function () {
      return win.close();
    };
    // child_window.document
    win.on('close', (e) => {
      setTimeout(() => {
        child_window.postMessage = () => {};
        child_window.eval = () => {};
        child_window.closed = true;
      }, 1000 * 5);
    });

    return child_window;
  };

  SOCIALBROWSER.localStorage = window.localStorage
  SOCIALBROWSER.sessionStorage = window.sessionStorage

  try {
    if (SOCIALBROWSER.var.blocking.javascript.custom_local_storage && localStorage) {
      SOCIALBROWSER.__define(window, 'localStorage', {
        setItem: function (key, value) {
          return SOCIALBROWSER.localStorage.setItem(key, value);
        },
        getItem: function (key) {
          let value = SOCIALBROWSER.localStorage.getItem(key);
          return value;
        },
        get length() {
          return SOCIALBROWSER.localStorage.length;
        },
        removeItem: function (key) {
          return SOCIALBROWSER.localStorage.removeItem(key);
        },
        clear: function () {
          return SOCIALBROWSER.localStorage.clear();
        },
        key: function (index) {
          return SOCIALBROWSER.localStorage.key(index);
        },
      });
    }
  } catch (error) {
     SOCIALBROWSER.log(error)
  }

  try {
    if (SOCIALBROWSER.var.blocking.javascript.custom_session_storage && sessionStorage) {

      let hack = {
        setItem: function (key, value) {
          return SOCIALBROWSER.sessionStorage.setItem(key, value);
        },
        getItem: function (key) {
          let value = SOCIALBROWSER.sessionStorage.getItem(key);
          return value;
        },
        get length() {
          return SOCIALBROWSER.sessionStorage.length;
        },
        removeItem: function (key) {
          return SOCIALBROWSER.sessionStorage.removeItem(key);
        },
        clear: function () {
          return SOCIALBROWSER.sessionStorage.clear();
        },
        key: function (index) {
          return SOCIALBROWSER.sessionStorage.key(index);
        },
      };

      SOCIALBROWSER.__define(window, 'sessionStorage', hack);
    }
  } catch (error) {
     SOCIALBROWSER.log(error)
  }
};
