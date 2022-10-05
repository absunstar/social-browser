module.exports = function init(parent) {
  // parent.WebSocket = require('ws');
  // parent._ws_ = new parent.WebSocket.Server({
  //   noServer: true,
  //   maxPayload: 128 * 1024 * 1024, // 128 MB
  // });

  parent.api.onWS('/ws', (ws_user) => {
    ws_user.isAlive = true;
    ws_user.onMessage = function (message) {
      switch (message.type) {
        case 'connected':
          ws_user.send({ type: 'connected' });
          break;
        case '[request-browser-core-data]':
          let child = parent.clientList[message.index];
          if (!child) {
            return;
          }
          child.is_attached = true;
          child.ws = ws_user;
          let m = {
            type: '[browser-core-data]',
            data_dir: parent.data_dir,
            options: child.options,
            lastWindowStatus: parent.lastWindowStatus ? parent.lastWindowStatus.mainWindow : null,
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
            injectCSS: parent.files[1].data,
            windowSetting: child.setting || [],
            windowType: child.windowType,
            information: parent.information,
          };

          child.ws.send(m);

          break;
        case '[re-request-browser-core-data]':
          let child2 = parent.clientList[message.index];
          if (!child2) {
            return;
          }
          let m2 = {
            type: '[re-browser-core-data]',
            options: child2.options,
          };

          child2.ws.send(m2);

          break;
        case 'share':
          parent.clientList.forEach((client) => {
            if (client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[un-attach-child]':
          let ch2 = parent.clientList[message.index];
          if (ch2) {
            ch2.is_attached = false;
          }

          break;
        case '[send-render-message]':
          parent.clientList.forEach((client) => {
            let index = message.data.__options ? message.data.__options.parent_index : 0;
            let child_id = message.data.child_id;
            if ((client.index == index || client.pid == child_id) && client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[window-clicked]':
          parent.clientList.forEach((client) => {
            if (client.index != message.index && client.ws) {
              client.ws.send(message);
            }
          });
          break;
          case '[create-new-window]':
            parent.createChildProcess(message.options);
            break;
        case '[create-new-view]':
          parent.createChildProcess(message.options);
          break;
        case '[show-view]':
          parent.clientList.forEach((client) => {
            if (client.index != message.index && client.ws) {
              if (client.option_list.some((op) => op.tab_id === message.options.tab_id)) {
                message.is_current_view = true;
                client.ws.send(message);
              } else {
                message.is_current_view = false;
                client.ws.send(message);
              }
            }
          });
          break;
        case '[close-view]':
          parent.clientList.forEach((client) => {
            if (client.index != message.index && client.ws && client.option_list.some((op) => op.tab_id === message.options.tab_id)) {
              client.ws.send(message);
            }
          });
          break;
        case '[update-view-url]':
          parent.clientList.forEach((client) => {
            if (client.index !== message.index && client.ws && client.option_list.some((op) => op.tab_id === message.options.tab_id)) {
              client.ws.send(message);
            }
          });
          break;
        case '[send-window-status]':
          parent.lastWindowStatus = message;
          parent.clientList.forEach((client) => {
            if (client.index !== message.index && client.ws && client.windowType === 'view') {
              client.ws.send(message);
            }
          });
          break;
        case '[request-window-status]':
          parent.clientList.forEach((client) => {
            if (parent.lastWindowStatus && client.windowType !== 'main' && client.ws) {
              client.ws.send(parent.lastWindowStatus);
            }
          });
          break;
        case '[run-window-update]':
          parent.createChildProcess({
            url: parent.url.format({
              pathname: parent.path.join(parent.dir, 'updates', 'index.html'),
              protocol: 'file:',
              slashes: true,
            }),
            windowType: 'updates',
            show: true,
            trusted: true,
            partition: 'updates',
          });
          break;
        case '[update-browser-var]':
          parent.set_var(message.options.name, message.options.data);
          break;
        case '[update-browser-var][user_data_input][add]':
          parent.var.user_data_input.push(message.data);
          parent.set_var('user_data_input', parent.var.user_data_input);
          break;
        case '[update-browser-var][user_data][add]':
          parent.var.user_data.push(message.data);
          parent.set_var('user_data', parent.var.user_data);
          break;
        case '[update-browser-var][user_data_input][update]':
          parent.var.user_data_input.forEach((u) => {
            if (u.id === message.data.id) {
              u.data = message.data.data;
            }
          });
          parent.set_var('user_data_input', parent.var.user_data_input);
          break;
        case '[update-browser-var][user_data][update]':
          parent.var.user_data.forEach((u) => {
            if (u.id === message.data.id) {
              u.data = message.data.data;
            }
          });
          parent.set_var('user_data', parent.var.user_data);
          break;
        case '[update-tab-properties]':
          parent.clientList.forEach((client) => {
            if (client.option_list.some((op) => op.windowType == 'main') && client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[call-window-action]':
          parent.clientList.forEach((client) => {
            if (client.windowType !== 'main' && client.ws && client.option_list.some((op) => op.tab_id === message.data.tab_id)) {
              client.ws.send(message);
            }
          });
          break;
        case '[to-all]':
          parent.clientList.forEach((client) => {
            if (client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[to-other]':
          parent.clientList.forEach((client) => {
            if (client.index !== message.index && client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[to-index]':
          parent.clientList.forEach((client) => {
            if (client.index === message.index && client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[remove-proxy]':
          parent.var.proxy_list.forEach((p, i) => {
            if (message.proxy.ip === p.ip && message.proxy.port === p.port) {
              parent.var.proxy_list.splice(i, 1);
            }
          });

          parent.set_var('proxy_list', parent.var.proxy_list);
          break;
        case '[download-link]':
          if (parent.var.last_download_url === message.url) {
            parent.log(' Parent Will Download Cancel Duplicate : ' + message.url);
            setTimeout(() => {
              parent.var.last_download_url = '';
            }, 1000 * 5);
            return;
          }
          parent.var.last_download_url = message.url;
          parent.handleSession({ name: message.partition });
          let ss = parent.electron.session.fromPartition(message.partition);
          ss.downloadURL(message.url);

          break;
        case '[cookie-changed]':
          // console.log('[cookie-changed]', message.cookie);
          parent.clientList.forEach((client) => {
            if (client.index !== message.index && client.windowType !== 'main' && client.ws) {
              client.ws.send(message);
            }
          });
          parent.cookies[message.partition] = parent.cookies[message.partition] || [];
          if (!message.removed) {
            let exists = false;
            parent.cookies[message.partition].forEach((co, i) => {
              if (co.domain == message.cookie.domain && co.name == message.cookie.name) {
                exists = true;
                parent.cookies[message.partition][i] = message.cookie;
              }
            });
            if (!exists) {
              parent.cookies[message.partition].push(message.cookie);
            }
          } else {
            parent.cookies[message.partition].forEach((co, i) => {
              if (co.domain == message.cookie.domain && co.name == message.cookie.name) {
                parent.cookies[message.partition].splice(i, 1);
              }
            });
          }
          break;
        case '[cookies-added]':
          let session1 = '__cookies_' + message.partition.replace(':', '_') + '_list';
          parent.var[session1] = parent.var[session1] || [];
          let exists = false;
          parent.var[session1].forEach((co, i) => {
            if (co && co.domain == message.cookie.domain && co.name == message.cookie.name) {
              exists = true;
              parent.var[session1][i] = message.cookie;
            }
          });
          if (!exists) {
            parent.var[session1].push({
              ...message.cookie,
            });
          }
          parent.save_var(session1);
          break;
        case '[cookies-updated]':
          let session2 = '__cookies_' + message.partition.replace(':', '_') + '_list';
          parent.var[session2] = parent.var[session2] || [];
          parent.var[session2].forEach((co, i) => {
            if (co && co.domain == message.cookie.domain && co.name == message.cookie.name) {
              parent.var[session2][i] = message.cookie;
            }
          });
          parent.save_var(session2);
          break;
        case '[cookies-deleted]':
          let session3 = '__cookies_' + message.partition.replace(':', '_') + '_list';

          parent.var[session3] = parent.var[session3] || [];
          parent.var[session3].forEach((co, i) => {
            if (co && co.domain == message.cookie.domain && co.name == message.cookie.name) {
              delete parent.var[session3][i];
            }
          });
          parent.save_var(session3);
          break;
        case '[cookies-clear]':
          let session4 = '__cookies_' + message.partition.replace(':', '_') + '_list';
          parent.var[session4] = parent.var[session4] || [];
          parent.var[session4].forEach((co, i) => {
            if (co && co.domain.contains(message.cookie.domain)) {
              delete parent.var[session4][i];
            }
          });
          parent.save_var(session4);
          break;
        case '[add-window-url]':
          if (message.url && !message.url.contains('60080')) {
            parent.addURL(message);
            parent.clientList.forEach((client) => {
              if (client.windowType === 'main' && client.ws) {
                client.ws.send(message);
              }
            });
          }

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
        case '[close]':
          process.exit(0);
          break;
        case '[add-mongodb-doc]':
          parent.log(message);
          break;
        default:
          break;
      }
    };
  });

  parent.clientList = [];
  parent.sendToAll = function (message) {
    parent.clientList.forEach((client) => {
      if (client.ws) {
        client.ws.send(message);
      }
    });
  };

  parent.sendMessage = function (message) {
    parent.sendToAll(message);
  };
};
