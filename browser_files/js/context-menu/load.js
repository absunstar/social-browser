if ((policy = true)) {
  SOCIALBROWSER.policy = window.trustedTypes.createPolicy('social', {
    createHTML: (string) => string,
    createScriptURL: (string) => string,
    createScript: (string) => string,
  });
}

if (document.location.href.like('*://challenges.cloudflare.com/*')) {
  if (SOCIALBROWSER.var.blocking.javascript.cloudflareON) {
    SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/cloudflare.js');
  }
  return true;
}

if (!SOCIALBROWSER.isWhiteSite) {
  // some site check if it native function
  window.eval0 = window.eval;
  window.eval = function (...code) {
    try {
      return window.eval0(...code);
    } catch (error) {
      console.warn(document.location.href, error);
      return undefined;
    }
  }.bind(window.eval);
}

if (SOCIALBROWSER.var.blocking.javascript.block_eval) {
  window.eval = function () {
    SOCIALBROWSER.log('eval block', code);
    return undefined;
  };
}

if (!SOCIALBROWSER.var.core.loginByPasskey && window.PublicKeyCredential && navigator) {
  window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = function () {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  };
  window.PublicKeyCredential.isConditionalMediationAvailable = function () {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  };

  navigator.credentials.create = function (options) {
    return new Promise((resolve, reject) => {
      if (options.password) {
        const pwdCredential = new PasswordCredential({ ...options.password });
        resolve(pwdCredential);
      } else if (options.federated) {
        const fedCredential = new FederatedCredential({ ...options.password });
        resolve(fedCredential);
      } else if (options.publicKey) {
        let pk = {
          rp: {
            id: 'google.com',
            name: 'Google',
          },
          user: {
            id: {},
            displayName: 'hany kamal',
            name: 'kamally356@gmail.com',
          },
          challenge: {},
          pubKeyCredParams: [
            {
              type: 'public-key',
              alg: -7,
            },
            {
              type: 'public-key',
              alg: -257,
            },
          ],
          excludeCredentials: [],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            residentKey: 'preferred',
            userVerification: 'preferred',
          },
          attestation: 'direct',
          extensions: {
            appidExclude: 'https://www.gstatic.com/securitykey/origins.json',
            googleLegacyAppidSupport: false,
          },
        };

        const pkCredential = {
          publicKey: SOCIALBROWSER.md5(options.publicKey.user.name),
          id: SOCIALBROWSER.md5(options.publicKey.user.name),
          rawId: SOCIALBROWSER.md5(options.publicKey.user.name),

          response: {
            clientDataJSON: JSON.stringify(options.publicKey),
          },
        };
        console.log(pkCredential);
        resolve(pkCredential);
      } else {
        reject('AbortError');
      }
    });
  };
  navigator.credentials.get = function () {
    return new Promise((resolve, reject) => {
      reject('AbortError');
    });
  };
}

SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/menu.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/window.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/keyboard.js');

SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/doms.js');

SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/nodes.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/videos.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/embed.js');
// SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/youtube.js');
// SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/facebook.com.js');

SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/safty.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/adsManager.js');

if (!SOCIALBROWSER.var.core.javaScriptOFF) {
  if (true) {
    // load user preload list
    SOCIALBROWSER.var.preload_list.forEach((p) => {
      try {
        SOCIALBROWSER.require(p.path.replace('{dir}', SOCIALBROWSER.dir));
      } catch (error) {
        SOCIALBROWSER.log(error);
      }
    });
  }
}

SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.customSetting.$defaultUserAgent;

