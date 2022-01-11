module.exports = function (child) {
    child.assignWindows = [];

    child.getMainWindow = function () {
        let mainWindow = null;
        child.windowList.forEach((w) => {
            if (!mainWindow && w.__options.windowType == 'main') {
                mainWindow = w.window;
            }
        });
        return mainWindow;
    };

    child.getWindow = function () {
        return child.window || child.mainWindow || child.getMainWindow();
    };

    child.createNewWindow = function (setting) {
        let parent = child.parent;
        setting.partition = setting.partition || parent.var.core.session.name;
        let defaultSetting = {
            show: setting.show === true ? true : false,
            alwaysOnTop: false,
            skipTaskbar: false,
            resizable: true,
            width: 1200,
            height: 720,
            x: 0,
            y: 0,
            minWidth: 280,
            minHeight: 200,
            fullscreenable: true,
            title: 'New Window',
            backgroundColor: '#ffffff',
            frame: true,
            icon: parent.icon,
            webPreferences: {
                devTools: true,
                spellcheck: false,
                sandbox: false,
                webaudio: typeof setting.webaudio !== undefined ? setting.webaudio : true,
                contextIsolation: false, // false -> can access preload window functions
                partition: setting.partition,
                preload: setting.preload || child.parent.files_dir + '/js/context-menu.js',
                javascript: true,
                nativeWindowOpen: false,
                nodeIntegration: false,
                nodeIntegrationInSubFrames: true,
                nodeIntegrationInWorker: false,
                experimentalFeatures: false,
                navigateOnDragDrop: true,
                webSecurity: true,
                allowRunningInsecureContent: false,
                plugins: true,
            },
        };

        if (setting.windowType === 'main') {
            defaultSetting.show = true;
            defaultSetting.frame = false;
            defaultSetting.webPreferences.nodeIntegration = true;
            defaultSetting.webPreferences.nodeIntegrationInWorker = true;
            defaultSetting.webPreferences.webSecurity = false;
            defaultSetting.webPreferences.allowRunningInsecureContent = true;
        } else if (setting.windowType === 'youtube') {
            defaultSetting.show = true;
            defaultSetting.alwaysOnTop = true;
            defaultSetting.center = true;
            defaultSetting.webPreferences.webSecurity = false;
            defaultSetting.webPreferences.allowRunningInsecureContent = true;
        } else if (setting.windowType === 'popup' || setting.windowType === 'client-popup') {
            defaultSetting.show = true;
            defaultSetting.center = true;
            defaultSetting.alwaysOnTop = true;
        } else if (setting.windowType === 'view') {
            defaultSetting.show = false;
            defaultSetting.skipTaskbar = true;
            defaultSetting.frame = false;
            defaultSetting.resizable = false;
        } else if (setting.windowType === 'addressbar') {
            defaultSetting.show = false;
            defaultSetting.alwaysOnTop = false;
            defaultSetting.skipTaskbar = true;
            defaultSetting.resizable = false;
            defaultSetting.frame = false;
            defaultSetting.fullscreenable = false;
            defaultSetting.webPreferences.webaudio = false;
        } else if (setting.windowType === 'profiles') {
            defaultSetting.show = false;
            defaultSetting.alwaysOnTop = false;
            defaultSetting.skipTaskbar = true;
            defaultSetting.resizable = false;
            defaultSetting.fullscreenable = false;
            defaultSetting.frame = false;
            defaultSetting.webPreferences.webaudio = false;
        } else if (setting.windowType === 'updates') {
            defaultSetting.show = false;
            defaultSetting.alwaysOnTop = false;
            defaultSetting.skipTaskbar = true;
            defaultSetting.resizable = true;
            defaultSetting.frame = true;
            defaultSetting.webPreferences.webaudio = false;
            defaultSetting.center = true;
        } else if (setting.windowType === 'none') {
            setting.url = 'https://www.google.com';
            defaultSetting.show = false;
            defaultSetting.alwaysOnTop = false;
            defaultSetting.skipTaskbar = true;
            defaultSetting.resizable = true;
            defaultSetting.frame = true;
            defaultSetting.webPreferences.webaudio = false;
            defaultSetting.center = true;
        }

        if (setting.trusted === true) {
            defaultSetting.webPreferences.nodeIntegration = true;
            defaultSetting.webPreferences.nodeIntegrationInWorker = true;
            defaultSetting.webPreferences.webSecurity = false;
            defaultSetting.webPreferences.allowRunningInsecureContent = true;
        }

        if (setting.security === false) {
            defaultSetting.webPreferences.webSecurity = false;
            defaultSetting.webPreferences.allowRunningInsecureContent = true;
        } else {
            defaultSetting.webPreferences.enableBlinkFeatures = 'OutOfBlinkCors';
        }

        defaultSetting = { ...defaultSetting, ...setting };

        let win = new child.electron.BrowserWindow(defaultSetting);
        child.remoteMain.enable(win.webContents);

        win.__options = defaultSetting;

        if (!child.window) {
            child.window = win;
        }

        child.windowList.push({
            id: win.id,
            window: win,
            __options: win.__options,
            setting: [],
        });

        if (win.__options.center) {
            win.center();
        }

        if (win.__options.windowType === 'main') {
            child.mainWindow = win;
            win.center();
            // win.openDevTools({
            //   mode: 'detach',
            // });
        } else if (win.__options.windowType === 'view') {
            if (child.speedMode) {
                if (!child.currentView) {
                    child.currentView = win.__options;
                }

                if ((mainWindow = child.getMainWindow())) {
                    let bounds = mainWindow.getBounds();
                    let new_bounds = {
                        x: mainWindow.isMaximized() ? bounds.x + 8 : bounds.x,
                        y: mainWindow.isMaximized() ? bounds.y + 78 : bounds.y + 70,
                        width: mainWindow.isMaximized() ? bounds.width - 15 : bounds.width - 2,
                        height: mainWindow.isMaximized() ? bounds.height - 84 : bounds.height - 72,
                    };
                    win.setBounds(new_bounds);
                }
            } else {
                if ((mainWindow = child.parent.lastWindowStatus)) {
                    let bounds = mainWindow.bounds;
                    let new_bounds = {
                        x: mainWindow.isMaximized ? bounds.x + 8 : bounds.x,
                        y: mainWindow.isMaximized ? bounds.y + 78 : bounds.y + 70,
                        width: mainWindow.isMaximized ? bounds.width - 15 : bounds.width - 2,
                        height: mainWindow.isMaximized ? bounds.height - 84 : bounds.height - 72,
                    };

                    win.setBounds(new_bounds);
                }
            }
        }

        if (win.__options.url) {
            win.loadURL(win.__options.url, {
                referrer: win.__options.referrer,
                userAgent: win.__options.user_agent || parent.var.core.user_agent,
            });
        } else {
            win.loadURL(parent.var.core.default_page || 'http://127.0.0.1:60080/newTab', {
                userAgent: win.__options.user_agent || parent.var.core.user_agent,
            });
        }

        win.once('ready-to-show', function () {
            win.__options.title = win.__options.title || win.__options.url;
            if (win.__options.windowType === 'main') {
                win.show();
                child.addressbarWindow = child.createNewWindow({
                    url: child.url.format({
                        pathname: child.path.join(child.parent.files_dir, 'html', 'address-bar.html'),
                        protocol: 'file:',
                        slashes: true,
                    }),
                    windowType: 'addressbar',
                    show: false,
                    width: win.getBounds().width - 200,
                    height: 500,
                    x: win.getBounds().x - 90,
                    y: win.getBounds().y - 70,
                    alwaysOnTop: false,
                    resizable: false,
                    fullscreenable: false,
                    title: 'Address-bar',
                    backgroundColor: '#ffffff',
                    frame: false,
                    skipTaskbar: true,
                    webPreferences: {
                        contextIsolation: false,
                        partition: 'address_bar',
                        preload: child.parent.files_dir + '/js/context-menu.js',
                        nativeWindowOpen: false,
                        nodeIntegration: true,
                        experimentalFeatures: false,
                        webSecurity: false,
                        allowRunningInsecureContent: true,
                        plugins: true,
                    },
                });
                child.remoteMain.enable(child.addressbarWindow.webContents);
                child.profilesWindow = child.createNewWindow({
                    url: child.url.format({
                        pathname: child.path.join(child.parent.files_dir, 'html', 'user-profiles.html'),
                        protocol: 'file:',
                        slashes: true,
                    }),
                    windowType: 'profiles',
                    show: false,
                    width: 400,
                    height: 500,
                    x: win.getBounds().x + (win.getBounds().width - 500),
                    y: (win.getBounds().y == -8 ? 0 : win.getBounds().y - 5) + 30,
                    alwaysOnTop: false,
                    resizable: false,
                    fullscreenable: false,
                    title: 'profiles',
                    backgroundColor: '#ffffff',
                    frame: false,
                    skipTaskbar: true,
                    webPreferences: {
                        contextIsolation: false,
                        partition: 'profiles',
                        preload: child.parent.files_dir + '/js/context-menu.js',
                        nativeWindowOpen: false,
                        nodeIntegration: false,
                        experimentalFeatures: false,
                        webSecurity: false,
                        allowRunningInsecureContent: true,
                        plugins: true,
                    },
                });
                child.remoteMain.enable(child.profilesWindow.webContents);
            } else if (win.__options.windowType === 'view') {
                child.updateTab(win);

                child.sendMessage({
                    type: '[request-window-status]',
                });

                child.sendMessage({
                    type: '[add-window-url]',
                    url: child.decodeURI(win.getURL()),
                    title: win.getTitle(),
                    logo: win.__options.favicon,
                });
            } else if (win.__options.windowType === 'none') {
                win.close();
            }
        });

        if (win.__options.webaudio === false) {
            win.webContents.audioMuted = true;
        }

        win.setMenuBarVisibility(false);

        if (!win.__options.user_agent || win.__options.user_agent == 'undefined') {
            win.__options.user_agent = parent.var.core.user_agent;
        }

        if (win.__options.proxy) {
            win.webContents.session.setProxy({
                proxyRules: win.__options.proxy,
                proxyBypassRules: '127.0.0.1',
            });
        }

        win.on('blur', function () {
            // if (win.__options.windowType === 'addressbar' || win.__options.windowType === 'profiles') {
            //   win.hide();
            // }
        });

        child.sendCurrentDataLoop = function () {
            if (child.sendCurrentDataAllow && child.mainWindow) {
                child.sendCurrentDataAllow = false;

                if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
                    child.addressbarWindow.hide();
                }
                if (child.profilesWindow && !child.profilesWindow.isDestroyed()) {
                    child.profilesWindow.hide();
                }

                if (child.mainWindow && !child.mainWindow.isDestroyed()) {
                    let data = {
                        type: '[send-window-status]',
                        //options: setting,
                        pid: child.id,
                        index: child.index,
                        mainWindow: {
                            id: child.mainWindow.id,
                            bounds: child.mainWindow.getBounds(),
                            isMaximized: child.mainWindow.isMaximized(),
                            hide: child.mainWindow.isMinimized() || !child.mainWindow.isVisible(),
                        },
                        screen: {
                            bounds: child.electron.screen.getPrimaryDisplay().bounds,
                        },
                    };

                    if (child.speedMode) {
                        parent.options.mainWindow = data.mainWindow;
                        parent.options.screen = data.screen;

                        if ((mainWindow = data.mainWindow)) {
                            let bounds = mainWindow.bounds;
                            let new_bounds = {
                                x: mainWindow.isMaximized ? bounds.x + 8 : bounds.x,
                                y: mainWindow.isMaximized ? bounds.y + 78 : bounds.y + 70,
                                width: mainWindow.isMaximized ? bounds.width - 15 : bounds.width - 2,
                                height: mainWindow.isMaximized ? bounds.height - 84 : bounds.height - 72,
                            };
                            child.windowList.forEach((w) => {
                                if (w.__options.windowType == 'view' && w.__options.main_window_id == mainWindow.id) {
                                    w.window.setBounds(new_bounds);
                                    if (!mainWindow.hide && w.__options.tab_id == child.currentView.tab_id) {
                                        w.window.show();
                                    } else {
                                        w.window.hide();
                                    }
                                }
                            });
                        }
                    } else {
                        child.sendMessage(data);
                    }
                }
            }
            setTimeout(() => {
                child.sendCurrentDataLoop();
            }, 10);
        };

        if (win.__options.windowType === 'main') {
            child.sendCurrentDataLoop();
        }

        function sendCurrentData() {
            if (win.__options.windowType === 'main') {
                child.sendCurrentDataAllow = true;
            }
        }
        win.on('move', function () {
            sendCurrentData();
        });
        win.on('resize', function () {
            sendCurrentData();
        });

        win.on('restore', function () {
            sendCurrentData();
        });
        win.on('minimize', function () {
            sendCurrentData();
        });
        win.on('unmaximize', function () {
            sendCurrentData();
        });
        win.on('maximize', function () {
            sendCurrentData();
        });
        win.on('hide', function () {
            sendCurrentData();
        });
        win.on('show', function () {
            sendCurrentData();
        });
        win.on('focus', function () {
            sendCurrentData();
            if (win.__options.windowType !== 'addressbar') {
                child.sendMessage({
                    type: '[to-all]',
                    name: 'hide-addressbar',
                });
            }
        });
        win.on('close', (e) => {
            child.windowList.forEach((w, i) => {
                if (w.id == win.id) {
                    child.windowList.splice(i, 1);
                }
            });
            if (win && !win.isDestroyed()) {
                win.destroy();
            }
        });

        win.on('closed', () => {
            //  process.exit();
        });

        win.on('app-command', (e, cmd) => {
            // Navigate the window back when the user hits their mouse back button
            // APPCOMMAND_BROWSER_BACKWARD converted to browser-backward
            if (cmd === 'browser-backward' && win.webContents.canGoBack()) {
                win.webContents.goBack();
            } else if (cmd === 'browser-forward' && win.webContents.canGoForward()) {
                win.webContents.goForward();
            }
        });

        win.on('enter-full-screen', (e) => {
            setTimeout(() => {
                child.handleWindowBounds();
            }, 100);

            setTimeout(() => {
                if (win && !win.isDestroyed()) {
                    win.setAlwaysOnTop(true);
                    win.show();
                }
            }, 200);
        });
        win.on('leave-full-screen', (e) => {
            setTimeout(() => {
                child.handleWindowBounds();
                if (win && !win.isDestroyed()) {
                    if (!win.__options.windowType.like('*youtube*')) {
                        win.setAlwaysOnTop(false);
                    }
                    win.show();
                }
            }, 100);
        });
        win.on('enter-html-full-screen', (e) => {
            setTimeout(() => {
                child.handleWindowBounds();
            }, 100);

            setTimeout(() => {
                if (win && !win.isDestroyed()) {
                    win.setAlwaysOnTop(true);
                    win.show();
                }
            }, 200);
        });
        win.on('leave-html-full-screen', (e) => {
            setTimeout(() => {
                child.handleWindowBounds();
                if (win && !win.isDestroyed()) {
                    if (!win.__options.windowType.like('*youtube*')) {
                        win.setAlwaysOnTop(false);
                    }
                    win.show();
                }
            }, 100);
        });

        win.webContents.on('context-menu', (event, params) => {
            if (win && !win.isDestroyed()) {
                win.webContents.send('context-menu', params);
            }

            return;
            const menu = new child.electron.Menu();

            // Add each spelling suggestion
            for (const suggestion of params.dictionarySuggestions) {
                event.preventDefault();
                menu.append(
                    new child.electron.MenuItem({
                        label: suggestion,
                        click: () => win.webContents.replaceMisspelling(suggestion),
                    }),
                );
            }

            // Allow users to add the misspelled word to the dictionary
            if (params.misspelledWord) {
                menu.append(
                    new child.electron.MenuItem({
                        label: 'Add to dictionary',
                        click: () => win.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord),
                    }),
                );
            }

            menu.append(
                new child.electron.MenuItem({
                    label: 'Refresh',
                    click: () => win.webContents.reload(),
                }),
            );
            menu.append(
                new child.electron.MenuItem({
                    type: 'separator',
                }),
            );
            menu.append(
                new child.electron.MenuItem({
                    label: 'Developer Tools',
                    click: () => win.openDevTools(),
                }),
            );

            menu.popup();
        });

        win.webContents.on('before-input-event', (event, input) => {
            // For example, only enable application menu keyboard shortcuts when
            // Ctrl/Cmd are down.
            if (win && !win.isDestroyed()) {
                win.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta);
            }
        });

        win.on('page-title-updated', (e, title) => {
            win.__options.title = title;
            child.updateTab(win);
            child.sendMessage({
                type: '[add-window-url]',
                url: child.decodeURI(win.getURL()),
                title: title,
                logo: win.__options.favicon,
                ignoreCounted: true,
            });
        });

        win.webContents.on('page-favicon-updated', (e, urls) => {
            win.__options.icon = urls[0];
            win.__options.favicon = urls[0];
            child.updateTab(win);
            child.sendMessage({
                type: '[add-window-url]',
                url: child.decodeURI(win.getURL()),
                title: win.getTitle(),
                logo: win.__options.favicon,
                ignoreCounted: true,
            });
        });
        let loading_icon = 'http://127.0.0.1:60080/images/loading-white.gif';
        let error_icon = 'http://127.0.0.1:60080/images/no.jpg';

        win.webContents.on('did-start-loading', (e, urls) => {
            win.__options.icon = loading_icon;
            child.updateTab(win);
        });
        win.webContents.on('did-stop-loading', (e) => {
            win.__options.icon = win.__options.favicon;
            child.updateTab(win);
        });
        win.webContents.on('did-finish-load', (e) => {
            win.__options.icon = win.__options.favicon;
            child.updateTab(win);
        });
        win.webContents.on('did-fail-load', (e) => {
            e.preventDefault();
            win.__options.icon = error_icon;
            child.updateTab(win);
            // win.loadURL('browser://error?url=' + win.getURL() + '&description=Error While Loading');
        });

        win.webContents.on('update-target-url', (e, url) => {
            url = url.replace('#___new_tab___', '').replace('#___new_popup___', '');
            if (win && !win.isDestroyed()) {
                win.webContents.send('[send-render-message]', {
                    name: 'update-target-url',
                    url: child.decodeURI(url),
                });
            }
        });

        win.webContents.on('dom-ready', (e) => {
            if (win && !win.isDestroyed()) {
                win.setBounds({ width: win.getBounds().width + 1 });
                win.setBounds({ width: win.getBounds().width - 1 });

                child.sendMessage({
                    type: '[add-window-url]',
                    url: child.decodeURI(win.getURL()),
                    title: win.getTitle(),
                    logo: win.__options.favicon,
                });
            }
        });

        win.on('unresponsive', async () => {
            const options = {
                type: 'info',
                title: 'Window unresponsive',
                message: 'This Window has been suspended',
                buttons: ['[window-reload]', 'Close'],
            };

            if (win && !win.isDestroyed()) {
                child.electron.dialog.showMessageBox(options, function (index) {
                    if (index === 0) {
                        win.webContents.forcefullyCrashRenderer();
                        win.webContents.reload();
                    } else {
                        win.close();
                    }
                });
            }
        });

        win.webContents.on('crashed', (e) => {
            if (win && !win.isDestroyed()) {
                win.webContents.forcefullyCrashRenderer();
                win.webContents.reload();
            }
        });

        win.webContents.on('will-navigate', (e, url) => {
            // when user click on link
            // parent.log(win.getURL(), url);
        });

        win.webContents.on('will-redirect', (e, url) => {
            let ok = false;
            parent.var.overwrite.urls.forEach((data) => {
                if (ok) {
                    return;
                }
                if (url.like(data.from)) {
                    if (data.time && new Date().getTime() - data.time < 3000) {
                        return;
                    }

                    if (data.ignore && url.like(data.ignore)) {
                        return;
                    }

                    ok = true;
                    e.preventDefault();
                    data.time = new Date().getTime();
                    if (win && !win.isDestroyed()) {
                        win.loadURL(data.to);
                    }
                }
            });
        });

        if (win.webContents.setWindowOpenHandler) {
            win.webContents.setWindowOpenHandler(({ url, frameName }) => {
                if (url.like('*about:blank*')) {
                    return { action: 'deny' };
                } else {
                    return {
                        action: 'allow',
                        overrideBrowserWindowOptions: {
                            modal: true,
                        },
                    };
                }
            });

            win.webContents.on('did-create-window', (win, { url, frameName, options, disposition, referrer, postData }) => {});
        }
        win.webContents.on('new-window', function (event, url, frameName, disposition, options, referrer, postBody) {
            event.preventDefault();

            if (!win || win.isDestroyed()) {
                return;
            }

            let real_url = url || event.url || '';

            if (real_url.like('*about:blank*')) {
                return false;
            }

            const loadOptions = {
                httpReferrer: referrer,
            };

            if (postBody != null) {
                const { data, contentType, boundary } = postBody;
                loadOptions.postData = postBody.data;
                loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`;
            }

            if (real_url.like('https://www.youtube.com/watch*')) {
                real_url = 'https://www.youtube.com/embed/' + real_url.split('=')[1].split('&')[0];

                child.createNewWindow({
                    windowType: 'youtube',
                    title: 'YouTube',
                    width: 520,
                    height: 330,
                    x: parent.options.screen.bounds.width - 550,
                    y: parent.options.screen.bounds.height - 400,
                    backgroundColor: '#030303',
                    center: false,
                    url: real_url,
                    partition: win.__options.partition,
                    user_name: win.__options.user_name,
                });

                return;
            } else if (real_url.like('https://www.youtube.com/embed*')) {
                child.createNewWindow({
                    windowType: 'youtube',
                    title: 'YouTube',
                    width: 520,
                    height: 330,
                    x: parent.options.screen.bounds.width - 550,
                    y: parent.options.screen.bounds.height - 400,
                    backgroundColor: '#030303',
                    center: false,
                    url: real_url,
                    partition: win.__options.partition,
                    user_name: win.__options.user_name,
                });
                return;
            }

            if (real_url.like('*#___new_tab___*')) {
                child.sendMessage({
                    type: '[open new tab]',
                    url: real_url.replace('#___new_tab___', '').replace('#___new_popup___', '').replace('#___trusted_window___', ''),
                    partition: win.__options.partition,
                    user_name: win.__options.user_name,
                });
                return;
            }

            if (real_url.like('*#___trusted_window___*')) {
                child.createNewWindow({
                    windowType: 'popup',
                    title: 'New Popup',
                    backgroundColor: '#ffffff',
                    center: true,
                    trusted: true,
                    url: real_url.replace('#___new_tab___', '').replace('#___new_popup___', '').replace('#___trusted_window___', ''),
                    partition: win.__options.partition,
                    user_name: win.__options.user_name,
                });
                return;
            }

            if (real_url.like('*#___new_popup___*')) {
                child.createNewWindow({
                    windowType: 'popup',
                    title: 'New Popup',
                    backgroundColor: '#ffffff',
                    center: true,
                    url: real_url.replace('#___new_tab___', '').replace('#___new_popup___', '').replace('#___trusted_window___', ''),
                    partition: win.__options.partition,
                    user_name: win.__options.user_name,
                });
                return;
            }

            let url_parser = child.url.parse(real_url);
            let current_url_parser = child.url.parse(win.getURL());

            let allow = false;
            parent.var.blocking.popup.white_list.forEach((d) => {
                if (url_parser.host.like(d.url) || current_url_parser.host.like(d.url)) {
                    allow = true;
                }
            });

            if (allow) {
                child.sendMessage({
                    type: '[open new tab]',
                    url: real_url.replace('#___new_tab___', '').replace('#___new_popup___', '').replace('#___trusted_window___', ''),
                    partition: win.__options.partition,
                    user_name: win.__options.user_name,
                });
                return;
            }

            if (parent.var.blocking.popup.allow_internal && url_parser.host.contains(current_url_parser.host)) {
                child.sendMessage({
                    type: '[send-render-message]',
                    data: {
                        name: '[open new tab]',
                        url: real_url.replace('#___new_tab___', '').replace('#___new_popup___', '').replace('#___trusted_window___', ''),
                        partition: win.__options.partition,
                        user_name: win.__options.user_name,
                        options: parent.options,
                    },
                });
            } else if (parent.var.blocking.popup.allow_external && !url_parser.host.contains(current_url_parser.host)) {
                child.sendMessage({
                    type: '[open new tab]',
                    url: real_url.replace('#___new_tab___', '').replace('#___new_popup___', '').replace('#___trusted_window___', ''),
                    partition: win.__options.partition,
                    user_name: win.__options.user_name,
                });
            }
        });

        return win;
    };
};
