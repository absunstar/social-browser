module.exports = function init(parent) {
  parent.ipcRenderer = parent.electron.ipcRenderer;
  parent.session = parent.electron.session;
  parent.clipboard = parent.electron.clipboard;
  parent.remote = parent.electron.remote;
  parent.shell = parent.electron.shell;
  parent.dialog = parent.electron.dialog;
  parent.child_index = 0;
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
      return;
    }
    let path = _extension.path.replace('{dir}', parent.dir);
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

      parent.set_var('extension_list', parent.var.extension_list);

      parent.sendToAll({
        type: '[update-browser-var]',
        options: {
          name: 'extension_list',
          data: parent.var.extension_list,
        },
      });
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
    extension = parent.extensionList.find((exx) => exx.id === extension.id);
    if (extension && extension.enable) {
      extension.enable();
      parent.var.extension_list.forEach((ex) => {
        if (ex.id === extension.id) {
          ex.isEnabled = true;
        }
      });
      parent.set_var('extension_list', parent.var.extension_list);
      parent.sendToAll({
        type: '[update-browser-var]',
        options: {
          name: 'extension_list',
          data: parent.var.extension_list,
        },
      });
    }
  };
  parent.disableExtension = function (extension) {
    extension = parent.extensionList.find((exx) => exx.id === extension.id);
    if (extension && extension.disable) {
      extension.disable();
      parent.var.extension_list.forEach((ex) => {
        if (ex.id === extension.id) {
          ex.isEnabled = false;
        }
      });
      parent.set_var('extension_list', parent.var.extension_list);
      parent.sendToAll({
        type: '[update-browser-var]',
        options: {
          name: 'extension_list',
          data: parent.var.extension_list,
        },
      });
    }
  };

  parent.removeExtension = function (extension) {
    parent.var.extension_list.forEach((ex, i) => {
      if (ex.id === extension.id) {
        extension = parent.extensionList.find((exx) => exx.id === ex.id);
        if (extension && extension.remove) {
          extension.remove();
        }
        parent.extensionList.splice(extension.index, 1);
        parent.var.extension_list.splice(i, 1);
        parent.log('removeExtension');
      }
    });
    parent.set_var('extension_list', parent.var.extension_list);
    parent.sendToAll({
      type: '[update-browser-var]',
      options: {
        name: 'extension_list',
        data: parent.var.extension_list,
      },
    });
  };
  parent.applay = function (name) {
    parent.sendToAll({
      type: '[update-browser-var]',
      options: {
        name: name,
        data: parent.var[name],
      },
    });
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

  parent.createChildProcess = function (options) {
    options = options || {};
    options.partition = options.partition || parent.var.core.session.name;
    options.username = options.username || parent.var.core.session.display;

    let child = parent.clientList.find((cl) => cl && cl.is_attached === false);
    if (child && parent.clientList[child.index]) {
      parent.clientList[child.index].windowType = options.windowType || 'popup';
      parent.clientList[child.index].options = options;
      parent.clientList[child.index].ws.send({ type: 'connected' });
      if (parent.clientList.filter((cl) => cl && cl.is_attached === false).length === 0) {
        parent.createChildProcess({
          windowType: 'none',
        });
      }
    } else {
      let index = parent.child_index;
      parent.child_index++;
      parent.clientList[index] = {
        source: 'child',
        index: index,
        windowType: options.windowType || 'popup',
        options: options,
      };
      // parent.ipcClientList[index] = {
      //   source: 'child',
      //   index: index,
      //   windowType: options.windowType || 'popup',
      //   options: options,
      // };

      let child = parent.run(['--index=' + index, '--dir=' + parent.dir, parent.dir + '/child/child.js']);

      child.stdout.on('data', function (data) {
        parent.log(` [ child ${child.pid} ] Log \n      ${data}`);
      });

      child.stderr.on('data', (data) => {
        parent.log(` [ child ${child.pid} ] Error \n    ${data}`);
      });

      child.on('close', (code, signal) => {
        parent.log(` [child ${child.pid} ] close with code ( ${code} ) and signal ( ${signal} )`);

        if (!parent.clientList[index] || !parent.clientList[index].options || !parent.clientList[index].options.tab_id) {
          if (parent.clientList[index]) {
            parent.clientList.splice(index, 1);
          }
          return;
        }

        let tab_id = parent.clientList[index].options.tab_id;

        parent.clientList.forEach((client, i) => {
          if (client.windowType === 'main') {
            client.ws.send({
              type: '[remove-tab]',
              tab_id: tab_id,
            });
          }
        });

        if (parent.clientList[index]) {
          parent.clientList.splice(index, 1);
        }
      });

      child.on('error', (err) => {
        parent.log(` [ child ${child.pid} ] Error \n ${err}`);
      });
      child.on('disconnect', (err) => {
        parent.log(` [ child ${child.pid} ] disconnect`);
      });
      child.on('spawn', (err) => {
        parent.log(` [ child ${child.pid} ] spawn`);
      });
      child.on('message', (msg) => {
        parent.log(msg);
      });

      parent.clientList[index].id = child.pid;
      parent.clientList[index].pid = child.pid;
      parent.clientList[index].child = child;

      setTimeout(() => {
        if (parent.clientList.filter((cl) => cl && cl.is_attached === false).length === 0) {
          parent.createChildProcess({
            windowType: 'none',
          });
        }
      }, 1000 * 5);
    }
  };

  parent.var.extension_list = parent.var.extension_list || [];
  parent.var.extension_list.forEach((ex) => {
    parent.loadExtension(ex, true);
  });

  
};
