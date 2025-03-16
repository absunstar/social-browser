var SOCIALBROWSER = {
    var: {
        core: { id: '' },
        overwrite: {
            urls: [],
        },
        sites: [],
        session_list: [],
        blocking: {
            javascript: {},
            privacy: { languages: 'en', connection: {} },
            youtube: {},
            social: {},
            popup: { white_list: [] },
        },
        facebook: {},
        white_list: [],
        black_list: [],
        open_list: [],
        preload_list: [],
        context_menu: { dev_tools: true, inspect: true },
        customHeaderList: [],
    },
    navigator: {
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        language: navigator.language,
        languages: navigator.languages,
        connection: navigator.connection,
        MaxTouchPoints: navigator.MaxTouchPoints,
    },
    screen: window.screen,
    connectionTypeList: [
        { name: 'wifi', value: 'wifi' },
        { name: 'wifi', value: 'wifi' },
        { name: 'ethernet', value: 'ethernet' },
        { name: 'mixed', value: 'mixed' },
        { name: 'bluetooth', value: 'bluetooth' },
        { name: 'other', value: 'other' },
        { name: 'unknown', value: 'unknown' },
        { name: 'wimax', value: 'wimax' },
        { name: 'cellular', value: 'cellular' },
    ],
    effectiveTypeList: ['slow-2g', '2g', '3g', '4g'],
    session: {
        name: 'ghost_' + new Date().getTime(),
        display: 'ghost',
        privacy: { languages: 'en', connection: {} },
    },
    menu_list: [],
    video_list: [],
    events: [],
    eventOff: '',
    eventOn: '',
    onEventOFF: [],
    jqueryOff: '',
    jqueryOn: '',
    developerMode: false,
    log: function (...args) {
        if (this.developerMode) {
            console.log(...args);
        }
    },
};

SOCIALBROWSER.random = SOCIALBROWSER.randomNumber = function (min = 1, max = 1000) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

SOCIALBROWSER.require = function (name) {
    try {
        return require(name);
    } catch (error) {
        console.log(error);
    }
};

SOCIALBROWSER.electron = SOCIALBROWSER.require('electron/renderer');
SOCIALBROWSER.ipcRenderer = SOCIALBROWSER.electron.ipcRenderer;
SOCIALBROWSER.contextBridge = SOCIALBROWSER.electron.contextBridge;

SOCIALBROWSER.Buffer = Buffer;

SOCIALBROWSER.eval = function (script) {
    if (typeof script === 'string' || script instanceof Buffer || script instanceof TrustedScript || script instanceof TypedArray || script instanceof DataView) {
        try {
            let path = SOCIALBROWSER.data_dir + '\\sessionData\\' + new Date().getTime() + '_tmp.js';
            SOCIALBROWSER.ipcSync('[write-file]', { path: path, data: script });
            setTimeout(() => {
                SOCIALBROWSER.ipcSync('[delete-file]', path);
            }, 1000 * 3);
            return SOCIALBROWSER.require(path);
        } catch (error) {
            console.log(error);
        }
    }

    return undefined;
};

if (SOCIALBROWSER.customSetting && SOCIALBROWSER.customSetting.webPreferences) {
    SOCIALBROWSER.webPreferences = SOCIALBROWSER.customSetting.webPreferences;
    SOCIALBROWSER.partition = SOCIALBROWSER.webPreferences.partition;
}

SOCIALBROWSER.isIframe = function () {
    return !process.isMainFrame;
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
};

SOCIALBROWSER.origin = document.location.origin;
if (!SOCIALBROWSER.origin || SOCIALBROWSER.origin == 'null') {
    SOCIALBROWSER.origin = document.location.hostname;
}
SOCIALBROWSER.hostname = document.location.hostname || document.location.origin;
SOCIALBROWSER.href = document.location.href;

SOCIALBROWSER.selected_properties =
    'scripts_files,user_data,user_data_input,sites,preload_list,googleExtensionList,ad_list,proxy_list,proxy,core,bookmarks,session_list,userAgentList,blocking,video_quality_list,customHeaderList';
