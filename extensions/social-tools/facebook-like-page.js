SOCIALBROWSER.onLoad(() => {
  function likePage() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!document.querySelector('div[aria-label="Liked"]')) {
      if ((button = document.querySelector('div[aria-label="Like"]'))) {
        SOCIALBROWSER.click(button);
      }
    }
  }
  setInterval(() => {
    likePage();
  }, 1000 * 3);
});
