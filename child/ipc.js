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

  child.electron.ipcMain.on('window.message', (e, obj) => {
    child.assignWindows.forEach((a) => {
      if (obj.parent_id && obj.parent_id == a.parent_id) {
        child.electron.BrowserWindow.fromId(obj.parent_id).send('window.message', obj);
      } else if (obj.child_id && obj.child_id == a.child_id) {
        child.electron.BrowserWindow.fromId(obj.child_id).send('window.message', obj);
      }
    });
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

  child.electron.ipcMain.on('[fetch][json]', (e, options) => {
    child
      .fetch(options.url, {
        method: options.method || 'get',
        headers: options.headers || { 'Content-Type': 'application/json' },
        body: options.body,
      })
      .then((res) => res.json())
      .then((data) => {
        e.reply('[fetch][json][data]', {
          options: options,
          data: data,
        });
        e.returnValue = data;
      }).catch(err=>{
        child.log('[fetch][json]' , err)
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
        child.log('[translate]' , err);
      });
  });

  child.electron.ipcMain.handle('[browser][data]', async (event, data) => {

    return {
      child_id: child.id,
      child_index: child.index,
      options: child.coreData.options,
      information: child.coreData.information,
      var: child.get_dynamic_var(data),
      files_dir: child.coreData.files_dir,
      dir: child.coreData.dir,
      injectHTML: child.coreData.injectHTML,
      windowSetting: (child.windowList.find((w) => w.id == data.win_id) || {}).setting || [],
      windowType: (child.windowList.find((w) => w.id == data.win_id) || {}).windowType || 'window-popup',
      newTabData: child.coreData.newTabData,
      windows: child.assignWindows.find((w) => w.child_id == data.win_id),
      session: child.coreData.var.session_list.find((s) => s.name == data.partition),
    };
  });

  child.electron.ipcMain.on('[browser][data]', async (event, data) => {
    event.returnValue = {
      child_id: child.id,
      child_index: child.index,
      options: child.coreData.options,
      information: child.coreData.information,
      var: child.get_dynamic_var(data),
      files_dir: child.coreData.files_dir,
      dir: child.coreData.dir,
      injectHTML: child.coreData.injectHTML,
      windowSetting: (child.windowList.find((w) => w.id == data.win_id) || {}).setting || [],
      windowType: (child.windowList.find((w) => w.id == data.win_id) || {}).windowType || 'window-popup',
      newTabData: child.coreData.newTabData,
      windows: child.assignWindows.find((w) => w.child_id == data.win_id),
      session: child.coreData.var.session_list.find((s) => s.name == data.partition),
    };
  });


  child.electron.ipcMain.on('[create-new-view]', (event, options) => {
    options.url = options.url || child.coreData.var.core.default_page;
    options.windowType = 'view';
    options.parent_id = child.id;
    options.parent_index = child.index;
    child.sendMessage({
      type: '[create-new-view]',
      options: options,
    });
  });

  child.electron.ipcMain.on('[show-view]', (e, options) => {
    child.sendMessage({
      type: '[show-view]',
      options: options,
    });
  });

  child.electron.ipcMain.on('[close-view]', (e, options) => {
    child.sendMessage({
      type: '[close-view]',
      options: options,
    });
  });

  child.electron.ipcMain.on('[update-view-url]', (e, options) => {
    child.sendMessage({
      type: '[update-view-url]',
      options: options,
    });
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

  child.electron.ipcMain.on('[send-render-message]', (event, data) => {
    if (data.action) {
      delete data.action;
      child.sendMessage({
        type: '[call-window-action]',
        data: data,
      });
    } else if (data.name == '[open new tab]') {
      data.partition = data.partition || child.coreData.var.core.session.name;
      data.user_name = data.user_name || child.coreData.var.core.session.display;
      if (child.coreData.options.windowType == 'main') {
        child.getWindow().webContents.send('[send-render-message]', data);
      } else {
        data.main_window_id = child.coreData.options.main_window_id;
        child.sendMessage({
          type: '[send-render-message]',
          data: data,
        });
      }
    } else if (data.name == '[open new popup]') {
      data.partition = data.partition || child.coreData.var.core.session.name;
      data.user_name = data.user_name || child.coreData.var.core.session.display;
      if (child.coreData.options.windowType == 'main') {
        data.main_window_id = child.coreData.options.main_window_id;
        child.sendMessage({
          type: '[send-render-message]',
          data: data,
        });
      } else {
        if (data.partition && data.partition !== child.coreData.var.core.session.name) {
          child.handleSession(data.partition);
        }

        child.createNewWindow({
          windowType: data.url.like('https://www.youtube.com/embed*') ? 'youtube' : 'client-popup',
          width: data.url.like('https://www.youtube.com/embed*') ? 440 : 1200,
          height: data.url.like('https://www.youtube.com/embed*') ? 330 : 720,
          x: data.url.like('https://www.youtube.com/embed*') ? child.coreData.options.screen.bounds.width - 460 : 0,
          y: data.url.like('https://www.youtube.com/embed*') ? child.coreData.options.screen.bounds.height - 350 : 0,
          show: true,
          webaudio: data.webaudio,
          center: data.url.like('https://www.youtube.com/embed*') ? false : true,
          title: 'New Popup',
          backgroundColor: data.url.like('https://www.youtube.com/embed*') ? '#030303' : '#ffffff',
          url: data.url,
          referrer: data.referrer,
          partition: data.partition || child.coreData.var.core.session.name,
          user_name: data.user_name || child.coreData.var.core.session.display,
        });
      }
    } else if (data.name == '[show-browser-setting]') {
      child.getWindow().webContents.send('[send-render-message]', {
        name: '[open new tab]',
        url: 'http://127.0.0.1:60080/setting',
      });
    } else if (data.name == '[winow-reload-hard]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      if (win && data.origin && data.origin !== 'null') {
        let ss = win.webContents.session;
        data.storages = data.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
        data.quotas = data.quotas || ['temporary', 'persistent', 'syncable'];
        ss.clearStorageData({
          origin: data.origin,
          storages: data.storages,
          quotas: data.quotas,
        });
        ss.clearCache().then(() => {
          win.webContents.reload();
        });
      }
    } else if (data.name == '[toggle-fullscreen]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.setFullScreen(!win.isFullScreen());
    } else if (data.name == '[winow-zoom]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.webContents.zoomFactor = 1;
    } else if (data.name == '[winow-zoom+]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.webContents.zoomFactor += 0.2;
    } else if (data.name == '[winow-zoom-]') {
      let win = child.electron.BrowserWindow.fromId(data.win_id);
      win.webContents.zoomFactor -= 0.2;
    } else if (data.name == '[winow-reload]') {
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
        false,
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
    } else if (data.name == 'user-data') {
      child.coreData.var.user_data = child.coreData.var.user_data || [];
      let exists = false;
      child.coreData.var.user_data.forEach((u) => {
        if (u.id === data.id) {
          exists = true;
          u.data = data.data;
        }
      });
      if (!exists) {
        child.coreData.var.user_data.push(data);
      }
      child.sendMessage({
        type: '[update-browser-var]',
        options: {
          name: 'user-data',
          data: child.coreData.var.user_data,
        },
      });
    } else if (data.name == 'user-input') {
      child.coreData.var.user_data_input = child.coreData.var.user_data_input || [];
      let exists = false;
      child.coreData.var.user_data_input.forEach((u) => {
        if (u.id === data.id) {
          exists = true;
          u.data = data.data;
        }
      });
      if (!exists) {
        child.coreData.var.user_data_input.push(data);
      }
      child.sendMessage({
        type: '[update-browser-var]',
        options: {
          name: 'user-input',
          data: child.coreData.var.user_data_input,
        },
      });
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
                      child.electron.shell.openItem(result.filePath);
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
        partition : data.partition || data.options.partition || child.coreData.partition,
        url: data.url,
      });
    }
  });
};
