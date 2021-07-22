[('SIGTERM', 'SIGHUP', 'SIGINT', 'SIGBREAK')].forEach((signal) => {
  process.on(signal, () => {
    console.log('Request signal :: ' + signal);
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

if (process.argv[process.argv.length - 1].endsWith('child.js')) {
  require(__dirname + '/child/child.js');
  return;
} else if (process.argv[process.argv.length - 1].endsWith('.js')) {
  require(process.argv[process.argv.length - 1]);
  return;
}

console.log('  ( New Parent Created ) ');
var browser = {
  electron: require('electron'),
  fetch: require('node-fetch'),
  path: require('path'),
  os: require('os'),
  url: require('url'),
  fs: require('fs'),
  md5: require('md5'),
  child_process: require('child_process'),
  WebSocket: require('ws'),
  package: require('./package.json'),
  xlsx: require('xlsx'),
  id: process.pid,
  windowList: [],
  files: [],
  var: {
    core: { id: '', user_agent: '' },
    overwrite: {
      urls: [],
    },
    sites: [],
    session_list: [],
    blocking: { javascript: {}, privacy: {}, youtube: {}, social: {}, popup: { white_list: [] } },
    facebook: {},
    white_list: [],
    black_list: [],
    open_list: [],
    preload_list: [],
    context_menu: { dev_tools: true, inspect: true },
    custom_request_header_list: [],
  },
  var0: {},
  content_list: [],
  log: (...args) => {
    console.log(...args);
  },
  startTime: new Date().getTime(),
};

const is_first_app = browser.electron.app.requestSingleInstanceLock();
if (!is_first_app) {
  let f = process.argv[process.argv.length - 1]; // LAST arg is file to run
  if (f.endsWith('.js')) {
    console.log('Run JS File And Return App >>>>>>>>>>>>>>>>>>>>>> ');
  } else {
    console.warn('App Will Close & open in first instance');
    browser.electron.app.quit();
  }
  return;
}

browser.dir = process.resourcesPath + '/app.asar';
if (!browser.fs.existsSync(browser.dir)) {
  browser.dir = process.cwd();
}
browser.files_dir = browser.dir + '/browser_files';
if (process.cwd().indexOf('-portal') !== -1) {
  browser.isPortal = true;
  browser.data_dir = browser.path.join(process.cwd(), 'social-data');
} else {
  browser.data_dir = browser.path.join(browser.os.homedir(), 'social-data');
}

if (process.argv.some((x) => x == '--auto-startup')) {
  browser.isAutoStartup = true;
}

browser.Partitions_data_dir = browser.path.join(browser.data_dir, 'default', 'Partitions');
browser.electron.app.setPath('userData', browser.path.join(browser.data_dir, 'default'));
require(browser.path.join(browser.dir, '/parent/parent.js'))(browser);

require('@electron/remote/main').initialize();

if (browser.isAutoStartup) {
  browser.createChildProcess({
    url: 'https://www.google.com',
    windowType: 'none',
  });
} else {
  browser.createChildProcess({
    url: browser.url.format({
      pathname: browser.path.join(browser.files_dir, 'html', 'main-window.html'),
      protocol: 'file:',
      slashes: true,
    }),
    windowType: 'main',
  });
}

setTimeout(() => {
  browser.createChildProcess({
    url: browser.url.format({
      pathname: browser.path.join(browser.dir, 'updates', 'index.html'),
      protocol: 'file:',
      slashes: true,
    }),
    windowType: 'updates',
    show: false,
    trusted: true,
  });
}, 1000 * 60 * 5);

browser.electron.Menu.setApplicationMenu(null);
browser.electron.app.setAsDefaultProtocolClient('browser');
if (browser.electron.app.setUserTasks) {
  browser.electron.app.setUserTasks([]);
}

if (!browser.isPortal) {
  browser.electron.app.setAppUserModelId('Social.Browser');
}

browser.electron.app.clearRecentDocuments();
browser.electron.app.disableHardwareAcceleration();

/* App Ready */
browser.electron.app.on('ready', function () {
  browser.webContent = browser.electron.webContents.create({
    contextIsolation: false,
  });
  // browser.webContentList = [];
  // for (let index = 0; index < 100; index++) {
  //   browser.webContentList.push(
  //     browser.electron.webContents.create({
  //       contextIsolation: false,
  //     }),
  //   );
  //   browser.webContentList[index].loadURL('https://google.com')
  // }
  // console.log(browser.webContentList.length);
  browser.electron.app.setAccessibilitySupportEnabled(true);
  if (!browser.isPortal) {
    browser.electron.app.setLoginItemSettings({
      openAtLogin: true,
      args: ['--auto-startup'],
      path: process.execPath,
    });
  }

  browser.electron.globalShortcut.unregisterAll();
  // browser.setupTray();

  browser.electron.app.on('network-connected', () => {
    browser.log('network-connected');
  });

  browser.electron.app.on('network-disconnected', () => {
    browser.log('network-disconnected');
  });

  // browser.var.cookies = browser.var.cookies || [];
  // browser.var.session_list.forEach((s1) => {
  //   let ss = browser.handleSession(s1.name) || browser.electron.session.fromPartition(s1.name);
  //   ss.cookies.get({}).then((cookies) => {
  //     browser.var.cookies.push({
  //       name: s1.name,
  //       display: s1.display,
  //       cookies: cookies,
  //     });
  //   });
  // });
});
browser.electron.app.on('second-instance', (event, commandLine, workingDirectory) => {
  browser.log('second-instance', commandLine);

  let url = commandLine.pop();

  if (!url || url.like('*--*') || url == '.') {
    url = browser.var.core.home_page;
  }

  if (url.like('*.js')) {
    require(url);
    return;
  }

  if (url && !url.like('http*') && !url.like('file*')) {
    url = 'file://' + url;
  }

  browser.newTabData = {
    name: '[open new tab]',
    url: url,
    partition: browser.var.core.session.partition,
    user_name: browser.var.core.session.user_name,
    active: true,
  };

  browser.createChildProcess({
    url: browser.url.format({
      pathname: browser.path.join(browser.files_dir, 'html', 'main-window.html'),
      protocol: 'file:',
      slashes: true,
    }),
    windowType: 'main',
  });
});
