
function escape(s) {
  if (!s) {
    return '';
  }
  if (typeof s !== 'string') {
    s = s.toString();
  }
  return s.replace(/[\/\\^$*+?.()\[\]{}]/g, '\\$&');
}

if (!String.prototype.test) {
  String.prototype.test = function (reg, flag = 'gium') {
    try {
      return new RegExp(reg, flag).test(this);
    } catch (error) {
      return false;
    }
  };
}

if (!String.prototype.like) {
  String.prototype.like = function (name) {
    if (!name) {
      return false;
    }
    let r = false;
    name.split('|').forEach((n) => {
      n = n.split('*');
      n.forEach((w, i) => {
        n[i] = escape(w);
      });
      n = n.join('.*');
      if (this.test('^' + n + '$', 'gium')) {
        r = true;
      }
    });
    return r;
  };
}

if (!String.prototype.contains) {
  String.prototype.contains = function (name) {
    let r = false;
    if (!name) {
      return r;
    }
    name.split('|').forEach((n) => {
      if (n && this.test('^.*' + escape(n) + '.*$', 'gium')) {
        r = true;
      }
    });
    return r;
  };
}

var socialTabsDom = document.querySelector('.social-tabs');
var socialTabs = new SocialTabs();
var currentTabId = null;
var opendTabList = [];

var SOCIALBROWSER = {};
SOCIALBROWSER.electron = require('electron');

SOCIALBROWSER.callSync = function (...args) {
  args[1].tab_id = args[1].tab_id = currentTabId;
  return SOCIALBROWSER.electron.ipcRenderer.sendSync(...args);
};
SOCIALBROWSER.call = function (...args) {
  args[1].tab_id = args[1].tab_id = currentTabId;
  return SOCIALBROWSER.electron.ipcRenderer.send(...args);
};
SOCIALBROWSER.invoke = function (...args) {
  args[1].tab_id = args[1].tab_id = currentTabId;
  return SOCIALBROWSER.electron.ipcRenderer.invoke(...args);
};
SOCIALBROWSER.on = function (...args) {
  SOCIALBROWSER.electron.ipcRenderer.on(...args);
};

SOCIALBROWSER.currentWindow = SOCIALBROWSER.electron.remote.getCurrentWindow();

SOCIALBROWSER.on('user_downloads', (event, data) => {
  if (typeof data.progress != 'undefined') {
    data.progress = parseFloat(data.progress || 0);
    SOCIALBROWSER.currentWindow.setProgressBar(data.progress || 0);
  }
});

const updateOnlineStatus = () => {
  // console.log('Internet Status ' + navigator.onLine);
  SOCIALBROWSER.call('online-status', navigator.onLine ? { status: true } : { status: false });
};

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

const { remote, nativeImage } = SOCIALBROWSER.electron;
const { Menu, MenuItem } = remote;

function sendToMain(obj) {
  obj.tab_id = currentTabId;
  SOCIALBROWSER.call('[send-render-message]', obj);
}

SOCIALBROWSER.on('var.bookmarks', (event, obj) => {
  // console.log(obj);
  SOCIALBROWSER.var.bookmarks = obj.data;
});
SOCIALBROWSER.on('var.core', (event, obj) => {
  // console.log(obj);
  SOCIALBROWSER.var.core = obj.data;
});
SOCIALBROWSER.nativeImage = function (_path) {
  try {
    if (!_path) {
      return null;
    }
    return nativeImage.createFromPath(_path).resize({
      width: 16,
      height: 16,
    });
  } catch (error) {
    return null;
  }
};

function goURL(e) {
  if (e.keyCode == 13) {
    url = $addressbar.val();
    if (url.indexOf('://') === -1) {
      if (url.indexOf('.') !== -1) {
        url = 'http://' + url;
      } else {
        url = 'https://google.com/search?q=' + url;
      }
    }

    SOCIALBROWSER.call('[update-view-url]', {
      url: url,
    });
  }
}

