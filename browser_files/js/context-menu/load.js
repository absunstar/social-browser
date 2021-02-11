module.exports = function (SOCIALBROWSER) {
  SOCIALBROWSER.var.white_list.forEach((site) => {
    if (site.url.length > 2 && document.location.href.like(site.url)) {
      SOCIALBROWSER.is_white_site = true;
    }
  });

  SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));

  require(SOCIALBROWSER.files_dir + '/js/context-menu/fn.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/finger_print.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/custom.js')(SOCIALBROWSER);

  require(SOCIALBROWSER.files_dir + '/js/context-menu/adblock_hacking.js')(SOCIALBROWSER);

  require(SOCIALBROWSER.files_dir + '/js/context-menu/user_data.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/keyboard.js')(SOCIALBROWSER);

  require(SOCIALBROWSER.files_dir + '/js/context-menu/doms.js')(SOCIALBROWSER);

  require(SOCIALBROWSER.files_dir + '/js/context-menu/nodes.js')(SOCIALBROWSER);

  require(SOCIALBROWSER.files_dir + '/js/context-menu/videos.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/youtube.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/facebook.com.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/menu.js')(SOCIALBROWSER);

  require(SOCIALBROWSER.files_dir + '/js/context-menu/iframes.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/context-menu/safty.js')(SOCIALBROWSER);

  /** Load Custom Scripts */
  SOCIALBROWSER.fs.readdir(SOCIALBROWSER.files_dir + '/js/scripts', (err, files) => {
    if (!err) {
      files.forEach((file) => {
        require(SOCIALBROWSER.files_dir + '/js/scripts/' + file)(SOCIALBROWSER);
      });
    }
  });

  // load user preload list
  SOCIALBROWSER.var.preload_list.forEach((p) => {
    if (document.location.href.like(p.url)) {
      try {
        require(p.path.replace('{dir}', SOCIALBROWSER.dir))(SOCIALBROWSER);
      } catch (error) {
        console.error(error);
      }
    }
  });

  document.addEventListener('DOMNodeInsertedIntoDocument', function (e) {
    // can download any lib
    if (!SOCIALBROWSER.jqueryLoaded && SOCIALBROWSER.var.blocking.javascript.allow_jquery && !window.jQuery) {
      SOCIALBROWSER.jqueryLoaded = true;
      window.$ = window.jQuery = require(SOCIALBROWSER.files_dir + '/js/jquery.js');
    }
  });
  document.addEventListener('DOMNodeInserted', function (e) {
    // can download any lib
    if (!SOCIALBROWSER.jqueryLoaded && SOCIALBROWSER.var.blocking.javascript.allow_jquery && !window.jQuery) {
      SOCIALBROWSER.jqueryLoaded = true;
      window.$ = window.jQuery = require(SOCIALBROWSER.files_dir + '/js/jquery.js');
    }
  });

  window.addEventListener('mousedown', (e) => {
    if (SOCIALBROWSER.windowType == 'view window') {
      SOCIALBROWSER.call('[send-render-message]', {
        name: 'window_clicked',
        win_id: SOCIALBROWSER.electron.remote.getCurrentWindow().id,
      });
    }
  });

  // user agent
  let user_agent_url = null;

  SOCIALBROWSER.var.sites.forEach((site) => {
    if (document.location.href.like(site.url) && site.user_agent) {
      SOCIALBROWSER.__define(navigator, 'userAgent', site.user_agent);
      user_agent_url = site.user_agent;
    }
  });

  if (!user_agent_url) {

    if (SOCIALBROWSER.session.user_agent) {
      user_agent_url = SOCIALBROWSER.session.user_agent.url;
    } else {
      user_agent_url = SOCIALBROWSER.currentWindow.webContents.getUserAgent() || SOCIALBROWSER.var.core.user_agent;
    }

    if(user_agent_url == "undefined"){
      user_agent_url = SOCIALBROWSER.var.core.user_agent
    }
    if (SOCIALBROWSER.var.blocking.privacy.enable_finger_protect && SOCIALBROWSER.var.blocking.privacy.mask_user_agent) {
      SOCIALBROWSER.__define(navigator, 'userAgent', user_agent_url.replace(') ', ') (' + SOCIALBROWSER.guid() + ') '));
    } else {
      SOCIALBROWSER.__define(navigator, 'userAgent', user_agent_url);
    }

  }

  let user_agent_info = SOCIALBROWSER.var.user_agent_list.find((u) => u.url == user_agent_url);
  if (user_agent_info) {
    if (user_agent_info.vendor) {
      SOCIALBROWSER.__define(navigator, 'vendor', user_agent_info.vendor);
      if(user_agent_info.vendor.like('*google*')){
        SOCIALBROWSER.__define(window, 'chrome', {
          app : {},
          runtime : {},
          csi : ()=>{},
          loadTimes : ()=>{},
        });
      }
    }
    if (user_agent_info.oscpu) {
      SOCIALBROWSER.__define(navigator, 'oscpu', user_agent_info.oscpu);
    }
    if (user_agent_info.platform) {
      SOCIALBROWSER.__define(navigator, 'platform', user_agent_info.platform);
    }
  }
};
