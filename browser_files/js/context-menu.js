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
    random: function (min, max) {
      max = max + 1;
      return Math.floor(Math.random() * (max - min) + min);
    },
    var: {
      core: { id: '', user_agent: '' },
      overwrite: {
        urls: [],
      },
      sites: [],
      session_list: [],
      blocking: {
        javascript: {},
        privacy: { languages: 'en', connection: {}, hide_permissions: true },
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
      { name: '', value: '' },
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
      privacy: { languages: 'en', connection: {}, hide_permissions: true },
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
    'scripts_files,user_data,user_data_input,sites,preload_list,ad_list,proxy_list,proxy,core,bookmarks,session_list,user_agent_list,blocking,video_quality_list,customHeaderList';
  if (SOCIALBROWSER.href.indexOf('127.0.0.1:60080') !== -1 || SOCIALBROWSER.href.indexOf('file://') == 0 || SOCIALBROWSER.href.indexOf('browser://') == 0) {
    SOCIALBROWSER.selected_properties = '*';
  }

  SOCIALBROWSER.callSync = SOCIALBROWSER.ipcSync = function (channel, value) {
    value.parentSetting = SOCIALBROWSER.customSetting;
    return SOCIALBROWSER.electron.ipcRenderer.sendSync(channel, value);
  };
  SOCIALBROWSER.call = SOCIALBROWSER.ipc = function (channel, value) {
    if (!channel) {
      return;
    }
    value = value || {};
    value.parentSetting = SOCIALBROWSER.customSetting;
    return SOCIALBROWSER.electron.ipcRenderer.send(channel, value);
  };
  SOCIALBROWSER.invoke = function (channel, value) {
    value.parentSetting = SOCIALBROWSER.customSetting;
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

  SOCIALBROWSER.init2 = function () {
    SOCIALBROWSER.is_main_data = true;
    SOCIALBROWSER.child_id = SOCIALBROWSER.browserData.child_id;
    SOCIALBROWSER.child_index = SOCIALBROWSER.browserData.child_index;
    SOCIALBROWSER.customSetting = SOCIALBROWSER.browserData.customSetting;
    SOCIALBROWSER.var = SOCIALBROWSER.browserData.var;
    SOCIALBROWSER.files_dir = SOCIALBROWSER.browserData.files_dir;
    SOCIALBROWSER.dir = SOCIALBROWSER.browserData.dir;
    SOCIALBROWSER.injectHTML = SOCIALBROWSER.browserData.injectHTML;
    SOCIALBROWSER.injectCSS = SOCIALBROWSER.browserData.injectCSS;
    SOCIALBROWSER.windows = SOCIALBROWSER.browserData.windows;
    SOCIALBROWSER.newTabData = SOCIALBROWSER.browserData.newTabData;
    SOCIALBROWSER.session = { ...SOCIALBROWSER.session, ...SOCIALBROWSER.browserData.session };
    SOCIALBROWSER.partition = SOCIALBROWSER.browserData.partition;
    if (!SOCIALBROWSER.partition && SOCIALBROWSER.isMemoryMode) {
      SOCIALBROWSER.partition = 'x-ghost';
    }
    if (!SOCIALBROWSER.session.privacy.enable_virtual_pc && SOCIALBROWSER.var.blocking.privacy.enable_virtual_pc) {
      SOCIALBROWSER.session.privacy.enable_virtual_pc = true;
      SOCIALBROWSER.session.privacy.vpc = SOCIALBROWSER.var.blocking.privacy.vpc;
    }
    require(SOCIALBROWSER.files_dir + '/js/context-menu/init.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/event.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/fn.js')(SOCIALBROWSER);

    if (SOCIALBROWSER.var.core.id.like('*test*')) {
      SOCIALBROWSER.developerMode = true;
    }
    SOCIALBROWSER.log(` ... ${document.location.href} ... `);
    if (SOCIALBROWSER.sessionId() == 0) {
      SOCIALBROWSER.session.privacy.enable_virtual_pc = true;
      SOCIALBROWSER.session.privacy.vpc = SOCIALBROWSER.get('vpc') || SOCIALBROWSER.generateVPC();
      SOCIALBROWSER.set('vpc', SOCIALBROWSER.session.privacy.vpc);
    }
    require(SOCIALBROWSER.files_dir + '/js/context-menu/load.js')(SOCIALBROWSER);
    window.SOCIALBROWSER = SOCIALBROWSER;
  };

  SOCIALBROWSER.init = function () {
    if (true || SOCIALBROWSER.isIframe()) {
      SOCIALBROWSER.invoke('[browser][data]', {
        hostname: SOCIALBROWSER.hostname,
        url: SOCIALBROWSER.href,
        name: SOCIALBROWSER.selected_properties,
        win_id: SOCIALBROWSER.currentWindow.id,
        partition: SOCIALBROWSER.partition,
      }).then((data) => {
        SOCIALBROWSER.browserData = data;
        SOCIALBROWSER.init2();
      });
    } else {
      SOCIALBROWSER.browserData = SOCIALBROWSER.ipcSync('[browser][data]', {
        hostname: SOCIALBROWSER.hostname,
        url: SOCIALBROWSER.href,
        name: SOCIALBROWSER.selected_properties,
        win_id: SOCIALBROWSER.currentWindow.id,
        partition: SOCIALBROWSER.partition,
      });
      SOCIALBROWSER.init2();
    }
  };

  SOCIALBROWSER.init();

  window.SOCIALBROWSER = SOCIALBROWSER;
})();