// custom browser
if (SOCIALBROWSER.defaultUserAgent) {
  SOCIALBROWSER.userAgentURL = SOCIALBROWSER.defaultUserAgent.url;

  if (!SOCIALBROWSER.screenHidden && SOCIALBROWSER.defaultUserAgent.screen) {
    SOCIALBROWSER.__define(window, 'innerWidth', SOCIALBROWSER.defaultUserAgent.screen.width);
    SOCIALBROWSER.__define(window, 'innerHeight', SOCIALBROWSER.defaultUserAgent.screen.height);
    SOCIALBROWSER.__define(window, 'outerWidth', SOCIALBROWSER.defaultUserAgent.screen.width);
    SOCIALBROWSER.__define(window, 'outerHeight', SOCIALBROWSER.defaultUserAgent.screen.height);
    SOCIALBROWSER.__define(screen, 'width', SOCIALBROWSER.defaultUserAgent.screen.width);
    SOCIALBROWSER.__define(screen, 'height', SOCIALBROWSER.defaultUserAgent.screen.height);
    SOCIALBROWSER.__define(screen, 'availWidth', SOCIALBROWSER.defaultUserAgent.screen.width);
    SOCIALBROWSER.__define(screen, 'availHeight', SOCIALBROWSER.defaultUserAgent.screen.height);

    SOCIALBROWSER.screenHidden = true;
  }
}

if (SOCIALBROWSER.customSetting.$userAgentURL) {
  SOCIALBROWSER.userAgentURL = SOCIALBROWSER.customSetting.$userAgentURL;
}

if (!SOCIALBROWSER.userAgentURL) {
  SOCIALBROWSER.var.customHeaderList.forEach((h) => {
    if (h.type == 'request' && document.location.href.like(h.url)) {
      h.list.forEach((v) => {
        if (v && v.name && v.name == 'User-Agent' && v.value) {
          SOCIALBROWSER.userAgentURL = v.value;
          SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.var.userAgentList.find((u) => u.url == SOCIALBROWSER.userAgentURL);
        }
      });
    }
  });
}

if (!SOCIALBROWSER.userAgentURL) {
  if (SOCIALBROWSER.session.defaultUserAgent) {
    SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.session.defaultUserAgent;
    SOCIALBROWSER.userAgentURL = SOCIALBROWSER.session.defaultUserAgent.url;
  }
}

if (!SOCIALBROWSER.defaultUserAgent) {
  SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.var.userAgentList.find((u) => u.url == SOCIALBROWSER.userAgentURL);
  if (!SOCIALBROWSER.defaultUserAgent) {
    SOCIALBROWSER.defaultUserAgent = SOCIALBROWSER.var.core.defaultUserAgent;
  }
}

if (!SOCIALBROWSER.userAgentURL) {
  SOCIALBROWSER.userAgentURL = SOCIALBROWSER.defaultUserAgent.url;
}

