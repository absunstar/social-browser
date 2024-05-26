SOCIALBROWSER.onLoad(() => {
  SOCIALBROWSER.fakeview = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.fakeview123));
  document.title = SOCIALBROWSER.fakeview.message;
  setInterval(() => {
    if (document.title != SOCIALBROWSER.fakeview.message && document.title != 'Following ....') {
      document.title = SOCIALBROWSER.fakeview.message;
    }
  }, 1000 * 5);

  let actionDone = false;
  function followUser() {
    if (actionDone) {
      return;
    }
    if (!document.querySelector('div[aria-label]="Following"')) {
      if ((menu = document.querySelector('div[aria-label="See options"]'))) {
        SOCIALBROWSER.click(menu);
        setTimeout(() => {
          document.querySelectorAll('div[role=menuitem]').forEach((button) => {
            if (button.innerText.like('*Follow*') && !button.innerText.like('*Unfollow*')) {
              actionDone = true;
              SOCIALBROWSER.click(button);
              document.title = 'Following ....';
            }
          });
        }, 1000);
      }
    } else {
      document.title = 'Following ....';
    }
  }
  setInterval(() => {
    followUser();
  }, 1000 * 3);
});
