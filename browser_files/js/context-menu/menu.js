let full_screen = false;
SOCIALBROWSER.menuList = [];

// var change_event = document.createEvent("HTMLEvents");
// change_event.initEvent("change", false, true);

let changeEvent = new Event('change', {
  bubbles: true,
  cancelable: true,
});
let inputEvent = new Event('input', {
  bubbles: true,
  cancelable: true,
});
let enter_event = new KeyboardEvent('keydown', {
  altKey: false,
  bubbles: true,
  cancelBubble: false,
  cancelable: true,
  charCode: 0,
  code: 'Enter',
  composed: true,
  ctrlKey: false,
  currentTarget: null,
  defaultPrevented: true,
  detail: 0,
  eventPhase: 0,
  isComposing: false,
  isTrusted: true,
  key: 'Enter',
  keyCode: 13,
  location: 0,
  metaKey: false,
  repeat: false,
  returnValue: false,
  shiftKey: false,
  type: 'keydown',
  which: 13,
});

function sendToMain(obj) {
  SOCIALBROWSER.ipc('[send-render-message]', obj);
}

function isContentEditable(node) {
  if (node && node.contentEditable == 'true') {
    return true;
  }

  if (node.parentNode) {
    return isContentEditable(node.parentNode);
  }

  return false;
}

function add_input_menu(node) {
  if (!node || SOCIALBROWSER.menuInputOFF) {
    return;
  }

  if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || isContentEditable(node)) {
    if (SOCIALBROWSER.customSetting.windowType !== 'main') {
      let arr1 = [];
      let arr2 = [];
      SOCIALBROWSER.var.user_data_input.forEach((dd) => {
        if (!dd.data || !Array.isArray(dd.data) || dd.data.length == 0) {
          return;
        }
        dd.data.forEach((d) => {
          if (node.id && node.id == d.id) {
            if (!arr1.some((a) => a.label.trim() == d.value.trim())) {
              arr1.push({
                label: d.value,
                click() {
                  node.value = '';
                  node.innerHTML = '';
                  SOCIALBROWSER.electron.clipboard.writeText(d.value);
                  SOCIALBROWSER.webContents.paste();
                },
              });

              arr2.push({
                label: d.value,
                click() {
                  node.value = d.value;
                  node.innerHTML = d.value;
                  dd.data.forEach((d2) => {
                    if (d2.type == 'hidden' || d2.type == 'submit') {
                      return;
                    }
                    let e1 = null;
                    if (d2.id) {
                      e1 = document.getElementById(d2.id);
                    }
                    if (!e1 && d2.name) {
                      e1 = document.getElementsByName(d2.name);
                    }

                    if (e1) {
                      e1.value = d2.value;
                      e1.innerHTML = d2.value;
                      e1.dispatchEvent(inputEvent);
                      e1.dispatchEvent(changeEvent);
                    }
                  });
                },
              });
            }
          } else if (node.name && node.name == d.name) {
            let exists = false;
            arr1.forEach((a) => {
              if (a.label.trim() == d.value.trim()) {
                exists = true;
              }
            });
            if (!exists) {
              arr1.push({
                label: d.value,
                click() {
                  node.value = '';
                  node.innerHTML = '';
                  SOCIALBROWSER.electron.clipboard.writeText(d.value);
                  SOCIALBROWSER.webContents.paste();
                },
              });

              arr2.push({
                label: d.value,
                click() {
                  node.value = d.value;
                  node.innerHTML = d.value;
                  dd.data.forEach((d2) => {
                    if (d2.type == 'hidden' || d2.type == 'submit') {
                      return;
                    }
                    let e1 = null;
                    if (d2.id) {
                      e1 = document.getElementById(d2.id);
                    }
                    if (!e1 && d2.name) {
                      e1 = document.getElementsByName(d2.name);
                    }

                    if (e1) {
                      e1.value = d2.value;
                      e1.innerHTML = d2.value;
                      e1.dispatchEvent(inputEvent);
                      e1.dispatchEvent(changeEvent);
                    }
                  });
                },
              });
            }
          } else {
            let exists = false;
            arr1.forEach((a) => {
              if (a.label.trim() == d.value.trim()) {
                exists = true;
              }
            });
            if (!exists) {
              arr1.push({
                label: d.value,
                click() {
                  node.value = '';
                  node.innerHTML = '';
                  SOCIALBROWSER.electron.clipboard.writeText(d.value);
                  SOCIALBROWSER.webContents.paste();
                },
              });
            }
          }
        });
      });

      SOCIALBROWSER.var.user_data.forEach((dd) => {
        if (!dd.data) {
          return;
        }
        dd.data.forEach((d) => {
          if (arr1.some((a) => a.label.trim() == d.value.trim())) {
            return;
          }

          if (node.id && node.id == d.id) {
            arr1.push({
              label: d.value,
              click() {
                node.value = '';
                node.innerHTML = '';
                SOCIALBROWSER.electron.clipboard.writeText(d.value);
                SOCIALBROWSER.webContents.paste();
              },
            });

            arr2.push({
              label: d.value,
              click() {
                node.value = d.value;
                node.innerHTML = d.value;
                dd.data.forEach((d2) => {
                  if (d2.type == 'hidden' || d2.type == 'submit') {
                    return;
                  }
                  let e1 = null;
                  if (d2.id) {
                    e1 = document.getElementById(d2.id);
                  }
                  if (!e1 && d2.name) {
                    e1 = document.getElementsByName(d2.name);
                  }

                  if (e1) {
                    e1.value = d2.value;
                    e1.innerHTML = d2.value;
                    e1.dispatchEvent(inputEvent);
                    e1.dispatchEvent(changeEvent);
                  }
                });
              },
            });
          } else if (node.name && node.name == d.name) {
            arr1.push({
              label: d.value,
              click() {
                node.value = '';
                node.innerHTML = '';
                SOCIALBROWSER.electron.clipboard.writeText(d.value);
                SOCIALBROWSER.webContents.paste();
              },
            });

            arr2.push({
              label: d.value,
              click() {
                node.value = d.value;
                node.innerHTML = d.value;

                dd.data.forEach((d2) => {
                  if (d2.type == 'hidden' || d2.type == 'submit') {
                    return;
                  }
                  let e1 = null;
                  if (d2.id) {
                    e1 = document.getElementById(d2.id);
                  }
                  if (!e1 && d2.name) {
                    e1 = document.getElementsByName(d2.name);
                  }

                  if (e1) {
                    e1.value = d2.value;
                    e1.innerHTML = d2.value;
                    e1.dispatchEvent(inputEvent);
                    e1.dispatchEvent(changeEvent);
                  }
                });
              },
            });
          } else {
            arr1.push({
              label: d.value,
              click() {
                node.value = '';
                node.innerHTML = '';
                SOCIALBROWSER.electron.clipboard.writeText(d.value);
                SOCIALBROWSER.webContents.paste();
              },
            });
          }
        });
      });

      if (arr1.length > 0) {
        arr1.sort((a, b) => (a.label > b.label ? 1 : -1));

        SOCIALBROWSER.menuList.push({
          label: 'Fill',
          type: 'submenu',
          submenu: arr1,
        });
      }
      if (arr2.length > 0) {
        arr2.sort((a, b) => (a.label > b.label ? 1 : -1));
        SOCIALBROWSER.menuList.push({
          label: 'Auto Fill All',
          type: 'submenu',
          submenu: arr2,
        });
      }
    }

    if (node.nodeName === 'INPUT' && (node.getAttribute('type') || '').toLowerCase() == 'password' && node.value.length > 0) {
      SOCIALBROWSER.menuList.push({
        label: 'Show Password',
        click() {
          alert(node.value);
        },
      });
    }

    SOCIALBROWSER.menuList.push({
      label: 'Cut',

      click() {
        SOCIALBROWSER.currentWindow.webContents.cut();
      },
      enabled: SOCIALBROWSER.selectedText.length > 0,
    });

    SOCIALBROWSER.menuList.push({
      label: 'Copy',
      click() {
        SOCIALBROWSER.currentWindow.webContents.copy();
      },
      enabled: SOCIALBROWSER.selectedText.length > 0,
    });

    SOCIALBROWSER.menuList.push({
      label: 'Paste',
      click() {
        SOCIALBROWSER.currentWindow.webContents.paste();
      },
    });

    SOCIALBROWSER.menuList.push({
      label: 'Delete',
      click() {
        SOCIALBROWSER.currentWindow.webContents.delete();
      },
    });

    SOCIALBROWSER.menuList.push({
      label: 'Select All',
      click() {
        SOCIALBROWSER.currentWindow.webContents.selectall();
      },
    });

    SOCIALBROWSER.menuList.push({
      type: 'separator',
    });

    return;
  }

  add_input_menu(node.parentNode);
}

