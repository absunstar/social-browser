console.log(' [ Printing init ... ] ');

const electron = require('electron');
const { app, BrowserWindow } = electron;
const fs = require('fs');

const remoteMain = require('@electron/remote/main');
remoteMain.initialize();

let dir = process.argv[2].replace('--dir=', '');
let index = parseInt(process.argv[1].replace('--index=', ''));
app.on('ready', function () {
    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
        event.preventDefault();
        callback(true);
    });

    let win = new BrowserWindow({
        show: false,
        title: 'Print Viewer',
        width: 850,
        height: 720,
        alwaysOnTop: false,
        webPreferences: {
            preload: dir + '/printing/preload.js',
            javascript: true,
            contextIsolation: false,
            nativeWindowOpen: false,
            nodeIntegration: false,
            nodeIntegrationInSubFrames: false,
            nodeIntegrationInWorker: false,
            experimentalFeatures: false,
            sandbox: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            plugins: true,
        },
    });

    remoteMain.enable(win.webContents);

    win.openDevTools();
    win.setMenuBarVisibility(false);
    win.loadURL('http://127.0.0.1:60080/data-content?index=' + index);

    win.on('closed', () => {
        process.exit();
    });
});
