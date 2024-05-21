SOCIALBROWSER.onLoad(() => {
  let tryCount = 0;
  let tryInterval = null;
  function joinGroup() {
    tryCount++;
    console.log('like page');
    let exists = false;
    document.querySelectorAll('div[role=button]').forEach((button) => {
      if (!exists && button.innerText.like('*Like*') && !button.getAttribute('aria-label').like('*Liked*')) {
        exists = true;
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
