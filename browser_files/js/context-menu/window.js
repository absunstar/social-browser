module.exports = function (SOCIALBROWSER) {
    // window.location0 = window.location.ancestorOrigins;
    // window.location = {
    //   ancestorOrigins : window.location.ancestorOrigins,
    //   host : window.location.host,
    //   hostname : window.location.hostname,
    //   origin : window.location.origin,
    //   pathname : window.location.pathname,
    //   port : window.location.port,
    //   protocol : window.location.protocol,
    //   search : window.location.search,
    //   href : window.location.href
    // }

    // Object.defineProperty(window.location, 'href', {
    //   configurable: true,
    //   get() {
    //     return 'mmmmmmmmmmmmmmmmmmm';
    //   },
    //   set(newValue) {
    //     SOCIALBROWSER.log(' [href] ', newValue);
    //   },
    // });

    window.open = function (url, _name, _specs, _replace_in_history) {
        if (url.like('javascript:*|*.svg|*.png|*.ico|*.gif')) {
            return;
        }

        let child_window = {
            closed: false,
            opener: window,
            innerHeight: 1028,
            innerWidth: 720,
            addEventListener: (name, callback) => {
                // SOCIALBROWSER.log(`[ child_window addEventListener ${name}`);
                if (name == 'load') {
                    if (callback) {
                        callback();
                    }
                }
            },
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

        if (typeof url !== 'string') {
            return child_window;
        }
        if (url == 'about:blank') {
            return child_window;
        }
        url = SOCIALBROWSER.handle_url(url);

        if (SOCIALBROWSER.windowOpenList.some((u) => u == url)) {
            return child_window;
        }
        SOCIALBROWSER.windowOpenList.push(url);

        if (url.like('https://www.youtube.com/watch*')) {
            SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                url: 'https://www.youtube.com/embed/' + url.split('=')[1].split('&')[0],
                partition: SOCIALBROWSER.partition,
                referrer: document.location.href,
            });

            return child_window;
        }

        if (!SOCIALBROWSER.var.core.disabled) {
            let allow = false;

            let toUrlParser = SOCIALBROWSER.url.parse(url);
            let fromUrlParser = SOCIALBROWSER.url.parse(this.document.location.href);

            if ((toUrlParser.host.contains(fromUrlParser.host) || fromUrlParser.host.contains(toUrlParser.host)) && SOCIALBROWSER.var.blocking.popup.allow_internal) {
                allow = true;
            } else if (toUrlParser.host !== fromUrlParser.host && SOCIALBROWSER.var.blocking.popup.allow_external) {
                allow = true;
            } else {
                SOCIALBROWSER.var.blocking.popup.white_list.forEach((d) => {
                    if (toUrlParser.host.like(d.url) || fromUrlParser.host.like(d.url)) {
                        allow = true;
                    }
                });
            }

            if (!allow) {
                return child_window;
            }
        }
        _specs = _specs || {};
        let win = new SOCIALBROWSER.openWindow({
            width: _specs.width,
            height: _specs.height,
            url: url,
        });

        child_window.postMessage = function (...args) {
            SOCIALBROWSER.call('window.message', { child_id: win.id, data: args[0], origin: args[1] || '*', transfer: args[2] });
        };

        win.on('close', () => {
            win.destroy();
        });

        win.on('closed', (e) => {
            child_window.postMessage = () => {};
            child_window.eval = () => {};
            child_window.closed = true;
        });

        win.webContents.once('dom-ready', () => {
            child_window.eval = function (code, userGesture = true) {
                code = `window.eval(${code})`;
                win.webContents
                    .executeJavaScript(code, userGesture)
                    .then((result) => {
                        // SOCIALBROWSER.log(result);
                    })
                    .catch((err) => {
                        // SOCIALBROWSER.log(err);
                    });
            };
        });

        child_window.close = function () {
            if (win && !win.isDestroyed()) {
                win.close();
                setTimeout(() => {
                    if (win && !win.isDestroyed()) {
                        win.destroy();
                    }
                }, 1000);
            }
        };

        return child_window;
    };

    if (SOCIALBROWSER.var.blocking.javascript.block_console_output) {
        window.SOCIALBROWSER.log = function () {};
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
    if (SOCIALBROWSER.var.blocking.javascript.block_window_worker) {
        window.Worker = function (...args) {
            return {
                onmessage: () => {},
                onerror: () => {},
                postMessage: () => {},
            };
        };

        window.SharedWorker = function (...args) {
            return {
                onmessage: () => {},
                onerror: () => {},
                postMessage: () => {},
            };
        };
    }

    if (SOCIALBROWSER.var.blocking.javascript.block_window_post_message) {
        window.postMessage = function (...args) {
            if (SOCIALBROWSER.var.blocking.javascript.block_window_post_message) {
                SOCIALBROWSER.log('Block Post Message ', ...args);
            }
        };
    }

    SOCIALBROWSER.on('window.message', (e, obj) => {
        window.postMessage(obj.data, obj.origin, obj.transfer);
    });

    window.addEventListener('message', (e) => {
        if (typeof e.data == 'string' && e.data.startsWith('{')) {
            let info = JSON.parse(e.data);
            if (info.name === 'SOCIALBROWSER') {
                if (info.key === 'eval' && info.value) {
                    SOCIALBROWSER.eval(info.value);
                } else {
                    SOCIALBROWSER[info.key] = info.value;
                }
            }
        }
    });

    if (SOCIALBROWSER.windows) {
        window.opener = {
            postMessage: (...args) => {
                SOCIALBROWSER.call('window.message', {
                    parent_id: SOCIALBROWSER.windows.parent_id,
                    data: args[0],
                    origin: args[1] || '*',
                    transfer: args[2],
                });
            },
        };
    }

    window.print0 = window.print;
    window.print = function (options) {
        document.querySelectorAll('[href]').forEach((el) => {
            el.href = SOCIALBROWSER.handle_url(el.href);
        });
        document.querySelectorAll('[src]').forEach((el) => {
            el.src = SOCIALBROWSER.handle_url(el.src);
        });

        fetch('http://127.0.0.1:60080/printing', {
            mode: 'cors',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'print',
                win_id: SOCIALBROWSER.currentWindow.id,
                type: 'html',
                html: document.querySelector('html').outerHTML,
                options: options,
                origin: document.location.origin,
                url: document.location.href,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                //  SOCIALBROWSER.log(data);
            })
            .catch((err) => {
                //  SOCIALBROWSER.log(err);
            });
    };

    let alert_idle = null;
    window.alert =
        window.prompt =
        window.confirm =
            function (msg, time) {
                if (msg && msg.trim()) {
                    SOCIALBROWSER.log(msg);
                    SOCIALBROWSER.injectDefault();
                    let div = document.querySelector('#__alertBox');
                    if (div) {
                        clearTimeout(alert_idle);
                        div.innerHTML = msg;
                        div.style.display = 'block';
                        alert_idle = setTimeout(() => {
                            div.style.display = 'none';
                            div.innerHTML = '';
                        }, time || 1000 * 3);
                    }
                }
                return true;
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
};
