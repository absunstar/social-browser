module.exports = function (browser) {
    let extension = {};
    extension.id = browser.md5(__filename);
    extension.name = 'IPTS';
    extension.description = 'http://www.ipts.com/';
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
            id: '_ipts',
            url: '*webui.ipts.com*',
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
        browser.removeHeader('_ipts');
    };

    extension.remove = () => {
        extension.disable();
    };
    return extension;
};
