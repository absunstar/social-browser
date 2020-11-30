module.exports = function init(site, browser) {


    const {
        ipcMain,
        BrowserWindow
    } = browser.electron

    let search_list = []

    ipcMain.on('page-urls', (event, data) => {

        let win = BrowserWindow.fromId(data.win_id)
        if(win && !win.isDestroyed()){
            win.close()
        }

        search_list.forEach(info => {
            if (info.win_id == data.win_id) {
                info.data = data
                info.data.count = 0
                info.data.match_url = info.option.match
                info.data.not_match_url = info.option.not_match
                for (let i = info.data.list.length - 1; i >= 0 ; i--) {
                    if (!info.data.list[i].like(info.data.match_url)) {
                        info.data.list.splice(i, 1)
                    }else if (info.data.not_match_url && info.data.list[i].like(info.data.not_match_url)) {
                        info.data.list.splice(i, 1)
                    }
                }
                info.data.match_url_count = info.data.list.length
                info.data.option = info.option
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
        search_list.forEach(info => {
            if (info.guid == op.guid) {
                exists = true
                info.data.count++
                res.json(info.data)
            }
        })

        if (exists) {
            return
        }

        search_list.push({
            guid : op.guid ,
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
                partition : op.partition,
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

        win.webContents.on('permissionrequest', function (e) {
            e.request.allow();
        })

        win.on('closed', () => {
            console.log('... URLS window closed ...')
        })
        win.once('ready-to-show', () => {
           // win.showInactive()
        })

        win.loadURL(op.url)



    }



    site.post('/api/page-urls-spider', (req, res) => {
        const op = req.data
        if(!op.url){
            res.json({done : false , error : "Must Type URL"})
            return
        }
        
        op.not_match = op.not_match || ""
        if(op.url.like('https://www.youtube.com*')){
            op.match = op.match || "https://www.youtube.com/watch*"
            op.not_match = op.not_match || "*list=*"
        }
        op.match = op.match || "*"
        op.guid = site.md5(op.url + op.match + op.not_match )
        findPageInfo(op, res)
    })

}