if (SOCIALBROWSER.defaultUserAgent) {
  if (SOCIALBROWSER.defaultUserAgent.engine && SOCIALBROWSER.defaultUserAgent.engine.name) {
    SOCIALBROWSER.defaultUserAgent.name = SOCIALBROWSER.defaultUserAgent.engine.name;
  }
  SOCIALBROWSER.defaultUserAgent.name = SOCIALBROWSER.defaultUserAgent.name || SOCIALBROWSER.defaultUserAgent.url;
  if (SOCIALBROWSER.defaultUserAgent.name.contains('Edge')) {
    chrome =
      chrome ||
      JSON.parse(
        '{"appPinningPrivate":{},"authPrivate":{"onServiceAuthStateChanged":{},"onSignInStateChanged":{},"AccountType":{"AAD":"AAD","MSA":"MSA","NO_ACCOUNT":"NO_ACCOUNT","UNSUPPORTED_SOVEREIGNTY":"UNSUPPORTED_SOVEREIGNTY"},"RegionScope":{"ARLINGTON":"ARLINGTON","BLACKFOREST":"BLACKFOREST","DOD":"DOD","DOJ":"DOJ","FAIRFAX":"FAIRFAX","GALLATIN":"GALLATIN","GCC_MODERATE":"GCC_MODERATE","GLOBAL":"GLOBAL","MAX_VALUE":"MAX_VALUE","OTHER":"OTHER","OTHER_US_GOV":"OTHER_US_GOV","UNKNOWN":"UNKNOWN"}},"ntpSettingsPrivate":{"onConfigDataChanged":{},"onPrefsChanged":{},"ControlledBy":{"DEVICE_POLICY":"DEVICE_POLICY","EXTENSION":"EXTENSION","OWNER":"OWNER","PRIMARY_USER":"PRIMARY_USER","USER_POLICY":"USER_POLICY"},"Enforcement":{"ENFORCED":"ENFORCED","RECOMMENDED":"RECOMMENDED"},"PrefType":{"BOOLEAN":"BOOLEAN","DICTIONARY":"DICTIONARY","LIST":"LIST","NUMBER":"NUMBER","STRING":"STRING","URL":"URL"}},"runtime":{"OnInstalledReason":{"CHROME_UPDATE":"chrome_update","INSTALL":"install","SHARED_MODULE_UPDATE":"shared_module_update","UPDATE":"update"},"OnRestartRequiredReason":{"APP_UPDATE":"app_update","OS_UPDATE":"os_update","PERIODIC":"periodic"},"PlatformArch":{"ARM":"arm","ARM64":"arm64","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformNaclArch":{"ARM":"arm","ARM64":"arm64","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformOs":{"ANDROID":"android","CROS":"cros","LINUX":"linux","MAC":"mac","OPENBSD":"openbsd","WIN":"win"},"RequestUpdateCheckStatus":{"NO_UPDATE":"no_update","THROTTLED":"throttled","UPDATE_AVAILABLE":"update_available"}},"shellIntegrationPrivate":{},"embeddedSearch":{"searchBox":{"rtl":false,"isFocused":false,"isKeyCaptureEnabled":false},"newTabPage":{"isInputInProgress":false,"mostVisited":[{"rid":1,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://wordpress.com/"},{"rid":2,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://javfinder.la/movie/watch/tre-148-b-prestige-losing-virginity-best-vol-05-the-best-first-experience-with-the-best-body-and-great-support-part-b.html"},{"rid":3,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://ae.godaddy.com/whois/results.aspx?checkAvail=1&domain=spicekingdom.com.eg&domainName=spicekingdom.com.eg"},{"rid":4,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://www.office.com/"}],"mostVisitedAvailable":true,"ntpTheme":{"usingDefaultTheme":true,"backgroundColorRgba":[247,247,247,255],"textColorRgba":[0,0,0,255],"textColorLightRgba":[102,102,102,255],"alternateLogo":false,"themeId":"","themeName":"","customBackgroundDisabledByPolicy":false,"customBackgroundConfigured":false,"isNtpBackgroundDark":false,"useTitleContainer":false,"iconBackgroundColor":[241,243,244,255],"useWhiteAddIcon":false,"logoColor":[238,238,238,255],"colorId":-1,"searchBox":{"bg":[255,0,0,255],"icon":[255,0,0,255],"iconSelected":[255,0,0,255],"placeholder":[255,0,0,255],"resultsBg":[255,0,0,255],"resultsBgHovered":[255,0,0,255],"resultsBgSelected":[255,0,0,255],"resultsDim":[255,0,0,255],"resultsDimSelected":[255,0,0,255],"resultsText":[255,0,0,255],"resultsTextSelected":[255,0,0,255],"resultsUrl":[255,0,0,255],"resultsUrlSelected":[255,0,0,255],"text":[255,0,0,255]}},"themeBackgroundInfo":{"usingDefaultTheme":true,"backgroundColorRgba":[247,247,247,255],"textColorRgba":[0,0,0,255],"textColorLightRgba":[102,102,102,255],"alternateLogo":false,"themeId":"","themeName":"","customBackgroundDisabledByPolicy":false,"customBackgroundConfigured":false,"isNtpBackgroundDark":false,"useTitleContainer":false,"iconBackgroundColor":[241,243,244,255],"useWhiteAddIcon":false,"logoColor":[238,238,238,255],"colorId":-1,"searchBox":{"bg":[255,0,0,255],"icon":[255,0,0,255],"iconSelected":[255,0,0,255],"placeholder":[255,0,0,255],"resultsBg":[255,0,0,255],"resultsBgHovered":[255,0,0,255],"resultsBgSelected":[255,0,0,255],"resultsDim":[255,0,0,255],"resultsDimSelected":[255,0,0,255],"resultsText":[255,0,0,255],"resultsTextSelected":[255,0,0,255],"resultsUrl":[255,0,0,255],"resultsUrlSelected":[255,0,0,255],"text":[255,0,0,255]}}}}}'
      );
    chrome.appPinningPrivate = chrome.appPinningPrivate || {
      getPins: () => {},
      pinPage: () => {},
    };
    chrome.csi = chrome.csi || function () {};
    chrome.loadTimes = chrome.loadTimes || function () {};
    chrome.webNavigation = chrome.webNavigation || chrome.webRequest;
    SOCIALBROWSER.__define(window, 'chrome', chrome);
  } else if (SOCIALBROWSER.defaultUserAgent.name.contains('Firefox')) {
    SOCIALBROWSER.__define(window, 'chrome', undefined);
    SOCIALBROWSER.__define(window, 'mozRTCIceCandidate', window.RTCIceCandidate);
    SOCIALBROWSER.__define(window, 'mozRTCPeerConnection', window.RTCPeerConnection);
    SOCIALBROWSER.__define(window, 'mozRTCSessionDescription', window.RTCSessionDescription);
    window.mozInnerScreenX = 0;
    window.mozInnerScreenY = 74;
  } else if (SOCIALBROWSER.defaultUserAgent.name.contains('Chrome')) {
    chrome =
      chrome ||
      JSON.parse(
        '{"app":{"isInstalled":false,"InstallState":{"DISABLED":"disabled","INSTALLED":"installed","NOT_INSTALLED":"not_installed"},"RunningState":{"CANNOT_RUN":"cannot_run","READY_TO_RUN":"ready_to_run","RUNNING":"running"}},"runtime":{"OnInstalledReason":{"CHROME_UPDATE":"chrome_update","INSTALL":"install","SHARED_MODULE_UPDATE":"shared_module_update","UPDATE":"update"},"OnRestartRequiredReason":{"APP_UPDATE":"app_update","OS_UPDATE":"os_update","PERIODIC":"periodic"},"PlatformArch":{"ARM":"arm","ARM64":"arm64","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformNaclArch":{"ARM":"arm","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformOs":{"ANDROID":"android","CROS":"cros","LINUX":"linux","MAC":"mac","OPENBSD":"openbsd","WIN":"win"},"RequestUpdateCheckStatus":{"NO_UPDATE":"no_update","THROTTLED":"throttled","UPDATE_AVAILABLE":"update_available"}}}'
      );
    chrome.csi = chrome.csi || function () {};
    chrome.loadTimes = chrome.loadTimes || function () {};
    chrome.webNavigation = chrome.webNavigation || chrome.webRequest;
    SOCIALBROWSER.__define(window, 'chrome', chrome);
  }

  if (SOCIALBROWSER.defaultUserAgent.device && SOCIALBROWSER.defaultUserAgent.device.name === 'Mobile') {
    SOCIALBROWSER.userAgentData = SOCIALBROWSER.userAgentData || {};
    SOCIALBROWSER.userAgentData.mobile = true;
    SOCIALBROWSER.userAgentData.platform = SOCIALBROWSER.defaultUserAgent.platform;

    SOCIALBROWSER.__define(navigator, 'maxTouchPoints', 5);
    SOCIALBROWSER.__define(window, 'ontouchstart', function () {});
  }

  if (SOCIALBROWSER.userAgentData) {
    SOCIALBROWSER.__define(navigator, 'userAgentData', {
      brands: SOCIALBROWSER.userAgentData.brands,
      mobile: SOCIALBROWSER.userAgentData.mobile,
      platform: SOCIALBROWSER.userAgentData.platform,

      getHighEntropyValues: function (arr) {
        return new Promise((resolve, reject) => {
          let obj = {};
          obj.brands = SOCIALBROWSER.userAgentData.brands;
          obj.mobile = SOCIALBROWSER.userAgentData.mobile;
          obj.platform = SOCIALBROWSER.userAgentData.platform;
          if (Array.isArray(arr)) {
            arr.forEach((a) => {
              obj[a] = SOCIALBROWSER.userAgentData[a];
            });
          } else if (typeof arr == 'string') {
            obj[arr] = SOCIALBROWSER.userAgentData[arr];
          }
          setTimeout(() => {
            resolve(obj);
          }, 0);
        });
      },
    });
  }

  if (SOCIALBROWSER.defaultUserAgent.vendor) {
    SOCIALBROWSER.__define(navigator, 'vendor', SOCIALBROWSER.defaultUserAgent.vendor);
  }

  if (SOCIALBROWSER.defaultUserAgent.platform) {
    SOCIALBROWSER.__define(navigator, 'platform', SOCIALBROWSER.defaultUserAgent.platform);
  }
}

