SOCIALBROWSER.onLoad(() => {
  let tryCount = 0;
  let tryInterval = null;
  SOCIALBROWSER.fakeview = JSON.parse(SOCIALBROWSER.from123(SOCIALBROWSER.fakeview123));
  document.title = SOCIALBROWSER.fakeview.message;
  function addFriend() {
    tryCount++;
    console.log('Add Friend');
    if ((button = document.querySelector('.xsgj6o6.xw3qccf.x1xmf6yo.x1w6jkce.xusnbm3 div[role=button]'))) {
      if (button.innerText.like('*Add friend*')) {
        SOCIALBROWSER.click(button);
        clearInterval(tryInterval);
        setTimeout(() => {
          addFriend2();
        }, 1000 * 3);
      }
    }
  }
  tryInterval = setInterval(() => {
    if (tryCount === 3) {
      clearInterval(tryInterval);
    }
    addFriend();
  }, 1000 * 3);

  function addFriend2() {
    let list = [];
    document.querySelectorAll('.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft').forEach((s) => {
      if (s.innerText.like('*Add friend*')) {
        list.push(s);
      }
    });
    if (list.length > 0) {
      SOCIALBROWSER.click(list[list.length - 1]);
    }
  }
});
