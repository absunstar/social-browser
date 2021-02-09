module.exports = function (child) {
  child.createNewWindow = function (setting) {
    let o = Object.assign({}, child.coreData.options);
    setting = Object.assign(o, setting);
    let win = new child.electron.BrowserWindow({
      show: setting.windowType !== 'main window',
      alwaysOnTop: setting.windowType.like('*youtube*'),
      skipTaskbar: !setting.windowType.like('*main window*|*youtube*'),
      resizable: setting.windowType.like('*main window*|*youtube*'),
      width: setting.width || 1200,
      height: setting.height || 720,
      x: setting.x || 0,
      y: setting.y || 0,
      fullscreenable: true,
      title: setting.title || 'New Tab',
      backgroundColor: setting.backgroundColor || '#ffffff',
      frame: setting.windowType.like('*youtube*'),
      icon: child.coreData.icon,
      webPreferences: {
        sandbox: false,
        webaudio: typeof setting.webaudio == 'undefined' ? true : setting.webaudio,
        enableRemoteModule: true,
        contextIsolation: false, // false -> can access preload window functions
        partition: setting.partition,
        preload: setting.windowType === 'main window' ? null : child.coreData.files_dir + '/js/context-menu.js',
        javascript: true,
        nativeWindowOpen: false,
        nodeIntegration: setting.windowType === 'main window',
        nodeIntegrationInSubFrames: true,
        nodeIntegrationInWorker: setting.windowType === 'main window',
        experimentalFeatures: setting.windowType === 'main window',
        webSecurity: true,
        allowRunningInsecureContent: false,
        plugins: true,
      },
    });

    if (!child.window) {
      child.window = win 
    }
    child.windowList.push({
      window: win,
    });

    if (setting.center) {
      win.center();
    }

    if (setting.windowType === 'main window') {
      win.center();
      // win.webContents.openDevTools();
    } else if (setting.windowType === 'view window') {
      if (child.coreData.mainWindow) {
        let new_bounds = {
          x: child.coreData.mainWindow.isMaximized ? child.coreData.mainWindow.bounds.x + 8 : child.coreData.mainWindow.bounds.x,
          y: child.coreData.mainWindow.isMaximized ? child.coreData.mainWindow.bounds.y + 78 : child.coreData.mainWindow.bounds.y + 70,
          width: child.coreData.mainWindow.isMaximized ? child.coreData.mainWindow.bounds.width - 15 : child.coreData.mainWindow.bounds.width - 2,
          height: child.coreData.mainWindow.isMaximized ? child.coreData.mainWindow.bounds.height - 84 : child.coreData.mainWindow.bounds.height - 72,
        };

        win.setBounds(new_bounds);
      }
    }

    if (setting.url) {
      win.loadURL(setting.url, {
        referrer: setting.referrer,
        userAgent: setting.user_agent || child.coreData.var.core.user_agent,
      });
    } else {
      win.loadURL(child.coreData.var.core.default_page || 'http://127.0.0.1:60080/newTab', {
        userAgent: setting.user_agent || child.coreData.var.core.user_agent,
      });
    }

    win.once('ready-to-show', function () {
      if (setting.windowType === 'main window') {
        win.show();
      } else if (setting.windowType === 'view window') {
        child.updateTab(setting);
        child.sendMessage({
          type: '[request-window-status]',
        });
      }
    });

    if (setting.webaudio === false) {
      win.webContents.audioMuted = true;
    }

    win.setMenuBarVisibility(false);

    if (!setting.user_agent || setting.user_agent == 'undefined') {
      setting.user_agent = child.coreData.var.core.user_agent;
    }

    if (setting.proxy) {
      win.webContents.session.setProxy({
        proxyRules: setting.proxy,
        proxyBypassRules: '127.0.0.1',
      });
    }

    function sendCurrentData() {
      if (setting.windowType === 'main window') {
        child.sendMessage({
          type: '[send-window-status]',
          options: setting,
          pid: child.id,
          index: child.index,
          mainWindow: {
            bounds: win.getBounds(),
            isMaximized: win.isMaximized(),
            hide: win.isMinimized() || !win.isVisible(),
          },
          screen: {
            bounds: child.electron.screen.getPrimaryDisplay().bounds,
          },
        });
      }
    }
    win.on('move', function () {
      sendCurrentData();
    });
    win.on('resize', function () {
      sendCurrentData();
    });

    win.on('restore', function () {
      sendCurrentData();
    });
    win.on('minimize', function () {
      sendCurrentData();
    });
    win.on('unmaximize', function () {
      sendCurrentData();
    });
    win.on('maximize', function () {
      sendCurrentData();
    });
    win.on('hide', function () {
      sendCurrentData();
    });
    win.on('show', function () {
      sendCurrentData();
    });
    win.on('focus', function () {
      sendCurrentData();
    });
    win.on('close', (e) => {
      win.destroy();
    });

    win.on('closed', () => {
    //  process.exit();
    });

    win.on('app-command', (e, cmd) => {
      // Navigate the window back when the user hits their mouse back button
      // APPCOMMAND_BROWSER_BACKWARD converted to browser-backward
      if (cmd === 'browser-backward' && win.webContents.canGoBack()) {
        win.webContents.goBack();
      } else if (cmd === 'browser-forward' && win.webContents.canGoForward()) {
        win.webContents.goForward();
      }
    });

    win.webContents.on('page-title-updated', (e) => {
      child.updateTab(setting);
    });

    win.webContents.on('page-favicon-updated', (e, urls) => {
      setting.icon = urls[0];
      setting.favicon = urls[0];
      child.updateTab(setting);
    });
    let loading_icon = 'http://127.0.0.1:60080/images/loading-white.gif';

    win.webContents.on('did-start-loading', (e, urls) => {
      setting.icon = loading_icon;
      child.updateTab(setting);
    });
    win.webContents.on('did-stop-loading', (e) => {
      setting.icon = setting.favicon;
      child.updateTab(setting);
    });
    win.webContents.on('did-finish-load', (e,) => {
      setting.icon = setting.favicon;
      child.updateTab(setting);
    });
    win.webContents.on('did-fail-load', (e) => {
      setting.icon = setting.favicon;
      child.updateTab(setting);
    });

    win.webContents.on('update-target-url', (e, url) => {
      url = url.replace('#___new_tab___', '').replace('#___new_popup___', '');
      win.webContents.send('[send-render-message]', {
        name: 'update-target-url',
        url: decodeURI(url),
      });
    });

    win.webContents.on('dom-ready', (e) => {
      win.setBounds({ width: win.getBounds().width + 1 });
      win.setBounds({ width: win.getBounds().width - 1 });
    });

    win.webContents.on('unresponsive', async () => {
      const options = {
        type: 'info',
        title: 'Window unresponsive',
        message: 'This Window has been suspended',
        buttons: ['Reload', 'Close'],
      };

      dialog.showMessageBox(options, function (index) {
        if (index === 0) {
          win.webContents.forcefullyCrashRenderer();
          win.webContents.reload();
        } else {
          win.close();
        }
      });
    });

    win.webContents.on('crashed', (e) => {
      win.webContents.forcefullyCrashRenderer();
      win.webContents.reload();
    });

    win.webContents.on('did-get-redirect-request', (e) => {
      if (e.isMainFrame) {
        win.loadURL(e.newURL);
      }
    });

    win.webContents.on('will-navigate', (e, url) => {
      // when user click on link _blank
    });

    win.webContents.on('will-redirect', (e, url) => {
      child.coreData.var.overwrite.urls.forEach((data) => {
        if (url.like(data.from)) {
          if (data.time && new Date().getTime() - data.time < 3000) {
            return;
          }

          if (data.ignore && url.like(data.ignore)) {
            return;
          }
          e.preventDefault();
          win.loadURL(data.to);
        }
      });
    });

    win.webContents.on('new-window', function (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) {
      event.preventDefault();

      const loadOptions = {
        httpReferrer: referrer,
      };
      if (postBody != null) {
        const { data, contentType, boundary } = postBody;
        loadOptions.postData = postBody.data;
        loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`;
      }

      let real_url = url || event.url || '';

      if (real_url.like('https://www.youtube.com/watch*')) {
        real_url = 'https://www.youtube.com/embed/' + real_url.split('=')[1].split('&')[0];

        child.createNewWindow({
          windowType: 'youtube',
          title: 'YouTube',
          width: 440,
          height: 330,
          x: child.coreData.options.screen.bounds.width - 460,
          y: child.coreData.options.screen.bounds.height - 350,
          backgroundColor: '#030303',
          center: false,
          url: real_url,
          partition: setting.partition,
          user_name: setting.user_name,
        });
        return;
      } else if (real_url.like('https://www.youtube.com/embed*')) {
        child.createNewWindow({
          windowType: 'youtube',
          title: 'YouTube',
          width: 440,
          height: 330,
          x: child.coreData.options.screen.bounds.width - 460,
          y: child.coreData.options.screen.bounds.height - 350,
          backgroundColor: '#030303',
          center: false,
          url: real_url,
          partition: setting.partition,
          user_name: setting.user_name,
        });
        return;
      }

      event.options = event.options || {
        url: url,
      };

      let url_p = child.url.parse(event.options.url);

      if (event.options.url.like('*#___new_tab___*')) {
        child.sendMessage('[send-render-message]', {
          name: '[open new tab]',
          url: event.options.url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
          partition: setting.partition,
          user_name: setting.user_name,
        });
        return;
      }

      if (event.options.url.like('*#___trusted_window___*')) {
        child.sendMessage('[send-render-message]', {
          name: 'new_trusted_window',
          url: event.options.url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
          show: true,
          partition: setting.partition,
          user_name: setting.user_name,
        });
        return;
      }

      if (event.options.url.like('*#___new_popup___*')) {
        child.sendMessage('[send-render-message]', {
          name: 'new_popup',
          url: event.options.url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
          show: true,
          alwaysOnTop: true,
          partition: setting.partition,
          user_name: setting.user_name,
        });
        return;
      }

      let url2_p = browser.url.parse(view.window.getURL());

      if (url_p.host.contains(url2_p.host) && browser.var.blocking.popup.allow_internal) {
        child.sendMessage('[send-render-message]', {
          name: '[open new tab]',
          url: url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
          partition: setting.partition,
          user_name: setting.user_name,
        });
      } else if (!url_p.host.contains(url2_p.host) && browser.var.blocking.popup.allow_external) {
        child.sendMessage('[send-render-message]', {
          name: '[open new tab]',
          url: url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
          partition: setting.partition,
          user_name: setting.user_name,
        });
      } else {
        let allow = false;
        browser.var.blocking.popup.white_list.forEach((d) => {
          if (url_p.host.like(d.url) || url2_p.host.like(d.url)) {
            allow = true;
          }
        });
        if (allow) {
          child.sendMessage('[send-render-message]', {
            name: '[open new tab]',
            url: url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
            partition: setting.partition,
            user_name: setting.user_name,
          });
        }
      }
    });

    return win;
  };
};