function add_input_menu(node, menu) {
  if (!node) return;

  if (node.nodeName === 'INPUT' || node.contentEditable == true) {
    let text = getSelection().toString();

    menu.append(
      new MenuItem({
        label: 'Undo',
        role: 'undo',
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Redo',
        role: 'redo',
      }),
    );
    menu.append(
      new MenuItem({
        type: 'separator',
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Cut',
        role: 'cut',
        enabled: text.length > 0,
      }),
    );

    menu.append(
      new MenuItem({
        label: 'Copy',
        role: 'copy',
        enabled: text.length > 0,
      }),
    );

    menu.append(
      new MenuItem({
        label: 'Paste',
        role: 'paste',
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Paste and Go',
        click() {
          document.execCommand('paste');
          goURL();
        },
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Delete',
        role: 'delete',
      }),
    );
    menu.append(
      new MenuItem({
        type: 'separator',
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Select All',
        role: 'selectall',
      }),
    );

    menu.append(
      new MenuItem({
        type: 'separator',
      }),
    );

    return;
  }

  add_input_menu(node.parentNode, menu);
}

function createMenu(node) {
  let menu = new Menu();

  if (node.tagName == 'VIDEO') {
    return null;
  }

  if (node.tagName == 'OBJECT') {
    return null;
  }

  if (node.tagName == 'IFRAME') {
    return null;
  }
  if (node.tagName == 'FRAME') {
    return null;
  }

  if (node.tagName == 'WEBVIEW') {
    return null;
  }

  if (node.classList.contains('social-tab')) {
    menu.append(
      new MenuItem({
        label: 'New tab',
        click() {
          sendToMain({ name: '[open new tab]', main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Duplicate tab',
        click() {
          sendToMain({ name: '[open new tab]', duplicate: true, main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Duplicate tab in New Window',
        click() {
          sendToMain({ name: '[open new window]', duplicate: true, main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      }),
    );
    menu.append(
      new MenuItem({
        type: 'separator',
      }),
    );
    menu.append(
      new MenuItem({
        label: 'New Ghost tab',
        click() {
          sendToMain({ name: '[open new ghost tab]', main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Duplicate tab in Ghost tab',
        click() {
          sendToMain({ name: '[open new ghost tab]', duplicate: true, main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      }),
    );
    menu.append(
      new MenuItem({
        type: 'separator',
      }),
    );

    menu.append(
      new MenuItem({
        label: 'New Popup',
        click() {
          sendToMain({ name: '[open new popup]', main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Duplicate tab in Popup',
        click() {
          sendToMain({ name: '[open new popup]', duplicate: true, main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      }),
    );
    menu.append(
      new MenuItem({
        type: 'separator',
      }),
    );
    menu.append(
      new MenuItem({
        label: 'New Ghost Popup',
        click() {
          sendToMain({ name: '[open new ghost popup]', main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Duplicate tab in Ghost Popup',
        click() {
          sendToMain({ name: '[open new ghost popup]', duplicate: true, main_window_id: SOCIALBROWSER.currentWindow.id });
        },
      }),
    );
    menu.append(
      new MenuItem({
        type: 'separator',
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Close',
        click() {
          client.call('remove-tab', node);
        },
      }),
    );
    menu.append(
      new MenuItem({
        label: 'Close other tabs',
        click() {
          document.querySelectorAll('.social-tab').forEach((node2) => {
            if (!node2.classList.contains('plus') && node.getAttribute('win_id') !== node2.getAttribute('win_id')) {
              client.call('remove-tab', node2);
            }
          });
        },
      }),
    );
  }

  // add_input_menu(node, menu);

  if (SOCIALBROWSER.var.core.id.like('*test*')) {
    menu.append(
      new MenuItem({
        type: 'separator',
      }),
    );

    menu.append(
      new MenuItem({
        label: 'inspect Element',
        click() {
          SOCIALBROWSER.currentWindow.webContents.openDevTools({
            mode: 'detach',
          });
          SOCIALBROWSER.currentWindow.webContents.inspectElement(rightClickPosition.x, rightClickPosition.y);
        },
      }),
    );

    menu.append(
      new MenuItem({
        label: 'Developer Tools',
        click() {
          SOCIALBROWSER.currentWindow.webContents.openDevTools({
            mode: 'detach',
          });
        },
      }),
    );
  }

  return menu;
}

// Create Main Context Menu
let rightClickPosition = null;
document.addEventListener('contextmenu', (e) => {
  rightClickPosition = {
    x: e.x,
    y: e.y,
  };

  e.preventDefault();
  e.stopPropagation();

  let node = e.target;

  let m = createMenu(node);

  m.popup(SOCIALBROWSER.currentWindow);
});

document.addEventListener(
  'keydown',
  (e) => {
    //e.preventDefault();
    //e.stopPropagation();

    if (e.keyCode == 123 /*f12*/) {
      SOCIALBROWSER.call('[send-render-message]', {
        name: 'DeveloperTools',
      });
    } else if (e.keyCode == 122 /*f11*/) {
      if (!full_screen) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'full_screen',
        });
        full_screen = true;
      } else {
        SOCIALBROWSER.call('[send-render-message]', {
          name: '!full_screen',
        });
        full_screen = false;
      }
    } else if (e.keyCode == 121 /*f10*/) {
      SOCIALBROWSER.call('[send-render-message]', {
        name: 'service worker',
      });
    } else if (e.keyCode == 117 /*f6*/) {
      SOCIALBROWSER.call('[send-render-message]', {
        name: 'show addressbar',
      });
    } else if (e.keyCode == 70 /*f*/) {
      if (e.ctrlKey == true) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'show in-page-find',
        });
      }
    } else if (e.keyCode == 115 /*f4*/) {
      if (e.ctrlKey == true) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'close tab',
        });
      }
    } else if (e.keyCode == 107 /*+*/) {
      if (e.ctrlKey == true) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'zoom+',
        });
      }
    } else if (e.keyCode == 109 /*-*/) {
      if (e.ctrlKey == true) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'zoom-',
        });
      }
    } else if (e.keyCode == 48 /*0*/) {
      if (e.ctrlKey == true) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'zoom',
        });
      }
    } else if (e.keyCode == 49 /*1*/) {
      if (e.ctrlKey == true) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'audio',
        });
      }
    } else if (e.keyCode == 74 /*j*/) {
      if (e.ctrlKey == true) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'downloads',
        });
      }
    } else if (e.keyCode == 83 /*s*/) {
      if (e.ctrlKey == true) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'download-url',
          url: window.location.href,
        });
      }
    } else if (e.keyCode == 69 && e.ctrlKey == true /*E*/ ) {
      SOCIALBROWSER.call('[send-render-message]', {
        name: 'edit-page',
      });
    } else if (e.keyCode == 27 /*escape*/) {
      SOCIALBROWSER.call('[send-render-message]', {
        name: 'escape',
      });
    } else if (e.keyCode == 78 /*n*/ || e.keyCode == 84 /*t*/) {
      if (e.ctrlKey == true) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: '[open new tab]',
          main_window_id: SOCIALBROWSER.currentWindow.id,
        });
      }
    } else if (e.keyCode == 116 /*f5*/) {
      if (e.ctrlKey === true) {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'force reload',
          origin: document.location.origin || document.location.href,
        });
      } else {
        SOCIALBROWSER.call('[send-render-message]', {
          name: 'reload',
        });
      }
    }

    return false;
  },
  true,
);

