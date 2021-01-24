module.exports = function (SOCIALBROWSER) {
  if (!document.location.href.like('*wintub.com*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> wintub script activated ...');

  SOCIALBROWSER.var.blocking.block_empty_iframe = true;

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('skipdiv')) {
      window['counter'] = 35;
      window['playit'] = true;
      if (window['ytCounter']) {
        window['ytCounter']();
      }
    }
  });
};
