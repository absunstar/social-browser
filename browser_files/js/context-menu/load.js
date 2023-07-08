module.exports = function (SOCIALBROWSER) {
  SOCIALBROWSER.is_white_site = SOCIALBROWSER.var.blocking.white_list.some((site) => site.url.length > 2 && document.location.href.like(site.url));

  SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));

  require(SOCIALBROWSER.files_dir + '/js/context-menu/menu.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/decode.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/window.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/keyboard.js')(SOCIALBROWSER);

  require(SOCIALBROWSER.files_dir + '/js/context-menu/custom.js')(SOCIALBROWSER);

  require(SOCIALBROWSER.files_dir + '/js/context-menu/doms.js')(SOCIALBROWSER);

  require(SOCIALBROWSER.files_dir + '/js/context-menu/nodes.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/videos.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/youtube.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/facebook.com.js')(SOCIALBROWSER);

  require(SOCIALBROWSER.files_dir + '/js/context-menu/safty.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/adsManager.js')(SOCIALBROWSER);

  if (!SOCIALBROWSER.var.core.javaScriptOFF) {
    // Load Custom Scripts
    // SOCIALBROWSER.var.scripts_files.forEach((file) => {
    //   require(file.path)(SOCIALBROWSER);
    // });

    if (true) {
      // load user preload list
      SOCIALBROWSER.var.preload_list.forEach((p) => {
        try {
          require(p.path.replace('{dir}', SOCIALBROWSER.dir))(SOCIALBROWSER);
        } catch (error) {
          SOCIALBROWSER.log(error);
        }
      });

      document.addEventListener('DOMSubtreeModified', function (e) {
        SOCIALBROWSER.callEvent('html-edited', e.target);
      });

      document.addEventListener('DOMNodeInserted', function (e) {
        SOCIALBROWSER.callEvent('html-added', e.target);

        if (e.target.querySelectorAll) {
          let arr = e.target.querySelectorAll('*');
          if (arr) {
            arr.forEach((el) => {
              SOCIALBROWSER.callEvent('html-added', el);
            });
          }
        }
      });
      document.addEventListener('DOMNodeRemoved', function (e) {
        SOCIALBROWSER.callEvent('html-removed', e.target);
      });
    }
  }

  require(SOCIALBROWSER.files_dir + '/js/context-menu/finger_print.js')(SOCIALBROWSER);

  window.addEventListener('mousedown', (e) => {
    if (SOCIALBROWSER.customSetting.windowType == 'view') {
      SOCIALBROWSER.call('[send-render-message]', {
        name: 'window_clicked',
        win_id: SOCIALBROWSER.remote.getCurrentWindow().id,
      });
    }
  });

  // user agent

  SOCIALBROWSER.var.customHeaderList.forEach((h) => {
    if (h.type == 'request' && document.location.href.like(h.url)) {
      h.list.forEach((v) => {
        if (v && v.name && v.name == 'User-Agent' && v.value) {
          SOCIALBROWSER.user_agent_url = v.value;
        }
      });
    }
  });

  if (!SOCIALBROWSER.user_agent_url) {
    if (SOCIALBROWSER.session.user_agent) {
      SOCIALBROWSER.user_agent_url = SOCIALBROWSER.session.user_agent.url;
    } else {
      SOCIALBROWSER.user_agent_url = SOCIALBROWSER.currentWindow.webContents.getUserAgent() || SOCIALBROWSER.var.core.user_agent;
    }

    if (SOCIALBROWSER.user_agent_url == 'undefined') {
      SOCIALBROWSER.user_agent_url = SOCIALBROWSER.var.core.user_agent;
    }
  }

  if (!SOCIALBROWSER.user_agent_info) {
    SOCIALBROWSER.user_agent_info = SOCIALBROWSER.var.user_agent_list.find((u) => u.url == SOCIALBROWSER.user_agent_url);
    if (SOCIALBROWSER.user_agent_info) {
      if (SOCIALBROWSER.user_agent_info.vendor) {
        SOCIALBROWSER.__define(navigator, 'vendor', SOCIALBROWSER.user_agent_info.vendor);
        if (SOCIALBROWSER.user_agent_info.engine && SOCIALBROWSER.user_agent_info.engine.name === 'Chrome') {
          let chrome = JSON.parse(
            '{"app":{"isInstalled":false,"InstallState":{"DISABLED":"disabled","INSTALLED":"installed","NOT_INSTALLED":"not_installed"},"RunningState":{"CANNOT_RUN":"cannot_run","READY_TO_RUN":"ready_to_run","RUNNING":"running"}},"runtime":{"OnInstalledReason":{"CHROME_UPDATE":"chrome_update","INSTALL":"install","SHARED_MODULE_UPDATE":"shared_module_update","UPDATE":"update"},"OnRestartRequiredReason":{"APP_UPDATE":"app_update","OS_UPDATE":"os_update","PERIODIC":"periodic"},"PlatformArch":{"ARM":"arm","ARM64":"arm64","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformNaclArch":{"ARM":"arm","MIPS":"mips","MIPS64":"mips64","X86_32":"x86-32","X86_64":"x86-64"},"PlatformOs":{"ANDROID":"android","CROS":"cros","LINUX":"linux","MAC":"mac","OPENBSD":"openbsd","WIN":"win"},"RequestUpdateCheckStatus":{"NO_UPDATE":"no_update","THROTTLED":"throttled","UPDATE_AVAILABLE":"update_available"}}}'
          );
          chrome.csi = () => {};
          chrome.loadTimes = () => {};
          SOCIALBROWSER.__define(window, 'chrome', chrome);
        } else if (SOCIALBROWSER.user_agent_info.engine && SOCIALBROWSER.user_agent_info.engine.name === 'Edge') {
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
        } else if (SOCIALBROWSER.user_agent_info.engine && SOCIALBROWSER.user_agent_info.engine.name === 'Firefox') {
          window.mozRTCIceCandidate = window.RTCIceCandidate;
          window.mozRTCPeerConnection = window.RTCPeerConnection;
          window.mozRTCSessionDescription = window.RTCSessionDescription;
          window.mozInnerScreenX = 0;
          window.mozInnerScreenY = 74;
        }
      }
      if (SOCIALBROWSER.user_agent_info.oscpu) {
        SOCIALBROWSER.__define(navigator, 'oscpu', SOCIALBROWSER.user_agent_info.oscpu);
      }
      if (SOCIALBROWSER.user_agent_info.platform) {
        SOCIALBROWSER.__define(navigator, 'platform', SOCIALBROWSER.user_agent_info.platform);
      }
      if (SOCIALBROWSER.user_agent_info.productSub) {
        SOCIALBROWSER.__define(navigator, 'productSub', SOCIALBROWSER.user_agent_info.productSub);
      }
    }
  }

  if (SOCIALBROWSER.var.blocking.privacy.enable_virtual_pc && SOCIALBROWSER.var.blocking.privacy.vpc.mask_user_agent) {
    if (!SOCIALBROWSER.user_agent_url.like('*[xx-*')) {
      SOCIALBROWSER.user_agent_url = SOCIALBROWSER.user_agent_url.replace(') ', ') [xx-' + SOCIALBROWSER.guid() + '] ');
    }
  }

  SOCIALBROWSER.__define(navigator, 'userAgent', SOCIALBROWSER.user_agent_url);
  SOCIALBROWSER.userAgent = navigator.userAgent;
  SOCIALBROWSER.__define(navigator, 'userAgentData', {
    brands: [
      {
        brand: 'Google Chrome',
        version: '113',
      },
      {
        brand: 'Chromium',
        version: '113',
      },
      {
        brand: 'Not-A.Brand',
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
  });

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

  if (SOCIALBROWSER.var.blocking.javascript.block_eval) {
    window.eval = function (code) {
      SOCIALBROWSER.log('eval block', code);
    };
  }

  SOCIALBROWSER.on('$download_item', (e, dl) => {
    SOCIALBROWSER.showDownloads(` ${dl.status} ${((dl.received / dl.total) * 100).toFixed(2)} %  ${dl.name} ( ${(dl.received / 1000000).toFixed(2)} MB / ${(dl.total / 1000000).toFixed(2)} MB )`);
  });
  SOCIALBROWSER.on('found-in-page', (event, data) => {
    if (data.win_id == SOCIALBROWSER.currentWindow.id) {
      // SOCIALBROWSER.log(data);
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

  SOCIALBROWSER.on('user_downloads', (event, data) => {
    showDownloads(data.message, data.class);
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
      SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));
    }
    SOCIALBROWSER.callEvent('updated', { name: res.options.name });
  });

  SOCIALBROWSER.onLoad(() => {
    if (!SOCIALBROWSER.jqueryLoaded && SOCIALBROWSER.var.blocking.javascript.allow_jquery && !window.jQuery) {
      SOCIALBROWSER.jqueryLoaded = true;
      window.$ = window.jQuery = require(SOCIALBROWSER.files_dir + '/js/jquery.js');
    }
    return;
    document.querySelectorAll('*').forEach((el) => {
      SOCIALBROWSER.callEvent('html-added', el);
    });
  });
};
