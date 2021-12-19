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
                case '[attach-child]':
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
                        cookies: {
                            key: child.options.partition,
                            value: parent.cookies[child.options.partition],
                        },
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
                        windowSetting: child.setting || [],
                        windowType: child.windowType,
                        information: parent.information,
                    };

                    child.ws.send(m);

                    // if (!child.is_cookie_sended) {
                    //   child.is_cookie_sended = true;
                    //   let count = 0;
                    //   for (const key in parent.cookies) {
                    //     if (child.options.partition == key) {
                    //     } else {
                    //       count++;
                    //       setTimeout(() => {
                    //         ws.send(JSON.stringify({ type: '[browser-cookies]', name: key, value: parent.cookies[key] }));
                    //       }, 1000 * count);
                    //     }
                    //   }
                    // }

                    break;
                case '[un-attach-child]':
                    parent.clientList[message.index].is_attached = false;
                    break;
                case '[send-render-message]':
                    parent.clientList.forEach((client) => {
                        if (client.index == message.data.options.parent_index && client.ws) {
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
                case '[create-new-view]':
                    parent.createChildProcess(message.options);
                    break;
                case '[show-view]':
                    parent.clientList.forEach((client) => {
                        if (client.index != message.index && client.ws) {
                            if (message.options.tab_id === client.options.tab_id) {
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
                        if (client.index != message.index && client.ws && message.options.tab_id === client.options.tab_id) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[update-view-url]':
                    parent.clientList.forEach((client) => {
                        if (client.index !== message.index && client.ws && message.options.tab_id === client.options.tab_id) {
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
                        partition: 'update',
                    });
                    break;
                case '[update-browser-var]':
                    parent.set_var(message.options.name, message.options.data);
                    parent.clientList.forEach((client) => {
                        if (client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[update-browser-var][user_data_input][add]':
                    parent.var.user_data_input.push(message.data);
                    parent.set_var('user_data_input', parent.var.user_data_input);
                    parent.clientList.forEach((client) => {
                        if (client.index !== message.index && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[update-browser-var][user_data][add]':
                    parent.var.user_data.push(message.data);
                    parent.set_var('user_data', parent.var.user_data);
                    parent.clientList.forEach((client) => {
                        if (client.index !== message.index && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[update-browser-var][user_data_input][update]':
                    parent.var.user_data_input.forEach((u) => {
                        if (u.id === message.data.id) {
                            u.data = message.data.data;
                        }
                    });
                    parent.set_var('user_data_input', parent.var.user_data_input);
                    parent.clientList.forEach((client) => {
                        if (client.index !== message.index && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[update-browser-var][user_data][update]':
                    parent.var.user_data.forEach((u) => {
                        if (u.id === message.data.id) {
                            u.data = message.data.data;
                        }
                    });
                    parent.set_var('user_data', parent.var.user_data);
                    parent.clientList.forEach((client) => {
                        if (client.index !== message.index && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[update-tab-properties]':
                    parent.clientList.forEach((client) => {
                        if (client.windowType == 'main' && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[call-window-action]':
                    parent.clientList.forEach((client) => {
                        if (client.windowType !== 'main' && client.ws && client.options.tab_id === message.data.tab_id) {
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
                case '[download-link]':
                    if (parent.var.last_download_url === message.url) {
                        console.log(' Parent Will Download Cancel Duplicate : ' + message.url);
                        setTimeout(() => {
                            parent.var.last_download_url = '';
                        }, 1000 * 5);
                        return;
                    }
                    parent.var.last_download_url = message.url;
                    parent.handleSession(message.partition);
                    let ss = parent.electron.session.fromPartition(message.partition);
                    ss.downloadURL(message.url);

                    break;
                case '[cookie-changed]':
                    parent.clientList.forEach((client) => {
                        if (client.windowType !== 'main' && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    parent.cookies[message.partition] = parent.cookies[message.partition] || [];
                    if (!message.removed) {
                        let exists = false;
                        parent.cookies[message.partition].forEach((co) => {
                            if (co.name == message.cookie.name) {
                                exists = true;
                                co.value = message.cookie.value;
                            }
                        });
                        if (!exists) {
                            parent.cookies[message.partition].push({
                                partition: message.partition,
                                name: message.cookie.name,
                                value: message.cookie.value,
                                domain: message.cookie.domain,
                                path: message.cookie.path,
                                secure: message.cookie.secure,
                                httpOnly: message.cookie.httpOnly,
                            });
                        }
                    } else {
                        parent.cookies[message.partition].forEach((co, i) => {
                            if (co.name == message.cookie.name) {
                                parent.cookies[message.partition].splice(i, 1);
                            }
                        });
                    }
                    break;
                case '[add-window-url]':
                    parent.addURL(message);
                    parent.clientList.forEach((client) => {
                        if (client.windowType === 'main' && client.ws) {
                            client.ws.send(message);
                        }
                    });
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
        console.log('... m ...');
    };
};
