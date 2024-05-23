SOCIALBROWSER.onLoad(() => {
  let tryCount = 0;
  let tryInterval = null;
  function checkBlocked() {
    tryCount++;
    if (document.location.href.like('*checkpoint*')) {
      alert('Blocked');
      clearInterval(tryInterval);
      SOCIALBROWSER.removeSession(SOCIALBROWSER.session);
    }
  }
  tryInterval = setInterval(() => {
    if (tryCount === 3) {
      clearInterval(tryInterval);
    }
    checkBlocked();
  }, 1000 * 3);
});
