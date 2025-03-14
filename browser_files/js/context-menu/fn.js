SOCIALBROWSER.ws = function (message) {
  SOCIALBROWSER.ipc('ws', message);
};
SOCIALBROWSER.share = function (data) {
  SOCIALBROWSER.ipc('share', data);
};
SOCIALBROWSER.onShareFnList = [];
SOCIALBROWSER.onShare = function (fn) {
  SOCIALBROWSER.onShareFnList.push(fn);
};
SOCIALBROWSER.on('share', (e, data) => {
  SOCIALBROWSER.onShareFnList.forEach((fn) => {
    fn(data);
  });
});

SOCIALBROWSER.sendMessage = SOCIALBROWSER.message = function (message) {
  if (!message) {
    return false;
  }
  if (typeof message === 'string') {
    message = { message: message };
  }

  message.windowID = message.windowID || SOCIALBROWSER.currentWindow.id;
  SOCIALBROWSER.ipc('message', message);
};
SOCIALBROWSER.onMessageFnList = [];
SOCIALBROWSER.onMessage = function (fn) {
  SOCIALBROWSER.onMessageFnList.push(fn);
};
SOCIALBROWSER.on('message', (e, message) => {
  if (message.eval) {
    SOCIALBROWSER.eval(message.eval);
  }
  SOCIALBROWSER.onMessageFnList.forEach((fn) => {
    fn(message);
  });
});

SOCIALBROWSER.toJson = (obj) => {
  if (typeof obj === undefined || obj === null) {
    return '';
  }
  return JSON.stringify(obj);
};

SOCIALBROWSER.fromJson = (str) => {
  if (typeof str !== 'string') {
    return str;
  }
  return JSON.parse(str);
};

SOCIALBROWSER.toBase64 = (str) => {
  return SOCIALBROWSER.ipcSync('[toBase64]', str);
};

SOCIALBROWSER.fromBase64 = (str) => {
  return SOCIALBROWSER.ipcSync('[fromBase64]', str);
};

SOCIALBROWSER.to123 = (data) => {
  data = typeof data === 'object' ? SOCIALBROWSER.toJson(data) : data;
  return SOCIALBROWSER.ipcSync('[to123]', data);
};

SOCIALBROWSER.from123 = (data) => {
  return SOCIALBROWSER.ipcSync('[from123]', data);
};

SOCIALBROWSER.hideObject = (obj) => {
  return SOCIALBROWSER.to123(obj);
};
SOCIALBROWSER.showObject = (obj) => {
  return JSON.parse(SOCIALBROWSER.from123(obj));
};
SOCIALBROWSER.typeOf = SOCIALBROWSER.typeof = function type(elem) {
  return Object.prototype.toString.call(elem).slice(8, -1);
};
SOCIALBROWSER.encryptText = function (text, password = '^^') {
  if (text && password && typeof text == 'string' && typeof password == 'string') {
    return SOCIALBROWSER.ipcSync('[encryptText]', { text: text, password, password });
  }
};
SOCIALBROWSER.decryptText = function (text, password = '^^') {
  if (text && password && typeof text == 'string' && typeof password == 'string') {
    return SOCIALBROWSER.ipcSync('[decryptText]', { text: text, password, password });
  }
};

SOCIALBROWSER.scope = function (selector = '[ng-controller]') {
  return angular.element(document.querySelector(selector)).scope();
};

SOCIALBROWSER.openExternal = function (link) {
  return SOCIALBROWSER.ipc('[open-external]', { link: link });
};
SOCIALBROWSER.exec = function (cmd) {
  return SOCIALBROWSER.ipc('[exec]', { cmd: cmd });
};
SOCIALBROWSER.exe = function (cmd, args = []) {
  return SOCIALBROWSER.ipc('[exe]', { cmd: cmd, args: args });
};
SOCIALBROWSER.kill = function (name) {
  return SOCIALBROWSER.ipc('[kill]', { name: name });
};
SOCIALBROWSER.requestCookie = function (obj = {}) {
  obj.domain = obj.domain || document.location.hostname;
  obj.partition = SOCIALBROWSER.partition;
  return SOCIALBROWSER.ipc('[request-cookie]', obj);
};

