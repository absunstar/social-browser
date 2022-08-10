module.exports = function (SOCIALBROWSER) {
  if (SOCIALBROWSER.var.core.javaScriptOFF || !SOCIALBROWSER.var.blocking.social.allow_exeio) {
    return;
  }

  if (!document.location.href.like('https://exe.app*|https://exe.io*')) {

    return;
    
    SOCIALBROWSER.exeio_url = 'https://exe.io/st?api=f9b3b6a8a832bdc575cf6d4e7f3bea64431329f4&url={url}';

    function isNG(url) {
      return decodeURI(url).indexOf('{{') > -1;
    }

    function a_handle(a) {
      if (
        a.tagName == 'A' &&
        a.href &&
        !a.className.like('*btn-goo*') &&
        !a.id.like('*invisibleCaptchaShortlink*') &&
        !isNG(a.href) &&
        !a.href.like('*youtube.com*') &&
        !a.href.like('*#___new_tab___*|*#___new_popup___*|*#___trusted_window___*') &&
        !a.getAttribute('onclick') &&
        !a.getAttribute('xlink') &&
        !a.href.like('https://exe*')
      ) {
        a.setAttribute('xlink', 'done');
        if (!a.href.like('*?*|*=*')) {
          a.setAttribute('href', SOCIALBROWSER.exeio_url.replace('{url}', a.href));
        }
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

    return;
  }

  SOCIALBROWSER.log(' >>> exe.io Script Activated');

  SOCIALBROWSER.var.blocking.core.block_empty_iframe = true;

  document.addEventListener('DOMContentLoaded', () => {

    SOCIALBROWSER.__showBotImage();
    
    if (!document.location.href.like('*?*') && document.location.pathname.split('/').length == 2) {
      let form = document.querySelector('form');
      if (form) {
        form.submit();
      }
    } else if (document.location.href.like('https://exe.app*')) {
      setInterval(() => {
        let a = document.querySelector('#invisibleCaptchaShortlink');
        if (a) {
          a.click();
        } else {
          let a = document.querySelector('a.btn-goo.get-link');
          if (a) {
            a.click();
          }
        }
      }, 1000 * 5);
    }
  });
};
