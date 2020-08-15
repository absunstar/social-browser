var browser = window.browser || require('ibrowser')({
  is_render: true,
  is_social: true,
  message: "from social.html"
})
window._setting_ = browser.var

const {
  remote,
  nativeImage ,
  ipcRenderer
} = browser.electron
const {
  Menu,
  MenuItem
} = remote

function sendToMain(obj) {
  browser.sendToMain("render_message", obj)
}
browser.on('bookmarks' , (event, data)=>{
  browser.var.bookmarks = data.list
})

function showSettingMenu() {
  let arr = [];
  arr.push({
    label: 'Open Social Browser Site',
    click: () => sendToMain({
      name: 'open new tab',
      url: 'https://social-browser.com'
    })
  })

  let bookmark_arr = [];
  bookmark_arr.push({
    label: 'Bookmark current tab',
    click: () => sendToMain({
      name: 'add_to_bookmark'
    })
  })
  bookmark_arr.push({
    label: 'Bookmark all tabs',
    click: () => sendToMain({
      name: 'add_all_to_bookmark'
    })
  })
  bookmark_arr.push({
    type: 'separator'
  })
  bookmark_arr.push({
    label: 'Bookmark manager',
    click: () => sendToMain({
      name: 'open new tab',
      url: 'http://127.0.0.1:60080/setting?open=bookmarks'
    })
  })
  bookmark_arr.push({
    type: 'separator'
  })
  browser.var.bookmarks.forEach(b => {
    bookmark_arr.push({
      label: b.title,
      sublabel : b.url,
      icon : nativeImage.createFromPath(b.favicon).resize({width : 16 , height : 16}),
      click: () => sendToMain({
        name: 'open new tab',
        url: b.url
      })
    })
  })
  bookmark_arr.push({
    type: 'separator'
  })
  let bookmark = new MenuItem({
    label: "Bookmarks",
    type: 'submenu',
    submenu: bookmark_arr
  })
  arr.push(bookmark)
  arr.push({
    type: 'separator'
  })
  arr.push({
    label: 'Reload Page',
    accelerator: 'F5',
    click: () => sendToMain({
      name: 'reload'
    })
  })
  arr.push({
    label: 'Hard Reload Page',
    accelerator: 'CommandOrControl+F5',
    click: () => sendToMain({
      name: 'force reload'
    })
  })

  arr.push({
    type: 'separator'
  })
  arr.push({
    label: 'Zoom +',
    accelerator: 'CommandOrControl+numadd',
    click: () => sendToMain({
      name: 'zoom+'
    })
  })
  arr.push({
    label: 'Zoom',
    accelerator: 'CommandOrControl+0',
    click: () => sendToMain({
      name: 'zoom'
    })
  })
  arr.push({
    label: 'Zoom -',
    accelerator: 'CommandOrControl+numsub',
    click: () => sendToMain({
      name: 'zoom-'
    })
  })

  arr.push({
    type: 'separator'
  })
  arr.push({
    label: 'Edit Page Content',
    accelerator: 'CommandOrControl+E',
    click: () => sendToMain({
      name: 'edit-page'
    })
  })
  arr.push({
    type: 'separator'
  })
  arr.push({
    label: 'Audio ON / OFF',
    accelerator: 'CommandOrControl+1',
    click: () => sendToMain({
      name: 'audio'
    })
  })
  arr.push({
    type: 'separator'
  })
  arr.push({
    label: 'Developer Tools',
    accelerator: 'F12',
    click: () => sendToMain({
      name: 'Developer Tools'
    })
  })

  arr.push({
    type: 'separator'
  })
  arr.push({
    label: 'Show Setting',
    click: () => sendToMain({
      name: 'show setting'
    })
  })

  const settingMenu = Menu.buildFromTemplate(arr);


  settingMenu.popup();
}

ipcRenderer.on('user_info', (event, data) => {
  showInfo(data.message, data)
})

