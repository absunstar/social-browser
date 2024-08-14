module.exports = function init(parent) {
  parent.ipc = require('node-ipc');

  parent.ipc.config.id = 'world';
  parent.ipc.config.retry = 1500;
  parent.ipc.config.logger = function () {};

  parent.ipc.serve(function () {
    parent.ipc.server.on('message', function (data, socket) {
      data = JSON.parse(data);
      if (data.type == 'attach') {
        let client = parent.ipcClientList[data.index];
        if (!client) {
          return;
        }
        client.socket = socket;
        client.pid = data.pid;
        parent.sendToClient(client, {
          type: 'attached',
        });
        if (client.windowType === 'view' && parent.mainWindowDataMessage) {
          parent.sendToClient(client, parent.mainWindowDataMessage);
        }
      } else if (data.type == '[main-window-data-changed]') {
        parent.mainWindowDataMessage = data;
        parent.ipcClientList.forEach((client) => {
          if (client.windowType === 'view') {
            parent.sendToClient(client, data);
          }
        });
      }
    });
    parent.ipc.server.on('socket.disconnected', function (socket, destroyedSocketID) {
      parent.ipc.log('client ' + destroyedSocketID + ' has disconnected!');
    });
  });

  parent.sendToClient = function (client, obj) {
    parent.ipc.server.emit(client.socket, 'message', JSON.stringify(obj));
  };
  parent.ipc.server.start();
};
