[('SIGTERM', 'SIGHUP', 'SIGINT', 'SIGBREAK')].forEach((signal) => {
  process.on(signal, () => {
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

process.setMaxListeners(100);
require('events').EventEmitter.defaultMaxListeners = 0;
require('events').EventEmitter.prototype._maxListeners = 100;

var child = {
  index: parseInt(process.argv[1].replace('--index=', '')),
  uuid: process.argv[2].replace('--uuid=', ''),
  partition: process.argv[3].replace('--partition=', ''),
  dir: process.argv[4].replace('--dir=', ''),
  data_dir: process.argv[5].replace('--data_dir=', ''),
  speedMode: Boolean(process.argv[6].replace('--speed=', '')),
  theme: process.argv[7].replace('--theme=', ''),
  electron: require('electron'),
  ipcMain: require('electron/main').ipcMain,
  url: require('node:url'),
  path: require('node:path'),
  os: require('node:os'),
  http: require('node:http'),
  https: require('node:https'),
  fs: require('node:fs'),
  api: require('isite')({
    port: [60081],
    name: 'Social API',
    stdin: false,
    apps: false,
    help: false,
    _0x14xo: !0,
    public: true,
    lang: 'en',
    https: {
      enabled: true,
      port: 60043,
    },
    cache: {
      enabled: false,
    },
    mongodb: {
      enabled: false,
      db: 'social-browser-child-db',
      limit: 100000,
      identity: {
        enabled: true,
      },
    },
    session: {
      enabled: false,
    },
    security: {
      enabled: true,
    },
    proto: {
      object: false,
    },
  }),
  child_process: require('node:child_process'),
  WebSocket: require('ws'),
  id: process.pid,
  windowList: [],
  option_list: [],
  assignWindows: [],
  log: (...args) => {
    if (child.parent) {
      console.log(...args);
    }
  },
  cookies: {},
  shared : {},
  startTime: new Date().getTime(),
  getWindow: () => {
    if (child.window && !child.window.isDestroyed()) {
      return child.window;
    }
    return null;
  },
};

//  child.electron.app.commandLine.appendSwitch('in-process-gpu');
// child.electron.app.commandLine.appendSwitch('no-sandbox');
// child.electron.app.disableHardwareAcceleration();

require(child.path.join(child.dir, 'child', 'fn'))(child);
require(child.path.join(child.dir, 'child', 'vars'))(child);
require(child.path.join(child.dir, 'child', 'windows'))(child);
require(child.path.join(child.dir, 'child', 'adsManager'))(child);
require(child.path.join(child.dir, 'child', 'ipc'))(child);
require(child.path.join(child.dir, 'child', 'session'))(child);
require(child.path.join(child.dir, 'child', 'proxy_check'))(child);
// require(child.path.join(child.dir, 'child', 'plugins'))(child);


child.shell = child.electron.shell;
child.dialog = child.electron.dialog;



if (child.theme == 'light') {
  child.electron.nativeTheme.themeSource = 'light';
}else{
  child.electron.nativeTheme.themeSource = 'dark';
}

if (child.uuid == 'user-file') {
  child.log('Files Working ....');
  setInterval(() => {
    if (child.save_var_quee.length > 0) {
      let name = child.save_var_quee.shift();
      child.save_var_quee = child.save_var_quee.filter((s) => s !== name);
      child.save_var(name);
    }
  }, 1000 * 5);
}

// child.electron.app.setAppUserModelId('social.browser');
child.electron.app.clearRecentDocuments();

if (child.electron.app.setUserTasks) {
  child.electron.app.setUserTasks([]);
}
if (child.electron.app.dock) {
  // child.electron.app.dock.hide();
}

//child.electron.app.commandLine.appendSwitch('enable-experimental-web-platform-features');
//child.electron.app.commandLine.appendSwitch('disable-software-rasterizer');
//child.electron.app.commandLine.appendSwitch('enable-webgl');
// child.electron.app.commandLine.appendSwitch('disable-dev-shm-usage');
// child.electron.app.commandLine.appendSwitch('disable-gpu');

//child.electron.app.commandLine.appendSwitch('disable-web-security');
// child.electron.app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
//child.electron.app.commandLine.appendSwitch('disable-site-isolation-trials');
//child.electron.app.commandLine.appendSwitch('enable-features', 'PDFViewerUpdate');

child.mkdirSync(child.path.join(child.data_dir, child.uuid));
child.electron.app.setPath('userData', child.path.join(child.data_dir, child.uuid));
child.electron.protocol.registerSchemesAsPrivileged([
  { scheme: 'child', privileges: { bypassCSP: true, standard: true, secure: true, supportFetchAPI: true, allowServiceWorkers: true, corsEnabled: true, stream: true } },
]);
// child.mkdirSync(child.path.join(child.data_dir, 'sessionData', 'sessionData_' + 'default'));
// child.electron.app.setPath('userData', child.path.join(child.data_dir, 'sessionData', 'sessionData_' + 'default'));
child.electron.app.whenReady().then(() => {
  child.electron.globalShortcut.unregisterAll();
  child.electron.app.setAccessibilitySupportEnabled(false);

  child.electron.protocol.handle('child', (req) => {
    let url = req.url.replace('child://', 'http://127.0.0.1:60080/').replace('/?', '?');
    return child.electron.net.fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });
  });

  // child.electron.app.on('session-created', (session) => {
  //   child.log(`session-created`);
  // });

  child.electron.app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  });
  child.electron.app.on('select-client-certificate', (event, webContents, url, list, callback) => {
    event.preventDefault();
    callback(list[0]);
  });

  child.electron.app.on('web-contents-created', (event, contents) => {
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      webPreferences.nodeIntegration = false;
      delete webPreferences.preloadURL;
      event.preventDefault();
    });
  });

  child.electron.app.on('window-all-closed', (e) => {
    e.preventDefault();
    if (child.partition.contains('persist:') && child.electron.BrowserWindow.getAllWindows().length === 0) {
      child.log('window-all-closed :  process.exit() : ' + child.partition + ' : ' + child.index);
      process.exit();
    }
  });

  child.electron.app.on('login', (event, webContents, details, authInfo, callback) => {
    console.log(authInfo);
    if (authInfo.isProxy) {
      event.preventDefault();
      let proxy = null;

      let index = child.windowList.findIndex((w) => w.id2 == webContents.id && w.customSetting && w.customSetting.proxy);
      if (index !== -1) {
        proxy = child.windowList[index].customSetting.proxy;
        callback(proxy.username, proxy.password);
        child.log(proxy);
        return;
      }

      let index2 = child.parent.var.session_list.findIndex((s) => s.name == webContents.session.name && s.proxy && s.proxy.enabled);
      if (index2 !== -1) {
        proxy = child.parent.var.session_list[index2].proxy;
        callback(proxy.username, proxy.password);
        child.log(proxy);
        return;
      }

      let index3 = child.parent.var.proxy_list.findIndex((p) => p.ip == authInfo.host);
      if (index3 !== -1) {
        proxy = child.parent.var.proxy_list[index3];
        callback(proxy.username, proxy.password);
        child.log(proxy);
        return;
      }
    } else {
      //code here
    }
  });

  child.sendToWindow = function (...args) {
    child.windowList.forEach((w) => {
      if (w.window && !w.window.isDestroyed()) {
        w.window.webContents.send(...args);
      }
    });
  };

  child.sendToWindows = function (...args) {
    child.windowList.forEach((w) => {
      if (w.window && !w.window.isDestroyed() && w.window.webContents && !w.window.webContents.isDestroyed()) {
        w.window.webContents.send(...args);
      }
    });
  };

  child.handleWindowBounds = function () {
    if (child.handleWindowBoundsBusy) {
      return;
    }
    child.handleWindowBoundsBusy = true;

    let mainWindow = child.parent.options.mainWindow;
    let screen = child.parent.options.screen;

    child.windowList.forEach((w) => {
      if (w.customSetting.windowType == 'view' && w.window && !w.window.isDestroyed()) {
        let win = w.window;

        if (mainWindow.hide) {
          win.hide();
          child.isCurrentView = false;
        }

        if (win.isFullScreen()) {
          let width = screen.bounds.width;
          let height = screen.bounds.height;
          win.setBounds({
            x: 0,
            y: 0,
            width: width,
            height: height,
          });
        } else {
          let bounds = mainWindow.bounds;
          let new_bounds = {
            x: mainWindow.isMaximized ? bounds.x + child.offset.x : bounds.x,
            y: mainWindow.isMaximized ? bounds.y + child.offset.y : bounds.y + child.offset.y2,
            width: mainWindow.isMaximized ? bounds.width - child.offset.width : bounds.width - child.offset.width2,
            height: mainWindow.isMaximized ? bounds.height - child.offset.height : bounds.height - child.offset.height2,
          };
          let old_bounds = win.getBounds();
          if (old_bounds.width != new_bounds.width || old_bounds.height != new_bounds.height || old_bounds.y != new_bounds.y || old_bounds.x != new_bounds.x) {
            win.setBounds(new_bounds);
          }
        }
      }
    });

    child.handleWindowBoundsBusy = false;
  };
  require(child.path.join(child.dir, 'child', 'ws'))(child);
  // child.electron.components
  //   .whenReady(() => {

  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     require(child.path.join(child.dir, 'child', 'ws'))(child);
  //   });
});
