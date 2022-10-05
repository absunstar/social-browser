module.exports = function init(child) {
  child.on = function (name, callback) {
    child.electron.ipcMain.on(name, callback);
  };

  child.call = function (channel, value) {
    if (!child.is_app_ready) {
      return null;
    }

    child.windowList.forEach((view) => {
      if (view.window && !view.window.isDestroyed()) {
        if (value && value.to_win_id) {
          if (value.to_win_id == view.id) {
            view.window.send(channel, value);
          }
        } else {
          view.window.send(channel, value);
        }
      }
    });
  };

  child.handleBrowserData = function (event, data) {
    let data2 = {
      child_id: child.id,
      child_index: child.index,
      options: child.parent.options,
      information: child.parent.information,
      var: child.get_dynamic_var(data),
      files_dir: child.parent.files_dir,
      dir: child.parent.dir,
      data_dir: child.parent.data_dir,
      injectHTML: child.parent.injectHTML,
      injectCSS: child.parent.injectCSS,
      newTabData: child.parent.newTabData,
      windows: child.assignWindows.find((w) => w.child_id == data.win_id),
    };

    let win = child.windowList.find((w) => w.id == data.win_id);
    if (win) {
      data2.__options = win.__options || {};
      data2.partition = data2.__options.partition || data.partition;
      data2.session = child.parent.var.session_list.find((s) => s.name == data2.partition);
      data2.windowSetting = win.setting || [];
    } else {
      data2.partition = data.partition;
      data2.session = child.parent.var.session_list.find((s) => s.name == data2.partition);
      data2.windowSetting = [];
      data2.__options = {};
    }
    return data2;
  };

  child.electron.ipcMain.on('[browser][data]', async (event, data) => {
    let data2 = child.handleBrowserData(event, data);
    event.returnValue = data2;
    return data2;
  });
  child.electron.ipcMain.handle('[browser][data]', async (event, data) => {
    let data2 = child.handleBrowserData(event, data);
    event.returnValue = data2;
    return data2;
  });

  child.electron.ipcMain.on('[handle-session]', (e, obj) => {
    child.handleSession(obj);
  });
  child.electron.ipcMain.on('[cookie-set-raw]', (e, obj) => {
    child.addCookie(obj);
    e.returnValue = true;
  });
  child.electron.ipcMain.on('[cookie-get-raw]', (e, obj) => {
    e.returnValue = child.getCookiesRaw(obj);
  });
  child.electron.ipcMain.on('[cookie-get-all]', (e, obj) => {
    e.returnValue = child.getAllCookies(obj);
  });
  child.electron.ipcMain.on('[cookies-clear]', (e, obj) => {
    e.returnValue = child.clearCookies(obj);
  });
  child.electron.ipcMain.on('window.message', (e, obj) => {
    child.assignWindows.forEach((a) => {
      if (obj.parent_id && obj.parent_id == a.parent_id) {
        child.electron.BrowserWindow.fromId(obj.parent_id).send('window.message', obj);
      } else if (obj.child_id && obj.child_id == a.child_id) {
        child.electron.BrowserWindow.fromId(obj.child_id).send('window.message', obj);
      }
    });
  });

  child.electron.ipcMain.on('share', (e, message) => {
    child.sendMessage({
      type: 'share',
      message: message,
    });
  });
  child.electron.ipcMain.on('[proxy-check-request]', (e, message) => {
    child.proxy_check(message.proxy);
  });
  child.electron.ipcMain.on('getBlobData', (e, message) => {
    child.log('getBlobData', message);
    let ses = child.electron.session.fromPartition(message.partition);
    ses
      .getBlobData(message.url)
      .then((data) => {
        child.log(data);
      })
      .catch((err) => {
        child.log(err);
      });
  });
  child.electron.ipcMain.on('ws', (e, message) => {
    child.sendMessage(message);
  });

  child.electron.ipcMain.on('[add][window]', (e, data) => {
    let win = child.windowList.find((w) => w.id == data.win_id);
    if (win) {
      win.__options = { ...win.__options, ...data.options };
    } else {
      child.windowList.push({
        id: data.win_id,
        __options: data.options,
      });
    }
  });

  child.electron.ipcMain.on('[set][window][setting]', (e, data) => {
    let win = child.windowList.find((w) => w.id == data.win_id);
    if (win) {
      win.setting = win.setting || [];
      win.setting.push(data);
    } else {
      child.windowList.push({
        id: data.win_id,
        setting: [data],
      });
    }
  });

  child.electron.ipcMain.on('[get][window][setting]', (e, data) => {
    let win = child.windowList.find((w) => w.id == data.win_id);
    if (win) {
      e.returnValue = win.setting;
      e.reply('[get][window][setting][data]', win.setting);
    } else {
      e.returnValue = [];
      e.reply('[get][window][setting][data]', []);
    }
  });

  child.electron.ipcMain.on('[assign][window]', (e, info) => {
    child.assignWindows.push({
      parent_id: info.parent_id,
      child_id: info.child_id,
    });
  });

  child.electron.ipcMain.on('[get][assign][window]', (e, info) => {
    let w = null;
    child.assignWindows.forEach((a) => {
      if (a.child_id == info.child_id) {
        w = a;
      }
    });
    e.returnValue = w;
  });

  child.electron.ipcMain.on('[fetch-json]', (e, options) => {
    options.body = options.body || options.data || options.payload;
    if (options.body && typeof options.body != 'string') {
      options.body = JSON.stringify(options.body);
    }
    options.return = options.return || 'json';
    child
      .fetch(options.url, {
        mode: 'cors',
        method: options.method || 'get',
        headers: options.headers || {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
        },
        body: options.body,
        redirect: options.redirect || 'follow',
        agent: function (_parsedURL) {
          if (_parsedURL.protocol == 'http:') {
            return new child.http.Agent({
              keepAlive: true,
            });
          } else {
            return new child.https.Agent({
              keepAlive: true,
            });
          }
        },
      })
      .then((res) => {
        if (options.return == 'json') {
          return res.json();
        } else {
          return res.text();
        }
      })
      .then((data) => {
        e.reply('[fetch-json-callback]', {
          options: options,
          data: data,
        });
        e.returnValue = data;
      })
      .catch((err) => {
        e.reply('[fetch-json-callback]', {
          options: options,
          error: err.message,
        });
        child.log('[fetch-json]', err.message);
      });
  });

  child.electron.ipcMain.on('[translate]', (e, info) => {
    info.text = encodeURIComponent(info.text);
    child
      .fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&dt=bd&dj=1&q=${info.text}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => res.json())
      .then((data) => {
        e.reply('[translate][data]', data);
      })
      .catch((err) => {
        child.log('[translate]', err);
      });
  });

  child.electron.ipcMain.on('[create-new-view]', (event, options) => {
    options.url = options.url || child.parent.var.core.default_page;
    options.windowType = 'view';
    options.parent_id = child.id;
    options.parent_index = child.index;
    if (child.speedMode) {
      if (!child.session_name_list.some((s) => s == options.partition)) {
        child.handleSession({ name: options.partition });
      }
      child.createNewWindow(options);
    } else {
      child.sendMessage({
        type: '[create-new-view]',
        options: options,
      });
    }
  });

  child.electron.ipcMain.on('[show-view]', (e, options) => {
    if (child.speedMode) {
      child.currentView = options;
      child.windowList.forEach((w) => {
        if (w.__options.windowType == 'view') {
          if (w.__options.tab_id == child.currentView.tab_id) {
            w.window.show();
          } else {
            w.window.hide();
          }
        }
      });

      if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
        child.addressbarWindow.hide();
      }
      if (child.profilesWindow && !child.profilesWindow.isDestroyed()) {
        child.profilesWindow.hide();
      }
    } else {
      child.sendMessage({
        type: '[show-view]',
        options: options,
      });
    }
  });

  child.electron.ipcMain.on('[close-view]', (e, options) => {
    if (child.speedMode) {
      child.windowList.forEach((w) => {
        if (w.__options.windowType == 'view') {
          if (w.__options.tab_id == options.tab_id) {
            w.window.close();
          }
        }
      });
    } else {
      child.sendMessage({
        type: '[close-view]',
        options: options,
      });
    }
  });

  child.electron.ipcMain.on('[update-view-url]', (e, options) => {
    if (child.speedMode) {
      child.windowList.forEach((w) => {
        if (w.__options.windowType == 'view') {
          if (w.__options.tab_id == options.tab_id) {
            w.window.webContents.stop();
            w.window.loadURL(message.options.url);
          }
        }
      });
    } else {
      child.sendMessage({
        type: '[update-view-url]',
        options: options,
      });
    }
  });

  child.electron.ipcMain.on('[import-extension]', (e, options) => {
    child.sendMessage({
      type: '[import-extension]',
    });
  });
  child.electron.ipcMain.on('[enable-extension]', (e, options) => {
    child.sendMessage({
      type: '[enable-extension]',
      extension: options,
    });
  });
  child.electron.ipcMain.on('[disable-extension]', (e, options) => {
    child.sendMessage({
      type: '[disable-extension]',
      extension: options,
    });
  });
  child.electron.ipcMain.on('[remove-extension]', (e, options) => {
    child.sendMessage({
      type: '[remove-extension]',
      extension: options,
    });
  });

  child.electron.ipcMain.on('[update-browser-var]', (e, options) => {
    child.sendMessage({
      type: '[update-browser-var]',
      options: options,
    });
  });

  child.electron.ipcMain.on('[browser-message]', (event, data) => {
    if (data.name == 'maxmize') {
      if (child.getWindow().isMaximized()) {
        child.getWindow().unmaximize();
      } else {
        child.getWindow().maximize();
      }
    } else if (data.name == 'minmize') {
      child.getWindow().minimize();
    } else if (data.name == 'close') {
      child.getWindow().close();
    }
  });

  child.electron.ipcMain.on('[send-render-message]', (event, data) => {
    if (!child.speedMode && data.action) {
      delete data.action;
      child.sendMessage({
        type: '[call-window-action]',
        data: data,
      });
    } else if (data.name == '[run-window-update]') {
      child.sendMessage({
        type: '[run-window-update]',
      });
    } else if (data.name == '[open new tab]') {
      data.partition = data.partition || child.parent.var.core.session.name;
      data.user_name = data.user_name || child.parent.var.core.session.display;

      if (child.parent.options.windowType == 'main') {
        child.getMainWindow().webContents.send('[send-render-message]', data);
      } else {
        data.main_window_id = child.parent.options.main_window_id;
        child.sendMessage({
          type: '[send-render-message]',
          data: data,
        });
      }
    } else if (data.name == '[open new popup]') {
      data.partition = data.partition || child.parent.var.core.session.name;
      data.user_name = data.user_name || child.parent.var.core.session.display;
      if (child.parent.options.windowType == 'main') {
        data.main_window_id = child.parent.options.main_window_id;
        child.sendMessage({
          type: '[send-render-message]',
          data: data,
        });
      } else {
        if (data.partition && data.partition !== child.parent.var.core.session.name) {
          delete data.name;
          data.windowType = 'popup';
          child.sendMessage({
            type: '[create-new-window]',
            options: data,
          });
        } else {
          child.createNewWindow({
            ...data,
            windowType: data.url.like('https://www.youtube.com/embed*') ? 'youtube' : 'popup',
            width: data.url.like('https://www.youtube.com/embed*') ? 520 : 1200,
            height: data.url.like('https://www.youtube.com/embed*') ? 330 : 720,
            x: data.url.like('https://www.youtube.com/embed*') ? child.parent.options.screen.bounds.width - 550 : 0,
            y: data.url.like('https://www.youtube.com/embed*') ? child.parent.options.screen.bounds.height - 400 : 0,
            center: data.url.like('https://www.youtube.com/embed*') ? false : true,
            title: 'New Popup',
            backgroundColor: data.url.like('https://www.youtube.com/embed*') ? '#030303' : '#ffffff',
            partition: data.partition || child.parent.var.core.session.name,
            user_name: data.user_name || child.parent.var.core.session.display,
          });
        }
      }
    } else if (data.name == '[show-browser-setting]') {
      child.getWindow().webContents.send('[send-render-message]', {
        name: '[open new tab]',
        url: 'http://127.0.0.1:60080/setting',
        partition: 'setting',
        vip: true,
      });
    } else if (data.name == '[window-reload-hard]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      if (win && data.origin && data.origin !== 'null') {
        let ss = win.webContents.session;
        data.storages = data.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
        data.quotas = data.quotas || ['temporary', 'persistent', 'syncable'];
        child.log(' will clear storage data ...');
        let clear = false;
        ss.clearStorageData({
          origin: data.origin,
          storages: data.storages,
          quotas: data.quotas,
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
    } else if (data.name == '[toggle-fullscreen]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.setFullScreen(!win.isFullScreen());
    } else if (data.name == '[window-zoom]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.webContents.zoomFactor = 1;
    } else if (data.name == '[window-zoom+]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.webContents.zoomFactor += 0.2;
    } else if (data.name == '[window-zoom-]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.webContents.zoomFactor -= 0.2;
    } else if (data.name == '[window-reload]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.webContents.reload();
    } else if (data.name == '[show-window-dev-tools]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.openDevTools();
    } else if (data.name == '[edit-window]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.webContents.executeJavaScript(
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
    } else if (data.name == '[window-go-forward]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      if (win.webContents.canGoForward()) {
        win.webContents.goForward();
      }
    } else if (data.name == '[window-go-forward]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      if (win.webContents.canGoForward()) {
        win.webContents.goForward();
      }
    } else if (data.name == '[toggle-window-audio]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.webContents.setAudioMuted(!win.webContents.audioMuted);
    } else if (data.name == 'user_data') {
      child.parent.var.user_data = child.parent.var.user_data || [];
      let exists = false;
      child.parent.var.user_data.forEach((u) => {
        if (u.id === data.id) {
          exists = true;
          u.data = data.data;
          child.sendMessage({
            type: '[update-browser-var][user_data][update]',
            data: data,
          });
        }
      });
      if (!exists) {
        child.parent.var.user_data.push(data);
        child.sendMessage({
          type: '[update-browser-var][user_data][add]',
          data: data,
        });
      }
    } else if (data.name == 'user_data_input') {
      child.parent.var.user_data_input = child.parent.var.user_data_input || [];
      let exists = false;
      child.parent.var.user_data_input.forEach((u) => {
        if (u.id === data.id) {
          exists = true;
          u.data = data.data;
          child.sendMessage({
            type: '[update-browser-var][user_data_input][update]',
            data: data,
          });
        }
      });
      if (!exists) {
        child.parent.var.user_data_input.push(data);
        child.sendMessage({
          type: '[update-browser-var][user_data_input][add]',
          data: data,
        });
      }
    } else if (data.name == 'show addressbar') {
      if (child.addressbarWindow && child.window && !child.window.isDestroyed() && !child.addressbarWindow.isDestroyed()) {
        child.addressbarWindow.send('set-text-url', data);
        child.addressbarWindow.setBounds({
          width: child.window.getBounds().width - 200,
          height: 500,
          x: child.window.getBounds().x + 140,
          y: child.window.getBounds().y + 40,
        });
        child.addressbarWindow.show();
      }
    } else if (data.name == 'show profiles') {
      if (child.profilesWindow && child.window && !child.window.isDestroyed() && !child.profilesWindow.isDestroyed()) {
        child.profilesWindow.setBounds({
          width: 400,
          height: 500,
          x: child.window.getBounds().x + (child.window.getBounds().width - 500),
          y: (child.window.getBounds().y == -8 ? 0 : child.window.getBounds().y - 5) + 30,
        });
        child.profilesWindow.show();
      }
    } else if (data.name == 'add_to_bookmark') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);

      let exists = false;
      child.parent.var.bookmarks.forEach((b) => {
        if (b.url == win.getURL()) {
          b.title == win.getTitle();
          exists = true;
        }
      });
      if (!exists) {
        child.parent.var.bookmarks.push({
          title: win.getTitle(),
          url: win.getURL(),
          favicon: win.__options.favicon,
        });
      }
      child.sendMessage({
        type: '[update-browser-var]',
        options: {
          name: 'bookmarks',
          data: child.parent.var.bookmarks,
        },
      });
    } else if (data.name == '[save-window-as-pdf]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);

      child.electron.dialog
        .showSaveDialog({
          defaultPath: win.webContents.title,
          title: 'Save Downloading URL As PDF',
          properties: ['openFile', 'createDirectory'],
        })
        .then((result) => {
          if (result.canceled) {
            return;
          }
          win.webContents.printToPDF({}).then((data) => {
            child.fs.writeFile(result.filePath, data, function (error) {
              if (!error) {
                child.electron.dialog
                  .showMessageBox({
                    title: 'Download Complete',
                    type: 'info',
                    buttons: ['Open File', 'Open Folder', 'Close'],
                    message: `Save Page As PDF \n To \n ${result.filePath} `,
                  })
                  .then((result3) => {
                    child.electron.shell.beep();
                    if (result3.response == 1) {
                      child.electron.shell.showItemInFolder(result.filePath);
                    }
                    if (result3.response == 0) {
                      child.electron.shell.openPath(result.filePath);
                    }
                  });
              } else {
                child.log(error);
              }
            });
          });
        });
    } else if (data.name == 'window_clicked') {
      child.sendMessage({
        type: '[window-clicked]',
        data: data,
      });
      if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
        child.addressbarWindow.hide();
      }
      if (child.profilesWindow && !child.profilesWindow.isDestroyed()) {
        child.profilesWindow.hide();
      }
    } else if (data.name == '[download-link]') {
      child.sendMessage({
        type: '[download-link]',
        partition: data.partition || data.__options.partition || child.parent.partition,
        url: data.url,
      });
    }
  });
};
