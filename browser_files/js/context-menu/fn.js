 module.exports = function (___) {

     if (___.browser.var.javascript.remove_eval) {
         window.eval = function (code) {
            // console.log(code)
         }
     }

     if (___.browser.var.javascript.remove_console_log) {
        // window.console.log = function () {}
     }

     ___.upTo = function (el, tagName) {
         tagName = tagName.toLowerCase();

         while (el && el.parentNode) {
             el = el.parentNode;
             if (el.tagName && el.tagName.toLowerCase() == tagName) {
                 return el;
             }
         }
         return null;
     }

     ___.getAllSelectors = function () {
         var ret = [];
         for (var i = 0; i < document.styleSheets.length; i++) {
             var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
             for (var x in rules) {
                 if (typeof rules[x].selectorText == 'string') ret.push(rules[x].selectorText);
             }
         }
         return ret;
     }


     ___.selectorExists = function (selector) {
         var selectors = ___.getAllSelectors();
         for (var i = 0; i < selectors.length; i++) {
             if (selectors[i] == selector) return true;
         }
         return false;
     }

     ___.browser.electron.ipcRenderer.on('webview_message', (event) => {
        // console.log(event)
     })

     ___.sendMessage = function (cm) {
         ___.browser.sendToMain('renderMessage', cm)
     }


     window.alert = window.prompt = function (msg, time) {
         if (msg && msg.trim()) {
             let div = document.querySelector('#__alertBox')
             if (div) {
                 div.style.display = "block";
                 div.innerHTML = msg;
                 setTimeout(() => {
                     div.innerHTML = '';
                     div.style.display = "none";
                 }, time | 1000 * 3);
             }
         }
     }
     window.__showBookmarks = function () {
        
            let div = document.querySelector('#__bookmarkDiv')
            if (div) {
                ___.browser.var.bookmarks.forEach(b=>{
                    b.image = b.image || ___.browser.electron.remote.nativeImage.createFromPath(b.favicon).resize({width : 16 , height : 16}).toDataURL()
                    div.innerHTML +=`
                    <a class="bookmark" href="${b.url}" target="_blank">
                        <img src="${b.image}" onerror="this.src=null"/>
                        <p class="title"> ${b.title} </p>
                    </a>
                    `
                })
                div.style.display = "block";
            }
        
    }
     window.__blockPage = window.prompt = function (block , msg) {
         let div = document.querySelector('#__blockDiv')
         if (div && block) {
             div.style.display = "block";
             div.innerHTML = msg || 'Block Page [ Contains Unsafe Words ] , <small> <a target="_blank" href="http://127.0.0.1:60080/setting?open=safty"> goto setting </a></small>';
         } else if (div && !block) {
             div.style.display = "none";
         }
     }

     var showinfoTimeout = null
     window.showInfo = function (msg, time) {
         clearTimeout(showinfoTimeout)
         let div = document.querySelector('#__targetUrl')
         if (msg && msg.trim()) {
             let length = window.innerWidth / 8
             if (msg.length > length) {
                 msg = msg.substring(0, length) + '... '
             }

             if (div) {
                 div.style.display = "block";
                 div.innerHTML = msg;
                 showinfoTimeout = setTimeout(() => {
                     div.innerHTML = '';
                     div.style.display = "none";
                 }, time | 1000 * 3);
             }
         } else {
             if (div) {
                 div.style.display = "none";
             }
         }
     }

     let __downloads = document.querySelector('#__downloads')
     window.showDownloads = function (msg, css) {

         if (!__downloads) {
             __downloads = document.querySelector('#__downloads')
             __downloads.addEventListener('click', () => {
                 __downloads.style.display = "none";
                 __downloads.innerHTML = "";
             })
         }
         if (msg) {
             /*msg += " <strong> X <strong>"*/
             /*__downloads.className = css*/
             __downloads.style.display = "block";
             __downloads.innerHTML = msg;
         } else {
             __downloads.style.display = "none";
             __downloads.innerHTML = "";
         }
     }

     ___.browser.electron.ipcRenderer.on('render_message', (event, data) => {
         if (data.name == "update-target-url") {
             showInfo(data.url)
         } else if (data.name == "show-info") {
             showInfo(data.msg)
         }
     })

     ___.browser.electron.ipcRenderer.on('user_downloads', (event, data) => {
         showDownloads(data.message, data.class)
     })


     function handle_url(u) {
         if (typeof u !== "string") {
             return u
         }
         u = u.trim()
         if (u.like('http*') || u.indexOf('//') === 0) {
             u = u
         } else if (u.indexOf('/') === 0) {
             u = window.location.origin + u
         } else if (u.split('?')[0].split('.').length < 3) {
             let page = window.location.pathname.split('/').pop()
             u = window.location.origin + window.location.pathname.replace(page, "") + u
         }
         return u
     }


     window.open = function (url, frameName, features) {

        return

        
         if (typeof url !== "string") {
             return null
         }
         url = handle_url(url)

         if (url.like('https://www.youtube.com/watch*')) {
             ___.browser.sendToMain('new-youtube-window', {
                 referrer: document.location.href,
                 url: url
             })

             return null
         }

         let url_p = ___.browser.url.parse(url)
         let url2_p = ___.browser.url.parse(this.document.location.href)

         let allow = false

         if (url_p.host === url2_p.host && ___.browser.var.popup.internal) {
             allow = true
         } else if (url_p.host !== url2_p.host && ___.browser.var.popup.external) {
             allow = true
         } else {
             ___.browser.var.popup.ignore_urls.forEach(d => {
                 if (url_p.host.like(d.url) || url2_p.host.like(d.url)) {
                     allow = true
                 }
             })

         }

         if (!allow) {
             // console.log('Block popup : ' + url)
             return null
         }

         if (!features) {
             ___.browser.sendToMain('render_message', {
                 name: 'open new tab',
                 referrer: document.location.href,
                 url: url
             })

             return null
         }

         let win = new ___.browser.remote.BrowserWindow({
             show: true,
             alwaysOnTop: true,
             width: features.width || 800,
             height: features.height || 600,
             x: features.x || 200,
             y: features.y || 200,
             backgroundColor: '#ffffff',
             frame: true,
             icon: ___.browser.path.join(___.browser.files_dir, "images", "logo.ico"),
             webPreferences: {
                 session: ___.browser.remote.getCurrentWebContents().session,
                 sandbox: false,
                 preload: ___.browser.files_dir + '/js/context-menu.js',
                 nativeWindowOpen: false,
                 webSecurity: false,
                 guestInstanceId: 1,
                 openerId: ___.browser.remote.getCurrentWebContents().id,
                 allowRunningInsecureContent: true,
                 plugins: false,
             }
         })

         win.setMenuBarVisibility(false)
         win.loadURL(url, {
             referrer: document.location.href
         })

         win.js = win.webContents.executeJavaScript

         win.document = {
             querySelector: function (selector) {
                 win.js(`;(function () { return document.querySelector('${selector}'); })()`, (result) => {
                     console.log(result)
                 })
             },
             open: function () {
                 win.js(`document.open()`)
             },
             write: function (code) {
                 win.js(`document.write('${code}')`)
             },
             close: function () {
                 win.js('document.close()')
             },
             print: function () {
                 win.js('window.print()')
             }
         }

         window.opener = win
         return win
     }

 }