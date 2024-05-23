SOCIALBROWSER.onLoad(() => {
  let exists = false;
  function followUser() {
    if (exists) {
      return;
    }
    console.log('Try Folow User');
    if ((menu = document.querySelector('div[aria-label="See options"]'))) {
      SOCIALBROWSER.click(menu);
      setTimeout(() => {
        document.querySelectorAll('div[role=menuitem]').forEach((button) => {
          if (button.innerText.like('*Follow*') && !button.innerText.like('*Unfollow*')) {
            exists = true;
            SOCIALBROWSER.click(button);
          }
        });
      }, 1000);
    }
  }
  setInterval(() => {
    followUser();
  }, 1000 * 3);
});
