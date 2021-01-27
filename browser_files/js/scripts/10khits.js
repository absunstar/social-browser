module.exports = function (SOCIALBROWSER) {

  if (!SOCIALBROWSER.var.blocking.social.allow_10khits) {
    return;
  }
  if (!document.location.href.contains('https://www.10khits.com/dashboard/surf/sessions')) {
    return;
  }
  SOCIALBROWSER.var.blocking.social = SOCIALBROWSER.var.blocking.social || {};
  if (!SOCIALBROWSER.var.blocking.social.allow_10khits) {
    return;
  }

  SOCIALBROWSER.log(' >>> 10khits Activated');
  alert(' >>> 10khits Activated');

  let link = '';
  let count = 0;
  function fake_hit(link) {
    window.__showLoadingImage();
    count++;
    alert(`Fake Hit number ${count}`);
    document.querySelector('title').innerText = 'Fake Hit  ' + count;
    if (link) {
      link = link.replace('surf::', '').replace('#___new_tab___', '');
      SOCIALBROWSER.log(link);
      let win = new SOCIALBROWSER.electron.remote.BrowserWindow({
        show: false,
        width: 800,
        height: 300,        
        webPreferences: {
          contextIsolation: false,
          enableRemoteModule: true,
          partition: SOCIALBROWSER.electron.remote.getCurrentWindow().webContents.session.name,
          webaudio: false,
          preload2: SOCIALBROWSER.files_dir + '/js/context-menu.js',
        },
      });

      win.setMenuBarVisibility(false);

      win.loadURL(link, {
        referrer: document.location.href,
        userAgent: navigator.userAgent,
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
    let btn = document.querySelector('#surf_now');
    if (btn && btn.href) {
      link = btn.href;
      localStorage.setItem('link', link);
      btn.remove();
      fake_hit(link);
    } else {
      link = localStorage.getItem('link');
      SOCIALBROWSER.log('from storage ...' + link);
      fake_hit(link);
    }
  });
};
