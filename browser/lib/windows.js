module.exports = function init(browser) {

  const electron = browser.electron
  const {
    BrowserWindow,
    dialog,
    BrowserWindowProxy,
    ipcMain
  } = electron

  function newWindowEvent(event, url, frameName, disposition, options, additionalFeatures) {

    event.preventDefault()


    
    var view = browser.getView(this.id)

    if (event.url) {
      if (event.url.like('https://www.youtube.com/watch*')) {
        url = 'https://www.youtube.com/embed/' + event.url.split('=')[1]

        browser.newYoutubeWindow({
          url: 'http://127.0.0.1:60080/iframe?url=' + url,
          partition: view.partition,
          user_name: view.user_name
        })
        return
      }
    } else if (url) {
      if (url.like('https://www.youtube.com/watch*')) {
        url = 'https://www.youtube.com/embed/' + url.split('=')[1]
        browser.newYoutubeWindow({
          url: 'http://127.0.0.1:60080/iframe?url=' + url,
          partition: view.partition,
          user_name: view.user_name
        })
        return
      }
    }

    event.options = event.options || {
      url: url
    }


    let url_p = browser.url.parse(event.options.url)
    let url2_p = browser.url.parse(this.getURL())



    if (url_p.host === url2_p.host && browser.var.popup.internal) {
      browser.sendToRender('render_message', {
        name: 'open new tab',
        url: url,
        partition: view.partition,
        user_name: view.user_name
      })
    } else if (url_p.host !== url2_p.host && browser.var.popup.external) {
      browser.sendToRender('render_message', {
        name: 'open new tab',
        url: url,
        partition: view.partition,
        user_name: view.user_name
      })
    } else {
      let allow = false
      browser.var.popup.ignore_urls.forEach(d => {
        if (url_p.host.like(d.url) || url2_p.host.like(d.url)) {
          allow = true
        }
      })
      if (allow) {
        browser.sendToRender('render_message', {
          name: 'open new tab',
          url: url,
          partition: view.partition,
          user_name: view.user_name
        })
      } else {
        //console.log('Block Popup : ' + url)
      }
      // event.newGuest = browser.newWindow(event.options)
    }


  }

  browser.handleViewPosition = function(win){
    if(!win){
      return
    }
    let view = browser.getView(win.id)
    if(view.full_screen == true){
      let display = browser.electron.screen.getPrimaryDisplay()
      let width = display.bounds.width
      let height = display.bounds.height
      win.setBounds({
        x: 0,
        y: 0,
        width: width,
        height: height
      })
      
    }else{
      let bounds = browser.mainWindow.getBounds()
      win.setBounds({
        x: browser.mainWindow.isMaximized() ? bounds.x + 8 : bounds.x,
        y: browser.mainWindow.isMaximized() ? bounds.y + 75 : bounds.y + 70,
        width: browser.mainWindow.isMaximized() ? bounds.width - 20 : bounds.width - 2,
        height: browser.mainWindow.isMaximized() ? bounds.height - 85 : bounds.height - 75
      })
      
    }
    
  }


  browser.newView = function (options) {
    let tab_id = options._id;
    let tab_icon = 'browser://images/logo.png';
    let loading_icon = 'browser://images/loading-white.gif';

    options.webPreferences = options.webPreferences || {}

    let bounds = browser.mainWindow.getBounds()


    let win = new BrowserWindow({
      parent: browser.mainWindow,
      show: true,
      width: bounds.width - 5,
      height: browser.mainWindow.isMaximized() ? bounds.height - 85 : bounds.height - 75,
      x: bounds.x,
      y: browser.mainWindow.isMaximized() ? bounds.y + 75 : bounds.y + 70,
      resizable: false,
      fullscreenable: true,
      title: 'New Tab',
      backgroundColor: options.backgroundColor || '#ffffff',
      frame: false,
      icon: browser.path.join(browser.files_dir, "images", "logo.ico"),
      webPreferences: {
        enableRemoteModule: true,
        contextIsolation: false,
        partition: options.partition,
        preload: browser.files_dir + '/js/context-menu.js',
        nativeWindowOpen: false,
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        experimentalFeatures: true,
        webSecurity: options.webPreferences.webSecurity ? true : false,
        guestInstanceId: options.webPreferences.guestInstanceId,
        openerId: options.webPreferences.openerId,
        allowRunningInsecureContent: true,
        plugins: true,
      }
    })

    browser.handleViewPosition(win)

    win.once("ready-to-show", function () {
      // win.show()
    })

    win.on("close", function () {
      let view = browser.getView(win.id)
      browser.mainWindow.webContents.executeJavaScript("closeTab('" + view._id + "');")

    })

    win.on('focus', function () {

      if(browser.getView(win.id).full_screen){
        win.setAlwaysOnTop(true)
        win.show()
      }else{
        browser.mainWindow.setAlwaysOnTop(true)
      }
     

    })

    win.on('blur', function () {

      browser.mainWindow.setAlwaysOnTop(false)

    })

    win.setMenuBarVisibility(false)
    
    if (options.url) {
      win.loadURL(options.url, {
        referrer: options.referrer
      })
    } else {
      win.loadURL(browser.var.core.default_page || 'http://127.0.0.1:60080/newTab')
    }


    win.on("enter-full-screen", e => {
      console.log('enter-full-screen')
      let view = browser.getView(win.id)
      view.full_screen = true
      browser.handleViewPosition(win)
      if(browser.getView(win.id).full_screen){
        win.setAlwaysOnTop(true)
        win.show()
      }else{
        browser.mainWindow.setAlwaysOnTop(true)
      }
    })
 
    win.on("leave-full-screen", e => {
      console.log('leave-full-screen')
      let view = browser.getView(win.id)
      view.full_screen = false
      setTimeout(() => {
        browser.handleViewPosition(win)
      }, 500);


    })

    win.on("enter-html-full-screen", e => {
      console.log('enter-html-full-screen')
      let view = browser.getView(win.id)
      view.html_full_screen = true
      browser.handleViewPosition(win)
      if(browser.getView(win.id).full_screen){
        win.setAlwaysOnTop(true)
        win.show()
      }else{
        browser.mainWindow.setAlwaysOnTop(true)
      }
    })
    win.on("leave-html-full-screen", e => {
      console.log('leave-html-full-screen')
      let view = browser.getView(win.id)
      view.html_full_screen = false
      setTimeout(() => {
        browser.handleViewPosition(win)
      }, 500);
    })


    let contents = win.webContents


    contents.on('permissionrequest', function (e) {
      console.log('permissionrequest')
      e.request.allow();
      if (e.permission === 'media') {
        e.request.allow();
      }
    })

    contents.on("update-target-url", (e , url) => {
      contents.send('render_message', {
        name: 'update-target-url',
        url: url
      })
    })

    contents.on("page-title-updated", e => {
      browser.mainWindow.webContents.send('render_message', {
        name: 'update-title',
        title: contents.getTitle(),
        tab_id: tab_id
      })

      browser.mainWindow.webContents.send('render_message', {
        name: 'update-url',
        tab_id: tab_id,
        url: win.getURL()
    })

      browser.mainWindow.webContents.send('render_message', {
        name: 'update-buttons',
        tab_id: tab_id,
        forward: contents.canGoForward(),
        back: contents.canGoBack()
      })
    })

    contents.on("page-favicon-updated", (e, urls) => {

      if (urls && urls.length > 0) {
        tab_icon = urls[0]
        browser.mainWindow.webContents.send('render_message', {
          name: 'update-favicon',
          icon: urls[0],
          tab_id: tab_id
        })
        browser.addURL({
          url: win.getURL(),
          logo: tab_icon
        })
      }

    })

    contents.on("did-start-loading", (e , url) => {
    
      browser.mainWindow.webContents.send('render_message', {
        name: 'update-url',
        tab_id: tab_id,
        url: win.getURL()
    })

      browser.mainWindow.webContents.send('render_message', {
        name: 'show-loading',
        icon: loading_icon,
        tab_id: tab_id
      })

    })

    contents.on("did-stop-loading", (e) => {

      browser.mainWindow.webContents.send('render_message', {
        name: 'show-loading',
        icon: tab_icon,
        tab_id: tab_id
      })

    })

    contents.on("did-finish-load", (e) => {
      browser.mainWindow.webContents.send('render_message', {
        name: 'show-loading',
        icon: tab_icon,
        tab_id: tab_id
      })
      browser.mainWindow.webContents.send('render_message', {
        name: 'update-buttons',
        tab_id: tab_id,
        forward: contents.canGoForward(),
        back: contents.canGoBack()
      })
    })

    contents.on("did-fail-load", (e) => {
      browser.mainWindow.webContents.send('render_message', {
        name: 'show-loading',
        icon: tab_icon,
        tab_id: tab_id
      })

    })

    contents.on("dom-ready", e => {

      browser.addURL({
        url: win.getURL(),
        title: contents.getTitle(),
        logo: tab_icon
      })

      browser.mainWindow.webContents.send('render_message', {
        name: 'update-url',
        url: win.getURL(),
        tab_id: tab_id
      })
      browser.mainWindow.webContents.send('render_message', {
        name: 'update-buttons',
        tab_id: tab_id,
        forward: contents.canGoForward(),
        back: contents.canGoBack()
      })
      let css = browser.readFileSync(browser.files_dir + '/css/inject.css')
      contents.insertCSS(css)
    })

    contents.on('before-input-event', (event, input) => {
      // For example, only enable application menu keyboard shortcuts when
      // Ctrl/Cmd are down.
      contents.setIgnoreMenuShortcuts(!input.control && !input.meta)
    })


    contents.on('crashed', (e) => {
      console.log('window Crashed')
      setTimeout(() => {
        win.loadURL(options.url || browser.var.core.default_page || 'http://127.0.0.1:60080/newTab')
      }, 1000)
    })



    contents.on("will-redirect", e => {
      // console.log('will-redirect')
    })

    contents.on("did-redirect-navigation", e => {
      // console.log('did-redirect-navigation')
    })

    contents.on("did-navigate", e => {
      // console.log('did-navigate')
    })

    contents.on("did-frame-navigate", e => {
      // console.log('did-frame-navigate')
    })

    contents.on("did-navigate-in-page", e => {
      // console.log('did-navigate-in-page')
    })

    contents.on("did-get-redirect-request", e => {
      if (e.isMainFrame) {
        win.loadURL(e.newURL)
      }
    })

    // contents.on('will-prevent-unload', (event) => {
    //   const choice = dialog.showMessageBox(win, {
    //     type: 'question',
    //     buttons: ['Leave', 'Stay'],
    //     title: 'Do you want to leave this site?',
    //     message: 'Changes you made may not be saved.',
    //     defaultId: 0,
    //     cancelId: 1
    //   })
    //   const leave = (choice === 0)
    //   if (leave) {
    //     event.preventDefault()
    //   }
    // })

    contents.on("new-window", newWindowEvent)

    return win
  }

  browser.addressbarWindow = null;
  browser.newAddressbarWindow = function () {

    let win = new BrowserWindow({
      parent: browser.mainWindow,
      show: false,
      width: 600,
      height: 450,
      x: 90,
      y: 30,
      alwaysOnTop: true,
      resizable: false,
      fullscreenable: false,
      title: 'Address-bar',
      backgroundColor: '#ffffff',
      frame: false,
      icon: browser.path.join(browser.files_dir, "images", "logo.ico"),
      webPreferences: {
        partition: 'address_bar',
        preload: browser.files_dir + '/js/addressbar-context-menu.js',
        nativeWindowOpen: false,
        nodeIntegration: true,
        experimentalFeatures: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        plugins: false,
      }
    })

    win.setMenuBarVisibility(false)
    win.loadURL(browser.url.format({
      pathname: browser.path.join(browser.files_dir, "html", "address-bar.html"),
      protocol: "file:",
      slashes: true
    }))

    win.on('blur', function () {
      win.hide()
    })

    return win
  }
  browser.hideAddressbar = function () {
    if (browser.addressbarWindow) {
      browser.addressbarWindow.hide()
    }
  }

  browser.showAddressbar = function (options) {

    options = options || {}

    browser.addressbarWindow = browser.addressbarWindow || browser.newAddressbarWindow()
    if (!options.url) {
      let win = BrowserWindow.fromId(browser.current_view.id)
      if (win) {
        options.url = win.getURL()
      }
    }

    if (options.url.like('http://127.0.0.1:60080*')) {
      options.url = ''
    }

    browser.addressbarWindow.webContents.executeJavaScript("loadurl('" + options.url + "');")

    let bounds = browser.mainWindow.getBounds()
    browser.addressbarWindow.setBounds({
      width: bounds.y == -8 ? bounds.width - 100 : bounds.width - 95,
      height: 400,
      x: bounds.x + 95,
      y: (bounds.y == -8 ? 0 : bounds.y - 5) + 30,
    })
    browser.addressbarWindow.show()
    return browser.addressbarWindow

  }


  browser.userProfileWindow = null;
  browser.newUserProfileWindow = function () {

    let win = new BrowserWindow({
      parent: browser.mainWindow,
      show: false,
      width: 600,
      height: 450,
      x: 90,
      y: 30,
      alwaysOnTop: true,
      resizable: false,
      fullscreenable: false,
      title: 'Address-bar',
      backgroundColor: '#ffffff',
      frame: false,
      icon: browser.path.join(browser.files_dir, "images", "logo.ico"),
      webPreferences: {
        partition: 'user_profile',
        preload: browser.files_dir + '/js/addressbar-context-menu.js',
        nativeWindowOpen: false,
        nodeIntegration: true,
        experimentalFeatures: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        plugins: false,
      }
    })

    win.setMenuBarVisibility(false)
    win.loadURL(browser.url.format({
      pathname: browser.path.join(browser.files_dir, "html", "user-profiles.html"),
      protocol: "file:",
      slashes: true
    }))

    win.on('blur', function () {
      win.hide()
    })

    return win
  }

  browser.hideUserProfile = function () {
    if (browser.userProfileWindow) {
      browser.userProfileWindow.hide()
    }
  }

  browser.showUserProfile = function (options) {

    options = options || {}

    browser.userProfileWindow = browser.userProfileWindow || browser.newuserProfileWindow()

    let bounds = browser.mainWindow.getBounds()
    browser.userProfileWindow.setBounds({
      width: 400,
      height: 500,
      x: bounds.x + (bounds.width - 500),
      y: (bounds.y == -8 ? 0 : bounds.y - 5) + 30,
    })
    browser.userProfileWindow.show()
    return browser.userProfileWindow

  }

  browser.newWindow = function (options) {

    browser.mainWindow.setAlwaysOnTop(false)

    options = options || {}
    options.webPreferences = options.webPreferences || {}

    options.x = options.x || 200
    options.x = options.x > 1200 ? 200 : options.x
    options.y = options.y || 200
    options.y = options.y > 600 ? 200 : options.y

    if (!options.partition && !options.webPreferences.partition) {
      options.partition = browser.current_view.partition
    }


    let win = new BrowserWindow({
      show: true,
      title: options.title || 'New Window',
      alwaysOnTop: options.alwaysOnTop,
      width: options.width || 1200,
      height: options.height || 800,
      x: options.x,
      y: options.y,
      backgroundColor: options.backgroundColor || '#ffffff',
      frame: true,
      icon: browser.path.join(browser.files_dir, "images", "logo.ico"),
      webPreferences: {
        partition: options.webPreferences.partition || options.partition,
        sandbox: options.webPreferences.sandbox,
        preload: options.preload || browser.files_dir + '/js/context-menu.js',
        nativeWindowOpen: false,
        nodeIntegration: false,
        experimentalFeatures: false,
        webSecurity: options.webPreferences.webSecurity || false,
        guestInstanceId: options.webPreferences.guestInstanceId,
        openerId: options.webPreferences.openerId,
        allowRunningInsecureContent: true,
        plugins: true,
        //experimentalFeatures : false
      }
    })


    if (options.max) {
      win.maximize()
    }
    win.setMenuBarVisibility(false)
    win.loadURL(options.url, {
      referrer: options.referrer
    })



    win.webContents.on('crashed', (e) => {
      showInfo('window Crashed')
      setTimeout(() => {
        win.loadURL(url)
      }, 1000)
    })
    win.webContents.on("did-get-redirect-request", e => {
      if (e.isMainFrame) {
        win.loadURL(e.newURL)
      }
    })

    if (!options.window_off) {
      win.webContents.on("new-window", newWindowEvent)
    }



    return win
  }

  browser.newYoutubeWindow = function (options) {

    console.log('newYoutubeWindow()')
    browser.mainWindow.setAlwaysOnTop(false)
    options = options || {}

    if (options.url.like('https://www.youtube.com/watch*')) {
      options.url = 'http://127.0.0.1:60080/iframe?url=' + 'https://www.youtube.com/embed/' + options.url.split('=')[1].split('&')[0]
    } else {
      options.url = options.url.split('&')[0]
    }

    let display = browser.electron.screen.getPrimaryDisplay()
    let width = display.bounds.width
    let height = display.bounds.height

    options.width = 420
    options.height = 280
    options.x = width - 430,
      options.y = height - 310
    options.alwaysOnTop = true
    options.disableEvents = true
    options.backgroundColor = '#030303'
    options.title = 'Youtube'

    options.window_off = true

    let win = browser.newWindow(options)

    win.webContents.on("will-navigate", (e, url2) => {
      e.preventDefault()
      if (url2.like('https://www.youtube.com/watch*')) {
        url = 'https://www.youtube.com/embed/' + url2.split('=')[1]
        win.loadURL('http://127.0.0.1:60080/iframe?url=' + url)
      }
    })

    win.webContents.on("new-window", (event, url, frameName, disposition, options, additionalFeatures) => {

      event.preventDefault()

      if (event.url) {
        if (event.url.like('https://www.youtube.com/watch*')) {
          url = 'https://www.youtube.com/embed/' + event.url.split('=')[1]
          win.loadURL('http://127.0.0.1:60080/iframe?url=' + url)

          return
        }
      } else if (url) {
        if (url.like('https://www.youtube.com/watch*')) {
          url = 'https://www.youtube.com/embed/' + url.split('=')[1]
          win.loadURL('http://127.0.0.1:60080/iframe?url=' + url)

          return
        }
      }

    })


    return win
  }

  browser.newIframeWindow = function (options) {
    console.log('newIframeWindow()')
    browser.mainWindow.setAlwaysOnTop(false)
    options = options || {}

    options.url = 'http://127.0.0.1:60080/iframe?url=' + options.url



    options.width = 800
    options.height = 600
    options.x = 200,
      options.y = 100
    options.alwaysOnTop = true
    options.disableEvents = true
    options.backgroundColor = '#030303'
    let win = browser.newWindow(options)

    win.webContents.on("will-navigate", (e, url2) => {
      e.preventDefault()
      options.url = 'http://127.0.0.1:60080/iframe?url=' + options.url
    })



    return win
  }

  browser.newVideoWindow = function (options) {
    console.log('newVideoWindow()')
    browser.mainWindow.setAlwaysOnTop(false)
    options = options || {}

    options.url = 'http://127.0.0.1:60080/html/mini_video.html?url=' + options.url

    let display = browser.electron.screen.getPrimaryDisplay()
    let width = display.bounds.width
    let height = display.bounds.height

    options.width = 420
    options.height = 280
    options.x = width - 430,
      options.y = height - 310
    options.alwaysOnTop = true
    options.disableEvents = true
    options.backgroundColor = '#030303'

    let win = browser.newWindow(options)

    win.webContents.on("will-navigate", (e, url2) => {
      e.preventDefault()
      url = 'http://127.0.0.1:60080/html/mini_video.html?url=' + url
    })



    return win
  }

  browser.newTrustedWindow = function (op) {

    
    browser.mainWindow.setAlwaysOnTop(false)
    let w = new BrowserWindow({
      show: typeof op.show == 'undefined' ? false : op.show,
      width: op.width || 1200,
      height: op.height || 800,
      webPreferences: {
        preload: op.preload || browser.files_dir + '/js/context-menu.js',
        webaudio: typeof op.webaudio == 'undefined' ? false : op.webaudio,
        partition: op.partition || 'trusted',
        sandbox: false,
        webSecurity: false,
        allowRunningInsecureContent: true,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        experimentalFeatures: true,
        icon: (process.platform != 'darwin' && process.platform != 'win32') ? browser.path.join(browser.files_dir, "images", "logo.png") : browser.path.join(browser.files_dir, "images", "logo.ico")

      }
    })



    w.setMenuBarVisibility(false)



    //w.maximize()

    // w.webContents.on("did-fail-load", function () {
    //   setTimeout(() => {
    //     w.loadURL(op.url)
    //   }, 1000 * 10)
    // })


    w.loadURL(op.url)
    return w
  }

  browser.newSocialBrowser = function (callback) {

    let newWindow = null

    const {
      width,
      height
    } = electron.screen.getPrimaryDisplay().workAreaSize

    newWindow = new BrowserWindow({
      show: false,
      width: 1024,
      height: 768,
      title: 'New Social Browser',
      webPreferences: {
        preload: browser.files_dir + '/js/social-context-menu.js',
        nativeWindowOpen: false,
        plugins: true,
        nodeIntegration: true,
        webSecurity: true,
        allowRunningInsecureContent: true,
        experimentalFeatures: true

      },
      frame: false,
      icon: (process.platform != 'darwin' && process.platform != 'win32') ? browser.path.join(browser.files_dir, "images", "logo.png") : browser.path.join(browser.files_dir, "images", "logo.ico")
    })

    // if (process.platform != 'darwin' && process.platform != 'win32'){
    //   newWindow.webPreferences.icon = browser.path.join(browser.files_dir, "images", "logo.png")
    // }



    newWindow.setMenuBarVisibility(false)
    newWindow.maximize()

    newWindow.on('blur', function () {})
    newWindow.on('focus', function () {})
    newWindow.on('show', function () {})
    newWindow.on('hide', function () {
      browser.hideAddressbar()
    })

    newWindow.on('maximize', function () {
      let bounds = newWindow.getBounds()
      browser.hideAddressbar()
      browser.views.forEach(v => {
        let win = BrowserWindow.fromId(v.id)
        browser.handleViewPosition(win)

      })
    })
    newWindow.on('unmaximize', function () {})
    newWindow.on('minimize', function () {})
    newWindow.on('restore', function () {})


    newWindow.on('resize', function () {
      let bounds = newWindow.getBounds()
      browser.hideAddressbar()
      browser.views.forEach(v => {
        let win = BrowserWindow.fromId(v.id)
        browser.handleViewPosition(win)
      })
    })

    newWindow.on('move', function () {
      browser.hideAddressbar()
      browser.views.forEach(v => {
        let win = BrowserWindow.fromId(v.id)
        browser.handleViewPosition(win)
      })
    })

    newWindow.once("ready-to-show", function () {
      newWindow.show()
    })

    newWindow.webContents.on('crashed', (e) => {
      setTimeout(() => {
        newWindow.loadURL(
          browser.url.format({
            pathname: browser.path.join(browser.files_dir, "html", "social.html"),
            protocol: "file:",
            slashes: true
          })
        )
      }, 1000);

    })

    newWindow.setMinimumSize(480, 450)

    //  newWindow.loadURL('browser://html/social.html')
    // newWindow.openDevTools()

    newWindow.loadURL(
      browser.url.format({
        pathname: browser.path.join(browser.files_dir, "html", "social.html"),
        protocol: "file:",
        slashes: true
      })
    )

    callback(newWindow)

    return newWindow
  }
}