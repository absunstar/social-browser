module.exports = function (SOCIALBROWSER) {
  if (!SOCIALBROWSER.var.blocking.social.allow_wintub) {
    return;
  }
  if (!document.location.host.like('*wintub.com*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> wintub script activated ...');

  SOCIALBROWSER.var.blocking.block_empty_iframe = true;

  document.addEventListener('DOMContentLoaded', () => {

    window.__showBotImage();
    
    if (document.getElementById('skipdiv')) {
      window['counter'] = 35;
      window['playit'] = true;
      if (window['ytCounter']) {
        window['ytCounter']();
      }
    }
  });
};
