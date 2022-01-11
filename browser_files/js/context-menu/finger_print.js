module.exports = function (SOCIALBROWSER) {
    // change readonly properties
    // https://hidester.com/browser-fingerprint/

    /** site know your pc [screen , cpu , memory]
     *  user agent per profile + host (unique)
     *  cpu per profile
     *  memory per profile
     *  mimtype 0
     *  plugins 0
     *  screen size per profile
     *  timezone per profile
     *  battary info per profile
     *  connection off
     *  vega off
     *  rtc off
     *  language en
     *  browser permissions random
     */

    if (
        SOCIALBROWSER.var.core.disabled ||
        SOCIALBROWSER.__options.windowType === 'main' ||
        document.location.href.like('http://localhost*|https://localhost*|http://127.0.0.1*|https://127.0.0.1*|browser://*|chrome://*')
    ) {
        SOCIALBROWSER.log(' [Finger Printing] OFF : ' + document.location.href);
        return;
    }

    if (!(SOCIALBROWSER.var.blocking.privacy.enable_finger_protect || SOCIALBROWSER.session.privacy.enable_finger_protect)) {
        SOCIALBROWSER.log(' [Finger Printing] OFF (setting)');
        return;
    }

    SOCIALBROWSER.log(' [Finger Printing] ON : ' + document.location.href);

    if (SOCIALBROWSER.session.privacy.block_canvas) {
        document.createElement0 = document.createElement;
        document.createElement = function (name) {
            if (name == 'canvas') {
                return null;
            }
            return document.createElement0(name);
        };
    }
    if (SOCIALBROWSER.session.privacy.mask_date) {
        Date.prototype.getTimezoneOffset = function () {
            return SOCIALBROWSER.session.privacy.date_offset;
        };
        Date.prototype.toString0 = Date.prototype.toString;
        Date.prototype.toString = function () {
            return this.toString0()
                .replace('GMT+0200', 'GMT' + SOCIALBROWSER.session.privacy.date_offset)
                .replace(/\((.*)\)/, ` ( ${SOCIALBROWSER.session.privacy.date_offset} )`);
        };

        window.Intl.DateTimeFormat.prototype.resolvedOptions = function () {
            return {
                calendar: 'gregory',
                day: 'numeric',
                locale: navigator.language,
                month: 'numeric',
                numberingSystem: 'latn',
                timeZone: SOCIALBROWSER.session.privacy.date_offset.toString(),
                year: 'numeric',
            };
        };
    }

    if (SOCIALBROWSER.var.blocking.privacy.set_window_active) {
        SOCIALBROWSER.eventOff +=
            'document(mouseout)|document(pagehide)|document(hashchange)|document(popstate)|document(state-change)|document(visibilitychange)|document(webkitvisibilitychange)|document(blur)';
        SOCIALBROWSER.eventOff += 'window(mouseout)|window(pagehide)|window(hashchange)|window(popstate)|window(state-change)|window(visibilitychange)|window(webkitvisibilitychange)|window(blur)';

        document.hasFocus = () => true;
        SOCIALBROWSER.__define(document, 'hidden ', false);
        setInterval(() => {
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = document.onfocusin = document.onfocusout = null;
        }, 1000);
    }

    if (SOCIALBROWSER.var.blocking.privacy.block_rtc) {
        window.webkitRTCPeerConnection = null;
        window.RTCPeerConnection = null;
    }
    if (SOCIALBROWSER.var.blocking.privacy.hide_media_devices) {
        SOCIALBROWSER.navigator.mediaDevices = navigator.mediaDevices;
        SOCIALBROWSER.__define(navigator, 'mediaDevices', {
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
        });
    }

    if (SOCIALBROWSER.var.blocking.privacy.hide_vega) {
        SOCIALBROWSER.__define(WebGLRenderingContext, 'getParameter', () => '');
        SOCIALBROWSER.__define(WebGL2RenderingContext, 'getParameter', () => '');
    }

    if (SOCIALBROWSER.session.privacy.hide_cpu || SOCIALBROWSER.var.blocking.privacy.hide_cpu) {
        SOCIALBROWSER.__define(navigator, 'hardwareConcurrency', SOCIALBROWSER.session.privacy.cpu_count);
    }
    if (SOCIALBROWSER.session.privacy.hide_memory || SOCIALBROWSER.var.blocking.privacy.hide_memory) {
        SOCIALBROWSER.__define(navigator, 'deviceMemory', SOCIALBROWSER.session.privacy.memory_count);
    }

    if (SOCIALBROWSER.var.blocking.privacy.hide_mimetypes) {
        SOCIALBROWSER.navigator.mimeTypes = navigator.mimeTypes;
        SOCIALBROWSER.__define(navigator, 'mimeTypes', {
            // 0: { type: 'application/futuresplash', suffixes: 'spl', description: 'Shockwave Flash', enabledPlugin: { name: '' } },
            // 1: { type: 'application/pdf', suffixes: 'pdf', description: '', enabledPlugin: { name: '' } },
            // 2: { type: 'application/x-google-chrome-pdf', suffixes: 'pdf', description: 'Portable Document Format', enabledPlugin: { name: '' } },
            // 3: { type: 'application/x-nacl', suffixes: '', description: 'Native Client Executable', enabledPlugin: { name: '' } },
            // 4: { type: 'application/x-pnacl', suffixes: '', description: 'Portable Native Client Executable', enabledPlugin: { name: '' } },
            // 5: { type: 'application/x-shockwave-flash', suffixes: 'swf', description: 'Shockwave Flash', enabledPlugin: { name: '' } },
            length: 0,
        });
    }
    if (SOCIALBROWSER.var.blocking.privacy.hide_pluginsxxx) {
        SOCIALBROWSER.navigator.plugins = navigator.plugins;
        SOCIALBROWSER.__define(navigator, 'plugins', {
            // 0: {
            //   0: { type: 'application/x-google-chrome-pdf', suffixes: 'pdf', description: 'Portable Document Format' },
            //   name: 'Microsoft Edge PDF Plugin',
            //   filename: 'internal-pdf-viewer',
            //   description: 'Portable Document Format',
            //   length: 1,
            // },
            // 2: {
            //   0: { type: 'application/pdf', suffixes: 'pdf', description: '' },
            //   name: 'Microsoft Edge PDF Viewer',
            //   filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
            //   description: '',
            //   length: 1,
            // },
            // 3: {
            //   0: { type: 'application/x-nacl', suffixes: '', description: 'Native Client Executable' },
            //   2: { type: 'application/x-pnacl', suffixes: '', description: 'Portable Native Client Executable' },
            //   name: 'Native Client',
            //   filename: 'internal-nacl-plugin',
            //   description: '',
            //   length: 2,
            // },
            length: 0,
            refresh: () => {},
        });
    }

    if (SOCIALBROWSER.session.privacy.hide_screen || SOCIALBROWSER.var.blocking.privacy.hide_screen) {
        SOCIALBROWSER.__define(screen, 'width', SOCIALBROWSER.session.privacy.screen_width);
        SOCIALBROWSER.__define(screen, 'height', SOCIALBROWSER.session.privacy.screen_height);
        SOCIALBROWSER.__define(screen, 'availWidth', SOCIALBROWSER.session.privacy.screen_availWidth);
        SOCIALBROWSER.__define(screen, 'availHeight', SOCIALBROWSER.session.privacy.screen_availHeight);
    }

    if (SOCIALBROWSER.session.privacy.hide_lang || SOCIALBROWSER.var.blocking.privacy.hide_lang) {
        SOCIALBROWSER.session.privacy.languages = SOCIALBROWSER.session.privacy.languages || navigator.languages;
        if (Array.isArray(SOCIALBROWSER.session.privacy.languages)) {
            SOCIALBROWSER.__define(navigator, 'languages', SOCIALBROWSER.session.privacy.languages);
            SOCIALBROWSER.__define(navigator, 'language', SOCIALBROWSER.session.privacy.languages[0]);
        } else if (typeof SOCIALBROWSER.session.privacy.languages === 'string') {
            SOCIALBROWSER.__define(navigator, 'languages', SOCIALBROWSER.session.privacy.languages.split(','));
            SOCIALBROWSER.__define(navigator, 'language', SOCIALBROWSER.session.privacy.languages.split(',')[0]);
        }
    }
    if (SOCIALBROWSER.session.privacy.hide_connection || SOCIALBROWSER.var.blocking.privacy.hide_connection) {
        SOCIALBROWSER.__define(navigator, 'connection', {
            onchange: null,
            effectiveType: SOCIALBROWSER.session.privacy.connection.effectiveType,
            rtt: SOCIALBROWSER.session.privacy.connection.rtt,
            downlink: SOCIALBROWSER.session.privacy.connection.downlink,
            saveData: false,
            type: SOCIALBROWSER.session.privacy.connection.type,
        });
    }

    if (SOCIALBROWSER.var.blocking.privacy.hide_permissions) {
        SOCIALBROWSER.navigator.permissions = navigator.permissions;
        SOCIALBROWSER.__define(navigator, 'permissions', {
            query: (permission) => {
                return new Promise((ok, err) => {
                    ok({
                        state: ['', 'granted', 'prompt', 'denied', ''][2],
                    });
                });
            },
        });
    }

    if (SOCIALBROWSER.var.blocking.privacy.hide_battery) {
        SOCIALBROWSER.__define(navigator, 'getBattery', () => {
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
        });
    }
    if (SOCIALBROWSER.var.blocking.privacy.dnt) {
        SOCIALBROWSER.__define(navigator, 'doNotTrack', '1');
    } else {
        SOCIALBROWSER.__define(navigator, 'doNotTrack', '0');
    }
};
