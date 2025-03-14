'use strict';
(() => {
  var __require = /* @__PURE__ */ ((x) =>
    typeof require !== 'undefined'
      ? require
      : typeof Proxy !== 'undefined'
      ? new Proxy(x, {
          get: (a, b) => (typeof require !== 'undefined' ? require : a)[b],
        })
      : x)(function (x) {
    if (typeof require !== 'undefined') return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/renderer/index.ts
  var import_electron2 = __require('electron');

  // src/renderer/event.ts
  var import_electron = __require('electron');
  var formatIpcName = (name) => `crx-${name}`;
  var listenerMap = /* @__PURE__ */ new Map();
  var addExtensionListener = (extensionId, name, callback) => {
    const listenerCount = listenerMap.get(name) || 0;
    if (listenerCount === 0) {
      import_electron.ipcRenderer.send('crx-add-listener', extensionId, name);
    }
    listenerMap.set(name, listenerCount + 1);
    import_electron.ipcRenderer.addListener(formatIpcName(name), function (event, ...args) {
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
        import_electron.ipcRenderer.send('crx-remove-listener', extensionId, name);
      } else {
        listenerMap.set(name, listenerCount - 1);
      }
    }
    import_electron.ipcRenderer.removeListener(formatIpcName(name), callback);
  };

  // src/renderer/index.ts
  var injectExtensionAPIs = () => {
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
        result = await import_electron2.ipcRenderer.invoke('crx-msg', extensionId, fnName, ...args);
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
      const connectionId = import_electron2.contextBridge.executeInMainWorld({
        func: () => crypto.randomUUID(),
      });
      invokeExtension(extensionId, 'runtime.connectNative', {}, connectionId, application);
      const onMessage = (_event, message) => {
        receive(message);
      };
      import_electron2.ipcRenderer.on(`crx-native-msg-${connectionId}`, onMessage);
      import_electron2.ipcRenderer.once(`crx-native-msg-${connectNative}-disconnect`, () => {
        import_electron2.ipcRenderer.off(`crx-native-msg-${connectionId}`, onMessage);
        disconnect();
      });
      const send = (message) => {
        import_electron2.ipcRenderer.send(`crx-native-msg-${connectionId}`, message);
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
      const electron = globalThis.electron || electronContext;
      const chrome = globalThis.chrome || {};
      const extensionId = chrome.runtime?.id;
      const manifest = (extensionId && chrome.runtime.getManifest?.()) || {};
      const invokeExtension2 =
        (fnName, opts = {}) =>
        (...args) =>
          electron.invokeExtension(extensionId, fnName, opts, ...args);
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
          electron.addExtensionListener(extensionId, this.name, callback);
        }
        removeListener(callback) {
          electron.removeExtensionListener(extensionId, this.name, callback);
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
            electron.disconnectNative(extensionId, this.connectionId);
            this.onDisconnect._emit();
            this.connected = false;
          }
        }
      }
      const browserActionFactory = (base) => {
        const api = {
          ...base,
          setTitle: invokeExtension2('browserAction.setTitle'),
          getTitle: invokeExtension2('browserAction.getTitle'),
          setIcon: invokeExtension2('browserAction.setIcon', {
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
          setPopup: invokeExtension2('browserAction.setPopup'),
          getPopup: invokeExtension2('browserAction.getPopup'),
          setBadgeText: invokeExtension2('browserAction.setBadgeText'),
          getBadgeText: invokeExtension2('browserAction.getBadgeText'),
          setBadgeBackgroundColor: invokeExtension2('browserAction.setBadgeBackgroundColor'),
          getBadgeBackgroundColor: invokeExtension2('browserAction.getBadgeBackgroundColor'),
          getUserSettings: invokeExtension2('browserAction.getUserSettings'),
          enable: invokeExtension2('browserAction.enable', { noop: true }),
          disable: invokeExtension2('browserAction.disable', { noop: true }),
          openPopup: invokeExtension2('browserAction.openPopup'),
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
              getAll: invokeExtension2('commands.getAll'),
              onCommand: new ExtensionEvent('commands.onCommand'),
            };
          },
        },
        contextMenus: {
          factory: (base) => {
            let menuCounter = 0;
            const menuCallbacks = {};
            const menuCreate = invokeExtension2('contextMenus.create');
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
              update: invokeExtension2('contextMenus.update', { noop: true }),
              remove: invokeExtension2('contextMenus.remove'),
              removeAll: invokeExtension2('contextMenus.removeAll'),
              onClicked: new ExtensionEvent('contextMenus.onClicked'),
            };
            return api;
          },
        },
        cookies: {
          factory: (base) => {
            return {
              ...base,
              get: invokeExtension2('cookies.get'),
              getAll: invokeExtension2('cookies.getAll'),
              set: invokeExtension2('cookies.set'),
              remove: invokeExtension2('cookies.remove'),
              getAllCookieStores: invokeExtension2('cookies.getAllCookieStores'),
              onChanged: new ExtensionEvent('cookies.onChanged'),
            };
          },
        },
        // TODO: implement
        downloads: {
          factory: (base) => {
            return {
              ...base,
              acceptDanger: invokeExtension2('downloads.acceptDanger', { noop: true }),
              cancel: invokeExtension2('downloads.cancel', { noop: true }),
              download: invokeExtension2('downloads.download', { noop: true }),
              erase: invokeExtension2('downloads.erase', { noop: true }),
              getFileIcon: invokeExtension2('downloads.getFileIcon', { noop: true }),
              open: invokeExtension2('downloads.open', { noop: true }),
              pause: invokeExtension2('downloads.pause', { noop: true }),
              removeFile: invokeExtension2('downloads.removeFile', { noop: true }),
              resume: invokeExtension2('downloads.resume', { noop: true }),
              search: invokeExtension2('downloads.search', { noop: true }),
              setUiOptions: invokeExtension2('downloads.setUiOptions', { noop: true }),
              show: invokeExtension2('downloads.show', { noop: true }),
              showDefaultFolder: invokeExtension2('downloads.showDefaultFolder', { noop: true }),
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
              isAllowedFileSchemeAccess: invokeExtension2('extension.isAllowedFileSchemeAccess', {
                noop: true,
                defaultResponse: false,
              }),
              isAllowedIncognitoAccess: invokeExtension2('extension.isAllowedIncognitoAccess', {
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
              clear: invokeExtension2('notifications.clear'),
              create: invokeExtension2('notifications.create'),
              getAll: invokeExtension2('notifications.getAll'),
              getPermissionLevel: invokeExtension2('notifications.getPermissionLevel'),
              update: invokeExtension2('notifications.update'),
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
              contains: invokeExtension2('permissions.contains'),
              getAll: invokeExtension2('permissions.getAll'),
              remove: invokeExtension2('permissions.remove'),
              request: invokeExtension2('permissions.request'),
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
                electron.connectNative(extensionId, application, receive, disconnect, callback);
                return port;
              },
              openOptionsPage: invokeExtension2('runtime.openOptionsPage'),
              sendNativeMessage: invokeExtension2('runtime.sendNativeMessage'),
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
              create: invokeExtension2('tabs.create'),
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
              get: invokeExtension2('tabs.get'),
              getCurrent: invokeExtension2('tabs.getCurrent'),
              getAllInWindow: invokeExtension2('tabs.getAllInWindow'),
              insertCSS: invokeExtension2('tabs.insertCSS'),
              query: invokeExtension2('tabs.query'),
              reload: invokeExtension2('tabs.reload'),
              update: invokeExtension2('tabs.update'),
              remove: invokeExtension2('tabs.remove'),
              goBack: invokeExtension2('tabs.goBack'),
              goForward: invokeExtension2('tabs.goForward'),
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
              get: invokeExtension2('topSites.get', { noop: true, defaultResponse: [] }),
            };
          },
        },
        webNavigation: {
          factory: (base) => {
            return {
              ...base,
              getFrame: invokeExtension2('webNavigation.getFrame'),
              getAllFrames: invokeExtension2('webNavigation.getAllFrames'),
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
              WINDOW_ID_CURRENT: -2,
              get: invokeExtension2('windows.get'),
              getCurrent: invokeExtension2('windows.getCurrent'),
              getLastFocused: invokeExtension2('windows.getLastFocused'),
              getAll: invokeExtension2('windows.getAll'),
              create: invokeExtension2('windows.create'),
              update: invokeExtension2('windows.update'),
              remove: invokeExtension2('windows.remove'),
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
      delete globalThis.electron;
      Object.freeze(chrome);
    }
    if (!process.contextIsolated) {
      console.warn(`injectExtensionAPIs: context isolation disabled in ${location.href}`);
      mainWorldScript();
      return;
    }
    try {
      import_electron2.contextBridge.exposeInMainWorld('electron', electronContext);
      if ('executeInMainWorld' in import_electron2.contextBridge) {
        import_electron2.contextBridge.executeInMainWorld({
          func: mainWorldScript,
        });
      } else {
        import_electron2.webFrame.executeJavaScript(`(${mainWorldScript}());`);
      }
    } catch (error) {
      console.error(`injectExtensionAPIs error (${location.href})`);
      console.error(error);
    }
  };

  injectExtensionAPIs();
})();
