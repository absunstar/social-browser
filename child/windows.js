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
      minWidth: 280,
      minHeight: 200,
      fullscreenable: true,
      title: setting.title || 'New Tab',
      backgroundColor: setting.backgroundColor || '#ffffff',
      frame: setting.windowType.like('*youtube*'),
      icon: child.coreData.icon,
      webPreferences: {
        spellcheck: false,
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
        webSecurity: setting.windowType !== 'main window',
        allowRunningInsecureContent: setting.windowType === 'main window',
        plugins: true,
      },
    });

    if (!child.window) {
      child.window = win;
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
    win.on('enter-full-screen', (e) => {
      child.handleWindowBounds();
      setTimeout(() => {
        win.setAlwaysOnTop(true);
        win.show();
      }, 100);
    });
    win.on('leave-full-screen', (e) => {
      child.handleWindowBounds();
      win.setAlwaysOnTop(false);
      win.show();
    });
    win.on('enter-html-full-screen', (e) => {
      child.handleWindowBounds();
      setTimeout(() => {
        win.setAlwaysOnTop(true);
        win.show();
      }, 100);
    });
    win.on('leave-html-full-screen', (e) => {
      child.handleWindowBounds();
      win.setAlwaysOnTop(false);
      win.show();
    });

    win.webContents.on('context-menu', (event, params) => {
      const menu = new child.electron.Menu();

      // Add each spelling suggestion
      for (const suggestion of params.dictionarySuggestions) {
        event.preventDefault();
        menu.append(
          new MenuItem({
            label: suggestion,
            click: () => win.webContents.replaceMisspelling(suggestion),
          }),
        );
      }

      // Allow users to add the misspelled word to the dictionary
      if (params.misspelledWord) {
        menu.append(
          new MenuItem({
            label: 'Add to dictionary',
            click: () => win.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord),
          }),
        );
      }

      menu.popup();
    });

    win.webContents.on('before-input-event', (event, input) => {
      // For example, only enable application menu keyboard shortcuts when
      // Ctrl/Cmd are down.
      win.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta);
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
    win.webContents.on('did-finish-load', (e) => {
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


    win.webContents.on('will-navigate', (e, url) => {
      // when user click on link _blank
    });

    win.webContents.on('will-redirect', (e, url) => {
      let ok = false;
      child.coreData.var.overwrite.urls.forEach((data) => {
        if (url.like(data.from)) {
          if (data.time && new Date().getTime() - data.time < 3000) {
            return;
          }

          if (data.ignore && url.like(data.ignore)) {
            return;
          }
          ok = true;
          e.preventDefault();
          win.loadURL(data.to);
        }
      });
      // if (!ok) {
      //   win.loadURL(url);
      // }
    });

    win.webContents.on('new-window', function (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) {
      event.preventDefault();

      let real_url = url || event.url || '';

      console.log('new-window Event call ' + real_url);

      const loadOptions = {
        httpReferrer: referrer,
      };

      if (postBody != null) {
        const { data, contentType, boundary } = postBody;
        loadOptions.postData = postBody.data;
        loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`;
      }

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

      if (real_url.like('*#___new_tab___*')) {
        child.sendMessage({
          type: '[open new tab]',
          url: real_url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
          partition: setting.partition,
          user_name: setting.user_name,
        });
        return;
      }

      if (real_url.like('*#___trusted_window___*')) {
        child.sendMessage({
          name: 'new_trusted_window',
          url: real_url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
          show: true,
          partition: setting.partition,
          user_name: setting.user_name,
        });
        return;
      }

      if (real_url.like('*#___new_popup___*')) {
        child.createNewWindow({
          windowType: 'popup',
          title: 'New Popup',
          width: 800,
          height: 600,
          backgroundColor: '#ffffff',
          center: true,
          url: event.options.url,
          partition: setting.partition,
          user_name: setting.user_name,
        });
        return;
      }

      let url_parser = child.url.parse(real_url);
      let current_url_parser = child.url.parse(win.getURL());

      if (url_parser.host.contains(current_url_parser.host) && child.coreData.var.blocking.popup.allow_internal) {
        console.log('call internal url ' + real_url);
        child.sendMessage({
          type: '[send-render-message]',
          data: {
            name: '[open new tab]',
            url: real_url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
            partition: setting.partition,
            user_name: setting.user_name,
            options : child.coreData.options
          },
        });
      } else if (!url_parser.host.contains(current_url_parser.host) && child.coreData.var.blocking.popup.allow_external) {
        child.sendMessage({
          type: '[open new tab]',
          url: real_url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
          partition: setting.partition,
          user_name: setting.user_name,
        });
      } else {
        let allow = false;
        child.coreData.var.blocking.popup.white_list.forEach((d) => {
          if (url_parser.host.like(d.url) || current_url_parser.host.like(d.url)) {
            allow = true;
          }
        });
        if (allow) {
          child.sendMessage({
            type: '[open new tab]',
            url: real_url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
            partition: setting.partition,
            user_name: setting.user_name,
          });
        }
      }
    });

    return win;
  };
};
