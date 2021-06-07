module.exports = function (child) {
  function connect() {
    child.reconnectCount = 0;
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
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e);
      setTimeout(function () {
        child.reconnectCount++;
        if (child.reconnectCount > 10) {
          process.exit();
        }
        connect();
      }, 1000);
    });
    child._ws_.on('error', function (err) {
      console.error('Socket encountered error: ', err);
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
          child.cookies = child.cookies || {};
          child.electron.app.userAgentFallback = child.coreData.var.core.user_agent;
          child.electron.app.setPath('userData', child.path.join(child.coreData.data_dir, 'default'));
          child.sessionConfig();

          if (child.coreData.windowType == 'none') {
            child.window = null;
            child.sendMessage({
              type: '[un-attach-child]',
            });
          } else {
            child.createNewWindow(Object.assign({}, child.coreData.options));
          }
        } else if (message.type == '[browser-cookies]') {
          child.cookies[message.name] = message.value;
        } else if (message.type == '[send-render-message]') {
          child.sendToWindow('[send-render-message]', message.data);
        } else if (message.type == '$download_item') {
          child.sendToWindow('$download_item', message.data);
        } else if (message.type == '[cookie-changed]') {
          if (typeof child.cookies[message.partition] === 'undefined') {
            child.cookies[message.partition] = [];
          }

          if (!message.removed) {
            let exists = false;
            child.cookies[message.partition].forEach((co) => {
              if (co.name == message.cookie.name) {
                exists = true;
                co.value = message.cookie.value;
              }
            });
            if (!exists) {
              child.cookies[message.partition].push({
                partition: message.partition,
                name: message.cookie.name,
                value: message.cookie.value,
                domain: message.cookie.domain,
                path: message.cookie.path,
                secure: message.cookie.secure,
                httpOnly: message.cookie.httpOnly,
              });
            }
          } else {
            child.cookies[message.partition].forEach((co, i) => {
              if (co.name == message.cookie.name) {
                child.cookies[message.partition].splice(i, 1);
              }
            });

          }
        } else if (message.type == '[to-all]') {
          if (message.name === 'hide-addressbar') {
            if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
              child.addressbarWindow.hide();
            }
          }
        } else if (message.type == '[update-browser-var]') {
          child.coreData.var[message.options.name] = message.options.data;
          if (message.options.name == 'core') {
            if (child.coreData.var.core.user_agent) {
              child.electron.app.userAgentFallback = child.coreData.var.core.user_agent;
            }
          } else if (message.options.name == 'proxy' || message.options.name == 'session_list') {
            child.sessionConfig();
          }

          child.sendToWindows('[update-browser-var]', message);
        } else if (message.type == '[call-window-action]') {
          if (message.data.name == '[winow-reload]' && child.getWindow()) {
            child.getWindow().reload();
          } else if (message.data.name == '[winow-reload-hard]' && child.getWindow()) {
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
          } else if (message.data.name == '[show-window-dev-tools]' && child.getWindow()) {
            child.getWindow().webContents.openDevTools();
          } else if (message.data.name == '[toggle-window-audio]' && child.getWindow()) {
            child.getWindow().webContents.setAudioMuted(!child.getWindow().webContents.audioMuted);
            child.updateTab(child.coreData.options);
          } else if (message.data.name == 'copy') {
            child.electron.clipboard.writeText(message.data.text.replace('#___new_tab___', '').replace('#___new_popup__', ''));
          } else if (message.data.name == 'full_screen' && child.getWindow()) {
            child.getWindow().setFullScreen(true);
          } else if (message.data.name == '!full_screen' && child.getWindow()) {
            child.getWindow().setFullScreen(false);
          } else if (message.data.name == '[winow-zoom]' && child.getWindow()) {
            child.getWindow().webContents.zoomFactor = 1;
          } else if (message.data.name == '[winow-zoom+]' && child.getWindow()) {
            child.getWindow().webContents.zoomFactor += 0.2;
          } else if (message.data.name == '[winow-zoom-]' && child.getWindow()) {
            child.getWindow().webContents.zoomFactor -= 0.2;
          } else if (message.data.name == '[window-go-back]' && child.getWindow()) {
            if (child.getWindow().webContents.canGoBack()) {
              child.getWindow().webContents.goBack();
            }
          } else if (message.data.name == '[window-go-forward]' && child.getWindow()) {
            if (child.getWindow().webContents.canGoForward()) {
              child.getWindow().webContents.goForward();
            }
          } else if (message.data.name == 'add_to_bookmark' && child.getWindow()) {
            let win = child.getWindow();

            let exists = false;
            child.coreData.var.bookmarks.forEach((b) => {
              if (b.url == win.getURL()) {
                b.title == win.getTitle();
                exists = true;
              }
            });
            if (!exists) {
              child.coreData.var.bookmarks.push({
                title: win.getTitle(),
                url: win.getURL(),
                favicon: win.$setting.favicon,
              });
            }
            child.sendMessage({
              type: '[update-browser-var]',
              options: {
                name: 'bookmarks',
                data: child.coreData.var.bookmarks,
              },
            });
          } else if (message.data.name == '[edit-window]' && child.getWindow()) {
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
        } else if (message.type == '[window-clicked]') {
          if (child.mainWindow && !child.mainWindow.isDestroyed()) {
            child.mainWindow.show();
          }
          if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
            child.addressbarWindow.hide();
          }
          if (child.profilesWindow && !child.profilesWindow.isDestroyed()) {
            child.profilesWindow.hide();
          }
        } else if (message.type == '[show-view]' && child.getWindow()) {
          if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
            child.addressbarWindow.hide();
          }
          if (child.profilesWindow && !child.profilesWindow.isDestroyed()) {
            child.profilesWindow.hide();
          }
          if (child.coreData.options.windowType !== 'view') {
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
        } else if (message.type == '[send-window-status]' && child.coreData.options.windowType === 'view' && child.getWindow()) {
          child.coreData.options.screen = message.screen;
          child.coreData.options.mainWindow = message.mainWindow;
          child.handleWindowBounds();
        }
      } catch (error) {
        console.log('onmessage Error', error);
      }
    });
  }

  connect();
};
