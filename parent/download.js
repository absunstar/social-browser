module.exports = function (parent) {
    parent.downloadList = [];
    parent.download = function (options, callback) {
        if (!options.url || !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(options.url)) {
            // parent.log(' xxx :: parent.download not url format ', options.url);
            options.error = 'URL Not Url formated';
            callback(options);
            return false;
        }
        if (parent.downloadList.some((x) => x == options.url)) {
            // parent.log(' xxx :: parent.download url exists ', options.url);
            options.error = 'URL Downloaded Exits';
            callback(options);
            return false;
        }
        parent.downloadList.push(options.url);
        // parent.log(' !!!!!! parent.download');
        parent
            .fetch(options.url, {
                headers: {
                    'User-Agent': parent.var.core.user_agent,
                },
            })
            .then((res) => {
                const dest = parent.fs.createWriteStream(options.path);
                res.body.pipe(dest);
                callback(options);
            })
            .catch((err) => {
                options.error = err.message;
                callback(options);
                // parent.log('xxx :: parent.download', err);
            });
    };
};
