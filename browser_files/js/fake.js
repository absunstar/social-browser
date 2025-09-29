/** This Code Will Run Every Time Script Loaded  */

if (window.SOCIALBROWSER) {
    SOCIALBROWSER.log('Blocked URL <p><a> ##query.x-url## </a></p>');
}

window.queryOnLoad = '##query.onload##';
if (window[window.queryOnLoad]) {
    window[window.queryOnLoad]();
}

if (false) {
    window.grecaptcha = window.grecaptcha || {
        render: function (name, options) {
            if (options.callback) {
                setTimeout(() => {
                    options.callback();
                }, 1000);
            }
            if (options.sitekey) {
                window.grecaptcha.sitekey = options.sitekey;
            }
        },
        reset: function () {},
    };

    SOCIALBROWSER.__define(window, 'fuckAdBlock', {
        fnList: [],
        debug: {
            set: function (bool) {
                return window['fuckAdBlock'];
            },
        },

        setOption: function (fn) {},
        check: function () {
            setTimeout(() => {
                this.fnList.forEach((fn) => {
                    fn();
                });
            }, 100);
        },
        emitEvent: function (fn) {},
        clearEvent: function () {
            this.fnList = [];
        },
        on: function (detected, fn) {
            if (!detected) {
                this.onNotDetected(fn);
            }
            return this;
        },
        onNotDetected: function (fn) {
            this.fnList.push(fn);
            SOCIALBROWSER.onLoad(fn);
            return this;
        },
        _var: { event: { notDetected: [window] } },
    });

    SOCIALBROWSER.__define(window, 'FuckAdBlock', window['fuckAdBlock']);

    if (document.location.href.indexOf('egybest') !== -1) {
        SOCIALBROWSER.blockPopup = true;
        // SOCIALBROWSER.copyPopupURL = true;
        window._AdBlock_init = {};

        SOCIALBROWSER.onLoad(() => {
            setInterval(() => {
                if ((el = document.querySelector('#GlobalFrame'))) {
                    el.style.display = 'none';
                }
                if ((el = document.querySelector('#Shadow'))) {
                    el.style.display = 'none';
                }
                if ((el = document.querySelector('#body'))) {
                    el.classList.remove('hide');
                }
            }, 1000);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('body') && document.querySelector('body').innerHTML.like('*FuckAdBlock*')) {
            delete window['fuckAdBlock'];
            delete window['FuckAdBlock'];
        }

        if (document.location.href.like('*streamtape.com*')) {
            let p = document.querySelector('.plyr-container');
            if (p) {
                p.classList.remove('plyr-container');
                var style = document.createElement('style');
                style.id = 'mycss';
                style.type = 'text/css';
                style.innerText = `.plyr-container2{width: 100% !important;height: 100% !important;}`;
                document.getElementsByTagName('head')[0].appendChild(style);
                p.classList.add('plyr-container2');
            }
        }
    });
}
