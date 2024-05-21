var socialTabsDom = document.querySelector('.social-tabs');
var socialTabs = new SocialTabs();
var currentTabId = null;
var opendTabList = [];
let $addressbar = $('.address-input .url');

const updateOnlineStatus = () => {
  // console.log('Internet Status ' + navigator.onLine);
  SOCIALBROWSER.ipc('online-status', navigator.onLine ? { status: true } : { status: false });
};



window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

const { nativeImage } = SOCIALBROWSER.electron;
const { Menu, MenuItem } = SOCIALBROWSER.remote;

function ipc(name, obj) {
  obj = obj || {};
  obj.tabID = obj.tabID || currentTabId;
  obj.url = $('#' + obj.tabID).attr('url');
  obj.title = $('#' + obj.tabID).attr('title');
  obj.icon = $('#' + obj.tabID).attr('icon');
  obj.windowID = $('#' + obj.tabID).attr('windowID');
  obj.childID = $('#' + obj.tabID).attr('childProcessID');
  obj.mainWindowID = $('#' + obj.tabID).attr('main_window_id');
  obj.windowID = obj.windowID || SOCIALBROWSER.remote.getCurrentWindow().id;

  SOCIALBROWSER.ipc(name, obj);
}

function sendToMain(obj) {
  obj = obj || {};
  obj.tabID = currentTabId;
  obj.windowID = $('#' + currentTabId).attr('windowID');
  obj.childID = $('#' + currentTabId).attr('childProcessID');
  obj.mainWindowID = $('#' + currentTabId).attr('main_window_id');
  obj.windowID = obj.windowID || SOCIALBROWSER.remote.getCurrentWindow().id;

  SOCIALBROWSER.ipc('[send-render-message]', obj);
}

function goURL(e) {
  if (e.keyCode == 13) {
    url = $addressbar.text();
    if (url.indexOf('://') === -1) {
      if (url.indexOf('.') !== -1) {
        url = 'http://' + url;
      } else {
        url = 'https://google.com/search?q=' + url;
      }
    }

    ipc('[update-view-url]', {
      url: url,
    });
  }
}


