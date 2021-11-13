module.exports = function init(browser) {


    const {
        ipcMain,
        BrowserWindow
    } = browser.electron

    let page_list = []

    function tryFindPageInfo(op , res){
        page_list.push({
            index : page_list.length,
            guid : op.guid ,
            win_id: null,
            data: null,
            url: op.url,
            option: op,
            res: res
        })
    }

    ipcMain.on('page-content', (event, data) => {
        
        page_list.forEach(( info , i) => {
            if (info.win_id == data.win_id) {
                if (info.res) {
                    info.res.json(data);
                }
                page_list.splice(i , 1)
            }
        })
        let win = BrowserWindow.fromId(data.win_id)
        if(win && !win.isDestroyed()){
            win.close()
        }

    })

    function findPageInfo() {
        let page = {}
        if(page_list.length > 0){
            page = page_list[0];
        }else{
            setTimeout(() => {
                findPageInfo()
            }, 1000);
            return
        }

        console.log('[ .... Spider Page Content in URL : ' + page.url + ' ... ]')
        

        let win = new BrowserWindow({
            show: false,
            width: 1200,
            height: 800,
            webPreferences: {
                partition : page.option.partition,
                webaudio: false,
                enableRemoteModule: true,
                contextIsolation: false,
                preload: __dirname + "/preload/page-content.js",
                nativeWindowOpen: false,
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                experimentalFeatures: false,
                sandbox: false,
                webSecurity: false,
                allowRunningInsecureContent: true,
                plugins: false,
            }
        })

        page.win_id = win.id
        win.webContents.audioMuted = true
        win.loadURL(page .url)

        win.webContents.on('permissionrequest', function (e) {
            e.request.allow();
        })

        win.on('close', () => {
            console.log('... Page Content window closed ...' + page.url)
            findPageInfo()
        })
        win.once('ready-to-show', () => {
             win.showInactive()
        })

    }

    findPageInfo()

    browser.api.onPOST('/api/page-content-spider', (req, res) => {
        const option = req.data
        if(!option.url){
            res.json({done : false , error : "Must Type URL"})
            return
        }
        option.guid = browser.md5(option.url + option.match + option.not_match )
        tryFindPageInfo(option, res)
    })

}