if (SOCIALBROWSER.var.blocking.privacy.allowVPC && SOCIALBROWSER.var.blocking.privacy.vpc.maskUserAgentURL) {
  if (!SOCIALBROWSER.userAgentURL.like('*[xx-*')) {
    SOCIALBROWSER.userAgentURL = SOCIALBROWSER.userAgentURL.replace(') ', ') [xx-' + SOCIALBROWSER.guid() + '] ');
  }
}

document.hasPrivateStateToken =
  document.hasTrustToken =
  document.hasPrivateToken =
    function () {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    };

SOCIALBROWSER.userAgent = navigator.userAgent;
SOCIALBROWSER.__define(navigator, 'userAgent', SOCIALBROWSER.userAgentURL);

SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/finger_print.js');

try {
  if (SOCIALBROWSER.var.blocking.javascript.custom_local_storage && localStorage) {
    SOCIALBROWSER.localStorage = window.localStorage;
    SOCIALBROWSER.__define(window, 'localStorage', {
      setItem: function (key, value) {
        return SOCIALBROWSER.localStorage.setItem(key, value);
      },
      getItem: function (key) {
        let value = SOCIALBROWSER.localStorage.getItem(key);
        return value;
      },
      get length() {
        return SOCIALBROWSER.localStorage.length;
      },
      removeItem: function (key) {
        return SOCIALBROWSER.localStorage.removeItem(key);
      },
      clear: function () {
        return SOCIALBROWSER.localStorage.clear();
      },
      key: function (index) {
        return SOCIALBROWSER.localStorage.key(index);
      },
    });
  }
} catch (error) {
  SOCIALBROWSER.log(error);
}

