module.exports = function (browser) {
    let extension = {};
    extension.id = '__hitleap';
    extension.name = 'HitLeap';
    extension.description = 'hitleap.com site integration';
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
            id: 'hitleap',
            url: '*hitleap.com*',
            list: [
                {
                    name: 'User-Agent',
                    value: 'HitLeap Viewer 2.2',
                },
            ],
            ignore: [],
        });
    };

    extension.disable = () => {
        browser.removePreload(extension.id);
        browser.removeHeader('hitleap');
    };

    extension.remove = () => {
        extension.disable();
    };
    return extension;
};
