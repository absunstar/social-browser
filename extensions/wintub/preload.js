module.exports = function (SOCIALBROWSER) {
    if (!document.location.hostname.like('*wintub.com*')) {
        return;
    }
    SOCIALBROWSER.var.blocking.social.allow_wintub = true;
    SOCIALBROWSER.log(' >>> wintub script activated ...');

    SOCIALBROWSER.var.blocking.core.block_empty_iframe = true;
    SOCIALBROWSER.onLoad(() => {
        SOCIALBROWSER.__showBotImage();

        if (document.getElementById('skipdiv')) {
            window['counter'] = 35;
            window['playit'] = true;
            if (window['ytCounter']) {
                window['ytCounter']();
            }
        }
    });
};
