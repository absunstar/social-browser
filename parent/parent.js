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
  parent.freeUsersCount = 100;
  parent.eval = require('eval');

  parent.isAllowURL = function (url) {
    if (parent.var.blocking.white_list.some((item) => url.like(item.url))) {
      return true;
    }
    let allow = true;
    if (parent.var.blocking.core.block_ads) {
      allow = !parent.var.ad_list.some((ad) => url.like(ad.url));
    }

    if (allow) {
      allow = !parent.var.blocking.black_list.some((item) => url.like(item.url));
    }

    if (allow && parent.var.blocking.allow_safty_mode) {
      allow = !parent.var.blocking.un_safe_list.some((item) => url.like(item.url));
    }
    return allow;
  };

  parent.importExtension = function () {
    parent.electron.dialog
      .showOpenDialog({
        properties: ['openDirectory'],
      })
      .then((result) => {
        parent.sendMessage({ type: 'share', message: '[show-main-window]' });
        if (result.canceled === false && result.filePaths.length > 0) {
          let path = result.filePaths[0] + '/index.js';
          parent.loadExtension({ path: path });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  parent.loadExtension = function (_extension, isExists = false) {
    if (!_extension || !_extension.path) {
      return null;
    }
    let path = _extension.path.replace('{dir}', parent.dir);
    if (!parent.api.isFileExistsSync(path)) {
      return null;
    }
    delete require.cache[require.resolve(path)];
    let extension = require(path)(parent);
    if (!extension) {
      return;
    }

    extension.path = path;

    let index = parent.extensionList.findIndex((exx) => exx.id == extension.id);
    if (index === -1) {
      parent.extensionList.push(extension);
      if (extension.init) {
        extension.init();
      }
    } else {
      parent.extensionList[index] = extension;
      if (extension.init) {
        extension.init();
      }
    }

    if (!isExists) {
      let index2 = parent.var.extension_list.findIndex((exx) => exx.id == extension.id);
      if (index2 === -1) {
        parent.var.extension_list.push({
          id: extension.id,
          path: extension.path,
          name: extension.name,
          description: extension.description,
          paid: extension.paid,
          canDelete: parent.var.core.id.like('*developer*') ? true : extension.canDelete,
          isEnabled: false,
        });
        parent.applay('extension_list');
      }
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
    delete extension.parentSetting;
    let index = parent.extensionList.findIndex((exx) => exx.id === extension.id);
    if (index !== -1) {
      extension = parent.extensionList[index];
      extension = parent.loadExtension(extension);
    } else {
      console.log('enableExtension Not Exists', extension, parent.extensionList);
      return false;
    }

    if (extension && extension.enable) {
      extension.enable();
    }
    let index2 = parent.var.extension_list.findIndex((exx) => exx.id === extension.id);
    if (index2 !== -1) {
      parent.var.extension_list[index2].isEnabled = true;
    }
    parent.applay('extension_list');
  };
  parent.disableExtension = function (extension) {
    delete extension.parentSetting;
    let index = parent.extensionList.findIndex((exx) => exx.id == extension.id);
    if (index !== -1) {
      if (parent.extensionList[index].disable) {
        parent.extensionList[index].disable();
      }
    }
    let index2 = parent.var.extension_list.findIndex((exx) => exx.id == extension.id);
    if (index2 !== -1) {
      parent.var.extension_list[index2].isEnabled = false;
    }
    parent.applay('extension_list');
  };

  parent.removeExtension = function (extension) {
    parent.extensionList = parent.extensionList.filter((exx) => exx.id !== extension.id);
    parent.var.extension_list = parent.var.extension_list.filter((exx) => exx.id !== extension.id);

    parent.applay('extension_list');
  };
  parent.applay = function (name) {
    parent.save_var(name);
  };

  require(parent.path.join(parent.dir, 'parent', 'fn.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'file.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'download.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'api.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'data.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'session.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'ipc.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'ws.js'))(parent);
  require(parent.path.join(parent.dir, 'parent', 'chat.js'))(parent);
  // require(parent.path.join(parent.dir, 'parent', 'test.js'))(parent);

  parent.httpTrustedOnline();

  // if (parent.speedMode) {
  //     require(parent.path.join(parent.dir, 'child', 'windows.js'))(parent);
  //     require(parent.path.join(parent.dir, 'child', 'ipc.js'))(parent);
  // }
  // require(parent.path.join(parent.dir, 'parent', 'host.js'))(parent);
  //  require(parent.path.join(parent.dir, 'spiders', 'page-urls.js'))(parent);
  //  require(parent.path.join(parent.dir, 'spiders', 'page-info.js'))(parent);
  //  require(parent.path.join(parent.dir, 'spiders', 'page-content.js'))(parent);

  parent.createChildWindow = function (options) {
    parent.createNewWindow(options);
  };

  parent.createChildProcess = function (_options) {
    let options = { ..._options };
    options.partition = options.partition || parent.var.core.session.name;
    options.user_name = options.user_name || options.partition;

    options.uuid = !options.partition.contains('persist:') ? 'x-ghost' : 'user-' + options.partition.replace('persist:', '');
    const uuid = options.uuid;

    let index = parent.clientList.findIndex((cl) => cl && cl.uuid === uuid);
    if (index !== -1 && parent.clientList[index]) {
      parent.clientList[index].windowType = options.windowType || 'popup';
      parent.clientList[index].option_list.push(options);
      parent.clientList[index].options = options;
      if (parent.clientList[index].ws) {
        parent.clientList[index].ws.send({ type: 're-connected' });
      }
    } else {
      index = parent.clientList.length;
      parent.clientList.push({
        source: 'child',
        partition: options.partition,
        uuid: uuid,
        option_list: [options],
        windowType: options.windowType || 'popup',
        index: index,
        options: options,
      });

      let child = parent.run([
        '--index=' + index,
        '--uuid=' + uuid,
        '--partition=' + options.partition,
        '--dir=' + parent.dir,
        '--data_dir=' + parent.data_dir,
        '--speed=' + (parent.speedMode || ''),
        parent.dir + '/child/child.js',
      ]);

      parent.clientList[index].id = child.pid;
      parent.clientList[index].pid = child.pid;
      parent.clientList[index].child = child;

      child.stdout.on('data', function (data) {
        parent.log('\n-------------------------------- [stdout]');
        parent.log(` [ child:${child.pid} ${uuid} / ${parent.clientList.length} ] Log \n  ${data}`);
        parent.log('\n\n');
      });

      child.stderr.on('data', (data) => {
        parent.log('\n-------------------------------- [stderr]');
        parent.log(` [ child:${child.pid} ${uuid} / ${parent.clientList.length} ] Error \n    ${data}`);
        parent.log('\n\n');
      });

      child.on('error', (err) => {
        parent.log('\n-------------------------------- [error]');
        parent.log(` [ child ${uuid} / ${parent.clientList.length} ] Error \n ${err}`);
        parent.log('\n\n');
      });
      child.on('disconnect', (err) => {
        parent.log(` [ child ${uuid} / ${parent.clientList.length} ] disconnect`, err);
      });
      child.on('spawn', (err) => {
        // parent.log(` [ child ${uuid} / ${parent.clientList.length} ] spawn`, err);
      });
      child.on('message', (msg) => {
        // parent.log(` [ child ${uuid} / ${parent.clientList.length} ] message`, msg);
      });
      child.on('close', (code, signal) => {
        parent.log(`\n [ Exit :: child:${child.pid} ${uuid} / ${parent.clientList.length} ] close with code ( ${code} ) and signal ( ${signal} ) \n`);

        let index2 = parent.clientList.findIndex((c) => c.uuid == uuid);
        if (index2 !== -1) {
          if (parent.clientList[index2].option_list.some((op) => op.windowType == 'main') && code == 2147483651 && !signal) {
            console.log('\n\n ................. Main Window Close UpNormal ..............\n\n');

            parent.createChildProcess(parent.clientList[index2].option_list.find(op.windowType == 'main'));

            parent.clientList.forEach((client, i) => {
              if (client.option_list.some(op.windowType == 'view')) {
                client.ws.send({
                  type: '[set-window]',
                });
              }
            });
          }

          parent.clientList[index2].option_list.forEach((op) => {
            if (op.tabID && op.windowType === 'view') {
              parent.clientList.forEach((client, i) => {
                if (client.windowType === 'main') {
                  client.ws.send({
                    type: '[remove-tab]',
                    tabID: op.tabID,
                  });
                }
              });
            }
          });

          parent.clientList = parent.clientList.filter((c) => c.uuid !== uuid);
        }
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
