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
        let preload = SOCIALBROWSER.var.preload_list.find((p) => p.id == '__Jawaker');
        if (preload) {
            SOCIALBROWSER.__showBotImage();
            SOCIALBROWSER.addJS(SOCIALBROWSER.readFile(preload.path.replace('preload.js', 'jawaker.js')));
            SOCIALBROWSER.addHTML(SOCIALBROWSER.readFile(preload.path.replace('preload.js', 'jawaker.html')));
            SOCIALBROWSER.jawaker.handlePanel();
        }
    });
}
