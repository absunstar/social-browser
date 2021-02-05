module.exports = function (SOCIALBROWSER) {
  if (SOCIALBROWSER.is_white_site == true || document.location.href.like('*youtube.com*')) {
    SOCIALBROWSER.log(' [IFrame Blocking] OFF : ' + document.location.href);
    return;
  }

  SOCIALBROWSER.log(' >>> IFrame Activated');

  function iframesHandle(e) {
    if (SOCIALBROWSER.var.blocking.block_empty_iframe && e.target.tagName == 'IFRAME' && (!e.target.src || e.target.src == 'about:blank')) {
      e.target.remove();
    } else if (SOCIALBROWSER.var.blocking.remove_external_iframe && e.target.tagName == 'IFRAME' && !e.target.src.like(document.location.protocol + '//' + document.location.hostname + '*')) {
      e.target.remove();
    }
  }

  document.addEventListener('DOMNodeInserted', function (e) {
    iframesHandle(e);
  });

  document.addEventListener('DOMNodeInsertedIntoDocument', function (e) {
    iframesHandle(e);
  });
  
};
