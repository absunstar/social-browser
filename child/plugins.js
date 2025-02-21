module.exports = function init(child) {
  child.allow_widevinecdm = function () {
    let pluginName;
    switch (process.platform) {
      case 'win32':
        pluginName = 'widevinecdm.dll';
        break;
      case 'darwin':
        pluginName = 'widevinecdm.plugin';
        break;
      case 'linux':
        pluginName = 'widevinecdm.so';
        break;
    }

    let path = child.path.resolve('C:/Program Files/Google/Chrome/Application/132.0.6834.197/WidevineCdm/_platform_specific/win_x64') || child.path.join(child.dir, 'plugins', pluginName);

    console.log('Loading Plugin :: ' + path);

    child.electron.app.commandLine.appendSwitch('widevine-cdm-path', path);
    child.electron.app.commandLine.appendSwitch('widevine-cdm-version', '4.10.2830.0');
  };

  child.allow_widevinecdm();
};
