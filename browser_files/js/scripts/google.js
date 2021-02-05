module.exports = function (SOCIALBROWSER) {
  // before css , image , iframes loaded
  document.addEventListener('DOMContentLoaded', () => {
    if (SOCIALBROWSER.var.blocking.privacy.show_bookmarks && document.querySelector('title') && document.querySelector('title').text == 'Google') {
      window.__showBookmarks();
    }
  });

  return;

  if (!document.location.host.like('*google*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> google script activated ...');

  SOCIALBROWSER.eventOff = 'DIV.HD8Pae luh4tb cUezCb xpd O9g5cc uUPGi';
  // SOCIALBROWSER.eventOn = '*window*';
  // SOCIALBROWSER.jqueryOff = '*mouseover*';
};
