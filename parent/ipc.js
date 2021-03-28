module.exports = function init(parent) {
  if (parent.is_render) {
    parent.on = function (name, callback) {
      parent.electron.ipcRenderer.on(name, callback);
    };

    parent.call = function (channel, value) {
      parent.electron.ipcRenderer.send(channel, value);
    };
  } else {
    parent.on = function (name, callback) {
      parent.electron.ipcMain.on(name, callback);
    };
    parent.call = function (channel, value) {
      if (!parent.is_app_ready) {
        return null;
      }
      if (channel == '[send-render-message]' && value.name == '[open new tab]') {
        parent.get_main_window().send(channel, value);
      } else {
        parent.main_window_list.forEach((w) => {
          if (w.window && !w.window.isDestroyed()) {
            w.window.send(channel, value);
          }
        });
      }

      if (parent.addressbarWindow && !parent.addressbarWindow.isDestroyed()) {
        parent.addressbarWindow.send(channel, value);
      }
      if (parent.userProfileWindow && !parent.userProfileWindow.isDestroyed()) {
        parent.userProfileWindow.send(channel, value);
      }

      if (parent.window_list) {
        parent.window_list.forEach((view) => {
          if (view.window && !view.window.isDestroyed()) {
            view.window.send(channel, value);
          }
        });
      }
    };
  }
};
