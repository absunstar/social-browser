if (document.location.hostname.contains('addmefast.com')) {
      if(SOCIALBROWSER.browserData.customSetting.$cloudFlare){
        return
    }
    SOCIALBROWSER.onLoad(() => {
        SOCIALBROWSER.log(' :: Addmefast Activated :: ' + document.location.href);

        SOCIALBROWSER.var.blocking.core.block_empty_iframe = false;

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

                        SOCIALBROWSER.ipc('[open new popup]', {
                            show: true,
                            partition: SOCIALBROWSER.partition,
                            url: url,
                            referrer: document.location.href,
                            iframe: true,
                            center: true,
                            allowAduio: false,
                        });
                    });
                }
            }
        });

        if (document.location.href.contains('reverbnation_fan|ok_group_join|askfm|pinterest|telegram|instagram|twitter|tiktok|soundcloud|youtube|facebook')) {
            SOCIALBROWSER.customSetting.allowURLs = '*addmefast*';
            SOCIALBROWSER.customSetting.timeout = 1000 * 20;

            let waitingNumber = SOCIALBROWSER.customSetting.timeout / 1000;

            clearInterval(SOCIALBROWSER.addmefastInterval);
            SOCIALBROWSER.addmefastInterval = setInterval(() => {
                if (waitingNumber > 0) {
                    alert('Waiting ' + waitingNumber + ' sec');
                }
                waitingNumber--;

                if ((single_like_button = document.querySelector('a.single_like_button'))) {
                    if (!single_like_button.id.like('*confirm*') && single_like_button.style.display != 'none') {
                        single_like_button.click();
                        single_like_button.style.display = 'none';
                        waitingNumber = SOCIALBROWSER.customSetting.timeout / 1000;
                    }
                }

                if ((content = document.querySelector('#content'))) {
                    if (content.innerText.contains('Please try later')) {
                        clearInterval(SOCIALBROWSER.addmefastInterval);
                        alert('Reload Page After : 10 sec', 1000 * 10);
                        setTimeout(() => {
                            document.location.reload();
                        }, 1000 * 10);
                        return;
                    }
                }
            }, 1000);

            window.open = function (url, _name, _specs, _replace_in_history) {
                let child_window = {
                    closed: false,
                    opener: window,
                    innerHeight: 1028,
                    innerWidth: 720,

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

                url = SOCIALBROWSER.handleURL(url);
                if (url.contains('youtube.com')) {
                    SOCIALBROWSER.customSetting.timeout = 1000 * 30;
                }

                let win = SOCIALBROWSER.openWindow({
                    width: _specs.width,
                    height: _specs.height,
                    url: url,
                    referrer: document.location.href,
                    show: false,
                    windowType: 'client-popup',
                    frame: true,
                    resizable: true,
                    skipTaskbar: false,
                    allowAduio: false,
                    vip: true,
                });

                child_window.postMessage = function (data, origin, transfer) {
                    win.postMessage(data, origin, transfer);
                };
                child_window.addEventListener = win.on;

                win.on('closed', (e) => {
                    child_window.postMessage = () => {};
                    child_window.eval = () => {};
                    child_window.closed = true;
                    let single_like_button = document.querySelector('a.single_like_button');
                    if (single_like_button && single_like_button.id.like('*confirm*') && single_like_button.style.display != 'none') {
                        single_like_button.click();
                        waitingNumber = 0;
                        alert('Collect POints');
                    }
                });

                child_window.eval = win.eval;

                child_window.close = win.close;

                child_window.win = win;

                return child_window;
            };

            if ((timeout = document.querySelector('#timeoutxxx'))) {
                if (timeout.style.display != 'none') {
                    alert('Reload Page After : 10 sec');
                    setTimeout(() => {
                        document.location.reload();
                    }, 1000 * 10);
                    return;
                }
            }
            if (document.querySelector('#content #content')) {
                alert('Reload Page After : 10 sec');
                setTimeout(() => {
                    document.location.reload();
                }, 1000 * 10);
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