document.addEventListener(
  'keydown',
  (e) => {
    //e.preventDefault();
    //e.stopPropagation();

    if (e.keyCode == 123 /*f12*/) {
      sendToMain({
        name: 'DeveloperTools',
        action: true,
      });
    } else if (e.keyCode == 122 /*f11*/) {
      if (!full_screen) {
        sendToMain({
          name: 'full_screen',
          action: true,
        });
        full_screen = true;
      } else {
        sendToMain({
          name: '!full_screen',
          action: true,
        });
        full_screen = false;
      }
    } else if (e.keyCode == 121 /*f10*/) {
      sendToMain({
        name: 'service worker',
      });
    } else if (e.keyCode == 117 /*f6*/) {
      ipc('[show-addressbar]');
    } else if (e.keyCode == 70 /*f*/) {
      if (e.ctrlKey == true) {
        sendToMain({
          name: 'show in-page-find',
          action: true,
        });
      }
    } else if (e.keyCode == 115 /*f4*/) {
      if (e.ctrlKey == true) {
        sendToMain({
          name: 'close tab',
        });
      }
    } else if (e.keyCode == 107 /*+*/) {
      if (e.ctrlKey == true) {
        ipc('[window-zoom+]');
      }
    } else if (e.keyCode == 109 /*-*/) {
      if (e.ctrlKey == true) {
        ipc('[window-zoom-]');
      }
    } else if (e.keyCode == 48 /*0*/) {
      if (e.ctrlKey == true) {
        ipc('[window-zoom]');
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
    } else if (e.keyCode == 69 && e.ctrlKey == true /*E*/) {
      ipc('[edit-window]');
    } else if (e.keyCode == 27 /*escape*/) {
      sendToMain({
        name: 'escape',
      });
    } else if (e.keyCode == 78 /*n*/ || e.keyCode == 84 /*t*/) {
      if (e.ctrlKey == true) {
        ipc('[open new tab]', {
          main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
        });
      }
    } else if (e.keyCode == 116 /*f5*/) {
      if (e.ctrlKey === true) {
        ipc('[window-reload-hard]', {
          origin: new URL($('#' + currentTabId).attr('url')).origin,
        });
      } else {
        ipc('[window-reload]', {
          action: true,
        });
      }
    }

    return false;
  },
  true
);

function showSettingMenu() {
  SOCIALBROWSER.currentWindow.show();
  SOCIALBROWSER.menuList = [];

  SOCIALBROWSER.menuList.push({
    label: 'Show Setting',
    click: () =>
      ipc('[open new tab]', {
        url: 'http://127.0.0.1:60080/setting',
        partition : 'persist:setting',
        main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
        vip: true,
      }),
  });

  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });

  if (SOCIALBROWSER.var.core.id.like('*developer*')) {
    SOCIALBROWSER.menuList.push({
      label: 'Check Update',
      click: () =>
        sendToMain({
          name: '[run-window-update]',
        }),
    });
    SOCIALBROWSER.menuList.push({
      type: 'separator',
    });
  }

  SOCIALBROWSER.menuList.push({
    label: 'Open Social Browser Site',
    click: () =>
      ipc('[open new tab]', {
        url: 'https://social-browser.com',
        main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
      }),
  });
  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });
  SOCIALBROWSER.menuList.push({
    label: 'Downloads',
    click: () =>
      ipc('[open new tab]', {
        url: 'http://127.0.0.1:60080/downloads',
        main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
        vip: true,
      }),
  });

  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });

  let arr2 = [];

  arr2.push({
    label: 'Bookmark current tab',
    click: () => ipc('[add-to-bookmark]'),
  });

  arr2.push({
    type: 'separator',
  });

  arr2.push({
    label: 'Bookmark all tabs',
    click: () => {
      document.querySelectorAll('.social-tab:not(#tabPlus)').forEach((el) => {
        ipc('[add-to-bookmark]', { tabID: el.id });
      });
    },
  });
  arr2.push({
    type: 'separator',
  });
  arr2.push({
    label: 'Bookmark manager',
    click: () =>
      ipc('[open new tab]', {
        url: 'http://127.0.0.1:60080/setting?open=bookmarks',
        partition : 'persist:setting',
        main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
        vip: true,
      }),
  });
  arr2.push({
    type: 'separator',
  });
  SOCIALBROWSER.var.bookmarks.forEach((b) => {
    arr2.push({
      label: b.title,
      sublabel: b.url,
      icon: SOCIALBROWSER.nativeImage(b.favicon),
      click: () =>
        ipc('[open new tab]', {
          url: b.url,
        }),
    });
  });

  if (SOCIALBROWSER.var.bookmarks.length > 0) {
    arr2.push({
      type: 'separator',
    });

    arr2.push({
      label: 'Open all bookmarks',
      visible: SOCIALBROWSER.var.bookmarks.length > 0,
      click: () => {
        SOCIALBROWSER.var.bookmarks.forEach((b) => {
          ipc('[open new tab]', {
            url: b.url,
            main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
          });
        });
      },
    });
  }

  let bookmark = {
    label: 'Bookmarks',
    type: 'submenu',
    submenu: arr2,
  };

  SOCIALBROWSER.menuList.push(bookmark);
  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });
  SOCIALBROWSER.menuList.push({
    label: 'Reload Page',
    accelerator: 'F5',
    click: () =>
      ipc('[window-reload]', {
        action: true,
      }),
  });
  SOCIALBROWSER.menuList.push({
    label: 'Hard Reload Page',
    accelerator: 'CommandOrControl+F5',
    click: () =>
      ipc('[window-reload-hard]', {
        origin: new URL($('#' + currentTabId).attr('url')).origin,
      }),
  });

  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });
  SOCIALBROWSER.menuList.push({
    label: 'Zoom +',
    accelerator: 'CommandOrControl+numadd',
    click: () => {
      ipc('[window-zoom+]');
    },
  });
  SOCIALBROWSER.menuList.push({
    label: 'Zoom OFF',
    accelerator: 'CommandOrControl+0',
    click: () => ipc('[window-zoom]'),
  });
  SOCIALBROWSER.menuList.push({
    label: 'Zoom -',
    accelerator: 'CommandOrControl+numsub',
    click: () => ipc('[window-zoom-]'),
  });

  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });
  SOCIALBROWSER.menuList.push({
    label: 'Edit Page Content',
    accelerator: 'CommandOrControl+E',
    click: () => ipc('[edit-window]'),
  });
  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });
  SOCIALBROWSER.menuList.push({
    label: 'Audio ON / OFF',
    accelerator: 'CommandOrControl+1',
    click: () => ipc('[toggle-window-audio]'),
  });

  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });

  SOCIALBROWSER.menuList.push({
    label: 'Developer Tools',
    accelerator: 'F12',
    click: () => ipc('[show-window-dev-tools]'),
  });

  SOCIALBROWSER.ipc('[show-menu]', {
    list: SOCIALBROWSER.menuList.map((m) => ({
      label: m.label,
      sublabel: m.sublabel,
      visible: m.visible,
      type: m.type,
      submenu: m.submenu?.map((s) => ({ label: s.label, type: s.type, sublabel: s.sublabel, visible: s.visible })),
    })),
    windowID: SOCIALBROWSER.remote.getCurrentWindow().id,
  });
}

