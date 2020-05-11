module.exports = function (browser) {

    const {
        BrowserWindow,
        ipcMain
    } = browser.electron

    browser.views = []
    browser.current_view = {
        id: 0
    }
    browser.getView = function (id) {
        for (let i = 0; i < browser.views.length; i++) {
            if (browser.views[i].id == id) {
                return browser.views[i]
            }
        }
        return browser.current_view
    }
    browser.showYoutubeWindows = function () {
            browser.window_list.forEach(v => {
                if (v.is_youtube) {
                    let win = BrowserWindow.fromId(v.id)
                    if (win && !win.isMinimized()) {
                        win.setAlwaysOnTop(true)
                        win.showInactive()
                    }
                }
            })
    }
    browser.hideOthersViews = function () {
        browser.views.forEach(v => {
            if (browser.current_view.id != v.id) {
                let win = BrowserWindow.fromId(v.id)
                if (win) {
                    win.hide()
                }
            }
        })

    }
    browser.backAllViews = function () {
        browser.views.forEach(v => {
            let win = browser.electron.BrowserWindow.fromId(v.id)
            if (win) {
                win.setAlwaysOnTop(false)
            }
        })
    }

    if (ipcMain) {

        ipcMain.on('render_message', (event, info) => {



            if (info.name == 'open new tab') {
                console.log('event new tab fire')
                info.win_id = info.win_id || browser.current_view.id
                if (info.source == 'session') {
                    info.partition = info.partition || browser.var.core.session.name
                    info.user_name = info.user_name || browser.var.core.session.display
                } else {
                    info.partition = info.partition || browser.current_view.partition
                    info.user_name = info.user_name || browser.current_view.user_name
                }


            } else if (info.name == 'set_var') {

                browser.set_var(info.key, info.value)

            } else if (info.name == 'facebook-share-link') {

                info.partition = info.partition || browser.current_view.partition
                info.user_name = info.user_name || browser.current_view.user_name
                info.referrer = info.referrer || browser.current_view.referrer
                info.url = 'https://facebook.com'
                let win = browser.newWindow(info)
                // win.openDevTools()
                win.webContents.on("dom-ready", e => {

                    // setTimeout(() => {
                    //     win.webContents.sendInputEvent({
                    //         type: 'keyDown',
                    //         keyCode: '\u0013'
                    //     })
                    // }, 7000);


                    let css = browser.readFileSync(browser.files_dir + '/css/facebook.css')
                    let js = browser.readFileSync(browser.files_dir + '/js/facebook.js')
                    win.webContents.insertCSS(css)
                    win.webContents.executeJavaScript(js)
                })
                event.returnValue = win
                return win

            } else if (info.name == 'saveAsPdf') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win) {

                    browser.backAllViews()

                    browser.dialog.showSaveDialog({
                        defaultPath: win.webContents.title,
                        title: "Save Downloading URL As PDF",
                        properties: ["openFile", "createDirectory"]
                    }).then(result => {
                        if (result.canceled) {
                            return
                        }
                        win.webContents.printToPDF({}).then(data => {

                            browser.fs.writeFile(result.filePath, data, function (error) {
                                if (!error) {
                                    browser.backAllViews()
                                    browser.dialog.showMessageBox({
                                        title: "Download Complete",
                                        type: "info",
                                        buttons: ["Open File", "Open Folder", "Close"],
                                        message: `Save Page As PDF \n To \n ${result.filePath} `
                                    }).then(result3 => {
                                        browser.shell.beep()
                                        if (result3.response == 1) {
                                            browser.shell.showItemInFolder(result.filePath)
                                        }
                                        if (result3.response == 0) {
                                            browser.shell.openItem(result.filePath)
                                        }
                                    })
                                } else {
                                    console.log(error)
                                }
                            })

                        })
                    })

                }
            } else if (info.name == 'full_screen') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win) {
                    browser.mainWindow.setFullScreen(true);
                    win.setFullScreen(true);
                }
            } else if (info.name == '!full_screen') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win) {
                    browser.mainWindow.setFullScreen(false);
                    win.setFullScreen(false);
                }
            } else if (info.name == 'escape') {
                browser.hideAddressbar()
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win) {
                    browser.mainWindow.setFullScreen(false);
                    win.setFullScreen(false);
                }
            } else if (info.name == 'audio') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win) {
                    win.webContents.setAudioMuted(!win.webContents.audioMuted)
                    browser.mainWindow.webContents.send('render_message', {
                        name: 'update-audio',
                        tab_id: browser.current_view._id,
                        muted: win.webContents.audioMuted
                    });
                }
            } else if (info.name == 'zoom+') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win) {
                    let factor = win.webContents.zoomFactor
                    let view = browser.getView(win.id)
                    view.zoom = factor + 0.2
                    win.webContents.zoomFactor = view.zoom
                }
            } else if (info.name == 'zoom-') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win) {
                    let factor = win.webContents.zoomFactor
                    if (factor > 0.2) {
                        let view = browser.getView(win.id)
                        view.zoom = factor - 0.2
                        win.webContents.zoomFactor = view.zoom
                    }
                }
            } else if (info.name == 'edit-page') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win) {
                    win.webContents.executeJavaScript(`
                    (function(){
                      let b =  document.querySelector('html');
                      if(b.contentEditable == "inherit"){
                          b.contentEditable = true;
                          b.style.border = '10px dashed green';
                      }else{
                          b.contentEditable = "inherit";
                          b.style.border = '0px solid white';
                      }
                    })()
                    `, false)
                }
            } else if (info.name == 'Developer Tools') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win) {
                    win.webContents.openDevTools()
                }
            } else if (info.name == 'reload') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win) {
                    win.webContents.reload()
                }
            } else if (info.name == 'force reload') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win && info.origin) {
                    info.origin = info.origin === 'null' ? win.webContents.getURL() : info.origin
                    info.storages = info.storages || ['appcache', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage']
                    info.quotas = info.quotas || ['temporary', 'persistent', 'syncable']
                    if (info.origin.replace('://', '').indexOf(':') == -1) {
                        info.origin = info.origin + ':80'
                    }

                    if (info.storages[0] == 'cookies') {
                        browser.session.fromPartition(browser.current_view.partition).clearStorageData({
                            origin: info.origin,
                            storages: info.storages,
                            quotas: info.quotas
                        }).then(() => {
                            win.webContents.reload(true)
                        })
                    } else {
                        browser.session.fromPartition(browser.current_view.partition).clearCache().then(() => {
                            browser.session.fromPartition(browser.current_view.partition).clearStorageData({
                                origin: info.origin,
                                storages: info.storages,
                                quotas: info.quotas
                            }).then(() => {
                                win.webContents.reload(true)
                            })
                        })
                    }


                }
            } else if (info.name == 'show addressbar') {
                browser.showAddressbar(info)
            } else if (info.name == 'show setting') {
                // let bounds = browser.mainWindow.getBounds()
                // let win = browser.newWindow({
                //     url: 'http://127.0.0.1:60080/setting',
                //     x: bounds.x + 25,
                //     y: 20,
                //     width: bounds.width - 50,
                //     height: bounds.height - 50,
                //     alwaysOnTop: true
                // })
            } else if (info.name == 'show profiles') {
                browser.showUserProfile()
            } else if (info.name == 'go back') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win && win.webContents.canGoBack()) {
                    win.webContents.goBack()
                }
            } else if (info.name == 'go forward') {
                info.win_id = info.win_id || browser.current_view.id
                let win = BrowserWindow.fromId(info.win_id)
                if (win && win.webContents.canGoForward()) {
                    win.webContents.goForward()
                }
            } else if (info.name == 'body_clicked') {
                browser.hideAddressbar()
            } else if (info.name == 'copy') {
                browser.clipboard.writeText(info.text)
            } else if (info.name == 'user-input') {

                if (info.host == '127.0.0.1:60080') {
                    return
                }

                let exists = false
                browser.var.user_data_input.forEach(u => {

                    if (u.id === info.id) {
                        exists = true

                        if (JSON.stringify(u.data) !== JSON.stringify(info.data)) {
                            u.data = info.data
                            browser.set_var('user_data_input', browser.var.user_data_input)
                        }

                    } else if (u.url === info.url || u.url.like('*' + info.host + '*') || u.host === info.host) {
                        if (JSON.stringify(u.data) == JSON.stringify(info.data)) {
                            exists = true
                        }
                    }
                })

                if (!exists) {
                    browser.var.user_data_input.push(info)
                    browser.set_var('user_data_input', browser.var.user_data_input)
                }



            } else if (info.name == 'user-data') {

                if (info.host == '127.0.0.1:60080') {
                    return
                }

                let exists = false
                browser.var.user_data.forEach(u => {

                    if (u.id === info.id) {
                        exists = true

                        if (JSON.stringify(u.data) !== JSON.stringify(info.data)) {
                            u.data = info.data
                            browser.set_var('user_data', browser.var.user_data)
                        }

                    } else if (u.url === info.url || u.url.like('*' + info.host + '*') || u.host === info.host) {
                        if (u.data && u.data.length > 0 && u.data.length == info.data.length && u.data[0].value == info.data[0].value) {
                            exists = true
                        }
                    }
                })

                if (!exists) {
                    browser.var.user_data.push(info)
                    browser.set_var('user_data', browser.var.user_data)
                }



            } else {

            }

            browser.mainWindow.webContents.send('render_message', info);
        });


        ipcMain.on('new-view', (e, info) => {
            if (browser.addressbarWindow) {
                browser.addressbarWindow.hide()
            }

            if (typeof info.partition == 'undefined' || info.partition == 'undefined') {
                browser.views.forEach(v => {
                    if (v.id == browser.current_view.id) {
                        info.partition = v.partition
                        info.user_name = v.user_name
                        browser.current_view = v
                    }
                })
            }
            let win = browser.newView(info)
            let new_view = {
                _id: info._id,
                id: win.id,
                partition: info.partition,
                user_name: info.user_name,
                zoom: 1
            }
            browser.views.push(new_view)
            if (browser.views.length == 0) {
                browser.current_view = new_view
                browser.mainWindow.webContents.send('render_message', {
                    name: 'update-url',
                    tab_id: browser.current_view._id,
                    url: decodeURI(info.url)
                });
                browser.mainWindow.webContents.send('render_message', {
                    name: 'update-audio',
                    tab_id: browser.current_view._id,
                    muted: win.webContents.audioMuted
                });
                browser.mainWindow.webContents.send('render_message', {
                    name: 'update-buttons',
                    tab_id: browser.current_view._id,
                    forward: win.webContents.canGoForward(),
                    back: win.webContents.canGoBack()
                });
                // browser.hideOthersViews()
            }

            e.returnValue = win
            return win
        })

        ipcMain.on('show-view', (e, info) => {

            if (browser.addressbarWindow) {
                browser.addressbarWindow.hide()
            }

            browser.views.forEach(v => {
                let win = BrowserWindow.fromId(v.id)
                if (win && v._id == info._id) {
                    browser.handleViewPosition(win)
                    win.show()
                    browser.current_view = browser.getView(win.id)
                    browser.mainWindow.webContents.send('render_message', {
                        name: 'update-user_name',
                        user_name: v.user_name
                    });
                    browser.mainWindow.webContents.send('render_message', {
                        name: 'update-url',
                        tab_id: browser.current_view._id,
                        url: decodeURI(win.getURL())
                    });
                    browser.mainWindow.webContents.send('render_message', {
                        name: 'update-audio',
                        tab_id: browser.current_view._id,
                        muted: win.webContents.audioMuted
                    });
                    browser.mainWindow.webContents.send('render_message', {
                        name: 'update-buttons',
                        tab_id: browser.current_view._id,
                        forward: win.webContents.canGoForward(),
                        back: win.webContents.canGoBack()
                    });
                    browser.mainWindow.setTitle(win.getTitle())
                    e.returnValue = win
                }
            })

            // browser.hideOthersViews()
        })

        ipcMain.on('update-view', (e, info) => {

            if (browser.addressbarWindow) {
                browser.addressbarWindow.hide()
            }

            browser.mainWindow.webContents.send('render_message', {
                name: 'update-url',
                url: decodeURI(info.url),
                tab_id: info._id || browser.current_view._id
            })
            browser.mainWindow.webContents.send('render_message', {
                name: 'update-title',
                title: decodeURI(info.url),
                tab_id: info._id || browser.current_view._id
            })

            if (!info._id) {
                let win = BrowserWindow.fromId(browser.current_view.id)
                win.webContents.stop()
                win.loadURL(info.url)
                e.returnValue = win
                return
            }

            browser.views.forEach(v => {
                let win = BrowserWindow.fromId(v.id)
                if (win && v._id == info._id) {

                    win.webContents.stop()
                    win.loadURL(info.url)
                    e.returnValue = win
                    return
                }
            })
        })

        ipcMain.on('close-view', (e, info) => {

            if (browser.addressbarWindow) {
                browser.addressbarWindow.hide()
            }

            browser.views.forEach(v => {
                if (v._id == info._id) {
                    let win = BrowserWindow.fromId(v.id)
                    if (win) {
                        e.returnValue = win
                        win.destroy()
                        return
                    }
                }
            })




        })

        ipcMain.on('new-window', (e, info) => {

            info.partition = info.partition || browser.current_view.partition
            info.user_name = info.user_name || browser.current_view.user_name
            let win = browser.newWindow(info)
            e.returnValue = win
            return win
        })




        ipcMain.on('new-trusted-window', (e, info) => {


            info.partition = info.partition || browser.current_view.partition
            info.user_name = info.user_name || browser.current_view.user_name
            let win = browser.newTrustedWindow(info)
            e.returnValue = win
            return win
        })

        ipcMain.on('new-youtube-window', (e, info) => {

            info.partition = info.partition || browser.current_view.partition
            info.user_name = info.user_name || browser.current_view.user_name
            let win = browser.newYoutubeWindow(info)
            e.returnValue = win
            return win
        })


        ipcMain.on('new-iframe-window', (e, info) => {

            info.partition = info.partition || browser.current_view.partition
            info.user_name = info.user_name || browser.current_view.user_name
            let win = browser.newIframeWindow(info)
            e.returnValue = win
            return win
        })

        ipcMain.on('redownload-item', (e, info) => {
            browser.var.download_list.forEach((dd, i) => {
                if (dd.id === info.id) {
                    browser.var.download_list.splice(i, 1)
                }
            })
            browser.tryDownload(info.url)
        })

        ipcMain.on('remove-item', (e, info) => {
            browser.var.download_list.forEach((dd, i) => {
                if (dd.id === info.id) {
                    browser.var.download_list.splice(i, 1)
                }
            })
        })

        ipcMain.on('new-video-window', (e, info) => {

            info.partition = info.partition || browser.current_view.partition
            info.user_name = info.user_name || browser.current_view.user_name
            let win = browser.newVideoWindow(info)
            e.returnValue = win
            return win
        })

    }



}