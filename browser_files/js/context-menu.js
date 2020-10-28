(function () {
  'use strict';

  var SOCIALBROWSER = {
    var: {
      core: { id: '', user_agent: '' },
      sites: [],
      session_list: [],
      blocking: { javascript: {}, privacy: {}, youtube: {} },
      facebook: {},
      open_list: [],
      context_menu: { dev_tools: true, inspect: true },
    },
  };

  SOCIALBROWSER.electron = require('electron');

  SOCIALBROWSER.fs = require('fs');
  SOCIALBROWSER.url = require('url');
  SOCIALBROWSER.path = require('path');
  SOCIALBROWSER.md5 = require('md5');

  SOCIALBROWSER.callSync = function (channel, value) {
    return SOCIALBROWSER.electron.ipcRenderer.sendSync(channel, value);
  };
  SOCIALBROWSER.call = function (channel, value) {
    return SOCIALBROWSER.electron.ipcRenderer.send(channel, value);
  };
  SOCIALBROWSER.on = function (name, callback) {
    return SOCIALBROWSER.electron.ipcRenderer.on(name, callback);
  };

  SOCIALBROWSER.files_dir = SOCIALBROWSER.callSync('get_browser', {
    name: 'files_dir',
  });

  SOCIALBROWSER.nativeImage = function (_path) {
    try {
      if (!_path) {
        return null;
      }
      return SOCIALBROWSER.electron.nativeImage.createFromPath(_path).resize({
        width: 16,
        height: 16,
      });
    } catch (error) {
      return null;
    }
  };

  require(SOCIALBROWSER.files_dir + '/js/context-menu/init.js')(SOCIALBROWSER);

  try {
    if (window.parent && window.parent != window && window.parent.SOCIALBROWSER) {
      SOCIALBROWSER.var = window.parent.SOCIALBROWSER.var;
    } else {
      if (document.location.href.contains('127.0.0.1:60080')) {
        SOCIALBROWSER.var = SOCIALBROWSER.callSync('get_var', {
          url: document.location.href,
          name: '*',
        });
      } else {
        if (document.location.href == 'about:blank' || document.location.host == 'chromewebdata') {
        } else if (document.location.href) {
          SOCIALBROWSER.var = SOCIALBROWSER.callSync('get_var', {
            host: document.location.host,
            url: document.location.href,
            name:
              'user_data,user_data_input,sites,youtube,facebook,javascript,context_menu,open_list,proxy_list,proxy,popup,core,login,vip,bookmarks,black_list,white_list,session_list,user_agent_list,blocking',
          });
        }
      }
    }
  } catch (error) {
    
    if (document.location.href == 'about:blank' || document.location.host == 'chromewebdata') {
    } else if (document.location.href) {
      SOCIALBROWSER.var = SOCIALBROWSER.callSync('get_var', {
        host: document.location.host,
        url: document.location.href,
        name:
          'user_data,user_data_input,sites,youtube,facebook,javascript,context_menu,open_list,proxy_list,proxy,popup,core,login,vip,bookmarks,black_list,white_list,session_list,user_agent_list,blocking',
      });
    }
  }

  SOCIALBROWSER.currentWindow = SOCIALBROWSER.electron.remote.getCurrentWindow();

  SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));
  SOCIALBROWSER.on('var.session_list', (e, res) => {
    SOCIALBROWSER.var.session_list = res.data;
    SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));
  });

  require(SOCIALBROWSER.files_dir + '/js/context-menu/fn.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/finger_print.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/custom.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/adblock_hacking.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/user_input.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/user_data.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/keyboard.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/doms.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/nodes.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/videos.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/youtube.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/10khits.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/addmefast.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/youlikehits.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/menu.js')(SOCIALBROWSER);

  document.addEventListener('DOMNodeInserted', function (event) {
    // if (SOCIALBROWSER && !!window && !(!!window.jQuery)) {
    //     window.jQuery = require(SOCIALBROWSER.files_dir + '/js/jquery.js');
    // }
  });

  let $is_DOMContentLoaded = false;
  document.addEventListener('DOMContentLoaded', () => {
    if ($is_DOMContentLoaded) {
      return;
    }
    $is_DOMContentLoaded = true;

    const xxx__browser = document.createElement('div');
    xxx__browser.id = 'xxx__browser';
    xxx__browser.innerHTML = SOCIALBROWSER.fs.readFileSync(SOCIALBROWSER.files_dir + '/html/custom/browser.html');
    document.body.appendChild(xxx__browser);

    require(SOCIALBROWSER.files_dir + '/js/context-menu/iframes.js')(SOCIALBROWSER);
    require(SOCIALBROWSER.files_dir + '/js/context-menu/safty.js')(SOCIALBROWSER);

    if (SOCIALBROWSER.var.facebook.enabled && document.location.href.toLowerCase().like('https://www.facebook.com*')) {
      require(SOCIALBROWSER.files_dir + '/js/context-menu/facebook.com.js')(SOCIALBROWSER);
    }

    if (SOCIALBROWSER.var.blocking.privacy.show_bookmarks && document.querySelector('title') && document.querySelector('title').text == 'Google') {
      window.__showBookmarks();
    }
  });

  // window.addEventListener("message", (e) => {
  //     console.log(e)
  // }, false);

  document.addEventListener('click', (e) => {
    SOCIALBROWSER.call('render_message', {
      name: 'body_clicked',
      win_id: SOCIALBROWSER.electron.remote.getCurrentWindow().id,
    });
  });

  window.SOCIALBROWSER = SOCIALBROWSER;
})();
