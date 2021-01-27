module.exports = function (SOCIALBROWSER) {
  SOCIALBROWSER.log(' >>> Alexa script activated ...');

  if (SOCIALBROWSER.var.blocking.social.allow_alexa) {
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
  } else {
    SOCIALBROWSER.call('add-request-header', {
      id: 'alexa_1',
    });
  }
};
