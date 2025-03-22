SOCIALBROWSER.window = new Proxy(SOCIALBROWSER._window, {
    get(target, name, receiver) {
        if (!Reflect.has(target, name)) {
            return SOCIALBROWSER.get('window.' + name);
        }
        return Reflect.get(target, name, receiver);
    },
    set(target, name, value, receiver) {
        if (!Reflect.has(target, name)) {
            return SOCIALBROWSER.set('window.' + name, value);
        }
        return Reflect.set(target, name, value, receiver);
    },
});

SOCIALBROWSER._webContents = SOCIALBROWSER.ipcSync('[webContents]');
SOCIALBROWSER._webContents.fnList.forEach((fn) => {
    SOCIALBROWSER._webContents[fn] = (...params) => SOCIALBROWSER.fn('webContents.' + fn, ...params);
});
SOCIALBROWSER._webContents.session = { on: () => {}, isPersistent: () => SOCIALBROWSER.fn('session.isPersistent') };
SOCIALBROWSER._webContents.devToolsWebContents = { focus: () => SOCIALBROWSER.fn('webContents.devToolsWebContents.focus') };
SOCIALBROWSER._webContents.getPrintersAsync = function () {
    return new Promise((resolve, reject) => {
        resolve(SOCIALBROWSER.fn('webContents.getPrintersAsync'));
    });
};
SOCIALBROWSER._webContents.on = function () {};
SOCIALBROWSER._webContents.setWindowOpenHandler = function () {};
SOCIALBROWSER.webContents = new Proxy(SOCIALBROWSER._webContents, {
    get(target, name, receiver) {
        if (!Reflect.has(target, name)) {
            return SOCIALBROWSER.get('webContents.' + name);
        }
        return Reflect.get(target, name, receiver);
    },
    set(target, name, value, receiver) {
        if (!Reflect.has(target, name)) {
            return SOCIALBROWSER.set('webContents.' + name, value);
        }
        return Reflect.set(target, name, value, receiver);
    },
});

SOCIALBROWSER._screen = { ...window.screen, ...SOCIALBROWSER.ipcSync('[screen]') };
SOCIALBROWSER._screen.fnList.forEach((fn) => {
    SOCIALBROWSER._screen[fn] = (...params) => SOCIALBROWSER.fn('screen.' + fn, ...params);
});

SOCIALBROWSER.screen = new Proxy(SOCIALBROWSER._screen, {
    get(target, name, receiver) {
        if (!Reflect.has(target, name)) {
            return SOCIALBROWSER.get('screen.' + name);
        }
        return Reflect.get(target, name, receiver);
    },
    set(target, name, value, receiver) {
        if (!Reflect.has(target, name)) {
            return SOCIALBROWSER.set('screen.' + name, value);
        }
        return Reflect.set(target, name, value, receiver);
    },
});

SOCIALBROWSER.remote = {
    clipboard: SOCIALBROWSER.electron.clipboard,
    BrowserWindow: function (_setting) {
        return SOCIALBROWSER.openWindow(_setting);
    },
    getCurrentWindow: function () {
        return SOCIALBROWSER.window;
    },
    screen: SOCIALBROWSER.screen,
};
