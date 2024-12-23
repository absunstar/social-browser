SOCIALBROWSER.var.session_list.sort((a, b) => (a.time > b.time ? -1 : 1));
if ((policy = true)) {
  SOCIALBROWSER.policy = {
    createHTML: (string) => string,
    createScriptURL: (string) => string,
    createScript: (string) => string,
  };
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    SOCIALBROWSER.policy = window.trustedTypes.createPolicy('social', {
      createHTML: (string) => string,
      createScriptURL: (string) => string,
      createScript: (string) => string,
    });
  }

  // window.trustedTypes.createPolicy('default', {
  //   createHTML: (string) => string,
  //   createScriptURL: (string) => string,
  //   createScript: (string) => string,
  // });
}

if (!SOCIALBROWSER.isWhiteSite) {
  // some site check if it native function
  window.eval0 = window.eval;
  window.eval = function (...code) {
    try {
      return window.eval0(...code);
    } catch (error) {
      console.log(error);
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
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/decode.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/window.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/keyboard.js');

SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/doms.js');

SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/nodes.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/videos.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/youtube.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/facebook.com.js');

SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/safty.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/adsManager.js');
SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/cloudflare.js');

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

SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/context-menu/finger_print.js');

// user agent

if ((randomUserAgentSupport = true)) {
  SOCIALBROWSER.userAgentDeviceList = [
    {
      name: 'PC',
      platformList: [
        { name: 'Windows NT 6.1; WOW64', code: 'Win32' },
        { name: 'Windows NT 10.0; Win64; x64', code: 'Win32' },
        { name: 'Windows NT 11.0; Win64; x64', code: 'Win32' },
        { name: 'Windows NT 10.0', code: 'Win32' },
        { name: 'Windows NT 11.0', code: 'Win32' },
        { name: 'MacIntel', code: 'MacIntel' },
        { name: 'Macintosh; Intel Mac OS X 13_0', code: 'MacIntel' },
        { name: 'Macintosh; Intel Mac OS X 14_0', code: 'MacIntel' },
        { name: 'Macintosh; Intel Mac OS X 15_0', code: 'MacIntel' },
        { name: 'Macintosh; Intel Mac OS X 16_0', code: 'MacIntel' },
        { name: 'Linux x86_64', code: 'Linux x86_64' },
        { name: 'X11; Ubuntu; Linux x86_64', code: 'Linux x86_64' },
      ],
    },
    {
      name: 'Mobile',
      platformList: [
        { name: 'Linux; Android 11', code: 'Android' },
        { name: 'Linux; Android 12', code: 'Android' },
        { name: 'Linux; Android 13', code: 'Android' },
        { name: 'Linux; Android 14', code: 'Android' },
        { name: 'Linux; Android 15', code: 'Android' },
        { name: 'iPhone; CPU iPhone OS 13_0 like Mac OS X', code: 'iPhone' },
        { name: 'iPhone; CPU iPhone OS 14_0  like Mac OS X', code: 'iPhone' },
        { name: 'iPhone; CPU iPhone OS 15_0  like Mac OS X', code: 'iPhone' },
        { name: 'iPhone; CPU iPhone OS 16_0  like Mac OS X', code: 'iPhone' },
        { name: 'iPad; CPU OS 13_0  like Mac OS X', code: 'iPad' },
        { name: 'iPad; CPU OS 14_0  like Mac OS X', code: 'iPad' },
        { name: 'iPad; CPU OS 15_0  like Mac OS X', code: 'iPad' },
        { name: 'iPad; CPU OS 16_0  like Mac OS X', code: 'iPad' },
      ],
    },
  ];
  SOCIALBROWSER.userAgentBrowserList = [
    {
      name: 'Chrome',
      vendor: 'Google Inc.',
      prefix: '',
      randomMajor: () => SOCIALBROWSER.randomNumber(100, 132),
      randomMinor: () => SOCIALBROWSER.randomNumber(0, 5735),
      randomPatch: () => SOCIALBROWSER.randomNumber(0, 199),
    },
    {
      name: 'Edge',
      vendor: '',
      prefix: '',
      randomMajor: () => SOCIALBROWSER.randomNumber(100, 132),
      randomMinor: () => SOCIALBROWSER.randomNumber(0, 5735),
      randomPatch: () => SOCIALBROWSER.randomNumber(0, 199),
    },
    {
      name: 'Firefox',
      vendor: 'Mozilla',
      prefix: '',
      randomMajor: () => SOCIALBROWSER.randomNumber(90, 133),
      randomMinor: () => SOCIALBROWSER.randomNumber(0, 9),
      randomPatch: () => SOCIALBROWSER.randomNumber(0, 99),
    },
    {
      name: 'Safari',
      vendor: 'Apple Computer, Inc.',
      prefix: '',
      randomMajor: () => SOCIALBROWSER.randomNumber(600, 605),
      randomMinor: () => SOCIALBROWSER.randomNumber(1, 15),
      randomPatch: () => SOCIALBROWSER.randomNumber(10, 14),
    },
    {
      name: 'Opera',
      vendor: '',
      prefix: '',
      randomMajor: () => SOCIALBROWSER.randomNumber(100, 132),
      randomMinor: () => SOCIALBROWSER.randomNumber(0, 5735),
      randomPatch: () => SOCIALBROWSER.randomNumber(0, 199),
    },
  ];

  SOCIALBROWSER.getRandomBrowser = function () {
    let browser = { ...SOCIALBROWSER.userAgentBrowserList[SOCIALBROWSER.randomNumber(0, SOCIALBROWSER.userAgentBrowserList.length - 1)] };
    browser.device = SOCIALBROWSER.userAgentDeviceList[SOCIALBROWSER.randomNumber(0, SOCIALBROWSER.userAgentDeviceList.length - 1)];
    browser.platformInfo = browser.device.platformList[SOCIALBROWSER.randomNumber(0, browser.device.platformList.length - 1)];
    browser.platform = browser.platformInfo.code;
    if (browser.device.name === 'Mobile') {
      browser.prefix = 'Mobile';
    }

    browser.major = browser.randomMajor();
    browser.minor = browser.randomMinor();
    browser.patch = browser.randomPatch();

    browser.randomMajor = undefined;
    browser.randomMinor = undefined;
    browser.randomPatch = undefined;

    if (browser.name.contains('Safari')) {
      browser.url = `Mozilla/5.0 (${browser.platformInfo.name}) AppleWebKit/${browser.major}.${browser.minor} (KHTML, like Gecko) Version/${browser.patch}.0 Safari/${browser.major}.${browser.minor}`;
    }
    if (browser.name.contains('Firefox')) {
      browser.url = `Mozilla/5.0 (${browser.platformInfo.name}; rv:${browser.major}.${browser.minor}) Gecko/20100101 Firefox/${browser.major}.${browser.minor}`;
    } else {
      browser.url = `Mozilla/5.0 (${browser.platformInfo.name}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.major}.${browser.minor}.${browser.patch} ${browser.prefix} Safari/537.36`;
    }

    if (browser.name.contains('Edge')) {
      browser.url += ` ${browser.name}/${browser.major}.${browser.minor}.${browser.patch}`;
    }
    return browser;
  };

  SOCIALBROWSER.getRandomUserAgent = function () {
    return SOCIALBROWSER.getRandomBrowser().url;
  };
}

if (SOCIALBROWSER.customSetting.userAgentURL) {
  SOCIALBROWSER.userAgentURL = SOCIALBROWSER.customSetting.userAgentURL;
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
  if (SOCIALBROWSER.defaultUserAgent.engine && SOCIALBROWSER.defaultUserAgent.engine.name === 'Chrome') {
    let chrome = JSON.parse(
      '{"app":{"isInstalled":false,"InstallState":{"DISABLED":"disabled","INSTALLED":"installed","NOT_INSTALLED":"not_installed"},"RunningState":{"CANNOT_RUN":"cannot_run","READY_TO_RUN":"ready_to_run","RUNNING":"running"}},"runtime":{"OnInstalledReason":{"CHROME_UPDATE":"chrome_update","INSTALL":"install","SHARED_MODULE_UPDATE":"shared_module_update","UPDATE":"update"},"OnRestartRequiredReason":{"APP_UPDATE":"app_update","OS_UPDATE":"os_update","PERIODIC":"periodic"},"PlatformArch":{"ARM":"arm","ARM64":"arm64","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformNaclArch":{"ARM":"arm","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformOs":{"ANDROID":"android","CROS":"cros","LINUX":"linux","MAC":"mac","OPENBSD":"openbsd","WIN":"win"},"RequestUpdateCheckStatus":{"NO_UPDATE":"no_update","THROTTLED":"throttled","UPDATE_AVAILABLE":"update_available"}}}'
    );
    chrome.csi = () => {};
    chrome.loadTimes = () => {};
    SOCIALBROWSER.__define(window, 'chrome', chrome);
  } else if (SOCIALBROWSER.defaultUserAgent.engine && SOCIALBROWSER.defaultUserAgent.engine.name === 'Edge') {
    let chrome = JSON.parse(
      '{"appPinningPrivate":{},"authPrivate":{"onServiceAuthStateChanged":{},"onSignInStateChanged":{},"AccountType":{"AAD":"AAD","MSA":"MSA","NO_ACCOUNT":"NO_ACCOUNT","UNSUPPORTED_SOVEREIGNTY":"UNSUPPORTED_SOVEREIGNTY"},"RegionScope":{"ARLINGTON":"ARLINGTON","BLACKFOREST":"BLACKFOREST","DOD":"DOD","DOJ":"DOJ","FAIRFAX":"FAIRFAX","GALLATIN":"GALLATIN","GCC_MODERATE":"GCC_MODERATE","GLOBAL":"GLOBAL","MAX_VALUE":"MAX_VALUE","OTHER":"OTHER","OTHER_US_GOV":"OTHER_US_GOV","UNKNOWN":"UNKNOWN"}},"ntpSettingsPrivate":{"onConfigDataChanged":{},"onPrefsChanged":{},"ControlledBy":{"DEVICE_POLICY":"DEVICE_POLICY","EXTENSION":"EXTENSION","OWNER":"OWNER","PRIMARY_USER":"PRIMARY_USER","USER_POLICY":"USER_POLICY"},"Enforcement":{"ENFORCED":"ENFORCED","RECOMMENDED":"RECOMMENDED"},"PrefType":{"BOOLEAN":"BOOLEAN","DICTIONARY":"DICTIONARY","LIST":"LIST","NUMBER":"NUMBER","STRING":"STRING","URL":"URL"}},"runtime":{"OnInstalledReason":{"CHROME_UPDATE":"chrome_update","INSTALL":"install","SHARED_MODULE_UPDATE":"shared_module_update","UPDATE":"update"},"OnRestartRequiredReason":{"APP_UPDATE":"app_update","OS_UPDATE":"os_update","PERIODIC":"periodic"},"PlatformArch":{"ARM":"arm","ARM64":"arm64","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformNaclArch":{"ARM":"arm","ARM64":"arm64","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformOs":{"ANDROID":"android","CROS":"cros","LINUX":"linux","MAC":"mac","OPENBSD":"openbsd","WIN":"win"},"RequestUpdateCheckStatus":{"NO_UPDATE":"no_update","THROTTLED":"throttled","UPDATE_AVAILABLE":"update_available"}},"shellIntegrationPrivate":{},"embeddedSearch":{"searchBox":{"rtl":false,"isFocused":false,"isKeyCaptureEnabled":false},"newTabPage":{"isInputInProgress":false,"mostVisited":[{"rid":1,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://wordpress.com/"},{"rid":2,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://javfinder.la/movie/watch/tre-148-b-prestige-losing-virginity-best-vol-05-the-best-first-experience-with-the-best-body-and-great-support-part-b.html"},{"rid":3,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://ae.godaddy.com/whois/results.aspx?checkAvail=1&domain=spicekingdom.com.eg&domainName=spicekingdom.com.eg"},{"rid":4,"faviconUrl":"chrome-search://ntpicon/?size=48@1.000000x&url=https://www.office.com/"}],"mostVisitedAvailable":true,"ntpTheme":{"usingDefaultTheme":true,"backgroundColorRgba":[247,247,247,255],"textColorRgba":[0,0,0,255],"textColorLightRgba":[102,102,102,255],"alternateLogo":false,"themeId":"","themeName":"","customBackgroundDisabledByPolicy":false,"customBackgroundConfigured":false,"isNtpBackgroundDark":false,"useTitleContainer":false,"iconBackgroundColor":[241,243,244,255],"useWhiteAddIcon":false,"logoColor":[238,238,238,255],"colorId":-1,"searchBox":{"bg":[255,0,0,255],"icon":[255,0,0,255],"iconSelected":[255,0,0,255],"placeholder":[255,0,0,255],"resultsBg":[255,0,0,255],"resultsBgHovered":[255,0,0,255],"resultsBgSelected":[255,0,0,255],"resultsDim":[255,0,0,255],"resultsDimSelected":[255,0,0,255],"resultsText":[255,0,0,255],"resultsTextSelected":[255,0,0,255],"resultsUrl":[255,0,0,255],"resultsUrlSelected":[255,0,0,255],"text":[255,0,0,255]}},"themeBackgroundInfo":{"usingDefaultTheme":true,"backgroundColorRgba":[247,247,247,255],"textColorRgba":[0,0,0,255],"textColorLightRgba":[102,102,102,255],"alternateLogo":false,"themeId":"","themeName":"","customBackgroundDisabledByPolicy":false,"customBackgroundConfigured":false,"isNtpBackgroundDark":false,"useTitleContainer":false,"iconBackgroundColor":[241,243,244,255],"useWhiteAddIcon":false,"logoColor":[238,238,238,255],"colorId":-1,"searchBox":{"bg":[255,0,0,255],"icon":[255,0,0,255],"iconSelected":[255,0,0,255],"placeholder":[255,0,0,255],"resultsBg":[255,0,0,255],"resultsBgHovered":[255,0,0,255],"resultsBgSelected":[255,0,0,255],"resultsDim":[255,0,0,255],"resultsDimSelected":[255,0,0,255],"resultsText":[255,0,0,255],"resultsTextSelected":[255,0,0,255],"resultsUrl":[255,0,0,255],"resultsUrlSelected":[255,0,0,255],"text":[255,0,0,255]}}}}}'
    );
    chrome.appPinningPrivate = {
      getPins: () => {},
      pinPage: () => {},
    };
    chrome.csi = () => {};
    chrome.loadTimes = () => {};
    SOCIALBROWSER.__define(window, 'chrome', chrome);
  } else if (SOCIALBROWSER.defaultUserAgent.engine && SOCIALBROWSER.defaultUserAgent.engine.name === 'Firefox') {
    SOCIALBROWSER.__define(window, 'chrome', undefined);
    SOCIALBROWSER.__define(window, 'mozRTCIceCandidate', window.RTCIceCandidate);
    SOCIALBROWSER.__define(window, 'mozRTCPeerConnection', window.RTCPeerConnection);
    SOCIALBROWSER.__define(window, 'mozRTCSessionDescription', window.RTCSessionDescription);
    window.mozInnerScreenX = 0;
    window.mozInnerScreenY = 74;
  }

  if (SOCIALBROWSER.userAgentURL.indexOf('Chrome/') !== -1) {
    let version = SOCIALBROWSER.userAgentURL.split('Chrome/')[1].split(' ')[0].split('.')[0];
    SOCIALBROWSER.userAgentData = {
      brands: [
        {
          brand: 'Chromium',
          version: version,
        },
        {
          brand: 'Google Chrome',
          version: version,
        },
        {
          brand: 'Not_A Brand',
          version: '24',
        },
      ],
      mobile: false,
      platform: 'windows',
      getHighEntropyValues: function (arr) {
        return new Promise((resolve, reject) => {
          let obj = { ...navigator.userAgentData };
          if (Array.isArray(arr)) {
            arr.forEach((a) => {
              if (!obj[a]) {
                obj[a] = '';
              }
            });
          }
          resolve(obj);
        });
      },
    };
  }

  if (SOCIALBROWSER.defaultUserAgent.device && SOCIALBROWSER.defaultUserAgent.device.name === 'Mobile') {
    SOCIALBROWSER.userAgentData = SOCIALBROWSER.userAgentData || {};
    SOCIALBROWSER.userAgentData.mobile = true;
    SOCIALBROWSER.userAgentData.platform = SOCIALBROWSER.defaultUserAgent.platform;

    SOCIALBROWSER.__define(navigator, 'maxTouchPoints', 5);
    SOCIALBROWSER.__define(window, 'ontouchstart', function () {});
  }
  if (SOCIALBROWSER.userAgentData) {
    SOCIALBROWSER.__define(navigator, 'userAgentData', SOCIALBROWSER.userAgentData);
  }

  if (SOCIALBROWSER.defaultUserAgent.vendor) {
    SOCIALBROWSER.__define(navigator, 'vendor', SOCIALBROWSER.defaultUserAgent.vendor);
  }

  if (SOCIALBROWSER.defaultUserAgent.platform) {
    SOCIALBROWSER.__define(navigator, 'platform', SOCIALBROWSER.defaultUserAgent.platform);
  }
}

if (SOCIALBROWSER.var.blocking.privacy.enable_virtual_pc && SOCIALBROWSER.var.blocking.privacy.vpc.maskUserAgentURL) {
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

SOCIALBROWSER.toggleWindowImagesStatus = true;
SOCIALBROWSER.on('[toggle-window-images]', (e, data) => {
  SOCIALBROWSER.toggleWindowImagesStatus = !SOCIALBROWSER.toggleWindowImagesStatus;
  document.querySelectorAll('img').forEach((img) => {
    if (SOCIALBROWSER.toggleWindowImagesStatus) {
      img.style.visibility = 'visible';
    } else {
      img.style.visibility = 'hidden';
    }
  });
 

  
});

SOCIALBROWSER.toggleWindowEditStatus = true;
SOCIALBROWSER.on('[toggle-window-edit]', (e, data) => {
  SOCIALBROWSER.toggleWindowEditStatus = !SOCIALBROWSER.toggleWindowEditStatus;
  let html = document.querySelector('html');
  if (SOCIALBROWSER.toggleWindowEditStatus) {
    html.contentEditable = true;
    html.style.border = '10px dashed green';
  } else {
    html.contentEditable = 'inherit';
    html.style.border = '0px solid white';
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
  if (res.options.name == 'session_list') {
    SOCIALBROWSER.var.session_list.sort((a, b) => (a.time > b.time ? -1 : 1));
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

SOCIALBROWSER.onLoad(() => {
  if (!SOCIALBROWSER.jqueryLoaded && SOCIALBROWSER.var.blocking.javascript.allow_jquery && !window.jQuery) {
    SOCIALBROWSER.jqueryLoaded = true;
    window.$ = window.jQuery = SOCIALBROWSER.require(SOCIALBROWSER.files_dir + '/js/jquery.js');
  }
});

navigator.clipboard = { writeText: SOCIALBROWSER.copy };

if (SOCIALBROWSER.customSetting.eval) {
  SOCIALBROWSER.eval(SOCIALBROWSER.customSetting.eval);
}
