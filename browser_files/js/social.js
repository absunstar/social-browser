var socialTabsDom = document.querySelector('.social-tabs');
var socialTabs = new SocialTabs();
var currentTabId = null;
var opendTabList = [];
let $addressbar = $('.address-input .url');

const updateOnlineStatus = () => {
    ipc('online-status', navigator.onLine ? { status: true } : { status: false });
};

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function ipc(name, message) {
    SOCIALBROWSER.currentTabInfo = SOCIALBROWSER.getCurrentTabInfo();
    message = message || {};
    message.tabInfo = SOCIALBROWSER.currentTabInfo;
    message.tabID = message.tabID || SOCIALBROWSER.currentTabInfo.id;
    message.url = message.url || SOCIALBROWSER.currentTabInfo.url;
    message.title = message.title || '';
    message.iconURL = message.iconURL || SOCIALBROWSER.currentTabInfo.iconURL;
    message.windowID = message.windowID || SOCIALBROWSER.currentTabInfo.windowID;
    message.childID = message.childID || SOCIALBROWSER.currentTabInfo.childProcessID;
    message.mainWindowID = message.mainWindowID || SOCIALBROWSER.currentTabInfo.mainWindowID;

    SOCIALBROWSER.ipc(name, message);
    if (name == '[window-action]' && !message.name.like('*screen*|*external*')) {
        SOCIALBROWSER.clickCurrentTab();
    }
}

function sendToMain(message) {
    ipc('[send-render-message]', message);
}

document.querySelectorAll('#body').forEach((el) => {
    el.addEventListener('mousemove', () => {
        SOCIALBROWSER.clickCurrentTab();
    });
});

function goURL(e) {
    if (e.keyCode == 13) {
        url = $addressbar.text();
        if (url.indexOf('://') === -1) {
            if (url.indexOf('.') !== -1) {
                url = 'http://' + url;
            } else {
                url = 'https://google.com/search?q=' + url;
            }
        }

        ipc('[update-view-url]', {
            url: url,
        });
    }
}

function add_input_menu(node) {
    if (!node) return;

    if (node.nodeName === 'INPUT' || node.contentEditable == true) {
        let text = getSelection().toString();

        SOCIALBROWSER.menuList.push({
            label: 'Undo',
            role: 'undo',
        });
        SOCIALBROWSER.menuList.push({
            label: 'Redo',
            role: 'redo',
        });
        SOCIALBROWSER.menuList.push({
            type: 'separator',
        });
        SOCIALBROWSER.menuList.push({
            label: 'Cut',
            role: 'cut',
            enabled: text.length > 0,
        });

        SOCIALBROWSER.menuList.push({
            label: 'Copy',
            role: 'copy',
            enabled: text.length > 0,
        });

        SOCIALBROWSER.menuList.push({
            label: 'Paste',
            role: 'paste',
        });
        SOCIALBROWSER.menuList.push({
            label: 'Paste and Go',
            click() {
                document.execCommand('paste');
                goURL();
            },
        });
        SOCIALBROWSER.menuList.push({
            label: 'Delete',
            role: 'delete',
        });
        SOCIALBROWSER.menuList.push({
            type: 'separator',
        });
        SOCIALBROWSER.menuList.push({
            label: 'Select All',
            role: 'selectall',
        });

        SOCIALBROWSER.menuList.push({
            type: 'separator',
        });

        return;
    } else {
        add_input_menu(node.parentNode);
    }
}

