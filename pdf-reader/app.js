module.exports = function init_isite(browser) {


    const {
        BrowserWindow,
        Menu,
        ipcMain
    } = browser.electron;

    const {
        buildMenuTemplate
    } = require(__dirname + '/js/menutemplate');


    browser.newPrinterViewer = function (info) {

        let win, aboutWin;

        // win = new BrowserWindow({
        //     width: 800,
        //     height: 600,
        //     minWidth: 300,
        //     minHeight: 300,
        //     icon: browser.icons[process.platform],
        //     webPreferences: {
        //         preload: browser.files_dir + '/js/context-menu.js',
        //         enableRemoteModule: true,
        //         plugins: true,
        //         // allowRunningInsecureContent: true,
        //         nodeIntegration: true,
        //         // nodeIntegrationInSubFrames: true,
        //         // nodeIntegrationInWorker: true,
        //         // experimentalFeatures: true,
        //     },
        //     frame: false
        // });

        win = browser.newWindow({
            show : true,
            icon: browser.icons[process.platform],
            alwaysOnTop : true,
            webPreferences: {
                preload: null,
                enableRemoteModule: true,
                plugins: true,
                allowRunningInsecureContent: true,
                nodeIntegration: true,
                nodeIntegrationInSubFrames: true,
                nodeIntegrationInWorker: false,
                experimentalFeatures: false,
            },
            frame: false
        })
        
       // win.openDevTools()

        win.loadFile(__dirname + '/index.html');

        if (info) {
            setTimeout(() => {
                win.webContents.send('load-pdf', info)
            }, 1000 * 2);
        }


        win.on('closed', () => {
            win = null;
            aboutWin = null;
        });

        const menu = Menu.buildFromTemplate(buildMenuTemplate(win));

        Menu.setApplicationMenu(menu);

        ipcMain.on('toggle-menu-items', (event, flag) => {
            menu.getMenuItemById('file-print').enabled = flag;
            menu.getMenuItemById('file-properties').enabled = flag;
            menu.getMenuItemById('file-close').enabled = flag;
        });

    }

}