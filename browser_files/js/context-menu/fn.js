module.exports = function (SOCIALBROWSER) {
    SOCIALBROWSER.sendMessage = function (cm) {
        SOCIALBROWSER.call('renderMessage', cm);
    };

    SOCIALBROWSER.__define = function (o, p, v, op) {
        op = op || {};
        if (typeof o == 'undefined') {
            return;
        }
        Object.defineProperty(o, p, {
            get: function () {
                return v;
            },
            enumerable: op.enumerable || false,
        });
        if (o.prototype) {
            o.prototype[p] = v;
        }
    };

    SOCIALBROWSER.copy = function (text) {
        SOCIALBROWSER.electron.clipboard.writeText(text);
    };
    SOCIALBROWSER.paste = function () {
        SOCIALBROWSER.webContents.paste();
    };
    SOCIALBROWSER.write = function (text, selector, timeout) {
        return new Promise((resolver, reject) => {
            if (!text) {
                reject('No Text');
            }
            let dom = null;
            SOCIALBROWSER.copy(text);
            setTimeout(() => {
                if (selector) {
                    dom = SOCIALBROWSER.select(selector);
                }
                SOCIALBROWSER.paste();
                setTimeout(() => {
                    if (selector && dom) {
                        resolver(dom);
                    } else {
                        resolver(text);
                    }
                }, 500);
            }, timeout || 500);
        });
    };
    SOCIALBROWSER.click = function (selector) {
        let dom = SOCIALBROWSER.select(selector);
        if (dom) {
            dom.click();
            return dom;
        }
    };
    SOCIALBROWSER.select = function (selector, value) {
        if (!selector) {
            return null;
        }
        let dom = document.querySelector(selector);
        if (dom && dom.focus) {
            dom.focus();
            if (value) {
                dom.value = value;
                dom.dispatchEvent(
                    new Event('change', {
                        bubbles: true,
                        cancelable: true,
                    }),
                );
            }
        }
        return dom;
    };

    SOCIALBROWSER.getTimeZone = () => {
        return new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
    };

    SOCIALBROWSER.isValidURL = SOCIALBROWSER.isURL = function (str) {
        var pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i',
        ); // fragment locator
        return !!pattern.test(str);
    };

    SOCIALBROWSER.handle_url = SOCIALBROWSER.handleURL = function (u) {
        if (typeof u !== 'string') {
            return u;
        }
        try {
            u = decodeURI(u);
        } catch (error) {
            u = u;
        }
        u = u.trim();
        if (u.like('http*') || u.indexOf('//') === 0 || u.indexOf('data:') === 0 || u.indexOf('blob:') === 0) {
            u = u;
        } else if (u.indexOf('/') === 0) {
            u = window.location.origin + u;
        } else if (u.split('?')[0].split('.').length < 3) {
            let page = window.location.pathname.split('/').pop();
            u = window.location.origin + window.location.pathname.replace(page, '') + u;
        }
        return u;
    };

    SOCIALBROWSER.__numberRange = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    };

    SOCIALBROWSER.isViewable = function (element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    if (SOCIALBROWSER.var.blocking.javascript.block_eval) {
        window.eval = function (code) {
            SOCIALBROWSER.log('eval block', code);
        };
    }

    SOCIALBROWSER.eval = function (code) {
        if (!code) {
            return;
        }
        if (typeof code !== 'string') {
            code = code.toString();
            code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
        }

        let fs = SOCIALBROWSER.require('fs');
        let path = `${SOCIALBROWSER.browserData.data_dir}/temp_${SOCIALBROWSER.currentWindow.id}_${Date.now()}.js`;
        if (fs.existsSync(path)) {
            SOCIALBROWSER.require(path);
        } else {
            fs.writeFile(path, code, (err) => {
                if (err) {
                    SOCIALBROWSER.log(err);
                } else {
                    SOCIALBROWSER.require(path);
                    setTimeout(() => {
                        fs.unlinkSync(path);
                    }, 1000 * 3);
                }
            });
        }
    };

    SOCIALBROWSER.openWindow = function (options) {
        options.partition = options.partition || SOCIALBROWSER.partition;
        let win = new SOCIALBROWSER.remote.BrowserWindow({
            show: options.show ?? true,
            alwaysOnTop: options.alwaysOnTop ?? true,
            skipTaskbar: options.skipTaskbar ?? false,
            width: options.width || 1200,
            height: options.height || 720,
            x: options.x || 200,
            y: options.y || 200,
            backgroundColor: options.backgroundColor || '#ffffff',
            icon: options.icon ?? SOCIALBROWSER.var.core.icon,
            frame: options.frame ?? true,
            title: options.title ?? 'New Window',
            resizable: options.resizable ?? true,
            fullscreenable: true,
            webPreferences: {
                contextIsolation: options.contextIsolation ?? false,
                enableRemoteModule: options.enableRemoteModule ?? true,
                webaudio: !options.audioOFF,
                nativeWindowOpen: options.nativeWindowOpen ?? false,
                nodeIntegration: options.node,
                nodeIntegrationInWorker: options.node,
                partition: options.partition,
                sandbox: options.sandbox ?? false,
                preload: options.preload || SOCIALBROWSER.files_dir + '/js/context-menu.js',
                webSecurity: options.webSecurity ?? true,
                allowRunningInsecureContent: options.allowRunningInsecureContent ?? false,
                plugins: true,
            },
        });

        SOCIALBROWSER.ipc('[add][window]', { win_id: win.id, options: { ...SOCIALBROWSER.__options, ...{ partition: options.partition, windowType: 'client-popup', win_id: win.id } } });
        SOCIALBROWSER.ipc('[assign][window]', {
            parent_id: SOCIALBROWSER.currentWindow.id,
            child_id: win.id,
        });
        if (!options.x && !options.y) {
            win.center();
        }

        win.setMenuBarVisibility(false);
        if (options.audioOFF) {
            win.webContents.audioMuted = true;
        }

        if (options.proxy) {
            const ss = win.webContents.session;
            ss.setProxy(
                {
                    proxyRules: options.proxy,
                    proxyBypassRules: '127.0.0.1',
                },
                function () {},
            );
        }

        if (options.url) {
            win.loadURL(SOCIALBROWSER.handleURL(options.url), {
                referrer: options.referrer || document.location.href,
                userAgent: options.userAgent || navigator.userAgent,
            });
        }

        win.on('close', (e) => {
            if (win && !win.isDestroyed()) {
                win.destroy();
            }
        });

        win.once('ready-to-show', function () {
            if (options.show) {
                win.show();
                if (options.maximize) {
                    win.maximize();
                }
            }
        });
        win.webContents.on('context-menu', (event, params) => {
            if (win && !win.isDestroyed()) {
                if (options.menuOFF !== false) {
                    win.webContents.send('context-menu', params);
                }
            }
        });

        win.eval = function (code) {
            if (!code) {
                return;
            }
            if (typeof code !== 'string') {
                code = code.toString();
                code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
            }
            SOCIALBROWSER.call('[set][window][setting]', {
                win_id: win.id,
                name: 'eval',
                code: code,
            });
        };

        win.onBeforeRequest = function (callback) {
            win.webContents.session.webRequest.onBeforeRequest(
                {
                    urls: ['*://*/*'],
                },
                callback,
            );
        };

        win.onBeforeSendHeaders = function (callback) {
            win.webContents.session.webRequest.onBeforeSendHeaders(
                {
                    urls: ['*://*/*'],
                },
                callback,
            );
        };

        return win;
    };

    window.console.clear = function () {};

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

    let translate_busy = false;
    SOCIALBROWSER.translate = function (text, callback) {
        callback =
            callback ||
            function (trans) {
                SOCIALBROWSER.log(trans);
            };
        if (text.test(/^[a-zA-Z\-\u0590-\u05FF\0-9^@_:?;!\[\]~<>{}|\\]+$/)) {
            callback(text);
            return;
        }
        if (!text) {
            callback(text);
            return;
        }
        if (translate_busy) {
            setTimeout(() => {
                SOCIALBROWSER.translate(text, callback);
            }, 250);
            return;
        }
        translate_busy = true;

        SOCIALBROWSER.on('[translate][data]', (e, data) => {
            translate_busy = false;
            translated_text = '';
            if (data && data.sentences && data.sentences.length > 0) {
                data.sentences.forEach((t) => {
                    translated_text += t.trans;
                });
                callback(translated_text || text);
            }
        });

        SOCIALBROWSER.call('[translate]', { text: text });
    };

    SOCIALBROWSER.getPrinters = function () {
        return SOCIALBROWSER.currentWindow.webContents.getPrinters();
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
        try {
            if (document.body && !document.querySelector('#xxx__browser')) {
                let xxx__browser = document.createElement('div');
                xxx__browser.id = 'xxx__browser';
                xxx__browser.innerHTML = Buffer.from(SOCIALBROWSER.injectHTML).toString();
                document.body.appendChild(xxx__browser);
            }
        } catch (error) {
            SOCIALBROWSER.log(error);
        }
    };

    SOCIALBROWSER.__showBookmarks = function () {
        SOCIALBROWSER.injectDefault();
        let div = document.querySelector('#__bookmarkDiv');
        if (div) {
            SOCIALBROWSER.var.bookmarks.forEach((b) => {
                b.image = b.image || SOCIALBROWSER.nativeImage(b.image);
                div.innerHTML += `
                    <a class="bookmark" href="${b.url}" target="_blank">
                        <p class="title"> ${b.title} </p>
                    </a>
                    `;
            });
            div.style.display = 'block';
        }
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
            div.innerHTML = msg || 'This Page Blocked';
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
                div.innerHTML = msg;
                showinfoTimeout = setTimeout(() => {
                    div.innerHTML = '';
                    div.style.display = 'none';
                }, time | (1000 * 3));
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
                    __downloads.innerHTML = '';
                });
            }
        }
        if (msg && __downloads) {
            __downloads.style.display = 'block';
            __downloads.innerHTML = msg;
        } else if (__downloads) {
            __downloads.style.display = 'none';
            __downloads.innerHTML = '';
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
                SOCIALBROWSER.currentWindow.webContents.stopFindInPage('clearSelection');
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
            SOCIALBROWSER.currentWindow.webContents.findInPage(find_input.value, find_options);
            find_options.findNext = true;
        } else {
            SOCIALBROWSER.currentWindow.webContents.stopFindInPage('clearSelection');
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
    SOCIALBROWSER.copyObject = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
    SOCIALBROWSER.on('found-in-page', (event, data) => {
        if (data.win_id == SOCIALBROWSER.currentWindow.id) {
            // SOCIALBROWSER.log(data);
        }
    });

    SOCIALBROWSER.on('[send-render-message]', (event, data) => {
        if (data.name == 'update-target-url') {
            SOCIALBROWSER.showInfo(data.url);
        } else if (data.name == 'show-info') {
            SOCIALBROWSER.showInfo(data.msg);
        }
    });

    SOCIALBROWSER.on('user_downloads', (event, data) => {
        showDownloads(data.message, data.class);
    });
    SOCIALBROWSER.on('show_message', (event, data) => {
        alert(data.message);
    });

    SOCIALBROWSER.windowOpenList = [];

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
};