document.addEventListener(
    'keydown',
    (e) => {
        //e.preventDefault();
        //e.stopPropagation();

        if (e.keyCode == 123 /*f12*/) {
            sendToMain({
                name: 'DeveloperTools',
                action: true,
            });
        } else if (e.keyCode == 122 /*f11*/) {
            if (!full_screen) {
                sendToMain({
                    name: 'full_screen',
                    action: true,
                });
                full_screen = true;
            } else {
                sendToMain({
                    name: '!full_screen',
                    action: true,
                });
                full_screen = false;
            }
        } else if (e.keyCode == 121 /*f10*/) {
            sendToMain({
                name: 'service worker',
            });
        } else if (e.keyCode == 117 /*f6*/) {
            ipc('[show-addressbar]');
        } else if (e.keyCode == 70 /*f*/) {
            if (e.ctrlKey == true) {
                sendToMain({
                    name: 'show in-page-find',
                    action: true,
                });
            }
        } else if (e.keyCode == 115 /*f4*/) {
            if (e.ctrlKey == true) {
                sendToMain({
                    name: 'close tab',
                });
            }
        } else if (e.keyCode == 107 /*+*/) {
            if (e.ctrlKey == true) {
                ipc('[window-action]', { name: 'window-zoom+' });
            }
        } else if (e.keyCode == 109 /*-*/) {
            if (e.ctrlKey == true) {
                ipc('[window-action]', { name: 'window-zoom-' });
            }
        } else if (e.keyCode == 48 /*0*/) {
            if (e.ctrlKey == true) {
                ipc('[window-action]', { name: 'window-zoom' });
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
        } else if (e.keyCode == 69 && e.ctrlKey == true /*E*/) {
            ipc('[edit-window]');
        } else if (e.keyCode == 27 /*escape*/) {
            sendToMain({
                name: 'escape',
            });
        } else if (e.keyCode == 78 /*n*/ || e.keyCode == 84 /*t*/) {
            if (e.ctrlKey == true) {
                ipc('[open new tab]', {
                    mainWindowID: SOCIALBROWSER.window.id,
                });
            }
        } else if (e.keyCode == 116 /*f5*/) {
            if (e.ctrlKey === true) {
                ipc('[window-reload-hard]', {
                    origin: new URL($('#' + currentTabId).attr('url')).origin,
                });
            } else {
                ipc('[window-reload]', {
                    action: true,
                });
            }
        }

        return false;
    },
    true,
);

function showSettingMenu() {
    SOCIALBROWSER.window.show();
    SOCIALBROWSER.menuList = [];

    SOCIALBROWSER.menuList.push({
        label: 'Show Setting',
        click: () =>
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            }),
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    let tools = {
        label: 'Social Tools',
        click: () => {
            ipc('[open new popup]', {
                show: true,
                url: 'https://tools.social-browser.com/tools',
                title: 'Social Browser Tools',
                partition: 'persist:social',
                center: true,
                vip: true,
                alwaysOnTop: true,
                maximize: false,
            });
        },
        iconURL: 'http://127.0.0.1:60080/images/tools.png',
    };

    SOCIALBROWSER.menuList.push(tools);
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    if (SOCIALBROWSER.var.core.id.like('*developer*')) {
        SOCIALBROWSER.menuList.push({
            label: 'Check Update',
            iconURL: 'http://127.0.0.1:60080/images/chromium.png',
            click: () =>
                sendToMain({
                    name: '[run-window-update]',
                }),
        });
        SOCIALBROWSER.menuList.push({
            type: 'separator',
        });
    }
    if (SOCIALBROWSER.var.core.brand.like(SOCIALBROWSER.from123('2458765245381663'))) {
        SOCIALBROWSER.menuList.push({
            label: 'Open Browser Site',
            iconURL: 'http://127.0.0.1:60080/images/blue.png',
            click: () =>
                ipc('[open new tab]', {
                    url: SOCIALBROWSER.from123('431932754619268325738667413876522539275746594262417837742558825747148591'),
                    title: 'Browser',
                    mainWindowID: SOCIALBROWSER.window.id,
                }),
        });
    } else {
        SOCIALBROWSER.menuList.push({
            label: 'Open Browser Site',
            iconURL: 'http://127.0.0.1:60080/images/logo.png',
            click: () =>
                ipc('[open new tab]', {
                    url: 'https://social-browser.com/',
                    title: 'Browser',
                    mainWindowID: SOCIALBROWSER.window.id,
                }),
        });
    }

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Downloads',
        iconURL: 'http://127.0.0.1:60080/images/downloads.png',
        click: () =>
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/downloads',
                title: 'Dwonloads',
                mainWindowID: SOCIALBROWSER.window.id,
                vip: true,
            }),
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    let arr2 = [];

    SOCIALBROWSER.var.bookmarks.forEach((b) => {
        arr2.push({
            label: b.title,
            sublabel: b.url,
            iconURL: b.favicon,
            click: () =>
                ipc('[open new tab]', {
                    url: b.url,
                    title: b.title,
                }),
        });
    });

    let bookmark = {
        label: 'Bookmarks',
        iconURL: 'http://127.0.0.1:60080/images/bookmark.png',
        type: 'submenu',
        submenu: arr2,
    };

    SOCIALBROWSER.menuList.push(bookmark);
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    SOCIALBROWSER.menuList.push({
        label: 'Reload Page',
        iconURL: 'http://127.0.0.1:60080/images/reload.png',
        accelerator: 'F5',
        click: () =>
            ipc('[window-reload]', {
                action: true,
            }),
    });
    SOCIALBROWSER.menuList.push({
        label: 'Hard Reload Page',
        iconURL: 'http://127.0.0.1:60080/images/reload.png',
        accelerator: 'CommandOrControl+F5',
        click: () =>
            ipc('[window-reload-hard]', {
                origin: new URL($('#' + currentTabId).attr('url')).origin,
            }),
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Zoom +',
        iconURL: 'http://127.0.0.1:60080/images/zoom-in.png',
        accelerator: 'CommandOrControl+numadd',
        click: () => {
            ipc('[window-zoom+]');
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Zoom OFF',
        iconURL: 'http://127.0.0.1:60080/images/zoom.png',
        accelerator: 'CommandOrControl+0',
        click: () => ipc('[window-zoom]'),
    });
    SOCIALBROWSER.menuList.push({
        label: 'Zoom -',
        iconURL: 'http://127.0.0.1:60080/images/zoom-out.png',
        accelerator: 'CommandOrControl+numsub',
        click: () => ipc('[window-zoom-]'),
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Edit Page Content',
        iconURL: 'http://127.0.0.1:60080/images/edit.png',
        accelerator: 'CommandOrControl+E',
        click: () => ipc('[edit-window]'),
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Audio ON / OFF',
        iconURL: 'http://127.0.0.1:60080/images/audio.png',
        accelerator: 'CommandOrControl+1',
        click: () => ipc('[window-action]', { name: 'toggle-window-audio' }),
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    SOCIALBROWSER.menuList.push({
        label: 'Close All Browser Services',
        iconURL: 'http://127.0.0.1:60080/images/close.png',
        click: () => SOCIALBROWSER.ws({ type: '[close]' }),
    });

    ipc('[show-menu]', {
        windowID: SOCIALBROWSER.window.id,
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
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, icoiconURLn: m3.iconURL })),
            })),
        })),
    });
}

