module.exports = function init(browser) {
  if (browser.is_render) {
    browser.on = function (name, callback) {
      browser.electron.ipcRenderer.on(name, callback);
    };

    browser.call = function (channel, value) {
      browser.electron.ipcRenderer.send(channel, value);
    };
  } else {
    browser.on = function (name, callback) {
      browser.electron.ipcMain.on(name, callback);
    };
    browser.call = function (channel, value) {
      if (!browser.is_app_ready) {
        return null;
      }
      if (channel == '[send-render-message]' && value.name == '[open new tab]') {
        browser.get_main_window().send(channel, value);
      } else {
        browser.main_window_list.forEach((w) => {
          if (w.window && !w.window.isDestroyed()) {
            w.window.send(channel, value);
          }
        });
      }

      if (browser.addressbarWindow && !browser.addressbarWindow.isDestroyed()) {
        browser.addressbarWindow.send(channel, value);
      }
      if (browser.userProfileWindow && !browser.userProfileWindow.isDestroyed()) {
        browser.userProfileWindow.send(channel, value);
      }

      if (browser.window_list) {
        browser.window_list.forEach((view) => {
          if (view.window && !view.window.isDestroyed()) {
            view.window.send(channel, value);
          }
        });
      }
    };
  }
};
