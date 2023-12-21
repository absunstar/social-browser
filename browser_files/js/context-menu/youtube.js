  if (SOCIALBROWSER.var.core.javaScriptOFF || !document.location.host.like('*youtube.com*')) {
    return;
  }

  SOCIALBROWSER.log(' [ Youtube Activated ... ] ');

  SOCIALBROWSER.youtubeMaster = {
    currentURL: document.location.href,
    allowChangeQualtiy: true,
    player: null,
    settingSelector: '.ytp-button.ytp-settings-button',
    qualitySelector: '.ytp-panel .ytp-menuitem',
    qualityText: '*Quality*|*جود*',
    qualityButtonsSelector: '.ytp-panel.ytp-quality-menu .ytp-menuitem',
    skip_buttons: '.ytp-ad-skip-button,.ytp-ad-overlay-close-container',
    adSelectors: 'ytd-promoted-sparkles-web-renderer,#player-ads,.video-ads,.video-masthead-iframe,#masthead-ad,.ytd-video-masthead-ad-v3-renderer',
    adsProgressSelector: '.ad-interrupting .ytp-play-progress.ytp-swatch-background-color',
    videosSelector: 'YTD-GRID-VIDEO-RENDERER,YTD-RICH-ITEM-RENDERER,YTD-VIDEO-RENDERER,YTD-COMPACT-VIDEO-RENDERER,YTD-PLAYLIST-RENDERER',
    locationchanged: function () {
      SOCIALBROWSER.youtubeMaster.allowChangeQualtiy = true;
      window.dispatchEvent(new Event('location-changed'));
      if (SOCIALBROWSER.var.blocking.youtube.allow_safty_mode) {
        SOCIALBROWSER.youtubeMaster.unsafeVideosCheck();
      }
      if (!SOCIALBROWSER.isIframe() && (titleEl = window.document.querySelector('title'))) {
        SOCIALBROWSER.currentWindow.setTitle(titleEl.innerText);
      }
    },
    videoStatusChanged: function (state) {
      if (state == 1) {
        SOCIALBROWSER.videoStatus = 'play';
      } else if (state == 2) {
        SOCIALBROWSER.videoStatus = 'pause';
      } else {
        SOCIALBROWSER.videoStatus = 'videoStatus : ' + state;
      }
      window.dispatchEvent(new Event('video-status-changed'));
    },
    videoQualityChanged: function (state) {
      SOCIALBROWSER.videoQualtiy = state;
      window.dispatchEvent(new Event('video-quality-changed'));
    },
    locationchangeTracking: function () {
      setInterval(() => {
        if (SOCIALBROWSER.youtubeMaster.currentURL != document.location.href) {
          SOCIALBROWSER.youtubeMaster.currentURL = document.location.href;
          SOCIALBROWSER.youtubeMaster.locationchanged();
        }
      }, 1000);
    },
    getPlayer: function () {
      if (SOCIALBROWSER.youtubeMaster.player) {
        return SOCIALBROWSER.youtubeMaster.player;
      }

      SOCIALBROWSER.youtubeMaster.player =
        document.querySelector('#movie_player') ||
        document.querySelector('#movie_player-flash') ||
        document.querySelector('#movie_player-html5') ||
        document.querySelector('#movie_player-html5-flash');

      if (SOCIALBROWSER.youtubeMaster.player) {
        SOCIALBROWSER.youtubeMaster.player.addEventListener('onStateChange', (state) => {
          SOCIALBROWSER.youtubeMaster.videoStatusChanged(state);
        });
        SOCIALBROWSER.youtubeMaster.player.addEventListener('onPlaybackQualityChange', (state) => {
          SOCIALBROWSER.youtubeMaster.videoQualityChanged(state);
        });
      }
      return SOCIALBROWSER.youtubeMaster.player;
    },
    resetQuality: function () {
      SOCIALBROWSER.log(' resetQuality : ' + document.location.href);
      if (
        SOCIALBROWSER.youtubeMaster.allowChangeQualtiy &&
        SOCIALBROWSER.var.blocking.youtube.quality &&
        SOCIALBROWSER.var.blocking.youtube.quality.value &&
        SOCIALBROWSER.youtubeMaster.player.getPlaybackQuality() != SOCIALBROWSER.var.blocking.youtube.quality.name
      ) {
        if (SOCIALBROWSER.click(SOCIALBROWSER.youtubeMaster.settingSelector, false)) {
          let subSettingButtons = document.querySelectorAll(SOCIALBROWSER.youtubeMaster.qualitySelector);
          subSettingButtons.forEach((subSettingButton, i) => {
            if (subSettingButton.innerText.like(SOCIALBROWSER.youtubeMaster.qualityText)) {
              if (SOCIALBROWSER.click(subSettingButton, false)) {
                document.querySelectorAll(SOCIALBROWSER.youtubeMaster.qualityButtonsSelector).forEach((qualityButton) => {
                  if (qualityButton.innerText.like(`*${SOCIALBROWSER.var.blocking.youtube.quality.value}*`)) {
                    SOCIALBROWSER.click(qualityButton, false);
                    SOCIALBROWSER.youtubeMaster.allowChangeQualtiy = false;
                  }
                });
                SOCIALBROWSER.click(subSettingButton, false);
              }
            }
            if (SOCIALBROWSER.youtubeMaster.allowChangeQualtiy && i === subSettingButtons.length - 1) {
              if (SOCIALBROWSER.click(subSettingButton, false)) {
                document.querySelectorAll(SOCIALBROWSER.youtubeMaster.qualityButtonsSelector).forEach((qualityButton) => {
                  if (qualityButton.innerText.like(`*${SOCIALBROWSER.var.blocking.youtube.quality.value}*`)) {
                    SOCIALBROWSER.click(qualityButton, false);
                    SOCIALBROWSER.youtubeMaster.allowChangeQualtiy = false;
                  }
                });
                SOCIALBROWSER.click(subSettingButton, false);
              }
            }
          });
        } else {
          SOCIALBROWSER.click('.icon-button.player-settings-icon', false);
        }
      }
    },
    blockPlayer: function () {
      SOCIALBROWSER.ipc('[send-render-message]', { name: 'mute-audio', windowID: SOCIALBROWSER.currentWindow.id });
      if ((v = SOCIALBROWSER.youtubeMaster.player.querySelector('video'))) {
        if (v && v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
          v.pause();
          v.classList.add('__block_eye');
          alert('<b> Stop Playing Youtube Video [ Unsafe Video ] </b>  <small><i> Changing Form Setting </i></small>', 1000 * 5);
        }
      }
    },
    skipAds: function () {
      if (SOCIALBROWSER.var.blocking.youtube.skip_ads && !SOCIALBROWSER.customSetting.allowAds) {
        document.querySelectorAll(SOCIALBROWSER.youtubeMaster.adSelectors).forEach((node) => {
          node.remove();
        });

        if (document.querySelector(SOCIALBROWSER.youtubeMaster.adsProgressSelector)) {
          if ((v = SOCIALBROWSER.youtubeMaster.player.querySelector('video'))) {
            if (v && !v.ended && v.readyState > 2) {
              setTimeout(() => {
                document.querySelectorAll(SOCIALBROWSER.youtubeMaster.skip_buttons).forEach((b) => {
                  b.click();
                });
              }, 500);
              try {
                v.currentTime = parseFloat(v.duration);
                alert('<b> Skiping Youtube Ad </b>  <small><i> Changing Form Setting </i></small>', 3000);
              } catch {}
            }
          }
        }
      }
      setTimeout(() => {
        SOCIALBROWSER.youtubeMaster.skipAds();
      }, 1000 * 2);
    },
    unsafeVideosCheck: function () {
      if (!SOCIALBROWSER.var.blocking.youtube.allow_safty_mode || !document.location.href.like('*watch*|*embed*')) {
        return;
      }

      SOCIALBROWSER.log('SOCIALBROWSER.youtubeMaster.unsafeVideosCheck');

      document.querySelectorAll('video').forEach((v) => {
        if (v && v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
          v.classList.remove('__block_eye');
        }
      });

      SOCIALBROWSER.var.blocking.youtube.safty_mode.words_list = SOCIALBROWSER.var.blocking.youtube.safty_mode.words_list || [];
      SOCIALBROWSER.var.blocking.youtube.safty_mode.selector_list = SOCIALBROWSER.var.blocking.youtube.safty_mode.selector_list || [];

      SOCIALBROWSER.var.blocking.youtube.safty_mode.selector_list.forEach((s) => {
        if (document.querySelectorAll(s).length > 0) {
          SOCIALBROWSER.youtubeMaster.blockPlayer();
        }
      });
      if (document.querySelector('a[href="http://www.youtube.com/t/community_guidelines"]')) {
        SOCIALBROWSER.youtubeMaster.blockPlayer();
      }

      let txt = '';
      txt += document.querySelector('title') ? document.querySelector('title').innerText : '';
      // txt += document.querySelector('#content') ? document.querySelector('#content').innerText : ''
      txt += document.querySelector('ytd-video-secondary-info-renderer') ? document.querySelector('ytd-video-secondary-info-renderer').innerText : '';

      if (txt) {
        SOCIALBROWSER.var.blocking.youtube.safty_mode.words_list.forEach((w) => {
          if (txt.toLowerCase().like(w.text)) {
            SOCIALBROWSER.youtubeMaster.blockPlayer();
          }
        });
        SOCIALBROWSER.translate(txt, (info) => {
          SOCIALBROWSER.var.blocking.youtube.safty_mode.words_list.forEach((w) => {
            if (info.translatedText.toLowerCase().like(w.text)) {
              SOCIALBROWSER.youtubeMaster.blockPlayer();
            }
          });
        });
      }
      document.querySelectorAll(SOCIALBROWSER.youtubeMaster.videosSelector).forEach((node) => {
        SOCIALBROWSER.youtubeMaster.removeUnsafeElement(node);
      });
    },
    removeUnsafeElement: function (el) {
      let done = false;
      let txt = el.innerText.replace(/\r|\n|\t|\s+/gi, ' ');
      if (txt) {
        SOCIALBROWSER.var.blocking.youtube.safty_mode.words_list.forEach((w) => {
          if (done) {
            return;
          }
          if (txt.like(w.text)) {
            done = true;
            el.remove();
          }
        });
      }
    },
    block_links: function (el) {
      el.removeAttribute('href');
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        alert(`Blocked video [ Children safty mode]`);
      });

      el.querySelectorAll('a,img').forEach((a) => {
        a.removeAttribute('href');
        if (a.tagName == 'IMG') {
          a.classList.add('__block_eye');
        }
        if (a.id.contains('overlay')) {
          a.remove();
          return;
        }
        a.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          alert(`Blocked video [ Children safty mode]`);
        });
      });
    },
  };

  SOCIALBROWSER.onLoad(() => {
    SOCIALBROWSER.youtubeMaster.locationchanged();
    SOCIALBROWSER.youtubeMaster.locationchangeTracking();
    SOCIALBROWSER.youtubeMaster.skipAds();
  });

  window.addEventListener('location-changed', () => {
    if (SOCIALBROWSER.youtubeMaster.getPlayer()) {
      SOCIALBROWSER.youtubeMaster.player.classList.remove('__block_eye');
    } else {
      setTimeout(() => {
        SOCIALBROWSER.youtubeMaster.locationchanged();
      }, 1000);
    }
  });
  window.addEventListener('video-status-changed', () => {
    SOCIALBROWSER.youtubeMaster.resetQuality();
  });

