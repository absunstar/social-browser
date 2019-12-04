// const setupEvents = require("./installers/setupEvents")
// if (setupEvents.handleSquirrelEvent()) {
//   return
// }

// var exec = require('child_process').exec;
// exec('NET SESSION', function (err, so, se) {
//   if (se.length !== 0) {
//     // Not Administrator
//     // app.quit()
//     //  process.exit(101)
//   }
// })

//  let childProcess = require("child_process")
//  childProcess.fork(__dirname + '/updating.js')

;
['SIGTERM', 'SIGHUP', 'SIGINT', 'SIGBREAK'].forEach((signal) => {
  process.on(signal, () => {
    console.log('Request signal :: ' + signal)
    app.quit()
    process.exit(1)
  })
})

const electron = require('electron');

function showMessage(msg, callback) {
  callback = callback || function () {}

  electron.dialog.showMessageBox({
    type: 'info',
    message: msg
  }, callback)
}

process.on('uncaughtException', function (error) {
  // showMessage(error.message)
  console.error(error, 'Uncaught Exception thrown');
})

process.on('uncaughtRejection', function (error) {
  // showMessage(error.message)
  console.error(error, 'Uncaught Rejection thrown');
})

process.on('unhandledRejection', function (error, promise) {
  // showMessage(error.message)
  console.error(error, 'Unhandled Rejection thrown');
})

process.on('multipleResolves', (type, promise, reason) => {
  // showMessage(reason)
  console.error(type, promise, reason);
});

process.on('warning', warning => {
  console.warn(warning.stack);
  //showMessage(warning.stack)
})



const browser = require('ibrowser')({
  is_main: true
})


 require('./proxy')(browser)

const {
  app,
  Tray,
  nativeImage,
  Menu,
  ipcMain,
  globalShortcut,
  localShortcut,
  protocol,
  BrowserWindow
} = browser.electron

ipcMain.on('rendererCrash', function () {
  console.log('... rendererCrash ...')
})


var mainWindow = null
browser.mainWindow = mainWindow



const gotTheLock = app.requestSingleInstanceLock()

app.on('second-instance', (commandLine, workingDirectory) => {
  console.log('second-instance')
  if (mainWindow && mainWindow.webContents && !mainWindow.webContents.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
    let u = commandLine.length > 1 ? commandLine[1] : null
    if (typeof u === 'string') {
      u = u.split('\\').join('...');
      browser.mainWindow.send('render_message' , {name : 'open new tab' , url : u})
    } else {
      browser.mainWindow.send('render_message' , {name : 'open new tab' , url : browser.var.core.home_page})
    }

  } else {
    setMainWindow((w) => {
      let u = commandLine.length > 1 ? commandLine[1] : null
      if (typeof u === 'string') {
        u = u.split('\\').join('...');
        browser.mainWindow.send('render_message' , {name : 'open new tab' , url : u})
      } else {
        browser.mainWindow.send('render_message' , {name : 'open new tab' , url : browser.var.core.home_page})
      }
    })
  }

})

if (!gotTheLock) {
  return app.quit()
}

require(__dirname + '/site.js')(browser)

browser.request_url = process.argv.length > 1 ? process.argv[1] : browser.var.core.home_page
if (browser.request_url == '.' || browser.request_url.like('*--squirrel*')) {
  browser.request_url = browser.var.core.home_page
}


browser.on("download-url", function (event, url) {
  browser.tryDownload(url)
})

browser.on("set-icon", function (event, url) {
  // browser.mainWindow.setOverlayIcon(url , "Social Browser");
})

browser.on("message", function (event, data) {
  if (data == "exit") {
    browser.mainWindow.hide()
  } else if (data == "maxmize") {
    if (browser.mainWindow.isMaximized()) {
      browser.mainWindow.unmaximize()
    } else {
      browser.mainWindow.maximize()
    }
  } else if (data == "minmize") {
    browser.mainWindow.minimize()
  } else if (data == "preload") {
    console.log("preload!!")
  } else if (data == "showDeveloperTools") {
    browser.mainWindow.openDevTools({
      mode: 'undocked'
    })
  }

  event.sender.send("message", "ok")
})


app.setPath('userData', browser.path.join(process.cwd(), '/../social-data', 'default'))

browser.allow_widevinecdm()

if (app.setUserTasks) {
  app.setUserTasks([])
}