function showBookmarksMenu() {
  SOCIALBROWSER.currentWindow.show();
  SOCIALBROWSER.menuList = [];
  SOCIALBROWSER.menuList.push({
    label: 'Bookmark current tab',
    click: () => ipc('[add-to-bookmark]'),
  });
  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });

  SOCIALBROWSER.menuList.push({
    label: 'Bookmark all tabs',
    click: () => {
      document.querySelectorAll('.social-tab:not(#tabPlus)').forEach((el) => {
        ipc('[add-to-bookmark]', { tabID: el.id });
      });
    },
  });
  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });
  SOCIALBROWSER.menuList.push({
    label: 'Bookmark manager',
    click: () =>
      ipc('[open new tab]', {
        url: 'http://127.0.0.1:60080/setting?open=bookmarks',
        partition : 'persist:setting',
        main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
        vip: true,
      }),
  });
  SOCIALBROWSER.menuList.push({
    type: 'separator',
  });
  SOCIALBROWSER.var.bookmarks.forEach((b) => {
    SOCIALBROWSER.menuList.push({
      label: b.title,
      sublabel: b.url,
      icon: SOCIALBROWSER.nativeImage(b.favicon),
      click: () =>
        ipc('[open new tab]', {
          url: b.url,
        }),
    });
  });

  if (SOCIALBROWSER.var.bookmarks.length > 0) {
    SOCIALBROWSER.menuList.push({
      type: 'separator',
    });

    SOCIALBROWSER.menuList.push({
      label: 'Open all bookmarks',
      visible: SOCIALBROWSER.var.bookmarks.length > 0,
      click: () => {
        SOCIALBROWSER.var.bookmarks.forEach((b) => {
          ipc('[open new tab]', {
            url: b.url,
            main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
          });
        });
      },
    });
  }

  SOCIALBROWSER.ipc('[show-menu]', {
    list: SOCIALBROWSER.menuList.map((m) => ({
      label: m.label,
      sublabel: m.sublabel,
      visible: m.visible,
      type: m.type,
      submenu: m.submenu?.map((s) => ({ label: s.label, type: s.type, sublabel: s.sublabel, visible: s.visible })),
    })),
    windowID: SOCIALBROWSER.remote.getCurrentWindow().id,
  });
}

socialTabs.init(socialTabsDom, {
  tabOverlapDistance: 14,
  minWidth: 35,
  maxWidth: 270,
});

