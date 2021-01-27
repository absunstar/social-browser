['SIGTERM', 'SIGHUP', 'SIGINT', 'SIGBREAK'].forEach((signal) => {
  process.on(signal, () => {
    browser.log('Request signal :: ' + signal);
    app.quit();
    process.exit(1);
  });
});

process.on('uncaughtException', function (error) {
  console.error(error, 'Uncaught Exception thrown');
});

process.on('uncaughtRejection', function (error) {
  console.error(error, 'Uncaught Rejection thrown');
});

process.on('unhandledRejection', function (error, promise) {
  console.error(error, 'Unhandled Rejection thrown');
});

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
});

process.on('warning', (warning) => {
  console.warn(warning.stack);
});

const electron = require('electron');

const { app, Tray, nativeImage, Menu, ipcMain, globalShortcut, localShortcut, protocol, BrowserWindow } = electron;

const is_first_app = app.requestSingleInstanceLock();
if (!is_first_app) {
  let f = process.argv[process.argv.length - 1]; // LAST arg is file to run
  if (f.endsWith('.js')) {
    require(f);
  } else {
    console.warn('App Will Close & open in first instance');
    app.quit();
  }
  return;
}

app.setAsDefaultProtocolClient('browser');
if (app.setUserTasks) {
  app.setUserTasks([]);
}
Menu.setApplicationMenu(null);

app.setAppUserModelId(process.execPath);
app.clearRecentDocuments();
app.commandLine.appendSwitch('--no-sandbox')
// app.disableHardwareAcceleration();
// app.allowRendererProcessReuse = false; //deprecated
// app.commandLine.appendSwitch('disable-site-isolation-trials')
// app.showEmojiPanel()
//app.showAboutPanel()
// browser.allow_widevinecdm(app)

var package = require('./package.json');
var md5 = require('md5');

const browser = require('./browser-init')({
  is_main: true,
  md5: md5,
  electron: electron,
  package: package,
});

require(__dirname + '/site.js')(browser);

browser.log('process.argv', process.argv);

browser.request_url = process.argv.length > 1 ? process.argv[process.argv.length - 1] : browser.var.core.home_page;
if (browser.request_url == '.' || browser.request_url.like('*--squirrel*')) {
  browser.request_url = browser.var.core.home_page;
}

if (browser.request_url && !browser.request_url.like('http*') && !browser.request_url.like('file*')) {
  browser.request_url = 'file://' + browser.request_url;
}
if (!browser.request_url) {
  browser.request_url = browser.var.core.home_page;
}
browser.log('browser.request_url', browser.request_url);

function createNewMainWindow(op, callback) {
  callback = callback || function () {};

  setTimeout(() => {
    browser.createNewSocialBrowserWindow((w) => {
      callback(w);

      w.on('closed', function () {
        w = null;
      });

      w.once('ready-to-show', function () {
        browser.logoWindow.hide();
        if (op && op.show) {
          w.show();
        }
        setTimeout(() => {
          browser.logoWindow.hide();
        }, 1000);
      });
    });
  }, 0);
}

