(function () {
  'use strict';

  var SOCIALBROWSER = {
    var: {
      core: { id: '', user_agent: '' },
      sites: [],
      session_list: [],
      blocking: { javascript: {}, privacy: {}, youtube: {}, social: {}, popup: { white_list: [] } },
      facebook: {},
      white_list: [],
      black_list: [],
      open_list: [],
      preload_list: [],
      context_menu: { dev_tools: true, inspect: true },
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
    custom_request_header_list: [],
    menu_list: [],
    events: [],
    eventOff: '',
    eventOn: '',
    onEventOFF: [],
    jqueryOff: '',
    jqueryOn: '',
    developerMode: true,
    log: function (...args) {
      if (this.developerMode) {
        console.log(...args);
      }
    },
  };

  SOCIALBROWSER.log(' >>> >>> >>> SocialBrowser Preload : ' + document.location.href)

  SOCIALBROWSER.electron = require('electron');

  SOCIALBROWSER.fs = require('fs');
  SOCIALBROWSER.url = require('url');
  SOCIALBROWSER.path = require('path');
  SOCIALBROWSER.md5 = require('md5');

  SOCIALBROWSER.callSync = function (channel, value) {
    SOCIALBROWSER.log('SOCIALBROWSER.callSync : ' + channel);
    return SOCIALBROWSER.electron.ipcRenderer.sendSync(channel, value);
  };
  SOCIALBROWSER.call = function (channel, value) {
    SOCIALBROWSER.log('SOCIALBROWSER.call : ' + channel);
    return SOCIALBROWSER.electron.ipcRenderer.send(channel, value);
  };
  SOCIALBROWSER.invoke = function (channel, value) {
    SOCIALBROWSER.log('SOCIALBROWSER.invoke : ' + channel);
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
      return null;
    }
  };

  SOCIALBROWSER.currentWindow = SOCIALBROWSER.electron.remote.getCurrentWindow();
  SOCIALBROWSER.partition = SOCIALBROWSER.currentWindow.webContents.getWebPreferences().partition;
  SOCIALBROWSER.timeOffset = new Date().getTimezoneOffset();

  SOCIALBROWSER.guid = function () {
    return SOCIALBROWSER.md5(
      document.location.hostname +
        SOCIALBROWSER.session.name +
        SOCIALBROWSER.session.display +
        SOCIALBROWSER.session.privacy.cpu_count +
        SOCIALBROWSER.session.privacy.memory_count +
        SOCIALBROWSER.session.privacy.languages +
        SOCIALBROWSER.session.privacy.connection.effectiveType +
        SOCIALBROWSER.session.privacy.connection.rtt +
        SOCIALBROWSER.session.privacy.connection.downlink,
    );
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
    if (num > max) {
      num = num - max;
      return SOCIALBROWSER.maxOf(num, max);
    }
    return num;
  };

  let l_name =
    'user_data,user_data_input,sites,youtube,facebook,javascript,context_menu,open_list,preload_list,proxy_list,proxy,popup,core,login,vip,bookmarks,black_list,white_list,session_list,user_agent_list,blocking,video_quality_list';
  if (document.location.href.indexOf('127.0.0.1:60080') !== -1) {
    l_name = '*';
  }

  if (document.location.origin && document.location.origin != 'null') {
    SOCIALBROWSER.invoke('[browser][data]', {
      host: document.location.host,
      url: document.location.href,
      name: l_name,
      win_id: SOCIALBROWSER.currentWindow.id,
      partition: SOCIALBROWSER.partition,
    }).then((result) => {
      SOCIALBROWSER.is_main_data = true;
      SOCIALBROWSER.var = result.var;
      SOCIALBROWSER.files_dir = result.files_dir;
      SOCIALBROWSER.dir = result.dir;
      (SOCIALBROWSER.custom_request_header_list = result.custom_request_header_list), (SOCIALBROWSER.injectHTML = result.injectHTML);
      SOCIALBROWSER.windows = result.windows;
      (SOCIALBROWSER.windowSetting = result.windowSetting), (SOCIALBROWSER.session = result.session ? Object.assign(SOCIALBROWSER.session, result.session) : SOCIALBROWSER.session);

      require(SOCIALBROWSER.files_dir + '/js/context-menu/init.js')(SOCIALBROWSER);
      require(SOCIALBROWSER.files_dir + '/js/context-menu/load.js')(SOCIALBROWSER);
    });
  } else {
    return;
    SOCIALBROWSER.files_dir = SOCIALBROWSER.callSync('get_browser', {
      name: 'files_dir',
    });
    SOCIALBROWSER.dir = SOCIALBROWSER.callSync('get_browser', {
      name: 'dir',
    });
    require(SOCIALBROWSER.files_dir + '/js/context-menu/init.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/load.js')(SOCIALBROWSER);
  }

  window.SOCIALBROWSER = SOCIALBROWSER;
})();
