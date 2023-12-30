SOCIALBROWSER.log('.... [ Core Extention activated ] .... ' + document.location.href);

if (SOCIALBROWSER.customSetting.windowSetting) {
  SOCIALBROWSER.customSetting.windowSetting.forEach((s) => {
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
    }
  });
}

if (SOCIALBROWSER.isIframe()) {
  SOCIALBROWSER.onLoad(() => {
    SOCIALBROWSER.message({ windowID: SOCIALBROWSER.remote.getCurrentWindow().id, changeTitle: document.title });
  });
} else {
  SOCIALBROWSER.on('message', (e, message) => {
    if (message.changeTitle) {
      document.title = message.changeTitle;
    }
  });
}
