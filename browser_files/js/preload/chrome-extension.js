module.exports = function (SOCIALBROWSER, window, document) {
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
                    console.log(name, '(result)', ...args);
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
                console.log(fnName, args);
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
                console.log(fnName, '(result)', result);
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
                // TODO: implement
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
                            // TODO: Add native implementation
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
                            // TODO: provide a backend for browsers to opt-in to
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
                    tran: 15, // Transition type or something
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
                            startTime: window.performance.timing.loadEventEnd / 1000, // Fallback if no navigation occured (`about:blank`)
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
};