function get_url_menu_list(url) {
  let arr = [];
  if (SOCIALBROWSER.var.core.id.like('*developer*')) {
    arr.push({
      label: ' in Trusted window',
      click() {
        SOCIALBROWSER.ipc('[open new popup]', {
          partition: SOCIALBROWSER.partition,
          url: url,
          referrer: document.location.href,
          show: true,
          trusted: true,
          center: true,
        });
      },
    });
  }
  arr.push({
    label: ' in ( New tab )',
    click() {
      SOCIALBROWSER.ipc('[open new tab]', {
        referrer: document.location.href,
        url: url,
        partition: SOCIALBROWSER.partition,
        user_name: SOCIALBROWSER.session.display,
        windowID: SOCIALBROWSER.currentWindow.id,
        center: true,
      });
    },
  });
  arr.push({
    label: ' in ( Current window )',
    click() {
      document.location.href = url;
    },
  });
  arr.push({
    label: ' in ( New window )',
    click() {
      SOCIALBROWSER.ipc('[open new popup]', {
        url: url,
        referrer: document.location.href,
        partition: SOCIALBROWSER.partition,
        show: true,
        iframe: true,
        center: true,
      });
    },
  });
  arr.push({
    label: ' in ( Self window )',
    click() {
      SOCIALBROWSER.ipc('[open new popup]', {
        url: url,
        referrer: document.location.href,
        partition: SOCIALBROWSER.partition,
        show: true,
        allowSelfWindow: true,
        iframe: true,
        center: true,
      });
    },
  });
  arr.push({
    label: ' in ( Just window  )',
    click() {
      SOCIALBROWSER.ipc('[open new popup]', {
        url: url,
        referrer: document.location.href,
        partition: SOCIALBROWSER.partition,
        show: true,
        iframe: true,
        allowNewWindows: false,
        center: true,
      });
    },
  });
  arr.push({
    label: ' in ( Allow ads window )',
    click() {
      SOCIALBROWSER.ipc('[open new popup]', {
        url: url,
        referrer: document.location.href,
        partition: SOCIALBROWSER.partition,
        show: true,
        iframe: true,
        allowAds: true,
        center: true,
      });
    },
  });

  arr.push({
    label: ' in ( Insecure window )',
    click() {
      SOCIALBROWSER.ipc('[open new popup]', {
        url: url,
        referrer: document.location.href,
        partition: SOCIALBROWSER.partition,
        show: true,
        iframe: true,
        security: false,
        center: true,
      });
    },
  });

  arr.push({
    label: ' in ( Ghost window )',
    click() {
      SOCIALBROWSER.ipc('[open new popup]', {
        url: url,
        referrer: document.location.href,
        partition: 'x-ghost_' + new Date().getTime() + Math.random(),
        user_name: 'x-ghost_' + new Date().getTime() + Math.random(),
        show: true,
        iframe: true,
        iframe: true,
        center: true,
      });
    },
  });

  if (SOCIALBROWSER.var.session_list.length > 1) {
    arr.push({
      type: 'separator',
    });

    SOCIALBROWSER.var.session_list.forEach((ss, i) => {
      arr.push({
        label: ` As ( ${i + 1} ) [ ${ss.display} ] `,
        click() {
          SOCIALBROWSER.ipc('[open new tab]', {
            referrer: document.location.href,
            url: url,
            partition: ss.name,
            user_name: ss.display,
            windowID: SOCIALBROWSER.currentWindow.id,
          });
        },
      });
    });

    return arr;
  }
}
function add_a_menu(node) {
  if (!node || SOCIALBROWSER.menuAOFF) {
    return;
  }

  if (node.nodeName === 'A' && node.getAttribute('href') && !node.getAttribute('href').startsWith('#')) {
    let u = node.getAttribute('href');
    u = SOCIALBROWSER.handleURL(u);

    u_string = ' [ ' + u.substring(0, 70) + ' ] ';
    if (u.like('mailto:*')) {
      let mail = u.replace('mailto:', '');
      SOCIALBROWSER.menuList.push({
        label: `Copy Email ${u_string}`,
        click() {
          SOCIALBROWSER.electron.clipboard.writeText(mail);
        },
      });
    } else {
      SOCIALBROWSER.selectedURL = u;

      SOCIALBROWSER.menuList.push({
        label: `Open link ${u_string} in ( new tab ) `,
        click() {
          SOCIALBROWSER.ipc('[open new tab]', {
            referrer: document.location.href,
            url: u,
            partition: SOCIALBROWSER.partition,
            user_name: SOCIALBROWSER.session.display,
            windowID: SOCIALBROWSER.currentWindow.id,
            center: true,
          });
        },
      });

      SOCIALBROWSER.menuList.push({
        label: `Open link ${u_string} in ( current window ) `,
        click() {
          document.location.href = u;
        },
      });

      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });

      SOCIALBROWSER.menuList.push({
        label: `Copy link ${u_string}`,
        click() {
          SOCIALBROWSER.electron.clipboard.writeText(u);
        },
      });

      let arr = get_url_menu_list(u);
      SOCIALBROWSER.menuList.push({
        label: `Open link ${u_string} `,
        type: 'submenu',
        submenu: arr,
      });
    }

    if (u.like('https://www.youtube.com/watch*')) {
      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });

      SOCIALBROWSER.menuList.push({
        label: 'Play video ',
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            windowType: 'youtube',
            url: 'https://www.youtube.com/embed/' + u.split('=')[1].split('&')[0],
            partition: SOCIALBROWSER.partition,
            referrer: document.location.href,
            show: true,
          });
        },
      });
      SOCIALBROWSER.menuList.push({
        label: 'Download video ',
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            url: u.replace('youtube', 'ssyoutube'),
            partition: SOCIALBROWSER.partition,
            referrer: document.location.href,
            show: true,
            center: true,
          });
        },
      });

      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });
    }

    return;
  }

  add_a_menu(node.parentNode);
}