ipcRenderer.on('render_message', (event, data) => {
  renderMessage(data)
})

var tab_icon = 'browser://images/logo.png';
var socialTabsDom = document.querySelector(".social-tabs")
var socialStatusBar = document.querySelector(".social-status-bar")
var socialTabs = new SocialTabs()
var currentWebview = null
var currentTabId = null
var webviewList = []
var opendTabList = []
browser.$is_full_screen = false

socialTabs.init(socialTabsDom, {
  tabOverlapDistance: 14,
  minWidth: 35,
  maxWidth: 243
})


var user_data_info = []

setInterval(() => {
  if (user_data_info.length > 0) {
    client.postData({
      url: 'browser://api/new_user_data_input',
      data: user_data_info
    })
  }
}, 1000 * 5)

let $addressbar = $('.address-input .url')


function showAddressBar() {
  $(".social-address-bar").show()
}

function hideAddressBar() {
  $(".social-address-bar").hide()
}

function showSocialTabs() {
  $(".social-tabs").show()
  $(".social-address-bar").show()
}

function hideSocialTabs() {
  $(".social-tabs").hide()
  $(".social-address-bar").hide()
}

function handleURL(u) {
  if (u.indexOf("://") !== -1) {
    return u
  }

  if (u.indexOf(".") !== -1) {
    u = "http://" + u
  } else {
    u = "https://google.com/search?q=" + u
  }

  return u
}


function showURL(u) {
  u = u || $('#' + currentTabId).attr('url')
  browser.sendToMain('render_message', {
    name: 'show addressbar',
    url: u
  })
}



var socialStatusBarT = null

function showInfo(msg, options) {

  if (browser.$is_full_screen) return

  options = Object.assign({
    class: 'bg-white black',
    timeout: 1000
  }, options)

  msg = msg || ''
  if (msg.length < 1) {
    return
  }

  clearTimeout(socialStatusBarT)
  let l = msg.length > 140 ? 140 : msg.length
  msg = msg.substring(0, l)
  socialStatusBar.innerHTML = `<div class="${options.class}">&ensp; ${msg} &emsp;</div>`
  socialStatusBarT = setTimeout(function () {
    socialStatusBar.innerHTML = ""
  }, options.timeout)
}


$(".social-close").click(() => {
  ExitSocialWindow()
})
$(".social-maxmize").click(() => {
  browser.sendToMain("message", "maxmize")
})
$(".social-minmize").click(() => {
  browser.sendToMain("message", "minmize")
})

socialTabsDom.addEventListener("activeTabChange", ({
  detail
}) => {


  currentTabId = detail.tabEl.id

  browser.ipcRenderer.send('show-view', {
    x: 0,
    y: 0,
    width: document.width,
    height: document.height,
    _id: currentTabId
  });


})

socialTabsDom.addEventListener("tabAdd", ({
  detail
}) => {
  currentTabId = detail.tabEl.id
  if (currentTabId && currentTabId != null && currentTabId.length > 0) {

    opendTabList.push({
      id: currentTabId
    })

    const $id = $("#" + currentTabId)
    browser.ipcRenderer.send('new-view', {
      x: window.screenLeft,
      y: window.screenTop + 70,
      width: document.width,
      height: document.height,
      _id: currentTabId,
      url: $id.attr('url'),
      "partition": $id.attr("partition"),
      "user_name": $id.attr("user_name")
    });


    if (!$id.attr('url') || $id.attr('url').like('*newTab')) {

      /*setTimeout(() => {
        sendToMain({
          name: 'show addressbar'
        })
      }, 250);*/

    }

  }
})

socialTabsDom.addEventListener("tabRemove", ({
  detail
}) => {
  currentTabId = detail.id;

  browser.ipcRenderer.send('close-view', {
    _id: detail.id
  });
})