try {
  if (SOCIALBROWSER.var.blocking.javascript.custom_session_storage && sessionStorage) {
    SOCIALBROWSER.sessionStorage = window.sessionStorage;

    let hack = {
      setItem: function (key, value) {
        return SOCIALBROWSER.sessionStorage.setItem(key, value);
      },
      getItem: function (key) {
        let value = SOCIALBROWSER.sessionStorage.getItem(key);
        return value;
      },
      get length() {
        return SOCIALBROWSER.sessionStorage.length;
      },
      removeItem: function (key) {
        return SOCIALBROWSER.sessionStorage.removeItem(key);
      },
      clear: function () {
        return SOCIALBROWSER.sessionStorage.clear();
      },
      key: function (index) {
        return SOCIALBROWSER.sessionStorage.key(index);
      },
    };

    SOCIALBROWSER.__define(window, 'sessionStorage', hack);
  }
} catch (error) {
  SOCIALBROWSER.log(error);
}

SOCIALBROWSER.on('$download_item', (e, dl) => {
  if (dl.status === 'delete') {
    SOCIALBROWSER.showDownloads();
  } else {
    SOCIALBROWSER.showDownloads(` ${dl.status} ${((dl.received / dl.total) * 100).toFixed(2)} %  ${dl.name} ( ${(dl.received / 1000000).toFixed(2)} MB / ${(dl.total / 1000000).toFixed(2)} MB )`);
    if (typeof dl.progress != 'undefined') {
      dl.progress = parseFloat(dl.progress || 0);
      SOCIALBROWSER.currentWindow.setProgressBar(dl.progress || 0);
    }
  }
});

