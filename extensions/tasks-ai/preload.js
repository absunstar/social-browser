module.exports = function (SOCIALBROWSER) {
    if (!document.location.hostname.contains('tasks-ai.com')) {
        return;
    }

    SOCIALBROWSER.onLoad(() => {
        // SOCIALBROWSER.customSetting.allowURLs = '*tasks-ai.com*|*';
        SOCIALBROWSER.allowPopup = true;
        SOCIALBROWSER.customSetting.allowAudio = false;
        SOCIALBROWSER.customSetting.allowDownload = false;
        SOCIALBROWSER.customSetting.allowSaveUrls = false;
        SOCIALBROWSER.customSetting.allowSaveUserData = false;
        SOCIALBROWSER.customSetting.iframe = true;

        window.addEventListener('load', () => {
            SOCIALBROWSER.__showBotImage();
        });
    });
};
