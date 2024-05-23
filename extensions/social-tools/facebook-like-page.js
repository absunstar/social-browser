SOCIALBROWSER.onLoad(() => {
  let exists = false;
  function likePage() {
    if (exists) {
      return;
    }
    console.log('Try Like Page');
    document.querySelectorAll('div[role=button]').forEach((button) => {
      if (!exists && button.innerText.like('*Like*') && !button.getAttribute('aria-label').like('*Liked*')) {
        exists = true;
        SOCIALBROWSER.click(button);
      }
    });
  }
  setInterval(() => {
    likePage();
  }, 1000 * 3);
});