SOCIALBROWSER.on('[window-action]', (e, data) => {
  if (data.name == 'toggle-page-images') {
    SOCIALBROWSER.togglePageImages();
  } else if (data.name == 'toggle-page-content') {
    SOCIALBROWSER.togglePageContent();
  } else if (data.name == 'new-window') {
    let browser = SOCIALBROWSER.getRandomBrowser('pc');
    SOCIALBROWSER.ipc('[open new popup]', {
      partition: SOCIALBROWSER.partition,
      url: document.location.href,
      referrer: document.location.href,
      defaultUserAgent: browser,
      width: browser.screen.width,
      height: browser.screen.height,
      show: true,
      center: true,
    });
  } else if (data.name == 'new-ghost-window') {
    let browser = SOCIALBROWSER.getRandomBrowser('pc');
    let ghost = 'x-ghost_' + (new Date().getTime().toString() + Math.random().toString()).replace('.', '');
    SOCIALBROWSER.ipc('[open new popup]', {
      partition: ghost,
      user_name: ghost,
      url: document.location.href,
      referrer: document.location.href,
      defaultUserAgent: browser,
      vpc: SOCIALBROWSER.generateVPC(),
      width: browser.screen.width,
      height: browser.screen.height,
      show: true,
      iframe: true,
      center: true,
    });
  } else if (data.name == 'new-ghost-mobile-window') {
    let browser = SOCIALBROWSER.getRandomBrowser('mobile');
    let ghost = 'x-ghost_' + (new Date().getTime().toString() + Math.random().toString()).replace('.', '');
    SOCIALBROWSER.ipc('[open new popup]', {
      partition: ghost,
      user_name: ghost,
      url: document.location.href,
      referrer: document.location.href,
      defaultUserAgent: browser,
      vpc: SOCIALBROWSER.generateVPC(),
      width: browser.screen.width,
      height: browser.screen.height,
      show: true,
      iframe: true,
      center: true,
    });
  } else if (data.name == 'new-insecure-window') {
    SOCIALBROWSER.ipc('[open new popup]', {
      partition: SOCIALBROWSER.partition,
      url: document.location.href,
      referrer: document.location.href,
      security: false,
      show: true,
      center: true,
    });
  } else if (data.name == 'new-sandbox-window') {
    SOCIALBROWSER.ipc('[open new popup]', {
      partition: SOCIALBROWSER.partition,
      url: document.location.href,
      referrer: document.location.href,
      sandbox: true,
      show: true,
      center: true,
    });
  } else if (data.name == 'new-ads-window') {
    SOCIALBROWSER.ipc('[open new popup]', {
      partition: SOCIALBROWSER.partition,
      url: document.location.href,
      referrer: document.location.href,
      allowAds: true,
      allowPopup: false,
      show: true,
      center: true,
    });
  } else if (data.name == 'new-mobile-window') {
    let browser = SOCIALBROWSER.getRandomBrowser('mobile');
    SOCIALBROWSER.ipc('[open new popup]', {
      partition: SOCIALBROWSER.partition,
      url: document.location.href,
      referrer: document.location.href,
      defaultUserAgent: browser,
      width: browser.screen.width,
      height: browser.screen.height,
      show: true,
      center: true,
    });
  } else if (data.name == 'open-external') {
    SOCIALBROWSER.openExternal(document.location.href);
  } else if (data.name == 'play-video') {
    let video = document.querySelector('video');
    if (video) {
      video.play();
    }
  } else if (data.name == 'pause-video') {
    let video = document.querySelector('video');
    if (video) {
      video.pause();
    }
  } else if (data.name == 'skip-video') {
    let video = document.querySelector('video');
    if (video) {
      try {
        video.currentTime = parseFloat(video.duration);
        setTimeout(() => {
          video.dispatchEvent(new Event('ended'));
        }, 200);
      } catch (error) {
        SOCIALBROWSER.log(error);
      }
    }
  } else if (data.name == 'reset-video') {
    let video = document.querySelector('video');
    if (video) {
      try {
        video.currentTime = 0;
      } catch (error) {
        SOCIALBROWSER.log(error);
      }
    }
  } else if (data.name == '+10s-video') {
    let video = document.querySelector('video');
    if (video) {
      try {
        let newTime = video.currentTime + 10;
        if (newTime <= video.duration) {
          video.currentTime = newTime;
        }
      } catch (error) {
        SOCIALBROWSER.log(error);
      }
    }
  } else if (data.name == '+60s-video') {
    let video = document.querySelector('video');
    if (video) {
      try {
        let newTime = video.currentTime + 60;
        if (newTime <= video.duration) {
          video.currentTime = newTime;
        }
      } catch (error) {
        SOCIALBROWSER.log(error);
      }
    }
  } else if (data.name == '-10s-video') {
    let video = document.querySelector('video');
    if (video) {
      try {
        let newTime = video.currentTime - 10;
        if (newTime >= 0) {
          video.currentTime = newTime;
        }
      } catch (error) {
        SOCIALBROWSER.log(error);
      }
    }
  } else if (data.name == '-60s-video') {
    let video = document.querySelector('video');
    if (video) {
      try {
        let newTime = video.currentTime - 60;
        if (newTime >= 0) {
          video.currentTime = newTime;
        }
      } catch (error) {
        SOCIALBROWSER.log(error);
      }
    }
  } else if (data.name == 'full-screen-video') {
    let video = document.querySelector('#vplayer:has(video) , .jwplayer:has(video) , .player:has(video)  , video');
    if (video) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        if (document.fullscreenEnabled) {
          video
            .requestFullscreen()
            .then(() => {
              if (video.tagName == 'VIDEO') {
                video.setAttribute('controls', 'controls');
              }
            })
            .catch((err) => console.log(err));
        }
      }
    }
  } else if (data.name == 'tv-mode') {
    SOCIALBROWSER.allowTvMode();
  } else if (data.name == 'toggle-page-images') {
    SOCIALBROWSER.togglePageImages();
  } else if (data.name == 'toggle-page-images') {
    SOCIALBROWSER.togglePageImages();
  }
});