function get_img_menu(node) {
  if (!node || SOCIALBROWSER.menuImgOFF) {
    return;
  }

  if (node.nodeName == 'IMG' && node.getAttribute('src')) {
    let url = node.getAttribute('src');
    url = SOCIALBROWSER.handleURL(url);
    u_string = ' [ ' + url.substring(0, 70) + ' ] ';
    SOCIALBROWSER.menuList.push({
      label: `Open image ${u_string} in ( new tab ) `,
      click() {
        SOCIALBROWSER.ipc('[open new tab]', {
          url: url,
          referrer: document.location.href,
          windowID: SOCIALBROWSER.currentWindow.id,
        });
      },
    });

    let arr = get_url_menu_list(url);
    SOCIALBROWSER.menuList.push({
      label: `Open Image link ${u_string} `,
      type: 'submenu',
      submenu: arr,
    });

    SOCIALBROWSER.menuList.push({
      label: `Copy image address ${u_string} `,
      click() {
        SOCIALBROWSER.electron.clipboard.writeText(url);
      },
    });

    SOCIALBROWSER.menuList.push({
      label: `Save image ${u_string} `,
      click() {
        sendToMain({
          name: '[download-link]',
          url: url,
        });
      },
    });

    SOCIALBROWSER.menuList.push({
      type: 'separator',
    });
    return;
  }
  get_img_menu(node.parentNode);
}

function add_div_menu(node) {
  if (!node || SOCIALBROWSER.menuDivOFF) {
    return;
  }

  if (node.nodeName === 'DIV') {
    SOCIALBROWSER.menuList.push({
      label: 'Copy inner text',
      click() {
        SOCIALBROWSER.electron.clipboard.writeText(node.innerText);
      },
    });
    SOCIALBROWSER.menuList.push({
      label: 'Copy inner html',
      click() {
        SOCIALBROWSER.electron.clipboard.writeText(node.innerText);
      },
    });
    SOCIALBROWSER.menuList.push({
      type: 'separator',
    });
    return;
  }
  add_div_menu(node.parentNode);
}

let isImageHidden = false;
let image_interval = null;

let isIframesDeleted = false;
let iframe_interval = null;

function removeIframes() {
  isIframesDeleted = true;
  iframe_interval = setInterval(() => {
    document.querySelectorAll('iframe').forEach((frm) => {
      frm.remove();
    });
  }, 1000);
}

