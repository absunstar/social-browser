module.exports = function (child) {
    function connect() {
        child.reconnectCount = 0;
        child._ws_ = new child.WebSocket('ws://127.0.0.1:60080/ws');
        child.sendMessage = function (message) {
            message.id = child.id;
            message.pid = child.id;
            message.uuid = child.uuid;
            message.index = child.index;
            message.partition = message.partition || child.partition;
            child._ws_.send(JSON.stringify(message));
        };
        child._ws_.on('open', function () {
            child.log('Child Socket is Open');
        });
        child._ws_.on('ping', function () {
            child.sendMessage({ type: 'pong' });
        });
        child._ws_.on('close', function (e) {
            child.log('Child Socket is closed. Reconnect will be attempted in 1 second.', e);
            setTimeout(function () {
                child.reconnectCount++;
                if (child.reconnectCount > 10) {
                    process.exit();
                }
                connect();
            }, 1000);
        });
        child._ws_.on('error', function (err) {
            child.log('Socket encountered error: ', err);
            child._ws_.close();
        });

        child._ws_.on('message', function (event) {
            try {
                let message = JSON.parse(event.data || event);

                if (message.type == 'ping') {
                    child.sendMessage({ type: 'pong' });
                } else if (message.type == 'connected') {
                    child.sendMessage({
                        type: '[request-browser-core-data]',
                    });
                } else if (message.type == 're-connected') {
                    child.sendMessage({
                        type: '[re-request-browser-core-data]',
                    });
                } else if (message.type == '[browser-core-data]') {
                    child.parent = message;
                    child.addOverwriteList(child.parent.var.overwrite.urls);
                    child.option_list.push(message.options);
                    child.electron.app.userAgentFallback = child.parent.var.core.defaultUserAgent.url;
                    child.sessionConfig(message.options.partition);

                    if (child.parent.windowType == 'none') {
                    } else if (child.parent.windowType == 'files') {
                        child.window = null;
                    } else if (child.parent.windowType == 'cookies') {
                        let ss = child.electron.session.fromPartition(message.options.partition);
                        ss.cookies.get({}).then((cookies) => {
                            child.sendMessage({
                                type: '[cookies-data]',
                                cookies: cookies,
                            });
                            setTimeout(() => {
                                child.tryClosing();
                            }, 1000 * 5);
                        });
                    } else if (child.parent.windowType == 'main') {
                        if (child.mainWindow && !child.mainWindow.isDestroyed()) {
                            child.mainWindow.show();
                            child.mainWindow.webContents.send('[open new tab]', message.newTabData);
                        } else {
                            child.createNewWindow({ ...child.parent.options, ...message.options });
                        }
                        if (true) {
                            let dir = child.path.join(child.parent.data_dir, 'favicons');
                            const fileList = child.fs.readdirSync(dir);
                            for (const file of fileList) {
                                const path = child.path.join(dir, file);
                                try {
                                    if (child.fs.statSync(path).isFile()) {
                                        child.nativeIconList.push({
                                            path: path,
                                            icon: child.electron.nativeImage.createFromPath(path).resize({ width: 16 }),
                                        });
                                    }
                                } catch (error) {
                                    child.log(error);
                                }
                            }
                        }
                    } else {
                        if (!child.partition.like('*setting*|*social*|*file*')) {
                            child.parent.var['googleExtensionList']?.forEach((extensionInfo) => {
                                child.loadGoogleExtension(extensionInfo);
                            });
                        }

                        child.createNewWindow({ ...message.options });
                    }
                } else if (message.type == '[re-browser-core-data]') {
                    child.sessionConfig(message.options.partition);
                    child.option_list.push(message.options);

                    if (message.options.windowType == 'main') {
                        if (child.mainWindow && !child.mainWindow.isDestroyed()) {
                            child.mainWindow.show();
                            child.mainWindow.webContents.send('[open new tab]', message.newTabData);
                        } else {
                            child.createNewWindow({ ...child.parent.options, ...message.options });
                        }
                    } else if (message.options.windowType == 'cookies') {
                        let ss = child.electron.session.fromPartition(message.options.partition);
                        ss.cookies.get({}).then((cookies) => {
                            child.sendMessage({
                                type: '[cookies-data]',
                                cookies: cookies,
                            });
                        });
                    } else {
                        child.createNewWindow({ ...message.options });
                    }
                } else if (message.type == '[update-browser-var]') {
                    if (child.parent.windowType == 'files') {
                        child.set_var(message.options.name, message.options.data);
                    } else {
                        child.parent.var[message.options.name] = message.options.data;
                        if (child.parent.var.core.defaultUserAgent) {
                            child.electron.app.userAgentFallback = child.parent.var.core.defaultUserAgent.url;
                        }

                        if (message.options.name === 'overwrite') {
                            child.addOverwriteList(child.parent.var.overwrite.urls);
                        }
                        if (message.options.name == 'core' || message.options.name == 'proxy' || message.options.name == 'session_list' || message.options.name == 'preload_list') {
                            child.sessionConfig(message.options.partition);
                        }
                        if (message.options.name == 'cookieList') {
                            child.cookieList = message.options.data;
                            child.cookieList.sort((a, b) => {
                                return b.time - a.time;
                            });
                        }
                        child.sendToAllWindows('[update-browser-var]', message);
                    }
                } else if (message.type == '[user_data_input][changed]') {
                    let index = child.parent.var.user_data_input.findIndex((u) => u.id === message.data.id);
                    if (index > -1) {
                        child.parent.var.user_data_input[index].data = message.data.data;
                    } else {
                        child.parent.var.user_data_input.push(message.data);
                    }
                    child.sendToAllWindows('[update-browser-var]', {
                        type: '[update-browser-var]',
                        options: {
                            name: 'user_data_input',
                            data: child.parent.var.user_data_input,
                        },
                    });
                } else if (message.type == '[user_data][changed]') {
                    let index = child.parent.var.user_data.findIndex((u) => u.id === message.data.id);
                    if (index > -1) {
                        child.parent.var.user_data[index].data = message.data.data;
                    } else {
                        child.parent.var.user_data.push(message.data);
                    }
                    child.sendToAllWindows('[update-browser-var]', {
                        type: '[update-browser-var]',
                        options: {
                            name: 'user_data',
                            data: child.parent.var.user_data,
                        },
                    });
                } else if (message.type == '[load-google-extension]') {
                    if (!child.partition.like('*setting*|*social*|*file*')) {
                        child.loadGoogleExtension(message.extensionInfo);
                    }
                } else if (message.type == '[remove-google-extension]') {
                    child.removeGoogleExtension(message.extensionInfo);
                } else if (message.type == 'share') {
                    child.electron.BrowserWindow.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed()) {
                            win.webContents.send('share', message.data);
                        }
                    });
                } else if (message.type == '[tracking-info]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
                            win.webContents.send('[tracking-info]', message);
                        }
                    });
                } else if (message.type == '[run-user-script]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.id == message.tabInfo.windowID) {
                            child.sendToWebContents(win.webContents, '[run-user-script]', message.script);
                        }
                    });
                } else if (message.type == '[send-render-message]') {
                    child.sendToAllWindows('[send-render-message]', message.data);
                } else if (message.type == '[open new tab]') {
                    child.getAllWindows().forEach((win) => {
                        if (win.customSetting.windowType == 'main' && !win.isDestroyed()) {
                            win.webContents.send('[open new tab]', message.data);
                        }
                    });
                } else if (message.type == '$download_item') {
                    let index = child.parent.var.download_list.findIndex((dl) => dl.id == message.data.id);
                    if (index !== -1) {
                        if (message.data.status == 'delete') {
                            if (child.parent.var.download_list[index].item && typeof child.parent.var.download_list[index].item.cancel === 'function') {
                                child.parent.var.download_list[index].item.cancel();
                            }
                            child.getAllWindows().forEach((win) => {
                                if (win && !win.isDestroyed()) {
                                    win.webContents.send('$download_item', message.data);
                                }
                            });
                            child.parent.var.download_list.splice(index, 1);
                        } else if (message.data.status == 'pause') {
                            if (
                                child.session_name_list.some((s) => s.name === message.data.Partition) &&
                                child.parent.var.download_list[index].item &&
                                typeof child.parent.var.download_list[index].item.pause === 'function'
                            ) {
                                child.parent.var.download_list[index].item.pause();
                            }
                            child.getAllWindows().forEach((win) => {
                                if (win && !win.isDestroyed()) {
                                    win.webContents.send('$download_item', message.data);
                                }
                            });
                            child.parent.var.download_list.splice(index, 1);
                        } else if (message.data.status == 'resume') {
                            if (
                                child.session_name_list.some((s) => s.name === message.data.Partition) &&
                                child.parent.var.download_list[index].item &&
                                typeof child.parent.var.download_list[index].item.canResume === 'function' &&
                                child.parent.var.download_list[index].item.canResume()
                            ) {
                                child.parent.var.download_list[index].item.resume();
                            }
                            child.getAllWindows().forEach((win) => {
                                if (win && !win.isDestroyed()) {
                                    win.webContents.send('$download_item', message.data);
                                }
                            });
                            child.parent.var.download_list.splice(index, 1);
                        } else if (message.data.status == 're-download') {
                            if (child.session_name_list.some((s) => s.name === message.data.Partition)) {
                                if (message.data.url) {
                                    child.electron.session.fromPartition(message.data.Partition).downloadURL(message.data.url);
                                }
                            }
                            child.getAllWindows().forEach((win) => {
                                if (win && !win.isDestroyed()) {
                                    win.webContents.send('$download_item', message.data);
                                }
                            });
                            child.parent.var.download_list.splice(index, 1);
                        } else {
                            child.parent.var.download_list[index] = { ...child.parent.var.download_list[index], ...message.data };
                            child.getAllWindows().forEach((win) => {
                                if (win && !win.isDestroyed()) {
                                    win.webContents.send('$download_item', child.parent.var.download_list[index]);
                                }
                            });
                        }
                    } else {
                        child.parent.var.download_list.push(message.data);
                    }
                } else if (message.type == '[add-window-url]') {
                    let index = child.parent.var.urls.findIndex((u) => u.url == message.url);
                    if (index > -1) {
                        child.parent.var.urls[index].title = message.title || child.parent.var.urls[index].title;
                        child.parent.var.urls[index].logo = message.logo || child.parent.var.urls[index].logo;
                        child.parent.var.urls[index].last_visit = new Date().getTime();
                        if (!message.ignoreCounted) {
                            child.parent.var.urls[index].count++;
                        }
                    } else {
                        child.parent.var.urls.push({
                            url: message.url,
                            logo: message.logo,
                            title: message.title || message.url,
                            count: 1,
                            first_visit: new Date().getTime(),
                            last_visit: new Date().getTime(),
                        });
                    }

                    if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
                        child.addressbarWindow.webContents.send('[update-browser-var]', { options: { name: 'urls', data: child.parent.var.urls } });
                    }
                } else if (message.type == '[to-all]') {
                    if (message.name === 'hide-addressbar') {
                        if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
                            child.addressbarWindow.hide();
                        }
                    }
                } else if (message.type == '[call-window-action]') {
                    if (message.data.name == '[window-reload-hard]') {
                        child.getAllWindows().forEach((win) => {
                            if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                                let info = message.data;
                                if (info.origin) {
                                    info.origin = info.origin === 'null' ? win.webContents.getURL() : info.origin;
                                    info.storages = info.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
                                    info.quotas = info.quotas || ['temporary', 'persistent', 'syncable'];
                                    if (info.origin.replace('://', '').indexOf(':') == -1) {
                                        info.origin = info.origin + ':80';
                                    }

                                    if (info.storages[0] == 'cookies') {
                                        win.webContents.session
                                            .clearStorageData({
                                                origin: info.origin,
                                                storages: info.storages,
                                                quotas: info.quotas,
                                            })
                                            .then(() => {
                                                win.webContents.session.clearCache().then(() => {
                                                    win.webContents.reload();
                                                });
                                            });
                                    } else {
                                        win.webContents.session.clearCache().then(() => {
                                            win.webContents.session
                                                .clearStorageData({
                                                    origin: info.origin,
                                                    storages: info.storages,
                                                    quotas: info.quotas,
                                                })
                                                .then(() => {
                                                    win.webContents.session.clearCache().then(() => {
                                                        win.webContents.reload();
                                                    });
                                                });
                                        });
                                    }
                                }
                            }
                        });
                    } else if (message.data.name == 'copy') {
                        child.electron.clipboard.writeText(message.data.text.replace('#___new_tab___', '').replace('#___new_popup__', ''));
                    } else if (message.data.name == 'full_screen') {
                        child.getAllWindows().forEach((win) => {
                            if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                                win.setFullScreen(true);
                            }
                        });
                    } else if (message.data.name == '!full_screen') {
                        child.getAllWindows().forEach((win) => {
                            if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                                win.setFullScreen(false);
                            }
                        });
                    } else {
                        child.log('[call-window-action]', message);
                    }
                } else if (message.type == '[window-reload]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.windowType == 'view' && win.customSetting.tabID == message.data.tabID) {
                            win.reload();
                        }
                    });
                } else if (message.type == '[window-reload-hard]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            let win = win;
                            if (win && message.data.origin && message.data.origin !== 'null') {
                                let ss = win.webContents.session;
                                message.data.storages = message.data.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
                                message.data.quotas = message.data.quotas || ['temporary', 'persistent', 'syncable'];
                                child.log(' will clear storage data ...');
                                let clear = false;
                                ss.clearStorageData({
                                    origin: message.data.origin,
                                    storages: message.data.storages,
                                    quotas: message.data.quotas,
                                }).finally(() => {
                                    child.log(' will clear cache ...');
                                    ss.clearCache().finally(() => {
                                        child.log(' will reload ...');
                                        clear = true;
                                        win.webContents.reload();
                                    });
                                });
                                setTimeout(() => {
                                    if (!clear) {
                                        win.webContents.reload();
                                    }
                                }, 1000 * 3);
                            }
                        }
                    });
                } else if (message.type == '[window-action]') {
                    if (message.data.windowID) {
                        let win = child.electron.BrowserWindow.fromId(message.data.windowID);
                        if (win && !win.isDestroyed()) {
                            if (message.data.name == 'toggle-window-audio') {
                                win.webContents.setAudioMuted(!win.webContents.audioMuted);
                                child.updateTab(win);
                            } else if (message.data.name == 'window-zoom-') {
                                if (win.webContents.zoomFactor - 0.3 > 0.0) {
                                    win.webContents.zoomFactor -= 0.2;
                                    win.show();
                                }
                            } else if (message.data.name == 'window-zoom+') {
                                win.webContents.zoomFactor += 0.2;
                                win.show();
                            } else if (message.data.name == 'window-zoom') {
                                win.webContents.zoomFactor = 1;
                                win.show();
                            } else if (message.data.name == 'open-external' && message.data.url) {
                                child.openExternal(message.data.url);
                            } else if (message.data.name == 'allow-ads') {
                                win.customSetting.allowAds = !win.customSetting.allowAds;
                                win.webContents.reload();
                            } else if (message.data.name == 'off') {
                                win.customSetting.off = !win.customSetting.off;
                                win.webContents.reload();
                            } else {
                                if (message.data.levels) {
                                    child.sendToWebContents(win.webContents, '[window-action]', message.data);
                                } else {
                                    win.webContents.send('[window-action]', message.data);
                                }
                            }
                        }
                    }
                } else if (message.type == '[toggle-window-edit]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            win.webContents.send('[toggle-window-edit]', message.data);
                        }
                    });
                } else if (message.type == '[window-go-back]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            if (win.webContents.navigationHistory.canGoBack()) {
                                win.webContents.navigationHistory.goBack();
                            }
                        }
                    });
                } else if (message.type == '[window-go-forward]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            if (win.webContents.navigationHistory.canGoForward()) {
                                win.webContents.goForward();
                            }
                        }
                    });
                } else if (message.type == '[window-zoom]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            win.webContents.zoomFactor = 1;
                            win.show();
                        }
                    });
                } else if (message.type == '[window-zoom+]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            win.webContents.zoomFactor += 0.2;
                            win.show();
                        }
                    });
                } else if (message.type == '[window-zoom-]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            if (win.webContents.zoomFactor - 0.3 > 0.0) {
                                win.webContents.zoomFactor -= 0.2;
                                win.show();
                            }
                        }
                    });
                } else if (message.type == '[show-window-dev-tools]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting.tabID == message.data.tabID && win.customSetting.windowType == 'view') {
                            win.webContents.openDevTools();
                        }
                    });
                } else if (message.type == '[set-standalone-window]') {
                    child.getAllWindows().forEach((win) => {
                        if (win && !win.isDestroyed() && win.customSetting && win.customSetting.windowType == 'view') {
                            win.setSkipTaskbar(false);
                            win.setMenuBarVisibility(true);
                            win.setResizable(true);
                            win.setMovable(true);
                        }
                    });
                } else if (message.type == '[update-tab-properties]') {
                    child.getAllWindows().forEach((win) => {
                        if (win.customSetting.windowType == 'main' && win && !win.isDestroyed()) {
                            win.webContents.send('[update-tab-properties]', message.data);
                        }
                    });
                } else if (message.type == '[edit-window]') {
                    child.getAllWindows().forEach((win) => {
                        if (win.customSetting.windowType == 'view' && win.customSetting.tabID == message.data.tabID && win && !win.isDestroyed()) {
                            win.webContents.executeJavaScript(
                                `
                        (function(){
                          let b =  document.querySelector('html');
                          if(b.contentEditable == "inherit"){
                              b.contentEditable = true;
                              b.style.border = '10px dashed green';
                          }else{
                              b.contentEditable = "inherit";
                              b.style.border = '0px solid white';
                          }
                        })()
                        `,
                                false,
                            );
                        }
                    });
                } else if (message.type == '[close-view]') {
                    if ((win = child.getAllWindows().find((w) => w.customSetting.tabID == message.options.tabID && w.customSetting.windowType == 'view'))) {
                        if (win && !win.isDestroyed()) {
                            win.close();
                        }
                    }
                } else if (message.type == '[show-view]') {
                    child.isCurrentView = false;

                    child.getAllWindows().forEach((win) => {
                        let customSetting = win.customSetting;
                        if (customSetting.windowType == 'view' && win && !win.isDestroyed()) {
                            if (win.customSetting.tabID == message.options.tabID) {
                                if (message.isCurrentView) {
                                    child.isCurrentView = true;
                                    win.show();
                                    win.setAlwaysOnTop(true);
                                    win.setAlwaysOnTop(false);
                                    win.focus()
                                    // console.log(message , win.getURL());
                                } else {
                                    win.hide();
                                }
                            } else {
                                win.hide();
                            }
                        }
                    });
                }else if (message.type == '[show-tab]') {
                    child.isCurrentView = false;

                    child.getAllWindows().forEach((win) => {
                        let customSetting = win.customSetting;
                        if (customSetting.windowType == 'main' && win && !win.isDestroyed()) {
                           win.webContents.send('[show-tab]', message.options);
                        }
                    });
                } else if (message.type == '[close-tab]') {
                    child.isCurrentView = false;

                    child.getAllWindows().forEach((win) => {
                        let customSetting = win.customSetting;
                        if (customSetting.windowType == 'main' && win && !win.isDestroyed()) {
                           win.webContents.send('[close-tab]', message.options);
                        }
                    });
                }else if (message.type == '[update-view-url]') {
                    if ((win = child.getAllWindows().find((w) => w.customSetting.tabID == message.data.tabID && w.customSetting.windowType == 'view'))) {
                        if (win && !win.isDestroyed()) {
                            win.webContents.stop();
                            win.loadURL(message.data.url);
                        }
                    }
                } else if (message.type == '[remove-tab]') {
                    child.sendToAllWindows('[send-render-message]', { name: '[remove-tab]', tabID: message.tabID });
                } else if (message.type == '[main-window-data-changed]') {
                    if (message.screen && message.mainWindow) {
                        child.parent.options.screen = message.screen;
                        child.parent.options.mainWindow = message.mainWindow;
                        child.handleWindowBounds();
                    }
                }
            } catch (error) {
                child.log('onmessage Error', error);
            }
        });
    }
    setTimeout(() => {
        connect();
    }, 1000);
};
