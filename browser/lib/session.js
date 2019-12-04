module.exports = function (browser) {


  browser.sessionConfig = () => {

    const {
      app,
      session,
      dialog,
      ipcMain,
      protocol,
      BrowserWindow
    } = browser.electron


    // protocol.registerHttpProtocol(
    //   "browser",
    //   function (request, callback) {
    //     let url = request.url.substr(10)
    //     url = `http://127.0.0.1:60080/${url}`
    //     request.url = url
    //     callback(request)
    //   },
    //   function (error) {
    //     if (error) {
    //       console.error("Failed to register http browser protocol")
    //       console.log(error)
    //     }
    //   }
    // )


    let old_sessions = []

    browser.handleSessions = function () {
      browser.var.session_list.push({})
      browser.var.session_list.forEach(s1 => {

        let is_new_session = true
        old_sessions.forEach(os => {
          if (os.name === s1.name) {
            is_new_session = false
          }
        })

        if (is_new_session) {
          old_sessions.push(s1)
        }



        let ss = s1.name == null ? browser.session.defaultSession : browser.session.fromPartition(s1.name)


        if (browser.var.internet_speed.type == 'custom') {
          ss.enableNetworkEmulation({
            latency: browser.var.internet_speed.latency,
            downloadThroughput: browser.var.internet_speed.download / 8 * 1024,
            uploadThroughput:browser.var.internet_speed.upload / 8 * 1024
          })
        } else if (browser.var.internet_speed.type == 'offline'){
          ss.enableNetworkEmulation({offline: true})
        }else{
          ss.disableNetworkEmulation()
        }

        // ss.enableNetworkEmulation({
        //   latency: 500,
        //   downloadThroughput: 6400,
        //   uploadThroughput: 6400
        // })
        // ss.enableNetworkEmulation({offline: true})
        // ss.disableNetworkEmulation()

        if (browser.var.proxy.enabled && browser.var.proxy.url) {
          ss.setProxy({
            proxyRules: browser.var.proxy.url,
            proxyBypassRules: '127.0.0.1'
          }, function () {});
        } else {
          ss.setProxy({}, function () {});
        }

        ss.allowNTLMCredentialsForDomains('*')
        ss.setUserAgent(browser.var.core.user_agent)

        if (is_new_session) {

          ss.protocol.registerHttpProtocol("browser", (request, callback)=> {
              let url = request.url.substr(10)
              url = `http://127.0.0.1:60080/${url}`
              request.url = url
              callback(request)
              // callback({
              //   url : request.url,
              //   method : request.method,
              //   session : request.session,
              //   uploadData : request.uploadData 
              // })
            })

        

          const filter = {
            urls : ["*://*/*"]
        }

          let ids = []

          function add_id(id) {
            if (ids.indexOf(id) === -1) {
              ids.push(id)
              setTimeout(() => {
                ids.splice(ids.indexOf(id))
              }, 1000 * 10);
            }
          }

          ss.webRequest.onBeforeRequest(filter, function (details, callback) {

            let url = details.url.toLowerCase()

            if (url.like('localhost*')) {

              callback({
                cancel: true,
                redirectURL: details.url.replace('localhost:', 'http://localhost:')
              })
              return
            }

            callback({
              cancel: false
            })


          })

          ss.webRequest.onBeforeSendHeaders(filter, function (details, callback) {


            let exit = false
            let cancel = false

            let url = details.url.toLowerCase()

            let source_url = details['referrer'] || details['host'] || url
            if (source_url) {
              source_url = source_url.toLowerCase()
            }

            if (url.like('browser*') || url.like('http://127.0.0.1*') || url.like('https://127.0.0.1*')) {
              exit = true

              callback({
                cancel: false,
                requestHeaders: details.requestHeaders
              })

              if (exit) {
                return
              }

            }

            if (!browser.var.core.enabled) {
              callback({
                cancel: false
              })
              return
            }

            details.requestHeaders['x-browser'] = "social-browser";
            details.requestHeaders['DNT'] = "1";
            details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'] || browser.var.core.user_agent;
            details.requestHeaders['Referrer-Policy'] = 'no-referrer';

            if (browser.var.blocking.safty_mode) {
              browser.var.blocking.un_safe_links.forEach(s => {
                if (url.like(s.url)) {
                  cancel = true
                }
              })


              if (cancel) {

                callback({
                  cancel: true
                })
                browser.sendToRender('user_info', {
                  message: 'un Safty List Blocked :: ' + details.url,
                  class: 'bg-red'
                })

                return
              }

            }

            if (browser.var.black_list) {

              browser.var.black_list.forEach(s => {
                if (url.like(s.url)) {
                  cancel = true
                }
              })

              if (cancel) {

                callback({
                  cancel: true
                })
                browser.sendToRender('user_info', {
                  message: 'Black List Blocked :: ' + details.url,
                  class: 'bg-red'
                })

                return
              }

            }



            if (source_url) {
              browser.var.white_list.forEach(s => {
                if (exit) {
                  return
                }
                if (source_url.like(s.url)) {
                  callback({
                    cancel: false,
                    requestHeaders: details.requestHeaders
                  })
                  exit = true
                  add_id(details.webContentsId)


                  return
                }
              })

              if (exit) {
                return
              }

            }

            let _allowRequest = false
            if (ids.indexOf(details.webContentsId) !== -1) {
              _allowRequest = true
            }

            if (_allowRequest) {
              callback({
                cancel: false
              })
              return
            }


            if (browser.var.blocking.ads) {
              browser.var.blocking.ad_links.forEach(l => {
                if (url.like(l.url)) {
                  cancel = true
                }
              })

              if (cancel) {

                callback({
                  cancel: true
                })
                browser.sendToRender('user_info', {
                  message: 'Ads List Blocked :: ' + details.url,
                  class: 'bg-red'
                })
                return
              }

            }



            if (cancel) {
              callback({
                cancel: true
              })
              browser.sendToRender('user_info', {
                message: 'un Resone Blocked :: ' + details.url,
                class: 'bg-red'
              })
              return

            } else {

              callback({
                cancel: false,
                requestHeaders: details.requestHeaders
              })

              browser.sendToRender('user_info', {
                message: 'Loading :: ' + details.url
              })
              return

            }



          })

          ss.webRequest.onHeadersReceived(filter, function (details, callback) {
            delete details.responseHeaders['x-frame-options'] // sameorigin | deny
            delete details.responseHeaders['Content-Security-Policy']
            delete details.responseHeaders['Content-Security-Policy-Report-Only']
            delete details.responseHeaders['x-content-type-options']
           
            callback({
              cancel : false,
              responseHeaders :  {
                ...details.responseHeaders
              },
              statusLine : details.statusLine
            })
          })
          ss.webRequest.onResponseStarted(filter, function (details) {
           
          })
          ss.webRequest.onBeforeRedirect(filter, function (details) {
           
          })
          ss.webRequest.onCompleted(filter, function (details) {
           
          })
          ss.webRequest.onErrorOccurred(filter, function (details) {
           
          })


          ss.setPermissionRequestHandler((webContents, permission, callback) => {

            if (permission === 'geolocation') {
              callback(false)
              return
            }

            callback(true)
            return

            if (webContents.getURL() === 'some-host' && permission === 'notifications') {
              return callback(false) // denied.
            }

          })

          ss.on('will-download', (event, item, webContents) => {
            console.log('session will-download')

            if (browser.var.downloader.enabled) {
              if (browser.site.isFileExistsSync(browser.var.downloader.app) && !item.getURL().like('blob*')) {
                event.preventDefault()

                let dl = {
                  date: new Date(),
                  total: item.getTotalBytes(),
                  received: item.getReceivedBytes(),
                  name: item.getFilename(),
                  path: item.getSavePath(),
                  url: item.getURL(),
                  id: item.id,
                  canResume: item.canResume(),
                  type: item.getMimeType(),
                  status: 'starting'
                }

                browser.var.download_list = browser.var.download_list || []
                browser.var.download_list.push(dl)
                browser.set_var('download_list', browser.var.download_list)

                let params = browser.var.downloader.params.split(' ')

                for (const i in params) {
                  params[i] = params[i].replace("$url", decodeURIComponent(dl.url)).replace("$file_name", dl.name)
                }


                browser.exe(browser.var.downloader.app, params)

                return
              }
            }

            console.log('will-download ::::::::::')
            browser.views.forEach(v => {
              let win = BrowserWindow.fromId(v.id)
              if (win) {
                win.setAlwaysOnTop(false)
              }
            })


            item.id = browser.guid()

            ipcMain.on('pause-item', (e, info) => {
              if (item.id === info.id) {

                item.pause()


                browser.var.download_list.forEach(dd => {
                  if (dd.id === item.id) {
                    dd.status = 'paused'
                    dd.path = item.getSavePath()
                  }
                })
              }
            })

            ipcMain.on('remove-item', (e, info) => {
              if (item.id === info.id) {
                console.log('cancel download::' + info.url)
                item.cancel()

              }
            })

            ipcMain.on('resume-item', (e, info) => {
              if (item.id === info.id) {
                if (item.canResume()) {
                  item.resume()

                  browser.var.download_list.forEach(dd => {
                    if (dd.id === item.id) {
                      dd.status = 'downloading'
                      dd.path = item.getSavePath()
                    }
                  })
                }

              }
            })

            let url = item.getURL()
            let filename = item.getFilename()

            let dl = {
              date: new Date(),
              total: item.getTotalBytes(),
              received: item.getReceivedBytes(),
              name: item.getFilename(),
              path: item.getSavePath(),
              url: item.getURL(),
              id: item.id,
              canResume: item.canResume(),
              type: item.getMimeType(),
              status: 'starting'
            }

            browser.var.download_list.push(dl)

            item.on('updated', (event, state) => {

              if (!item.getSavePath()) {
                return
              }



              if (state === 'interrupted') {
                browser.var.download_list.forEach(dd => {
                  if (dd.id === item.id) {
                    browser.sendToRender('user_downloads', {
                      message: " (interrupted )" + ` ${item.getFilename()} `,
                      class: 'bg-red white'
                    })
                    dd.status = 'error'
                    dd.canResume = item.canResume()
                    dd.type = item.getMimeType()
                    dd.path = item.getSavePath()
                    dd.name = item.getFilename()
                  }
                })
              } else if (state === 'progressing') {
                if (item.isPaused()) {
                  browser.var.download_list.forEach(dd => {
                    if (dd.id === item.id) {
                      dd.status = 'paused'
                      browser.sendToRender('user_downloads', {
                        message: " Paused  " + ` ${item.getFilename()} ( ${(item.getReceivedBytes()/1000000).toFixed(2)} MB / ${(item.getTotalBytes()/1000000).toFixed(2)} MB )`,
                        class: 'bg-orange black'
                      })
                      dd.type = item.getMimeType()
                      dd.path = item.getSavePath()
                      dd.name = item.getFilename()
                      dd.canResume = item.canResume()
                    }
                  })
                } else {
                  browser.var.download_list.forEach(dd => {
                    if (dd.id === item.id) {
                      browser.sendToRender('user_downloads', {
                        message: `  ( ${(item.getReceivedBytes()/1000000).toFixed(2)} MB / ${(item.getTotalBytes()/1000000).toFixed(2)} MB )  ${item.getFilename()}`,
                        class: 'bg-blue white'
                      })
                      dd.type = item.getMimeType()
                      dd.path = item.getSavePath()
                      dd.name = item.getFilename()
                      dd.canResume = item.canResume()
                      dd.total = item.getTotalBytes()
                      dd.received = item.getReceivedBytes()
                      dd.status = 'downloading'
                    }
                  })
                }
              }
            })

            item.once('done', (event, state) => {
              if (!item.getSavePath()) {
                return
              }
              if (state === 'completed') {
                browser.sendToRender('user_downloads', {
                  message: " ( 100% ) " + ` ${item.getFilename()} `,
                  class: 'bg-green white'
                })

                browser.var.download_list.forEach(dd => {
                  if (dd.id === item.id) {
                    dd.name = item.getFilename()
                    dd.type = item.getMimeType()
                    dd.total = item.getTotalBytes()
                    dd.canResume = item.canResume()
                    dd.received = item.getReceivedBytes()
                    dd.status = 'completed'
                    dd.path = item.getSavePath()
                  }
                })

                browser.set_var('download_list', browser.var.download_list)
                let _path = item.getSavePath()
                let _url = item.getURL()
                browser.dialog.showMessageBox({
                  title: "Download Complete",
                  type: "info",
                  buttons: ["Open File", "Open Folder", "Close"],
                  message: `Saved URL \n ${_url} \n To \n ${_path} `
                }).then(
                result => {

                  browser.shell.beep()
                  if (result.response == 1) {
                    browser.shell.showItemInFolder(_path)
                  }
                  if (result.response == 0) {
                    browser.shell.openItem(_path)
                  }
                }
              )


              } else {

                browser.var.download_list.forEach(dd => {
                  if (dd.id === item.id) {
                    browser.sendToRender('user_downloads', {
                      message: " ( Error ) " + ` ${item.getFilename()} ==> ${state} `,
                      class: 'bg-red white'
                    })
                    dd.name = item.getFilename()
                    dd.type = item.getMimeType()
                    dd.total = item.getTotalBytes()
                    dd.canResume = item.canResume()
                    dd.received = item.getReceivedBytes()
                    dd.status = state
                    dd.path = item.getSavePath()
                  }
                })
                browser.set_var('download_list', browser.var.download_list)

              }

            })

          })


        }
      })
      browser.var.session_list.pop()

    }

    browser.handleSessions()


  }
}