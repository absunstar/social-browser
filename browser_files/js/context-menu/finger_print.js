module.exports = function (SOCIALBROWSER) {
  // change readonly properties
  // https://hidester.com/browser-fingerprint/

  if (document.location.href.like('*http://127.0.0.1*')) {
    console.log(' [Finger Printing] OFF : ' + document.location.href);
    return;
  }
 

  window.mozRTCPeerConnection = window.webkitRTCPeerConnection;

  if (SOCIALBROWSER.var.blocking.privacy.set_window_active) {
    // make window active for ever
    let events = '*mouseout*|pagehide*|*hashchange*|*popstate*|*state-change*|*visibilitychange*|*mozvisibilitychange*|*webkitvisibilitychange*|*msvisibilitychange*|*blur*'
    window.addEventListener0 = window.addEventListener;
    window.addEventListener = function (type, listener, options) {
      if (type.like(events)) {
        return;
      }
      window.addEventListener0(type, listener, options);
    };
    document.addEventListener0 = document.addEventListener;
    document.addEventListener = function (type, listener, options) {
      if (type.like(events)) {
        return;
      }
      document.addEventListener0(type, listener, options);
    };
   document.hasFocus = () => true;
    SOCIALBROWSER.__define(document, 'hidden ', false);
    // SOCIALBROWSER.__define(document, 'hasFocus ', () => true);
    setInterval(() => {
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = document.onfocusin = document.onfocusout = null;
    }, 1000);
  }

  if (SOCIALBROWSER.var.blocking.privacy.block_rtc) {
    window.mozRTCPeerConnection = null;
    window.webkitRTCPeerConnection = null;
    window.RTCPeerConnection = null;
  }
  if (SOCIALBROWSER.var.blocking.privacy.hide_media_devices) {
    SOCIALBROWSER.__define(navigator, 'mediaDevices', null);
  }

  if (SOCIALBROWSER.var.blocking.privacy.hide_touch_screen) {
    let touch_screen = ['', true, false][SOCIALBROWSER.__numberRange(0, 2)];
    if (touch_screen) {
      SOCIALBROWSER.__define(window, 'ontouchstart', () => '');
    } else {
      delete window.ontouchstart;
    }
  }

  if (SOCIALBROWSER.var.blocking.privacy.hide_vega) {
    SOCIALBROWSER.__define(WebGLRenderingContext, 'getParameter', () => '');
    SOCIALBROWSER.__define(WebGL2RenderingContext, 'getParameter', () => '');
  }

  if (SOCIALBROWSER.var.blocking.privacy.hide_cpu) {
    SOCIALBROWSER.__define(navigator, 'hardwareConcurrency', SOCIALBROWSER.__numberRange(1, 20));
  }
  if (SOCIALBROWSER.var.blocking.privacy.hide_memory) {
    SOCIALBROWSER.__define(navigator, 'deviceMemory', SOCIALBROWSER.__numberRange(4, 32));
  }

  if (SOCIALBROWSER.var.blocking.privacy.hide_screen) {
    let scrren_size = [
      '1024x768',
      '1280x720',
      '3240x2160',
      '3000x2000',
      '2880x1800',
      '2736x1824',
      '2560x1700',
      '2160x1440',
      '2436x1125',
      '1920x1280',
      '1920x1080',
      '1366x768',
      '1440x1080',
      '1280x768',
      '800x600',
    ][SOCIALBROWSER.__numberRange(0, 14)].split('x');
    SOCIALBROWSER.__define(window, 'devicePixelRatio', 1);
    SOCIALBROWSER.__define(screen, 'width', scrren_size[0]);
    SOCIALBROWSER.__define(screen, 'height', scrren_size[1]);
    SOCIALBROWSER.__define(screen, 'availWidth', scrren_size[0]);
    SOCIALBROWSER.__define(screen, 'availHeight', scrren_size[1]);
    SOCIALBROWSER.__define(screen, 'pixelDepth', 24);
    SOCIALBROWSER.__define(navigator, 'MaxTouchPoints', SOCIALBROWSER.__numberRange(2, 8));
  }

  if (SOCIALBROWSER.var.blocking.privacy.hide_lang) {
    SOCIALBROWSER.__define(navigator, 'languages', ['en-US']);
  }
  if (SOCIALBROWSER.var.blocking.privacy.hide_connection) {
    SOCIALBROWSER.__define(navigator, 'connection', null);
  }

  if (SOCIALBROWSER.var.blocking.privacy.hide_mimetypes) {
    SOCIALBROWSER.__define(navigator, 'mimeTypes', []);
  }
  if (SOCIALBROWSER.var.blocking.privacy.hide_plugins) {
    SOCIALBROWSER.__define(navigator, 'plugins', { length: 0, refresh: () => {} });
  }
  if (SOCIALBROWSER.var.blocking.privacy.hide_permissions) {
    SOCIALBROWSER.__define(navigator, 'permissions', {
      query: (permission) => {
        return new Promise((ok, err) => {
          ok({
            state: ['', 'granted', 'prompt', 'denied', ''][SOCIALBROWSER.__numberRange(0, 4)],
          });
        });
      },
    });
  }
  if (SOCIALBROWSER.var.blocking.privacy.hide_battery) {
    SOCIALBROWSER.__define(navigator, 'getBattery', () => {
      return new Promise((ok, err) => {
        ok({
          charging: [null, true, false][SOCIALBROWSER.__numberRange(0, 2)],
          chargingTime: 0,
          dischargingTime: 0,
          level: SOCIALBROWSER.__numberRange(0, 100) / 100,
          onchargingchange: null,
          onchargingtimechange: null,
          ondischargingtimechange: null,
          onlevelchange: null,
        });
      });
    });
  }
  if (SOCIALBROWSER.var.blocking.privacy.dnt) {
    SOCIALBROWSER.__define(navigator, 'doNotTrack', '1');
  } else {
    SOCIALBROWSER.__define(navigator, 'doNotTrack', '0');
  }

  try {
    // localstorage
    if (localStorage) {
      window.localStorage0 = localStorage;
      SOCIALBROWSER.__define(window, 'localStorage', {
        setItem: function (key, value) {
          return localStorage0.setItem(key, value);
        },
        getItem: function (key) {
          let value = localStorage0.getItem(key);
          return value;
        },
        get length() {
          return localStorage0.length;
        },
        removeItem: function (key) {
          return localStorage0.removeItem(key);
        },
        clear: function () {
          return localStorage0.clear();
        },
        key: function (index) {
          return localStorage0.key(index);
        },
      });
    }
  } catch (error) {
    // console.log(error)
  }

  try {
    // sessionStorage
    if (sessionStorage) {
      window.sessionStorage0 = sessionStorage;
      let hack = {
        setItem: function (key, value) {
          return sessionStorage0.setItem(key, value);
        },
        getItem: function (key) {
          let value = sessionStorage0.getItem(key);
          return value;
        },
        get length() {
          return sessionStorage0.length;
        },
        removeItem: function (key) {
          return sessionStorage0.removeItem(key);
        },
        clear: function () {
          return sessionStorage0.clear();
        },
        key: function (index) {
          return sessionStorage0.key(index);
        },
      };

      SOCIALBROWSER.__define(window, 'sessionStorage', hack);
    }
  } catch (error) {
    //  console.log(error)
  }
};
