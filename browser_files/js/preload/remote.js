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
SOCIALBROWSER._webContents.session = { on: (...params) => SOCIALBROWSER.fn('session.on', ...params), isPersistent: () => SOCIALBROWSER.fn('session.isPersistent') };
SOCIALBROWSER._webContents.devToolsWebContents = { focus: () => SOCIALBROWSER.fn('webContents.devToolsWebContents.focus') };
SOCIALBROWSER._webContents.getPrintersAsync = function () {
    return new Promise((resolve, reject) => {
        resolve(SOCIALBROWSER.fn('webContents.getPrintersAsync'));
    });
};
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
