(function () {
  console.clear = function () {};

  if (
    document.location.href.indexOf('about:') === 0 ||
    document.location.href.indexOf('blob') === 0 ||
    document.location.href.indexOf('chrome-error') === 0 ||
    document.location.href.indexOf('https://stream.') === 0
  ) {
    return;
  }

  var SOCIALBROWSER = {
    module: require('module'),
    path: require('path'),
    random: function (min = 1, max = 1000) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    var: {
      core: { id: '' },
      overwrite: {
        urls: [],
      },
      sites: [],
      session_list: [],
      blocking: {
        javascript: {},
        privacy: { languages: 'en', connection: {} },
        youtube: {},
        social: {},
        popup: { white_list: [] },
      },
      facebook: {},
      white_list: [],
      black_list: [],
      open_list: [],
      preload_list: [],
      context_menu: { dev_tools: true, inspect: true },
      customHeaderList: [],
    },
    navigator: {
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      languages: navigator.languages,
      connection: navigator.connection,
      MaxTouchPoints: navigator.MaxTouchPoints,
    },
    screen: window.screen,
    connectionTypeList: [
      { name: 'wifi', value: 'wifi' },
      { name: 'wifi', value: 'wifi' },
      { name: 'ethernet', value: 'ethernet' },
      { name: 'mixed', value: 'mixed' },
      { name: 'bluetooth', value: 'bluetooth' },
      { name: 'other', value: 'other' },
      { name: 'unknown', value: 'unknown' },
      { name: 'wimax', value: 'wimax' },
      { name: 'cellular', value: 'cellular' },
    ],
    effectiveTypeList: ['slow-2g', '2g', '3g', '4g'],
    session: {
      privacy: { languages: 'en', connection: {} },
    },
    menu_list: [],
    events: [],
    eventOff: '',
    eventOn: '',
    onEventOFF: [],
    jqueryOff: '',
    jqueryOn: '',
    developerMode: false,
    log: function (...args) {
      if (this.developerMode) {
        console.log(...args);
      }
    },
  };

  SOCIALBROWSER.electron = require('electron');

  SOCIALBROWSER.remote = require('@electron/remote');
  SOCIALBROWSER.require = require;

  SOCIALBROWSER.url = SOCIALBROWSER.require('url');
  SOCIALBROWSER.path = SOCIALBROWSER.require('path');
  SOCIALBROWSER.md5 = SOCIALBROWSER.require('md5');
  SOCIALBROWSER.fs = SOCIALBROWSER.require('fs');
  SOCIALBROWSER.Buffer = Buffer;

  SOCIALBROWSER.eval = function (script) {
    try {
      let path = SOCIALBROWSER.data_dir + '\\sessionData\\' + new Date().getTime() + '_tmp.js';
      SOCIALBROWSER.fs.writeFileSync(path, script);
      SOCIALBROWSER.require(path);
      setTimeout(() => {
        SOCIALBROWSER.fs.unlinkSync(path);
      }, 1000 * 3);
    } catch (error) {
      console.log(error);
    }
  };

  SOCIALBROWSER.currentWindow = SOCIALBROWSER.remote.getCurrentWindow();
  SOCIALBROWSER.webContents = SOCIALBROWSER.currentWindow.webContents;

  if (SOCIALBROWSER.currentWindow.customSetting && SOCIALBROWSER.currentWindow.customSetting.webPreferences) {
    SOCIALBROWSER.webPreferences = SOCIALBROWSER.currentWindow.customSetting.webPreferences;
    SOCIALBROWSER.partition = SOCIALBROWSER.webPreferences.partition;
  } else {
    SOCIALBROWSER.webPreferences = SOCIALBROWSER.webContents.getLastWebPreferences();
    SOCIALBROWSER.partition = SOCIALBROWSER.webContents.session.storagePath ? 'persist:' + SOCIALBROWSER.webContents.session.storagePath.split('\\').pop() : null;
    SOCIALBROWSER.webPreferences = { ...SOCIALBROWSER.webPreferences, ...{ partition: SOCIALBROWSER.partition } };
  }

  SOCIALBROWSER.isMemoryMode = !SOCIALBROWSER.webContents.session.isPersistent();
  SOCIALBROWSER.session_id = 0;

  SOCIALBROWSER.isIframe = function () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  SOCIALBROWSER.origin = document.location.origin;
  if (!SOCIALBROWSER.origin || SOCIALBROWSER.origin == 'null') {
    SOCIALBROWSER.origin = document.location.hostname;
  }
  SOCIALBROWSER.hostname = document.location.hostname;
  SOCIALBROWSER.href = document.location.href;

  SOCIALBROWSER.selected_properties =
    'scripts_files,user_data,user_data_input,sites,preload_list,ad_list,proxy_list,proxy,core,bookmarks,session_list,userAgentList,blocking,video_quality_list,customHeaderList';
  if (SOCIALBROWSER.href.indexOf('http://127.0.0.1:60080') == 0 || SOCIALBROWSER.href.indexOf('file://') == 0 || SOCIALBROWSER.href.indexOf('browser://') == 0) {
    SOCIALBROWSER.selected_properties = '*';
  }

  SOCIALBROWSER.callSync = SOCIALBROWSER.ipcSync = function (channel, value = {}) {
    value.parentSetting = SOCIALBROWSER.customSetting;
    if (channel == '[open new popup]' || channel == '[open new tab]') {
      value.referrer = value.referrer || document.location.href;
    }
    return SOCIALBROWSER.electron.ipcRenderer.sendSync(channel, value);
  };

  SOCIALBROWSER.invoke = SOCIALBROWSER.ipc = function (channel, value = {}) {
    value.parentSetting = SOCIALBROWSER.customSetting;
    if (channel == '[open new popup]' || channel == '[open new tab]') {
      value.referrer = value.referrer || document.location.href;
    }
    return SOCIALBROWSER.electron.ipcRenderer.invoke(channel, value);
  };
  SOCIALBROWSER.on = function (name, callback) {
    return SOCIALBROWSER.electron.ipcRenderer.on(name, callback);
  };

  SOCIALBROWSER.set = function (key, value) {
    if (!key || typeof value === 'undefined') {
      return false;
    }
    value = JSON.stringify(value);
    if (!SOCIALBROWSER.isMemoryMode) {
      window.localStorage.setItem(key, value);
      return true;
    } else if (window.sessionStorage) {
      window.sessionStorage.setItem(key, value);
      return true;
    }
    return false;
  };
  SOCIALBROWSER.get = function (key) {
    if (!key) {
      return null;
    }
    let value = null;
    if (!SOCIALBROWSER.isMemoryMode) {
      value = window.localStorage.getItem(key);
    } else if (window.sessionStorage) {
      value = window.sessionStorage.getItem(key);
    }
    if (value) {
      value = JSON.parse(value);
    }
    return value;
  };

  SOCIALBROWSER.remove = function (key) {
    if (!key) {
      return false;
    }
    if (!SOCIALBROWSER.isMemoryMode) {
      if (key == '*') {
        window.localStorage.clear();
      } else {
        window.localStorage.removeItem(key);
      }

      return true;
    } else if (window.sessionStorage) {
      if (key == '*') {
        window.sessionStorage.clear();
      } else {
        window.sessionStorage.removeItem(key);
      }
      return true;
    }
    return false;
  };

  SOCIALBROWSER.requireFromString = function (code, filename, opts) {
    if (typeof code !== 'string') {
      console.log('code must be a string, not ' + typeof code);
    }

    if (typeof filename === 'object') {
      opts = filename;
      filename = undefined;
    }

    opts = opts || {};
    filename = filename || '';

    opts.appendPaths = opts.appendPaths || [];
    opts.prependPaths = opts.prependPaths || [];

    var paths = SOCIALBROWSER.module._nodeModulePaths(path.dirname(filename));

    var parent = module.main;
    var m = new SOCIALBROWSER.module(filename, parent);
    m.filename = filename;
    m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths);
    m._compile(code, filename);

    var exports = m.exports;
    parent && parent.children && parent.children.splice(parent.children.indexOf(m), 1);

    return exports;
  };

  SOCIALBROWSER.init2 = function () {
    SOCIALBROWSER.is_main_data = true;
    SOCIALBROWSER.childProcessID = SOCIALBROWSER.browserData.childProcessID;
    SOCIALBROWSER.child_index = SOCIALBROWSER.browserData.child_index;
    SOCIALBROWSER.customSetting = SOCIALBROWSER.browserData.customSetting;
    SOCIALBROWSER.var = SOCIALBROWSER.browserData.var;
    SOCIALBROWSER.dir = SOCIALBROWSER.browserData.dir;
    SOCIALBROWSER.data_dir = SOCIALBROWSER.browserData.data_dir;
    SOCIALBROWSER.files_dir = SOCIALBROWSER.browserData.files_dir;
    SOCIALBROWSER.injectHTML = SOCIALBROWSER.browserData.injectHTML;
    SOCIALBROWSER.injectCSS = SOCIALBROWSER.browserData.injectCSS;
    SOCIALBROWSER.parentAssignWindow = SOCIALBROWSER.browserData.parentAssignWindow;
    SOCIALBROWSER.newTabData = SOCIALBROWSER.browserData.newTabData;
    SOCIALBROWSER.session = { ...SOCIALBROWSER.session, ...SOCIALBROWSER.browserData.session };
    SOCIALBROWSER.partition = SOCIALBROWSER.browserData.partition;
    if (!SOCIALBROWSER.partition && SOCIALBROWSER.isMemoryMode) {
      SOCIALBROWSER.partition = 'x-ghost';
    }
    if (!SOCIALBROWSER.session.privacy.enable_virtual_pc && SOCIALBROWSER.var.blocking.privacy.enable_virtual_pc) {
      SOCIALBROWSER.session.privacy.enable_virtual_pc = true;
      SOCIALBROWSER.session.privacy.vpc = { ...SOCIALBROWSER.var.blocking.privacy.vpc };
    }

    require(SOCIALBROWSER.files_dir + '/js/context-menu/init.js');
    require(SOCIALBROWSER.files_dir + '/js/context-menu/event.js');
    require(SOCIALBROWSER.files_dir + '/js/context-menu/fn.js');

    SOCIALBROWSER.isWhiteSite = SOCIALBROWSER.var.blocking.white_list.some((site) => site.url.length > 2 && document.location.href.like(site.url));

    if (SOCIALBROWSER.var.core.id.like('*developer*')) {
      SOCIALBROWSER.developerMode = true;
    }
    SOCIALBROWSER.log(` ... ${document.location.href} ... `);
    if (SOCIALBROWSER.sessionId() == 0) {
      SOCIALBROWSER.session.privacy.enable_virtual_pc = true;
      SOCIALBROWSER.session.privacy.vpc = SOCIALBROWSER.get('vpc') || SOCIALBROWSER.generateVPC();
      SOCIALBROWSER.set('vpc', SOCIALBROWSER.session.privacy.vpc);
    }

    require(SOCIALBROWSER.files_dir + '/js/context-menu/load.js');
    if (!SOCIALBROWSER.customSetting.allowSocialBrowser) {
      delete window.SOCIALBROWSER;
    }
  };

  SOCIALBROWSER.init = function () {
    SOCIALBROWSER.currentWindow = SOCIALBROWSER.remote.getCurrentWindow();
    SOCIALBROWSER.webContents = SOCIALBROWSER.currentWindow.webContents;

    SOCIALBROWSER.ipc('[browser][data]', {
      hostname: SOCIALBROWSER.hostname,
      url: SOCIALBROWSER.href,
      name: SOCIALBROWSER.selected_properties,
      windowID: SOCIALBROWSER.remote.getCurrentWindow().id,
      partition: SOCIALBROWSER.partition,
    }).then((data) => {
      SOCIALBROWSER.browserData = data;
      SOCIALBROWSER.init2();
    });
  };
  window.SOCIALBROWSER = SOCIALBROWSER;
  SOCIALBROWSER.init();
})();
