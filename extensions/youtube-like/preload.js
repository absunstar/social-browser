module.exports = function (SOCIALBROWSER) {
  if (!document.location.hostname.like('*youtube.com*')) {
    return;
  }

  setInterval(() => {
    let is_user_login = document.querySelector('a[href^="https://accounts.google.com/ServiceLogin"]') ? false : true;
    if (is_user_login) {
      let like_btn = document.querySelector('#top-level-buttons ytd-toggle-button-renderer');
      if (like_btn && !like_btn.className.like('*style-default-active*')) {
        let a = like_btn.querySelector('a');
        if (a) {
          a.click();
          alert('Auto Like Video - change from extentions');
          if (SOCIALBROWSER.customSetting.windowType === 'client-popup') {
            window.close();
          }
        }
      }
    }
  }, 1000 * 3);

  setTimeout(() => {
    if (SOCIALBROWSER.customSetting.windowType === 'client-popup') {
      window.close();
    }
  }, 1000 * 15);
};
