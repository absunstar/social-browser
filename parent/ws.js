module.exports = function init(browser) {
  browser.WebSocket = require('ws');
  browser._ws_ = new browser.WebSocket.Server({
    noServer: true,
  });

  browser.site.servers.forEach((server) => {
    server.on('upgrade', function upgrade(request, socket, head) {
      const pathname = browser.url.parse(request.url).pathname;

      if (pathname === '/ws') {
        browser._ws_.handleUpgrade(request, socket, head, function done(ws) {
          browser._ws_.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  });

  browser.clientList = [];

  browser._ws_.on('connection', (ws , req) => {
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
            let child = browser.clientList[message.index];
            if (!child) {
              return;
            }
            child.is_attached = true;
            child.ws = ws;
            ws.send(
              JSON.stringify({
                type: '[browser-core-data]',
                data_dir: browser.data_dir,
                options: child.options,
                mainWindow: browser.lastWindowStatus ? browser.lastWindowStatus.mainWindow : null,
                appRequestUrl: browser.appRequestUrl,
                newTabdata: browser.newTabdata || {
                  name: '[open new tab]',
                  url: browser.var.core.default_page,
                  partition: browser.var.core.session.partition,
                  user_name: browser.var.core.session.user_name,
                  active: true,
                  main_window_id: child.id,
                },
                var: browser.var,
                icon: browser.icons[process.platform],
                files_dir: browser.files_dir,
                dir: browser.dir,
                custom_request_header_list: browser.custom_request_header_list || [],
                injectHTML: browser.files[0].data,
                windowSetting: child.setting || [],
                windowType: child.windowType,
              }),
            );
            break;
          case '[send-render-message]':
            browser.clientList.forEach((client) => {
              if (client.index == message.data.options.parent_index && client.ws.readyState === browser.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[create-new-view]':
            browser.createChild(message.options);
            break;
          case '[show-view]':
            browser.clientList.forEach((client) => {
              if (client.index != message.index && client.ws && client.ws.readyState === browser.WebSocket.OPEN && message.options.tab_id === client.options.tab_id) {
                message.is_current_view = true;
                client.ws.send(JSON.stringify(message));
              } else {
                message.is_current_view = false;
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[close-view]':
            browser.clientList.forEach((client) => {
              if (client.index != message.index && client.ws && client.ws.readyState === browser.WebSocket.OPEN && message.options.tab_id === client.options.tab_id) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[update-view-url]':
            browser.clientList.forEach((client) => {
              if (client.index != message.index && client.ws && client.ws.readyState === browser.WebSocket.OPEN && message.options.tab_id === client.options.tab_id) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[send-window-status]':
            browser.lastWindowStatus = message;
            browser.clientList.forEach((client) => {
              if (client.index !== message.index && client.ws && client.ws.readyState === browser.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[request-window-status]':
            browser.clientList.forEach((client) => {
              if (client.windowType !== 'main window' && client.ws && client.ws.readyState === browser.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(browser.lastWindowStatus));
              }
            });
            break;
          case '[update-browser-var]':
            browser.set_var(message.options.name, message.options.data);
            browser.clientList.forEach((client) => {
              if (client.index !== message.index && client.ws && client.ws.readyState === browser.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[update-tab-properties]':
            browser.clientList.forEach((client) => {
              if (client.windowType == 'main window' && client.ws && client.ws.readyState === browser.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
            break;
          case '[call-window-action]':
            browser.clientList.forEach((client) => {
              if (client.windowType !== 'main window' && client.options.tab_id === message.data.tab_id && client.ws && client.ws.readyState === browser.WebSocket.OPEN) {
                client.ws.send(JSON.stringify(message));
              }
            });
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
