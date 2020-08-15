(function () {
    'use strict';

    var $social_browser = {}
    $social_browser.browser = require('ibrowser')({
        is_render: true,
        is_window : true
    });

    $social_browser.browser.var.session_list.sort((a, b) => (a.display > b.display) ? 1 : -1)

    require($social_browser.browser.files_dir + '/js/context-menu/init.js')($social_browser)
    require($social_browser.browser.files_dir + '/js/context-menu/custom.js')($social_browser)
    require($social_browser.browser.files_dir + '/js/context-menu/fn.js')($social_browser)
    require($social_browser.browser.files_dir + '/js/context-menu/adblock_hacking.js')($social_browser)
    require($social_browser.browser.files_dir + '/js/context-menu/user_input.js')($social_browser)
    require($social_browser.browser.files_dir + '/js/context-menu/user_data.js')($social_browser)
    require($social_browser.browser.files_dir + '/js/context-menu/menu.js')($social_browser)
    require($social_browser.browser.files_dir + '/js/context-menu/keyboard.js')($social_browser);
    require($social_browser.browser.files_dir + '/js/context-menu/doms.js')($social_browser)
    require($social_browser.browser.files_dir + '/js/context-menu/nodes.js')($social_browser)


    document.addEventListener("DOMNodeInserted", function (event) {
        if ($$$ && !!window && !(!!window.jQuery)) {
            window.jQuery = require($$$.browser.files_dir + '/js/jquery.js');
        }
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

        const __video_element = document.createElement('video');
        __video_element.id = '__video_element';
        xxx__browser.appendChild(__video_element);


        const __alertBox = document.createElement('div');
        __alertBox.id = '__alertBox';
        xxx__browser.appendChild(__alertBox);

        const __targetUrl = document.createElement('div');
        __targetUrl.id = '__targetUrl';
        xxx__browser.appendChild(__targetUrl);

        const __blockDiv = document.createElement('div');
        __blockDiv.id = '__blockDiv';
        xxx__browser.appendChild(__blockDiv);

        const __downloads = document.createElement('div');
        __downloads.id = '__downloads';
        xxx__browser.appendChild(__downloads);

        require($social_browser.browser.files_dir + '/js/context-menu/iframes.js')($social_browser)
        require($social_browser.browser.files_dir + '/js/context-menu/safty.js')($social_browser)

        if ($social_browser.browser.var.youtube.enabled && document.location.href.toLowerCase().like('https://www.youtube.com*')) {

            require($social_browser.browser.files_dir + '/js/context-menu/youtube.com.js')($social_browser)
           // require($social_browser.browser.files_dir + '/overwrite/js/youtube_base.js')
        }

        if ($social_browser.browser.var.facebook.enabled && document.location.href.toLowerCase().like('https://www.facebook.com*')) {

            require($social_browser.browser.files_dir + '/js/context-menu/facebook.com.js')($social_browser)
        }


    })




    document.addEventListener('click', (e) => {
        $social_browser.browser.sendToMain('render_message', {
            name: 'body_clicked'
        })
    })


    window.$$$ = $social_browser

})()