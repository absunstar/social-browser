module.exports = function (SOCIALBROWSER) {
  SOCIALBROWSER.log(' >>> Alexa script activated ...');

  if (SOCIALBROWSER.var.blocking.social.allow_alexa) {
    if (!SOCIALBROWSER.custom_request_header_list.find((r) => r.id == 'alexa_1')) {
      SOCIALBROWSER.call('add-request-header', {
        id: 'alexa_1',
        url: '*',
        value_list: [
          {
            name: 'AlexaToolbar-ALX_NS_PH',
            value: 'AlexaToolbar/alx-4.0.5',
          },
        ],
      });
    }
  } else {
    if (SOCIALBROWSER.custom_request_header_list.find((r) => r.id == 'alexa_1')) {
      SOCIALBROWSER.call('remove-request-header', {
        id: 'alexa_1',
      });
    }
  }
};
