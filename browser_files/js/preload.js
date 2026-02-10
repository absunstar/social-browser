const SOCIALBROWSER = {
    navigator: {},
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

    session: {
        name: 'ghost_' + new Date().getTime(),
        display: 'ghost',
        privacy: { languages: 'en', connection: {} },
    },
    menu_list: [],
    video_list: [],
    windowOpenList: [],
    events: [],
    eventOff: '',
    eventOn: '',
    onEventOFF: [],
    jqueryOff: '',
    jqueryOn: '',
    isDeveloperMode: function () {
        if (SOCIALBROWSER.from123) {
            return SOCIALBROWSER.var.core.id.contain(SOCIALBROWSER.from123('4218377842387269461837734919325746793191'));
        }
        return false;
    },
    log: function (...args) {
        if (this.isDeveloperMode()) {
            try {
                console.log(...args);
            } catch (error) {
                console.log(error);
            }
        }
    },
};

(function loadCore() {
    if (true) {
        SOCIALBROWSER.escapeRegExp = function (s = '') {
            if (!s) {
                return '';
            }
            if (typeof s !== 'string') {
                s = s.toString();
            }
            return s.replace(/[\/\\^$*+.()\[\]{}]/g, '\\$&');
        };

        if (!String.prototype.test) {
            String.prototype.test = function (reg, flag = 'gium') {
                try {
                    return new RegExp(reg, flag).test(this);
                } catch (error) {
                    return false;
                }
            };
        }

        if (!String.prototype.like) {
            String.prototype.like = function (name) {
                if (typeof name === 'number') {
                    name = name.toString();
                } else if (typeof name !== 'string') {
                    return false;
                }
                let r = false;
                name.split('|').forEach((n) => {
                    n = n.split('*');
                    n.forEach((w, i) => {
                        n[i] = SOCIALBROWSER.escapeRegExp(w);
                    });
                    n = n.join('.*');
                    if (this.test('^' + n + '$', 'gium')) {
                        r = true;
                    }
                });
                return r;
            };
        }

        if (!String.prototype.contain) {
            String.prototype.contain = function (name = '') {
                if (typeof name === 'number') {
                    name = name.toString();
                } else if (typeof name !== 'string') {
                    return false;
                }
                return name.split('|').some((n) => n && this.test('^.*' + SOCIALBROWSER.escapeRegExp(n) + '.*$', 'gium'));
            };
        }
        if (!String.prototype.contains) {
            String.prototype.contains = function (name = '') {
                if (typeof name === 'number') {
                    name = name.toString();
                } else if (typeof name !== 'string') {
                    return false;
                }
                return name.split('|').some((n) => n && this.test('^.*' + SOCIALBROWSER.escapeRegExp(n) + '.*$', 'gium'));
            };
        }
    }
    SOCIALBROWSER.__define = function (o, p, v, op = {}) {
        try {
            o[p] = v;
            if (o.prototype) {
                o.prototype[p] = v;
            }
            Object.defineProperty(o, p, {
                enumerable: !0,
                get: function () {
                    return v;
                },
                ...op,
            });
        } catch (error) {
            SOCIALBROWSER.log(error);
        }
    };
    SOCIALBROWSER.__setConstValue = function (o, p, v) {
        try {
            Object.defineProperty(o, p, {
                get() {
                    return v;
                },
                set(value) {
                    SOCIALBROWSER.log(p + ' !== ', value);
                },
            });
        } catch (error) {
            // SOCIALBROWSER.log(error);
        }
    };
    SOCIALBROWSER.__toString = function (o, v) {
        SOCIALBROWSER.__setConstValue(o, 'toString', () => v);
    };

    SOCIALBROWSER.copyObject =
        SOCIALBROWSER.clone =
        SOCIALBROWSER.cloneObject =
            function (obj, level = 0, maxLevel = 4) {
                try {
                    if (Array.isArray(obj)) {
                        let newArray = [];
                        for (let index = 0; index < obj.length; index++) {
                            newArray[index] = SOCIALBROWSER.cloneObject(obj[index], level + 1, maxLevel);
                        }
                        return newArray;
                    } else if (!obj || typeof obj !== 'object' || obj instanceof Date) {
                        return obj;
                    }

                    let newObject = {};

                    for (const key in obj) {
                        if (Array.isArray(obj[key])) {
                            newObject[key] = obj[key];
                        } else if (typeof obj[key] === 'function') {
                            newObject[key] = obj[key].toString();
                            newObject[key] = newObject[key].slice(newObject[key].indexOf('{') + 1, newObject[key].lastIndexOf('}'));
                        } else if (obj[key] instanceof Date) {
                            newObject[key] = obj[key];
                        } else if (typeof obj[key] === 'object') {
                            if (level < maxLevel) {
                                newObject[key] = SOCIALBROWSER.cloneObject(obj[key], level + 1, maxLevel);
                            } else {
                                newObject[key] = obj[key];
                            }
                        } else {
                            newObject[key] = obj[key];
                        }
                    }
                    return newObject;
                } catch (error) {
                    SOCIALBROWSER.log(error);
                    return obj;
                }
            };

    SOCIALBROWSER.random = SOCIALBROWSER.randomNumber = function (min = 1, max = 1000) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
})();

if ((policy = true)) {
    if (window.trustedTypes) {
        SOCIALBROWSER.policy = window.trustedTypes.createPolicy('social', {
            createHTML: (string) => string,
            createScriptURL: (string) => string,
            createScript: (string) => string,
        });
    } else {
        SOCIALBROWSER.policy = {
            createHTML: (string) => string,
            createScriptURL: (string) => string,
            createScript: (string) => string,
        };
    }
}

SOCIALBROWSER.require = function (path, ...args) {
    try {
        const fn = require(path);

        if (fn instanceof Function) {
            if (args.length > 0) {
                return fn(...args);
            }
            return fn(globalThis.SOCIALBROWSER, window, document);
        } else {
            return fn;
        }
    } catch (error) {
        console.error(error);
        return undefined;
    }
};

SOCIALBROWSER.electron = SOCIALBROWSER.require('electron');
SOCIALBROWSER.ipcRenderer = SOCIALBROWSER.electron.ipcRenderer;
SOCIALBROWSER.contextBridge = SOCIALBROWSER.electron.contextBridge;

SOCIALBROWSER.Buffer = Buffer;

SOCIALBROWSER.newFunction = function (code) {
    try {
        const fn = new Function(code.replace('module.exports = function (', 'function tmp ('))();
        if (typeof fn === 'function') {
            return fn(SOCIALBROWSER, window, document);
        }
        return fn;
    } catch (error) {
        SOCIALBROWSER.log(error, code);
        return 'ERROR';
    }
};

SOCIALBROWSER.eval = function (code, jsFile = false) {
    if (code instanceof Function) {
        code = code.toString();
        code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
    }
    code = 'var SOCIALBROWSER = globalThis.SOCIALBROWSER;' + code;
    try {
        if (SOCIALBROWSER.customSetting.sandbox) {
            SOCIALBROWSER.executeJavaScript(code);
        } else {
            jsFile = true;
            let name = SOCIALBROWSER.md5(SOCIALBROWSER.partition + new Date().getTime().toString() + Math.random().toString());
            let path = SOCIALBROWSER.data_dir + '\\sessionData\\' + name + '_tmp.js';

            SOCIALBROWSER.writeFile({ path: path, data: code });
            let result = SOCIALBROWSER.require(path);
            SOCIALBROWSER.ipcSync('[delete-file]', path);

            return result;
        }
    } catch (error) {
        SOCIALBROWSER.log(error, code);
        return SOCIALBROWSER.executeJavaScript(code);
    }

    return undefined;
};

SOCIALBROWSER.runUserScript = async function (_script) {
    _script.js = await SOCIALBROWSER.handleUserScript(_script.js);
    if (SOCIALBROWSER.isIframe()) {
        if (_script.iframe) {
            if (_script.preload) {
                SOCIALBROWSER.eval(_script.js);
            } else {
                SOCIALBROWSER.onLoad(() => {
                    SOCIALBROWSER.addCSS(_script.css);
                    SOCIALBROWSER.addHTML(_script.html);
                    SOCIALBROWSER.executeJavaScript(_script.js);
                });
            }
        }
    } else {
        if (_script.window) {
            if (_script.preload) {
                SOCIALBROWSER.eval(_script.js);
            } else {
                SOCIALBROWSER.onLoad(() => {
                    SOCIALBROWSER.addCSS(_script.css);
                    SOCIALBROWSER.addHTML(_script.html);
                    SOCIALBROWSER.executeJavaScript(_script.js);
                });
            }
        }
    }
};

SOCIALBROWSER.isIframe = function () {
    return !process.isMainFrame;
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
};

SOCIALBROWSER.process = () => process;

SOCIALBROWSER.hostname = document.location.hostname;
SOCIALBROWSER.origin = document.location.origin || SOCIALBROWSER.hostname;
SOCIALBROWSER.domain = SOCIALBROWSER.hostname.split('.');
SOCIALBROWSER.domain = SOCIALBROWSER.domain.slice(SOCIALBROWSER.domain.length - 2).join('.');
SOCIALBROWSER.domainStorage = SOCIALBROWSER.domain;

SOCIALBROWSER.href = document.location.href;
if (SOCIALBROWSER.href.like('*60080*|browser*')) {
    SOCIALBROWSER.isLocal = true;
}

SOCIALBROWSER.propertyList =
    'download_list,faList,scripts_files,user_data,user_data_input,sites,preload_list,scriptList,privateKeyList,googleExtensionList,ad_list,proxy_list,proxy,core,bookmarks,session_list,userAgentList,blocking,video_quality_list,customHeaderList';

SOCIALBROWSER.callSync = SOCIALBROWSER.ipcSync = function (channel, value = {}, direct = false) {
    try {
        if (direct) {
            return SOCIALBROWSER.ipcRenderer.sendSync(channel, value);
        } else {
            if (typeof value == 'object') {
                // if (SOCIALBROWSER.window) {
                //     value.windowID = value.windowID || SOCIALBROWSER.window.id;
                //     value.windowID = parseInt(value.windowID);
                // }
                // if (SOCIALBROWSER.webContents) {
                //     value.parentFrame = {
                //         processId: SOCIALBROWSER.webContents.getProcessId(),
                //         frameToken: SOCIALBROWSER.electron.webFrame.frameToken,
                //     };
                // }

                if (channel == '[open new popup]' || channel == '[open new tab]') {
                    if (!SOCIALBROWSER.isLocal) {
                        value.referrer = value.referrer || document.location.href;
                    }
                    value = SOCIALBROWSER.cloneObject(value);
                }
            }

            return SOCIALBROWSER.ipcRenderer.sendSync(channel, value);
        }
    } catch (error) {
        SOCIALBROWSER.log(channel, error);
        SOCIALBROWSER.log(value);
        return undefined;
    }
};

SOCIALBROWSER.invoke = SOCIALBROWSER.ipc = function (channel, value = {}, direct = false) {
    if (direct) {
        return SOCIALBROWSER.ipcRenderer.invoke(channel, value);
    } else {
        if (typeof value == 'object') {
            if (SOCIALBROWSER.window) {
                value.windowID = value.windowID || SOCIALBROWSER.window.id;
                value.windowID = parseInt(value.windowID);
            }
            if (SOCIALBROWSER.webContents) {
                value.parentFrame = {
                    processId: SOCIALBROWSER.webContents.getProcessId(),
                    frameToken: SOCIALBROWSER.electron.webFrame.frameToken,
                };
            }

            if (channel == '[open new popup]' || channel == '[open new tab]') {
                if (!SOCIALBROWSER.isLocal) {
                    value.referrer = value.referrer || document.location.href;
                }
                value = SOCIALBROWSER.cloneObject(value);
            }
        }

        return SOCIALBROWSER.ipcRenderer.invoke(channel, value);
    }
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

SOCIALBROWSER.fnAsync = function (fn, ...params) {
    return SOCIALBROWSER.ipc('[fn]', { fn: fn, params: params });
};
SOCIALBROWSER.fn = function (fn, ...params) {
    return SOCIALBROWSER.ipcSync('[fn]', { fn: fn, params: params });
};

SOCIALBROWSER.set = function (property, value) {
    SOCIALBROWSER.ipcSync('[set]', { property: property, value: value });
};
SOCIALBROWSER.get = function (property) {
    return SOCIALBROWSER.ipcSync('[get]', { property: property });
};

SOCIALBROWSER.updateBrowserVar = function (name, data) {
    SOCIALBROWSER.ipc('[update-browser-var]', {
        name: name,
        data: data,
    });
};

SOCIALBROWSER.setStorage = function (key, value, options = {}) {
    let storage = { key: key, value: value, type: typeof value, domain: SOCIALBROWSER.domainStorage, ...options };
    if (storage.type === 'object') {
        storage.value = SOCIALBROWSER.cloneObject(storage.value);
    }

    SOCIALBROWSER.fn('setStorage', storage);
};
SOCIALBROWSER.getStorage = function (key, defaultValue, options = {}) {
    let storage = SOCIALBROWSER.fn('getStorage', { key: key, domain: SOCIALBROWSER.domainStorage, ...options });
    if (storage) {
        defaultValue = storage.value;
    }
    return defaultValue;
};
SOCIALBROWSER.deleteStorage = function (key, options = {}) {
    return SOCIALBROWSER.fn('deleteStorage', { key: key, domain: SOCIALBROWSER.domainStorage, ...options });
};
SOCIALBROWSER.listStorage = function (options = {}) {
    return SOCIALBROWSER.fn('listStorage', { domain: SOCIALBROWSER.domainStorage, ...options });
};
SOCIALBROWSER.listStorageKeys = function (options = {}) {
    return SOCIALBROWSER.fn('listStorageKeys', { domain: SOCIALBROWSER.domainStorage, ...options });
};
SOCIALBROWSER.listStorageValues = function (options = {}) {
    return SOCIALBROWSER.fn('listStorageValues', { domain: SOCIALBROWSER.domainStorage, ...options });
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

SOCIALBROWSER.openNewTab = function (options = {}) {
    if (typeof options === 'string') {
        options = { url: options };
    }
    SOCIALBROWSER.ipc('[open new tab]', {
        referrer: document.location.href,
        url: document.location.href,
        partition: SOCIALBROWSER.partition,
        user_name: SOCIALBROWSER.session.display,
        main_window_id: SOCIALBROWSER.window.id,
        ...options,
    });
    return true;
};
SOCIALBROWSER.openNewPopup = function (options = {}) {
    if (typeof options === 'string') {
        options = { url: options };
    }
    SOCIALBROWSER.ipc('[open new popup]', {
        url: document.location.href,
        show: true,
        alwaysOnTop: true,
        center: true,
        referrer: document.location.href,
        partition: SOCIALBROWSER.partition,
        user_name: SOCIALBROWSER.session.display,
        main_window_id: SOCIALBROWSER.window.id,
        ...options,
    });
    return true;
};

SOCIALBROWSER.selectFile = function (options) {
    return SOCIALBROWSER.ipcSync('[select-file]', options);
};
SOCIALBROWSER.selectSaveFile = function (options) {
    return SOCIALBROWSER.ipcSync('[select-save-file]', options);
};
SOCIALBROWSER.writeFile = function (options) {
    return SOCIALBROWSER.ipcSync('[write-file]', options);
};
SOCIALBROWSER.selectFolder = function () {
    return SOCIALBROWSER.ipcSync('[select-folder]');
};

SOCIALBROWSER.init2 = function () {
    SOCIALBROWSER.isMainBrowserData = true;
    SOCIALBROWSER.childProcessID = SOCIALBROWSER.browserData.childProcessID;
    SOCIALBROWSER.childIndex = SOCIALBROWSER.browserData.childIndex;
    SOCIALBROWSER.uuid = SOCIALBROWSER.browserData.uuid;
    SOCIALBROWSER.var = SOCIALBROWSER.browserData.var;
    SOCIALBROWSER.dir = SOCIALBROWSER.browserData.dir;
    SOCIALBROWSER.data_dir = SOCIALBROWSER.browserData.data_dir;
    SOCIALBROWSER.userDataDir = SOCIALBROWSER.browserData.userDataDir;
    SOCIALBROWSER.files_dir = SOCIALBROWSER.browserData.files_dir;
    SOCIALBROWSER.injectedHTML = SOCIALBROWSER.browserData.injectedHTML;
    SOCIALBROWSER.injectedCSS = SOCIALBROWSER.browserData.injectedCSS;
    SOCIALBROWSER.newTabData = SOCIALBROWSER.browserData.newTabData;
    SOCIALBROWSER.session = { ...SOCIALBROWSER.session, ...SOCIALBROWSER.browserData.session };
    SOCIALBROWSER.partition = SOCIALBROWSER.browserData.partition;
    SOCIALBROWSER._customSetting = SOCIALBROWSER.browserData.customSetting;
    SOCIALBROWSER.userAgentBrowserList = SOCIALBROWSER.browserData.userAgentBrowserList;
    SOCIALBROWSER.timeZones = SOCIALBROWSER.browserData.timeZones;
    SOCIALBROWSER.languageList = SOCIALBROWSER.browserData.languageList;
    SOCIALBROWSER.effectiveTypeList = SOCIALBROWSER.browserData.effectiveTypeList;
    SOCIALBROWSER.connectionTypeList = SOCIALBROWSER.browserData.connectionTypeList;
    SOCIALBROWSER.userAgentDeviceList = SOCIALBROWSER.browserData.userAgentDeviceList;

    SOCIALBROWSER.id = SOCIALBROWSER.var.core.id;

    SOCIALBROWSER.tempMailServer = SOCIALBROWSER.var.core.emails.domain || 'social-browser.com';
    SOCIALBROWSER.userAgentData = SOCIALBROWSER._customSetting.userAgentData || {};
    SOCIALBROWSER.customSetting = new Proxy(SOCIALBROWSER._customSetting, {
        get(target, name, receiver) {
            if (name == '_') {
                return target;
            } else {
                return SOCIALBROWSER.get('customSetting.' + name);
            }
        },
        set(target, name, value, receiver) {
            if (typeof value == 'function') {
                value = value.toString();
                value = value.slice(value.indexOf('{') + 1, value.lastIndexOf('}'));
            }
            return SOCIALBROWSER.set('customSetting.' + name, value);
        },
    });

    SOCIALBROWSER.log(` ... ${document.location.href} ... `);

    if (!SOCIALBROWSER.customSetting.iframe && SOCIALBROWSER.isIframe()) {
        return;
    }

    (function loadEvents() {
        if (true) {
            SOCIALBROWSER.events_list = [];
            SOCIALBROWSER.quee_list = [];
            SOCIALBROWSER.quee_busy_list = [];

            SOCIALBROWSER.quee_check = function (name, fire) {
                if (!fire) {
                    if (SOCIALBROWSER.quee_busy_list[name]) {
                        return;
                    }
                }
                SOCIALBROWSER.quee_busy_list[name] = !0;
                let end = !1;
                SOCIALBROWSER.quee_list.forEach((quee, i) => {
                    if (end) {
                        return;
                    }
                    if (quee.name == name) {
                        end = !0;
                        SOCIALBROWSER.quee_list.splice(i, 1);
                        for (var i = 0; i < SOCIALBROWSER.events_list.length; i++) {
                            var ev = SOCIALBROWSER.events_list[i];
                            if (ev.name == name) {
                                ev.callback(quee.data, quee.callback2, () => {
                                    SOCIALBROWSER.quee_busy_list[name] = !1;
                                    SOCIALBROWSER.quee_check(name, !0);
                                });
                            }
                        }
                    }
                });
                if (!end) {
                    SOCIALBROWSER.quee_busy_list[name] = !1;
                }
            };

            SOCIALBROWSER.onEvent = function (name, callback) {
                if (Array.isArray(name)) {
                    name.forEach((n) => {
                        SOCIALBROWSER.events_list.push({
                            name: n,
                            callback: callback || function () {},
                        });
                    });
                } else {
                    SOCIALBROWSER.events_list.push({
                        name: name,
                        callback: callback || function () {},
                    });
                }
            };

            SOCIALBROWSER.callEvent = function (name, data, callback2) {
                for (var i = 0; i < SOCIALBROWSER.events_list.length; i++) {
                    var ev = SOCIALBROWSER.events_list[i];
                    if (ev.name == name) {
                        ev.callback(data, callback2);
                    }
                }
            };

            SOCIALBROWSER.quee = function (name, data, callback2) {
                SOCIALBROWSER.quee_list.push({
                    name: name,
                    data: data,
                    callback2: callback2,
                });

                SOCIALBROWSER.quee_check(name);
            };

            SOCIALBROWSER.getTelegramBot = function (options) {
                options.fetch = function (endPoint, callback) {
                    SOCIALBROWSER.fetchJson(
                        {
                            url: options.api + endPoint,
                            method: 'POST',
                            redirect: 'follow',
                            body: JSON.stringify(options),
                        },
                        (data) => {
                            if (callback) {
                                callback(data);
                            }
                        },
                    );
                };

                options.sendMessage = function (chatID, message, callback) {
                    if (chatID && message) {
                        options.chatID = chatID;
                        options.message = message;
                        options.fetch('/telegram/send-message');
                    }
                };

                return options;
            };

            SOCIALBROWSER.createTelegramBot = function (options = {}) {
                options.api = 'http://127.0.0.1:60080';
                let bot = SOCIALBROWSER.getTelegramBot(options);
                bot.fetch('/telegram/connect', (data) => {
                    if (callback) {
                        callback(data);
                    } else {
                        SOCIALBROWSER.log(data);
                    }
                });
                return bot;
            };

            SOCIALBROWSER.connectTelegramBot = function (options = {}, callback) {
                options.api = 'https://social-browser.com';
                let bot = SOCIALBROWSER.getTelegramBot(options);
                bot.fetch('/telegram/connect', (data) => {
                    if (callback) {
                        callback(data);
                    } else {
                        SOCIALBROWSER.log(data);
                    }
                });
                return bot;
            };
        }
    })();

    (function loadFn() {
        if (true) {
            SOCIALBROWSER.ws = function (message) {
                SOCIALBROWSER.ipc('ws', message);
            };
            SOCIALBROWSER.share = function (data) {
                SOCIALBROWSER.ipc('share', data);
            };
            SOCIALBROWSER.onShareFnList = [];
            SOCIALBROWSER.onShare = function (fn) {
                SOCIALBROWSER.onShareFnList.push(fn);
            };
            SOCIALBROWSER.on('share', (e, data) => {
                SOCIALBROWSER.onShareFnList.forEach((fn) => {
                    fn(data);
                });
            });

            SOCIALBROWSER.workerCodeString = '';
            SOCIALBROWSER.executeJavaScriptWorker = function (_id, code, url) {
                _id = 'window.' + _id;
                code = code.replaceAll('globalThis', _id + '');
                code = code.replaceAll('window.location', 'location');
                code = code.replaceAll('document.location', 'location');
                code = code.replaceAll('self.trustedTypes', _id + '.trustedTypes');
                code = code.replaceAll('self.postMessage', _id + '.postMessage2');
                code = code.replaceAll('parentPort.postMessage', _id + '.postMessage2');
                code = code.replaceAll('self.onmessage', _id + '.onmessage2');
                code = code.replaceAll('self', _id + '');
                code = code.replaceAll('parentPort', _id + '');
                code = code.replaceAll('debugger;', ' ');
                code = code.replaceAll('var ', 'let ');

                code = code.replaceAll(_id + '.' + _id, _id);
                code = code + ';if(onmessage) { ' + _id + '.onmessage2 = onmessage; }';
                code = code + ';SOCIALBROWSER.showUserMessage("Web Worker Detected <p><a>' + url + '</a></p>")';
                code = `${_id}._ =  function(window , unsafeWindow , location  , postMessage ){ try { ${code} } catch (err) {globalThis.SOCIALBROWSER.alert(err)} };${_id}._(${_id}  , window , ${_id}.location  , ${_id}.postMessage2);`;
                SOCIALBROWSER.workerCodeString += code + '\n//# sourceURL=' + url + '\n';

                SOCIALBROWSER.executeJavaScript(code)
                    .then(() => {
                        // SOCIALBROWSER.showUserMessage('Worker Done : ' + _id);
                    })
                    .catch((e) => {
                        SOCIALBROWSER.alert(e);
                    });
            };
            SOCIALBROWSER.serviceWorker = navigator.serviceWorker;

            window.Worker0 = window.Worker;
            SOCIALBROWSER.workerlist = [];
            SOCIALBROWSER.newWorkerURLs = [];
            SOCIALBROWSER.newWorker = function (url, options, _worker, codeString = null) {
                if (url && SOCIALBROWSER.newWorkerURLs.some((u) => u == url)) {
                    let index = SOCIALBROWSER.workerlist.findIndex((w) => w.url == url);
                    if (index !== -1) {
                        SOCIALBROWSER.workerlist[index].terminate();
                        SOCIALBROWSER.workerlist.splice(index, 1);
                    }
                    SOCIALBROWSER.showUserMessage('Dublicate Web Worker Detected <br>' + url);
                    return new window.Worker0(url, options, _worker);
                }
                SOCIALBROWSER.newWorkerURLs.push(url);

                if (!codeString && SOCIALBROWSER.var.blocking.javascript.allowWorkerByVideo && document.querySelector('video')) {
                    SOCIALBROWSER.showUserMessage('Web Worker video Detected <br>' + url);
                    return new window.Worker0(url, options, _worker);
                }

                if (SOCIALBROWSER.allowDefaultWorker) {
                    return new window.Worker0(url, options, _worker);
                }

                SOCIALBROWSER.showUserMessage('New Worker Running <p>' + url + '</p>');

                if (codeString) {
                    return SOCIALBROWSER.openWindow({
                        isWorker: true,
                        url: 'browser://newTab',
                        show: false,
                        eval: () => {
                            SOCIALBROWSER.eval(codeString);
                        },
                    });
                } else {
                    if (url instanceof URL) {
                        url = url.href;
                    } else {
                        url = SOCIALBROWSER.handleURL(url.toString());
                    }

                    if (options && options.type == 'module') {
                        SOCIALBROWSER.showUserMessage('New Module Worker Running <p>' + url + '</p>');
                    }

                    let win = SOCIALBROWSER.openWindow({
                        isWorker: true,
                        url: url,
                        show: false,

                        eval: () => {
                            SOCIALBROWSER.onLoad(() => {
                                let code = document.querySelector('body pre')?.textContent;
                                if (code) {
                                    code = code
                                        .replaceAll('self.importScripts', 'importScripts')
                                        .replaceAll('document', 'undefined')
                                        .replaceAll('debugger;', '')
                                        .replaceAll('importScripts', 'await importScripts');
                                    code = '(async()=>{' + code + '})()';
                                    document.querySelector('body pre').textContent = code;
                                    if (code.contain('import*as ')) {
                                        SOCIALBROWSER.addJS(code, { type: 'module' });
                                    } else {
                                        SOCIALBROWSER.eval(code);
                                    }
                                }
                            });
                        },
                    });

                    let newWorker = Object.create(Worker.prototype);
                    newWorker.url = url;
                    newWorker.postMessage = win.postMessage;
                    newWorker.terminate = win.terminate;
                    newWorker.on = newWorker.addEventListener = win.addEventListener;
                    newWorker.removeEventListener = win.removeEventListener;
                    win.defaultWorker = newWorker;
                    SOCIALBROWSER.workerlist.push(newWorker);
                    return newWorker;
                }

                let workerID = 'worker_' + SOCIALBROWSER.md5(url) + '_';

                if (!codeString && !SOCIALBROWSER.var.blocking.javascript.block_window_worker) {
                    if (url.indexOf('blob:') === 0) {
                        let blob = SOCIALBROWSER.blobObjectList.find((o) => o.url == url);
                        if (blob && blob.object && blob.object.type.contains('javascript')) {
                            blob.object
                                .text()
                                .then((code) => {
                                    if (code) {
                                        let _id = _worker ? _worker.id : workerID;
                                        globalThis[workerID] = SOCIALBROWSER.openWindow({
                                            show: true,
                                            url: url,
                                            eval: code,
                                        });
                                        //  SOCIALBROWSER.executeJavaScriptWorker(_id, code, url);
                                    } else {
                                        globalThis[workerID] = new window.Worker0(url, options, _worker);
                                    }
                                })
                                .catch((e) => {
                                    SOCIALBROWSER.log(e);
                                    globalThis[workerID] = new window.Worker0(url, options, _worker);
                                });
                        } else {
                            globalThis[workerID] = new window.Worker0(url, options, _worker);
                            return globalThis[workerID];
                        }
                    } else {
                        fetch(url)
                            .then((response) => response.text())
                            .then((code) => {
                                SOCIALBROWSER.workerCodeString += code + '\n//# First sourceURL=' + url + '\n';
                                let _id = _worker ? _worker.id : workerID;
                                globalThis[_id] = SOCIALBROWSER.openWindow({
                                    url: url,
                                    show: true,
                                    eval: () => {
                                        SOCIALBROWSER.onLoad(() => {
                                            SOCIALBROWSER.eval(document.querySelector('body pre').textContent);
                                        });
                                    },
                                });
                                // SOCIALBROWSER.executeJavaScriptWorker(_id, code, url);
                            });
                    }
                } else {
                    if (codeString) {
                        let _id = _worker ? _worker.id : workerID;
                        SOCIALBROWSER.executeJavaScriptWorker(_id, codeString, url);
                    }
                }

                return globalThis[workerID];

                if (_worker) {
                    return _worker;
                } else {
                    globalThis[workerID] = Object.create(Worker.prototype);
                    let worker2 = {
                        id: workerID,
                        url: url,
                        on: function () {},
                        fnEventList: [],
                        addEventListener: function (name, fn) {
                            this.fnEventList.push({ name: name, fn: fn });
                        },
                        removeEventListener: function () {},
                        importScripts: function (...args2) {
                            args2.forEach((arg) => {
                                SOCIALBROWSER.log('Import Script : ' + arg);
                                new Worker(arg, null, globalThis[workerID]);
                            });
                        },
                        terminate: function () {},
                        postMessage: function (data) {
                            this.fnEventList.forEach((e) => {});
                            if (globalThis[workerID].onmessage2) {
                                globalThis[workerID].onmessage2({ data: data });
                            } else {
                                setTimeout(() => {
                                    globalThis[workerID].postMessage(data);
                                }, 500);
                            }
                        },
                        postMessage2: function (data) {
                            if (globalThis[workerID].onmessage) {
                                globalThis[workerID].onmessage({ data: data });
                            } else {
                                setTimeout(() => {
                                    globalThis[workerID].postMessage2(data);
                                }, 500);
                            }
                        },
                        onmessage: function () {
                            SOCIALBROWSER.log('Worker onmessage', args);
                        },
                        terminate: function () {},
                    };

                    for (const key in worker2) {
                        try {
                            if (!globalThis[workerID][key]) {
                                globalThis[workerID][key] = worker2[key];
                            }
                        } catch (error) {
                            SOCIALBROWSER.log(error, key);
                        }
                    }

                    let loc = new URL(globalThis[workerID].url);
                    globalThis[workerID].location = loc;
                    SOCIALBROWSER.__setConstValue(globalThis[workerID], 'location', {
                        protocol: loc.protocol,
                        host: loc.host,
                        hostname: loc.hostname,
                        origin: loc.origin,
                        port: loc.port,
                        pathname: loc.pathname,
                        hash: loc.hash,
                        search: loc.search,
                        href: globalThis[workerID].url,
                        toString: function () {
                            return globalThis[workerID].url;
                        },
                    });
                    SOCIALBROWSER.__setConstValue(globalThis[workerID], 'window', {});
                    SOCIALBROWSER.__setConstValue(globalThis[workerID], 'document', {});
                    SOCIALBROWSER.__setConstValue(globalThis[workerID], 'trustedTypes', window.trustedTypes);

                    globalThis.importScripts = globalThis[workerID].importScripts;
                    return globalThis[workerID];
                }
            };
            SOCIALBROWSER.executeJavaScriptCodeInWorker = function (url, codeString) {
                return SOCIALBROWSER.newWorker(url, null, null, codeString);
            };

            SOCIALBROWSER.sendMessage = function (message) {
                if (typeof message !== 'object') {
                    message = { name: message };
                }

                message.windowID = message.windowID || SOCIALBROWSER.window.id;
                SOCIALBROWSER.ipc('[child-message]', message);
            };
            SOCIALBROWSER.onMessageFnList = [];
            SOCIALBROWSER.onMessage = function (fn) {
                SOCIALBROWSER.onMessageFnList.push(fn);
            };
            SOCIALBROWSER.on('[child-message]', (e, message) => {
                if (message.eval) {
                    SOCIALBROWSER.eval(message.eval);
                }

                SOCIALBROWSER.onMessageFnList.forEach((fn) => {
                    fn(message);
                });
            });

            SOCIALBROWSER.on('[run-user-script]', (e, _script) => {
                SOCIALBROWSER.runUserScript(_script);
            });

            SOCIALBROWSER.toJson = (obj) => {
                if (typeof obj === undefined || obj === null) {
                    return '';
                }
                return JSON.stringify(obj);
            };

            SOCIALBROWSER.fromJson = (str) => {
                if (typeof str !== 'string') {
                    return str;
                }
                return JSON.parse(str);
            };

            SOCIALBROWSER.toBase64 = (str) => {
                return SOCIALBROWSER.ipcSync('[toBase64]', str);
            };

            SOCIALBROWSER.fromBase64 = (str) => {
                return SOCIALBROWSER.ipcSync('[fromBase64]', str);
            };

            SOCIALBROWSER.to123 = (data) => {
                data = typeof data === 'object' ? SOCIALBROWSER.toJson(data) : data;
                return SOCIALBROWSER.ipcSync('[to123]', data);
            };

            SOCIALBROWSER.from123 = (data) => {
                return SOCIALBROWSER.ipcSync('[from123]', data);
            };

            SOCIALBROWSER.hideObject = (obj) => {
                return SOCIALBROWSER.to123(obj);
            };
            SOCIALBROWSER.showObject = (obj) => {
                return JSON.parse(SOCIALBROWSER.from123(obj));
            };
            SOCIALBROWSER.typeOf = SOCIALBROWSER.typeof = function type(elem) {
                return Object.prototype.toString.call(elem).slice(8, -1);
            };
            SOCIALBROWSER.encryptText = function (text, password = '^^') {
                if (text && password && typeof text == 'string' && typeof password == 'string') {
                    return SOCIALBROWSER.ipcSync('[encryptText]', { text: text, password, password });
                }
            };
            SOCIALBROWSER.decryptText = function (text, password = '^^') {
                if (text && password && typeof text == 'string' && typeof password == 'string') {
                    return SOCIALBROWSER.ipcSync('[decryptText]', { text: text, password, password });
                }
            };

            SOCIALBROWSER.scope = function (selector = '[ng-controller]') {
                return angular.element(document.querySelector(selector)).scope();
            };

            SOCIALBROWSER.openExternal = function (link) {
                return SOCIALBROWSER.ipc('[open-external]', { link: link });
            };
            SOCIALBROWSER.exec = function (cmd) {
                return SOCIALBROWSER.ipc('[exec]', { cmd: cmd });
            };
            SOCIALBROWSER.exe = function (cmd, args = []) {
                return SOCIALBROWSER.ipc('[exe]', { cmd: cmd, args: args });
            };
            SOCIALBROWSER.kill = function (name) {
                return SOCIALBROWSER.ipc('[kill]', { name: name });
            };

            SOCIALBROWSER.isNativeFunction = function (f) {
                return f.toString().includes('[native code]');
            };
            SOCIALBROWSER.$downloadURL = function (url, name) {
                const link = document.createElement('a');
                link.href = url;
                link.download = name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            SOCIALBROWSER.$screenshot = async function (options = {}, callback) {
                return new Promise((resolve, reject) => {
                    try {
                        SOCIALBROWSER.customSetting.allowAllPermissions = true;
                        let mediaDevices = navigator.mediaDevices0 || navigator.mediaDevices;
                        mediaDevices.getDisplayMedia({ video: true }).then((captureStream) => {
                            const video = document.createElement('video');
                            video.srcObject = captureStream;
                            video.autoplay = true;

                            video.onloadedmetadata = () => {
                                const canvas = document.createElement('canvas');
                                canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;
                                const context = canvas.getContext('2d');
                                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                                const imageDataURL = canvas.toDataURL('image/png');
                                SOCIALBROWSER.$downloadURL(imageDataURL, 'screenshot-' + SOCIALBROWSER.domain + '-' + new Date().getTime() + '.png');
                                captureStream.getTracks().forEach((track) => track.stop());

                                resolve({ imageDataURL: imageDataURL });
                                SOCIALBROWSER.showUserMessage('ScreenShot Saved <br><img src="' + imageDataURL + '" />', 1000 * 5);
                            };
                        });
                    } catch (err) {
                        reject(err);
                        console.error('Error $screenshot screen : ', err);
                        SOCIALBROWSER.customSetting.allowAllPermissions = false;
                    }
                });
            };
            SOCIALBROWSER.addSession = function (session) {
                if (SOCIALBROWSER.var.session_list.length > SOCIALBROWSER.var.core.browser.maxProfiles) {
                    let msg = 'Max Profiles Reached : ' + SOCIALBROWSER.var.core.browser.maxProfiles;
                    SOCIALBROWSER.showUserMessage(msg);
                    SOCIALBROWSER.alert(msg);
                    return null;
                }

                if (typeof session == 'string') {
                    session = {
                        display: session,
                    };
                    session.name = 'persist:' + SOCIALBROWSER.md5(session.display);
                }
                if (!session.name && session.display) {
                    session.name = 'persist:' + SOCIALBROWSER.md5(session.display);
                }

                if (session.name && session.display) {
                    if (!session.name.like('persist*')) {
                        session.name = 'persist:' + session.name;
                    }
                    let oldSession = SOCIALBROWSER.var.session_list.find((s) => s.name == session.name || s.display == session.display);
                    if (oldSession) {
                        let msg = 'Profile Exists <br> ' + oldSession.display;
                        SOCIALBROWSER.showUserMessage(msg);
                        SOCIALBROWSER.alert(msg);
                        return oldSession;
                    }

                    session.can_delete = true;
                    session.time = session.time || new Date().getTime();

                    if (!session.privacy) {
                        session.privacy = {
                            allowVPC: true,
                            vpc: SOCIALBROWSER.generateVPC('pc'),
                        };
                    }

                    if (!session.defaultUserAgent) {
                        session.defaultUserAgent = SOCIALBROWSER.getRandomBrowser('pc');
                    }

                    SOCIALBROWSER.ws({ type: '[add-session]', session: session });
                }

                return session;
            };

            SOCIALBROWSER.removeSession = SOCIALBROWSER.deleteSession = function (session) {
                if (typeof session == 'string') {
                    session = {
                        display: session,
                    };
                }

                SOCIALBROWSER.ws({ type: '[remove-session]', session: session });

                return session;
            };
            SOCIALBROWSER.hideSession = function (session) {
                if (typeof session == 'string') {
                    session = {
                        display: session,
                    };
                }

                SOCIALBROWSER.ws({ type: '[hide-session]', session: session });

                return session;
            };
            SOCIALBROWSER.add2faCode = function (fa) {
                if (typeof fa == 'string') {
                    let password = SOCIALBROWSER.var.user_data_input.find((d) => d.partition == SOCIALBROWSER.partition && d.hostname.contains(SOCIALBROWSER.domain));
                    if (password) {
                        password = password.password;
                    }
                    if (!password) {
                        password = SOCIALBROWSER.var.core.emails.password;
                    }
                    fa = {
                        code: fa,
                        domain: SOCIALBROWSER.domain,
                        partition: SOCIALBROWSER.partition,
                        email: SOCIALBROWSER.session.display,
                        password: password,
                    };
                }

                SOCIALBROWSER.ws({ type: '[add-fa]', fa: fa });

                return fa;
            };
            SOCIALBROWSER.fetch = function (options, callback) {
                if (typeof options == 'string') {
                    options = { url: options };
                }
                options.id = new Date().getTime() + Math.random();
                options.url = SOCIALBROWSER.handleURL(options.url);

                return new Promise((resolve, reject) => {
                    let newOptions = SOCIALBROWSER.cloneObject(options);
                    SOCIALBROWSER.ipc('[fetch]', newOptions).then((data) => {
                        if (data) {
                            data.responseText = data.body;
                            if (options.onload) {
                                options.onload(data);
                            }
                            if (callback) {
                                callback(data);
                            }

                            resolve(data);
                        }
                    });
                });
            };
            SOCIALBROWSER.fetchJson = function (options, callback) {
                if (typeof options == 'string') {
                    options = {
                        url: options,
                    };
                }
                options.id = new Date().getTime() + Math.random();
                options.url = SOCIALBROWSER.handleURL(options.url);

                return new Promise((resolve, reject) => {
                    SOCIALBROWSER.ipc('[fetch-json]', options).then((data) => {
                        if (data) {
                            if (callback) {
                                callback(data);
                            } else {
                                resolve(data);
                            }
                        }
                    });
                });
            };

            SOCIALBROWSER.getIPinformation = function (ip) {
                if (ip) {
                    return SOCIALBROWSER.$fetch('http://ip-api.com/json/' + ip + '?fields=status,message,country,regionName,city,zip,lat,lon,timezone,query', { method: 'get' }).then((res) =>
                        res.json(),
                    );
                } else {
                    return SOCIALBROWSER.$fetch('http://ip-api.com/json').then((res) => res.json());
                }
            };

            SOCIALBROWSER.fetch2Captcha_request = function (options) {
                if (options.version == '2') {
                    SOCIALBROWSER.$setValue('#g-recaptcha-response', options.request).then(() => {
                        SOCIALBROWSER.log('Captcha Response Set');
                        SOCIALBROWSER.sendMessage({ name: '[user-message]', message: 'Captcha Solved' });
                        SOCIALBROWSER.sendMessage({ name: 'captcha_solved', response: request });
                    });
                } else if (options.version == '3') {
                    SOCIALBROWSER.$setValue('#g-recaptcha-response', options.request);
                    SOCIALBROWSER.sendMessage({ name: '[user-message]', message: 'Captcha Solved' });
                    SOCIALBROWSER.sendMessage({ name: 'captcha_solved', response: options.request });
                }
            };

            SOCIALBROWSER.fetch2Captcha_res = function (options) {
                SOCIALBROWSER.log(options);
                if (SOCIALBROWSER.fetch2Captcha_res_busy) {
                    return;
                }

                SOCIALBROWSER.fetch2Captcha_res_busy = true;
                SOCIALBROWSER.$every(5000, (interval) => {
                    SOCIALBROWSER.sendMessage({ name: '[user-message]', message: 'Captcha Geting Reponse' });
                    SOCIALBROWSER.$fetch(options.url, {
                        method: 'GET',
                        payload: options.payload,
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            SOCIALBROWSER.log(res);

                            if (res.status == 1) {
                                SOCIALBROWSER.fetch2Captcha_res_busy = false;
                                clearInterval(interval);
                                SOCIALBROWSER.tokenFrom2Captcha = res.request;
                                SOCIALBROWSER.sendMessage({ name: '2captcha_request', request: res.request, api_key: options.payload.key, version: options.version });
                                setTimeout(() => {
                                    let reportbadUrl = `https://2captcha.com/res.php?key=${options.payload.key}&action=reportbad&id=${options.payload.id}&json=1`;
                                    SOCIALBROWSER.$fetch(reportbadUrl)
                                        .then((res) => res.json())
                                        .then((data) => SOCIALBROWSER.log(data));
                                }, 1000 * 20);
                            }
                        });
                });
            };

            SOCIALBROWSER.fetch2Captcha_in = function (options) {
                if (SOCIALBROWSER.fetch2Captcha_in_busy) {
                    return;
                }
                SOCIALBROWSER.sendMessage({ name: '[user-message]', message: 'Captcha Start Solving' });

                SOCIALBROWSER.fetch2Captcha_in_busy = true;

                SOCIALBROWSER.$fetch(options.url, {
                    method: 'POST',
                    payload: options.payload,
                })
                    .then((res) => res.json())
                    .then((res) => {
                        let requestID = '';
                        SOCIALBROWSER.log(res);
                        requestID = res.request;

                        if (requestID) {
                            let checkResultUrl = 'https://2captcha.com/res.php';
                            let payload = {
                                key: options.payload.key,
                                action: 'get',
                                id: requestID,
                                json: 1,
                            };

                            SOCIALBROWSER.sendMessage({ name: '2captcha_res', url: checkResultUrl, version: options.version, payload: payload });
                        }
                    });
            };

            SOCIALBROWSER.run2Captcha = function () {
                if (!SOCIALBROWSER.customSetting.captcha2ApiKey && (!SOCIALBROWSER.var.blocking.javascript.captcha2ON || !SOCIALBROWSER.var.blocking.javascript.captcha2ApiKey)) {
                    return;
                }
                SOCIALBROWSER.log('2 Captcha Enabled');

                if (!SOCIALBROWSER.isIframe()) {
                    SOCIALBROWSER.$every(100, (interval) => {
                        if (typeof grecaptcha !== 'undefined' && grecaptcha.execute) {
                            SOCIALBROWSER.showUserMessage('grecaptcha.execute Detected');
                            clearInterval(interval);
                            grecaptcha.execute0 = grecaptcha.execute;
                            grecaptcha.execute = function (sitekey, options = { action: '' }) {
                                SOCIALBROWSER.showUserMessage('grecaptcha.execute called');
                                return new Promise((resolve, reject) => {
                                    if (SOCIALBROWSER.isRecaptchaV3) {
                                        if (!SOCIALBROWSER.tokenFrom2Captcha) {
                                            let pageurl = SOCIALBROWSER.window.getURL();
                                            let API_KEY = SOCIALBROWSER.customSetting.captcha2ApiKey || SOCIALBROWSER.var.blocking.javascript.captcha2ApiKey;
                                            let byPassUrl = 'https://2captcha.com/in.php';
                                            let payload = {
                                                key: API_KEY,
                                                method: 'userrecaptcha',
                                                googlekey: sitekey,
                                                pageurl: pageurl,
                                                version: 'v3',
                                                action: options.action,
                                                min_score: 0.9,
                                                json: 1,
                                            };
                                            SOCIALBROWSER.sendMessage({ name: '2captcha_in', url: byPassUrl, version: '3', payload: payload });
                                            SOCIALBROWSER.onMessage((message) => {
                                                if (message.name == 'captcha_solved') {
                                                    resolve(SOCIALBROWSER.tokenFrom2Captcha);
                                                }
                                            });
                                        } else {
                                            grecaptcha.execute0(sitekey, options).then((token) => {
                                                SOCIALBROWSER.log('grecaptcha.execute token received', token);
                                                resolve(token);
                                            });
                                        }
                                    } else {
                                        grecaptcha.execute0(sitekey, options).then((token) => {
                                            SOCIALBROWSER.log('grecaptcha.execute token received', token);
                                            resolve(token);
                                        });
                                    }
                                });
                            };
                        }
                    });

                    SOCIALBROWSER.onLoad().then(() => {
                        SOCIALBROWSER.log('run2Captcha Check ...');

                        SOCIALBROWSER.showUserMessage('2Captcha Worked <br> Solving recaptcha', 1000 * 10);
                        SOCIALBROWSER.isRecaptchaV2 = document.querySelector('div.g-recaptcha');

                        if (SOCIALBROWSER.isRecaptchaV2) {
                            SOCIALBROWSER.showUserMessage('reCAPTCHA v2 detected');
                        }

                        SOCIALBROWSER.isRecaptchaV3 = document.querySelector('.grecaptcha-badge') !== null;

                        if (SOCIALBROWSER.isRecaptchaV3) {
                            SOCIALBROWSER.showUserMessage('reCAPTCHA v3 detected');
                        }

                        function getSiteKey() {
                            let reCaptcha = document.querySelector('.g-recaptcha');
                            if (reCaptcha) {
                                reCaptcha.dataset.sitekey;
                            }

                            const element = document.querySelector('[data-sitekey]');
                            if (element) {
                                return element.getAttribute('data-sitekey');
                            }

                            let _url = document.location.href;
                            try {
                                const url = new URL(_url);
                                const k = url.searchParams.get('k');
                                if (k) return k;
                            } catch (e) {
                                SOCIALBROWSER.log(e);
                            }

                            const iframes = document.querySelectorAll('iframe[src*="recaptcha/api2/anchor"], iframe[src*="recaptcha/enterprise/anchor"]');
                            for (let i = 0; i < iframes.length; i++) {
                                const src = iframes[i].src;
                                try {
                                    const url = new URL(src);
                                    const k = url.searchParams.get('k');
                                    if (k) return k;
                                } catch (e) {
                                    SOCIALBROWSER.log(e);
                                }
                            }

                            return null;
                        }

                        SOCIALBROWSER.sitekey = getSiteKey();

                        if (SOCIALBROWSER.isRecaptchaV2 && SOCIALBROWSER.sitekey) {
                            let pageurl = SOCIALBROWSER.window.getURL();
                            let API_KEY = SOCIALBROWSER.customSetting.captcha2ApiKey || SOCIALBROWSER.var.blocking.javascript.captcha2ApiKey;
                            let byPassUrl = 'https://2captcha.com/in.php';
                            let payload = {
                                key: API_KEY,
                                method: 'userrecaptcha',
                                googlekey: SOCIALBROWSER.sitekey,
                                pageurl: pageurl,
                                json: 1,
                            };
                            SOCIALBROWSER.sendMessage({ name: '2captcha_in', byPassUrl: byPassUrl, version: '2', payload: payload });
                        } else if (SOCIALBROWSER.isRecaptchaV3 && SOCIALBROWSER.sitekey) {
                        } else {
                            SOCIALBROWSER.log('Captcha sitekey not exists');
                        }
                    });
                }
            };

            SOCIALBROWSER.rand = {
                noise: function () {
                    let result;
                    let font_noise = SOCIALBROWSER.getStorage('font_noise');
                    if (font_noise) {
                        result = font_noise;
                    } else {
                        let SIGN = Math.random() < Math.random() ? -1 : 1;
                        result = Math.floor(Math.random() + SIGN * Math.random());
                        SOCIALBROWSER.setStorage('font_noise', result);
                    }
                    return result;
                },
                sign: function () {
                    const tmp = [-1, -1, -1, -1, -1, -1, +1, -1, -1, -1];
                    let index;
                    let font_sign = SOCIALBROWSER.getStorage('font_sign');
                    if (font_sign) {
                        index = font_sign;
                    } else {
                        index = Math.floor(Math.random() * tmp.length);
                        SOCIALBROWSER.setStorage('font_sign', index);
                    }

                    return tmp[index];
                },
            };

            SOCIALBROWSER.nativeImage = function (_path) {
                try {
                    if (!_path) {
                        return null;
                    }
                    return SOCIALBROWSER.electron.nativeImage.createFromPath(_path);
                } catch (error) {
                    SOCIALBROWSER.log('nativeImage', error);
                    return null;
                }
            };
            SOCIALBROWSER.shuffleArray = function (array) {
                let index = -1;
                const length = array.length;
                const lastIndex = length - 1;
                while (++index < length) {
                    const rand = random(index, lastIndex);
                    [array[index], array[rand]] = [array[rand], array[index]];
                }
                return array;
            };

            SOCIALBROWSER.onLoad = SOCIALBROWSER.onload = function (fn) {
                return new Promise((resolve, reject) => {
                    if (document.readyState !== 'loading') {
                        resolve();
                        if (typeof fn === 'function') {
                            fn();
                        }
                    } else {
                        document.addEventListener('DOMContentLoaded', () => {
                            resolve();
                            if (typeof fn === 'function') {
                                fn();
                            }
                        });
                    }
                });
            };

            SOCIALBROWSER.timeOffset = new Date().getTimezoneOffset();

            SOCIALBROWSER.guid = function () {
                return SOCIALBROWSER.md5(SOCIALBROWSER.partition + SOCIALBROWSER.domain + SOCIALBROWSER.var.core.id);
            };

            SOCIALBROWSER.maxOf = function (num, max) {
                if (num == 0) {
                    num = SOCIALBROWSER.random(0, max);
                }
                if (num > max) {
                    num = num - max;
                    return SOCIALBROWSER.maxOf(num, max);
                }
                return num;
            };
            SOCIALBROWSER.sessionId = function () {
                if (SOCIALBROWSER.session_id) {
                    return SOCIALBROWSER.session_id;
                }

                SOCIALBROWSER.session_id = SOCIALBROWSER.var.session_list.findIndex((s) => s.name == SOCIALBROWSER.partition) + 1;
                return SOCIALBROWSER.session_id;
            };

            SOCIALBROWSER.addMenu = function (_menuItem) {
                SOCIALBROWSER.menu_list.push(_menuItem);
            };

            SOCIALBROWSER.removeMenu = function (_menuItem) {
                let index = SOCIALBROWSER.menu_list.findIndex((m) => m.label == _menuItem.label);
                if (index !== -1) {
                    SOCIALBROWSER.menu_list.splice(index, 1);
                }
            };
            SOCIALBROWSER.readFile = function (path) {
                return SOCIALBROWSER.ipcSync('[read-file]', path);
            };

            SOCIALBROWSER.addHTML = SOCIALBROWSER.addhtml = function (code) {
                try {
                    let body = document.body || document.documentElement;
                    if (body && code) {
                        let _div = document.createElement('div');
                        _div.id = '_div_' + SOCIALBROWSER.md5(code);
                        _div.innerHTML = SOCIALBROWSER.policy.createHTML(code);
                        _div.nonce = 'social';
                        if (!document.querySelector('#' + _div.id)) {
                            body.appendChild(_div);
                        }
                        return _div;
                    }
                } catch (error) {
                    SOCIALBROWSER.log(error);
                }
            };
            SOCIALBROWSER.addJS = SOCIALBROWSER.addjs = function (code, options = {}) {
                try {
                    let body = document.body || document.head || document.documentElement;
                    if (body && code) {
                        let _script = document.createElement('script');
                        _script.id = '_script_' + SOCIALBROWSER.md5(code);
                        _script.textContent = SOCIALBROWSER.policy.createScript(code);
                        _script.nonce = 'social';
                        for (const key in options) {
                            _script[key] = options[key];
                        }
                        if (!document.querySelector('#' + _script.id)) {
                            body.appendChild(_script);
                        }
                        return _script;
                    }
                } catch (error) {
                    SOCIALBROWSER.log(error, code);
                    SOCIALBROWSER.executeJavaScript(code);
                }
            };
            SOCIALBROWSER.addJSURL = function (url) {
                return new Promise((resolve, reject) => {
                    try {
                        let body = document.head || document.body || document.documentElement;
                        if (body && url) {
                            url = SOCIALBROWSER.handleURL(url);
                            let _script = document.createElement('script');
                            _script.id = '_script_' + SOCIALBROWSER.md5(url);
                            _script.src = SOCIALBROWSER.policy.createScriptURL(url);
                            _script.nonce = 'social';
                            if (!document.querySelector('#' + _script.id)) {
                                body.appendChild(_script);
                            }
                            _script.onload = function () {
                                resolve(true);
                            };
                            _script.onerror = function (e) {
                                reject(e);
                            };
                        }
                    } catch (error) {
                        reject(error);
                        SOCIALBROWSER.log(error);
                    }
                });
            };
            SOCIALBROWSER.addCSS = SOCIALBROWSER.addcss = function (code) {
                try {
                    let body = document.head || document.body || document.documentElement;
                    if (body && code) {
                        code = code.replaceAll('\n', '').replaceAll('\r', '').replaceAll('  ', '');
                        let _style = document.createElement('style');
                        _style.id = '_style_' + SOCIALBROWSER.md5(code);
                        _style.innerText = SOCIALBROWSER.policy.createHTML(code);
                        _style.nonce = 'social';
                        if (!document.querySelector('#' + _style.id)) {
                            body.appendChild(_style);
                        }
                        return _style;
                    }
                } catch (error) {
                    SOCIALBROWSER.webContents.insertCSS(code);
                    // SOCIALBROWSER.log(error);
                }
            };
            SOCIALBROWSER.addCSSURL = SOCIALBROWSER.addcssurl = function (url) {
                SOCIALBROWSER.onLoad(() => {
                    try {
                        let body = document.head || document.body || document.documentElement;
                        if (body && url) {
                            url = SOCIALBROWSER.handleURL(url);
                            let _style = document.createElement('style');
                            _style.id = '_style_' + SOCIALBROWSER.md5(code);
                            _style.href = url;
                            _style.nonce = 'social';
                            if (!document.querySelector('#' + _style.id)) {
                                body.appendChild(_style);
                            }
                        }
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }
                });
            };
            SOCIALBROWSER.copy = function (text = '') {
                SOCIALBROWSER.clipboard.writeText(text.toString());
            };
            SOCIALBROWSER.paste = function () {
                SOCIALBROWSER.webContents.paste();
            };
            SOCIALBROWSER.readCopy = function () {
                return SOCIALBROWSER.clipboard.readText();
            };

            SOCIALBROWSER.triggerMouseEvent = function (node, eventType) {
                try {
                    if (document.createEvent) {
                        var clickEvent = document.createEvent('MouseEvents');
                        clickEvent.initEvent(eventType, true, true);
                        node.dispatchEvent(clickEvent);
                    } else {
                        document.documentElement['MouseEvents']++;
                    }
                } catch (err) {}
            };
            SOCIALBROWSER.sendKey = function (key) {
                SOCIALBROWSER.log('sendKey : ' + key);
                SOCIALBROWSER.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
                SOCIALBROWSER.webContents.sendInputEvent({ type: 'char', keyCode: key });
                SOCIALBROWSER.webContents.sendInputEvent({ type: 'keyUp', keyCode: key });
            };
            SOCIALBROWSER.sendKeys = function (keys) {
                keys.split('').forEach((key, i) => {
                    setTimeout(() => {
                        SOCIALBROWSER.sendKey(key);
                    }, 100);
                });
            };

            SOCIALBROWSER.triggerKey = function (el, keyCode) {
                el = SOCIALBROWSER.select(el);
                SOCIALBROWSER.triggerKeydown(el, keyCode);
                SOCIALBROWSER.triggerKeyup(el, keyCode);
                SOCIALBROWSER.triggerKeypress(el, keyCode);
            };
            SOCIALBROWSER.triggerKeydown = function (el, keyCode) {
                var e = document.createEvent('Events');
                e.initEvent('keydown', true, true);
                e.keyCode = keyCode;
                e.which = keyCode;
                if (el.dispatchEvent) {
                    el.dispatchEvent(e);
                }
            };
            SOCIALBROWSER.triggerKeyup = function (el, keyCode) {
                var e = document.createEvent('Events');
                e.initEvent('keyup', true, true);
                e.keyCode = keyCode;
                e.which = keyCode;
                if (el.dispatchEvent) {
                    el.dispatchEvent(e);
                }
            };
            SOCIALBROWSER.triggerKeypress = function (el, keyCode) {
                var e = document.createEvent('Events');
                e.initEvent('keypress', true, true);
                e.keyCode = keyCode;
                e.which = keyCode;
                if (el.dispatchEvent) {
                    el.dispatchEvent(e);
                }
            };
            SOCIALBROWSER.write = function (text, selector, timeout = 500) {
                return new Promise((resolver, reject) => {
                    if (!text) {
                        reject('No Text');
                    }

                    setTimeout(() => {
                        selector = SOCIALBROWSER.select(selector);

                        if (!selector) {
                            reject('No selector');
                            return false;
                        }

                        let momeryText = SOCIALBROWSER.clipboard.readText() || '';

                        if (selector.tagName == 'INPUT' || selector.tagName == 'TEXTAREA') {
                            selector.value = text;
                        } else {
                            SOCIALBROWSER.copy(text);
                            SOCIALBROWSER.paste();
                        }

                        setTimeout(() => {
                            SOCIALBROWSER.copy(momeryText);
                            if (selector) {
                                resolver(selector);
                            } else {
                                resolver(text);
                            }
                        }, 500);
                    }, timeout);
                });
            };

            SOCIALBROWSER.getOffset = function (el) {
                const box = el.getBoundingClientRect();
                let factor = SOCIALBROWSER.webContents.zoomFactor || 1;

                let left = box.left * factor;
                let top = box.top * factor;

                return {
                    x: SOCIALBROWSER.randomNumber(left, left + box.width),
                    y: SOCIALBROWSER.randomNumber(top, top + box.height),
                };
            };

            SOCIALBROWSER.mouseMoveByPosition = function (x, y, move = true) {
                x = Math.floor(x);
                y = Math.floor(y);

                if (x < 1 || y < 1) {
                    return;
                }

                SOCIALBROWSER.window.focus();
                if (move) {
                    let steps = 300;

                    for (let index = 0; index < steps; index++) {
                        setTimeout(() => {
                            SOCIALBROWSER.webContents.sendInputEvent({
                                type: 'mouseMove',
                                x: x - steps + index,
                                y: y - steps + index,
                                movementX: x - steps + index,
                                movementY: y - steps + index,
                                globalX: x - steps + index,
                                globalY: y - steps + index,
                            });
                            SOCIALBROWSER.webContents.sendInputEvent({
                                type: 'mouseEnter',
                                x: x - steps + index,
                                y: y - steps + index,
                                movementX: x - steps + index,
                                movementY: y - steps + index,
                                globalX: x - steps + index,
                                globalY: y - steps + index,
                            });
                        }, 10 * index);
                    }
                } else {
                    SOCIALBROWSER.webContents.sendInputEvent({
                        type: 'mouseMove',
                        x: x,
                        y: y,
                        movementX: x,
                        movementY: y,
                        globalX: x,
                        globalY: y,
                    });
                    SOCIALBROWSER.webContents.sendInputEvent({
                        type: 'mouseEnter',
                        x: x,
                        y: y,
                        movementX: x,
                        movementY: y,
                        globalX: x,
                        globalY: y,
                    });
                }
            };

            SOCIALBROWSER.clickByPosition = function (x, y, move = true) {
                x = Math.floor(x);
                y = Math.floor(y);
                if (x < 1 || y < 1) {
                    return;
                }
                let time = 0;
                if (move) {
                    SOCIALBROWSER.mouseMoveByPosition(x, y, move);
                    time = 1000 * 3;
                }
                setTimeout(() => {
                    SOCIALBROWSER.window.focus();

                    SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseDown', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                    setTimeout(() => {
                        SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseUp', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                    }, 50);
                }, time);
            };

            SOCIALBROWSER.hover = function (selector, realPerson = true, move = true) {
                const element = SOCIALBROWSER.$(selector);
                if (element) {
                    let offset = SOCIALBROWSER.getOffset(element);
                    if (realPerson && SOCIALBROWSER.window.isVisible()) {
                        SOCIALBROWSER.mouseMoveByPosition(offset.x, offset.y, move);
                        return element;
                    } else {
                        const eventNames = ['mouseover', 'mouseenter', 'mouseout'];
                        eventNames.forEach((eventName) => {
                            const event = new MouseEvent(eventName, {
                                detail: eventName === 'mouseover' ? 0 : 1,
                                view: window,
                                bubbles: true,
                                cancelable: true,
                                clientX: element.clientX,
                                clientY: element.clientY,
                            });
                            element.dispatchEvent(event);
                        });
                    }

                    return element;
                }
            };

            SOCIALBROWSER.click = function (selector, realPerson = true, move = true, view = true) {
                let element = SOCIALBROWSER.$(selector);
                if (element) {
                    if (view) {
                        if (!SOCIALBROWSER.isElementViewable(element) || !SOCIALBROWSER.isElementInViewArea(element)) {
                            element.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'center',
                            });
                            window.scroll(window.scrollX, window.scrollY - (element.clientHeight + window.innerHeight / 2));
                        }

                        if (!SOCIALBROWSER.isElementViewable(element) || !SOCIALBROWSER.isElementInViewArea(element)) {
                            element.scrollIntoView({
                                behavior: 'auto',
                                block: 'center',
                                inline: 'center',
                            });
                            if (window.scrollY !== 0) {
                                let y = window.scrollY - element.clientHeight;
                                if (y < 0) {
                                    y = 0;
                                }
                                window.scroll(window.scrollX, y);
                            }
                        }
                    }

                    if (!SOCIALBROWSER.isElementViewable(element) || !SOCIALBROWSER.isElementInViewArea(element)) {
                        realPerson = false;
                    }

                    setTimeout(
                        () => {
                            element = SOCIALBROWSER.$(selector);
                            if (element) {
                                let offset = SOCIALBROWSER.getOffset(element);
                                if (realPerson && SOCIALBROWSER.window.isVisible()) {
                                    SOCIALBROWSER.clickByPosition(offset.x, offset.y, move);
                                    return element;
                                } else {
                                    const eventNames = ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click', 'mouseout'];
                                    eventNames.forEach((eventName) => {
                                        const event = new MouseEvent(eventName, {
                                            detail: eventName === 'mouseover' ? 0 : 1,
                                            view: window,
                                            bubbles: true,
                                            cancelable: true,
                                            clientX: element.clientX,
                                            clientY: element.clientY,
                                        });
                                        element.dispatchEvent(event);
                                    });

                                    return element;
                                }
                            }
                        },
                        view ? 1000 : 0,
                    );
                }
            };

            SOCIALBROWSER.select = function (selector, value) {
                if (!selector) {
                    return null;
                }
                selector = typeof selector === 'string' ? document.querySelector(selector) : selector;
                if (selector && selector.focus) {
                    selector.focus();
                    if (value) {
                        selector.value = value;
                        selector.dispatchEvent(
                            new Event('change', {
                                bubbles: true,
                                cancelable: true,
                            }),
                        );
                    }
                }
                return selector;
            };

            SOCIALBROWSER.getElementStyle = function (element) {
                element = SOCIALBROWSER.$(element);
                if (!element) {
                    return null;
                }
                return window.getComputedStyle(element);
            };

            SOCIALBROWSER.isElementHasScroll = function (element) {
                element = SOCIALBROWSER.$(element);

                if (!element) {
                    return false;
                }
                const style = SOCIALBROWSER.getElementStyle(element);
                const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
                const canScrollVertically = style.overflowY === 'scroll' || style.overflowY === 'auto' || style.overflow === 'scroll' || style.overflow === 'auto';

                return hasVerticalScrollbar && canScrollVertically;
            };

            SOCIALBROWSER.getTimeZone = () => {
                return new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
            };

            SOCIALBROWSER.goBack = function () {
                SOCIALBROWSER.webContents.goBack();
            };
            SOCIALBROWSER.goForward = function () {
                SOCIALBROWSER.webContents.goForward();
            };
            SOCIALBROWSER.scroll2y = function (yPercent = 100) {
                const scrollHeight = document.documentElement.scrollHeight;
                const viewportHeight = window.visualViewport.height || window.innerHeight;
                const scrollTop = (scrollHeight - viewportHeight) * (yPercent / 100);
                window.scrollTo({
                    top: scrollTop,
                    left: window.scrollX,
                    behavior: 'smooth',
                });
            };

            SOCIALBROWSER.replaceSelectedText = function (replacementText) {
                if (replacementText) {
                    SOCIALBROWSER.webContents.cut();
                    setTimeout(() => {
                        SOCIALBROWSER.copy(replacementText);
                        SOCIALBROWSER.paste();
                        setTimeout(() => {
                            if (SOCIALBROWSER.selectedText()) {
                                let sel = window.getSelection();
                                if (sel.rangeCount) {
                                    range = sel.getRangeAt(0);
                                    range.deleteContents();
                                    range.insertNode(document.createTextNode(replacementText));
                                }
                                SOCIALBROWSER.webContents.replace(replacementText);
                            }
                        }, 200);
                    }, 50);
                }
            };

            SOCIALBROWSER.downloadURL = function (url) {
                if (!SOCIALBROWSER.customSetting.allowDownload || SOCIALBROWSER.var.blocking.downloader.blockDownload) {
                    SOCIALBROWSER.showUserMessage('Download Blocked <p><a>' + url + '</a></p>');
                } else {
                    SOCIALBROWSER.webContents.downloadURL(url);
                }
            };

            SOCIALBROWSER.isAllowURL = function (url) {
                url = url.split('?')[0];
                if (SOCIALBROWSER.customSetting.blockURLs) {
                    if (url.like(SOCIALBROWSER.customSetting.blockURLs)) {
                        return false;
                    }
                }
                if (SOCIALBROWSER.customSetting.allowURLs) {
                    if (url.like(SOCIALBROWSER.customSetting.allowURLs)) {
                        return true;
                    }
                }

                if (SOCIALBROWSER.var.blocking.white_list.some((item) => url.like(item.url))) {
                    return true;
                }

                let allow = true;
                if (SOCIALBROWSER.var.blocking.core.block_ads) {
                    allow = !SOCIALBROWSER.var.ad_list.some((ad) => url.like(ad.url));
                }

                if (allow) {
                    allow = !SOCIALBROWSER.var.blocking.black_list.some((item) => url.like(item.url));
                }

                if (allow && SOCIALBROWSER.var.blocking.allow_safty_mode) {
                    allow = !SOCIALBROWSER.var.blocking.un_safe_list.some((item) => url.like(item.url));
                }
                return allow;
            };

            SOCIALBROWSER.isValidURL = SOCIALBROWSER.isURL = function (str) {
                let url;

                try {
                    url = new URL(str);
                } catch (_) {
                    return false;
                }

                return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'browser:'|| url.protocol === 'file:';
            };

            SOCIALBROWSER.handleURL = function (u) {
                if (typeof u !== 'string') {
                    if (u) {
                        u = u.toString();
                    } else {
                        return u;
                    }
                }
                u = u.trim();
                if (u.like('blob:*|javascript:*|mailto:*|tel:*|sms:*')) {
                    u = u;
                } else if (u.indexOf('//') === 0) {
                    u = window.location.protocol + u;
                } else if (u.indexOf('/') === 0) {
                    u = window.location.origin + u;
                } else if (u.like('*://*')) {
                    u = u;
                } else if (u.split('?')[0].split('.').length < 3) {
                    let page = document.location.pathname.split('/').pop();
                    u = document.location.origin + window.location.pathname.replace(page, '') + u;
                } else {
                    u = document.location.origin + window.location.pathname + u;
                }
                try {
                    u = decodeURI(u);
                } catch (error) {
                    u = u;
                }

                return u;
            };

            SOCIALBROWSER.isViewable = SOCIALBROWSER.isElementViewable = function (element) {
                element = SOCIALBROWSER.$(element);
                if (!element) {
                    return false;
                }
                const style = SOCIALBROWSER.getElementStyle(element);
                const rect = element.getBoundingClientRect();

                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
            };

            SOCIALBROWSER.isElementInViewArea = function (element) {
                element = SOCIALBROWSER.$(element);
                if (!element) {
                    return false;
                }
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            };

            SOCIALBROWSER.openWindow = function (_customSetting) {
                _customSetting.parentWindowID = SOCIALBROWSER.window.id;
                _customSetting.windowType = _customSetting.windowType || 'social-popup';
                _customSetting.trackingID = 'tacking_' + new Date().getTime().toString();

                let customSetting = { ...SOCIALBROWSER._customSetting, ..._customSetting };

                let newWindow = { trackingID: _customSetting.trackingID, eventList: [] };

                newWindow.on = newWindow.addEventListener = function (name, callback) {
                    newWindow.eventList.push({ name: name, callback: callback });
                };
                newWindow.removeEventListener = function (name, callback) {
                    let index = newWindow.eventList.findIndex((e) => e.name == name && e.callback == callback);
                    if (index !== -1) {
                        newWindow.eventList.splice(index, 1);
                    }
                };

                SOCIALBROWSER.on('[tracking-info]', (e, data) => {
                    if (data.trackingID == newWindow.trackingID) {
                        if (data.windowID) {
                            newWindow.id = data.windowID;
                        }
                        if (data.isClosed) {
                            newWindow.isClosed = data.isClosed;
                            newWindow.eventList.forEach((e) => {
                                if (e.name == 'close' && e.callback) {
                                    e.callback();
                                }
                                if (e.name == 'closed' && e.callback) {
                                    e.callback();
                                }
                            });
                            SOCIALBROWSER.callEvent('window-closed', newWindow);
                        }
                        if (data.loaded) {
                            newWindow.eventList.forEach((e) => {
                                if (e.name == 'load' && e.callback) {
                                    e.callback();
                                }
                            });
                            SOCIALBROWSER.callEvent('window-loaded', newWindow);
                        }
                    }
                });

                newWindow.postMessage = function (data, origin, transfer) {
                    let e = { windowID: newWindow.id, data: data, origin: origin, transfer: transfer };
                    if (!e.windowID) {
                        setTimeout(() => {
                            newWindow.postMessage(data, origin, transfer);
                        }, 100);
                        return;
                    }

                    SOCIALBROWSER.ipc('window.message', e);
                };

                newWindow.eval = function (code) {
                    if (!code) {
                        SOCIALBROWSER.log('No Eval Code');
                        return;
                    }
                    if (code instanceof Function) {
                        code = code.toString();
                        code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
                    }

                    SOCIALBROWSER.sendMessage({
                        windowID: newWindow.id,
                        eval: code,
                    });
                };

                newWindow.terminate = newWindow.close = function () {
                    if (!newWindow.id) {
                        setTimeout(() => {
                            newWindow.close();
                        }, 500);
                        return;
                    }
                    SOCIALBROWSER.ipc('[browser-message]', { windowID: newWindow.id, name: 'close' });
                };

                SOCIALBROWSER.windowOpenList.push(newWindow);
                SOCIALBROWSER.ipc('[open new popup]', customSetting);

                return newWindow;
            };

            SOCIALBROWSER.upTo = function (el, tagName) {
                tagName = tagName.toLowerCase().split(',');

                while (el && el.parentNode) {
                    el = el.parentNode;
                    if (el.tagName && tagName.includes(el.tagName.toLowerCase())) {
                        return el;
                    }
                }
                return null;
            };

            SOCIALBROWSER.getAllCssSelectors = function () {
                var ret = [];
                const styleSheets = Array.from(document.styleSheets).filter((styleSheet) => !styleSheet.href || styleSheet.href.startsWith(window.location.origin));
                for (let style of styleSheets) {
                    if (style instanceof CSSStyleSheet && style.cssRules) {
                        for (var x in style.cssRules) {
                            if (typeof style.cssRules[x].selectorText == 'string') {
                                ret.push(style.cssRules[x].selectorText);
                            }
                        }
                    }
                }
                return ret;
            };

            SOCIALBROWSER.isCssSelectorExists = function (selector) {
                var selectors = SOCIALBROWSER.getAllCssSelectors();
                for (var i = 0; i < selectors.length; i++) {
                    if (selectors[i] == selector) return true;
                }
                return false;
            };

            SOCIALBROWSER.translateBusy = false;
            SOCIALBROWSER.translateList = [];
            SOCIALBROWSER.translate = function (info, callback) {
                if (!info) {
                    callback('');
                    return;
                }
                if (typeof info === 'string') {
                    info = { text: info };
                }
                info.id = Math.random();
                info.callback =
                    callback ||
                    function (trans) {
                        SOCIALBROWSER.log(trans);
                    };
                if (info.text.test(/^[a-zA-Z\-\u0590-\u05FF\0-9^@_:?;!\[\]~<>{}|\\]+$/)) {
                    callback(info.text);
                    return;
                }

                if (SOCIALBROWSER.translateBusy) {
                    setTimeout(() => {
                        SOCIALBROWSER.translate(info, callback);
                    }, 250);
                    return;
                }
                SOCIALBROWSER.translateBusy = true;

                SOCIALBROWSER.translateList.push(info);
                SOCIALBROWSER.ipc('[translate]', { id: info.id, text: info.text, from: info.from, to: info.to });
            };

            SOCIALBROWSER.on('[translate][data]', (e, info) => {
                SOCIALBROWSER.translateBusy = false;
                info.translatedText = '';
                if (info.data && info.data.sentences && info.data.sentences.length > 0) {
                    info.data.sentences.forEach((t) => {
                        info.translatedText += t.trans;
                    });
                    if ((_info = SOCIALBROWSER.translateList.find((t) => t.id == info.id))) {
                        _info.callback(info);
                    }
                }
            });
            SOCIALBROWSER.allowGoogleTranslate = function () {
                // let meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
                // if (meta) {
                //     meta.remove();
                // }

                globalThis.googleTranslateElementInit = function () {
                    new google.translate.TranslateElement({ pageLanguage: 'en' }, '__google_translate_element');
                };
                let ele = SOCIALBROWSER.$('#__google_translate_element');
                if (ele) {
                    ele.style.display = 'block';
                }

                // SOCIALBROWSER.fetch({ url: '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit' }).then((res) => {
                //     if (res.status == 200 && res.headers['content-type'] && res.headers['content-type'][0].contain('javascript') && res.body) {
                //         SOCIALBROWSER.executeJavaScript(res.body)
                //     }
                // });
                setTimeout(() => {
                    SOCIALBROWSER.addJSURL('//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit').then(() => {});
                }, 0);
            };

            SOCIALBROWSER.printerList = [];
            SOCIALBROWSER.getPrinters = function () {
                if (SOCIALBROWSER.webContents.getPrintersAsync) {
                    SOCIALBROWSER.webContents.getPrintersAsync().then((arr0) => {
                        SOCIALBROWSER.printerList = arr0;
                    });
                } else {
                    SOCIALBROWSER.printerList = [];
                }

                return SOCIALBROWSER.printerList;
            };

            SOCIALBROWSER.__img_to_base64 = function (selector) {
                let c = document.createElement('canvas');
                let img = null;
                if (typeof selector == 'string') {
                    img = document.querySelector(selector);
                } else {
                    img = selector;
                }

                if (!img) {
                    return '';
                }
                c.height = img.naturalHeight;
                c.width = img.naturalWidth;
                let ctx = c.getContext('2d');

                ctx.drawImage(img, 0, 0, c.width, c.height);
                return c.toDataURL();
            };

            SOCIALBROWSER.__img_code = function (selector) {
                return SOCIALBROWSER.__md5(window.__img_to_base64(selector));
            };

            SOCIALBROWSER.injectDefault = function () {
                let css = Buffer.from(SOCIALBROWSER.injectedCSS).toString();
                SOCIALBROWSER.addCSS(css);
                let html = Buffer.from(SOCIALBROWSER.injectedHTML).toString();
                SOCIALBROWSER.addHTML(html);
            };

            SOCIALBROWSER.__showWarningImage = function () {
                let div = document.querySelector('#__warning_img');
                if (div) {
                    div.style.display = 'block';
                }
            };
            SOCIALBROWSER.__showBotImage = function () {
                let div = document.querySelector('#__bot_img');
                if (div) {
                    div.style.display = 'block';
                }
            };
            SOCIALBROWSER.__blockPage = function (block, msg, close) {
                let div = document.querySelector('#__blockDiv');
                if (div && block) {
                    div.style.display = 'block';
                    div.innerHTML = SOCIALBROWSER.policy.createHTML(msg || 'This Page Blocked');
                    if (close) {
                        setTimeout(() => {
                            window.close();
                        }, 1000 * 3);
                    }
                } else if (div && !block) {
                    div.style.display = 'none';
                }
            };

            SOCIALBROWSER.showinfoTimeout = null;
            SOCIALBROWSER.showInfo = function (msg, time = 1000 * 5) {
                clearTimeout(SOCIALBROWSER.showinfoTimeout);
                let div = document.querySelector('#__pageInfo');
                if (msg && msg.trim()) {
                    let length = window.innerWidth / 8;
                    if (msg.length > length) {
                        msg = msg.substring(0, length) + '... ';
                    }

                    if (div) {
                        div.style.display = 'block';
                        div.innerHTML = SOCIALBROWSER.policy.createHTML(msg);
                        SOCIALBROWSER.showinfoTimeout = setTimeout(() => {
                            div.innerHTML = SOCIALBROWSER.policy.createHTML('');
                            div.style.display = 'none';
                        }, time);
                    }
                } else {
                    if (div) {
                        div.style.display = 'none';
                    }
                }
            };

            SOCIALBROWSER.showUserMessageTimeout = null;
            SOCIALBROWSER.showUserMessage = function (msg, time = 1000 * 3) {
                SOCIALBROWSER.log(msg);

                if (SOCIALBROWSER.var.blocking.javascript.hide_user_messages) {
                    return;
                }

                clearTimeout(SOCIALBROWSER.showUserMessageTimeout);
                let div = document.querySelector('#__userMessageBox');
                if (msg) {
                    if (div) {
                        div.style.display = 'block';
                        div.innerHTML = SOCIALBROWSER.policy.createHTML(msg);
                        SOCIALBROWSER.showUserMessageTimeout = setTimeout(() => {
                            div.innerHTML = SOCIALBROWSER.policy.createHTML('');
                            div.style.display = 'none';
                        }, time);
                    }
                } else {
                    if (div) {
                        div.style.display = 'none';
                    }
                }
            };
            let __downloads = document.querySelector('#__downloads');
            SOCIALBROWSER.showDownloads = function (msg, css) {
                if (!__downloads) {
                    __downloads = document.querySelector('#__downloads');
                    if (__downloads) {
                        __downloads.addEventListener('click', () => {
                            __downloads.style.display = 'none';
                            __downloads.innerHTML = SOCIALBROWSER.policy.createHTML('');
                        });
                    }
                }
                if (msg && __downloads) {
                    __downloads.style.display = 'block';
                    __downloads.innerHTML = SOCIALBROWSER.policy.createHTML(msg);
                } else if (__downloads) {
                    __downloads.style.display = 'none';
                    __downloads.innerHTML = SOCIALBROWSER.policy.createHTML('');
                }
            };

            let __find = document.querySelector('#__find');
            let find_options = {
                forward: true,
                findNext: false,
                matchCase: false,
                wordStart: false,
                medialCapitalAsWordStart: false,
            };
            let find_input = null;
            let find_interval = null;
            SOCIALBROWSER.showFind = function (from_key) {
                if (!__find) {
                    __find = document.querySelector('#__find');
                }
                if (!find_input) {
                    find_input = document.querySelector('#__find_input');
                }

                if (from_key) {
                    if (__find.style.display == 'block') {
                        __find.style.display = 'none';
                        SOCIALBROWSER.webContents.stopFindInPage('clearSelection');
                        clearInterval(find_interval);
                        find_interval = null;
                        return;
                    } else {
                        __find.style.display = 'block';
                        if (!find_interval) {
                            find_interval = setInterval(() => {
                                find_input.focus();
                            }, 250);
                        }
                    }
                    return;
                }

                if (find_input.value) {
                    SOCIALBROWSER.webContents.findInPage(find_input.value, find_options);
                    find_options.findNext = true;
                } else {
                    SOCIALBROWSER.webContents.stopFindInPage('clearSelection');
                    find_options.findNext = false;
                }
            };

            SOCIALBROWSER.objectFromTable = function (selector) {
                let table = {
                    selector: selector,
                    headers: [],
                    rows: [],
                };

                document.querySelectorAll(`${selector} thead tr th`).forEach((th) => {
                    table.headers.push(th.innerText);
                });

                document.querySelectorAll(`${selector} tbody tr `).forEach((tr) => {
                    let row = [];
                    tr.childNodes.forEach((td, i) => {
                        row[i] = td.innerText;
                    });
                    table.rows.push(row);
                });

                return table;
            };

            SOCIALBROWSER.handleProxy = (...params) => SOCIALBROWSER.fn('child.handleProxy', ...params);
            SOCIALBROWSER.getRandomBrowser = (...params) => SOCIALBROWSER.fn('child.getRandomBrowser', ...params);
            SOCIALBROWSER.getRandomUserAgent = (...params) => SOCIALBROWSER.fn('child.getRandomUserAgent', ...params);
            SOCIALBROWSER.generateVPC = (...params) => SOCIALBROWSER.fn('child.generateVPC', ...params);

            SOCIALBROWSER.getUserScriptMeta = function (code) {
                let meta = {};
                let metaString = code.slice(code.indexOf('// ==UserScript==') + '// ==UserScript=='.length, code.lastIndexOf('// ==/UserScript=='));
                metaString.split('\n').forEach((line) => {
                    if (line && line.indexOf('// @') == 0) {
                        line = line.replace(/\t/g, ' ');
                        line = line.replace('// @', '').split(' ');
                        let key = line.shift();
                        if (meta[key]) {
                            meta[key] = meta[key] + '|' + line.join(' ').split(' //')[0].trim();
                        } else {
                            meta[key] = line.join(' ').split(' //')[0].trim();
                        }
                    }
                });
                return meta;
            };

            SOCIALBROWSER.handleUserScript = async function (code = '') {
                if (typeof code !== 'string') {
                    return '';
                }
                if (code.contain('// ==UserScript==')) {
                    let gm_info_id = '__GM_info_' + Math.random().toString().replace('.', '');
                    let meta = SOCIALBROWSER.getUserScriptMeta(code);
                    let scriptMetaStr = '';
                    for (const key in meta) {
                        if (Object.hasOwn(meta, key)) {
                            scriptMetaStr += '// @' + key + ' ' + meta[key] + '\n';
                        }
                    }

                    if (meta.match) {
                        if (!document.location.href.like(meta.match)) {
                            return new Promise((resolve, reject) => {
                                resolve(true);
                            });
                        }
                    } else if (meta.include) {
                        if (!document.location.href.like(meta.include)) {
                            return new Promise((resolve, reject) => {
                                resolve(true);
                            });
                        }
                    } else if (meta.connect) {
                        if (!document.location.href.contain(meta.connect) && !document.location.href.like(meta.connect)) {
                            return new Promise((resolve, reject) => {
                                resolve(true);
                            });
                        }
                    }

                    if (meta.exclude) {
                        if (document.location.href.like(meta.exclude)) {
                            return new Promise((resolve, reject) => {
                                resolve(true);
                            });
                        }
                    }

                    if (meta.noframes && SOCIALBROWSER.isIframe()) {
                        return new Promise((resolve, reject) => {
                            resolve(true);
                        });
                    }

                    if (meta.require) {
                        let require_list = meta.require.split('|');
                        for (let i = 0; i < require_list.length; i++) {
                            let url = require_list[i].trim();
                            if (url && SOCIALBROWSER.isURL(url)) {
                                // await SOCIALBROWSER.addJSURL('browser://get-js?url=' + url);
                                let res = await SOCIALBROWSER.fetch('http://127.0.0.1:60080/get-js?url=' + url);
                                if (res.status == 200) {
                                    code = res.responseText + ';' + code;
                                }
                            }
                        }
                    }

                    SOCIALBROWSER[gm_info_id] = {
                        uuid: gm_info_id,
                        container: {
                            id: gm_info_id,
                            name: gm_info_id,
                        },
                        scriptSource: gm_info_id,
                        scriptMetaStr: scriptMetaStr,
                        script: meta,
                        isPrivate: false,
                        isIncognito: false,
                        userAgentData: SOCIALBROWSER.cloneObject(navigator.userAgentData),
                        ...meta,
                    };

                    if (!SOCIALBROWSER.GM) {
                        SOCIALBROWSER.GM = {};
                        SOCIALBROWSER.GM.GM_registerMenuCommand = function (name, callback, options_or_accessKey) {
                            SOCIALBROWSER.addMenu({ label: name, click: callback });
                            return name;
                        };
                        SOCIALBROWSER.GM.GM_unregisterMenuCommand = function (name) {
                            SOCIALBROWSER.removeMenu({ label: name });
                        };
                        SOCIALBROWSER.GM.GM_addStyle = SOCIALBROWSER.addCSS;
                        SOCIALBROWSER.GM.GM_xmlhttpRequest = SOCIALBROWSER.fetch;
                        SOCIALBROWSER.GM.unsafeWindow = window;

                        SOCIALBROWSER.GM.GM_setValue = SOCIALBROWSER.setStorage;
                        SOCIALBROWSER.GM.GM_getValue = SOCIALBROWSER.getStorage;
                        SOCIALBROWSER.GM.GM_deleteValue = SOCIALBROWSER.deleteStorage;
                        SOCIALBROWSER.GM.GM_listValues = SOCIALBROWSER.listStorageKeys;

                        SOCIALBROWSER.GM.GM_setValues = function (obj) {
                            for (const key in obj) {
                                if (!Object.hasOwn(obj, key)) {
                                    SOCIALBROWSER.GM.GM_setValue(key, obj[key]);
                                }
                            }
                        };
                        SOCIALBROWSER.GM.GM_getValues = function (data) {
                            let values = {};
                            if (Array.isArray(data)) {
                                data.forEach((key) => {
                                    values[key] = SOCIALBROWSER.GM.GM_getValue(key);
                                });
                            } else if (typeof data === 'object') {
                                for (const key in data) {
                                    if (!Object.hasOwn(data, key)) {
                                        values[key] = SOCIALBROWSER.GM.GM_getValue(key) || data[key];
                                    }
                                }
                            }
                            return values;
                        };
                        SOCIALBROWSER.GM.GM_deleteValues = function (data) {
                            if (Array.isArray(data)) {
                                data.forEach((key) => {
                                    SOCIALBROWSER.GM.GM_deleteValue(key);
                                });
                            }
                        };

                        SOCIALBROWSER.GM.GM_notification = SOCIALBROWSER.alert;
                        SOCIALBROWSER.GM.GM_setClipboard = SOCIALBROWSER.copy;
                        SOCIALBROWSER.GM.GM_openInTab = SOCIALBROWSER.openNewTab;
                        SOCIALBROWSER.GM.GM_log = SOCIALBROWSER.log;
                        SOCIALBROWSER.GM.GM_getTab = SOCIALBROWSER.log;
                        SOCIALBROWSER.GM.GM_saveTab = SOCIALBROWSER.log;
                        SOCIALBROWSER.GM.GM_getTabs = SOCIALBROWSER.log;
                        SOCIALBROWSER.GM.GM_addValueChangeListener = SOCIALBROWSER.log;
                        SOCIALBROWSER.GM.GM_removeValueChangeListener = SOCIALBROWSER.log;
                        SOCIALBROWSER.GM.GM_cookie = {
                            list: SOCIALBROWSER.log,
                            set: SOCIALBROWSER.log,
                            delete: SOCIALBROWSER.log,
                        };
                        SOCIALBROWSER.GM.GM_audio = {
                            setMute: SOCIALBROWSER.log,
                            getState: SOCIALBROWSER.log,
                            addStateChangeListener: SOCIALBROWSER.log,
                            removeStateChangeListener: SOCIALBROWSER.log,
                        };
                        SOCIALBROWSER.GM.GM_webRequest = SOCIALBROWSER.log;
                        SOCIALBROWSER.GM.GM_addElement = function (type, options = {}) {
                            let ele = document.createElement(type);
                            for (const key in options) {
                                if (Object.hasOwn(options, key)) {
                                    if (key === 'textContent') {
                                        if (type.like('script')) {
                                            ele[key] = SOCIALBROWSER.policy.createScript(options[key]);
                                        } else {
                                            ele[key] = SOCIALBROWSER.policy.createHTML(options[key]);
                                        }
                                    } else if (key === 'innerHTML') {
                                        ele[key] = SOCIALBROWSER.policy.createHTML(options[key]);
                                    } else if (key === 'src') {
                                        ele[key] = SOCIALBROWSER.policy.createScriptURL(options[key]);
                                    } else {
                                        ele[key] = options[key];
                                    }
                                }
                            }
                            return ele;
                        };
                        SOCIALBROWSER.GM.GM_download = function (...args) {
                            alert('GM_download');
                            console.log(args);
                        };
                        SOCIALBROWSER.GM.GM_getResourceURL = function (...args) {
                            alert('GM_getResourceURL');
                            console.log(args);
                        };
                        SOCIALBROWSER.GM.GM_getResourceText = function (...args) {
                            alert('GM_getResourceText');
                            console.log(args);
                        };
                    }
                    for (const key in SOCIALBROWSER.GM) {
                        window[key] = SOCIALBROWSER.GM[key];
                    }

                    SOCIALBROWSER.GM.GM_info = SOCIALBROWSER[gm_info_id];
                    code = code.replaceAll('.innerHTML=', '.innerHTML2=').replaceAll('.textContent=', '.textContent2=').replaceAll('.src=', '.src2=');
                    if (meta['run-at'] && meta['run-at'] == 'document-end') {
                        code = 'SOCIALBROWSER.onLoad(()=>{ ' + code + ' })';
                    }
                    code = '(function(GM , GM_info , unsafeWindow){' + code + '})(SOCIALBROWSER.GM , SOCIALBROWSER.GM.GM_info , window);';
                }

                return new Promise((resolve, reject) => {
                    resolve(code);
                });
            };

            SOCIALBROWSER.executeJavaScript = function (code = '') {
                if (typeof code == 'function') {
                    code = code.toString();
                    code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
                }
                code = 'var SOCIALBROWSER = globalThis.SOCIALBROWSER;' + code;
                // code = code.replace(/\/\*[\s\S]*?\*\//g , '') // remove comments like /* */

                return SOCIALBROWSER.fnAsync('executeJavaScript', code, true);
            };

            SOCIALBROWSER.alertTimeout = null;
            SOCIALBROWSER.alert = function (msg, time = 1000 * 3) {
                SOCIALBROWSER.log(msg);

                if (typeof msg !== 'string') {
                    return false;
                }
                msg = msg.trim();

                clearTimeout(SOCIALBROWSER.alertTimeout);

                let div = SOCIALBROWSER.$('#__alertBox');
                if (div) {
                    div.innerHTML = SOCIALBROWSER.policy.createHTML(msg.replace(/\n/g, '<br>'));
                    div.style.display = 'block';
                    SOCIALBROWSER.alertTimeout = setTimeout(() => {
                        div.style.display = 'none';
                        div.innerHTML = SOCIALBROWSER.policy.createHTML('');
                    }, time);
                }

                return true;
            };
        }

        if (true) {
            SOCIALBROWSER.$ = function (selector) {
                if (selector instanceof HTMLElement) {
                    return selector;
                }
                if (typeof selector !== 'string') {
                    return null;
                }
                if (selector.indexOf('/') == 0) {
                    return document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                } else {
                    return document.querySelector(selector);
                }
            };
            SOCIALBROWSER.$$ = function (selector) {
                let arr = [];

                if (selector.indexOf('/') == 0) {
                    let xpathResult = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                    let element = xpathResult.iterateNext();
                    while (element) {
                        arr.push(element);
                        element = xpathResult.iterateNext();
                    }
                } else {
                    document.querySelectorAll(selector).forEach((ele) => {
                        arr.push(ele);
                    });
                }

                return arr;
            };

            SOCIALBROWSER.$$$ = function (selector, el = document.body) {
                const childShadows = SOCIALBROWSER.$$('*')
                    .map((el) => el.shadowRoot)
                    .filter(Boolean);
                const childResults = childShadows.map((child) => SOCIALBROWSER.$$$(selector, child));
                const result = Array.from(el.querySelectorAll(selector));
                return result.concat(childResults).flat();
            };

            SOCIALBROWSER.$load = function () {
                return new Promise((resolve, reject) => {
                    if (document.readyState !== 'loading') {
                        resolve();
                    } else {
                        document.addEventListener('DOMContentLoaded', () => {
                            resolve();
                        });
                    }
                });
            };
            SOCIALBROWSER.$json = function (str) {
                return new Promise((resolve, reject) => {
                    try {
                        resolve(JSON.parse(str));
                    } catch (error) {
                        reject(error);
                    }
                });
            };
            SOCIALBROWSER.$fetch = function (url, _options = {}) {
                let options = {};

                if (typeof url == 'string' && typeof _options !== 'object') {
                    options = { url: url };
                } else if (typeof url == 'string' && typeof _options == 'object') {
                    options = { url: url, ..._options };
                } else if (typeof url == 'object') {
                    options = { ...url };
                }

                options.id = new Date().getTime() + Math.random();
                options.url = SOCIALBROWSER.handleURL(options.url);

                return new Promise((resolve, reject) => {
                    let newOptions = SOCIALBROWSER.cloneObject(options);
                    SOCIALBROWSER.ipc('[fetch]', newOptions).then((response) => {
                        response.json = function () {
                            return SOCIALBROWSER.$json(response.body);
                        };
                        response.text = function () {
                            return response.body;
                        };
                        resolve(response);
                    });
                });
            };

            SOCIALBROWSER.$html = function (html) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                return doc;
            };

            SOCIALBROWSER.$goBack = function () {
                window.history.back();
            };
            SOCIALBROWSER.$goForward = function () {
                window.history.forward();
            };
            SOCIALBROWSER.$submit = function (selector = 'form') {
                SOCIALBROWSER.$select(selector).then((ele) => {
                    ele.submit();
                });
            };

            SOCIALBROWSER.$exists = function (selector) {
                if (selector instanceof HTMLElement) {
                    return true;
                } else if (typeof selector !== 'string') {
                    return false;
                } else {
                    return SOCIALBROWSER.$(selector) ? true : false;
                }
            };

            SOCIALBROWSER.$wait = function (ms = 200) {
                return new Promise((resolve) => setTimeout(resolve, ms));
            };
            SOCIALBROWSER.$every = function (ms = 200, callback) {
                let interval = setInterval(() => {
                    callback(interval);
                }, ms);
            };
            SOCIALBROWSER.$scrollIntoView = function (selector) {
                return new Promise((resolve) => {
                    SOCIALBROWSER.$select(selector).then((element) => {
                        element.scrollIntoView();
                        SOCIALBROWSER.$wait().then(() => resolve(element));
                    });
                });
            };

            SOCIALBROWSER.$selectByXpath = function (selector) {
                return new Promise((resolve, reject) => {
                    let element = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (element) {
                        resolve(element);
                    } else {
                        SOCIALBROWSER.$wait().then(() => {
                            SOCIALBROWSER.$selectByXpath(selector).then((element) => {
                                resolve(element);
                            });
                        });
                    }
                });
            };

            SOCIALBROWSER.$selectAllByXpath = function (selector) {
                return new Promise((resolve, reject) => {
                    let xpathResult = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                    let element = xpathResult.iterateNext();
                    let arr = [];

                    while (element) {
                        arr.push(element);
                        element = xpathResult.iterateNext();
                    }
                    if (arr.length > 0) {
                        resolve(arr);
                    } else {
                        SOCIALBROWSER.$wait().then(() => {
                            SOCIALBROWSER.$selectByXpath(selector).then((arr) => {
                                resolve(arr);
                            });
                        });
                    }
                });
            };

            SOCIALBROWSER.$select = function (selector) {
                return new Promise((resolve, reject) => {
                    if (selector instanceof HTMLElement) {
                        resolve(selector);
                    } else if (typeof selector !== 'string') {
                        reject({ message: 'Selector Not String Type' });
                    } else {
                        if (selector.indexOf('/') == 0) {
                            SOCIALBROWSER.$selectByXpath(selector).then((element) => {
                                SOCIALBROWSER.$wait().then(() => resolve(element));
                            });
                        } else {
                            let ele = SOCIALBROWSER.$(selector);
                            if (ele) {
                                ele.focus();
                                SOCIALBROWSER.$wait().then(() => resolve(ele));
                            } else {
                                SOCIALBROWSER.$wait().then(() => {
                                    SOCIALBROWSER.$select(selector).then((ele) => {
                                        resolve(ele);
                                    });
                                });
                            }
                        }
                    }
                });
            };

            SOCIALBROWSER.$selectAll = function (selector) {
                return new Promise((resolve, reject) => {
                    if (selector instanceof HTMLElement) {
                        resolve([selector]);
                    } else if (typeof selector !== 'string') {
                        reject({ message: 'Selector Not String Type' });
                    } else if (Array.isArray(selector)) {
                        resolve(selector);
                    } else {
                        if (selector.indexOf('/') == 0) {
                            SOCIALBROWSER.$selectAllByXpath(selector).then((elements) => {
                                SOCIALBROWSER.$wait().then(() => resolve(elements));
                            });
                        } else {
                            let arr = SOCIALBROWSER.$$(selector);
                            if (arr.length > 0) {
                                SOCIALBROWSER.$wait().then(() => resolve(arr));
                            } else {
                                SOCIALBROWSER.$wait().then(() => {
                                    SOCIALBROWSER.$selectAll(selector).then((elements) => {
                                        resolve(elements);
                                    });
                                });
                            }
                        }
                    }
                });
            };
            SOCIALBROWSER.$setValue = function (selector, value) {
                return new Promise((resolve, reject) => {
                    SOCIALBROWSER.$select(selector).then((ele) => {
                        ele.focus();
                        if (ele.tagName.like('select')) {
                            const options = [...ele.options];
                            let hasOptionValue = options.find((option) => option.value == value);
                            let hasOptionLabel = !hasOptionValue ? options.find((option) => option.label.like(value)) : null;

                            if (hasOptionValue || hasOptionLabel) {
                                if (hasOptionValue) {
                                    ele.value = value;
                                } else if (hasOptionLabel) {
                                    ele.value = hasOptionLabel.value;
                                }
                                let event = new Event('change');
                                ele.dispatchEvent(event);
                                SOCIALBROWSER.$wait().then(() => resolve(ele));
                            }
                        } else if (ele.tagName.like('input|textarea')) {
                            ele.value = value;
                            ele.innerHTML = value;

                            if (true) {
                                const event = new Event('change', { bubbles: true });
                                ele.dispatchEvent(event);
                            }
                            if (true) {
                                const event = new Event('input', { bubbles: true });
                                ele.dispatchEvent(event);
                            }

                            SOCIALBROWSER.$wait().then(() => resolve(ele));
                        } else {
                        }
                    });
                });
            };

            SOCIALBROWSER.$pressKey = function (key) {
                SOCIALBROWSER.window.focus();
                SOCIALBROWSER.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
                SOCIALBROWSER.webContents.sendInputEvent({ type: 'char', keyCode: key });
                SOCIALBROWSER.webContents.sendInputEvent({ type: 'keyUp', keyCode: key });
            };

            SOCIALBROWSER.$enter = function () {
                SOCIALBROWSER.$pressKey('enter');
            };
            SOCIALBROWSER.$backspace = function () {
                SOCIALBROWSER.$pressKey('backspace');
            };

            SOCIALBROWSER.$pressKeys = function (keys) {
                return new Promise(async (resolve, reject) => {
                    let arr = keys.split('');
                    for (let index = 0; index < arr.length; index++) {
                        await SOCIALBROWSER.$wait(SOCIALBROWSER.randomNumber(50, 200));
                        await SOCIALBROWSER.$pressKey(arr[index]);
                    }

                    SOCIALBROWSER.$wait(200).then(() => resolve());
                });
            };

            SOCIALBROWSER.$type = function (selector, text = '', move = false) {
                return new Promise((resolve, reject) => {
                    SOCIALBROWSER.$select(selector).then(async (ele) => {
                        await SOCIALBROWSER.$click(ele, true, move, false);
                        if (!move) {
                            ele.focus();
                        }
                        SOCIALBROWSER.$pressKeys(text).then(() => {
                            SOCIALBROWSER.$wait(200).then(() => resolve(ele));
                        });
                    });
                });
            };
            SOCIALBROWSER.$empty = function (selector) {
                return new Promise((resolve, reject) => {
                    SOCIALBROWSER.$select(selector).then((ele) => {
                        ele.focus();
                        ele.value = '';
                        ele.textContent = '';
                        ele.innerText = '';
                        ele.innerHTML = '';
                        setTimeout(() => {
                            resolve(ele);
                        }, 200);
                    });
                });
            };

            SOCIALBROWSER.$paste = function (text) {
                return new Promise((resolve, reject) => {
                    SOCIALBROWSER.clipboard.writeText(text.toString());
                    SOCIALBROWSER.webContents.paste();
                    setTimeout(() => {
                        resolve();
                    }, 200);
                });
            };

            SOCIALBROWSER.$getOffset = function (el) {
                const box = el.getBoundingClientRect();
                let factor = SOCIALBROWSER.webContents.zoomFactor || 1;

                let left = box.left * factor;
                let top = box.top * factor;

                return {
                    x: SOCIALBROWSER.randomNumber(left, left + box.width),
                    y: SOCIALBROWSER.randomNumber(top, top + box.height),
                };
            };
            SOCIALBROWSER.$isElementViewable = function (element) {
                element = SOCIALBROWSER.$(element);
                if (!element) {
                    return false;
                }
                const style = SOCIALBROWSER.getElementStyle(element);
                const rect = element.getBoundingClientRect();

                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
            };

            SOCIALBROWSER.$isElementInViewArea = function (element) {
                element = SOCIALBROWSER.$(element);
                if (!element) {
                    return false;
                }
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            };

            SOCIALBROWSER.$mouseMoveByPosition = function (x, y, move = true) {
                return new Promise((resolve, reject) => {
                    x = Math.floor(x);
                    y = Math.floor(y);

                    if (x < 1 || y < 1) {
                        return;
                    }

                    SOCIALBROWSER.window.focus();
                    if (move) {
                        let steps = 100;

                        for (let index = 0; index < steps; index++) {
                            SOCIALBROWSER.$wait(10 * index).then(() => {
                                SOCIALBROWSER.webContents.sendInputEvent({
                                    type: 'mouseMove',
                                    x: x - steps + index,
                                    y: y - steps + index,
                                    movementX: x - steps + index,
                                    movementY: y - steps + index,
                                    globalX: x - steps + index,
                                    globalY: y - steps + index,
                                });
                                SOCIALBROWSER.webContents.sendInputEvent({
                                    type: 'mouseEnter',
                                    x: x - steps + index,
                                    y: y - steps + index,
                                    movementX: x - steps + index,
                                    movementY: y - steps + index,
                                    globalX: x - steps + index,
                                    globalY: y - steps + index,
                                });
                            });
                        }
                        SOCIALBROWSER.$wait(steps * 10).then(() => resolve());
                    } else {
                        SOCIALBROWSER.webContents.sendInputEvent({
                            type: 'mouseMove',
                            x: x,
                            y: y,
                            movementX: x,
                            movementY: y,
                            globalX: x,
                            globalY: y,
                        });
                        SOCIALBROWSER.webContents.sendInputEvent({
                            type: 'mouseEnter',
                            x: x,
                            y: y,
                            movementX: x,
                            movementY: y,
                            globalX: x,
                            globalY: y,
                        });
                        SOCIALBROWSER.$wait().then(() => resolve());
                    }
                });
            };

            SOCIALBROWSER.$clickByPosition = function (x, y, move = true) {
                return new Promise((resolve, reject) => {
                    x = Math.floor(x);
                    y = Math.floor(y);
                    if (x < 1 || y < 1) {
                        return;
                    }

                    if (move) {
                        SOCIALBROWSER.$mouseMoveByPosition(x, y, move).then(() => {
                            SOCIALBROWSER.window.focus();

                            SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseDown', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                            setTimeout(() => {
                                SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseUp', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                                resolve();
                            }, 50);
                        });
                    } else {
                        SOCIALBROWSER.window.focus();

                        SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseDown', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                        setTimeout(() => {
                            SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseUp', x: x, y: y, movementX: x, movementY: y, button: 'left', clickCount: 1 });
                            resolve();
                        }, 50);
                    }
                });
            };
            SOCIALBROWSER.$hover = function (selector, realPerson = true, move = true) {
                if (SOCIALBROWSER.isIframe()) {
                    realPerson = false;
                    move = false;
                }
                return new Promise((resolve, reject) => {
                    SOCIALBROWSER.$select(selector).then((element) => {
                        let offset = SOCIALBROWSER.$getOffset(element);
                        if (realPerson && SOCIALBROWSER.window.isVisible()) {
                            SOCIALBROWSER.$mouseMoveByPosition(offset.x, offset.y, move).then(() => {
                                resolve(element);
                            });
                        } else {
                            const eventNames = ['mouseover', 'mouseenter', 'mouseout'];
                            eventNames.forEach((eventName) => {
                                const event = new MouseEvent(eventName, {
                                    detail: eventName === 'mouseover' ? 0 : 1,
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                    clientX: element.clientX,
                                    clientY: element.clientY,
                                });
                                element.dispatchEvent(event);
                            });
                            resolve(element);
                        }
                    });
                });
            };
            SOCIALBROWSER.$click = function (selector, realPerson = true, move = true, view = true) {
                if (SOCIALBROWSER.isIframe()) {
                    realPerson = false;
                    move = false;
                }
                return new Promise((resolve, reject) => {
                    SOCIALBROWSER.$select(selector).then((element) => {
                        if (view) {
                            if (!SOCIALBROWSER.$isElementViewable(element) || !SOCIALBROWSER.$isElementInViewArea(element)) {
                                element.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'center',
                                });
                                window.scroll(window.scrollX, window.scrollY - (element.clientHeight + window.innerHeight / 2));
                            }

                            if (!SOCIALBROWSER.$isElementViewable(element) || !SOCIALBROWSER.$isElementInViewArea(element)) {
                                element.scrollIntoView({
                                    behavior: 'auto',
                                    block: 'center',
                                    inline: 'center',
                                });
                                if (window.scrollY !== 0) {
                                    let y = window.scrollY - element.clientHeight;
                                    if (y < 0) {
                                        y = 0;
                                    }
                                    window.scroll(window.scrollX, y);
                                }
                            }
                        }

                        if (!SOCIALBROWSER.$isElementViewable(element) || !SOCIALBROWSER.$isElementInViewArea(element)) {
                            realPerson = false;
                        }

                        let offset = SOCIALBROWSER.$getOffset(element);

                        if (realPerson && SOCIALBROWSER.window.isVisible()) {
                            SOCIALBROWSER.$clickByPosition(offset.x, offset.y, move).then(() => {
                                setTimeout(() => {
                                    resolve(element);
                                }, 200);
                            });
                        } else {
                            const eventNames = ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click', 'mouseout'];
                            eventNames.forEach((eventName) => {
                                const event = new MouseEvent(eventName, {
                                    detail: eventName === 'mouseover' ? 0 : 1,
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                    clientX: element.clientX,
                                    clientY: element.clientY,
                                });
                                element.dispatchEvent(event);
                            });
                            setTimeout(() => {
                                resolve(element);
                            }, 200);
                        }
                    });
                });
            };
        }

        SOCIALBROWSER.getLocalStorageList = function () {
            let arr = [];
            try {
                Object.keys(localStorage).forEach((key) => {
                    arr.push({ key: key, value: localStorage.getItem(key) });
                });
            } catch (error) {
                SOCIALBROWSER.log(error);
            }

            return arr;
        };
        SOCIALBROWSER.getSessionStorageList = function () {
            let arr = [];
            try {
                Object.keys(sessionStorage).forEach((key) => {
                    arr.push({ key: key, value: sessionStorage.getItem(key) });
                });
            } catch (error) {
                SOCIALBROWSER.log(error);
            }

            return arr;
        };
        SOCIALBROWSER.getDomainFromURL = function (url) {
            url = url || document.location.href;
            let domain = new URL(url).hostname.split('.');
            domain = domain.slice(domain.length - 2).join('.');
            return domain;
        };
        SOCIALBROWSER.getHttpCookie = function (obj = {}) {
            obj.domain = obj.domain || SOCIALBROWSER.getDomainFromURL(obj.url);
            obj.partition = SOCIALBROWSER.partition;
            return SOCIALBROWSER.ipcSync('[get-http-cookies]', obj).cookie;
        };
        SOCIALBROWSER.setHttpCookie = function (obj = { cookie: '', off: true }) {
            obj.domain = obj.domain || SOCIALBROWSER.getDomainFromURL(obj.url);
            obj.partition = obj.partition || SOCIALBROWSER.partition;
            obj.mode = obj.mode || 0;
            return SOCIALBROWSER.ipcSync('[set-http-cookies]', obj);
        };
        SOCIALBROWSER.getDomainCookies = function (obj = {}) {
            obj.url = obj.url || document.location.href;
            obj.cookieDomain = obj.cookieDomain || obj.domain || SOCIALBROWSER.getDomainFromURL(obj.url);
            obj.partition = obj.partition || SOCIALBROWSER.partition;
            return SOCIALBROWSER.ipcSync('[get-domain-cookies]', obj);
        };
        SOCIALBROWSER.setDomainCookies = function (obj = {}) {
            obj.partition = obj.partition || SOCIALBROWSER.partition;
            obj.cookies = obj.cookies || [];
            return SOCIALBROWSER.ipcSync('[set-domain-cookies]', obj);
        };

        SOCIALBROWSER.getSessionCookies = function (obj = {}) {
            obj.domain = '*';
            obj.partition = SOCIALBROWSER.partition;
            return SOCIALBROWSER.ipcSync('[get-session-cookies]', obj);
        };
        SOCIALBROWSER.setSessionCookies = function (obj = {}) {
            obj.partition = SOCIALBROWSER.partition;
            obj.cookies = obj.cookies || [];
            return SOCIALBROWSER.ipcSync('[set-session-cookies]', obj);
        };

        SOCIALBROWSER.getSiteData = function (obj = {}) {
            obj.url = obj.url || document.location.href;
            obj.domain = obj.domain || SOCIALBROWSER.getDomainFromURL(obj.url);
            obj.session = {
                name: SOCIALBROWSER.session.display,
                display: SOCIALBROWSER.session.display,
                defaultUserAgent: SOCIALBROWSER.session.defaultUserAgent,
                privacy: SOCIALBROWSER.session.privacy,
            };
            obj.cookie = obj.cookie || SOCIALBROWSER.getHttpCookie({ domain: obj.domain });
            obj.cookies = obj.cookies || SOCIALBROWSER.getDomainCookies({ domain: obj.domain }).cookies;
            obj.localStorageList = SOCIALBROWSER.getLocalStorageList();
            obj.sessionStorageList = SOCIALBROWSER.getSessionStorageList();
            return obj;
        };

        SOCIALBROWSER.importSiteData = function (txt = '', type = 2) {
            if (!txt) {
                return;
            }

            if (txt.length == 32) {
                SOCIALBROWSER.fetchJson({
                    url: 'https://social-browser.com/api/d/' + txt,
                }).then((data) => {
                    SOCIALBROWSER.log(data);
                    if (data.done && data.code) {
                        SOCIALBROWSER.importSiteData(data.code, type);
                    }
                });
            } else {
                let data = SOCIALBROWSER.showObject(txt);
                if (type == 0) {
                    SOCIALBROWSER.customSetting.localStorageList = data.localStorageList;
                    SOCIALBROWSER.customSetting.sessionStorageList = data.sessionStorageList;
                    SOCIALBROWSER.setDomainCookies({ cookies: data.cookies });
                    SOCIALBROWSER.window.newStorageSet = false;
                    document.location.href = data.url;
                } else if (type == 1) {
                    SOCIALBROWSER.addSession(data.session);
                    SOCIALBROWSER.ipc('[open new popup]', {
                        session: data.session,
                        localStorageList: data.localStorageList,
                        sessionStorageList: data.sessionStorageList,
                        cookies: data.cookies,
                        url: data.url,
                        show: true,
                        vip: true,
                        center: true,
                        alwaysOnTop: true,
                    });
                } else if (type == 2) {
                    let ghost = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;
                    data.session.name = ghost;
                    data.session.display = ghost;
                    SOCIALBROWSER.ipc('[open new popup]', {
                        session: data.session,
                        localStorageList: data.localStorageList,
                        sessionStorageList: data.sessionStorageList,
                        cookies: data.cookies,
                        url: data.url,
                        show: true,
                        vip: true,
                        center: true,
                        alwaysOnTop: true,
                    });
                }
            }
        };

        SOCIALBROWSER.openInChrome = function (obj = { auto: true }) {
            obj.url = obj.url || document.location.href;

            if (!obj.domain) {
                obj.domain = new URL(obj.url).hostname.split('.');
                obj.domain = obj.domain.slice(obj.domain.length - 2).join('.');
            }

            obj.partition = SOCIALBROWSER.partition;
            obj.referrer = obj.referrer || document.referrer;
            obj.userDataDir = obj.userDataDir || SOCIALBROWSER.data_dir + '/sessionData/chrome/' + obj.partition.replace('persist:', '');

            if (obj.auto) {
                obj.proxy = SOCIALBROWSER.proxy;
                obj.navigator = SOCIALBROWSER.cloneObject(SOCIALBROWSER.navigator);
                obj.customSetting = SOCIALBROWSER._customSetting;
                obj.cookie = obj.cookie || SOCIALBROWSER.getHttpCookie({ domain: obj.domain });
                obj.cookies = SOCIALBROWSER.getDomainCookies({ domain: obj.domain }).cookies;
                obj.localStorageList = SOCIALBROWSER.getLocalStorageList();
                obj.sessionStorageList = SOCIALBROWSER.getSessionStorageList();

                obj.navigator = {
                    deviceMemory: obj.navigator.deviceMemory,
                    hardwareConcurrency: obj.navigator.hardwareConcurrency,
                    language: obj.navigator.language,
                    languages: obj.navigator.languages,
                };

                obj.windowID = SOCIALBROWSER.window.id;
            }
            alert('Opening in Chrome Browser Simulator');
            return SOCIALBROWSER.ipcSync('[open-in-chrome]', obj);
        };

        SOCIALBROWSER.cookiesRaw = '';
        SOCIALBROWSER.clearCookies = function () {
            SOCIALBROWSER.ipcSync('[cookies-clear]', { domain: SOCIALBROWSER.domain, partition: SOCIALBROWSER.partition });
            SOCIALBROWSER.cookiesRaw = SOCIALBROWSER.getCookieRaw();
            return true;
        };
        SOCIALBROWSER.clearAllCookies = function () {
            SOCIALBROWSER.ipcSync('[cookies-clear]', { domain: SOCIALBROWSER.domain, partition: SOCIALBROWSER.partition });
            SOCIALBROWSER.cookiesRaw = SOCIALBROWSER.getCookieRaw();
            return true;
        };
        SOCIALBROWSER.getAllCookies = function () {
            return SOCIALBROWSER.ipcSync('[cookie-get-all]', { domain: SOCIALBROWSER.domain, partition: SOCIALBROWSER.partition });
        };
        SOCIALBROWSER.getCookieRaw = function () {
            return SOCIALBROWSER.ipcSync('[cookie-get-raw]', {
                name: '*',
                domain: SOCIALBROWSER.domain,
                partition: SOCIALBROWSER.partition,
                url: document.location.origin,
                path: document.location.pathname,
                protocol: document.location.protocol,
            });
        };
        SOCIALBROWSER.setCookieRaw = function (newValue) {
            SOCIALBROWSER.ipcSync('[cookie-set-raw]', {
                cookie: newValue,
                partition: SOCIALBROWSER.partition,
                url: document.location.origin,
                domain: SOCIALBROWSER.domain,
                path: document.location.pathname,
                protocol: document.location.protocol,
            });
            SOCIALBROWSER.cookiesRaw = SOCIALBROWSER.getCookieRaw();
        };

        if (!SOCIALBROWSER.isLocal && !SOCIALBROWSER.customSetting.$cloudFlare) {
            if (!SOCIALBROWSER.var.blocking.javascript.allowConsoleLogs) {
                for (const key in console) {
                    if (typeof console[key] == 'function') {
                        let s = console[key].toString();
                        console[key] = function () {
                            return { run: () => {} };
                        };
                        SOCIALBROWSER.__setConstValue(console[key], 'toString', () => s);
                    }
                }
            }

            if (SOCIALBROWSER.var.blocking.javascript.block_setInterval) {
                setInterval = function () {};
            }
            if (SOCIALBROWSER.var.blocking.javascript.block_setTimeout) {
                setTimeout = function () {};
            }
            if (SOCIALBROWSER.var.blocking.javascript.block_console_clear) {
                let s = console.clear.toString();
                console.clear = function () {};
                SOCIALBROWSER.__setConstValue(console.clear, 'toString', () => s);
            }
        }

        SOCIALBROWSER.on('window.message', (e, message) => {
            //  console.log('ipc window.message', message);
            // SOCIALBROWSER.log('ipc window.message', message);
            // if(typeof message.data == 'string' && message.data.indexOf('{') == 0){
            //     message.data = JSON.parse(message.data)
            // }

            if (message.data.name == '[allowDefaultWorker]') {
                SOCIALBROWSER.allowDefaultWorker = true;
            }

            if (SOCIALBROWSER.customSetting.isWorker) {
                if (typeof onmessage == 'function') {
                    onmessage(message);
                } else if (self.onmessage) {
                    self.onmessage(message);
                }
            } else {
                if (message.trackingID) {
                    let winIndex = SOCIALBROWSER.windowOpenList.findIndex((w) => w.trackingID == message.trackingID);
                    if (winIndex !== -1) {
                        if (SOCIALBROWSER.windowOpenList[winIndex]) {
                            if (SOCIALBROWSER.windowOpenList[winIndex].onmessage) {
                                SOCIALBROWSER.windowOpenList[winIndex].onmessage(message);
                            }
                            if (SOCIALBROWSER.windowOpenList[winIndex].defaultWorker && typeof SOCIALBROWSER.windowOpenList[winIndex].defaultWorker.onmessage == 'function') {
                                SOCIALBROWSER.windowOpenList[winIndex].defaultWorker.onmessage(message);
                            }
                        }
                    }
                } else {
                    window.postMessage(message.data, message.origin, message.transfer);
                }
            }
        });

        if (!SOCIALBROWSER.var.core.loginByPasskey && window.PublicKeyCredential && navigator) {
            window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = function () {
                return new Promise((resolve, reject) => {
                    resolve(false);
                });
            };
            window.PublicKeyCredential.isConditionalMediationAvailable = function () {
                return new Promise((resolve, reject) => {
                    resolve(false);
                });
            };
            SOCIALBROWSER.navigator.credentials = {};
            SOCIALBROWSER.navigator.credentials.create = function (options) {
                return new Promise((resolve, reject) => {
                    if (options.password) {
                        const pwdCredential = new PasswordCredential({ ...options.password });
                        resolve(pwdCredential);
                    } else if (options.federated) {
                        const fedCredential = new FederatedCredential({ ...options.password });
                        resolve(fedCredential);
                    } else if (options.publicKey) {
                        let pk = {
                            rp: {
                                id: 'google.com',
                                name: 'Google',
                            },
                            user: {
                                id: {},
                                displayName: '_______',
                                name: '______@gmail.com',
                            },
                            challenge: {},
                            pubKeyCredParams: [
                                {
                                    type: 'public-key',
                                    alg: -7,
                                },
                                {
                                    type: 'public-key',
                                    alg: -257,
                                },
                            ],
                            excludeCredentials: [],
                            authenticatorSelection: {
                                authenticatorAttachment: 'platform',
                                residentKey: 'preferred',
                                userVerification: 'preferred',
                            },
                            attestation: 'direct',
                            extensions: {
                                appidExclude: 'https://www.gstatic.com/securitykey/origins.json',
                                googleLegacyAppidSupport: false,
                            },
                        };

                        const pkCredential = {
                            publicKey: SOCIALBROWSER.md5(options.publicKey.user.name),
                            id: SOCIALBROWSER.md5(options.publicKey.user.name),
                            rawId: SOCIALBROWSER.md5(options.publicKey.user.name),

                            response: {
                                clientDataJSON: JSON.stringify(options.publicKey),
                            },
                        };
                        SOCIALBROWSER.log(pkCredential);
                        resolve(pkCredential);
                    } else {
                        reject('AbortError');
                    }
                });
            };
            SOCIALBROWSER.navigator.credentials.get = function () {
                return new Promise((resolve, reject) => {
                    reject('AbortError');
                });
            };
        }
    })();

    (function loaRemote() {
        SOCIALBROWSER.window = new Proxy(SOCIALBROWSER._window, {
            get(target, name, receiver) {
                if (name == '_') {
                    return target;
                } else {
                    if (!Reflect.has(target, name)) {
                        return SOCIALBROWSER.get('window.' + name);
                    }
                    return Reflect.get(target, name, receiver);
                }
            },
            set(target, name, value, receiver) {
                if (!Reflect.has(target, name)) {
                    if (typeof value == 'function') {
                        value = value.toString();
                        value = value.slice(value.indexOf('{') + 1, value.lastIndexOf('}'));
                    }
                    return SOCIALBROWSER.set('window.' + name, value);
                }
                return Reflect.set(target, name, value, receiver);
            },
        });

        SOCIALBROWSER._webContents = SOCIALBROWSER.ipcSync('[webContents]');
        SOCIALBROWSER._webContents.fnList.forEach((fn) => {
            SOCIALBROWSER._webContents[fn] = (...params) => SOCIALBROWSER.fn('webContents.' + fn, ...params);
            let fnAsync = fn;
            if (!fnAsync.like('*Async')) {
                fnAsync = fnAsync + 'Async';
            }
            SOCIALBROWSER._webContents[fnAsync] = function (...params) {
                return SOCIALBROWSER.fnAsync('webContents.' + fn, ...params);
            };
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
                if (name == '_') {
                    return target;
                } else {
                    if (!Reflect.has(target, name)) {
                        return SOCIALBROWSER.get('webContents.' + name);
                    }
                    return Reflect.get(target, name, receiver);
                }
            },
            set(target, name, value, receiver) {
                if (!Reflect.has(target, name)) {
                    if (typeof value == 'function') {
                        value = value.toString();
                        value = value.slice(value.indexOf('{') + 1, value.lastIndexOf('}'));
                    }
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
                if (name == '_') {
                    return target;
                } else {
                    if (!Reflect.has(target, name)) {
                        return SOCIALBROWSER.get('screen.' + name);
                    }
                    return Reflect.get(target, name, receiver);
                }
            },
            set(target, name, value, receiver) {
                if (!Reflect.has(target, name)) {
                    return SOCIALBROWSER.set('screen.' + name, value);
                }
                return Reflect.set(target, name, value, receiver);
            },
        });

        SOCIALBROWSER._clipboard = SOCIALBROWSER.ipcSync('[clipboard]');
        SOCIALBROWSER._clipboard.fnList.forEach((fn) => {
            SOCIALBROWSER._clipboard[fn] = (...params) => SOCIALBROWSER.fn('clipboard.' + fn, ...params);
        });

        SOCIALBROWSER.clipboard = new Proxy(SOCIALBROWSER._clipboard, {
            get(target, name, receiver) {
                if (name == '_') {
                    return target;
                } else {
                    if (!Reflect.has(target, name)) {
                        return SOCIALBROWSER.get('clipboard.' + name);
                    }
                    return Reflect.get(target, name, receiver);
                }
            },
            set(target, name, value, receiver) {
                if (!Reflect.has(target, name)) {
                    return SOCIALBROWSER.set('clipboard.' + name, value);
                }
                return Reflect.set(target, name, value, receiver);
            },
        });
        SOCIALBROWSER.electron.clipboard = SOCIALBROWSER.clipboard;

        SOCIALBROWSER.remote = {
            clipboard: SOCIALBROWSER.clipboard,
            BrowserWindow: function (_setting) {
                return SOCIALBROWSER.openWindow(_setting);
            },
            getCurrentWindow: function () {
                return SOCIALBROWSER.window;
            },
            screen: SOCIALBROWSER.screen,
        };

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

        if (SOCIALBROWSER.sessionId() == 0 && !SOCIALBROWSER.session.privacy.vpc) {
            SOCIALBROWSER.session.privacy.allowVPC = true;
            SOCIALBROWSER.session.privacy.vpc = SOCIALBROWSER.getStorage('vpc') || SOCIALBROWSER.generateVPC('pc');
            SOCIALBROWSER.setStorage('vpc', SOCIALBROWSER.session.privacy.vpc);
        }

        SOCIALBROWSER.isWhiteSite =
            SOCIALBROWSER.customSetting.isWhiteSite || SOCIALBROWSER.var.blocking.white_list.some((site) => site.url.length > 2 && SOCIALBROWSER.window.getURL().like(site.url));

        SOCIALBROWSER.javaScriptOFF =
            SOCIALBROWSER.customSetting.javaScriptOFF ||
            SOCIALBROWSER.customSetting.off ||
            SOCIALBROWSER.customSetting.$cloudFlare ||
            SOCIALBROWSER.var.core.javaScriptOFF ||
            SOCIALBROWSER.var.blocking.vip_site_list.some((site) => site.url.length > 2 && SOCIALBROWSER.window.getURL().like(site.url));

        if (!SOCIALBROWSER.javaScriptOFF && !SOCIALBROWSER.isWhiteSite) {
            if (SOCIALBROWSER.var.blocking.javascript.block_eval) {
                let s = window.eval.toString();
                window.eval = function () {
                    SOCIALBROWSER.log('eval block', code);
                    return undefined;
                };
                SOCIALBROWSER.__setConstValue(window.eval, 'toString', () => s);
            }
        }
    })();

    (function prepareFn() {
        if (SOCIALBROWSER.customSetting.isWorker) {
            self.workerGlobal = self;
            self.importScripts = async function (...urls) {
                for (let index = 0; index < urls.length; index++) {
                    SOCIALBROWSER.log('Import Script : ' + urls[index]);
                    await SOCIALBROWSER.addJSURL(urls[index]);
                }
            };
            self.terminate = function () {
                window.close();
            };

            self.postMessage = (data, origin, transfer) => {
                SOCIALBROWSER.ipc('window.message', {
                    trackingID: SOCIALBROWSER.customSetting.trackingID,
                    windowID: SOCIALBROWSER.customSetting.parentWindowID,
                    toParentFrame: SOCIALBROWSER.customSetting.parentFrame,
                    data: data,
                    origin: origin || '*',
                    transfer: transfer,
                });
            };
        }

        if (!SOCIALBROWSER.customSetting.allowSocialBrowser) {
            globalThis = new Proxy(globalThis, {
                apply(target, thisArg, argumentsList) {
                    return Reflect.apply(target, thisArg, argumentsList);
                },
                get(target, property, receiver) {
                    if (typeof property == 'string' && property.like('SOCIALBROWSER')) {
                        return SOCIALBROWSER;
                    }
                    if (target[property] instanceof Function) {
                        return target[property].bind(target);
                    }

                    return target[property];
                },
                set(target, property, value, receiver) {
                    target[property] = value;
                    return true;
                },
            });
        } else {
            globalThis.SOCIALBROWSER = SOCIALBROWSER;
        }

        if (SOCIALBROWSER.customSetting.proxy) {
            SOCIALBROWSER.proxy = SOCIALBROWSER.customSetting.proxy;
        } else if (SOCIALBROWSER.session.proxy && SOCIALBROWSER.session.proxyEnabled) {
            SOCIALBROWSER.proxy = SOCIALBROWSER.session.proxy;
        } else if (SOCIALBROWSER.var.proxy && SOCIALBROWSER.var.core.proxyEnabled) {
            SOCIALBROWSER.proxy = SOCIALBROWSER.var.proxy;
        }
    })();

    (function loadMenu() {
        if (true) {
            SOCIALBROWSER.menuList = [];

            let changeEvent = new Event('change', {
                bubbles: true,
                cancelable: true,
            });
            let inputEvent = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            let enter_event = new KeyboardEvent('keydown', {
                altKey: false,
                bubbles: true,
                cancelBubble: false,
                cancelable: true,
                charCode: 0,
                code: 'Enter',
                composed: true,
                ctrlKey: false,
                currentTarget: null,
                defaultPrevented: true,
                detail: 0,
                eventPhase: 0,
                isComposing: false,
                isTrusted: true,
                key: 'Enter',
                keyCode: 13,
                location: 0,
                metaKey: false,
                repeat: false,
                returnValue: false,
                shiftKey: false,
                type: 'keydown',
                which: 13,
            });

            function sendToMain(obj) {
                SOCIALBROWSER.ipc('[send-render-message]', obj);
            }

            function isContentEditable(node) {
                if (node && node.contentEditable == 'true') {
                    return true;
                }

                if (node.parentNode) {
                    return isContentEditable(node.parentNode);
                }

                return false;
            }

            function add_input_menu(node) {
                if (!node || SOCIALBROWSER.menuInputOFF) {
                    return;
                }

                if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || isContentEditable(node)) {
                    if (SOCIALBROWSER.customSetting.windowType !== 'main') {
                        let arr1 = [];
                        let arr2 = [];
                        SOCIALBROWSER.var.user_data_input.forEach((dd) => {
                            if (!dd.data || !Array.isArray(dd.data) || dd.data.length == 0) {
                                return;
                            }
                            dd.data.forEach((d) => {
                                if (node.value && !d.value.contains(node.value)) {
                                    return;
                                }
                                if (node.id && node.id == d.id) {
                                    if (!arr1.some((a) => a.label.trim() == d.value.trim())) {
                                        arr1.push({
                                            label: d.value,
                                            click() {
                                                SOCIALBROWSER.$type(node, d.value);
                                            },
                                        });

                                        arr2.push({
                                            label: d.value,
                                            click() {
                                                SOCIALBROWSER.$type(node, d.value).then(() => {
                                                    dd.data.forEach((d2) => {
                                                        if (d2.type == 'hidden' || d2.type == 'submit') {
                                                            return;
                                                        }
                                                        let e1 = null;
                                                        if (d2.id) {
                                                            e1 = document.getElementById(d2.id);
                                                        }
                                                        if (!e1 && d2.name) {
                                                            e1 = document.getElementsByName(d2.name);
                                                        }

                                                        if (e1) {
                                                            e1.value = d2.value;
                                                            e1.innerHTML = SOCIALBROWSER.policy.createHTML(d2.value);
                                                            if (e1.dispatchEvent) {
                                                                e1.dispatchEvent(inputEvent);
                                                                e1.dispatchEvent(changeEvent);
                                                            }
                                                        }
                                                    });
                                                });
                                            },
                                        });
                                    }
                                } else if (node.name && node.name == d.name) {
                                    let exists = false;
                                    arr1.forEach((a) => {
                                        if (a.label.trim() == d.value.trim()) {
                                            exists = true;
                                        }
                                    });
                                    if (!exists) {
                                        arr1.push({
                                            label: d.value,
                                            click() {
                                                SOCIALBROWSER.$type(node, d.value);
                                            },
                                        });

                                        arr2.push({
                                            label: d.value,
                                            click() {
                                                SOCIALBROWSER.$type(node, d.value).then(() => {
                                                    dd.data.forEach((d2) => {
                                                        if (d2.type == 'hidden' || d2.type == 'submit') {
                                                            return;
                                                        }
                                                        let e1 = null;
                                                        if (d2.id) {
                                                            e1 = document.getElementById(d2.id);
                                                        }
                                                        if (!e1 && d2.name) {
                                                            e1 = document.getElementsByName(d2.name);
                                                        }

                                                        if (e1) {
                                                            e1.value = d2.value;
                                                            e1.innerHTML = SOCIALBROWSER.policy.createHTML(d2.value);
                                                            if (e1.dispatchEvent) {
                                                                e1.dispatchEvent(inputEvent);
                                                                e1.dispatchEvent(changeEvent);
                                                            }
                                                        }
                                                    });
                                                });
                                            },
                                        });
                                    }
                                } else {
                                    let exists = false;
                                    arr1.forEach((a) => {
                                        if (a.label.trim() == d.value.trim()) {
                                            exists = true;
                                        }
                                    });
                                    if (!exists) {
                                        arr1.push({
                                            label: d.value,
                                            click() {
                                                SOCIALBROWSER.$type(node, d.value);
                                            },
                                        });
                                    }
                                }
                            });
                        });

                        SOCIALBROWSER.var.user_data.forEach((dd) => {
                            if (!dd.data) {
                                return;
                            }
                            dd.data.forEach((d) => {
                                if (arr1.some((a) => a.label.trim() == d.value.trim())) {
                                    return;
                                }
                                if (node.value && !d.value.contains(node.value)) {
                                    return;
                                }

                                if (node.id && node.id == d.id) {
                                    arr1.push({
                                        label: d.value,
                                        click() {
                                            SOCIALBROWSER.$type(node, d.value);
                                        },
                                    });

                                    arr2.push({
                                        label: d.value,
                                        click() {
                                            SOCIALBROWSER.$type(node, d.value).then(() => {
                                                dd.data.forEach((d2) => {
                                                    if (d2.type == 'hidden' || d2.type == 'submit') {
                                                        return;
                                                    }
                                                    let e1 = null;
                                                    if (d2.id) {
                                                        e1 = document.getElementById(d2.id);
                                                    }
                                                    if (!e1 && d2.name) {
                                                        e1 = document.getElementsByName(d2.name);
                                                    }

                                                    if (e1) {
                                                        e1.value = d2.value;
                                                        e1.innerHTML = SOCIALBROWSER.policy.createHTML(d2.value);
                                                        if (e1.dispatchEvent) {
                                                            e1.dispatchEvent(inputEvent);
                                                            e1.dispatchEvent(changeEvent);
                                                        }
                                                    }
                                                });
                                            });
                                        },
                                    });
                                } else if (node.name && node.name == d.name) {
                                    arr1.push({
                                        label: d.value,
                                        click() {
                                            SOCIALBROWSER.$type(node, d.value);
                                        },
                                    });

                                    arr2.push({
                                        label: d.value,
                                        click() {
                                            SOCIALBROWSER.$type(node, d.value).then(() => {
                                                dd.data.forEach((d2) => {
                                                    if (d2.type == 'hidden' || d2.type == 'submit') {
                                                        return;
                                                    }
                                                    let e1 = null;
                                                    if (d2.id) {
                                                        e1 = document.getElementById(d2.id);
                                                    }
                                                    if (!e1 && d2.name) {
                                                        e1 = document.getElementsByName(d2.name);
                                                    }

                                                    if (e1) {
                                                        e1.value = d2.value;
                                                        e1.innerHTML = SOCIALBROWSER.policy.createHTML(d2.value);
                                                        if (e1.dispatchEvent) {
                                                            e1.dispatchEvent(inputEvent);
                                                            e1.dispatchEvent(changeEvent);
                                                        }
                                                    }
                                                });
                                            });
                                        },
                                    });
                                } else {
                                    arr1.push({
                                        label: d.value,
                                        click() {
                                            SOCIALBROWSER.$type(node, d.value);
                                        },
                                    });
                                }
                            });
                        });

                        if (arr1.length > 0) {
                            arr1.sort((a, b) => (a.label > b.label ? 1 : -1));

                            SOCIALBROWSER.menuList.push({
                                label: 'Fill',
                                type: 'submenu',
                                submenu: arr1,
                            });
                        }
                        if (arr2.length > 0) {
                            arr2.sort((a, b) => (a.label > b.label ? 1 : -1));
                            SOCIALBROWSER.menuList.push({
                                label: 'Auto Fill All',
                                type: 'submenu',
                                submenu: arr2,
                            });
                        }
                    }

                    if (node.nodeName === 'INPUT' && (node.getAttribute('type') || '').toLowerCase() == 'password' && node.value.length > 0) {
                        SOCIALBROWSER.menuList.push({
                            label: 'Show Text',
                            click() {
                                node.setAttribute('type', 'text');
                            },
                        });
                    }

                    SOCIALBROWSER.menuList.push({
                        label: 'Paste',
                        click() {
                            SOCIALBROWSER.webContents.paste();
                        },
                    });

                    if (node.nodeName === 'INPUT' && (node.getAttribute('type') || '').toLowerCase() !== 'password' && node.value.length > 0) {
                        SOCIALBROWSER.menuList.push({
                            label: 'Hide Text',
                            click() {
                                node.setAttribute('type', 'password');
                            },
                        });
                    }

                    SOCIALBROWSER.menuList.push({
                        type: 'separator',
                    });

                    return;
                }
            }

            function get_url_menu_list(url) {
                let arr = [];
                if (SOCIALBROWSER.var.core.id.like('*developer*')) {
                    arr.push({
                        label: ' in Trusted window',
                        click() {
                            SOCIALBROWSER.ipc('[open new popup]', {
                                partition: SOCIALBROWSER.partition,
                                url: url,
                                referrer: document.location.href,
                                show: true,
                                iframe: true,
                                trusted: true,
                                center: true,
                            });
                        },
                    });
                    arr.push({
                        label: ' in Security OFF window',
                        click() {
                            SOCIALBROWSER.ipc('[open new popup]', {
                                partition: SOCIALBROWSER.partition,
                                url: url,
                                referrer: document.location.href,
                                show: true,
                                iframe: true,
                                security: false,
                                center: true,
                            });
                        },
                    });
                    arr.push({
                        label: ' in Not Sandbox window',
                        click() {
                            SOCIALBROWSER.ipc('[open new popup]', {
                                partition: SOCIALBROWSER.partition,
                                url: url,
                                referrer: document.location.href,
                                show: true,
                                iframe: true,
                                sandbox: false,
                                center: true,
                            });
                        },
                    });
                    arr.push({
                        label: ' in CloudFlare window',
                        click() {
                            SOCIALBROWSER.ipc('[open new popup]', {
                                partition: SOCIALBROWSER.partition,
                                url: url,
                                referrer: document.location.href,
                                show: true,
                                iframe: true,
                                cloudFlare: true,
                                allowAds: true,
                                allowPopup: true,
                                center: true,
                            });
                        },
                    });
                    arr.push({
                        type: 'separator',
                    });
                }
                arr.push({
                    label: ' in ( New tab )',
                    click() {
                        SOCIALBROWSER.ipc('[open new tab]', {
                            url: url,
                            referrer: document.location.href,
                            partition: SOCIALBROWSER.partition,
                            user_name: SOCIALBROWSER.session.display,
                            windowID: SOCIALBROWSER.window.id,
                        });
                    },
                });
                arr.push({
                    label: ' in ( New Ghost tab )',
                    click() {
                        let ghost = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;
                        SOCIALBROWSER.ipc('[open new tab]', { url: url, referrer: document.location.href, partition: ghost, user_name: ghost, windowID: SOCIALBROWSER.window.id });
                    },
                });
                arr.push({
                    label: ' in ( Current window )',
                    click() {
                        document.location.href = url;
                    },
                });
                arr.push({
                    label: ' in ( New window )',
                    click() {
                        SOCIALBROWSER.ipc('[open new popup]', {
                            url: url,
                            referrer: document.location.href,
                            partition: SOCIALBROWSER.partition,
                            show: true,
                            iframe: true,
                            center: true,
                            alwaysOnTop: true,
                        });
                    },
                });
                arr.push({
                    label: ' in ( Ads window )',
                    click() {
                        SOCIALBROWSER.ipc('[open new popup]', {
                            partition: SOCIALBROWSER.partition,
                            url: url,
                            referrer: document.location.href,
                            allowAds: true,
                            show: true,
                            center: true,
                            alwaysOnTop: true,
                        });
                    },
                });
                arr.push({
                    label: ' in ( OFF Window )',
                    click() {
                        SOCIALBROWSER.ipc('[open new popup]', {
                            partition: SOCIALBROWSER.partition,
                            url: url,
                            referrer: document.location.href,
                            allowAds: true,
                            off: true,
                            show: true,
                            center: true,
                            alwaysOnTop: true,
                        });
                    },
                });
                arr.push({
                    label: ' in ( Ghost window )',
                    click() {
                        let ghost = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;

                        SOCIALBROWSER.ipc('[open new popup]', {
                            url: url,
                            referrer: document.location.href,
                            partition: ghost,
                            user_name: ghost,
                            defaultUserAgent: SOCIALBROWSER.getRandomBrowser('pc'),
                            vpc: SOCIALBROWSER.generateVPC('pc'),
                            show: true,
                            iframe: true,
                            center: true,
                            alwaysOnTop: true,
                        });
                    },
                });
                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: ' in ( External Browser)',
                    click() {
                        SOCIALBROWSER.openExternal(document.location.href);
                    },
                });
                arr.push({
                    label: ' in ( Chrome Browser Simulator ) ',
                    click() {
                        SOCIALBROWSER.openInChrome({ auto: false, url: url });
                    },
                });
                arr.push({
                    label: ' in ( Chrome Browser Simulator ) [ Shared Cookies , User Data , Extentions ]',
                    click() {
                        SOCIALBROWSER.openInChrome({ auto: true, url: url });
                    },
                });

                if (SOCIALBROWSER.var.session_list.length > 1) {
                    arr.push({
                        type: 'separator',
                    });

                    SOCIALBROWSER.var.session_list
                        .filter((s) => !s.hide)
                        .forEach((ss, i) => {
                            arr.push({
                                label: ` As ( ${i + 1} ) [ ${ss.display} ] `,
                                click() {
                                    SOCIALBROWSER.ipc('[open new tab]', {
                                        referrer: document.location.href,
                                        url: url,
                                        partition: ss.name,
                                        user_name: ss.display,
                                        windowID: SOCIALBROWSER.window.id,
                                    });
                                },
                            });
                        });
                }
                return arr;
            }

            function add_a_menu(node) {
                if (!node || SOCIALBROWSER.menuAOFF) {
                    return;
                }

                if (node.nodeName === 'A' && node.getAttribute('href') && !node.getAttribute('href').startsWith('#')) {
                    let href = node.getAttribute('href');
                    let u = SOCIALBROWSER.handleURL(href);

                    let u_string = ' [ ' + u.substring(0, 70) + ' ] ';
                    if (u.like('mailto:*')) {
                        let mail = u.replace('mailto:', '');
                        SOCIALBROWSER.menuList.push({
                            label: `Copy Email ${u_string}`,
                            click() {
                                SOCIALBROWSER.copy(mail);
                            },
                        });
                        return;
                    } else {
                        SOCIALBROWSER.selectedURL = u;

                        SOCIALBROWSER.menuList.push({
                            label: `Open link ${u_string} in ( new tab ) `,
                            iconURL: 'http://127.0.0.1:60080/images/link.png',
                            click() {
                                SOCIALBROWSER.ipc('[open new tab]', {
                                    referrer: document.location.href,
                                    url: SOCIALBROWSER.handleURL(u),
                                    partition: SOCIALBROWSER.partition,
                                    user_name: SOCIALBROWSER.session.display,
                                    windowID: SOCIALBROWSER.window.id,
                                    center: true,
                                });
                            },
                        });

                        SOCIALBROWSER.menuList.push({
                            label: `Open link ${u_string} in ( current window ) `,
                            iconURL: 'http://127.0.0.1:60080/images/link.png',
                            click() {
                                document.location.href = u;
                            },
                        });

                        SOCIALBROWSER.menuList.push({
                            type: 'separator',
                        });

                        SOCIALBROWSER.menuList.push({
                            label: `Copy link ${u_string}`,
                            click() {
                                SOCIALBROWSER.copy(u);
                            },
                        });

                        let arr = get_url_menu_list(u);
                        SOCIALBROWSER.menuList.push({
                            label: `Open link ${u_string} `,
                            iconURL: 'http://127.0.0.1:60080/images/link.png',
                            type: 'submenu',
                            submenu: arr,
                        });
                    }
                    SOCIALBROWSER.menuList.push({
                        type: 'separator',
                    });

                    if (u.like('https://www.youtube.com/watch*')) {
                        SOCIALBROWSER.menuList.push({
                            label: 'Play Youtube video ',
                            click() {
                                SOCIALBROWSER.ipc('[open new popup]', {
                                    windowType: 'youtube',
                                    url: u || 'https://www.youtube.com/embed/' + u.split('=')[1].split('&')[0],
                                    partition: SOCIALBROWSER.partition,
                                    referrer: document.location.href,
                                    eval3: () => {
                                        // playing problem
                                        SOCIALBROWSER.onLoad(() => {
                                            SOCIALBROWSER.addCSS('#masthead-container{display:none}');
                                        });
                                    },
                                });
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Download Youtube video ',
                            click() {
                                SOCIALBROWSER.ipc('[open new popup]', {
                                    url: u.replace('youtube', 'ssyoutube'),
                                    partition: SOCIALBROWSER.partition,
                                    referrer: document.location.href,
                                    allowAds: true,
                                    allowPopup: true,
                                    show: true,
                                    center: true,
                                });
                            },
                        });

                        SOCIALBROWSER.menuList.push({
                            type: 'separator',
                        });
                    }

                    if (u.like('*youtube.com/short*')) {
                        SOCIALBROWSER.menuList.push({
                            label: 'Play Youtube Shorts video ',
                            click() {
                                SOCIALBROWSER.ipc('[open new popup]', {
                                    windowType: 'popup',
                                    title: 'YouTube',
                                    alwaysOnTop: true,
                                    center: true,
                                    width: 550,
                                    height: 850,
                                    show: true,
                                    url: u,
                                    partition: SOCIALBROWSER.partition,
                                    referrer: document.location.href,
                                    eval2: () => {
                                        SOCIALBROWSER.addCSS('#masthead-container{display:none}');
                                    },
                                });
                            },
                        });

                        SOCIALBROWSER.menuList.push({
                            type: 'separator',
                        });
                    }

                    return;
                }

                add_a_menu(node.parentNode);
            }

            function get_img_menu(node) {
                if (!node || SOCIALBROWSER.menuImgOFF) {
                    return;
                }

                if (node.nodeName == 'IMG' && node.getAttribute('src')) {
                    let url = node.getAttribute('src');
                    url = SOCIALBROWSER.handleURL(url);
                    u_string = ' [ ' + url.substring(0, 70) + ' ] ';
                    SOCIALBROWSER.menuList.push({
                        label: `Open image ${u_string} in ( new tab ) `,
                        click() {
                            SOCIALBROWSER.ipc('[open new tab]', {
                                url: url,
                                referrer: document.location.href,
                                windowID: SOCIALBROWSER.window.id,
                            });
                        },
                    });

                    let arr = get_url_menu_list(url);
                    SOCIALBROWSER.menuList.push({
                        label: `Open Image link ${u_string} `,
                        type: 'submenu',
                        submenu: arr,
                    });

                    SOCIALBROWSER.menuList.push({
                        label: `Copy image address ${u_string} `,
                        click() {
                            SOCIALBROWSER.copy(url);
                        },
                    });

                    SOCIALBROWSER.menuList.push({
                        label: `Save image ${u_string} `,
                        click() {
                            SOCIALBROWSER.downloadURL(url);
                            return;
                            sendToMain({
                                name: '[download-link]',
                                url: url,
                            });
                        },
                    });

                    SOCIALBROWSER.menuList.push({
                        type: 'separator',
                    });
                    return;
                }
                get_img_menu(node.parentNode);
            }

            function add_div_menu(node) {
                if (!node || SOCIALBROWSER.menuDivOFF) {
                    return;
                }

                if (node.nodeName === 'DIV') {
                    SOCIALBROWSER.menuList.push({
                        label: 'Copy inner text',
                        click() {
                            SOCIALBROWSER.copy(node.innerText);
                        },
                    });
                    SOCIALBROWSER.menuList.push({
                        label: 'Copy inner html',
                        click() {
                            SOCIALBROWSER.copy(node.innerText);
                        },
                    });
                    SOCIALBROWSER.menuList.push({
                        type: 'separator',
                    });
                    return;
                }
                add_div_menu(node.parentNode);
            }

            let isImageHidden = false;
            let image_interval = null;

            let isIframesDeleted = false;
            let iframe_interval = null;

            function removeIframes() {
                isIframesDeleted = true;
                iframe_interval = setInterval(() => {
                    document.querySelectorAll('iframe').forEach((frm) => {
                        frm.remove();
                    });
                }, 1000);
            }

            function get_options_menu(node) {
                if (SOCIALBROWSER.menuOptionsOFF) {
                    return;
                }

                let arr = [];

                arr.push({
                    label: 'Copy page Link',
                    click() {
                        SOCIALBROWSER.copy(window.location.href);
                    },
                });
                arr.push({
                    label: 'Copy Profile Name',
                    sublabel: SOCIALBROWSER.session.display,
                    click() {
                        SOCIALBROWSER.copy(SOCIALBROWSER.session.display);
                    },
                });
                arr.push({
                    label: 'Copy Profile ID',
                    sublabel: SOCIALBROWSER.session.name,
                    click() {
                        SOCIALBROWSER.copy(SOCIALBROWSER.session.name);
                    },
                });
                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: '[ Social Data]  / Copy as [ Encripted Text ] to Clipboard',
                    click() {
                        SOCIALBROWSER.copy(SOCIALBROWSER.hideObject(SOCIALBROWSER.getSiteData()));
                        alert('Site Data Text Copied !!');
                    },
                });
                arr.push({
                    label: '[ Social Data]  / Copy as [ online Code ] to Clipboard',
                    click() {
                        let code = SOCIALBROWSER.hideObject(SOCIALBROWSER.getSiteData());
                        SOCIALBROWSER.fetchJson({
                            method: 'POST',
                            url: 'https://social-browser.com/api/siteData',
                            headers: { 'X-Browser': (SOCIALBROWSER.var.core.brand || 'social') + '.' + SOCIALBROWSER.var.core.id },
                            data: {
                                code: code,
                                browserID: SOCIALBROWSER.var.core.id,
                            },
                        }).then((data) => {
                            console.log(data);
                            if (data.done && data.guid) {
                                SOCIALBROWSER.copy(data.guid);
                                alert('Site Data Code Copied !!');
                            }
                        });
                    },
                });

                arr.push({
                    label: '[ Social Data]  / Import from Clipboard ( in current profile )',
                    click() {
                        let txt = SOCIALBROWSER.clipboard.readText();
                        SOCIALBROWSER.importSiteData(txt, 0);
                    },
                });
                arr.push({
                    label: '[ Social Data]  / Import from Clipboard ( in Real profile )',
                    click() {
                        let txt = SOCIALBROWSER.clipboard.readText();
                        SOCIALBROWSER.importSiteData(txt, 1);
                    },
                });
                arr.push({
                    label: '[ Social Data]  / Import from Clipboard ( in Ghost profile )',
                    click() {
                        let txt = SOCIALBROWSER.clipboard.readText();
                        SOCIALBROWSER.importSiteData(txt, 2);
                    },
                });
                arr.push({
                    type: 'separator',
                });

                arr.push({
                    label: '[ Session Cookies]  / Copy as [ JSON Text ] to Clipboard',
                    click() {
                        SOCIALBROWSER.copy(SOCIALBROWSER.toJson(SOCIALBROWSER.getDomainCookies().cookies));
                        alert('Site Cookies JSON Text Copied !!');
                    },
                });
                arr.push({
                    label: '[ Session Cookies]  / Import from [ JSON Text ] from Clipboard',
                    click() {
                        SOCIALBROWSER.setDomainCookies({ cookies: SOCIALBROWSER.fromJson(SOCIALBROWSER.clipboard.readText()) });
                        alert('Site Cookies Imported !!');
                        SOCIALBROWSER.window.reload();
                    },
                });
                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: '[ HTTP Cookies ] / Copy as [ Text ] to Clipboard',
                    click() {
                        SOCIALBROWSER.copy(SOCIALBROWSER.getHttpCookie());
                        alert('Site HTTP Cookies Text Copied !!');
                    },
                });
                arr.push({
                    label: '[ HTTP Cookies ] / Set from [ Text ] from Clipboard',
                    click() {
                        SOCIALBROWSER.setHttpCookie({ cookie: SOCIALBROWSER.clipboard.readText(), mode: 0 });
                        alert('Site HTTP Cookies Set !!');
                        SOCIALBROWSER.window.reload();
                    },
                });
                arr.push({
                    label: '[ HTTP Cookies ] / Remove Imported Cookies',
                    click() {
                        SOCIALBROWSER.setHttpCookie({ cookie: '', off: true });
                        alert('Imported HTTP Cookies Removed !!');
                        SOCIALBROWSER.window.reload();
                    },
                });
                arr.push({
                    type: 'separator',
                });
                if (SOCIALBROWSER.var.core.flags.like('*v2*')) {
                    arr.push({
                        label: 'Copy Private Key',
                        click() {
                            SOCIALBROWSER.copy('_KEY_' + SOCIALBROWSER.md5(SOCIALBROWSER.var.core.id) + '_');
                        },
                    });

                    arr.push({
                        type: 'separator',
                    });
                }

                arr.push({
                    label: 'Save page',
                    accelerator: 'CommandOrControl+s',
                    click() {
                        SOCIALBROWSER.showUserMessage('Page Saving <br> ' + document.location.href);
                        SOCIALBROWSER.webContents.downloadURL(document.location.href);
                    },
                });

                arr.push({
                    label: 'Save page as PDF',
                    click() {
                        SOCIALBROWSER.showUserMessage('Page Saving as PDF: ' + document.location.href);
                        sendToMain({
                            name: '[save-window-as-pdf]',
                            windowID: SOCIALBROWSER.window.id,
                        });
                    },
                });

                arr.push({
                    label: 'Print page',
                    accelerator: 'CommandOrControl+p',
                    click() {
                        window.print();
                    },
                });

                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: 'Sound on/off',
                    click() {
                        SOCIALBROWSER.webContents.setAudioMuted(!SOCIALBROWSER.webContents.audioMuted);
                    },
                });
                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: 'Hard Refresh',
                    accelerator: 'CommandOrControl+F5',
                    click() {
                        SOCIALBROWSER.ipc('[window-reload-hard]', {
                            windowID: SOCIALBROWSER.window.id,
                            origin: document.location.origin || document.location.href,
                            partition: SOCIALBROWSER.partition,
                            storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
                        });
                    },
                });
                arr.push({
                    type: 'separator',
                });

                arr.push({
                    label: 'Full Screen',
                    accelerator: 'F11',
                    click() {
                        sendToMain({
                            name: '[toggle-fullscreen]',
                            windowID: SOCIALBROWSER.window.id,
                        });
                    },
                });

                arr.push({
                    type: 'separator',
                });

                arr.push({
                    label: 'Clear Site Cache',
                    accelerator: 'CommandOrControl+F5',
                    click() {
                        SOCIALBROWSER.ipc('[window-reload-hard]', {
                            windowID: SOCIALBROWSER.window.id,
                            origin: document.location.origin || document.location.href,
                            storages: ['appcache', 'filesystem', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
                        });
                    },
                });

                arr.push({
                    label: 'Clear Site Cookies',
                    click() {
                        SOCIALBROWSER.ipc('[window-reload-hard]', {
                            windowID: SOCIALBROWSER.window.id,
                            origin: document.location.origin || document.location.href,
                            storages: ['cookies'],
                        });
                    },
                });

                arr.push({
                    label: 'Clear All Site Data',
                    click() {
                        SOCIALBROWSER.ipc('[window-reload-hard]', {
                            windowID: SOCIALBROWSER.window.id,
                            origin: document.location.origin || document.location.href,
                            storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage', 'cookies'],
                        });
                    },
                });

                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: 'Hide window',
                    click() {
                        SOCIALBROWSER.window.setSkipTaskbar(true);
                        SOCIALBROWSER.window.setAlwaysOnTop(false);
                        SOCIALBROWSER.window.setFullScreen(false);
                        SOCIALBROWSER.webContents.setAudioMuted(true);
                        setTimeout(() => {
                            SOCIALBROWSER.window.hide();
                        }, 500);
                    },
                });
                arr.push({
                    label: 'Close window',
                    click() {
                        SOCIALBROWSER.window.close();
                    },
                });
                if (SOCIALBROWSER.var.core.id.like('*developer*')) {
                    arr.push({
                        label: 'Destroy window',
                        click() {
                            SOCIALBROWSER.window.destroy();
                        },
                    });
                }

                arr.push({
                    type: 'separator',
                });

                let m = {
                    label: 'Page',
                    sublabel: decodeURI(document.location.href),
                    iconURL: 'http://127.0.0.1:60080/images/page.png',
                    type: 'submenu',
                    submenu: arr,
                };

                SOCIALBROWSER.menuList.push(m);

                let arr2 = [];

                document.querySelectorAll('iframe').forEach((f, i) => {
                    if (i > 10) {
                        return;
                    }
                    if (f.src && !f.src.like('*javascript*') && !f.src.like('*about:*')) {
                        arr2.push({
                            label: 'View  ' + f.src,
                            click() {
                                SOCIALBROWSER.ipc('[open new popup]', {
                                    partition: SOCIALBROWSER.partition,
                                    url: 'http://127.0.0.1:60080/iframe?url=' + f.src,
                                    referrer: document.location.href,
                                    show: true,
                                    vip: true,
                                    center: true,
                                    alwaysOnTop: true,
                                });
                            },
                        });
                        arr2.push({
                            label: 'Open in ( New window  )',
                            click() {
                                SOCIALBROWSER.ipc('[open new popup]', {
                                    partition: SOCIALBROWSER.partition,
                                    url: f.src,
                                    referrer: document.location.href,
                                    show: true,
                                    center: true,
                                    alwaysOnTop: true,
                                });
                            },
                        });
                        arr2.push({
                            label: 'Open in ( Ads window )',
                            click() {
                                SOCIALBROWSER.ipc('[open new popup]', {
                                    partition: SOCIALBROWSER.partition,
                                    url: f.src,
                                    referrer: document.location.href,
                                    allowAds: true,
                                    show: true,
                                    center: true,
                                    alwaysOnTop: true,
                                });
                            },
                        });
                        arr2.push({
                            label: 'Copy link ',
                            click() {
                                SOCIALBROWSER.copy(f.src);
                            },
                        });
                        arr2.push({
                            label: 'Download link ',
                            click() {
                                sendToMain({
                                    name: '[download-link]',
                                    url: f.src,
                                });
                            },
                        });
                        arr2.push({
                            type: 'separator',
                        });
                    }
                });

                if (arr2.length > 0) {
                    let m2 = {
                        label: 'Page Frames',
                        iconURL: 'http://127.0.0.1:60080/images/page.png',
                        type: 'submenu',
                        submenu: arr2,
                    };
                    SOCIALBROWSER.menuList.push(m2);
                }

                let arr3 = [];

                SOCIALBROWSER.video_list.forEach((f, i) => {
                    if (i > 5 || !f.src.startsWith('http')) {
                        return;
                    }
                    arr3.push({
                        label: 'Play  ' + f.src,
                        click() {
                            SOCIALBROWSER.ipc('[open new popup]', {
                                alwaysOnTop: true,
                                partition: SOCIALBROWSER.partition,
                                url: 'browser://video?url=' + f.src,
                                referrer: document.location.href,
                                show: true,
                                vip: true,
                                center: true,
                            });
                        },
                    });

                    arr3.push({
                        label: 'Open in ( New window )',
                        click() {
                            SOCIALBROWSER.ipc('[open new popup]', {
                                alwaysOnTop: true,
                                partition: SOCIALBROWSER.partition,
                                url: f.src,
                                referrer: document.location.href,
                                show: true,
                                center: true,
                            });
                        },
                    });
                    arr3.push({
                        label: 'Open in ( Ghost window )',
                        click() {
                            let ghost = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;
                            SOCIALBROWSER.ipc('[open new popup]', {
                                alwaysOnTop: true,
                                partition: ghost,
                                user_name: ghost,
                                defaultUserAgent: SOCIALBROWSER.getRandomBrowser('pc'),
                                vpc: SOCIALBROWSER.generateVPC('pc'),
                                url: f.src,
                                referrer: document.location.href,
                                show: true,
                                iframe: true,
                                center: true,
                            });
                        },
                    });
                    arr3.push({
                        label: 'Open in ( Ads window )',
                        click() {
                            SOCIALBROWSER.ipc('[open new popup]', {
                                alwaysOnTop: true,
                                partition: SOCIALBROWSER.partition,
                                url: f.src,
                                referrer: document.location.href,
                                allowAds: true,
                                show: true,
                                center: true,
                            });
                        },
                    });
                    arr3.push({
                        label: 'download',
                        click() {
                            sendToMain({
                                name: '[download-link]',
                                url: f.src,
                            });
                        },
                    });

                    arr3.push({
                        label: 'copy link',
                        click() {
                            SOCIALBROWSER.copy(f.src);
                        },
                    });
                    arr3.push({
                        type: 'separator',
                    });
                });

                if (arr3.length > 0) {
                    let m3 = {
                        label: 'Page Videos',
                        type: 'submenu',
                        submenu: arr3,
                    };
                    SOCIALBROWSER.menuList.push(m3);
                    SOCIALBROWSER.menuList.push({
                        type: 'separator',
                    });
                }

                return;
            }

            function get_custom_menu() {
                if (SOCIALBROWSER.menuCustomOFF) {
                    return;
                }

                let vids = document.querySelectorAll('video');
                if (vids.length > 0) {
                    vids.forEach((v) => {
                        if (v.currentTime != v.duration && v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
                            SOCIALBROWSER.menuList.push({
                                label: 'Skip playing video ',
                                click() {
                                    v.currentTime = v.duration;
                                },
                            });
                            if (v.src.like('http*')) {
                                SOCIALBROWSER.menuList.push({
                                    label: 'Download playing video ',
                                    click() {
                                        sendToMain({
                                            name: '[download-link]',
                                            url: v.src,
                                        });
                                    },
                                });
                            }

                            SOCIALBROWSER.menuList.push({
                                type: 'separator',
                            });
                        }
                    });
                }

                if (document.location.href.like('https://www.youtube.com/watch*')) {
                    SOCIALBROWSER.menuList.push({
                        label: 'Open current video',
                        click() {
                            SOCIALBROWSER.ipc('[open new popup]', {
                                windowType: 'youtube',
                                url: document.location.href || 'https://www.youtube.com/embed/' + document.location.href.split('=')[1].split('&')[0],
                                partition: SOCIALBROWSER.partition,
                                referrer: document.location.href,
                            });
                        },
                    });

                    SOCIALBROWSER.menuList.push({
                        label: 'Download current video',
                        click() {
                            SOCIALBROWSER.ipc('[open new popup]', {
                                partition: SOCIALBROWSER.partition,
                                referrer: document.location.href,
                                url: document.location.href.replace('youtube', 'ssyoutube'),
                                show: true,
                                allowAds: true,
                                allowPopup: true,
                                center: true,
                                vip: true,
                            });
                        },
                    });

                    SOCIALBROWSER.menuList.push({
                        type: 'separator',
                    });
                }
            }
            function getCustomSettingMenu() {
                let arr = [];

                arr.push({
                    label: 'allow Default / Web Worker ( Solve Captcha Problems )',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.allowDefaultWorker || false,
                    click() {
                        SOCIALBROWSER.customSetting.allowDefaultWorker = !SOCIALBROWSER.customSetting.allowDefaultWorker;
                        SOCIALBROWSER.window.reload();
                    },
                });

                arr.push({
                    type: 'separator',
                });

                arr.push({
                    label: 'Block Load Images',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.blockImages || false,
                    click() {
                        SOCIALBROWSER.customSetting.blockImages = !SOCIALBROWSER.customSetting.blockImages;
                    },
                });
                arr.push({
                    label: 'Block Load Media / Videos',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.blockMedia || false,
                    click() {
                        SOCIALBROWSER.customSetting.blockMedia = !SOCIALBROWSER.customSetting.blockMedia;
                    },
                });
                arr.push({
                    label: 'Block Load JavaScript Files',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.blockJS || false,
                    click() {
                        SOCIALBROWSER.customSetting.blockJS = !SOCIALBROWSER.customSetting.blockJS;
                    },
                });
                arr.push({
                    label: 'Block XMLHttpRequest / fetch ',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.blockXHR || false,
                    click() {
                        SOCIALBROWSER.customSetting.blockXHR = !SOCIALBROWSER.customSetting.blockXHR;
                    },
                });
                arr.push({
                    label: 'Block Load Sub Frames',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.blockSubFrame || false,
                    click() {
                        SOCIALBROWSER.customSetting.blockSubFrame = !SOCIALBROWSER.customSetting.blockSubFrame;
                    },
                });
                arr.push({
                    label: 'Block Load CSS Files',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.blockCSS || false,
                    click() {
                        SOCIALBROWSER.customSetting.blockCSS = !SOCIALBROWSER.customSetting.blockCSS;
                    },
                });
                arr.push({
                    label: 'Block Load Fonts',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.blockFonts || false,
                    click() {
                        SOCIALBROWSER.customSetting.blockFonts = !SOCIALBROWSER.customSetting.blockFonts;
                    },
                });
                arr.push({
                    label: 'Block WebSocket connection',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.blockWebSocket || false,
                    click() {
                        SOCIALBROWSER.customSetting.blockWebSocket = !SOCIALBROWSER.customSetting.blockWebSocket;
                    },
                });
                arr.push({
                    label: 'Block CSP Reports',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.blockCspReport || false,
                    click() {
                        SOCIALBROWSER.customSetting.blockCspReport = !SOCIALBROWSER.customSetting.blockCspReport;
                    },
                });

                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: 'allow Ads',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.allowAds || false,
                    click() {
                        SOCIALBROWSER.customSetting.allowAds = !SOCIALBROWSER.customSetting.allowAds;
                    },
                });
                arr.push({
                    label: 'allow Popup',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.allowPopup || false,
                    click() {
                        SOCIALBROWSER.customSetting.allowPopup = !SOCIALBROWSER.customSetting.allowPopup;
                    },
                });
                arr.push({
                    label: 'allow URL Redirect',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.allowRedirect || false,
                    click() {
                        SOCIALBROWSER.customSetting.allowRedirect = !SOCIALBROWSER.customSetting.allowRedirect;
                    },
                });

                arr.push({
                    label: 'allow Open in External Apps',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.allowOpenExternal || false,
                    click() {
                        SOCIALBROWSER.customSetting.allowOpenExternal = !SOCIALBROWSER.customSetting.allowOpenExternal;
                    },
                });
                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: 'allow Cross Origin Requests',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.allowCrossOrigin || false,
                    click() {
                        SOCIALBROWSER.customSetting.allowCrossOrigin = !SOCIALBROWSER.customSetting.allowCrossOrigin;
                        SOCIALBROWSER.window.reload();
                    },
                });

                arr.push({
                    label: 'allow Google Translate',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.allowGoogleTranslate || false,
                    click() {
                        SOCIALBROWSER.customSetting.allowGoogleTranslate = !SOCIALBROWSER.customSetting.allowGoogleTranslate;
                        if (SOCIALBROWSER.customSetting.allowGoogleTranslate) {
                            SOCIALBROWSER.allowGoogleTranslate();
                        }
                    },
                });
                arr.push({
                    label: 'allow Download',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.allowDownload || false,
                    click() {
                        SOCIALBROWSER.customSetting.allowDownload = !SOCIALBROWSER.customSetting.allowDownload;
                    },
                });
                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: 'Mark window as [ White Site ]',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.isWhiteSite || false,
                    click() {
                        SOCIALBROWSER.customSetting.isWhiteSite = !SOCIALBROWSER.customSetting.isWhiteSite;
                        SOCIALBROWSER.window.reload();
                    },
                });
                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: 'turn off / [ Javascript Engine ]',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.javaScriptOFF || false,
                    click() {
                        SOCIALBROWSER.customSetting.javaScriptOFF = !SOCIALBROWSER.customSetting.javaScriptOFF;
                    },
                });
                arr.push({
                    label: 'turn off / [ Browser Engine ]',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.enginOFF || false,
                    click() {
                        SOCIALBROWSER.customSetting.enginOFF = !SOCIALBROWSER.customSetting.enginOFF;
                    },
                });
                arr.push({
                    label: 'turn off / [ ALL Engine ]',
                    type: 'checkbox',
                    checked: SOCIALBROWSER.customSetting.off || false,
                    click() {
                        SOCIALBROWSER.customSetting.off = !SOCIALBROWSER.customSetting.off;
                    },
                });
                if (SOCIALBROWSER.isDeveloperMode()) {
                    arr.push({
                        label: 'Allow Javascript SOCIALBROWSER',
                        type: 'checkbox',
                        checked: SOCIALBROWSER.customSetting.allowSocialBrowser || false,
                        click() {
                            SOCIALBROWSER.customSetting.allowSocialBrowser = !SOCIALBROWSER.customSetting.allowSocialBrowser;
                            SOCIALBROWSER.window.reload();
                        },
                    });
                }
                if (arr.length > 0) {
                    SOCIALBROWSER.menuList.push({
                        label: 'Custom Setting',
                        iconURL: 'http://127.0.0.1:60080/images/page.png',
                        type: 'submenu',
                        submenu: arr,
                    });

                    SOCIALBROWSER.menuList.push({
                        type: 'separator',
                    });
                }
            }

            function get2faMenu() {
                let arr = [];
                SOCIALBROWSER.var.faList.forEach((fa) => {
                    arr.push({
                        label: `Paste New Token ==> ${fa.email || fa.partition} / ${fa.domain}  /  ${fa.code}`,
                        click() {
                            SOCIALBROWSER.fetchJson({ url: 'https://2fa.live/tok/' + fa.code.replaceAll(' ', '') }).then((data) => {
                                if (data && data.token) {
                                    SOCIALBROWSER.copy(data.token);
                                    SOCIALBROWSER.paste();
                                } else {
                                    alert('Error While Get Token');
                                    SOCIALBROWSER.log(data);
                                }
                            });
                        },
                    });
                });

                if (arr.length > 0) {
                    SOCIALBROWSER.menuList.push({
                        label: '2FA Codes',
                        type: 'submenu',
                        submenu: arr,
                    });

                    SOCIALBROWSER.menuList.push({
                        type: 'separator',
                    });
                }
            }

            function getEmailMenu() {
                if (SOCIALBROWSER.var.core.emails && SOCIALBROWSER.var.core.emails.enabled && SOCIALBROWSER.session.display) {
                    let arr = [];

                    if (SOCIALBROWSER.session.display.contains('@')) {
                        arr.push({
                            label: 'paste - Current Email',
                            sublabel: SOCIALBROWSER.session.display,
                            click() {
                                SOCIALBROWSER.$paste(SOCIALBROWSER.session.display);
                            },
                        });
                        let currentLogin = SOCIALBROWSER.var.user_data_input.filter((d) => d.username == SOCIALBROWSER.session.display)[0];
                        if (currentLogin && currentLogin.password) {
                            arr.push({
                                label: 'paste - Current Password',
                                click() {
                                    SOCIALBROWSER.$paste(currentLogin.password);
                                },
                            });
                        }
                        if (SOCIALBROWSER.session.display.contains('@gmail.com')) {
                            arr.push({
                                label: 'Open - Gmail Inbox',
                                click() {
                                    SOCIALBROWSER.ipc('[open new popup]', {
                                        partition: SOCIALBROWSER.partition,
                                        referrer: document.location.href,
                                        url: 'https://mail.google.com/mail/u/0',
                                        show: true,
                                        allowDevTools: false,
                                        allowNewWindows: true,
                                        allowPopup: true,
                                        center: true,
                                        vip: true,
                                    });
                                },
                            });
                        }

                        if (SOCIALBROWSER.var.core.emails.domain) {
                            let newEmail = SOCIALBROWSER.session.display.split('@')[0] + '@' + SOCIALBROWSER.var.core.emails.domain;
                            if (newEmail !== SOCIALBROWSER.session.display) {
                                arr.push({
                                    label: 'paste - Temp Mail',
                                    sublabel: newEmail,
                                    click() {
                                        SOCIALBROWSER.$paste(newEmail);
                                    },
                                });
                            }

                            arr.push({
                                label: 'paste - OTP Code',
                                sublabel: newEmail,
                                click() {
                                    let _url = 'http://emails.' + SOCIALBROWSER.var.core.emails.domain + '/api/emails/view';
                                    SOCIALBROWSER.fetchJson(
                                        {
                                            url: _url,
                                            method: 'POST',
                                            headers: { 'X-Browser': (SOCIALBROWSER.var.core.brand || 'social') + '.' + SOCIALBROWSER.var.core.id },
                                            body: { to: newEmail },
                                        },
                                        (data) => {
                                            SOCIALBROWSER.log(data);
                                            if (data.isVIP && !data.doc) {
                                                SOCIALBROWSER.alert('EMail Address is Banned / Deleted ..');
                                            } else if (data.done && data.doc) {
                                                var codeRex = /(?:[-+() ]*\d){5,10}/gm;

                                                let email = data.doc;
                                                let code = email.subject.match(codeRex) || email.text.match(codeRex) || email.html.match(codeRex);
                                                if (code) {
                                                    code = code[0];
                                                    SOCIALBROWSER.$paste(code);
                                                    return true;
                                                } else {
                                                    alert('No Code Exists ..');
                                                }
                                            } else {
                                                alert('No Messages Found ..');
                                            }
                                        },
                                    );
                                },
                            });

                            arr.push({
                                type: 'separator',
                            });
                            arr.push({
                                label: 'Show / All Temp Mail Messages',
                                click() {
                                    SOCIALBROWSER.ipc('[open new popup]', {
                                        partition: SOCIALBROWSER.partition,
                                        referrer: document.location.href,
                                        url: 'http://emails.' + SOCIALBROWSER.var.core.emails.domain + '/vip?email=' + newEmail,
                                        show: true,
                                        allowDevTools: false,
                                        alwaysOnTop: true,
                                        trusted: true,
                                        vip: true,
                                        center: true,
                                        vip: true,
                                    });
                                },
                            });
                            arr.push({
                                type: 'separator',
                            });
                        }
                    } else {
                        arr.push({
                            label: 'paste - Current Profile Name',
                            click() {
                                SOCIALBROWSER.$paste(SOCIALBROWSER.session.display);
                            },
                        });
                        arr.push({
                            label: 'paste - Temp Email',
                            click() {
                                SOCIALBROWSER.$paste(SOCIALBROWSER.session.display + '@' + SOCIALBROWSER.tempMailServer);
                            },
                        });
                    }

                    if (SOCIALBROWSER.var.core.emails.password) {
                        arr.push({
                            label: 'paste - Default Password',
                            click() {
                                SOCIALBROWSER.$paste(SOCIALBROWSER.var.core.emails.password);
                            },
                        });
                    }
                    if (SOCIALBROWSER.var.core.emails.password2) {
                        arr.push({
                            label: 'paste - Default Password 2',
                            click() {
                                SOCIALBROWSER.$paste(SOCIALBROWSER.var.core.emails.password2);
                            },
                        });
                    }
                    if (SOCIALBROWSER.var.core.emails.password3) {
                        arr.push({
                            label: 'paste - Default Password 3',
                            click() {
                                SOCIALBROWSER.$paste(SOCIALBROWSER.var.core.emails.password3);
                            },
                        });
                    }

                    if (SOCIALBROWSER.session.user) {
                        arr.push({
                            type: 'separator',
                        });

                        if (SOCIALBROWSER.session.user.firstName) {
                            arr.push({
                                label: 'paste - First Name',
                                sublabel: SOCIALBROWSER.session.user.firstName,
                                click() {
                                    SOCIALBROWSER.$paste(SOCIALBROWSER.session.user.firstName);
                                },
                            });
                        }
                        if (SOCIALBROWSER.session.user.lastName) {
                            arr.push({
                                label: 'paste - Last Name',
                                sublabel: SOCIALBROWSER.session.user.lastName,
                                click() {
                                    SOCIALBROWSER.$paste(SOCIALBROWSER.session.user.lastName);
                                },
                            });
                        }
                        if (SOCIALBROWSER.session.user.birthDate) {
                            SOCIALBROWSER.session.user.birthDate = new Date(SOCIALBROWSER.session.user.birthDate);
                            arr.push({
                                label: 'paste - BirthDate',
                                sublabel: SOCIALBROWSER.session.user.birthDate.toLocaleDateString(),
                                click() {
                                    SOCIALBROWSER.$paste(SOCIALBROWSER.session.user.birthDate.toLocaleDateString());
                                },
                            });
                        }
                        let gender = SOCIALBROWSER.session.user.isFemale ? 'Female' : 'Male';
                        arr.push({
                            label: 'Gender is ' + gender + ' ( click to paste )',
                            click() {
                                SOCIALBROWSER.$paste(gender);
                            },
                        });
                    }

                    if (arr.length > 0) {
                        SOCIALBROWSER.menuList.push({
                            label: 'User Profile Information',
                            sublabel: 'Email + Passwords + Personal Data',
                            type: 'submenu',
                            submenu: arr,
                        });

                        SOCIALBROWSER.menuList.push({
                            type: 'separator',
                        });
                    }
                }
            }

            function createChromeMenu() {
                let arr = [];

                arr.push({
                    label: 'With Default Profile',
                    click() {
                        SOCIALBROWSER.openInChrome({
                            args: ['--start-maximized'],
                        });
                    },
                });

                arr.push({
                    label: 'With Amr Profile 1',
                    click() {
                        SOCIALBROWSER.openInChrome({
                            args: ['--start-maximized', '--profile-directory=Profile 1'],
                        });
                    },
                });
                arr.push({
                    label: 'With Amr Profile 2',
                    click() {
                        SOCIALBROWSER.openInChrome({
                            args: ['--start-maximized', '--profile-directory=Profile 2'],
                        });
                    },
                });
                arr.push({ type: 'separator' });

                SOCIALBROWSER.var.session_list
                    .filter((s) => !s.hide)
                    .forEach((s, i) => {
                        let currentID = SOCIALBROWSER.partition.replace('persist:', '');
                        let userID = s.name.replace('persist:', '');
                        arr.push({
                            label: ` As ( ${i + 1} ) [ ${s.display} ] `,
                            click() {
                                SOCIALBROWSER.openInChrome({
                                    userDataDir: SOCIALBROWSER.userDataDir.replace(currentID, userID) + '/chrome',
                                    //  args: ['--start-maximized', '--profile-directory=' + s.name],
                                });
                            },
                        });
                    });

                if (arr.length > 0) {
                    SOCIALBROWSER.menuList.push({
                        label: 'Open in Google Chrome',
                        iconURL: 'http://127.0.0.1:60080/images/chrome.png',
                        type: 'submenu',
                        submenu: arr,
                    });
                    SOCIALBROWSER.menuList.push({ type: 'separator' });
                }
            }

            function createDevelopmentMenu() {
                if (SOCIALBROWSER.menuTestOFF) {
                    return;
                }
                let arr = [];

                arr.push({
                    label: 'Inspect Element',
                    iconURL: 'http://127.0.0.1:60080/images/dev.png',
                    click() {
                        SOCIALBROWSER.webContents.inspectElement(SOCIALBROWSER.rightClickPosition.x2, SOCIALBROWSER.rightClickPosition.y2);
                        if (SOCIALBROWSER.webContents.isDevToolsOpened()) {
                            SOCIALBROWSER.webContents.devToolsWebContents.focus();
                        }
                    },
                });

                arr.push({
                    label: 'Developer Tools',
                    iconURL: 'http://127.0.0.1:60080/images/dev.png',
                    accelerator: 'F12',
                    click() {
                        SOCIALBROWSER.webContents.openDevTools();
                    },
                });

                SOCIALBROWSER.menuList.push({
                    type: 'separator',
                });

                arr.push({
                    label: 'Solve Google Captcha',
                    click() {
                        SOCIALBROWSER.sendMessage({ name: '[recaptcha-detected]' });
                    },
                });
                arr.push({ type: 'separator' });
                arr.push({
                    label: 'Exist Social Browser',
                    click() {
                        SOCIALBROWSER.ws({ type: '[close]' });
                    },
                });

                if (arr.length > 0) {
                    SOCIALBROWSER.menuList.push({
                        label: 'Development Menu',
                        iconURL: 'http://127.0.0.1:60080/images/dev.png',
                        type: 'submenu',
                        submenu: arr,
                    });
                }
            }

            function createMenuList(node) {
                if (SOCIALBROWSER.customSetting.windowType !== 'main') {
                    add_input_menu(node);
                    add_a_menu(node);

                    SOCIALBROWSER.menu_list.forEach((m) => {
                        SOCIALBROWSER.menuList.push(m);
                    });

                    if (SOCIALBROWSER.memoryText() && SOCIALBROWSER.isValidURL(SOCIALBROWSER.memoryText())) {
                        let arr = get_url_menu_list(SOCIALBROWSER.memoryText());
                        SOCIALBROWSER.menuList.push({
                            label: `Open link [ ${SOCIALBROWSER.memoryText().substring(0, 70)} ] `,
                            iconURL: 'http://127.0.0.1:60080/images/link.png',
                            type: 'submenu',
                            submenu: arr,
                        });

                        SOCIALBROWSER.menuList.push({ type: 'separator' });
                    } else {
                        if (SOCIALBROWSER.memoryText()) {
                            let stext = SOCIALBROWSER.memoryText().substring(0, 70);

                            SOCIALBROWSER.menuList.push({
                                label: `Translate [ ${stext} ] `,
                                iconURL: 'http://127.0.0.1:60080/images/translate.png',
                                click() {
                                    SOCIALBROWSER.ipc('[open new popup]', {
                                        partition: SOCIALBROWSER.partition,
                                        show: true,
                                        center: true,
                                        url: 'https://translate.google.com/?num=100&newwindow=1&um=1&ie=UTF-8&hl=en&client=tw-ob#auto/ar/' + encodeURIComponent(SOCIALBROWSER.memoryText()),
                                    });
                                },
                            });

                            SOCIALBROWSER.menuList.push({
                                label: `Search  [ ${stext} ] `,
                                iconURL: 'http://127.0.0.1:60080/images/search.png',
                                click() {
                                    SOCIALBROWSER.ipc('[open new tab]', {
                                        referrer: document.location.href,
                                        url: 'https://www.google.com/search?q=' + encodeURIComponent(SOCIALBROWSER.memoryText()),
                                        windowID: SOCIALBROWSER.window.id,
                                    });
                                },
                            });

                            SOCIALBROWSER.menuList.push({
                                type: 'separator',
                            });
                        }
                    }

                    get_img_menu(node);

                    if (SOCIALBROWSER.var.blocking.open_list.length > 0) {
                        SOCIALBROWSER.var.blocking.open_list.forEach((o) => {
                            if (o.enabled) {
                                if (o.multi) {
                                    let arr = get_url_menu_list(o.url || document.location.href);
                                    SOCIALBROWSER.menuList.push({
                                        iconURL: 'http://127.0.0.1:60080/images/menu.png',
                                        label: o.name,
                                        type: 'submenu',
                                        submenu: arr,
                                    });
                                } else {
                                    SOCIALBROWSER.menuList.push({
                                        label: o.name,
                                        iconURL: 'http://127.0.0.1:60080/images/menu.png',
                                        click() {
                                            SOCIALBROWSER.ipc('[open new tab]', {
                                                partition: SOCIALBROWSER.partition,
                                                url: o.url || document.location.href,
                                                referrer: document.location.href,
                                                show: true,
                                                windowID: SOCIALBROWSER.window.id,
                                            });
                                        },
                                    });
                                }

                                SOCIALBROWSER.menuList.push({
                                    type: 'separator',
                                });
                            }
                        });
                    }
                    //  createChromeMenu();
                    get_custom_menu();
                    if (SOCIALBROWSER.var.blocking.context_menu.copy_div_content) {
                        add_div_menu(node);
                    }

                    SOCIALBROWSER.menuList.push({
                        label: 'Refresh',
                        accelerator: 'F5',
                        iconURL: 'http://127.0.0.1:60080/images/reload.png',
                        click: function () {
                            SOCIALBROWSER.webContents.reload();
                        },
                    });

                    SOCIALBROWSER.menuList.push({
                        type: 'separator',
                    });

                    if (SOCIALBROWSER.var.blocking.context_menu.proxy_options) {
                        let arr = [];
                        arr.push({
                            label: 'open current URL in 5 Random Proxies ( Ghost Profile )',
                            click() {
                                SOCIALBROWSER.startProxyIndex = SOCIALBROWSER.startProxyIndex || 0;
                                SOCIALBROWSER.var.proxy_list.slice(SOCIALBROWSER.startProxyIndex, SOCIALBROWSER.startProxyIndex + 5).forEach((p, i) => {
                                    setTimeout(
                                        () => {
                                            SOCIALBROWSER.openNewPopup({
                                                show: true,
                                                url: document.location.href,
                                                proxy: p,
                                                partition: 'x-ghost_' + new Date().getTime(),
                                                iframe: true,
                                                center: true,
                                                eval: () => {
                                                    SOCIALBROWSER.onLoad(() => {
                                                        SOCIALBROWSER.$('title').innerHTML += ' , Prxoy : ' + SOCIALBROWSER.customSetting.proxy.url;
                                                    });
                                                },
                                            });
                                        },
                                        1000 * 2 * i,
                                    );
                                });
                                SOCIALBROWSER.startProxyIndex += 5;
                                if (SOCIALBROWSER.startProxyIndex > SOCIALBROWSER.var.proxy_list.length - 1) {
                                    SOCIALBROWSER.startProxyIndex = 0;
                                }
                            },
                        });
                        arr.push({
                            label: 'open current URL in 10 Random Proxies ( Ghost Profile )',
                            click() {
                                SOCIALBROWSER.startProxyIndex = SOCIALBROWSER.startProxyIndex || 0;
                                SOCIALBROWSER.var.proxy_list.slice(SOCIALBROWSER.startProxyIndex, SOCIALBROWSER.startProxyIndex + 10).forEach((p, i) => {
                                    setTimeout(
                                        () => {
                                            SOCIALBROWSER.openNewPopup({
                                                show: true,
                                                url: document.location.href,
                                                proxy: p,
                                                partition: 'x-ghost_' + new Date().getTime(),
                                                iframe: true,
                                                center: true,
                                                eval: () => {
                                                    SOCIALBROWSER.onLoad(() => {
                                                        SOCIALBROWSER.$('title').innerHTML += ' , Prxoy : ' + SOCIALBROWSER.customSetting.proxy.url;
                                                    });
                                                },
                                            });
                                        },
                                        1000 * 3 * i,
                                    );
                                });
                                SOCIALBROWSER.startProxyIndex += 10;
                                if (SOCIALBROWSER.startProxyIndex > SOCIALBROWSER.var.proxy_list.length - 1) {
                                    SOCIALBROWSER.startProxyIndex = 0;
                                }
                            },
                        });
                        arr.push({
                            label: 'open current URL in 50 Random Proxies ( Ghost Profile )',
                            click() {
                                SOCIALBROWSER.startProxyIndex = SOCIALBROWSER.startProxyIndex || 0;
                                SOCIALBROWSER.var.proxy_list.slice(SOCIALBROWSER.startProxyIndex, SOCIALBROWSER.startProxyIndex + 50).forEach((p, i) => {
                                    setTimeout(
                                        () => {
                                            SOCIALBROWSER.openNewPopup({
                                                show: true,
                                                url: document.location.href,
                                                proxy: p,
                                                partition: 'x-ghost_' + new Date().getTime(),
                                                iframe: true,
                                                center: true,
                                                eval: () => {
                                                    SOCIALBROWSER.onLoad(() => {
                                                        SOCIALBROWSER.$('title').innerHTML += ' , Prxoy : ' + SOCIALBROWSER.customSetting.proxy.url;
                                                    });
                                                },
                                            });
                                        },
                                        1000 * 5 * i,
                                    );
                                });
                                SOCIALBROWSER.startProxyIndex += 50;
                                if (SOCIALBROWSER.startProxyIndex > SOCIALBROWSER.var.proxy_list.length - 1) {
                                    SOCIALBROWSER.startProxyIndex = 0;
                                }
                            },
                        });
                        arr.push({
                            type: 'separator',
                        });
                        SOCIALBROWSER.var.proxy_list.slice(0, 50).forEach((p) => {
                            if (!p) {
                                return;
                            }
                            arr.push({
                                label: p.name || p.url,
                                sublabel: 'open use Proxy ( new Window / Ghost Profile )',
                                click() {
                                    SOCIALBROWSER.ipc('[open new popup]', {
                                        show: true,
                                        url: document.location.href,
                                        proxy: p,
                                        partition: 'x-ghost_' + new Date().getTime(),
                                        iframe: true,
                                        center: true,
                                    });
                                },
                            });
                        });

                        if (arr.length > 0) {
                            SOCIALBROWSER.menuList.push({
                                label: 'Proxy Menu Options',
                                type: 'submenu',
                                submenu: arr,
                            });
                        }
                    }

                    if (SOCIALBROWSER.var.blocking.context_menu.page_options) {
                        get_options_menu(node);
                    }
                    getCustomSettingMenu();
                    if (SOCIALBROWSER.var.blocking.context_menu.inspect && SOCIALBROWSER.customSetting.allowDevTools) {
                        SOCIALBROWSER.menuList.push({
                            type: 'separator',
                        });

                        SOCIALBROWSER.menuList.push({
                            label: 'Inspect Element',
                            iconURL: 'http://127.0.0.1:60080/images/dev.png',
                            click() {
                                SOCIALBROWSER.webContents.inspectElement(SOCIALBROWSER.rightClickPosition.x2, SOCIALBROWSER.rightClickPosition.y2);
                                if (SOCIALBROWSER.webContents.isDevToolsOpened()) {
                                    SOCIALBROWSER.webContents.devToolsWebContents.focus();
                                }
                            },
                        });
                    }

                    if (SOCIALBROWSER.var.blocking.context_menu.dev_tools && SOCIALBROWSER.customSetting.allowDevTools) {
                        SOCIALBROWSER.menuList.push({
                            label: 'Developer Tools',
                            iconURL: 'http://127.0.0.1:60080/images/dev.png',
                            accelerator: 'F12',
                            click() {
                                SOCIALBROWSER.webContents.openDevTools();
                            },
                        });
                    }

                    if (SOCIALBROWSER.var.core.id.like('*developer*')) {
                        createDevelopmentMenu();
                    }
                } else {
                    if (node.classList.contains('social-tab') && !node.classList.contains('plus')) {
                        let url = node.getAttribute('url');
                        let partition = node.getAttribute('partition');
                        let user_name = node.getAttribute('user_name');
                        let childProcessID = node.getAttribute('childProcessID');
                        SOCIALBROWSER.menuList.push({
                            label: 'New tab',
                            click() {
                                SOCIALBROWSER.ipc('[open new tab]', { main_window_id: SOCIALBROWSER.window.id });
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Duplicate tab',
                            click() {
                                SOCIALBROWSER.ipc('[open new tab]', { url: url, partition: partition, user_name: user_name, main_window_id: SOCIALBROWSER.window.id });
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            type: 'separator',
                        });

                        SOCIALBROWSER.menuList.push({
                            label: 'Hide tab',
                            click() {
                                node.classList.add('display-none');
                                browserTabs.layoutTabs();
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: '  Hide other tabs',
                            click() {
                                document.querySelectorAll('.social-tab:not(.plus)').forEach((el) => {
                                    if (el.id !== node.id) {
                                        el.classList.add('display-none');
                                    }
                                });
                                browserTabs.layoutTabs();
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Show hidden tabs',
                            click() {
                                document.querySelectorAll('.social-tab').forEach((t) => {
                                    t.classList.remove('display-none');
                                });
                                browserTabs.layoutTabs();
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            type: 'separator',
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'New Ghost tab',
                            click() {
                                let ghost = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;
                                SOCIALBROWSER.ipc('[open new tab]', { partition: ghost, iframe: true, user_name: ghost, main_window_id: SOCIALBROWSER.window.id });
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Duplicate tab in Ghost tab',
                            click() {
                                let ghost = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;
                                SOCIALBROWSER.ipc('[open new tab]', { url: url, partition: ghost, user_name: ghost, main_window_id: SOCIALBROWSER.window.id });
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            type: 'separator',
                        });

                        SOCIALBROWSER.menuList.push({
                            label: 'Duplicate tab in window',
                            click() {
                                SOCIALBROWSER.ipc('[open new popup]', {
                                    childProcessID: childProcessID,
                                    show: true,
                                    center: true,
                                    url: url,
                                    partition: partition,
                                    user_name: user_name,
                                    main_window_id: SOCIALBROWSER.window.id,
                                });
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Duplicate tab in Ghost window',
                            click() {
                                let ghost = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;
                                SOCIALBROWSER.ipc('[open new popup]', {
                                    childProcessID: childProcessID,
                                    show: true,
                                    center: true,
                                    url: url,
                                    partition: ghost,
                                    user_name: ghost,
                                    defaultUserAgent: SOCIALBROWSER.getRandomBrowser('pc'),
                                    vpc: SOCIALBROWSER.generateVPC('pc'),
                                    main_window_id: SOCIALBROWSER.window.id,
                                });
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            type: 'separator',
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Close',
                            click() {
                                client.call('remove-tab', node);
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Close other tabs',
                            click() {
                                document.querySelectorAll('.social-tab').forEach((node2) => {
                                    if (!node2.classList.contains('plus') && node.id !== node2.id) {
                                        client.call('remove-tab', node2);
                                    }
                                });
                            },
                        });

                        if (SOCIALBROWSER.var.core.id.contains('developer')) {
                            SOCIALBROWSER.menuList.push({
                                type: 'separator',
                            });

                            SOCIALBROWSER.menuList.push({
                                label: 'Inspect Element',
                                iconURL: 'http://127.0.0.1:60080/images/dev.png',
                                click() {
                                    SOCIALBROWSER.webContents.inspectElement(SOCIALBROWSER.rightClickPosition.x2, SOCIALBROWSER.rightClickPosition.y2);
                                    if (SOCIALBROWSER.webContents.isDevToolsOpened()) {
                                        SOCIALBROWSER.webContents.devToolsWebContents.focus();
                                    }
                                },
                            });

                            SOCIALBROWSER.menuList.push({
                                label: 'Developer Tools',
                                iconURL: 'http://127.0.0.1:60080/images/dev.png',
                                accelerator: 'F12',
                                click() {
                                    SOCIALBROWSER.webContents.openDevTools({
                                        mode: 'detach',
                                    });
                                },
                            });

                            SOCIALBROWSER.menuList.push({
                                label: 'Exist Social Browser',
                                click() {
                                    SOCIALBROWSER.ws({ type: '[close]' });
                                },
                            });
                        }
                    }
                }

                return;
            }

            SOCIALBROWSER.showMenu = function (menuList) {
                SOCIALBROWSER.menuList = menuList;
                SOCIALBROWSER.ipc('[show-menu]', {
                    list: SOCIALBROWSER.menuList?.map((m) => ({
                        label: m.label,
                        sublabel: m.sublabel,
                        visible: m.visible,
                        type: m.type,
                        checked: m.checked,
                        iconURL: m.iconURL,
                        submenu: m.submenu?.map((m2) => ({
                            label: m2.label,
                            type: m2.type,
                            checked: m2.checked,
                            sublabel: m2.sublabel,
                            visible: m2.visible,
                            iconURL: m2.iconURL,
                            submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, checked: m3.checked, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL })),
                        })),
                    })),
                });
            };

            SOCIALBROWSER.contextmenu = function (e) {
                if (SOCIALBROWSER.contextmenuBusy) {
                    return false;
                }
                SOCIALBROWSER.contextmenuBusy = true;
                setTimeout(() => {
                    SOCIALBROWSER.contextmenuBusy = false;
                }, 200);

                if (
                    !SOCIALBROWSER.rightClickPosition ||
                    !SOCIALBROWSER.rightClickPosition.x ||
                    !SOCIALBROWSER.rightClickPosition.y ||
                    !Number.isFinite(SOCIALBROWSER.rightClickPosition.x) ||
                    !Number.isFinite(SOCIALBROWSER.rightClickPosition.y)
                ) {
                    return false;
                }
                try {
                    e = e || { x: 0, y: 0 };
                    SOCIALBROWSER.memoryText = () => SOCIALBROWSER.readCopy();
                    SOCIALBROWSER.selectedText = () => (getSelection() || '').toString().trim();
                    SOCIALBROWSER.selectedURL = null;

                    SOCIALBROWSER.menuList = [];

                    let node = document.elementFromPoint(SOCIALBROWSER.rightClickPosition.x, SOCIALBROWSER.rightClickPosition.y);

                    if (SOCIALBROWSER.selectedText()) {
                        if (SOCIALBROWSER.isValidURL(SOCIALBROWSER.selectedText())) {
                            let arr = get_url_menu_list(SOCIALBROWSER.selectedText());
                            SOCIALBROWSER.menuList.push({
                                label: `Open link [ ${SOCIALBROWSER.selectedText().substring(0, 70)} ] `,
                                iconURL: 'http://127.0.0.1:60080/images/link.png',
                                type: 'submenu',
                                submenu: arr,
                            });

                            SOCIALBROWSER.menuList.push({ type: 'separator' });
                        }

                        let faMatch = SOCIALBROWSER.selectedText().match(/\w{4}\s\w{4}\s\w{4}\s\w{4}\s\w{4}\s\w{4}\s\w{4}\s\w{4}/);
                        if (faMatch) {
                            let code = faMatch[0].replaceAll(' ', '');
                            SOCIALBROWSER.menuList.push({
                                label: `Save as 2FA Code : [ ${code} ] `,
                                click() {
                                    SOCIALBROWSER.add2faCode(code);
                                    SOCIALBROWSER.fetchJson({ url: 'https://2fa.live/tok/' + code }).then((data) => {
                                        if (data && data.token) {
                                            SOCIALBROWSER.copy(data.token);
                                            alert('Saved as 2FA Code & Copy New Token : ' + data.token);
                                        } else {
                                            alert('Saved But : Error While Checking Token');
                                            SOCIALBROWSER.log(data);
                                        }
                                    });
                                },
                            });
                            SOCIALBROWSER.menuList.push({
                                label: `Get 2FA Code : [ ${code} ] `,
                                click() {
                                    SOCIALBROWSER.fetchJson({
                                        url: 'https://2fa.live/tok/' + code,
                                    }).then((data) => {
                                        if (data && data.token) {
                                            alert('New Token : ' + data.token);
                                        } else {
                                            alert('Error While Checking Token');
                                            SOCIALBROWSER.log(data);
                                        }
                                    });
                                },
                            });

                            SOCIALBROWSER.menuList.push({ type: 'separator' });
                        }

                        let stext = SOCIALBROWSER.selectedText().substring(0, 70);
                        SOCIALBROWSER.menuList.push({
                            label: 'Cut',
                            click() {
                                SOCIALBROWSER.webContents.cut();
                            },
                        });

                        SOCIALBROWSER.menuList.push({
                            label: `Copy`,
                            click() {
                                SOCIALBROWSER.copy(SOCIALBROWSER.selectedText());
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Paste',
                            click() {
                                SOCIALBROWSER.webContents.paste();
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Delete',
                            click() {
                                SOCIALBROWSER.webContents.delete();
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: `Translate [ ${stext} ] `,
                            iconURL: 'http://127.0.0.1:60080/images/translate.png',
                            click() {
                                SOCIALBROWSER.ipc('[open new popup]', {
                                    partition: SOCIALBROWSER.partition,
                                    show: true,
                                    center: true,
                                    url: 'https://translate.google.com/?num=100&newwindow=1&um=1&ie=UTF-8&hl=en&client=tw-ob#auto/ar/' + encodeURIComponent(SOCIALBROWSER.selectedText()),
                                });
                            },
                        });

                        SOCIALBROWSER.menuList.push({
                            label: `Search  [ ${stext} ] `,
                            iconURL: 'http://127.0.0.1:60080/images/search.png',
                            click() {
                                SOCIALBROWSER.ipc('[open new tab]', {
                                    referrer: document.location.href,
                                    url: 'https://www.google.com/search?q=' + encodeURIComponent(SOCIALBROWSER.selectedText()),
                                    windowID: SOCIALBROWSER.window.id,
                                });
                            },
                        });

                        SOCIALBROWSER.menuList.push({
                            type: 'separator',
                        });

                        if (SOCIALBROWSER.var.core.flags.like('*v2*')) {
                            if (SOCIALBROWSER.selectedText().startsWith('_') && SOCIALBROWSER.selectedText().endsWith('_')) {
                                if (SOCIALBROWSER.selectedText().startsWith('_PUBLIC_')) {
                                    SOCIALBROWSER.menuList.push({
                                        label: 'Decrypt By [ Public Key ]',
                                        click() {
                                            SOCIALBROWSER.decryptedText = SOCIALBROWSER.decryptText(SOCIALBROWSER.selectedText().replace('_PUBLIC_', '').replace('_', ''));
                                            SOCIALBROWSER.replaceSelectedText(SOCIALBROWSER.decryptedText);
                                        },
                                    });
                                } else if (SOCIALBROWSER.selectedText().startsWith('_SITE_')) {
                                    SOCIALBROWSER.menuList.push({
                                        label: 'Decrypt By [ Site Key ]',
                                        click() {
                                            SOCIALBROWSER.decryptedText = SOCIALBROWSER.decryptText(SOCIALBROWSER.selectedText().replace('_SITE_', '').replace('_', ''), SOCIALBROWSER.domain);
                                            SOCIALBROWSER.replaceSelectedText(SOCIALBROWSER.decryptedText);
                                        },
                                    });
                                } else if (SOCIALBROWSER.selectedText().startsWith('_PRIVATE_')) {
                                    SOCIALBROWSER.menuList.push({
                                        label: 'Decrypt By [ Private Key ]',
                                        click() {
                                            SOCIALBROWSER.decryptedText = SOCIALBROWSER.decryptText(
                                                SOCIALBROWSER.selectedText().replace('_PRIVATE_', '').replace('_', ''),
                                                SOCIALBROWSER.md5(SOCIALBROWSER.var.core.id),
                                            );
                                            SOCIALBROWSER.replaceSelectedText(SOCIALBROWSER.decryptedText);
                                        },
                                    });
                                    if (SOCIALBROWSER.var.privateKeyList.length > 0) {
                                        SOCIALBROWSER.menuList.push({
                                            type: 'separator',
                                        });
                                        let arr = [];
                                        SOCIALBROWSER.var.privateKeyList.forEach((info) => {
                                            arr.push({
                                                label: ' [ Key : ' + (info.name || info.key) + ' ]',
                                                click() {
                                                    SOCIALBROWSER.decryptedText = SOCIALBROWSER.decryptText(SOCIALBROWSER.selectedText().replace('_PRIVATE_', '').replace('_', ''), info.key);
                                                    SOCIALBROWSER.replaceSelectedText(SOCIALBROWSER.decryptedText);
                                                },
                                            });
                                        });
                                        if (arr.length > 0) {
                                            SOCIALBROWSER.menuList.push({
                                                label: 'Decrypt By',
                                                type: 'submenu',
                                                submenu: arr,
                                            });
                                        }
                                    }
                                } else if (SOCIALBROWSER.selectedText().startsWith('_KEY_')) {
                                    SOCIALBROWSER.menuList.push({
                                        label: 'Add To Private Key List',
                                        click() {
                                            SOCIALBROWSER.var.privateKeyList = SOCIALBROWSER.var.privateKeyList || [];
                                            let key = SOCIALBROWSER.selectedText().replace('_KEY_', '').replace('_', '');
                                            if (!SOCIALBROWSER.var.privateKeyList.some((info) => info.key === key)) {
                                                SOCIALBROWSER.var.privateKeyList.push({ name: key, key: key });
                                                SOCIALBROWSER.updateBrowserVar('privateKeyList', SOCIALBROWSER.var.privateKeyList);

                                                alert('Private Key Added To Private Key List');
                                            } else {
                                                alert('Private Key Exists');
                                            }
                                        },
                                    });
                                }
                            } else {
                                let arr = [];
                                arr.push({
                                    label: 'Encrypt By [ Public Key ]',
                                    click() {
                                        SOCIALBROWSER.encryptedText = SOCIALBROWSER.encryptText(SOCIALBROWSER.selectedText());
                                        if (SOCIALBROWSER.encryptedText) {
                                            SOCIALBROWSER.encryptedText = '_PUBLIC_' + SOCIALBROWSER.encryptedText + '_';
                                            SOCIALBROWSER.replaceSelectedText(SOCIALBROWSER.encryptedText);
                                        }
                                    },
                                });
                                arr.push({
                                    label: 'Encrypt By [ Site Key ]',
                                    click() {
                                        SOCIALBROWSER.encryptedText = SOCIALBROWSER.encryptText(SOCIALBROWSER.selectedText(), SOCIALBROWSER.domain);
                                        if (SOCIALBROWSER.encryptedText) {
                                            SOCIALBROWSER.encryptedText = '_SITE_' + SOCIALBROWSER.encryptedText + '_';
                                            SOCIALBROWSER.replaceSelectedText(SOCIALBROWSER.encryptedText);
                                        }
                                    },
                                });
                                arr.push({
                                    label: 'Encrypt By [ Private Key ]',
                                    click() {
                                        SOCIALBROWSER.encryptedText = SOCIALBROWSER.encryptText(SOCIALBROWSER.selectedText(), SOCIALBROWSER.md5(SOCIALBROWSER.var.core.id));
                                        if (SOCIALBROWSER.encryptedText) {
                                            SOCIALBROWSER.encryptedText = '_PRIVATE_' + SOCIALBROWSER.encryptedText + '_';
                                            SOCIALBROWSER.replaceSelectedText(SOCIALBROWSER.encryptedText);
                                        }
                                    },
                                });
                                if (SOCIALBROWSER.var.privateKeyList.length > 0) {
                                    arr.push({
                                        type: 'separator',
                                    });

                                    SOCIALBROWSER.var.privateKeyList.forEach((info) => {
                                        arr.push({
                                            label: ' [ Key : ' + (info.name || info.key) + ' ]',
                                            click() {
                                                SOCIALBROWSER.encryptedText = SOCIALBROWSER.encryptText(SOCIALBROWSER.selectedText(), info.key);
                                                if (SOCIALBROWSER.encryptedText) {
                                                    SOCIALBROWSER.encryptedText = '_PRIVATE_' + SOCIALBROWSER.encryptedText + '_';
                                                    SOCIALBROWSER.replaceSelectedText(SOCIALBROWSER.encryptedText);
                                                }
                                            },
                                        });
                                    });
                                }
                                if (arr.length > 0) {
                                    SOCIALBROWSER.menuList.push({
                                        label: 'Encrypt By',
                                        type: 'submenu',
                                        submenu: arr,
                                    });
                                }
                            }

                            SOCIALBROWSER.menuList.push({
                                type: 'separator',
                            });
                        }
                    } else {
                        if (!node || !!node.oncontextmenu) {
                            return null;
                        }

                        if (!SOCIALBROWSER.customSetting.allowMenu) {
                            add_input_menu(node);
                        } else {
                            createMenuList(node);
                        }
                    }
                    if (!SOCIALBROWSER.customSetting.windowType.contain('main|address|profile')) {
                        getEmailMenu();
                        get2faMenu();
                        if ((scriptsMenu = true)) {
                            let arr = [];

                            let scriptList = SOCIALBROWSER.var.scriptList.filter(
                                (s) => s.show && !document.location.href.like('*127.0.0.1:60080*|*file://*') && document.location.href.like(s.allowURLs) && !document.location.href.like(s.blockURLs),
                            );

                            arr.push({
                                label: 'Translate this page',
                                iconURL: 'http://127.0.0.1:60080/images/code.png',
                                click: () => {
                                    SOCIALBROWSER.ipc('[window-action]', { name: 'translate' });
                                },
                            });
                            arr.push({
                                label: 'Edit Page Content',
                                iconURL: 'http://127.0.0.1:60080/images/code.png',
                                click: () => {
                                    SOCIALBROWSER.ipc('[toggle-window-edit]');
                                },
                            });
                            arr.push({
                                label: 'Hide / Show - Page Images',
                                iconURL: 'http://127.0.0.1:60080/images/code.png',
                                click: () => {
                                    SOCIALBROWSER.ipc('[window-action]', { name: 'toggle-page-images' });
                                },
                            });
                            arr.push({
                                label: 'Hide / Show - Page Content',
                                iconURL: 'http://127.0.0.1:60080/images/code.png',
                                click: () => {
                                    SOCIALBROWSER.ipc('[window-action]', { name: 'toggle-page-content' });
                                },
                            });

                            if (scriptList.length > 0) {
                                arr.push({
                                    type: 'separator',
                                });
                                scriptList.forEach((script) => {
                                    arr.push({
                                        label: script.title,
                                        iconURL: 'http://127.0.0.1:60080/images/code.png',
                                        click: () => {
                                            SOCIALBROWSER.ipc('[run-user-script]', { windowID: SOCIALBROWSER.window.id, script: script });
                                        },
                                    });
                                });
                            }
                            SOCIALBROWSER.menuList.push({ type: 'separator' });
                            SOCIALBROWSER.menuList.push({
                                label: 'User Scripts',
                                iconURL: 'http://127.0.0.1:60080/images/code.png',
                                type: 'submenu',
                                submenu: arr,
                            });
                        }
                    }

                    if (SOCIALBROWSER.menuList.length > 0) {
                        SOCIALBROWSER.showMenu(SOCIALBROWSER.menuList);
                    }
                } catch (error) {
                    SOCIALBROWSER.log(error);
                }
            };

            if (SOCIALBROWSER.isIframe()) {
                window.addEventListener('contextmenu', (e) => {
                    e.preventDefault();

                    if (SOCIALBROWSER.webContents.isDevToolsOpened()) {
                        return;
                    }

                    let factor = SOCIALBROWSER.webContents.zoomFactor || 1;

                    if (e.x) {
                        SOCIALBROWSER.rightClickPosition = {
                            y: Math.round(e.y / factor),
                            x2: Math.round(e.x),
                            y2: Math.round(e.y),
                        };
                    }
                    SOCIALBROWSER.contextmenu(e);
                });
            } else {
                SOCIALBROWSER.on('context-menu', (e, data) => {
                    let factor = SOCIALBROWSER.webContents.zoomFactor || 1;
                    if (data.x) {
                        SOCIALBROWSER.rightClickPosition = {
                            x: Math.round(data.x / factor),
                            y: Math.round(data.y / factor),
                            x2: Math.round(data.x),
                            y2: Math.round(data.y),
                        };
                    }

                    SOCIALBROWSER.contextmenu(data);
                });
            }

            window.addEventListener('mouseup', (e) => {
                if (SOCIALBROWSER.webContents.isDevToolsOpened()) {
                    return;
                }
                if (e.target.tagName.like('video')) {
                    return;
                }
                let rightclick;
                if (!e) var e = window.event;
                if (e.which) {
                    rightclick = e.which == 3;
                } else if (e.button) {
                    rightclick = e.button == 2;
                }
                if (rightclick) {
                    let factor = SOCIALBROWSER.webContents.zoomFactor || 1;
                    SOCIALBROWSER.rightClickPosition = {
                        x: Math.round(e.clientX),
                        y: Math.round(e.clientY),
                        x2: Math.round(e.clientX * factor),
                        y2: Math.round(e.clientY * factor),
                    };
                    SOCIALBROWSER.contextmenu(e);
                }
            });

            SOCIALBROWSER.on('[run-menu]', (e, data) => {
                if (SOCIALBROWSER.menuList.length == 0) {
                    return;
                }
                if (typeof data.index !== 'undefined' && typeof data.index2 !== 'undefined' && typeof data.index3 !== 'undefined') {
                    let m = SOCIALBROWSER.menuList[data.index];
                    if (m && m.submenu) {
                        let m2 = m.submenu[data.index2];
                        if (m2 && m2.submenu) {
                            let m3 = m2.submenu[data.index3];
                            m3.click();
                        }
                    }
                } else if (typeof data.index !== 'undefined' && typeof data.index2 !== 'undefined') {
                    let m = SOCIALBROWSER.menuList[data.index];
                    if (m && m.submenu) {
                        let m2 = m.submenu[data.index2];
                        if (m2) {
                            m2.click();
                        }
                    }
                } else if (typeof data.index !== 'undefined') {
                    let m = SOCIALBROWSER.menuList[data.index];
                    if (m && m.click) {
                        m.click();
                    }
                }
                SOCIALBROWSER.menuList = [];
            });
        }
    })();

    (function loadCloudflare() {
        if (SOCIALBROWSER.javaScriptOFF) {
            return;
        }
        if (document.location.href.like('*://challenges.cloudflare.com/*')) {
            SOCIALBROWSER.sendMessage({ name: '[captcha-detected]' });
            SOCIALBROWSER.customSetting.$cloudFlare = true;
            if (SOCIALBROWSER.var.blocking.javascript.cloudflareON) {
                if (document.location.href.like('*://challenges.cloudflare.com/*')) {
                    SOCIALBROWSER.sendMessage({ name: '[cloudflare-detected]' });

                    SOCIALBROWSER.onLoad(() => {
                        async function ShadowFinder() {
                            const eventNames = ['mouseover', 'mouseenter', 'mousedown', 'mouseup', 'click', 'mouseout'];
                            const delay = async (milliseconds) => await new Promise((resolve) => setTimeout(resolve, milliseconds));
                            const randomInteger = (n, r) => {
                                return Math.floor(Math.random() * (r - n + 1)) + n;
                            };
                            const simulateMouseClick = (element, box, clientX = null, clientY = null) => {
                                return SOCIALBROWSER.click(element);
                                box = element.getBoundingClientRect();

                                clientX = randomInteger(box.left, box.left + box.width);
                                clientY = randomInteger(box.top, box.top + box.height);

                                eventNames.forEach((eventName) => {
                                    const event = new MouseEvent(eventName, {
                                        detail: eventName === 'mouseover' ? 0 : 1,
                                        view: window,
                                        bubbles: true,
                                        cancelable: true,
                                        clientX: clientX,
                                        clientY: clientY,
                                    });
                                    element.dispatchEvent(event);
                                });
                            };

                            async function Click2(shadowRoot) {
                                if (shadowRoot.querySelector('div[style*="display: grid"] > div > label')) {
                                    const element = shadowRoot.querySelector('div[style*="display: grid"] > div input');

                                    if (element) {
                                        if (element.getAttribute('aria-checked') !== null) {
                                        } else {
                                            simulateMouseClick(element);
                                        }
                                    }
                                }
                                await delay(randomInteger(200, 4000));
                                Click2(shadowRoot);
                            }

                            const originalAttachShadow = Element.prototype.attachShadow;
                            Element.prototype.attachShadow = function (init) {
                                let shadowRoot = originalAttachShadow.call(this, init);
                                window.parent !== window && shadowRoot ? Click2(shadowRoot) : undefined;
                                return shadowRoot;
                            };
                        }
                        ShadowFinder();
                        // const attachShadowReplacement = '(' + ShadowFinder.toString().replace('ShadowFinder', '') + ')();';
                        // SOCIALBROWSER.eval(attachShadowReplacement);
                    });
                }
            }
        }
    })();

    (function loadGoogleCapatch() {
        if (SOCIALBROWSER.javaScriptOFF) {
            return;
        }

        window.addEventListener('urlchange', () => {
            SOCIALBROWSER.log('location changed');
        });

        if (document.location.href.like('*://*/recaptcha/*')) {
            SOCIALBROWSER.sendMessage({ name: '[recaptcha-detected]' });

            if (SOCIALBROWSER.var.blocking.javascript.googleCaptchaON) {
                SOCIALBROWSER.onLoad(() => {
                    (function () {
                        function qSelectorAll(selector) {
                            return document.querySelectorAll(selector);
                        }

                        function qSelector(selector) {
                            return document.querySelector(selector);
                        }

                        let solved = false;
                        let checkBoxClicked = false;
                        let waitingForAudioResponse = false;

                        const CHECK_BOX = '.recaptcha-checkbox-border';
                        const AUDIO_BUTTON = '#recaptcha-audio-button';
                        const PLAY_BUTTON = '.rc-audiochallenge-play-button .rc-button-default';
                        const AUDIO_SOURCE = '#audio-source';
                        const IMAGE_SELECT = '#rc-imageselect';
                        const RESPONSE_FIELD = '.rc-audiochallenge-response-field';
                        const AUDIO_ERROR_MESSAGE = '.rc-audiochallenge-error-message';
                        const AUDIO_RESPONSE = '#audio-response';
                        const RELOAD_BUTTON = '#recaptcha-reload-button';
                        const RECAPTCHA_STATUS = '#recaptcha-accessible-status';
                        const DOSCAPTCHA = '.rc-doscaptcha-body';
                        const VERIFY_BUTTON = '#recaptcha-verify-button';
                        const MAX_ATTEMPTS = 5;
                        let requestCount = 0;
                        let recaptchaLanguage = qSelector('html').getAttribute('lang');
                        let audioUrl = '';
                        let recaptchaInitialStatus = qSelector(RECAPTCHA_STATUS) ? qSelector(RECAPTCHA_STATUS).innerText : '';
                        let serversList = [
                            SOCIALBROWSER.from123('431932754619268325738657455847524278377641538271483932614578825245595779431837734234825445787591'),
                            SOCIALBROWSER.from123('431932754619268325738657455847524278377641541668461957754318866841388282477852574658366841788667'),
                        ];
                        let latencyList = Array(serversList.length).fill(10000);

                        function isHidden(el) {
                            return el.offsetParent === null;
                        }

                        async function getTextFromAudio(URL) {
                            let minLatency = 100000;
                            let url = '';

                            for (let k = 0; k < latencyList.length; k++) {
                                if (latencyList[k] <= minLatency) {
                                    minLatency = latencyList[k];
                                    url = serversList[k];
                                }
                            }

                            requestCount = requestCount + 1;
                            URL = URL.replace('recaptcha.net', 'google.com');
                            if (recaptchaLanguage.length < 1) {
                                SOCIALBROWSER.log('Recaptcha Language is not recognized');
                                recaptchaLanguage = 'en-US';
                            }

                            SOCIALBROWSER.log('Recaptcha Language is ' + recaptchaLanguage);

                            SOCIALBROWSER.fetch({
                                method: 'POST',
                                url: url,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                data: 'input=' + encodeURIComponent(URL) + '&lang=' + recaptchaLanguage,
                                timeout: 60000,
                                onload: function (response) {
                                    SOCIALBROWSER.log('Response::' + response.responseText);
                                    try {
                                        if (response && response.responseText) {
                                            var responseText = response.responseText;
                                            if (responseText == '0' || responseText.includes('<') || responseText.includes('>') || responseText.length < 2 || responseText.length > 50) {
                                                SOCIALBROWSER.log('Invalid Response. Retrying..');
                                            } else if (
                                                qSelector(AUDIO_SOURCE) &&
                                                qSelector(AUDIO_SOURCE).src &&
                                                audioUrl == qSelector(AUDIO_SOURCE).src &&
                                                qSelector(AUDIO_RESPONSE) &&
                                                !qSelector(AUDIO_RESPONSE).value &&
                                                qSelector(AUDIO_BUTTON).style.display == 'none' &&
                                                qSelector(VERIFY_BUTTON)
                                            ) {
                                                qSelector(AUDIO_RESPONSE).value = responseText;
                                                qSelector(VERIFY_BUTTON).click();
                                            } else {
                                                SOCIALBROWSER.log('Could not locate text input box');
                                            }
                                            waitingForAudioResponse = false;
                                        }
                                    } catch (err) {
                                        SOCIALBROWSER.log(err.message);
                                        SOCIALBROWSER.log('Exception handling response. Retrying..');
                                        waitingForAudioResponse = false;
                                    }
                                },
                                onerror: function (e) {
                                    SOCIALBROWSER.log(e);
                                    waitingForAudioResponse = false;
                                },
                                ontimeout: function () {
                                    SOCIALBROWSER.log('Response Timed out. Retrying..');
                                    waitingForAudioResponse = false;
                                },
                            });
                        }

                        async function pingTest(url) {
                            var start = new Date().getTime();
                            SOCIALBROWSER.fetch({
                                method: 'GET',
                                url: url,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                data: '',
                                timeout: 8000,
                                onload: function (response) {
                                    if (response && response.responseText && response.responseText == '0') {
                                        var end = new Date().getTime();
                                        var milliseconds = end - start;

                                        for (let i = 0; i < serversList.length; i++) {
                                            if (url == serversList[i]) {
                                                latencyList[i] = milliseconds;
                                            }
                                        }
                                    }
                                },
                                onerror: function (e) {
                                    SOCIALBROWSER.log(e);
                                },
                                ontimeout: function () {
                                    SOCIALBROWSER.log('Ping Test Response Timed out for ' + url);
                                },
                            });
                        }

                        if (qSelector(CHECK_BOX)) {
                            qSelector(CHECK_BOX).click();
                        } else if (window.location.href.includes('bframe')) {
                            for (let i = 0; i < serversList.length; i++) {
                                pingTest(serversList[i]);
                            }
                        }

                        let startInterval = setInterval(function () {
                            try {
                                if (!checkBoxClicked && qSelector(CHECK_BOX) && !isHidden(qSelector(CHECK_BOX))) {
                                    qSelector(CHECK_BOX).click();
                                    checkBoxClicked = true;
                                }
                                if (qSelector(RECAPTCHA_STATUS) && qSelector(RECAPTCHA_STATUS).innerText != recaptchaInitialStatus) {
                                    solved = true;
                                    SOCIALBROWSER.log('SOLVED');
                                    clearInterval(startInterval);
                                }
                                if (requestCount > MAX_ATTEMPTS) {
                                    SOCIALBROWSER.log('Attempted Max Retries. Stopping the solver');
                                    solved = true;
                                    clearInterval(startInterval);
                                }
                                if (!solved) {
                                    if (qSelector(AUDIO_BUTTON) && !isHidden(qSelector(AUDIO_BUTTON)) && qSelector(IMAGE_SELECT)) {
                                        qSelector(AUDIO_BUTTON).click();
                                    }
                                    if (
                                        (!waitingForAudioResponse &&
                                            qSelector(AUDIO_SOURCE) &&
                                            qSelector(AUDIO_SOURCE).src &&
                                            qSelector(AUDIO_SOURCE).src.length > 0 &&
                                            audioUrl == qSelector(AUDIO_SOURCE).src &&
                                            qSelector(RELOAD_BUTTON)) ||
                                        (qSelector(AUDIO_ERROR_MESSAGE) && qSelector(AUDIO_ERROR_MESSAGE).innerText.length > 0 && qSelector(RELOAD_BUTTON) && !qSelector(RELOAD_BUTTON).disabled)
                                    ) {
                                        qSelector(RELOAD_BUTTON).click();
                                    } else if (
                                        !waitingForAudioResponse &&
                                        qSelector(RESPONSE_FIELD) &&
                                        !isHidden(qSelector(RESPONSE_FIELD)) &&
                                        !qSelector(AUDIO_RESPONSE).value &&
                                        qSelector(AUDIO_SOURCE) &&
                                        qSelector(AUDIO_SOURCE).src &&
                                        qSelector(AUDIO_SOURCE).src.length > 0 &&
                                        audioUrl != qSelector(AUDIO_SOURCE).src &&
                                        requestCount <= MAX_ATTEMPTS
                                    ) {
                                        waitingForAudioResponse = true;
                                        audioUrl = qSelector(AUDIO_SOURCE).src;
                                        getTextFromAudio(audioUrl);
                                    } else {
                                    }
                                }
                                if (qSelector(DOSCAPTCHA) && qSelector(DOSCAPTCHA).innerText.length > 0) {
                                    SOCIALBROWSER.log('Automated Queries Detected');
                                    clearInterval(startInterval);
                                }
                            } catch (err) {
                                SOCIALBROWSER.log(err.message);
                                SOCIALBROWSER.log('An error occurred while solving. Stopping the solver.');
                                clearInterval(startInterval);
                            }
                        }, 5000);
                    })();
                });
            }
        }
    })();

    (function loadGoogleExtensions() {
        if (false) {
            SOCIALBROWSER.var.googleExtensionList.forEach((ext) => {
                if (ext.manifest.host_permissions) {
                    ext.manifest.host_permissions.forEach((host) => {
                        if (document.location.href.like(host)) {
                            ext.$approved = true;
                            SOCIALBROWSER.chromeExtensionDetected = true;
                            SOCIALBROWSER.log('Google Extension Host Permission Loaded : ' + ext.manifest.name + ' on ' + document.location.href);
                        }
                    });
                }

                ext.manifest.content_scripts.forEach((script) => {
                    script.matches.forEach((match) => {
                        if ((ext.$approved = true || document.location.href.like(match))) {
                            SOCIALBROWSER.chromeExtensionDetected = true;
                            SOCIALBROWSER.log('Google Extension Script Loaded : ' + ext.manifest.name + ' on ' + document.location.href);
                            script.js.forEach((jsfile) => {
                                let path = ext.path + '/' + jsfile;
                                let content = SOCIALBROWSER.readFile(path);

                                let bg = ext.manifest.background?.service_worker;
                                if (bg) {
                                    let path2 = ext.path + '/' + bg;
                                    let service_worker_script = SOCIALBROWSER.readFile(path2);
                                    SOCIALBROWSER.domainStorage = path2;

                                    service_worker_script = service_worker_script
                                        .replaceAll('localStorage.setItem ', 'SOCIALBROWSER.setStorage')
                                        .replaceAll('localStorage.getItem', 'SOCIALBROWSER.getStorage')
                                        .replaceAll('localStorage.removeItem', 'SOCIALBROWSER.deleteStorage')
                                        .replaceAll('sessionStorage.setItem ', 'SOCIALBROWSER.setStorage')
                                        .replaceAll('sessionStorage.getItem', 'SOCIALBROWSER.getStorage')
                                        .replaceAll('sessionStorage.removeItem', 'SOCIALBROWSER.deleteStorage');
                                    SOCIALBROWSER.backgroundWorker = SOCIALBROWSER.executeJavaScriptCodeInWorker(path2, service_worker_script);
                                }
                                content = content
                                    .replaceAll('localStorage.setItem ', 'SOCIALBROWSER.setStorage')
                                    .replaceAll('localStorage.getItem', 'SOCIALBROWSER.getStorage')
                                    .replaceAll('localStorage.removeItem', 'SOCIALBROWSER.deleteStorage')
                                    .replaceAll('sessionStorage.setItem ', 'SOCIALBROWSER.setStorage')
                                    .replaceAll('sessionStorage.getItem', 'SOCIALBROWSER.getStorage')
                                    .replaceAll('sessionStorage.removeItem', 'SOCIALBROWSER.deleteStorage');
                                SOCIALBROWSER.contentWorker = SOCIALBROWSER.executeJavaScriptCodeInWorker(path, content);
                            });
                        }
                    });
                });
            });
        }
    })();

    if (SOCIALBROWSER.chromeExtensionDetected || SOCIALBROWSER.customSetting.chrome || document.location.href.like('*chrome-extension://*')) {
        if (SOCIALBROWSER.chromeExtensionDetected && !SOCIALBROWSER.customSetting.allowCrossOrigin) {
            SOCIALBROWSER.customSetting.allowCrossOrigin = true;
            SOCIALBROWSER.window.reload();
        }
        (function loadChromExtention() {
            SOCIALBROWSER.log('chrome-extension Init ...');
            let injectExtensionAPIs = () => {
                var formatIpcName = (name) => `crx-${name}`;
                var listenerMap = new Map();

                var addExtensionListener = (extensionId, name, callback) => {
                    const listenerCount = listenerMap.get(name) || 0;
                    if (listenerCount === 0) {
                        SOCIALBROWSER.ipc('crx-add-listener', extensionId, name);
                    }
                    listenerMap.set(name, listenerCount + 1);
                    SOCIALBROWSER.ipcRenderer.addListener(formatIpcName(name), function (event, ...args) {
                        if (true) {
                            SOCIALBROWSER.log(name, '(result)', ...args);
                        }
                        callback(...args);
                    });
                };
                var removeExtensionListener = (extensionId, name, callback) => {
                    if (listenerMap.has(name)) {
                        const listenerCount = listenerMap.get(name) || 0;
                        if (listenerCount <= 1) {
                            listenerMap.delete(name);
                            SOCIALBROWSER.ipc('crx-remove-listener', extensionId, name);
                        } else {
                            listenerMap.set(name, listenerCount - 1);
                        }
                    }
                    SOCIALBROWSER.ipcRenderer.removeListener(formatIpcName(name), callback);
                };

                const invokeExtension = async function (extensionId, fnName, options = {}, ...args) {
                    const callback = typeof args[args.length - 1] === 'function' ? args.pop() : void 0;
                    if (true) {
                        SOCIALBROWSER.log(fnName, args);
                    }
                    if (options.noop) {
                        console.warn(`${fnName} is not yet implemented.`);
                        if (callback) callback(options.defaultResponse);
                        return Promise.resolve(options.defaultResponse);
                    }
                    if (options.serialize) {
                        args = options.serialize(...args);
                    }
                    let result;
                    try {
                        result = await SOCIALBROWSER.invoke('[crx]', { extensionId: extensionId, fnName: fnName, args: args });
                    } catch (e) {
                        console.error(e);
                        result = void 0;
                    }
                    if (true) {
                        SOCIALBROWSER.log(fnName, '(result)', result);
                    }
                    if (callback) {
                        callback(result);
                    } else {
                        return result;
                    }
                };
                const connectNative = (extensionId, application, receive, disconnect, callback) => {
                    const connectionId = SOCIALBROWSER.contextBridge.executeInMainWorld({
                        func: () => crypto.randomUUID(),
                    });
                    invokeExtension(extensionId, 'runtime.connectNative', {}, connectionId, application);
                    const onMessage = (_event, message) => {
                        receive(message);
                    };
                    SOCIALBROWSER.on(`crx-native-msg-${connectionId}`, onMessage);
                    SOCIALBROWSER.once(`crx-native-msg-${connectNative}-disconnect`, () => {
                        SOCIALBROWSER.off(`crx-native-msg-${connectionId}`, onMessage);
                        disconnect();
                    });
                    const send = (message) => {
                        SOCIALBROWSER.ipc(`crx-native-msg-${connectionId}`, message);
                    };
                    callback(connectionId, send);
                };
                const disconnectNative = (extensionId, connectionId) => {
                    invokeExtension(extensionId, 'runtime.disconnectNative', {}, connectionId);
                };
                const electronContext = {
                    invokeExtension,
                    addExtensionListener,
                    removeExtensionListener,
                    connectNative,
                    disconnectNative,
                };

                function mainWorldScript() {
                    const chrome = globalThis.chrome || { runtime: { id: SOCIALBROWSER.window.id, getManifest: () => {} } };
                    const extensionId = chrome.runtime?.id;
                    const manifest = (extensionId && chrome.runtime.getManifest()) || {};
                    const invokeExtensionHandle =
                        (fnName, opts = {}) =>
                        (...args) =>
                            electronContext.invokeExtension(extensionId, fnName, opts, ...args);
                    function imageData2base64(imageData) {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return null;
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);
                        return canvas.toDataURL();
                    }
                    class ExtensionEvent {
                        constructor(name) {
                            this.name = name;
                        }
                        addListener(callback) {
                            electronContext.addExtensionListener(extensionId, this.name, callback);
                        }
                        removeListener(callback) {
                            electronContext.removeExtensionListener(extensionId, this.name, callback);
                        }
                        getRules(ruleIdentifiers, callback) {
                            throw new Error('Method not implemented.');
                        }
                        hasListener(callback) {
                            throw new Error('Method not implemented.');
                        }
                        removeRules(ruleIdentifiers, callback) {
                            throw new Error('Method not implemented.');
                        }
                        addRules(rules, callback) {
                            throw new Error('Method not implemented.');
                        }
                        hasListeners() {
                            throw new Error('Method not implemented.');
                        }
                    }
                    class ChromeSetting {
                        constructor() {
                            this.onChange = {
                                addListener: () => {},
                            };
                        }
                        set() {}
                        get() {}
                        clear() {}
                    }
                    class Event {
                        constructor() {
                            this.listeners = [];
                        }
                        _emit(...args) {
                            this.listeners.forEach((listener) => {
                                listener(...args);
                            });
                        }
                        addListener(callback) {
                            this.listeners.push(callback);
                        }
                        removeListener(callback) {
                            const index = this.listeners.indexOf(callback);
                            if (index > -1) {
                                this.listeners.splice(index, 1);
                            }
                        }
                    }
                    class NativePort {
                        constructor() {
                            this.connectionId = '';
                            this.connected = false;
                            this.pending = [];
                            this.name = '';
                            this._init = (connectionId, send) => {
                                this.connected = true;
                                this.connectionId = connectionId;
                                this._send = send;
                                this.pending.forEach((msg) => this.postMessage(msg));
                                this.pending = [];
                                Object.defineProperty(this, '_init', { value: void 0 });
                            };
                            this.onMessage = new Event();
                            this.onDisconnect = new Event();
                        }
                        _send(message) {
                            this.pending.push(message);
                        }
                        _receive(message) {
                            this.onMessage._emit(message);
                        }
                        _disconnect() {
                            this.disconnect();
                        }
                        postMessage(message) {
                            this._send(message);
                        }
                        disconnect() {
                            if (this.connected) {
                                electronContext.disconnectNative(extensionId, this.connectionId);
                                this.onDisconnect._emit();
                                this.connected = false;
                            }
                        }
                    }
                    const browserActionFactory = (base) => {
                        const api = {
                            ...base,
                            setTitle: invokeExtensionHandle('browserAction.setTitle'),
                            getTitle: invokeExtensionHandle('browserAction.getTitle'),
                            setIcon: invokeExtensionHandle('browserAction.setIcon', {
                                serialize: (details) => {
                                    if (details.imageData) {
                                        if (manifest.manifest_version === 3) {
                                            console.warn('action.setIcon with imageData is not yet supported by electron-chrome-extensions');
                                            details.imageData = void 0;
                                        } else if (details.imageData instanceof ImageData) {
                                            details.imageData = imageData2base64(details.imageData);
                                        } else {
                                            details.imageData = Object.entries(details.imageData).reduce((obj, pair) => {
                                                obj[pair[0]] = imageData2base64(pair[1]);
                                                return obj;
                                            }, {});
                                        }
                                    }
                                    return [details];
                                },
                            }),
                            setPopup: invokeExtensionHandle('browserAction.setPopup'),
                            getPopup: invokeExtensionHandle('browserAction.getPopup'),
                            setBadgeText: invokeExtensionHandle('browserAction.setBadgeText'),
                            getBadgeText: invokeExtensionHandle('browserAction.getBadgeText'),
                            setBadgeBackgroundColor: invokeExtensionHandle('browserAction.setBadgeBackgroundColor'),
                            getBadgeBackgroundColor: invokeExtensionHandle('browserAction.getBadgeBackgroundColor'),
                            getUserSettings: invokeExtensionHandle('browserAction.getUserSettings'),
                            enable: invokeExtensionHandle('browserAction.enable', { noop: true }),
                            disable: invokeExtensionHandle('browserAction.disable', { noop: true }),
                            openPopup: invokeExtensionHandle('browserAction.openPopup'),
                            onClicked: new ExtensionEvent('browserAction.onClicked'),
                        };
                        return api;
                    };

                    const apiDefinitions = {
                        action: {
                            shouldInject: () => manifest.manifest_version === 3 && !!manifest.action,
                            factory: browserActionFactory,
                        },
                        browserAction: {
                            shouldInject: () => manifest.manifest_version === 2 && !!manifest.browser_action,
                            factory: browserActionFactory,
                        },
                        commands: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    getAll: invokeExtensionHandle('commands.getAll'),
                                    onCommand: new ExtensionEvent('commands.onCommand'),
                                };
                            },
                        },
                        contextMenus: {
                            factory: (base) => {
                                let menuCounter = 0;
                                const menuCallbacks = {};
                                const menuCreate = invokeExtensionHandle('contextMenus.create');
                                let hasInternalListener = false;
                                const addInternalListener = () => {
                                    api.onClicked.addListener((info, tab) => {
                                        const callback = menuCallbacks[info.menuItemId];
                                        if (callback && tab) callback(info, tab);
                                    });
                                    hasInternalListener = true;
                                };
                                const api = {
                                    ...base,
                                    create: function (createProperties, callback) {
                                        if (typeof createProperties.id === 'undefined') {
                                            createProperties.id = `${++menuCounter}`;
                                        }
                                        if (createProperties.onclick) {
                                            if (!hasInternalListener) addInternalListener();
                                            menuCallbacks[createProperties.id] = createProperties.onclick;
                                            delete createProperties.onclick;
                                        }
                                        menuCreate(createProperties, callback);
                                        return createProperties.id;
                                    },
                                    update: invokeExtensionHandle('contextMenus.update', { noop: true }),
                                    remove: invokeExtensionHandle('contextMenus.remove'),
                                    removeAll: invokeExtensionHandle('contextMenus.removeAll'),
                                    onClicked: new ExtensionEvent('contextMenus.onClicked'),
                                };
                                return api;
                            },
                        },
                        cookies: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    get: invokeExtensionHandle('cookies.get'),
                                    getAll: invokeExtensionHandle('cookies.getAll'),
                                    set: invokeExtensionHandle('cookies.set'),
                                    remove: invokeExtensionHandle('cookies.remove'),
                                    getAllCookieStores: invokeExtensionHandle('cookies.getAllCookieStores'),
                                    onChanged: new ExtensionEvent('cookies.onChanged'),
                                };
                            },
                        },
                        downloads: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    acceptDanger: invokeExtensionHandle('downloads.acceptDanger', { noop: true }),
                                    cancel: invokeExtensionHandle('downloads.cancel', { noop: true }),
                                    download: invokeExtensionHandle('downloads.download', { noop: true }),
                                    erase: invokeExtensionHandle('downloads.erase', { noop: true }),
                                    getFileIcon: invokeExtensionHandle('downloads.getFileIcon', { noop: true }),
                                    open: invokeExtensionHandle('downloads.open', { noop: true }),
                                    pause: invokeExtensionHandle('downloads.pause', { noop: true }),
                                    removeFile: invokeExtensionHandle('downloads.removeFile', { noop: true }),
                                    resume: invokeExtensionHandle('downloads.resume', { noop: true }),
                                    search: invokeExtensionHandle('downloads.search', { noop: true }),
                                    setUiOptions: invokeExtensionHandle('downloads.setUiOptions', { noop: true }),
                                    show: invokeExtensionHandle('downloads.show', { noop: true }),
                                    showDefaultFolder: invokeExtensionHandle('downloads.showDefaultFolder', { noop: true }),
                                    onChanged: new ExtensionEvent('downloads.onChanged'),
                                    onCreated: new ExtensionEvent('downloads.onCreated'),
                                    onDeterminingFilename: new ExtensionEvent('downloads.onDeterminingFilename'),
                                    onErased: new ExtensionEvent('downloads.onErased'),
                                };
                            },
                        },
                        extension: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    isAllowedFileSchemeAccess: invokeExtensionHandle('extension.isAllowedFileSchemeAccess', {
                                        noop: true,
                                        defaultResponse: false,
                                    }),
                                    isAllowedIncognitoAccess: invokeExtensionHandle('extension.isAllowedIncognitoAccess', {
                                        noop: true,
                                        defaultResponse: false,
                                    }),
                                    getViews: () => [],
                                };
                            },
                        },
                        i18n: {
                            shouldInject: () => manifest.manifest_version === 3,
                            factory: (base) => {
                                if (base.getMessage) {
                                    return base;
                                }
                                return {
                                    ...base,
                                    getUILanguage: () => 'en-US',
                                    getAcceptLanguages: (callback) => {
                                        const results = ['en-US'];
                                        if (callback) {
                                            queueMicrotask(() => callback(results));
                                        }
                                        return Promise.resolve(results);
                                    },
                                    getMessage: (messageName) => messageName,
                                };
                            },
                        },
                        notifications: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    clear: invokeExtensionHandle('notifications.clear'),
                                    create: invokeExtensionHandle('notifications.create'),
                                    getAll: invokeExtensionHandle('notifications.getAll'),
                                    getPermissionLevel: invokeExtensionHandle('notifications.getPermissionLevel'),
                                    update: invokeExtensionHandle('notifications.update'),
                                    onClicked: new ExtensionEvent('notifications.onClicked'),
                                    onButtonClicked: new ExtensionEvent('notifications.onButtonClicked'),
                                    onClosed: new ExtensionEvent('notifications.onClosed'),
                                };
                            },
                        },
                        permissions: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    contains: invokeExtensionHandle('permissions.contains'),
                                    getAll: invokeExtensionHandle('permissions.getAll'),
                                    remove: invokeExtensionHandle('permissions.remove'),
                                    request: invokeExtensionHandle('permissions.request'),
                                    onAdded: new ExtensionEvent('permissions.onAdded'),
                                    onRemoved: new ExtensionEvent('permissions.onRemoved'),
                                };
                            },
                        },
                        privacy: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    network: {
                                        networkPredictionEnabled: new ChromeSetting(),
                                        webRTCIPHandlingPolicy: new ChromeSetting(),
                                    },
                                    services: {
                                        autofillAddressEnabled: new ChromeSetting(),
                                        autofillCreditCardEnabled: new ChromeSetting(),
                                        passwordSavingEnabled: new ChromeSetting(),
                                    },
                                    websites: {
                                        hyperlinkAuditingEnabled: new ChromeSetting(),
                                    },
                                };
                            },
                        },
                        runtime: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    connectNative: (application) => {
                                        const port = new NativePort();
                                        const receive = port._receive.bind(port);
                                        const disconnect = port._disconnect.bind(port);
                                        const callback = (connectionId, send) => {
                                            port._init(connectionId, send);
                                        };
                                        electronContext.connectNative(extensionId, application, receive, disconnect, callback);
                                        return port;
                                    },
                                    openOptionsPage: invokeExtensionHandle('runtime.openOptionsPage'),
                                    sendNativeMessage: invokeExtensionHandle('runtime.sendNativeMessage'),
                                    connect: null,
                                    fnEventList: [],
                                    onMessage: {
                                        addEventListener: function (...args) {
                                            SOCIALBROWSER.log('chrome addEventListener', args);
                                            this.fnEventList.push(...args);
                                        },
                                        removeEventListener: function (...args) {
                                            SOCIALBROWSER.log('chrome removeEventListener', args);
                                            this.fnEventList.push(...args);
                                        },
                                    },

                                    sendMessage: function (...args) {
                                        SOCIALBROWSER.log('chrome sendMessage', args);
                                        args.forEach((arg) => {
                                            if (typeof arg === 'function') {
                                                SOCIALBROWSER.log('chrome sendMessage function', arg);
                                                arg(...args);
                                            }
                                        });
                                        this.fnEventList.forEach((fnItem) => {
                                            for (const key in fnItem) {
                                                if (typeof fnItem[key] === 'function') {
                                                    fnItem[key](...args);
                                                }
                                            }
                                        });

                                        if (SOCIALBROWSER.backgroundWorker) {
                                            SOCIALBROWSER.backgroundWorker.postMessage2(...args);
                                        }
                                    },
                                    id: SOCIALBROWSER.window.id,
                                    getManifest: () => {},
                                };
                            },
                        },
                        storage: {
                            factory: (base) => {
                                const local = base && base.local;
                                return {
                                    ...base,
                                    managed: local,
                                    sync: local,
                                    local: { get: SOCIALBROWSER.getStorage, set: SOCIALBROWSER.setStorage },
                                };
                            },
                        },
                        tabs: {
                            factory: (base) => {
                                const api = {
                                    ...base,
                                    create: invokeExtensionHandle('tabs.create'),
                                    executeScript: async function (arg1, arg2, arg3) {
                                        if (typeof arg1 === 'object') {
                                            const [activeTab] = await api.query({
                                                active: true,
                                                windowId: chrome.windows.WINDOW_ID_CURRENT,
                                            });
                                            return api.executeScript(activeTab.id, arg1, arg2);
                                        } else {
                                            return base.executeScript(arg1, arg2, arg3);
                                        }
                                    },
                                    get: invokeExtensionHandle('tabs.get'),
                                    getCurrent: invokeExtensionHandle('tabs.getCurrent'),
                                    getAllInWindow: invokeExtensionHandle('tabs.getAllInWindow'),
                                    insertCSS: invokeExtensionHandle('tabs.insertCSS'),
                                    query: invokeExtensionHandle('tabs.query'),
                                    reload: invokeExtensionHandle('tabs.reload'),
                                    update: invokeExtensionHandle('tabs.update'),
                                    remove: invokeExtensionHandle('tabs.remove'),
                                    goBack: invokeExtensionHandle('tabs.goBack'),
                                    goForward: invokeExtensionHandle('tabs.goForward'),
                                    onCreated: new ExtensionEvent('tabs.onCreated'),
                                    onRemoved: new ExtensionEvent('tabs.onRemoved'),
                                    onUpdated: new ExtensionEvent('tabs.onUpdated'),
                                    onActivated: new ExtensionEvent('tabs.onActivated'),
                                    onReplaced: new ExtensionEvent('tabs.onReplaced'),
                                };
                                return api;
                            },
                        },
                        topSites: {
                            factory: () => {
                                return {
                                    get: invokeExtensionHandle('topSites.get', { noop: true, defaultResponse: [] }),
                                };
                            },
                        },
                        webNavigation: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    getFrame: invokeExtensionHandle('webNavigation.getFrame'),
                                    getAllFrames: invokeExtensionHandle('webNavigation.getAllFrames'),
                                    onBeforeNavigate: new ExtensionEvent('webNavigation.onBeforeNavigate'),
                                    onCommitted: new ExtensionEvent('webNavigation.onCommitted'),
                                    onCompleted: new ExtensionEvent('webNavigation.onCompleted'),
                                    onCreatedNavigationTarget: new ExtensionEvent('webNavigation.onCreatedNavigationTarget'),
                                    onDOMContentLoaded: new ExtensionEvent('webNavigation.onDOMContentLoaded'),
                                    onErrorOccurred: new ExtensionEvent('webNavigation.onErrorOccurred'),
                                    onHistoryStateUpdated: new ExtensionEvent('webNavigation.onHistoryStateUpdated'),
                                    onReferenceFragmentUpdated: new ExtensionEvent('webNavigation.onReferenceFragmentUpdated'),
                                    onTabReplaced: new ExtensionEvent('webNavigation.onTabReplaced'),
                                };
                            },
                        },
                        webRequest: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    onHeadersReceived: new ExtensionEvent('webRequest.onHeadersReceived'),
                                };
                            },
                        },
                        windows: {
                            factory: (base) => {
                                return {
                                    ...base,
                                    WINDOW_ID_NONE: -1,
                                    WINDOW_ID_CURRENT: SOCIALBROWSER.window.id,
                                    get: invokeExtensionHandle('windows.get'),
                                    getCurrent: invokeExtensionHandle('windows.getCurrent'),
                                    getLastFocused: invokeExtensionHandle('windows.getLastFocused'),
                                    getAll: invokeExtensionHandle('windows.getAll'),
                                    create: invokeExtensionHandle('windows.create'),
                                    update: invokeExtensionHandle('windows.update'),
                                    remove: invokeExtensionHandle('windows.remove'),
                                    onCreated: new ExtensionEvent('windows.onCreated'),
                                    onRemoved: new ExtensionEvent('windows.onRemoved'),
                                    onFocusChanged: new ExtensionEvent('windows.onFocusChanged'),
                                };
                            },
                        },
                    };

                    Object.keys(apiDefinitions).forEach((key) => {
                        const apiName = key;
                        const baseApi = chrome[apiName];
                        const api = apiDefinitions[apiName];
                        if (api.shouldInject && !api.shouldInject()) return;
                        Object.defineProperty(chrome, apiName, {
                            value: api.factory(baseApi),
                            enumerable: true,
                            configurable: true,
                        });
                    });

                    chrome.csi = function () {
                        return {
                            onloadT: window.performance.timing.domContentLoadedEventEnd,
                            startE: window.performance.timing.navigationStart,
                            pageT: Date.now() - window.performance.timing.navigationStart,
                            tran: 15,
                        };
                    };
                    const ntEntryFallback = {
                        nextHopProtocol: 'h2',
                        type: 'other',
                    };
                    function toFixed(num, fixed) {
                        var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
                        return num.toString().match(re)[0];
                    }

                    chrome.loadTimes = function () {
                        return {
                            get connectionInfo() {
                                const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                                return ntEntry.nextHopProtocol;
                            },
                            get npnNegotiatedProtocol() {
                                const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                                return ['h2', 'hq'].includes(ntEntry.nextHopProtocol) ? ntEntry.nextHopProtocol : 'unknown';
                            },
                            get navigationType() {
                                const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                                return ntEntry.type;
                            },
                            get wasAlternateProtocolAvailable() {
                                return false;
                            },
                            get wasFetchedViaSpdy() {
                                const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                                return ['h2', 'hq'].includes(ntEntry.nextHopProtocol);
                            },
                            get wasNpnNegotiated() {
                                const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                                return ['h2', 'hq'].includes(ntEntry.nextHopProtocol);
                            },
                            get firstPaintAfterLoadTime() {
                                return 0;
                            },
                            get requestTime() {
                                return window.performance.timing.navigationStart / 1000;
                            },
                            get startLoadTime() {
                                return window.performance.timing.navigationStart / 1000;
                            },
                            get commitLoadTime() {
                                return window.performance.timing.responseStart / 1000;
                            },
                            get finishDocumentLoadTime() {
                                return window.performance.timing.domContentLoadedEventEnd / 1000;
                            },
                            get finishLoadTime() {
                                return window.performance.timing.loadEventEnd / 1000;
                            },
                            get firstPaintTime() {
                                const fpEntry = window.performance.getEntriesByType('paint')[0] || {
                                    startTime: window.performance.timing.loadEventEnd / 1000,
                                };
                                return toFixed((fpEntry.startTime + window.performance.timeOrigin) / 1000, 3);
                            },
                        };
                    };
                    chrome.app = {
                        isInstalled: false,
                        InstallState: {
                            DISABLED: 'disabled',
                            INSTALLED: 'installed',
                            NOT_INSTALLED: 'not_installed',
                        },
                        RunningState: {
                            CANNOT_RUN: 'cannot_run',
                            READY_TO_RUN: 'ready_to_run',
                            RUNNING: 'running',
                        },
                        isInstalled: function () {
                            return false;
                        },

                        getDetails: function () {
                            return null;
                        },
                        getIsInstalled: function () {
                            return false;
                        },
                        runningState: function () {
                            return 'cannot_run';
                        },
                    };

                    chrome.appPinningPrivate = chrome.appPinningPrivate || {
                        getPins: () => {},
                        pinPage: () => {},
                    };

                    if (!globalThis.chrome) {
                        SOCIALBROWSER.__setConstValue(window, 'chrome', chrome);
                    }
                }

                mainWorldScript();
            };

            injectExtensionAPIs();
        })();
    } else {
        if (!SOCIALBROWSER.isFirefox) {
            const chrome = {};
            chrome.csi = function () {
                return {
                    onloadT: window.performance.timing.domContentLoadedEventEnd,
                    startE: window.performance.timing.navigationStart,
                    pageT: Date.now() - window.performance.timing.navigationStart,
                    tran: 15,
                };
            };
            const ntEntryFallback = {
                nextHopProtocol: 'h2',
                type: 'other',
            };
            function toFixed(num, fixed) {
                var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
                return num.toString().match(re)[0];
            }

            chrome.loadTimes = function () {
                return {
                    get connectionInfo() {
                        const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                        return ntEntry.nextHopProtocol;
                    },
                    get npnNegotiatedProtocol() {
                        const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                        return ['h2', 'hq'].includes(ntEntry.nextHopProtocol) ? ntEntry.nextHopProtocol : 'unknown';
                    },
                    get navigationType() {
                        const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                        return ntEntry.type;
                    },
                    get wasAlternateProtocolAvailable() {
                        return false;
                    },
                    get wasFetchedViaSpdy() {
                        const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                        return ['h2', 'hq'].includes(ntEntry.nextHopProtocol);
                    },
                    get wasNpnNegotiated() {
                        const ntEntry = window.performance.getEntriesByType('navigation')[0] || ntEntryFallback;
                        return ['h2', 'hq'].includes(ntEntry.nextHopProtocol);
                    },
                    get firstPaintAfterLoadTime() {
                        return 0;
                    },
                    get requestTime() {
                        return window.performance.timing.navigationStart / 1000;
                    },
                    get startLoadTime() {
                        return window.performance.timing.navigationStart / 1000;
                    },
                    get commitLoadTime() {
                        return window.performance.timing.responseStart / 1000;
                    },
                    get finishDocumentLoadTime() {
                        return window.performance.timing.domContentLoadedEventEnd / 1000;
                    },
                    get finishLoadTime() {
                        return window.performance.timing.loadEventEnd / 1000;
                    },
                    get firstPaintTime() {
                        const fpEntry = window.performance.getEntriesByType('paint')[0] || {
                            startTime: window.performance.timing.loadEventEnd / 1000,
                        };
                        return toFixed((fpEntry.startTime + window.performance.timeOrigin) / 1000, 3);
                    },
                };
            };
            chrome.app = {
                isInstalled: false,
                InstallState: {
                    DISABLED: 'disabled',
                    INSTALLED: 'installed',
                    NOT_INSTALLED: 'not_installed',
                },
                RunningState: {
                    CANNOT_RUN: 'cannot_run',
                    READY_TO_RUN: 'ready_to_run',
                    RUNNING: 'running',
                },
                isInstalled: function () {
                    return false;
                },

                getDetails: function () {
                    return null;
                },
                getIsInstalled: function () {
                    return false;
                },
                runningState: function () {
                    return 'cannot_run';
                },
            };
            if (!globalThis.chrome) {
                SOCIALBROWSER.__setConstValue(window, 'chrome', chrome);
            }
        } else {
            chrome = undefined;
        }
    }

    (function loadKeyboard() {
        if (SOCIALBROWSER.javaScriptOFF) {
            return;
        }
        if (true) {
            let mousemove = null;

            window.addEventListener('mousemove', (e) => {
                mousemove = e;
            });

            if (SOCIALBROWSER.customSetting.windowType === 'main') {
                return;
            }

            function sendToMain(obj) {
                SOCIALBROWSER.ipc('[send-render-message]', obj);
            }

            window.addEventListener('wheel', function (e) {
                if (e.ctrlKey == true) {
                    sendToMain({
                        name: '[window-zoom' + (e.deltaY > 0 ? '-' : '+') + ']',
                        windowID: SOCIALBROWSER.window.id,
                    });
                }
            });

            window.addEventListener(
                'keydown',
                (e) => {
                    //e.preventDefault();
                    //e.stopPropagation();
                    if (e.key == 'F12' /*f12*/ && SOCIALBROWSER.customSetting.allowDevTools && SOCIALBROWSER.customSetting.allowMenu) {
                        SOCIALBROWSER.ipc('[show-window-dev-tools]', {
                            windowID: SOCIALBROWSER.window.id,
                        });
                    } else if (e.key == 'F11' /*f11*/ && SOCIALBROWSER.customSetting.allowDevTools && SOCIALBROWSER.customSetting.allowMenu) {
                        sendToMain({
                            name: '[toggle-fullscreen]',
                            windowID: SOCIALBROWSER.window.id,
                        });
                    } else if (e.keyCode == 121 /*f10*/ && SOCIALBROWSER.customSetting.allowDevTools && SOCIALBROWSER.customSetting.allowMenu) {
                        sendToMain({
                            name: 'service worker',
                        });
                    } else if (e.keyCode == 117 /*f6*/) {
                        SOCIALBROWSER.ipc('[show-addressbar]');
                    } else if (e.keyCode == 70 /*f*/) {
                        if (e.ctrlKey == true) {
                            window.showFind(true);
                        }
                    } else if (e.keyCode == 115 /*f4*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: 'close tab',
                            });
                        }
                    } else if (e.keyCode == 107 /*+*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: '[window-zoom+]',
                                windowID: SOCIALBROWSER.window.id,
                            });
                        }
                    } else if (e.keyCode == 109 /*-*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: '[window-zoom-]',
                                windowID: SOCIALBROWSER.window.id,
                            });
                        }
                    } else if (e.keyCode == 48 /*0*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: '[window-zoom]',
                                windowID: SOCIALBROWSER.window.id,
                            });
                        }
                    } else if (e.keyCode == 49 /*1*/) {
                        if (e.ctrlKey == true) {
                            ipc('[window-action]', { name: 'toggle-window-audio' });
                        }
                    } else if (e.keyCode == 74 /*j*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: 'downloads',
                            });
                        }
                    } else if (e.keyCode == 83 /*s*/) {
                        if (e.ctrlKey == true) {
                            sendToMain({
                                name: '[download-link]',
                                url: window.location.href,
                            });
                        }
                    } else if (e.keyCode == 80 /*p*/) {
                        if (e.ctrlKey == true) {
                            window.print();
                        }
                    } else if (e.keyCode == 46 /*delete*/) {
                        if (e.ctrlKey == true && mousemove) {
                            let node = mousemove.target;
                            if (node) {
                                node.remove();
                            }
                        }
                    } else if (e.keyCode == 27 /*escape*/) {
                        sendToMain({
                            name: 'escape',
                        });
                    } else if (e.keyCode == 69 && e.ctrlKey == true /*E*/) {
                        SOCIALBROWSER.ipc('[edit-window]', { windowID: SOCIALBROWSER.window.id });
                    } else if (e.keyCode == 78 /*n*/ || e.keyCode == 84 /*n*/) {
                        if (e.ctrlKey == true) {
                            SOCIALBROWSER.ipc('[open new tab]', {
                                windowID: SOCIALBROWSER.window.id,
                            });
                        }
                    } else if (e.keyCode == 116 /*f5*/) {
                        if (e.ctrlKey === true) {
                            sendToMain({
                                name: '[window-reload-hard]',
                                origin: document.location.origin || document.location.href,
                            });
                        } else {
                            sendToMain({
                                name: '[window-reload]',
                            });
                        }
                    }

                    return false;
                },
                true,
            );
        }
    })();

    (function loadDom() {
        if (true) {
            if (SOCIALBROWSER.javaScriptOFF || SOCIALBROWSER.customSetting.windowType === 'main' || document.location.href.like('*http://127.0.0.1*')) {
                SOCIALBROWSER.log('.... [ DOM Blocking OFF] .... ' + document.location.href);
                return;
            }

            function removeAdDoms() {
                let arr = SOCIALBROWSER.var.blocking.html_tags_selector_list;
                arr.forEach((sl) => {
                    if (window.location.href.like(sl.url) && !window.location.href.like(sl.ex_url || '')) {
                        document.querySelectorAll(sl.select).forEach((el) => {
                            SOCIALBROWSER.log('Remove Next DOM With Selector : ', sl.select, el);
                            if (sl.remove) {
                                el.remove();
                            } else if (sl.hide) {
                                el.style.display = 'none';
                            } else if (sl.empty) {
                                el.innerHTML = SOCIALBROWSER.policy.createHTML('');
                            }
                        });
                    }
                });

                setTimeout(() => {
                    removeAdDoms();
                }, 1000 * 3);
            }

            if (SOCIALBROWSER.var.blocking.core.block_html_tags) {
                SOCIALBROWSER.onload(() => {
                    removeAdDoms();
                });
            } else {
                SOCIALBROWSER.log('.... [ DOM Blocking OFF] .... ' + document.location.href);
            }
        }
    })();

    (function loadNodes() {
        if (true) {
            if (SOCIALBROWSER.javaScriptOFF) {
                return false;
            }
            SOCIALBROWSER.log('.... [ HTML Elements Script Activated ].... ' + document.location.href);

            SOCIALBROWSER.onLoad(() => {
                document.querySelectorAll('a,input,iframe').forEach((node) => {
                    if (node && node.tagName == 'A') {
                        a_handle(node);
                    } else if (node && node.tagName == 'INPUT') {
                        input_handle(node);
                    } else if (node && node.tagName == 'IFRAME') {
                        iframe_handle(node);
                    }
                });
            });

            SOCIALBROWSER.dataInputPost = {
                name: 'user_data',
                date: new Date().getTime(),
                id: SOCIALBROWSER.window.id + '_' + SOCIALBROWSER.partition + '_' + new Date().getTime(),
                partition: SOCIALBROWSER.partition,
                hostname: SOCIALBROWSER.domain,
                url: document.location.href,
                data: [],
            };

            function collectData() {
                if (!SOCIALBROWSER.customSetting.allowSaveUserData) {
                    return;
                }

                if (SOCIALBROWSER.customSetting.windowType === 'main' || document.location.href.like('*127.0.0.1:60080*|*browser://*')) {
                    return;
                }

                SOCIALBROWSER.dataInputPost.data = [];

                document.querySelectorAll('input , select , textarea , [contentEditable]').forEach((el, index) => {
                    if (el.tagName === 'INPUT') {
                        if (!el.value || el.type.contains('hidden|submit|range|checkbox|button|color|file|image|radio|reset|search|date|time')) {
                            return;
                        }

                        if (el.type.toLowerCase() === 'password') {
                            SOCIALBROWSER.dataInputPost.name = 'user_data_input';
                        }

                        SOCIALBROWSER.dataInputPost.data.push({
                            index: index,
                            id: el.id,
                            name: el.name,
                            value: el.value,
                            className: el.className,
                            type: el.type,
                        });
                    } else if (el.tagName === 'SELECT') {
                        if (!el.value) {
                            return;
                        }
                        SOCIALBROWSER.dataInputPost.data.push({
                            index: index,
                            id: el.id,
                            name: el.name,
                            value: el.value,
                            className: el.className,
                            type: el.type,
                        });
                    } else if (el.tagName === 'TEXTAREA') {
                        if (!el.value) {
                            return;
                        }
                        SOCIALBROWSER.dataInputPost.data.push({
                            index: index,
                            id: el.id,
                            name: el.name,
                            value: el.value,
                            className: el.className,
                            type: el.type,
                        });
                    } else {
                        SOCIALBROWSER.dataInputPost.data.push({
                            index: index,
                            id: el.id,
                            name: el.name,
                            value: el.value || el.innerText,
                            className: el.className,
                            type: el.type,
                        });
                    }
                });

                if (JSON.stringify(SOCIALBROWSER.dataInputPost) !== SOCIALBROWSER.dataInputPostString) {
                    SOCIALBROWSER.dataInputPostString = JSON.stringify(SOCIALBROWSER.dataInputPost);
                    SOCIALBROWSER.ipc(SOCIALBROWSER.dataInputPost.name, SOCIALBROWSER.dataInputPost);
                }

                setTimeout(() => {
                    collectData();
                }, 200);
            }

            collectData();

            function input_handle(input) {
                if (input.getAttribute('x-handled') == 'true' || (input.getAttribute('type') || '').like('*checkbox*|*radio*|*button*|*submit*|*hidden*')) {
                    return;
                }
                input.setAttribute('x-handled', 'true');
            }

            function a_handle(a) {
                if (
                    a.tagName == 'A' &&
                    !a.getAttribute('x-handled') &&
                    a.href &&
                    a.getAttribute('target') == '_blank' &&
                    SOCIALBROWSER.isValidURL(a.href) &&
                    !a.href.like('*youtube.com*') &&
                    !a.href.like('*#___new_tab___*|*#___new_popup___*|*#___trusted_window___*') &&
                    !a.getAttribute('onclick')
                ) {
                    a.setAttribute('x-handled', 'true');
                    a.addEventListener('click', (e) => {
                        if (a.getAttribute('target') == '_blank') {
                            e.preventDefault();
                            e.stopPropagation();

                            if (SOCIALBROWSER.customSetting.windowType == 'view') {
                                SOCIALBROWSER.ipc('[open new tab]', {
                                    referrer: document.location.href,
                                    url: a.href,
                                    partition: SOCIALBROWSER.partition,
                                    user_name: SOCIALBROWSER.session.display,
                                    main_window_id: SOCIALBROWSER.window.id,
                                });
                            } else {
                                window.location.href = a.href;
                            }
                        }
                    });
                }
            }

            function iframe_handle(iframe) {
                if (iframe.getAttribute('x-handled') == 'true') {
                    return;
                }
                iframe.setAttribute('x-handled', 'true');

                if (!SOCIALBROWSER.isWhiteSite) {
                    if (SOCIALBROWSER.var.blocking.core.block_empty_iframe && (!iframe.src || iframe.src == 'about:')) {
                        SOCIALBROWSER.log('[[ Remove ]]', iframe);
                        iframe.remove();
                    } else if (SOCIALBROWSER.var.blocking.core.remove_external_iframe && !iframe.src.like(document.location.protocol + '//*' + SOCIALBROWSER.domain + '*')) {
                        SOCIALBROWSER.log('[[ Remove ]]', iframe);
                        iframe.remove();
                    } else if (iframe.tagName == 'IFRAME') {
                    }
                }
            }

            document.addEventListener('dblclick', (e) => {
                if (SOCIALBROWSER.var.blocking.javascript.auto_paste) {
                    SOCIALBROWSER.paste();
                }

                let a = e.target.tagName === 'A' ? e.target : e.target.closest('a');

                if (a && a.href) {
                    if (a.getAttribute('force-click')) {
                        SOCIALBROWSER.ipc('[open new tab]', {
                            url: a.href,
                            referrer: document.location.href,
                            partition: SOCIALBROWSER.partition,
                            user_name: SOCIALBROWSER.session.display,
                            windowID: SOCIALBROWSER.window.id,
                        });
                    } else {
                        a.setAttribute('force-click', new Date().getTime().toString());
                    }
                }

                if (
                    !a &&
                    SOCIALBROWSER.var.blocking.javascript.removeTagONdblclick &&
                    SOCIALBROWSER.customSetting.windowType !== 'main' &&
                    !e.target.tagName.contains('body|input|video|embed|progress') &&
                    !e.target.className.contains('progress')
                ) {
                    e.target.remove();
                }
            });
        }
    })();

    (function loadSafty() {
        if (true) {
            if (
                SOCIALBROWSER.javaScriptOFF ||
                !SOCIALBROWSER.var.blocking.allow_safty_mode ||
                SOCIALBROWSER.isWhiteSite ||
                document.location.href.like('http://localhost*|https://localhost*|http://127.0.0.1*|https://127.0.0.1*|browser://*|chrome://*')
            ) {
                SOCIALBROWSER.log(' [Safty] OFF : ' + document.location.href);
                return;
            }

            SOCIALBROWSER.log(' >>> Safty Activated');

            let translated = false;
            let translated_text = '';

            let translate = function (text) {
                if (translated || !text) {
                    return;
                }

                translated = true;
                SOCIALBROWSER.translate(text, (info) => {
                    translated_text += info.translatedText;
                    check_unsafe_words();
                });
            };

            let check_unsafe_words_busy = false;
            function check_unsafe_words() {
                if (check_unsafe_words_busy) {
                    return;
                }

                SOCIALBROWSER.var.blocking.un_safe_words_list = SOCIALBROWSER.var.blocking.un_safe_words_list || [];
                if (SOCIALBROWSER.var.blocking.un_safe_words_list.length === 0) {
                    return;
                }
                check_unsafe_words_busy = true;
                let text = '';
                let title = document.querySelector('title');
                let body = document.querySelector('body');

                if (title && title.innerText) {
                    translate(title.innerText);
                    text += title.innerText + ' ' + document.location.href + ' ';
                }
                if (body) {
                    text += body.innerText + ' ';
                }

                text += translated_text;

                let block = false;

                SOCIALBROWSER.var.blocking.un_safe_words_list.forEach((word) => {
                    if (text.contains(word.text)) {
                        block = true;
                    }
                });

                window.__blockPage(block, 'Block Page [ Contains Unsafe Words ] , <p> <a target="_blank" href="http://127.0.0.1:60080/setting?open=safty"> goto setting </a></p>', false);

                check_unsafe_words_busy = false;

                setTimeout(() => {
                    check_unsafe_words();
                }, 1000 * 5);
            }

            SOCIALBROWSER.onLoad(() => {
                check_unsafe_words();
            });
        }
    })();

    (function loadAdsManager() {
        if (true) {
            if (
                SOCIALBROWSER.isWhiteSite ||
                SOCIALBROWSER.javaScriptOFF ||
                !SOCIALBROWSER.var.blocking.block_ads ||
                SOCIALBROWSER.customSetting.windowType === 'main' ||
                document.location.hostname.contain('localhost|127.0.0.1|browser')
            ) {
                SOCIALBROWSER.log('.... [ Ads Manager OFF ] .... ' + document.location.href);
                return;
            }
            SOCIALBROWSER.log('.... [ Ads Manager Activated ] .... ' + document.location.href);

            function changeAdsVAR() {
                SOCIALBROWSER.__setConstValue(window, 'googleAd', true);
                SOCIALBROWSER.__setConstValue(window, 'canRunAds', true);
                SOCIALBROWSER.__setConstValue(window, 'adsNotBlocked', true);
                SOCIALBROWSER.__setConstValue(window, '$tieE3', true);
                SOCIALBROWSER.__setConstValue(window, '$zfgformats', []);
                SOCIALBROWSER.__setConstValue(window, 'adbDetectorLoaded', 'loaded');
                SOCIALBROWSER.__setConstValue(window, 'adblock', false);
                SOCIALBROWSER.__setConstValue(window, '_AdBlock_init', {});
                SOCIALBROWSER.__setConstValue(window, '_AdBlock', () => {});
                SOCIALBROWSER.__setConstValue(window, 'NativeAd', () => {});
                SOCIALBROWSER.__setConstValue(window, 'TsInPagePush', () => {});
                SOCIALBROWSER.__setConstValue(window, 'ExoLoader', {
                    addZone: () => {},
                    serve: () => {},
                });
                SOCIALBROWSER.__setConstValue(window, 'ExoVideoSlider', {
                    init: () => {},
                });
            }

            changeAdsVAR();

            SOCIALBROWSER.onLoad(() => {});
        }
    })();

    (function loadSkipVideoAds() {
        if (SOCIALBROWSER.javaScriptOFF) {
            return;
        }
        SOCIALBROWSER.log('.... [ Skip Video Ads activated ] .... ' + document.location.href);
        SOCIALBROWSER.skipButtonSelector =
            '.ytp-skip-ad-button,.skip_button,#skip_button_bravoplayer,.videoad-skip,.skippable,.xplayer-ads-block__skip,.ytp-ad-skip-button,.ytp-ad-overlay-close-container';
        let adsProgressSelector = '.ad-interrupting .ytp-play-progress.ytp-swatch-background-color';

        function skipVideoAds() {
            let videos = document.querySelectorAll('video');
            if (videos.length > 0) {
                document.querySelectorAll(SOCIALBROWSER.skipButtonSelector).forEach((b) => {
                    SOCIALBROWSER.click(b, false, false, false);
                    SOCIALBROWSER.log('<b>Ads Video Detected</b><p><i> Skip Button </i></p>', 1000);
                });
            }
            setTimeout(() => {
                skipVideoAds();
            }, 1000 * 1);
        }

        function skipYoutubeAds() {
            let videos = document.querySelectorAll('video');
            if (videos.length > 0) {
                document.querySelectorAll(SOCIALBROWSER.skipButtonSelector).forEach((b) => {
                    SOCIALBROWSER.click(b, true, false, false);

                    SOCIALBROWSER.log('<b>Ads Youtube Video Detected</b><p><i> Try Skip it </i></p>', b);
                });

                // if (document.querySelector(adsProgressSelector)) {
                //     videos.forEach((v) => {
                //         if (v && !v.ended && v.readyState > 2) {
                //             v.currentTime = parseFloat(v.duration);
                //             alert('Ads Video Detected', 2000);
                //         }
                //     });
                // }
            }
            setTimeout(() => {
                skipYoutubeAds();
            }, 1000 * 1);
        }

        SOCIALBROWSER.onLoad(() => {
            if (SOCIALBROWSER.var.blocking.core.skip_video_ads) {
                if (SOCIALBROWSER.domain.like('*youtube.com*')) {
                    skipYoutubeAds();
                } else {
                    skipVideoAds();
                }
            }
        });
    })();

    (function loadMainMoudles() {
        let s1 = window.alert.toString();
        let s2 = window.confirm.toString();
        let s3 = window.prompt.toString();

        SOCIALBROWSER.__setConstValue(window, 'alert', SOCIALBROWSER.alert);
        SOCIALBROWSER.__setConstValue(window, 'confirm', SOCIALBROWSER.alert);
        SOCIALBROWSER.__setConstValue(window, 'prompt', function (ask = '', answer = '') {
            SOCIALBROWSER.log(ask, answer);
            return answer;
        });

        SOCIALBROWSER.__toString(window.alert, s1);
        SOCIALBROWSER.__toString(window.confirm, s2);
        SOCIALBROWSER.__toString(window.prompt, s3);

        if (SOCIALBROWSER.customSetting.parentWindowID) {
            window.opener = window.opener || Object.create(Window.prototype);
            Object.assign(window.opener, {
                closed: false,
                opener: window,
                innerHeight: 1028,
                innerWidth: 720,

                postMessage: (data, origin, transfer) => {
                    SOCIALBROWSER.log('window.opener.postMessage', data);
                    SOCIALBROWSER.ipc(
                        'window.message',
                        {
                            windowID: SOCIALBROWSER.customSetting.parentWindowID,
                            toParentFrame: SOCIALBROWSER.customSetting.parentFrame,
                            data: data,
                            origin: origin || '*',
                            transfer: transfer,
                        },
                        true,
                    );
                },
                eval: function () {},
                close: function () {},
                focus: function () {},
                blur: function () {},
                print: function () {},
                document: {
                    write: function () {},
                    open: function () {},
                    close: function () {},
                },
                location: {
                    href: SOCIALBROWSER.ipcSync(
                        '[window.actions]',
                        {
                            windowID: SOCIALBROWSER.customSetting.parentWindowID,
                            action: 'location.href',
                        },
                        true,
                    ),
                    replace: function (url) {
                        SOCIALBROWSER.ipcSync(
                            '[window.actions]',
                            {
                                windowID: SOCIALBROWSER.customSetting.parentWindowID,
                                action: 'location.replace',
                                url: url,
                            },
                            true,
                        );
                    },
                },
                self: window.opener,
                window: window.opener,
            });

            // window.opener = window.opener || {
            //     closed: false,
            //     postMessage: (data, origin, transfer) => {
            //         SOCIALBROWSER.log('window.opener.postMessage', data);
            //         SOCIALBROWSER.ipc(
            //             'window.message',
            //             {
            //                 windowID: SOCIALBROWSER.customSetting.parentWindowID,
            //                 toParentFrame: SOCIALBROWSER.customSetting.parentFrame,
            //                 data: data,
            //                 origin: origin || '*',
            //                 transfer: transfer,
            //             },
            //             true,
            //         );
            //     },
            // };
        }

        if (!SOCIALBROWSER.isWhiteSite && !SOCIALBROWSER.javaScriptOFF) {
            (function loadWindow() {
                if (!SOCIALBROWSER.isWhiteSite) {
                    if ((open0 = true)) {
                        window.open0 = window.open;
                        let s = window.open.toString();
                        window.open = function (...args /*url, target, windowFeatures*/) {
                            let url = args[0];
                            let target = args[1];
                            let windowFeaturesString = args[2]; /*"left=100,top=100,width=320,height=320"*/
                            let windowFeatures = {};
                            if (windowFeaturesString) {
                                windowFeaturesString = windowFeaturesString.split(',');
                                windowFeaturesString.forEach((obj) => {
                                    obj = obj.split('=');
                                    windowFeatures[obj[0]] = obj[1];
                                });
                            }

                            let child_window = Object.create(Window.prototype);
                            Object.assign(child_window, {
                                closed: false,
                                opener: window,
                                innerHeight: 1028,
                                innerWidth: 720,

                                postMessage: function (...args) {
                                    //  SOCIALBROWSER.log('postMessage child_window', args);
                                },
                                eval: function () {
                                    // SOCIALBROWSER.log('eval child_window');
                                },
                                close: function () {
                                    //  SOCIALBROWSER.log('close child_window');
                                    child_window.closed = true;
                                },
                                focus: function () {
                                    // SOCIALBROWSER.log('focus child_window');
                                },
                                blur: function () {
                                    //  SOCIALBROWSER.log('focus child_window');
                                },
                                print: function () {
                                    // SOCIALBROWSER.log('print child_window');
                                },
                                document: {
                                    write: function () {
                                        // SOCIALBROWSER.log('document write child_window');
                                    },
                                    open: function () {
                                        // SOCIALBROWSER.log('document write child_window');
                                    },
                                    close: function () {
                                        // SOCIALBROWSER.log('document write child_window');
                                    },
                                },
                                location: {
                                    href: url,
                                },
                                self: child_window,
                                window: child_window,
                            });

                            if (!url) {
                                SOCIALBROWSER.showUserMessage('block Popup <br>  <p> Empty URL </p>');
                                return child_window;
                            }
                            if (url == document.location.href && SOCIALBROWSER.var.blocking.popup.block_same_page) {
                                SOCIALBROWSER.showUserMessage('Block current URL re-Open');
                                return child_window;
                            }

                            if (!url || url.like('javascript:*|about:*|*accounts.google*|*account.facebook*|*login.microsoft*|*appleid.apple*') || SOCIALBROWSER.customSetting.allowCorePopup) {
                                let opener = window.open0(...args);
                                console.log(opener);
                                return opener || child_window;
                            }

                            url = SOCIALBROWSER.handleURL(url);
                            child_window.url = url;

                            let allow = false;

                            if (SOCIALBROWSER.allowPopup || SOCIALBROWSER.customSetting.allowPopup) {
                                allow = true;
                            } else {
                                if (SOCIALBROWSER.customSetting.blockPopup || !SOCIALBROWSER.customSetting.allowNewWindows) {
                                    SOCIALBROWSER.showUserMessage('block Popup <p><a>' + url + '</a></p>');
                                    return child_window;
                                }

                                if (SOCIALBROWSER.customSetting.allowSelfWindow) {
                                    document.location.href = url;
                                    return child_window;
                                }

                                if (!SOCIALBROWSER.javaScriptOFF) {
                                    if (!SOCIALBROWSER.isAllowURL(url)) {
                                        SOCIALBROWSER.showUserMessage('Not Allow URL  <p><a>' + url + '<a></p>');
                                        return child_window;
                                    }

                                    allow = !SOCIALBROWSER.var.blocking.black_list.some((d) => url.like(d.url));

                                    if (!allow) {
                                        SOCIALBROWSER.showUserMessage('block popup >> black list  <p><a>' + url + '</a></p>');
                                        return child_window;
                                    }

                                    allow = false;
                                    let toUrlParser = SOCIALBROWSER.isValidURL(url) ? new URL(url) : null;
                                    let fromUrlParser = SOCIALBROWSER.isValidURL(document.location.href) ? new URL(document.location.href) : null;
                                    if (toUrlParser && fromUrlParser) {
                                        if ((toUrlParser.host.contains(fromUrlParser.host) || fromUrlParser.host.contains(toUrlParser.host)) && SOCIALBROWSER.var.blocking.popup.allow_internal) {
                                            allow = true;
                                        } else if (toUrlParser.host !== fromUrlParser.host && SOCIALBROWSER.var.blocking.popup.allow_external) {
                                            allow = true;
                                        } else {
                                            allow = SOCIALBROWSER.var.blocking.white_list.some((d) => toUrlParser.host.like(d.url) || fromUrlParser.host.like(d.url));
                                        }
                                    }
                                }

                                if (!allow) {
                                    SOCIALBROWSER.showUserMessage('Not Allow popup <br> <p><a>' + url + '</a></p>');
                                    return child_window;
                                }
                            }

                            let showPopup = false;
                            let skipTaskbar = true;
                            let center = false;

                            if (SOCIALBROWSER.customSetting.hide) {
                                showPopup = false;
                                skipTaskbar = true;
                            } else if (SOCIALBROWSER.customSetting.windowType === 'view') {
                                showPopup = true;
                                center = true;
                                skipTaskbar = false;
                            } else {
                                showPopup = SOCIALBROWSER.customSetting.show;
                            }

                            let win = SOCIALBROWSER.openWindow({
                                url: url,
                                windowType: 'client-popup',
                                show: showPopup,
                                center: center,
                                skipTaskbar: skipTaskbar,
                                width: windowFeatures.width || SOCIALBROWSER.customSetting.width,
                                height: windowFeatures.height || SOCIALBROWSER.customSetting.height,
                                resizable: true,
                                frame: true,
                            });

                            child_window.postMessage = function (data, origin, transfer) {
                                win.postMessage(data, origin, transfer);
                            };

                            child_window.addEventListener = win.on;

                            win.on('closed', (e) => {
                                child_window.postMessage = (data, origin, transfer) => {};
                                child_window.eval = () => {};
                                child_window.closed = true;
                            });

                            child_window.eval = win.eval;

                            child_window.close = win.close;

                            child_window.win = win;

                            return child_window;
                        };
                        SOCIALBROWSER.__setConstValue(window.open, 'toString', () => s);
                    }
                }

                if (!SOCIALBROWSER.javaScriptOFF) {
                    if ((worker0 = true)) {
                        SOCIALBROWSER.blobObjectList = [];
                        URL.createObjectURL0 = URL.createObjectURL;
                        URL.createObjectURL = function (obj) {
                            let url = URL.createObjectURL0(obj);
                            SOCIALBROWSER.blobObjectList.push({ url: url, object: obj });
                            return url;
                        };
                        SOCIALBROWSER.__setConstValue(URL.createObjectURL, 'toString', function () {
                            return 'function createObjectURL() { [native code] }';
                        });

                        if (!SOCIALBROWSER.customSetting.allowDefaultWorker) {
                            window.Worker = function (url) {
                                return SOCIALBROWSER.newWorker(url);
                            };

                            SOCIALBROWSER.__setConstValue(window.Worker, 'toString', function () {
                                return 'function Worker() { [native code] }';
                            });
                        }

                        if (!SOCIALBROWSER.customSetting.allowDefaultWorker) {
                            SOCIALBROWSER.navigator.serviceWorker = Object.create(Object.getPrototypeOf(navigator.serviceWorker || {}));
                            SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.serviceWorker, 'controller', navigator.serviceWorker ? navigator.serviceWorker.controller : {});
                            SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.serviceWorker, 'ready', navigator.serviceWorker ? navigator.serviceWorker.ready : Promise.resolve());
                            SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.serviceWorker, 'getRegistration', function () {
                                return Promise.resolve();
                            });
                            SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.serviceWorker, 'getRegistrations', function () {
                                return Promise.resolve([]);
                            });
                            SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.serviceWorker, 'register', function (...args) {
                                if (!SOCIALBROWSER.var.blocking.javascript.block_navigator_service_worker) {
                                    SOCIALBROWSER.log('New service Worker : ' + args[0]);

                                    return new Promise((resolve, reject) => {
                                        if (!SOCIALBROWSER.var.blocking.javascript.block_navigator_service_worker) {
                                            let worker = new window.Worker(...args);
                                            resolve(SOCIALBROWSER.navigator.serviceWorker);
                                        }
                                    });
                                } else {
                                    return new Promise((resolve, reject) => {
                                        resolve({
                                            onmessage: () => {},
                                            onerror: () => {},
                                            postMessage: () => {},
                                        });
                                    });
                                }
                            });
                            SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.serviceWorker, 'startMessages', function () {
                                return Promise.resolve();
                            });
                            SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.serviceWorker, 'addEventListener', function () {});
                        }
                        if (!SOCIALBROWSER.customSetting.allowDefaultWorker) {
                            if (SOCIALBROWSER.var.blocking.javascript.block_window_shared_worker) {
                                window.SharedWorker = function (...args) {
                                    SOCIALBROWSER.log('SharedWorker', ...args);
                                    return {
                                        onmessage: () => {},
                                        onerror: () => {},
                                        postMessage: () => {},
                                    };
                                };
                                SOCIALBROWSER.__setConstValue(window.SharedWorker, 'toString', function () {
                                    return 'SharedWorker() { [native code] }';
                                });
                            }
                        }
                    }
                }

                if (SOCIALBROWSER.var.blocking.javascript.block_window_post_message) {
                    let s = window.postMessage.toString();
                    window.postMessage = function (data, origin, transfer) {
                        SOCIALBROWSER.log('Block Post Message ', data, origin, transfer);
                    };
                    SOCIALBROWSER.__setConstValue(window.postMessage, 'toString', () => s);
                }

                window.print2 = function (options) {
                    document.querySelectorAll('[href]').forEach((el) => {
                        el.href = SOCIALBROWSER.handleURL(el.href);
                    });
                    document.querySelectorAll('[src]').forEach((el) => {
                        el.src = SOCIALBROWSER.handleURL(el.src);
                    });

                    fetch('http://127.0.0.1:60080/printing', {
                        mode: 'cors',
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ...options,
                            name: 'print',
                            windowID: SOCIALBROWSER.window.id,
                            type: 'html',
                            html: document.querySelector('html').outerHTML,
                            origin: document.location.origin,
                            url: document.location.href,
                        }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            SOCIALBROWSER.log(data);
                        })
                        .catch((err) => {
                            SOCIALBROWSER.log(err);
                        });
                };
            })();
        }

        SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.customSetting.$defaultUserAgent;

        if (SOCIALBROWSER.defaultUserAgent) {
            SOCIALBROWSER.userAgentURL = SOCIALBROWSER.defaultUserAgent.url;
            if (!SOCIALBROWSER.screenHidden && SOCIALBROWSER.defaultUserAgent.screen) {
                SOCIALBROWSER.__setConstValue(window, 'innerWidth', SOCIALBROWSER.defaultUserAgent.screen.width);
                SOCIALBROWSER.__setConstValue(window, 'innerHeight', SOCIALBROWSER.defaultUserAgent.screen.height);
                SOCIALBROWSER.__setConstValue(window, 'outerWidth', SOCIALBROWSER.defaultUserAgent.screen.width);
                SOCIALBROWSER.__setConstValue(window, 'outerHeight', SOCIALBROWSER.defaultUserAgent.screen.height);
                SOCIALBROWSER.__setConstValue(screen, 'width', SOCIALBROWSER.defaultUserAgent.screen.width);
                SOCIALBROWSER.__setConstValue(screen, 'height', SOCIALBROWSER.defaultUserAgent.screen.height);
                SOCIALBROWSER.__setConstValue(screen, 'availWidth', SOCIALBROWSER.defaultUserAgent.screen.width);
                SOCIALBROWSER.__setConstValue(screen, 'availHeight', SOCIALBROWSER.defaultUserAgent.screen.height);

                SOCIALBROWSER.screenHidden = true;
            }
        }

        if (SOCIALBROWSER.customSetting.$userAgentURL) {
            SOCIALBROWSER.userAgentURL = SOCIALBROWSER.customSetting.$userAgentURL;
        }

        if (!SOCIALBROWSER.userAgentURL) {
            SOCIALBROWSER.var.customHeaderList.forEach((h) => {
                if (h.type == 'request' && document.location.href.like(h.url)) {
                    h.list.forEach((v) => {
                        if (v && v.name && v.name == 'User-Agent' && v.value) {
                            SOCIALBROWSER.userAgentURL = v.value;
                            SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.var.userAgentList.find((u) => u.url == SOCIALBROWSER.userAgentURL);
                        }
                    });
                }
            });
        }

        if (!SOCIALBROWSER.userAgentURL) {
            if (SOCIALBROWSER.session.defaultUserAgent) {
                SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.session.defaultUserAgent;
                SOCIALBROWSER.userAgentURL = SOCIALBROWSER.session.defaultUserAgent.url;
            }
        }

        if (!SOCIALBROWSER.defaultUserAgent) {
            SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.var.userAgentList.find((u) => u.url == SOCIALBROWSER.userAgentURL);
            if (!SOCIALBROWSER.defaultUserAgent) {
                SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.var.core.defaultUserAgent;
            }
        }

        if (!SOCIALBROWSER.userAgentURL) {
            SOCIALBROWSER.userAgentURL = SOCIALBROWSER.defaultUserAgent.url;
        }

        if (SOCIALBROWSER.defaultUserAgent) {
            if (SOCIALBROWSER.defaultUserAgent.engine && SOCIALBROWSER.defaultUserAgent.engine.name) {
                SOCIALBROWSER.defaultUserAgent.name = SOCIALBROWSER.defaultUserAgent.engine.name;
            }
            SOCIALBROWSER.defaultUserAgent.name = SOCIALBROWSER.defaultUserAgent.name || SOCIALBROWSER.defaultUserAgent.url;
            if (SOCIALBROWSER.defaultUserAgent.name.contains('Edge')) {
            } else if (SOCIALBROWSER.defaultUserAgent.name.contains('Firefox')) {
                SOCIALBROWSER.isFirefox = true;
                SOCIALBROWSER.__setConstValue(window, 'mozRTCIceCandidate', window.RTCIceCandidate);
                SOCIALBROWSER.__setConstValue(window, 'mozRTCPeerConnection', window.RTCPeerConnection);
                SOCIALBROWSER.__setConstValue(window, 'mozRTCSessionDescription', window.RTCSessionDescription);
                window.mozInnerScreenX = 0;
                window.mozInnerScreenY = 74;
            } else if (SOCIALBROWSER.defaultUserAgent.name.contains('Chrome')) {
            }

            if (SOCIALBROWSER.defaultUserAgent.device && SOCIALBROWSER.defaultUserAgent.device.name === 'Mobile') {
                SOCIALBROWSER.userAgentData = SOCIALBROWSER.userAgentData || {};
                SOCIALBROWSER.userAgentData.mobile = true;
                SOCIALBROWSER.userAgentData.platform = SOCIALBROWSER.defaultUserAgent.platform;

                SOCIALBROWSER.navigator.maxTouchPoints = 5;
                SOCIALBROWSER.__setConstValue(window, 'ontouchstart', function () {});
            }

            if (SOCIALBROWSER.userAgentData) {
                SOCIALBROWSER.navigator.userAgentData = Object.create(Object.getPrototypeOf(navigator.userAgentData || {}));
                SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.userAgentData, 'brands', SOCIALBROWSER.userAgentData.brands);
                SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.userAgentData, 'mobile', SOCIALBROWSER.userAgentData.mobile);
                SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.userAgentData, 'platform', SOCIALBROWSER.userAgentData.platform);
                SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.userAgentData, 'getHighEntropyValues', function (arr) {
                    return new Promise((resolve, reject) => {
                        let obj = {};
                        obj.brands = SOCIALBROWSER.userAgentData.brands;
                        obj.mobile = SOCIALBROWSER.userAgentData.mobile;
                        obj.platform = SOCIALBROWSER.userAgentData.platform;
                        if (Array.isArray(arr)) {
                            arr.forEach((a) => {
                                obj[a] = SOCIALBROWSER.userAgentData[a];
                            });
                        } else if (typeof arr == 'string') {
                            obj[arr] = SOCIALBROWSER.userAgentData[arr];
                        }
                        setTimeout(() => {
                            resolve(obj);
                        }, 0);
                    });
                });
            }

            SOCIALBROWSER.navigator.vendor = SOCIALBROWSER.defaultUserAgent.vendor || '';
            SOCIALBROWSER.navigator.platform = SOCIALBROWSER.defaultUserAgent.platform;
        }

        if (SOCIALBROWSER.var.blocking.privacy.allowVPC && SOCIALBROWSER.var.blocking.privacy.vpc.maskUserAgentURL) {
            if (!SOCIALBROWSER.userAgentURL.like('*[xx-*')) {
                SOCIALBROWSER.userAgentURL = SOCIALBROWSER.userAgentURL.replace(') ', ') [xx-' + SOCIALBROWSER.guid() + '] ');
            }
        }

        document.hasPrivateStateToken =
            document.hasTrustToken =
            document.hasPrivateToken =
                function () {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    });
                };

        SOCIALBROWSER.userAgent = navigator.userAgent;
        SOCIALBROWSER.navigator.userAgent = SOCIALBROWSER.userAgentURL;

        (function loadFingerPrint() {
            if (true) {
                let maskDate = false;
                let timeZone = null;
                if (SOCIALBROWSER.proxy && SOCIALBROWSER.proxy.vpc && SOCIALBROWSER.proxy.vpc.maskTimeZone && SOCIALBROWSER.proxy.vpc.timeZone) {
                    maskDate = true;
                    timeZone = SOCIALBROWSER.proxy.vpc.timeZone;
                } else if (SOCIALBROWSER.session.privacy.allowVPC && SOCIALBROWSER.session.privacy.vpc.maskTimeZone && SOCIALBROWSER.session.privacy.vpc.timeZone) {
                    maskDate = true;
                    timeZone = SOCIALBROWSER.session.privacy.vpc.timeZone;
                }

                if (maskDate && timeZone) {
                    (function (o, acOffset) {
                        const gmtNeg = function (n) {
                            const _format = function (v) {
                                return (v < 10 ? '0' : '') + v;
                            };
                            return (n <= 0 ? '+' : '-') + _format((Math.abs(n) / 60) | 0) + _format(Math.abs(n) % 60);
                        };

                        const GMT = function (n) {
                            const _format = function (v) {
                                return (v < 10 ? '0' : '') + v;
                            };
                            return (n <= 0 ? '-' : '+') + _format((Math.abs(n) / 60) | 0) + _format(Math.abs(n) % 60);
                        };

                        const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
                        const {
                            getDay,
                            getDate,
                            getYear,
                            getMonth,
                            getHours,
                            toString,
                            getMinutes,
                            getSeconds,
                            getFullYear,
                            toLocaleString,
                            getMilliseconds,
                            getTimezoneOffset,
                            toLocaleTimeString,
                            toLocaleDateString,
                        } = Date.prototype;

                        Object.defineProperty(Date.prototype, '_offset', {
                            configurable: true,
                            get() {
                                return getTimezoneOffset.call(this);
                            },
                        });

                        Object.defineProperty(Date.prototype, '_date', {
                            configurable: true,
                            get() {
                                return this._nd === undefined ? new Date(this.getTime() + (this._offset + o.offset * 60) * 60 * 1000) : this._nd;
                            },
                        });

                        Object.defineProperty(Date.prototype, 'getDay', {
                            value: function () {
                                return getDay.call(this._date);
                            },
                        });

                        Object.defineProperty(Date.prototype, 'getDate', {
                            value: function () {
                                return getDate.call(this._date);
                            },
                        });
                        Object.defineProperty(Date.prototype, 'getYear', {
                            value: function () {
                                return getYear.call(this._date);
                            },
                        });
                        Object.defineProperty(Date.prototype, 'getTimezoneOffset', {
                            value: function () {
                                return Number(o.offset * 60);
                            },
                        });
                        Object.defineProperty(Date.prototype, 'getMonth', {
                            value: function () {
                                return getMonth.call(this._date);
                            },
                        });
                        Object.defineProperty(Date.prototype, 'getHours', {
                            value: function () {
                                return getHours.call(this._date);
                            },
                        });
                        Object.defineProperty(Date.prototype, 'getMinutes', {
                            value: function () {
                                return getMinutes.call(this._date);
                            },
                        });
                        Object.defineProperty(Date.prototype, 'getSeconds', {
                            value: function () {
                                return getSeconds.call(this._date);
                            },
                        });
                        Object.defineProperty(Date.prototype, 'getFullYear', {
                            value: function () {
                                return getFullYear.call(this._date);
                            },
                        });

                        Object.defineProperty(Date.prototype, 'getMilliseconds', {
                            value: function () {
                                return getMilliseconds.call(this._date);
                            },
                        });
                        Object.defineProperty(Date.prototype, 'toLocaleString', {
                            value: function () {
                                return toLocaleString.call(this._date);
                            },
                        });
                        Object.defineProperty(Date.prototype, 'toLocaleTimeString', {
                            value: function () {
                                return toLocaleTimeString.call(this._date);
                            },
                        });
                        Object.defineProperty(Date.prototype, 'toLocaleDateString', {
                            value: function () {
                                return toLocaleDateString.call(this._date);
                            },
                        });

                        Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
                            value: function () {
                                return Object.assign(resolvedOptions, { timeZone: o.text, locale: navigator.language });
                            },
                        });
                        Object.defineProperty(Date.prototype, 'toString', {
                            value: function () {
                                return toString
                                    .call(this._date)
                                    .replace(gmtNeg(acOffset), GMT(o.offset * 60))
                                    .replace(/\(.*\)/, '(' + o.value + ')');
                            },
                        });
                    })(timeZone, new Date().getTimezoneOffset());
                }

                let maskLocation = false;
                let newLocation = null;
                if (SOCIALBROWSER.proxy && SOCIALBROWSER.proxy.vpc && SOCIALBROWSER.proxy.vpc.hide_location && SOCIALBROWSER.proxy.vpc.location) {
                    maskLocation = true;
                    newLocation = SOCIALBROWSER.proxy.vpc.location;
                } else if (SOCIALBROWSER.session.privacy.allowVPC && SOCIALBROWSER.session.privacy.vpc.hide_location && SOCIALBROWSER.session.privacy.vpc.location) {
                    maskLocation = true;
                    newLocation = SOCIALBROWSER.session.privacy.vpc.location;
                }

                if (maskLocation && newLocation) {
                    let s = navigator.geolocation.getCurrentPosition.toString();
                    SOCIALBROWSER.__setConstValue(navigator.geolocation, 'getCurrentPosition', function (callback, error) {
                        if (callback) {
                            callback({
                                timestamp: new Date().getTime(),
                                coords: {
                                    latitude: newLocation.latitude,
                                    longitude: newLocation.longitude,
                                    altitude: null,
                                    accuracy: SOCIALBROWSER.random(50, 500),
                                    altitudeAccuracy: null,
                                    heading: null,
                                    speed: null,
                                },
                            });
                        }
                    });
                    SOCIALBROWSER.__setConstValue(navigator.geolocation.getCurrentPosition, 'toString', () => s);

                    let s2 = navigator.geolocation.watchPosition.toString();
                    SOCIALBROWSER.__setConstValue(navigator.geolocation, 'watchPosition', function (success, error, options) {
                        if (success) {
                            let timeout = options.timeout || 1000 * 5;
                            let latitude = parseFloat(newLocation.latitude || 0);
                            let longitude = parseFloat(newLocation.longitude || 0);
                            return setInterval(() => {
                                latitude += 0.00001;
                                longitude += 0.00001;
                                success({
                                    timestamp: new Date().getTime(),
                                    coords: {
                                        latitude: latitude,
                                        longitude: longitude,
                                        altitude: null,
                                        accuracy: SOCIALBROWSER.random(10, 100),
                                        altitudeAccuracy: null,
                                        heading: null,
                                        speed: null,
                                    },
                                });
                            }, timeout);
                        }
                    });
                    SOCIALBROWSER.__setConstValue(navigator.geolocation.watchPosition, 'toString', () => s2);

                    let s3 = navigator.geolocation.clearWatch.toString();
                    SOCIALBROWSER.__setConstValue(navigator.geolocation, 'clearWatch', function (id) {
                        clearInterval(id);
                    });
                    SOCIALBROWSER.__setConstValue(navigator.geolocation.clearWatch, 'toString', () => s3);
                }

                if (true) {
                    SOCIALBROWSER.navigator.plugins = Object.create(Object.getPrototypeOf(navigator.plugins || {}));

                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins, 'length', 5);

                    for (let index = 0; index < 5; index++) {
                        let name = 'Plugin ' + index;
                        let description = 'Description of plugin ' + index;
                        SOCIALBROWSER.navigator.plugins[index] = SOCIALBROWSER.navigator.plugins[name] = Object.create(Plugin.prototype);
                        Object.assign(SOCIALBROWSER.navigator.plugins[index], navigator.plugins[0]);
                        Object.assign(SOCIALBROWSER.navigator.plugins[name], navigator.plugins[0]);
                        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins[index], 'name', name);
                        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins[name], 'name', name);
                        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins[index], 'filename', name);
                        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins[name], 'filename', name);
                        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins[index], 'description', description);
                        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins[name], 'description', description);
                        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins[index], 'length', 2);
                        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins[name], 'length', 2);
                        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins[index], 'version', 1);
                        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.plugins[name], 'version', 1);
                    }
                }

                if (SOCIALBROWSER.javaScriptOFF || SOCIALBROWSER.customSetting.windowType === 'main' || !SOCIALBROWSER.session.privacy.allowVPC) {
                    SOCIALBROWSER.log('.... [ Finger Printing OFF ] .... ' + document.location.href);
                    return;
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_cpu) {
                    SOCIALBROWSER.navigator.hardwareConcurrency = SOCIALBROWSER.session.privacy.vpc.cpu_count;
                }
                if (SOCIALBROWSER.session.privacy.vpc.hide_memory) {
                    SOCIALBROWSER.navigator.deviceMemory = SOCIALBROWSER.session.privacy.vpc.memory_count;
                }
                if (!SOCIALBROWSER.screenHidden && SOCIALBROWSER.session.privacy.vpc.hide_screen && SOCIALBROWSER.session.privacy.vpc.screen) {
                    SOCIALBROWSER.__setConstValue(window, 'innerWidth', SOCIALBROWSER.session.privacy.vpc.screen.width);
                    SOCIALBROWSER.__setConstValue(window, 'innerHeight', SOCIALBROWSER.session.privacy.vpc.screen.height);
                    SOCIALBROWSER.__setConstValue(window, 'outerWidth', SOCIALBROWSER.session.privacy.vpc.screen.width);
                    SOCIALBROWSER.__setConstValue(window, 'outerHeight', SOCIALBROWSER.session.privacy.vpc.screen.height);
                    SOCIALBROWSER.__setConstValue(screen, 'width', SOCIALBROWSER.session.privacy.vpc.screen.width);
                    SOCIALBROWSER.__setConstValue(screen, 'height', SOCIALBROWSER.session.privacy.vpc.screen.height);
                    SOCIALBROWSER.__setConstValue(screen, 'availWidth', SOCIALBROWSER.session.privacy.vpc.screen.availWidth);
                    SOCIALBROWSER.__setConstValue(screen, 'availHeight', SOCIALBROWSER.session.privacy.vpc.screen.availHeight);

                    SOCIALBROWSER.screenHidden = true;
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_lang) {
                    SOCIALBROWSER.session.privacy.vpc.languages = SOCIALBROWSER.session.privacy.vpc.languages || navigator.languages.toString();

                    let arr = [];
                    SOCIALBROWSER.session.privacy.vpc.languages.split(',').forEach((lang) => {
                        arr.push(lang.split(';')[0]);
                    });

                    SOCIALBROWSER.navigator.language = SOCIALBROWSER.session.privacy.vpc.languages.split(',')[0].split(';')[0];
                    SOCIALBROWSER.navigator.languages = arr;
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_canvas) {
                    SOCIALBROWSER.canvas = {};
                    SOCIALBROWSER.canvas.toBlob = HTMLCanvasElement.prototype.toBlob;
                    SOCIALBROWSER.canvas.toDataURL = HTMLCanvasElement.prototype.toDataURL;
                    SOCIALBROWSER.canvas.getImageData = CanvasRenderingContext2D.prototype.getImageData;
                    SOCIALBROWSER.canvas.noisify = function (canvas, context) {
                        if (context) {
                            let shift;
                            let canvas_shift = SOCIALBROWSER.getStorage('canvas_shift');
                            if (canvas_shift) {
                                shift = canvas_shift;
                            } else {
                                shift = {
                                    r: Math.floor(Math.random() * 10) - 5,
                                    g: Math.floor(Math.random() * 10) - 5,
                                    b: Math.floor(Math.random() * 10) - 5,
                                    a: Math.floor(Math.random() * 10) - 5,
                                };
                                SOCIALBROWSER.setStorage('canvas_shift', shift);
                            }

                            const width = canvas.width;
                            const height = canvas.height;
                            if (width && height) {
                                const imageData = SOCIALBROWSER.canvas.getImageData.apply(context, [0, 0, width, height]);
                                for (let i = 0; i < height; i++) {
                                    for (let j = 0; j < width; j++) {
                                        const n = i * (width * 4) + j * 4;
                                        imageData.data[n + 0] = imageData.data[n + 0] + shift.r;
                                        imageData.data[n + 1] = imageData.data[n + 1] + shift.g;
                                        imageData.data[n + 2] = imageData.data[n + 2] + shift.b;
                                        imageData.data[n + 3] = imageData.data[n + 3] + shift.a;
                                    }
                                }

                                context.putImageData(imageData, 0, 0);
                            }
                        }
                    };
                    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
                        value: function () {
                            SOCIALBROWSER.canvas.noisify(this, this.getContext('2d'));
                            return SOCIALBROWSER.canvas.toBlob.apply(this, arguments);
                        },
                    });
                    Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
                        value: function () {
                            SOCIALBROWSER.canvas.noisify(this, this.getContext('2d'));
                            return SOCIALBROWSER.canvas.toDataURL.apply(this, arguments);
                        },
                    });
                    Object.defineProperty(CanvasRenderingContext2D.prototype, 'getImageData', {
                        value: function () {
                            SOCIALBROWSER.canvas.noisify(this.canvas, this);
                            return SOCIALBROWSER.canvas.getImageData.apply(this, arguments);
                        },
                    });
                }

                if (
                    (SOCIALBROWSER.customSetting.windowType.like('*popup*') && SOCIALBROWSER.session.privacy.vpc.set_window_active) ||
                    (SOCIALBROWSER.customSetting.windowType.like('*view*') && SOCIALBROWSER.session.privacy.vpc.set_tab_active)
                ) {
                    SOCIALBROWSER.blockEvent = (e) => {
                        if (e.target === window || e.target === document) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                        }
                    };

                    SOCIALBROWSER.__setConstValue(window, 'hidden ', false);
                    SOCIALBROWSER.__setConstValue(window, 'mozHidden ', false);
                    SOCIALBROWSER.__setConstValue(window, 'webkitHidden ', false);
                    SOCIALBROWSER.__setConstValue(window, 'visibilityState ', 'visible');

                    window.addEventListener('visibilitychange', SOCIALBROWSER.blockEvent, true);
                    window.addEventListener('webkitvisibilitychange', SOCIALBROWSER.blockEvent, true);
                    window.addEventListener('mozvisibilitychange', SOCIALBROWSER.blockEvent, true);

                    window.addEventListener('hasFocus', SOCIALBROWSER.blockEvent, true);
                    window.addEventListener('focus', SOCIALBROWSER.blockEvent, true);
                    window.addEventListener('focusin', SOCIALBROWSER.blockEvent, true);
                    window.addEventListener('focusout', SOCIALBROWSER.blockEvent, true);
                    window.addEventListener('blur', SOCIALBROWSER.blockEvent, true);
                    window.addEventListener('mouseleave', SOCIALBROWSER.blockEvent, true);
                    window.addEventListener('mouseenter', SOCIALBROWSER.blockEvent, true);

                    setInterval(() => {
                        window.onblur = window.onfocus = function () {};
                    }, 1000);
                }

                if (SOCIALBROWSER.session.privacy.vpc.block_rtc) {
                    try {
                        SOCIALBROWSER.webContents.setWebRTCIPHandlingPolicy('disable_non_proxied_udp');
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }

                    SOCIALBROWSER.RTCPeerConnection = function () {
                        return {
                            createDataChannel: function () {},
                            createOffer: function () {
                                return new Promise((resolve, reject) => {
                                    resolve({});
                                });
                            },
                            setLocalDescription: function () {
                                return new Promise((resolve, reject) => {
                                    resolve({});
                                });
                            },
                        };
                    };

                    SOCIALBROWSER.navigator.getUserMedia = undefined;
                    window.MediaStreamTrack = undefined;
                    window.RTCPeerConnection = SOCIALBROWSER.RTCPeerConnection;
                    window.RTCSessionDescription = undefined;

                    SOCIALBROWSER.navigator.mozGetUserMedia = undefined;
                    window.mozMediaStreamTrack = undefined;
                    window.mozRTCPeerConnection = SOCIALBROWSER.RTCPeerConnection;
                    window.mozRTCSessionDescription = undefined;

                    SOCIALBROWSER.navigator.webkitGetUserMedia = undefined;
                    window.webkitMediaStreamTrack = undefined;
                    window.webkitRTCPeerConnection = SOCIALBROWSER.RTCPeerConnection;
                    window.webkitRTCSessionDescription = undefined;
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_media_devices) {
                    SOCIALBROWSER.navigator.mediaDevices = Object.create(Object.getPrototypeOf(navigator.mediaDevices || {}));
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.mediaDevices, 'ondevicechange', null);
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.mediaDevices, 'enumerateDevices', () => {
                        return new Promise((resolve, reject) => {
                            resolve([]);
                        });
                    });
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.mediaDevices, 'getUserMedia', () => {
                        return new Promise((resolve, reject) => {
                            reject('access block');
                        });
                    });
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.mediaDevices, 'getSupportedConstraints', () => {
                        return {};
                    });
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_audio) {
                    SOCIALBROWSER.audioContext = {
                        BUFFER: null,
                        getChannelData: function (e) {
                            const getChannelData = e.prototype.getChannelData;
                            Object.defineProperty(e.prototype, 'getChannelData', {
                                value: function () {
                                    const results_1 = getChannelData.apply(this, arguments);
                                    if (SOCIALBROWSER.audioContext.BUFFER !== results_1) {
                                        SOCIALBROWSER.audioContext.BUFFER = results_1;
                                        window.top.postMessage('audiocontext-fingerprint-defender-alert', '*');

                                        let audio_r1_idx = SOCIALBROWSER.getStorage('audio_r1_idx');
                                        let audio_r1_vx = SOCIALBROWSER.getStorage('audio_r1_vx');
                                        if (audio_r1_idx && audio_r1_vx) {
                                            for (let iter = 0, i = 0; i < results_1.length; i += 100, iter += 1) {
                                                let index = audio_r1_idx[iter];
                                                let val = audio_r1_vx[iter];
                                                results_1[index] = results_1[index] + val;
                                            }
                                        } else {
                                            let indxs = [];
                                            let vals = [];
                                            for (let i = 0; i < results_1.length; i += 100) {
                                                let index = Math.floor(Math.random() * i);
                                                let val = Math.random() * 0.0000001;
                                                indxs.push(index);
                                                vals.push(val);
                                                results_1[index] = results_1[index] + val;
                                            }
                                            SOCIALBROWSER.setStorage('audio_r1_idx', indxs);
                                            SOCIALBROWSER.setStorage('audio_r1_vx', vals);
                                        }
                                    }

                                    return results_1;
                                },
                            });
                        },

                        createAnalyser: function (e) {
                            const createAnalyser = e.prototype.__proto__.createAnalyser;
                            Object.defineProperty(e.prototype.__proto__, 'createAnalyser', {
                                value: function () {
                                    const results_2 = createAnalyser.apply(this, arguments);
                                    const getFloatFrequencyData = results_2.__proto__.getFloatFrequencyData;
                                    Object.defineProperty(results_2.__proto__, 'getFloatFrequencyData', {
                                        value: function () {
                                            window.top.postMessage('audiocontext-fingerprint-defender-alert', '*');
                                            const results_3 = getFloatFrequencyData.apply(this, arguments);

                                            let audio_r3_idx = SOCIALBROWSER.getStorage('audio_r3_idx');
                                            let audio_r3_vx = SOCIALBROWSER.getStorage('audio_r3_vx');
                                            if (audio_r3_idx && audio_r3_vx) {
                                                for (let iter = 0, i = 0; i < audio_r3_idx.length; i += 100, iter += 1) {
                                                    let index = audio_r3_idx[iter];
                                                    let val = audio_r3_vx[iter];
                                                    arguments[0][index] = arguments[0][index] + val;
                                                }
                                            } else {
                                                let indxs = [];
                                                let vals = [];
                                                for (var i = 0; i < arguments[0].length; i += 100) {
                                                    let index = Math.floor(Math.random() * i);
                                                    let val = Math.random() * 0.1;
                                                    indxs.push(index);
                                                    vals.push(val);
                                                    arguments[0][index] = arguments[0][index] + val;
                                                }
                                                SOCIALBROWSER.setStorage('audio_r3_idx', indxs);
                                                SOCIALBROWSER.setStorage('audio_r3_vx', vals);
                                            }
                                            return results_3;
                                        },
                                    });
                                    return results_2;
                                },
                            });
                        },
                    };
                    SOCIALBROWSER.audioContext.getChannelData(AudioBuffer);
                    SOCIALBROWSER.audioContext.createAnalyser(AudioContext);
                    SOCIALBROWSER.audioContext.getChannelData(OfflineAudioContext);
                    SOCIALBROWSER.audioContext.createAnalyser(OfflineAudioContext);
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_webgl) {
                    SOCIALBROWSER.__setConstValue(WebGLRenderingContext, 'getParameter', () => '');
                    SOCIALBROWSER.__setConstValue(WebGL2RenderingContext, 'getParameter', () => '');
                    SOCIALBROWSER.configWebGL = {
                        random: {
                            value: function (key = false) {
                                let rand;
                                if (key) {
                                    let get = SOCIALBROWSER.getStorage('webgl_rv_' + key);
                                    rand = get ? get : Math.random();
                                    if (!get) SOCIALBROWSER.setStorage('webgl_rv_' + key, rand);
                                } else {
                                    rand = Math.random();
                                }
                                return rand;
                            },
                            item: function (key, e) {
                                let get = SOCIALBROWSER.getStorage('webgl_' + key);
                                let rand = get ? get : e.length * SOCIALBROWSER.configWebGL.random.value();
                                if (!get) SOCIALBROWSER.setStorage('webgl_' + key, rand);
                                return e[Math.floor(rand)];
                            },
                            number: function (key, power) {
                                var tmp = [];
                                for (var i = 0; i < power.length; i++) {
                                    tmp.push(Math.pow(2, power[i]));
                                }
                                return SOCIALBROWSER.configWebGL.random.item(key, tmp);
                            },
                            int: function (key, power) {
                                var tmp = [];
                                for (var i = 0; i < power.length; i++) {
                                    var n = Math.pow(2, power[i]);
                                    tmp.push(new Int32Array([n, n]));
                                }
                                return SOCIALBROWSER.configWebGL.random.item(key, tmp);
                            },
                            float: function (key, power) {
                                var tmp = [];
                                for (var i = 0; i < power.length; i++) {
                                    var n = Math.pow(2, power[i]);
                                    tmp.push(new Float32Array([1, n]));
                                }
                                return SOCIALBROWSER.configWebGL.random.item(key, tmp);
                            },
                        },
                        spoof: {
                            webgl: {
                                buffer: function (target) {
                                    var proto = target.prototype ? target.prototype : target.__proto__;
                                    const bufferData = proto.bufferData;
                                    Object.defineProperty(proto, 'bufferData', {
                                        value: function () {
                                            var index = Math.floor(SOCIALBROWSER.configWebGL.random.value('bufferDataIndex') * arguments[1].length);
                                            var noise = arguments[1][index] !== undefined ? 0.1 * SOCIALBROWSER.configWebGL.random.value('bufferDataNoise') * arguments[1][index] : 0;
                                            arguments[1][index] = arguments[1][index] + noise;
                                            return bufferData.apply(this, arguments);
                                        },
                                    });
                                },
                                parameter: function (target) {
                                    var proto = target.prototype ? target.prototype : target.__proto__;
                                    const getParameter = proto.getParameter;
                                    Object.defineProperty(proto, 'getParameter', {
                                        value: function () {
                                            if (arguments[0] === 3415) return 0;
                                            else if (arguments[0] === 3414) return 24;
                                            else if (arguments[0] === 36348) return 30;
                                            else if (arguments[0] === 7936) return 'WebKit';
                                            else if (arguments[0] === 37445) return 'Google Inc. (Intel)';
                                            else if (arguments[0] === 7937) return 'WebKit WebGL';
                                            else if (arguments[0] === 3379) return SOCIALBROWSER.configWebGL.random.number('3379', [14, 15]);
                                            else if (arguments[0] === 36347) return SOCIALBROWSER.configWebGL.random.number('36347', [12, 13]);
                                            else if (arguments[0] === 34076) return SOCIALBROWSER.configWebGL.random.number('34076', [14, 15]);
                                            else if (arguments[0] === 34024) return SOCIALBROWSER.configWebGL.random.number('34024', [14, 15]);
                                            else if (arguments[0] === 3386) return SOCIALBROWSER.configWebGL.random.int('3386', [13, 14, 15]);
                                            else if (arguments[0] === 3413) return SOCIALBROWSER.configWebGL.random.number('3413', [1, 2, 3, 4]);
                                            else if (arguments[0] === 3412) return SOCIALBROWSER.configWebGL.random.number('3412', [1, 2, 3, 4]);
                                            else if (arguments[0] === 3411) return SOCIALBROWSER.configWebGL.random.number('3411', [1, 2, 3, 4]);
                                            else if (arguments[0] === 3410) return SOCIALBROWSER.configWebGL.random.number('3410', [1, 2, 3, 4]);
                                            else if (arguments[0] === 34047) return SOCIALBROWSER.configWebGL.random.number('34047', [1, 2, 3, 4]);
                                            else if (arguments[0] === 34930) return SOCIALBROWSER.configWebGL.random.number('34930', [1, 2, 3, 4]);
                                            else if (arguments[0] === 34921) return SOCIALBROWSER.configWebGL.random.number('34921', [1, 2, 3, 4]);
                                            else if (arguments[0] === 35660) return SOCIALBROWSER.configWebGL.random.number('35660', [1, 2, 3, 4]);
                                            else if (arguments[0] === 35661) return SOCIALBROWSER.configWebGL.random.number('35661', [4, 5, 6, 7, 8]);
                                            else if (arguments[0] === 36349) return SOCIALBROWSER.configWebGL.random.number('36349', [10, 11, 12, 13]);
                                            else if (arguments[0] === 33902) return SOCIALBROWSER.configWebGL.random.float('33902', [0, 10, 11, 12, 13]);
                                            else if (arguments[0] === 33901) return SOCIALBROWSER.configWebGL.random.float('33901', [0, 10, 11, 12, 13]);
                                            else if (arguments[0] === 37446) return SOCIALBROWSER.configWebGL.random.item('37446', ['Graphics', 'HD Graphics', 'Intel(R) HD Graphics']);
                                            else if (arguments[0] === 7938) return SOCIALBROWSER.configWebGL.random.item('7938', ['WebGL 1.0', 'WebGL 1.0 (OpenGL)', 'WebGL 1.0 (OpenGL Chromium)']);
                                            else if (arguments[0] === 35724)
                                                return SOCIALBROWSER.configWebGL.random.item('35724', ['WebGL', 'WebGL GLSL', 'WebGL GLSL ES', 'WebGL GLSL ES (OpenGL Chromium)']);
                                            return getParameter.apply(this, arguments);
                                        },
                                    });
                                },
                            },
                        },
                    };
                    SOCIALBROWSER.configWebGL.spoof.webgl.buffer(WebGLRenderingContext);
                    SOCIALBROWSER.configWebGL.spoof.webgl.buffer(WebGL2RenderingContext);
                    SOCIALBROWSER.configWebGL.spoof.webgl.parameter(WebGLRenderingContext);
                    SOCIALBROWSER.configWebGL.spoof.webgl.parameter(WebGL2RenderingContext);
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_mimetypes) {
                    SOCIALBROWSER.navigator.mimeTypes = {
                        length: 0,
                        item: () => null,
                        namedItem: () => null,
                        refresh: () => {},
                    };
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_connection || SOCIALBROWSER.session.privacy.vpc.hide_connection) {
                    SOCIALBROWSER.navigator.connection = Object.create(Object.getPrototypeOf(navigator.connection || {}));
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.connection, 'addEventListener', function () {});
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.connection, 'onchange', null);
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.connection, 'effectiveType', SOCIALBROWSER.session.privacy.vpc.connection.effectiveType);
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.connection, 'rtt', SOCIALBROWSER.session.privacy.vpc.connection.rtt);
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.connection, 'downlink', SOCIALBROWSER.session.privacy.vpc.connection.downlink);
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.connection, 'downlinkMax', SOCIALBROWSER.session.privacy.vpc.connection.downlinkMax);
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.connection, 'saveData', false);
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.connection, 'type', SOCIALBROWSER.session.privacy.vpc.connection.type);
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_fonts) {
                    SOCIALBROWSER.__define(HTMLElement.prototype, 'offsetHeight', {
                        get() {
                            const height = Math.floor(this.getBoundingClientRect().height);
                            const valid = height && rand.sign() === 1;
                            const result = valid ? height + rand.noise() : height;
                            return result;
                        },
                    });
                    SOCIALBROWSER.__define(HTMLElement.prototype, 'offsetWidth', {
                        get() {
                            const width = Math.floor(this.getBoundingClientRect().width);
                            const valid = width && rand.sign() === 1;
                            const result = valid ? width + rand.noise() : width;
                            return result;
                        },
                    });
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_battery) {
                    let s = navigator.getBattery?.toString();
                    SOCIALBROWSER.navigator.getBattery = function () {
                        return new Promise((ok, err) => {
                            let bm = Object.create(BatteryManager.prototype);
                            SOCIALBROWSER.__setConstValue(bm, 'charging', ['', null, true, false][SOCIALBROWSER.maxOf(SOCIALBROWSER.sessionId(), 3)]);
                            SOCIALBROWSER.__setConstValue(bm, 'chargingTime', SOCIALBROWSER.maxOf(SOCIALBROWSER.sessionId(), 100));
                            SOCIALBROWSER.__setConstValue(bm, 'dischargingTime', 0);
                            SOCIALBROWSER.__setConstValue(bm, 'level', SOCIALBROWSER.maxOf(SOCIALBROWSER.sessionId(), 100) / 100);
                            SOCIALBROWSER.__setConstValue(bm, 'onchargingchange', null);
                            SOCIALBROWSER.__setConstValue(bm, 'onchargingtimechange', null);
                            SOCIALBROWSER.__setConstValue(bm, 'ondischargingtimechange', null);
                            SOCIALBROWSER.__setConstValue(bm, 'onlevelchange', null);

                            ok(bm);
                        });
                    };
                    SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.getBattery, 'toString', () => s);
                }

                if (SOCIALBROWSER.session.privacy.vpc.dnt) {
                    SOCIALBROWSER.navigator.doNotTrack = '1';
                } else {
                    SOCIALBROWSER.navigator.doNotTrack = '0';
                }

                if (SOCIALBROWSER.isMemoryMode) {
                    window.RequestFileSystem = window.webkitRequestFileSystem = function (arg1, arg2, callback, error) {
                        callback({
                            name: document.location.origin + ':' + arg1,
                            root: {
                                fullPath: '/',
                                isDirectory: true,
                                isFile: false,
                                name: '',
                            },
                        });
                    };
                    SOCIALBROWSER.navigator.storage = {};
                    SOCIALBROWSER.navigator.storage.estimate = function () {
                        return new Promise((resolve, reject) => {
                            resolve({
                                usage: SOCIALBROWSER.random(100000, 1000000),
                                quota: SOCIALBROWSER.random(1200000000, 12000000000),
                            });
                        });
                    };
                    try {
                        if (!window.localStorage) {
                            window.localStorage = window.sessionStorage;
                        }
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }

                    window.indexedDB = {
                        open: () => {
                            let db = {};
                            setTimeout(() => {
                                if (db.onsuccess) {
                                    db.onsuccess();
                                }
                            }, 1000);
                            return db;
                        },
                    };
                }

                SOCIALBROWSER.log('.... [ Finger Printing ON ] .... ' + document.location.href);
            }
        })();

        try {
            if (SOCIALBROWSER.var.blocking.javascript.custom_local_storage && localStorage) {
                SOCIALBROWSER.localStorage = window.localStorage;
                SOCIALBROWSER.__setConstValue(window, 'localStorage', {
                    setItem: function (key, value) {
                        return SOCIALBROWSER.localStorage.setItem(key, value);
                    },
                    getItem: function (key) {
                        let value = SOCIALBROWSER.localStorage.getItem(key);
                        return value;
                    },
                    get length() {
                        return SOCIALBROWSER.localStorage.length;
                    },
                    removeItem: function (key) {
                        return SOCIALBROWSER.localStorage.removeItem(key);
                    },
                    clear: function () {
                        return SOCIALBROWSER.localStorage.clear();
                    },
                    key: function (index) {
                        return SOCIALBROWSER.localStorage.key(index);
                    },
                });
            }
        } catch (error) {
            SOCIALBROWSER.log(error);
        }

        try {
            if (SOCIALBROWSER.var.blocking.javascript.custom_session_storage && sessionStorage) {
                SOCIALBROWSER.sessionStorage = window.sessionStorage;

                let hack = {
                    setItem: function (key, value) {
                        return SOCIALBROWSER.sessionStorage.setItem(key, value);
                    },
                    getItem: function (key) {
                        let value = SOCIALBROWSER.sessionStorage.getItem(key);
                        return value;
                    },
                    get length() {
                        return SOCIALBROWSER.sessionStorage.length;
                    },
                    removeItem: function (key) {
                        return SOCIALBROWSER.sessionStorage.removeItem(key);
                    },
                    clear: function () {
                        return SOCIALBROWSER.sessionStorage.clear();
                    },
                    key: function (index) {
                        return SOCIALBROWSER.sessionStorage.key(index);
                    },
                };

                SOCIALBROWSER.__setConstValue(window, 'sessionStorage', hack);
            }
        } catch (error) {
            SOCIALBROWSER.log(error);
        }

        SOCIALBROWSER.on('$download_item', (e, dl) => {
            if (dl.status === 'delete') {
                SOCIALBROWSER.showDownloads();
            } else {
                SOCIALBROWSER.showDownloads(
                    ` ${dl.status} ${((dl.received / dl.total) * 100).toFixed(2)} %  ${dl.name} ( ${(dl.received / 1000000).toFixed(2)} MB / ${(dl.total / 1000000).toFixed(2)} MB )`,
                );
                if (typeof dl.progress != 'undefined') {
                    dl.progress = parseFloat(dl.progress || 0);
                    SOCIALBROWSER.window.setProgressBar(dl.progress || 0);
                }
            }
        });

        SOCIALBROWSER.on('[window-action]', (e, data) => {
            if (data.name == 'toggle-page-images') {
                SOCIALBROWSER.togglePageImages();
            } else if (data.name == 'toggle-page-content') {
                SOCIALBROWSER.togglePageContent();
            } else if (data.name == 'new-window') {
                let defaultUserAgent = SOCIALBROWSER.getRandomBrowser('pc');
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: SOCIALBROWSER.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    defaultUserAgent: defaultUserAgent,
                    width: defaultUserAgent.screen.width,
                    height: defaultUserAgent.screen.height,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'open-in-ghost-window') {
                let browser = SOCIALBROWSER.getRandomBrowser('pc');
                let ghost = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: ghost,
                    user_name: ghost,
                    url: document.location.href,
                    referrer: document.location.href,
                    defaultUserAgent: browser,
                    vpc: SOCIALBROWSER.generateVPC('pc'),
                    width: browser.screen.width,
                    height: browser.screen.height,
                    show: true,
                    iframe: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-ghost-mobile-window') {
                let browser = SOCIALBROWSER.getRandomBrowser('mobile');
                let ghost = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: ghost,
                    user_name: ghost,
                    url: document.location.href,
                    referrer: document.location.href,
                    defaultUserAgent: browser,
                    vpc: SOCIALBROWSER.generateVPC('mobile', 'chrome'),
                    width: browser.screen.width,
                    height: browser.screen.height,
                    show: true,
                    iframe: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-insecure-window') {
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: SOCIALBROWSER.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    security: false,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-sandbox-window') {
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: SOCIALBROWSER.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    sandbox: true,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-ads-window') {
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: SOCIALBROWSER.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    allowAds: true,
                    allowPopup: true,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-off-window') {
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: SOCIALBROWSER.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    off: true,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'new-mobile-window') {
                let browser = SOCIALBROWSER.getRandomBrowser('mobile');
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: SOCIALBROWSER.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    defaultUserAgent: browser,
                    width: browser.screen.width,
                    height: browser.screen.height,
                    show: true,
                    center: true,
                    alwaysOnTop: true,
                });
            } else if (data.name == 'open-external') {
                SOCIALBROWSER.openExternal(data.url);
            } else if (data.name == 'open-in-chrome') {
                SOCIALBROWSER.openInChrome({ auto: false });
            } else if (data.name == 'open-in-chrome-session') {
                SOCIALBROWSER.openInChrome({ auto: true });
            } else if (data.name == 'play-video') {
                let video = document.querySelector('video');
                if (video) {
                    video.play();
                }
            } else if (data.name == 'pause-video') {
                let video = document.querySelector('video');
                if (video) {
                    video.pause();
                }
            } else if (data.name == 'skip-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        video.currentTime = parseFloat(video.duration);
                        setTimeout(() => {
                            video.dispatchEvent(new Event('ended'));
                        }, 200);
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }
                }
            } else if (data.name == 'reset-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        video.currentTime = 0;
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }
                }
            } else if (data.name == '+10s-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        let newTime = video.currentTime + 10;
                        if (newTime <= video.duration) {
                            video.currentTime = newTime;
                        }
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }
                }
            } else if (data.name == '+60s-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        let newTime = video.currentTime + 60;
                        if (newTime <= video.duration) {
                            video.currentTime = newTime;
                        }
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }
                }
            } else if (data.name == '-10s-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        let newTime = video.currentTime - 10;
                        if (newTime >= 0) {
                            video.currentTime = newTime;
                        }
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }
                }
            } else if (data.name == '-60s-video') {
                let video = document.querySelector('video');
                if (video) {
                    try {
                        let newTime = video.currentTime - 60;
                        if (newTime >= 0) {
                            video.currentTime = newTime;
                        }
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }
                }
            } else if (data.name == 'full-screen-video') {
                let video = document.querySelector('#vplayer:has(video) , .jwplayer:has(video) , .player:has(video)  , video');
                if (video) {
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        if (document.fullscreenEnabled) {
                            video
                                .requestFullscreen()
                                .then(() => {
                                    if (video.tagName == 'VIDEO') {
                                        video.setAttribute('controls', 'controls');
                                    }
                                })
                                .catch((err) => SOCIALBROWSER.log(err));
                        }
                    }
                }
            } else if (data.name == 'tv-mode') {
                SOCIALBROWSER.allowTvMode();
            } else if (data.name == 'toggle-page-images') {
                SOCIALBROWSER.togglePageImages();
            } else if (data.name == 'toggle-page-images') {
                SOCIALBROWSER.togglePageImages();
            } else if (data.name == 'translate') {
                SOCIALBROWSER.allowGoogleTranslate();
            } else if (data.name == 'screen-shot') {
                SOCIALBROWSER.$screenshot();
            } else if (data.name == 'save-page') {
                SOCIALBROWSER.showUserMessage('Page Saving <br> ' + document.location.href);
                SOCIALBROWSER.webContents.downloadURL(document.location.href);
            }
        });

        SOCIALBROWSER.allowTvMode = function () {
            clearTimeout(SOCIALBROWSER.allowTvModeTimeout);

            if (document.querySelector('video[src*="//"]')) {
                document.querySelectorAll(':not(:has(video[src*="//"]))').forEach((el) => {
                    if (!el.tagName.like('*video*|*head*|*style*|*meta*|*link*|*source*')) {
                        el.remove();
                    } else if (el.tagName == 'VIDEO') {
                        el.id = 'ghost_' + Date.now();
                        el.className = '';
                        document.querySelectorAll('#vplayer,#video_player,.jwplayer').forEach((jw) => {
                            jw.className = '';
                        });

                        clearInterval(SOCIALBROWSER.setVideoStyleInterval);
                        SOCIALBROWSER.setVideoStyleInterval = setInterval(() => {
                            el.setAttribute('controls', 'controls');
                            el.removeAttribute('controlslist');
                            el.style.position = 'fixed';
                            el.style.top = 0;
                            el.style.bottom = 0;
                            el.style.right = 0;
                            el.style.left = 0;
                            el.style.width = '100vw';
                            el.style.height = '100vh';
                            el.style.zIndex = 9999999999999;
                            el.style.background = '#272727';
                        }, 50);
                    }
                });
            } else if (document.querySelector('video source[src*="//"]')) {
                document.querySelectorAll(':not(:has(video source[src*="//"]))').forEach((el) => {
                    if (!el.tagName.like('*video*|*head*|*style*|*meta*|*link*|*source*')) {
                        el.remove();
                    } else if (el.tagName == 'VIDEO') {
                        el.id = 'ghost_' + Date.now();
                        el.className = '';
                        document.querySelectorAll('#vplayer,#video_player,.jwplayer').forEach((jw) => {
                            jw.className = '';
                        });

                        clearInterval(SOCIALBROWSER.setVideoStyleInterval);
                        SOCIALBROWSER.setVideoStyleInterval = setInterval(() => {
                            el.setAttribute('controls', 'controls');
                            el.removeAttribute('controlslist');
                            el.style.position = 'fixed';
                            el.style.top = 0;
                            el.style.bottom = 0;
                            el.style.right = 0;
                            el.style.left = 0;
                            el.style.width = '100vw';
                            el.style.height = '100vh';
                            el.style.zIndex = 9999999999999;
                            el.style.background = '#272727';
                        }, 50);
                    }
                });
            }
            SOCIALBROWSER.allowTvModeTimeout = setTimeout(() => {
                SOCIALBROWSER.allowTvMode();
            }, 1000);
        };

        SOCIALBROWSER.togglePageImages = function () {
            SOCIALBROWSER.pageImagesVisable = !SOCIALBROWSER.pageImagesVisable;
            clearInterval(SOCIALBROWSER.pageImagesVisableInterval);
            SOCIALBROWSER.pageImagesVisableInterval = setInterval(() => {
                document.querySelectorAll('img,image').forEach((img) => {
                    if (SOCIALBROWSER.pageImagesVisable) {
                        img.style.visibility = 'hidden';
                    } else {
                        img.style.visibility = 'visible';
                    }
                });
            }, 500);
        };
        SOCIALBROWSER.togglePageContent = function () {
            SOCIALBROWSER.pageImagesContent = !SOCIALBROWSER.pageImagesContent;
            clearTimeout(SOCIALBROWSER.pageImagesContentTimeout);
            document.querySelectorAll('html').forEach((html) => {
                if (SOCIALBROWSER.pageImagesContent) {
                    html.style.opacity = 0;
                } else {
                    html.style.opacity = 1;
                }
            });
        };
        SOCIALBROWSER.on('[toggle-window-edit]', (e, data) => {
            SOCIALBROWSER.toggleWindowEditStatus = !SOCIALBROWSER.toggleWindowEditStatus;
            let html = document.querySelector('html');
            if (html) {
                if (SOCIALBROWSER.toggleWindowEditStatus) {
                    html.contentEditable = true;
                    html.style.border = '10px dashed green';
                    alert('Edit Mode Activated');
                } else {
                    html.contentEditable = 'inherit';
                    html.style.border = '0px solid white';
                }
            }
        });

        SOCIALBROWSER.on('[send-render-message]', (event, data) => {
            if (data.name == 'update-target-url') {
                SOCIALBROWSER.showInfo(data.url);
            } else if (data.name == '[open new popup]') {
                SOCIALBROWSER.ipc('[open new popup]', data);
            } else if (data.name == '[show-user-message]') {
                SOCIALBROWSER.showUserMessage(data.message);
            } else if (data.name == 'location.replace') {
                window.location.replace(data.url);
            } else {
                console.log(data);
            }
        });

        SOCIALBROWSER.on('[alert]', (event, data) => {
            alert(data.message);
        });
        SOCIALBROWSER.on('[show-user-message]', (event, data) => {
            SOCIALBROWSER.showUserMessage(data.message);
        });
        SOCIALBROWSER.on('[update-browser-var]', (e, res) => {
            if (res.options.name == 'user_data_input') {
                SOCIALBROWSER.var.user_data_input = [];
                res.options.data.forEach((d) => {
                    if (document.location.href.indexOf(d.hostname) !== -1) {
                        SOCIALBROWSER.var.user_data_input.push(d);
                    }
                });

                return;
            }

            if (res.options.name == 'user_data') {
                SOCIALBROWSER.var.user_data = [];
                res.options.data.forEach((d) => {
                    if (document.location.href.indexOf(d.hostname) !== -1) {
                        SOCIALBROWSER.var.user_data.push(d);
                    }
                });

                return;
            }

            SOCIALBROWSER.var[res.options.name] = res.options.data;
            if (SOCIALBROWSER.onVarUpdated) {
                SOCIALBROWSER.onVarUpdated(res.options.name, res.options.data);
            }

            SOCIALBROWSER.callEvent('updated', { name: res.options.name });
        });
        SOCIALBROWSER.onShare((data) => {
            if (data == '[hide-main-window]' && SOCIALBROWSER.customSetting.windowType == 'main') {
                SOCIALBROWSER.window.hide();
            }
            if (data == '[show-main-window]' && SOCIALBROWSER.customSetting.windowType == 'main') {
                SOCIALBROWSER.window.show();
            }
        });

        SOCIALBROWSER.onMessage((message) => {
            if (message.name == 'new-video-exists') {
                let index = SOCIALBROWSER.video_list.findIndex((v0) => v0.src == message.src);
                if (index === -1) {
                    SOCIALBROWSER.video_list.push({
                        src: message.src,
                    });
                }
            } else if (message.name == '[allowDefaultWorker]') {
                SOCIALBROWSER.allowDefaultWorker = true;
            } else if (message.name == '[user-message]') {
                if (!SOCIALBROWSER.isIframe()) {
                    SOCIALBROWSER.showUserMessage(message.message);
                }
            } else if (message.name == '[recaptcha-detected]') {
                SOCIALBROWSER.captchaDetected = true;
                SOCIALBROWSER.showUserMessage('recaptcha Detected');
                SOCIALBROWSER.run2Captcha();
            } else if (message.name == '[captcha-detected]') {
                SOCIALBROWSER.captchaDetected = true;
                SOCIALBROWSER.showUserMessage('captcha Detected');
            } else if (message.name == '2captcha_in') {
                if (!SOCIALBROWSER.isIframe()) {
                    SOCIALBROWSER.fetch2Captcha_in(message);
                }
            } else if (message.name == '2captcha_res') {
                if (!SOCIALBROWSER.isIframe()) {
                    SOCIALBROWSER.fetch2Captcha_res(message);
                }
            } else if (message.name == '2captcha_request') {
                SOCIALBROWSER.fetch2Captcha_request(message);
            } else if (message.name == 'captcha_solved') {
                function getRecaptchaCallback() {
                    for (let item_key in ___grecaptcha_cfg.clients[0]) {
                        if (___grecaptcha_cfg.clients[0][item_key]) {
                            if (___grecaptcha_cfg.clients[0][item_key].hasOwnProperty(item_key)) {
                                if (___grecaptcha_cfg.clients[0][item_key][item_key].hasOwnProperty('callback')) {
                                    return ___grecaptcha_cfg.clients[0][item_key][item_key];
                                }
                            }
                        }
                    }
                }

                let callback2Captcha = null;

                if (typeof ___grecaptcha_cfg !== 'undefined') {
                    callback2Captcha = getRecaptchaCallback();
                    if (callback2Captcha) {
                        if (typeof callback2Captcha.callback === 'function') {
                            callback2Captcha.callback(message.response);
                        } else if (typeof callback2Captcha.callback === 'string' && window[callback2Captcha.callback] && typeof window[callback2Captcha.callback] === 'function') {
                            window[callback2Captcha.callback](message.response);
                        }
                    }
                }
                if (!callback2Captcha) {
                    let reCaptcha = SOCIALBROWSER.$('.g-recaptcha');
                    if (reCaptcha) {
                        let reCaptchaCallback = reCaptcha.dataset.callback;
                        if (reCaptchaCallback) {
                            window[reCaptchaCallback]();
                        }
                    }
                }
            }
        });

        SOCIALBROWSER.navigator.clipboard = Object.create(Object.getPrototypeOf(navigator.clipboard || {}));
        SOCIALBROWSER.__setConstValue(SOCIALBROWSER.navigator.clipboard, 'writeText', SOCIALBROWSER.copy);

        if (SOCIALBROWSER.window.eval) {
            SOCIALBROWSER.eval(SOCIALBROWSER.window.eval);
        }

        if (SOCIALBROWSER.customSetting.eval) {
            SOCIALBROWSER.eval(SOCIALBROWSER.customSetting.eval);
        }

        if (SOCIALBROWSER.customSetting.script && SOCIALBROWSER.customSetting.script.preload) {
            SOCIALBROWSER.runUserScript(SOCIALBROWSER.customSetting.script);
        }

        if (!document.location.href.like('*127.0.0.1:60080*')) {
            SOCIALBROWSER.var.scriptList.forEach((_script) => {
                if (_script.auto && _script.preload && document.location.href.like(_script.allowURLs) && !document.location.href.like(_script.blockURLs)) {
                    if (SOCIALBROWSER.isIframe()) {
                        if (_script.iframe) {
                            SOCIALBROWSER.runUserScript(_script);
                        }
                    } else {
                        if (_script.window) {
                            SOCIALBROWSER.runUserScript(_script);
                        }
                    }
                }
            });
        }

        SOCIALBROWSER.onLoad(() => {
            SOCIALBROWSER.url = document.location.href;

            (function urlChanged() {
                setInterval(() => {
                    if (SOCIALBROWSER.url !== document.location.href) {
                        SOCIALBROWSER.url = document.location.href;
                        window.dispatchEvent(new CustomEvent('urlchange'));
                        if (window.onurlchange && typeof window.onurlchange == 'function') {
                            window.onurlchange();
                        }
                    }
                }, 1000);
            })();

            if (SOCIALBROWSER.customSetting.script && !SOCIALBROWSER.customSetting.script.preload) {
                SOCIALBROWSER.runUserScript(SOCIALBROWSER.customSetting.script);
            }

            if (!document.location.href.like('*127.0.0.1:60080*')) {
                SOCIALBROWSER.var.scriptList.forEach((_script) => {
                    if (_script.auto && !_script.preload && document.location.href.like(_script.allowURLs) && !document.location.href.like(_script.blockURLs)) {
                        if (SOCIALBROWSER.isIframe()) {
                            if (_script.iframe) {
                                SOCIALBROWSER.runUserScript(_script);
                            }
                        } else {
                            if (_script.window) {
                                SOCIALBROWSER.runUserScript(_script);
                            }
                        }
                    }
                });
            }

            setInterval(() => {
                document.querySelectorAll('video , video source').forEach((node) => {
                    if (node.src) {
                        SOCIALBROWSER.sendMessage({
                            name: 'new-video-exists',
                            src: node.src,
                        });
                    }
                });
            }, 1000);
        });
    })();

    (function loadOnlineUserJS() {
        SOCIALBROWSER.installUserJS = function (url) {
            let index = SOCIALBROWSER.var.scriptList.findIndex((s) => s.id == url);
            if (index == -1) {
                alert('User Script installing ...');

                SOCIALBROWSER.fetch({ url: url }).then((res) => {
                    if (res.status == 200 && res.headers['content-type'] && res.headers['content-type'][0].contain('javascript') && res.body) {
                        let script = { allowURLs: '*://*', auto: true, show: true, window: true, iframe: true, blockURLs: '' };
                        script.js = res.body;
                        script.meta = SOCIALBROWSER.getUserScriptMeta(script.js);
                        if (script.meta.name) {
                            script.id = url;

                            if (script.meta.match) {
                                script.allowURLs = script.meta.match;
                            } else if (script.meta.include) {
                                script.allowURLs = script.meta.include;
                            }
                            if (script.meta.name) {
                                script.title = script.meta.name;
                            }
                            if (script.meta.exclude) {
                                script.blockURLs = script.meta.exclude;
                            }
                            if (typeof script.meta.noframes !== 'undefined') {
                                script.iframe = false;
                            }
                            SOCIALBROWSER.var.scriptList.push(script);
                            SOCIALBROWSER.updateBrowserVar('scriptList', SOCIALBROWSER.var.scriptList);
                            alert('User Script installed : ' + script.meta.name);
                        } else {
                            alert('User Script install failed : No name found in meta');
                        }
                    }
                });
            } else {
                alert('User Script already installed ');
            }
        };

        SOCIALBROWSER.onLoad(() => {
            SOCIALBROWSER.on('[install-user.js]', (event, message) => {
                SOCIALBROWSER.installUserJS(message.url);
            });
        });
    })();
};

SOCIALBROWSER.init = function () {
    SOCIALBROWSER.browserData = SOCIALBROWSER.ipcSync('[browser][data]', {
        partition: SOCIALBROWSER.partition,
        url: SOCIALBROWSER.href,
        domain: SOCIALBROWSER.domain,
        propertyList: SOCIALBROWSER.propertyList,
        windowID: SOCIALBROWSER._window.id,
    });

    if (SOCIALBROWSER.browserData.customSetting.isWorker && document.location.href.like('chrome-error:*')) {
        SOCIALBROWSER.ipc(
            'window.message',
            {
                windowID: SOCIALBROWSER.browserData.customSetting.parentWindowID,
                toParentFrame: SOCIALBROWSER.browserData.customSetting.parentFrame,
                data: { name: '[allowDefaultWorker]' },
                origin: '*',
            },
            true,
        );

        window.close();
        return;
    }

    SOCIALBROWSER.init2();

    if (!SOCIALBROWSER.window.newStorageSet) {
        if (SOCIALBROWSER.customSetting.localStorageList) {
            SOCIALBROWSER.customSetting.localStorageList.forEach((s) => {
                localStorage[s.key] = s.value;
            });
        }
        if (SOCIALBROWSER.customSetting.sessionStorageList) {
            SOCIALBROWSER.customSetting.sessionStorageList.forEach((s) => {
                sessionStorage[s.key] = s.value;
            });
        }
        SOCIALBROWSER.window.newStorageSet = true;
    }

    SOCIALBROWSER.onLoad(() => {
        // if(document.location.href.like('*://*/recaptcha/*')) {
        //     SOCIALBROWSER.sendMessage({ name: '[captcha-detected]' });
        // }
        if (!SOCIALBROWSER.customSetting.isWorker) {
            SOCIALBROWSER.injectDefault();
            if (SOCIALBROWSER.customSetting.allowGoogleTranslate) {
                SOCIALBROWSER.allowGoogleTranslate();
            }
            if (SOCIALBROWSER.href.like('chrome-error:*')) {
                SOCIALBROWSER.addHTML('<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" src="browser://error"></iframe>');
            }
        }
    });
};

SOCIALBROWSER._window = SOCIALBROWSER._window || SOCIALBROWSER.ipcSync('[window]');

SOCIALBROWSER._window.fnList.forEach((fn) => {
    SOCIALBROWSER._window[fn] = (...params) => SOCIALBROWSER.fn('window.' + fn, ...params);
});
SOCIALBROWSER._window.on = function () {};

SOCIALBROWSER.init();

if ((navigatorHandle = false)) {
    SOCIALBROWSER.navigator2 = SOCIALBROWSER.navigator;
    SOCIALBROWSER.navigator = {
        //  deviceMemory : SOCIALBROWSER.navigator2.deviceMemory,
        //  hardwareConcurrency : SOCIALBROWSER.navigator2.hardwareConcurrency,
        // language : SOCIALBROWSER.navigator2.language,
        // languages : SOCIALBROWSER.navigator2.languages,
    };
}

if (!SOCIALBROWSER.javaScriptOFF) {
    if (SOCIALBROWSER.isWhiteSite) {
        for (const key in SOCIALBROWSER.navigator) {
            SOCIALBROWSER.__define(navigator, key + '0', navigator[key]);
            SOCIALBROWSER.__setConstValue(navigator, key, SOCIALBROWSER.navigator[key]);
        }
    } else {
        navigator.webdriver = false;
        SOCIALBROWSER.__define(
            globalThis,
            'navigator',
            new Proxy(navigator, {
                apply(target, thisArg, argumentsList) {
                    return Reflect.apply(target, thisArg, argumentsList);
                },
                setProperty: function (target, property, value) {
                    if (target.hasOwnProperty(property)) return target[property];
                    return (target[property] = value);
                },
                get: function (target, property, receiver) {
                    if (property === '_') {
                        return target;
                    }
                    if (property.like('*0*')) {
                        return target[property.replace('0', '')];
                    }

                    if (target[property] instanceof Function) {
                        return target[property].bind(target);
                    }

                    // if (typeof target[property] instanceof Function) {
                    //     return function (...args) {
                    //         return target[property].apply(this === receiver ? target : this, args);
                    //     };
                    // }

                    return Object.hasOwn(SOCIALBROWSER.navigator, property) ? SOCIALBROWSER.navigator[property] : target[property];
                },
                set: function (target, property, value) {
                    target[property] = value;
                    return true;
                },
                defineProperty: function (target, property, desc) {
                    return this.setProperty(target, property, desc.value);
                },
                deleteProperty: function (target, property) {
                    return false;
                },
            }),
        );
    }
}

if (!SOCIALBROWSER.javaScriptOFF) {
    if ((createElement0 = true)) {
        document.createElement0 = document.createElement;
        let s = document.createElement.toString();
        document.createElement = function (...args) {
            let ele = document.createElement0(...args);

            Object.defineProperty(ele, 'innerHTML2', {
                get() {
                    return this.innerHTML;
                },
                set(value) {
                    this.innerHTML = SOCIALBROWSER.policy.createHTML(value);
                },
                enumerable: true,
                configurable: true,
            });

            Object.defineProperty(ele, 'textContent2', {
                get() {
                    return this.textContent;
                },
                set(value) {
                    if (ele.tagName.like('script')) {
                        this.textContent = SOCIALBROWSER.policy.createScript(value);
                    } else {
                        this.textContent = SOCIALBROWSER.policy.createHTML(value);
                    }
                },
                enumerable: true,
                configurable: true,
            });

            Object.defineProperty(ele, 'src2', {
                get() {
                    return this.src;
                },
                set(value) {
                    if (ele.tagName.like('script')) {
                        this.src = SOCIALBROWSER.policy.createScriptURL(value);
                    } else {
                        this.src = SOCIALBROWSER.policy.createHTML(value);
                    }
                },
                enumerable: true,
                configurable: true,
            });

            if (ele.tagName.like('iframe') && !SOCIALBROWSER.isWhiteSite && !SOCIALBROWSER.javaScriptOFF) {
                Object.defineProperty(ele, 'srcdoc', {
                    get() {
                        return ele.srcdoc0;
                    },
                    set(value) {
                        ele = document.createElement0(...args);
                        ele.srcdoc = value;
                        ele.srcdoc0 = value;
                        if (ele.contentWindow) {
                            SOCIALBROWSER.__define(ele.contentWindow, 'chrome', chrome);
                            SOCIALBROWSER.__define(ele.contentWindow, 'Date', Date);
                            SOCIALBROWSER.__define(ele.contentWindow, 'screen', screen);
                            SOCIALBROWSER.__define(ele.contentWindow, 'Intl', Intl);

                            SOCIALBROWSER.__define(
                                ele.contentWindow,
                                'navigator',
                                new Proxy(ele.contentWindow.navigator, {
                                    setProperty: function (target, key, value) {
                                        if (target.hasOwnProperty(key)) return target[key];
                                        return (target[key] = value);
                                    },
                                    get: function (target, key, receiver) {
                                        if (key === '_') {
                                            return target;
                                        }

                                        if (typeof target[key] === 'function') {
                                            return function (...args) {
                                                return target[key].apply(this === receiver ? target : this, args);
                                            };
                                        }
                                        return Object.hasOwn(SOCIALBROWSER.navigator, key) ? SOCIALBROWSER.navigator[key] : target[key];
                                    },
                                    set: function (target, key, value) {
                                        return this.setProperty(target, key, value);
                                    },
                                    defineProperty: function (target, key, desc) {
                                        return this.setProperty(target, key, desc.value);
                                    },
                                    deleteProperty: function (target, key) {
                                        return false;
                                    },
                                }),
                            );
                        }
                        return ele;
                    },
                    enumerable: true,
                    configurable: true,
                });
            }

            ele.nonce = 'social';

            return ele;
        };
        SOCIALBROWSER.__setConstValue(document.createElement, 'toString', () => s);

        let qs = document.querySelector.toString();
        document.querySelector0 = document.querySelector;
        document.querySelector = function (selector, ...args) {
            let ele = document.querySelector0(selector, ...args);
            if (ele && ele.tagName.like('iframe')) {
                if (ele.contentWindow) {
                    SOCIALBROWSER.__define(ele.contentWindow, 'chrome', chrome);
                    SOCIALBROWSER.__define(ele.contentWindow, 'Date', Date);
                    SOCIALBROWSER.__define(ele.contentWindow, 'screen', screen);
                    SOCIALBROWSER.__define(ele.contentWindow, 'Intl', Intl);
                    let href = ele.src || ele.contentWindow.location.href || document.location.href;
                    let isCrossOrigin = SOCIALBROWSER.var.blocking.white_list.some((site) => site.url.length > 2 && href.like(site.url));
                    if (!isCrossOrigin && !SOCIALBROWSER.isWhiteSite && !SOCIALBROWSER.javaScriptOFF) {
                        SOCIALBROWSER.__define(
                            ele.contentWindow,
                            'navigator',
                            new Proxy(ele.contentWindow.navigator, {
                                setProperty: function (target, key, value) {
                                    if (target.hasOwnProperty(key)) return target[key];
                                    return (target[key] = value);
                                },
                                get: function (target, key, receiver) {
                                    if (key === '_') {
                                        return target;
                                    }

                                    if (typeof target[key] === 'function') {
                                        return function (...args) {
                                            return target[key].apply(this === receiver ? target : this, args);
                                        };
                                    }
                                    return Object.hasOwn(SOCIALBROWSER.navigator, key) ? SOCIALBROWSER.navigator[key] : target[key];
                                },
                                set: function (target, key, value) {
                                    return this.setProperty(target, key, value);
                                },
                                defineProperty: function (target, key, desc) {
                                    return this.setProperty(target, key, desc.value);
                                },
                                deleteProperty: function (target, key) {
                                    return false;
                                },
                            }),
                        );
                    }
                }
            }
            return ele;
        };
        SOCIALBROWSER.__setConstValue(document.querySelector, 'toString', () => qs);
    }

    if ((defineProperty0 = true)) {
        Object.defineProperty0 = Object.defineProperty;
        let s = Object.defineProperty.toString();
        Object.defineProperty = function (o, p, d) {
            if (o === navigator) {
                if (p == 'webdriver') {
                    Object.defineProperty0(SOCIALBROWSER.navigator, p, d);
                    return o;
                } else if (p == 'platform') {
                    return o;
                }
                Object.defineProperty0(navigator._, p, d);
                return o;
            }
            return Object.defineProperty0(o, p, d);
        };
        SOCIALBROWSER.__setConstValue(Object.defineProperty, 'toString', () => s);
    }
}

if (!SOCIALBROWSER.isWhiteSite) {
    if ((stringify0 = false)) {
        JSON.stringify0 = JSON.stringify;
        let j = JSON.stringify.toString();
        JSON.stringify = function (...args) {
            try {
                arguments[0] = SOCIALBROWSER.cloneObject(arguments[0]);
                return JSON.stringify0.apply(this, arguments);
            } catch (error) {
                console.log(error);
                JSON.stringify = json.stringify0;
                return JSON.stringify(...args);
            }
        };
        SOCIALBROWSER.__setConstValue(JSON.stringify, 'toString', () => j);
    }

    if (true) {
        if (true) {
            window.fetch0 = window.fetch;
            let s = window.fetch.toString();

            window.fetch = function (...args) {
                return new Promise((resolve, reject) => {
                    window
                        .fetch0(...args)
                        .then((res) => {
                            if (typeof args[0] == 'string' && args[0].like('*fingerprint.com*')) {
                                res.text().then((text) => {
                                    if (text.like('{*')) {
                                        let data = JSON.parse(text);
                                        if (data.botd && data.botd.data && data.botd.data.bot) {
                                            data.botd.data.bot = {
                                                result: 'notDetected',
                                            };
                                        } else if (data.products && data.products.botd && data.products.botd.data && data.products.botd.data.bot) {
                                            data.products.botd.data.bot = {
                                                result: 'notDetected',
                                            };
                                        }
                                        res.text = function () {
                                            return new Promise((resolve, reject) => {
                                                resolve(JSON.stringify(data));
                                            });
                                        };
                                        res.json = function () {
                                            return new Promise((resolve, reject) => {
                                                resolve(data);
                                            });
                                        };
                                    }
                                    resolve(res);
                                });
                            } else {
                                resolve(res);
                            }
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };
            SOCIALBROWSER.__setConstValue(window.fetch, 'toString', () => s);
        }

        if (false) {
            window.XMLHttpRequest0 = window.XMLHttpRequest;
            let s2 = window.XMLHttpRequest.toString();
            window.XMLHttpRequest = function (...args) {
                let fake = {
                    xhr: new XMLHttpRequest0(...args),
                };

                Object.defineProperty(fake, 'text', {
                    get: function () {
                        return fake.xhr.text;
                    },
                    set: function (value) {
                        fake.xhr.text = value;
                    },
                });

                Object.defineProperty(fake, 'response', {
                    get: function () {
                        return fake._response || fake.xhr.response;
                    },
                    set: function (value) {
                        fake._response = value;
                    },
                });

                Object.defineProperty(fake, 'responseType', {
                    get: function () {
                        return fake._responseType || fake.xhr.responseType;
                    },
                    set: function (value) {
                        fake.xhr.responseType = value;
                    },
                });
                Object.defineProperty(fake, 'responseText', {
                    get: function () {
                        fake._responseText = fake._responseText || fake.xhr.responseText;
                        return fake._responseText;
                    },
                    set: function (value) {
                        fake._responseText = value;
                    },
                });
                Object.defineProperty(fake, 'responseXML', {
                    get: function () {
                        return fake._responseXML || fake.xhr.responseXML;
                    },
                    set: function (value) {
                        fake._responseXML = value;
                    },
                });
                Object.defineProperty(fake, 'responseURL', {
                    get: function () {
                        if (fake.xhr.responseURL.like('browser*')) {
                            return fake.url;
                        } else {
                            return fake.xhr.responseURL;
                        }
                    },
                });

                Object.defineProperty(fake, 'status', {
                    get: function () {
                        return fake._status || fake.xhr.status;
                    },
                    set: function (value) {
                        fake._status = value;
                    },
                });

                Object.defineProperty(fake, 'readyState', {
                    get: function () {
                        return fake._readyState || fake.xhr.readyState;
                    },
                    set: function (value) {
                        fake._readyState = value;
                    },
                });

                Object.defineProperty(fake, 'statusText', {
                    get: function () {
                        return fake._statusText || fake.xhr.statusText;
                    },
                    set: function (value) {
                        fake._statusText = value;
                    },
                });

                Object.defineProperty(fake, 'upload', {
                    get: function () {
                        return fake.xhr.upload;
                    },
                    set: function (value) {
                        fake.xhr.upload = value;
                    },
                });

                Object.defineProperty(fake, 'timeout', {
                    get: function () {
                        return fake.xhr.timeout;
                    },
                    set: function (value) {
                        fake.xhr.timeout = value;
                    },
                });

                Object.defineProperty(fake, 'withCredentials', {
                    get: function () {
                        return fake.xhr.withCredentials;
                    },
                    set: function (value) {
                        fake.xhr.withCredentials = value;
                    },
                });

                fake.open = function (...args) {
                    fake.url = args[1];
                    fake.xhr.open(...args);
                };
                fake.send = function (...args) {
                    //  fake.setRequestHeader('x-server', 'social-browser2');

                    fake.xhr.send(...args);
                };

                fake.xhr.onreadystatechange = function (...args) {
                    if (fake.url.like('*fingerprint.com*') && typeof fake.responseText === 'string') {
                        if (fake.xhr.status === 200 && fake.xhr.readyState == 4) {
                            if (fake.responseText.like('{"products":*')) {
                                let response = JSON.parse(fake.responseText);
                                response.products.botd = response.products.botd;
                                response.products.botd.data = response.products.botd.data;
                                response.products.botd.data.bot = {
                                    result: 'notDetected',
                                };
                                fake._responseText = JSON.stringify(response);
                            }
                        }
                    }
                    setTimeout(() => {
                        if (typeof fake.onreadystatechange == 'function') {
                            fake.onreadystatechange(...args);
                        }
                    }, 100);
                };

                fake.xhr.onload = function (...args) {
                    if (fake.onload) {
                        fake.onload(...args);
                    }
                };
                fake.xhr.onloadstart = function (...args) {
                    if (fake.onloadstart) {
                        fake.onloadstart(...args);
                    }
                };
                fake.xhr.onprogress = function (...args) {
                    if (fake.onprogress) {
                        fake.onprogress(...args);
                    }
                };
                fake.xhr.onabort = function (...args) {
                    if (fake.onabort) {
                        fake.onabort(...args);
                    }
                };
                fake.xhr.onerror = function (...args) {
                    if (fake.onerror) {
                        fake.onerror(...args);
                    }
                };
                fake.xhr.ontimeout = function (...args) {
                    if (fake.ontimeout) {
                        fake.ontimeout(...args);
                    }
                };
                fake.xhr.onloadend = function (...args) {
                    if (fake.onloadend) {
                        fake.onloadend(...args);
                    }
                };

                fake.setRequestHeader = function (...args) {
                    // console.log(...args);
                    fake.xhr.setRequestHeader(...args);
                };

                fake.abort = function (...args) {
                    fake.xhr.abort(...args);
                };
                fake.overrideMimeType = function (...args) {
                    fake.xhr.overrideMimeType(...args);
                };
                fake.getAllResponseHeaders = function (...args) {
                    return fake.xhr.getAllResponseHeaders(...args);
                };
                fake.getResponseHeader = function (...args) {
                    return fake.xhr.getResponseHeader(...args);
                };
                return fake;
            };
            SOCIALBROWSER.__setConstValue(window.XMLHttpRequest, 'toString', () => s2);
        }
    }
}
