module.exports = function (SOCIALBROWSER) {
  if (SOCIALBROWSER.var.core.javaScriptOFF || !document.location.hostname.like('*facebook.com*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> Facebook Activated');
  SOCIALBROWSER.var.blocking.facebook = SOCIALBROWSER.var.blocking.facebook || {};

  function init() {
    function addCss(css) {
      let head = document.head || document.querySelector('head');
      if (head) {
        let style = document.createElement('style');
        head.appendChild(style);
        style.type = 'text/css';
        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
      }
    }

    if (SOCIALBROWSER.var.blocking.facebook.color) {
      addCss(`
    ._2s1x ._2s1y {
    background-color: ${SOCIALBROWSER.var.blocking.facebook.color};
    }
`);
    }

    if (SOCIALBROWSER.var.blocking.facebook.remove_ads) {
      document.querySelectorAll('.pagelet , .pagelet-group.pagelet a[href*="/ad_"]').forEach((p) => p.remove());
      setInterval(() => {
        document.querySelectorAll('.pagelet').forEach((p) => p.remove());
      }, 1000 * 5);
    }

    if (document.location.href.like('*facebook.com*watch*') || document.location.href.like('*facebook.com*video*')) {
      let accept_cookies_interval = setInterval(() => {
        let btn = document.querySelector('button._42ft._4jy0._9o-t._4jy3._4jy1.selected._51sy');
        if (btn) {
          btn.click();
          clearInterval(accept_cookies_interval);
        }
      }, 1000);

      SOCIALBROWSER.play_btn_interval = setInterval(() => {
        let video = document.querySelector('video').paused;
        let play_btn = document.querySelector('button._zbd._2sm1._42ft');
        if (video.paused) {
          video.play();
          clearInterval(SOCIALBROWSER.play_btn_interval);
        }
      }, 1000 * 5);
    }
  }

  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      init();
    });
  }
};
