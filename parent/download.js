module.exports = function (parent) {
  parent.downloadList = [];
  parent.download = function (options, callback) {
    if (!options.url || !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(options.url)) {
      console.log(' xxx :: parent.download not url format ', options.url);
      return false;
    }
    if (parent.downloadList.some((x) => x == options.url)) {
      console.log(' xxx :: parent.download url exists ', options.url);
      return false;
    }
    parent.downloadList.push(options.url);
    console.log(' !!!!!! parent.download');
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
        console.log('xxx :: parent.download', err);
      });
  };
};
