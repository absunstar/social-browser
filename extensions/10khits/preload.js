module.exports = function (SOCIALBROWSER) {
  if (!document.location.hostname.contains('10khits.com')) {
    return;
  }

  SOCIALBROWSER.log(' >>> 10khits Activated');
  alert(' >>> 10khits Activated');

  let link = '';
  let count = 0;
  function fake_hit(link) {
    SOCIALBROWSER.__showBotImage();
    count++;
    alert(`Fake Hit number ${count}`);
    document.querySelector('title').innerText = 'Fake Hit  ' + count;
    if (link) {
      link = link.replace('surf::', '').replace('#___new_tab___', '');
      SOCIALBROWSER.log(link);
      let win = new SOCIALBROWSER.remote.BrowserWindow({
        show: false,
        width: 800,
        height: 300,
        webPreferences: {
          contextIsolation: false,
          enableRemoteModule: true,
          partition: SOCIALBROWSER.partition,
          webaudio: false,
          preload2: SOCIALBROWSER.files_dir + '/js/context-menu.js',
        },
      });

      win.setMenuBarVisibility(false);

      win.loadURL(link, {
        referrer: document.location.href,
        userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.76 Safari/537.36 10KHits-Exchanger/0.9.8',
      });

      win.once('ready-to-show', () => {
        // win.showInactive()
      });

      setTimeout(() => {
        if (win && !win.isDestroyed()) {
          win.close();
        }
        if (count == 10) {
          document.location.reload();
        } else {
          fake_hit(link);
        }
      }, 1000 * 20);
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    SOCIALBROWSER.__showBotImage();
    if (!document.location.href.contains('https://www.10khits.com/dashboard/surf/sessions')) {
      return;
    }

    let btn = document.querySelector('#surf_now');
    if (btn && btn.href) {
      link = btn.href;
      localStorage.setItem('link', link);
      btn.remove();
      fake_hit(link);
    } else {
      link = localStorage.getItem('link');
      fake_hit(link);
    }
  });
};
