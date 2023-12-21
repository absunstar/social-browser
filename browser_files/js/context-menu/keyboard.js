  let mousemove = null;

  window.addEventListener('mousemove', (e) => {
    mousemove = e;
  });

  if (SOCIALBROWSER.customSetting.windowType === 'main') {
    return;
  }

  function sendToMain(obj) {
    SOCIALBROWSER.ipc('[send-render-message]', obj);
  }

  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey == true) {
      sendToMain({
        name: '[window-zoom' + (e.deltaY > 0 ? '-' : '+') + ']',
        windowID: SOCIALBROWSER.currentWindow.id,
      });
    }
  });

  window.addEventListener(
    'keydown',
    (e) => {
      //e.preventDefault();
      //e.stopPropagation();
      if (e.key == 'F12' /*f12*/ && SOCIALBROWSER.customSetting.allowDevTools && SOCIALBROWSER.customSetting.allowMenu) {
        SOCIALBROWSER.ipc('[show-window-dev-tools]' ,{
          windowID: SOCIALBROWSER.currentWindow.id,
        });
      } else if (e.key == 'F11' /*f11*/ && SOCIALBROWSER.customSetting.allowDevTools && SOCIALBROWSER.customSetting.allowMenu) {
        sendToMain({
          name: '[toggle-fullscreen]',
          windowID: SOCIALBROWSER.currentWindow.id,
        });
      } else if (e.keyCode == 121 /*f10*/ && SOCIALBROWSER.customSetting.allowDevTools && SOCIALBROWSER.customSetting.allowMenu) {
        sendToMain({
          name: 'service worker',
        });
      } else if (e.keyCode == 117 /*f6*/) {
        SOCIALBROWSER.ipc('[show-addressbar]');
      } else if (e.keyCode == 70 /*f*/) {
        if (e.ctrlKey == true) {
          window.showFind(true);
        }
      } else if (e.keyCode == 115 /*f4*/) {
        if (e.ctrlKey == true) {
          sendToMain({
            name: 'close tab',
          });
        }
      } else if (e.keyCode == 107 /*+*/) {
        if (e.ctrlKey == true) {
          sendToMain({
            name: '[window-zoom+]',
            windowID: SOCIALBROWSER.currentWindow.id,
          });
        }
      } else if (e.keyCode == 109 /*-*/) {
        if (e.ctrlKey == true) {
          sendToMain({
            name: '[window-zoom-]',
            windowID: SOCIALBROWSER.currentWindow.id,
          });
        }
      } else if (e.keyCode == 48 /*0*/) {
        if (e.ctrlKey == true) {
          sendToMain({
            name: '[window-zoom]',
            windowID: SOCIALBROWSER.currentWindow.id,
          });
        }
      } else if (e.keyCode == 49 /*1*/) {
        if (e.ctrlKey == true) {
          ipc('[toggle-window-audio]');
        }
      } else if (e.keyCode == 74 /*j*/) {
        if (e.ctrlKey == true) {
          sendToMain({
            name: 'downloads',
          });
        }
      } else if (e.keyCode == 83 /*s*/) {
        if (e.ctrlKey == true) {
          sendToMain({
            name: '[download-link]',
            url: window.location.href,
          });
        }
      } else if (e.keyCode == 80 /*p*/) {
        if (e.ctrlKey == true) {
          window.print();
        }
      } else if (e.keyCode == 46 /*delete*/) {
        if (e.ctrlKey == true && mousemove) {
          let node = mousemove.target;
          if (node) {
            node.remove();
          }
        }
      } else if (e.keyCode == 27 /*escape*/) {
        sendToMain({
          name: 'escape',
        });
      } else if (e.keyCode == 69 && e.ctrlKey == true /*E*/) {
        SOCIALBROWSER.ipc('[edit-window]', { windowID: SOCIALBROWSER.currentWindow.id });
      } else if (e.keyCode == 78 /*n*/ || e.keyCode == 84 /*n*/) {
        if (e.ctrlKey == true) {
          SOCIALBROWSER.ipc('[open new tab]', {
            windowID: SOCIALBROWSER.currentWindow.id,
          });
        }
      } else if (e.keyCode == 116 /*f5*/) {
        if (e.ctrlKey === true) {
          sendToMain({
            name: '[window-reload-hard]',
            origin: document.location.origin || document.location.href,
          });
        } else {
          sendToMain({
            name: '[window-reload]',
          });
        }
      }

      return false;
    },
    true
  );

