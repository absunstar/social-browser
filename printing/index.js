console.log('Printing init ...')

const electron = require('electron')
const {
    app,
    BrowserWindow,
} = electron
const fs = require('fs')

require('@electron/remote/main').initialize();

console.log('new Child wait app ready')

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
        show: false,
        title: 'Print Viewer',
        width : 850,
        height : 720,
        alwaysOnTop: false,
        webPreferences: {
            preload : dir + '/printing/preload.js',
            javascript: true,
            enableRemoteModule: true,
            contextIsolation: false,
            nativeWindowOpen: false,
            nodeIntegration: false,
            nodeIntegrationInSubFrames: false,
            nodeIntegrationInWorker: false,
            experimentalFeatures: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            plugins: true
        }
    })

    win.setMenuBarVisibility(false)
    win.loadURL('http://127.0.0.1:60080/data-content/last')

    win.on('closed', () => {
        process.exit()
    })

})