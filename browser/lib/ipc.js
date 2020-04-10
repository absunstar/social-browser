module.exports = function init(browser) {



    if (browser.is_render) {
        browser.on = function (name, callback) {
            browser.electron.ipcRenderer.on(name, callback)
        }

        browser.sendToMain = function (channel, value) {
            browser.electron.ipcRenderer.send(channel, value)
        }

    } else {
        browser.on = function (name, callback) {
            browser.electron.ipcMain.on(name, callback)
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


}