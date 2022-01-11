module.exports = function (SOCIALBROWSER) {
    let mousemove = null;

    window.addEventListener('mousemove', (e) => {
        mousemove = e;
    });

    if (SOCIALBROWSER.__options.windowType === 'main') {
        return;
    }

    function sendToMain(obj) {
        SOCIALBROWSER.call('[send-render-message]', obj);
    }

    window.addEventListener('wheel', function (e) {
        if (e.ctrlKey == true) {
            sendToMain({
                name: '[window-zoom' + (e.deltaY > 0 ? '-' : '+') + ']',
                win_id: SOCIALBROWSER.currentWindow.id,
            });
        }
    });

    window.addEventListener(
        'keydown',
        (e) => {
            //e.preventDefault();
            //e.stopPropagation();
            if (e.key == 'F12' /*f12*/ && !SOCIALBROWSER.DevToolsOff) {
                sendToMain({
                    name: '[show-window-dev-tools]',
                    win_id: SOCIALBROWSER.currentWindow.id,
                });
            } else if (e.key == 'F11' /*f11*/) {
                sendToMain({
                    name: '[toggle-fullscreen]',
                    win_id: SOCIALBROWSER.currentWindow.id,
                });
            } else if (e.keyCode == 121 /*f10*/) {
                sendToMain({
                    name: 'service worker',
                });
            } else if (e.keyCode == 117 /*f6*/) {
                sendToMain({
                    name: 'show addressbar',
                });
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
                        win_id: SOCIALBROWSER.currentWindow.id,
                    });
                }
            } else if (e.keyCode == 109 /*-*/) {
                if (e.ctrlKey == true) {
                    sendToMain({
                        name: '[window-zoom-]',
                        win_id: SOCIALBROWSER.currentWindow.id,
                    });
                }
            } else if (e.keyCode == 48 /*0*/) {
                if (e.ctrlKey == true) {
                    sendToMain({
                        name: '[window-zoom]',
                        win_id: SOCIALBROWSER.currentWindow.id,
                    });
                }
            } else if (e.keyCode == 49 /*1*/) {
                if (e.ctrlKey == true) {
                    sendToMain({
                        name: '[toggle-window-audio]',
                    });
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
                    window.print0();
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
                sendToMain({
                    name: '[edit-window]',
                });
            } else if (e.keyCode == 78 /*n*/ || e.keyCode == 84 /*n*/) {
                if (e.ctrlKey == true) {
                    sendToMain({
                        name: '[open new tab]',
                        win_id: SOCIALBROWSER.currentWindow.id,
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
};
