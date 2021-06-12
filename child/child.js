console.log('  ( New Child Created ) ');

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

var child = {
  index: parseInt(process.argv[1].replace('--index=', '')),
  dir: process.argv[2].replace('--dir=', ''),
  electron: require('electron'),
  fetch: require('node-fetch'),
  url: require('url'),
  path: require('path'),
  fs: require('fs'),
  md5: require('md5'),
  WebSocket: require('ws'),
  id: process.pid,
  windowList: [],
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

require('@electron/remote/main').initialize();

const { app, BrowserWindow, globalShortcut } = child.electron;

require(child.path.join(child.dir, 'child', 'fn'))(child);
require(child.path.join(child.dir, 'child', 'windows'))(child);
require(child.path.join(child.dir, 'child', 'ipc'))(child);
require(child.path.join(child.dir, 'child', 'session'))(child);
require(child.path.join(child.dir, 'child', 'plugins'))(child);
// require(child.path.join(child.dir, 'child', 'client'))(child);

app.clearRecentDocuments();
if (app.setUserTasks) {
  app.setUserTasks([]);
}

app.clearRecentDocuments();
app.commandLine.appendSwitch('enable-features', 'PDFViewerUpdate');
// app.commandLine.appendSwitch('--no-sandbox');
app.disableHardwareAcceleration();
// child.allow_widevinecdm(app)

app.on('ready', function () {
  globalShortcut.unregisterAll();
  app.setAccessibilitySupportEnabled(false);

  // app.on('session-created', (session) => {
  //   console.log(`session-created`);
  // });

  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  });

  app.on('crashed', (event, session) => {
    console.log('child crashed');
    app.exit(0);
  });

  app.on('render-process-gone', (event, webContents, details) => {
    console.log('child render-process-gone', details);
    if (details.reason == 'crashed') {
      webContents.stop();
      // webContents.reload()
    }

    // app.exit(0);
  });

  app.on('web-contents-created', (event, contents) => {
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      webPreferences.preload = child.coreData.files_dir + '/js/context-menu.js';
      delete webPreferences.preloadURL;
    });
  });

  app.on('window-all-closed', () => {
    // if (process.platform != 'darwin') {
    //   app.quit();
    // }
    child.window = null;
    child.coreData.options = { windowType: 'popup' };
    child.sendMessage({
      type: '[un-attach-child]',
    });
  });

  app.on('login', (event, webContents, details, authInfo, callback) => {
    console.log(`child ${child.id} request login`);
    event.preventDefault();
    callback('username', 'secret');
  });

  child.sendToWindow = function (...args) {
    if (child.window && !child.window.isDestroyed()) {
      child.window.webContents.send(...args);
    }
  };

  child.sendToWindows = function (...args) {
    child.windowList.forEach((win) => {
      if (win.window && !win.window.isDestroyed()) {
        win.window.webContents.send(...args);
      }
    });
  };

  child.handleWindowBounds = function () {
    let win = child.getWindow();
    let mainWindow = child.coreData.options.mainWindow;
    let screen = child.coreData.options.screen;
    if (!mainWindow || !screen || child.coreData.options.windowType === 'main' || !win) {
      return;
    }

    if (mainWindow.hide) {
      if (!child.is_hide) {
        win.hide();
        child.is_hide = true;
      }
    }

    if (win.isFullScreen()) {
      console.log('isFullScreen');
      let width = screen.bounds.width;
      let height = screen.bounds.height;
      win.setBounds({
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
      return;
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
    if (mainWindow.hide && win) {
      if (!child.is_hide) {
        win.hide();
        child.is_hide = true;
      }
    } else {
      if (child.coreData.is_current_view && win) {
        child.is_hide = false;
        win.show();
        win.setAlwaysOnTop(true);
        win.setAlwaysOnTop(false);
      }
    }
  };

  require(child.path.join(child.dir, 'child', 'ws'))(child);
});
