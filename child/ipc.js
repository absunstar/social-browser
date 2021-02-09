module.exports = function init(child) {
  child.on = function (name, callback) {
    child.electron.ipcMain.on(name, callback);
  };

  child.call = function (channel, value) {
    if (!child.is_app_ready) {
      return null;
    }

    if (child.window_list) {
      child.window_list.forEach((view) => {
        if (view.window && !view.window.isDestroyed()) {
          view.window.send(channel, value);
        }
      });
    }
  };

  child.electron.ipcMain.handle('[browser][data]', async (event, data) => {
    return {
      child_id: child.id,
      child_index: child.index,
      options: child.coreData.options,
      var: child.get_dynamic_var(data),
      files_dir: child.coreData.files_dir,
      dir: child.coreData.dir,
      custom_request_header_list: child.coreData.custom_request_header_list,
      injectHTML: child.coreData.injectHTML,
      windowSetting: child.coreData.windowSetting,
      windowType: child.coreData.windowType,
      newTabdata: child.coreData.newTabdata,
      //windows: child.coreData.assignWindows.find((w) => w.child == data.win_id),
      session: child.coreData.var.session_list.find((s) => s.name == data.partition),
    };
  });

  child.electron.ipcMain.on('[create-new-view]', (event, options) => {
    options.url = options.url || child.coreData.var.core.default_page;
    options.windowType = 'view window';
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
    if (data.name == '[open new tab]') {
      data.partition = data.partition || child.coreData.var.core.session.name;
      data.user_name = data.user_name || child.coreData.var.core.session.display;
      if (child.coreData.options.windowType == 'main window') {
        child.getWindow().webContents.send('[send-render-message]', data);
      } else {
        data.main_window_id = child.coreData.options.main_window_id;
        child.sendMessage({
          type: '[send-render-message]',
          data: data,
        });
      }
    } else if (data.name == '[open new popup]') {
      data.win_id = data.win_id || browser.getView().id;
      let view = browser.getView(data.win_id);
      data.partition = data.partition || view.partition;
      data.user_name = data.user_name || view.user_name;

      if (data.duplicate) {
        data.url = view.window.webContents.getURL();
      } else {
        data.url = browser.var.core.default_page;
      }
      data.name = 'new_popup';
    } else if (data.name == '[open new ghost tab]') {
      let view = browser.getView();
      data.win_id = data.win_id || view.id;

      data.user_name = data.partition = 'Ghost_' + new Date().getTime() + Math.random();

      if (data.duplicate) {
        data.url = view.window.webContents.getURL();
      }
      data.name = '[open new tab]';
    } else if (data.name == '[open new ghost popup]') {
      let view = browser.getView();
      data.win_id = data.win_id || view.id;

      data.user_name = data.partition = 'Ghost_' + new Date().getTime() + Math.random();

      if (data.duplicate) {
        data.url = view.window.webContents.getURL();
      } else {
        data.url = browser.var.core.default_page;
      }
      data.name = 'new_popup';
    } else if (data.name == '[open new window]') {
      let view = browser.getView(data.win_id);
      data.win_id = view.id;
      if (data.source == 'session') {
        data.partition = data.partition || browser.var.core.session.name;
        data.user_name = data.user_name || browser.var.core.session.display;
      } else {
        data.partition = data.partition || view.partition;
        data.user_name = data.user_name || view.user_name;
      }
      if (data.duplicate) {
        data.url = view.window.webContents.getURL();
      }
    } else if (data.name == 'show setting') {
      child.getWindow().webContents.send('[send-render-message]', {
        name: '[open new tab]',
        url: 'http://127.0.0.1:60080/setting',
      });
    } else if (data.name.like('reload|audio|go back|go forward|zoom|zoom+|zoom-|edit-page|Developer Tools|full_screen|edit-page')) {
      child.sendMessage({
        type: '[call-window-action]',
        data: data,
      });
    }
  });
};
