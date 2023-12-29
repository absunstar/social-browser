module.exports = function (browser) {
    let extension = {};
    extension.id = '__10khits';
    extension.name = '10K Hits';
    extension.description = '10khits.com site Integration';
    extension.paid = false;
    extension.version = '1.0.0';
    extension.canDelete = false;
    extension.init = () => {};
    extension.enable = () => {
        browser.addPreload({
            id: extension.id,
            path: browser.path.join(__dirname, 'preload.js'),
        });
        browser.addRequestHeader({
            id: '_10khits',
            url: '*10khits.com*',
            list: [
                {
                    name: 'User-Agent',
                    value: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.76 Safari/537.36 10KHits-Exchanger/0.9.8',
                },
            ],
            ignore: [],
        });
    };

    extension.disable = () => {
        browser.removePreload(extension.id);
        browser.removeHeader('_10khits');
    };

    extension.remove = () => {
        extension.disable();
    };
    return extension;
};
