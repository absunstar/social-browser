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
          child.ws = ws_user;
          let m = {
            type: '[browser-core-data]',
            data_dir: parent.data_dir,
            options: child.options,
            mainWindowData: parent.mainWindowDataMessage ? parent.mainWindowDataMessage.mainWindow : null,
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
            newTabData: parent.newTabData || {
              name: '[open new tab]',
              url: parent.var.core.home_page,
              partition: parent.var.core.session.partition,
              user_name: parent.var.core.session.user_name,
              active: true,
              main_window_id: child2.id,
            },
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
        case '[send-render-message]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[open new tab]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[tracking-info]':
          parent.clientList.forEach((client) => {
            if (client.ws) {
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
        case '[main-window-data-changed]':
          parent.mainWindowDataMessage = message;
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.option_list.some((op) => op.windowType === 'view') && client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[show-view]':
          parent.clientList.forEach((client) => {
            if (client.uuid != message.uuid && client.ws) {
              if (client.option_list.some((op) => op.tabID === message.options.tabID)) {
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
            if (client.uuid != message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.options.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[update-view-url]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[edit-window]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[window-reload]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[window-reload-hard]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[toggle-window-audio]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[window-zoom-]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[window-zoom]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[window-zoom+]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[window-go-back]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[window-go-forward]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '[show-window-dev-tools]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;

        case '[add-to-bookmark]':
          parent.bookmarks_exists = false;
          parent.var.bookmarks.forEach((b, i) => {
            if (b.url == message.data.url) {
              parent.var.bookmarks[i].title == message.data.title;
              parent.var.bookmarks[i].favicon == message.data.icon;
              parent.bookmarks_exists = true;
            }
          });
          if (!parent.bookmarks_exists) {
            parent.var.bookmarks.push({
              title: message.data.title,
              url: message.data.url,
              favicon: message.data.icon,
            });
          }
          parent.applay('bookmarks');
          break;

        case '[request-main-window-data]':
          parent.clientList.forEach((client) => {
            if (parent.mainWindowDataMessage && !client.option_list.some((op) => op.windowType === 'main') && client.ws) {
              client.ws.send(parent.mainWindowDataMessage);
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
        case '[user_data_input][changed]':
          let index1 = parent.var.user_data_input.findIndex((u) => u.id === message.data.id);
          if (index1 !== -1) {
            parent.var.user_data_input[index1].data = message.data.data;
          } else {
            parent.var.user_data_input.push(message.data);
          }
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[user_data][changed]':
          let index2 = parent.var.user_data.findIndex((u) => u.id === message.data.id);
          if (index2 > -1) {
            parent.var.user_data[index2].data = message.data.data;
          } else {
            parent.var.user_data.push(message.data);
          }
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && client.ws) {
              client.ws.send(message);
            }
          });
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
            if (!client.option_list.some((op) => op.windowType === 'main') && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID)) {
              client.ws.send(message);
            }
          });
          break;
        case '$download_item':
          let index = parent.var.download_list.findIndex((d) => d.id == message.data.id);
          if (index !== -1) {
            parent.var.download_list[index] = { ...parent.var.download_list[index], ...message.data };
          } else {
            parent.var.download_list.push(message.data);
          }
          parent.set_var('download_list', parent.var.download_list);

          parent.clientList.forEach((client) => {
            if (client.ws) {
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
            if (client.uuid !== message.uuid && client.ws) {
              client.ws.send(message);
            }
          });
          break;
        case '[to-index]':
          parent.clientList.forEach((client) => {
            if (client.uuid === message.uuid && client.ws) {
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
        case '[cookieList-set]':
          let cookieIndex = parent.var.cookieList.findIndex((c) => c.domain == message.cookie.domain && c.partition == message.cookie.partition);
          message.cookie.time = message.cookie.time || new Date().getTime();
          if (cookieIndex === -1) {
            parent.var.cookieList.push(message.cookie);
          } else {
            parent.var.cookieList[cookieIndex] = message.cookie;
          }
          parent.var.cookieList.sort((a, b) => {
            return b.time - a.time;
          });
          parent.applay('cookieList');
          break;
        case '[cookieList-delete]':
          if (message.cookie.domain && !message.cookie.partition) {
            parent.var.cookieList.forEach((c, i) => {
              if (c.domain == message.cookie.domain || c.domain.like(message.cookie.domain) || message.cookie.domain.like(c.domain)) {
                parent.var.cookieList.splice(i, 1);
              }
            });
          } else if (!message.cookie.domain && message.cookie.partition) {
            parent.var.cookieList.forEach((c, i) => {
              if (c.partition == message.cookie.partition || c.partition.like(message.cookie.partition) || message.cookie.partition.like(c.partition)) {
                parent.var.cookieList.splice(i, 1);
              }
            });
          } else if (message.cookie.domain && message.cookie.partition) {
            parent.var.cookieList.forEach((c, i) => {
              if (c.partition == message.cookie.partition || c.partition.like(message.cookie.partition) || message.cookie.partition.like(c.partition)) {
                if (c.domain == message.cookie.domain || c.domain.like(message.cookie.domain) || message.cookie.domain.like(c.domain)) {
                  parent.var.cookieList.splice(i, 1);
                }
              }
            });
          }
          parent.var.cookieList.sort((a, b) => {
            return b.time - a.time;
          });
          parent.applay('cookieList');
          break;
        case '[cookie-changed]':
          parent.clientList.forEach((client) => {
            if (client.uuid !== message.uuid && !client.option_list.some((op) => op.windowType === 'main') && client.ws) {
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
        case '[add-session]':
          let newSession = message.session;
          if (newSession.name && newSession.display) {
            let newSessionIndex = parent.var.session_list.findIndex((s) => s.name == newSession.name || s.display == newSession.display);
            if (newSessionIndex === -1) {
              parent.var.session_list.push(newSession);
              parent.var.session_list.sort((a, b) => (a.time > b.time ? -1 : 1));
              parent.applay('session_list');
            }
          }

          break;
        case '[remove-session]':
          let oldSession = message.session;
          if (oldSession.name) {
            let oldSessionIndex = parent.var.session_list.findIndex((s) => s.name == oldSession.name);
            if (oldSessionIndex !== -1) {
              parent.var.session_list.splice(oldSessionIndex, 1);
              parent.var.session_list.sort((a, b) => (a.time > b.time ? -1 : 1));
              parent.applay('session_list');
            }
          } else if (oldSession.display) {
            let oldSessionIndex = parent.var.session_list.findIndex((s) => s.display == oldSession.display);
            if (oldSessionIndex !== -1) {
              parent.var.session_list.splice(oldSessionIndex, 1);
              parent.var.session_list.sort((a, b) => (a.time > b.time ? -1 : 1));
              parent.applay('session_list');
            }
          }
          break;
        case '[add-window-url]':
          if (message.url && !message.url.contains('60080')) {
            parent.addURL(message);
            parent.clientList.forEach((client) => {
              if ((client.option_list.some((op) => op.windowType === 'main') || client.windowType === 'files') && client.ws) {
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
