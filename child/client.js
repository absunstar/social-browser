module.exports = function (child) {
  child.ipc = require('node-ipc');

  child.ipc.config.id = 'hello';
  child.ipc.config.retry = 1500;
  child.ipc.config.logger = function () {};

  child.ipc.connectTo('world', function () {
    child.ipc.of.world.on('connect', function () {
      child.sendToWorld({
        type: 'attach',
        index: child.index,
        id: child.id,
        pid: child.id,
        windowType: child.windowType,
      });
    });
    child.ipc.of.world.on('disconnect', function () {
      child.ipc.log('disconnected from world'.notice);
    });
    child.ipc.of.world.on('message', function (data) {
      data = JSON.parse(data);
      if (data.type == 'attached') {
        child.log('^_^ child Attached !!!');
      } else if (data.type == '[main-window-data-changed]') {
        child.parent = child.parent || { options: {} };
        child.parent.options.screen = data.screen;
        child.parent.options.mainWindow = data.mainWindow;
        child.handleWindowBounds();
      }
    });
  });

  child.sendToWorld = function (obj) {
    child.ipc.of.world.emit('message', JSON.stringify(obj));
  };
};
