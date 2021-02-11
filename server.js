var browser = {
  electron: require('electron'),
  fetch: require('node-fetch'),
  path: require('path'),
  url: require('url'),
  fs: require('fs'),
  md5: require('md5'),
  child_process: require('child_process'),
  WebSocket: require('ws'),
  id: process.pid,
  windowList: [],
  files: [],
  var: {},
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
    require(f);
  } else {
    console.warn('App Will Close & open in first instance');
    app.quit();
  }
  return;
}

browser.ipcRenderer = browser.electron.ipcRenderer;
browser.session = browser.electron.session;
browser.clipboard = browser.electron.clipboard;
browser.remote = browser.electron.remote;
browser.shell = browser.electron.shell;
browser.dialog = browser.electron.dialog;
browser.child_index = 0;

browser.dir = process.resourcesPath + '/app.asar';
if (!browser.fs.existsSync(browser.dir)) {
  browser.dir = process.cwd();
}
browser.files_dir = browser.dir + '/browser_files';
if (process.cwd().indexOf('-portal') !== -1) {
  browser.data_dir = browser.path.join(process.cwd(), 'social-data');
}
browser.Partitions_data_dir = browser.path.join(browser.data_dir, 'default', 'Partitions');

require(browser.path.join(browser.dir, '/parent/parent.js'))(browser);

browser.createChild = function (options) {
  let index = browser.child_index;
  browser.child_index++;
  browser.clientList[index] = {
    source: 'child',
    index: index,
    windowType: options.windowType || 'popup',
    options: options,
  };
  let child = browser.run(['--index=' + index, '--dir=' + browser.dir, browser.dir + '/child/child.js']);

  // process.stdin.pipe(child.stdin) // share input from main process to child

  child.stdout.on('data', function (data) {
    browser.log(`child ${child.pid} stdout:\n${data}`);
  });

  child.stderr.on('data', (data) => {
    browser.log(`child ${child.pid} stdout:\n${data}`);
  });

  child.on('close', (code, signal) => {
    browser.log(`child ${child.pid} close with code ${code} and signal ${signal}`);

    if (!browser.clientList[index] || !browser.clientList[index].options || !browser.clientList[index].options.tab_id) {
      return;
    }
    let tab_id = browser.clientList[index].options.tab_id;
    browser.clientList.splice(index, 1);

    browser.clientList.forEach((client, i) => {
      if (client.windowType === 'main window') {
        client.ws.send(
          JSON.stringify({
            type: '[remove-tab]',
            tab_id: tab_id,
          }),
        );
      }
    });
  });

  child.on('error', (err) => {
    browser.log(`child ${child.pid} Error \n ${err}`);
  });
  child.on('disconnect', (err) => {
    browser.log(`child ${child.pid} disconnect`);
  });
  child.on('spawn', (err) => {
    browser.log(`child ${child.pid} spawn`);
  });
  child.on('message', (msg) => {
    browser.log(msg);
  });

  browser.clientList[index].id = child.pid;
  browser.clientList[index].pid = child.pid;
  browser.clientList[index].child = child;
};

browser.createChild({
  url: browser.url.format({
    pathname: browser.path.join(browser.files_dir, 'html', 'social.html'),
    protocol: 'file:',
    slashes: true,
  }),
  windowType: 'main window',
});

browser.electron.Menu.setApplicationMenu(null);
browser.electron.app.setAsDefaultProtocolClient('browser');
if (browser.electron.app.setUserTasks) {
  browser.electron.app.setUserTasks([]);
}
browser.electron.app.setAppUserModelId(process.execPath);
browser.electron.app.clearRecentDocuments();
browser.electron.app.disableHardwareAcceleration();
browser.electron.app.on('ready', function () {
  browser.electron.app.setAccessibilitySupportEnabled(true);
  browser.electron.app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath,
  });
  browser.electron.globalShortcut.unregisterAll();
  browser.electron.app.on('network-connected', () => {
    browser.log('network-connected');
  });

  browser.electron.app.on('network-disconnected', () => {
    browser.log('network-disconnected');
  });

  browser.var.cookies = browser.var.cookies || [];
  browser.var.session_list.forEach((s1) => {
    let ss = browser.electron.session.fromPartition(s1.name);
    ss.cookies.get({}).then((cookies) => {
      browser.var.cookies.push({
        name: s1.name,
        display: s1.display,
        cookies: cookies,
      });
    });
  });
});
browser.electron.app.on('second-instance', (event, commandLine, workingDirectory) => {
  browser.log('second-instance', commandLine);

  let url = commandLine.pop();

  if (!url || url.like('*--*') || url == '.') {
    url = browser.var.core.home_page;
  }

  if (url.like('*.js')) {
    return;
  }

  if (url && !url.like('http*') && !url.like('file*')) {
    u = 'file://' + u;
  }

  browser.createChild({
    url: url,
    windowType: 'main window',
  });
});
