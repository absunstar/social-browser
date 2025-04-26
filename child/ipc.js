module.exports = function init(child) {
    child.on = function (name, callback) {
        child.ipcMain.handle(name, callback);
    };

    child.call = function (channel, value) {
        if (!child.is_app_ready) {
            return null;
        }

        child.windowList.forEach((view) => {
            if (view.window && !view.window.isDestroyed()) {
                if (value && value.toWindowID) {
                    if (value.toWindowID == view.id) {
                        view.window.send(channel, value);
                    }
                } else {
                    view.window.send(channel, value);
                }
            }
        });
    };

    child.handleBrowserData = function (data) {
        let data2 = {
            childProcessID: child.id,
            child_index: child.index,
            information: child.parent.information,
            files_dir: child.parent.files_dir,
            dir: child.parent.dir,
            data_dir: child.parent.data_dir,
            injectHTML: child.parent.injectHTML,
            injectCSS: child.parent.injectCSS,
            newTabData: child.parent.newTabData,
            parentAssignWindow: child.assignWindows.find((w) => w.childWindowID == data.windowID),
            userAgentBrowserList: child.userAgentBrowserList.map((b) => ({ name: b.name, vendor: b.vendor, prefix: b.prefix })),
            timeZones: child.timeZones,
            languageList: child.languageList,
            effectiveTypeList: child.effectiveTypeList,
            connectionTypeList: child.connectionTypeList,
            userAgentDeviceList: child.userAgentDeviceList,
        };

        let win = child.windowList.find((w) => w.id == data.windowID);
        if (win) {
            data2.customSetting = win.customSetting || {};
            data2.partition = data2.customSetting.partition;
            data2.session = data2.customSetting.session || child.parent.var.session_list.find((s) => s.name == data2.partition);
        }
        data.username = data2.session?.display;
        data2.var = child.get_dynamic_var(data);
        return data2;
    };

    child.ipcMain.handle('[browser][data]', async (event, data) => {
        let data2 = child.handleBrowserData(data);
        return data2;
    });
    child.ipcMain.handle('[crx]', async (event, data) => {
        console.log('[crx]', data);
        return undefined;
    });
    child.ipcMain.on('[browser][data]', async (event, data) => {
        let data2 = child.handleBrowserData(data);
        event.returnValue = data2;
    });

    child.ipcMain.on('[get]', async (event, data) => {
        let arr = data.property.split('.');
        let obj = undefined;
        let prop = undefined;

        if (arr.length == 1) {
            obj = child.shared;
            prop = arr[0];
        } else if (arr.length == 2) {
            prop = arr[1];

            if (arr[0] == 'webContents') {
                obj = event.sender;
            } else if (arr[0] == 'window') {
                obj = child.electron.BrowserWindow.fromWebContents(event.sender) || child.windowList[child.windowList.length - 1]?.window || child.lastWindow;
            } else if (arr[0] == 'session') {
                obj = event.sender.session;
            } else if (arr[0] == 'shared') {
                obj = child.shared;
            } else if (arr[0] == 'api') {
                obj = child.api;
            } else if (arr[0] == 'child') {
                obj = child;
            } else if (arr[0] == 'screen') {
                obj = child.electron.screen;
            } else {
                obj = child.shared;
            }
        }

        if (obj && prop) {
            try {
                event.returnValue = obj[prop];
            } catch (error) {
                console.log(error);
                console.log(arr);
                event.returnValue = undefined;
            }
        }
    });
    child.ipcMain.on('[set]', async (event, data) => {
        let arr = data.property.split('.');
        let obj = undefined;
        let prop = undefined;

        if (arr.length == 1) {
            obj = child.shared;
            prop = arr[0];
        } else if (arr.length == 2) {
            prop = arr[1];

            if (arr[0] == 'webContents') {
                obj = event.sender;
            } else if (arr[0] == 'window') {
                obj = child.electron.BrowserWindow.fromWebContents(event.sender) || child.windowList[child.windowList.length - 1]?.window || child.lastWindow;
            } else if (arr[0] == 'session') {
                obj = event.sender.session;
            } else if (arr[0] == 'shared') {
                obj = child.shared;
            } else if (arr[0] == 'api') {
                obj = child.api;
            } else if (arr[0] == 'child') {
                obj = child;
            } else if (arr[0] == 'screen') {
                obj = child.electron.screen;
            } else {
                obj = child.shared;
            }
        }

        if (obj && prop) {
            obj[prop] = data.value;
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    });
    child.handleRenderFn = function (event, data) {
        try {
            let arr = data.fn.split('.');
            let obj = undefined;
            let fn = undefined;

            if (arr.length == 1) {
                obj = child;
                fn = arr[0];
            } else if (arr.length == 2) {
                fn = arr[1];

                if (arr[0] == 'webContents') {
                    obj = event.sender;
                } else if (arr[0] == 'window') {
                    obj = child.electron.BrowserWindow.fromWebContents(event.sender) || child.windowList[child.windowList.length - 1]?.window || child.lastWindow;
                } else if (arr[0] == 'session') {
                    obj = event.sender.session;
                } else if (arr[0] == 'cookies') {
                    obj = event.sender.session.cookies;
                } else if (arr[0] == 'api') {
                    obj = child.api;
                } else if (arr[0] == 'screen') {
                    obj = child.electron.screen;
                } else if (arr[0] == 'child') {
                    obj = child;
                } else {
                    obj = null;
                }
            }

            if (obj && fn) {
                if (obj[fn] && typeof obj[fn] == 'function') {
                    if (typeof data.params == 'string') {
                        return obj[fn](data.params);
                    } else {
                        return obj[fn](...data.params);
                    }
                }
            } else {
                return undefined;
            }
        } catch (error) {
            return undefined;
        }
    };
    child.ipcMain.on('[fn]', async (event, data) => {
        let result = child.handleRenderFn(event, data);
        if (result instanceof Promise) {
            result
                .then((res) => {
                    event.returnValue = res;
                })
                .catch((err) => {
                    event.returnValue = err;
                });
        } else {
            event.returnValue = result;
        }
    });
    child.ipcMain.handle('[fn]', async (event, data) => {
        let result = child.handleRenderFn(event, data);
        if (result instanceof Promise) {
            result
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    return err;
                });
        } else {
            return result;
        }
    });

    child.ipcMain.on('[window]', async (event, data = {}) => {
        child.lastWindow = child.electron.BrowserWindow.fromWebContents(event.sender) || child.windowList[child.windowList.length - 1]?.window || child.lastWindow;
        let obj = { fnList: [] };
        if (child.lastWindow) {
            obj.id = child.lastWindow.id;
            for (const key in child.lastWindow) {
                if (typeof child.lastWindow[key] === 'function') {
                    obj.fnList.push(key);
                }
            }
        } else {
            console.log('[window]', event.sender);
        }

        event.returnValue = obj;
    });

    child.ipcMain.on('[webContents]', async (event, data = { id: 1 }) => {
        let webContents = event.sender;
        let obj = { fnList: [] };
        if (webContents) {
            obj.id = webContents.id;
            for (const key in webContents) {
                if (typeof webContents[key] === 'function') {
                    obj.fnList.push(key);
                }
            }
        } else {
            console.log('[webContents]', event.sender);
        }

        event.returnValue = obj;
    });

    child.ipcMain.on('[screen]', async (event, data = { id: 1 }) => {
        let screen = child.electron.screen;
        let obj = { fnList: [] };
        if (screen) {
            for (const key in screen) {
                if (typeof screen[key] === 'function') {
                    obj.fnList.push(key);
                }
            }
        }

        event.returnValue = obj;
    });

    child.ipcMain.on('[md5]', async (event, data) => {
        event.returnValue = child.api.md5(data);
    });
    child.ipcMain.on('[to123]', async (event, data) => {
        event.returnValue = child.api.to123(data);
    });
    child.ipcMain.on('[from123]', async (event, data) => {
        event.returnValue = child.api.from123(data);
    });
    child.ipcMain.on('[toBase64]', async (event, data) => {
        event.returnValue = child.api.toBase64(data);
    });
    child.ipcMain.on('[fromBase64]', async (event, data) => {
        event.returnValue = child.api.fromBase64(data);
    });
    child.ipcMain.on('[encryptText]', async (event, data) => {
        if (data.password) {
            let l1 = child.parent.var.core.prefix[0];
            let l2 = child.parent.var.core.prefix[1];
            let l3 = child.parent.var.core.prefix[2];
            let l4 = child.parent.var.core.prefix[3];
            let text = child.api.to123(data.password + data.text);

            if (l1) {
                text.replaceAll('1', l1);
            }
            if (l2 && l2 !== l1) {
                text.replaceAll('2', l2);
            }
            if (l3 && l3 !== l1 && l3 !== l2) {
                text.replaceAll('3', l3);
            }
            if (l4 && l4 !== l1 && l4 !== l2 && l4 !== l3) {
                text.replaceAll('4', l4);
            }
            event.returnValue = text;
        } else {
            event.returnValue = '';
        }
    });
    child.ipcMain.on('[decryptText]', async (event, data) => {
        if (data.password) {
            let l1 = child.parent.var.core.prefix[0];
            let l2 = child.parent.var.core.prefix[1];
            let l3 = child.parent.var.core.prefix[2];
            let l4 = child.parent.var.core.prefix[3];

            if (l1) {
                data.text.replaceAll(l1, '1');
            }
            if (l2 && l2 !== l1) {
                data.text.replaceAll(l2, '2');
            }
            if (l3 && l3 !== l1 && l3 !== l2) {
                data.text.replaceAll(l3, '3');
            }
            if (l4 && l4 !== l1 && l4 !== l2 && l4 !== l3) {
                data.text.replaceAll(l4, '4');
            }

            data.text = child.api.from123(data.text);

            if (data.text.startsWith(data.password)) {
                event.returnValue = data.text.replace(data.password, '');
            } else {
                event.returnValue = '';
            }
        } else {
            event.returnValue = '';
        }
    });
    child.ipcMain.on('[select-file]', async (event, options) => {
        const { canceled, filePaths } = await child.electron.dialog.showOpenDialog(options || { properties: ['openFile', 'showHiddenFiles'] });
        if (!canceled) {
            event.returnValue = filePaths[0];
        } else {
            event.returnValue = null;
        }
    });
    child.ipcMain.on('[select-files]', async (event, data) => {
        const { canceled, filePaths } = await child.electron.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections', 'showHiddenFiles'] });
        if (!canceled) {
            event.returnValue = filePaths;
        } else {
            event.returnValue = null;
        }
    });
    child.ipcMain.on('[write-file]', async (event, options) => {
        child.fs.writeFileSync(options.path, options.data);
        event.returnValue = true;
    });
    child.ipcMain.on('[read-file]', async (event, path) => {
        event.returnValue = child.fs.readFileSync(path).toString();
    });
    child.ipcMain.on('[delete-file]', async (event, path) => {
        child.fs.unlinkSync(path);
        event.returnValue = true;
    });
    child.ipcMain.on('[select-folder]', async (event, data) => {
        const { canceled, filePaths } = await child.electron.dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (!canceled) {
            event.returnValue = filePaths[0];
        } else {
            event.returnValue = null;
        }
    });
    child.ipcMain.on('[select-folders]', async (event, data) => {
        const { canceled, filePaths } = await child.electron.dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] });
        if (!canceled) {
            event.returnValue = filePaths;
        } else {
            event.returnValue = null;
        }
    });
    child.ipcMain.on('[open-folder]', async (event, path) => {
        child.electron.shell.showItemInFolder(path);
        event.returnValue = true;
    });
    child.ipcMain.on('[dir-name]', async (event, path) => {
        event.returnValue = child.path.dirname(path);
    });

    child.ipcMain.on('[show-message-box]', async (event, options) => {
        if (!options.message) {
            event.returnValue = null;
            return;
        }
        event.returnValue = await child.electron.dialog.showMessageBox(options);
    });
    child.ipcMain.handle('[open-external]', (e, obj) => {
        child.openExternal(obj.link);
        return true;
    });
    child.ipcMain.handle('[exec]', (e, obj) => {
        child.exec(obj.cmd);
        return true;
    });
    child.ipcMain.handle('[exe]', (e, obj) => {
        child.exe(obj.cmd, obj.args);
        return true;
    });
    child.ipcMain.handle('[kill]', (e, obj) => {
        child.child_process.exec('tasklist', { maxBuffer: 1024 * 1024 * 2 }, function (err, stdout, stderr) {
            let programsList = [];
            if (stdout) {
                let lines = stdout.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line === '') continue;
                    var values = line.split(/\s+/);
                    programsList.push({
                        name: values[0],
                        pid: values[1],
                        memory: values[4],
                    });
                }

                programsList.forEach((itm) => {
                    if (itm.name.like(obj.name)) {
                        try {
                            process.kill(itm.pid);
                        } catch (error) {
                            child.log(error);
                        }
                    }
                });
            }
        });

        return true;
    });
    child.ipcMain.handle('[request-cookie]', (e, obj) => {
        return child.cookieList.find((c) => obj.domain.like(c.domain) && c.partition == obj.partition);
    });

    child.ipcMain.handle('online-status', (e, obj) => {
        child.parent.var.core.onLineStatus = obj.status;
    });

    child.ipcMain.handle('[handle-session]', (e, obj) => {
        child.handleSession(obj);
    });
    child.ipcMain.handle('[cookie-set-raw]', (e, obj) => {
        return true;
    });
    child.ipcMain.handle('[cookie-get-raw]', (e, obj) => {
        return child.getCookiesRaw(obj);
    });
    child.ipcMain.handle('[cookie-get-all]', (e, obj) => {
        return child.getAllCookies(obj);
    });
    child.ipcMain.handle('[cookies-clear]', (e, obj) => {
        return child.clearCookies(obj);
    });
    child.ipcMain.handle('show_message', (e, data) => {
        let win = child.electron.BrowserWindow.fromId(data.windowID);
        if (win) {
            win.send('show_message', data);
        }
    });
    child.ipcMain.handle('message', (e, message) => {
        let win = child.electron.BrowserWindow.fromId(message.windowID);
        if (win) {
            win.webContents.send('message', message);
            win.webContents.mainFrame.frames.forEach((f) => {
                f.send('message', message);
            });
        }
    });
    child.ipcMain.handle('window.message', (e, message) => {
        let win = child.electron.BrowserWindow.fromId(message.windowID);
        if (win) {
            win.send('window.message', message);
        }
    });

    child.ipcMain.handle('share', (e, data) => {
        child.sendMessage({
            type: 'share',
            data: data,
        });
    });

    child.ipcMain.handle('[proxy-check-request]', (e, message) => {
        child.proxy_check(message.proxy);
    });
    child.ipcMain.handle('getBlobData', (e, message) => {
        child.log('getBlobData', message);
        let ses = child.electron.session.fromPartition(message.partition);
        ses.getBlobData(message.url)
            .then((data) => {
                child.log(data);
            })
            .catch((err) => {
                child.log(err);
            });
    });
    child.ipcMain.handle('ws', (e, message) => {
        child.sendMessage(message);
    });

    child.ipcMain.handle('[add][window]', (e, data) => {
        let w = child.windowList.find((w) => w.id == data.windowID);
        if (w) {
            w.customSetting = { ...w.customSetting, ...data.customSetting };
            w.id2 = data.id2 || w.id2;
        } else {
            child.windowList.push({
                id: data.windowID,
                id2: data.id2,
                customSetting: data.customSetting,
            });
        }
    });

    child.ipcMain.handle('[set][window][setting]', (e, data) => {
        let w = child.windowList.find((w) => w.id == data.windowID);
        if (w) {
            w.customSetting.windowSetting = w.customSetting.windowSetting || [];
            w.customSetting.windowSetting.push(data);
            w.id2 = data.id2 || w.id2;
        } else {
            let id = data.windowID;
            let customSetting = data.customSetting;
            delete data.windowID;
            delete data.customSetting;

            child.windowList.push({
                id: id,
                id2: data.id2,
                customSetting: { ...customSetting, windowSetting: [data] },
            });
        }
    });

    child.ipcMain.handle('[get][window][setting]', (e, data) => {
        let win = child.windowList.find((w) => w.id == data.windowID);
        if (win) {
            return win.customSetting.windowSetting || [];
        } else {
            return [];
        }
    });

    child.ipcMain.handle('[assign][window]', (e, info) => {
        child.assignWindows.push({
            parentWindowID: info.parentWindowID,
            childWindowID: info.childWindowID,
        });
    });

    child.ipcMain.handle('[get][assign][window]', (e, info) => {
        return child.assignWindows.find((w) => w.childWindowID == info.childWindowID);
    });

    child.ipcMain.handle('[fetch]', async (e, options) => {
        options.body = options.body || options.data || options.payload;
        if (options.body && typeof options.body != 'string') {
            options.body = JSON.stringify(options.body);
        }
        options.return = options.return || 'all';
        let response = await child.api.fetch(options.url, {
            mode: 'cors',
            method: options.method || 'get',
            headers: options.headers || {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.4638.54 Safari/537.36',
            },
            body: options.body,
            redirect: options.redirect || 'follow',
        });

        if (response) {
            if (options.return == 'json') {
                return response.json();
            } else if (options.return == 'text') {
                return await response.text();
            } else {
                return {
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers.raw(),
                    body: await response.text(),
                };
            }
        }
    });

    child.ipcMain.handle('[fetch-json]', async (e, options) => {
        options.body = options.body || options.data || options.payload;
        if (options.body && typeof options.body != 'string') {
            options.body = JSON.stringify(options.body);
        }
        options.return = options.return || 'json';
        try {
            let data = await child.api.fetch(options.url, {
                mode: 'cors',
                method: options.method || 'get',
                headers: options.headers || {
                    'Content-Type': 'application/json',
                    'User-Agent': child.parent.var.core.defaultUserAgent.url,
                },
                body: options.body,
                redirect: options.redirect || 'follow',
            });

            if (data) {
                if (options.return == 'json') {
                    if (data.ok) {
                        return data.json();
                    } else {
                        return JSON.stringify({ done: false, data: data, options: options });
                    }
                } else {
                    return data.text();
                }
            }
        } catch (error) {
            console.log(error);
            if (options.return == 'json') {
                return JSON.stringify({ done: false, error: error });
            } else {
                return error.toString();
            }
        }
    });

    child.ipcMain.handle('[translate]', async (e, info) => {
        info.text = encodeURIComponent(info.text);
        info.from = info.from || 'auto';
        info.to = info.to || 'en';
        info.data = await child.api.fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${info.from}&tl=${info.to}&dt=t&dt=bd&dj=1&q=${info.text}`, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        });
        if (info.data) {
            info.data = info.data.json();
        }
        return info;
    });

    setInterval(() => {
        child.nativeIconList.forEach((c) => {
            if (!c.icon) {
                c.icon = child.electron.nativeImage.createFromPath(c.path).resize({ width: 16 });
            }
        });
    }, 1000 * 5);

    child.nativeIconList = [];
    child.getNativeIcon = function (iconURL) {
        if (!iconURL) {
            return undefined;
        }
        let path = child.path.join(child.parent.data_dir, 'favicons', child.api.md5(iconURL) + '.' + iconURL.split('?')[0].split('.').pop());
        let index = child.nativeIconList.findIndex((c) => c.url == iconURL || c.path == path);

        if (index !== -1) {
            return child.nativeIconList[index].icon;
        } else {
            child.nativeIconList.push({
                url: iconURL,
                path: path,
            });

            child.sendMessage({
                type: '[download-favicon]',
                url: iconURL,
            });
        }
    };

    child.ipcMain.handle('[show-menu]', (e, data) => {
        let win = child.electron.BrowserWindow.fromId(data.windowID);
        let contents = null;
        if (data.processId && data.routingId) {
            contents = child.electron.webFrameMain.fromId(data.processId, data.routingId);
        } else {
            contents = win.webContents;
        }
        if (!contents) {
            win.webContents.mainFrame.frames.forEach((f1) => {
                if (f1.routingId == data.routingId) {
                    contents = f1;
                }
                f1.frames.forEach((f2) => {
                    if (f2.routingId == data.routingId) {
                        contents = f2;
                    }
                    f2.frames.forEach((f3) => {
                        if (f3.routingId == data.routingId) {
                            contents = f3;
                        }
                        f3.frames.forEach((f4) => {
                            if (f4.routingId == data.routingId) {
                                contents = f4;
                            }
                            f4.frames.forEach((f5) => {
                                if (f5.routingId == data.routingId) {
                                    contents = f5;
                                }
                            });
                        });
                    });
                });
            });
            contents = contents || win.webContents;
        }

        data.list.forEach((m, i) => {
            m.click = function () {
                contents.send('[run-menu]', { index: i });
            };
            m.icon = child.getNativeIcon(m.iconURL);

            if (m.submenu) {
                m.submenu.forEach((m2, i2) => {
                    m2.click = function () {
                        contents.send('[run-menu]', { index: i, index2: i2 });
                    };
                    m2.icon = child.getNativeIcon(m2.iconURL);

                    if (m2.submenu) {
                        m2.submenu.forEach((m3, i3) => {
                            m3.click = function () {
                                contents.send('[run-menu]', { index: i, index2: i2, index3: i3 });
                            };
                            m3.icon = child.getNativeIcon(m3.iconURL);
                        });
                    }
                });
            }
        });

        const menu = child.electron.Menu.buildFromTemplate(data.list);
        // child.electron.Menu.setApplicationMenu(menu);
        menu.popup(win);
    });
    child.ipcMain.handle('[create-new-view]', (event, options) => {
        options.url = options.url || child.parent.var.core.default_page;
        options.windowType = 'view';
        options.parent_id = child.id;
        options.parent_index = child.index;
        if (child.speedMode) {
            if (!child.session_name_list.some((s) => s == options.partition)) {
                child.handleSession({ name: options.partition });
            }
            child.createNewWindow(options);
        } else {
            child.sendMessage({
                type: '[create-new-view]',
                options: options,
            });
        }
    });

    child.ipcMain.handle('[show-view]', (e, options) => {
        if (child.addressbarWindow && !child.addressbarWindow.isDestroyed()) {
            child.addressbarWindow.hide();
        }
        if (child.profilesWindow && !child.profilesWindow.isDestroyed()) {
            child.profilesWindow.hide();
        }

        if (child.speedMode) {
            child.currentView = options;
            child.windowList.forEach((w) => {
                if (w.customSetting.windowType == 'view') {
                    if (w.customSetting.tabID == child.currentView.tabID) {
                        w.window.show();
                    } else {
                        w.window.hide();
                    }
                }
            });
        } else {
            delete options.parentSetting;
            // let w = child.windowList.find((w) => w.customSetting.windowType == 'main');
            // if (w && w.window && !w.window.isDestroyed()) {

            // }
            child.sendMessage({
                type: '[show-view]',
                options: options,
            });
        }
    });

    child.ipcMain.handle('[close-view]', (e, options) => {
        if (child.speedMode) {
            child.windowList.forEach((w) => {
                if (w.customSetting.windowType == 'view' && w.customSetting.tabID == options.tabID) {
                    w.window.close();
                }
            });
        } else {
            child.sendMessage({
                type: '[close-view]',
                options: options,
            });
        }
    });

    child.ipcMain.handle('[update-view-url]', (e, data) => {
        child.sendMessage({
            type: '[update-view-url]',
            data: data,
        });
    });

    child.ipcMain.handle('[import-proxy-list]', (e, file) => {
        child.importProxyList(file);
    });
    child.ipcMain.handle('[load-google-extension]', (e, extensionInfo) => {
        child.sendMessage({
            type: '[load-google-extension]',
            extensionInfo: extensionInfo,
        });
    });
    child.ipcMain.handle('[remove-google-extension]', (e, extensionInfo) => {
        child.sendMessage({
            type: '[remove-google-extension]',
            extensionInfo: extensionInfo,
        });
    });
    child.ipcMain.handle('[import-extension]', (e, folder) => {
        child.sendMessage({
            type: '[import-extension]',
            folder: folder,
        });
    });
    child.ipcMain.handle('[enable-extension]', (e, options) => {
        child.sendMessage({
            type: '[enable-extension]',
            extension: options,
        });
    });
    child.ipcMain.handle('[disable-extension]', (e, options) => {
        child.sendMessage({
            type: '[disable-extension]',
            extension: options,
        });
    });
    child.ipcMain.handle('[remove-extension]', (e, options) => {
        child.sendMessage({
            type: '[remove-extension]',
            extension: options,
        });
    });

    child.ipcMain.handle('[update-browser-var]', (e, options) => {
        child.parent.var[options.name] = options.data;
        child.sendMessage({
            type: '[update-browser-var]',
            options: options,
        });
    });

    child.ipcMain.handle('[browser-message]', (event, data) => {
        let w = child.windowList.find((w) => w.id == data.windowID);
        if (w && w.window && !w.window.isDestroyed()) {
            if (data.name == 'maxmize') {
                if (w.window.isMaximized()) {
                    w.window.unmaximize();
                } else {
                    w.window.maximize();
                }
            } else if (data.name == 'minmize') {
                w.window.minimize();
            } else if (data.name == 'close') {
                w.window.close();
            }
        }
    });

    child.ipcMain.handle('[open new tab]', (event, data) => {
        data.partition = data.partition || child.parent.var.core.session.name;
        data.user_name = data.user_name || child.parent.var.session_list.find((s) => s.name == data.partition)?.display || data.partition;
        data.title = data.title || data.url;

        if (child.windowList.some((w) => w.customSetting.windowType == 'main')) {
            child.windowList.forEach((w) => {
                if (w.customSetting.windowType == 'main' && !w.window.isDestroyed()) {
                    w.window.webContents.send('[open new tab]', data);
                }
            });
        } else {
            data.main_window_id = child.parent.options.main_window_id;
            child.sendMessage({
                type: '[open new tab]',
                data: data,
            });
        }
    });

    child.ipcMain.handle('[open new popup]', (event, data) => {
        data.partition = data.partition || child.parent.var.core.session.name;
        data.user_name = data.user_name || child.parent.var.core.session.display;

        delete data.name;
        data.windowType = data.windowType || 'popup';
        if (data.partition == child.partition) {
            child.createNewWindow(data);
        } else {
            child.sendMessage({
                type: '[create-new-window]',
                options: data,
            });
        }
    });

    child.ipcMain.handle('[show-addressbar]', (event, data) => {
        child.showAddressbarWindow(data);
    });
    child.ipcMain.handle('[edit-window]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[edit-window]', data: data });
        } else if (data.windowID) {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
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
                false
            );
        }
    });

    child.ipcMain.handle('[window-reload]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[window-reload]', data: data });
        } else if (data.windowID) {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            win.webContents.reload();
        }
    });

    child.ipcMain.handle('[window-reload-hard]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[window-reload-hard]', data: data });
        } else if (data.windowID) {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            if (win && data.origin && data.origin !== 'null') {
                let ss = win.webContents.session;
                data.storages = data.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'];
                data.quotas = data.quotas || ['temporary', 'persistent', 'syncable'];
                child.log(' will clear storage data ...');
                let clear = false;
                ss.clearStorageData({
                    origin: data.origin,
                    storages: data.storages,
                    quotas: data.quotas,
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

    child.ipcMain.handle('[window-action]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[window-action]', data: data });
        }
    });

    child.ipcMain.handle('[toggle-window-edit]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[toggle-window-edit]', data: data });
        }
    });

    child.ipcMain.handle('[window-go-back]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[window-go-back]', data: data });
        } else if (data.windowID) {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            if (win.webContents.navigationHistory.canGoBack()) {
                win.webContents.navigationHistory.goBack();
            }
        }
    });

    child.ipcMain.handle('[window-go-forward]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[window-go-forward]', data: data });
        } else if (data.windowID) {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            if (win.webContents.navigationHistory.canGoForward()) {
                win.webContents.goForward();
            }
        }
    });

    child.ipcMain.handle('[window-zoom]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[window-zoom]', data: data });
        } else if (data.windowID) {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            win.webContents.zoomFactor = 1;
            win.show();
        }
    });

    child.ipcMain.handle('[window-zoom-]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[window-zoom-]', data: data });
        } else if (data.windowID) {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            if (win && win.webContents.zoomFactor - 0.3 > 0.0) {
                win.webContents.zoomFactor -= 0.2;
                win.show();
            }
        }
    });

    child.ipcMain.handle('[window-zoom+]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[window-zoom+]', data: data });
        } else if (data.windowID) {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            win.webContents.zoomFactor += 0.2;
            win.show();
        }
    });

    child.ipcMain.handle('[add-to-bookmark]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({
                type: '[add-to-bookmark]',
                data: data,
            });
        }
    });

    child.ipcMain.handle('[run-script]', (event, data) => {
        let win = child.electron.BrowserWindow.fromId(data.windowID);
        if (win && !win.isDestroyed()) {
            win.webContents.send('[run-script]', data.script);
            win.webContents.mainFrame.frames.forEach((f) => {
                f.send('[run-script]', data.script);
                f.frames.forEach((f2) => {
                    f2.send('[run-script]', data.script);
                    f2.frames.forEach((f3) => {
                        f3.send('[run-script]', data.script);
                        f3.frames.forEach((f4) => {
                            f4.send('[run-script]', data.script);
                        });
                    });
                });
            });
        }
    });

    child.ipcMain.handle('[show-window-dev-tools]', (event, data) => {
        if (data.tabID && data.childID && data.windowID) {
            child.sendMessage({ type: '[show-window-dev-tools]', data: data });
        } else if (data.windowID) {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            win.openDevTools();
        }
    });

    child.ipcMain.handle('[show-profiles]', (event, data) => {
        child.showProfilesWindow();
    });

    child.ipcMain.handle('user_data', (event, data) => {
        if (!Array.isArray(data.data) || data.data.length === 0) {
            return null;
        }
        child.parent.var.user_data = child.parent.var.user_data || [];
        let index = child.parent.var.user_data.findIndex((u) => u.id === data.id);
        if (index !== -1) {
            child.parent.var.user_data[index].data = data.data;
        } else {
            child.parent.var.user_data.push(data);
        }
        delete data.parentSetting;
        child.sendMessage({
            type: '[user_data][changed]',
            data: data,
        });
    });

    child.ipcMain.handle('user_data_input', (event, data) => {
        if (!Array.isArray(data.data) || data.data.length === 0) {
            return null;
        }

        child.parent.var.user_data_input = child.parent.var.user_data_input || [];
        let index = child.parent.var.user_data_input.findIndex((u) => u.id === data.id);
        if (index > -1) {
            child.parent.var.user_data_input[index].data = data.data;
        } else {
            child.parent.var.user_data_input.push(data);
        }
        delete data.parentSetting;
        child.sendMessage({
            type: '[user_data_input][changed]',
            data: data,
        });
    });

    child.ipcMain.handle('[send-render-message]', (event, data) => {
        data.partition = data.partition || child.parent.var.core.session.name;
        data.user_name = data.user_name || child.parent.var.core.session.display;

        if (data.tabID && data.childID && data.windowID) {
            let name = data.name;
            delete data.name;

            child.sendMessage({
                type: name,
                data: data,
            });
        } else if (!child.speedMode && data.action) {
            delete data.action;
            child.sendMessage({
                type: '[call-window-action]',
                data: data,
            });
        } else if (data.name == '[run-window-update]') {
            child.sendMessage({
                type: '[run-window-update]',
            });
        } else if (data.name == '[show-browser-setting]') {
            if (child.windowList.some((w) => w.customSetting.windowType == 'main')) {
                child.windowList.forEach((w) => {
                    if (w.customSetting.windowType == 'main' && !w.window.isDestroyed()) {
                        w.window.webContents.send('[open new tab]', {
                            url: 'http://127.0.0.1:60080/setting',
                            partition: 'ghost',
                            user_name: 'Setting',
                            windowType: 'view',
                            vip: true,
                        });
                    }
                });
            } else {
                data.main_window_id = child.parent.options.main_window_id;
                child.sendMessage({
                    type: '[open new tab]',
                    data: {
                        url: 'http://127.0.0.1:60080/setting',
                        partition: 'ghost',
                        user_name: 'Setting',
                        windowType: 'view',
                        vip: true,
                    },
                });
            }
        } else if (data.name == '[toggle-fullscreen]') {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            win.setFullScreen(!win.isFullScreen());
        } else if (data.name == '[window-go-forward]') {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            if (win.webContents.navigationHistory.canGoForward()) {
                win.webContents.goForward();
            }
        } else if (data.name == '[window-go-forward]') {
            let win = child.electron.BrowserWindow.fromId(data.windowID);
            if (win.webContents.navigationHistory.canGoForward()) {
                win.webContents.goForward();
            }
        } else if (data.name == '[save-window-as-pdf]') {
            let win = child.electron.BrowserWindow.fromId(data.windowID);

            child.electron.dialog
                .showSaveDialog({
                    defaultPath: win.webContents.title,
                    title: 'Save Downloading URL As PDF',
                    properties: ['openFile', 'createDirectory'],
                })
                .then((result) => {
                    if (result.canceled) {
                        return;
                    }
                    win.webContents.printToPDF({}).then((data) => {
                        child.fs.writeFile(result.filePath, data, function (error) {
                            if (!error) {
                                child.electron.dialog
                                    .showMessageBox({
                                        title: 'Download Complete',
                                        type: 'info',
                                        buttons: ['Open File', 'Open Folder', 'Close'],
                                        message: `Save Page As PDF \n To \n ${result.filePath} `,
                                    })
                                    .then((result3) => {
                                        child.electron.shell.beep();
                                        if (result3.response == 1) {
                                            child.electron.shell.showItemInFolder(result.filePath);
                                        }
                                        if (result3.response == 0) {
                                            child.electron.shell.openPath(result.filePath);
                                        }
                                    });
                            } else {
                                child.log(error);
                            }
                        });
                    });
                });
        } else if (data.name == '[download-link]') {
            let ss = child.electron.session.defaultSession;
            ss.downloadURL(data.url);
        }
        return true;
    });
};
