module.exports = function init(site, browser) {


    const {
        ipcMain,
        BrowserWindow
    } = browser.electron

    let search_list = []

    ipcMain.on('page-urls', (event, data) => {

        let win = BrowserWindow.fromId(data.win_id)
        if (win) {
            win.close()
        }

        search_list.forEach(info => {
            if (info.win_id == data.win_id) {
                info.data = data
                info.data.count = 0
                info.data.match_url = info.option.match
                for (let i = info.data.list.length - 1; i >= 0 ; i--) {
                    if (!info.data.list[i].like(info.option.match)) {
                        info.data.list.splice(i, 1)
                    }
                }
                info.data.match_url_count = info.data.list.length
                if (info.res) {
                    info.res.json(info.data);
                }
                info.res = null
                info.data.win_id = null
            }
        })
    })

    function findPageInfo(op, res) {
        console.log('[ .... Spider URLs in URL : ' + op.url + ' ... ]')
        let exists = false
        let guid = site.md5(op.url+op.match)
        search_list.forEach(info => {
            if (info.guid == guid) {
                exists = true
                info.data.count++
                res.json(info.data)
            }
        })

        if (exists) {
            return
        }

        search_list.push({
            guid : guid ,
            win_id: null,
            data: null,
            url: op.url,
            option: op,
            res: res
        })

        let win = new BrowserWindow({
            show: false,
            width: 1200,
            height: 800,
            webPreferences: {
                webaudio: false,
                enableRemoteModule: true,
                contextIsolation: false,
                preload: __dirname + "/preload/page-urls.js",
                nativeWindowOpen: false,
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                experimentalFeatures: false,
                webSecurity: false,
                allowRunningInsecureContent: true,
                plugins: false,
            }
        })

        search_list[search_list.length - 1].win_id = win.id
        win.webContents.audioMuted = true
        win.loadURL(op.url)

        win.webContents.on('permissionrequest', function (e) {
            e.request.allow();
        })

        win.on('close', () => {
            console.log('... URLS window closed ...')
        })
        win.once('ready-to-show', () => {
            // win.show()
        })

    }



    site.post('/api/page-urls-spider', (req, res) => {
        const op = req.data
        op.match = op.match || "*"
        findPageInfo(op, res)
    })

}