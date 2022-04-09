module.exports = function (SOCIALBROWSER) {
    SOCIALBROWSER.log(' >>> Core Extention activated : ' + document.location.href);

    if (SOCIALBROWSER.windowSetting) {
        SOCIALBROWSER.windowSetting.forEach((s) => {
            if (s.name == 'eventOff') {
                SOCIALBROWSER.eventOff += '|' + s.eventOff;
            } else if (s.name == 'eval') {
                if (s.code) {
                    try {
                        SOCIALBROWSER.eval(s.code);
                    } catch (error) {
                        SOCIALBROWSER.log(error);
                    }
                }
            } else if (s.name == 'youtube-view') {
                setInterval(() => {
                    if (SOCIALBROWSER.video_player) {
                        SOCIALBROWSER.video_player.playVideo();
                    }
                    if (window.document) {
                        document.querySelectorAll('a.yt-simple-endpoint.style-scope.yt-button-renderer').forEach((d, i) => {
                            if (i == 0) {
                                d.click();
                            }
                        });
                        document.querySelectorAll('iron-overlay-backdrop').forEach((d) => d.remove());
                        document.querySelectorAll('#dialog').forEach((d) => d.remove());
                    }
                }, 1000 * 5);
            }
        });
    }
};
