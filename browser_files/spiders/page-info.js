module.exports = function init(site , browser) {

    const {
        ipcMain,
        BrowserWindow
    } = browser.electron

    let search_list = []
    let win = null
    let info = null

    ipcMain.on('page-info', (event, arg) => {
        if (info.res) {
            info.res.json(arg);
        }
        win.close()
    })

    function findPageInfo() {
        
        if (search_list.length > 0) {
            info = search_list.pop()
        } else {
            setTimeout(() => {
                findPageInfo()
            }, 1000)
            return null
        }

        console.log('Spider page-info >>> ' + info.url)

         win = new BrowserWindow({
            show: false,
            width: 1200,
            height: 800,
            webPreferences: {
                webaudio : false,
                enableRemoteModule: true,
                contextIsolation: false,
                preload: __dirname + "/preload/page-info.js",
                nativeWindowOpen: false,
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                experimentalFeatures: false,
                webSecurity: false,
                allowRunningInsecureContent: true,
                plugins: false,
            }
        })

        win.webContents.audioMuted = true

        win.loadURL(info.url)

        win.webContents.on('permissionrequest', function (e) {
            e.request.allow();
        })

        win.on('close', () => {
            console.log('... Page-Info window closed ...')
            findPageInfo()
        })
        win.on('unresponsive', () => {
           win.close()
        })

        win.once('ready-to-show', () => {
           // win.show()
        })

    }

    findPageInfo()

    function tryFindPageInfo(url, res, js) {
        search_list.push({
            win : null,
            url: url,
            res: res
        })
    }

    site.post('/api/page-info-spider', (req, res) => {
        const url = req.data.url
        if(url){
            tryFindPageInfo(url, res)
        }else{
            res.json({done : false , error : 'No URL Requested'})
        }
    })

}