function showSettingMenu() {
  let arr = [];

  arr.push({
    label: 'Show Setting',
    click: () =>
      sendToMain({
        name: 'show setting',
      }),
  });
  arr.push({
    type: 'separator',
  });

  arr.push({
    label: 'Open Social Browser Site',
    click: () =>
      sendToMain({
        name: '[open new tab]',
        url: 'https://social-browser.com',
        main_window_id: SOCIALBROWSER.currentWindow.id,
      }),
  });
  arr.push({
    type: 'separator',
  });
  arr.push({
    label: 'Downloads',
    click: () =>
      sendToMain({
        name: '[open new tab]',
        url: 'http://127.0.0.1:60080/downloads',
        main_window_id: SOCIALBROWSER.currentWindow.id,
      }),
  });

  arr.push({
    type: 'separator',
  });
  arr.push({
    label: 'PDF Reader',
    click: () =>
      sendToMain({
        name: 'show-pdf-reader',
      }),
  });
  arr.push({
    type: 'separator',
  });

  let bookmark_arr = [];
  bookmark_arr.push({
    label: 'Bookmark current tab',
    click: () =>
      sendToMain({
        name: 'add_to_bookmark',
      }),
  });
  bookmark_arr.push({
    type: 'separator',
  });

  bookmark_arr.push({
    label: 'Bookmark all tabs',
    click: () =>
      sendToMain({
        name: 'add_all_to_bookmark',
      }),
  });
  bookmark_arr.push({
    type: 'separator',
  });
  bookmark_arr.push({
    label: 'Bookmark manager',
    click: () =>
      sendToMain({
        name: '[open new tab]',
        url: 'http://127.0.0.1:60080/setting?open=bookmarks',
        main_window_id: SOCIALBROWSER.currentWindow.id,
      }),
  });
  bookmark_arr.push({
    type: 'separator',
  });
  SOCIALBROWSER.var.bookmarks.forEach((b) => {
    bookmark_arr.push({
      label: b.title,
      sublabel: b.url,
      icon: SOCIALBROWSER.nativeImage(b.favicon),
      click: () =>
        sendToMain({
          name: '[open new tab]',
          url: b.url,
          main_window_id: SOCIALBROWSER.currentWindow.id,
        }),
    });
  });

  if (SOCIALBROWSER.var.bookmarks.length > 0) {
    bookmark_arr.push({
      type: 'separator',
    });

    bookmark_arr.push({
      label: 'Open all bookmarks',
      visible: SOCIALBROWSER.var.bookmarks.length > 0,
      click: () => {
        SOCIALBROWSER.var.bookmarks.forEach((b) => {
          sendToMain({
            name: '[open new tab]',
            url: b.url,
            main_window_id: SOCIALBROWSER.currentWindow.id,
          });
        });
      },
    });
  }

  let bookmark = new MenuItem({
    label: 'Bookmarks',
    type: 'submenu',
    submenu: bookmark_arr,
  });
  arr.push(bookmark);
  arr.push({
    type: 'separator',
  });
  arr.push({
    label: 'Reload Page',
    accelerator: 'F5',
    click: () =>
      sendToMain({
        name: 'reload',
      }),
  });
  arr.push({
    label: 'Hard Reload Page',
    accelerator: 'CommandOrControl+F5',
    click: () =>
      sendToMain({
        name: 'force reload',
      }),
  });

  arr.push({
    type: 'separator',
  });
  arr.push({
    label: 'Zoom +',
    accelerator: 'CommandOrControl+numadd',
    click: (event) => {
      // console.log(event);
      sendToMain({
        name: 'zoom+',
      });
    },
  });
  arr.push({
    label: 'Zoom',
    accelerator: 'CommandOrControl+0',
    click: () =>
      sendToMain({
        name: 'zoom',
      }),
  });
  arr.push({
    label: 'Zoom -',
    accelerator: 'CommandOrControl+numsub',
    click: () =>
      sendToMain({
        name: 'zoom-',
      }),
  });

  arr.push({
    type: 'separator',
  });
  arr.push({
    label: 'Edit Page Content',
    accelerator: 'CommandOrControl+E',
    click: () =>
      sendToMain({
        name: 'edit-page',
      }),
  });
  arr.push({
    type: 'separator',
  });
  arr.push({
    label: 'Audio ON / OFF',
    accelerator: 'CommandOrControl+1',
    click: () =>
      sendToMain({
        name: 'audio',
      }),
  });

  arr.push({
    type: 'separator',
  });

  arr.push({
    label: 'Developer Tools',
    accelerator: 'F12',
    click: () =>
      sendToMain({
        name: 'Developer Tools',
      }),
  });
  arr.push({
    type: 'separator',
  });
  arr.push({
    label: 'Restart App',
    click: () => SOCIALBROWSER.call('restart-app', {}),
  });
  arr.push({
    label: 'Close App',
    click: () => SOCIALBROWSER.call('close-app', {}),
  });

  const settingMenu = Menu.buildFromTemplate(arr);

  settingMenu.popup();
}

