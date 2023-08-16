module.exports = function (SOCIALBROWSER) {
  if (
    SOCIALBROWSER.customSetting.allowAds ||
    SOCIALBROWSER.var.core.javaScriptOFF ||
    !SOCIALBROWSER.var.blocking.core.block_ads ||
    SOCIALBROWSER.customSetting.windowType === 'main' ||
    SOCIALBROWSER.isWhiteSite ||
    document.location.href.like('*http://127.0.0.1*')
  ) {
    SOCIALBROWSER.log('.... [ UBlock Block OFF] .... ' + document.location.href);
    return;
  }
  SOCIALBROWSER.log('.... [ UBlock Block ON] .... ' + document.location.href);

  SOCIALBROWSER.onLoad(() => {
    (function () {
      'use strict';
      delete window.PopAds;
      delete window.popns;
      Object.defineProperties(window, {
        PopAds: { value: {} },
        popns: { value: {} },
      });
    })();

    (function () {
      'use strict';
      window.canRunAds = true;
      window.isAdBlockActive = false;
    })();

    (function () {
      'use strict';
      let browserId = '';
      for (let i = 0; i < 8; i++) {
        browserId += ((Math.random() * 0x10000 + 0x1000) | 0).toString(16).slice(-4);
      }
      const fp2 = function () {};
      fp2.get = function (opts, cb) {
        if (!cb) {
          cb = opts;
        }
        setTimeout(() => {
          cb(browserId, []);
        }, 1);
      };
      fp2.prototype = {
        get: fp2.get,
      };
      window.Fingerprint2 = fp2;
    })();
    (function () {
      'use strict';
      const signatures = [
        ['blockadblock'],
        ['babasbm'],
        [/getItem\('babn'\)/],
        [
          'getElementById',
          'String.fromCharCode',
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
          'charAt',
          'DOMContentLoaded',
          'AdBlock',
          'addEventListener',
          'doScroll',
          'fromCharCode',
          '<<2|r>>4',
          'sessionStorage',
          'clientWidth',
          'localStorage',
          'Math',
          'random',
        ],
      ];
      const check = function (s) {
        for (let i = 0; i < signatures.length; i++) {
          const tokens = signatures[i];
          let match = 0;
          for (let j = 0; j < tokens.length; j++) {
            const token = tokens[j];
            const pos = token instanceof RegExp ? s.search(token) : s.indexOf(token);
            if (pos !== -1) {
              match += 1;
            }
          }
          if (match / tokens.length >= 0.8) {
            return true;
          }
        }
        return false;
      };
      window.eval = new Proxy(window.eval, {
        apply: function (target, thisArg, args) {
          const a = args[0];
          if (typeof a !== 'string' || !check(a)) {
            return target.apply(thisArg, args);
          }
          if (document.body) {
            document.body.style.removeProperty('visibility');
          }
          let el = document.getElementById('babasbmsgx');
          if (el) {
            el.parentNode.removeChild(el);
          }
        },
      });
      window.setTimeout = new Proxy(window.setTimeout, {
        apply: function (target, thisArg, args) {
          const a = args[0];
          if (typeof a !== 'string' || /\.bab_elementid.$/.test(a) === false) {
            return target.apply(thisArg, args);
          }
        },
      });
    })();
    (function () {
      'use strict';
      const visitorId = (() => {
        let id = '';
        for (let i = 0; i < 8; i++) {
          id += ((Math.random() * 0x10000 + 0x1000) | 0).toString(16).slice(-4);
        }
        return id;
      })();
      const FingerprintJS = class {
        static hashComponents() {
          return visitorId;
        }
        static load() {
          return Promise.resolve(new FingerprintJS());
        }
        get() {
          return Promise.resolve({
            visitorId,
          });
        }
      };
      window.FingerprintJS = FingerprintJS;
    })();
    (function () {
      'use strict';
      const noopfn = function () {};
      window.addthis = {
        addEventListener: noopfn,
        button: noopfn,
        counter: noopfn,
        init: noopfn,
        layers: noopfn,
        ready: noopfn,
        sharecounters: {
          getShareCounts: noopfn,
        },
        toolbox: noopfn,
        update: noopfn,
      };
    })();

    (function () {
      'use strict';
      if (amznads) {
        return;
      }
      var w = window;
      var noopfn = function () {}.bind();
      var amznads = {
        appendScriptTag: noopfn,
        appendTargetingToAdServerUrl: noopfn,
        appendTargetingToQueryString: noopfn,
        clearTargetingFromGPTAsync: noopfn,
        doAllTasks: noopfn,
        doGetAdsAsync: noopfn,
        doTask: noopfn,
        detectIframeAndGetURL: noopfn,
        getAds: noopfn,
        getAdsAsync: noopfn,
        getAdForSlot: noopfn,
        getAdsCallback: noopfn,
        getDisplayAds: noopfn,
        getDisplayAdsAsync: noopfn,
        getDisplayAdsCallback: noopfn,
        getKeys: noopfn,
        getReferrerURL: noopfn,
        getScriptSource: noopfn,
        getTargeting: noopfn,
        getTokens: noopfn,
        getValidMilliseconds: noopfn,
        getVideoAds: noopfn,
        getVideoAdsAsync: noopfn,
        getVideoAdsCallback: noopfn,
        handleCallBack: noopfn,
        hasAds: noopfn,
        renderAd: noopfn,
        saveAds: noopfn,
        setTargeting: noopfn,
        setTargetingForGPTAsync: noopfn,
        setTargetingForGPTSync: noopfn,
        tryGetAdsAsync: noopfn,
        updateAds: noopfn,
      };
      w.amznads = amznads;
      w.amzn_ads = w.amzn_ads || noopfn;
      w.aax_write = w.aax_write || noopfn;
      w.aax_render_ad = w.aax_render_ad || noopfn;
    })();
    (function () {
      'use strict';
      const w = window;
      const noopfn = function () {}.bind();
      const _Q = (w.apstag && w.apstag._Q) || [];
      const apstag = {
        _Q,
        fetchBids: function (a, b) {
          if (typeof b === 'function') {
            b([]);
          }
        },
        init: noopfn,
        setDisplayBids: noopfn,
        targetingKeys: noopfn,
      };
      w.apstag = apstag;
      _Q.push = function (prefix, args) {
        try {
          switch (prefix) {
            case 'f':
              apstag.fetchBids(...args);
              break;
          }
        } catch (e) {
          console.trace(e);
        }
      };
      for (const cmd of _Q) {
        _Q.push(cmd);
      }
    })();

    (function () {
      'use strict';
      const noopfn = function () {};
      const Tracker = function () {};
      const p = Tracker.prototype;
      p.get = noopfn;
      p.set = noopfn;
      p.send = noopfn;
      const w = window;
      const gaName = w.GoogleAnalyticsObject || 'ga';
      const gaQueue = w[gaName];
      const ga = function () {
        const len = arguments.length;
        if (len === 0) {
          return;
        }
        const args = Array.from(arguments);
        let fn;
        let a = args[len - 1];
        if (a instanceof Object && a.hitCallback instanceof Function) {
          fn = a.hitCallback;
        } else if (a instanceof Function) {
          fn = () => {
            a(ga.create());
          };
        } else {
          const pos = args.indexOf('hitCallback');
          if (pos !== -1 && args[pos + 1] instanceof Function) {
            fn = args[pos + 1];
          }
        }
        if (fn instanceof Function === false) {
          return;
        }
        try {
          fn();
        } catch (ex) {}
      };
      ga.create = function () {
        return new Tracker();
      };
      ga.getByName = function () {
        return new Tracker();
      };
      ga.getAll = function () {
        return [new Tracker()];
      };
      ga.remove = noopfn;
      ga.loaded = true;
      w[gaName] = ga;
      const dl = w.dataLayer;
      if (dl instanceof Object) {
        if (dl.hide instanceof Object && typeof dl.hide.end === 'function') {
          dl.hide.end();
          dl.hide.end = () => {};
        }
        if (typeof dl.push === 'function') {
          const doCallback = function (item) {
            if (item instanceof Object === false) {
              return;
            }
            if (typeof item.eventCallback !== 'function') {
              return;
            }
            setTimeout(item.eventCallback, 1);
            item.eventCallback = () => {};
          };
          dl.push = new Proxy(dl.push, {
            apply: function (target, thisArg, args) {
              doCallback(args[0]);
              return Reflect.apply(target, thisArg, args);
            },
          });
          if (Array.isArray(dl)) {
            const q = dl.slice();
            for (const item of q) {
              doCallback(item);
            }
          }
        }
      }
      if (gaQueue instanceof Function && Array.isArray(gaQueue.q)) {
        const q = gaQueue.q.slice();
        gaQueue.q.length = 0;
        for (const entry of q) {
          ga(...entry);
        }
      }
    })();
    (function () {
      'use strict';
      const noopfn = function () {};
      window.cxApi = {
        chooseVariation: function () {
          return 0;
        },
        getChosenVariation: noopfn,
        setAllowHash: noopfn,
        setChosenVariation: noopfn,
        setCookiePath: noopfn,
        setDomainName: noopfn,
      };
    })();
    (function () {
      'use strict';
      const noopfn = function () {};
      const Gaq = function () {};
      Gaq.prototype.Na = noopfn;
      Gaq.prototype.O = noopfn;
      Gaq.prototype.Sa = noopfn;
      Gaq.prototype.Ta = noopfn;
      Gaq.prototype.Va = noopfn;
      Gaq.prototype._createAsyncTracker = noopfn;
      Gaq.prototype._getAsyncTracker = noopfn;
      Gaq.prototype._getPlugin = noopfn;
      Gaq.prototype.push = function (a) {
        if (typeof a === 'function') {
          a();
          return;
        }
        if (Array.isArray(a) === false) {
          return;
        }
        if (typeof a[0] === 'string' && /(^|\.)_link$/.test(a[0]) && typeof a[1] === 'string') {
          try {
            window.location.assign(a[1]);
          } catch (ex) {}
        }
        if (a[0] === '_set' && a[1] === 'hitCallback' && typeof a[2] === 'function') {
          a[2]();
        }
      };
      const tracker = (function () {
        const out = {};
        const api = [
          '_addIgnoredOrganic _addIgnoredRef _addItem _addOrganic',
          '_addTrans _clearIgnoredOrganic _clearIgnoredRef _clearOrganic',
          '_cookiePathCopy _deleteCustomVar _getName _setAccount',
          '_getAccount _getClientInfo _getDetectFlash _getDetectTitle',
          '_getLinkerUrl _getLocalGifPath _getServiceMode _getVersion',
          '_getVisitorCustomVar _initData _linkByPost',
          '_setAllowAnchor _setAllowHash _setAllowLinker _setCampContentKey',
          '_setCampMediumKey _setCampNameKey _setCampNOKey _setCampSourceKey',
          '_setCampTermKey _setCampaignCookieTimeout _setCampaignTrack _setClientInfo',
          '_setCookiePath _setCookiePersistence _setCookieTimeout _setCustomVar',
          '_setDetectFlash _setDetectTitle _setDomainName _setLocalGifPath',
          '_setLocalRemoteServerMode _setLocalServerMode _setReferrerOverride _setRemoteServerMode',
          '_setSampleRate _setSessionTimeout _setSiteSpeedSampleRate _setSessionCookieTimeout',
          '_setVar _setVisitorCookieTimeout _trackEvent _trackPageLoadTime',
          '_trackPageview _trackSocial _trackTiming _trackTrans',
          '_visitCode',
        ]
          .join(' ')
          .split(/\s+/);
        for (const method of api) {
          out[method] = noopfn;
        }
        out._getLinkerUrl = function (a) {
          return a;
        };
        out._link = function (a) {
          if (typeof a !== 'string') {
            return;
          }
          try {
            window.location.assign(a);
          } catch (ex) {}
        };
        return out;
      })();
      const Gat = function () {};
      Gat.prototype._anonymizeIP = noopfn;
      Gat.prototype._createTracker = noopfn;
      Gat.prototype._forceSSL = noopfn;
      Gat.prototype._getPlugin = noopfn;
      Gat.prototype._getTracker = function () {
        return tracker;
      };
      Gat.prototype._getTrackerByName = function () {
        return tracker;
      };
      Gat.prototype._getTrackers = noopfn;
      Gat.prototype.aa = noopfn;
      Gat.prototype.ab = noopfn;
      Gat.prototype.hb = noopfn;
      Gat.prototype.la = noopfn;
      Gat.prototype.oa = noopfn;
      Gat.prototype.pa = noopfn;
      Gat.prototype.u = noopfn;
      const gat = new Gat();
      window._gat = gat;
      //
      const gaq = new Gaq();
      (function () {
        const aa = window._gaq || [];
        if (Array.isArray(aa)) {
          while (aa[0]) {
            gaq.push(aa.shift());
          }
        }
      })();
      window._gaq = gaq.qf = gaq;
    })();
    (function () {
      'use strict';
      window._gaq = window._gaq || {
        push: function () {},
      };
    })();
    (function () {
      'use strict';
      const init = () => {
        window.adsbygoogle = {
          loaded: true,
          push: function () {},
        };
        const phs = document.querySelectorAll('.adsbygoogle');
        const css = 'height:1px!important;max-height:1px!important;max-width:1px!important;width:1px!important;';
        for (let i = 0; i < phs.length; i++) {
          const id = `aswift_${i}`;
          if (document.querySelector(`iframe#${id}`) !== null) {
            continue;
          }
          const fr = document.createElement('iframe');
          fr.id = id;
          fr.style = css;
          const cfr = document.createElement('iframe');
          cfr.id = `google_ads_frame${i}`;
          fr.appendChild(cfr);
          phs[i].appendChild(fr);
        }
      };
      if (document.querySelectorAll('.adsbygoogle').length === 0 && document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init, { once: true });
      } else {
        init();
      }
    })();

    (function () {
      'use strict';
      const noopfn = function () {};
      const w = window;
      w.ga = w.ga || noopfn;
      const dl = w.dataLayer;
      if (dl instanceof Object === false) {
        return;
      }
      if (dl.hide instanceof Object && typeof dl.hide.end === 'function') {
        dl.hide.end();
      }
      if (typeof dl.push === 'function') {
        dl.push = function (o) {
          if (o instanceof Object && typeof o.eventCallback === 'function') {
            setTimeout(o.eventCallback, 1);
          }
        };
      }
    })();

    (function () {
      'use strict';
      const noopfn = function () {}.bind();
      const noopthisfn = function () {
        return this;
      };
      const noopnullfn = function () {
        return null;
      };
      const nooparrayfn = function () {
        return [];
      };
      const noopstrfn = function () {
        return '';
      };

      const companionAdsService = {
        addEventListener: noopthisfn,
        enableSyncLoading: noopfn,
        setRefreshUnfilledSlots: noopfn,
      };
      const contentService = {
        addEventListener: noopthisfn,
        setContent: noopfn,
      };
      const PassbackSlot = function () {};
      let p = PassbackSlot.prototype;
      p.display = noopfn;
      p.get = noopnullfn;
      p.set = noopthisfn;
      p.setClickUrl = noopthisfn;
      p.setTagForChildDirectedTreatment = noopthisfn;
      p.setTargeting = noopthisfn;
      p.updateTargetingFromMap = noopthisfn;
      const pubAdsService = {
        addEventListener: noopthisfn,
        clear: noopfn,
        clearCategoryExclusions: noopthisfn,
        clearTagForChildDirectedTreatment: noopthisfn,
        clearTargeting: noopthisfn,
        collapseEmptyDivs: noopfn,
        defineOutOfPagePassback: function () {
          return new PassbackSlot();
        },
        definePassback: function () {
          return new PassbackSlot();
        },
        disableInitialLoad: noopfn,
        display: noopfn,
        enableAsyncRendering: noopfn,
        enableSingleRequest: noopfn,
        enableSyncRendering: noopfn,
        enableVideoAds: noopfn,
        get: noopnullfn,
        getAttributeKeys: nooparrayfn,
        getTargeting: noopfn,
        getTargetingKeys: nooparrayfn,
        getSlots: nooparrayfn,
        refresh: noopfn,
        removeEventListener: noopfn,
        set: noopthisfn,
        setCategoryExclusion: noopthisfn,
        setCentering: noopfn,
        setCookieOptions: noopthisfn,
        setForceSafeFrame: noopthisfn,
        setLocation: noopthisfn,
        setPublisherProvidedId: noopthisfn,
        setPrivacySettings: noopthisfn,
        setRequestNonPersonalizedAds: noopthisfn,
        setSafeFrameConfig: noopthisfn,
        setTagForChildDirectedTreatment: noopthisfn,
        setTargeting: noopthisfn,
        setVideoContent: noopthisfn,
        updateCorrelator: noopfn,
      };
      const SizeMappingBuilder = function () {};
      p = SizeMappingBuilder.prototype;
      p.addSize = noopthisfn;
      p.build = noopnullfn;
      const Slot = function () {};
      p = Slot.prototype;
      p.addService = noopthisfn;
      p.clearCategoryExclusions = noopthisfn;
      p.clearTargeting = noopthisfn;
      p.defineSizeMapping = noopthisfn;
      p.get = noopnullfn;
      p.getAdUnitPath = nooparrayfn;
      p.getAttributeKeys = nooparrayfn;
      p.getCategoryExclusions = nooparrayfn;
      p.getDomId = noopstrfn;
      p.getResponseInformation = noopnullfn;
      p.getSlotElementId = noopstrfn;
      p.getSlotId = noopthisfn;
      p.getTargeting = nooparrayfn;
      p.getTargetingKeys = nooparrayfn;
      p.set = noopthisfn;
      p.setCategoryExclusion = noopthisfn;
      p.setClickUrl = noopthisfn;
      p.setCollapseEmptyDiv = noopthisfn;
      p.setTargeting = noopthisfn;
      p.updateTargetingFromMap = noopthisfn;
      //
      const gpt = window.googletag || {};
      const cmd = gpt.cmd || [];
      gpt.apiReady = true;
      gpt.cmd = [];
      gpt.cmd.push = function (a) {
        try {
          a();
        } catch (ex) {}
        return 1;
      };
      gpt.companionAds = function () {
        return companionAdsService;
      };
      gpt.content = function () {
        return contentService;
      };
      gpt.defineOutOfPageSlot = function () {
        return new Slot();
      };
      gpt.defineSlot = function () {
        return new Slot();
      };
      gpt.destroySlots = noopfn;
      gpt.disablePublisherConsole = noopfn;
      gpt.display = noopfn;
      gpt.enableServices = noopfn;
      gpt.getVersion = noopstrfn;
      gpt.pubads = function () {
        return pubAdsService;
      };
      gpt.pubadsReady = true;
      gpt.setAdIframeTitle = noopfn;
      gpt.sizeMapping = function () {
        return new SizeMappingBuilder();
      };
      window.googletag = gpt;
      while (cmd.length !== 0) {
        gpt.cmd.push(cmd.shift());
      }
    })();
    if (!window.google || !window.google.ima || !window.google.ima.VERSION) {
      const VERSION = '3.517.2';

      const CheckCanAutoplay = (function () {
        const TEST_VIDEO = new Blob(
          [
            new Uint32Array([
              469762048, 1887007846, 1752392036, 0, 913273705, 1717987696, 828601953, -1878917120, 1987014509, 1811939328, 1684567661, 0, 0, 0, -402456576, 0, 256, 1, 0, 0, 256, 0, 0, 0, 256, 0, 0, 0,
              64, 0, 0, 0, 0, 0, 0, 33554432, -201261056, 1801548404, 1744830464, 1684564852, 251658241, 0, 0, 0, 0, 16777216, 0, -1, -1, 0, 0, 0, 0, 256, 0, 0, 0, 256, 0, 0, 0, 64, 5, 53250,
              -2080309248, 1634296941, 738197504, 1684563053, 1, 0, 0, 0, 0, -2137614336, -1, -1, 50261, 754974720, 1919706216, 0, 0, 1701079414, 0, 0, 0, 1701079382, 1851869295, 1919249508, 16777216,
              1852402979, 102, 1752004116, 100, 1, 0, 0, 1852400676, 102, 1701995548, 102, 0, 1, 1819440396, 32, 1, 1651799011, 108, 1937011607, 100, 0, 1, 1668702599, 49, 0, 1, 0, 0, 0, 33555712,
              4718800, 4718592, 0, 65536, 0, 0, 0, 0, 0, 0, 0, 0, 16776984, 1630601216, 21193590, -14745500, 1729626337, -1407254428, 89161945, 1049019, 9453056, -251611125, 27269507, -379058688,
              -1329024392, 268435456, 1937011827, 0, 0, 268435456, 1668510835, 0, 0, 335544320, 2054386803, 0, 0, 0, 268435456, 1868788851, 0, 0, 671088640, 2019915373, 536870912, 2019914356, 0,
              16777216, 16777216, 0, 0, 0,
            ]),
          ],
          { type: 'video/mp4' }
        );

        let testVideo;

        return function () {
          if (!testVideo) {
            testVideo = document.createElement('video');
            testVideo.style = 'position:absolute; width:0; height:0; left:0; right:0; z-index:-1; border:0';
            testVideo.setAttribute('muted', 'muted');
            testVideo.setAttribute('playsinline', 'playsinline');
            testVideo.src = URL.createObjectURL(TEST_VIDEO);
            document.body.appendChild(testVideo);
          }
          return testVideo.play();
        };
      })();

      let ima = {};

      class AdDisplayContainer {
        destroy() {}
        initialize() {}
      }

      class ImaSdkSettings {
        constructor() {
          this.c = true;
          this.f = {};
          this.i = false;
          this.l = '';
          this.p = '';
          this.r = 0;
          this.t = '';
          this.v = '';
        }
        getCompanionBackfill() {}
        getDisableCustomPlaybackForIOS10Plus() {
          return this.i;
        }
        getFeatureFlags() {
          return this.f;
        }
        getLocale() {
          return this.l;
        }
        getNumRedirects() {
          return this.r;
        }
        getPlayerType() {
          return this.t;
        }
        getPlayerVersion() {
          return this.v;
        }
        getPpid() {
          return this.p;
        }
        isCookiesEnabled() {
          return this.c;
        }
        setAutoPlayAdBreaks() {}
        setCompanionBackfill() {}
        setCookiesEnabled(c) {
          this.c = !!c;
        }
        setDisableCustomPlaybackForIOS10Plus(i) {
          this.i = !!i;
        }
        setFeatureFlags(f) {
          this.f = f;
        }
        setLocale(l) {
          this.l = l;
        }
        setNumRedirects(r) {
          this.r = r;
        }
        setPlayerType(t) {
          this.t = t;
        }
        setPlayerVersion(v) {
          this.v = v;
        }
        setPpid(p) {
          this.p = p;
        }
        setSessionId(/*s*/) {}
        setVpaidAllowed(/*a*/) {}
        setVpaidMode(/*m*/) {}
      }
      ImaSdkSettings.CompanionBackfillMode = {
        ALWAYS: 'always',
        ON_MASTER_AD: 'on_master_ad',
      };
      ImaSdkSettings.VpaidMode = {
        DISABLED: 0,
        ENABLED: 1,
        INSECURE: 2,
      };

      class EventHandler {
        constructor() {
          this.listeners = new Map();
        }

        _dispatch(e) {
          const listeners = this.listeners.get(e.type) || [];
          for (const listener of Array.from(listeners)) {
            try {
              listener(e);
            } catch (r) {
              console.error(r);
            }
          }
        }

        addEventListener(t, c) {
          if (!this.listeners.has(t)) {
            this.listeners.set(t, new Set());
          }
          this.listeners.get(t).add(c);
        }

        removeEventListener(t, c) {
          const typeSet = this.listeners.get(t);
          if (!typeSet) {
            return;
          }
          typeSet.delete(c);
        }
      }

      class AdsLoader extends EventHandler {
        constructor() {
          super();
          this.settings = new ImaSdkSettings();
        }
        contentComplete() {}
        destroy() {}
        getSettings() {
          return this.settings;
        }
        getVersion() {
          return VERSION;
        }
        requestAds(/*r, c*/) {
          // If autoplay is disabled and the page is trying to autoplay a tracking
          // ad, then IMA fails with an error, and the page is expected to request
          // ads again later when the user clicks to play.
          CheckCanAutoplay().then(
            () => {
              const { ADS_MANAGER_LOADED } = AdsManagerLoadedEvent.Type;
              this._dispatch(new ima.AdsManagerLoadedEvent(ADS_MANAGER_LOADED));
            },
            () => {
              const e = new ima.AdError('adPlayError', 1205, 1205, 'The browser prevented playback initiated without user interaction.');
              this._dispatch(new ima.AdErrorEvent(e));
            }
          );
        }
      }

      class AdsManager extends EventHandler {
        constructor() {
          super();
          this.volume = 1;
        }
        collapse() {}
        configureAdsManager() {}
        destroy() {}
        discardAdBreak() {}
        expand() {}
        focus() {}
        getAdSkippableState() {
          return false;
        }
        getCuePoints() {
          return [0];
        }
        getCurrentAd() {
          return currentAd;
        }
        getCurrentAdCuePoints() {
          return [];
        }
        getRemainingTime() {
          return 0;
        }
        getVolume() {
          return this.volume;
        }
        init(/*w, h, m, e*/) {}
        isCustomClickTrackingUsed() {
          return false;
        }
        isCustomPlaybackUsed() {
          return false;
        }
        pause() {}
        requestNextAdBreak() {}
        resize(/*w, h, m*/) {}
        resume() {}
        setVolume(v) {
          this.volume = v;
        }
        skip() {}
        start() {
          requestAnimationFrame(() => {
            for (const type of [
              AdEvent.Type.LOADED,
              AdEvent.Type.STARTED,
              AdEvent.Type.CONTENT_RESUME_REQUESTED,
              AdEvent.Type.AD_BUFFERING,
              AdEvent.Type.FIRST_QUARTILE,
              AdEvent.Type.MIDPOINT,
              AdEvent.Type.THIRD_QUARTILE,
              AdEvent.Type.COMPLETE,
              AdEvent.Type.ALL_ADS_COMPLETED,
            ]) {
              try {
                this._dispatch(new ima.AdEvent(type));
              } catch (e) {
                console.error(e);
              }
            }
          });
        }
        stop() {}
        updateAdsRenderingSettings(/*s*/) {}
      }

      class AdsRenderingSettings {}

      class AdsRequest {
        setAdWillAutoPlay() {}
        setAdWillPlayMuted() {}
        setContinuousPlayback() {}
      }

      class AdPodInfo {
        getAdPosition() {
          return 1;
        }
        getIsBumper() {
          return false;
        }
        getMaxDuration() {
          return -1;
        }
        getPodIndex() {
          return 1;
        }
        getTimeOffset() {
          return 0;
        }
        getTotalAds() {
          return 1;
        }
      }

      class Ad {
        constructor() {
          this._pi = new AdPodInfo();
        }
        getAdId() {
          return '';
        }
        getAdPodInfo() {
          return this._pi;
        }
        getAdSystem() {
          return '';
        }
        getAdvertiserName() {
          return '';
        }
        getApiFramework() {
          return null;
        }
        getCompanionAds() {
          return [];
        }
        getContentType() {
          return '';
        }
        getCreativeAdId() {
          return '';
        }
        getCreativeId() {
          return '';
        }
        getDealId() {
          return '';
        }
        getDescription() {
          return '';
        }
        getDuration() {
          return 8.5;
        }
        getHeight() {
          return 0;
        }
        getMediaUrl() {
          return null;
        }
        getMinSuggestedDuration() {
          return -2;
        }
        getSkipTimeOffset() {
          return -1;
        }
        getSurveyUrl() {
          return null;
        }
        getTitle() {
          return '';
        }
        getTraffickingParameters() {
          return {};
        }
        getTraffickingParametersString() {
          return '';
        }
        getUiElements() {
          return [''];
        }
        getUniversalAdIdRegistry() {
          return 'unknown';
        }
        getUniversalAdIds() {
          return [''];
        }
        getUniversalAdIdValue() {
          return 'unknown';
        }
        getVastMediaBitrate() {
          return 0;
        }
        getVastMediaHeight() {
          return 0;
        }
        getVastMediaWidth() {
          return 0;
        }
        getWidth() {
          return 0;
        }
        getWrapperAdIds() {
          return [''];
        }
        getWrapperAdSystems() {
          return [''];
        }
        getWrapperCreativeIds() {
          return [''];
        }
        isLinear() {
          return true;
        }
        isSkippable() {
          return true;
        }
      }

      class CompanionAd {
        getAdSlotId() {
          return '';
        }
        getContent() {
          return '';
        }
        getContentType() {
          return '';
        }
        getHeight() {
          return 1;
        }
        getWidth() {
          return 1;
        }
      }

      class AdError {
        constructor(type, code, vast, message) {
          this.errorCode = code;
          this.message = message;
          this.type = type;
          this.vastErrorCode = vast;
        }
        getErrorCode() {
          return this.errorCode;
        }
        getInnerError() {}
        getMessage() {
          return this.message;
        }
        getType() {
          return this.type;
        }
        getVastErrorCode() {
          return this.vastErrorCode;
        }
        toString() {
          return `AdError ${this.errorCode}: ${this.message}`;
        }
      }
      AdError.ErrorCode = {};
      AdError.Type = {};

      const isEngadget = () => {
        try {
          for (const ctx of Object.values(window.vidible._getContexts())) {
            const player = ctx.getPlayer();
            if (!player) {
              continue;
            }
            const div = player.div;
            if (!div) {
              continue;
            }
            if (div.innerHTML.includes('www.engadget.com')) {
              return true;
            }
          }
        } catch (_) {}
        return false;
      };

      const currentAd = isEngadget() ? undefined : new Ad();

      class AdEvent {
        constructor(type) {
          this.type = type;
        }
        getAd() {
          return currentAd;
        }
        getAdData() {
          return {};
        }
      }
      AdEvent.Type = {
        AD_BREAK_READY: 'adBreakReady',
        AD_BUFFERING: 'adBuffering',
        AD_CAN_PLAY: 'adCanPlay',
        AD_METADATA: 'adMetadata',
        AD_PROGRESS: 'adProgress',
        ALL_ADS_COMPLETED: 'allAdsCompleted',
        CLICK: 'click',
        COMPLETE: 'complete',
        CONTENT_PAUSE_REQUESTED: 'contentPauseRequested',
        CONTENT_RESUME_REQUESTED: 'contentResumeRequested',
        DURATION_CHANGE: 'durationChange',
        EXPANDED_CHANGED: 'expandedChanged',
        FIRST_QUARTILE: 'firstQuartile',
        IMPRESSION: 'impression',
        INTERACTION: 'interaction',
        LINEAR_CHANGE: 'linearChange',
        LINEAR_CHANGED: 'linearChanged',
        LOADED: 'loaded',
        LOG: 'log',
        MIDPOINT: 'midpoint',
        PAUSED: 'pause',
        RESUMED: 'resume',
        SKIPPABLE_STATE_CHANGED: 'skippableStateChanged',
        SKIPPED: 'skip',
        STARTED: 'start',
        THIRD_QUARTILE: 'thirdQuartile',
        USER_CLOSE: 'userClose',
        VIDEO_CLICKED: 'videoClicked',
        VIDEO_ICON_CLICKED: 'videoIconClicked',
        VIEWABLE_IMPRESSION: 'viewable_impression',
        VOLUME_CHANGED: 'volumeChange',
        VOLUME_MUTED: 'mute',
      };

      class AdErrorEvent {
        constructor(error) {
          this.type = 'adError';
          this.error = error;
        }
        getError() {
          return this.error;
        }
        getUserRequestContext() {
          return {};
        }
      }
      AdErrorEvent.Type = {
        AD_ERROR: 'adError',
      };

      const manager = new AdsManager();

      class AdsManagerLoadedEvent {
        constructor(type) {
          this.type = type;
        }
        getAdsManager() {
          return manager;
        }
        getUserRequestContext() {
          return {};
        }
      }
      AdsManagerLoadedEvent.Type = {
        ADS_MANAGER_LOADED: 'adsManagerLoaded',
      };

      class CustomContentLoadedEvent {}
      CustomContentLoadedEvent.Type = {
        CUSTOM_CONTENT_LOADED: 'deprecated-event',
      };

      class CompanionAdSelectionSettings {}
      CompanionAdSelectionSettings.CreativeType = {
        ALL: 'All',
        FLASH: 'Flash',
        IMAGE: 'Image',
      };
      CompanionAdSelectionSettings.ResourceType = {
        ALL: 'All',
        HTML: 'Html',
        IFRAME: 'IFrame',
        STATIC: 'Static',
      };
      CompanionAdSelectionSettings.SizeCriteria = {
        IGNORE: 'IgnoreSize',
        SELECT_EXACT_MATCH: 'SelectExactMatch',
        SELECT_NEAR_MATCH: 'SelectNearMatch',
      };

      class AdCuePoints {
        getCuePoints() {
          return [];
        }
      }

      class AdProgressData {}

      class UniversalAdIdInfo {
        getAdIdRegistry() {
          return '';
        }
        getAdIsValue() {
          return '';
        }
      }

      Object.assign(ima, {
        AdCuePoints,
        AdDisplayContainer,
        AdError,
        AdErrorEvent,
        AdEvent,
        AdPodInfo,
        AdProgressData,
        AdsLoader,
        AdsManager: manager,
        AdsManagerLoadedEvent,
        AdsRenderingSettings,
        AdsRequest,
        CompanionAd,
        CompanionAdSelectionSettings,
        CustomContentLoadedEvent,
        gptProxyInstance: {},
        ImaSdkSettings,
        OmidAccessMode: {
          DOMAIN: 'domain',
          FULL: 'full',
          LIMITED: 'limited',
        },
        settings: new ImaSdkSettings(),
        UiElements: {
          AD_ATTRIBUTION: 'adAttribution',
          COUNTDOWN: 'countdown',
        },
        UniversalAdIdInfo,
        VERSION,
        ViewMode: {
          FULLSCREEN: 'fullscreen',
          NORMAL: 'normal',
        },
      });

      if (!window.google) {
        window.google = {};
      }

      window.google.ima = ima;
    }
  });
};
