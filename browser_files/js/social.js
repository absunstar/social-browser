var browserTabsDom = document.querySelector('.browser-tabs');
var browserTabs = new BrowserTabs();
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
    message.tabID = message.tabID || SOCIALBROWSER.currentTabInfo.tabID;
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

function showAddressbar() {
    let url = SOCIALBROWSER.getCurrentTabInfo().url || '';
    if (url.like('browser*|*127.0.0.1:60080*')) {
        return;
    }
    ipc('[show-addressbar]', { url: SOCIALBROWSER.getCurrentTabInfo().url });
}

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
                    origin: new URL(SOCIALBROWSER.getCurrentTabInfo().url).origin,
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
    let freeTools = {
        label: 'Free Social Tools',
        click: () => {
            ipc('[open new popup]', {
                show: true,
                url: 'https://tools.social-browser.com/tools',
                title: 'Free Social Tools',
                partition: 'persist:social',
                center: true,
                vip: true,
                alwaysOnTop: true,
                maximize: true,
            });
        },
        iconURL: 'http://127.0.0.1:60080/images/free-tools.png',
    };

    SOCIALBROWSER.menuList.push(freeTools);
    let vipTools = {
        label: 'VIP Social Tools',
        click: () => {
            ipc('[open new popup]', {
                show: true,
                url: 'https://vip.social-browser.com',
                title: 'VIP Social Tools',
                partition: 'persist:social',
                center: true,
                vip: true,
                alwaysOnTop: true,
                maximize: true,
            });
        },
        iconURL: 'http://127.0.0.1:60080/images/vip-tools.png',
    };

    SOCIALBROWSER.menuList.push(vipTools);
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
            label: b.url,
            sublabel: b.title,
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
                origin: new URL(SOCIALBROWSER.getCurrentTabInfo().url).origin,
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

