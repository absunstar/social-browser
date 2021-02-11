console.log(' >>> New Child Created With PID : ' + process.pid);

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
  log: (...args) => {
    console.log(...args);
  },
  startTime: new Date().getTime(),
  getWindow: () => {
    if (child.window && !child.window.isDestroyed()) {
      return child.window;
    }
    return null;
  },
};

const { app, BrowserWindow, globalShortcut } = child.electron;

require(child.path.join(child.dir, 'child', 'fn'))(child);
require(child.path.join(child.dir, 'child', 'windows'))(child);
require(child.path.join(child.dir, 'child', 'ipc'))(child);
require(child.path.join(child.dir, 'child', 'session'))(child);

// app.disableHardwareAcceleration(); // for app speed
app.clearRecentDocuments();

if (app.setUserTasks) {
  app.setUserTasks([]);
}

app.clearRecentDocuments();
app.commandLine.appendSwitch('--no-sandbox');
app.disableHardwareAcceleration();

app.on('ready', function () {
  globalShortcut.unregisterAll();
  app.setAccessibilitySupportEnabled(false);

  app.on('session-created', (session) => {
    console.log(`session-created`);
  });

  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  });

  app.on('crashed', (event, session) => {
    console.log('child crashed');
    app.exit(0);
  });

  app.on('render-process-gone', (event, session) => {
    console.log('child render-process-gone');
    app.exit(0);
  });

  app.on('web-contents-created', (event, contents) => {
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      webPreferences.preload = child.files_dir + '/js/context-menu.js';
      delete webPreferences.preloadURL;
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
      app.quit();
    }
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
    if (child.coreData.options.windowType === 'main window') {
      return;
    }

    let mainWindow = child.coreData.options.mainWindow;
    let screen = child.coreData.options.screen;

    if (mainWindow.hide) {
      if (!child.is_hide) {
        child.getWindow().hide();
        child.is_hide = true;
      }
    }

    if (child.getWindow().isFullScreen()) {
      let width = screen.bounds.width;
      let height = screen.bounds.height;
      child.getWindow().setBounds({
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
      let old_bounds = child.getWindow().getBounds();
      if (old_bounds.width != new_bounds.width || old_bounds.height != new_bounds.height || old_bounds.y != new_bounds.y || old_bounds.x != new_bounds.x) {
        child.getWindow().setBounds(new_bounds);
      }
    }
    if (mainWindow.hide) {
      if (!child.is_hide) {
        child.getWindow().hide();
        child.is_hide = true;
      }
    } else {
      if (child.coreData.is_current_view) {
        child.is_hide = false;
        child.getWindow().show();
        child.getWindow().setAlwaysOnTop(true);
        child.getWindow().setAlwaysOnTop(false);
      }
    }
  };

  function connect() {
    child._ws_ = new child.WebSocket('ws://127.0.0.1:60080/ws');
    child.sendMessage = function (message) {
      message.index = child.index;
      message.id = child.id;
      message.pid = child.id;
      child._ws_.send(JSON.stringify(message));
    };
    child._ws_.on('open', function () {});
    child._ws_.on('ping', function () {});
    child._ws_.on('close', function (e) {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(function () {
        connect();
      }, 1000);
    });
    child._ws_.on('error', function (err) {
      console.error('Socket encountered error: ', err.message);
      child._ws_.close();
    });

    child._ws_.on('message', function (event) {
      try {
        let message = JSON.parse(event.data || event);
        if (message.type == 'connected') {
          child.sendMessage({
            type: '[attach-child]',
          });
        } else if (message.type == '[browser-core-data]') {
          child.coreData = message;
          child.electron.app.setPath('userData', child.path.join(child.coreData.data_dir, 'default'));
          child.sessionConfig();
          child.createNewWindow();
        } else if (message.type == '[send-render-message]') {
          child.sendToWindow('[send-render-message]', message.data);
        } else if (message.type == '[update-browser-var]') {
          child.coreData.var[message.options.name] = message.options.data;
          child.sendToWindows('[update-browser-var]', message);
        } else if (message.type == '[call-window-action]') {
          if (message.data.name == 'reload' && child.getWindow()) {
            child.getWindow().reload();
          } else if (message.data.name == 'force reload' && child.getWindow()) {
            let info = message.data;
            if (info.origin) {
              info.origin = info.origin === 'null' ? child.getWindow().webContents.getURL() : info.origin;
              info.storages = info.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
              info.quotas = info.quotas || ['temporary', 'persistent', 'syncable'];
              if (info.origin.replace('://', '').indexOf(':') == -1) {
                info.origin = info.origin + ':80';
              }

              if (info.storages[0] == 'cookies') {
                child
                  .getWindow()
                  .webContents.session.clearStorageData({
                    origin: info.origin,
                    storages: info.storages,
                    quotas: info.quotas,
                  })
                  .then(() => {
                    child
                      .getWindow()
                      .webContents.session.clearCache()
                      .then(() => {
                        child.getWindow().webContents.reload();
                      });
                  });
              } else {
                child
                  .getWindow()
                  .webContents.session.clearCache()
                  .then(() => {
                    child
                      .getWindow()
                      .webContents.session.clearStorageData({
                        origin: info.origin,
                        storages: info.storages,
                        quotas: info.quotas,
                      })
                      .then(() => {
                        child
                          .getWindow()
                          .webContents.session.clearCache()
                          .then(() => {
                            child.getWindow().webContents.reload();
                          });
                      });
                  });
              }
            }
          } else if (message.data.name == 'Developer Tools' && child.getWindow()) {
            child.getWindow().webContents.openDevTools();
          } else if (message.data.name == 'audio' && child.getWindow()) {
            child.getWindow().webContents.setAudioMuted(!child.getWindow().webContents.audioMuted);
            child.updateTab(child.coreData.options);
          } else if (message.data.name == 'copy') {
            child.electron.clipboard.writeText(message.data.text.replace('#___new_tab___', '').replace('#___new_popup__', ''));
          } else if (message.data.name == 'full_screen' && child.getWindow()) {
            child.getWindow().setFullScreen(true);
          } else if (message.data.name == '!full_screen' && child.getWindow()) {
            child.getWindow().setFullScreen(false);
          } else if (message.data.name == 'zoom' && child.getWindow()) {
            child.getWindow().webContents.zoomFactor = 1;
          } else if (message.data.name == 'zoom+' && child.getWindow()) {
            child.getWindow().webContents.zoomFactor += 0.2;
          } else if (message.data.name == 'zoom-' && child.getWindow()) {
            child.getWindow().webContents.zoomFactor -= 0.2;
          } else if (message.data.name == 'go back' && child.getWindow()) {
            if (child.getWindow().webContents.canGoBack()) {
              child.getWindow().webContents.goBack();
            }
          } else if (message.data.name == 'go forward' && child.getWindow()) {
            if (child.getWindow().webContents.canGoForward()) {
              child.getWindow().webContents.goForward();
            }
          } else if (message.data.name == 'edit-page' && child.getWindow()) {
            child.getWindow().webContents.executeJavaScript(
              `
                        (function(){
                          let b =  document.querySelector('html');
                          if(b.contentEditable == "inherit"){
                              b.contentEditable = true;
                              b.style.border = '10px dashed green';
                          }else{
                              b.contentEditable = "inherit";
                              b.style.border = '0px solid white';
                          }
                        })()
                        `,
              false,
            );
          }
        } else if (message.type == '[update-tab-properties]' && child.getWindow()) {
          child.sendToWindow('[send-render-message]', message.data);
        } else if (message.type == '[show-view]' && child.getWindow()) {
          if (child.coreData.options.windowType === 'main window') {
            return;
          }
          if (child.coreData.is_current_view == message.is_current_view) {
            if (child.coreData.is_current_view) {
              child.is_hide = false;
              child.getWindow().show();
              child.getWindow().setAlwaysOnTop(true);
              child.getWindow().setAlwaysOnTop(false);
            }
          } else {
            child.coreData.is_current_view = message.is_current_view;
            if (!child.coreData.is_current_view) {
              child.getWindow().hide();
              child.is_hide = true;
            } else {
              child.is_hide = false;
              child.getWindow().show();
              child.getWindow().setAlwaysOnTop(true);
              child.getWindow().setAlwaysOnTop(false);
            }
          }
        } else if (message.type == '[close-view]' && child.getWindow()) {
          child.getWindow().close();
        } else if (message.type == '[update-view-url]' && child.getWindow()) {
          child.getWindow().loadURL(message.options.url);
        } else if (message.type == '[remove-tab]' && child.getWindow()) {
          child.sendToWindow('[send-render-message]', { name: '[remove-tab]', tab_id: message.tab_id });
        } else if (message.type == '[send-window-status]' && child.getWindow()) {
          child.coreData.options.screen = message.screen;
          child.coreData.options.mainWindow = message.mainWindow;
          child.handleWindowBounds();
        }
      } catch (error) {
        console.log('onmessage Error', error);
        console.log(event)
      }
    });
  }

  connect();
});
