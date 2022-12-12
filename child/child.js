const { parse } = require('path');

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

process.setMaxListeners(0);

var child = {
  index: parseInt(process.argv[1].replace('--index=', '')),
  uuid: process.argv[2].replace('--uuid=', ''),
  dir: process.argv[3].replace('--dir=', ''),
  data_dir: process.argv[4].replace('--data_dir=', ''),
  speedMode: Boolean(process.argv[5].replace('--speed=', '')),
  electron: require('electron'),
  remoteMain: require('@electron/remote/main'),
  fetch: require('node-fetch'),
  url: require('url'),
  path: require('path'),
  os: require('os'),
  http: require('http'),
  https: require('https'),
  fs: require('fs'),
  md5: require('md5'),
  child_process: require('child_process'),
  WebSocket: require('ws'),
  id: process.pid,
  windowList: [],
  option_list: [],
  assignWindows: [],
  log: (...args) => {
    console.log(...args);
  },
  cookies: {},
  startTime: new Date().getTime(),
  getWindow: () => {
    if (child.window && !child.window.isDestroyed()) {
      return child.window;
    }
    return null;
  },
};

child.remoteMain.initialize();

child.shell = child.electron.shell;
child.dialog = child.electron.dialog;

const { app, BrowserWindow, globalShortcut } = child.electron;
child.electron.nativeTheme.themeSource = 'light';

require(child.path.join(child.dir, 'child', 'fn'))(child);
require(child.path.join(child.dir, 'child', 'windows'))(child);
require(child.path.join(child.dir, 'child', 'ipc'))(child);
require(child.path.join(child.dir, 'child', 'session'))(child);
require(child.path.join(child.dir, 'child', 'plugins'))(child);
require(child.path.join(child.dir, 'child', 'proxy_check'))(child);

app.setAppUserModelId('Social.Browser');
app.clearRecentDocuments();

if (app.setUserTasks) {
  app.setUserTasks([]);
}

app.commandLine.appendSwitch('enable-experimental-web-platform-features');
// app.commandLine.appendSwitch('disable-software-rasterizer');
// app.commandLine.appendSwitch('enable-webgl');
// app.commandLine.appendSwitch('disable-dev-shm-usage');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('in-process-gpu');
// app.disableHardwareAcceleration();

//app.commandLine.appendSwitch('disable-web-security');
// app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
//app.commandLine.appendSwitch('disable-site-isolation-trials');
//app.commandLine.appendSwitch('enable-features', 'PDFViewerUpdate');

// child.allow_widevinecdm(app)
child.mkdirSync(child.path.join(child.data_dir, child.uuid));
app.setPath('userData', child.path.join(child.data_dir, child.uuid));

// child.mkdirSync(child.path.join(child.data_dir, 'sessionData', 'sessionData_' + 'default'));
// app.setPath('userData', child.path.join(child.data_dir, 'sessionData', 'sessionData_' + 'default'));
app.on('ready', function () {
  globalShortcut.unregisterAll();
  app.setAccessibilitySupportEnabled(false);

  // app.on('session-created', (session) => {
  //   child.log(`session-created`);
  // });

  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  });

  app.on('crashed', (event, session) => {
    app.exit(0);
  });

  app.on('render-process-gone', (event, webContents, details) => {
    if (details.reason == 'crashed') {
      webContents.stop();
      // webContents.reload()
    }

    // app.exit(0);
  });

  app.on('web-contents-created', (event, contents) => {
    child.remoteMain.enable(contents);
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      webPreferences.preload = child.parent.files_dir + '/js/context-menu.js';
      delete webPreferences.preloadURL;
    });
  });

  app.on('window-all-closed', () => {
    // if (process.platform != 'darwin') {
    //   app.quit();
    // }
    console.log('window-all-closed : ' + child.parent.options.partition);
    // if (!child.parent.options.partition.contains('persist:')) {
    //   app.quit();
    // }
  });

  app.on('login', (event, webContents, authenticationResponseDetails, authInfo, callback) => {
    child.log(`App on Login`, authInfo);

    event.preventDefault();

    if (authInfo.isProxy) {
      let proxy = null;
      child.windowList.forEach((w) => {
        if (w.id2 == webContents.id) {
          proxy = w.customSetting.proxy;
        }
      });
      if (proxy) {
        callback(proxy.username, proxy.password);
        child.log(proxy);
        return;
      }
      child.parent.var.session_list.forEach((s) => {
        if (s.name == webContents.session.name) {
          if (s.proxy && s.proxy.enabled) {
            proxy = s.proxy;
          }
        }
      });
      if (proxy) {
        callback(proxy.username, proxy.password);
        child.log(proxy);
        return;
      }
      child.parent.var.proxy_list.forEach((p) => {
        if (p.ip == authInfo.host) {
          proxy = p;
        }
      });
      if (proxy) {
        callback(proxy.username, proxy.password);
        child.log(proxy);
        return;
      }
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
      if (w.window && !w.window.isDestroyed()) {
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
          child.is_hide = true;
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
          let new_bounds = {
            x: mainWindow.isMaximized ? mainWindow.bounds.x + 8 : mainWindow.bounds.x,
            y: mainWindow.isMaximized ? mainWindow.bounds.y + 78 : mainWindow.bounds.y + 70,
            width: mainWindow.isMaximized ? mainWindow.bounds.width - 15 : mainWindow.bounds.width - 2,
            height: mainWindow.isMaximized ? mainWindow.bounds.height - 84 : mainWindow.bounds.height - 72,
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
});
