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
 *  current location hide
 */

if (SOCIALBROWSER.var.core.javaScriptOFF || SOCIALBROWSER.customSetting.windowType === 'main' || !SOCIALBROWSER.session.privacy.enable_virtual_pc) {
  SOCIALBROWSER.log('.... [ Finger Printing OFF ] .... ' + document.location.href);
  return;
}

if (SOCIALBROWSER.session.privacy.vpc.hide_cpu) {
  SOCIALBROWSER.__define(navigator, 'hardwareConcurrency', SOCIALBROWSER.session.privacy.vpc.cpu_count);
}
if (SOCIALBROWSER.session.privacy.vpc.hide_memory) {
  SOCIALBROWSER.__define(navigator, 'deviceMemory', SOCIALBROWSER.session.privacy.vpc.memory_count);
}
if (SOCIALBROWSER.session.privacy.vpc.hide_screen && SOCIALBROWSER.session.privacy.vpc.screen) {
  SOCIALBROWSER.__define(window, 'innerWidth', SOCIALBROWSER.session.privacy.vpc.screen.width);
  SOCIALBROWSER.__define(window, 'innerHeight', SOCIALBROWSER.session.privacy.vpc.screen.height);
  SOCIALBROWSER.__define(window, 'outerWidth', SOCIALBROWSER.session.privacy.vpc.screen.width);
  SOCIALBROWSER.__define(window, 'outerHeight', SOCIALBROWSER.session.privacy.vpc.screen.height);
  SOCIALBROWSER.__define(screen, 'width', SOCIALBROWSER.session.privacy.vpc.screen.width);
  SOCIALBROWSER.__define(screen, 'height', SOCIALBROWSER.session.privacy.vpc.screen.height);
  SOCIALBROWSER.__define(screen, 'availWidth', SOCIALBROWSER.session.privacy.vpc.screen.availWidth);
  SOCIALBROWSER.__define(screen, 'availHeight', SOCIALBROWSER.session.privacy.vpc.screen.availHeight);
  SOCIALBROWSER.screenHidden = true;
}
if (SOCIALBROWSER.session.privacy.vpc.hide_lang) {
  SOCIALBROWSER.session.privacy.vpc.languages = SOCIALBROWSER.session.privacy.vpc.languages || SOCIALBROWSER.languageList[0] || navigator.languages;
  if (Array.isArray(SOCIALBROWSER.session.privacy.vpc.languages)) {
    SOCIALBROWSER.__define(navigator, 'languages', SOCIALBROWSER.session.privacy.vpc.languages);
    SOCIALBROWSER.__define(navigator, 'language', SOCIALBROWSER.session.privacy.vpc.languages[0]);
  } else if (typeof SOCIALBROWSER.session.privacy.vpc.languages === 'string') {
    SOCIALBROWSER.__define(navigator, 'languages', SOCIALBROWSER.session.privacy.vpc.languages.split(','));
    SOCIALBROWSER.__define(navigator, 'language', SOCIALBROWSER.session.privacy.vpc.languages.split(',')[0]);
  }
}
if (SOCIALBROWSER.session.privacy.vpc.hide_canvas) {
  /*document.createElement0 = document.createElement;
    document.createElement = function (name) {
      if (name == 'canvas') {
        return null;
      }
      return document.createElement0(name);
    };*/
  SOCIALBROWSER.canvas = {};
  SOCIALBROWSER.canvas.toBlob = HTMLCanvasElement.prototype.toBlob;
  SOCIALBROWSER.canvas.toDataURL = HTMLCanvasElement.prototype.toDataURL;
  SOCIALBROWSER.canvas.getImageData = CanvasRenderingContext2D.prototype.getImageData;
  SOCIALBROWSER.canvas.noisify = function (canvas, context) {
    if (context) {
      let shift;
      let canvas_shift = SOCIALBROWSER.get('canvas_shift');
      if (canvas_shift) {
        shift = canvas_shift;
      } else {
        shift = {
          r: Math.floor(Math.random() * 10) - 5,
          g: Math.floor(Math.random() * 10) - 5,
          b: Math.floor(Math.random() * 10) - 5,
          a: Math.floor(Math.random() * 10) - 5,
        };
        SOCIALBROWSER.set('canvas_shift', shift);
      }

      const width = canvas.width;
      const height = canvas.height;
      if (width && height) {
        const imageData = SOCIALBROWSER.canvas.getImageData.apply(context, [0, 0, width, height]);
        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            const n = i * (width * 4) + j * 4;
            imageData.data[n + 0] = imageData.data[n + 0] + shift.r;
            imageData.data[n + 1] = imageData.data[n + 1] + shift.g;
            imageData.data[n + 2] = imageData.data[n + 2] + shift.b;
            imageData.data[n + 3] = imageData.data[n + 3] + shift.a;
          }
        }

        context.putImageData(imageData, 0, 0);
      }
    }
  };
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function () {
      SOCIALBROWSER.canvas.noisify(this, this.getContext('2d'));
      return SOCIALBROWSER.canvas.toBlob.apply(this, arguments);
    },
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
    value: function () {
      SOCIALBROWSER.canvas.noisify(this, this.getContext('2d'));
      return SOCIALBROWSER.canvas.toDataURL.apply(this, arguments);
    },
  });
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'getImageData', {
    value: function () {
      SOCIALBROWSER.canvas.noisify(this.canvas, this);
      return SOCIALBROWSER.canvas.getImageData.apply(this, arguments);
    },
  });
}
if (SOCIALBROWSER.session.privacy.vpc.mask_date && SOCIALBROWSER.session.privacy.vpc.timeZone) {
  (function (o, acOffset) {
    const gmtNeg = function (n) {
      const _format = function (v) {
        return (v < 10 ? '0' : '') + v;
      };
      return (n <= 0 ? '+' : '-') + _format((Math.abs(n) / 60) | 0) + _format(Math.abs(n) % 60);
    };

    const GMT = function (n) {
      const _format = function (v) {
        return (v < 10 ? '0' : '') + v;
      };
      return (n <= 0 ? '-' : '+') + _format((Math.abs(n) / 60) | 0) + _format(Math.abs(n) % 60);
    };

    const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
    const { getDay, getDate, getYear, getMonth, getHours, toString, getMinutes, getSeconds, getFullYear, toLocaleString, getMilliseconds, getTimezoneOffset, toLocaleTimeString, toLocaleDateString } =
      Date.prototype;

    Object.defineProperty(Date.prototype, '_offset', {
      configurable: true,
      get() {
        return getTimezoneOffset.call(this);
      },
    });
    Object.defineProperty(Date.prototype, '_date', {
      configurable: true,
      get() {
        return this._nd === undefined ? new Date(this.getTime() + (this._offset + o.offset * 60) * 60 * 1000) : this._nd;
      },
    });

    Object.defineProperty(Date.prototype, 'getDay', {
      value: function () {
        return getDay.call(this._date);
      },
    });

    Object.defineProperty(Date.prototype, 'getDate', {
      value: function () {
        return getDate.call(this._date);
      },
    });
    Object.defineProperty(Date.prototype, 'getYear', {
      value: function () {
        return getYear.call(this._date);
      },
    });
    Object.defineProperty(Date.prototype, 'getTimezoneOffset', {
      value: function () {
        return Number(o.offset * 60);
      },
    });
    Object.defineProperty(Date.prototype, 'getMonth', {
      value: function () {
        return getMonth.call(this._date);
      },
    });
    Object.defineProperty(Date.prototype, 'getHours', {
      value: function () {
        return getHours.call(this._date);
      },
    });
    Object.defineProperty(Date.prototype, 'getMinutes', {
      value: function () {
        return getMinutes.call(this._date);
      },
    });
    Object.defineProperty(Date.prototype, 'getSeconds', {
      value: function () {
        return getSeconds.call(this._date);
      },
    });
    Object.defineProperty(Date.prototype, 'getFullYear', {
      value: function () {
        return getFullYear.call(this._date);
      },
    });

    Object.defineProperty(Date.prototype, 'getMilliseconds', {
      value: function () {
        return getMilliseconds.call(this._date);
      },
    });
    Object.defineProperty(Date.prototype, 'toLocaleString', {
      value: function () {
        return toLocaleString.call(this._date);
      },
    });
    Object.defineProperty(Date.prototype, 'toLocaleTimeString', {
      value: function () {
        return toLocaleTimeString.call(this._date);
      },
    });
    Object.defineProperty(Date.prototype, 'toLocaleDateString', {
      value: function () {
        return toLocaleDateString.call(this._date);
      },
    });

    Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
      value: function () {
        return Object.assign(resolvedOptions, { timeZone: o.text, locale: SOCIALBROWSER.session.privacy.vpc.languages });
      },
    });
    Object.defineProperty(Date.prototype, 'toString', {
      value: function () {
        return toString
          .call(this._date)
          .replace(gmtNeg(acOffset), GMT(o.offset * 60))
          .replace(/\(.*\)/, '(' + o.value + ')');
      },
    });
  })(SOCIALBROWSER.session.privacy.vpc.timeZone, new Date().getTimezoneOffset());
}