function showBookmarksMenu() {
  let bookmark_arr = [];
  bookmark_arr.push({
    label: 'Bookmark current tab',
    click: () =>
      sendToMain({
        name: 'add_to_bookmark',
      }),
  });
  bookmark_arr.push({
    type: 'separator',
  });

  bookmark_arr.push({
    label: 'Bookmark all tabs',
    click: () =>
      sendToMain({
        name: 'add_all_to_bookmark',
      }),
  });
  bookmark_arr.push({
    type: 'separator',
  });
  bookmark_arr.push({
    label: 'Bookmark manager',
    click: () =>
      sendToMain({
        name: '[open new tab]',
        url: 'http://127.0.0.1:60080/setting?open=bookmarks',
        main_window_id: SOCIALBROWSER.currentWindow.id,
      }),
  });
  bookmark_arr.push({
    type: 'separator',
  });
  SOCIALBROWSER.var.bookmarks.forEach((b) => {
    bookmark_arr.push({
      label: b.title,
      sublabel: b.url,
      icon: SOCIALBROWSER.nativeImage(b.favicon),
      click: () =>
        sendToMain({
          name: '[open new tab]',
          url: b.url,
          main_window_id: SOCIALBROWSER.currentWindow.id,
        }),
    });
  });

  if (SOCIALBROWSER.var.bookmarks.length > 0) {
    bookmark_arr.push({
      type: 'separator',
    });

    bookmark_arr.push({
      label: 'Open all bookmarks',
      visible: SOCIALBROWSER.var.bookmarks.length > 0,
      click: () => {
        SOCIALBROWSER.var.bookmarks.forEach((b) => {
          sendToMain({
            name: '[open new tab]',
            url: b.url,
            main_window_id: SOCIALBROWSER.currentWindow.id,
          });
        });
      },
    });
  }

  let bookmarksMenu = Menu.buildFromTemplate(bookmark_arr);

  bookmarksMenu.popup();
}
SOCIALBROWSER.on('[user-info]', (event, data) => {
  // console.log(data.message, data);
});

