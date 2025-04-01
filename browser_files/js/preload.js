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

SOCIALBROWSER.propertyList =
    'scripts_files,user_data,user_data_input,sites,preload_list,privateKeyList,googleExtensionList,ad_list,proxy_list,proxy,core,bookmarks,session_list,userAgentList,blocking,video_quality_list,customHeaderList';
if (SOCIALBROWSER.href.indexOf('http://127.0.0.1:60080') === 0) {
    SOCIALBROWSER.propertyList = '*';
}

SOCIALBROWSER.callSync = SOCIALBROWSER.ipcSync = function (channel, value = {}) {
    try {
        if (channel == '[open new popup]' || channel == '[open new tab]') {
            if (typeof value == 'object') {
                value.referrer = value.referrer || document.location.href;
                value.parentSetting = SOCIALBROWSER.customSetting;

                if (value.parentSetting && value.parentSetting.parentSetting) {
                    value.parentSetting.parentSetting = undefined;
                }
            }
        }
        return SOCIALBROWSER.ipcRenderer.sendSync(channel, value);
    } catch (error) {
        console.log(channel, error);
        return undefined;
    }
};

SOCIALBROWSER.invoke = SOCIALBROWSER.ipc = function (channel, value = {}, log = false) {
    if (typeof value == 'object') {
        if (channel == '[open new popup]' || channel == '[open new tab]') {
            value.parentSetting = SOCIALBROWSER.customSetting;
            if (value.parentSetting && value.parentSetting.parentSetting) {
                value.parentSetting.parentSetting = undefined;
            }
        }
        value.windowID = value.windowID || SOCIALBROWSER._window.id;
        value.windowID = parseInt(value.windowID);
        value.processId = SOCIALBROWSER.webContents.getProcessId();
        value.routingId = SOCIALBROWSER.electron.webFrame.routingId;
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
SOCIALBROWSER.fnAsync = function (fn, ...params) {
    return SOCIALBROWSER.ipc('[fn]', { fn: fn, params: params });
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

    SOCIALBROWSER.userAgentBrowserList = SOCIALBROWSER.browserData.userAgentBrowserList;
    SOCIALBROWSER.timeZones = SOCIALBROWSER.browserData.timeZones;
    SOCIALBROWSER.languageList = SOCIALBROWSER.browserData.languageList;
    SOCIALBROWSER.effectiveTypeList = SOCIALBROWSER.browserData.effectiveTypeList;
    SOCIALBROWSER.connectionTypeList = SOCIALBROWSER.browserData.connectionTypeList;
    SOCIALBROWSER.userAgentDeviceList = SOCIALBROWSER.browserData.userAgentDeviceList;

    if (!SOCIALBROWSER.customSetting.iframe && SOCIALBROWSER.isIframe()) {
        delete SOCIALBROWSER;
        return;
    }
    SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/preload/remote.js');

    SOCIALBROWSER.isMemoryMode = !SOCIALBROWSER.webContents.session.isPersistent();
    SOCIALBROWSER.session_id = 0;

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

    SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/preload/init.js');
    SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/preload/event.js');
    SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/preload/fn.js');

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

    SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/preload/load.js');

    if (!SOCIALBROWSER.customSetting.allowSocialBrowser) {
        delete SOCIALBROWSER;
    }
};

SOCIALBROWSER.init = function () {
    let domain = SOCIALBROWSER.hostname.split('.');
    domain = domain.slice(domain.length - 2).join('.');
    SOCIALBROWSER.browserData = SOCIALBROWSER.ipcSync('[browser][data]', {
        url: SOCIALBROWSER.href,
        domain: domain,
        propertyList: SOCIALBROWSER.propertyList,
        windowID: SOCIALBROWSER._window.id,
    });
    SOCIALBROWSER.init2();
};

SOCIALBROWSER._window = SOCIALBROWSER._window || SOCIALBROWSER.ipcSync('[window]');

SOCIALBROWSER._window.fnList.forEach((fn) => {
    SOCIALBROWSER._window[fn] = (...params) => SOCIALBROWSER.fn('window.' + fn, ...params);
});
SOCIALBROWSER._window.on = function () {};
if (SOCIALBROWSER._window.id) {
    if (globalThis) {
        globalThis.SOCIALBROWSER = SOCIALBROWSER;
    } else if (window) {
        window.SOCIALBROWSER = SOCIALBROWSER;
    }
    SOCIALBROWSER.init();
} else {
    console.log('NO WINDOW ID >>>>>>>>>>>>>>>>>>>>>>');
}
