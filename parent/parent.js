module.exports = function init(parent) {
  parent.ipcRenderer = parent.electron.ipcRenderer;
  parent.session = parent.electron.session;
  parent.clipboard = parent.electron.clipboard;
  parent.remote = parent.electron.remote;
  parent.shell = parent.electron.shell;
  parent.dialog = parent.electron.dialog;
  parent.clientList = [];
  parent.ipcClientList = [];
  parent.extensionList = [];
  parent.information = {};
  parent.cookies = {};

  parent.importExtension = function () {
    parent.electron.dialog
      .showOpenDialog({
        properties: ['openDirectory'],
      })
      .then((result) => {
        if (result.canceled === false && result.filePaths.length > 0) {
          let path = result.filePaths[0] + '/index.js';
          parent.loadExtension({ path: path });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  parent.loadExtension = function (_extension, exists) {
    if (!_extension) {
      return null;
    }
    let path = _extension.path.replace('{dir}', parent.dir);
    if (!parent.api.isFileExistsSync(path)) {
      return null;
    }
    let extension = require(path)(parent);
    if (!extension) {
      return;
    }
    extension.path = path;
    extension.index = parent.extensionList.length;
    extension.id = _extension.id || extension.id;
    parent.extensionList.push(extension);
    if (extension.init) {
      extension.init();
    }

    if (!exists) {
      parent.var.extension_list.push({
        id: _extension.id || extension.id,
        path: extension.path,
        name: extension.name,
        description: extension.description,
        paid: extension.paid,
        canDelete: extension.canDelete,
        isEnabled: false,
      });

      parent.applay('extension_list');
    } else {
      if (_extension.isEnabled) {
        if (extension.enable) {
          extension.enable();
        }
      }
    }

    return extension;
  };

  parent.enableExtension = function (extension) {
    console.log('enableExtension', extension);
    extension = parent.extensionList.find((exx) => exx.id === extension.id);
    if (extension && extension.enable) {
      extension.enable();

      parent.var.extension_list.forEach((ex) => {
        if (ex.id === extension.id) {
          ex.isEnabled = true;
        }
      });
      parent.applay('extension_list');
    }
  };
  parent.disableExtension = function (extension) {
    console.log('disableExtension', extension);
    extension = parent.extensionList.find((exx) => exx.id === extension.id);
    if (extension && extension.disable) {
      extension.disable();
      parent.var.extension_list.forEach((ex, i) => {
        if (ex.id === extension.id) {
          parent.var.extension_list[i].isEnabled = false;
        }
      });
      parent.applay('extension_list');
    }
  };

  parent.removeExtension = function (extension) {
    parent.var.extension_list.forEach((ex, i) => {
      if (ex.id === extension.id) {
        extension = parent.extensionList.find((exx) => exx.id == ex.id);
        if (extension && extension.remove) {
          extension.remove();
        }
        parent.extensionList.splice(extension.index, 1);
        parent.var.extension_list.splice(i, 1);
        parent.log('removeExtension');
      }
    });
    parent.applay('extension_list');
  };
  parent.applay = function (name) {
    parent.save_var(name);
  };
  require(parent.path.join(parent.dir, 'parent', 'fn.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'file.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'download.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'data.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'session.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'api.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'ipc.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'ws.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'chat.js'))(parent);
  // if (parent.speedMode) {
  //     require(parent.path.join(parent.dir, 'child', 'windows.js'))(parent);
  //     require(parent.path.join(parent.dir, 'child', 'ipc.js'))(parent);
  // }
  // require(parent.path.join(parent.dir, 'parent', 'host.js'))(parent);
  //  require(parent.path.join(parent.dir, 'spiders', 'page-urls.js'))(parent);
  //  require(parent.path.join(parent.dir, 'spiders', 'page-info.js'))(parent);
  //  require(parent.path.join(parent.dir, 'spiders', 'page-content.js'))(parent);

  if (process.platform == 'win32') {
    parent.exec('wmic CPU get ProcessorId', (d) => {
      parent.information['ProcessorId'] = d.replace(/\n|\r|\t|\s+|ProcessorId/g, '');
    });
    parent.exec('wmic DISKDRIVE get SerialNumber', (d) => {
      parent.information['DISKDRIVE'] = d.replace(/\n|\r|\t|\s+|SerialNumber/g, '');
    });
    parent.exec('wmic BIOS get SerialNumber', (d) => {
      parent.information['BIOS'] = d.replace(/\n|\r|\t|\s+|SerialNumber/g, '');
    });
  }

  parent.createChildWindow = function (options) {
    parent.createNewWindow(options);
  };

  parent.createChildProcess = function (options) {
    options = options || {};
    options.partition = options.partition || parent.var.core.session.name;
    options.user_name = options.user_name || options.partition;

    options.uuid = !options.partition.contains('persist:') ? 'x-ghost' : options.partition;

    let index = parent.clientList.findIndex((cl) => cl && cl.uuid === options.uuid);
    if (index !== -1 && parent.clientList[index]) {
      parent.clientList[index].windowType = options.windowType || 'popup';
      parent.clientList[index].option_list.push(options);
      parent.clientList[index].options = options;
      parent.clientList[index].ws.send({ type: 're-connected' });
      console.log(`\n\n re-use  [ ${options.uuid} ] \n\n`);
    } else {
      console.log(`\n\n new [ ${options.uuid} ] \n\n`);
      parent.clientList.push({
        source: 'child',
        partition: options.partition,
        uuid: options.uuid,
        option_list: [options],
        windowType: options.windowType || 'popup',
        index: index,
        options: options,
      });

      index = parent.clientList.length -1;

      let child = parent.run(['--index=' + index, '--uuid=' + options.uuid, '--dir=' + parent.dir, '--data_dir=' + parent.data_dir, '--speed=' + (parent.speedMode || ''), parent.dir + '/child/child.js']);

      parent.clientList[index].id = child.pid;
      parent.clientList[index].pid = child.pid;
      parent.clientList[index].child = child;

      child.stdout.on('data', function (data) {
        parent.log(` [ child ${options.uuid} / ${parent.clientList.length} ] Log \n  ${data}`);
      });

      child.stderr.on('data', (data) => {
        //  parent.log(` [ child ${options.uuid} / ${parent.clientList.length} ] Error \n    ${data}`);
      });

      child.on('close', (code, signal) => {
        parent.log(`\n [ child ${options.uuid} / ${parent.clientList.length} ] close with code ( ${code} ) and signal ( ${signal} ) \n`);

        let index = parent.clientList.findIndex((c) => c.uuid == options.uuid);
        if (parent.clientList[index].option_list.some(op => op.windowType == 'main') && code == 2147483651 && !signal) {
          console.log('\n\n ................. Main Window Close UpNormal ..............\n\n');

          parent.createChildProcess(parent.clientList[index].option_list.find(op.windowType == 'main'));

          parent.clientList.forEach((client, i) => {
            if (client.option_list.some(op.windowType == 'view')) {
              client.ws.send({
                type: '[set-window]',
              });
            }
          });
        }

        parent.clientList[index].option_list.forEach((op) => {
          if (op.tab_id) {
            parent.clientList.forEach((client, i) => {
              if (client.windowType === 'main') {
                client.ws.send({
                  type: '[remove-tab]',
                  tab_id: op.tab_id,
                });
              }
            });
          }
        });

        if (parent.clientList[index]) {
          parent.clientList.splice(index, 1);
        }

      });

      child.on('error', (err) => {
        //  parent.log(` [ child ${options.uuid} / ${parent.clientList.length} ] Error \n ${err}`);
      });
      child.on('disconnect', (err) => {
        //  parent.log(` [ child ${options.uuid} / ${parent.clientList.length} ] disconnect`, err);
      });
      child.on('spawn', (err) => {
        // parent.log(` [ child ${options.uuid} / ${parent.clientList.length} ] spawn`, err);
      });
      child.on('message', (msg) => {
        // parent.log(` [ child ${options.uuid} / ${parent.clientList.length} ] message`, msg);
      });


    }
  };

  parent.var.extension_list = parent.var.extension_list || [];
  parent.var.extension_list.forEach((ex) => {
    parent.loadExtension(ex, true);
  });

  parent.checkUpdate = function () {
    parent.api
      .fetch('https://gitcdn.link/repo/absunstar/smart-apps/main/browser/site_files/json/info.json', {
        mode: 'no-cors',
        headers: {
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9,ar;q=0.8',
          'cache-control': 'max-age=0',
          dnt: 1,
          'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': 1,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
        },
        agent: function (_parsedURL) {
          if (_parsedURL.protocol == 'http:') {
            return new parent.api.http.Agent({
              keepAlive: true,
            });
          } else {
            return new parent.api.https.Agent({
              keepAlive: true,
            });
          }
        },
      })
      .then((res) => {
        return res.json();
      })
      .then((info) => {
        console.log(info);
        if (info.version > parent.var.core.version) {
          console.log('Will Updating');
          // parent.child_process.spawn('C:\\Users\\share\\Downloads\\social_browser_64.exe', null, { detached: true });
          // process.exit();
        } else {
          console.log('No Updated');
        }
      });
  };

  // parent.checkUpdate();
};
