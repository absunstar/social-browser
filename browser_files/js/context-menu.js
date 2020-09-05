(function () {
    'use strict';

    var ___ = {}

    ___.electron = require('electron')
    ___.fs = require('fs')
    ___.url = require('url')
    ___.path = require('path')
    ___.md5 = require('md5')

    ___.callSync = function (channel, value) {
        return ___.electron.ipcRenderer.sendSync(channel, value)
    }
    ___.call = function (channel, value) {
        return ___.electron.ipcRenderer.send(channel, value)
    }
    ___.on = function (name, callback) {
        ___.electron.ipcRenderer.on(name, callback)
    }

    ___.files_dir = ___.callSync('get_browser', {
        name: 'files_dir'
    })

    require(___.files_dir + '/js/context-menu/init.js')(___)

    if (document.location.href.contains('127.0.0.1')) {
        ___.var = ___.callSync('get_var', {
            name: '*'
        })
    } else {
        ___.var = ___.callSync('get_var', {
            host : document.location.host,
            name: 'user_data,sites,youtube,facebook,javascript,context_menu,open_list,proxy_list,proxy,popup,core,login,vip,bookmarks,black_list,white_list,session_list,user_agent_list,blocking'
        })
    }

    ___.currentWindow = ___.electron.remote.getCurrentWindow()
    ___.var.session_list.sort((a, b) => (a.display > b.display) ? 1 : -1)

    
    require(___.files_dir + '/js/context-menu/fn.js')(___)
    require(___.files_dir + '/js/context-menu/finger_print.js')(___)
    require(___.files_dir + '/js/context-menu/custom.js')(___)
    require(___.files_dir + '/js/context-menu/adblock_hacking.js')(___)
    require(___.files_dir + '/js/context-menu/user_input.js')(___)
    require(___.files_dir + '/js/context-menu/user_data.js')(___)
    require(___.files_dir + '/js/context-menu/keyboard.js')(___);
    require(___.files_dir + '/js/context-menu/doms.js')(___)
    require(___.files_dir + '/js/context-menu/nodes.js')(___)
    require(___.files_dir + '/js/context-menu/videos.js')(___)
    require(___.files_dir + '/js/context-menu/youtube.js')(___)
    require(___.files_dir + '/js/context-menu/10khits.js')(___)
    require(___.files_dir + '/js/context-menu/addmefast.js')(___)
    require(___.files_dir + '/js/context-menu/youlikehits.js')(___)
    require(___.files_dir + '/js/context-menu/menu.js')(___)


    document.addEventListener("DOMNodeInserted", function (event) {
        // if ($$$ && !!window && !(!!window.jQuery)) {
        //     window.jQuery = require(___.browser.files_dir + '/js/jquery.js');
        // }
    })

    let $is_DOMContentLoaded = false
    document.addEventListener('DOMContentLoaded', () => {
        if ($is_DOMContentLoaded) {
            return
        }
        $is_DOMContentLoaded = true

        const xxx__browser = document.createElement('div');
        xxx__browser.id = 'xxx__browser';
        document.body.appendChild(xxx__browser);

        // const __video_element = document.createElement('video');
        // __video_element.id = '__video_element';
        // xxx__browser.appendChild(__video_element);


        const __alertBox = document.createElement('div');
        __alertBox.id = '__alertBox';
        xxx__browser.appendChild(__alertBox);

        const __targetUrl = document.createElement('div');
        __targetUrl.id = '__targetUrl';
        xxx__browser.appendChild(__targetUrl);

        const __blockDiv = document.createElement('div');
        __blockDiv.id = '__blockDiv';
        xxx__browser.appendChild(__blockDiv);

        const __bookmarkDiv = document.createElement('div');
        __bookmarkDiv.id = '__bookmarkDiv';
        xxx__browser.appendChild(__bookmarkDiv);

        const __downloads = document.createElement('div');
        __downloads.id = '__downloads';
        xxx__browser.appendChild(__downloads);

        const __find = document.createElement('div');
        __find.id = '__find';
        __find.innerHTML = ___.fs.readFileSync(___.files_dir + '/html/custom/find.html')
        xxx__browser.appendChild(__find);

        require(___.files_dir + '/js/context-menu/iframes.js')(___)
        require(___.files_dir + '/js/context-menu/safty.js')(___)

        if (___.var.facebook.enabled && document.location.href.toLowerCase().like('https://www.facebook.com*')) {
            require(___.files_dir + '/js/context-menu/facebook.com.js')(___)
        }


        if (___.var.blocking.privacy.show_bookmarks && document.querySelector('title') && document.querySelector('title').text == "Google") {
            window.__showBookmarks()
        }

    })


    // window.addEventListener("message", (e) => {
    //     console.log(e)
    // }, false);



    document.addEventListener('click', (e) => {
        ___.call('render_message', {
            name: 'body_clicked',
            win_id: ___.electron.remote.getCurrentWindow().id
        })
    })


    if (document.location.href.contains('127.0.0.1')) {
        window.___ = ___
    }


})()