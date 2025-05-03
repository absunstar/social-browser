console.log(' my service worker code init ...');

var SOCIALBROWSER = {};
SOCIALBROWSER.electron = require('electron');
SOCIALBROWSER.ipcRenderer = SOCIALBROWSER.electron.ipcRenderer;

SOCIALBROWSER.ipcSync = function (channel, value = {}) {
    try {
        return SOCIALBROWSER.ipcRenderer.sendSync(channel, value);
    } catch (error) {
        console.log(channel, error);
        return undefined;
    }
};
 //SOCIALBROWSER.customSetting = SOCIALBROWSER.ipcSync('[customSetting]' , {source : 'service worker'});
 //console.log(SOCIALBROWSER.customSetting);

 console.log(process.type);

 if(typeof navigator !== 'undefined'){

     navigator.language = 'aa';
 }

console.log(' my service worker code init 2 ...');