if (SOCIALBROWSER.href.indexOf('http://127.0.0.1:60080') === 0) {
    SOCIALBROWSER.selected_properties = '*';
}

SOCIALBROWSER.callSync = SOCIALBROWSER.ipcSync = function (channel, value = {}) {
    value.parentSetting = SOCIALBROWSER.customSetting;

    if (value.parentSetting && value.parentSetting.parentSetting) {
        value.parentSetting.parentSetting = undefined;
    }
    if (channel == '[open new popup]' || channel == '[open new tab]') {
        value.referrer = value.referrer || document.location.href;
    }
    return SOCIALBROWSER.ipcRenderer.sendSync(channel, value);
};

SOCIALBROWSER.invoke = SOCIALBROWSER.ipc = function (channel, value = {}, log = false) {
    value.parentSetting = SOCIALBROWSER.customSetting;

    value.windowID = value.windowID || SOCIALBROWSER.window.id;
    value.windowID = parseInt(value.windowID);
    value.processId = SOCIALBROWSER.webContents.getProcessId();
    value.routingId = SOCIALBROWSER.electron.webFrame.routingId;

    if (value.parentSetting && value.parentSetting.parentSetting) {
        value.parentSetting.parentSetting = undefined;
    }
    if (log) {
        console.log(value);
    }
    return SOCIALBROWSER.ipcRenderer.invoke(channel, value);
};
SOCIALBROWSER.on = function (name, callback) {
    return SOCIALBROWSER.ipcRenderer.on(name, callback);
};
SOCIALBROWSER.once = function (name, callback) {
    return SOCIALBROWSER.ipcRenderer.once(name, callback);
};
SOCIALBROWSER.off = function (name, callback) {
    return SOCIALBROWSER.ipcRenderer.off(name, callback);
};
SOCIALBROWSER.md5 = function (txt) {
    return SOCIALBROWSER.ipcSync('[md5]', txt);
};

SOCIALBROWSER.get = function (property) {
    return SOCIALBROWSER.ipcSync('[get]', { property: property });
};
SOCIALBROWSER.fn = function (fn, ...params) {
    return SOCIALBROWSER.ipcSync('[fn]', { fn: fn, params: params });
};
SOCIALBROWSER.set = function (property, value) {
    SOCIALBROWSER.ipcSync('[set]', { property: property, value: value });
};
SOCIALBROWSER.setStorage = function (key, value) {
    try {
        if (!key || typeof value === 'undefined') {
            return false;
        }
        value = JSON.stringify(value);
        if (!SOCIALBROWSER.isMemoryMode) {
            window.localStorage.setItem(key, value);
            return true;
        } else if (window.sessionStorage) {
            window.sessionStorage.setItem(key, value);
            return true;
        }
        return false;
    } catch (error) {
        console.warn(error);
        return false;
    }
};
SOCIALBROWSER.getStorage = function (key) {
    try {
        if (!key) {
            return null;
        }
        let value = null;
        if (!SOCIALBROWSER.isMemoryMode) {
            value = window.localStorage.getItem(key);
        } else if (window.sessionStorage) {
            value = window.sessionStorage.getItem(key);
        }
        if (value) {
            value = JSON.parse(value);
        }
        return value;
    } catch (error) {
        console.warn(error);
        return null;
    }
    return null;
};

SOCIALBROWSER.remove = function (key) {
    try {
        if (!key) {
            return false;
        }
        if (!SOCIALBROWSER.isMemoryMode) {
            if (key == '*') {
                window.localStorage.clear();
            } else {
                window.localStorage.removeItem(key);
            }

            return true;
        } else if (window.sessionStorage) {
            if (key == '*') {
                window.sessionStorage.clear();
            } else {
                window.sessionStorage.removeItem(key);
            }
            return true;
        }
        return false;
    } catch (error) {
        console.warn(error);
        return false;
    }
    return false;
};