SOCIALBROWSER.on('[send-render-message]', (event, data) => {
  renderMessage(data);
});



socialTabs.init(socialTabsDom, {
  tabOverlapDistance: 14,
  minWidth: 35,
  maxWidth: 270,
});

let $addressbar = $('.address-input .url');
$addressbar.focus(() => {
  if ($addressbar.val().like('*...*') || !$addressbar.val().like('http*')) {
    $addressbar.val($('#' + currentTabId).attr('url'));
  }
});

function setURL(value) {
  if (!$addressbar.is(':focus')) {
    $addressbar.val(value.replace('http://' , '').replace('https://' , ''));
  }
}

function showAddressBar() {
  $('.social-address-bar').show();
}

function hideAddressBar() {
  $('.social-address-bar').hide();
}

function showSocialTabs() {
  $('.social-tabs').show();
  $('.social-address-bar').show();
}

function hideSocialTabs() {
  $('.social-tabs').hide();
  $('.social-address-bar').hide();
}

function handleURL(u) {
  if (u.indexOf('://') !== -1) {
    return u;
  }

  if (u.indexOf('.') !== -1) {
    u = 'http://' + u;
  } else {
    u = 'https://google.com/search?q=' + u;
  }

  return u;
}

function showURL(u) {
  u = u || $('#' + currentTabId).attr('url');
  SOCIALBROWSER.call('[send-render-message]', {
    name: 'show addressbar',
    url: u,
  });
}

$('.social-close').click(() => {
  ExitSocialWindow();
});
$('.social-maxmize').click(() => {
  SOCIALBROWSER.call('[browser-message]', { name: 'maxmize' });
});
$('.social-minmize').click(() => {
  SOCIALBROWSER.call('[browser-message]', { name: 'minmize' });
});