function render_new_tab(op) {

  if (typeof op === 'string') {
    op = op.split('...').join('\\');
    op = {
      url: op
    }
  }

  if (op.url && !op.url.like('http*') && !op.url.like('browser*')) {
    op.url = 'http://' + op.url
  }

  op = Object.assign({
      url: "",
      title: "New Tab"
    },
    op
  )


  socialTabs.addTab({
    id: "tab_" + new Date().getTime(),
    url: op.url,
    title: op.title,
    partition: op.partition,
    user_name: op.user_name,
    favicon: "browser://images/loading-white.gif"
  })
}


function renderMessage(cm) {



  if (!cm) {
    return
  }

  if (cm.name == "open new tab") {
    render_new_tab(cm)
  } else if (cm.name == "set-setting") {
    for (let k of Object.keys(cm.var)) {
      browser.var[k] = cm.var[k]
      browser.setting[k] = cm.var[k]
      _setting_[k] = cm.var[k]
    }


  } else if (cm.name == "show setting") {
    render_new_tab({
      url: 'http://127.0.0.1:60080/setting'
    })
  } else if (cm.name == "download-url") {
    browser.sendToMain("download-url", cm.url)
  } else if (cm.name == "downloads") {
    showDownloads()
  } else if (cm.name == "escape") {
    is_addressbar_busy = false
  } else if (cm.name == "close tab") {
    closeCurrentTab()
  } else if (cm.name == "reload") {
    // let $window = ___.browser.electron.remote.getCurrentWindow()
  } else if (cm.name == "force reload") {

    // browser.remote.session.fromPartition(currentWebview.getAttribute('partition')).clearCache(function () {
    //   currentWebview.reload(true)
    // });

    // browser.remote.session.fromPartition(currentWebview.getAttribute('partition')).clearStorageData({
    //   origin: cm.origin,
    //   storages: '',
    //   quotas : ''
    // }, function () {
    //   currentWebview.reload(true)
    // })


  } else if (cm.name == "body_clicked") {
    document.querySelector('body').click()
  } else if (cm.name == "update-title") {

    if (cm.title) {
      $("#" + cm.tab_id + " .social-tab-title").text(cm.title)
      $("#" + cm.tab_id).attr('title', cm.title)
    }

  } else if (cm.name == "update-audio") {


    if (!cm.muted) {
      $('.Page-audio i').css('color', '#4caf50')
    } else {
      $('.Page-audio i').css('color', '#f44336')
    }

  } else if (cm.name == "update-buttons") {
    if (!cm.forward) {
      $('.go-forward i').css('color', '#9E9E9E')
    } else {
      $('.go-forward i').css('color', '#4caf50')
    }
    if (!cm.back) {
      $('.go-back i').css('color', '#9E9E9E')
    } else {
      $('.go-back i').css('color', '#4caf50')
    }

  } else if (cm.name == "update-url") {


    if (cm.tab_id && cm.url) {
      $("#" + cm.tab_id).attr('url', cm.url)
    }

    if (cm.tab_id && cm.tab_id == currentTabId && cm.url) {

      $('.address-input .http').css('display', 'none')
      $('.address-input .https').css('display', 'none')
      $('.address-input .file').css('display', 'none')
      $('.address-input .ftp').css('display', 'none')
      $('.address-input .browser').css('display', 'none')

      $('.address-input .https').html('')
      $('.address-input .http').html('')
      $('.address-input .file').html('')
      $('.address-input .ftp').html('')
      $('.address-input .browser').html('')

      if (cm.url.like('http://127.0.0.1:60080*')) {
        $('.address-input .protocol').html('')
        $('.address-input .url').html('')
      } else {
        let protocol = ''
        let url = ''



        if (cm.url.like('https*')) {
          protocol = 'https'
          $('.address-input .https').html(protocol)
          $('.address-input .https').css('display', 'inline-block')
        } else if (cm.url.like('http*')) {
          protocol = 'http'
          $('.address-input .http').html(protocol)
          $('.address-input .http').css('display', 'inline-block')
        } else if (cm.url.like('ftp*')) {
          protocol = 'ftp'
          $('.address-input .ftp').html(protocol)
          $('.address-input .ftp').css('display', 'inline-block')
        } else if (cm.url.like('file*')) {
          protocol = 'file'
          $('.address-input .file').html(protocol)
          $('.address-input .file').css('display', 'inline-block')
        } else if (cm.url.like('browser*')) {
          protocol = 'browser'
          $('.address-input .browser').html(protocol)
          $('.address-input .browser').css('display', 'inline-block')
        }

        if (protocol) {
          url = cm.url.replace(protocol + '://', '')
        } else {
          url = cm.url
        }

        $('.address-input .protocol').html(protocol)
        let w = document.querySelectorAll('.address-input')[0].clientWidth / 13
        if (url.length > w) {
          $('.address-input .url').html(url.substring(0, w) + ' ...')
        } else {
          $('.address-input .url').html(url)
        }


      }
    }

  } else if (cm.name == "update-favicon") {

    $("#" + cm.tab_id + " .social-tab-favicon").css(
      "background-image",
      "url(" + cm.icon + ")"
    )

  } else if (cm.name == "show-loading") {

    $("#" + cm.tab_id + " .social-tab-favicon").css(
      "background-image",
      "url(" + cm.icon + ")"
    )

  } else if (cm.name == "update-user_name") {

    $("#user_name").html(cm.user_name)

  } else if (cm.name == "mini_iframe") {
    playMiniIframe(cm)
  } else if (cm.name == "alert") {
    showMessage(cm.message, cm.time)
  } else if (cm.name == "mini_youtube") {
    playMiniYoutube(cm)
  } else if (cm.name == "new_trusted_window") {
    playTrustedWindow(cm)
  } else if (cm.name == "new_window") {
    playWindow(cm)
  } else if (cm.name == "mini_video") {
    playMiniVideo(cm)
  }

}

