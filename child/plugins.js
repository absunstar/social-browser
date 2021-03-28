module.exports = function init(child) {
  child.allow_widevinecdm = function (app) {
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
    let path = child.path.join(child.dir, 'plugins' , pluginName);
    child.log('Loading Plugin :: ' + path);
    app.commandLine.appendSwitch('widevine-cdm-path', path);
    app.commandLine.appendSwitch('widevine-cdm-version', '4.10.1610.0');
  };
};
