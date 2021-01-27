module.exports = function (SOCIALBROWSER) {
  if (!SOCIALBROWSER.var.blocking.social.allow_youlikehits) {
    return;
  }

  if (!document.location.href.contains('youlikehits.com')) {
    return;
  }
  SOCIALBROWSER.var.blocking.social = SOCIALBROWSER.var.blocking.social || {};
  if (!SOCIALBROWSER.var.blocking.social.allow_youlikehits) {
    return;
  }

  SOCIALBROWSER.log(' >>> youlikehits Activated');

  SOCIALBROWSER.var.blocking.block_empty_iframe = false;

  if (document.location.href.contains('youtubenew2|soundcloud_views|youtubelikes')) {
    SOCIALBROWSER.var.user_data_block = true;

    window.open = function (url, _name, _specs, _replace_in_history) {
      SOCIALBROWSER.log('youlikehits : ', url);

      let opener = {
        closed: false,
        opener: window,
        postMessage: () => {
          SOCIALBROWSER.log('postMessage opener');
        },
        eval: () => {
          SOCIALBROWSER.log('eval opener');
        },
        close: () => {
          SOCIALBROWSER.log('close opener');
        },
        focus: () => {
          SOCIALBROWSER.log('focus opener');
        },
      };

      if (typeof url !== 'string') {
        return opener;
      }
      if (url == 'about:blank') {
        return opener;
      }
      url = SOCIALBROWSER.handle_url(url);

      SOCIALBROWSER.log('youlikehits : ', url);

      let win = new SOCIALBROWSER.electron.remote.BrowserWindow({
        show: false,
        alwaysOnTop: true,
        width: _specs.width || 800,
        height: _specs.height || 600,
        x: _specs.x || 200,
        y: _specs.y || 200,
        backgroundColor: '#ffffff',
        frame: true,
        webPreferences: {
          contextIsolation: false,
          webaudio: false,
          nativeWindowOpen: false,
          nodeIntegration: false,
          nodeIntegrationInWorker: false,
          session: SOCIALBROWSER.electron.remote.getCurrentWebContents().session,
          sandbox: false,
          preload: SOCIALBROWSER.files_dir + '/js/context-menu.js',
          webSecurity: false,
          allowRunningInsecureContent: true,
          plugins: false,
        },
      });

      win.setMenuBarVisibility(false);
      win.webContents.audioMuted = true;

      win.loadURL(url, {
        referrer: document.location.href,
        user_agent: navigator.userAgent,
      });

      win.once('ready-to-show', () => {
        // win.showInactive()
      });

      opener.postMessage = function (message, targetOrigin) {
        return win.webContents.postMessage(message, targetOrigin);
      };
      win.webContents.once('dom-ready', () => {
        if (document.location.href.contains('youtubelikes')) {
          win.webContents.executeJavaScript(`
                    document.querySelectorAll('video').forEach(v=> v.remove());
                    function like_video(){
                        let btn =  document.querySelectorAll('ytd-toggle-button-renderer.style-scope.ytd-menu-renderer.force-icon-button.style-text')[0]
                        SOCIALBROWSER.log(btn);
                        if(btn){
                            btn.click()
                            setTimeout(() => {
                             btn.click()
                         }, 1000 * 10);
                        }else{
                            setTimeout(() => {
                                like_video()
                            }, 1000);
                        }
                    }
                    like_video()
                    `);
          setTimeout(() => {
            opener.closed = true;
          }, 1000 * 10);
          setTimeout(() => {
            alert('youlikehits : opner closed done');
            win.close();
          }, 1000 * 40);
        } else {
          setTimeout(() => {
            win.close();
          }, 1000 * 6);
        }
      });

      opener.close = function () {
        opener.closed = true;
        if (win && !win.isDestroyed()) {
          win.close();
        }
      };
      // opener.document
      win.on('close', (e) => {
        opener.postMessage = () => {};
        opener.eval = () => {};
        // opener.closed = true
      });

      return opener;
    };

    let captca_count = 0;

    setInterval(() => {
      window.counting = function (videoid, randtime, x) {
        SOCIALBROWSER.log('counting');
        if (newWin.closed) {
          clearInterval(settimer);
          // cnum = 0;
          ctrig = 'closed';
        } else {
          cnum = cnum + 1;
          if (document.getElementById('count' + videoid)) {
            document.getElementById('count' + videoid).style.display = 'inline';
          }
        }
        if (cnum >= randtime) {
          window.cnum = -1;
          newWin.close();
          setTimeout(() => {
            $.ajax({
              type: 'GET',
              url: 'playyoutubenew.php',
              data: 'id=' + videoid + '&step=points&x=' + x + '&rand=' + Math.random(),
              success: function (msg) {
                // window.cnum = -1
                $('#showresult').html(msg);
                // window.cnum = 0
                document.location.reload();
              },
            });
          }, 1000 * 5);
        }

        document.title = `count ${cnum} / ${randtime}`;

        if (document.getElementById('count' + videoid + 'num')) {
          document.getElementById('count' + videoid + 'num').innerHTML = cnum;
        }
      };

      if (document.querySelector('#captcha')) {
        document.title = 'captcha';
      } else if (window.cnum === 0) {
        let btn = document.querySelector('a.followbutton');
        if (btn) {
          btn.click();
          btn.style.display = 'none';
        }
        // window.cnum = 100
      }
    }, 5000);
  }

  if (document.location.href.contains('websites')) {
    SOCIALBROWSER.var.user_data_block = true;
    setInterval(() => {
      document.querySelectorAll('iframe').forEach((f) => {
        if (f.id == 'preview-frame') {
          f.remove();
        }
      });
    }, 1000);
  }
};