function get_options_menu(node) {
  if (SOCIALBROWSER.menuOptionsOFF) {
    return;
  }

  let arr = [];

  arr.push({
    label: 'Copy page Link',
    click() {
      SOCIALBROWSER.electron.clipboard.writeText(window.location.href);
    },
  });
  arr.push({
    label: 'Sound on/off',
    click() {
      SOCIALBROWSER.webContents.setAudioMuted(!SOCIALBROWSER.webContents.audioMuted);
    },
  });
  arr.push({
    type: 'separator',
  });

  arr.push({
    label: 'Save page',
    accelerator: 'CommandOrControl+s',
    click() {
      SOCIALBROWSER.webContents.downloadURL(document.location.href);
    },
  });

  arr.push({
    label: 'Save page as PDF',
    click() {
      sendToMain({
        name: '[save-window-as-pdf]',
        windowID: SOCIALBROWSER.currentWindow.id,
      });
    },
  });

  arr.push({
    label: 'Print page',
    accelerator: 'CommandOrControl+p',
    click() {
      window.print();
    },
  });

  arr.push({
    type: 'separator',
  });
  arr.push({
    label: 'Hard Refresh',
    accelerator: 'CommandOrControl+F5',
    click() {
      SOCIALBROWSER.ipc('[window-reload-hard]', {
        windowID: SOCIALBROWSER.currentWindow.id,
        origin: document.location.origin || document.location.href,
        partition: SOCIALBROWSER.partition,
        storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
      });
    },
  });
  arr.push({
    type: 'separator',
  });

  arr.push({
    label: 'Full Screen',
    accelerator: 'F11',
    click() {
      sendToMain({
        name: '[toggle-fullscreen]',
        windowID: SOCIALBROWSER.currentWindow.id,
      });
    },
  });
  arr.push({
    type: 'separator',
  });
  if (!SOCIALBROWSER.var.blocking.popup.allow_external) {
    arr.push({
      label: 'Allow External Popup',
      click() {
        SOCIALBROWSER.var.blocking.popup.allow_external = true;
      },
    });
  }
  if (!SOCIALBROWSER.var.blocking.popup.allow_internal) {
    arr.push({
      label: 'Allow Internal Popup',
      click() {
        SOCIALBROWSER.var.blocking.popup.allow_internal = true;
      },
    });
  }

  if (SOCIALBROWSER.var.blocking.popup.allow_external) {
    arr.push({
      label: 'Block External Popup',
      click() {
        SOCIALBROWSER.var.blocking.popup.allow_external = false;
      },
    });
  }

  if (SOCIALBROWSER.var.blocking.popup.allow_internal) {
    arr.push({
      label: 'Block Internal Popup',
      click() {
        SOCIALBROWSER.var.blocking.popup.allow_internal = false;
      },
    });
  }

  arr.push({
    type: 'separator',
  });

  arr.push({
    type: 'separator',
  });
  arr.push({
    label: 'Clear Site Cache',
    accelerator: 'CommandOrControl+F5',
    click() {
      SOCIALBROWSER.ipc('[window-reload-hard]', {
        windowID: SOCIALBROWSER.currentWindow.id,
        origin: document.location.origin || document.location.href,
        storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
      });
    },
  });

  arr.push({
    label: 'Clear Site Cookies',
    click() {
      SOCIALBROWSER.ipc('[window-reload-hard]', {
        windowID: SOCIALBROWSER.currentWindow.id,
        origin: document.location.origin || document.location.href,
        storages: ['cookies'],
      });
    },
  });

  arr.push({
    label: 'Clear All Site Data',
    click() {
      SOCIALBROWSER.ipc('[window-reload-hard]', {
        windowID: SOCIALBROWSER.currentWindow.id,
        origin: document.location.origin || document.location.href,
        storages: ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage', 'cookies'],
      });
    },
  });

  arr.push({
    type: 'separator',
  });
  arr.push({
    label: 'Hide window',
    click() {
      SOCIALBROWSER.currentWindow.setSkipTaskbar(true);
      SOCIALBROWSER.currentWindow.setAlwaysOnTop(false);
      SOCIALBROWSER.currentWindow.setFullScreen(false);
      SOCIALBROWSER.webContents.setAudioMuted(true);
      setTimeout(() => {
        SOCIALBROWSER.currentWindow.hide();
      }, 500);
    },
  });
  arr.push({
    label: 'Close window',
    click() {
      SOCIALBROWSER.currentWindow.close();
    },
  });
  if (SOCIALBROWSER.var.core.id.like('*developer*')) {
    arr.push({
      label: 'Destroy window',
      click() {
        SOCIALBROWSER.currentWindow.destroy();
      },
    });
  }

  arr.push({
    type: 'separator',
  });

  arr.push({
    label: 'Hide Pointer Tag',
    click() {
      node.style.display = 'none';
    },
  });
  arr.push({
    label: 'Remove Pointer Tag',
    accelerator: 'CommandOrControl+Delete',
    click() {
      node.remove();
    },
  });
  arr.push({
    type: 'separator',
  });

  if (isImageHidden) {
    arr.push({
      label: 'Show all images',
      click() {
        isImageHidden = false;
        clearInterval(image_interval);
        document.querySelectorAll('img').forEach((img) => {
          img.style.visibility = 'visible';
        });
      },
    });
  } else {
    arr.push({
      label: 'Hide all images',
      click() {
        isImageHidden = true;
        image_interval = setInterval(() => {
          document.querySelectorAll('img').forEach((img) => {
            img.style.visibility = 'hidden';
          });
        }, 1000);
      },
    });
  }

  if (isIframesDeleted) {
    arr.push({
      label: 'Stop deleting iframes',
      click() {
        isIframesDeleted = false;
        clearInterval(iframe_interval);
      },
    });
  } else {
    arr.push({
      label: 'Delete all iframes',
      click() {
        removeIframes();
      },
    });
  }

  let m = {
    label: 'Page',
    type: 'submenu',
    submenu: arr,
  };

  SOCIALBROWSER.menuList.push(m);

  let arr2 = [];

  document.querySelectorAll('iframe').forEach((f, i) => {
    if (i > 10) {
      return;
    }
    if (f.src && !f.src.like('*javascript*') && !f.src.like('*about:blank*')) {
      arr2.push({
        label: 'View  ' + f.src,
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            partition: SOCIALBROWSER.partition,
            url: 'http://127.0.0.1:60080/iframe?url=' + f.src,
            referrer: document.location.href,
            show: true,
            vip: true,
            center: true,
          });
        },
      });
      arr2.push({
        label: 'Open in ( New window  )',
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            partition: SOCIALBROWSER.partition,
            url: f.src,
            referrer: document.location.href,
            show: true,
            center: true,
          });
        },
      });
      arr2.push({
        label: 'Open in ( Insecure window )',
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            partition: SOCIALBROWSER.partition,
            url: f.src,
            referrer: document.location.href,
            security: false,
            show: true,
            center: true,
          });
        },
      });
      arr2.push({
        label: 'Copy link ',
        click() {
          SOCIALBROWSER.electron.clipboard.writeText(f.src);
        },
      });
      arr2.push({
        label: 'Download link ',
        click() {
          sendToMain({
            name: '[download-link]',
            url: f.src,
          });
        },
      });
      arr2.push({
        type: 'separator',
      });
    }
  });

  if (arr2.length > 0) {
    let m2 = {
      label: 'Page Frames',
      type: 'submenu',
      submenu: arr2,
    };
    SOCIALBROWSER.menuList.push(m2);
  }

  let arr3 = [];
  let videos = [].concat(SOCIALBROWSER.video_list);
  document.querySelectorAll('video').forEach((v) => {
    if (v.src && !v.src.startsWith('xblob:'))
      videos.push({
        src: v.src,
      });
  });
  videos.forEach((f, i) => {
    if (!f || !f.src || arr3.length > 10 || f.src.like('blob*')) {
      return;
    }
    arr3.push({
      label: 'Play  ' + f.src,
      click() {
        SOCIALBROWSER.ipc('[open new popup]', {
          alwaysOnTop: true,
          partition: SOCIALBROWSER.partition,
          url: 'http://127.0.0.1:60080/iframe?url=' + f.src,
          referrer: document.location.href,
          show: true,
          vip: true,
          center: true,
        });
      },
    });

    arr3.push({
      label: 'Open in ( New window )',
      click() {
        SOCIALBROWSER.ipc('[open new popup]', {
          alwaysOnTop: true,
          partition: SOCIALBROWSER.partition,
          url: f.src,
          referrer: document.location.href,
          show: true,
          center: true,
        });
      },
    });
    arr3.push({
      label: 'Open in ( Ghost window )',
      click() {
        SOCIALBROWSER.ipc('[open new popup]', {
          alwaysOnTop: true,
          partition: 'x-ghost_' + Date.now(),
          url: f.src,
          referrer: document.location.href,
          show: true,
          iframe: true,
          center: true,
        });
      },
    });
    arr3.push({
      label: 'Open in ( Insecure window )',
      click() {
        SOCIALBROWSER.ipc('[open new popup]', {
          alwaysOnTop: true,
          partition: SOCIALBROWSER.partition,
          url: f.src,
          referrer: document.location.href,
          security: false,
          show: true,
          center: true,
        });
      },
    });
    arr3.push({
      label: 'download',
      click() {
        sendToMain({
          name: '[download-link]',
          url: f.src,
        });
      },
    });

    arr3.push({
      label: 'copy link',
      click() {
        SOCIALBROWSER.electron.clipboard.writeText(f.src);
      },
    });
    arr3.push({
      type: 'separator',
    });
  });

  document.querySelectorAll('video , video source').forEach((f) => {
    if (f.src && f.src.startsWith('http')) {
      arr3.push({
        label: 'Play video source  ' + f.src,
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            partition: SOCIALBROWSER.partition,
            url: f.src,
            referrer: document.location.href,
            show: true,
            center: true,
          });
        },
      });
      arr3.push({
        label: 'Open in ( New window )',
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            alwaysOnTop: true,
            partition: SOCIALBROWSER.partition,
            url: f.src,
            referrer: document.location.href,
            show: true,
            center: true,
          });
        },
      });

      arr3.push({
        label: 'Open in ( Insecure window )',
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            alwaysOnTop: true,
            partition: SOCIALBROWSER.partition,
            url: f.src,
            referrer: document.location.href,
            security: false,
            show: true,
            center: true,
          });
        },
      });

      arr3.push({
        label: 'copy link ',
        click() {
          SOCIALBROWSER.electron.clipboard.writeText(f.src);
        },
      });

      arr3.push({
        label: 'download',
        click() {
          sendToMain({
            name: '[download-link]',
            url: f.src,
          });
        },
      });
      arr3.push({
        type: 'separator',
      });
    }
  });

  if (arr3.length > 0) {
    let m3 = {
      label: 'Page Videos',
      type: 'submenu',
      submenu: arr3,
    };
    SOCIALBROWSER.menuList.push(m3);
    SOCIALBROWSER.menuList.push({
      type: 'separator',
    });
  }

  return;
}

