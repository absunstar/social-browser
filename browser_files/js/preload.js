var SOCIALBROWSER = {
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

// if(document.location.href.indexOf('blob') === 0){
//     return;
// }

// if (typeof window === 'undefined') {
//     var window = globalThis;
// }

// if (typeof window.document === 'undefined') {
//     window.document = { elementFromPoint: () => undefined, addEventListener: () => {}, querySelector: () => {}, querySelectorAll: () => [], location: { origin: '', hostname: '', href: '' } };
// }

if (typeof navigator !== 'undefined') {
    SOCIALBROWSER.navigatorRaw = {
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        language: navigator.language,
        languages: navigator.languages,
        connection: navigator.connection,
        MaxTouchPoints: navigator.MaxTouchPoints,
    };
}

SOCIALBROWSER.copyObject =
    SOCIALBROWSER.clone =
    SOCIALBROWSER.cloneObject =
        function (obj) {
            return JSON.parse(JSON.stringify(obj));
        };

SOCIALBROWSER.random = SOCIALBROWSER.randomNumber = function (min = 1, max = 1000) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

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

        if (typeof fn === 'function') {
            if (args.length > 0) {
                return fn(...args);
            }
            return fn(SOCIALBROWSER, window, document);
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
    if (typeof code == 'function') {
        code = code.toString();
        code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
    }
    try {
        if (!jsFile && typeof code === 'string' && SOCIALBROWSER.newFunction(code) !== 'ERROR') {
        } else {
            if (SOCIALBROWSER.customSetting.sandbox) {
                SOCIALBROWSER.addJS(code);
            } else {
                jsFile = true;
                let name = SOCIALBROWSER.md5(SOCIALBROWSER.partition + new Date().getTime().toString() + Math.random().toString());
                let path = SOCIALBROWSER.data_dir + '\\sessionData\\' + name + '_tmp.js';

                SOCIALBROWSER.ipcSync('[write-file]', { path: path, data: code });
                let result = SOCIALBROWSER.require(path);
                SOCIALBROWSER.ipcSync('[delete-file]', path);

                return result;
            }
        }
    } catch (error) {
        SOCIALBROWSER.log(error, code);
        if (!jsFile) {
            return SOCIALBROWSER.eval(code, true);
        } else {
            return SOCIALBROWSER.executeScript(code);
        }
    }

    return undefined;
};

SOCIALBROWSER.runUserScript = function (_script) {
    if (SOCIALBROWSER.isIframe()) {
        if (_script.iframe) {
            if (_script.preload) {
                SOCIALBROWSER.eval(_script.js);
            } else {
                SOCIALBROWSER.addCSS(_script.css);
                SOCIALBROWSER.addHTML(_script.html);
                SOCIALBROWSER.addJS(_script.js);
            }
        }
    } else {
        if (_script.window) {
            if (_script.preload) {
                SOCIALBROWSER.eval(_script.js);
            } else {
                SOCIALBROWSER.addCSS(_script.css);
                SOCIALBROWSER.addHTML(_script.html);
                SOCIALBROWSER.addJS(_script.js);
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

SOCIALBROWSER.origin = document.location.origin;
if (!SOCIALBROWSER.origin || SOCIALBROWSER.origin == 'null') {
    SOCIALBROWSER.origin = document.location.hostname;
}
SOCIALBROWSER.hostname = document.location.hostname || document.location.origin;
SOCIALBROWSER.domain = SOCIALBROWSER.hostname.split('.');
SOCIALBROWSER.domain = SOCIALBROWSER.domain.slice(SOCIALBROWSER.domain.length - 2).join('.');
SOCIALBROWSER.href = document.location.href;

SOCIALBROWSER.propertyList =
    'faList,scripts_files,user_data,user_data_input,sites,preload_list,scriptList,privateKeyList,googleExtensionList,ad_list,proxy_list,proxy,core,bookmarks,session_list,userAgentList,blocking,video_quality_list,customHeaderList';
if (SOCIALBROWSER.href.indexOf('http://127.0.0.1:60080') === 0) {
    SOCIALBROWSER.propertyList = '*';
}

SOCIALBROWSER.callSync = SOCIALBROWSER.ipcSync = function (channel, value = {}) {
    try {
        if (typeof value == 'object') {
            if (channel == '[open new popup]' || channel == '[open new tab]') {
                if (typeof value == 'object') {
                    value.referrer = value.referrer || document.location.href;
                    value.parentSetting = SOCIALBROWSER.customSetting;

                    if (value.parentSetting && value.parentSetting.parentSetting) {
                        value.parentSetting.parentSetting = undefined;
                    }
                }
            }
            value = SOCIALBROWSER.cloneObject(value);
        }
        return SOCIALBROWSER.ipcRenderer.sendSync(channel, value);
    } catch (error) {
        SOCIALBROWSER.log(channel, error);
        SOCIALBROWSER.log(value);
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
        value = SOCIALBROWSER.cloneObject(value);
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
    SOCIALBROWSER.userDataDir = SOCIALBROWSER.browserData.userDataDir;
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

    SOCIALBROWSER.id = SOCIALBROWSER.var.core.id;
    SOCIALBROWSER.tempMailServer = SOCIALBROWSER.var.core.emails?.domain || 'social-browser.com';
    SOCIALBROWSER.isWhiteSite = SOCIALBROWSER.var.blocking.white_list.some((site) => site.url.length > 2 && document.location.href.like(site.url));

    if (!SOCIALBROWSER.customSetting.iframe && SOCIALBROWSER.isIframe()) {
        return;
    }

    if (SOCIALBROWSER.customSetting.off) {
        return;
    }

    SOCIALBROWSER.log(` ... ${document.location.href} ... `);

    if (SOCIALBROWSER.customSetting.allowSocialBrowser) {
        if (globalThis) {
            globalThis.SOCIALBROWSER = SOCIALBROWSER;
        } else if (window) {
            window.SOCIALBROWSER = SOCIALBROWSER;
        }
    }

    (function loadEvents() {
        if ((eventLOADED = true)) {
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
        if ((fnLOADED = true)) {
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

            SOCIALBROWSER.sendMessage = SOCIALBROWSER.message = function (message) {
                if (!message) {
                    return false;
                }
                if (typeof message === 'string') {
                    message = { message: message };
                }

                message.windowID = message.windowID || SOCIALBROWSER.window.id;
                SOCIALBROWSER.ipc('message', message);
            };
            SOCIALBROWSER.onMessageFnList = [];
            SOCIALBROWSER.onMessage = function (fn) {
                SOCIALBROWSER.onMessageFnList.push(fn);
            };
            SOCIALBROWSER.on('message', (e, message) => {
                if (typeof message === 'object' && message.eval) {
                    SOCIALBROWSER.eval(message.eval);
                } else {
                    SOCIALBROWSER.onMessageFnList.forEach((fn) => {
                        fn(message);
                    });
                }
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

            SOCIALBROWSER.desktopCapturer = function (options = {}, callback) {
                navigator.mediaDevices
                    .getDisplayMedia({
                        audio: false,
                        video: {
                            width: 1200,
                            height: 800,
                            frameRate: 30,
                        },
                    })
                    .then((stream) => {
                        callback(null, stream, video);
                        if ((video = options.video)) {
                            video.srcObject = stream;
                            video.onloadedmetadata = (e) => video.play();
                        }
                    })
                    .catch((err) => {
                        callback(err);
                    });
            };
            SOCIALBROWSER.addSession = function (session) {
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
                    let oldSession = SOCIALBROWSER.var.session_list.find((s) => s.name == session.name);
                    if (oldSession) {
                        return oldSession;
                    }

                    session.can_delete = true;
                    session.time = session.time || new Date().getTime();
                    if (!session.privacy) {
                        session.privacy = {
                            allowVPC: true,
                            vpc: SOCIALBROWSER.generateVPC(),
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
                options.id = new Date().getTime() + Math.random();
                options.url = SOCIALBROWSER.handleURL(options.url);

                return new Promise((resolve, reject) => {
                    SOCIALBROWSER.ipc('[fetch]', options).then((data) => {
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
                if (document.readyState !== 'loading') {
                    fn();
                } else {
                    document.addEventListener('DOMContentLoaded', () => {
                        fn();
                    });
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
                    SOCIALBROWSER.log(document.location.href, error);
                }
            };

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

            SOCIALBROWSER.timeOffset = new Date().getTimezoneOffset();

            SOCIALBROWSER.guid = function () {
                return SOCIALBROWSER.md5(SOCIALBROWSER.partition + document.location.hostname + SOCIALBROWSER.var.core.id);
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
                SOCIALBROWSER.onLoad(() => {
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
                        }
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }
                });
            };
            SOCIALBROWSER.addJS = SOCIALBROWSER.addjs = function (code) {
                SOCIALBROWSER.onLoad(() => {
                    try {
                        let body = document.body || document.head || document.documentElement;
                        if (body && code) {
                            let _script = document.createElement('script');
                            _script.id = '_script_' + SOCIALBROWSER.md5(code);
                            _script.textContent = SOCIALBROWSER.policy.createScript(code);
                            _script.nonce = 'social';
                            if (!document.querySelector('#' + _script.id)) {
                                body.appendChild(_script);
                                _script.remove();
                            }
                        }
                    } catch (error) {
                        SOCIALBROWSER.log(error, code);
                        SOCIALBROWSER.executeScript(code);
                    }
                });
            };
            SOCIALBROWSER.addJSURL = function (url) {
                SOCIALBROWSER.onLoad(() => {
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
                        }
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }
                });
            };
            SOCIALBROWSER.addCSS = SOCIALBROWSER.addcss = function (code) {
                SOCIALBROWSER.onLoad(() => {
                    try {
                        let body = document.head || document.body || document.documentElement;
                        if (body && code) {
                            code = code.replaceAll('\n', '').replaceAll('\r', '').replaceAll('  ', '');
                            let _style = document.createElement('style');
                            _style.id = '_style_' + SOCIALBROWSER.md5(code);
                            _style.innerText = code;
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
            SOCIALBROWSER.addCSSURL = SOCIALBROWSER.addcss = function (url) {
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
                SOCIALBROWSER.electron.clipboard.writeText(text.toString());
            };
            SOCIALBROWSER.paste = function () {
                SOCIALBROWSER.webContents.paste();
            };
            SOCIALBROWSER.readCopy = function () {
                return SOCIALBROWSER.electron.clipboard.readText();
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

                        let momeryText = SOCIALBROWSER.electron.clipboard.readText() || '';

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
                const element = SOCIALBROWSER.$(selector);
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
            };

            SOCIALBROWSER.$ = function (selector) {
                if (selector instanceof HTMLElement) {
                    return selector;
                }
                if (typeof selector !== 'string') {
                    return null;
                }
                return document.querySelector(selector);
            };
            SOCIALBROWSER.$$ = function (selector) {
                return document.querySelectorAll(selector);
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
                const viewportHeight = window.visualViewport?.height || window.innerHeight;
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
                SOCIALBROWSER.webContents.downloadURL(url);
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

                if (SOCIALBROWSER.var.blocking.white_list?.some((item) => url.like(item.url))) {
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

                return url.protocol === 'http:' || url.protocol === 'https:';
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
                if (u.indexOf('blob') === 0) {
                    u = u;
                } else if (u.indexOf('//') === 0) {
                    u = window.location.protocol + u;
                } else if (u.indexOf('/') === 0) {
                    u = window.location.origin + u;
                } else if (u.like('*://*')) {
                    u = u;
                } else if (u.split('?')[0].split('.').length < 3) {
                    let page = window.location.pathname.split('/').pop();
                    u = window.location.origin + window.location.pathname.replace(page, '') + u;
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
                _customSetting.trackingID = 'tacking_' + new Date().getTime().toString();
                SOCIALBROWSER.windowOpenList[_customSetting.trackingID] = { eventList: [] };
                SOCIALBROWSER.windowOpenList[_customSetting.trackingID].on = function (name, callback) {
                    SOCIALBROWSER.windowOpenList[_customSetting.trackingID].eventList.push({ name: name, callback: callback });
                };
                _customSetting.windowType = _customSetting.windowType || 'social-popup';

                let customSetting = { ...SOCIALBROWSER.customSetting, ..._customSetting };

                SOCIALBROWSER.on('[tracking-info]', (e, data) => {
                    if (data.trackingID == customSetting.trackingID) {
                        if (data.windowID) {
                            SOCIALBROWSER.windowOpenList[customSetting.trackingID].id = data.windowID;
                        }
                        if (data.isClosed) {
                            SOCIALBROWSER.windowOpenList[customSetting.trackingID].isClosed = data.isClosed;
                            SOCIALBROWSER.windowOpenList[customSetting.trackingID].eventList.forEach((e) => {
                                if (e.name == 'close' && e.callback) {
                                    e.callback();
                                }
                                if (e.name == 'closed' && e.callback) {
                                    e.callback();
                                }
                            });
                            SOCIALBROWSER.callEvent('window-closed', SOCIALBROWSER.windowOpenList[customSetting.trackingID]);
                        }
                        if (data.loaded) {
                            SOCIALBROWSER.windowOpenList[customSetting.trackingID].eventList.forEach((e) => {
                                if (e.name == 'load' && e.callback) {
                                    e.callback();
                                }
                            });
                            SOCIALBROWSER.callEvent('window-loaded', SOCIALBROWSER.windowOpenList[customSetting.trackingID]);
                        }
                    }
                });

                SOCIALBROWSER.windowOpenList[customSetting.trackingID].postMessage = function (...args) {
                    SOCIALBROWSER.ipc('window.message', { windowID: SOCIALBROWSER.windowOpenList[customSetting.trackingID].id, data: args[0], origin: args[1] || '*', transfer: args[2] });
                };

                SOCIALBROWSER.windowOpenList[customSetting.trackingID].eval = function (code) {
                    if (!code) {
                        SOCIALBROWSER.log('No Eval Code');
                        return;
                    }
                    if (typeof code === 'function') {
                        code = code.toString();
                        code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
                    }

                    SOCIALBROWSER.sendMessage({
                        windowID: SOCIALBROWSER.windowOpenList[customSetting.trackingID].id,
                        eval: code,
                    });
                };

                SOCIALBROWSER.windowOpenList[customSetting.trackingID].close = function () {
                    SOCIALBROWSER.ipc('[browser-message]', { windowID: SOCIALBROWSER.windowOpenList[customSetting.trackingID].id, name: 'close' });
                };

                SOCIALBROWSER.ipc('[open new popup]', customSetting);
                return SOCIALBROWSER.windowOpenList[customSetting.trackingID];
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
                SOCIALBROWSER.addHTML(Buffer.from(SOCIALBROWSER.injectHTML).toString());
                SOCIALBROWSER.addCSS(Buffer.from(SOCIALBROWSER.injectCSS).toString());
            };

            SOCIALBROWSER.__showWarningImage = function () {
                SOCIALBROWSER.injectDefault();
                let div = document.querySelector('#__warning_img');
                if (div) {
                    div.style.display = 'block';
                }
            };
            SOCIALBROWSER.__showBotImage = function () {
                SOCIALBROWSER.injectDefault();
                let div = document.querySelector('#__bot_img');
                if (div) {
                    div.style.display = 'block';
                }
            };
            SOCIALBROWSER.__blockPage = function (block, msg, close) {
                SOCIALBROWSER.injectDefault();
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

            var showinfoTimeout = null;
            SOCIALBROWSER.showInfo = function (msg, time) {
                clearTimeout(showinfoTimeout);
                SOCIALBROWSER.injectDefault();
                let div = document.querySelector('#__targetUrl');
                if (msg && msg.trim()) {
                    let length = window.innerWidth / 8;
                    if (msg.length > length) {
                        msg = msg.substring(0, length) + '... ';
                    }

                    if (div) {
                        div.style.display = 'block';
                        div.innerHTML = SOCIALBROWSER.policy.createHTML(msg);
                        showinfoTimeout = setTimeout(() => {
                            div.innerHTML = SOCIALBROWSER.policy.createHTML('');
                            div.style.display = 'none';
                        }, time | (1000 * 5));
                    }
                } else {
                    if (div) {
                        div.style.display = 'none';
                    }
                }
            };

            let __downloads = document.querySelector('#__downloads');
            SOCIALBROWSER.showDownloads = function (msg, css) {
                SOCIALBROWSER.injectDefault();
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
                SOCIALBROWSER.injectDefault();
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

            SOCIALBROWSER.windowOpenList = [];

            SOCIALBROWSER.getRandomBrowser = (...params) => SOCIALBROWSER.fn('child.getRandomBrowser', ...params);
            SOCIALBROWSER.getRandomUserAgent = (...params) => SOCIALBROWSER.fn('child.getRandomUserAgent', ...params);
            SOCIALBROWSER.generateVPC = (...params) => SOCIALBROWSER.fn('child.generateVPC', ...params);

            SOCIALBROWSER.executeScript = function (code) {
                if (typeof code == 'function') {
                    code = code.toString();
                    code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
                }
                try {
                    SOCIALBROWSER.fnAsync('webContents.executeJavaScript', [code, true])
                        .then((result) => {
                            SOCIALBROWSER.log(result);
                        })
                        .catch((err) => {
                            SOCIALBROWSER.log(err);
                        });
                } catch (error) {
                    SOCIALBROWSER.log(error);
                }
            };

            let alert_idle = null;
            SOCIALBROWSER.alert =
                window.alert =
                window.confirm =
                    function (msg, time = 1000 * 3) {
                        if (typeof msg !== 'string') {
                            return true;
                        }
                        msg = msg.trim();

                        SOCIALBROWSER.log(msg);
                        SOCIALBROWSER.injectDefault();
                        let div = document.querySelector('#__alertBox');
                        if (div) {
                            clearTimeout(alert_idle);
                            div.innerHTML = SOCIALBROWSER.policy.createHTML(msg);
                            div.style.display = 'block';
                            alert_idle = setTimeout(() => {
                                div.style.display = 'none';
                                div.innerHTML = SOCIALBROWSER.policy.createHTML('');
                            }, time);
                        }

                        return true;
                    };

            window.prompt = function (ask = '', answer = '') {
                SOCIALBROWSER.log(ask, answer);
                return answer;
            };
        }

        SOCIALBROWSER.getLocalStorageList = function () {
            let arr = [];
            try {
                (keys = Object.keys(localStorage)), (i = keys.length);

                while (i--) {
                    arr.push({ key: keys[i], value: localStorage.getItem(keys[i]) });
                }
            } catch (error) {
                SOCIALBROWSER.log(error);
            }

            return arr;
        };
        SOCIALBROWSER.getSessionStorageList = function () {
            let arr = [];
            try {
                (keys = Object.keys(sessionStorage)), (i = keys.length);

                while (i--) {
                    arr.push({ key: keys[i], value: sessionStorage.getItem(keys[i]) });
                }
            } catch (error) {
                SOCIALBROWSER.log(error);
            }

            return arr;
        };

        SOCIALBROWSER.getHttpCookie = function (obj = {}) {
            obj.domain = obj.domain || document.location.hostname;
            obj.partition = SOCIALBROWSER.partition;
            return SOCIALBROWSER.ipcSync('[get-http-cookies]', obj).cookie;
        };
        SOCIALBROWSER.setHttpCookie = function (obj = { cookie: '', off: true }) {
            obj.domain = obj.domain || document.location.hostname;
            obj.partition = obj.partition || SOCIALBROWSER.partition;
            obj.mode = obj.mode || 0;
            return SOCIALBROWSER.ipcSync('[set-http-cookies]', obj);
        };
        SOCIALBROWSER.getDomainCookies = function (obj = {}) {
            obj.cookieDomain = obj.cookieDomain || SOCIALBROWSER.domain;
            obj.partition = obj.partition || SOCIALBROWSER.partition;
            obj.url = obj.url || document.location.href;
            return SOCIALBROWSER.ipcSync('[get-domain-cookies]', obj);
        };
        SOCIALBROWSER.setDomainCookies = function (obj = {}) {
            obj.partition = obj.partition || SOCIALBROWSER.partition;
            obj.cookies = obj.cookies || [];
            return SOCIALBROWSER.ipcSync('[set-domain-cookies]', obj);
        };

        SOCIALBROWSER.getSessionCookies = function (obj = {}) {
            obj.partition = SOCIALBROWSER.partition;
            return SOCIALBROWSER.ipcSync('[get-session-cookies]', obj);
        };
        SOCIALBROWSER.setSessionCookies = function (obj = {}) {
            obj.partition = SOCIALBROWSER.partition;
            obj.cookies = obj.cookies || [];
            return SOCIALBROWSER.ipcSync('[set-session-cookies]', obj);
        };

        SOCIALBROWSER.getSiteData = function (obj = {}) {
            obj.domain = obj.domain || document.location.hostname;
            obj.session = {
                name: SOCIALBROWSER.session.display,
                display: SOCIALBROWSER.session.display,
                defaultUserAgent: SOCIALBROWSER.session.defaultUserAgent,
                privacy: SOCIALBROWSER.session.privacy,
            };
            obj.url = obj.url || document.location.href;
            obj.cookie = obj.cookie || SOCIALBROWSER.getHttpCookie();
            obj.cookies = obj.cookies || SOCIALBROWSER.getDomainCookies(obj).cookies;
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
                    SOCIALBROWSER.window.customSetting.localStorageList = data.localStorageList;
                    SOCIALBROWSER.window.customSetting.sessionStorageList = data.sessionStorageList;
                    SOCIALBROWSER.setDomainCookies({ cookies: data.cookies });
                    SOCIALBROWSER.window.storaeAdded = false;
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
            obj.domain = obj.domain || document.location.hostname;
            obj.partition = SOCIALBROWSER.partition;
            obj.url = obj.url || document.location.href;

            if (obj.auto) {
                obj.cookie = obj.cookie || SOCIALBROWSER.getHttpCookie();
                obj.cookies = SOCIALBROWSER.getSessionCookies().cookies;
                obj.localStorageList = SOCIALBROWSER.getLocalStorageList();
                obj.sessionStorageList = SOCIALBROWSER.getSessionStorageList();
                obj.userDataDir = obj.userDataDir || SOCIALBROWSER.userDataDir + '/chrome';
                obj.navigator = SOCIALBROWSER.clone(SOCIALBROWSER.navigator);
                obj.customSetting = SOCIALBROWSER.customSetting;
            }
            console.log(obj);
            return SOCIALBROWSER.ipcSync('[open-in-chrome]', obj);
        };

        SOCIALBROWSER.cookiesRaw = '';
        SOCIALBROWSER.clearCookies = function () {
            SOCIALBROWSER.ipcSync('[cookies-clear]', { domain: document.location.hostname, partition: SOCIALBROWSER.partition });
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
                domain: document.location.hostname,
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
                domain: document.location.hostname,
                path: document.location.pathname,
                protocol: document.location.protocol,
            });
            SOCIALBROWSER.cookiesRaw = SOCIALBROWSER.getCookieRaw();
        };

        if (!SOCIALBROWSER.var.blocking.javascript.allowConsoleLogs) {
            window.console.log = function () {};
            window.console.error = function () {};
            window.console.dir = function () {};
            window.console.dirxml = function () {};
            window.console.info = function () {};
            window.console.warn = function () {};
            window.console.table = function () {};
            window.console.trace = function () {};
            window.console.debug = function () {};
            window.console.assert = function () {};
            window.console.clear = function () {};
        }

        if (SOCIALBROWSER.var.blocking.javascript.block_console_clear) {
            window.console.clear = function () {};
        }

        SOCIALBROWSER.on('window.message', (e, message) => {
            message.origin = message.origin || '*';
            window.postMessage(message.data, message.origin, message.transfer);
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
                if (!Reflect.has(target, name)) {
                    return SOCIALBROWSER.get('window.' + name);
                }
                return Reflect.get(target, name, receiver);
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

        if (!SOCIALBROWSER.electron.clipboard) {
            SOCIALBROWSER._clipboard = SOCIALBROWSER.ipcSync('[clipboard]');
            SOCIALBROWSER._clipboard.fnList.forEach((fn) => {
                SOCIALBROWSER._clipboard[fn] = (...params) => SOCIALBROWSER.fn('clipboard.' + fn, ...params);
            });

            SOCIALBROWSER.clipboard = new Proxy(SOCIALBROWSER._clipboard, {
                get(target, name, receiver) {
                    if (!Reflect.has(target, name)) {
                        return SOCIALBROWSER.get('clipboard.' + name);
                    }
                    return Reflect.get(target, name, receiver);
                },
                set(target, name, value, receiver) {
                    if (!Reflect.has(target, name)) {
                        return SOCIALBROWSER.set('clipboard.' + name, value);
                    }
                    return Reflect.set(target, name, value, receiver);
                },
            });
            SOCIALBROWSER.electron.clipboard = SOCIALBROWSER.clipboard;
        }

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
            SOCIALBROWSER.session.privacy.vpc = SOCIALBROWSER.getStorage('vpc') || SOCIALBROWSER.generateVPC();
            SOCIALBROWSER.setStorage('vpc', SOCIALBROWSER.session.privacy.vpc);
        }

        if (!SOCIALBROWSER.customSetting.$cloudFlare && !SOCIALBROWSER.isWhiteSite) {
            // SOCIALBROWSER.log('edit eval : ' + document.location.href);
            // window.eval0 = window.eval;
            // window.eval = function (...code) {
            //     try {
            //         return window.eval0.apply(this, code);
            //     } catch (error) {
            //         SOCIALBROWSER.log(document.location.href, error, code);
            //         return undefined;
            //     }
            // }.bind(window.eval);

            if (SOCIALBROWSER.var.blocking.javascript.block_eval) {
                window.eval = function () {
                    SOCIALBROWSER.log('eval block', code);
                    return undefined;
                };
            }
        }
    })();

    SOCIALBROWSER.customSetting.javaScriptOFF =
        SOCIALBROWSER.customSetting.javaScriptOFF || SOCIALBROWSER.var.blocking.vip_site_list.some((site) => site.url.length > 2 && SOCIALBROWSER.window.getURL().like(site.url));

    (function loadCloudflare() {
        if (document.location.href.like('*://challenges.cloudflare.com/*')) {
            SOCIALBROWSER.customSetting.$cloudFlare = true;
            if (SOCIALBROWSER.var.blocking.javascript.cloudflareON) {
                if (document.location.href.like('*://challenges.cloudflare.com/*')) {
                    SOCIALBROWSER.sendMessage('[cloudflare-detected]');

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
                                        SOCIALBROWSER.log(element);
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

    (function loadMenu() {
        if ((menuLOADED = true)) {
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
                                                node.value = '';
                                                node.innerHTML = SOCIALBROWSER.policy.createHTML('');
                                                SOCIALBROWSER.copy(d.value);
                                                SOCIALBROWSER.paste();
                                            },
                                        });

                                        arr2.push({
                                            label: d.value,
                                            click() {
                                                node.value = d.value;
                                                node.innerHTML = SOCIALBROWSER.policy.createHTML(d.value);
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
                                                node.value = '';
                                                node.innerHTML = SOCIALBROWSER.policy.createHTML('');
                                                SOCIALBROWSER.copy(d.value);
                                                SOCIALBROWSER.paste();
                                            },
                                        });

                                        arr2.push({
                                            label: d.value,
                                            click() {
                                                node.value = d.value;
                                                node.innerHTML = SOCIALBROWSER.policy.createHTML(d.value);
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
                                                node.value = '';
                                                node.innerHTML = SOCIALBROWSER.policy.createHTML('');
                                                SOCIALBROWSER.copy(d.value);
                                                SOCIALBROWSER.paste();
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
                                            node.value = '';
                                            node.innerHTML = SOCIALBROWSER.policy.createHTML('');
                                            SOCIALBROWSER.copy(d.value);
                                            SOCIALBROWSER.paste();
                                        },
                                    });

                                    arr2.push({
                                        label: d.value,
                                        click() {
                                            node.value = d.value;
                                            node.innerHTML = SOCIALBROWSER.policy.createHTML(d.value);
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
                                        },
                                    });
                                } else if (node.name && node.name == d.name) {
                                    arr1.push({
                                        label: d.value,
                                        click() {
                                            node.value = '';
                                            node.innerHTML = SOCIALBROWSER.policy.createHTML('');
                                            SOCIALBROWSER.copy(d.value);
                                            SOCIALBROWSER.paste();
                                        },
                                    });

                                    arr2.push({
                                        label: d.value,
                                        click() {
                                            node.value = d.value;
                                            node.innerHTML = SOCIALBROWSER.policy.createHTML(d.value);

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
                                        },
                                    });
                                } else {
                                    arr1.push({
                                        label: d.value,
                                        click() {
                                            node.value = '';
                                            node.innerHTML = SOCIALBROWSER.policy.createHTML('');
                                            SOCIALBROWSER.copy(d.value);
                                            SOCIALBROWSER.paste();
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

                    getEmailMenu();
                    get2faMenu();
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
                            center: true,
                        });
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
                    label: ' in ( Vip Window )',
                    click() {
                        SOCIALBROWSER.ipc('[open new popup]', {
                            partition: SOCIALBROWSER.partition,
                            url: url,
                            referrer: document.location.href,
                            allowAds: true,
                            javaScriptOFF: true,
                            enginOFF: true,
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
                            vpc: SOCIALBROWSER.generateVPC(),
                            show: true,
                            iframe: true,
                            iframe: true,
                            center: true,
                            alwaysOnTop: true,
                        });
                    },
                });

                if (SOCIALBROWSER.var.session_list.length > 1) {
                    arr.push({
                        type: 'separator',
                    });

                    SOCIALBROWSER.var.session_list.forEach((ss, i) => {
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

                    return arr;
                }
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

                    if (u.like('*youtube.com/watch*')) {
                        SOCIALBROWSER.menuList.push({
                            label: 'Open video ',
                            click() {
                                SOCIALBROWSER.ipc('[open new popup]', {
                                    windowType: 'youtube',
                                    alwaysOnTop: true,
                                    url: 'https://www.youtube.com/embed/' + u.split('=')[1].split('&')[0],
                                    partition: SOCIALBROWSER.partition,
                                    referrer: document.location.href,
                                    show: true,
                                });
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Download video ',
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
                    click() {
                        SOCIALBROWSER.copy(SOCIALBROWSER.session.display);
                    },
                });
                arr.push({
                    label: 'Copy Profile ID',
                    click() {
                        SOCIALBROWSER.copy(SOCIALBROWSER.session.name);
                    },
                });
                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: 'Copy ALL Site Data as [ Encripted Text ] to Clipboard',
                    click() {
                        SOCIALBROWSER.copy(SOCIALBROWSER.hideObject(SOCIALBROWSER.getSiteData()));
                        alert('Site Data Text Copied !!');
                    },
                });
                arr.push({
                    label: 'Copy ALL Site Data as [ online Code ] to Clipboard',
                    click() {
                        let code = SOCIALBROWSER.hideObject(SOCIALBROWSER.getSiteData());
                        SOCIALBROWSER.fetchJson({
                            method: 'POST',
                            url: 'https://social-browser.com/api/siteData',
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
                    type: 'separator',
                });
                arr.push({
                    label: 'Import Site Data from Clipboard ( in current profile )',
                    click() {
                        let txt = SOCIALBROWSER.clipboard.readText();
                        SOCIALBROWSER.importSiteData(txt, 0);
                    },
                });
                arr.push({
                    label: 'Import Site Data from Clipboard ( in Real profile )',
                    click() {
                        let txt = SOCIALBROWSER.clipboard.readText();
                        SOCIALBROWSER.importSiteData(txt, 1);
                    },
                });
                arr.push({
                    label: 'Import Site Data from Clipboard ( in Ghost profile )',
                    click() {
                        let txt = SOCIALBROWSER.clipboard.readText();
                        SOCIALBROWSER.importSiteData(txt, 2);
                    },
                });
                arr.push({
                    type: 'separator',
                });

                arr.push({
                    label: 'Copy Site Cookies as [ JSON Text ] to Clipboard',
                    click() {
                        SOCIALBROWSER.copy(SOCIALBROWSER.toJson(SOCIALBROWSER.getDomainCookies().cookies));
                        alert('Site Cookies JSON Text Copied !!');
                    },
                });
                arr.push({
                    label: 'Import Site Cookies from [ JSON Text ] from Clipboard',
                    click() {
                        SOCIALBROWSER.setDomainCookies({ cookies: SOCIALBROWSER.fromJson(SOCIALBROWSER.clipboard.readText()) });
                        alert('Site Cookies Imported !!');
                        document.location.reload();
                    },
                });
                arr.push({
                    type: 'separator',
                });
                arr.push({
                    label: 'Copy Site HTTP Cookies as [ Text ] to Clipboard',
                    click() {
                        SOCIALBROWSER.copy(SOCIALBROWSER.getHttpCookie());
                        alert('Site HTTP Cookies Text Copied !!');
                    },
                });
                arr.push({
                    label: 'Set Site HTTP Cookies from [ Text ] from Clipboard',
                    click() {
                        SOCIALBROWSER.setHttpCookie({ cookie: SOCIALBROWSER.clipboard.readText(), mode: 0 });
                        alert('Site HTTP Cookies Set !!');
                        document.location.reload();
                    },
                });
                arr.push({
                    label: 'Remove Site HTTP Cookies',
                    click() {
                        SOCIALBROWSER.setHttpCookie({ cookie: '', off: true });
                        alert('Site HTTP Cookies Removed !!');
                        document.location.reload();
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
                        SOCIALBROWSER.webContents.downloadURL(document.location.href);
                    },
                });

                arr.push({
                    label: 'Save page as PDF',
                    click() {
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
                                vpc: SOCIALBROWSER.generateVPC(),
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

                if (document.location.href.like('*youtube.com/watch*v=*')) {
                    SOCIALBROWSER.menuList.push({
                        label: 'Open current video',
                        click() {
                            SOCIALBROWSER.ipc('[open new popup]', {
                                windowType: 'youtube',
                                url: 'https://www.youtube.com/embed/' + document.location.href.split('=')[1].split('&')[0],
                                partition: SOCIALBROWSER.partition,
                                referrer: document.location.href,
                                show: true,
                                alwaysOnTop: true,
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
                            label: 'paste Current Email',
                            click() {
                                SOCIALBROWSER.copy(SOCIALBROWSER.session.display);
                                SOCIALBROWSER.paste();
                            },
                        });
                        let currentLogin = SOCIALBROWSER.var.user_data_input.filter((d) => d.username == SOCIALBROWSER.session.display)[0];
                        if (currentLogin && currentLogin.password) {
                            arr.push({
                                label: 'paste Current Password',
                                click() {
                                    SOCIALBROWSER.copy(currentLogin.password);
                                    SOCIALBROWSER.paste();
                                },
                            });
                        }
                        if (SOCIALBROWSER.session.display.contains('@gmail.com')) {
                            arr.push({
                                label: 'Open Gmail Inbox',
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
                                    label: 'paste Temp Mail',
                                    click() {
                                        SOCIALBROWSER.copy(newEmail);
                                        SOCIALBROWSER.paste();
                                    },
                                });
                            }

                            arr.push({
                                label: 'paste Code from Temp Mail Message',
                                click() {
                                    let _url = 'http://emails.' + SOCIALBROWSER.var.core.emails.domain + '/api/emails/view';
                                    SOCIALBROWSER.fetchJson(
                                        {
                                            url: _url,
                                            method: 'POST',
                                            body: { to: newEmail },
                                        },
                                        (data) => {
                                            SOCIALBROWSER.log(data);
                                            if (data.done && data.doc) {
                                                var codeRex = /(?:[-+() ]*\d){5,10}/gm;

                                                let email = data.doc;
                                                let code = email.subject?.match(codeRex) || email.html?.match(codeRex);
                                                if (code) {
                                                    code = code[0];
                                                    SOCIALBROWSER.copy(code);
                                                    SOCIALBROWSER.paste();
                                                    return true;
                                                } else {
                                                    alert('No Code Exists ..');
                                                }
                                            }
                                        },
                                    );
                                },
                            });

                            arr.push({
                                type: 'separator',
                            });
                            arr.push({
                                label: 'Show All Temp Mail Messages',
                                click() {
                                    SOCIALBROWSER.ipc('[open new popup]', {
                                        partition: SOCIALBROWSER.partition,
                                        referrer: document.location.href,
                                        url: 'http://emails.' + SOCIALBROWSER.var.core.emails.domain + '/vip?email=' + newEmail,
                                        show: true,
                                        allowDevTools: false,
                                        allowNewWindows: true,
                                        allowPopup: true,
                                        center: true,
                                        vip: true,
                                    });
                                },
                            });
                            arr.push({
                                type: 'separator',
                            });
                        }
                    }

                    if (SOCIALBROWSER.var.core.emails.password) {
                        arr.push({
                            label: 'paste Default Password',
                            click() {
                                SOCIALBROWSER.copy(SOCIALBROWSER.var.core.emails.password);
                                SOCIALBROWSER.paste();
                            },
                        });
                    }
                    if (SOCIALBROWSER.var.core.emails.password2) {
                        arr.push({
                            label: 'paste Default Password 2',
                            click() {
                                SOCIALBROWSER.copy(SOCIALBROWSER.var.core.emails.password2);
                                SOCIALBROWSER.paste();
                            },
                        });
                    }
                    if (SOCIALBROWSER.var.core.emails.password3) {
                        arr.push({
                            label: 'paste Default Password 3',
                            click() {
                                SOCIALBROWSER.copy(SOCIALBROWSER.var.core.emails.password3);
                                SOCIALBROWSER.paste();
                            },
                        });
                    }
                    if (arr.length > 0) {
                        SOCIALBROWSER.menuList.push({
                            label: 'Emails',
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

                SOCIALBROWSER.var.session_list.forEach((s, i) => {
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

                    if (SOCIALBROWSER.var.blocking.open_list?.length > 0) {
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

                        SOCIALBROWSER.var.proxy_list.slice(0, 50).forEach((p) => {
                            if (!p) {
                                return;
                            }
                            arr.push({
                                label: p.name || p.url,
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
                                label: 'Open current page with proxy + ghost user',
                                type: 'submenu',
                                submenu: arr,
                            });
                        }
                    }

                    if (SOCIALBROWSER.var.blocking.context_menu.page_options) {
                        get_options_menu(node);
                    }

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
                                socialTabs.layoutTabs();
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
                                socialTabs.layoutTabs();
                            },
                        });
                        SOCIALBROWSER.menuList.push({
                            label: 'Show hidden tabs',
                            click() {
                                document.querySelectorAll('.social-tab').forEach((t) => {
                                    t.classList.remove('display-none');
                                });
                                socialTabs.layoutTabs();
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
                                    vpc: SOCIALBROWSER.generateVPC(),
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

            SOCIALBROWSER.contextmenu = function (e) {
                try {
                    SOCIALBROWSER.window.show();

                    e = e || { x: 0, y: 0 };
                    SOCIALBROWSER.memoryText = () => SOCIALBROWSER.readCopy();
                    SOCIALBROWSER.selectedText = () => (getSelection() || '').toString().trim();
                    SOCIALBROWSER.selectedURL = null;

                    SOCIALBROWSER.menuList = [];

                    let factor = SOCIALBROWSER.webContents.zoomFactor || 1;

                    SOCIALBROWSER.rightClickPosition = {
                        x: Math.round(e.x / factor),
                        y: Math.round(e.y / factor),
                        x2: Math.round(e.x),
                        y2: Math.round(e.y),
                    };

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

                        getEmailMenu();

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
                                            SOCIALBROWSER.decryptedText = SOCIALBROWSER.decryptText(SOCIALBROWSER.selectedText().replace('_SITE_', '').replace('_', ''), document.location.hostname);
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
                                                SOCIALBROWSER.ipc('[update-browser-var]', {
                                                    name: 'privateKeyList',
                                                    data: SOCIALBROWSER.var.privateKeyList,
                                                });
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
                                        SOCIALBROWSER.encryptedText = SOCIALBROWSER.encryptText(SOCIALBROWSER.selectedText(), document.location.hostname);
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

                    if (SOCIALBROWSER.menuList.length > 0) {
                        let scriptList = SOCIALBROWSER.var.scriptList.filter(
                            (s) => s.show && !document.location.href.like('*127.0.0.1:60080*|*file://*') && document.location.href.like(s.allowURLs) && !document.location.href.like(s.blockURLs),
                        );
                        if (scriptList.length > 0) {
                            let arr = [];
                            scriptList.forEach((script) => {
                                arr.push({
                                    label: script.title,
                                    iconURL: 'http://127.0.0.1:60080/images/code.png',
                                    click: () => {
                                        SOCIALBROWSER.ipc('[run-user-script]', { windowID: SOCIALBROWSER.window.id, script: script });
                                    },
                                });
                            });
                            SOCIALBROWSER.menuList.push({ type: 'separator' });
                            SOCIALBROWSER.menuList.push({
                                label: 'User Scripts',
                                iconURL: 'http://127.0.0.1:60080/images/code.png',
                                type: 'submenu',
                                submenu: arr,
                            });
                        }
                        SOCIALBROWSER.ipc('[show-menu]', {
                            list: SOCIALBROWSER.menuList.map((m) => ({
                                label: m.label,
                                sublabel: m.sublabel,
                                visible: m.visible,
                                type: m.type,
                                iconURL: m.iconURL,
                                submenu: m.submenu?.map((m2) => ({
                                    label: m2.label,
                                    type: m2.type,
                                    sublabel: m2.sublabel,
                                    visible: m2.visible,
                                    iconURL: m2.iconURL,
                                    submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL })),
                                })),
                            })),
                        });
                    }
                } catch (error) {
                    SOCIALBROWSER.log(error);
                }
            };

            if (SOCIALBROWSER.isIframe()) {
                window.addEventListener('contextmenu', (e) => {
                    if (SOCIALBROWSER.customSetting.allowMenu) {
                        e.preventDefault();
                        SOCIALBROWSER.contextmenu(e);
                    }
                });
            } else {
                SOCIALBROWSER.on('context-menu', (e, data) => {
                    SOCIALBROWSER.contextmenu(data);
                });
            }

            SOCIALBROWSER.on('[run-menu]', (e, data) => {
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
            });

            window.addEventListener('dblclick', (event) => {
                if (
                    SOCIALBROWSER.var.blocking.javascript.auto_remove_html &&
                    SOCIALBROWSER.customSetting.windowType !== 'main' &&
                    !event.target.tagName.contains('body|input|video|embed|progress') &&
                    !event.target.className.contains('progress')
                ) {
                    event.target.remove();
                }
            });
        }
    })();

    (function loadKeyboard() {
        if ((keyboardLOADED = true)) {
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
        if ((domsLOADED = true)) {
            if (
                SOCIALBROWSER.customSetting.javaScriptOFF ||
                SOCIALBROWSER.var.core.javaScriptOFF ||
                SOCIALBROWSER.customSetting.windowType === 'main' ||
                document.location.href.like('*http://127.0.0.1*')
            ) {
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
        if ((nodesLOADED = true)) {
            if (SOCIALBROWSER.customSetting.javaScriptOFF || SOCIALBROWSER.var.core.javaScriptOFF) {
                return false;
            }
            SOCIALBROWSER.log('.... [ HTML Elements Script Activated ].... ' + document.location.href);

            SOCIALBROWSER.onLoad(() => {
                document.addEventListener('dblclick', () => {
                    if (SOCIALBROWSER.var.blocking.javascript.auto_paste) {
                        SOCIALBROWSER.paste();
                    }
                });

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
                hostname: document.location.hostname,
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
                if (input.getAttribute('x-handled') == 'true' || input.getAttribute('type')?.like('*checkbox*|*radio*|*button*|*submit*|*hidden*')) {
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
                    } else if (SOCIALBROWSER.var.blocking.core.remove_external_iframe && !iframe.src.like(document.location.protocol + '//' + document.location.hostname + '*')) {
                        SOCIALBROWSER.log('[[ Remove ]]', iframe);
                        iframe.remove();
                    } else if (iframe.tagName == 'IFRAME') {
                    }
                }
            }

            document.addEventListener('dblclick', (e) => {
                if (e.target.tagName == 'A' && e.target.href) {
                    if (e.target.getAttribute('force-click') == 'yes') {
                        SOCIALBROWSER.ipc('[open new tab]', {
                            url: e.target.href,
                            referrer: document.location.href,
                            partition: SOCIALBROWSER.partition,
                            user_name: SOCIALBROWSER.session.display,
                            windowID: SOCIALBROWSER.window.id,
                        });
                    } else {
                        e.target.setAttribute('force-click', 'yes');
                    }
                }
            });
        }
    })();

    (function loadSafty() {
        if ((saftyLOADED = true)) {
            if (
                SOCIALBROWSER.customSetting.javaScriptOFF ||
                SOCIALBROWSER.var.core.javaScriptOFF ||
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

                window.__blockPage(block, 'Block Page [ Contains Unsafe Words ] , <small> <a target="_blank" href="http://127.0.0.1:60080/setting?open=safty"> goto setting </a></small>', false);

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
        if ((adsManagerLOADED = true)) {
            if (
                SOCIALBROWSER.isWhiteSite ||
                SOCIALBROWSER.customSetting.javaScriptOFF ||
                SOCIALBROWSER.var.core.javaScriptOFF ||
                !SOCIALBROWSER.var.blocking.block_ads ||
                SOCIALBROWSER.customSetting.windowType === 'main' ||
                document.location.hostname.contains('localhost|127.0.0.1|browser')
            ) {
                SOCIALBROWSER.log('.... [ Ads Manager OFF ] .... ' + document.location.href);
                return;
            }
            SOCIALBROWSER.log('.... [ Ads Manager Activated ] .... ' + document.location.href);

            function changeAdsVAR() {
                SOCIALBROWSER.navigator.webdriver = undefined;
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
        SOCIALBROWSER.log('.... [ Skip Video Ads activated ] .... ' + document.location.href);
        let skip_buttons = '.skip_button,#skip_button_bravoplayer,.videoad-skip,.skippable,.xplayer-ads-block__skip,.ytp-ad-skip-button,.ytp-ad-overlay-close-container';
        let adsProgressSelector = '.ad-interrupting .ytp-play-progress.ytp-swatch-background-color';

        function skipVideoAds() {
            let videos = document.querySelectorAll('video');
            if (videos.length > 0) {
                document.querySelectorAll(skip_buttons).forEach((b) => {
                    SOCIALBROWSER.click(b, false, false, false);
                    alert('<b>Ads Video Detected</b><small><i> Skip Button </i></small>', 2000);
                });
            }
            setTimeout(() => {
                skipVideoAds();
            }, 1000 * 1);
        }

        function skipYoutubeAds() {
            let videos = document.querySelectorAll('video');
            if (videos.length > 0) {
                document.querySelectorAll(skip_buttons).forEach((b) => {
                    b.click();
                    alert('<b>Ads Video Detected</b><small><i> Skip Button </i></small>', 2000);
                });

                if (document.querySelector(adsProgressSelector)) {
                    videos.forEach((v) => {
                        if (v && !v.ended && v.readyState > 2) {
                            v.currentTime = parseFloat(v.duration);
                            alert('Ads Video Detected', 2000);
                        }
                    });
                }
            }
            setTimeout(() => {
                skipYoutubeAds();
            }, 1000 * 1);
        }

        SOCIALBROWSER.onLoad(() => {
            if (SOCIALBROWSER.var.blocking.core.skip_video_ads) {
                if (document.location.hostname.like('*youtube.com*')) {
                    skipYoutubeAds();
                } else {
                    skipVideoAds();
                }
            }
        });
    })();

    (function loadMainMoudles() {
        if (!SOCIALBROWSER.customSetting.$cloudFlare && !SOCIALBROWSER.isWhiteSite && !SOCIALBROWSER.customSetting.javaScriptOFF) {
            (function loadWindow() {
                window.open0 = window.open;
                if (!SOCIALBROWSER.isWhiteSite) {
                    window.open = function (...args /*url, target, windowFeatures*/) {
                        let url = args[0];
                        SOCIALBROWSER.log('window.open', url);
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

                        let child_window = {
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
                                this.closed = true;
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
                            self: this,
                        };

                        if (!url || url.like('javascript:*|about:*|*accounts.*|*login*') || SOCIALBROWSER.customSetting.allowCorePopup) {
                            let opener = window.open0(...args);
                            return opener || child_window;
                        }

                        url = SOCIALBROWSER.handleURL(url);
                        child_window.url = url;

                        let allow = false;

                        if (SOCIALBROWSER.allowPopup || SOCIALBROWSER.customSetting.allowPopup) {
                            allow = true;
                        } else {
                            if (SOCIALBROWSER.customSetting.blockPopup || !SOCIALBROWSER.customSetting.allowNewWindows) {
                                SOCIALBROWSER.log('block Popup : ' + url);
                                return child_window;
                            }

                            if (SOCIALBROWSER.customSetting.allowSelfWindow) {
                                document.location.href = url;
                                return child_window;
                            }

                            if (!SOCIALBROWSER.var.core.javaScriptOFF && !SOCIALBROWSER.customSetting.javaScriptOFF) {
                                if (!SOCIALBROWSER.isAllowURL(url)) {
                                    SOCIALBROWSER.log('Not Allow URL : ' + url);
                                    return child_window;
                                }

                                allow = !SOCIALBROWSER.var.blocking.popup.black_list.some((d) => url.like(d.url));

                                if (!allow) {
                                    SOCIALBROWSER.log('black list : ' + url);
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
                                        allow = SOCIALBROWSER.var.blocking.popup.white_list.some((d) => toUrlParser.host.like(d.url) || fromUrlParser.host.like(d.url));
                                    }
                                }
                            }

                            if (!allow) {
                                SOCIALBROWSER.log('Not Allow popup window : ' + url);
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

                        child_window.postMessage = function (...args) {
                            win.postMessage(...args);
                        };

                        child_window.addEventListener = win.on;

                        win.on('closed', (e) => {
                            child_window.postMessage = () => {};
                            child_window.eval = () => {};
                            child_window.closed = true;
                        });

                        child_window.eval = win.eval;

                        child_window.close = win.close;

                        child_window.win = win;

                        return child_window;
                    };
                }

                SOCIALBROWSER.Worker = window.Worker;
                window.Worker = function (url, options, _worker) {
                    url = SOCIALBROWSER.handleURL(url.toString());

                    SOCIALBROWSER.log('New Worker : ' + url);

                    if (url.indexOf('blob:') === 0) {
                        return new SOCIALBROWSER.Worker(url, options, _worker);
                    }

                    let workerID = 'worker_' + SOCIALBROWSER.md5(url) + '_';

                    fetch(url)
                        .then((response) => response.text())
                        .then((code) => {
                            let _id = _worker ? _worker.id : workerID;
                            _id = 'globalThis.' + _id;
                            code = code.replaceAll('window.location', 'location');
                            code = code.replaceAll('document.location', 'location');
                            code = code.replaceAll('self.trustedTypes', _id + '.trustedTypes');
                            code = code.replaceAll('self', _id + '');
                            code = code.replaceAll('location', _id + '.location');
                            // if (!_worker) {
                            //     code = code.replaceAll('this', _id);
                            // }
                            code = code.replaceAll(_id + '.' + _id, _id);

                            SOCIALBROWSER.addJS('(()=>{ try { ' + code + ' } catch (err) {console.log(err)} })();');
                        });

                    if (_worker) {
                        return _worker;
                    } else {
                        globalThis[workerID] = {
                            id: workerID,
                            url: url,
                            addEventListener: function () {},
                            importScripts: function (...args2) {
                                args2.forEach((arg) => {
                                    SOCIALBROWSER.log('Import Script : ' + arg);
                                    new Worker(arg, null, globalThis[workerID]);
                                });
                            },
                            terminate: function () {},
                            postMessage: function (data) {
                                globalThis[workerID].onmessage({ data: data });
                            },
                            onmessage: function () {},
                        };

                        if (SOCIALBROWSER.var.blocking.javascript.block_window_worker) {
                            return globalThis[workerID];
                        }
                        let loc = new URL(globalThis[workerID].url);
                        globalThis[workerID].location = loc;
                        SOCIALBROWSER.__define(globalThis[workerID], 'location', {
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
                        SOCIALBROWSER.__define(globalThis[workerID], 'window', {});
                        SOCIALBROWSER.__define(globalThis[workerID], 'document', {});
                        SOCIALBROWSER.__define(globalThis[workerID], 'trustedTypes', window.trustedTypes);

                        globalThis.importScripts = globalThis[workerID].importScripts;
                        return globalThis[workerID];
                    }
                };

                SOCIALBROWSER.__define(window.Worker, 'toString', function () {
                    return 'Worker() { [native code] }';
                });
                try {
                    if (SOCIALBROWSER.var.blocking.javascript.block_window_shared_worker) {
                        window.SharedWorker = function (...args) {
                            return {
                                onmessage: () => {},
                                onerror: () => {},
                                postMessage: () => {},
                            };
                        };
                    }

                    SOCIALBROWSER.serviceWorker = {
                        register: navigator.serviceWorker ? navigator.serviceWorker.register : {},
                    };

                    if (navigator.serviceWorker) {
                        navigator.serviceWorker.register = function (...args) {
                            SOCIALBROWSER.log('New service Worker : ' + args[0]);

                            return new Promise((resolve, reject) => {
                                if (!SOCIALBROWSER.var.blocking.javascript.block_navigator_service_worker) {
                                    let worker = new window.Worker(...args);
                                    resolve(worker);
                                }
                            });
                        };
                    }

                    if (SOCIALBROWSER.var.blocking.javascript.block_navigator_service_worker && navigator.serviceWorker) {
                        navigator.serviceWorker.register = function (name) {
                            return new Promise((resolve, reject) => {});
                        };
                    }
                } catch (error) {
                    SOCIALBROWSER.log(error);
                }

                if (SOCIALBROWSER.var.blocking.javascript.block_window_post_message) {
                    window.postMessage = function (...args) {
                        SOCIALBROWSER.log('Block Post Message ', ...args);
                    };
                }

                if (SOCIALBROWSER.parentAssignWindow) {
                    window.opener = window.opener || {
                        closed: false,
                        postMessage: (...args) => {
                            SOCIALBROWSER.ipc('window.message', {
                                windowID: SOCIALBROWSER.parentAssignWindow.parentWindowID,
                                data: args[0],
                                origin: args[1] || '*',
                                transfer: args[2],
                            });
                        },
                    };
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

                /* Handle xhr then handel fetch */
                window.XMLHttpRequest0 = window.XMLHttpRequest;
                window.XMLHttpRequest2 = function () {
                    let fake = {
                        xhr: new XMLHttpRequest0(),
                    };

                    fake.reMap = function () {
                        fake.readyState = fake.xhr.readyState;
                        fake.status = fake.xhr.status;
                        fake.statusText = fake.xhr.statusText;
                        fake.responseXML = fake.xhr.responseXML;
                        fake.responseText = fake.xhr.responseText;
                    };
                    fake.reMap();

                    fake.xhr.onreadystatechange = function (...args) {
                        fake.reMap();
                        if (fake.onreadystatechange) {
                            fake.onreadystatechange(...args);
                        }
                    };

                    fake.xhr.onload = function (...args) {
                        fake.reMap();
                        if (fake.onload) {
                            fake.onload(...args);
                        }
                    };

                    fake.open = function (...args) {
                        fake.xhr.open(...args);
                        fake.reMap();
                    };
                    fake.send = function (...args) {
                        //  fake.setRequestHeader('x-server', 'social-browser2');
                        fake.xhr.send(...args);
                        fake.reMap();
                    };
                    fake.setRequestHeader = function (...args) {
                        // console.log(...args);
                        fake.xhr.setRequestHeader(...args);
                        fake.reMap();
                    };

                    fake.abort = function (...args) {
                        fake.xhr.abort(...args);
                        fake.reMap();
                    };
                    fake.getAllResponseHeaders = function (...args) {
                        return fake.xhr.getAllResponseHeaders(...args);
                    };
                    fake.getResponseHeader = function (...args) {
                        return fake.xhr.getResponseHeader(...args);
                    };
                    return fake;
                };
            })();
        }

        SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.customSetting.$defaultUserAgent;

        if (SOCIALBROWSER.defaultUserAgent) {
            SOCIALBROWSER.userAgentURL = SOCIALBROWSER.defaultUserAgent.url;

            if (!SOCIALBROWSER.screenHidden && SOCIALBROWSER.defaultUserAgent.screen) {
                SOCIALBROWSER.__define(window, 'innerWidth', SOCIALBROWSER.defaultUserAgent.screen.width);
                SOCIALBROWSER.__define(window, 'innerHeight', SOCIALBROWSER.defaultUserAgent.screen.height);
                SOCIALBROWSER.__define(window, 'outerWidth', SOCIALBROWSER.defaultUserAgent.screen.width);
                SOCIALBROWSER.__define(window, 'outerHeight', SOCIALBROWSER.defaultUserAgent.screen.height);
                SOCIALBROWSER.__define(screen, 'width', SOCIALBROWSER.defaultUserAgent.screen.width);
                SOCIALBROWSER.__define(screen, 'height', SOCIALBROWSER.defaultUserAgent.screen.height);
                SOCIALBROWSER.__define(screen, 'availWidth', SOCIALBROWSER.defaultUserAgent.screen.width);
                SOCIALBROWSER.__define(screen, 'availHeight', SOCIALBROWSER.defaultUserAgent.screen.height);

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
                SOCIALBROWSER.__define(window, 'mozRTCIceCandidate', window.RTCIceCandidate);
                SOCIALBROWSER.__define(window, 'mozRTCPeerConnection', window.RTCPeerConnection);
                SOCIALBROWSER.__define(window, 'mozRTCSessionDescription', window.RTCSessionDescription);
                window.mozInnerScreenX = 0;
                window.mozInnerScreenY = 74;
            } else if (SOCIALBROWSER.defaultUserAgent.name.contains('Chrome')) {
            }

            if (SOCIALBROWSER.defaultUserAgent.device && SOCIALBROWSER.defaultUserAgent.device.name === 'Mobile') {
                SOCIALBROWSER.userAgentData = SOCIALBROWSER.userAgentData || {};
                SOCIALBROWSER.userAgentData.mobile = true;
                SOCIALBROWSER.userAgentData.platform = SOCIALBROWSER.defaultUserAgent.platform;

                SOCIALBROWSER.navigator.maxTouchPoints = 5;
                SOCIALBROWSER.__define(window, 'ontouchstart', function () {});
            }

            if (SOCIALBROWSER.userAgentData) {
                SOCIALBROWSER.navigator.userAgentData = {
                    brands: SOCIALBROWSER.userAgentData.brands,
                    mobile: SOCIALBROWSER.userAgentData.mobile,
                    platform: SOCIALBROWSER.userAgentData.platform,

                    getHighEntropyValues: function (arr) {
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
                    },
                };
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
            if ((fingerPrintLOADED = true)) {
                if (SOCIALBROWSER.customSetting.javaScriptOFF || SOCIALBROWSER.var.core.javaScriptOFF || SOCIALBROWSER.customSetting.windowType === 'main' || !SOCIALBROWSER.session.privacy.allowVPC) {
                    SOCIALBROWSER.log('.... [ Finger Printing OFF ] .... ' + document.location.href);
                    return;
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_cpu) {
                    SOCIALBROWSER.navigator.hardwareConcurrency = SOCIALBROWSER.session.privacy.vpc.cpu_count;
                }
                if (SOCIALBROWSER.session.privacy.vpc.hide_memory) {
                    SOCIALBROWSER.navigator.deviceMemory = SOCIALBROWSER.session.privacy.vpc.memory_count;
                }

                if (SOCIALBROWSER.screenHidden && SOCIALBROWSER.session.privacy.vpc.hide_screen && SOCIALBROWSER.session.privacy.vpc.screen) {
                    SOCIALBROWSER.__define(window, 'innerWidth', SOCIALBROWSER.session.privacy.vpc.screen.width);
                    SOCIALBROWSER.__define(window, 'innerHeight', SOCIALBROWSER.session.privacy.vpc.screen.height);
                    SOCIALBROWSER.__define(window, 'outerWidth', SOCIALBROWSER.session.privacy.vpc.screen.width);
                    SOCIALBROWSER.__define(window, 'outerHeight', SOCIALBROWSER.session.privacy.vpc.screen.height);
                    SOCIALBROWSER.__define(screen, 'width', SOCIALBROWSER.session.privacy.vpc.screen.width);
                    SOCIALBROWSER.__define(screen, 'height', SOCIALBROWSER.session.privacy.vpc.screen.height);
                    SOCIALBROWSER.__define(screen, 'availWidth', SOCIALBROWSER.session.privacy.vpc.screen.availWidth);
                    SOCIALBROWSER.__define(screen, 'availHeight', SOCIALBROWSER.session.privacy.vpc.screen.availHeight);

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
                    /*document.createElement0 = document.createElement;
                document.createElement = function (name) {
                  if (name == 'canvas') {
                    return null;
                  }
                  return document.createElement0(name);
                };*/
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

                if (SOCIALBROWSER.session.privacy.vpc.mask_date && SOCIALBROWSER.session.privacy.vpc.timeZone && SOCIALBROWSER.session.privacy.vpc.timeZone.text) {
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
                    })(SOCIALBROWSER.session.privacy.vpc.timeZone, new Date().getTimezoneOffset());
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

                    SOCIALBROWSER.navigator.getUserMedia = undefined;
                    window.MediaStreamTrack = undefined;
                    window.RTCPeerConnection = undefined;
                    window.RTCSessionDescription = undefined;

                    SOCIALBROWSER.navigator.mozGetUserMedia = undefined;
                    window.mozMediaStreamTrack = undefined;
                    window.mozRTCPeerConnection = undefined;
                    window.mozRTCSessionDescription = undefined;

                    SOCIALBROWSER.navigator.webkitGetUserMedia = undefined;
                    window.webkitMediaStreamTrack = undefined;
                    window.webkitRTCPeerConnection = undefined;
                    window.webkitRTCSessionDescription = undefined;
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_media_devices) {
                    SOCIALBROWSER.navigator.mediaDevices = {
                        ondevicechange: null,
                        enumerateDevices: () => {
                            return new Promise((resolve, reject) => {
                                resolve([]);
                            });
                        },
                        getUserMedia: () => {
                            return new Promise((resolve, reject) => {
                                reject('access block');
                            });
                        },
                    };
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
                    SOCIALBROWSER.__define(WebGLRenderingContext, 'getParameter', () => '');
                    SOCIALBROWSER.__define(WebGL2RenderingContext, 'getParameter', () => '');
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
                                            else if (arguments[0] === 37445) return 'Google Inc.';
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
                if (SOCIALBROWSER.session.privacy.vpc.hide_plugins) {
                    SOCIALBROWSER.navigator.plugins = {
                        length: 0,
                        item: () => null,
                        namedItem: () => null,
                        refresh: () => {},
                    };
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_connection || SOCIALBROWSER.session.privacy.vpc.hide_connection) {
                    SOCIALBROWSER.navigator.connection = {
                        addEventListener: function () {},
                        onchange: null,
                        effectiveType: SOCIALBROWSER.session.privacy.vpc.connection.effectiveType,
                        rtt: SOCIALBROWSER.session.privacy.vpc.connection.rtt,
                        downlink: SOCIALBROWSER.session.privacy.vpc.connection.downlink,
                        downlinkMax: SOCIALBROWSER.session.privacy.vpc.connection.downlinkMax,
                        saveData: false,
                        type: SOCIALBROWSER.session.privacy.vpc.connection.type,
                    };
                }

                /** This is not Chrome headless
               * navigator.permissions.query({name:'notifications'}).then(function(permissionStatus) {
                if(Notification.permission === 'denied' && permissionStatus.state === 'prompt') {
                    console.log('This is Chrome headless')	
                } else {
                    console.log('This is not Chrome headless')
                }
            });
               */

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
                    SOCIALBROWSER.navigator.getBattery = function () {
                        return new Promise((ok, err) => {
                            ok({
                                charging: ['', null, true, false][SOCIALBROWSER.maxOf(SOCIALBROWSER.sessionId(), 3)],
                                chargingTime: SOCIALBROWSER.maxOf(SOCIALBROWSER.sessionId(), 100),
                                dischargingTime: 0,
                                level: SOCIALBROWSER.maxOf(SOCIALBROWSER.sessionId(), 100) / 100,
                                onchargingchange: null,
                                onchargingtimechange: null,
                                ondischargingtimechange: null,
                                onlevelchange: null,
                            });
                        });
                    }.bind(navigator.getBattery);
                }

                if (SOCIALBROWSER.session.privacy.vpc.dnt) {
                    SOCIALBROWSER.navigator.doNotTrack = '1';
                } else {
                    SOCIALBROWSER.navigator.doNotTrack = '0';
                }

                if (SOCIALBROWSER.session.privacy.vpc.hide_location) {
                    SOCIALBROWSER.__define(navigator.geolocation, 'getCurrentPosition', function (callback, error) {
                        if (callback) {
                            callback({
                                timestamp: new Date().getTime(),
                                coords: {
                                    latitude: SOCIALBROWSER.session.privacy.vpc.location.latitude,
                                    longitude: SOCIALBROWSER.session.privacy.vpc.location.longitude,
                                    altitude: null,
                                    accuracy: SOCIALBROWSER.random(50, 500),
                                    altitudeAccuracy: null,
                                    heading: null,
                                    speed: null,
                                },
                            });
                        }
                    });

                    SOCIALBROWSER.__define(navigator.geolocation, 'watchPosition', function (success, error, options) {
                        if (success) {
                            let timeout = options?.timeout || 1000 * 5;
                            let latitude = parseFloat(SOCIALBROWSER.session.privacy.vpc.location.latitude || 0);
                            let longitude = parseFloat(SOCIALBROWSER.session.privacy.vpc.location.longitude || 0);
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

                    SOCIALBROWSER.__define(navigator.geolocation, 'clearWatch', function (id) {
                        clearInterval(id);
                    });
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
                SOCIALBROWSER.__define(window, 'localStorage', {
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

                SOCIALBROWSER.__define(window, 'sessionStorage', hack);
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
                });
            } else if (data.name == 'new-ghost-window') {
                let browser = SOCIALBROWSER.getRandomBrowser('pc');
                let ghost = SOCIALBROWSER.md5((new Date().getTime().toString() + Math.random().toString()).replace('.', '')) + '@' + SOCIALBROWSER.tempMailServer;
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: ghost,
                    user_name: ghost,
                    url: document.location.href,
                    referrer: document.location.href,
                    defaultUserAgent: browser,
                    vpc: SOCIALBROWSER.generateVPC(),
                    width: browser.screen.width,
                    height: browser.screen.height,
                    show: true,
                    iframe: true,
                    center: true,
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
                    vpc: SOCIALBROWSER.generateVPC(),
                    width: browser.screen.width,
                    height: browser.screen.height,
                    show: true,
                    iframe: true,
                    center: true,
                });
            } else if (data.name == 'new-insecure-window') {
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: SOCIALBROWSER.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    security: false,
                    show: true,
                    center: true,
                });
            } else if (data.name == 'new-sandbox-window') {
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: SOCIALBROWSER.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    sandbox: true,
                    show: true,
                    center: true,
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
                });
            } else if (data.name == 'new-off-window') {
                SOCIALBROWSER.ipc('[open new popup]', {
                    partition: SOCIALBROWSER.partition,
                    url: document.location.href,
                    referrer: document.location.href,
                    off: true,
                    show: true,
                    center: true,
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
            } else if (data.name == 'show-info') {
                SOCIALBROWSER.showInfo(data.msg);
            } else if (data.name == '[open new popup]') {
                SOCIALBROWSER.ipc('[open new popup]', data);
            }
        });

        SOCIALBROWSER.on('show_message', (event, data) => {
            alert(data.message);
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
            }
        });

        SOCIALBROWSER.navigator.clipboard = { writeText: SOCIALBROWSER.copy };

        if (!SOCIALBROWSER.isFirefox) {
            if (true /** to work in background.js */ || SOCIALBROWSER.userAgentURL.like('*chrome*') || document.location.href.like('*chrome-extension://*')) {
                (function loadChromExtention() {
                    SOCIALBROWSER.log('chrome-extension Init ...');
                    var injectExtensionAPIs = () => {
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
                            const chrome = globalThis.chrome || {};
                            const extensionId = chrome.runtime?.id;
                            const manifest = (extensionId && chrome.runtime.getManifest?.()) || {};
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
                                            sendMessage: null,
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
                                SOCIALBROWSER.__define(window, 'chrome', chrome);
                            }
                        }

                        mainWorldScript();
                    };

                    injectExtensionAPIs();
                })();
            } else {
                chrome = undefined;
            }
        } else {
            delete chrome;
        }

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
};

SOCIALBROWSER.init = function () {
    SOCIALBROWSER.browserData = SOCIALBROWSER.ipcSync('[browser][data]', {
        partition: SOCIALBROWSER.partition,
        url: SOCIALBROWSER.href,
        domain: SOCIALBROWSER.domain,
        propertyList: SOCIALBROWSER.propertyList,
        windowID: SOCIALBROWSER._window.id,
    });

    (function loadInit() {
        if ((initLOADED = true)) {
            SOCIALBROWSER.escapeRegExp = function (s = '') {
                if (!s) {
                    return '';
                }
                if (typeof s !== 'string') {
                    s = s.toString();
                }
                return s.replace(/[\/\\^$*+?.()\[\]{}]/g, '\\$&');
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
                    return name.split('|').some((n) => n && this.test('^.*' + SOCIALBROWSER.escapeRegExp(n) + '.*$', 'gium'));
                };
            }
            if (!String.prototype.contains) {
                String.prototype.contains = function (name = '') {
                    return name.split('|').some((n) => n && this.test('^.*' + SOCIALBROWSER.escapeRegExp(n) + '.*$', 'gium'));
                };
            }
        }
    })();

    SOCIALBROWSER.init2();

    if (SOCIALBROWSER.var.core.id.like(SOCIALBROWSER.from123('245832574758376545791357465362852459325746793163'))) {
        SOCIALBROWSER.developerMode = true;
    }

    if (!SOCIALBROWSER.window.storaeAdded) {
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
        SOCIALBROWSER.window.storaeAdded = true;
    }
};

SOCIALBROWSER._window = SOCIALBROWSER._window || SOCIALBROWSER.ipcSync('[window]');

SOCIALBROWSER._window.fnList.forEach((fn) => {
    SOCIALBROWSER._window[fn] = (...params) => SOCIALBROWSER.fn('window.' + fn, ...params);
});
SOCIALBROWSER._window.on = function () {};

SOCIALBROWSER.init();

// for (const key in SOCIALBROWSER.navigator) {
//     if (Object.prototype.hasOwnProperty.call(SOCIALBROWSER.navigator, key)) {
//         SOCIALBROWSER.__define(navigator, key, SOCIALBROWSER.navigator[key]);
//     }
// }

if (!SOCIALBROWSER.isWhiteSite) {
    SOCIALBROWSER.__define(
        globalThis,
        'navigator',
        new Proxy(navigator, {
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
                return SOCIALBROWSER.navigator[key] ?? target[key];
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
} else {
    for (const key in SOCIALBROWSER.navigator) {
        if (Object.prototype.hasOwnProperty.call(SOCIALBROWSER.navigator, key)) {
            SOCIALBROWSER.__define(navigator, key, SOCIALBROWSER.navigator[key]);
        }
    }
}

SOCIALBROWSER.defineProperty = Object.defineProperty;
Object.defineProperty = function (o, p, d) {
    try {
        if (o === navigator) {
            SOCIALBROWSER.defineProperty(navigator._, p, d);
            return o;
        }
        return SOCIALBROWSER.defineProperty(o, p, d);
    } catch (error) {
        SOCIALBROWSER.log(error);
        return o;
    }
}.bind(Object.defineProperty);