function copyCurrentURL() {
    SOCIALBROWSER.copy(SOCIALBROWSER.getCurrentTabInfo().url);
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
            label: b.url,
            sublabel: b.title,
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
    SOCIALBROWSER.menuList.push({
        label: 'Translate this page',
        iconURL: 'http://127.0.0.1:60080/images/code.png',
        click: () => {
            ipc('[window-action]', { name: 'translate' });
        },
    });

    SOCIALBROWSER.menuList.push({
        label: 'Edit Page Content',
        iconURL: 'http://127.0.0.1:60080/images/code.png',
        click: () => {
            ipc('[toggle-window-edit]');
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Hide / Show - Page Images',
        iconURL: 'http://127.0.0.1:60080/images/code.png',
        click: () => {
            ipc('[window-action]', { name: 'toggle-page-images' });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Hide / Show - Page Content',
        iconURL: 'http://127.0.0.1:60080/images/code.png',
        click: () => {
            ipc('[window-action]', { name: 'toggle-page-content' });
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.var.scriptList
        .filter(
            (s) =>
                s.show &&
                !SOCIALBROWSER.getCurrentTabInfo().url.like('*127.0.0.1:60080*') &&
                SOCIALBROWSER.getCurrentTabInfo().url.like(s.allowURLs) &&
                !SOCIALBROWSER.getCurrentTabInfo().url.like(s.blockURLs),
        )
        .forEach((script) => {
            SOCIALBROWSER.menuList.push({
                label: script.title,
                iconURL: 'http://127.0.0.1:60080/images/code.png',
                click: () => {
                    SOCIALBROWSER.ws({ type: '[run-user-script]', tabInfo: SOCIALBROWSER.getCurrentTabInfo(), script: script });
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

SOCIALBROWSER.showHelpMenu = function () {
    SOCIALBROWSER.window.show();
    SOCIALBROWSER.menuList = [];

    SOCIALBROWSER.menuList.push({
        label: 'Click Here if you want to run Page Ads',
        sublabel: 'toggle [ on / off ]',
        click: () => {
            ipc('[window-action]', { name: 'customSetting.allowAds', value: !currentTab.allowAds });
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Click Here to run Page Content Any Way',
        sublabel: 'toggle [ on / off ]',
        click: () => {
            ipc('[window-action]', { name: 'customSetting.off', value: !currentTab.off });
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

SOCIALBROWSER.showWindowCustomSetting = function () {
    SOCIALBROWSER.window.show();
    SOCIALBROWSER.menuList = [];
    let currentTab = SOCIALBROWSER.getCurrentTabInfo();

    SOCIALBROWSER.menuList.push({
        label: 'Allow Default Web Worker ( Solve Captcha Problems )',
        type: 'checkbox',
        checked: currentTab.allowDefaultWorker || false,
        iconURL: 'http://127.0.0.1:60080/images/allow.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.allowDefaultWorker', value: !currentTab.allowDefaultWorker });
        },
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Allow Ads',
        type: 'checkbox',
        checked: currentTab.allowAds,
        iconURL: 'http://127.0.0.1:60080/images/allow.png',
        click: () => {
            ipc('[window-action]', { name: 'customSetting.allowAds', value: !currentTab.allowAds });
        },
    });

    SOCIALBROWSER.menuList.push({
        label: 'Allow Popups',
        type: 'checkbox',
        checked: currentTab.allowPopup,
        iconURL: 'http://127.0.0.1:60080/images/allow.png',
        click: () => {
            ipc('[window-action]', { name: 'customSetting.allowPopup', value: !currentTab.allowPopup });
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Mark Window as ( White Site )',
        type: 'checkbox',
        checked: currentTab.isWhiteSite || false,
        iconURL: 'http://127.0.0.1:60080/images/allow.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.isWhiteSite', value: !currentTab.isWhiteSite });
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Block Load Images',
        type: 'checkbox',
        checked: currentTab.blockImages || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockImages', value: !currentTab.blockImages });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Block Load JavaScript Files',
        type: 'checkbox',
        checked: currentTab.blockJS || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockJS', value: !currentTab.blockJS });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Block Load CSS Files',
        type: 'checkbox',
        checked: currentTab.blockCSS || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockCSS', value: !currentTab.blockCSS });
        },
    });

    SOCIALBROWSER.menuList.push({
        label: 'Block Load Media / Videos',
        type: 'checkbox',
        checked: currentTab.blockMedia || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockMedia', value: !currentTab.blockMedia });
        },
    });

    SOCIALBROWSER.menuList.push({
        label: 'Block XMLHttpRequest / fetch ',
        type: 'checkbox',
        checked: currentTab.blockXHR || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockXHR', value: !currentTab.blockXHR });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Block Load Sub Frames',
        type: 'checkbox',
        checked: currentTab.blockSubFrame || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockSubFrame', value: !currentTab.blockSubFrame });
        },
    });

    SOCIALBROWSER.menuList.push({
        label: 'Block Load Fonts',
        type: 'checkbox',
        checked: currentTab.blockFonts || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockFonts', value: !currentTab.blockFonts });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Block WebSocket connection',
        type: 'checkbox',
        checked: currentTab.blockWebSocket || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockWebSocket', value: !currentTab.blockWebSocket });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Block Ping Requests',
        type: 'checkbox',
        checked: currentTab.blockPing || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockPing', value: !currentTab.blockPing });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Block CSP Reports',
        type: 'checkbox',
        checked: currentTab.blockCspReport || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockCspReport', value: !currentTab.blockCspReport });
        },
    });

    SOCIALBROWSER.menuList.push({
        label: 'Block Object Resources',
        type: 'checkbox',
        checked: currentTab.blockObject || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockObject', value: !currentTab.blockObject });
        },
    });

    SOCIALBROWSER.menuList.push({
        label: 'Block Other Resources',
        type: 'checkbox',
        checked: currentTab.blockOther || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.blockOther', value: !currentTab.blockOther });
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    SOCIALBROWSER.menuList.push({
        label: 'Block Javascript Engine ',
        type: 'checkbox',
        checked: currentTab.javaScriptOFF || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.javaScriptOFF', value: !currentTab.javaScriptOFF });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Block Browser Engine ',
        type: 'checkbox',
        checked: currentTab.enginOFF || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.enginOFF', value: !currentTab.enginOFF });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Block ALL Engine ',
        type: 'checkbox',
        checked: currentTab.off || false,
        iconURL: 'http://127.0.0.1:60080/images/stop.png',
        click() {
            ipc('[window-action]', { name: 'customSetting.off', value: !currentTab.off });
        },
    });

    ipc('[show-menu]', {
        windowID: SOCIALBROWSER.window.id,
        list: SOCIALBROWSER.menuList.map((m) => ({
            label: m.label,
            type: m.type,
            checked: m.checked,
            sublabel: m.sublabel,
            visible: m.visible,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                checked: m2.checked,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL, checked: m3.checked })),
            })),
        })),
    });
};

SOCIALBROWSER.showIntegratedURLsMenu = function () {
    SOCIALBROWSER.window.show();
    SOCIALBROWSER.menuList = [];

    let currentTab = SOCIALBROWSER.getCurrentTabInfo();
    let doman = new URL(currentTab.url).hostname;
    doman = encodeURIComponent(doman);

    let url = encodeURIComponent(currentTab.url);

    SOCIALBROWSER.menuList.push({
        label: 'Google PageSpeed Insights',
        sublabel: currentTab.url,
        iconURL: 'http://127.0.0.1:60080/images/link.png',
        click: () => {
            SOCIALBROWSER.openNewPopup({
                url: 'https://pagespeed.web.dev/analysis?url=' + url,
                partition: currentTab.partition,
                show: true,
                isWhiteSite: true,
            });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Domain Lookup - Whois',
        sublabel: doman,
        iconURL: 'http://127.0.0.1:60080/images/link.png',
        click: () => {
            SOCIALBROWSER.openNewPopup({
                url: 'https://who.is/whois/' + doman,
                partition: currentTab.partition,
                show: true,
                isWhiteSite: true,
            });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Site Safety - Virus Total',
        sublabel: doman,
        iconURL: 'http://127.0.0.1:60080/images/link.png',
        click: () => {
            SOCIALBROWSER.openNewPopup({
                url: 'https://www.virustotal.com/gui/search?query=' + doman,
                partition: currentTab.partition,
                show: true,
                isWhiteSite: true,
            });
        },
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    SOCIALBROWSER.menuList.push({
        label: 'SEO Checkup - seobility',
        sublabel: currentTab.url,
        iconURL: 'http://127.0.0.1:60080/images/link.png',
        click: () => {
            SOCIALBROWSER.openNewPopup({
                url: 'https://www.seobility.net/en/seocheck/check/?url=' + url,
                partition: currentTab.partition,
                show: true,
                isWhiteSite: true,
            });
        },
    });

    ipc('[show-menu]', {
        windowID: SOCIALBROWSER.window.id,
        list: SOCIALBROWSER.menuList.map((m) => ({
            label: m.label,
            type: m.type,
            checked: m.checked,
            sublabel: m.sublabel,
            visible: m.visible,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                checked: m2.checked,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL, checked: m3.checked })),
            })),
        })),
    });
};
SOCIALBROWSER.showAIMenu = function () {
    SOCIALBROWSER.window.show();
    SOCIALBROWSER.menuList = [];

    let currentTab = SOCIALBROWSER.getCurrentTabInfo();

    SOCIALBROWSER.var.blocking.ai_site_list.forEach((ai) => {
        if (ai.multi) {
            let arr = [];
            SOCIALBROWSER.var.session_list.forEach((s , i) => {
                arr.push({
                    label: `As ( ${i+1} ) [ ${s.display} ]`,
                    iconURL: 'http://127.0.0.1:60080/images/person.png',
                    click: () => {
                        ai.view_type = ai.view_type || { id: 'New Window' };

                        if (ai.view_type.id == 'New Window') {
                            SOCIALBROWSER.openNewPopup({
                                url: ai.url,
                                partition: s.name,
                                show: true,
                                isWhiteSite: true,
                            });
                        } else {
                            SOCIALBROWSER.openNewTab({
                                url: ai.url,
                                partition: s.name,
                                isWhiteSite: true,
                            });
                        }
                    },
                });
            });
            SOCIALBROWSER.menuList.push({
                label: 'Open ' + ai.name,
                iconURL: 'http://127.0.0.1:60080/images/bot.png',
                type: 'submenu',
                submenu: arr,
            });
        } else {
            SOCIALBROWSER.menuList.push({
                label: ai.name,
                iconURL: 'http://127.0.0.1:60080/images/bot.png',
                click: () => {
                    ai.view_type = ai.view_type || { id: 'New Window' };

                    if (ai.view_type.id == 'New Window') {
                        SOCIALBROWSER.openNewPopup({
                            url: ai.url,
                            partition: currentTab.partition,
                            show: true,
                            isWhiteSite: true,
                        });
                    } else if (ai.view_type.id == 'New Tab') {
                        SOCIALBROWSER.openNewTab({
                            url: ai.url,
                            partition: currentTab.partition,
                            isWhiteSite: true,
                        });
                    } else if (ai.view_type.id == 'Current Tab') {
                        ipc('[update-view]', {
                            url: ai.url,
                            customSetting: {
                                isWhiteSite: true,
                            },
                        });
                    }
                },
            });
        }
    });
  SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
      SOCIALBROWSER.menuList.push({
      label: 'AI Site Setting',
        iconURL: 'http://127.0.0.1:60080/images/setting.png',
        click: () => {
            ipc('[open new tab]', {
                url: 'http://127.0.0.1:60080/setting#contextMenu',
                session: { name: 'setting', display: 'setting' },
                windowType: 'view',
                vip: true,
            });
        },
    });
    ipc('[show-menu]', {
        windowID: SOCIALBROWSER.window.id,
        list: SOCIALBROWSER.menuList.map((m) => ({
            label: m.label,
            type: m.type,
            checked: m.checked,
            sublabel: m.sublabel,
            visible: m.visible,
            iconURL: m.iconURL,
            submenu: m.submenu?.map((m2) => ({
                label: m2.label,
                type: m2.type,
                checked: m2.checked,
                sublabel: m2.sublabel,
                visible: m2.visible,
                iconURL: m2.iconURL,
                submenu: m2.submenu?.map((m3) => ({ label: m3.label, type: m3.type, sublabel: m3.sublabel, visible: m3.visible, iconURL: m3.iconURL, checked: m3.checked })),
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
            let currentTab = SOCIALBROWSER.getCurrentTabInfo();
            SOCIALBROWSER.ws({ type: '[change-user-proxy]', partition: SOCIALBROWSER.getCurrentTabInfo().partition, proxy: null });
            setTimeout(() => {
                ipc('[window-reload]', currentTab);
            }, 1000 * 1);
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    if (SOCIALBROWSER.var.proxy_list.length > 0) {
        SOCIALBROWSER.menuList.push({
            label: 'Random Proxy',
            iconURL: 'http://127.0.0.1:60080/images/proxy.png',
            click: () => {
                let currentTab = SOCIALBROWSER.getCurrentTabInfo();
                let proxy = SOCIALBROWSER.var.proxy_list[Math.floor(Math.random() * SOCIALBROWSER.var.proxy_list.length)] || SOCIALBROWSER.var.proxy_list[0];

                SOCIALBROWSER.ws({ type: '[change-user-proxy]', partition: currentTab.partition, proxy: proxy });
                setTimeout(() => {
                    ipc('[window-reload]', currentTab);
                }, 1000 * 2);
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
                    let currentTab = SOCIALBROWSER.getCurrentTabInfo();
                    SOCIALBROWSER.ws({ type: '[change-user-proxy]', partition: SOCIALBROWSER.getCurrentTabInfo().partition, proxy: proxy });
                    setTimeout(() => {
                        ipc('[window-reload]', currentTab);
                    }, 1000 * 2);
                },
            });
        });
    }

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
            SOCIALBROWSER.ws({ type: '[change-user-agent]', partition: SOCIALBROWSER.getCurrentTabInfo().partition, defaultUserAgent: null });
            setTimeout(() => {
                ipc('[window-reload]');
            }, 1000 * 0);
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.var.userAgentList.sort((a, b) => (a.name > b.name ? -1 : 1));
    SOCIALBROWSER.var.userAgentList.forEach((userAgent) => {
        SOCIALBROWSER.menuList.push({
            label: userAgent.name,
            iconURL: 'http://127.0.0.1:60080/images/user-agent.png',
            click: () => {
                SOCIALBROWSER.ws({ type: '[change-user-agent]', partition: SOCIALBROWSER.getCurrentTabInfo().partition, defaultUserAgent: userAgent });
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
        label: 'Open URL in  [ New Window ( Random - PC ) ]',
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        sublabel: SOCIALBROWSER.getCurrentTabInfo().url,
        click: () => {
            ipc('[window-action]', { name: 'new-window' });
        },
    });
    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ New Window ( Random - Mobile ) ]',
        sublabel: SOCIALBROWSER.getCurrentTabInfo().url,
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        click: () => {
            ipc('[window-action]', { name: 'new-mobile-window' });
        },
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ New Window ( Allow Ads ) ]',
        sublabel: SOCIALBROWSER.getCurrentTabInfo().url,
        iconURL: 'http://127.0.0.1:60080/images/page.png',
        click: () => {
            ipc('[window-action]', { name: 'new-ads-window' });
        },
    });
    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });

    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ Chrome Browser Simulator ] ',
        sublabel: SOCIALBROWSER.getCurrentTabInfo().url,
        iconURL: 'http://127.0.0.1:60080/images/chrome.png',
        click: () => {
            ipc('[window-action]', { name: 'open-in-chrome' });
        },
    });

    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ Chrome Browser Simulator ] ( Shared Cookies , User Data , Extentions ) ',
        sublabel: SOCIALBROWSER.getCurrentTabInfo().url,
        iconURL: 'http://127.0.0.1:60080/images/chrome.png',
        click: () => {
            ipc('[window-action]', { name: 'open-in-chrome-session' });
        },
    });

    SOCIALBROWSER.menuList.push({
        type: 'separator',
    });
    SOCIALBROWSER.menuList.push({
        label: 'Open URL in  [ External Browser ] ',
        sublabel: SOCIALBROWSER.getCurrentTabInfo().url,
        iconURL: 'http://127.0.0.1:60080/images/browser.png',
        click: () => {
            ipc('[window-action]', { name: 'open-external', url: SOCIALBROWSER.getCurrentTabInfo().url });
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

browserTabs.init(browserTabsDom, {
    tabOverlapDistance: 10,
    minWidth: 35,
    maxWidth: 270,
});

function setURL(url, url2) {
    $addressbar.text('');
    if (url) {
        url = url.replace('127.0.0.1:60080/', '');
        try {
            url = decodeURI(url);
        } catch (error) {
            console.log(error, url);
        }
        $addressbar.text(url.replace('http://', '').replace('https://', ''));
    }
}

function showAddressBar() {
    $('.social-address-bar').show();
}

function hideAddressBar() {
    $('.social-address-bar').hide();
}

function showSocialTabs() {
    $('.browser-tabs').show();
    $('.social-address-bar').show();
    browserTabs.layoutTabs();
    browserTabs.fixZIndexes();
    browserTabs.setupDraggabilly();
}

function hideSocialTabs() {
    $('.browser-tabs').hide();
    $('.social-address-bar').hide();
    browserTabs.layoutTabs();
    browserTabs.fixZIndexes();
    browserTabs.setupDraggabilly();
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
    u = u || SOCIALBROWSER.getCurrentTabInfo().url;
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

browserTabsDom.addEventListener('activeTabChange', ({ detail }) => {
    let id = detail.tabEl.id;
    SOCIALBROWSER.currentTabInfo = SOCIALBROWSER.getCurrentTabInfo(id);

    ipc('[show-view]', {
        x: 0,
        y: 0,
        width: document.width,
        height: document.height,
        tabID: id,
        mainWindowID: SOCIALBROWSER.window.id,
    });

    $('#user_name').html(SOCIALBROWSER.currentTabInfo.user_name);

    if (!SOCIALBROWSER.currentTabInfo.forward) {
        $('.go-forward i').css('color', '#9E9E9E');
    } else {
        $('.go-forward i').css('color', '#4caf50');
    }
    if (!SOCIALBROWSER.currentTabInfo.back) {
        $('.go-back i').css('color', '#9E9E9E');
    } else {
        $('.go-back i').css('color', '#4caf50');
    }

    if (SOCIALBROWSER.currentTabInfo.webaudio) {
        $('.Page-audio i').css('color', '#4caf50');
    } else {
        $('.Page-audio i').css('color', '#f44336');
    }

    if (SOCIALBROWSER.currentTabInfo.url) {
        $('.address-input .http').css('display', 'none');
        $('.address-input .https').css('display', 'none');
        $('.address-input .file').css('display', 'none');
        $('.address-input .ftp').css('display', 'none');
        $('.address-input .browser').css('display', 'none');
        $('.address-input .proxy').css('display', 'none');

        $('.address-input .https').html('');
        $('.address-input .http').html('');
        $('.address-input .file').html('');
        $('.address-input .ftp').html('');
        $('.address-input .browser').html('');
        $('.address-input .proxy').html('');

        if (SOCIALBROWSER.currentTabInfo.url.like('http://127.0.0.1:60080*|browser*')) {
            $('.address-input .browser').html('browser');
            $('.address-input .browser').css('display', 'inline-block');
            url = SOCIALBROWSER.currentTabInfo.url;
            let arr = url.split('//');
            setURL(arr[arr.length - 1], url);
        } else {
            let protocol = '';
            let url = '';
            if (SOCIALBROWSER.currentTabInfo.url.like('https*')) {
                protocol = 'HTTPS';
                $('.address-input .https').html(protocol);
                $('.address-input .https').css('display', 'inline-block');
            } else if (SOCIALBROWSER.currentTabInfo.url.like('http*')) {
                protocol = 'http';
                $('.address-input .http').html(protocol);
                $('.address-input .http').css('display', 'inline-block');
            } else if (SOCIALBROWSER.currentTabInfo.url.like('ftp*')) {
                protocol = 'ftp';
                $('.address-input .ftp').html(protocol);
                $('.address-input .ftp').css('display', 'inline-block');
            } else if (SOCIALBROWSER.currentTabInfo.url.like('file*')) {
                protocol = 'file';
                $('.address-input .file').html(protocol);
                $('.address-input .file').css('display', 'inline-block');
            } else if (SOCIALBROWSER.currentTabInfo.url.like('browser*')) {
                protocol = 'browser';
                $('.address-input .browser').html(protocol);
                $('.address-input .browser').css('display', 'inline-block');
            }

            if (protocol) {
                url = SOCIALBROWSER.currentTabInfo.url.replace(protocol + '://', '');
            } else {
                url = SOCIALBROWSER.currentTabInfo.url;
            }

            $('.address-input .protocol').html(protocol);
        }
    }

    handleUrlText();

    if (SOCIALBROWSER.currentTabInfo.proxy) {
        $('.address-input .proxy').html(SOCIALBROWSER.currentTabInfo.proxy);
        $('.address-input .proxy').css('display', 'inline-block');
    }
});

browserTabsDom.addEventListener('tabAdd', ({ detail }) => {
    let id = detail.tabEl.id;
    if (id && id != null && id.length > 0) {
        opendTabList.push({
            id: id,
        });
        ipc('[create-new-view]', {
            ...detail.tabProperties,
            x: window.screenLeft,
            y: window.screenTop + 70,
            width: document.width,
            height: document.height,
            tabID: id,
            mainWindowID: SOCIALBROWSER.window.id,
        });
    }
});

browserTabsDom.addEventListener('tabRemove', ({ detail }) => {
    let id = detail.id;

    ipc('[close-view]', {
        tabID: id,
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
        iconURL: 'browser://images/loading.gif',
        mainWindowID: SOCIALBROWSER.window.id,
    };
    browserTabs.addTab(tab);
    // console.log(tab);
}

SOCIALBROWSER.on('[show-tab]', (event, data) => {
    $('#' + data.tabID).click();
});
SOCIALBROWSER.on('[close-tab]', (event, data) => {
    closeTab(data.tabID);
});
SOCIALBROWSER.on('[open new tab]', (event, data) => {
    renderNewTabData(data);
});
SOCIALBROWSER.on('[send-render-message]', (event, data) => {
    renderMessage(data);
});
SOCIALBROWSER.tabPropertyList = [];

SOCIALBROWSER.on('[update-tab-properties]', (event, data) => {
    if (data.tabID) {
        SOCIALBROWSER.tabPropertyList[data.tabID] = data;
        let tab1 = document.querySelector('#' + data.tabID);
        if (tab1) {
            $('#' + data.tabID + ' .social-tab-favicon').css('background-image', 'url(' + data.iconURL + ')');
        }

        if (data.title) {
            $('#' + data.tabID + ' .social-tab-title p').text(data.title);
            let p = document.querySelector('#' + data.tabID + ' .social-tab-title p');
            if (p) {
                if (data.title.test(/^[a-zA-Z\-\u0590-\u05FF\0-9\^@_:\?\[\]~<>\{\}\|\\ ]+$/)) {
                    p.style.direction = 'ltr';
                } else {
                    p.style.direction = 'rtl';
                }
            }
        } else {
            $('#' + data.tabID + ' .social-tab-title p').text(data.url);
        }
    }

    if (browserTabs.tabEls.length === 2 && !SOCIALBROWSER.showViewDone && !SOCIALBROWSER.window.isMinimized() && SOCIALBROWSER.window.isVisible()) {
        ipc('[show-view]', {
            x: 0,
            y: 0,
            width: document.width,
            height: document.height,
            tabID: data.tabID,
            mainWindowID: SOCIALBROWSER.window.id,
        });
        SOCIALBROWSER.showViewDone = true;
        SOCIALBROWSER.window.show();
        SOCIALBROWSER.window.setAlwaysOnTop(true);
        SOCIALBROWSER.window.setAlwaysOnTop(false);
    }

    if (data.tabID && data.tabID == SOCIALBROWSER.getCurrentTabInfo(data.tabID).tabID && data.url) {
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

        $('.address-input .proxy').css('display', 'none');
        $('.address-input .http').css('display', 'none');
        $('.address-input .https').css('display', 'none');
        $('.address-input .file').css('display', 'none');
        $('.address-input .ftp').css('display', 'none');
        $('.address-input .browser').css('display', 'none');

        $('.address-input .proxy').html('');
        $('.address-input .https').html('');
        $('.address-input .http').html('');
        $('.address-input .file').html('');
        $('.address-input .ftp').html('');
        $('.address-input .browser').html('');

        if (data.proxy) {
            $('.address-input .proxy').html(data.proxy);
            $('.address-input .proxy').css('display', 'inline-block');
        }

        if (data.url.like('http://127.0.0.1:60080*|browser*')) {
            $('.address-input .browser').html('browser');
            $('.address-input .browser').css('display', 'inline-block');
            url = data.url;
            let arr = url.split('//');
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
        }
        handleUrlText();
    }
});

function renderMessage(cm) {
    if (!cm) {
        return;
    } else if (cm.name == '[remove-tab]') {
        browserTabs.removeTab(browserTabs.removeTab(browserTabsDom.querySelector('#' + cm.tabID)));
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

SOCIALBROWSER.getCurrentTabInfo = function (id) {
    if (id) {
        let info = SOCIALBROWSER.tabPropertyList[id];
        return info || {};
    }
    let tab = document.querySelector('.social-tab-current');
    let info = tab ? SOCIALBROWSER.tabPropertyList[tab.getAttribute('id')] : {};
    return info || {};
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
    browserTabs.removeTab(browserTabsDom.querySelector('.social-tab-current'));
}

function closeTab(id) {
    browserTabs.removeTab(browserTabsDom.querySelector('#' + id));
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
    let url = SOCIALBROWSER.getCurrentTabInfo().url || '';
    try {
        url = decodeURI(url);
    } catch (error) {
        console.log(error, url);
    }
    let w = document.querySelectorAll('.address-input')[0].clientWidth / 11;
    if (url.length > w) {
        setURL(url, url);
    } else {
        setURL(url, url);
    }
}

window.addEventListener('resize', () => {
    handleUrlText();
});

SOCIALBROWSER.on('show-tab-view', (data) => {
    if (data.windowID == SOCIALBROWSER.window.id) {
        $('#' + data.tabID).click();
    }
});

SOCIALBROWSER.window.maximize();
SOCIALBROWSER.window.show();

SOCIALBROWSER.tabBusy = false;
SOCIALBROWSER.clickCurrentTab = function () {
    if (!SOCIALBROWSER.tabBusy) {
        SOCIALBROWSER.tabBusy = true;
        $('#' + SOCIALBROWSER.getCurrentTabInfo().tabID).click();
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
$('#user_name').html(SOCIALBROWSER.var.core.session.display);
init_tab();
