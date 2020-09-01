module.exports = function (___) {

    // change readonly properties
    if (document.location.href.contains("http://127.0.0.1")) {
        return
    }

    if (___.var.blocking.privacy.set_window_active) {
        // make window active for ever
        window.addEventListener0 = window.addEventListener
        window.addEventListener = function (type, listener, options) {
            if (type.like('*visibilitychange*|*blur*')) {
                return
            }
            window.addEventListener0(type, listener, options)
        }
        document.hasFocus = () => true
    }

    if (___.var.blocking.privacy.hide_touch_screen) {
        let touch_screen = ['', true, false][___.__numberRange(0, 2)]
        if (touch_screen) {
            ___.__define(window, 'ontouchstart', () => '')
        } else {
            delete window.ontouchstart
        }
    }

    if (___.var.blocking.privacy.hide_vega) {

        ___.__define(WebGLRenderingContext, 'getParameter', () => '')
        ___.__define(WebGL2RenderingContext, 'getParameter', () => '')

    }

    if (___.var.blocking.privacy.hide_cpu) {
        ___.__define(navigator, 'hardwareConcurrency', ___.__numberRange(1, 20))
    }
    if (___.var.blocking.privacy.hide_memory) {
        ___.__define(navigator, 'deviceMemory', ___.__numberRange(4, 32))
    }

    if (___.var.blocking.privacy.hide_screen) {
        let scrren_size = ['1024x768', '1280x720', '3240x2160', '3000x2000', '2880x1800', '2736x1824', '2560x1700', '2160x1440', '2436x1125', '1920x1280', '1920x1080', '1366x768', '1440x1080', '1280x768', '800x600'][___.__numberRange(0, 14)].split('x')
        ___.__define(screen, 'width', scrren_size[0])
        ___.__define(screen, 'height', scrren_size[1])
        ___.__define(screen, 'availWidth', scrren_size[0])
        ___.__define(screen, 'availHeight', scrren_size[1])
        ___.__define(screen, 'pixelDepth', 24)
        ___.__define(navigator, 'MaxTouchPoints', ___.__numberRange(2, 8))

    }

    if (___.var.blocking.privacy.hide_lang) {
        ___.__define(navigator, 'languages', ['en-US'])
    }
    if (___.var.blocking.privacy.hide_connection) {
        ___.__define(navigator, 'connection', null)
    }
    if (___.var.blocking.privacy.hide_media_devices) {
        ___.__define(navigator, 'mediaDevices', null)
    }
    if (___.var.blocking.privacy.hide_mimetypes) {
        ___.__define(navigator, 'mimeTypes', [])
    }
    if (___.var.blocking.privacy.hide_plugins) {
        ___.__define(navigator, 'plugins', [])
    }
    if (___.var.blocking.privacy.hide_permissions) {
        ___.__define(navigator, 'permissions', {
            query: (permission) => {
                return new Promise((ok, err) => {
                    ok({
                        state: ['', 'granted', 'prompt', 'denied', ''][___.__numberRange(0, 4)]
                    })
                })
            }
        })
    }
    if (___.var.blocking.privacy.hide_battery) {
        ___.__define(navigator, 'getBattery', () => {
            return new Promise((ok, err) => {
                ok({
                    charging: [null, true, false][___.__numberRange(0, 2)],
                    chargingTime: 0,
                    dischargingTime: 0,
                    level: ___.__numberRange(0, 100) / 100,
                    onchargingchange: null,
                    onchargingtimechange: null,
                    ondischargingtimechange: null,
                    onlevelchange: null
                })
            })
        })
    }
    if (___.var.blocking.privacy.dnt) {
        ___.__define(navigator, 'doNotTrack', "1")
    } else {
        ___.__define(navigator, 'doNotTrack', "0")
    }

    // user agent
    let user_agent_set = false
    ___.var.sites.forEach(site => {
        if (document.location.href.like(site.url)) {
            ___.__define(navigator, 'userAgent', site.user_agent)
            user_agent_set = true
        }
    })
    if (!user_agent_set) {
        ___.__define(navigator, 'userAgent', ___.var.core.user_agent)
    }


    try {
        // localstorage
        if (localStorage) {
            window.localStorage0 = localStorage
            ___.__define(window, 'localStorage', {
                setItem: function (key, value) {
                    return localStorage0.setItem(key, value)
                },
                getItem: function (key) {
                    let value = localStorage0.getItem(key)
                    return value
                },
                get length() {
                    return localStorage0.length
                },
                removeItem: function (key) {
                    return localStorage0.removeItem(key)
                },
                clear: function () {
                    return localStorage0.clear()
                },
                key: function (index) {
                    return localStorage0.key(index)
                }
            })
        }
    } catch (error) {
        // console.log(error)
    }

    try {
        // sessionStorage
        if (sessionStorage) {
            window.sessionStorage0 = sessionStorage
            let hack = {
                setItem: function (key, value) {
                    return sessionStorage0.setItem(key, value)
                },
                getItem: function (key) {
                    let value = sessionStorage0.getItem(key)
                    return value
                },
                get length() {
                    return sessionStorage0.length
                },
                removeItem: function (key) {
                    return sessionStorage0.removeItem(key)
                },
                clear: function () {
                    return sessionStorage0.clear()
                },
                key: function (index) {
                    return sessionStorage0.key(index)
                }
            }

            ___.__define(window, 'sessionStorage', hack)
        }
    } catch (error) {
        //  console.log(error)
    }

}