function playMiniVideo(cm) {
  return browser.ipcRenderer.send('new-video-window', cm)
}

function playMiniYoutube(cm) {
  return browser.ipcRenderer.send('new-youtube-window', cm)
}

function playTrustedWindow(cm) {
  return browser.ipcRenderer.send('new-trusted-window', cm);
}

function playWindow(cm) {
  return browser.ipcRenderer.send('new-window', cm);
}

function playMiniIframe(cm) {
  return browser.ipcRenderer.send('new-iframe-window', cm)
}


function closeCurrentTab() {
  socialTabs.removeTab(socialTabsDom.querySelector(".social-tab-current"))
}

function closeTab(id) {
  socialTabs.removeTab(socialTabsDom.querySelector('#' + id))
}

function ExitSocialWindow() {

  opendTabList.forEach((t, i) => {
    closeTab(t.id)
  })

  setTimeout(() => {
    browser.sendToMain("message", "exit")
  }, 250);

}



function showDownloads() {
  render_new_tab({
    url: 'http://127.0.0.1:60080/downloads'
  })
}



function init_tab() {

  if (!_setting_ || !_setting_.core.session) {
    setTimeout(() => {
      init_tab()
    }, 250)
    return
  }

  client.getData('browser://api/request_url', (data) => {
    render_new_tab({
      url: data.url,
      partition: _setting_.core.session.name,
      user_name: _setting_.core.session.display
    })
  }, (err) => {
    render_new_tab({
      url: _setting_.core.home_page,
      partition: _setting_.core.session.name,
      user_name: _setting_.core.session.display
    })
  })


}

init_tab()

window.addEventListener('resize', () => {
  let url = $("#" + currentTabId).attr('url')
  url = url.replace('https://', '').replace('http://', '')
  let w = document.querySelectorAll('.address-input')[0].clientWidth / 13
  if (url.length > w) {
    $('.address-input .url').html(url.substring(0, w) + ' ...')
  } else {
    $('.address-input .url').html(url)
  }
});