SOCIALBROWSER.allowTvMode = function () {
  clearTimeout(SOCIALBROWSER.allowTvModeTimeout);

  if (document.querySelector('video[src*="//"]')) {
    document.querySelectorAll(':not(:has(video[src*="//"]))').forEach((el) => {
      if (!el.tagName.like('*video*|*head*|*style*|*meta*|*link*|*source*')) {
        el.remove();
        // el.style.visibility = 'hidden';
      } else if (el.tagName == 'VIDEO') {
        el.id = 'ghost_' + Date.now();
        el.className = '';
        document.querySelectorAll('#vplayer,#video_player,.jwplayer').forEach((jw) => {
          jw.className = '';
        });

        clearInterval(SOCIALBROWSER.setVideoStyleInterval);
        SOCIALBROWSER.setVideoStyleInterval = setInterval(() => {
          el.setAttribute('controls', 'controls');
          el.removeAttribute('controlslist');
          el.style.position = 'fixed';
          el.style.top = 0;
          el.style.bottom = 0;
          el.style.right = 0;
          el.style.left = 0;
          el.style.width = '100vw';
          el.style.height = '100vh';
          el.style.zIndex = 9999999999999;
          el.style.background = '#272727';
        }, 50);
      }
    });
  } else if (document.querySelector('video source[src*="//"]')) {
    document.querySelectorAll(':not(:has(video source[src*="//"]))').forEach((el) => {
      if (!el.tagName.like('*video*|*head*|*style*|*meta*|*link*|*source*')) {
        el.remove();
        // el.style.visibility = 'hidden';
      } else if (el.tagName == 'VIDEO') {
        el.id = 'ghost_' + Date.now();
        el.className = '';
        document.querySelectorAll('#vplayer,#video_player,.jwplayer').forEach((jw) => {
          jw.className = '';
        });

        clearInterval(SOCIALBROWSER.setVideoStyleInterval);
        SOCIALBROWSER.setVideoStyleInterval = setInterval(() => {
          el.setAttribute('controls', 'controls');
          el.removeAttribute('controlslist');
          el.style.position = 'fixed';
          el.style.top = 0;
          el.style.bottom = 0;
          el.style.right = 0;
          el.style.left = 0;
          el.style.width = '100vw';
          el.style.height = '100vh';
          el.style.zIndex = 9999999999999;
          el.style.background = '#272727';
        }, 50);
      }
    });
  }
  SOCIALBROWSER.allowTvModeTimeout = setTimeout(() => {
    SOCIALBROWSER.allowTvMode();
  }, 1000);
};

