  if (SOCIALBROWSER.var.core.javaScriptOFF || SOCIALBROWSER.customSetting.windowType === 'main' || document.location.hostname.contains('localhost|127.0.0.1|browser') || !SOCIALBROWSER.var.blocking.block_ads) {
    SOCIALBROWSER.log('.... [ Ads Manager OFF ] .... ' + document.location.href);
    return;
  }
  SOCIALBROWSER.onLoad(() => {
    document.querySelectorAll('div').forEach((div) => {
      if (div.style.position == 'fixed' && !div.innerHTML) {
        div.parentNode.removeChild(div);
      } else if (div.className.contains('-adsssssss')) {
        div.parentNode.removeChild(div);
      }
    });
  });