socialTabsDom.addEventListener('activeTabChange', ({ detail }) => {
  currentTabId = detail.tabEl.id;

  SOCIALBROWSER.call('[show-view]', {
    x: 0,
    y: 0,
    width: document.width,
    height: document.height,
    tab_id: currentTabId,
    main_window_id: SOCIALBROWSER.currentWindow.id,
  });

  $('#user_name').html($('#' + currentTabId).attr('user_name'));

  if (!$('#' + currentTabId).attr('forward')) {
    $('.go-forward i').css('color', '#9E9E9E');
  } else {
    $('.go-forward i').css('color', '#4caf50');
  }
  if (!$('#' + currentTabId).attr('back')) {
    $('.go-back i').css('color', '#9E9E9E');
  } else {
    $('.go-back i').css('color', '#4caf50');
  }

  if ($('#' + currentTabId).attr('webaudio') == 'true') {
    $('.Page-audio i').css('color', '#4caf50');
  } else {
    $('.Page-audio i').css('color', '#f44336');
  }

  if ($('#' + currentTabId).attr('url')) {
    $('.address-input .http').css('display', 'none');
    $('.address-input .https').css('display', 'none');
    $('.address-input .file').css('display', 'none');
    $('.address-input .ftp').css('display', 'none');
    $('.address-input .browser').css('display', 'none');

    $('.address-input .https').html('');
    $('.address-input .http').html('');
    $('.address-input .file').html('');
    $('.address-input .ftp').html('');
    $('.address-input .browser').html('');

    if (
      $('#' + currentTabId)
        .attr('url')
        .like('http://127.0.0.1:60080*')
    ) {
      $('.address-input .protocol').html('');
      setURL('');
    } else {
      let protocol = '';
      let url = '';
      if (
        $('#' + currentTabId)
          .attr('url')
          .like('https*')
      ) {
        protocol = 'HTTPS';
        $('.address-input .https').html(protocol);
        $('.address-input .https').css('display', 'inline-block');
      } else if (
        $('#' + currentTabId)
          .attr('url')
          .like('http*')
      ) {
        protocol = 'http';
        $('.address-input .http').html(protocol);
        $('.address-input .http').css('display', 'inline-block');
      } else if (
        $('#' + currentTabId)
          .attr('url')
          .like('ftp*')
      ) {
        protocol = 'ftp';
        $('.address-input .ftp').html(protocol);
        $('.address-input .ftp').css('display', 'inline-block');
      } else if (
        $('#' + currentTabId)
          .attr('url')
          .like('file*')
      ) {
        protocol = 'file';
        $('.address-input .file').html(protocol);
        $('.address-input .file').css('display', 'inline-block');
      } else if (
        $('#' + currentTabId)
          .attr('url')
          .like('browser*')
      ) {
        protocol = 'browser';
        $('.address-input .browser').html(protocol);
        $('.address-input .browser').css('display', 'inline-block');
      }

      if (protocol) {
        url = $('#' + currentTabId)
          .attr('url')
          .replace(protocol + '://', '');
      } else {
        url = $('#' + currentTabId).attr('url');
      }

      $('.address-input .protocol').html(protocol);
      let w = document.querySelectorAll('.address-input')[0].clientWidth / 13;
      if (url.length > w) {
        setURL(url.substring(0, w) + ' ...');
      } else {
        setURL(url);
      }
    }
  }
});

socialTabsDom.addEventListener('tabAdd', ({ detail }) => {
  currentTabId = detail.tabEl.id;
  if (currentTabId && currentTabId != null && currentTabId.length > 0) {
    opendTabList.push({
      id: currentTabId,
    });

    const $id = $('#' + currentTabId);
    SOCIALBROWSER.call('[create-new-view]', {
      x: window.screenLeft,
      y: window.screenTop + 70,
      width: document.width,
      height: document.height,
      tab_id: currentTabId,
      url: $id.attr('url'),
      partition: $id.attr('partition'),
      user_name: $id.attr('user_name'),
      user_agent: $id.attr('user_agent'),
      proxy: $id.attr('proxy') == 'undefined' ? null : $id.attr('proxy'),
      webaudio: $id.attr('webaudio') == 'false' ? false : true,
      main_window_id: SOCIALBROWSER.currentWindow.id,
    });

    if (!$id.attr('url') || $id.attr('url').like('*newTab')) {
    }
  }
});

socialTabsDom.addEventListener('tabRemove', ({ detail }) => {
  currentTabId = detail.id;

  SOCIALBROWSER.call('[close-view]', {
    tab_id: detail.id,
  });
});

function render_new_tab(op) {
  console.log('render_new_tab', op);

  if (typeof op === 'string') {
    op = op.split('...').join('\\');
    op = {
      url: op,
    };
  }

  if (op.url && !op.url.like('http*') && !op.url.like('browser*') && !op.url.like('file*')) {
    op.url = 'http://' + op.url;
  }

  op = Object.assign(
    {
      url: '',
      title: 'New Tab',
    },
    op,
  );

  let tab = {
    id: 'tab_' + new Date().getTime(),
    url: op.url,
    title: op.title,
    partition: op.partition,
    user_name: op.user_name,
    user_agent: op.user_agent,
    proxy: op.proxy,
    webaudio: op.webaudio,
    favicon: 'http://127.0.0.1:60080/images/loading-white.gif',
    active: op.active,
    main_window_id: SOCIALBROWSER.currentWindow.id,
  };
  socialTabs.addTab(tab);
  // console.log(tab);
}

