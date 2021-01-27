console.log('Update init .................. ')

const electron = require('electron')
const {
    app,
    BrowserWindow,
} = electron
const fs = require('fs')

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
        title: 'Updates',
        icon: browser.icons[process.platform],
        width : 850,
        height : 720,
        alwaysOnTop: false,
        webPreferences: {
            preload : dir + '/updates/preload.js',
            javascript: true,
            enableRemoteModule: true,
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

    // win.setMenuBarVisibility(false)
    win.loadURL(dir + '/updates/index.html')

    win.on('closed', () => {
        process.exit()
    })

})