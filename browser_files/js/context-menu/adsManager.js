  if (SOCIALBROWSER.var.core.javaScriptOFF || SOCIALBROWSER.customSetting.windowType === 'main' || document.location.hostname.contains('localhost|127.0.0.1|browser') || !SOCIALBROWSER.var.blocking.block_ads) {
    SOCIALBROWSER.log('.... [ Ads Manager OFF ] .... ' + document.location.href);
    return;
  }
  SOCIALBROWSER.log('.... [ Ads Manager Activated ] .... ' + document.location.href);

 window.canRunAds = true;

  SOCIALBROWSER.onLoad(() => {
   
  });

