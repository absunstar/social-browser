console.log('Update init .................. ')

const electron = require('electron')
const {
    app,
    BrowserWindow,
} = electron
const fs = require('fs')

const remoteMain = require('@electron/remote/main');
remoteMain.initialize();

app.on("ready", function () {

    app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
        event.preventDefault()
        callback(true)
    })

    let dir = process.resourcesPath + '/app.asar'
    if (!fs.existsSync(dir)) {
        dir = process.cwd()
    }

    let win = new BrowserWindow({
        show: true,
        title: 'Updates',
        width : 850,
        height : 720,
        alwaysOnTop: false,
        webPreferences: {
            preload : dir + '/updates/preload.js',
            preload: setting.preload || child.coreData.files_dir + '/js/context-menu.js',
            javascript: true,
            contextIsolation: false,
            nativeWindowOpen: false,
            nodeIntegration: true,
            nodeIntegrationInSubFrames: false,
            nodeIntegrationInWorker: true,
            experimentalFeatures: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            plugins: true
        }
    })
    remoteMain.enable(win.webContents)
    // win.setMenuBarVisibility(false)
    win.loadURL(dir + '/updates/index.html')

    win.on('closed', () => {
        process.exit()
    })

})