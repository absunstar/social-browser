SOCIALBROWSER.ws = function (message) {
  SOCIALBROWSER.ipc('ws', message);
};
SOCIALBROWSER.share = function (message) {
  SOCIALBROWSER.ipc('share', message);
};
SOCIALBROWSER.message = function (message) {
  SOCIALBROWSER.ipc('message', message);
};
SOCIALBROWSER.on('message', (e, message) => {
  if (message.eval) {
    window.eval(message.eval);
  }
});

SOCIALBROWSER.scope = function (selector = '[ng-controller]') {
  return angular.element(document.querySelector(selector)).scope();
};

SOCIALBROWSER.requestCookie = function (obj = {}) {
  obj.domain = obj.domain || document.location.hostname;
  return SOCIALBROWSER.ipc('request-cookie', obj);
};
SOCIALBROWSER.addSession = function (session) {
  if (typeof session == 'string') {
    session = {
      display: session,
    };
    session.name = 'persist:' + SOCIALBROWSER.md5(session.display);
  }
  if (!session.name && session.display) {
    session.name = 'persist:' + SOCIALBROWSER.md5(session.display);
  }

  if (session.name && session.display) {
    if (!session.name.like('*persist*')) {
      session.name = 'persist:' + session.name;
    }
    session.can_delete = true;
    session.time = session.time || new Date().getTime();
    if (!session.privacy) {
      session.privacy = {
        enable_virtual_pc: true,
        vpc: SOCIALBROWSER.generateVPC(),
      };
    }
    if (!session.defaultUserAgent) {
      session.defaultUserAgent = SOCIALBROWSER.var.userAgentList[SOCIALBROWSER.random(0, SOCIALBROWSER.var.userAgentList.length - 1)];
    }
    SOCIALBROWSER.ws({ type: '[add-session]', session: session });
  }
  return session;
};
SOCIALBROWSER.removeSession = SOCIALBROWSER.deleteSession = function (session) {
  if (typeof session == 'string') {
    session = {
      display: session,
    };
  }

  SOCIALBROWSER.ws({ type: '[remove-session]', session: session });

  return session;
};
SOCIALBROWSER.fetchJson = function (options, callback) {
  options.id = new Date().getTime() + Math.random();
  options.url = SOCIALBROWSER.handleURL(options.url);

  return new Promise((resolve, reject) => {
    SOCIALBROWSER.ipc('[fetch-json]', options).then((data) => {
      if (data) {
        if (callback) {
          callback(data);
        } else {
          resolve(data);
        }
      }
    });
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

SOCIALBROWSER.timeZones = [
  {
    value: 'Dateline Standard Time',
    offset: -12,
    text: '(UTC-12:00) International Date Line West',
  },
  {
    value: 'UTC-11',
    offset: -11,
    text: '(UTC-11:00) Coordinated Universal Time-11',
  },
  {
    value: 'Hawaiian Standard Time',
    offset: -10,
    text: '(UTC-10:00) Hawaii',
  },
  {
    value: 'Alaskan Standard Time',
    offset: -9,
    text: '(UTC-09:00) Alaska',
  },
  {
    value: 'Pacific Standard Time (Mexico)',
    offset: -8,
    text: '(UTC-08:00) Baja California',
  },
  {
    value: 'Pacific Daylight Time',
    offset: -7,
    text: '(UTC-07:00) Pacific Daylight Time (US & Canada)',
  },
  {
    value: 'Central Standard Time',
    offset: -6,
    text: '(UTC-06:00) Central Time (US & Canada)',
  },

  {
    value: 'SA Pacific Standard Time',
    offset: -5,
    text: '(UTC-05:00) Bogota, Lima, Quito',
  },
  {
    value: 'Paraguay Standard Time',
    offset: -4,
    text: '(UTC-04:00) Asuncion',
  },
  {
    value: 'E. South America Standard Time',
    offset: -3,
    text: '(UTC-03:00) Brasilia',
  },

  {
    value: 'UTC-02',
    offset: -2,
    text: '(UTC-02:00) Coordinated Universal Time-02',
  },
  {
    value: 'Mid-Atlantic Standard Time',
    offset: -1,
    text: '(UTC-02:00) Mid-Atlantic - Old',
  },
  {
    value: 'GMT Standard Time',
    offset: 0,
    text: '(UTC) Edinburgh, London',
  },

  {
    value: 'British Summer Time',
    offset: 1,
    text: '(UTC+01:00) Edinburgh, London',
  },
  {
    value: 'Central European Standard Time',
    offset: 2,
    text: '(UTC+02:00) Sarajevo, Skopje, Warsaw, Zagreb',
  },
  {
    value: 'GTB Standard Time',
    offset: 3,
    text: '(UTC+02:00) Athens, Bucharest',
  },

  {
    value: 'Samara Time',
    offset: 4,
    text: '(UTC+04:00) Samara, Ulyanovsk, Saratov',
  },

  {
    value: 'Azerbaijan Standard Time',
    offset: 5,
    text: '(UTC+05:00) Baku',
  },

  {
    value: 'Central Asia Standard Time',
    offset: 6,
    text: '(UTC+06:00) Nur-Sultan (Astana)',
  },

  {
    value: 'SE Asia Standard Time',
    offset: 7,
    text: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
  },

  {
    value: 'China Standard Time',
    offset: 8,
    text: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
  },

  {
    value: 'Japan Standard Time',
    offset: 9,
    text: '(UTC+09:00) Osaka, Sapporo, Tokyo',
  },

  {
    value: 'E. Australia Standard Time',
    offset: 10,
    text: '(UTC+10:00) Brisbane',
  },

  {
    value: 'Central Pacific Standard Time',
    offset: 11,
    text: '(UTC+11:00) Solomon Is., New Caledonia',
  },

  {
    value: 'New Zealand Standard Time',
    offset: 12,
    text: '(UTC+12:00) Auckland, Wellington',
  },
];

SOCIALBROWSER.generateVPC = function () {
  let screenSize = SOCIALBROWSER.scrrenSizeList[SOCIALBROWSER.random(0, SOCIALBROWSER.scrrenSizeList.length - 1)].split('x');
  return {
    hide_memory: true,
    memory_count: SOCIALBROWSER.random(1, 128),
    hide_cpu: true,
    cpu_count: SOCIALBROWSER.random(1, 64),
    hide_lang: true,
    hide_location: true,
    location: {
      latitude: SOCIALBROWSER.random(1, 49) + Math.random(),
      longitude: SOCIALBROWSER.random(1, 49) + Math.random(),
    },
    languages: SOCIALBROWSER.languageList[SOCIALBROWSER.random(0, SOCIALBROWSER.languageList.length - 1)],
    mask_date: true,
    timeZone: SOCIALBROWSER.timeZones[SOCIALBROWSER.random(0, SOCIALBROWSER.timeZones.length - 1)],
    hide_webgl: true,
    hide_mimetypes: true,
    hide_plugins: true,
    hide_screen: true,
    screen: {
      width: parseInt(screenSize[0] || '1200'),
      height: parseInt(screenSize[1] || '720'),
      availWidth: parseInt(screenSize[0] || '1200'),
      availHeight: parseInt(screenSize[1] || '720'),
    },
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
    maskUserAgentURL: false,
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
  SOCIALBROWSER.ipc('renderMessage', cm);
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

  SOCIALBROWSER.session_id = SOCIALBROWSER.var.session_list.findIndex((s) => s.name == SOCIALBROWSER.partition) + 1;
  return SOCIALBROWSER.session_id;
};

SOCIALBROWSER.addMenu = function (_menuItem) {
  SOCIALBROWSER.menu_list.push(_menuItem);
};

SOCIALBROWSER.removeMenu = function (_menuItem) {
  let index = SOCIALBROWSER.menu_list.findIndex((m) => m.label == _menuItem.label);
  if (index !== -1) {
    SOCIALBROWSER.menu_list.splice(index, 1);
  }
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
SOCIALBROWSER.copy = function (text = '') {
  SOCIALBROWSER.electron.clipboard.writeText(text.toString());
};
SOCIALBROWSER.paste = function () {
  SOCIALBROWSER.remote.getCurrentWindow().webContents.paste();
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
SOCIALBROWSER.clickKey = function (key) {
  SOCIALBROWSER.log('[ Try Click Key ] : ' + key);
  SOCIALBROWSER.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
  SOCIALBROWSER.webContents.sendInputEvent({ type: 'char', keyCode: key });
};

SOCIALBROWSER.triggerKey = function (el, keyCode) {
  el = SOCIALBROWSER.select(el);
  SOCIALBROWSER.triggerKeydown(el, keyCode);
  SOCIALBROWSER.triggerKeyup(el, keyCode);
  SOCIALBROWSER.triggerKeypress(el, keyCode);
};
SOCIALBROWSER.triggerKeydown = function (el, keyCode) {
  var e = document.createEvent('Events');
  e.initEvent('keydown', true, true);
  e.keyCode = keyCode;
  e.which = keyCode;
  if (el.dispatchEvent) {
    el.dispatchEvent(e);
  }
};
SOCIALBROWSER.triggerKeyup = function (el, keyCode) {
  var e = document.createEvent('Events');
  e.initEvent('keyup', true, true);
  e.keyCode = keyCode;
  e.which = keyCode;
  if (el.dispatchEvent) {
    el.dispatchEvent(e);
  }
};
SOCIALBROWSER.triggerKeypress = function (el, keyCode) {
  var e = document.createEvent('Events');
  e.initEvent('keypress', true, true);
  e.keyCode = keyCode;
  e.which = keyCode;
  if (el.dispatchEvent) {
    el.dispatchEvent(e);
  }
};
SOCIALBROWSER.write = function (text, selector, timeout = 500) {
  return new Promise((resolver, reject) => {
    if (!text) {
      reject('No Text');
    }

    setTimeout(() => {
      selector = SOCIALBROWSER.select(selector);
      if (!selector) {
        reject('No selector');
        return false;
      }

      let momeryText = SOCIALBROWSER.electron.clipboard.readText() || '';

      if (selector.tagName == 'INPUT' || selector.tagName == 'TEXTAREA') {
        selector.value = text;
      } else {
        SOCIALBROWSER.copy(text);
        SOCIALBROWSER.paste();
      }

      setTimeout(() => {
        SOCIALBROWSER.copy(momeryText);
        if (selector) {
          resolver(selector);
        } else {
          resolver(text);
        }
      }, 500);
    }, timeout);
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
      if (!SOCIALBROWSER.isViewable(dom)) {
        dom.scrollIntoView();
        window.scroll(window.scrollX, window.scrollY - (dom.clientHeight + window.innerHeight / 2));
      }

      if (!SOCIALBROWSER.isViewable(dom)) {
        dom.scrollIntoView();
        if (window.scrollY !== 0) {
          let y = window.scrollY - dom.clientHeight;
          if (y < 0) {
            y = 0;
          }
          window.scroll(window.scrollX, y);
        }
      }

      let offset = SOCIALBROWSER.getOffset(dom);
      SOCIALBROWSER.currentWindow.focus();
      SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseMove', x: offset.x, y: offset.y });
      SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseDown', x: offset.x, y: offset.y, button: 'left', clickCount: 1 });
      SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseUp', x: offset.x, y: offset.y, button: 'left', clickCount: 1 });
      return dom;
    } else {
      SOCIALBROWSER.triggerMouseEvent(dom, 'mousemove');
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
  selector = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (selector && selector.focus) {
    selector.focus();
    if (value) {
      selector.value = value;
      selector.dispatchEvent(
        new Event('change', {
          bubbles: true,
          cancelable: true,
        })
      );
    }
  }
  return selector;
};

SOCIALBROWSER.getTimeZone = () => {
  return new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
};

SOCIALBROWSER.isAllowURL = function (url) {
  if (SOCIALBROWSER.var.blocking.white_list.some((item) => item.url.length > 2 && url.like(item.url))) {
    return true;
  }

  let allow = true;
  if (SOCIALBROWSER.var.blocking.core.block_ads) {
    allow = !SOCIALBROWSER.var.ad_list.some((ad) => url.like(ad.url));
  }

  if (allow) {
    allow = !SOCIALBROWSER.var.blocking.black_list.some((item) => url.like(item.url));
  }

  if (allow && SOCIALBROWSER.var.blocking.allow_safty_mode) {
    allow = !SOCIALBROWSER.var.blocking.un_safe_list.some((item) => url.like(item.url));
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
  if (!element) {
    return false;
  }
  if (typeof element == 'string') {
    element = document.querySelector(element);
  }
  var rect = element.getBoundingClientRect();
  var html = document.documentElement;
  let t1 = rect.top >= 0;
  let t2 = rect.left >= 0;
  let t3 = rect.bottom <= (html.clientHeight || window.innerHeight);
  let t4 = rect.right <= (html.clientWidth || window.innerWidth);
  return t1 && t2 && t3 && t4;
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
  let path = `${SOCIALBROWSER.browserData.data_dir}/sessionData/script_${SOCIALBROWSER.remote.getCurrentWindow().id}_${Math.random()}.js`;
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

SOCIALBROWSER.openWindow = function (_customSetting) {
  let win = { trackingID: SOCIALBROWSER.guid(), eventList: [] };
  win.on = function (name, callback) {
    win.eventList.push({ name: name, callback: callback });
  };
  _customSetting.windowType = _customSetting.windowType || 'social-popup';
  let customSetting = { ...SOCIALBROWSER.customSetting, ..._customSetting, trackingID: win.trackingID };

  SOCIALBROWSER.on('[tracking-info]', (e, data) => {
    if (data.trackingID == win.trackingID) {
      if (data.windowID) {
        win.id = data.windowID;
      }
      if (data.isClosed) {
        win.isClosed = data.isClosed;
        win.eventList.forEach((e) => {
          if (e.name == 'close' && e.callback) {
            e.callback();
          }
          if (e.name == 'closed' && e.callback) {
            e.callback();
          }
        });
      }
      if (data.loaded) {
        win.eventList.forEach((e) => {
          if (e.name == 'load' && e.callback) {
            e.callback();
          }
        });
      }
    }
  });

  win.postMessage = function (...args) {
    SOCIALBROWSER.ipc('window.message', { windowID: win.id, data: args[0], origin: args[1] || '*', transfer: args[2] });
  };

  win.eval = function (code) {
    if (!code) {
      console.log('No Eval Code');
      return;
    }
    if (typeof code !== 'string') {
      code = code.toString();
      code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
    }

    SOCIALBROWSER.message({
      windowID: win.id,
      eval: code,
    });
  };

  win.close = function () {
    SOCIALBROWSER.ipc('[browser-message]', { windowID: win.id, name: 'close' });
  };

  SOCIALBROWSER.ipc('[open new popup]', customSetting);

  return win;
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

SOCIALBROWSER.translateBusy = false;
SOCIALBROWSER.translateList = [];
SOCIALBROWSER.translate = function (info, callback) {
  if (!info) {
    callback('');
    return;
  }
  if (typeof info === 'string') {
    info = { text: info };
  }
  info.id = Math.random();
  info.callback =
    callback ||
    function (trans) {
      SOCIALBROWSER.log(trans);
    };
  if (info.text.test(/^[a-zA-Z\-\u0590-\u05FF\0-9^@_:?;!\[\]~<>{}|\\]+$/)) {
    callback(info.text);
    return;
  }

  if (SOCIALBROWSER.translateBusy) {
    setTimeout(() => {
      SOCIALBROWSER.translate(info, callback);
    }, 250);
    return;
  }
  SOCIALBROWSER.translateBusy = true;

  SOCIALBROWSER.translateList.push(info);
  SOCIALBROWSER.ipc('[translate]', { id: info.id, text: info.text, from: info.from, to: info.to });
};

SOCIALBROWSER.on('[translate][data]', (e, info) => {
  SOCIALBROWSER.translateBusy = false;
  info.translatedText = '';
  if (info.data && info.data.sentences && info.data.sentences.length > 0) {
    info.data.sentences.forEach((t) => {
      info.translatedText += t.trans;
    });
    if ((_info = SOCIALBROWSER.translateList.find((t) => t.id == info.id))) {
      _info.callback(info);
    }
  }
});

SOCIALBROWSER.printerList = [];
SOCIALBROWSER.getPrinters = function () {
  if (SOCIALBROWSER.currentWindow.webContents.getPrintersAsync) {
    SOCIALBROWSER.currentWindow.webContents.getPrintersAsync().then((arr0) => {
      SOCIALBROWSER.printerList = arr0;
    });
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
