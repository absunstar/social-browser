module.exports = function init(child) {
  child.on = function (name, callback) {
    child.electron.ipcMain.handle(name, callback);
  };

  child.call = function (channel, value) {
    if (!child.is_app_ready) {
      return null;
    }

    child.windowList.forEach((view) => {
      if (view.window && !view.window.isDestroyed()) {
        if (value && value.toWindowID) {
          if (value.toWindowID == view.id) {
            view.window.send(channel, value);
          }
        } else {
          view.window.send(channel, value);
        }
      }
    });
  };

  child.handleBrowserData = function (data) {
    let data2 = {
      childProcessID: child.id,
      child_index: child.index,
      information: child.parent.information,
      var: child.get_dynamic_var(data),
      files_dir: child.parent.files_dir,
      dir: child.parent.dir,
      data_dir: child.parent.data_dir,
      injectHTML: child.parent.injectHTML,
      injectCSS: child.parent.injectCSS,
      newTabData: child.parent.newTabData,
      parentAssignWindow: child.assignWindows.find((w) => w.childWindowID == data.windowID),
    };

    let win = child.windowList.find((w) => w.id == data.windowID);
    if (win) {
      data2.customSetting = win.customSetting || {};
      data2.partition = data2.customSetting.partition || data.partition;
      data2.session = child.parent.var.session_list.find((s) => s.name == data2.partition);
    } else {
      data2.partition = data.partition;
      data2.session = child.parent.var.session_list.find((s) => s.name == data2.partition);
      data2.customSetting = {};
    }
    return data2;
  };

  child.electron.ipcMain.handle('[browser][data]', async (event, data) => {
    try {
      let data2 = child.handleBrowserData(data);
      return data2;
    } catch (ex) {
      event.returnValue = {
        childProcessID: child.id,
        child_index: child.index,
        information: child.parent.information,
        var: child.parent.var,
        files_dir: child.parent.files_dir,
        dir: child.parent.dir,
        data_dir: child.parent.data_dir,
        injectHTML: child.parent.injectHTML,
        injectCSS: child.parent.injectCSS,
        newTabData: child.parent.newTabData,
        windows: null,
      };
      return data2;
    }
  });

  child.electron.ipcMain.handle('[open-external]', (e, obj) => {
    child.openExternal(obj.link);
    return true;
  });
  child.electron.ipcMain.handle('[exec]', (e, obj) => {
    child.exec(obj.cmd);
    return true;
  });
  child.electron.ipcMain.handle('[exe]', (e, obj) => {
    child.exe(obj.cmd, obj.args);
    return true;
  });
  child.electron.ipcMain.handle('[kill]', (e, obj) => {
    child.child_process.exec('tasklist', { maxBuffer: 1024 * 1024 * 2 }, function (err, stdout, stderr) {
      let programsList = [];
      if (stdout) {
        let lines = stdout.split('\n');
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (line === '') continue;
          var values = line.split(/\s+/);
          programsList.push({
            name: values[0],
            pid: values[1],
            memory: values[4],
          });
        }

        programsList.forEach((itm) => {
          if (itm.name.like(obj.name)) {
            try {
              process.kill(itm.pid);
            } catch (error) {
              child.log(error);
            }
          }
        });
      }
    });

    return true;
  });
  child.electron.ipcMain.handle('[request-cookie]', (e, obj) => {
    return child.cookieList.find((c) => obj.domain.like(c.domain) && c.partition == obj.partition);
  });

  child.electron.ipcMain.handle('online-status', (e, obj) => {
    child.parent.var.core.onLineStatus = obj.status;
  });

  child.electron.ipcMain.handle('[handle-session]', (e, obj) => {
    child.handleSession(obj);
  });
  child.electron.ipcMain.handle('[cookie-set-raw]', (e, obj) => {
    return true;
  });
  child.electron.ipcMain.handle('[cookie-get-raw]', (e, obj) => {
    return child.getCookiesRaw(obj);
  });
  child.electron.ipcMain.handle('[cookie-get-all]', (e, obj) => {
    return child.getAllCookies(obj);
  });
  child.electron.ipcMain.handle('[cookies-clear]', (e, obj) => {
    return child.clearCookies(obj);
  });
  child.electron.ipcMain.handle('show_message', (e, data) => {
    let win = child.electron.BrowserWindow.fromId(data.windowID);
    if (win) {
      win.send('show_message', data);
    }
  });
  child.electron.ipcMain.handle('message', (e, message) => {
    let win = child.electron.BrowserWindow.fromId(message.windowID);
    if (win) {
      win.send('message', message);
    }
  });
  child.electron.ipcMain.handle('window.message', (e, message) => {
    let win = child.electron.BrowserWindow.fromId(message.windowID);
    if (win) {
      win.send('window.message', message);
    }
  });

  child.electron.ipcMain.handle('share', (e, message) => {
    child.sendMessage({
      type: 'share',
      message: message,
    });
  });

  child.electron.ipcMain.handle('[proxy-check-request]', (e, message) => {
    child.proxy_check(message.proxy);
  });
  child.electron.ipcMain.handle('getBlobData', (e, message) => {
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
  child.electron.ipcMain.handle('ws', (e, message) => {
    child.sendMessage(message);
  });

  child.electron.ipcMain.handle('[add][window]', (e, data) => {
    let w = child.windowList.find((w) => w.id == data.windowID);
    if (w) {
      w.customSetting = { ...w.customSetting, ...data.customSetting };
      w.id2 = data.id2 || w.id2;
    } else {
      child.windowList.push({
        id: data.windowID,
        id2: data.id2,
        customSetting: data.customSetting,
      });
    }
  });

  child.electron.ipcMain.handle('[set][window][setting]', (e, data) => {
    let w = child.windowList.find((w) => w.id == data.windowID);
    if (w) {
      w.customSetting.windowSetting = w.customSetting.windowSetting || [];
      w.customSetting.windowSetting.push(data);
      w.id2 = data.id2 || w.id2;
    } else {
      let id = data.windowID;
      let customSetting = data.customSetting;
      delete data.windowID;
      delete data.customSetting;

      child.windowList.push({
        id: id,
        id2: data.id2,
        customSetting: { ...customSetting, windowSetting: [data] },
      });
    }
  });

  child.electron.ipcMain.handle('[get][window][setting]', (e, data) => {
    let win = child.windowList.find((w) => w.id == data.windowID);
    if (win) {
      return win.customSetting.windowSetting || [];
    } else {
      return [];
    }
  });

  child.electron.ipcMain.handle('[assign][window]', (e, info) => {
    child.assignWindows.push({
      parentWindowID: info.parentWindowID,
      childWindowID: info.childWindowID,
    });
  });

  child.electron.ipcMain.handle('[get][assign][window]', (e, info) => {
    return child.assignWindows.find((w) => w.childWindowID == info.childWindowID);
  });

  child.electron.ipcMain.handle('[fetch]', async (e, options) => {
    options.body = options.body || options.data || options.payload;
    if (options.body && typeof options.body != 'string') {
      options.body = JSON.stringify(options.body);
    }
    options.return = options.return || 'json';
    let data = await child.fetch(options.url, {
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
    });

    if (data) {
      if (options.return == 'json') {
        return data.json();
      }
      if (options.return == 'text') {
        return data.text();
      } else {
        return data.text();
      }
    }
  });

  child.electron.ipcMain.handle('[fetch-json]', async (e, options) => {
    options.body = options.body || options.data || options.payload;
    if (options.body && typeof options.body != 'string') {
      options.body = JSON.stringify(options.body);
    }
    options.return = options.return || 'json';
    try {
      let data = await child.fetch(options.url, {
        mode: 'cors',
        method: options.method || 'get',
        headers: options.headers || {
          'Content-Type': 'application/json',
          'User-Agent': child.parent.var.core.defaultUserAgent.url,
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
      });

      if (data) {
        if (options.return == 'json') {
          return data.json();
        } else {
          return data.text();
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  child.electron.ipcMain.handle('[translate]', async (e, info) => {
    info.text = encodeURIComponent(info.text);
    info.from = info.from || 'auto';
    info.to = info.to || 'en';
    info.data = await child.fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${info.from}&tl=${info.to}&dt=t&dt=bd&dj=1&q=${info.text}`, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    });
    if (info.data) {
      info.data = info.data.json();
    }
    return info;
  });
  child.electron.ipcMain.handle('[show-menu]', (e, data) => {
    let win = child.electron.BrowserWindow.fromId(data.windowID);
    data.list.forEach((m, i) => {
      m.click = function () {
        win.webContents.send('[run-menu]', { index: i });
      };
      if (m.submenu) {
        m.submenu.forEach((m2, i2) => {
          m2.click = function () {
            win.webContents.send('[run-menu]', { index: i, index2: i2 });
          };
          if (m2.submenu) {
            m2.submenu.forEach((m3, i3) => {
              m3.click = function () {
                win.webContents.send('[run-menu]', { index: i, index2: i2, index3: i3 });
              };
            });
          }
        });
      }
    });
    const menu = child.electron.Menu.buildFromTemplate(data.list);
    menu.popup(win);
  });
  child.electron.ipcMain.handle('[create-new-view]', (event, options) => {
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

  child.electron.ipcMain.handle('[show-view]', (e, options) => {
    if (child.speedMode) {
      child.currentView = options;
      child.windowList.forEach((w) => {
        if (w.customSetting.windowType == 'view') {
          if (w.customSetting.tabID == child.currentView.tabID) {
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
      delete options.parentSetting;
      // let w = child.windowList.find((w) => w.customSetting.windowType == 'main');
      // if (w && w.window && !w.window.isDestroyed()) {

      // }
      child.sendMessage({
        type: '[show-view]',
        options: options,
      });
    }
  });

  child.electron.ipcMain.handle('[close-view]', (e, options) => {
    if (child.speedMode) {
      child.windowList.forEach((w) => {
        if (w.customSetting.windowType == 'view') {
          if (w.customSetting.tabID == options.tabID) {
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

  child.electron.ipcMain.handle('[update-view-url]', (e, data) => {
    child.sendMessage({
      type: '[update-view-url]',
      data: data,
    });
  });

  child.electron.ipcMain.handle('[import-extension]', (e, options) => {
    child.sendMessage({
      type: '[import-extension]',
    });
  });
  child.electron.ipcMain.handle('[enable-extension]', (e, options) => {
    child.sendMessage({
      type: '[enable-extension]',
      extension: options,
    });
  });
  child.electron.ipcMain.handle('[disable-extension]', (e, options) => {
    child.sendMessage({
      type: '[disable-extension]',
      extension: options,
    });
  });
  child.electron.ipcMain.handle('[remove-extension]', (e, options) => {
    child.sendMessage({
      type: '[remove-extension]',
      extension: options,
    });
  });

  child.electron.ipcMain.handle('[update-browser-var]', (e, options) => {
    child.parent.var[options.name] = options.data;
    child.sendMessage({
      type: '[update-browser-var]',
      options: options,
    });
  });

  child.electron.ipcMain.handle('[browser-message]', (event, data) => {
    let w = child.windowList.find((w) => w.id == data.windowID);
    if (w && w.window && !w.window.isDestroyed()) {
      if (data.name == 'maxmize') {
        if (w.window.isMaximized()) {
          w.window.unmaximize();
        } else {
          w.window.maximize();
        }
      } else if (data.name == 'minmize') {
        w.window.minimize();
      } else if (data.name == 'close') {
        w.window.close();
      }
    }
  });

  child.electron.ipcMain.handle('[open new tab]', (event, data) => {
    data.partition = data.partition || child.parent.var.core.session.name;
    data.user_name = data.user_name || child.parent.var.core.session.display;
    data.title = data.title || data.url;

    if (child.windowList.some((w) => w.customSetting.windowType == 'main')) {
      child.windowList.forEach((w) => {
        if (w.customSetting.windowType == 'main' && !w.window.isDestroyed()) {
          w.window.webContents.send('[open new tab]', data);
        }
      });
    } else {
      data.main_window_id = child.parent.options.main_window_id;
      child.sendMessage({
        type: '[open new tab]',
        data: data,
      });
    }
  });

  child.electron.ipcMain.handle('[open new popup]', (event, data) => {
    data.partition = data.partition || child.parent.var.core.session.name;
    data.user_name = data.user_name || child.parent.var.core.session.display;

    delete data.name;
    data.windowType = data.windowType || 'popup';
    if (data.partition == child.partition) {
      child.createNewWindow(data);
    } else {
      child.sendMessage({
        type: '[create-new-window]',
        options: data,
      });
    }
  });

  child.electron.ipcMain.handle('[show-addressbar]', (event, data) => {
    child.showAddressbarWindow(data);
  });
  child.electron.ipcMain.handle('[edit-window]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({ type: '[edit-window]', data: data });
    } else if (data.windowID) {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
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
    }
  });

  child.electron.ipcMain.handle('[window-reload]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({ type: '[window-reload]', data: data });
    } else if (data.windowID) {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      win.webContents.reload();
    }
  });

  child.electron.ipcMain.handle('[window-reload-hard]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({ type: '[window-reload-hard]', data: data });
    } else if (data.windowID) {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
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
    }
  });

  child.electron.ipcMain.handle('[toggle-window-audio]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({ type: '[toggle-window-audio]', data: data });
    } else if (data.windowID) {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      win.webContents.setAudioMuted(!win.webContents.audioMuted);
      child.updateTab(win);
    }
  });

  child.electron.ipcMain.handle('[window-go-back]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({ type: '[window-go-back]', data: data });
    } else if (data.windowID) {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      if (win.webContents.navigationHistory.canGoBack()) {
        win.webContents.navigationHistory.goBack();
      }
    }
  });

  child.electron.ipcMain.handle('[window-go-forward]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({ type: '[window-go-forward]', data: data });
    } else if (data.windowID) {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      if (win.webContents.navigationHistory.canGoForward()) {
        win.webContents.goForward();
      }
    }
  });

  child.electron.ipcMain.handle('[window-zoom]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({ type: '[window-zoom]', data: data });
    } else if (data.windowID) {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      win.webContents.zoomFactor = 1;
      win.show();
    }
  });

  child.electron.ipcMain.handle('[window-zoom-]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({ type: '[window-zoom-]', data: data });
    } else if (data.windowID) {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      if (win && win.webContents.zoomFactor - 0.3 > 0.0) {
        win.webContents.zoomFactor -= 0.2;
        win.show();
      }
    }
  });

  child.electron.ipcMain.handle('[window-zoom+]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({ type: '[window-zoom+]', data: data });
    } else if (data.windowID) {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      win.webContents.zoomFactor += 0.2;
      win.show();
    }
  });

  child.electron.ipcMain.handle('[add-to-bookmark]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({
        type: '[add-to-bookmark]',
        data: data,
      });
    }
  });

  child.electron.ipcMain.handle('[show-window-dev-tools]', (event, data) => {
    if (data.tabID && data.childID && data.windowID) {
      child.sendMessage({ type: '[show-window-dev-tools]', data: data });
    } else if (data.windowID) {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      win.openDevTools();
    }
  });

  child.electron.ipcMain.handle('[show-profiles]', (event, data) => {
    child.showProfilesWindow();
  });

  child.electron.ipcMain.handle('user_data', (event, data) => {
    if (!Array.isArray(data.data) || data.data.length === 0) {
      return null;
    }
    child.parent.var.user_data = child.parent.var.user_data || [];
    let index = child.parent.var.user_data.findIndex((u) => u.id === data.id);
    if (index !== -1) {
      child.parent.var.user_data[index].data = data.data;
    } else {
      child.parent.var.user_data.push(data);
    }
    delete data.parentSetting;
    child.sendMessage({
      type: '[user_data][changed]',
      data: data,
    });
  });

  child.electron.ipcMain.handle('user_data_input', (event, data) => {
    if (!Array.isArray(data.data) || data.data.length === 0) {
      return null;
    }

    child.parent.var.user_data_input = child.parent.var.user_data_input || [];
    let index = child.parent.var.user_data_input.findIndex((u) => u.id === data.id);
    if (index > -1) {
      child.parent.var.user_data_input[index].data = data.data;
    } else {
      child.parent.var.user_data_input.push(data);
    }
    delete data.parentSetting;
    child.sendMessage({
      type: '[user_data_input][changed]',
      data: data,
    });
  });

  child.electron.ipcMain.handle('[send-render-message]', (event, data) => {
    data.partition = data.partition || child.parent.var.core.session.name;
    data.user_name = data.user_name || child.parent.var.core.session.display;

    if (data.tabID && data.childID && data.windowID) {
      let name = data.name;
      delete data.name;

      child.sendMessage({
        type: name,
        data: data,
      });
    } else if (!child.speedMode && data.action) {
      delete data.action;
      child.sendMessage({
        type: '[call-window-action]',
        data: data,
      });
    } else if (data.name == '[run-window-update]') {
      child.sendMessage({
        type: '[run-window-update]',
      });
    } else if (data.name == '[show-browser-setting]') {
      if (child.windowList.some((w) => w.customSetting.windowType == 'main')) {
        child.windowList.forEach((w) => {
          if (w.customSetting.windowType == 'main' && !w.window.isDestroyed()) {
            w.window.webContents.send('[open new tab]', {
              url: 'http://127.0.0.1:60080/setting',
              partition: 'persist:setting',
              vip: true,
            });
          }
        });
      } else {
        data.main_window_id = child.parent.options.main_window_id;
        child.sendMessage({
          type: '[open new tab]',
          data: {
            url: 'http://127.0.0.1:60080/setting',
            partition: 'persist:setting',
            vip: true,
          },
        });
      }
    } else if (data.name == '[toggle-fullscreen]') {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      win.setFullScreen(!win.isFullScreen());
    } else if (data.name == '[window-go-forward]') {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      if (win.webContents.navigationHistory.canGoForward()) {
        win.webContents.goForward();
      }
    } else if (data.name == '[window-go-forward]') {
      let win = child.electron.BrowserWindow.fromId(data.windowID);
      if (win.webContents.navigationHistory.canGoForward()) {
        win.webContents.goForward();
      }
    } else if (data.name == '[save-window-as-pdf]') {
      let win = child.electron.BrowserWindow.fromId(data.windowID);

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
    } else if (data.name == '[download-link]') {
      child.sendMessage({
        type: '[download-link]',
        partition: data.partition || data.customSetting.partition || child.parent.partition,
        url: data.url,
      });
    }
    return true;
  });
};
