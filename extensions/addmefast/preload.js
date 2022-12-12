module.exports = function (SOCIALBROWSER) {
    SOCIALBROWSER.onLoad(() => {
        if (document.location.hostname.contains('youtube.com') && SOCIALBROWSER.customSetting.windowType === 'window-popup') {
            SOCIALBROWSER.subscribed_btn = null;
            SOCIALBROWSER.is_user_login = false;
            SOCIALBROWSER.channel_subscribed = false;

            window.addEventListener('message', (e) => {
                if (e.data === 'subscribed_enable') {
                    if (SOCIALBROWSER.channel_subscribed === false) {
                        SOCIALBROWSER.is_user_login = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]') ? false : true;
                        if (SOCIALBROWSER.is_user_login) {
                            SOCIALBROWSER.subscribed_btn =
                                document.querySelector('#subscribe-button.style-scope.ytd-video-secondary-info-renderer paper-button') ||
                                document.querySelector('paper-button.ytd-subscribe-button-renderer').click();
                            if (!SOCIALBROWSER.channel_subscribed && SOCIALBROWSER.subscribed_btn && !SOCIALBROWSER.subscribed_btn.hasAttribute('subscribed')) {
                                SOCIALBROWSER.channel_subscribed = true;
                                SOCIALBROWSER.subscribed_btn.click();
                            }
                        }
                    }
                }
            });
        }

        if (document.location.hostname.contains('addmefast.com') && !document.location.href.like('*flipCounter*')) {
            SOCIALBROWSER.log(' :: Addmefast Activated :: ' + document.location.href);

            SOCIALBROWSER.var.blocking.core.block_empty_iframe = false;

            SOCIALBROWSER.onLoad(() => {
                SOCIALBROWSER.__showBotImage();
                window.clicked = window.clicked || 0;

                document.querySelectorAll('a[href]').forEach((a) => {
                    if (!a.getAttribute('xff')) {
                        a.setAttribute('xff', 'xff');

                        if (a.href.like('*facebook*|*youtube*|*instagram*|*telegram*|*tiktok*|*twitter*|*websites*|*twitch*|*pinterest*|*like*|*soundcloud*|*vkontakte*|*ok_group*|*reverbnation*')) {
                           // a.href += '#___new_popup___';
                           // a.setAttribute('target', '_blank');
                            a.style.cursor = 'pointer';
                            let url = a.href;
                            a.removeAttribute('href');
                            a.addEventListener('click', (ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                let win = new SOCIALBROWSER.remote.BrowserWindow({
                                    show: true,
                                    alwaysOnTop: false,
                                    width: 1200,
                                    height: 720,
                                    x: 200,
                                    y: 200,
                                    backgroundColor: '#ffffff',
                                    frame: true,
                                    webPreferences: {
                                        contextIsolation: false,
                                        enableRemoteModule: true,
                                        contextIsolation: false,
                                        webaudio: false,
                                        nodeIntegration: false,
                                        nodeIntegrationInWorker: false,
                                        partition: SOCIALBROWSER.partition,
                                        sandbox: false,
                                        preload: SOCIALBROWSER.files_dir + '/js/context-menu.js',
                                        webSecurity: true,
                                        allowRunningInsecureContent: false,
                                        plugins: true,
                                    },
                                });
                                win.center();
                                win.setMenuBarVisibility(false);
                                win.webContents.audioMuted = true;
                                win.loadURL(url, {
                                    referrer: document.location.href,
                                    userAgent: navigator.userAgent,
                                });
                                win.webContents.on('context-menu', (event, params) => {
                                    if (win && !win.isDestroyed()) {
                                        win.webContents.send('context-menu', params);
                                    }
                                });
                            });
                        }
                    }
                });

                if (document.location.href.contains('reverbnation_fan|ok_group_join|askfm|pinterest|telegram|instagram|twitter|tiktok|soundcloud|youtube|facebook')) {
                    SOCIALBROWSER.var.user_data_block = true;

                    window.open = function (url, _name, _specs, _replace_in_history) {
                        let childWindow = {
                            closed: false,
                            opener: window,
                            innerHeight: 1028,
                            innerWidth: 720,
                            addEventListener: (name, callback) => {
                                if (name == 'load') {
                                    if (callback) {
                                        callback();
                                    }
                                }
                            },
                            postMessage: function (...args) {},
                            eval: function () {},
                            close: function () {
                                this.closed = true;
                            },
                            focus: function () {},
                            blur: function () {},
                            print: function () {},
                            document: {
                                write: function () {},
                                open: function () {},
                                close: function () {},
                            },
                            self: this,
                        };

                        if (typeof url !== 'string') {
                            return childWindow;
                        }
                        if (url == 'about:blank') {
                            return childWindow;
                        }

                        url = SOCIALBROWSER.handle_url(url);

                        let win = new SOCIALBROWSER.remote.BrowserWindow({
                            show: false,
                            alwaysOnTop: false,
                            width: _specs.width || 1200,
                            height: _specs.height || 720,
                            x: _specs.x || 200,
                            y: _specs.y || 200,
                            backgroundColor: '#ffffff',
                            frame: true,
                            webPreferences: {
                                contextIsolation: false,
                                enableRemoteModule: true,
                                contextIsolation: false,
                                webaudio: false,
                                nativeWindowOpen : false,
                                nodeIntegration: false,
                                nodeIntegrationInWorker: false,
                                partition: SOCIALBROWSER.partition,
                                sandbox: false,
                                preload: SOCIALBROWSER.files_dir + '/js/context-menu.js',
                                webSecurity: false,
                                allowRunningInsecureContent: true,
                                plugins: true,
                            },
                        });

                        win.setMenuBarVisibility(false);
                        win.webContents.audioMuted = true;
                        // win.openDevTools();
                        win.loadURL(url, {
                            referrer: document.location.href,
                            userAgent: navigator.userAgent,
                        });

                        SOCIALBROWSER.call('[assign][window]', {
                            parent_id: SOCIALBROWSER.currentWindow.id,
                            child_id: win.id,
                        });

                        childWindow.postMessage = function (data, origin) {
                            SOCIALBROWSER.call('window.message', { child_id: win.id, data: data, origin: origin || '*' });
                        };

                        win.webContents.on('dom-ready', () => {

                            if (document.location.href.contains('youtube_subscribe')) {
                                childWindow.postMessage('subscribed_enable', '*');
                            }

                            if (!document.location.href.contains('youtube_views|soundcloud_views')) {
                                if (win.getURL().contains('youtube|soundcloud')) {
                                    childWindow.close();
                                } else {
                                    win.show();
                                }
                                setTimeout(() => {
                                    childWindow.close();
                                    let single_like_button = document.querySelector('a.single_like_button');
                                    if (single_like_button && single_like_button.id.like('*confirm*') && single_like_button.style.display != 'none') {
                                        single_like_button.click();
                                    }
                                }, 1000 * 30);
                            }
                        });

                        childWindow.close = function () {
                            SOCIALBROWSER.log('childWindow.close()');
                            if (win && !win.isDestroyed()) {
                                win.close();
                                setTimeout(() => {
                                    if (win && !win.isDestroyed()) {
                                        win.destroy();
                                    }
                                }, 1000);
                            }
                        };

                        win.on('closed', (e) => {
                            childWindow.postMessage = () => {};
                            childWindow.eval = () => {};
                            if (!document.location.href.contains('youtube_views|soundcloud_views')) {
                                childWindow.closed = true;
                            }
                        });

                        return childWindow;
                    };

                    setInterval(() => {
                        let single_like_button = document.querySelector('a.single_like_button');
                        if (single_like_button && !single_like_button.id.like('*confirm*') && single_like_button.style.display != 'none') {
                            single_like_button.click();
                            single_like_button.style.display = 'none';
                        }
                    }, 1000 * 2);

                    if (document.querySelector('#content #content')) {
                        document.location.reload();
                        return;
                    }

                    if (document.location.href.contains('youtube_views|soundcloud_views')) {
                        let captca_count = 0;
                        let img_handle = false;
                        setInterval(() => {
                            let btn = document.querySelector('#human_check');
                            if (btn) {
                                document.querySelector('title').innerText = '^_^';
                                setTimeout(() => {
                                    document.querySelector('title').innerText = '): ^';
                                }, 500);

                                captca_count++;
                                if (captca_count > 5) {
                                    let btn_submit = document.querySelector('#submit_button');
                                    if (btn_submit) {
                                        btn_submit.click();
                                        captca_count = 0;
                                    }
                                }
                            } else {
                                if (document.querySelector('title') && document.location.href.contains('youtube_views')) {
                                    document.querySelector('title').innerText = 'AddMeFast.com - YouTube Views';
                                } else if (document.querySelector('title') && document.location.href.contains('soundcloud_views')) {
                                    document.querySelector('title').innerText = 'AddMeFast.com - SoundCloud Views';
                                }

                                captca_count = 0;
                                img_handle = false;
                            }
                        }, 3000);
                    }
                }

                if (document.location.href.contains('websites')) {
                    SOCIALBROWSER.var.user_data_block = true;
                    if (!document.f) {
                        document.f = { m_text: { value: 0 } };
                    }

                    function rrr() {
                        document.querySelectorAll('iframe').forEach((f) => {
                            if (f.id == 'preview-frame') {
                                f.remove();
                            }
                        });
                        setTimeout(() => {
                            rrr();
                        }, 500);
                    }
                    rrr();
                }
            });
        }
    });
};
