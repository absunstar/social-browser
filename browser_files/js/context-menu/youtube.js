module.exports = function (___) {

    // console.log('youtube context menu loading ...')
    if (!document.location.href.toLowerCase().like('https://www.youtube.com*')) {
        return
    }

    
    function pause_current_youtube_video() {

        let els = document.querySelectorAll('video')
        els.forEach(v => {
            if (v && v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2) {
                v.pause()
                v.classList.add("__block_eye");
                alert('<b> Stop Playing Youtube Video [ Unsafe words Detected ] </b>  <small><i> Changing Form Setting </i></small>', 1000 * 10)
            }
        })
    }

    function check_if_current_video_un_safe() {

        if (!___.var.blocking.youtube.allow_safty_mode || !document.location.href.toLowerCase().like('*youtube.com*watch*')) {
            return
        }

        ___.var.blocking.youtube.safty_mode.words_list = ___.var.blocking.youtube.safty_mode.words_list || []
        ___.var.blocking.youtube.safty_mode.selector_list = ___.var.blocking.youtube.safty_mode.selector_list || [];

        ___.var.blocking.youtube.safty_mode.selector_list.forEach(s => {
            if (document.querySelectorAll(s).length > 0) {
                pause_current_youtube_video()
            }
        })

        let txt = ''
        txt += document.querySelector('title') ? document.querySelector('title').innerText : ''
        // txt += document.querySelector('#content') ? document.querySelector('#content').innerText : ''
        txt += document.querySelector('ytd-video-secondary-info-renderer') ? document.querySelector('ytd-video-secondary-info-renderer').innerText : ''

        if (txt) {
            ___.translate(txt, (txt2) => {
                ___.var.blocking.youtube.safty_mode.words_list.forEach(w => {
                    if (txt.toLowerCase().contains(w.text)) {
                        pause_current_youtube_video()
                    }
                })
            })
        }
    }


    function skipYoutubeVideoAds() {

        let classes = '.video-masthead-v2,#watch7-sidebar-ads,#masthead-ad ,ytd-compact-promoted-video-renderer,ytd-action-companion-ad-renderer,ytd-popup-container'
        let a = document.querySelector('.video-ads')
        if (a) {
            a.remove()
        }

        let a2 = document.querySelector('.video-masthead-iframe')
        if (a2) {
            a2.remove()
        }

        // if (document.querySelector('.ad-interrupting .ytp-play-progress.ytp-swatch-background-color')) {
        //     let v = document.querySelector('video')
        //     if (v && !v.ended && v.readyState > 2) {
        //         alert('<b> Auto Skiping Ad </b>  <small><i> Changing Form Setting </i></small>', 5000)
        //         try {
        //             v.currentTime = parseFloat(v.duration)
        //         } catch {
        //             // console.log(v)
        //         }

        //     }
        // }

        setTimeout(() => {
            skipYoutubeVideoAds()
        }, 1000 * 3)


    }

    function block_links(el) {
        el.removeAttribute('href')
        el.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            alert(`Blocked video [ Children safty mode]`)
        })

        el.querySelectorAll('*').forEach(a => {
            a.removeAttribute('href')
            if (a.tagName == "IMG") {
                a.classList.add("__block_eye");
            }
            if (a.id.contains('overlay')) {
                a.remove()
                return
            }
            a.addEventListener('click', (e) => {
                e.stopPropagation()
                e.preventDefault()
                alert(`Blocked video [ Children safty mode]`)
            })
        })
    }


    let target_list = 'ytd-video-renderer,ytd-grid-video-renderer,ytd-channel-renderer,ytd-playlist-renderer,ytd-compact-video-renderer'


    function check_target(el) {

        setTimeout(() => {
            let txt = el.innerText
            if (txt) {
                ___.var.blocking.youtube.safty_mode.words_list.forEach(w => {
                    if (txt.contains(w.text)) {
                        let p = ___.upTo(el, target_list)
                        if (p) {
                            block_links(p)
                        }
                    }
                })
            }
        }, 1000);

    }

    if (___.var.blocking.youtube.allow_safty_mode && document.location.href.toLowerCase().like('*youtube.com*')) {

        check_if_current_video_un_safe()

        window.addEventListener('DOMNodeInsertedIntoDocument', (e) => {
            check_target(e.target)
        }, false);
        window.addEventListener('DOMNodeInserted', (e) => {
            check_target(e.target)
        }, false);
    }

    if (___.var.blocking.youtube.skip_ads && document.location.href.toLowerCase().like('*youtube.com*')) {
        skipYoutubeVideoAds()
    }

    window.addEventListener('load', () => {
        let titleEl = window.document.querySelector('title')

        document.documentElement.addEventListener("DOMSubtreeModified", function (evt) {
            var t = evt.target;
            if (t === titleEl || (t.parentNode && t.parentNode === titleEl)) {
                document.querySelectorAll('video').forEach(v => {
                    v.classList.remove("__block_eye");
                })
                check_if_current_video_un_safe()
            }
        }, false);


        let parentWindow = window.parent;
        if (parentWindow !== window) {
            if (titleEl) {
                ___.currentWindow.setTitle(titleEl.innerText)
            }
        }
    })


}