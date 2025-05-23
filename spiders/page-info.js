module.exports = function init(browser) {
  const { ipcMain, BrowserWindow } = browser.electron;

  let search_list = [];
  let win = null;
  let info = null;

  ipcMain.on('page-info', (event, arg) => {
    if (info.res) {
      info.res.json(arg);
    }
    if (win && !win.isDestroyed()) {
      win.close();
    }
  });

  function findPageInfo() {
    if (search_list.length > 0) {
      info = search_list.pop();
    } else {
      setTimeout(() => {
        findPageInfo();
      }, 1000);
      return null;
    }

    console.log('Spider page-info >>> ' + info.data.url);

    win = new BrowserWindow({
      show: false,
      width: 1200,
      height: 800,
      webPreferences: {
        partition: info.data.partition,
        webaudio: false,
        enableRemoteModule: true,
        contextIsolation: false,
        preload: __dirname + '/preload/page-info.js',
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        experimentalFeatures: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        plugins: false,
      },
    });

    win.webContents.audioMuted = true;

    win.webContents.on('permissionrequest', function (e) {
      e.request.allow();
    });

    win.on('closed', () => {
      console.log('... Page-Info window closed ...');
      findPageInfo();
    });
    win.on('unresponsive', () => {
      win.close();
    });

    win.once('ready-to-show', () => {
      // win.showInactive()
    });

    win.loadURL(info.data.url);
  }

  findPageInfo();

  function tryFindPageInfo(data, res) {
    search_list.push({
      win: null,
      data: data,
      res: res,
    });
  }

  browser.api.onPOST('/api/page-info-spider', (req, res) => {
    if (req.data.url) {
      tryFindPageInfo(req.data, res);
    } else {
      res.json({ done: false, error: 'No URL Requested' });
    }
  });
};
