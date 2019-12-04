module.exports = function init(browser) {
   
   
   
    if(browser.render){
        browser.on = function (name, callback) {
            browser.electron.ipcRenderer.on(name, callback)
        }
       
    }else{
        browser.on = function (name, callback) {
            browser.electron.ipcMain.on(name, callback)
        }
       
    }

    browser.sendToMain = function (channel, value) {
        browser.electron.ipcRenderer.send(channel, value)
    }

    browser.sendToRender = function (channel, value) {
        browser.mainWindow.send(channel, value)
        browser.views.forEach(view => {
            let win = browser.electron.BrowserWindow.fromId(view.id)
                if (win) {
                    win.send(channel, value)
                }
        });
    }

  

}