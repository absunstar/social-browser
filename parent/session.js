module.exports = function (parent) {
  parent.session_name_list = [];

  parent.handleSession = function () {
    let ss = parent.electron.session.defaultSession;

    ss.registerPreloadScript({
      type: 'frame',
      id: 'frame-preload',
      filePath: parent.files_dir + '/js/context-menu.js',
    });
    ss.registerPreloadScript({
      type: 'service-worker',
      id: 'service-preload',
      filePath: parent.files_dir + '/js/service-preload.js',
    });

    return ss;
  };
};