app.on('ready', function () {
  browser.is_app_ready = true;

  require(__dirname + '/pdf-reader/app.js')(browser);

  app.setAccessibilitySupportEnabled(true);
  browser.logoWindow = new BrowserWindow({
    show: true,
    width: 600,
    height: 300,
    title: 'logo',
    frame: false,
    backgroundColor: '#2196F3',
    skipTaskbar: true,
    alwaysOnTop: true,
    icon: browser.icons[process.platform],
    webPreferences: {
      contextIsolation: false,
    },
  });
  browser.logoWindow.setMenuBarVisibility(false);
  browser.logoWindow.center();
  browser.logoWindow.loadURL(__dirname + '/browser_files/html/logo.html');
  setTimeout(() => {
    browser.logoWindow.hide();
  }, 1000 * 30);

  app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath,
  });

  createNewMainWindow(
    {
      show: true,
    },
    (w) => {

      browser.addressbarWindow = browser.addressbarWindow || browser.newAddressbarWindow();
      browser.userProfileWindow = browser.userProfileWindow || browser.newUserProfileWindow();
      
      browser.new_tab_info = {
        name: '[open new tab]',
        url: browser.request_url,
        active: true,
        win_id: w.id,
      };
    },
  );

  browser.on('download-url', function (event, url) {
    browser.tryDownload(url);
  });

  browser.on('[browser-message]', function (event, data) {
    if (data.name == 'close') {
      browser.log('close main window ' + data.win_id);
      browser.get_main_window(data.win_id).close();
    }
  });

  browser.on('message', function (event, data) {
    if (data == 'exit') {
      browser.get_main_window().close();
    } else if (data == 'maxmize') {
      if (browser.get_main_window().isMaximized()) {
        browser.get_main_window().unmaximize();
      } else {
        browser.get_main_window().maximize();
      }
    } else if (data == 'minmize') {
      browser.get_main_window().minimize();
    } else if (data == 'preload') {
      browser.log('preload!!');
    } else if (data == 'showDeveloperTools') {
      browser.get_main_window().webContents.openDevTools({
        mode: 'undocked',
      });
    }

    // event.sender.send('message', 'ok');
  });

  // const iconPath = browser.files_dir + '/images/logo.png'
  // appIcon = new Tray(iconPath);
  // appIcon.setToolTip('This is my application.');

  browser.sessionConfig();

  globalShortcut.unregisterAll();
  // globalShortcut.register('CommandOrControl+X', () => {
  //   browser.log('CommandOrControl+X is pressed')
  // })

  setInterval(() => {
    (async () => {
      if (browser.var.$urls) {
        browser.var.$urls = false;
        browser.set_var('urls', browser.var.urls);
      }
      if (browser.var.$data_list) {
        browser.var.$data_list = false;
        browser.set_var('data_list', browser.var.data_list);
      }
      if (browser.var.$user_data) {
        browser.var.$user_data = false;
        browser.set_var('user_data', browser.var.user_data);
      }
      if (browser.var.$user_data_input) {
        browser.var.$user_data_input = false;
        browser.set_var('user_data_input', browser.var.user_data_input);
      }
    })();
  }, 1000 * 60 * 5);

  browser.var.cookies = browser.var.cookies || [];
  browser.var.session_list.forEach((s1) => {
    let ss = browser.session.fromPartition(s1.name);
    ss.cookies.get({}).then((cookies) => {
      browser.var.cookies.push({
        name: s1.name,
        display: s1.display,
        cookies: cookies,
      });
    });
  });

  app.on('network-connected', () => {
    browser.log('network-connected');
  });

  app.on('network-disconnected', () => {
    browser.log('network-disconnected');
  });

  app.on('web-contents-created', (event, contents) => {
    // contents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    //   browser.log('new-window')
    //   browser.log(options)
    //   if (frameName === 'modal') {
    //     // open window as modal
    //     event.preventDefault()
    //     Object.assign(options, {
    //       modal: true,
    //       width: 100,
    //       height: 100
    //     })
    //     event.newGuest = new BrowserWindow(options)
    //   }else{
    //     event.newGuest = new BrowserWindow(options)
    //   }
    // })

    contents.on('will-attach-webview', (event, webPreferences, params) => {
      browser.log('will-attach-webview');
      webPreferences.preload = browser.files_dir + '/js/context-menu.js';
      // webPreferences.preloadURL = 'file://' + browser.files_dir + "/js/context-menu.js"

      delete webPreferences.preloadURL;

      // webPreferences.nodeIntegration = false
      // webPreferences.contextIsolation = false
      // webPreferences.webviewTag = false
      // webPreferences.webSecurity = false
      // webPreferences.experimentalFeatures = false
      // webPreferences.nativeWindowOpen = false
      // webPreferences.allowRunningInsecureContent = true
      webPreferences.plugins = false;
      // webPreferences.affinity =  'main-window' // main window, and addition windows should work in one process

      // Verify URL being loaded
      // if (!params.src.startsWith('https://yourapp.com/')) {
      //   event.preventDefault()
      // }
    });
  });

  app.on('browser-window-created', (e, win) => {
    // browser.log( ' before : ' + win.webContents.browserWindowOptions.webPreferences.preload)
    // if(win.webContents.browserWindowOptions.webPreferences.preload){
    //   if(win.webContents.browserWindowOptions.webPreferences.preload.like('*js/context-menu*')){
    //    win.webContents.browserWindowOptions.webPreferences.preload =  browser.path.join(browser.files_dir , "js" , "window-context-menu.js")
    //   }
    // }else{
    //   win.webContents.browserWindowOptions.webPreferences.preload =  browser.path.join(browser.files_dir , "js" , "window-context-menu.js")
    // }
    // browser.log( ' after : ' + win.webContents.browserWindowOptions.webPreferences.preload)
    // win.webContents.browserWindowOptions.webPreferences.preload = browser.files_dir + "/js/social-context-menu.js"
    // win.webContents.on("new-window", (e, url) => {
    //   e.preventDefault()
    //   url = url.length < 5 ? 'browser://empty' : url
    //   var q = browser.url.parse(url, true)
    //   if (q.host.like('*youtube.com*') && q.query.v) {
    //     win.loadURL('http://127.0.0.1:60080/iframe?url=https://www.youtube.com/embed/' + q.query.v)
    //   }else{
    //     win.loadURL(url)
    //   }
  });

  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true); // Accept Any Certificate
  });

  app.on('crashed', (event, session) => {
    browser.log('app crashed');
    // app.relaunch({
    //   args: process.argv.slice(1).concat(['--relaunch'])
    // })
    app.exit(0);
  });

  app.on('gpu-process-crashed', (event, session) => {
    browser.log('app gpu-process-crashed');
    // app.relaunch({
    //   args: process.argv.slice(1).concat(['--relaunch'])
    // })
    app.exit(0);
  });

  // browser.run([browser.dir + '/updates/index.js']);

  setTimeout(() => {
    require('./proxy')(browser);

    let win = browser.newTrustedWindow({
      url: browser.dir + '/updates/index.html',
      title: 'updating',
      show: false,
    });
    //win.openDevTools()
    // win.on('close', function (e) {
    //   e.preventDefault();
    //   win.hide();
    // });
  }, 1000 * 60 * 1);
});

