module.exports = function (SOCIALBROWSER) {
  // change readonly properties
  // https://hidester.com/browser-fingerprint/

  /** site know your pc [screen , cpu , memory]
   *  user agent per profile + host (unique)
   *  cpu per profile
   *  memory per profile
   *  mimtype 0
   *  plugins 0
   *  screen size per profile
   *  timezone per profile
   *  battary info per profile
   *  connection off
   *  vega off
   *  rtc off
   *  language en
   *  browser permissions random
   */

  if (SOCIALBROWSER.var.core.disabled || SOCIALBROWSER.__options.windowType === 'main' || document.location.href.like('http://localhost*|https://localhost*|http://127.0.0.1*|https://127.0.0.1*|browser*')) {
    SOCIALBROWSER.log(' [Finger Printing] OFF : ' + document.location.href);
    return;
  }

  if (!(SOCIALBROWSER.var.blocking.privacy.enable_virtual_pc || SOCIALBROWSER.session.privacy.enable_virtual_pc)) {
    SOCIALBROWSER.log(' [Finger Printing] OFF (setting)');
    return;
  }

  if (!SOCIALBROWSER.session.privacy.enable_virtual_pc) {
    SOCIALBROWSER.session.privacy.vpc = SOCIALBROWSER.var.blocking.privacy.vpc;
  }

  if (SOCIALBROWSER.session.privacy.vpc.hide_cpu || SOCIALBROWSER.var.blocking.privacy.vpc.hide_cpu) {
    SOCIALBROWSER.__define(navigator, 'hardwareConcurrency', SOCIALBROWSER.session.privacy.vpc.cpu_count);
  }
  if (SOCIALBROWSER.session.privacy.vpc.hide_memory || SOCIALBROWSER.var.blocking.privacy.vpc.hide_memory) {
    SOCIALBROWSER.__define(navigator, 'deviceMemory', SOCIALBROWSER.session.privacy.vpc.memory_count);
  }
  if (SOCIALBROWSER.session.privacy.vpc.hide_screen || SOCIALBROWSER.var.blocking.privacy.vpc.hide_screen) {
    SOCIALBROWSER.__define(screen, 'width', SOCIALBROWSER.session.privacy.vpc.screen_width);
    SOCIALBROWSER.__define(screen, 'height', SOCIALBROWSER.session.privacy.vpc.screen_height);
    SOCIALBROWSER.__define(screen, 'availWidth', SOCIALBROWSER.session.privacy.vpc.screen_availWidth);
    SOCIALBROWSER.__define(screen, 'availHeight', SOCIALBROWSER.session.privacy.vpc.screen_availHeight);
  }
  if (SOCIALBROWSER.session.privacy.vpc.hide_lang || SOCIALBROWSER.var.blocking.privacy.vpc.hide_lang) {
    SOCIALBROWSER.session.privacy.vpc.languages = SOCIALBROWSER.session.privacy.vpc.languages || navigator.languages;
    if (Array.isArray(SOCIALBROWSER.session.privacy.vpc.languages)) {
      SOCIALBROWSER.__define(navigator, 'languages', SOCIALBROWSER.session.privacy.vpc.languages);
      SOCIALBROWSER.__define(navigator, 'language', SOCIALBROWSER.session.privacy.vpc.languages[0]);
    } else if (typeof SOCIALBROWSER.session.privacy.vpc.languages === 'string') {
      SOCIALBROWSER.__define(navigator, 'languages', SOCIALBROWSER.session.privacy.vpc.languages.split(','));
      SOCIALBROWSER.__define(navigator, 'language', SOCIALBROWSER.session.privacy.vpc.languages.split(',')[0]);
    }
  }
  if (SOCIALBROWSER.session.privacy.block_canvas) {
    document.createElement0 = document.createElement;
    document.createElement = function (name) {
      if (name == 'canvas') {
        return null;
      }
      return document.createElement0(name);
    };
  }
  if (SOCIALBROWSER.session.privacy.vpc.mask_date) {
    Date.prototype.getTimezoneOffset = function () {
      return SOCIALBROWSER.session.privacy.vpc.date_offset;
    };
    Date.prototype.toString0 = Date.prototype.toString;
    Date.prototype.toString = function () {
      return this.toString0()
        .replace('GMT+0200', 'GMT' + SOCIALBROWSER.session.privacy.vpc.date_offset)
        .replace(/\((.*)\)/, ` ( ${SOCIALBROWSER.session.privacy.vpc.date_offset} )`);
    };

    window.Intl.DateTimeFormat.prototype.resolvedOptions = function () {
      return {
        calendar: 'gregory',
        day: 'numeric',
        locale: navigator.language,
        month: 'numeric',
        numberingSystem: 'latn',
        timeZone: SOCIALBROWSER.session.privacy.vpc.date_offset.toString(),
        year: 'numeric',
      };
    };
  }

  if (SOCIALBROWSER.var.blocking.privacy.vpc.set_window_active) {
    SOCIALBROWSER.eventOff += 'document(mouseout)|document(pagehide)|document(hashchange)|document(popstate)|document(state-change)|document(visibilitychange)|document(webkitvisibilitychange)|document(blur)';
    SOCIALBROWSER.eventOff += 'window(mouseout)|window(pagehide)|window(hashchange)|window(popstate)|window(state-change)|window(visibilitychange)|window(webkitvisibilitychange)|window(blur)';

    document.hasFocus = () => true;
    SOCIALBROWSER.__define(document, 'hidden ', false);
    setInterval(() => {
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = document.onfocusin = document.onfocusout = null;
    }, 1000);
  }

  if (SOCIALBROWSER.var.blocking.privacy.vpc.block_rtc) {
    window.webkitRTCPeerConnection = null;
    window.RTCPeerConnection = null;
  }
  if (SOCIALBROWSER.var.blocking.privacy.vpc.hide_media_devices) {
    SOCIALBROWSER.navigator.mediaDevices = navigator.mediaDevices;
    SOCIALBROWSER.__define(navigator, 'mediaDevices', {
      ondevicechange: null,
      enumerateDevices: () => {
        return new Promise((resolve, reject) => {
          resolve([]);
        });
      },
      getUserMedia: () => {
        return new Promise((resolve, reject) => {
          reject('access block');
        });
      },
    });
  }

  if (SOCIALBROWSER.var.blocking.privacy.vpc.hide_vega) {
    SOCIALBROWSER.__define(WebGLRenderingContext, 'getParameter', () => '');
    SOCIALBROWSER.__define(WebGL2RenderingContext, 'getParameter', () => '');
  }

  if (SOCIALBROWSER.var.blocking.privacy.vpc.hide_mimetypes) {
    SOCIALBROWSER.navigator.mimeTypes = navigator.mimeTypes;
    SOCIALBROWSER.__define(navigator, 'mimeTypes', {
      length: 0,
      item: () => null,
      namedItem: () => null,
      refresh: () => {},
    });
  }
  if (SOCIALBROWSER.var.blocking.privacy.vpc.hide_plugins) {
    SOCIALBROWSER.navigator.plugins = navigator.plugins;
    SOCIALBROWSER.__define(navigator, 'plugins', {
      length: 0,
      item: () => null,
      namedItem: () => null,
      refresh: () => {},
    });
  }

  if (SOCIALBROWSER.session.privacy.vpc.hide_connection || SOCIALBROWSER.var.blocking.privacy.vpc.hide_connection) {
    SOCIALBROWSER.__define(navigator, 'connection', {
      onchange: null,
      effectiveType: SOCIALBROWSER.session.privacy.vpc.connection.effectiveType,
      rtt: SOCIALBROWSER.session.privacy.vpc.connection.rtt,
      downlink: SOCIALBROWSER.session.privacy.vpc.connection.downlink,
      saveData: false,
      type: SOCIALBROWSER.session.privacy.vpc.connection.type,
    });
  }

  if (SOCIALBROWSER.var.blocking.privacy.vpc.hide_permissions) {
    SOCIALBROWSER.navigator.permissions = navigator.permissions;
    SOCIALBROWSER.__define(navigator, 'permissions', {
      query: (permission) => {
        return new Promise((ok, err) => {
          ok({
            state: ['', 'granted', 'prompt', 'denied', ''][2],
          });
        });
      },
    });
  }

  if (SOCIALBROWSER.var.blocking.privacy.vpc.hide_battery) {
    SOCIALBROWSER.__define(navigator, 'getBattery', () => {
      return new Promise((ok, err) => {
        ok({
          charging: ['', null, true, false][SOCIALBROWSER.maxOf(SOCIALBROWSER.sessionId(), 3)],
          chargingTime: SOCIALBROWSER.maxOf(SOCIALBROWSER.sessionId(), 100),
          dischargingTime: 0,
          level: SOCIALBROWSER.maxOf(SOCIALBROWSER.sessionId(), 100) / 100,
          onchargingchange: null,
          onchargingtimechange: null,
          ondischargingtimechange: null,
          onlevelchange: null,
        });
      });
    });
  }
  if (SOCIALBROWSER.var.blocking.privacy.vpc.dnt) {
    SOCIALBROWSER.__define(navigator, 'doNotTrack', '1');
  } else {
    SOCIALBROWSER.__define(navigator, 'doNotTrack', '0');
  }
  SOCIALBROWSER.log(' [Finger Printing] ON : ' + document.location.href);
};
