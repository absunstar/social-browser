module.exports = function (SOCIALBROWSER) {
  if (SOCIALBROWSER.is_white_site == true) {
    console.log(' [IFrame Blocking] OFF : ' + document.location.href);
    return;
  }

  if (document.location.href.like('*youtube.com*')) {
    return;
  }

  document.addEventListener('DOMNodeInserted', function (e) {
    if (SOCIALBROWSER.var.blocking.block_empty_iframe && e.target.tagName == 'IFRAME' && (!e.target.src || e.target.src == 'about:blank')) {
      e.target.remove();
    } else if (SOCIALBROWSER.var.blocking.remove_external_iframe && e.target.tagName == 'IFRAME' && !e.target.src.like(document.location.protocol + '//' + document.location.hostname + '*')) {
      e.target.remove();
    }
  });
};
