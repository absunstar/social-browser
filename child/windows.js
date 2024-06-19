module.exports = function (child) {
  child.assignWindows = [];
  child.offset = {
    x: 8,
    y: 78,
    y2: 70,
    width: 15,
    width2: 2,
    height: 84,
    height2: 72,
  };
  child.getMainWindow = function () {
    return child.windowList.find((w) => w.customSetting && w.customSetting.windowType == 'main');
  };

  child.getWindow = function () {
    if (child.window && !child.window.isDestroyed()) {
      return child.window;
    }
    if (child.mainWindow && !child.mainWindow.isDestroyed()) {
      return child.mainWindow;
    }
    if (child.getMainWindow() && !child.getMainWindow().isDestroyed()) {
      return child.getMainWindow();
    }
    return null;
  };

  child.showAddressbarWindow = function (op, show = true) {
    let w = child.windowList.find((w) => w.customSetting.windowType === 'main' && w.window && !w.window.isDestroyed());
    if (!w) {
      return;
    }
    let win = w.window;
    if (!win || win.isDestroyed()) {
      return;
    }

    if (!child.addressbarWindow || child.addressbarWindow.isDestroyed()) {
      child.addressbarWindow = child.createNewWindow({
        url: child.url.format({
          pathname: child.path.join(child.parent.files_dir, 'html', 'address-bar.html'),
          protocol: 'file:',
          slashes: true,
        }),
        windowType: 'addressbar',
        show: false,
        width: win.getBounds().width - 200,
        height: 500,
        x: win.getBounds().x - 90,
        y: win.getBounds().y - 70,
        alwaysOnTop: false,
        skipTaskbar: true,
        resizable: false,
        fullscreenable: false,
        title: 'Address-bar',
        backgroundColor: '#ffffff',
        frame: false,
        webPreferences: {
          contextIsolation: false,
          partition: 'addressbar',
          preload: child.parent.files_dir + '/js/context-menu.js',
          nativeWindowOpen: false,
          nodeIntegration: true,
          experimentalFeatures: false,
          webSecurity: false,
          allowRunningInsecureContent: true,
          plugins: true,
        },
      });
    }

    if (show && child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
      child.addressbarWindow.send('[set-address-url]', op);
      child.addressbarWindow.setBounds({
        width: win.getBounds().width - 200,
        height: 500,
        x: win.getBounds().x + 140,
        y: win.getBounds().y + 40,
      });
      child.addressbarWindow.show();
    }
  };

  child.showProfilesWindow = function (show = true) {
    let w = child.windowList.find((w) => w.customSetting.windowType === 'main' && w.window && !w.window.isDestroyed());
    if (!w) {
      return;
    }
    let win = w.window;
    if (!win || win.isDestroyed()) {
      return;
    }

    if (!child.profilesWindow || child.profilesWindow.isDestroyed()) {
      child.profilesWindow = child.createNewWindow({
        url: child.url.format({
          pathname: child.path.join(child.parent.files_dir, 'html', 'user-profiles.html'),
          protocol: 'file:',
          slashes: true,
        }),
        windowType: 'profiles',
        show: false,
        width: 500,
        height: 800,
        x: win.getBounds().x + (win.getBounds().width - 500),
        y: (win.getBounds().y == -8 ? 0 : win.getBounds().y - 5) + 30,
        alwaysOnTop: false,
        resizable: false,
        fullscreenable: false,
        title: 'profiles',
        backgroundColor: '#ffffff',
        frame: false,
        skipTaskbar: true,
        webPreferences: {
          contextIsolation: false,
          partition: 'profiles',
          preload: child.parent.files_dir + '/js/context-menu.js',
          nativeWindowOpen: false,
          nodeIntegration: true,
          experimentalFeatures: false,
          webSecurity: false,
          allowRunningInsecureContent: true,
          plugins: true,
        },
      });
    }
    if (show && child.profilesWindow && !child.profilesWindow.isDestroyed()) {
      child.profilesWindow.setBounds({
        x: win.getBounds().x + (win.getBounds().width - 500),
        y: (win.getBounds().y == -8 ? 0 : win.getBounds().y - 5) + 30,
      });
      child.profilesWindow.show();
    }
  };

  child.sendCurrentDataLoop = function () {
    if (child.sendCurrentDataAllow) {
      child.sendCurrentDataAllow = false;

      if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
        child.addressbarWindow.hide();
      }
      if (child.profilesWindow && !child.profilesWindow.isDestroyed()) {
        child.profilesWindow.hide();
      }

      child.windowList.forEach((w) => {
        if (w.customSetting.windowType === 'main' && !w.window.isDestroyed()) {
          let data = {
            type: '[send-window-status]',
            mainWindow: {
              id: w.window.id,
              bounds: w.window.getBounds(),
              isMaximized: w.window.isMaximized(),
              hide: w.window.isMinimized() || !w.window.isVisible(),
            },
            screen: {
              bounds: child.electron.screen.getPrimaryDisplay().bounds,
            },
          };

          child.sendMessage(data);
        }
      });
    }

    setTimeout(() => {
      child.sendCurrentDataLoop();
    }, 10);
  };

  child.createNewWindow = function (setting) {
    delete setting.name;
    let parent = child.parent;
    setting.partition = setting.partition || child.partition || parent.var.core.session.name;
    let defaultSetting = {
      vip: false,
      allowMenu: true,
      allowDevTools: true,
      allowDownload: true,
      allowAds: false,
      allowNewWindows: true,
      allowSaveUserData: true,
      allowSaveUrls: true,
      allowSocialBrowser: true,
      allowRedirect: true,
      allowSelfRedirect: true,
      allowSelfWindow: false,
      allowJavascript: true,
      allowAudio: true,
      allowPopup: false,
      show: setting.show === true ? true : false,
      alwaysOnTop: false,
      skipTaskbar: setting.skipTaskbar || false,
      resizable: true,
      width: 1200,
      height: 720,
      x: 0,
      y: 0,
      minWidth: 280,
      minHeight: 200,
      fullscreenable: true,
      title: 'New Window',
      backgroundColor: '#e8eaed',
      frame: true,
      icon: parent.icon,
      autoHideMenuBar: true,
      enableLargerThanScreen: true,
      hasShadow: false,
      roundedCorners: false,
      webPreferences: {
        devTools: true,
        spellcheck: false,
        sandbox: false,
        contextIsolation: false, // false -> can access preload window functions
        partition: setting.partition,
        preload: setting.preload || child.parent.files_dir + '/js/context-menu.js',
        javascript: true,
        nativeWindowOpen: false,
        nodeIntegration: false,
        nodeIntegrationInSubFrames: false, // google login error
        nodeIntegrationInWorker: false,
        experimentalFeatures: false,
        experimentalCanvasFeatures: true,
        navigateOnDragDrop: true,
        webSecurity: true,
        allowRunningInsecureContent: false,
        plugins: true,
      },
    };

    if (setting.windowType === 'main') {
      defaultSetting.show = true;
      defaultSetting.frame = false;
      defaultSetting.webPreferences.nodeIntegration = true;
      defaultSetting.webPreferences.nodeIntegrationInWorker = true;
      defaultSetting.webPreferences.webSecurity = false;
      defaultSetting.webPreferences.allowRunningInsecureContent = true;
    } else if (setting.windowType === 'youtube') {
      setting.url = 'browser://youtube-view?url=' + setting.url;
      setting.iframe = true;
      setting.show = true;
      setting.alwaysOnTop = true;
      setting.width = 520;
      setting.height = 330;
      setting.x = parent.options.screen.bounds.width - 550;
      setting.y = parent.options.screen.bounds.height - 400;
      setting.backgroundColor = '#030303';
      setting.center = false;
      defaultSetting.webPreferences.allowRunningInsecureContent = true;
      defaultSetting.webPreferences.webSecurity = false;
    } else if (setting.windowType.contains('popup')) {
      defaultSetting.alwaysOnTop = true;
    } else if (setting.windowType === 'view') {
      defaultSetting.show = false;
      defaultSetting.skipTaskbar = true;
      defaultSetting.frame = false;
      defaultSetting.resizable = false;
    } else if (setting.windowType === 'addressbar') {
      defaultSetting.show = false;
      defaultSetting.alwaysOnTop = false;
      defaultSetting.skipTaskbar = true;
      defaultSetting.resizable = false;
      defaultSetting.frame = false;
      defaultSetting.fullscreenable = false;
      defaultSetting.allowAudio = false;
    } else if (setting.windowType === 'profiles') {
      defaultSetting.show = false;
      defaultSetting.alwaysOnTop = false;
      defaultSetting.skipTaskbar = true;
      defaultSetting.resizable = false;
      defaultSetting.fullscreenable = false;
      defaultSetting.frame = false;
      defaultSetting.allowAudio = false;
    } else if (setting.windowType === 'updates') {
      defaultSetting.show = false;
      defaultSetting.alwaysOnTop = false;
      defaultSetting.skipTaskbar = true;
      defaultSetting.resizable = true;
      defaultSetting.frame = true;
      defaultSetting.allowAudio = false;
      defaultSetting.center = true;
    } else if (setting.windowType === 'none') {
      setting.url = 'https://www.google.com';
      defaultSetting.show = false;
      defaultSetting.alwaysOnTop = false;
      defaultSetting.skipTaskbar = true;
      defaultSetting.resizable = true;
      defaultSetting.frame = true;
      defaultSetting.allowAudio = false;
      defaultSetting.center = true;
    }

    if (setting.show === false) {
      defaultSetting.show = false;
    }
    if (setting.alwaysOnTop === false) {
      defaultSetting.alwaysOnTop = false;
    }
    if (setting.trusted === true) {
      defaultSetting.webPreferences.nodeIntegration = true;
      defaultSetting.webPreferences.nodeIntegrationInWorker = true;
      defaultSetting.webPreferences.webSecurity = false;
      defaultSetting.webPreferences.allowRunningInsecureContent = true;
    }

    if (setting.security === false) {
      defaultSetting.webPreferences.webSecurity = false;
      defaultSetting.webPreferences.allowRunningInsecureContent = true;
    }
    if (setting.iframe === true) {
      defaultSetting.webPreferences.nodeIntegrationInSubFrames = true;
    }
    if (Array.isArray(setting.cookieList)) {
      if (setting.cookieList.length > 0) {
        setting.cookieList.forEach((cookieObject) => {
          cookieObject.domain = cookieObject.domain || child.url.parse(setting.url).hostname;
          cookieObject.partition = cookieObject.partition || setting.partition;

          let cookieIndex = child.cookieList.findIndex((c) => c.domain == cookieObject.domain && c.partition == cookieObject.partition);
          if (cookieIndex === -1) {
            child.cookieList.push({
              partition: cookieObject.partition,
              domain: cookieObject.domain,
              cookie: cookieObject.cookie,
              time: new Date().getTime(),
              lock: true,
            });
          } else {
            child.cookieList[cookieIndex].cookie = cookieObject.cookie;
            child.cookieList[cookieIndex].lock = true;
            child.cookieList[cookieIndex].time = new Date().getTime();
            child.cookieList[cookieIndex].off = false;
          }
          child.cookieList.sort((a, b) => {
            return b.time - a.time;
          });
          delete setting.cookieList;
        });
      } else {
        let domain = child.url.parse(setting.url).hostname;
        let partition = setting.partition;
        let cookieIndex = child.cookieList.findIndex((c) => domain.contains(c.domain) && c.partition == partition);
        if (cookieIndex !== -1) {
          child.cookieList[cookieIndex].off = true;
        }
      }
    }

    let customSetting = { ...defaultSetting, ...setting };

    customSetting.webPreferences.javascript = customSetting.allowJavascript;
    customSetting.webPreferences.webaudio = customSetting.allowAudio;

    customSetting.loading_icon = 'browser://images/loading-white.gif';
    customSetting.error_icon = 'browser://images/no.jpg';

    if (customSetting.vip) {
      customSetting.allowSaveUrls = false;
      customSetting.allowSaveUserData = false;
    }

    let win = new child.electron.BrowserWindow(customSetting);

    customSetting.windowID = win.id;
    win.customSetting = customSetting;
    win.customSetting.windowSetting = win.customSetting.windowSetting || [];

    if (win.customSetting.windowType === 'view') {
      win.customSetting.session = parent.var.session_list.find((s) => s.name == win.customSetting.partition);
      if (win.customSetting.session) {
        win.customSetting.userAgent = win.customSetting.session.defaultUserAgent;
      }
      if (!parent.var.core.active) {
        win.customSetting.url = 'http://127.0.0.1:60080/setting';
      }
    }

    win.customSetting.userAgent = win.customSetting.userAgent || win.customSetting.defaultUserAgent;

    if (!win.customSetting.userAgent || win.customSetting.userAgent == 'undefined') {
      win.customSetting.userAgent = parent.var.session_list.find((s) => s.name == win.customSetting.partition)?.defaultUserAgent || parent.var.core.defaultUserAgent.url;
    }

    if (win.customSetting.timeout) {
      setTimeout(() => {
        if (win && !win.isDestroyed()) {
          win.destroy();
        }
      }, win.customSetting.timeout);
    }
    if (!child.window) {
      child.window = win;
    }
    if (win.customSetting.eval) {
      win.customSetting.windowSetting = win.customSetting.windowSetting || [];
      win.customSetting.windowSetting.push({
        name: 'eval',
        code: win.customSetting.eval,
      });
    } else {
      win.customSetting.windowSetting = win.customSetting.windowSetting || [];
      win.customSetting.windowSetting.forEach((d, i) => {
        if (d.name == 'eval') {
          win.customSetting.windowSetting.splice(i, 1);
        }
      });
    }
    let oldWIndex = child.windowList.findIndex((w) => w.id == win.id);
    if (oldWIndex === -1) {
      child.windowList.push({
        id: win.id,
        id2: win.webContents.id,
        window: win,
        customSetting: win.customSetting,
      });
    } else {
      child.windowList[oldWIndex].id2 = win.webContents.id;
      child.windowList[oldWIndex].window = win;
      child.windowList[oldWIndex].customSetting = win.customSetting;
    }

    if (win.customSetting.center) {
      win.center();
    }
    if (win.customSetting.maximize) {
      win.maximize();
    }
    if (win.customSetting.minimize) {
      win.minimize();
    }

    if (win.customSetting.parentSetting && win.customSetting.parentSetting.windowID) {
      child.assignWindows.push({
        parentWindowID: win.customSetting.parentSetting.windowID,
        childWindowID: win.id,
      });
    }

    if (win.customSetting.windowType === 'main') {
      child.mainWindow = win;
      win.center();
    } else if (win.customSetting.windowType === 'view') {
      if (child.speedMode) {
        if (!child.currentView) {
          child.currentView = win.customSetting;
        }

        if ((mainWindow = child.getMainWindow())) {
          let bounds = mainWindow.getBounds();
          let new_bounds = {
            x: mainWindow.isMaximized() ? bounds.x + child.offset.x : bounds.x,
            y: mainWindow.isMaximized() ? bounds.y + child.offset.y : bounds.y + child.offset.y2,
            width: mainWindow.isMaximized() ? bounds.width - child.offset.width : bounds.width - child.offset.width2,
            height: mainWindow.isMaximized() ? bounds.height - child.offset.height : bounds.height - child.offset.height2,
          };
          win.setBounds(new_bounds);
        }
      } else {
        if ((mainWindow = child.parent.lastWindowStatus)) {
          let bounds = mainWindow.bounds;
          let new_bounds = {
            x: mainWindow.isMaximized ? bounds.x + child.offset.x : bounds.x,
            y: mainWindow.isMaximized ? bounds.y + child.offset.y : bounds.y + child.offset.y2,
            width: mainWindow.isMaximized ? bounds.width - child.offset.width : bounds.width - child.offset.width2,
            height: mainWindow.isMaximized ? bounds.height - child.offset.height : bounds.height - child.offset.height2,
          };

          win.setBounds(new_bounds);
        }
      }
    }

    if (win.customSetting.url) {
      win.loadURL(win.customSetting.url, {
        httpReferrer: win.customSetting.referrer || win.customSetting.referer,
        userAgent: win.customSetting.userAgent || parent.var.core.defaultUserAgent.url,
      });
    } else {
      win.loadURL(parent.var.core.default_page || 'http://127.0.0.1:60080/newTab', {
        userAgent: win.customSetting.userAgent || parent.var.core.defaultUserAgent.url,
      });
    }

    if (win.customSetting.trackingID) {
      child.sendMessage({ type: '[tracking-info]', trackingID: win.customSetting.trackingID, windowID: win.id, created: true });
    }

    win.once('ready-to-show', function () {
      if (win.customSetting.showDevTools) {
        win.openDevTools();
      }
      win.webContents.audioMuted = !win.customSetting.allowAudio;
      win.customSetting.title = win.customSetting.title || win.customSetting.url;
      if (win.customSetting.windowType === 'main') {
        win.show();

        child.showAddressbarWindow({}, false);
        child.showProfilesWindow(false);
        win.webContents.send('[open new tab]', win.customSetting.newTabData);
      } else if (win.customSetting.windowType === 'view') {
        child.updateTab(win);

        child.sendMessage({
          type: '[request-window-status]',
        });
        if (win.customSetting.allowSaveUrls) {
          child.sendMessage({
            type: '[add-window-url]',
            url: child.decodeURI(win.getURL()),
            title: win.getTitle(),
            logo: win.customSetting.favicon,
          });
        }
      } else if (win.customSetting.windowType === 'none') {
        win.close();
      }
    });

    win.setMenuBarVisibility(false);

    if ((proxy = win.customSetting.proxy)) {
      let ss = win.webContents.session;
      proxy.url = proxy.url || '';
      proxy.url = proxy.url.replace('http://', '').replace('https://', '').replace('ftp://', '').replace('socks4://', '').replace('socks4://', '');
      let arr = proxy.url.split(':');
      if (arr.length > 1) {
        proxy.ip = arr[0];
        proxy.port = arr[1];
      }
      let proxyRules = '';
      let startline = '';
      if (proxy.socks4) {
        proxyRules += startline + 'socks4://' + proxy.ip + ':' + proxy.port;
        startline = ',';
      }
      if (proxy.socks5) {
        proxyRules += startline + 'socks5://' + proxy.ip + ':' + proxy.port;
        startline = ',';
      }
      if (proxy.ftp) {
        proxyRules += startline + 'ftp://' + proxy.ip + ':' + proxy.port;
        startline = ',';
      }
      if (proxy.http) {
        proxyRules += startline + 'http://' + proxy.ip + ':' + proxy.port;
        startline = ',';
      }
      if (proxy.https) {
        proxyRules += startline + 'https://' + proxy.ip + ':' + proxy.port;
        startline = ',';
      }
      if (proxyRules == '') {
        proxyRules = proxy.ip + ':' + proxy.port;
        startline = ',';
      }

      ss.setProxy({
        mode: proxy.mode,
        proxyRules: proxyRules,
        proxyBypassRules: proxy.ignore || '127.0.0.1',
      }).then(() => {
        // child.log('window Proxy Set : ' + proxyRules);
      });
    } else {
      child.handleSession({ name: win.customSetting.partition });
    }

    win.on('blur', function () {
      if (win.customSetting.windowType == 'addressbar' || win.customSetting.windowType == 'profiles') {
        win.hide();
      }
    });

    if (win.customSetting.windowType === 'main') {
      child.sendCurrentDataLoop();
    }

    function sendCurrentData() {
      if (win.customSetting.windowType === 'main') {
        child.sendCurrentDataAllow = true;
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
      if (win.customSetting.windowType !== 'addressbar') {
        child.sendMessage({
          type: '[to-all]',
          name: 'hide-addressbar',
        });
      }
    });

    // win.webContents.on('will-prevent-unload', (event) => {
    //   const choice = child.electron.dialog.showMessageBoxSync(win, {
    //     type: 'question',
    //     buttons: ['Leave', 'Stay'],
    //     title: 'Do you want to leave this site?',
    //     message: 'Changes you made may not be saved.',
    //     defaultId: 0,
    //     cancelId: 1,
    //   });
    //   const leave = choice === 0;
    //   if (leave) {
    //     event.preventDefault();
    //   }
    // });

    win.on('close', (e) => {
      // can be cancel here
      if (win.customSetting.trackingID) {
        child.sendMessage({ type: '[tracking-info]', trackingID: customSetting.trackingID, windowID: customSetting.windowID, isClosed: true });
      }
      child.sendToWindows('[window-event]', {
        windowID: customSetting.windowID,
        options: customSetting,
        name: 'close',
      });

      child.windowList.forEach((w, i) => {
        if (w.id == customSetting.windowID) {
          child.windowList.splice(i, 1);
        }
      });
    });

    win.on('closed', () => {
      win = null;
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
      setTimeout(() => {
        child.handleWindowBounds();
      }, 100);

      setTimeout(() => {
        if (win && !win.isDestroyed()) {
          win.show();
          setTimeout(() => {
            win.setAlwaysOnTop(true);
            win.show();
          }, 20);
        }
      }, 200);
    });
    win.on('leave-full-screen', (e) => {
      setTimeout(() => {
        child.handleWindowBounds();
        if (win && !win.isDestroyed()) {
          win.show();
          if (!win.customSetting.windowType.like('*youtube*')) {
            win.setAlwaysOnTop(false);
          }
        }
      }, 100);
    });
    win.on('enter-html-full-screen', (e) => {
      setTimeout(() => {
        child.handleWindowBounds();
      }, 100);

      setTimeout(() => {
        if (win && !win.isDestroyed()) {
          win.show();
          setTimeout(() => {
            win.setAlwaysOnTop(true);
            win.show();
          }, 20);
        }
      }, 200);
    });
    win.on('leave-html-full-screen', (e) => {
      setTimeout(() => {
        child.handleWindowBounds();
        if (win && !win.isDestroyed()) {
          if (!win.customSetting.windowType.like('*youtube*')) {
            win.setAlwaysOnTop(false);
          }
          win.show();
        }
      }, 100);
    });

    win.webContents.on('context-menu', (event, params) => {
      if (!win.customSetting.allowMenu) {
        return;
      }
      if (win && !win.isDestroyed()) {
        win.webContents.send('context-menu', params);
        return;
      }

      const menu = new child.electron.Menu();

      // Add each spelling suggestion
      for (const suggestion of params.dictionarySuggestions) {
        event.preventDefault();
        menu.append(
          new child.electron.MenuItem({
            label: suggestion,
            click: () => win.webContents.replaceMisspelling(suggestion),
          })
        );
      }

      // Allow users to add the misspelled word to the dictionary
      if (params.misspelledWord) {
        menu.append(
          new child.electron.MenuItem({
            label: 'Add to dictionary',
            click: () => win.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord),
          })
        );
      }

      menu.append(
        new child.electron.MenuItem({
          label: 'Refresh',
          click: () => win.webContents.reload(),
        })
      );
      menu.append(
        new child.electron.MenuItem({
          type: 'separator',
        })
      );
      menu.append(
        new child.electron.MenuItem({
          label: 'Developer Tools',
          click: () => win.openDevTools(),
        })
      );

      menu.popup();
    });

    win.webContents.on('before-input-event', (event, input) => {
      // For example, only enable application menu keyboard shortcuts when
      // Ctrl/Cmd are down.
      // if (win && !win.isDestroyed()) {
      //   win.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta);
      // }
    });

    win.on('page-title-updated', (e, title) => {
      win.customSetting.title = title;
      child.updateTab(win);
      if (win.customSetting.allowSaveUrls) {
        child.sendMessage({
          type: '[add-window-url]',
          url: child.decodeURI(win.getURL()),
          title: title,
          logo: win.customSetting.favicon,
          ignoreCounted: true,
        });
      }
    });

    win.webContents.on('page-favicon-updated', (e, urls) => {
      if (urls[0]) {
        win.customSetting.iconURL = urls[0];
        win.customSetting.favicon = urls[0];
        child.updateTab(win);
        if (win.customSetting.allowSaveUrls) {
          child.sendMessage({
            type: '[add-window-url]',
            url: child.decodeURI(win.getURL()),
            title: win.getTitle(),
            logo: win.customSetting.favicon,
            ignoreCounted: true,
          });
        }
      }
    });

    win.webContents.on('did-start-loading', (e, urls) => {
      win.customSetting.iconURL = win.customSetting.loading_icon;
      child.updateTab(win);
    });
    win.webContents.on('did-stop-loading', (e) => {
      win.customSetting.iconURL = win.customSetting.favicon;
      child.updateTab(win);
    });
    win.webContents.on('did-finish-load', (e) => {
      win.customSetting.iconURL = win.customSetting.favicon;
      child.updateTab(win);
    });
    win.webContents.on('did-fail-load', (...callback) => {
      callback[0].preventDefault();
      if (callback[4] /* is main frame */) {
        if (child.parent.var.blocking.proxy_error_remove_proxy && win.customSetting.proxy) {
          child.sendMessage({
            type: '[remove-proxy]',
            proxy: win.customSetting.proxy,
          });
        }

        if (win.customSetting.windowType.like('*popup*')) {
          if (win.customSetting.proxy || child.parent.var.blocking.proxy_error_close_window) {
            win.close();
          }
        } else {
          win.customSetting.iconURL = win.customSetting.error_icon;
          child.updateTab(win);
        }
      }

      // win.loadURL('browser://error?url=' + win.getURL() + '&description=Error While Loading');
    });

    win.webContents.on('update-target-url', (e, url) => {
      url = url.replace('#___new_tab___', '').replace('#___new_popup___', '');
      if (win && !win.isDestroyed()) {
        win.webContents.send('[send-render-message]', {
          name: 'update-target-url',
          url: child.decodeURI(url),
        });
      }
    });

    win.webContents.on('dom-ready', (e) => {
      if (win.customSetting.trackingID) {
        child.sendMessage({ type: '[tracking-info]', trackingID: win.customSetting.trackingID, windowID: win.id, loaded: true });
      }
      if (win && !win.isDestroyed()) {
        // win.setBounds({ width: win.getBounds().width + 1 });
        // win.setBounds({ width: win.getBounds().width - 1 });

        if (win.customSetting.allowSaveUrls) {
          child.sendMessage({
            type: '[add-window-url]',
            url: child.decodeURI(win.getURL()),
            title: win.getTitle(),
            logo: win.customSetting.favicon,
          });
        }
      }
    });

    win.on('unresponsive', async () => {
      child.log('unresponsive');
      if (win.customSetting.windowType == 'view' && false) {
        const options = {
          type: 'info',
          title: 'Window unresponsive',
          message: 'This Window has been suspended',
          buttons: ['Re-Load Window', 'Close'],
        };
        if (win && !win.isDestroyed()) {
          child.electron.dialog.showMessageBox(win, options).then((index) => {
            if (index == 0) {
              win.webContents.reload();
            } else {
              win.close();
            }
          });
        }
      } else {
        setTimeout(() => {
          if (win && !win.isDestroyed()) {
            win.webContents.reload();
          }
        }, 1000 * 1);
      }
    });

    win.webContents.on('render-process-gone', (e, details) => {
      child.log('render-process-gone');
      setTimeout(() => {
        if (win && !win.isDestroyed()) {
          win.webContents.reload();
        }
      }, 1000 * 2);
    });

    win.webContents.on('will-redirect', (e, url) => {
      child.log('will-redirect : ', url);
      if ((!win.customSetting.allowAds && !child.isAllowURL(url)) || !win.customSetting.allowRedirect) {
        e.preventDefault();
        child.log('Block-redirect', url);
      }

      if (win.customSetting.allowSelfRedirect && (win.getURL().contains(child.url.parse(url).hostname) || url.contains(child.url.parse(win.getURL()).hostname))) {
        return;
      }

      if ((info = child.getOverwriteInfo(url))) {
        if (info.overwrite) {
          if (win && !win.isDestroyed()) {
            e.preventDefault();
            win.loadURL(info.new_url);
          }
        }
      }
    });
    win.webContents.on('will-navigate', (details) => {
      win.customSetting.title = details.url;
      win.customSetting.iconURL = win.customSetting.loading_icon;
      child.updateTab(win);
    });

    win.webContents.on('will-frame-navigate', (details) => {
      child.log('will-frame-navigate : ', details.url);

      if (!win.customSetting.allowRedirect || (!win.customSetting.allowAds && !child.isAllowURL(details.url))) {
        details.preventDefault();
        child.log('Block-frame-navigate', details.url);
        return;
      }
    });

    if (win.webContents.setWindowOpenHandler) {
      // handle window.open ...
      win.webContents.setWindowOpenHandler(({ url, frameName }) => {
        if (!win.customSetting.allowNewWindows || (!win.customSetting.allowAds && !child.isAllowURL(url))) {
          child.log('Block-open-window', url);
          return { action: 'deny' };
        }

        if (win.customSetting.allowSelfWindow && win.customSetting.allowRedirect) {
          win.loadURL(url);
          return { action: 'deny' };
        }

        if (url === 'about:blank' || url.contains('accounts') || url.contains('login')) {
          return {
            action: 'allow',
            overrideBrowserWindowOptions: {
              ...customSetting,
              alwaysOnTop: true,
              skipTaskbar: false,
              show: true,
              frame: true,
              fullscreenable: false,
              backgroundColor: '#dddddd',
            },
          };
        }

        if (url.like('https://www.youtube.com/watch*')) {
          url = 'https://www.youtube.com/embed/' + url.split('=')[1].split('&')[0];

          child.createNewWindow({
            windowType: 'youtube',
            title: 'YouTube',
            url: url,
            partition: win.customSetting.partition,
            user_name: win.customSetting.user_name,
          });

          return { action: 'deny' };
        } else if (url.like('https://www.youtube.com/embed*')) {
          child.createNewWindow({
            windowType: 'youtube',
            title: 'YouTube',
            url: url,
            partition: win.customSetting.partition,
            user_name: win.customSetting.user_name,
          });
          return { action: 'deny' };
        }

        let url_parser = child.url.parse(url);
        let current_url_parser = child.url.parse(win.getURL());

        let allow = false;

        if (win.customSetting.allowPopup) {
          allow = true;
        } else {
          allow = parent.var.blocking.white_list.some((d) => url_parser.hostname.like(d.url) || current_url_parser.hostname.like(d.url));
          if (!allow) {
            allow = parent.var.blocking.popup.white_list.some((d) => url_parser.hostname.like(d.url) || current_url_parser.hostname.like(d.url));
          }
          if (!allow) {
            if (parent.var.blocking.popup.allow_internal && url_parser.hostname.contains(current_url_parser.hostname)) {
              allow = true;
            } else if (parent.var.blocking.popup.allow_external && !url_parser.hostname.contains(current_url_parser.hostname)) {
              allow = true;
            }
          }
        }

        if (allow) {
          if (win.customSetting.windowType == 'view') {
            child.sendMessage({
              type: '[open new tab]',
              data: {
                ...win.customSetting,
                url: url,
                referrer: win.getURL(),
              },
            });
          } else {
            child.sendMessage({
              type: '[create-new-window]',
              options: {
                ...win.customSetting,
                url: url,
                referrer: win.getURL(),
              },
            });
          }
        }

        return { action: 'deny' };
      });

      win.webContents.on('did-create-window', (win, { url, frameName, options, disposition, referrer, postData }) => {
        child.log('did-create-window', url);
        win.center();
      });
    }
    win.webContents.on('new-window', function (event, url, frameName, disposition, options, referrer, postBody) {
      event.preventDefault();

      if (!win || win.isDestroyed()) {
        return;
      }

      let real_url = url || event.url || '';
      child.log('\n new-window', real_url);
      if (real_url.like('https://www.youtube.com/watch*')) {
        real_url = 'https://www.youtube.com/embed/' + real_url.split('=')[1].split('&')[0];

        child.createNewWindow({
          windowType: 'youtube',
          title: 'YouTube',
          url: real_url,
          partition: win.customSetting.partition,
          user_name: win.customSetting.user_name,
        });

        return;
      } else if (real_url.like('https://www.youtube.com/embed*')) {
        child.createNewWindow({
          windowType: 'youtube',
          title: 'YouTube',
          url: real_url,
          partition: win.customSetting.partition,
          user_name: win.customSetting.user_name,
        });
        return;
      }

      if (!win.customSetting.allowAds && !child.isAllowURL(real_url)) {
        child.log('Block-redirect', real_url);
        return false;
      }

      if (real_url.like('*about:blank*')) {
        child.log('Block-redirect', real_url);
        return false;
      }

      const loadOptions = {
        httpReferrer: referrer,
      };

      if (postBody != null) {
        const { data, contentType, boundary } = postBody;
        loadOptions.postData = postBody.data;
        loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`;
      }

      if (real_url.like('*#___new_tab___*')) {
        child.sendMessage({
          type: '[open new tab]',
          url: real_url.replace('#___new_tab___', '').replace('#___new_popup___', '').replace('#___trusted_window___', ''),
          partition: win.customSetting.partition,
          user_name: win.customSetting.user_name,
        });
        return;
      }

      if (real_url.like('*#___trusted_window___*')) {
        child.createNewWindow({
          windowType: 'popup',
          title: 'New Popup',
          backgroundColor: '#ffffff',
          center: true,
          trusted: true,
          url: real_url.replace('#___new_tab___', '').replace('#___new_popup___', '').replace('#___trusted_window___', ''),
          partition: win.customSetting.partition,
          user_name: win.customSetting.user_name,
        });
        return;
      }

      if (real_url.like('*#___new_popup___*')) {
        child.createNewWindow({
          windowType: 'popup',
          title: 'New Popup',
          backgroundColor: '#ffffff',
          center: true,
          url: real_url.replace('#___new_tab___', '').replace('#___new_popup___', '').replace('#___trusted_window___', ''),
          partition: win.customSetting.partition,
          user_name: win.customSetting.user_name,
        });
        return;
      }

      let url_parser = child.url.parse(real_url);
      let current_url_parser = child.url.parse(win.getURL());

      let allow = false;

      allow = parent.var.blocking.white_list.find((d) => url_parser.hostname.like(d.url) || current_url_parser.hostname.like(d.url));

      if (allow) {
        child.sendMessage({
          type: '[open new tab]',
          data: {
            url: real_url,
            partition: win.customSetting.partition,
            user_name: win.customSetting.user_name,
            options: parent.options,
          },
        });
        return;
      }

      allow = parent.var.blocking.popup.white_list.find((d) => url_parser.hostname.like(d.url) || current_url_parser.hostname.like(d.url));

      if (allow) {
        child.sendMessage({
          type: '[open new tab]',
          data: {
            url: real_url,
            partition: win.customSetting.partition,
            user_name: win.customSetting.user_name,
            options: parent.options,
          },
        });
        return;
      }

      if (parent.var.blocking.popup.allow_internal && url_parser.hostname.contains(current_url_parser.hostname)) {
        child.sendMessage({
          type: '[open new tab]',
          data: {
            url: real_url,
            partition: win.customSetting.partition,
            user_name: win.customSetting.user_name,
            options: parent.options,
          },
        });
      } else if (parent.var.blocking.popup.allow_external && !url_parser.hostname.contains(current_url_parser.hostname)) {
        child.sendMessage({
          type: '[open new tab]',
          data: {
            url: real_url,
            partition: win.customSetting.partition,
            user_name: win.customSetting.user_name,
            options: parent.options,
          },
        });
      }
    });

    return win;
  };
};