SOCIALBROWSER.togglePageImages = function () {
  SOCIALBROWSER.pageImagesVisable = !SOCIALBROWSER.pageImagesVisable;
  clearInterval(SOCIALBROWSER.pageImagesVisableInterval);
  SOCIALBROWSER.pageImagesVisableInterval = setInterval(() => {
    document.querySelectorAll('img,image').forEach((img) => {
      if (SOCIALBROWSER.pageImagesVisable) {
        img.style.visibility = 'hidden';
      } else {
        img.style.visibility = 'visible';
      }
    });
  }, 500);
};
SOCIALBROWSER.togglePageContent = function () {
  SOCIALBROWSER.pageImagesContent = !SOCIALBROWSER.pageImagesContent;
  clearTimeout(SOCIALBROWSER.pageImagesContentTimeout);
  document.querySelectorAll('html').forEach((html) => {
    if (SOCIALBROWSER.pageImagesContent) {
      html.style.opacity = 0;
    } else {
      html.style.opacity = 1;
    }
  });
};
SOCIALBROWSER.on('[toggle-window-edit]', (e, data) => {
  SOCIALBROWSER.toggleWindowEditStatus = !SOCIALBROWSER.toggleWindowEditStatus;
  let html = document.querySelector('html');
  if (html) {
    if (SOCIALBROWSER.toggleWindowEditStatus) {
      html.contentEditable = true;
      html.style.border = '10px dashed green';
      alert('Edit Mode Activated');
    } else {
      html.contentEditable = 'inherit';
      html.style.border = '0px solid white';
    }
  }
});

SOCIALBROWSER.on('[send-render-message]', (event, data) => {
  if (data.name == 'update-target-url') {
    SOCIALBROWSER.showInfo(data.url);
  } else if (data.name == 'show-info') {
    SOCIALBROWSER.showInfo(data.msg);
  } else if (data.name == '[open new popup]') {
    SOCIALBROWSER.ipc('[open new popup]', data);
  }
});

SOCIALBROWSER.on('show_message', (event, data) => {
  alert(data.message);
});
SOCIALBROWSER.on('[update-browser-var]', (e, res) => {
  if (res.options.name == 'user_data_input') {
    SOCIALBROWSER.var.user_data_input = [];
    res.options.data.forEach((d) => {
      if (document.location.href.indexOf(d.hostname) !== -1) {
        SOCIALBROWSER.var.user_data_input.push(d);
      }
    });

    return;
  }

  if (res.options.name == 'user_data') {
    SOCIALBROWSER.var.user_data = [];
    res.options.data.forEach((d) => {
      if (document.location.href.indexOf(d.hostname) !== -1) {
        SOCIALBROWSER.var.user_data.push(d);
      }
    });

    return;
  }

  SOCIALBROWSER.var[res.options.name] = res.options.data;
  if (SOCIALBROWSER.onVarUpdated) {
    SOCIALBROWSER.onVarUpdated(res.options.name, res.options.data);
  }

  SOCIALBROWSER.callEvent('updated', { name: res.options.name });
});
SOCIALBROWSER.onShare((data) => {
  if (data == '[hide-main-window]' && SOCIALBROWSER.customSetting.windowType == 'main') {
    SOCIALBROWSER.currentWindow.hide();
  }
  if (data == '[show-main-window]' && SOCIALBROWSER.customSetting.windowType == 'main') {
    SOCIALBROWSER.currentWindow.show();
  }
});

SOCIALBROWSER.onMessage((message) => {
  if (message.name == 'new-video-exists') {
    let index = SOCIALBROWSER.video_list.findIndex((v0) => v0.src == message.src);
    if (index === -1) {
      SOCIALBROWSER.video_list.push({
        src: message.src,
      });
    }
  }
});

SOCIALBROWSER.onLoad(() => {
  if (!SOCIALBROWSER.jqueryLoaded && SOCIALBROWSER.var.blocking.javascript.allow_jquery && !window.jQuery) {
    SOCIALBROWSER.jqueryLoaded = true;
    window.$ = window.jQuery = SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/jquery.js');
  }
  setInterval(() => {
    document.querySelectorAll('video , video source').forEach((node) => {
      if (node.src) {
        SOCIALBROWSER.sendMessage({
          name: 'new-video-exists',
          src: node.src,
        });
      }
    });
  }, 1000);
});

navigator.clipboard = { writeText: SOCIALBROWSER.copy };

if (SOCIALBROWSER.customSetting.eval) {
  SOCIALBROWSER.eval(SOCIALBROWSER.customSetting.eval);
}

// URL.createObjectURL = function (data) {
//   console.log(data);
// };