function get_custom_menu() {
  if (SOCIALBROWSER.menuCustomOFF) {
    return;
  }

  let vids = document.querySelectorAll('video');
  if (vids.length > 0) {
    vids.forEach((v) => {
      if (v.currentTime != v.duration && v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
        SOCIALBROWSER.menuList.push({
          label: 'Skip playing video ',
          click() {
            v.currentTime = v.duration;
          },
        });
        if (v.src.like('http*')) {
          SOCIALBROWSER.menuList.push({
            label: 'Download playing video ',
            click() {
              sendToMain({
                name: '[download-link]',
                url: v.src,
              });
            },
          });
        }

        SOCIALBROWSER.menuList.push({
          type: 'separator',
        });
      }
    });
  }

  if (document.location.href.like('*youtube.com/watch*v=*')) {
    SOCIALBROWSER.menuList.push({
      label: 'Open current video',
      click() {
        SOCIALBROWSER.ipc('[open new popup]', {
          windowType: 'youtube',
          url: 'https://www.youtube.com/embed/' + document.location.href.split('=')[1].split('&')[0],
          partition: SOCIALBROWSER.partition,
          referrer: document.location.href,
          show: true,
        });
      },
    });

    SOCIALBROWSER.menuList.push({
      label: 'Download current video',
      click() {
        SOCIALBROWSER.ipc('[open new popup]', {
          partition: SOCIALBROWSER.partition,
          referrer: document.location.href,
          url: document.location.href.replace('youtube', 'ssyoutube'),
          show: true,
          center: true,
        });
      },
    });

    SOCIALBROWSER.menuList.push({
      type: 'separator',
    });
  }
}

function createDevelopmentMenu() {
  if (SOCIALBROWSER.menuTestOFF) {
    return;
  }
  let arr = [];

  arr.push({
    label: ' Close Social Browser',
    click() {
      SOCIALBROWSER.ws({ type: '[close]' });
    },
  });

  if (arr.length > 0) {
    SOCIALBROWSER.menuList.push({
      label: 'Development Menu',
      type: 'submenu',
      submenu: arr,
    });
  }
}