function renderMessage(cm) {
  if (!cm) {
    return;
  }

  if (cm.name == '[open new tab]') {
    render_new_tab(cm);
  } else if (cm.name == '[remove-tab]') {
    socialTabs.removeTab(socialTabs.removeTab(socialTabsDom.querySelector('#' + cm.tab_id)));
  } else if (cm.name == 'set-setting') {
    for (let k of Object.keys(cm.var)) {
      SOCIALBROWSER.var[k] = cm.var[k];
    }
  } else if (cm.name == 'show setting') {
    render_new_tab({
      url: 'http://127.0.0.1:60080/setting',
    });
  } else if (cm.name == 'download-url') {
    SOCIALBROWSER.call('download-url', cm.url);
  } else if (cm.name == 'downloads') {
    showDownloads();
  } else if (cm.name == 'escape') {
    is_addressbar_busy = false;
  } else if (cm.name == 'close tab') {
    closeCurrentTab();
  } else if (cm.name == '[update-tab-properties]') {
    console.log(cm);
    if (cm.tab_id && cm.url) {
      $('#' + cm.tab_id).attr('url', cm.url);
    }
    if (cm.tab_id && cm.icon) {
      $('#' + cm.tab_id + ' .social-tab-favicon').css('background-image', 'url(' + cm.icon + ')');
    }
    if (cm.user_name) {
      $('#' + cm.tab_id).attr('user_name', cm.user_name);
    }

    if (cm.win_id) {
      $('#' + cm.tab_id).attr('win_id', cm.win_id);
    }

    if (cm.child_id) {
      $('#' + cm.tab_id).attr('child_id', cm.child_id);
    }
    if (cm.main_window_id) {
      $('#' + cm.tab_id).attr('main_window_id', cm.main_window_id);
    }

    if (cm.forward) {
      $('#' + cm.tab_id).attr('forward', cm.forward);
    }
    if (cm.back) {
      $('#' + cm.tab_id).attr('back', cm.back);
    }
    if (cm.webaudio) {
      $('#' + cm.tab_id).attr('webaudio', cm.webaudio);
    }

    if (cm.title) {
      $('#' + cm.tab_id + ' .social-tab-title p').text(cm.title);
      $('#' + cm.tab_id).attr('title', cm.title);
      if (cm.title.test(/^[a-zA-Z\-\u0590-\u05FF\0-9\^@_:\?\[\]~<>\{\}\|\\ ]+$/)) {
        document.querySelector('#' + cm.tab_id + ' .social-tab-title p').style.direction = 'ltr';
      } else {
        document.querySelector('#' + cm.tab_id + ' .social-tab-title p').style.direction = 'rtl';
      }
    }

    if (cm.tab_id && cm.tab_id == currentTabId && cm.url) {
      if (!cm.forward) {
        $('.go-forward i').css('color', '#9E9E9E');
      } else {
        $('.go-forward i').css('color', '#4caf50');
      }
      if (!cm.back) {
        $('.go-back i').css('color', '#9E9E9E');
      } else {
        $('.go-back i').css('color', '#4caf50');
      }

      if (cm.webaudio) {
        $('.Page-audio i').css('color', '#4caf50');
      } else {
        $('.Page-audio i').css('color', '#f44336');
      }

      $('.address-input .http').css('display', 'none');
      $('.address-input .https').css('display', 'none');
      $('.address-input .file').css('display', 'none');
      $('.address-input .ftp').css('display', 'none');
      $('.address-input .browser').css('display', 'none');

      $('.address-input .https').html('');
      $('.address-input .http').html('');
      $('.address-input .file').html('');
      $('.address-input .ftp').html('');
      $('.address-input .browser').html('');

      if (cm.url.like('http://127.0.0.1:60080*')) {
        $('.address-input .protocol').html('');
        setURL('');
      } else {
        let protocol = '';
        let url = '';
        if (cm.url.like('https*')) {
          protocol = 'HTTPS';
          // var parser = document.createElement('a')
          // parser.href = cm.url;
          $('.address-input .https').html(protocol);
          $('.address-input .https').css('display', 'inline-block');
        } else if (cm.url.like('http*')) {
          protocol = 'http';
          $('.address-input .http').html(protocol);
          $('.address-input .http').css('display', 'inline-block');
        } else if (cm.url.like('ftp*')) {
          protocol = 'ftp';
          $('.address-input .ftp').html(protocol);
          $('.address-input .ftp').css('display', 'inline-block');
        } else if (cm.url.like('file*')) {
          protocol = 'file';
          $('.address-input .file').html(protocol);
          $('.address-input .file').css('display', 'inline-block');
        } else if (cm.url.like('browser*')) {
          protocol = 'browser';
          $('.address-input .browser').html(protocol);
          $('.address-input .browser').css('display', 'inline-block');
        }

        if (protocol) {
          url = cm.url.replace(protocol + '://', '');
        } else {
          url = cm.url;
        }

        $('.address-input .protocol').html(protocol);
        let w = document.querySelectorAll('.address-input')[0].clientWidth / 13;
        if (url.length > w) {
          setURL(url.substring(0, w) + ' ...');
        } else {
          setURL(url);
        }
      }
    }
  } else if (cm.name == 'mini_iframe') {
    playMiniIframe(cm);
  } else if (cm.name == 'alert') {
    showMessage(cm.message, cm.time);
  } else if (cm.name == 'mini_youtube') {
    playMiniYoutube(cm);
  } else if (cm.name == 'new_trusted_window') {
    playTrustedWindow(cm);
  } else if (cm.name == 'new_popup') {
    playWindow(cm);
  } else if (cm.name == 'mini_video') {
    playMiniVideo(cm);
  }
}

