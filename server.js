(function init() {
  [('SIGTERM', 'SIGHUP', 'SIGINT', 'SIGBREAK')].forEach((signal) => {
    process.on(signal, () => {
      console.log('Request signal :: ' + signal);
      process.exit(1);
    });
  });

  process.on('uncaughtException', function (error) {
    console.error(error, 'Uncaught Exception thrown');
  });

  process.on('uncaughtRejection', function (error) {
    console.error(error, 'Uncaught Rejection thrown');
  });

  process.on('unhandledRejection', function (error, promise) {
    console.error(error, 'Unhandled Rejection thrown');
  });

  process.on('multipleResolves', (type, promise, reason) => {
    console.error(type, promise, reason);
  });

  process.on('warning', (warning) => {
    console.warn(warning.stack);
  });

  console.log(' [ App Start ] [ * ] ');

  if (process.argv[process.argv.length - 1].endsWith('child.js')) {
    console.log(' [ App Start ] [ child ] ');
    require(__dirname + '/child/child.js');
    return;
  } else if (process.argv[process.argv.length - 1].endsWith('.js')) {
    console.log(' [ App Start ] [ js ] ');
    require(process.argv[process.argv.length - 1]);
    return;
  }
  process.setMaxListeners(0);
  console.log(' [ New Parent Created ] ');
  var browser = {
    speedMode: false,
    electron: require('electron'),
    remoteMain: require('@electron/remote/main'),
    http: require('node:http'),
    https: require('node:https'),
    path: require('node:path'),
    os: require('node:os'),
    url: require('node:url'),
    fs: require('node:fs'),
    md5: require('md5'),
    child_process: require('node:child_process'),
    WebSocket: require('ws'),
    package: require('./package.json'),
    id: process.pid,
    windowList: [],
    files: [],
    var: {
      core: { id: '' },
      overwrite: {
        urls: [],
      },
      sites: [],
      session_list: [],
      blocking: { javascript: {}, privacy: {}, youtube: {}, social: {}, popup: { white_list: [] } },
      facebook: {},
      white_list: [],
      black_list: [],
      open_list: [],
      preload_list: [],
      context_menu: { dev_tools: true, inspect: true },
      customHeaderList: [],
    },
    varRaw: {},
    content_list: [],
    log: (...args) => {
      console.log(...args);
    },
    startTime: new Date().getTime(),
  };
  browser.fetchAsync = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
  browser.fetch = function (...args) {
    args[1] = args[1] || {};
    args[1].agent = function (_parsedURL) {
      if (_parsedURL.protocol == 'http:') {
        return new browser.http.Agent({
          keepAlive: true,
        });
      } else {
        return new browser.https.Agent({
          keepAlive: true,
        });
      }
    };
    return browser.fetchAsync(...args);
  };

  const is_first_app = browser.electron.app.requestSingleInstanceLock();
  if (!is_first_app) {
    let f = process.argv[process.argv.length - 1]; // LAST arg is file to run
    if (f.endsWith('.js')) {
      console.log('Run JS File And Return App >>>>>>>>>>>>>>>>>>>>>> ');
    } else {
      console.warn('App Will Close & open in first instance');
      browser.electron.app.quit();
    }
    return;
  }

  
  browser.electron.app.clearRecentDocuments();
  // browser.electron.app.commandLine.appendSwitch('no-sandbox');
  // browser.electron.app.commandLine.appendSwitch('in-process-gpu');
  browser.electron.app.disableHardwareAcceleration();


  browser.dir = process.resourcesPath + '/app.asar';
  if (!browser.fs.existsSync(browser.dir)) {
    browser.dir = process.cwd();
  }
  browser.files_dir = browser.dir + '/browser_files';
  if (process.cwd().indexOf('-portal') !== -1) {
    browser.isPortalMode = true;
    browser.data_dir = browser.path.join(process.cwd(), 'social-data');
  } else if (process.cwd().indexOf('-accounts') !== -1 || process.cwd().indexOf('-users') !== -1) {
    browser.isAccountsMode = true;
    browser.data_dir = browser.path.join(process.cwd(), 'social-data');
  } else {
    browser.data_dir = browser.path.join(browser.os.homedir(), 'social-data');
  }

  if (process.argv.some((x) => x == '--auto-startup')) {
    browser.isAutoStartup = true;
  }

  browser.Partitions_data_dir = browser.path.join(browser.data_dir, 'default', 'Partitions');
  browser.electron.app.setPath('userData', browser.path.join(browser.data_dir, 'default'));
  require(browser.path.join(browser.dir, '/parent/parent.js'))(browser);

  browser.remoteMain.initialize();

  browser.electron.app.setAppUserModelId('Social.Browser');
  browser.electron.Menu.setApplicationMenu(null);
  browser.electron.app.setAsDefaultProtocolClient('browser');

  if (browser.electron.app.setUserTasks) {
    browser.electron.app.setUserTasks([]);
  }

  if (browser.electron.app.dock) {
    browser.electron.app.dock.hide();
  }

  browser.electron.protocol.registerSchemesAsPrivileged([
    { scheme: 'browser', privileges: { bypassCSP: true, standard: true, secure: true, supportFetchAPI: true, allowServiceWorkers: true, corsEnabled: true, stream: true } },
  ]);

  browser.electron.app.on('open-url', function (event, url) {
    event.preventDefault();
    browser.createChildProcess({
      url: url,
      windowType: 'popup',
      partition: browser.var.core.session.name,
    });
  });

  /* App Ready */
  browser.electron.app.whenReady().then(() => {
    browser.webContent = browser.electron.webContents.create({
      contextIsolation: false,
    });
    browser.electron.protocol.handle('browser', (req) => {
      let url = req.url.replace('browser://', 'http://127.0.0.1:60080/').replace('/?', '?');
      return browser.electron.net.fetch(url, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });
    });
    if (!browser.electron.app.isDefaultProtocolClient('browser')) {
      browser.electron.app.setAsDefaultProtocolClient('browser');
    }
    // browser.webContentList = [];
    // for (let index = 0; index < 100; index++) {
    //   browser.webContentList.push(
    //     browser.electron.webContents.create({
    //       contextIsolation: false,
    //     }),
    //   );
    //   browser.webContentList[index].loadURL('https://google.com')
    // }
    // console.log(browser.webContentList.length);
    browser.electron.app.setAccessibilitySupportEnabled(true);
    if (!browser.var.core.id.like('*developer*')) {
      browser.electron.app.setLoginItemSettings({
        openAtLogin: true,
        args: ['--auto-startup'],
        path: process.execPath,
      });
    }

    browser.electron.globalShortcut.unregisterAll();
    // browser.setupTray();

    browser.electron.app.on('network-connected', () => {
      browser.log('network-connected');
    });

    browser.electron.app.on('network-disconnected', () => {
      browser.log('network-disconnected');
    });

    // browser.var.session_list.forEach((s1) => {
    //   let s2 = '__cookies_' + s1.name.replace(':', '_list');
    //   if (browser.var[s2].length === 0) {
    //     browser.cookies[s1.name] = browser.cookies[s1.name] || [];
    //     let ss = browser.electron.session.fromPartition(s1.name);
    //     ss.cookies.get({}).then((cookies) => {
    //       cookies.forEach((cookie) => {
    //         browser.cookies[s1.name].push(cookie);
    //       });
    //       console.log('load cookies ' + s1.name + ' : ' + browser.cookies[s1.name].length);
    //       browser.set_var('__cookies_' + s1.name.replace(':', '_list'), browser.cookies[s1.name]);
    //     });
    //   }
    // });
  });
  browser.electron.app.on('second-instance', (event, commandLine, workingDirectory) => {
    browser.log('second-instance', commandLine);

    let url = commandLine.pop();

    if (!url || url.like('*--*') || url == '.') {
      url = browser.var.core.home_page;
    }

    if (url.like('*.js')) {
      require(url);
      return;
    }

    if (url && !url.like('http*') && !url.like('file*') && !url.like('browser*')) {
      url = 'file://' + url;
    }

    if (url.like('browser*')) {
      url = url.replace('browser://', 'http://127.0.0.1:60080/');
      if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
      }
    }

    let partition = browser.var.core.session.partition;
    let user_name = browser.var.core.session.user_name;

    browser.newTabData = {
      name: '[open new tab]',
      icon: 'browser://images/logo.png',
      url: url,
      partition: partition,
      user_name: user_name,
      active: true,
    };

    browser.createChildProcess({
      url: 'http://127.0.0.1:60080/home',
      windowType: 'main',
      partition: 'persist:social',
      showDevTools: false,
    });
  });

  if (browser.isAutoStartup) {
    browser.createChildProcess({
      url: 'https://www.google.com',
      windowType: 'none',
      partition: 'persist:social',
    });
  } else {
    // browser.createChildProcess({
    //   url: 'https://www.google.com',
    //   windowType: 'popup',
    //   partition: 'google',
    //   show: true,
    // });
    browser.createChildProcess({
      url: 'http://127.0.0.1:60080/home',
      windowType: 'main',
      partition: 'persist:social',
      showDevTools: false,
    });
  }

  setTimeout(() => {
    browser.createChildProcess({
      windowType: 'files',
      partition: 'persist:file',
    });
  }, 1000 * 3);
})();
