module.exports = function (SOCIALBROWSER) {
  if (SOCIALBROWSER.var.core.javaScriptOFF || !document.location.host.like('*youtube.com*')) {
    return;
  }

  SOCIALBROWSER.log(' >>> Youtube Activated ...');

  SOCIALBROWSER.onLoad(() => {
    SOCIALBROWSER.currentURL = document.location.href;
    window.dispatchEvent(new Event('locationchange'));
    setInterval(() => {
      if (SOCIALBROWSER.currentURL != document.location.href) {
        SOCIALBROWSER.currentURL = document.location.href;
        window.dispatchEvent(new Event('locationchange'));
      }
    }, 1000);
  });
  SOCIALBROWSER.allowChangeQualtiy = true;
  window.addEventListener('locationchange', () => {
    if (get_video_player()) {
      SOCIALBROWSER.video_player.classList.remove('__block_eye');
      SOCIALBROWSER.allowChangeQualtiy = true;
    } else {
      setTimeout(() => {
        window.dispatchEvent(new Event('locationchange'));
      }, 1000);
    }
  });
  window.addEventListener('play-changed', () => {
    console.log(SOCIALBROWSER.videoStatus);
    console.log(SOCIALBROWSER.video_player.getPlaybackQuality());
    if (
      SOCIALBROWSER.allowChangeQualtiy &&
      SOCIALBROWSER.var.blocking.youtube.allow_change_quality &&
      SOCIALBROWSER.video_player.getPlaybackQuality() != SOCIALBROWSER.var.blocking.youtube.quality.name
    ) {
      SOCIALBROWSER.setPlaybackQuality();
    }
  });
  window.addEventListener('quality-changed', () => {
    console.log(SOCIALBROWSER.videoQualtiy);
  });

  function get_video_player() {
    if (SOCIALBROWSER.video_player) {
      return SOCIALBROWSER.video_player;
    }

    SOCIALBROWSER.video_player =
      document.querySelector('#movie_player') || document.querySelector('#movie_player-flash') || document.querySelector('#movie_player-html5') || document.querySelector('#movie_player-html5-flash');

    if (SOCIALBROWSER.video_player && SOCIALBROWSER.video_player.getPlayerState) {
      SOCIALBROWSER.video_player.addEventListener('onStateChange', (state) => {
        if (state == 1) {
          SOCIALBROWSER.videoStatus = 'play';
        } else if (state == 2) {
          SOCIALBROWSER.videoStatus = 'pause';
        } else {
          SOCIALBROWSER.videoStatus = 'videoStatus : ' + state;
        }
        window.dispatchEvent(new Event('play-changed'));
      });
      SOCIALBROWSER.video_player.addEventListener('onPlaybackQualityChange', (state) => {
        SOCIALBROWSER.videoQualtiy = state;
        window.dispatchEvent(new Event('quality-changed'));
      });
    }
    if (SOCIALBROWSER.video_player) {
      skipYoutubeAds();
    }

    return null;
  }

  SOCIALBROWSER.setPlaybackQuality = function () {
    SOCIALBROWSER.log(' call setPlaybackQuality() : ' + document.location.href);

    let end = false;
    if (
      SOCIALBROWSER.var.blocking.youtube.quality &&
      SOCIALBROWSER.var.blocking.youtube.quality.value &&
      SOCIALBROWSER.video_player.getPlaybackQuality() != SOCIALBROWSER.var.blocking.youtube.quality.name
    ) {
      let setting_btn = document.querySelector('.ytp-button.ytp-settings-button');
      if (setting_btn) {
        setting_btn.click();
        let q_list = document.querySelectorAll('.ytp-panel .ytp-menuitem');
        q_list.forEach((q, i) => {
          if (q.innerText.like('*Quality*|*جود*')) {
            q.click();
            let qq = document.querySelectorAll('.ytp-panel.ytp-quality-menu .ytp-menuitem');
            if (qq && qq.length > 0) {
              end = true;
            }
            qq.forEach((q2) => {
              if (q2.innerText.like(`*${SOCIALBROWSER.var.blocking.youtube.quality.value}*`)) {
                q2.click();
              }
            });
            q.click();
          }
          if (!end && i === q_list.length - 1) {
            q.click();
            let qq = document.querySelectorAll('.ytp-panel.ytp-quality-menu .ytp-menuitem');
            if (qq && qq.length > 0) {
              end = true;
            }
            qq.forEach((q2) => {
              if (q2.innerText.like(`*${SOCIALBROWSER.var.blocking.youtube.quality.value}*`)) {
                q2.click();
              }
            });
            q.click();
          }
        });
      } else {
        let setting_btn = document.querySelector('.icon-button.player-settings-icon');
        if (setting_btn) {
          setting_btn.click();
        }
      }

      if (end) {
        SOCIALBROWSER.allowChangeQualtiy = false;
        return;
      }
    }
  };

  function pause_current_youtube_video() {
    SOCIALBROWSER.call('[send-render-message]', { name: 'mute-audio', win_id: SOCIALBROWSER.currentWindow.id });
    document.querySelectorAll('video').forEach((v) => {
      if (v && v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
        v.pause();
        v.classList.add('__block_eye');
        alert('<b> Stop Playing Youtube Video [ Unsafe Video ] </b>  <small><i> Changing Form Setting </i></small>', 1000 * 5);
      }
    });
  }

  function check_if_current_video_un_safe() {
    if (!SOCIALBROWSER.var.blocking.youtube.allow_safty_mode || !document.location.href.like('*watch*|*embed*')) {
      return;
    }

    SOCIALBROWSER.log('check_if_current_video_un_safe');

    document.querySelectorAll('video').forEach((v) => {
      if (v && v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
        v.classList.remove('__block_eye');
      }
    });

    SOCIALBROWSER.var.blocking.youtube.safty_mode.words_list = SOCIALBROWSER.var.blocking.youtube.safty_mode.words_list || [];
    SOCIALBROWSER.var.blocking.youtube.safty_mode.selector_list = SOCIALBROWSER.var.blocking.youtube.safty_mode.selector_list || [];

    SOCIALBROWSER.var.blocking.youtube.safty_mode.selector_list.forEach((s) => {
      if (document.querySelectorAll(s).length > 0) {
        pause_current_youtube_video();
      }
    });
    if (document.querySelector('a[href="http://www.youtube.com/t/community_guidelines"]')) {
      pause_current_youtube_video();
    }

    let txt = '';
    txt += document.querySelector('title') ? document.querySelector('title').innerText : '';
    // txt += document.querySelector('#content') ? document.querySelector('#content').innerText : ''
    txt += document.querySelector('ytd-video-secondary-info-renderer') ? document.querySelector('ytd-video-secondary-info-renderer').innerText : '';

    if (txt) {
      SOCIALBROWSER.var.blocking.youtube.safty_mode.words_list.forEach((w) => {
        if (txt.toLowerCase().like(w.text)) {
          pause_current_youtube_video();
        }
      });
      SOCIALBROWSER.translate(txt, (txt2) => {
        SOCIALBROWSER.var.blocking.youtube.safty_mode.words_list.forEach((w) => {
          if (txt2.toLowerCase().like(w.text)) {
            pause_current_youtube_video();
          }
        });
      });
    }
  }

  function skipYoutubeAds() {
    if (SOCIALBROWSER.var.blocking.youtube.skip_ads) {
      let classes = '#masthead-ad,.ytd-video-masthead-ad-v3-renderer';//,#action-companion-click-target,.video-masthead-v2,#watch7-sidebar-ads,#masthead-ad,ytd-compact-promoted-video-renderer,ytd-action-companion-ad-renderer,ytd-popup-container,.ytp-popup.ytp-generic-popup';
      document.querySelectorAll(classes).forEach((node) => {
        node.remove();
      });

      // let a = document.querySelector('.video-ads');
      // if (a) {
      //   a.remove();
      // }

      // let a2 = document.querySelector('.video-masthead-iframe');
      // if (a2) {
      //   a2.remove();
      // }

      if (document.querySelector('.ad-interrupting .ytp-play-progress.ytp-swatch-background-color')) {
        let v = document.querySelector('video');
        if (v && !v.ended && v.readyState > 2) {
          alert('<b> Auto Skiping Ad </b>  <small><i> Changing Form Setting </i></small>', 5000);
          try {
            v.currentTime = parseFloat(v.duration);
          } catch {
            // SOCIALBROWSER.log(v)
          }
        }
      }
    }
    setTimeout(() => {
      skipYoutubeAds();
    }, 1000 * 3);
  }

  function block_links(el) {
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
  }

  function check_target(el) {
    SOCIALBROWSER.log('check_target');
    let done = false;
    let txt = el.innerText.replace(/\r|\n|\t|\s+/gi, ' ');
    if (txt) {
      SOCIALBROWSER.var.blocking.youtube.safty_mode.words_list.forEach((w) => {
        if (done) {
          return;
        }
        if (txt.like(w.text)) {
          SOCIALBROWSER.log(txt + ' like ' + w.text);
          done = true;
          el.remove();
        }
      });
    }
  }

  SOCIALBROWSER.onLoad(() => {
    if (SOCIALBROWSER.var.blocking.youtube.allow_safty_mode) {
      setInterval(() => {
        check_if_current_video_un_safe();
        document.querySelectorAll('YTD-GRID-VIDEO-RENDERER,YTD-RICH-ITEM-RENDERER,YTD-VIDEO-RENDERER,YTD-COMPACT-VIDEO-RENDERER,YTD-PLAYLIST-RENDERER').forEach((node) => {
          check_target(node);
        });
      }, 1000);
    }

    if (!SOCIALBROWSER.isIframe() && (titleEl = window.document.querySelector('title'))) {
      SOCIALBROWSER.currentWindow.setTitle(titleEl.innerText);
    }
  });
};
