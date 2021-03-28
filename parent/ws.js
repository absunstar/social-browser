module.exports = function init(parent) {
  parent.WebSocket = require('ws');
  parent._ws_ = new parent.WebSocket.Server({
    noServer: true,
  });

  parent.api.servers.forEach((server) => {
    server.on('upgrade', function upgrade(request, socket, head) {
      const pathname = parent.url.parse(request.url).pathname;

      if (pathname === '/ws') {
        parent._ws_.handleUpgrade(request, socket, head, function done(ws) {
          parent._ws_.emit('connection', ws, request);
        });
      }
    });
  });

  parent.clientList = [];
  parent.sendToAll = function (message) {
    parent.clientList.forEach((client) => {
      if (client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  };

  parent._ws_.on('connection', (ws, req) => {
    /** send connected message to client so client can request any data */
    ws.send(
      JSON.stringify({
        type: 'connected',
      }),
    );

    ws.on('message', (data) => {
      try {
        let message = JSON.parse(data);
        switch (message.type) {
          case '[attach-child]':
            let child = parent.clientList[message.index];
            if (!child) {
              return;
            }
            child.is_attached = true;
            child.ws = ws;

            ws.send(
              JSON.stringify({
                type: '[browser-core-data]',
                data_dir: parent.data_dir,
                options: child.options,
                mainWindow: parent.lastWindowStatus ? parent.lastWindowStatus.mainWindow : null,
                appRequestUrl: parent.appRequestUrl,
                newTabData: parent.newTabData || {
                  name: '[open new tab]',
                  url: parent.var.core.home_page,
                  partition: parent.var.core.session.partition,
                  user_name: parent.var.core.session.user_name,
                  active: true,
                  main_window_id: child.id,
                },
                var: parent.var,
                icon: parent.icons[process.platform],
                files_dir: parent.files_dir,
                dir: parent.dir,
                injectHTML: parent.files[0].data,
                windowSetting: child.setting || [],
                windowType: child.windowType,
                information: parent.information,
              }),
            );

            break;
          case '[un-attach-child]':
            parent.clientList[message.index].is_attached = false;
            console.log('[un-attach-child]');
            break;
          case '[send-render-message]':
            parent.clientList.forEach((client) => {
              if (client.index == message.data.options.parent_index && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[window-clicked]':
            parent.clientList.forEach((client) => {
              if (client.index != message.index && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[create-new-view]':
            parent.createChildProcess(message.options);
            break;
          case '[show-view]':
            parent.clientList.forEach((client) => {
              if (client.index != message.index && client.ws && client.ws.readyState === parent.WebSocket.OPEN && message.options.tab_id === client.options.tab_id) {
                message.is_current_view = true;
                client.ws.send(JSON.stringify(message));
              } else {
                message.is_current_view = false;
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[close-view]':
            parent.clientList.forEach((client) => {
              if (client.index != message.index && client.ws && client.ws.readyState === parent.WebSocket.OPEN && message.options.tab_id === client.options.tab_id) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[update-view-url]':
            parent.clientList.forEach((client) => {
              if (client.index !== message.index && message.options.tab_id === client.options.tab_id && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[send-window-status]':
            parent.lastWindowStatus = message;
            parent.clientList.forEach((client) => {
              if (client.index !== message.index && client.windowType === 'view' && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[request-window-status]':
            parent.clientList.forEach((client) => {
              if (client.windowType !== 'main' && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(parent.lastWindowStatus));
              }
            });
            break;
          case '[update-browser-var]':
            parent.set_var(message.options.name, message.options.data);
            parent.clientList.forEach((client) => {
              if (client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[update-tab-properties]':
            parent.clientList.forEach((client) => {
              if (client.windowType == 'main' && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[call-window-action]':
            parent.clientList.forEach((client) => {
              if (client.windowType !== 'main' && client.options.tab_id === message.data.tab_id && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[to-all]':
            parent.clientList.forEach((client) => {
              if (client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[to-other]':
            parent.clientList.forEach((client) => {
              if (client.index !== message.index && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[to-index]':
            parent.clientList.forEach((client) => {
              if (client.index === message.index && client.ws && client.ws.readyState === parent.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[download-link]':
            console.log(message);
            parent.handleSession(message.partition);
            let ss = parent.electron.session.fromPartition(message.partition);
            ss.downloadURL(message.url);

            break;
          case '[add-window-url]':
            parent.addURL(message);
            break;
          case '[import-extension]':
            parent.importExtension();
            break;
          case '[enable-extension]':
            parent.enableExtension(message.extension);
            break;
          case '[disable-extension]':
            parent.disableExtension(message.extension);
            break;
          case '[remove-extension]':
            parent.removeExtension(message.extension);
            break;
          default:
            break;
        }
      } catch (e) {
        ws.send(
          JSON.stringify({
            type: 'ERROR',
            payload: e,
          }),
        );
      }
    });
  });
};