app.on("ready", function () {

  // setInterval(() => {
  //   browser.writeDownloadList()
  //   setTimeout(() => {
  //     browser.writeUserData()
  //     setTimeout(() => {
  //       browser.writeURLs()
  //     }, 1000 * 10)
  //   }, 1000 * 10)
  // }, 1000 * 60)


  // const iconPath = browser.files_dir + '/images/logo.png'
  // appIcon = new Tray(iconPath);
  // appIcon.setToolTip('This is my application.');


  browser.sessionConfig()

  globalShortcut.unregisterAll()
  // globalShortcut.register('CommandOrControl+X', () => {
  //   console.log('CommandOrControl+X is pressed')
  // })

  setInterval(() => {
    (async()=>{
      browser.set_var('urls' , browser.var.urls)
    })()
  
  }, 1000 * 60 * 5);

  browser.var.session_list.forEach(s1 => {
    let ss = browser.session.fromPartition(s1.name)
    ss.cookies.get({}).then(cookies=> {
        browser.var.cookies.push({
          name: s1.name,
          display: s1.display,
          cookies: cookies
        })
      
    })
  })


  setTimeout(() => {

    let w = browser.newTrustedWindow({
      url: 'http://127.0.0.1:60080/updater',
      show: false,
    })

    if (browser.setting.id.like('*updater*')) {
      w.show()
    }

  }, 1000 * 10);



  app.on('network-connected', () => {
    console.log('network-connected')
  })

  app.on('network-disconnected', () => {
    console.log('network-disconnected')
  })

  app.on('web-contents-created', (event, contents) => {

    // contents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    //   console.log('new-window')
    //   console.log(options)
    //   if (frameName === 'modal') {
    //     // open window as modal
    //     event.preventDefault()
    //     Object.assign(options, {
    //       modal: true,
    //       parent: mainWindow,
    //       width: 100,
    //       height: 100
    //     })
    //     event.newGuest = new BrowserWindow(options)
    //   }else{
    //     event.newGuest = new BrowserWindow(options)
    //   }
    // })

    contents.on('will-attach-webview', (event, webPreferences, params) => {

      console.log('will-attach-webview')
      webPreferences.preload = browser.files_dir + "/js/context-menu.js"
      // webPreferences.preloadURL = 'file://' + browser.files_dir + "/js/context-menu.js"

      delete webPreferences.preloadURL

     // webPreferences.nodeIntegration = false
     // webPreferences.contextIsolation = false
     // webPreferences.webviewTag = false
     // webPreferences.webSecurity = false
     // webPreferences.experimentalFeatures = false
     // webPreferences.nativeWindowOpen = false
     // webPreferences.allowRunningInsecureContent = true
      webPreferences.plugins = true
      // webPreferences.affinity =  'main-window' // main window, and addition windows should work in one process

      // Verify URL being loaded
      // if (!params.src.startsWith('https://yourapp.com/')) {
      //   event.preventDefault()
      // }

    })
  })

  app.on('browser-window-created', (e, win) => {
    // console.log( ' before : ' + win.webContents.browserWindowOptions.webPreferences.preload)
    // if(win.webContents.browserWindowOptions.webPreferences.preload){
    //   if(win.webContents.browserWindowOptions.webPreferences.preload.like('*js/context-menu*')){
    //    win.webContents.browserWindowOptions.webPreferences.preload =  browser.path.join(browser.files_dir , "js" , "window-context-menu.js")
    //   }
    // }else{
    //   win.webContents.browserWindowOptions.webPreferences.preload =  browser.path.join(browser.files_dir , "js" , "window-context-menu.js")
    // }
    // console.log( ' after : ' + win.webContents.browserWindowOptions.webPreferences.preload)


    // win.webContents.browserWindowOptions.webPreferences.preload = browser.files_dir + "/js/social-context-menu.js"
    // win.webContents.on("new-window", (e, url) => {
    //   e.preventDefault()
    //   url = url.length < 5 ? 'browser://empty' : url
    //   var q = browser.url.parse(url, true)
    //   if (q.host.like('*youtube.com*') && q.query.v) {
    //     win.loadURL('http://127.0.0.1:60080/iframe?url=https://www.youtube.com/embed/' + q.query.v)
    //   }else{
    //     win.loadURL(url)
    //   }
  })

  //   win.webContents.on("did-get-response-details", function (details) {

  //   })

  // })

  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault()
    callback(true) // Accept Any Certificate
  })

  // app.on('login', (event, webContents, request, authInfo, callback) => {
  //   event.preventDefault()
  //   callback('username', 'password') //TODO: Try to Read username & Password From User Input
  // })

  // app.on('session-created', (event, session) => {

  // })

  app.on('crashed', (event, session) => {
    console.log('app crashed')
    // app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
    // app.exit(0)
  })

  app.on('gpu-process-crashed', (event, session) => {
    console.log('app gpu-process-crashed')
    // app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
    // app.exit(0)
  })


  // globalShortcut.register('CommandOrControl+X', () => {
  //   console.log('CommandOrControl+X is pressed')
  // })

  // app.on('will-quit', () => {
  //   globalShortcut.unregisterAll()
  // })

  function setMainWindow(callback) {
    callback = callback || function () {}

    browser.newSocialBrowser(w => {
      mainWindow = w
      browser.mainWindow = mainWindow


      w.on("close", function () {
        w = null
      })

      callback(w)

    })
  }


  setMainWindow()
  browser.addressbarWindow = browser.newAddressbarWindow()
  browser.userProfileWindow = browser.newUserProfileWindow()



})


app.on('will-finish-launching', () => {

  app.on('activate', () => {
    if (browser.mainWindow === null) {
      setMainWindow(() => {

      })
    } else {
      browser.mainWindow.show()
    }
  })


  app.on('open-url', (event, path) => {
    event.preventDefault()
    u = path.split('\\').join('...');
    if (browser.mainWindow === null) {
      setMainWindow(() => {
        browser.mainWindow.webContents.executeJavaScript("newTab('" + u + "');")
      })
    }
  })


  app.on('open-file', (event, path) => {
    event.preventDefault()
    if (browser.mainWindow === null) {
      setMainWindow(() => {
        browser.mainWindow.webContents.executeJavaScript("newTab('" + u + "');")
      })
    }
    u = path.split('\\').join('...');
    browser.mainWindow.webContents.executeJavaScript("newTab('" + u + "');")
  })

  app.on("window-all-closed", function () {
    // if (process.platform != 'darwin'){
    //   app.quit()
    // }
  })

})