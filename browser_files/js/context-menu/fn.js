 module.exports = function (___) {

    ___.sendMessage = function (cm) {
        ___.call('renderMessage', cm)
    }

    ___.__define = function(o, p, v) {
        if (typeof o == "undefined") {
            return
        }
        Object.defineProperty(o, p, {
            get: function () {
                return v
            }
        })
        if (o.prototype) {
            o.prototype[p] = v
        }
    }


     ___.isValidURL = function(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }

     ___.handle_url = function(u) {
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


     ___.__numberRange = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
     if (___.var.blocking.javascript.block_eval) {
         window.eval = function (code) {
             // console.log(code)
         }
     }

     if (___.var.blocking.javascript.block_console_output) {
         window.console.log = function () {}
         window.console.error = function () {}
         window.console.dir = function () {}
         window.console.dirxml = function () {}
         window.console.info = function () {}
         window.console.warn = function () {}
         window.console.table = function () {}
         window.console.trace = function () {}
         window.console.debug = function () {}
         window.console.assert = function () {}
         window.console.clear = function () {}
     }

     ___.upTo = function (el, tagName) {
         tagName = tagName.toLowerCase().split(',');

         while (el && el.parentNode) {
             el = el.parentNode;
             if (el.tagName && tagName.includes(el.tagName.toLowerCase())) {
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

    

     let translate_busy = false
     ___.translate = function (text, callback) {
         callback = callback || function (trans) {
             console.log(trans)
         }
         if (text.test(/^[a-zA-Z\-\u0590-\u05FF\0-9\^\@\_\:\?\;\!\[\]\~\<\>\{\}\|\\ ]+$/gim)) {
             callback(text)
             return
         }
         if (!text) {
             callback(text)
             return
         }
         if (translate_busy) {
             setTimeout(() => {
                 ___.translate(text, callback)
             }, 250);
             return
         }
         translate_busy = true
         fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&dt=bd&dj=1&q=${text}`).then(response => {
             return response.json()
         }).then(data => {
            translate_busy = false
             translated_text = ''
             if (data && data.sentences && data.sentences.length > 0) {
                 data.sentences.forEach(t => {
                     translated_text += t.trans
                 })
                 callback(translated_text || text)
             }
         }).catch(err=>{
            translate_busy = false
            callback(text)
         })
     }

     window.__md5 = function(txt){
         return ___.md5(txt)
     }

     window.__img_to_base64 = function(selector){
        let c = document.createElement('canvas');
        let img = null;
        if(typeof selector == "string"){
             img = document.querySelector(selector);
        }else{
             img = selector;
        }
       
        if(!img){
            return ''
        }
        c.height = img.naturalHeight;
        c.width = img.naturalWidth;
        let ctx = c.getContext('2d');
        
        ctx.drawImage(img, 0, 0, c.width, c.height);
        return c.toDataURL();
     }

     window.__img_code = function(selector){
         return window.__md5(window.__img_to_base64(selector))
     }

     let alert_idle = null
     window.alert = window.prompt = function (msg, time) {
         if (msg && msg.trim()) {
             let div = document.querySelector('#__alertBox')
             if (div) {
                 clearTimeout(alert_idle)
                 div.innerHTML = msg;
                 div.style.display = "block";
                 alert_idle = setTimeout(() => {
                     div.style.display = "none";
                     div.innerHTML = '';
                 }, time || 1000 * 3);
             }
         }
     }


     window.__showBookmarks = function () {

         let div = document.querySelector('#__bookmarkDiv')
         if (div) {
             ___.var.bookmarks.forEach(b => {
                 b.image = b.image || ___.electron.remote.nativeImage.createFromPath(b.favicon).resize({
                     width: 16,
                     height: 16
                 }).toDataURL()

                 div.innerHTML += `
                    <a class="bookmark" href="${b.url}" target="_blank">
                        <p class="title"> ${b.title} </p>
                    </a>
                    `
             })
             div.style.display = "block";
         }

     }

     window.__blockPage = window.prompt = function (block, msg, close) {
         let div = document.querySelector('#__blockDiv')
         if (div && block) {
             div.style.display = "block";
             div.innerHTML = msg || 'This Page Blocked';
             if (close) {
                 setTimeout(() => {
                     window.close()
                 }, 1000 * 3);

             }
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
             __downloads.style.display = "block";
             __downloads.innerHTML = msg;
         } else {
             __downloads.style.display = "none";
             __downloads.innerHTML = "";
         }
     }

     ___.on('render_message', (event, data) => {
         if (data.name == "update-target-url") {
             showInfo(data.url)
         } else if (data.name == "show-info") {
             showInfo(data.msg)
         }
     })

     ___.on('user_downloads', (event, data) => {
         showDownloads(data.message, data.class)
     })





     window.open = function (url, _name, _specs, _replace_in_history) {

        let opener = {
            closed: false ,
            opener : window ,
            postMessage : () => {console.log('postMessage opener')},
            eval : () => {console.log('eval opener')},
            close : ()=>{
                console.log('close opener')
            },
            focus : ()=>{
                console.log('focus opener')
            }
        }

        if(___.var.blocking.javascript.block_window_open){
            return opener
        }

         if (typeof url !== "string") {
             return opener
         }
         if(url == "about:blank"){
             return opener
         }
         url =  ___.handle_url(url)



         if (url.like('https://www.youtube.com/watch*')) {
             ___.sendToMain('new-youtube-window', {
                 referrer: document.location.href,
                 url: url
             })

             return opener
         }

         let url_p = ___.url.parse(url)
         let url2_p = ___.url.parse(this.document.location.href)

         let allow = false

         if (url_p.host === url2_p.host && ___.var.blocking.popup.allow_internal) {
             allow = true
         } else if (url_p.host !== url2_p.host && ___.var.blocking.popup.allow_external) {
             allow = true
         } else {
             ___.var.blocking.popup.white_list.forEach(d => {
                 if (url_p.host.like(d.url) || url2_p.host.like(d.url)) {
                     allow = true
                 }
             })

         }

         if (!allow) {
             // console.log('Block popup : ' + url)
             return opener
         }

         if (!_specs) {
             ___.sendToMain('render_message', {
                 name: 'open new tab',
                 referrer: document.location.href,
                 url: url,
                 source : 'window.open'
             })

             return null
         }

        

         let win = new ___.remote.BrowserWindow({
             show: true,
             alwaysOnTop: true,
             width: _specs.width || 800,
             height: _specs.height || 600,
             x: _specs.x || 200,
             y: _specs.y || 200,
             backgroundColor: '#ffffff',
             frame: true,
             icon: ___.path.join(___.files_dir, "images", "logo.ico"),
             webPreferences: {
                 session: ___.remote.getCurrentWebContents().session,
                 sandbox: false,
                 preload: ___.files_dir + '/js/context-menu.js',
                 nativeWindowOpen: false,
                 webSecurity: false,
                 guestInstanceId: 1,
                 openerId: ___.remote.getCurrentWebContents().id,
                 allowRunningInsecureContent: true,
                 plugins: false,
             }
         })

         win.setMenuBarVisibility(false)
         win.loadURL(url, {
             referrer: document.location.href
         })


         opener.postMessage = function (message, targetOrigin) {
             return win.webContents.postMessage(message, targetOrigin)
         }
         win.webContents.once('dom-ready', () => {

             let css = ___.fs.readFileSync(___.files_dir + '/css/inject.css')
             win.webContents.insertCSS(css)

             opener.eval = function (code, userGesture = true) {
                 win.webContents.executeJavaScript(code, userGesture).then((result) => {
                     console.log(result)
                 }).catch(err => {
                     console.error(err)
                 })
             }

         })

         opener.close = function () {
             return win.close()
         }
         // opener.document
         win.on('close', (e) => {
             opener.postMessage = () => {}
             opener.eval = () => {}
             opener.closed = true
         })

         return opener
     }

 }