function setURL(url, url2) {
  /*!$addressbar.is(':focus')*/
  if (url) {
    try {
      url = decodeURI(url);
    } catch (error) {
      console.log(error, url);
    }
    $addressbar.text(url.replace('http://', '').replace('https://', ''));
    $addressbar.attr('title', url2);
  } else {
    $addressbar.text('');
    $addressbar.attr('title', '');
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
  socialTabs.layoutTabs();
  socialTabs.fixZIndexes();
  socialTabs.setupDraggabilly();
}

function hideSocialTabs() {
  $('.social-tabs').hide();
  $('.social-address-bar').hide();
  socialTabs.layoutTabs();
  socialTabs.fixZIndexes();
  socialTabs.setupDraggabilly();
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
  ipc('[show-addressbar]', {
    url: u,
  });
}

$('.social-close').click(() => {
  ExitSocialWindow();
});
$('.social-maxmize').click(() => {
  SOCIALBROWSER.ipc('[browser-message]', { name: 'maxmize', windowID: SOCIALBROWSER.remote.getCurrentWindow().id });
});
$('.social-minmize').click(() => {
  SOCIALBROWSER.ipc('[browser-message]', { name: 'minmize', windowID: SOCIALBROWSER.remote.getCurrentWindow().id });
});

socialTabsDom.addEventListener('activeTabChange', ({ detail }) => {
  currentTabId = detail.tabEl.id;

  SOCIALBROWSER.ipc('[show-view]', {
    x: 0,
    y: 0,
    width: document.width,
    height: document.height,
    tabID: currentTabId,
    main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
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
        .like('http://127.0.0.1:60080*|browser*')
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
      handleUrlText();
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
    SOCIALBROWSER.ipc('[create-new-view]', {
      ...detail.tabProperties,
      x: window.screenLeft,
      y: window.screenTop + 70,
      width: document.width,
      height: document.height,
      tabID: currentTabId,
      main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
    });

    if (!$id.attr('url') || $id.attr('url').like('*newTab')) {
    }
  }
});

socialTabsDom.addEventListener('tabRemove', ({ detail }) => {
  currentTabId = detail.id;

  SOCIALBROWSER.ipc('[close-view]', {
    tabID: detail.id,
  });
});

function render_new_tab(op) {
  if (!op) {
    return;
  }

  if (typeof op === 'string') {
    op = op.split('...').join('\\');
    op = {
      url: op,
    };
  }

  if (op.url && !op.url.like('http*') && !op.url.like('browser*') && !op.url.like('file*')) {
    op.url = 'http://' + op.url;
  }

  op = {
    url: '',
    title: null,
    ...op,
  };

  let tab = {
    ...op,
    id: 'tab_' + new Date().getTime(),
    title: op.title || op.url,
    user_name: op.user_name || op.partition,
    favicon: 'browser://images/loading-white.gif',
    main_window_id: SOCIALBROWSER.remote.getCurrentWindow().id,
  };
  socialTabs.addTab(tab);
  // console.log(tab);
}

SOCIALBROWSER.on('[open new tab]', (event, data) => {
  render_new_tab(data);
});
SOCIALBROWSER.on('[send-render-message]', (event, data) => {
  renderMessage(data);
});
SOCIALBROWSER.on('[update-tab-properties]', (event, data) => {
  if (data.tabID && data.url) {
    $('#' + data.tabID).attr('url', data.url);
  }
  if (data.tabID && data.icon) {
    $('#' + data.tabID).attr('icon', data.icon);
    $('#' + data.tabID + ' .social-tab-favicon').css('background-image', 'url(' + data.icon + ')');
  }
  if (data.user_name) {
    $('#' + data.tabID).attr('user_name', data.user_name);
  }

  if (data.windowID) {
    $('#' + data.tabID).attr('windowID', data.windowID);
  }

  if (data.childProcessID) {
    $('#' + data.tabID).attr('childProcessID', data.childProcessID);
  }
  if (data.main_window_id) {
    $('#' + data.tabID).attr('main_window_id', data.main_window_id);
  }

  if (data.forward) {
    $('#' + data.tabID).attr('forward', data.forward);
  }
  if (data.back) {
    $('#' + data.tabID).attr('back', data.back);
  }
  if (data.webaudio) {
    $('#' + data.tabID).attr('webaudio', data.webaudio);
  }

  if (data.title) {
    $('#' + data.tabID + ' .social-tab-title p').text(data.title);
    $('#' + data.tabID).attr('title', data.title);
    let p = document.querySelector('#' + data.tabID + ' .social-tab-title p');
    if (p) {
      if (data.title.test(/^[a-zA-Z\-\u0590-\u05FF\0-9\^@_:\?\[\]~<>\{\}\|\\ ]+$/)) {
        p.style.direction = 'ltr';
      } else {
        p.style.direction = 'rtl';
      }
    }
  }

  if (data.tabID && data.tabID == currentTabId && data.url) {
    if (!data.forward) {
      $('.go-forward i').css('color', '#9E9E9E');
    } else {
      $('.go-forward i').css('color', '#4caf50');
    }
    if (!data.back) {
      $('.go-back i').css('color', '#9E9E9E');
    } else {
      $('.go-back i').css('color', '#4caf50');
    }

    if (data.webaudio) {
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

    if (data.url.like('http://127.0.0.1:60080*|browser*')) {
      $('.address-input .protocol').html('');
      setURL('');
    } else {
      let protocol = '';
      let url = '';
      try {
        data.url = decodeURI(data.url);
      } catch (error) {
        console.log(error, data.url);
      }
      if (data.url.like('https*')) {
        protocol = 'HTTPS';
        // var parser = document.createElement('a')
        // parser.href = data.url;
        $('.address-input .https').html(protocol);
        $('.address-input .https').css('display', 'inline-block');
      } else if (data.url.like('http*')) {
        protocol = 'http';
        $('.address-input .http').html(protocol);
        $('.address-input .http').css('display', 'inline-block');
      } else if (data.url.like('ftp*')) {
        protocol = 'ftp';
        $('.address-input .ftp').html(protocol);
        $('.address-input .ftp').css('display', 'inline-block');
      } else if (data.url.like('file*')) {
        protocol = 'file';
        $('.address-input .file').html(protocol);
        $('.address-input .file').css('display', 'inline-block');
      } else if (data.url.like('browser*')) {
        protocol = 'browser';
        $('.address-input .browser').html(protocol);
        $('.address-input .browser').css('display', 'inline-block');
      }

      if (protocol) {
        url = data.url.replace(protocol + '://', '');
      } else {
        url = data.url;
      }

      $('.address-input .protocol').html(protocol);
      handleUrlText();
    }
  }
});
function renderMessage(cm) {
  if (!cm) {
    return;
  } else if (cm.name == '[remove-tab]') {
    socialTabs.removeTab(socialTabs.removeTab(socialTabsDom.querySelector('#' + cm.tabID)));
  } else if (cm.name == 'set-setting') {
    for (let k of Object.keys(cm.var)) {
      SOCIALBROWSER.var[k] = cm.var[k];
    }
  } else if (cm.name == '[show-browser-setting]') {
    render_new_tab({
      url: 'http://127.0.0.1:60080/setting',
      partition : 'persist:setting',
      vip: true,
    });
  } else if (cm.name == '[download-link]') {
    SOCIALBROWSER.ipc('[download-link]', cm.url);
  } else if (cm.name == 'downloads') {
    showDownloads();
  } else if (cm.name == 'escape') {
    is_addressbar_busy = false;
  } else if (cm.name == 'close tab') {
    closeCurrentTab();
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
  return SOCIALBROWSER.ipc('new-video-window', cm);
}

function playMiniYoutube(cm) {
  return SOCIALBROWSER.ipc('new-youtube-window', cm);
}

function playTrustedWindow(cm) {
  return SOCIALBROWSER.ipc('new-trusted-window', cm);
}

function playWindow(cm) {
  return SOCIALBROWSER.ipc('new-window', cm);
}

function playMiniIframe(cm) {
  return SOCIALBROWSER.ipc('new-iframe-window', cm);
}

function closeCurrentTab() {
  socialTabs.removeTab(socialTabsDom.querySelector('.social-tab-current'));
}

function closeTab(id) {
  socialTabs.removeTab(socialTabsDom.querySelector('#' + id));
}

function ExitSocialWindow(noTabs = false) {
  if (noTabs) {
    SOCIALBROWSER.ipc('[browser-message]', { name: 'close', windowID: SOCIALBROWSER.remote.getCurrentWindow().id });
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
    SOCIALBROWSER.ipc('[browser-message]', { name: 'close', windowID: SOCIALBROWSER.remote.getCurrentWindow().id });
  }, 250);
}

function showDownloads() {
  render_new_tab({
    url: 'http://127.0.0.1:60080/downloads',
    vip: true,
  });
}

function init_tab() {
  render_new_tab(SOCIALBROWSER.newTabData);
}

function handleUrlText() {
  let url = $('#' + currentTabId).attr('url') || '';
  try {
    url = decodeURI(url);
  } catch (error) {
    console.log(error, url);
  }
  let w = document.querySelectorAll('.address-input')[0].clientWidth / 11;
  if (url.length > w) {
    setURL(url.substring(0, w) + ' ...', url);
  } else {
    setURL(url, url);
  }
}

window.addEventListener('resize', () => {
  handleUrlText();
});

SOCIALBROWSER.on('show-tab-view', (data) => {
  if (data.windowID == SOCIALBROWSER.remote.getCurrentWindow().id) {
    $('#' + currentTabId).click();
  }
});

SOCIALBROWSER.currentWindow.maximize();
SOCIALBROWSER.currentWindow.show();

SOCIALBROWSER.tabBusy = false;
SOCIALBROWSER.clickCurrentTab = function () {
  if (!SOCIALBROWSER.tabBusy) {
    SOCIALBROWSER.tabBusy = true;
    $('#' + currentTabId).click();
    setTimeout(() => {
      SOCIALBROWSER.tabBusy = false;
    }, 500);
  }
};
document.querySelector('#body').addEventListener('click', () => {
  SOCIALBROWSER.clickCurrentTab();
});
document.querySelector('#body').addEventListener('mouseover', () => {
  SOCIALBROWSER.clickCurrentTab();
});
document.querySelector('#body').addEventListener('mousemove', () => {
  SOCIALBROWSER.clickCurrentTab();
});

if (SOCIALBROWSER.var.core.id.like('*developer*')) {
  SOCIALBROWSER.menu_list.push({
    label: 'inspect Element',
    click() {
      SOCIALBROWSER.currentWindow.webContents.openDevTools({
        mode: 'detach',
      });
      SOCIALBROWSER.currentWindow.webContents.inspectElement(SOCIALBROWSER.rightClickPosition.x, SOCIALBROWSER.rightClickPosition.y);
    },
  });

  SOCIALBROWSER.menu_list.push({
    label: 'Developer Tools',
    click() {
      SOCIALBROWSER.currentWindow.webContents.openDevTools({
        mode: 'detach',
      });
    },
  });
}

init_tab();
