module.exports = function (SOCIALBROWSER) {
    SOCIALBROWSER.var.white_list.forEach((site) => {
        if (site.url.length > 2 && document.location.href.like(site.url)) {
            SOCIALBROWSER.is_white_site = true;
        }
    });

    SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));

    require(SOCIALBROWSER.files_dir + '/js/context-menu/fn.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/decode.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/window.js')(SOCIALBROWSER);

    require(SOCIALBROWSER.files_dir + '/js/context-menu/finger_print.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/custom.js')(SOCIALBROWSER);

    require(SOCIALBROWSER.files_dir + '/js/context-menu/adblock_hacking.js')(SOCIALBROWSER);

    require(SOCIALBROWSER.files_dir + '/js/context-menu/keyboard.js')(SOCIALBROWSER);

    require(SOCIALBROWSER.files_dir + '/js/context-menu/doms.js')(SOCIALBROWSER);

    require(SOCIALBROWSER.files_dir + '/js/context-menu/nodes.js')(SOCIALBROWSER);

    require(SOCIALBROWSER.files_dir + '/js/context-menu/videos.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/youtube.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/facebook.com.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/menu.js')(SOCIALBROWSER);

    require(SOCIALBROWSER.files_dir + '/js/context-menu/safty.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/mongodb.js')(SOCIALBROWSER);

    if (!SOCIALBROWSER.var.core.disabled) {
        // Load Custom Scripts
        SOCIALBROWSER.var.scripts_files.forEach((file) => {
            require(file.path)(SOCIALBROWSER);
        });

        // load user preload list
        SOCIALBROWSER.var.preload_list.forEach((p) => {
            try {
                require(p.path.replace('{dir}', SOCIALBROWSER.dir))(SOCIALBROWSER);
            } catch (error) {
                SOCIALBROWSER.log(error);
            }
        });

        document.addEventListener('DOMNodeInsertedIntoDocument', function (e) {
            SOCIALBROWSER.callEvent('newDom', e.target);
            if (e.target.querySelectorAll) {
                e.target.querySelectorAll('*').forEach((el) => {
                    SOCIALBROWSER.callEvent('newDom', el);
                });
            }
        });
        document.addEventListener('DOMNodeInserted', function (e) {
            SOCIALBROWSER.callEvent('newDom', e.target);

            if (e.target.querySelectorAll) {
                e.target.querySelectorAll('*').forEach((el) => {
                    SOCIALBROWSER.callEvent('newDom', el);
                });
            }
        });
    }

    SOCIALBROWSER.onLoad(() => {
        document.querySelectorAll('*').forEach((el) => {
            SOCIALBROWSER.callEvent('newDom', el);
        });
        // can download any lib
        if (!SOCIALBROWSER.jqueryLoaded && SOCIALBROWSER.var.blocking.javascript.allow_jquery && !window.jQuery) {
            SOCIALBROWSER.jqueryLoaded = true;
            window.$ = window.jQuery = require(SOCIALBROWSER.files_dir + '/js/jquery.js');
        }
    });

    window.addEventListener('mousedown', (e) => {
        if (SOCIALBROWSER.__options.windowType == 'view') {
            SOCIALBROWSER.call('[send-render-message]', {
                name: 'window_clicked',
                win_id: SOCIALBROWSER.remote.getCurrentWindow().id,
            });
        }
    });

    // user agent

    SOCIALBROWSER.var.customHeaderList.forEach((h) => {
        if (h.type == 'request' && document.location.href.like(h.url)) {
            h.list.forEach((v) => {
                if (v && v.name && v.name == 'User-Agent' && v.value) {
                    SOCIALBROWSER.user_agent_url = v.value;
                }
            });
        }
    });

    if (!SOCIALBROWSER.user_agent_url) {
        if (SOCIALBROWSER.session.user_agent) {
            SOCIALBROWSER.user_agent_url = SOCIALBROWSER.session.user_agent.url;
        } else {
            SOCIALBROWSER.user_agent_url = SOCIALBROWSER.currentWindow.webContents.getUserAgent() || SOCIALBROWSER.var.core.user_agent;
        }

        if (SOCIALBROWSER.user_agent_url == 'undefined') {
            SOCIALBROWSER.user_agent_url = SOCIALBROWSER.var.core.user_agent;
        }
    }

    if (!SOCIALBROWSER.user_agent_info) {
        SOCIALBROWSER.user_agent_info = SOCIALBROWSER.var.user_agent_list.find((u) => u.url == SOCIALBROWSER.user_agent_url);
        if (SOCIALBROWSER.user_agent_info) {
            if (SOCIALBROWSER.user_agent_info.vendor) {
                SOCIALBROWSER.__define(navigator, 'vendor', SOCIALBROWSER.user_agent_info.vendor);
                if (SOCIALBROWSER.user_agent_info.engine && SOCIALBROWSER.user_agent_info.engine.name === 'Chrome') {
                    let chrome = JSON.parse(
                        '{"app":{"isInstalled":false,"InstallState":{"DISABLED":"disabled","INSTALLED":"installed","NOT_INSTALLED":"not_installed"},"RunningState":{"CANNOT_RUN":"cannot_run","READY_TO_RUN":"ready_to_run","RUNNING":"running"}},"runtime":{"OnInstalledReason":{"CHROME_UPDATE":"chrome_update","INSTALL":"install","SHARED_MODULE_UPDATE":"shared_module_update","UPDATE":"update"},"OnRestartRequiredReason":{"APP_UPDATE":"app_update","OS_UPDATE":"os_update","PERIODIC":"periodic"},"PlatformArch":{"ARM":"arm","ARM64":"arm64","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformNaclArch":{"ARM":"arm","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformOs":{"ANDROID":"android","CROS":"cros","LINUX":"linux","MAC":"mac","OPENBSD":"openbsd","WIN":"win"},"RequestUpdateCheckStatus":{"NO_UPDATE":"no_update","THROTTLED":"throttled","UPDATE_AVAILABLE":"update_available"}}}',
                    );
                    chrome.csi = () => {};
                    chrome.loadTimes = () => {};
                    SOCIALBROWSER.__define(window, 'chrome', chrome);
                } else if (SOCIALBROWSER.user_agent_info.engine && SOCIALBROWSER.user_agent_info.engine.name === 'Edge') {
                    let chrome = JSON.parse(
                        '{"appPinningPrivate":{},"authPrivate":{"onServiceAuthStateChanged":{},"onSignInStateChanged":{},"AccountType":{"AAD":"AAD","MSA":"MSA","NO_ACCOUNT":"NO_ACCOUNT","UNSUPPORTED_SOVEREIGNTY":"UNSUPPORTED_SOVEREIGNTY"},"RegionScope":{"ARLINGTON":"ARLINGTON","BLACKFOREST":"BLACKFOREST","DOD":"DOD","DOJ":"DOJ","FAIRFAX":"FAIRFAX","GALLATIN":"GALLATIN","GCC_MODERATE":"GCC_MODERATE","GLOBAL":"GLOBAL","MAX_VALUE":"MAX_VALUE","OTHER":"OTHER","OTHER_US_GOV":"OTHER_US_GOV","UNKNOWN":"UNKNOWN"}},"ntpSettingsPrivate":{"onConfigDataChanged":{},"onPrefsChanged":{},"ControlledBy":{"DEVICE_POLICY":"DEVICE_POLICY","EXTENSION":"EXTENSION","OWNER":"OWNER","PRIMARY_USER":"PRIMARY_USER","USER_POLICY":"USER_POLICY"},"Enforcement":{"ENFORCED":"ENFORCED","RECOMMENDED":"RECOMMENDED"},"PrefType":{"BOOLEAN":"BOOLEAN","DICTIONARY":"DICTIONARY","LIST":"LIST","NUMBER":"NUMBER","STRING":"STRING","URL":"URL"}},"runtime":{"OnInstalledReason":{"CHROME_UPDATE":"chrome_update","INSTALL":"install","SHARED_MODULE_UPDATE":"shared_module_update","UPDATE":"update"},"OnRestartRequiredReason":{"APP_UPDATE":"app_update","OS_UPDATE":"os_update","PERIODIC":"periodic"},"PlatformArch":{"ARM":"arm","ARM64":"arm64","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformNaclArch":{"ARM":"arm","ARM64":"arm64","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformOs":{"ANDROID":"android","CROS":"cros","LINUX":"linux","MAC":"mac","OPENBSD":"openbsd","WIN":"win"},"RequestUpdateCheckStatus":{"NO_UPDATE":"no_update","THROTTLED":"throttled","UPDATE_AVAILABLE":"update_available"}},"shellIntegrationPrivate":{},"embeddedSearch":{"searchBox":{"rtl":false,"isFocused":false,"isKeyCaptureEnabled":false},"newTabPage":{"isInputInProgress":false,"mostVisited":[{"rid":1,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://wordpress.com/"},{"rid":2,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://javfinder.la/movie/watch/tre-148-b-prestige-losing-virginity-best-vol-05-the-best-first-experience-with-the-best-body-and-great-support-part-b.html"},{"rid":3,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://ae.godaddy.com/whois/results.aspx?checkAvail=1&domain=spicekingdom.com.eg&domainName=spicekingdom.com.eg"},{"rid":4,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://www.office.com/"}],"mostVisitedAvailable":true,"ntpTheme":{"usingDefaultTheme":true,"backgroundColorRgba":[247,247,247,255],"textColorRgba":[0,0,0,255],"textColorLightRgba":[102,102,102,255],"alternateLogo":false,"themeId":"","themeName":"","customBackgroundDisabledByPolicy":false,"customBackgroundConfigured":false,"isNtpBackgroundDark":false,"useTitleContainer":false,"iconBackgroundColor":[241,243,244,255],"useWhiteAddIcon":false,"logoColor":[238,238,238,255],"colorId":-1,"searchBox":{"bg":[255,0,0,255],"icon":[255,0,0,255],"iconSelected":[255,0,0,255],"placeholder":[255,0,0,255],"resultsBg":[255,0,0,255],"resultsBgHovered":[255,0,0,255],"resultsBgSelected":[255,0,0,255],"resultsDim":[255,0,0,255],"resultsDimSelected":[255,0,0,255],"resultsText":[255,0,0,255],"resultsTextSelected":[255,0,0,255],"resultsUrl":[255,0,0,255],"resultsUrlSelected":[255,0,0,255],"text":[255,0,0,255]}},"themeBackgroundInfo":{"usingDefaultTheme":true,"backgroundColorRgba":[247,247,247,255],"textColorRgba":[0,0,0,255],"textColorLightRgba":[102,102,102,255],"alternateLogo":false,"themeId":"","themeName":"","customBackgroundDisabledByPolicy":false,"customBackgroundConfigured":false,"isNtpBackgroundDark":false,"useTitleContainer":false,"iconBackgroundColor":[241,243,244,255],"useWhiteAddIcon":false,"logoColor":[238,238,238,255],"colorId":-1,"searchBox":{"bg":[255,0,0,255],"icon":[255,0,0,255],"iconSelected":[255,0,0,255],"placeholder":[255,0,0,255],"resultsBg":[255,0,0,255],"resultsBgHovered":[255,0,0,255],"resultsBgSelected":[255,0,0,255],"resultsDim":[255,0,0,255],"resultsDimSelected":[255,0,0,255],"resultsText":[255,0,0,255],"resultsTextSelected":[255,0,0,255],"resultsUrl":[255,0,0,255],"resultsUrlSelected":[255,0,0,255],"text":[255,0,0,255]}}}}}',
                    );
                    chrome.appPinningPrivate = {
                        getPins: () => {},
                        pinPage: () => {},
                    };
                    chrome.csi = () => {};
                    chrome.loadTimes = () => {};
                    SOCIALBROWSER.__define(window, 'chrome', chrome);
                } else if (SOCIALBROWSER.user_agent_info.engine && SOCIALBROWSER.user_agent_info.engine.name === 'Firefox') {
                    window.mozRTCIceCandidate = window.RTCIceCandidate;
                    window.mozRTCPeerConnection = window.RTCPeerConnection;
                    window.mozRTCSessionDescription = window.RTCSessionDescription;
                    window.mozInnerScreenX = 0;
                    window.mozInnerScreenY = 74;
                }
            }
            if (SOCIALBROWSER.user_agent_info.oscpu) {
                SOCIALBROWSER.__define(navigator, 'oscpu', SOCIALBROWSER.user_agent_info.oscpu);
            }
            if (SOCIALBROWSER.user_agent_info.platform) {
                SOCIALBROWSER.__define(navigator, 'platform', SOCIALBROWSER.user_agent_info.platform);
            }
            if (SOCIALBROWSER.user_agent_info.productSub) {
                SOCIALBROWSER.__define(navigator, 'productSub', SOCIALBROWSER.user_agent_info.productSub);
            }
        }
    }

    if (SOCIALBROWSER.var.blocking.privacy.enable_finger_protect && SOCIALBROWSER.var.blocking.privacy.mask_user_agent) {
        if (!SOCIALBROWSER.user_agent_url.like('*[xx-*')) {
            SOCIALBROWSER.user_agent_url = SOCIALBROWSER.user_agent_url.replace(') ', ') [xx-' + SOCIALBROWSER.guid() + '] ');
        }
    }

    SOCIALBROWSER.__define(navigator, 'userAgent', SOCIALBROWSER.user_agent_url);
    SOCIALBROWSER.userAgent = navigator.userAgent;

    SOCIALBROWSER.on('$download_item', (e, dl) => {
        SOCIALBROWSER.showDownloads(` ${dl.status} ${((dl.received / dl.total) * 100).toFixed(2)} %  ${dl.name} ( ${(dl.received / 1000000).toFixed(2)} MB / ${(dl.total / 1000000).toFixed(2)} MB )`);
    });

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
        navigator.storage.estimate = function () {
            return new Promise((resolve, reject) => {
                resolve({
                    usage: 100000,
                    quota: 12000000000,
                });
            });
        };
        window.localStorage = window.localStorage || function () {};
        window.location.setItem = function () {};
        window.location.removeItem = function () {};
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
};
