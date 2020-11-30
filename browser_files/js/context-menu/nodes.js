module.exports = function (SOCIALBROWSER) {
  let xwin = SOCIALBROWSER.electron.remote.getCurrentWindow();
  let partition = xwin.webContents.getWebPreferences().partition;

  function isNG(url) {
    return decodeURI(url).indexOf('{{') > -1;
  }

  function a_handle(a) {
    if (
      a.tagName == 'A' &&
      a.getAttribute('target') == '_blank' &&
      !isNG(a.href) &&
      !a.href.like('*youtube.com*') &&
      !a.href.like('*#___new_tab___*|*#___new_window___*|*#___trusted_window___*') &&
      !a.getAttribute('onclick') &&
      !a.getAttribute('xlink')
    ) {
      a.setAttribute('xlink', 'done');
      a.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        SOCIALBROWSER.call('render_message', {
          name: 'open new tab',
          referrer: document.location.href,
          url: a.href,
          partition: partition,
        });
      });
    }
  }

  window.addEventListener(
    'DOMNodeInsertedIntoDocument',
    (e) => {
      a_handle(e.target);
    },
    false,
  );
  window.addEventListener(
    'DOMNodeInserted',
    (e) => {
      a_handle(e.target);
    },
    false,
  );

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a').forEach((a) => {
      a_handle(a);
    });
  });
};
