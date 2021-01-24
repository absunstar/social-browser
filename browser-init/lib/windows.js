module.exports = function init(browser) {
  const electron = browser.electron;
  const { BrowserWindow, nativeImage, dialog, BrowserWindowProxy, ipcMain } = electron;

  browser.window_list = [];
  browser.main_window_list = [];
  browser.active_main_window = null;

  browser.get_main_window = function (id) {
    if (id) {
      browser.main_window_list.forEach((w) => {
        if (w.id == id) {
          return w;
        }
      });
    }

    if (browser.active_main_window && !browser.active_main_window.isDestroyed()) {
      return browser.active_main_window;
    }
    if (browser.main_window_list.length > 0) {
      return browser.main_window_list[0].window;
    }

    return browser.createNewSocialBrowserWindow();
  };

  browser.icons = [];
  browser.icons['darwin'] = browser.path.join(browser.files_dir, 'images', 'logo.icns');
  browser.icons['linux'] = browser.path.join(browser.files_dir, 'images', 'logo.png');
  browser.icons['win32'] = browser.path.join(browser.files_dir, 'images', 'logo.ico');

  //main event only from electron browser window
  browser.defaultNewWindowEvent = function (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) {
    event.preventDefault();

    const loadOptions = {
      httpReferrer: referrer,
    };
    if (postBody != null) {
      const { data, contentType, boundary } = postBody;
      loadOptions.postData = postBody.data;
      loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`;
    }

    let view = browser.getView();
    console.log('[browser.defaultNewWindowEvent]', view.id);

    let real_url = url || event.url || '';

    if (real_url.like('https://www.youtube.com/watch*')) {
      real_url = 'https://www.youtube.com/embed/' + real_url.split('=')[1].split('&')[0];
      browser.newYoutubeWindow({
        url: real_url,
        partition: view.partition,
        user_name: view.user_name,
        parent_id: view.id,
      });
      return;
    } else if (real_url.like('https://www.youtube.com/embed*')) {
      browser.newYoutubeWindow({
        url: real_url,
        partition: view.partition,
        user_name: view.user_name,
        parent_id: view.id,
      });
      return;
    }

    event.options = event.options || {
      url: url,
    };

    let url_p = browser.url.parse(event.options.url);

    console.log('call new url from new window ', event.options.url);

    if (event.options.url.like('*#___new_tab___*')) {
      browser.call('render_message', {
        name: '[open new tab]',
        url: event.options.url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
        partition: view.partition,
        user_name: view.user_name,
      });
      return;
    }

    if (event.options.url.like('*#___trusted_window___*')) {
      browser.call('render_message', {
        name: 'new_trusted_window',
        url: event.options.url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
        show: true,
        partition: view.partition,
        user_name: view.user_name,
      });
      return;
    }

    if (event.options.url.like('*#___new_popup___*')) {
      browser.call('render_message', {
        name: 'new_popup',
        url: event.options.url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
        show: true,
        alwaysOnTop: true,
        partition: view.partition,
        user_name: view.user_name,
        parent_id: view.id,
      });
      return;
    }

    let url2_p = browser.url.parse(view.window.getURL());

    if (url_p.host.contains(url2_p.host) && browser.var.blocking.popup.allow_internal) {
      browser.call('render_message', {
        name: '[open new tab]',
        url: url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
        partition: view.partition,
        user_name: view.user_name,
      });
    } else if (!url_p.host.contains(url2_p.host) && browser.var.blocking.popup.allow_external) {
      browser.call('render_message', {
        name: '[open new tab]',
        url: url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
        partition: view.partition,
        user_name: view.user_name,
      });
    } else {
      let allow = false;
      browser.var.blocking.popup.white_list.forEach((d) => {
        if (url_p.host.like(d.url) || url2_p.host.like(d.url)) {
          allow = true;
        }
      });
      if (allow) {
        browser.call('render_message', {
          name: '[open new tab]',
          url: url.replace('#___new_tab___', '').replace('#___new_popup__', '').replace('#___trusted_window___', ''),
          partition: view.partition,
          user_name: view.user_name,
        });
      } else {
        //console.log('Block Popup : ' + url)
      }
      // event.newGuest = browser.newWindow(event.options)
    }
  };

  browser.handleViewPosition = function (win) {
    if (!win || win.isDestroyed()) {
      return;
    }
    let view = browser.getView(win.id);
    if (view.full_screen == true) {
      let display = browser.electron.screen.getPrimaryDisplay();
      let width = display.bounds.width;
      let height = display.bounds.height;
      win.setBounds({
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
    } else {
      let bounds = browser.get_main_window().getBounds();
      win.setBounds({
        x: browser.get_main_window().isMaximized() ? bounds.x + 8 : bounds.x,
        y: browser.get_main_window().isMaximized() ? bounds.y + 78 : bounds.y + 70,
        width: browser.get_main_window().isMaximized() ? bounds.width - 15 : bounds.width - 2,
        height: browser.get_main_window().isMaximized() ? bounds.height - 84 : bounds.height - 72,
      });
    }
  };

  browser.newView = function (options) {
    let tab_id = options._id;
    let tab_icon = 'browser://images/logo.png';
    let window_icon_path = null;
    let loading_icon = 'browser://images/loading-white.gif';

    options.webPreferences = options.webPreferences || {};

    let bounds = browser.get_main_window().getBounds();

    let win = new BrowserWindow({
      show: false,
      alwaysOnTop: false,
      skipTaskbar: true,
      resizable: false,
      width: bounds.width - 5,
      height: browser.get_main_window().isMaximized() ? bounds.height - 85 : bounds.height - 75,
      x: bounds.x,
      y: browser.get_main_window().isMaximized() ? bounds.y + 75 : bounds.y + 70,
      fullscreenable: true,
      title: 'New Tab',
      backgroundColor: options.backgroundColor || '#ffffff',
      frame: false,
      icon: browser.icons[process.platform],
      webPreferences: {
        sandbox: false,
        webaudio: typeof options.webaudio == 'undefined' ? true : options.webaudio,
        enableRemoteModule: true,
        contextIsolation: false, // false -> can access preload window functions
        partition: options.partition,
        preload: browser.files_dir + '/js/context-menu.js',
        nativeWindowOpen: false,
        nodeIntegration: false,
        nodeIntegrationInSubFrames: true,
        nodeIntegrationInWorker: false,
        experimentalFeatures: false,
        webSecurity: true,
        allowRunningInsecureContent: false,
        plugins: true,
        icon: browser.icons[process.platform],
      },
    });

    if (options.webaudio === false) {
      win.webContents.audioMuted = true;
    }

    browser.handleViewPosition(win);

    win.once('ready-to-show', function () {
      // win.show()
    });

    if (!options.user_agent || options.user_agent == 'undefined') {
      options.user_agent = browser.var.core.user_agent;
    }
    win.setMenuBarVisibility(false);

    // console.log('View options' , options)
    if (options.proxy) {
      // console.log('.........................Proxy Setting ..........................')
      win.webContents.session.setProxy({
        proxyRules: options.proxy,
        proxyBypassRules: '127.0.0.1',
      });
    }

    if (options.url) {
      win.loadURL(options.url, {
        referrer: options.referrer,
        userAgent: options.user_agent,
      });
    } else {
      win.loadURL(browser.var.core.default_page || 'http://127.0.0.1:60080/newTab', {
        userAgent: options.user_agent,
      });
    }

    options.win_id = win.id;

    browser.window_list.push({
      id: options.win_id,
      window: win,
      is_youtube: false,
      partition: options.partition,
    });

    win.on('closed', function () {
      let view = browser.getView(options.win_id);
      browser.get_main_window().webContents.executeJavaScript("closeTab('" + view._id + "');");
      browser.window_list.forEach((v, i) => {
        if (v.id == options.win_id) {
          browser.window_list.splice(i, 1);
        }
      });
    });

    win.on('focus', function () {
      if (browser.getView(win.id).full_screen) {
        win.setAlwaysOnTop(true);
        win.show();
      } else {
        // browser.get_main_window().setAlwaysOnTop(true)
        browser.showYoutubeWindows();
      }
    });

    win.on('blur', function () {
      browser.get_main_window().setAlwaysOnTop(false);
    });

    win.on('enter-full-screen', (e) => {
      console.log('enter-full-screen');
      let view = browser.getView(win.id);
      view.full_screen = true;
      browser.handleViewPosition(win);
      if (browser.getView(win.id).full_screen) {
        win.setAlwaysOnTop(true);
        win.show();
      } else {
        // browser.get_main_window().setAlwaysOnTop(true)
      }
    });

    win.on('leave-full-screen', (e) => {
      console.log('leave-full-screen');
      win.setAlwaysOnTop(false);
      let view = browser.getView(win.id);
      view.full_screen = false;
      setTimeout(() => {
        browser.handleViewPosition(win);
      }, 500);
    });

    win.on('enter-html-full-screen', (e) => {
      console.log('enter-html-full-screen');
      let view = browser.getView(win.id);
      view.html_full_screen = true;
      browser.handleViewPosition(win);
      if (browser.getView(win.id).full_screen) {
        win.setAlwaysOnTop(true);
        win.show();
      } else {
        //browser.get_main_window().setAlwaysOnTop(true)
      }
    });
    win.on('leave-html-full-screen', (e) => {
      console.log('leave-html-full-screen');
      win.setAlwaysOnTop(false);
      let view = browser.getView(win.id);
      view.html_full_screen = false;
      setTimeout(() => {
        browser.handleViewPosition(win);
      }, 500);
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

    let contents = win.webContents;

    // contents.unselect();
    // contents.findInPage(text, options);
    // contents.stopFindInPage('clearSelection');
    contents.on('found-in-page', (event, result) => {
      console.log(result);
      browser.call('found-in-page', {
        win_id: win.id,
        result: result,
      });
    });

    contents.on('update-target-url', (e, url) => {
      url = url.replace('#___new_tab___', '').replace('#___new_popup___', '');
      contents.send('render_message', {
        name: 'update-target-url',
        url: decodeURI(url),
      });
    });

    contents.on('page-title-updated', (e) => {
      contents.stopFindInPage('clearSelection');
      if (win.id == browser.getView().id) {
        browser.get_main_window().setTitle(contents.getTitle());
      }

      browser.get_main_window().webContents.send('render_message', {
        name: 'update-title',
        title: contents.getTitle(),
        tab_id: tab_id,
      });

      browser.get_main_window().webContents.send('render_message', {
        name: 'update-url',
        tab_id: tab_id,
        url: decodeURI(win.getURL()),
      });

      browser.get_main_window().webContents.send('render_message', {
        name: 'update-buttons',
        tab_id: tab_id,
        forward: contents.canGoForward(),
        back: contents.canGoBack(),
      });
    });

    contents.on('page-favicon-updated', (e, urls) => {
      if (urls && urls.length > 0) {
        let image_name = browser.op.md5(urls[0]) + '.' + urls[0].split('.').pop().split('?')[0];
        let window_icon_path2 = browser.path.join(browser.data_dir, 'favicons', image_name);

        if (!browser.fs.existsSync(window_icon_path2)) {
          browser.downloadFile0(
            urls[0],
            window_icon_path2,
            null,
            (info) => {
              console.log(info);
              window_icon_path = window_icon_path2;
              browser.views.forEach((view) => {
                if (view.id == win.id) {
                  view.favicon_path = window_icon_path;
                }
              });

              browser.get_main_window().webContents.send('render_message', {
                name: 'update-favicon',
                icon: window_icon_path
                  ? nativeImage
                      .createFromPath(window_icon_path)
                      .resize({
                        width: 16,
                        height: 16,
                      })
                      .toDataURL()
                  : '',
                tab_id: tab_id,
              });

              browser.addURL({
                url: decodeURI(win.getURL()),
                logo: window_icon_path,
                ignore: true,
              });
            },
            true,
          );
        } else {
          window_icon_path = window_icon_path2;
          browser.views.forEach((view) => {
            if (view.id == win.id) {
              view.favicon_path = window_icon_path;
            }
          });

          browser.get_main_window().webContents.send('render_message', {
            name: 'update-favicon',
            icon: window_icon_path
              ? nativeImage
                  .createFromPath(window_icon_path)
                  .resize({
                    width: 16,
                    height: 16,
                  })
                  .toDataURL()
              : '',
            tab_id: tab_id,
          });
          browser.addURL({
            url: decodeURI(win.getURL()),
            logo: window_icon_path,
            ignore: true,
          });
        }
      }
    });

    contents.on('did-start-loading', (e, url) => {
      // browser.get_main_window().webContents.send('render_message', {
      //   name: 'update-url',
      //   tab_id: tab_id,
      //   url: decodeURI(win.getURL())
      // })

      browser.get_main_window().webContents.send('render_message', {
        name: 'show-loading',
        icon: loading_icon,
        tab_id: tab_id,
      });
    });

    contents.on('did-stop-loading', (e) => {
      browser.get_main_window().webContents.send('render_message', {
        name: 'show-loading',
        icon: window_icon_path
          ? nativeImage
              .createFromPath(window_icon_path)
              .resize({
                width: 16,
                height: 16,
              })
              .toDataURL()
          : '',
        tab_id: tab_id,
      });
    });

    contents.on('did-finish-load', (e) => {
      browser.get_main_window().webContents.send('render_message', {
        name: 'show-loading',
        icon: window_icon_path
          ? nativeImage
              .createFromPath(window_icon_path)
              .resize({
                width: 16,
                height: 16,
              })
              .toDataURL()
          : '',
        tab_id: tab_id,
      });
      browser.get_main_window().webContents.send('render_message', {
        name: 'update-buttons',
        tab_id: tab_id,
        forward: contents.canGoForward(),
        back: contents.canGoBack(),
      });
    });

    contents.on('did-fail-load', (e) => {
      browser.get_main_window().webContents.send('render_message', {
        name: 'show-loading',
        icon: window_icon_path
          ? nativeImage
              .createFromPath(window_icon_path)
              .resize({
                width: 16,
                height: 16,
              })
              .toDataURL()
          : '',
        tab_id: tab_id,
      });
    });

    contents.on('dom-ready', (e) => {
      contents.stopFindInPage('clearSelection');
      browser.addURL({
        url: decodeURI(win.getURL()),
        title: contents.getTitle(),
        logo: window_icon_path,
      });

      browser.get_main_window().webContents.send('render_message', {
        name: 'update-url',
        url: decodeURI(win.getURL()),
        tab_id: tab_id,
      });
      browser.get_main_window().webContents.send('render_message', {
        name: 'update-buttons',
        tab_id: tab_id,
        forward: contents.canGoForward(),
        back: contents.canGoBack(),
      });
    });

    contents.on('before-input-event', (event, input) => {
      // For example, only enable application menu keyboard shortcuts when
      // Ctrl/Cmd are down.
      contents.setIgnoreMenuShortcuts(!input.control && !input.meta);
    });

    contents.on('crashed', (e) => {
      console.log('window Crashed');
      setTimeout(() => {
        win.loadURL(options.url || browser.var.core.default_page || 'http://127.0.0.1:60080/newTab');
      }, 1000);
    });

    contents.on('will-navigate', (e, url) => {
      // when user click on link _blank
      contents.stopFindInPage('clearSelection');
      console.log('will-navigate :: ' + url);
      if (url.like('*#___new_tab___*')) {
        e.preventDefault();
        url = url.replace('#___new_tab___', '');
        win.loadURL(url);
        browser.get_main_window().webContents.send('render_message', {
          name: 'update-url',
          tab_id: tab_id,
          url: decodeURI(url),
        });
      }
    });

    contents.on('will-redirect', (e, url) => {

      browser.var.overwrite.urls.forEach((data) => {
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

      console.log('will-redirect', url);
    });

    contents.on('did-redirect-navigation', (e) => {
      //console.log('did-redirect-navigation')
    });

    contents.on('did-navigate', (e) => {
      //console.log('did-navigate')
    });

    contents.on('did-frame-navigate', (e) => {
      //console.log('did-frame-navigate')
    });

    contents.on('did-navigate-in-page', (e) => {
      //console.log('did-navigate-in-page')
    });

    contents.on('did-get-redirect-request', (e) => {
      console.log('did-get-redirect-request');
      if (e.isMainFrame) {
        win.loadURL(e.newURL);
      }
    });

    // contents.on('will-prevent-unload', (event) => {
    //   const choice = dialog.showMessageBox(win, {
    //     type: 'question',
    //     buttons: ['Leave', 'Stay'],
    //     title: 'Do you want to leave this site?',
    //     message: 'Changes you made may not be saved.',
    //     defaultId: 0,
    //     cancelId: 1
    //   })
    //   const leave = (choice === 0)
    //   if (leave) {
    //     event.preventDefault()
    //   }
    // })

    contents.on('new-window', function (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) {
      browser.defaultNewWindowEvent(event, url, frameName, disposition, options, additionalFeatures, referrer, postBody);
    });

    return win;
  };

  browser.addressbarWindow = null;
  browser.newAddressbarWindow = function () {
    let win = browser.newWindow({
      show: false,
      width: 600,
      height: 500,
      x: 90,
      y: 30,
      alwaysOnTop: true,
      resizable: false,
      fullscreenable: false,
      title: 'Address-bar',
      backgroundColor: '#ffffff',
      frame: false,
      icon: browser.icons[process.platform],
      skipTaskbar: true,
      webPreferences: {
        enableRemoteModule: true,
        partition: 'address_bar',
        preload: browser.files_dir + '/js/addressbar-context-menu.js',
        nativeWindowOpen: false,
        nodeIntegration: true,
        experimentalFeatures: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        plugins: true,
        icon: browser.icons[process.platform],
      },
    });

    win.setMenuBarVisibility(false);
    win.loadURL(
      browser.url.format({
        pathname: browser.path.join(browser.files_dir, 'html', 'address-bar.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );

    win.on('blur', function () {
      win.hide();
    });

    // win.webContents.openDevTools()
    return win;
  };
  browser.hideAddressbar = function () {
    if (browser.addressbarWindow) {
      browser.addressbarWindow.hide();
    }
  };

  browser.showAddressbar = function (options) {
    options = options || {};

    browser.addressbarWindow = browser.addressbarWindow || browser.newAddressbarWindow();
    if (!options.url) {
      let win = BrowserWindow.fromId(browser.getView().id);
      if (win) {
        options.url = win.getURL();
      }
    }

    if (options.url.like('http://127.0.0.1:60080*')) {
      options.url = '';
    }

    browser.addressbarWindow.webContents.executeJavaScript("loadurl('" + options.url + "');");

    let bounds = browser.get_main_window().getBounds();
    browser.addressbarWindow.setBounds({
      width: bounds.y == -8 ? bounds.width - 100 : bounds.width - 95,
      height: 500,
      x: bounds.x + 95,
      y: (bounds.y == -8 ? 0 : bounds.y - 5) + 30,
    });
    browser.addressbarWindow.show();
    return browser.addressbarWindow;
  };

  browser.userProfileWindow = null;
  browser.newUserProfileWindow = function () {
    console.log('browser.newUserProfileWindow');
    if (browser.userProfileWindow) {
      return browser.userProfileWindow;
    }
    let win = new BrowserWindow({
      show: false,
      width: 600,
      height: 450,
      x: 90,
      y: 30,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      fullscreenable: false,
      title: 'user-profile',
      backgroundColor: '#ffffff',
      frame: false,
      icon: browser.icons[process.platform],

      webPreferences: {
        contextIsolation: false,
        enableRemoteModule: true,
        partition: 'user_profile',
        preload: browser.files_dir + '/js/addressbar-context-menu.js',
        nativeWindowOpen: false,
        nodeIntegration: true,
        experimentalFeatures: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        plugins: true,
        icon: browser.icons[process.platform],
      },
    });

    browser.userProfileWindow = win;

    win.setMenuBarVisibility(false);
    win.loadURL(
      browser.url.format({
        pathname: browser.path.join(browser.files_dir, 'html', 'user-profiles.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );

    win.on('blur', function () {
      win.hide();
    });
    // win.webContents.openDevTools()

    return win;
  };

  browser.hideUserProfile = function () {
    if (browser.userProfileWindow) {
      browser.userProfileWindow.hide();
    }
  };

  browser.showUserProfile = function (options) {
    options = options || {};

    browser.userProfileWindow = browser.userProfileWindow || browser.newuserProfileWindow();

    let bounds = browser.get_main_window().getBounds();
    browser.userProfileWindow.setBounds({
      width: 400,
      height: 500,
      x: bounds.x + (bounds.width - 500),
      y: (bounds.y == -8 ? 0 : bounds.y - 5) + 30,
    });
    browser.userProfileWindow.show();
    return browser.userProfileWindow;
  };

  browser.newWindow = function (options) {
    // console.log('newWindow()', options)

    browser.get_main_window().setAlwaysOnTop(false);

    options = options || {};
    options.webPreferences = options.webPreferences || {};

    options.width = options.width || 1280;
    options.height = options.height || 720;

    options.x = options.x || 200;
    options.y = options.y || 200;

    if (!options.partition && !options.webPreferences.partition) {
      options.partition = browser.getView().partition;
    }

    let win = new BrowserWindow({
      show: typeof options.show !== 'undefined' ? options.show : true,
      title: options.title || 'New Window',
      alwaysOnTop: options.alwaysOnTop,
      width: options.width,
      height: options.height,
      x: options.x,
      y: options.y,
      backgroundColor: options.backgroundColor || '#ffffff',
      frame: typeof options.frame !== 'undefined' ? options.frame : true,
      icon: browser.icons[process.platform],
      titleBarStyle: 'hidden',
      webPreferences: {
        contextIsolation: false,
        enableRemoteModule: true,
        webaudio: typeof options.webaudio == 'undefined' ? true : options.webaudio,
        partition: options.webPreferences.partition || options.partition,
        sandbox: typeof options.webPreferences.sandbox !== 'undefined' ? options.webPreferences.sandbox : false,
        preload: typeof options.webPreferences.preload !== 'undefined' ? options.webPreferences.preload : browser.files_dir + '/js/context-menu.js',
        nativeWindowOpen: typeof options.webPreferences.nativeWindowOpen !== 'undefined' ? options.webPreferences.nativeWindowOpen : false,
        nodeIntegration: typeof options.webPreferences.nodeIntegration !== 'undefined' ? options.webPreferences.nodeIntegration : false,
        nodeIntegrationInWorker: typeof options.webPreferences.nodeIntegrationInWorker !== 'undefined' ? options.webPreferences.nodeIntegrationInWorker : false,
        nodeIntegrationInSubFrames: typeof options.webPreferences.nodeIntegrationInSubFrames !== 'undefined' ? options.webPreferences.nodeIntegrationInSubFrames : true,
        experimentalFeatures: typeof options.webPreferences.experimentalFeatures !== 'undefined' ? options.webPreferences.experimentalFeatures : false,
        webSecurity: typeof options.webPreferences.webSecurity !== 'undefined' ? options.webPreferences.webSecurity : true,
        allowRunningInsecureContent: typeof options.webPreferences.allowRunningInsecureContent !== 'undefined' ? options.webPreferences.allowRunningInsecureContent : false,
        plugins: true,
      },
    });

    if (options.webaudio === false) {
      win.webContents.audioMuted = true;
    }
    win.setMenuBarVisibility(false);
    if (options.title !== 'Youtube') {
      win.center();
    }

    options.win_id = win.id;

    browser.window_list.push({
      id: options.win_id,
      window: win,
      is_youtube: options.title == 'Youtube' ? true : false,
      partition: options.webPreferences.partition || options.partition,
    });

    win.once('ready-to-show', function () {
      if (typeof options.show === 'undefined' || options.show) {
        win.hide();
        win.show();
      }
    });

    win.on('close', (e) => {
      win.destroy();
    });

    win.on('closed', (e) => {
      browser.window_list.forEach((v, i) => {
        if (v.id == options.win_id) {
          browser.window_list.splice(i, 1);
        }
      });
    });

    if (options.max) {
      win.maximize();
    }

    if (options.proxy) {
      console.log('Proxy Setting');
      win.webContents.session.setProxy({
        proxyRules: options.proxy,
        proxyBypassRules: '127.0.0.1',
      });
    }

    if (options.url) {
      win.loadURL(options.url, {
        referrer: options.referrer,
        userAgent: options.user_agent || browser.var.core.user_agent,
      });
    }

    win.webContents.on('dom-ready', (e) => {
      // let css = browser.readFileSync(browser.files_dir + '/css/inject.css')
      // win.webContents.insertCSS(css)
      win.setBounds({ width: win.getBounds().width + 1 });
      win.setBounds({ width: win.getBounds().width - 1 });
    });

    win.webContents.on('unresponsive', async () => {
      win.webContents.forcefullyCrashRenderer();
      win.webContents.reload();
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

    if (!options.window_off) {
      win.webContents.on('new-window', function (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) {
        browser.defaultNewWindowEvent(event, url, frameName, disposition, options, additionalFeatures, referrer, postBody);
      });
    }

    return win;
  };

  browser.newYoutubeWindow = function (options) {
    console.log('newYoutubeWindow()');

    browser.get_main_window().setAlwaysOnTop(false);
    options = options || {};

    if (options.url.like('https://www.youtube.com/watch*')) {
      options.url = 'https://www.youtube.com/embed/' + options.url.split('=')[1].split('&')[0];
    } else if (options.url.like('https://www.youtube.com/embed*')) {
      options.url = options.url;
    } else {
      options.url = options.url.split('&')[0];
    }

    let display = browser.electron.screen.getPrimaryDisplay();
    let width = display.bounds.width;
    let height = display.bounds.height;

    options.width = 440;
    options.height = 300;
    (options.x = width - 450), (options.y = height - 330);
    options.alwaysOnTop = true;
    options.disableEvents = true;
    options.backgroundColor = '#030303';
    options.title = 'Youtube';

    options.window_off = true;

    let win = browser.newWindow(options);

    win.webContents.on('will-navigate', (e, url2) => {
      e.preventDefault();
      if (url2.like('https://www.youtube.com/watch*')) {
        url = 'https://www.youtube.com/embed/' + url2.split('=')[1].split('&')[0];
        win.loadURL(url);
      } else if (url2.like('https://www.youtube.com/embed*')) {
        win.loadURL(url);
      }
    });

    win.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
      event.preventDefault();

      url = url || event.url || '';

      if (url.like('https://www.youtube.com/watch*')) {
        url = 'https://www.youtube.com/embed/' + url.split('=')[1].split('&')[0];
        win.loadURL(url);
        return;
      } else if (url.like('https://www.youtube.com/embed*')) {
        win.loadURL(url);
        return;
      }
    });

    return win;
  };

  browser.newIframeWindow = function (options) {
    console.log('newIframeWindow()');
    browser.get_main_window().setAlwaysOnTop(false);
    options = options || {};

    options.url = 'http://127.0.0.1:60080/iframe?url=' + options.url;

    options.width = 800;
    options.height = 600;
    (options.x = 200), (options.y = 100);
    options.alwaysOnTop = true;
    options.disableEvents = true;
    options.backgroundColor = '#030303';
    let win = browser.newWindow(options);

    win.webContents.on('will-navigate', (e, url2) => {
      e.preventDefault();
      options.url = 'http://127.0.0.1:60080/iframe?url=' + options.url;
    });

    return win;
  };

  browser.newVideoWindow = function (options) {
    console.log('newVideoWindow()');
    browser.get_main_window().setAlwaysOnTop(false);
    options = options || {};

    options.url = 'http://127.0.0.1:60080/html/mini_video.html?url=' + options.url;

    let display = browser.electron.screen.getPrimaryDisplay();
    let width = display.bounds.width;
    let height = display.bounds.height;

    options.width = 420;
    options.height = 280;
    (options.x = width - 430), (options.y = height - 310);
    options.alwaysOnTop = true;
    options.disableEvents = true;
    options.backgroundColor = '#030303';

    let win = browser.newWindow(options);

    win.webContents.on('will-navigate', (e, url2) => {
      e.preventDefault();
      url = 'http://127.0.0.1:60080/html/mini_video.html?url=' + url;
    });

    return win;
  };

  browser.newTrustedWindow = function (op) {
    op = op || {};

    browser.get_main_window().setAlwaysOnTop(false);

    let win = new BrowserWindow({
      show: false,
      width: op.width || 1200,
      height: op.height || 800,
      title: op.title || 'TRUESTED WINDOW ',
      icon: browser.icons[process.platform],
      webPreferences: {
        contextIsolation: false,
        enableRemoteModule: true,
        preload: op.preload || browser.files_dir + '/js/context-menu.js',
        webaudio: typeof op.webaudio == 'undefined' ? false : op.webaudio,
        partition: op.partition || 'trusted',
        sandbox: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        nodeIntegrationInWorker: true,
        experimentalFeatures: false,
      },
    });

    op.win_id = win.id;

    win.setMenuBarVisibility(false);
    win.once('ready-to-show', function () {
      if (op.show) {
        win.show();
      }
    });
    browser.window_list.push({
      id: win.id,
      window: win,
      is_youtube: false,
      is_trusted: true,
      partition: op.partition || 'trusted',
    });

    win.on('closed', function () {
      browser.window_list.forEach((v, i) => {
        if (v.id == op.win_id) {
          browser.window_list.splice(i, 1);
        }
      });
    });

    win.loadURL(op.url);

    return win;
  };

  browser.showCurrentView = function (show = true) {
    if (browser.getView() && browser.getView().window && !browser.getView().window.isDestroyed()) {
      if (show) {
        browser.getView().window.show();
      } else {
        browser.getView().window.hide();
      }
    }
  };

  browser.createNewSocialBrowserWindow = function (callback) {
    callback = callback || function () {};

    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

    let newWindow = new BrowserWindow({
      show: false,
      width: 1024,
      height: 768,
      title: 'New Social Browser',
      webPreferences: {
        contextIsolation: false,
        enableRemoteModule: true,
        nativeWindowOpen: false,
        plugins: true,
        nodeIntegration: true,
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false,
      },
      frame: false,
      icon: browser.icons[process.platform],
    });

    console.log(' [ New Social Browser Window Created ] ' + newWindow.id);

    browser.main_window_list.push({
      id: newWindow.id,
      window: newWindow,
    });

    newWindow.on('close', function () {
      browser.main_window_list.forEach((w, i) => {
        if (w.id == newWindow.id) {
          browser.main_window_list.splice(i, 1);
        }
      });
    });

    newWindow.setThumbarButtons([]);
    newWindow.setMenuBarVisibility(false);
    // newWindow.maximize()

    newWindow.on('blur', function () {
      // browser.showCurrentView(false);
    });
    newWindow.on('focus', function () {
      browser.active_main_window = newWindow;
      browser.showCurrentView(true, newWindow.id);
      browser.call('show-tab-view', { win_id: newWindow.id });
      console.log('focus');
    });
    newWindow.on('show', function () {
      browser.active_main_window = newWindow;
      browser.showCurrentView(true, newWindow.id);
      console.log('show');
    });
    newWindow.on('hide', function () {
      browser.hideAddressbar();
      browser.showCurrentView(false, newWindow.id);
      console.log('hide');
    });

    newWindow.on('maximize', function () {
      browser.hideAddressbar();
      browser.views.forEach((v) => {
        let win = BrowserWindow.fromId(v.id);
        browser.handleViewPosition(win);
      });
      browser.showCurrentView(true, newWindow.id);
      console.log('maximize');
    });

    newWindow.on('unmaximize', function () {
      browser.showCurrentView(true, newWindow.id);
      console.log('unmaximize');
    });
    newWindow.on('minimize', function () {
      browser.showCurrentView(false, newWindow.id);
      console.log('minimize');
    });
    newWindow.on('restore', function () {
      browser.showCurrentView(true, newWindow.id);
      console.log('restore');
    });

    newWindow.on('resize', function () {
      browser.hideAddressbar();
      browser.views.forEach((v) => {
        let win = BrowserWindow.fromId(v.id);
        browser.handleViewPosition(win);
      });
      browser.showCurrentView(true, newWindow.id);
      console.log('resize');
    });

    newWindow.on('move', function () {
      browser.hideAddressbar();
      browser.views.forEach((v) => {
        let win = BrowserWindow.fromId(v.id);
        browser.handleViewPosition(win);
      });
      browser.showCurrentView(true, newWindow.id);
      console.log('move');
    });

    // newWindow.once('ready-to-show', function () {
    //   // newWindow.show()
    // });

    newWindow.webContents.on('crashed', (e) => {
      setTimeout(() => {
        newWindow.loadURL(
          browser.url.format({
            pathname: browser.path.join(browser.files_dir, 'html', 'social.html'),
            protocol: 'file:',
            slashes: true,
          }),
        );
      }, 1000);
    });

    //  newWindow.setMinimumSize(240, 500)

    //  newWindow.loadURL('browser://html/social.html')
    // newWindow.webContents.openDevTools({
    //   mode: 'detach',
    // });

    newWindow.loadURL(
      browser.url.format({
        pathname: browser.path.join(browser.files_dir, 'html', 'social.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );

    callback(newWindow);
    return newWindow;
  };
};
