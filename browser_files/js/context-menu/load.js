module.exports = function (SOCIALBROWSER) {

   
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

  SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));
  SOCIALBROWSER.on('var.session_list', (e, res) => {
    SOCIALBROWSER.var.session_list = res.data;
    SOCIALBROWSER.var.session_list.sort((a, b) => (a.display > b.display ? 1 : -1));
  });
  
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

  // user agent
  let user_agent_set = false;
  SOCIALBROWSER.var.sites.forEach((site) => {
    if (document.location.href.like(site.url)) {
      SOCIALBROWSER.__define(navigator, 'userAgent', site.user_agent);
      user_agent_set = true;
    }
  });
  if (!user_agent_set) {
    SOCIALBROWSER.__define(navigator, 'userAgent', SOCIALBROWSER.var.core.user_agent);
  }

}



