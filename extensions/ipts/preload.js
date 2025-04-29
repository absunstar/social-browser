module.exports = function (SOCIALBROWSER, window, document) {
    if (!document.location.hostname.like('*webui*')) {
        return;
    }

    alert('IPTS Activated');

    window['webUI'] = {
        config: {},
        callback: function () {},
        setCallback: function (fn) {
            this.callback = fn;
        },
        getConfig: function (d) {
            if (d) {
                this.setConfig(d);
            }
            return this.config;
        },
        setConfig: function (d) {
            console.log('setConfig', d);
            if (Array.isArray(d)) {
                d.forEach((item) => {
                    this.config[item] = '';
                });
            } else {
                for (const [key, value] of Object.entries(d)) {
                    this.config[key] = value;
                }
            }
        },
        version: function () {
            return '2.4.0';
        },
        clientOnLine: function () {
            webUI.callback(WebUIMessage.kClientOnline, { err: REQ_ERROR_CODE.CR_RET_OK });
        },
        getDisplaySN: function (...arg) {
            return 'Social Browser';
        },
        webNavControl: function (...arg) {
            console.log('webNavControl', ...arg);
        },
        clientUrlMgr: function (a, b) {
            console.log('clientUrlMgr', a, b);
            MainPage.AddSiteBack(b);
        },
        importUrlData: function (...arg) {
            console.log('importUrlData', ...arg);
        },
        clientTaskTest: function (...arg) {
            console.log('clientTaskTest', ...arg);
        },
    };

    SOCIALBROWSER.onLoad(() => {
        SOCIALBROWSER.__showBotImage();

        $('#Div_Traffic_Mode').show();
        $('#Div_Idling_Mode').hide();
        $('#Span_Run_Mode').text(g_lang14);
        $('#A_Run_Mode').text(g_lang15);
        0 < MainPage.m_objWebUIConfig[WebUIPrefType.MAX_WORKLOAD] && MainPage.LoadUrls();

        setInterval(() => {
            MainPage.ShowLoading(!1);
        }, 1000 * 3);
    });
};