function playMiniVideo(cm) {
  return SOCIALBROWSER.call('new-video-window', cm);
}

function playMiniYoutube(cm) {
  return SOCIALBROWSER.call('new-youtube-window', cm);
}

function playTrustedWindow(cm) {
  return SOCIALBROWSER.call('new-trusted-window', cm);
}

function playWindow(cm) {
  return SOCIALBROWSER.call('new-window', cm);
}

function playMiniIframe(cm) {
  return SOCIALBROWSER.call('new-iframe-window', cm);
}

function closeCurrentTab() {
  socialTabs.removeTab(socialTabsDom.querySelector('.social-tab-current'));
}

function closeTab(id) {
  socialTabs.removeTab(socialTabsDom.querySelector('#' + id));
}

function ExitSocialWindow(noTabs = false) {
  if (noTabs) {
    SOCIALBROWSER.call('[browser-message]', { name: 'close', win_id: SOCIALBROWSER.currentWindow.id });
    return;
  }
  $('.address-input .http').css('display', 'none');
  $('.address-input .https').css('display', 'none');
  $('.address-input .file').css('display', 'none');
  $('.address-input .ftp').css('display', 'none');
  $('.address-input .browser').css('display', 'none');

  $('.address-input .https').html('');
  $('.address-input .http').html('');
  $('.address-input .file').html('');
  $('.address-input .ftp').html('');
  $('.address-input .browser').html('');
  setURL('');

  opendTabList.forEach((t, i) => {
    closeTab(t.id);
  });

  setTimeout(() => {
    SOCIALBROWSER.call('[browser-message]', { name: 'close', win_id: SOCIALBROWSER.currentWindow.id });
  }, 250);
}

function showDownloads() {
  render_new_tab({
    url: 'http://127.0.0.1:60080/downloads',
  });
}

function init_tab() {
  render_new_tab(SOCIALBROWSER.newTabdata);
}

window.addEventListener('resize', () => {
  let url = $('#' + currentTabId).attr('url') || '';
  let w = document.querySelectorAll('.address-input')[0].clientWidth / 13;
  if (url.length > w) {
    setURL(url.substring(0, w) + ' ...');
  } else {
    setURL(url);
  }
});

SOCIALBROWSER.on('show-tab-view', (data) => {
  if (data.win_id == SOCIALBROWSER.currentWindow.id) {
    $('#' + currentTabId).click();
  }
});

SOCIALBROWSER.currentWindow.maximize();
SOCIALBROWSER.currentWindow.show();

document.querySelector('#img').addEventListener('click', () => {
  $('#' + currentTabId).click();
});

SOCIALBROWSER.invoke('[browser][data]', {
  host: document.location.host,
  url: document.location.href,
  name: '*',
  win_id: SOCIALBROWSER.currentWindow.id,
  partition: SOCIALBROWSER.partition,
}).then((result) => {
  SOCIALBROWSER.var = result.var;
  SOCIALBROWSER.files_dir = result.files_dir;
  SOCIALBROWSER.dir = result.dir;
  SOCIALBROWSER.newTabdata = result.newTabdata;
 // window.$ = window.jQuery = require(SOCIALBROWSER.files_dir + '/js/jquery.js');
  init_tab();
});
