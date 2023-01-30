  // parent.electron.app.getGPUInfo('basic').then((info) => {
  //   console.log(info);
  // });

  parent.setupTray = function () {
    parent.appIcon = new parent.electron.Tray(parent.files_dir + '/images/jawaker.png');
    parent.appIcon.setToolTip('Social Browser');
    var trayContextMenu = parent.electron.Menu.buildFromTemplate([
      {
        label: 'New Window',
        click: function () {
          parent.createChildProcess({
            url: parent.url.format({
              pathname: parent.path.join(parent.files_dir, 'html', 'main-window.html'),
              protocol: 'file:',
              slashes: true,
            }),
            windowType: 'main',
          });
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        click: function () {
          parent.appIcon = null;
        },
      },
    ]);
    parent.appIcon.setContextMenu(trayContextMenu);
  };