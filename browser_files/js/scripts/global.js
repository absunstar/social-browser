module.exports = function (SOCIALBROWSER) {

  SOCIALBROWSER.log(' >>> Global script activated ...');

  if (SOCIALBROWSER.windowSetting) {
    SOCIALBROWSER.windowSetting.forEach((s) => {
      if (s.name == 'eventOff') {
        SOCIALBROWSER.eventOff += '|' + s.eventOff;
      } else if (s.name == 'eval') {
        if (s.code) {
          SOCIALBROWSER.eval(s.code);
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

  if (!SOCIALBROWSER.var.custom_request_header_list.find((r) => r.id == 'youtube_1')) {
    SOCIALBROWSER.call('add-request-header', {
      id: 'youtube_1',
      url: '*youtu.be*|*www.youtube.com*',
      value_list: [
        {
          name: 'Host',
          value: 'https://www.youtube.com/',
        },
        {
          name: 'Referer',
          value: 'https://www.youtube.com/',
        },
      ],
    });
  }

  if (!SOCIALBROWSER.var.custom_request_header_list.find((r) => r.id == 'embed_1')) {
    SOCIALBROWSER.call('add-request-header', {
      id: 'embed_1',
      url: '*embed*',
      value_list: [
        {
          name: 'Referer',
          value: navigator.referer || document.location.href,
        },
        {
          name: 'sec-fetch-dest',
          value: `iframe`,
        },
        {
          name: 'sec-fetch-site',
          value: `cross-site`,
        },
      ],
      delete_list: ['Sec-Fetch-User'],
    });
  }
};
