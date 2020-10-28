console.log('pdf reader init ...')

const {
    BrowserWindow,
    Menu,
    ipcMain,
    app
} = require('electron');

const {
    buildMenuTemplate
} = require(__dirname + '/js/menutemplate');
const path = require('path')
const fs = require('fs')

let dir = process.resourcesPath + '/app.asar'
if (!fs.existsSync(dir)) {
    dir = process.cwd()
}

let icons = []
icons['darwin'] = path.join(dir, "browser_files", "images", "logo.icns")
icons['linux'] = path.join(dir, "browser_files", "images", "logo.png")
icons['win32'] = path.join(dir, "browser_files", "images", "logo.ico")

app.on('ready', () => {

    let win = new BrowserWindow({
        show: true,
        icon: icons[process.platform],
        alwaysOnTop: true,
        webPreferences: {
            preload: null,
            enableRemoteModule: true,
            plugins: true,
            allowRunningInsecureContent: false,
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            nodeIntegrationInWorker: false,
            experimentalFeatures: false,
        },
        frame: false
    })

    win.loadFile(__dirname + '/index.html');

    setTimeout(() => {
        win.webContents.send('load-pdf', process.argv[process.argv.length - 1])
    }, 1000 * 2)



    win.on('closed', () => {
        win = null;
        app.quit()
    })

    const menu = Menu.buildFromTemplate(buildMenuTemplate(win));

    Menu.setApplicationMenu(menu);

    ipcMain.on('toggle-menu-items', (event, flag) => {
        menu.getMenuItemById('file-print').enabled = flag;
        menu.getMenuItemById('file-properties').enabled = flag;
        menu.getMenuItemById('file-close').enabled = flag;
    })

})