function url_to_social(url, social_arr, title) {
  if (SOCIALBROWSER.menuSocialOFF) {
    return;
  }
  social_arr.push({
    label: ` Open  [ ${title} ] in 5 new window [Audio Muted]`,
    click() {
      for (let index = 0; index < 5; index++) {
        setTimeout(() => {
          SOCIALBROWSER.ipc('[open new popup]', {
            partition: SOCIALBROWSER.partition,
            url: url,
            referrer: document.location.href,
            allowAudio: false,
            show: true,
            center: true,
          });
        }, 1000 * 2 * index);
      }
    },
  });
  social_arr.push({
    label: ` Open [ ${title} ] in Many window [ All Profiles (${SOCIALBROWSER.var.session_list.length}) ] [Audio Muted]`,
    click() {
      for (let index = 0; index < SOCIALBROWSER.var.session_list.length; index++) {
        setTimeout(() => {
          SOCIALBROWSER.ipc('[open new popup]', {
            partition: SOCIALBROWSER.var.session_list[index].name,
            user_name: SOCIALBROWSER.var.session_list[index].display,
            url: url,
            referrer: document.location.href,
            allowAudio: false,
            show: true,
            center: true,
          });
        }, 1000 * index * 2);
      }
    },
  });
  social_arr.push({
    label: ` Open [ ${title} ] in Many window [ All User Agents (${SOCIALBROWSER.var.user_agent_list.length}) ] [Audio Muted]`,
    click() {
      for (let index = 0; index < SOCIALBROWSER.var.user_agent_list.length; index++) {
        setTimeout(() => {
          SOCIALBROWSER.ipc('[open new popup]', {
            partition: SOCIALBROWSER.partition,
            user_agent: SOCIALBROWSER.var.user_agent_list[index].url,
            url: url,
            referrer: document.location.href,
            allowAudio: false,
            show: true,
            center: true,
          });
        }, 1000 * index * 2);
      }
    },
  });
  social_arr.push({
    label: ` Open [ ${title} ] in Many window [ All User Agents (${SOCIALBROWSER.var.user_agent_list.length}) ] [Audio Muted] + Ghosts Profiles `,
    click() {
      for (let index = 0; index < SOCIALBROWSER.var.user_agent_list.length; index++) {
        setTimeout(() => {
          let partition2 = 'x-ghost_' + Date.now() + '_' + Math.random();
          SOCIALBROWSER.ipc('[open new popup]', {
            partition: partition2,
            user_agent: SOCIALBROWSER.var.user_agent_list[index].url,
            url: url,
            referrer: document.location.href,
            allowAudio: false,
            show: true,
            iframe: true,
            center: true,
          });
        }, 1000 * index * 1);
      }
    },
  });

  social_arr.push({
    label: ` Open [ ${title} ] in Many window [ Proxy List ( 10 ) ] [Audio Muted] + Ghosts Profiles `,
    click() {
      if (!SOCIALBROWSER.proxyIndex) {
        SOCIALBROWSER.proxyIndex = 0;
      }
      SOCIALBROWSER.proxy_list = SOCIALBROWSER.var.proxy_list.slice(SOCIALBROWSER.proxyIndex, 10 + SOCIALBROWSER.proxyIndex);
      SOCIALBROWSER.proxyIndex += 10;
      for (let index = 0; index < SOCIALBROWSER.proxy_list.length; index++) {
        setTimeout(() => {
          let partition2 = 'x-ghost_' + Date.now();
          SOCIALBROWSER.ipc('[open new popup]', {
            partition: partition2,
            user_agent: SOCIALBROWSER.userAgent,
            url: url,
            referrer: document.location.href,
            allowAudio: false,
            show: true,
            iframe: true,
            proxy: SOCIALBROWSER.var.proxy_list[index],
            center: true,
          });
        }, 1000 * index * 2);
      }
    },
  });
  return social_arr;
}

function get_social_menu(node, social_arr) {
  if (SOCIALBROWSER.menuSocialOFF) {
    return;
  }

  social_arr = social_arr || [];

  if (!node) {
    if (social_arr.length > 0) {
      social_arr.push({
        type: 'separator',
      });
    }
    social_arr = url_to_social(document.location.href, social_arr, 'Current Page');
    if (social_arr.length > 0) {
      SOCIALBROWSER.menuList.push({
        label: ' Social Tools ',
        type: 'submenu',
        submenu: social_arr,
      });

      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });
    }
    return;
  }

  if (SOCIALBROWSER.var.blocking.social.allow_menu) {
    if (SOCIALBROWSER.var.blocking.social.allow_alexa && social_arr.length === 0) {
      social_arr.push({
        label: ` ${document.location.host} ( Alexa Rank )`,
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            width: 500,
            height: 500,
            url: `https://www.alexa.com/minisiteinfo/${document.location.origin}?offset=5&version=alxg_20100607`,
            referrer: document.location.href,
            show: true,
            center: true,
          });
        },
      });
    }

    if (node.nodeName === 'A' && node.getAttribute('href') && !node.getAttribute('href').like('*#*|*mailto*')) {
      let u = node.getAttribute('href');

      u = SOCIALBROWSER.handleURL(u);

      social_arr.push({
        type: 'separator',
      });
      social_arr = url_to_social(u, social_arr, 'Link');

      social_arr.push({
        type: 'separator',
      });
      get_social_menu(null, social_arr);
    } else if (node.nodeName !== 'A') {
      get_social_menu(node.parentNode, social_arr);
    }
  }
}