SOCIALBROWSER.window = SOCIALBROWSER.ipcSync('[window]', { id: 0 }) || {};
SOCIALBROWSER.window.show = () => SOCIALBROWSER.fn('window.show');
SOCIALBROWSER.window.hide = () => SOCIALBROWSER.fn('window.hide');
SOCIALBROWSER.window.maximize = () => SOCIALBROWSER.fn('window.maximize');
SOCIALBROWSER.window.close = () => SOCIALBROWSER.fn('window.close');
SOCIALBROWSER.window.focus = () => SOCIALBROWSER.fn('window.focus');
SOCIALBROWSER.window.destroy = () => SOCIALBROWSER.fn('window.destroy');
SOCIALBROWSER.window.isVisible = () => SOCIALBROWSER.fn('window.isVisible');
SOCIALBROWSER.window.isMinimized = () => SOCIALBROWSER.fn('window.isMinimized');
SOCIALBROWSER.window.setTitle = (title) => SOCIALBROWSER.fn('window.setTitle', title);
SOCIALBROWSER.window.setSkipTaskbar = (status) => SOCIALBROWSER.fn('window.setSkipTaskbar', status);
SOCIALBROWSER.window.setAlwaysOnTop = (status) => SOCIALBROWSER.fn('window.setAlwaysOnTop', status);
SOCIALBROWSER.window.setFullScreen = (status) => SOCIALBROWSER.fn('window.setFullScreen', status);
SOCIALBROWSER.window.setProgressBar = (status) => SOCIALBROWSER.fn('window.setProgressBar', status);

SOCIALBROWSER.webContents = SOCIALBROWSER.ipcSync('[webContents]', { id: 0, zoomFactor: 1 }) || {};

SOCIALBROWSER.webContents.reload = (...params) => SOCIALBROWSER.fn('webContents.reload', ...params);
SOCIALBROWSER.webContents.openDevTools = (...params) => SOCIALBROWSER.fn('webContents.openDevTools', ...params);
SOCIALBROWSER.webContents.inspectElement = (...params) => SOCIALBROWSER.fn('webContents.inspectElement', ...params);
SOCIALBROWSER.webContents.isDevToolsOpened = (...params) => SOCIALBROWSER.fn('webContents.isDevToolsOpened', ...params);
SOCIALBROWSER.webContents.devToolsWebContents = { focus: () => SOCIALBROWSER.fn('webContents.devToolsWebContents.focus') };
SOCIALBROWSER.webContents.setWebRTCIPHandlingPolicy = (...params) => SOCIALBROWSER.fn('webContents.setWebRTCIPHandlingPolicy', ...params);
SOCIALBROWSER.webContents.sendInputEvent = (...params) => SOCIALBROWSER.fn('webContents.sendInputEvent', ...params);
SOCIALBROWSER.webContents.downloadURL = (...params) => SOCIALBROWSER.fn('webContents.downloadURL', ...params);
SOCIALBROWSER.webContents.sendInputEvent = (...params) => SOCIALBROWSER.fn('webContents.sendInputEvent', ...params);
SOCIALBROWSER.webContents.setAudioMuted = (...params) => SOCIALBROWSER.fn('webContents.setAudioMuted', ...params);
SOCIALBROWSER.webContents.cut = (...params) => SOCIALBROWSER.fn('webContents.cut', ...params);
SOCIALBROWSER.webContents.copy = (...params) => SOCIALBROWSER.fn('webContents.copy', ...params);
SOCIALBROWSER.webContents.paste = (...params) => SOCIALBROWSER.fn('webContents.paste', ...params);
SOCIALBROWSER.webContents.delete = (...params) => SOCIALBROWSER.fn('webContents.delete', ...params);
SOCIALBROWSER.webContents.getProcessId = (...params) => SOCIALBROWSER.fn('webContents.getProcessId', ...params);

SOCIALBROWSER.webContents.getPrintersAsync = function () {
    return new Promise((resolve, reject) => {
        resolve(SOCIALBROWSER.fn('webContents.getPrintersAsync'));
    });
};

SOCIALBROWSER.webContents.session = { isPersistent: () => SOCIALBROWSER.fn('session.isPersistent') };

SOCIALBROWSER.isMemoryMode = !SOCIALBROWSER.webContents.session.isPersistent();
SOCIALBROWSER.session_id = 0;

