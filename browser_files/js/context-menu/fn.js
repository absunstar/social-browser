module.exports = function (SOCIALBROWSER) {
  SOCIALBROWSER.sendMessage = function (cm) {
    SOCIALBROWSER.call('renderMessage', cm);
  };

  SOCIALBROWSER.__define = function (o, p, v) {
    if (typeof o == 'undefined') {
      return;
    }
    Object.defineProperty(o, p, {
      get: function () {
        return v;
      },
    });
    if (o.prototype) {
      o.prototype[p] = v;
    }
  };

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

  if (SOCIALBROWSER.var.blocking.javascript.block_eval) {
    window.eval = function (code) {
      console.log(code);
    };
  }

  window.console.clear = function () {};
  if (SOCIALBROWSER.var.blocking.javascript.block_console_output) {
    window.console.log = function () {};
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

  SOCIALBROWSER.getAllSelectors = function () {
    var ret = [];
    for (var i = 0; i < document.styleSheets.length; i++) {
      var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
      for (var x in rules) {
        if (typeof rules[x].selectorText == 'string') ret.push(rules[x].selectorText);
      }
    }
    return ret;
  };

  SOCIALBROWSER.selectorExists = function (selector) {
    var selectors = SOCIALBROWSER.getAllSelectors();
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
        console.log(trans);
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
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&dt=bd&dj=1&q=${text}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        translate_busy = false;
        translated_text = '';
        if (data && data.sentences && data.sentences.length > 0) {
          data.sentences.forEach((t) => {
            translated_text += t.trans;
          });
          callback(translated_text || text);
        }
      })
      .catch((err) => {
        translate_busy = false;
        callback(text);
      });
  };

  window.setInterval0 = window.setInterval;
  window.setInterval = function (...args) {
    return window.setInterval0(...args);
  };
  window.setTimeout0 = window.setTimeout;
  window.setTimeout = function (...args) {
    return window.setTimeout0(...args);
  };

  window.postMessage0 = window.postMessage;
  window.postMessage = function (...args) {
   // console.log(' [ Post Message ] ',...args)
    if (SOCIALBROWSER.var.blocking.javascript.block_window_post_message) {
      console.warn('Block Post Message ',...args)
    }
    return window.postMessage0(...args);
  };

  window.print0 = window.print;
  window.print = function (options) {
    // SOCIALBROWSER.call('render_message', {
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
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
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

  let alert_idle = null;
  window.alert = window.prompt = function (msg, time) {
    if (msg && msg.trim()) {
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

  window.__blockPage = window.prompt = function (block, msg, close) {
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
      console.log(data);
    }
  });

  SOCIALBROWSER.on('render_message', (event, data) => {
    if (data.name == 'update-target-url') {
      showInfo(data.url);
    } else if (data.name == 'show-info') {
      showInfo(data.msg);
    }
  });

  SOCIALBROWSER.on('user_downloads', (event, data) => {
    showDownloads(data.message, data.class);
  });

  window.open = function (url, _name, _specs, _replace_in_history) {
    let opener = {
      closed: false,
      opener: window,
      postMessage: () => {
        console.log('postMessage opener');
      },
      eval: () => {
        console.log('eval opener');
      },
      close: () => {
        console.log('close opener');
      },
      focus: () => {
        console.log('focus opener');
      },
      print: () => {
        console.log('print opener');
      },
      document: {
        write: () => {
          console.log('document write opener');
        },
      },
    };

    if (SOCIALBROWSER.var.blocking.javascript.block_window_open) {
      return opener;
    }

    if (typeof url !== 'string') {
      return opener;
    }
    if (url == 'about:blank') {
      return opener;
    }
    url = SOCIALBROWSER.handle_url(url);

    if (url.like('https://www.youtube.com/watch*')) {
      SOCIALBROWSER.call('new-youtube-window', {
        referrer: document.location.href,
        url: url,
      });

      return opener;
    }

    let url_p = SOCIALBROWSER.url.parse(url);
    let url2_p = SOCIALBROWSER.url.parse(this.document.location.href);

    let allow = false;

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
      // console.log('Block popup : ' + url)
      return opener;
    }

    if (!_specs) {
      SOCIALBROWSER.call('render_message', {
        name: 'open new tab',
        referrer: document.location.href,
        url: url,
        source: 'window.open',
      });

      return null;
    }

    let win = new SOCIALBROWSER.electron.remote.BrowserWindow({
      show: true,
      alwaysOnTop: true,
      width: _specs.width || 800,
      height: _specs.height || 600,
      x: _specs.x || 200,
      y: _specs.y || 200,
      backgroundColor: '#ffffff',
      frame: true,
      icon: SOCIALBROWSER.path.join(SOCIALBROWSER.files_dir, 'images', 'logo.ico'),
      parent : SOCIALBROWSER.electron.remote.getCurrentWebContents(),
      webPreferences: {
        contextIsolation: false,
        session: SOCIALBROWSER.electron.remote.getCurrentWebContents().session,
        sandbox: false,
        preload: SOCIALBROWSER.files_dir + '/js/context-menu.js',
        nativeWindowOpen: false,
        webSecurity: true,
        allowRunningInsecureContent: false,
        plugins: true,
      },
    });

    win.setMenuBarVisibility(false);
    win.loadURL(url, {
      referrer: document.location.href,
    });

    opener.postMessage = function (...args) {
      return win.webContents.postMessage(...args);
    };
    win.webContents.once('dom-ready', () => {
      opener.eval = function (code, userGesture = true) {
        code = `window.eval(${code})`;
        win.webContents
          .executeJavaScript(code, userGesture)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.error(err);
          });
      };
    });

    opener.close = function () {
      return win.close();
    };
    // opener.document
    win.on('close', (e) => {
      opener.postMessage = () => {};
      opener.eval = () => {};
      opener.closed = true;
    });

    return opener;
  };
};
