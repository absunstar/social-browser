module.exports = function (SOCIALBROWSER) {
    if (
        SOCIALBROWSER.var.core.javaScriptOFF ||
        !SOCIALBROWSER.var.blocking.block_ads ||
        SOCIALBROWSER.customSetting.windowType === 'main' ||
        document.location.hostname.contains('localhost|127.0.0.1|browser')
    ) {
        SOCIALBROWSER.log('.... [ Ads Manager OFF ] .... ' + document.location.href);
        return;
    }
    SOCIALBROWSER.log('.... [ Ads Manager Activated ] .... ' + document.location.href);

    function changeAdsVAR() {
        SOCIALBROWSER.__setConstValue(navigator, 'webdriver', undefined);
        SOCIALBROWSER.__setConstValue(window, 'googleAd', true);
        SOCIALBROWSER.__setConstValue(window, 'canRunAds', true);
        SOCIALBROWSER.__setConstValue(window, 'adsNotBlocked', true);
        SOCIALBROWSER.__setConstValue(window, '$tieE3', true);
        SOCIALBROWSER.__setConstValue(window, '$zfgformats', []);
        SOCIALBROWSER.__setConstValue(window, 'adbDetectorLoaded', 'loaded');
        SOCIALBROWSER.__setConstValue(window, 'adblock', false);
        SOCIALBROWSER.__setConstValue(window, '_AdBlock_init', {});
        SOCIALBROWSER.__setConstValue(window, '_AdBlock', () => {});
        SOCIALBROWSER.__setConstValue(window, 'NativeAd', () => {});
        SOCIALBROWSER.__setConstValue(window, 'TsInPagePush', () => {});
        SOCIALBROWSER.__setConstValue(window, 'ExoLoader', {
            addZone: () => {},
            serve: () => {},
        });
        SOCIALBROWSER.__setConstValue(window, 'ExoVideoSlider', {
            init: () => {},
        });
    }

    changeAdsVAR();

    SOCIALBROWSER.onLoad(() => {});
};
