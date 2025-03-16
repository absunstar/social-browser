module.exports = function (parent) {
  parent.session_name_list = [];

  parent.handleSession = function () {
    let ss = parent.electron.session.defaultSession;

    ss.registerPreloadScript({
      type: 'frame',
      id: 'frame-preload',
      filePath: parent.files_dir + '/js/preload.js',
    });
    ss.registerPreloadScript({
      type: 'service-worker',
      id: 'service-preload',
      filePath: parent.files_dir + '/js/preload.js',
    });

    return ss;
  };
};
