SOCIALBROWSER.onLoad(() => {
  let tryCount = 0;
  let tryInterval = null;
  function joinGroup() {
    tryCount++;
    console.log('like post');
    document.querySelectorAll('div[role=button]').forEach((button) => {
      if (button.innerText.like('*like*') && !button.getAttribute('aria-label').like('*remove*')) {
        SOCIALBROWSER.click(button);
        clearInterval(tryInterval);
      }
    });
  }
  tryInterval = setInterval(() => {
    if (tryCount === 3) {
      clearInterval(tryInterval);
    }
    joinGroup();
  }, 1000 * 3);
});