SOCIALBROWSER.init2 = function () {
    SOCIALBROWSER.is_main_data = true;
    SOCIALBROWSER.childProcessID = SOCIALBROWSER.browserData.childProcessID;
    SOCIALBROWSER.child_index = SOCIALBROWSER.browserData.child_index;
    SOCIALBROWSER.customSetting = SOCIALBROWSER.browserData.customSetting;
    SOCIALBROWSER.userAgentData = SOCIALBROWSER.customSetting.userAgentData;
    SOCIALBROWSER.var = SOCIALBROWSER.browserData.var;
    SOCIALBROWSER.dir = SOCIALBROWSER.browserData.dir;
    SOCIALBROWSER.data_dir = SOCIALBROWSER.browserData.data_dir;
    SOCIALBROWSER.files_dir = SOCIALBROWSER.browserData.files_dir;
    SOCIALBROWSER.injectHTML = SOCIALBROWSER.browserData.injectHTML;
    SOCIALBROWSER.injectCSS = SOCIALBROWSER.browserData.injectCSS;
    SOCIALBROWSER.parentAssignWindow = SOCIALBROWSER.browserData.parentAssignWindow;
    SOCIALBROWSER.newTabData = SOCIALBROWSER.browserData.newTabData;
    SOCIALBROWSER.session = { ...SOCIALBROWSER.session, ...SOCIALBROWSER.browserData.session };
    SOCIALBROWSER.partition = SOCIALBROWSER.browserData.partition;

    if (!SOCIALBROWSER.customSetting.iframe && SOCIALBROWSER.isIframe()) {
        delete SOCIALBROWSER;
        return;
    }

    if (!SOCIALBROWSER.partition && SOCIALBROWSER.isMemoryMode) {
        SOCIALBROWSER.partition = 'x-ghost';
    }
    if (SOCIALBROWSER.customSetting.vpc) {
        SOCIALBROWSER.session.privacy = {
            allowVPC: true,
            vpc: SOCIALBROWSER.customSetting.vpc,
        };
    }
    if (!SOCIALBROWSER.session.privacy.allowVPC && SOCIALBROWSER.var.blocking.privacy.allowVPC) {
        SOCIALBROWSER.session.privacy.allowVPC = true;
        SOCIALBROWSER.session.privacy.vpc = { ...SOCIALBROWSER.var.blocking.privacy.vpc };
    }

    SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/init.js');
    SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/event.js');
    SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/fn.js');

    SOCIALBROWSER.isWhiteSite = SOCIALBROWSER.var.blocking.white_list.some((site) => site.url.length > 2 && document.location.href.like(site.url));

    if (SOCIALBROWSER.var.core.id.like('*developer*')) {
        SOCIALBROWSER.developerMode = true;
    }
    SOCIALBROWSER.log(` ... ${document.location.href} ... `);
    if (SOCIALBROWSER.sessionId() == 0 && !SOCIALBROWSER.session.privacy.vpc) {
        SOCIALBROWSER.session.privacy.allowVPC = true;
        SOCIALBROWSER.session.privacy.vpc = SOCIALBROWSER.getStorage('vpc') || SOCIALBROWSER.generateVPC();
        SOCIALBROWSER.setStorage('vpc', SOCIALBROWSER.session.privacy.vpc);
    }

    SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/load.js');

    if (!SOCIALBROWSER.customSetting.allowSocialBrowser) {
        delete SOCIALBROWSER;
    }
};

SOCIALBROWSER.init = function () {
    SOCIALBROWSER.browserData = SOCIALBROWSER.ipcSync('[browser][data]', {
        hostname: SOCIALBROWSER.hostname,
        url: SOCIALBROWSER.href,
        name: SOCIALBROWSER.selected_properties,
        windowID: SOCIALBROWSER.window.id,
        partition: SOCIALBROWSER.partition,
    });
    SOCIALBROWSER.init2();
};

if (globalThis) {
    globalThis.SOCIALBROWSER = SOCIALBROWSER;
}

SOCIALBROWSER.init();
