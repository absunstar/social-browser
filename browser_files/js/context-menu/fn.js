module.exports = function (SOCIALBROWSER) {
  SOCIALBROWSER.ws = function (message) {
    SOCIALBROWSER.ipc('ws', message);
  };
  SOCIALBROWSER.share = function (message) {
    SOCIALBROWSER.ipc('share', message);
  };

  SOCIALBROWSER.fetchJson = function (options, callback) {
    options.id = new Date().getTime() + Math.random();
    options.url = SOCIALBROWSER.handleURL(options.url);

    return new Promise((resolve, reject) => {
      SOCIALBROWSER.on('[fetch-json-callback]', (e, res) => {
        if (res.options.id == options.id) {
          if (res.error) {
            if (!callback) {
              reject({ message: res.error });
            }
            SOCIALBROWSER.log('SOCIALBROWSER.fetchJson error : ', res);
          } else if (res.data) {
            if (!callback) {
              resolve(res.data);
            } else {
              callback(res.data);
            }
          } else {
            SOCIALBROWSER.log('[fetch-json-callback] res : ', res);
          }
        }
      });
      SOCIALBROWSER.call('[fetch-json]', options);
    });
  };
  SOCIALBROWSER.rand = {
    noise: function () {
      let result;
      let font_noise = SOCIALBROWSER.get('font_noise');
      if (font_noise) {
        result = font_noise;
      } else {
        let SIGN = Math.random() < Math.random() ? -1 : 1;
        result = Math.floor(Math.random() + SIGN * Math.random());
        SOCIALBROWSER.set('font_noise', result);
      }
      return result;
    },
    sign: function () {
      const tmp = [-1, -1, -1, -1, -1, -1, +1, -1, -1, -1];
      let index;
      let font_sign = SOCIALBROWSER.get('font_sign');
      if (font_sign) {
        index = font_sign;
      } else {
        index = Math.floor(Math.random() * tmp.length);
        SOCIALBROWSER.set('font_sign', index);
      }

      return tmp[index];
    },
  };

  SOCIALBROWSER.generateVPC = function () {
    let screenSize = SOCIALBROWSER.scrrenSizeList[SOCIALBROWSER.random(0, SOCIALBROWSER.scrrenSizeList.length - 1)].split('x');
    return {
      hide_memory: true,
      memory_count: SOCIALBROWSER.random(1, 128),
      hide_cpu: true,
      cpu_count: SOCIALBROWSER.random(1, 64),
      hide_lang: true,
      languages: SOCIALBROWSER.languageList[SOCIALBROWSER.random(0, SOCIALBROWSER.languageList.length - 1)],
      mask_date: true,
      date_offset: SOCIALBROWSER.random(-300, 300),
      hide_webgl: true,
      hide_mimetypes: true,
      hide_plugins: true,
      hide_screen: true,
      screen_width: parseInt(screenSize[0] || '1200'),
      screen_height: parseInt(screenSize[1] || '720'),
      screen_availWidth: parseInt(screenSize[0] || '1200'),
      screen_availHeight: parseInt(screenSize[1] || '720'),
      set_window_active: true,
      block_rtc: true,
      hide_battery: true,
      hide_canvas: true,
      hide_audio: true,
      hide_media_devices: true,
      hide_connection: true,
      connection: {
        downlink: SOCIALBROWSER.random(1, 15) / 10,
        downlinkMax: SOCIALBROWSER.random(15, 30) / 10,
        effectiveType: SOCIALBROWSER.effectiveTypeList[SOCIALBROWSER.random(0, SOCIALBROWSER.effectiveTypeList.length - 1)],
        rtt: SOCIALBROWSER.random(300, 900),
        type: SOCIALBROWSER.connectionTypeList[SOCIALBROWSER.random(0, SOCIALBROWSER.connectionTypeList.length - 1)].name,
      },
      hide_plugins: true,
      hide_mimetypes: true,
      hide_media_devices: true,
      hide_permissions: true,
      hide_battery: true,
      set_window_active: true,
      dnt: true,
      block_rtc: true,
      mask_user_agent: false,
      hide_fonts: false,
    };
  };
  SOCIALBROWSER.nativeImage = function (_path) {
    try {
      if (!_path) {
        return null;
      }
      return SOCIALBROWSER.electron.nativeImage.createFromPath(SOCIALBROWSER.path.resolve(_path));
    } catch (error) {
      SOCIALBROWSER.log('nativeImage', error);
      return null;
    }
  };

  SOCIALBROWSER.onLoad = function (fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        fn();
      });
    }
  };
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
  SOCIALBROWSER.timeOffset = new Date().getTimezoneOffset();

  SOCIALBROWSER.guid = function () {
    return SOCIALBROWSER.md5(SOCIALBROWSER.partition + document.location.hostname + SOCIALBROWSER.var.core.id);
  };
  SOCIALBROWSER.maxOf = function (num, max) {
    if (num == 0) {
      num = SOCIALBROWSER.random(0, max);
    }
    if (num > max) {
      num = num - max;
      return SOCIALBROWSER.maxOf(num, max);
    }
    return num;
  };
  SOCIALBROWSER.sessionId = function () {
    if (SOCIALBROWSER.session_id) {
      return SOCIALBROWSER.session_id;
    }
    SOCIALBROWSER.var.session_list.forEach((s, i) => {
      if (s.name == SOCIALBROWSER.partition) {
        SOCIALBROWSER.session_id = i + 1;
      }
    });
    return SOCIALBROWSER.session_id;
  };

  SOCIALBROWSER.addMenu = function (m) {
    SOCIALBROWSER.menu_list.push(m);
  };
  SOCIALBROWSER.readFile = function (path) {
    SOCIALBROWSER.fs = SOCIALBROWSER.fs || SOCIALBROWSER.require('fs');
    return SOCIALBROWSER.fs.readFileSync(path).toString();
  };

  SOCIALBROWSER.addHTML = SOCIALBROWSER.addhtml = function (code) {
    try {
      let _div = document.createElement('div');
      _div.id = '_div_' + Math.random();
      _div.innerHTML = code;
      (document.body || document.head || document.documentElement).appendChild(_div);
    } catch (error) {
      SOCIALBROWSER.log(error);
    }
  };
  SOCIALBROWSER.addJS = SOCIALBROWSER.addjs = function (code) {
    try {
      let _script = document.createElement('script');
      _script.id = '_script_' + Math.random();
      _script.innerText = code;
      (document.body || document.head || document.documentElement).appendChild(_script);
    } catch (error) {
      SOCIALBROWSER.log(error);
    }
  };
  SOCIALBROWSER.addCSS = SOCIALBROWSER.addcss = function (code) {
    try {
      let _style = document.createElement('style');
      _style.id = '_style_' + Math.random();
      _style.innerText = code;
      (document.body || document.head || document.documentElement).appendChild(_style);
    } catch (error) {
      SOCIALBROWSER.log(error);
    }
  };
  SOCIALBROWSER.copy = function (text) {
    SOCIALBROWSER.electron.clipboard.writeText(text.toString());
  };
  SOCIALBROWSER.paste = function () {
    SOCIALBROWSER.webContents.paste();
  };

  SOCIALBROWSER.triggerMouseEvent = function (node, eventType) {
    try {
      if (document.createEvent) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
      } else {
        document.documentElement['MouseEvents']++;
      }
    } catch (err) {}
  };
  SOCIALBROWSER.triggerKey = function (el, keyCode) {
    SOCIALBROWSER.triggerKeydown(el, keyCode);
    SOCIALBROWSER.triggerKeyup(el, keyCode);
    SOCIALBROWSER.triggerKeypress(el, keyCode);
  };
  SOCIALBROWSER.triggerKeydown = function (el, keyCode) {
    var e = document.createEvent('Events');
    e.initEvent('keydown', true, true);
    e.keyCode = keyCode;
    e.which = keyCode;
    el.dispatchEvent(e);
  };
  SOCIALBROWSER.triggerKeyup = function (el, keyCode) {
    var e = document.createEvent('Events');
    e.initEvent('keyup', true, true);
    e.keyCode = keyCode;
    e.which = keyCode;
    el.dispatchEvent(e);
  };
  SOCIALBROWSER.triggerKeypress = function (el, keyCode) {
    var e = document.createEvent('Events');
    e.initEvent('keypress', true, true);
    e.keyCode = keyCode;
    e.which = keyCode;
    el.dispatchEvent(e);
  };
  SOCIALBROWSER.write = function (text, selector, timeout) {
    return new Promise((resolver, reject) => {
      if (!text) {
        reject('No Text');
      }
      let dom = null;
      SOCIALBROWSER.copy(text);
      setTimeout(() => {
        if (selector) {
          dom = SOCIALBROWSER.select(selector);
        }
        SOCIALBROWSER.paste();
        setTimeout(() => {
          if (selector && dom) {
            resolver(dom);
          } else {
            resolver(text);
          }
        }, 500);
      }, timeout || 500);
    });
  };
  SOCIALBROWSER.getOffset = function (el) {
    const rect = el.getBoundingClientRect();
    let factor = SOCIALBROWSER.currentWindow.webContents.zoomFactor || 1;
    return {
      x: Math.round(rect.left * factor + (el.clientWidth / 4) * factor),
      y: Math.round(rect.top * factor + (el.clientHeight / 4) * factor),
    };
  };
  SOCIALBROWSER.click = function (selector, realPerson = true) {
    if (!selector) {
      return;
    }
    let dom = typeof selector === 'string' ? SOCIALBROWSER.$(selector) : selector;
    if (dom) {
      if (realPerson && SOCIALBROWSER.currentWindow && SOCIALBROWSER.webContents && SOCIALBROWSER.currentWindow.isVisible()) {
        dom.scrollIntoView();
        if (window.scrollY == 0) {
        } else if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        } else {
          window.scroll(window.scrollX, window.scrollY - dom.clientHeight);
        }
        let offset = SOCIALBROWSER.getOffset(dom);
        SOCIALBROWSER.currentWindow.focus();
        SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseDown', x: offset.x, y: offset.y, button: 'left', clickCount: 1 });
        SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseUp', x: offset.x, y: offset.y, button: 'left', clickCount: 1 });
        return dom;
      } else {
        SOCIALBROWSER.triggerMouseEvent(dom, 'mousedown');
        SOCIALBROWSER.triggerMouseEvent(dom, 'mouseup');
        dom.click();
        return dom;
      }
    }
  };
  SOCIALBROWSER.$ = function (selector) {
    return document.querySelector(selector);
  };
  SOCIALBROWSER.select = function (selector, value) {
    if (!selector) {
      return null;
    }
    let dom = document.querySelector(selector);
    if (dom && dom.focus) {
      dom.focus();
      if (value) {
        dom.value = value;
        dom.dispatchEvent(
          new Event('change', {
            bubbles: true,
            cancelable: true,
          })
        );
      }
    }
    return dom;
  };

  SOCIALBROWSER.getTimeZone = () => {
    return new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  SOCIALBROWSER.isAllowURL = function (url) {
    let allow = true;
    if (SOCIALBROWSER.var.blocking.core.block_ads) {
      SOCIALBROWSER.var.ad_list.forEach((ad) => {
        if (url.like(ad.url)) {
          allow = false;
        }
      });
    }

    return allow;
  };

  SOCIALBROWSER.isValidURL = SOCIALBROWSER.isURL = function (str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(encodeURI(str));
  };

  SOCIALBROWSER.handle_url = SOCIALBROWSER.handleURL = function (u) {
    if (typeof u !== 'string') {
      return u;
    }
    try {
      u = decodeURI(u);
    } catch (error) {
      u = u;
    }
    u = u.trim();
    if (u.indexOf('http') === 0 || u.indexOf('//') === 0 || u.indexOf('data:') === 0 || u.indexOf('blob:') === 0) {
      u = u;
    } else if (u.indexOf('/') === 0) {
      u = window.location.origin + u;
    } else if (u.split('?')[0].split('.').length < 3) {
      let page = window.location.pathname.split('/').pop();
      u = window.location.origin + window.location.pathname.replace(page, '') + u;
    }
    return u;
  };

  SOCIALBROWSER.isViewable = function (element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  };

  SOCIALBROWSER.eval = function (code) {
    if (!code) {
      return;
    }
    if (typeof code !== 'string') {
      code = code.toString();
      code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
    }

    SOCIALBROWSER.fs = SOCIALBROWSER.fs || SOCIALBROWSER.require('fs');
    let path = `${SOCIALBROWSER.browserData.data_dir}/sessionData/script_${SOCIALBROWSER.currentWindow.id}_${Math.random()}.js`;
    if (SOCIALBROWSER.fs.existsSync(path)) {
      SOCIALBROWSER.require(path);
    } else {
      try {
        SOCIALBROWSER.fs.writeFileSync(path, code);
        SOCIALBROWSER.require(path);
        setTimeout(() => {
          SOCIALBROWSER.fs.unlinkSync(path);
        }, 1000 * 3);
      } catch (error) {
        SOCIALBROWSER.log(error);
      }
    }
  };

  SOCIALBROWSER.openWindow = function (customSetting) {
    try {
      customSetting = { ...SOCIALBROWSER.customSetting, ...{ windowType: 'social-popup' }, ...customSetting };
      let win = new SOCIALBROWSER.remote.BrowserWindow({
        show: customSetting.show ?? true,
        alwaysOnTop: customSetting.alwaysOnTop ?? false,
        skipTaskbar: customSetting.skipTaskbar ?? false,
        width: customSetting.width || 1200,
        height: customSetting.height || 720,
        x: customSetting.x || 200,
        y: customSetting.y || 200,
        backgroundColor: customSetting.backgroundColor || '#ffffff',
        icon: customSetting.icon ?? SOCIALBROWSER.var.core.icon,
        frame: true,
        title: customSetting.title ?? 'New Window',
        resizable: customSetting.resizable ?? true,
        fullscreenable: customSetting.fullscreenable ?? true,
        webPreferences: {
          contextIsolation: customSetting.contextIsolation ?? false,
          enableRemoteModule: customSetting.enableRemoteModule ?? true,
          webaudio: customSetting.allowAudio,
          nativeWindowOpen: false,
          nodeIntegration: customSetting.node,
          nodeIntegrationInWorker: customSetting.node,
          partition: customSetting.partition,
          sandbox: customSetting.sandbox ?? false,
          preload: customSetting.preload || SOCIALBROWSER.files_dir + '/js/context-menu.js',
          webSecurity: customSetting.webSecurity ?? true,
          allowRunningInsecureContent: customSetting.allowRunningInsecureContent ?? false,
          plugins: true,
        },
      });
      customSetting.win_id = win.id;

      SOCIALBROWSER.ipc('[handle-session]', { ...customSetting, name: customSetting.partition });
      SOCIALBROWSER.ipc('[add][window]', { win_id: win.id, customSetting: customSetting });
      SOCIALBROWSER.ipc('[assign][window]', {
        parent_id: SOCIALBROWSER.currentWindow.id,
        child_id: win.id,
      });
      if (!customSetting.x && !customSetting.y) {
        win.center();
      }

      win.setMenuBarVisibility(false);

      win.webContents.audioMuted = !customSetting.allowAudio;

      if (customSetting.url) {
        win.loadURL(SOCIALBROWSER.handleURL(customSetting.url), {
          referrer: customSetting.referrer || document.location.href,
          userAgent: customSetting.user_agent || customSetting.userAgent || SOCIALBROWSER.userAgent || navigator.userAgent,
        });
      }

      win.eval = function (code) {
        if (!code) {
          console.log('No Eval Code');
          return;
        }
        if (typeof code !== 'string') {
          code = code.toString();
          code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
        }
        SOCIALBROWSER.ipc('[set][window][setting]', {
          win_id: win.id,
          customSetting: customSetting,
          name: 'eval',
          code: code,
        });
      };

      win.on('close', (e) => {
        if (win && !win.isDestroyed()) {
          win.destroy();
        }
      });

      win.once('ready-to-show', function () {
        if (customSetting.show && win && !win.isDestroyed()) {
          win.show();
          if (customSetting.maximize && win && !win.isDestroyed()) {
            win.maximize();
          }
        }
      });
      win.webContents.on('context-menu', (event, params) => {
        if (win && !win.isDestroyed()) {
          if (customSetting.allowMenu) {
            win.webContents.send('context-menu', params);
          }
        }
      });

      win.webContents.on('did-fail-load', (...callback) => {
        callback[0].preventDefault();
        if (callback[4]) {
          if (SOCIALBROWSER.var.blocking.proxy_error_remove_proxy && customSetting.proxy) {
            SOCIALBROWSER.ws({
              type: '[remove-proxy]',
              proxy: customSetting.proxy,
            });
          }
          if (SOCIALBROWSER.var.blocking.proxy_error_close_window && SOCIALBROWSER.customSetting.windowType.contains('popup') && win && !win.isDestroyed()) {
            win.close();
          }
          if (SOCIALBROWSER.customSetting.windowType == 'social-popup' && win && !win.isDestroyed()) {
            win.close();
          }
        }
      });

      win.webContents.on('new-window', function (event, url, frameName, disposition, options, referrer, postBody) {
        event.preventDefault();

        if (!win || win.isDestroyed()) {
          return;
        }

        let real_url = url || event.url || '';

        if (real_url.like('*about:blank*|*javascript:*')) {
          return false;
        }

        SOCIALBROWSER.openWindow({ url: real_url, allowMenu: true });
      });

      win.onBeforeRequest = function (callback) {
        win.webContents.session.webRequest.onBeforeRequest(
          {
            urls: ['*://*/*'],
          },
          callback
        );
      };

      win.onBeforeSendHeaders = function (callback) {
        win.webContents.session.webRequest.onBeforeSendHeaders(
          {
            urls: ['*://*/*'],
          },
          callback
        );
      };

      win.customSetting = customSetting;
      return win;
    } catch (error) {
      SOCIALBROWSER.log(error);
      return null;
    }
  };

  window.console.clear = function () {};

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

  SOCIALBROWSER.printerList = [];
  SOCIALBROWSER.getPrinters = function () {
    if (SOCIALBROWSER.currentWindow.webContents.getPrintersAsync) {
      SOCIALBROWSER.currentWindow.webContents.getPrintersAsync().then((arr0) => {
        SOCIALBROWSER.printerList = arr0;
      });
    } else if (SOCIALBROWSER.currentWindow.webContents.getPrinters) {
      SOCIALBROWSER.printerList = SOCIALBROWSER.currentWindow.webContents.getPrinters();
    } else {
      SOCIALBROWSER.printerList = [];
    }

    return SOCIALBROWSER.printerList;
  };

  SOCIALBROWSER.__img_to_base64 = function (selector) {
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

  SOCIALBROWSER.__img_code = function (selector) {
    return SOCIALBROWSER.__md5(window.__img_to_base64(selector));
  };

  SOCIALBROWSER.injectDefault = function () {
    try {
      if (document.body && !document.querySelector('#social_browser_html')) {
        let social_browser_html = document.createElement('div');
        social_browser_html.id = 'social_browser_html';
        social_browser_html.innerHTML = Buffer.from(SOCIALBROWSER.injectHTML).toString();
        document.body.appendChild(social_browser_html);
      }
      if ((document.body || document.head || document.documentElement) && !document.querySelector('#social_browser_css')) {
        let social_browser_css = document.createElement('style');
        social_browser_css.id = 'social_browser_css';
        social_browser_css.innerText = Buffer.from(SOCIALBROWSER.injectCSS).toString();
        (document.body || document.head || document.documentElement).appendChild(social_browser_css);
      }
    } catch (error) {
      SOCIALBROWSER.log(error);
    }
  };

  SOCIALBROWSER.__showBookmarks = function () {
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

  SOCIALBROWSER.__showWarningImage = function () {
    SOCIALBROWSER.injectDefault();
    let div = document.querySelector('#__warning_img');
    if (div) {
      div.style.display = 'block';
    }
  };
  SOCIALBROWSER.__showBotImage = function () {
    SOCIALBROWSER.injectDefault();
    let div = document.querySelector('#__bot_img');
    if (div) {
      div.style.display = 'block';
    }
  };
  SOCIALBROWSER.__blockPage = function (block, msg, close) {
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
  SOCIALBROWSER.showInfo = function (msg, time) {
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
  SOCIALBROWSER.showDownloads = function (msg, css) {
    SOCIALBROWSER.injectDefault();
    if (!__downloads) {
      __downloads = document.querySelector('#__downloads');
      if (__downloads) {
        __downloads.addEventListener('click', () => {
          __downloads.style.display = 'none';
          __downloads.innerHTML = '';
        });
      }
    }
    if (msg && __downloads) {
      __downloads.style.display = 'block';
      __downloads.innerHTML = msg;
    } else if (__downloads) {
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
  SOCIALBROWSER.showFind = function (from_key) {
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

  SOCIALBROWSER.objectFromTable = function (selector) {
    let table = {
      selector: selector,
      headers: [],
      rows: [],
    };

    document.querySelectorAll(`${selector} thead tr th`).forEach((th) => {
      table.headers.push(th.innerText);
    });

    document.querySelectorAll(`${selector} tbody tr `).forEach((tr) => {
      let row = [];
      tr.childNodes.forEach((td, i) => {
        row[i] = td.innerText;
      });
      table.rows.push(row);
    });

    return table;
  };
  SOCIALBROWSER.copyObject = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };

  SOCIALBROWSER.windowOpenList = [];
};
