module.exports = function (child) {
  function connect() {
    child.reconnectCount = 0;
    child._ws_ = new child.WebSocket('ws://127.0.0.1:60080/ws');
    child.sendMessage = function (message) {
      message.index = child.index;
      message.uuid = child.uuid;
      message.id = child.id;
      message.pid = child.id;
      child._ws_.send(JSON.stringify(message));
    };
    child._ws_.on('open', function () {});
    child._ws_.on('ping', function () {});
    child._ws_.on('close', function (e) {
      child.log('Child Socket is closed. Reconnect will be attempted in 1 second.', e);
      setTimeout(function () {
        child.reconnectCount++;
        if (child.reconnectCount > 10) {
          process.exit();
        }
        connect();
      }, 1000);
    });
    child._ws_.on('error', function (err) {
      child.log('Socket encountered error: ', err);
      child._ws_.close();
    });

    child._ws_.on('message', function (event) {
      try {
        let message = JSON.parse(event.data || event);

        if (message.type == 'connected') {
          child.sendMessage({
            type: '[request-browser-core-data]',
          });
        } else if (message.type == 're-connected') {
          child.sendMessage({
            type: '[re-request-browser-core-data]',
          });
        } else if (message.type == '[browser-core-data]') {
          connect2();
          child.parent = message;
          child.addOverwriteList(child.parent.var.overwrite.urls);
          child.option_list.push(message.options);
          child.cookies = {};
          child.electron.app.userAgentFallback = child.parent.var.core.user_agent;
          if (child.parent.windowType == 'none') {
          } else if (child.parent.windowType == 'files') {
            child.window = null;
            setTimeout(() => {
              setInterval(() => {
                if (child.save_var_quee.length > 0) {
                  child.save_var(child.save_var_quee.shift());
                }
              }, 1000 * 5);
            }, 1000 * 60 * 10);
          } else if (child.parent.windowType == 'main') {
            if (child.mainWindow && !child.mainWindow.isDestroyed()) {
              child.mainWindow.show();
              w.window.webContents.send('[open new tab]', message.newTabData);
            } else {
              child.sessionConfig();
              child.createNewWindow({ ...child.parent.options, ...message.options });
            }
          } else {
            child.sessionConfig();
            child.createNewWindow({ ...child.parent.options, ...message.options });
          }
        } else if (message.type == '[re-browser-core-data]') {
          child.option_list.push(message.options);

          if (message.options.windowType == 'main') {
            if (child.mainWindow && !child.mainWindow.isDestroyed()) {
              child.mainWindow.show();
              w.window.webContents.send('[open new tab]', message.newTabData);
            } else {
              child.sessionConfig();
              child.createNewWindow({ ...child.parent.options, ...message.options });
            }
          } else {
            child.sessionConfig();
            child.createNewWindow({ ...child.parent.options, ...message.options });
          }
        } else if (message.type == '[update-browser-var]') {
          if (child.parent.windowType == 'files') {
            child.set_var(message.options.name, message.options.data);
          } else {
            child.parent.var[message.options.name] = message.options.data;
            if (child.parent.var.core.user_agent) {
              child.electron.app.userAgentFallback = child.parent.var.core.user_agent;
            }
            if (message.options.name === 'overwrite') {
              child.addOverwriteList(child.parent.var.overwrite.urls);
            }
            if (message.options.name == 'core' || message.options.name == 'proxy' || message.options.name == 'session_list') {
              child.sessionConfig();
            }

            child.sendToWindows('[update-browser-var]', message);
          }
        } else if (message.type == '[user_data_input][changed]') {
          let index = child.parent.var.user_data_input.findIndex((u) => u.id === message.data.id);
          if (index > -1) {
            child.parent.var.user_data_input[index].data = message.data.data;
          } else {
            child.parent.var.user_data_input.push(message.data);
          }
          child.sendToWindows('[update-browser-var]', {
            type: '[update-browser-var]',
            options: {
              name: 'user_data_input',
              data: child.parent.var.user_data_input,
            },
          });
        } else if (message.type == '[user_data][changed]') {
          let index = child.parent.var.user_data.findIndex((u) => u.id === message.data.id);
          if (index > -1) {
            child.parent.var.user_data[index].data = message.data.data;
          } else {
            child.parent.var.user_data.push(message.data);
          }
          child.sendToWindows('[update-browser-var]', {
            type: '[update-browser-var]',
            options: {
              name: 'user_data',
              data: child.parent.var.user_data,
            },
          });
        } else if (message.type == '[browser-cookies]') {
          child.cookies[message.name] = message.value;
        } else if (message.type == 'share') {
          child.electron.BrowserWindow.getAllWindows().forEach((win) => {
            if (win && !win.isDestroyed()) {
              win.webContents.send('share', message.message);
            }
          });
        } else if (message.type == '[send-render-message]') {
          child.sendToWindow('[send-render-message]', message.data);
        } else if (message.type == '[open new tab]') {
          child.windowList.forEach((w) => {
            if (w.customSetting.windowType == 'main' && !w.window.isDestroyed()) {
              w.window.webContents.send('[open new tab]', message.data);
            }
          });
        } else if (message.type == 'pause-item') {
          child.parent.var.download_list.forEach((dl) => {
            if (dl.id == info.id) {
              dl.item.pause();
              dl.status = 'paused';
              dl.path = item.getSavePath();
              child.sendMessage({ type: '$download_item', data: dl });
            }
          });
        } else if (message.type == 'remove-item') {
          child.parent.var.download_list.forEach((dl, i) => {
            if (dl.id == info.id) {
              dl.item.cancel();
              dl.status = 'cancel';
              child.sendMessage({ type: '$download_item', data: dl });
            }
          });
        } else if (message.type == 'resume-item') {
          child.parent.var.download_list.forEach((dl, i) => {
            if (dl.id == info.id) {
              if (dl.item.canResume()) {
                dl.item.resume();
                dl.status = 'downloading';
                dl.path = item.getSavePath();
                child.sendMessage({ type: '$download_item', data: dl });
              }
            }
          });
        } else if (message.type == '[add-window-url]') {
          let index = child.parent.var.urls.findIndex((u) => u.url == message.url);
          if (index > -1) {
            child.parent.var.urls[index].title = message.title || child.parent.var.urls[index].title;
            child.parent.var.urls[index].logo = message.logo || child.parent.var.urls[index].logo;
            child.parent.var.urls[index].last_visit = new Date().getTime();
            if (!message.ignoreCounted) {
              child.parent.var.urls[index].count++;
            }
          } else {
            child.parent.var.urls.push({
              url: message.url,
              logo: message.logo,
              logo2: message.logo,
              title: message.title || message.url,
              count: 1,
              first_visit: new Date().getTime(),
              last_visit: new Date().getTime(),
            });
          }

          if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
            child.addressbarWindow.webContents.send('[update-browser-var]', { options: { name: 'urls', data: child.parent.var.urls } });
          }
        } else if (message.type == '[to-all]') {
          if (message.name === 'hide-addressbar') {
            if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
              child.addressbarWindow.hide();
            }
          }
        } else if (message.type == '[call-window-action]') {
          if (message.data.name == '[window-reload-hard]') {
            child.windowList.forEach((w) => {
              if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
                let info = message.data;
                if (info.origin) {
                  info.origin = info.origin === 'null' ? w.window.webContents.getURL() : info.origin;
                  info.storages = info.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
                  info.quotas = info.quotas || ['temporary', 'persistent', 'syncable'];
                  if (info.origin.replace('://', '').indexOf(':') == -1) {
                    info.origin = info.origin + ':80';
                  }

                  if (info.storages[0] == 'cookies') {
                    w.window.webContents.session
                      .clearStorageData({
                        origin: info.origin,
                        storages: info.storages,
                        quotas: info.quotas,
                      })
                      .then(() => {
                        w.window.webContents.session.clearCache().then(() => {
                          w.window.webContents.reload();
                        });
                      });
                  } else {
                    w.window.webContents.session.clearCache().then(() => {
                      w.window.webContents.session
                        .clearStorageData({
                          origin: info.origin,
                          storages: info.storages,
                          quotas: info.quotas,
                        })
                        .then(() => {
                          w.window.webContents.session.clearCache().then(() => {
                            w.window.webContents.reload();
                          });
                        });
                    });
                  }
                }
              }
            });
          } else if (message.data.name == 'copy') {
            child.electron.clipboard.writeText(message.data.text.replace('#___new_tab___', '').replace('#___new_popup__', ''));
          } else if (message.data.name == 'full_screen') {
            child.windowList.forEach((w) => {
              if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
                w.window.setFullScreen(true);
              }
            });
          } else if (message.data.name == '!full_screen') {
            child.windowList.forEach((w) => {
              if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
                w.window.setFullScreen(false);
              }
            });
          } else {
            console.log('[call-window-action]', message);
          }
        } else if (message.type == '[window-reload]') {
          child.windowList.forEach((w) => {
            if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
              w.window.reload();
            }
          });
        } else if (message.type == '[window-reload-hard]') {
          child.windowList.forEach((w) => {
            if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
              let win = w.window;
              if (win && message.data.origin && message.data.origin !== 'null') {
                let ss = win.webContents.session;
                message.data.storages = message.data.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
                message.data.quotas = message.data.quotas || ['temporary', 'persistent', 'syncable'];
                child.log(' will clear storage data ...');
                let clear = false;
                ss.clearStorageData({
                  origin: message.data.origin,
                  storages: message.data.storages,
                  quotas: message.data.quotas,
                }).finally(() => {
                  child.log(' will clear cache ...');
                  ss.clearCache().finally(() => {
                    child.log(' will reload ...');
                    clear = true;
                    win.webContents.reload();
                  });
                });
                setTimeout(() => {
                  if (!clear) {
                    win.webContents.reload();
                  }
                }, 1000 * 3);
              }
            }
          });
        } else if (message.type == '[toggle-window-audio]') {
          child.windowList.forEach((w) => {
            if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
              w.window.webContents.setAudioMuted(!w.window.webContents.audioMuted);
              child.updateTab(w.window);
            }
          });
        } else if (message.type == '[window-go-back]') {
          child.windowList.forEach((w) => {
            if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
              if (w.window.webContents.canGoBack()) {
                w.window.webContents.goBack();
              }
            }
          });
        } else if (message.type == '[window-go-forward]') {
          child.windowList.forEach((w) => {
            if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
              if (w.window.webContents.canGoForward()) {
                w.window.webContents.goForward();
              }
            }
          });
        } else if (message.type == '[window-zoom]') {
          child.windowList.forEach((w) => {
            if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
              w.window.webContents.zoomFactor = 1;
              w.window.show();
            }
          });
        } else if (message.type == '[window-zoom+]') {
          child.windowList.forEach((w) => {
            if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
              w.window.webContents.zoomFactor += 0.2;
              w.window.show();
            }
          });
        } else if (message.type == '[window-zoom-]') {
          child.windowList.forEach((w) => {
            if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
              if (w.window.webContents.zoomFactor - 0.3 > 0.0) {
                w.window.webContents.zoomFactor -= 0.2;
                w.window.show();
              }
            }
          });
        } else if (message.type == '[show-window-dev-tools]') {
          child.windowList.forEach((w) => {
            if (w.window && !w.window.isDestroyed() && w.customSetting.tab_id == message.data.tab_id) {
              w.window.webContents.openDevTools();
            }
          });
        } else if (message.type == '[set-window]' && child.getWindow()) {
          child.getWindow().setSkipTaskbar(false);
          child.getWindow().setMenuBarVisibility(true);
          child.getWindow().setResizable(true);
          child.getWindow().setMovable(true);
        } else if (message.type == '[update-tab-properties]') {
          child.windowList.forEach((w) => {
            if (w.customSetting.windowType == 'main' && w.window && !w.window.isDestroyed()) {
              w.window.webContents.send('[update-tab-properties]', message.data);
            }
          });
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
        } else if (message.type == '[edit-window]') {
          child.windowList.forEach((w) => {
            if (w.customSetting.tab_id == message.data.tab_id && w.window && !w.window.isDestroyed()) {
              w.window.webContents.executeJavaScript(
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
                false
              );
            }
          });
        } else if (message.type == '[close-view]') {
          if ((w = child.windowList.find((w) => w.customSetting.tab_id == message.options.tab_id))) {
            if (w && !w.window.isDestroyed()) {
              w.window.close();
            }
          }
        } else if (message.type == '[update-view-url]') {
          if ((w = child.windowList.find((w) => w.customSetting.tab_id == message.data.tab_id))) {
            if (w && !w.window.isDestroyed()) {
              w.window.webContents.stop();
              w.window.loadURL(message.data.url);
            }
          }
        } else if (message.type == '[remove-tab]' && child.getWindow()) {
          child.sendToWindow('[send-render-message]', { name: '[remove-tab]', tab_id: message.tab_id });
        } else if (message.type == '[cookie-changed]') {
          child.cookies[message.partition] = child.cookies[message.partition] || [];
          let ss = child.electron.session.fromPartition(message.partition);
          if (!message.removed) {
            let exists = false;
            child.cookies[message.partition].forEach((co, i) => {
              if (co && co.domain == message.cookie.domain && co.name == message.cookie.name) {
                exists = true;
                child.cookies[message.partition][i] = message.cookie;
              }
            });
            if (!exists) {
              child.cookies[message.partition].push(message.cookie);
            }
          } else {
            child.cookies[message.partition].forEach((co, i) => {
              if (co && co.domain == message.cookie.domain && co.name == message.cookie.name) {
                child.cookies[message.partition].splice(i, 1);
              }
            });
          }
        }
      } catch (error) {
        child.log('onmessage Error', error);
      }
    });
  }

  function connect2() {
    if (child._ws_2 && child._ws_2.readyState === child.WebSocket.OPEN) {
      return child._ws_2;
    }
    child._ws_2 = new child.WebSocket('ws://127.0.0.1:60080/window');
    child.sendMessage2 = function (message) {
      message.index = child.index;
      message.uuid = child.uuid;
      message.id = child.id;
      message.pid = child.id;
      if (child._ws_2 && child._ws_2.readyState === child.WebSocket.OPEN) {
        child._ws_2.send(JSON.stringify(message));
      }
    };
    child._ws_2.on('open', function () {});
    child._ws_2.on('ping', function () {});
    child._ws_2.on('close', function (e) {
      child.log('Child Socket 2 is closed. Reconnect will be attempted in 1 second.', e);
      setTimeout(function () {
        connect2();
      }, 1000);
    });
    child._ws_2.on('error', function (err) {
      child.log('Socket encountered error: ', err);
      child._ws_2.close();
    });

    child._ws_2.on('message', function (event) {
      try {
        let message = JSON.parse(event.data || event);

        if (message.type == 'connected') {
          child.sendMessage2({
            type: '[connected]',
          });
        } else if (message.type == '[send-window-status]') {
          if (message.screen && message.mainWindow) {
            child.parent.options.screen = message.screen;
            child.parent.options.mainWindow = message.mainWindow;
            child.handleWindowBounds();
          }
        } else if (message.type == '[show-view]') {
          child.is_hide = true;

          if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
            child.addressbarWindow.hide();
          }
          if (child.profilesWindow && !child.profilesWindow.isDestroyed()) {
            child.profilesWindow.hide();
          }

          child.windowList.forEach((w) => {
            if (w.customSetting && w.customSetting.windowType == 'view' && w.window && !w.window.isDestroyed()) {
              if (w.customSetting.tab_id == message.options.tab_id) {
                if (message.is_current_view) {
                  child.is_hide = false;
                  w.window.show();
                  w.window.setAlwaysOnTop(true);
                  w.window.setAlwaysOnTop(false);
                } else {
                  w.window.hide();
                }
              } else {
                w.window.hide();
              }
            }
          });
        }
      } catch (ex) {
        console.log(ex, event.data || event);
      }
    });
  }
  setTimeout(() => {
    connect();
  }, 1000);
};