if (SOCIALBROWSER.session.privacy.vpc.set_window_active) {
  document.__proto__.hasFocus = function () {
    return true;
  };
  SOCIALBROWSER.__define(document, 'hidden ', false);
  SOCIALBROWSER.__define(document, 'mozHidden ', false);
  SOCIALBROWSER.__define(document, 'webkitHidden ', false);
  SOCIALBROWSER.__define(document, 'visibilityState ', 'visible');
  SOCIALBROWSER.blockEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  document.addEventListener('visibilitychange', SOCIALBROWSER.blockEvent, true);
  document.addEventListener('webkitvisibilitychange', SOCIALBROWSER.blockEvent, true);
  document.addEventListener('mozvisibilitychange', SOCIALBROWSER.blockEvent, true);
  document.addEventListener('hasFocus', SOCIALBROWSER.blockEvent, true);
  document.addEventListener('blur', SOCIALBROWSER.blockEvent, true);
  window.addEventListener('blur', SOCIALBROWSER.blockEvent, true);
  window.addEventListener('mouseleave', SOCIALBROWSER.blockEvent, true);
  setInterval(() => {
    window.onpagehide = window.onblur = document.onfocusout = null;
  }, 1000);
}

if (SOCIALBROWSER.session.privacy.vpc.block_rtc) {
  SOCIALBROWSER.webContents.setWebRTCIPHandlingPolicy('disable_non_proxied_udp');

  navigator.getUserMedia = undefined;
  window.MediaStreamTrack = undefined;
  window.RTCPeerConnection = undefined;
  window.RTCSessionDescription = undefined;

  navigator.mozGetUserMedia = undefined;
  window.mozMediaStreamTrack = undefined;
  window.mozRTCPeerConnection = undefined;
  window.mozRTCSessionDescription = undefined;

  navigator.webkitGetUserMedia = undefined;
  window.webkitMediaStreamTrack = undefined;
  window.webkitRTCPeerConnection = undefined;
  window.webkitRTCSessionDescription = undefined;
}
if (SOCIALBROWSER.session.privacy.vpc.hide_media_devices) {
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

if (SOCIALBROWSER.session.privacy.vpc.hide_audio) {
  SOCIALBROWSER.audioContext = {
    BUFFER: null,
    getChannelData: function (e) {
      const getChannelData = e.prototype.getChannelData;
      Object.defineProperty(e.prototype, 'getChannelData', {
        value: function () {
          const results_1 = getChannelData.apply(this, arguments);
          if (SOCIALBROWSER.audioContext.BUFFER !== results_1) {
            SOCIALBROWSER.audioContext.BUFFER = results_1;
            window.top.postMessage('audiocontext-fingerprint-defender-alert', '*');

            let audio_r1_idx = SOCIALBROWSER.get('audio_r1_idx');
            let audio_r1_vx = SOCIALBROWSER.get('audio_r1_vx');
            if (audio_r1_idx && audio_r1_vx) {
              for (let iter = 0, i = 0; i < results_1.length; i += 100, iter += 1) {
                let index = audio_r1_idx[iter];
                let val = audio_r1_vx[iter];
                results_1[index] = results_1[index] + val;
              }
            } else {
              let indxs = [];
              let vals = [];
              for (let i = 0; i < results_1.length; i += 100) {
                let index = Math.floor(Math.random() * i);
                let val = Math.random() * 0.0000001;
                indxs.push(index);
                vals.push(val);
                results_1[index] = results_1[index] + val;
              }
              SOCIALBROWSER.set('audio_r1_idx', indxs);
              SOCIALBROWSER.set('audio_r1_vx', vals);
            }
          }

          return results_1;
        },
      });
    },

    createAnalyser: function (e) {
      const createAnalyser = e.prototype.__proto__.createAnalyser;
      Object.defineProperty(e.prototype.__proto__, 'createAnalyser', {
        value: function () {
          const results_2 = createAnalyser.apply(this, arguments);
          const getFloatFrequencyData = results_2.__proto__.getFloatFrequencyData;
          Object.defineProperty(results_2.__proto__, 'getFloatFrequencyData', {
            value: function () {
              window.top.postMessage('audiocontext-fingerprint-defender-alert', '*');
              const results_3 = getFloatFrequencyData.apply(this, arguments);

              let audio_r3_idx = SOCIALBROWSER.get('audio_r3_idx');
              let audio_r3_vx = SOCIALBROWSER.get('audio_r3_vx');
              if (audio_r3_idx && audio_r3_vx) {
                for (let iter = 0, i = 0; i < audio_r3_idx.length; i += 100, iter += 1) {
                  let index = audio_r3_idx[iter];
                  let val = audio_r3_vx[iter];
                  arguments[0][index] = arguments[0][index] + val;
                }
              } else {
                let indxs = [];
                let vals = [];
                for (var i = 0; i < arguments[0].length; i += 100) {
                  let index = Math.floor(Math.random() * i);
                  let val = Math.random() * 0.1;
                  indxs.push(index);
                  vals.push(val);
                  arguments[0][index] = arguments[0][index] + val;
                }
                SOCIALBROWSER.set('audio_r3_idx', indxs);
                SOCIALBROWSER.set('audio_r3_vx', vals);
              }
              return results_3;
            },
          });
          return results_2;
        },
      });
    },
  };
  SOCIALBROWSER.audioContext.getChannelData(AudioBuffer);
  SOCIALBROWSER.audioContext.createAnalyser(AudioContext);
  SOCIALBROWSER.audioContext.getChannelData(OfflineAudioContext);
  SOCIALBROWSER.audioContext.createAnalyser(OfflineAudioContext);
}

if (SOCIALBROWSER.session.privacy.vpc.hide_webgl) {
  SOCIALBROWSER.__define(WebGLRenderingContext, 'getParameter', () => '');
  SOCIALBROWSER.__define(WebGL2RenderingContext, 'getParameter', () => '');
  SOCIALBROWSER.configWebGL = {
    random: {
      value: function (key = false) {
        let rand;
        if (key) {
          let get = SOCIALBROWSER.get('webgl_rv_' + key);
          rand = get ? get : Math.random();
          if (!get) SOCIALBROWSER.set('webgl_rv_' + key, rand);
        } else {
          rand = Math.random();
        }
        return rand;
      },
      item: function (key, e) {
        let get = SOCIALBROWSER.get('webgl_' + key);
        let rand = get ? get : e.length * SOCIALBROWSER.configWebGL.random.value();
        if (!get) SOCIALBROWSER.set('webgl_' + key, rand);
        return e[Math.floor(rand)];
      },
      number: function (key, power) {
        var tmp = [];
        for (var i = 0; i < power.length; i++) {
          tmp.push(Math.pow(2, power[i]));
        }
        return SOCIALBROWSER.configWebGL.random.item(key, tmp);
      },
      int: function (key, power) {
        var tmp = [];
        for (var i = 0; i < power.length; i++) {
          var n = Math.pow(2, power[i]);
          tmp.push(new Int32Array([n, n]));
        }
        return SOCIALBROWSER.configWebGL.random.item(key, tmp);
      },
      float: function (key, power) {
        var tmp = [];
        for (var i = 0; i < power.length; i++) {
          var n = Math.pow(2, power[i]);
          tmp.push(new Float32Array([1, n]));
        }
        return SOCIALBROWSER.configWebGL.random.item(key, tmp);
      },
    },
    spoof: {
      webgl: {
        buffer: function (target) {
          var proto = target.prototype ? target.prototype : target.__proto__;
          const bufferData = proto.bufferData;
          Object.defineProperty(proto, 'bufferData', {
            value: function () {
              var index = Math.floor(SOCIALBROWSER.configWebGL.random.value('bufferDataIndex') * arguments[1].length);
              var noise = arguments[1][index] !== undefined ? 0.1 * SOCIALBROWSER.configWebGL.random.value('bufferDataNoise') * arguments[1][index] : 0;
              arguments[1][index] = arguments[1][index] + noise;
              return bufferData.apply(this, arguments);
            },
          });
        },
        parameter: function (target) {
          var proto = target.prototype ? target.prototype : target.__proto__;
          const getParameter = proto.getParameter;
          Object.defineProperty(proto, 'getParameter', {
            value: function () {
              if (arguments[0] === 3415) return 0;
              else if (arguments[0] === 3414) return 24;
              else if (arguments[0] === 36348) return 30;
              else if (arguments[0] === 7936) return 'WebKit';
              else if (arguments[0] === 37445) return 'Google Inc.';
              else if (arguments[0] === 7937) return 'WebKit WebGL';
              else if (arguments[0] === 3379) return SOCIALBROWSER.configWebGL.random.number('3379', [14, 15]);
              else if (arguments[0] === 36347) return SOCIALBROWSER.configWebGL.random.number('36347', [12, 13]);
              else if (arguments[0] === 34076) return SOCIALBROWSER.configWebGL.random.number('34076', [14, 15]);
              else if (arguments[0] === 34024) return SOCIALBROWSER.configWebGL.random.number('34024', [14, 15]);
              else if (arguments[0] === 3386) return SOCIALBROWSER.configWebGL.random.int('3386', [13, 14, 15]);
              else if (arguments[0] === 3413) return SOCIALBROWSER.configWebGL.random.number('3413', [1, 2, 3, 4]);
              else if (arguments[0] === 3412) return SOCIALBROWSER.configWebGL.random.number('3412', [1, 2, 3, 4]);
              else if (arguments[0] === 3411) return SOCIALBROWSER.configWebGL.random.number('3411', [1, 2, 3, 4]);
              else if (arguments[0] === 3410) return SOCIALBROWSER.configWebGL.random.number('3410', [1, 2, 3, 4]);
              else if (arguments[0] === 34047) return SOCIALBROWSER.configWebGL.random.number('34047', [1, 2, 3, 4]);
              else if (arguments[0] === 34930) return SOCIALBROWSER.configWebGL.random.number('34930', [1, 2, 3, 4]);
              else if (arguments[0] === 34921) return SOCIALBROWSER.configWebGL.random.number('34921', [1, 2, 3, 4]);
              else if (arguments[0] === 35660) return SOCIALBROWSER.configWebGL.random.number('35660', [1, 2, 3, 4]);
              else if (arguments[0] === 35661) return SOCIALBROWSER.configWebGL.random.number('35661', [4, 5, 6, 7, 8]);
              else if (arguments[0] === 36349) return SOCIALBROWSER.configWebGL.random.number('36349', [10, 11, 12, 13]);
              else if (arguments[0] === 33902) return SOCIALBROWSER.configWebGL.random.float('33902', [0, 10, 11, 12, 13]);
              else if (arguments[0] === 33901) return SOCIALBROWSER.configWebGL.random.float('33901', [0, 10, 11, 12, 13]);
              else if (arguments[0] === 37446) return SOCIALBROWSER.configWebGL.random.item('37446', ['Graphics', 'HD Graphics', 'Intel(R) HD Graphics']);
              else if (arguments[0] === 7938) return SOCIALBROWSER.configWebGL.random.item('7938', ['WebGL 1.0', 'WebGL 1.0 (OpenGL)', 'WebGL 1.0 (OpenGL Chromium)']);
              else if (arguments[0] === 35724) return SOCIALBROWSER.configWebGL.random.item('35724', ['WebGL', 'WebGL GLSL', 'WebGL GLSL ES', 'WebGL GLSL ES (OpenGL Chromium)']);
              return getParameter.apply(this, arguments);
            },
          });
        },
      },
    },
  };
  SOCIALBROWSER.configWebGL.spoof.webgl.buffer(WebGLRenderingContext);
  SOCIALBROWSER.configWebGL.spoof.webgl.buffer(WebGL2RenderingContext);
  SOCIALBROWSER.configWebGL.spoof.webgl.parameter(WebGLRenderingContext);
  SOCIALBROWSER.configWebGL.spoof.webgl.parameter(WebGL2RenderingContext);
}

if (SOCIALBROWSER.session.privacy.vpc.hide_mimetypes) {
  SOCIALBROWSER.navigator.mimeTypes = navigator.mimeTypes;
  SOCIALBROWSER.__define(navigator, 'mimeTypes', {
    length: 0,
    item: () => null,
    namedItem: () => null,
    refresh: () => {},
  });
}
if (SOCIALBROWSER.session.privacy.vpc.hide_plugins) {
  SOCIALBROWSER.navigator.plugins = navigator.plugins;
  SOCIALBROWSER.__define(navigator, 'plugins', {
    length: 0,
    item: () => null,
    namedItem: () => null,
    refresh: () => {},
  });
}

if (SOCIALBROWSER.session.privacy.vpc.hide_connection || SOCIALBROWSER.session.privacy.vpc.hide_connection) {
  SOCIALBROWSER.__define(navigator, 'connection', {
    onchange: null,
    effectiveType: SOCIALBROWSER.session.privacy.vpc.connection.effectiveType,
    rtt: SOCIALBROWSER.session.privacy.vpc.connection.rtt,
    downlink: SOCIALBROWSER.session.privacy.vpc.connection.downlink,
    downlinkMax: SOCIALBROWSER.session.privacy.vpc.connection.downlinkMax,
    saveData: false,
    type: SOCIALBROWSER.session.privacy.vpc.connection.type,
  });
}

if (SOCIALBROWSER.session.privacy.vpc.hide_permissions) {
  SOCIALBROWSER.navigator.permissions = navigator.permissions;
  SOCIALBROWSER.__define(navigator, 'permissions', {
    query: (permission) => {
      return new Promise((ok, err) => {
        ok({
          state: ['', 'granted', 'prompt', 'denied', ''][3],
        });
      });
    },
  });
}

/** This is not Chrome headless
   * navigator.permissions.query({name:'notifications'}).then(function(permissionStatus) {
    if(Notification.permission === 'denied' && permissionStatus.state === 'prompt') {
        console.log('This is Chrome headless')	
    } else {
        console.log('This is not Chrome headless')
    }
});
   */
  
if (SOCIALBROWSER.session.privacy.vpc.hide_fonts) {
  SOCIALBROWSER.__define(HTMLElement.prototype, 'offsetHeight', {
    get() {
      const height = Math.floor(this.getBoundingClientRect().height);
      const valid = height && rand.sign() === 1;
      const result = valid ? height + rand.noise() : height;
      return result;
    },
  });
  SOCIALBROWSER.__define(HTMLElement.prototype, 'offsetWidth', {
    get() {
      const width = Math.floor(this.getBoundingClientRect().width);
      const valid = width && rand.sign() === 1;
      const result = valid ? width + rand.noise() : width;
      return result;
    },
  });
}
if (SOCIALBROWSER.session.privacy.vpc.hide_battery) {
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
if (SOCIALBROWSER.session.privacy.vpc.dnt) {
  SOCIALBROWSER.__define(navigator, 'doNotTrack', '1');
} else {
  SOCIALBROWSER.__define(navigator, 'doNotTrack', '0');
}

if (SOCIALBROWSER.session.privacy.vpc.hide_location) {
  SOCIALBROWSER.__define(navigator.geolocation, 'getCurrentPosition', function (callback, error) {
    if (callback) {
      callback({
        timestamp: new Date().getTime(),
        coords: {
          latitude: SOCIALBROWSER.session.privacy.vpc.location.latitude,
          longitude: SOCIALBROWSER.session.privacy.vpc.location.longitude,
          altitude: null,
          accuracy: SOCIALBROWSER.random(50, 500),
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
      });
    }
    if (error) {
    }
  });
}

if (SOCIALBROWSER.isMemoryMode) {
  window.RequestFileSystem = window.webkitRequestFileSystem = function (arg1, arg2, callback, error) {
    callback({
      name: document.location.origin + ':' + arg1,
      root: {
        fullPath: '/',
        isDirectory: true,
        isFile: false,
        name: '',
      },
    });
  };
  navigator.storage = navigator.storage || {};
  navigator.storage.estimate = function () {
    return new Promise((resolve, reject) => {
      resolve({
        usage: SOCIALBROWSER.random(100000, 1000000),
        quota: SOCIALBROWSER.random(1200000000, 12000000000),
      });
    });
  };
  if (!window.localStorage) {
    window.localStorage = window.localStorage || function () {};
    window.localStorage.setItem = SOCIALBROWSER.set;
    window.localStorage.removeItem = SOCIALBROWSER.get;
  }

  window.indexedDB = {
    open: () => {
      let db = {};
      setTimeout(() => {
        if (db.onsuccess) {
          db.onsuccess();
        }
      }, 1000);
      return db;
    },
  };
}
SOCIALBROWSER.log('.... [ Finger Printing ON ] .... ' + document.location.href);