function createMenuList(node) {
  if (SOCIALBROWSER.customSetting.windowType !== 'main') {
    if (SOCIALBROWSER.selectedText.length > 0) {
      let stext = SOCIALBROWSER.selectedText.substring(0, 70);
      SOCIALBROWSER.menuList.push({
        label: `Copy [ ${stext} ] `,
        click() {
          SOCIALBROWSER.electron.clipboard.writeText(SOCIALBROWSER.selectedText);
        },
      });

      SOCIALBROWSER.menuList.push({
        label: `Translate [ ${stext} ] `,
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            partition: SOCIALBROWSER.partition,
            show: true,
            center: true,
            url: 'https://translate.google.com/?num=100&newwindow=1&um=1&ie=UTF-8&hl=en&client=tw-ob#auto/ar/' + encodeURIComponent(SOCIALBROWSER.selectedText),
          });
        },
      });

      SOCIALBROWSER.menuList.push({
        label: `Search  [ ${stext} ] `,
        click() {
          SOCIALBROWSER.ipc('[open new tab]', {
            referrer: document.location.href,
            url: 'https://www.google.com/search?q=' + encodeURIComponent(SOCIALBROWSER.selectedText),
            windowID: SOCIALBROWSER.currentWindow.id,
          });
        },
      });

      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });
    }

    add_input_menu(node);
    add_a_menu(node);

    if (SOCIALBROWSER.memoryText && SOCIALBROWSER.isValidURL(SOCIALBROWSER.memoryText)) {
      let arr = get_url_menu_list(SOCIALBROWSER.memoryText);
      SOCIALBROWSER.menuList.push({
        label: `Open link [ ${SOCIALBROWSER.memoryText.substring(0, 70)} ] `,
        type: 'submenu',
        submenu: arr,
      });

      SOCIALBROWSER.menuList.push({ type: 'separator' });
    }
    if (SOCIALBROWSER.selectedText && SOCIALBROWSER.isValidURL(SOCIALBROWSER.selectedText)) {
      let arr = get_url_menu_list(SOCIALBROWSER.selectedText);
      SOCIALBROWSER.menuList.push({
        label: `Open link [ ${SOCIALBROWSER.selectedText.substring(0, 70)} ] `,
        type: 'submenu',
        submenu: arr,
      });

      SOCIALBROWSER.menuList.push({ type: 'separator' });
    }

    get_img_menu(node);

    get_social_menu(node, null);
    SOCIALBROWSER.menu_list.forEach((m) => {
      SOCIALBROWSER.menuList.push(m);
    });

    if (SOCIALBROWSER.var.blocking.open_list.length > 0) {
      SOCIALBROWSER.var.blocking.open_list.forEach((o) => {
        if (o.enabled) {
          if (o.multi) {
            let arr = get_url_menu_list(o.url || document.location.href);
            SOCIALBROWSER.menuList.push({
              label: o.name,
              type: 'submenu',
              submenu: arr,
            });
          } else {
            SOCIALBROWSER.menuList.push({
              label: o.name,
              click() {
                SOCIALBROWSER.ipc('[open new tab]', {
                  partition: SOCIALBROWSER.partition,
                  url: o.url || document.location.href,
                  referrer: document.location.href,
                  show: true,
                  windowID: SOCIALBROWSER.currentWindow.id,
                });
              },
            });
          }

          SOCIALBROWSER.menuList.push({
            type: 'separator',
          });
        }
      });
    }

    if (SOCIALBROWSER.var.vip && SOCIALBROWSER.var.vip.enabled) {
      let arr = [];
      SOCIALBROWSER.var.vip.list.forEach((v) => {
        arr.push({
          label: v.name,
          click() {
            SOCIALBROWSER.ipc('[open new popup]', {
              partition: SOCIALBROWSER.partition,
              url: SOCIALBROWSER.var.vip.server_url + v.url,
              referrer: document.location.href,
              show: true,
              trusted: true,
              center: true,
            });
          },
        });
      });

      if (arr.length > 0) {
        SOCIALBROWSER.menuList.push({
          label: ' VIP ',
          type: 'submenu',
          submenu: arr,
        });
      }

      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });
    }

    get_custom_menu();
    if (SOCIALBROWSER.var.blocking.context_menu.copy_div_content) {
      add_div_menu(node);
    }

    SOCIALBROWSER.menuList.push({
      label: 'Refresh',
      accelerator: 'F5',
      click: function () {
        SOCIALBROWSER.currentWindow.webContents.reload();
      },
    });

    SOCIALBROWSER.menuList.push({
      type: 'separator',
    });

    if (SOCIALBROWSER.var.blocking.context_menu.proxy_options) {
      let arr = [];

      SOCIALBROWSER.var.proxy_list.slice(0, 50).forEach((p) => {
        if (!p) {
          return;
        }
        arr.push({
          label: p.name || p.url,
          click() {
            SOCIALBROWSER.ipc('[open new popup]', {
              show: true,
              url: document.location.href,
              proxy: p,
              partition: 'x-ghost_' + new Date().getTime(),
              iframe: true,
              center: true,
            });
          },
        });
      });

      if (arr.length > 0) {
        SOCIALBROWSER.menuList.push({
          label: 'Open current page with proxy + ghost user',
          type: 'submenu',
          submenu: arr,
        });
      }
    }
    if (SOCIALBROWSER.var.blocking.context_menu.page_options) {
      get_options_menu(node);
    }

    if (SOCIALBROWSER.var.blocking.context_menu.inspect && SOCIALBROWSER.customSetting.allowDevTools) {
      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });

      SOCIALBROWSER.menuList.push({
        label: 'Inspect Element',
        click() {
          SOCIALBROWSER.currentWindow.webContents.inspectElement(SOCIALBROWSER.rightClickPosition.x2, SOCIALBROWSER.rightClickPosition.y2);
        },
      });
    }

    if (SOCIALBROWSER.var.blocking.context_menu.dev_tools && SOCIALBROWSER.customSetting.allowDevTools) {
      SOCIALBROWSER.menuList.push({
        label: 'Developer Tools',
        accelerator: 'F12',
        click() {
          SOCIALBROWSER.currentWindow.webContents.openDevTools();
        },
      });
    }

    if (SOCIALBROWSER.var.core.id.like('*developer*')) {
      createDevelopmentMenu();
    }
  } else {
    if (node.classList.contains('social-tab')) {
      let url = node.getAttribute('url');
      let partition = node.getAttribute('partition');
      let user_name = node.getAttribute('user_name');
      let user_agent = node.getAttribute('user_agent');
      let childProcessID = node.getAttribute('childProcessID');
      let ghost = 'x-ghost_' + Math.random().toString().replace('.', '');
      SOCIALBROWSER.menuList.push({
        label: 'New tab',
        click() {
          SOCIALBROWSER.ipc('[open new tab]', { main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      });
      SOCIALBROWSER.menuList.push({
        label: 'Duplicate tab',
        click() {
          SOCIALBROWSER.ipc('[open new tab]', { url: url, partition: partition, user_name: user_name, user_agent: user_agent, main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      });
      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });

      SOCIALBROWSER.menuList.push({
        label: 'Hide tab',
        click() {
          node.classList.add('display-none');
          socialTabs.layoutTabs();
        },
      });
      SOCIALBROWSER.menuList.push({
        label: '  Hide other tabs',
        click() {
          document.querySelectorAll('.social-tab:not(.plus)').forEach((el) => {
            if (el.id !== node.id) {
              el.classList.add('display-none');
            }
          });
          socialTabs.layoutTabs();
        },
      });
      SOCIALBROWSER.menuList.push({
        label: 'Show hidden tabs',
        click() {
          document.querySelectorAll('.social-tab').forEach((t) => {
            t.classList.remove('display-none');
          });
          socialTabs.layoutTabs();
        },
      });
      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });
      SOCIALBROWSER.menuList.push({
        label: 'New Ghost tab',
        click() {
          SOCIALBROWSER.ipc('[open new tab]', { partition: ghost, iframe: true, user_name: ghost, user_agent: user_agent, main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      });
      SOCIALBROWSER.menuList.push({
        label: 'Duplicate tab in Ghost tab',
        click() {
          SOCIALBROWSER.ipc('[open new tab]', { url: url, partition: ghost, user_name: ghost, user_agent: user_agent, main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      });
      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });

      SOCIALBROWSER.menuList.push({
        label: 'Duplicate tab in window',
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            childProcessID: childProcessID,
            show: true,
            center: true,
            url: url,
            partition: partition,
            user_name: user_name,
            user_agent: user_agent,
            main_window_id: SOCIALBROWSER.currentWindow.id,
          });
        },
      });
      SOCIALBROWSER.menuList.push({
        label: 'Duplicate tab in Ghost window',
        click() {
          SOCIALBROWSER.ipc('[open new popup]', {
            childProcessID: childProcessID,
            show: true,
            center: true,
            url: url,
            partition: ghost,
            user_name: ghost,
            user_agent: user_agent,
            main_window_id: SOCIALBROWSER.currentWindow.id,
          });
        },
      });
      SOCIALBROWSER.menuList.push({
        type: 'separator',
      });
      SOCIALBROWSER.menuList.push({
        label: 'Close',
        click() {
          client.call('remove-tab', node);
        },
      });
      SOCIALBROWSER.menuList.push({
        label: 'Close other tabs',
        click() {
          document.querySelectorAll('.social-tab').forEach((node2) => {
            if (!node2.classList.contains('plus') && node.id !== node2.id) {
              client.call('remove-tab', node2);
            }
          });
        },
      });

      if (SOCIALBROWSER.var.core.id.contains('developer')) {
        SOCIALBROWSER.menuList.push({
          type: 'separator',
        });

        SOCIALBROWSER.menuList.push({
          label: 'Inspect Element',
          click() {
            SOCIALBROWSER.currentWindow.webContents.inspectElement(SOCIALBROWSER.rightClickPosition.x2, SOCIALBROWSER.rightClickPosition.y2);
          },
        });

        SOCIALBROWSER.menuList.push({
          label: 'Developer Tools',
          accelerator: 'F12',
          click() {
            SOCIALBROWSER.currentWindow.webContents.openDevTools({
              mode: 'detach',
            });
          },
        });

        SOCIALBROWSER.menuList.push({
          label: 'Exist Social Browser',
          click() {
            SOCIALBROWSER.ws({ type: '[close]' });
          },
        });
      }
    }
  }

  return;
}

SOCIALBROWSER.contextmenu = function (e) {
  try {
    if (!SOCIALBROWSER.customSetting.allowMenu) {
      SOCIALBROWSER.log('menu off');
      return null;
    }

    try {
      SOCIALBROWSER.currentWindow.show();
    } catch (error) {
      SOCIALBROWSER.currentWindow = SOCIALBROWSER.remote.getCurrentWindow();
      SOCIALBROWSER.currentWindow.show();
    }

    e = e || { x: 0, y: 0 };
    SOCIALBROWSER.memoryText = SOCIALBROWSER.electron.clipboard.readText();
    SOCIALBROWSER.selectedText = getSelection().toString().trim();
    SOCIALBROWSER.selectedURL = null;

    let factor = SOCIALBROWSER.currentWindow.webContents.zoomFactor || 1;

    SOCIALBROWSER.rightClickPosition = {
      x: Math.round(e.x / factor),
      y: Math.round(e.y / factor),
      x2: Math.round(e.x),
      y2: Math.round(e.y),
    };
    let node = document.elementFromPoint(SOCIALBROWSER.rightClickPosition.x, SOCIALBROWSER.rightClickPosition.y);

    if (!node || !!node.oncontextmenu) {
      return null;
    }

    SOCIALBROWSER.menuList = [];

    createMenuList(node);

    SOCIALBROWSER.ipc('[show-menu]', {
      list: SOCIALBROWSER.menuList.map((m) => ({
        label: m.label,
        sublabel: m.sublabel,
        visible: m.visible,
        type: m.type,
        submenu: m.submenu?.map((s) => ({ label: s.label, type: s.type, sublabel: s.sublabel, visible: s.visible })),
      })),
      windowID: SOCIALBROWSER.currentWindow.id,
    });
  } catch (error) {
    SOCIALBROWSER.log(error);
  }
};

SOCIALBROWSER.on('context-menu', (e, data) => {
  SOCIALBROWSER.contextmenu(data);
});
SOCIALBROWSER.on('[run-menu]', (e, data) => {
  if (typeof data.index !== 'undefined' && typeof data.index2 !== 'undefined') {
    let m = SOCIALBROWSER.menuList[data.index];
    if (m && m.submenu) {
      let m2 = m.submenu[data.index2];
      if (m2) {
        m2.click();
      }
    }
  } else if (typeof data.index !== 'undefined') {
    let m = SOCIALBROWSER.menuList[data.index];
    if (m) {
      m.click();
    }
  }
});
window.addEventListener('dblclick', (event) => {
  if (
    SOCIALBROWSER.var.blocking.javascript.auto_remove_html &&
    SOCIALBROWSER.customSetting.windowType !== 'main' &&
    !event.target.tagName.contains('body|input|video|embed|progress') &&
    !event.target.className.contains('progress')
  ) {
    event.target.remove();
  }
});
