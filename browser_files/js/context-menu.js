(function () {
  'use strict';

  var SOCIALBROWSER = {
    var: {
      core: { id: '', user_agent: '' },
      sites: [],
      session_list: [],
      blocking: { javascript: {}, privacy: {}, youtube: {} },
      facebook: {},
      open_list: [],
      context_menu: { dev_tools: true, inspect: true },
    },
  };

  SOCIALBROWSER.electron = require('electron');

  SOCIALBROWSER.fs = require('fs');
  SOCIALBROWSER.url = require('url');
  SOCIALBROWSER.path = require('path');
  SOCIALBROWSER.md5 = require('md5');

  SOCIALBROWSER.callSync = function (channel, value) {
    return SOCIALBROWSER.electron.ipcRenderer.sendSync(channel, value);
  };
  SOCIALBROWSER.call = function (channel, value) {
    return SOCIALBROWSER.electron.ipcRenderer.send(channel, value);
  };
  SOCIALBROWSER.invoke = function (channel, value) {
    return SOCIALBROWSER.electron.ipcRenderer.invoke(channel, value);
  };
  SOCIALBROWSER.on = function (name, callback) {
    return SOCIALBROWSER.electron.ipcRenderer.on(name, callback);
  };

  SOCIALBROWSER.files_dir = SOCIALBROWSER.callSync('get_browser', {
    name: 'files_dir',
  });

  SOCIALBROWSER.nativeImage = function (_path) {
    try {
      if (!_path) {
        return null;
      }
      return SOCIALBROWSER.electron.nativeImage.createFromPath(_path).resize({
        width: 16,
        height: 16,
      });
    } catch (error) {
      return null;
    }
  };
  SOCIALBROWSER.currentWindow = SOCIALBROWSER.electron.remote.getCurrentWindow();
  require(SOCIALBROWSER.files_dir + '/js/context-menu/init.js')(SOCIALBROWSER);

  let l_name =
    'user_data,user_data_input,sites,youtube,facebook,javascript,context_menu,open_list,proxy_list,proxy,popup,core,login,vip,bookmarks,black_list,white_list,session_list,user_agent_list,blocking';
  if (document.location.href.contains('127.0.0.1:60080')) {
    l_name = '*';
  }

  if(document.location.origin && document.location.origin != "null"){
    SOCIALBROWSER.invoke(
      'get_var',
      {
        host: document.location.host,
        url: document.location.href,
        name: l_name,
      }).then(result=> {
        console.log(' [get_var ] ' , document.location);
        SOCIALBROWSER.var = result;
        require(SOCIALBROWSER.files_dir + '/js/context-menu/load.js')(SOCIALBROWSER);
      },
    );
  }else{
    require(SOCIALBROWSER.files_dir + '/js/context-menu/load.js')(SOCIALBROWSER);
  }


  window.SOCIALBROWSER = SOCIALBROWSER;
})();
