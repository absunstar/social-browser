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

  let __numberRange = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  var SOCIALBROWSER = {
    var: {
      core: { id: '', user_agent: '' },
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
      custom_request_header_list: [],
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
  SOCIALBROWSER.md5 = SOCIALBROWSER.require('md5');

  SOCIALBROWSER.callSync = function (channel, value) {
    value.options = SOCIALBROWSER.options;
    return SOCIALBROWSER.electron.ipcRenderer.sendSync(channel, value);
  };
  SOCIALBROWSER.call = function (channel, value) {
    if (!channel) {
      return;
    }
    value = value || {};
    value.options = SOCIALBROWSER.options;
    return SOCIALBROWSER.electron.ipcRenderer.send(channel, value);
  };
  SOCIALBROWSER.invoke = function (channel, value) {
    value.options = SOCIALBROWSER.options;
    return SOCIALBROWSER.electron.ipcRenderer.invoke(channel, value);
  };
  SOCIALBROWSER.on = function (name, callback) {
    return SOCIALBROWSER.electron.ipcRenderer.on(name, callback);
  };

  SOCIALBROWSER.fetchJson = function (options, callback) {
    callback = callback || function () {};
    options.id = new Date().getTime() + Math.random();
    SOCIALBROWSER.on('[fetch][json][data]', (e, res) => {
      if (res.options.id == options.id) {
        callback(res.data);
      }
    });
    SOCIALBROWSER.call('[fetch][json]', options);
  };

  SOCIALBROWSER.nativeImage = function (_path) {
    try {
      if (!_path) {
        return null;
      }
      return SOCIALBROWSER.electron.nativeImage.createFromPath(_path).resize({
        width: 16,
        height: 16,
      });
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

  SOCIALBROWSER.currentWindow = SOCIALBROWSER.remote.getCurrentWindow();
  SOCIALBROWSER.webContents = SOCIALBROWSER.currentWindow.webContents;
  if (SOCIALBROWSER.currentWindow.$setting) {
    SOCIALBROWSER.webPreferences = SOCIALBROWSER.currentWindow.$setting.webPreferences;
    SOCIALBROWSER.partition = SOCIALBROWSER.webPreferences.partition;
  } else {
    SOCIALBROWSER.webPreferences = SOCIALBROWSER.webContents.getLastWebPreferences();
    SOCIALBROWSER.partition = SOCIALBROWSER.webPreferences.partition;
  }

  SOCIALBROWSER.timeOffset = new Date().getTimezoneOffset();

  SOCIALBROWSER.guid = function () {
    return SOCIALBROWSER.md5(SOCIALBROWSER.session.name + document.location.hostname + SOCIALBROWSER.var.core.id);
  };

  SOCIALBROWSER.session_id = 0;
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

  SOCIALBROWSER.maxOf = function (num, max) {
    if (num == 0) {
      num = __numberRange(0, max);
    }
    if (num > max) {
      num = num - max;
      return SOCIALBROWSER.maxOf(num, max);
    }
    return num;
  };

  SOCIALBROWSER.isIframe = function () {
    // return !process.isMainFrame;
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
    'scripts_files,user_data,user_data_input,sites,facebook,context_menu,open_list,preload_list,proxy_list,proxy,core,login,vip,bookmarks,black_list,white_list,session_list,user_agent_list,blocking,video_quality_list,custom_request_header_list';
  if (SOCIALBROWSER.href.indexOf('127.0.0.1:60080') !== -1 || SOCIALBROWSER.href.indexOf('file://') == 0 || SOCIALBROWSER.href.indexOf('browser://') == 0) {
    SOCIALBROWSER.selected_properties = '*';
  }

  SOCIALBROWSER.init = function () {
    SOCIALBROWSER.invoke('[browser][data]', {
      hostname: SOCIALBROWSER.hostname,
      url: SOCIALBROWSER.href,
      name: SOCIALBROWSER.selected_properties,
      win_id: SOCIALBROWSER.currentWindow.id,
      partition: SOCIALBROWSER.partition,
    }).then((result) => {
      SOCIALBROWSER.browserData = result;
      SOCIALBROWSER.is_main_data = true;
      SOCIALBROWSER.child_id = result.child_id;
      SOCIALBROWSER.child_index = result.child_index;
      SOCIALBROWSER.options = result.options;
      SOCIALBROWSER.var = result.var;
      SOCIALBROWSER.files_dir = result.files_dir;
      SOCIALBROWSER.dir = result.dir;
      SOCIALBROWSER.injectHTML = result.injectHTML;
      SOCIALBROWSER.windows = result.windows;
      SOCIALBROWSER.windowSetting = result.windowSetting;
      SOCIALBROWSER.windowType = result.windowType;
      SOCIALBROWSER.newTabData = result.newTabData;
      SOCIALBROWSER.session = { ...SOCIALBROWSER.session, ...result.session };

      require(SOCIALBROWSER.files_dir + '/js/context-menu/init.js')(SOCIALBROWSER);
      require(SOCIALBROWSER.files_dir + '/js/context-menu/event.js')(SOCIALBROWSER);

      if (!SOCIALBROWSER.var.core.id.like('*test*')) {
        SOCIALBROWSER.developerMode = false;
      }

      if (SOCIALBROWSER.sessionId() == 0) {
        SOCIALBROWSER.session.privacy = {
          enable_finger_protect: true,
          hide_memory: true,
          memory_count: __numberRange(1, 128),
          hide_cpu: true,
          cpu_count: __numberRange(1, 128),
          hide_vega: true,
          hide_mimetypes: true,
          hide_plugins: true,
          hide_screen: true,
          screen_width: __numberRange(800, 1080),
          screen_height: __numberRange(720, 1080),
          screen_availWidth: __numberRange(800, 1080),
          screen_availHeight: __numberRange(720, 1080),
          hide_lang: true,
          languages: 'abcdefghijklmnopqrstuvwxyz'[__numberRange(0, 27)] + 'abcdefghijklmnopqrstuvwxyz'[__numberRange(0, 27)],
          set_window_active: true,
          block_rtc: true,
          hide_battery: true,
          hide_media_devices: true,
          mask_date: true,
          date_offset: __numberRange(-300, 300),
          connection: {
            downlink: __numberRange(1, 20) / 10,
            effectiveType: '4g',
            rtt: __numberRange(300, 900),
            type: SOCIALBROWSER.connectionTypeList[__numberRange(1, SOCIALBROWSER.connectionTypeList.length - 1)].name,
          },
        };
      }

      require(SOCIALBROWSER.files_dir + '/js/context-menu/load.js')(SOCIALBROWSER);
      window.SOCIALBROWSER = SOCIALBROWSER;
    });
  };

  SOCIALBROWSER.on('[update-browser-var]', (e, res) => {
    if (res.options.name.contains('user_data')) {
      return;
    }

    SOCIALBROWSER.var[res.options.name] = res.options.data;
    if (SOCIALBROWSER.onVarUpdated) {
      SOCIALBROWSER.onVarUpdated(res.options.name, res.options.data);
    }
    if (res.options.name == 'session_list') {
      SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));
    }
    SOCIALBROWSER.callEvent('updated', { name: res.options.name });
  });
  window.SOCIALBROWSER = SOCIALBROWSER;
  // SOCIALBROWSER.electron.contextBridge.exposeInMainWorld('$$$$$', SOCIALBROWSER);

  SOCIALBROWSER.init();
})();
