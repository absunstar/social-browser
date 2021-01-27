module.exports = function (SOCIALBROWSER) {
  SOCIALBROWSER.var.white_list.forEach((site) => {
    if (site.url.length > 2 && document.location.href.like(site.url)) {
      SOCIALBROWSER.is_white_site = true;
    }
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
  require(SOCIALBROWSER.files_dir + '/js/context-menu/menu.js')(SOCIALBROWSER);


  /** Load Custom Scripts */
  require(SOCIALBROWSER.files_dir + '/js/scripts/global.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/scripts/alexa.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/scripts/10khits.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/scripts/addmefast.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/scripts/youlikehits.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/scripts/rankboostup.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/scripts/wintub.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/scripts/linkatcom.js')(SOCIALBROWSER);
  require(SOCIALBROWSER.files_dir + '/js/scripts/egybest.js')(SOCIALBROWSER);
  

  // require(SOCIALBROWSER.files_dir + '/js/scripts/google.js')(SOCIALBROWSER);

  SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));
  SOCIALBROWSER.on('var.session_list', (e, res) => {
    SOCIALBROWSER.var.session_list = res.data;
    SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));
  });



  document.addEventListener('DOMNodeInserted', function (e) {
      // can download any lib
  if (SOCIALBROWSER.var.blocking.javascript.allow_jquery && !window.jQuery) {
    window.$ = window.jQuery = require(SOCIALBROWSER.files_dir + '/js/jquery.js');
  }
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
  //     SOCIALBROWSER.log(e)
  // }, false);

  document.addEventListener('click', (e) => {
    SOCIALBROWSER.call('render_message', {
      name: 'body_clicked',
      win_id: SOCIALBROWSER.electron.remote.getCurrentWindow().id,
    });
  });

  // user agent
  let user_agent_url = null;

  SOCIALBROWSER.var.sites.forEach((site) => {
    if (document.location.href.like(site.url)) {
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

    if (SOCIALBROWSER.var.blocking.privacy.enable_finger_protect && SOCIALBROWSER.var.blocking.privacy.mask_user_agent) {
      SOCIALBROWSER.__define(navigator, 'userAgent', user_agent_url.replace(') ', ') (' + SOCIALBROWSER.guid() + ') '));
    }
  }

  let user_agent_info = SOCIALBROWSER.var.user_agent_list.find((u) => u.url == user_agent_url);
  if (user_agent_info && SOCIALBROWSER.session.user_agent) {
    if (SOCIALBROWSER.session.user_agent.vendor) {
      SOCIALBROWSER.__define(navigator, 'vendor', SOCIALBROWSER.session.user_agent.vendor);
    }
    if (SOCIALBROWSER.session.user_agent.oscpu) {
      SOCIALBROWSER.__define(navigator, 'oscpu', SOCIALBROWSER.session.user_agent.oscpu);
    }
    if (SOCIALBROWSER.session.user_agent.platform) {
      SOCIALBROWSER.__define(navigator, 'platform', SOCIALBROWSER.session.user_agent.platform);
    }
  }

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

  // set random property to match chrome property count
  // for (let index = 0; index < 14; index++) {
  //   navigator['random_' + index] = false;
  //   SOCIALBROWSER.__define(navigator, 'random_' + index, false, { enumerable: true });
  // }
};
