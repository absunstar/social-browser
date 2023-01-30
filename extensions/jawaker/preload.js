module.exports = function (SOCIALBROWSER) {
  if (document.location.hostname.like('*jawaker.com*')) {
    (function () {
      let pushState = history.pushState;
      let replaceState = history.replaceState;

      history.pushState = function () {
        pushState.apply(history, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
      };

      history.replaceState = function () {
        replaceState.apply(history, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
      };

      window.addEventListener('popstate', function () {
        window.dispatchEvent(new Event('locationchange'));
      });
    })();

    SOCIALBROWSER.onLoad(() => {
     SOCIALBROWSER.addJS(SOCIALBROWSER.readFile(__dirname + '/jawaker.js'));
     SOCIALBROWSER.addHTML(SOCIALBROWSER.readFile(__dirname + '/jawaker.html'));
     SOCIALBROWSER.__showBotImage();
     SOCIALBROWSER.jawaker.handlePanel();
    });
  }
};
