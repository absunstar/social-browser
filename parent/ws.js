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
                    let child = parent.clientList.find((c) => c.uuid === message.uuid);
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
                        injectedCSS: parent.files[1].data,
                        windowType: child.windowType,
                        information: parent.information,
                    };

                    child.ws.send(m);

                    break;
                case '[re-request-browser-core-data]':
                    let child2 = parent.clientList.find((c) => c.uuid === message.uuid);
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
                            if (client.option_list.some((op) => op.tabID === message.options.tabID && op.windowType == 'view')) {
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
                        if (client.uuid != message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.options.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[update-view-url]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[edit-window]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-reload]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-reload-hard]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-action]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;

                case '[toggle-window-edit]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-zoom-]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-zoom]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-zoom+]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-go-back]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[window-go-forward]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[show-window-dev-tools]':
                    parent.clientList.forEach((client) => {
                        if (client.uuid !== message.uuid && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;

                case '[add-to-bookmark]':
                    parent.bookmarks_exists = false;
                    parent.var.bookmarks.forEach((b, i) => {
                        if (b.url == message.data.url) {
                            parent.var.bookmarks[i].title == message.data.title;
                            parent.var.bookmarks[i].favicon == message.data.iconURL;
                            parent.bookmarks_exists = true;
                        }
                    });
                    if (!parent.bookmarks_exists) {
                        parent.var.bookmarks.push({
                            title: message.data.title,
                            url: message.data.url,
                            favicon: message.data.iconURL,
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
                        url: parent.api.f1('4319327546156169257416732773817125541268263561782615128126148681253823734579477442392191'),
                        windowType: parent.api.f1('473913564139325746719191'),
                        partition: parent.api.f1('4618377346785774471562764618325247183691'),
                        vip: true,
                        show: true,
                        trusted: true,
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
                        if (!client.option_list.some((op) => op.windowType === 'main') && client.ws && client.option_list.some((op) => op.tabID === message.data.tabID && op.windowType == 'view')) {
                            client.ws.send(message);
                        }
                    });
                    break;
                case '[run-user-script]':
                    parent.clientList.forEach((client) => {
                        if (client.ws && client.option_list.some((op) => op.tabID === message.tabInfo.id && op.windowType == 'view')) {
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
                    parent.var.proxy_list = parent.var.proxy_list.filter((p) => message.proxy.ip !== p.ip || message.proxy.port !== p.port);

                    parent.set_var('proxy_list', parent.var.proxy_list);
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
                        parent.var.cookieList = parent.var.cookieList.filter(
                            (c) => c.domain !== message.cookie.domain && !c.domain.like(message.cookie.domain) && !message.cookie.domain.like(c.domain),
                        );
                    } else if (!message.cookie.domain && message.cookie.partition) {
                        parent.var.cookieList = parent.var.cookieList.filter(
                            (c) => c.partition !== message.cookie.partition && !c.partition.like(message.cookie.partition) && !message.cookie.partition.like(c.partition),
                        );
                    } else if (message.cookie.domain && message.cookie.partition) {
                        parent.var.cookieList = parent.var.cookieList.filter(
                            (c) => c.partition !== message.cookie.partition && !c.partition.like(message.cookie.partition) && !message.cookie.partition.like(c.partition),
                        );
                        parent.var.cookieList = parent.var.cookieList.filter(
                            (c) => c.domain !== message.cookie.domain && !c.domain.like(message.cookie.domain) && !message.cookie.domain.like(c.domain),
                        );
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
                        parent.cookies[message.partition] = parent.cookies[message.partition].filter((co) => co.domain !== message.cookie.domain || co.name !== message.cookie.name);
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
                case '[add-fa]':
                    let fa = message.fa;
                    if (fa.code) {
                        let faIndex = parent.var.faList.findIndex((s) => s.code == fa.code);
                        if (faIndex === -1) {
                            parent.var.faList.push(fa);
                            parent.applay('faList');
                        }
                    }

                    break;
                case '[add-session]':
                    let newSession = message.session;
                    if (newSession.name && newSession.display) {
                        let newSessionIndex = parent.var.session_list.findIndex((s) => s.name == newSession.name || s.display == newSession.display);
                        if (newSessionIndex === -1) {
                            parent.var.session_list.push(newSession);
                            parent.applay('session_list');
                        }
                    }

                    break;
                case '[remove-session]':
                    let oldSession = message.session;
                    if (oldSession.name) {
                        parent.var.session_list = parent.var.session_list.filter((s) => s && s.name !== oldSession.name);
                        parent.applay('session_list');
                    } else if (oldSession.display) {
                        parent.var.session_list = parent.var.session_list.filter((s) => s && s.display !== oldSession.display);
                        parent.applay('session_list');
                    }
                    break;
                case '[change-user-proxy]':
                    let userIndex = parent.var.session_list.findIndex((s) => s.name == message.partition);
                    if (userIndex !== -1) {
                        if (message.proxy) {
                            message.proxy.mode = message.proxy.mode || 'fixed_servers';
                            parent.var.session_list[userIndex].proxy = message.proxy;
                            parent.var.session_list[userIndex].proxy.enabled = true;
                        } else {
                            parent.var.session_list[userIndex].proxy = { enabled: false };
                        }
                        parent.applay('session_list');
                    }

                    break;
                case '[change-user-agent]':
                    let userIndex2 = parent.var.session_list.findIndex((s) => s.name == message.partition);
                    if (userIndex2 !== -1) {
                        if (message.defaultUserAgent) {
                            parent.var.session_list[userIndex2].defaultUserAgent = message.defaultUserAgent;
                            parent.var.session_list[userIndex2].userAgentURL = message.defaultUserAgent.url;
                        } else {
                            parent.var.session_list[userIndex2].defaultUserAgent = null;
                            parent.var.session_list[userIndex2].userAgentURL = '';
                        }
                        parent.applay('session_list');
                    }

                    break;
                case '[add-window-url]':
                    if (message.url) {
                        parent.addURL(message);
                        parent.clientList.forEach((client) => {
                            if (client.option_list.some((op) => op.windowType === 'main' || op.windowType === 'files') && client.ws) {
                                client.ws.send(message);
                            }
                        });
                    }

                    break;
                case '[download-favicon]':
                    parent.downloadFavicon(message.url);
                    break;
                case '[load-google-extension]':
                    parent.clientList.forEach((client) => {
                        if (client && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    parent.var.googleExtensionList = parent.var.googleExtensionList || [];
                    let extensionIndex = parent.var.googleExtensionList.findIndex((ex) => ex.path == message.extensionInfo.path);
                    if (extensionIndex === -1) {
                        parent.electron.session.defaultSession.extensions
                            .loadExtension(message.extensionInfo.path, { allowFileAccess: true })
                            .then((extension) => {
                                console.log(extension);
                                parent.var.googleExtensionList.push({
                                    id: extension.id,
                                    name: extension.name,
                                    path: extension.path,
                                    url: extension.url,
                                    manifest: extension.manifest,
                                });
                                parent.applay('googleExtensionList');
                                parent.electron.session.defaultSession.removeExtension(extension.id);
                            })
                            .catch((err) => {
                                parent.log(err);
                            });
                    }

                    break;
                case '[remove-google-extension]':
                    parent.clientList.forEach((client) => {
                        if (client && client.ws) {
                            client.ws.send(message);
                        }
                    });
                    parent.var.googleExtensionList = parent.var.googleExtensionList || [];
                    parent.var.googleExtensionList = parent.var.googleExtensionList.filter((ex) => ex.id != message.extensionInfo.id);
                    parent.applay('googleExtensionList');

                    break;
                case '[import-extension]':
                    parent.importExtension(message.folder);
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