app.on('will-finish-launching', () => {
  app.on('activate', () => {
    browser.get_main_window().show();
  });

  app.on('open-url', (event, path) => {
    browser.log('open-url', path);

    if (path && !path.like('http*') && !path.like('file*')) {
      path = 'file://' + path;
    }

    event.preventDefault();
    browser.get_main_window().webContents.send('render_message', {
      name: '[open new tab]',
      url: path,
    });
  });

  app.on('open-file', (event, path) => {
    event.preventDefault();
    browser.log('open-file', path);

    if (path && !path.like('http*') && !path.like('file*')) {
      path = 'file://' + path;
    }

    browser.get_main_window().webContents.send('render_message', {
      name: '[open new tab]',
      url: path,
    });
  });

  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});

app.on('second-instance', (event, commandLine, workingDirectory) => {
  browser.log('second-instance', commandLine);

  let u = commandLine && commandLine.length > 0 ? commandLine[commandLine.length - 1] : null;

  if (!u || u.startsWith('--') || u == '.') {
    u = browser.var.core.home_page;
  }

  if (u.like('*.js')) {
    return;
  }

  if (u && !u.like('http*') && !u.like('file*')) {
    u = 'file://' + u;
  }

  createNewMainWindow(
    {
      show: true,
    },
    (w) => {
      browser.new_tab_info = {
        name: '[open new tab]',
        url: u,
        active: true,
        win_id: w.id,
      };
      w.maximize();
      w.show();
    },
  );
});