function showBookmarksMenu() {
    SOCIALBROWSER.window.show();
    SOCIALBROWSER.menuList = [];
    SOCIALBROWSER.menuList.push({
        label: 'Bookmark current tab',
        iconURL: 'http://127.0.0.1:60080/images/star.png',
        click: () => ipc('[add-to-bookmark]'),
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    SOCIALBROWSER.menuList.push({
        label: 'Bookmark Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#bookmark',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    SOCIALBROWSER.var.bookmarks.forEach((b) => {
        SOCIALBROWSER.menuList.push({
            label: b.title,
            sublabel: b.url,
            iconURL: b.favicon,
            click: () =>
                ipc('[open new tab]', {
                    url: b.url,
                    title: b.title,
                }),
        });
    });

    ipc('[show-menu]', {
        windowID: SOCIALBROWSER.window.id,
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

SOCIALBROWSER.showTempMails = function () {
    ipc('[open new popup]', {
        show: true,
        url: 'https://emails.social-browser.com/vip',
        partition: 'persist:social',
        trusted: true,
        vip: true,
        center: true,
        alwaysOnTop: true,
    });
};

SOCIALBROWSER.showSocialTools = function () {
    ipc('[open new popup]', {
        show: true,
        url: 'https://tools.social-browser.com/tools',
        partition: 'persist:social',
        trusted: true,
        vip: true,
        center: true,
        alwaysOnTop: true,
    });
};

SOCIALBROWSER.showScriptListMenu = function () {
    SOCIALBROWSER.window.show();
    SOCIALBROWSER.menuList = [];

    SOCIALBROWSER.menuList.push({
        label: 'User Scripts Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#scripts',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.var.scriptList
        .filter(
            (s) => s.show && !SOCIALBROWSER.currentTabInfo.url.like('*127.0.0.1:60080*') && SOCIALBROWSER.currentTabInfo.url.like(s.allowURLs) && !SOCIALBROWSER.currentTabInfo.url.like(s.blockURLs),
        )
        .forEach((script) => {
            SOCIALBROWSER.menuList.push({
                label: script.title,
                iconURL: 'http://127.0.0.1:60080/images/code.png',
                click: () => {
                    SOCIALBROWSER.ws({ type: '[run-user-script]', tabInfo: SOCIALBROWSER.currentTabInfo, script: script });
                },
            });
        });

    ipc('[show-menu]', {
        windowID: SOCIALBROWSER.window.id,
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
};

SOCIALBROWSER.showUserProxyMenu = function () {
    SOCIALBROWSER.window.show();
    SOCIALBROWSER.menuList = [];

    SOCIALBROWSER.menuList.push({
        label: 'Proxy List Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#proxyList',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    SOCIALBROWSER.menuList.push({
        label: 'Stop Proxy',
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click: () => {
            SOCIALBROWSER.ws({ type: '[change-user-proxy]', partition: SOCIALBROWSER.currentTabInfo.partition, proxy: null });
            setTimeout(() => {
                ipc('[window-reload]');
            }, 1000 * 1);
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.var.proxy_list.forEach((proxy) => {
        SOCIALBROWSER.menuList.push({
            label: proxy.url || proxy.ip + ':' + proxy.port,
            iconURL: 'http://127.0.0.1:60080/images/proxy.png',
            click: () => {
                SOCIALBROWSER.ws({ type: '[change-user-proxy]', partition: SOCIALBROWSER.currentTabInfo.partition, proxy: proxy });
                setTimeout(() => {
                    ipc('[window-reload]');
                }, 1000 * 1);
            },
        });
    });

    ipc('[show-menu]', {
        windowID: SOCIALBROWSER.window.id,
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
};
SOCIALBROWSER.showUserAgentMenu = function () {
    SOCIALBROWSER.window.show();
    SOCIALBROWSER.menuList = [];

    SOCIALBROWSER.menuList.push({
        label: 'UserAgent List Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#userAgntList',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    SOCIALBROWSER.menuList.push({
        label: 'Remove User Agent',
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click: () => {
            SOCIALBROWSER.ws({ type: '[change-user-agent]', partition: SOCIALBROWSER.currentTabInfo.partition, defaultUserAgent: null });
            setTimeout(() => {
                ipc('[window-reload]');
            }, 1000 * 0);
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.var.userAgentList.forEach((userAgent) => {
        SOCIALBROWSER.menuList.push({
            label: userAgent.name,
            iconURL: 'http://127.0.0.1:60080/images/user-agent.png',
            click: () => {
                SOCIALBROWSER.ws({ type: '[change-user-agent]', partition: SOCIALBROWSER.currentTabInfo.partition, defaultUserAgent: userAgent });
                setTimeout(() => {
                    ipc('[window-reload]');
                }, 1000 * 0);
            },
        });
    });

    ipc('[show-menu]', {
        windowID: SOCIALBROWSER.window.id,
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
};

SOCIALBROWSER.showWindowsMenu = function () {
    SOCIALBROWSER.window.show();

    SOCIALBROWSER.menuList = [];

    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ Random - PC - Window ]',
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        sublabel: SOCIALBROWSER.currentTabInfo.url,
        click: () => {
            ipc('[window-action]', { name: 'new-window' });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ Random - Mobile - Window ]',
        sublabel: SOCIALBROWSER.currentTabInfo.url,
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        click: () => {
            ipc('[window-action]', { name: 'new-mobile-window' });
        },
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ Random - PC - Ghost - Window ]',
        sublabel: SOCIALBROWSER.currentTabInfo.url,
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        click: () => {
            ipc('[window-action]', { name: 'new-ghost-window' });
        },
    });

    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ Random - Mobile - Ghost  - Window ]',
        sublabel: SOCIALBROWSER.currentTabInfo.url,
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        click: () => {
            ipc('[window-action]', { name: 'new-ghost-mobile-window' });
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ Ads - Window ]',
        sublabel: SOCIALBROWSER.currentTabInfo.url,
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        click: () => {
            ipc('[window-action]', { name: 'new-ads-window' });
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ Google - Chrome Browser ] ',
        sublabel: SOCIALBROWSER.currentTabInfo.url,
        iconURL: 'http://127.0.0.1:60080/images/chrome.png',
        click: () => {
            ipc('[window-action]', { name: 'open-in-chrome' });
        },
    });

    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ Google - Chrome Browser ] ( Shared Session and User Data )',
        sublabel: SOCIALBROWSER.currentTabInfo.url,
        iconURL: 'http://127.0.0.1:60080/images/chrome.png',
        click: () => {
            ipc('[window-action]', { name: 'open-in-chrome-session' });
        },
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ External - Browser ] ',
        sublabel: SOCIALBROWSER.currentTabInfo.url,
        iconURL: 'http://127.0.0.1:60080/images/html.png',
        click: () => {
            ipc('[window-action]', { name: 'open-external', url: SOCIALBROWSER.currentTabInfo.url });
        },
    });

    ipc('[show-menu]', {
        windowID: SOCIALBROWSER.window.id,
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
};

socialTabs.init(socialTabsDom, {
    tabOverlapDistance: 10,
    minWidth: 35,
    maxWidth: 270,
});

function setURL(url, url2) {
    /*!$addressbar.is(':focus')*/
    if (url) {
        try {
            url = decodeURI(url);
        } catch (error) {
            console.log(error, url);
        }
        $addressbar.text(url.replace('http://', '').replace('https://', ''));
        $addressbar.attr('title', url2);
    } else {
        $addressbar.text('');
        $addressbar.attr('title', '');
    }
}

function showAddressBar() {
    $('.social-address-bar').show();
}

function hideAddressBar() {
    $('.social-address-bar').hide();
}

function showSocialTabs() {
    $('.social-tabs').show();
    $('.social-address-bar').show();
    socialTabs.layoutTabs();
    socialTabs.fixZIndexes();
    socialTabs.setupDraggabilly();
}

function hideSocialTabs() {
    $('.social-tabs').hide();
    $('.social-address-bar').hide();
    socialTabs.layoutTabs();
    socialTabs.fixZIndexes();
    socialTabs.setupDraggabilly();
}

function handleURL(u) {
    if (u.indexOf('://') !== -1) {
        return u;
    }

    if (u.indexOf('.') !== -1) {
        u = 'http://' + u;
    } else {
        u = 'https://google.com/search?q=' + u;
    }

    return u;
}

function showURL(u) {
    u = u || $('#' + currentTabId).attr('url');
    ipc('[show-addressbar]', {
        url: u,
    });
}

$('.social-close').click(() => {
    ExitSocialWindow();
});
$('.social-maxmize').click(() => {
    ipc('[browser-message]', { name: 'maxmize', windowID: SOCIALBROWSER.window.id });
});
$('.social-minmize').click(() => {
    ipc('[browser-message]', { name: 'minmize', windowID: SOCIALBROWSER.window.id });
});

socialTabsDom.addEventListener('activeTabChange', ({ detail }) => {
    currentTabId = detail.tabEl.id;
    SOCIALBROWSER.currentTabInfo = SOCIALBROWSER.getCurrentTabInfo();

    ipc('[show-view]', {
        x: 0,
        y: 0,
        width: document.width,
        height: document.height,
        tabID: currentTabId,
        mainWindowID: SOCIALBROWSER.window.id,
    });

    $('#user_name').html($('#' + currentTabId).attr('user_name'));

    if (!$('#' + currentTabId).attr('forward')) {
        $('.go-forward i').css('color', '#9E9E9E');
    } else {
        $('.go-forward i').css('color', '#4caf50');
    }
    if (!$('#' + currentTabId).attr('back')) {
        $('.go-back i').css('color', '#9E9E9E');
    } else {
        $('.go-back i').css('color', '#4caf50');
    }

    if ($('#' + currentTabId).attr('webaudio') == 'true') {
        $('.Page-audio i').css('color', '#4caf50');
    } else {
        $('.Page-audio i').css('color', '#f44336');
    }

    if ($('#' + currentTabId).attr('url')) {
        $('.address-input .http').css('display', 'none');
        $('.address-input .https').css('display', 'none');
        $('.address-input .file').css('display', 'none');
        $('.address-input .ftp').css('display', 'none');
        $('.address-input .browser').css('display', 'none');

        $('.address-input .https').html('');
        $('.address-input .http').html('');
        $('.address-input .file').html('');
        $('.address-input .ftp').html('');
        $('.address-input .browser').html('');

        if (
            $('#' + currentTabId)
                .attr('url')
                .like('http://127.0.0.1:60080*|browser*')
        ) {
            $('.address-input .browser').html('browser');
            $('.address-input .browser').css('display', 'inline-block');
            url = $('#' + currentTabId).attr('url');
            let arr = url.split('/');
            setURL(arr[arr.length - 1], url);
        } else {
            let protocol = '';
            let url = '';
            if (
                $('#' + currentTabId)
                    .attr('url')
                    .like('https*')
            ) {
                protocol = 'HTTPS';
                $('.address-input .https').html(protocol);
                $('.address-input .https').css('display', 'inline-block');
            } else if (
                $('#' + currentTabId)
                    .attr('url')
                    .like('http*')
            ) {
                protocol = 'http';
                $('.address-input .http').html(protocol);
                $('.address-input .http').css('display', 'inline-block');
            } else if (
                $('#' + currentTabId)
                    .attr('url')
                    .like('ftp*')
            ) {
                protocol = 'ftp';
                $('.address-input .ftp').html(protocol);
                $('.address-input .ftp').css('display', 'inline-block');
            } else if (
                $('#' + currentTabId)
                    .attr('url')
                    .like('file*')
            ) {
                protocol = 'file';
                $('.address-input .file').html(protocol);
                $('.address-input .file').css('display', 'inline-block');
            } else if (
                $('#' + currentTabId)
                    .attr('url')
                    .like('browser*')
            ) {
                protocol = 'browser';
                $('.address-input .browser').html(protocol);
                $('.address-input .browser').css('display', 'inline-block');
            }

            if (protocol) {
                url = $('#' + currentTabId)
                    .attr('url')
                    .replace(protocol + '://', '');
            } else {
                url = $('#' + currentTabId).attr('url');
            }

            $('.address-input .protocol').html(protocol);
            handleUrlText();
        }
    }
});

socialTabsDom.addEventListener('tabAdd', ({ detail }) => {
    currentTabId = detail.tabEl.id;
    if (currentTabId && currentTabId != null && currentTabId.length > 0) {
        opendTabList.push({
            id: currentTabId,
        });
        const $id = $('#' + currentTabId);
        ipc('[create-new-view]', {
            ...detail.tabProperties,
            x: window.screenLeft,
            y: window.screenTop + 70,
            width: document.width,
            height: document.height,
            tabID: currentTabId,
            mainWindowID: SOCIALBROWSER.window.id,
        });

        if (!$id.attr('url') || $id.attr('url').like('*newTab')) {
        }
    }
});

socialTabsDom.addEventListener('tabRemove', ({ detail }) => {
    currentTabId = detail.id;

    ipc('[close-view]', {
        tabID: detail.id,
    });
});

function renderNewTabData(op) {
    if (!op) {
        return;
    }

    if (typeof op === 'string') {
        op = op.split('...').join('\\');
        op = {
            url: op,
        };
    }

    if (op.url && !op.url.like('*://*')) {
        op.url = 'http://' + op.url;
    }

    op = {
        url: '',
        title: null,
        ...op,
    };

    let tab = {
        ...op,
        id: 'tab_' + new Date().getTime(),
        title: op.title || op.url,
        user_name: op.user_name || op.partition,
        iconURL: 'browser://images/loading-white.gif',
        mainWindowID: SOCIALBROWSER.window.id,
    };
    socialTabs.addTab(tab);
    // console.log(tab);
}

SOCIALBROWSER.on('[open new tab]', (event, data) => {
    renderNewTabData(data);
});
SOCIALBROWSER.on('[send-render-message]', (event, data) => {
    renderMessage(data);
});
SOCIALBROWSER.on('[update-tab-properties]', (event, data) => {
    if (data.tabID) {
        let tab1 = document.querySelector('#' + data.tabID);
        if (tab1) {
            tab1.setAttribute('iconURL', data.iconURL);
            $('#' + data.tabID + ' .social-tab-favicon').css('background-image', 'url(' + data.iconURL + ')');
            tab1.setAttribute('windowID', data.windowID);
            tab1.setAttribute('childProcessID', data.childProcessID);
            tab1.setAttribute('mainWindowID', data.mainWindowID);
            tab1.setAttribute('forward', data.forward);
            tab1.setAttribute('back', data.back);
            tab1.setAttribute('webaudio', data.webaudio);
            tab1.setAttribute('proxy', data.proxy);
            tab1.setAttribute('url', data.url);
            tab1.setAttribute('userAgentURL', data.userAgentURL);
        }

        if (data.title) {
            $('#' + data.tabID + ' .social-tab-title p').text(data.title);
            $('#' + data.tabID).attr('title', data.title);
            let p = document.querySelector('#' + data.tabID + ' .social-tab-title p');
            if (p) {
                if (data.title.test(/^[a-zA-Z\-\u0590-\u05FF\0-9\^@_:\?\[\]~<>\{\}\|\\ ]+$/)) {
                    p.style.direction = 'ltr';
                } else {
                    p.style.direction = 'rtl';
                }
            }
        }
    }

    if (socialTabs.tabEls.length === 2 && !SOCIALBROWSER.showViewDone && !SOCIALBROWSER.window.isMinimized() && SOCIALBROWSER.window.isVisible()) {
        ipc('[show-view]', {
            x: 0,
            y: 0,
            width: document.width,
            height: document.height,
            tabID: currentTabId,
            mainWindowID: SOCIALBROWSER.window.id,
        });
        SOCIALBROWSER.showViewDone = true;
        SOCIALBROWSER.window.show();
        SOCIALBROWSER.window.setAlwaysOnTop(true);
        SOCIALBROWSER.window.setAlwaysOnTop(false);
    }

    if (data.tabID && data.tabID == currentTabId && data.url) {
        if (!data.forward) {
            $('.go-forward i').css('color', '#9E9E9E');
        } else {
            $('.go-forward i').css('color', '#4caf50');
        }
        if (!data.back) {
            $('.go-back i').css('color', '#9E9E9E');
        } else {
            $('.go-back i').css('color', '#4caf50');
        }

        if (data.webaudio) {
            $('.Page-audio i').css('color', '#4caf50');
        } else {
            $('.Page-audio i').css('color', '#f44336');
        }

        $('.address-input .http').css('display', 'none');
        $('.address-input .https').css('display', 'none');
        $('.address-input .file').css('display', 'none');
        $('.address-input .ftp').css('display', 'none');
        $('.address-input .browser').css('display', 'none');

        $('.address-input .https').html('');
        $('.address-input .http').html('');
        $('.address-input .file').html('');
        $('.address-input .ftp').html('');
        $('.address-input .browser').html('');

        if (data.url.like('http://127.0.0.1:60080*|browser*')) {
            $('.address-input .browser').html('browser');
            $('.address-input .browser').css('display', 'inline-block');
            url = $('#' + currentTabId).attr('url');
            let arr = url.split('/');
            setURL(arr[arr.length - 1], url);
        } else {
            let protocol = '';
            let url = '';
            try {
                data.url = decodeURI(data.url);
            } catch (error) {
                console.log(error, data.url);
            }
            if (data.url.like('https*')) {
                protocol = 'HTTPS';
                // var parser = document.createElement('a')
                // parser.href = data.url;
                $('.address-input .https').html(protocol);
                $('.address-input .https').css('display', 'inline-block');
            } else if (data.url.like('http*')) {
                protocol = 'http';
                $('.address-input .http').html(protocol);
                $('.address-input .http').css('display', 'inline-block');
            } else if (data.url.like('ftp*')) {
                protocol = 'ftp';
                $('.address-input .ftp').html(protocol);
                $('.address-input .ftp').css('display', 'inline-block');
            } else if (data.url.like('file*')) {
                protocol = 'file';
                $('.address-input .file').html(protocol);
                $('.address-input .file').css('display', 'inline-block');
            } else if (data.url.like('browser*')) {
                protocol = 'browser';
                $('.address-input .browser').html(protocol);
                $('.address-input .browser').css('display', 'inline-block');
            }

            if (protocol) {
                url = data.url.replace(protocol + '://', '');
            } else {
                url = data.url;
            }

            $('.address-input .protocol').html(protocol);
            handleUrlText();
        }
    }
});
function renderMessage(cm) {
    if (!cm) {
        return;
    } else if (cm.name == '[remove-tab]') {
        socialTabs.removeTab(socialTabs.removeTab(socialTabsDom.querySelector('#' + cm.tabID)));
    } else if (cm.name == 'set-setting') {
        for (let k of Object.keys(cm.var)) {
            SOCIALBROWSER.var[k] = cm.var[k];
        }
    } else if (cm.name == '[show-browser-setting]') {
        renderNewTabData({
            url: 'http://127.0.0.1:60080/setting',
            session: { name: 'setting', display: 'setting' },
            windowType: 'view',
            vip: true,
        });
    } else if (cm.name == '[download-link]') {
        ipc('[download-link]', cm.url);
    } else if (cm.name == 'downloads') {
        showDownloads();
    } else if (cm.name == 'escape') {
        is_addressbar_busy = false;
    } else if (cm.name == 'close tab') {
        closeCurrentTab();
    } else if (cm.name == 'mini_iframe') {
        playMiniIframe(cm);
    } else if (cm.name == 'alert') {
        showMessage(cm.message, cm.time);
    } else if (cm.name == 'mini_youtube') {
        playMiniYoutube(cm);
    } else if (cm.name == 'new_trusted_window') {
        playTrustedWindow(cm);
    } else if (cm.name == 'new_popup') {
        playWindow(cm);
    } else if (cm.name == 'mini_video') {
        playMiniVideo(cm);
    }
}

SOCIALBROWSER.getCurrentTabInfo = function () {
    let tab = document.querySelector('.social-tab-current');
    let info = {};
    if (tab) {
        info.id = tab.getAttribute('id');
        info.url = tab.getAttribute('url');
        info.title = tab.getAttribute('title');
        info.iconURL = tab.getAttribute('iconURL');
        info.windowID = tab.getAttribute('windowID');
        info.partition = tab.getAttribute('partition');
        info.user_name = tab.getAttribute('user_name');
        info.proxy = tab.getAttribute('proxy');
        info.childProcessID = tab.getAttribute('childProcessID');
        info.mainWindowID = tab.getAttribute('mainWindowID');
    }
    return info;
};

function playMiniVideo(cm) {
    return ipc('new-video-window', cm);
}

function playMiniYoutube(cm) {
    return ipc('new-youtube-window', cm);
}

function playTrustedWindow(cm) {
    return ipc('new-trusted-window', cm);
}

function playWindow(cm) {
    return ipc('new-window', cm);
}

function playMiniIframe(cm) {
    return ipc('new-iframe-window', cm);
}

function closeCurrentTab() {
    socialTabs.removeTab(socialTabsDom.querySelector('.social-tab-current'));
}

function closeTab(id) {
    socialTabs.removeTab(socialTabsDom.querySelector('#' + id));
}

function ExitSocialWindow(noTabs = false) {
    if (noTabs) {
        ipc('[browser-message]', { name: 'close', windowID: SOCIALBROWSER.window.id });
        return;
    }
    $('.address-input .http').css('display', 'none');
    $('.address-input .https').css('display', 'none');
    $('.address-input .file').css('display', 'none');
    $('.address-input .ftp').css('display', 'none');
    $('.address-input .browser').css('display', 'none');

    $('.address-input .https').html('');
    $('.address-input .http').html('');
    $('.address-input .file').html('');
    $('.address-input .ftp').html('');
    $('.address-input .browser').html('');
    setURL('');

    opendTabList.forEach((t, i) => {
        closeTab(t.id);
    });

    setTimeout(() => {
        ipc('[browser-message]', { name: 'close', windowID: SOCIALBROWSER.window.id });
    }, 250);
}

function showDownloads() {
    renderNewTabData({
        url: 'http://127.0.0.1:60080/downloads',
        vip: true,
    });
}

function init_tab() {
    renderNewTabData(SOCIALBROWSER.newTabData);
}

function handleUrlText() {
    let url = $('#' + currentTabId).attr('url') || '';
    try {
        url = decodeURI(url);
    } catch (error) {
        console.log(error, url);
    }
    let w = document.querySelectorAll('.address-input')[0].clientWidth / 11;
    if (url.length > w) {
        setURL(url.substring(0, w), url);
    } else {
        setURL(url, url);
    }
}

window.addEventListener('resize', () => {
    handleUrlText();
});

SOCIALBROWSER.on('show-tab-view', (data) => {
    if (data.windowID == SOCIALBROWSER.window.id) {
        $('#' + currentTabId).click();
    }
});

SOCIALBROWSER.window.maximize();
SOCIALBROWSER.window.show();

SOCIALBROWSER.tabBusy = false;
SOCIALBROWSER.clickCurrentTab = function () {
    if (!SOCIALBROWSER.tabBusy) {
        SOCIALBROWSER.tabBusy = true;
        $('#' + currentTabId).click();
        setTimeout(() => {
            SOCIALBROWSER.tabBusy = false;
        }, 500);
    }
};

if (SOCIALBROWSER.var.core.id.like('*developer*')) {
    SOCIALBROWSER.menu_list.push({
        label: 'inspect Element',
        click() {
            SOCIALBROWSER.webContents.openDevTools({
                mode: 'detach',
            });
            SOCIALBROWSER.webContents.inspectElement(SOCIALBROWSER.rightClickPosition.x, SOCIALBROWSER.rightClickPosition.y);
            if (SOCIALBROWSER.webContents.isDevToolsOpened()) {
                SOCIALBROWSER.webContents.devToolsWebContents.focus();
            }
        },
    });

    SOCIALBROWSER.menu_list.push({
        label: 'Developer Tools',
        click() {
            SOCIALBROWSER.webContents.openDevTools({
                mode: 'detach',
            });
        },
    });
}

init_tab();
