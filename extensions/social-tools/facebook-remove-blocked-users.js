SOCIALBROWSER.onLoad(() => {
  let tryCount = 0;
  let tryInterval = null;
  function checkBlocked() {
    tryCount++;
    if (document.querySelector('body').innerText.like('**')) {
      alert('Blocked');
      clearInterval(tryInterval);
    }
  }
  tryInterval = setInterval(() => {
    if (tryCount === 3) {
      clearInterval(tryInterval);
    }
    checkBlocked();
  }, 1000 * 3);
});
