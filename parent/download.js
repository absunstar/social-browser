module.exports = function (parent) {
  parent.download = function (options, callback) {
    if (!options.url || !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(options.url)) {
      console.log(' xxx :: parent.download not url format ', options.url);
      return false;
    }
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
        console.log('parent.download', err);
      });
  };
};
