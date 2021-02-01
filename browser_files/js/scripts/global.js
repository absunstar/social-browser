module.exports = function (SOCIALBROWSER) {
  SOCIALBROWSER.log(' >>> Global script activated ...');

  if (SOCIALBROWSER.windowSetting) {
    SOCIALBROWSER.windowSetting.forEach((s) => {
      if (s.name == 'eventOff') {
        SOCIALBROWSER.eventOff += '|' + s.eventOff;
      }
    });
  }

  if (!SOCIALBROWSER.custom_request_header_list.find((r) => r.id == 'youtube_1')) {
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

  if (!SOCIALBROWSER.custom_request_header_list.find((r) => r.id == 'embed_1')) {
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