SOCIALBROWSER.isNativeFunction = function (f) {
  return f.toString().includes('[native code]');
};

SOCIALBROWSER.desktopCapturer = function (options = {}, callback) {
  navigator.mediaDevices
    .getDisplayMedia({
      audio: false,
      video: {
        width: 1200,
        height: 800,
        frameRate: 30,
      },
    })
    .then((stream) => {
      callback(null, stream, video);
      if ((video = options.video)) {
        video.srcObject = stream;
        video.onloadedmetadata = (e) => video.play();
      }
    })
    .catch((err) => {
      callback(err);
    });
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
    if (!session.name.like('persist*')) {
      session.name = 'persist:' + session.name;
    }
    if (SOCIALBROWSER.var.session_list.find((s) => s.name == session.name || s.display == session.display)) {
      return null;
    }
    session.can_delete = true;
    session.time = session.time || new Date().getTime();
    if (!session.privacy) {
      session.privacy = {
        allowVPC: true,
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
SOCIALBROWSER.fetch = function (options, callback) {
  options.id = new Date().getTime() + Math.random();
  options.url = SOCIALBROWSER.handleURL(options.url);

  return new Promise((resolve, reject) => {
    SOCIALBROWSER.ipc('[fetch]', options).then((data) => {
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
SOCIALBROWSER.fetchJson = function (options, callback) {
  if (typeof options == 'string') {
    options = {
      url: options,
    };
  }
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

if ((randomUserAgentSupport = true)) {
  SOCIALBROWSER.userAgentDeviceList = [
    {
      name: 'PC',
      platformList: [
        { name: 'Windows NT 6.1; WOW64', code: 'Win32' },
        { name: 'Windows NT 10.0; Win64; x64', code: 'Win32' },
        { name: 'Windows NT 11.0; Win64; x64', code: 'Win32' },
        { name: 'Windows NT 10.0', code: 'Win32' },
        { name: 'Windows NT 11.0', code: 'Win32' },
        { name: 'MacIntel', code: 'MacIntel' },
        { name: 'Macintosh; Intel Mac OS X 13_0', code: 'MacIntel' },
        { name: 'Macintosh; Intel Mac OS X 14_0', code: 'MacIntel' },
        { name: 'Macintosh; Intel Mac OS X 15_0', code: 'MacIntel' },
        { name: 'Macintosh; Intel Mac OS X 16_0', code: 'MacIntel' },
        { name: 'Linux x86_64', code: 'Linux x86_64' },
        { name: 'X11; Ubuntu; Linux x86_64', code: 'Linux x86_64' },
      ],
      screenList: [
        '2560*1440',
        '1920*1080',
        '1792*1120',
        '1680*1050',
        '1600*900',
        '1536*864',
        '1440*900',
        '1366*768',
        '1280*800',
        '1280*720',
        '1024*768',
        '1024*600',
        '962*601',
        '810*1080',
        '800*1280',
        '768*1024',
      ],
    },
    {
      name: 'Mobile',
      platformList: [
        { name: 'Linux; Android 11', code: 'Android' },
        { name: 'Linux; Android 12', code: 'Android' },
        { name: 'Linux; Android 13', code: 'Android' },
        { name: 'Linux; Android 14', code: 'Android' },
        { name: 'Linux; Android 15', code: 'Android' },
        { name: 'iPhone; CPU iPhone OS 13_0 like Mac OS X', code: 'iPhone' },
        { name: 'iPhone; CPU iPhone OS 14_0  like Mac OS X', code: 'iPhone' },
        { name: 'iPhone; CPU iPhone OS 15_0  like Mac OS X', code: 'iPhone' },
        { name: 'iPhone; CPU iPhone OS 16_0  like Mac OS X', code: 'iPhone' },
        { name: 'iPad; CPU OS 13_0  like Mac OS X', code: 'iPad' },
        { name: 'iPad; CPU OS 14_0  like Mac OS X', code: 'iPad' },
        { name: 'iPad; CPU OS 15_0  like Mac OS X', code: 'iPad' },
        { name: 'iPad; CPU OS 16_0  like Mac OS X', code: 'iPad' },
      ],
      screenList: ['601*962', '600*1024', '414*896', '390*844', '360*800', '360*640'],
    },
  ];
  SOCIALBROWSER.userAgentBrowserList = [
    {
      name: 'Chrome',
      vendor: 'Google Inc.',
      prefix: '',
      randomMajor: () => SOCIALBROWSER.randomNumber(133, 136),
      randomMinor: () => SOCIALBROWSER.randomNumber(0, 5735),
      randomPatch: () => SOCIALBROWSER.randomNumber(0, 199),
    },
    {
      name: 'Edge',
      vendor: '',
      prefix: '',
      randomMajor: () => SOCIALBROWSER.randomNumber(133, 136),
      randomMinor: () => SOCIALBROWSER.randomNumber(0, 5735),
      randomPatch: () => SOCIALBROWSER.randomNumber(0, 199),
    },
    {
      name: 'Firefox',
      vendor: 'Mozilla',
      prefix: '',
      randomMajor: () => SOCIALBROWSER.randomNumber(133, 136),
      randomMinor: () => SOCIALBROWSER.randomNumber(0, 9),
      randomPatch: () => SOCIALBROWSER.randomNumber(0, 99),
    },
    {
      name: 'Safari',
      vendor: 'Apple Computer, Inc.',
      prefix: '',
      randomMajor: () => SOCIALBROWSER.randomNumber(600, 605),
      randomMinor: () => SOCIALBROWSER.randomNumber(1, 15),
      randomPatch: () => SOCIALBROWSER.randomNumber(10, 14),
    },
    {
      name: 'Opera',
      vendor: '',
      prefix: '',
      randomMajor: () => SOCIALBROWSER.randomNumber(133, 136),
      randomMinor: () => SOCIALBROWSER.randomNumber(0, 5735),
      randomPatch: () => SOCIALBROWSER.randomNumber(0, 199),
    },
  ];

  SOCIALBROWSER.getRandomBrowser = function (deviceName = '*', browserName = '*', platformName = '*') {
    let browser = SOCIALBROWSER.userAgentBrowserList.filter((d) => d.name.contains(browserName));
    browser = browser[SOCIALBROWSER.randomNumber(0, browser.length - 1)] || SOCIALBROWSER.userAgentBrowserList[SOCIALBROWSER.randomNumber(0, SOCIALBROWSER.userAgentBrowserList.length - 1)];
    browser = { ...browser };

    let devices = SOCIALBROWSER.userAgentDeviceList.filter((d) => d.name.contains(deviceName));
    browser.device = devices[SOCIALBROWSER.randomNumber(0, devices.length - 1)] || SOCIALBROWSER.userAgentDeviceList[SOCIALBROWSER.randomNumber(0, SOCIALBROWSER.userAgentDeviceList.length - 1)];

    browser.screen = browser.device.screenList[SOCIALBROWSER.randomNumber(0, browser.device.screenList.length - 1)];
    browser.screen = browser.screen.split('*');
    browser.screen = { width: parseInt(browser.screen[0]), height: parseInt(browser.screen[1]) };

    browser.platformInfo = browser.device.platformList.filter((d) => d.name.contains(platformName));
    browser.platformInfo =
      browser.platformInfo[SOCIALBROWSER.randomNumber(0, browser.platformInfo.length - 1)] || browser.device.platformList[SOCIALBROWSER.randomNumber(0, browser.device.platformList.length - 1)];
    browser.platform = browser.platformInfo.code;
    if (browser.device.name === 'Mobile') {
      browser.prefix = 'Mobile';
    }

    browser.major = browser.randomMajor();
    browser.minor = browser.randomMinor();
    browser.patch = browser.randomPatch();

    browser.randomMajor = undefined;
    browser.randomMinor = undefined;
    browser.randomPatch = undefined;

    delete browser.randomMajor;
    delete browser.randomMinor;
    delete browser.randomPatch;

    if (browser.name.contains('Safari')) {
      browser.url = `Mozilla/5.0 (${browser.platformInfo.name}) AppleWebKit/${browser.major}.${browser.minor} (KHTML, like Gecko) Version/${browser.patch}.0 Safari/${browser.major}.${browser.minor}`;
    }
    if (browser.name.contains('Firefox')) {
      browser.url = `Mozilla/5.0 (${browser.platformInfo.name}; rv:${browser.major}.${browser.minor}) Gecko/20100101 Firefox/${browser.major}.${browser.minor}`;
    } else {
      browser.url = `Mozilla/5.0 (${browser.platformInfo.name}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.major}.${browser.minor}.${browser.patch} ${browser.prefix} Safari/537.36`;
    }

    if (browser.name.contains('Edge')) {
      browser.url += ` ${browser.name}/${browser.major}.${browser.minor}.${browser.patch}`;
    }
    return browser;
  };

  SOCIALBROWSER.getRandomUserAgent = function () {
    return SOCIALBROWSER.getRandomBrowser().url;
  };
}

SOCIALBROWSER.generateVPC = function () {
  let browser = SOCIALBROWSER.getRandomBrowser();
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
    mask_date: false,
    timeZone: SOCIALBROWSER.timeZones[SOCIALBROWSER.random(0, SOCIALBROWSER.timeZones.length - 1)],
    hide_webgl: true,
    hide_mimetypes: true,
    hide_plugins: true,
    hide_screen: true,
    screen: {
      width: browser.screen.width,
      height: browser.screen.height,
      availWidth: browser.screen.width,
      availHeight: browser.screen.height,
    },
    set_window_active: true,
    set_tab_active: false,
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
    dnt: true,
    maskUserAgentURL: false,
    hide_fonts: false,
  };
};
SOCIALBROWSER.nativeImage = function (_path) {
  try {
    if (!_path) {
      return null;
    }
    return SOCIALBROWSER.electron.nativeImage.createFromPath(_path);
  } catch (error) {
    SOCIALBROWSER.log('nativeImage', error);
    return null;
  }
};
SOCIALBROWSER.shuffleArray = function (array) {
  let index = -1;
  const length = array.length;
  const lastIndex = length - 1;
  while (++index < length) {
    const rand = random(index, lastIndex);
    [array[index], array[rand]] = [array[rand], array[index]];
  }
  return array;
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

SOCIALBROWSER.__define = function (o, p, v, op) {
  op = op || {};
  if (typeof o == 'undefined') {
    return;
  }
  try {
    Object.defineProperty(o, p, {
      get: function () {
        return v;
      },
      enumerable: op.enumerable || false,
    });
  } catch (error) {
    console.log(error);
  }

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
  return SOCIALBROWSER.ipcSync('[read-file]', path);
};

SOCIALBROWSER.addHTML = SOCIALBROWSER.addhtml = function (code) {
  try {
    let _div = document.createElement('div');
    _div.id = '_div_' + Math.random();
    _div.innerHTML = SOCIALBROWSER.policy.createHTML(code);
    (document.body || document.documentElement).appendChild(_div);
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
SOCIALBROWSER.addJSURL = SOCIALBROWSER.addjs = function (url) {
  try {
    let _script = document.createElement('script');
    _script.id = '_script_' + Math.random();
    _script.src = url;
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
SOCIALBROWSER.addCSSURL = SOCIALBROWSER.addcss = function (url) {
  try {
    let _style = document.createElement('style');
    _style.id = '_style_' + Math.random();
    _style.href = url;
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
SOCIALBROWSER.readCopy = function () {
  return SOCIALBROWSER.electron.clipboard.readText();
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
  let factor = SOCIALBROWSER.webContents.zoomFactor || 1;
  return {
    x: Math.round(rect.left * factor + (el.clientWidth / 4) * factor),
    y: Math.round(rect.top * factor + (el.clientHeight / 4) * factor),
  };
};
SOCIALBROWSER.mouseMoveByPosition = function (x, y) {
  x = Math.floor(x);
  y = Math.floor(y);

  if (x < 1 || y < 1) {
    return;
  }

  SOCIALBROWSER.currentWindow.focus();

  for (let index = 0; index < 200; index++) {
    setTimeout(() => {
      SOCIALBROWSER.webContents.sendInputEvent({
        type: 'mouseMove',
        x: x - 80 + index,
        y: y - 80 + index,
        movementX: x - 80 + index,
        movementY: y - 80 + index,
        globalX: x - 80 + index,
        globalY: y - 80 + index,
      });
      SOCIALBROWSER.webContents.sendInputEvent({
        type: 'mouseEnter',
        x: x - 80 + index,
        y: y - 80 + index,
        movementX: x - 80 + index,
        movementY: y - 80 + index,
        globalX: x - 80 + index,
        globalY: y - 80 + index,
      });
    }, 10 * index);
  }
};

SOCIALBROWSER.clickByPosition = function (x, y, move = true) {
  x = Math.floor(x);
  y = Math.floor(y);
  if (x < 1 || y < 1) {
    return;
  }
  let time = 0;
  if (move) {
    SOCIALBROWSER.mouseMoveByPosition(x, y);
    time = 1000 * 2;
  }
  setTimeout(() => {
    SOCIALBROWSER.currentWindow.focus();

    SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseDown', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
    SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseUp', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
  }, time);
};

SOCIALBROWSER.click = function (selector, realPerson = true, move = true) {
  if (!selector) {
    return;
  }
  let dom = typeof selector === 'string' ? SOCIALBROWSER.$(selector) : selector;
  if (dom) {
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

    if (realPerson && SOCIALBROWSER.currentWindow && SOCIALBROWSER.webContents && SOCIALBROWSER.currentWindow.isVisible()) {
      let offset = SOCIALBROWSER.getOffset(dom);
      SOCIALBROWSER.clickByPosition(offset.x, offset.y, move);
      return dom;
    } else {
      const eventNames = ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click', 'mouseout'];
      eventNames.forEach((eventName) => {
        const event = new MouseEvent(eventName, {
          detail: eventName === 'mouseover' ? 0 : 1,
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: clientX,
          clientY: clientY,
        });
        element.dispatchEvent(event);
      });

      return dom;
    }
  }
};

SOCIALBROWSER.$ = function (selector) {
  return document.querySelector(selector);
};
SOCIALBROWSER.$$ = function (selector) {
  return document.querySelectorAll(selector);
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

SOCIALBROWSER.replaceSelectedText = function (replacementText) {
  let sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(replacementText));
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    range.text = replacementText;
  }
};

SOCIALBROWSER.downloadURL = function (url) {
  SOCIALBROWSER.webContents.downloadURL(url);
};

SOCIALBROWSER.isAllowURL = function (url) {
  if (SOCIALBROWSER.customSetting.blockURLs) {
    if (url.like(SOCIALBROWSER.customSetting.blockURLs)) {
      return false;
    }
  }
  if (SOCIALBROWSER.customSetting.allowURLs) {
    if (url.like(SOCIALBROWSER.customSetting.allowURLs)) {
      return true;
    }
  }

  if (SOCIALBROWSER.var.blocking.white_list?.some((item) => url.like(item.url))) {
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
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

SOCIALBROWSER.handleURL = function (u) {
  if (typeof u !== 'string') {
    return u;
  }
  try {
    u = decodeURI(u);
  } catch (error) {
    u = u;
  }
  u = u.trim();
  if (u.like('*://*')) {
    u = u;
  } else if (u.indexOf('//') === 0) {
    u = window.location.protocol + u;
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

SOCIALBROWSER.openWindow = function (_customSetting) {
  _customSetting.trackingID = 'tacking_' + new Date().getTime().toString();
  SOCIALBROWSER.windowOpenList[_customSetting.trackingID] = { eventList: [] };
  SOCIALBROWSER.windowOpenList[_customSetting.trackingID].on = function (name, callback) {
    SOCIALBROWSER.windowOpenList[_customSetting.trackingID].eventList.push({ name: name, callback: callback });
  };
  _customSetting.windowType = _customSetting.windowType || 'social-popup';

  let customSetting = { ...SOCIALBROWSER.customSetting, ..._customSetting };

  SOCIALBROWSER.on('[tracking-info]', (e, data) => {
    if (data.trackingID == customSetting.trackingID) {
      if (data.windowID) {
        SOCIALBROWSER.windowOpenList[customSetting.trackingID].id = data.windowID;
      }
      if (data.isClosed) {
        SOCIALBROWSER.windowOpenList[customSetting.trackingID].isClosed = data.isClosed;
        SOCIALBROWSER.windowOpenList[customSetting.trackingID].eventList.forEach((e) => {
          if (e.name == 'close' && e.callback) {
            e.callback();
          }
          if (e.name == 'closed' && e.callback) {
            e.callback();
          }
        });
        SOCIALBROWSER.callEvent('window-closed', SOCIALBROWSER.windowOpenList[customSetting.trackingID]);
      }
      if (data.loaded) {
        SOCIALBROWSER.windowOpenList[customSetting.trackingID].eventList.forEach((e) => {
          if (e.name == 'load' && e.callback) {
            e.callback();
          }
        });
        SOCIALBROWSER.callEvent('window-loaded', SOCIALBROWSER.windowOpenList[customSetting.trackingID]);
      }
    }
  });

  SOCIALBROWSER.windowOpenList[customSetting.trackingID].postMessage = function (...args) {
    SOCIALBROWSER.ipc('window.message', { windowID: SOCIALBROWSER.windowOpenList[customSetting.trackingID].id, data: args[0], origin: args[1] || '*', transfer: args[2] });
  };

  SOCIALBROWSER.windowOpenList[customSetting.trackingID].eval = function (code) {
    if (!code) {
      console.log('No Eval Code');
      return;
    }
    if (typeof code !== 'string') {
      code = code.toString();
      code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
    }

    SOCIALBROWSER.sendMessage({
      windowID: SOCIALBROWSER.windowOpenList[customSetting.trackingID].id,
      eval: code,
    });
  };

  SOCIALBROWSER.windowOpenList[customSetting.trackingID].close = function () {
    SOCIALBROWSER.ipc('[browser-message]', { windowID: SOCIALBROWSER.windowOpenList[customSetting.trackingID].id, name: 'close' });
  };

  SOCIALBROWSER.ipc('[open new popup]', customSetting);
  return SOCIALBROWSER.windowOpenList[customSetting.trackingID];
};

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
  if (SOCIALBROWSER.webContents.getPrintersAsync) {
    SOCIALBROWSER.webContents.getPrintersAsync().then((arr0) => {
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
      social_browser_html.innerHTML = SOCIALBROWSER.policy.createHTML(Buffer.from(SOCIALBROWSER.injectHTML).toString());
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
    div.innerHTML = SOCIALBROWSER.policy.createHTML(msg || 'This Page Blocked');
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
      div.innerHTML = SOCIALBROWSER.policy.createHTML(msg);
      showinfoTimeout = setTimeout(() => {
        div.innerHTML = SOCIALBROWSER.policy.createHTML('');
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
        __downloads.innerHTML = SOCIALBROWSER.policy.createHTML('');
      });
    }
  }
  if (msg && __downloads) {
    __downloads.style.display = 'block';
    __downloads.innerHTML = SOCIALBROWSER.policy.createHTML(msg);
  } else if (__downloads) {
    __downloads.style.display = 'none';
    __downloads.innerHTML = SOCIALBROWSER.policy.createHTML('');
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
      SOCIALBROWSER.webContents.stopFindInPage('clearSelection');
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
    SOCIALBROWSER.webContents.findInPage(find_input.value, find_options);
    find_options.findNext = true;
  } else {
    SOCIALBROWSER.webContents.stopFindInPage('clearSelection');
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
