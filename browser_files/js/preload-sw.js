console.log('service worker Preload Run in Sandbox Mode Only... Type : ' + process.type);

// var SOCIALBROWSER = {};
// SOCIALBROWSER.electron = require('electron');
// SOCIALBROWSER.ipcRenderer = SOCIALBROWSER.electron.ipcRenderer;

// SOCIALBROWSER.ipcSync = function (channel, value = {}) {
//     try {
//         return SOCIALBROWSER.ipcRenderer.sendSync(channel, value);
//     } catch (error) {
//         console.log(channel, error);
//         return undefined;
//     }
// };
// SOCIALBROWSER.ipcSync('[window]', { source: 'service worker' });

// SOCIALBROWSER.ipcRenderer.on('window-created', () => {
//     console.log('window creating for service worker');
// });

console.log('globalThis : ' + typeof globalThis);
console.log('window : ' + typeof window);
console.log('document : ' + typeof document);
console.log('location : ' + typeof location);

console.log('End of Service Worker Code ...');
